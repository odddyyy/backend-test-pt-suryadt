import dotenv from 'dotenv';
dotenv.config();

export const ConfigService = {
  port: parseInt(process.env.PORT),
  mongoUrl: process.env.MONGO_URL,
  emailUrl: process.env.EMAIL_URL,
}