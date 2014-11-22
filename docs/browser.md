```html
<script type="text/javascript" src="path/to/machineto.min.js"></script>
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