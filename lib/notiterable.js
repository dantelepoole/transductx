/**
 * @module lib/notiterable
 * @ignore
 */

'use strict';

module.exports = function notiterable(iterable) {
    return (typeof iterable?.[Symbol.iterator] !== 'function');
}