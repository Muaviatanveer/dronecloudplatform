const WebSocket = require('ws');
const { MongoClient } = require('mongodb');

class TelemetryService {
    constructor(uri) {
        this.uri = uri;
        this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.telemetryCollection = null;
    }

    async connect() {
        await this.client.connect();
        this.telemetryCollection = this.client.db('drone_management').collection('telemetry');
    }

    startWebSocketServer(server) {
        const wss = new WebSocket.Server({ server });

        wss.on('connection', ws => {
            console.log('Client connected');

            ws.on('message', message => {
                try {
                    const data = JSON.parse(message);
                    if (data.type === 'telemetry') {
                        this.saveTelemetry(data.payload);
                        ws.send(JSON.stringify({ status: 'success', message: 'Telemetry received' }));
                    }
                } catch (error) {
                    console.error('Error parsing message:', error);
                    ws.send(JSON.stringify({ status: 'error', message: 'Invalid message format' }));
                }
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }

    async saveTelemetry(telemetry) {
        try {
            await this.telemetryCollection.insertOne(telemetry);
            console.log('Telemetry saved successfully');
        } catch (error) {
            console.error('Error saving telemetry:', error);
        }
    }
}

module.exports = TelemetryService;

This code defines a `TelemetryService` class that handles real-time telemetry data from drones. It uses a WebSocket server to receive telemetry data from clients and saves it to a MongoDB collection. The `connect` method establishes a connection to the MongoDB database, and the `startWebSocketServer` method starts the WebSocket server to listen for incoming connections. The `saveTelemetry` method inserts the received telemetry data into the MongoDB collection.