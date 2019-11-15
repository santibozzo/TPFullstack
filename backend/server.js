const BASE_PATH = '/api';

const config = require('./src/resources/config');
const server = config.server;
const dataBase = config.dataBase;
const loginRouter = require('./src/routers/loginRouter');
const usersRouter = require('./src/routers/usersRouter');
const requestLimitsRouter = require('./src/routers/requestLimitsRouter');
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dataBaseInitializer = require('./src/dataAccess/dataBaseInitializer');

app.use(express.json());
app.use(cors());
app.use(`${BASE_PATH}/login`, loginRouter);
app.use(`${BASE_PATH}/users`, usersRouter);
app.use(`${BASE_PATH}/request-limits`, requestLimitsRouter);

app.listen(server.port, () => console.log(`Server started... listening on port ${server.port}`));


const connectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
};
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${dataBase.host}:${dataBase.port}/${dataBase.name}`, connectionOptions)
	.then(() => {
		console.log('Connected to DB');
		dataBaseInitializer.initializeDataBase();
	})
	.catch(error => console.error(error));
