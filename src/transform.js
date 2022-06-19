/**
 * @module transform
 */

'use strict';

const filtertransform = require('./filtertransform');
const ispredicate = require('./ispredicate');
const maptransform = require('./maptransform');
 
module.exports = function transform(...funcs) {
    
    if( funcs.length === 1 ) return transformer(funcs[0]);

    const transformers = funcs.map(transformer);

    return function transducer(reducer) {
        return transformers.reduceRight(chainreducer, reducer);
    }
}

function chainreducer(reducer, transformer) {
    return transformer(reducer);
}

function transformer(func) {
    return ispredicate(func) ? filtertransform(func) : maptransform(func);
}