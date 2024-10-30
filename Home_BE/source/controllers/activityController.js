const connection = require('../config/database');

// API để lấy lịch sử hoạt động từ bảng activity_history, có thể lọc theo thời gian
const getActivityHistory = (req, res) => {
    const { time } = req.query;

    let query = 'SELECT * FROM activity_history';

    if (time) {
        query += ` WHERE time = STR_TO_DATE('${time}', '%Y-%m-%d %H:%i:%s')`; // Lọc theo thời gian
    }

    query += ' ORDER BY time DESC ';  // Giới hạn số kết quả

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi khi truy xuất dữ liệu từ MySQL:', err);
            res.status(500).send('Lỗi server');
        } else {
            res.json(results);
        }
    });
};

module.exports = { getActivityHistory };
