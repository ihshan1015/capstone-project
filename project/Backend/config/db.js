const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'home_appliance_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

let useSqlite = false;
let sqliteDb = null;
let sqliteReadyPromise = null;

async function initSqlite() {
  const dbPath = path.join(__dirname, '..', '..', 'database', 'home_appliance.sqlite');
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');

  sqliteDb = new sqlite3.Database(dbPath);

  const checkTableExists = () => {
    return new Promise((resolve) => {
      sqliteDb.get(
        "SELECT count(*) as cnt FROM sqlite_master WHERE type='table' AND name='products'",
        (err, row) => {
          if (err || !row || row.cnt === 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      );
    });
  };

  const hasTables = await checkTableExists();

  if (!hasTables) {
    console.log('Initializing local SQLite database with schema and seed data...');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    const prepareSqliteSql = (sqlStr) => {
      return sqlStr
        .replace(/^--.*$/gm, '')
        .replace(/CREATE DATABASE IF NOT EXISTS[^;]+;/gi, '')
        .replace(/USE [^;]+;/gi, '')
        .replace(/SET FOREIGN_KEY_CHECKS\s*=\s*[01];/gi, '')
        .replace(/INT PRIMARY KEY AUTO_INCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
        .replace(/ENUM\([^)]+\)/gi, 'TEXT')
        .replace(/LONGTEXT/gi, 'TEXT')
        .replace(/DECIMAL\([^)]+\)/gi, 'NUMERIC')
        .replace(/ON UPDATE CURRENT_TIMESTAMP/gi, '')
        .replace(/UNIQUE KEY [^\s(]+\s*\(([^)]+)\)/gi, 'UNIQUE($1)')
        .replace(/,\s*FOREIGN KEY \([^)]+\) REFERENCES [^\n,);]+/gi, '')
        .replace(/FOREIGN KEY \([^)]+\) REFERENCES [^\n,);]+/gi, '')
        .replace(/,\s*\)/g, '\n)');
    };

    const runStatements = (rawSql) => {
      const sqlText = prepareSqliteSql(rawSql);

      const statements = sqlText
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      return new Promise((resolve, reject) => {
        sqliteDb.serialize(() => {
          for (const stmt of statements) {
            sqliteDb.run(stmt, (err) => {
              if (err && !err.message.includes('already exists')) {
                console.log(
                  'SQLite init stmt error:',
                  err.message,
                  '| Statement:',
                  stmt.substring(0, 100)
                );
              }
            });
          }

          sqliteDb.run('SELECT 1', (err) => {
            if (err) {
              reject(err);
              return;
            }

            resolve();
          });
        });
      });
    };

    await runStatements(schemaSql);
    await runStatements(seedSql);

    console.log('SQLite database initialized successfully.');
  }
}

function ensureSqliteInit() {
  if (!sqliteReadyPromise) {
    sqliteReadyPromise = initSqlite();
  }

  return sqliteReadyPromise;
}

(async () => {
  try {
    const connection = await mysqlPool.getConnection();
    connection.release();

    console.log('Database connected: MySQL');
  } catch (err) {
    console.log('MySQL connection failed. Falling back to local SQLite database.');

    useSqlite = true;

    await ensureSqliteInit();
  }
})();

const poolWrapper = {
  async query(sql, params = []) {
    if (!useSqlite) {
      try {
        return await mysqlPool.query(sql, params);
      } catch (err) {
        if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
          console.log('Switching to local SQLite due to MySQL connection error.');

          useSqlite = true;

          await ensureSqliteInit();

          return this.querySqlite(sql, params);
        }

        throw err;
      }
    } else {
      await ensureSqliteInit();

      return this.querySqlite(sql, params);
    }
  },

  querySqlite(sql, params = []) {
    return new Promise((resolve, reject) => {
      let formattedSql = sql;
      let formattedParams = [...params];

      formattedSql = formattedSql.replace(
        /INSERT IGNORE INTO/gi,
        'INSERT OR IGNORE INTO'
      );

      if (
        formattedParams.length === 1 &&
        Array.isArray(formattedParams[0])
      ) {
        const rows = formattedParams[0];

        if (
          Array.isArray(rows) &&
          rows.length > 0 &&
          Array.isArray(rows[0])
        ) {
          const rowPlaceholders = rows
            .map(row => '(' + row.map(() => '?').join(', ') + ')')
            .join(', ');

          formattedSql = formattedSql.replace(
            'VALUES ?',
            'VALUES ' + rowPlaceholders
          );

          formattedParams = rows.flat();
        }
      }

      const isSelect = /^\s*(SELECT|PRAGMA|EXPLAIN)/i.test(formattedSql);

      if (isSelect) {
        sqliteDb.all(
          formattedSql,
          formattedParams,
          (err, rows) => {
            if (err) {
              reject(err);
              return;
            }

            resolve([rows || [], []]);
          }
        );
      } else {
        sqliteDb.run(
          formattedSql,
          formattedParams,
          function (err) {
            if (err) {
              reject(err);
              return;
            }

            resolve([
              {
                insertId: this.lastID,
                affectedRows: this.changes
              },
              []
            ]);
          }
        );
      }
    });
  }
};

module.exports = poolWrapper;