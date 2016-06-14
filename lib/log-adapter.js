'use strict';

var flatten = require('flat');
var Promise = require('bluebird');
var os = require('os');

///////////////////////////////////////////////////////////////////////////////
// CONSTRUCTOR
///////////////////////////////////////////////////////////////////////////////

/**
 * Constructs the `LogAdapter`.
 *
 * @param {(logger|console)} [logger=console] - Logger object.
 * @returns {LogAdapter} - The instance.
 * @constructor
 * @example
 * var logger = ...; // the 3rd party logger
 * var LogAdapter = require('log-adapter');
 * var Foo = require('foo'); // your object accepting the 3rd party logger
 * var foo = new Foo(logger);
 *
 * // -------------------------------------------------------------------------
 * // Foo constructor using 3rd party:
 * function Foo(logger) { // inject
 *    this.logger = new LogAdapter(logger);
 *    this.logger.info('Foo constructed!');
 * }
 * // -------------------------------------------------------------------------
 * // Foo constructor using 'console' as fallback:
 * var logger = undefined;
 * function Foo(logger) { // injection undefined!
 *    this.logger = new LogAdapter(logger);
 *    this.logger.info('Foo constructed!');
 * }
 * // -------------------------------------------------------------------------
 * @class Class which defines a `logger` adapter instance usable in your modules.
 */
function LogAdapter(logger) {

    /**
     * The logger instance.
     * @member {(logger|console)}
     * @private
     */
    this.logInstance = logger || console;
}

LogAdapter.prototype = {};
LogAdapter.prototype.constructor = LogAdapter;

/**
 * Appends the given `toAppend` to the `appendee` string and adds newlines.
 * @param {string} appendee    - The origin which is appended.
 * @param {string} toAppend    - The content to append.
 * @param {number} [amount=1]  - The amount of newlines to add.
 * @returns {Promise.<string>} - This `appendee` for concatenated calls.
 * @private
 */
function append(appendee, toAppend, amount) {
    appendee += toAppend;
    return nl(appendee, amount);
}

/**
 * Adds newlines of the given `amount` to `appendee`.
 * @param {string} appendee    - The origin which is appended.
 * @param {number} [amount=1]  - The amount of newlines to add.
 * @returns {Promise.<string>} - This `appendee` for concatenated calls.
 * @private
 */
function nl(appendee, amount) {
    return new Promise (function (resolve) {
        amount = (amount === undefined)
            ? 2
            : amount;
        var newlines = '';
        for (var i = amount; i > 0; i--) {
            newlines += os.EOL;
        }
        appendee += newlines;
        resolve(appendee);
    });
}

///////////////////////////////////////////////////////////////////////////////
// PUBLIC LOGGER METHODS
///////////////////////////////////////////////////////////////////////////////

/**
 * Log the given message with INFO level.
 *
 * @param {string} msg - The message to log.
 * @example
 * var logger = ...;
 * var logAdapter = new LogAdapter(logger);
 * var msg = '...';
 * logAdapter.info(msg);
 * @public
 */
LogAdapter.prototype.info = function (msg) {
    this.logInstance.info(msg);
};

/**
 * Log the the given message with DEBUG level (if logger supports it, else with INFO).
 *
 * @param {string} msg - The message to log.
 * @example
 * var logger = ...;
 * var logAdapter = new LogAdapter(logger);
 * var msg = '...';
 * logAdapter.debug(msg);
 * @public
 */
LogAdapter.prototype.debug = function (msg) {
    if (this.logInstance.debug && typeof this.logInstance.debug === 'function') {
        this.logInstance.debug(msg);
    } else {
        this.info(msg);
    }
};

/**
 * Log the the given message with TRACE level (if logger supports it, else with DEBUG).
 *
 * @param {string} msg - The message to log.
 * @example
 * var logger = ...;
 * var logAdapter = new LogAdapter(logger);
 * var msg = '...';
 * logAdapter.trace(msg);
 * @public
 * @see {@link #debug}
 */
LogAdapter.prototype.trace = function (msg) {
    if (this.logInstance.trace && typeof this.logInstance.trace === 'function') {
        this.logInstance.trace(msg);
    } else {
        this.debug(msg);
    }
};

/**
 * Log the the given message with ERROR level.
 *
 * @param {string} msg - The message to log.
 * @example
 * var logger = ...;
 * var logAdapter = new LogAdapter(logger);
 * var msg = '...';
 * logAdapter.error(msg);
 * @public
 */
LogAdapter.prototype.error = function (msg) {
    this.logInstance.error(msg);
};

/**
 * Log the given `options` with INFO level using a flatten style. The key-values are separated by a newline.
 * @param {object} options    - The properties to log with INFO.
 * @param {boolean} [keySort=false] - Whether to sort keys by natural order before logging.
 * @returns A Promise containing the passed `options` object.
 * @example
 * var logger = ...;
 * var logAdapter = new LogAdapter(logger);
 * var options = {
 *     ...
 * };
 * logAdapter.verboseOptions(options)
 *     .then(function (options) {
 *         ...
 *     });
 * @public
 */
LogAdapter.prototype.verboseOptions = function (options, keySort) {
    var self = this;
    options = options || {};

    var toLog = 'options: ' + os.EOL;
    var flattenedOptions = flatten(options);
    var keys = Object.keys(flattenedOptions);
    if (keySort) {
        keys = keys.sort();
    }
    return Promise.each(keys, function(key, index, length) {
            self.logInstance.info('options key::: ' + key);
            var entry = key + ' = ' + flattenedOptions[key];
            return append(toLog, entry, 1);
        })
        .then(function (result) {
            return nl(toLog);
        })
        .then(function (result) {
            self.logInstance.info(result);
            return options;
        });


    //return new Promise.resolve(function (resolve) {
    //    self.info('origin: ' + options.origin);
    //    self.info('target: ' + options.target);
    //    self.info('src:    ' + options.src);
    //    self.info('dest:   ' + options.dest);
    //    self.info('indent: ' + options.indent);
    //    return options;
    //});
};

exports = module.exports = LogAdapter;
