import { HTTP400Error } from "../../utils/httpErrors";
import { Utilities } from "../../utils/Utilities";
import config from "config";
import { FileUpload } from "../../utils/FileUploadUtilities";
import { userModel } from "../../models/User";
import { PermissionModel } from "../../models/Permission";
import { DEFAULT_PERMISSION } from "../../constants/permission";
import { transactionModel } from "../../models/Transaction";
var mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const saltRound = 10;
import { PERMISSION_TYPE } from "../../constants";

export const addUser = async (token: any, req: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const isPermission = await Utilities.permissionCheck(decoded.id, PERMISSION_TYPE.CREATE_USER )

    let bodyData: any;
    bodyData = req.body;
    let role: any = bodyData?.role || 'user';

    const isMobileExist = await userModel.findOne({
      mobileNumber: bodyData.mobileNumber || "",
      isDeleted: false
    });

    if (isMobileExist) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.MOBILE_EXIST"),
        })
      );
    }

    const isEmailExist = await userModel.findOne({
      email: bodyData.email || "",
      isDeleted: false,
    });

    if (isEmailExist) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.EMAIL_EXIST"),
        })
      );
    }
    bodyData.createdBy = decoded.id;
    bodyData.updatedBy = decoded.id;
    let hashedPassword = await Utilities.cryptPassword(bodyData.password);
    bodyData.password = hashedPassword;
    let result = await userModel.create(bodyData);
    let defaultPermissions = DEFAULT_PERMISSION[role];
    let permission = await PermissionModel.create({ userId: result._id?.toString(), ...defaultPermissions })

    await userModel.updateOne({ _id: result?._id }, { permissions: permission._id?.toString() })
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.CREATE"),
      data: result,
    });

  } catch (error) {
    next(error)
  }
}

export const getUsers = async (token: any, queryData: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const page: number = parseInt(queryData.page) || 1;
    const limit: number = parseInt(queryData.limit) || 10;
    const role = queryData.role || 'user';

    const skip: number = (page - 1) * limit;

    const isPermission = await Utilities.permissionCheck(decoded.id, PERMISSION_TYPE.READ_USER )

    let search = queryData.search;
    let query: any = {
      isDeleted: false,
      role: role,
    };
    if (search) {
      query["$or"] = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { mobileNumber: new RegExp(search, "i") },
      ];
    }
    let totalRecords = await userModel.countDocuments(query);
    let result = await userModel
      .find(query)
      .populate('permissions')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.FETCH"),
      data: result,
      totalRecord: totalRecords
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (token: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }
    if (mongoose.Types.ObjectId.isValid(decoded.id)) {
      const userData:any = await userModel.findOne({
        _id: decoded.id,
        isDeleted: false,
      });
      if (!userData) {
        throw new HTTP400Error(
          Utilities.sendResponsData({
            code: 400,
            message: config.get("ERRORS.NO_RECORD_FOUND"),
          })
        );
      }
      const userPermission = await PermissionModel.findOne({userId:new mongoose.Types.ObjectId(decoded.id)});
      userData.permissions = userPermission;

      return Utilities.sendResponsData({
        code: 200,
        message: config.get("ERRORS.USER_ERRORS.FETCH"),
        data: userData,
      });
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.INVALID_ID"),
        })
      );
    }
  } catch (error) {
    next(error);
  }
};

