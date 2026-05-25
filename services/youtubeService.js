import AsyncStorage from '@react-native-async-storage/async-storage';

const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const CACHE_PREFIX = '@youtube_cache_';
const CACHE_TTL_DAYS = 7;

const getCacheKey = (parkName) => {
  return `${CACHE_PREFIX}${parkName.replace(/[^a-zA-Z0-9]/g, '_')}`;
};

const getCachedVideos = async (parkName) => {
  try {
    const key = getCacheKey(parkName);
    const cached = await AsyncStorage.getItem(key);
    
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    const ageInMs = Date.now() - parsed.timestamp;
    const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
    
    if (ageInDays > CACHE_TTL_DAYS) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return parsed.videos;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

const setCachedVideos = async (parkName, videos) => {
  try {
    const key = getCacheKey(parkName);
    const data = {
      timestamp: Date.now(),
      videos,
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

const formatViewCount = (count) => {
  const num = parseInt(count, 10);
  if (isNaN(num)) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const parseDuration = (isoDuration) => {
  if (!isoDuration) return 0;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);
  return hours * 3600 + minutes * 60 + seconds;
};

export const fetchVideosForPark = async (parkName) => {
  if (!parkName) return [];
  
  const cached = await getCachedVideos(parkName);
  if (cached) {
    console.log(`Using cached videos for: ${parkName}`);
    return cached;
  }
  
  try {
    const query = encodeURIComponent(`${parkName} national park`);
const searchUrl = `${YOUTUBE_BASE_URL}/search?part=snippet&maxResults=15&type=video&q=${query}&videoEmbeddable=true&videoDuration=short&key=${YOUTUBE_API_KEY}`;
    
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error('YouTube API error:', errorData);
      throw new Error(`YouTube API error: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }
    
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
const statsUrl = `${YOUTUBE_BASE_URL}/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
    
    const statsResponse = await fetch(statsUrl);
    const statsData = statsResponse.ok ? await statsResponse.json() : { items: [] };
    
const statsMap = {};
const durationMap = {};
if (statsData.items) {
  statsData.items.forEach(item => {
    statsMap[item.id] = item.statistics;
    durationMap[item.id] = parseDuration(item.contentDetails?.duration);
  });
}
    
const allVideos = searchData.items
  .map((item) => {
    const videoId = item.id.videoId;
    const stats = statsMap[videoId] || {};
    const duration = durationMap[videoId] || 0;
    
    return {
      id: videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      views: formatViewCount(stats.viewCount),
      duration,
      publishedAt: item.snippet.publishedAt,
    };
  })
  .filter(video => video.duration > 0 && video.duration <= 90);

const videos = allVideos.slice(0, 5).map((video, index) => ({
  ...video,
  isYours: index === 0 && video.channel.toLowerCase().includes('yourchannel'),
}));
    
    await setCachedVideos(parkName, videos);
    
    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

export const clearVideoCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    return { success: true, cleared: cacheKeys.length };
  } catch (error) {
    console.error('Error clearing cache:', error);
    return { success: false };
  }
};