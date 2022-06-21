/**
 * @module transform
 */

'use strict';

const ERR_BAD_TRANSFORMER = `The transformer has type %s. Expected a function.`;

const TRANSFORM_REJECT = require('../lib/transformrejectsymbol');

const fail = require('../lib/fail');
const notfunction = require('../lib/notfunction');
const type = require('../lib/type');

module.exports = function transform(...transformers) {

    validatetransformers(transformers);

    const transformercount = transformers.length;

    return function compositetransformer(value) {

        for(let index = 0; index < transformercount; index += 1) {

            const transformer = transformers[index];
            value = transformer(value);

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