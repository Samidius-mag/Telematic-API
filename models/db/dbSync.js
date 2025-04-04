import fs from 'fs';

async function connectDB(client) {
    await client.connect();
}

async function syncData(client) {
    try {
        const rawData = fs.readFileSync('../../data/currentState.json');
        const data = JSON.parse(rawData);

        for (const item of data) {
            // Проверяем, существует ли запись
            const [rows] = await client.query('SELECT * FROM vehicles WHERE idMo = ?', [item.idMo]);
            if (rows.length > 0) {
                // Если запись существует, обновляем ее
                await client.query(
                    `UPDATE vehicles SET time = ?, lat = ?, lon = ?, speed = ?,
                    direction = ?, address = ?, fuelAmount = ?,
                    modelOrMarkOrModif = ?, regNumber = ?, garageNumber = ?
                    WHERE idMo = ?`,
                    [item.time, item.lat, item.lon, item.speed, item.direction,
                    item.address, item.fuelAmount, item.modelOrMarkOrModif,
                    item.regNumber, item.garageNumber, item.idMo]
                );
            } else {
                // Если записи нет, добавляем новую
                await client.query(
                    `INSERT INTO vehicles (idMo, time, lat, lon, speed, direction, address, fuelAmount, modelOrMarkOrModif, regNumber, garageNumber)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [item.idMo, item.time, item.lat, item.lon, item.speed,
                    item.direction, item.address, item.fuelAmount,
                    item.modelOrMarkOrModif, item.regNumber, item.garageNumber]
                );
            }
        }
        
        console.log('Синхронизация данных завершена.');
    } catch (error) {
        console.error('Ошибка при синхронизации данных:', error);
    }
}

export { connectDB, syncData }; // Экспортируем функции для использования в server.js