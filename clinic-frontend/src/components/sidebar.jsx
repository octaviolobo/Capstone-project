import './sidebar.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';

function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle button - fixed the class name */}
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      
      {/* Overlay for mobile - closes sidebar when clicking outside */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}
      
      {/* Sidebar - added conditional 'open' class */}
      <aside className={`main-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" onClick={() => navigate('/')}>
          <span className="logo-box">M</span>
          <span className="sidebar-title">Maternar</span>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate('/me')}>Perfil</button>
          {user && user.user_type === 'patient' && (
            <button onClick={() => navigate('/appointments')}>Minhas Consultas</button>
          )}
          
          <button onClick={() => navigate('/book-appointment')}>Agendar Consulta</button>
          {user && user.user_type === 'admin' && (
            <button onClick={() => navigate('/admin/appointments')}>Aprovar Consultas</button>
          )}
          {user && user.user_type === 'admin' && (
            <button onClick={() => navigate('/admin')}>Agenda</button>
          )}
          {user && user.user_type === 'admin' && (
            <button onClick={() => navigate('/admin/services')}>Serviços</button>
          )}
          <button className='logout-button' onClick={logout}>Sair</button>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;