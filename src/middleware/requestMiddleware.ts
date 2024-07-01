import Joi from 'joi';
import {
    RequestHandler, Request, Response, NextFunction
  } from "express"

const getMessageFromJoiError = (error : Joi.ValidationError) => {
  if (!error.details && error.message) {
    return error.message;
  }
  return error.details && error.details.length > 0 && error.details[0].message
    ? `PATH: [${error.details[0].path}] ;; MESSAGE: ${error.details[0].message}` : undefined;
};

export const requestMiddleware = async (req : Request, res: Response, next : NextFunction, 
    handler : RequestHandler, validation : Joi.ObjectSchema) =>{
  if (validation) {
    const { error } = validation.validate(req.body);
    if (error != null) {
      return next(getMessageFromJoiError(error));
    }
  }

  try {
    await handler(req, res, next)
  } catch (err) {
    next(err);
  };
};

export default requestMiddleware;