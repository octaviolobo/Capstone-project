import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <div>Loading...</div>;
    }
    
    const initials = (user.first_name && user.last_name)
        ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
        : (user.first_name ? user.first_name[0].toUpperCase() : 'U');

    return (
        <div className="profile-default-container">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-details">
                <h2>Meu Perfil</h2>
                <div className="profile-row">
                    <span className="profile-label">Nome:</span>
                    <span className="profile-value">{user.first_name} {user.last_name}</span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Email:</span>
                    <span className="profile-value">{user.email}</span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Telefone:</span>
                    <span className="profile-value">{user.phone_number}</span>
                </div>
                <div className="profile-row">
                    <span className="profile-label">Tipo:</span>
                    <span className="profile-value">{user.user_type}</span>
                </div>
                <div className="profile-actions">
                    <button onClick={logout}>Sair</button>
                    <button onClick={() => navigate('/')}>Home</button>
                    <button onClick={() => navigate('/appointments')}>Ver Consultas</button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;