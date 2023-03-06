const axios = require('axios');
const WebSocket = require('ws');

function createMessagingSocket() {
    return new WebSocket('ws://localhostL3001/messages');
}

function getMessages() {
    return axios.get('http://localhost:3001/messages').then(res => res.data);
}

function sendMessage() {
    return axios.post('http://localhost:3001/messages', message);
}

function publish(message, topicId) {
    return axios.post(`http://localhost:3001/${topicId}`, message);
}

function subcribe(topicId) {
    return new WebSocket(`ws://localhost:3001/${topicId}`);
}

module.exports.createMessagingSocket = createMessagingSocket;
module.exports.getMessages = getMessages;
module.exports.sendMessage = sendMessage;
module.exports.publish = publish;
module.exports.subscribe = subcribe;