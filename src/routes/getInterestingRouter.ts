import express,{ Request, Response } from "express"
import {  RequestWithParams,  RequestWithQuery } from "../types"
import { GetCursesQeryModel } from "../models/GetCoursesQueryModels";
import { UriParamsIdModel } from "../models/UriParamsidModel";
import { CourseAPIModel } from "../models/CourseAPIModel";
import {  DBType,Coursetypes} from "../db/db";
import { HTTP_STATUSES } from "../utilite";



export const getCourseAPIModel = (dbCourse: Coursetypes): CourseAPIModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  };
};

export const getInterestingRouter=(db:DBType)=>{
  const router=express.Router()
  

  
  router.get("/books", (req: RequestWithQuery<GetCursesQeryModel>, res: Response) => {
        
        res.json({title:'books'});
      });
      
            router.get("/:id([0-9])", (req: RequestWithParams<UriParamsIdModel>, res: Response) => {
        res.json({title:"data by id"+ req.params.id})
      
    });
      return router
}