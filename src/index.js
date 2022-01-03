const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

io.on('connection', (socket) => {
	console.log('New websocket connection');

	socket.emit('message', 'Welcome!');

	socket.on('sendMessage', (message) => {
		io.emit('message', message);
	});
});

server.listen(port, () => {
	console.log(`Server is currently running on port ${port}`);
});
