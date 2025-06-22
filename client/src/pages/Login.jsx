/* eslint-disable no-unused-vars */
import { useState } from "react";
// import axios from 'axios';
import axios from '../utils/axiosInstance';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const location = useLocation();
    const expired = new URLSearchParams(location.search).get('expired');

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
            // localStorage.setItem('token', res.data.token);
            login(res.data.token, res.data.email);
            setMessage('Login successful! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div>
            {expired && <p style={{ color: 'red' }}>Session expired. Please login again.</p>}
            <h2>Login</h2>
            <form onSubmit={ handleLogin }>
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
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    )
}

export default Login;