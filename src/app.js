const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

app.get('/', (_req, res) => res.json({ name: 'Makao API', status: 'ok' }));

// 404
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// Centralized error handler
app.use(errorHandler);

module.exports = app;
