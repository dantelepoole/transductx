/**
 * @module maptransform
 */

'use strict';

const ERR_BAD_MAPFUNC = `The maptransform function has type %s. Expected a function.`;
const ERR_BAD_REDUCER = `The reducer has type %s. Expected a function.`;

const fail = require('../lib/fail');
const notfunction = require('../lib/notfunction');
const type = require('../lib/type');

module.exports = function maptransform(func) {

    if( notfunction(func) ) fail(ERR_BAD_MAPFUNC, type(func) );

    return function transducer(reducer) {

        if( notfunction(reducer) ) fail(ERR_BAD_REDUCER, type(reducer));
        
        return function transformreducer(accumulator, nextvalue) {
            return reducer(accumulator, func(nextvalue));
        }
    }
}