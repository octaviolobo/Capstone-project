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
    axios.get('https://capstone-project-094h.onrender.com/api/v1/appointments', {
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

  const handleCancel = async (appointment_id) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://capstone-project-094h.onrender.com/api/v1/appointments/${appointment_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointments.filter(a => a.appointment_id !== appointment_id));
    } catch (err) {
      alert('Erro ao cancelar consulta.');
    }
  };

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
              {/* Cancel button */}
              {appt.status !== 'cancelled' && (
                <button
                  style={{
                    marginTop: 10,
                    background: '#b71c1c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 18px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleCancel(appt.appointment_id)}
                >
                  Cancelar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;