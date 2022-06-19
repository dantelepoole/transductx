/**
 * @module lib/tagpredicate
 * @ignore
 */

'use strict';

const PREDICATE_TAG = Symbol.for('transducex/predicate/tag');
const PREDICATE_TAG_PROPERTY_DESCRIPTOR = { value : PREDICATE_TAG }

module.exports = function tagpredicate(func) {
    return Object.defineProperty(func, PREDICATE_TAG, PREDICATE_TAG_PROPERTY_DESCRIPTOR);
}