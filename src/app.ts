import express from 'express';
import apiRouter from './routes';
import { errorHandler } from './middleware';
import 'module-alias/register';
import cors from 'cors';

const app = express();

const allowedOrigins = [
  'http://localhost:3000', // local dev
  'https://filantro-frontend.vercel.app', // production frontend
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin (like mobile apps or curl)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  // credentials: true, // Allow cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());

// health route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1', apiRouter);

app.use(errorHandler);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

export default app;
