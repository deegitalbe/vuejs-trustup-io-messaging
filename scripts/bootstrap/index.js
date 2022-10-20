import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const laravelEcho = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    wssHost: process.env.MIX_PUSHER_HOST,
    wssPort: process.env.MIX_PUSHER_PORT,
    forceTLS: process.env.MIX_PUSHER_SCHEME === "https",
    encrypted: true,
    disableStats: true,
    enabledTransports: ['wss'],
});

window.Echo = laravelEcho;