/**
 * @module transduce
 */

'use strict';

const ERR_BAD_REDUCER = `The reducer has type %s. Expected a function.`;
const ERR_BAD_TRANSFORMATION = `The transformation has type %s. Expected a function.`;
const TRANSFORM_DROP = Symbol.for('transducex/transform_drop');

const fail = require('../lib/fail');
const notfunction = require('../lib/notfunction');
const reduce = require('./reduce');
const type = require('../lib/type');

module.exports = function transduce(...transformations) {

    const transform = composetransform(transformations);

    function transducer(reducer) {

        if( notfunction(reducer) ) fail(ERR_BAD_REDUCER, type(reducer));

        return function transformreducer(accumulator, nextvalue) {

            nextvalue = transform(nextvalue);

            return (nextvalue === TRANSFORM_DROP) ? accumulator : reducer(accumulator, nextvalue);
        }
    }

    transducer.reduce = reduce;

    return transducer;
}

function composetransform(transformations) {

    transformations.forEach(validatetransformation);

    return function transformvalue(value) {

        for(let index = 0; index < transformations.length; index += 1) {

            value = transformations[index](value);

            if(value === TRANSFORM_DROP) break;
        }

        return value;
    }
}

function validatetransformation(transformation) {
    if( notfunction(transformation) ) fail(ERR_BAD_TRANSFORMATION, type(transformation));
}
