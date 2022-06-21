/**
 * @module lib/type
 * @ignore
 */

'use strict';

const prototostring = Object.prototype.toString.call.bind(Object.prototype.toString);

module.exports = function type(value) {
    return (typeof value === 'object') ? prototostring(value).slice(8,-1) : typeof value;
}