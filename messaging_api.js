const axios = require('axios');
const webSocket = require('ws');

function createMessagingSocket() {
    return new webSocket('ws://localhostL3001/messages');
}

function getMessages() {
    return axios.get('http://localhost:3001/messages').then(res => res.data);
}

function sendMessage() {
    return axios.post('http://localhost:3001/messages', message);
}

module.exports.createMessagingSocket = createMessagingSocket;
module.exports.getMessages = getMessages;
module.exports.sendMessage = sendMessage;