// update profile by user
export const updateUser = async (token: any, req: any, next: any) => {
  try {
    const bodyData = req.body;
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.INVALID_ID"),
        })
      );
    }

    let userData = await userModel.findOne({
      _id: decoded.id,
      isDeleted: false,
    });

    if (!userData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.NO_RECORD_FOUND"),
        })
      );
    }

    const isMobileExist = await userModel.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(decoded.id) },
      mobileNumber: bodyData.mobileNumber,
    });

    if (isMobileExist) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.MOBILE_EXIST"),
        })
      );
    }

    const isEmailExist = await userModel.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(decoded.id) },
      email: bodyData.email,
    });

    if (isEmailExist) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.EMAIL_EXIST"),
        })
      );
    }

    userData.dealershipName = bodyData.businessName || userData.dealershipName;
    userData.email = bodyData.email || userData.email;
    userData.mobileNumber = bodyData.mobileNumber || userData.mobileNumber;
    userData.name = bodyData.name || userData.name;
    userData.profilePicture = bodyData.profilePicture || userData.profilePicture;

    // if (req.files) {
    //   const file = req.files;
    //   const uploadedFile: any = await FileUpload.uploadFileToAWS(
    //     file,
    //     req.body.type || "profile",
    //     null
    //   );
    //   console.log(uploadedFile)
    //   userData.profilePicture = uploadedFile.Location;
    // }

    await userData.save();

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.UPDATE"),
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (token: any, userId: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.INVALID_ID"),
        })
      );
    }

    let userData = await userModel.findOne({ _id: userId, isDeleted: false });

    if (!userData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.NO_RECORD_FOUND"),
        })
      );
    }

    const isPermission = await Utilities.permissionCheck(decoded.id, PERMISSION_TYPE.DELETE_USER )

    userData.isDeleted = true;
    await userData.save();

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.DELETE"),
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (token: any, bodyData: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }
    let userRes: any = await userModel.findOne({
      _id: new mongoose.Types.ObjectId(decoded.id),
      isDeleted: false,
    });

    if (userRes) {
      const isMatched = await bcrypt.compare(bodyData.password, userRes.password)
      if (isMatched) {
        let hashedPassword = await Utilities.cryptPassword(bodyData.password);
        userRes.password = hashedPassword;
        userRes.save();
        return Utilities.sendResponsData({
          code: 200,
          message: config.get("ERRORS.USER_ERRORS.PASSWORD_UPDATED"),
        });
      } else {
        throw new HTTP400Error(
          Utilities.sendResponsData({
            code: 400,
            message: config.get("ERRORS.USER_ERRORS.PASSWORD_INVALID"),
          })
        );
      }
    } else {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.USER_NOT_EXIST"),
        })
      );
    }
  } catch (error) {
    next(error);
  }
};

export const userProfileUpdateByAdmin = async (token: any, userId: any, req: any, next: any) => {
  try {
    const bodyData = req.body;
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }

    // check Permission for admin
    const isPermission = await Utilities.permissionCheck(decoded.id, PERMISSION_TYPE.UDPATE_USER )
     
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.INVALID_ID"),
        })
      );
    }

    let userData = await userModel.findOne({ _id: userId, isDeleted: false, });

    if (!userData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.NO_RECORD_FOUND"),
        })
      );
    }

    const isMobileExist = await userModel.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(userId) },
      mobileNumber: bodyData.mobileNumber || "",
    });

    if (isMobileExist) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.MOBILE_EXIST"),
        })
      );
    }

    const isEmailExist = await userModel.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(userId) },
      email: bodyData.email || "",
    });

    if (isEmailExist) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.USER_ERRORS.EMAIL_EXIST"),
        })
      );
    }
    userData.dealershipName = bodyData.businessName ?? userData.dealershipName;
    userData.email = bodyData.email ?? userData.email;
    userData.mobileNumber = bodyData.mobileNumber ?? userData.mobileNumber;
    userData.name = bodyData.name ?? userData.name;
    userData.profilePicture = bodyData.profilePicture ?? userData.profilePicture;
    userData.isKyc = typeof bodyData.isKyc !== 'undefined' ? bodyData.isKyc : userData.isKyc;
    userData.updatedBy = decoded.id ?? userData.updatedBy;
    
    await userData.save();
    // if (req.files) {
    //   const file = req.files;
    //   const uploadedFile: any = await FileUpload.uploadFileToAWS(
    //     file,
    //     req.body.type || "profile",
    //     null
    //   );
    //   console.log(uploadedFile)
    //   userData.profilePicture = uploadedFile.Location;
    // }


    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.UPDATE")
    });
  } catch (error) {
    next(error);
  }
};

