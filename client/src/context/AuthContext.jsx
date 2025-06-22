/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [email, setEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(!!token);
    const [vaultKey, setVaultKey] = useState(null); // this will hold derived AES key

    useEffect(() => {
        setIsLoggedIn(!!token);
    }, [token]);

    const login = (newToken, email) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setEmail(email);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setEmail('');
        setVaultKey(null); // Clear encryption key too
    };

    return (
        <AuthContext.Provider value={{ token, email, isLoggedIn, login, logout, vaultKey, setVaultKey }}>
            {children}
        </AuthContext.Provider>
    )

};

export const useAuth = () => useContext(AuthContext)