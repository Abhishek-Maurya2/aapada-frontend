// Web-specific storage using localStorage
const webStorage = {
    getItem: async (name) => {
        try {
            return localStorage.getItem(name);
        } catch {
            return null;
        }
    },
    setItem: async (name, value) => {
        try {
            localStorage.setItem(name, value);
        } catch {
            // Ignore errors
        }
    },
    removeItem: async (name) => {
        try {
            localStorage.removeItem(name);
        } catch {
            // Ignore errors
        }
    },
};

export default webStorage;
