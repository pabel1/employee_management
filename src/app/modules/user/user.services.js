const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const jwtHandle = require("../../../shared/createToken");
const config = require("../../../config/config");
const UserModel = require("./user.model");
const { paginationHelpers } = require("../../../Helper/paginationHelper");
const { searchHelper } = require("../../../Helper/searchHelper");
const userConstant = require("./user.constant");
const { filteringHelper } = require("../../../Helper/filteringHelper");
const { sortingHelper } = require("../../../Helper/sortingHelper");
const createUserInToDB = async (payload) => {
  const user = await UserModel.findOne({ email: payload?.email });
  if (user) {
    throw new ErrorHandler("User already axist!", httpStatus.CONFLICT);
  }
  const newUser = new UserModel(payload);
  const userData = await newUser.save();

  return userData;
};
const loginUserInToDB = async (payload) => {
  const { email, password } = payload;

  const isExistUser = await UserModel.findOne({
    email,
  });

  if (!isExistUser) {
    throw new ErrorHandler("User does not exist", httpStatus.NOT_FOUND);
  }
  const { _id } = isExistUser;
  const isMatchPassword = await bcrypt.compare(password, isExistUser?.password);

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
      user: isUserExist,
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
const deleteUserFromDB = async (userID) => {
  const user = await UserModel.findById(userID);
  if (!user) {
    throw new ErrorHandler("User not found", httpStatus.NOT_FOUND);
  }
  const result = await UserModel.deleteOne({ _id: userID });
  return {
    result,
  };
};
const updateUserIntoDB = async (req) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    throw new ErrorHandler("User not found", httpStatus.NOT_FOUND);
  }
  const { role } = req.user;
  if (role === "Administrator") {
    Object.assign(user, req.body);
  } else if (role === "Supervisor") {
    user.userStatus = req.body.userStatus;
  }
  const result = await user.save();
  return {
    result,
  };
};

const updateLoginUserIntoDB = async (req) => {
  const user = await UserModel.findById(req.userId);
  if (!user) {
    throw new ErrorHandler("User not found", httpStatus.NOT_FOUND);
  }

  if (req.body.role) {
    throw new ErrorHandler("role cannot updatable", httpStatus.BAD_REQUEST);
  }

  const result = await UserModel.updateOne(
    { _id: user?._id },
    { $set: req.body },
    { new: true }
  );
  return {
    result,
  };
};

const getAllUserFromDB = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;
  console.log("filtersData", filtersData);
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const pipeline = [];
  const totalPipeline = [{ $count: "count" }];
  const match = {};

  const dynamicSearchQuery = searchHelper.createSearchQuery(
    searchTerm,
    userConstant.userSearchableFields
  );

  if (dynamicSearchQuery && dynamicSearchQuery.length) {
    match.$or = dynamicSearchQuery;
  }
  // ? Dynamic filtering added
  const dynamicFilter = filteringHelper.createDynamicFilter(filtersData);
  if (dynamicFilter && dynamicFilter.length) {
    match.$and = dynamicFilter;
  }
  console.log(dynamicFilter);
  // if join projection and otherneeded for before match ar unshift then write here

  if (skip) {
    pipeline.push({ $skip: skip });
  }

  if (limit) {
    pipeline.push({ $limit: limit });
  }

  // sorting
  const dynamicSorting = sortingHelper.createDynamicSorting(sortBy, sortOrder);

  if (dynamicSorting) {
    pipeline.push({
      $sort: dynamicSorting,
    });
  }

  if (Object.keys(match).length) {
    pipeline.unshift({
      $match: match,
    });
    totalPipeline.unshift({
      $match: match,
    });
  }

  const result = await UserModel.aggregate(pipeline);
  const total = await UserModel.aggregate(totalPipeline);
  return {
    meta: {
      page,
      limit,
      total: total[0]?.count,
    },
    data: result,
  };
};
const userServices = {
  createUserInToDB,
  loginUserInToDB,
  loggedInUserFromDB,
  refreshTokenFromDB,
  deleteUserFromDB,
  updateLoginUserIntoDB,
  updateUserIntoDB,
  getAllUserFromDB,
};

module.exports = userServices;
