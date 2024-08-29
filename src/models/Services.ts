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
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
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
  },
  { timestamps: true }
);

export const servicedModel = model("services", serviceSchema);
