let currentPage = 1;
let rowsPerPage = 10; // Số hàng mặc định mỗi trang
let deviceData = []; // Biến toàn cục để lưu trữ dữ liệu cảm biến từ API
let sortField = 'time'; // Mặc định sắp xếp theo thời gian
let sortOrder = 'DESC'; // Mặc định là giảm dần
let totalPages = 1; // Tổng số trang từ API
let searchValue = ''; // Lưu trữ giá trị tìm kiếm của người dùng
let searchField = 'all'; // Trường tìm kiếm mặc định


// Hàm sắp xếp cột theo dữ liệu tìm kiếm hiện tại
function sortTable(field) {
    if (sortField === field) {
        // Đổi thứ tự sắp xếp nếu nhấn cùng cột
        sortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
        // Nếu là cột khác, đặt cột mới và sắp xếp theo tăng dần
        sortField = field;
        sortOrder = 'ASC';
    }

    updateSortIcons();
    sortDeviceData();
    displayFilteredTable(deviceData, 'all'); // Hiển thị lại dữ liệu đã sắp xếp
}
// Hàm sắp xếp dữ liệu trong mảng `deviceData`

function sortDeviceData() {
    deviceData.sort((a, b) => {
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
    const fields = ['id', 'device_name', 'action', 'time'];
    fields.forEach(field => {
        const icon = document.getElementById(`sortIcon-${field}`);
        if (icon) {
            if (field === sortField) {
                icon.textContent = sortOrder === 'ASC' ? '▲' : '▼';
            } else {
                icon.textContent = '⇅'; // Biểu tượng mặc định khi không sắp xếp
            }
        }
    });
}
async function fetchDeviceHistory() {
    try {
        let url = `http://localhost:5000/api/activity-history?page=${currentPage}&pageSize=${rowsPerPage}`;
        // Nếu có tìm kiếm, thêm search và field vào URL
        if (searchValue.trim() !== '') {
            url += `&field=${searchField}&search=${encodeURIComponent(searchValue)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        deviceData = data.data || [];
        totalPages = data.pagination ? data.pagination.totalPages : 1;

        displayFilteredTable(deviceData);
        document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu cảm biến:', error);
    }
}

// Function to populate the table based on the current page and search filter
function displayFilteredTable(data) {
    const dataTableBody = document.querySelector('#dataTable tbody');
    dataTableBody.innerHTML = ''; // Xóa dữ liệu cũ

    data.forEach((rowData, index) => {
        const row = `
        <tr>
            <td>${rowData.id || i + 1}</td>
            <td>${rowData.device_name || 'N/A'}</td> 
            <td>${rowData.action || 'N/A'}</td> 
            <td>${formatDateTime(rowData.time)}</td>
        </tr>
        `;
        dataTableBody.insertAdjacentHTML('beforeend', row);
    });


    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
}

// Cập nhật lựa chọn trong ô tìm kiếm
document.addEventListener('DOMContentLoaded', () => {
    fetchDeviceHistory();

    // Cập nhật các lựa chọn trong ô select cho phần tìm kiếm
    const searchOption = document.getElementById('searchOption');
    searchOption.innerHTML = `
        <option value="all">ALL</option>
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


function performSearch() {
    searchField = document.getElementById('searchOption').value || 'all';
    searchValue = document.getElementById('searchValue').value.trim();
    currentPage = 1; // Đặt lại trang đầu tiên khi tìm kiếm mới

    fetchDeviceHistory(); // Gọi lại API để cập nhật kết quả tìm kiếm
}

// Thêm lựa chọn vào menu tìm kiếm
document.addEventListener('DOMContentLoaded', () => {
    fetchDeviceHistory();

    // Cập nhật các lựa chọn trong ô select cho phần tìm kiếm
    const searchOption = document.getElementById('searchOption');
    searchOption.innerHTML = `
        <option value="all">ALL</option>
        <option value="time">Thời gian</option>
    `;
});

// Hàm xóa điều kiện tìm kiếm
function clearSearch() {
    document.getElementById('searchOption').value = 'all';
    document.getElementById('searchValue').value = ''; // Xóa giá trị tìm kiếm
    fetchDeviceHistory(); // Tải lại dữ liệu từ API để xóa bộ lọc tìm kiếm
}

// Gọi hàm để lấy dữ liệu khi trang được tải
document.addEventListener('DOMContentLoaded', fetchDeviceHistory);

// Hàm chuyển trang trước
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchDeviceHistory(); // Gọi lại API để cập nhật dữ liệu
    }
}

// Hàm chuyển trang sau
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchDeviceHistory(); // Gọi lại API để cập nhật dữ liệu
    } else {
        console.log("Không thể sang trang tiếp theo vì đây là trang cuối cùng.");
    }
}

// Hàm thay đổi số hàng mỗi trang và cập nhật lại hiển thị
function changePageSize() {
    const pageSizeSelect = document.getElementById('pageSize');
    rowsPerPage = parseInt(pageSizeSelect.value); // Cập nhật số hàng mỗi trang
    currentPage = 1; // Đặt lại trang về trang đầu tiên
    fetchDeviceHistory();
}
