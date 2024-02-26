import { NextFunction, Request, Response } from "express";
import user from '../../models/user.model';

export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await user.create({
      ...req.body,
    });
    return res.status(201).json({
      message: 'user created',
    });
  } catch (error) {
    next(error);
  }
}

export const EditUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exist = await user.findById(req.params.id);
    if (!exist) {
      throw { statusCode: 404, message: 'user not found' };
    }
    await user.updateOne({ _id: req.params.id }, { ...req.body, updatedAt: new Date(), });
    return res.status(201).json({
      message: 'user updated',
    });
  } catch (error) {
    next(error);
  }
}

export const DeleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const exist = await user.findById(req.params.id);
    if (!exist) {
      throw { statusCode: 404, message: 'user not found' };
    }
    await user.deleteOne({ _id: req.params.id });
    return res.status(201).json({
      message: 'user deleted',
    });
  } catch (error) {
    next(error);
  }
}