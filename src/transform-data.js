"use strict"

function dateReviver(key, value) {
  if (typeof value === 'string') {
    var a;
    a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
    if (a) {
      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
    }
  }
  return value;
};

/**
 * This method is for the storage connector, to allow queries to happen more naturally
 * do not use in cache connectors
 *
 * Inverts the data from the deepstream structure to reduce nesting.
 *
 * { _v: 1, _d: { name: 'elasticsearch' } } -> { name: 'elasticsearch', __ds = { _v: 1 } }
 *
 * @param  {String} value The data to save
 *
 * @private
 * @returns {Object} data
 */
module.exports.transformValueForStorage = function ( value ) {
  value = JSON.parse( JSON.stringify( value ), dateReviver )

  var data = value._d
  delete value._d

  if( data instanceof Array ) {
    data = {
      __dsList: data,
      __ds: value
    }
  } else {
    data.__ds = value
  }

  return data
}

/**
 * This method is for the storage connector, to allow queries to happen more naturally
 * do not use in cache connectors
 *
 * Inverts the data from the stored structure back to the deepstream structure
 *
 * { name: 'elasticsearch', __ds = { _v: 1 } } -> { _v: 1, _d: { name: 'elasticsearch' } }
 *
 * @param  {String} value The data to transform
 *
 * @private
 * @returns {Object} data
 */
module.exports.transformValueFromStorage = function( value ) {
  value = JSON.parse( JSON.stringify( value ), dateReviver )

  var data = value.__ds
  delete value.__ds

  if( value.__dsList instanceof Array ) {
    data._d = value.__dsList
  } else {
    data._d = value
  }

  return data
}
