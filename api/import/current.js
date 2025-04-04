import fs from 'fs'; // Подключаем модуль 'fs' для работы с файловой системой
import config from '../../conf/config.js'; // Импортируем конфигурацию

const url = config.apiUrl;

// Функция для получения информации из passport.json
function getPassportsFromFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject('Ошибка при чтении файла: ' + err);
            }

            try {
                const jsonData = JSON.parse(data);
                const passportsInfo = jsonData.passports.map(passport => ({
                    idMO: passport.idMO,
                    modelOrMarkOrModif: passport.modelOrMarkOrModif,
                    regNumber: passport.regNumber,
                    garageNumber: passport.garageNumber
                }));
                resolve(passportsInfo);
            } catch (parseError) {
                reject('Ошибка при парсинге JSON: ' + parseError);
            }
        });
    });
}

// Основной код для запроса данных
getPassportsFromFile('../../data/passports.json')
    .then(passports => {
        const idMoArray = passports.map(passport => passport.idMO);
        const data = {
            token: config.tokens.getCurrentState,
            command: "getCurrentState",
            idMo: idMoArray // Используем массив idMo, полученный из файла
        };

        // Отправка POST запроса
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(data) // формирование параметров в формате x-www-form-urlencoded
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json(); // парсим ответ как JSON
        }).then(responseData => {
            const mergedData = responseData.list.map(item => {
                const passportInfo = passports.find(passport => passport.idMO === item.idMo);
                return {
                    ...item,
                    modelOrMarkOrModif: passportInfo ? passportInfo.modelOrMarkOrModif : null,
                    regNumber: passportInfo ? passportInfo.regNumber : null,
                    garageNumber: passportInfo ? passportInfo.garageNumber : null
                };
            });
            return mergedData;
        });
    })
    .then(data => {
        console.log(data); // обработка полученных данных

        // Сохранение данных в файл
        fs.writeFile('../../data/currentState.json', JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error('Ошибка при записи файла:', err);
            } else {
                console.log('Данные успешно сохранены в currentState.json');
            }
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });