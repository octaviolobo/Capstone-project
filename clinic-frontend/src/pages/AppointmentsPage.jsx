import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import './AppointmentsPage.css';

function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/v1/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // Filter appointments for this user (as patient)
        const userAppointments = res.data.filter(
          appt => appt.patient_id === user.user_id
        );
        setAppointments(userAppointments);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user) return <div className="appointments-container">Carregando...</div>;
  if (loading) return <div className="appointments-container">Carregando consultas...</div>;

  return (
    <div className="appointments-container">
      <h2 className="appointments-title">Minhas Consultas</h2>
      {appointments.length === 0 ? (
        <div className="no-appointments">Nenhuma consulta encontrada.</div>
      ) : (
        <div className="appointments-list">
          {appointments.map(appt => (
            <div className="appointment-card" key={appt.appointment_id}>
              <div><strong>Serviço:</strong> {appt.service_id}</div>
              <div><strong>Data:</strong> {new Date(appt.appointment_time).toLocaleString()}</div>
              <div><strong>Status:</strong> {appt.status}</div>
              <div><strong>Médico:</strong> {appt.doctor_id}</div>
              {appt.notes && <div><strong>Notas:</strong> {appt.notes}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;