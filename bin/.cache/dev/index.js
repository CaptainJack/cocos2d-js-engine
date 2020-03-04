
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// PREDEFINE
// window may be undefined when first load engine from editor
var _global = typeof window === 'undefined' ? global : window;
/**
 * !#en
 * The main namespace of Cocos2d-JS, all engine core classes, functions, properties and constants are defined in this namespace.
 * !#zh
 * Cocos 引擎的主要命名空间，引擎代码中所有的类，函数，属性和常量都在这个命名空间中定义。
 * @module cc
 * @main cc
 */


_global.cc = _global.cc || {}; // For internal usage

cc.internal = cc.internal || {};

require('./predefine'); // polyfills


require('./polyfill/string');

require('./polyfill/misc');

require('./polyfill/array');

require('./polyfill/object');

require('./polyfill/array-buffer');

require('./polyfill/number');

if (!(CC_EDITOR && Editor.isMainProcess)) {
  require('./polyfill/typescript');
}

require('./cocos2d/core/predefine'); // LOAD COCOS2D ENGINE CODE


if (!(CC_EDITOR && Editor.isMainProcess)) {
  require('./cocos2d');
} // LOAD EXTENDS


require('./extends');

if (CC_EDITOR) {
  if (Editor.isMainProcess) {
    Editor.versions['cocos2d'] = require('./package').version;
  }
}

