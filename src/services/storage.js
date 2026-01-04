/**
 * Simple LocalStorage Wrapper to simulate database operations.
 */

const STORAGE_KEYS = {
    CLIENTS: 'mealroute_clients',
    STAFF: 'mealroute_staff',
    ZONES: 'mealroute_zones',
    EVENTS: 'mealroute_events',
    TRANSACTIONS: 'mealroute_transactions',
    USER: 'mealroute_user', // For auth
};

export const StorageService = {
    // Zones Management
    getZones: () => {
        const zones = localStorage.getItem('mealroute_zones');
        if (!zones) {
            // Default Zones from constants (Hardcoded here to avoid circular dep if needed, or imported)
            const defaultZones = [
                { id: 'z1', name: 'Gachibowli' },
                { id: 'z2', name: 'Madhapur' },
                { id: 'z3', name: 'Hitech City' },
                { id: 'z4', name: 'Kondapur' },
                { id: 'z5', name: 'Jubilee Hills' },
                { id: 'z6', name: 'Banjara Hills' },
                { id: 'z7', name: 'Kukatpally' },
                { id: 'z8', name: 'Manikonda' },
            ];
            localStorage.setItem('mealroute_zones', JSON.stringify(defaultZones));
            return defaultZones;
        }
        return JSON.parse(zones);
    },

    saveZones: (zones) => {
        localStorage.setItem('mealroute_zones', JSON.stringify(zones));
    },

    // Plans Management
    getPlans: () => {
        const plans = localStorage.getItem('mealroute_plans');
        if (!plans) {
            // Initialize with Default Brahmana Vantillu Plans
            const defaultPlans = [
                { id: '1', name: '1 Person', price: 6800, deposit: 2100, people: 1 },
                { id: '2', name: '2 People', price: 7800, deposit: 2100, people: 2 },
                { id: '3', name: '3 People', price: 9800, deposit: 2100, people: 3 },
                { id: '4', name: '4 People', price: 12500, deposit: 3800, people: 4 },
                { id: '5', name: '5 People', price: 15000, deposit: 3800, people: 5 },
                { id: '6', name: '6 People', price: 17500, deposit: 3800, people: 6 },
            ];
            localStorage.setItem('mealroute_plans', JSON.stringify(defaultPlans));
            return defaultPlans;
        }
        return JSON.parse(plans);
    },

    savePlans: (plans) => {
        localStorage.setItem('mealroute_plans', JSON.stringify(plans));
    },

    // Admin Profile Management
    getAdminProfile: () => {
        const profile = localStorage.getItem('mealroute_admin');
        if (!profile) {
            const defaultProfile = {
                email: 'admin@mealroute.in',
                password: 'MealRoute@1332', // Default initial password
                name: 'Admin'
            };
            localStorage.setItem('mealroute_admin', JSON.stringify(defaultProfile));
            return defaultProfile;
        }
        return JSON.parse(profile);
    },

    updateAdminProfile: (profile) => {
        localStorage.setItem('mealroute_admin', JSON.stringify(profile));
    },

    get: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    set: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Clients
    getClients: () => StorageService.get(STORAGE_KEYS.CLIENTS),
    saveClient: (client) => {
        const clients = StorageService.getClients();
        const existingIndex = clients.findIndex((c) => c.id === client.id);
        if (existingIndex >= 0) {
            clients[existingIndex] = client;
        } else {
            clients.push(client);
        }
        StorageService.set(STORAGE_KEYS.CLIENTS, clients);
    },
    deleteClient: (id) => {
        const clients = StorageService.getClients().filter((c) => c.id !== id);
        StorageService.set(STORAGE_KEYS.CLIENTS, clients);
    },

    // Staff
    getStaff: () => StorageService.get(STORAGE_KEYS.STAFF),
    saveStaff: (staffMember) => {
        const staff = StorageService.getStaff();
        const existingIndex = staff.findIndex((s) => s.id === staffMember.id);
        if (existingIndex >= 0) {
            staff[existingIndex] = staffMember;
        } else {
            staff.push(staffMember);
        }
        StorageService.set(STORAGE_KEYS.STAFF, staff);
    },
    deleteStaff: (id) => {
        const staff = StorageService.getStaff().filter((s) => s.id !== id);
        StorageService.set(STORAGE_KEYS.STAFF, staff);
    },

    // Backup
    exportData: () => {
        const backup = {};
        Object.keys(STORAGE_KEYS).forEach(key => {
            backup[key] = localStorage.getItem(STORAGE_KEYS[key]);
        });
        return JSON.stringify(backup);
    },

    importData: (jsonString) => {
        try {
            const backup = JSON.parse(jsonString);
            Object.keys(backup).forEach(key => {
                if (backup[key]) {
                    localStorage.setItem(STORAGE_KEYS[key], backup[key]);
                }
            });
            return true;
        } catch (e) {
            console.error("Import failed", e);
            return false;
        }
    }
};
