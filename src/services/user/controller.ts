import { HTTP400Error } from "../../utils/httpErrors";
import { Utilities } from "../../utils/Utilities";
import config from "config";
import { FileUpload } from "../../utils/FileUploadUtilities";
import { userModel } from "../../models/User";
import { PermissionModel } from "../../models/Permission";
import { DEFAULT_PERMISSION } from "../../constants/permission";
import { transactionModel } from "../../models/Transaction";
const axios = require("axios");
var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const saltRound = 10;
import { PERMISSION_TYPE } from "../../constants";

let searchData = {
  status: "success",
  message: "Vehicle Found",
  response_type: "FULL_DATA",
  result: {
    state_code: "GJ",
    state: "Gujarat",
    office_code: 1,
    office_name: "AHMEDABAD",
    reg_no: "GJ01JT0459",
    reg_date: "2020-02-13",
    purchase_date: "2020-01-30",
    owner_count: 1,
    owner_name: "JAGDISHKUMAR MANUBHAI RABARI",
    owner_father_name: "MANUBHAI RABARI",
    current_address_line1: "22,MANSUKHPURAS CHAWL",
    current_address_line2: "OPP.VASANT CINEMA OUT SIDE",
    current_address_line3: "DARIYAPUR DARVAJA,",
    current_district_name: "Ahmedabad",
    current_state: "GJ",
    current_state_name: "Gujarat",
    current_pincode: 380016,
    current_full_address:
      "22,MANSUKHPURAS CHAWL, OPP.VASANT CINEMA OUT SIDE, DARIYAPUR DARVAJA, Ahmedabad, Gujarat, 380016",
    permanent_address_line1: "22,MANSUKHPURAS CHAWL",
    permanent_address_line2: "OPP.VASANT CINEMA OUT SIDE",
    permanent_address_line3: "DARIYAPUR DARVAJA,",
    permanent_district_name: "Ahmedabad",
    permanent_state: "GJ",
    permanent_state_name: "Gujarat",
    permanent_pincode: 380016,
    permanent_full_address:
      "22,MANSUKHPURAS CHAWL, OPP.VASANT CINEMA OUT SIDE, DARIYAPUR DARVAJA, Ahmedabad, Gujarat, 380016",
    owner_code_descr: "INDIVIDUAL",
    reg_type_descr: "TEMPORARY REGISTERED VEHICLE",
    vehicle_class_desc: "Motor Cab",
    chassis_no: "MA3EJKD1S00C51332",
    engine_no: "K12MN2392205",
    vehicle_manufacturer_name: "MARUTI SUZUKI INDIA LTD",
    model_code: "VANA0001E041001",
    model: "TOUR S CNG",
    body_type: "SALOON",
    cylinders_no: 4,
    vehicle_hp: 83.08,
    vehicle_seat_capacity: 5,
    vehicle_standing_capacity: 0,
    vehicle_sleeper_capacity: 0,
    unladen_weight: 1045,
    vehicle_gross_weight: 1480,
    vehicle_gross_comb_weight: 0,
    fuel_descr: "PETROL/CNG",
    color: "PEARL ARCTIC WHITE",
    manufacturing_mon: 1,
    manufacturing_yr: 2020,
    norms_descr: "BHARAT STAGE IV",
    wheelbase: 2430,
    cubic_cap: 1197,
    floor_area: 0,
    ac_fitted: "Y",
    audio_fitted: "Y",
    video_fitted: "N",
    vehicle_purchase_as: "B",
    vehicle_catg: "LPV",
    dealer_code: "GJ00100005",
    dealer_name: "KIRAN MOTORS LTD..",
    dealer_address_line1: "P-82/1/1 NR SHYAMPUJA BUNGLOWS-2",
    dealer_address_line2: "NR HP PETROL PUMP MOTERA",
    dealer_address_line3: "",
    dealer_district: "474",
    dealer_pincode: "380005",
    dealer_full_address:
      "KIRAN MOTORS LTD.., P-82/1/1 NR SHYAMPUJA BUNGLOWS-2, NR HP PETROL PUMP MOTERA, 474, 380005",
    sale_amount: 453880,
    laser_code: "HOMO-DATA",
    garage_add: "",
    length: 3995,
    width: 1695,
    height: 1555,
    reg_upto: "2025-03-27",
    fit_upto: "2025-03-27",
    op_dt: "2023-03-29 20:38:54.374466",
    imported_vehicle: "N",
    other_criteria: 0,
    status: "Y",
    vehicle_type: "Transport",
    tax_mode: "L",
    verified_on: "2020-02-15",
    dl_validation_required: false,
    condition_status: false,
    vehicle_insurance_details: {
      insurance_from: "2023-01-30",
      insurance_upto: "2024-01-29",
      insurance_company_code: 1114,
      insurance_company_name: "ICICI Lombard General Insurance Co. Ltd.",
      opdt: "2023-02-02 07:11:46.776711",
      policy_no: "3004/MI-11805055/00/000",
      vahan_verify: "true",
      reg_no: "GJ01JT0459",
    },
    vehicle_pucc_details: {
      pucc_from: "27-03-2023",
      pucc_upto: "26-03-2024",
      pucc_centreno: "GJ0180084",
      pucc_no: "GJ01800840005727",
      op_dt: "27-03-2023",
    },
    permit_details: {
      appl_no: "GJ20021758811211",
      pmt_no: "GJ2020-CC-6227B",
      reg_no: "GJ01JT0459",
      rcpt_no: "GJ1D200200001581",
      purpose: "Fresh Permit",
      permit_type: "Contract Carriage Permit",
      permit_catg: "TAXI CAB PERMIT",
      permit_issued_on: "2020-02-26",
      permit_valid_from: "2020-02-25",
      permit_valid_upto: "2025-02-24",
    },
    latest_tax_details: {
      reg_no: "GJ01JT0459",
      tax_mode: "L",
      payment_mode: "I",
      tax_amt: 27233,
      tax_fine: 0,
      rcpt_dt: "04-02-2020",
      tax_from: "2020-01-30",
      tax_upto: null,
      collected_by: "1705078297",
      rcpt_no: "GJ1D200200001581",
    },
    financer_details: {
      hp_type: "HT",
      financer_name: "DENA BANK",
      financer_address_line1: ".",
      financer_address_line2: "",
      financer_address_line3: "",
      financer_district: 474,
      financer_pincode: 380016,
      financer_state: "GJ",
      financer_full_address: "DENA BANK, ., 474, GJ, 380016",
      hypothecation_dt: "2020-01-30",
      op_dt: "2020-02-15",
    },
  },
};

