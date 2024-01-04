const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("./user.model");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const jwtHandle = require("../../../shared/createToken");
const config = require("../../../config/config");
const createUserInToDB = async (payload) => {
  const user = await UserModel.findOne({ email: payload?.email });
  if (user) {
    throw new ErrorHandler("User already axist!", httpStatus.CONFLICT);
  }
  const newUser = new UserModel(payload);
  const userData = await newUser.save();

  let accessToken, refreshToken;
  if (userData) {
    accessToken = await jwtHandle(
      { id: userData?._id, email: userData?.email },
      config.jwt_key,
      config.jwt_token_expire
    );

    refreshToken = await jwtHandle(
      { id: userData?._id, email: userData?.email },
      config.jwt_refresh_key,
      config.jwt_refresh_token_expire
    );
  }
  console.log(refreshToken);
  console.log(accessToken);
  return { userData, accessToken, refreshToken };
};
const loginUserInToDB = async (payload) => {
  const { email, password } = payload;

  const isExistUser = await UserModel.findOne({
    email,
  });

  const { _id } = isExistUser;

  if (!isExistUser) {
    throw new ErrorHandler("User does not exist", httpStatus.NOT_FOUND);
  }

  const isMatchPassword = async () => {
    return await bcrypt.compare(password, isExistUser?.password);
  };

  if (!isMatchPassword) {
    throw new ErrorHandler("Invalid credentials", httpStatus.UNAUTHORIZED);
  }

  const accessToken = await jwtHandle(
    { id: _id, email: email },
    config.jwt_key,
    config.jwt_token_expire
  );
  const refreshToken = await jwtHandle(
    { id: _id, email: email },
    config.jwt_refresh_key,
    config.jwt_refresh_token_expire
  );

  return {
    user: isExistUser,
    accessToken,
    refreshToken,
  };
};

const refreshTokenFromDB = async (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt_refresh_key);

    const { userId } = decoded;

    const isUserExist = await UserModel.findById(userId);

    if (!isUserExist) {
      throw new ErrorHandler("User does not exist", httpStatus.NOT_FOUND);
    }

    const accessToken = await jwtHandle(
      { id: isUserExist?._id, email: isUserExist?.email },
      config.jwt_key,
      config.jwt_token_expire
    );

    return {
      accessToken,
    };
  } catch (error) {
    throw new ErrorHandler("Invalid Refresh Token", httpStatus.FORBIDDEN);
  }
};

const loggedInUserFromDB = async (userID) => {
  const user = await UserModel.findById(userID);
  if (!user) {
    throw new ErrorHandler("User not found", httpStatus.NOT_FOUND);
  }
  return {
    user,
  };
};

const userServices = {
  createUserInToDB,
  loginUserInToDB,
  loggedInUserFromDB,
  refreshTokenFromDB,
};

module.exports = userServices;
