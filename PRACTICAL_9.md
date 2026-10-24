# Practical 9: In-Memory Caching & Query Optimization
**Course:** ITUE301 - Advanced Web Development Frameworks  
**Student Name:** Riya Thesia  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  

---

## 🎯 Objective
To implement server-side in-memory caching using `node-cache`, eliminate redundant database reads, measure API response time improvements, and ensure strict cache invalidation on write operations (`POST`, `PUT`, `DELETE`).

---

## 🏗️ Architecture & Cache Flow Diagram

```
GET /api/tasks Request
        │
        ▼
 ┌──────────────┐      HIT (X-Cache: HIT)
 │ Cache Check  ├────────────────────────────► Return Cached Data (0ms - 1ms)
 │ (node-cache) │
 └──────┬───────┘
        │ MISS (X-Cache: MISS)
        ▼
 Query MongoDB Database / Storage ──► Populate Cache Key 'all_tasks' (TTL: 60s) ──► Return Data (16ms)

POST / PUT / DELETE Write Request
        │
        ▼
 Execute DB Operation ──► Invalidate Cache Key ('all_tasks', 'task_<id>') ──► Stale Data Eliminated
```

---

## 🛠️ Implementation Highlights

### 1. `backend/config/cache.js`
Initializes `node-cache` with a 60-second TTL and exports metric counters (`hits`, `misses`, `hitRatio`):

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
```

### 2. GET Route Caching (`backend/routes/taskRoutes.js`)
Checks `cache.get('all_tasks')`. On HIT, sets header `X-Cache: HIT` and returns response in ~0ms. On MISS, queries DB, populates cache, and sets `X-Cache: MISS`.

### 3. Cache Invalidation Logic
On any write operation (`POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`), keys `all_tasks` and `task_<id>` are immediately deleted via `cache.del()`:

```javascript
cache.del('all_tasks');
cache.del(`task_${id}`);
console.log(`[Cache Invalidate] Cleared cache keys following write request.`);
```

### 4. Debug Metrics Endpoint (`GET /api/tasks/cache/stats`)
Exposes live hit/miss metrics and hit ratio:
```json
{
  "status": "success",
  "metrics": {
    "hits": 5,
    "misses": 1,
    "totalRequests": 6,
    "hitRatio": "83.3%",
    "keys": ["all_tasks"],
    "stdTTL": 60
  }
}
```

---

## 📈 Empirical Response Time Comparison

| Request # | Scenario / Endpoint | Header `X-Cache` | API Response Time (ms) | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Reading 1** | Initial `GET /api/tasks` | `MISS` | **16 ms** | DB Query + Cache Miss |
| **Reading 2** | Repeated `GET /api/tasks` | `HIT` | **0 ms - 1 ms** | Served from node-cache RAM |
| **Reading 3** | Repeated `GET /api/tasks` | `HIT` | **0 ms** | Instant RAM lookup |
| **Write Op** | `POST /api/tasks` | `INVALIDATED` | **10 ms** | Task created, cache invalidated |
| **Reading 4** | Post-Write `GET /api/tasks` | `MISS` | **3 ms** | Re-queried DB to serve fresh data |

---

## 🧠 Key Questions & Analysis

1. **Why must the cache be invalidated on every write operation?**
   - Without cache invalidation, write operations (`POST`, `PUT`, `DELETE`) alter the underlying dataset in the database, but subsequent `GET` requests within the TTL window would serve stale pre-update cached data, violating data consistency.

2. **What trade-off does TTL length represent?**
   - A **longer TTL** maximizes cache hit rates and minimizes database load, but increases the risk of serving slightly stale data if invalidation misses an edge case.
   - A **shorter TTL** ensures higher freshness but results in more frequent database queries.

3. **Why is `node-cache` not suitable for multi-server deployments?**
   - `node-cache` stores items in the process-local heap memory of a single Node.js instance. In a multi-instance load-balanced deployment (e.g. 4 servers), Server A invalidating its local cache will leave stale caches intact on Servers B, C, and D. A distributed cache like **Redis** or **Memcached** is required for multi-server scaling.

---

## ✅ Evaluation Rubric Checklist
- [x] Implemented `node-cache` with 60s TTL
- [x] Tested and recorded cached vs uncached response times (16ms vs 0ms)
- [x] Cache invalidation implemented on POST, PUT, DELETE
- [x] Exposed `/api/tasks/cache/stats` hit/miss metrics endpoint
