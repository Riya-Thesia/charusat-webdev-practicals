const NodeCache = require('node-cache');

// Practical 9: In-Memory Caching Module
// TTL set to 60 seconds as required by Practical 9 specs
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Hit / Miss counter metrics tracking (Supplementary Problem)
let cacheStats = {
  hits: 0,
  misses: 0
};

const getCacheStats = () => {
  const total = cacheStats.hits + cacheStats.misses;
  const hitRatio = total > 0 ? `${((cacheStats.hits / total) * 100).toFixed(1)}%` : '0%';
  return {
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    totalRequests: total,
    hitRatio,
    keys: cache.keys(),
    stdTTL: 60
  };
};

const recordHit = () => {
  cacheStats.hits += 1;
};

const recordMiss = () => {
  cacheStats.misses += 1;
};

module.exports = {
  cache,
  getCacheStats,
  recordHit,
  recordMiss
};
