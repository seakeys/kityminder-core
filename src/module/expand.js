define(function(require, exports, module) {
    var kity = require('../core/kity');
    // var utils = require('../core/utils');
    var MinderNode = require('../core/node');
    var Module = require('../core/module');
    var Renderer = require('../core/render');

    Module.register('Expand', function() {
        var minder = this;
        var EXPAND_STATE_DATA = 'expandState',
            STATE_EXPAND = 'expand',
            STATE_COLLAPSE = 'collapse';

        // 将展开的操作和状态读取接口拓展到 MinderNode 上
        kity.extendClass(MinderNode, {
            
            /**
             * 判断节点当前的状态是否为展开
             */
            isExpanded: function() {
                var expanded = this.getData(EXPAND_STATE_DATA) !== STATE_COLLAPSE;
                return expanded && (this.isRoot() || this.parent.isExpanded());
            },

            /**
             * 判断节点当前的状态是否为收起
             */
            isCollapsed: function() {
                return !this.isExpanded();
            }
        });


        var ExpanderRenderer = kity.createClass('ExpanderRenderer', {
            base: Renderer,

            create: function(node) {
  
            },

            shouldRender: function(node) {
               
            },

            update: function(expander, node, box) {
              
            }
        });

        return {
            renderers: {
                outside: ExpanderRenderer
            }
        };
    });
});
