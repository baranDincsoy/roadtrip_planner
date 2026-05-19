const NPS_API_KEY = process.env.EXPO_PUBLIC_NPS_API_KEY;
const NPS_BASE_URL = 'https://developer.nps.gov/api/v1';

const CATEGORY_CONFIG = {
  'National Park': { color: '#d32f2f', icon: '🏔️' },
  'National Seashore': { color: '#0288d1', icon: '🌊' },
  'National Historic Site': { color: '#7b1fa2', icon: '🏛️' },
  'National Historical Park': { color: '#7b1fa2', icon: '🏛️' },
  'National Monument': { color: '#616161', icon: '⛰️' },
  'National Recreation Area': { color: '#f57c00', icon: '🏕️' },
  'National Preserve': { color: '#388e3c', icon: '🌲' },
  'National Memorial': { color: '#5d4037', icon: '🕊️' },
  'National Battlefield': { color: '#c62828', icon: '⚔️' },
  'National Lakeshore': { color: '#0277bd', icon: '🏞️' },
  'National Parkway': { color: '#fbc02d', icon: '🛣️' },
  'National River': { color: '#0097a7', icon: '🌊' },
  'National Scenic Trail': { color: '#558b2f', icon: '🥾' },
};

const DEFAULT_CONFIG = { color: '#757575', icon: '📍' };

const getCategoryConfig = (designation) => {
  return CATEGORY_CONFIG[designation] || DEFAULT_CONFIG;
};

export const fetchNationalParks = async () => {
  try {
    const url = `${NPS_BASE_URL}/parks?limit=500&api_key=${NPS_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NPS API error: ${response.status}`);
    }

    const data = await response.json();

    const parks = data.data
      .map((park) => {
        const config = getCategoryConfig(park.designation);
        return {
          id: park.id,
          name: park.fullName,
          shortName: park.name,
          latitude: parseFloat(park.latitude),
          longitude: parseFloat(park.longitude),
          description: park.description,
          states: park.states,
          designation: park.designation,
          pinColor: config.color,
          categoryIcon: config.icon,
          photos: park.images.slice(0, 5).map((img, i) => ({
            id: `${park.id}-photo-${i}`,
            url: img.url,
            title: img.title,
          })),
          videos: [],
          reviews: [],
        };
      })
      .filter(park => 
        !isNaN(park.latitude) && 
        !isNaN(park.longitude) &&
        park.designation
      );

    return parks;
  } catch (error) {
    console.error('Error fetching parks:', error);
    throw error;
  }
};

export const getAvailableCategories = (parks) => {
  const categoriesMap = new Map();
  
  parks.forEach((park) => {
    if (park.designation) {
      const current = categoriesMap.get(park.designation) || { 
        name: park.designation, 
        count: 0,
        color: park.pinColor,
        icon: park.categoryIcon,
      };
      current.count += 1;
      categoriesMap.set(park.designation, current);
    }
  });
  
  return Array.from(categoriesMap.values()).sort((a, b) => b.count - a.count);
};