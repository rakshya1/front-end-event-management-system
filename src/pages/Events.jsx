import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import EventCard from '../components/EventCard';
import { useEvents } from '../hooks/useEvents';

const Events = () => {
  const { user } = useAuth();
  const { events, loading, error } = useEvents(); // fetch from API
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    date: '',
  });

  // Show loading state
  if (loading) {
    return <p className="text-center py-20">Loading events...</p>;
  }

  // Show error state
  if (error) {
    return <p className="text-center py-20 text-red-500">{error}</p>;
  }

  // Apply all filters
  const filteredEvents = events.filter((event) => {
    // Search filter
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.venue && event.venue.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Category filter
    if (filters.category && event.category?.name !== filters.category) return false;

    // Location filter
    if (filters.location && !(event.venue || '').includes(filters.location)) return false;

    // Price filter
    const price = parseFloat(event.discount_cost || event.regular_cost || 0);
    if (filters.minPrice && price < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && price > parseFloat(filters.maxPrice)) return false;

    // Date filter
    if (filters.date && event.start_date !== filters.date) return false;

    return true;
  });

  return (
    <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">🎉 Discover Events</h1>
          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg text-sm">
              <span className="text-yellow-800">Guest mode - Login to register for events</span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-slate-500 text-lg mb-2">No events found</p>
                <p className="text-slate-400 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-slate-600">
                  Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
