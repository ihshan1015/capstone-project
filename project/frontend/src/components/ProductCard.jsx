import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CompareContext } from '../context/CompareContext';
import { FaHeart, FaCheck } from 'react-icons/fa';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  const { addToCompare, isInCompare } = useContext(CompareContext);
  
  const inCompare = isInCompare(product.id);

  return (
    <div className="card product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
        ) : (
          <span style={{ fontSize: '4rem' }}>🧊</span>
        )}
      </div>
      
      <div style={{ flex: 1 }}>
        <span style={{ background: '#e0e0e0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
          {product.brand}
        </span>
        <h3 style={{ marginTop: '0.5rem', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{product.name}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <StarRating rating={product.average_rating || 0} size="small" />
          <span style={{ fontSize: '0.9rem', color: '#666' }}>({product.review_count || 0})</span>
        </div>

        {product.energy_rating && (
          <div style={{ fontSize: '0.9rem', color: '#4caf50', marginBottom: '0.5rem' }}>
            {product.energy_rating} Star Energy Rating
          </div>
        )}
        
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a237e', marginBottom: '1rem' }}>
          ₹{Number(product.price).toLocaleString('en-IN')}
          {product.discount_percentage > 0 && (
            <span style={{ fontSize: '0.9rem', color: 'red', marginLeft: '0.5rem' }}>
              -{product.discount_percentage}%
            </span>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <Link to={`/products/${product.id}`} className="btn-primary" style={{ flex: 1, textAlign: 'center' }}>
          View Details
        </Link>
        <button 
          onClick={() => addToCompare(product)}
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: inCompare ? '#e8f5e9' : 'white' }}
          title="Add to Compare"
        >
          {inCompare ? <FaCheck color="green" /> : '⚖️'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