export const adminPermissionUpdateBySuperAdmin = async (token: any, userId: any, bodyData: any, next: any) => {
  try {
    const permissions= bodyData;
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }

    let userData = await userModel.findOne({ _id: userId, isDeleted: false, });

    if (!userData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.NO_RECORD_FOUND"),
        })
      );
    }
    if (permissions) {
      await PermissionModel.findOneAndUpdate({ userId },
        {
          $set: { ...permissions }
        },
        {
          returnNewDocument: true
        })
    }

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.UPDATE")
    });
  } catch (error) {
    next(error);
  }
};

export const addMoneyToUserAccount = async (token: any, bodyData: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({ code: 400, message: config.get("ERRORS.TOKEN_REQUIRED") });
    }
    if (!mongoose.Types.ObjectId.isValid(bodyData.userId)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.INVALID_ID"),
        })
      );
    }

    let userData = await userModel.findOne({ _id: bodyData.userId, isDeleted: false, });

    if (!userData) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.NO_RECORD_FOUND"),
        })
      );
    }
    bodyData.createdBy = decoded.id;
    const userTrasaction = await transactionModel.create(bodyData);
    
    return Utilities.sendResponsData({
      code: 200,
      message: bodyData.type == config.get("ERRORS.TRANSACTION.TYPE.DEBIT")
        ? `${bodyData.amount} ${config.get("ERRORS.TRANSACTION.DEDUCTED")}` :
        `${config.get("ERRORS.TRANSACTION.CREATED")} ${bodyData.amount}`
    });
  } catch (error) {
    next(error);
  }
};

// To admin
export const getAllUserTransactions = async (token: any, userId: any, queryData: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({ code: 400, message: config.get("ERRORS.TOKEN_REQUIRED") });
    }

    const page: number = parseInt(queryData.page) || 1;
    const limit: number = parseInt(queryData.limit) || 10;
    const skip: number = (page - 1) * limit;
    const search: string = queryData.search || "";

    let query: any = [
      { userId: new mongoose.Types.ObjectId(userId) }
    ];

    const aggregateQuery: any = [
      {
        $match: { $and: query }
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }
          ],
          as: 'user'
        }
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: 'users',
          let: { createdBy: "$createdBy" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$createdBy"] } } } // Correcting the match condition
          ],
          as: 'admin'
        }
      },
      { $unwind: "$admin" },
      {
        $project: {
          _id: 1,
          amount: 1,
          type: 1,
          transactionType:1,
          createdAt: 1,
          updatedAt: 1,
          description:1,
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            mobileNumber: "$user.mobileNumber",
            profilePicture: "$user.profilePicture"
          },
          createdBy: {
            _id: "$admin._id",
            name: "$admin.name",
            email: "$admin.email",
            mobileNumber: "$admin.mobileNumber",
            profilePicture: "$admin.profilePicture",
            role: "$admin.role"
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ];

    const transactionRes = await transactionModel.aggregate(aggregateQuery);
    const totalCount = await transactionModel.countDocuments({ $and: query })

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.TRANSACTION.FETCHED"),
      data: transactionRes,
      totalRecord: totalCount
    });

  } catch (error) {
    next(error);
  }
};

// get my wallet balance at user end
export const getUserWallet = async (token: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const aggregateQuery: any  =[
      {
        $match: {
          userId: new mongoose.Types.ObjectId(decoded.id)
        }
      },
      {
        $group: {
          _id: "$userId",
          wallet: {
            $sum: {
              $cond: {
                if: { $or: [{ $eq: ["$type", "CREDIT"] }, { $eq: ["$type", "REFUND"] }] },
                then: "$amount",
                else: { $multiply: ["$amount", -1] }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id", 
          foreignField: "_id", 
          as: "userInfo" 
        }
      },
      {
        $unwind: "$userInfo" 
      },
      {
        $project: {
          _id: "$_id",
          wallet: 1,
          name: "$userInfo.name", 
          email: "$userInfo.email",
          profilePicture: "$userInfo.profilePicture",
          dealershipName:"$userInfo.dealershipName",
          mobileNumber:"$userInfo.mobileNumber"
        }
      }
    ]
    
    const transactionRes = await transactionModel.aggregate(aggregateQuery);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.TRANSACTION.FETCHED"),
      data: transactionRes.length > 0?  transactionRes[0]:{},
    });

  } catch (error) {
    next(error);
  }
};

