// Define a generic search function
const createSearchQuery = (searchTerm, searchableFields) => {
  if (searchTerm) {
    const searchRegex = {
      $regex: searchTerm,
      $options: "i",
    };

    const searchQuery = {
      $or: searchableFields.map((field) => ({
        [field]: searchRegex,
      })),
    };
    return searchQuery;
  } else {
    // Return an empty query if searchTerm is not provided
    return {};
  }
};

exports.searchHelper = {
  createSearchQuery,
};
// Demo call for users
//   const userSearchableFields = ['name', 'email', 'username'];
//   const userSearchTerm = 'userSearchTermHere';
//   const userQuery = createSearchQuery(userSearchTerm, userSearchableFields);
//   console.log(userQuery, 'searchQuery');
