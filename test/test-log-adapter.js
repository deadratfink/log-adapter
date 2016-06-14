'use strict';

var LogAdapter = require('../index');
var assert = require('assert');

/**
 * @classdesc This unit test suite checks the validity and correctness of {@link LogAdapter} class.
 */
describe('Executing \'log-adapter\' test suite.', function () {

    var infoMsg;
    var debugMsg;
    var traceMsg;
    var errorMsg;
    var verboseResultArray = [];
    var logAdapter;

    var INFO = 'INFO';
    var DEBUG = 'DEBUG';
    var TRACE = 'TRACE';
    var ERROR = 'ERROR';

    /**
     * A mock logger.
     *
     * @type {{info: mockLogger.info, debug: mockLogger.debug, error: mockLogger.error}}
     * @private
     */
    var mockLogger = {
        info: function (msg) {
            infoMsg = msg;
        },
        debug: function (msg) {
            debugMsg = msg;
        },
        trace: function (msg) {
            traceMsg = msg;
        },
        error: function (msg) {
            errorMsg = msg;
        }
    };

    var mockLoggerWithoutDebugFunction = {
        info: function (msg) {
            infoMsg = msg;
        },
        trace: function (msg) {
            traceMsg = msg;
        },
        error: function (msg) {
            errorMsg = msg;
        }
    };

    var mockLoggerWithoutTraceFunction = {
        info: function (msg) {
            infoMsg = msg;
        },
        debug: function (msg) {
            debugMsg = msg;
        },
        error: function (msg) {
            errorMsg = msg;
        }
    };

    var mockLoggerWithVerboseFunction = {
        info: function (msg) {
            verboseResultArray.push(msg);
        }
    };

    describe('Testing LogAdapter with mockLogger', function () {

        /**
         * Resets the mock logger message targets.
         */
        beforeEach(function () {
            infoMsg = undefined;
            debugMsg = undefined;
            traceMsg = undefined;
            errorMsg = undefined;
            logAdapter = new LogAdapter(mockLogger);
        });

        var expected = INFO;
        it('should log with ' + expected, function (done) {
            logAdapter.info(expected);
            assert.equal(infoMsg, expected, 'logger message should contain value ' + expected);
            done();
        });

        expected = DEBUG;
        it('should log with ' + expected, function (done) {
            logAdapter.debug(expected);
            assert.equal(debugMsg, expected, 'logger message should contain value ' + expected);
            done();
        });

        expected = TRACE;
        it('should log with ' + expected, function (done) {
            logAdapter.trace(expected);
            assert.equal(traceMsg, expected, 'logger message should contain value ' + expected);
            done();
        });

        expected = ERROR;
        it('should log with ' + expected, function (done) {
            logAdapter.error(expected);
            assert.equal(errorMsg, expected, 'logger message should contain value ' + expected);
            done();
        });

        var verboseExpected = {
            origin: 'origin',
            target: 'target',
            src: 'src',
            dest: 'dest',
            indent: 'indent'
        };

        it('should log options', function (done) {
            logAdapter = new LogAdapter(mockLoggerWithVerboseFunction);
            logAdapter.verboseOptions(verboseExpected)
                .then(function (options) {
                    assert.equal(options, verboseExpected, 'passed options: ' + JSON.stringify(options, null, 4) + ' should equal logged options: ' + JSON.stringify(verboseExpected, null, 4));
                    assert(verboseResultArray.indexOf('origin = ' + verboseExpected.origin) > -1, 'logger verboseResultArray should contain value ' + 'origin: ' + verboseExpected.origin);
                    assert(verboseResultArray.indexOf('target = ' + verboseExpected.target) > -1, 'logger verboseResultArray should contain value ' + 'target: ' + verboseExpected.target);
                    assert(verboseResultArray.indexOf('src = ' + verboseExpected.src)    > -1, 'logger verboseResultArray should contain value ' + 'src:    ' + verboseExpected.src);
                    assert(verboseResultArray.indexOf('dest = ' + verboseExpected.dest)   > -1, 'logger verboseResultArray should contain value ' + 'dest:   ' + verboseExpected.dest);
                    assert(verboseResultArray.indexOf('indent = ' + verboseExpected.indent) > -1, 'logger verboseResultArray should contain value ' + 'indent: ' + verboseExpected.indent);
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });

    });

    describe('Testing LogAdapter with mockLoggerWithoutDebugFunction', function () {

        /**
         * Resets the mock logger message targets.
         */
        beforeEach(function () {
            infoMsg = undefined;
            debugMsg = undefined;
            traceMsg = undefined;
            errorMsg = undefined;
            logAdapter = new LogAdapter(mockLoggerWithoutDebugFunction);
        });

        var expected = INFO;
        it('should log with ' + expected, function (done) {
            logAdapter.info(expected);
            assert.equal(infoMsg, expected, 'logger message should contain value ' + expected);
            done();
        });

        expected = DEBUG;
        it('should log with ' + expected, function (done) {
            logAdapter.debug(expected);
            assert.equal(infoMsg, expected, 'logger message should contain value ' + expected);
            done();
        });

        expected = ERROR;
        it('should log with ' + expected, function (done) {
            logAdapter.error(expected);
            assert.equal(errorMsg, expected, 'logger message should contain value ' + expected);
            done();
        });

    });

    describe('Testing LogAdapter with mockLoggerWithoutTraceFunction', function () {

        /**
         * Resets the mock logger message targets.
         */
        beforeEach(function () {
            infoMsg = undefined;
            debugMsg = undefined;
            errorMsg = undefined;
            logAdapter = new LogAdapter(mockLoggerWithoutTraceFunction);
        });

        var expected = INFO;
        it('should log with ' + expected, function (done) {
            logAdapter.info(expected);
            assert.equal(infoMsg, expected, 'logger message should contain value ' + expected);
            done();
        });

        expected = TRACE;
        it('should log with ' + expected, function (done) {
            logAdapter.trace(expected);
            assert.equal(debugMsg, expected, 'logger message should contain value ' + expected);
            done();
        });

        expected = ERROR;
        it('should log with ' + expected, function (done) {
            logAdapter.error(expected);
            assert.equal(errorMsg, expected, 'logger message should contain value ' + expected);
            done();
        });

    });

});
