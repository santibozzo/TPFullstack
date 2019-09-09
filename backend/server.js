const PORT = 3001;
const BASE_PATH = '/api';

const usersRouter = require('./src/routers/usersRouter');
const express = require('express');
const app = express();

app.use(`${BASE_PATH}/users`, usersRouter);

app.listen(PORT, () => console.log(`Server started\nListening on port ${PORT}`));