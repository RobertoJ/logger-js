module.exports = function (grunt) {
    'use strict';

    var SOURCE_FILE = 'logger.js';
    var BUILD_FILE = 'logger.min.js';
    var file = grunt.file;
    var log = grunt.log;
    var configuration = {
        pkg: file.readJSON('package.json'),
        // grunt-contrib-jshint configuration.
        jshint: {
            options: {
                globals: {
                    'module': true
                }
            },
            all: ['package.json', 'gruntfile.js', 'tasks/**/*.js', 'tests/modules/*.js', SOURCE_FILE]
        },
        // grunt-contrib-uglify configuration.
        uglify: {
            source: {
                files: {}
            },
            options: {
                compress: true,
                mangle: true,
                preserveComments: 'some'
            }
        }
    };

    // Ensure defaults.
    file.defaultEncoding = 'utf8';
    file.preserveBOM = false;
    configuration.uglify.source.files[BUILD_FILE] = SOURCE_FILE;

    // Load tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Initialize configuration.
    grunt.initConfig(configuration);

    // Lint tasks.
    grunt.registerTask('default', ['jshint']);

    // Clean task.
    grunt.registerTask('clean', 'Remove the previous build.', function () {
        if (file.isFile(BUILD_FILE)) {
            log.write('Removing previous build... ');
            file.delete(BUILD_FILE);
        } else {
            log.write('Nothing to do... ');
        }

        log.ok();
    });

    // Build task.
    grunt.registerTask('build', 'Create a new uglified build.', ['jshint', 'clean', 'uglify:source']);
};
