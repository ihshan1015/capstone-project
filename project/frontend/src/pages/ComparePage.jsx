import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CompareContext } from '../context/CompareContext';
import StarRating from '../components/StarRating';

const ComparePage = () => {
  const { compareList, removeFromCompare, clearCompare } = useContext(CompareContext);

  if (compareList.length < 2) {
    return (
      <div className="card text-center" style={{ padding: '4rem 2rem' }}>
        <h2 className="mb-2">Compare Products</h2>
        <p className="mb-3">Please add at least 2 products to compare them.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between align-center mb-3">
        <h2>Product Comparison</h2>
        <button onClick={clearCompare} className="btn-secondary">Clear All</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              {compareList.map(p => (
                <th key={p.id} style={{ minWidth: '200px', textAlign: 'center' }}>
                  <div className="mb-2">{p.name}</div>
                  <button onClick={() => removeFromCompare(p.id)} style={{ color: 'red' }}>Remove</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Price</strong></td>
              {compareList.map(p => <td key={p.id} className="text-center">₹{Number(p.price).toLocaleString('en-IN')}</td>)}
            </tr>
            <tr>
              <td><strong>Brand</strong></td>
              {compareList.map(p => <td key={p.id} className="text-center">{p.brand}</td>)}
            </tr>
            <tr>
              <td><strong>Rating</strong></td>
              {compareList.map(p => <td key={p.id} className="text-center"><StarRating rating={p.rating||0} /></td>)}
            </tr>
            <tr>
              <td><strong>Energy Rating</strong></td>
              {compareList.map(p => <td key={p.id} className="text-center">{p.energy_rating ? `${p.energy_rating} Star` : 'N/A'}</td>)}
            </tr>
            <tr>
              <td><strong>Capacity</strong></td>
              {compareList.map(p => <td key={p.id} className="text-center">{p.capacity || 'N/A'}</td>)}
            </tr>
            <tr>
              <td><strong>Warranty</strong></td>
              {compareList.map(p => <td key={p.id} className="text-center">{p.warranty_years ? `${p.warranty_years} Years` : 'N/A'}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparePage;
