const connection = require('../config/database');

// API để lấy lịch sử hoạt động từ bảng activity_history, có thể lọc theo thời gian
const getActivityHistory = (req, res) => {
    console.log('Query parameters activity history:', req.query);
    const { field = 'all', search, page = 1, pageSize = 20, sortField = 'time', sortOrder = 'DESC' } = req.query;
    const offset = (page - 1) * pageSize;


    let query = "SELECT * FROM activity_history WHERE 1=1";

    let countQuery = "SELECT COUNT(*) AS totalCount FROM activity_history WHERE 1=1";
    let condition = "";

    if (search) {
        const searchPattern = `%${search}%`; // Tìm kiếm chuỗi chứa giá trị tìm kiếm

        if (field === 'time') {
            condition += ` AND DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') LIKE ${connection.escape(searchPattern)}`;
        } else if (field === 'all') {
            condition += ` AND (
                            CAST(id AS CHAR) LIKE ${connection.escape(searchPattern)} 
                            OR CAST(device_name AS CHAR) LIKE ${connection.escape(searchPattern)}
                            OR CAST(action AS CHAR) LIKE ${connection.escape(searchPattern)}
                            OR DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') LIKE ${connection.escape(searchPattern)}
                          )`;
        }
    }

    query += condition;
    countQuery += condition;
    query += ` ORDER BY ${connection.escapeId(sortField)} ${sortOrder === 'ASC' ? 'ASC' : 'DESC'} LIMIT ? OFFSET ?`;

    // console.log('Final Query:', query);
    // console.log('Final Count Query:', countQuery);

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


module.exports = { getActivityHistory };
