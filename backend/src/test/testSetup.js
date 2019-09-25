
const config = require('../resources/config');
const dataBase = config.dataBase;
const mongoose = require('mongoose');
const dataBaseInitializer = require('../dataAccess/dataBaseInitializer');


// before(done => {
// 	const connectionOptions = {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 		useCreateIndex: true
// 	};
// 	mongoose.Promise = global.Promise;
// 	mongoose.connect(`mongodb://${dataBase.host}:${dataBase.port}/${dataBase.name}Test`, connectionOptions)
// 		.then(() => {
// 			console.log('Connected to test DB');
// 			dataBaseInitializer.initializeDataBase()
// 				.then(result => done())
// 				.catch(error => done(error));
// 		})
// 		.catch(error => done(error));
// });

const connectionOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
};
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${dataBase.host}:${dataBase.port}/${dataBase.name}Test`, connectionOptions)
	.then(() => {
		console.log('Connected to test DB');
		dataBaseInitializer.initializeDataBase()
			.then(() => run())
			.catch(error => console.error(error));
	})
	.catch(error => console.error(error));