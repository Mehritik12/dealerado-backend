"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const utils_1 = require("./utils");
const middleware_1 = __importDefault(require("./middleware"));
const errorHandlers_1 = __importDefault(require("./middleware/errorHandlers"));
const services_1 = __importDefault(require("./services"));
const mongoose = require("mongoose");
const config_1 = __importDefault(require("config"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const defaultCreate_1 = require("./middleware/defaultCreate");
const router = (0, express_1.default)();
router.set('views', path_1.default.join(__dirname, 'views'));
router.set("view engine", "ejs");
const upload = (0, multer_1.default)({ dest: "temp/" });
router.use(upload.any());
(0, utils_1.applyMiddleware)(middleware_1.default, router);
(0, utils_1.applyRoutes)(services_1.default, router);
(0, utils_1.applyMiddleware)(errorHandlers_1.default, router);
(0, defaultCreate_1.defaultCreates)();
const PORT = process.env.PORT || 9000;
const server = http_1.default.createServer(router);
mongoose
    .connect(`${config_1.default.get("MONGO_CRED.MONGO_PATH")}/${process.env.DATABASE}`)
    .then(() => {
    server.listen(PORT);
    console.log(`Server is running http://localhost:${PORT}...`);
})
    .catch((err) => {
    console.log("inside error block");
    console.log(err);
});
//# sourceMappingURL=server.js.map