import axios from 'axios';

const api = axios.create({
  baseURL: 'https://us-central1-anonibusnovo.cloudfunctions.net',
});

export default api;
