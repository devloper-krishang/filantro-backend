import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.send('Simple backend is running!');
});

export default app;
