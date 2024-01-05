// Define a generic search function
const createSearchQuery = (searchTerm, searchableFields) => {
  if (searchTerm) {
    const searchRegex = {
      $regex: searchTerm,
      $options: "i",
    };

    const searchQuery = searchableFields.map((field) => ({
      [field]: searchRegex,
    }));

    return searchQuery;
  } else {
    // Return an empty query if searchTerm is not provided
    return [];
  }
};

exports.searchHelper = {
  createSearchQuery,
};
