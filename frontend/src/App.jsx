import React from 'react';
import { Route } from 'react-router-dom';
import Layout from './modules/layout/Layout';

function App() {
  return (
    <Route path='/' component={Layout}/>
  );
}

export default App;
