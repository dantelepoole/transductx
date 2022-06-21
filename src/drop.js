/**
 * @module drop
 */

'use strict';

const negate = require('../lib/negate');
const predicate = require('./predicate');

module.exports = function drop(...filters) {

    const negatedfilters = filters.map(negate);
    return predicate(...negatedfilters);
}