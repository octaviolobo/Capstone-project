import { useState, useEffect } from 'react';
import axios from 'axios';
import './Bookappointment.css';
import Navbar from '../components/navbar';

function GuestAppointmentPage() {
    const [services, setServices] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [serviceId, setServiceId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        axios.get('https://capstone-project-094h.onrender.com/api/v1/services').then(res => setServices(res.data));
        axios.get('https://capstone-project-094h.onrender.com/api/v1/users').then(res => {
            setDoctors(res.data.filter(u => u.user_type === 'doctor'));
        });
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        setMsg('');
        if (!guestName || !guestEmail || !guestPhone || !serviceId || !doctorId || !date) {
            setMsg('Preencha todos os campos obrigatórios.');
            return;
        }
        try {
            await axios.post('https://capstone-project-094h.onrender.com/api/v1/guest_appointments', {
                guest_name: guestName,
                guest_email: guestEmail,
                guest_phone: guestPhone,
                service_id: serviceId,
                doctor_id: doctorId,
                appointment_time: date,
                status: 'pending',
                notes
            });
            setMsg('Consulta marcada com sucesso!');
            setGuestName('');
            setGuestEmail('');
            setGuestPhone('');
            setServiceId('');
            setDoctorId('');
            setDate('');
            setNotes('');
        } catch (err) {
            setMsg('Erro ao marcar consulta.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="book-appointment-container">
                <h2 className="book-appointment-title">Marcar Consulta como Visitante</h2>
                <form className="book-appointment-form" onSubmit={handleBook}>
                    <input
                        placeholder="Nome"
                        value={guestName}
                        onChange={e => setGuestName(e.target.value)}
                        required
                    />
                    <input
                        placeholder="Email"
                        type="email"
                        value={guestEmail}
                        onChange={e => setGuestEmail(e.target.value)}
                        required
                    />
                    <input
                        placeholder="Telefone"
                        value={guestPhone}
                        onChange={e => setGuestPhone(e.target.value)}
                        required
                    />
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
        </>
    );
}

export default GuestAppointmentPage;