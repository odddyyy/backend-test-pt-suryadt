import { Router } from 'express';
import * as userController from '../../controllers/v1/user.controller';

const route = Router();

route.post('/', userController.CreateUser);
route.put('/:id', userController.EditUser);
route.delete('/:id', userController.DeleteUser);

export default route;