import { createClient } from 'redis';
import zlib from 'zlib';
import util from 'util';

type CacheOptions = {
  expireIn?: number;
};
type RedisClientType = ReturnType<typeof createClient>;

type CacheGetType<D = any> = Promise<D>;

class RedisCache {
  exists = async (client: RedisClientType, key: string) => {
    try {
      const res = await client.exists(key);
      if (res.toString() === '0') return false;
      return true;
    } catch (err: any) {
      console.error(err.message);
      return false;
    }
  };

  delete = async (client: RedisClientType, keys: string[]) => {
    try {
      const res = await client.del(keys);
      return res as number;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  get = async (client: RedisClientType, key: string): CacheGetType => {
    try {
      const res = await client.get(key);
      if (!res) {
        // return null
        return res;
      }
      const buf = Buffer.from(res, 'base64');
      const inflate = util.promisify(zlib.inflate);
      const decompressedData = await inflate(buf);
      const result = JSON.parse(decompressedData.toString());
      return result;
    } catch (err: any) {
      console.log(err.message);
    }
  };

  set = async (
    client: RedisClientType,
    key: string,
    payload: any,
    options: CacheOptions = {}
  ) => {
    try {
      const jsonData = JSON.stringify(payload);
      const deflate = util.promisify(zlib.deflate);
      const compressedData = (await deflate(jsonData)).toString('base64');
      const res = await client.set(key, compressedData);
      if (res !== 'OK') return false;
      if (options.expireIn) {
        console.log('time');
        await client.expire(key, options.expireIn);
      }
      return true;
    } catch (err: any) {
      console.error(err.message);
      return false;
    }
  };
}

export const cache = new RedisCache();
