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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.FileUploadUtilities = void 0;
const config_1 = __importDefault(require("config"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const AccountName = config_1.default.get('AZURE_STORAGE.ACCOUNT_NAME');
const AccountKey = config_1.default.get('AZURE_STORAGE.ACCOUNT_KEY');
const containerName = config_1.default.get('AZURE_STORAGE.CONTAINER_NAME');
const BUCKETURL = `https://${AccountName}.blob.core.windows.net/${containerName}/`;
const sharedKeyCredential = new StorageSharedKeyCredential(AccountName, AccountKey);
const blobServiceClient = new BlobServiceClient(`https://${AccountName}.blob.core.windows.net`, sharedKeyCredential);
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
class FileUploadUtilities {
}
exports.FileUploadUtilities = FileUploadUtilities;
/**
 * create container in azure
 * @param name - unique value describing user
 * @returns success
 */
FileUploadUtilities.createContainer = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const containerName = name;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const createContainerResponse = yield containerClient.create();
        console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId);
        return true;
    }
    catch (error) {
        console.log("azure error", error);
        return false;
    }
});
FileUploadUtilities.listContainer = () => __awaiter(void 0, void 0, void 0, function* () {
    let i = 1;
    let iter = blobServiceClient.listContainers();
    let containerItem = yield iter.next();
    while (!containerItem.done) {
        console.log(`Container ${i++}: ${containerItem.value.name}`);
        containerItem = yield iter.next();
    }
});
/**
 * Upload file to azure blob container
 * @param data
 */
FileUploadUtilities.uploadFileToAzure = (file, userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    // try {      
    //   let blobName;
    //   const containerClient = blobServiceClient.getContainerClient(`${containerName}`);
    //   const fileExt = path.extname(file.originalname);
    //   if(body.type === 'product'){
    //     blobName = `${userId}/product/${body.id}/${new Date().getTime()}${fileExt}`;
    //   }else{
    //     blobName = `${userId}/${new Date().getTime()}${fileExt}`;
    //   }      
    //   const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    //   const uploadBlobResponse = await blockBlobClient.uploadFile(file.path, { blobHTTPHeaders: { blobContentType: file.mimetype ? file.mimetype :'image/jpeg' } });
    //   console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    //   fs.unlinkSync(file.path);
    //   return `${blobName}`;
    // }
    // catch (error) {
    //   console.log("azure error", error);
    //   return '';
    // }
});
FileUploadUtilities.listFiles = (containerName) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let i = 1;
    let blobs = containerClient.listBlobsFlat();
    try {
        for (var blobs_1 = __asyncValues(blobs), blobs_1_1; blobs_1_1 = yield blobs_1.next(), !blobs_1_1.done;) {
            const blob = blobs_1_1.value;
            console.log(`Blob ${i++}: ${blob.name}`);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (blobs_1_1 && !blobs_1_1.done && (_a = blobs_1.return)) yield _a.call(blobs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
FileUploadUtilities.deleteFile = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(filename);
        const blobDeleteResponse = yield blockBlobClient.delete();
        return true;
    }
    catch (error) {
        console.log("azure error", error);
        return false;
    }
});
FileUploadUtilities.fileUploadHandler = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var imagePath;
        if (req.files && req.files.length > 0) {
            for (let loop = 0; loop < req.files.length; loop++) {
                if (req.files[loop].fieldname == 'image') {
                    imagePath = 'uploads/' + req.files[loop].filename;
                    let fileOriginalName = req.files[loop].originalname;
                    var filePath = './uploads/' + req.files[loop].filename;
                    var fileName = uuid_1.v4() + '-' + Date.now() + '.webp';
                    const convertedImgPath = './uploads/' + fileName;
                    sharp_1.default(req.files[loop].path)
                        .rotate()
                        .toFile(convertedImgPath, (err, info) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            fs_1.default.unlink(filePath, (err) => {
                                if (err)
                                    console.log(`error file upload`, err);
                            });
                            let data = {
                                url: `uploads/${fileName}`,
                                fileName: fileOriginalName,
                            };
                            return data;
                        }
                    });
                    let data = {
                        url: `uploads/${fileName}`,
                        fileName: fileOriginalName,
                    };
                    return data;
                }
                else if (req.files[loop].fieldname == 'coverImage') {
                    imagePath = 'uploads/' + req.files[loop].filename;
                }
                else if (req.files[loop].fieldname == 'doc') {
                    let fileName = req.files[loop].filename;
                    let fileOriginalName = req.files[loop].originalname;
                    let data = {
                        url: `uploads/${fileName}`,
                        fileName: fileOriginalName,
                    };
                    return data;
                }
            }
        }
    }
    catch (error) {
        return {
            responseCode: 200,
            responseMessage: error.message,
        };
    }
});
/*******************************************************************************
Configuration for MULTER (image upload).
*******************************************************************************/
// Multer Configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const path = "uploads/";
        fs_1.default.mkdirSync(path, { recursive: true });
        return cb(null, path);
    },
    filename: (req, file, cb) => {
        const ext = uuid_1.v4() + path_1.default.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});
const upload = multer_1.default({
    storage,
    limits: {
        fileSize: 2000000000
    }
});
exports.upload = upload;
//# sourceMappingURL=FileUploadUtilities copy.js.map