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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utilities = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const bcrypt = __importStar(require("bcrypt"));
const User_1 = require("../db/User");
const Admin_1 = require("../db/Admin");
class Utilities {
    /**
     * Return response in custom format
     * @param response
     */
    static sendResponsData(response) {
        let result = {
            responseCode: response.code,
            responseMessage: response.message,
        };
        if (response.data) {
            result.data = response.data;
        }
        if (response.totalRecord) {
            result.totalRecord = response.totalRecord;
        }
        return result;
    }
    /**
     * Generate alphanumer random string of given length
     * @param length
     */
    static genAlphaNumericCode(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    /**
     *
     * @param length of otp we want to generate
     * @returns numeric code for specified length
     */
    static genNumericCode(length) {
        let min = Math.pow(10, length - 1);
        let max = (Math.pow(10, length) - Math.pow(10, length - 1) - 1);
        return Math.floor(min + Math.random() * max);
    }
    static getUserToken(user) {
        var claims = {
            id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            role: user.role,
            session: user.tokenKey,
            uid: user.uid,
        };
        return jsonwebtoken_1.default.sign(claims, config_1.default.get("JWT_SECRET_KEY") || '', {
            expiresIn: parseInt(config_1.default.get("SOCIAL_TOKEN_PERIOD"))
        });
    }
}
exports.Utilities = Utilities;
_a = Utilities;
/**
 * Generate encrypted password
 * @param {string} password
 */
Utilities.cryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        return bcrypt.hash(password, config_1.default.get("SALT"), (err, hash) => {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(hash);
            }
        });
    });
});
/**
 * Verify password
 * @param {string} password
 */
Utilities.VerifyPassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        return bcrypt.compare(password, hash, (error, result) => {
            if (error) {
                return reject(error);
            }
            else {
                return resolve(result);
            }
        });
    });
});
/**
 * Create jwt token
 * @param {object} payload
 * @param {string} token - return token
 */
Utilities.createJWTToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.sign(payload, config_1.default.get("JWT_SECRET_KEY") || '', { expiresIn: '24h' });
});
/**
 * Verify token is valid or not
 * @param {string} token
 */
Utilities.verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.verify(token, config_1.default.get("JWT_SECRET_KEY"), function (error, result) {
            return __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return reject(error);
                }
                else {
                    let userRes = yield User_1.userModel.findOne({ accessToken: token });
                    if (userRes) {
                        return resolve(result);
                    }
                    else {
                        return reject({ message: "Invalid Token" });
                    }
                }
            });
        });
    });
});
Utilities.verifyAdminToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.verify(token, config_1.default.get("JWT_SECRET_KEY"), function (error, result) {
            return __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return reject(error);
                }
                else {
                    let adminRes = yield Admin_1.adminModel.findOne({ accessToken: token });
                    if (adminRes) {
                        return resolve(result);
                    }
                    else {
                        return reject({ message: "Invalid Token" });
                    }
                }
            });
        });
    });
});
Utilities.commonVerifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.verify(token, config_1.default.get("JWT_SECRET_KEY"), function (error, result) {
            return __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    return reject(error);
                }
                else {
                    let adminRes = yield Admin_1.adminModel.findOne({ accessToken: token });
                    let userRes = yield User_1.userModel.findOne({ accessToken: token });
                    if (adminRes || userRes) {
                        return resolve(result);
                    }
                    else {
                        return reject({ message: "Invalid Token" });
                    }
                }
            });
        });
    });
});
/**
 * decoded jwt token
 * @param token string
 */
Utilities.getDecoded = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.decode(token);
});
/**
 * check Super admin or sub admin
 * @param token string
 */
Utilities.isAdmin = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = yield _a.getDecoded(token);
    if (decoded.user_type === "Super-Admin" ||
        decoded.user_type === "Sub-Admin")
        return true;
    return false;
});
//# sourceMappingURL=Utilities.js.map