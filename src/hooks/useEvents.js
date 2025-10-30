import { useEffect, useState } from "react";
import eventApi from "../api/eventApi";

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await eventApi.getAll({}); // optional filters
        setEvents(res.data.data || res.data); // Laravel API resource may wrap in data
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};
