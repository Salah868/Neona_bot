javascript
document.getElementById('menu-button').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menu.classList.toggle('hidden');
});

const displayProfile = (username, avatar) => {
    document.getElementById('username').textContent = username;
    document.getElementById('avatar').src = avatar;
};

document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('discordId');
    document.getElementById('username').textContent = 'Username';
    document.getElementById('avatar').src = '';
    alert('Logged out successfully!');
});

// Assuming `getProfileData` is a function that fetches profile data
const getProfileData = async () => {
    const discordId = localStorage.getItem('discordId');
    if (discordId) {
        try {
            const response = await fetch(`https://neona-bot.vercel.app/profile/${discordId}`);
            const data = await response.json();
            if (data.success) {
                const { username, avatar } = data.user;
                displayProfile(username, avatar);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        }
    }
};

getProfileData();
