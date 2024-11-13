// const { insertSensorData } = require('../models/sensorModel');
// const connection = require('../config/database'); // Kết nối tới MySQL

// const { updateDeviceStatus } = require('../models/deviceModels'); // Model để cập nhật trạng thái thiết bị
// const mqttClient = require('../config/mqtt'); // Kết nối với MQTT

// const handleSensorData = (data) => {
//     const temperature = data.temperature;
//     const humidity = data.humidity;
//     const light = data.light;
//     const wind = data.wind;
//  //   const timestamp = data.timestamp;

//     insertSensorData(temperature, humidity, light, wind, (err, results) => {
//         if (err) {
//             console.error('Lỗi khi chèn dữ liệu vào MySQL (sensors):', err);
//         }
//     });
//     // Kiểm tra tốc độ gió và bật cảnh báo nếu cần
//     if (wind >= 60) {
//         mqttClient.publish('phuongthao/esp8266/warning/status', 'on'); // Gửi tín hiệu bật cảnh báo qua MQTT
//         updateDeviceStatus('Warning Light', 1, (err) => { // Cập nhật trạng thái cảnh báo trong cơ sở dữ liệu
//             if (err) {
//                 console.error('Lỗi khi cập nhật trạng thái cảnh báo:', err);
//             }
//         });
//     } else {
//         mqttClient.publish('phuongthao/esp8266/warning/status', 'off'); // Tắt cảnh báo
//         updateDeviceStatus('Warning Light', 0, (err) => { // Cập nhật trạng thái tắt cảnh báo trong cơ sở dữ liệu
//             if (err) {
//                 console.error('Lỗi khi cập nhật trạng thái cảnh báo:', err);
//             }
//         });
//     }
// }
// // api lấy dữ liệu cảm biến từ bảng sensor
// const getSensorData = (req, res) => {
//    // console.log('Query parameters:', req.query);
//     const { field = 'all', search, page = 1, pageSize = 20, sortField = 'time', sortOrder = 'DESC' } = req.query;

//     const offset = (page - 1) * pageSize;

//     let query = "SELECT * FROM sensors WHERE 1=1";
//     let countQuery = "SELECT COUNT(*) AS totalCount FROM sensors WHERE 1=1";
//     let condition = "";

//     if (search) {
//         if (field.toLowerCase() === 'id') {
//             // Tìm kiếm chính xác theo ID
//             condition += ` AND id = ${connection.escape(search)}`;
//         } else {
//             const searchPattern = `%${search}%`; // Tìm kiếm chuỗi chứa giá trị tìm kiếm

//             if (field === 'temperature') {
//                 condition += ` AND CAST(temperature AS CHAR) LIKE ${connection.escape(searchPattern)}`;
//             } else if (field === 'humidity') {
//                 condition += ` AND CAST(humidity AS CHAR) LIKE ${connection.escape(searchPattern)}`;
//             } else if (field === 'light') {
//                 condition += ` AND CAST(light AS CHAR) LIKE ${connection.escape(searchPattern)}`;
//             } else if (field === 'time') {
//                 condition += ` AND DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') LIKE ${connection.escape(searchPattern)}`;
//             } else if (field === 'all') {
//                 condition += ` AND (
//                                 CAST(id AS CHAR) LIKE ${connection.escape(searchPattern)} 
//                                 OR CAST(temperature AS CHAR) LIKE ${connection.escape(searchPattern)}
//                                 OR CAST(humidity AS CHAR) LIKE ${connection.escape(searchPattern)}
//                                 OR CAST(light AS CHAR) LIKE ${connection.escape(searchPattern)}
//                                 OR DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') LIKE ${connection.escape(searchPattern)}
//                               )`;
//             }
//         }
//     }

//     query += condition;
//     countQuery += condition;
//     query += ` ORDER BY ${connection.escapeId(sortField)} ${sortOrder === 'ASC' ? 'ASC' : 'DESC'} LIMIT ? OFFSET ?`;

//     connection.query(query, [parseInt(pageSize), parseInt(offset)], (err, results) => {
//         if (err) {
//             console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err);
//             return res.status(500).json({ error: "Lỗi khi truy vấn cơ sở dữ liệu" });
//         }

//         connection.query(countQuery, (countErr, countResults) => {
//             if (countErr) {
//                 console.error("Lỗi khi lấy tổng số dòng từ cơ sở dữ liệu:", countErr);
//                 return res.status(500).json({ error: "Lỗi khi lấy tổng số dòng từ cơ sở dữ liệu" });
//             }

//             const totalCount = countResults[0].totalCount;
//             const totalPages = Math.ceil(totalCount / pageSize);

//             res.json({
//                 data: results,
//                 pagination: {
//                     currentPage: parseInt(page),
//                     pageSize: parseInt(pageSize),
//                     totalRows: totalCount,
//                     totalPages: totalPages
//                 }
//             });
//         });
//     });
// };


// // Xuất hàm để sử dụng ở nơi khác
// module.exports = { getSensorData, handleSensorData };



// Import đối tượng connection từ file cấu hình cơ sở dữ liệu
const { insertSensorData } = require('../models/sensorModel');
const connection = require('../config/database'); // Kết nối tới MySQL

const { updateDeviceStatus } = require('../models/deviceModels'); // Model để cập nhật trạng thái thiết bị
const mqttClient = require('../config/mqtt'); // Kết nối với MQTT

