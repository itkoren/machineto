var machineto = require("../src/machineto");
var path = require("path");
var requirejs = require("requirejs");
var expect = require("chai").expect;
var sinon = require("sinon");
var sandbox = sinon.sandbox.create();
var srcDir = path.join(__dirname, "..", "src");

requirejs.config({
    // Pass the top-level main.js/index.js require
    // function to requirejs so that node modules
    // are loaded relative to the top-level JS file.
    nodeRequire: require,
    paths: {
        "machineto": srcDir + "/machineto"
    }
});

describe("machineto Tests", function() {
    before(function () {
        // before() is the first thing we run before all your tests.
        // Do one-time setup here.
    });
    beforeEach(function () {
        // beforeEach() is run before each test.
    });
    describe("Test machineto API", function () {
        var sm = new machineto();
        it("should respond to fire method", function () {
            expect(sm).itself.to.respondTo("fire");
        });
        it("should respond to getCurrentState method", function () {
            expect(sm).itself.to.respondTo("getCurrentState");
        });
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
    describe("Test two states transits", function () {
        var on = sandbox.spy();
        var off = sandbox.spy();
        var sm = new machineto("off", {
            // When in "off" state, and the event is "turnOn" we should execute the on action and go to "on" state.
            "off": { "turnOn": { action: on, nextState: "on" } },
            // Do the opposite
            "on": { "turnOff": { action: off, nextState: "off" } }
        }, {
            "logger": true
        });

        it("'off' and 'on' should not have been called", function () {
            expect(on.called).to.be.false();
            expect(off.called).to.be.false();
        });

        it("'on' should have been called once and current state should be 'on'", function () {
            expect(sm.fire("turnOn")).to.be.true();
            expect(sm.getCurrentState()).to.equal("on");
            expect(on.calledOnce).to.be.true();
        });

        it("'off' should have been called once and current state should be 'off'", function () {
            expect(sm.fire("turnOff")).to.be.true();
            expect(sm.getCurrentState()).to.equal("off");
            expect(off.calledOnce).to.be.true();
        });
    });
    describe("Test argument passing to the action", function () {
        var action = sandbox.spy();
        var args1 = { args: 1 };
        var args2 = { args: 2 };
        var sm = new machineto("state1", {
            "state1": { "event": { action: action, nextState: "state2" } },
            "state2": { "event": { action: action } }
        }, {
            "logger": console
        });

        it("should call action with 'args1'", function () {
            expect(action.calledWith(args1)).to.be.false();
            sm.fire("event", args1);
            expect(action.calledWith(args1)).to.be.true();
        });

        it("should call action with 'args2'", function () {
            expect(action.calledWith(args2)).to.be.false();
            sm.fire("event", args2);
            expect(action.calledWith(args2)).to.be.true();
        });
    });
    describe("Test the action is triggered in the supplied context", function () {
        var context = { action: function () { context.ctx = this; } };
        var action = sandbox.spy(context, "action");
        var sm = new machineto("state1", {
            "state1": {"event": { action: action, context: context, nextState: "state2"} },
            "state2": {"event": { action: action } }
        });

        it("should call action with context", function () {
            expect(context.ctx).to.be.undefined();
            sm.fire("event");
            expect(context.ctx).to.equal(context);
        });
    });
    describe("Test wrong event in state", function () {
        var action = sandbox.spy();
        var sm = new machineto("state1", {
            "state1": {"event": { action: action, nextState: "state2" } },
            "state2": {"event": { action: action }}
        });

        it("should not move state with 'wrong' event", function () {
            expect(sm.fire("wrong")).to.be.false();
            expect(sm.getCurrentState()).to.equal("state1");
        });
    });
    describe("Test exception in event action", function () {
        var action = sandbox.spy(function () { throw new Error("exception in action"); });
        var sm = new machineto("state1", {
            "state1": {"event": { action: action, nextState: "state2" } },
            "state2": {"event": { action: action }}
        });

        it("should not move state when there was an exception in event action", function () {
            expect(sm.fire("event")).to.be.false();
            expect(sm.getCurrentState()).to.equal("state1");
        });
    });
    describe("Test multiple states transits", function () {
        var on = sandbox.spy();
        var off = sandbox.spy();
        var allow = sandbox.spy();
        var sm = new machineto("off", {
            "off": {
                "setCode": { action: allow },
                "turnOn": { action: on, nextState: "on" }
            },
            "on": {
                "setCode": { action: allow },
                "turnOff": { action: off, nextState: "off" }
            }
        });

        it("'off', 'on' and 'allow' should not have been called", function () {
            expect(on.called).to.be.false();
            expect(off.called).to.be.false();
            expect(allow.called).to.be.false();
        });

        it("'allow' should have been called once with '#1234' and current state should be 'off'", function () {
            expect(sm.fire("setCode", "#1234")).to.be.true();
            expect(sm.getCurrentState()).to.equal("off");
            expect(allow.calledOnce).to.be.true();
            expect(allow.calledWith("#1234")).to.be.true();
        });

        it("'on' should have been called once with 'now!' and current state should be 'on'", function () {
            expect(sm.fire("turnOn", "now!")).to.be.true();
            expect(sm.getCurrentState()).to.equal("on");
            expect(on.calledOnce).to.be.true();
            expect(on.calledWith("now!")).to.be.true();
        });

        it("no action should be called and current state should stay 'on'", function () {
            expect(sm.fire("turnOn", "check!")).to.be.false();
            expect(sm.getCurrentState()).to.equal("on");
            expect(on.calledOnce).to.be.true();
            expect(on.calledWith("check!")).to.be.false();
        });

        it("'allow' should have been called twice, last called with '1234#' and current state should be 'on'", function () {
            expect(sm.fire("setCode", "1234#")).to.be.true();
            expect(sm.getCurrentState()).to.equal("on");
            expect(allow.calledTwice).to.be.true();
            expect(allow.calledWith("1234#")).to.be.true();
        });

        it("'allow' should have been called three times, last called with '#' and current state should be 'on'", function () {
            expect(sm.fire("setCode", "#")).to.be.true();
            expect(sm.getCurrentState()).to.equal("on");
            expect(allow.calledThrice).to.be.true();
            expect(allow.calledWith("#")).to.be.true();
        });

        it("'off' should have been called once with 'bye!' and current state should be 'off'", function () {
            expect(sm.fire("turnOff", "bye!")).to.be.true();
            expect(sm.getCurrentState()).to.equal("off");
            expect(off.calledOnce).to.be.true();
            expect(off.calledWith("bye!")).to.be.true();
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