import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in .env');
}

const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

const db = drizzle({ client: poolConnection });

export { db };