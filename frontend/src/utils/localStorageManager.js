

exports.setToken = token => {
	window.localStorage.setItem('token', token);
};

exports.getToken = () => {
	window.localStorage.getItem('token');
};
