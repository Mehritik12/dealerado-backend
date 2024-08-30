import { HTTP400Error } from "../../utils/httpErrors";
import { Utilities } from "../../utils/Utilities";
import config from "config";
import { FileUpload } from "../../utils/FileUploadUtilities";

import { servicedModel } from "../../models/Services";
import mongoose from "mongoose";
import { PERMISSION_TYPE } from "../../constants";

export const addService = async (token: any, req: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    let bodyData: any;
    bodyData = req.body;

    const isNameExist = await servicedModel.findOne({ name: bodyData.name, isDeleted: false });
    if(isNameExist){
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.SERVICES.EXIST"),
        })
      );
    }

    if (bodyData.name) {
      let slug = bodyData.name.replace(/\s+/g, '-')
      bodyData.slug = slug
    }
    if (req.files && req.files.length >0) {
      const file = req.files[0];
      const uploadedFile: any = await FileUpload.uploadFileToAWS(
        file,
        req.body.type || "services",
        null
      );
      bodyData.createdBy = decoded.id;
      bodyData.image = uploadedFile.Location;
    }

    let result = await servicedModel.create(bodyData);
    return { responseCode: 200, responseMessage: "success", data: result };
  } catch (error) {
    next(error);
  }
};

export const getServices = async (token: any, queryData: any, next: any) => {
  try {
    let query = { parentId: "" ,isDeleted: false};
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
    let query = { parentId: { $ne: "" }, isDeleted: false };
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

export const getSubServicesByparentId = async (serviceId: any, queryData: any, next: any) => {
  try {

    const page: number = parseInt(queryData.page) || 1;
    const limit: number = parseInt(queryData.limit) || 10;
    const skip: number = (page - 1) * limit;

    let query = { parentId: serviceId,isDeleted:false };

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

export const deleteService = async (token: any, serviceId: any, next: any) => {
  try {

    console.log(serviceId,"serviceId")
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.INVALID_ID"),
        })
      );
    }

    let serviceData = await servicedModel.findOne({ _id: serviceId, isDeleted: false });

    if (!serviceData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.NO_RECORD_FOUND"),
        })
      );
    }

    // const isPermission = await Utilities.permissionCheck(decoded.id, PERMISSION_TYPE.DELETE_USER )

    serviceData.isDeleted = true;
    serviceData.updatedBy= decoded.id;
    await serviceData.save();

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.SERVICES.DELETE"),
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (token: any, serviceId: any,req:any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const bodyData = req.body;

    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.INVALID_ID"),
        })
      );
    }

    let serviceData = await servicedModel.findOne({ _id: serviceId, isDeleted: false });

    if (!serviceData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.NO_RECORD_FOUND"),
        })
      );
    }
    if (bodyData.name) {
      let slug = bodyData.name.replace(/\s+/g, '-')
      bodyData.slug = slug
    }

    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      const uploadedFile: any = await FileUpload.uploadFileToAWS(
        file,
        req.body.type || "services",
        null
      );
      bodyData.image = uploadedFile.Location;
    }
    // const isPermission = await Utilities.permissionCheck(decoded.id, PERMISSION_TYPE.DELETE_USER )
    serviceData.name= bodyData.name ||serviceData.name ;
    serviceData.description= bodyData.description || serviceData.description ;
    if(bodyData.price){
      serviceData.price= bodyData.price || serviceData.price ;
    }
    serviceData.updatedBy= decoded.id;
    await serviceData.save();

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.SERVICES.UPDATE"),
    });
  } catch (error) {
    next(error);
  }
};

