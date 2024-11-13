
let currentPage = 1;
let rowsPerPage = 5; // Số hàng mặc định mỗi trang
let sensorData = []; // Biến toàn cục để lưu trữ dữ liệu cảm biến từ API
let sortField = 'time'; // Mặc định sắp xếp theo thời gian
let sortOrder = 'DESC'; // Mặc định là giảm dần
let totalPages = 1; // Tổng số trang từ API
let searchValue = ''; // Lưu trữ giá trị tìm kiếm của người dùng
let searchField = 'all'; // Trường tìm kiếm mặc định

// Hàm sắp xếp cột theo dữ liệu tìm kiếm hiện tại

// Hàm sắp xếp cột
function sortTable(field) {
    if (sortField === field) {
        sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
        sortField = field;
        sortOrder = 'ASC';
    }

    updateSortIcons();
    fetchSensorData();
}
// Hàm sắp xếp dữ liệu trong mảng `sensorData`
function sortSensorData() {
    sensorData.sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];

        // Nếu là cột thời gian, chuyển thành giá trị thời gian để sắp xếp
        if (sortField === 'time') {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        }

        if (sortOrder === 'ASC') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
}

// Hàm cập nhật biểu tượng sắp xếp cho mỗi cột
function updateSortIcons() {
    const fields = ['id', 'temperature', 'humidity', 'light', 'dust', 'soilMoisture', 'noise', 'time'];
    fields.forEach(field => {
        const icon = document.getElementById(`sortIcon-${field}`);
        if (icon) {
            icon.textContent = (field === sortField) ? (sortOrder === 'ASC' ? '▲' : '▼') : '⇅';
        }
    });
}

//document.addEventListener('DOMContentLoaded', fetchSensorData);

// Hàm lấy dữ liệu từ backend
async function fetchSensorData() {
    let url = `http://localhost:5000/api/sensors?page=${currentPage}&pageSize=${rowsPerPage}&sortField=${sortField}&sortOrder=${sortOrder}`;

    // Nếu có tìm kiếm, thêm search và field vào URL
    if (searchValue.trim() !== '') {
        url += `&field=${searchField}&search=${encodeURIComponent(searchValue)}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        sensorData = data.data || [];
        totalPages = data.pagination ? data.pagination.totalPages : 1;

        displayFilteredTable(sensorData);
        document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu cảm biến:', error);
    }
}

// Hàm hiển thị tất cả các cột dữ liệu của dòng tìm thấy
function displayFilteredTable(data) {
    const dataTableBody = document.querySelector('#dataTable tbody');
    dataTableBody.innerHTML = ''; // Xóa dữ liệu cũ

    data.forEach((rowData, index) => {
        const row = `
            <tr>
                <td>${rowData.id}</td>
                <td>${rowData.temperature ? `${rowData.temperature} °C` : 'N/A'}</td>
                <td>${rowData.humidity ? `${rowData.humidity} %` : 'N/A'}</td>
                <td>${rowData.light ? `${rowData.light} Lumens` : 'N/A'}</td>
                <td>${rowData.dust ? `${rowData.dust} µg/m³` : 'N/A'}</td>
                <td>${rowData.soilMoisture ? `${rowData.soilMoisture} %` : 'N/A'}</td>
                <td>${rowData.noise ? `${rowData.noise} dB` : 'N/A'}</td>
                <td>${formatDateTime(rowData.time)}</td>
            </tr>
        `;
        dataTableBody.insertAdjacentHTML('beforeend', row);
    });

    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}

// Cập nhật lựa chọn trong ô tìm kiếm
document.addEventListener('DOMContentLoaded', () => {
    fetchSensorData();

    // Cập nhật các lựa chọn trong ô select cho phần tìm kiếm
    const searchOption = document.getElementById('searchOption');
    searchOption.innerHTML = `
        <option value="all">ALL</option>
        <option value="id">ID</option>
        <option value="temperature">Nhiệt độ</option>
        <option value="humidity">Độ ẩm</option>
        <option value="light">Ánh sáng</option>
        <option value="dust">Độ bụi</option>
        <option value="soilMoisture">Độ ẩm đất</option>
        <option value="noise">Tiếng ồn</option>
        <option value="time">Thời gian</option>
    `;
});

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Hàm xử lý khi nhấn nút tìm kiếm
function performSearch() {
    searchField = document.getElementById('searchOption').value || 'all';
    searchValue = document.getElementById('searchValue').value.trim();
    currentPage = 1; // Đặt lại trang đầu tiên khi tìm kiếm mới

    fetchSensorData(); // Gọi lại API để cập nhật kết quả tìm kiếm
}

// Hàm xóa điều kiện tìm kiếm
function clearSearch() {
    document.getElementById('searchOption').value = 'all';
    document.getElementById('searchValue').value = ''; // Xóa giá trị tìm kiếm
    fetchSensorData(); // Tải lại dữ liệu từ API để xóa bộ lọc tìm kiếm
}

// Gọi hàm để lấy dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', fetchSensorData);

// Hàm chuyển sang trang trước
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchSensorData(); // Gọi lại API để cập nhật dữ liệu
    }
}

// Hàm chuyển trang sau
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchSensorData(); // Gọi lại API để cập nhật dữ liệu
    } else {
        console.log("Không thể sang trang tiếp theo vì đây là trang cuối cùng.");
    }
}

// Hàm thay đổi số hàng mỗi trang và cập nhật lại hiển thị
function changePageSize() {
    const pageSizeSelect = document.getElementById('pageSize');
    rowsPerPage = parseInt(pageSizeSelect.value); // Cập nhật số hàng mỗi trang
    currentPage = 1; // Đặt lại trang về trang đầu tiên
    fetchSensorData(); // Gọi lại API để làm mới bảng với kích thước trang mới
}
