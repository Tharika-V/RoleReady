const db = require("./config/db");

async function testConnection() {
    try {
        const connection = await db.getConnection();

        console.log("RoleReady connected to MySQL successfully!");

        connection.release();
        await db.end();
    } catch (error) {
        console.log("Database connection failed:", error.message);
    }
}

testConnection();