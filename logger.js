/* @license | The MIT License | (c) Roberto Aleman Jr. */
(function () {
    'use strict';

    var originalGlobalLogger = window.Logger;
    var configuration = {
        appenders: [],
        defaultAppender: true,
        masterEnable: true,
        masterLevel: false,
        timestamps: false,
        verbosity: false
    };
    var EMPTY_FUNCTION = function () { return; };
    var DEFAULT_APPENDER = function () {
        if (window.console && window.console.log) {
            try {
                Function.prototype.apply.apply(window.console.log, [window.console, arguments]);
            } catch (ignore) { /* Silently fail. */ }
        }
    };

    // Add the default appender to the global appenders.
    configuration.appenders.push(DEFAULT_APPENDER);

    // Utility functions for type checking.
    var Type = {
        get: function (what) { return Object.prototype.toString.call(what); },
        isArray: function (what) { return this.get(what) === '[object Array]'; },
        isBoolean: function (what) { return this.get(what) === '[object Boolean]'; },
        isFunction: function (what) { return this.get(what) === '[object Function]'; },
        isNumber: function (what) { return this.get(what) === '[object Number]'; },
        isObject: function (what) { return this.get(what) === '[object Object]' && what !== null && what !== undefined; },
        isString: function (what) { return this.get(what) === '[object String]'; }
    };

    /**
     * {LoggerLevel}, a logging level. Logging functions are generated based on a {LoggerLevel}'s (lowercase)
     * name. To avoid issues, names are limited to alphabet characters.
     *
     * @constructor
     * @param {string} name - Logging level name.
     * @param {number} level - Logging priority.
     * @throws {TypeError} - Thrown on invalid arguments.
     */
    function LoggerLevel(name, level) {
        if (!Type.isString(name) || !Type.isNumber(level) || !/^[a-zA-Z]+$/.test(name)) {
            throw new TypeError('Invalid arguments: LoggerLevel(name {string}, level {number})');
        }

        /**
         * Get the name of this {LoggerLevel}.
         *
         * @return {string}
         */
        this.name = function () {
            return name;
        };

        /**
         * Get the numeric value of this {LoggerLevel}.
         *
         * @return {number}
         */
        this.level = function () {
            return level;
        };
        this.valueOf = this.level;
    }

    /**
     * Answers if the parameter is an instance of {LoggerLevel}.
     *
     * @param {*} parameter - What to check.
     * @return {boolean}
     */
    LoggerLevel.is = function (parameter) {
        return parameter instanceof LoggerLevel;
    };

    /**
     * Get the current timestamp.
     *
     * @private
     * @return {string}
     */
    function getTimestamp() {
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();
        var milliseconds = currentTime.getMilliseconds();

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        milliseconds = milliseconds < 100 ? '0' + milliseconds : (milliseconds < 10 ? '00' + milliseconds : milliseconds);

        return hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
    }

    /**
     * An internal auxiliary logging function that will invoke each appender giving each the {messages}.
     *
     * It will only log if the following conditions are met:
     *
     * - Logging is enabled globally.
     * - Logging is enabled for this {Logger} instance.
     * - The {LoggerLevel} being logged with beats or matches the one the current instance is assigned to.
     * - The {LoggerLevel} being logged with beats or matches the global {LoggerLevel}.
     *
     * @param {LoggerLevel} level - The logging level for this instance.
     * @param {Array} messages - The messages being logged.
     * @param {this} context - The current {Logger} instance.
     * @return {this}
     */
    function privateLogger(level, messages, context) {
        if (configuration.masterEnable && context.isEnabled() && level >= context.level() && level >= configuration.masterLevel) {
            var prefix = '[' + level.name() + ']' + (context.isStamps() ? ' ' + getTimestamp() + ' ' : ' ') + '(' + context.name() + ')';

            // Substitute if necessary.
            if (Type.isString(messages[0]) && messages[0].indexOf('{}') > -1) {
                messages[0] = messages[0].replace(/{}/g, function () {
                    return messages.splice(1, 1)[0] || '{}';
                });
            }

            messages.unshift(prefix);

            for (var j = 0, appenders = context.appenders(), length = appenders.length; j < length; j += 1) {
                appenders[j].apply(context, messages);
            }
        }

        return context;
    }

    /**
     * Get a logging function to attach to the {Logger} prototype based on a given {LoggerLevel}.
     *
     * @param {LoggerLevel} level - The level this logging function will work with.
     * @param {boolean} makeVerbose - If true, the returned logging function will contain a condition that determines if
     * the current {Logger} instance is set to be verbose. If not, it won't log.
     * @return {function}
     */
    function makeLoggingFunction(level, makeVerbose) {
        // Make a logging function that logs only when verbosity is enabled.
        if (makeVerbose) {
            return function () {
                return this.isVerbose() ? privateLogger.apply(this, [level, Array.prototype.slice.call(arguments), this]) : this;
            };
        }

        return function () {
            return privateLogger.apply(this, [level, Array.prototype.slice.call(arguments), this]);
        };
    }

    /**
     * Get a function that answers if the {LoggerLevel} will output anything for an instance's currently
     * enabled {LoggerLevel}.
     *
     * @return {boolean}
     */
    function getIsLevelEnabledFunction(loggerLevel) {
        return function () {
            return loggerLevel >= this.level();
        };
    }

    /**
     * A {Logger} permits you to log messages  of many types directly to the console with fine-grained
     * control.
     *
     * @constructor
     * @param {string} name - Logger instance name.
     * @param {LoggerLevel} level - Optional. Defaults to {Logger.TRACE}.
     * @throws {TypeError} - Thrown when given an invalid module name.
     */
    function Logger(name, level) {
        var property;
        var appenders = configuration.appenders.concat();
        var enabled = true;
        var verbose = configuration.verbosity;
        var timestamp = configuration.timestamps;
        var self = this;

        if (!Type.isString(name) || name.length === 0) {
            throw new TypeError('Invalid name: Logger(name {string} [, level {LoggerLevel}])');
        }

        // Set LoggerLevel.
        level = LoggerLevel.is(level) ? level : Logger.TRACE;
        // If configuration says so, the default appender is disabled.
        appenders[0] = configuration.defaultAppender ? appenders[0] : EMPTY_FUNCTION;

        /**
         * The module name.
         *
         * @return {string}
         */
        self.name = function () {
            return name;
        };

        /**
         * The current level
         *
         * @return {LoggerLevel}
         */
        self.level = function () {
            return level;
        };

        /**
         * Set the {LoggerLevel}.
         *
         * @param {LoggerLevel} newLevel - The new level.
         * @return {this}
         */
        self.setLevel = function (newLevel) {
            return (level = (LoggerLevel.is(newLevel) ? newLevel : level)) && self;
        };

        /**
         * Enable instance.
         *
         * @return {this}
         */
        self.enable = function () {
            return (enabled = true) && self;
        };

        /**
         * Disable instance.
         *
         * @return {this}
         */
        self.disable = function () {
            return (enabled = false) || self;
        };

        /**
         * Answers if this instance is enabled.
         *
         * @return {boolean}
         */
        self.isEnabled = function () {
            return enabled;
        };

        /**
         * Enable timestamps.
         *
         * @return {this}
         */
        self.enableStamps = function () {
            return (timestamp = true) && self;
        };

        /**
         * Disable timestamps.
         *
         * @return {this}
         */
        self.disableStamps = function () {
            return (timestamp = false) || self;
        };

        /**
         * Answers if timestamps are enabled.
         *
         * @return {boolean}
         */
        self.isStamps = function () {
            return timestamp;
        };

        /**
         * Enable verbosity.
         *
         * @return {this}
         */
        self.enableVerbosity = function () {
            return (verbose = true) && self;
        };

        /**
         * Disable verbosity.
         *
         * @return {this}
         */
        self.disableVerbosity = function () {
            return (verbose = false) || self;
        };

        /**
         * Answers is verbosity is enabled.
         *
         * @return {boolean}
         */
        self.isVerbose = function () {
            return verbose;
        };

        /**
         * Get the list of appenders.
         *
         * @return {array}
         */
        self.appenders = function () {
            return appenders;
        };

        // Generate logging functions for all available LoggerLevels.
        for (property in Logger) {
            if (Logger.hasOwnProperty(property) && Logger[property] instanceof LoggerLevel) {
                var lowercaseProperty = property.toLowerCase();

                if (!Logger.hasOwnProperty(lowercaseProperty)) {
                    Logger.prototype[lowercaseProperty] = makeLoggingFunction(Logger[property], false);
                    Logger.prototype['v' + lowercaseProperty] = makeLoggingFunction(Logger[property], true);
                    Logger.prototype['is' + lowercaseProperty[0].toUpperCase() + lowercaseProperty.substr(1) + 'Enabled'] = getIsLevelEnabledFunction(Logger[property]);
                }
            }
        }
    }

    /**
     * Add an appender.
     *
     * @param {function} appender - The appender to add. Nonsensical values are ignored.
     * @return {Logger}
     */
    Logger.prototype.add = function (appender) {
        if (Type.isFunction(appender)) {
            this.appenders().push(appender);
        }

        return this;
    };

    /**
     * Remove the appender at the given index. The default appender at 0 cannot be removed.
     *
     * @param {number} index - The zero-based index. Nonsensical values are ignored.
     * @return {Logger}
     */
    Logger.prototype.remove = function (index) {
        if (Type.isNumber(index) && index > 0) {
            this.appenders().splice(index, 1);
        }

        return this;
    };

    /**
     * Enable the default appender. Enabled by default.
     *
     * @return {Logger}
     */
    Logger.prototype.enableDefaultAppender = function () {
        return (Logger.appenders()[0] = EMPTY_FUNCTION) && this;
    };

    /**
     * Disable the default appender. Enabled by default.
     *
     * @return {this}
     */
    Logger.prototype.disableDefaultAppender = function () {
        return (this.appenders()[0] = DEFAULT_APPENDER) && this;
    };

    // Expose LoggerLevel.
    Logger.LoggerLevel = LoggerLevel;
    // Set some predefined LoggerLevels.
    Logger.TRACE = new LoggerLevel('TRACE', 0);
    Logger.DEBUG = new LoggerLevel('DEBUG', 1);
    Logger.INFO = new LoggerLevel('INFO', 2);
    Logger.TODO = new LoggerLevel('TODO', 2);
    Logger.FIXME = new LoggerLevel('FIXME', 3);
    Logger.WARN = new LoggerLevel('WARN', 3);
    Logger.XXX = new LoggerLevel('XXX', 4);
    Logger.ERROR = new LoggerLevel('ERROR', 4);
    Logger.FATAL = new LoggerLevel('FATAL', 5);

    /**
     * Enable logging. Instance settings will take precedence.
     *
     * @return {Logger}
     */
    Logger.enable = function () {
        return (configuration.masterEnable = true) && Logger;
    };

    /**
     * Disable logging. Instance settings will no longer take precedence.
     *
     * @return {Logger}
     */
    Logger.disable = function () {
        return (configuration.masterEnable = false) || Logger;
    };

    /**
     * Answers if logging is enabled globally.
     *
     * @return {boolean}
     */
    Logger.isEnabled = function () {
        return configuration.masterEnable;
    };

    /**
     * Set the global level.
     *
     * @param {LoggerLevel} level - The new level.
     * @return {Logger}
     */
    Logger.setLevel = function (level) {
        return (LoggerLevel.is(level) ? (configuration.masterLevel = level) : configuration.masterLevel) && Logger;
    };

    /**
     * Get the global level.
     *
     * @return {LoggerLevel}
     */
    Logger.level = function () {
        return configuration.masterLevel;
    };

    /**
     * Get a new instance of {Logger}.
     *
     * @param {string} name - The module name.
     * @param {LoggerLevel} level - Optional. Defaults to {Logger.TRACE}.
     * @return {this}
     */
    Logger.get = function (name, level) {
        return new Logger(name, level);
    };

    /**
     * Get the array of global appenders.
     *
     * @return {array}
     */
    Logger.appenders = function () {
        return configuration.appenders;
    };

    /**
     * Add an appender to the global list of appenders.
     *
     * @param {function} appender - The appender to add. Nonsensical values are ignored.
     * @return {Logger}
     */
    Logger.add = function (appender) {
        if (Type.isFunction(appender)) {
            configuration.appenders.push(appender);
        }

        return Logger;
    };

    /**
     * Remove the global appender at the given index.
     *
     * @param {number} index - The zero-based index. Nonsensical values are ignored.
     * @return {Logger}
     */
    Logger.remove = function (index) {
        if (Type.isNumber(index) && index > 0) {
            configuration.appenders.splice(index, 1);
        }

        return Logger;
    };

    /**
     * Set configuration options.
     *
     * @param {object} options - The options to apply.
     * @return {Logger}
     */
    Logger.config = function (options) {
        if (Type.isObject(options)) {
            // Set appenders.
            if (Type.isArray(options.appenders)) {
                for (var i = 0, length = options.appenders.length; i < length; i += 1) {
                    if (Type.isFunction(options.appenders[i])) {
                        configuration.appenders.push(options.appenders[i]);
                    }
                }
            } else if (Type.isFunction(options.appenders)) {
                configuration.appenders.push(options.appenders);
            }

            // Set master level.
            configuration.masterLevel = LoggerLevel.is(options.masterLevel) ? options.masterLevel : configuration.masterLevel;
            // Set master enable.
            configuration.masterEnable = Type.isBoolean(options.masterEnable) ? options.masterEnable : configuration.masterEnable;
            // Set whether the default appender is used.
            configuration.defaultAppender = Type.isBoolean(options.defaultAppender) ? options.defaultAppender : configuration.defaultAppender;
            // Set timestamps.
            configuration.timestamps = Type.isBoolean(options.timestamps) ? options.timestamps : configuration.timestamps;
            // Set verbosity.
            configuration.verbosity = Type.isBoolean(options.verbosity) ? options.verbosity : configuration.verbosity;
        }

        return Logger;
    };

    /**
     * Remove Logger from the global namespace, returning the original value.
     *
     * @return {Logger}
     */
    Logger.noConflict = function () {
        window.Logger = originalGlobalLogger;
        return Logger;
    };

    // Setup.
    Logger.config({masterLevel: Logger.TRACE});
    Logger.version = '0.2.0';

    // Expose.
    window.Logger = Logger;

    // Register as an AMD module.
    if (Type.isFunction(window.define) && window.define.amd) {
        define('logger', function () {
            return Logger;
        });
    }
}());
