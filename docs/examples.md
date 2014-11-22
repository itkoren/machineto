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
function sleep(callback) {
    // Do Something
}
var sm = new Machineto("off", {
  "off": {
      "setCode": { action: allow },
      "turnOn": { action: on, nextState: "on" },
      "turnSleep": { action: sleep, async: true, nextState: "sleep" }
  },
  "on": {
      "setCode": { action: allow },
      "turnOff": { action: off, nextState: "off" }
  },
  "sleep": {
      "turnOn": { action: on, nextState: "on" },
  }
}, {
  "logger": console
});

sm.fire("setCode", "#1234");    // invokes allow("#1234") and returns true
sm.getCurrentState();           // returns "off" (current state)
sm.fire("turnOn", "now!");      // invokes on("now!") and returns true
sm.getCurrentState();           // returns "on" (current state)
sm.fire("turnOn", "check!");    // returns false (no action was called)
sm.getCurrentState();           // returns "on" (current state)
sm.fire("setCode", "1234#");    // invokes allow("1234#") and returns true
sm.getCurrentState();           // returns "on" (current state)
sm.fire("setCode", "#");        // invokes allow("#") and returns true
sm.getCurrentState();           // returns "on" (current state)
sm.fire("turnOff", "bye!");     // invokes off("bye!") and returns true
sm.getCurrentState();           // returns "off" (current state)
sm.fire("turnSleep", callback); // invokes sleep(callback) and returns true
sm.getCurrentState();           // returns "off" (current state)
sm.getCurrentState();           // returns "sleep" (current state) after callback is invoked

```

__Note:__ for more examples look at the tests