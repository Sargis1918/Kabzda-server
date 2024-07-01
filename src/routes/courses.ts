import express,{ Request, Response } from "express"
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../types"
import { CourseCreateModel } from "../models/CourseCreateModel";
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

export const getCoursesRouter=(db:DBType)=>{
  const router=express.Router()
  router.get("/", (req: Request, res: Response) => {
        res.json(db.courses.map(getCourseAPIModel));
      });
      
      router.get("/", (req: RequestWithQuery<GetCursesQeryModel>, res: Response<CourseAPIModel[]>) => {
        let foundCourses = db.courses;
        if (req.query.title) {
          let searchIndexOf = req.query.title.toString();
          foundCourses = foundCourses.filter((p) => p.title.indexOf(searchIndexOf) > -1);
        }
        res.json(foundCourses.map(getCourseAPIModel));
      });
      
      router.get("/:id", (req: RequestWithParams<UriParamsIdModel>, res: Response) => {
        let foundCourse = db.courses.find((p) => p.id === +req.params.id);
        if (!foundCourse) {
          res.sendStatus(HTTP_STATUSES.not_found_404);
        } else {
          res.json(getCourseAPIModel(foundCourse)
          );
        }
      });
      
      router.post("/", (req:RequestWithBody<CourseCreateModel>, res:Response<CourseAPIModel>) => {
        if (!req.body.title) {
          res.sendStatus(HTTP_STATUSES.bad_request_400);
          return;
        }
        let newCourse:Coursetypes = {
          id: +new Date(),
          title: req.body.title,
          studentsCount:11,
        };
      
        db.courses.push(newCourse);
        res.status(HTTP_STATUSES.created_201).json(getCourseAPIModel(newCourse));
      });
      
      router.delete("/:id", (req: RequestWithParams<UriParamsIdModel>, res) => {
        for (let i = 0; i < db.courses.length; i++) {
          let parId = +req.params.id;
          if (db.courses[i].id === parId) {
            db.courses.splice(i, 1);
            res.sendStatus(HTTP_STATUSES.no_content_204);
            return;
          }
        }
        res.sendStatus(HTTP_STATUSES.not_found_404);
      });
      
      router.put("/:id", (req: RequestWithParamsAndBody<UriParamsIdModel,CourseCreateModel>, res: Response<CourseAPIModel>) => {
        let course = db.courses.find((p) => p.id === +req.params.id);
        if (course) {
          if (!req.body.title) {
            return res.status(HTTP_STATUSES.bad_request_400);
          }
          course.title = req.body.title;
          res.status(HTTP_STATUSES.ok_200).json(course);
        } else {
          res.sendStatus(HTTP_STATUSES.not_found_404);
        }
      });
      
      return router
}