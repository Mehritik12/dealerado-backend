import { NextFunction, Request, Response } from "express";
import {
  activateLink,
  adminLogin,
  forgotPassword,
  // createClientAccount,
  // fileUpload,
  // refreshToken,
  register,
  updateNewPassword,
  // resendOTP,
  // socialLogin,
  // userActiveStatus,
  userLogin,
  // verifyLogin
} from "./controller";
import config from "config";
import { checkLogin, checkSignup,checkAdminSignup,validateLink, checkForgotPassword, checkNewPassword } from "./middleware/check";
const basePath = config.get("BASE_PATH");
const currentPath = "auth/";

const currentPathURL = basePath + currentPath;

export default [
    {
    path: currentPathURL + "register",
    method: "post",
    handler: [
      checkSignup,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await register(req.body, next);
        res.status(200).send(result);
      },
    ],
  },
  // Login & Ragister 
  {
    path: currentPathURL + "login",
    method: "post",
    handler: [
      checkLogin,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await userLogin(req.body, next);
        res.status(200).send(result);
      },
    ],
  },

  //@Forgot password//
  {
    path: currentPathURL + "forgotPassword",
    method: "post",
    handler: [
      checkForgotPassword,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await forgotPassword(req.body, next);
        res.status(200).send(result);
      },
    ],
  },

  // @activate email //
  {
    path: currentPathURL + "activate",
    method: "get",
    handler: [
      validateLink,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await activateLink(req, res, next);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + "newPassword",
    method: "post",
    handler: [
      checkNewPassword,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await updateNewPassword(req.body,  next);
        res.status(200).send(result);
      },
    ],
  },

  // social login for google
  // {
  //   path: currentPathURL + "socialLogin",
  //   method: "post",
  //   handler: [
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       const result = await socialLogin(req, next);
  //       res.status(200).send(result);
  //     },
  //   ],
  // },

//******************************ADMIN**************************************
//*************************************************************************
  {
    path: currentPathURL + "loginAdmin",
    method: "post",
    handler: [
      checkAdminSignup,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await adminLogin(req.body, next);
        res.status(200).send(result);
      },
    ],
  },

  // {
  //   path: currentPathURL + 'refreshToken',
  //   method: "get",
  //   handler: [
  //     // checkAuthenticate,
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       const result = await refreshToken(req.get(config.get('AUTHORIZATION')), next);
  //       res.status(200).send(result);
  //     }
  //   ]
  // },
];
