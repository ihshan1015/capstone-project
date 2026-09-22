import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <div style={{ 
        background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', 
        color: 'white', 
        padding: '4rem 2rem', 
        textAlign: 'center', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Find the Perfect Home Appliance</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>Compare features, read reviews, and get expert recommendations.</p>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            placeholder="Search for appliances..." 
            style={{ flex: 1, padding: '1rem', borderRadius: '4px', border: 'none', fontSize: '1rem' }} 
          />
          <Link to="/products" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
            Search
          </Link>
        </div>
      </div>

      <h2 className="mb-2">Popular Categories</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
        {['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwaves', 'Televisions'].map(cat => (
          <Link to={`/products?category=${cat}`} key={cat} className="card text-center" style={{ padding: '2rem 1rem', display: 'block' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>家電</div>
            <div style={{ fontWeight: 'bold' }}>{cat}</div>
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <Link to="/products" className="btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>Browse All Products</Link>
      </div>
    </div>
  );
};

export default HomePage;
