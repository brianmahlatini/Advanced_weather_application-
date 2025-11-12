import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CurrentWeather } from '../types/weather';

const API_KEY = "daac26c52c5cde564db91e49e596478c";

interface WeatherMapProps {
  weather: CurrentWeather | null;
  onLocationSelect: (lat: number, lon: number) => void;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ weather, onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([51.505, -0.09], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);

      // Add weather layer (OpenWeatherMap)
      const weatherLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
        {
          attribution: '© OpenWeatherMap',
          opacity: 0.6,
        }
      );

      const cloudsLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
        {
          attribution: '© OpenWeatherMap',
          opacity: 0.4,
        }
      );

      const precipitationLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
        {
          attribution: '© OpenWeatherMap',
          opacity: 0.5,
        }
      );

      // Layer control
      const baseLayers = {
        'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      };

      const overlayLayers = {
        'Temperature': weatherLayer,
        'Clouds': cloudsLayer,
        'Precipitation': precipitationLayer,
      };

      L.control.layers(baseLayers, overlayLayers).addTo(mapInstanceRef.current);

      // Add click handler
      mapInstanceRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
      });
    }

    // Update marker position when weather data changes
    if (weather && mapInstanceRef.current) {
      const { lat, lon } = weather.coord;

      // Remove existing marker
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }

      // Create custom marker icon
      const customIcon = L.divIcon({
        html: `
          <div class="weather-marker">
            <div class="marker-content">
              <div class="temperature">${Math.round(weather.main.temp)}°C</div>
              <div class="location">${weather.name}</div>
            </div>
          </div>
        `,
        className: 'custom-weather-marker',
        iconSize: [120, 60],
        iconAnchor: [60, 60],
      });

      // Add new marker
      markerRef.current = L.marker([lat, lon], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="weather-popup">
            <h3>${weather.name}, ${weather.sys.country}</h3>
            <p><strong>Temperature:</strong> ${Math.round(weather.main.temp)}°C</p>
            <p><strong>Feels like:</strong> ${Math.round(weather.main.feels_like)}°C</p>
            <p><strong>Weather:</strong> ${weather.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${weather.main.humidity}%</p>
            <p><strong>Wind:</strong> ${weather.wind.speed} m/s</p>
          </div>
        `);

      // Center map on location
      mapInstanceRef.current.setView([lat, lon], 10);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [weather, onLocationSelect]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>Weather Map</span>
        <span className="text-sm font-normal text-white/70">(Click anywhere to get weather)</span>
      </h3>
      <div
        ref={mapRef}
        className="w-full h-96 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      />
      <style jsx>{`
        .weather-marker {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 8px 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border: 2px solid #3b82f6;
          min-width: 100px;
          text-align: center;
        }
        .weather-marker .temperature {
          font-size: 18px;
          font-weight: bold;
          color: #1e40af;
          margin-bottom: 2px;
        }
        .weather-marker .location {
          font-size: 12px;
          color: #6b7280;
          white-space: nowrap;
        }
        .weather-popup {
          font-family: system-ui, -apple-system, sans-serif;
        }
        .weather-popup h3 {
          margin: 0 0 8px 0;
          color: #1e40af;
          font-size: 16px;
        }
        .weather-popup p {
          margin: 4px 0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default WeatherMap;