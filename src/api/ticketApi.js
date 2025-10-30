// src/api/ticketApi.js
import axiosClient from "./axiosClient";

const ticketApi = {
  // Get all tickets (optional: for admin or user dashboard)
  getAll: (params) => axiosClient.get("/tickets", { params }),

  // Get tickets for a specific event
  getByEvent: (eventId, params) =>
    axiosClient.get(`/events/${eventId}/tickets`, { params }),

  // Create a new ticket (checkout/booking)
  create: (data) => axiosClient.post("/tickets", data),

  // Cancel a ticket (if allowed)
  cancel: (ticketId) => axiosClient.post(`/tickets/${ticketId}/cancel`),

  // Get ticket details
  getById: (ticketId) => axiosClient.get(`/tickets/${ticketId}`),
};

export default ticketApi;
