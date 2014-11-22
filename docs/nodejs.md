```
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