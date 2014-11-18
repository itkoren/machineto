/**
 * Create a finite state machine
 * @param {String} current - initialization state for the state machine
 * @param {Object} machine - the state machine's flow:
 *          {
 *              "state1": {
 *                  "event1": [action1, "state2"],
 *                  "event2": [action2]
 *              },
 *              "state2": {
 *                  "event3": [
 *                      [action3, context],
 *                      "state1"
 *                  ]
 *              }
 *         }
 * @returns {Object}
 */
(function () {
    var root = this;

    function Machineto(current, machine) {
        return {
            /**
             * Send an event to the state machine
             * @param {String} name - the name of the event
             * @param {Object} params - the parameters to pass to the action
             * @returns {Object}
             */
            event: function (name) {
                var params = (1 < arguments.length) ? Array.prototype.slice.call(arguments, 1) : void 0;
                /**
                 * Save [action, nextState] in name for further use and return name
                 * @returns {Array}
                 */
                function _assign() {
                    name = machine[current][name];

                    return name;
                }
                /**
                 * name[0] or name[0][0] is the function to invoke (if a context is given)
                 * call the function in the context or call it directly with the params
                 * and return an indicator weather to set next state or not
                 * @returns {Boolean}
                 */
                function _invoke() {

                    try {
                        (name[0][0] || name[0]).apply(name[0][1], params);
                        return true;
                    }
                    catch(ex) {}

                    return false;
                }
                /**
                 * The next state is the new state and the new state is returned
                 * @returns {Object}
                 */
                function _updateState() {
                    current = name[1] || current;

                    return current;
                }
                // Save [action, nextState] in name for further use
                // If name is defined
                // name[0] or name[0][0] is the function to invoke (if a context is given)
                // call the function in the context or call it directly with the params
                // The next state is the new state and the new state is returned
                return (_assign() &&
                        _invoke() &&
                        _updateState());
            }
        };
    }

    // NodeJS
    if ("undefined" !== typeof module && module.exports) {
        module.exports = Machineto;
    }
    // AMD / RequireJS
    else if ("undefined" !== typeof define && define.amd) {
        define([], function () {
            return Machineto;
        });
    }
    // Included directly via <script> tag
    else {
        root.Machineto = Machineto;
    }
})();