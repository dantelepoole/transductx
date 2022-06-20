/**
 * @module lib/fail
 * @ignore
 */

'use strict';

const format = require('util').format;

module.exports = function fail(formatmsg, ...formatargs) {

    const errormessage = format(formatmsg, ...formatargs);
    const error = new Error(errormessage);

    error.name = 'TransductxError';

    throw error;
}