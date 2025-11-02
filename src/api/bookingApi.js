// src/api/bookingApi.js
import axiosClient from "./axiosClient";

const bookingApi = {
  /**
   * Create a new booking (supports eSewa, Khalti, COD)
   * @param {Object} bookingData
   */
  create: (bookingData) => {
    return axiosClient.post("/checkout/create", bookingData);
  },

  /**
   * Get all bookings for the currently logged-in user
   */
  getMyBookings: () => {
    return axiosClient.get("/bookings/my-bookings");
  },

  /**
   * Get booking details by ID
   * @param {number|string} id
   */
  getById: (id) => {
    return axiosClient.get(`/bookings/${id}`);
  },

  /**
   * Cancel a booking (if allowed)
   * @param {number|string} id
   */
  cancel: (id) => {
    return axiosClient.patch(`/bookings/${id}/cancel`);
  },

  /**
   * Update booking status (admin/organizer only)
   * @param {number|string} id
   * @param {string} status
   */
  updateStatus: (id, status) => {
    return axiosClient.patch(`/bookings/${id}/status`, { status });
  },

  /**
   * Get all bookings (admin/organizer only)
   * @param {Object} params Optional query params for filtering/pagination
   */
  getAll: (params) => {
    return axiosClient.get("/bookings", { params });
  },

  /**
   * Get bookings for a specific event (admin/organizer only)
   * @param {number|string} eventId
   */
  getByEvent: (eventId) => {
    return axiosClient.get(`/bookings/event/${eventId}`);
  },

  /**
   * Verify eSewa payment after redirect (optional helper)
   * @param {Object} data { pid, refId, amt }
   */
  verifyEsewa: (data) => {
    return axiosClient.post("/esewa/verify", data);
  },
};

export default bookingApi;
