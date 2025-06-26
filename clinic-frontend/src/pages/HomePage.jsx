import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/services')
      .then(res => setServices(res.data));
  }, []);

  const handleBookClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/book-appointment');
    }
  };

  return (
    <>
      {!user && <Navbar />}
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {user && <Sidebar />}
        <div style={{ flex: 1 }}>
        <div className={`home-container ${user ? 'with-sidebar' : ''}`}>
          <div className="home-header">
            <div className="logo-box">M</div>
            <h1>Maternar</h1>
          </div>
          <h2 className="home-welcome">
            Bem-vindo{user && user.first_name ? `, ${user.first_name}` : ''}!
          </h2>
          <p className="home-desc">
            Agende consultas, veja seus agendamentos e conheça nossos serviços.
          </p>

          <div className="home-actions">
            <button onClick={handleBookClick}>Agendar Consulta</button>
            {user && (
              <button onClick={() => navigate('/appointments')}>Minhas Consultas</button>
            )}
            {user && (
              <button onClick={() => navigate('/me')}>Meu Perfil</button>
            )}
            {!user && (
              <button onClick={() => navigate('/login')}>Login</button>
            )}
          </div>

          <div className="home-section">
            <h3>Serviços em Destaque</h3>
            <div className="home-services">
              {services.length === 0 ? (
                <span>Carregando serviços...</span>
              ) : (
                services.slice(0, 3).map(s => (
                  <div className="home-service-card" key={s.service_id}>
                    <div className="service-title">{s.name}</div>
                    <div className="service-desc">{s.description}</div>
                    <div className="service-price">R$ {s.price}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="home-section">
            <h3>Informações da Clínica</h3>
            <div className="clinic-info">
              <div><strong>Endereço:</strong> Rua Exemplo, 123</div>
              <div><strong>Telefone:</strong> (11) 99999-9999</div>
              <div><strong>Horário:</strong> Seg-Sex 8h-18h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default HomePage;