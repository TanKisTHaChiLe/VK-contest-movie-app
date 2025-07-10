import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'X-API-KEY': process.env.REACT_APP_API_KEY,
    'Accept': 'application/json'
  }
});