
import { bannerModel } from "../../models/Banner";

import {
  HTTP400Error,
  HTTP404Error,
  HTTP403Error,
} from "../../utils/httpErrors";
import { Utilities } from "../../utils/Utilities";
import config from "config";
import { FileUpload } from "../../utils/FileUploadUtilities";
var mongoose = require("mongoose");


export const addBanner = async (token: any, req: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    let bodyData: any;
    bodyData = req.body;
    // if (decoded.role !== config.get("ROLES.ADMIN")) {
    //   throw new HTTP400Error({
    //     responseCode: 400,
    //     responseMessage: config.get("ERRORS.USER_ERRORS.INVALID_DESIGNATION"),
    //   });
    // }

    let isExist: any = await bannerModel.findOne({
      name: bodyData.name,
      type: bodyData.type,
      isDeleted: false,
    });

    console.log("isExist", isExist);

    if (!isExist) {
      if (req.files) {
        let fileurl = await FileUpload.uploadFileToAWS(
          req.files[0],
          decoded.id,
          bodyData
        );
        bodyData.image = fileurl;
      }
      bodyData.createdBy = decoded.id;
      bodyData.updatedBy = decoded.id;
      let result = await bannerModel.create(bodyData);
      return { responseCode: 200, responseMessage: "success", data: result };
    } else {
      throw new HTTP400Error({
        responseCode: 400,
        responseMessage: "banner exist"
      });
    }
  } catch (error) {
    next(error)
  }
};

export const getBanners = async (token: any, body: any, next: any) => {
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
    if (mongoose.Types.ObjectId.isValid(id)) {
      const bannerData = await bannerModel.findOne({ _id: id, isDeleted: false });
      if (!bannerData) {
        throw new HTTP400Error(
          Utilities.sendResponsData({ code: 400, message: "Banner not found"})
        );
      }
      bannerData.isDeleted = true;
      await bannerData.save();
      return {
        responseCode: 200,
        responseMessage: "success",
        data: bannerData,
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

// update banner
export const updateBanner = async (token: any, id: any, req: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: "Invalid Id" })
      );
    }

    let bannerData = await bannerModel.findOne({ _id: id, isDeleted: false });

    if (!bannerData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({ code: 400, message: "Banner not found" })
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

    let updatedBanner = await bannerModel.findByIdAndUpdate(id, bodyData, {
      new: true,
    });

    return {
      responseCode: 200,
      responseMessage: "success",
      data: updatedBanner,
    };
  } catch (error) {
    next(error);
  }
};