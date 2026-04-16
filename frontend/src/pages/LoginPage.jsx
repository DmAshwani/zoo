import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '', mobileNumber: '' });
  const navigate = useNavigate();

  const handleToggle = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await api.post('/auth/signin', { email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('roles', JSON.stringify(res.data.roles));
        navigate('/');
      } else {
        await api.post('/auth/signup', formData);
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', width: '100%' }}>
      <div className="card" style={{ padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isLogin ? 'Login to your account' : 'Register new account'}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLogin && (
            <>
              <input type="text" placeholder="Full Name" required 
                     value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              <input type="text" placeholder="Mobile Number" required 
                     value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} />
            </>
          )}
          <input type="email" placeholder="Email Address" required 
                 value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" required 
                 value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button type="submit" style={{ marginTop: '10px', fontSize: '1.1rem' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '500' }} onClick={handleToggle}>
              {isLogin ? 'Register here' : 'Login here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
