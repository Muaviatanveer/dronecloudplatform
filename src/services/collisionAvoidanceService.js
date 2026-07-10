const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');

class CollisionAvoidanceService {
    constructor(uri) {
        this.uri = uri;
        this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.dronesCollection = null;
    }

    async connect() {
        await this.client.connect();
        this.dronesCollection = this.client.db('drone_management').collection('drones');
    }

    async adjustPath(droneId, newPosition) {
        try {
            const drone = await this.dronesCollection.findOneAndUpdate(
                { _id: droneId },
                { $set: { position: newPosition } },
                { returnDocument: 'after' }
            );

            if (!drone.value) {
                throw new Error('Drone not found');
            }

            console.log('Path adjusted successfully');
            return drone.value.position;
        } catch (error) {
            console.error('Error adjusting path:', error);
            throw error;
        }
    }

    async detectCollisions() {
        try {
            const drones = await this.dronesCollection.find().toArray();

            for (let i = 0; i < drones.length; i++) {
                for (let j = i + 1; j < drones.length; j++) {
                    const drone1 = drones[i];
                    const drone2 = drones[j];

                    const distance = Math.sqrt(
                        Math.pow(drone1.position.latitude - drone2.position.latitude, 2) +
                        Math.pow(drone1.position.longitude - drone2.position.longitude, 2)
                    );

                    if (distance <= 100) { // Assuming drones are considered colliding if within 100 meters
                        console.log(`Collision detected between drones ${drone1._id} and ${drone2._id}`);
                        await this.adjustPath(drone1._id, { latitude: drone1.position.latitude + 0.001, longitude: drone1.position.longitude + 0.001 });
                        await this.adjustPath(drone2._id, { latitude: drone2.position.latitude - 0.001, longitude: drone2.position.longitude - 0.001 });
                    }
                }
            }
        } catch (error) {
            console.error('Error detecting collisions:', error);
        }
    }
}

module.exports = CollisionAvoidanceService;
