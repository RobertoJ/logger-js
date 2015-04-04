define(function () {
    'use strict';

    var cache;
    var instance;
    var levelsToTest = [];
    var MESSAGE = 'Message';
    var timestampRegex = /\[[\w\W]+\][\w\W]+[0-9:]+[\w\W]+\([\w\W]+\)/;
    var lifecycle = {
        setup: function () {
            cache = [];
            instance = new Logger('test-module').add(function () {
                cache.push(arguments);
            }).enable();
            Logger.setLevel(Logger.TRACE).enable();
        }
    };

    // Gather all the levels to test.
    Object.iterateProperties(Logger, function (name, value) {
        if (Logger.LoggerLevel.is(value)) {
            levelsToTest.push(value);
        }
    });

    // Iteratively test each available level.
    function testLevel(level, index) {
        var shortName = level.name().toLowerCase();
        var vshortName = 'v' + shortName;
        var protoName = 'Logger.prototype.' + shortName;
        var vprotoName = 'Logger.prototype.' + vshortName;

        module('Logging - ' + level.name(), lifecycle);

        // === //

        test('Standard logging.', function () {
            expect(4);

            // Ensure a self reference is returned.
            ok(instance.setLevel(level)[shortName](MESSAGE) === instance, protoName + ' returns a self reference.');
            ok(cache[0][1] === MESSAGE, protoName + ' logs messages.');

            // Ensure string substitution.
            instance[shortName]('a{}b{}c', 1, 2);
            ok(cache[1][1] === 'a1b2c', protoName + ' substitutes arguments properly.');

            // Ensure that the instance does not log when disabled.
            instance.disable()[shortName](MESSAGE).enable();
            ok(cache[2] === undefined, protoName + ' does not log when the instance is disabled.');
        });

        // === //

        test('Logging against higher levels.', function () {
            expect(1);

            for (var i = index, length = levelsToTest.length; i < length; i += 1) {
                if (levelsToTest[i] > level) {
                    instance.setLevel(levelsToTest[i])[shortName](MESSAGE);
                    break;
                }
            }

            ok(cache[0] === undefined, protoName + ' does not log when the local level is set higher than the requested level.');
        });

        // === //

        test('Verbosity is enabled.', function () {
            expect(2);
            instance.enableVerbosity()[vshortName](MESSAGE);
            ok(cache[0][1] === MESSAGE, vprotoName + ' logs when verbosity is enabled.');
            instance[shortName](MESSAGE);
            ok(cache[1][1] === MESSAGE, protoName + ' logs when verbosity is enabled.');
        });

        // === //

        test('Verbosity is disabled.', function () {
            expect(2);
            instance.disableVerbosity()[vshortName](MESSAGE);
            ok(cache[0] === undefined, vprotoName + ' does not log when verbosity is disabled.');
            instance[shortName](MESSAGE);
            ok(cache[0][1] === MESSAGE, protoName + ' logs when verbosity is enabled.');
        });

        // === //

        test('Timestamps are enabled.', function () {
            expect(2);
            instance.enableVerbosity().enableStamps();
            instance[shortName](MESSAGE)[vshortName](MESSAGE);
            ok(timestampRegex.test(cache[0][0]), protoName + ' shows a timestamp.');
            ok(timestampRegex.test(cache[1][0]), vprotoName + ' shows a timestamp.');
        });

        // === //

        test('Timestamps are disabled.', function () {
            expect(2);
            instance.enableVerbosity().disableStamps();
            instance[shortName](MESSAGE)[vshortName](MESSAGE);
            ok(!timestampRegex.test(cache[0][0]), protoName + ' does not show a timestamp.');
            ok(!timestampRegex.test(cache[1][0]), vprotoName + ' does not show a timestamp.');
        });

        // === //

        test('Logging is globally enabled.', function () {
            expect(4);
            Logger.enable();
            // Logging is globally and locally on.
            instance.enableVerbosity()[shortName](MESSAGE);
            ok(cache[0][1] === MESSAGE, protoName + ' logs when logging is enabled globally and locally.');
            // Logging is only globally on.
            instance.disable()[shortName](MESSAGE);
            ok(cache[1] === undefined, protoName + ' does not log when logging is enabled globally, but locally disabled.');
            // Verbose - Logging is globally and locally on.
            instance.enable().enableVerbosity()[vshortName](MESSAGE);
            ok(cache[1][1] === MESSAGE, vprotoName + ' logs when logging is enabled globally and locally.');
            // Verbose - Logging is only globally on.
            instance.disable()[vshortName](MESSAGE);
            ok(cache[2] === undefined, vprotoName + ' does not log when logging is enabled globally, but locally disabled.');
        });

        // === //

        test('Logging is globally disabled.', function () {
            Logger.disable();
            // Logging is only locally on.
            instance.enableVerbosity()[shortName](MESSAGE);
            ok(cache[0] === undefined, protoName + ' does not log when logging is disabled globally, but enabled locally.');
            // Logging is off globally and locally.
            instance.disable()[shortName](MESSAGE);
            ok(cache[0] === undefined, protoName + ' does not log when logging is disabled globally and locally.');
            // Verbose - Logging only locally on.
            instance.enable().enableVerbosity()[vshortName](MESSAGE);
            ok(cache[0] === undefined, vprotoName + ' does not log when logging is disabled globally, but enabled locally.');
            // Verbose - Logging is off globally and locally.
            instance.disable()[vshortName](MESSAGE);
            ok(cache[0] === undefined, vprotoName + ' does not log when logging is disabled globally and locally.');
        });
    }

    // Sort to ensure testing in order of priority level, and test.
    levelsToTest.sort(function (a, b) {
        return a - b;
    }).forEach(testLevel);

    // Continue.
    testNextModule();
});
