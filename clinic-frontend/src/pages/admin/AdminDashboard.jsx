import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

const locales = {
  'pt-BR': require('date-fns/locale/pt-BR'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user && user.user_type !== 'admin') {
      navigate('/login');
    }
    if (user && user.user_type === 'admin') {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:5000/api/v1/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const mapped = res.data.map(appt => ({
          title: `Paciente: ${appt.patient_id} | Serviço: ${appt.service_id}`,
          start: new Date(appt.appointment_time),
          end: new Date(new Date(appt.appointment_time).getTime() + 60 * 60 * 1000),
          allDay: false,
        }));
        setEvents(mapped);
      });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Carregando...</div>;
  }
  if (user.user_type !== 'admin') {
    return <div>Sem permissão.</div>;
  }

  return (
    <div style={{ zIndex: 1 }}>
      <Sidebar />
      <div style={{ marginLeft: 220, padding: 32,  }}>
        <h2>Painel do Administrador</h2>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginTop: 24 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            messages={{
              next: "Próximo",
              previous: "Anterior",
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              agenda: "Agenda"
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
