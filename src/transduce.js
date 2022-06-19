/**
 * @module transduce
 */

'use strict';

const ERR_BAD_LIST = `The list has type %s. Expected an iterable object.`;

const fail = require('../lib/fail');
const isarray = require('../lib/isarray');
const isiterable = require('../lib/isiterable');
const type = require('../lib/type');

module.exports = function transduce(transducer, reducer, initialvalue, list) {
    
    const transformreducer = transducer(reducer);

    return isarray(list) ? list.reduce(transformreducer, initialvalue)
         : isiterable(list) ? reduceiterable(transformreducer, initialvalue, list)
         : fail(ERR_BAD_LIST, type(list));
}

function reduceiterable(reducer, initialvalue, iterable) {

    let accumulator = initialvalue;

    for(const item of iterable) accumulator = reducer(accumulator, item);

    return accumulator;
}
