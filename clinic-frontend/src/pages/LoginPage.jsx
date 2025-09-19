import './LoginPage.css'; 
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      window.location.href = '/me';
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className='login-container'>
      <div className='logo-row' onClick={() => navigate('/')}>
        <span className='logo-box'>M</span>
        <span className='font-bold text-xl text-gray-700'>Maternar</span>
      </div>
      <p className="login-subtitle">Por favor insira seus dados</p>
      <h2 className="login-title">Login</h2>

      <input
        className="login-input"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="login-input"
        placeholder="Senha"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="login-btn" onClick={handleLogin}>
        Login
      </button>

      <div className="login-links">
        <button
          className="forgot-btn"
          onClick={() => window.location.href = '/forgot-password'}
        >
          Esqueceu a senha?
        </button>
        <button
          className="register-btn"
          onClick={() => window.location.href = '/register'}
        >
          Registrar
        </button>
      </div>


    </div>
  );
};

export default LoginPage;