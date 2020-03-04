
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/mat4.js';
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

var _vec = _interopRequireDefault(require("./vec3"));

var _quat = _interopRequireDefault(require("./quat"));

var _utils = require("./utils");

var _mat = _interopRequireDefault(require("./mat3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _a00 = 0;
var _a01 = 0;
var _a02 = 0;
var _a03 = 0;
var _a10 = 0;
var _a11 = 0;
var _a12 = 0;
var _a13 = 0;
var _a20 = 0;
var _a21 = 0;
var _a22 = 0;
var _a23 = 0;
var _a30 = 0;
var _a31 = 0;
var _a32 = 0;
var _a33 = 0;
/**
 * !#en Representation of 4*4 matrix.
 * !#zh 表示 4*4 矩阵
 *
 * @class Mat4
 * @extends ValueType
 */

var Mat4 =
/*#__PURE__*/
function (_ValueType) {
  _inheritsLoose(Mat4, _ValueType);

  var _proto = Mat4.prototype;

  /**
   * !#en Multiply the current matrix with another one
   * !#zh 将当前矩阵与指定矩阵相乘
   * @method mul
   * @param {Mat4} other the second operand
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  _proto.mul = function mul(m, out) {
    return Mat4.multiply(out || new Mat4(), this, m);
  }
  /**
   * !#en Multiply each element of the matrix by a scalar.
   * !#zh 将矩阵的每一个元素都乘以指定的缩放值。
   * @method mulScalar
   * @param {Number} number amount to scale the matrix's elements by
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.mulScalar = function mulScalar(num, out) {
    Mat4.multiplyScalar(out || new Mat4(), this, num);
  }
  /**
   * !#en Subtracts the current matrix with another one
   * !#zh 将当前矩阵与指定的矩阵相减
   * @method sub
   * @param {Mat4} other the second operand
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.sub = function sub(m, out) {
    Mat4.subtract(out || new Mat4(), this, m);
  }
  /**
   * Identity  of Mat4
   * @property {Mat4} IDENTITY
   * @static
   */
  ;

  /**
   * !#zh 获得指定矩阵的拷贝
   * !#en Copy of the specified matrix to obtain
   * @method clone
   * @typescript
   * clone<Out extends IMat4Like> (a: Out)
   * @static
   */
  Mat4.clone = function clone(a) {
    var m = a.m;
    return new Mat4(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);
  }
  /**
   * !#zh 复制目标矩阵
   * !#en Copy the target matrix
   * @method copy
   * @typescript
   * copy<Out extends IMat4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Mat4.copy = function copy(out, a) {
    var m = out.m,
        am = a.m;
    m[0] = am[0];
    m[1] = am[1];
    m[2] = am[2];
    m[3] = am[3];
    m[4] = am[4];
    m[5] = am[5];
    m[6] = am[6];
    m[7] = am[7];
    m[8] = am[8];
    m[9] = am[9];
    m[10] = am[10];
    m[11] = am[11];
    m[12] = am[12];
    m[13] = am[13];
    m[14] = am[14];
    m[15] = am[15];
    return out;
  }
  /**
   * !#zh 设置矩阵值
   * !#en Setting matrix values
   * @static
   */
  ;

  Mat4.set = function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var m = out.m;
    m[0] = m00;
    m[1] = m01;
    m[2] = m02;
    m[3] = m03;
    m[4] = m10;
    m[5] = m11;
    m[6] = m12;
    m[7] = m13;
    m[8] = m20;
    m[9] = m21;
    m[10] = m22;
    m[11] = m23;
    m[12] = m30;
    m[13] = m31;
    m[14] = m32;
    m[15] = m33;
    return out;
  }
  /**
   * !#zh 将目标赋值为单位矩阵
   * !#en The target of an assignment is the identity matrix
   * @method identity
   * @typescript
   * identity<Out extends IMat4Like> (out: Out)
   * @static
   */
  ;

  Mat4.identity = function identity(out) {
    var m = out.m;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 转置矩阵
   * !#en Transposed matrix
   * @method transpose
   * @typescript
   * transpose<Out extends IMat4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Mat4.transpose = function transpose(out, a) {
    var m = out.m,
        am = a.m; // If we are transposing ourselves we can skip a few steps but have to cache some values

    if (out === a) {
      var a01 = am[1],
          a02 = am[2],
          a03 = am[3],
          a12 = am[6],
          a13 = am[7],
          a23 = am[11];
      m[1] = am[4];
      m[2] = am[8];
      m[3] = am[12];
      m[4] = a01;
      m[6] = am[9];
      m[7] = am[13];
      m[8] = a02;
      m[9] = a12;
      m[11] = am[14];
      m[12] = a03;
      m[13] = a13;
      m[14] = a23;
    } else {
      m[0] = am[0];
      m[1] = am[4];
      m[2] = am[8];
      m[3] = am[12];
      m[4] = am[1];
      m[5] = am[5];
      m[6] = am[9];
      m[7] = am[13];
      m[8] = am[2];
      m[9] = am[6];
      m[10] = am[10];
      m[11] = am[14];
      m[12] = am[3];
      m[13] = am[7];
      m[14] = am[11];
      m[15] = am[15];
    }

    return out;
  }
  /**
   * !#zh 矩阵求逆
   * !#en Matrix inversion
   * @method invert
   * @typescript
   * invert<Out extends IMat4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Mat4.invert = function invert(out, a) {
    var am = a.m;
    _a00 = am[0];
    _a01 = am[1];
    _a02 = am[2];
    _a03 = am[3];
    _a10 = am[4];
    _a11 = am[5];
    _a12 = am[6];
    _a13 = am[7];
    _a20 = am[8];
    _a21 = am[9];
    _a22 = am[10];
    _a23 = am[11];
    _a30 = am[12];
    _a31 = am[13];
    _a32 = am[14];
    _a33 = am[15];
    var b00 = _a00 * _a11 - _a01 * _a10;
    var b01 = _a00 * _a12 - _a02 * _a10;
    var b02 = _a00 * _a13 - _a03 * _a10;
    var b03 = _a01 * _a12 - _a02 * _a11;
    var b04 = _a01 * _a13 - _a03 * _a11;
    var b05 = _a02 * _a13 - _a03 * _a12;
    var b06 = _a20 * _a31 - _a21 * _a30;
    var b07 = _a20 * _a32 - _a22 * _a30;
    var b08 = _a20 * _a33 - _a23 * _a30;
    var b09 = _a21 * _a32 - _a22 * _a31;
    var b10 = _a21 * _a33 - _a23 * _a31;
    var b11 = _a22 * _a33 - _a23 * _a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det === 0) {
      return null;
    }

    det = 1.0 / det;
    var m = out.m;
    m[0] = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
    m[1] = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
    m[2] = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
    m[3] = (_a22 * b04 - _a21 * b05 - _a23 * b03) * det;
    m[4] = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
    m[5] = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
    m[6] = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
    m[7] = (_a20 * b05 - _a22 * b02 + _a23 * b01) * det;
    m[8] = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
    m[9] = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
    m[10] = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
    m[11] = (_a21 * b02 - _a20 * b04 - _a23 * b00) * det;
    m[12] = (_a11 * b07 - _a10 * b09 - _a12 * b06) * det;
    m[13] = (_a00 * b09 - _a01 * b07 + _a02 * b06) * det;
    m[14] = (_a31 * b01 - _a30 * b03 - _a32 * b00) * det;
    m[15] = (_a20 * b03 - _a21 * b01 + _a22 * b00) * det;
    return out;
  }
  /**
   * !#zh 矩阵行列式
   * !#en Matrix determinant
   * @method determinant
   * @typescript
   * determinant<Out extends IMat4Like> (a: Out): number
   * @static
   */
  ;

  Mat4.determinant = function determinant(a) {
    var m = a.m;
    _a00 = m[0];
    _a01 = m[1];
    _a02 = m[2];
    _a03 = m[3];
    _a10 = m[4];
    _a11 = m[5];
    _a12 = m[6];
    _a13 = m[7];
    _a20 = m[8];
    _a21 = m[9];
    _a22 = m[10];
    _a23 = m[11];
    _a30 = m[12];
    _a31 = m[13];
    _a32 = m[14];
    _a33 = m[15];
    var b00 = _a00 * _a11 - _a01 * _a10;
    var b01 = _a00 * _a12 - _a02 * _a10;
    var b02 = _a00 * _a13 - _a03 * _a10;
    var b03 = _a01 * _a12 - _a02 * _a11;
    var b04 = _a01 * _a13 - _a03 * _a11;
    var b05 = _a02 * _a13 - _a03 * _a12;
    var b06 = _a20 * _a31 - _a21 * _a30;
    var b07 = _a20 * _a32 - _a22 * _a30;
    var b08 = _a20 * _a33 - _a23 * _a30;
    var b09 = _a21 * _a32 - _a22 * _a31;
    var b10 = _a21 * _a33 - _a23 * _a31;
    var b11 = _a22 * _a33 - _a23 * _a32; // Calculate the determinant

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  /**
   * !#zh 矩阵乘法
   * !#en Matrix Multiplication
   * @method multiply
   * @typescript
   * multiply<Out extends IMat4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Mat4.multiply = function multiply(out, a, b) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    _a00 = am[0];
    _a01 = am[1];
    _a02 = am[2];
    _a03 = am[3];
    _a10 = am[4];
    _a11 = am[5];
    _a12 = am[6];
    _a13 = am[7];
    _a20 = am[8];
    _a21 = am[9];
    _a22 = am[10];
    _a23 = am[11];
    _a30 = am[12];
    _a31 = am[13];
    _a32 = am[14];
    _a33 = am[15]; // Cache only the current line of the second matrix

    var b0 = bm[0],
        b1 = bm[1],
        b2 = bm[2],
        b3 = bm[3];
    m[0] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[1] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[2] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[3] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    b0 = bm[4];
    b1 = bm[5];
    b2 = bm[6];
    b3 = bm[7];
    m[4] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[5] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[6] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[7] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    b0 = bm[8];
    b1 = bm[9];
    b2 = bm[10];
    b3 = bm[11];
    m[8] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[9] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[10] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[11] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    b0 = bm[12];
    b1 = bm[13];
    b2 = bm[14];
    b3 = bm[15];
    m[12] = b0 * _a00 + b1 * _a10 + b2 * _a20 + b3 * _a30;
    m[13] = b0 * _a01 + b1 * _a11 + b2 * _a21 + b3 * _a31;
    m[14] = b0 * _a02 + b1 * _a12 + b2 * _a22 + b3 * _a32;
    m[15] = b0 * _a03 + b1 * _a13 + b2 * _a23 + b3 * _a33;
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入变换
   * !#en Was added in a given transformation matrix transformation on the basis of
   * @method transform
   * @typescript
   * transform<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike)
   * @static
   */
  ;

  Mat4.transform = function transform(out, a, v) {
    var x = v.x,
        y = v.y,
        z = v.z;
    var m = out.m,
        am = a.m;

    if (a === out) {
      m[12] = am[0] * x + am[4] * y + am[8] * z + am[12];
      m[13] = am[1] * x + am[5] * y + am[9] * z + am[13];
      m[14] = am[2] * x + am[6] * y + am[10] * z + am[14];
      m[15] = am[3] * x + am[7] * y + am[11] * z + am[15];
    } else {
      _a00 = am[0];
      _a01 = am[1];
      _a02 = am[2];
      _a03 = am[3];
      _a10 = am[4];
      _a11 = am[5];
      _a12 = am[6];
      _a13 = am[7];
      _a20 = am[8];
      _a21 = am[9];
      _a22 = am[10];
      _a23 = am[11];
      _a30 = am[12];
      _a31 = am[13];
      _a32 = am[14];
      _a33 = am[15];
      m[0] = _a00;
      m[1] = _a01;
      m[2] = _a02;
      m[3] = _a03;
      m[4] = _a10;
      m[5] = _a11;
      m[6] = _a12;
      m[7] = _a13;
      m[8] = _a20;
      m[9] = _a21;
      m[10] = _a22;
      m[11] = _a23;
      m[12] = _a00 * x + _a10 * y + _a20 * z + am[12];
      m[13] = _a01 * x + _a11 * y + _a21 * z + am[13];
      m[14] = _a02 * x + _a12 * y + _a22 * z + am[14];
      m[15] = _a03 * x + _a13 * y + _a23 * z + am[15];
    }

    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入新位移变换
   * !#en Add new displacement transducer in a matrix transformation on the basis of a given
   * @method translate
   * @typescript
   * translate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike)
   * @static
   */
  ;

  Mat4.translate = function translate(out, a, v) {
    var m = out.m,
        am = a.m;

    if (a === out) {
      m[12] += v.x;
      m[13] += v.y;
      m[14] += v.y;
    } else {
      m[0] = am[0];
      m[1] = am[1];
      m[2] = am[2];
      m[3] = am[3];
      m[4] = am[4];
      m[5] = am[5];
      m[6] = am[6];
      m[7] = am[7];
      m[8] = am[8];
      m[9] = am[9];
      m[10] = am[10];
      m[11] = am[11];
      m[12] += v.x;
      m[13] += v.y;
      m[14] += v.z;
      m[15] = am[15];
    }

    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入新缩放变换
   * !#en Add new scaling transformation in a given matrix transformation on the basis of
   * @method scale
   * @typescript
   * scale<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, v: VecLike)
   * @static
   */
  ;

  Mat4.scale = function scale(out, a, v) {
    var x = v.x,
        y = v.y,
        z = v.z;
    var m = out.m,
        am = a.m;
    m[0] = am[0] * x;
    m[1] = am[1] * x;
    m[2] = am[2] * x;
    m[3] = am[3] * x;
    m[4] = am[4] * y;
    m[5] = am[5] * y;
    m[6] = am[6] * y;
    m[7] = am[7] * y;
    m[8] = am[8] * z;
    m[9] = am[9] * z;
    m[10] = am[10] * z;
    m[11] = am[11] * z;
    m[12] = am[12];
    m[13] = am[13];
    m[14] = am[14];
    m[15] = am[15];
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入新旋转变换
   * !#en Add a new rotational transform matrix transformation on the basis of a given
   * @method rotate
   * @typescript
   * rotate<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, a: Out, rad: number, axis: VecLike)
   * @param rad 旋转角度
   * @param axis 旋转轴
   * @static
   */
  ;

  Mat4.rotate = function rotate(out, a, rad, axis) {
    var x = axis.x,
        y = axis.y,
        z = axis.z;
    var len = Math.sqrt(x * x + y * y + z * z);

    if (Math.abs(len) < _utils.EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var t = 1 - c;
    var am = a.m;
    _a00 = am[0];
    _a01 = am[1];
    _a02 = am[2];
    _a03 = am[3];
    _a10 = am[4];
    _a11 = am[5];
    _a12 = am[6];
    _a13 = am[7];
    _a20 = am[8];
    _a21 = am[9];
    _a22 = am[10];
    _a23 = am[11]; // Construct the elements of the rotation matrix

    var b00 = x * x * t + c,
        b01 = y * x * t + z * s,
        b02 = z * x * t - y * s;
    var b10 = x * y * t - z * s,
        b11 = y * y * t + c,
        b12 = z * y * t + x * s;
    var b20 = x * z * t + y * s,
        b21 = y * z * t - x * s,
        b22 = z * z * t + c;
    var m = out.m; // Perform rotation-specific matrix multiplication

    m[0] = _a00 * b00 + _a10 * b01 + _a20 * b02;
    m[1] = _a01 * b00 + _a11 * b01 + _a21 * b02;
    m[2] = _a02 * b00 + _a12 * b01 + _a22 * b02;
    m[3] = _a03 * b00 + _a13 * b01 + _a23 * b02;
    m[4] = _a00 * b10 + _a10 * b11 + _a20 * b12;
    m[5] = _a01 * b10 + _a11 * b11 + _a21 * b12;
    m[6] = _a02 * b10 + _a12 * b11 + _a22 * b12;
    m[7] = _a03 * b10 + _a13 * b11 + _a23 * b12;
    m[8] = _a00 * b20 + _a10 * b21 + _a20 * b22;
    m[9] = _a01 * b20 + _a11 * b21 + _a21 * b22;
    m[10] = _a02 * b20 + _a12 * b21 + _a22 * b22;
    m[11] = _a03 * b20 + _a13 * b21 + _a23 * b22; // If the source and destination differ, copy the unchanged last row

    if (a !== out) {
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    }

    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入绕 X 轴的旋转变换
   * !#en Add rotational transformation around the X axis at a given matrix transformation on the basis of
   * @method rotateX
   * @typescript
   * rotateX<Out extends IMat4Like> (out: Out, a: Out, rad: number)
   * @param rad 旋转角度
   * @static
   */
  ;

  Mat4.rotateX = function rotateX(out, a, rad) {
    var m = out.m,
        am = a.m;
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = am[4],
        a11 = am[5],
        a12 = am[6],
        a13 = am[7],
        a20 = am[8],
        a21 = am[9],
        a22 = am[10],
        a23 = am[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      m[0] = am[0];
      m[1] = am[1];
      m[2] = am[2];
      m[3] = am[3];
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    } // Perform axis-specific matrix multiplication


    m[4] = a10 * c + a20 * s;
    m[5] = a11 * c + a21 * s;
    m[6] = a12 * c + a22 * s;
    m[7] = a13 * c + a23 * s;
    m[8] = a20 * c - a10 * s;
    m[9] = a21 * c - a11 * s;
    m[10] = a22 * c - a12 * s;
    m[11] = a23 * c - a13 * s;
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入绕 Y 轴的旋转变换
   * !#en Add about the Y axis rotation transformation in a given matrix transformation on the basis of
   * @method rotateY
   * @typescript
   * rotateY<Out extends IMat4Like> (out: Out, a: Out, rad: number)
   * @param rad 旋转角度
   * @static
   */
  ;

  Mat4.rotateY = function rotateY(out, a, rad) {
    var m = out.m,
        am = a.m;
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a03 = am[3],
        a20 = am[8],
        a21 = am[9],
        a22 = am[10],
        a23 = am[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      m[4] = am[4];
      m[5] = am[5];
      m[6] = am[6];
      m[7] = am[7];
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    } // Perform axis-specific matrix multiplication


    m[0] = a00 * c - a20 * s;
    m[1] = a01 * c - a21 * s;
    m[2] = a02 * c - a22 * s;
    m[3] = a03 * c - a23 * s;
    m[8] = a00 * s + a20 * c;
    m[9] = a01 * s + a21 * c;
    m[10] = a02 * s + a22 * c;
    m[11] = a03 * s + a23 * c;
    return out;
  }
  /**
   * !#zh 在给定矩阵变换基础上加入绕 Z 轴的旋转变换
   * !#en Added about the Z axis at a given rotational transformation matrix transformation on the basis of
   * @method rotateZ
   * @typescript
   * rotateZ<Out extends IMat4Like> (out: Out, a: Out, rad: number)
   * @param rad 旋转角度
   * @static
   */
  ;

  Mat4.rotateZ = function rotateZ(out, a, rad) {
    var am = a.m;
    var m = out.m;
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a.m[0],
        a01 = a.m[1],
        a02 = a.m[2],
        a03 = a.m[3],
        a10 = a.m[4],
        a11 = a.m[5],
        a12 = a.m[6],
        a13 = a.m[7]; // If the source and destination differ, copy the unchanged last row

    if (a !== out) {
      m[8] = am[8];
      m[9] = am[9];
      m[10] = am[10];
      m[11] = am[11];
      m[12] = am[12];
      m[13] = am[13];
      m[14] = am[14];
      m[15] = am[15];
    } // Perform axis-specific matrix multiplication


    m[0] = a00 * c + a10 * s;
    m[1] = a01 * c + a11 * s;
    m[2] = a02 * c + a12 * s;
    m[3] = a03 * c + a13 * s;
    m[4] = a10 * c - a00 * s;
    m[5] = a11 * c - a01 * s;
    m[6] = a12 * c - a02 * s;
    m[7] = a13 * c - a03 * s;
    return out;
  }
  /**
   * !#zh 计算位移矩阵
   * !#en Displacement matrix calculation
   * @method fromTranslation
   * @typescript
   * fromTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike)
   * @static
   */
  ;

  Mat4.fromTranslation = function fromTranslation(out, v) {
    var m = out.m;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = v.x;
    m[13] = v.y;
    m[14] = v.z;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算缩放矩阵
   * !#en Scaling matrix calculation
   * @method fromScaling
   * @typescript
   * fromScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, v: VecLike)
   * @static
   */
  ;

  Mat4.fromScaling = function fromScaling(out, v) {
    var m = out.m;
    m[0] = v.x;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = v.y;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = v.z;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算旋转矩阵
   * !#en Calculates the rotation matrix
   * @method fromRotation
   * @typescript
   * fromRotation<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, rad: number, axis: VecLike)
   * @static
   */
  ;

  Mat4.fromRotation = function fromRotation(out, rad, axis) {
    var x = axis.x,
        y = axis.y,
        z = axis.z;
    var len = Math.sqrt(x * x + y * y + z * z);

    if (Math.abs(len) < _utils.EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var t = 1 - c; // Perform rotation-specific matrix multiplication

    var m = out.m;
    m[0] = x * x * t + c;
    m[1] = y * x * t + z * s;
    m[2] = z * x * t - y * s;
    m[3] = 0;
    m[4] = x * y * t - z * s;
    m[5] = y * y * t + c;
    m[6] = z * y * t + x * s;
    m[7] = 0;
    m[8] = x * z * t + y * s;
    m[9] = y * z * t - x * s;
    m[10] = z * z * t + c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算绕 X 轴的旋转矩阵
   * !#en Calculating rotation matrix about the X axis
   * @method fromXRotation
   * @typescript
   * fromXRotation<Out extends IMat4Like> (out: Out, rad: number)
   * @static
   */
  ;

  Mat4.fromXRotation = function fromXRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad); // Perform axis-specific matrix multiplication

    var m = out.m;
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = c;
    m[6] = s;
    m[7] = 0;
    m[8] = 0;
    m[9] = -s;
    m[10] = c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算绕 Y 轴的旋转矩阵
   * !#en Calculating rotation matrix about the Y axis
   * @method fromYRotation
   * @typescript
   * fromYRotation<Out extends IMat4Like> (out: Out, rad: number)
   * @static
   */
  ;

  Mat4.fromYRotation = function fromYRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad); // Perform axis-specific matrix multiplication

    var m = out.m;
    m[0] = c;
    m[1] = 0;
    m[2] = -s;
    m[3] = 0;
    m[4] = 0;
    m[5] = 1;
    m[6] = 0;
    m[7] = 0;
    m[8] = s;
    m[9] = 0;
    m[10] = c;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算绕 Z 轴的旋转矩阵
   * !#en Calculating rotation matrix about the Z axis
   * @method fromZRotation
   * @typescript
   * fromZRotation<Out extends IMat4Like> (out: Out, rad: number)
   * @static
   */
  ;

  Mat4.fromZRotation = function fromZRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad); // Perform axis-specific matrix multiplication

    var m = out.m;
    m[0] = c;
    m[1] = s;
    m[2] = 0;
    m[3] = 0;
    m[4] = -s;
    m[5] = c;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 1;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据旋转和位移信息计算矩阵
   * !#en The rotation and displacement information calculating matrix
   * @method fromRT
   * @typescript
   * fromRT<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike)
   * @static
   */
  ;

  Mat4.fromRT = function fromRT(out, q, v) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var m = out.m;
    m[0] = 1 - (yy + zz);
    m[1] = xy + wz;
    m[2] = xz - wy;
    m[3] = 0;
    m[4] = xy - wz;
    m[5] = 1 - (xx + zz);
    m[6] = yz + wx;
    m[7] = 0;
    m[8] = xz + wy;
    m[9] = yz - wx;
    m[10] = 1 - (xx + yy);
    m[11] = 0;
    m[12] = v.x;
    m[13] = v.y;
    m[14] = v.z;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 提取矩阵的位移信息, 默认矩阵中的变换以 S->R->T 的顺序应用
   * !#en Extracting displacement information of the matrix, the matrix transform to the default sequential application S-> R-> T is
   * @method getTranslation
   * @typescript
   * getTranslation<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out)
   * @static
   */
  ;

  Mat4.getTranslation = function getTranslation(out, mat) {
    var m = mat.m;
    out.x = m[12];
    out.y = m[13];
    out.z = m[14];
    return out;
  }
  /**
   * !#zh 提取矩阵的缩放信息, 默认矩阵中的变换以 S->R->T 的顺序应用
   * !#en Scaling information extraction matrix, the matrix transform to the default sequential application S-> R-> T is
   * @method getScaling
   * @typescript
   * getScaling<Out extends IMat4Like, VecLike extends IVec3Like> (out: VecLike, mat: Out)
   * @static
   */
  ;

  Mat4.getScaling = function getScaling(out, mat) {
    var m = mat.m;
    var m3 = m3_1.m;
    var m00 = m3[0] = m[0];
    var m01 = m3[1] = m[1];
    var m02 = m3[2] = m[2];
    var m04 = m3[3] = m[4];
    var m05 = m3[4] = m[5];
    var m06 = m3[5] = m[6];
    var m08 = m3[6] = m[8];
    var m09 = m3[7] = m[9];
    var m10 = m3[8] = m[10];
    out.x = Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
    out.y = Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
    out.z = Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10); // account for refections

    if (_mat["default"].determinant(m3_1) < 0) {
      out.x *= -1;
    }

    return out;
  }
  /**
   * !#zh 提取矩阵的旋转信息, 默认输入矩阵不含有缩放信息，如考虑缩放应使用 `toRTS` 函数。
   * !#en Rotation information extraction matrix, the matrix containing no default input scaling information, such as the use of `toRTS` should consider the scaling function.
   * @method getRotation
   * @typescript
   * getRotation<Out extends IMat4Like> (out: Quat, mat: Out)
   * @static
   */
  ;

  Mat4.getRotation = function getRotation(out, mat) {
    var m = mat.m;
    var trace = m[0] + m[5] + m[10];
    var S = 0;

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      out.w = 0.25 * S;
      out.x = (m[6] - m[9]) / S;
      out.y = (m[8] - m[2]) / S;
      out.z = (m[1] - m[4]) / S;
    } else if (m[0] > m[5] && m[0] > m[10]) {
      S = Math.sqrt(1.0 + m[0] - m[5] - m[10]) * 2;
      out.w = (m[6] - m[9]) / S;
      out.x = 0.25 * S;
      out.y = (m[1] + m[4]) / S;
      out.z = (m[8] + m[2]) / S;
    } else if (m[5] > m[10]) {
      S = Math.sqrt(1.0 + m[5] - m[0] - m[10]) * 2;
      out.w = (m[8] - m[2]) / S;
      out.x = (m[1] + m[4]) / S;
      out.y = 0.25 * S;
      out.z = (m[6] + m[9]) / S;
    } else {
      S = Math.sqrt(1.0 + m[10] - m[0] - m[5]) * 2;
      out.w = (m[1] - m[4]) / S;
      out.x = (m[8] + m[2]) / S;
      out.y = (m[6] + m[9]) / S;
      out.z = 0.25 * S;
    }

    return out;
  }
  /**
   * !#zh 提取旋转、位移、缩放信息， 默认矩阵中的变换以 S->R->T 的顺序应用
   * !#en Extracting rotational displacement, zoom information, the default matrix transformation in order S-> R-> T applications
   * @method toRTS
   * @typescript
   * toRTS<Out extends IMat4Like, VecLike extends IVec3Like> (mat: Out, q: Quat, v: VecLike, s: VecLike)
   * @static
   */
  ;

  Mat4.toRTS = function toRTS(mat, q, v, s) {
    var m = mat.m;
    var m3 = m3_1.m;
    s.x = _vec["default"].set(v3_1, m[0], m[1], m[2]).mag();
    m3[0] = m[0] / s.x;
    m3[1] = m[1] / s.x;
    m3[2] = m[2] / s.x;
    s.y = _vec["default"].set(v3_1, m[4], m[5], m[6]).mag();
    m3[3] = m[4] / s.y;
    m3[4] = m[5] / s.y;
    m3[5] = m[6] / s.y;
    s.z = _vec["default"].set(v3_1, m[8], m[9], m[10]).mag();
    m3[6] = m[8] / s.z;
    m3[7] = m[9] / s.z;
    m3[8] = m[10] / s.z;

    var det = _mat["default"].determinant(m3_1);

    if (det < 0) {
      s.x *= -1;
      m3[0] *= -1;
      m3[1] *= -1;
      m3[2] *= -1;
    }

    _quat["default"].fromMat3(q, m3_1); // already normalized


    _vec["default"].set(v, m[12], m[13], m[14]);
  }
  /**
   * !#zh 根据旋转、位移、缩放信息计算矩阵，以 S->R->T 的顺序应用
   * !#en The rotary displacement, the scaling matrix calculation information, the order S-> R-> T applications
   * @method fromRTS
   * @typescript
   * fromRTS<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike)
   * @static
   */
  ;

  Mat4.fromRTS = function fromRTS(out, q, v, s) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s.x;
    var sy = s.y;
    var sz = s.z;
    var m = out.m;
    m[0] = (1 - (yy + zz)) * sx;
    m[1] = (xy + wz) * sx;
    m[2] = (xz - wy) * sx;
    m[3] = 0;
    m[4] = (xy - wz) * sy;
    m[5] = (1 - (xx + zz)) * sy;
    m[6] = (yz + wx) * sy;
    m[7] = 0;
    m[8] = (xz + wy) * sz;
    m[9] = (yz - wx) * sz;
    m[10] = (1 - (xx + yy)) * sz;
    m[11] = 0;
    m[12] = v.x;
    m[13] = v.y;
    m[14] = v.z;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据指定的旋转、位移、缩放及变换中心信息计算矩阵，以 S->R->T 的顺序应用
   * !#en According to the specified rotation, displacement, and scale conversion matrix calculation information center, order S-> R-> T applications
   * @method fromRTSOrigin
   * @typescript
   * fromRTSOrigin<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, q: Quat, v: VecLike, s: VecLike, o: VecLike)
   * @param q 旋转值
   * @param v 位移值
   * @param s 缩放值
   * @param o 指定变换中心
   * @static
   */
  ;

  Mat4.fromRTSOrigin = function fromRTSOrigin(out, q, v, s, o) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var xy = x * y2;
    var xz = x * z2;
    var yy = y * y2;
    var yz = y * z2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var sx = s.x;
    var sy = s.y;
    var sz = s.z;
    var ox = o.x;
    var oy = o.y;
    var oz = o.z;
    var m = out.m;
    m[0] = (1 - (yy + zz)) * sx;
    m[1] = (xy + wz) * sx;
    m[2] = (xz - wy) * sx;
    m[3] = 0;
    m[4] = (xy - wz) * sy;
    m[5] = (1 - (xx + zz)) * sy;
    m[6] = (yz + wx) * sy;
    m[7] = 0;
    m[8] = (xz + wy) * sz;
    m[9] = (yz - wx) * sz;
    m[10] = (1 - (xx + yy)) * sz;
    m[11] = 0;
    m[12] = v.x + ox - (m[0] * ox + m[4] * oy + m[8] * oz);
    m[13] = v.y + oy - (m[1] * ox + m[5] * oy + m[9] * oz);
    m[14] = v.z + oz - (m[2] * ox + m[6] * oy + m[10] * oz);
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据指定的旋转信息计算矩阵
   * !#en The rotation matrix calculation information specified
   * @method fromQuat
   * @typescript
   * fromQuat<Out extends IMat4Like> (out: Out, q: Quat)
   * @static
   */
  ;

  Mat4.fromQuat = function fromQuat(out, q) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    var m = out.m;
    m[0] = 1 - yy - zz;
    m[1] = yx + wz;
    m[2] = zx - wy;
    m[3] = 0;
    m[4] = yx - wz;
    m[5] = 1 - xx - zz;
    m[6] = zy + wx;
    m[7] = 0;
    m[8] = zx + wy;
    m[9] = zy - wx;
    m[10] = 1 - xx - yy;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据指定的视锥体信息计算矩阵
   * !#en The matrix calculation information specified frustum
   * @method frustum
   * @typescript
   * frustum<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number)
   * @param left 左平面距离
   * @param right 右平面距离
   * @param bottom 下平面距离
   * @param top 上平面距离
   * @param near 近平面距离
   * @param far 远平面距离
   * @static
   */
  ;

  Mat4.frustum = function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    var m = out.m;
    m[0] = near * 2 * rl;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = near * 2 * tb;
    m[6] = 0;
    m[7] = 0;
    m[8] = (right + left) * rl;
    m[9] = (top + bottom) * tb;
    m[10] = (far + near) * nf;
    m[11] = -1;
    m[12] = 0;
    m[13] = 0;
    m[14] = far * near * 2 * nf;
    m[15] = 0;
    return out;
  }
  /**
   * !#zh 计算透视投影矩阵
   * !#en Perspective projection matrix calculation
   * @method perspective
   * @typescript
   * perspective<Out extends IMat4Like> (out: Out, fovy: number, aspect: number, near: number, far: number)
   * @param fovy 纵向视角高度
   * @param aspect 长宽比
   * @param near 近平面距离
   * @param far 远平面距离
   * @static
   */
  ;

  Mat4.perspective = function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2);
    var nf = 1 / (near - far);
    var m = out.m;
    m[0] = f / aspect;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = f;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = (far + near) * nf;
    m[11] = -1;
    m[12] = 0;
    m[13] = 0;
    m[14] = 2 * far * near * nf;
    m[15] = 0;
    return out;
  }
  /**
   * !#zh 计算正交投影矩阵
   * !#en Computing orthogonal projection matrix
   * @method ortho
   * @typescript
   * ortho<Out extends IMat4Like> (out: Out, left: number, right: number, bottom: number, top: number, near: number, far: number)
   * @param left 左平面距离
   * @param right 右平面距离
   * @param bottom 下平面距离
   * @param top 上平面距离
   * @param near 近平面距离
   * @param far 远平面距离
   * @static
   */
  ;

  Mat4.ortho = function ortho(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    var m = out.m;
    m[0] = -2 * lr;
    m[1] = 0;
    m[2] = 0;
    m[3] = 0;
    m[4] = 0;
    m[5] = -2 * bt;
    m[6] = 0;
    m[7] = 0;
    m[8] = 0;
    m[9] = 0;
    m[10] = 2 * nf;
    m[11] = 0;
    m[12] = (left + right) * lr;
    m[13] = (top + bottom) * bt;
    m[14] = (far + near) * nf;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 根据视点计算矩阵，注意 `eye - center` 不能为零向量或与 `up` 向量平行
   * !#en `Up` parallel vector or vector center` not be zero - the matrix calculation according to the viewpoint, note` eye
   * @method lookAt
   * @typescript
   * lookAt<Out extends IMat4Like, VecLike extends IVec3Like> (out: Out, eye: VecLike, center: VecLike, up: VecLike)
   * @param eye 当前位置
   * @param center 目标视点
   * @param up 视口上方向
   * @static
   */
  ;

  Mat4.lookAt = function lookAt(out, eye, center, up) {
    var eyex = eye.x;
    var eyey = eye.y;
    var eyez = eye.z;
    var upx = up.x;
    var upy = up.y;
    var upz = up.z;
    var centerx = center.x;
    var centery = center.y;
    var centerz = center.z;
    var z0 = eyex - centerx;
    var z1 = eyey - centery;
    var z2 = eyez - centerz;
    var len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    var x0 = upy * z2 - upz * z1;
    var x1 = upz * z0 - upx * z2;
    var x2 = upx * z1 - upy * z0;
    len = 1 / Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    x0 *= len;
    x1 *= len;
    x2 *= len;
    var y0 = z1 * x2 - z2 * x1;
    var y1 = z2 * x0 - z0 * x2;
    var y2 = z0 * x1 - z1 * x0;
    var m = out.m;
    m[0] = x0;
    m[1] = y0;
    m[2] = z0;
    m[3] = 0;
    m[4] = x1;
    m[5] = y1;
    m[6] = z1;
    m[7] = 0;
    m[8] = x2;
    m[9] = y2;
    m[10] = z2;
    m[11] = 0;
    m[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    m[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    m[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 计算逆转置矩阵
   * !#en Reversal matrix calculation
   * @method inverseTranspose
   * @typescript
   * inverseTranspose<Out extends IMat4Like> (out: Out, a: Out)
   * @static
   */
  ;

  Mat4.inverseTranspose = function inverseTranspose(out, a) {
    var m = a.m;
    _a00 = m[0];
    _a01 = m[1];
    _a02 = m[2];
    _a03 = m[3];
    _a10 = m[4];
    _a11 = m[5];
    _a12 = m[6];
    _a13 = m[7];
    _a20 = m[8];
    _a21 = m[9];
    _a22 = m[10];
    _a23 = m[11];
    _a30 = m[12];
    _a31 = m[13];
    _a32 = m[14];
    _a33 = m[15];
    var b00 = _a00 * _a11 - _a01 * _a10;
    var b01 = _a00 * _a12 - _a02 * _a10;
    var b02 = _a00 * _a13 - _a03 * _a10;
    var b03 = _a01 * _a12 - _a02 * _a11;
    var b04 = _a01 * _a13 - _a03 * _a11;
    var b05 = _a02 * _a13 - _a03 * _a12;
    var b06 = _a20 * _a31 - _a21 * _a30;
    var b07 = _a20 * _a32 - _a22 * _a30;
    var b08 = _a20 * _a33 - _a23 * _a30;
    var b09 = _a21 * _a32 - _a22 * _a31;
    var b10 = _a21 * _a33 - _a23 * _a31;
    var b11 = _a22 * _a33 - _a23 * _a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    m = out.m;
    m[0] = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
    m[1] = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
    m[2] = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
    m[3] = 0;
    m[4] = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
    m[5] = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
    m[6] = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
    m[7] = 0;
    m[8] = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
    m[9] = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
    m[10] = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
    m[11] = 0;
    m[12] = 0;
    m[13] = 0;
    m[14] = 0;
    m[15] = 1;
    return out;
  }
  /**
   * !#zh 逐元素矩阵加法
   * !#en Element by element matrix addition
   * @method add
   * @typescript
   * add<Out extends IMat4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Mat4.add = function add(out, a, b) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    m[0] = am[0] + bm[0];
    m[1] = am[1] + bm[1];
    m[2] = am[2] + bm[2];
    m[3] = am[3] + bm[3];
    m[4] = am[4] + bm[4];
    m[5] = am[5] + bm[5];
    m[6] = am[6] + bm[6];
    m[7] = am[7] + bm[7];
    m[8] = am[8] + bm[8];
    m[9] = am[9] + bm[9];
    m[10] = am[10] + bm[10];
    m[11] = am[11] + bm[11];
    m[12] = am[12] + bm[12];
    m[13] = am[13] + bm[13];
    m[14] = am[14] + bm[14];
    m[15] = am[15] + bm[15];
    return out;
  }
  /**
   * !#zh 逐元素矩阵减法
   * !#en Matrix element by element subtraction
   * @method subtract
   * @typescript
   * subtract<Out extends IMat4Like> (out: Out, a: Out, b: Out)
   * @static
   */
  ;

  Mat4.subtract = function subtract(out, a, b) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    m[0] = am[0] - bm[0];
    m[1] = am[1] - bm[1];
    m[2] = am[2] - bm[2];
    m[3] = am[3] - bm[3];
    m[4] = am[4] - bm[4];
    m[5] = am[5] - bm[5];
    m[6] = am[6] - bm[6];
    m[7] = am[7] - bm[7];
    m[8] = am[8] - bm[8];
    m[9] = am[9] - bm[9];
    m[10] = am[10] - bm[10];
    m[11] = am[11] - bm[11];
    m[12] = am[12] - bm[12];
    m[13] = am[13] - bm[13];
    m[14] = am[14] - bm[14];
    m[15] = am[15] - bm[15];
    return out;
  }
  /**
   * !#zh 矩阵标量乘法
   * !#en Matrix scalar multiplication
   * @method multiplyScalar
   * @typescript
   * multiplyScalar<Out extends IMat4Like> (out: Out, a: Out, b: number)
   * @static
   */
  ;

  Mat4.multiplyScalar = function multiplyScalar(out, a, b) {
    var m = out.m,
        am = a.m;
    m[0] = am[0] * b;
    m[1] = am[1] * b;
    m[2] = am[2] * b;
    m[3] = am[3] * b;
    m[4] = am[4] * b;
    m[5] = am[5] * b;
    m[6] = am[6] * b;
    m[7] = am[7] * b;
    m[8] = am[8] * b;
    m[9] = am[9] * b;
    m[10] = am[10] * b;
    m[11] = am[11] * b;
    m[12] = am[12] * b;
    m[13] = am[13] * b;
    m[14] = am[14] * b;
    m[15] = am[15] * b;
    return out;
  }
  /**
   * !#zh 逐元素矩阵标量乘加: A + B * scale
   * !#en Elements of the matrix by the scalar multiplication and addition: A + B * scale
   * @method multiplyScalarAndAdd
   * @typescript
   * multiplyScalarAndAdd<Out extends IMat4Like> (out: Out, a: Out, b: Out, scale: number)
   * @static
   */
  ;

  Mat4.multiplyScalarAndAdd = function multiplyScalarAndAdd(out, a, b, scale) {
    var m = out.m,
        am = a.m,
        bm = b.m;
    m[0] = am[0] + bm[0] * scale;
    m[1] = am[1] + bm[1] * scale;
    m[2] = am[2] + bm[2] * scale;
    m[3] = am[3] + bm[3] * scale;
    m[4] = am[4] + bm[4] * scale;
    m[5] = am[5] + bm[5] * scale;
    m[6] = am[6] + bm[6] * scale;
    m[7] = am[7] + bm[7] * scale;
    m[8] = am[8] + bm[8] * scale;
    m[9] = am[9] + bm[9] * scale;
    m[10] = am[10] + bm[10] * scale;
    m[11] = am[11] + bm[11] * scale;
    m[12] = am[12] + bm[12] * scale;
    m[13] = am[13] + bm[13] * scale;
    m[14] = am[14] + bm[14] * scale;
    m[15] = am[15] + bm[15] * scale;
    return out;
  }
  /**
   * !#zh 矩阵等价判断
   * !#en Analyzing the equivalent matrix
   * @method strictEquals
   * @return {bool}
   * @typescript
   * strictEquals<Out extends IMat4Like> (a: Out, b: Out)
   * @static
   */
  ;

  Mat4.strictEquals = function strictEquals(a, b) {
    var am = a.m,
        bm = b.m;
    return am[0] === bm[0] && am[1] === bm[1] && am[2] === bm[2] && am[3] === bm[3] && am[4] === bm[4] && am[5] === bm[5] && am[6] === bm[6] && am[7] === bm[7] && am[8] === bm[8] && am[9] === bm[9] && am[10] === bm[10] && am[11] === bm[11] && am[12] === bm[12] && am[13] === bm[13] && am[14] === bm[14] && am[15] === bm[15];
  }
  /**
   * !#zh 排除浮点数误差的矩阵近似等价判断
   * !#en Negative floating point error is approximately equivalent to determining a matrix
   * @method equals
   * @typescript
   * equals<Out extends IMat4Like> (a: Out, b: Out, epsilon = EPSILON)
   * @static
   */
  ;

  Mat4.equals = function equals(a, b, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    var am = a.m,
        bm = b.m;
    return Math.abs(am[0] - bm[0]) <= epsilon * Math.max(1.0, Math.abs(am[0]), Math.abs(bm[0])) && Math.abs(am[1] - bm[1]) <= epsilon * Math.max(1.0, Math.abs(am[1]), Math.abs(bm[1])) && Math.abs(am[2] - bm[2]) <= epsilon * Math.max(1.0, Math.abs(am[2]), Math.abs(bm[2])) && Math.abs(am[3] - bm[3]) <= epsilon * Math.max(1.0, Math.abs(am[3]), Math.abs(bm[3])) && Math.abs(am[4] - bm[4]) <= epsilon * Math.max(1.0, Math.abs(am[4]), Math.abs(bm[4])) && Math.abs(am[5] - bm[5]) <= epsilon * Math.max(1.0, Math.abs(am[5]), Math.abs(bm[5])) && Math.abs(am[6] - bm[6]) <= epsilon * Math.max(1.0, Math.abs(am[6]), Math.abs(bm[6])) && Math.abs(am[7] - bm[7]) <= epsilon * Math.max(1.0, Math.abs(am[7]), Math.abs(bm[7])) && Math.abs(am[8] - bm[8]) <= epsilon * Math.max(1.0, Math.abs(am[8]), Math.abs(bm[8])) && Math.abs(am[9] - bm[9]) <= epsilon * Math.max(1.0, Math.abs(am[9]), Math.abs(bm[9])) && Math.abs(am[10] - bm[10]) <= epsilon * Math.max(1.0, Math.abs(am[10]), Math.abs(bm[10])) && Math.abs(am[11] - bm[11]) <= epsilon * Math.max(1.0, Math.abs(am[11]), Math.abs(bm[11])) && Math.abs(am[12] - bm[12]) <= epsilon * Math.max(1.0, Math.abs(am[12]), Math.abs(bm[12])) && Math.abs(am[13] - bm[13]) <= epsilon * Math.max(1.0, Math.abs(am[13]), Math.abs(bm[13])) && Math.abs(am[14] - bm[14]) <= epsilon * Math.max(1.0, Math.abs(am[14]), Math.abs(bm[14])) && Math.abs(am[15] - bm[15]) <= epsilon * Math.max(1.0, Math.abs(am[15]), Math.abs(bm[15]));
  }
  /**
   * Calculates the adjugate of a matrix.
   *
   * @param {Mat4} out - Matrix to store result.
   * @param {Mat4} a - Matrix to calculate.
   * @returns {Mat4} out.
   */
  ;

  Mat4.adjoint = function adjoint(out, a) {
    var am = a.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a03 = am[3],
        a10 = am[4],
        a11 = am[5],
        a12 = am[6],
        a13 = am[7],
        a20 = am[8],
        a21 = am[9],
        a22 = am[10],
        a23 = am[11],
        a30 = am[12],
        a31 = am[13],
        a32 = am[14],
        a33 = am[15];
    outm[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    outm[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    outm[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    outm[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    outm[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    outm[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    outm[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    outm[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    outm[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    outm[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    outm[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    outm[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    outm[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    outm[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    outm[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    outm[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return out;
  }
  /**
   * !#zh 矩阵转数组
   * !#en Matrix transpose array
   * @method toArray
   * @typescript
   * toArray <Out extends IWritableArrayLike<number>> (out: Out, mat: IMat4Like, ofs = 0)
   * @param ofs 数组内的起始偏移量
   * @static
   */
  ;

  Mat4.toArray = function toArray(out, mat, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var m = mat.m;

    for (var i = 0; i < 16; i++) {
      out[ofs + i] = m[i];
    }

    return out;
  }
  /**
   * !#zh 数组转矩阵
   * !#en Transfer matrix array
   * @method fromArray
   * @typescript
   * fromArray <Out extends IMat4Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Mat4.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var m = out.m;

    for (var i = 0; i < 16; i++) {
      m[i] = arr[ofs + i];
    }

    return out;
  }
  /**
   * !#en Matrix Data
   * !#zh 矩阵数据
   * @property {Float64Array | Float32Array} m
   */
  ;

  /**
   * !#en
   * Constructor
   * see {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
   * !#zh
   * 构造函数，可查看 {{#crossLink "cc/mat4:method"}}cc.mat4{{/crossLink}}
   * @method constructor
   * @typescript
   * constructor ( m00: number = 1, m01: number = 0, m02: number = 0, m03: number = 0, m10: number = 0, m11: number = 1, m12: number = 0, m13: number = 0, m20: number = 0, m21: number = 0, m22: number = 1, m23: number = 0, m30: number = 0, m31: number = 0, m32: number = 0, m33: number = 1)
   */
  function Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    var _this;

    if (m00 === void 0) {
      m00 = 1;
    }

    if (m01 === void 0) {
      m01 = 0;
    }

    if (m02 === void 0) {
      m02 = 0;
    }

    if (m03 === void 0) {
      m03 = 0;
    }

    if (m10 === void 0) {
      m10 = 0;
    }

    if (m11 === void 0) {
      m11 = 1;
    }

    if (m12 === void 0) {
      m12 = 0;
    }

    if (m13 === void 0) {
      m13 = 0;
    }

    if (m20 === void 0) {
      m20 = 0;
    }

    if (m21 === void 0) {
      m21 = 0;
    }

    if (m22 === void 0) {
      m22 = 1;
    }

    if (m23 === void 0) {
      m23 = 0;
    }

    if (m30 === void 0) {
      m30 = 0;
    }

    if (m31 === void 0) {
      m31 = 0;
    }

    if (m32 === void 0) {
      m32 = 0;
    }

    if (m33 === void 0) {
      m33 = 1;
    }

    _this = _ValueType.call(this) || this;
    _this.m = void 0;

    if (m00 instanceof _utils.FLOAT_ARRAY_TYPE) {
      _this.m = m00;
    } else {
      _this.m = new _utils.FLOAT_ARRAY_TYPE(16);
      var tm = _this.m;
      tm[0] = m00;
      tm[1] = m01;
      tm[2] = m02;
      tm[3] = m03;
      tm[4] = m10;
      tm[5] = m11;
      tm[6] = m12;
      tm[7] = m13;
      tm[8] = m20;
      tm[9] = m21;
      tm[10] = m22;
      tm[11] = m23;
      tm[12] = m30;
      tm[13] = m31;
      tm[14] = m32;
      tm[15] = m33;
    }

    return _this;
  }
  /**
   * !#en clone a Mat4 object
   * !#zh 克隆一个 Mat4 对象
   * @method clone
   * @return {Mat4}
   */


  _proto.clone = function clone() {
    var t = this;
    var tm = t.m;
    return new Mat4(tm[0], tm[1], tm[2], tm[3], tm[4], tm[5], tm[6], tm[7], tm[8], tm[9], tm[10], tm[11], tm[12], tm[13], tm[14], tm[15]);
  }
  /**
   * !#en Sets the matrix with another one's value
   * !#zh 用另一个矩阵设置这个矩阵的值。
   * @method set
   * @param {Mat4} srcObj
   * @return {Mat4} returns this
   * @chainable
   */
  ;

  _proto.set = function set(s) {
    var t = this;
    var tm = t.m,
        sm = s.m;
    tm[0] = sm[0];
    tm[1] = sm[1];
    tm[2] = sm[2];
    tm[3] = sm[3];
    tm[4] = sm[4];
    tm[5] = sm[5];
    tm[6] = sm[6];
    tm[7] = sm[7];
    tm[8] = sm[8];
    tm[9] = sm[9];
    tm[10] = sm[10];
    tm[11] = sm[11];
    tm[12] = sm[12];
    tm[13] = sm[13];
    tm[14] = sm[14];
    tm[15] = sm[15];
    return this;
  }
  /**
   * !#en Check whether two matrix equal
   * !#zh 当前的矩阵是否与指定的矩阵相等。
   * @method equals
   * @param {Mat4} other
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other) {
    return Mat4.strictEquals(this, other);
  }
  /**
   * !#en Check whether two matrix equal with default degree of variance.
   * !#zh
   * 近似判断两个矩阵是否相等。<br/>
   * 判断 2 个矩阵是否在默认误差范围之内，如果在则返回 true，反之则返回 false。
   * @method fuzzyEquals
   * @param {Mat4} other
   * @return {Boolean}
   */
  ;

  _proto.fuzzyEquals = function fuzzyEquals(other) {
    return Mat4.equals(this, other);
  }
  /**
   * !#en Transform to string with matrix informations
   * !#zh 转换为方便阅读的字符串。
   * @method toString
   * @return {string}
   */
  ;

  _proto.toString = function toString() {
    var tm = this.m;

    if (tm) {
      return "[\n" + tm[0] + ", " + tm[1] + ", " + tm[2] + ", " + tm[3] + ",\n" + tm[4] + ", " + tm[5] + ", " + tm[6] + ", " + tm[7] + ",\n" + tm[8] + ", " + tm[9] + ", " + tm[10] + ", " + tm[11] + ",\n" + tm[12] + ", " + tm[13] + ", " + tm[14] + ", " + tm[15] + "\n" + "]";
    } else {
      return "[\n" + "1, 0, 0, 0\n" + "0, 1, 0, 0\n" + "0, 0, 1, 0\n" + "0, 0, 0, 1\n" + "]";
    }
  }
  /**
   * Set the matrix to the identity matrix
   * @method identity
   * @returns {Mat4} self
   * @chainable
   */
  ;

  _proto.identity = function identity() {
    return Mat4.identity(this);
  }
  /**
   * Transpose the values of a mat4
   * @method transpose
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.transpose = function transpose(out) {
    out = out || new Mat4();
    return Mat4.transpose(out, this);
  }
  /**
   * Inverts a mat4
   * @method invert
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.invert = function invert(out) {
    out = out || new Mat4();
    return Mat4.invert(out, this);
  }
  /**
   * Calculates the adjugate of a mat4
   * @method adjoint
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.adjoint = function adjoint(out) {
    out = out || new Mat4();
    return Mat4.adjoint(out, this);
  }
  /**
   * Calculates the determinant of a mat4
   * @method determinant
   * @returns {Number} determinant of a
   */
  ;

  _proto.determinant = function determinant() {
    return Mat4.determinant(this);
  }
  /**
   * Adds two Mat4
   * @method add
   * @param {Mat4} other the second operand
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created.
   * @returns {Mat4} out
   */
  ;

  _proto.add = function add(other, out) {
    out = out || new Mat4();
    return Mat4.add(out, this, other);
  }
  /**
   * Subtracts the current matrix with another one
   * @method subtract
   * @param {Mat4} other the second operand
   * @returns {Mat4} this
   */
  ;

  _proto.subtract = function subtract(other) {
    return Mat4.subtract(this, this, other);
  }
  /**
   * Subtracts the current matrix with another one
   * @method multiply
   * @param {Mat4} other the second operand
   * @returns {Mat4} this
   */
  ;

  _proto.multiply = function multiply(other) {
    return Mat4.multiply(this, this, other);
  }
  /**
   * Multiply each element of the matrix by a scalar.
   * @method multiplyScalar
   * @param {Number} number amount to scale the matrix's elements by
   * @returns {Mat4} this
   */
  ;

  _proto.multiplyScalar = function multiplyScalar(number) {
    return Mat4.multiplyScalar(this, this, number);
  }
  /**
   * Translate a mat4 by the given vector
   * @method translate
   * @param {Vec3} v vector to translate by
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.translate = function translate(v, out) {
    out = out || new Mat4();
    return Mat4.translate(out, this, v);
  }
  /**
   * Scales the mat4 by the dimensions in the given vec3
   * @method scale
   * @param {Vec3} v vector to scale by
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.scale = function scale(v, out) {
    out = out || new Mat4();
    return Mat4.scale(out, this, v);
  }
  /**
   * Rotates a mat4 by the given angle around the given axis
   * @method rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @param {Vec3} axis the axis to rotate around
   * @param {Mat4} [out] the receiving matrix, you can pass the same matrix to save result to itself, if not provided, a new matrix will be created
   * @returns {Mat4} out
   */
  ;

  _proto.rotate = function rotate(rad, axis, out) {
    out = out || new Mat4();
    return Mat4.rotate(out, this, rad, axis);
  }
  /**
   * Returns the translation vector component of a transformation matrix.
   * @method getTranslation
   * @param  {Vec3} out Vector to receive translation component, if not provided, a new vec3 will be created
   * @return {Vec3} out
   */
  ;

  _proto.getTranslation = function getTranslation(out) {
    out = out || new _vec["default"]();
    return Mat4.getTranslation(out, this);
  }
  /**
   * Returns the scale factor component of a transformation matrix
   * @method getScale
   * @param  {Vec3} out Vector to receive scale component, if not provided, a new vec3 will be created
   * @return {Vec3} out
   */
  ;

  _proto.getScale = function getScale(out) {
    out = out || new _vec["default"]();
    return Mat4.getScaling(out, this);
  }
  /**
   * Returns the rotation factor component of a transformation matrix
   * @method getRotation
   * @param  {Quat} out Vector to receive rotation component, if not provided, a new quaternion object will be created
   * @return {Quat} out
   */
  ;

  _proto.getRotation = function getRotation(out) {
    out = out || new _quat["default"]();
    return Mat4.getRotation(out, this);
  }
  /**
   * Restore the matrix values from a quaternion rotation, vector translation and vector scale
   * @method fromRTS
   * @param {Quat} q Rotation quaternion
   * @param {Vec3} v Translation vector
   * @param {Vec3} s Scaling vector
   * @returns {Mat4} the current mat4 object
   * @chainable
   */
  ;

  _proto.fromRTS = function fromRTS(q, v, s) {
    return Mat4.fromRTS(this, q, v, s);
  }
  /**
   * Restore the matrix values from a quaternion rotation
   * @method fromQuat
   * @param {Quat} q Rotation quaternion
   * @returns {Mat4} the current mat4 object
   * @chainable
   */
  ;

  _proto.fromQuat = function fromQuat(quat) {
    return Mat4.fromQuat(this, quat);
  };

  return Mat4;
}(_valueType["default"]);

exports["default"] = Mat4;
Mat4.mul = Mat4.multiply;
Mat4.sub = Mat4.subtract;
Mat4.IDENTITY = Object.freeze(new Mat4());
var v3_1 = new _vec["default"]();
var m3_1 = new _mat["default"]();

_CCClass["default"].fastDefine('cc.Mat4', Mat4, {
  m00: 1,
  m01: 0,
  m02: 0,
  m03: 0,
  m04: 0,
  m05: 1,
  m06: 0,
  m07: 0,
  m08: 0,
  m09: 0,
  m10: 1,
  m11: 0,
  m12: 0,
  m13: 0,
  m14: 0,
  m15: 1
});

var _loop = function _loop(i) {
  Object.defineProperty(Mat4.prototype, 'm' + i, {
    get: function get() {
      return this.m[i];
    },
    set: function set(value) {
      this.m[i] = value;
    }
  });
};

for (var i = 0; i < 16; i++) {
  _loop(i);
}
/**
 * @module cc
 */

/**
 * !#en The convenience method to create a new {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Mat4"}}cc.Mat4{{/crossLink}} 对象。
 * @method mat4
 * @param {Number} [m00] Component in column 0, row 0 position (index 0)
 * @param {Number} [m01] Component in column 0, row 1 position (index 1)
 * @param {Number} [m02] Component in column 0, row 2 position (index 2)
 * @param {Number} [m03] Component in column 0, row 3 position (index 3)
 * @param {Number} [m10] Component in column 1, row 0 position (index 4)
 * @param {Number} [m11] Component in column 1, row 1 position (index 5)
 * @param {Number} [m12] Component in column 1, row 2 position (index 6)
 * @param {Number} [m13] Component in column 1, row 3 position (index 7)
 * @param {Number} [m20] Component in column 2, row 0 position (index 8)
 * @param {Number} [m21] Component in column 2, row 1 position (index 9)
 * @param {Number} [m22] Component in column 2, row 2 position (index 10)
 * @param {Number} [m23] Component in column 2, row 3 position (index 11)
 * @param {Number} [m30] Component in column 3, row 0 position (index 12)
 * @param {Number} [m31] Component in column 3, row 1 position (index 13)
 * @param {Number} [m32] Component in column 3, row 2 position (index 14)
 * @param {Number} [m33] Component in column 3, row 3 position (index 15)
 * @return {Mat4}
 */


cc.mat4 = function (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var mat = new Mat4(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);

  if (m00 === undefined) {
    Mat4.identity(mat);
  }

  return mat;
};

cc.Mat4 = Mat4;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdDQudHMiXSwibmFtZXMiOlsiX2EwMCIsIl9hMDEiLCJfYTAyIiwiX2EwMyIsIl9hMTAiLCJfYTExIiwiX2ExMiIsIl9hMTMiLCJfYTIwIiwiX2EyMSIsIl9hMjIiLCJfYTIzIiwiX2EzMCIsIl9hMzEiLCJfYTMyIiwiX2EzMyIsIk1hdDQiLCJtdWwiLCJtIiwib3V0IiwibXVsdGlwbHkiLCJtdWxTY2FsYXIiLCJudW0iLCJtdWx0aXBseVNjYWxhciIsInN1YiIsInN1YnRyYWN0IiwiY2xvbmUiLCJhIiwiY29weSIsImFtIiwic2V0IiwibTAwIiwibTAxIiwibTAyIiwibTAzIiwibTEwIiwibTExIiwibTEyIiwibTEzIiwibTIwIiwibTIxIiwibTIyIiwibTIzIiwibTMwIiwibTMxIiwibTMyIiwibTMzIiwiaWRlbnRpdHkiLCJ0cmFuc3Bvc2UiLCJhMDEiLCJhMDIiLCJhMDMiLCJhMTIiLCJhMTMiLCJhMjMiLCJpbnZlcnQiLCJiMDAiLCJiMDEiLCJiMDIiLCJiMDMiLCJiMDQiLCJiMDUiLCJiMDYiLCJiMDciLCJiMDgiLCJiMDkiLCJiMTAiLCJiMTEiLCJkZXQiLCJkZXRlcm1pbmFudCIsImIiLCJibSIsImIwIiwiYjEiLCJiMiIsImIzIiwidHJhbnNmb3JtIiwidiIsIngiLCJ5IiwieiIsInRyYW5zbGF0ZSIsInNjYWxlIiwicm90YXRlIiwicmFkIiwiYXhpcyIsImxlbiIsIk1hdGgiLCJzcXJ0IiwiYWJzIiwiRVBTSUxPTiIsInMiLCJzaW4iLCJjIiwiY29zIiwidCIsImIxMiIsImIyMCIsImIyMSIsImIyMiIsInJvdGF0ZVgiLCJhMTAiLCJhMTEiLCJhMjAiLCJhMjEiLCJhMjIiLCJyb3RhdGVZIiwiYTAwIiwicm90YXRlWiIsImZyb21UcmFuc2xhdGlvbiIsImZyb21TY2FsaW5nIiwiZnJvbVJvdGF0aW9uIiwiZnJvbVhSb3RhdGlvbiIsImZyb21ZUm90YXRpb24iLCJmcm9tWlJvdGF0aW9uIiwiZnJvbVJUIiwicSIsInciLCJ4MiIsInkyIiwiejIiLCJ4eCIsInh5IiwieHoiLCJ5eSIsInl6IiwienoiLCJ3eCIsInd5Iiwid3oiLCJnZXRUcmFuc2xhdGlvbiIsIm1hdCIsImdldFNjYWxpbmciLCJtMyIsIm0zXzEiLCJtMDQiLCJtMDUiLCJtMDYiLCJtMDgiLCJtMDkiLCJNYXQzIiwiZ2V0Um90YXRpb24iLCJ0cmFjZSIsIlMiLCJ0b1JUUyIsIlZlYzMiLCJ2M18xIiwibWFnIiwiUXVhdCIsImZyb21NYXQzIiwiZnJvbVJUUyIsInN4Iiwic3kiLCJzeiIsImZyb21SVFNPcmlnaW4iLCJvIiwib3giLCJveSIsIm96IiwiZnJvbVF1YXQiLCJ5eCIsInp4IiwienkiLCJmcnVzdHVtIiwibGVmdCIsInJpZ2h0IiwiYm90dG9tIiwidG9wIiwibmVhciIsImZhciIsInJsIiwidGIiLCJuZiIsInBlcnNwZWN0aXZlIiwiZm92eSIsImFzcGVjdCIsImYiLCJ0YW4iLCJvcnRobyIsImxyIiwiYnQiLCJsb29rQXQiLCJleWUiLCJjZW50ZXIiLCJ1cCIsImV5ZXgiLCJleWV5IiwiZXlleiIsInVweCIsInVweSIsInVweiIsImNlbnRlcngiLCJjZW50ZXJ5IiwiY2VudGVyeiIsInowIiwiejEiLCJ4MCIsIngxIiwieTAiLCJ5MSIsImludmVyc2VUcmFuc3Bvc2UiLCJhZGQiLCJtdWx0aXBseVNjYWxhckFuZEFkZCIsInN0cmljdEVxdWFscyIsImVxdWFscyIsImVwc2lsb24iLCJtYXgiLCJhZGpvaW50Iiwib3V0bSIsImEzMCIsImEzMSIsImEzMiIsImEzMyIsInRvQXJyYXkiLCJvZnMiLCJpIiwiZnJvbUFycmF5IiwiYXJyIiwiRkxPQVRfQVJSQVlfVFlQRSIsInRtIiwic20iLCJvdGhlciIsImZ1enp5RXF1YWxzIiwidG9TdHJpbmciLCJudW1iZXIiLCJnZXRTY2FsZSIsInF1YXQiLCJWYWx1ZVR5cGUiLCJJREVOVElUWSIsIk9iamVjdCIsImZyZWV6ZSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwibTA3IiwibTE0IiwibTE1IiwiZGVmaW5lUHJvcGVydHki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LENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUNBWCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFDQVgsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQ0FYLElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUNBWCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFDQVgsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQ0FYLElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUNBWCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFDQVgsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQ0FYLElBQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUVcsRUFBRSxDQUFDLEVBQUQsQ0FBVjtBQUNBWCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQVY7QUFDQVgsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFWO0FBQ0FYLElBQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUVcsRUFBRSxDQUFDLEVBQUQsQ0FBVjtBQUNBWCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQVY7QUFDQVgsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFWO0FBQ0EsV0FBT1YsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7T0FLT1csTUFBUCxhQUNJWCxHQURKLEVB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QUFDQVgsTUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRaUMsR0FBUjtBQUNBakMsTUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRbUMsR0FBUjtBQUNBbkMsTUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRb0MsR0FBUjtBQUNILEtBZEQsTUFjTztBQUNIcEMsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQ0FYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUNBWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFDQVgsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsRUFBRCxDQUFUO0FBQ0FYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUNBWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFDQVgsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQ0FYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLEVBQUQsQ0FBVDtBQUNBWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFDQVgsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQ0FYLE1BQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUVcsRUFBRSxDQUFDLEVBQUQsQ0FBVjtBQUNBWCxNQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQVY7QUFDQVgsTUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsQ0FBRCxD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QSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWlELENBQVIsR0FBWWpELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWtELENBQXBCLEdBQXdCbEQsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRbUQsQ0FBaEMsR0FBb0NuRCxFQUFFLENBQUMsRUFBRCxDQUE5QztBQUNBWCxNQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWlELENBQVIsR0FBWWpELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWtELENBQXBCLEdBQXdCbEQsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRbUQsQ0FBaEMsR0FBb0NuRCxFQUFFLENBQUMsRUFBRCxDQUE5QztBQUNBWCxNQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWlELENBQVIsR0FBWWpELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWtELENBQXBCLEdBQXdCbEQsRUFBRSxDQUFDLEVBQUQsQ0FBRixHQUFTbUQsQ0FBakMsR0FBcUNuRCxFQUFFLENBQUMsRUFBRCxDQUEvQztBQUNBWCxNQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWlELENBQVIsR0FBWWpELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWtELENBQXBCLEdBQXdCbEQsRUFBRSxDQUFDLEVBQUQsQ0FBRixHQUFTbUQsQ0FBakMsR0FBcUNuRCxFQUFFLENBQUMsRUFBRCxDQUEvQztBQUNILEtBTEQsTUFLTztBQUNIN0IsTUFBQUEsSUFBSSxHQUFHNkIsRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUFjNUIsTUFBQUEsSUFBSSxHQUFHNEIsRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUFjM0IsTUFBQUEsSUFBSSxHQUFHMkIsRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUFjMUIsTUFBQUEsSUFBSSxHQUFHMEIsRUFBRSxDQUFDLENBQUQs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QUFJUyxDQUFDLEtBQUtSLEdBQVYsRUFBZTtBQUNYRCxNQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELElBQVMyRCxDQUFDLENBQUNDLENBQVg7QUFDQTVELE1BQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsSUFBUzJELENBQUMsQ0FBQ0UsQ0FBWDtBQUNBN0QsTUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxJQUFTMkQsQ0FBQyxDQUFDRSxDQUFYO0FBQ0gsS0FKRCxNQUlPO0FBQ0g3RCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFBY1gsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQWNYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUFjWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFDMUNYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUFjWCxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQVQ7QUFBY1gsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQWNYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUMxQ1gsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFUO0FBQWNYLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1csRUFBRSxDQUFDLENBQUQsQ0FBVDtBQUFjWCxNQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQVY7QUFBZ0JYLE1BQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUVcsRUFBRSxDQUFDLEVB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LEVBQUQsQ0FBUjtBQUFjTCxJQUFBQSxJQUFJLEdBQUdLLENBQUMsQ0FBQyxFQUFELENBQVI7QUFBY0osSUFBQUEsSUFBSSxHQUFHSSxDQUFDLENBQUMsRUFBRCxDQUFSO0FBQWNILElBQUFBLElBQUksR0FBR0csQ0FBQyxDQUFDLEVBQUQsQ0FBUjtBQUUxQyxRQUFNc0MsR0FBRyxHQUFHeEQsSUFBSSxHQUFHSyxJQUFQLEdBQWNKLElBQUksR0FBR0csSUFBakM7QUFDQSxRQUFNcUQsR0FBRyxHQUFHekQsSUFBSSxHQUFHTSxJQUFQLEdBQWNKLElBQUksR0FBR0UsSUFBakM7QUFDQSxRQUFNc0QsR0FBRyxHQUFHMUQsSUFBSSxHQUFHTyxJQUFQLEdBQWNKLElBQUksR0FBR0MsSUFBakM7QUFDQSxRQUFNdUQsR0FBRyxHQUFHMUQsSUFBSSxHQUFHSyxJQUFQLEdBQWNKLElBQUksR0FBR0csSUFBakM7QUFDQSxRQUFNdUQsR0FBRyxHQUFHM0QsSUFBSSxHQUFHTSxJQUFQLEdBQWNKLElBQUksR0FBR0UsSUFBakM7QUFDQSxRQUFNd0QsR0FBRyxHQUFHM0QsSUFBSSxHQUFHSyxJQUFQLEdBQWNKLElBQUksR0FBR0csSUFBakM7QUFDQSxRQUFNd0QsR0FBRyxHQUFHdEQsSUFBSSxHQUFHSyxJQUFQLEdBQWNKLElBQUksR0FBR0csSUFBakM7QUFDQSxRQUFNbUQsR0FBRyxHQUFHdkQsSUFBSSxHQUFHTSxJQUFQLEdBQWNKLElBQUksR0FBR0UsSUFBakM7QUFDQSxRQUFNb0QsR0FBRyxHQUFHeEQsSUFBSSxHQUFHTyxJQUFQLEdBQWNKLElBQUksR0FBR0MsSUFBakM7QUFDQSxRQUFNcUQsR0FBRyxHQUFHeEQsSUFBSSxHQUFHSyxJQUFQLEdBQWNKLElBQUksR0FBR0csSUFBakM7QUFDQSxRQUFNcUQsR0FBRyxHQUFHekQsSUFBSSxHQUFHTSxJQUFQLEdBQWNKLElBQUksR0FBR0UsSUFBakM7QUFDQSxRQUFNc0QsR0FBRyxHQUFHekQsSUFBSSxHQUFHSyxJQUFQLEdBQWNKLElBQUksR0FBR0csSUFBakMsQ0FuQjhELENBcUI5RDs7QUFDQSxRQUFJc0QsR0FBRyxHQUFHWixHQUFHLEdBQUdXLEdBQU4sR0FBWVYsR0FBRyxHQUFHUyxHQUFsQixHQUF3QlIsR0FBRyxHQUFHTyxHQUE5QixHQUFvQ04sR0FBRyxHQUFHSyxHQUExQyxHQUFnREosR0FBRyxHQUFHRyxHQUF0RCxHQUE0REYsR0FBRyxHQUFHQyxHQUE1RTs7QUFFQSxRQUFJLENBQUNNLEdBQUwsRUFBVTtBQUNOLGFBQU8sSUFBUDtBQUNIOztBQUNEQSxJQUFBQSxHQUFHLEdBQUcsTUFBTUEsR0FBWjtBQUVBbEQsSUFBQUEsQ0FBQyxHQUFHQyxHQUFHLENBQUNELENBQVI7QUFDQUEsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQUNiLElBQUksR0FBRzhELEdBQVAsR0FBYTdELElBQUksR0FBRzRELEdBQXBCLEdBQTBCM0QsSUFBSSxHQUFHMEQsR0FBbEMsSUFBeUNHLEdBQWhEO0FBQ0FsRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8sQ0FBQ1osSUFBSSxHQUFHMEQsR0FBUCxHQUFhNUQsSUFBSSxHQUFHK0QsR0FBcEIsR0FBMEI1RCxJQUFJLEdBQUd3RCxHQUFsQyxJQUF5Q0ssR0FBaEQ7QUFDQWxELElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTyxDQUFDZCxJQUFJLEdBQUc4RCxHQUFQLEdBQWE3RCxJQUFJLEdBQUcyRCxHQUFwQixHQUEwQnpELElBQUksR0FBR3VELEdBQWxDLElBQXlDTSxHQUFoRDtBQUNBbEQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQVA7QUFFQUEsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQUNoQixJQUFJLEdBQUdnRSxHQUFQLEdBQWFqRSxJQUFJLEdBQUdrRSxHQUFwQixHQUEwQmhFLElBQUksR0FBRzhELEdBQWxDLElBQXlDRyxHQUFoRDtBQUNBbEQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQUNsQixJQUFJLEdBQUdtRSxHQUFQLEdBQWFqRSxJQUFJLEdBQUc4RCxHQUFwQixHQUEwQjdELElBQUksR0FBRzRELEdBQWxDLElBQXlDSyxHQUFoRDtBQUNBbEQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQUNqQixJQUFJLEdBQUcrRCxHQUFQLEdBQWFoRSxJQUFJLEdBQUdrRSxHQUFwQixHQUEwQi9ELElBQUksR0FBRzJELEdBQWxDLElBQXlDTSxHQUFoRDtBQUNBbEQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQVA7QUFFQUEsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQUNMLElBQUksR0FBR2dELEdBQVAsR0FBYS9DLElBQUksR0FBRzhDLEdBQXBCLEdBQTBCN0MsSUFBSSxHQUFHNEMsR0FBbEMsSUFBeUNTLEdBQWhEO0FBQ0FsRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8sQ0FBQ0osSUFBSSxHQUFHNEMsR0FBUCxHQUFhOUMsSUFBSSxHQUFHaUQsR0FBcEIsR0FBMEI5QyxJQUFJLEdBQUcwQyxHQUFsQyxJQUF5Q1csR0FBaEQ7QUFDQWxELElBQUFBLENBQUMsQ0FBQyxFQUFELENBQUQsR0FBUSxDQUFDTixJQUFJLEdBQUdnRCxHQUFQLEdBQWEvQyxJQUFJLEdBQUc2QyxHQUFwQixHQUEwQjNDLElBQUksR0FBR3lDLEdBQWxDLElBQXlDWSxHQUFqRDtBQUNBbEQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRLENBQVI7QUFFQUEsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRLENBQVI7QUFDQUEsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRLENBQVI7QUFDQUEsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRLENBQVI7QUFDQUEsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRLENBQVI7QUFFQSxXQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPc0wsTUFBUCxhQUFtQ3RMLEdBQW5DLEVBQTZDUSxDQUE3QyxFQUFxRDJDLENBQXJELEVBQTZEO0FBQ3pELFFBQUlwRCxDQUFDLEdBQUdDLEdBQUcsQ0FBQ0QsQ0FBWjtBQUFBLFFBQWVXLEVBQUUsR0FBR0YsQ0FBQyxDQUFDVCxDQUF0QjtBQUFBLFFBQXlCcUQsRUFBRSxHQUFHRCxDQUFDLENBQUNwRCxDQUFoQztBQUNBQSxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9XLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQWpCO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0FyRCxJQUFBQSxDQUFDLENBQUMsRUFBRCxDQUFELEdBQVFXLEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQW5CO0FBQ0EsV0FBT3BELEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7O09BUU9NLFdBQVAsa0JBQXdDTixHQUF4QyxFQUFrRFEsQ0FBbEQsRUFBMEQyQyxDQUExRCxFQUFrRTtBQUM5RCxRQUFJcEQsQ0FBQyxHQUFHQyxHQUFHLENBQUNELENBQVo7QUFBQSxRQUFlVyxFQUFFLEdBQUdGLENBQUMsQ0FBQ1QsQ0FBdEI7QUFBQSxRQUF5QnFELEVBQUUsR0FBR0QsQ0FBQyxDQUFDcEQsQ0FBaEM7QUFDQUEsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEwQyxFQUFFLENBQUMsQ0FBRCxDQUFqQjtBQUNBckQsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRVyxFQUFFLENBQUMsRUFBRCxDQUFGLEdBQVMwQyxFQUFFLENBQUMsRUFBRCxDQUFuQjtBQUNBckQsSUFB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SUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBRnJDLElBR0FnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBSHJDLElBSUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBSnJDLElBS0FnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBTHJDLElBTUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBTnJDLElBT0FnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBUHJDLElBUUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBUnJDLElBU0FnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUTBDLEVBQUUsQ0FBQyxDQUFELENBQW5CLEtBQTJCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLENBQUQsQ0FBWCxDQUFkLEVBQStCMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsQ0FBRCxDQUFYLENBQS9CLENBVHJDLElBVUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQXBCLEtBQTZCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLEVBQUQsQ0FBWCxDQUFkLEVBQWdDMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsRUFBRCxDQUFYLENBQWhDLENBVnZDLElBV0FnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQXBCLEtBQTZCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLEVBQUQsQ0FBWCxDQUFkLEVBQWdDMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsRUFBRCxDQUFYLENBQWhDLENBWHZDLElBWUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQXBCLEtBQTZCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQsRUFBY3ZILElBQUksQ0FBQ0UsR0FBTCxDQUFTNUQsRUFBRSxDQUFDLEVBQUQsQ0FBWCxDQUFkLEVBQWdDMEQsSUFBSSxDQUFDRSxHQUFMLENBQVNsQixFQUFFLENBQUMsRUFBRCxDQUFYLENBQWhDLENBWnZDLElBYUFnQixJQUFJLENBQUNFLEdBQUwsQ0FBUzVELEVBQUUsQ0FBQyxFQUFELENBQUYsR0FBUzBDLEVBQUUsQ0FBQyxFQUFELENBQXBCLEtBQTZCc0ksT0FBTyxHQUFHdEgsSUFBSSxDQUFDdUgsR0FBTCxDQUFTLEdBQVQs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QTdDLEVBQWtEQyxHQUFsRCxFQUF1REMsR0FBdkQsRUFBNERDLEdBQTVELEVBQWlFQyxHQUFqRSxFQUFzRUMsR0FBdEUsRUFBMkVDLEdBQTNFLEVBQWdGQyxHQUFoRixFQUFxRkMsR0FBckYsRUFBMEY7QUFDaEcsTUFBSXFGLEdBQUcsR0FBRyxJQUFJbkgsSUFBSixDQUFTZSxHQUFULEVBQWNDLEdBQWQsRUFBbUJDLEdBQW5CLEVBQXdCQyxHQUF4QixFQUE2QkMsR0FBN0IsRUFBa0NDLEdBQWxDLEVBQXVDQyxHQUF2QyxFQUE0Q0MsR0FBNUMsRUFBaURDLEdBQWpELEVBQXNEQyxHQUF0RCxFQUEyREMsR0FBM0QsRUFBZ0VDLEdBQWhFLEVBQXFFQyxHQUFyRSxFQUEwRUMsR0FBMUUsRUFBK0VDLEdBQS9FLEVBQW9GQyxHQUFwRixDQUFWOztBQUNBLE1BQUlmLEdBQUcsS0FBS21OLFNBQVosRUFBdUI7QUFDbkJsTyxJQUFBQSxJQUFJLENBQUMrQixRQUFMLENBQWNvRixHQUFkO0FBQ0g7O0FBQ0QsU0FBT0EsR0FBUDtBQUNILENBTkQ7O0FBUUE2RyxFQUFFLENBQUNoTyxJQUFILEdBQVVBLElBQVYiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IFZhbHVlVHlwZSBmcm9tICcuL3ZhbHVlLXR5cGUnO1xuaW1wb3J0IENDQ2xhc3MgZnJvbSAnLi4vcGxhdGZvcm0vQ0NDbGFzcyc7XG5pbXBvcnQgVmVjMyBmcm9tICcuL3ZlYzMnO1xuaW1wb3J0IFF1YXQgZnJvbSAnLi9xdWF0JztcbmltcG9ydCB7IEVQU0lMT04sIEZMT0FUX0FSUkFZX1RZUEUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBNYXQzIGZyb20gJy4vbWF0Myc7XG5cbmxldCBfYTAwOiBudW1iZXIgPSAwOyBsZXQgX2EwMTogbnVtYmVyID0gMDsgbGV0IF9hMDI6IG51bWJlciA9IDA7IGxldCBfYTAzOiBudW1iZXIgPSAwO1xubGV0IF9hMTA6IG51bWJlciA9IDA7IGxldCBfYTExOiBudW1iZXIgPSAwOyBsZXQgX2ExMjogbnVtYmVyID0gMDsgbGV0IF9hMTM6IG51bWJlciA9IDA7XG5sZXQgX2EyMDogbnVtYmVyID0gMDsgbGV0IF9hMjE6IG51bWJlciA9IDA7IGxldCBfYTIyOiBudW1iZXIgPSAwOyBsZXQgX2EyMzogbnVtYmVyID0gMDtcbmxldCBfYTMwOiBudW1iZXIgPSAwOyBsZXQgX2EzMTogbnVtYmVyID0gMDsgbGV0IF9hMzI6IG51bWJlciA9IDA7IGxldCBfYTMzOiBudW1iZXIgPSAwO1xuXG4vKipcbiAqICEjZW4gUmVwcmVzZW50YXRpb24gb2YgNCo0IG1hdHJpeC5cbiAqICEjemgg6KGo56S6IDQqNCDnn6npmLVcbiAqXG4gKiBAY2xhc3MgTWF0NFxuICogQGV4dGVuZHMgVmFsdWVUeXBlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hdDQgZXh0ZW5kcyBWYWx1ZVR5cGUge1xuICAgIHN0YXRpYyBtdWwgPSBNYXQ0Lm11bHRpcGx5O1xuICAgIHN0YXRpYyBzdWIgPSBNYXQ0LnN1YnRyYWN0O1xuXG4gICAgLyoqXG4gICAgICogISNlbiBNdWx0aXBseSB0aGUgY3VycmVudCBtYXRyaXggd2l0aCBhbm90aGVyIG9uZVxuICAgICAqICEjemgg5bCG5b2T5YmN55+p6Zi15LiO5oyH5a6a55+p6Zi155u45LmYXG4gICAgICogQG1ldGhvZCBtdWxcbiAgICAgKiBAcGFyYW0ge01hdDR9IG90aGVyIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgICAqIEBwYXJhbSB7TWF0NH0gW291dF0gdGhlIHJlY2VpdmluZyBtYXRyaXgsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSBtYXRyaXggdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IG1hdHJpeCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgbXVsIChtOiBNYXQ0LCBvdXQ6IE1hdDQpOiBNYXQ0IHtcbiAgICAgICAgcmV0dXJuIE1hdDQubXVsdGlwbHkob3V0IHx8IG5ldyBNYXQ0KCksIHRoaXMsIG0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAhI2VuIE11bHRpcGx5IGVhY2ggZWxlbWVudCBvZiB0aGUgbWF0cml4IGJ5IGEgc2NhbGFyLlxuICAgICAqICEjemgg5bCG55+p6Zi155qE5q+P5LiA5Liq5YWD57Sg6YO95LmY5Lul5oyH5a6a55qE57yp5pS+5YC844CCXG4gICAgICogQG1ldGhvZCBtdWxTY2FsYXJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbnVtYmVyIGFtb3VudCB0byBzY2FsZSB0aGUgbWF0cml4J3MgZWxlbWVudHMgYnlcbiAgICAgKiBAcGFyYW0ge01hdDR9IFtvdXRdIHRoZSByZWNlaXZpbmcgbWF0cml4LCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgbWF0cml4IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyBtYXRyaXggd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybnMge01hdDR9IG91dFxuICAgICAqL1xuICAgIG11bFNjYWxhciAobnVtOiBudW1iZXIsIG91dDogTWF0NCkge1xuICAgICAgICBNYXQ0Lm11bHRpcGx5U2NhbGFyKG91dCB8fCBuZXcgTWF0NCgpLCB0aGlzLCBudW0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAhI2VuIFN1YnRyYWN0cyB0aGUgY3VycmVudCBtYXRyaXggd2l0aCBhbm90aGVyIG9uZVxuICAgICAqICEjemgg5bCG5b2T5YmN55+p6Zi15LiO5oyH5a6a55qE55+p6Zi155u45YePXG4gICAgICogQG1ldGhvZCBzdWJcbiAgICAgKiBAcGFyYW0ge01hdDR9IG90aGVyIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgICAqIEBwYXJhbSB7TWF0NH0gW291dF0gdGhlIHJlY2VpdmluZyBtYXRyaXgsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSBtYXRyaXggdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IG1hdHJpeCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgc3ViIChtOiBNYXQ0LCBvdXQ6IE1hdDQpIHtcbiAgICAgICAgTWF0NC5zdWJ0cmFjdChvdXQgfHwgbmV3IE1hdDQoKSwgdGhpcywgbSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWRlbnRpdHkgIG9mIE1hdDRcbiAgICAgKiBAcHJvcGVydHkge01hdDR9IElERU5USVRZXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBJREVOVElUWSA9IE9iamVjdC5mcmVlemUobmV3IE1hdDQoKSk7XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiOt+W+l+aMh+WumuefqemYteeahOaLt+i0nVxuICAgICAqICEjZW4gQ29weSBvZiB0aGUgc3BlY2lmaWVkIG1hdHJpeCB0byBvYnRhaW5cbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjbG9uZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBjbG9uZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBhLm07XG4gICAgICAgIHJldHVybiBuZXcgTWF0NChcbiAgICAgICAgICAgIG1bMF0sIG1bMV0sIG1bMl0sIG1bM10sXG4gICAgICAgICAgICBtWzRdLCBtWzVdLCBtWzZdLCBtWzddLFxuICAgICAgICAgICAgbVs4XSwgbVs5XSwgbVsxMF0sIG1bMTFdLFxuICAgICAgICAgICAgbVsxMl0sIG1bMTNdLCBtWzE0XSwgbVsxNV0sXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlpI3liLbnm67moIfnn6npmLVcbiAgICAgKiAhI2VuIENvcHkgdGhlIHRhcmdldCBtYXRyaXhcbiAgICAgKiBAbWV0aG9kIGNvcHlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGNvcHk8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNvcHk8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubTtcbiAgICAgICAgbVswXSA9IGFtWzBdO1xuICAgICAgICBtWzFdID0gYW1bMV07XG4gICAgICAgIG1bMl0gPSBhbVsyXTtcbiAgICAgICAgbVszXSA9IGFtWzNdO1xuICAgICAgICBtWzRdID0gYW1bNF07XG4gICAgICAgIG1bNV0gPSBhbVs1XTtcbiAgICAgICAgbVs2XSA9IGFtWzZdO1xuICAgICAgICBtWzddID0gYW1bN107XG4gICAgICAgIG1bOF0gPSBhbVs4XTtcbiAgICAgICAgbVs5XSA9IGFtWzldO1xuICAgICAgICBtWzEwXSA9IGFtWzEwXTtcbiAgICAgICAgbVsxMV0gPSBhbVsxMV07XG4gICAgICAgIG1bMTJdID0gYW1bMTJdO1xuICAgICAgICBtWzEzXSA9IGFtWzEzXTtcbiAgICAgICAgbVsxNF0gPSBhbVsxNF07XG4gICAgICAgIG1bMTVdID0gYW1bMTVdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6K6+572u55+p6Zi15YC8XG4gICAgICogISNlbiBTZXR0aW5nIG1hdHJpeCB2YWx1ZXNcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHNldDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChcbiAgICAgICAgb3V0OiBPdXQsXG4gICAgICAgIG0wMDogbnVtYmVyLCBtMDE6IG51bWJlciwgbTAyOiBudW1iZXIsIG0wMzogbnVtYmVyLFxuICAgICAgICBtMTA6IG51bWJlciwgbTExOiBudW1iZXIsIG0xMjogbnVtYmVyLCBtMTM6IG51bWJlcixcbiAgICAgICAgbTIwOiBudW1iZXIsIG0yMTogbnVtYmVyLCBtMjI6IG51bWJlciwgbTIzOiBudW1iZXIsXG4gICAgICAgIG0zMDogbnVtYmVyLCBtMzE6IG51bWJlciwgbTMyOiBudW1iZXIsIG0zMzogbnVtYmVyLFxuICAgICkge1xuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gbTAwOyBtWzFdID0gbTAxOyBtWzJdID0gbTAyOyBtWzNdID0gbTAzO1xuICAgICAgICBtWzRdID0gbTEwOyBtWzVdID0gbTExOyBtWzZdID0gbTEyOyBtWzddID0gbTEzO1xuICAgICAgICBtWzhdID0gbTIwOyBtWzldID0gbTIxOyBtWzEwXSA9IG0yMjsgbVsxMV0gPSBtMjM7XG4gICAgICAgIG1bMTJdID0gbTMwOyBtWzEzXSA9IG0zMTsgbVsxNF0gPSBtMzI7IG1bMTVdID0gbTMzO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5bCG55uu5qCH6LWL5YC85Li65Y2V5L2N55+p6Zi1XG4gICAgICogISNlbiBUaGUgdGFyZ2V0IG9mIGFuIGFzc2lnbm1lbnQgaXMgdGhlIGlkZW50aXR5IG1hdHJpeFxuICAgICAqIEBtZXRob2QgaWRlbnRpdHlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGlkZW50aXR5PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgaWRlbnRpdHk8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IDE7XG4gICAgICAgIG1bMV0gPSAwO1xuICAgICAgICBtWzJdID0gMDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSAwO1xuICAgICAgICBtWzVdID0gMTtcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gMDtcbiAgICAgICAgbVs5XSA9IDA7XG4gICAgICAgIG1bMTBdID0gMTtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAwO1xuICAgICAgICBtWzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDovaznva7nn6npmLVcbiAgICAgKiAhI2VuIFRyYW5zcG9zZWQgbWF0cml4XG4gICAgICogQG1ldGhvZCB0cmFuc3Bvc2VcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRyYW5zcG9zZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgdHJhbnNwb3NlPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm07XG4gICAgICAgIC8vIElmIHdlIGFyZSB0cmFuc3Bvc2luZyBvdXJzZWx2ZXMgd2UgY2FuIHNraXAgYSBmZXcgc3RlcHMgYnV0IGhhdmUgdG8gY2FjaGUgc29tZSB2YWx1ZXNcbiAgICAgICAgaWYgKG91dCA9PT0gYSkge1xuICAgICAgICAgICAgY29uc3QgYTAxID0gYW1bMV0sIGEwMiA9IGFtWzJdLCBhMDMgPSBhbVszXSwgYTEyID0gYW1bNl0sIGExMyA9IGFtWzddLCBhMjMgPSBhbVsxMV07XG4gICAgICAgICAgICBtWzFdID0gYW1bNF07XG4gICAgICAgICAgICBtWzJdID0gYW1bOF07XG4gICAgICAgICAgICBtWzNdID0gYW1bMTJdO1xuICAgICAgICAgICAgbVs0XSA9IGEwMTtcbiAgICAgICAgICAgIG1bNl0gPSBhbVs5XTtcbiAgICAgICAgICAgIG1bN10gPSBhbVsxM107XG4gICAgICAgICAgICBtWzhdID0gYTAyO1xuICAgICAgICAgICAgbVs5XSA9IGExMjtcbiAgICAgICAgICAgIG1bMTFdID0gYW1bMTRdO1xuICAgICAgICAgICAgbVsxMl0gPSBhMDM7XG4gICAgICAgICAgICBtWzEzXSA9IGExMztcbiAgICAgICAgICAgIG1bMTRdID0gYTIzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbVswXSA9IGFtWzBdO1xuICAgICAgICAgICAgbVsxXSA9IGFtWzRdO1xuICAgICAgICAgICAgbVsyXSA9IGFtWzhdO1xuICAgICAgICAgICAgbVszXSA9IGFtWzEyXTtcbiAgICAgICAgICAgIG1bNF0gPSBhbVsxXTtcbiAgICAgICAgICAgIG1bNV0gPSBhbVs1XTtcbiAgICAgICAgICAgIG1bNl0gPSBhbVs5XTtcbiAgICAgICAgICAgIG1bN10gPSBhbVsxM107XG4gICAgICAgICAgICBtWzhdID0gYW1bMl07XG4gICAgICAgICAgICBtWzldID0gYW1bNl07XG4gICAgICAgICAgICBtWzEwXSA9IGFtWzEwXTtcbiAgICAgICAgICAgIG1bMTFdID0gYW1bMTRdO1xuICAgICAgICAgICAgbVsxMl0gPSBhbVszXTtcbiAgICAgICAgICAgIG1bMTNdID0gYW1bN107XG4gICAgICAgICAgICBtWzE0XSA9IGFtWzExXTtcbiAgICAgICAgICAgIG1bMTVdID0gYW1bMTVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnn6npmLXmsYLpgIZcbiAgICAgKiAhI2VuIE1hdHJpeCBpbnZlcnNpb25cbiAgICAgKiBAbWV0aG9kIGludmVydFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogaW52ZXJ0PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBpbnZlcnQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBsZXQgYW0gPSBhLm07XG4gICAgICAgIF9hMDAgPSBhbVswXTsgX2EwMSA9IGFtWzFdOyBfYTAyID0gYW1bMl07IF9hMDMgPSBhbVszXTtcbiAgICAgICAgX2ExMCA9IGFtWzRdOyBfYTExID0gYW1bNV07IF9hMTIgPSBhbVs2XTsgX2ExMyA9IGFtWzddO1xuICAgICAgICBfYTIwID0gYW1bOF07IF9hMjEgPSBhbVs5XTsgX2EyMiA9IGFtWzEwXTsgX2EyMyA9IGFtWzExXTtcbiAgICAgICAgX2EzMCA9IGFtWzEyXTsgX2EzMSA9IGFtWzEzXTsgX2EzMiA9IGFtWzE0XTsgX2EzMyA9IGFtWzE1XTtcblxuICAgICAgICBjb25zdCBiMDAgPSBfYTAwICogX2ExMSAtIF9hMDEgKiBfYTEwO1xuICAgICAgICBjb25zdCBiMDEgPSBfYTAwICogX2ExMiAtIF9hMDIgKiBfYTEwO1xuICAgICAgICBjb25zdCBiMDIgPSBfYTAwICogX2ExMyAtIF9hMDMgKiBfYTEwO1xuICAgICAgICBjb25zdCBiMDMgPSBfYTAxICogX2ExMiAtIF9hMDIgKiBfYTExO1xuICAgICAgICBjb25zdCBiMDQgPSBfYTAxICogX2ExMyAtIF9hMDMgKiBfYTExO1xuICAgICAgICBjb25zdCBiMDUgPSBfYTAyICogX2ExMyAtIF9hMDMgKiBfYTEyO1xuICAgICAgICBjb25zdCBiMDYgPSBfYTIwICogX2EzMSAtIF9hMjEgKiBfYTMwO1xuICAgICAgICBjb25zdCBiMDcgPSBfYTIwICogX2EzMiAtIF9hMjIgKiBfYTMwO1xuICAgICAgICBjb25zdCBiMDggPSBfYTIwICogX2EzMyAtIF9hMjMgKiBfYTMwO1xuICAgICAgICBjb25zdCBiMDkgPSBfYTIxICogX2EzMiAtIF9hMjIgKiBfYTMxO1xuICAgICAgICBjb25zdCBiMTAgPSBfYTIxICogX2EzMyAtIF9hMjMgKiBfYTMxO1xuICAgICAgICBjb25zdCBiMTEgPSBfYTIyICogX2EzMyAtIF9hMjMgKiBfYTMyO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgZGV0ZXJtaW5hbnRcbiAgICAgICAgbGV0IGRldCA9IGIwMCAqIGIxMSAtIGIwMSAqIGIxMCArIGIwMiAqIGIwOSArIGIwMyAqIGIwOCAtIGIwNCAqIGIwNyArIGIwNSAqIGIwNjtcblxuICAgICAgICBpZiAoZGV0ID09PSAwKSB7IHJldHVybiBudWxsOyB9XG4gICAgICAgIGRldCA9IDEuMCAvIGRldDtcblxuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gKF9hMTEgKiBiMTEgLSBfYTEyICogYjEwICsgX2ExMyAqIGIwOSkgKiBkZXQ7XG4gICAgICAgIG1bMV0gPSAoX2EwMiAqIGIxMCAtIF9hMDEgKiBiMTEgLSBfYTAzICogYjA5KSAqIGRldDtcbiAgICAgICAgbVsyXSA9IChfYTMxICogYjA1IC0gX2EzMiAqIGIwNCArIF9hMzMgKiBiMDMpICogZGV0O1xuICAgICAgICBtWzNdID0gKF9hMjIgKiBiMDQgLSBfYTIxICogYjA1IC0gX2EyMyAqIGIwMykgKiBkZXQ7XG4gICAgICAgIG1bNF0gPSAoX2ExMiAqIGIwOCAtIF9hMTAgKiBiMTEgLSBfYTEzICogYjA3KSAqIGRldDtcbiAgICAgICAgbVs1XSA9IChfYTAwICogYjExIC0gX2EwMiAqIGIwOCArIF9hMDMgKiBiMDcpICogZGV0O1xuICAgICAgICBtWzZdID0gKF9hMzIgKiBiMDIgLSBfYTMwICogYjA1IC0gX2EzMyAqIGIwMSkgKiBkZXQ7XG4gICAgICAgIG1bN10gPSAoX2EyMCAqIGIwNSAtIF9hMjIgKiBiMDIgKyBfYTIzICogYjAxKSAqIGRldDtcbiAgICAgICAgbVs4XSA9IChfYTEwICogYjEwIC0gX2ExMSAqIGIwOCArIF9hMTMgKiBiMDYpICogZGV0O1xuICAgICAgICBtWzldID0gKF9hMDEgKiBiMDggLSBfYTAwICogYjEwIC0gX2EwMyAqIGIwNikgKiBkZXQ7XG4gICAgICAgIG1bMTBdID0gKF9hMzAgKiBiMDQgLSBfYTMxICogYjAyICsgX2EzMyAqIGIwMCkgKiBkZXQ7XG4gICAgICAgIG1bMTFdID0gKF9hMjEgKiBiMDIgLSBfYTIwICogYjA0IC0gX2EyMyAqIGIwMCkgKiBkZXQ7XG4gICAgICAgIG1bMTJdID0gKF9hMTEgKiBiMDcgLSBfYTEwICogYjA5IC0gX2ExMiAqIGIwNikgKiBkZXQ7XG4gICAgICAgIG1bMTNdID0gKF9hMDAgKiBiMDkgLSBfYTAxICogYjA3ICsgX2EwMiAqIGIwNikgKiBkZXQ7XG4gICAgICAgIG1bMTRdID0gKF9hMzEgKiBiMDEgLSBfYTMwICogYjAzIC0gX2EzMiAqIGIwMCkgKiBkZXQ7XG4gICAgICAgIG1bMTVdID0gKF9hMjAgKiBiMDMgLSBfYTIxICogYjAxICsgX2EyMiAqIGIwMCkgKiBkZXQ7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOefqemYteihjOWIl+W8j1xuICAgICAqICEjZW4gTWF0cml4IGRldGVybWluYW50XG4gICAgICogQG1ldGhvZCBkZXRlcm1pbmFudFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZGV0ZXJtaW5hbnQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAoYTogT3V0KTogbnVtYmVyXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBkZXRlcm1pbmFudDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQpOiBudW1iZXIge1xuICAgICAgICBsZXQgbSA9IGEubTtcbiAgICAgICAgX2EwMCA9IG1bMF07IF9hMDEgPSBtWzFdOyBfYTAyID0gbVsyXTsgX2EwMyA9IG1bM107XG4gICAgICAgIF9hMTAgPSBtWzRdOyBfYTExID0gbVs1XTsgX2ExMiA9IG1bNl07IF9hMTMgPSBtWzddO1xuICAgICAgICBfYTIwID0gbVs4XTsgX2EyMSA9IG1bOV07IF9hMjIgPSBtWzEwXTsgX2EyMyA9IG1bMTFdO1xuICAgICAgICBfYTMwID0gbVsxMl07IF9hMzEgPSBtWzEzXTsgX2EzMiA9IG1bMTRdOyBfYTMzID0gbVsxNV07XG5cbiAgICAgICAgY29uc3QgYjAwID0gX2EwMCAqIF9hMTEgLSBfYTAxICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAxID0gX2EwMCAqIF9hMTIgLSBfYTAyICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAyID0gX2EwMCAqIF9hMTMgLSBfYTAzICogX2ExMDtcbiAgICAgICAgY29uc3QgYjAzID0gX2EwMSAqIF9hMTIgLSBfYTAyICogX2ExMTtcbiAgICAgICAgY29uc3QgYjA0ID0gX2EwMSAqIF9hMTMgLSBfYTAzICogX2ExMTtcbiAgICAgICAgY29uc3QgYjA1ID0gX2EwMiAqIF9hMTMgLSBfYTAzICogX2ExMjtcbiAgICAgICAgY29uc3QgYjA2ID0gX2EyMCAqIF9hMzEgLSBfYTIxICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA3ID0gX2EyMCAqIF9hMzIgLSBfYTIyICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA4ID0gX2EyMCAqIF9hMzMgLSBfYTIzICogX2EzMDtcbiAgICAgICAgY29uc3QgYjA5ID0gX2EyMSAqIF9hMzIgLSBfYTIyICogX2EzMTtcbiAgICAgICAgY29uc3QgYjEwID0gX2EyMSAqIF9hMzMgLSBfYTIzICogX2EzMTtcbiAgICAgICAgY29uc3QgYjExID0gX2EyMiAqIF9hMzMgLSBfYTIzICogX2EzMjtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG4gICAgICAgIHJldHVybiBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnn6npmLXkuZjms5VcbiAgICAgKiAhI2VuIE1hdHJpeCBNdWx0aXBsaWNhdGlvblxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG11bHRpcGx5PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5PE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubSwgYm0gPSBiLm07XG4gICAgICAgIF9hMDAgPSBhbVswXTsgX2EwMSA9IGFtWzFdOyBfYTAyID0gYW1bMl07IF9hMDMgPSBhbVszXTtcbiAgICAgICAgX2ExMCA9IGFtWzRdOyBfYTExID0gYW1bNV07IF9hMTIgPSBhbVs2XTsgX2ExMyA9IGFtWzddO1xuICAgICAgICBfYTIwID0gYW1bOF07IF9hMjEgPSBhbVs5XTsgX2EyMiA9IGFtWzEwXTsgX2EyMyA9IGFtWzExXTtcbiAgICAgICAgX2EzMCA9IGFtWzEyXTsgX2EzMSA9IGFtWzEzXTsgX2EzMiA9IGFtWzE0XTsgX2EzMyA9IGFtWzE1XTtcblxuICAgICAgICAvLyBDYWNoZSBvbmx5IHRoZSBjdXJyZW50IGxpbmUgb2YgdGhlIHNlY29uZCBtYXRyaXhcbiAgICAgICAgbGV0IGIwID0gYm1bMF0sIGIxID0gYm1bMV0sIGIyID0gYm1bMl0sIGIzID0gYm1bM107XG4gICAgICAgIG1bMF0gPSBiMCAqIF9hMDAgKyBiMSAqIF9hMTAgKyBiMiAqIF9hMjAgKyBiMyAqIF9hMzA7XG4gICAgICAgIG1bMV0gPSBiMCAqIF9hMDEgKyBiMSAqIF9hMTEgKyBiMiAqIF9hMjEgKyBiMyAqIF9hMzE7XG4gICAgICAgIG1bMl0gPSBiMCAqIF9hMDIgKyBiMSAqIF9hMTIgKyBiMiAqIF9hMjIgKyBiMyAqIF9hMzI7XG4gICAgICAgIG1bM10gPSBiMCAqIF9hMDMgKyBiMSAqIF9hMTMgKyBiMiAqIF9hMjMgKyBiMyAqIF9hMzM7XG5cbiAgICAgICAgYjAgPSBibVs0XTsgYjEgPSBibVs1XTsgYjIgPSBibVs2XTsgYjMgPSBibVs3XTtcbiAgICAgICAgbVs0XSA9IGIwICogX2EwMCArIGIxICogX2ExMCArIGIyICogX2EyMCArIGIzICogX2EzMDtcbiAgICAgICAgbVs1XSA9IGIwICogX2EwMSArIGIxICogX2ExMSArIGIyICogX2EyMSArIGIzICogX2EzMTtcbiAgICAgICAgbVs2XSA9IGIwICogX2EwMiArIGIxICogX2ExMiArIGIyICogX2EyMiArIGIzICogX2EzMjtcbiAgICAgICAgbVs3XSA9IGIwICogX2EwMyArIGIxICogX2ExMyArIGIyICogX2EyMyArIGIzICogX2EzMztcblxuICAgICAgICBiMCA9IGJtWzhdOyBiMSA9IGJtWzldOyBiMiA9IGJtWzEwXTsgYjMgPSBibVsxMV07XG4gICAgICAgIG1bOF0gPSBiMCAqIF9hMDAgKyBiMSAqIF9hMTAgKyBiMiAqIF9hMjAgKyBiMyAqIF9hMzA7XG4gICAgICAgIG1bOV0gPSBiMCAqIF9hMDEgKyBiMSAqIF9hMTEgKyBiMiAqIF9hMjEgKyBiMyAqIF9hMzE7XG4gICAgICAgIG1bMTBdID0gYjAgKiBfYTAyICsgYjEgKiBfYTEyICsgYjIgKiBfYTIyICsgYjMgKiBfYTMyO1xuICAgICAgICBtWzExXSA9IGIwICogX2EwMyArIGIxICogX2ExMyArIGIyICogX2EyMyArIGIzICogX2EzMztcblxuICAgICAgICBiMCA9IGJtWzEyXTsgYjEgPSBibVsxM107IGIyID0gYm1bMTRdOyBiMyA9IGJtWzE1XTtcbiAgICAgICAgbVsxMl0gPSBiMCAqIF9hMDAgKyBiMSAqIF9hMTAgKyBiMiAqIF9hMjAgKyBiMyAqIF9hMzA7XG4gICAgICAgIG1bMTNdID0gYjAgKiBfYTAxICsgYjEgKiBfYTExICsgYjIgKiBfYTIxICsgYjMgKiBfYTMxO1xuICAgICAgICBtWzE0XSA9IGIwICogX2EwMiArIGIxICogX2ExMiArIGIyICogX2EyMiArIGIzICogX2EzMjtcbiAgICAgICAgbVsxNV0gPSBiMCAqIF9hMDMgKyBiMSAqIF9hMTMgKyBiMiAqIF9hMjMgKyBiMyAqIF9hMzM7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlnKjnu5nlrprnn6npmLXlj5jmjaLln7rnoYDkuIrliqDlhaXlj5jmjaJcbiAgICAgKiAhI2VuIFdhcyBhZGRlZCBpbiBhIGdpdmVuIHRyYW5zZm9ybWF0aW9uIG1hdHJpeCB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgYmFzaXMgb2ZcbiAgICAgKiBAbWV0aG9kIHRyYW5zZm9ybVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdHJhbnNmb3JtPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHY6IFZlY0xpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0cmFuc2Zvcm08T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSkge1xuICAgICAgICBjb25zdCB4ID0gdi54LCB5ID0gdi55LCB6ID0gdi56O1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubTtcbiAgICAgICAgaWYgKGEgPT09IG91dCkge1xuICAgICAgICAgICAgbVsxMl0gPSBhbVswXSAqIHggKyBhbVs0XSAqIHkgKyBhbVs4XSAqIHogKyBhbVsxMl07XG4gICAgICAgICAgICBtWzEzXSA9IGFtWzFdICogeCArIGFtWzVdICogeSArIGFtWzldICogeiArIGFtWzEzXTtcbiAgICAgICAgICAgIG1bMTRdID0gYW1bMl0gKiB4ICsgYW1bNl0gKiB5ICsgYW1bMTBdICogeiArIGFtWzE0XTtcbiAgICAgICAgICAgIG1bMTVdID0gYW1bM10gKiB4ICsgYW1bN10gKiB5ICsgYW1bMTFdICogeiArIGFtWzE1XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9hMDAgPSBhbVswXTsgX2EwMSA9IGFtWzFdOyBfYTAyID0gYW1bMl07IF9hMDMgPSBhbVszXTtcbiAgICAgICAgICAgIF9hMTAgPSBhbVs0XTsgX2ExMSA9IGFtWzVdOyBfYTEyID0gYW1bNl07IF9hMTMgPSBhbVs3XTtcbiAgICAgICAgICAgIF9hMjAgPSBhbVs4XTsgX2EyMSA9IGFtWzldOyBfYTIyID0gYW1bMTBdOyBfYTIzID0gYW1bMTFdO1xuICAgICAgICAgICAgX2EzMCA9IGFtWzEyXTsgX2EzMSA9IGFtWzEzXTsgX2EzMiA9IGFtWzE0XTsgX2EzMyA9IGFtWzE1XTtcblxuICAgICAgICAgICAgbVswXSA9IF9hMDA7IG1bMV0gPSBfYTAxOyBtWzJdID0gX2EwMjsgbVszXSA9IF9hMDM7XG4gICAgICAgICAgICBtWzRdID0gX2ExMDsgbVs1XSA9IF9hMTE7IG1bNl0gPSBfYTEyOyBtWzddID0gX2ExMztcbiAgICAgICAgICAgIG1bOF0gPSBfYTIwOyBtWzldID0gX2EyMTsgbVsxMF0gPSBfYTIyOyBtWzExXSA9IF9hMjM7XG5cbiAgICAgICAgICAgIG1bMTJdID0gX2EwMCAqIHggKyBfYTEwICogeSArIF9hMjAgKiB6ICsgYW1bMTJdO1xuICAgICAgICAgICAgbVsxM10gPSBfYTAxICogeCArIF9hMTEgKiB5ICsgX2EyMSAqIHogKyBhbVsxM107XG4gICAgICAgICAgICBtWzE0XSA9IF9hMDIgKiB4ICsgX2ExMiAqIHkgKyBfYTIyICogeiArIGFtWzE0XTtcbiAgICAgICAgICAgIG1bMTVdID0gX2EwMyAqIHggKyBfYTEzICogeSArIF9hMjMgKiB6ICsgYW1bMTVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlnKjnu5nlrprnn6npmLXlj5jmjaLln7rnoYDkuIrliqDlhaXmlrDkvY3np7vlj5jmjaJcbiAgICAgKiAhI2VuIEFkZCBuZXcgZGlzcGxhY2VtZW50IHRyYW5zZHVjZXIgaW4gYSBtYXRyaXggdHJhbnNmb3JtYXRpb24gb24gdGhlIGJhc2lzIG9mIGEgZ2l2ZW5cbiAgICAgKiBAbWV0aG9kIHRyYW5zbGF0ZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdHJhbnNsYXRlPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHY6IFZlY0xpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0cmFuc2xhdGU8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSkge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubTtcbiAgICAgICAgaWYgKGEgPT09IG91dCkge1xuICAgICAgICAgICAgbVsxMl0gKz0gdi54O1xuICAgICAgICAgICAgbVsxM10gKz0gdi55O1xuICAgICAgICAgICAgbVsxNF0gKz0gdi55O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbVswXSA9IGFtWzBdOyBtWzFdID0gYW1bMV07IG1bMl0gPSBhbVsyXTsgbVszXSA9IGFtWzNdO1xuICAgICAgICAgICAgbVs0XSA9IGFtWzRdOyBtWzVdID0gYW1bNV07IG1bNl0gPSBhbVs2XTsgbVs3XSA9IGFtWzddO1xuICAgICAgICAgICAgbVs4XSA9IGFtWzhdOyBtWzldID0gYW1bOV07IG1bMTBdID0gYW1bMTBdOyBtWzExXSA9IGFtWzExXTtcbiAgICAgICAgICAgIG1bMTJdICs9IHYueDtcbiAgICAgICAgICAgIG1bMTNdICs9IHYueTtcbiAgICAgICAgICAgIG1bMTRdICs9IHYuejtcbiAgICAgICAgICAgIG1bMTVdID0gYW1bMTVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlnKjnu5nlrprnn6npmLXlj5jmjaLln7rnoYDkuIrliqDlhaXmlrDnvKnmlL7lj5jmjaJcbiAgICAgKiAhI2VuIEFkZCBuZXcgc2NhbGluZyB0cmFuc2Zvcm1hdGlvbiBpbiBhIGdpdmVuIG1hdHJpeCB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgYmFzaXMgb2ZcbiAgICAgKiBAbWV0aG9kIHNjYWxlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzY2FsZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCB2OiBWZWNMaWtlKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc2NhbGU8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgdjogVmVjTGlrZSkge1xuICAgICAgICBjb25zdCB4ID0gdi54LCB5ID0gdi55LCB6ID0gdi56O1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubTtcbiAgICAgICAgbVswXSA9IGFtWzBdICogeDtcbiAgICAgICAgbVsxXSA9IGFtWzFdICogeDtcbiAgICAgICAgbVsyXSA9IGFtWzJdICogeDtcbiAgICAgICAgbVszXSA9IGFtWzNdICogeDtcbiAgICAgICAgbVs0XSA9IGFtWzRdICogeTtcbiAgICAgICAgbVs1XSA9IGFtWzVdICogeTtcbiAgICAgICAgbVs2XSA9IGFtWzZdICogeTtcbiAgICAgICAgbVs3XSA9IGFtWzddICogeTtcbiAgICAgICAgbVs4XSA9IGFtWzhdICogejtcbiAgICAgICAgbVs5XSA9IGFtWzldICogejtcbiAgICAgICAgbVsxMF0gPSBhbVsxMF0gKiB6O1xuICAgICAgICBtWzExXSA9IGFtWzExXSAqIHo7XG4gICAgICAgIG1bMTJdID0gYW1bMTJdO1xuICAgICAgICBtWzEzXSA9IGFtWzEzXTtcbiAgICAgICAgbVsxNF0gPSBhbVsxNF07XG4gICAgICAgIG1bMTVdID0gYW1bMTVdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl5paw5peL6L2s5Y+Y5o2iXG4gICAgICogISNlbiBBZGQgYSBuZXcgcm90YXRpb25hbCB0cmFuc2Zvcm0gbWF0cml4IHRyYW5zZm9ybWF0aW9uIG9uIHRoZSBiYXNpcyBvZiBhIGdpdmVuXG4gICAgICogQG1ldGhvZCByb3RhdGVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJvdGF0ZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogT3V0LCByYWQ6IG51bWJlciwgYXhpczogVmVjTGlrZSlcbiAgICAgKiBAcGFyYW0gcmFkIOaXi+i9rOinkuW6plxuICAgICAqIEBwYXJhbSBheGlzIOaXi+i9rOi9tFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcm90YXRlPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyLCBheGlzOiBWZWNMaWtlKSB7XG4gICAgICAgIGxldCB4ID0gYXhpcy54LCB5ID0gYXhpcy55LCB6ID0gYXhpcy56O1xuXG4gICAgICAgIGxldCBsZW4gPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSArIHogKiB6KTtcblxuICAgICAgICBpZiAoTWF0aC5hYnMobGVuKSA8IEVQU0lMT04pIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGVuID0gMSAvIGxlbjtcbiAgICAgICAgeCAqPSBsZW47XG4gICAgICAgIHkgKj0gbGVuO1xuICAgICAgICB6ICo9IGxlbjtcblxuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKTtcbiAgICAgICAgY29uc3QgYyA9IE1hdGguY29zKHJhZCk7XG4gICAgICAgIGNvbnN0IHQgPSAxIC0gYztcblxuICAgICAgICBsZXQgYW0gPSBhLm07XG4gICAgICAgIF9hMDAgPSBhbVswXTsgX2EwMSA9IGFtWzFdOyBfYTAyID0gYW1bMl07IF9hMDMgPSBhbVszXTtcbiAgICAgICAgX2ExMCA9IGFtWzRdOyBfYTExID0gYW1bNV07IF9hMTIgPSBhbVs2XTsgX2ExMyA9IGFtWzddO1xuICAgICAgICBfYTIwID0gYW1bOF07IF9hMjEgPSBhbVs5XTsgX2EyMiA9IGFtWzEwXTsgX2EyMyA9IGFtWzExXTtcblxuICAgICAgICAvLyBDb25zdHJ1Y3QgdGhlIGVsZW1lbnRzIG9mIHRoZSByb3RhdGlvbiBtYXRyaXhcbiAgICAgICAgY29uc3QgYjAwID0geCAqIHggKiB0ICsgYywgYjAxID0geSAqIHggKiB0ICsgeiAqIHMsIGIwMiA9IHogKiB4ICogdCAtIHkgKiBzO1xuICAgICAgICBjb25zdCBiMTAgPSB4ICogeSAqIHQgLSB6ICogcywgYjExID0geSAqIHkgKiB0ICsgYywgYjEyID0geiAqIHkgKiB0ICsgeCAqIHM7XG4gICAgICAgIGNvbnN0IGIyMCA9IHggKiB6ICogdCArIHkgKiBzLCBiMjEgPSB5ICogeiAqIHQgLSB4ICogcywgYjIyID0geiAqIHogKiB0ICsgYztcblxuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICAvLyBQZXJmb3JtIHJvdGF0aW9uLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgICAgICBtWzBdID0gX2EwMCAqIGIwMCArIF9hMTAgKiBiMDEgKyBfYTIwICogYjAyO1xuICAgICAgICBtWzFdID0gX2EwMSAqIGIwMCArIF9hMTEgKiBiMDEgKyBfYTIxICogYjAyO1xuICAgICAgICBtWzJdID0gX2EwMiAqIGIwMCArIF9hMTIgKiBiMDEgKyBfYTIyICogYjAyO1xuICAgICAgICBtWzNdID0gX2EwMyAqIGIwMCArIF9hMTMgKiBiMDEgKyBfYTIzICogYjAyO1xuICAgICAgICBtWzRdID0gX2EwMCAqIGIxMCArIF9hMTAgKiBiMTEgKyBfYTIwICogYjEyO1xuICAgICAgICBtWzVdID0gX2EwMSAqIGIxMCArIF9hMTEgKiBiMTEgKyBfYTIxICogYjEyO1xuICAgICAgICBtWzZdID0gX2EwMiAqIGIxMCArIF9hMTIgKiBiMTEgKyBfYTIyICogYjEyO1xuICAgICAgICBtWzddID0gX2EwMyAqIGIxMCArIF9hMTMgKiBiMTEgKyBfYTIzICogYjEyO1xuICAgICAgICBtWzhdID0gX2EwMCAqIGIyMCArIF9hMTAgKiBiMjEgKyBfYTIwICogYjIyO1xuICAgICAgICBtWzldID0gX2EwMSAqIGIyMCArIF9hMTEgKiBiMjEgKyBfYTIxICogYjIyO1xuICAgICAgICBtWzEwXSA9IF9hMDIgKiBiMjAgKyBfYTEyICogYjIxICsgX2EyMiAqIGIyMjtcbiAgICAgICAgbVsxMV0gPSBfYTAzICogYjIwICsgX2ExMyAqIGIyMSArIF9hMjMgKiBiMjI7XG5cbiAgICAgICAgLy8gSWYgdGhlIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gZGlmZmVyLCBjb3B5IHRoZSB1bmNoYW5nZWQgbGFzdCByb3dcbiAgICAgICAgaWYgKGEgIT09IG91dCkge1xuICAgICAgICAgICAgbVsxMl0gPSBhbVsxMl07XG4gICAgICAgICAgICBtWzEzXSA9IGFtWzEzXTtcbiAgICAgICAgICAgIG1bMTRdID0gYW1bMTRdO1xuICAgICAgICAgICAgbVsxNV0gPSBhbVsxNV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl57uVIFgg6L2055qE5peL6L2s5Y+Y5o2iXG4gICAgICogISNlbiBBZGQgcm90YXRpb25hbCB0cmFuc2Zvcm1hdGlvbiBhcm91bmQgdGhlIFggYXhpcyBhdCBhIGdpdmVuIG1hdHJpeCB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgYmFzaXMgb2ZcbiAgICAgKiBAbWV0aG9kIHJvdGF0ZVhcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJvdGF0ZVg8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpXG4gICAgICogQHBhcmFtIHJhZCDml4vovazop5LluqZcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdGF0ZVg8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm07XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICAgICAgYyA9IE1hdGguY29zKHJhZCksXG4gICAgICAgICAgICBhMTAgPSBhbVs0XSxcbiAgICAgICAgICAgIGExMSA9IGFtWzVdLFxuICAgICAgICAgICAgYTEyID0gYW1bNl0sXG4gICAgICAgICAgICBhMTMgPSBhbVs3XSxcbiAgICAgICAgICAgIGEyMCA9IGFtWzhdLFxuICAgICAgICAgICAgYTIxID0gYW1bOV0sXG4gICAgICAgICAgICBhMjIgPSBhbVsxMF0sXG4gICAgICAgICAgICBhMjMgPSBhbVsxMV07XG5cbiAgICAgICAgaWYgKGEgIT09IG91dCkgeyAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCByb3dzXG4gICAgICAgICAgICBtWzBdID0gYW1bMF07XG4gICAgICAgICAgICBtWzFdID0gYW1bMV07XG4gICAgICAgICAgICBtWzJdID0gYW1bMl07XG4gICAgICAgICAgICBtWzNdID0gYW1bM107XG4gICAgICAgICAgICBtWzEyXSA9IGFtWzEyXTtcbiAgICAgICAgICAgIG1bMTNdID0gYW1bMTNdO1xuICAgICAgICAgICAgbVsxNF0gPSBhbVsxNF07XG4gICAgICAgICAgICBtWzE1XSA9IGFtWzE1XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICAgICAgbVs0XSA9IGExMCAqIGMgKyBhMjAgKiBzO1xuICAgICAgICBtWzVdID0gYTExICogYyArIGEyMSAqIHM7XG4gICAgICAgIG1bNl0gPSBhMTIgKiBjICsgYTIyICogcztcbiAgICAgICAgbVs3XSA9IGExMyAqIGMgKyBhMjMgKiBzO1xuICAgICAgICBtWzhdID0gYTIwICogYyAtIGExMCAqIHM7XG4gICAgICAgIG1bOV0gPSBhMjEgKiBjIC0gYTExICogcztcbiAgICAgICAgbVsxMF0gPSBhMjIgKiBjIC0gYTEyICogcztcbiAgICAgICAgbVsxMV0gPSBhMjMgKiBjIC0gYTEzICogcztcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl57uVIFkg6L2055qE5peL6L2s5Y+Y5o2iXG4gICAgICogISNlbiBBZGQgYWJvdXQgdGhlIFkgYXhpcyByb3RhdGlvbiB0cmFuc2Zvcm1hdGlvbiBpbiBhIGdpdmVuIG1hdHJpeCB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgYmFzaXMgb2ZcbiAgICAgKiBAbWV0aG9kIHJvdGF0ZVlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJvdGF0ZVk8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpXG4gICAgICogQHBhcmFtIHJhZCDml4vovazop5LluqZcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdGF0ZVk8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm07XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLFxuICAgICAgICAgICAgYyA9IE1hdGguY29zKHJhZCksXG4gICAgICAgICAgICBhMDAgPSBhbVswXSxcbiAgICAgICAgICAgIGEwMSA9IGFtWzFdLFxuICAgICAgICAgICAgYTAyID0gYW1bMl0sXG4gICAgICAgICAgICBhMDMgPSBhbVszXSxcbiAgICAgICAgICAgIGEyMCA9IGFtWzhdLFxuICAgICAgICAgICAgYTIxID0gYW1bOV0sXG4gICAgICAgICAgICBhMjIgPSBhbVsxMF0sXG4gICAgICAgICAgICBhMjMgPSBhbVsxMV07XG5cbiAgICAgICAgaWYgKGEgIT09IG91dCkgeyAvLyBJZiB0aGUgc291cmNlIGFuZCBkZXN0aW5hdGlvbiBkaWZmZXIsIGNvcHkgdGhlIHVuY2hhbmdlZCByb3dzXG4gICAgICAgICAgICBtWzRdID0gYW1bNF07XG4gICAgICAgICAgICBtWzVdID0gYW1bNV07XG4gICAgICAgICAgICBtWzZdID0gYW1bNl07XG4gICAgICAgICAgICBtWzddID0gYW1bN107XG4gICAgICAgICAgICBtWzEyXSA9IGFtWzEyXTtcbiAgICAgICAgICAgIG1bMTNdID0gYW1bMTNdO1xuICAgICAgICAgICAgbVsxNF0gPSBhbVsxNF07XG4gICAgICAgICAgICBtWzE1XSA9IGFtWzE1XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICAgICAgbVswXSA9IGEwMCAqIGMgLSBhMjAgKiBzO1xuICAgICAgICBtWzFdID0gYTAxICogYyAtIGEyMSAqIHM7XG4gICAgICAgIG1bMl0gPSBhMDIgKiBjIC0gYTIyICogcztcbiAgICAgICAgbVszXSA9IGEwMyAqIGMgLSBhMjMgKiBzO1xuICAgICAgICBtWzhdID0gYTAwICogcyArIGEyMCAqIGM7XG4gICAgICAgIG1bOV0gPSBhMDEgKiBzICsgYTIxICogYztcbiAgICAgICAgbVsxMF0gPSBhMDIgKiBzICsgYTIyICogYztcbiAgICAgICAgbVsxMV0gPSBhMDMgKiBzICsgYTIzICogYztcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Zyo57uZ5a6a55+p6Zi15Y+Y5o2i5Z+656GA5LiK5Yqg5YWl57uVIFog6L2055qE5peL6L2s5Y+Y5o2iXG4gICAgICogISNlbiBBZGRlZCBhYm91dCB0aGUgWiBheGlzIGF0IGEgZ2l2ZW4gcm90YXRpb25hbCB0cmFuc2Zvcm1hdGlvbiBtYXRyaXggdHJhbnNmb3JtYXRpb24gb24gdGhlIGJhc2lzIG9mXG4gICAgICogQG1ldGhvZCByb3RhdGVaXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByb3RhdGVaPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKVxuICAgICAqIEBwYXJhbSByYWQg5peL6L2s6KeS5bqmXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3RhdGVaPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGFtID0gYS5tO1xuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKSxcbiAgICAgICAgICAgIGMgPSBNYXRoLmNvcyhyYWQpLFxuICAgICAgICAgICAgYTAwID0gYS5tWzBdLFxuICAgICAgICAgICAgYTAxID0gYS5tWzFdLFxuICAgICAgICAgICAgYTAyID0gYS5tWzJdLFxuICAgICAgICAgICAgYTAzID0gYS5tWzNdLFxuICAgICAgICAgICAgYTEwID0gYS5tWzRdLFxuICAgICAgICAgICAgYTExID0gYS5tWzVdLFxuICAgICAgICAgICAgYTEyID0gYS5tWzZdLFxuICAgICAgICAgICAgYTEzID0gYS5tWzddO1xuXG4gICAgICAgIC8vIElmIHRoZSBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIGRpZmZlciwgY29weSB0aGUgdW5jaGFuZ2VkIGxhc3Qgcm93XG4gICAgICAgIGlmIChhICE9PSBvdXQpIHtcbiAgICAgICAgICAgIG1bOF0gPSBhbVs4XTtcbiAgICAgICAgICAgIG1bOV0gPSBhbVs5XTtcbiAgICAgICAgICAgIG1bMTBdID0gYW1bMTBdO1xuICAgICAgICAgICAgbVsxMV0gPSBhbVsxMV07XG4gICAgICAgICAgICBtWzEyXSA9IGFtWzEyXTtcbiAgICAgICAgICAgIG1bMTNdID0gYW1bMTNdO1xuICAgICAgICAgICAgbVsxNF0gPSBhbVsxNF07XG4gICAgICAgICAgICBtWzE1XSA9IGFtWzE1XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICAgICAgbVswXSA9IGEwMCAqIGMgKyBhMTAgKiBzO1xuICAgICAgICBtWzFdID0gYTAxICogYyArIGExMSAqIHM7XG4gICAgICAgIG1bMl0gPSBhMDIgKiBjICsgYTEyICogcztcbiAgICAgICAgbVszXSA9IGEwMyAqIGMgKyBhMTMgKiBzO1xuICAgICAgICBtWzRdID0gYTEwICogYyAtIGEwMCAqIHM7XG4gICAgICAgIG1bNV0gPSBhMTEgKiBjIC0gYTAxICogcztcbiAgICAgICAgbVs2XSA9IGExMiAqIGMgLSBhMDIgKiBzO1xuICAgICAgICBtWzddID0gYTEzICogYyAtIGEwMyAqIHM7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+S9jeenu+efqemYtVxuICAgICAqICEjZW4gRGlzcGxhY2VtZW50IG1hdHJpeCBjYWxjdWxhdGlvblxuICAgICAqIEBtZXRob2QgZnJvbVRyYW5zbGF0aW9uXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tVHJhbnNsYXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IFZlY0xpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tVHJhbnNsYXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IFZlY0xpa2UpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IDE7XG4gICAgICAgIG1bMV0gPSAwO1xuICAgICAgICBtWzJdID0gMDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSAwO1xuICAgICAgICBtWzVdID0gMTtcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gMDtcbiAgICAgICAgbVs5XSA9IDA7XG4gICAgICAgIG1bMTBdID0gMTtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IHYueDtcbiAgICAgICAgbVsxM10gPSB2Lnk7XG4gICAgICAgIG1bMTRdID0gdi56O1xuICAgICAgICBtWzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorqHnrpfnvKnmlL7nn6npmLVcbiAgICAgKiAhI2VuIFNjYWxpbmcgbWF0cml4IGNhbGN1bGF0aW9uXG4gICAgICogQG1ldGhvZCBmcm9tU2NhbGluZ1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZnJvbVNjYWxpbmc8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHY6IFZlY0xpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tU2NhbGluZzxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgdjogVmVjTGlrZSkge1xuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gdi54O1xuICAgICAgICBtWzFdID0gMDtcbiAgICAgICAgbVsyXSA9IDA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gMDtcbiAgICAgICAgbVs1XSA9IHYueTtcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gMDtcbiAgICAgICAgbVs5XSA9IDA7XG4gICAgICAgIG1bMTBdID0gdi56O1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+aXi+i9rOefqemYtVxuICAgICAqICEjZW4gQ2FsY3VsYXRlcyB0aGUgcm90YXRpb24gbWF0cml4XG4gICAgICogQG1ldGhvZCBmcm9tUm90YXRpb25cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21Sb3RhdGlvbjxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgcmFkOiBudW1iZXIsIGF4aXM6IFZlY0xpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tUm90YXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHJhZDogbnVtYmVyLCBheGlzOiBWZWNMaWtlKSB7XG4gICAgICAgIGxldCB4ID0gYXhpcy54LCB5ID0gYXhpcy55LCB6ID0gYXhpcy56O1xuICAgICAgICBsZXQgbGVuID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKGxlbikgPCBFUFNJTE9OKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxlbiA9IDEgLyBsZW47XG4gICAgICAgIHggKj0gbGVuO1xuICAgICAgICB5ICo9IGxlbjtcbiAgICAgICAgeiAqPSBsZW47XG5cbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKHJhZCk7XG4gICAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgICAgICBjb25zdCB0ID0gMSAtIGM7XG5cbiAgICAgICAgLy8gUGVyZm9ybSByb3RhdGlvbi1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IHggKiB4ICogdCArIGM7XG4gICAgICAgIG1bMV0gPSB5ICogeCAqIHQgKyB6ICogcztcbiAgICAgICAgbVsyXSA9IHogKiB4ICogdCAtIHkgKiBzO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IHggKiB5ICogdCAtIHogKiBzO1xuICAgICAgICBtWzVdID0geSAqIHkgKiB0ICsgYztcbiAgICAgICAgbVs2XSA9IHogKiB5ICogdCArIHggKiBzO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IHggKiB6ICogdCArIHkgKiBzO1xuICAgICAgICBtWzldID0geSAqIHogKiB0IC0geCAqIHM7XG4gICAgICAgIG1bMTBdID0geiAqIHogKiB0ICsgYztcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAwO1xuICAgICAgICBtWzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorqHnrpfnu5UgWCDovbTnmoTml4vovaznn6npmLVcbiAgICAgKiAhI2VuIENhbGN1bGF0aW5nIHJvdGF0aW9uIG1hdHJpeCBhYm91dCB0aGUgWCBheGlzXG4gICAgICogQG1ldGhvZCBmcm9tWFJvdGF0aW9uXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tWFJvdGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCByYWQ6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21YUm90YXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHJhZDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihyYWQpLCBjID0gTWF0aC5jb3MocmFkKTtcblxuICAgICAgICAvLyBQZXJmb3JtIGF4aXMtc3BlY2lmaWMgbWF0cml4IG11bHRpcGxpY2F0aW9uXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAxO1xuICAgICAgICBtWzFdID0gMDtcbiAgICAgICAgbVsyXSA9IDA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gMDtcbiAgICAgICAgbVs1XSA9IGM7XG4gICAgICAgIG1bNl0gPSBzO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IDA7XG4gICAgICAgIG1bOV0gPSAtcztcbiAgICAgICAgbVsxMF0gPSBjO1xuICAgICAgICBtWzExXSA9IDA7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+e7lSBZIOi9tOeahOaXi+i9rOefqemYtVxuICAgICAqICEjZW4gQ2FsY3VsYXRpbmcgcm90YXRpb24gbWF0cml4IGFib3V0IHRoZSBZIGF4aXNcbiAgICAgKiBAbWV0aG9kIGZyb21ZUm90YXRpb25cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21ZUm90YXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHJhZDogbnVtYmVyKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVlSb3RhdGlvbjxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgcmFkOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKHJhZCksIGMgPSBNYXRoLmNvcyhyYWQpO1xuXG4gICAgICAgIC8vIFBlcmZvcm0gYXhpcy1zcGVjaWZpYyBtYXRyaXggbXVsdGlwbGljYXRpb25cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IGM7XG4gICAgICAgIG1bMV0gPSAwO1xuICAgICAgICBtWzJdID0gLXM7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gMDtcbiAgICAgICAgbVs1XSA9IDE7XG4gICAgICAgIG1bNl0gPSAwO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IHM7XG4gICAgICAgIG1bOV0gPSAwO1xuICAgICAgICBtWzEwXSA9IGM7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSAwO1xuICAgICAgICBtWzEzXSA9IDA7XG4gICAgICAgIG1bMTRdID0gMDtcbiAgICAgICAgbVsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6K6h566X57uVIFog6L2055qE5peL6L2s55+p6Zi1XG4gICAgICogISNlbiBDYWxjdWxhdGluZyByb3RhdGlvbiBtYXRyaXggYWJvdXQgdGhlIFogYXhpc1xuICAgICAqIEBtZXRob2QgZnJvbVpSb3RhdGlvblxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZnJvbVpSb3RhdGlvbjxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgcmFkOiBudW1iZXIpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tWlJvdGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCByYWQ6IG51bWJlcikge1xuICAgICAgICBjb25zdCBzID0gTWF0aC5zaW4ocmFkKSwgYyA9IE1hdGguY29zKHJhZCk7XG5cbiAgICAgICAgLy8gUGVyZm9ybSBheGlzLXNwZWNpZmljIG1hdHJpeCBtdWx0aXBsaWNhdGlvblxuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gYztcbiAgICAgICAgbVsxXSA9IHM7XG4gICAgICAgIG1bMl0gPSAwO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IC1zO1xuICAgICAgICBtWzVdID0gYztcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gMDtcbiAgICAgICAgbVs5XSA9IDA7XG4gICAgICAgIG1bMTBdID0gMTtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAwO1xuICAgICAgICBtWzE1XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmoLnmja7ml4vovazlkozkvY3np7vkv6Hmga/orqHnrpfnn6npmLVcbiAgICAgKiAhI2VuIFRoZSByb3RhdGlvbiBhbmQgZGlzcGxhY2VtZW50IGluZm9ybWF0aW9uIGNhbGN1bGF0aW5nIG1hdHJpeFxuICAgICAqIEBtZXRob2QgZnJvbVJUXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tUlQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tUlQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UpIHtcbiAgICAgICAgY29uc3QgeCA9IHEueCwgeSA9IHEueSwgeiA9IHEueiwgdyA9IHEudztcbiAgICAgICAgY29uc3QgeDIgPSB4ICsgeDtcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcbiAgICAgICAgY29uc3QgejIgPSB6ICsgejtcblxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcbiAgICAgICAgY29uc3QgeHkgPSB4ICogeTI7XG4gICAgICAgIGNvbnN0IHh6ID0geCAqIHoyO1xuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcbiAgICAgICAgY29uc3QgeXogPSB5ICogejI7XG4gICAgICAgIGNvbnN0IHp6ID0geiAqIHoyO1xuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcbiAgICAgICAgY29uc3Qgd3kgPSB3ICogeTI7XG4gICAgICAgIGNvbnN0IHd6ID0gdyAqIHoyO1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAxIC0gKHl5ICsgenopO1xuICAgICAgICBtWzFdID0geHkgKyB3ejtcbiAgICAgICAgbVsyXSA9IHh6IC0gd3k7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0geHkgLSB3ejtcbiAgICAgICAgbVs1XSA9IDEgLSAoeHggKyB6eik7XG4gICAgICAgIG1bNl0gPSB5eiArIHd4O1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IHh6ICsgd3k7XG4gICAgICAgIG1bOV0gPSB5eiAtIHd4O1xuICAgICAgICBtWzEwXSA9IDEgLSAoeHggKyB5eSk7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSB2Lng7XG4gICAgICAgIG1bMTNdID0gdi55O1xuICAgICAgICBtWzE0XSA9IHYuejtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmj5Dlj5bnn6npmLXnmoTkvY3np7vkv6Hmga8sIOm7mOiupOefqemYteS4reeahOWPmOaNouS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxuICAgICAqICEjZW4gRXh0cmFjdGluZyBkaXNwbGFjZW1lbnQgaW5mb3JtYXRpb24gb2YgdGhlIG1hdHJpeCwgdGhlIG1hdHJpeCB0cmFuc2Zvcm0gdG8gdGhlIGRlZmF1bHQgc2VxdWVudGlhbCBhcHBsaWNhdGlvbiBTLT4gUi0+IFQgaXNcbiAgICAgKiBAbWV0aG9kIGdldFRyYW5zbGF0aW9uXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBnZXRUcmFuc2xhdGlvbjxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IFZlY0xpa2UsIG1hdDogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0VHJhbnNsYXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBWZWNMaWtlLCBtYXQ6IE91dCkge1xuICAgICAgICBsZXQgbSA9IG1hdC5tO1xuICAgICAgICBvdXQueCA9IG1bMTJdO1xuICAgICAgICBvdXQueSA9IG1bMTNdO1xuICAgICAgICBvdXQueiA9IG1bMTRdO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmj5Dlj5bnn6npmLXnmoTnvKnmlL7kv6Hmga8sIOm7mOiupOefqemYteS4reeahOWPmOaNouS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxuICAgICAqICEjZW4gU2NhbGluZyBpbmZvcm1hdGlvbiBleHRyYWN0aW9uIG1hdHJpeCwgdGhlIG1hdHJpeCB0cmFuc2Zvcm0gdG8gdGhlIGRlZmF1bHQgc2VxdWVudGlhbCBhcHBsaWNhdGlvbiBTLT4gUi0+IFQgaXNcbiAgICAgKiBAbWV0aG9kIGdldFNjYWxpbmdcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldFNjYWxpbmc8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBWZWNMaWtlLCBtYXQ6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldFNjYWxpbmc8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBWZWNMaWtlLCBtYXQ6IE91dCkge1xuICAgICAgICBsZXQgbSA9IG1hdC5tO1xuICAgICAgICBsZXQgbTMgPSBtM18xLm07XG4gICAgICAgIGNvbnN0IG0wMCA9IG0zWzBdID0gbVswXTtcbiAgICAgICAgY29uc3QgbTAxID0gbTNbMV0gPSBtWzFdO1xuICAgICAgICBjb25zdCBtMDIgPSBtM1syXSA9IG1bMl07XG4gICAgICAgIGNvbnN0IG0wNCA9IG0zWzNdID0gbVs0XTtcbiAgICAgICAgY29uc3QgbTA1ID0gbTNbNF0gPSBtWzVdO1xuICAgICAgICBjb25zdCBtMDYgPSBtM1s1XSA9IG1bNl07XG4gICAgICAgIGNvbnN0IG0wOCA9IG0zWzZdID0gbVs4XTtcbiAgICAgICAgY29uc3QgbTA5ID0gbTNbN10gPSBtWzldO1xuICAgICAgICBjb25zdCBtMTAgPSBtM1s4XSA9IG1bMTBdO1xuICAgICAgICBvdXQueCA9IE1hdGguc3FydChtMDAgKiBtMDAgKyBtMDEgKiBtMDEgKyBtMDIgKiBtMDIpO1xuICAgICAgICBvdXQueSA9IE1hdGguc3FydChtMDQgKiBtMDQgKyBtMDUgKiBtMDUgKyBtMDYgKiBtMDYpO1xuICAgICAgICBvdXQueiA9IE1hdGguc3FydChtMDggKiBtMDggKyBtMDkgKiBtMDkgKyBtMTAgKiBtMTApO1xuICAgICAgICAvLyBhY2NvdW50IGZvciByZWZlY3Rpb25zXG4gICAgICAgIGlmIChNYXQzLmRldGVybWluYW50KG0zXzEpIDwgMCkgeyBvdXQueCAqPSAtMTsgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5o+Q5Y+W55+p6Zi155qE5peL6L2s5L+h5oGvLCDpu5jorqTovpPlhaXnn6npmLXkuI3lkKvmnInnvKnmlL7kv6Hmga/vvIzlpoLogIPomZHnvKnmlL7lupTkvb/nlKggYHRvUlRTYCDlh73mlbDjgIJcbiAgICAgKiAhI2VuIFJvdGF0aW9uIGluZm9ybWF0aW9uIGV4dHJhY3Rpb24gbWF0cml4LCB0aGUgbWF0cml4IGNvbnRhaW5pbmcgbm8gZGVmYXVsdCBpbnB1dCBzY2FsaW5nIGluZm9ybWF0aW9uLCBzdWNoIGFzIHRoZSB1c2Ugb2YgYHRvUlRTYCBzaG91bGQgY29uc2lkZXIgdGhlIHNjYWxpbmcgZnVuY3Rpb24uXG4gICAgICogQG1ldGhvZCBnZXRSb3RhdGlvblxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZ2V0Um90YXRpb248T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBRdWF0LCBtYXQ6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGdldFJvdGF0aW9uPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogUXVhdCwgbWF0OiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgY29uc3QgdHJhY2UgPSBtWzBdICsgbVs1XSArIG1bMTBdO1xuICAgICAgICBsZXQgUyA9IDA7XG5cbiAgICAgICAgaWYgKHRyYWNlID4gMCkge1xuICAgICAgICAgICAgUyA9IE1hdGguc3FydCh0cmFjZSArIDEuMCkgKiAyO1xuICAgICAgICAgICAgb3V0LncgPSAwLjI1ICogUztcbiAgICAgICAgICAgIG91dC54ID0gKG1bNl0gLSBtWzldKSAvIFM7XG4gICAgICAgICAgICBvdXQueSA9IChtWzhdIC0gbVsyXSkgLyBTO1xuICAgICAgICAgICAgb3V0LnogPSAobVsxXSAtIG1bNF0pIC8gUztcbiAgICAgICAgfSBlbHNlIGlmICgobVswXSA+IG1bNV0pICYmIChtWzBdID4gbVsxMF0pKSB7XG4gICAgICAgICAgICBTID0gTWF0aC5zcXJ0KDEuMCArIG1bMF0gLSBtWzVdIC0gbVsxMF0pICogMjtcbiAgICAgICAgICAgIG91dC53ID0gKG1bNl0gLSBtWzldKSAvIFM7XG4gICAgICAgICAgICBvdXQueCA9IDAuMjUgKiBTO1xuICAgICAgICAgICAgb3V0LnkgPSAobVsxXSArIG1bNF0pIC8gUztcbiAgICAgICAgICAgIG91dC56ID0gKG1bOF0gKyBtWzJdKSAvIFM7XG4gICAgICAgIH0gZWxzZSBpZiAobVs1XSA+IG1bMTBdKSB7XG4gICAgICAgICAgICBTID0gTWF0aC5zcXJ0KDEuMCArIG1bNV0gLSBtWzBdIC0gbVsxMF0pICogMjtcbiAgICAgICAgICAgIG91dC53ID0gKG1bOF0gLSBtWzJdKSAvIFM7XG4gICAgICAgICAgICBvdXQueCA9IChtWzFdICsgbVs0XSkgLyBTO1xuICAgICAgICAgICAgb3V0LnkgPSAwLjI1ICogUztcbiAgICAgICAgICAgIG91dC56ID0gKG1bNl0gKyBtWzldKSAvIFM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBTID0gTWF0aC5zcXJ0KDEuMCArIG1bMTBdIC0gbVswXSAtIG1bNV0pICogMjtcbiAgICAgICAgICAgIG91dC53ID0gKG1bMV0gLSBtWzRdKSAvIFM7XG4gICAgICAgICAgICBvdXQueCA9IChtWzhdICsgbVsyXSkgLyBTO1xuICAgICAgICAgICAgb3V0LnkgPSAobVs2XSArIG1bOV0pIC8gUztcbiAgICAgICAgICAgIG91dC56ID0gMC4yNSAqIFM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5o+Q5Y+W5peL6L2s44CB5L2N56e744CB57yp5pS+5L+h5oGv77yMIOm7mOiupOefqemYteS4reeahOWPmOaNouS7pSBTLT5SLT5UIOeahOmhuuW6j+W6lOeUqFxuICAgICAqICEjZW4gRXh0cmFjdGluZyByb3RhdGlvbmFsIGRpc3BsYWNlbWVudCwgem9vbSBpbmZvcm1hdGlvbiwgdGhlIGRlZmF1bHQgbWF0cml4IHRyYW5zZm9ybWF0aW9uIGluIG9yZGVyIFMtPiBSLT4gVCBhcHBsaWNhdGlvbnNcbiAgICAgKiBAbWV0aG9kIHRvUlRTXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiB0b1JUUzxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChtYXQ6IE91dCwgcTogUXVhdCwgdjogVmVjTGlrZSwgczogVmVjTGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRvUlRTPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG1hdDogT3V0LCBxOiBRdWF0LCB2OiBWZWNMaWtlLCBzOiBWZWNMaWtlKSB7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIGxldCBtMyA9IG0zXzEubTtcbiAgICAgICAgcy54ID0gVmVjMy5zZXQodjNfMSwgbVswXSwgbVsxXSwgbVsyXSkubWFnKCk7XG4gICAgICAgIG0zWzBdID0gbVswXSAvIHMueDtcbiAgICAgICAgbTNbMV0gPSBtWzFdIC8gcy54O1xuICAgICAgICBtM1syXSA9IG1bMl0gLyBzLng7XG4gICAgICAgIHMueSA9IFZlYzMuc2V0KHYzXzEsIG1bNF0sIG1bNV0sIG1bNl0pLm1hZygpO1xuICAgICAgICBtM1szXSA9IG1bNF0gLyBzLnk7XG4gICAgICAgIG0zWzRdID0gbVs1XSAvIHMueTtcbiAgICAgICAgbTNbNV0gPSBtWzZdIC8gcy55O1xuICAgICAgICBzLnogPSBWZWMzLnNldCh2M18xLCBtWzhdLCBtWzldLCBtWzEwXSkubWFnKCk7XG4gICAgICAgIG0zWzZdID0gbVs4XSAvIHMuejtcbiAgICAgICAgbTNbN10gPSBtWzldIC8gcy56O1xuICAgICAgICBtM1s4XSA9IG1bMTBdIC8gcy56O1xuICAgICAgICBjb25zdCBkZXQgPSBNYXQzLmRldGVybWluYW50KG0zXzEpO1xuICAgICAgICBpZiAoZGV0IDwgMCkgeyBzLnggKj0gLTE7IG0zWzBdICo9IC0xOyBtM1sxXSAqPSAtMTsgbTNbMl0gKj0gLTE7IH1cbiAgICAgICAgUXVhdC5mcm9tTWF0MyhxLCBtM18xKTsgLy8gYWxyZWFkeSBub3JtYWxpemVkXG4gICAgICAgIFZlYzMuc2V0KHYsIG1bMTJdLCBtWzEzXSwgbVsxNF0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5qC55o2u5peL6L2s44CB5L2N56e744CB57yp5pS+5L+h5oGv6K6h566X55+p6Zi177yM5LulIFMtPlItPlQg55qE6aG65bqP5bqU55SoXG4gICAgICogISNlbiBUaGUgcm90YXJ5IGRpc3BsYWNlbWVudCwgdGhlIHNjYWxpbmcgbWF0cml4IGNhbGN1bGF0aW9uIGluZm9ybWF0aW9uLCB0aGUgb3JkZXIgUy0+IFItPiBUIGFwcGxpY2F0aW9uc1xuICAgICAqIEBtZXRob2QgZnJvbVJUU1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZnJvbVJUUzxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgcTogUXVhdCwgdjogVmVjTGlrZSwgczogVmVjTGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21SVFM8T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UsIHM6IFZlY0xpa2UpIHtcbiAgICAgICAgY29uc3QgeCA9IHEueCwgeSA9IHEueSwgeiA9IHEueiwgdyA9IHEudztcbiAgICAgICAgY29uc3QgeDIgPSB4ICsgeDtcbiAgICAgICAgY29uc3QgeTIgPSB5ICsgeTtcbiAgICAgICAgY29uc3QgejIgPSB6ICsgejtcblxuICAgICAgICBjb25zdCB4eCA9IHggKiB4MjtcbiAgICAgICAgY29uc3QgeHkgPSB4ICogeTI7XG4gICAgICAgIGNvbnN0IHh6ID0geCAqIHoyO1xuICAgICAgICBjb25zdCB5eSA9IHkgKiB5MjtcbiAgICAgICAgY29uc3QgeXogPSB5ICogejI7XG4gICAgICAgIGNvbnN0IHp6ID0geiAqIHoyO1xuICAgICAgICBjb25zdCB3eCA9IHcgKiB4MjtcbiAgICAgICAgY29uc3Qgd3kgPSB3ICogeTI7XG4gICAgICAgIGNvbnN0IHd6ID0gdyAqIHoyO1xuICAgICAgICBjb25zdCBzeCA9IHMueDtcbiAgICAgICAgY29uc3Qgc3kgPSBzLnk7XG4gICAgICAgIGNvbnN0IHN6ID0gcy56O1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAoMSAtICh5eSArIHp6KSkgKiBzeDtcbiAgICAgICAgbVsxXSA9ICh4eSArIHd6KSAqIHN4O1xuICAgICAgICBtWzJdID0gKHh6IC0gd3kpICogc3g7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gKHh5IC0gd3opICogc3k7XG4gICAgICAgIG1bNV0gPSAoMSAtICh4eCArIHp6KSkgKiBzeTtcbiAgICAgICAgbVs2XSA9ICh5eiArIHd4KSAqIHN5O1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9ICh4eiArIHd5KSAqIHN6O1xuICAgICAgICBtWzldID0gKHl6IC0gd3gpICogc3o7XG4gICAgICAgIG1bMTBdID0gKDEgLSAoeHggKyB5eSkpICogc3o7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSB2Lng7XG4gICAgICAgIG1bMTNdID0gdi55O1xuICAgICAgICBtWzE0XSA9IHYuejtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmoLnmja7mjIflrprnmoTml4vovazjgIHkvY3np7vjgIHnvKnmlL7lj4rlj5jmjaLkuK3lv4Pkv6Hmga/orqHnrpfnn6npmLXvvIzku6UgUy0+Ui0+VCDnmoTpobrluo/lupTnlKhcbiAgICAgKiAhI2VuIEFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIHJvdGF0aW9uLCBkaXNwbGFjZW1lbnQsIGFuZCBzY2FsZSBjb252ZXJzaW9uIG1hdHJpeCBjYWxjdWxhdGlvbiBpbmZvcm1hdGlvbiBjZW50ZXIsIG9yZGVyIFMtPiBSLT4gVCBhcHBsaWNhdGlvbnNcbiAgICAgKiBAbWV0aG9kIGZyb21SVFNPcmlnaW5cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21SVFNPcmlnaW48T3V0IGV4dGVuZHMgSU1hdDRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQsIHY6IFZlY0xpa2UsIHM6IFZlY0xpa2UsIG86IFZlY0xpa2UpXG4gICAgICogQHBhcmFtIHEg5peL6L2s5YC8XG4gICAgICogQHBhcmFtIHYg5L2N56e75YC8XG4gICAgICogQHBhcmFtIHMg57yp5pS+5YC8XG4gICAgICogQHBhcmFtIG8g5oyH5a6a5Y+Y5o2i5Lit5b+DXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tUlRTT3JpZ2luPE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBxOiBRdWF0LCB2OiBWZWNMaWtlLCBzOiBWZWNMaWtlLCBvOiBWZWNMaWtlKSB7XG4gICAgICAgIGNvbnN0IHggPSBxLngsIHkgPSBxLnksIHogPSBxLnosIHcgPSBxLnc7XG4gICAgICAgIGNvbnN0IHgyID0geCArIHg7XG4gICAgICAgIGNvbnN0IHkyID0geSArIHk7XG4gICAgICAgIGNvbnN0IHoyID0geiArIHo7XG5cbiAgICAgICAgY29uc3QgeHggPSB4ICogeDI7XG4gICAgICAgIGNvbnN0IHh5ID0geCAqIHkyO1xuICAgICAgICBjb25zdCB4eiA9IHggKiB6MjtcbiAgICAgICAgY29uc3QgeXkgPSB5ICogeTI7XG4gICAgICAgIGNvbnN0IHl6ID0geSAqIHoyO1xuICAgICAgICBjb25zdCB6eiA9IHogKiB6MjtcbiAgICAgICAgY29uc3Qgd3ggPSB3ICogeDI7XG4gICAgICAgIGNvbnN0IHd5ID0gdyAqIHkyO1xuICAgICAgICBjb25zdCB3eiA9IHcgKiB6MjtcblxuICAgICAgICBjb25zdCBzeCA9IHMueDtcbiAgICAgICAgY29uc3Qgc3kgPSBzLnk7XG4gICAgICAgIGNvbnN0IHN6ID0gcy56O1xuXG4gICAgICAgIGNvbnN0IG94ID0gby54O1xuICAgICAgICBjb25zdCBveSA9IG8ueTtcbiAgICAgICAgY29uc3Qgb3ogPSBvLno7XG5cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9ICgxIC0gKHl5ICsgenopKSAqIHN4O1xuICAgICAgICBtWzFdID0gKHh5ICsgd3opICogc3g7XG4gICAgICAgIG1bMl0gPSAoeHogLSB3eSkgKiBzeDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSAoeHkgLSB3eikgKiBzeTtcbiAgICAgICAgbVs1XSA9ICgxIC0gKHh4ICsgenopKSAqIHN5O1xuICAgICAgICBtWzZdID0gKHl6ICsgd3gpICogc3k7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gKHh6ICsgd3kpICogc3o7XG4gICAgICAgIG1bOV0gPSAoeXogLSB3eCkgKiBzejtcbiAgICAgICAgbVsxMF0gPSAoMSAtICh4eCArIHl5KSkgKiBzejtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IHYueCArIG94IC0gKG1bMF0gKiBveCArIG1bNF0gKiBveSArIG1bOF0gKiBveik7XG4gICAgICAgIG1bMTNdID0gdi55ICsgb3kgLSAobVsxXSAqIG94ICsgbVs1XSAqIG95ICsgbVs5XSAqIG96KTtcbiAgICAgICAgbVsxNF0gPSB2LnogKyBveiAtIChtWzJdICogb3ggKyBtWzZdICogb3kgKyBtWzEwXSAqIG96KTtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmoLnmja7mjIflrprnmoTml4vovazkv6Hmga/orqHnrpfnn6npmLVcbiAgICAgKiAhI2VuIFRoZSByb3RhdGlvbiBtYXRyaXggY2FsY3VsYXRpb24gaW5mb3JtYXRpb24gc3BlY2lmaWVkXG4gICAgICogQG1ldGhvZCBmcm9tUXVhdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZnJvbVF1YXQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIHE6IFF1YXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tUXVhdDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgcTogUXVhdCkge1xuICAgICAgICBjb25zdCB4ID0gcS54LCB5ID0gcS55LCB6ID0gcS56LCB3ID0gcS53O1xuICAgICAgICBjb25zdCB4MiA9IHggKyB4O1xuICAgICAgICBjb25zdCB5MiA9IHkgKyB5O1xuICAgICAgICBjb25zdCB6MiA9IHogKyB6O1xuXG4gICAgICAgIGNvbnN0IHh4ID0geCAqIHgyO1xuICAgICAgICBjb25zdCB5eCA9IHkgKiB4MjtcbiAgICAgICAgY29uc3QgeXkgPSB5ICogeTI7XG4gICAgICAgIGNvbnN0IHp4ID0geiAqIHgyO1xuICAgICAgICBjb25zdCB6eSA9IHogKiB5MjtcbiAgICAgICAgY29uc3QgenogPSB6ICogejI7XG4gICAgICAgIGNvbnN0IHd4ID0gdyAqIHgyO1xuICAgICAgICBjb25zdCB3eSA9IHcgKiB5MjtcbiAgICAgICAgY29uc3Qgd3ogPSB3ICogejI7XG5cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IDEgLSB5eSAtIHp6O1xuICAgICAgICBtWzFdID0geXggKyB3ejtcbiAgICAgICAgbVsyXSA9IHp4IC0gd3k7XG4gICAgICAgIG1bM10gPSAwO1xuXG4gICAgICAgIG1bNF0gPSB5eCAtIHd6O1xuICAgICAgICBtWzVdID0gMSAtIHh4IC0geno7XG4gICAgICAgIG1bNl0gPSB6eSArIHd4O1xuICAgICAgICBtWzddID0gMDtcblxuICAgICAgICBtWzhdID0genggKyB3eTtcbiAgICAgICAgbVs5XSA9IHp5IC0gd3g7XG4gICAgICAgIG1bMTBdID0gMSAtIHh4IC0geXk7XG4gICAgICAgIG1bMTFdID0gMDtcblxuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAwO1xuICAgICAgICBtWzE1XSA9IDE7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOagueaNruaMh+WumueahOinhumUpeS9k+S/oeaBr+iuoeeul+efqemYtVxuICAgICAqICEjZW4gVGhlIG1hdHJpeCBjYWxjdWxhdGlvbiBpbmZvcm1hdGlvbiBzcGVjaWZpZWQgZnJ1c3R1bVxuICAgICAqIEBtZXRob2QgZnJ1c3R1bVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZnJ1c3R1bTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgbGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpXG4gICAgICogQHBhcmFtIGxlZnQg5bem5bmz6Z2i6Led56a7XG4gICAgICogQHBhcmFtIHJpZ2h0IOWPs+W5s+mdoui3neemu1xuICAgICAqIEBwYXJhbSBib3R0b20g5LiL5bmz6Z2i6Led56a7XG4gICAgICogQHBhcmFtIHRvcCDkuIrlubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gbmVhciDov5HlubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gZmFyIOi/nOW5s+mdoui3neemu1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJ1c3R1bTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgbGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgcmwgPSAxIC8gKHJpZ2h0IC0gbGVmdCk7XG4gICAgICAgIGNvbnN0IHRiID0gMSAvICh0b3AgLSBib3R0b20pO1xuICAgICAgICBjb25zdCBuZiA9IDEgLyAobmVhciAtIGZhcik7XG5cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IChuZWFyICogMikgKiBybDtcbiAgICAgICAgbVsxXSA9IDA7XG4gICAgICAgIG1bMl0gPSAwO1xuICAgICAgICBtWzNdID0gMDtcbiAgICAgICAgbVs0XSA9IDA7XG4gICAgICAgIG1bNV0gPSAobmVhciAqIDIpICogdGI7XG4gICAgICAgIG1bNl0gPSAwO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IChyaWdodCArIGxlZnQpICogcmw7XG4gICAgICAgIG1bOV0gPSAodG9wICsgYm90dG9tKSAqIHRiO1xuICAgICAgICBtWzEwXSA9IChmYXIgKyBuZWFyKSAqIG5mO1xuICAgICAgICBtWzExXSA9IC0xO1xuICAgICAgICBtWzEyXSA9IDA7XG4gICAgICAgIG1bMTNdID0gMDtcbiAgICAgICAgbVsxNF0gPSAoZmFyICogbmVhciAqIDIpICogbmY7XG4gICAgICAgIG1bMTVdID0gMDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuoeeul+mAj+inhuaKleW9seefqemYtVxuICAgICAqICEjZW4gUGVyc3BlY3RpdmUgcHJvamVjdGlvbiBtYXRyaXggY2FsY3VsYXRpb25cbiAgICAgKiBAbWV0aG9kIHBlcnNwZWN0aXZlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBwZXJzcGVjdGl2ZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgZm92eTogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcilcbiAgICAgKiBAcGFyYW0gZm92eSDnurXlkJHop4bop5Lpq5jluqZcbiAgICAgKiBAcGFyYW0gYXNwZWN0IOmVv+WuveavlFxuICAgICAqIEBwYXJhbSBuZWFyIOi/keW5s+mdoui3neemu1xuICAgICAqIEBwYXJhbSBmYXIg6L+c5bmz6Z2i6Led56a7XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBwZXJzcGVjdGl2ZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgZm92eTogbnVtYmVyLCBhc3BlY3Q6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcikge1xuICAgICAgICBjb25zdCBmID0gMS4wIC8gTWF0aC50YW4oZm92eSAvIDIpO1xuICAgICAgICBjb25zdCBuZiA9IDEgLyAobmVhciAtIGZhcik7XG5cbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgbVswXSA9IGYgLyBhc3BlY3Q7XG4gICAgICAgIG1bMV0gPSAwO1xuICAgICAgICBtWzJdID0gMDtcbiAgICAgICAgbVszXSA9IDA7XG4gICAgICAgIG1bNF0gPSAwO1xuICAgICAgICBtWzVdID0gZjtcbiAgICAgICAgbVs2XSA9IDA7XG4gICAgICAgIG1bN10gPSAwO1xuICAgICAgICBtWzhdID0gMDtcbiAgICAgICAgbVs5XSA9IDA7XG4gICAgICAgIG1bMTBdID0gKGZhciArIG5lYXIpICogbmY7XG4gICAgICAgIG1bMTFdID0gLTE7XG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9ICgyICogZmFyICogbmVhcikgKiBuZjtcbiAgICAgICAgbVsxNV0gPSAwO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6K6h566X5q2j5Lqk5oqV5b2x55+p6Zi1XG4gICAgICogISNlbiBDb21wdXRpbmcgb3J0aG9nb25hbCBwcm9qZWN0aW9uIG1hdHJpeFxuICAgICAqIEBtZXRob2Qgb3J0aG9cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG9ydGhvPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBsZWZ0OiBudW1iZXIsIHJpZ2h0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyLCB0b3A6IG51bWJlciwgbmVhcjogbnVtYmVyLCBmYXI6IG51bWJlcilcbiAgICAgKiBAcGFyYW0gbGVmdCDlt6blubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gcmlnaHQg5Y+z5bmz6Z2i6Led56a7XG4gICAgICogQHBhcmFtIGJvdHRvbSDkuIvlubPpnaLot53nprtcbiAgICAgKiBAcGFyYW0gdG9wIOS4iuW5s+mdoui3neemu1xuICAgICAqIEBwYXJhbSBuZWFyIOi/keW5s+mdoui3neemu1xuICAgICAqIEBwYXJhbSBmYXIg6L+c5bmz6Z2i6Led56a7XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBvcnRobzxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgbGVmdDogbnVtYmVyLCByaWdodDogbnVtYmVyLCBib3R0b206IG51bWJlciwgdG9wOiBudW1iZXIsIG5lYXI6IG51bWJlciwgZmFyOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbHIgPSAxIC8gKGxlZnQgLSByaWdodCk7XG4gICAgICAgIGNvbnN0IGJ0ID0gMSAvIChib3R0b20gLSB0b3ApO1xuICAgICAgICBjb25zdCBuZiA9IDEgLyAobmVhciAtIGZhcik7XG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAtMiAqIGxyO1xuICAgICAgICBtWzFdID0gMDtcbiAgICAgICAgbVsyXSA9IDA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gMDtcbiAgICAgICAgbVs1XSA9IC0yICogYnQ7XG4gICAgICAgIG1bNl0gPSAwO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IDA7XG4gICAgICAgIG1bOV0gPSAwO1xuICAgICAgICBtWzEwXSA9IDIgKiBuZjtcbiAgICAgICAgbVsxMV0gPSAwO1xuICAgICAgICBtWzEyXSA9IChsZWZ0ICsgcmlnaHQpICogbHI7XG4gICAgICAgIG1bMTNdID0gKHRvcCArIGJvdHRvbSkgKiBidDtcbiAgICAgICAgbVsxNF0gPSAoZmFyICsgbmVhcikgKiBuZjtcbiAgICAgICAgbVsxNV0gPSAxO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5qC55o2u6KeG54K56K6h566X55+p6Zi177yM5rOo5oSPIGBleWUgLSBjZW50ZXJgIOS4jeiDveS4uumbtuWQkemHj+aIluS4jiBgdXBgIOWQkemHj+W5s+ihjFxuICAgICAqICEjZW4gYFVwYCBwYXJhbGxlbCB2ZWN0b3Igb3IgdmVjdG9yIGNlbnRlcmAgbm90IGJlIHplcm8gLSB0aGUgbWF0cml4IGNhbGN1bGF0aW9uIGFjY29yZGluZyB0byB0aGUgdmlld3BvaW50LCBub3RlYCBleWVcbiAgICAgKiBAbWV0aG9kIGxvb2tBdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbG9va0F0PE91dCBleHRlbmRzIElNYXQ0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBleWU6IFZlY0xpa2UsIGNlbnRlcjogVmVjTGlrZSwgdXA6IFZlY0xpa2UpXG4gICAgICogQHBhcmFtIGV5ZSDlvZPliY3kvY3nva5cbiAgICAgKiBAcGFyYW0gY2VudGVyIOebruagh+inhueCuVxuICAgICAqIEBwYXJhbSB1cCDop4blj6PkuIrmlrnlkJFcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGxvb2tBdDxPdXQgZXh0ZW5kcyBJTWF0NExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgZXllOiBWZWNMaWtlLCBjZW50ZXI6IFZlY0xpa2UsIHVwOiBWZWNMaWtlKSB7XG4gICAgICAgIGNvbnN0IGV5ZXggPSBleWUueDtcbiAgICAgICAgY29uc3QgZXlleSA9IGV5ZS55O1xuICAgICAgICBjb25zdCBleWV6ID0gZXllLno7XG4gICAgICAgIGNvbnN0IHVweCA9IHVwLng7XG4gICAgICAgIGNvbnN0IHVweSA9IHVwLnk7XG4gICAgICAgIGNvbnN0IHVweiA9IHVwLno7XG4gICAgICAgIGNvbnN0IGNlbnRlcnggPSBjZW50ZXIueDtcbiAgICAgICAgY29uc3QgY2VudGVyeSA9IGNlbnRlci55O1xuICAgICAgICBjb25zdCBjZW50ZXJ6ID0gY2VudGVyLno7XG5cbiAgICAgICAgbGV0IHowID0gZXlleCAtIGNlbnRlcng7XG4gICAgICAgIGxldCB6MSA9IGV5ZXkgLSBjZW50ZXJ5O1xuICAgICAgICBsZXQgejIgPSBleWV6IC0gY2VudGVyejtcblxuICAgICAgICBsZXQgbGVuID0gMSAvIE1hdGguc3FydCh6MCAqIHowICsgejEgKiB6MSArIHoyICogejIpO1xuICAgICAgICB6MCAqPSBsZW47XG4gICAgICAgIHoxICo9IGxlbjtcbiAgICAgICAgejIgKj0gbGVuO1xuXG4gICAgICAgIGxldCB4MCA9IHVweSAqIHoyIC0gdXB6ICogejE7XG4gICAgICAgIGxldCB4MSA9IHVweiAqIHowIC0gdXB4ICogejI7XG4gICAgICAgIGxldCB4MiA9IHVweCAqIHoxIC0gdXB5ICogejA7XG4gICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQoeDAgKiB4MCArIHgxICogeDEgKyB4MiAqIHgyKTtcbiAgICAgICAgeDAgKj0gbGVuO1xuICAgICAgICB4MSAqPSBsZW47XG4gICAgICAgIHgyICo9IGxlbjtcblxuICAgICAgICBjb25zdCB5MCA9IHoxICogeDIgLSB6MiAqIHgxO1xuICAgICAgICBjb25zdCB5MSA9IHoyICogeDAgLSB6MCAqIHgyO1xuICAgICAgICBjb25zdCB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSB4MDtcbiAgICAgICAgbVsxXSA9IHkwO1xuICAgICAgICBtWzJdID0gejA7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0geDE7XG4gICAgICAgIG1bNV0gPSB5MTtcbiAgICAgICAgbVs2XSA9IHoxO1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9IHgyO1xuICAgICAgICBtWzldID0geTI7XG4gICAgICAgIG1bMTBdID0gejI7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSAtKHgwICogZXlleCArIHgxICogZXlleSArIHgyICogZXlleik7XG4gICAgICAgIG1bMTNdID0gLSh5MCAqIGV5ZXggKyB5MSAqIGV5ZXkgKyB5MiAqIGV5ZXopO1xuICAgICAgICBtWzE0XSA9IC0oejAgKiBleWV4ICsgejEgKiBleWV5ICsgejIgKiBleWV6KTtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorqHnrpfpgIbovaznva7nn6npmLVcbiAgICAgKiAhI2VuIFJldmVyc2FsIG1hdHJpeCBjYWxjdWxhdGlvblxuICAgICAqIEBtZXRob2QgaW52ZXJzZVRyYW5zcG9zZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogaW52ZXJzZVRyYW5zcG9zZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgaW52ZXJzZVRyYW5zcG9zZTxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0KSB7XG5cbiAgICAgICAgbGV0IG0gPSBhLm07XG4gICAgICAgIF9hMDAgPSBtWzBdOyBfYTAxID0gbVsxXTsgX2EwMiA9IG1bMl07IF9hMDMgPSBtWzNdO1xuICAgICAgICBfYTEwID0gbVs0XTsgX2ExMSA9IG1bNV07IF9hMTIgPSBtWzZdOyBfYTEzID0gbVs3XTtcbiAgICAgICAgX2EyMCA9IG1bOF07IF9hMjEgPSBtWzldOyBfYTIyID0gbVsxMF07IF9hMjMgPSBtWzExXTtcbiAgICAgICAgX2EzMCA9IG1bMTJdOyBfYTMxID0gbVsxM107IF9hMzIgPSBtWzE0XTsgX2EzMyA9IG1bMTVdO1xuXG4gICAgICAgIGNvbnN0IGIwMCA9IF9hMDAgKiBfYTExIC0gX2EwMSAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMSA9IF9hMDAgKiBfYTEyIC0gX2EwMiAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMiA9IF9hMDAgKiBfYTEzIC0gX2EwMyAqIF9hMTA7XG4gICAgICAgIGNvbnN0IGIwMyA9IF9hMDEgKiBfYTEyIC0gX2EwMiAqIF9hMTE7XG4gICAgICAgIGNvbnN0IGIwNCA9IF9hMDEgKiBfYTEzIC0gX2EwMyAqIF9hMTE7XG4gICAgICAgIGNvbnN0IGIwNSA9IF9hMDIgKiBfYTEzIC0gX2EwMyAqIF9hMTI7XG4gICAgICAgIGNvbnN0IGIwNiA9IF9hMjAgKiBfYTMxIC0gX2EyMSAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwNyA9IF9hMjAgKiBfYTMyIC0gX2EyMiAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwOCA9IF9hMjAgKiBfYTMzIC0gX2EyMyAqIF9hMzA7XG4gICAgICAgIGNvbnN0IGIwOSA9IF9hMjEgKiBfYTMyIC0gX2EyMiAqIF9hMzE7XG4gICAgICAgIGNvbnN0IGIxMCA9IF9hMjEgKiBfYTMzIC0gX2EyMyAqIF9hMzE7XG4gICAgICAgIGNvbnN0IGIxMSA9IF9hMjIgKiBfYTMzIC0gX2EyMyAqIF9hMzI7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgICAgICBsZXQgZGV0ID0gYjAwICogYjExIC0gYjAxICogYjEwICsgYjAyICogYjA5ICsgYjAzICogYjA4IC0gYjA0ICogYjA3ICsgYjA1ICogYjA2O1xuXG4gICAgICAgIGlmICghZGV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBkZXQgPSAxLjAgLyBkZXQ7XG5cbiAgICAgICAgbSA9IG91dC5tO1xuICAgICAgICBtWzBdID0gKF9hMTEgKiBiMTEgLSBfYTEyICogYjEwICsgX2ExMyAqIGIwOSkgKiBkZXQ7XG4gICAgICAgIG1bMV0gPSAoX2ExMiAqIGIwOCAtIF9hMTAgKiBiMTEgLSBfYTEzICogYjA3KSAqIGRldDtcbiAgICAgICAgbVsyXSA9IChfYTEwICogYjEwIC0gX2ExMSAqIGIwOCArIF9hMTMgKiBiMDYpICogZGV0O1xuICAgICAgICBtWzNdID0gMDtcblxuICAgICAgICBtWzRdID0gKF9hMDIgKiBiMTAgLSBfYTAxICogYjExIC0gX2EwMyAqIGIwOSkgKiBkZXQ7XG4gICAgICAgIG1bNV0gPSAoX2EwMCAqIGIxMSAtIF9hMDIgKiBiMDggKyBfYTAzICogYjA3KSAqIGRldDtcbiAgICAgICAgbVs2XSA9IChfYTAxICogYjA4IC0gX2EwMCAqIGIxMCAtIF9hMDMgKiBiMDYpICogZGV0O1xuICAgICAgICBtWzddID0gMDtcblxuICAgICAgICBtWzhdID0gKF9hMzEgKiBiMDUgLSBfYTMyICogYjA0ICsgX2EzMyAqIGIwMykgKiBkZXQ7XG4gICAgICAgIG1bOV0gPSAoX2EzMiAqIGIwMiAtIF9hMzAgKiBiMDUgLSBfYTMzICogYjAxKSAqIGRldDtcbiAgICAgICAgbVsxMF0gPSAoX2EzMCAqIGIwNCAtIF9hMzEgKiBiMDIgKyBfYTMzICogYjAwKSAqIGRldDtcbiAgICAgICAgbVsxMV0gPSAwO1xuXG4gICAgICAgIG1bMTJdID0gMDtcbiAgICAgICAgbVsxM10gPSAwO1xuICAgICAgICBtWzE0XSA9IDA7XG4gICAgICAgIG1bMTVdID0gMTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6YCQ5YWD57Sg55+p6Zi15Yqg5rOVXG4gICAgICogISNlbiBFbGVtZW50IGJ5IGVsZW1lbnQgbWF0cml4IGFkZGl0aW9uXG4gICAgICogQG1ldGhvZCBhZGRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGFkZDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBhZGQ8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIGxldCBtID0gb3V0Lm0sIGFtID0gYS5tLCBibSA9IGIubTtcbiAgICAgICAgbVswXSA9IGFtWzBdICsgYm1bMF07XG4gICAgICAgIG1bMV0gPSBhbVsxXSArIGJtWzFdO1xuICAgICAgICBtWzJdID0gYW1bMl0gKyBibVsyXTtcbiAgICAgICAgbVszXSA9IGFtWzNdICsgYm1bM107XG4gICAgICAgIG1bNF0gPSBhbVs0XSArIGJtWzRdO1xuICAgICAgICBtWzVdID0gYW1bNV0gKyBibVs1XTtcbiAgICAgICAgbVs2XSA9IGFtWzZdICsgYm1bNl07XG4gICAgICAgIG1bN10gPSBhbVs3XSArIGJtWzddO1xuICAgICAgICBtWzhdID0gYW1bOF0gKyBibVs4XTtcbiAgICAgICAgbVs5XSA9IGFtWzldICsgYm1bOV07XG4gICAgICAgIG1bMTBdID0gYW1bMTBdICsgYm1bMTBdO1xuICAgICAgICBtWzExXSA9IGFtWzExXSArIGJtWzExXTtcbiAgICAgICAgbVsxMl0gPSBhbVsxMl0gKyBibVsxMl07XG4gICAgICAgIG1bMTNdID0gYW1bMTNdICsgYm1bMTNdO1xuICAgICAgICBtWzE0XSA9IGFtWzE0XSArIGJtWzE0XTtcbiAgICAgICAgbVsxNV0gPSBhbVsxNV0gKyBibVsxNV07XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDnn6npmLXlh4/ms5VcbiAgICAgKiAhI2VuIE1hdHJpeCBlbGVtZW50IGJ5IGVsZW1lbnQgc3VidHJhY3Rpb25cbiAgICAgKiBAbWV0aG9kIHN1YnRyYWN0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzdWJ0cmFjdDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzdWJ0cmFjdDxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQpIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubSwgYW0gPSBhLm0sIGJtID0gYi5tO1xuICAgICAgICBtWzBdID0gYW1bMF0gLSBibVswXTtcbiAgICAgICAgbVsxXSA9IGFtWzFdIC0gYm1bMV07XG4gICAgICAgIG1bMl0gPSBhbVsyXSAtIGJtWzJdO1xuICAgICAgICBtWzNdID0gYW1bM10gLSBibVszXTtcbiAgICAgICAgbVs0XSA9IGFtWzRdIC0gYm1bNF07XG4gICAgICAgIG1bNV0gPSBhbVs1XSAtIGJtWzVdO1xuICAgICAgICBtWzZdID0gYW1bNl0gLSBibVs2XTtcbiAgICAgICAgbVs3XSA9IGFtWzddIC0gYm1bN107XG4gICAgICAgIG1bOF0gPSBhbVs4XSAtIGJtWzhdO1xuICAgICAgICBtWzldID0gYW1bOV0gLSBibVs5XTtcbiAgICAgICAgbVsxMF0gPSBhbVsxMF0gLSBibVsxMF07XG4gICAgICAgIG1bMTFdID0gYW1bMTFdIC0gYm1bMTFdO1xuICAgICAgICBtWzEyXSA9IGFtWzEyXSAtIGJtWzEyXTtcbiAgICAgICAgbVsxM10gPSBhbVsxM10gLSBibVsxM107XG4gICAgICAgIG1bMTRdID0gYW1bMTRdIC0gYm1bMTRdO1xuICAgICAgICBtWzE1XSA9IGFtWzE1XSAtIGJtWzE1XTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOefqemYteagh+mHj+S5mOazlVxuICAgICAqICEjZW4gTWF0cml4IHNjYWxhciBtdWx0aXBsaWNhdGlvblxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlTY2FsYXJcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG11bHRpcGx5U2NhbGFyPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5U2NhbGFyPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcikge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubTtcbiAgICAgICAgbVswXSA9IGFtWzBdICogYjtcbiAgICAgICAgbVsxXSA9IGFtWzFdICogYjtcbiAgICAgICAgbVsyXSA9IGFtWzJdICogYjtcbiAgICAgICAgbVszXSA9IGFtWzNdICogYjtcbiAgICAgICAgbVs0XSA9IGFtWzRdICogYjtcbiAgICAgICAgbVs1XSA9IGFtWzVdICogYjtcbiAgICAgICAgbVs2XSA9IGFtWzZdICogYjtcbiAgICAgICAgbVs3XSA9IGFtWzddICogYjtcbiAgICAgICAgbVs4XSA9IGFtWzhdICogYjtcbiAgICAgICAgbVs5XSA9IGFtWzldICogYjtcbiAgICAgICAgbVsxMF0gPSBhbVsxMF0gKiBiO1xuICAgICAgICBtWzExXSA9IGFtWzExXSAqIGI7XG4gICAgICAgIG1bMTJdID0gYW1bMTJdICogYjtcbiAgICAgICAgbVsxM10gPSBhbVsxM10gKiBiO1xuICAgICAgICBtWzE0XSA9IGFtWzE0XSAqIGI7XG4gICAgICAgIG1bMTVdID0gYW1bMTVdICogYjtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOmAkOWFg+e0oOefqemYteagh+mHj+S5mOWKoDogQSArIEIgKiBzY2FsZVxuICAgICAqICEjZW4gRWxlbWVudHMgb2YgdGhlIG1hdHJpeCBieSB0aGUgc2NhbGFyIG11bHRpcGxpY2F0aW9uIGFuZCBhZGRpdGlvbjogQSArIEIgKiBzY2FsZVxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlTY2FsYXJBbmRBZGRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG11bHRpcGx5U2NhbGFyQW5kQWRkPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgc2NhbGU6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5U2NhbGFyQW5kQWRkPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgc2NhbGU6IG51bWJlcikge1xuICAgICAgICBsZXQgbSA9IG91dC5tLCBhbSA9IGEubSwgYm0gPSBiLm07XG4gICAgICAgIG1bMF0gPSBhbVswXSArIChibVswXSAqIHNjYWxlKTtcbiAgICAgICAgbVsxXSA9IGFtWzFdICsgKGJtWzFdICogc2NhbGUpO1xuICAgICAgICBtWzJdID0gYW1bMl0gKyAoYm1bMl0gKiBzY2FsZSk7XG4gICAgICAgIG1bM10gPSBhbVszXSArIChibVszXSAqIHNjYWxlKTtcbiAgICAgICAgbVs0XSA9IGFtWzRdICsgKGJtWzRdICogc2NhbGUpO1xuICAgICAgICBtWzVdID0gYW1bNV0gKyAoYm1bNV0gKiBzY2FsZSk7XG4gICAgICAgIG1bNl0gPSBhbVs2XSArIChibVs2XSAqIHNjYWxlKTtcbiAgICAgICAgbVs3XSA9IGFtWzddICsgKGJtWzddICogc2NhbGUpO1xuICAgICAgICBtWzhdID0gYW1bOF0gKyAoYm1bOF0gKiBzY2FsZSk7XG4gICAgICAgIG1bOV0gPSBhbVs5XSArIChibVs5XSAqIHNjYWxlKTtcbiAgICAgICAgbVsxMF0gPSBhbVsxMF0gKyAoYm1bMTBdICogc2NhbGUpO1xuICAgICAgICBtWzExXSA9IGFtWzExXSArIChibVsxMV0gKiBzY2FsZSk7XG4gICAgICAgIG1bMTJdID0gYW1bMTJdICsgKGJtWzEyXSAqIHNjYWxlKTtcbiAgICAgICAgbVsxM10gPSBhbVsxM10gKyAoYm1bMTNdICogc2NhbGUpO1xuICAgICAgICBtWzE0XSA9IGFtWzE0XSArIChibVsxNF0gKiBzY2FsZSk7XG4gICAgICAgIG1bMTVdID0gYW1bMTVdICsgKGJtWzE1XSAqIHNjYWxlKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOefqemYteetieS7t+WIpOaWrVxuICAgICAqICEjZW4gQW5hbHl6aW5nIHRoZSBlcXVpdmFsZW50IG1hdHJpeFxuICAgICAqIEBtZXRob2Qgc3RyaWN0RXF1YWxzXG4gICAgICogQHJldHVybiB7Ym9vbH1cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHN0cmljdEVxdWFsczxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQsIGI6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHN0cmljdEVxdWFsczxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQsIGI6IE91dCkge1xuICAgICAgICBsZXQgYW0gPSBhLm0sIGJtID0gYi5tO1xuICAgICAgICByZXR1cm4gYW1bMF0gPT09IGJtWzBdICYmIGFtWzFdID09PSBibVsxXSAmJiBhbVsyXSA9PT0gYm1bMl0gJiYgYW1bM10gPT09IGJtWzNdICYmXG4gICAgICAgICAgICBhbVs0XSA9PT0gYm1bNF0gJiYgYW1bNV0gPT09IGJtWzVdICYmIGFtWzZdID09PSBibVs2XSAmJiBhbVs3XSA9PT0gYm1bN10gJiZcbiAgICAgICAgICAgIGFtWzhdID09PSBibVs4XSAmJiBhbVs5XSA9PT0gYm1bOV0gJiYgYW1bMTBdID09PSBibVsxMF0gJiYgYW1bMTFdID09PSBibVsxMV0gJiZcbiAgICAgICAgICAgIGFtWzEyXSA9PT0gYm1bMTJdICYmIGFtWzEzXSA9PT0gYm1bMTNdICYmIGFtWzE0XSA9PT0gYm1bMTRdICYmIGFtWzE1XSA9PT0gYm1bMTVdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5o6S6Zmk5rWu54K55pWw6K+v5beu55qE55+p6Zi16L+R5Ly8562J5Lu35Yik5patXG4gICAgICogISNlbiBOZWdhdGl2ZSBmbG9hdGluZyBwb2ludCBlcnJvciBpcyBhcHByb3hpbWF0ZWx5IGVxdWl2YWxlbnQgdG8gZGV0ZXJtaW5pbmcgYSBtYXRyaXhcbiAgICAgKiBAbWV0aG9kIGVxdWFsc1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZXF1YWxzPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKGE6IE91dCwgYjogT3V0LCBlcHNpbG9uID0gRVBTSUxPTilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGVxdWFsczxPdXQgZXh0ZW5kcyBJTWF0NExpa2U+IChhOiBPdXQsIGI6IE91dCwgZXBzaWxvbiA9IEVQU0lMT04pIHtcblxuICAgICAgICBsZXQgYW0gPSBhLm0sIGJtID0gYi5tO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bMF0gLSBibVswXSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYW1bMF0pLCBNYXRoLmFicyhibVswXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxXSAtIGJtWzFdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVsxXSksIE1hdGguYWJzKGJtWzFdKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFtWzJdIC0gYm1bMl0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzJdKSwgTWF0aC5hYnMoYm1bMl0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bM10gLSBibVszXSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYW1bM10pLCBNYXRoLmFicyhibVszXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVs0XSAtIGJtWzRdKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVs0XSksIE1hdGguYWJzKGJtWzRdKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFtWzVdIC0gYm1bNV0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzVdKSwgTWF0aC5hYnMoYm1bNV0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bNl0gLSBibVs2XSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYW1bNl0pLCBNYXRoLmFicyhibVs2XSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVs3XSAtIGJtWzddKSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhbVs3XSksIE1hdGguYWJzKGJtWzddKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGFtWzhdIC0gYm1bOF0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzhdKSwgTWF0aC5hYnMoYm1bOF0pKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYW1bOV0gLSBibVs5XSkgPD0gZXBzaWxvbiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYW1bOV0pLCBNYXRoLmFicyhibVs5XSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxMF0gLSBibVsxMF0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzEwXSksIE1hdGguYWJzKGJtWzEwXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxMV0gLSBibVsxMV0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzExXSksIE1hdGguYWJzKGJtWzExXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxMl0gLSBibVsxMl0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzEyXSksIE1hdGguYWJzKGJtWzEyXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxM10gLSBibVsxM10pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzEzXSksIE1hdGguYWJzKGJtWzEzXSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxNF0gLSBibVsxNF0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzE0XSksIE1hdGguYWJzKGJtWzE0XSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhbVsxNV0gLSBibVsxNV0pIDw9IGVwc2lsb24gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGFtWzE1XSksIE1hdGguYWJzKGJtWzE1XSkpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgYWRqdWdhdGUgb2YgYSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDR9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQ0fSBhIC0gTWF0cml4IHRvIGNhbGN1bGF0ZS5cbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0LlxuICAgICAqL1xuICAgIHN0YXRpYyBhZGpvaW50IChvdXQsIGEpIHtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBvdXRtID0gb3V0Lm07XG4gICAgICAgIGxldCBhMDAgPSBhbVswXSwgYTAxID0gYW1bMV0sIGEwMiA9IGFtWzJdLCBhMDMgPSBhbVszXSxcbiAgICAgICAgICAgIGExMCA9IGFtWzRdLCBhMTEgPSBhbVs1XSwgYTEyID0gYW1bNl0sIGExMyA9IGFtWzddLFxuICAgICAgICAgICAgYTIwID0gYW1bOF0sIGEyMSA9IGFtWzldLCBhMjIgPSBhbVsxMF0sIGEyMyA9IGFtWzExXSxcbiAgICAgICAgICAgIGEzMCA9IGFtWzEyXSwgYTMxID0gYW1bMTNdLCBhMzIgPSBhbVsxNF0sIGEzMyA9IGFtWzE1XTtcblxuICAgICAgICBvdXRtWzBdID0gKGExMSAqIChhMjIgKiBhMzMgLSBhMjMgKiBhMzIpIC0gYTIxICogKGExMiAqIGEzMyAtIGExMyAqIGEzMikgKyBhMzEgKiAoYTEyICogYTIzIC0gYTEzICogYTIyKSk7XG4gICAgICAgIG91dG1bMV0gPSAtKGEwMSAqIChhMjIgKiBhMzMgLSBhMjMgKiBhMzIpIC0gYTIxICogKGEwMiAqIGEzMyAtIGEwMyAqIGEzMikgKyBhMzEgKiAoYTAyICogYTIzIC0gYTAzICogYTIyKSk7XG4gICAgICAgIG91dG1bMl0gPSAoYTAxICogKGExMiAqIGEzMyAtIGExMyAqIGEzMikgLSBhMTEgKiAoYTAyICogYTMzIC0gYTAzICogYTMyKSArIGEzMSAqIChhMDIgKiBhMTMgLSBhMDMgKiBhMTIpKTtcbiAgICAgICAgb3V0bVszXSA9IC0oYTAxICogKGExMiAqIGEyMyAtIGExMyAqIGEyMikgLSBhMTEgKiAoYTAyICogYTIzIC0gYTAzICogYTIyKSArIGEyMSAqIChhMDIgKiBhMTMgLSBhMDMgKiBhMTIpKTtcbiAgICAgICAgb3V0bVs0XSA9IC0oYTEwICogKGEyMiAqIGEzMyAtIGEyMyAqIGEzMikgLSBhMjAgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSArIGEzMCAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpKTtcbiAgICAgICAgb3V0bVs1XSA9IChhMDAgKiAoYTIyICogYTMzIC0gYTIzICogYTMyKSAtIGEyMCAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMwICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikpO1xuICAgICAgICBvdXRtWzZdID0gLShhMDAgKiAoYTEyICogYTMzIC0gYTEzICogYTMyKSAtIGExMCAqIChhMDIgKiBhMzMgLSBhMDMgKiBhMzIpICsgYTMwICogKGEwMiAqIGExMyAtIGEwMyAqIGExMikpO1xuICAgICAgICBvdXRtWzddID0gKGEwMCAqIChhMTIgKiBhMjMgLSBhMTMgKiBhMjIpIC0gYTEwICogKGEwMiAqIGEyMyAtIGEwMyAqIGEyMikgKyBhMjAgKiAoYTAyICogYTEzIC0gYTAzICogYTEyKSk7XG4gICAgICAgIG91dG1bOF0gPSAoYTEwICogKGEyMSAqIGEzMyAtIGEyMyAqIGEzMSkgLSBhMjAgKiAoYTExICogYTMzIC0gYTEzICogYTMxKSArIGEzMCAqIChhMTEgKiBhMjMgLSBhMTMgKiBhMjEpKTtcbiAgICAgICAgb3V0bVs5XSA9IC0oYTAwICogKGEyMSAqIGEzMyAtIGEyMyAqIGEzMSkgLSBhMjAgKiAoYTAxICogYTMzIC0gYTAzICogYTMxKSArIGEzMCAqIChhMDEgKiBhMjMgLSBhMDMgKiBhMjEpKTtcbiAgICAgICAgb3V0bVsxMF0gPSAoYTAwICogKGExMSAqIGEzMyAtIGExMyAqIGEzMSkgLSBhMTAgKiAoYTAxICogYTMzIC0gYTAzICogYTMxKSArIGEzMCAqIChhMDEgKiBhMTMgLSBhMDMgKiBhMTEpKTtcbiAgICAgICAgb3V0bVsxMV0gPSAtKGEwMCAqIChhMTEgKiBhMjMgLSBhMTMgKiBhMjEpIC0gYTEwICogKGEwMSAqIGEyMyAtIGEwMyAqIGEyMSkgKyBhMjAgKiAoYTAxICogYTEzIC0gYTAzICogYTExKSk7XG4gICAgICAgIG91dG1bMTJdID0gLShhMTAgKiAoYTIxICogYTMyIC0gYTIyICogYTMxKSAtIGEyMCAqIChhMTEgKiBhMzIgLSBhMTIgKiBhMzEpICsgYTMwICogKGExMSAqIGEyMiAtIGExMiAqIGEyMSkpO1xuICAgICAgICBvdXRtWzEzXSA9IChhMDAgKiAoYTIxICogYTMyIC0gYTIyICogYTMxKSAtIGEyMCAqIChhMDEgKiBhMzIgLSBhMDIgKiBhMzEpICsgYTMwICogKGEwMSAqIGEyMiAtIGEwMiAqIGEyMSkpO1xuICAgICAgICBvdXRtWzE0XSA9IC0oYTAwICogKGExMSAqIGEzMiAtIGExMiAqIGEzMSkgLSBhMTAgKiAoYTAxICogYTMyIC0gYTAyICogYTMxKSArIGEzMCAqIChhMDEgKiBhMTIgLSBhMDIgKiBhMTEpKTtcbiAgICAgICAgb3V0bVsxNV0gPSAoYTAwICogKGExMSAqIGEyMiAtIGExMiAqIGEyMSkgLSBhMTAgKiAoYTAxICogYTIyIC0gYTAyICogYTIxKSArIGEyMCAqIChhMDEgKiBhMTIgLSBhMDIgKiBhMTEpKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOefqemYtei9rOaVsOe7hFxuICAgICAqICEjZW4gTWF0cml4IHRyYW5zcG9zZSBhcnJheVxuICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdG9BcnJheSA8T3V0IGV4dGVuZHMgSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4+IChvdXQ6IE91dCwgbWF0OiBJTWF0NExpa2UsIG9mcyA9IDApXG4gICAgICogQHBhcmFtIG9mcyDmlbDnu4TlhoXnmoTotbflp4vlgY/np7vph49cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRvQXJyYXk8T3V0IGV4dGVuZHMgSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4+IChvdXQ6IE91dCwgbWF0OiBJTWF0NExpa2UsIG9mcyA9IDApIHtcbiAgICAgICAgbGV0IG0gPSBtYXQubTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgICAgICBvdXRbb2ZzICsgaV0gPSBtW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmlbDnu4Tovaznn6npmLVcbiAgICAgKiAhI2VuIFRyYW5zZmVyIG1hdHJpeCBhcnJheVxuICAgICAqIEBtZXRob2QgZnJvbUFycmF5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tQXJyYXkgPE91dCBleHRlbmRzIElNYXQ0TGlrZT4gKG91dDogT3V0LCBhcnI6IElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+LCBvZnMgPSAwKVxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE6LW35aeL5YGP56e76YePXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tQXJyYXk8T3V0IGV4dGVuZHMgSU1hdDRMaWtlPiAob3V0OiBPdXQsIGFycjogSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4sIG9mcyA9IDApIHtcbiAgICAgICAgbGV0IG0gPSBvdXQubTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICAgICAgICBtW2ldID0gYXJyW29mcyArIGldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBNYXRyaXggRGF0YVxuICAgICAqICEjemgg55+p6Zi15pWw5o2uXG4gICAgICogQHByb3BlcnR5IHtGbG9hdDY0QXJyYXkgfCBGbG9hdDMyQXJyYXl9IG1cbiAgICAgKi9cbiAgICBtOiBGbG9hdEFycmF5O1xuXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKiBzZWUge3sjY3Jvc3NMaW5rIFwiY2MvbWF0NDptZXRob2RcIn19Y2MubWF0NHt7L2Nyb3NzTGlua319XG4gICAgICogISN6aFxuICAgICAqIOaehOmAoOWHveaVsO+8jOWPr+afpeeciyB7eyNjcm9zc0xpbmsgXCJjYy9tYXQ0Om1ldGhvZFwifX1jYy5tYXQ0e3svY3Jvc3NMaW5rfX1cbiAgICAgKiBAbWV0aG9kIGNvbnN0cnVjdG9yXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjb25zdHJ1Y3RvciAoIG0wMDogbnVtYmVyID0gMSwgbTAxOiBudW1iZXIgPSAwLCBtMDI6IG51bWJlciA9IDAsIG0wMzogbnVtYmVyID0gMCwgbTEwOiBudW1iZXIgPSAwLCBtMTE6IG51bWJlciA9IDEsIG0xMjogbnVtYmVyID0gMCwgbTEzOiBudW1iZXIgPSAwLCBtMjA6IG51bWJlciA9IDAsIG0yMTogbnVtYmVyID0gMCwgbTIyOiBudW1iZXIgPSAxLCBtMjM6IG51bWJlciA9IDAsIG0zMDogbnVtYmVyID0gMCwgbTMxOiBudW1iZXIgPSAwLCBtMzI6IG51bWJlciA9IDAsIG0zMzogbnVtYmVyID0gMSlcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgIG0wMDogbnVtYmVyIHwgRmxvYXRBcnJheSA9IDEsIG0wMTogbnVtYmVyID0gMCwgbTAyOiBudW1iZXIgPSAwLCBtMDM6IG51bWJlciA9IDAsXG4gICAgICAgIG0xMDogbnVtYmVyID0gMCwgbTExOiBudW1iZXIgPSAxLCBtMTI6IG51bWJlciA9IDAsIG0xMzogbnVtYmVyID0gMCxcbiAgICAgICAgbTIwOiBudW1iZXIgPSAwLCBtMjE6IG51bWJlciA9IDAsIG0yMjogbnVtYmVyID0gMSwgbTIzOiBudW1iZXIgPSAwLFxuICAgICAgICBtMzA6IG51bWJlciA9IDAsIG0zMTogbnVtYmVyID0gMCwgbTMyOiBudW1iZXIgPSAwLCBtMzM6IG51bWJlciA9IDEpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgaWYgKG0wMCBpbnN0YW5jZW9mIEZMT0FUX0FSUkFZX1RZUEUpIHtcbiAgICAgICAgICAgIHRoaXMubSA9IG0wMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubSA9IG5ldyBGTE9BVF9BUlJBWV9UWVBFKDE2KTtcbiAgICAgICAgICAgIGxldCB0bSA9IHRoaXMubTtcbiAgICAgICAgICAgIHRtWzBdID0gbTAwIGFzIG51bWJlcjtcbiAgICAgICAgICAgIHRtWzFdID0gbTAxO1xuICAgICAgICAgICAgdG1bMl0gPSBtMDI7XG4gICAgICAgICAgICB0bVszXSA9IG0wMztcbiAgICAgICAgICAgIHRtWzRdID0gbTEwO1xuICAgICAgICAgICAgdG1bNV0gPSBtMTE7XG4gICAgICAgICAgICB0bVs2XSA9IG0xMjtcbiAgICAgICAgICAgIHRtWzddID0gbTEzO1xuICAgICAgICAgICAgdG1bOF0gPSBtMjA7XG4gICAgICAgICAgICB0bVs5XSA9IG0yMTtcbiAgICAgICAgICAgIHRtWzEwXSA9IG0yMjtcbiAgICAgICAgICAgIHRtWzExXSA9IG0yMztcbiAgICAgICAgICAgIHRtWzEyXSA9IG0zMDtcbiAgICAgICAgICAgIHRtWzEzXSA9IG0zMTtcbiAgICAgICAgICAgIHRtWzE0XSA9IG0zMjtcbiAgICAgICAgICAgIHRtWzE1XSA9IG0zMztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gY2xvbmUgYSBNYXQ0IG9iamVjdFxuICAgICAqICEjemgg5YWL6ZqG5LiA5LiqIE1hdDQg5a+56LGhXG4gICAgICogQG1ldGhvZCBjbG9uZVxuICAgICAqIEByZXR1cm4ge01hdDR9XG4gICAgICovXG4gICAgY2xvbmUgKCkge1xuICAgICAgICBsZXQgdCA9IHRoaXM7XG4gICAgICAgIGxldCB0bSA9IHQubTtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXQ0KFxuICAgICAgICAgICAgdG1bMF0sIHRtWzFdLCB0bVsyXSwgdG1bM10sXG4gICAgICAgICAgICB0bVs0XSwgdG1bNV0sIHRtWzZdLCB0bVs3XSxcbiAgICAgICAgICAgIHRtWzhdLCB0bVs5XSwgdG1bMTBdLCB0bVsxMV0sXG4gICAgICAgICAgICB0bVsxMl0sIHRtWzEzXSwgdG1bMTRdLCB0bVsxNV0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyB0aGUgbWF0cml4IHdpdGggYW5vdGhlciBvbmUncyB2YWx1ZVxuICAgICAqICEjemgg55So5Y+m5LiA5Liq55+p6Zi16K6+572u6L+Z5Liq55+p6Zi155qE5YC844CCXG4gICAgICogQG1ldGhvZCBzZXRcbiAgICAgKiBAcGFyYW0ge01hdDR9IHNyY09ialxuICAgICAqIEByZXR1cm4ge01hdDR9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBzZXQgKHMpIHtcbiAgICAgICAgbGV0IHQgPSB0aGlzO1xuICAgICAgICBsZXQgdG0gPSB0Lm0sIHNtID0gcy5tO1xuICAgICAgICB0bVswXSA9IHNtWzBdO1xuICAgICAgICB0bVsxXSA9IHNtWzFdO1xuICAgICAgICB0bVsyXSA9IHNtWzJdO1xuICAgICAgICB0bVszXSA9IHNtWzNdO1xuICAgICAgICB0bVs0XSA9IHNtWzRdO1xuICAgICAgICB0bVs1XSA9IHNtWzVdO1xuICAgICAgICB0bVs2XSA9IHNtWzZdO1xuICAgICAgICB0bVs3XSA9IHNtWzddO1xuICAgICAgICB0bVs4XSA9IHNtWzhdO1xuICAgICAgICB0bVs5XSA9IHNtWzldO1xuICAgICAgICB0bVsxMF0gPSBzbVsxMF07XG4gICAgICAgIHRtWzExXSA9IHNtWzExXTtcbiAgICAgICAgdG1bMTJdID0gc21bMTJdO1xuICAgICAgICB0bVsxM10gPSBzbVsxM107XG4gICAgICAgIHRtWzE0XSA9IHNtWzE0XTtcbiAgICAgICAgdG1bMTVdID0gc21bMTVdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrIHdoZXRoZXIgdHdvIG1hdHJpeCBlcXVhbFxuICAgICAqICEjemgg5b2T5YmN55qE55+p6Zi15piv5ZCm5LiO5oyH5a6a55qE55+p6Zi155u4562J44CCXG4gICAgICogQG1ldGhvZCBlcXVhbHNcbiAgICAgKiBAcGFyYW0ge01hdDR9IG90aGVyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBlcXVhbHMgKG90aGVyKSB7XG4gICAgICAgIHJldHVybiBNYXQ0LnN0cmljdEVxdWFscyh0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVjayB3aGV0aGVyIHR3byBtYXRyaXggZXF1YWwgd2l0aCBkZWZhdWx0IGRlZ3JlZSBvZiB2YXJpYW5jZS5cbiAgICAgKiAhI3poXG4gICAgICog6L+R5Ly85Yik5pat5Lik5Liq55+p6Zi15piv5ZCm55u4562J44CCPGJyLz5cbiAgICAgKiDliKTmlq0gMiDkuKrnn6npmLXmmK/lkKblnKjpu5jorqTor6/lt67ojIPlm7TkuYvlhoXvvIzlpoLmnpzlnKjliJnov5Tlm54gdHJ1Ze+8jOWPjeS5i+WImei/lOWbniBmYWxzZeOAglxuICAgICAqIEBtZXRob2QgZnV6enlFcXVhbHNcbiAgICAgKiBAcGFyYW0ge01hdDR9IG90aGVyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBmdXp6eUVxdWFscyAob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIE1hdDQuZXF1YWxzKHRoaXMsIG90aGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRyYW5zZm9ybSB0byBzdHJpbmcgd2l0aCBtYXRyaXggaW5mb3JtYXRpb25zXG4gICAgICogISN6aCDovazmjaLkuLrmlrnkvr/pmIXor7vnmoTlrZfnrKbkuLLjgIJcbiAgICAgKiBAbWV0aG9kIHRvU3RyaW5nXG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRvU3RyaW5nICgpIHtcbiAgICAgICAgbGV0IHRtID0gdGhpcy5tO1xuICAgICAgICBpZiAodG0pIHtcbiAgICAgICAgICAgIHJldHVybiBcIltcXG5cIiArXG4gICAgICAgICAgICAgICAgdG1bMF0gKyBcIiwgXCIgKyB0bVsxXSArIFwiLCBcIiArIHRtWzJdICsgXCIsIFwiICsgdG1bM10gKyBcIixcXG5cIiArXG4gICAgICAgICAgICAgICAgdG1bNF0gKyBcIiwgXCIgKyB0bVs1XSArIFwiLCBcIiArIHRtWzZdICsgXCIsIFwiICsgdG1bN10gKyBcIixcXG5cIiArXG4gICAgICAgICAgICAgICAgdG1bOF0gKyBcIiwgXCIgKyB0bVs5XSArIFwiLCBcIiArIHRtWzEwXSArIFwiLCBcIiArIHRtWzExXSArIFwiLFxcblwiICtcbiAgICAgICAgICAgICAgICB0bVsxMl0gKyBcIiwgXCIgKyB0bVsxM10gKyBcIiwgXCIgKyB0bVsxNF0gKyBcIiwgXCIgKyB0bVsxNV0gKyBcIlxcblwiICtcbiAgICAgICAgICAgICAgICBcIl1cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBcIltcXG5cIiArXG4gICAgICAgICAgICAgICAgXCIxLCAwLCAwLCAwXFxuXCIgK1xuICAgICAgICAgICAgICAgIFwiMCwgMSwgMCwgMFxcblwiICtcbiAgICAgICAgICAgICAgICBcIjAsIDAsIDEsIDBcXG5cIiArXG4gICAgICAgICAgICAgICAgXCIwLCAwLCAwLCAxXFxuXCIgK1xuICAgICAgICAgICAgICAgIFwiXVwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBtYXRyaXggdG8gdGhlIGlkZW50aXR5IG1hdHJpeFxuICAgICAqIEBtZXRob2QgaWRlbnRpdHlcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gc2VsZlxuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBpZGVudGl0eSAoKTogdGhpcyB7XG4gICAgICAgIHJldHVybiBNYXQ0LmlkZW50aXR5KHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zcG9zZSB0aGUgdmFsdWVzIG9mIGEgbWF0NFxuICAgICAqIEBtZXRob2QgdHJhbnNwb3NlXG4gICAgICogQHBhcmFtIHtNYXQ0fSBbb3V0XSB0aGUgcmVjZWl2aW5nIG1hdHJpeCwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIG1hdHJpeCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgbWF0cml4IHdpbGwgYmUgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgdHJhbnNwb3NlIChvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBNYXQ0KCk7XG4gICAgICAgIHJldHVybiBNYXQ0LnRyYW5zcG9zZShvdXQsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmVydHMgYSBtYXQ0XG4gICAgICogQG1ldGhvZCBpbnZlcnRcbiAgICAgKiBAcGFyYW0ge01hdDR9IFtvdXRdIHRoZSByZWNlaXZpbmcgbWF0cml4LCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgbWF0cml4IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyBtYXRyaXggd2lsbCBiZSBjcmVhdGVkLlxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICBpbnZlcnQgKG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IE1hdDQoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQuaW52ZXJ0KG91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgYWRqdWdhdGUgb2YgYSBtYXQ0XG4gICAgICogQG1ldGhvZCBhZGpvaW50XG4gICAgICogQHBhcmFtIHtNYXQ0fSBbb3V0XSB0aGUgcmVjZWl2aW5nIG1hdHJpeCwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIG1hdHJpeCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgbWF0cml4IHdpbGwgYmUgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgYWRqb2ludCAob3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgTWF0NCgpO1xuICAgICAgICByZXR1cm4gTWF0NC5hZGpvaW50KG91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgZGV0ZXJtaW5hbnQgb2YgYSBtYXQ0XG4gICAgICogQG1ldGhvZCBkZXRlcm1pbmFudFxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ9IGRldGVybWluYW50IG9mIGFcbiAgICAgKi9cbiAgICBkZXRlcm1pbmFudCAoKSB7XG4gICAgICAgIHJldHVybiBNYXQ0LmRldGVybWluYW50KHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgdHdvIE1hdDRcbiAgICAgKiBAbWV0aG9kIGFkZFxuICAgICAqIEBwYXJhbSB7TWF0NH0gb3RoZXIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAgICogQHBhcmFtIHtNYXQ0fSBbb3V0XSB0aGUgcmVjZWl2aW5nIG1hdHJpeCwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIG1hdHJpeCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgbWF0cml4IHdpbGwgYmUgY3JlYXRlZC5cbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgYWRkIChvdGhlciwgb3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgTWF0NCgpO1xuICAgICAgICByZXR1cm4gTWF0NC5hZGQob3V0LCB0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIHRoZSBjdXJyZW50IG1hdHJpeCB3aXRoIGFub3RoZXIgb25lXG4gICAgICogQG1ldGhvZCBzdWJ0cmFjdFxuICAgICAqIEBwYXJhbSB7TWF0NH0gb3RoZXIgdGhlIHNlY29uZCBvcGVyYW5kXG4gICAgICogQHJldHVybnMge01hdDR9IHRoaXNcbiAgICAgKi9cbiAgICBzdWJ0cmFjdCAob3RoZXIpOiB0aGlzIHtcbiAgICAgICAgcmV0dXJuIE1hdDQuc3VidHJhY3QodGhpcywgdGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyB0aGUgY3VycmVudCBtYXRyaXggd2l0aCBhbm90aGVyIG9uZVxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlcbiAgICAgKiBAcGFyYW0ge01hdDR9IG90aGVyIHRoZSBzZWNvbmQgb3BlcmFuZFxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSB0aGlzXG4gICAgICovXG4gICAgbXVsdGlwbHkgKG90aGVyKTogdGhpcyB7XG4gICAgICAgIHJldHVybiBNYXQ0Lm11bHRpcGx5KHRoaXMsIHRoaXMsIG90aGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNdWx0aXBseSBlYWNoIGVsZW1lbnQgb2YgdGhlIG1hdHJpeCBieSBhIHNjYWxhci5cbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5U2NhbGFyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG51bWJlciBhbW91bnQgdG8gc2NhbGUgdGhlIG1hdHJpeCdzIGVsZW1lbnRzIGJ5XG4gICAgICogQHJldHVybnMge01hdDR9IHRoaXNcbiAgICAgKi9cbiAgICBtdWx0aXBseVNjYWxhciAobnVtYmVyKTogdGhpcyB7XG4gICAgICAgIHJldHVybiBNYXQ0Lm11bHRpcGx5U2NhbGFyKHRoaXMsIHRoaXMsIG51bWJlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVHJhbnNsYXRlIGEgbWF0NCBieSB0aGUgZ2l2ZW4gdmVjdG9yXG4gICAgICogQG1ldGhvZCB0cmFuc2xhdGVcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHYgdmVjdG9yIHRvIHRyYW5zbGF0ZSBieVxuICAgICAqIEBwYXJhbSB7TWF0NH0gW291dF0gdGhlIHJlY2VpdmluZyBtYXRyaXgsIHlvdSBjYW4gcGFzcyB0aGUgc2FtZSBtYXRyaXggdG8gc2F2ZSByZXN1bHQgdG8gaXRzZWxmLCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IG1hdHJpeCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJucyB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgdHJhbnNsYXRlICh2LCBvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBNYXQ0KCk7XG4gICAgICAgIHJldHVybiBNYXQ0LnRyYW5zbGF0ZShvdXQsIHRoaXMsIHYpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNjYWxlcyB0aGUgbWF0NCBieSB0aGUgZGltZW5zaW9ucyBpbiB0aGUgZ2l2ZW4gdmVjM1xuICAgICAqIEBtZXRob2Qgc2NhbGVcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHYgdmVjdG9yIHRvIHNjYWxlIGJ5XG4gICAgICogQHBhcmFtIHtNYXQ0fSBbb3V0XSB0aGUgcmVjZWl2aW5nIG1hdHJpeCwgeW91IGNhbiBwYXNzIHRoZSBzYW1lIG1hdHJpeCB0byBzYXZlIHJlc3VsdCB0byBpdHNlbGYsIGlmIG5vdCBwcm92aWRlZCwgYSBuZXcgbWF0cml4IHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm5zIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICBzY2FsZSAodiwgb3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgTWF0NCgpO1xuICAgICAgICByZXR1cm4gTWF0NC5zY2FsZShvdXQsIHRoaXMsIHYpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJvdGF0ZXMgYSBtYXQ0IGJ5IHRoZSBnaXZlbiBhbmdsZSBhcm91bmQgdGhlIGdpdmVuIGF4aXNcbiAgICAgKiBAbWV0aG9kIHJvdGF0ZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgdGhlIGFuZ2xlIHRvIHJvdGF0ZSB0aGUgbWF0cml4IGJ5XG4gICAgICogQHBhcmFtIHtWZWMzfSBheGlzIHRoZSBheGlzIHRvIHJvdGF0ZSBhcm91bmRcbiAgICAgKiBAcGFyYW0ge01hdDR9IFtvdXRdIHRoZSByZWNlaXZpbmcgbWF0cml4LCB5b3UgY2FuIHBhc3MgdGhlIHNhbWUgbWF0cml4IHRvIHNhdmUgcmVzdWx0IHRvIGl0c2VsZiwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyBtYXRyaXggd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybnMge01hdDR9IG91dFxuICAgICAqL1xuICAgIHJvdGF0ZSAocmFkLCBheGlzLCBvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBNYXQ0KCk7XG4gICAgICAgIHJldHVybiBNYXQ0LnJvdGF0ZShvdXQsIHRoaXMsIHJhZCwgYXhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdHJhbnNsYXRpb24gdmVjdG9yIGNvbXBvbmVudCBvZiBhIHRyYW5zZm9ybWF0aW9uIG1hdHJpeC5cbiAgICAgKiBAbWV0aG9kIGdldFRyYW5zbGF0aW9uXG4gICAgICogQHBhcmFtICB7VmVjM30gb3V0IFZlY3RvciB0byByZWNlaXZlIHRyYW5zbGF0aW9uIGNvbXBvbmVudCwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyB2ZWMzIHdpbGwgYmUgY3JlYXRlZFxuICAgICAqIEByZXR1cm4ge1ZlYzN9IG91dFxuICAgICAqL1xuICAgIGdldFRyYW5zbGF0aW9uIChvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWMzKCk7XG4gICAgICAgIHJldHVybiBNYXQ0LmdldFRyYW5zbGF0aW9uKG91dCwgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc2NhbGUgZmFjdG9yIGNvbXBvbmVudCBvZiBhIHRyYW5zZm9ybWF0aW9uIG1hdHJpeFxuICAgICAqIEBtZXRob2QgZ2V0U2NhbGVcbiAgICAgKiBAcGFyYW0gIHtWZWMzfSBvdXQgVmVjdG9yIHRvIHJlY2VpdmUgc2NhbGUgY29tcG9uZW50LCBpZiBub3QgcHJvdmlkZWQsIGEgbmV3IHZlYzMgd2lsbCBiZSBjcmVhdGVkXG4gICAgICogQHJldHVybiB7VmVjM30gb3V0XG4gICAgICovXG4gICAgZ2V0U2NhbGUgKG91dCkge1xuICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IFZlYzMoKTtcbiAgICAgICAgcmV0dXJuIE1hdDQuZ2V0U2NhbGluZyhvdXQsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHJvdGF0aW9uIGZhY3RvciBjb21wb25lbnQgb2YgYSB0cmFuc2Zvcm1hdGlvbiBtYXRyaXhcbiAgICAgKiBAbWV0aG9kIGdldFJvdGF0aW9uXG4gICAgICogQHBhcmFtICB7UXVhdH0gb3V0IFZlY3RvciB0byByZWNlaXZlIHJvdGF0aW9uIGNvbXBvbmVudCwgaWYgbm90IHByb3ZpZGVkLCBhIG5ldyBxdWF0ZXJuaW9uIG9iamVjdCB3aWxsIGJlIGNyZWF0ZWRcbiAgICAgKiBAcmV0dXJuIHtRdWF0fSBvdXRcbiAgICAgKi9cbiAgICBnZXRSb3RhdGlvbiAob3V0KSB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgUXVhdCgpO1xuICAgICAgICByZXR1cm4gTWF0NC5nZXRSb3RhdGlvbihvdXQsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlc3RvcmUgdGhlIG1hdHJpeCB2YWx1ZXMgZnJvbSBhIHF1YXRlcm5pb24gcm90YXRpb24sIHZlY3RvciB0cmFuc2xhdGlvbiBhbmQgdmVjdG9yIHNjYWxlXG4gICAgICogQG1ldGhvZCBmcm9tUlRTXG4gICAgICogQHBhcmFtIHtRdWF0fSBxIFJvdGF0aW9uIHF1YXRlcm5pb25cbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHYgVHJhbnNsYXRpb24gdmVjdG9yXG4gICAgICogQHBhcmFtIHtWZWMzfSBzIFNjYWxpbmcgdmVjdG9yXG4gICAgICogQHJldHVybnMge01hdDR9IHRoZSBjdXJyZW50IG1hdDQgb2JqZWN0XG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIGZyb21SVFMgKHEsIHYsIHMpOiB0aGlzIHtcbiAgICAgICAgcmV0dXJuIE1hdDQuZnJvbVJUUyh0aGlzLCBxLCB2LCBzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXN0b3JlIHRoZSBtYXRyaXggdmFsdWVzIGZyb20gYSBxdWF0ZXJuaW9uIHJvdGF0aW9uXG4gICAgICogQG1ldGhvZCBmcm9tUXVhdFxuICAgICAqIEBwYXJhbSB7UXVhdH0gcSBSb3RhdGlvbiBxdWF0ZXJuaW9uXG4gICAgICogQHJldHVybnMge01hdDR9IHRoZSBjdXJyZW50IG1hdDQgb2JqZWN0XG4gICAgICogQGNoYWluYWJsZVxuICAgICAqL1xuICAgIGZyb21RdWF0IChxdWF0KTogdGhpcyB7XG4gICAgICAgIHJldHVybiBNYXQ0LmZyb21RdWF0KHRoaXMsIHF1YXQpO1xuICAgIH1cbn1cblxuY29uc3QgdjNfMTogVmVjMyA9IG5ldyBWZWMzKCk7XG5jb25zdCBtM18xOiBNYXQzID0gbmV3IE1hdDMoKTtcblxuQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5NYXQ0JywgTWF0NCwge1xuICAgIG0wMDogMSwgbTAxOiAwLCBtMDI6IDAsIG0wMzogMCxcbiAgICBtMDQ6IDAsIG0wNTogMSwgbTA2OiAwLCBtMDc6IDAsXG4gICAgbTA4OiAwLCBtMDk6IDAsIG0xMDogMSwgbTExOiAwLFxuICAgIG0xMjogMCwgbTEzOiAwLCBtMTQ6IDAsIG0xNTogMVxufSk7XG5cbmZvciAobGV0IGkgPSAwOyBpIDwgMTY7IGkrKykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShNYXQ0LnByb3RvdHlwZSwgJ20nICsgaSwge1xuICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubVtpXTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5tW2ldID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5cbi8qKlxuICogQG1vZHVsZSBjY1xuICovXG5cbi8qKlxuICogISNlbiBUaGUgY29udmVuaWVuY2UgbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyB7eyNjcm9zc0xpbmsgXCJNYXQ0XCJ9fWNjLk1hdDR7ey9jcm9zc0xpbmt9fS5cbiAqICEjemgg6YCa6L+H6K+l566A5L6/55qE5Ye95pWw6L+b6KGM5Yib5bu6IHt7I2Nyb3NzTGluayBcIk1hdDRcIn19Y2MuTWF0NHt7L2Nyb3NzTGlua319IOWvueixoeOAglxuICogQG1ldGhvZCBtYXQ0XG4gKiBAcGFyYW0ge051bWJlcn0gW20wMF0gQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMCBwb3NpdGlvbiAoaW5kZXggMClcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTAxXSBDb21wb25lbnQgaW4gY29sdW1uIDAsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAxKVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMDJdIENvbXBvbmVudCBpbiBjb2x1bW4gMCwgcm93IDIgcG9zaXRpb24gKGluZGV4IDIpXG4gKiBAcGFyYW0ge051bWJlcn0gW20wM10gQ29tcG9uZW50IGluIGNvbHVtbiAwLCByb3cgMyBwb3NpdGlvbiAoaW5kZXggMylcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTEwXSBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAwIHBvc2l0aW9uIChpbmRleCA0KVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMTFdIENvbXBvbmVudCBpbiBjb2x1bW4gMSwgcm93IDEgcG9zaXRpb24gKGluZGV4IDUpXG4gKiBAcGFyYW0ge051bWJlcn0gW20xMl0gQ29tcG9uZW50IGluIGNvbHVtbiAxLCByb3cgMiBwb3NpdGlvbiAoaW5kZXggNilcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTEzXSBDb21wb25lbnQgaW4gY29sdW1uIDEsIHJvdyAzIHBvc2l0aW9uIChpbmRleCA3KVxuICogQHBhcmFtIHtOdW1iZXJ9IFttMjBdIENvbXBvbmVudCBpbiBjb2x1bW4gMiwgcm93IDAgcG9zaXRpb24gKGluZGV4IDgpXG4gKiBAcGFyYW0ge051bWJlcn0gW20yMV0gQ29tcG9uZW50IGluIGNvbHVtbiAyLCByb3cgMSBwb3NpdGlvbiAoaW5kZXggOSlcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTIyXSBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAxMClcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTIzXSBDb21wb25lbnQgaW4gY29sdW1uIDIsIHJvdyAzIHBvc2l0aW9uIChpbmRleCAxMSlcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTMwXSBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAwIHBvc2l0aW9uIChpbmRleCAxMilcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTMxXSBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAxIHBvc2l0aW9uIChpbmRleCAxMylcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTMyXSBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAyIHBvc2l0aW9uIChpbmRleCAxNClcbiAqIEBwYXJhbSB7TnVtYmVyfSBbbTMzXSBDb21wb25lbnQgaW4gY29sdW1uIDMsIHJvdyAzIHBvc2l0aW9uIChpbmRleCAxNSlcbiAqIEByZXR1cm4ge01hdDR9XG4gKi9cbmNjLm1hdDQgPSBmdW5jdGlvbiAobTAwLCBtMDEsIG0wMiwgbTAzLCBtMTAsIG0xMSwgbTEyLCBtMTMsIG0yMCwgbTIxLCBtMjIsIG0yMywgbTMwLCBtMzEsIG0zMiwgbTMzKSB7XG4gICAgbGV0IG1hdCA9IG5ldyBNYXQ0KG0wMCwgbTAxLCBtMDIsIG0wMywgbTEwLCBtMTEsIG0xMiwgbTEzLCBtMjAsIG0yMSwgbTIyLCBtMjMsIG0zMCwgbTMxLCBtMzIsIG0zMyk7XG4gICAgaWYgKG0wMCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIE1hdDQuaWRlbnRpdHkobWF0KTtcbiAgICB9XG4gICAgcmV0dXJuIG1hdDtcbn07XG5cbmNjLk1hdDQgPSBNYXQ0O1xuIl19