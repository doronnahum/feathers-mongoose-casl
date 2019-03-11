module.exports = function (hook) {
  if(!hook.data) hook.data = {};
  hook.data.user = hook.data && hook.data.user || (hook.params.user && hook.params.user._id);
};