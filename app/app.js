const express = require('express');
const helmet = require("helmet");
const xss = require('xss-clean');

const { fileRoutes } = require('./routes');
const AppError = require('./utils/app-error');
const { loadEnv, errorHandler } = require("./middlewares");

const app = express();

const connectDB = require('./config/db')
connectDB()

app.use(helmet());

// MIDDLEWARES
app.use(loadEnv);

app.use(express.json());

// Data sanitization against XSS
app.use(xss());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Routes in the middleware injected
app.use('/api', fileRoutes);

app.all('/api/*', (req, res, next) => {
    next(new AppError("No resource available", 404));
});
app.use(errorHandler);

module.exports = app;
