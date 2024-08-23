import { HTTP400Error } from "../../utils/httpErrors";
import { Utilities } from "../../utils/Utilities";
import config from "config";
import { FileUpload } from "../../utils/FileUploadUtilities";
import { userModel } from "../../models/User";
import { ADMIN_ROLES, SUPER_ADMIN } from "../../constants";
import { PermissionModel } from "../../models/Permission";
import { DEFAULT_PERMISSION } from "../../constants/permission";
var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

export const addUser = async (token: any, req: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    let bodyData: any;
    bodyData = req.body;
    let role:any= bodyData?.role|| 'user';

    const isMobileExist = await userModel.findOne({
      mobileNumber: bodyData.mobileNumber || "",
      isDeleted: false
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
      email: bodyData.email || "",
      isDeleted: false,
    });

    if (isEmailExist) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.EMAIL_EXIST"),
        })
      );
    }
    bodyData.createdBy = decoded.id;
    bodyData.updatedBy = decoded.id;
    let result = await userModel.create(bodyData);
    let defaultPermissions= DEFAULT_PERMISSION[role];
    let permission= await PermissionModel.create({userId: result._id?.toString(),...defaultPermissions })
  
    await userModel.updateOne({_id: result?._id},{permissions: permission._id?.toString()})
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.CREATE"),
      data: result,
    });

  } catch (error) {
    next(error)
  }
}

export const getUsers = async (token: any, queryData: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const page: number = parseInt(queryData.page) || 1;
    const limit: number = parseInt(queryData.limit) || 10;
    const role = queryData.role || 'user';

    const skip: number = (page - 1) * limit;


    let search = queryData.search;
    let query: any = {
      isDeleted: false,
      role: role,
    };
    if (search) {
      query["$or"] = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { mobileNumber: new RegExp(search, "i") },
      ];
    }
    let totalRecords = await userModel.countDocuments(query);
    let result = await userModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.FETCH"),
      data: result,
      totalRecord:totalRecords
    });
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

// update profile by user
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

    const isMobileExist = await userModel.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(decoded.id) },
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

    userData.dealershipName = bodyData.businessName || userData.dealershipName;
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

export const userProfileUpdateByAdmin = async (token: any, userId: any, req: any, next: any) => {
  try {
    const bodyData = req.body;
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.INVALID_ID"),
        })
      );
    }

    let userData = await userModel.findOne({ _id: userId, isDeleted: false, });

    if (!userData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.NO_RECORD_FOUND"),
        })
      );
    }

    const isMobileExist = await userModel.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(userId) },
      mobileNumber: bodyData.mobileNumber || "",
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
      _id: { $ne: new mongoose.Types.ObjectId(userId) },
      email: bodyData.email || "",
    });

    if (isEmailExist) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.EMAIL_EXIST"),
        })
      );
    }

    userData.dealershipName = bodyData.businessName || userData.dealershipName;
    userData.email = bodyData.email || userData.email;
    userData.mobileNumber = bodyData.mobileNumber || userData.mobileNumber;
    userData.name = bodyData.name || userData.name;
    userData.profilePicture = bodyData.profilePicture || userData.profilePicture;
    userData.isKyc= bodyData.isKyc || userData.isKyc
    userData.updatedBy = decoded.id || userData.updatedBy;
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
      message: config.get("ERRORS.USER_ERRORS.UPDATE")
    });
  } catch (error) {
    next(error);
  }
};