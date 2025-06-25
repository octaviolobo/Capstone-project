import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/me" element={<ProfilePage />} />

      </Routes>
    </Router>
  
  );
}

export default App;
