import express, { NextFunction, Request, Response } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "../types";
import { CourseCreateModel } from "../models/CourseCreateModel";
import { GetCursesQeryModel } from "../models/GetCoursesQueryModels";
import { UriParamsIdModel } from "../models/UriParamsidModel";
import { CourseAPIModel } from "../models/CourseAPIModel";
import { DBType, Coursetypes } from "../db/db";
import { HTTP_STATUSES } from "../utilite";
import { repositories } from "../repositories/courses-repositories";

import { titleValidation, titleValidationResult } from "../validators/validators";

export const getCourseAPIModel = (dbCourse: Coursetypes): CourseAPIModel => {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
  };
};

export const getCoursesRouter = (db: DBType) => {
  const router = express.Router();
  router.get("/", (req: Request, res: Response) => {
    res.json(db.courses.map(getCourseAPIModel));
  });

  router.get(
    "/",
    (
      req: RequestWithQuery<GetCursesQeryModel>,
      res: Response<CourseAPIModel[]>
    ) => {
      let foundCourses = repositories.courseFinderIndexOf(req.query.title);
      res.json(foundCourses.map(getCourseAPIModel));
    }
  );

  router.get(
    "/:id",
    (req: RequestWithParams<UriParamsIdModel>, res: Response) => {
      let foundCourse = repositories.courseFinder(req.params.id);
      if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.not_found_404);
      } else {
        res.json(getCourseAPIModel(foundCourse));
      }
    }
  );

  router.post(
    "/",
    titleValidation,titleValidationResult, (req: RequestWithBody<CourseCreateModel>, res: Response,next:NextFunction) => {
      // if (!req.body.title) {
      //   res.sendStatus(HTTP_STATUSES.bad_request_400);
      //   return;
      // }
       
      let newCourse = repositories.coursePusher(req.body.title);
       
      res.status(HTTP_STATUSES.created_201).json(getCourseAPIModel(newCourse));
    }
  );

  router.delete("/:id", (req: RequestWithParams<UriParamsIdModel>, res) => {
    let deletedCourse = repositories.courseDeleter(req.params.id);
    if (deletedCourse) {
      res.sendStatus(HTTP_STATUSES.no_content_204);
    } else {
      res.sendStatus(HTTP_STATUSES.not_found_404);
    }
  });

  router.put(
    "/:id",
    (
      req: RequestWithParamsAndBody<UriParamsIdModel, CourseCreateModel>,
      res: Response<CourseAPIModel>
    ) => {
      let foundCourse = repositories.courseFinder(req.params.id);
      if (foundCourse) {
        if (!req.body.title) {
          return res.status(HTTP_STATUSES.bad_request_400);
        }
      
        foundCourse.title = req.body.title;
        res.status(HTTP_STATUSES.ok_200).json(foundCourse);
      } else {
        res.sendStatus(HTTP_STATUSES.not_found_404);
      }
    }
  );

  return router;
};
