// src/api/authApi.js
import axiosClient from "./axiosClient";

const authApi = {
  login: (credentials) => axiosClient.post("/login", credentials),
  register: (data) => axiosClient.post("/register", data),
  logout: () => axiosClient.post("/logout"),
  getProfile: () => axiosClient.get("/user"),
};

export default authApi;
