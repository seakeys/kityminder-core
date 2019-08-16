/**
 * @fileOverview
 *
 * 状态切换控制
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

define(function(require, exports, module) {
    var kity = require('./kity');
    var Minder = require('./minder');

    kity.extendClass(Minder, {
        getStatus: function() {
            return this._status;
        }
    });

});