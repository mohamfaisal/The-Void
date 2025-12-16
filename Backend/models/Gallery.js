const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String },
    category: { type: String, default: 'Other' },
    imageUrl: { type: String, required: true }, // store the Cloudinary Link
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);