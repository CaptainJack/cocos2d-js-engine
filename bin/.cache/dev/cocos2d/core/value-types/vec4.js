
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/vec4.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports.v4 = v4;
exports["default"] = void 0;

var _CCClass = _interopRequireDefault(require("../platform/CCClass"));

var _valueType = _interopRequireDefault(require("./value-type"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _x = 0.0;
var _y = 0.0;
var _z = 0.0;
var _w = 0.0;
/**
 * !#en Representation of 3D vectors and points.
 * !#zh 表示 3D 向量和坐标
 *
 * @class Vec4
 * @extends ValueType
 */

var Vec4 =
/*#__PURE__*/
function (_ValueType) {
  _inheritsLoose(Vec4, _ValueType);

  var _proto = Vec4.prototype;

  // deprecated

  /**
   * !#en Subtracts one vector from this. If you want to save result to another vector, use sub() instead.
   * !#zh 向量减法。如果你想保存结果到另一个向量，可使用 sub() 代替。
   * @method subSelf
   * @param {Vec4} vector
   * @return {Vec4} returns this
   * @chainable
   */

  /**
   * !#en Subtracts one vector from this, and returns the new result.
   * !#zh 向量减法，并返回新结果。
   * @method sub
   * @param {Vec4} vector
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  _proto.sub = function sub(vector, out) {
    return Vec4.subtract(out || new Vec4(), this, vector);
  }
  /**
   * !#en Multiplies this by a number. If you want to save result to another vector, use mul() instead.
   * !#zh 缩放当前向量。如果你想结果保存到另一个向量，可使用 mul() 代替。
   * @method mulSelf
   * @param {number} num
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  /**
   * !#en Multiplies by a number, and returns the new result.
   * !#zh 缩放向量，并返回新结果。
   * @method mul
   * @param {number} num
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  _proto.mul = function mul(num, out) {
    return Vec4.multiplyScalar(out || new Vec4(), this, num);
  }
  /**
   * !#en Divides by a number. If you want to save result to another vector, use div() instead.
   * !#zh 向量除法。如果你想结果保存到另一个向量，可使用 div() 代替。
   * @method divSelf
   * @param {number} num
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  /**
   * !#en Divides by a number, and returns the new result.
   * !#zh 向量除法，并返回新的结果。
   * @method div
   * @param {number} num
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  _proto.div = function div(num, out) {
    return Vec4.multiplyScalar(out || new Vec4(), this, 1 / num);
  }
  /**
   * !#en Multiplies two vectors.
   * !#zh 分量相乘。
   * @method scaleSelf
   * @param {Vec4} vector
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  /**
   * !#en Multiplies two vectors, and returns the new result.
   * !#zh 分量相乘，并返回新的结果。
   * @method scale
   * @param {Vec4} vector
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  _proto.scale = function scale(vector, out) {
    return Vec4.multiply(out || new Vec4(), this, vector);
  }
  /**
   * !#en Negates the components. If you want to save result to another vector, use neg() instead.
   * !#zh 向量取反。如果你想结果保存到另一个向量，可使用 neg() 代替。
   * @method negSelf
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  /**
   * !#en Negates the components, and returns the new result.
   * !#zh 返回取反后的新向量。
   * @method neg
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  _proto.neg = function neg(out) {
    return Vec4.negate(out || new Vec4(), this);
  };

  /**
   * !#zh 获得指定向量的拷贝
   * !#en Obtaining copy vectors designated
   * @method clone
   * @typescript
   * clone <Out extends IVec4Like> (a: Out)
   * @static
   */
  Vec4.clone = function clone(a) {
    return new Vec4(a.x, a.y, a.z, a.w);
  }
  /**
   * !#zh 复制目标向量
   * !#en Copy the target vector
   * @method copy
   * @typescript
   * copy <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.copy = function copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    out.w = a.w;
    return out;
  }
  /**
   * !#zh 设置向量值
   * !#en Set to value
   * @method set
   * @typescript
   * set <Out extends IVec4Like> (out: Out, x: number, y: number, z: number, w: number)
   * @static
   */
  ;

  Vec4.set = function set(out, x, y, z, w) {
    out.x = x;
    out.y = y;
    out.z = z;
    out.w = w;
    return out;
  }
  /**
   * !#zh 逐元素向量加法
   * !#en Element-wise vector addition
   * @method add
   * @typescript
   * add <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.add = function add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    out.w = a.w + b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量减法
   * !#en Element-wise vector subtraction
   * @method subtract
   * @typescript
   * subtract <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.subtract = function subtract(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    out.w = a.w - b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量乘法
   * !#en Element-wise vector multiplication
   * @method multiply
   * @typescript
   * multiply <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.multiply = function multiply(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    out.w = a.w * b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量除法
   * !#en Element-wise vector division
   * @method divide
   * @typescript
   * divide <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.divide = function divide(out, a, b) {
    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;
    out.w = a.w / b.w;
    return out;
  }
  /**
   * !#zh 逐元素向量向上取整
   * !#en Rounding up by elements of the vector
   * @method ceil
   * @typescript
   * ceil <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.ceil = function ceil(out, a) {
    out.x = Math.ceil(a.x);
    out.y = Math.ceil(a.y);
    out.z = Math.ceil(a.z);
    out.w = Math.ceil(a.w);
    return out;
  }
  /**
   * !#zh 逐元素向量向下取整
   * !#en Element vector by rounding down
   * @method floor
   * @typescript
   * floor <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.floor = function floor(out, a) {
    out.x = Math.floor(a.x);
    out.y = Math.floor(a.y);
    out.z = Math.floor(a.z);
    out.w = Math.floor(a.w);
    return out;
  }
  /**
   * !#zh 逐元素向量最小值
   * !#en The minimum by-element vector
   * @method min
   * @typescript
   * min <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.min = function min(out, a, b) {
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    out.z = Math.min(a.z, b.z);
    out.w = Math.min(a.w, b.w);
    return out;
  }
  /**
   * !#zh 逐元素向量最大值
   * !#en The maximum value of the element-wise vector
   * @method max
   * @typescript
   * max <Out extends IVec4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Vec4.max = function max(out, a, b) {
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    out.z = Math.max(a.z, b.z);
    out.w = Math.max(a.w, b.w);
    return out;
  }
  /**
   * !#zh 逐元素向量四舍五入取整
   * !#en Element-wise vector of rounding to whole
   * @method round
   * @typescript
   * round <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.round = function round(out, a) {
    out.x = Math.round(a.x);
    out.y = Math.round(a.y);
    out.z = Math.round(a.z);
    out.w = Math.round(a.w);
    return out;
  }
  /**
   * !#zh 向量标量乘法
   * !#en Vector scalar multiplication
   * @method multiplyScalar
   * @typescript
   * multiplyScalar <Out extends IVec4Like> (out: Out, a: Out, b: number)
   * @static
   */
  ;

  Vec4.multiplyScalar = function multiplyScalar(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    out.w = a.w * b;
    return out;
  }
  /**
   * !#zh 逐元素向量乘加: A + B * scale
   * !#en Element-wise vector multiply add: A + B * scale
   * @method scaleAndAdd
   * @typescript
   * scaleAndAdd <Out extends IVec4Like> (out: Out, a: Out, b: Out, scale: number)
   * @static
   */
  ;

  Vec4.scaleAndAdd = function scaleAndAdd(out, a, b, scale) {
    out.x = a.x + b.x * scale;
    out.y = a.y + b.y * scale;
    out.z = a.z + b.z * scale;
    out.w = a.w + b.w * scale;
    return out;
  }
  /**
   * !#zh 求两向量的欧氏距离
   * !#en Seeking two vectors Euclidean distance
   * @method distance
   * @typescript
   * distance <Out extends IVec4Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec4.distance = function distance(a, b) {
    var x = b.x - a.x;
    var y = b.y - a.y;
    var z = b.z - a.z;
    var w = b.w - a.w;
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  /**
   * !#zh 求两向量的欧氏距离平方
   * !#en Euclidean distance squared seeking two vectors
   * @method squaredDistance
   * @typescript
   * squaredDistance <Out extends IVec4Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec4.squaredDistance = function squaredDistance(a, b) {
    var x = b.x - a.x;
    var y = b.y - a.y;
    var z = b.z - a.z;
    var w = b.w - a.w;
    return x * x + y * y + z * z + w * w;
  }
  /**
   * !#zh 求向量长度
   * !#en Seeking vector length
   * @method len
   * @typescript
   * len <Out extends IVec4Like> (a: Out)
   * @static
   */
  ;

  Vec4.len = function len(a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    return Math.sqrt(_x * _x + _y * _y + _z * _z + _w * _w);
  }
  /**
   * !#zh 求向量长度平方
   * !#en Seeking squared vector length
   * @method lengthSqr
   * @typescript
   * lengthSqr <Out extends IVec4Like> (a: Out)
   * @static
   */
  ;

  Vec4.lengthSqr = function lengthSqr(a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    return _x * _x + _y * _y + _z * _z + _w * _w;
  }
  /**
   * !#zh 逐元素向量取负
   * !#en By taking the negative elements of the vector
   * @method negate
   * @typescript
   * negate <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.negate = function negate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    out.w = -a.w;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 Infinity
   * !#en Element vector by taking the inverse, return near 0 Infinity
   * @method inverse
   * @typescript
   * inverse <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.inverse = function inverse(out, a) {
    out.x = 1.0 / a.x;
    out.y = 1.0 / a.y;
    out.z = 1.0 / a.z;
    out.w = 1.0 / a.w;
    return out;
  }
  /**
   * !#zh 逐元素向量取倒数，接近 0 时返回 0
   * !#en Element vector by taking the inverse, return near 0 0
   * @method inverseSafe
   * @typescript
   * inverseSafe <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.inverseSafe = function inverseSafe(out, a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;

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

    if (Math.abs(_z) < _utils.EPSILON) {
      out.z = 0;
    } else {
      out.z = 1.0 / _z;
    }

    if (Math.abs(_w) < _utils.EPSILON) {
      out.w = 0;
    } else {
      out.w = 1.0 / _w;
    }

    return out;
  }
  /**
   * !#zh 归一化向量
   * !#en Normalized vector
   * @method normalize
   * @typescript
   * normalize <Out extends IVec4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Vec4.normalize = function normalize(out, a) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    var len = _x * _x + _y * _y + _z * _z + _w * _w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = _x * len;
      out.y = _y * len;
      out.z = _z * len;
      out.w = _w * len;
    }

    return out;
  }
  /**
   * !#zh 向量点积（数量积）
   * !#en Vector dot product (scalar product)
   * @method dot
   * @typescript
   * dot <Out extends IVec4Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec4.dot = function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  }
  /**
   * !#zh 逐元素向量线性插值： A + t * (B - A)
   * !#en Vector element by element linear interpolation: A + t * (B - A)
   * @method lerp
   * @typescript
   * lerp <Out extends IVec4Like> (out: Out, a: Out, b: Out, t: number)
   * @static
   */
  ;

  Vec4.lerp = function lerp(out, a, b, t) {
    out.x = a.x + t * (b.x - a.x);
    out.y = a.y + t * (b.y - a.y);
    out.z = a.z + t * (b.z - a.z);
    out.w = a.w + t * (b.w - a.w);
    return out;
  }
  /**
   * !#zh 生成一个在单位球体上均匀分布的随机向量
   * !#en Generates a uniformly distributed random vectors on the unit sphere
   * @method random
   * @typescript
   * random <Out extends IVec4Like> (out: Out, scale?: number)
   * @param scale 生成的向量长度
   * @static
   */
  ;

  Vec4.random = function random(out, scale) {
    scale = scale || 1.0;
    var phi = (0, _utils.random)() * 2.0 * Math.PI;
    var cosTheta = (0, _utils.random)() * 2 - 1;
    var sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    out.x = sinTheta * Math.cos(phi) * scale;
    out.y = sinTheta * Math.sin(phi) * scale;
    out.z = cosTheta * scale;
    out.w = 0;
    return out;
  }
  /**
   * !#zh 向量矩阵乘法
   * !#en Vector matrix multiplication
   * @method transformMat4
   * @typescript
   * transformMat4 <Out extends IVec4Like, MatLike extends IMat4Like> (out: Out, a: Out, mat: MatLike)
   * @static
   */
  ;

  Vec4.transformMat4 = function transformMat4(out, a, mat) {
    _x = a.x;
    _y = a.y;
    _z = a.z;
    _w = a.w;
    var m = mat.m;
    out.x = m[0] * _x + m[4] * _y + m[8] * _z + m[12] * _w;
    out.y = m[1] * _x + m[5] * _y + m[9] * _z + m[13] * _w;
    out.z = m[2] * _x + m[6] * _y + m[10] * _z + m[14] * _w;
    out.w = m[3] * _x + m[7] * _y + m[11] * _z + m[15] * _w;
    return out;
  }
  /**
   * !#zh 向量仿射变换
   * !#en Affine transformation vector
   * @static
   */
  ;

  Vec4.transformAffine = function transformAffine(out, v, mat) {
    _x = v.x;
    _y = v.y;
    _z = v.z;
    _w = v.w;
    var m = mat.m;
    out.x = m[0] * _x + m[1] * _y + m[2] * _z + m[3] * _w;
    out.y = m[4] * _x + m[5] * _y + m[6] * _z + m[7] * _w;
    out.x = m[8] * _x + m[9] * _y + m[10] * _z + m[11] * _w;
    out.w = v.w;
    return out;
  }
  /**
   * !#zh 向量四元数乘法
   * !#en Vector quaternion multiplication
   * @method transformQuat
   * @typescript
   * transformQuat <Out extends IVec4Like, QuatLike extends IQuatLike> (out: Out, a: Out, q: QuatLike)
   * @static
   */
  ;

  Vec4.transformQuat = function transformQuat(out, a, q) {
    var x = a.x,
        y = a.y,
        z = a.z;
    _x = q.x;
    _y = q.y;
    _z = q.z;
    _w = q.w; // calculate quat * vec

    var ix = _w * x + _y * z - _z * y;
    var iy = _w * y + _z * x - _x * z;
    var iz = _w * z + _x * y - _y * x;
    var iw = -_x * x - _y * y - _z * z; // calculate result * inverse quat

    out.x = ix * _w + iw * -_x + iy * -_z - iz * -_y;
    out.y = iy * _w + iw * -_y + iz * -_x - ix * -_z;
    out.z = iz * _w + iw * -_z + ix * -_y - iy * -_x;
    out.w = a.w;
    return out;
  }
  /**
   * !#zh 向量等价判断
   * !#en Equivalent vectors Analyzing
   * @method strictEquals
   * @typescript
   * strictEquals <Out extends IVec4Like> (a: Out, b: Out)
   * @static
   */
  ;

  Vec4.strictEquals = function strictEquals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
  }
  /**
   * !#zh 排除浮点数误差的向量近似等价判断
   * !#en Negative error vector floating point approximately equivalent Analyzing
   * @method equals
   * @typescript
   * equals <Out extends IVec4Like> (a: Out, b: Out, epsilon = EPSILON)
   * @static
   */
  ;

  Vec4.equals = function equals(a, b, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(a.x - b.x) <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) && Math.abs(a.y - b.y) <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y)) && Math.abs(a.z - b.z) <= epsilon * Math.max(1.0, Math.abs(a.z), Math.abs(b.z)) && Math.abs(a.w - b.w) <= epsilon * Math.max(1.0, Math.abs(a.w), Math.abs(b.w));
  }
  /**
   * !#zh 向量转数组
   * !#en Vector transfer array
   * @method toArray
   * @typescript
   * toArray <Out extends IWritableArrayLike<number>> (out: Out, v: IVec4Like, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Vec4.toArray = function toArray(out, v, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out[ofs + 0] = v.x;
    out[ofs + 1] = v.y;
    out[ofs + 2] = v.z;
    out[ofs + 3] = v.w;
    return out;
  }
  /**
   * !#zh 数组转向量
   * !#en Array steering amount
   * @method fromArray
   * @typescript
   * fromArray <Out extends IVec4Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Vec4.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out.x = arr[ofs + 0];
    out.y = arr[ofs + 1];
    out.z = arr[ofs + 2];
    out.w = arr[ofs + 3];
    return out;
  }
  /**
   * @property {Number} x
   */
  ;

  _createClass(Vec4, null, [{
    key: "ZERO",
    get: function get() {
      return new Vec4(0, 0, 0, 0);
    }
  }, {
    key: "ONE",
    get: function get() {
      return new Vec4(1, 1, 1, 1);
    }
  }, {
    key: "NEG_ONE",
    get: function get() {
      return new Vec4(-1, -1, -1, -1);
    }
  }]);

  /**
   * !#en
   * Constructor
   * see {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
   * !#zh
   * 构造函数，可查看 {{#crossLink "cc/vec4:method"}}cc.v4{{/crossLink}}
   * @method constructor
   * @param {number} [x=0]
   * @param {number} [y=0]
   * @param {number} [z=0]
   * @param {number} [w=0]
   */
  function Vec4(x, y, z, w) {
    var _this;

    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    if (z === void 0) {
      z = 0;
    }

    if (w === void 0) {
      w = 0;
    }

    _this = _ValueType.call(this) || this;
    _this.mag = Vec4.prototype.len;
    _this.magSqr = Vec4.prototype.lengthSqr;
    _this.subSelf = Vec4.prototype.subtract;
    _this.mulSelf = Vec4.prototype.multiplyScalar;
    _this.divSelf = Vec4.prototype.divide;
    _this.scaleSelf = Vec4.prototype.multiply;
    _this.negSelf = Vec4.prototype.negate;
    _this.x = void 0;
    _this.y = void 0;
    _this.z = void 0;
    _this.w = void 0;

    if (x && typeof x === 'object') {
      _this.w = x.w;
      _this.z = x.z;
      _this.y = x.y;
      _this.x = x.x;
    } else {
      _this.x = x;
      _this.y = y;
      _this.z = z;
      _this.w = w;
    }

    return _this;
  }
  /**
   * !#en clone a Vec4 value
   * !#zh 克隆一个 Vec4 值
   * @method clone
   * @return {Vec4}
   */


  _proto.clone = function clone() {
    return new Vec4(this.x, this.y, this.z, this.w);
  }
  /**
   * !#en Set the current vector value with the given vector.
   * !#zh 用另一个向量设置当前的向量对象值。
   * @method set
   * @param {Vec4} newValue - !#en new value to set. !#zh 要设置的新值
   * @return {Vec4} returns this
   */
  ;

  _proto.set = function set(x, y, z, w) {
    if (x && typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
      this.w = x.w;
    } else {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      this.w = w || 0;
    }

    return this;
  }
  /**
   * !#en Check whether the vector equals another one
   * !#zh 当前的向量是否与指定的向量相等。
   * @method equals
   * @param {Vec4} other
   * @param {number} [epsilon]
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(this.x - other.x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(other.x)) && Math.abs(this.y - other.y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(other.y)) && Math.abs(this.z - other.z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(other.z)) && Math.abs(this.w - other.w) <= epsilon * Math.max(1.0, Math.abs(this.w), Math.abs(other.w));
  }
  /**
   * !#en Check whether the vector equals another one
   * !#zh 判断当前向量是否在误差范围内与指定分量的向量相等。
   * @method equals4f
   * @param {number} x - 相比较的向量的 x 分量。
   * @param {number} y - 相比较的向量的 y 分量。
   * @param {number} z - 相比较的向量的 z 分量。
   * @param {number} w - 相比较的向量的 w 分量。
   * @param {number} [epsilon] - 允许的误差，应为非负数。
   * @returns {Boolean} - 当两向量的各分量都在指定的误差范围内分别相等时，返回 `true`；否则返回 `false`。
   */
  ;

  _proto.equals4f = function equals4f(x, y, z, w, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(this.x - x) <= epsilon * Math.max(1.0, Math.abs(this.x), Math.abs(x)) && Math.abs(this.y - y) <= epsilon * Math.max(1.0, Math.abs(this.y), Math.abs(y)) && Math.abs(this.z - z) <= epsilon * Math.max(1.0, Math.abs(this.z), Math.abs(z)) && Math.abs(this.w - w) <= epsilon * Math.max(1.0, Math.abs(this.w), Math.abs(w));
  }
  /**
   * !#en Check whether strict equals other Vec4
   * !#zh 判断当前向量是否与指定向量相等。两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
   * @method strictEquals
   * @param {Vec4} other - 相比较的向量。
   * @returns {boolean}
   */
  ;

  _proto.strictEquals = function strictEquals(other) {
    return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
  }
  /**
   * !#en Check whether strict equals other Vec4
   * !#zh 判断当前向量是否与指定分量的向量相等。两向量的各分量都分别相等时返回 `true`；否则返回 `false`。
   * @method strictEquals4f
   * @param {number} x - 指定向量的 x 分量。
   * @param {number} y - 指定向量的 y 分量。
   * @param {number} z - 指定向量的 z 分量。
   * @param {number} w - 指定向量的 w 分量。
   * @returns {boolean}
   */
  ;

  _proto.strictEquals4f = function strictEquals4f(x, y, z, w) {
    return this.x === x && this.y === y && this.z === z && this.w === w;
  }
  /**
   * !#en Calculate linear interpolation result between this vector and another one with given ratio
   * !#zh 根据指定的插值比率，从当前向量到目标向量之间做插值。
   * @method lerp
   * @param {Vec4} to 目标向量。
   * @param {number} ratio 插值比率，范围为 [0,1]。
   * @returns {Vec4}
   */
  ;

  _proto.lerp = function lerp(to, ratio) {
    _x = this.x;
    _y = this.y;
    _z = this.z;
    _w = this.w;
    this.x = _x + ratio * (to.x - _x);
    this.y = _y + ratio * (to.y - _y);
    this.z = _z + ratio * (to.z - _z);
    this.w = _w + ratio * (to.w - _w);
    return this;
  }
  /**
   * !#en Transform to string with vector informations
   * !#zh 返回当前向量的字符串表示。
   * @method toString
   * @returns {string} 当前向量的字符串表示。
   */
  ;

  _proto.toString = function toString() {
    return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + ", " + this.w.toFixed(2) + ")";
  }
  /**
   * !#en Clamp the vector between minInclusive and maxInclusive.
   * !#zh 设置当前向量的值，使其各个分量都处于指定的范围内。
   * @method clampf
   * @param {Vec4} minInclusive 每个分量都代表了对应分量允许的最小值。
   * @param {Vec4} maxInclusive 每个分量都代表了对应分量允许的最大值。
   * @returns {Vec4}
   */
  ;

  _proto.clampf = function clampf(minInclusive, maxInclusive) {
    this.x = (0, _utils.clamp)(this.x, minInclusive.x, maxInclusive.x);
    this.y = (0, _utils.clamp)(this.y, minInclusive.y, maxInclusive.y);
    this.z = (0, _utils.clamp)(this.z, minInclusive.z, maxInclusive.z);
    this.w = (0, _utils.clamp)(this.w, minInclusive.w, maxInclusive.w);
    return this;
  }
  /**
   * !#en Adds this vector. If you want to save result to another vector, use add() instead.
   * !#zh 向量加法。如果你想保存结果到另一个向量，使用 add() 代替。
   * @method addSelf
   * @param {Vec4} vector
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.addSelf = function addSelf(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    this.w += vector.w;
    return this;
  }
  /**
   * !#en Adds two vectors, and returns the new result.
   * !#zh 向量加法，并返回新结果。
   * @method add
   * @param {Vec4} vector
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  ;

  _proto.add = function add(vector, out) {
    out = out || new Vec4();
    out.x = this.x + vector.x;
    out.y = this.y + vector.y;
    out.z = this.z + vector.z;
    out.w = this.w + vector.w;
    return out;
  }
  /**
   * !#en Subtracts one vector from this, and returns the new result.
   * !#zh 向量减法，并返回新结果。
   * @method subtract
   * @param {Vec4} vector
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} the result
   */
  ;

  _proto.subtract = function subtract(vector, out) {
    out = out || new Vec4();
    out.x = this.x - vector.x;
    out.y = this.y - vector.y;
    out.z = this.z - vector.z;
    out.w = this.w - vector.w;
    return out;
  }
  /**
   * !#en Multiplies this by a number.
   * !#zh 缩放当前向量。
   * @method multiplyScalar
   * @param {number} num
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.multiplyScalar = function multiplyScalar(num) {
    this.x *= num;
    this.y *= num;
    this.z *= num;
    this.w *= num;
    return this;
  }
  /**
   * !#en Multiplies two vectors.
   * !#zh 分量相乘。
   * @method multiply
   * @param {Vec4} vector
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.multiply = function multiply(vector) {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    this.w *= vector.w;
    return this;
  }
  /**
   * !#en Divides by a number.
   * !#zh 向量除法。
   * @method divide
   * @param {number} num
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.divide = function divide(num) {
    this.x /= num;
    this.y /= num;
    this.z /= num;
    this.w /= num;
    return this;
  }
  /**
   * !#en Negates the components.
   * !#zh 向量取反
   * @method negate
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.negate = function negate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
    return this;
  }
  /**
   * !#en Dot product
   * !#zh 当前向量与指定向量进行点乘。
   * @method dot
   * @param {Vec4} [vector]
   * @return {number} the result
   */
  ;

  _proto.dot = function dot(vector) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
  }
  /**
   * !#en Cross product
   * !#zh 当前向量与指定向量进行叉乘。
   * @method cross
   * @param {Vec4} vector
   * @param {Vec4} [out]
   * @return {Vec4} the result
   */
  ;

  _proto.cross = function cross(vector, out) {
    out = out || new Vec4();
    var ax = this.x,
        ay = this.y,
        az = this.z;
    var bx = vector.x,
        by = vector.y,
        bz = vector.z;
    out.x = ay * bz - az * by;
    out.y = az * bx - ax * bz;
    out.z = ax * by - ay * bx;
    return out;
  }
  /**
   * !#en Returns the length of this vector.
   * !#zh 返回该向量的长度。
   * @method len
   * @return {number} the result
   * @example
   * var v = cc.v4(10, 10);
   * v.len(); // return 14.142135623730951;
   */
  ;

  _proto.len = function len() {
    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  /**
   * !#en Returns the squared length of this vector.
   * !#zh 返回该向量的长度平方。
   * @method lengthSqr
   * @return {number} the result
   */
  ;

  _proto.lengthSqr = function lengthSqr() {
    var x = this.x,
        y = this.y,
        z = this.z,
        w = this.w;
    return x * x + y * y + z * z + w * w;
  }
  /**
   * !#en Make the length of this vector to 1.
   * !#zh 向量归一化，让这个向量的长度为 1。
   * @method normalizeSelf
   * @return {Vec4} returns this
   * @chainable
   */
  ;

  _proto.normalizeSelf = function normalizeSelf() {
    this.normalize(this);
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
   * @param {Vec4} [out] - optional, the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @return {Vec4} result
   */
  ;

  _proto.normalize = function normalize(out) {
    out = out || new Vec4();
    _x = this.x;
    _y = this.y;
    _z = this.z;
    _w = this.w;
    var len = _x * _x + _y * _y + _z * _z + _w * _w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = _x * len;
      out.y = _y * len;
      out.z = _z * len;
      out.w = _w * len;
    }

    return out;
  }
  /**
   * Transforms the vec4 with a mat4. 4th vector component is implicitly '1'
   * @method transformMat4
   * @param {Mat4} m matrix to transform with
   * @param {Vec4} [out] the receiving vector, you can pass the same vec4 to save result to itself, if not provided, a new vec4 will be created
   * @returns {Vec4} out
   */
  ;

  _proto.transformMat4 = function transformMat4(matrix, out) {
    out = out || new Vec4();
    _x = this.x;
    _y = this.y;
    _z = this.z;
    _w = this.w;
    var m = matrix.m;
    out.x = m[0] * _x + m[4] * _y + m[8] * _z + m[12] * _w;
    out.y = m[1] * _x + m[5] * _y + m[9] * _z + m[13] * _w;
    out.z = m[2] * _x + m[6] * _y + m[10] * _z + m[14] * _w;
    out.w = m[3] * _x + m[7] * _y + m[11] * _z + m[15] * _w;
    return out;
  }
  /**
   * Returns the maximum value in x, y, z, w.
   * @method maxAxis
   * @returns {number}
   */
  ;

  _proto.maxAxis = function maxAxis() {
    return Math.max(this.x, this.y, this.z, this.w);
  };

  return Vec4;
}(_valueType["default"]);

