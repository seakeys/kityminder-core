define(function(require, exports, module) {
    var kity = require('./kity');
    var utils = require('./utils');
    var Minder = require('./minder');

    /* 已注册的模块 */
    var _modules = {};

    exports.register = function(name, module) {
        _modules[name] = module;
    };

    /* 模块初始化 */
    Minder.registerInitHook(function() {
        this._initModules();
    });

    // 模块声明周期维护
    kity.extendClass(Minder, {
        _initModules: function() {
            var modulesPool = _modules;
            var modulesToLoad = this._options.modules || utils.keys(modulesPool);

            this._query = {};
            this._modules = {};
            this._rendererClasses = {};

            var i, name, type, module, moduleDeals,
                 dealEvents, dealRenderers;

            var me = this;
            for (i = 0; i < modulesToLoad.length; i++) {
                name = modulesToLoad[i];
                // 执行模块初始化，抛出后续处理对象

                if (typeof(modulesPool[name]) == 'function') {
                    moduleDeals = modulesPool[name].call(me);
                } else {
                    moduleDeals = modulesPool[name];
                }
                this._modules[name] = moduleDeals;

                if (moduleDeals.init) {
                    moduleDeals.init.call(me, this._options);
                }
              
                // 绑定事件
                dealEvents = moduleDeals.events;
                if (dealEvents) {
                    for (type in dealEvents) {
                        me.on(type, dealEvents[type]);
                    }
                }

                // 渲染器
                dealRenderers = moduleDeals.renderers;
                // console.log(dealRenderers)
                if (dealRenderers) {

                    for (type in dealRenderers) {
                        this._rendererClasses[type] = this._rendererClasses[type] || [];

                        if (utils.isArray(dealRenderers[type])) {
                            this._rendererClasses[type] = this._rendererClasses[type].concat(dealRenderers[type]);
                        } else {
                            this._rendererClasses[type].push(dealRenderers[type]);
                        }
                    }
                }
            }
        }
    });
});