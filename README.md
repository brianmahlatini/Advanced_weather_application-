# WeatherPro Dashboard

## Description

WeatherPro Dashboard is a comprehensive weather application built with React, TypeScript, and Vite. It provides real-time weather data, forecasts, air quality monitoring, interactive maps, and weather alerts using the OpenWeatherMap API.

## Features

- Real-time weather data for any location
- 5-day weather forecast
- Air quality monitoring
- Interactive weather map with Leaflet
- Weather alerts and warnings
- Geolocation support
- Responsive design with Tailwind CSS
- Dynamic background based on weather conditions

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Maps:** Leaflet
- **Date Handling:** date-fns
- **API:** OpenWeatherMap

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd weather-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## API Key Setup

This application uses the OpenWeatherMap API. The API key is currently hardcoded in `src/hooks/useWeather.ts` for demonstration purposes.

To use your own API key:

1. Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/)
2. Get your API key from the dashboard
3. Replace the `API_KEY` constant in `src/hooks/useWeather.ts` with your key:

   ```typescript
   const API_KEY = "your-api-key-here";
   ```

Note: Free API keys have rate limits. Upgrade to a paid plan for higher limits.

## Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

## Usage

- **Search by City:** Enter a city name in the search box
- **Use Current Location:** Click the location button to get weather for your current position
- **Interactive Map:** Click anywhere on the map to get weather data for that location
- **Weather Alerts:** View any active weather alerts at the top of the page
- **Air Quality:** Check the air quality index and components
- **Forecast:** View the 5-day weather forecast

The app automatically loads weather data for London on startup if geolocation is not available.

## Building for Production

To build the application for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Linting

Run the linter:

```bash
npm run lint