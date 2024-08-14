"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBanner = exports.deleteBanner = exports.getBannerDetails = exports.getBanners = exports.addBanner = void 0;
const Banner_1 = require("../../db/Banner");
const httpErrors_1 = require("../../utils/httpErrors");
const Utilities_1 = require("../../utils/Utilities");
const FileUploadUtilities_1 = require("../../utils/FileUploadUtilities");
var mongoose = require("mongoose");
const addBanner = (token, req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        let bodyData;
        bodyData = req.body;
        // if (decoded.role !== config.get("ROLES.ADMIN")) {
        //   throw new HTTP400Error({
        //     responseCode: 400,
        //     responseMessage: config.get("ERRORS.USER_ERRORS.INVALID_DESIGNATION"),
        //   });
        // }
        let isExist = yield Banner_1.bannerModel.findOne({
            name: bodyData.name,
            type: bodyData.type,
            isDeleted: false,
        });
        console.log("isExist", isExist);
        if (!isExist) {
            if (req.files) {
                let fileurl = yield FileUploadUtilities_1.FileUpload.uploadFileToAWS(req.files[0], decoded.id, bodyData);
                bodyData.image = fileurl;
            }
            bodyData.createdBy = decoded.id;
            bodyData.updatedBy = decoded.id;
            let result = yield Banner_1.bannerModel.create(bodyData);
            return { responseCode: 200, responseMessage: "success", data: result };
        }
        else {
            throw new httpErrors_1.HTTP400Error({
                responseCode: 400,
                responseMessage: "banner exist"
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.addBanner = addBanner;
const getBanners = (token, body, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        let skip = body.skip || 0;
        let limit = body.limit || 10;
        let search = body.search;
        let query = {
            isDeleted: false
        };
        if (search) {
            query["$or"] = [
                { name: new RegExp(search, 'i') },
                { type: new RegExp(search, 'i') },
            ];
        }
        let totalRecords = yield Banner_1.bannerModel.find(query);
        let result = yield Banner_1.bannerModel
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
    }
    catch (error) {
        next(error);
    }
});
exports.getBanners = getBanners;
const getBannerDetails = (token, id, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        if (mongoose.Types.ObjectId.isValid(id)) {
            const bannerData = yield Banner_1.bannerModel.findOne({ _id: id, isDeleted: false });
            if (!bannerData) {
                throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: "Banner not found" }));
            }
            return {
                responseCode: 200,
                responseMessage: "success",
                data: bannerData,
            };
        }
        else {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: "Invalid Id" }));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getBannerDetails = getBannerDetails;
const deleteBanner = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        if (mongoose.Types.ObjectId.isValid(id)) {
            const bannerData = yield Banner_1.bannerModel.findOne({ _id: id, isDeleted: false });
            if (!bannerData) {
                throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: "Banner not found" }));
            }
            bannerData.isDeleted = true;
            yield bannerData.save();
            return {
                responseCode: 200,
                responseMessage: "success",
                data: bannerData,
            };
        }
        else {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: "Invalid Id" }));
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteBanner = deleteBanner;
// update banner
const updateBanner = (token, id, req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: "Invalid Id" }));
        }
        let bannerData = yield Banner_1.bannerModel.findOne({ _id: id, isDeleted: false });
        if (!bannerData) {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: "Banner not found" }));
        }
        let bodyData = req.body;
        if (req.files && req.files.length > 0) {
            let fileurl = yield FileUploadUtilities_1.FileUpload.uploadFileToAWS(req.files[0], decoded.id, bodyData);
            bodyData.image = fileurl;
        }
        bodyData.updatedBy = decoded.id;
        let updatedBanner = yield Banner_1.bannerModel.findByIdAndUpdate(id, bodyData, {
            new: true,
        });
        return {
            responseCode: 200,
            responseMessage: "success",
            data: updatedBanner,
        };
    }
    catch (error) {
        next(error);
    }
});
exports.updateBanner = updateBanner;
//# sourceMappingURL=controller.js.map