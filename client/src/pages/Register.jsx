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
        <div className="parentContainerCenterLayout registrationPage">
            <div className="formContainer glassEffect">
                <div className="leftPanel">
                    <img src="./src/assets/Tangled.svg" alt="" />
                    <h2>Secure access to everything, with one master key.</h2>
                    <p>Sign up to store and manage your most sensitive information securely, all in one vault — accessible only with your unique passphrase.</p>
                </div>
                <div className="rightPanel">
                    <div>
                        <h2>Create <br /> your account</h2>
                        <h4>Already a member? <span>Log in</span></h4>
                    </div>
                    <form onSubmit={handleSubmit} className="formClass">
                        <div style={{display: "flex", gap: "20px"}}>
                            <Input
                                customClassName = "customInput"
                                type="text"
                                name="firstName"
                                title="First name"
                                value={registrationForm.firstName}
                                onChange={handleInputChange}
                                required />
                            
                            <Input
                                customClassName = "customInput"
                                type="text"
                                name="lastName"
                                title="Last name"
                                value={registrationForm.lastName}
                                onChange={handleInputChange}
                                required />
                        </div>
                        <div>
                            <Input
                                type="email"
                                name="email"
                                title="E-mail"
                                value={registrationForm.email}
                                onChange={handleInputChange}
                                required />
                        </div>
                        <div>
                            <Input
                                type="password"
                                name="password"
                                title="Password"
                                value={registrationForm.password}
                                onChange={handleInputChange}
                                required />
                        </div>
                        <div className="TnC">
                            <input type="checkbox" id="TnC" />
                            <label htmlFor="TnC"> Agree Terms and Conditions</label>
                        </div>
                        <button className="submitBtn" type="submit">Register</button>
                    </form>
                    <p>{message}</p>
                </div>
            </div>
            <StarBackground />
        </div>
    );
};

export default Register;
