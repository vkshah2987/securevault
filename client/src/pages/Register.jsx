/* eslint-disable no-unused-vars */
import { useState } from "react";
// import axios from 'axios';
import axios from '../utils/axiosInstance';
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/auth/register', { email, password });
            setMessage('Registered successfully! Redirecting to login...');
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed');
        }
    }
    
    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={ handleRegister }>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={ (e) => setEmail(e.target.value) }
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={ (e) => setPassword(e.target.value) }
                    required
                />
                <br />
                <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    )
}

export default Register;