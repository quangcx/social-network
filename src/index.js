import express from 'express';
import dotenv from 'dotenv';
import ConnectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import session from './config/session';
import passport from 'passport';
import http from 'http';
import socketio from 'socket.io';
import initSockets from './sockets/index';
import passportSocketIO from 'passport.socketio';
import cookieParser from 'cookie-parser';
import events from 'events';

// Load evironment variables
dotenv.config();

// Create app
let app = express();

// Change default max number of listeners
events.EventEmitter.defaultMaxListeners = 20;

// Init server with socket.io and express
let server = http.createServer(app);
let io = socketio(server);

// Connect to DB
ConnectDB();

// Config session
session.config(app);

// Config view engine
configViewEngine(app);

// Enable get data post method with body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Enable flash messages
app.use(connectFlash());

// User Cookie Parser
app.use(cookieParser());

// Config passport
app.use(passport.initialize());
app.use(passport.session());

// Init all routes
initRoutes(app);

// Get session data into io
io.use(
  passportSocketIO.authorize({
    cookieParser: cookieParser,
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: session.sessionStore,
    success: (data, accept) => {
      if (!data.user.logged_in) {
        return accept('Invalid user.', false);
      }
      return accept(null, true);
    },
    fail: (data, message, error, accept) => {
      if (error) {
        return accept(new Error(message), false);
      }
    },
  })
);

// Init all sockets config
initSockets(io);

server.listen(process.env.APP_PORT, process.env.APP_HOST, function () {
  console.log(`Server is starting at ${process.env.APP_PORT}`);
});
