require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcryptjs'); // Security Tool
const jwt = require('jsonwebtoken'); // Token Tool

// Models
const Entry = require('./models/Entry');
const Mission = require('./models/Mission');
const Gallery = require('./models/Gallery');
const User = require('./models/User');
const Interaction = require('./models/Interaction');

const app = express();
const port = 5002;
const JWT_SECRET = 'my_super_secret_key_change_this_later'; // Secret key for tokens

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log(err));

// --- CLOUDINARY CONFIGURATION ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- MULTER STORAGE SETUP ---
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'space_gallery', // The folder name in your Cloudinary Dashboard
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif']
    }
});
const upload = multer({ storage: storage });

// AUTHENTICATION ROUTES ---

// 1. REGISTER (Sign Up)
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        // Encrypt Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User registered successfully!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. LOGIN (Sign In)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // Create Token (The digital ID card)
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, username: user.username, message: "Login successful!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GOOGLE LOGIN
app.post('/api/google-login', async (req, res) => {
    try {
        const { token } = req.body;
        
        const decoded = jwt.decode(token);
        
        const { email, name, sub } = decoded; // 'sub' is Google's unique ID for the user

        // 1. Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // 2. If not, create them!
            // A dummy password since they use Google to login
            user = new User({ 
                username: name, 
                email: email, 
                password: "google-login-user-" + sub 
            });
            await user.save();
        }

        // 3. Generate Our Website's Token
        const myToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token: myToken, username: user.username, message: "Google Login successful!" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DIARY ROUTES ---

// 1. GET: Read all entries
app.get('/api/entries', async (req, res) => {
    try {
        const entries = await Entry.find();
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST: Create a new entry
app.post('/api/entries', async (req, res) => {
    try {
        const newEntry = new Entry({
            title: req.body.title,
            content: req.body.content,
            tag: req.body.tag,
            date: req.body.date 
        });
        const savedEntry = await newEntry.save();
        res.json(savedEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE: Delete an entry
app.delete('/api/entries/:id', async (req, res) => {
    try {
        await Entry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. PUT: Update an entry
app.put('/api/entries/:id', async (req, res) => {
    try {
        const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// MISSION ROUTES ---

app.get('/api/missions', async (req, res) => {
    try {
        const missions = await Mission.find();
        res.json(missions);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/missions', async (req, res) => {
    try {
        const newMission = new Mission(req.body);
        const savedMission = await newMission.save();
        res.json(savedMission);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/missions/:id', async (req, res) => {
    try {
        const updatedMission = await Mission.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMission);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/missions/:id', async (req, res) => {
    try {
        await Mission.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GALLERY ROUTES ---

// GET ALL IMAGES
app.get('/api/gallery', async (req, res) => {
    try {
        // Sort by newest first (-1)
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPLOAD NEW IMAGE
// 'image' here must match the name used in FormData on the frontend
app.post('/api/gallery', upload.single('image'), async (req, res) => {
    try {
        // req.file contains the info from Cloudinary (like the URL)
        const newImage = new Gallery({
            title: req.body.title,
            desc: req.body.desc,
            category: req.body.category,
            imageUrl: req.file.path // The URL Cloudinary gave us
        });
        const savedImage = await newImage.save();
        res.json(savedImage);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE IMAGE
app.delete('/api/gallery/:id', async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE IMAGE TEXT
app.put('/api/gallery/:id', async (req, res) => {
    try {
        const updated = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET interactions for a specific article
app.get('/api/news/:id', async (req, res) => {
    try {
        let doc = await Interaction.findOne({ articleId: req.params.id });
        if (!doc) {
            // If no interactions exist yet, return empty data
            return res.json({ articleId: req.params.id, likes: [], comments: [] });
        }
        res.json(doc);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST a Like (Toggle)
app.post('/api/news/:id/like', async (req, res) => {
    const { username } = req.body;
    try {
        let doc = await Interaction.findOne({ articleId: req.params.id });
        if (!doc) doc = new Interaction({ articleId: req.params.id, likes: [], comments: [] });

        // Toggle Logic
        if (doc.likes.includes(username)) {
            doc.likes = doc.likes.filter(u => u !== username); // Unlike
        } else {
            doc.likes.push(username); // Like
        }
        await doc.save();
        res.json(doc);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST a Comment
app.post('/api/news/:id/comment', async (req, res) => {
    const { user, text, date } = req.body;
    try {
        let doc = await Interaction.findOne({ articleId: req.params.id });
        if (!doc) doc = new Interaction({ articleId: req.params.id, likes: [], comments: [] });

        doc.comments.push({ user, text, date });
        await doc.save();
        res.json(doc);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(port, () => {
    console.log(`📡 Server running on http://localhost:${port}`);
});