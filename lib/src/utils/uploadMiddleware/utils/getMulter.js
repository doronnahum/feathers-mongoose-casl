const multer = require('multer');

/**
 * @function getMulter
 * @description When config include a mimetypes then we want to allow
 * the user to upload a specific type of files, we use multer.fileFilter to do that
 * @param {*} mimetypes
 */
function getMulter (mimetypes) {
  const multerConfig = {};
  if (mimetypes) {
    multerConfig.fileFilter = function (req, file, cb) {
      const mimetype = file.mimetype;
      if (mimetypes.includes(mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Accept only ${mimetypes.join('')} files`));
      }
    };
  }
  return multer(multerConfig);
}

module.exports = getMulter;
