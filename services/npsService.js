const NPS_API_KEY = process.env.EXPO_PUBLIC_NPS_API_KEY;
const NPS_BASE_URL = 'https://developer.nps.gov/api/v1';

export const fetchNationalParks = async () => {
  try {
    const url = `${NPS_BASE_URL}/parks?limit=500&api_key=${NPS_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NPS API error: ${response.status}`);
    }

    const data = await response.json();

    const parks = data.data
      .filter(park => park.designation === 'National Park')
      .map((park, index) => ({
        id: park.id,
        name: park.fullName,
        shortName: park.name,
        latitude: parseFloat(park.latitude),
        longitude: parseFloat(park.longitude),
        description: park.description,
        states: park.states,
        photos: park.images.slice(0, 5).map((img, i) => ({
          id: `${park.id}-photo-${i}`,
          url: img.url,
          title: img.title,
        })),
        videos: [],
        reviews: [],
      }))
      .filter(park => !isNaN(park.latitude) && !isNaN(park.longitude));

    return parks;
  } catch (error) {
    console.error('Error fetching parks:', error);
    throw error;
  }
};