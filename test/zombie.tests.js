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
var http;
var connect;
var statik;
var app;
var server;
var zombie;
var browser;
var expect;
var Machineto = Machineto || void 0;

http = require("http");
connect = require("connect");
statik = require("serve-static");
path = require("path");
requirejs = require("requirejs");
expect = require("chai").expect;
sinon = require("sinon");
zombie = require("zombie");

srcDir = path.join(__dirname, "..", "src");

machineto = require("../src/machineto");

sandbox = sinon.sandbox.create();

describe("Headless Browser Tests", function() {
    before(function () {
        // before() is the first thing we run before all your tests.
        // Do one-time setup here.
    });
    beforeEach(function () {
        // beforeEach() is run before each test.
    });
    describe("Test machineto with zombie headless browser", function () {
        // load the contact page
        before(function() {
            app = connect();
            app.use(statik("coverage/data"));
            server = http.createServer(app).listen(9001);

            // initialize the browser using the same port as the test application
            // We call our test example.com
            zombie.localhost("*.example.com", 9001);
            zombie.extend(function(browser) {
                browser.on("console", function(level, message) {
                    if (message) {
                        if (console[level]) {
                            console[level](message);
                        }
                        else {
                            console.log(message);
                        }
                    }
                });
                browser.on("log", function(level, message) {
                    if (message) {
                        if (console[level]) {
                            console[level](message);
                        }
                        else {
                            console.log(message);
                        }
                    }
                });
            });

            // Load the page from localhost
            browser = zombie.create();
        });
        it("should getCurrentState from browser, current state should be 'state1'", function (done) {
            browser.visit("/example/browser.html").then(function() {
                expect(browser.success).to.be.true();
                browser.
                    pressButton("Get Current State", function () {
                        browser.assert.success();
                        expect(browser.text("#currentState")).to.equal("state1");
                        done();
                    });
            });
        });
        it("should fire 'event' on the state machine and getCurrentState from browser, current state should be 'state2'", function (done) {
            expect(browser.success).to.be.true();
            browser.
                pressButton("Fire Event", function() {
                    browser.assert.success();
                    browser.
                        pressButton("Get Current State", function() {
                            browser.assert.success();
                            expect(browser.text("#currentState")).to.equal("state2");
                            done();
                        });
                });
        });
        after(function () {
            // after() is run after all your tests have completed.
            // Do teardown here.
            if (server) {
                server.close();
            }
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