import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';
import 'module-alias/register';
import { env } from 'process';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

const setup = async () => {
  await connectDB();


  if (process.env.NODE_ENV === 'development') {
    const port = env?.port || Number(process.env.PORT) || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  }
};

setup();

// Export the Express app for Vercel serverless
export default app;
