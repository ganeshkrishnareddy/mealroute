import { db } from '../lib/firebase';
import {
    collection,
    getDocs,
    doc,
    setDoc,
    addDoc,
    deleteDoc,
    updateDoc,
    onSnapshot
} from 'firebase/firestore';

const COLLECTIONS = {
    CLIENTS: 'clients',
    STAFF: 'staff',
    PLANS: 'plans',
    ZONES: 'zones',
    EVENTS: 'events',
    ADMIN: 'settings' // store admin profile in settings/admin
};

export const DatabaseService = {
    // Generic Get
    getAll: async (collectionName) => {
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            console.log(`Fetched ${collectionName}:`, querySnapshot.size);
            return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        } catch (error) {
            console.error(`Error getting ${collectionName}:`, error);
            return [];
        }
    },

    // Generic Add (Auto ID)
    add: async (collectionName, data) => {
        try {
            // If data has an ID, use setDoc, else addDoc
            if (data.id) {
                await setDoc(doc(db, collectionName, data.id), data);
                return data.id;
            } else {
                const docRef = await addDoc(collection(db, collectionName), data);
                return docRef.id;
            }
        } catch (error) {
            console.error(`Error adding to ${collectionName}:`, error);
            throw error;
        }
    },

    // Generic Update
    update: async (collectionName, id, data) => {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, data);
        } catch (error) {
            console.error(`Error updating ${collectionName}:`, error);
            throw error;
        }
    },

    // Generic Delete
    delete: async (collectionName, id) => {
        try {
            await deleteDoc(doc(db, collectionName, id));
        } catch (error) {
            console.error(`Error deleting from ${collectionName}:`, error);
            throw error;
        }
    },

    // --- Specific Entities Wrappers ---

    // Clients
    getClients: async () => DatabaseService.getAll(COLLECTIONS.CLIENTS),
    saveClient: async (client) => DatabaseService.add(COLLECTIONS.CLIENTS, client),
    deleteClient: async (id) => DatabaseService.delete(COLLECTIONS.CLIENTS, id),

    // Staff
    getStaff: async () => DatabaseService.getAll(COLLECTIONS.STAFF),
    saveStaff: async (staff) => DatabaseService.add(COLLECTIONS.STAFF, staff),
    deleteStaff: async (id) => DatabaseService.delete(COLLECTIONS.STAFF, id),

    // Plans
    getPlans: async () => DatabaseService.getAll(COLLECTIONS.PLANS),
    savePlan: async (plan) => DatabaseService.add(COLLECTIONS.PLANS, plan),
    deletePlan: async (id) => DatabaseService.delete(COLLECTIONS.PLANS, id),

    // Zones
    getZones: async () => DatabaseService.getAll(COLLECTIONS.ZONES),
    saveZone: async (zone) => DatabaseService.add(COLLECTIONS.ZONES, zone),
    deleteZone: async (id) => DatabaseService.delete(COLLECTIONS.ZONES, id),

    // Admin Profile (Stored as Singleton in settings/admin)
    getAdminProfile: async () => {
        try {
            const docRef = doc(db, COLLECTIONS.ADMIN, 'admin');
            const docSnap = await getDocs(collection(db, COLLECTIONS.ADMIN)); // Actually let's just fetch generic or specific?
            // Firestore 'getDoc' is better for single doc
            // But to keep it simple with existing imports, let's use the 'getAll' trick or import getDoc
            const { getDoc } = await import('firebase/firestore');
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                return snap.data();
            } else {
                // Initialize Default
                const defaultProfile = {
                    email: 'admin@mealroute.in',
                    password: 'MealRoute@1332',
                    name: 'Admin'
                };
                await setDoc(docRef, defaultProfile);
                return defaultProfile;
            }
        } catch (error) {
            console.error("Error fetching admin profile:", error);
            // Fallback to avoid lockout during migration issues
            return { email: 'admin@mealroute.in', password: 'MealRoute@1332', name: 'Admin (Offline)' };
        }
    },

    updateAdminProfile: async (profile) => {
        await setDoc(doc(db, COLLECTIONS.ADMIN, 'admin'), profile);
    },

    // --- Real-time Subscriptions ---
    subscribe: (collectionName, callback) => {
        const q = collection(db, collectionName);
        return onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            callback(data);
        });
    },

    subscribeToClients: (callback) => DatabaseService.subscribe(COLLECTIONS.CLIENTS, callback),
    subscribeToStaff: (callback) => DatabaseService.subscribe(COLLECTIONS.STAFF, callback),
    subscribeToPlans: (callback) => DatabaseService.subscribe(COLLECTIONS.PLANS, callback),
    subscribeToZones: (callback) => DatabaseService.subscribe(COLLECTIONS.ZONES, callback),

    seedDefaults: async () => {
        // All Hyderabad Zones (grouped for reference)
        const zones = [
            // Central Hyderabad
            { name: 'Abids', areaGroup: 'Central' },
            { name: 'Koti', areaGroup: 'Central' },
            { name: 'Nampally', areaGroup: 'Central' },
            { name: 'Basheerbagh', areaGroup: 'Central' },
            { name: 'Himayatnagar', areaGroup: 'Central' },
            { name: 'Narayanguda', areaGroup: 'Central' },
            { name: 'Sultan Bazaar', areaGroup: 'Central' },
            // West Hyderabad
            { name: 'Banjara Hills', areaGroup: 'West' },
            { name: 'Jubilee Hills', areaGroup: 'West' },
            { name: 'Film Nagar', areaGroup: 'West' },
            { name: 'Madhapur', areaGroup: 'West' },
            { name: 'Hitech City', areaGroup: 'West' },
            { name: 'Kondapur', areaGroup: 'West' },
            { name: 'Gachibowli', areaGroup: 'West' },
            { name: 'Manikonda', areaGroup: 'West' },
            { name: 'Narsingi', areaGroup: 'West' },
            { name: 'Nanakramguda', areaGroup: 'West' },
            { name: 'Financial District', areaGroup: 'West' },
            { name: 'Shaikpet', areaGroup: 'West' },
            // North Hyderabad
            { name: 'Secunderabad', areaGroup: 'North' },
            { name: 'Begumpet', areaGroup: 'North' },
            { name: 'Paradise', areaGroup: 'North' },
            { name: 'Maredpally', areaGroup: 'North' },
            { name: 'Tarnaka', areaGroup: 'North' },
            { name: 'Habsiguda', areaGroup: 'North' },
            { name: 'Nacharam', areaGroup: 'North' },
            { name: 'Malkajgiri', areaGroup: 'North' },
            { name: 'ECIL', areaGroup: 'North' },
            { name: 'Sainikpuri', areaGroup: 'North' },
            { name: 'Alwal', areaGroup: 'North' },
            { name: 'Bowenpally', areaGroup: 'North' },
            { name: 'Kukatpally', areaGroup: 'North' },
            // East Hyderabad
            { name: 'Uppal', areaGroup: 'East' },
            { name: 'Nagole', areaGroup: 'East' },
            { name: 'LB Nagar', areaGroup: 'East' },
            { name: 'Dilsukhnagar', areaGroup: 'East' },
            { name: 'Chaitanyapuri', areaGroup: 'East' },
            { name: 'Vanasthalipuram', areaGroup: 'East' },
            { name: 'Hayathnagar', areaGroup: 'East' },
            { name: 'Kothapet', areaGroup: 'East' },
            { name: 'Malakpet', areaGroup: 'East' },
            // South Hyderabad
            { name: 'Mehdipatnam', areaGroup: 'South' },
            { name: 'Tolichowki', areaGroup: 'South' },
            { name: 'Attapur', areaGroup: 'South' },
            { name: 'Rajendranagar', areaGroup: 'South' },
            { name: 'Bandlaguda', areaGroup: 'South' },
            { name: 'Chandrayangutta', areaGroup: 'South' },
            { name: 'Falaknuma', areaGroup: 'South' },
            // Outer Areas
            { name: 'Miyapur', areaGroup: 'Outer' },
            { name: 'Bachupally', areaGroup: 'Outer' },
            { name: 'Pragathi Nagar', areaGroup: 'Outer' },
            { name: 'Chandanagar', areaGroup: 'Outer' },
            { name: 'Serilingampally', areaGroup: 'Outer' },
            { name: 'Patancheru', areaGroup: 'Outer' },
            { name: 'Shamshabad', areaGroup: 'Outer' },
            { name: 'Kompally', areaGroup: 'Outer' },
            { name: 'Medchal', areaGroup: 'Outer' }
        ];

        // Plans based on user request (28 Days)
        const plans = [
            { name: '1 Person (Monthly)', price: 6800, deposit: 2100, people: 1, duration: 28, description: '28 Days Subscription' },
            { name: '2 People (Monthly)', price: 7800, deposit: 2100, people: 2, duration: 28, description: '28 Days Subscription' },
            { name: '3 People (Monthly)', price: 9800, deposit: 2100, people: 3, duration: 28, description: '28 Days Subscription' },
            { name: '4 People (Monthly)', price: 12500, deposit: 3800, people: 4, duration: 28, description: '28 Days Subscription' },
            { name: '5 People (Monthly)', price: 15000, deposit: 3800, people: 5, duration: 28, description: '28 Days Subscription' },
            { name: '6 People (Monthly)', price: 17500, deposit: 3800, people: 6, duration: 28, description: '28 Days Subscription' },
            { name: 'Trial Meal (2 Pax)', price: 360, deposit: 0, people: 2, duration: 1, description: 'One time trial - Pay via GPay 7794944012' },
            { name: 'Extra Rice (Addon)', price: 800, deposit: 0, people: 1, duration: 28, description: 'Monthly addon per person' }
        ];

        // Seed Zones
        for (const z of zones) {
            await addDoc(collection(db, COLLECTIONS.ZONES), z);
        }

        // Seed Plans
        for (const p of plans) {
            await addDoc(collection(db, COLLECTIONS.PLANS), p);
        }
    }
};
