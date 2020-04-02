import * as redis from 'redis'

export interface TunnelSnakesDB {
  getAllUsers(): Promise<string[]>
  getUserContent(username: string): Promise<string>
  setUserContent(username: string, content: string): Promise<void>
}

const USERKEY = 'users'

export const DB = (redisUrl: string): TunnelSnakesDB => {
  const db = redis.createClient({ url: redisUrl })
  db.on('connect', () => console.log('Connected to Redis'))

  return {
    getAllUsers: () => new Promise((resolve, reject) => (
      db.hgetall(USERKEY, (err, users = {}) => err ? reject(err) : resolve(Object.keys(users)))
    )),
    getUserContent: (username: string) => new Promise((resolve, reject) => (
      db.hget(USERKEY, username, (err, content) => err ? reject(err) : resolve(content))
    )),
    setUserContent: (username: string, content: string) => new Promise((resolve, reject) => (
      db.hset(USERKEY, username, content, err => err ? reject(err) : resolve())
    )),
  }
}
