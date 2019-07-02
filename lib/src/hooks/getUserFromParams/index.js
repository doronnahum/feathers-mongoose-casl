module.exports = function (hook) {
  if (!hook.data) hook.data = {};
  if (!hook.data.user) {
    hook.data.user = hook.params.user && hook.params.user._id;
  }
};
