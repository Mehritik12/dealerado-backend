"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.refreshToken = exports.fileUpload = exports.adminLogin = exports.createSuperAdminUser = exports.createClientAccount = exports.socialLogin = exports.resendOTP = exports.userActiveStatus = exports.verifyLogin = exports.userLogin = void 0;
const httpErrors_1 = require("../../utils/httpErrors");
const config_1 = __importDefault(require("config"));
const User_1 = require("../../db/User");
const Utilities_1 = require("../../utils/Utilities");
var mongoose = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
const { v4: uuidv4 } = require("uuid");
const FileUploadUtilities_1 = require("../../utils/FileUploadUtilities");
const admin = require("firebase-admin");
const saltRound = 10;
const Banner_1 = require("../../db/Banner");
// admin.initializeApp({
//   credential: admin.credential.cert(config.get("USER.FIREBASE.CREDENTIALS")),
//   databaseURL: config.get("USER.FIREBASE.DATABASE"),
// });
//  common api for login and ragister
const userLogin = (bodyData, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber } = bodyData;
        const user = yield User_1.userModel.findOne({
            mobileNumber: bodyData.mobileNumber,
            isDeleted: false,
        });
        // const otp = Math.floor(100000 + Math.random() * 900000);
        const otp = "2345";
        if (user) {
            user.otp = otp;
            user.fcmToken = bodyData.fcmToken;
            yield user.save();
            return Utilities_1.Utilities.sendResponsData({
                code: 200,
                message: config_1.default.get("ERRORS.COMMON_ERRORS.SEND_OTP_MOBILE"),
            });
        }
        else {
            bodyData.otp = otp;
            const userRes = yield User_1.userModel.create(bodyData);
            return Utilities_1.Utilities.sendResponsData({
                code: 200,
                message: config_1.default.get("ERRORS.COMMON_ERRORS.SEND_OTP_MOBILE"),
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.userLogin = userLogin;
const verifyLogin = (bodyData, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber, otp } = bodyData;
        const user = yield User_1.userModel.findOne({ mobileNumber: mobileNumber });
        if (user) {
            if ((user === null || user === void 0 ? void 0 : user.otp) != otp) {
                throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
                    code: 400,
                    message: config_1.default.get("ERRORS.COMMON_ERRORS.INVALID_OTP"),
                }));
            }
            const userToken = yield Utilities_1.Utilities.createJWTToken({
                id: user === null || user === void 0 ? void 0 : user._id,
                email: user.email ? user.email : "",
                mobile: user.mobileNumber,
                role: user.role,
                name: user.firstName ? user.firstName : "",
            });
            user.accessToken = userToken;
            user.otpVerified = true;
            if (user.isProfileUpdate == true) {
                user.isLogIn = true;
            }
            const res = yield user.save();
            let resObj = Object.assign({}, res);
            return Utilities_1.Utilities.sendResponsData({
                code: 200,
                message: user.isProfileUpdate == true
                    ? config_1.default.get("ERRORS.COMMON_ERRORS.LOGIN_SUCCESS")
                    : config_1.default.get("ERRORS.COMMON_ERRORS.VERIFY_SUCCESS"),
                data: resObj,
            });
        }
        else {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
                code: 400,
                message: config_1.default.get("ERRORS.NO_RECORD_FOUND"),
            }));
        }
    }
    catch (err) {
        next(err);
    }
});
exports.verifyLogin = verifyLogin;
const userActiveStatus = (token, id, bodyData, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        const { status } = bodyData;
        if (mongoose.Types.ObjectId.isValid(id)) {
            const userRes = yield User_1.userModel.findOne({ _id: id });
            if (!userRes) {
                throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: config_1.default.get('ERRORS.NO_RECORD_FOUND') }));
            }
            userRes.isActive = status;
            yield userRes.save();
            return Utilities_1.Utilities.sendResponsData({
                code: 200,
                message: config_1.default.get("ERRORS.COMMON_ERRORS.SUCCESS"),
                data: userRes
            });
        }
        else {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: config_1.default.get('ERRORS.INVALID_ID') }));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.userActiveStatus = userActiveStatus;
