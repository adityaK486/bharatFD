import createRedisClient from '../config/redis.js';

let redisClient = null;
let redisAvailable = true;
const inMemoryCache = {}; // in-memory fallback

export const initializeRedis = async (isTest = false) => {
  if (!redisAvailable) return null;

  try {
    redisClient = await createRedisClient(isTest);
    return redisClient;
  } catch (error) {
    redisAvailable = false;
    redisClient = null;
    console.warn('Redis not available, using in-memory cache');
    return null;
  }
};

// Cache key generator for translations
const getTranslationCacheKey = (text, lang) => `trans:${lang}:${text}`;

// Cache translation
export const cacheTranslation = async (text, lang, translation) => {
  const client = await initializeRedis();
  const key = getTranslationCacheKey(text, lang);
  await client.setEx(key, 3600, translation);
};

// Get cached translation
export const getCachedTranslation = async (text, lang) => {
  const client = await initializeRedis();
  const key = getTranslationCacheKey(text, lang);
  return await client.get(key);
};

export const cache = async (key, data, ttl = 3600) => {
  if (redisAvailable && redisClient) {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.warn(
        'Cache operation failed, switching to in-memory cache:',
        error.message,
      );
      redisAvailable = false;
      inMemoryCache[key] = JSON.stringify(data);
    }
  } else {
    inMemoryCache[key] = JSON.stringify(data);
  }
};

export const getFromCache = async (key) => {
  if (redisAvailable && redisClient) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(
        'Cache retrieval failed, using in-memory cache:',
        error.message,
      );
      redisAvailable = false;
      return inMemoryCache[key] ? JSON.parse(inMemoryCache[key]) : null;
    }
  } else {
    return inMemoryCache[key] ? JSON.parse(inMemoryCache[key]) : null;
  }
};

export const clearCache = async (pattern) => {
  if (redisAvailable && redisClient) {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.warn(
        'Cache clear failed, clearing in-memory cache:',
        error.message,
      );
      for (const key in inMemoryCache) {
        if (new RegExp(pattern.replace('*', '.*')).test(key)) {
          delete inMemoryCache[key];
        }
      }
    }
  } else {
    for (const key in inMemoryCache) {
      if (new RegExp(pattern.replace('*', '.*')).test(key)) {
        delete inMemoryCache[key];
      }
    }
  }
};

// For testing purposes
export const getRedisClient = async (isTest = false) => {
  return await initializeRedis(isTest);
};
