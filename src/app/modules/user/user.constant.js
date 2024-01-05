const userFilterableFields = [
  "_id",
  "name",
  "email",
  "phone",
  "role",
  "userStatus",
  "searchTerm",
];

const userSearchableFields = ["name", "email", "phone", "userStatus"];
const userConstant = {
  userSearchableFields,
  userFilterableFields,
};
module.exports = userConstant;
