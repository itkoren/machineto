/*!
 * machineto
 * https://github.com/itkoren/machineto
 *
 * Copyright (c) 2014 Itai Koren (@itkoren) <itkoren@gmail.com>, contributors
 * Licensed under the MIT license.
 */
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
                "jshintrc": ".jshintrc"
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
                    "quiet": false,
                    "captureFile": "./coverage/results.txt"
                },
                "src": ["./test/*.js"]
            }
        },

        // Configure the uglify task
        "uglify": {
            "options": {
                "banner": "/*! <%= pkg.name %> | <%= pkg.version %> | <%= grunt.template.today(\"yyyy-mm-dd\") %> | Copyright (c) 2014 Itai Koren, contributors */\n"
            },
            "dist": {
                "src": "./dist/<%= pkg.name %>.js",
                "dest": "./dist/<%= pkg.name %>.min.js"
            }
        },

        // Configure the string-replace task
        "string-replace": {
            "uglify": {
                "files": {
                    "dist/<%= pkg.name %>.js": "dist/<%= pkg.name %>.js"
                },
                "options": {
                    "replacements": [{
                        "pattern": "* <%= pkg.name %>",
                        "replacement": "* <%= pkg.name %> | <%= pkg.version %> | <%= grunt.template.today(\"yyyy-mm-dd\") %>"
                    }]
                }
            },
            "coverage": {
                "files": {
                    "docs/coverage.json": "coverage/results.txt"
                },
                "options": {
                    "replacements": [{
                        "pattern": "Coverage: ",
                        "replacement": ""
                    }, {
                        "pattern": "\nCoverage succeeded.",
                        "replacement": ""
                    }, {
                        "pattern": /(\d{1,})%/,
                        "replacement": "{\n\"coverage\": \"$1\"\n}"
                    }]
                }
            }
        },

        // Configure the changelog task
        "changelog": {
            "options": {
                "dest": "docs/changelog.md"
            }
        },

        // Configure the verb task
        "verb": {
            "readme": {
                "files": [
                    {
                        "src": [".verbrc.md"],
                        "dest": "README.md"
                    },
                    {
                        "expand": true,
                        "cwd": "docs",
                        "src": ["**/*.tmpl.md"],
                        "dest": ".",
                        "ext": ".md"
                    }
                ]
            }
        },

        // Configure version bump task
        "bump": {
            "options": {
                "files": ["package.json", "bower.json"],
                "updateConfigs": ["pkg", "bower"],
                "commit": true,
                "commitMessage": "Release v%VERSION%",
                "commitFiles": ["package.json", "bower.json", "dist/*.*", "test/results.txt", "coverage/results.txt", "docs/*.*", "README.md"],
                "createTag": true,
                "tagName": "v%VERSION%",
                "tagMessage": "Version %VERSION%",
                "push": false,
                "pushTo": "upstream",
                "gitDescribeOptions": "--tags --always --abbrev=1 --dirty=-d",
                "globalReplace": false
            }
        },

        // Configure release task
        "release": {
            "npm": {
                "options": {
                    "bump": false, //default: true
                    "file": "package.json", //default: package.json
                    "add": false, //default: true
                    "commit": false, //default: true
                    "tag": false, //default: true
                    "push": false, //default: true
                    "pushTags": false, //default: true
                    "npm": true, //default: true
                    "npmtag": true, //default: no tag
                    "github": {
                        "repo": "itkoren/machineto"
                    }
                }
            },
            "bower": {
                "options": {
                    "bump": false, //default: true
                    "file": "bower.json", //default: package.json
                    "add": false, //default: true
                    "commit": false, //default: true
                    "tag": false, //default: true
                    "push": false, //default: true
                    "pushTags": false, //default: true
                    "npm": false, //default: true
                    "npmtag": false, //default: no tag
                    "github": {
                        "repo": "itkoren/machineto"
                    }
                }
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

    // Documentation Task
    grunt.registerTask("docs", ["changelog", "string-replace:coverage", "verb"]);

    // Dist Task
    grunt.registerTask("dist", ["copy", "uglify", "string-replace:uglify"]);

    // Publish Task
    grunt.registerTask("publish", ["release:npm", "release:bower"]);

    // Default Task
    grunt.registerTask("default", ["jshint", "test"]);

    // Release Task
    grunt.registerTask("release", ["default", "dist", "docs"]);

    // Version Task
    grunt.registerTask("version", ["bump-only:minor", "docs", "bump-commit"]);

    // Deploy Task
    grunt.registerTask("deploy", ["release", "version", "publish"]);
};