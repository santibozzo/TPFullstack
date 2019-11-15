import React from 'react';
import './Layout.css';
import { Route } from 'react-router-dom';
import Login from '../login/Login';

const Layout = props => {
	return (
		<div>
			<Route exact path='/' component={Login}/>
		</div>
	);
};

export default Layout;
