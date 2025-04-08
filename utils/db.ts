import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const getClient = async () => {
    const client = await pool.connect();
    return client;
};
