//  index.js
const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const Message = require('./model/message.js')

const app = express();


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://0.0.0.0:${process.env.MONGODB_URI}/theravetheorychat` || `mongodb://0.0.0.0:27017/theravetheorychat`);



if (process.env.MONGODB_URI) {
  console.log(`Mongodb connection on port ${process.env.MONGODB_URI} from .env file at root of backend directory`)
}


if (process.env.ENV) {
  app.use(express.static(path.join(__dirname, 'build')))
}
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;


const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});

http.listen(PORT, () => {
  console.log(`Backend app running on port ${PORT}`)
});

io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */

  console.log('new client connected');
  Message.find({}, function(err, messages) {
    socket.emit('connection', messages);
    console.log('messages should be printed')
  })


  socket.on('disconnect', () => {
    socket.removeAllListeners();
    console.log('a user disconnected');
  });

  socket.on('newUser', function(msg) {
    console.log(msg);
    socket.emit('newUser', msg);
    socket.broadcast.emit('newUser', msg);
  })

  socket.on('newChatMessage', function(msg) {
    console.log(msg);
    Message.create(msg);
    socket.emit('newChatMessage', msg);
    socket.broadcast.emit('newChatMessage', msg);
  })
});
