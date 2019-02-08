const { Forbidden } = require('@feathersjs/errors');
const isEqual = require('lodash.isequal');

const isRoleIncludesInUsrRules = function(userRole, role){
  const userRoleId = typeof userRole === 'string' ? userRole : userRole._id;
  return userRoleId.toString()  === role._id.toString();
};

function getRolesByTypes (hook, hasUser, userRolesIds, roles, userId, testMode) {
  const userRoles = [];
  const publicRoles = [];
  let blockedRoles = [];
  if(roles){
    roles.forEach(role => {
      if(role.type === 'blocked'){
        if(hasUser && isEqual(role.user, userId)){
          if(role.blockAll){
            hook.app.info(`src/hooks/abilities.js - block ${userId} user by ${role._id} ${role.name} role`);
            if(testMode) {
              hook.params.abilityTestCheckResult = false;
              hook.params.abilityTestCheckRun = true;
              return hook;
            }
            throw new Forbidden('You are not allowed, try to log out and and the try again');
          }else{
            blockedRoles = [...blockedRoles, ...role.roles];
          }
        }
      } else if(role.type === 'private'){
        if(hasUser &&
          userRolesIds.some(userRole => isRoleIncludesInUsrRules(userRole, role))){
          if(!blockedRoles.length || !blockedRoles.includes(role._id)){
            userRoles.push(role);
          }else{
            hook.app.info(`src/hooks/abilities.js - block ${userId} from role ${role._id}`);
          }
        }
      }else if(role.type === 'public'){
        publicRoles.push(role);
      }
    });
  }
  return [userRoles, publicRoles, blockedRoles];
}

module.exports = getRolesByTypes;