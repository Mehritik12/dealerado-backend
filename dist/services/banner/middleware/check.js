"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const httpErrors_1 = require("../../../utils/httpErrors");
const joi_1 = __importDefault(require("joi"));
const Utilities_1 = require("../../../utils/Utilities");
const ErrorHandler_1 = require("../../../utils/ErrorHandler");
const validate = (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().trim(true).required().messages({
            "string.empty": "Name can not be empty",
        }),
        image: joi_1.default.string().trim(true).messages({
            "string.empty": "Image can not be empty",
        }),
        type: joi_1.default.required().messages({
            "string.empty": "Image can not be empty",
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
exports.validate = validate;
//# sourceMappingURL=check.js.map