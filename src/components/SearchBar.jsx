const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Search events by title, location, or description..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
      />
    </div>
  );
};

export default SearchBar;
