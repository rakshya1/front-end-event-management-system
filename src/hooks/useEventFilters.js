import { useEffect, useState } from "react";
import filterApi from "../api/filterApi";

export const useFilters = () => {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [dateRange, setDateRange] = useState({ min: '', max: '' });
  const [venues, setVenues] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      try {
        const res = await filterApi.getFilterOptions();
        const data = res.data?.data || res.data;

        setCategories(data.categories || []);
        setPriceRange(data.price_range || { min: 0, max: 0 });
        setDateRange(data.date_range || { min: '', max: '' });
        setVenues(data.venues || []);
        setLocations(data.locations || []);
        setStats(data.stats || null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load filters");
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { 
    categories, 
    priceRange, 
    dateRange,
    venues,
    locations,
    stats,
    loading, 
    error 
  };
};
