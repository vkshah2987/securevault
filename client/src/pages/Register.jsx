/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from '../utils/axiosInstance';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

import StarBackground from "../components/canvas/StarBackground";
import Input from "../components/sharable-ui/Input";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setToken } = useAuth();  // Used for automatic login

    const [registrationForm, setRegistrationForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setRegistrationForm({...registrationForm, [name]:value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Step 1: Register the user
            await axios.post('http://localhost:5001/api/auth/register', { ...registrationForm });

            // Step 2: Automatically login
            const res = await axios.post('http://localhost:5001/api/auth/login', { 
                email : registrationForm.email, 
                password: registrationForm.password
            });
            const token = res.data.token;

            if (token) {
                setToken(token);
                navigate('/setup-passphrase');
            } else {
                setMessage('Login failed after registration.');
            }
        } catch (err) {
            console.log(err)
            setMessage(err.response?.data?.message || 'Registration failed');
        }
    }

    return (
        <div className="parentContainer">
            <div className="formContainer glassEffect">
                <div className="leftPanel">

                </div>
                <div className="rightPanel">
                    <h2>Create Account</h2>
                    <form onSubmit={handleSubmit} className="formClass">
                        <div style={{display: "flex", gap: "20px"}}>
                            <Input
                                customClassName = "customInput"
                                type="text"
                                name="firstName"
                                title="Enter your first name"
                                value={registrationForm.firstName}
                                onChange={handleInputChange}
                                required />
                            
                            <Input
                                customClassName = "customInput"
                                type="text"
                                name="lastName"
                                title="Enter your last name"
                                value={registrationForm.lastName}
                                onChange={handleInputChange}
                                required />
                        </div>
                        <div>
                            <Input
                                type="email"
                                name="email"
                                title="Enter your email"
                                value={registrationForm.email}
                                onChange={handleInputChange}
                                required />
                        </div>
                        <div>
                            <Input
                                type="password"
                                name="password"
                                title="Enter password"
                                value={registrationForm.password}
                                onChange={handleInputChange}
                                required />
                        </div>
                        <div>
                            <input type="checkbox" id="TnC" />
                            <label htmlFor="TnC"> Agree Terms and Conditions</label>
                        </div>
                        <button type="submit">Register</button>
                    </form>
                    <p>{message}</p>
                </div>
            </div>
            <StarBackground />
        </div>
    );
};

export default Register;
