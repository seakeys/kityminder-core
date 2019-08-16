define(function(require, exports, module) {
    var kity = require('./kity');
    var utils = require('./utils');
    var Minder = require('./minder');

    /**
     * @class MinderNode
     *
     * 表示一个脑图节点
     */
    var MinderNode = kity.createClass('MinderNode', {

        /**
         * 创建一个游离的脑图节点
         *
         * @param {String|Object} textOrData
         *     节点的初始数据或文本
         */
        constructor: function(textOrData) {

            // 指针
            this.parent = null;
            this.root = this;
            this.children = [];

            // 数据
            this.data = {
                id: utils.guid(),
                created: +new Date()
            };

            // 绘图容器
            this.initContainers();

            if (utils.isString(textOrData)) {
                this.setText(textOrData);
            } else if (utils.isObject(textOrData)) {
                utils.extend(this.data, textOrData);
            }
        },

        initContainers: function() {
            this.rc = new kity.Group().setId(utils.uuid('minder_node'));
            this.rc.minderNode = this;
        },

        /**
         * 判断节点是否根节点
         */
        isRoot: function() {
            return this.root === this;
        },

       
        /**
         * 获取节点的根节点
         */
        getRoot: function() {
            return this.root || this;
        },

    

        getSiblings: function() {
            var children = this.parent.children;
            var siblings = [];
            var self = this;
            children.forEach(function(child) {
                if (child != self) siblings.push(child);
            });
            return siblings;
        },

        /**
         * 获得节点的深度
         */
        getLevel: function() {
            var level = 0,
                ancestor = this.parent;
            while (ancestor) {
                level++;
                ancestor = ancestor.parent;
            }
            return level;
        },

        /**
         * 获得节点的复杂度（即子树中节点的数量）
         */
        getComplex: function() {
            var complex = 0;
            this.traverse(function() {
                complex++;
            });
            return complex;
        },

        /**
         * 获得节点的类型（root|main|sub）
         */
        getType: function(type) {
            this.type = ['root', 'main', 'sub'][Math.min(this.getLevel(), 2)];
            return this.type;
        },

        getData: function(key) {
            return key ? this.data[key] : this.data;
        },

        setData: function(key, value) {
            if (typeof key == 'object') {
                var data = key;
                for (key in data) if (data.hasOwnProperty(key)) {
                    this.data[key] = data[key];
                }
            }
            else {
                this.data[key] = value;
            }
            return this;
        },

        /**
         * 设置节点的文本数据
         * @param {String} text 文本数据
         */
        setText: function(text) {
            return this.data.text = text;
        },

        /**
         * 获取节点的文本数据
         * @return {String}
         */
        getText: function() {
            return this.data.text || null;
        },

    
        /**
         * 后序遍历当前节点树
         * @param  {Function} fn 遍历函数
         */
        postTraverse: function(fn, excludeThis) {
            var children = this.getChildren();
            for (var i = 0; i < children.length; i++) {
                children[i].postTraverse(fn);
            }
            if (!excludeThis) fn(this);
        },

        traverse: function(fn, excludeThis) {
            return this.postTraverse(fn, excludeThis);
        },

        getChildren: function() {
            return this.children;
        },

        getIndex: function() {
            return this.parent ? this.parent.children.indexOf(this) : -1;
        },

        insertChild: function(node, index) {
            if (index === undefined) {
                index = this.children.length;
            }
            if (node.parent) {
                node.parent.removeChild(node);
            }
            node.parent = this;
            node.root = this.root;

            this.children.splice(index, 0, node);
        },

        appendChild: function(node) {
            return this.insertChild(node);
        },

        getRenderContainer: function() {
            return this.rc;
        },
        getMinder: function() {
            return this.getRoot().minder;
        }
    });

 

    kity.extendClass(Minder, {

        getRoot: function() {
            return this._root;
        },

        setRoot: function(root) {
            this._root = root;
            root.minder = this;
        },
        createNode: function(textOrData, parent, index) {
            var node = new MinderNode(textOrData);
            this.fire('nodecreate', {
                node: node,
                parent: parent,
                index: index
            });
            this.appendNode(node, parent, index);
            return node;
        },

        appendNode: function(node, parent, index) {
            if (parent) parent.insertChild(node, index);
            this.attachNode(node);
            return this;
        },

        attachNode: function(node) {
            var rc = this.getRenderContainer();
            node.traverse(function(current) {
                current.attached = true;
                rc.addShape(current.getRenderContainer());
            });
            rc.addShape(node.getRenderContainer());
            this.fire('nodeattach', {
                node: node
            });
        },
    });

    module.exports = MinderNode;
});