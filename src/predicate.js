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

    return function filtertransformer(value) {
        return filter(value) ? value : TRANSFORM_REJECT;
    }
}

function compose(filters) {

    return (filters.length === 1) ? filters[0]
         : value => filters.every( filter => filter(value) );
}

function validatefilters(filters) {
    filters.forEach(validate);
}

function validate(filter) {
    if( notfunction(filter) ) fail(ERR_BAD_FILTER_TRANSFORMER, type(filter));
}