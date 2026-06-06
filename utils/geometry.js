const R_MILES = 3958.8;
const R_METERS = 6371000;

const toRad = (deg) => (deg * Math.PI) / 180;

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R_MILES * c;
};

export const calculatePathLength = (points) => {
  if (!points || points.length < 2) return 0;
  
  let totalMiles = 0;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    totalMiles += haversineDistance(p1.lat, p1.lon, p2.lat, p2.lon);
  }
  
  return totalMiles;
};

export const detectRouteType = (points) => {
  if (!points || points.length < 3) return 'point-to-point';
  
  const start = points[0];
  const end = points[points.length - 1];
  
  const closingDistance = haversineDistance(start.lat, start.lon, end.lat, end.lon);
  
  if (closingDistance < 0.05) {
    return 'loop';
  }
  
  return 'point-to-point';
};

export const formatTrailLength = (miles) => {
  if (miles == null || miles === 0) return null;
  
  if (miles < 0.1) {
    return 'Less than 0.1 mi';
  }
  
  if (miles < 10) {
    return `${miles.toFixed(1)} mi`;
  }
  
  return `${Math.round(miles)} mi`;
};