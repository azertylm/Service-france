import React, { useState } from 'react';
import { Compass, Navigation, Zap, ShieldCheck, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { GeoCoordinate } from '../../types/patrimoine';

interface BatteryFriendlyCompassProps {
  targetCoords: GeoCoordinate;
  targetName: string;
}

// Haversine distance in meters
function calculateDistanceMeters(coord1: GeoCoordinate, coord2: GeoCoordinate): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (coord1.lat * Math.PI) / 180;
  const phi2 = (coord2.lat * Math.PI) / 180;
  const deltaPhi = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLambda = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Bearing angle in degrees (0 = North, 90 = East, 180 = South, 270 = West)
function calculateBearing(coord1: GeoCoordinate, coord2: GeoCoordinate): number {
  const y = Math.sin(((coord2.lng - coord1.lng) * Math.PI) / 180) * Math.cos((coord2.lat * Math.PI) / 180);
  const x =
    Math.cos((coord1.lat * Math.PI) / 180) * Math.sin((coord2.lat * Math.PI) / 180) -
    Math.sin((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.cos(((coord2.lng - coord1.lng) * Math.PI) / 180);
  const theta = Math.atan2(y, x);
  return (theta * 180) / Math.PI >= 0 ? (theta * 180) / Math.PI : ((theta * 180) / Math.PI + 360) % 360;
}

function getCompassCardinal(bearing: number): string {
  const directions = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

export const BatteryFriendlyCompass: React.FC<BatteryFriendlyCompassProps> = ({
  targetCoords,
  targetName,
}) => {
  const [userCoords, setUserCoords] = useState<GeoCoordinate | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("La géolocalisation n'est pas prise en charge par votre navigateur.");
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    // One-shot getCurrentPosition to save battery and protect privacy
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        if (err.code === 1) {
          setGeoError("Accès à la position refusé. Vous pouvez autoriser la position pour vous orienter.");
        } else {
          setGeoError("Position temporairement indisponible.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // cache 1 minute to avoid waking up GPS chip repeatedly
      }
    );
  };

  const distanceMeters = userCoords ? calculateDistanceMeters(userCoords, targetCoords) : null;
  const bearing = userCoords ? calculateBearing(userCoords, targetCoords) : null;
  const cardinal = bearing !== null ? getCompassCardinal(bearing) : null;

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 sm:p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-semibold tracking-wide uppercase text-slate-200">
            Guidage sobre & respectueux de la batterie
          </h4>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
          <Zap className="w-3 h-3" />
          <span>0% traçage permanent</span>
        </div>
      </div>

      {userCoords && distanceMeters !== null && bearing !== null ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/70 p-4 rounded-lg border border-slate-800">
          <div className="flex items-center gap-3">
            {/* Visual compass needle */}
            <div
              className="w-12 h-12 rounded-full border border-amber-400/30 bg-slate-900 flex items-center justify-center shrink-0 shadow-inner"
              style={{ transform: `rotate(${bearing}deg)` }}
              title={`Cap ${Math.round(bearing)}°`}
            >
              <Navigation className="w-6 h-6 text-amber-400 drop-shadow-xs" />
            </div>

            <div>
              <div className="text-lg font-bold text-white font-mono">
                {distanceMeters < 1000 ? `${distanceMeters} m` : `${(distanceMeters / 1000).toFixed(1)} km`}
              </div>
              <div className="text-xs text-slate-300">
                Direction <strong className="text-amber-300 font-semibold">{cardinal}</strong> ({Math.round(bearing)}°) vers {targetName}
              </div>
            </div>
          </div>

          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="w-full sm:w-auto px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>Actualiser (1 point)</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/50 p-3.5 rounded-lg border border-slate-800/80">
          <div className="text-xs text-slate-300 leading-relaxed max-w-md">
            Un simple clic interroge votre GPS ponctuellement puis éteint aussitôt la puce pour ne pas vider votre batterie lors de votre promenade.
          </div>
          <button
            onClick={handleGetLocation}
            disabled={isLocating}
            className="w-full sm:w-auto px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shadow-sm"
          >
            {isLocating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Recherche du cap...</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5" />
                <span>Situer ce monument</span>
              </>
            )}
          </button>
        </div>
      )}

      {geoError && (
        <div className="p-2.5 rounded-md bg-rose-950/50 border border-rose-900 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{geoError}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-slate-400" />
          Coordonnées GPS : {targetCoords.lat.toFixed(4)}, {targetCoords.lng.toFixed(4)}
        </span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${targetCoords.lat},${targetCoords.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:underline flex items-center gap-1"
        >
          Ouvrir dans Maps externe ↗
        </a>
      </div>
    </div>
  );
};
