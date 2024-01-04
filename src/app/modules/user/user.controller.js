const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const config = require("../../../config/config");
const sendResponse = require("../../../shared/sendResponse");
const userServices = require("./user.services");

const userRegistration = catchAsyncError(async (req, res) => {
  const file = req.file;

  if (file) {
    let photo = {
      url: file?.path,
      public_id: file?.filename,
    };
    req.body.photo = photo;
  }

  const result = await userServices.createUserInToDB(req.body);
  const { refreshToken, accessToken, userData } = result;

  if (refreshToken && accessToken && userData) {
    let cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: {
      userData,
      accessToken,
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
  const result = await userServices.loginUserInToDB(req.user._id);

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

const userController = {
  userRegistration,
  userLogin,
  loggedInUser,
  refreshToken,
  logout,
};
module.exports = userController;
