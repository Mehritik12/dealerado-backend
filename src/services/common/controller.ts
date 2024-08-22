import { HTTP400Error } from "../../utils/httpErrors";
import { Utilities } from "../../utils/Utilities";
import config from "config";
import { FileUpload } from "../../utils/FileUploadUtilities";
import { userModel } from "../../models/User";
var mongoose = require("mongoose");

export const fileUpload = async (  token: any,  req: any,  next: any) => {
  try {
    const decoded = await Utilities.getDecoded(token);
    const files = req.files;

    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file: any) => {
        return FileUpload.uploadFileToAWS(
          file,
          req.body.type || "profile",
          null
        );
      });

      const fileResponses: any = await Promise.all(uploadPromises);

      const imagesData = fileResponses.map((item: any) => ({
        url: item.Location.toString(),
        fileName: item.key,
      }));
      return Utilities.sendResponsData({
        code: 200,
        message: config.get("ERRORS.COMMON_ERRORS.SUCCESS_MESSAGE"),
        data: imagesData,
      });
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.COMMON_ERRORS.NO_FILE_UPLOADED"),
        })
      );
    }
  } catch (error) {
    next(error);
  }
};
