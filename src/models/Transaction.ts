import { number, required } from 'joi'
import * as mongoose from 'mongoose'
const TYPEENUM = ['DEBIT', 'CREDIT']

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    type: {
      type: String,
      required: true,
      enum: TYPEENUM,
    },
  },
  { timestamps: true }
)

transactionSchema.set('toJSON', {
  virtuals: false,
  transform: (doc, ret, Options) => {
    delete ret.__v
  },
})

export const transactionModel = mongoose.model('transactions', transactionSchema)
