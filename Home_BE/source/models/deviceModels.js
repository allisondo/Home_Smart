
const connection = require('../config/database');

// Lưu lịch sử thiết bị
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
// Hàm để lưu lịch sử hoạt động thiết bị
const insertDeviceActivity = (deviceName, action, callback) => {
    const query = 'INSERT INTO activity_history (device_name, action, time) VALUES (?, ?, NOW())';
    connection.query(query, [deviceName, action], (err, result) => {
        if (err) {
            console.error(`Lỗi khi lưu lịch sử cho thiết bị ${deviceName}:`, err);
            return callback(err);
        }
        console.log(`Đã lưu lịch sử cho thiết bị ${deviceName} với hành động ${action}`);
        callback(null, result);
    });
};

// Hàm để cập nhật trạng thái thiết bị
// const updateDeviceStatus = (deviceName, numericStatus, callback) => {
//     const query = 'INSERT INTO device_status (device_name, status, updated_at) VALUES (?, ?, NOW())';
//     connection.query(query, [deviceName, numericStatus], (err, result) => {
//         if (err) {
//             console.error(`Lỗi khi cập nhật trạng thái cho thiết bị ${deviceName}:`, err);
//             return callback(err);
//         }
//         console.log(`Đã cập nhật trạng thái cho thiết bị ${deviceName} thành ${numericStatus}`);
//         callback(null, result);
//     });
// };
const updateDeviceStatus = (deviceName, numericStatus, callback) => {
    const query = `
        REPLACE INTO device_status (device_name, status, updated_at)
        VALUES (?, ?, NOW())
    `;
    connection.query(query, [deviceName, numericStatus], (err, result) => {
        if (err) {
            console.error(`Lỗi khi cập nhật trạng thái cho thiết bị ${deviceName}:`, err);
            return callback(err);
        }
        console.log(`Đã cập nhật trạng thái cho thiết bị ${deviceName} thành ${numericStatus}`);
        callback(null, result);
    });
};


module.exports = { insertDeviceActivity, updateDeviceStatus };

