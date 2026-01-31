import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Header = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.header}>
            <div>
                <strong>{auth?.username}</strong> ({auth?.role})
            </div>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: '#eee'
    }
};

export default Header;
