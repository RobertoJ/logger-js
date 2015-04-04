define(function () {
    'use strict';

    module('Availability');

    // === //

    test('Logger is available globally.', function () {
        expect(1);
        ok(typeof Logger === 'function', 'Logger is available.');
    });

    // === //

    test('Logger.noConflict removes Logger globally.', function () {
        var original = window.Logger;
        var value = Logger.noConflict();

        expect(2);
        ok(window.Logger === undefined, 'window.Logger is set to the original value.');
        ok(value === original, 'Logger.noConflict returns {Logger}.');
        // Return it for the other tests.
        window.Logger = value;
    });

    // === //

    test('Logger.LoggerLevel is exposed.', function () {
        expect(1);
        ok(typeof Logger.LoggerLevel === 'function', 'Logger has the LoggerLevel constructor as a property.');
    });

    // Continue.
    testNextModule();
});
