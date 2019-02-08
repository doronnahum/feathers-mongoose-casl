const { AbilityBuilder, Ability } = require('@casl/ability');
const {compiledRolesTemplate} = require('../../../utils/helpers');
const clone = require('lodash.clonedeep');
const TYPE_KEY = Symbol.for('type');

function subjectName(subject) {
  if (!subject || typeof subject === 'string') {
    return subject;
  }
  return subject[TYPE_KEY];
}

function defineAbilities(user, userRoles, publicRoles, defaultRoles = []) {
  const { rules, can } = AbilityBuilder.extract();
  let _defaultRoles = clone(defaultRoles);
  // public roles from DB
  if(publicRoles){
    let _publicRoles = user ? compiledRolesTemplate(publicRoles, {user}) : publicRoles;
    _publicRoles.forEach(function({actions, subject, conditions, fields}){
      can(actions, subject, fields, conditions );
    });
  }
  
  
  if(user){
    _defaultRoles = compiledRolesTemplate(_defaultRoles, {user});
  }
  _defaultRoles.forEach(function({actions, subject, conditions, fields}){
    can(actions, subject, fields, conditions );
  });
  // Roles from DB
  // This is dynamic roles that saved on user document.
  // When user login this data is saved on JWT and available in each query
  if (user && userRoles) {
    const roles = compiledRolesTemplate(userRoles, {user});
    roles.forEach(function({actions, subject, conditions, fields}){
      can(actions, subject, fields, conditions );
    });
  }
  
  return new Ability(rules, { subjectName });
}

module.exports = defineAbilities;