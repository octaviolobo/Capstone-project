import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import Select from 'react-select';
import './Bookappointment.css';

function BookAppointment() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]); // NEW
  const [serviceId, setServiceId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState(''); // NEW
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/api/v1/services', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setServices(res.data));

    axios.get('http://localhost:5000/api/v1/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setDoctors(res.data.filter(u => u.user_type === 'doctor'));
      if (user && user.user_type === 'admin') {
        setPatients(res.data.filter(u => u.user_type === 'patient'));
      }
    });
  }, [user]);

  const handleBook = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!serviceId || !doctorId || !date || (user.user_type === 'admin' && !patientId)) {
      setMsg('Preencha todos os campos obrigatórios.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.post('https://capstone-project-094h.onrender.com/api/v1/appointments', {
        service_id: serviceId,
        doctor_id: doctorId,
        patient_id: user.user_type === 'admin' ? patientId : user.user_id,
        appointment_time: date,
        status: 'pending',
        notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Consulta marcada com sucesso!');
      setServiceId('');
      setDoctorId('');
      setPatientId('');
      setDate('');
      setNotes('');
    } catch (err) {
      setMsg('Erro ao marcar consulta.');
    }
  };

  if (!user) return <div className="book-appointment-container">Carregando...</div>;

  return (
    <div className="book-appointment-container">
      <h2 className="book-appointment-title">Marcar Nova Consulta</h2>
      <form className="book-appointment-form" onSubmit={handleBook}>
        <select value={serviceId} onChange={e => setServiceId(e.target.value)} required>
          <option value="">Selecione o serviço</option>
          {services.map(s => (
            <option key={s.service_id} value={s.service_id}>{s.name}</option>
          ))}
        </select>
        <select value={doctorId} onChange={e => setDoctorId(e.target.value)} required>
          <option value="">Selecione o médico</option>
          {doctors.map(d => (
            <option key={d.user_id} value={d.user_id}>{d.first_name} {d.last_name}</option>
          ))}
        </select>
        {/* Only show for admin */}
        {user.user_type === 'admin' && (
          <Select
            options={patients.map(p => ({
              value: p.user_id,
              label: `${p.first_name} ${p.last_name} (${p.email})`
            }))}
            value={patients
              .filter(p => p.user_id === patientId)
              .map(p => ({
                value: p.user_id,
                label: `${p.first_name} ${p.last_name} (${p.email})`
              }))[0] || null}
            onChange={option => setPatientId(option ? option.value : '')}
            placeholder="Selecione ou busque o paciente"
            isClearable
          />
        )}
        <input
          type="datetime-local"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
        <textarea
          placeholder="Notas (opcional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <button type="submit">Marcar Consulta</button>
        {msg && <div className="book-appointment-msg" style={{ color: msg.includes('sucesso') ? '#2e7d32' : '#b71c1c' }}>{msg}</div>}
      </form>
    </div>
  );
}

export default BookAppointment;