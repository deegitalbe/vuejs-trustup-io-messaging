import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const laravelEcho = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_MESSAGING_PUSHER_APP_KEY || "$2y$10$svQIJ8lZEqclI9AqcZEBZeKEqhePKWoFTFU85ML2u9w4aa2wbRHG",
    wssHost: process.env.MIX_MESSAGING_PUSHER_HOST || "websocket.trustup.io",
    wssPort: process.env.MIX_MESSAGING_PUSHER_PORT || 443,
    forceTLS: (process.env.MIX_MESSAGING_PUSHER_SCHEME || "https") === "https",
    encrypted: true,
    disableStats: true,
    enabledTransports: ['wss'],
});

window.Echo = laravelEcho;