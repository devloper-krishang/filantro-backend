import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';
import 'module-alias/register';

dotenv.config();

const MONGO_URI = process.env.PORT || '';

const setup = async () => {
  await connectDB();
  console.log(MONGO_URI);
};

setup();

// Export the Express app for Vercel serverless
export default app;
