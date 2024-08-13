import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import routes from "./services";
import mongoose = require("mongoose");
import config from "config";
import multer from "multer";
import path from "path";
import 'dotenv/config';

const router = express();

router.set('views', path.join(__dirname, 'views'));
router.set("view engine", "ejs");

const upload: any = multer({ dest: "temp/" });
router.use(upload.any());

applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);

const PORT = process.env.PORT || 9000;
const server = http.createServer(router);

mongoose
  .connect(`${config.get("MONGO_CRED.MONGO_PATH")}/${process.env.DATABASE}`)
  .then(() => {
    server.listen(PORT);
    console.log(`Server is running http://localhost:${PORT}...`);
  })
  .catch((err) => {
    console.log("inside error block");
    console.log(err);
  });
