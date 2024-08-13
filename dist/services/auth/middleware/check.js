"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCommonAuthentication = exports.checkUserStatus = exports.checkChangeAdminPassword = exports.checkAdminSignup = exports.checkAdminAuthenticate = exports.checkAuthenticate = exports.checkResendOTP = exports.verifyCheck = exports.checkClientSignup = exports.checkSignup = exports.checkLogin = void 0;
const httpErrors_1 = require("../../../utils/httpErrors");
const joi_1 = __importDefault(require("joi"));
const config_1 = __importDefault(require("config"));
const Utilities_1 = require("../../../utils/Utilities");
const ErrorHandler_1 = require("../../../utils/ErrorHandler");
const checkLogin = (req, res, next) => {
    const schema = joi_1.default.object({
        countryCode: joi_1.default.string().trim().required().messages({
            "string.empty": "Phone number country code cannot be empty",
        }),
        mobileNumber: joi_1.default.string().trim().required().messages({
            "string.empty": "Phone number cannot be empty"
        }),
        fcmToken: joi_1.default.string().trim().optional()
        //   fcmToken: Joi.string().trim().required().messages({
        //       "string.empty": "Fcm token cannot be empty"
        //   })
    });
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        let messageArr = (0, ErrorHandler_1.errorMessageHander)(error.details);
        throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
            code: 400,
            message: messageArr[0],
        }));
    }
    else {
        req.body = value;
        next();
    }
};
exports.checkLogin = checkLogin;
const checkSignup = (req, res, next) => {
    const schema = joi_1.default.object({
        mobileNumber: joi_1.default.string().trim(true).optional(),
        countryCode: joi_1.default.string().trim().optional(),
        firstName: joi_1.default.string().trim().optional(),
        lastName: joi_1.default.string().trim().optional(),
        email: joi_1.default.string().trim().optional(),
        speciality: joi_1.default.array().optional(),
        country: joi_1.default.string().allow('').optional(),
        state: joi_1.default.string().allow('').optional(),
        city: joi_1.default.string().allow('').optional(),
        zipCode: joi_1.default.string().allow('').optional(),
        profilePicture: joi_1.default.string().allow('').optional(),
        gender: joi_1.default.string().allow('').trim().optional(),
        documents: joi_1.default.array().optional(),
        experience: joi_1.default.number().allow(0).optional(),
        bio: joi_1.default.string().allow('').optional(),
        wage: joi_1.default.number().allow(0).optional(),
        language: joi_1.default.array().allow('').optional(),
        coverImage: joi_1.default.array().allow('').optional(),
        expertise: joi_1.default.string().allow('').optional(),
    });
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        let messageArr = (0, ErrorHandler_1.errorMessageHander)(error.details);
        throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
            code: 400,
            message: messageArr[0],
        }));
    }
    else {
        req.body = value;
        next();
    }
};
exports.checkSignup = checkSignup;
const checkClientSignup = (req, res, next) => {
    const schema = joi_1.default.object({
        mobileNumber: joi_1.default.string().trim(true).optional(),
        firstName: joi_1.default.string().trim().allow('').optional(),
        lastName: joi_1.default.string().allow('').trim().optional(),
        email: joi_1.default.string().trim().optional(),
        dob: joi_1.default.string().allow('').optional(),
        gender: joi_1.default.string().allow('').trim().optional(),
        profilePicture: joi_1.default.string().allow('').optional()
    });
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        let messageArr = (0, ErrorHandler_1.errorMessageHander)(error.details);
        throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
            code: 400,
            message: messageArr[0],
        }));
    }
    else {
        req.body = value;
        next();
    }
};
exports.checkClientSignup = checkClientSignup;
const verifyCheck = (req, res, next) => {
    const schema = joi_1.default.object({
        countryCode: joi_1.default.string().trim().optional(),
        mobileNumber: joi_1.default.string().required().messages({
            "number.empty": "Mobile number cannot be empty"
        }),
        otp: joi_1.default.number().required().messages({
            "number.empty": "Otp cannot be empty"
        })
    });
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        let messageArr = (0, ErrorHandler_1.errorMessageHander)(error.details);
        throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
            code: 400,
            message: messageArr[0],
        }));
    }
    else {
        req.body = value;
        next();
    }
};
exports.verifyCheck = verifyCheck;
const checkResendOTP = (req, res, next) => {
    const schema = joi_1.default.object({
        countryCode: joi_1.default.string().trim().optional(),
        mobileNumber: joi_1.default.string().required().messages({
            "number.empty": "Mobile number cannot be empty"
        })
    });
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        let messageArr = (0, ErrorHandler_1.errorMessageHander)(error.details);
        throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
            code: 400,
            message: messageArr[0],
        }));
    }
    else {
        req.body = value;
        next();
    }
};
exports.checkResendOTP = checkResendOTP;
const checkAuthenticate = (req, res, next) => {
    const token = req.get(config_1.default.get("AUTHORIZATION"));
    Utilities_1.Utilities.verifyToken(token)
        .then((result) => {
        next();
    })
        .catch((error) => {
        res.status(403)
            .send({ responseCode: 401, responseMessage: error.message, data: {} });
    });
};
exports.checkAuthenticate = checkAuthenticate;
const checkAdminAuthenticate = (req, res, next) => {
    const token = req.get(config_1.default.get("AUTHORIZATION"));
    Utilities_1.Utilities.verifyAdminToken(token)
        .then((result) => {
        next();
    })
        .catch((error) => {
        res.status(403)
            .send({ responseCode: 403, responseMessage: error.message, data: {} });
    });
};
exports.checkAdminAuthenticate = checkAdminAuthenticate;
const checkAdminSignup = (req, res, next) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().trim(true).required().messages({
            'string.empty': 'Email can not be empty',
            'string.email': `Email should be a valid email`,
        }),
        password: joi_1.default.string().trim().required().messages({
            "string.empty": "Password number cannot be empty"
        }),
    });
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        let messageArr = (0, ErrorHandler_1.errorMessageHander)(error.details);
        throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
            code: 400,
            message: messageArr[0],
        }));
    }
    else {
        req.body = value;
        next();
    }
};
exports.checkAdminSignup = checkAdminSignup;
const checkChangeAdminPassword = (req, res, next) => {
    const schema = joi_1.default.object({
        oldPassword: joi_1.default.string()
            .trim(true)
            .min(8)
            .required()
            .messages({
            'string.empty': 'Password can not be empty',
            'string.min': 'Password must include atleast 8 characters',
        }),
        newPassword: joi_1.default.string()
            .trim(true)
            .min(8)
            .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
            .required()
            .messages({
            'string.empty': 'Cureent password can not be empty',
            'string.min': 'Current password must include atleast 8 characters',
            'string.pattern.base': 'Current password must include atleast 1 number and 1 special character',
        }),
    });
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        let messageArr = (0, ErrorHandler_1.errorMessageHander)(error.details);
        throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
            code: 400,
            message: messageArr[0],
        }));
    }
    else {
        req.body = value;
        next();
    }
};
exports.checkChangeAdminPassword = checkChangeAdminPassword;
const checkUserStatus = (req, res, next) => {
    const schema = joi_1.default.object({
        status: joi_1.default.boolean().required().messages({
            'boolean.empty': 'Status can not be empty',
        }),
    });
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        let messageArr = (0, ErrorHandler_1.errorMessageHander)(error.details);
        throw new httpErrors_1.HTTP400Error(Utilities_1.Utilities.sendResponsData({
            code: 400,
            message: messageArr[0],
        }));
    }
    else {
        req.body = value;
        next();
    }
};
exports.checkUserStatus = checkUserStatus;
const checkCommonAuthentication = (req, res, next) => {
    const token = req.get(config_1.default.get("AUTHORIZATION"));
    Utilities_1.Utilities.commonVerifyToken(token)
        .then((result) => {
        next();
    })
        .catch((error) => {
        res.status(403)
            .send({ responseCode: 403, responseMessage: error.message, data: {} });
    });
};
exports.checkCommonAuthentication = checkCommonAuthentication;
//# sourceMappingURL=check.js.map