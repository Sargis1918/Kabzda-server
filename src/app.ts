import express from "express";
import { db } from "./db/db";
import { getCoursesRouter } from "./routes/courses";
import {getTestRouter } from "./routes/tests";
import { getInterestingRouter } from "./routes/getInterestingRouter";
export const app = express();
app.use(express.json());
app.use("/courses",getCoursesRouter(db))
app.use("/__test__",getTestRouter(db))
app.use("/interesting",getInterestingRouter(db))
