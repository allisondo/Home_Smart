const { insertDeviceActivity, updateDeviceStatus } = require('../models/deviceModels');
const connection = require('../config/database'); // Kết nối với MySQL

// // Hàm xử lý dữ liệu thiết bị
// const handleDeviceData = (topic, data) => {
//     let deviceName;

//     if (topic === 'phuongthao/esp8266/light/status') {
//         deviceName = 'Light';
//     } else if (topic === 'phuongthao/esp8266/fan/status') {
//         deviceName = 'Fan';
//     } else if (topic === 'phuongthao/esp8266/conditioner/status') {
//         deviceName = 'Conditioner';
//     }

//     const status = data.status; // "on" hoặc "off"
//     const action = status === 'on' ? 'on' : 'off';
//     const numericStatus = status === 'on' ? 1 : 0;

//     // Lưu lịch sử hoạt động của thiết bị
//     insertDeviceActivity(deviceName, action, (err) => {
//         if (err) {
//             console.error(`Lỗi khi lưu lịch sử cho thiết bị ${deviceName}:`, err);
//             return;
//         }

//         // Cập nhật trạng thái thiết bị
//         updateDeviceStatus(deviceName, numericStatus, (err) => {
//             if (err) {
//                 console.error(`Lỗi khi cập nhật trạng thái cho thiết bị ${deviceName}:`, err);
//             }
//         });
//     });
// };

// // Gọi hàm handleDeviceData với dữ liệu mẫu để kiểm tra
// handleDeviceData('phuongthao/esp8266/light/status', { status: 'on' });


// API để lấy trạng thái thiết bị
// const getDeviceStatus = (req, res) => {
//     const query = 'SELECT device_name, status FROM device_status';
//     connection.query(query, (err, results) => {
//         if (err) {
//             console.error('Lỗi khi truy vấn trạng thái thiết bị:', err);
//             return res.status(500).json({ error: 'Lỗi máy chủ' });
//         }

//         // Tạo một đối tượng với trạng thái từng thiết bị để gửi cho frontend
//         const deviceStatus = {};
//         results.forEach((row) => {
//             deviceStatus[row.device_name.toLowerCase()] = row.status === 1 ? 'on' : 'off';
//         });

//         res.json(deviceStatus);
//     });
// };
// Hàm để lấy trạng thái hiện tại của thiết bị
// Hàm để lấy trạng thái hiện tại của thiết bị
const getCurrentDeviceStatus = (deviceName, callback) => {
    const query = 'SELECT status FROM device_status WHERE device_name = ?';
    connection.query(query, [deviceName], (err, results) => {
        if (err) {
            console.error(`Lỗi khi lấy trạng thái hiện tại của thiết bị ${deviceName}:`, err);
            return callback(err, null);
        }
        // Nếu thiết bị không tồn tại trong cơ sở dữ liệu, giả định trạng thái là 0
        const currentStatus = results.length > 0 ? results[0].status : 0;
        callback(null, currentStatus);
    });
};

// Hàm xử lý dữ liệu thiết bị
const handleDeviceData = (topic, data) => {
    let deviceName;

    // Xác định thiết bị dựa trên topic
    if (topic === 'phuongthao/esp8266/light/status') {
        deviceName = 'Light';
    } else if (topic === 'phuongthao/esp8266/fan/status') {
        deviceName = 'Fan';
    } else if (topic === 'phuongthao/esp8266/conditioner/status') {
        deviceName = 'Conditioner';
    }

    const status = data.status; // "on" hoặc "off"
    const numericStatus = status === 'on' ? 1 : 0; // Chuyển đổi thành 1 hoặc 0

    // Lấy trạng thái hiện tại của thiết bị
    getCurrentDeviceStatus(deviceName, (err, currentStatus) => {
        if (err) {
            console.error(`Lỗi khi lấy trạng thái hiện tại cho thiết bị ${deviceName}:`, err);
            return;
        }

        // Kiểm tra nếu trạng thái mới khác với trạng thái hiện tại
        if (currentStatus !== numericStatus) {
            const action = status; // "on" hoặc "off"

            // Lưu lịch sử hoạt động của thiết bị
            insertDeviceActivity(deviceName, action, (err) => {
                if (err) {
                    console.error(`Lỗi khi lưu lịch sử cho thiết bị ${deviceName}:`, err);
                    return;
                }

                // Cập nhật trạng thái thiết bị
                updateDeviceStatus(deviceName, numericStatus, (err) => {
                    if (err) {
                        console.error(`Lỗi khi cập nhật trạng thái cho thiết bị ${deviceName}:`, err);
                    }
                });
            });
        } else {
            console.log(`Trạng thái của thiết bị ${deviceName} đã là ${numericStatus}, không cần cập nhật.`);
        }
    });
};

const getDeviceStatus = (req, res) => {
    const query = 'SELECT * FROM device_status';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi khi truy xuất dữ liệu từ MySQL:', err);
            res.status(500).send('Lỗi server');
        } else {
            const deviceStatus = {};
            results.forEach((row) => {
                // Kiểm tra nếu device_name và status không phải là null
                if (row.device_name && row.status !== null) {
                    deviceStatus[row.device_name.toLowerCase()] = row.status.toString();
                } else {
                    // Xử lý khi status hoặc device_name là null
                    console.warn('Dữ liệu không hợp lệ:', row);
                    deviceStatus[row.device_name ? row.device_name.toLowerCase() : 'unknown'] = '0'; // Gán giá trị mặc định là '0'
                }
            });
            res.json(deviceStatus);
        }
    });
};



// // API để lấy trạng thái thiết bị từ bảng device_status
// const getDeviceStatus = (req, res) => {
//     const query = 'SELECT * FROM device_status';
//     connection.query(query, (err, results) => {
//         if (err) {
//             console.error('Lỗi khi truy xuất dữ liệu từ MySQL:', err);
//             res.status(500).send('Lỗi server');
//         } else {
//             res.json(results);
//         }
//     });
// };
// API để cập nhật trạng thái thiết bị
// const apiUpdateDeviceStatus = (req, res) => {
//     const { deviceName, status } = req.body; // deviceName là tên thiết bị, status là 1 hoặc 0

//     // Kiểm tra xem `status` là 1 hoặc 0
//     if (status !== 0 && status !== 1) {
//         return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
//     }

//     // Cập nhật trạng thái trong bảng device_status
//     const query = 'UPDATE device_status SET status = ?, updated_at = NOW() WHERE device_name = ?';
//     connection.query(query, [status, deviceName], (err, result) => {
//         if (err) {
//             console.error('Lỗi khi cập nhật trạng thái thiết bị:', err);
//             return res.status(500).json({ error: 'Lỗi máy chủ' });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'Thiết bị không tồn tại' });
//         }
//         res.json({ message: `Đã cập nhật trạng thái của ${deviceName} thành ${status}` });
//     });
// };



// Xuất cả hai hàm để sử dụng ở nơi khác
module.exports = { getDeviceStatus, handleDeviceData };



