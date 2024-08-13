import jwt, { decode } from "jsonwebtoken";
import {
  HTTP400Error,
  HTTP404Error,
  HTTP403Error,
} from "../../utils/httpErrors";
import config from "config";
import { userModel } from "../../db/User";
import { Utilities } from "../../utils/Utilities";
var mongoose = require("mongoose");
import * as bcrypt from "bcrypt";
import moment from "moment";
import { MailerUtilities } from "../../utils/MailerUtilities";
const { v4: uuidv4 } = require("uuid");
import { adminModel } from "../../db/Admin";
import { FileUpload } from "../../utils/FileUploadUtilities";
const admin = require("firebase-admin");
const saltRound = 10;
import ejs from "ejs";
import { bannerModel } from "../../db/Banner";


admin.initializeApp({
  credential: admin.credential.cert(config.get("USER.FIREBASE.CREDENTIALS")),
  databaseURL: config.get("USER.FIREBASE.DATABASE"),
});

//  common api for login and ragister
export const userLogin = async (bodyData: any, next: any) => {
  try {
    const { mobileNumber } = bodyData;
    const user = await userModel.findOne({
      mobileNumber: bodyData.mobileNumber,
      isDeleted: false,
    });
    // const otp = Math.floor(100000 + Math.random() * 900000);
    const otp = "2345";
    if (user) {
      user.otp = otp;
      user.fcmToken = bodyData.fcmToken;
      await user.save();
      return Utilities.sendResponsData({
        code: 200,
        message: config.get("ERRORS.COMMON_ERRORS.SEND_OTP_MOBILE"),
      });
    } else {
      bodyData.otp = otp;
      const userRes = await userModel.create(bodyData);
      return Utilities.sendResponsData({
        code: 200,
        message: config.get("ERRORS.COMMON_ERRORS.SEND_OTP_MOBILE"),
      });
    }
  } catch (error) {
    next(error);
  }
};

export const verifyLogin = async (bodyData: any, next: any) => {
  try {
    const { mobileNumber, otp } = bodyData;
    const user = await userModel.findOne({ mobileNumber: mobileNumber });
    if (user) {
      if (user?.otp != otp) {
        throw new HTTP400Error(
          Utilities.sendResponsData({
            code: 400,
            message: config.get("ERRORS.COMMON_ERRORS.INVALID_OTP"),
          })
        );
      }
      const userToken = await Utilities.createJWTToken({
        id: user?._id,
        email: user.email ? user.email : "",
        mobile: user.mobileNumber,
        role: user.role,
        name: user.firstName ? user.firstName : "",
      });
      user.accessToken = userToken;
      user.otpVerified = true;
      if (user.isProfileUpdate == true) {
        user.isLogIn = true;
      }
      const res = await user.save();
      let resObj = { ...res };

      return Utilities.sendResponsData({
        code: 200,
        message:
          user.isProfileUpdate == true
            ? config.get("ERRORS.COMMON_ERRORS.LOGIN_SUCCESS")
            : config.get("ERRORS.COMMON_ERRORS.VERIFY_SUCCESS"),
        data: resObj,
      });
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.NO_RECORD_FOUND"),
        })
      );
    }
  } catch (err) {
    next(err);
  }
};

export const userActiveStatus = async (token: any, id: any, bodyData: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const { status } = bodyData;
    if (mongoose.Types.ObjectId.isValid(id)) {
      const userRes = await userModel.findOne({ _id: id });
      if (!userRes) {
        throw new HTTP400Error(
          Utilities.sendResponsData({ code: 400, message: config.get('ERRORS.NO_RECORD_FOUND') })
        );
      }
      userRes.isActive = status
      await userRes.save();

      return Utilities.sendResponsData({
        code: 200,
        message: config.get("ERRORS.COMMON_ERRORS.SUCCESS"),
        data: userRes
      });
    }
    else {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: config.get('ERRORS.INVALID_ID') })
      );
    }
  }
  catch (error) {
    next(error);
  }
};

