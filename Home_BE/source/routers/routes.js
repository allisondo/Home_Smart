const express = require('express');
const router = express.Router();
const { getSensorData } = require('../controllers/sensorController');
const { controlLight, controlFan, controlConditioner } = require('../controllers/controlController');
const { getActivityHistory } = require('../controllers/activityController'); // Ensure you have this controller function

//const { updateDeviceStatus } = require('../controllers/deviceController');
// Định tuyến cho API lấy dữ liệu cảm biến
router.get('/sensors', getSensorData);

// Định tuyến cho API điều khiển thiết bị
router.post('/control/light', controlLight);
router.post('/control/fan', controlFan);
router.post('/control/conditioner', controlConditioner);
//router.post('/api/update-device-status', updateDeviceStatus);

module.exports = router;
