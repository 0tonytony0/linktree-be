/**
 * Catch async errors in express routes
 * @param {Function} fn - The async function
 */
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
