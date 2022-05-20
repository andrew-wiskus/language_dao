import { Db, MongoClient, MongoClientOptions } from 'mongodb'

const MONGODB_URI = process.env.MONGO_DB_URL as string
const MONGODB_DB = process.env.MONGO_DB_NAME

let cached = (global as any).mongo

if (!cached) {
  cached = (global as any).mongo = { conn: null, promise: null }
}

const connectToDatabase = async (): Promise<{ client: MongoClient; db: Db }> => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts: MongoClientOptions = {}

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then(client => {
      return {
        client,
        db: client.db(MONGODB_DB)
      }
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export async function withMongo<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  console.log("connecting to db..")
  const conn = await connectToDatabase()
  console.log("connected!", conn.db.databaseName)
  return await fn(conn.db)
} 