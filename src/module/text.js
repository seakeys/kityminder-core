define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');
    /**
     * 针对不同系统、不同浏览器、不同字体做居中兼容性处理
     * 暂时未增加Linux的处理
     */
    var FONT_ADJUST = {
        'safari': {
            '微软雅黑,Microsoft YaHei': -0.17,
            '楷体,楷体_GB2312,SimKai': -0.1,
            '隶书, SimLi': -0.1,
            'comic sans ms': -0.23,
            'impact,chicago': -0.15,
            'times new roman': -0.1,
            'arial black,avant garde': -0.17,
            'default': 0
        },
        'ie': {
            10: {
                '微软雅黑,Microsoft YaHei': -0.17,
                'comic sans ms': -0.17,
                'impact,chicago': -0.08,
                'times new roman': 0.04,
                'arial black,avant garde': -0.17,
                'default': -0.15
            },
            11: {
                '微软雅黑,Microsoft YaHei': -0.17,
                'arial,helvetica,sans-serif': -0.17,
                'comic sans ms': -0.17,
                'impact,chicago': -0.08,
                'times new roman': 0.04,
                'sans-serif': -0.16,
                'arial black,avant garde': -0.17,
                'default': -0.15
            }
        },
        'edge': {
            '微软雅黑,Microsoft YaHei': -0.15,
            'arial,helvetica,sans-serif': -0.17,
            'comic sans ms': -0.17,
            'impact,chicago': -0.08,
            'sans-serif': -0.16,
            'arial black,avant garde': -0.17,
            'default': -0.15
        },
        'sg': {
            '微软雅黑,Microsoft YaHei': -0.15,
            'arial,helvetica,sans-serif': -0.05,
            'comic sans ms': -0.22,
            'impact,chicago': -0.16,
            'times new roman': -0.03,
            'arial black,avant garde': -0.22,
            'default': -0.15
        },
        'chrome': {
            'Mac': {
                'andale mono': -0.05,
                'comic sans ms': -0.3,
                'impact,chicago': -0.13,
                'times new roman': -0.1,
                'arial black,avant garde': -0.17,
                'default': 0
            },
            'Win': {
                '微软雅黑,Microsoft YaHei': -0.15,
                'arial,helvetica,sans-serif': -0.02,
                'arial black,avant garde': -0.2,
                'comic sans ms': -0.2,
                'impact,chicago': -0.12,
                'times new roman': -0.02,
                'default': -0.15
            },
            'Lux': {
                'andale mono': -0.05,
                'comic sans ms': -0.3,
                'impact,chicago': -0.13,
                'times new roman': -0.1,
                'arial black,avant garde': -0.17,
                'default': 0
            }
        },
        'firefox': {
            'Mac': {
                '微软雅黑,Microsoft YaHei': -0.2,
                '宋体,SimSun': 0.05,
                'comic sans ms': -0.2,
                'impact,chicago': -0.15,
                'arial black,avant garde': -0.17,
                'times new roman': -0.1,
                'default': 0.05
            },
            'Win': {
                '微软雅黑,Microsoft YaHei': -0.16,
                'andale mono': -0.17,
                'arial,helvetica,sans-serif': -0.17,
                'comic sans ms': -0.22,
                'impact,chicago': -0.23,
                'times new roman': -0.22,
                'sans-serif': -0.22,
                'arial black,avant garde': -0.17,
                'default': -0.16
            },
            'Lux': {
                "宋体,SimSun": -0.2,
                "微软雅黑,Microsoft YaHei": -0.2,
                "黑体, SimHei": -0.2,
                "隶书, SimLi": -0.2,
                "楷体,楷体_GB2312,SimKai": -0.2,
                "andale mono": -0.2,
                "arial,helvetica,sans-serif": -0.2,
                "comic sans ms": -0.2,
                "impact,chicago": -0.2,
                "times new roman": -0.2,
                "sans-serif": -0.2,
                "arial black,avant garde": -0.2,
                "default": -0.16
            }
        },
    };

    var TextRenderer = kity.createClass('TextRenderer', {
        base: Renderer,

        create: function() {
            return new kity.Group().setId(utils.uuid('node_text'));
        },

        update: function(textGroup, node) {
            function getDataOrStyle(name) {
                return node.getData(name) || node.getStyle(name);
            }

            var nodeText = node.getText();
            var textArr = nodeText ? nodeText.split('\n') : [' '];


            var lineHeight = node.getStyle('line-height');

            var fontSize = getDataOrStyle('font-size');
            var fontFamily = getDataOrStyle('font-family') || 'default';

            var height = (lineHeight * fontSize) * textArr.length - (lineHeight - 1) * fontSize;
            var yStart = -height / 2;
            var Browser = kity.Browser;
            var adjust;

            if (Browser.chrome || Browser.opera || Browser.bd ||Browser.lb === "chrome") {
                adjust = FONT_ADJUST['chrome'][Browser.platform][fontFamily];
            } else if (Browser.gecko) {
                adjust = FONT_ADJUST['firefox'][Browser.platform][fontFamily];
            } else if (Browser.sg) {
                adjust = FONT_ADJUST['sg'][fontFamily];
            } else if (Browser.safari) {
                adjust = FONT_ADJUST['safari'][fontFamily];
            } else if (Browser.ie) {
                adjust = FONT_ADJUST['ie'][Browser.version][fontFamily];
            } else if (Browser.edge) {
                adjust = FONT_ADJUST['edge'][fontFamily];
            } else if (Browser.lb) {
                // 猎豹浏览器的ie内核兼容性模式下
                adjust = 0.9;
            }

            textGroup.setTranslate(0, (adjust || 0) * fontSize);

            var rBox = new kity.Box(),
                r = Math.round;

            this.setTextStyle(node, textGroup);

            var textLength = textArr.length;

            var textGroupLength = textGroup.getItems().length;

            var i, ci, textShape, text;

            if (textLength < textGroupLength) {
                for (i = textLength, ci; ci = textGroup.getItem(i);) {
                    textGroup.removeItem(i);
                }
            } else if (textLength > textGroupLength) {
                var growth = textLength - textGroupLength;
                while (growth--) {
                    textShape = new kity.Text().setAttr('text-rendering', 'inherit');
                    if (kity.Browser.ie || kity.Browser.edge) {
                        textShape.setVerticalAlign('top');
                    } else {
                        textShape.setAttr('dominant-baseline', 'text-before-edge');
                    }
                    textGroup.addItem(textShape);
                }
            }

            for (i = 0, text, textShape; (text = textArr[i], textShape = textGroup.getItem(i)); i++) {
                this._removeTextSpan(textShape)
                this._renderText(text, textShape)
                if (kity.Browser.ie || kity.Browser.edge) textShape.fixPosition();
            }

            this.setTextStyle(node, textGroup);

            var textHash = node.getText() +
                ['font-size', 'font-name', 'font-weight', 'font-style'].map(getDataOrStyle).join('/');

            if (node._currentTextHash == textHash && node._currentTextGroupBox) return node._currentTextGroupBox;

            node._currentTextHash = textHash;

            return function() {
                textGroup.eachItem(function(i, textShape) {
                    var y = yStart + i * fontSize * lineHeight;

                    textShape.setY(y);
                    var bbox = textShape.getBoundaryBox();
                    rBox = rBox.merge(new kity.Box(0, y, bbox.height && bbox.width || 1, fontSize));
                });

                var nBox = new kity.Box(r(rBox.x), r(rBox.y), r(rBox.width), r(rBox.height));

                node._currentTextGroupBox = nBox;
                return nBox;
            };

        },

        _removeTextSpan: function(textShape) {
            for(var i = 0; i < textShape.items.length; i++) {
                textShape.items[i].remove()
                textShape.items.length && this._removeTextSpan(textShape)
            }
        },

        setTextStyle: function(node, text) {
            var hooks = TextRenderer._styleHooks;
            hooks.forEach(function(hook) {
                hook(node, text);
            });
        },
        _boundary: function(i, len, md_flags, render_flags) {
            if (i >= len && md_flags.length) {
                var item = md_flags.slice(-1)[0]
                item.end_pos = len
                item.exit_flag = item.type.includes('text')
                if (!item.type.includes('text')) item.type = item.type + '_start'
                render_flags.push(item)
            }
        },
        _markdown: function(text) {
            var len = text.length
            var i = 0
            var md_flags = []
            var render_flags = []
            var flag = { exit_flag: false }
            while (i < len) {
                var ch = text.slice(i, i + 1)
                var ch2 = text.slice(i, i + 2)
                
            
                if (['text', undefined].includes(flag.type) && ch === '\\') {
                    if (flag.type === 'text') {
                        flag.end_pos = i
                        render_flags.push(flag)
                        if (md_flags.length) md_flags.pop() // 出栈
                        flag = { exit_flag: false }
                    }
                    render_flags.push({
                        type: 'escape',
                        exit_flag: true,
                        current: '\\',
                        start_pos: i,
                        end_pos: i + 1
                    })
                    i += 2
                
                    this._boundary(i, len, md_flags, render_flags)
                    continue
                }
            
                if (flag.exit_flag) {
                    if (ch === '\\') {
                        i += 2
                        continue
                    }

                    if (ch2 === flag.current) {
                        flag.end_pos = i
                        if (flag.type.includes('start')) {
                            flag.type = 'bold_end'
                            var start_idx = render_flags.findIndex(function(v) { return !v.exit_flag && v.type === 'bold_start' && v.current === ch2 })
                            var findItem = render_flags[start_idx]
                            findItem.exit_flag = true
                            render_flags.splice(start_idx, 1, findItem)
                        }
                        render_flags.push({ 
                            current: flag.current,
                            end_pos: flag.end_pos,
                            exit_flag: flag.exit_flag,
                            start_pos: flag.start_pos,
                            type: flag.type
                         })
                        if (md_flags.length) md_flags.pop() // 出栈
                        i += 2
                        flag = { exit_flag: false }
                        if (md_flags.length) {
                            flag = md_flags[0]
                            flag.exit_flag = true
                            flag.start_pos = i
                        }
                
                        // 处理以当前标识结尾的情况
                        this._boundary(i, len, md_flags, render_flags)
                        continue
                    }
            
                    if (ch === flag.current) {
                    flag.end_pos = i
                    if (flag.type.includes('start')) {
                        flag.type = 'italic_end'
                        var italic_flag_idx = render_flags.findIndex(function(v) { return !v.exit_flag && v.type === 'italic_start' && v.current === ch })
                        var findItem = render_flags[italic_flag_idx]
                        findItem.exit_flag = true
                        render_flags.splice(italic_flag_idx, 1, findItem)
                    }
                    render_flags.push({ 
                        current: flag.current,
                        end_pos: flag.end_pos,
                        exit_flag: flag.exit_flag,
                        start_pos: flag.start_pos,
                        type: flag.type
                     })
                    if (md_flags.length) md_flags.pop() // 出栈
                    i++
                    flag = { exit_flag: false }
                    if (md_flags.length) {
                        flag = md_flags[0]
                        flag.exit_flag = true
                        flag.start_pos = i
                    }
                    continue
                    }
            
                    if (ch2 === '__' || ch2 === '**') {
                    // 结束上一个栈
                    flag.end_pos = i
                    flag.exit_flag = flag.type.includes('text')
                    flag.type = ['bold', 'italic'].includes(flag.type)
                        ? flag.type + '_start'
                        : flag.type
                    if (flag.start_pos !== flag.end_pos) render_flags.push({ 
                        current: flag.current,
                        end_pos: flag.end_pos,
                        exit_flag: flag.exit_flag,
                        start_pos: flag.start_pos,
                        type: flag.type
                     })
                    if (flag.type.includes('text')) md_flags.pop()
            
                    // 处理前面没结束掉的粗斜体
                    var start_idx = render_flags.findIndex(function(v) {return !v.exit_flag && v.current === ch2 })
                    if (start_idx > -1) {
                        var findItem = render_flags[start_idx]
                        findItem.exit_flag = true
                        render_flags.splice(start_idx, 1, findItem)
                        render_flags.push({
                        exit_flag: true,
                        current: ch2,
                        start_pos: i,
                        end_pos: i + 2,
                        type: 'bold_end'
                        })
                        render_flags = render_flags.map(function(v, idx) {
                            if (idx > start_idx && !v.exit_flag) v.exit_flag = true
                            return v
                        })
                        flag = { exit_flag: false }
                        if (md_flags.length) md_flags.pop()
            
                    } else {
                        flag = {
                        exit_flag: true,
                        current: ch2,
                        start_pos: i,
                        type: 'bold'
                        }
                        md_flags.push(flag)
                    }
            
                    i += 2
                    this._boundary(i, len, md_flags, render_flags)
                    continue
                    }
            
                    if (ch === '_' || ch === '*') {
                    // // 结束上一个栈
                    flag.end_pos = i
                    flag.exit_flag = flag.type.includes('text')
                    flag.type = ['bold', 'italic'].includes(flag.type)
                        ? flag.type + '_start'
                        : flag.type
                    if (flag.start_pos !== flag.end_pos) render_flags.push({ 
                        current: flag.current,
                        end_pos: flag.end_pos,
                        exit_flag: flag.exit_flag,
                        start_pos: flag.start_pos,
                        type: flag.type
                     })
                    if (flag.type.includes('text')) md_flags.pop()
            
                    // 处理前面没结束掉的粗斜体
                    var start_idx = render_flags.findIndex(function(v) { return !v.exit_flag && v.current === ch })
                    if (start_idx > -1) {
                        var findItem = render_flags[start_idx]
                        findItem.exit_flag = true
                        render_flags.splice(start_idx, 1, findItem)
                        render_flags.push({
                        exit_flag: true,
                        current: ch,
                        start_pos: i,
                        end_pos: i + 1,
                        type: 'italic_end'
                        })
                        render_flags = render_flags.map(function(v, idx) {
                            if (idx > start_idx && !v.exit_flag) v.exit_flag = true
                            return v
                        })
                        flag = { exit_flag: false }
                        if (md_flags.length) md_flags.pop()
            
                    } else {
                        flag = {
                        exit_flag: true,
                        current: ch,
                        start_pos: i,
                        type: 'italic'
                        }
                        md_flags.push(flag)
                    }
            
                    i++
                    this._boundary(i, len, md_flags, render_flags)
                    continue
                    }
            
                    var no_exit_arr = render_flags.filter(function(v) {return !v.exit_flag } )
                    if (no_exit_arr.length && flag.type.includes('start')) {
                    flag = {
                        exit_flag: true,
                        current: '',
                        start_pos: i,
                        type: no_exit_arr.slice(-1)[0].type.includes('bold')
                        ? 'bold_text'
                        : 'italic_text'
                    }
                    md_flags.push(flag)
                    }
                }

                if (!flag.exit_flag) {
                    if (ch2 === '__' || ch2 === '**') {
                        flag = {
                            exit_flag: true,
                            current: ch2,
                            start_pos: i,
                            type: 'bold'
                        }
                        md_flags.push(flag)
                        i += 2
                        this._boundary(i, len, md_flags, render_flags)
                        continue
                    } else if (ch === '_' || ch === '*') {
                    flag = {
                        exit_flag: true,
                        current: ch,
                        start_pos: i,
                        type: 'italic'
                    }
                    md_flags.push(flag)
                    i++
            
                    this._boundary(i, len, md_flags, render_flags)
                    continue
                    } else if (flag.type !== 'text') {
                    flag = {
                        exit_flag: true,
                        current: '',
                        start_pos: i,
                        type: 'text'
                    }
                    md_flags.push(flag)
                    i++
            
                    this._boundary(i, len, md_flags, render_flags)
                    continue
                    }
                }
            
                if (i === len - 1 && md_flags.length) {
                    var item = md_flags.slice(-1)[0]
                    item.end_pos = len
                    item.exit_flag = item.type.includes('text')
                    if (!item.type.includes('text')) item.type = item.type + '_start'
                    render_flags.push(item)
                }
                i++
            }
            return render_flags
        },
        _getEscapeRender: function (data) {
            var escapereg = /[?=\\](.){1}/g
            return data.replace(escapereg, '$1')
        },
        _renderText: function (data, textShape) {
            var _this = this
            var render_flags = _this._markdown(data)
            return render_flags.reduce(function(prev, cur, index) {
                var str = ''
                if (cur.type === 'text') {
                    str = data.slice(cur.start_pos, cur.end_pos)
                    textShape.addItem(new kity.TextSpan(str))
                }
                if (cur.type === 'escape') {
                    str = data.slice(cur.start_pos + 1, cur.end_pos + 1)
                    textShape.addItem(new kity.TextSpan(str))
                }
                if (cur.type === 'italic') {
                    str = _this._getEscapeRender(data.slice(cur.start_pos + 1, cur.end_pos))
                    var textSpan = new kity.TextSpan(str)
                    textSpan.setStyle('font-style', 'italic')
                    textShape.addItem(textSpan)
                }
                if (cur.type === 'italic_start') {
                    str = _this._getEscapeRender(data.slice(cur.start_pos + 1, cur.end_pos))
                    var textSpan = new kity.TextSpan(str)
                    textSpan.setStyle('font-style', 'italic')
                    textShape.addItem(textSpan)
                }
                if (cur.type === 'italic_text') {
                    str = _this._getEscapeRender(data.slice(cur.start_pos, cur.end_pos))
                    var textSpan = new kity.TextSpan(str)
                    textSpan.setStyle('font-style', 'italic')
                    textShape.addItem(textSpan)
                }
                if (cur.type === 'bold') {
                    str = _this._getEscapeRender(data.slice(cur.start_pos + 2, cur.end_pos))
                    var textSpan = new kity.TextSpan(str)
                    textSpan.setStyle('font-weight', 'bold')
                    textShape.addItem(textSpan)
                }
                if (cur.type === 'bold_start') {
                    str = _this._getEscapeRender(data.slice(cur.start_pos + 2, cur.end_pos))
                    var textSpan = new kity.TextSpan(str)
                    textSpan.setStyle('font-weight', 'bold')
                    textShape.addItem(textSpan)
                  }
                  if (cur.type === 'bold_text') {
                    str = _this._getEscapeRender(data.slice(cur.start_pos, cur.end_pos))
                    var textSpan = new kity.TextSpan(str)
                    textSpan.setStyle('font-weight', 'bold')
                    textShape.addItem(textSpan)
                  }
                return prev + str
            }, '')
        } 
    });

    var TextCommand = kity.createClass({
        base: Command,
        execute: function(minder, text) {
            var node = minder.getSelectedNode();
            if (node) {
                node.setText(text);
                node.render();
                minder.layout();
            }
        },
        queryState: function(minder) {
            return minder.getSelectedNodes().length == 1 ? 0 : -1;
        },
        queryValue: function(minder) {
            var node = minder.getSelectedNode();
            return node ? node.getText() : null;
        }
    });

    utils.extend(TextRenderer, {
        _styleHooks: [],

        registerStyleHook: function(fn) {
            TextRenderer._styleHooks.push(fn);
        }
    });

    kity.extendClass(MinderNode, {
        getTextGroup: function() {
            return this.getRenderer('TextRenderer').getRenderShape();
        }
    });

    Module.register('text', {
        'commands': {
            'text': TextCommand
        },
        'renderers': {
            center: TextRenderer
        }
    });

    module.exports = TextRenderer;
});
