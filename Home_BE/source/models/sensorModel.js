const connection = require('../config/database');

// Chèn dữ liệu cảm biến vào bảng sensors
const insertSensorData = (temperature, humidity, light, callback) => {
    const query = `INSERT INTO sensors (temperature, humidity, light, time) VALUES (?, ?, ?, NOW())`;
    connection.query(query, [temperature, humidity, light], callback);
};

module.exports = { insertSensorData };
