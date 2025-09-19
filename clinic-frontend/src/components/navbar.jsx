import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="main-navbar">
      <div className="navbar-left" onClick={() => navigate('/')}>
        <span className="logo-box">M</span>
        <span className="navbar-title">Matenar</span>
      </div>
      <div className="navbar-links">
        
        <button onClick={() => navigate('/login')}>Agendar</button>
        <button onClick={() => navigate('/login')}>Consultas</button>
        {user ? (
          <button onClick={logout}>Sair</button>
        ) : (
          <button onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;