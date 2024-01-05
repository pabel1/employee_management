const { default: mongoose } = require("mongoose");
const startOfDayEndOfDay = require("../utility/startOfDayEndOfDay");
const handleSpecialCondition = (field, value) => {
  if (field === "_id") {
    if (Array.isArray(value)) {
      const orArray = value.map((item) => ({
        [field]: new mongoose.Types.ObjectId(item),
      }));
      return { $or: orArray };
    } else {
      return { [field]: new mongoose.Types.ObjectId(value) };
    }
  }
  if (field === "date") {
    const { startOfDay, endOfDay } = startOfDayEndOfDay(value);
    return { [field]: { $gte: startOfDay, $lte: endOfDay } };
  }

  return { [field]: value };
};

const createDynamicFilter = (filtersData) => {
  if (Object.keys(filtersData).length) {
    const filter = Object.entries(filtersData).map(([field, value]) => {
      return handleSpecialCondition(field, value);
    });

    return filter;
  } else {
    // Return an empty filter if no filters are provided
    return [];
  }
};

exports.filteringHelper = {
  createDynamicFilter,
};
