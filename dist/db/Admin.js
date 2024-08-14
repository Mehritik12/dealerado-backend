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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminModel = void 0;
const mongoose = __importStar(require("mongoose"));
var gender = ['', 'Male', 'Female', 'Other'];
const adminSchema = new mongoose.Schema({
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
        trim: true,
        required: true,
        lowercase: true
    },
    mobileNumber: {
        type: String,
    },
    image: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: gender
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isProfileUpdate: {
        type: Boolean,
        default: false
    },
    accessToken: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    userType: {
        type: String,
        default: "admin",
    },
}, { timestamps: true });
adminSchema.set('toJSON', {
    virtuals: false, transform: (doc, ret, Options) => {
        delete ret.password;
        delete ret.__v;
        delete ret.accessToken;
    }
});
exports.adminModel = mongoose.model('admins', adminSchema);
//# sourceMappingURL=Admin.js.map