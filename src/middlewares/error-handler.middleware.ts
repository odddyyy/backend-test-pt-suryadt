import { NextFunction, Request, Response } from "express";

export const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error({
    url: req.url,
    timestamp: new Date(),
    error: err,
  });
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      url: req.url,
      time: new Date(),
      message: err.message,
    });
  }
  return res.status(500).json(err);
}