machineto
=========

Minimal (neto) implementation of a finite state machine in javascript.

Generates a finite state machine.
States can be defined, transitions to these states can be performed and parameters to the actions can be passed.

## Example
```js
function on() {
    // Do Something
}
function off() {
    // Do Something
}
function allow() {
    // Do Something
}
var sm = new Machineto("off", {
  "off": {
      "setCode": { action: allow },
      "turnOn": { action: on, newState: "on" }
  },
  "on": {
      "setCode": { action: allow },
      "turnOff": { action: off, newState: "off" }
  }
});

sm.fire("setCode", "#1234"); // invokes allow("#1234") and returns true
sm.getCurrentState();        // returns "off" (current state)
sm.fire("turnOn", "now!");   // invokes on("now!") and returns true
sm.getCurrentState();        // returns "on" (current state)
sm.fire("turnOn", "check!")  // return false (no action was called)
sm.getCurrentState();        // returns "on" (current state)
sm.fire("setCode", "1234#"); // invokes allow("1234#") and returns true
sm.getCurrentState();        // returns "on" (current state)
sm.fire("setCode", "#");     // invokes allow("#") and returns true
sm.getCurrentState();        // returns "on" (current state)
sm.fire("turnOff", "bye!");  // invokes off("bye!") and returns true
sm.getCurrentState();        // returns "off" (current state)

```