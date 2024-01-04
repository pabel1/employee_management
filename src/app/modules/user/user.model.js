const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const config = require("../../../config/config");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Your Name"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    phone: {
      type: String,
      required: [true, "Please enter Your Phone"],
      length: [11, "Phone number must be 11 digits"],
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Administrator", "Supervisor", "Employee"],
      required: true,
    },
    photo: {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        // required: true,
      },
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },
    userStatus: {
      type: String,
      enum: ["Active", "Block", "Restricted"],
      default: "Active",
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
