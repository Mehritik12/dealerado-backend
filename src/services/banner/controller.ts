
import { bannerModel } from "../../models/Banner";

import {
  HTTP400Error,
  HTTP404Error,
  HTTP403Error,
} from "../../utils/httpErrors";
import { Utilities } from "../../utils/Utilities";
import config from "config";
import { FileUpload } from "../../utils/FileUploadUtilities";
import { PERMISSION_TYPE } from "../../constants";
var mongoose = require("mongoose");


export const addBanner = async (token: any, req: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);

    let bodyData: any = req.body;

    if (decoded.role == 'users') {
      throw new HTTP400Error({
        responseCode: 400,
        responseMessage: config.get("ERRORS.USER_ERRORS.INVALID_DESIGNATION"),
      });
    }

    let isBannerExist = await bannerModel.findOne({ name: bodyData.name, isDeleted: false });
    if (isBannerExist) {
      throw new HTTP400Error({
        responseCode: 400,
        responseMessage: config.get("ERRORS.BANNER.EXIST"),
      });
    }

    if (req.files && req.files.length >0) {
      const file = req.files[0];
      const uploadedFile: any = await FileUpload.uploadFileToAWS(
        file,
        req.body.type || "banners",
        null
      );
      bodyData.image = uploadedFile.Location;
    }

    bodyData.createdBy = decoded.id;
    let result = await bannerModel.create(bodyData);
    return { responseCode: 200,  responseMessage: config.get("ERRORS.BANNER.CREATE"), data: result };

  } catch (error) {
    next(error);
  }
};


export const getBanners = async (token: any, body: any, next: any) => {
  try {
    // const decoded: any = await Utilities.getDecoded(token);

    let skip = body.skip || 0;
    let limit = body.limit || 10;

    let search = body.search;
    let query: any = {
      isDeleted: false
    };
    if (search) {
      query["$or"] = [
        { name: new RegExp(search, 'i') },
        { type: new RegExp(search, 'i') },
      ];
    }
    let totalRecords = await bannerModel.find(query)
    let result = await bannerModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    return {
      responseCode: 200,
      responseMessage: "success",
      data: result,
      totalRecord: totalRecords.length,
    };
  } catch (error) {
    next(error)
  }
};

export const getBannerDetails = async (token: any, id: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (mongoose.Types.ObjectId.isValid(id)) {
      const bannerData = await bannerModel.findOne({ _id: id, isDeleted: false });
      if (!bannerData) {
        throw new HTTP400Error(
          Utilities.sendResponsData({ code: 400, message: "Banner not found" })
        );
      }
      return {
        responseCode: 200,
        responseMessage: "success",
        data: bannerData,
      };
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: "Invalid Id" })
      );
    }
  } catch (error) {
    next(error)
  }
};

export const deleteBanner = async (token: any, id: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    // const isPermission = await Utilities.permissionCheck(decoded.id, PERMISSION_TYPE.DELETE_BANNER)

    if (mongoose.Types.ObjectId.isValid(id)) {
      const bannerData = await bannerModel.findOne({ _id: id, isDeleted: false });
      if (!bannerData) {
        throw new HTTP400Error(
          Utilities.sendResponsData({ code: 400, message: config.get("ERRORS.NO_RECORD_FOUND") })
        );
      }
      bannerData.isDeleted = true;
      await bannerData.save();
      return {
        responseCode: 200,
        responseMessage:config.get("ERRORS.BANNER.DELETE"),
      };
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: config.get("ERRORS.INVALID_ID") })
      );
    }
  } catch (error) {
    console.log(error);
  }
};
// update banner
export const updateBanner = async (token: any, id: any, req: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    // const isPermission = await Utilities.permissionCheck(decoded.id, PERMISSION_TYPE.DELETE_USER)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: config.get("ERRORS.INVALID_ID") })
      );
    }
    let bannerData = await bannerModel.findOne({ _id: id, isDeleted: false });
    if (!bannerData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: config.get("ERRORS.NO_RECORD_FOUND") })
      );
    }

    let bodyData: any = req.body;
    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      const uploadedFile: any = await FileUpload.uploadFileToAWS(
        file,
        req.body.type || "services",
        null
      );
      bodyData.image = uploadedFile.Location;
    }
    bodyData.updatedBy = decoded.id;
    let updatedBanner = await bannerModel.findByIdAndUpdate(id, bodyData, {
      new: true,
    });

    return {
      responseCode: 200,
      responseMessage: config.get("ERRORS.BANNER.UPDATE"),
      data: updatedBanner,
    };
  } catch (error) {
    next(error);
  }
};