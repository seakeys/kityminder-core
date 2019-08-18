define(function(require, exports, module) {
    var kity = require('../core/kity');
    var Module = require('../core/module');

    var ViewDragger = kity.createClass('ViewDragger', {
        constructor: function(minder) {
            this._minder = minder;
        },
        move: function(offset, duration) {
            var targetPosition = this.getMovement().offset(offset);
            this._minder.getRenderContainer().setTranslate(targetPosition.round());
        },
        getMovement: function() {
            var translate = this._minder.getRenderContainer().transform.translate;
            return translate ? translate[0] : new kity.Point();
        }
    });

    Module.register('View', function() {
        return {
            init: function() {
                this._viewDragger = new ViewDragger(this);
            }
        };
    });
});