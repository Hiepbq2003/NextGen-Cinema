export const getAuth = () => {
    const data = localStorage.getItem('auth');
    if (!data || data === 'undefined') {
        return null;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Lỗi parse JSON từ localStorage:", error);
        localStorage.removeItem('auth'); 
        return null;
    }
};

export const setAuth = (auth) => {
    if (auth) {
        localStorage.setItem('auth', JSON.stringify(auth));
    } else {
        localStorage.removeItem('auth');
    }
};

export const clearAuth = () => {
    localStorage.removeItem('auth');
};