import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_MESSAGING_PUSHER_APP_KEY || "$2y$10$svQIJ8lZEqclI9AqcZEBZeKEqhePKWoFTFU85ML2u9w4aa2wbRHG",
    wsHost: process.env.MIX_MESSAGING_PUSHER_HOST || "websocket.trustup.io",
    wsPort: process.env.MIX_MESSAGING_PUSHER_PORT || 443,
    wssPort: process.env.MIX_MESSAGING_PUSHER_PORT || 443,
    disableStats: true,
});