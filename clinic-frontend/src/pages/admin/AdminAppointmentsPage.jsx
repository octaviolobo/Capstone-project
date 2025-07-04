import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import Sidebar from '../../components/sidebar';
import '../../pages/AppointmentsPage.css';

function AdminAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.user_type !== 'admin') return;
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/v1/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setAppointments(res.data.filter(appt => appt.status === 'pending'));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleApprove = async (appointment_id) => {
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:5000/api/v1/appointments/${appointment_id}`, {
      status: 'confirmed'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAppointments(appointments.filter(a => a.appointment_id !== appointment_id));
    alert('Consulta aprovada e email enviado!');
  };

  if (!user || user.user_type !== 'admin') return <div>Sem permissão.</div>;
  if (loading) return <div className="appointments-container">Carregando consultas...</div>;

  return (
    <div style={{ marginLeft: 220, minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: 220, padding: 32 }}>
        <h2 className="appointments-title">Consultas Pendentes</h2>
        {appointments.length === 0 ? (
          <div className="no-appointments">Nenhuma consulta pendente.</div>
        ) : (
          <div className="appointments-list">
            {appointments.map(appt => (
              <div className="appointment-card" key={appt.appointment_id}>
                <div><strong>Serviço:</strong> {appt.service_id}</div>
                <div><strong>Data:</strong> {new Date(appt.appointment_time).toLocaleString()}</div>
                <div><strong>Status:</strong> {appt.status}</div>
                <div><strong>Médico:</strong> {appt.doctor_id}</div>
                <div><strong>Paciente:</strong> {appt.patient_id}</div>
                <button
                  style={{ marginTop: 12, background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer' }}
                  onClick={() => handleApprove(appt.appointment_id)}
                >
                  Aprovar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAppointmentsPage;