import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import Register from './pages/Register'
import './App.css';
import Layout from './components/layout';
import AppointmentsPage from './pages/AppointmentsPage';
import BookAppointment from './pages/BookAppointment';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/me" element={<Layout><ProfilePage /></Layout>} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointments" element={<Layout><AppointmentsPage /></Layout>} />
        <Route path="/book-appointment" element={<Layout><BookAppointment /></Layout>} />
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/admin/appointments" element={<Layout><AdminAppointmentsPage /></Layout>} />
        

      </Routes>
    </Router>
  
  );
}

export default App;
