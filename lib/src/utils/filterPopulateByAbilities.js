
/* filterPopulateByAbilities.js
  ------------------------------------------------------------------------------
   When request include $populate we need to remove populate that not allowed
   we get the [populateWhitelist] from the rules

   $populate can be:
   -----------------------------
   $populate: 'user,post'
   $populate: 'user post'
   $populate: ['user','post']
   $populate: ['user', {path: 'post', populate: 'categories'}]

   populateWhitelist can be:
   -----------------------------
   ['user','post']
   ['user','post', 'post.categories']
   ['user','post', {path: 'post.categories', select: 'name'}]

   filterPopulateByAbilities() was return only the populate
   inside [$populate] that allowed by the [populateWhitelist]
*/

/**
 * @function getSelectAsArray
 * @description return string/array as array of string
 * string can be split by ',' or ' '
 * @param {array or string} select 
 */
const getSelectAsArray = function(select){
  let selectAsArr;
  if(typeof select === 'string'){
    if(select.includes(',')){
      selectAsArr = select.split(',');
    }else{
      selectAsArr = select.split(' ');
    }
  }else{
    selectAsArr = select;
  }
  return selectAsArr;
};
  
/**
   * @function getPopulateAsArray
   * @description convert populate to a array
   * populate can be:
         * 1 - '$populate': 'user address'
         * 2 - '$populate': ['user','address']
         * 3 - '$populate': 'user,address'
         * 4 - '$populate': [{path: user}, 'address']
         * 5 - '$populate': {path: address}
   * @param {*} populate 
   * @returns array
   */
const getPopulateAsArray = function(populate){
  let populateArr;
  /**
         * parse populate to array
         */
  if(typeof populate === 'string'){
    const splitBy = populate.includes(',') ? ',' : ' ';
    populateArr = populate.split(splitBy);
  }else if(Array.isArray(populate)){
    populateArr = [...populate];
  }else if(typeof populate === 'object'){
    populateArr = [Object.assign({}, populate)];
  }
  return populateArr;
};
  
/**
   * @function findPopulateAbilityItem
   * @description find the item in the [populateWhitelist] that equal to [populate] or
   * when the item in the [populateWhitelist] is object then if his path equal to [populate]
   * @param {string} populate 
   * @param {array} populateWhitelist 
   * @example
   * findPopulateAbilityItem('user',[{path: 'users'}]) === {path: 'users'};
   * findPopulateAbilityItem('user', ['users']) === 'users';
   */
const findPopulateAbilityItem = function(populate, populateWhitelist){
  return populateWhitelist.find(item => {
    if(typeof item === 'string'){
      return item === populate;
    }else{
      return item.path === populate;
    }
  });
};
  
/**
   * @function checkInsidePopulate
   * @description used by [filterPopulateByAbilities] to call itself with prefix
   * to check deep populate
   * @param {string} populateArr
   * @param {array} populateWhitelist
   * @param {string} prefix
   * @example
   * checkInsidePopulate('post', ['user', 'user.post'], 'user')
   */
const checkInsidePopulate = function(populate, populateWhitelist, prefix){
  const _prefix = (prefix && prefix.length) ? `${prefix}.` : '';
  return filterPopulateByAbilities(populate, populateWhitelist, _prefix);
};
  
/**
   * @function filterPopulateByAbilities
   * @description filter from [populateArray] the populates that not allowed by the [populateWhitelist]
   * @param {array} populateArray
   * @param {array} populateWhitelist
   * @param {string} prefix only when [checkInsidePopulate] is call this method
   * @example
   * const populateArray = ['user', {path: 'office', populate: 'organizations'}]
   * const populateWhitelist = ['user', 'office', 'office.banks']
   * const populate = filterPopulateByAbilities(populateArray, populateWhitelist) === ['users', {path: 'office'}];
   * @returns {array}
   */
const filterPopulateByAbilities = function (populate, populateWhitelist, prefix = ''){
  let populateArray = getPopulateAsArray(populate);
  return populateArray.map(populateItem => {
      
    /**
       * populateItem is string
       */
    if(typeof populateItem === 'string'){
        
      /**
         * find populateItem inside [populateWhitelist]
         */
      const ability = findPopulateAbilityItem(prefix + populateItem, populateWhitelist);
        
      /**
         * ability not found
         * -----------------------------------------------------------------
         * remove the populateItem from populateArray
         * -----------------------------------------------------------------
         */
      if(!ability) return null;
  
      /**
         * ability found
         * -----------------------------------------------------------------
         * ability found and includes select
         * populate allowed with select specific fields
         * -----------------------------------------------------------------
         */
      if(ability && ability.select){
        return Object.assign({}, ability, {path: populateItem});
      }
  
      /**
         * ability found
         * -----------------------------------------------------------------
         * populate allowed
         * -----------------------------------------------------------------
         */
      return populateItem;
    }
      
    /**
       * populateItem is object
       * -----------------------------------------------------------------
       * example
       * populateItem = {path: 'user', populate: {path: 'posts', select: 'title'}}
       * -----------------------------------------------------------------
       */
    else{
      const {path, populate, select} = populateItem;
        
      /**
         * Check deep populate
         */
      if(populate){
          
        /**
           * Filter deep populate base of the populateWhitelist
           */
        const _populate = checkInsidePopulate(populate, populateWhitelist, prefix + path);
  
        /**
           * allow Deep Populate when [_populate] was include items
           */
        const allowDeepPopulate = _populate && _populate.length;
  
        /**
           * override deep populate
           * -----------------------------------------------------------------
           * override the current deep populate with the [_populate] that include
           * only populate by the abilities
           * -----------------------------------------------------------------
           */
        if(allowDeepPopulate){
          populateItem.populate = _populate;
        }
          
        /**
           * remove deep populate when not allowed
           */
        else{
          delete populateItem.populate;
        }
      }
  
      /**
         * check populate path
         */
      const ability = findPopulateAbilityItem(prefix + path, populateWhitelist);
  
      /**
         * ability not found
         * -----------------------------------------------------------------
         * remove the populateItem from populateArray
         * -----------------------------------------------------------------
         */
      if(!ability) return false;
  
      /**
         * ability found
         * -----------------------------------------------------------------
         * ability found and includes select
         * populate allowed with select specific fields
         * -----------------------------------------------------------------
         */
      if(ability && ability.select){
        populateItem.select = select
          ? getSelectAsArray(select).filter(item => ability.select.includes(item)) // request include select, filter only select that allowed by the ability
          : ability.select; // request not include select, select fields by the ability.select
      }
      return populateItem;
    }
  }).filter(item => !!item);
};

module.exports = filterPopulateByAbilities;