const errors = require('@feathersjs/errors');

const errorHandler = function(){
  return ctx => {
    if (ctx.error) {
      const error = ctx.error;
      if (!error.code) {
        const newError = new errors.GeneralError('server error');
        ctx.error = newError;
        return ctx;
      }
      if (error.code === 404 || process.env.NODE_ENV === 'production') {
        error.stack = null;
      }
      return ctx;
    }
  };
};

module.exports = errorHandler;