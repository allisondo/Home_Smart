// // Import đối tượng connection từ file cấu hình cơ sở dữ liệu
// const connection = require('../config/database');

// // Chèn dữ liệu cảm biến vào bảng sensors
// const insertSensorData = (temperature, humidity, light, wind, callback) => {
//     const query = "INSERT INTO sensors (temperature, humidity, light, wind, time) VALUES (?, ?, ?, ?, NOW())";

//     // Thực hiện câu lệnh SQL để chèn dữ liệu vào cơ sở dữ liệu
//     connection.query(query, [temperature, humidity, light, wind], callback);
// };

// module.exports = { insertSensorData };


// Import đối tượng connection từ file cấu hình cơ sở dữ liệu
const connection = require('../config/database');

// Chèn dữ liệu cảm biến vào bảng sensors, bao gồm dust, soilMoisture, và noise
const insertSensorData = (temperature, humidity, light, dust, soilMoisture, noise, callback) => {
    
    const query = "INSERT INTO sensors (temperature, humidity, light, dust, soilMoisture, noise, time) VALUES (?, ?, ?, ?, ?, ?, NOW())";

    // Thực hiện câu lệnh SQL để chèn dữ liệu vào cơ sở dữ liệu
    connection.query(query, [temperature, humidity, light, dust, soilMoisture, noise], callback);
};

module.exports = { insertSensorData };
