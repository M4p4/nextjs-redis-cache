# Next.js Redis Cache

A **Redis Cache** for **Next.js Framework** that supports expiration after a given time and also compress the data in memory. Perfect to speed up server side data collection even on a large scale.

### Installation

```
npm install nextjs-redis-cache
```

### How to use

```ts
import cache from 'nextjs-redis-cache';

// your redis client from redis package (createClient)
// this should come from a singleton in your Next.js app!
const redisClient = createClient();

// set
// last param (options that also contain expireIn) is optional default is that it never expires!
const data = { foo: 'bar' };
await cache.set(redisClient, 'examplekey', data, { expireIn: 24 * 60 * 60 });

// exists?
// returns true or false
const res = await cache.exists(redisClient, 'examplekey');

// get
// returns decompressed and JSON.parsed object!
// if there is non data for the given key it return null
const loadedData = await cache.get(redisClient, 'examplekey');
if (loadedData) {
  //... you can also use exists function to be sure cache exists
}

// delete
// delete array of keys
await cache.delete(redisClient, ['examplekey', 'otherkey']);
```

**Note:** Your object will be stringified to a json string and then compressed with zlib. When you get the data from cache you will get your object back!
