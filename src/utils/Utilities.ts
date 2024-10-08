import jwt from "jsonwebtoken";
import config from "config";
import * as bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import { userModel } from "../models/User";
import { HTTP400Error, HTTP404Error, HTTP403Error } from "./httpErrors";
import { invalidTokenError } from "./ErrorHandler";
import { PermissionModel } from "../models/Permission";
import mongoose from "mongoose";
import { PERMISSION_TYPE } from "../constants";

export class Utilities {

  /**
   * Return response in custom format
   * @param response
   */
  public static sendResponsData(response: any) {
    let result: any = {
      responseCode: response.code,
      responseMessage: response.message,
    };
    if (response.data) {
      result.data = response.data;
    }
    if (response.totalRecord) {
      result.totalRecord = response.totalRecord;
    }
    return result;
  }

  /**
   * Generate encrypted password
   * @param {string} password
   */
  public static cryptPassword = async (password: string) => {
    return new Promise(function (resolve, reject) {
      return bcrypt.hash(
        password,
        config.get("SALT"),
        (err: any, hash: any) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(hash);
          }
        }
      );
    });
  };

  /**
   * Verify password
   * @param {string} password
   */
  public static VerifyPassword = async (password: string, hash: string) => {
    return new Promise(function (resolve, reject) {
      return bcrypt.compare(password, hash, (error: any, result: any) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(result);
        }
      });
    });
  };

  /**
   * Create jwt token
   * @param {object} payload
   * @param {string} token - return token
   */
  public static createJWTToken = async (payload: any) => {
    return jwt.sign(payload, config.get("JWT_SECRET_KEY") || '', { expiresIn: '24h' });
  };

  /**
   * Verify token is valid or not
   * @param {string} token
   */
  public static verifyToken = async (token: any) => {
    return new Promise(function (resolve, reject) {
      jwt.verify(
        token,
        config.get("JWT_SECRET_KEY"),
        async function (error: any, result: any) {
          if (error) {
            return reject(error);
          } else {
            let userRes: any = await userModel.findOne({ accessToken: token });
            if (userRes) {
              return resolve(result);
            } else {
              return reject({ message: "Invalid Token" });
            }
          }
        }
      );
    })

  };

  public static verifyAdminToken = async (token: any) => {
    return new Promise(function (resolve, reject) {
      jwt.verify(
        token,
        config.get("JWT_SECRET_KEY"),
        async function (error: any, result: any) {
          if (error) {
            return reject(error);
          } else {
            let adminRes: any = await userModel.findOne({ accessToken: token });
            if (adminRes) {
              return resolve(result);
            } else {
              return reject({ message: "Invalid Token" });
            }
          }
        }
      );
    })
  };

  public static commonVerifyToken = async (token: any) => {
    return new Promise(function (resolve, reject) {
      jwt.verify(
        token,
        config.get("JWT_SECRET_KEY"),
        async function (error: any, result: any) {
          if (error) {
            return reject(error);
          } else {
            let userRes: any = await userModel.findOne({ accessToken: token });
            if (userRes) {
              return resolve(result);
            } else {
              return reject({ message: "Invalid Token" });
            }
          }
        }
      );
    })
  };

  /**
   * decoded jwt token
   * @param token string
   */
  public static getDecoded = async (token: any) => {
    return jwt.decode(token);
  };

  /**
   * check Super admin or sub admin
   * @param token string
   */
  public static isAdmin = async (token: any) => {
    const decoded: any = await Utilities.getDecoded(token);

    if (
      decoded.user_type === "Super-Admin" ||
      decoded.user_type === "Sub-Admin"
    )
      return true;
    return false;
  };

  /**
   * Generate alphanumer random string of given length
   * @param length
   */
  public static genAlphaNumericCode(length: number) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * 
   * @param length of otp we want to generate
   * @returns numeric code for specified length
   */
  public static genNumericCode(length: number) {
    let min = Math.pow(10, length - 1);
    let max = (Math.pow(10, length) - Math.pow(10, length - 1) - 1);
    return Math.floor(min + Math.random() * max)
  }


  public static getUserToken(user: any) {
    var claims = {
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      role: user.role,
      session: user.tokenKey,
      uid: user.uid,
    };

    return jwt.sign(claims, config.get("JWT_SECRET_KEY") || '', {
      expiresIn: parseInt(config.get("SOCIAL_TOKEN_PERIOD"))
    });
  }

  public static generateActivationToken = async () => {
    return Math.random().toString(36).substring(2);
  }

  public static permissionCheck = async (userId: any, permission: string) => {
    try {
      const userPermission = await PermissionModel.findOne({ userId: new mongoose.Types.ObjectId(userId) }); 
      const permissionMap = {
        [PERMISSION_TYPE.UDPATE_USER]: userPermission?.updateUser,
        [PERMISSION_TYPE.CREATE_USER]: userPermission?.createUser,
        [PERMISSION_TYPE.DELETE_USER]: userPermission?.deleteUser,
        [PERMISSION_TYPE.READ_USER]: userPermission?.readUser,

        [PERMISSION_TYPE.UPDATE_BANNER]: userPermission?.updateBanner,
        [PERMISSION_TYPE.CREATE_BANNER]: userPermission?.createBanner,
        [PERMISSION_TYPE.DELETE_BANNER]: userPermission?.deleteBanner,
        [PERMISSION_TYPE.READ_BANNER]: userPermission?.readBanner,

        [PERMISSION_TYPE.UPDATE_ORDER]: userPermission?.updateOrder,
        [PERMISSION_TYPE.CREATE_ORDER]: userPermission?.createOrder,
        [PERMISSION_TYPE.DELETE_ORDER]: userPermission?.deleteOrder,
        [PERMISSION_TYPE.READ_ORDER]: userPermission?.readOrder,

      };
  
      if (permissionMap[permission]) {
        return true;
      } else {
        throw new HTTP400Error(
          Utilities.sendResponsData({
            code: 400,
            message: config.get("ERRORS.PERMISSION_DENIED"),
          })
        );
      }
    } catch (err) {
      throw err
    }
  };
  
}
