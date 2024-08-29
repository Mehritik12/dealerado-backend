import { HTTP400Error } from "../../utils/httpErrors";
import { Utilities } from "../../utils/Utilities";
import config from "config";
import { FileUpload } from "../../utils/FileUploadUtilities";

import { servicedModel } from "../../models/Services";

export const addService = async (token: any, req: any, next: any) => {
  try {
    let bodyData: any;
    bodyData = req.body;

    if(bodyData.name){
    let slug = bodyData.name.replace(/\s+/g, '-')    
      bodyData.slug = slug
    }
    // if (req.files) {
    //   const file = req.files[0];
    //   const uploadedFile: any = await FileUpload.uploadFileToAWS(
    //     file,
    //     req.body.type || "profile",
    //     null
    //   );
    //   bodyData.image = uploadedFile.Location;
    // }

    let result = await servicedModel.create(bodyData);

    return { responseCode: 200, responseMessage: "success", data: result };
  } catch (error) {
    next(error);
  }
};

export const getServices = async (token: any, queryData: any, next: any) => {
  try {
    let query = { parentId: "" };
    let result = await servicedModel.find(query);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.SERVICES.FETCH"),
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubServices = async (token: any, queryData: any, next: any) => {
  try {
    let query = { parentId: { $ne: "" } };
    let result = await servicedModel.find(query);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.SERVICES.FETCH"),
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubServicesBySlug = async (req: any, next: any) => {
  try {
    let bodyData = req.body;
    let query = { slug: bodyData.slug };
    let result = await servicedModel.find(query);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.SERVICES.FETCH"),
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubServicesByparentId = async (serviceId: any,queryData:any, next: any) => {
  try {

    const page: number = parseInt(queryData.page) || 1;
    const limit: number = parseInt(queryData.limit) || 10;
    const skip: number = (page - 1) * limit;

    let query = { parentId:serviceId };

    let result = await servicedModel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    ;
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.SERVICES.FETCH"),
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


