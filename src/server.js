import http from 'http';
import WebSocet from 'ws';
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
app.use('/public', express.static(`${__dirname}/public`));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
const wss = new WebSocet.Server({ server });

const sockets = [];

wss.on('connection', socket => {
	sockets.push(socket);
	socket.nickname = 'Anonymous';
	socket.on('close', () => {
		console.log('Disconnected from Browser');
	});

	socket.on('message', msg => {
		const message = JSON.parse(msg);

		// eslint-disable-next-line default-case
		switch (message.type) {
			case 'new_message':
				sockets.forEach(aSocket => {
					aSocket.send(`${socket.nickname} : ${message.payload}`);
				});
				break;
			case 'nickname':
				socket.nickname = message.payload;
				break;
		}
	});
});
server.listen(3000, handleListen);
