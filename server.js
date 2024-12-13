app.get('/login', passport.authenticate('discord')); // Redirects to Discord login

app.get('/callback', passport.authenticate('discord', {
    failureRedirect: '/', // Redirect to home if login fails
}), (req, res) => {
    // Redirect to profile after successful login
    res.redirect('/profile');
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});
