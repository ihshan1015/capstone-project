import { useState, useEffect } from 'react';
import { getCategories } from '../services/categoryService';

const ProductFilters = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
  });

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    const reset = { category: '', minPrice: '', maxPrice: '', sort: '' };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="card">
      <h3>Filters</h3>
      
      <div className="mt-2">
        <label>Category</label>
        <select name="category" value={filters.category} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-2">
        <label>Price Range</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
          <input type="number" name="minPrice" placeholder="Min" value={filters.minPrice} onChange={handleChange} style={{ width: '50%', padding: '0.5rem' }} />
          <input type="number" name="maxPrice" placeholder="Max" value={filters.maxPrice} onChange={handleChange} style={{ width: '50%', padding: '0.5rem' }} />
        </div>
      </div>

      <div className="mt-2">
        <label>Sort By</label>
        <select name="sort" value={filters.sort} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Highest Rated</option>
        </select>
      </div>

      <div className="mt-3 flex" style={{ gap: '0.5rem' }}>
        <button onClick={applyFilters} className="btn-primary" style={{ flex: 1 }}>Apply</button>
        <button onClick={resetFilters} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}>Reset</button>
      </div>
    </div>
  );
};

export default ProductFilters;
