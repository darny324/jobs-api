require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDoc = yaml.load('./swagger.yaml');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const authMiddleWare = require('./middleware/authentication');

app.set('trust proxy', 1);
app.use(rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
// extra packages

// routes
app.get('/', (req, res) => {
  res.send(`
  <h1>Jobs Api</h1>
  <a href="/api-doc">Documentation</a>  
  `);
});

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleWare, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
