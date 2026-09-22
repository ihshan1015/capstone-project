import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CompareContext } from '../context/CompareContext';
import './CompareBar.css';

const CompareBar = () => {
  const { compareList, clearCompare, removeFromCompare } = useContext(CompareContext);

  if (compareList.length === 0) return null;

  return (
    <div className="compare-bar">
      <div className="compare-container">
        <div className="compare-text">
          Comparing {compareList.length} products
        </div>
        <div className="compare-items">
          {compareList.map(item => (
            <div key={item.id} className="compare-item">
              <span className="compare-name">{item.name}</span>
              <button onClick={() => removeFromCompare(item.id)} className="remove-btn">x</button>
            </div>
          ))}
        </div>
        <div className="compare-actions">
          <Link to="/compare" className="btn-secondary">Compare Now</Link>
          <button onClick={clearCompare} className="btn-clear">Clear All</button>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
