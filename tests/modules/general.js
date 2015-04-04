define(function () {
    'use strict';

    var NAME = 'test-module';
    var instance = null;
    var lifecycle = {
        setup: function () {
            instance = new Logger(NAME).enable();
            Logger.setLevel(Logger.TRACE).enable();
        },
        teardown: function () {
            instance = null;
        }
    };

    module('General', lifecycle);

    // === //

    test('Logger constructor.', function () {
        var make = function (parameter) {
            return function () {
                Logger.get(parameter);
            };
        };

        expect(6);
        ok(new Logger(NAME) instanceof Logger, 'new Logger returns a Logger instance.');
        ok(Logger.get(NAME) instanceof Logger, 'Logger.get returns a Logger instance.');
        ok(Logger.get(NAME, Logger.FATAL).level() === Logger.FATAL, 'Logger constructor sets the LoggerLevel when provided.');
        ok(Logger.get(NAME, 'fart').level() === Logger.TRACE, 'Logger defaults an instance to DEBUG when given an invalid LoggerLevel.');
        throws(make(), TypeError, 'Logger constructor throws a TypeError when not given a module name.');
        throws(make(''), TypeError, 'Logger constructor throws a TypeError when given an empty string.');
    });

    // === //

    test('Get the module name.', function () {
        expect(1);
        ok(instance.name() === NAME, 'Logger.prototype.name returns the proper module name.');
    });

    // === //

    test('Setting the instance LoggerLevel.', function () {
        expect(2);
        ok(instance.level() === Logger.TRACE, 'Logger.prototype.level returns DEBUG as default prior to any setting.');
        ok(instance.setLevel(Logger.INFO).level() === Logger.INFO, 'Logger.prototype.level returns the newly set level.');
    });

    // === //

    test('Setting the global LoggerLevel.', function () {
        expect(2);
        ok(Logger.level() === Logger.TRACE, 'Logger.level returns DEBUG as default prior to any setting.');
        ok(Logger.setLevel(Logger.INFO).level() === Logger.INFO, 'Logger.setLevel returns the newly set level.');
    });

    // === //

    test('Controlling global logging.', function () {
        expect(4);
        // Enabling.
        ok(Logger.enable() === Logger, 'Logger.enable returns Logger.');
        ok(Logger.isEnabled(), 'Logger.enable enables logging globally.');
        // Disabling.
        ok(Logger.disable() === Logger, 'Logger.disable returns Logger.');
        ok(!Logger.isEnabled(), 'Logger.disable disables logging globally.');
    });

    // === //

    test('Controlling instance logging.', function () {
        expect(4);
        // Enabling.
        ok(instance.enable() === instance, 'Logger.prototype.enable returns a self reference.');
        ok(instance.isEnabled(), 'Logger.prototype.enable enables logging for the instance.');
        // Disabling.
        ok(instance.disable() === instance, 'Logger.prototype.disable returns a self reference.');
        ok(!instance.isEnabled(), 'Logger.prototype.disable disables logging for the instance.');
    });

    // === //

    test('Controlling timestamps.', function () {
        expect(5);
        // Enabling.
        ok(!instance.isStamps(), 'Logger.prototype.isStamps shows timestamps are disabled by default.');
        ok(instance === instance.enableStamps(), 'Logger.prototype.enableStamps returns a self reference.');
        ok(instance.isStamps(), 'Logger.prototype.isStamps shows timestamps are enabled after Logger.prototype.enableStamps.');
        // Disabling.
        ok(instance === instance.disableStamps(), 'Logger.prototype.disableStamps returns a self reference.');
        ok(!instance.isStamps(), 'Logger.prototype.isStamps shows timestamps are disabled after Logger.prototype.disableStamps.');
    });

    // === //

    test('Controlling verbosity.', function () {
        expect(5);
        // Enabling.
        ok(!instance.isVerbose(), 'Logger.prototype.isVerbose shows verbosity is disabled by default.');
        ok(instance === instance.enableVerbosity(), 'Logger.prototype.enableVerbosity returns a self reference.');
        ok(instance.isVerbose(), 'Logger.prototype.isVerbose shows verbosity is enabled after Logger.prototype.enableVerbosity.');
        // Disabling.
        ok(instance === instance.disableVerbosity(), 'Logger.prototype.disableVerbosity returns a self reference.');
        ok(!instance.isVerbose(), 'Logger.prototype.isVerbose shows verbosity is disabled after Logger.prototype.disableVerbosity.');
    });

    // Continue.
    testNextModule();
});
