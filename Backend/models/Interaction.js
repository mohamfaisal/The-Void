const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    articleId: { type: String, required: true }, // The ID of the news article (e.g., "101")
    likes: [{ type: String }], // Array of Usernames who liked it
    comments: [{
        user: String,
        text: String,
        date: String
    }]
});

module.exports = mongoose.model('Interaction', interactionSchema);