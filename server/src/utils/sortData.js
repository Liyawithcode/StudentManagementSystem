export const buildSortQuery = (sortParam) => {
  const sort = {};
  if (!sortParam) {
    sort.createdAt = -1; // Default fallback sorting
    return sort;
  }

  if (sortParam.includes(":")) {
    const [field, order] = sortParam.split(":");
    sort[field] = order === "desc" ? -1 : 1;
  } else {
    if (sortParam.startsWith("-")) {
      sort[sortParam.substring(1)] = -1;
    } else {
      sort[sortParam] = 1;
    }
  }

  return sort;
};

export default buildSortQuery;
