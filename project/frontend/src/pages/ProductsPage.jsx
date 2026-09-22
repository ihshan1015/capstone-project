import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setLoading(true);
    getProducts(filters).then(data => {
      console.log("PRODUCT DATA:", data);
      setProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filters]);

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div style={{ width: '250px', flexShrink: 0 }}>
        <ProductFilters onFilterChange={setFilters} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="flex justify-between align-center mb-3">
          <h2>Products ({products.length})</h2>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {products.map(product => <ProductCard key={product.id} product={product} />)}
            {products.length === 0 && <p>No products found.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
