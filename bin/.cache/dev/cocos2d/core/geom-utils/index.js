
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
var _exportNames = {
  enums: true,
  Triangle: true,
  Aabb: true,
  Ray: true,
  intersect: true,
  Sphere: true,
  Obb: true,
  Frustum: true,
  Line: true,
  Plane: true
};
exports.Plane = exports.Line = exports.Frustum = exports.Obb = exports.Sphere = exports.intersect = exports.Ray = exports.Aabb = exports.Triangle = exports.enums = void 0;

var _enums = _interopRequireDefault(require("./enums"));

exports.enums = _enums["default"];

var _triangle = _interopRequireDefault(require("./triangle"));

exports.Triangle = _triangle["default"];

var _aabb = _interopRequireDefault(require("./aabb"));

exports.Aabb = _aabb["default"];

var _ray = _interopRequireDefault(require("./ray"));

exports.Ray = _ray["default"];

var _intersect = _interopRequireDefault(require("./intersect"));

exports.intersect = _intersect["default"];

var _sphere = _interopRequireDefault(require("./sphere"));

exports.Sphere = _sphere["default"];

var _obb = _interopRequireDefault(require("./obb"));

exports.Obb = _obb["default"];

var _frustum = _interopRequireDefault(require("./frustum"));

exports.Frustum = _frustum["default"];

var _line = _interopRequireDefault(require("./line"));

exports.Line = _line["default"];

var _plane = _interopRequireDefault(require("./plane"));

exports.Plane = _plane["default"];

var _distance = require("./distance");

Object.keys(_distance).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _distance[key];
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
cc.geomUtils = module.exports;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImNjIiwiZ2VvbVV0aWxzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7QUFuQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFDQUEsRUFBRSxDQUFDQyxTQUFILEdBQWVDLE1BQU0sQ0FBQ0MsT0FBdEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBlbnVtcyB9IGZyb20gJy4vZW51bXMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBUcmlhbmdsZSB9IGZyb20gJy4vdHJpYW5nbGUnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBBYWJiIH0gZnJvbSAnLi9hYWJiJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUmF5IH0gZnJvbSAnLi9yYXknO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBpbnRlcnNlY3QgfSBmcm9tICcuL2ludGVyc2VjdCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNwaGVyZSB9IGZyb20gJy4vc3BoZXJlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgT2JiIH0gZnJvbSAnLi9vYmInO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGcnVzdHVtIH0gZnJvbSAnLi9mcnVzdHVtJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTGluZSB9IGZyb20gJy4vbGluZSc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBsYW5lIH0gZnJvbSAnLi9wbGFuZSc7XG5leHBvcnQgKiBmcm9tICcuL2Rpc3RhbmNlJztcblxuY2MuZ2VvbVV0aWxzID0gbW9kdWxlLmV4cG9ydHM7Il19