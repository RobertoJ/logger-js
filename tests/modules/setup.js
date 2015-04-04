define(function () {
    /**
     * Add Array.prototype.forEach, if needed.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
     */
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (callback, thisArg) {
            var T, k;

            if (this === null) {
                throw new TypeError('{this} is null or not defined.');
            }

            var O = Object(this);
            var len = O.length >>> 0;

            if (typeof callback !== "function") {
                throw new TypeError(callback + ' is not a function');
            }

            if (arguments.length > 1) {
                T = thisArg;
            }

            k = 0;

            while (k < len) {
                var kValue;

                if (k in O) {
                    kValue = O[k];
                    callback.call(T, kValue, k, O);
                }

                k++;
            }
        };
    }

    /**
     * Add Object.keys, if needed.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
     */
    if (!Object.keys) {
        Object.keys = (function () {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            var hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString');
            var dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];
            var dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object.');
                }

                var result = [];

                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (var i = 0; i < dontEnumsLength; i += 1) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }

                return result;
            };
        }());
    }

    /**
     * Iterate over all properties in an {object} for which {Object.prototype.hasOwnProperty}
     * returns true.
     *
     * The given {callback} will be given three arguments: [propertyName, propertyValue, context]
     *
     * @param {*} context - The context to iterate over.
     * @param {function} callback - If not a {function}, nothing happens.
     * @return {Object}
     */
    Object.iterateProperties = function (context, callback) {
        for (var property in context) {
            if (context.hasOwnProperty(property)) {
                callback(property, context[property], context);
            }
        }

        return context;
    };

    // The test modules should be loaded in the following order.
    var TEST_MODULES = ['availability', 'logger-level', 'general', 'appenders', 'logging', 'configuration'];
    var numberOfModules = TEST_MODULES.length;
    var currentModuleIndex = -1;

    function testNextModule() {
        if (++currentModuleIndex < numberOfModules) {
            console.log('Executing test module:', TEST_MODULES[currentModuleIndex]);
            require([TEST_MODULES[currentModuleIndex]]);
        } else {
            console.log('All test modules have been run.');
        }
    }

    window.testNextModule = testNextModule;
    testNextModule();
});
