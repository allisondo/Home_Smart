
function fetchSensorData() {
    fetch('http://localhost:5000/api/sensors?page=1&pageSize=10') // Thêm phân trang nếu cần
        .then(response => response.json())
        .then(data => {
            if (data.data.length > 0) { // Truy cập đúng cấu trúc dữ liệu trả về
                const latestData = data.data[0]; // Lấy dữ liệu đầu tiên
                document.getElementById('temperatureDisplay').innerText = `${latestData.temperature} °C`;
                document.getElementById('humidityDisplay').innerText = `${latestData.humidity}%`;
                document.getElementById('lightDisplay').innerText = `${latestData.light} lux`;

                // Lấy 10 dữ liệu gần nhất
                const recentData = data.data.slice(-10); // Chỉ lấy 10 dữ liệu cuối cùng
                updateChart(recentData);

                // Cập nhật biểu tượng nhiệt độ
                updateTemperatureIcon(latestData.temperature);
                updateHumidityIcon(latestData.humidity);
                updateLightIcon(latestData.light);
            }
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu cảm biến:', error));
}

// Hàm cập nhật biểu đồ với dữ liệu mới
// Function to update the chart with smooth, elegant lines

let roomChart = null;  // Khai báo biến toàn cục

// Hàm cập nhật biểu đồ với dữ liệu mới
function updateChart(data) {
    // const labels = data.map(item => item.time);
    const labels = data.map(item => {
        return new Date(item.time).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false
        });
    });
    const temperatureData = data.map(item => item.temperature);
    const humidityData = data.map(item => item.humidity);
    const lightData = data.map(item => item.light);

    const ctx = document.getElementById('roomChart').getContext('2d');

    // Nếu biểu đồ đã tồn tại thì hủy nó trước khi tạo biểu đồ mới
    if (roomChart !== null) {
        roomChart.destroy();
    }

    roomChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [

                {
                    label: 'Nhiệt độ (°C)',
                    data: temperatureData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    pointRadius: 3,  // Kích thước điểm nhỏ hơn
                    lineTension: 0.3  // Đường mềm mại hơn
                },
                {
                    label: 'Độ ẩm (%)',
                    data: humidityData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                    pointRadius: 5,
                    lineTension: 0.1
                },
                {
                    label: 'Ánh sáng (Lux)',
                    data: lightData,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    fill: true,
                    pointRadius: 5,
                    lineTension: 0.1
                },
                // {
                //     data: largeDataset.slice(0, 100)  // Chỉ hiển thị 100 điểm dữ liệu đầu tiên
                // }

            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        autoSkip: true,  // Tự động bỏ qua một số nhãn nếu chúng quá sát nhau
                        maxTicksLimit: 10, // Giới hạn số lượng nhãn tối đa hiển thị

                    }
                },
                // y: {
                //     title: {
                //         display: true,
                        
                //     },
                //     beginAtZero: true
                // }
            }
        }
    });
}


// Gọi hàm để lấy dữ liệu cảm biến và cập nhật giao diện mỗi 2 giây
fetchSensorData();
setInterval(fetchSensorData, 2000);



// Hàm cập nhật biểu tượng nhiệt độ
function updateTemperatureIcon(temperature) {
    const icon = document.getElementById('temperatureIcon');
    icon.classList.remove('icon-cold', 'icon-cool', 'icon-warm', 'icon-hot', 'icon-extreme');

    if (temperature <= 25) {
        icon.classList.add('icon-cold');
    } else if (temperature <= 26.5) {
        icon.classList.add('icon-cool');
    } else if (temperature <= 28) {
        icon.classList.add('icon-warm');
    } else if (temperature <= 30) {
        icon.classList.add('icon-hot');
    } else {
        icon.classList.add('icon-extreme');
    }
}

// Hàm cập nhật icon độ ẩm
function updateHumidityIcon(humidity) {
    const icon = document.getElementById('humidityIcon');
    icon.classList.remove('icon-low-humidity', 'icon-moderate-humidity', 'icon-high-humidity');

    if (humidity < 61) {
        icon.classList.add('icon-low-humidity');
    } else if (humidity <= 65) {
        icon.classList.add('icon-moderate-humidity');
    } else {
        icon.classList.add('icon-high-humidity');
    }
}

// Hàm cập nhật icon ánh sáng
function updateLightIcon(light) {
    const icon = document.getElementById('lightIcon1');
    icon.classList.remove('icon-low-light', 'icon-moderate-light', 'icon-high-light');

    if (light < 850) {
        icon.classList.add('icon-low-light');
    } else if (light <= 890) {
        icon.classList.add('icon-moderate-light');
    } else {
        icon.classList.add('icon-high-light');
    }
}



const deviceMapping = {
    ac: 'conditioner',
    fan: 'fan',
    light: 'light'
};



