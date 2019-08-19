define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    // var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Module = require('../core/module');
    var Renderer = require('../core/render');

    var TextRenderer = kity.createClass('TextRenderer', {
        base: Renderer,

        create: function() {
            return new kity.Group().setId(utils.uuid('node_text'));
        },

        update: function(textGroup, node) {

            function getDataOrStyle(name) {
                return node.getData(name) || node.getStyle(name);
            }

            var nodeText = node.getText();
            var textArr = nodeText ? nodeText.split('\n') : [' '];

            var lineHeight = node.getStyle('line-height');

            var fontSize = getDataOrStyle('font-size');

            var height = (lineHeight * fontSize) * textArr.length - (lineHeight - 1) * fontSize;
            var yStart = -height / 2;




            var rBox = new kity.Box(),
                r = Math.round;

            var textLength = textArr.length;

            var textGroupLength = textGroup.getItems().length;

            var i, ci, textShape, text;

            var growth = textLength - textGroupLength;
            // console.log(textGroupLength)
            while (growth--) {
                textShape = new kity.Text().setAttr('text-rendering', 'inherit');
                textGroup.addItem(textShape);
            }

            for (i = 0, text, textShape; (text = textArr[i], textShape = textGroup.getItem(i)); i++) {
                textShape.setContent(text);
            }

            return function() {
                textGroup.eachItem(function(i, textShape) {
                    var y = yStart + i * fontSize * lineHeight;
                    textShape.setY(y);
                    var bbox = textShape.getBoundaryBox();
                    rBox = rBox.merge(new kity.Box(0, y, bbox.height && bbox.width || 1, fontSize));
                });
                // console.log(rBox)
                var nBox = new kity.Box(r(rBox.x), r(rBox.y), r(rBox.width), r(rBox.height));

                node._currentTextGroupBox = nBox;
                return nBox;
            };

        },
    });

    utils.extend(TextRenderer, {
        _styleHooks: [],

        registerStyleHook: function(fn) {
            TextRenderer._styleHooks.push(fn);
        }
    });

    kity.extendClass(MinderNode, {
        getTextGroup: function() {
            return this.getRenderer('TextRenderer').getRenderShape();
        }
    });

    Module.register('text', {
        'renderers': {
            center: TextRenderer
        }
    });

    module.exports = TextRenderer;
});
