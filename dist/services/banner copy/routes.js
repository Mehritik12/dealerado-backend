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
const check_2 = require("../auth/middleware/check");
const basePath = config_1.default.get("BASE_PATH");
const currentPath = "banner";
const currentPathURL = basePath + currentPath;
exports.default = [
    {
        path: currentPathURL,
        method: "post",
        handler: [
            check_2.checkAdminAuthenticate,
            check_1.validate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.addBanner)(req.get(config_1.default.get("AUTHORIZATION")), req, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL,
        method: "get",
        handler: [
            check_2.checkAdminAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.getBanners)(req.get(config_1.default.get("AUTHORIZATION")), req.query, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "/:id",
        method: "get",
        handler: [
            check_2.checkAdminAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.getBannerDetails)(req.get(config_1.default.get("AUTHORIZATION")), req.params.id, next);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "/:id",
        method: "delete",
        handler: [
            check_2.checkAdminAuthenticate,
            (req, res) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.deleteBanner)(req.get(config_1.default.get("AUTHORIZATION")), req.params.id);
                res.status(200).send(result);
            }),
        ],
    },
    {
        path: currentPathURL + "/:id",
        method: "put",
        handler: [
            check_2.checkAdminAuthenticate,
            (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield (0, controller_1.updateBanner)(req.get(config_1.default.get("AUTHORIZATION")), req.params.id, req, next);
                res.status(200).send(result);
            }),
        ],
    },
];
//# sourceMappingURL=routes.js.map