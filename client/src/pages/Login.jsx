/* eslint-disable no-unused-vars */
import { useState } from "react";
// import axios from 'axios';
import axios from '../utils/axiosInstance';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from 'react-router-dom';

import StarBackground from "../components/canvas/StarBackground";
import Input from "../components/sharable-ui/Input";

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
            const res = await axios.post('http://localhost:5001/api/auth/login', { ...loginForm });
            // localStorage.setItem('token', res.data.token);
            login(res.data.token, res.data.email);
            setMessage('Login successful! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Login failed');
        }
    }

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setLoginForm({...loginForm, [name]:value})
    }

    return (
        <div className="parentContainerCenterLayout loginPage">
            {/* {expired && <p style={{ color: 'red' }}>Session expired. Please login again.</p>} */}
            {/* <h2>Login</h2>
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
            <p>{message}</p> */}
            <div className="formContainer glassEffect">
                <div className="leftPanel">
                    <img src="./src/assets/Helix.svg" alt="" />
                    <h2>Enter. Encrypt. Empower.</h2>
                    <p>Your data stays locked and encrypted — even we can't see it.</p>
                </div>
                <div className="rightPanel">
                    <div>
                        <h2>Log In <br /> to your account</h2>
                        <h4>New here? <span>Sign up</span></h4>
                    </div>
                    <form onSubmit={ handleLogin } className="formClass">
                        <div>
                            <Input
                                type="email"
                                name="email"
                                title="E-mail"
                                value={loginForm.email}
                                onChange={handleInputChange}
                                required />
                        </div>
                        <div>
                            <Input
                                type="password"
                                name="password"
                                title="Password"
                                value={loginForm.password}
                                onChange={handleInputChange}
                                required />
                        </div>
                        <button className="submitBtn" type="submit">Log In</button>
                    </form>
                    <p>{message}</p>
                </div>
            </div>
            <StarBackground />
        </div>
    )
}

export default Login;