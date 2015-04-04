# LoggerJS

A simple module for logging to the console with fine-grained control and extensibility.

## Compatibility

Unit tests are available to run at your leisure. I've tested it on the following with 100% passing rate:

-   Chrome
-   Firefox
-   Internet Explorer 9+<sup>†</sup>
-   Safari

<sup>† Please note Internet Explorer 8 will work, but only if the console is open. Otherwise, it just doesn't do anything.</sup>

## How do I start?

    <script src="/js/libraries/logger.min.js"></script>

## Introduction

`Logger` is a module that assigns itself to `window.Logger`. If `window.define && define.amd`, then it will also be registered as an AMD module under the name `"logger"`.

An instance of `Logger` provides you with many logging methods, as well as a myriad of customizable options permitting you varying levels of granularity on what gets logged and from where. Also, most methods and class functions return `this` and `Logger` respectively for chaining.

### Constructor

#### Logger(name [, level])

Create a `Logger` instance with the `new` operator.

> **name**: String. The name for this instance.

> **level**: LoggerLevel. The level to assign. Optional. Defaults to `Logger.TRACE`.

    var log = new Logger('module-name');


#### Logger.get(name [, level])

Get a new `Logger` instance

> **name**: String. The name for this instance.

> **level**: LoggerLevel. The level to assign. Optional. Defaults to `Logger.TRACE`.

    var log = Logger.get('module-name');

### LoggerLevel

A `LoggerLevel` is an object that represents a logging level. `Logger` has several predefined levels, which are listed in the next section. You can assign a level per instance and/or set a global level that all instances must respect. They are placed as properties on the `Logger` constructor for easy access.

The `LoggerLevel` constructor is also a property in the `Logger` constructor so that you can create your own levels. The constructor requires both a level name and priority level.

#### LoggerLevel(name, level)

Create a `LoggerLevel` with the `new` operator. All custom levels should be placed into `Logger` prior to the creation of any instances. The reasoning provided in the next section.

> **name**: String. A short but descriptive name.

> **level**: Number. A priority level indicating the log's weight.

    Logger.NAME = new Logger.LoggerLevel('NAME', 42);

#### LoggerLevel.is([parameter])

Answers if the given parameter is an instance of `LoggerLevel`.

> **parameter**: AnyType. The parameter to check.

    Logger.LoggerLevel.is('boop'); // false

### Logging

Each `Logger` instance has logging methods that are generated dynamically during the creation of the first instance. These are generated according to the `LoggerLevel`s attached to `Logger`.

For each attached level, two functions are created using the name given to the level. For example, a level with the name `INFO` adds two functions: `Logger.prototype.info` and `Logger.prototype.vinfo`.

For this reason, custom levels can only be given names consisting of letters (case insensitive). Failure to do so results in a `TypeError`.

#### .trace([messages...])

Log a trace message. This has a priority level of 0.

> **messages**: AnyType. Any number of messages to log of any type.

    logger.trace('This is the answer is 42.');
    // [TRACE] (one) This is the answer is 42.

#### .debug([messages...])

Log a debug message. This has a priority level of 1.

> **messages**: AnyType. Any number of messages to log of any type.

    logger.debug('This is the answer is 42.');
    // [DEBUG] (one) This is the answer is 42.

#### .todo([messages...])

Log a todo message. This has a priority level of 2.

> **messages**: AnyType. Any number of messages to log of any type.

    logger.todo('This is the answer is 42.');
    // [TODO] (one) This is the answer is 42.

#### .info([messages...])

Log an information message. This has a priority level of 2.

> **messages**: AnyType. Any number of messages to log of any type.

    logger.info('This is the answer is 42.');
    // [INFO] (one) This is the answer is 42.

#### .fixme([messages...])

Log a fixme message. This has a priority level of 3.

> **messages**: AnyType. Any number of messages to log of any type.

    logger.fixme('This is the answer is 42.');
    // [FIXME] (one) This is the answer is 42.

#### .warning([messages...])

Log a warning message. This has a priority level of 3.

> **messages**: AnyType. Any number of messages to log of any type.

    logger.warning('This is the answer is 42.');
    // [WARNING] (one) This is the answer is 42.

