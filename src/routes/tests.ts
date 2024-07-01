import express from "express";
import { HTTP_STATUSES } from "../utilite";
import { DBType, } from "../db/db";
export const getTestRouter=(db:DBType)=>{
  const router =express.Router()  
  router.delete("/data", (req, res) => {
      
      console.log("Received request on /test");
        db.courses = [];
        res.sendStatus(HTTP_STATUSES.no_content_204);
      });
      return router
}
