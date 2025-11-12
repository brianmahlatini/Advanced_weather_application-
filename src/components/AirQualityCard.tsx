import React from 'react';
import { Wind, AlertTriangle, CheckCircle } from 'lucide-react';
import { AirQuality } from '../types/weather';

interface AirQualityCardProps {
  airQuality: AirQuality | null;
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  if (!airQuality || !airQuality.list.length) return null;

  const data = airQuality.list[0];
  const aqi = data.main.aqi;
  const components = data.components;

  const getAQIInfo = (aqi: number) => {
    switch (aqi) {
      case 1:
        return { label: 'Good', color: 'text-green-400', bgColor: 'bg-green-500/20', icon: CheckCircle };
      case 2:
        return { label: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', icon: CheckCircle };
      case 3:
        return { label: 'Moderate', color: 'text-orange-400', bgColor: 'bg-orange-500/20', icon: AlertTriangle };
      case 4:
        return { label: 'Poor', color: 'text-red-400', bgColor: 'bg-red-500/20', icon: AlertTriangle };
      case 5:
        return { label: 'Very Poor', color: 'text-purple-400', bgColor: 'bg-purple-500/20', icon: AlertTriangle };
      default:
        return { label: 'Unknown', color: 'text-gray-400', bgColor: 'bg-gray-500/20', icon: AlertTriangle };
    }
  };

  const aqiInfo = getAQIInfo(aqi);
  const IconComponent = aqiInfo.icon;

  const pollutants = [
    { name: 'CO', value: components.co, unit: 'μg/m³', label: 'Carbon Monoxide' },
    { name: 'NO₂', value: components.no2, unit: 'μg/m³', label: 'Nitrogen Dioxide' },
    { name: 'O₃', value: components.o3, unit: 'μg/m³', label: 'Ozone' },
    { name: 'SO₂', value: components.so2, unit: 'μg/m³', label: 'Sulfur Dioxide' },
    { name: 'PM2.5', value: components.pm2_5, unit: 'μg/m³', label: 'Fine Particles' },
    { name: 'PM10', value: components.pm10, unit: 'μg/m³', label: 'Coarse Particles' },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Wind className="h-6 w-6" />
        Air Quality
      </h3>

      {/* AQI Overview */}
      <div className={`${aqiInfo.bgColor} rounded-xl p-4 mb-6 border border-white/20`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <IconComponent className={`h-6 w-6 ${aqiInfo.color}`} />
            <span className="text-white font-bold text-lg">{aqiInfo.label}</span>
          </div>
          <div className={`text-2xl font-bold ${aqiInfo.color}`}>
            AQI {aqi}
          </div>
        </div>
        <div className="text-white/80 text-sm">
          {aqi <= 2 && "Air quality is satisfactory for most people."}
          {aqi === 3 && "Moderate air quality. Sensitive individuals should consider reducing outdoor activities."}
          {aqi >= 4 && "Poor air quality. Everyone should limit outdoor activities."}
        </div>
      </div>

      {/* Pollutant Details */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pollutants.map((pollutant) => (
          <div key={pollutant.name} className="bg-white/10 rounded-xl p-3 border border-white/20">
            <div className="text-white/80 text-xs mb-1">{pollutant.label}</div>
            <div className="text-white font-bold text-lg mb-1">
              {pollutant.name}
            </div>
            <div className="text-white/70 text-sm">
              {pollutant.value.toFixed(1)} {pollutant.unit}
            </div>
          </div>
        ))}
      </div>

      {/* AQI Scale Reference */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="text-white/80 text-sm mb-2">Air Quality Index Scale:</div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">1: Good</span>
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">2: Fair</span>
          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">3: Moderate</span>
          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">4: Poor</span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">5: Very Poor</span>
        </div>
      </div>
    </div>
  );
};

export default AirQualityCard;