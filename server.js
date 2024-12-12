// server.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Replace with your custom MongoDB connection string (token)
const mongoURI = 'mongodb+srv://salahAmber1:salahAmber1@cluster0.qq5ttgn.mongodb.net/';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

const UserSchema = new mongoose.Schema({
    discordId: String,
    username: String,
    avatar: String,
});
const User = mongoose.model('User', UserSchema);

// Discord API Constants
const CLIENT_ID = '1285640377247862877';
const CLIENT_SECRET = 'GYGQ1xqNt0lJpN8K6NgVfxdDeaQ9dXet';
const REDIRECT_URI = 'https://neona-bot.vercel.app';

// Routes
app.post('/login', async (req, res) => {
    const { code } = req.body;

    try {
        // Exchange code for an access token
        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token } = tokenResponse.data;

        // Fetch user information
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { id: discordId, username, avatar } = userResponse.data;

        // Save user to database or update if exists
        let user = await User.findOne({ discordId });
        if (!user) {
            user = new User({ discordId, username, avatar });
            await user.save();
        }

        res.json({ success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

app.get('/profile/:discordId', async (req, res) => {
    try {
        const user = await User.findOne({ discordId: req.params.discordId });
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching profile' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on https://neona-bot.vercel.app:${PORT}`);
});
