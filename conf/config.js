// Файл конфигурации хранящий токены API, адреса url и т.д.
const config = {
    apiUrl: "https://atp.ttwcome.ru/atp/api/v2",
    tokens: {
        getDrivers: "FD5370EC698B", // Токен для списка водителей и (ЭСМО)
        getPassports: "3452F2678607", // Токен для списка машин и НО
        getCurrentState: "A7279B47CBEC", // Токен для текущих значений НО
        getMonitoringStats: "5FC5744E75AC" // Токен для запроса периодических значений для КМУ и Кранов
    },
    db: {
        user: 'postgre', // Замените на ваше имя пользователя
        host: 'localhost', // Замените на ваш хост
        database: 'perv', // Имя вашей БД
        password: 'Asetabalana14$', // Ваш пароль
        port: 5432 // Порт по умолчанию
    }
};

export default config;