const { insertSensorData } = require('../models/sensorModel');
const connection = require('../config/database'); // Kết nối tới MySQL


const handleSensorData = (data) => {
    const temperature = data.temperature;
    const humidity = data.humidity;
    const light = data.light;

    insertSensorData(temperature, humidity, light, (err, results) => {
        if (err) {
            console.error('Lỗi khi chèn dữ liệu vào MySQL (sensors):', err);
        }
        //else {
        //     console.log('Dữ liệu đã được chèn thành công vào bảng sensors:', results);
        // }
    });
}
// api lấy dữ liệu cảm biến từ bảng sensor
const getSensorData = (req, res) => {
    console.log('Query parameters:', req.query);
    const { field = 'all', search, page = 1, pageSize = 20, sortField = 'time', sortOrder = 'DESC' } = req.query;

    const offset = (page - 1) * pageSize;

    let query = "SELECT * FROM sensors WHERE 1=1";
    let countQuery = "SELECT COUNT(*) AS totalCount FROM sensors WHERE 1=1";
    let condition = "";

    if (search) {
        if (field.toLowerCase() === 'id') {
            // Tìm kiếm chính xác theo ID
            condition += ` AND id = ${connection.escape(search)}`;
        } else {
            const searchPattern = `%${search}%`; // Tìm kiếm chuỗi chứa giá trị tìm kiếm

            if (field === 'temperature') {
                condition += ` AND CAST(temperature AS CHAR) LIKE ${connection.escape(searchPattern)}`;
            } else if (field === 'humidity') {
                condition += ` AND CAST(humidity AS CHAR) LIKE ${connection.escape(searchPattern)}`;
            } else if (field === 'light') {
                condition += ` AND CAST(light AS CHAR) LIKE ${connection.escape(searchPattern)}`;
            } else if (field === 'time') {
                condition += ` AND DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') LIKE ${connection.escape(searchPattern)}`;
            } else if (field === 'all') {
                condition += ` AND (
                                CAST(id AS CHAR) LIKE ${connection.escape(searchPattern)} 
                                OR CAST(temperature AS CHAR) LIKE ${connection.escape(searchPattern)}
                                OR CAST(humidity AS CHAR) LIKE ${connection.escape(searchPattern)}
                                OR CAST(light AS CHAR) LIKE ${connection.escape(searchPattern)}
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







