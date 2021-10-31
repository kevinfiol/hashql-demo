import env from 'env-smart';
env.load();

export default {
    mode: process.env.MODE,
    port: process.env.PORT,
    postgres: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
};