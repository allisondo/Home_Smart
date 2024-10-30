
// const mqttClient = require('../config/mqtt');

// // API điều khiển đèn
// const controlLight = (req, res) => {
//     try {
//         const { status } = req.body; // "on" hoặc "off"
//         mqttClient.publish('phuongthao/esp8266/light', status); // Gửi lệnh đến MQTT
//         res.send('Đã gửi lệnh điều khiển đèn');
//     } catch (error) {
//         console.error('Lỗi khi điều khiển đèn:', error);
//         res.status(500).send('Lỗi khi điều khiển đèn');
//     }
// };

// // API điều khiển quạt
// const controlFan = (req, res) => {
//     try {
//         const { status } = req.body; // "on" hoặc "off"
//         mqttClient.publish('phuongthao/esp8266/fan', status); // Gửi lệnh đến MQTT
//         res.send('Đã gửi lệnh điều khiển quạt');
//     } catch (error) {
//         console.error('Lỗi khi điều khiển quạt:', error);
//         res.status(500).send('Lỗi khi điều khiển quạt');
//     }
// };

// // API điều khiển điều hòa
// const controlConditioner = (req, res) => {
//     try {
//         const { status } = req.body; // "on" hoặc "off"
//         mqttClient.publish('phuongthao/esp8266/conditioner', status); // Gửi lệnh đến MQTT
//         res.send('Đã gửi lệnh điều khiển điều hòa');
//     } catch (error) {
//         console.error('Lỗi khi điều khiển điều hòa:', error);
//         res.status(500).send('Lỗi khi điều khiển điều hòa');
//     }
// };

// module.exports = { controlLight, controlFan, controlConditioner };
const mqttClient = require('../config/mqtt');
const { insertDeviceActivity, updateDeviceStatus } = require('../models/deviceModels'); // Import các hàm lưu lịch sử và cập nhật trạng thái

// API điều khiển đèn
const controlLight = (req, res) => {
    try {
        const { status } = req.body; // "on" hoặc "off"
        mqttClient.publish('phuongthao/esp8266/light', status); // Gửi lệnh đến MQTT

        // Xác định action và status
        const action = status === 'on' ? 'on' : 'off';
        const numericStatus = status === 'on' ? 1 : 0;

        // Lưu lịch sử hoạt động và cập nhật trạng thái
        insertDeviceActivity('Light', action, (err) => {
            if (err) {
                console.error('Lỗi khi lưu lịch sử đèn:', err);
            }
        });
        updateDeviceStatus('Light', numericStatus, (err) => {
            if (err) {
                console.error('Lỗi khi cập nhật trạng thái đèn:', err);
            }
        });

        res.send('Đã gửi lệnh điều khiển đèn');
    } catch (error) {
        console.error('Lỗi khi điều khiển đèn:', error);
        res.status(500).send('Lỗi khi điều khiển đèn');
    }
};

// API điều khiển quạt
const controlFan = (req, res) => {
    try {
        const { status } = req.body; // "on" hoặc "off"
        mqttClient.publish('phuongthao/esp8266/fan', status); // Gửi lệnh đến MQTT

        const action = status === 'on' ? 'on' : 'off';
        const numericStatus = status === 'on' ? 1 : 0;

        insertDeviceActivity('Fan', action, (err) => {
            if (err) {
                console.error('Lỗi khi lưu lịch sử quạt:', err);
            }
        });
        updateDeviceStatus('Fan', numericStatus, (err) => {
            if (err) {
                console.error('Lỗi khi cập nhật trạng thái quạt:', err);
            }
        });

        res.send('Đã gửi lệnh điều khiển quạt');
    } catch (error) {
        console.error('Lỗi khi điều khiển quạt:', error);
        res.status(500).send('Lỗi khi điều khiển quạt');
    }
};

// API điều khiển điều hòa
const controlConditioner = (req, res) => {
    try {
        const { status } = req.body; // "on" hoặc "off"
        mqttClient.publish('phuongthao/esp8266/conditioner', status); // Gửi lệnh đến MQTT

        const action = status === 'on' ? 'on' : 'off';
        const numericStatus = status === 'on' ? 1 : 0;

        insertDeviceActivity('Conditioner', action, (err) => {
            if (err) {
                console.error('Lỗi khi lưu lịch sử điều hòa:', err);
            }
        });
        updateDeviceStatus('Conditioner', numericStatus, (err) => {
            if (err) {
                console.error('Lỗi khi cập nhật trạng thái điều hòa:', err);
            }
        });

        res.send('Đã gửi lệnh điều khiển điều hòa');
    } catch (error) {
        console.error('Lỗi khi điều khiển điều hòa:', error);
        res.status(500).send('Lỗi khi điều khiển điều hòa');
    }
};

module.exports = { controlLight, controlFan, controlConditioner };
