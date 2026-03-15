import axios from 'axios';
import { Platform } from 'react-native';

// API Configuration
// -----------------
// 1. Web: Use localhost (avoids firewall/network issues)
// 2. Android Emulator: Use 10.0.2.2
// 3. Physical Device: Use computer's IP

const API_URL = Platform.OS === 'web'
    ? 'https://aapada-backend.onrender.com/api/v1'
    : 'https://aapada-backend.onrender.com/api/v1';


// const API_URL = Platform.OS === 'web'
//     ? 'https://aapada-backend.netlify.app/api/v1'
//     : 'https://aapada-backend.netlify.app/api/v1';


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
