var machineto = require("./machineto");
var expect = require("chai").expect;
var sinon = require("sinon");
var sandbox = sinon.sandbox.create();

describe("machineto test", function() {
    before(function () {
        // before() is the first thing we run before all your tests.
        // Do one-time setup here.
    });
    beforeEach(function () {
        // beforeEach() is run before each test.
    });
    describe("Test machineto API", function () {
        it("should respond to event method", function () {
            var sm = new machineto();
            expect(sm).itself.to.respondTo("event");
        });
    });
    describe("Test two states transits", function () {
        it("should transit between 'off' and 'on'", function () {
            var on = sandbox.spy();
            var off = sandbox.spy();
            var sm = new machineto("off", {
                // When in off state, and the event is "on" we should execute the on action and go to on state.
                "off": { "turnOn": [on, "on"] },
                // Do the opposite
                "on": { "turnOff": [off, "off"] }
            });
            expect(on.called).to.be.false;
            expect(off.called).to.be.false;

            expect(sm.event("turnOn")).to.equal("on");
            expect(on.calledOnce).to.be.true;

            expect(sm.event("turnOff")).to.equal("off");
            expect(off.calledOnce).to.be.true;
        });
    });
    describe("Test argument passing to the action", function () {
        it("should call action with 'args1' and 'args2'", function () {
            var action = sandbox.spy();
            var args1 = { args: 1 };
            var args2 = { args: 2 };
            var sm = new machineto("state1", {
                "state1": {"event": [action, "state2"]},
                "state2": {"event": [action]}
            });

            expect(action.calledWith(args1)).to.be.false;
            sm.event("event", args1);
            expect(action.calledWith(args1)).to.be.true;
            expect(action.calledWith(args2)).to.be.false;
            sm.event("event", args2);
            expect(action.calledWith(args2)).to.be.true;
        });
    });
    describe("Test the action is triggered in the supplied context", function () {
        it("should call action with context", function () {
            var context = { action: function () { context.ctx = this; } };
            var action = sandbox.spy(context, "action");
            var sm = new machineto("state1", {
                "state1": {"event": [[action, context], "state2"]},
                "state2": {"event": [action]}
            });

            expect(context.ctx).to.be.undefined;
            sm.event("event");
            expect(context.ctx).to.equal(context);
        });
    });
    describe("Test wrong event in state", function () {
        it("should not move state with 'wrong' event", function () {
            var action = sandbox.spy();
            var sm = new machineto("state1", {
                "state1": {"event": [action, "state2"]},
                "state2": {"event": [action]}
            });

            expect(sm.event("wrong")).to.be.undefined;
        });
    });
    describe("Test multiple states transits", function () {
        it("should transit between multiple states", function () {
            var on = sandbox.spy();
            var off = sandbox.spy();
            var allow = sandbox.spy();
            var sm = new machineto("off", {
                "off": {
                    "setCode": [allow],
                    "turnOn": [on, "on"]
                },
                "on": {
                    "setCode": [allow],
                    "turnOff": [off, "off"]
                }
            });
            expect(on.called).to.be.false;
            expect(off.called).to.be.false;
            expect(allow.called).to.be.false;

            expect(sm.event("setCode", "#1234")).to.equal("off");
            expect(allow.calledOnce).to.be.true;
            expect(allow.calledWith("#1234")).to.be.true;

            expect(sm.event("turnOn", "now!")).to.equal("on");
            expect(on.calledOnce).to.be.true;
            expect(on.calledWith("now!")).to.be.true;

            expect(sm.event("setCode", "1234#")).to.equal("on");
            expect(allow.calledTwice).to.be.true;
            expect(allow.calledWith("1234#")).to.be.true;

            expect(sm.event("setCode", "#")).to.equal("on");
            expect(allow.calledThrice).to.be.true;
            expect(allow.calledWith("#")).to.be.true;

            expect(sm.event("turnOff", "bye!")).to.equal("off");
            expect(off.calledOnce).to.be.true;
            expect(off.calledWith("bye!")).to.be.true;
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