#### .xxx([messages...])

Log an xxx message. This has a priority level of 4.

> **messages**: AnyType. Any number of messages to log of any type.

    logger.xxx('This is the answer is 42.');
    // [XXX] (one) This is the answer is 42.

#### .error([messages...])

Log an error message. This has a priority level of 4.

> **messages**: AnyType. Any number of messages to log of any type.

    logger.error('This is the answer is 42.');
    // [ERROR] (one) This is the answer is 42.

#### .fatal([messages...])

Log a fatal message. This has a priority level of 5.

> **messages**: AnyType. Any number of messages to log of any type.

    logger.fatal('This is the answer is 42.');
    // [FATAL] (one) This is the answer is 42.

### Levels

You can set a specific `LoggerLevel` to each instance or set a global level that all instances must respect when attempting to log.

#### Logger.setLevel([level])

Set a global `LoggerLevel` that all instances must respect when attempting to log.

> **level**: LoggerLevel. The level to set globally. Nonsensical inputs are ignored.

    Logger.setLevel(Logger.ERROR);
    logger.setLevel(Logger.INFO).info('A message.'); // This will produce no output.

#### Logger.level()

Get the global `LoggerLevel`.

    Logger.setLevel(Logger.INFO).level() === Logger.INFO // true

#### .setLevel([level])

Set a `LoggerLevel` to this instance.

> **level**: LoggerLevel. The level to set. Nonsensical inputs are ignored.

    logger.setLevel(Logger.INFO).debug('Message'); // This will produce no output.

#### .level()

Get this instance's `LoggerLevel`.

    logger.setLevel(Logger.INFO).level() === Logger.INFO // true

### Enabling

You can control whether logging is enabled per instance or globally at any time. Global enabling or disabling can be set through <a href="#configuration">`Logger.config`</a>.

#### Logger.enable()

Enable logging globally. Default is enabled. When enabled, instance settings take precedence.

    Logger.enable().get('example').debug('Message'); // [DEBUG] (example) Message.

#### Logger.disable()

Disable logging globally. Default is enabled. When disabled, this takes precedence over instance settings.

    Logger.disable().get('example').debug('Message'); // This will produce no output.

#### Logger.isEnabled()

Answers if logging is enabled globally.

    Logger.disable().isEnabled() // false

#### .enable()

Enable logging for this instance. Default is enabled.

    logger.enable().debug('Message'); // [DEBUG] (example) Message

#### .disable()

Disable logging for this instance. Default is enabled.

    logger.disable().debug('Message'); // This will produce no output.

#### .isEnabled()

Answers if logging is enabled for this instance.

    logger.disable().isEnabled(); // false

### Verbosity

For more control over what gets printed, you can use one of the `Logger.prototype.v*` methods. For every regular logging method, there is a verbose version with the same name only prefixed with a v. Verbosity can also be set through <a href="#configuration">`Logger.config`</a>.

#### .enableVerbosity()

Enable verbosity for the instance.

    logger.vdebug('one').enableVerbosity().vdebug('two'); // [DEBUG] (example) two

#### .disableVerbosity()

Disable verbosity for the instance.

    logger.enableVerbosity().vdebug('one').disableVerbosity().vdebug('two'); // [DEBUG] (example) one

#### .isVerbose()

Answers if the instance has verbosity enabled.

    logger.enableVerbosity().isVerbose() // true

### Timestamps

Logs can have timestamps prepended to them. This is disabled by default. Timestamps can also be set through <a href="#configuration">`Logger.config`</a>.

#### .enableStamps()

Enable timestamps for this instance.

    logger.enableStamps().debug('Message'); // [DEBUG] 18:24:29:514 (example) Message

#### .disableStamps()

Disable timestamps for this instance.

    logger.disableStamps().debug('Message'); // [DEBUG] (example) Message

#### .isStamps()

Answers if timestamps are enabled.

    logger.enableStamps().isStamps() // true

### Appenders

#### Default Appender

`Logger` has a main appender function that outputs to the console if its available. If it isn't, `Logger` will not do anything. You can enable or disable the main appender if so desired. The default appender can also be managed through <a href="#configuration">`Logger.config`</a>.

