const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const {
  compositeKeyGenerator,
} = require("../../../Helper/compositeKeyGenerator");
const ShiftModel = require("./shift.model");
const { paginationHelpers } = require("../../../Helper/paginationHelper");
const { filteringHelper } = require("../../../Helper/filteringHelper");
const { searchHelper } = require("../../../Helper/searchHelper");
const shiftConstant = require("./shift.constant");
const { sortingHelper } = require("../../../Helper/sortingHelper");

const createShiftIntoDB = async (payload) => {
  const compositeKey = compositeKeyGenerator.generateCompositKey({
    keyFor: "shift",
    firstField: payload?.shiftName,
    secondField: payload?.startTime,
  });

  const isExist = await ShiftModel.findOne({
    compositeKey,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.shiftName} this Shift already exist!`,
      httpStatus.CONFLICT
    );
  }

  const shift = new ShiftModel(payload);
  const newShift = await shift.save();

  return newShift;
};

const getAllShiftFromDB = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;
  console.log("filtersData", filtersData);
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const pipeline = [];
  const totalPipeline = [{ $count: "count" }];
  const match = {};

  //?Dynamic search added
  const dynamicSearchQuery = searchHelper.createSearchQuery(
    searchTerm,
    shiftConstant.shiftSearchableFields
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

  const result = await ShiftModel.aggregate(pipeline);
  const total = await ShiftModel.aggregate(totalPipeline);
  return {
    meta: {
      page,
      limit,
      total: total[0]?.count,
    },
    data: result,
  };
};

const deleteShiftFromDB = async (id) => {
  const shift = await ShiftModel.findById(id);
  if (!shift) {
    throw new ErrorHandler("Shift not found", httpStatus.NOT_FOUND);
  }
  const result = await ShiftModel.deleteOne({ _id: id });
  return {
    result,
  };
};
const shiftServices = {
  createShiftIntoDB,
  getAllShiftFromDB,
  deleteShiftFromDB,
};
module.exports = shiftServices;