exports["default"] = Vec4;
Vec4.sub = Vec4.subtract;
Vec4.mul = Vec4.multiply;
Vec4.div = Vec4.divide;
Vec4.scale = Vec4.multiplyScalar;
Vec4.mag = Vec4.len;
Vec4.squaredMagnitude = Vec4.lengthSqr;
Vec4.ZERO_R = Vec4.ZERO;
Vec4.ONE_R = Vec4.ONE;
Vec4.NEG_ONE_R = Vec4.NEG_ONE;

_CCClass["default"].fastDefine('cc.Vec4', Vec4, {
  x: 0,
  y: 0,
  z: 0,
  w: 0
});

function v4(x, y, z, w) {
  return new Vec4(x, y, z, w);
}

cc.v4 = v4;
cc.Vec4 = Vec4;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlYzQudHMiXSwibmFtZXMiOlsiX3giLCJfeSIsIl96IiwiX3ciLCJWZWM0Iiwic3ViIiwidmVjdG9yIiwib3V0Iiwic3VidHJhY3QiLCJtdWwiLCJudW0iLCJtdWx0aXBseVNjYWxhciIsImRpdiIsInNjYWxlIiwibXVsdGlwbHkiLCJuZWciLCJuZWdhdGUiLCJjbG9uZSIsImEiLCJ4IiwieSIsInoiLCJ3IiwiY29weSIsInNldCIsImFkZCIsImIiLCJkaXZpZGUiLCJjZWlsIiwiTWF0aCIsImZsb29yIiwibWluIiwibWF4Iiwicm91bmQiLCJzY2FsZUFuZEFkZCIsImRpc3RhbmNlIiwic3FydCIsInNxdWFyZWREaXN0YW5jZSIsImxlbiIsImxlbmd0aFNxciIsImludmVyc2UiLCJpbnZlcnNlU2FmZSIsImFicyIsIkVQU0lMT04iLCJub3JtYWxpemUiLCJkb3QiLCJsZXJwIiwidCIsInJhbmRvbSIsInBoaSIsIlBJIiwiY29zVGhldGEiLCJzaW5UaGV0YSIsImNvcyIsInNpbiIsInRyYW5zZm9ybU1hdDQiLCJtYXQiLCJtIiwidHJhbnNmb3JtQWZmaW5lIiwidiIsInRyYW5zZm9ybVF1YXQiLCJxIiwiaXgiLCJpeSIsIml6IiwiaXciLCJzdHJpY3RFcXVhbHMiLCJlcXVhbHMiLCJlcHNpbG9uIiwidG9BcnJheSIsIm9mcyIsImZyb21BcnJheSIsImFyciIsIm1hZyIsInByb3RvdHlwZSIsIm1hZ1NxciIsInN1YlNlbGYiLCJtdWxTZWxmIiwiZGl2U2VsZiIsInNjYWxlU2VsZiIsIm5lZ1NlbGYiLCJvdGhlciIsImVxdWFsczRmIiwic3RyaWN0RXF1YWxzNGYiLCJ0byIsInJhdGlvIiwidG9TdHJpbmciLCJ0b0ZpeGVkIiwiY2xhbXBmIiwibWluSW5jbHVzaXZlIiwibWF4SW5jbHVzaXZlIiwiYWRkU2VsZiIsImNyb3NzIiwiYXgiLCJheSIsImF6IiwiYngiLCJieSIsImJ6Iiwibm9ybWFsaXplU2VsZiIsIm1hdHJpeCIsIm1heEF4aXMiLCJWYWx1ZVR5cGUiLCJzcXVhcmVkTWFnbml0dWRlIiwiWkVST19SIiwiWkVSTyIsIk9ORV9SIiwiT05FIiwiTkVHX09ORV9SIiwiTkVHX09ORSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwidjQiLCJjYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkE7O0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUFFQSxJQUFJQSxFQUFVLEdBQUcsR0FBakI7QUFDQSxJQUFJQyxFQUFVLEdBQUcsR0FBakI7QUFDQSxJQUFJQyxFQUFVLEdBQUcsR0FBakI7QUFDQSxJQUFJQyxFQUFVLEdBQUcsR0FBakI7QUFFQTs7Ozs7Ozs7SUFPcUJDOzs7Ozs7O0FBQ2pCOztBQVNBOzs7Ozs7Ozs7QUFTQTs7Ozs7Ozs7U0FRQUMsTUFBQSxhQUFLQyxNQUFMLEVBQW1CQyxHQUFuQixFQUErQjtBQUMzQixXQUFPSCxJQUFJLENBQUNJLFFBQUwsQ0FBY0QsR0FBRyxJQUFJLElBQUlILElBQUosRUFBckIsRUFBaUMsSUFBakMsRUFBdUNFLE1BQXZDLENBQVA7QUFDSDtBQUNEOzs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7O1NBUUFHLE1BQUEsYUFBS0MsR0FBTCxFQUFrQkgsR0FBbEIsRUFBOEI7QUFDMUIsV0FBT0gsSUFBSSxDQUFDTyxjQUFMLENBQW9CSixHQUFHLElBQUksSUFBSUgsSUFBSixFQUEzQixFQUF1QyxJQUF2QyxFQUE2Q00sR0FBN0MsQ0FBUDtBQUNIO0FBQ0Q7Ozs7Ozs7Ozs7QUFTQTs7Ozs7Ozs7U0FRQUUsTUFBQSxhQUFLRixHQUFMLEVBQWtCSCxHQUFsQixFQUFvQztBQUNoQyxXQUFPSCxJQUFJLENBQUNPLGNBQUwsQ0FBb0JKLEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQTNCLEVBQXVDLElBQXZDLEVBQTZDLElBQUVNLEdBQS9DLENBQVA7QUFDSDtBQUNEOzs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7O1NBUUFHLFFBQUEsZUFBT1AsTUFBUCxFQUFxQkMsR0FBckIsRUFBaUM7QUFDN0IsV0FBT0gsSUFBSSxDQUFDVSxRQUFMLENBQWNQ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RUFBRSxDQUFYO0FBQWNDLEVBQUFBLENBQUMsRUFBRSxDQUFqQjtBQUFvQkMsRUFBQUEsQ0FBQyxFQUFFO0FBQXZCLENBQXBDOztBQUtPLFNBQVMwRixFQUFULENBQWE3RixDQUFiLEVBQWdDQyxDQUFoQyxFQUE0Q0MsQ0FBNUMsRUFBd0RDLENBQXhELEVBQW9FO0FBQ3ZFLFNBQU8sSUFBSWxCLElBQUosQ0FBU2UsQ0FBVCxFQUFtQkMsQ0FBbkIsRUFBc0JDLENBQXRCLEVBQXlCQyxDQUF6QixDQUFQO0FBQ0g7O0FBRUQyRixFQUFFLENBQUNELEVBQUgsR0FBUUEsRUFBUjtBQUNBQyxFQUFFLENBQUM3RyxJQUFILEdBQVVBLElBQVYiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zLmNvbVxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiovXG5cbmltcG9ydCBDQ0NsYXNzIGZyb20gJy4uL3BsYXRmb3JtL0NDQ2xhc3MnO1xuaW1wb3J0IFZhbHVlVHlwZSBmcm9tICcuL3ZhbHVlLXR5cGUnO1xuaW1wb3J0IE1hdDQgZnJvbSAnLi9tYXQ0JztcbmltcG9ydCB7IGNsYW1wLCBFUFNJTE9OLCByYW5kb20gfSBmcm9tICcuL3V0aWxzJztcblxubGV0IF94OiBudW1iZXIgPSAwLjA7XG5sZXQgX3k6IG51bWJlciA9IDAuMDtcbmxldCBfejogbnVtYmVyID0gMC4wO1xubGV0IF93OiBudW1iZXIgPSAwLjA7XG5cbi8qKlxuICogISNlbiBSZXByZXNlbnRhdGlvbiBvZiAzRCB2ZWN0b3JzIGFuZCBwb2ludHMuXG4gKiAhI3poIOihqOekuiAzRCDlkJHph4/lkozlnZDmoIdcbiAqXG4gKiBAY2xhc3MgVmVjNFxuICogQGV4dGVuZHMgVmFsdWVUeXBlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlYzQgZXh0ZW5kcyBWYWx1ZVR5cGUge1xuICAgIC8vIGRlcHJlY2F0ZWRcbiAgICBwdWJsaWMgc3RhdGljIHN1YiAgID0gVmVjNC5zdWJ0cmFjdDtcbiAgICBwdWJsaWMgc3RhdGljIG11bCAgID0gVmVjNC5tdWx0aXBseTtcbiAgICBwdWJsaWMgc3RhdGljIGRpdiA9IFZlYzQuZGl2aWRlO1xuICAgIHB1YmxpYyBzdGF0aWMgc2NhbGUgPSBWZWM0Lm11bHRpcGx5U2NhbGFyO1xuICAgIHB1YmxpYyBzdGF0aWMgbWFnICAgPSBWZWM0LmxlbjtcbiAgICBwdWJsaWMgc3RhdGljIHNxdWFyZWRNYWduaXR1ZGUgPSBWZWM0Lmxlbmd0aFNxcjtcbiAgICBtYWcgID0gVmVjNC5wcm90b3R5cGUubGVuO1xuICAgIG1hZ1NxciA9IFZlYzQucHJvdG90eXBlLmxlbmd0aFNxcjtcbiAgICAvKipcbiAgICAgKiAhI2VuIFN1YnRyYWN0cyBvbmUgdmVjdG9yIGZyb20gdGhpcy4gSWYgeW91IHdhbnQgdG8gc2F2ZSByZXN1bHQgdG8gYW5vdGhlciB2ZWN0b3IsIHVzZSBzdWIoKSBpbnN0ZWFkLlxuICAgICAqICEjemgg5ZCR6YeP5YeP5rOV44CC5aaC5p6c5L2g5oOz5L+d5a2Y57uT5p6c5Yiw5Y+m5LiA5Liq5ZCR6YeP77yM5Y+v5L2/55SoIHN1YigpIOS7o+abv+OAglxuICAgICAqIEBtZXRob2Qgc3ViU2VsZlxuICAgICAqIEBwYXJhbSB7VmVjNH0gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIHN1YlNlbGYgID0gVmVjNC5wcm90b3R5cGUuc3VidHJhY3Q7XG4gICAgLyoqXG4gICAgICogISNlbiBTdWJ0cmFjdHMgb25lIHZlY3RvciBmcm9tIHRoaXMsIGFuZCByZXR1cm5zIHRoZSBuZXcgcmVzdWx0LlxuICAgICAqICEjemgg5ZCR6YeP5YeP5rOV77yM5bm26L+U5Zue5paw57uT5p6c44CCXG4gICAgICogQG1ldGhvZCBzdWJcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IHZlY3RvclxuICAgICAqIEBwYXJhbSB7VmVjNH0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWM0IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWM0IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBzdWIgKHZlY3RvcjogVmVjNCwgb3V0PzogVmVjNCkge1xuICAgICAgICByZXR1cm4gVmVjNC5zdWJ0cmFjdChvdXQgfHwgbmV3IFZlYzQoKSwgdGhpcywgdmVjdG9yKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIHRoaXMgYnkgYSBudW1iZXIuIElmIHlvdSB3YW50IHRvIHNhdmUgcmVzdWx0IHRvIGFub3RoZXIgdmVjdG9yLCB1c2UgbXVsKCkgaW5zdGVhZC5cbiAgICAgKiAhI3poIOe8qeaUvuW9k+WJjeWQkemHj+OAguWmguaenOS9oOaDs+e7k+aenOS/neWtmOWIsOWPpuS4gOS4quWQkemHj++8jOWPr+S9v+eUqCBtdWwoKSDku6Pmm7/jgIJcbiAgICAgKiBAbWV0aG9kIG11bFNlbGZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIG11bFNlbGYgID0gVmVjNC5wcm90b3R5cGUubXVsdGlwbHlTY2FsYXI7XG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIGJ5IGEgbnVtYmVyLCBhbmQgcmV0dXJucyB0aGUgbmV3IHJlc3VsdC5cbiAgICAgKiAhI3poIOe8qeaUvuWQkemHj++8jOW5tui/lOWbnuaWsOe7k+aenOOAglxuICAgICAqIEBtZXRob2QgbXVsXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICAgICAqIEBwYXJhbSB7VmVjNH0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWM0IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWM0IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBtdWwgKG51bTogbnVtYmVyLCBvdXQ/OiBWZWM0KSB7XG4gICAgICAgIHJldHVybiBWZWM0Lm11bHRpcGx5U2NhbGFyKG91dCB8fCBuZXcgVmVjNCgpLCB0aGlzLCBudW0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAhI2VuIERpdmlkZXMgYnkgYSBudW1iZXIuIElmIHlvdSB3YW50IHRvIHNhdmUgcmVzdWx0IHRvIGFub3RoZXIgdmVjdG9yLCB1c2UgZGl2KCkgaW5zdGVhZC5cbiAgICAgKiAhI3poIOWQkemHj+mZpOazleOAguWmguaenOS9oOaDs+e7k+aenOS/neWtmOWIsOWPpuS4gOS4quWQkemHj++8jOWPr+S9v+eUqCBkaXYoKSDku6Pmm7/jgIJcbiAgICAgKiBAbWV0aG9kIGRpdlNlbGZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIGRpdlNlbGYgID0gVmVjNC5wcm90b3R5cGUuZGl2aWRlO1xuICAgIC8qKlxuICAgICAqICEjZW4gRGl2aWRlcyBieSBhIG51bWJlciwgYW5kIHJldHVybnMgdGhlIG5ldyByZXN1bHQuXG4gICAgICogISN6aCDlkJHph4/pmaTms5XvvIzlubbov5Tlm57mlrDnmoTnu5PmnpzjgIJcbiAgICAgKiBAbWV0aG9kIGRpdlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcGFyYW0ge1ZlYzR9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjNCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjNCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgZGl2IChudW06IG51bWJlciwgb3V0PzogVmVjNCk6IFZlYzQge1xuICAgICAgICByZXR1cm4gVmVjNC5tdWx0aXBseVNjYWxhcihvdXQgfHwgbmV3IFZlYzQoKSwgdGhpcywgMS9udW0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAhI2VuIE11bHRpcGxpZXMgdHdvIHZlY3RvcnMuXG4gICAgICogISN6aCDliIbph4/nm7jkuZjjgIJcbiAgICAgKiBAbWV0aG9kIHNjYWxlU2VsZlxuICAgICAqIEBwYXJhbSB7VmVjNH0gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIHNjYWxlU2VsZiA9IFZlYzQucHJvdG90eXBlLm11bHRpcGx5O1xuICAgIC8qKlxuICAgICAqICEjZW4gTXVsdGlwbGllcyB0d28gdmVjdG9ycywgYW5kIHJldHVybnMgdGhlIG5ldyByZXN1bHQuXG4gICAgICogISN6aCDliIbph4/nm7jkuZjvvIzlubbov5Tlm57mlrDnmoTnu5PmnpzjgIJcbiAgICAgKiBAbWV0aG9kIHNjYWxlXG4gICAgICogQHBhcmFtIHtWZWM0fSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjNCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjNCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgc2NhbGUgKHZlY3RvcjogVmVjNCwgb3V0PzogVmVjNCkge1xuICAgICAgICByZXR1cm4gVmVjNC5tdWx0aXBseShvdXQgfHwgbmV3IFZlYzQoKSwgdGhpcywgdmVjdG9yKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogISNlbiBOZWdhdGVzIHRoZSBjb21wb25lbnRzLiBJZiB5b3Ugd2FudCB0byBzYXZlIHJlc3VsdCB0byBhbm90aGVyIHZlY3RvciwgdXNlIG5lZygpIGluc3RlYWQuXG4gICAgICogISN6aCDlkJHph4/lj5blj43jgILlpoLmnpzkvaDmg7Pnu5Pmnpzkv53lrZjliLDlj6bkuIDkuKrlkJHph4/vvIzlj6/kvb/nlKggbmVnKCkg5Luj5pu/44CCXG4gICAgICogQG1ldGhvZCBuZWdTZWxmXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIG5lZ1NlbGYgPSBWZWM0LnByb3RvdHlwZS5uZWdhdGU7XG4gICAgLyoqXG4gICAgICogISNlbiBOZWdhdGVzIHRoZSBjb21wb25lbnRzLCBhbmQgcmV0dXJucyB0aGUgbmV3IHJlc3VsdC5cbiAgICAgKiAhI3poIOi/lOWbnuWPluWPjeWQjueahOaWsOWQkemHj+OAglxuICAgICAqIEBtZXRob2QgbmVnXG4gICAgICogQHBhcmFtIHtWZWM0fSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzQgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzQgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjNH0gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIG5lZyAob3V0PzogVmVjNCkge1xuICAgICAgICByZXR1cm4gVmVjNC5uZWdhdGUob3V0IHx8IG5ldyBWZWM0KCksIHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFpFUk8gKCkgeyByZXR1cm4gbmV3IFZlYzQoMCwgMCwgMCwgMCk7IH1cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFpFUk9fUiA9IFZlYzQuWkVSTztcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE9ORSAoKSB7IHJldHVybiBuZXcgVmVjNCgxLCAxLCAxLCAxKTsgfVxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgT05FX1IgPSBWZWM0Lk9ORTtcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IE5FR19PTkUgKCkgeyByZXR1cm4gbmV3IFZlYzQoLTEsIC0xLCAtMSwgLTEpOyB9XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBORUdfT05FX1IgPSBWZWM0Lk5FR19PTkU7XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiOt+W+l+aMh+WumuWQkemHj+eahOaLt+i0nVxuICAgICAqICEjZW4gT2J0YWluaW5nIGNvcHkgdmVjdG9ycyBkZXNpZ25hdGVkXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY2xvbmUgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjbG9uZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjNChhLngsIGEueSwgYS56LCBhLncpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5aSN5Yi255uu5qCH5ZCR6YePXG4gICAgICogISNlbiBDb3B5IHRoZSB0YXJnZXQgdmVjdG9yXG4gICAgICogQG1ldGhvZCBjb3B5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjb3B5IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGNvcHkgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBhLng7XG4gICAgICAgIG91dC55ID0gYS55O1xuICAgICAgICBvdXQueiA9IGEuejtcbiAgICAgICAgb3V0LncgPSBhLnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorr7nva7lkJHph4/lgLxcbiAgICAgKiAhI2VuIFNldCB0byB2YWx1ZVxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzZXQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2V0IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKSB7XG4gICAgICAgIG91dC54ID0geDtcbiAgICAgICAgb3V0LnkgPSB5O1xuICAgICAgICBvdXQueiA9IHo7XG4gICAgICAgIG91dC53ID0gdztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WKoOazlVxuICAgICAqICEjZW4gRWxlbWVudC13aXNlIHZlY3RvciBhZGRpdGlvblxuICAgICAqIEBtZXRob2QgYWRkXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBhZGQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBhZGQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCArIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgKyBiLnk7XG4gICAgICAgIG91dC56ID0gYS56ICsgYi56O1xuICAgICAgICBvdXQudyA9IGEudyArIGIudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WHj+azlVxuICAgICAqICEjZW4gRWxlbWVudC13aXNlIHZlY3RvciBzdWJ0cmFjdGlvblxuICAgICAqIEBtZXRob2Qgc3VidHJhY3RcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN1YnRyYWN0IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc3VidHJhY3QgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCAtIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgLSBiLnk7XG4gICAgICAgIG91dC56ID0gYS56IC0gYi56O1xuICAgICAgICBvdXQudyA9IGEudyAtIGIudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+S5mOazlVxuICAgICAqICEjZW4gRWxlbWVudC13aXNlIHZlY3RvciBtdWx0aXBsaWNhdGlvblxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG11bHRpcGx5IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbXVsdGlwbHkgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCAqIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgKiBiLnk7XG4gICAgICAgIG91dC56ID0gYS56ICogYi56O1xuICAgICAgICBvdXQudyA9IGEudyAqIGIudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+mZpOazlVxuICAgICAqICEjZW4gRWxlbWVudC13aXNlIHZlY3RvciBkaXZpc2lvblxuICAgICAqIEBtZXRob2QgZGl2aWRlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBkaXZpZGUgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBkaXZpZGUgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBvdXQueCA9IGEueCAvIGIueDtcbiAgICAgICAgb3V0LnkgPSBhLnkgLyBiLnk7XG4gICAgICAgIG91dC56ID0gYS56IC8gYi56O1xuICAgICAgICBvdXQudyA9IGEudyAvIGIudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WQkeS4iuWPluaVtFxuICAgICAqICEjZW4gUm91bmRpbmcgdXAgYnkgZWxlbWVudHMgb2YgdGhlIHZlY3RvclxuICAgICAqIEBtZXRob2QgY2VpbFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY2VpbCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBjZWlsIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIG91dC54ID0gTWF0aC5jZWlsKGEueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5jZWlsKGEueSk7XG4gICAgICAgIG91dC56ID0gTWF0aC5jZWlsKGEueik7XG4gICAgICAgIG91dC53ID0gTWF0aC5jZWlsKGEudyk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/lkJHkuIvlj5bmlbRcbiAgICAgKiAhI2VuIEVsZW1lbnQgdmVjdG9yIGJ5IHJvdW5kaW5nIGRvd25cbiAgICAgKiBAbWV0aG9kIGZsb29yXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmbG9vciA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBmbG9vciA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IE1hdGguZmxvb3IoYS54KTtcbiAgICAgICAgb3V0LnkgPSBNYXRoLmZsb29yKGEueSk7XG4gICAgICAgIG91dC56ID0gTWF0aC5mbG9vcihhLnopO1xuICAgICAgICBvdXQudyA9IE1hdGguZmxvb3IoYS53KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+acgOWwj+WAvFxuICAgICAqICEjZW4gVGhlIG1pbmltdW0gYnktZWxlbWVudCB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIG1pblxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbWluIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbWluIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLm1pbihhLngsIGIueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5taW4oYS55LCBiLnkpO1xuICAgICAgICBvdXQueiA9IE1hdGgubWluKGEueiwgYi56KTtcbiAgICAgICAgb3V0LncgPSBNYXRoLm1pbihhLncsIGIudyk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDlkJHph4/mnIDlpKflgLxcbiAgICAgKiAhI2VuIFRoZSBtYXhpbXVtIHZhbHVlIG9mIHRoZSBlbGVtZW50LXdpc2UgdmVjdG9yXG4gICAgICogQG1ldGhvZCBtYXhcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG1heCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIG1heCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIG91dC54ID0gTWF0aC5tYXgoYS54LCBiLngpO1xuICAgICAgICBvdXQueSA9IE1hdGgubWF4KGEueSwgYi55KTtcbiAgICAgICAgb3V0LnogPSBNYXRoLm1heChhLnosIGIueik7XG4gICAgICAgIG91dC53ID0gTWF0aC5tYXgoYS53LCBiLncpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Zub6IiN5LqU5YWl5Y+W5pW0XG4gICAgICogISNlbiBFbGVtZW50LXdpc2UgdmVjdG9yIG9mIHJvdW5kaW5nIHRvIHdob2xlXG4gICAgICogQG1ldGhvZCByb3VuZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcm91bmQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcm91bmQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSBNYXRoLnJvdW5kKGEueCk7XG4gICAgICAgIG91dC55ID0gTWF0aC5yb3VuZChhLnkpO1xuICAgICAgICBvdXQueiA9IE1hdGgucm91bmQoYS56KTtcbiAgICAgICAgb3V0LncgPSBNYXRoLnJvdW5kKGEudyk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/moIfph4/kuZjms5VcbiAgICAgKiAhI2VuIFZlY3RvciBzY2FsYXIgbXVsdGlwbGljYXRpb25cbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5U2NhbGFyXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBtdWx0aXBseVNjYWxhciA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogbnVtYmVyKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIG11bHRpcGx5U2NhbGFyIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBudW1iZXIpIHtcbiAgICAgICAgb3V0LnggPSBhLnggKiBiO1xuICAgICAgICBvdXQueSA9IGEueSAqIGI7XG4gICAgICAgIG91dC56ID0gYS56ICogYjtcbiAgICAgICAgb3V0LncgPSBhLncgKiBiO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5LmY5YqgOiBBICsgQiAqIHNjYWxlXG4gICAgICogISNlbiBFbGVtZW50LXdpc2UgdmVjdG9yIG11bHRpcGx5IGFkZDogQSArIEIgKiBzY2FsZVxuICAgICAqIEBtZXRob2Qgc2NhbGVBbmRBZGRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHNjYWxlQW5kQWRkIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHNjYWxlOiBudW1iZXIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgc2NhbGVBbmRBZGQgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgc2NhbGU6IG51bWJlcikge1xuICAgICAgICBvdXQueCA9IGEueCArIChiLnggKiBzY2FsZSk7XG4gICAgICAgIG91dC55ID0gYS55ICsgKGIueSAqIHNjYWxlKTtcbiAgICAgICAgb3V0LnogPSBhLnogKyAoYi56ICogc2NhbGUpO1xuICAgICAgICBvdXQudyA9IGEudyArIChiLncgKiBzY2FsZSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmsYLkuKTlkJHph4/nmoTmrKfmsI/ot53nprtcbiAgICAgKiAhI2VuIFNlZWtpbmcgdHdvIHZlY3RvcnMgRXVjbGlkZWFuIGRpc3RhbmNlXG4gICAgICogQG1ldGhvZCBkaXN0YW5jZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZGlzdGFuY2UgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGRpc3RhbmNlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBjb25zdCB4ID0gYi54IC0gYS54O1xuICAgICAgICBjb25zdCB5ID0gYi55IC0gYS55O1xuICAgICAgICBjb25zdCB6ID0gYi56IC0gYS56O1xuICAgICAgICBjb25zdCB3ID0gYi53IC0gYS53O1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeiArIHcgKiB3KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaxguS4pOWQkemHj+eahOasp+awj+i3neemu+W5s+aWuVxuICAgICAqICEjZW4gRXVjbGlkZWFuIGRpc3RhbmNlIHNxdWFyZWQgc2Vla2luZyB0d28gdmVjdG9yc1xuICAgICAqIEBtZXRob2Qgc3F1YXJlZERpc3RhbmNlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzcXVhcmVkRGlzdGFuY2UgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHNxdWFyZWREaXN0YW5jZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgY29uc3QgeCA9IGIueCAtIGEueDtcbiAgICAgICAgY29uc3QgeSA9IGIueSAtIGEueTtcbiAgICAgICAgY29uc3QgeiA9IGIueiAtIGEuejtcbiAgICAgICAgY29uc3QgdyA9IGIudyAtIGEudztcbiAgICAgICAgcmV0dXJuIHggKiB4ICsgeSAqIHkgKyB6ICogeiArIHcgKiB3O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5ZCR6YeP6ZW/5bqmXG4gICAgICogISNlbiBTZWVraW5nIHZlY3RvciBsZW5ndGhcbiAgICAgKiBAbWV0aG9kIGxlblxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbGVuIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgbGVuIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQpIHtcbiAgICAgICAgX3ggPSBhLng7XG4gICAgICAgIF95ID0gYS55O1xuICAgICAgICBfeiA9IGEuejtcbiAgICAgICAgX3cgPSBhLnc7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoX3ggKiBfeCArIF95ICogX3kgKyBfeiAqIF96ICsgX3cgKiBfdyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmsYLlkJHph4/plb/luqblubPmlrlcbiAgICAgKiAhI2VuIFNlZWtpbmcgc3F1YXJlZCB2ZWN0b3IgbGVuZ3RoXG4gICAgICogQG1ldGhvZCBsZW5ndGhTcXJcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGxlbmd0aFNxciA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGxlbmd0aFNxciA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0KSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIF93ID0gYS53O1xuICAgICAgICByZXR1cm4gX3ggKiBfeCArIF95ICogX3kgKyBfeiAqIF96ICsgX3cgKiBfdztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WPlui0n1xuICAgICAqICEjZW4gQnkgdGFraW5nIHRoZSBuZWdhdGl2ZSBlbGVtZW50cyBvZiB0aGUgdmVjdG9yXG4gICAgICogQG1ldGhvZCBuZWdhdGVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG5lZ2F0ZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBuZWdhdGUgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgb3V0LnggPSAtYS54O1xuICAgICAgICBvdXQueSA9IC1hLnk7XG4gICAgICAgIG91dC56ID0gLWEuejtcbiAgICAgICAgb3V0LncgPSAtYS53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP5Y+W5YCS5pWw77yM5o6l6L+RIDAg5pe26L+U5ZueIEluZmluaXR5XG4gICAgICogISNlbiBFbGVtZW50IHZlY3RvciBieSB0YWtpbmcgdGhlIGludmVyc2UsIHJldHVybiBuZWFyIDAgSW5maW5pdHlcbiAgICAgKiBAbWV0aG9kIGludmVyc2VcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGludmVyc2UgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgaW52ZXJzZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IDEuMCAvIGEueDtcbiAgICAgICAgb3V0LnkgPSAxLjAgLyBhLnk7XG4gICAgICAgIG91dC56ID0gMS4wIC8gYS56O1xuICAgICAgICBvdXQudyA9IDEuMCAvIGEudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOWQkemHj+WPluWAkuaVsO+8jOaOpei/kSAwIOaXtui/lOWbniAwXG4gICAgICogISNlbiBFbGVtZW50IHZlY3RvciBieSB0YWtpbmcgdGhlIGludmVyc2UsIHJldHVybiBuZWFyIDAgMFxuICAgICAqIEBtZXRob2QgaW52ZXJzZVNhZmVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGludmVyc2VTYWZlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGludmVyc2VTYWZlIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG4gICAgICAgIF94ID0gYS54O1xuICAgICAgICBfeSA9IGEueTtcbiAgICAgICAgX3ogPSBhLno7XG4gICAgICAgIF93ID0gYS53O1xuXG4gICAgICAgIGlmIChNYXRoLmFicyhfeCkgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICBvdXQueCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQueCA9IDEuMCAvIF94O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKF95KSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIG91dC55ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dC55ID0gMS4wIC8gX3k7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoTWF0aC5hYnMoX3opIDwgRVBTSUxPTikge1xuICAgICAgICAgICAgb3V0LnogPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0LnogPSAxLjAgLyBfejtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChNYXRoLmFicyhfdykgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICBvdXQudyA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXQudyA9IDEuMCAvIF93O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOW9kuS4gOWMluWQkemHj1xuICAgICAqICEjZW4gTm9ybWFsaXplZCB2ZWN0b3JcbiAgICAgKiBAbWV0aG9kIG5vcm1hbGl6ZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbm9ybWFsaXplIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIG5vcm1hbGl6ZSA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIF96ID0gYS56O1xuICAgICAgICBfdyA9IGEudztcbiAgICAgICAgbGV0IGxlbiA9IF94ICogX3ggKyBfeSAqIF95ICsgX3ogKiBfeiArIF93ICogX3c7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICBsZW4gPSAxIC8gTWF0aC5zcXJ0KGxlbik7XG4gICAgICAgICAgICBvdXQueCA9IF94ICogbGVuO1xuICAgICAgICAgICAgb3V0LnkgPSBfeSAqIGxlbjtcbiAgICAgICAgICAgIG91dC56ID0gX3ogKiBsZW47XG4gICAgICAgICAgICBvdXQudyA9IF93ICogbGVuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/ngrnnp6/vvIjmlbDph4/np6/vvIlcbiAgICAgKiAhI2VuIFZlY3RvciBkb3QgcHJvZHVjdCAoc2NhbGFyIHByb2R1Y3QpXG4gICAgICogQG1ldGhvZCBkb3RcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGRvdCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZG90IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICByZXR1cm4gYS54ICogYi54ICsgYS55ICogYi55ICsgYS56ICogYi56ICsgYS53ICogYi53O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg5ZCR6YeP57q/5oCn5o+S5YC877yaIEEgKyB0ICogKEIgLSBBKVxuICAgICAqICEjZW4gVmVjdG9yIGVsZW1lbnQgYnkgZWxlbWVudCBsaW5lYXIgaW50ZXJwb2xhdGlvbjogQSArIHQgKiAoQiAtIEEpXG4gICAgICogQG1ldGhvZCBsZXJwXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBsZXJwIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHQ6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBsZXJwIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHQ6IG51bWJlcikge1xuICAgICAgICBvdXQueCA9IGEueCArIHQgKiAoYi54IC0gYS54KTtcbiAgICAgICAgb3V0LnkgPSBhLnkgKyB0ICogKGIueSAtIGEueSk7XG4gICAgICAgIG91dC56ID0gYS56ICsgdCAqIChiLnogLSBhLnopO1xuICAgICAgICBvdXQudyA9IGEudyArIHQgKiAoYi53IC0gYS53KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOeUn+aIkOS4gOS4quWcqOWNleS9jeeQg+S9k+S4iuWdh+WMgOWIhuW4g+eahOmaj+acuuWQkemHj1xuICAgICAqICEjZW4gR2VuZXJhdGVzIGEgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkIHJhbmRvbSB2ZWN0b3JzIG9uIHRoZSB1bml0IHNwaGVyZVxuICAgICAqIEBtZXRob2QgcmFuZG9tXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByYW5kb20gPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBzY2FsZT86IG51bWJlcilcbiAgICAgKiBAcGFyYW0gc2NhbGUg55Sf5oiQ55qE5ZCR6YeP6ZW/5bqmXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgcmFuZG9tIDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgc2NhbGU/OiBudW1iZXIpIHtcbiAgICAgICAgc2NhbGUgPSBzY2FsZSB8fCAxLjA7XG5cbiAgICAgICAgY29uc3QgcGhpID0gcmFuZG9tKCkgKiAyLjAgKiBNYXRoLlBJO1xuICAgICAgICBjb25zdCBjb3NUaGV0YSA9IHJhbmRvbSgpICogMiAtIDE7XG4gICAgICAgIGNvbnN0IHNpblRoZXRhID0gTWF0aC5zcXJ0KDEgLSBjb3NUaGV0YSAqIGNvc1RoZXRhKTtcblxuICAgICAgICBvdXQueCA9IHNpblRoZXRhICogTWF0aC5jb3MocGhpKSAqIHNjYWxlO1xuICAgICAgICBvdXQueSA9IHNpblRoZXRhICogTWF0aC5zaW4ocGhpKSAqIHNjYWxlO1xuICAgICAgICBvdXQueiA9IGNvc1RoZXRhICogc2NhbGU7XG4gICAgICAgIG91dC53ID0gMDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+efqemYteS5mOazlVxuICAgICAqICEjZW4gVmVjdG9yIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgICAqIEBtZXRob2QgdHJhbnNmb3JtTWF0NFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdHJhbnNmb3JtTWF0NCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlLCBNYXRMaWtlIGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgbWF0OiBNYXRMaWtlKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybU1hdDQgPE91dCBleHRlbmRzIElWZWM0TGlrZSwgTWF0TGlrZSBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIG1hdDogTWF0TGlrZSkge1xuICAgICAgICBfeCA9IGEueDtcbiAgICAgICAgX3kgPSBhLnk7XG4gICAgICAgIF96ID0gYS56O1xuICAgICAgICBfdyA9IGEudztcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgb3V0LnggPSBtWzBdICogX3ggKyBtWzRdICogX3kgKyBtWzhdICAqIF96ICsgbVsxMl0gKiBfdztcbiAgICAgICAgb3V0LnkgPSBtWzFdICogX3ggKyBtWzVdICogX3kgKyBtWzldICAqIF96ICsgbVsxM10gKiBfdztcbiAgICAgICAgb3V0LnogPSBtWzJdICogX3ggKyBtWzZdICogX3kgKyBtWzEwXSAqIF96ICsgbVsxNF0gKiBfdztcbiAgICAgICAgb3V0LncgPSBtWzNdICogX3ggKyBtWzddICogX3kgKyBtWzExXSAqIF96ICsgbVsxNV0gKiBfdztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+S7v+WwhOWPmOaNolxuICAgICAqICEjZW4gQWZmaW5lIHRyYW5zZm9ybWF0aW9uIHZlY3RvclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHRyYW5zZm9ybUFmZmluZTxPdXQgZXh0ZW5kcyBJVmVjNExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjNExpa2UsIE1hdExpa2UgZXh0ZW5kcyBJTWF0NExpa2U+XG4gICAgICAgIChvdXQ6IE91dCwgdjogVmVjTGlrZSwgbWF0OiBNYXRMaWtlKSB7XG4gICAgICAgIF94ID0gdi54O1xuICAgICAgICBfeSA9IHYueTtcbiAgICAgICAgX3ogPSB2Lno7XG4gICAgICAgIF93ID0gdi53O1xuICAgICAgICBsZXQgbSA9IG1hdC5tO1xuICAgICAgICBvdXQueCA9IG1bMF0gKiBfeCArIG1bMV0gKiBfeSArIG1bMl0gICogX3ogKyBtWzNdICogX3c7XG4gICAgICAgIG91dC55ID0gbVs0XSAqIF94ICsgbVs1XSAqIF95ICsgbVs2XSAgKiBfeiArIG1bN10gKiBfdztcbiAgICAgICAgb3V0LnggPSBtWzhdICogX3ggKyBtWzldICogX3kgKyBtWzEwXSAqIF96ICsgbVsxMV0gKiBfdztcbiAgICAgICAgb3V0LncgPSB2Lnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlkJHph4/lm5vlhYPmlbDkuZjms5VcbiAgICAgKiAhI2VuIFZlY3RvciBxdWF0ZXJuaW9uIG11bHRpcGxpY2F0aW9uXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1RdWF0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiB0cmFuc2Zvcm1RdWF0IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2UsIFF1YXRMaWtlIGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcTogUXVhdExpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgdHJhbnNmb3JtUXVhdCA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlLCBRdWF0TGlrZSBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHE6IFF1YXRMaWtlKSB7XG4gICAgICAgIGNvbnN0IHsgeCwgeSwgeiB9ID0gYTtcblxuICAgICAgICBfeCA9IHEueDtcbiAgICAgICAgX3kgPSBxLnk7XG4gICAgICAgIF96ID0gcS56O1xuICAgICAgICBfdyA9IHEudztcblxuICAgICAgICAvLyBjYWxjdWxhdGUgcXVhdCAqIHZlY1xuICAgICAgICBjb25zdCBpeCA9IF93ICogeCArIF95ICogeiAtIF96ICogeTtcbiAgICAgICAgY29uc3QgaXkgPSBfdyAqIHkgKyBfeiAqIHggLSBfeCAqIHo7XG4gICAgICAgIGNvbnN0IGl6ID0gX3cgKiB6ICsgX3ggKiB5IC0gX3kgKiB4O1xuICAgICAgICBjb25zdCBpdyA9IC1feCAqIHggLSBfeSAqIHkgLSBfeiAqIHo7XG5cbiAgICAgICAgLy8gY2FsY3VsYXRlIHJlc3VsdCAqIGludmVyc2UgcXVhdFxuICAgICAgICBvdXQueCA9IGl4ICogX3cgKyBpdyAqIC1feCArIGl5ICogLV96IC0gaXogKiAtX3k7XG4gICAgICAgIG91dC55ID0gaXkgKiBfdyArIGl3ICogLV95ICsgaXogKiAtX3ggLSBpeCAqIC1fejtcbiAgICAgICAgb3V0LnogPSBpeiAqIF93ICsgaXcgKiAtX3ogKyBpeCAqIC1feSAtIGl5ICogLV94O1xuICAgICAgICBvdXQudyA9IGEudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWQkemHj+etieS7t+WIpOaWrVxuICAgICAqICEjZW4gRXF1aXZhbGVudCB2ZWN0b3JzIEFuYWx5emluZ1xuICAgICAqIEBtZXRob2Qgc3RyaWN0RXF1YWxzXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdHJpY3RFcXVhbHMgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHN0cmljdEVxdWFscyA8T3V0IGV4dGVuZHMgSVZlYzRMaWtlPiAoYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgcmV0dXJuIGEueCA9PT0gYi54ICYmIGEueSA9PT0gYi55ICYmIGEueiA9PT0gYi56ICYmIGEudyA9PT0gYi53O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5o6S6Zmk5rWu54K55pWw6K+v5beu55qE5ZCR6YeP6L+R5Ly8562J5Lu35Yik5patXG4gICAgICogISNlbiBOZWdhdGl2ZSBlcnJvciB2ZWN0b3IgZmxvYXRpbmcgcG9pbnQgYXBwcm94aW1hdGVseSBlcXVpdmFsZW50IEFuYWx5emluZ1xuICAgICAqIEBtZXRob2QgZXF1YWxzXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBlcXVhbHMgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0LCBlcHNpbG9uID0gRVBTSUxPTilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBlcXVhbHMgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKGE6IE91dCwgYjogT3V0LCBlcHNpbG9uID0gRVBTSUxPTikge1xuICAgICAgICByZXR1cm4gKE1hdGguYWJzKGEueCAtIGIueCkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS54KSwgTWF0aC5hYnMoYi54KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGEueSAtIGIueSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS55KSwgTWF0aC5hYnMoYi55KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGEueiAtIGIueikgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS56KSwgTWF0aC5hYnMoYi56KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGEudyAtIGIudykgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYS53KSwgTWF0aC5hYnMoYi53KSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5ZCR6YeP6L2s5pWw57uEXG4gICAgICogISNlbiBWZWN0b3IgdHJhbnNmZXIgYXJyYXlcbiAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIHY6IElWZWM0TGlrZSwgb2ZzID0gMClcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIHY6IElWZWM0TGlrZSwgb2ZzID0gMCkge1xuICAgICAgICBvdXRbb2ZzICsgMF0gPSB2Lng7XG4gICAgICAgIG91dFtvZnMgKyAxXSA9IHYueTtcbiAgICAgICAgb3V0W29mcyArIDJdID0gdi56O1xuICAgICAgICBvdXRbb2ZzICsgM10gPSB2Lnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmlbDnu4TovazlkJHph49cbiAgICAgKiAhI2VuIEFycmF5IHN0ZWVyaW5nIGFtb3VudFxuICAgICAqIEBtZXRob2QgZnJvbUFycmF5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tQXJyYXkgPE91dCBleHRlbmRzIElWZWM0TGlrZT4gKG91dDogT3V0LCBhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvZnMgPSAwKVxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE6LW35aeL5YGP56e76YePXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgZnJvbUFycmF5IDxPdXQgZXh0ZW5kcyBJVmVjNExpa2U+IChvdXQ6IE91dCwgYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb2ZzID0gMCkge1xuICAgICAgICBvdXQueCA9IGFycltvZnMgKyAwXTtcbiAgICAgICAgb3V0LnkgPSBhcnJbb2ZzICsgMV07XG4gICAgICAgIG91dC56ID0gYXJyW29mcyArIDJdO1xuICAgICAgICBvdXQudyA9IGFycltvZnMgKyAzXTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0geFxuICAgICAqL1xuICAgIHB1YmxpYyB4OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0geVxuICAgICAqL1xuICAgIHB1YmxpYyB5OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gelxuICAgICAqL1xuICAgIHB1YmxpYyB6OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gd1xuICAgICAqL1xuICAgIHB1YmxpYyB3OiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKiBzZWUge3sjY3Jvc3NMaW5rIFwiY2MvdmVjNDptZXRob2RcIn19Y2MudjR7ey9jcm9zc0xpbmt9fVxuICAgICAqICEjemhcbiAgICAgKiDmnoTpgKDlh73mlbDvvIzlj6/mn6XnnIsge3sjY3Jvc3NMaW5rIFwiY2MvdmVjNDptZXRob2RcIn19Y2MudjR7ey9jcm9zc0xpbmt9fVxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3g9MF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3k9MF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3o9MF1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3c9MF1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoeDogbnVtYmVyIHwgVmVjNCA9IDAsIHk6IG51bWJlciA9IDAsIHo6IG51bWJlciA9IDAsIHc6IG51bWJlciA9IDApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aGlzLncgPSB4Lnc7XG4gICAgICAgICAgICB0aGlzLnogPSB4Lno7XG4gICAgICAgICAgICB0aGlzLnkgPSB4Lnk7XG4gICAgICAgICAgICB0aGlzLnggPSB4Lng7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnggPSB4IGFzIG51bWJlcjtcbiAgICAgICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgICAgICB0aGlzLnogPSB6O1xuICAgICAgICAgICAgdGhpcy53ID0gdztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gY2xvbmUgYSBWZWM0IHZhbHVlXG4gICAgICogISN6aCDlhYvpmobkuIDkuKogVmVjNCDlgLxcbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHJldHVybiB7VmVjNH1cbiAgICAgKi9cbiAgICBwdWJsaWMgY2xvbmUgKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlYzQodGhpcy54LCB0aGlzLnksIHRoaXMueiwgdGhpcy53KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgY3VycmVudCB2ZWN0b3IgdmFsdWUgd2l0aCB0aGUgZ2l2ZW4gdmVjdG9yLlxuICAgICAqICEjemgg55So5Y+m5LiA5Liq5ZCR6YeP6K6+572u5b2T5YmN55qE5ZCR6YeP5a+56LGh5YC844CCXG4gICAgICogQG1ldGhvZCBzZXRcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IG5ld1ZhbHVlIC0gISNlbiBuZXcgdmFsdWUgdG8gc2V0LiAhI3poIOimgeiuvue9rueahOaWsOWAvFxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHJldHVybnMgdGhpc1xuICAgICAqL1xuICAgIHB1YmxpYyBzZXQgKG90aGVyOiBWZWM0KTtcblxuICAgIHB1YmxpYyBzZXQgKHg/OiBudW1iZXIsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIsIHc/OiBudW1iZXIpO1xuXG4gICAgcHVibGljIHNldCAoeD86IG51bWJlciB8IFZlYzQsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIsIHc/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aGlzLnggPSB4Lng7XG4gICAgICAgICAgICB0aGlzLnkgPSB4Lnk7XG4gICAgICAgICAgICB0aGlzLnogPSB4Lno7XG4gICAgICAgICAgICB0aGlzLncgPSB4Lnc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnggPSB4IGFzIG51bWJlciB8fCAwO1xuICAgICAgICAgICAgdGhpcy55ID0geSB8fCAwO1xuICAgICAgICAgICAgdGhpcy56ID0geiB8fCAwO1xuICAgICAgICAgICAgdGhpcy53ID0gdyB8fCAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciB0aGUgdmVjdG9yIGVxdWFscyBhbm90aGVyIG9uZVxuICAgICAqICEjemgg5b2T5YmN55qE5ZCR6YeP5piv5ZCm5LiO5oyH5a6a55qE5ZCR6YeP55u4562J44CCXG4gICAgICogQG1ldGhvZCBlcXVhbHNcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IG90aGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtlcHNpbG9uXVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgcHVibGljIGVxdWFscyAob3RoZXI6IFZlYzQsIGVwc2lsb24gPSBFUFNJTE9OKSB7XG4gICAgICAgIHJldHVybiAoTWF0aC5hYnModGhpcy54IC0gb3RoZXIueCkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy54KSwgTWF0aC5hYnMob3RoZXIueCkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLnkgLSBvdGhlci55KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLnkpLCBNYXRoLmFicyhvdGhlci55KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMueiAtIG90aGVyLnopIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueiksIE1hdGguYWJzKG90aGVyLnopKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy53IC0gb3RoZXIudykgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy53KSwgTWF0aC5hYnMob3RoZXIudykpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgdGhlIHZlY3RvciBlcXVhbHMgYW5vdGhlciBvbmVcbiAgICAgKiAhI3poIOWIpOaWreW9k+WJjeWQkemHj+aYr+WQpuWcqOivr+W3ruiMg+WbtOWGheS4juaMh+WumuWIhumHj+eahOWQkemHj+ebuOetieOAglxuICAgICAqIEBtZXRob2QgZXF1YWxzNGZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIOebuOavlOi+g+eahOWQkemHj+eahCB4IOWIhumHj+OAglxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0g55u45q+U6L6D55qE5ZCR6YeP55qEIHkg5YiG6YeP44CCXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHogLSDnm7jmr5TovoPnmoTlkJHph4/nmoQgeiDliIbph4/jgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdyAtIOebuOavlOi+g+eahOWQkemHj+eahCB3IOWIhumHj+OAglxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZXBzaWxvbl0gLSDlhYHorrjnmoTor6/lt67vvIzlupTkuLrpnZ7otJ/mlbDjgIJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gLSDlvZPkuKTlkJHph4/nmoTlkITliIbph4/pg73lnKjmjIflrprnmoTor6/lt67ojIPlm7TlhoXliIbliKvnm7jnrYnml7bvvIzov5Tlm54gYHRydWVg77yb5ZCm5YiZ6L+U5ZueIGBmYWxzZWDjgIJcbiAgICAgKi9cbiAgICBwdWJsaWMgZXF1YWxzNGYgKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlciwgZXBzaWxvbiA9IEVQU0lMT04pIHtcbiAgICAgICAgcmV0dXJuIChNYXRoLmFicyh0aGlzLnggLSB4KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLngpLCBNYXRoLmFicyh4KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKHRoaXMueSAtIHkpIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKHRoaXMueSksIE1hdGguYWJzKHkpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnModGhpcy56IC0geikgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnModGhpcy56KSwgTWF0aC5hYnMoeikpICYmXG4gICAgICAgICAgICBNYXRoLmFicyh0aGlzLncgLSB3KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyh0aGlzLncpLCBNYXRoLmFicyh3KSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciBzdHJpY3QgZXF1YWxzIG90aGVyIFZlYzRcbiAgICAgKiAhI3poIOWIpOaWreW9k+WJjeWQkemHj+aYr+WQpuS4juaMh+WumuWQkemHj+ebuOetieOAguS4pOWQkemHj+eahOWQhOWIhumHj+mDveWIhuWIq+ebuOetieaXtui/lOWbniBgdHJ1ZWDvvJvlkKbliJnov5Tlm54gYGZhbHNlYOOAglxuICAgICAqIEBtZXRob2Qgc3RyaWN0RXF1YWxzXG4gICAgICogQHBhcmFtIHtWZWM0fSBvdGhlciAtIOebuOavlOi+g+eahOWQkemHj+OAglxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHB1YmxpYyBzdHJpY3RFcXVhbHMgKG90aGVyOiBWZWM0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IG90aGVyLnggJiYgdGhpcy55ID09PSBvdGhlci55ICYmIHRoaXMueiA9PT0gb3RoZXIueiAmJiB0aGlzLncgPT09IG90aGVyLnc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVjayB3aGV0aGVyIHN0cmljdCBlcXVhbHMgb3RoZXIgVmVjNFxuICAgICAqICEjemgg5Yik5pat5b2T5YmN5ZCR6YeP5piv5ZCm5LiO5oyH5a6a5YiG6YeP55qE5ZCR6YeP55u4562J44CC5Lik5ZCR6YeP55qE5ZCE5YiG6YeP6YO95YiG5Yir55u4562J5pe26L+U5ZueIGB0cnVlYO+8m+WQpuWImei/lOWbniBgZmFsc2Vg44CCXG4gICAgICogQG1ldGhvZCBzdHJpY3RFcXVhbHM0ZlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0g5oyH5a6a5ZCR6YeP55qEIHgg5YiG6YeP44CCXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSDmjIflrprlkJHph4/nmoQgeSDliIbph4/jgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geiAtIOaMh+WumuWQkemHj+eahCB6IOWIhumHj+OAglxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3IC0g5oyH5a6a5ZCR6YeP55qEIHcg5YiG6YeP44CCXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgcHVibGljIHN0cmljdEVxdWFsczRmICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0geCAmJiB0aGlzLnkgPT09IHkgJiYgdGhpcy56ID09PSB6ICYmIHRoaXMudyA9PT0gdztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENhbGN1bGF0ZSBsaW5lYXIgaW50ZXJwb2xhdGlvbiByZXN1bHQgYmV0d2VlbiB0aGlzIHZlY3RvciBhbmQgYW5vdGhlciBvbmUgd2l0aCBnaXZlbiByYXRpb1xuICAgICAqICEjemgg5qC55o2u5oyH5a6a55qE5o+S5YC85q+U546H77yM5LuO5b2T5YmN5ZCR6YeP5Yiw55uu5qCH5ZCR6YeP5LmL6Ze05YGa5o+S5YC844CCXG4gICAgICogQG1ldGhvZCBsZXJwXG4gICAgICogQHBhcmFtIHtWZWM0fSB0byDnm67moIflkJHph4/jgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmF0aW8g5o+S5YC85q+U546H77yM6IyD5Zu05Li6IFswLDFd44CCXG4gICAgICogQHJldHVybnMge1ZlYzR9XG4gICAgICovXG4gICAgcHVibGljIGxlcnAgKHRvOiBWZWM0LCByYXRpbzogbnVtYmVyKSB7XG4gICAgICAgIF94ID0gdGhpcy54O1xuICAgICAgICBfeSA9IHRoaXMueTtcbiAgICAgICAgX3ogPSB0aGlzLno7XG4gICAgICAgIF93ID0gdGhpcy53O1xuICAgICAgICB0aGlzLnggPSBfeCArIHJhdGlvICogKHRvLnggLSBfeCk7XG4gICAgICAgIHRoaXMueSA9IF95ICsgcmF0aW8gKiAodG8ueSAtIF95KTtcbiAgICAgICAgdGhpcy56ID0gX3ogKyByYXRpbyAqICh0by56IC0gX3opO1xuICAgICAgICB0aGlzLncgPSBfdyArIHJhdGlvICogKHRvLncgLSBfdyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVHJhbnNmb3JtIHRvIHN0cmluZyB3aXRoIHZlY3RvciBpbmZvcm1hdGlvbnNcbiAgICAgKiAhI3poIOi/lOWbnuW9k+WJjeWQkemHj+eahOWtl+espuS4suihqOekuuOAglxuICAgICAqIEBtZXRob2QgdG9TdHJpbmdcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSDlvZPliY3lkJHph4/nmoTlrZfnrKbkuLLooajnpLrjgIJcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9TdHJpbmcgKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgKCR7dGhpcy54LnRvRml4ZWQoMil9LCAke3RoaXMueS50b0ZpeGVkKDIpfSwgJHt0aGlzLnoudG9GaXhlZCgyKX0sICR7dGhpcy53LnRvRml4ZWQoMil9KWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDbGFtcCB0aGUgdmVjdG9yIGJldHdlZW4gbWluSW5jbHVzaXZlIGFuZCBtYXhJbmNsdXNpdmUuXG4gICAgICogISN6aCDorr7nva7lvZPliY3lkJHph4/nmoTlgLzvvIzkvb/lhbblkITkuKrliIbph4/pg73lpITkuo7mjIflrprnmoTojIPlm7TlhoXjgIJcbiAgICAgKiBAbWV0aG9kIGNsYW1wZlxuICAgICAqIEBwYXJhbSB7VmVjNH0gbWluSW5jbHVzaXZlIOavj+S4quWIhumHj+mDveS7o+ihqOS6huWvueW6lOWIhumHj+WFgeiuuOeahOacgOWwj+WAvOOAglxuICAgICAqIEBwYXJhbSB7VmVjNH0gbWF4SW5jbHVzaXZlIOavj+S4quWIhumHj+mDveS7o+ihqOS6huWvueW6lOWIhumHj+WFgeiuuOeahOacgOWkp+WAvOOAglxuICAgICAqIEByZXR1cm5zIHtWZWM0fVxuICAgICAqL1xuICAgIHB1YmxpYyBjbGFtcGYgKG1pbkluY2x1c2l2ZTogVmVjNCwgbWF4SW5jbHVzaXZlOiBWZWM0KSB7XG4gICAgICAgIHRoaXMueCA9IGNsYW1wKHRoaXMueCwgbWluSW5jbHVzaXZlLngsIG1heEluY2x1c2l2ZS54KTtcbiAgICAgICAgdGhpcy55ID0gY2xhbXAodGhpcy55LCBtaW5JbmNsdXNpdmUueSwgbWF4SW5jbHVzaXZlLnkpO1xuICAgICAgICB0aGlzLnogPSBjbGFtcCh0aGlzLnosIG1pbkluY2x1c2l2ZS56LCBtYXhJbmNsdXNpdmUueik7XG4gICAgICAgIHRoaXMudyA9IGNsYW1wKHRoaXMudywgbWluSW5jbHVzaXZlLncsIG1heEluY2x1c2l2ZS53KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIHRoaXMgdmVjdG9yLiBJZiB5b3Ugd2FudCB0byBzYXZlIHJlc3VsdCB0byBhbm90aGVyIHZlY3RvciwgdXNlIGFkZCgpIGluc3RlYWQuXG4gICAgICogISN6aCDlkJHph4/liqDms5XjgILlpoLmnpzkvaDmg7Pkv53lrZjnu5PmnpzliLDlj6bkuIDkuKrlkJHph4/vvIzkvb/nlKggYWRkKCkg5Luj5pu/44CCXG4gICAgICogQG1ldGhvZCBhZGRTZWxmXG4gICAgICogQHBhcmFtIHtWZWM0fSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgYWRkU2VsZiAodmVjdG9yOiBWZWM0KTogdGhpcyB7XG4gICAgICAgIHRoaXMueCArPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpcy55ICs9IHZlY3Rvci55O1xuICAgICAgICB0aGlzLnogKz0gdmVjdG9yLno7XG4gICAgICAgIHRoaXMudyArPSB2ZWN0b3IudztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBBZGRzIHR3byB2ZWN0b3JzLCBhbmQgcmV0dXJucyB0aGUgbmV3IHJlc3VsdC5cbiAgICAgKiAhI3poIOWQkemHj+WKoOazle+8jOW5tui/lOWbnuaWsOe7k+aenOOAglxuICAgICAqIEBtZXRob2QgYWRkXG4gICAgICogQHBhcmFtIHtWZWM0fSB2ZWN0b3JcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IFtvdXRdIC0gb3B0aW9uYWwsIHRoZSByZWNlaXZpbmcgdmVjdG9yLCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgdmVjNCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgdmVjNCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgYWRkICh2ZWN0b3I6IFZlYzQsIG91dD86IFZlYzQpOiBWZWM0IHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWM0KCk7XG4gICAgICAgIG91dC54ID0gdGhpcy54ICsgdmVjdG9yLng7XG4gICAgICAgIG91dC55ID0gdGhpcy55ICsgdmVjdG9yLnk7XG4gICAgICAgIG91dC56ID0gdGhpcy56ICsgdmVjdG9yLno7XG4gICAgICAgIG91dC53ID0gdGhpcy53ICsgdmVjdG9yLnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBTdWJ0cmFjdHMgb25lIHZlY3RvciBmcm9tIHRoaXMsIGFuZCByZXR1cm5zIHRoZSBuZXcgcmVzdWx0LlxuICAgICAqICEjemgg5ZCR6YeP5YeP5rOV77yM5bm26L+U5Zue5paw57uT5p6c44CCXG4gICAgICogQG1ldGhvZCBzdWJ0cmFjdFxuICAgICAqIEBwYXJhbSB7VmVjNH0gdmVjdG9yXG4gICAgICogQHBhcmFtIHtWZWM0fSBbb3V0XSAtIG9wdGlvbmFsLCB0aGUgcmVjZWl2aW5nIHZlY3RvciwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIHZlYzQgdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzQgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjNH0gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIHN1YnRyYWN0ICh2ZWN0b3I6IFZlYzQsIG91dD86IFZlYzQpOiBWZWM0IHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWM0KCk7XG4gICAgICAgIG91dC54ID0gdGhpcy54IC0gdmVjdG9yLng7XG4gICAgICAgIG91dC55ID0gdGhpcy55IC0gdmVjdG9yLnk7XG4gICAgICAgIG91dC56ID0gdGhpcy56IC0gdmVjdG9yLno7XG4gICAgICAgIG91dC53ID0gdGhpcy53IC0gdmVjdG9yLnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIHRoaXMgYnkgYSBudW1iZXIuXG4gICAgICogISN6aCDnvKnmlL7lvZPliY3lkJHph4/jgIJcbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5U2NhbGFyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBtdWx0aXBseVNjYWxhciAobnVtOiBudW1iZXIpOiB0aGlzIHtcbiAgICAgICAgdGhpcy54ICo9IG51bTtcbiAgICAgICAgdGhpcy55ICo9IG51bTtcbiAgICAgICAgdGhpcy56ICo9IG51bTtcbiAgICAgICAgdGhpcy53ICo9IG51bTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBsaWVzIHR3byB2ZWN0b3JzLlxuICAgICAqICEjemgg5YiG6YeP55u45LmY44CCXG4gICAgICogQG1ldGhvZCBtdWx0aXBseVxuICAgICAqIEBwYXJhbSB7VmVjNH0gdmVjdG9yXG4gICAgICogQHJldHVybiB7VmVjNH0gcmV0dXJucyB0aGlzXG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIG11bHRpcGx5ICh2ZWN0b3I6IFZlYzQpOiB0aGlzIHtcbiAgICAgICAgdGhpcy54ICo9IHZlY3Rvci54O1xuICAgICAgICB0aGlzLnkgKj0gdmVjdG9yLnk7XG4gICAgICAgIHRoaXMueiAqPSB2ZWN0b3IuejtcbiAgICAgICAgdGhpcy53ICo9IHZlY3Rvci53O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERpdmlkZXMgYnkgYSBudW1iZXIuXG4gICAgICogISN6aCDlkJHph4/pmaTms5XjgIJcbiAgICAgKiBAbWV0aG9kIGRpdmlkZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAgICAgKiBAcmV0dXJuIHtWZWM0fSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgZGl2aWRlIChudW06IG51bWJlcik6IHRoaXMge1xuICAgICAgICB0aGlzLnggLz0gbnVtO1xuICAgICAgICB0aGlzLnkgLz0gbnVtO1xuICAgICAgICB0aGlzLnogLz0gbnVtO1xuICAgICAgICB0aGlzLncgLz0gbnVtO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE5lZ2F0ZXMgdGhlIGNvbXBvbmVudHMuXG4gICAgICogISN6aCDlkJHph4/lj5blj41cbiAgICAgKiBAbWV0aG9kIG5lZ2F0ZVxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBuZWdhdGUgKCk6IHRoaXMge1xuICAgICAgICB0aGlzLnggPSAtdGhpcy54O1xuICAgICAgICB0aGlzLnkgPSAtdGhpcy55O1xuICAgICAgICB0aGlzLnogPSAtdGhpcy56O1xuICAgICAgICB0aGlzLncgPSAtdGhpcy53O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERvdCBwcm9kdWN0XG4gICAgICogISN6aCDlvZPliY3lkJHph4/kuI7mjIflrprlkJHph4/ov5vooYzngrnkuZjjgIJcbiAgICAgKiBAbWV0aG9kIGRvdFxuICAgICAqIEBwYXJhbSB7VmVjNH0gW3ZlY3Rvcl1cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSByZXN1bHRcbiAgICAgKi9cbiAgICBkb3QgKHZlY3RvcjogVmVjNCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2ZWN0b3IueCArIHRoaXMueSAqIHZlY3Rvci55ICsgdGhpcy56ICogdmVjdG9yLnogKyB0aGlzLncgKiB2ZWN0b3IudztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENyb3NzIHByb2R1Y3RcbiAgICAgKiAhI3poIOW9k+WJjeWQkemHj+S4juaMh+WumuWQkemHj+i/m+ihjOWPieS5mOOAglxuICAgICAqIEBtZXRob2QgY3Jvc3NcbiAgICAgKiBAcGFyYW0ge1ZlYzR9IHZlY3RvclxuICAgICAqIEBwYXJhbSB7VmVjNH0gW291dF1cbiAgICAgKiBAcmV0dXJuIHtWZWM0fSB0aGUgcmVzdWx0XG4gICAgICovXG4gICAgY3Jvc3MgKHZlY3RvcjogVmVjNCwgb3V0PzogVmVjNCk6IFZlYzQge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzQoKTtcbiAgICAgICAgY29uc3QgeyB4OiBheCwgeTogYXksIHo6IGF6IH0gPSB0aGlzO1xuICAgICAgICBjb25zdCB7IHg6IGJ4LCB5OiBieSwgejogYnogfSA9IHZlY3RvcjtcblxuICAgICAgICBvdXQueCA9IGF5ICogYnogLSBheiAqIGJ5O1xuICAgICAgICBvdXQueSA9IGF6ICogYnggLSBheCAqIGJ6O1xuICAgICAgICBvdXQueiA9IGF4ICogYnkgLSBheSAqIGJ4O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoaXMgdmVjdG9yLlxuICAgICAqICEjemgg6L+U5Zue6K+l5ZCR6YeP55qE6ZW/5bqm44CCXG4gICAgICogQG1ldGhvZCBsZW5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IHRoZSByZXN1bHRcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciB2ID0gY2MudjQoMTAsIDEwKTtcbiAgICAgKiB2LmxlbigpOyAvLyByZXR1cm4gMTQuMTQyMTM1NjIzNzMwOTUxO1xuICAgICAqL1xuICAgIGxlbiAoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHggPSB0aGlzLngsXG4gICAgICAgICAgeSA9IHRoaXMueSxcbiAgICAgICAgICB6ID0gdGhpcy56LFxuICAgICAgICAgIHcgPSB0aGlzLnc7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6ICsgdyAqIHcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgc3F1YXJlZCBsZW5ndGggb2YgdGhpcyB2ZWN0b3IuXG4gICAgICogISN6aCDov5Tlm57or6XlkJHph4/nmoTplb/luqblubPmlrnjgIJcbiAgICAgKiBAbWV0aG9kIGxlbmd0aFNxclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gdGhlIHJlc3VsdFxuICAgICAqL1xuICAgIGxlbmd0aFNxciAoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IHggPSB0aGlzLngsXG4gICAgICAgICAgeSA9IHRoaXMueSxcbiAgICAgICAgICB6ID0gdGhpcy56LFxuICAgICAgICAgIHcgPSB0aGlzLnc7XG4gICAgICAgIHJldHVybiB4ICogeCArIHkgKiB5ICsgeiAqIHogKyB3ICogdztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIE1ha2UgdGhlIGxlbmd0aCBvZiB0aGlzIHZlY3RvciB0byAxLlxuICAgICAqICEjemgg5ZCR6YeP5b2S5LiA5YyW77yM6K6p6L+Z5Liq5ZCR6YeP55qE6ZW/5bqm5Li6IDHjgIJcbiAgICAgKiBAbWV0aG9kIG5vcm1hbGl6ZVNlbGZcbiAgICAgKiBAcmV0dXJuIHtWZWM0fSByZXR1cm5zIHRoaXNcbiAgICAgKiBAY2hhaW5hYmxlXG4gICAgICovXG4gICAgbm9ybWFsaXplU2VsZiAoKSB7XG4gICAgICAgIHRoaXMubm9ybWFsaXplKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGlzIHZlY3RvciB3aXRoIGEgbWFnbml0dWRlIG9mIDEuPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIE5vdGUgdGhhdCB0aGUgY3VycmVudCB2ZWN0b3IgaXMgdW5jaGFuZ2VkIGFuZCBhIG5ldyBub3JtYWxpemVkIHZlY3RvciBpcyByZXR1cm5lZC4gSWYgeW91IHdhbnQgdG8gbm9ybWFsaXplIHRoZSBjdXJyZW50IHZlY3RvciwgdXNlIG5vcm1hbGl6ZVNlbGYgZnVuY3Rpb24uXG4gICAgICogISN6aFxuICAgICAqIOi/lOWbnuW9kuS4gOWMluWQjueahOWQkemHj+OAgjxici8+XG4gICAgICogPGJyLz5cbiAgICAgKiDms6jmhI/vvIzlvZPliY3lkJHph4/kuI3lj5jvvIzlubbov5Tlm57kuIDkuKrmlrDnmoTlvZLkuIDljJblkJHph4/jgILlpoLmnpzkvaDmg7PmnaXlvZLkuIDljJblvZPliY3lkJHph4/vvIzlj6/kvb/nlKggbm9ybWFsaXplU2VsZiDlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIG5vcm1hbGl6ZVxuICAgICAqIEBwYXJhbSB7VmVjNH0gW291dF0gLSBvcHRpb25hbCwgdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWM0IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWM0IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzR9IHJlc3VsdFxuICAgICAqL1xuICAgIG5vcm1hbGl6ZSAob3V0PzogVmVjNCk6IFZlYzQge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzQoKTtcbiAgICAgICAgX3ggPSB0aGlzLng7XG4gICAgICAgIF95ID0gdGhpcy55O1xuICAgICAgICBfeiA9IHRoaXMuejtcbiAgICAgICAgX3cgPSB0aGlzLnc7XG4gICAgICAgIGxldCBsZW4gPSBfeCAqIF94ICsgX3kgKiBfeSArIF96ICogX3ogKyBfdyAqIF93O1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xuICAgICAgICAgICAgb3V0LnggPSBfeCAqIGxlbjtcbiAgICAgICAgICAgIG91dC55ID0gX3kgKiBsZW47XG4gICAgICAgICAgICBvdXQueiA9IF96ICogbGVuO1xuICAgICAgICAgICAgb3V0LncgPSBfdyAqIGxlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybXMgdGhlIHZlYzQgd2l0aCBhIG1hdDQuIDR0aCB2ZWN0b3IgY29tcG9uZW50IGlzIGltcGxpY2l0bHkgJzEnXG4gICAgICogQG1ldGhvZCB0cmFuc2Zvcm1NYXQ0XG4gICAgICogQHBhcmFtIHtNYXQ0fSBtIG1hdHJpeCB0byB0cmFuc2Zvcm0gd2l0aFxuICAgICAqIEBwYXJhbSB7VmVjNH0gW291dF0gdGhlIHJlY2VpdmluZyB2ZWN0b3IsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSB2ZWM0IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWM0IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtWZWM0fSBvdXRcbiAgICAgKi9cbiAgICB0cmFuc2Zvcm1NYXQ0IChtYXRyaXg6IE1hdDQsIG91dDogVmVjNCk6IFZlYzQge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzQoKTtcbiAgICAgICAgX3ggPSB0aGlzLng7XG4gICAgICAgIF95ID0gdGhpcy55O1xuICAgICAgICBfeiA9IHRoaXMuejtcbiAgICAgICAgX3cgPSB0aGlzLnc7XG4gICAgICAgIGxldCBtID0gbWF0cml4Lm07XG4gICAgICAgIG91dC54ID0gbVswXSAqIF94ICsgbVs0XSAqIF95ICsgbVs4XSAgKiBfeiArIG1bMTJdICogX3c7XG4gICAgICAgIG91dC55ID0gbVsxXSAqIF94ICsgbVs1XSAqIF95ICsgbVs5XSAgKiBfeiArIG1bMTNdICogX3c7XG4gICAgICAgIG91dC56ID0gbVsyXSAqIF94ICsgbVs2XSAqIF95ICsgbVsxMF0gKiBfeiArIG1bMTRdICogX3c7XG4gICAgICAgIG91dC53ID0gbVszXSAqIF94ICsgbVs3XSAqIF95ICsgbVsxMV0gKiBfeiArIG1bMTVdICogX3c7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbWF4aW11bSB2YWx1ZSBpbiB4LCB5LCB6LCB3LlxuICAgICAqIEBtZXRob2QgbWF4QXhpc1xuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgbWF4QXhpcyAoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRoaXMueCwgdGhpcy55LCB0aGlzLnosIHRoaXMudyk7XG4gICAgfVxufVxuXG5DQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLlZlYzQnLCBWZWM0LCB7IHg6IDAsIHk6IDAsIHo6IDAsIHc6IDAgfSk7XG5cbmV4cG9ydCBmdW5jdGlvbiB2NCAob3RoZXI6IFZlYzQpOiBWZWM0O1xuZXhwb3J0IGZ1bmN0aW9uIHY0ICh4PzogbnVtYmVyLCB5PzogbnVtYmVyLCB6PzogbnVtYmVyLCB3PzogbnVtYmVyKTogVmVjNDtcblxuZXhwb3J0IGZ1bmN0aW9uIHY0ICh4PzogbnVtYmVyIHwgVmVjNCwgeT86IG51bWJlciwgej86IG51bWJlciwgdz86IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgVmVjNCh4IGFzIGFueSwgeSwgeiwgdyk7XG59XG5cbmNjLnY0ID0gdjQ7XG5jYy5WZWM0ID0gVmVjNDtcbiJdfQ==