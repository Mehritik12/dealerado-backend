import {
  HTTP400Error,
  HTTP404Error,
  HTTP403Error,
} from "../../utils/httpErrors";
import { Utilities } from "../../utils/Utilities";
import config from "config";
import { FileUpload } from "../../utils/FileUploadUtilities";
import { userModel } from "../../db/User";
import { ADMIN_ROLES, SUPER_ADMIN } from "../../constants";
var mongoose = require("mongoose");


export const addUser = async (token: any, req: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const {firstName,lastName,gender,dob,email,mobileNumber,profilePicture,role} = req.body;
    if (!ADMIN_ROLES.includes(decoded?.role)) {
      throw new HTTP400Error({
        responseCode: 400,
        responseMessage: config.get("ERRORS.USER_ERRORS.INVALID_DESIGNATION"),
      });
    }
    let payload:any = {
      firstName,
      lastName,
      email,
      mobileNumber,
      dob,
      gender,
      isLogIn: true,
      isProfileUpdate: true,
      profilePicture: profilePicture || '',
    }

    let isExist: any = await userModel.findOne({
      email,
      mobileNumber
    });

    if (!isExist) {
      if (req.files) {
        let fileurl = await FileUpload.uploadFileToAWS(
          req.files[0],
          decoded.id,
          req.body
        );
        payload.image = fileurl;
      }
      payload.createdBy = decoded.id;
      payload.updatedBy = decoded.id;
      let result = await userModel.create(payload);
      return { responseCode: 200, responseMessage: "success", data: result };
    } else {
      throw new HTTP400Error({
        responseCode: 400,
        responseMessage: "User exist"
      });
    }
  } catch (error) {
    next(error)
  }
};

export const getUsers = async (token: any, body: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    let skip = body.skip || 0;
    let limit = body.limit || 10;

    let search = body.search;
    let query: any = {
      isDeleted: false
    };
    if (search) {
      query["$or"] = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { mobileNumber: new RegExp(search, 'i') },
      ];
    }
    let totalRecords = await userModel.countDocuments(query)
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
    next(error)
  }
};

export const getUserDetails = async (token: any, id: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (mongoose.Types.ObjectId.isValid(id)) {
      const userData = await userModel.findOne({ _id: id, isDeleted: false });
      if (!userData) {
        throw new HTTP400Error(
          Utilities.sendResponsData({ code: 400, message: "User not found" })
        );
      }
      return {
        responseCode: 200,
        responseMessage: "success",
        data: userData,
      };
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: "Invalid Id" })
      );
    }
  } catch (error) {
    next(error)
  }config.get("ROLES.ADMIN")
};

export const deleteUser = async (token: any, id: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (decoded.role !== SUPER_ADMIN) {
      throw new HTTP400Error({
        responseCode: 400,
        responseMessage: config.get("ERRORS.USER_ERRORS.INVALID_DESIGNATION"),
      });
    }
    if (mongoose.Types.ObjectId.isValid(id)) {
      const userData = await userModel.findOne({ _id: id, isDeleted: false });
      if (!userData) {
        throw new HTTP400Error(
          Utilities.sendResponsData({ code: 400, message: "User not found"})
        );
      }
      userData.isDeleted = true;
      await userData.save();
      return {
        responseCode: 200,
        responseMessage: "success",
        data: userData,
      };
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: "Invalid Id"})
      );
    }
  } catch (error) {
    console.log(error);
  }
};

// update user details
export const updateUser = async (token: any, id: any, req: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: "Invalid Id" })
      );
    }

    let userData = await userModel.findOne({ _id: id, isDeleted: false });

    if (!userData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: "User not found" })
      );
    }

    let bodyData: any = req.body;

    if (req.files && req.files.length > 0) {
      let fileurl = await FileUpload.uploadFileToAWS(
        req.files[0],
        decoded.id,
        bodyData
      );
      bodyData.image = fileurl;
    }

    bodyData.updatedBy = decoded.id;

    let updatedUser = await userModel.findByIdAndUpdate(id, bodyData, {
      new: true,
    });

    return {
      responseCode: 200,
      responseMessage: "success",
      data: updatedUser,
    };
  } catch (error) {
    next(error);
  }
};