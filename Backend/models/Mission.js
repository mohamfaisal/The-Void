const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
    pilot: { type: String, required: true },  // Commander Name
    mission: { type: String, required: true }, // Mission Name
    date: { type: String, required: true },    // Launch Date
    desc: { type: String, required: true }     // Brief
});

module.exports = mongoose.model('Mission', missionSchema);