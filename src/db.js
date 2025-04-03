import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1035975142Keissy',
    database: 'acruxdatabase'
});

export const connectDB = async () => {
    try {
        await connection.connect();
        console.log(">> DB Connect");
    } catch (error) {
        console.error(error);
    }
};

export default connection;