export const resendOTP = async (req: any, next: any) => {
  try {
    const { mobileNumber } = req;
    const user = await userModel.findOne({
      mobileNumber: mobileNumber,
      isDeleted: false,
    });
    const randomOTP = "2345";
    if (!user) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.COMMON_ERRORS.USER_NOT_EXIST"),
        })
      );
    } else if (user) {
      user.otp = randomOTP;
      user.otpVerified = false;
      await user.save();
      return Utilities.sendResponsData({
        code: 200,
        message: config.get("ERRORS.COMMON_ERRORS.SEND_OTP_MOBILE"),
        data: { mobile: user.mobileNumber, otp: user.otp },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const socialLogin = async (req: any, next: any) => {
  try {
    var firstTimeLogin = false;
    var name;

    function doSomething() {
      return admin
        .app()
        .auth()
        .verifyIdToken(req.body.firebase_token)
        .then(async function (decodedToken: any) {
          return decodedToken.uid;
        });
    }
    let uid = await doSomething();
    function doSomething1() {
      return admin
        .app()
        .auth()
        .getUser(uid)
        .then(async function (userRecord: any) {
          return userRecord;
        });
    }

    async function doSomething2() {
      let userRecord = await doSomething1();
      name = userRecord?.displayName;
      let finalResult: any;
      var userInfo = {};
      userInfo = userInfo || {};
      var criteria = {};
      if (req.body.socialType == "google") {
        criteria = {
          "socialMediaLinks.google.id": userRecord?.uid,
          isDeleted: false,
        };
      }

      let userRes = await userModel.findOne(criteria);
      if (!userRes) {
        let user: any = {
          name: userRecord?.displayName,
          photo: userRecord?.photoURL,
          socialMediaLinks: {
            [req?.body?.social_type]: {
              id: userRecord?.uid,
              profilePic: userRecord?.photoURL,
              displayName: userRecord?.displayName,
              email: userRecord?.email,
            },
          },
          email: userRecord?.email,
          tokenKey: uuidv4() + moment().unix(),
          uid: userRecord?.uid,
        };
        finalResult = await userModel.create(user);
        firstTimeLogin = true;
      } else {
        userRes.email = userRecord?.email;
        // userRes.tokenKey = uuidv4() + moment().unix();
        finalResult = await userRes.save();
        firstTimeLogin = false;
      }
      const token = await Utilities.getUserToken(finalResult);
      finalResult.accessToken = token;
      finalResult.firstTimeLogin = false;
      return finalResult;
    }
    let res = await doSomething2();
    let obj = {
      name: res?.name,
      accessToken: res?.accessToken,
      firstTimeLogin: firstTimeLogin,
      photo: res?.socialMediaLinks.google.profilePic,
      id: res?._id,
      createdAt: res?.createdAt,
      updatedAt: res?.updatedAt,
    };
    return { responseCode: 200, responseMessage: "Success", data: obj };
  } catch (error) {
    next(error);
  }
};

export const createClientAccount = async (req: any, next: any) => {
  try {
    const reqData = req;
    const { email, mobileNumber } = reqData;
    const user = await userModel.findOne({ mobileNumber: mobileNumber, isDeleted: false });
    if (user) {
      let obj: any = {
        firstName: req.firstName || "",
        lastName: req.lastName || "",
        email: req.email || "",
        mobileNumber: req.mobileNumber || "",
        dob: req.dob && req.dob,
        gender: req.gender || '',
        isLogIn: true,
        isProfileUpdate: true,
        profilePicture: req.profilePicture || ''
      }
      const token = await Utilities.createJWTToken({
        id: user?._id,
        email: user.email ? user.email : "",
        mobileNumber: user.mobileNumber,
        role: user.role,
      });
      obj["accessToken"] = token;
      let doc = await userModel.updateOne(
        { mobileNumber: mobileNumber, isDeleted: false },
        obj
      );

      return Utilities.sendResponsData({
        code: 200,
        message: config.get("ERRORS.COMMON_ERRORS.SUCCESS"),
        data: obj,
      });
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 404,
          message: config.get("ERRORS.COMMON_ERRORS.USER_NOT_EXIST"),
        })
      );
    }
  } catch (error) {
    next(error);
  }
};

