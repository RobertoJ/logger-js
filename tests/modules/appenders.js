(function () {
    'use strict';

    var instance = null;
    var cache = [];
    var appender = function () {
        cache.push(arguments);
    };
    var lifecycle = {
        setup: function () {
            instance = new Logger('test-module').add(appender).enable();
            Logger.setLevel(Logger.DEBUG).enable();
            cache = [];
        },
        teardown: function () {
            instance = null;
            cache = [];
        }
    };

    module('Appenders', lifecycle);

    // === //

    test('Retrieving a list of global appenders with Logger.appenders.', function () {
        expect(2);
        ok(Object.prototype.toString.call(Logger.appenders()) === '[object Array]', 'The method returns an array.');
        ok(Logger.appenders().length === 1, 'Initially, the global list of appenders only has the default appender.');
    });

    // === //

    test('Adding global appenders with Logger.add.', function () {
        expect(3);
        ok(Logger.add(appender) === Logger, 'Logger is returned.');
        ok(Logger.appenders().length === 2, 'Appenders are successfully added.');
        ok(new Logger('another').appenders().length === 2, 'New Logger instances get a reference to the appenders added globally.');
    });

    // === //

    test('Removing global appenders with Logger.remove.', function () {
        expect(5);
        ok(Logger.remove(1) === Logger, 'Logger is returned.');
        ok(Logger.appenders().length === 1, 'Appenders are successfully removed.');
        ok(Logger.remove().appenders().length === 1, 'Nonsensical inputs are ignored.');
        ok(new Logger('another').appenders().length === 1, 'New Logger instances do not get a reference to the removed global appenders.');
        ok(Logger.remove(0).appenders().length === 1, 'The default appender cannot be removed.');
    });

    // === //

    test('Retrieving a list of local appenders with Logger.prototype.appenders.', function () {
        expect(2);
        ok(Object.prototype.toString.call(instance.appenders()) === '[object Array]', 'The method returns an array.');
        ok(new Logger('test').appenders().length === 1, 'Initially, the local list of appenders only has the default appender.');
    });

    // === //

    test('Adding local appenders with Logger.prototype.add.', function () {
        var length = instance.appenders().length;
        var lengthAfter = instance.add(appender).appenders().length;

        expect(2);
        ok(length + 1 === lengthAfter, 'Appenders are successfully added.');
        ok(Logger.appenders().length < lengthAfter, 'Adding an appender locally does not add one globally.');
    });

    // === //

    test('Removing local appenders with Logger.prototype.remove.', function () {
        var length = instance.appenders().length;
        var lengthAfter = instance.add(appender).remove(1).appenders().length;

        expect(3);
        ok(length === lengthAfter, 'Appenders are successfully removed.');
        ok(length === instance.remove().appenders().length, 'Nonsensical inputs are ignored.');

        // Ensure the default appender cannot be removed.
        length = instance.appenders().length;
        for (var i = 0; i < length; i += 1) {
            instance.remove(i);
        }
        ok(instance.appenders().length === 1, 'The default appender cannot be removed.');
    });

    // === //

    test('Checking arguments passed to appenders.', function () {
        var one = {x: 42, y: 42};

        expect(1);
        instance.debug(one);
        ok(cache[0][1] === one, 'The appenders receive the right logs.');
    });

    // === //

    test('Disabling the default appender with Logger.prototype.disableDefaultAppender.', function () {
        expect(1);
        ok(instance.disableDefaultAppender() === instance, 'Logger.prototype.disableDefaultAppender returns a self reference.');
    });

    // === //

    test('Enabling the default appender with Logger.prototype.enableDefaultAppender.', function () {
        expect(1);
        ok(instance.enableDefaultAppender() === instance, 'Logger.prototype.enableDefaultAppender returns a self reference.');
    });

    // Continue.
    testNextModule();
}());
