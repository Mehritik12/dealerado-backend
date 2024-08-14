import { NextFunction, Request, Response } from "express";
import {  addUser, deleteUser, getUserDetails, getUsers, updateUser} from "./controller";
import config from "config";

import { checkAuthenticate } from "../../middleware/checks";
import { validate } from "./middleware/check";
import { checkAdminAuthenticate } from "../auth/middleware/check";


const basePath = config.get("BASE_PATH");
const currentPath = "user/";
const currentPathURL = basePath + currentPath;

export default [
  {
    path: currentPathURL,
    method: "post",
    handler: [
      checkAdminAuthenticate,
      validate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await addUser(req.get(config.get("AUTHORIZATION")), req, next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL+'getAllUsers',
    method: "get",
    handler: [
      checkAdminAuthenticate,
      async (req: Request, res: Response,next:NextFunction) => {
        const result = await getUsers(req.get(config.get("AUTHORIZATION")), req.query,next);
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
        const result = await getUserDetails(req.get(config.get("AUTHORIZATION")), req.params.id, next);
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
        const result = await deleteUser(req.get(config.get("AUTHORIZATION")), req.params.id);
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
        const result = await updateUser(req.get(config.get("AUTHORIZATION")), req.params.id, req, next);
        res.status(200).send(result);
      },
    ],
  },
];
