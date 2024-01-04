const Joi = require("joi");

const userCreateJoiValidationSchema = Joi.object({
  name: Joi.string().required().label("Name"),
  email: Joi.string().email().required().label("Email"),
  phone: Joi.string().length(11).required().label("Phone"),
  password: Joi.string().required().label("Password"),
  role: Joi.string()
    .valid("Administrator", "Supervisor", "Employee")
    .required()
    .label("Role"),
  photo: Joi.object({
    public_id: Joi.string(),
    url: Joi.string(),
  }),
  gender: Joi.string().valid("Male", "Female", "Others"),
  userStatus: Joi.string()
    .valid("Active", "Block", "Restricted")
    .default("Active"),
});

// Validation schema for login with custom error messages
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Customize email validation if needed
    .required()
    .messages({
      "string.empty": "Email is required",
      "any.required": "Email is required",
      "string.email": "Invalid email format",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

const refreshTokenJoiSchema = Joi.object({
  cookies: Joi.object({
    refreshToken: Joi.string()
      .required()
      .error(new Error("Refresh Token is required")),
  }),
});

const JoiUserValidationSchema = {
  userCreateJoiValidationSchema,
  loginSchema,
  refreshTokenJoiSchema,
};

module.exports = JoiUserValidationSchema;
