require('dotenv').config();
const mongoose = require('mongoose');

function connectDB() {
  const connectionString =
    process.env.DB_CONN || `mongodb://localhost:27017/meldcxdb`;
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const connection = mongoose.connection;
  connection
    .once('open', () => {
      console.log(`Database connected`);
    })
    .on('error', (err) => {
      console.log('Database connection failed', err);
      process.exit(1);
    });
}

module.exports = connectDB;
