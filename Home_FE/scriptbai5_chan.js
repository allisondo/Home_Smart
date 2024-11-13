function fetchSensorData() {
    fetch('http://localhost:5000/api/sensors?page=1&pageSize=10')
        .then(response => response.json())
        .then(data => {
            if (data.data.length > 0) {
                const latestData = data.data[0];
                document.getElementById('dustDisplay').innerText = `${latestData.dust} µg/m³`;
                document.getElementById('soilMoistureDisplay').innerText = `${latestData.soilMoisture}%`;
                document.getElementById('noiseDisplay').innerText = `${latestData.noise} dB`;

                // Lấy 10 điểm dữ liệu gần nhất cho biểu đồ
                const recentData = data.data.slice(-10);
                updateChart(recentData);

                // Cập nhật icon dựa trên giá trị cảm biến
                updateDustIcon(latestData.dust);
                updateSoilMoistureIcon(latestData.soilMoisture);
                updateNoiseIcon(latestData.noise);
            }
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu cảm biến:', error));
}

// Hàm cập nhật biểu đồ với dữ liệu mới
let roomChart = null;

function updateChart(data) {
    const labels = data.map(item => {
        return new Date(item.time).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false
        });
    });
    const dustData = data.map(item => item.dust);
    const soilMoistureData = data.map(item => item.soilMoisture);
    const noiseData = data.map(item => item.noise);

    const ctx = document.getElementById('roomChart').getContext('2d');

    // Hủy biểu đồ nếu đã tồn tại trước đó
    if (roomChart !== null) {
        roomChart.destroy();
    }

    roomChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Độ bụi (µg/m³)',
                    data: dustData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    pointRadius: 3,
                    lineTension: 0.3
                },
                {
                    label: 'Độ ẩm đất (%)',
                    data: soilMoistureData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                    pointRadius: 5,
                    lineTension: 0.1
                },
                {
                    label: 'Tiếng ồn (dB)',
                    data: noiseData,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    fill: true,
                    pointRadius: 5,
                    lineTension: 0.1
                }
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                }
            }
        }
    });
}

// Cập nhật dữ liệu cảm biến mỗi 2 giây
fetchSensorData();
setInterval(fetchSensorData, 2000);

// Cập nhật icon dựa trên giá trị độ bụi
function updateDustIcon(dust) {
    const icon = document.getElementById('dustIcon');
    icon.classList.remove('icon-low-dust', 'icon-moderate-dust', 'icon-high-dust');

    if (dust < 50) {
        icon.classList.add('icon-low-dust');
    } else if (dust <= 70) {
        icon.classList.add('icon-moderate-dust');
    } else {
        icon.classList.add('icon-high-dust');
    }
}

// Cập nhật icon cho độ ẩm đất
function updateSoilMoistureIcon(soilMoisture) {
    const icon = document.getElementById('soilMoistureIcon');
    icon.classList.remove('icon-low-soil-moisture', 'icon-moderate-soil-moisture', 'icon-high-soil-moisture');

    if (soilMoisture < 50) {
        icon.classList.add('icon-low-soil-moisture');
    } else if (soilMoisture <= 70) {
        icon.classList.add('icon-moderate-soil-moisture');
    } else {
        icon.classList.add('icon-high-soil-moisture');
    }
}

// Cập nhật icon cho tiếng ồn
function updateNoiseIcon(noise) {
    const icon = document.getElementById('noiseIcon');
    icon.classList.remove('icon-low-noise', 'icon-moderate-noise', 'icon-high-noise');

    if (noise < 50) {
        icon.classList.add('icon-low-noise');
    } else if (noise <= 70) {
        icon.classList.add('icon-moderate-noise');
    } else {
        icon.classList.add('icon-high-noise');
    }
}
