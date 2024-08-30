import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import * as AWS from "aws-sdk";
import path from "path";
require('dotenv').config()


const options: any = {
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT
};


const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    const path = "temp/";
    fs.mkdirSync(path, { recursive: true });
    return cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage
});


export class FileUpload {
  public static uploadFileToAWS = async (file: any, type: string, bookName: any) => {
    try {
      return new Promise((resolve, reject) => {
        const source = `temp/${file.filename}`;
        const fileContent = fs.readFileSync(source);
        AWS.config.update(options);
        const s3 = new AWS.S3({
          s3ForcePathStyle: true,
        });
        const fileExt = path.extname(file.originalname);
        let newName ;
        if (file.mimetype.indexOf('image/') > -1) {
          newName = `${file.originalname}.png`;
      } else {
          newName = `${file.originalname}${fileExt}`;
      }


        let s3Params = {
          ContentType: `${file.mimetype}`,
          Bucket: "dealerado",
          Body: fileContent,
          Key: `${type}/${file.originalname}`,
        };
        try {
          let data = s3.upload(s3Params).promise();
          resolve(data);
        } catch (err) {
          console.log("erroris", err);
        }
      });
    }
    catch (err) {
      console.log('value of error is', err)
    }
  }


  public static async delete(type: string, fileName: any) {
    AWS.config.update(options);
    const s3 = new AWS.S3();

    let oldFile: any;
    oldFile = fileName

    const params = {
      Bucket: `${process.env.BUCKET_NAME}`,
      Key: `${oldFile}`
      // Key: `${type}/${fileName}`
    };

    try {
      await s3.deleteObject(params).promise();
      return true;
    } catch (err) {
      return false;
    }
  }
}
