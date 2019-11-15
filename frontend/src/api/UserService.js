
const localConfig = require('../resources/localConfig.json');
const {host, port} = localConfig.backend;
const axios = require('axios');
const server = axios.create({
	baseURL: `http://${host}:${port}/api`,
	timeout: 10000
});

exports.login = (dni, password) => {
	return new Promise((resolve, reject) => login(dni, password, resolve, reject));
}

function login(dni, password, resolve, reject) {
	server.post('/login', {dni, password})
		.then(response => resolve && resolve(response.data))
		.catch(error => reject && reject(error.response));
}