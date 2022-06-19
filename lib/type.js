/**
 * @module lib/type
 * @ignore
 */

'use strict';

module.exports = function type(value) {
    return (typeof value === 'object') ? Object.prototype.toString.call(value).slice(8,-1) : typeof value;
}