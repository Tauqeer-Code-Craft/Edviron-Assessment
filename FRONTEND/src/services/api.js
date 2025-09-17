import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, 
});

// Add auth header interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Or sessionStorage / cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------- Transactions -----------------
export const fetchTransactions = async ({ page = 1, limit = 10, sort = "payment_time", order = "desc", status = "" }) => {
  return API.get(`api/transactions`, {
    params: { page, limit, sort, order, status },
  });
};

export const fetchTransactionsBySchool = (schoolId) => {
  return API.get(`api/transactions/school/${schoolId}`);
};

export const checkTransactionsStatus = (customOrderId) => {
  return API.get(`api/transaction-status/${customOrderId}`);
};


// ----------------- Auth -----------------
export const registerUser = async (data) => {
  const response = await API.post("api/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await API.post("api/auth/login", data, {withCredentials: true});
  if (response.data?.token) localStorage.setItem("token", response.data.token);
  return response.data;
};

export const logoutUser = async () => {
  await API.post("api/auth/logout" , {} , {withCredentials: true});
  localStorage.removeItem("token");
};