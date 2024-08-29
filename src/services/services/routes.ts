import { NextFunction, Request, Response } from "express";
import { addService, getServices, getSubServices, getSubServicesBySlug, getSubServicesByparentId } from "./controller";
import config from "config";

import { checkAuthenticate } from "../../middleware/checks";
import { validateService } from "./middleware/check";
import { checkAdminAuthenticate } from "../auth/middleware/check";

const basePath = config.get("BASE_PATH");
const currentPath = "service/";
const currentPathURL = basePath + currentPath;

export default [
  {
    path: currentPathURL + "create",
    method: "post",
    handler: [
      // checkAdminAuthenticate,
      // validateService,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await addService(req.get(config.get("AUTHORIZATION")), req, next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + 'getAllServices',
    method: "get",
    handler: [
      // checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getServices(req.get(config.get("AUTHORIZATION")), req.query, next);
        res.status(200).send(result);
      },
    ],
  },
  
  {
    path: currentPathURL + 'getAllSubServices',
    method: "get",
    handler: [
      // checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getSubServices(req.get(config.get("AUTHORIZATION")), req.query, next);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + 'getSubServicesBySlug',
    method: "get",
    handler: [
      // checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getSubServicesBySlug(req, next);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + 'getSubServicesByParentId' + "/:id",
    method: "get",
    handler: [
      // checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getSubServicesByparentId(req.params.id,req.query, next);
        res.status(200).send(result);
      },
    ],
  },

];
