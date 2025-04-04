import fs from 'fs'; // Подключаем модуль 'fs' для работы с файловой системой
import config from '../../conf/config.js'; // Импортируем конфигурацию

const url = config.apiUrl;
const data = {
    token: config.tokens.getPassports,
    command: "getPassports",
};

// Отправка POST запроса
fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data) // формирование параметров в формате x-www-form-urlencoded
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); // парсим ответ как JSON
})
.then(data => {
    console.log(data); // обработка полученных данных

    // Сохранение данных в файл
    fs.writeFile('../../data/passports.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Ошибка при записи файла:', err);
        } else {
            console.log('Данные успешно сохранены в passports.json');
        }
    });
})
.catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});