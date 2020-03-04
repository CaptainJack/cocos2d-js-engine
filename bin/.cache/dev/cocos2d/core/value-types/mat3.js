
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/mat3.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _utils = require("../value-types/utils");

var _vec = _interopRequireDefault(require("./vec3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Mathematical 3x3 matrix.
 *
 * NOTE: we use column-major matrix for all matrix calculation.
 *
 * This may lead to some confusion when referencing OpenGL documentation,
 * however, which represents out all matricies in column-major format.
 * This means that while in code a matrix may be typed out as:
 *
 * [1, 0, 0, 0,
 *  0, 1, 0, 0,
 *  0, 0, 1, 0,
 *  x, y, z, 0]
 *
 * The same matrix in the [OpenGL documentation](https://www.khronos.org/registry/OpenGL-Refpages/gl2.1/xhtml/glTranslate.xml)
 * is written as:
 *
 *  1 0 0 x
 *  0 1 0 y
 *  0 0 1 z
 *  0 0 0 0
 *
 * Please rest assured, however, that they are the same thing!
 * This is not unique to glMatrix, either, as OpenGL developers have long been confused by the
 * apparent lack of consistency between the memory layout and the documentation.
 */
var Mat3 =
/*#__PURE__*/
function () {
  /**
   * Identity  of Mat3
   * @property {Mat3} IDENTITY
   * @static
   */

  /**
   * Creates a matrix, with elements specified separately.
   *
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 0 row 2.
   * @param {Number} m03 - Value assigned to element at column 1 row 0.
   * @param {Number} m04 - Value assigned to element at column 1 row 1.
   * @param {Number} m05 - Value assigned to element at column 1 row 2.
   * @param {Number} m06 - Value assigned to element at column 2 row 0.
   * @param {Number} m07 - Value assigned to element at column 2 row 1.
   * @param {Number} m08 - Value assigned to element at column 2 row 2.
   * @returns {Mat3} The newly created matrix.
   * @static
   */
  Mat3.create = function create(m00, m01, m02, m03, m04, m05, m06, m07, m08) {
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

    if (m04 === void 0) {
      m04 = 1;
    }

    if (m05 === void 0) {
      m05 = 0;
    }

    if (m06 === void 0) {
      m06 = 0;
    }

    if (m07 === void 0) {
      m07 = 0;
    }

    if (m08 === void 0) {
      m08 = 1;
    }

    return new Mat3(m00, m01, m02, m03, m04, m05, m06, m07, m08);
  }
  /**
   * Clone a matrix.
   *
   * @param {Mat3} a - Matrix to clone.
   * @returns {Mat3} The newly created matrix.
   * @static
   */
  ;

  Mat3.clone = function clone(a) {
    var am = a.m;
    return new Mat3(am[0], am[1], am[2], am[3], am[4], am[5], am[6], am[7], am[8]);
  }
  /**
   * Copy content of a matrix into another.
   *
   * @param {Mat3} out - Matrix to modified.
   * @param {Mat3} a - The specified matrix.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.copy = function copy(out, a) {
    out.m.set(a.m);
    return out;
  }
  /**
   * Sets the elements of a matrix to the given values.
   *
   * @param {Mat3} out - The matrix to modified.
   * @param {Number} m00 - Value assigned to element at column 0 row 0.
   * @param {Number} m01 - Value assigned to element at column 0 row 1.
   * @param {Number} m02 - Value assigned to element at column 0 row 2.
   * @param {Number} m10 - Value assigned to element at column 1 row 0.
   * @param {Number} m11 - Value assigned to element at column 1 row 1.
   * @param {Number} m12 - Value assigned to element at column 1 row 2.
   * @param {Number} m20 - Value assigned to element at column 2 row 0.
   * @param {Number} m21 - Value assigned to element at column 2 row 1.
   * @param {Number} m22 - Value assigned to element at column 2 row 2.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.set = function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    var outm = out.m;
    outm[0] = m00;
    outm[1] = m01;
    outm[2] = m02;
    outm[3] = m10;
    outm[4] = m11;
    outm[5] = m12;
    outm[6] = m20;
    outm[7] = m21;
    outm[8] = m22;
    return out;
  }
  /**
   * return an identity matrix.
   *
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.identity = function identity(out) {
    var outm = out.m;
    outm[0] = 1;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = 1;
    outm[5] = 0;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 1;
    return out;
  }
  /**
   * Transposes a matrix.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to transpose.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.transpose = function transpose(out, a) {
    var am = a.m,
        outm = out.m; // If we are transposing ourselves we can skip a few steps but have to cache some values

    if (out === a) {
      var a01 = am[1],
          a02 = am[2],
          a12 = am[5];
      outm[1] = am[3];
      outm[2] = am[6];
      outm[3] = a01;
      outm[5] = am[7];
      outm[6] = a02;
      outm[7] = a12;
    } else {
      outm[0] = am[0];
      outm[1] = am[3];
      outm[2] = am[6];
      outm[3] = am[1];
      outm[4] = am[4];
      outm[5] = am[7];
      outm[6] = am[2];
      outm[7] = am[5];
      outm[8] = am[8];
    }

    return out;
  }
  /**
   * Inverts a matrix.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to invert.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.invert = function invert(out, a) {
    var am = a.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

    var det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      return out;
    }

    det = 1.0 / det;
    outm[0] = b01 * det;
    outm[1] = (-a22 * a01 + a02 * a21) * det;
    outm[2] = (a12 * a01 - a02 * a11) * det;
    outm[3] = b11 * det;
    outm[4] = (a22 * a00 - a02 * a20) * det;
    outm[5] = (-a12 * a00 + a02 * a10) * det;
    outm[6] = b21 * det;
    outm[7] = (-a21 * a00 + a01 * a20) * det;
    outm[8] = (a11 * a00 - a01 * a10) * det;
    return out;
  }
  /**
   * Calculates the adjugate of a matrix.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to calculate.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.adjoint = function adjoint(out, a) {
    var am = a.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    outm[0] = a11 * a22 - a12 * a21;
    outm[1] = a02 * a21 - a01 * a22;
    outm[2] = a01 * a12 - a02 * a11;
    outm[3] = a12 * a20 - a10 * a22;
    outm[4] = a00 * a22 - a02 * a20;
    outm[5] = a02 * a10 - a00 * a12;
    outm[6] = a10 * a21 - a11 * a20;
    outm[7] = a01 * a20 - a00 * a21;
    outm[8] = a00 * a11 - a01 * a10;
    return out;
  }
  /**
   * Calculates the determinant of a matrix.
   *
   * @param {Mat3} a - Matrix to calculate.
   * @returns {Number} Determinant of a.
   * @static
   */
  ;

  Mat3.determinant = function determinant(a) {
    var am = a.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
  }
  /**
   * Multiply two matrices explicitly.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - The first operand.
   * @param {Mat3} b - The second operand.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.multiply = function multiply(out, a, b) {
    var am = a.m,
        bm = b.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    var b00 = bm[0],
        b01 = bm[1],
        b02 = bm[2];
    var b10 = bm[3],
        b11 = bm[4],
        b12 = bm[5];
    var b20 = bm[6],
        b21 = bm[7],
        b22 = bm[8];
    outm[0] = b00 * a00 + b01 * a10 + b02 * a20;
    outm[1] = b00 * a01 + b01 * a11 + b02 * a21;
    outm[2] = b00 * a02 + b01 * a12 + b02 * a22;
    outm[3] = b10 * a00 + b11 * a10 + b12 * a20;
    outm[4] = b10 * a01 + b11 * a11 + b12 * a21;
    outm[5] = b10 * a02 + b11 * a12 + b12 * a22;
    outm[6] = b20 * a00 + b21 * a10 + b22 * a20;
    outm[7] = b20 * a01 + b21 * a11 + b22 * a21;
    outm[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
  }
  /**
   * !#en Take the first third order of the fourth order matrix and multiply by the third order matrix
   * !#zh 取四阶矩阵的前三阶，与三阶矩阵相乘
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - The first operand.
   * @param {Mat3} b - The second operand.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.multiplyMat4 = function multiplyMat4(out, a, b) {
    var am = a.m,
        bm = b.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    var b00 = bm[0],
        b01 = bm[1],
        b02 = bm[2];
    var b10 = bm[4],
        b11 = bm[5],
        b12 = bm[6];
    var b20 = bm[8],
        b21 = bm[9],
        b22 = bm[10];
    outm[0] = b00 * a00 + b01 * a10 + b02 * a20;
    outm[1] = b00 * a01 + b01 * a11 + b02 * a21;
    outm[2] = b00 * a02 + b01 * a12 + b02 * a22;
    outm[3] = b10 * a00 + b11 * a10 + b12 * a20;
    outm[4] = b10 * a01 + b11 * a11 + b12 * a21;
    outm[5] = b10 * a02 + b11 * a12 + b12 * a22;
    outm[6] = b20 * a00 + b21 * a10 + b22 * a20;
    outm[7] = b20 * a01 + b21 * a11 + b22 * a21;
    outm[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
  }
  /**
   * Multiply a matrix with a translation matrix given by a translation offset.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to multiply.
   * @param {vec2} v - The translation offset.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.translate = function translate(out, a, v) {
    var am = a.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    var x = v.x,
        y = v.y;
    outm[0] = a00;
    outm[1] = a01;
    outm[2] = a02;
    outm[3] = a10;
    outm[4] = a11;
    outm[5] = a12;
    outm[6] = x * a00 + y * a10 + a20;
    outm[7] = x * a01 + y * a11 + a21;
    outm[8] = x * a02 + y * a12 + a22;
    return out;
  }
  /**
   * Rotates a matrix by the given angle.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to rotate.
   * @param {Number} rad - The rotation angle.
   * @returns {Mat3} out
   * @static
   */
  ;

  Mat3.rotate = function rotate(out, a, rad) {
    var am = a.m,
        outm = out.m;
    var a00 = am[0],
        a01 = am[1],
        a02 = am[2],
        a10 = am[3],
        a11 = am[4],
        a12 = am[5],
        a20 = am[6],
        a21 = am[7],
        a22 = am[8];
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    outm[0] = c * a00 + s * a10;
    outm[1] = c * a01 + s * a11;
    outm[2] = c * a02 + s * a12;
    outm[3] = c * a10 - s * a00;
    outm[4] = c * a11 - s * a01;
    outm[5] = c * a12 - s * a02;
    outm[6] = a20;
    outm[7] = a21;
    outm[8] = a22;
    return out;
  }
  /**
   * Multiply a matrix with a scale matrix given by a scale vector.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to multiply.
   * @param {vec2} v - The scale vector.
   * @returns {Mat3} out
   **/
  ;

  Mat3.scale = function scale(out, a, v) {
    var x = v.x,
        y = v.y;
    var am = a.m,
        outm = out.m;
    outm[0] = x * am[0];
    outm[1] = x * am[1];
    outm[2] = x * am[2];
    outm[3] = y * am[3];
    outm[4] = y * am[4];
    outm[5] = y * am[5];
    outm[6] = am[6];
    outm[7] = am[7];
    outm[8] = am[8];
    return out;
  }
  /**
   * Copies the upper-left 3x3 values of a 4x4 matrix into a 3x3 matrix.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {mat4} a - The 4x4 matrix.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.fromMat4 = function fromMat4(out, a) {
    var am = a.m,
        outm = out.m;
    outm[0] = am[0];
    outm[1] = am[1];
    outm[2] = am[2];
    outm[3] = am[4];
    outm[4] = am[5];
    outm[5] = am[6];
    outm[6] = am[8];
    outm[7] = am[9];
    outm[8] = am[10];
    return out;
  }
  /**
   * Creates a matrix from a translation offset.
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.translate(dest, dest, vec);
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {vec2} v - The translation offset.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.fromTranslation = function fromTranslation(out, v) {
    var outm = out.m;
    outm[0] = 1;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = 1;
    outm[5] = 0;
    outm[6] = v.x;
    outm[7] = v.y;
    outm[8] = 1;
    return out;
  }
  /**
   * Creates a matrix from a given angle.
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.rotate(dest, dest, rad);
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Number} rad - The rotation angle.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.fromRotation = function fromRotation(out, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad);
    var outm = out.m;
    outm[0] = c;
    outm[1] = s;
    outm[2] = 0;
    outm[3] = -s;
    outm[4] = c;
    outm[5] = 0;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 1;
    return out;
  }
  /**
   * Creates a matrix from a scale vector.
   * This is equivalent to (but much faster than):
   *
   *     mat3.identity(dest);
   *     mat3.scale(dest, dest, vec);
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {vec2} v - Scale vector.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.fromScaling = function fromScaling(out, v) {
    var outm = out.m;
    outm[0] = v.x;
    outm[1] = 0;
    outm[2] = 0;
    outm[3] = 0;
    outm[4] = v.y;
    outm[5] = 0;
    outm[6] = 0;
    outm[7] = 0;
    outm[8] = 1;
    return out;
  }
  /**
   * Calculates a 3x3 matrix from the given quaternion.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {quat} q - The quaternion.
   *
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.fromQuat = function fromQuat(out, q) {
    var outm = out.m;
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
    outm[0] = 1 - yy - zz;
    outm[3] = yx - wz;
    outm[6] = zx + wy;
    outm[1] = yx + wz;
    outm[4] = 1 - xx - zz;
    outm[7] = zy - wx;
    outm[2] = zx - wy;
    outm[5] = zy + wx;
    outm[8] = 1 - xx - yy;
    return out;
  }
  /**
   * Calculates a 3x3 matrix from view direction and up direction.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {vec3} view - View direction (must be normalized).
   * @param {vec3} [up] - Up direction, default is (0,1,0) (must be normalized).
   *
   * @returns {Mat3} out
   * @static
   */
  ;

  Mat3.fromViewUp = function fromViewUp(out, view, up) {
    var _fromViewUpIIFE = function () {
      var default_up = new _vec["default"](0, 1, 0);
      var x = new _vec["default"]();
      var y = new _vec["default"]();
      return function (out, view, up) {
        if (_vec["default"].lengthSqr(view) < _utils.EPSILON * _utils.EPSILON) {
          Mat3.identity(out);
          return out;
        }

        up = up || default_up;

        _vec["default"].normalize(x, _vec["default"].cross(x, up, view));

        if (_vec["default"].lengthSqr(x) < _utils.EPSILON * _utils.EPSILON) {
          Mat3.identity(out);
          return out;
        }

        _vec["default"].cross(y, view, x);

        Mat3.set(out, x.x, x.y, x.z, y.x, y.y, y.z, view.x, view.y, view.z);
        return out;
      };
    }();

    return _fromViewUpIIFE(out, view, up);
  }
  /**
   * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {mat4} a - A 4x4 matrix to derive the normal matrix from.
   *
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.normalFromMat4 = function normalFromMat4(out, a) {
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
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return out;
    }

    det = 1.0 / det;
    outm[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    outm[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    outm[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    outm[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    outm[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    outm[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    outm[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    outm[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    outm[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    return out;
  }
  /**
   * Returns Frobenius norm of a matrix.
   *
   * @param {Mat3} a - Matrix to calculate Frobenius norm of.
   * @returns {Number} - The frobenius norm.
   * @static
   */
  ;

  Mat3.frob = function frob(a) {
    var am = a.m;
    return Math.sqrt(Math.pow(am[0], 2) + Math.pow(am[1], 2) + Math.pow(am[2], 2) + Math.pow(am[3], 2) + Math.pow(am[4], 2) + Math.pow(am[5], 2) + Math.pow(am[6], 2) + Math.pow(am[7], 2) + Math.pow(am[8], 2));
  }
  /**
   * Adds two matrices.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - The first operand.
   * @param {Mat3} b - The second operand.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.add = function add(out, a, b) {
    var am = a.m,
        bm = b.m,
        outm = out.m;
    outm[0] = am[0] + bm[0];
    outm[1] = am[1] + bm[1];
    outm[2] = am[2] + bm[2];
    outm[3] = am[3] + bm[3];
    outm[4] = am[4] + bm[4];
    outm[5] = am[5] + bm[5];
    outm[6] = am[6] + bm[6];
    outm[7] = am[7] + bm[7];
    outm[8] = am[8] + bm[8];
    return out;
  }
  /**
   * Subtracts matrix b from matrix a.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - The first operand.
   * @param {Mat3} b - The second operand.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.subtract = function subtract(out, a, b) {
    var am = a.m,
        bm = b.m,
        outm = out.m;
    outm[0] = am[0] - bm[0];
    outm[1] = am[1] - bm[1];
    outm[2] = am[2] - bm[2];
    outm[3] = am[3] - bm[3];
    outm[4] = am[4] - bm[4];
    outm[5] = am[5] - bm[5];
    outm[6] = am[6] - bm[6];
    outm[7] = am[7] - bm[7];
    outm[8] = am[8] - bm[8];
    return out;
  }
  /**
   * Multiply each element of a matrix by a scalar number.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - Matrix to scale
   * @param {Number} b - The scale number.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.multiplyScalar = function multiplyScalar(out, a, b) {
    var am = a.m,
        outm = out.m;
    outm[0] = am[0] * b;
    outm[1] = am[1] * b;
    outm[2] = am[2] * b;
    outm[3] = am[3] * b;
    outm[4] = am[4] * b;
    outm[5] = am[5] * b;
    outm[6] = am[6] * b;
    outm[7] = am[7] * b;
    outm[8] = am[8] * b;
    return out;
  }
  /**
   * Adds two matrices after multiplying each element of the second operand by a scalar number.
   *
   * @param {Mat3} out - Matrix to store result.
   * @param {Mat3} a - The first operand.
   * @param {Mat3} b - The second operand.
   * @param {Number} scale - The scale number.
   * @returns {Mat3} out.
   * @static
   */
  ;

  Mat3.multiplyScalarAndAdd = function multiplyScalarAndAdd(out, a, b, scale) {
    var am = a.m,
        bm = b.m,
        outm = out.m;
    outm[0] = am[0] + bm[0] * scale;
    outm[1] = am[1] + bm[1] * scale;
    outm[2] = am[2] + bm[2] * scale;
    outm[3] = am[3] + bm[3] * scale;
    outm[4] = am[4] + bm[4] * scale;
    outm[5] = am[5] + bm[5] * scale;
    outm[6] = am[6] + bm[6] * scale;
    outm[7] = am[7] + bm[7] * scale;
    outm[8] = am[8] + bm[8] * scale;
    return out;
  }
  /**
   * Returns whether the specified matrices are equal. (Compared using ===)
   *
   * @param {Mat3} a - The first matrix.
   * @param {Mat3} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   * @static
   */
  ;

  Mat3.exactEquals = function exactEquals(a, b) {
    var am = a.m,
        bm = b.m;
    return am[0] === bm[0] && am[1] === bm[1] && am[2] === bm[2] && am[3] === bm[3] && am[4] === bm[4] && am[5] === bm[5] && am[6] === bm[6] && am[7] === bm[7] && am[8] === bm[8];
  }
  /**
   * Returns whether the specified matrices are approximately equal.
   *
   * @param {Mat3} a - The first matrix.
   * @param {Mat3} b - The second matrix.
   * @returns {Boolean} True if the matrices are equal, false otherwise.
   * @static
   */
  ;

  Mat3.equals = function equals(a, b) {
    var am = a.m,
        bm = b.m;
    var a0 = am[0],
        a1 = am[1],
        a2 = am[2],
        a3 = am[3],
        a4 = am[4],
        a5 = am[5],
        a6 = am[6],
        a7 = am[7],
        a8 = am[8];
    var b0 = bm[0],
        b1 = bm[1],
        b2 = bm[2],
        b3 = bm[3],
        b4 = bm[4],
        b5 = bm[5],
        b6 = bm[6],
        b7 = bm[7],
        b8 = bm[8];
    return Math.abs(a0 - b0) <= _utils.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= _utils.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= _utils.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= _utils.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= _utils.EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= _utils.EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= _utils.EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= _utils.EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= _utils.EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8));
  }
  /**
   * !#zh 矩阵转数组
   * !#en Matrix transpose array
   * @method toArray
   * @typescript
   * toArray <Out extends IWritableArrayLike<number>> (out: Out, mat: IMat3Like, ofs = 0)
   * @param ofs 数组内的起始偏移量
   * @static
   */
  ;

  Mat3.toArray = function toArray(out, mat, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var m = mat.m;

    for (var i = 0; i < 9; i++) {
      out[ofs + i] = m[i];
    }

    return out;
  }
  /**
   * !#zh 数组转矩阵
   * !#en Transfer matrix array
   * @method fromArray
   * @typescript
   * fromArray <Out extends IMat3Like> (out: Out, arr: IWritableArrayLike<number>, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Mat3.fromArray = function fromArray(out, arr, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    var m = out.m;

    for (var i = 0; i < 9; i++) {
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
   * @method constructor
   * @typescript
   * constructor (m00: number | Float32Array = 1, m01 = 0, m02 = 0, m03 = 0, m04 = 1, m05 = 0, m06 = 0, m07 = 0, m08 = 1)
   */
  function Mat3(m00, m01, m02, m03, m04, m05, m06, m07, m08) {
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

    if (m04 === void 0) {
      m04 = 1;
    }

    if (m05 === void 0) {
      m05 = 0;
    }

    if (m06 === void 0) {
      m06 = 0;
    }

    if (m07 === void 0) {
      m07 = 0;
    }

    if (m08 === void 0) {
      m08 = 1;
    }

    this.m = void 0;

    if (m00 instanceof _utils.FLOAT_ARRAY_TYPE) {
      this.m = m00;
    } else {
      this.m = new _utils.FLOAT_ARRAY_TYPE(9);
      var m = this.m;
      /**
       * The element at column 0 row 0.
       * @type {number}
       * */

      m[0] = m00;
      /**
       * The element at column 0 row 1.
       * @type {number}
       * */

      m[1] = m01;
      /**
       * The element at column 0 row 2.
       * @type {number}
       * */

      m[2] = m02;
      /**
       * The element at column 1 row 0.
       * @type {number}
       * */

      m[3] = m03;
      /**
       * The element at column 1 row 1.
       * @type {number}
       * */

      m[4] = m04;
      /**
       * The element at column 1 row 2.
       * @type {number}
       * */

      m[5] = m05;
      /**
       * The element at column 2 row 0.
       * @type {number}
       * */

      m[6] = m06;
      /**
       * The element at column 2 row 1.
       * @type {number}
       * */

      m[7] = m07;
      /**
       * The element at column 2 row 2.
       * @type {number}
       * */

      m[8] = m08;
    }
  }
  /**
   * Returns a string representation of a matrix.
   *
   * @param {Mat3} a - The matrix.
   * @returns {String} String representation of this matrix.
   */


  var _proto = Mat3.prototype;

  _proto.toString = function toString() {
    var am = this.m;
    return "mat3(" + am[0] + ", " + am[1] + ", " + am[2] + ", " + am[3] + ", " + am[4] + ", " + am[5] + ", " + am[6] + ", " + am[7] + ", " + am[8] + ")";
  };

  return Mat3;
}();

exports["default"] = Mat3;
Mat3.sub = Mat3.subtract;
Mat3.mul = Mat3.multiply;
Mat3.IDENTITY = Object.freeze(new Mat3());
cc.Mat3 = Mat3;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1hdDMudHMiXSwibmFtZXMiOlsiTWF0MyIsImNyZWF0ZSIsIm0wMCIsIm0wMSIsIm0wMiIsIm0wMyIsIm0wNCIsIm0wNSIsIm0wNiIsIm0wNyIsIm0wOCIsImNsb25lIiwiYSIsImFtIiwibSIsImNvcHkiLCJvdXQiLCJzZXQiLCJtMTAiLCJtMTEiLCJtMTIiLCJtMjAiLCJtMjEiLCJtMjIiLCJvdXRtIiwiaWRlbnRpdHkiLCJ0cmFuc3Bvc2UiLCJhMDEiLCJhMDIiLCJhMTIiLCJpbnZlcnQiLCJhMDAiLCJhMTAiLCJhMTEiLCJhMjAiLCJhMjEiLCJhMjIiLCJiMDEiLCJiMTEiLCJiMjEiLCJkZXQiLCJhZGpvaW50IiwiZGV0ZXJtaW5hbnQiLCJtdWx0aXBseSIsImIiLCJibSIsImIwMCIsImIwMiIsImIxMCIsImIxMiIsImIyMCIsImIyMiIsIm11bHRpcGx5TWF0NCIsInRyYW5zbGF0ZSIsInYiLCJ4IiwieSIsInJvdGF0ZSIsInJhZCIsInMiLCJNYXRoIiwic2luIiwiYyIsImNvcyIsInNjYWxlIiwiZnJvbU1hdDQiLCJmcm9tVHJhbnNsYXRpb24iLCJmcm9tUm90YXRpb24iLCJmcm9tU2NhbGluZyIsImZyb21RdWF0IiwicSIsInoiLCJ3IiwieDIiLCJ5MiIsInoyIiwieHgiLCJ5eCIsInl5IiwiengiLCJ6eSIsInp6Iiwid3giLCJ3eSIsInd6IiwiZnJvbVZpZXdVcCIsInZpZXciLCJ1cCIsIl9mcm9tVmlld1VwSUlGRSIsImRlZmF1bHRfdXAiLCJWZWMzIiwibGVuZ3RoU3FyIiwiRVBTSUxPTiIsIm5vcm1hbGl6ZSIsImNyb3NzIiwibm9ybWFsRnJvbU1hdDQiLCJhMDMiLCJhMTMiLCJhMjMiLCJhMzAiLCJhMzEiLCJhMzIiLCJhMzMiLCJiMDMiLCJiMDQiLCJiMDUiLCJiMDYiLCJiMDciLCJiMDgiLCJiMDkiLCJmcm9iIiwic3FydCIsInBvdyIsImFkZCIsInN1YnRyYWN0IiwibXVsdGlwbHlTY2FsYXIiLCJtdWx0aXBseVNjYWxhckFuZEFkZCIsImV4YWN0RXF1YWxzIiwiZXF1YWxzIiwiYTAiLCJhMSIsImEyIiwiYTMiLCJhNCIsImE1IiwiYTYiLCJhNyIsImE4IiwiYjAiLCJiMSIsImIyIiwiYjMiLCJiNCIsImI1IiwiYjYiLCJiNyIsImI4IiwiYWJzIiwibWF4IiwidG9BcnJheSIsIm1hdCIsIm9mcyIsImkiLCJmcm9tQXJyYXkiLCJhcnIiLCJGTE9BVF9BUlJBWV9UWVBFIiwidG9TdHJpbmciLCJzdWIiLCJtdWwiLCJJREVOVElUWSIsIk9iamVjdCIsImZyZWV6ZSIsImNjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFLQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwQnFCQTs7O0FBSWpCOzs7Ozs7QUFPQTs7Ozs7Ozs7Ozs7Ozs7O09BZU9DLFNBQVAsZ0JBQWVDLEdBQWYsRUFBZ0NDLEdBQWhDLEVBQWlEQyxHQUFqRCxFQUFrRUMsR0FBbEUsRUFBbUZDLEdBQW5GLEVBQW9HQyxHQUFwRyxFQUFxSEMsR0FBckgsRUFBc0lDLEdBQXRJLEVBQXVKQyxHQUF2SixFQUE4SztBQUFBLFFBQS9KUixHQUErSjtBQUEvSkEsTUFBQUEsR0FBK0osR0FBakosQ0FBaUo7QUFBQTs7QUFBQSxRQUE5SUMsR0FBOEk7QUFBOUlBLE1BQUFBLEdBQThJLEdBQWhJLENBQWdJO0FBQUE7O0FBQUEsUUFBN0hDLEdBQTZIO0FBQTdIQSxNQUFBQSxHQUE2SCxHQUEvRyxDQUErRztBQUFBOztBQUFBLFFBQTVHQyxHQUE0RztBQUE1R0EsTUFBQUEsR0FBNEcsR0FBOUYsQ0FBOEY7QUFBQTs7QUFBQSxRQUEzRkMsR0FBMkY7QUFBM0ZBLE1BQUFBLEdBQTJGLEdBQTdFLENBQTZFO0FBQUE7O0FBQUEsUUFBMUVDLEdBQTBFO0FBQTFFQSxNQUFBQSxHQUEwRSxHQUE1RCxDQUE0RDtBQUFBOztBQUFBLFFBQXpEQyxHQUF5RDtBQUF6REEsTUFBQUEsR0FBeUQsR0FBM0MsQ0FBMkM7QUFBQTs7QUFBQSxRQUF4Q0MsR0FBd0M7QUFBeENB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LENBQUMsQ0FBQ0UsQ0FBWDtBQUFBLFFBQWMrQixFQUFFLEdBQUdELENBQUMsQ0FBQzlCLENBQXJCO0FBQUEsUUFBd0JVLElBQUksR0FBR1IsR0FBRyxDQUFDRixDQUFuQztBQUNBVSxJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0FyQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUWdDLEVBQUUsQ0FBQyxDQUFELENBQXBCO0FBQ0EsV0FBTzdCLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OztPQVNPa0csV0FBUCxrQkFBaUJsRyxHQUFqQixFQUE0QkosQ0FBNUIsRUFBcUNnQyxDQUFyQyxFQUFvRDtBQUNoRCxRQUFJL0IsRUFBRSxHQUFHRCxDQUFDLENBQUNFLENBQVg7QUFBQSxRQUFjK0IsRUFBRSxHQUFHRCxDQUFDLENBQUM5QixDQUFyQjtBQUFBLFFBQXdCVSxJQUFJLEdBQUdSLEdBQUcsQ0FBQ0YsQ0FBbkM7QUFDQVUsSUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVWCxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVFnQyxFQUFFLENBQUMsQ0FBRCxDQUFwQjtBQUNBckIsSUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVWCxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVFnQyxFQUFFLENBQUMsQ0FBRCxDQUFwQjtBQUNBckIsSUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVWCxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVFnQyxFQUFFLENBQUMsQ0FBRCxDQUFwQjtBQUNBckIsSUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVWCxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVFnQyxFQUFFLENBQUMsQ0FBRCxDQUFwQjtBQUNBckIsSUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVWCxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVFnQyxFQUFFLENBQUMsQ0FBRCxDQUFwQjtBQUNBckIsSUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVWCxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVFnQyxFQUFFLENBQUMsQ0FBRCxDQUFwQjtBQUNBckIsSUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVWCxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVFnQyxFQUFFLENBQUMsQ0FBRCxDQUFwQjtBQUNBckIsSUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVWCxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVFnQyxFQUFFLENBQUMsQ0FBRCxDQUFwQjtBQUNBckIsSUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVWCxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVFnQyxFQUFFLENBQUMsQ0FBRCxDQUFwQjtBQUNBLFdBQU83QixHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7T0FTT21HLGlCQUFQLHdCQUF1Qm5HLEdBQXZCLEVBQWtDSixDQUFsQyxFQUEyQ2dDLENBQTNDLEVBQTREO0FBQ3hELFFBQUkvQixFQUFFLEdBQUdELENBQUMsQ0FBQ0UsQ0FBWDtBQUFBLFFBQWNVLElBQUksR0FBR1IsR0FBRyxDQUFDRixDQUF6QjtBQUNBVSxJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUStCLENBQWxCO0FBQ0FwQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUStCLENBQWxCO0FBQ0FwQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUStCLENBQWxCO0FBQ0FwQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUStCLENBQWxCO0FBQ0FwQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUStCLENBQWxCO0FBQ0FwQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUStCLENBQWxCO0FBQ0FwQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUStCLENBQWxCO0FBQ0FwQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUStCLENBQWxCO0FBQ0FwQixJQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVYLEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUStCLENBQWxCO0FBQ0EsV0FBTzVCLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7T0FVT29HLHVCQUFQLDhCQUE2QnBHLEdBQTdCLEVBQXdDSixDQUF4QyxFQUFpRGdDLENBQWpELEVBQTBEb0IsS0FBMUQsRUFBK0U7QUFDM0UsUUFBSW5ELEVBQUUsR0FBR0QsQ0FBQyxDQUFDRSxDQUFYO0FBQUEsUUFBYytCLEVBQUUsR0FBR0QsQ0FBQyxDQUFDOUIsQ0FBckI7QUFBQSxRQUF3QlUsSUFBSSxHQUFHUixHQUFHLENBQUNGLENBQW5DO0FBQ0FVLElBQUFBLElBQUksQ0FBQyxDQUFELENBQUosR0FBVVgsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFTZ0MsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRbUIsS0FBM0I7QUFDQXhDLElBQUFBLElBQUksQ0FBQyxDQUFELENBQUosR0FBVVgsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFTZ0MsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRbUIsS0FBM0I7QUFDQXhDLElBQUFBLElBQUksQ0FBQyxDQUFELENBQUosR0FBVVgsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFTZ0MsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRbUIsS0FBM0I7QUFDQXhDLElBQUFBLElBQUksQ0FBQyxDQUFELENBQUosR0FBVVgsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFTZ0MsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRbUIsS0FBM0I7QUFDQXhDLElBQUFBLElBQUksQ0FBQyxDQUFELENBQUosR0FBVVgsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFTZ0MsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRbUIsS0FBM0I7QUFDQXhDLElBQUFBLElBQUksQ0FBQyxDQUFELENBQUosR0FBVVgsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFTZ0MsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRbUIsS0FBM0I7QUFDQXhDLElBQUFBLElBQUksQ0FBQyxDQUFELENBQUosR0FBVVgsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFTZ0MsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRbUIsS0FBM0I7QUFDQXhDLElBQUFBLElBQUksQ0FBQyxDQUFELENBQUosR0FBVVgsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFTZ0MsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRbUIsS0FBM0I7QUFDQXhDLElBQUFBLElBQUksQ0FBQyxDQUFELENBQUosR0FBVVgsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFTZ0MsRUFBRSxDQUFDLENBQUQsQ0FBRixHQUFRbUIsS0FBM0I7QUFDQSxXQUFPaEQsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7T0FRT3FHLGNBQVAscUJBQW9CekcsQ0FBcEIsRUFBNkJnQyxDQUE3QixFQUErQztBQUMzQyxRQUFJL0IsRUFBRSxHQUFHRCxDQUFDLENBQUNFLENBQVg7QUFBQSxRQUFjK0IsRUFBRSxHQUFHRCxDQUFDLENBQUM5QixDQUFyQjtBQUNBLFdBQU9ELEVBQUUsQ0FBQyxDQUFELENBQUYsS0FBVWdDLEVBQUUsQ0FBQyxDQUFELENBQVosSUFBbUJoQyxFQUFFLENBQUMsQ0FBRCxDQUFGLEtBQVVnQyxFQUFFLENBQUMsQ0FBRCxDQUEvQixJQUFzQ2hDLEVBQUUsQ0FBQyxDQUFELENBQUYsS0FBVWdDLEVBQUUsQ0FBQyxDQUFELENBQWxELElBQ0hoQyxFQUFFLENBQUMsQ0FBRCxDQUFGLEtBQVVnQyxFQUFFLENBQUMsQ0FBRCxDQURULElBQ2dCaEMsRUFBRSxDQUFDLENBQUQsQ0FBRixLQUFVZ0MsRUFBRSxDQUFDLENBQUQsQ0FENUIsSUFDbUNoQyxFQUFFLENBQUMsQ0FBRCxDQUFGLEtBQVVnQyxFQUFFLENBQUMsQ0FBRCxDQUQvQyxJQUVIaEMsRUFBRSxDQUFDLENBQUQsQ0FBRixLQUFVZ0MsRUFBRSxDQUFDLENBQUQsQ0FGVCxJQUVnQmhDLEVBQUUsQ0FBQyxDQUFELENBQUYsS0FBVWdDLEVBQUUsQ0FBQyxDQUFELENBRjVCLElBRW1DaEMsRUFBRSxDQUFDLENBQUQsQ0FBRixLQUFVZ0MsRUFBRSxDQUFDLENBQUQsQ0FGdEQ7QUFHSDtBQUVEOzs7Ozs7Ozs7O09BUU95RSxTQUFQLGdCQUFlMUcsQ0FBZixFQUF3QmdDLENBQXhCLEVBQTBDO0FBQ3RDLFFBQUkvQixFQUFFLEdBQUdELENBQUMsQ0FBQ0UsQ0FBWDtBQUFBLFFBQWMrQixFQUFFLEdBQUdELENBQUMsQ0FBQzlCLENBQXJCO0FBQ0EsUUFBSXlHLEVBQUUsR0FBRzFHLEVBQUUsQ0FBQyxDQUFELENBQVg7QUFBQSxRQUFnQjJHLEVBQUUsR0FBRzNHLEVBQUUsQ0FBQyxDQUFELENBQXZCO0FBQUEsUUFBNEI0RyxFQUFFLEdBQUc1RyxFQUFFLENBQUMsQ0FBRCxDQUFuQztBQUFBLFFBQXdDNkcsRUFBRSxHQUFHN0csRUFBRSxDQUFDLENBQUQsQ0FBL0M7QUFBQSxRQUFvRDhHLEVBQUUsR0FBRzlHLEVBQUUsQ0FBQyxDQUFELENBQTNEO0FBQUEsUUFBZ0UrRyxFQUFFLEdBQUcvRyxFQUFFLENBQUMsQ0FBRCxDQUF2RTtBQUFBLFFBQTRFZ0gsRUFBRSxHQUFHaEgsRUFBRSxDQUFDLENBQUQsQ0FBbkY7QUFBQSxRQUF3RmlILEVBQUUsR0FBR2pILEVBQUUsQ0FBQyxDQUFELENBQS9GO0FBQUEsUUFBb0drSCxFQUFFLEdBQUdsSCxFQUFFLENBQUMsQ0FBRCxDQUEzRztBQUNBLFFBQUltSCxFQUFFLEdBQUduRixFQUFFLENBQUMsQ0FBRCxDQUFYO0FBQUEsUUFBZ0JvRixFQUFFLEdBQUdwRixFQUFFLENBQUMsQ0FBRCxDQUF2QjtBQUFBLFFBQTRCcUYsRUFBRSxHQUFHckYsRUFBRSxDQUFDLENBQUQsQ0FBbkM7QUFBQSxRQUF3Q3NGLEVBQUUsR0FBR3RGLEVBQUUsQ0FBQyxDQUFELENBQS9DO0FBQUEsUUFBb0R1RixFQUFFLEdBQUd2RixFQUFFLENBQUMsQ0FBRCxDQUEzRDtBQUFBLFFBQWdFd0YsRUFBRSxHQUFHeEYsRUFBRSxDQUFDLENBQUQsQ0FBdkU7QUFBQSxRQUE0RXlGLEVBQUUsR0FBR3pGLEVBQUUsQ0FBQyxDQUFELENBQW5GO0FBQUEsUUFBd0YwRixFQUFFLEdBQUcxRixFQUFFLENBQUMsQ0FBRCxDQUEvRjtBQUFBLFFBQW9HMkYsRUFBRSxHQUFHM0YsRUFBRSxDQUFDLENBQUQsQ0FBM0c7QUFDQSxXQUNJZSxJQUFJLENBQUM2RSxHQUFMLENBQVNsQixFQUFFLEdBQUdTLEVBQWQsS0FBcUJwQyxpQkFBVWhDLElBQUksQ0FBQzhFLEdBQUwsQ0FBUyxHQUFULEVBQWM5RSxJQUFJLENBQUM2RSxHQUFMLENBQVNsQixFQUFULENBQWQsRUFBNEIzRCxJQUFJLENBQUM2RSxHQUFMLENBQVNULEVBQVQsQ0FBNUIsQ0FBL0IsSUFDQXBFLElBQUksQ0FBQzZFLEdBQUwsQ0FBU2pCLEVBQUUsR0FBR1MsRUFBZCxLQUFxQnJDLGlCQUFVaEMsSUFBSSxDQUFDOEUsR0FBTCxDQUFTLEdBQVQsRUFBYzlFLElBQUksQ0FBQzZFLEdBQUwsQ0FBU2pCLEVBQVQsQ0FBZCxFQUE0QjVELElBQUksQ0FBQzZFLEdBQUwsQ0FBU1IsRUFBVCxDQUE1QixDQUQvQixJQUVBckUsSUFBSSxDQUFDNkUsR0FBTCxDQUFTaEIsRUFBRSxHQUFHUyxFQUFkLEtBQXFCdEMsaUJBQVVoQyxJQUFJLENBQUM4RSxHQUFMLENBQVMsR0FBVCxFQUFjOUUsSUFBSSxDQUFDNkUsR0FBTCxDQUFTaEIsRUFBVCxDQUFkLEVBQTRCN0QsSUFBSSxDQUFDNkUsR0FBTCxDQUFTUCxFQUFULENBQTVCLENBRi9CLElBR0F0RSxJQUFJLENBQUM2RSxHQUFMLENBQVNmLEVBQUUsR0FBR1MsRUFBZCxLQUFxQnZDLGlCQUFVaEMsSUFBSSxDQUFDOEUsR0FBTCxDQUFTLEdBQVQsRUFBYzlFLElBQUksQ0FBQzZFLEdBQUwsQ0FBU2YsRUFBVCxDQUFkLEVBQTRCOUQsSUFBSSxDQUFDNkUsR0FBTCxDQUFTTixFQUFULENBQTVCLENBSC9CLElBSUF2RSxJQUFJLENBQUM2RSxHQUFMLENBQVNkLEVBQUUsR0FBR1MsRUFBZCxLQUFxQnhDLGlCQUFVaEMsSUFBSSxDQUFDOEUsR0FBTCxDQUFTLEdBQVQsRUFBYzlFLElBQUksQ0FBQzZFLEdBQUwsQ0FBU2QsRUFBVCxDQUFkLEVBQTRCL0QsSUFBSSxDQUFDNkUsR0FBTCxDQUFTTCxFQUFULENBQTVCLENBSi9CLElBS0F4RSxJQUFJLENBQUM2RSxHQUFMLENBQVNiLEVBQUUsR0FBR1MsRUFBZCxLQUFxQnpDLGlCQUFVaEMsSUFBSSxDQUFDOEUsR0FBTCxDQUFTLEdBQVQsRUFBYzlFLElBQUksQ0FBQzZFLEdBQUwsQ0FBU2IsRUFBVCxDQUFkLEVBQTRCaEUsSUFBSSxDQUFDNkUsR0FBTCxDQUFTSixFQUFULENBQTVCLENBTC9CLElBTUF6RSxJQUFJLENBQUM2RSxHQUFMLENBQVNaLEVBQUUsR0FBR1MsRUFBZCxLQUFxQjFDLGlCQUFVaEMsSUFBSSxDQUFDOEUsR0FBTCxDQUFTLEdBQVQsRUFBYzlFLElBQUksQ0FBQzZFLEdBQUwsQ0FBU1osRUFBVCxDQUFkLEVBQTRCakUsSUFBSSxDQUFDNkUsR0FBTCxDQUFTSCxFQUFULENBQTVCLENBTi9CLElBT0ExRSxJQUFJLENBQUM2RSxHQUFMLENBQVNYLEVBQUUsR0FBR1MsRUFBZCxLQUFxQjNDLGlCQUFVaEMsSUFBSSxDQUFDOEUsR0FBTCxDQUFTLEdBQVQsRUFBYzlFLElBQUksQ0FBQzZFLEdBQUwsQ0FBU1gsRUFBVCxDQUFkLEVBQTRCbEUsSUFBSSxDQUFDNkUsR0FBTCxDQUFTRixFQUFULENBQTVCLENBUC9CLElBUUEzRSxJQUFJLENBQUM2RSxHQUFMLENBQVNWLEVBQUUsR0FBR1MsRUFBZCxLQUFxQjVDLGlCQUFVaEMsSUFBSSxDQUFDOEUsR0FBTCxDQUFTLEdBQVQsRUFBYzlFLElBQUksQ0FBQzZFLEdBQUwsQ0FBU1YsRUFBVCxDQUFkLEVBQTRCbkUsSUFBSSxDQUFDNkUsR0FBTCxDQUFTRCxFQUFULENBQTVCLENBVG5DO0FBV0g7QUFFRDs7Ozs7Ozs7Ozs7T0FTT0csVUFBUCxpQkFBeUQzSCxHQUF6RCxFQUFtRTRILEdBQW5FLEVBQW1GQyxHQUFuRixFQUE0RjtBQUFBLFFBQVRBLEdBQVM7QUFBVEEsTUFBQUEsR0FBUyxHQUFILENBQUc7QUFBQTs7QUFDeEYsUUFBSS9ILENBQUMsR0FBRzhILEdBQUcsQ0FBQzlILENBQVo7O0FBQ0EsU0FBSyxJQUFJZ0ksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxDQUFwQixFQUF1QkEsQ0FBQyxFQUF4QixFQUE0QjtBQUN4QjlILE1BQUFBLEdBQUcsQ0FBQzZILEdBQUcsR0FBR0MsQ0FBUCxDQUFILEdBQWVoSSxDQUFDLENBQUNnSSxDQUFELENBQWhCO0FBQ0g7O0FBQ0QsV0FBTzlILEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OztPQVNPK0gsWUFBUCxtQkFBMEMvSCxHQUExQyxFQUFvRGdJLEdBQXBELEVBQXFGSCxHQUFyRixFQUE4RjtBQUFBLFFBQVRBLEdBQVM7QUFBVEEsTUFBQUEsR0FBUyxHQUFILENBQUc7QUFBQTs7QUFDMUYsUUFBSS9ILENBQUMsR0FBR0UsR0FBRyxDQUFDRixDQUFaOztBQUNBLFNBQUssSUFBSWdJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsQ0FBcEIsRUFBdUJBLENBQUMsRUFBeEIsRUFBNEI7QUFDeEJoSSxNQUFBQSxDQUFDLENBQUNnSSxDQUFELENBQUQsR0FBT0UsR0FBRyxDQUFDSCxHQUFHLEdBQUdDLENBQVAsQ0FBVjtBQUNIOztBQUNELFdBQU85SCxHQUFQO0FBQ0g7QUFFRDs7Ozs7OztBQVFBOzs7OztBQUtBLGdCQUNJZCxHQURKLEVBQ2tDQyxHQURsQyxFQUMyQ0MsR0FEM0MsRUFFSUMsR0FGSixFQUVhQyxHQUZiLEVBRXNCQyxHQUZ0QixFQUdJQyxHQUhKLEVBR2FDLEdBSGIsRUFHc0JDLEdBSHRCLEVBSUU7QUFBQSxRQUhFUixHQUdGO0FBSEVBLE1BQUFBLEdBR0YsR0FINkIsQ0FHN0I7QUFBQTs7QUFBQSxRQUhnQ0MsR0FHaEM7QUFIZ0NBLE1BQUFBLEdBR2hDLEdBSHNDLENBR3RDO0FBQUE7O0FBQUEsUUFIeUNDLEdBR3pDO0FBSHlDQSxNQUFBQSxHQUd6QyxHQUgrQyxDQUcvQztBQUFBOztBQUFBLFFBRkVDLEdBRUY7QUFGRUEsTUFBQUEsR0FFRixHQUZRLENBRVI7QUFBQTs7QUFBQSxRQUZXQyxHQUVYO0FBRldBLE1BQUFBLEdBRVgsR0FGaUIsQ0FFakI7QUFBQTs7QUFBQSxRQUZvQkMsR0FFcEI7QUFGb0JBLE1BQUFBLEdBRXBCLEdBRjBCLENBRTFCO0FBQUE7O0FBQUEsUUFERUMsR0FDRjtBQURFQSxNQUFBQSxHQUNGLEdBRFEsQ0FDUjtBQUFBOztBQUFBLFFBRFdDLEdBQ1g7QUFEV0EsTUFBQUEsR0FDWCxHQURpQixDQUNqQjtBQUFBOztBQUFBLFFBRG9CQyxHQUNwQjtBQURvQkEsTUFBQUEsR0FDcEIsR0FEMEIsQ0FDMUI7QUFBQTs7QUFBQSxTQVpGSSxDQVlFOztBQUNFLFFBQUlaLEdBQUcsWUFBWStJLHVCQUFuQixFQUFxQztBQUNqQyxXQUFLbkksQ0FBTCxHQUFTWixHQUFUO0FBQ0gsS0FGRCxNQUVPO0FBQ0gsV0FBS1ksQ0FBTCxHQUFTLElBQUltSSx1QkFBSixDQUFxQixDQUFyQixDQUFUO0FBQ0EsVUFBSW5JLENBQUMsR0FBRyxLQUFLQSxDQUFiO0FBQ0E7Ozs7O0FBSUFBLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1osR0FBUDtBQUVBOzs7OztBQUlBWSxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9YLEdBQVA7QUFFQTs7Ozs7QUFJQVcsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPVixHQUFQO0FBRUE7Ozs7O0FBSUFVLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT1QsR0FBUDtBQUVBOzs7OztBQUlBUyxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9SLEdBQVA7QUFFQTs7Ozs7QUFJQVEsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPUCxHQUFQO0FBRUE7Ozs7O0FBSUFPLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT04sR0FBUDtBQUVBOzs7OztBQUlBTSxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9MLEdBQVA7QUFFQTs7Ozs7QUFJQUssTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPSixHQUFQO0FBQ0g7QUFDSjtBQUdEOzs7Ozs7Ozs7O1NBTUF3SSxXQUFBLG9CQUFZO0FBQ1IsUUFBSXJJLEVBQUUsR0FBRyxLQUFLQyxDQUFkO0FBQ0EscUJBQWVELEVBQUUsQ0FBQyxDQUFELENBQWpCLFVBQXlCQSxFQUFFLENBQUMsQ0FBRCxDQUEzQixVQUFtQ0EsRUFBRSxDQUFDLENBQUQsQ0FBckMsVUFBNkNBLEVBQUUsQ0FBQyxDQUFELENBQS9DLFVBQXVEQSxFQUFFLENBQUMsQ0FBRCxDQUF6RCxVQUFpRUEsRUFBRSxDQUFDLENBQUQsQ0FBbkUsVUFBMkVBLEVBQUUsQ0FBQyxDQUFELENBQTdFLFVBQXFGQSxFQUFFLENBQUMsQ0FBRCxDQUF2RixVQUErRkEsRUFBRSxDQUFDLENBQUQsQ0FBakc7QUFDSDs7Ozs7O0FBdDNCZ0JiLEtBQ1ZtSixNQUFNbkosSUFBSSxDQUFDa0g7QUFERGxILEtBRVZvSixNQUFNcEosSUFBSSxDQUFDMkM7QUFGRDNDLEtBU1ZxSixXQUFXQyxNQUFNLENBQUNDLE1BQVAsQ0FBYyxJQUFJdkosSUFBSixFQUFkO0FBZzNCdEJ3SixFQUFFLENBQUN4SixJQUFILEdBQVVBLElBQVYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFUFNJTE9OLCBGTE9BVF9BUlJBWV9UWVBFIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMvdXRpbHMnO1xuaW1wb3J0IFZlYzMgZnJvbSAnLi92ZWMzJztcbmltcG9ydCBWZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgTWF0NCBmcm9tICcuL21hdDQnO1xuaW1wb3J0IFF1YXQgZnJvbSAnLi9xdWF0JztcblxuLyoqXG4gKiBNYXRoZW1hdGljYWwgM3gzIG1hdHJpeC5cbiAqXG4gKiBOT1RFOiB3ZSB1c2UgY29sdW1uLW1ham9yIG1hdHJpeCBmb3IgYWxsIG1hdHJpeCBjYWxjdWxhdGlvbi5cbiAqXG4gKiBUaGlzIG1heSBsZWFkIHRvIHNvbWUgY29uZnVzaW9uIHdoZW4gcmVmZXJlbmNpbmcgT3BlbkdMIGRvY3VtZW50YXRpb24sXG4gKiBob3dldmVyLCB3aGljaCByZXByZXNlbnRzIG91dCBhbGwgbWF0cmljaWVzIGluIGNvbHVtbi1tYWpvciBmb3JtYXQuXG4gKiBUaGlzIG1lYW5zIHRoYXQgd2hpbGUgaW4gY29kZSBhIG1hdHJpeCBtYXkgYmUgdHlwZWQgb3V0IGFzOlxuICpcbiAqIFsxLCAwLCAwLCAwLFxuICogIDAsIDEsIDAsIDAsXG4gKiAgMCwgMCwgMSwgMCxcbiAqICB4LCB5LCB6LCAwXVxuICpcbiAqIFRoZSBzYW1lIG1hdHJpeCBpbiB0aGUgW09wZW5HTCBkb2N1bWVudGF0aW9uXShodHRwczovL3d3dy5raHJvbm9zLm9yZy9yZWdpc3RyeS9PcGVuR0wtUmVmcGFnZXMvZ2wyLjEveGh0bWwvZ2xUcmFuc2xhdGUueG1sKVxuICogaXMgd3JpdHRlbiBhczpcbiAqXG4gKiAgMSAwIDAgeFxuICogIDAgMSAwIHlcbiAqICAwIDAgMSB6XG4gKiAgMCAwIDAgMFxuICpcbiAqIFBsZWFzZSByZXN0IGFzc3VyZWQsIGhvd2V2ZXIsIHRoYXQgdGhleSBhcmUgdGhlIHNhbWUgdGhpbmchXG4gKiBUaGlzIGlzIG5vdCB1bmlxdWUgdG8gZ2xNYXRyaXgsIGVpdGhlciwgYXMgT3BlbkdMIGRldmVsb3BlcnMgaGF2ZSBsb25nIGJlZW4gY29uZnVzZWQgYnkgdGhlXG4gKiBhcHBhcmVudCBsYWNrIG9mIGNvbnNpc3RlbmN5IGJldHdlZW4gdGhlIG1lbW9yeSBsYXlvdXQgYW5kIHRoZSBkb2N1bWVudGF0aW9uLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXQzIHtcbiAgICBzdGF0aWMgc3ViID0gTWF0My5zdWJ0cmFjdDtcbiAgICBzdGF0aWMgbXVsID0gTWF0My5tdWx0aXBseTtcbiAgICBcbiAgICAvKipcbiAgICAgKiBJZGVudGl0eSAgb2YgTWF0M1xuICAgICAqIEBwcm9wZXJ0eSB7TWF0M30gSURFTlRJVFlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIElERU5USVRZID0gT2JqZWN0LmZyZWV6ZShuZXcgTWF0MygpKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBtYXRyaXgsIHdpdGggZWxlbWVudHMgc3BlY2lmaWVkIHNlcGFyYXRlbHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTAwIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMCByb3cgMC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTAxIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMCByb3cgMS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTAyIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMCByb3cgMi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTAzIC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTA0IC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTA1IC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMi5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTA2IC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTA3IC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbTA4IC0gVmFsdWUgYXNzaWduZWQgdG8gZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMi5cbiAgICAgKiBAcmV0dXJucyB7TWF0M30gVGhlIG5ld2x5IGNyZWF0ZWQgbWF0cml4LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlIChtMDA6IG51bWJlciA9IDEsIG0wMTogbnVtYmVyID0gMCwgbTAyOiBudW1iZXIgPSAwLCBtMDM6IG51bWJlciA9IDAsIG0wNDogbnVtYmVyID0gMSwgbTA1OiBudW1iZXIgPSAwLCBtMDY6IG51bWJlciA9IDAsIG0wNzogbnVtYmVyID0gMCwgbTA4OiBudW1iZXIgPSAxKTogTWF0MyB7XG4gICAgICAgIHJldHVybiBuZXcgTWF0MyhtMDAsIG0wMSwgbTAyLCBtMDMsIG0wNCwgbTA1LCBtMDYsIG0wNywgbTA4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9uZSBhIG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIE1hdHJpeCB0byBjbG9uZS5cbiAgICAgKiBAcmV0dXJucyB7TWF0M30gVGhlIG5ld2x5IGNyZWF0ZWQgbWF0cml4LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgY2xvbmUgKGE6IE1hdDMpOiBNYXQzIHtcbiAgICAgICAgbGV0IGFtID0gYS5tO1xuICAgICAgICByZXR1cm4gbmV3IE1hdDMoXG4gICAgICAgICAgICBhbVswXSwgYW1bMV0sIGFtWzJdLFxuICAgICAgICAgICAgYW1bM10sIGFtWzRdLCBhbVs1XSxcbiAgICAgICAgICAgIGFtWzZdLCBhbVs3XSwgYW1bOF1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb3B5IGNvbnRlbnQgb2YgYSBtYXRyaXggaW50byBhbm90aGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gbW9kaWZpZWQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gVGhlIHNwZWNpZmllZCBtYXRyaXguXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNvcHkgKG91dDogTWF0MywgYTogTWF0Myk6IE1hdDMge1xuICAgICAgICBvdXQubS5zZXQoYS5tKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBlbGVtZW50cyBvZiBhIG1hdHJpeCB0byB0aGUgZ2l2ZW4gdmFsdWVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBUaGUgbWF0cml4IHRvIG1vZGlmaWVkLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtMDAgLSBWYWx1ZSBhc3NpZ25lZCB0byBlbGVtZW50IGF0IGNvbHVtbiAwIHJvdyAwLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtMDEgLSBWYWx1ZSBhc3NpZ25lZCB0byBlbGVtZW50IGF0IGNvbHVtbiAwIHJvdyAxLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtMDIgLSBWYWx1ZSBhc3NpZ25lZCB0byBlbGVtZW50IGF0IGNvbHVtbiAwIHJvdyAyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtMTAgLSBWYWx1ZSBhc3NpZ25lZCB0byBlbGVtZW50IGF0IGNvbHVtbiAxIHJvdyAwLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtMTEgLSBWYWx1ZSBhc3NpZ25lZCB0byBlbGVtZW50IGF0IGNvbHVtbiAxIHJvdyAxLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtMTIgLSBWYWx1ZSBhc3NpZ25lZCB0byBlbGVtZW50IGF0IGNvbHVtbiAxIHJvdyAyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtMjAgLSBWYWx1ZSBhc3NpZ25lZCB0byBlbGVtZW50IGF0IGNvbHVtbiAyIHJvdyAwLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtMjEgLSBWYWx1ZSBhc3NpZ25lZCB0byBlbGVtZW50IGF0IGNvbHVtbiAyIHJvdyAxLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtMjIgLSBWYWx1ZSBhc3NpZ25lZCB0byBlbGVtZW50IGF0IGNvbHVtbiAyIHJvdyAyLlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBzZXQgKG91dDogTWF0MywgbTAwOiBudW1iZXIsIG0wMTogbnVtYmVyLCBtMDI6IG51bWJlciwgbTEwOiBudW1iZXIsIG0xMTogbnVtYmVyLCBtMTI6IG51bWJlciwgbTIwOiBudW1iZXIsIG0yMTogbnVtYmVyLCBtMjI6IG51bWJlcik6IE1hdDMge1xuICAgICAgICBsZXQgb3V0bSA9IG91dC5tO1xuICAgICAgICBvdXRtWzBdID0gbTAwO1xuICAgICAgICBvdXRtWzFdID0gbTAxO1xuICAgICAgICBvdXRtWzJdID0gbTAyO1xuICAgICAgICBvdXRtWzNdID0gbTEwO1xuICAgICAgICBvdXRtWzRdID0gbTExO1xuICAgICAgICBvdXRtWzVdID0gbTEyO1xuICAgICAgICBvdXRtWzZdID0gbTIwO1xuICAgICAgICBvdXRtWzddID0gbTIxO1xuICAgICAgICBvdXRtWzhdID0gbTIyO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybiBhbiBpZGVudGl0eSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgaWRlbnRpdHkgKG91dDogTWF0Myk6IE1hdDMge1xuICAgICAgICBsZXQgb3V0bSA9IG91dC5tO1xuICAgICAgICBvdXRtWzBdID0gMTtcbiAgICAgICAgb3V0bVsxXSA9IDA7XG4gICAgICAgIG91dG1bMl0gPSAwO1xuICAgICAgICBvdXRtWzNdID0gMDtcbiAgICAgICAgb3V0bVs0XSA9IDE7XG4gICAgICAgIG91dG1bNV0gPSAwO1xuICAgICAgICBvdXRtWzZdID0gMDtcbiAgICAgICAgb3V0bVs3XSA9IDA7XG4gICAgICAgIG91dG1bOF0gPSAxO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRyYW5zcG9zZXMgYSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gTWF0cml4IHRvIHRyYW5zcG9zZS5cbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgdHJhbnNwb3NlIChvdXQ6IE1hdDMsIGE6IE1hdDMpOiBNYXQzIHtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBvdXRtID0gb3V0Lm07XG4gICAgICAgIC8vIElmIHdlIGFyZSB0cmFuc3Bvc2luZyBvdXJzZWx2ZXMgd2UgY2FuIHNraXAgYSBmZXcgc3RlcHMgYnV0IGhhdmUgdG8gY2FjaGUgc29tZSB2YWx1ZXNcbiAgICAgICAgaWYgKG91dCA9PT0gYSkge1xuICAgICAgICAgICAgbGV0IGEwMSA9IGFtWzFdLCBhMDIgPSBhbVsyXSwgYTEyID0gYW1bNV07XG4gICAgICAgICAgICBvdXRtWzFdID0gYW1bM107XG4gICAgICAgICAgICBvdXRtWzJdID0gYW1bNl07XG4gICAgICAgICAgICBvdXRtWzNdID0gYTAxO1xuICAgICAgICAgICAgb3V0bVs1XSA9IGFtWzddO1xuICAgICAgICAgICAgb3V0bVs2XSA9IGEwMjtcbiAgICAgICAgICAgIG91dG1bN10gPSBhMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRtWzBdID0gYW1bMF07XG4gICAgICAgICAgICBvdXRtWzFdID0gYW1bM107XG4gICAgICAgICAgICBvdXRtWzJdID0gYW1bNl07XG4gICAgICAgICAgICBvdXRtWzNdID0gYW1bMV07XG4gICAgICAgICAgICBvdXRtWzRdID0gYW1bNF07XG4gICAgICAgICAgICBvdXRtWzVdID0gYW1bN107XG4gICAgICAgICAgICBvdXRtWzZdID0gYW1bMl07XG4gICAgICAgICAgICBvdXRtWzddID0gYW1bNV07XG4gICAgICAgICAgICBvdXRtWzhdID0gYW1bOF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEludmVydHMgYSBtYXRyaXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gTWF0cml4IHRvIGludmVydC5cbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgaW52ZXJ0IChvdXQ6IE1hdDMsIGE6IE1hdDMpOiBNYXQzIHtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBvdXRtID0gb3V0Lm07XG4gICAgICAgIGxldCBhMDAgPSBhbVswXSwgYTAxID0gYW1bMV0sIGEwMiA9IGFtWzJdLFxuICAgICAgICAgICAgYTEwID0gYW1bM10sIGExMSA9IGFtWzRdLCBhMTIgPSBhbVs1XSxcbiAgICAgICAgICAgIGEyMCA9IGFtWzZdLCBhMjEgPSBhbVs3XSwgYTIyID0gYW1bOF07XG5cbiAgICAgICAgbGV0IGIwMSA9IGEyMiAqIGExMSAtIGExMiAqIGEyMTtcbiAgICAgICAgbGV0IGIxMSA9IC1hMjIgKiBhMTAgKyBhMTIgKiBhMjA7XG4gICAgICAgIGxldCBiMjEgPSBhMjEgKiBhMTAgLSBhMTEgKiBhMjA7XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBkZXRlcm1pbmFudFxuICAgICAgICBsZXQgZGV0ID0gYTAwICogYjAxICsgYTAxICogYjExICsgYTAyICogYjIxO1xuXG4gICAgICAgIGlmICghZGV0KSB7XG4gICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICB9XG4gICAgICAgIGRldCA9IDEuMCAvIGRldDtcblxuICAgICAgICBvdXRtWzBdID0gYjAxICogZGV0O1xuICAgICAgICBvdXRtWzFdID0gKC1hMjIgKiBhMDEgKyBhMDIgKiBhMjEpICogZGV0O1xuICAgICAgICBvdXRtWzJdID0gKGExMiAqIGEwMSAtIGEwMiAqIGExMSkgKiBkZXQ7XG4gICAgICAgIG91dG1bM10gPSBiMTEgKiBkZXQ7XG4gICAgICAgIG91dG1bNF0gPSAoYTIyICogYTAwIC0gYTAyICogYTIwKSAqIGRldDtcbiAgICAgICAgb3V0bVs1XSA9ICgtYTEyICogYTAwICsgYTAyICogYTEwKSAqIGRldDtcbiAgICAgICAgb3V0bVs2XSA9IGIyMSAqIGRldDtcbiAgICAgICAgb3V0bVs3XSA9ICgtYTIxICogYTAwICsgYTAxICogYTIwKSAqIGRldDtcbiAgICAgICAgb3V0bVs4XSA9IChhMTEgKiBhMDAgLSBhMDEgKiBhMTApICogZGV0O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIGFkanVnYXRlIG9mIGEgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIE1hdHJpeCB0byBjYWxjdWxhdGUuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGFkam9pbnQgKG91dDogTWF0MywgYTogTWF0Myk6IE1hdDMge1xuICAgICAgICBsZXQgYW0gPSBhLm0sIG91dG0gPSBvdXQubTtcbiAgICAgICAgbGV0IGEwMCA9IGFtWzBdLCBhMDEgPSBhbVsxXSwgYTAyID0gYW1bMl0sXG4gICAgICAgICAgICBhMTAgPSBhbVszXSwgYTExID0gYW1bNF0sIGExMiA9IGFtWzVdLFxuICAgICAgICAgICAgYTIwID0gYW1bNl0sIGEyMSA9IGFtWzddLCBhMjIgPSBhbVs4XTtcblxuICAgICAgICBvdXRtWzBdID0gKGExMSAqIGEyMiAtIGExMiAqIGEyMSk7XG4gICAgICAgIG91dG1bMV0gPSAoYTAyICogYTIxIC0gYTAxICogYTIyKTtcbiAgICAgICAgb3V0bVsyXSA9IChhMDEgKiBhMTIgLSBhMDIgKiBhMTEpO1xuICAgICAgICBvdXRtWzNdID0gKGExMiAqIGEyMCAtIGExMCAqIGEyMik7XG4gICAgICAgIG91dG1bNF0gPSAoYTAwICogYTIyIC0gYTAyICogYTIwKTtcbiAgICAgICAgb3V0bVs1XSA9IChhMDIgKiBhMTAgLSBhMDAgKiBhMTIpO1xuICAgICAgICBvdXRtWzZdID0gKGExMCAqIGEyMSAtIGExMSAqIGEyMCk7XG4gICAgICAgIG91dG1bN10gPSAoYTAxICogYTIwIC0gYTAwICogYTIxKTtcbiAgICAgICAgb3V0bVs4XSA9IChhMDAgKiBhMTEgLSBhMDEgKiBhMTApO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIGRldGVybWluYW50IG9mIGEgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gTWF0cml4IHRvIGNhbGN1bGF0ZS5cbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfSBEZXRlcm1pbmFudCBvZiBhLlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZGV0ZXJtaW5hbnQgKGE6IE1hdDMpOiBudW1iZXIge1xuICAgICAgICBsZXQgYW0gPSBhLm07XG4gICAgICAgIGxldCBhMDAgPSBhbVswXSwgYTAxID0gYW1bMV0sIGEwMiA9IGFtWzJdLFxuICAgICAgICAgICAgYTEwID0gYW1bM10sIGExMSA9IGFtWzRdLCBhMTIgPSBhbVs1XSxcbiAgICAgICAgICAgIGEyMCA9IGFtWzZdLCBhMjEgPSBhbVs3XSwgYTIyID0gYW1bOF07XG5cbiAgICAgICAgcmV0dXJuIGEwMCAqIChhMjIgKiBhMTEgLSBhMTIgKiBhMjEpICsgYTAxICogKC1hMjIgKiBhMTAgKyBhMTIgKiBhMjApICsgYTAyICogKGEyMSAqIGExMCAtIGExMSAqIGEyMCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTXVsdGlwbHkgdHdvIG1hdHJpY2VzIGV4cGxpY2l0bHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gVGhlIGZpcnN0IG9wZXJhbmQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBiIC0gVGhlIHNlY29uZCBvcGVyYW5kLlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtdWx0aXBseSAob3V0OiBNYXQzLCBhOiBNYXQzLCBiOiBNYXQzKTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgYm0gPSBiLm0sIG91dG0gPSBvdXQubTtcbiAgICAgICAgbGV0IGEwMCA9IGFtWzBdLCBhMDEgPSBhbVsxXSwgYTAyID0gYW1bMl0sXG4gICAgICAgICAgICBhMTAgPSBhbVszXSwgYTExID0gYW1bNF0sIGExMiA9IGFtWzVdLFxuICAgICAgICAgICAgYTIwID0gYW1bNl0sIGEyMSA9IGFtWzddLCBhMjIgPSBhbVs4XTtcblxuICAgICAgICBsZXQgYjAwID0gYm1bMF0sIGIwMSA9IGJtWzFdLCBiMDIgPSBibVsyXTtcbiAgICAgICAgbGV0IGIxMCA9IGJtWzNdLCBiMTEgPSBibVs0XSwgYjEyID0gYm1bNV07XG4gICAgICAgIGxldCBiMjAgPSBibVs2XSwgYjIxID0gYm1bN10sIGIyMiA9IGJtWzhdO1xuXG4gICAgICAgIG91dG1bMF0gPSBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjA7XG4gICAgICAgIG91dG1bMV0gPSBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjE7XG4gICAgICAgIG91dG1bMl0gPSBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjI7XG5cbiAgICAgICAgb3V0bVszXSA9IGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMDtcbiAgICAgICAgb3V0bVs0XSA9IGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMTtcbiAgICAgICAgb3V0bVs1XSA9IGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMjtcblxuICAgICAgICBvdXRtWzZdID0gYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwO1xuICAgICAgICBvdXRtWzddID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xuICAgICAgICBvdXRtWzhdID0gYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gVGFrZSB0aGUgZmlyc3QgdGhpcmQgb3JkZXIgb2YgdGhlIGZvdXJ0aCBvcmRlciBtYXRyaXggYW5kIG11bHRpcGx5IGJ5IHRoZSB0aGlyZCBvcmRlciBtYXRyaXhcbiAgICAgKiAhI3poIOWPluWbm+mYtuefqemYteeahOWJjeS4iemYtu+8jOS4juS4iemYtuefqemYteebuOS5mFxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIHN0b3JlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge01hdDN9IGEgLSBUaGUgZmlyc3Qgb3BlcmFuZC5cbiAgICAgKiBAcGFyYW0ge01hdDN9IGIgLSBUaGUgc2Vjb25kIG9wZXJhbmQuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5TWF0NCA8T3V0IGV4dGVuZHMgSU1hdDNMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogSU1hdDRMaWtlKSB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgYm0gPSBiLm0sIG91dG0gPSBvdXQubTtcbiAgICAgICAgbGV0IGEwMCA9IGFtWzBdLCBhMDEgPSBhbVsxXSwgYTAyID0gYW1bMl0sXG4gICAgICAgICAgICBhMTAgPSBhbVszXSwgYTExID0gYW1bNF0sIGExMiA9IGFtWzVdLFxuICAgICAgICAgICAgYTIwID0gYW1bNl0sIGEyMSA9IGFtWzddLCBhMjIgPSBhbVs4XTtcblxuICAgICAgICBjb25zdCBiMDAgPSBibVswXSwgYjAxID0gYm1bMV0sIGIwMiA9IGJtWzJdO1xuICAgICAgICBjb25zdCBiMTAgPSBibVs0XSwgYjExID0gYm1bNV0sIGIxMiA9IGJtWzZdO1xuICAgICAgICBjb25zdCBiMjAgPSBibVs4XSwgYjIxID0gYm1bOV0sIGIyMiA9IGJtWzEwXTtcblxuICAgICAgICBvdXRtWzBdID0gYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwO1xuICAgICAgICBvdXRtWzFdID0gYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxO1xuICAgICAgICBvdXRtWzJdID0gYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyO1xuICAgICAgICBvdXRtWzNdID0gYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwO1xuICAgICAgICBvdXRtWzRdID0gYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxO1xuICAgICAgICBvdXRtWzVdID0gYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyO1xuICAgICAgICBvdXRtWzZdID0gYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwO1xuICAgICAgICBvdXRtWzddID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xuICAgICAgICBvdXRtWzhdID0gYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE11bHRpcGx5IGEgbWF0cml4IHdpdGggYSB0cmFuc2xhdGlvbiBtYXRyaXggZ2l2ZW4gYnkgYSB0cmFuc2xhdGlvbiBvZmZzZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gTWF0cml4IHRvIG11bHRpcGx5LlxuICAgICAqIEBwYXJhbSB7dmVjMn0gdiAtIFRoZSB0cmFuc2xhdGlvbiBvZmZzZXQuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRyYW5zbGF0ZSAob3V0OiBNYXQzLCBhOiBNYXQzLCB2OiBWZWMyKTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgb3V0bSA9IG91dC5tO1xuICAgICAgICBsZXQgYTAwID0gYW1bMF0sIGEwMSA9IGFtWzFdLCBhMDIgPSBhbVsyXSxcbiAgICAgICAgICAgIGExMCA9IGFtWzNdLCBhMTEgPSBhbVs0XSwgYTEyID0gYW1bNV0sXG4gICAgICAgICAgICBhMjAgPSBhbVs2XSwgYTIxID0gYW1bN10sIGEyMiA9IGFtWzhdO1xuICAgICAgICBsZXQgeCA9IHYueCwgeSA9IHYueTtcblxuICAgICAgICBvdXRtWzBdID0gYTAwO1xuICAgICAgICBvdXRtWzFdID0gYTAxO1xuICAgICAgICBvdXRtWzJdID0gYTAyO1xuXG4gICAgICAgIG91dG1bM10gPSBhMTA7XG4gICAgICAgIG91dG1bNF0gPSBhMTE7XG4gICAgICAgIG91dG1bNV0gPSBhMTI7XG5cbiAgICAgICAgb3V0bVs2XSA9IHggKiBhMDAgKyB5ICogYTEwICsgYTIwO1xuICAgICAgICBvdXRtWzddID0geCAqIGEwMSArIHkgKiBhMTEgKyBhMjE7XG4gICAgICAgIG91dG1bOF0gPSB4ICogYTAyICsgeSAqIGExMiArIGEyMjtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSb3RhdGVzIGEgbWF0cml4IGJ5IHRoZSBnaXZlbiBhbmdsZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIHN0b3JlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge01hdDN9IGEgLSBNYXRyaXggdG8gcm90YXRlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgLSBUaGUgcm90YXRpb24gYW5nbGUuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcm90YXRlIChvdXQ6IE1hdDMsIGE6IE1hdDMsIHJhZDogbnVtYmVyKTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgb3V0bSA9IG91dC5tO1xuICAgICAgICBsZXQgYTAwID0gYW1bMF0sIGEwMSA9IGFtWzFdLCBhMDIgPSBhbVsyXSxcbiAgICAgICAgICAgIGExMCA9IGFtWzNdLCBhMTEgPSBhbVs0XSwgYTEyID0gYW1bNV0sXG4gICAgICAgICAgICBhMjAgPSBhbVs2XSwgYTIxID0gYW1bN10sIGEyMiA9IGFtWzhdO1xuXG4gICAgICAgIGxldCBzID0gTWF0aC5zaW4ocmFkKTtcbiAgICAgICAgbGV0IGMgPSBNYXRoLmNvcyhyYWQpO1xuXG4gICAgICAgIG91dG1bMF0gPSBjICogYTAwICsgcyAqIGExMDtcbiAgICAgICAgb3V0bVsxXSA9IGMgKiBhMDEgKyBzICogYTExO1xuICAgICAgICBvdXRtWzJdID0gYyAqIGEwMiArIHMgKiBhMTI7XG5cbiAgICAgICAgb3V0bVszXSA9IGMgKiBhMTAgLSBzICogYTAwO1xuICAgICAgICBvdXRtWzRdID0gYyAqIGExMSAtIHMgKiBhMDE7XG4gICAgICAgIG91dG1bNV0gPSBjICogYTEyIC0gcyAqIGEwMjtcblxuICAgICAgICBvdXRtWzZdID0gYTIwO1xuICAgICAgICBvdXRtWzddID0gYTIxO1xuICAgICAgICBvdXRtWzhdID0gYTIyO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE11bHRpcGx5IGEgbWF0cml4IHdpdGggYSBzY2FsZSBtYXRyaXggZ2l2ZW4gYnkgYSBzY2FsZSB2ZWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gTWF0cml4IHRvIG11bHRpcGx5LlxuICAgICAqIEBwYXJhbSB7dmVjMn0gdiAtIFRoZSBzY2FsZSB2ZWN0b3IuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dFxuICAgICAqKi9cbiAgICBzdGF0aWMgc2NhbGUgKG91dDogTWF0MywgYTogTWF0MywgdjogVmVjMik6IE1hdDMge1xuICAgICAgICBsZXQgeCA9IHYueCwgeSA9IHYueTtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBvdXRtID0gb3V0Lm07XG5cbiAgICAgICAgb3V0bVswXSA9IHggKiBhbVswXTtcbiAgICAgICAgb3V0bVsxXSA9IHggKiBhbVsxXTtcbiAgICAgICAgb3V0bVsyXSA9IHggKiBhbVsyXTtcblxuICAgICAgICBvdXRtWzNdID0geSAqIGFtWzNdO1xuICAgICAgICBvdXRtWzRdID0geSAqIGFtWzRdO1xuICAgICAgICBvdXRtWzVdID0geSAqIGFtWzVdO1xuXG4gICAgICAgIG91dG1bNl0gPSBhbVs2XTtcbiAgICAgICAgb3V0bVs3XSA9IGFtWzddO1xuICAgICAgICBvdXRtWzhdID0gYW1bOF07XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29waWVzIHRoZSB1cHBlci1sZWZ0IDN4MyB2YWx1ZXMgb2YgYSA0eDQgbWF0cml4IGludG8gYSAzeDMgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7bWF0NH0gYSAtIFRoZSA0eDQgbWF0cml4LlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tTWF0NCAob3V0OiBNYXQzLCBhOiBNYXQ0KTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgb3V0bSA9IG91dC5tO1xuICAgICAgICBvdXRtWzBdID0gYW1bMF07XG4gICAgICAgIG91dG1bMV0gPSBhbVsxXTtcbiAgICAgICAgb3V0bVsyXSA9IGFtWzJdO1xuICAgICAgICBvdXRtWzNdID0gYW1bNF07XG4gICAgICAgIG91dG1bNF0gPSBhbVs1XTtcbiAgICAgICAgb3V0bVs1XSA9IGFtWzZdO1xuICAgICAgICBvdXRtWzZdID0gYW1bOF07XG4gICAgICAgIG91dG1bN10gPSBhbVs5XTtcbiAgICAgICAgb3V0bVs4XSA9IGFtWzEwXTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSB0cmFuc2xhdGlvbiBvZmZzZXQuXG4gICAgICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gICAgICpcbiAgICAgKiAgICAgbWF0My5pZGVudGl0eShkZXN0KTtcbiAgICAgKiAgICAgbWF0My50cmFuc2xhdGUoZGVzdCwgZGVzdCwgdmVjKTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIHN0b3JlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge3ZlYzJ9IHYgLSBUaGUgdHJhbnNsYXRpb24gb2Zmc2V0LlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tVHJhbnNsYXRpb24gKG91dDogTWF0MywgdjogVmVjMik6IE1hdDMge1xuICAgICAgICBsZXQgb3V0bSA9IG91dC5tO1xuICAgICAgICBvdXRtWzBdID0gMTtcbiAgICAgICAgb3V0bVsxXSA9IDA7XG4gICAgICAgIG91dG1bMl0gPSAwO1xuICAgICAgICBvdXRtWzNdID0gMDtcbiAgICAgICAgb3V0bVs0XSA9IDE7XG4gICAgICAgIG91dG1bNV0gPSAwO1xuICAgICAgICBvdXRtWzZdID0gdi54O1xuICAgICAgICBvdXRtWzddID0gdi55O1xuICAgICAgICBvdXRtWzhdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBnaXZlbiBhbmdsZS5cbiAgICAgKiBUaGlzIGlzIGVxdWl2YWxlbnQgdG8gKGJ1dCBtdWNoIGZhc3RlciB0aGFuKTpcbiAgICAgKlxuICAgICAqICAgICBtYXQzLmlkZW50aXR5KGRlc3QpO1xuICAgICAqICAgICBtYXQzLnJvdGF0ZShkZXN0LCBkZXN0LCByYWQpO1xuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSByYWQgLSBUaGUgcm90YXRpb24gYW5nbGUuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21Sb3RhdGlvbiAob3V0OiBNYXQzLCByYWQ6IG51bWJlcik6IE1hdDMge1xuICAgICAgICBsZXQgcyA9IE1hdGguc2luKHJhZCksIGMgPSBNYXRoLmNvcyhyYWQpO1xuICAgICAgICBsZXQgb3V0bSA9IG91dC5tO1xuXG4gICAgICAgIG91dG1bMF0gPSBjO1xuICAgICAgICBvdXRtWzFdID0gcztcbiAgICAgICAgb3V0bVsyXSA9IDA7XG5cbiAgICAgICAgb3V0bVszXSA9IC1zO1xuICAgICAgICBvdXRtWzRdID0gYztcbiAgICAgICAgb3V0bVs1XSA9IDA7XG5cbiAgICAgICAgb3V0bVs2XSA9IDA7XG4gICAgICAgIG91dG1bN10gPSAwO1xuICAgICAgICBvdXRtWzhdID0gMTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbWF0cml4IGZyb20gYSBzY2FsZSB2ZWN0b3IuXG4gICAgICogVGhpcyBpcyBlcXVpdmFsZW50IHRvIChidXQgbXVjaCBmYXN0ZXIgdGhhbik6XG4gICAgICpcbiAgICAgKiAgICAgbWF0My5pZGVudGl0eShkZXN0KTtcbiAgICAgKiAgICAgbWF0My5zY2FsZShkZXN0LCBkZXN0LCB2ZWMpO1xuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7dmVjMn0gdiAtIFNjYWxlIHZlY3Rvci5cbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0LlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbVNjYWxpbmcgKG91dDogTWF0MywgdjogVmVjMik6IE1hdDMge1xuICAgICAgICBsZXQgb3V0bSA9IG91dC5tO1xuICAgICAgICBvdXRtWzBdID0gdi54O1xuICAgICAgICBvdXRtWzFdID0gMDtcbiAgICAgICAgb3V0bVsyXSA9IDA7XG5cbiAgICAgICAgb3V0bVszXSA9IDA7XG4gICAgICAgIG91dG1bNF0gPSB2Lnk7XG4gICAgICAgIG91dG1bNV0gPSAwO1xuXG4gICAgICAgIG91dG1bNl0gPSAwO1xuICAgICAgICBvdXRtWzddID0gMDtcbiAgICAgICAgb3V0bVs4XSA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyBhIDN4MyBtYXRyaXggZnJvbSB0aGUgZ2l2ZW4gcXVhdGVybmlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIHN0b3JlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge3F1YXR9IHEgLSBUaGUgcXVhdGVybmlvbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tUXVhdCAob3V0OiBNYXQzLCBxOiBRdWF0KTogTWF0MyB7XG4gICAgICAgIGxldCBvdXRtID0gb3V0Lm07XG4gICAgICAgIGxldCB4ID0gcS54LCB5ID0gcS55LCB6ID0gcS56LCB3ID0gcS53O1xuICAgICAgICBsZXQgeDIgPSB4ICsgeDtcbiAgICAgICAgbGV0IHkyID0geSArIHk7XG4gICAgICAgIGxldCB6MiA9IHogKyB6O1xuXG4gICAgICAgIGxldCB4eCA9IHggKiB4MjtcbiAgICAgICAgbGV0IHl4ID0geSAqIHgyO1xuICAgICAgICBsZXQgeXkgPSB5ICogeTI7XG4gICAgICAgIGxldCB6eCA9IHogKiB4MjtcbiAgICAgICAgbGV0IHp5ID0geiAqIHkyO1xuICAgICAgICBsZXQgenogPSB6ICogejI7XG4gICAgICAgIGxldCB3eCA9IHcgKiB4MjtcbiAgICAgICAgbGV0IHd5ID0gdyAqIHkyO1xuICAgICAgICBsZXQgd3ogPSB3ICogejI7XG5cbiAgICAgICAgb3V0bVswXSA9IDEgLSB5eSAtIHp6O1xuICAgICAgICBvdXRtWzNdID0geXggLSB3ejtcbiAgICAgICAgb3V0bVs2XSA9IHp4ICsgd3k7XG5cbiAgICAgICAgb3V0bVsxXSA9IHl4ICsgd3o7XG4gICAgICAgIG91dG1bNF0gPSAxIC0geHggLSB6ejtcbiAgICAgICAgb3V0bVs3XSA9IHp5IC0gd3g7XG5cbiAgICAgICAgb3V0bVsyXSA9IHp4IC0gd3k7XG4gICAgICAgIG91dG1bNV0gPSB6eSArIHd4O1xuICAgICAgICBvdXRtWzhdID0gMSAtIHh4IC0geXk7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIGEgM3gzIG1hdHJpeCBmcm9tIHZpZXcgZGlyZWN0aW9uIGFuZCB1cCBkaXJlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHt2ZWMzfSB2aWV3IC0gVmlldyBkaXJlY3Rpb24gKG11c3QgYmUgbm9ybWFsaXplZCkuXG4gICAgICogQHBhcmFtIHt2ZWMzfSBbdXBdIC0gVXAgZGlyZWN0aW9uLCBkZWZhdWx0IGlzICgwLDEsMCkgKG11c3QgYmUgbm9ybWFsaXplZCkuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7TWF0M30gb3V0XG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tVmlld1VwIChvdXQ6IE1hdDMsIHZpZXc6IFZlYzMsIHVwPzogVmVjMyk6IE1hdDMge1xuICAgICAgICBsZXQgX2Zyb21WaWV3VXBJSUZFID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBkZWZhdWx0X3VwID0gbmV3IFZlYzMoMCwgMSwgMCk7XG4gICAgICAgICAgICBsZXQgeCA9IG5ldyBWZWMzKCk7XG4gICAgICAgICAgICBsZXQgeSA9IG5ldyBWZWMzKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAob3V0LCB2aWV3LCB1cCkge1xuICAgICAgICAgICAgICAgIGlmIChWZWMzLmxlbmd0aFNxcih2aWV3KSA8IEVQU0lMT04gKiBFUFNJTE9OKSB7XG4gICAgICAgICAgICAgICAgICAgIE1hdDMuaWRlbnRpdHkob3V0KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB1cCA9IHVwIHx8IGRlZmF1bHRfdXA7XG4gICAgICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUoeCwgVmVjMy5jcm9zcyh4LCB1cCwgdmlldykpO1xuXG4gICAgICAgICAgICAgICAgaWYgKFZlYzMubGVuZ3RoU3FyKHgpIDwgRVBTSUxPTiAqIEVQU0lMT04pIHtcbiAgICAgICAgICAgICAgICAgICAgTWF0My5pZGVudGl0eShvdXQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIFZlYzMuY3Jvc3MoeSwgdmlldywgeCk7XG4gICAgICAgICAgICAgICAgTWF0My5zZXQoXG4gICAgICAgICAgICAgICAgICAgIG91dCxcbiAgICAgICAgICAgICAgICAgICAgeC54LCB4LnksIHgueixcbiAgICAgICAgICAgICAgICAgICAgeS54LCB5LnksIHkueixcbiAgICAgICAgICAgICAgICAgICAgdmlldy54LCB2aWV3LnksIHZpZXcuelxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSkoKTtcbiAgICAgICAgcmV0dXJuIF9mcm9tVmlld1VwSUlGRShvdXQsIHZpZXcsIHVwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIGEgM3gzIG5vcm1hbCBtYXRyaXggKHRyYW5zcG9zZSBpbnZlcnNlKSBmcm9tIHRoZSA0eDQgbWF0cml4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtNYXQzfSBvdXQgLSBNYXRyaXggdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7bWF0NH0gYSAtIEEgNHg0IG1hdHJpeCB0byBkZXJpdmUgdGhlIG5vcm1hbCBtYXRyaXggZnJvbS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBub3JtYWxGcm9tTWF0NCAob3V0OiBNYXQzLCBhOiBNYXQ0KTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgb3V0bSA9IG91dC5tO1xuICAgICAgICBsZXQgYTAwID0gYW1bMF0sIGEwMSA9IGFtWzFdLCBhMDIgPSBhbVsyXSwgYTAzID0gYW1bM10sXG4gICAgICAgICAgICBhMTAgPSBhbVs0XSwgYTExID0gYW1bNV0sIGExMiA9IGFtWzZdLCBhMTMgPSBhbVs3XSxcbiAgICAgICAgICAgIGEyMCA9IGFtWzhdLCBhMjEgPSBhbVs5XSwgYTIyID0gYW1bMTBdLCBhMjMgPSBhbVsxMV0sXG4gICAgICAgICAgICBhMzAgPSBhbVsxMl0sIGEzMSA9IGFtWzEzXSwgYTMyID0gYW1bMTRdLCBhMzMgPSBhbVsxNV07XG5cbiAgICAgICAgbGV0IGIwMCA9IGEwMCAqIGExMSAtIGEwMSAqIGExMDtcbiAgICAgICAgbGV0IGIwMSA9IGEwMCAqIGExMiAtIGEwMiAqIGExMDtcbiAgICAgICAgbGV0IGIwMiA9IGEwMCAqIGExMyAtIGEwMyAqIGExMDtcbiAgICAgICAgbGV0IGIwMyA9IGEwMSAqIGExMiAtIGEwMiAqIGExMTtcbiAgICAgICAgbGV0IGIwNCA9IGEwMSAqIGExMyAtIGEwMyAqIGExMTtcbiAgICAgICAgbGV0IGIwNSA9IGEwMiAqIGExMyAtIGEwMyAqIGExMjtcbiAgICAgICAgbGV0IGIwNiA9IGEyMCAqIGEzMSAtIGEyMSAqIGEzMDtcbiAgICAgICAgbGV0IGIwNyA9IGEyMCAqIGEzMiAtIGEyMiAqIGEzMDtcbiAgICAgICAgbGV0IGIwOCA9IGEyMCAqIGEzMyAtIGEyMyAqIGEzMDtcbiAgICAgICAgbGV0IGIwOSA9IGEyMSAqIGEzMiAtIGEyMiAqIGEzMTtcbiAgICAgICAgbGV0IGIxMCA9IGEyMSAqIGEzMyAtIGEyMyAqIGEzMTtcbiAgICAgICAgbGV0IGIxMSA9IGEyMiAqIGEzMyAtIGEyMyAqIGEzMjtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIGRldGVybWluYW50XG4gICAgICAgIGxldCBkZXQgPSBiMDAgKiBiMTEgLSBiMDEgKiBiMTAgKyBiMDIgKiBiMDkgKyBiMDMgKiBiMDggLSBiMDQgKiBiMDcgKyBiMDUgKiBiMDY7XG5cbiAgICAgICAgaWYgKCFkZXQpIHtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH1cbiAgICAgICAgZGV0ID0gMS4wIC8gZGV0O1xuXG4gICAgICAgIG91dG1bMF0gPSAoYTExICogYjExIC0gYTEyICogYjEwICsgYTEzICogYjA5KSAqIGRldDtcbiAgICAgICAgb3V0bVsxXSA9IChhMTIgKiBiMDggLSBhMTAgKiBiMTEgLSBhMTMgKiBiMDcpICogZGV0O1xuICAgICAgICBvdXRtWzJdID0gKGExMCAqIGIxMCAtIGExMSAqIGIwOCArIGExMyAqIGIwNikgKiBkZXQ7XG5cbiAgICAgICAgb3V0bVszXSA9IChhMDIgKiBiMTAgLSBhMDEgKiBiMTEgLSBhMDMgKiBiMDkpICogZGV0O1xuICAgICAgICBvdXRtWzRdID0gKGEwMCAqIGIxMSAtIGEwMiAqIGIwOCArIGEwMyAqIGIwNykgKiBkZXQ7XG4gICAgICAgIG91dG1bNV0gPSAoYTAxICogYjA4IC0gYTAwICogYjEwIC0gYTAzICogYjA2KSAqIGRldDtcblxuICAgICAgICBvdXRtWzZdID0gKGEzMSAqIGIwNSAtIGEzMiAqIGIwNCArIGEzMyAqIGIwMykgKiBkZXQ7XG4gICAgICAgIG91dG1bN10gPSAoYTMyICogYjAyIC0gYTMwICogYjA1IC0gYTMzICogYjAxKSAqIGRldDtcbiAgICAgICAgb3V0bVs4XSA9IChhMzAgKiBiMDQgLSBhMzEgKiBiMDIgKyBhMzMgKiBiMDApICogZGV0O1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBGcm9iZW5pdXMgbm9ybSBvZiBhIG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIE1hdHJpeCB0byBjYWxjdWxhdGUgRnJvYmVuaXVzIG5vcm0gb2YuXG4gICAgICogQHJldHVybnMge051bWJlcn0gLSBUaGUgZnJvYmVuaXVzIG5vcm0uXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9iIChhOiBNYXQzKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGFtID0gYS5tO1xuICAgICAgICByZXR1cm4gKE1hdGguc3FydChNYXRoLnBvdyhhbVswXSwgMikgKyBNYXRoLnBvdyhhbVsxXSwgMikgKyBNYXRoLnBvdyhhbVsyXSwgMikgKyBNYXRoLnBvdyhhbVszXSwgMikgKyBNYXRoLnBvdyhhbVs0XSwgMikgKyBNYXRoLnBvdyhhbVs1XSwgMikgKyBNYXRoLnBvdyhhbVs2XSwgMikgKyBNYXRoLnBvdyhhbVs3XSwgMikgKyBNYXRoLnBvdyhhbVs4XSwgMikpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIHR3byBtYXRyaWNlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIHN0b3JlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge01hdDN9IGEgLSBUaGUgZmlyc3Qgb3BlcmFuZC5cbiAgICAgKiBAcGFyYW0ge01hdDN9IGIgLSBUaGUgc2Vjb25kIG9wZXJhbmQuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGFkZCAob3V0OiBNYXQzLCBhOiBNYXQzLCBiOiBNYXQzKTogTWF0MyB7XG4gICAgICAgIGxldCBhbSA9IGEubSwgYm0gPSBiLm0sIG91dG0gPSBvdXQubTtcbiAgICAgICAgb3V0bVswXSA9IGFtWzBdICsgYm1bMF07XG4gICAgICAgIG91dG1bMV0gPSBhbVsxXSArIGJtWzFdO1xuICAgICAgICBvdXRtWzJdID0gYW1bMl0gKyBibVsyXTtcbiAgICAgICAgb3V0bVszXSA9IGFtWzNdICsgYm1bM107XG4gICAgICAgIG91dG1bNF0gPSBhbVs0XSArIGJtWzRdO1xuICAgICAgICBvdXRtWzVdID0gYW1bNV0gKyBibVs1XTtcbiAgICAgICAgb3V0bVs2XSA9IGFtWzZdICsgYm1bNl07XG4gICAgICAgIG91dG1bN10gPSBhbVs3XSArIGJtWzddO1xuICAgICAgICBvdXRtWzhdID0gYW1bOF0gKyBibVs4XTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJ0cmFjdHMgbWF0cml4IGIgZnJvbSBtYXRyaXggYS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gb3V0IC0gTWF0cml4IHRvIHN0b3JlIHJlc3VsdC5cbiAgICAgKiBAcGFyYW0ge01hdDN9IGEgLSBUaGUgZmlyc3Qgb3BlcmFuZC5cbiAgICAgKiBAcGFyYW0ge01hdDN9IGIgLSBUaGUgc2Vjb25kIG9wZXJhbmQuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHN1YnRyYWN0IChvdXQ6IE1hdDMsIGE6IE1hdDMsIGI6IE1hdDMpOiBNYXQzIHtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBibSA9IGIubSwgb3V0bSA9IG91dC5tO1xuICAgICAgICBvdXRtWzBdID0gYW1bMF0gLSBibVswXTtcbiAgICAgICAgb3V0bVsxXSA9IGFtWzFdIC0gYm1bMV07XG4gICAgICAgIG91dG1bMl0gPSBhbVsyXSAtIGJtWzJdO1xuICAgICAgICBvdXRtWzNdID0gYW1bM10gLSBibVszXTtcbiAgICAgICAgb3V0bVs0XSA9IGFtWzRdIC0gYm1bNF07XG4gICAgICAgIG91dG1bNV0gPSBhbVs1XSAtIGJtWzVdO1xuICAgICAgICBvdXRtWzZdID0gYW1bNl0gLSBibVs2XTtcbiAgICAgICAgb3V0bVs3XSA9IGFtWzddIC0gYm1bN107XG4gICAgICAgIG91dG1bOF0gPSBhbVs4XSAtIGJtWzhdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE11bHRpcGx5IGVhY2ggZWxlbWVudCBvZiBhIG1hdHJpeCBieSBhIHNjYWxhciBudW1iZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gTWF0cml4IHRvIHNjYWxlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGIgLSBUaGUgc2NhbGUgbnVtYmVyLlxuICAgICAqIEByZXR1cm5zIHtNYXQzfSBvdXQuXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBtdWx0aXBseVNjYWxhciAob3V0OiBNYXQzLCBhOiBNYXQzLCBiOiBudW1iZXIpOiBNYXQzIHtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBvdXRtID0gb3V0Lm07XG4gICAgICAgIG91dG1bMF0gPSBhbVswXSAqIGI7XG4gICAgICAgIG91dG1bMV0gPSBhbVsxXSAqIGI7XG4gICAgICAgIG91dG1bMl0gPSBhbVsyXSAqIGI7XG4gICAgICAgIG91dG1bM10gPSBhbVszXSAqIGI7XG4gICAgICAgIG91dG1bNF0gPSBhbVs0XSAqIGI7XG4gICAgICAgIG91dG1bNV0gPSBhbVs1XSAqIGI7XG4gICAgICAgIG91dG1bNl0gPSBhbVs2XSAqIGI7XG4gICAgICAgIG91dG1bN10gPSBhbVs3XSAqIGI7XG4gICAgICAgIG91dG1bOF0gPSBhbVs4XSAqIGI7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyB0d28gbWF0cmljZXMgYWZ0ZXIgbXVsdGlwbHlpbmcgZWFjaCBlbGVtZW50IG9mIHRoZSBzZWNvbmQgb3BlcmFuZCBieSBhIHNjYWxhciBudW1iZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IG91dCAtIE1hdHJpeCB0byBzdG9yZSByZXN1bHQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBhIC0gVGhlIGZpcnN0IG9wZXJhbmQuXG4gICAgICogQHBhcmFtIHtNYXQzfSBiIC0gVGhlIHNlY29uZCBvcGVyYW5kLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZSAtIFRoZSBzY2FsZSBudW1iZXIuXG4gICAgICogQHJldHVybnMge01hdDN9IG91dC5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5U2NhbGFyQW5kQWRkIChvdXQ6IE1hdDMsIGE6IE1hdDMsIGI6IE1hdDMsIHNjYWxlOiBudW1iZXIpOiBNYXQzIHtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBibSA9IGIubSwgb3V0bSA9IG91dC5tO1xuICAgICAgICBvdXRtWzBdID0gYW1bMF0gKyAoYm1bMF0gKiBzY2FsZSk7XG4gICAgICAgIG91dG1bMV0gPSBhbVsxXSArIChibVsxXSAqIHNjYWxlKTtcbiAgICAgICAgb3V0bVsyXSA9IGFtWzJdICsgKGJtWzJdICogc2NhbGUpO1xuICAgICAgICBvdXRtWzNdID0gYW1bM10gKyAoYm1bM10gKiBzY2FsZSk7XG4gICAgICAgIG91dG1bNF0gPSBhbVs0XSArIChibVs0XSAqIHNjYWxlKTtcbiAgICAgICAgb3V0bVs1XSA9IGFtWzVdICsgKGJtWzVdICogc2NhbGUpO1xuICAgICAgICBvdXRtWzZdID0gYW1bNl0gKyAoYm1bNl0gKiBzY2FsZSk7XG4gICAgICAgIG91dG1bN10gPSBhbVs3XSArIChibVs3XSAqIHNjYWxlKTtcbiAgICAgICAgb3V0bVs4XSA9IGFtWzhdICsgKGJtWzhdICogc2NhbGUpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgc3BlY2lmaWVkIG1hdHJpY2VzIGFyZSBlcXVhbC4gKENvbXBhcmVkIHVzaW5nID09PSlcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIFRoZSBmaXJzdCBtYXRyaXguXG4gICAgICogQHBhcmFtIHtNYXQzfSBiIC0gVGhlIHNlY29uZCBtYXRyaXguXG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IFRydWUgaWYgdGhlIG1hdHJpY2VzIGFyZSBlcXVhbCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZXhhY3RFcXVhbHMgKGE6IE1hdDMsIGI6IE1hdDMpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IGFtID0gYS5tLCBibSA9IGIubTtcbiAgICAgICAgcmV0dXJuIGFtWzBdID09PSBibVswXSAmJiBhbVsxXSA9PT0gYm1bMV0gJiYgYW1bMl0gPT09IGJtWzJdICYmXG4gICAgICAgICAgICBhbVszXSA9PT0gYm1bM10gJiYgYW1bNF0gPT09IGJtWzRdICYmIGFtWzVdID09PSBibVs1XSAmJlxuICAgICAgICAgICAgYW1bNl0gPT09IGJtWzZdICYmIGFtWzddID09PSBibVs3XSAmJiBhbVs4XSA9PT0gYm1bOF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgbWF0cmljZXMgYXJlIGFwcHJveGltYXRlbHkgZXF1YWwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge01hdDN9IGEgLSBUaGUgZmlyc3QgbWF0cml4LlxuICAgICAqIEBwYXJhbSB7TWF0M30gYiAtIFRoZSBzZWNvbmQgbWF0cml4LlxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBUcnVlIGlmIHRoZSBtYXRyaWNlcyBhcmUgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGVxdWFscyAoYTogTWF0MywgYjogTWF0Myk6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgYW0gPSBhLm0sIGJtID0gYi5tO1xuICAgICAgICBsZXQgYTAgPSBhbVswXSwgYTEgPSBhbVsxXSwgYTIgPSBhbVsyXSwgYTMgPSBhbVszXSwgYTQgPSBhbVs0XSwgYTUgPSBhbVs1XSwgYTYgPSBhbVs2XSwgYTcgPSBhbVs3XSwgYTggPSBhbVs4XTtcbiAgICAgICAgbGV0IGIwID0gYm1bMF0sIGIxID0gYm1bMV0sIGIyID0gYm1bMl0sIGIzID0gYm1bM10sIGI0ID0gYm1bNF0sIGI1ID0gYm1bNV0sIGI2ID0gYm1bNl0sIGI3ID0gYm1bN10sIGI4ID0gYm1bOF07XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBNYXRoLmFicyhhMCAtIGIwKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMCksIE1hdGguYWJzKGIwKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGExIC0gYjEpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGExKSwgTWF0aC5hYnMoYjEpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYTIgLSBiMikgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTIpLCBNYXRoLmFicyhiMikpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhMyAtIGIzKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhMyksIE1hdGguYWJzKGIzKSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGE0IC0gYjQpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE0KSwgTWF0aC5hYnMoYjQpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYTUgLSBiNSkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTUpLCBNYXRoLmFicyhiNSkpICYmXG4gICAgICAgICAgICBNYXRoLmFicyhhNiAtIGI2KSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhNiksIE1hdGguYWJzKGI2KSkgJiZcbiAgICAgICAgICAgIE1hdGguYWJzKGE3IC0gYjcpIDw9IEVQU0lMT04gKiBNYXRoLm1heCgxLjAsIE1hdGguYWJzKGE3KSwgTWF0aC5hYnMoYjcpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYTggLSBiOCkgPD0gRVBTSUxPTiAqIE1hdGgubWF4KDEuMCwgTWF0aC5hYnMoYTgpLCBNYXRoLmFicyhiOCkpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnn6npmLXovazmlbDnu4RcbiAgICAgKiAhI2VuIE1hdHJpeCB0cmFuc3Bvc2UgYXJyYXlcbiAgICAgKiBAbWV0aG9kIHRvQXJyYXlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHRvQXJyYXkgPE91dCBleHRlbmRzIElXcml0YWJsZUFycmF5TGlrZTxudW1iZXI+PiAob3V0OiBPdXQsIG1hdDogSU1hdDNMaWtlLCBvZnMgPSAwKVxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE5YaF55qE6LW35aeL5YGP56e76YePXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0b0FycmF5IDxPdXQgZXh0ZW5kcyBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPj4gKG91dDogT3V0LCBtYXQ6IElNYXQzTGlrZSwgb2ZzID0gMCkge1xuICAgICAgICBsZXQgbSA9IG1hdC5tO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xuICAgICAgICAgICAgb3V0W29mcyArIGldID0gbVtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5pWw57uE6L2s55+p6Zi1XG4gICAgICogISNlbiBUcmFuc2ZlciBtYXRyaXggYXJyYXlcbiAgICAgKiBAbWV0aG9kIGZyb21BcnJheVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZnJvbUFycmF5IDxPdXQgZXh0ZW5kcyBJTWF0M0xpa2U+IChvdXQ6IE91dCwgYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb2ZzID0gMClcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUFycmF5IDxPdXQgZXh0ZW5kcyBJTWF0M0xpa2U+IChvdXQ6IE91dCwgYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb2ZzID0gMCkge1xuICAgICAgICBsZXQgbSA9IG91dC5tO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xuICAgICAgICAgICAgbVtpXSA9IGFycltvZnMgKyBpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gTWF0cml4IERhdGFcbiAgICAgKiAhI3poIOefqemYteaVsOaNrlxuICAgICAqIEBwcm9wZXJ0eSB7RmxvYXQ2NEFycmF5IHwgRmxvYXQzMkFycmF5fSBtXG4gICAgICovXG4gICAgbTogRmxvYXRBcnJheTtcblxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY29uc3RydWN0b3IgKG0wMDogbnVtYmVyIHwgRmxvYXQzMkFycmF5ID0gMSwgbTAxID0gMCwgbTAyID0gMCwgbTAzID0gMCwgbTA0ID0gMSwgbTA1ID0gMCwgbTA2ID0gMCwgbTA3ID0gMCwgbTA4ID0gMSlcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoXG4gICAgICAgIG0wMDogbnVtYmVyIHwgRmxvYXRBcnJheSA9IDEsIG0wMSA9IDAsIG0wMiA9IDAsXG4gICAgICAgIG0wMyA9IDAsIG0wNCA9IDEsIG0wNSA9IDAsXG4gICAgICAgIG0wNiA9IDAsIG0wNyA9IDAsIG0wOCA9IDFcbiAgICApIHtcbiAgICAgICAgaWYgKG0wMCBpbnN0YW5jZW9mIEZMT0FUX0FSUkFZX1RZUEUpIHtcbiAgICAgICAgICAgIHRoaXMubSA9IG0wMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubSA9IG5ldyBGTE9BVF9BUlJBWV9UWVBFKDkpO1xuICAgICAgICAgICAgbGV0IG0gPSB0aGlzLm07XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFRoZSBlbGVtZW50IGF0IGNvbHVtbiAwIHJvdyAwLlxuICAgICAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICAgICAqICovXG4gICAgICAgICAgICBtWzBdID0gbTAwIGFzIG51bWJlcjtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMCByb3cgMS5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVsxXSA9IG0wMTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMCByb3cgMi5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVsyXSA9IG0wMjtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMC5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVszXSA9IG0wMztcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMS5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVs0XSA9IG0wNDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMSByb3cgMi5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVs1XSA9IG0wNTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMC5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVs2XSA9IG0wNjtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMS5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVs3XSA9IG0wNztcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBUaGUgZWxlbWVudCBhdCBjb2x1bW4gMiByb3cgMi5cbiAgICAgICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAgICAgKiAqL1xuICAgICAgICAgICAgbVs4XSA9IG0wODtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIG1hdHJpeC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7TWF0M30gYSAtIFRoZSBtYXRyaXguXG4gICAgICogQHJldHVybnMge1N0cmluZ30gU3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgbWF0cml4LlxuICAgICAqL1xuICAgIHRvU3RyaW5nICgpIHtcbiAgICAgICAgbGV0IGFtID0gdGhpcy5tO1xuICAgICAgICByZXR1cm4gYG1hdDMoJHthbVswXX0sICR7YW1bMV19LCAke2FtWzJdfSwgJHthbVszXX0sICR7YW1bNF19LCAke2FtWzVdfSwgJHthbVs2XX0sICR7YW1bN119LCAke2FtWzhdfSlgO1xuICAgIH1cbn1cblxuY2MuTWF0MyA9IE1hdDM7XG4iXX0=