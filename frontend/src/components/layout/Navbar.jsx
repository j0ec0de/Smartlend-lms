import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-indigo-600">SmartLend</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <>
                                <span className="text-gray-700 text-sm">Hello, {user.name}</span>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                        Admin Panel
                                    </Link>
                                )}
                                <Button variant="secondary" onClick={handleLogout} className="text-sm">
                                    Sign out
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
