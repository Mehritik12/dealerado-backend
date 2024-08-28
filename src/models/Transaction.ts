import { number, required } from 'joi'
import * as mongoose from 'mongoose'
const TYPEENUM = ['DEBIT', 'CREDIT','REFUND']
const TRANACTIONTYPEFOR = ['Paid For Order','Refund For Order','Points Added']

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
    transactionType:{
      type: String,
      // required: true,
      // enum: TRANACTIONTYPEFOR,
    },
    description:{
      type: String,
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
