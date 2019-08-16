define(function(require, exports, module) {
    var kity = require('../core/kity');
    var Command = require('../core/command');
    var Module = require('../core/module');

    var ViewDragger = kity.createClass('ViewDragger', {
        constructor: function(minder) {
            this._minder = minder;
        },
        move: function(offset, duration) {
            var minder = this._minder;

            var targetPosition = this.getMovement().offset(offset);

            this.moveTo(targetPosition, duration);
        },

        moveTo: function(position, duration) {

            if (duration) {
                var dragger = this;

                if (this._moveTimeline) this._moveTimeline.stop();

                this._moveTimeline = this._minder.getRenderContainer().animate(new kity.Animator(
                    this.getMovement(),
                    position,
                    function(target, value) {
                        dragger.moveTo(value);
                    }
                ), duration, 'easeOutCubic').timeline();

                this._moveTimeline.on('finish', function() {
                    dragger._moveTimeline = null;
                });

                return this;
            }

            this._minder.getRenderContainer().setTranslate(position.round());
            this._minder.fire('viewchange');
        },
        getMovement: function() {
            var translate = this._minder.getRenderContainer().transform.translate;
            return translate ? translate[0] : new kity.Point();
        }
    });

    Module.register('View', function() {
        /**
         * @command Camera
         * @description 设置当前视野的中心位置到某个节点上
         * @param {kityminder.MinderNode} focusNode 要定位的节点
         * @param {number} duration 设置视野移动的动画时长（单位 ms），设置为 0 不使用动画
         * @state
         *   0: 始终可用
         */
        var CameraCommand = kity.createClass('CameraCommand', {
            base: Command,
            execute: function(km, focusNode) {

                focusNode = focusNode || km.getRoot();
                var viewport = km.getPaper().getViewPort();
                var offset = focusNode.getRenderContainer().getRenderBox('view');
                var dx = viewport.center.x - offset.x - offset.width / 2,
                    dy = viewport.center.y - offset.y;
                var dragger = km._viewDragger;

                var duration = km.getOption('viewAnimationDuration');
                dragger.move(new kity.Point(dx, dy), duration);
                this.setContentChanged(false);
            },
            enableReadOnly: true
        });
        return {
            init: function() {
                this._viewDragger = new ViewDragger(this);
            },
            commands: {
                'camera': CameraCommand
            },
            events: {
                'paperrender finishInitHook': function() {
                    if (!this.getRenderTarget()) {
                        return;
                    }
                    this.execCommand('camera', null, 0);
                }
            }
        };
    });
});