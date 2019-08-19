define(function(require, exports, module) {
    var kity = require('./kity');
    var utils = require('./utils');
    var Module = require('./module');
    var Minder = require('./minder');
    var MinderNode = require('./node');

    // 连线提供方
    var _connectProviders = {};

    function register(name, provider) {
        _connectProviders[name] = provider;
        console.log(_connectProviders[name])
    }

    // register('default', function(node, parent, connection) {
    //     connection.setPathData([
    //         'M', parent.getLayoutVertexOut(),
    //         'L', node.getLayoutVertexIn()
    //     ]);
    // });

    kity.extendClass(MinderNode, {
        getConnectProvider: function() {
            
            return _connectProviders[this.getConnect()];
        }
    });

    kity.extendClass(Minder, {
        createConnect: function(node) {
            var connection = new kity.Path();
            node._connection = connection;
            this._connectContainer.addShape(connection);
            this.updateConnect(node);
        },

        updateConnect: function(node) {
            var connection = node._connection;
            var parent = node.parent;
            if (!parent || !connection) return;
            
            connection.setVisible(true);

            var provider = node.getConnectProvider();

            var strokeColor = 'red',
                strokeWidth = 2;

            connection.stroke(strokeColor, strokeWidth);

            provider(node, parent, connection, strokeWidth, strokeColor);

        }
    });

    Module.register('Connect', {
        init: function() {
            this._connectContainer = new kity.Group().setId(utils.uuid('minder_connect_group'));
            // console.log(this.getRenderContainer())
            this.getRenderContainer().prependShape(this._connectContainer);
        },
        events: {
            'nodeattach': function(e) {
                this.createConnect(e.node);
            },
            'layoutfinish': function(e) {
                this.updateConnect(e.node);
            }
        }
    });

    exports.register = register;
});