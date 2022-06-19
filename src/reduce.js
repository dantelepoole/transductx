/**
 * @module reduce
 */

'use strict';

const ERR_BAD_ITERABLE = `The iterable has type %s. Expected an iterable object.`;
const ERR_BAD_REDUCER = `The reducer has type %s. Expected a function.`;

const fail = require('../lib/fail');
const isarray = require('../lib/isarray');
const isfunction = require('../lib/isfunction');
const isiterable = require('../lib/isiterable');
const notfunction = require('../lib/notfunction');
const type = require('../lib/type');

module.exports = function reduce(reducer, initialvalue, iterable) {

    if( notfunction(reducer) ) fail(ERR_BAD_REDUCER, type(reducer));
    else if( isfunction(this) ) reducer = this(reducer);

    return isarray(iterable) ? iterable.reduce(reducer, initialvalue)
         : isiterable(iterable) ? reduceiterable(reducer, initialvalue, iterable)
         : fail(ERR_BAD_ITERABLE, type(iterable));
}

function reduceiterable(reducer, accumulator, iterable) {

    for(const value of iterable) accumulator = reducer(accumulator, value);

    return accumulator;
}