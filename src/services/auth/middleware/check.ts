import { Request, Response, NextFunction } from "express";
import { HTTP400Error, HTTP403Error } from "../../../utils/httpErrors";
import Joi, { any } from "joi";
import config from "config";
import { Utilities } from "../../../utils/Utilities";
import { invalidTokenError, errorMessageHander } from "../../../utils/ErrorHandler";

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().trim().required().messages({
      "string.empty": "Phone number cannot be empty"
    }),
    password: Joi.string()
    .trim(true)
    // .min(8)
    // .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
    .required()
    .messages({
      "string.empty": "Password can not be empty",
      "string.min": "Password must include atleast 8 characters",
      "string.pattern.base": "Password must include atleast 1 number and 1 special character"
    }),
    fcmToken: Joi.string().trim().optional()
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

export const checkSignup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().trim(true).required().messages({
      "string.empty": "Email can not be empty",
      "string.email": "Email should be a valid email"
    }),
    password: Joi.string()
      .trim(true)
      .min(8)
      .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
      .required()
      .messages({
        "string.empty": "Password can not be empty",
        "string.min": "Password must include atleast 8 characters",
        "string.pattern.base": "Password must include atleast 1 number and 1 special character"
      })
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

export const checkClientSignup = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    mobileNumber: Joi.string().trim(true).optional(),
    firstName: Joi.string().trim().allow('').optional(),
    lastName: Joi.string().allow('').trim().optional(),
    email: Joi.string().trim().optional(),
    dob: Joi.string().allow('').optional(),
    gender: Joi.string().allow('').trim().optional(),
    profilePicture: Joi.string().allow('').optional()
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



export const checkAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.get(config.get("AUTHORIZATION"));
  Utilities.verifyToken(token)
    .then((result) => {
      next();
    })
    .catch((error) => {
      res.status(403)
        .send({ responseCode: 401, responseMessage: error.message, data: {} });
    });
};

export const checkAdminAuthenticate = (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.get(config.get("AUTHORIZATION"));
  Utilities.verifyAdminToken(token)
    .then((result) => {
      next();
    })
    .catch((error) => {
      res.status(403)
        .send({ responseCode: 403, responseMessage: error.message, data: {} });
    });
};


export const checkAdminSignup = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().trim(true).required().messages({
      'string.empty': 'Email can not be empty',
      'string.email': `Email should be a valid email`,
    }),
    password: Joi.string().trim().required().messages({
      "string.empty": "Password number cannot be empty"
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

export const checkChangeAdminPassword = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    oldPassword: Joi.string()
      .trim(true)
      .min(8)
      .required()
      .messages({
        'string.empty': 'Password can not be empty',
        'string.min': 'Password must include atleast 8 characters',
      }),
    newPassword: Joi.string()
      .trim(true)
      .min(8)
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        )
      )
      .required()
      .messages({
        'string.empty': 'Cureent password can not be empty',
        'string.min': 'Current password must include atleast 8 characters',
        'string.pattern.base':
          'Current password must include atleast 1 number and 1 special character',
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

export const checkUserStatus = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    status: Joi.boolean().required().messages({
      'boolean.empty': 'Status can not be empty',
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

export const checkCommonAuthentication = (req: Request, res: Response, next: NextFunction) => {
  const token: any = req.get(config.get("AUTHORIZATION"));
  Utilities.commonVerifyToken(token)
    .then((result) => {
      next();
    })
    .catch((error) => {
      res.status(403)
        .send({ responseCode: 403, responseMessage: error.message, data: {} });
    });
};

export const validateLink = (req: Request, res: Response, next: NextFunction) => {
  if (Object.keys(req.query).length === 0) {
      return res.status(403).send({
          responseCode: 403,
          responseMessage: config.get('COMMON_MESSAGE.INVALID_TOKEN'),
      });
  }
  next();
}

export const checkForgotPassword = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
      email: Joi.string().email().trim(true).required().messages({
          'string.empty': 'Email can not be empty',
          'string.email': 'Email should be a valid email',
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

export const checkNewPassword = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    activationToken:Joi.string().trim(true).required(),
    password: Joi.string()
      .trim(true)
      .min(8)
      .pattern(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        )
      )
      .required()
      .messages({
        'string.empty': 'Password can not be empty',
        'string.min': 'Password must include atleast 8 characters',
        'string.pattern.base':
          'Password must include atleast 1 number and 1 special character',
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