const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const path = require('path');
const cors = require('cors');
const xss = require('xss-clean');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');

const rateLimit = require('express-rate-limit');

const mountRoutes = require('./routes');

const globalErrorHandler = require('./controller/errorController');
const databaseConnection = require('./config/database');

const app = express();
app.use(cors());
app.options('*', cors());
app.use(compression());
app.use(hpp({ wishlist: ['price', 'sold', 'quantity', 'ratingsQuantity'] }));
process.on('uncaughtException', (err) => {
  console.log('unhandler exception shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});
const limiter = rateLimit({
  windowMs: 24 * 60 * 3, // next request to endpoint
  max: 100, // maximal request for all endpoint
  message: 'To many request, send back request after 3 minutes',
});
app.use(xss())
app.use('/', limiter);
app.use(express.json({ limit: '20kb' }));
dotenv.config({ path: './config.env' });
app.use(mongoSanitize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'uploads')));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
mountRoutes(app);

databaseConnection();
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log('listening');
});

app.use((request, response, next) => {
  response.status(404).json({
    message: 'Page Not Found',
  });
});

app.use(globalErrorHandler);

// error outside express
process.on('unhandledRejection', (error) => {
  console.log(`UnhandledRejection ${error}`);
  server.close(() => {
    console.error('Shut down...');
    process.exit(1);
  });
});
