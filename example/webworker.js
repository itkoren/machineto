importScripts("../src/machineto.js");
function action() {
    console.log("action");
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
            "response": {
                "name": event.data.request.name,
                "value": sm[event.data.request.name] &&
                         sm[event.data.request.name].apply(this, event.data.request.params)
            }
        });
    }
};