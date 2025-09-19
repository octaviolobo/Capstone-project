import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourcePlugin from '@fullcalendar/resource';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import axios from 'axios';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    if (user && user.user_type !== 'admin') {
      navigate('/login');
    }
    if (user && user.user_type === 'admin') {
      const token = localStorage.getItem('token');

      axios.get('https://capstone-project-094h.onrender.com/api/v1/users', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const doctors = res.data.filter(u => u.user_type === 'doctor');
        const mappedResources = doctors.map(doc => ({
          id: doc.user_id.toString(),
          title: `${doc.first_name} ${doc.last_name}`,
          specialty: doc.specialty
        }));
        setResources(mappedResources);
      });
      axios.get('https://capstone-project-094h.onrender.com/api/v1/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        // FullCalendar expects events as { title, date }
        const mapped = res.data.map(appt => ({
          title: `Paciente: ${appt.patient_name} | Serviço: ${appt.service_name}`,
          date: appt.appointment_time, // should be ISO string or Date
          resourceId: appt.doctor_id.toString(),
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
      <div style={{ marginLeft: 220, padding: 32 }}>
        <h2>Agenda</h2>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginTop: 24 }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, resourcePlugin, resourceTimeGridPlugin]}
            initialView="resourceTimeGridDay"
            resources={resources}
            events={events}
            locale="pt-br"
            height={600}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,timeGridDay' 
            }}
            contentHeight="auto"
            className="custom-calendar"
          />
        </div>
      </div>
      
    </div>
  );
}

export default AdminDashboard;
