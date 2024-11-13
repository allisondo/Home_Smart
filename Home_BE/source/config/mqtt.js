const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://192.168.3.187:1884', {
    username: 'phuongthao',
    password: '12345'
});

client.on('connect', () => {
    console.log('Đã kết nối đến MQTT broker thành công!');
});

module.exports = client;
