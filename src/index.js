const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const droneRoutes = require('./routes/droneRoutes');
const missionRoutes = require('./routes/missionRoutes');
const geofenceRoutes = require('./routes/geofenceRoutes');
const collisionAvoidanceRoutes = require('./routes/collisionAvoidanceRoutes');
const predictiveMaintenanceRoutes = require('./routes/predictiveMaintenanceRoutes');
const mapRoutes = require('./routes/mapRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/drones', droneRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/geofences', geofenceRoutes);
app.use('/api/collision-avoidance', collisionAvoidanceRoutes);
app.use('/api/maintenance', predictiveMaintenanceRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

This code sets up a basic Express server with necessary middleware and routes for managing autonomous drones. It connects to a MongoDB database using Mongoose and includes error handling middleware. Each route corresponds to a specific feature of the platform (e.g., drone management, mission planning, etc.).