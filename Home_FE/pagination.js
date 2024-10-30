let currentPage = 1;
let rowsPerPage = 5; // Số hàng mặc định mỗi trang
let sensorData = []; // Biến toàn cục để lưu trữ dữ liệu cảm biến từ API

// Hàm để lấy dữ liệu từ API và hiển thị lên bảng
async function fetchSensorData() {
    try {
        //  const response = await fetch(`http://localhost:5000/api/sensors?pageSize=${rowsPerPage}&currentPage=${currentPage}`);
        const response = await fetch(`http://localhost:5000/api/sensors?`);
        const data = await response.json(); // Lưu trữ dữ liệu cảm biến

        // Kiểm tra xem dữ liệu có đúng cấu trúc không
        console.log('Dữ liệu từ API:', data);

        // Nếu cấu trúc không phải là data.data, ta có thể sửa thành data trực tiếp
        sensorData = data.data || data; // Đảm bảo rằng lấy đúng dữ liệu từ API

        displayFilteredTable(sensorData, 'all'); // Hiển thị dữ liệu với phân trang
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu cảm biến:', error);
    }
}



// Hàm hiển thị bảng với dữ liệu đã phân trang và lọc
function displayFilteredTable(data, option) {
    const dataTableBody = document.querySelector('#dataTable tbody');
    dataTableBody.innerHTML = ''; // Xóa dữ liệu cũ

    // Cập nhật tiêu đề bảng (header) dựa trên lựa chọn của người dùng
    let headers = '<th>ID</th><th>Time</th>';
    if (option === 'temperature' || option === 'all') headers += '<th>Temperature (°C)</th>';
    if (option === 'humidity' || option === 'all') headers += '<th>Humidity (%)</th>';
    if (option === 'light' || option === 'all') headers += '<th>Light (Lumens)</th>';

    document.querySelector('#dataTable thead tr').innerHTML = headers; // Cập nhật tiêu đề bảng

    // Tính toán phân trang
    const totalRows = data.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    // Hiển thị dữ liệu theo phân trang
    for (let i = start; i < end && i < totalRows; i++) {
        let row = `<tr><td>${i + 1}</td><td>${new Date(data[i].time).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })}</td>`;
        if (option === 'temperature' || option === 'all') row += `<td>${data[i].temperature ? `${data[i].temperature} °C` : 'N/A'}</td>`;
        if (option === 'humidity' || option === 'all') row += `<td>${data[i].humidity ? `${data[i].humidity} %` : 'N/A'}</td>`;
        if (option === 'light' || option === 'all') row += `<td>${data[i].light ? `${data[i].light} Lumens` : 'N/A'}</td>`;
        row += `</tr>`;

        dataTableBody.insertAdjacentHTML('beforeend', row);
    }

    // Cập nhật thông tin phân trang
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}


function formatDateTime(input) {
    // Tách chuỗi thành giờ và ngày
    const [time, date] = input.split(' ');
    const [day, month, year] = date.split('/');
    // Trả về định dạng ISO: YYYY-MM-DDTHH:MM:SS
    return `${year}-${month}-${day}T${time}`;
}


// Hàm để thực hiện tìm kiếm dựa trên trường đã chọn và thời gian cụ thể
async function performSearch() {
    const option = document.getElementById('searchOption').value || 'all'; // Mặc định là 'all' nếu không chọn
    const searchValue = document.getElementById('searchValue').value; // Lấy thời gian cụ thể từ ô text

    // Kiểm tra xem searchValue có hợp lệ hay không trước khi chuyển đổi
    let url = `http://localhost:5000/api/sensors?`;

    // Nếu người dùng không chọn trường dữ liệu, mặc định sẽ là 'all'
    if (option === 'all' || !option) {
        url += 'field=all&'; // Mặc định là 'all' nếu không chọn
    } else {
        url += `field=${option}&`;
    }

    // Nếu người dùng có nhập thời gian, thêm thời gian vào URL
    if (searchValue) {
        const formattedTime = formatDateTime(searchValue); // Chuyển thời gian sang ISO
        url += `time=${encodeURIComponent(formattedTime)}&`;
    }

    console.log('Search URL:', url); // Kiểm tra URL gửi đi

    try {
        const response = await fetch(url); // Gửi request với tham số
        const data = await response.json(); // Nhận dữ liệu từ API

        // Kiểm tra cấu trúc trả về từ API
        console.log('Dữ liệu tìm kiếm:', data);

        sensorData = data.data || data; // Cập nhật biến toàn cục, đảm bảo nhận đúng dữ liệu
        displayFilteredTable(sensorData, option); // Hiển thị dữ liệu lọc theo yêu cầu
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
    }
}


// Hàm xóa điều kiện tìm kiếm
function clearSearch() {
    document.getElementById('searchOption').value = 'all';
    document.getElementById('searchValue').value = ''; // Xóa giá trị tìm kiếm
    fetchSensorData(); // Tải lại dữ liệu từ API để xóa bộ lọc tìm kiếm
}

// Gọi hàm để lấy dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', fetchSensorData);

// Hàm chuyển trang trước
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayFilteredTable(sensorData, document.getElementById('searchOption').value);
    }
}

// Hàm chuyển trang sau
function nextPage() {
    const totalRows = sensorData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        displayFilteredTable(sensorData, document.getElementById('searchOption').value);
    }
}

// Hàm thay đổi số hàng mỗi trang và cập nhật lại hiển thị
function changePageSize() {
    const pageSizeSelect = document.getElementById('pageSize');
    rowsPerPage = parseInt(pageSizeSelect.value); // Cập nhật số hàng mỗi trang
    currentPage = 1; // Đặt lại trang về trang đầu tiên
    displayFilteredTable(sensorData, document.getElementById('searchOption').value); // Làm mới bảng với kích thước trang mới
}
