const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

// MongoDB Setup
const dbClient = new MongoClient(process.env.MONGO_URI);
let usersCollection;

dbClient.connect().then(() => {
    const db = dbClient.db('discord-bot');
    usersCollection = db.collection('users');
});

// Passport Setup
passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ['identify'],
}, async (accessToken, refreshToken, profile, done) => {
    const user = {
        id: profile.id,
        username: profile.username,
        avatar: profile.avatar,
    };

    await usersCollection.updateOne({ id: profile.id }, { $set: user }, { upsert: true });
    return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middleware
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

// Routes
app.get('/login', passport.authenticate('discord'));
app.get('/callback', passport.authenticate('discord', {
    failureRedirect: '/',
}), (req, res) => res.redirect('/profile'));

app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login');
    res.sendFile(__dirname + '/public/profile.html');
});

app.get('/api/profile', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    res.json(req.user);
});

// Home Page
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// Start Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
