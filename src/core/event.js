define(function(require, exports, module) {
    var kity = require('./kity');
    var utils = require('./utils');
    var Minder = require('./minder');

    /**
     * @class MinderEvent
     * @description 表示一个脑图中发生的事件
     */
    var MinderEvent = kity.createClass('MindEvent', {
        constructor: function(type, params, canstop) {
            params = params || {};
            kity.Utils.extend(this, params);
            this.type = type;
            this._canstop = canstop || false;
        },
        shouldStopPropagation: function() {
            return this._canstop && this._stoped;
        },

        shouldStopPropagationImmediately: function() {
            return this._canstop && this._immediatelyStoped;
        }
    });

    Minder.registerInitHook(function(option) {
        this._initEvents();
    });

    kity.extendClass(Minder, {
        _initEvents: function() {
            this._eventCallbacks = {};
        },
        _listen: function(type, callback) {
            var callbacks = this._eventCallbacks[type] || (this._eventCallbacks[type] = []);
            callbacks.push(callback);
        },
        _fire: function(e) {
            e.minder = this;
            var callbacks = this._eventCallbacks[e.type.toLowerCase()] || [];
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i].call(this, e);
            }
            return e.shouldStopPropagation();
        },

        on: function(name, callback) {
            var km = this;
            name.split(/\s+/).forEach(function(n) {
                km._listen(n.toLowerCase(), callback);
            });
            return this;
        },
        fire: function(type, params) {
            var e = new MinderEvent(type, params);
            this._fire(e);
            return this;
        }
    });

    module.exports = MinderEvent;
});
