const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const sendResponse = require("../../../shared/sendResponse");
const shiftServices = require("./shift.services");
const pick = require("../../../shared/pick");
const shiftConstant = require("./shift.constant");
const paginationFields = require("../../../constant/pagination");

const shiftCreate = catchAsyncError(async (req, res) => {
  const result = await shiftServices.createShiftIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shift created successfully",
    data: {
      result,
    },
  });
});

const getAllShift = catchAsyncError(async (req, res) => {
  const filters = pick(req.query, shiftConstant.shiftFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await shiftServices.getAllShiftFromDB(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shift Get successfully",
    meta: result.meta,
    data: result.data,
  });
});

const deleteShift = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const result = await shiftServices.deleteShiftFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shift Delete  successfully",
    data: {
      result,
    },
  });
});

const shiftController = {
  shiftCreate,
  getAllShift,
  deleteShift,
};
module.exports = shiftController;
