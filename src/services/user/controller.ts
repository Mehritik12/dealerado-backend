import { HTTP400Error } from "../../utils/httpErrors";
import { Utilities } from "../../utils/Utilities";
import config from "config";
import { FileUpload } from "../../utils/FileUploadUtilities";
import { userModel } from "../../models/User";
import { ADMIN_ROLES, SUPER_ADMIN } from "../../constants";
var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

export const getUsers = async (token: any, body: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    let skip = body.skip || 0;
    let limit = body.limit || 10;

    let search = body.search;
    let query: any = {
      isDeleted: false,
      role: "user",
    };
    if (search) {
      query["$or"] = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { mobileNumber: new RegExp(search, "i") },
      ];
    }
    let totalRecords = await userModel.countDocuments(query);
    let result = await userModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    return {
      responseCode: 200,
      responseMessage: "success",
      data: result,
      totalRecord: totalRecords,
    };
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (token: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }
    if (mongoose.Types.ObjectId.isValid(decoded.id)) {
      const userData = await userModel.findOne({
        _id: decoded.id,
        isDeleted: false,
      });
      if (!userData) {
        throw new HTTP400Error(
          Utilities.sendResponsData({
            code: 400,
            message: config.get("ERRORS.NO_RECORD_FOUND"),
          })
        );
      }
      return Utilities.sendResponsData({
        code: 200,
        message: config.get("ERRORS.USER_ERRORS.FETCH"),
        data: userData,
      });
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.INVALID_ID"),
        })
      );
    }
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (token: any, req: any, next: any) => {
  try {
    const bodyData = req.body;
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.INVALID_ID"),
        })
      );
    }

    let userData = await userModel.findOne({
      _id: decoded.id,
      isDeleted: false,
    });

    if (!userData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.NO_RECORD_FOUND"),
        })
      );
    }

    const isMobileExist = await userModel.findOne({_id: { $ne: new mongoose.Types.ObjectId(decoded.id) },
      mobileNumber: bodyData.mobileNumber,
    });

    if (isMobileExist) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.MOBILE_EXIST"),
        })
      );
    }

    const isEmailExist = await userModel.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(decoded.id) },
      email: bodyData.email,
    });

    if (isEmailExist) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.EMAIL_EXIST"),
        })
      );
    }

    userData.businessName = bodyData.businessName || userData.businessName;
    userData.email = bodyData.email || userData.email;
    userData.mobileNumber = bodyData.mobileNumber || userData.mobileNumber;
    userData.name = bodyData.name || userData.name;
    userData.profilePicture = bodyData.profilePicture || userData.profilePicture;

    // if (req.files) {
    //   const file = req.files;
    //   const uploadedFile: any = await FileUpload.uploadFileToAWS(
    //     file,
    //     req.body.type || "profile",
    //     null
    //   );
    //   console.log(uploadedFile)
    //   userData.profilePicture = uploadedFile.Location;
    // }

    await userData.save();

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.UPDATE"),
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (token: any, bodyData: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }
    let userRes: any = await userModel.findOne({
      _id: new mongoose.Types.ObjectId(decoded.id),
      isDeleted: false,
    });

    if (userRes) {
      const isMatched = await bcrypt.compare(bodyData.password, userRes.password)
      if (isMatched) {
        let hashedPassword = await Utilities.cryptPassword(bodyData.password);
        userRes.password = hashedPassword;
        userRes.save();
        return Utilities.sendResponsData({
          code: 200,
          message: config.get("ERRORS.USER_ERRORS.PASSWORD_UPDATED"),
        });
      } else {
        throw new HTTP400Error(
          Utilities.sendResponsData({
            code: 400,
            message: config.get("ERRORS.USER_ERRORS.PASSWORD_INVALID"),
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
