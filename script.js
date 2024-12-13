async function loginWithDiscord() {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=1285640377247862877&redirect_uri=https://neona-bot.vercel.app&response_type=code&scope=identify`;
    window.location.href = authUrl;
}

function displayProfile(username, avatar) {
    const profilePic = document.getElementById('profilePic');
    const usernameElement = document.getElementById('username');
    const profileInfo = document.getElementById('profileInfo');
    const loginSection = document.getElementById('loginSection');

    profilePic.src = `https://cdn.discordapp.com/avatars/${avatar}.png`;
    usernameElement.textContent = username;
    profileInfo.style.display = 'block';
    loginSection.style.display = 'none';
}

function logout() {
    localStorage.removeItem('discordId');
    location.reload();
}
.then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const { discordId, username, avatar } = data.user;
                    localStorage.setItem('discordId', discordId);
                    displayProfile(username, avatar);
                }
            })
            .catch((err) => console.error('Login failed:', err));
    } else {
        const discordId = localStorage.getItem('discordId');
        if (discordId) {
            fetch(`https://neona-bot.vercel.app/profile/${discordId}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        const { username, avatar } = data.user;
                        displayProfile(username, avatar);
                    }
                });
        }
    }
};
window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
        fetch('https://neona-bot.vercel.app/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        })
