import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Server Error:", error.response.data.message);

      if (error.response.status === 401) {
        localStorage.removeItem("user");
        alert("Session expired. Please login again.");
        window.location.href = "/login";
      }

      return Promise.reject(error);
    } else if (error.request) {
      alert("Server not responding. Please check backend.");
    } else {
      alert("Unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

export default api;
