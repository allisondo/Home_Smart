// // Hàm lấy dữ liệu cảm biến và cập nhật giao diện


// function fetchSensorData() {
//     fetch('http://localhost:5000/api/sensors')
//         .then(response => response.json())
//         .then(data => {
//             if (data.length > 0) {
//                 const latestData = data[0];
//                 document.getElementById('temperatureDisplay').innerText = `${latestData.temperature} °C`;
//                 document.getElementById('humidityDisplay').innerText = `${latestData.humidity}%`;
//                 document.getElementById('lightDisplay').innerText = `${latestData.light} lux`;

//                 // Cập nhật biểu đồ
//                 //  updateChart(data);

//                 // Lấy 10 dữ liệu gần nhất
//                 const recentData = data.slice(-10);  // Chỉ lấy 10 dữ liệu cuối cùng
//                 updateChart(recentData);


//                 // Cập nhật biểu tượng nhiệt độ
//                 updateTemperatureIcon(latestData.temperature);
//                 updateHumidityIcon(latestData.humidity);
//                 updateLightIcon(latestData.light);
//             }
//         })
//         .catch(error => console.error('Lỗi khi lấy dữ liệu cảm biến:', error));
// }

// // Hàm cập nhật biểu đồ với dữ liệu mới
// // Function to update the chart with smooth, elegant lines

// let roomChart = null;  // Khai báo biến toàn cục

// // Hàm cập nhật biểu đồ với dữ liệu mới
// function updateChart(data) {
//     // const labels = data.map(item => item.time);
//     const labels = data.map(item => {
//         return new Date(item.time).toLocaleString('vi-VN', {
//             timeZone: 'Asia/Ho_Chi_Minh',
//             hour12: false
//         });
//     });
//     const temperatureData = data.map(item => item.temperature);
//     const humidityData = data.map(item => item.humidity);
//     const lightData = data.map(item => item.light);

//     const ctx = document.getElementById('roomChart').getContext('2d');

//     // Nếu biểu đồ đã tồn tại thì hủy nó trước khi tạo biểu đồ mới
//     if (roomChart !== null) {
//         roomChart.destroy();
//     }

//     roomChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: [

//                 {
//                     label: 'Nhiệt độ (°C)',
//                     data: temperatureData,
//                     borderColor: 'rgba(255, 99, 132, 1)',
//                     backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                     fill: false,
//                     pointRadius: 3,  // Kích thước điểm nhỏ hơn
//                     lineTension: 0.3  // Đường mềm mại hơn
//                 },
//                 {
//                     label: 'Độ ẩm (%)',
//                     data: humidityData,
//                     borderColor: 'rgba(54, 162, 235, 1)',
//                     backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                     fill: false,
//                     pointRadius: 5,
//                     lineTension: 0.1
//                 },
//                 {
//                     label: 'Ánh sáng (Lux)',
//                     data: lightData,
//                     borderColor: 'rgba(255, 206, 86, 1)',
//                     backgroundColor: 'rgba(255, 206, 86, 0.2)',
//                     fill: true,
//                     pointRadius: 5,
//                     lineTension: 0.1
//                 },
//                 // {
//                 //     data: largeDataset.slice(0, 100)  // Chỉ hiển thị 100 điểm dữ liệu đầu tiên
//                 // }

//             ],
//         },
//         options: {
//             responsive: true,
//             scales: {
//                 x: {
//                     ticks: {
//                         autoSkip: true,  // Tự động bỏ qua một số nhãn nếu chúng quá sát nhau
//                         maxTicksLimit: 5, // Giới hạn số lượng nhãn tối đa hiển thị

//                     }
//                 }
//             }
//         }
//     });
// }


// // Gọi hàm để lấy dữ liệu cảm biến và cập nhật giao diện mỗi 2 giây
// fetchSensorData();
// setInterval(fetchSensorData, 2000);



// // Hàm cập nhật biểu tượng nhiệt độ
// function updateTemperatureIcon(temperature) {
//     const icon = document.getElementById('temperatureIcon');
//     icon.classList.remove('icon-cold', 'icon-cool', 'icon-warm', 'icon-hot', 'icon-extreme');

//     if (temperature <= 25) {
//         icon.classList.add('icon-cold');
//     } else if (temperature <= 26.5) {
//         icon.classList.add('icon-cool');
//     } else if (temperature <= 28) {
//         icon.classList.add('icon-warm');
//     } else if (temperature <= 30) {
//         icon.classList.add('icon-hot');
//     } else {
//         icon.classList.add('icon-extreme');
//     }
// }

// // Hàm cập nhật icon độ ẩm
// function updateHumidityIcon(humidity) {
//     const icon = document.getElementById('humidityIcon');
//     icon.classList.remove('icon-low-humidity', 'icon-moderate-humidity', 'icon-high-humidity');

