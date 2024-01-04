const createDynamicFilter = (filtersData) => {
  if (Object.keys(filtersData).length) {
    const filter = Object.entries(filtersData).map(([field, value]) => ({
      [field]: value,
    }));

    return { $and: filter };
  } else {
    // Return an empty filter if no filters are provided
    return {};
  }
};

exports.filteringHelper = {
  createDynamicFilter,
};
