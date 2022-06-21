/**
 * @module lib/curry
 * @ignore
 */

'use strict';

const ARITY_NONE = undefined;
const ERR_BAD_ARITY = `The curry arity has type %s. Expected a number.`;
const ERR_BAD_FUNCTION = `The curry function has type %s. Expected a function.`;
const TYPE_NUMBER = 'number';

const fail = require('../lib/fail');
const notfunction = require('../lib/notfunction');
const type = require('../lib/type');

module.exports = function curry(arity, func) {

    if( arguments.length === 1 ) [arity, func] = [ARITY_NONE, arity];

    if( notfunction(func) ) fail(ERR_BAD_FUNCTION, type(func));

    arity = (arity === ARITY_NONE) ? func.length
          : (typeof arity === TYPE_NUMBER) ? arity
          : fail(ERR_BAD_ARITY, type(arity));

    // the following rather awkward way of defining the curried function allows us set it's name dynamically
    // to facilitate debugging
    const curriedfunction = {
        [func.name] : function(...args) {
            return (args.length < arity) ? curriedfunction.bind(this, ...args) : func.call(this, ...args);
        }
    }[func.name];

    return curriedfunction;
}