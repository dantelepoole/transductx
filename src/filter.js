/**
 * @module filter
 */

'use strict';

const TRANSFORM_REJECT = Symbol.for('transducex/transform_reject');

const ERR_BAD_PREDICATE = `The predicate function has type %s. Expected a function.`;

const fail = require('../lib/fail');
const notfunction = require('../lib/notfunction');
const type = require('../lib/type');

module.exports = function filter(predicate) {

    if( notfunction(predicate) ) fail(ERR_BAD_PREDICATE, type(predicate));

    return function filtertransform(value) {
        return predicate(value) ? value : TRANSFORM_REJECT;
    }
}