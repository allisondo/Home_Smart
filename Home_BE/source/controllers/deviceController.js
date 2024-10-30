const { insertDeviceActivity, updateDeviceStatus } = require('../models/deviceModels');
const connection = require('../config/database'); // Kết nối với MySQL

// // Hàm xử lý dữ liệu thiết bị và lưu vào MySQL
// const handleDeviceData = (topic, data) => {
//     let deviceName;

//     if (topic === 'phuongthao/esp8266/light/status') {
//         deviceName = 'Light';
//     } else if (topic === 'phuongthao/esp8266/fan/status') {
//         deviceName = 'Fan';
//     } else if (topic === 'phuongthao/esp8266/conditioner/status') {
//         deviceName = 'Conditioner';
//     }

//     const status = data.status;

//     // Lưu dữ liệu vào bảng activity_history
//     insertDeviceActivity(deviceName, status, (err, results) => {
//         if (err) {
//             console.error('Lỗi khi chèn dữ liệu vào MySQL (activity_history):', err);
//         } else {
//             console.log(`Dữ liệu đã được chèn vào bảng activity_history: ${deviceName} - ${status}`);
//         }
//     });

//     // Cập nhật dữ liệu vào bảng device_status
//     updateDeviceStatus(deviceName, status, (err, results) => {
//         if (err) {
//             console.error('Lỗi khi cập nhật dữ liệu vào MySQL (device_status):', err);
//         } else {
//             console.log(`Trạng thái đã được cập nhật vào bảng device_status: ${deviceName} - ${status}`);
//         }
//     });
// };

// const { insertDeviceActivity, updateDeviceStatus } = require('../models/deviceModels');

// Hàm xử lý dữ liệu thiết bị và lưu vào MySQL

// Hàm xử lý dữ liệu thiết bị và lưu vào MySQL
const handleDeviceData = (topic, data) => {
    let deviceName;

    if (topic === 'phuongthao/esp8266/light/status') {
        deviceName = 'Light';
    } else if (topic === 'phuongthao/esp8266/fan/status') {
        deviceName = 'Fan';
    } else if (topic === 'phuongthao/esp8266/conditioner/status') {
        deviceName = 'Conditioner';
    }

    const status = data.status; // "on" hoặc "off"
    const action = status === 'on' ? 'on' : 'off';
    const numericStatus = status === 'on' ? 1 : 0;

    // Lưu lịch sử thiết bị vào bảng activity_history
    insertDeviceActivity(deviceName, action, (err) => {
        if (err) {
            console.error(`Lỗi khi lưu lịch sử cho thiết bị ${deviceName}:`, err);
        }
    });

    // Cập nhật trạng thái thiết bị vào bảng device_status
    updateDeviceStatus(deviceName, numericStatus, (err) => {
        if (err) {
            console.error(`Lỗi khi cập nhật trạng thái cho thiết bị ${deviceName}:`, err);
        }
    });
};


// API để lấy trạng thái thiết bị từ bảng device_status
const getDeviceStatus = (req, res) => {
    const query = 'SELECT * FROM device_status';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi khi truy xuất dữ liệu từ MySQL:', err);
            res.status(500).send('Lỗi server');
        } else {
            res.json(results);
        }
    });
};

// Xuất cả hai hàm để sử dụng ở nơi khác
module.exports = { handleDeviceData, getDeviceStatus };
