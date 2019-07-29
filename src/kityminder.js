/**
 * @fileOverview
 *
 * 默认导出（全部模块）
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */


define(function(require, exports, module) {
    var kityminder = {
        version: require('./core/minder').version
    };

    // 核心导出，大写的部分导出类，小写的部分简单 require 一下
    // 这里顺序是有讲究的，调整前先弄清楚依赖关系。

    require('./core/utils');
    kityminder.Minder = require('./core/minder'); // KityMinder 类，暴露在 window 上的唯一变量
    kityminder.Command = require('./core/command'); // 表示一个命令，包含命令的查询及执行
    kityminder.Node = require('./core/node'); // 表示一个脑图节点
    require('./core/option'); // 提供脑图选项支持
    kityminder.Event = require('./core/event'); // 表示一个脑图中发生的事件
    kityminder.data = require('./core/data'); //自动导入
    require('./core/compatibility'); //兼容性
    require('./core/status'); // 状态切换控制
    require('./core/paper'); // 初始化渲染容器 
 
    kityminder.Module = require('./core/module');
    kityminder.Render = require('./core/render'); // 渲染
    kityminder.Connect = require('./core/connect'); // 连接
    kityminder.Layout = require('./core/layout'); // 布局
    kityminder.Theme = require('./core/theme'); // 主题
    kityminder.Template = require('./core/template'); // 模板
    kityminder.Promise = require('./core/promise');


    // 模块依赖
    require('./module/text'); // 文本
    require('./module/view'); // 视图
    require('./module/basestyle'); // 基础样式
    require('./module/expand'); // 扩展
  

    require('./protocol/json'); // json

    require('./layout/mind'); // 注意
    require('./layout/btree'); // 二叉树

    require('./theme/fresh');

    require('./connect/arc'); // 圆弧

    require('./template/default'); // 默认模板 - 脑图模板

    module.exports = kityminder;
});