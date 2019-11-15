import React from 'react';
import './Login.css';

const Login = props => {
	return (
		<div className="login-form-div">
			<label className="login-form-label">DNI</label>
			<input className="login-form-input" type="text" placeholder="50000000"/>
			<label className="login-form-label">password</label>
			<input className="login-form-input" type="password" placeholder="******"/>
			<button className="login-form-button" type="button">login</button>
		</div>
	);
};

export default Login;
