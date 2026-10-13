//db.ts

import {Pool} from 'pg';
import dotenv from 'dotenv';

const isTest = process.env.NODE_ENV === 'test';

dotenv.config({ path: isTest ? '.env.test' : '.env' });

if (isTest && !process.env.DB_NAME?.endsWith('_test')) {
    throw new Error(
        `Las pruebas solo pueden correr contra una base que termine en "_test". DB_NAME actual: ${process.env.DB_NAME}`
    );
}
export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
});

pool.on('connect', ()=>{
    console.log(`conexion a base de datos ${isTest ? 'de pruebas': ''} exitosa`)
})