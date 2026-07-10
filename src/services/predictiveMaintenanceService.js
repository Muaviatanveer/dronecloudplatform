const { MongoClient } = require('mongodb');
const moment = require('moment');

class PredictiveMaintenanceService {
    constructor(uri) {
        this.uri = uri;
        this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.maintenanceCollection = null;
    }

    async connect() {
        await this.client.connect();
        this.maintenanceCollection = this.client.db('drone_management').collection('maintenance');
    }

    async predictAndScheduleMaintenance() {
        try {
            const now = moment();
            const oneYearAgo = now.clone().subtract(1, 'year');

            const drones = await this.client.db('drone_management').collection('drones').find({}).toArray();

            for (const drone of drones) {
                const lastMaintenanceDate = moment(drone.lastMaintenanceDate);
                const daysSinceLastMaintenance = now.diff(lastMaintenanceDate, 'days');

                if (daysSinceLastMaintenance >= 365) {
                    const maintenanceRecord = {
                        droneId: drone._id,
                        dateScheduled: now.toISOString(),
                        status: 'scheduled'
                    };

                    await this.maintenanceCollection.insertOne(maintenanceRecord);
                    console.log(`Maintenance scheduled for drone ${drone._id}`);
                }
            }
        } catch (error) {
            console.error('Error predicting and scheduling maintenance:', error);
        }
    }
}

module.exports = PredictiveMaintenanceService;