//     if (humidity < 61) {
//         icon.classList.add('icon-low-humidity');
//     } else if (humidity <= 65) {
//         icon.classList.add('icon-moderate-humidity');
//     } else {
//         icon.classList.add('icon-high-humidity');
//     }
// }

// // Hàm cập nhật icon ánh sáng
// function updateLightIcon(light) {
//     const icon = document.getElementById('lightIcon1');
//     icon.classList.remove('icon-low-light', 'icon-moderate-light', 'icon-high-light');

//     if (light < 850) {
//         icon.classList.add('icon-low-light');
//     } else if (light <= 890) {
//         icon.classList.add('icon-moderate-light');
//     } else {
//         icon.classList.add('icon-high-light');
//     }
// }


// // Hàm cập nhật ngày giờ và múi giờ
// function updateDateTime() {
//     const now = new Date();
//     const options = {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         timeZoneName: 'short'
//     };
//     const datetimeString = now.toLocaleDateString('vi-VN', options);
//     document.getElementById('datetime').innerText = datetimeString;
// }

// // Thiết lập cập nhật ngày giờ mỗi giây
// updateDateTime();
// setInterval(updateDateTime, 1000);

// const deviceMapping = {
//     ac: 'conditioner',
//     fan: 'fan',
//     light: 'light'
// };

// // Hàm điều khiển thiết bị
// function controlDevice(device, status) {
//     const mappedDevice = deviceMapping[device] || device;
//     fetch(`http://localhost:5000/api/control/${mappedDevice}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: status })
//     })
//         .then(() => console.log(`${device} is turned ${status}`))
//         .catch(error => console.error(`Lỗi khi điều khiển ${device}:`, error));
// }


// // Sự kiện điều khiển đèn
// document.getElementById('lightOn').addEventListener('click', function () {
//     document.getElementById('lightIcon').classList.add('light-on');
//     controlDevice('light', 'on');
//     this.classList.add('btn-on-active');
//     this.classList.remove('btn-success');
//     document.getElementById('lightOff').classList.remove('btn-off-active');
//     document.getElementById('lightOff').classList.add('btn-danger');
// });

// document.getElementById('lightOff').addEventListener('click', function () {
//     document.getElementById('lightIcon').classList.remove('light-on');
//     controlDevice('light', 'off');
//     this.classList.add('btn-off-active');
//     this.classList.remove('btn-danger');
//     document.getElementById('lightOn').classList.remove('btn-on-active');
//     document.getElementById('lightOn').classList.add('btn-success');
// });



// // Sự kiện điều khiển quạt
// document.getElementById('fanOn').addEventListener('click', function () {
//     document.getElementById('fanIcon').classList.add('fan-spin', 'fan-active');
//     controlDevice('fan', 'on');
//     this.classList.add('btn-on-active');
//     this.classList.remove('btn-success');
//     document.getElementById('fanOff').classList.remove('btn-off-active');
//     document.getElementById('fanOff').classList.add('btn-danger');
// });

// document.getElementById('fanOff').addEventListener('click', function () {
//     document.getElementById('fanIcon').classList.remove('fan-spin', 'fan-active');
//     controlDevice('fan', 'off');
//     this.classList.add('btn-off-active');
//     this.classList.remove('btn-danger');
//     document.getElementById('fanOn').classList.remove('btn-on-active');
//     document.getElementById('fanOn').classList.add('btn-success');
// });




// document.getElementById('acOn').addEventListener('click', function () {
//     document.getElementById('acIcon').classList.add('ac-blow');
//     controlDevice('ac', 'on');
//     this.classList.add('btn-on-active');
//     this.classList.remove('btn-success');
//     document.getElementById('acOff').classList.remove('btn-off-active');
//     document.getElementById('acOff').classList.add('btn-danger');
// });

// document.getElementById('acOff').addEventListener('click', function () {
//     document.getElementById('acIcon').classList.remove('ac-blow');
//     controlDevice('ac', 'off');
//     this.classList.add('btn-off-active');
//     this.classList.remove('btn-danger');
//     document.getElementById('acOn').classList.remove('btn-on-active');
//     document.getElementById('acOn').classList.add('btn-success');
// });


// // Gọi hàm để lấy dữ liệu cảm biến và cập nhật giao diện mỗi 2 giây
// fetchSensorData();
// setInterval(fetchSensorData, 2000);


// Hàm lấy dữ liệu cảm biến và cập nhật giao diện
// Hàm lấy dữ liệu cảm biến và cập nhật giao diện
function fetchSensorData() {
    fetch('http://localhost:5000/api/sensors')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const latestData = data[0];
                document.getElementById('temperatureDisplay').innerText = `${latestData.temperature} °C`;
                document.getElementById('humidityDisplay').innerText = `${latestData.humidity}%`;
                document.getElementById('lightDisplay').innerText = `${latestData.light} lux`;

                // Lấy 10 dữ liệu gần nhất
                const recentData = data.slice(-10);  // Chỉ lấy 10 dữ liệu cuối cùng
                updateChart(recentData);

                // Cập nhật biểu tượng nhiệt độ, độ ẩm, ánh sáng
                updateTemperatureIcon(latestData.temperature);
                updateHumidityIcon(latestData.humidity);
                updateLightIcon(latestData.light);
            }
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu cảm biến:', error));
}

