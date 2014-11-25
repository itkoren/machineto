/*!
 * machineto
 * https://github.com/itkoren/machineto
 *
 * Copyright (c) 2014 Itai Koren (@itkoren) <itkoren@gmail.com>, contributors
 * Licensed under the MIT license.
 */
var machineto;
var path;
var requirejs;
var sinon;
var srcDir;
var sandbox;
var server;
var browser;
var expect;
var Machineto = Machineto || void 0;

path = require("path");
requirejs = require("requirejs");
expect = require("chai").expect;
sinon = require("sinon");

srcDir = path.join(__dirname, "..", "src");

machineto = require("../src/machineto");

requirejs.config({
    // Pass the top-level main.js/index.js require
    // function to requirejs so that node modules
    // are loaded relative to the top-level JS file.
    nodeRequire: require,
    paths: {
        "machineto": srcDir + "/machineto"
    }
});

sandbox = sinon.sandbox.create();

describe("AMD Tests", function() {
    before(function () {
        // before() is the first thing we run before all your tests.
        // Do one-time setup here.
    });
    beforeEach(function () {
        // beforeEach() is run before each test.
    });
    describe("Test machineto with requirejs", function () {
        it("should respond to getCurrentState method", function (done) {
            requirejs(["machineto"],
                function(Machineto) {
                    var sm = new Machineto();
                    expect(sm).itself.to.respondTo("getCurrentState");
                    done();
                });
        });
    });
    afterEach(function () {
        // afterEach() is run after each test.
    });
    after(function () {
        // after() is run after all your tests have completed.
        // Do teardown here.
    });
});