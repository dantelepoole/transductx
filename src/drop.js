/**
 * @module drop
 */

'use strict';

const TRANSFORM_REJECT = require('../lib/transformrejectsymbol');

const predicate = require('../src/predicate');

const alwaysfalse = ()=>false;

module.exports = function drop(...filtertransformers) {

    if( filtertransformers.length === 0 ) filtertransformers = [alwaysfalse];

    const transformer = predicate(...filtertransformers);

    return function filtertransformer(value) {

        const transformedvalue = transformer(value);

        return (transformedvalue === TRANSFORM_REJECT) ? value : TRANSFORM_REJECT;
    }
}