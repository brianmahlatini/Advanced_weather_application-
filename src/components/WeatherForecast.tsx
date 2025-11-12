import React from 'react';
import { format } from 'date-fns';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudRain, 
  Snowflake,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { WeatherForecast as ForecastType, OneCallWeather } from '../types/weather';

interface WeatherForecastProps {
  forecast: ForecastType | null;
  oneCall: OneCallWeather | null;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast, oneCall }) => {
  const getWeatherIcon = (iconCode: string, size: 'sm' | 'md' = 'md') => {
    const sizeClass = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
    
    const iconMap: Record<string, React.ReactNode> = {
      '01d': <Sun className={`${sizeClass} text-yellow-400`} />,
      '01n': <Moon className={`${sizeClass} text-blue-200`} />,
      '02d': <Cloud className={`${sizeClass} text-gray-400`} />,
      '02n': <Cloud className={`${sizeClass} text-gray-300`} />,
      '03d': <Cloud className={`${sizeClass} text-gray-500`} />,
      '03n': <Cloud className={`${sizeClass} text-gray-400`} />,
      '04d': <Cloud className={`${sizeClass} text-gray-600`} />,
      '04n': <Cloud className={`${sizeClass} text-gray-500`} />,
      '09d': <CloudRain className={`${sizeClass} text-blue-500`} />,
      '09n': <CloudRain className={`${sizeClass} text-blue-400`} />,
      '10d': <CloudRain className={`${sizeClass} text-blue-600`} />,
      '10n': <CloudRain className={`${sizeClass} text-blue-500`} />,
      '11d': <CloudRain className={`${sizeClass} text-purple-500`} />,
      '11n': <CloudRain className={`${sizeClass} text-purple-400`} />,
      '13d': <Snowflake className={`${sizeClass} text-blue-200`} />,
      '13n': <Snowflake className={`${sizeClass} text-blue-100`} />,
    };

    return iconMap[iconCode] || <Sun className={`${sizeClass} text-yellow-400`} />;
  };

  if (!forecast && !oneCall) return null;

  return (
    <div className="space-y-6">
      {/* 24-Hour Forecast */}
      {oneCall?.hourly && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">24-Hour Forecast</h3>
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
              {oneCall.hourly.slice(0, 24).map((hour, index) => (
                <div
                  key={hour.dt}
                  className="bg-white/10 rounded-xl p-4 border border-white/20 min-w-[120px] text-center"
                >
                  <div className="text-white/80 text-sm mb-2">
                    {index === 0 ? 'Now' : format(new Date(hour.dt * 1000), 'HH:mm')}
                  </div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(hour.weather[0].icon, 'sm')}
                  </div>
                  <div className="text-white font-bold text-lg mb-1">
                    {Math.round(hour.temp)}°
                  </div>
                  <div className="text-white/60 text-xs mb-2">
                    {Math.round(hour.pop * 100)}% rain
                  </div>
                  <div className="text-white/60 text-xs">
                    {hour.wind_speed.toFixed(1)} m/s
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5-Day Forecast */}
      {oneCall?.daily && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">7-Day Forecast</h3>
          <div className="space-y-3">
            {oneCall.daily.slice(0, 7).map((day, index) => (
              <div
                key={day.dt}
                className="bg-white/10 rounded-xl p-4 border border-white/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-white font-medium min-w-[100px]">
                    {index === 0 ? 'Today' : format(new Date(day.dt * 1000), 'EEEE')}
                  </div>
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(day.weather[0].icon)}
                    <div className="text-white/80 capitalize">
                      {day.weather[0].description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-blue-400 text-sm">
                    {Math.round(day.pop * 100)}%
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-red-400" />
                      <span className="text-white font-bold">
                        {Math.round(day.temp.max)}°
                      </span>
                    </div>
                    <span className="text-white/60">/</span>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-4 w-4 text-blue-400" />
                      <span className="text-white/80">
                        {Math.round(day.temp.min)}°
                      </span>
                    </div>
                  </div>

                  <div className="text-white/60 text-sm min-w-[80px] text-right">
                    {day.wind_speed.toFixed(1)} m/s
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5-Day Detailed Forecast (fallback) */}
      {forecast && !oneCall?.daily && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">5-Day Forecast</h3>
          <div className="grid gap-4">
            {/* Group forecast items by day */}
            {Object.entries(
              forecast.list.reduce((acc, item) => {
                const date = format(new Date(item.dt * 1000), 'yyyy-MM-dd');
                if (!acc[date]) acc[date] = [];
                acc[date].push(item);
                return acc;
              }, {} as Record<string, typeof forecast.list>)
            )
              .slice(0, 5)
              .map(([date, items]) => {
                const dayItem = items.find(item => item.sys.pod === 'd') || items[0];
                const nightItem = items.find(item => item.sys.pod === 'n');
                
                return (
                  <div key={date} className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white font-medium">
                        {format(new Date(date), 'EEEE, MMM do')}
                      </div>
                      <div className="text-blue-400 text-sm">
                        {Math.round(dayItem.pop * 100)}% chance of rain
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Day */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getWeatherIcon(dayItem.weather[0].icon, 'sm')}
                          <span className="text-white/80 text-sm">Day</span>
                        </div>
                        <div className="text-white font-bold">
                          {Math.round(dayItem.main.temp)}°C
                        </div>
                      </div>
                      
                      {/* Night */}
                      {nightItem && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getWeatherIcon(nightItem.weather[0].icon, 'sm')}
                            <span className="text-white/80 text-sm">Night</span>
                          </div>
                          <div className="text-white font-bold">
                            {Math.round(nightItem.main.temp)}°C
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 text-white/70 text-sm capitalize">
                      {dayItem.weather[0].description}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;