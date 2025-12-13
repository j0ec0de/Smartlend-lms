import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const PrivateRoute = ({ roles = [] }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export const PublicRoute = () => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}
