import './Register.css';
import { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("As senhas não coincidem");
            return;
        }
        try {
            await axios.post(`${API_URL}/api/v1/auth/register`, {
                first_name: firstName,
                last_name: lastName,
                phone_number: phone,
                email: email,
                password: password
            });
            alert("Registro bem-sucedido");
            window.location.href = '/login';
        } catch (err) {
            alert("Erro ao registrar");
        }
    };

    return (
        <div className='register-container'>
            <h2 className="register-title">Registrar</h2>
            <input
                className="register-input"
                placeholder="Nome"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
            />
            <input
                className="register-input"
                placeholder="Sobrenome"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
            />
            <input
                className="register-input"
                placeholder="Telefone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
            />
            <input
                className="register-input"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                className="register-input"
                placeholder="Senha"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <input
                className="register-input"
                placeholder="Confirmar Senha"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
            />
            <button className="register-btn" onClick={handleRegister}>
                Registrar
            </button>
        </div>
    );
};

export default RegisterPage;