// Hàm điều khiển thiết bị
function controlDevice(device, status) {
    const mappedDevice = deviceMapping[device] || device;
    fetch(`http://localhost:5000/api/control/${mappedDevice}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status })
    })
        .then(() => console.log(`${device} is turned ${status}`))
        .catch(error => console.error(`Lỗi khi điều khiển ${device}:`, error));
}

// Sự kiện điều khiển đèn
document.getElementById('lightOn').addEventListener('click', function () {
    //  document.getElementById('lightIcon').classList.add('light-on');
    controlDevice('light', 'on');
    this.classList.add('btn-on-active');
    this.classList.remove('btn-success');
    document.getElementById('lightOff').classList.remove('btn-off-active');
    document.getElementById('lightOff').classList.add('btn-danger');
});

document.getElementById('lightOff').addEventListener('click', function () {
    //  document.getElementById('lightIcon').classList.remove('light-on');
    controlDevice('light', 'off');
    this.classList.add('btn-off-active');
    this.classList.remove('btn-danger');
    document.getElementById('lightOn').classList.remove('btn-on-active');
    document.getElementById('lightOn').classList.add('btn-success');
});

// Sự kiện điều khiển quạt
document.getElementById('fanOn').addEventListener('click', function () {
    // document.getElementById('fanIcon').classList.add('fan-spin', 'fan-active');
    controlDevice('fan', 'on');
    this.classList.add('btn-on-active');
    this.classList.remove('btn-success');
    document.getElementById('fanOff').classList.remove('btn-off-active');
    document.getElementById('fanOff').classList.add('btn-danger');
});

document.getElementById('fanOff').addEventListener('click', function () {
    //  document.getElementById('fanIcon').classList.remove('fan-spin', 'fan-active');
    controlDevice('fan', 'off');
    this.classList.add('btn-off-active');
    this.classList.remove('btn-danger');
    document.getElementById('fanOn').classList.remove('btn-on-active');
    document.getElementById('fanOn').classList.add('btn-success');
});



document.getElementById('acOn').addEventListener('click', function () {
    //  document.getElementById('acIcon').classList.add('ac-blow');
    controlDevice('ac', 'on');
    this.classList.add('btn-on-active');
    this.classList.remove('btn-success');
    document.getElementById('acOff').classList.remove('btn-off-active');
    document.getElementById('acOff').classList.add('btn-danger');
});

document.getElementById('acOff').addEventListener('click', function () {
    //  document.getElementById('acIcon').classList.remove('ac-blow');
    controlDevice('ac', 'off');
    this.classList.add('btn-off-active');
    this.classList.remove('btn-danger');
    document.getElementById('acOn').classList.remove('btn-on-active');
    document.getElementById('acOn').classList.add('btn-success');
});

document.addEventListener('DOMContentLoaded', () => {
    // Hàm để cập nhật icon dựa trên trạng thái thiết bị
    const updateIcons = (deviceStatus) => {
        // Cập nhật trạng thái của Fan
        const fanIcon = document.getElementById('fanIcon');
        fanIcon.classList.toggle('fan-active', deviceStatus.fan === '1');
        fanIcon.classList.toggle('fan-spin', deviceStatus.fan === '1');
        fanIcon.classList.toggle('text-danger', deviceStatus.fan === '0');

        // Cập nhật trạng thái của Light
        const lightIcon = document.getElementById('lightIcon');
        lightIcon.classList.toggle('light-on', deviceStatus.light === '1');
        lightIcon.classList.toggle('text-danger', deviceStatus.light === '0');

        // Cập nhật trạng thái của Air Conditioner
        const acIcon = document.getElementById('acIcon');
        acIcon.classList.toggle('text-success', deviceStatus.conditioner === '1');
        acIcon.classList.toggle('ac-blow', deviceStatus.conditioner === '1');
        acIcon.classList.toggle('text-danger', deviceStatus.conditioner === '0');
    };

    // Hàm gọi API và cập nhật trạng thái
    const fetchDeviceStatus = () => {
        fetch('http://localhost:5000/api/device-status')
            .then(response => response.json())
            .then(data => {
                updateIcons(data);

                // Cập nhật trạng thái nút dựa trên trạng thái thiết bị
                if (data.fan === '1') {
                    document.getElementById('fanOn').classList.add('btn-on-active');
                    document.getElementById('fanOff').classList.remove('btn-off-active');
                } else {
                    document.getElementById('fanOff').classList.add('btn-off-active');
                    document.getElementById('fanOn').classList.remove('btn-on-active');
                }

                if (data.light === '1') {
                    document.getElementById('lightOn').classList.add('btn-on-active');
                    document.getElementById('lightOff').classList.remove('btn-off-active');
                } else {
                    document.getElementById('lightOff').classList.add('btn-off-active');
                    document.getElementById('lightOn').classList.remove('btn-on-active');
                }

                if (data.conditioner === '1') {
                    document.getElementById('acOn').classList.add('btn-on-active');
                    document.getElementById('acOff').classList.remove('btn-off-active');
                } else {
                    document.getElementById('acOff').classList.add('btn-off-active');
                    document.getElementById('acOn').classList.remove('btn-on-active');
                }
            })
            .catch(error => console.error('Lỗi khi lấy trạng thái thiết bị:', error));
    };

    // Gọi API khi trang được tải và cập nhật trạng thái icon
    fetchDeviceStatus();

    // Cập nhật trạng thái mỗi 5 giây
    setInterval(fetchDeviceStatus, 2000);
});




