// This is one shared axios instance, so the API URL lives in one place.
// Later, this is where you’ll attach the login token to every request.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;