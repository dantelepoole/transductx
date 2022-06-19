/**
 * @module lib/isiterable
 * @ignore
 */

'use strict';

module.exports = function isiterable(iterable) {
    return (typeof iterable?.[Symbol.iterator] === 'function');
}