// Hàm cập nhật biểu đồ với dữ liệu mới
let roomChart = null;  // Khai báo biến toàn cục

function updateChart(data) {
    const labels = data.map(item => new Date(item.time).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }));
    const temperatureData = data.map(item => item.temperature);
    const humidityData = data.map(item => item.humidity);
    const lightData = data.map(item => item.light);

    const ctx = document.getElementById('roomChart').getContext('2d');

    // Hủy biểu đồ cũ trước khi tạo mới
    if (roomChart !== null) {
        roomChart.destroy();
    }

    roomChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Nhiệt độ (°C)', data: temperatureData, borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)', fill: false, pointRadius: 3, lineTension: 0.3 },
                { label: 'Độ ẩm (%)', data: humidityData, borderColor: 'rgba(54, 162, 235, 1)', backgroundColor: 'rgba(54, 162, 235, 0.2)', fill: false, pointRadius: 5, lineTension: 0.1 },
                { label: 'Ánh sáng (Lux)', data: lightData, borderColor: 'rgba(255, 206, 86, 1)', backgroundColor: 'rgba(255, 206, 86, 0.2)', fill: true, pointRadius: 5, lineTension: 0.1 }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 5
                    }
                }
            }
        }
    });
}

// Hàm điều khiển thiết bị và cập nhật icon sau khi nhận phản hồi từ server
function controlDevice(device, status) {
    const mappedDevice = deviceMapping[device] || device;
    fetch(`http://localhost:5000/api/control/${mappedDevice}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(`${device} is turned ${status}`);
                updateIcon(device, status);  // Cập nhật icon sau khi server phản hồi thành công
            } else {
                console.error(`Failed to control ${device}:`, data.message);
            }
        })
        .catch(error => console.error(`Lỗi khi điều khiển ${device}:`, error));
}

// Hàm cập nhật icon theo trạng thái thiết bị
function updateIcon(device, status) {
    const icon = document.getElementById(`${device}Icon`);
    if (status === 'on') {
        icon.classList.add(`${device}-on`);
        icon.classList.remove(`${device}-off`);
    } else {
        icon.classList.remove(`${device}-on`);
        icon.classList.add(`${device}-off`);
    }
}

// Sự kiện điều khiển đèn
document.getElementById('lightOn').addEventListener('click', function () {
    controlDevice('light', 'on');
    this.classList.add('btn-on-active');
    this.classList.remove('btn-success');
    document.getElementById('lightOff').classList.remove('btn-off-active');
    document.getElementById('lightOff').classList.add('btn-danger');
});

document.getElementById('lightOff').addEventListener('click', function () {
    controlDevice('light', 'off');
    this.classList.add('btn-off-active');
    this.classList.remove('btn-danger');
    document.getElementById('lightOn').classList.remove('btn-on-active');
    document.getElementById('lightOn').classList.add('btn-success');
});

// Sự kiện điều khiển quạt
document.getElementById('fanOn').addEventListener('click', function () {
    controlDevice('fan', 'on');
    this.classList.add('btn-on-active');
    this.classList.remove('btn-success');
    document.getElementById('fanOff').classList.remove('btn-off-active');
    document.getElementById('fanOff').classList.add('btn-danger');
});

document.getElementById('fanOff').addEventListener('click', function () {
    controlDevice('fan', 'off');
    this.classList.add('btn-off-active');
    this.classList.remove('btn-danger');
    document.getElementById('fanOn').classList.remove('btn-on-active');
    document.getElementById('fanOn').classList.add('btn-success');
});

// Sự kiện điều khiển điều hòa
document.getElementById('acOn').addEventListener('click', function () {
    controlDevice('ac', 'on');
    this.classList.add('btn-on-active');
    this.classList.remove('btn-success');
    document.getElementById('acOff').classList.remove('btn-off-active');
    document.getElementById('acOff').classList.add('btn-danger');
});

document.getElementById('acOff').addEventListener('click', function () {
    controlDevice('ac', 'off');
    this.classList.add('btn-off-active');
    this.classList.remove('btn-danger');
    document.getElementById('acOn').classList.remove('btn-on-active');
    document.getElementById('acOn').classList.add('btn-success');
});

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

// Hàm cập nhật ngày giờ và múi giờ
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    const datetimeString = now.toLocaleDateString('vi-VN', options);
    document.getElementById('datetime').innerText = datetimeString;
}

// Thiết lập cập nhật ngày giờ mỗi giây
updateDateTime();
setInterval(updateDateTime, 1000);

const deviceMapping = {
    ac: 'conditioner',
    fan: 'fan',
    light: 'light'
};

