import instance from './axios.js';

export const isAuthenticated = async () => {
    try {
        const response = await instance.get('/api/auth/check', { withCredentials: true });
        const data = response.data;
        // console.log(data);
        return {
            ...data,
            isLoggedIn: data.isAuthenticated, 
            role: data.role,
            profilePic: data.profilePic,
        };
    } catch (error) {
        console.error('Auth Check failed:', error);
        return false;
    }
};

export const logout = async () => {
    try {
        await instance.post("/api/auth/logout");

        window.location.href = "/";
    } catch (error) {
        console.error("Logout error:", error);
    }
};