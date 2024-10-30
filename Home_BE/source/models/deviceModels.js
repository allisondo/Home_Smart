// const connection = require('../config/database');

// //Lưu lịch sử thiết bị
// const insertDeviceActivity = (deviceName, action, callback) => {
//     const query = `INSERT INTO activity_history (device_name, action, time) VALUES (?, ?, NOW())`;
//     connection.query(query, [deviceName, action], callback);
// };



// // Cập nhật trạng thái thiết bị
// const updateDeviceStatus = (deviceName, status, callback) => {
//     const query = `INSERT INTO device_status (device_name, status, updated_at)
//                    VALUES (?, ?, NOW())
//                    ON DUPLICATE KEY UPDATE status = VALUES(status), updated_at = NOW()`;
//     connection.query(query, [deviceName, status], callback);
// };

// module.exports = { insertDeviceActivity, updateDeviceStatus };

const connection = require('../config/database');

// Lưu lịch sử thiết bị
const insertDeviceActivity = (deviceName, action, callback) => {
    const query = `INSERT INTO activity_history (device_name, action, time) VALUES (?, ?, NOW())`;
    connection.query(query, [deviceName, action], callback);
};

// Cập nhật trạng thái thiết bị
const updateDeviceStatus = (deviceName, status, callback) => {
    const query = `INSERT INTO device_status (device_name, status, updated_at)
                   VALUES (?, ?, NOW())
                   ON DUPLICATE KEY UPDATE status = VALUES(status), updated_at = NOW()`;
    connection.query(query, [deviceName, status], callback);
};

module.exports = { insertDeviceActivity, updateDeviceStatus };
