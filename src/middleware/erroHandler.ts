import {
    Request, Response, NextFunction
  } from "express"

export interface errorType {
    message : string
    status : number
}

const errorhandler = (err : errorType, req : Request, res : Response,
     next : NextFunction) =>{
    if (res.headersSent) {
      next(err);
    }
    else{
        res.status(err.status || 500).json({
          url : "error handler",
          error: err
        })
    }
  
}

export default errorhandler