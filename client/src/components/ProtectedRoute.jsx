/* eslint-disable no-unused-vars */
import { Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';


const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if(!isLoggedIn){
        return <Navigate to="/" replace />
    }

    return children;
};

export default ProtectedRoute;