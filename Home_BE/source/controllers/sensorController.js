const { insertSensorData } = require('../models/sensorModel');
const connection = require('../config/database'); // Kết nối tới MySQL

// Hàm xử lý dữ liệu cảm biến và lưu vào MySQL
const handleSensorData = (data) => {
    const temperature = data.temperature;
    const humidity = data.humidity;
    const light = data.lux;

    insertSensorData(temperature, humidity, light, (err, results) => {
        if (err) {
            console.error('Lỗi khi chèn dữ liệu vào MySQL (sensors):', err);
        } else {
            console.log('Dữ liệu đã được chèn thành công vào bảng sensors:', results);
        }
    });
};

// API để lấy dữ liệu cảm biến từ bảng sensors

// API để lấy dữ liệu cảm biến từ bảng sensors
const getSensorData = (req, res) => {
    const { field = 'all', time } = req.query; // Mặc định field là 'all' nếu không có lựa chọn

    // Mặc định luôn lấy ID và thời gian
    let query = "SELECT id, time";

    // Tùy chọn thêm trường dữ liệu theo lựa chọn của người dùng
    if (field === 'temperature') {
        query += ", temperature";
    } else if (field === 'humidity') {
        query += ", humidity";
    } else if (field === 'light') {
        query += ", light";
    } else if (field === 'all') {
        query += ", temperature, humidity, light"; // Lấy tất cả dữ liệu
    }

    // Thêm phần FROM và điều kiện WHERE mặc định
    query += " FROM sensors WHERE 1=1";

    // Nếu có thời gian, thêm điều kiện lọc theo thời gian
    if (time) {
        query += ` AND time = STR_TO_DATE('${time}', '%Y-%m-%dT%H:%i:%s')`;
    } else {
        // Nếu không có thời gian, sắp xếp theo thời gian mới nhất
        query += " ORDER BY time DESC";
    }

    // Thực hiện truy vấn và trả về kết quả
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Lỗi khi truy vấn cơ sở dữ liệu" });
        }
        res.json(results);
    });
};






// Xuất cả hai hàm để có thể sử dụng ở nơi khác
module.exports = { handleSensorData, getSensorData };
