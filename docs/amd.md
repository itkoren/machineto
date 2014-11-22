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