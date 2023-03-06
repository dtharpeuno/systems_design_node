const database = require('./database');
const express = require('express');
const redis = require('redis').createClient();
const expressWs = require('express-ws');

const app = express();
expressWs(app);

const messages = [{
  id: 0,
  text: 'welcome',
  username: 'Chat Room'
}]
// const sockets = [];
// const cache = {}
const sockets = {};

app.use(express.json());

// Base calls
app.get('/hello', (req, res) => {
  console.log('Header', req.headers);
  console.log('Method', req.method);
  res.send('Recieved GET Requests')
});

app.post('/hello', (req, res) => {
  console.log('Header', req.headers);
  console.log('Method', req.method);
  console.log('Body', req.body.da);
  res.send('Recieved POST request');
});

// Cache calls
app.get('/nocache/index.html', (req, res) => {
  database.get('index.html', page => {
    res.send(page)
  });
});


app.get('/withcache/index.html', (req, res) => {
  redis.get('index.html', (err, redisRes) => {
      // console.log(redisResponse);
      if (redisRes) {
        res.send(redisRes);
        return;
      }
    // if ('index.html' in cache) {
    //   console.log('has page')
    //   res.send(cache['index.html']);
    //   return;
    // }
  });

  database.get('index.html', page => {
    // console.log(page);
    // cache['index.html'] = page;
    redis.set('index.html', page, 'EX', 10);
    res.send(page);
  });
});

// websockets
app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  const message = req.body;
  messages.push(message);

  for (const socket of sockets) {
    socket.send(JSON.stringify(message));
  }
});

app.ws('/messages', socket => {
  sockets.push(socket);

  socket.on('close', () => {
    sockets.splice(sockets.indexOf(socket), 1);
  });
});

// pubslish/subscribe
app.post('/:topicId', (req, res) => {
  const {topicId} = req.params;
  const message = req.body;
  const topicSockets = sockets[topicId] || [];
  for (const socket of topicSockets) {
    socket.send(JSON.stringify(message));
  }
});

app.ws('/:topicId', (socket, req) => {
  const {topicId} = req.params;
  if (!sockets[topicId]) sockets[topicId] = [];

  const topicSockets = sockets[topicId];
  topicSockets.push(socket);

  socket.on('close', () => {
    topicSockets.splice(topicSockets.indexOf(socket), 1);
  });
});

app.listen(3001, () => console.log('Listening on port 3001'));
