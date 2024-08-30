import * as mongoose from "mongoose";
const { Schema, model } = mongoose;

const serviceSchema = new Schema(
  {
    image: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    parentId: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: false,
    },
    isDeleted:{
      type: Boolean,
      default:false,
    },
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    updatedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export const servicedModel = model("services", serviceSchema);
