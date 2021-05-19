var mongoose = require('mongoose');
const Schema = mongoose.Schema;
var messageSchema = new mongoose.Schema({
    body: String,
    senderId: String,
    username: String,
    timeSent: String
});

module.exports = mongoose.model('message', messageSchema);
