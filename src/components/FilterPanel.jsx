import { useFilters } from "../hooks/useEventFilters";

const FilterPanel = ({ filters, onFilterChange }) => {
  const { categories, priceRange, dateRange, stats, loading } = useFilters();

  const handleFilterChange = (filterType, value) => {
    onFilterChange({ ...filters, [filterType]: value });
  };

  const clearFilters = () => {
    onFilterChange({ 
      category_id: '', 
      min_price: '', 
      max_price: '', 
      start_date: '',
      end_date: '',
      sort_by: 'latest',
      availability: 'all'
    });
  };

  const hasActiveFilters = filters.category_id || filters.min_price || filters.max_price || 
                          filters.start_date || filters.end_date || filters.availability !== 'all' || filters.sort_by !== 'latest';

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-base font-semibold text-slate-900">Filters</h3>
        {stats && (
          <p className="text-xs text-slate-600 mt-1">{stats.upcoming_events} events</p>
        )}
      </div>

      {/* Filter Content */}
      <div className="p-5 space-y-5">
        
        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Availability</label>
          <select
            value={filters.availability || 'all'}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Events</option>
            <option value="available">Available</option>
            <option value="filling_fast">Filling Fast</option>
            <option value="free">Free Events</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
          <select
            value={filters.category_id || ''}
            onChange={(e) => handleFilterChange('category_id', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
          <div className="grid grid-cols-2 gap-2 mb-1">
            <input
              type="number"
              placeholder="Min"
              value={filters.min_price || ''}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.max_price || ''}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {priceRange && (
            <p className="text-xs text-slate-500 mt-1">
              Range: NPR {priceRange.min} - {priceRange.max}
            </p>
          )}
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              min={dateRange?.min}
              max={dateRange?.max}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              min={filters.start_date || dateRange?.min}
              max={dateRange?.max}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {dateRange && (
            <p className="text-xs text-slate-500 mt-1">
              Available: {dateRange.min} to {dateRange.max}
            </p>
          )}
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
          <select
            value={filters.sort_by || 'latest'}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Clear Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