let basicVehicleData = {
  "code": 200,
  "result": {
    "data": {
      "Vehicle_Num": "UP16AF0785",
      "Chasis_No": "MAJUXXMR2UBS65955",
      "Owner_Name": "LOKESH SAINI",
      "Father": "MEHAR CHAND SAINI",
      "Owner_Num": "2",
      "Car": {
        "Id": 169,
        "ModelName": "ENDEAVOUR",
        "CompanyName": "FORD",
        "Price": null,
        "Varients": null,
        "VarientCode": null,
        "ImageUrl": null,
        "Key1": null,
        "Key2": null
      },
      "Regist_Date": "27-Sep-2011",
      "Rto": "Noida, Uttar Pradesh",
      "Fuel_Type": "DIESEL",
      "Engine_No": "BS65955",
      "Vehicle_Class": "Motor Car(LMV)",
      "Meta": "FORD INDIA PVT LTD, ENDEAVOUR",
      "CC": "2500",
      "Color": "N.J.SILVER",
      "Make_Id": "5",
      "Model_Id": "1227",
      "Weight": "1810",
      "Previous_Insurer": "IFFCO Tokio General Insurance Co. Ltd.",
      "Insurance_Upto": "10-Jun-2022",
      "Previous_Insurer_PolicyNo": null,
      "Type": "CAR",
      "Car_Data": null,
      "Present_Address": "C-27, SECTOR-57 NOIDA Gautam Buddha Nagar Uttar Pradesh 201301",
      "Permanent_Address": "C-27, SECTOR-57 NOIDA Gautam Buddha Nagar Uttar Pradesh 201301",
      "Puc_No": null,
      "Financier": null,
      "Puc_Expiry": "21-Sep-2022",
      "Manu_Date": "1/2011",
      "Fit_Upto": "26-Sep-2026",
      "Tax_Upto": null,
      "Norms_Desc": "EURO 3",
      "GVW": null,
      "Unldw": null,
      "Seat_Cap": null,
      "Sleeper_Cap": null,
      "Stand_Cap": null,
      "Wheel_Base": null,
      "Blacklist_Status": null,
      "Noc_Details": null,
      "RC_Status": "A",
      "RC_Status_AsOn": null,
      "Status_Message": null,
      "Permit_No": null,
      "Permit_Issue_Date": null,
      "Permit_From": null,
      "Permit_To": null,
      "Permit_Type": null,
      "Body_Type": "SALOON",
      "No_Cyl": null,
      "Make": "FORD INDIA PVT LTD",
      "Model": "ENDEAVOUR",
      "Db": true
    }
  }
}

