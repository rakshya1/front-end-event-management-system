// import api from './api';
import axiosClient from "./axiosClient";

const bookingApi = {
  // Create a new booking
  create: (bookingData) => {
    return axiosClient.post('/checkout/create', bookingData);
  },

  // Get all bookings for current user
  getMyBookings: () => {
    return axiosClient.get('/bookings/my-bookings');
  },

  // Get booking by ID
  getById: (id) => {
    return axiosClient.get(`/bookings/${id}`);
  },

  // Cancel booking
  cancel: (id) => {
    return axiosClient.patch(`/bookings/${id}/cancel`);
  },

  // Update booking status (admin/organizer)
  updateStatus: (id, status) => {
    return axiosClient.patch(`/bookings/${id}/status`, { status });
  },

  // Get all bookings (admin/organizer)
  getAll: (params) => {
    return axiosClient.get('/bookings', { params });
  },

  // Get bookings for a specific event
  getByEvent: (eventId) => {
    return axiosClient.get(`/bookings/event/${eventId}`);
  },
};

export default bookingApi;