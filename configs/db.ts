import dotenv from 'dotenv';
import sql from 'mssql';
dotenv.config();

export const sqlConfig = {
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
    server: process.env.DB_SERVER ?? "",
    database: process.env.DB_NAME ?? "",
    port: Number(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

export const sqlConnection = async () => {
    try {
        const pool = await sql.connect(sqlConfig);
        console.log("SQL server connected successfully!");
        return pool;
    } catch (error) {
        console.error("SQL Connection Error:", error);
        throw error;
    }
}