import mongoose from 'mongoose';
import bluebird from 'bluebird';
import dotenv from 'dotenv';

// Init environment variables
dotenv.config();

/**
 * Connect to DB
 */
let connectDB = () => {
  mongoose.Promise = bluebird;

  let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

  return mongoose.connect(URI, { useMongoClient: true });
};

module.exports = connectDB;
