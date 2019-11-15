import React from 'react';
import './Layout.css';
import { Route } from 'react-router-dom';
import Login from '../login/Login';
import Home from '../home/Home';

const Layout = props => {
	return (
		<div>
			<Route exact path='/' component={Login}/>
			<Route exact path='/home' component={Home}/>
		</div>
	);
};

export default Layout;
