(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * machineto
 * https://github.com/itkoren/machineto
 *
 * Copyright (c) 2014 Itai Koren (@itkoren) <itkoren@gmail.com>, contributors
 * Licensed under the MIT license.
 */
/**
 * Create a finite state machine
 * @param {String} initialState - initialization state for the state machine
 * @param {Object} transitions - the state machine's transitions/flow:
 *          {
 *              "state1": {
 *                  "event1": { action: action1, nextState: "state2" },
 *                  "event2": { action: action2 }
 *              },
 *              "state2": {
 *                  "event3": { action: action3, async: true, context: context, nextState: "state1" } // when async=true, last argument to the action is expected to be the callback
 *              }
 *         }
 * @param {Object} options - additional options (only logger for now):
 *         {
 *              "logger": logger || true // logger should implement a "log" method. If no logger is supplied, I can use the console, this can be controlled by setting "logger" to true/false
 *         }
 * @returns {Object}
 */
(function() {
    // self will exist inside a WebWorker, otherwise, use this
    var root = "undefined" !== typeof self ? self : this;

    function Machineto(initialState, transitions, options) {
        options = options || {};

        var currentState;
        var transitionDiagram;
        var logger = _getLogger(options.logger);

        if ("string" === typeof initialState && "object" === typeof transitions) {
            logger.log("[INITIALIZING]: Got needed initialization data");
            currentState = initialState;
            logger.log("[INITIALIZING]: currentState = " + currentState);
            transitionDiagram = transitions;
            logger.log("[INITIALIZING]: transitionDiagram = " + JSON.stringify(transitionDiagram));
        }

        /**
         * Internal empty function
         */
        function empty() {}

        /**
         * Internal logging function which use the console
         * @param {String} msg - the message to log
         */
        function log(msg) {
            if (console) {
                console.log(msg);
            }
        }

        /**
         * Internal logger factory
         * @param {Object}|{Boolean} logger - the logger interface to use
         *        or a boolean flag which represents whether to use the console for logging
         * @returns {Object}
         */
        function _getLogger(logger) {
            // Check if got a logger interface
            if ("object" === typeof logger && "function" === typeof logger.log) {
                return logger;
            }
            // Check if not to use console
            else if (true !== logger) {
                return {
                    log: empty
                };
            }
            // Use console
            else {
                return {
                    log: log
                };
            }
        }

        /**
         * Lookup for the correct event object on the current state
         * @param {String} eventName - the name of the event to lookup
         * @returns {Object}
         */
        function _lookup(eventName) {
            logger.log("[LOOKUP]: currentState = " + currentState + ", eventName = " + eventName);
            return transitionDiagram[currentState][eventName];
        }
        /**
         * Invoke the action function of a specified event object
         * call the function in the context or call it directly with the supplied params
         * and return an indicator weather to set next state or not
         * @param {Object} event - the event object representation
         * @param {Array} params - the array of parameters to use for invoking the event action
         * @returns {Boolean}
         */
        function _invoke(event, params) {
            logger.log("[ACTION]: params = " + JSON.stringify(params));

            try {
                event.action.apply(event.context, params);
                logger.log("ACTION: SUCCESS");
                return true;
            }
            catch(ex) {
                logger.log("ACTION: ERROR = " + JSON.stringify(ex));
            }
            return false;
        }
        /**
         * Update the current state to the next state
         * @param {String} nextState - the new/next state
         * @returns {Object}
         */
        function _updateState(nextState) {
            logger.log("[UPDATE]: nextState = " + nextState);
            currentState = nextState || currentState;
        }
        /**
         * Gets the current state of the state machine
         * @returns {String}
         */
        function getCurrentState() {
            logger.log("[GET {getCurrentState}]: currentState = " + currentState);
            return currentState;
        }
        /**
         * Fire an event on the state machine
         * @param {String} eventName - the name of the event
         * @param {Object} params - the parameters to pass to the action
         * @returns {Object}
         */
        function fire(eventName) {
            logger.log("[FIRE {fire}]: eventName = " + eventName);

            // Lookup for the event for further use
            var event = _lookup(eventName);
            var params = (1 < arguments.length) ? Array.prototype.slice.call(arguments, 1) : void 0;
            var async;

            // Invoke the action function
            if (event) {
                async = event.async && params && "function" === typeof params[params.length - 1] && params[params.length - 1];

                if (async) {
                    logger.log("[FIRE {fire}]: async event action");

                    // Wrap the original callback so the state can be updated upon completion
                    params[params.length - 1] = function() {
                        var args = (1 < arguments.length) ? Array.prototype.slice.call(arguments, 1) : void 0;

                        // Update the current state to the next state
                        _updateState(event.nextState);

                        async.apply(event.context, args);
                    };
                }

                if (_invoke(event, params)) {
                    if (!async) {
                        // Update the current state to the next state
                        _updateState(event.nextState);
                    }

                    logger.log("[FIRE {fire}]: FIRED");
                    return true;
                }
            }

            logger.log("[FIRE {fire}]: NOT FIRED");
            return false;
        }

        // The "public" interface (revealing pattern)
        return {
            getCurrentState: getCurrentState,
            fire: fire
        };
    }

    // AMD / RequireJS
    if ("undefined" !== typeof define && define.amd) {
        define([], function() {
            return Machineto;
        });
    }
    // NodeJS
    else if ("undefined" !== typeof module && module.exports) {
        module.exports = Machineto;
    }
    // Included directly via <script> tag or inside a WebWorker
    else {
        root.Machineto = Machineto;
    }
})();
},{}]},{},[1]);
