import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login as loginService } from '../services/authService';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginService({ email, password });
      login(res.data.user, res.data.token);
      toast.success('Login successful! Welcome back.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }} className="card">
      <h2 className="text-center mb-2">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }} />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Login</button>
      </form>
      <div className="text-center mt-3">
        Don't have an account? <Link to="/register" style={{ color: '#1a237e', textDecoration: 'underline' }}>Register</Link>
      </div>
    </div>
  );
};

export default LoginPage;
