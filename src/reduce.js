/**
 * @module reduce
 */

'use strict';

const ERR_BAD_LIST = `The list has type %s. Expected an iterable object or an object with a 'reduce()' method.`;
const ERR_BAD_REDUCER = `The reducer has type %s. Expected a function.`;

const curry = require('../lib/curry');
const fail = require('../lib/fail');
const isfunction = require('../lib/isfunction');
const isiterable = require('../lib/isiterable');
const notfunction = require('../lib/notfunction');
const type = require('../lib/type');

module.exports = curry(3, reduce);

function reduce(reducer, initialvalue, list) {

    if( notfunction(reducer) ) fail(ERR_BAD_REDUCER, type(reducer));

    return isreducable(list) ? list.reduce(reducer, initialvalue)
         : isiterable(list) ? reduceiterable(reducer, initialvalue, list)
         : fail(ERR_BAD_LIST, type(list));
}

function reduceiterable(reducer, accumulator, iterable) {

    for(const item of iterable) accumulator = reducer(accumulator, item);

    return accumulator;
}

function isreducable(list) {
    return isfunction(list?.reduce);
}