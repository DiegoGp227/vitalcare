// config/db.config.ts

import { Pool, QueryResult } from 'pg';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config(); 

// 1. Configuración del Pool
const poolConfig = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432, 
    
    // Configuración SSL requerida para Neon.tech
    ssl: {
        // Aseguramos que solo se active SSL si la variable lo requiere
        rejectUnauthorized: process.env.PG_SSLMODE === 'require' ? true : false,
    },
};

// 2. Crear el Pool de conexión
// El tipo Pool<any> se puede usar si las consultas no se tipan fuertemente aquí
export const pool = new Pool(poolConfig);

/**
 * Función para verificar la conexión a la base de datos.
 */
export async function connectDB(): Promise<void> {
    try {
        // Ejecutar una consulta simple para confirmar la conexión
        const result: QueryResult = await pool.query('SELECT 1 + 1 AS result');
        
        if (result.rows[0].result === 2) {
            console.log('✅ Conexión exitosa a PostgreSQL (Neon.tech).');
        } else {
            console.error('❌ Error al verificar la conexión.');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('❌ Error al conectar a la base de datos:', error.message);
        } else {
            console.error('❌ Error desconocido al conectar a la base de datos.');
        }
        // Opcional: relanzar el error o salir de la aplicación
        // process.exit(1); 
    }
}

/**
 * Función genérica para ejecutar consultas SQL.
 * @param text La consulta SQL
 * @param params Los parámetros de la consulta
 * @returns El resultado de la consulta (promesa)
 */
export function query(text: string, params: any[] = []): Promise<QueryResult> {
    return pool.query(text, params);
}