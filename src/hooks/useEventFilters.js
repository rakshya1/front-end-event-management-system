import { useEffect, useState } from "react";
import filterApi from "../api/filterApi";

export const useFilters = () => {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      try {
        const res = await filterApi.getFilters();
        const data = res.data?.data || res.data;

        setCategories(data.categories.map(c => c.name));
        setPriceRange(data.price_range || { min: 0, max: 0 });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load filters");
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { categories, priceRange, loading, error };
};
