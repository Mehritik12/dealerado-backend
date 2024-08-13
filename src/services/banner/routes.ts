import { NextFunction, Request, Response } from "express";
import { addBanner, deleteBanner, getBannerDetails, getBanners, updateBanner } from "./controller";
import config from "config";

import { checkAuthenticate } from "../../middleware/checks";
import { validate } from "./middleware/check";
import { checkAdminAuthenticate } from "../auth/middleware/check";


const basePath = config.get("BASE_PATH");
const currentPath = "banner";
const currentPathURL = basePath + currentPath;

export default [
  {
    path: currentPathURL,
    method: "post",
    handler: [
      checkAdminAuthenticate,
      validate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await addBanner(req.get(config.get("AUTHORIZATION")), req, next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL,
    method: "get",
    handler: [
      checkAdminAuthenticate,
      async (req: Request, res: Response,next:NextFunction) => {
        const result = await getBanners(req.get(config.get("AUTHORIZATION")), req.query,next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + "/:id",
    method: "get",
    handler: [
      checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getBannerDetails(req.get(config.get("AUTHORIZATION")), req.params.id, next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + "/:id",
    method: "delete",
    handler: [
      checkAdminAuthenticate,
      async (req: Request, res: Response) => {
        const result = await deleteBanner(req.get(config.get("AUTHORIZATION")), req.params.id);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + "/:id",
    method: "put",
    handler: [
      checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await updateBanner(req.get(config.get("AUTHORIZATION")), req.params.id, req, next);
        res.status(200).send(result);
      },
    ],
  },
];
