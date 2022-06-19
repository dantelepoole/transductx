/**
 * @module predicate
 */

'use strict';

const ERR_BAD_FUNCTION = `The predicate function has type %s. Expected a function.`;

const fail = require('../lib/fail');
const notfunction = require('../lib/notfunction');
const ispredicate = require('../lib/ispredicate');
const tagpredicate = require('../lib/tagpredicate');
const type = require('../lib/type');

module.exports = function predicate(func) {

    if( ispredicate(func) ) return func;

    if( notfunction(func) ) fail(ERR_BAD_FUNCTION, type(func));

    const predicatename = `predicate ${func.name || '<anonymous>'}`;
    const predicatefunc = { [predicatename] : (...args) => !! func(...args) }[predicatename];

    tagpredicate(predicatefunc);

    return predicatefunc;
}