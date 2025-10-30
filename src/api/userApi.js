// src/api/userApi.js
import axiosClient from "./axiosClient";

const userApi = {
  // Get user profile
  getProfile: () => axiosClient.get("/user"),

  // Update user profile
  updateProfile: (data) => axiosClient.put("/user", data),

  // Get tickets/bookings for the user
  getTickets: (params) => axiosClient.get("/user/tickets", { params }),

  // Optional: get all users (admin dashboard)
  getAll: (params) => axiosClient.get("/users", { params }),
};

export default userApi;
