__state-machine.js__
```js
importScripts("path/to/machineto.min.js");
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