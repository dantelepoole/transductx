/**
 * @module transform
 */

'use strict';

const ERR_BAD_ITERABLE = `The iterable has type %s. Expected an iterable object.`;
const ERR_BAD_TRANSFORMATION = `The transformation has type %s. Expected a function.`;
const TRANSFORM_REJECT = Symbol.for('transducex/transform_reject');

const fail = require('../lib/fail');
const isarray = require('../lib/isarray');
const notiterable = require('../lib/notiterable');
const notfunction = require('../lib/notfunction');
const type = require('../lib/type');

module.exports = function transform(...transformations) {

    const transformvalue = composetransform(transformations);

    return function transformer(iterable) {

        if( notiterable(iterable) ) fail(ERR_BAD_ITERABLE, type(iterable));

        const transformiterable = {

            [Symbol.iterator] : function* () {

                for(let value of iterable) {
                    
                    value = transformvalue(value);
                    
                    if( value !== TRANSFORM_REJECT ) yield value;
                }
            }
        }

        return isarray(iterable) ? Array.from(transformiterable) : transformiterable;
    }
}

function composetransform(transformations) {

    transformations.forEach(validatetransformation);

    return function transformvalue(value) {

        for(let index = 0; index < transformations.length; index += 1) {

            value = transformations[index](value);

            if(value === TRANSFORM_REJECT) break;
        }

        return value;
    }
}

function validatetransformation(transformation) {
    if( notfunction(transformation) ) fail(ERR_BAD_TRANSFORMATION, type(transformation));
}