import * as mongoose from 'mongoose';
var gender = ['', 'Male', 'Female','Other'];

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
  isProfileUpdate:{
    type: Boolean,
    default: false
  },
  accessToken: {
    type: String,
    default: ""
  },
  password:{
    type: String,
    default: ""
  },
  userType: {
    type: String,
    default: "Admin",
  },
},
  { timestamps: true });

  adminSchema.set('toJSON', {
  virtuals: false, transform: (doc, ret, Options) => {
    delete ret.password
    delete ret.__v
    delete ret.accessToken
  }
})

export const adminModel = mongoose.model('admins', adminSchema);