const express = require('express');
const fileRoutes = require('./routes/files');
const AppError = require('./utils/app-error');
const { loadEnv } = require("./middlewares");

const app = express();

const connectDB = require('./config/db')
connectDB()

// MIDDLEWARES
app.use(loadEnv);

app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// Routes in the middleware injected
app.use('/files', fileRoutes);

app.all('*', (req, res, next) => {
    next(new AppError("No resource available", 404));
});

module.exports = app;
