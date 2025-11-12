import React from 'react';
import { Cloud, Loader2, AlertCircle } from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import SearchBox from './components/SearchBox';
import WeatherCard from './components/WeatherCard';
import WeatherMap from './components/WeatherMap';
import WeatherForecast from './components/WeatherForecast';
import AirQualityCard from './components/AirQualityCard';
import WeatherAlerts from './components/WeatherAlerts';

const App: React.FC = () => {
  const { weather, loading, error, searchWeather, getWeatherByCoords } = useWeather();

  const handleLocationSearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please search for a city manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const backgroundClass = weather.current 
    ? weather.current.weather[0].main.toLowerCase().includes('rain') ||
      weather.current.weather[0].main.toLowerCase().includes('drizzle')
      ? 'from-gray-600 via-gray-700 to-gray-900'
      : weather.current.weather[0].main.toLowerCase().includes('clear')
      ? 'from-blue-400 via-blue-500 to-blue-700'
      : weather.current.weather[0].main.toLowerCase().includes('cloud')
      ? 'from-gray-500 via-gray-600 to-gray-800'
      : weather.current.weather[0].main.toLowerCase().includes('snow')
      ? 'from-blue-200 via-blue-300 to-blue-600'
      : weather.current.weather[0].main.toLowerCase().includes('thunder')
      ? 'from-purple-600 via-purple-700 to-gray-900'
      : 'from-blue-400 via-blue-500 to-blue-700'
    : 'from-blue-400 via-blue-500 to-blue-700';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundClass} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="h-10 w-10 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              WeatherPro Dashboard
            </h1>
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Comprehensive weather analysis with real-time data, forecasts, air quality monitoring, and interactive maps
          </p>
        </div>

        {/* Search Box */}
        <SearchBox
          onSearch={searchWeather}
          onLocationSearch={handleLocationSearch}
          loading={loading}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-3 text-white">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-lg">Loading weather data...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-6 border border-red-500/30 max-w-md mx-auto">
              <div className="flex items-center gap-3 text-white mb-2">
                <AlertCircle className="h-6 w-6 text-red-400" />
                <span className="font-semibold">Error</span>
              </div>
              <p className="text-white/90">{error}</p>
              {error.includes('API key') && (
                <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-200 text-sm">
                    <strong>Troubleshooting:</strong>
                  </p>
                  <ul className="text-yellow-200 text-sm mt-1 list-disc list-inside">
                    <li>Verify your API key is active at openweathermap.org</li>
                    <li>Check if your API key has the required permissions</li>
                    <li>Free accounts may have limited access to some features</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Weather Content */}
        {!loading && !error && weather.current && (
          <div className="space-y-8">
            {/* Weather Alerts */}
            {weather.oneCall?.alerts && (
              <WeatherAlerts alerts={weather.oneCall.alerts} />
            )}

            {/* Main Weather Card */}
            <WeatherCard weather={weather.current} oneCall={weather.oneCall} />

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Weather Map */}
              <WeatherMap
                weather={weather.current}
                onLocationSelect={getWeatherByCoords}
              />

              {/* Air Quality */}
              <AirQualityCard airQuality={weather.airQuality} />
            </div>

            {/* Weather Forecast */}
            <WeatherForecast
              forecast={weather.forecast}
              oneCall={weather.oneCall}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/20 text-center text-white/60">
          <p className="text-sm">
            Weather data provided by OpenWeatherMap • Built with React & TypeScript
          </p>
          <p className="text-xs mt-2">
            Click anywhere on the map to get weather data for that location
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;