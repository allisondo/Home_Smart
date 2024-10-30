let currentPage = 1;
let rowsPerPage = 5; // Default to 5 rows per page
let tableData = []; // This will store all the data fetched from the backend

const table = document.getElementById('deviceInfoTable');
const tbody = table.getElementsByTagName('tbody')[0];

// Function to format date in 'DD/MM/YYYY HH:MM:SS' format

function formatDate(date) {
    const d = new Date(date);

    // Extract year, month, day, hours, minutes, and seconds
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    // Format the date as 'YYYY-MM-DD HH:MM:SS'
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// Function to fetch device status from the backend
async function fetchDeviceStatus() {
    try {
        const response = await fetch('http://localhost:5000/api/activity-history');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched Data:', data); // Thêm dòng này để log dữ liệu vào console
        tableData = data; // Store the fetched data
        populateTable();  // Populate the table with fetched data
    } catch (error) {
        console.error('Error fetching device status:', error);
    }
}


// Function to populate the table based on the current page and search filter
// Function to populate the table based on the current page and search filter
function populateTable() {
    tbody.innerHTML = ''; // Clear the table before populating

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = tableData.filter(item => {
        const deviceName = item.device_name ? item.device_name.toLowerCase() : ''; // Sử dụng device_name thay vì deviceName
        const formattedDate = item.time ? formatDate(item.time) : '';  // Sử dụng time thay vì timestamp

        return deviceName.includes(searchTerm) || formattedDate.includes(searchTerm);
    });

    const totalRows = filteredData.length;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = filteredData.slice(start, end);

    pageData.forEach((device, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${device.device_name || 'N/A'}</td>  <!-- Sử dụng device_name -->
            <td>${device.action || 'N/A'}</td>  <!-- Sử dụng action -->
            <td>${device.time ? formatDate(device.time) : 'N/A'}</td> <!-- Sử dụng time -->
        `;
        tbody.appendChild(row);
    });

    // Update page info
    document.getElementById('page-info').innerText = `Page ${currentPage} of ${Math.ceil(totalRows / rowsPerPage)}`;
}



// Pagination controls
function prevPage() {
    if (currentPage > 1) {
        currentPage--; // Giảm số trang hiện tại
        populateTable(); // Cập nhật lại bảng
    }
}

function nextPage() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = tableData.filter(item => {
        const deviceName = item.device_name ? item.device_name.toLowerCase() : '';
        const formattedDate = item.time ? formatDate(item.time) : '';

        return deviceName.includes(searchTerm) || formattedDate.includes(searchTerm);
    });

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    if (currentPage < totalPages) {
        currentPage++; // Tăng số trang hiện tại
        populateTable(); // Cập nhật lại bảng
    }
}


// Function to change the page size
function changePageSize() {
    const pageSizeSelect = document.getElementById('pageSize');
    rowsPerPage = parseInt(pageSizeSelect.value); // Update the rows per page
    currentPage = 1; // Reset to the first page
    populateTable(); // Refresh the table with the new page size
}

// Function to handle the search
function performSearch() {
    currentPage = 1; // Reset to the first page when performing a search
    populateTable(); // Show the filtered results
}

// Initialize by fetching data from the backend
fetchDeviceStatus();
