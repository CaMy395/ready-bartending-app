import dotenv from 'dotenv';
dotenv.config();
//console.log(process.env.DB_PASSWORD); Add this to check if the password is being loaded

export const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