export const addUser = async (token: any, req: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const isPermission = await Utilities.permissionCheck(
      decoded.id,
      PERMISSION_TYPE.CREATE_USER
    );

    let bodyData: any;
    bodyData = req.body;
    let role: any = bodyData?.role || "user";

    const isMobileExist = await userModel.findOne({
      mobileNumber: bodyData.mobileNumber || "",
      isDeleted: false,
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
    let permission = await PermissionModel.create({
      userId: result._id?.toString(),
      ...defaultPermissions,
    });

    await userModel.updateOne(
      { _id: result?._id },
      { permissions: permission._id?.toString() }
    );
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.CREATE"),
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (token: any, queryData: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const page: number = parseInt(queryData.page) || 1;
    const limit: number = parseInt(queryData.limit) || 10;
    const role = queryData.role || "user";

    const skip: number = (page - 1) * limit;

    const isPermission = await Utilities.permissionCheck(
      decoded.id,
      PERMISSION_TYPE.READ_USER
    );

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
      .populate("permissions")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.FETCH"),
      data: result,
      totalRecord: totalRecords,
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
      const userData: any = await userModel.findOne({
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
      const userPermission = await PermissionModel.findOne({
        userId: new mongoose.Types.ObjectId(decoded.id),
      });
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
    userData.profilePicture =
      bodyData.profilePicture || userData.profilePicture;

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

    const isPermission = await Utilities.permissionCheck(
      decoded.id,
      PERMISSION_TYPE.DELETE_USER
    );

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
      const isMatched = await bcrypt.compare(
        bodyData.password,
        userRes.password
      );
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

export const userProfileUpdateByAdmin = async (
  token: any,
  userId: any,
  req: any,
  next: any
) => {
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
    const isPermission = await Utilities.permissionCheck(
      decoded.id,
      PERMISSION_TYPE.UDPATE_USER
    );

    if (!mongoose.Types.ObjectId.isValid(userId)) {
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
    userData.profilePicture =
      bodyData.profilePicture ?? userData.profilePicture;
    userData.isKyc =
      typeof bodyData.isKyc !== "undefined" ? bodyData.isKyc : userData.isKyc;
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
      message: config.get("ERRORS.USER_ERRORS.UPDATE"),
    });
  } catch (error) {
    next(error);
  }
};

export const adminPermissionUpdateBySuperAdmin = async (
  token: any,
  userId: any,
  bodyData: any,
  next: any
) => {
  try {
    const permissions = bodyData;
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
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
    if (permissions) {
      await PermissionModel.findOneAndUpdate(
        { userId },
        {
          $set: { ...permissions },
        },
        {
          returnNewDocument: true,
        }
      );
    }

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.UPDATE"),
    });
  } catch (error) {
    next(error);
  }
};

export const addMoneyToUserAccount = async (
  token: any,
  bodyData: any,
  next: any
) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }
    if (!mongoose.Types.ObjectId.isValid(bodyData.userId)) {
      throw new HTTP400Error(
        Utilities.sendResponsData({
          code: 400,
          message: config.get("ERRORS.INVALID_ID"),
        })
      );
    }

    let userData = await userModel.findOne({
      _id: bodyData.userId,
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
    bodyData.createdBy = decoded.id;
    const userTrasaction = await transactionModel.create(bodyData);

    return Utilities.sendResponsData({
      code: 200,
      message:
        bodyData.type == config.get("ERRORS.TRANSACTION.TYPE.DEBIT")
          ? `${bodyData.amount} ${config.get("ERRORS.TRANSACTION.DEDUCTED")}`
          : `${config.get("ERRORS.TRANSACTION.CREATED")} ${bodyData.amount}`,
    });
  } catch (error) {
    next(error);
  }
};

// To admin
export const getAllUserTransactions = async (
  token: any,
  userId: any,
  queryData: any,
  next: any
) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }

    const page: number = parseInt(queryData.page) || 1;
    const limit: number = parseInt(queryData.limit) || 10;
    const skip: number = (page - 1) * limit;
    const search: string = queryData.search || "";

    let query: any = [{ userId: new mongoose.Types.ObjectId(userId) }];

    const aggregateQuery: any = [
      {
        $match: { $and: query },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$userId" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }],
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "users",
          let: { createdBy: "$createdBy" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$createdBy"] } } }, // Correcting the match condition
          ],
          as: "admin",
        },
      },
      { $unwind: "$admin" },
      {
        $project: {
          _id: 1,
          amount: 1,
          type: 1,
          transactionType: 1,
          createdAt: 1,
          updatedAt: 1,
          description: 1,
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            mobileNumber: "$user.mobileNumber",
            profilePicture: "$user.profilePicture",
          },
          createdBy: {
            _id: "$admin._id",
            name: "$admin.name",
            email: "$admin.email",
            mobileNumber: "$admin.mobileNumber",
            profilePicture: "$admin.profilePicture",
            role: "$admin.role",
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const transactionRes = await transactionModel.aggregate(aggregateQuery);
    const totalCount = await transactionModel.countDocuments({ $and: query });

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.TRANSACTION.FETCHED"),
      data: transactionRes,
      totalRecord: totalCount,
    });
  } catch (error) {
    next(error);
  }
};

