
import { Pool } from "pg";
import "dotenv/config";

const requiredEnv = (key: string): string => {
    const value = process.env[key];
    if (!value || value.trim() === "") {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

const isProduction = process.env.NODE_ENV === "production";

export const pool = new Pool({
    host: requiredEnv("DATABASE_HOST"),
    port: Number(requiredEnv("DATABASE_PORT")),
    user: requiredEnv("DATABASE_USERNAME"),
    password: requiredEnv("DATABASE_PASSWORD"),
    database: requiredEnv("DATABASE_NAME"),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
      ssl: false
    // ssl: isProduction ? { rejectUnauthorized: true } : false,
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err.message);
});

export const connectDB = async () => {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected");
};