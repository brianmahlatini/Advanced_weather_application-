import React from 'react';
import { format } from 'date-fns';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sun, 
  Moon,
  CloudRain,
  Cloud,
  Snowflake
} from 'lucide-react';
import { CurrentWeather, OneCallWeather } from '../types/weather';

interface WeatherCardProps {
  weather: CurrentWeather;
  oneCall?: OneCallWeather;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, oneCall }) => {
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      '01d': <Sun className="h-16 w-16 text-yellow-400" />,
      '01n': <Moon className="h-16 w-16 text-blue-200" />,
      '02d': <Cloud className="h-16 w-16 text-gray-400" />,
      '02n': <Cloud className="h-16 w-16 text-gray-300" />,
      '03d': <Cloud className="h-16 w-16 text-gray-500" />,
      '03n': <Cloud className="h-16 w-16 text-gray-400" />,
      '04d': <Cloud className="h-16 w-16 text-gray-600" />,
      '04n': <Cloud className="h-16 w-16 text-gray-500" />,
      '09d': <CloudRain className="h-16 w-16 text-blue-500" />,
      '09n': <CloudRain className="h-16 w-16 text-blue-400" />,
      '10d': <CloudRain className="h-16 w-16 text-blue-600" />,
      '10n': <CloudRain className="h-16 w-16 text-blue-500" />,
      '11d': <CloudRain className="h-16 w-16 text-purple-500" />,
      '11n': <CloudRain className="h-16 w-16 text-purple-400" />,
      '13d': <Snowflake className="h-16 w-16 text-blue-200" />,
      '13n': <Snowflake className="h-16 w-16 text-blue-100" />,
    };

    return iconMap[iconCode] || <Sun className="h-16 w-16 text-yellow-400" />;
  };

  const getUVIndexColor = (uvi: number) => {
    if (uvi <= 2) return 'text-green-500';
    if (uvi <= 5) return 'text-yellow-500';
    if (uvi <= 7) return 'text-orange-500';
    if (uvi <= 10) return 'text-red-500';
    return 'text-purple-500';
  };

  const getUVIndexLabel = (uvi: number) => {
    if (uvi <= 2) return 'Low';
    if (uvi <= 5) return 'Moderate';
    if (uvi <= 7) return 'High';
    if (uvi <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
        {/* Main Weather Info */}
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold text-white mb-2">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-white/80 mb-4">
            {format(new Date(weather.dt * 1000), 'EEEE, MMMM do, yyyy')}
          </p>
          
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
            {getWeatherIcon(weather.weather[0].icon)}
            <div>
              <div className="text-6xl font-bold text-white">
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="text-xl text-white/80 capitalize">
                {weather.weather[0].description}
              </div>
            </div>
          </div>
          
          <div className="text-white/80">
            <p>Feels like {Math.round(weather.main.feels_like)}°C</p>
            <p>High: {Math.round(weather.main.temp_max)}°C • Low: {Math.round(weather.main.temp_min)}°C</p>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Thermometer className="h-5 w-5 text-red-400" />
              <span className="text-white/80 text-sm">Feels Like</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.round(weather.main.feels_like)}°C
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Droplets className="h-5 w-5 text-blue-400" />
              <span className="text-white/80 text-sm">Humidity</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {weather.main.humidity}%
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Wind className="h-5 w-5 text-green-400" />
              <span className="text-white/80 text-sm">Wind Speed</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {weather.wind.speed} m/s
            </div>
            <div className="text-sm text-white/60">
              {weather.wind.deg}°
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="h-5 w-5 text-purple-400" />
              <span className="text-white/80 text-sm">Visibility</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {(weather.visibility / 1000).toFixed(1)} km
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Gauge className="h-5 w-5 text-orange-400" />
              <span className="text-white/80 text-sm">Pressure</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {weather.main.pressure} hPa
            </div>
          </div>

          {oneCall?.current.uvi !== undefined && (
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Sun className="h-5 w-5 text-yellow-400" />
                <span className="text-white/80 text-sm">UV Index</span>
              </div>
              <div className={`text-2xl font-bold ${getUVIndexColor(oneCall.current.uvi)}`}>
                {oneCall.current.uvi.toFixed(1)}
              </div>
              <div className="text-sm text-white/60">
                {getUVIndexLabel(oneCall.current.uvi)}
              </div>
            </div>
          )}

          {oneCall?.current.dew_point !== undefined && (
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Droplets className="h-5 w-5 text-cyan-400" />
                <span className="text-white/80 text-sm">Dew Point</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {Math.round(oneCall.current.dew_point)}°C
              </div>
            </div>
          )}

          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Cloud className="h-5 w-5 text-gray-400" />
              <span className="text-white/80 text-sm">Cloudiness</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {weather.clouds.all}%
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Sun className="h-5 w-5 text-yellow-400" />
              <span className="text-white/80 text-sm">Sunrise</span>
            </div>
            <div className="text-lg font-bold text-white">
              {format(new Date(weather.sys.sunrise * 1000), 'HH:mm')}
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Moon className="h-5 w-5 text-blue-200" />
              <span className="text-white/80 text-sm">Sunset</span>
            </div>
            <div className="text-lg font-bold text-white">
              {format(new Date(weather.sys.sunset * 1000), 'HH:mm')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;