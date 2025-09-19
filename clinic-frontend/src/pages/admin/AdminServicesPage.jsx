import { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/sidebar';
import '../../pages/AppointmentsPage.css';

function AdminServicesPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const token = localStorage.getItem('token');
    try {
      await axios.post('https://capstone-project-094h.onrender.com/api/v1/services', {
        name,
        description,
        price,
        duration_minutes: duration
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('Serviço cadastrado com sucesso!');
      setName('');
      setDescription('');
      setPrice('');
      setDuration('');
    } catch (err) {
      setMsg('Erro ao cadastrar serviço.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div
        className="appointments-container"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
        }}
      >
        <h2 className="appointments-title" style={{ marginBottom: 32 }}>Novo Serviço</h2>
        <form
          onSubmit={handleSubmit}
          className="book-appointment-form"
          style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, width: '100%' }}
        >
          <div className="appointment-card" style={{ marginBottom: 16 }}>
            <input
              placeholder="Nome do serviço"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 12 }}
            />
            <textarea
              placeholder="Descrição"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 12 }}
            />
            <input
              type="number"
              placeholder="Preço"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 12 }}
            />
            <input
              type="number"
              placeholder="Duração (minutos)"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 12 }}
            />
          </div>
          <button type="submit">Cadastrar Serviço</button>
          {msg && (
            <div className="book-appointment-msg" style={{ color: msg.includes('sucesso') ? '#2e7d32' : '#b71c1c' }}>
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AdminServicesPage;