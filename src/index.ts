import express from 'express';
import cors from 'cors';
import { ConfigService } from './config/env.config';
import mainRoutes from './routes';
import { errorHandler } from './middlewares/error-handler.middleware';
import './config/database.config';
import './cron/birthday.cron';

const app = express();
const port = ConfigService.port;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(mainRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});