import { useFilters } from "../hooks/useEventFilters";

const FilterPanel = ({ filters, onFilterChange }) => {
  const { categories, priceRange, loading } = useFilters();

  const handleFilterChange = (filterType, value) => {
    onFilterChange({ ...filters, [filterType]: value });
  };

  if (loading) return <p>Loading filters...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Filters</h3>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Event Type
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Price Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Price Range (NPR)
        </label>
        <div className="space-y-2">
          <div>
            <input
              type="number"
              placeholder={priceRange.min}
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder={priceRange.max}
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Event Date
        </label>
        <input
          type="date"
          value={filters.date || ''}
          onChange={(e) => handleFilterChange('date', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => onFilterChange({ category: '', location: '', minPrice: '', maxPrice: '', date: '' })}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterPanel;
