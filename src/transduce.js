/**
 * @module transduce
 */

'use strict';

const ERR_BAD_TRANSFORMER = `The transformer has type %s. Expected a function.`;
const ERR_BAD_REDUCER = `The reducer has type %s. Expected a function`;

const TRANSFORM_REJECT = require('../lib/transformrejectsymbol');

const curry = require('../lib/curry');
const fail = require('../lib/fail');
const isiterable = require('../lib/isiterable');
const notfunction = require('../lib/notfunction');
const transform = require('./transform');
const type = require('../lib/type');

module.exports = curry(2, transduce);

function transduce(transformer, reducer) {

    if( isiterable(transformer) ) transformer = transform(...transformer);
    else if( notfunction(transformer) ) fail(ERR_BAD_TRANSFORMER, type(transformer));

    if( notfunction(reducer) ) fail(ERR_BAD_REDUCER, type(reducer));

    return function transducer(accumulator, nextvalue) {

        nextvalue = transformer(nextvalue);
        return (nextvalue === TRANSFORM_REJECT) ? accumulator : reducer(accumulator, nextvalue);
    }
}