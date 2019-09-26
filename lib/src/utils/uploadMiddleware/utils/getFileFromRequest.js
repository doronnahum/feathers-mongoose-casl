
/**
   * @function getFileFromRequest
   * Use multer as async/await inside express middleware
   * @param {*} req
   * @param {*} res
   * @param {*} fileKeyName
   */
const getFileFromRequest = async function (multipartMiddleware, req, res, fileKeyName) {
  const result = await new Promise((resolve) => {
    multipartMiddleware.single(fileKeyName)(req, res, resolve);
  });
  if (result instanceof Error) {
    throw new Error(result.message);
  }
  return result;
};

module.exports = getFileFromRequest;
