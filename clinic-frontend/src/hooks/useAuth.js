import { useState, useEffect } from 'react';
import axios from 'axios';

 function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    axios.get('http://localhost:5000/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return { user, logout };
}
export default useAuth;