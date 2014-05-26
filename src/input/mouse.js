var MOUSE_EVENT_MAP = {
    mousedown: EVENT_START,
    mousemove: EVENT_MOVE,
    mouseup: EVENT_END,
    mouseout: EVENT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown mousemove mouseup';
var MOUSE_WINDOW_EVENTS = 'mouseout';

/**
 * Mouse events input
 * @param {Hammer} inst
 * @param {Function} callback
 * @constructor
 */
function MouseInput(/*inst, callback*/) {
    Input.apply(this, arguments);

    this._allow = true; // used by Input.TouchMouse to disable mouse events
    this._pressed = false; // mousedown state

    addEvent(this.inst.element, MOUSE_ELEMENT_EVENTS, this._handler);
    addEvent(window, MOUSE_WINDOW_EVENTS, this._handler);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function(ev) {
        if(ev.type == 'mousedown' && ev.button === 0) {
            this._pressed = true;
        }

        // mousebutton must be down, and mouse events are allowed (because of the TouchMouse input)
        if(!this._pressed || !this._allow) {
            return;
        }

        if(ev.type == 'mouseup' || ev.type == 'mouseout') {
            this._pressed = false;
        }

        var data = {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        };

        this.callback(this.inst, MOUSE_EVENT_MAP[ev.type], data);
    },

    /**
     * remove the event listeners
     */
    destroy: function() {
        removeEvent(this.inst.element, MOUSE_ELEMENT_EVENTS, this._handler);
        removeEvent(window, MOUSE_WINDOW_EVENTS, this._handler);
    }
});
