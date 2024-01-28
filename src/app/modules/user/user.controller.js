const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const config = require("../../../config/config");
const sendResponse = require("../../../shared/sendResponse");
const userServices = require("./user.services");
const pick = require("../../../shared/pick");
const userConstant = require("./user.constant");
const paginationFields = require("../../../constant/pagination");
const JoiUserValidationSchema = require("./user.validation");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");

const userCreate = catchAsyncError(async (req, res) => {
  const file = req.file;

  if (file) {
    let photo = {
      url: file?.path,
      public_id: file?.filename,
    };
    req.body.photo = photo;
  }

  let payload = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    photo: req.body.photo,
  };
  const { error } =
    JoiUserValidationSchema.userCreateJoiValidationSchema.validate(payload);

  if (error) {
    throw new ErrorHandler(error, httpStatus.BAD_GATEWAY);
  }
  const result = await userServices.createUserInToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: {
      result,
    },
  });
});

const userLogin = catchAsyncError(async (req, res) => {
  const result = await userServices.loginUserInToDB(req.body);
  const { refreshToken, accessToken, user } = result;

  if (refreshToken && accessToken && user) {
    let cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Login successfully",
    data: {
      user,
      accessToken,
    },
  });
});

const loggedInUser = catchAsyncError(async (req, res) => {
  const result = await userServices.loggedInUserFromDB(req.user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "LoggedIn  user",
    data: {
      result,
    },
  });
});

// get new access token from using  refresh token
const refreshToken = catchAsyncError(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await userServices.refreshTokenFromDB(refreshToken);
  console.log(result);
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);
  res.cookie("accessToken", result?.accessToken, cookieOptions);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token Get ",
    data: {
      result,
    },
  });
});

// logout
const logout = catchAsyncError(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
  });
});

const updateMyProfile = catchAsyncError(async (req, res) => {
  const result = await userServices.updateLoginUserIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "update my Profile  successfully",
    data: {
      result,
    },
  });
});
const updateUser = catchAsyncError(async (req, res) => {
  const result = await userServices.updateUserIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Update user  successfully",
    data: {
      result,
    },
  });
});

const deleteUser = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.deleteUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Logged out successfully",
    data: {
      result,
    },
  });
});

const getAllUser = catchAsyncError(async (req, res) => {
  const filters = pick(req.query, userConstant.userFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await userServices.getAllUserFromDB(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Get successfully",
    meta: result.meta,
    data: result.data,
  });
});

const userController = {
  userCreate,
  userLogin,
  loggedInUser,
  refreshToken,
  logout,
  deleteUser,
  updateUser,
  updateMyProfile,
  getAllUser,
};
module.exports = userController;
