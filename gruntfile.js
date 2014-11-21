module.exports = function (grunt) {

    // Displays the elapsed execution time of grunt tasks
    require("time-grunt")(grunt);

    // Load NPM Tasks
    require("load-grunt-tasks")(grunt, ["grunt-*"]);

    // Project configuration.
    grunt.initConfig({

        // Store your Package file so you can reference its specific data whenever necessary
        "pkg": grunt.file.readJSON("package.json"),

        // Store your Bower file so you can reference its specific data whenever necessary
        "bower": grunt.file.readJSON("bower.json"),

        // JSHint config
        "jshint": {
            /*
             Note:
             In case there is a /release/ directory found, we don't want to lint that
             so we use the ! (bang) operator to ignore the specified directory
             */
            "files": ["./src/*.js", "./test/*.js"],
            "options": {
                "jshintrc":".jshintrc"
            }
        },

        // Configure Copy src to dist
        "copy": {
            "main": {
                "src": "./src/machineto.js",
                "dest": "./dist/machineto.js"
            }
        },

        // Configure a mochaTest task
        "mochaTest": {
            "test": {
                "options": {
                    "reporter": "spec",
                    "captureFile": "./test/results.txt", // Optionally capture the reporter output to a file
                    "quiet": false, // Optionally suppress output to standard out (defaults to false)
                    "clearRequireCache": false, // Optionally clear the require cache before running tests (defaults to false)

                    // Require blanket wrapper here to instrument other required
                    // files on the fly.
                    //
                    // NB. We cannot require blanket directly as it
                    // detects that we are not running mocha cli and loads differently.
                    //
                    // NNB. As mocha is 'clever' enough to only run the tests once for
                    // each file the following coverage task does not actually run any
                    // tests which is why the coverage instrumentation has to be done here
                    "require": "coverage/blanket"
                },
                "src": ["./test/*.js"]
            },
            "coverage": {
                "options": {
                    "reporter": "html-cov",
                    // use the quiet flag to suppress the mocha console output
                    "quiet": true,
                    // specify a destination file to capture the mocha
                    // output (the quiet option does not suppress this)
                    "captureFile": "coverage/coverage.html"
                },
                "src": ["./test/*.js"]
            },
            // The travis-cov reporter will fail the tests if the
            // coverage falls below the threshold configured in package.json
            "travis-cov": {
                "options": {
                    "reporter": "travis-cov",
                    quiet: false
                },
                "src": ["./test/*.js"]
            }
        },

        // Configure the uglify task
        "uglify": {
            "options": {
                "banner": "/*! <%= pkg.name %> | <%= pkg.version %> | <%= grunt.template.today(\"yyyy-mm-dd\") %> /\nCopyright (c) 2014 Itai Koren"
            },
            "dist": {
                "src": "./dist/<%= pkg.name %>.js",
                "dest": "./dist/<%= pkg.name %>.min.js"
            }
        },

        // Configure version bump
        bump: {
            options: {
                files: ["package.json", "bower.json"],
                updateConfigs: ["pkg", "bower"],
                commit: true,
                commitMessage: "Release v%VERSION%",
                commitFiles: ["package.json", "bower.json", "dist/*.*", "test/results.txt"],
                createTag: true,
                tagName: "v%VERSION%",
                tagMessage: "Version %VERSION%",
                push: false,
                pushTo: "upstream",
                gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d",
                globalReplace: false
            }
        },

        // Run: `grunt watch` from command line for this section to take effect
        "watch": {
            "files": ["<%= jshint.files %>"],
            "tasks": "default"
        }

    });

    // Unit Testing Task
    grunt.registerTask("test", ["mochaTest"]);

    // Default Task
    grunt.registerTask("default", ["jshint", "copy", "test"]);

    // Release Task
    grunt.registerTask("release", ["default", "uglify", "bump"]);
};