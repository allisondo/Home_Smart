const { insertDeviceActivity, updateDeviceStatus } = require('../models/deviceModels');
const connection = require('../config/database'); // Kết nối với MySQL


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
//  // Xác định thiết bị dựa trên topic
//  if (topic === 'phuongthao/esp8266/warning/status') {
//     deviceName = 'Warning Light';
//     const warningStatus = data.status === 'on' ? 1 : 0;

//     // Cập nhật trạng thái đèn cảnh báo
//     updateDeviceStatus(deviceName, warningStatus, (err) => {
//         if (err) {
//             console.error(`Lỗi khi cập nhật trạng thái cho thiết bị ${deviceName}:`, err);
//         } 
//         // else {
//         //     console.log(`Trạng thái của ${deviceName} đã được cập nhật thành ${warningStatus}`);
//         // }
//     });
// }


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

        }
        // } else {
        //     console.log(`Trạng thái của thiết bị ${deviceName} đã là ${numericStatus}, không cần cập nhật.`);
        // }
    });
};


// api lấy trạng thái thiết bị
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



// Hàm để lấy trạng thái hiện tại của đèn cảnh báo
// ko dung đến
// const getWarningStatus = (req, res) => {
//     const query = 'SELECT status FROM device_status WHERE device_name = ?';
    
//     connection.query(query, ['Warning Light'], (err, results) => {
//         if (err) {
//             console.error('Lỗi khi truy xuất trạng thái cảnh báo:', err);
//             return res.status(500).send('Lỗi server');
//         }
        
//         // Kiểm tra xem có kết quả hay không và lấy trạng thái
//         const warningStatus = results.length > 0 && results[0].status === 1 ? 'on' : 'off';
        
//         res.json({ warning: warningStatus });
//     });
// };





// Xuất cả hai hàm để sử dụng ở nơi khác
module.exports = { getDeviceStatus, handleDeviceData};



