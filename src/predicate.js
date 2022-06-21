/**
 * @module predicate
 */

'use strict';

const TRANSFORM_REJECT = Symbol.for('transductx/transform/reject');

const ERR_BAD_FILTER_TRANSFORMER = `The filter transformer has type %s. Expected a function.`;

const fail = require('../lib/fail');
const notfunction = require('../lib/notfunction');
const type = require('../lib/type');

module.exports = function predicate(...filtertransformers) {

    validatefilters(filtertransformers);

    const filter = compose(filtertransformers);

    return function transformer(value) {
        return filter(value) ? value : TRANSFORM_REJECT;
    }
}

function compose(filters) {

    if( filters.length === 1 ) return filters[0];

    return function filter(value) {

        for(let index = 0; index < filters.length; index += 1) if( ! filters[index](value) ) return false;

        return true;
    }
}

function validatefilters(filters) {
    filters.forEach(validate);
}

function validate(filter) {
    if( notfunction(filter) ) fail(ERR_BAD_FILTER_TRANSFORMER, type(filter));
}