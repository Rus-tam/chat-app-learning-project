const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

io.on('connection', (socket) => {
	console.log('New websocket connection');

	socket.emit('message', generateMessage('Welcome'));
	socket.broadcast.emit('message', generateMessage('A new user has joined!'));

	socket.on('sendMessage', (message, callback) => {
		const filter = new Filter();

		if (filter.isProfane(message)) {
			return callback('Profanity is not allowed');
		}

		io.emit('message', generateMessage(message));
		callback();
	});

	socket.on('disconnect', () => {
		io.emit('message', generateMessage('A user has left'));
	});

	socket.on('sendLocation', (location, callback) => {
		io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`));
		callback();
	});
});

server.listen(port, () => {
	console.log(`Server is currently running on port ${port}`);
});
