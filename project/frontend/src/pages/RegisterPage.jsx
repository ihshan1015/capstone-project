import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords don't match");
    }
    try {
      await register(formData);
      toast.success('Registration successful. Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }} className="card">
      <h2 className="text-center mb-2">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Name</label>
          <input type="text" name="name" required onChange={handleChange} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} />
        </div>
        <div className="mb-2">
          <label>Email</label>
          <input type="email" name="email" required onChange={handleChange} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} />
        </div>
        <div className="mb-2">
          <label>Phone</label>
          <input type="text" name="phone" onChange={handleChange} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} />
        </div>
        <div className="mb-2">
          <label>Password</label>
          <input type="password" name="password" required onChange={handleChange} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} />
        </div>
        <div className="mb-3">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" required onChange={handleChange} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Register</button>
      </form>
      <div className="text-center mt-3">
        Already have an account? <Link to="/login" style={{ color: '#1a237e', textDecoration: 'underline' }}>Login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
