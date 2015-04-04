define(function () {
    'use strict';

    var LoggerLevel = Logger.LoggerLevel;
    var is = LoggerLevel.is;

    module('LoggerLevel');

    // === //

    test('LoggerLevel constructor.', function () {
        var makeThrows = function (executeMe, log) {
            throws(executeMe, TypeError, 'LoggerLevel constructor throws a TypeError when ' + log);
        };

        expect(5);
        makeThrows(LoggerLevel, 'not given any arguments.');
        makeThrows(function () {
            new LoggerLevel(undefined, 42);
        }, 'not given a level name.');
        makeThrows(function () {
            new LoggerLevel('level-name');
        }, 'not given a priority level.');
        makeThrows(function () {
            new LoggerLevel('', 42);
        }, 'the level name is an empty string.');
        makeThrows(function () {
            new LoggerLevel('FART32', 42);
        }, 'the level name consists of non-alphabet characters.');
    });

    test('LoggerLevel#is', function () {
        expect(4);
        ok(is(new LoggerLevel('test', 99)), 'LoggerLevel#is returns true when given a LoggerLevel as an argument.');
        ok(!is(), 'LoggerLevel#is returns false for no arguments.');
        ok(!is('string'), 'LoggerLevel#is returns false for nonsensical arguments.');
        ok(!is(LoggerLevel), 'LoggerLevel#is returns false when given the LoggerLevel constructor as an argument.');
    });

    // === //

    test('Predefined LoggerLevels.', function () {
        var available = false;

        Object.keys(Logger).forEach(function (property) {
            if (is(Logger[property])) {
                available = true;
                ok(true, 'Logger.' + Logger[property].name() + ' is defined.');
            }
        });

        ok(available, 'Predefined LoggerLevels are available.');
    });

    // === //

    test('LoggerLevel instances.', function () {
        var instance = Logger.TRACE;
        expect(3);
        ok(typeof instance.name() === 'string', 'LoggerLevel.prototype.name returns {string}.');
        ok(typeof instance.level() === 'number', 'LoggerLevel.prototype.level returns {number}.');
        ok(instance.valueOf() === instance.level(), 'LoggerLevel.prototype.valueOf returns the level.');
    });

    // Continue.
    testNextModule();
});
