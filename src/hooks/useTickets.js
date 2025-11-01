import { useEffect, useState } from "react";
import ticketApi from "../api/ticketApi";

export const useTickets = (eventId = null) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        let res;
        if (eventId) {
          res = await ticketApi.getByEvent(eventId);
        } else {
          res = await ticketApi.getAll();
        }
        setTickets(res.data.data || res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [eventId]);

  return { tickets, loading, error };
};
