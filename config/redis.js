import Redis from 'redis';

let client = null;

const createRedisClient = async (isTest = false) => {
  if (client) {
    try {
      await client.ping();
      return client;
    } catch {
      client = null;
    }
  }

  try {
    const options = {
      url: isTest ? 'redis://127.0.0.1:6379/1' : 'redis://127.0.0.1:6379/0',
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 2) return false;
          return Math.min(retries * 100, 3000);
        },
      },
    };

    client = Redis.createClient(options);
    await client.connect();
    await client.ping();
    return client;
  } catch (error) {
    client = null;
    throw error;
  }
};

export default createRedisClient;
