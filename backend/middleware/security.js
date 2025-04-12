const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
});

module.exports = (app) => {
  app.use(helmet());
  app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
  app.use(xss());
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(cookieParser());
  app.use(globalLimiter);
};
