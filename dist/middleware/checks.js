"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthenticate = exports.checkSearchParams = void 0;
const httpErrors_1 = require("../utils/httpErrors");
const config_1 = __importDefault(require("config"));
const Utilities_1 = require("../utils/Utilities");
const checkSearchParams = (req, res, next) => {
    if (!req.query.q) {
        throw new httpErrors_1.HTTP400Error("Missing q parameter");
    }
    else {
        next();
    }
};
exports.checkSearchParams = checkSearchParams;
const checkAuthenticate = (req, res, next) => {
    const token = req.get(config_1.default.get("AUTHORIZATION"));
    if (!token) {
        throw new httpErrors_1.HTTP400Error({ responseCode: 400, responseMessage: "Token required" });
    }
    return Utilities_1.Utilities.verifyToken(token)
        .then((result) => {
        next();
    })
        .catch((error) => {
        //console.log("error",error.message);
        throw new httpErrors_1.HTTP403Error({ responseCode: 403, responseMessage: error.message });
    });
};
exports.checkAuthenticate = checkAuthenticate;
//# sourceMappingURL=checks.js.map