/**
 * @module transducex
 */

'use strict';

const ERR_BAD_REDUCER = `The reducer has type %s. Expected a function.`;
const ERR_BAD_TRANSFORMATION = `The transformation has type %s. Expected a function.`;
const TRANSFORM_DROP = Symbol('transducex/transform_drop');

const fail = require('../lib/fail');
const isfunction = require('../lib/isfunction');
const ispredicate = require('../lib/ispredicate');
const notfunction = require('../lib/notfunction');
const reduce = require('./reduce');
const type = require('../lib/type');

module.exports = function transducex(...transformations) {

    const transform = compose(transformations);

    const transducer = function transducer(reducer) {

        if( notfunction(reducer) ) fail(ERR_BAD_REDUCER, type(reducer));

        return function transformreducer(accumulator, nextvalue) {

            nextvalue = transform(nextvalue);

            return (nextvalue === TRANSFORM_DROP) ? accumulator : reducer(accumulator, nextvalue);
        }
    }

    transducer.reduce = reduce;

    return transducer;
}

function compose(transformations) {

    const transformers = transformations.map(transformer);

    return function transform(value) {

        for(let index = 0; index < transformers.length; index += 1) {

            value = transformers[index](value);

            if(value === TRANSFORM_DROP) break;
        }

        return value;
    }
}

function transformer(transformation) {

    return ispredicate(transformation) ? filtertransformer(transformation)
         : isfunction(transformation) ? transformation
         : fail(ERR_BAD_TRANSFORMATION, type(transformation));
}

function filtertransformer(predicate) {

    return function filtertransform(value) {
        return predicate(value) ? value : TRANSFORM_DROP;
    }
}
