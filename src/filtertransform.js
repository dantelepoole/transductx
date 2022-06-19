/**
 * @module filtertransform
 */

'use strict';

const ERR_BAD_PREDICATE = `The filtertransform predicate has type %s. Expected a function.`;
const ERR_BAD_REDUCER = `The reducer has type %s. Expected a function.`;

const fail = require('../lib/fail');
const notfunction = require('../lib/notfunction');
const type = require('../lib/type');

module.exports = function filtertransform(predicate) {

    if( notfunction(predicate) ) fail(ERR_BAD_PREDICATE, type(predicate) );
    
    return function transducer(reducer) {
        
        if( notfunction(reducer) ) fail(ERR_BAD_REDUCER, type(reducer));
        
        return function filtertransformer(accumulator, nextvalue) {
            return predicate(nextvalue) ? reducer(accumulator, nextvalue) : accumulator;
        }
    }
}