// Hàm xử lý dữ liệu cảm biến
const handleSensorData = (data) => {
    const temperature = data.temperature;
    const humidity = data.humidity;
    const light = data.light;
   // const wind = data.wind;
    const dust = data.dust;
    const soilMoisture = data.soilMoisture;
    const noise = data.noise;
    if (typeof data.temperature !== 'number' || 
        typeof data.humidity !== 'number' || 
        typeof data.light !== 'number' || 
        typeof data.dust !== 'number' || 
        typeof data.soilMoisture !== 'number' || 
        typeof data.noise !== 'number') {
        console.error('Dữ liệu không hợp lệ:', data);
        return;
    }

    insertSensorData(temperature, humidity, light, dust, soilMoisture, noise, (err, results) => {
        if (err) {
            console.error('Lỗi khi chèn dữ liệu vào MySQL (sensors):', err);
        }
    });

    // // Kiểm tra tốc độ gió và bật cảnh báo nếu cần
    // if (wind >= 60) {
    //     mqttClient.publish('phuongthao/esp8266/warning/status', 'on'); // Gửi tín hiệu bật cảnh báo qua MQTT
    //     updateDeviceStatus('Warning Light', 1, (err) => { // Cập nhật trạng thái cảnh báo trong cơ sở dữ liệu
    //         if (err) {
    //             console.error('Lỗi khi cập nhật trạng thái cảnh báo:', err);
    //         }
    //     });
    // } else {
    //     mqttClient.publish('phuongthao/esp8266/warning/status', 'off'); // Tắt cảnh báo
    //     updateDeviceStatus('Warning Light', 0, (err) => { // Cập nhật trạng thái tắt cảnh báo trong cơ sở dữ liệu
    //         if (err) {
    //             console.error('Lỗi khi cập nhật trạng thái cảnh báo:', err);
    //         }
    //     });
    // }
}

// API lấy dữ liệu cảm biến từ bảng sensors
const getSensorData = (req, res) => {
      // Kiểm tra các tham số truy vấn được truyền từ frontend
      console.log("Query parameters:", req.query);
      
    const { field = 'all', search, page = 1, pageSize = 20, sortField = 'time', sortOrder = 'DESC' } = req.query;

    const offset = (page - 1) * pageSize;

    let query = "SELECT * FROM sensors WHERE 1=1";
    let countQuery = "SELECT COUNT(*) AS totalCount FROM sensors WHERE 1=1";
    let condition = "";

    if (search) {
        if (field.toLowerCase() === 'id') {
            condition += ` AND id = ${connection.escape(search)}`;
        } else {
            const searchPattern = `%${search}%`;

            if (field === 'temperature') {
                condition += ` AND CAST(temperature AS CHAR) LIKE ${connection.escape(searchPattern)}`;
            } else if (field === 'humidity') {
                condition += ` AND CAST(humidity AS CHAR) LIKE ${connection.escape(searchPattern)}`;
            } else if (field === 'light') {
                condition += ` AND CAST(light AS CHAR) LIKE ${connection.escape(searchPattern)}`;
            }  else if (field === 'dust') {
                condition += ` AND CAST(dust AS CHAR) LIKE ${connection.escape(searchPattern)}`;
            } else if (field === 'soilMoisture') {
                condition += ` AND CAST(soilMoisture AS CHAR) LIKE ${connection.escape(searchPattern)}`;
            } else if (field === 'noise') {
                condition += ` AND CAST(noise AS CHAR) LIKE ${connection.escape(searchPattern)}`;
            } else if (field === 'time') {
                condition += ` AND DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') LIKE ${connection.escape(searchPattern)}`;
            } else if (field === 'all') {
                condition += ` AND (
                                CAST(id AS CHAR) LIKE ${connection.escape(searchPattern)} 
                                OR CAST(temperature AS CHAR) LIKE ${connection.escape(searchPattern)}
                                OR CAST(humidity AS CHAR) LIKE ${connection.escape(searchPattern)}
                                OR CAST(light AS CHAR) LIKE ${connection.escape(searchPattern)}
                                OR CAST(dust AS CHAR) LIKE ${connection.escape(searchPattern)}
                                OR CAST(soilMoisture AS CHAR) LIKE ${connection.escape(searchPattern)}
                                OR CAST(noise AS CHAR) LIKE ${connection.escape(searchPattern)}
                                OR DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') LIKE ${connection.escape(searchPattern)}
                              )`;
            }
        }
    }

    query += condition;
    countQuery += condition;
    query += ` ORDER BY ${connection.escapeId(sortField)} ${sortOrder === 'ASC' ? 'ASC' : 'DESC'} LIMIT ? OFFSET ?`;

    connection.query(query, [parseInt(pageSize), parseInt(offset)], (err, results) => {
        if (err) {
            console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err);
            return res.status(500).json({ error: "Lỗi khi truy vấn cơ sở dữ liệu" });
        }

        connection.query(countQuery, (countErr, countResults) => {
            if (countErr) {
                console.error("Lỗi khi lấy tổng số dòng từ cơ sở dữ liệu:", countErr);
                return res.status(500).json({ error: "Lỗi khi lấy tổng số dòng từ cơ sở dữ liệu" });
            }

            const totalCount = countResults[0].totalCount;
            const totalPages = Math.ceil(totalCount / pageSize);

            res.json({
                data: results,
                pagination: {
                    currentPage: parseInt(page),
                    pageSize: parseInt(pageSize),
                    totalRows: totalCount,
                    totalPages: totalPages
                }
            });
        });
    });
};

// Xuất hàm để sử dụng ở nơi khác
module.exports = { getSensorData, handleSensorData };




