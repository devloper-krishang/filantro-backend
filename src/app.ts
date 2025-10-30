import express from 'express';
import apiRouter from './routes';

const app = express();

// Middleware
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

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

export default app;
