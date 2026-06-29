const cache = new Map();

export const setCache = (key, value, ttlSeconds = 300) => {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  cache.set(key, { value, expiresAt });
  return true;
};

export const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expiresAt) {
    cache.delete(key);
    return null;
  }
  return cached.value;
};

export const deleteCache = (key) => {
  return cache.delete(key);
};

export const clearCache = () => {
  cache.clear();
  return true;
};

export default {
  setCache,
  getCache,
  deleteCache,
  clearCache
};
