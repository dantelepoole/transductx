/**
 * @module drop
 */

'use strict';

const TRANSFORM_REJECT = require('../lib/transformrejectsymbol');

const ERR_BAD_FILTER_TRANSFORMER = `The filter transformer has type %s. Expected a function.`;

const fail = require('../lib/fail');
const notfunction = require('../lib/notfunction');
const type = require('../lib/type');

const alwaysfalse = ()=>false;

module.exports = function drop(...filters) {

    validatefilters(filters);

    const filter = compose(filters);

    return function filtertransformer(value) {
        return filter(value) ? TRANSFORM_REJECT : value;
    }
}

function compose(filters) {

    return (filters.length === 0) ? alwaysfalse
         : (filters.length === 1) ? filters[0]
         : value => filters.every( filter => filter(value) );
}

function validatefilters(filters) {
    filters.forEach(validate);
}

function validate(filter) {
    if( notfunction(filter) ) fail(ERR_BAD_FILTER_TRANSFORMER, type(filter));
}