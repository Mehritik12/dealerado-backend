import moment from 'moment';
import * as mongoose from 'mongoose';
import { GENDERS, USER_ROLES } from '../constants';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  profilePicture: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  mobileNumber: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: '',
    // enum: GENDERS
  },
  password: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    default: "user",
    enum: USER_ROLES
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
    default: moment().add(1, 'm')
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
  isProfileUpdate:{
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
      isProfileUpdate:{
        type: Boolean,
        default: false
      }
    },
  },
  isActive:{
    type: Boolean,
    default: true
  },
  dealershipName:{
    type: String,
    default: ""
  },
  activationToken:{
    type: String,
    trim: true,
  },
  linkExipredAt: {
    type: Date,
    default: moment().add(5, 'm')
  },
  isKyc:{
    type: String,
    default: false
  }
},
{ timestamps: true });

userSchema.set('toJSON', {
  virtuals: false, transform: (doc, ret, Options) => {
    delete ret.password
    delete ret.__v
    delete ret.accessToken
  }
})

export const userModel = mongoose.model('users', userSchema);