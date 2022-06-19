/**
 * @module lib/partial
 * @ignore
 */

'use strict';

module.exports = function partial(func, ...args) {
    return func.bind(null, ...args);
}