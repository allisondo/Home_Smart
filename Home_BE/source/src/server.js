const express = require('express');
const cors = require('cors');
const mqttClient = require('../config/mqtt');  // Sử dụng MQTT từ file config


const { handleSensorData, getSensorData } = require('../controllers/sensorController');
const { handleDeviceData, getDeviceStatus } = require('../controllers/deviceController');
const { getActivityHistory } = require('../controllers/activityController');
const { controlLight, controlFan, controlConditioner } = require('../controllers/controlController');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Sử dụng các tuyến API đã định nghĩa trong routes.js


// ---------------- MQTT Section ---------------- //

// Khi kết nối MQTT thành công
mqttClient.on('connect', () => {
    mqttClient.subscribe('phuongthao/esp8266/sensor_data');
    mqttClient.subscribe('phuongthao/esp8266/light/status');
    mqttClient.subscribe('phuongthao/esp8266/fan/status');
    mqttClient.subscribe('phuongthao/esp8266/conditioner/status');
    console.log('Đã kết nối MQTT và subscribe các topic');
});

// Nhận dữ liệu từ các topic
mqttClient.on('message', (topic, message) => {
    const data = JSON.parse(message.toString());

    if (topic === 'phuongthao/esp8266/sensor_data') {
        handleSensorData(data);  // Xử lý dữ liệu cảm biến
    } else {
        handleDeviceData(topic, data);  // Xử lý dữ liệu thiết bị
    }
});

// ---------------- Express API Section ---------------- //

// API để lấy dữ liệu cảm biến từ bảng sensors
app.get('/api/sensors', getSensorData);

// API để lấy lịch sử hoạt động từ bảng activity_history
app.get('/api/activity-history', getActivityHistory);

// API để lấy trạng thái thiết bị từ bảng device_status
app.get('/api/device-status', getDeviceStatus);

// API điều khiển đèn, quạt, điều hòa
app.post('/api/control/light', controlLight);
app.post('/api/control/fan', controlFan);
app.post('/api/control/conditioner', controlConditioner);



// Gọi hàm kiểm tra trạng thái thiết bị mỗi 10 giây
//setInterval(checkDeviceStatus, 60000); // Thêm dòng này
// Chạy server trên cổng 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