const resendOTP = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber } = req;
        const user = yield User_1.userModel.findOne({
            mobileNumber: mobileNumber,
            isDeleted: false,
        });
        const randomOTP = "2345";
        if (!user) {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
                code: 400,
                message: config_1.default.get("ERRORS.COMMON_ERRORS.USER_NOT_EXIST"),
            }));
        }
        else if (user) {
            user.otp = randomOTP;
            user.otpVerified = false;
            yield user.save();
            return Utilities_1.Utilities.sendResponsData({
                code: 200,
                message: config_1.default.get("ERRORS.COMMON_ERRORS.SEND_OTP_MOBILE"),
                data: { mobile: user.mobileNumber, otp: user.otp },
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.resendOTP = resendOTP;
const socialLogin = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var firstTimeLogin = false;
        var name;
        function doSomething() {
            return admin
                .app()
                .auth()
                .verifyIdToken(req.body.firebase_token)
                .then(function (decodedToken) {
                return __awaiter(this, void 0, void 0, function* () {
                    return decodedToken.uid;
                });
            });
        }
        let uid = yield doSomething();
        function doSomething1() {
            return admin
                .app()
                .auth()
                .getUser(uid)
                .then(function (userRecord) {
                return __awaiter(this, void 0, void 0, function* () {
                    return userRecord;
                });
            });
        }
        function doSomething2() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                let userRecord = yield doSomething1();
                name = userRecord === null || userRecord === void 0 ? void 0 : userRecord.displayName;
                let finalResult;
                var userInfo = {};
                userInfo = userInfo || {};
                var criteria = {};
                if (req.body.socialType == "google") {
                    criteria = {
                        "socialMediaLinks.google.id": userRecord === null || userRecord === void 0 ? void 0 : userRecord.uid,
                        isDeleted: false,
                    };
                }
                let userRes = yield User_1.userModel.findOne(criteria);
                if (!userRes) {
                    let user = {
                        name: userRecord === null || userRecord === void 0 ? void 0 : userRecord.displayName,
                        photo: userRecord === null || userRecord === void 0 ? void 0 : userRecord.photoURL,
                        socialMediaLinks: {
                            [(_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.social_type]: {
                                id: userRecord === null || userRecord === void 0 ? void 0 : userRecord.uid,
                                profilePic: userRecord === null || userRecord === void 0 ? void 0 : userRecord.photoURL,
                                displayName: userRecord === null || userRecord === void 0 ? void 0 : userRecord.displayName,
                                email: userRecord === null || userRecord === void 0 ? void 0 : userRecord.email,
                            },
                        },
                        email: userRecord === null || userRecord === void 0 ? void 0 : userRecord.email,
                        tokenKey: uuidv4() + (0, moment_1.default)().unix(),
                        uid: userRecord === null || userRecord === void 0 ? void 0 : userRecord.uid,
                    };
                    finalResult = yield User_1.userModel.create(user);
                    firstTimeLogin = true;
                }
                else {
                    userRes.email = userRecord === null || userRecord === void 0 ? void 0 : userRecord.email;
                    // userRes.tokenKey = uuidv4() + moment().unix();
                    finalResult = yield userRes.save();
                    firstTimeLogin = false;
                }
                const token = yield Utilities_1.Utilities.getUserToken(finalResult);
                finalResult.accessToken = token;
                finalResult.firstTimeLogin = false;
                return finalResult;
            });
        }
        let res = yield doSomething2();
        let obj = {
            name: res === null || res === void 0 ? void 0 : res.name,
            accessToken: res === null || res === void 0 ? void 0 : res.accessToken,
            firstTimeLogin: firstTimeLogin,
            photo: res === null || res === void 0 ? void 0 : res.socialMediaLinks.google.profilePic,
            id: res === null || res === void 0 ? void 0 : res._id,
            createdAt: res === null || res === void 0 ? void 0 : res.createdAt,
            updatedAt: res === null || res === void 0 ? void 0 : res.updatedAt,
        };
        return { responseCode: 200, responseMessage: "Success", data: obj };
    }
    catch (error) {
        next(error);
    }
});
exports.socialLogin = socialLogin;
const createClientAccount = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqData = req;
        const { email, mobileNumber } = reqData;
        const user = yield User_1.userModel.findOne({ mobileNumber: mobileNumber, isDeleted: false });
        if (user) {
            let obj = {
                firstName: req.firstName || "",
                lastName: req.lastName || "",
                email: req.email || "",
                mobileNumber: req.mobileNumber || "",
                dob: req.dob && req.dob,
                gender: req.gender || '',
                isLogIn: true,
                isProfileUpdate: true,
                profilePicture: req.profilePicture || ''
            };
            const token = yield Utilities_1.Utilities.createJWTToken({
                id: user === null || user === void 0 ? void 0 : user._id,
                email: user.email ? user.email : "",
                mobileNumber: user.mobileNumber,
                role: user.role,
            });
            obj["accessToken"] = token;
            let doc = yield User_1.userModel.updateOne({ mobileNumber: mobileNumber, isDeleted: false }, obj);
            return Utilities_1.Utilities.sendResponsData({
                code: 200,
                message: config_1.default.get("ERRORS.COMMON_ERRORS.SUCCESS"),
                data: obj,
            });
        }
        else {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
                code: 404,
                message: config_1.default.get("ERRORS.COMMON_ERRORS.USER_NOT_EXIST"),
            }));
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createClientAccount = createClientAccount;
//*****************admin controller************************************************************************************************************
//************************************************************************************************************************************************
const createSuperAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminData = {
            email: "admin@admin.com",
            password: "Qwarty@123",
            role: "sadmin",
            gender: "male"
        };
        const admin = yield User_1.userModel.find({ role: "sadmin" });
        if (!admin.length) {
            adminData.isProfileUpdate = true;
            adminData.image =
                "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png";
            adminData.firstName = "admin";
            adminData.userType = "admin";
            adminData.email = adminData.email;
            const pass = yield bcrypt.hash(adminData.password, saltRound);
            adminData.password = pass;
            yield User_1.userModel.create(adminData);
            console.log('super admin created.');
        }
    }
    catch (error) {
        console.log(`Super Admin Create Error: ${error}`);
    }
});
exports.createSuperAdminUser = createSuperAdminUser;
const adminLogin = (bodyData, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = bodyData;
        let admin = yield User_1.userModel.findOne({
            role: { $in: ['sadmin', 'admin'] },
            isDeleted: false,
            email: email,
        });
        if (!admin) {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
                code: 400,
                message: config_1.default.get("ERRORS.COMMON_ERRORS.USER_NOT_EXIST"),
            }));
        }
        const passwordMatch = yield bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
                code: 400,
                message: config_1.default.get("ERRORS.ADMIN.INVALID_CREDENTIAL"),
            }));
        }
        let adminToken = yield Utilities_1.Utilities.createJWTToken({
            id: admin._id,
            email: admin.email,
            name: admin.firstName || "",
            role: admin.role,
        });
        admin.accessToken = adminToken;
        yield admin.save();
        const result = JSON.parse(JSON.stringify(admin));
        return Utilities_1.Utilities.sendResponsData({
            code: 200,
            message: config_1.default.get("ERRORS.COMMON_ERRORS.LOGIN_SUCCESS"),
            data: Object.assign(Object.assign({}, result), { accessToken: adminToken })
        });
    }
    catch (error) {
        next(error);
    }
});
exports.adminLogin = adminLogin;
const fileUpload = (token, req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        let userRes = yield User_1.userModel.findOne({ _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false });
        let bannerRes = yield Banner_1.bannerModel.findOne({ _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false });
        if (userRes || bannerRes) {
            let bodyData = JSON.parse(JSON.stringify(req.body));
            const fileArr = [];
            for (const file of req.files) {
                fileArr.push(yield FileUploadUtilities_1.FileUpload.uploadFileToAWS(file, bodyData.type, null));
            }
            const imagesData = [];
            fileArr.forEach((item) => {
                imagesData.push({
                    "url": item.Location.toString(),
                    "fileName": item.key
                });
            });
            return Utilities_1.Utilities.sendResponsData({ code: 200, message: config_1.default.get('ERRORS.COMMON_ERRORS.SUCCESS_MESSAGE'), data: imagesData });
        }
        else {
            throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: config_1.default.get('ERRORS.USER_ERRORS.USER_NOT_EXIST') }));
        }
    }
    catch (error) {
        console.log("err", error);
        throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: error }));
    }
});
exports.fileUpload = fileUpload;
const refreshToken = (token, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield Utilities_1.Utilities.getDecoded(token);
        if (decoded) {
            let userRes = yield User_1.userModel.findOne({ _id: mongoose.Types.ObjectId(decoded === null || decoded === void 0 ? void 0 : decoded.id), isDeleted: false });
            if (userRes) {
                let res = userRes;
                let refreshToken = yield Utilities_1.Utilities.createJWTToken({
                    id: res === null || res === void 0 ? void 0 : res._id,
                    email: res.email ? res.email : "",
                    mobile: res.mobile,
                    role: res.role,
                });
                if (userRes) {
                    yield User_1.userModel.updateOne({ _id: mongoose.Types.ObjectId(decoded.id), isDeleted: false }, { accessToken: refreshToken });
                }
                return Utilities_1.Utilities.sendResponsData({
                    code: 200,
                    message: "Success",
                    data: { accessToken: refreshToken }
                });
            }
            else {
                Utilities_1.Utilities.sendResponsData({
                    code: 400,
                    message: config_1.default.get("ERRORS.COMMON_ERRORS.USER_NOT_EXIST"),
                });
            }
        }
    }
    catch (error) {
        console.log("err", error);
        throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({ code: 400, message: error }));
    }
});
exports.refreshToken = refreshToken;
//# sourceMappingURL=controller.js.map