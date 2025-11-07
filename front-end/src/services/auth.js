
// Use VITE_API_URL if provided, else fallback to localhost:3000/api
const BASE_API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_URL = `${BASE_API}/auth`; // -> http://localhost:3000/api/auth

/**
 * ✅ SIGNUP API
 */
export const signupUser = async (name, email, password) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return res.json();
};

/**
 * ✅ LOGIN API
 */
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

/**
 * ✅ Get authenticated user from backend (/me)
 */
export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.json();
};

/**
 * ✅ Store token + user in localStorage
 */
export const setAuthData = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("role", user.role); // ✅ add this line
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getToken = () => localStorage.getItem("token");
export const getUser = () => JSON.parse(localStorage.getItem("user"));
//export const getUserRole = () => getUser()?.role || null;
export const getUserRole = () => localStorage.getItem("role");
