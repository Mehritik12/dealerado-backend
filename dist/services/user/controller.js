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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.getUserDetails = exports.getUsers = exports.addUser = void 0;
const httpErrors_1 = require("../../utils/httpErrors");
const Utilities_1 = require("../../utils/Utilities");
const config_1 = __importDefault(require("config"));
const FileUploadUtilities_1 = require("../../utils/FileUploadUtilities");
const User_1 = require("../../models/User");
const constants_1 = require("../../constants");
var mongoose = require("mongoose");
const addUser = (token, req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        const { firstName, lastName, gender, dob, email, mobileNumber, profilePicture, role } = req.body;
        if (!constants_1.ADMIN_ROLES.includes(decoded === null || decoded === void 0 ? void 0 : decoded.role)) {
            throw new httpErrors_1.HTTP400Error({
                responseCode: 400,
                responseMessage: config_1.default.get("ERRORS.USER_ERRORS.INVALID_DESIGNATION"),
            });
        }
        let payload = {
            firstName,
            lastName,
            email,
            mobileNumber,
            dob,
            gender,
            isLogIn: true,
            isProfileUpdate: true,
            profilePicture: profilePicture || '',
        };
        let isExist = yield User_1.userModel.findOne({
            email,
            mobileNumber
        });
        if (!isExist) {
            if (req.files) {
                let fileurl = yield FileUploadUtilities_1.FileUpload.uploadFileToAWS(req.files[0], decoded.id, req.body);
                payload.image = fileurl;
            }
            payload.createdBy = decoded.id;
            payload.updatedBy = decoded.id;
            let result = yield User_1.userModel.create(payload);
            return { responseCode: 200, responseMessage: "success", data: result };
        }
        else {
            throw new httpErrors_1.HTTP400Error({
                responseCode: 400,
                responseMessage: "User exist"
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.addUser = addUser;
const getUsers = (token, body, next) => __awaiter(void 0, void 0, void 0, function* () {
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
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { mobileNumber: new RegExp(search, 'i') },
            ];
        }
        let totalRecords = yield User_1.userModel.countDocuments(query);
        let result = yield User_1.userModel
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
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
const getUserDetails = (token, id, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        if (mongoose.Types.ObjectId.isValid(id)) {
            const userData = yield User_1.userModel.findOne({ _id: id, isDeleted: false });
            if (!userData) {
                throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: "User not found" }));
            }
            return {
                responseCode: 200,
                responseMessage: "success",
                data: userData,
            };
        }
        else {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: "Invalid Id" }));
        }
    }
    catch (error) {
        next(error);
    }
    config_1.default.get("ROLES.ADMIN");
});
exports.getUserDetails = getUserDetails;
const deleteUser = (token, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        if (decoded.role !== constants_1.SUPER_ADMIN) {
            throw new httpErrors_1.HTTP400Error({
                responseCode: 400,
                responseMessage: config_1.default.get("ERRORS.USER_ERRORS.INVALID_DESIGNATION"),
            });
        }
        if (mongoose.Types.ObjectId.isValid(id)) {
            const userData = yield User_1.userModel.findOne({ _id: id, isDeleted: false });
            if (!userData) {
                throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: "User not found" }));
            }
            userData.isDeleted = true;
            yield userData.save();
            return {
                responseCode: 200,
                responseMessage: "success",
                data: userData,
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
exports.deleteUser = deleteUser;
// update user details
const updateUser = (token, id, req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: "Invalid Id" }));
        }
        let userData = yield User_1.userModel.findOne({ _id: id, isDeleted: false });
        if (!userData) {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: "User not found" }));
        }
        let bodyData = req.body;
        if (req.files && req.files.length > 0) {
            let fileurl = yield FileUploadUtilities_1.FileUpload.uploadFileToAWS(req.files[0], decoded.id, bodyData);
            bodyData.image = fileurl;
        }
        bodyData.updatedBy = decoded.id;
        let updatedUser = yield User_1.userModel.findByIdAndUpdate(id, bodyData, {
            new: true,
        });
        return {
            responseCode: 200,
            responseMessage: "success",
            data: updatedUser,
        };
    }
    catch (error) {
        next(error);
    }
});
exports.updateUser = updateUser;
//# sourceMappingURL=controller.js.map