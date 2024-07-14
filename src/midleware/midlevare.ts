import  { Request, Response, NextFunction } from "express";
import { HTTP_STATUSES } from "../utilite";
 export let requestCount=0
export const blablaMiddleware = (req:Request,res:Response,next:NextFunction) => {// @ts-ignore
    req.blabla = "hello";
    next();
  };
 export const guardMiddleware = (req:Request,res:Response,next:NextFunction) => {   req.query.token==="123"?next():res.sendStatus(HTTP_STATUSES.unautoruzed_401)};
  export const requestCounter=(req:Request,res:Response,next:NextFunction)=>{
  requestCount++
  next()
  }