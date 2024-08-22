import jwt, { decode } from "jsonwebtoken";
import {
  HTTP400Error,
  HTTP404Error,
  HTTP403Error,
} from "../../utils/httpErrors";
import config from "config";
import { userModel } from "../../models/User";
import { Utilities } from "../../utils/Utilities";
var mongoose = require("mongoose");
import * as bcrypt from "bcrypt";
import moment from "moment";
import { MailerUtilities } from "../../utils/MailerUtilities";
const { v4: uuidv4 } = require("uuid");
import { FileUpload } from "../../utils/FileUploadUtilities";
const admin = require("firebase-admin");
const saltRound = 10;
import ejs from "ejs";
import { bannerModel } from "../../models/Banner";


// admin.initializeApp({
//   credential: admin.credential.cert(config.get("USER.FIREBASE.CREDENTIALS")),
//   databaseURL: config.get("USER.FIREBASE.DATABASE"),
// });

//******************************CLIENT**************************************
//*************************************************************************
export const register = async (bodyData: any, next: any) => {
  try {
    const { email } = bodyData;
    const query = [
      { isDeleted: false },
      { otpVerified: true },
      { $or: [{ email: email }, { mobileNumber: email }] }
    ]
    const user = await userModel.findOne({ $and: query });
    if (user) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.USER_EXISTS"),
        })
      );
    }

    let randomOTP = Utilities.genNumericCode(6);

    let userObj: any = {

      name: bodyData.name,
      email: bodyData.email,
      otp: "123456",
      otpVerified: true,
      otpExipredAt: moment().add(1, "m"),
    };

    const pass: string = await bcrypt.hash(bodyData.password, saltRound);
    userObj.password = pass;

    // Get email template to send email
    // let messageHtml = await ejs.renderFile(
    //   process.cwd() + "/src/views/otpEmail.ejs",
    //   { otp: randomOTP },
    //   { async: true }
    // );
    // let mailResponse = MailerUtilities.sendSendgridMail({
    //   recipient_email: [bodyData.email],
    //   subject: "OTP Verification",
    //   text: messageHtml,
    // });

    //await new userModel(req).save();
    await new userModel(userObj).save();
    return Utilities.sendResponsData({
      code: 200,
      message: "User Ragister successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (bodyData: any, next: any) => {
  try {
    const { email, password } = bodyData;
    const user: any = await userModel.findOne({ $or: [{ email: email.trim() }, { mobileNumber: email.trim() }], otpVerified: true, isDeleted: false, role: { $eq: "user" } });
    if (!user) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.USER_NOT_EXIST"),
        })
      );
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.INVALID_PASSWORD"),
        })
      );
    }
    let userToken = await Utilities.createJWTToken({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    user.accessToken = userToken;
    await user.save(user);

    user.token = userToken;

    const userData = { ...user };
    const result = userData?._doc;
    delete result.password;
    return Utilities.sendResponsData({
      code: 200,
      message: "Success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password send link to the user email
export const forgotPassword = async (bodyData: any, next: any) => {
  try {
    let userRes: any = await userModel.findOne({ email: bodyData.email, isDeleted: false });

    if (userRes) {
      const activateToken = await Utilities.generateActivationToken();
      userRes.activationToken = activateToken
      userRes.isActive = false;
      userRes.otpVerified = false;
      await userRes.save();

      const SITE_URL = config.get("SITE_URL");

      let messageHtml = await ejs.renderFile(
        process.cwd() + '/src/views/verifyLink.ejs',
        { name: bodyData.email, link: `${SITE_URL}/newPassword/${activateToken}` },
        { async: true }
      );

      let mailResponse: any = await MailerUtilities.sendSendgridMail({
        recipient_email: [bodyData.email],
        subject: 'Activation Link',
        text: messageHtml,
      });
      if (mailResponse && mailResponse.message == 'success') {
        return Utilities.sendResponsData({
          code: 200,
          message: config.get("ERRORS.USER_ERRORS.LINK_SENT"),
          data: {},
        });
      }
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.USER_NOT_EXIST"),
        })
      );
    }
  } catch (e) {
    next(e);
  }
};

// get Token & navigate to the new password page
export const activateLink = async (req: any, res: any, next: any) => {
  const { activationToken } = req.query;
  try {
    const user = await userModel.findOne({ activationToken: activationToken });

    if (!user) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.LINK_EXPIRED"),
        })
      );
    }

    if (user.isActive) {
      return Utilities.sendResponsData({
        code: 401,
        message: config.get("ERRORS.COMMON_ERRORS.ACC_ALREADY_VERIFIED"),
      });
    }

    user.isActive = true;
    user.otpVerified = true;
    user.activationToken = undefined;
    await user.save();
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.COMMON_ERRORS.ACCOUNT_VERIFIED"),
    });
  } catch (e) {
    next(e);
  }
};

// New password update after rest
export const updateNewPassword = async (bodyData: any, next: any) => {
  try {
    const userRes: any = await userModel.findOne({ activationToken: bodyData.activationToken });
    if (userRes) {
      let hashedPassword = await Utilities.cryptPassword(bodyData.password);
      userRes.password = hashedPassword;
      userRes.isActive = true;
      userRes.otpVerified = true;
      const savedData = await userRes.save();
      if (savedData) {
        return Utilities.sendResponsData({
          code: 200,
          message: config.get("ERRORS.USER_ERRORS.PASSWORD_UPDATED"),
        });
      } else {
        throw new HTTP400Error(
          Utilities.sendResponsData({
            code: 400,
            message: config.get("ERRORS.UNKNOWN_ERROR"),
          })
        );
      }
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.USER_NOT_EXIST"),
        })
      );
    }
  } catch (error) {
    next(error);
  }
};

//******************************ADMIN**************************************
//*************************************************************************
export const createSuperAdminUser = async () => {
  try {
    const adminData: any = {
      email: "admin@admin.com",
      password: "Qwarty@123",
      role: "sadmin",
      gender: "male"
    };
    const admin = await userModel.find({ role: "sadmin" });
    if (!admin.length) {
      adminData.isProfileUpdate = true;
      adminData.image =
        "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png";
      adminData.firstName = "admin";
      adminData.userType = "admin";
      adminData.email = adminData.email;
      const pass: string = await bcrypt.hash(adminData.password, saltRound);
      adminData.password = pass;
      await userModel.create(adminData);
      console.log('super admin created.')
    }
  } catch (error) {
    console.log(`Super Admin Create Error: ${error}`)
  }
};

export const adminLogin = async (bodyData: any, next: any) => {
  try {
    const { email, password } = bodyData;
    let admin = await userModel.findOne({
      role: { $in: ['sadmin', 'admin'] },
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
      name: admin.name || "",
      role: admin.role,
    });
    admin.accessToken = adminToken;
    await admin.save();
    const result = JSON.parse(JSON.stringify(admin));
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.COMMON_ERRORS.LOGIN_SUCCESS"),
      data: { ...result, accessToken: adminToken }
    });
  } catch (error) {
    next(error);
  }
};


