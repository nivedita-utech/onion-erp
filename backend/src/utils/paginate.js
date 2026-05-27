/**
 * Build pagination query parameters for Mongoose
 * @param {Object} query - Express request query object
 * @param {number} [query.page=1] - Current page number
 * @param {number} [query.limit=10] - Items per page
 * @param {string} [query.sortBy='createdAt'] - Field to sort by
 * @param {string} [query.order='desc'] - Sort order (asc/desc)
 * @returns {Object} Pagination options { skip, limit, sort }
 */
export const getPaginationOptions = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const sortBy = query.sortBy || 'createdAt';
  const order = query.order === 'asc' ? 1 : -1;

  return {
    skip: (page - 1) * limit,
    limit,
    sort: { [sortBy]: order },
    page,
  };
};

/**
 * Build pagination metadata for API response
 * @param {number} total - Total number of documents
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
export const getPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