module.exports = _global.cc;
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_engine__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIl9nbG9iYWwiLCJ3aW5kb3ciLCJnbG9iYWwiLCJjYyIsImludGVybmFsIiwicmVxdWlyZSIsIkNDX0VESVRPUiIsIkVkaXRvciIsImlzTWFpblByb2Nlc3MiLCJ2ZXJzaW9ucyIsInZlcnNpb24iLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7QUFFQTtBQUNBLElBQUlBLE9BQU8sR0FBRyxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDQyxNQUFoQyxHQUF5Q0QsTUFBdkQ7QUFFQTs7Ozs7Ozs7OztBQVFBRCxPQUFPLENBQUNHLEVBQVIsR0FBYUgsT0FBTyxDQUFDRyxFQUFSLElBQWMsRUFBM0IsRUFFQTs7QUFDQUEsRUFBRSxDQUFDQyxRQUFILEdBQWNELEVBQUUsQ0FBQ0MsUUFBSCxJQUFlLEVBQTdCOztBQUVBQyxPQUFPLENBQUMsYUFBRCxDQUFQLEVBRUE7OztBQUNBQSxPQUFPLENBQUMsbUJBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLGlCQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxrQkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMsbUJBQUQsQ0FBUDs7QUFDQUEsT0FBTyxDQUFDLHlCQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxtQkFBRCxDQUFQOztBQUNBLElBQUksRUFBRUMsU0FBUyxJQUFJQyxNQUFNLENBQUNDLGFBQXRCLENBQUosRUFBMEM7QUFDdENILEVBQUFBLE9BQU8sQ0FBQyx1QkFBRCxDQUFQO0FBQ0g7O0FBRURBLE9BQU8sQ0FBQywwQkFBRCxDQUFQLEVBRUE7OztBQUVBLElBQUksRUFBRUMsU0FBUyxJQUFJQyxNQUFNLENBQUNDLGFBQXRCLENBQUosRUFBMEM7QUFDdENILEVBQUFBLE9BQU8sQ0FBQyxXQUFELENBQVA7QUFDSCxFQUVEOzs7QUFFQUEsT0FBTyxDQUFDLFdBQUQsQ0FBUDs7QUFFQSxJQUFJQyxTQUFKLEVBQWU7QUFDWCxNQUFJQyxNQUFNLENBQUNDLGFBQVgsRUFBMEI7QUFDdEJELElBQUFBLE1BQU0sQ0FBQ0UsUUFBUCxDQUFnQixTQUFoQixJQUE2QkosT0FBTyxDQUFDLFdBQUQsQ0FBUCxDQUFxQkssT0FBbEQ7QUFDSDtBQUNKOztBQUVEQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJaLE9BQU8sQ0FBQ0csRUFBekIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8vIFBSRURFRklORVxuXG4vLyB3aW5kb3cgbWF5IGJlIHVuZGVmaW5lZCB3aGVuIGZpcnN0IGxvYWQgZW5naW5lIGZyb20gZWRpdG9yXG52YXIgX2dsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93O1xuXG4vKipcbiAqICEjZW5cbiAqIFRoZSBtYWluIG5hbWVzcGFjZSBvZiBDb2NvczJkLUpTLCBhbGwgZW5naW5lIGNvcmUgY2xhc3NlcywgZnVuY3Rpb25zLCBwcm9wZXJ0aWVzIGFuZCBjb25zdGFudHMgYXJlIGRlZmluZWQgaW4gdGhpcyBuYW1lc3BhY2UuXG4gKiAhI3poXG4gKiBDb2NvcyDlvJXmk47nmoTkuLvopoHlkb3lkI3nqbrpl7TvvIzlvJXmk47ku6PnoIHkuK3miYDmnInnmoTnsbvvvIzlh73mlbDvvIzlsZ7mgKflkozluLjph4/pg73lnKjov5nkuKrlkb3lkI3nqbrpl7TkuK3lrprkuYnjgIJcbiAqIEBtb2R1bGUgY2NcbiAqIEBtYWluIGNjXG4gKi9cbl9nbG9iYWwuY2MgPSBfZ2xvYmFsLmNjIHx8IHt9O1xuXG4vLyBGb3IgaW50ZXJuYWwgdXNhZ2VcbmNjLmludGVybmFsID0gY2MuaW50ZXJuYWwgfHwge307XG5cbnJlcXVpcmUoJy4vcHJlZGVmaW5lJyk7XG5cbi8vIHBvbHlmaWxsc1xucmVxdWlyZSgnLi9wb2x5ZmlsbC9zdHJpbmcnKTtcbnJlcXVpcmUoJy4vcG9seWZpbGwvbWlzYycpO1xucmVxdWlyZSgnLi9wb2x5ZmlsbC9hcnJheScpO1xucmVxdWlyZSgnLi9wb2x5ZmlsbC9vYmplY3QnKTtcbnJlcXVpcmUoJy4vcG9seWZpbGwvYXJyYXktYnVmZmVyJyk7XG5yZXF1aXJlKCcuL3BvbHlmaWxsL251bWJlcicpO1xuaWYgKCEoQ0NfRURJVE9SICYmIEVkaXRvci5pc01haW5Qcm9jZXNzKSkge1xuICAgIHJlcXVpcmUoJy4vcG9seWZpbGwvdHlwZXNjcmlwdCcpO1xufVxuXG5yZXF1aXJlKCcuL2NvY29zMmQvY29yZS9wcmVkZWZpbmUnKTtcblxuLy8gTE9BRCBDT0NPUzJEIEVOR0lORSBDT0RFXG5cbmlmICghKENDX0VESVRPUiAmJiBFZGl0b3IuaXNNYWluUHJvY2VzcykpIHtcbiAgICByZXF1aXJlKCcuL2NvY29zMmQnKTtcbn1cblxuLy8gTE9BRCBFWFRFTkRTXG5cbnJlcXVpcmUoJy4vZXh0ZW5kcycpO1xuXG5pZiAoQ0NfRURJVE9SKSB7XG4gICAgaWYgKEVkaXRvci5pc01haW5Qcm9jZXNzKSB7XG4gICAgICAgIEVkaXRvci52ZXJzaW9uc1snY29jb3MyZCddID0gcmVxdWlyZSgnLi9wYWNrYWdlJykudmVyc2lvbjtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2dsb2JhbC5jYzsiXX0=