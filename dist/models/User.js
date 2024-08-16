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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const moment_1 = __importDefault(require("moment"));
const mongoose = __importStar(require("mongoose"));
const constants_1 = require("../constants");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    profilePicture: {
        type: String,
        default: ""
    },
    email: {
        type: String,
    },
    mobileNumber: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    dob: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: '',
        enum: constants_1.GENDERS
    },
    password: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "user",
        enum: constants_1.USER_ROLES
    },
    otp: {
        type: String,
        default: ""
    },
    otpVerified: {
        type: Boolean,
        default: false
    },
    otpExipredAt: {
        type: Date,
        default: (0, moment_1.default)().add(1, 'm')
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isLogIn: {
        type: Boolean,
        default: false
    },
    accessToken: {
        type: String,
        default: ""
    },
    fcmToken: {
        type: String,
        default: ""
    },
    isProfileUpdate: {
        type: Boolean,
        default: false
    },
    socialMediaLinks: {
        google: {
            id: {
                type: String,
                default: null,
                trim: true,
            },
            profilePic: {
                type: String,
                default: null,
                trim: true,
            },
            displayName: {
                type: String,
                default: null,
                trim: true,
            },
            email: {
                type: String,
                default: null,
                trim: true,
            },
            isDeleted: {
                type: Boolean,
                default: false,
            },
            isProfileUpdate: {
                type: Boolean,
                default: false
            }
        },
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });
userSchema.set('toJSON', {
    virtuals: false, transform: (doc, ret, Options) => {
        delete ret.password;
        delete ret.__v;
        delete ret.accessToken;
    }
});
exports.userModel = mongoose.model('users', userSchema);
//# sourceMappingURL=User.js.map