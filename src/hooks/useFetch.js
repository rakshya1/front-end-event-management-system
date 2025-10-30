// src/hooks/useFetch.js
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export default function useFetch(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(endpoint, options);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}
