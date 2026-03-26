/**
 * Standard API Response Wrapper
 * @param {boolean} success - Whether the request was successful
 * @param {string} message - Response message
 * @param {any} data - Response data
 */
const apiResponse = (res, statusCode, success, message, data = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

module.exports = apiResponse;
