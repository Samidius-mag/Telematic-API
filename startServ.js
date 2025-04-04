import fs from 'fs';
import mysql from 'mysql2/promise'; // Импортируем mysql2 с поддержкой promise
import express from 'express';
import config from './conf/config.js';
import { connectDB, syncData } from './models/db/dbSync.js'; // Импортируем функции из dbSync.js

const app = express();
const port = 3000;

// Создаем подключение к базе данных
const client = await mysql.createConnection({
    host: 'localhost',
    user: 'samidius',
    password: 'Asetabalana14$',
    database: 'perv',
    port: 3306
});

app.get('/api/vehicles', async (req, res) => {
    try {
        const [result] = await client.query('SELECT * FROM vehicles');
        res.json(result);
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        res.status(500).send('Ошибка сервера.');
    }
});

// Запуск приложения
connectDB(client).then(() => {
    console.log('Подключение к базе данных успешно');

    // Начинаем синхронизацию данных каждые 30 секунд
    setInterval(() => syncData(client), 30000);
    
    // Запускаем API сервер
    app.listen(port, () => {
        console.log(`Сервер запущен на http://localhost:${port}`);
    });
}).catch(err => console.error(err));