import { body,validationResult } from "express-validator"
import { HTTP_STATUSES } from "../utilite";
import { NextFunction } from "express-serve-static-core";
export const titleValidation=body("title").isLength({ min: 3, max: 10 })
export const titleValidationResult=(req:any,res:any,next:NextFunction)=>{
    debugger
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res. status(HTTP_STATUSES.bad_request_400).send({error: result.array() });
    
    }else{next()}
}