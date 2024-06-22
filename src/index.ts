import express, { Request, Response } from "express";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "./types";
import { CourseCreateModel } from "./models/CourseCreateModel";
import { CourseUpdateModel } from "./models/CourseUpdateModel";
import { GetCursesQeryModel } from "./models/GetCoursesQueryModels";
import { CourseAPIModel } from "./models/CourseAPIModel";
import { UriParamsIdModel } from "./models/UriParamsidModel";

export const app = express();
const port = process.env.PORT || 3000;
export const HTTP_STATUSES = {
  ok_200: 200,
  created_201: 201,
  no_content_204: 204,
  bad_request_400: 400,
  not_found_404: 404,
};
type Coursetypes = {
  id: number;
  title: string;
  studentsCount:number
};

const db: { courses: Coursetypes[] } = {
  courses: [
    { id: 1, title: "front-end", studentsCount:10 },
    { id: 2, title: "back-end", studentsCount:10 },
    { id: 3, title: "automation qa", studentsCount:10 },
    { id: 4, title: "devops", studentsCount:10 },
  ],
};

app.use(express.json());
const getCourseAPIModel=(dbCourse:Coursetypes):CourseAPIModel=>{
  return{
    id:dbCourse.id,
    title:dbCourse.title
  }
}

app.get("/", (req: Request, res: Response) => {
  res.json(db.courses.map(getCourseAPIModel));
});

app.get("/courses", (req: RequestWithQuery<GetCursesQeryModel>, res: Response<CourseAPIModel[]>) => {
  let foundCourses = db.courses;
  if (req.query.title) {
    let searchIndexOf = req.query.title.toString();
    foundCourses = foundCourses.filter((p) => p.title.indexOf(searchIndexOf) > -1);
  }
  res.json(foundCourses.map(getCourseAPIModel));
});

app.get("/courses/:id", (req: RequestWithParams<UriParamsIdModel>, res: Response) => {
  let foundCourse = db.courses.find((p) => p.id === +req.params.id);
  if (!foundCourse) {
    res.sendStatus(HTTP_STATUSES.not_found_404);
  } else {
    res.json(getCourseAPIModel(foundCourse)
    );
  }
});

app.post("/courses", (req:RequestWithBody<CourseCreateModel>, res:Response<CourseAPIModel>) => {
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

app.delete("/courses/:id", (req: RequestWithParams<UriParamsIdModel>, res) => {
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

app.put("/courses/:id", (req: RequestWithParamsAndBody<UriParamsIdModel,CourseCreateModel>, res: Response<CourseAPIModel>) => {
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

app.delete("/__test__/data", (req, res) => {
  console.log("Received request on /test");
  db.courses = [];
  res.sendStatus(HTTP_STATUSES.no_content_204);
});

 export const server=app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
