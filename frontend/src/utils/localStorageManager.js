

exports.setToken = token => {
	window.localStorage.setItem('token', token);
};

exports.getToken = () => {
	return window.localStorage.getItem('token');
};
