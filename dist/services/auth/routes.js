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
const controller_1 = require("./controller");
const config_1 = __importDefault(require("config"));
const check_1 = require("./middleware/check");
const basePath = config_1.default.get("BASE_PATH");
const currentPath = "auth";
const currentPathURL = basePath;
console.log('currentPathURL---->', currentPathURL);
// const currentPathURL = basePath + currentPath;
exports.default = [
    // Login & Ragister 
    {
        path: currentPathURL + "login",
        method: "post",
        handler: [
            check_1.checkLogin,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.userLogin)(req.body, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "verifyLogin",
        method: "post",
        handler: [
            check_1.verifyCheck,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.verifyLogin)(req.body, next);
                res.status(200).send(result);
            }),
        ],
    },
    //  Resend Partner OTP
    {
        path: currentPathURL + "resendOTP",
        method: "post",
        handler: [
            check_1.checkResendOTP,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.resendOTP)(req.body, next);
                res.status(200).send(result);
            }),
        ],
    },
    // social login for google
    {
        path: currentPathURL + "socialLogin",
        method: "post",
        handler: [
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.socialLogin)(req, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "changeUserStatus" + "/:id",
        method: "put",
        handler: [
            check_1.checkAdminAuthenticate,
            check_1.checkUserStatus,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.userActiveStatus)(req.get(config_1.default.get("AUTHORIZATION")), req.params.id, req.body, next);
                res.status(200).send(result);
            }),
        ],
    },
    // create and update client profile
    {
        path: currentPathURL + "createClientAccount",
        method: "post",
        handler: [
            check_1.checkClientSignup,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.createClientAccount)(req.body, next);
                res.status(200).send(result);
            }),
        ],
    },
    // *********************Admin***************************************************************************************
    // **********************************************************************************************************************
    {
        path: currentPathURL + "registerAdmin",
        method: "post",
        handler: [
            // checkAdminSignup,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.adminSignUp)(next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "loginAdmin",
        method: "post",
        handler: [
            check_1.checkAdminSignup,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.adminLogin)(req.body, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "changePassword",
        method: "post",
        handler: [
            check_1.checkChangeAdminPassword,
            check_1.checkAdminAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.adminChangePassword)(req.get(config_1.default.get("AUTHORIZATION")), req.body, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + 'fileUpload',
        method: "post",
        handler: [
            check_1.checkCommonAuthentication,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.fileUpload)(req.get(config_1.default.get('AUTHORIZATION')), req, next);
                res.status(200).send(result);
            })
        ]
    },
    {
        path: currentPathURL + 'refreshToken',
        method: "get",
        handler: [
            // checkAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.refreshToken)(req.get(config_1.default.get('AUTHORIZATION')), next);
                res.status(200).send(result);
            })
        ]
    },
];
//# sourceMappingURL=routes.js.map