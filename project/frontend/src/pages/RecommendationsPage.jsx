import { useState, useEffect } from 'react';
import { getRecommendations } from '../services/recommendationService';
import { getCategories } from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const RecommendationsPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    budget: '',
    capacity: '',
    brand: '',
    minRating: '',
    energyRating: '',
    features: []
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    getCategories().then(data => setCategories(data.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const removeFeature = (feat) => {
    setFormData({ ...formData, features: formData.features.filter(f => f !== feat) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) return toast.error('Please select a category');
    setLoading(true);
    setSubmitted(true);
    try {
      const payload = {
        categoryId: Number(formData.categoryId),
        budget: formData.budget ? Number(formData.budget) : null,
        capacity: formData.capacity || null,
        brand: formData.brand || null,
        minRating: formData.minRating ? Number(formData.minRating) : null,
        energyRating: formData.energyRating ? Number(formData.energyRating) : null,
        features: formData.features
      };
      const res = await getRecommendations(payload);
      setResults(res.data || []);
      if ((res.data || []).length === 0) toast.info('No products matched your criteria. Try relaxing some filters.');
    } catch (err) {
      toast.error('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', marginTop: '0.5rem',
    border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem'
  };

  return (
    <div>
      <h2 style={{ marginBottom: '0.5rem', color: '#1a237e' }}>🎯 Product Recommendation Engine</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Tell us your requirements and we'll find the best appliances for you.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Form */}
        <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1a237e' }}>Your Requirements</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label style={{ fontWeight: '600' }}>Appliance Category *</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} required style={inputStyle}>
                <option value="">-- Select Category --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label style={{ fontWeight: '600' }}>Budget (₹)</label>
              <input type="number" name="budget" value={formData.budget} onChange={handleChange}
                placeholder="e.g. 30000" style={inputStyle} min="0" />
            </div>

            <div className="mb-2">
              <label style={{ fontWeight: '600' }}>Required Capacity</label>
              <input type="text" name="capacity" value={formData.capacity} onChange={handleChange}
                placeholder="e.g. 250L, 1.5 Ton, 7kg" style={inputStyle} />
            </div>

            <div className="mb-2">
              <label style={{ fontWeight: '600' }}>Preferred Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange}
                placeholder="e.g. Samsung, LG, Whirlpool" style={inputStyle} />
            </div>

            <div className="mb-2">
              <label style={{ fontWeight: '600' }}>Minimum Rating</label>
              <select name="minRating" value={formData.minRating} onChange={handleChange} style={inputStyle}>
                <option value="">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <div className="mb-2">
              <label style={{ fontWeight: '600' }}>Minimum Energy Rating</label>
              <select name="energyRating" value={formData.energyRating} onChange={handleChange} style={inputStyle}>
                <option value="">Any</option>
                <option value="1">1 Star+</option>
                <option value="2">2 Stars+</option>
                <option value="3">3 Stars+</option>
                <option value="4">4 Stars+</option>
                <option value="5">5 Stars</option>
              </select>
            </div>

            <div className="mb-3">
              <label style={{ fontWeight: '600' }}>Desired Features</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                  placeholder="e.g. Inverter, Frost Free" style={{ ...inputStyle, marginTop: 0, flex: 1 }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                <button type="button" onClick={addFeature} className="btn-secondary"
                  style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>Add</button>
              </div>
              {formData.features.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {formData.features.map(f => (
                    <span key={f} style={{ background: '#e8eaf6', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {f} <button type="button" onClick={() => removeFeature(f)} style={{ color: '#999', fontSize: '1rem', lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Finding Best Matches...' : '🔍 Get Recommendations'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {loading && <LoadingSpinner />}
          {!loading && submitted && (
            <>
              <h3 style={{ marginBottom: '1.5rem', color: '#1a237e' }}>
                {results.length > 0 ? `✅ Found ${results.length} Matching Products` : '❌ No Matching Products'}
              </h3>
              {results.map(product => (
                <div key={product.id} className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'center', background: '#f5f5f5', padding: '1rem', borderRadius: '8px', minWidth: '120px' }}>
                      <div style={{ fontSize: '3rem' }}>🧊</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4caf50' }}>
                        {product.matchPercentage}%
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>Match</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <span style={{ background: '#e0e0e0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', marginRight: '0.5rem' }}>{product.brand}</span>
                          <h3 style={{ display: 'inline' }}>{product.name}</h3>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a237e', whiteSpace: 'nowrap' }}>
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div style={{ marginBottom: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                        ⭐ {product.average_rating} | {product.energy_rating} Star Energy | {product.capacity}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: '#388e3c' }}>Why recommended:</strong>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {(product.matchingReasons || []).map((reason, i) => (
                            <span key={i} style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                    <a href={`/products/${product.id}`} className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>View Details</a>
                    <span style={{ color: '#666', fontSize: '0.9rem', alignSelf: 'center' }}>Score: {product.score}/100</span>
                  </div>
                </div>
              ))}
            </>
          )}
          {!submitted && (
            <div className="card text-center" style={{ padding: '4rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ marginBottom: '1rem', color: '#666' }}>Your Personalized Recommendations</h3>
              <p style={{ color: '#999' }}>Fill in your requirements on the left and click "Get Recommendations" to find the perfect appliance for you.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
