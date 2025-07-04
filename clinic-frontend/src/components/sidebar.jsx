import './sidebar.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Sidebar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  return (
    <aside className="main-sidebar">
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
        <button className='logout-button' onClick={logout}>Sair</button>
      </nav>
    </aside>
  );
}

export default Sidebar;