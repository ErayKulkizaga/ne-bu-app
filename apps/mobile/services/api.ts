import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  Constants.expoConfig?.extra?.apiUrl ??
  'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Normalise error shape for consumers
    const message =
      error?.response?.data?.detail ??
      error?.message ??
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  },
);
