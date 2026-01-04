import { DatabaseService } from './db';

export const AuthService = {
    login: async (email, password) => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const adminProfile = await DatabaseService.getAdminProfile();

            if (email === adminProfile.email && password === adminProfile.password) {
                const user = { email, role: 'admin', name: adminProfile.name };
                localStorage.setItem('mealroute_user', JSON.stringify(user));
                return user;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err) {
            throw err;
        }
    },

    logout: () => {
        localStorage.removeItem('mealroute_user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('mealroute_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('mealroute_user');
    }
};