#### .enableDefaultAppender()

Enable the default appender for this instance.

    // This will send logs to the console and any other appenders.
    logger.enableDefaultAppender().debug('Message');

#### .disableDefaultAppender()

Disable the default appender for this instance.

    // This will only send logs to any other appenders.
    logger.disableDefaultAppender().debug('Message');

#### Adding Appenders Locally

You can add, remove, or get a list of appenders to a specific instance.

#### .appenders()

Get a list of appenders belonging to this instance.

    logger.appenders().length > 0 // true

#### .add([appender])

Add an appender to this instance.

> **appender**: Function. A new appender to add to the list of appenders in this instance. Nonsensical inputs are ignored.

    logger.add(function () {
        var log = Array.prototype.slice.call(arguments, 0).join('');

        $.ajax({
            url: 'localhost:8080/postlog?log=' + log
        });
    });

#### .remove([index])

Remove the appender belonging to this instance found at the given index.

> **index**: Number. The zero-based index of the appender in the list of appenders of this instance. Nonsensical inputs are ignored.

    // After adding only one appender.
    logger.remove(1).appenders().length === 1 // true

#### Adding Appenders Globally

There is also a global list of appenders from which all new instances take from. By default it only contains the main appender. You can add to it so all new instances have the appender, instead of having to add it per instance.

#### Logger.appenders()

Get a list of global appenders. Each new instance will be initialized with a list of appenders with a
reference to each global appender.

    Logger.appenders().length > 0 // true

#### Logger.add([appender])

Add a global appender.

> **appender**: Function. A new appender to add to the list of global appenders. Nonsensical inputs are ignored.

    Logger.add(function () {
        var log = Array.prototype.slice.call(arguments, 0).join('');

        $.ajax({
            url: 'localhost:9080/postlog?log=' + log
        });
    });

#### Logger.remove([index])

Remove the global appender found at the given index.

> **index**: Number. The zero-based index of the appender in the list of global appenders. Nonsensical inputs are ignored.

    // After adding only one appender.
    Logger.remove(1).appenders().length === 1 // true

### String Substitution

`Logger` supports string substitution for messages.

If the first argument given to a logging function is a string that contains instances of `{}`, subsequent arguments will be parsed to a string and replace each corresponding instance of `{}`.

For example:

    try {
        throw new TypeError('WEE');
    } catch (e) {
        log.error('We encountered a {}. Whatever shall we do?', e);
        // We encountered a "TypeError: WEE". Whatever shall we do?
    }

If there are more arguments than there are `{}`, then the remaining arguments will be logged as normal messages.

### Configuration

You can configure `Logger` to your needs.

#### Logger.config([options])

Set the desired options. Nonsensical inputs are silently ignored. Options marked (*) affect future instances only.

> **options**: Object. The options to set, which can be any of the ones shown below.

> **appenders**: (Array | Function). Add an array of appenders or a single appender. *

> **defaultAppender**: Boolean. Enable/Disable the default appender. *

> **masterEnable**: Boolean. Enable/Disable logging globally. Default is true.

> **masterLevel**: LoggerLevel. Set the global level. Default is TRACE.

> **timestamps**: Boolean. Enable/Disable timestamps. Default is false. *

> **verbosity**: Boolean. Enable/Disable verbosity. Default is false. *

    define('logger-loader', ['logger'], function (Logger) {
        'use strict';

        return Logger.config({
            masterLevel: Logger.ERROR,
            timestamps: true,
            appenders: function () {
                var log = Array.prototype.slice.call(arguments, 0).join('');
                // Do something.
            }
        });
    });

### Other

Any other features too small for their own section.

#### Logger.noConflict()

Reinsert the original value found in `window.Logger` prior to `Logger`, and get a reference to `Logger` so that you may reassign it as desired.

    window.Logger = 'beep';
    // After Logger is loaded...
    typeof window.Logger === 'function'; // true
    window.Boop = Logger.noConflict();
    typeof window.Boop === 'function'; // true
    typeof window.Logger === 'string'; // true
