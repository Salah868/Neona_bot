window.onload = () => {
    const menuBtn = document.getElementById('menuBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const profileOption = document.getElementById('profileOption');
    const logoutOption = document.getElementById('logoutOption');
    const menuIcon = document.getElementById('menuIcon');

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    // Toggle dropdown menu
    menuBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('active');
    });

    if (code) {
        fetch('http://neona-bot.vercel.app/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    const { discordId, username, avatar } = data.user;
                    localStorage.setItem('discordId', discordId);
                    updateMenu(username, avatar);
                }
            })
            .catch((err) => console.error('Login failed:', err));
    } else {
        const discordId = localStorage.getItem('discordId');
        if (discordId) {
            fetch(`http://localhost:3000/profile/${discordId}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        const { username, avatar } = data.user;
                        updateMenu(username, avatar);
                    }
                });
        }
    }

    function updateMenu(username, avatar) {
        profileOption.style.display = 'block';
        logoutOption.style.display = 'block';
        document.getElementById('loginOption').style.display = 'none';
        menuIcon.src = `https://cdn.discordapp.com/avatars/${avatar}`;
    }
};

function loginWithDiscord() {
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=1285640377247862877&redirect_uri=https://neona-bot.vercel.app&response_type=code&scope=identify`;
    window.location.href = authUrl;
}

function logout() {
    localStorage.removeItem('discordId');
    window.location.reload();
}
