import { NextFunction, Request, Response } from "express";
import { addUser, changePassword, getUserDetails, getUsers, updateUser, userProfileUpdateByAdmin} from "./controller";
import config from "config";

import { checkAuthenticate } from "../../middleware/checks";
import { validate } from "./middleware/check";
import { checkAdminAuthenticate } from "../auth/middleware/check";


const basePath = config.get("BASE_PATH");
const currentPath = "user/";
const currentPathURL = basePath + currentPath;

export default [
  {
    path: currentPathURL+"create",
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
  // update profile by user
  {
    path: currentPathURL + "profileUpdate",
    method: "put",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await updateUser(req.get(config.get("AUTHORIZATION")), req,  next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL,
    method: "get",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getUserDetails(req.get(config.get("AUTHORIZATION")), next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + "changePassword",
    method: "post",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await changePassword(req.get(config.get("AUTHORIZATION")),req.body, next);
        res.status(200).send(result);
      },
    ],
  },

  // update user profile by admin
  {
    path: currentPathURL + "updateProfile" +"/:id",
    method: "put",
    handler: [
      checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await userProfileUpdateByAdmin(req.get(config.get("AUTHORIZATION")), req.params.id,req,  next);
        res.status(200).send(result);
      },
    ],
  },
  // {
  //   path: currentPathURL + "/:id",
  //   method: "delete",
  //   handler: [
  //     checkAdminAuthenticate,
  //     async (req: Request, res: Response) => {
  //       const result = await deleteUser(req.get(config.get("AUTHORIZATION")), req.params.id);
  //       res.status(200).send(result);
  //     },
  //   ],
  // },
  // {
  //   path: currentPathURL,
  //   method: "post",
  //   handler: [
  //     checkAdminAuthenticate,
  //     validate,
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       const result = await addUser(req.get(config.get("AUTHORIZATION")), req, next);
  //       res.status(200).send(result);
  //     },
  //   ],
  // },
];
