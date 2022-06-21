/**
 * @module lib/negate
 * @ignore
 */

'use strict';

module.exports = function negate(predicate) {

    return function predicatecomplement(value) {
        return ! predicate(value);
    }
}