import * as mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

bannerSchema.set('toJSON', {
  virtuals: false,
  transform: (doc, ret, Options) => {
    delete ret.__v
  },
})

export const bannerModel = mongoose.model('banners', bannerSchema)
