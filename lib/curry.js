/**
 * @module lib/curry
 * @ignore
 */

'use strict';

module.exports = function curry(arity, func) {

    const curriedfunction = {
        [func.name] : function(...args) {
            return (args.length < arity) ? curriedfunction.bind(this, ...args) : func.call(this, ...args);
        }
    }[func.name];

    return curriedfunction;
}