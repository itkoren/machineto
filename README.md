# machineto 
[![npm version](http://img.shields.io/npm/v/machineto.svg)](http://img.shields.io/npm/v/machineto.svg)
[![npm downloads](http://img.shields.io/npm/dm/machineto.svg)](http://img.shields.io/npm/dm/machineto.svg)
[![Bower version](https://badge.fury.io/bo/machineto.svg)](http://badge.fury.io/bo/machineto.svg)
[![dependency status](https://david-dm.org/clux/badgify.svg)]((https://david-dm.org/clux/badgify.svg))
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![build status](http://img.shields.io/appveyor/ci/gruntjs/grunt.svg)](http://img.shields.io/appveyor/ci/gruntjs/grunt.svg)
[![coverage status](http://img.shields.io/badge/coverage-93%25-green.svg)](http://img.shields.io/badge/coverage-93%25-green.svg)

[![NPM](https://nodei.co/npm/machineto.png)](https://nodei.co/npm/machineto/)

> Minimal (neto) implementation of a finite state machine in javascript

* [Overview](#overview)
* [Node.js](#nodejs)
* [Browser](#browser)
* [AMD/Require.js](#amdrequirejs)
* [Web Worker](#web-worker)
* [Examples](#examples)
* [Contributing](#contributing)
* [Author](#author)
* [License](#license)
* [Releases](#releases)


Please [report any bugs or feature requests](https://github.com/itkoren/machineto/issues/new), thanks!

## Overview
Generates a finite state machine.
States can be defined, transitions to these states can be performed and parameters to the actions can be passed.

## Node.js
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

## Browser
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

## Web Worker
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

## Examples
### A Quick Example
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

## Contributing
Find a bug? Have a feature request? Please [create an Issue](https://github.com/itkoren/machineto/issues).
If you find this project useful please consider "starring" it to show your support!

## Author

**Itai Koren (@itkoren) <itkoren@gmail.com>**
 
+ [github/itkoren](https://github.com/itkoren)
+ [twitter/itkoren](http://twitter.com/itkoren) 

__Special thanks to [@miki2826](https://github.com/miki2826), for helping to design and create this piece__

## License
Copyright (c) 2014 Itai Koren (@itkoren) <itkoren@gmail.com>, contributors.  


## Releases
<a name="0.0.15"></a>
#### 0.0.15 (2014-11-22)


<a name="0.0.14"></a>
#### 0.0.14 (2014-11-22)


##### Bug Fixes

* **dependencies:** update package descriptors ([802f55c5](https://github.com/itkoren/machineto/commit/802f55c58c0cf2560b7fc385a0f0eab3edcc2d07))


##### Features

* **build:** added tasks to grunt file ([f392e164](https://github.com/itkoren/machineto/commit/f392e1642758479da0f832745afbbd10937cda7e))




***

_This file was generated by [grunt-verb](https://github.com/assemble/grunt-verb) on November 22, 2014._