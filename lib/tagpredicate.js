/**
 * @module lib/tagpredicate
 * @ignore
 */

'use strict';

const ERR_BAD_FUNCTION = `The predicate function has type %s. Expected a function.`;

const PREDICATE_TAG = Symbol.for('transducex/predicate/tag');
const PREDICATE_TAG_PROPERTY_DESCRIPTOR = { value : PREDICATE_TAG }

const fail = require('./fail');
const notfunction = require('./notfunction');
const type = require('./type');

const setpredicatetag = func => Object.defineProperty(func, PREDICATE_TAG, PREDICATE_TAG_PROPERTY_DESCRIPTOR);

module.exports = function tagpredicate(func) {

    if( notfunction(func) ) fail(ERR_BAD_FUNCTION, type(func));

    setpredicatetag(func);

    return func;
}