const Joi = require("joi");

const userCreateJoiValidationSchema = Joi.object({
  name: Joi.string().required().label("Name"),
  email: Joi.string().email().required().label("Email"),
  phone: Joi.string().length(11).required().label("Phone"),
  password: Joi.string().required().label("Password"),
  role: Joi.string()
    .valid("Administrator", "Supervisor", "Employee")

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

const updateUserJoiSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Please enter your name",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email",
    "any.required": "Please enter your email",
  }),
  phone: Joi.string().length(11).required().messages({
    "string.length": "Phone number must be 11 digits",
    "any.required": "Please enter your phone number",
  }),
  password: Joi.string().required().messages({
    "any.required": "Please enter your password",
  }),
  role: Joi.string()
    .valid("Administrator", "Supervisor", "Employee")
    .default("Employee"),
  photo: Joi.object({
    public_id: Joi.string(),
    url: Joi.string(),
  }),
  gender: Joi.string().valid("Male", "Female", "Others"),
  userStatus: Joi.string()
    .valid("Active", "Block", "Restricted")
    .default("Active"),
}).when(Joi.object({ role: "Administrator" }).unknown(), {
  then: Joi.object({
    role: Joi.string().valid("Administrator").required(),
  }),
});

const JoiUserValidationSchema = {
  userCreateJoiValidationSchema,
  loginSchema,
  refreshTokenJoiSchema,
  updateUserJoiSchema,
};

module.exports = JoiUserValidationSchema;
