/**
 * @module transmap
 */

'use strict';

const ERR_BAD_LIST = `The list has type %s. Expected an iterable object.`;
const ERR_BAD_TRANSFORMER = `The transformer has type %s. Expected a function.`;

const TRANSFORM_REJECT = require('../lib/transformrejectsymbol');

const curry = require('../lib/curry');
const fail = require('../lib/fail');
const isiterable = require('../lib/isiterable');
const notfunction = require('../lib/notfunction');
const notiterable = require('../lib/notiterable');
const transform = require('./transform');
const type = require('../lib/type');

module.exports = curry(2, transmap);

function transmap(transformer, list) {

    if( isiterable(transformer) ) transformer = transform(...transformer);
    else if( notfunction(transformer) ) fail(ERR_BAD_TRANSFORMER, type(transformer));
    
    if( notiterable(list) ) fail(ERR_BAD_LIST, type(list));

    return {

        [Symbol.iterator] : function* () {

            for(let value of list) {

                value = transformer(value);
                
                if( value !== TRANSFORM_REJECT ) yield value;
            }
        }
    }
}