import { Router } from 'express';

// router list import
import v1 from './v1';

const route = Router();

// v1 Endpoint
route.use('/v1', v1);

export default route;