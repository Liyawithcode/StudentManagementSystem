export const buildSearchQuery = (searchString, searchFields = []) => {
  if (!searchString || searchFields.length === 0) return {};
  
  const query = {
    $or: searchFields.map((field) => ({
      [field]: { $regex: searchString, $options: "i" }
    }))
  };
  return query;
};

export default buildSearchQuery;
