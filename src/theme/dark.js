define(function(require, exports, module) {
    var theme = require('../core/theme');

    theme.register('dark', {
        'background': '#1e1c1a ',

        'root-color': '#ffffff',
        'root-background': '#4c9ff2',
        'root-stroke': 'transparent',
        'root-font-size': 22,
        'root-padding': [18, 32],
        'root-margin': [30, 100],
        'root-radius': 6,
        'root-space': 10,

        'main-color': '#1b1b1b',
        'main-background': '#e8e8e8',
        'main-stroke': 'transparent',
        'main-stroke-width': 0,
        'main-font-size': 20,
        'main-padding': [12.5, 32.5],
        'main-margin': 20,
        'main-radius': 6,
        'main-space': 5,

        'sub-color': '#1b1b1b',
        'sub-background': '#e8e8e8',
        'sub-stroke': 'none',
        'sub-font-size': 14,
        'sub-padding': [8, 21.5],
        'sub-margin': [15, 20],
        'sub-radius': 6,
        'sub-space': 5,

        'connect-color': '#4d4d4d',
        'connect-width': 2.5,
        'connect-radius': 5,

        'selected-stroke': '#4c9ff2',
        'selected-stroke-width': '2',
        'blur-selected-stroke': '#4c9ff2',

        'marquee-background': 'transparent',
        'marquee-stroke': '#4c9ff2',

        'drop-hint-color': 'transparent',
        'drop-hint-width': 8,

        'order-hint-area-color': '#e8e8e8',
        'order-hint-path-color': '#e8e8e8',
        'order-hint-path-width': 0,

        'text-selection-color': '#1b1b1b',
        'line-height':1.5
    });
});