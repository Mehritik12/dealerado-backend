import { NextFunction, Request, Response } from "express";
import { fileUpload } from "./controller";
import config from "config";
import {  checkCommonAuthentication } from "../auth/middleware/check";

const basePath = config.get("BASE_PATH");
const currentPath = "common/";
const currentPathURL = basePath + currentPath;

export default [
  {
    path: currentPathURL + 'fileUpload',
    method: "post",
    handler: [
      checkCommonAuthentication,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await fileUpload(req.get(config.get('AUTHORIZATION')), req, next);
        res.status(200).send(result);
      }
    ]
  },
];
