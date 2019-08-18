define(function(require, exports, module) {
    var kity = require('../core/kity');
    var Layout = require('../core/layout');

    ['left', 'right', 'top', 'bottom'].forEach(registerLayoutForDirection);

    function registerLayoutForDirection(name) {

        var axis = (name == 'left' || name == 'right') ? 'x' : 'y';
        var dir = (name == 'left' || name == 'top') ? -1 : 1;

        var oppsite = {
            'left': 'right',
            'right': 'left',
            'top': 'bottom',
            'bottom': 'top',
            'x': 'y',
            'y': 'x'
        };

        Layout.register(name, kity.createClass({

            base: Layout,

            doLayout: function(parent, children) {

                var pbox = parent.getContentBox();

                if (axis == 'x') {
                    parent.setVertexOut(new kity.Point(pbox[name], pbox.cy));
                    parent.setLayoutVectorOut(new kity.Vector(dir, 0));
                } else {
                    parent.setVertexOut(new kity.Point(pbox.cx, pbox[name]));
                    parent.setLayoutVectorOut(new kity.Vector(0, dir));
                }

                if (!children.length) {
                    return false;
                }

                children.forEach(function(child) {
                    var cbox = child.getContentBox();
                    child.setLayoutTransform(new kity.Matrix());

                    if (axis == 'x') {
                        child.setVertexIn(new kity.Point(cbox[oppsite[name]], cbox.cy));
                        child.setLayoutVectorIn(new kity.Vector(dir, 0));
                    } else {
                        child.setVertexIn(new kity.Point(cbox.cx, cbox[oppsite[name]]));
                        child.setLayoutVectorIn(new kity.Vector(0, dir));
                    }
                });

                this.align(children, oppsite[name]); //对齐指定的节点
                this.stack(children, oppsite[axis]);
 
                var bbox = this.getBranchBox(children); //获取给点的节点所占的布局区域
                var xAdjust = 0, yAdjust = 0;

                if (axis == 'x') {
                    xAdjust = pbox[name];
                    xAdjust += dir * parent.getStyle('margin-' + name);
                    xAdjust += dir * children[0].getStyle('margin-' + oppsite[name]);

                    yAdjust = pbox.bottom;
                    yAdjust -= pbox.height / 2;
                    yAdjust -= bbox.height / 2;
                    yAdjust -= bbox.y;
                } else {
                    xAdjust = pbox.right;
                    xAdjust -= pbox.width / 2;
                    xAdjust -= bbox.width / 2;
                    xAdjust -= bbox.x;

                    yAdjust = pbox[name];
                    yAdjust += dir * parent.getStyle('margin-' + name);
                    yAdjust += dir * children[0].getStyle('margin-' + oppsite[name]);
                }

                this.move(children, xAdjust, yAdjust);
            }
        }));
    }
});