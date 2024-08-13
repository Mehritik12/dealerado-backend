import moment from 'moment';
import * as mongoose from 'mongoose';
var gender = ['other', 'male', 'female',''];

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
    enum: gender
  },
  password: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    default: "User",
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