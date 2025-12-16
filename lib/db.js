import mysql from 'mysql';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fortunedxb',
  waitForConnections: true,
});

// Promise wrapper for queries
export const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

// Get single row
export const queryOne = async (sql, params) => {
  const results = await query(sql, params);
  return results[0] || null;
};

export default pool;