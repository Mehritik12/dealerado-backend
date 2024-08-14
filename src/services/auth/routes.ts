import { NextFunction, Request, Response } from "express";
import {
  adminLogin,
  createClientAccount,
  fileUpload,
  refreshToken,
  resendOTP,
  socialLogin,
  userActiveStatus,
  userLogin,
  verifyLogin
} from "./controller";
import config from "config";
import { checkLogin, checkSignup, checkResendOTP, verifyCheck, checkAuthenticate, checkClientSignup, checkAdminSignup, checkChangeAdminPassword, checkAdminAuthenticate, checkUserStatus, checkCommonAuthentication } from "./middleware/check";
const basePath = config.get("BASE_PATH");
const currentPath = "auth/";

const currentPathURL = basePath + currentPath;
console.log(currentPathURL)
export default [
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

  {
    path: currentPathURL + "verifyLogin",
    method: "post",
    handler: [
      verifyCheck,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await verifyLogin(req.body, next);
        res.status(200).send(result);
      },
    ],
  },

  //  Resend Partner OTP
  {
    path: currentPathURL + "resendOTP",
    method: "post",
    handler: [
      checkResendOTP,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await resendOTP(req.body, next);
        res.status(200).send(result);
      },
    ],
  },

  // social login for google
  {
    path: currentPathURL + "socialLogin",
    method: "post",
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await socialLogin(req, next);
        res.status(200).send(result);
      },
    ],
  },

  {
    path: currentPathURL + "changeUserStatus" + "/:id",
    method: "put",
    handler: [
      checkAdminAuthenticate,
      checkUserStatus,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await userActiveStatus(req.get(config.get("AUTHORIZATION")),req.params.id, req.body, next);
        res.status(200).send(result);
      },
    ],
  },


  // create and update client profile
  {
    path: currentPathURL + "createClientAccount",
    method: "post",
    handler: [
      checkClientSignup,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await createClientAccount(req.body, next);
        res.status(200).send(result);
      },
    ],
  },

  // *********************Admin***************************************************************************************
 
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
  {
    path: currentPathURL + 'refreshToken',
    method: "get",
    handler: [
      // checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await refreshToken(req.get(config.get('AUTHORIZATION')), next);
        res.status(200).send(result);
      }
    ]
  },
];
