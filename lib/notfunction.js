/**
 * @module lib/notfunction
 * @ignore
 */

'use strict';

module.exports = function notfunction(func) {
    return (typeof func !== 'function');
}