// To admin
export const getMyWalletTransactions = async (token: any, userId: any, queryData: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({ code: 400, message: config.get("ERRORS.TOKEN_REQUIRED") });
    }

    const page: number = parseInt(queryData.page) || 1;
    const limit: number = parseInt(queryData.limit) || 10;
    const skip: number = (page - 1) * limit;
    const search: string = queryData.search || "";

    let query: any = [
      { userId: new mongoose.Types.ObjectId(userId) }
    ];

    const aggregateQuery: any = [
      {
        $match: { $and: query }
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } }
          ],
          as: 'user'
        }
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: 'users',
          let: { createdBy: "$createdBy" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$createdBy"] } } } // Correcting the match condition
          ],
          as: 'admin'
        }
      },
      { $unwind: "$admin" },
      {
        $project: {
          _id: 1,
          amount: 1,
          type: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            mobileNumber: "$user.mobileNumber",
            profilePicture: "$user.profilePicture"
          },
          createdBy: {
            _id: "$admin._id",
            name: "$admin.name",
            email: "$admin.email",
            mobileNumber: "$admin.mobileNumber",
            profilePicture: "$admin.profilePicture",
            role: "$admin.role"
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ];

    const transactionRes = await transactionModel.aggregate(aggregateQuery);
    const totalCount = await transactionModel.countDocuments({ $and: query })

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.TRANSACTION.FETCHED"),
      data: transactionRes,
      totalRecord: totalCount
    });

  } catch (error) {
    next(error);
  }
};

// to get user balace at admin end
export const getUserBalance = async (token: any,userId:any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const aggregateQuery: any  =[
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: "$userId",
          wallet: {
            $sum: {
              $cond: {
                if: { $or: [{ $eq: ["$type", "CREDIT"] }, { $eq: ["$type", "REFUND"] }] },
                then: "$amount",
                else: { $multiply: ["$amount", -1] }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id", 
          foreignField: "_id", 
          as: "userInfo" 
        }
      },
      {
        $unwind: "$userInfo" 
      },
      {
        $project: {
          _id: "$_id",
          wallet: 1,
          name: "$userInfo.name", 
          email: "$userInfo.email",
          profilePicture: "$userInfo.profilePicture",
          dealershipName:"$userInfo.dealershipName",
          mobileNumber:"$userInfo.mobileNumber"
        }
      }
    ]
    
    const transactionRes = await transactionModel.aggregate(aggregateQuery);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.TRANSACTION.FETCHED"),
      data: transactionRes.length > 0?  transactionRes[0]:{},
    });

  } catch (error) {
    next(error);
  }
};

// to get user balace at admin end
export const getAllUserBalance = async (token: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const aggregateQuery: any = [
      {
        $group: {
          _id: null,
          balance: {
            $sum: {
              $cond: {
                if: { $or: [{ $eq: ["$type", "CREDIT"] }, { $eq: ["$type", "REFUND"] }] },
                then: "$amount",
                else: { $multiply: ["$amount", -1] }
              }
            }
          }
        }
      },
    ];
    
    const transactionRes = await transactionModel.aggregate(aggregateQuery);

    let result = {};

    if(transactionRes.length > 0){
      delete transactionRes[0]._id;
      result = transactionRes[0]
    }

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.TRANSACTION.FETCHED"),
      data:result,
    });

  } catch (error) {
    next(error);
  }
};