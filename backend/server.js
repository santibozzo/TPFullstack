const PORT = 3001;
const BASE_PATH = '/api';

const usersRouter = require('./src/routers/usersRouter');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dataBaseInitializer = require('./src/dataAccess/dataBaseInitializer');

app.use(`${BASE_PATH}/users`, usersRouter);

app.listen(PORT, () => console.log(`Server started... listening on port ${PORT}`));


const connectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
};
mongoose.connect('mongodb://localhost:27017/tpFullstack', connectionOptions)
	.then(() => {
		console.log('Connected to DB');
		dataBaseInitializer.initializeDataBase();
	})
	.catch(error => console.error(error));
