import { createContext, useContext, useState } from 'react';
import { getAuth, setAuth, clearAuth } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuthState] = useState(getAuth());

    const login = (authData) => {
        setAuth(authData);
        setAuthState(authData);
    };

    const logout = () => {
        clearAuth();
        setAuthState(null);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
