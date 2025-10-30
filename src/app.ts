import express from 'express';
import apiRouter from './routes';

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.send('Simple backend is running!');
});

app.use('/api/v1', apiRouter);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

export default app;
