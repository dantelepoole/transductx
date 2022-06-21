/**
 * @module transform
 */

'use strict';

const ERR_BAD_TRANSFORMER = `The transformer has type %s. Expected a function.`;
const TRANSFORM_REJECT = Symbol.for('transductx/transform/reject');

const fail = require('../lib/fail');
const notfunction = require('../lib/notfunction');
const type = require('../lib/type');

module.exports = function transform(...transformers) {

    validatetransformers(transformers);

    const transformercount = transformers.length;

    return function transformer(value) {

        for(let index = 0; index < transformercount; index += 1) {

            value = transformers[index](value);

            if(value === TRANSFORM_REJECT) break;
        }

        return value;
    }
}

function validatetransformers(transformers) {
    transformers.forEach(validate);
}

function validate(transformer) {
    if( notfunction(transformer) ) fail(ERR_BAD_TRANSFORMER, type(transformer));
}