const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');
const missionPlanningController = require('../controllers/missionPlanningController');
const geofencingController = require('../controllers/geofencingController');
const collisionAvoidanceController = require('../controllers/collisionAvoidanceController');
const predictiveMaintenanceController = require('../controllers/predictiveMaintenanceController');
const mapController = require('../controllers/mapController');
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Telemetry Routes
router.get('/telemetry', authMiddleware.authenticate, telemetryController.getTelemetry);
router.post('/telemetry', authMiddleware.authenticate, telemetryController.updateTelemetry);

// Mission Planning Routes
router.get('/missions', authMiddleware.authenticate, missionPlanningController.getMissions);
router.post('/missions', authMiddleware.authenticate, missionPlanningController.createMission);
router.put('/missions/:id', authMiddleware.authenticate, missionPlanningController.updateMission);
router.delete('/missions/:id', authMiddleware.authenticate, missionPlanningController.deleteMission);

// Geofencing Routes
router.get('/geofences', authMiddleware.authenticate, geofencingController.getGeofences);
router.post('/geofences', authMiddleware.authenticate, geofencingController.createGeofence);
router.put('/geofences/:id', authMiddleware.authenticate, geofencingController.updateGeofence);
router.delete('/geofences/:id', authMiddleware.authenticate, geofencingController.deleteGeofence);

// Collision Avoidance Routes
router.get('/collisions', authMiddleware.authenticate, collisionAvoidanceController.getCollisions);
router.post('/collisions', authMiddleware.authenticate, collisionAvoidanceController.handleCollision);

// Predictive Maintenance Routes
router.get('/maintenance', authMiddleware.authenticate, predictiveMaintenanceController.getMaintenance);
router.post('/maintenance', authMiddleware.authenticate, predictiveMaintenanceController.scheduleMaintenance);

// Map Routes
router.get('/map', authMiddleware.authenticate, mapController.getMapData);

// Analytics Routes
router.get('/analytics', authMiddleware.authenticate, analyticsController.getAnalytics);

module.exports = router;
