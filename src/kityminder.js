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
    require('./core/animate'); // 动画控制
    kityminder.Event = require('./core/event'); // 表示一个脑图中发生的事件
    kityminder.data = require('./core/data');
    require('./core/compatibility'); //兼容性
    kityminder.KeyMap = require('./core/keymap'); //快捷键
    require('./core/shortcut'); //快捷方式
    require('./core/status'); // 状态切换控制
    require('./core/paper'); // 初始化渲染容器
    require('./core/select'); // 选区管理
    require('./core/focus');
    require('./core/keyreceiver'); // 接收器
    kityminder.Module = require('./core/module');
    require('./core/readonly'); // 只读的
    kityminder.Render = require('./core/render'); // 渲染
    kityminder.Connect = require('./core/connect'); // 连接
    kityminder.Layout = require('./core/layout'); // 布局
    kityminder.Theme = require('./core/theme'); // 主题
    kityminder.Template = require('./core/template'); // 模板
    kityminder.Promise = require('./core/promise');
    require('./core/_boxv'); // 调试工具：为 kity.Box 提供一个可视化的渲染
    require('./core/patch'); // 打补丁

    // 模块依赖
    require('./module/arrange'); // 排列
    require('./module/basestyle'); // 基础样式
    require('./module/clipboard'); // 剪贴板
    require('./module/dragtree'); // 拖曳树
    require('./module/expand'); // 扩展
    require('./module/font'); // 字体
    require('./module/hyperlink'); // 超链接
    require('./module/image'); // 图片
    require('./module/image-viewer'); // 图片查看器
    require('./module/keynav'); // 键盘
    require('./module/layout'); // 布局
    require('./module/node'); // 节点
    require('./module/note'); // 笔记
    require('./module/outline'); // 轮廓
    require('./module/priority'); // 优先权
    require('./module/progress'); // 进步
    require('./module/resource'); // 资源
    require('./module/select'); // 选择
    require('./module/style'); // 样式
    require('./module/text'); // 文本
    require('./module/view'); // 视图
    require('./module/zoom'); // 缩放

    require('./protocol/json'); // json
    require('./protocol/text'); // text
    require('./protocol/markdown'); // markdown
    require('./protocol/svg'); // svg
    require('./protocol/png'); // png

    require('./layout/mind'); // 注意
    require('./layout/btree'); // 二叉树
    require('./layout/filetree'); // 文件树
    require('./layout/fish-bone-master'); // 鱼骨架
    require('./layout/fish-bone-slave'); // 鱼骨头
    require('./layout/tianpan'); // 天盘

    require('./theme/default');
    require('./theme/snow');
    require('./theme/fresh');
    require('./theme/fish');
    require('./theme/snow');
    require('./theme/wire');
    require('./theme/tianpan');

    require('./connect/arc'); // 圆弧
    require('./connect/arc_tp'); // 圆弧连线
    require('./connect/bezier'); // 贝塞尔曲线
    require('./connect/fish-bone-master'); // 鱼骨头主干连线
    require('./connect/l'); // "L" 连线
    require('./connect/poly'); // 折线相连的方法
    require('./connect/under'); // 下划线连线

    require('./template/default'); // 默认模板 - 脑图模板
    require('./template/structure'); // 组织结构图模板
    require('./template/filetree'); // 文件夹模板
    require('./template/right'); // 往右布局结构模板
    require('./template/fish-bone'); // 默认模板 - 鱼骨头模板
    require('./template/tianpan');  // 天盘模板

    module.exports = kityminder;
});