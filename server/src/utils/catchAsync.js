/**
 * Catch async errors in route handlers and pass them to the express error handler
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 */
export const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default catchAsync;
