import dotenv from 'dotenv';
dotenv.config(); // THIS makes process.env.PORT readable!!! without it, it'll always be 3002

export const port = process.env.PORT || 3002;

export const dbURL = process.env.dbURL || 'mongodb://127.0.0.1:27017/series';

export const secret = process.env.JWT_SECRET || 'mangoSteeN!@#$';
