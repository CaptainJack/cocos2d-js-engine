
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/3d/primitive/index.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var utils = _interopRequireWildcard(require("./utils"));

var _box = _interopRequireDefault(require("./box"));

var _cone = _interopRequireDefault(require("./cone"));

var _cylinder = _interopRequireDefault(require("./cylinder"));

var _plane = _interopRequireDefault(require("./plane"));

var _quad = _interopRequireDefault(require("./quad"));

var _sphere = _interopRequireDefault(require("./sphere"));

var _torus = _interopRequireDefault(require("./torus"));

var _capsule = _interopRequireDefault(require("./capsule"));

var _polyhedron = require("./polyhedron");

var _vertexData = _interopRequireDefault(require("./vertex-data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * !#en A basic module for creating vertex data for 3D objects. You can access this module by `cc.primitive`.
 * !#zh 一个创建 3D 物体顶点数据的基础模块，你可以通过 `cc.primitive` 来访问这个模块。
 * @module cc.primitive
 * @submodule cc.primitive
 * @main
 */
cc.primitive = Object.assign({
  /**
   * !#en Create box vertex data
   * !#zh 创建长方体顶点数据
   * @method box
   * @static
   * @param {Number} width
   * @param {Number} height
   * @param {Number} length
   * @param {Object} opts
   * @param {Number} opts.widthSegments
   * @param {Number} opts.heightSegments
   * @param {Number} opts.lengthSegments
   * @return {primitive.VertexData}
   */
  box: _box["default"],

  /**
   * !#en Create cone vertex data
   * !#zh 创建圆锥体顶点数据
   * @method cone
   * @static
   * @param {Number} radius
   * @param {Number} height
   * @param {Object} opts
   * @param {Number} opts.radialSegments
   * @param {Number} opts.heightSegments
   * @param {Boolean} opts.capped
   * @param {Number} opts.arc
   * @return {primitive.VertexData}
   */
  cone: _cone["default"],

  /**
   * !#en Create cylinder vertex data
   * !#zh 创建圆柱体顶点数据
   * @method cylinder
   * @static
   * @param {Number} radiusTop
   * @param {Number} radiusBottom
   * @param {Number} height
   * @param {Object} opts
   * @param {Number} opts.radialSegments
   * @param {Number} opts.heightSegments
   * @param {Boolean} opts.capped
   * @param {Number} opts.arc
   * @return {primitive.VertexData}
   */
  cylinder: _cylinder["default"],

  /**
   * !#en Create plane vertex data
   * !#zh 创建平台顶点数据
   * @method plane
   * @static
   * @param {Number} width
   * @param {Number} length
   * @param {Object} opts
   * @param {Number} opts.widthSegments
   * @param {Number} opts.lengthSegments
   * @return {primitive.VertexData}
   */
  plane: _plane["default"],

  /**
   * !#en Create quad vertex data
   * !#zh 创建面片顶点数据
   * @method quad
   * @static
   * @return {primitive.VertexData}
   */
  quad: _quad["default"],

  /**
   * !#en Create sphere vertex data
   * !#zh 创建球体顶点数据
   * @method sphere
   * @static
   * @param {Number} radius
   * @param {Object} opts
   * @param {Number} opts.segments
   * @return {primitive.VertexData}
   */
  sphere: _sphere["default"],

  /**
   * !#en Create torus vertex data
   * !#zh 创建圆环顶点数据
   * @method torus
   * @static
   * @param {Number} radius
   * @param {Number} tube
   * @param {Object} opts
   * @param {Number} opts.radialSegments
   * @param {Number} opts.tubularSegments
   * @param {Number} opts.arc
   * @return {primitive.VertexData}
   */
  torus: _torus["default"],

  /**
   * !#en Create capsule vertex data
   * !#zh 创建胶囊体顶点数据
   * @method capsule
   * @static
   * @param {Number} radiusTop
   * @param {Number} radiusBottom
   * @param {Number} height
   * @param {Object} opts
   * @param {Number} opts.sides
   * @param {Number} opts.heightSegments
   * @param {Boolean} opts.capped
   * @param {Number} opts.arc
   * @return {primitive.VertexData}
   */
  capsule: _capsule["default"],

  /**
   * !#en Create polyhedron vertex data
   * !#zh 创建多面体顶点数据
   * @method polyhedron
   * @static
   * @param {primitive.PolyhedronType} type
   * @param {Number} Size
   * @param {Object} opts
   * @param {Number} opts.sizeX
   * @param {Number} opts.sizeY
   * @param {Number} opts.sizeZ
   * @return {primitive.VertexData}
   */
  polyhedron: _polyhedron.polyhedron,
  PolyhedronType: _polyhedron.PolyhedronType,
  VertexData: _vertexData["default"]
}, utils); // fix submodule pollute ...

/**
 * @submodule cc
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImNjIiwicHJpbWl0aXZlIiwiT2JqZWN0IiwiYXNzaWduIiwiYm94IiwiY29uZSIsImN5bGluZGVyIiwicGxhbmUiLCJxdWFkIiwic3BoZXJlIiwidG9ydXMiLCJjYXBzdWxlIiwicG9seWhlZHJvbiIsIlBvbHloZWRyb25UeXBlIiwiVmVydGV4RGF0YSIsInV0aWxzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7Ozs7QUFRQUEsRUFBRSxDQUFDQyxTQUFILEdBQWVDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQ3pCOzs7Ozs7Ozs7Ozs7OztBQWNBQyxFQUFBQSxHQUFHLEVBQUhBLGVBZnlCOztBQWdCekI7Ozs7Ozs7Ozs7Ozs7O0FBY0FDLEVBQUFBLElBQUksRUFBSkEsZ0JBOUJ5Qjs7QUErQnpCOzs7Ozs7Ozs7Ozs7Ozs7QUFlQUMsRUFBQUEsUUFBUSxFQUFSQSxvQkE5Q3lCOztBQStDekI7Ozs7Ozs7Ozs7OztBQVlBQyxFQUFBQSxLQUFLLEVBQUxBLGlCQTNEeUI7O0FBNER6Qjs7Ozs7OztBQU9BQyxFQUFBQSxJQUFJLEVBQUpBLGdCQW5FeUI7O0FBb0V6Qjs7Ozs7Ozs7OztBQVVBQyxFQUFBQSxNQUFNLEVBQU5BLGtCQTlFeUI7O0FBK0V6Qjs7Ozs7Ozs7Ozs7OztBQWFBQyxFQUFBQSxLQUFLLEVBQUxBLGlCQTVGeUI7O0FBNkZ6Qjs7Ozs7Ozs7Ozs7Ozs7O0FBZUFDLEVBQUFBLE9BQU8sRUFBUEEsbUJBNUd5Qjs7QUE2R3pCOzs7Ozs7Ozs7Ozs7O0FBYUFDLEVBQUFBLFVBQVUsRUFBVkEsc0JBMUh5QjtBQTRIekJDLEVBQUFBLGNBQWMsRUFBZEEsMEJBNUh5QjtBQTZIekJDLEVBQUFBLFVBQVUsRUFBVkE7QUE3SHlCLENBQWQsRUE4SFpDLEtBOUhZLENBQWYsRUFnSUE7O0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBib3ggZnJvbSAnLi9ib3gnO1xuaW1wb3J0IGNvbmUgZnJvbSAnLi9jb25lJztcbmltcG9ydCBjeWxpbmRlciBmcm9tICcuL2N5bGluZGVyJztcbmltcG9ydCBwbGFuZSBmcm9tICcuL3BsYW5lJztcbmltcG9ydCBxdWFkIGZyb20gJy4vcXVhZCc7XG5pbXBvcnQgc3BoZXJlIGZyb20gJy4vc3BoZXJlJztcbmltcG9ydCB0b3J1cyBmcm9tICcuL3RvcnVzJztcbmltcG9ydCBjYXBzdWxlIGZyb20gJy4vY2Fwc3VsZSc7XG5pbXBvcnQgeyBQb2x5aGVkcm9uVHlwZSwgcG9seWhlZHJvbiB9IGZyb20gJy4vcG9seWhlZHJvbic7XG5pbXBvcnQgVmVydGV4RGF0YSBmcm9tICcuL3ZlcnRleC1kYXRhJztcblxuLyoqXG4gKiAhI2VuIEEgYmFzaWMgbW9kdWxlIGZvciBjcmVhdGluZyB2ZXJ0ZXggZGF0YSBmb3IgM0Qgb2JqZWN0cy4gWW91IGNhbiBhY2Nlc3MgdGhpcyBtb2R1bGUgYnkgYGNjLnByaW1pdGl2ZWAuXG4gKiAhI3poIOS4gOS4quWIm+W7uiAzRCDniankvZPpobbngrnmlbDmja7nmoTln7rnoYDmqKHlnZfvvIzkvaDlj6/ku6XpgJrov4cgYGNjLnByaW1pdGl2ZWAg5p2l6K6/6Zeu6L+Z5Liq5qih5Z2X44CCXG4gKiBAbW9kdWxlIGNjLnByaW1pdGl2ZVxuICogQHN1Ym1vZHVsZSBjYy5wcmltaXRpdmVcbiAqIEBtYWluXG4gKi9cblxuY2MucHJpbWl0aXZlID0gT2JqZWN0LmFzc2lnbih7XG4gICAgLyoqXG4gICAgICogISNlbiBDcmVhdGUgYm94IHZlcnRleCBkYXRhXG4gICAgICogISN6aCDliJvlu7rplb/mlrnkvZPpobbngrnmlbDmja5cbiAgICAgKiBAbWV0aG9kIGJveFxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMud2lkdGhTZWdtZW50c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLmhlaWdodFNlZ21lbnRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMubGVuZ3RoU2VnbWVudHNcbiAgICAgKiBAcmV0dXJuIHtwcmltaXRpdmUuVmVydGV4RGF0YX1cbiAgICAgKi9cbiAgICBib3gsXG4gICAgLyoqXG4gICAgICogISNlbiBDcmVhdGUgY29uZSB2ZXJ0ZXggZGF0YVxuICAgICAqICEjemgg5Yib5bu65ZyG6ZSl5L2T6aG254K55pWw5o2uXG4gICAgICogQG1ldGhvZCBjb25lXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5yYWRpYWxTZWdtZW50c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLmhlaWdodFNlZ21lbnRzXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBvcHRzLmNhcHBlZFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLmFyY1xuICAgICAqIEByZXR1cm4ge3ByaW1pdGl2ZS5WZXJ0ZXhEYXRhfVxuICAgICAqL1xuICAgIGNvbmUsXG4gICAgLyoqXG4gICAgICogISNlbiBDcmVhdGUgY3lsaW5kZXIgdmVydGV4IGRhdGFcbiAgICAgKiAhI3poIOWIm+W7uuWchuafseS9k+mhtueCueaVsOaNrlxuICAgICAqIEBtZXRob2QgY3lsaW5kZXJcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c1RvcFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXNCb3R0b21cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5yYWRpYWxTZWdtZW50c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLmhlaWdodFNlZ21lbnRzXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBvcHRzLmNhcHBlZFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLmFyY1xuICAgICAqIEByZXR1cm4ge3ByaW1pdGl2ZS5WZXJ0ZXhEYXRhfVxuICAgICAqL1xuICAgIGN5bGluZGVyLFxuICAgIC8qKlxuICAgICAqICEjZW4gQ3JlYXRlIHBsYW5lIHZlcnRleCBkYXRhXG4gICAgICogISN6aCDliJvlu7rlubPlj7DpobbngrnmlbDmja5cbiAgICAgKiBAbWV0aG9kIHBsYW5lXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGhcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLndpZHRoU2VnbWVudHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5sZW5ndGhTZWdtZW50c1xuICAgICAqIEByZXR1cm4ge3ByaW1pdGl2ZS5WZXJ0ZXhEYXRhfVxuICAgICAqL1xuICAgIHBsYW5lLFxuICAgIC8qKlxuICAgICAqICEjZW4gQ3JlYXRlIHF1YWQgdmVydGV4IGRhdGFcbiAgICAgKiAhI3poIOWIm+W7uumdoueJh+mhtueCueaVsOaNrlxuICAgICAqIEBtZXRob2QgcXVhZFxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcmV0dXJuIHtwcmltaXRpdmUuVmVydGV4RGF0YX1cbiAgICAgKi9cbiAgICBxdWFkLFxuICAgIC8qKlxuICAgICAqICEjZW4gQ3JlYXRlIHNwaGVyZSB2ZXJ0ZXggZGF0YVxuICAgICAqICEjemgg5Yib5bu655CD5L2T6aG254K55pWw5o2uXG4gICAgICogQG1ldGhvZCBzcGhlcmVcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuc2VnbWVudHNcbiAgICAgKiBAcmV0dXJuIHtwcmltaXRpdmUuVmVydGV4RGF0YX1cbiAgICAgKi9cbiAgICBzcGhlcmUsXG4gICAgLyoqXG4gICAgICogISNlbiBDcmVhdGUgdG9ydXMgdmVydGV4IGRhdGFcbiAgICAgKiAhI3poIOWIm+W7uuWchueOr+mhtueCueaVsOaNrlxuICAgICAqIEBtZXRob2QgdG9ydXNcbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0dWJlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5yYWRpYWxTZWdtZW50c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLnR1YnVsYXJTZWdtZW50c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLmFyY1xuICAgICAqIEByZXR1cm4ge3ByaW1pdGl2ZS5WZXJ0ZXhEYXRhfVxuICAgICAqL1xuICAgIHRvcnVzLFxuICAgIC8qKlxuICAgICAqICEjZW4gQ3JlYXRlIGNhcHN1bGUgdmVydGV4IGRhdGFcbiAgICAgKiAhI3poIOWIm+W7uuiDtuWbiuS9k+mhtueCueaVsOaNrlxuICAgICAqIEBtZXRob2QgY2Fwc3VsZVxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmFkaXVzVG9wXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHJhZGl1c0JvdHRvbVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLnNpZGVzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuaGVpZ2h0U2VnbWVudHNcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdHMuY2FwcGVkXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuYXJjXG4gICAgICogQHJldHVybiB7cHJpbWl0aXZlLlZlcnRleERhdGF9XG4gICAgICovXG4gICAgY2Fwc3VsZSxcbiAgICAvKipcbiAgICAgKiAhI2VuIENyZWF0ZSBwb2x5aGVkcm9uIHZlcnRleCBkYXRhXG4gICAgICogISN6aCDliJvlu7rlpJrpnaLkvZPpobbngrnmlbDmja5cbiAgICAgKiBAbWV0aG9kIHBvbHloZWRyb25cbiAgICAgKiBAc3RhdGljXG4gICAgICogQHBhcmFtIHtwcmltaXRpdmUuUG9seWhlZHJvblR5cGV9IHR5cGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gU2l6ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG9wdHMuc2l6ZVhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gb3B0cy5zaXplWVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBvcHRzLnNpemVaXG4gICAgICogQHJldHVybiB7cHJpbWl0aXZlLlZlcnRleERhdGF9XG4gICAgICovXG4gICAgcG9seWhlZHJvbixcblxuICAgIFBvbHloZWRyb25UeXBlLFxuICAgIFZlcnRleERhdGEsXG59LCB1dGlscyk7XG5cbi8vIGZpeCBzdWJtb2R1bGUgcG9sbHV0ZSAuLi5cbi8qKlxuICogQHN1Ym1vZHVsZSBjY1xuICovXG4iXX0=