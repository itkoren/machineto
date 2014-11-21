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
function action() {
    // Do Something
}
var machineto = require("machineto");
var sm = new machineto("state1", {
    "state1": { "event": { action: action, nextState: "state2" } },
    "state2": { "event": { action: action } }
}, {
    "logger": true
});
sm.fire("event");
```

## Browser
```js
<script type="text/javascript" src="path/to/machineto.js"></script>
```
```html
<script type="text/javascript">
    function action() {
        // Do Something
    }
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
    function action() {
        // Do Something
    }

    var sm = new machineto("state1", {
        "state1": { "event": { action: action, nextState: "state2" } },
        "state2": { "event": { action: action } }
    });
    sm.fire("event");
});
```

## WebWorker
__state-machine.js__
```js
importScripts("path/to/machineto.js");
function action() {
    // Do Something
}
var sm = new Machineto("state1", {
    "state1": { "event": { action: action, nextState: "state2" } },
    "state2": { "event": { action: action } }
}, {
    "logger": true
});
onmessage = function (event) {
    if (event.data.request &&
        event.data.request.name) {
        postMessage({
            "response": sm[event.data.request.name] &&
                        sm[event.data.request.name].apply(this, event.data.request.params)
        });
    }
};
```

__example.html__
```html
<script type="text/javascript">
    var workerSM = new Worker("path/to/state-machine.js");

    workerSM.onmessage = function (event) {
        console.log("State Machine Worker said: " + JSON.stringify(event.data));
    };

    workerSM.postMessage({ request: {
        "name": "getCurrentState"
    }});
    workerSM.postMessage({ request: {
        "name": "fire",
        "params": [
                "event"
        ]
    }});
    workerSM.postMessage({ request: {
        "name": "getCurrentState"
    }});
</script>
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
}, {
  "logger": console
});

sm.fire("setCode", "#1234"); // invokes allow("#1234") and returns true
sm.getCurrentState();        // returns "off" (current state)
sm.fire("turnOn", "now!");   // invokes on("now!") and returns true
sm.getCurrentState();        // returns "on" (current state)
sm.fire("turnOn", "check!"); // returns false (no action was called)
sm.getCurrentState();        // returns "on" (current state)
sm.fire("setCode", "1234#"); // invokes allow("1234#") and returns true
sm.getCurrentState();        // returns "on" (current state)
sm.fire("setCode", "#");     // invokes allow("#") and returns true
sm.getCurrentState();        // returns "on" (current state)
sm.fire("turnOff", "bye!");  // invokes off("bye!") and returns true
sm.getCurrentState();        // returns "off" (current state)

```

__Note:__ for more examples look at the tests


__Special thanks to [@miki2826](https://github.com/miki2826), for helping to design and create this piece__