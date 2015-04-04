define(function () {
    'use strict';

    module('Logger Configuration');

    // === //

    test('Options validation.', function () {
        expect(3);
        ok(Logger.config() === Logger, 'Logger is returned.');
        ok(Logger.config({}) === Logger, 'Empty options are ignored.');
        ok(Logger.config({
            fart: 3
        }) === Logger, 'Nonsensical inputs are ignored.');
    });

    // === //

    test('Disabling logging globally.', function () {
        expect(2);
        Logger.config({
            masterEnable: false
        });
        ok(Logger.isEnabled() === false, 'Logging is disabled globally through the masterEnable option.');

        // Validation.
        Logger.config({
            masterEnable: 1
        });
        ok(Logger.isEnabled() === false, 'Updating masterEnable without a {boolean} maintains previous value.');
    });

    // === //

    test('Enabling logging globally.', function () {
        expect(2);
        Logger.config({
            masterEnable: true
        });
        ok(Logger.isEnabled() === true, 'Logging is enabled globally through the masterEnable option.');

        // Validation.
        Logger.config({
            masterEnable: 0
        });
        ok(Logger.isEnabled() === true, 'Updating masterEnable without a {boolean} maintains the previous configuration.');
    });

    // === //

    test('Setting a global LoggerLevel.', function () {
        expect(3);

        Logger.config({
            masterLevel: Logger.FATAL
        });
        ok(Logger.level() === Logger.FATAL, 'The global LoggerLevel is updated through the masterLevel option.');

        // Maintain configuration.
        Logger.config({
            masterEnable: true
        });
        ok(Logger.level() === Logger.FATAL, 'Updating configuration without mention of masterLevel maintains configuration.');

        // Validation.
        Logger.config({
            masterLevel: 'not a level'
        });
        ok(Logger.level() === Logger.FATAL, 'Updating masterLevel without a valid LoggerLevel maintains the previous level.');
    });

    // === //

    test('Enabling timestamps.', function () {
        var check;

        expect(4);
        check = new Logger('before');
        ok(check.isStamps() === false, 'Pre-configuration instances have timestamps disabled by default.');

        // Enabling timestamps.
        Logger.config({
            timestamps: true
        });
        check = new Logger('after');
        ok(check.isStamps() === true, 'Instances have timestamps enabled after enabling through configuration.');

        // Updating configuration without mention of timestamps maintains configuration.
        Logger.config({
            masterEnable: true
        });
        check = new Logger('confirm');
        ok(check.isStamps() === true, 'Updating configuration without mention of timestamps maintains configuration.');

        // Validation.
        Logger.config({
            timestamps: 'fart'
        });
        check = new Logger('confirm');
        ok(check.isStamps() === true, 'Updating timestamps without a {boolean} maintains the previous configuration.');
    });

    // === //

    test('Disabling timestamps.', function () {
        var check;

        expect(3);
        // Disabling timestamps.
        Logger.config({
            timestamps: false
        });
        check = new Logger('after');
        ok(check.isStamps() === false, 'Instances have timestamps disabled after disabling through configuration.');

        // Updating configuration without mention of timestamps maintains configuration.
        Logger.config({
            masterEnable: true
        });
        check = new Logger('confirm');
        ok(check.isStamps() === false, 'Updating configuration without mention of timestamps maintains configuration.');

        // Validation.
        Logger.config({
            timestamps: 'fart'
        });
        check = new Logger('confirm');
        ok(check.isStamps() === false, 'Updating timestamps without a {boolean} maintains the previous configuration.');
    });

    // === //

    test('Enabling verbosity.', function () {
        var check;

        expect(4);
        check = new Logger('before');
        ok(check.isVerbose() === false, 'Pre-configuration instances have verbosity disabled by default.');

        // Enabling verbosity.
        Logger.config({
            verbosity: true
        });
        check = new Logger('after');
        ok(check.isVerbose() === true, 'Instances have verbosity enabled after enabling through configuration.');

        // Updating configuration without mention of verbosity maintains configuration.
        Logger.config({
            masterEnable: true
        });
        check = new Logger('confirm');
        ok(check.isVerbose() === true, 'Updating configuration without mention of verbosity maintains configuration.');

        // Validation.
        Logger.config({
            timestamps: 'fart'
        });
        check = new Logger('confirm');
        ok(check.isVerbose() === true, 'Updating verbosity without a {boolean} maintains the previous configuration.');
    });

    // === //

    test('Disabling verbosity.', function () {
        var check;

        expect(3);
        // Disabling timestamps.
        Logger.config({
            verbosity: false
        });
        check = new Logger('after');
        ok(check.isVerbose() === false, 'Instances have verbosity disabled after disabling through configuration.');

        // Updating configuration without mention of verbosity maintains configuration.
        Logger.config({
            masterEnable: true
        });
        check = new Logger('confirm');
        ok(check.isVerbose() === false, 'Updating configuration without mention of verbosity maintains configuration.');

        // Validation.
        Logger.config({
            timestamps: 'fart'
        });
        check = new Logger('confirm');
        ok(check.isVerbose() === false, 'Updating verbosity without a {boolean} maintains the previous configuration.');
    });

    // === //

    test('Adding appenders.', function () {
        var check;
        var appender = function () {
            return false;
        };

        expect(9);
        check = new Logger('pre-configuration');
        ok(Logger.appenders().length === 1, 'Pre-configuration global appenders list only contains the default appender.');
        ok(check.appenders().length === 1, 'Pre-configuration instances have an appenders list with only the default appender.');

        // Add appender straight up.
        Logger.config({
            appenders: appender
        });
        check = new Logger('straight-up');
        ok(Logger.appenders().length === 2, 'Adding an appender straight up adds the appender to the global list of appenders.');
        ok(check.appenders().length === 2, 'New instances have the updated list of appenders.');
        Logger.remove(1);

        // Adding an array of appenders.
        Logger.config({
            appenders: [appender, appender]
        });
        check = new Logger('array-of-appenders');
        ok(Logger.appenders().length === 3, 'Adding an array of appenders adds the appenders to the global list of appenders.');
        ok(check.appenders().length === 3, 'New instances have the updated list of appenders.');

        // Updating configuration without mention of appenders maintains configuration.
        Logger.config({
            masterEnable: true
        });
        check = new Logger('maintenance');
        ok(Logger.appenders().length === 3, 'Updating configuration without mention of appenders maintains configuration.');
        Logger.remove(2).remove(1);

        // Validation.
        Logger.config({
            appenders: [false, 'not a function']
        });
        check = new Logger('invalid');
        ok(Logger.appenders().length === 1, 'Invalid input is ignored.');
        ok(check.appenders().length === 1, 'Invalid input does not affect appenders for instances.');
    });

    // === //

    test('Log formatting.', function () {
        expect(1);
        ok(Logger.config({
            format: 'TLN'
        }) === Logger, 'Setting the log format does not cause an issue.');
    });

    // === //

    test('Separating prefixes.', function () {
        expect(1);
        ok(Logger.config({
            separatePrefix: false
        }) === Logger, 'Setting separatePrefix does not cause an issue.');
    });

    // === //

    test('Setting default appender.', function () {
        expect(1);
        ok(Logger.config({
            defaultAppender: true
        }) === Logger, 'Setting defaultAppender does not cause an issue.');
    });

    // Continue.
    testNextModule();
});
