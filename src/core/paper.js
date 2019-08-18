/**
 * @fileOverview
 *
 * 初始化渲染容器
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {
    var kity = require('./kity');
    var utils = require('./utils');
    var Minder = require('./minder');

    Minder.registerInitHook(function() {
        this._initPaper();
    });

    kity.extendClass(Minder, {

        _initPaper: function() {
            // debugger
            this._paper = new kity.Paper();
            this._rc = new kity.Group().setId(utils.uuid('minder'))
            this._paper.addShape(this._rc);
            this.setRoot(this.createNode());
        },

        importNode: function(node, json) {
            var data = json.data; // 数据层
            node.data = {}; // 节点层

            for (var field in data) {
                node.setData(field, data[field]);
            }
            // debugger
            var childrenTreeData = json.children || [];
            for (var i = 0; i < childrenTreeData.length; i++) {
                var childNode = this.createNode(null, node);
                this.importNode(childNode, childrenTreeData[i]);
            }
            return node;
        },
        importJson: function(json) {
            this.importNode(this._root, json.root); // this._root就是一个MinderNode节点
            this.refresh();
        },
        
        renderTo: function(target) {
            target = document.querySelector(target);
            this._paper.renderTo(this._renderTarget = target);
            // 定位开始位置
            var dragger = km._viewDragger;
            dragger.move(new kity.Point(200, 300))
            return this;
        },
        getPaper: function() {
            return this._paper;
        },

        getRenderTarget: function() {
            return this._renderTarget;
        },
        // createMinder: function () {
           
        // },
        getRenderContainer: function() {
            console.log(this._rc)
            return this._rc;
        }
    });
});