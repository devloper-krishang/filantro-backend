import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';
import 'module-alias/register';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

const setup = async () => {
  await connectDB();
};

setup();

// Export the Express app for Vercel serverless
export default app;
