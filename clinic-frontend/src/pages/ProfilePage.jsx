import './ProfilePage.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Temporary mock useAuth implementation
const useAuth = () => {
    // Replace with real authentication logic as needed
    const user = { id: 1, name: "Test User", email: "test@example.com" };
    const logout = () => {
        // Implement logout logic here
        window.location.href = '/login';
    };
    return { user, logout };
};

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        axios.get(`/api/profile/${user.id}`)
            .then(res => {
                setProfile(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load profile.');
                setLoading(false);
            });
    }, [user, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!profile) return null;

    return (
        <div className="profile-page">
            <h2>Profile</h2>
            <div className="profile-info">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                {/* Add more profile fields as needed */}
            </div>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default ProfilePage;