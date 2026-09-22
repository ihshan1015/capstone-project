import { Link } from 'react-router-dom';

const AdminDashboard = () => (
  <div>
    <h2>Admin Dashboard</h2>
    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
      <Link to="/admin/products" className="card" style={{ flex: 1, padding: '2rem', textAlign: 'center' }}>Manage Products</Link>
      <Link to="/admin/categories" className="card" style={{ flex: 1, padding: '2rem', textAlign: 'center' }}>Manage Categories</Link>
      <Link to="/admin/users" className="card" style={{ flex: 1, padding: '2rem', textAlign: 'center' }}>Manage Users</Link>
    </div>
  </div>
);
export default AdminDashboard;
