import { pool } from "../db.js";

export async function initDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
            title varchar(200) NOT NULL,
            completed boolean DEFAULT false NOT NULL,
            created_at timestamptz DEFAULT now() NOT NULL
        );
    `);

    console.log("Base de datos inicializada");
}