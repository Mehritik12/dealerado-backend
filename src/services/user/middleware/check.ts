import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../../../utils/httpErrors";
import Joi from "joi";
import { Utilities } from "../../../utils/Utilities";
import { errorMessageHander } from "../../../utils/ErrorHandler";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().trim(true).required().messages({
      "string.empty": "Name can not be empty",
    }),
    email: Joi.string().trim(true).email().required().messages({
      "string.empty": "Email can not be empty",
    }),
    mobileNumber: Joi.string().trim(true).optional(),
    dealershipName: Joi.string().trim(true).optional(),
    isKyc: Joi.boolean().optional(),
    role: Joi.string().trim(true).optional(),
    image: Joi.string().trim(true).optional(),
    password: Joi.string()
      .trim(true)
      .min(8)
      .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
      .required()
      .messages({
        "string.empty": "Password can not be empty",
        "string.min": "Password must include atleast 8 characters",
        "string.pattern.base": "Password must include atleast 1 number and 1 special character"
      }),
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    let messageArr = errorMessageHander(error.details);
    throw new HTTP400Error(
      Utilities.sendResponsData({
        code: 400,
        message: messageArr[0],
      })
    );
  } else {
    req.body = value;
    next();
  }
};

export const addMoneyValidate = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    amount: Joi.number().required().messages({
      "number.empty": "Amount can not be empty",
    }),
    type: Joi.string().required().messages({
      "string.empty": "Type can not be empty ex. DEBIT or CREDIT",
    }),
    userId: Joi.string().required().messages({
      "string.empty": "Type can not be empty ex. DEBIT or CREDIT",
    }),
    transactionType:Joi.string().optional(),
    description:Joi.string().optional()
  });
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    let messageArr = errorMessageHander(error.details);
    throw new HTTP400Error(
      Utilities.sendResponsData({
        code: 400,
        message: messageArr[0],
      })
    );
  } else {
    req.body = value;
    next();
  }
};