import { Sequelize } from 'sequelize';
import {
    DB_CONNECTION,
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_SSL,
    DATABASE_URL,
} from '../config/config.js';

// Supabase exige SSL. Se activa por defecto salvo que DB_SSL=false (util para un postgres local sin SSL).
const sslActivo = DB_SSL !== 'false';
const opciones = {
    dialect: 'postgres',
    logging: false,
    dialectOptions: sslActivo
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
};

// Se usa la cadena completa de conexion (recomendado con Supabase) si esta definida en .env;
// de lo contrario se arma la conexion con las variables DB_* sueltas.
export const sequelize = DATABASE_URL
    ? new Sequelize(DATABASE_URL, opciones)
    : new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
          ...opciones,
          host: DB_HOST,
          port: DB_PORT,
          dialect: DB_CONNECTION || 'postgres',
      });
















