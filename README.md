# nextjs-redis-cache

A **Redis Cache** for **NextJs Framework** that supports expiration after a given time and also compress the data in memory. Perfect to speed up server side data collection even on a large scale.

### Installation

```
npm install nextjs-redis-cache
```

### How to use

```ts
import cache from 'nextjs-redis-cache';

// your redis client from redis package (createClient)
// this should come from a singleton in your nextjs app!
redisClient = createClient();

// set
// last param (options) is optional!
const data = { foo: 'bar' };
await cache.set(redisClient, 'examplekey', data, { expireIn: 24 * 60 * 60 });

// exits?
// returns true or false
await cache.exists(redisClient, 'examplekey');

// get
// returns decompressed and JSON.parsed object!
const loadedData = await cache.get(redisClient, 'examplekey');

// delete
// delete array of keys
await cache.delete(redisClient, ['examplekey', 'otherkey']);
```

**Note:** Your object will be stringified to a json string and then compressed with zlib. When you get the data from cache you will get your object back!
