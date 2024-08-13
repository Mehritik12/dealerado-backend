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
exports.partnerModel = void 0;
const moment_1 = __importDefault(require("moment"));
const mongoose = __importStar(require("mongoose"));
var gender = ['', 'male', 'female', 'other'];
const partnerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        lowercase: true,
        // required:true
    },
    mobileNumber: {
        type: String,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    speciality: {
        type: Array,
        default: []
    },
    dob: {
        type: Date,
        default: new Date("1970-01-01")
    },
    gender: {
        type: String,
        default: "",
        enum: gender
    },
    country: {
        type: String,
        default: "",
        lowerCase: true
    },
    state: {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: ""
    },
    zipCode: {
        type: String,
        default: "",
    },
    // password: {
    //   type: String,
    //   default: ""
    // },
    role: {
        type: String,
        default: "Partner",
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
    isProfileUpdate: {
        type: Boolean,
        default: false
    },
    isVerified: {
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
    wage: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        default: ""
    },
    experience: {
        type: Number,
        default: 0
    },
    documents: [{
            type: String
        }],
    language: [{
            type: String,
            lowerCase: true
        }],
    coverImage: [{
            type: String,
        }],
    expertise: {
        type: String,
        default: ''
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
        },
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });
partnerSchema.set('toJSON', {
    virtuals: false, transform: (doc, ret, Options) => {
        delete ret.password;
        delete ret.__v;
        delete ret.accessToken;
    }
});
exports.partnerModel = mongoose.model('partner', partnerSchema);
//# sourceMappingURL=Partner.js.map