// get my wallet balance at user end
export const getUserWallet = async (token: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const aggregateQuery: any = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(decoded.id),
        },
      },
      {
        $group: {
          _id: "$userId",
          wallet: {
            $sum: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$type", "CREDIT"] },
                    { $eq: ["$type", "REFUND"] },
                  ],
                },
                then: "$amount",
                else: { $multiply: ["$amount", -1] },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: "$_id",
          wallet: 1,
          name: "$userInfo.name",
          email: "$userInfo.email",
          profilePicture: "$userInfo.profilePicture",
          dealershipName: "$userInfo.dealershipName",
          mobileNumber: "$userInfo.mobileNumber",
        },
      },
    ];

    const transactionRes = await transactionModel.aggregate(aggregateQuery);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.TRANSACTION.FETCHED"),
      data: transactionRes.length > 0 ? transactionRes[0] : {},
    });
  } catch (error) {
    next(error);
  }
};

// To admin
export const getMyWalletTransactions = async (
  token: any,
  userId: any,
  queryData: any,
  next: any
) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    if (!decoded) {
      Utilities.sendResponsData({
        code: 400,
        message: config.get("ERRORS.TOKEN_REQUIRED"),
      });
    }

    const page: number = parseInt(queryData.page) || 1;
    const limit: number = parseInt(queryData.limit) || 10;
    const skip: number = (page - 1) * limit;
    const search: string = queryData.search || "";

    let query: any = [{ userId: new mongoose.Types.ObjectId(userId) }];

    const aggregateQuery: any = [
      {
        $match: { $and: query },
      },
      {
        $lookup: {
          from: "users",
          let: { userId: "$userId" },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }],
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "users",
          let: { createdBy: "$createdBy" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$createdBy"] } } }, // Correcting the match condition
          ],
          as: "admin",
        },
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
            profilePicture: "$user.profilePicture",
          },
          createdBy: {
            _id: "$admin._id",
            name: "$admin.name",
            email: "$admin.email",
            mobileNumber: "$admin.mobileNumber",
            profilePicture: "$admin.profilePicture",
            role: "$admin.role",
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const transactionRes = await transactionModel.aggregate(aggregateQuery);
    const totalCount = await transactionModel.countDocuments({ $and: query });

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.TRANSACTION.FETCHED"),
      data: transactionRes,
      totalRecord: totalCount,
    });
  } catch (error) {
    next(error);
  }
};

