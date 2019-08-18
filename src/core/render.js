define(function(require, exports, module) {

    var kity = require('./kity');
    var Minder = require('./minder');
    var MinderNode = require('./node');

    var Renderer = kity.createClass('Renderer', {
        constructor: function(node) {
            this.node = node;
        },
        shouldRender: function(node) {
            return true;
        },

        getRenderShape: function() {
            return this._renderShape || null;
        },

        setRenderShape: function(shape) {
            this._renderShape = shape;
        }
    });

    function createMinderExtension() {

        function createRendererForNode(node, registered) {
            var renderers = [];

            ['center', 'left', 'right', 'top', 'bottom', 'outline', 'outside'].forEach(function(section) {
                var before = 'before' + section;
                var after = 'after' + section;

                if (registered[before]) {
                    renderers = renderers.concat(registered[before]);
                }
                if (registered[section]) {
                    renderers = renderers.concat(registered[section]);
                }
                if (registered[after]) {
                    renderers = renderers.concat(registered[after]);
                }
            });

            node._renderers = renderers.map(function(Renderer) {
                return new Renderer(node);
            });
        }

        return {
            renderNodeBatch: function(nodes) {
                var rendererClasses = this._rendererClasses;
                var lastBoxes = [];
                var rendererCount = 0;
                var i, j, renderer, node;

                if (!nodes.length) return;

                for (j = 0; j < nodes.length; j++) {
                    node = nodes[j];
                    if (!node._renderers) {
                        createRendererForNode(node, rendererClasses);
                    }
                    node._contentBox = new kity.Box();
                    this.fire('beforerender', {
                        node: node
                    });
                }

                // 所有节点渲染器数量是一致的
                rendererCount = nodes[0]._renderers.length;

                for (i = 0; i < rendererCount; i++) {

                    // 获取延迟盒子数据
                    for (j = 0; j < nodes.length; j++) {
                        if (typeof(lastBoxes[j]) == 'function') {
                            lastBoxes[j] = lastBoxes[j]();
                        }
                        if (!(lastBoxes[j] instanceof kity.Box)) {
                            lastBoxes[j] = new kity.Box(lastBoxes[j]);
                        }
                    }

                    for (j = 0; j < nodes.length; j++) {
                        node = nodes[j];
                        renderer = node._renderers[i];

                        // 合并盒子
                        if (lastBoxes[j]) {
                            node._contentBox = node._contentBox.merge(lastBoxes[j]);
                            renderer.contentBox = lastBoxes[j];
                        }

                        // 判断当前上下文是否应该渲染
                        if (renderer.shouldRender(node)) {

                            // 应该渲染，但是渲染图形没创建过，需要创建
                            if (!renderer.getRenderShape()) {
                                renderer.setRenderShape(renderer.create(node));
                                if (renderer.bringToBack) {
                                    node.getRenderContainer().prependShape(renderer.getRenderShape());
                                } else {
                                    node.getRenderContainer().appendShape(renderer.getRenderShape());
                                }
                            }

                            // 强制让渲染图形显示
                            renderer.getRenderShape().setVisible(true);

                            // 更新渲染图形
                            lastBoxes[j] = renderer.update(renderer.getRenderShape(), node, node._contentBox);
                        }

                        // 如果不应该渲染，但是渲染图形创建过了，需要隐藏起来
                        else if (renderer.getRenderShape()) {
                            renderer.getRenderShape().setVisible(false);
                            lastBoxes[j] = null;
                        }
                    }
                }
            }
        };
    }

    kity.extendClass(Minder, createMinderExtension());

    kity.extendClass(MinderNode, {
        renderTree: function() {
            if (!this.attached) return;
            var list = [];
            this.traverse(function(node) {
                list.push(node);
            });
            this.getMinder().renderNodeBatch(list);
            return this;
        },
        getContentBox: function() {
            return this.parent && this.parent.isCollapsed() ? new kity.Box() : (this._contentBox || new kity.Box());
        }
    });

    module.exports = Renderer;
});