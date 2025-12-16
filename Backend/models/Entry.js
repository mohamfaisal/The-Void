const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tag: { type: String, required: true },
    date: { type: String, default: Date.now } // Stores creation date
});

module.exports = mongoose.model('Entry', entrySchema);