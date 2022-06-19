/**
 * @module ispredicate
 */

'use strict';

const PREDICATE_TAG = Symbol.for('transducex/predicate/tag');

module.exports = function ispredicate(predicate) {
    return (typeof predicate === 'function' && predicate?.[PREDICATE_TAG] === PREDICATE_TAG);
}