// to get user balace at admin end
export const getUserBalance = async (token: any, userId: any, next: any) => {
  try {
    const decoded: any = await Utilities.getDecoded(token);
    const aggregateQuery: any = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: "$userId",
          wallet: {
            $sum: {
              $cond: {
                if: {
                  $or: [
                    { $eq: ["$type", "CREDIT"] },
                    { $eq: ["$type", "REFUND"] },
                  ],
                },
                then: "$amount",
                else: { $multiply: ["$amount", -1] },
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },
      {
        $project: {
          _id: "$_id",
          wallet: 1,
          name: "$userInfo.name",
          email: "$userInfo.email",
          profilePicture: "$userInfo.profilePicture",
          dealershipName: "$userInfo.dealershipName",
          mobileNumber: "$userInfo.mobileNumber",
        },
      },
    ];

    const transactionRes = await transactionModel.aggregate(aggregateQuery);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.TRANSACTION.FETCHED"),
      data: transactionRes.length > 0 ? transactionRes[0] : {},
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
                if: {
                  $or: [
                    { $eq: ["$type", "CREDIT"] },
                    { $eq: ["$type", "REFUND"] },
                  ],
                },
                then: "$amount",
                else: { $multiply: ["$amount", -1] },
              },
            },
          },
        },
      },
    ];
    const transactionRes = await transactionModel.aggregate(aggregateQuery);

    let result = {};

    if (transactionRes.length > 0) {
      delete transactionRes[0]._id;
      result = transactionRes[0];
    }

    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.TRANSACTION.FETCHED"),
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getBasicSearch = async (token: any, id: any, next: any) => {
  try {
    const options = {
      method: "POST",
      url: "https://api.invincibleocean.com/invincible/vehicleRcV7",
      headers: {
        secretKey: process.env.INVINCIBLE_SECRET_KEY,
        clientId: process.env.INVINCIBLE_CLIENT_KEY,
      },
      data: {
        vehicleNumber: id,
      },
    };

    const response = await axios(options);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.FETCH"),
      // data:response,
      data: basicVehicleData,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdvancedSearch = async (token: any, id: any, next: any) => {
  try {
    const options = {
      method: "POST",
      url: "https://rto-vehicle-information-verification-india.p.rapidapi.com/api/v1/rc/vehicleinfo",
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host":
          "rto-vehicle-information-verification-india.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        reg_no: id,
        consent: "Y",
        consent_text:
          "I hear by declare my consent agreement for fetching my information via AITAN Labs API",
      },
    };

    // const response = await axios(options);
    return Utilities.sendResponsData({
      code: 200,
      message: config.get("ERRORS.USER_ERRORS.FETCH"),
      // data:response,
      data: searchData,
    });
  } catch (error) {
    next(error);
  }
};