//*****************admin controller************************************************************************************************************
//************************************************************************************************************************************************
export const adminSignUp = async (next: any) => {  
  try {
    const adminData: any = {
      email: "admin@admin.com",
      password: "Qwarty@123",
    };
    const admin = await adminModel.find({});
    if (admin.length == 1) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.ADMIN.ALREADY_EXIST"),
        })
      );
    }
    adminData.isProfileUpdate = true;
    adminData.image =
      "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png";
    adminData.firstName = "admin";
    adminData.userType = "admin";
    adminData.email = adminData.email;
    const pass: string = await bcrypt.hash(adminData.password, saltRound);
    adminData.password = pass;
    const adminRes = await adminModel.create(adminData);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.ADMIN.RAGISTER"),
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (bodyData: any, next: any) => {
  try {
    const { email, password } = bodyData;
    const admin = await adminModel.findOne({
      userType: "admin",
      isDeleted: false,
      email: email,
    });
    if (!admin) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.COMMON_ERRORS.USER_NOT_EXIST"),
        })
      );
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.ADMIN.INVALID_CREDENTIAL"),
        })
      );
    }
    let adminToken = await Utilities.createJWTToken({
      id: admin._id,
      email: admin.email,
      name: admin.firstName || "",
      role: admin.userType,
    });
    admin.accessToken = adminToken;
    await admin.save();
    const userData = { ...admin };
    const result = userData;
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.COMMON_ERRORS.LOGIN_SUCCESS"),
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const adminChangePassword = async (token: any, bodyData: any, next: any) => {
  try {
    const { oldPassword, newPassword } = bodyData;
    const decoded: any = await Utilities.getDecoded(token);
    let adminRes: any = await adminModel.findOne({
      _id: mongoose.Types.ObjectId(decoded.id),
      isDeleted: false,
    });
    if (adminRes) {
      const match = await Utilities.VerifyPassword(
        oldPassword,
        adminRes.password
      );
      if (match) {
        let hashedPassword = await Utilities.cryptPassword(newPassword);
        adminRes.password = hashedPassword;
        adminRes.save();
        return Utilities.sendResponsData({
          code: 200,
          message: "Password updated successfully",
        });
      } else {
        throw new HTTP400Error(
          Utilities.sendResponsData({
            code: 400,
            message: config.get("ERRORS.ADMIN.INVALID_PASSWORD"),
          })
        );
      }
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.COMMON_ERRORS.USER_NOT_EXIST"),
        })
      );
    }
  } catch (error) {
    next(error);
  }
};

export const fileUpload = async (token: any, req: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    let userRes: any = await userModel.findOne({ _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false });
    let adminRes: any = await adminModel.findOne({ _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false });
    let bannerRes: any = await bannerModel.findOne({ _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false });
    if (userRes || adminRes || bannerRes) {
      let bodyData: any = JSON.parse(JSON.stringify(req.body));
      const fileArr: any = [];
      for (const file of req.files) {
        fileArr.push(await FileUpload.uploadFileToAWS(file, bodyData.type, null));
      }
      const imagesData :any= [];
      fileArr.forEach((item: any) => {
        imagesData.push({
          "url": item.Location.toString(),
          "fileName": item.key
        });
      });

      return Utilities.sendResponsData({ code: 200, message: config.get('ERRORS.COMMON_ERRORS.SUCCESS_MESSAGE'), data: imagesData });
    }
    else {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: config.get('ERRORS.USER_ERRORS.USER_NOT_EXIST') })
      );
    }
  }
  catch (error) {
    console.log("err", error);
    throw new HTTP400Error(Utilities.sendResponsData({ code: 400, message: error }));
  }
}

export const refreshToken = async (token: any, next: any) => {
  try {

    const decoded: any = await Utilities.getDecoded(token);
    if(decoded){
      let userRes: any = await userModel.findOne({ _id: mongoose.Types.ObjectId(decoded?.id), isDeleted: false });
      let updatedRes;
  
      if (userRes) {
        let res = userRes;
        let refreshToken = await Utilities.createJWTToken({
          id: res?._id,
          email: res.email ? res.email : "",
          mobile: res.mobile,
          role: res.role,
        });
         if (userRes) {
          await userModel.updateOne(
            { _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false },
            { accessToken: refreshToken }
          );
        }
        return Utilities.sendResponsData({
          code: 200,
          message: "Success",
          data: { accessToken: refreshToken }
        });
      } else {
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.COMMON_ERRORS.USER_NOT_EXIST"),
        })
      }
    }
  }
  catch (error) {
    console.log("err", error);
    throw new HTTP400Error(Utilities.sendResponsData({ code: 400, message: error }));
  }
}
