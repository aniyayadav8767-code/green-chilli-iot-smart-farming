import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Gauge,
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  Snowflake,
  CloudFog,
  MapPin,
  Loader2,
  RefreshCw,
  AlertCircle,
  MapPinOff,
} from 'lucide-react';

const getWeatherMeta = (code) => {
  switch (true) {
    case code === 0:
      return { condition: 'Clear Sky', icon: Sun };
    case code >= 1 && code <= 3:
      return { condition: 'Partly Cloudy', icon: CloudSun };
    case code === 45 || code === 48:
      return { condition: 'Foggy', icon: CloudFog };
    case (code >= 51 && code <= 67) || (code >= 80 && code <= 82):
      return { condition: 'Rainy', icon: CloudRain };
    case (code >= 71 && code <= 77) || (code >= 85 && code <= 86):
      return { condition: 'Snowy', icon: Snowflake };
    case code >= 95 && code <= 99:
      return { condition: 'Thunderstorm', icon: CloudLightning };
    default:
      return { condition: 'Cloudy', icon: Cloud };
  }
};

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchTelemetry = useCallback(async (lat, lon) => {
    try {
      setErrorMessage('');

      let locationLabel = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
      try {
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          const city = geoData.locality || geoData.city || geoData.principalSubdivision;
          const country = geoData.countryName;
          if (city && country) locationLabel = `${city}, ${country}`;
          else if (city) locationLabel = city;
        }
      } catch {
        // Fallback lat/lon on geocode error
      }

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code&hourly=precipitation_probability&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );

      if (!weatherRes.ok) {
        throw new Error('Failed to fetch weather telemetry for your location.');
      }

      const data = await weatherRes.json();
      const currentMeta = getWeatherMeta(data.current.weather_code);

      setWeatherData({
        location: locationLabel,
        temp: Math.round(data.current.temperature_2m),
        condition: currentMeta.condition,
        ConditionIcon: currentMeta.icon,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: `${data.current.wind_direction_10m}°`,
        pressure: data.current.surface_pressure,
        rainProbability: data.hourly.precipitation_probability[0] ?? 0,
        high: Math.round(data.daily.temperature_2m_max[0]),
        low: Math.round(data.daily.temperature_2m_min[0]),
      });
      setPermissionDenied(false);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred while fetching live weather.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const requestLiveLocation = useCallback((isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    setPermissionDenied(false);

    if (!navigator.geolocation) {
      setPermissionDenied(true);
      setErrorMessage('Geolocation is not supported by your browser.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchTelemetry(position.coords.latitude, position.coords.longitude);
      },
      (geoError) => {
        setLoading(false);
        setRefreshing(false);
        setPermissionDenied(true);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setErrorMessage('Location permission was denied. Please allow GPS location access in your browser settings.');
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setErrorMessage('Location information is unavailable on your device.');
        } else {
          setErrorMessage('Location request timed out. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [fetchTelemetry]);

  useEffect(() => {
    requestLiveLocation();
  }, [requestLiveLocation]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#38A968]" />
        <div className="text-center">
          <p className="text-sm text-black">Requesting GPS Location...</p>
          <p className="text-xs text-slate-500">Please grant location permission if prompted.</p>
        </div>
      </div>
    );
  }

  if (permissionDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#38A968]">
          <MapPinOff className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-1">
          <h2 className="text-lg text-black">Live GPS Location Required</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {errorMessage || 'Live weather details require access to your device location.'}
          </p>
        </div>
        <button
          onClick={() => requestLiveLocation(false)}
          className="flex items-center gap-2 text-xs px-5 py-3 bg-[#38A968] text-white hover:bg-[#2f8f57] transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Allow Location & Try Again
        </button>
      </div>
    );
  }

  const HeroConditionIcon = weatherData?.ConditionIcon || CloudSun;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 p-2">
      {/* Rectangular Top Bar Header */}
      <div className="w-full bg-[#38A968] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <HeroConditionIcon className="w-7 h-7 text-white" />
          <h1 className="text-2xl text-white">Weather</h1>
        </div>
        <button
          onClick={() => requestLiveLocation(true)}
          disabled={refreshing}
          className="p-2 bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50 cursor-pointer text-white"
          title="Refresh GPS Location"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {errorMessage && (
        <div className="p-3.5 text-xs text-amber-900 bg-amber-50 border border-amber-200 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {weatherData && (
        /* Big Rectangle Weather Card */
        <div className="w-full border border-emerald-100 bg-white shadow-md p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Main Weather Details */}
          <div className="md:col-span-5 space-y-3 border-b md:border-b-0 md:border-r border-slate-100 pb-5 md:pb-0 md:pr-6">
            <span className="text-xs uppercase tracking-widest text-[#38A968] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#38A968]" />
              {weatherData.location}
            </span>
            <div className="flex items-center gap-5">
              <HeroConditionIcon className="w-16 h-16 text-[#38A968]" />
              <div>
                <span className="text-6xl text-black tracking-tight block">
                  {weatherData.temp}°C
                </span>
                <span className="text-base text-black block">{weatherData.condition}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              High: <span className="text-black">{weatherData.high}°C</span> • Low:{' '}
              <span className="text-black">{weatherData.low}°C</span>
            </p>
          </div>

          {/* Metrics Grid - Normal Regular Font Values */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50/40 border border-emerald-100 space-y-1">
              <span className="text-xs text-black flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-[#38A968]" /> Wind Speed
              </span>
              <span className="text-base text-black block">{weatherData.windSpeed} km/h</span>
            </div>

            <div className="p-4 bg-emerald-50/40 border border-emerald-100 space-y-1">
              <span className="text-xs text-black flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#38A968]" /> Humidity
              </span>
              <span className="text-base text-black block">{weatherData.humidity}%</span>
            </div>

            <div className="p-4 bg-emerald-50/40 border border-emerald-100 space-y-1">
              <span className="text-xs text-black flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-[#38A968]" /> Air Pressure
              </span>
              <span className="text-base text-black block">{weatherData.pressure} hPa</span>
            </div>

            <div className="p-4 bg-emerald-50/40 border border-emerald-100 space-y-1">
              <span className="text-xs text-black flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-[#38A968]" /> Precip. Chance
              </span>
              <span className="text-base text-black block">{weatherData.rainProbability}%</span>
            </div>

            <div className="p-4 bg-emerald-50/40 border border-emerald-100 space-y-1 sm:col-span-2">
              <span className="text-xs text-black block">Wind Bearing</span>
              <span className="text-base text-black block">{weatherData.windDirection}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}