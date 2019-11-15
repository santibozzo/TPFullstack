import React, {useState} from 'react';
import './Login.css';
import UserService from '../../api/UserService';
import localStorageManager from '../../utils/localStorageManager';

const Login = props => {
	const [dni, setDni] = useState('');
	const [password, setPassword] = useState('');
	const [hasErrors, setHasErrors] = useState(false);


	function login() {
		setHasErrors(false);
		if(isNaN(dni)) {
			setHasErrors(true);
		}else {
			UserService.login(parseInt(dni, 10), password)
				.then(response => {
					localStorageManager.setToken(response.token);
					props.history.push('/home');
				})
				.catch(error => {
					console.log(error);
					setHasErrors(true);
				});
		}
	}

	function getInputClass() {
		return 'login-form-input' + (hasErrors ? ' input-error' : '');
	}

	return (
		<div className="login-form-div">
			<label className="login-form-label">DNI</label>
			<input className={getInputClass()} type="text" placeholder="50000000" onChange={event => setDni(event.target.value)}/>
			<label className="login-form-label">password</label>
			<input className={getInputClass()} type="password" placeholder="******" onChange={event => setPassword(event.target.value)}/>
			<button className="login-form-button" type="button" onClick={login}>login</button>
		</div>
	);
};

export default Login;
