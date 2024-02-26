import mongoose from 'mongoose';
import { ConfigService } from './env.config';

mongoose.connect(ConfigService.mongoUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.on('open', () => console.log('mongoose connection connected'));