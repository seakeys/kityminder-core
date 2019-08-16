define(function(require, exports, module) {
    var kity = require('./kity');
    var Minder = require('./minder');
    var MinderNode = require('./node');

    var _templates = {};

    function register(name, supports) {
        _templates[name] = supports;
    }
    exports.register = register;

    kity.extendClass(Minder, (function() {
        var originGetTheme = Minder.prototype.getTheme;
        return {
            useTemplate: function(name, duration) {
                this.setTemplate(name);
                this.refresh(duration || 800);
            },

            getTemplate: function() {
                return this._template || 'default';
            },

            setTemplate: function(name) {
                this._template = name || null;
            },

            getTemplateSupport: function(method) {
                var supports = _templates[this.getTemplate()];
                return supports && supports[method];
            },

            getTheme: function(node) {
                var support = this.getTemplateSupport('getTheme') || originGetTheme;
                return support.call(this, node);
            }
        };
    })());


    kity.extendClass(MinderNode, (function() {
        var originGetLayout = MinderNode.prototype.getLayout;
        var originGetConnect = MinderNode.prototype.getConnect;
        return {
            getLayout: function() {
                var support = this.getMinder().getTemplateSupport('getLayout') || originGetLayout;
                return support.call(this, this);
            },

            getConnect: function() {
                var support = this.getMinder().getTemplateSupport('getConnect') || originGetConnect;
                return support.call(this, this);
            }
        };
    })());
});