import * as mongoose from 'mongoose'
const {Schema,model}= mongoose;

const permissionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    //user permission
    createUser:{
        type: Boolean,
        default: false,
    },
    readUser: {
        type: Boolean,
        default: false,
    },
    updateUser:{
        type: Boolean,
        default: false,
    },
    deleteUser:{
        type: Boolean,
        default: false,
    },
    // banner permission
    createBanner:{
        type: Boolean,
        default: false,
    },
    readBanner: {
        type: Boolean,
        default: false,
    },
    updateBanner:{
        type: Boolean,
        default: false,
    },
    deleteBanner:{
        type: Boolean,
        default: false,
    },
    // vehicle permission
    createVehicle:{
        type: Boolean,
        default: false,
    },
    readVehicle: {
        type: Boolean,
        default: false,
    },
    updateVehicle:{
        type: Boolean,
        default: false,
    },
    deleteVehicle:{
        type: Boolean,
        default: false,
    },
   // order permission
    createOrder:{
        type: Boolean,
        default: false,
    },
    readOrder: {
        type: Boolean,
        default: false,
    },
    updateOrder:{
        type: Boolean,
        default: false,
    },
    deleteOrder:{
        type: Boolean,
        default: false,
    },
    // challan permission
    createChallan:{
        type: Boolean,
        default: false,
    },
    readChallan: {
        type: Boolean,
        default: false,
    },
    updateChallan:{
        type: Boolean,
        default: false,
    },
    deleteChallan:{
        type: Boolean,
        default: false,
    },
  },
  { timestamps: true }
)

permissionSchema.set('toJSON', {
  virtuals: false,
  transform: (doc, ret, Options) => {
    delete ret.__v
  },
})

export const PermissionModel = model('permission', permissionSchema)
