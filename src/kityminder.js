/**
 * @fileOverview
 *
 * 默认导出（全部模块）
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */


define(function(require, exports, module) {
    var kityminder = {};

    // 核心导出，大写的部分导出类，小写的部分简单 require 一下
    // 这里顺序是有讲究的，调整前先弄清楚依赖关系。
    require('./core/utils');
    kityminder.Minder = require('./core/minder');
    kityminder.Command = require('./core/command');
    kityminder.Node = require('./core/node');
    require('./core/option');
    kityminder.Event = require('./core/event');
    kityminder.data = require('./core/data');
    require('./core/compatibility');
    require('./core/status');
    require('./core/paper');
    kityminder.Module = require('./core/module');
    kityminder.Render = require('./core/render');
    kityminder.Connect = require('./core/connect');
    kityminder.Layout = require('./core/layout');
    kityminder.Theme = require('./core/theme');
    kityminder.Template = require('./core/template');
    kityminder.Promise = require('./core/promise');

    // 模块依赖
    require('./module/expand');
    require('./module/text');
    require('./module/view'); // 管理根元素定位

    require('./protocol/json');

    require('./layout/mind');
    require('./layout/btree');

    require('./theme/fresh');

    require('./connect/arc');

    require('./template/default');
    require('./template/right');

    module.exports = kityminder;
});