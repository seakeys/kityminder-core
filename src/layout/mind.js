define(function(require, exports, module) {
    var kity = require('../core/kity');
    var Layout = require('../core/layout');
    var Minder = require('../core/minder');

    Layout.register('mind', kity.createClass({
        base: Layout,

        doLayout: function(node, children) {
            var layout = this;
            var half = Math.ceil(node.children.length / 2);
            var right = [];
            var left = [];

            children.forEach(function(child) {
                if (child.getIndex() < half) right.push(child);
                else left.push(child);
            });

            var leftLayout = Minder.getLayoutInstance('left');
            var rightLayout = Minder.getLayoutInstance('right');

            leftLayout.doLayout(node, left);
            rightLayout.doLayout(node, right);

            var box = node.getContentBox();
            node.setVertexOut(new kity.Point(box.cx, box.cy));
            node.setLayoutVectorOut(new kity.Vector(0, 0));
        }
    }));
});