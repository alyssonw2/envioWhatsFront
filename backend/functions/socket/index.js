import io from 'socket.io-client'
export const sock = io("http://192.168.2.103:7777", {
    reconnectionDelayMax: 10000
});

