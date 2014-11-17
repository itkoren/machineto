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
        "setCode": [allow],
        "turnOn": [on, "on"]
    },
    "on": {
        "setCode": [allow],
        "turnOff": [off, "off"]
    }
});

sm.event("setCode", "#1234"); // invokes allow("#1234") and returns "off" (current state)
sm.event("turnOn", "now!");   // invokes on("now!") and returns "on" (current state)
sm.event("setCode", "1234#"); // invokes allow("1234#") and returns "on" (current state)
sm.event("setCode", "#");     // invokes allow("#") and returns "on" (current state)
sm.event("turnOff", "bye!");  // invokes off("bye!") and returns "off" (current state)

```