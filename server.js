const express = require('express');
const passport = require('passport');
const app = express();

app.get('/login', passport.authenticate('discord')); // Route for Discord login
