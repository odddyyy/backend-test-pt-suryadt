import { Router } from 'express';

// router list import
import userRoute from './user.route';

const route = Router();

// List of endpoint v1
route.use('/user', userRoute);

export default route;