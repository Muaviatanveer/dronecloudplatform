const { check } = require('express-validator');
const Drone = require('../models/Drone');
const Geofence = require('../models/Geofence');

exports.applyGeofencingRules = async (req, res, next) => {
    try {
        const droneId = req.body.droneId;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;

        const drone = await Drone.findById(droneId);
        if (!drone) {
            return res.status(404).json({ message: 'Drone not found' });
        }

        const geofences = await Geofence.find({});
        let insideGeofence = false;

        for (const geofence of geofences) {
            const { center, radius } = geofence;
            const distance = Math.sqrt(
                Math.pow(center.latitude - latitude, 2) +
                Math.pow(center.longitude - longitude, 2)
            );

            if (distance <= radius) {
                insideGeofence = true;
                break;
            }
        }

        if (insideGeofence) {
            return res.status(403).json({ message: 'Access denied: Drone is inside a restricted area' });
        }

        next();
    } catch (error) {
        next(error);
    }
};
