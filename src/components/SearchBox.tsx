import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  onLocationSearch: () => void;
  loading: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, onLocationSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Popular cities for suggestions
  const popularCities = [
    'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Singapore',
    'Mumbai', 'Berlin', 'Toronto', 'Los Angeles', 'Barcelona', 'Amsterdam'
  ];

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length > 2) {
      debounceRef.current = setTimeout(() => {
        const filtered = popularCities.filter(city =>
          city.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
      setQuery(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (city: string) => {
    setQuery(city);
    handleSearch(city);
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      onLocationSearch();
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for a city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length > 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              disabled={loading}
              aria-label="Search for weather by city name"
            />
            {loading && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white h-5 w-5 animate-spin" />
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl border border-white/30 shadow-xl z-10 max-h-60 overflow-y-auto">
              {suggestions.map((city, index) => (
                <button
                  key={city}
                  onClick={() => handleSuggestionClick(city)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl text-gray-800"
                  tabIndex={showSuggestions ? 0 : -1}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{city}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleLocationClick}
          disabled={loading}
          className="px-4 py-3 bg-blue-500/80 hover:bg-blue-600/80 disabled:bg-gray-500/50 backdrop-blur-md border border-white/30 rounded-xl text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[52px] flex items-center justify-center"
          aria-label="Get weather for current location"
          title="Use current location"
        >
          <MapPin className="h-5 w-5" />
        </button>

        <button
          onClick={() => handleSearch()}
          disabled={loading || !query.trim()}
          className="px-6 py-3 bg-green-500/80 hover:bg-green-600/80 disabled:bg-gray-500/50 backdrop-blur-md border border-white/30 rounded-xl text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Search weather"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBox;