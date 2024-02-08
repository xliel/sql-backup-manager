import dotEnv from 'dotenv';
dotEnv.config();

export const mysql = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD || null,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 5,
  queueLimit: 0,

  charset: 'utf8mb4',
  dateStrings: 'date',
  supportBigNumbers: true,
  bigNumberStrings: true,
  multipleStatements: true,
};
