import { NextFunction, Request, Response } from "express";
import { addMoneyToUserAccount, addUser, adminPermissionUpdateBySuperAdmin, changePassword, deleteUser, getAllUserBalance, getAllUserTransactions, getUserBalance, getUserDetails, getUsers, getUserWallet, updateUser, userProfileUpdateByAdmin, getBasicSearch, getAdvancedSearch } from "./controller";
import config from "config";

import { checkAuthenticate } from "../../middleware/checks";
import { addMoneyValidate, validate } from "./middleware/check";
import { checkAdminAuthenticate } from "../auth/middleware/check";


const basePath = config.get("BASE_PATH");
const currentPath = "user/";
const currentPathURL = basePath + currentPath;

console.log(currentPath,">>>>> current path>>> ")

export default [
  {
    path: currentPathURL + "create",
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
    path: currentPathURL + 'getAllUsers',
    method: "get",
    handler: [
      checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getUsers(req.get(config.get("AUTHORIZATION")), req.query, next);
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
        const result = await updateUser(req.get(config.get("AUTHORIZATION")), req, next);
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
        const result = await changePassword(req.get(config.get("AUTHORIZATION")), req.body, next);
        res.status(200).send(result);
      },
    ],
  },

  // update user profile by admin
  {
    path: currentPathURL + "updateProfile" + "/:id",
    method: "put",
    handler: [
      checkAdminAuthenticate,
      validate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await userProfileUpdateByAdmin(req.get(config.get("AUTHORIZATION")), req.params.id, req, next);
        res.status(200).send(result);
      },
    ],
  },
  // update admin permissions by super admin
  {
    path: currentPathURL + "permission" + "/:id",
    method: "put",
    handler: [
      checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await adminPermissionUpdateBySuperAdmin(req.get(config.get("AUTHORIZATION")), req.params.id, req.body, next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + "deleteUser" + "/:id",
    method: "delete",
    handler: [
      checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await deleteUser(req.get(config.get("AUTHORIZATION")), req.params.id, next);
        res.status(200).send(result);
      },
    ],
  },

  // Transfer money to user account.
  {
    path: currentPathURL + "addMoney",
    method: "post",
    handler: [
      checkAdminAuthenticate,
      addMoneyValidate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await addMoneyToUserAccount(req.get(config.get("AUTHORIZATION")), req.body, next);
        res.status(200).send(result);
      },
    ],
  },
  {
    path: currentPathURL + "getAllTransactions" + "/:id",
    method: "get",
    handler: [
      checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getAllUserTransactions(req.get(config.get("AUTHORIZATION")), req.params.id, req.query, next);
        res.status(200).send(result);
      },
    ],
  },
  // for get my balance [user balance]
  {
    path: currentPathURL + "userWallet",
    method: "get",
    handler: [
      checkAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getUserWallet(req.get(config.get("AUTHORIZATION")), next);
        res.status(200).send(result);
      },
    ],
  },
  // Check user balance
  {
    path: currentPathURL + "userBalance" + "/:id",
    method: "get",
    handler: [
      checkAdminAuthenticate,
      async (req: Request, res: Response, next: NextFunction) => {
        const result = await getUserBalance(req.get(config.get("AUTHORIZATION")),req.params.id, next);
        res.status(200).send(result);
      },
    ],
  },

    // calculated all users balance
    {
      path: currentPathURL + "allUserBalance",
      method: "get",
      handler: [
        checkAdminAuthenticate,
        async (req: Request, res: Response, next: NextFunction) => {
          const result = await getAllUserBalance(req.get(config.get("AUTHORIZATION")), next);
          res.status(200).send(result);
        },
      ],
    },
  
    {
      path: currentPathURL + "vehicleBasicSearch" +"/:id",
      method: "get",
      handler: [
        async (req: Request, res: Response, next: NextFunction) => {
          const result = await getBasicSearch(req.get(config.get("AUTHORIZATION")), req.params.id, next);
          res.status(200).send(result);
        },
      ]
    },

    {
      path: currentPathURL + "vehicleAdvancedSearch" +"/:id",
      method: "get",
      handler: [
        async (req: Request, res: Response, next: NextFunction) => {
          const result = await getAdvancedSearch(req.get(config.get("AUTHORIZATION")), req.params.id, next);
          res.status(200).send(result);
        },
      ]
    }
    
];
