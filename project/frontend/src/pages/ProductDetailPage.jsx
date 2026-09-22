import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { CompareContext } from '../context/CompareContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCompare, isInCompare } = useContext(CompareContext);

  useEffect(() => {
    getProduct(id).then(data => {
      setProduct(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', gap: '3rem' }}>
        <div style={{ flex: 1, textAlign: 'center', background: '#f5f5f5', padding: '2rem', borderRadius: '8px' }}>
          {product.image_url ? <img src={product.image_url} alt={product.name} style={{ maxWidth: '100%' }} /> : <span style={{ fontSize: '8rem' }}>🧊</span>}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: '0.5rem' }}>{product.name}</h1>
          <div style={{ color: '#666', marginBottom: '1rem' }}>Brand: {product.brand} | Model: {product.model_number}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <StarRating rating={product.average_rating || 0} size="large" />
            <span>({product.review_count || 0} reviews)</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a237e', marginBottom: '2rem' }}>
            ₹{Number(product.price).toLocaleString('en-IN')}
          </div>
          <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>{product.description}</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Add to Wishlist</button>
            <button className="btn-primary" onClick={() => addToCompare(product)} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              {isInCompare(product.id) ? 'In Compare List' : 'Add to Compare'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
