import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import EventCard from '../components/EventCard';
import eventApi from '../api/eventApi';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category_id: '',
    min_price: '',
    max_price: '',
    start_date: '',
    end_date: '',
    sort_by: 'latest',
    availability: 'all'
  });

  // Fetch events with filters
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        console.log('🔍 [Events] Fetching events...');
        console.log('🔍 [Events] Search term:', searchTerm);
        console.log('🔍 [Events] Filters:', filters);
        
        // Build query params
        const params = {
          search: searchTerm || undefined,
          category_id: filters.category_id || undefined,
          min_price: filters.min_price || undefined,
          max_price: filters.max_price || undefined,
          start_date: filters.start_date || undefined,
          end_date: filters.end_date || undefined,
          sort_by: filters.sort_by || 'latest',
          availability: filters.availability !== 'all' ? filters.availability : undefined,
        };
        
        // Remove undefined values
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
        
        console.log('🔍 [Events] API Params:', params);
        
        const res = await eventApi.getAll(params);
        
        console.log('✅ [Events] API Response:', res);
        console.log('✅ [Events] Events data:', res.data);
        console.log('✅ [Events] Events array:', res.data.data || res.data);
        
        setEvents(res.data.data || res.data);
        setError(null);
      } catch (err) {
        console.error('❌ [Events] Error fetching events:', err);
        console.error('❌ [Events] Error response:', err.response);
        setError(err.response?.data?.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  return (
    <div className="min-h-[calc(100vh-280px)] bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Discover Events
              </h1>
              <p className="text-slate-600">Find and book amazing events</p>
            </div>
            {!user && (
              <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg">
                <span className="text-amber-800 text-sm">
                  Guest mode • Login to register
                </span>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="space-y-4">
                <div className="h-5 bg-slate-200 rounded w-32 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden border border-slate-200 animate-pulse">
                      <div className="h-48 bg-slate-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg p-12 text-center border border-red-200">
                <div className="text-5xl mb-4">⚠️</div>
                <p className="text-red-600 text-lg font-semibold mb-2">Failed to load events</p>
                <p className="text-slate-600 text-sm mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center border border-slate-200">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-900 text-lg font-semibold mb-2">No events found</p>
                <p className="text-slate-600 text-sm mb-6">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      category_id: '',
                      min_price: '',
                      max_price: '',
                      start_date: '',
                      end_date: '',
                      sort_by: 'latest',
                      availability: 'all'
                    });
                  }}
                  className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between text-sm">
                  <span className="text-slate-700 font-medium">
                    {events.length} event{events.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-slate-500">
                    {filters.sort_by === 'latest' && 'Latest'}
                    {filters.sort_by === 'oldest' && 'Oldest'}
                    {filters.sort_by === 'price_low' && 'Price: Low → High'}
                    {filters.sort_by === 'price_high' && 'Price: High → Low'}
                    {filters.sort_by === 'popular' && 'Most Popular'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {events.map((event) => (
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
