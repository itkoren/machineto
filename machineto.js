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
 *                  "event3": { action: action3, context: context, nextState: "state1" }
 *              }
 *         }
 * @returns {Object}
 */
(function() {
    var root = this;

    function Machineto(initialState, transitions) {
        var currentState;
        var transitionDiagram;

        if ("string" === typeof initialState && "object" === typeof transitions) {
            currentState = initialState;
            transitionDiagram = transitions;
        }

        /**
         * Lookup for the correct event object on the current state
         * @param {String} eventName - the name of the event to lookup
         * @returns {Object}
         */
        function _lookup(eventName) {
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
            try {
                event.action.apply(event.context, params);
                return true;
            }
            catch(ex) {}
            return false;
        }
        /**
         * Update the current state to the next state
         * @param {String} nextState - the new/next state
         * @returns {Object}
         */
        function _updateState(nextState) {
            currentState = nextState || currentState;
        }
        /**
         * Gets the current state of the state machine
         * @returns {String}
         */
        function getCurrentState() {
            return currentState;
        }
        /**
         * Fire an event on the state machine
         * @param {String} eventName - the name of the event
         * @param {Object} params - the parameters to pass to the action
         * @returns {Object}
         */
        function fire(eventName) {
            // Lookup for the event for further use
            var event = _lookup(eventName);
            var params = (1 < arguments.length) ? Array.prototype.slice.call(arguments, 1) : void 0;

            // Invoke the action function
            if (event && _invoke(event, params)) {
                // Update the current state to the next state
                _updateState(event.nextState);
                return true;
            }

            return false;
        }

        // The "public" interface (revealing pattern)
        return {
            getCurrentState: getCurrentState,
            fire: fire
        };
    }

    // NodeJS
    if ("undefined" !== typeof module && module.exports) {
        module.exports = Machineto;
    }
    // AMD / RequireJS
    else if ("undefined" !== typeof define && define.amd) {
        define([], function() {
            return Machineto;
        });
    }
    // Included directly via <script> tag
    else {
        root.Machineto = Machineto;
    }
})();