const jwt = require("jsonwebtoken");
const ErrorHandler = require("../ErrorHandler/errorHandler");
const UserModel = require("../app/modules/Auth/users/user.model");
const httpStatus = require("http-status");
const config = require("../config/config");
const jwtHandle = require("../shared/createToken");

const authVerification = async (req, res, next) => {
  try {
    let token;

    if (req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else {
      const { authorization } = req.headers;

      token = authorization?.split(" ")[1];
    }
    if (!token) {
      throw new ErrorHandler("Please login to access the resource", 401);
    }

    let decoded;

    try {
      decoded = jwt.verify(token, config.jwt_key);
      const { email, userId } = decoded;
      req.email = email;

      const rootUser = await UserModel.findOne({ email: email });

      if (!rootUser) {
        throw new ErrorHandler("User not found", 404);
      }

      req.user = rootUser;
      req.userId = userId;
      req.email = email;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // Access token has expired, try to refresh it using the refreshToken
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          throw new ErrorHandler(
            "Access token expired. Please login again.",
            401
          );
        }

        try {
          // Verify the refreshToken and check for validity
          const refreshTokenDecoded = jwt.verify(
            refreshToken,
            config.jwt_refresh_key
          );
          const { email, userId } = refreshTokenDecoded;

          // If the refreshToken is valid, generate a new accessToken
          const newAccessToken = await jwtHandle(
            { id: userId, email: email },
            config.jwt_key,
            config.jwt_token_expire
          );

          req.cookies.accessToken = newAccessToken;

          //
          if (newAccessToken) {
            let cookieOptions = {
              secure: config.env === "production",
              httpOnly: true,
            };
            res.cookie("accessToken", newAccessToken, cookieOptions);
          }

          const rootUser = await UserModel.findOne({ email: email });

          if (!rootUser) {
            throw new ErrorHandler("User not found", 404);
          }

          req.user = rootUser;
          req.userId = userId;
          req.email = email;
        } catch (error) {
          console.log(error);
          throw new ErrorHandler(
            "Refresh token is invalid. Please login again.",
            401
          );
        }
      } else {
        throw error;
      }
    }
    // Continue with the next middleware
    next();
  } catch (error) {
    next(error, httpStatus.UNAUTHORIZED);
  }
};

module.exports = authVerification;
