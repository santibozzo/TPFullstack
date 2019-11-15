import React, {useState} from 'react';
import './Home.css';

import localStorageManager from '../../utils/localStorageManager';
import UserService from '../../api/UserService';

const Home = props => {
	const [userDni, setUserDni] = useState('');
	const [result, setResult] = useState({});

	function searchUser() {
		UserService.get(userDni, localStorageManager.getToken())
			.then(response => setResult(response))
			.catch(error => {
				console.error(error);
				setResult(null);
			});
	}

	function renderUserInfo() {
		if(!result) {
			return (
				<div className="home-user-div">
					<label className="home-user-error-label">USER NOT FOUND</label>
				</div>
			);
		}else if(result.dni) {
			return (
				<div className="home-user-div">
					<label className="home-user-info-label">{`DNI: ${result.dni}`}</label>
					<label className="home-user-info-label">{`EMAIL: ${result.email}`}</label>
					<label className="home-user-info-label">{`CREDIT SCORE: ${result.creditScore}`}</label>
				</div>
			);
		}
	}

	return (
		<div className="home-div">
			<div className="home-search-div">
				<input className="home-search-input" type="text" placeholder="50000000" onChange={event => setUserDni(event.target.value)}/>
				<button className="home-search-button" type="button" onClick={searchUser}>search</button>
			</div>
			{renderUserInfo()}
		</div>
	);
};

export default Home;