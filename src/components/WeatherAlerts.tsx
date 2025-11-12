import React from 'react';
import { format } from 'date-fns';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { WeatherAlert } from '../types/weather';

interface WeatherAlertsProps {
  alerts: WeatherAlert[] | undefined;
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  const getAlertIcon = (event: string) => {
    const eventLower = event.toLowerCase();
    
    if (eventLower.includes('severe') || eventLower.includes('warning') || eventLower.includes('tornado')) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    } else if (eventLower.includes('watch') || eventLower.includes('advisory')) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    } else {
      return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getAlertColor = (event: string) => {
    const eventLower = event.toLowerCase();
    
    if (eventLower.includes('severe') || eventLower.includes('warning') || eventLower.includes('tornado')) {
      return 'border-red-500/50 bg-red-500/10';
    } else if (eventLower.includes('watch') || eventLower.includes('advisory')) {
      return 'border-yellow-500/50 bg-yellow-500/10';
    } else {
      return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-yellow-400" />
        Weather Alerts
      </h3>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={`${alert.event}-${alert.start}-${index}`}
            className={`rounded-xl p-4 border-2 ${getAlertColor(alert.event)}`}
          >
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.event)}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h4 className="text-white font-bold text-lg">{alert.event}</h4>
                  <div className="text-white/80 text-sm">
                    {alert.sender_name}
                  </div>
                </div>
                
                <div className="text-white/70 text-sm mb-3">
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <span>
                      <strong>From:</strong> {format(new Date(alert.start * 1000), 'MMM dd, yyyy HH:mm')}
                    </span>
                    <span>
                      <strong>To:</strong> {format(new Date(alert.end * 1000), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                </div>

                <div className="text-white/90 text-sm leading-relaxed">
                  {alert.description}
                </div>

                {alert.tags && alert.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {alert.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-white/20 rounded-full text-white/80 text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlerts;