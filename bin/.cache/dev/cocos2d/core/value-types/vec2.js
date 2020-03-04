
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/vec2.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _valueType = _interopRequireDefault(require("./value-type"));

var _CCClass = _interopRequireDefault(require("../platform/CCClass"));

var _misc = _interopRequireDefault(require("../utils/misc"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _x = 0.0;
var _y = 0.0;
/**
 * !#en Representation of 2D vectors and points.
 * !#zh 表示 2D 向量和坐标
 *
 * @class Vec2
 * @extends ValueType
 */

var Vec2 =
/*#__PURE__*/
function (_ValueType) {
  _inheritsLoose(Vec2, _ValueType);

  var _proto = Vec2.prototype;

  // deprecated

  /**
   * !#en Returns the length of this vector.
   * !#zh 返回该向量的长度。
   * @method mag
   * @return {number} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.mag(); // return 14.142135623730951;
   */

  /**
   * !#en Returns the squared length of this vector.
   * !#zh 返回该向量的长度平方。
   * @method magSqr
   * @return {number} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.magSqr(); // return 200;
   */

  /**
   * !#en Subtracts one vector from this. If you want to save result to another vector, use sub() instead.
   * !#zh 向量减法。如果你想保存结果到另一个向量，可使用 sub() 代替。
   * @method subSelf
   * @param {Vec2} vector
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.subSelf(cc.v2(5, 5));// return Vec2 {x: 5, y: 5};
   */

  /**
   * !#en Subtracts one vector from this, and returns the new result.
   * !#zh 向量减法，并返回新结果。
   * @method sub
   * @param {Vec2} vector
   * @param {Vec2} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.sub(cc.v2(5, 5));      // return Vec2 {x: 5, y: 5};
   * var v1;
   * v.sub(cc.v2(5, 5), v1);  // return Vec2 {x: 5, y: 5};
   */
  _proto.sub = function sub(vector, out) {
    return Vec2.subtract(out || new Vec2(), this, vector);
  }
  /**
   * !#en Multiplies this by a number. If you want to save result to another vector, use mul() instead.
   * !#zh 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
   * @method mulSelf
   * @param {number} num
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.mulSelf(5);// return Vec2 {x: 50, y: 50};
   */
  ;

  /**
   * !#en Multiplies by a number, and returns the new result.
   * !#zh 缩放向量，并返回新结果。
   * @method mul
   * @param {number} num
   * @param {Vec2} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.mul(5);      // return Vec2 {x: 50, y: 50};
   * var v1;
   * v.mul(5, v1);  // return Vec2 {x: 50, y: 50};
   */
  _proto.mul = function mul(num, out) {
    return Vec2.multiplyScalar(out || new Vec2(), this, num);
  }
  /**
   * !#en Divides by a number. If you want to save result to another vector, use div() instead.
   * !#zh 向量除法。如果你想结果保存到另一个向量，可使用 div() 代替。
   * @method divSelf
   * @param {number} num
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.divSelf(5); // return Vec2 {x: 2, y: 2};
   */
  ;

  /**
   * !#en Divides by a number, and returns the new result.
   * !#zh 向量除法，并返回新的结果。
   * @method div
   * @param {number} num
   * @param {Vec2} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.div(5);      // return Vec2 {x: 2, y: 2};
   * var v1;
   * v.div(5, v1);  // return Vec2 {x: 2, y: 2};
   */
  _proto.div = function div(num, out) {
    return Vec2.multiplyScalar(out || new Vec2(), this, 1 / num);
  }
  /**
   * !#en Multiplies two vectors.
   * !#zh 分量相乘。
   * @method scaleSelf
   * @param {Vec2} vector
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.scaleSelf(cc.v2(5, 5));// return Vec2 {x: 50, y: 50};
   */
  ;

  /**
   * !#en Multiplies two vectors, and returns the new result.
   * !#zh 分量相乘，并返回新的结果。
   * @method scale
   * @param {Vec2} vector
   * @param {Vec2} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.scale(cc.v2(5, 5));      // return Vec2 {x: 50, y: 50};
   * var v1;
   * v.scale(cc.v2(5, 5), v1);  // return Vec2 {x: 50, y: 50};
   */
  _proto.scale = function scale(vector, out) {
    return Vec2.multiply(out || new Vec2(), this, vector);
  }
  /**
   * !#en Negates the components. If you want to save result to another vector, use neg() instead.
   * !#zh 向量取反。如果你想结果保存到另一个向量，可使用 neg() 代替。
   * @method negSelf
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.negSelf(); // return Vec2 {x: -10, y: -10};
   */
  ;

  /**
   * !#en Negates the components, and returns the new result.
   * !#zh 返回取反后的新向量。
   * @method neg
   * @param {Vec2} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2} the result
   * @example
   * var v = cc.v2(10, 10);
   * var v1;
   * v.neg(v1);  // return Vec2 {x: -10, y: -10};
   */
  _proto.neg = function neg(out) {
    return Vec2.negate(out || new Vec2(), this);
  }
  /**
   * !#en return a Vec2 object with x = 1 and y = 1.
   * !#zh 新 Vec2 对象。
   * @property ONE
   * @type Vec2
   * @static
   */
  ;

  /**
   * !#zh 获得指定向量的拷贝
   * @method clone
   * @typescript
   * clone <Out extends IVec2Like> (a: Out)
   * @static
   */
  Vec2.clone = function clone(a) {
    return new Vec2(a.x, a.y);
  }
  /**
   * !#zh 复制指定向量的值
   * @method copy
   * @typescript
   * copy <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.copy = function copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    return out;
  }
  /**
   * !#zh  设置向量值
   * @method set
   * @typescript
   * set <Out extends IVec2Like> (out: Out, x: number, y: number)
   * @static
   */
  ;

  Vec2.set = function set(out, x, y) {
    out.x = x;
    out.y = y;
    return out;
  }
  /**
   * !#zh 逐元素向量加法
   * @method add
   * @typescript
   * add <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.add = function add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
  }
  /**
   * !#zh 逐元素向量减法
   * @method subtract
   * @typescript
   * subtract <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.subtract = function subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
  }
  /**
   * !#zh 逐元素向量乘法
   * @method multiply
   * @typescript
   * multiply <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.multiply = function multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    return out;
  }
  /**
   * !#zh 逐元素向量除法
   * @method divide
   * @typescript
   * divide <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.divide = function divide(out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    return out;
  }
  /**
   * !#zh 逐元素向量向上取整
   * @method ceil
   * @typescript
   * ceil <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.ceil = function ceil(out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    return out;
  }
  /**
   * !#zh 逐元素向量向下取整
   * @method floor
   * @typescript
   * floor <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.floor = function floor(out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    return out;
  }
  /**
   * !#zh 逐元素向量最小值
   * @method min
   * @typescript
   * min <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.min = function min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
  }
  /**
   * !#zh 逐元素向量最大值
   * @method max
   * @typescript
   * max <Out extends IVec2Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.max = function max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
  }
  /**
   * !#zh 逐元素向量四舍五入取整
   * @method round
   * @typescript
   * round <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.round = function round(out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    return out;
  }
  /**
   * !#zh 向量标量乘法
   * @method multiplyScalar
   * @typescript
   * multiplyScalar <Out extends IVec2Like> (out: Out, a: Out, b: number)
   * @static
   */
  ;

  Vec2.multiplyScalar = function multiplyScalar(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    return out;
  }
  /**
   * !#zh 逐元素向量乘加: A + B * scale
   * @method scaleAndAdd
   * @typescript
   * scaleAndAdd <Out extends IVec2Like> (out: Out, a: Out, b: Out, scale: number)
   * @static
   */
  ;

  Vec2.scaleAndAdd = function scaleAndAdd(out, a, b, scale) {
    out.x = a.x + b.x * scale;
    out.y = a.y + b.y * scale;
    return out;
  }
  /**
   * !#zh 求两向量的欧氏距离
   * @method distance
   * @typescript
   * distance <Out extends IVec2Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec2.distance = function distance(a, b) {
    _x = b.x - a.x;
    _y = b.y - a.y;
    return Math.sqrt(_x * _x + _y * _y);
  }
  /**
   * !#zh 求两向量的欧氏距离平方
   * @method squaredDistance
   * @typescript
   * squaredDistance <Out extends IVec2Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec2.squaredDistance = function squaredDistance(a, b) {
    _x = b.x - a.x;
    _y = b.y - a.y;
    return _x * _x + _y * _y;
  }
  /**
   * !#zh 求向量长度
   * @method len
   * @typescript
   * len <Out extends IVec2Like> (a: Out)
   * @static
   */
  ;

  Vec2.len = function len(a) {
    _x = a.x;
    _y = a.y;
    return Math.sqrt(_x * _x + _y * _y);
  }
  /**
   * !#zh 求向量长度平方
   * @method lengthSqr
   * @typescript
   * lengthSqr <Out extends IVec2Like> (a: Out)
   * @static
   */
  ;

  Vec2.lengthSqr = function lengthSqr(a) {
    _x = a.x;
    _y = a.y;
    return _x * _x + _y * _y;
  }
  /**
   * !#zh 逐元素向量取负
   * @method negate
   * @typescript
   * negate <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.negate = function negate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 Infinity
   * @method inverse
   * @typescript
   * inverse <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.inverse = function inverse(out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 0
   * @method inverseSafe
   * @typescript
   * inverseSafe <Out extends IVec2Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec2.inverseSafe = function inverseSafe(out, a) {
    _x = a.x;
    _y = a.y;

    if (Math.abs(_x) < _utils.EPSILON) {
      out.x = 0;
    } else {
      out.x = 1.0 / _x;
    }

    if (Math.abs(_y) < _utils.EPSILON) {
      out.y = 0;
    } else {
      out.y = 1.0 / _y;
    }

    return out;
  }
  /**
   * !#zh 归一化向量
   * @method normalize
   * @typescript
   * normalize <Out extends IVec2Like, Vec2Like extends IVec2Like> (out: Out, a: Vec2Like)
   * @static
   */
  ;

  Vec2.normalize = function normalize(out, a) {
    _x = a.x;
    _y = a.y;
    var len = _x * _x + _y * _y;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = _x * len;
      out.y = _y * len;
    }

    return out;
  }
  /**
   * !#zh 向量点积（数量积）
   * @method dot
   * @typescript
   * dot <Out extends IVec2Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec2.dot = function dot(a, b) {
    return a.x * b.x + a.y * b.y;
  }
  /**
   * !#zh 向量叉积（向量积），注意二维向量的叉积为与 Z 轴平行的三维向量
   * @method cross
   * @typescript
   * cross <Out extends IVec2Like> (out: Vec2, a: Out, b: Out)
   * @static
   */
  ;

  Vec2.cross = function cross(out, a, b) {
    out.x = out.y = 0;
    out.z = a.x * b.y - a.y * b.x;
    return out;
  }
  /**
   * !#zh 逐元素向量线性插值： A + t * (B - A)
   * @method lerp
   * @typescript
   * lerp <Out extends IVec2Like> (out: Out, a: Out, b: Out, t: number)
   * @static
   */
  ;

  Vec2.lerp = function lerp(out, a, b, t) {
    _x = a.x;
    _y = a.y;
    out.x = _x + t * (b.x - _x);
    out.y = _y + t * (b.y - _y);
    return out;
  }
  /**
   * !#zh 生成一个在单位圆上均匀分布的随机向量
   * @method random
   * @typescript
   * random <Out extends IVec2Like> (out: Out, scale?: number)
   * @static
   */
  ;

  Vec2.random = function random(out, scale) {
    scale = scale || 1.0;
    var r = (0, _utils.random)() * 2.0 * Math.PI;
    out.x = Math.cos(r) * scale;
    out.y = Math.sin(r) * scale;
    return out;
  }
  /**
   * !#zh 向量与三维矩阵乘法，默认向量第三位为 1。
   * @method transformMat3
   * @typescript
   * transformMat3 <Out extends IVec2Like, MatLike extends IMat3Like> (out: Out, a: Out, mat: IMat3Like)
   * @static
   */
  ;

  Vec2.transformMat3 = function transformMat3(out, a, mat) {
    _x = a.x;
    _y = a.y;
    var m = mat.m;
    out.x = m[0] * _x + m[3] * _y + m[6];
    out.y = m[1] * _x + m[4] * _y + m[7];
    return out;
  }
  /**
   * !#zh 向量与四维矩阵乘法，默认向量第三位为 0，第四位为 1。
   * @method transformMat4
   * @typescript
   * transformMat4 <Out extends IVec2Like, MatLike extends IMat4Like> (out: Out, a: Out, mat: MatLike)
   * @static
   */
  ;

  Vec2.transformMat4 = function transformMat4(out, a, mat) {
    _x = a.x;
    _y = a.y;
    var m = mat.m;
    out.x = m[0] * _x + m[4] * _y + m[12];
    out.y = m[1] * _x + m[5] * _y + m[13];
    return out;
  }
  /**
   * !#zh 向量等价判断
   * @method strictEquals
   * @typescript
   * strictEquals <Out extends IVec2Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec2.strictEquals = function strictEquals(a, b) {
    return a.x === b.x && a.y === b.y;
  }
  /**
   * !#zh 排除浮点数误差的向量近似等价判断
   * @method equals
   * @typescript
   * equals <Out extends IVec2Like> (a: Out, b: Out,  epsilon = EPSILON)
   * @static
   */
  ;

  Vec2.equals = function equals(a, b, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(a.x - b.x) <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) && Math.abs(a.y - b.y) <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y));
  }
  /**
   * !#zh 排除浮点数误差的向量近似等价判断
   * @method angle
   * @typescript
   * angle <Out extends IVec2Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec2.angle = function angle(a, b) {
    Vec2.normalize(v2_1, a);
    Vec2.normalize(v2_2, b);
    var cosine = Vec2.dot(v2_1, v2_2);

    if (cosine > 1.0) {
      return 0;
    }

    if (cosine < -1.0) {
      return Math.PI;
    }

    return Math.acos(cosine);
  }
  /**
   * !#zh 向量转数组
   * @method toArray
   * @typescript
   * toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec2Like, ofs = 0)
   * @static
   */
  ;

  Vec2.toArray = function toArray(out, v, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out[ofs + 0] = v.x;
    out[ofs + 1] = v.y;
    return out;
  }
  /**
   * !#zh 数组转向量
   * @method fromArray
   * @typescript
   * fromArray <Out extends IVec2Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0)
   * @static
   */
  ;

  Vec2.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out.x = arr[ofs + 0];
    out.y = arr[ofs + 1];
    return out;
  }
  /**
   * @property {Number} x
   */
  ;

  _createClass(Vec2, null, [{
    key: "ONE",
    get: function get() {
      return new Vec2(1, 1);
    }
  }, {
    key: "ZERO",

    /**
     * !#en return a Vec2 object with x = 0 and y = 0.
     * !#zh 返回 x = 0 和 y = 0 的 Vec2 对象。
     * @property {Vec2} ZERO
     * @static
     */
    get: function get() {
      return new Vec2(0, 0);
    }
  }, {
    key: "UP",

    /**
     * !#en return a Vec2 object with x = 0 and y = 1.
     * !#zh 返回 x = 0 和 y = 1 的 Vec2 对象。
     * @property {Vec2} UP
     * @static
     */
    get: function get() {
      return new Vec2(0, 1);
    }
  }, {
    key: "RIGHT",

    /**
     * !#en return a readonly Vec2 object with x = 1 and y = 0.
     * !#zh 返回 x = 1 和 y = 0 的 Vec2 只读对象。
     * @property {Vec2} RIGHT
     * @static
     */
    get: function get() {
      return new Vec2(1, 0);
    }
  }]);

  /**
   * !#en
   * Constructor
   * see {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} or {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
   * !#zh
   * 构造函数，可查看 {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} 或者 {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
   * @method constructor
   * @param {Number} [x=0]
   * @param {Number} [y=0]
   */
  function Vec2(x, y) {
    var _this;

    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    _this = _ValueType.call(this) || this;
    _this.mag = Vec2.prototype.len;
    _this.magSqr = Vec2.prototype.lengthSqr;
    _this.subSelf = Vec2.prototype.subtract;
    _this.mulSelf = Vec2.prototype.multiplyScalar;
    _this.divSelf = Vec2.prototype.divide;
    _this.scaleSelf = Vec2.prototype.multiply;
    _this.negSelf = Vec2.prototype.negate;
    _this.x = void 0;
    _this.y = void 0;
    _this.z = 0;

    if (x && typeof x === 'object') {
      _this.y = x.y || 0;
      _this.x = x.x || 0;
    } else {
      _this.x = x || 0;
      _this.y = y || 0;
    }

    return _this;
  }
  /**
   * !#en clone a Vec2 object
   * !#zh 克隆一个 Vec2 对象
   * @method clone
   * @return {Vec2}
   */


  _proto.clone = function clone() {
    return new Vec2(this.x, this.y);
  }
  /**
   * !#en Sets vector with another's value
   * !#zh 设置向量值。
   * @method set
   * @param {Vec2} newValue - !#en new value to set. !#zh 要设置的新值
   * @return {Vec2} returns this
   * @chainable
   */
  ;

  _proto.set = function set(newValue) {
    this.x = newValue.x;
    this.y = newValue.y;
    return this;
  }
  /**
   * !#en Check whether two vector equal
   * !#zh 当前的向量是否与指定的向量相等。
   * @method equals
   * @param {Vec2} other
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other) {
    return other && this.x === other.x && this.y === other.y;
  }
  /**
   * !#en Check whether two vector equal with some degree of variance.
   * !#zh
   * 近似判断两个点是否相等。<br/>
   * 判断 2 个向量是否在指定数值的范围之内，如果在则返回 true，反之则返回 false。
   * @method fuzzyEquals
   * @param {Vec2} other
   * @param {Number} variance
   * @return {Boolean}
   */
  ;

  _proto.fuzzyEquals = function fuzzyEquals(other, variance) {
    if (this.x - variance <= other.x && other.x <= this.x + variance) {
      if (this.y - variance <= other.y && other.y <= this.y + variance) return true;
    }

    return false;
  }
  /**
   * !#en Transform to string with vector informations
   * !#zh 转换为方便阅读的字符串。
   * @method toString
   * @return {string}
   */
  ;

  _proto.toString = function toString() {
    return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ")";
  }
  /**
   * !#en Calculate linear interpolation result between this vector and another one with given ratio
   * !#zh 线性插值。
   * @method lerp
   * @param {Vec2} to
   * @param {Number} ratio - the interpolation coefficient
   * @param {Vec2} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2}
   */
  ;

  _proto.lerp = function lerp(to, ratio, out) {
    out = out || new Vec2();
    var x = this.x;
    var y = this.y;
    out.x = x + (to.x - x) * ratio;
    out.y = y + (to.y - y) * ratio;
    return out;
  }
  /**
   * !#en Clamp the vector between from float and to float.
   * !#zh
   * 返回指定限制区域后的向量。<br/>
   * 向量大于 max_inclusive 则返回 max_inclusive。<br/>
   * 向量小于 min_inclusive 则返回 min_inclusive。<br/>
   * 否则返回自身。
   * @method clampf
   * @param {Vec2} min_inclusive
   * @param {Vec2} max_inclusive
   * @return {Vec2}
   * @example
   * var min_inclusive = cc.v2(0, 0);
   * var max_inclusive = cc.v2(20, 20);
   * var v1 = cc.v2(20, 20).clampf(min_inclusive, max_inclusive); // Vec2 {x: 20, y: 20};
   * var v2 = cc.v2(0, 0).clampf(min_inclusive, max_inclusive);   // Vec2 {x: 0, y: 0};
   * var v3 = cc.v2(10, 10).clampf(min_inclusive, max_inclusive); // Vec2 {x: 10, y: 10};
   */
  ;

  _proto.clampf = function clampf(min_inclusive, max_inclusive) {
    this.x = _misc["default"].clampf(this.x, min_inclusive.x, max_inclusive.x);
    this.y = _misc["default"].clampf(this.y, min_inclusive.y, max_inclusive.y);
    return this;
  }
  /**
   * !#en Adds this vector.
   * !#zh 向量加法。
   * @method add
   * @param {Vec2} vector
   * @param {Vec2} [out]
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.add(cc.v2(5, 5));// return Vec2 {x: 15, y: 15};
   */
  ;

  _proto.add = function add(vector, out) {
    out = out || new Vec2();
    out.x = this.x + vector.x;
    out.y = this.y + vector.y;
    return out;
  }
  /**
   * !#en Adds this vector. If you want to save result to another vector, use add() instead.
   * !#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
   * @method addSelf
   * @param {Vec2} vector
   * @return {Vec2} returns this
   * @chainable
   */
  ;

  _proto.addSelf = function addSelf(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }
  /**
   * !#en Subtracts one vector from this.
   * !#zh 向量减法。
   * @method subtract
   * @param {Vec2} vector
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.subSelf(cc.v2(5, 5));// return Vec2 {x: 5, y: 5};
   */
  ;

  _proto.subtract = function subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
  /**
   * !#en Multiplies this by a number.
   * !#zh 缩放当前向量。
   * @method multiplyScalar
   * @param {number} num
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.multiply(5);// return Vec2 {x: 50, y: 50};
   */
  ;

  _proto.multiplyScalar = function multiplyScalar(num) {
    this.x *= num;
    this.y *= num;
    return this;
  }
  /**
   * !#en Multiplies two vectors.
   * !#zh 分量相乘。
   * @method multiply
   * @param {Vec2} vector
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.multiply(cc.v2(5, 5));// return Vec2 {x: 50, y: 50};
   */
  ;

  _proto.multiply = function multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    return this;
  }
  /**
   * !#en Divides by a number.
   * !#zh 向量除法。
   * @method divide
   * @param {number} num
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.divide(5); // return Vec2 {x: 2, y: 2};
   */
  ;

  _proto.divide = function divide(num) {
    this.x /= num;
    this.y /= num;
    return this;
  }
  /**
   * !#en Negates the components.
   * !#zh 向量取反。
   * @method negate
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.negate(); // return Vec2 {x: -10, y: -10};
   */
  ;

  _proto.negate = function negate() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  /**
   * !#en Dot product
   * !#zh 当前向量与指定向量进行点乘。
   * @method dot
   * @param {Vec2} [vector]
   * @return {number} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.dot(cc.v2(5, 5)); // return 100;
   */
  ;

  _proto.dot = function dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
  /**
   * !#en Cross product
   * !#zh 当前向量与指定向量进行叉乘。
   * @method cross
   * @param {Vec2} [vector]
   * @return {number} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.cross(cc.v2(5, 5)); // return 0;
   */
  ;

  _proto.cross = function cross(vector) {
    return this.x * vector.y - this.y * vector.x;
  }
  /**
   * !#en Returns the length of this vector.
   * !#zh 返回该向量的长度。
   * @method len
   * @return {number} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.len(); // return 14.142135623730951;
   */
  ;

  _proto.len = function len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * !#en Returns the squared length of this vector.
   * !#zh 返回该向量的长度平方。
   * @method lengthSqr
   * @return {number} the result
   * @example
   * var v = cc.v2(10, 10);
   * v.lengthSqr(); // return 200;
   */
  ;

  _proto.lengthSqr = function lengthSqr() {
    return this.x * this.x + this.y * this.y;
  }
  /**
   * !#en Make the length of this vector to 1.
   * !#zh 向量归一化，让这个向量的长度为 1。
   * @method normalizeSelf
   * @return {Vec2} returns this
   * @chainable
   * @example
   * var v = cc.v2(10, 10);
   * v.normalizeSelf(); // return Vec2 {x: 0.7071067811865475, y: 0.7071067811865475};
   */
  ;

  _proto.normalizeSelf = function normalizeSelf() {
    var magSqr = this.x * this.x + this.y * this.y;
    if (magSqr === 1.0) return this;

    if (magSqr === 0.0) {
      return this;
    }

    var invsqrt = 1.0 / Math.sqrt(magSqr);
    this.x *= invsqrt;
    this.y *= invsqrt;
    return this;
  }
  /**
   * !#en
   * Returns this vector with a magnitude of 1.<br/>
   * <br/>
   * Note that the current vector is unchanged and a new normalized vector is returned. If you want to normalize the current vector, use normalizeSelf function.
   * !#zh
   * 返回归一化后的向量。<br/>
   * <br/>
   * 注意，当前向量不变，并返回一个新的归一化向量。如果你想来归一化当前向量，可使用 normalizeSelf 函数。
   * @method normalize
   * @param {Vec2} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2} result
   * var v = cc.v2(10, 10);
   * v.normalize();   // return Vec2 {x: 0.7071067811865475, y: 0.7071067811865475};
   */
  ;

  _proto.normalize = function normalize(out) {
    out = out || new Vec2();
    out.x = this.x;
    out.y = this.y;
    out.normalizeSelf();
    return out;
  }
  /**
   * !#en Get angle in radian between this and vector.
   * !#zh 夹角的弧度。
   * @method angle
   * @param {Vec2} vector
   * @return {number} from 0 to Math.PI
   */
  ;

  _proto.angle = function angle(vector) {
    var magSqr1 = this.magSqr();
    var magSqr2 = vector.magSqr();

    if (magSqr1 === 0 || magSqr2 === 0) {
      console.warn("Can't get angle between zero vector");
      return 0.0;
    }

    var dot = this.dot(vector);
    var theta = dot / Math.sqrt(magSqr1 * magSqr2);
    theta = _misc["default"].clampf(theta, -1.0, 1.0);
    return Math.acos(theta);
  }
  /**
   * !#en Get angle in radian between this and vector with direction.
   * !#zh 带方向的夹角的弧度。
   * @method signAngle
   * @param {Vec2} vector
   * @return {number} from -MathPI to Math.PI
   */
  ;

  _proto.signAngle = function signAngle(vector) {
    var angle = this.angle(vector);
    return this.cross(vector) < 0 ? -angle : angle;
  }
  /**
   * !#en rotate
   * !#zh 返回旋转给定弧度后的新向量。
   * @method rotate
   * @param {number} radians
   * @param {Vec2} [out] - optional, the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @return {Vec2} the result
   */
  ;

  _proto.rotate = function rotate(radians, out) {
    out = out || new Vec2();
    out.x = this.x;
    out.y = this.y;
    return out.rotateSelf(radians);
  }
  /**
   * !#en rotate self
   * !#zh 按指定弧度旋转向量。
   * @method rotateSelf
   * @param {number} radians
   * @return {Vec2} returns this
   * @chainable
   */
  ;

  _proto.rotateSelf = function rotateSelf(radians) {
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    var x = this.x;
    this.x = cos * x - sin * this.y;
    this.y = sin * x + cos * this.y;
    return this;
  }
  /**
   * !#en Calculates the projection of the current vector over the given vector.
   * !#zh 返回当前向量在指定 vector 向量上的投影向量。
   * @method project
   * @param {Vec2} vector
   * @return {Vec2}
   * @example
   * var v1 = cc.v2(20, 20);
   * var v2 = cc.v2(5, 5);
   * v1.project(v2); // Vec2 {x: 20, y: 20};
   */
  ;

  _proto.project = function project(vector) {
    return vector.multiplyScalar(this.dot(vector) / vector.dot(vector));
  }
  /**
   * Transforms the vec2 with a mat4. 3rd vector component is implicitly '0', 4th vector component is implicitly '1'
   * @method transformMat4
   * @param {Mat4} m matrix to transform with
   * @param {Vec2} [out] the receiving vector, you can pass the same vec2 to save result to itself, if not provided, a new vec2 will be created
   * @returns {Vec2} out
   */
  ;

  _proto.transformMat4 = function transformMat4(m, out) {
    out = out || new Vec2();
    Vec2.transformMat4(out, this, m);
    return out;
  }
  /**
   * Returns the maximum value in x, y.
   * @method maxAxis
   * @returns {number}
   */
  ;

  _proto.maxAxis = function maxAxis() {
    return Math.max(this.x, this.y);
  };

  return Vec2;
}(_valueType["default"]);

exports["default"] = Vec2;
Vec2.sub = Vec2.subtract;
Vec2.mul = Vec2.multiply;
Vec2.scale = Vec2.multiplyScalar;
Vec2.mag = Vec2.len;
Vec2.squaredMagnitude = Vec2.lengthSqr;
Vec2.div = Vec2.divide;
Vec2.ONE_R = Vec2.ONE;
Vec2.ZERO_R = Vec2.ZERO;
Vec2.UP_R = Vec2.UP;
Vec2.RIGHT_R = Vec2.RIGHT;
var v2_1 = new Vec2();
var v2_2 = new Vec2();

_CCClass["default"].fastDefine('cc.Vec2', Vec2, {
  x: 0,
  y: 0
});
/**
 * @module cc
 */

/**
 * !#en The convenience method to create a new {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}} 对象。
 * @method v2
 * @param {Number|Object} [x=0]
 * @param {Number} [y=0]
 * @return {Vec2}
 * @example
 * var v1 = cc.v2();
 * var v2 = cc.v2(0, 0);
 * var v3 = cc.v2(v2);
 * var v4 = cc.v2({x: 100, y: 100});
 */


cc.v2 = function v2(x, y) {
  return new Vec2(x, y);
};

cc.Vec2 = Vec2;
module.exports = exports["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlYzIudHMiXSwibmFtZXMiOlsiX3giLCJfeSIsIlZlYzIiLCJzdWIiLCJ2ZWN0b3IiLCJvdXQiLCJzdWJ0cmFjdCIsIm11bCIsIm51bSIsIm11bHRpcGx5U2NhbGFyIiwiZGl2Iiwic2NhbGUiLCJtdWx0aXBseSIsIm5lZyIsIm5lZ2F0ZSIsImNsb25lIiwiYSIsIngiLCJ5IiwiY29weSIsInNldCIsImFkZCIsImIiLCJkaXZpZGUiLCJjZWlsIiwiTWF0aCIsImZsb29yIiwibWluIiwibWF4Iiwicm91bmQiLCJzY2FsZUFuZEFkZCIsImRpc3RhbmNlIiwic3FydCIsInNxdWFyZWREaXN0YW5jZSIsImxlbiIsImxlbmd0aFNxciIsImludmVyc2UiLCJpbnZlcnNlU2FmZSIsImFicyIsIkVQU0lMT04iLCJub3JtYWxpemUiLCJkb3QiLCJjcm9zcyIsInoiLCJsZXJwIiwidCIsInJhbmRvbSIsInIiLCJQSSIsImNvcyIsInNpbiIsInRyYW5zZm9ybU1hdDMiLCJtYXQiLCJtIiwidHJhbnNmb3JtTWF0NCIsInN0cmljdEVxdWFscyIsImVxdWFscyIsImVwc2lsb24iLCJhbmdsZSIsInYyXzEiLCJ2Ml8yIiwiY29zaW5lIiwiYWNvcyIsInRvQXJyYXkiLCJ2Iiwib2ZzIiwiZnJvbUFycmF5IiwiYXJyIiwibWFnIiwicHJvdG90eXBlIiwibWFnU3FyIiwic3ViU2VsZiIsIm11bFNlbGYiLCJkaXZTZWxmIiwic2NhbGVTZWxmIiwibmVnU2VsZiIsIm5ld1ZhbHVlIiwib3RoZXIiLCJmdXp6eUVxdWFscyIsInZhcmlhbmNlIiwidG9TdHJpbmciLCJ0b0ZpeGVkIiwidG8iLCJyYXRpbyIsImNsYW1wZiIsIm1pbl9pbmNsdXNpdmUiLCJtYXhfaW5jbHVzaXZlIiwibWlzYyIsImFkZFNlbGYiLCJub3JtYWxpemVTZWxmIiwiaW52c3FydCIsIm1hZ1NxcjEiLCJtYWdTcXIyIiwiY29uc29sZSIsIndhcm4iLCJ0aGV0YSIsInNpZ25BbmdsZSIsInJvdGF0ZSIsInJhZGlhbnMiLCJyb3RhdGVTZWxmIiwicHJvamVjdCIsIm1heEF4aXMiLCJWYWx1ZVR5cGUiLCJzcXVhcmVkTWFnbml0dWRlIiwiT05FX1IiLCJPTkUiLCJaRVJPX1IiLCJaRVJPIiwiVVBfUiIsIlVQIiwiUklHSFRfUiIsIlJJR0hUIiwiQ0NDbGFzcyIsImZhc3REZWZpbmUiLCJjYyIsInYyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOztBQUVBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsSUFBSUEsRUFBVSxHQUFHLEdBQWpCO0FBQ0EsSUFBSUMsRUFBVSxHQUFHLEdBQWpCO0FBRUE7Ozs7Ozs7O0lBUXFCQzs7Ozs7OztBQUNqQjs7QUFPQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7Ozs7Ozs7O1NBYUFDLE1BQUEsYUFBS0MsTUFBTCxFQUFtQkMsR0FBbkIsRUFBcUM7QUFDakMsV0FBT0gsSUFBSSxDQUFDSSxRQUFMLENBQWNELEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQXJCLEVBQWlDLElBQWpDLEVBQXVDRSxNQUF2QyxDQUFQO0FBQ0g7QUFDRDs7Ozs7Ozs7Ozs7OztBQVlBOzs7Ozs7Ozs7Ozs7O1NBYUFHLE1BQUEsYUFBS0MsR0FBTCxFQUFrQkgsR0FBbEIsRUFBb0M7QUFDaEMsV0FBT0gsSUFBSSxDQUFDTyxjQUFMLENBQW9CSixHQUFHLElBQUksSUFBSUgsSUFBSixFQUEzQixFQUF1QyxJQUF2QyxFQUE2Q00sR0FBN0MsQ0FBUDtBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7Ozs7Ozs7OztTQWFBRSxNQUFBLGFBQUtGLEdBQUwsRUFBa0JILEdBQWxCLEVBQW9DO0FBQ2hDLFdBQU9ILElBQUksQ0FBQ08sY0FBTCxDQUFvQkosR0FBRyxJQUFJLElBQUlILElBQUosRUFBM0IsRUFBdUMsSUFBdkMsRUFBNkMsSUFBRU0sR0FBL0MsQ0FBUDtBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7QUFZQTs7Ozs7Ozs7Ozs7OztTQWFBRyxRQUFB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Ozs7U0FLQWdHLFVBQUEsbUJBQW1CO0FBQ2YsV0FBTzVFLElBQUksQ0FBQ0csR0FBTCxDQUFTLEtBQUtYLENBQWQsRUFBaUIsS0FBS0MsQ0FBdEIsQ0FBUDtBQUNIOzs7RUEvbkM2Qm9GOzs7QUFBYnBHLEtBRVZDLE1BQVFELElBQUksQ0FBQ0k7QUFGSEosS0FHVkssTUFBUUwsSUFBSSxDQUFDVTtBQUhIVixLQUlWUyxRQUFRVCxJQUFJLENBQUNPO0FBSkhQLEtBS1ZrRSxNQUFRbEUsSUFBSSxDQUFDZ0M7QUFMSGhDLEtBTVZxRyxtQkFBbUJyRyxJQUFJLENBQUNpQztBQU5kakMsS0FPVlEsTUFBTVIsSUFBSSxDQUFDcUI7QUFQRHJCLEtBOEtEc0csUUFBUXRHLElBQUksQ0FBQ3VHO0FBOUtadkcsS0E4TER3RyxTQUFTeEcsSUFBSSxDQUFDeUc7QUE5TGJ6RyxLQThNRDBHLE9BQU8xRyxJQUFJLENBQUMyRztBQTlNWDNHLEtBOE5ENEcsVUFBVTVHLElBQUksQ0FBQzZHO0FBbzZCbkMsSUFBTXBELElBQUksR0FBRyxJQUFJekQsSUFBSixFQUFiO0FBQ0EsSUFBTTBELElBQUksR0FBRyxJQUFJMUQsSUFBSixFQUFiOztBQUVBOEcsb0JBQVFDLFVBQVIsQ0FBbUIsU0FBbkIsRUFBOEIvRyxJQUE5QixFQUFvQztBQUFFZSxFQUFBQSxDQUFDLEVBQUUsQ0FBTDtBQUFRQyxFQUFBQSxDQUFDLEVBQUU7QUFBWCxDQUFwQztBQUlBOzs7O0FBS0E7Ozs7Ozs7Ozs7Ozs7OztBQWFBZ0csRUFBRSxDQUFDQyxFQUFILEdBQVEsU0FBU0EsRUFBVCxDQUFhbEcsQ0FBYixFQUFnQkMsQ0FBaEIsRUFBbUI7QUFDdkIsU0FBTyxJQUFJaEIsSUFBSixDQUFTZSxDQUFULEVBQVlDLENBQVosQ0FBUDtBQUNILENBRkQ7O0FBSUFnRyxFQUFFLENBQUNoSCxJQUFILEdBQVVBLElBQVYiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBWYWx1ZVR5cGUgZnJvbSAnLi92YWx1ZS10eXBlJztcbmltcG9ydCBNYXQ0IGZyb20gJy4vbWF0NCc7XG5pbXBvcnQgQ0NDbGFzcyBmcm9tICcuLi9wbGF0Zm9ybS9DQ0NsYXNzJztcbmltcG9ydCBtaXNjIGZyb20gJy4uL3V0aWxzL21pc2MnO1xuaW1wb3J0IHsgRVBTSUxPTiwgcmFuZG9tIH0gZnJvbSAnLi91dGlscyc7XG5cbmxldCBfeDogbnVtYmVyID0gMC4wO1xubGV0IF95OiBudW1iZXIgPSAwLjA7XG5cbi8qKlxuICogISNlbiBSZXByZXNlbnRhdGlvbiBvZiAyRCB2ZWN0b3JzIGFuZCBwb2ludHMuXG4gKiAhI3poIOihqOekuiAyRCDlkJHph4/lkozlnZDmoIdcbiAqXG4gKiBAY2xhc3MgVmVjMlxuICogQGV4dGVuZHMgVmFsdWVUeXBlXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVjMiBleHRlbmRzIFZhbHVlVHlwZSB7XG4gICAgLy8gZGVwcmVjYXRlZFxuICAgIHN0YXRpYyBzdWIgICA9IFZlYzIuc3VidHJhY3Q7XG4gICAgc3RhdGljIG11bCAgID0gVmVjMi5tdWx0aXBseTtcbiAgICBzdGF0aWMgc2NhbGUgPSBWZWMyLm11bHRpcGx5U2NhbGFyO1xuICAgIHN0YXRpYyBtYWcgICA9IFZlYzIubGVuO1xuICAgIHN0YXRpYyBzcXVhcmVkTWFnbml0dWRlID0gVmVjMi5sZW5ndGhTcXI7XG4gICAgc3RhdGljIGRpdiA9IFZlYzIuZGl2aWRlO1xuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoaXMgdmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue6K+l5ZCR6YeP55qE6ZW/5bqm44CCXG4gICAgICogQG1ldGhvZCBtYWdcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSByZXN1bHRcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjIoMTAsIDEwKTtcbiAgICAgKiB2Lm1hZygpOyAvLyByZXR1cm4gMTQuMTQyMTM1NjIzNzMwOTUxO1xuICAgICAqL1xuICAgIG1hZyAgPSBWZWMyLnByb3RvdHlwZS5sZW47XG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiB0aGlzIHZlY3Rvci5cbiAgICAgKiAhI3poIOi/lOWbnuivpeWQkemHj+eahOmVv+W6puW5s+aWueOAglxuICAgICAqIEBtZXRob2QgbWFnU3FyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgcmVzdWx0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5tYWdTcXIoKTsgLy8gcmV0dXJuIDIwMDtcbiAgICAgKi9cbiAgICBtYWdTcXIgPSBWZWMyLnByb3RvdHlwZS5sZW5ndGhTcXI7XG4gICAgLyoqXG4gICAgICogISNlbiBTdWJ0cmFjdHMgb25lIHZlY3RvciBmcm9tIHRoaXMuIElmIHlvdSB3YW50IHRvIHNhdmUgcmVzdWx0IHRvIGFub3RoZXIgdmVjdG9yLCB1c2Ugc3ViKCkgaW5zdGVhZC5cbiAgICAgKiAhI3poIOWQkemHj+WHj+azleOAguWmguaenOS9oOaDs+S/neWtmOe7k+aenOWIsOWPpuS4gOS4quWQkemHj++8jOWPr+S9v+eUqCBzdWIoKSDku6Pmm7/jgIJcbiAgICAgKiBAbWV0aG9kIHN1YlNlbGZcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjIoMTAsIDEwKTtcbiAgICAgKiB2LnN1YlNlbGYoY2MudjIoNSwgNSkpOy8vIHJldHVybiBWZWMyIHt4OiA1LCB5OiA1fTtcbiAgICAgKi9cbiAgICBzdWJTZWxmICA9IFZlYzIucHJvdG90eXBlLnN1YnRyYWN0O1xuICAgIC8qKlxuICAgICAqICEjZW4gU3VidHJhY3RzIG9uZSB2ZWN0b3IgZnJvbSB0aGlzLCBhbmQgcmV0dXJucyB0aGUgbmV3IHJlc3VsdC5cbiAgICAgKiAhI3poIOWQkemHj+WHj+azle+8jOW5tui/lOWbnuaWsOe7k+aenOOAglxuICAgICAqIEBtZXRob2Qgc3ViXG4gICAgICogQHBhcmFtIHtWZWMyfSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjMiB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjMiB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSB0aGUgcmVzdWx0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5zdWIoY2MudjIoNSwgNSkpOyAgICAgIC8vIHJldHVybiBWZWMyIHt4OiA1LCB5OiA1fTtcbiAgICAgKiB2YXIgdjE7XG4gICAgICogdi5zdWIoY2MudjIoNSwgNSksIHYxKTsgIC8vIHJldHVybiBWZWMyIHt4OiA1LCB5OiA1fTtcbiAgICAgKi9cbiAgICBzdWIgKHZlY3RvcjogVmVjMiwgb3V0PzogVmVjMik6IFZlYzIge1xuICAgICAgICByZXR1cm4gVmVjMi5zdWJ0cmFjdChvdXQgfHwgbmV3IFZlYzIoKSwgdGhpcywgdmVjdG9yKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIHRoaXMgYnkgYSBudW1iZXIuIElmIHlvdSB3YW50IHRvIHNhdmUgcmVzdWx0IHRvIGFub3RoZXIgdmVjdG9yLCB1c2UgbXVsKCkgaW5zdGVhZC5cbiAgICAgKiAhI3poIOe8qeaUvuW9k+WJjeWQkemHj+OAguWmguaenOS9oOaDs+e7k+aenOS/neWtmOWIsOWPpuS4gOS4quWQkemHj++8jOWPr+S9v+eUqCBtdWwoKSDku6Pmm7/jgIJcbiAgICAgKiBAbWV0aG9kIG11bFNlbGZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gICAgICogQHJldHVybiB7VmVjMn0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYubXVsU2VsZig1KTsvLyByZXR1cm4gVmVjMiB7eDogNTAsIHk6IDUwfTtcbiAgICAgKi9cbiAgICBtdWxTZWxmICA9IFZlYzIucHJvdG90eXBlLm11bHRpcGx5U2NhbGFyO1xuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyBieSBhIG51bWJlciwgYW5kIHJldHVybnMgdGhlIG5ldyByZXN1bHQuXG4gICAgICogISN6aCDnvKnmlL7lkJHph4/vvIzlubbov5Tlm57mlrDnu5PmnpzjgIJcbiAgICAgKiBAbWV0aG9kIG11bFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjMiB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjMiB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSB0aGUgcmVzdWx0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5tdWwoNSk7ICAgICAgLy8gcmV0dXJuIFZlYzIge3g6IDUwLCB5OiA1MH07XG4gICAgICogdmFyIHYxO1xuICAgICAqIHYubXVsKDUsIHYxKTsgIC8vIHJldHVybiBWZWMyIHt4OiA1MCwgeTogNTB9O1xuICAgICAqL1xuICAgIG11bCAobnVtOiBudW1iZXIsIG91dD86IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIFZlYzIubXVsdGlwbHlTY2FsYXIob3V0IHx8IG5ldyBWZWMyKCksIHRoaXMsIG51bSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gRGl2aWRlcyBieSBhIG51bWJlci4gSWYgeW91IHdhbnQgdG8gc2F2ZSByZXN1bHQgdG8gYW5vdGhlciB2ZWN0b3IsIHVzZSBkaXYoKSBpbnN0ZWFkLlxuICAgICAqICEjemgg5ZCR6YeP6Zmk5rOV44CC5aaC5p6c5L2g5oOz57uT5p6c5L+d5a2Y5Yiw5Y+m5LiA5Liq5ZCR6YeP77yM5Y+v5L2/55SoIGRpdigpIOS7o+abv+OAglxuICAgICAqIEBtZXRob2QgZGl2U2VsZlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5kaXZTZWxmKDUpOyAvLyByZXR1cm4gVmVjMiB7eDogMiwgeTogMn07XG4gICAgICovXG4gICAgZGl2U2VsZiAgPSBWZWMyLnByb3RvdHlwZS5kaXZpZGU7XG4gICAgLyoqXG4gICAgICogISNlbiBEaXZpZGVzIGJ5IGEgbnVtYmVyLCBhbmQgcmV0dXJucyB0aGUgbmV3IHJlc3VsdC5cbiAgICAgKiAhI3poIOWQkemHj+mZpOazle+8jOW5tui/lOWbnuaWsOeahOe7k+aenOOAglxuICAgICAqIEBtZXRob2QgZGl2XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICAgICAqIEBwYXJhbSB7VmVjMn0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMyIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMyIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHRoZSByZXN1bHRcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjIoMTAsIDEwKTtcbiAgICAgKiB2LmRpdig1KTsgICAgICAvLyByZXR1cm4gVmVjMiB7eDogMiwgeTogMn07XG4gICAgICogdmFyIHYxO1xuICAgICAqIHYuZGl2KDUsIHYxKTsgIC8vIHJldHVybiBWZWMyIHt4OiAyLCB5OiAyfTtcbiAgICAgKi9cbiAgICBkaXYgKG51bTogbnVtYmVyLCBvdXQ/OiBWZWMyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiBWZWMyLm11bHRpcGx5U2NhbGFyKG91dCB8fCBuZXcgVmVjMigpLCB0aGlzLCAxL251bSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyB0d28gdmVjdG9ycy5cbiAgICAgKiAhI3poIOWIhumHj+ebuOS5mOOAglxuICAgICAqIEBtZXRob2Qgc2NhbGVTZWxmXG4gICAgICogQHBhcmFtIHtWZWMyfSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5zY2FsZVNlbGYoY2MudjIoNSwgNSkpOy8vIHJldHVybiBWZWMyIHt4OiA1MCwgeTogNTB9O1xuICAgICAqL1xuICAgIHNjYWxlU2VsZiA9IFZlYzIucHJvdG90eXBlLm11bHRpcGx5O1xuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyB0d28gdmVjdG9ycywgYW5kIHJldHVybnMgdGhlIG5ldyByZXN1bHQuXG4gICAgICogISN6aCDliIbph4/nm7jkuZjvvIzlubbov5Tlm57mlrDnmoTnu5PmnpzjgIJcbiAgICAgKiBAbWV0aG9kIHNjYWxlXG4gICAgICogQHBhcmFtIHtWZWMyfSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjMiB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjMiB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSB0aGUgcmVzdWx0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5zY2FsZShjYy52Mig1LCA1KSk7ICAgICAgLy8gcmV0dXJuIFZlYzIge3g6IDUwLCB5OiA1MH07XG4gICAgICogdmFyIHYxO1xuICAgICAqIHYuc2NhbGUoY2MudjIoNSwgNSksIHYxKTsgIC8vIHJldHVybiBWZWMyIHt4OiA1MCwgeTogNTB9O1xuICAgICAqL1xuICAgIHNjYWxlICh2ZWN0b3I6IFZlYzIsIG91dD86IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIFZlYzIubXVsdGlwbHkob3V0IHx8IG5ldyBWZWMyKCksIHRoaXMsIHZlY3Rvcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICEjZW4gTmVnYXRlcyB0aGUgY29tcG9uZW50cy4gSWYgeW91IHdhbnQgdG8gc2F2ZSByZXN1bHQgdG8gYW5vdGhlciB2ZWN0b3IsIHVzZSBuZWcoKSBpbnN0ZWFkLlxuICAgICAqICEjemgg5ZCR6YeP5Y+W5Y+N44CC5aaC5p6c5L2g5oOz57uT5p6c5L+d5a2Y5Yiw5Y+m5LiA5Liq5ZCR6YeP77yM5Y+v5L2/55SoIG5lZygpIOS7o+abv+OAglxuICAgICAqIEBtZXRob2QgbmVnU2VsZlxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjIoMTAsIDEwKTtcbiAgICAgKiB2Lm5lZ1NlbGYoKTsgLy8gcmV0dXJuIFZlYzIge3g6IC0xMCwgeTogLTEwfTtcbiAgICAgKi9cbiAgICBuZWdTZWxmID0gVmVjMi5wcm90b3R5cGUubmVnYXRlO1xuICAgIC8qKlxuICAgICAqICEjZW4gTmVnYXRlcyB0aGUgY29tcG9uZW50cywgYW5kIHJldHVybnMgdGhlIG5ldyByZXN1bHQuXG4gICAgICogISN6aCDov5Tlm57lj5blj43lkI7nmoTmlrDlkJHph4/jgIJcbiAgICAgKiBAbWV0aG9kIG5lZ1xuICAgICAqIEBwYXJhbSB7VmVjMn0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMyIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMyIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHRoZSByZXN1bHRcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjIoMTAsIDEwKTtcbiAgICAgKiB2YXIgdjE7XG4gICAgICogdi5uZWcodjEpOyAgLy8gcmV0dXJuIFZlYzIge3g6IC0xMCwgeTogLTEwfTtcbiAgICAgKi9cbiAgICBuZWcgKG91dD86IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIFZlYzIubmVnYXRlKG91dCB8fCBuZXcgVmVjMigpLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIHJldHVybiBhIFZlYzIgb2JqZWN0IHdpdGggeCA9IDEgYW5kIHkgPSAxLlxuICAgICAqICEjemgg5pawIFZlYzIg5a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IE9ORVxuICAgICAqIEB0eXBlIFZlYzJcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBPTkUgKCkgeyByZXR1cm4gbmV3IFZlYzIoMSwgMSkgfTtcbiAgICBzdGF0aWMgcmVhZG9ubHkgT05FX1IgPSBWZWMyLk9ORTtcblxuICAgIC8qKlxuICAgICAqICEjZW4gcmV0dXJuIGEgVmVjMiBvYmplY3Qgd2l0aCB4ID0gMCBhbmQgeSA9IDAuXG4gICAgICogISN6aCDov5Tlm54geCA9IDAg5ZKMIHkgPSAwIOeahCBWZWMyIOWvueixoeOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gWkVST1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IFpFUk8gKCkgeyByZXR1cm4gbmV3IFZlYzIoMCwgMCkgfTtcbiAgICAvKipcbiAgICAgKiAhI2VuIHJldHVybiBhIHJlYWRvbmx5IFZlYzIgb2JqZWN0IHdpdGggeCA9IDAgYW5kIHkgPSAwLlxuICAgICAqICEjemgg6L+U5Zue5LiA5LiqIHggPSAwIOWSjCB5ID0gMCDnmoQgVmVjMiDlj6ror7vlr7nosaHjgIJcbiAgICAgKiBAcHJvcGVydHkge1ZlYzJ9IFpFUk9fUlxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcmVhZG9ubHkgWkVST19SID0gVmVjMi5aRVJPO1xuXG4gICAgLyoqXG4gICAgICogISNlbiByZXR1cm4gYSBWZWMyIG9iamVjdCB3aXRoIHggPSAwIGFuZCB5ID0gMS5cbiAgICAgKiAhI3poIOi/lOWbniB4ID0gMCDlkowgeSA9IDEg55qEIFZlYzIg5a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMyfSBVUFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IFVQICgpIHsgcmV0dXJuIG5ldyBWZWMyKDAsIDEpIH07XG4gICAgLyoqXG4gICAgICogISNlbiByZXR1cm4gYSByZWFkb25seSBWZWMyIG9iamVjdCB3aXRoIHggPSAwIGFuZCB5ID0gMS5cbiAgICAgKiAhI3poIOi/lOWbniB4ID0gMCDlkowgeSA9IDEg55qEIFZlYzIg5Y+q6K+75a+56LGh44CCXG4gICAgICogQHByb3BlcnR5IHtWZWMyfSBVUF9SXG4gICAgICogQHN0YXRpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHN0YXRpYyByZWFkb25seSBVUF9SID0gVmVjMi5VUDtcblxuICAgIC8qKlxuICAgICAqICEjZW4gcmV0dXJuIGEgcmVhZG9ubHkgVmVjMiBvYmplY3Qgd2l0aCB4ID0gMSBhbmQgeSA9IDAuXG4gICAgICogISN6aCDov5Tlm54geCA9IDEg5ZKMIHkgPSAwIOeahCBWZWMyIOWPquivu+WvueixoeOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gUklHSFRcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldCBSSUdIVCAoKSB7IHJldHVybiBuZXcgVmVjMigxLCAwKSB9O1xuICAgIC8qKlxuICAgICAqICEjZW4gcmV0dXJuIGEgVmVjMiBvYmplY3Qgd2l0aCB4ID0gMSBhbmQgeSA9IDAuXG4gICAgICogISN6aCDov5Tlm54geCA9IDEg5ZKMIHkgPSAwIOeahCBWZWMyIOWvueixoeOAglxuICAgICAqIEBwcm9wZXJ0eSB7VmVjMn0gUklHSFRfUlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICBzdGF0aWMgcmVhZG9ubHkgUklHSFRfUiA9IFZlYzIuUklHSFQ7XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiOt+W+l+aMh+WumuWQkemHj+eahOaLt+i0nVxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGNsb25lIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBjbG9uZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjMihhLngsIGEueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlpI3liLbmjIflrprlkJHph4/nmoTlgLxcbiAgICAgKiBAbWV0aG9kIGNvcHlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGNvcHkgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBjb3B5IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gYS54O1xuICAgICAgICBvdXQueSA9IGEueTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poICDorr7nva7lkJHph4/lgLxcbiAgICAgKiBAbWV0aG9kIHNldFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc2V0IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgeDogbnVtYmVyLCB5OiBudW1iZXIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzZXQgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICBvdXQueCA9IHg7XG4gICAgICAgIG91dC55ID0geTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WKoOazlVxuICAgICAqIEBtZXRob2QgYWRkXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBhZGQgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGFkZCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gYS54ICsgYi54O1xuICAgICAgICBvdXQueSA9IGEueSArIGIueTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WHj+azlVxuICAgICAqIEBtZXRob2Qgc3VidHJhY3RcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN1YnRyYWN0IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzdWJ0cmFjdCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gYS54IC0gYi54O1xuICAgICAgICBvdXQueSA9IGEueSAtIGIueTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+S5mOazlVxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG11bHRpcGx5IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtdWx0aXBseSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gYS54ICogYi54O1xuICAgICAgICBvdXQueSA9IGEueSAqIGIueTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+mZpOazlVxuICAgICAqIEBtZXRob2QgZGl2aWRlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBkaXZpZGUgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGRpdmlkZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gYS54IC8gYi54O1xuICAgICAgICBvdXQueSA9IGEueSAvIGIueTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WQkeS4iuWPluaVtFxuICAgICAqIEBtZXRob2QgY2VpbFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY2VpbCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNlaWwgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLmNlaWwoYS54KTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLmNlaWwoYS55KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WQkeS4i+WPluaVtFxuICAgICAqIEBtZXRob2QgZmxvb3JcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZsb29yIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZmxvb3IgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLmZsb29yKGEueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5mbG9vcihhLnkpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5pyA5bCP5YC8XG4gICAgICogQG1ldGhvZCBtaW5cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG1pbiA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbWluIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLm1pbihhLngsIGIueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5taW4oYS55LCBiLnkpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIFxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5pyA5aSn5YC8XG4gICAgICogQG1ldGhvZCBtYXhcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG1heCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbWF4IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLm1heChhLngsIGIueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5tYXgoYS55LCBiLnkpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Zub6IiN5LqU5YWl5Y+W5pW0XG4gICAgICogQG1ldGhvZCByb3VuZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcm91bmQgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3VuZCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IE1hdGgucm91bmQoYS54KTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLnJvdW5kKGEueSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/moIfph4/kuZjms5VcbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5U2NhbGFyXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBtdWx0aXBseVNjYWxhciA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogbnVtYmVyKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbXVsdGlwbHlTY2FsYXIgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcikge1xuICAgICAgICBvdXQueCA9IGEueCAqIGI7XG4gICAgICAgIG91dC55ID0gYS55ICogYjtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+S5mOWKoDogQSArIEIgKiBzY2FsZVxuICAgICAqIEBtZXRob2Qgc2NhbGVBbmRBZGRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHNjYWxlQW5kQWRkIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHNjYWxlOiBudW1iZXIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzY2FsZUFuZEFkZCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCBzY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIG91dC54ID0gYS54ICsgKGIueCAqIHNjYWxlKTtcbiAgICAgICAgb3V0LnkgPSBhLnkgKyAoYi55ICogc2NhbGUpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5Lik5ZCR6YeP55qE5qyn5rCP6Led56a7XG4gICAgICogQG1ldGhvZCBkaXN0YW5jZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZGlzdGFuY2UgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZGlzdGFuY2UgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIF94ID0gYi54IC0gYS54O1xuICAgICAgICBfeSA9IGIueSAtIGEueTtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChfeCAqIF94ICsgX3kgKiBfeSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmsYLkuKTlkJHph4/nmoTmrKfmsI/ot53nprvlubPmlrlcbiAgICAgKiBAbWV0aG9kIHNxdWFyZWREaXN0YW5jZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3F1YXJlZERpc3RhbmNlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHNxdWFyZWREaXN0YW5jZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgX3ggPSBiLnggLSBhLng7XG4gICAgICAgIF95ID0gYi55IC0gYS55O1xuICAgICAgICByZXR1cm4gX3ggKiBfeCArIF95ICogX3k7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmsYLlkJHph4/plb/luqZcbiAgICAgKiBAbWV0aG9kIGxlblxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbGVuIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBsZW4gPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoX3ggKiBfeCArIF95ICogX3kpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5ZCR6YeP6ZW/5bqm5bmz5pa5XG4gICAgICogQG1ldGhvZCBsZW5ndGhTcXJcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGxlbmd0aFNxciA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbGVuZ3RoU3FyIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQpIHtcbiAgICAgICAgX3ggPSBhLng7XG4gICAgICAgIF95ID0gYS55O1xuICAgICAgICByZXR1cm4gX3ggKiBfeCArIF95ICogX3k7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lj5botJ9cbiAgICAgKiBAbWV0aG9kIG5lZ2F0ZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbmVnYXRlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbmVnYXRlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gLWEueDtcbiAgICAgICAgb3V0LnkgPSAtYS55O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W5YCS5pWw77yM5o6l6L+RIDAg5pe26L+U5ZueIEluZmluaXR5XG4gICAgICogQG1ldGhvZCBpbnZlcnNlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBpbnZlcnNlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgaW52ZXJzZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IDEuMCAvIGEueDtcbiAgICAgICAgb3V0LnkgPSAxLjAgLyBhLnk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lj5blgJLmlbDvvIzmjqXov5EgMCDml7bov5Tlm54gMFxuICAgICAqIEBtZXRob2QgaW52ZXJzZVNhZmVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGludmVyc2VTYWZlIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgaW52ZXJzZVNhZmUgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgX3ggPSBhLng7XG4gICAgICAgIF95ID0gYS55O1xuXG4gICAgICAgIGlmIChNYXRoLmFicyhfeCkgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICBvdXQueCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQueCA9IDEuMCAvIF94O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKF95KSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIG91dC55ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dC55ID0gMS4wIC8gX3k7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5b2S5LiA5YyW5ZCR6YePXG4gICAgICogQG1ldGhvZCBub3JtYWxpemVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG5vcm1hbGl6ZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlLCBWZWMyTGlrZSBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBWZWMyTGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG5vcm1hbGl6ZSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlLCBWZWMyTGlrZSBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhOiBWZWMyTGlrZSkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIGxldCBsZW4gPSBfeCAqIF94ICsgX3kgKiBfeTtcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICAgICAgICAgIG91dC54ID0gX3ggKiBsZW47XG4gICAgICAgICAgICBvdXQueSA9IF95ICogbGVuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/ngrnnp6/vvIjmlbDph4/np6/vvIlcbiAgICAgKiBAbWV0aG9kIGRvdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZG90IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGRvdCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+WPieenr++8iOWQkemHj+enr++8ie+8jOazqOaEj+S6jOe7tOWQkemHj+eahOWPieenr+S4uuS4jiBaIOi9tOW5s+ihjOeahOS4iee7tOWQkemHj1xuICAgICAqIEBtZXRob2QgY3Jvc3NcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGNyb3NzIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IFZlYzIsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY3Jvc3MgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogVmVjMiwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBvdXQueSA9IDA7XG4gICAgICAgIG91dC56ID0gYS54ICogYi55IC0gYS55ICogYi54O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP57q/5oCn5o+S5YC877yaIEEgKyB0ICogKEIgLSBBKVxuICAgICAqIEBtZXRob2QgbGVycFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbGVycCA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCB0OiBudW1iZXIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBsZXJwIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHQ6IG51bWJlcikge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIG91dC54ID0gX3ggKyB0ICogKGIueCAtIF94KTtcbiAgICAgICAgb3V0LnkgPSBfeSArIHQgKiAoYi55IC0gX3kpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg55Sf5oiQ5LiA5Liq5Zyo5Y2V5L2N5ZyG5LiK5Z2H5YyA5YiG5biD55qE6ZqP5py65ZCR6YePXG4gICAgICogQG1ldGhvZCByYW5kb21cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJhbmRvbSA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAob3V0OiBPdXQsIHNjYWxlPzogbnVtYmVyKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcmFuZG9tIDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgc2NhbGU/OiBudW1iZXIpIHtcbiAgICAgICAgc2NhbGUgPSBzY2FsZSB8fCAxLjA7XG4gICAgICAgIGNvbnN0IHIgPSByYW5kb20oKSAqIDIuMCAqIE1hdGguUEk7XG4gICAgICAgIG91dC54ID0gTWF0aC5jb3MocikgKiBzY2FsZTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLnNpbihyKSAqIHNjYWxlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP5LiO5LiJ57u055+p6Zi15LmY5rOV77yM6buY6K6k5ZCR6YeP56ys5LiJ5L2N5Li6IDHjgIJcbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybU1hdDNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRyYW5zZm9ybU1hdDMgPE91dCBleHRlbmRzIElWZWMyTGlrZSwgTWF0TGlrZSBleHRlbmRzIElNYXQzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG1hdDogSU1hdDNMaWtlKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgdHJhbnNmb3JtTWF0MyA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlLCBNYXRMaWtlIGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgbWF0OiBNYXRMaWtlKSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgb3V0LnggPSBtWzBdICogX3ggKyBtWzNdICogX3kgKyBtWzZdO1xuICAgICAgICBvdXQueSA9IG1bMV0gKiBfeCArIG1bNF0gKiBfeSArIG1bN107XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/kuI7lm5vnu7Tnn6npmLXkuZjms5XvvIzpu5jorqTlkJHph4/nrKzkuInkvY3kuLogMO+8jOesrOWbm+S9jeS4uiAx44CCXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1NYXQ0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiB0cmFuc2Zvcm1NYXQ0IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBtYXQ6IE1hdExpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0cmFuc2Zvcm1NYXQ0IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBtYXQ6IE1hdExpa2UpIHtcbiAgICAgICAgX3ggPSBhLng7XG4gICAgICAgIF95ID0gYS55O1xuICAgICAgICBsZXQgbSA9IG1hdC5tO1xuICAgICAgICBvdXQueCA9IG1bMF0gKiBfeCArIG1bNF0gKiBfeSArIG1bMTJdO1xuICAgICAgICBvdXQueSA9IG1bMV0gKiBfeCArIG1bNV0gKiBfeSArIG1bMTNdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP562J5Lu35Yik5patXG4gICAgICogQG1ldGhvZCBzdHJpY3RFcXVhbHNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0cmljdEVxdWFscyA8T3V0IGV4dGVuZHMgSVZlYzJMaWtlPiAoYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzdHJpY3RFcXVhbHMgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaOkumZpOa1rueCueaVsOivr+W3rueahOWQkemHj+i/keS8vOetieS7t+WIpOaWrVxuICAgICAqIEBtZXRob2QgZXF1YWxzXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBlcXVhbHMgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCwgYjogT3V0LCAgZXBzaWxvbiA9IEVQU0lMT04pXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBlcXVhbHMgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCwgYjogT3V0LCAgZXBzaWxvbiA9IEVQU0lMT04pIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIE1hdGguYWJzKGEueCAtIGIueCkgPD1cbiAgICAgICAgICAgIGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGEueCksIE1hdGguYWJzKGIueCkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhLnkgLSBiLnkpIDw9XG4gICAgICAgICAgICBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLnkpLCBNYXRoLmFicyhiLnkpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5o6S6Zmk5rWu54K55pWw6K+v5beu55qE5ZCR6YeP6L+R5Ly8562J5Lu35Yik5patXG4gICAgICogQG1ldGhvZCBhbmdsZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogYW5nbGUgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgYW5nbGUgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIFZlYzIubm9ybWFsaXplKHYyXzEsIGEpO1xuICAgICAgICBWZWMyLm5vcm1hbGl6ZSh2Ml8yLCBiKTtcbiAgICAgICAgY29uc3QgY29zaW5lID0gVmVjMi5kb3QodjJfMSwgdjJfMik7XG4gICAgICAgIGlmIChjb3NpbmUgPiAxLjApIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb3NpbmUgPCAtMS4wKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5QSTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5hY29zKGNvc2luZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/ovazmlbDnu4RcbiAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIHY6IElWZWMyTGlrZSwgb2ZzID0gMClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIHY6IElWZWMyTGlrZSwgb2ZzID0gMCkge1xuICAgICAgICBvdXRbb2ZzICsgMF0gPSB2Lng7XG4gICAgICAgIG91dFtvZnMgKyAxXSA9IHYueTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaVsOe7hOi9rOWQkemHj1xuICAgICAqIEBtZXRob2QgZnJvbUFycmF5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tQXJyYXkgPE91dCBleHRlbmRzIElWZWMyTGlrZT4gKG91dDogT3V0LCBhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvZnMgPSAwKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUFycmF5IDxPdXQgZXh0ZW5kcyBJVmVjMkxpa2U+IChvdXQ6IE91dCwgYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb2ZzID0gMCkge1xuICAgICAgICBvdXQueCA9IGFycltvZnMgKyAwXTtcbiAgICAgICAgb3V0LnkgPSBhcnJbb2ZzICsgMV07XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHhcbiAgICAgKi9cbiAgICB4OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0geVxuICAgICAqL1xuICAgIHk6IG51bWJlcjtcblxuICAgIC8vIGNvbXBhdGlibGUgd2l0aCB2ZWMzXG4gICAgejogbnVtYmVyID0gMDtcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqIHNlZSB7eyNjcm9zc0xpbmsgXCJjYy92ZWMyOm1ldGhvZFwifX1jYy52Mnt7L2Nyb3NzTGlua319IG9yIHt7I2Nyb3NzTGluayBcImNjL3A6bWV0aG9kXCJ9fWNjLnB7ey9jcm9zc0xpbmt9fVxuICAgICAqICEjemhcbiAgICAgKiDmnoTpgKDlh73mlbDvvIzlj6/mn6XnnIsge3sjY3Jvc3NMaW5rIFwiY2MvdmVjMjptZXRob2RcIn19Y2MudjJ7ey9jcm9zc0xpbmt9fSDmiJbogIUge3sjY3Jvc3NMaW5rIFwiY2MvcDptZXRob2RcIn19Y2MucHt7L2Nyb3NzTGlua319XG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeD0wXVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeT0wXVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICh4OiBudW1iZXIgfCBWZWMyID0gMCwgeTogbnVtYmVyID0gMCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIGlmICh4ICYmIHR5cGVvZiB4ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy55ID0geC55IHx8IDA7XG4gICAgICAgICAgICB0aGlzLnggPSB4LnggfHwgMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHggYXMgbnVtYmVyIHx8IDA7XG4gICAgICAgICAgICB0aGlzLnkgPSB5IHx8IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIGNsb25lIGEgVmVjMiBvYmplY3RcbiAgICAgKiAhI3poIOWFi+mahuS4gOS4qiBWZWMyIOWvueixoVxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAcmV0dXJuIHtWZWMyfVxuICAgICAqL1xuICAgIGNsb25lICgpOiBWZWMyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMyKHRoaXMueCwgdGhpcy55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdmVjdG9yIHdpdGggYW5vdGhlcidzIHZhbHVlXG4gICAgICogISN6aCDorr7nva7lkJHph4/lgLzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFxuICAgICAqIEBwYXJhbSB7VmVjMn0gbmV3VmFsdWUgLSAhI2VuIG5ldyB2YWx1ZSB0byBzZXQuICEjemgg6KaB6K6+572u55qE5paw5YC8XG4gICAgICogQHJldHVybiB7VmVjMn0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIHNldCAobmV3VmFsdWU6IFZlYzIpOiB0aGlzIHtcbiAgICAgICAgdGhpcy54ID0gbmV3VmFsdWUueDtcbiAgICAgICAgdGhpcy55ID0gbmV3VmFsdWUueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVjayB3aGV0aGVyIHR3byB2ZWN0b3IgZXF1YWxcbiAgICAgKiAhI3poIOW9k+WJjeeahOWQkemHj+aYr+WQpuS4juaMh+WumueahOWQkemHj+ebuOetieOAglxuICAgICAqIEBtZXRob2QgZXF1YWxzXG4gICAgICogQHBhcmFtIHtWZWMyfSBvdGhlclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZXF1YWxzIChvdGhlcjogVmVjMik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gb3RoZXIgJiYgdGhpcy54ID09PSBvdGhlci54ICYmIHRoaXMueSA9PT0gb3RoZXIueTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgdHdvIHZlY3RvciBlcXVhbCB3aXRoIHNvbWUgZGVncmVlIG9mIHZhcmlhbmNlLlxuICAgICAqICEjemhcbiAgICAgKiDov5HkvLzliKTmlq3kuKTkuKrngrnmmK/lkKbnm7jnrYnjgII8YnIvPlxuICAgICAqIOWIpOaWrSAyIOS4quWQkemHj+aYr+WQpuWcqOaMh+WumuaVsOWAvOeahOiMg+WbtOS5i+WGhe+8jOWmguaenOWcqOWImei/lOWbniB0cnVl77yM5Y+N5LmL5YiZ6L+U5ZueIGZhbHNl44CCXG4gICAgICogQG1ldGhvZCBmdXp6eUVxdWFsc1xuICAgICAqIEBwYXJhbSB7VmVjMn0gb3RoZXJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdmFyaWFuY2VcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGZ1enp5RXF1YWxzIChvdGhlcjogVmVjMiwgdmFyaWFuY2UpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKHRoaXMueCAtIHZhcmlhbmNlIDw9IG90aGVyLnggJiYgb3RoZXIueCA8PSB0aGlzLnggKyB2YXJpYW5jZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMueSAtIHZhcmlhbmNlIDw9IG90aGVyLnkgJiYgb3RoZXIueSA8PSB0aGlzLnkgKyB2YXJpYW5jZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBUcmFuc2Zvcm0gdG8gc3RyaW5nIHdpdGggdmVjdG9yIGluZm9ybWF0aW9uc1xuICAgICAqICEjemgg6L2s5o2i5Li65pa55L6/6ZiF6K+755qE5a2X56ym5Liy44CCXG4gICAgICogQG1ldGhvZCB0b1N0cmluZ1xuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICB0b1N0cmluZyAoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwiKFwiICtcbiAgICAgICAgICAgIHRoaXMueC50b0ZpeGVkKDIpICsgXCIsIFwiICtcbiAgICAgICAgICAgIHRoaXMueS50b0ZpeGVkKDIpICsgXCIpXCJcbiAgICAgICAgICAgIDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENhbGN1bGF0ZSBsaW5lYXIgaW50ZXJwb2xhdGlvbiByZXN1bHQgYmV0d2VlbiB0aGlzIHZlY3RvciBhbmQgYW5vdGhlciBvbmUgd2l0aCBnaXZlbiByYXRpb1xuICAgICAqICEjemgg57q/5oCn5o+S5YC844CCXG4gICAgICogQG1ldGhvZCBsZXJwXG4gICAgICogQHBhcmFtIHtWZWMyfSB0b1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYXRpbyAtIHRoZSBpbnRlcnBvbGF0aW9uIGNvZWZmaWNpZW50XG4gICAgICogQHBhcmFtIHtWZWMyfSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzIgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzIgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKi9cbiAgICBsZXJwICh0bzogVmVjMiwgcmF0aW86IG51bWJlciwgb3V0PzogVmVjMik6IFZlYzIge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzIoKTtcbiAgICAgICAgdmFyIHggPSB0aGlzLng7XG4gICAgICAgIHZhciB5ID0gdGhpcy55O1xuICAgICAgICBvdXQueCA9IHggKyAodG8ueCAtIHgpICogcmF0aW87XG4gICAgICAgIG91dC55ID0geSArICh0by55IC0geSkgKiByYXRpbztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENsYW1wIHRoZSB2ZWN0b3IgYmV0d2VlbiBmcm9tIGZsb2F0IGFuZCB0byBmbG9hdC5cbiAgICAgKiAhI3poXG4gICAgICog6L+U5Zue5oyH5a6a6ZmQ5Yi25Yy65Z+f5ZCO55qE5ZCR6YeP44CCPGJyLz5cbiAgICAgKiDlkJHph4/lpKfkuo4gbWF4X2luY2x1c2l2ZSDliJnov5Tlm54gbWF4X2luY2x1c2l2ZeOAgjxici8+XG4gICAgICog5ZCR6YeP5bCP5LqOIG1pbl9pbmNsdXNpdmUg5YiZ6L+U5ZueIG1pbl9pbmNsdXNpdmXjgII8YnIvPlxuICAgICAqIOWQpuWImei/lOWbnuiHqui6q+OAglxuICAgICAqIEBtZXRob2QgY2xhbXBmXG4gICAgICogQHBhcmFtIHtWZWMyfSBtaW5faW5jbHVzaXZlXG4gICAgICogQHBhcmFtIHtWZWMyfSBtYXhfaW5jbHVzaXZlXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBtaW5faW5jbHVzaXZlID0gY2MudjIoMCwgMCk7XG4gICAgICogdmFyIG1heF9pbmNsdXNpdmUgPSBjYy52MigyMCwgMjApO1xuICAgICAqIHZhciB2MSA9IGNjLnYyKDIwLCAyMCkuY2xhbXBmKG1pbl9pbmNsdXNpdmUsIG1heF9pbmNsdXNpdmUpOyAvLyBWZWMyIHt4OiAyMCwgeTogMjB9O1xuICAgICAqIHZhciB2MiA9IGNjLnYyKDAsIDApLmNsYW1wZihtaW5faW5jbHVzaXZlLCBtYXhfaW5jbHVzaXZlKTsgICAvLyBWZWMyIHt4OiAwLCB5OiAwfTtcbiAgICAgKiB2YXIgdjMgPSBjYy52MigxMCwgMTApLmNsYW1wZihtaW5faW5jbHVzaXZlLCBtYXhfaW5jbHVzaXZlKTsgLy8gVmVjMiB7eDogMTAsIHk6IDEwfTtcbiAgICAgKi9cbiAgICBjbGFtcGYgKG1pbl9pbmNsdXNpdmU6IFZlYzIsIG1heF9pbmNsdXNpdmU6IFZlYzIpOiB0aGlzIHtcbiAgICAgICAgdGhpcy54ID0gbWlzYy5jbGFtcGYodGhpcy54LCBtaW5faW5jbHVzaXZlLngsIG1heF9pbmNsdXNpdmUueCk7XG4gICAgICAgIHRoaXMueSA9IG1pc2MuY2xhbXBmKHRoaXMueSwgbWluX2luY2x1c2l2ZS55LCBtYXhfaW5jbHVzaXZlLnkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEFkZHMgdGhpcyB2ZWN0b3IuXG4gICAgICogISN6aCDlkJHph4/liqDms5XjgIJcbiAgICAgKiBAbWV0aG9kIGFkZFxuICAgICAqIEBwYXJhbSB7VmVjMn0gdmVjdG9yXG4gICAgICogQHBhcmFtIHtWZWMyfSBbb3V0XVxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjIoMTAsIDEwKTtcbiAgICAgKiB2LmFkZChjYy52Mig1LCA1KSk7Ly8gcmV0dXJuIFZlYzIge3g6IDE1LCB5OiAxNX07XG4gICAgICovXG4gICAgYWRkICh2ZWN0b3I6IFZlYzIsIG91dD86IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWMyKCk7XG4gICAgICAgIG91dC54ID0gdGhpcy54ICsgdmVjdG9yLng7XG4gICAgICAgIG91dC55ID0gdGhpcy55ICsgdmVjdG9yLnk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIHRoaXMgdmVjdG9yLiBJZiB5b3Ugd2FudCB0byBzYXZlIHJlc3VsdCB0byBhbm90aGVyIHZlY3RvciwgdXNlIGFkZCgpIGluc3RlYWQuXG4gICAgICogISN6aCDlkJHph4/liqDms5XjgILlpoLmnpzkvaDmg7Pkv53lrZjnu5PmnpzliLDlj6bkuIDkuKrlkJHph4/vvIzkvb/nlKggYWRkKCkg5Luj5pu/44CCXG4gICAgICogQG1ldGhvZCBhZGRTZWxmXG4gICAgICogQHBhcmFtIHtWZWMyfSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgYWRkU2VsZiAodmVjdG9yOiBWZWMyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCArPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpcy55ICs9IHZlY3Rvci55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFN1YnRyYWN0cyBvbmUgdmVjdG9yIGZyb20gdGhpcy5cbiAgICAgKiAhI3poIOWQkemHj+WHj+azleOAglxuICAgICAqIEBtZXRob2Qgc3VidHJhY3RcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjIoMTAsIDEwKTtcbiAgICAgKiB2LnN1YlNlbGYoY2MudjIoNSwgNSkpOy8vIHJldHVybiBWZWMyIHt4OiA1LCB5OiA1fTtcbiAgICAgKi9cbiAgICBzdWJ0cmFjdCAodmVjdG9yOiBWZWMyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCAtPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpcy55IC09IHZlY3Rvci55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE11bHRpcGxpZXMgdGhpcyBieSBhIG51bWJlci5cbiAgICAgKiAhI3poIOe8qeaUvuW9k+WJjeWQkemHj+OAglxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlTY2FsYXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gICAgICogQHJldHVybiB7VmVjMn0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYubXVsdGlwbHkoNSk7Ly8gcmV0dXJuIFZlYzIge3g6IDUwLCB5OiA1MH07XG4gICAgICovXG4gICAgbXVsdGlwbHlTY2FsYXIgKG51bTogbnVtYmVyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCAqPSBudW07XG4gICAgICAgIHRoaXMueSAqPSBudW07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyB0d28gdmVjdG9ycy5cbiAgICAgKiAhI3poIOWIhumHj+ebuOS5mOOAglxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjIoMTAsIDEwKTtcbiAgICAgKiB2Lm11bHRpcGx5KGNjLnYyKDUsIDUpKTsvLyByZXR1cm4gVmVjMiB7eDogNTAsIHk6IDUwfTtcbiAgICAgKi9cbiAgICBtdWx0aXBseSAodmVjdG9yOiBWZWMyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCAqPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpcy55ICo9IHZlY3Rvci55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERpdmlkZXMgYnkgYSBudW1iZXIuXG4gICAgICogISN6aCDlkJHph4/pmaTms5XjgIJcbiAgICAgKiBAbWV0aG9kIGRpdmlkZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcmV0dXJuIHtWZWMyfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5kaXZpZGUoNSk7IC8vIHJldHVybiBWZWMyIHt4OiAyLCB5OiAyfTtcbiAgICAgKi9cbiAgICBkaXZpZGUgKG51bTogbnVtYmVyKTogdGhpcyB7XG4gICAgICAgIHRoaXMueCAvPSBudW07XG4gICAgICAgIHRoaXMueSAvPSBudW07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gTmVnYXRlcyB0aGUgY29tcG9uZW50cy5cbiAgICAgKiAhI3poIOWQkemHj+WPluWPjeOAglxuICAgICAqIEBtZXRob2QgbmVnYXRlXG4gICAgICogQHJldHVybiB7VmVjMn0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYubmVnYXRlKCk7IC8vIHJldHVybiBWZWMyIHt4OiAtMTAsIHk6IC0xMH07XG4gICAgICovXG4gICAgbmVnYXRlICgpOiB0aGlzIHtcbiAgICAgICAgdGhpcy54ID0gLXRoaXMueDtcbiAgICAgICAgdGhpcy55ID0gLXRoaXMueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBEb3QgcHJvZHVjdFxuICAgICAqICEjemgg5b2T5YmN5ZCR6YeP5LiO5oyH5a6a5ZCR6YeP6L+b6KGM54K55LmY44CCXG4gICAgICogQG1ldGhvZCBkb3RcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IFt2ZWN0b3JdXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgcmVzdWx0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5kb3QoY2MudjIoNSwgNSkpOyAvLyByZXR1cm4gMTAwO1xuICAgICAqL1xuICAgIGRvdCAodmVjdG9yOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHZlY3Rvci54ICsgdGhpcy55ICogdmVjdG9yLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDcm9zcyBwcm9kdWN0XG4gICAgICogISN6aCDlvZPliY3lkJHph4/kuI7mjIflrprlkJHph4/ov5vooYzlj4nkuZjjgIJcbiAgICAgKiBAbWV0aG9kIGNyb3NzXG4gICAgICogQHBhcmFtIHtWZWMyfSBbdmVjdG9yXVxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHJlc3VsdFxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYuY3Jvc3MoY2MudjIoNSwgNSkpOyAvLyByZXR1cm4gMDtcbiAgICAgKi9cbiAgICBjcm9zcyAodmVjdG9yOiBWZWMyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHZlY3Rvci55IC0gdGhpcy55ICogdmVjdG9yLng7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhpcyB2ZWN0b3IuXG4gICAgICogISN6aCDov5Tlm57or6XlkJHph4/nmoTplb/luqbjgIJcbiAgICAgKiBAbWV0aG9kIGxlblxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHJlc3VsdFxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYubGVuKCk7IC8vIHJldHVybiAxNC4xNDIxMzU2MjM3MzA5NTE7XG4gICAgICovXG4gICAgbGVuICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBzcXVhcmVkIGxlbmd0aCBvZiB0aGlzIHZlY3Rvci5cbiAgICAgKiAhI3poIOi/lOWbnuivpeWQkemHj+eahOmVv+W6puW5s+aWueOAglxuICAgICAqIEBtZXRob2QgbGVuZ3RoU3FyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSB0aGUgcmVzdWx0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdiA9IGNjLnYyKDEwLCAxMCk7XG4gICAgICogdi5sZW5ndGhTcXIoKTsgLy8gcmV0dXJuIDIwMDtcbiAgICAgKi9cbiAgICBsZW5ndGhTcXIgKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNYWtlIHRoZSBsZW5ndGggb2YgdGhpcyB2ZWN0b3IgdG8gMS5cbiAgICAgKiAhI3poIOWQkemHj+W9kuS4gOWMlu+8jOiuqei/meS4quWQkemHj+eahOmVv+W6puS4uiAx44CCXG4gICAgICogQG1ldGhvZCBub3JtYWxpemVTZWxmXG4gICAgICogQHJldHVybiB7VmVjMn0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYubm9ybWFsaXplU2VsZigpOyAvLyByZXR1cm4gVmVjMiB7eDogMC43MDcxMDY3ODExODY1NDc1LCB5OiAwLjcwNzEwNjc4MTE4NjU0NzV9O1xuICAgICAqL1xuICAgIG5vcm1hbGl6ZVNlbGYgKCk6IFZlYzIge1xuICAgICAgICB2YXIgbWFnU3FyID0gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55O1xuICAgICAgICBpZiAobWFnU3FyID09PSAxLjApXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAobWFnU3FyID09PSAwLjApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGludnNxcnQgPSAxLjAgLyBNYXRoLnNxcnQobWFnU3FyKTtcbiAgICAgICAgdGhpcy54ICo9IGludnNxcnQ7XG4gICAgICAgIHRoaXMueSAqPSBpbnZzcXJ0O1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoaXMgdmVjdG9yIHdpdGggYSBtYWduaXR1ZGUgb2YgMS48YnIvPlxuICAgICAqIDxici8+XG4gICAgICogTm90ZSB0aGF0IHRoZSBjdXJyZW50IHZlY3RvciBpcyB1bmNoYW5nZWQgYW5kIGEgbmV3IG5vcm1hbGl6ZWQgdmVjdG9yIGlzIHJldHVybmVkLiBJZiB5b3Ugd2FudCB0byBub3JtYWxpemUgdGhlIGN1cnJlbnQgdmVjdG9yLCB1c2Ugbm9ybWFsaXplU2VsZiBmdW5jdGlvbi5cbiAgICAgKiAhI3poXG4gICAgICog6L+U5Zue5b2S5LiA5YyW5ZCO55qE5ZCR6YeP44CCPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIOazqOaEj++8jOW9k+WJjeWQkemHj+S4jeWPmO+8jOW5tui/lOWbnuS4gOS4quaWsOeahOW9kuS4gOWMluWQkemHj+OAguWmguaenOS9oOaDs+adpeW9kuS4gOWMluW9k+WJjeWQkemHj++8jOWPr+S9v+eUqCBub3JtYWxpemVTZWxmIOWHveaVsOOAglxuICAgICAqIEBtZXRob2Qgbm9ybWFsaXplXG4gICAgICogQHBhcmFtIHtWZWMyfSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzIgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzIgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjMn0gcmVzdWx0XG4gICAgICogdmFyIHYgPSBjYy52MigxMCwgMTApO1xuICAgICAqIHYubm9ybWFsaXplKCk7ICAgLy8gcmV0dXJuIFZlYzIge3g6IDAuNzA3MTA2NzgxMTg2NTQ3NSwgeTogMC43MDcxMDY3ODExODY1NDc1fTtcbiAgICAgKi9cbiAgICBub3JtYWxpemUgKG91dD86IFZlYzIpOiBWZWMyIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWMyKCk7XG4gICAgICAgIG91dC54ID0gdGhpcy54O1xuICAgICAgICBvdXQueSA9IHRoaXMueTtcbiAgICAgICAgb3V0Lm5vcm1hbGl6ZVNlbGYoKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCBhbmdsZSBpbiByYWRpYW4gYmV0d2VlbiB0aGlzIGFuZCB2ZWN0b3IuXG4gICAgICogISN6aCDlpLnop5LnmoTlvKfluqbjgIJcbiAgICAgKiBAbWV0aG9kIGFuZ2xlXG4gICAgICogQHBhcmFtIHtWZWMyfSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IGZyb20gMCB0byBNYXRoLlBJXG4gICAgICovXG4gICAgYW5nbGUgKHZlY3RvcjogVmVjMik6IG51bWJlciB7XG4gICAgICAgIHZhciBtYWdTcXIxID0gdGhpcy5tYWdTcXIoKTtcbiAgICAgICAgdmFyIG1hZ1NxcjIgPSB2ZWN0b3IubWFnU3FyKCk7XG5cbiAgICAgICAgaWYgKG1hZ1NxcjEgPT09IDAgfHwgbWFnU3FyMiA9PT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ2FuJ3QgZ2V0IGFuZ2xlIGJldHdlZW4gemVybyB2ZWN0b3JcIik7XG4gICAgICAgICAgICByZXR1cm4gMC4wO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRvdCA9IHRoaXMuZG90KHZlY3Rvcik7XG4gICAgICAgIHZhciB0aGV0YSA9IGRvdCAvIChNYXRoLnNxcnQobWFnU3FyMSAqIG1hZ1NxcjIpKTtcbiAgICAgICAgdGhldGEgPSBtaXNjLmNsYW1wZih0aGV0YSwgLTEuMCwgMS4wKTtcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyh0aGV0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXQgYW5nbGUgaW4gcmFkaWFuIGJldHdlZW4gdGhpcyBhbmQgdmVjdG9yIHdpdGggZGlyZWN0aW9uLlxuICAgICAqICEjemgg5bim5pa55ZCR55qE5aS56KeS55qE5byn5bqm44CCXG4gICAgICogQG1ldGhvZCBzaWduQW5nbGVcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHZlY3RvclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gZnJvbSAtTWF0aFBJIHRvIE1hdGguUElcbiAgICAgKi9cbiAgICBzaWduQW5nbGUgKHZlY3RvcjogVmVjMik6IG51bWJlciB7XG4gICAgICAgIGxldCBhbmdsZSA9IHRoaXMuYW5nbGUodmVjdG9yKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Jvc3ModmVjdG9yKSA8IDAgPyAtYW5nbGUgOiBhbmdsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIHJvdGF0ZVxuICAgICAqICEjemgg6L+U5Zue5peL6L2s57uZ5a6a5byn5bqm5ZCO55qE5paw5ZCR6YeP44CCXG4gICAgICogQG1ldGhvZCByb3RhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFuc1xuICAgICAqIEBwYXJhbSB7VmVjMn0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMyIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMyIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICByb3RhdGUgKHJhZGlhbnM6IG51bWJlciwgb3V0PzogVmVjMik6IFZlYzIge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzIoKTtcbiAgICAgICAgb3V0LnggPSB0aGlzLng7XG4gICAgICAgIG91dC55ID0gdGhpcy55O1xuICAgICAgICByZXR1cm4gb3V0LnJvdGF0ZVNlbGYocmFkaWFucyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiByb3RhdGUgc2VsZlxuICAgICAqICEjemgg5oyJ5oyH5a6a5byn5bqm5peL6L2s5ZCR6YeP44CCXG4gICAgICogQG1ldGhvZCByb3RhdGVTZWxmXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbnNcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgcm90YXRlU2VsZiAocmFkaWFuczogbnVtYmVyKTogVmVjMiB7XG4gICAgICAgIHZhciBzaW4gPSBNYXRoLnNpbihyYWRpYW5zKTtcbiAgICAgICAgdmFyIGNvcyA9IE1hdGguY29zKHJhZGlhbnMpO1xuICAgICAgICB2YXIgeCA9IHRoaXMueDtcbiAgICAgICAgdGhpcy54ID0gY29zICogeCAtIHNpbiAqIHRoaXMueTtcbiAgICAgICAgdGhpcy55ID0gc2luICogeCArIGNvcyAqIHRoaXMueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDYWxjdWxhdGVzIHRoZSBwcm9qZWN0aW9uIG9mIHRoZSBjdXJyZW50IHZlY3RvciBvdmVyIHRoZSBnaXZlbiB2ZWN0b3IuXG4gICAgICogISN6aCDov5Tlm57lvZPliY3lkJHph4/lnKjmjIflrpogdmVjdG9yIOWQkemHj+S4iueahOaKleW9seWQkemHj+OAglxuICAgICAqIEBtZXRob2QgcHJvamVjdFxuICAgICAqIEBwYXJhbSB7VmVjMn0gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2MSA9IGNjLnYyKDIwLCAyMCk7XG4gICAgICogdmFyIHYyID0gY2MudjIoNSwgNSk7XG4gICAgICogdjEucHJvamVjdCh2Mik7IC8vIFZlYzIge3g6IDIwLCB5OiAyMH07XG4gICAgICovXG4gICAgcHJvamVjdCAodmVjdG9yOiBWZWMyKTogVmVjMiB7XG4gICAgICAgIHJldHVybiB2ZWN0b3IubXVsdGlwbHlTY2FsYXIodGhpcy5kb3QodmVjdG9yKSAvIHZlY3Rvci5kb3QodmVjdG9yKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhbnNmb3JtcyB0aGUgdmVjMiB3aXRoIGEgbWF0NC4gM3JkIHZlY3RvciBjb21wb25lbnQgaXMgaW1wbGljaXRseSAnMCcsIDR0aCB2ZWN0b3IgY29tcG9uZW50IGlzIGltcGxpY2l0bHkgJzEnXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1NYXQ0XG4gICAgICogQHBhcmFtIHtNYXQ0fSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICAgICAqIEBwYXJhbSB7VmVjMn0gW291dF0gdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWMyIHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMyIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtWZWMyfSBvdXRcbiAgICAgKi9cbiAgICB0cmFuc2Zvcm1NYXQ0IChtOiBNYXQ0LCBvdXQ/OiBWZWMyKTogVmVjMiB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgVmVjMigpO1xuICAgICAgICBWZWMyLnRyYW5zZm9ybU1hdDQob3V0LCB0aGlzLCBtKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHZhbHVlIGluIHgsIHkuXG4gICAgICogQG1ldGhvZCBtYXhBeGlzXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBtYXhBeGlzICgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy54LCB0aGlzLnkpO1xuICAgIH1cbn1cblxuY29uc3QgdjJfMSA9IG5ldyBWZWMyKCk7XG5jb25zdCB2Ml8yID0gbmV3IFZlYzIoKTtcblxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5WZWMyJywgVmVjMiwgeyB4OiAwLCB5OiAwIH0pO1xuXG5cblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuXG4vKipcbiAqICEjZW4gVGhlIGNvbnZlbmllbmNlIG1ldGhvZCB0byBjcmVhdGUgYSBuZXcge3sjY3Jvc3NMaW5rIFwiVmVjMlwifX1jYy5WZWMye3svY3Jvc3NMaW5rfX0uXG4gKiAhI3poIOmAmui/h+ivpeeugOS+v+eahOWHveaVsOi/m+ihjOWIm+W7uiB7eyNjcm9zc0xpbmsgXCJWZWMyXCJ9fWNjLlZlYzJ7ey9jcm9zc0xpbmt9fSDlr7nosaHjgIJcbiAqIEBtZXRob2QgdjJcbiAqIEBwYXJhbSB7TnVtYmVyfE9iamVjdH0gW3g9MF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbeT0wXVxuICogQHJldHVybiB7VmVjMn1cbiAqIEBleGFtcGxlXG4gKiB2YXIgdjEgPSBjYy52MigpO1xuICogdmFyIHYyID0gY2MudjIoMCwgMCk7XG4gKiB2YXIgdjMgPSBjYy52Mih2Mik7XG4gKiB2YXIgdjQgPSBjYy52Mih7eDogMTAwLCB5OiAxMDB9KTtcbiAqL1xuY2MudjIgPSBmdW5jdGlvbiB2MiAoeCwgeSkge1xuICAgIHJldHVybiBuZXcgVmVjMih4LCB5KTtcbn07XG5cbmNjLlZlYzIgPSBWZWMyO1xuIl19