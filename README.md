machineto
=========

Minimal (neto) implementation of a finite state machine in javascript.

Generates a finite state machine.
States can be defined, transitions to these states can be performed and parameters to the actions can be passed.

## Node.js
```js
npm install machineto
```
```js
var machineto = require("machineto");
var sm = new machineto("state1", {
    "state1": { "event": { action: action, nextState: "state2" } },
    "state2": { "event": { action: action } }
});
sm.fire("event");
```

## Browser
```js
<script type="text/javascript" src="machineto.js"></script>
```
```js
<script type="text/javascript">
    var sm = new Machineto("state1", {
        "state1": { "event": { action: action, nextState: "state2" } },
        "state2": { "event": { action: action } }
    });
    sm.fire("event");
</script>
```

## AMD/Require.js
```js
require.config({
    paths: {
        "machineto": "path/to/machineto",
    }
});
```
```js
define(["machineto"], function (machineto) {
    var sm = new machineto("state1", {
        "state1": { "event": { action: action, nextState: "state2" } },
        "state2": { "event": { action: action } }
    });
    sm.fire("event");
});
```

## A Quick Example
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
      "turnOn": { action: on, nextState: "on" }
  },
  "on": {
      "setCode": { action: allow },
      "turnOff": { action: off, nextState: "off" }
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

__Note:__ for more examples look at the tests