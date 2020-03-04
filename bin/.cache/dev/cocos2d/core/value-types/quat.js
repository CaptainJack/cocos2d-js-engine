
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/quat.js';
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

var _mat = _interopRequireDefault(require("./mat3"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var _x = 0.0;
var _y = 0.0;
var _z = 0.0;
var _w = 0.0;
/**
 * !#en Representation of 2D vectors and points.
 * !#zh 表示 2D 向量和坐标
 *
 * @class Quat
 * @extends ValueType
 */

/**
 * !#en
 * Constructor
 * see {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
 * !#zh
 * 构造函数，可查看 {{#crossLink "cc/quat:method"}}cc.quat{{/crossLink}}
 * @method constructor
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @param {number} [z=0]
 * @param {number} [w=1]
 */

var Quat =
/*#__PURE__*/
function (_ValueType) {
  _inheritsLoose(Quat, _ValueType);

  var _proto = Quat.prototype;

  /**
   * !#en Calculate the multiply result between this quaternion and another one
   * !#zh 计算四元数乘积的结果
   * @method mul
   * @param {Quat} other
   * @param {Quat} [out]
   * @returns {Quat} out
   */
  _proto.mul = function mul(other, out) {
    return Quat.multiply(out || new Quat(), this, other);
  };

  /**
   * !#zh 获得指定四元数的拷贝
   * !#en Obtaining copy specified quaternion
   * @method clone
   * @typescript
   * clone<Out extends IQuatLike> (a: Out)
   * @static
   */
  Quat.clone = function clone(a) {
    return new Quat(a.x, a.y, a.z, a.w);
  }
  /**
   * !#zh 复制目标四元数
   * !#en Copy quaternion target
   * @method copy
   * @typescript
   * copy<Out extends IQuatLike, QuatLike extends IQuatLike> (out: Out, a: QuatLike)
   * @static
   */
  ;

  Quat.copy = function copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    out.w = a.w;
    return out;
  }
  /**
   * !#zh 设置四元数值
   * !#en Provided Quaternion Value
   * @method set
   * @typescript
   * set<Out extends IQuatLike> (out: Out, x: number, y: number, z: number, w: number)
   * @static
   */
  ;

  Quat.set = function set(out, x, y, z, w) {
    out.x = x;
    out.y = y;
    out.z = z;
    out.w = w;
    return out;
  }
  /**
   * !#zh 将目标赋值为单位四元数
   * !#en The target of an assignment as a unit quaternion
   * @method identity
   * @typescript
   * identity<Out extends IQuatLike> (out: Out)
   * @static
   */
  ;

  Quat.identity = function identity(out) {
    out.x = 0;
    out.y = 0;
    out.z = 0;
    out.w = 1;
    return out;
  }
  /**
   * !#zh 设置四元数为两向量间的最短路径旋转，默认两向量都已归一化
   * !#en Set quaternion rotation is the shortest path between two vectors, the default two vectors are normalized
   * @method rotationTo
   * @typescript
   * rotationTo<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, a: VecLike, b: VecLike)
   * @static
   */
  ;

  Quat.rotationTo = function rotationTo(out, a, b) {
    var dot = _vec["default"].dot(a, b);

    if (dot < -0.999999) {
      _vec["default"].cross(v3_1, _vec["default"].RIGHT, a);

      if (v3_1.mag() < 0.000001) {
        _vec["default"].cross(v3_1, _vec["default"].UP, a);
      }

      _vec["default"].normalize(v3_1, v3_1);

      Quat.fromAxisAngle(out, v3_1, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out.x = 0;
      out.y = 0;
      out.z = 0;
      out.w = 1;
      return out;
    } else {
      _vec["default"].cross(v3_1, a, b);

      out.x = v3_1.x;
      out.y = v3_1.y;
      out.z = v3_1.z;
      out.w = 1 + dot;
      return Quat.normalize(out, out);
    }
  }
  /**
   * !#zh 获取四元数的旋转轴和旋转弧度
   * !#en Get the rotary shaft and the arc of rotation quaternion
   * @method getAxisAngle
   * @param {Vec3} outAxis - 旋转轴输出
   * @param {Quat} q - 源四元数
   * @return {Number} - 旋转弧度
   * @typescript
   * getAxisAngle<Out extends IQuatLike, VecLike extends IVec3Like> (outAxis: VecLike, q: Out)
   * @static
   */
  ;

  Quat.getAxisAngle = function getAxisAngle(outAxis, q) {
    var rad = Math.acos(q.w) * 2.0;
    var s = Math.sin(rad / 2.0);

    if (s !== 0.0) {
      outAxis.x = q.x / s;
      outAxis.y = q.y / s;
      outAxis.z = q.z / s;
    } else {
      // If s is zero, return any axis (no rotation - axis does not matter)
      outAxis.x = 1;
      outAxis.y = 0;
      outAxis.z = 0;
    }

    return rad;
  }
  /**
   * !#zh 四元数乘法
   * !#en Quaternion multiplication
   * @method multiply
   * @typescript
   * multiply<Out extends IQuatLike, QuatLike_1 extends IQuatLike, QuatLike_2 extends IQuatLike> (out: Out, a: QuatLike_1, b: QuatLike_2)
   * @static
   */
  ;

  Quat.multiply = function multiply(out, a, b) {
    _x = a.x * b.w + a.w * b.x + a.y * b.z - a.z * b.y;
    _y = a.y * b.w + a.w * b.y + a.z * b.x - a.x * b.z;
    _z = a.z * b.w + a.w * b.z + a.x * b.y - a.y * b.x;
    _w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
    out.x = _x;
    out.y = _y;
    out.z = _z;
    out.w = _w;
    return out;
  }
  /**
   * !#zh 四元数标量乘法
   * !#en Quaternion scalar multiplication
   * @method multiplyScalar
   * @typescript
   * multiplyScalar<Out extends IQuatLike> (out: Out, a: Out, b: number)
   * @static
   */
  ;

  Quat.multiplyScalar = function multiplyScalar(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    out.z = a.z * b;
    out.w = a.w * b;
    return out;
  }
  /**
   * !#zh 四元数乘加：A + B * scale
   * !#en Quaternion multiplication and addition: A + B * scale
   * @method scaleAndAdd
   * @typescript
   * scaleAndAdd<Out extends IQuatLike> (out: Out, a: Out, b: Out, scale: number)
   * @static
   */
  ;

  Quat.scaleAndAdd = function scaleAndAdd(out, a, b, scale) {
    out.x = a.x + b.x * scale;
    out.y = a.y + b.y * scale;
    out.z = a.z + b.z * scale;
    out.w = a.w + b.w * scale;
    return out;
  }
  /**
   * !#zh 绕 X 轴旋转指定四元数
   * !#en About the X axis specified quaternion
   * @method rotateX
   * @typescript
   * rotateX<Out extends IQuatLike> (out: Out, a: Out, rad: number)
   * @param rad 旋转弧度
   * @static
   */
  ;

  Quat.rotateX = function rotateX(out, a, rad) {
    rad *= 0.5;
    var bx = Math.sin(rad);
    var bw = Math.cos(rad);
    out.x = a.x * bw + a.w * bx;
    out.y = a.y * bw + a.z * bx;
    out.z = a.z * bw - a.y * bx;
    out.w = a.w * bw - a.x * bx;
    return out;
  }
  /**
   * !#zh 绕 Y 轴旋转指定四元数
   * !#en Rotation about the Y axis designated quaternion
   * @method rotateY
   * @typescript
   * rotateY<Out extends IQuatLike> (out: Out, a: Out, rad: number)
   * @param rad 旋转弧度
   * @static
   */
  ;

  Quat.rotateY = function rotateY(out, a, rad) {
    rad *= 0.5;
    var by = Math.sin(rad);
    var bw = Math.cos(rad);
    out.x = a.x * bw - a.z * by;
    out.y = a.y * bw + a.w * by;
    out.z = a.z * bw + a.x * by;
    out.w = a.w * bw - a.y * by;
    return out;
  }
  /**
   * !#zh 绕 Z 轴旋转指定四元数
   * !#en Around the Z axis specified quaternion
   * @method rotateZ
   * @typescript
   * rotateZ<Out extends IQuatLike> (out: Out, a: Out, rad: number)
   * @param rad 旋转弧度
   * @static
   */
  ;

  Quat.rotateZ = function rotateZ(out, a, rad) {
    rad *= 0.5;
    var bz = Math.sin(rad);
    var bw = Math.cos(rad);
    out.x = a.x * bw + a.y * bz;
    out.y = a.y * bw - a.x * bz;
    out.z = a.z * bw + a.w * bz;
    out.w = a.w * bw - a.z * bz;
    return out;
  }
  /**
   * !#zh 绕世界空间下指定轴旋转四元数
   * !#en Space around the world at a given axis of rotation quaternion
   * @method rotateAround
   * @typescript
   * rotateAround<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, rot: Out, axis: VecLike, rad: number)
   * @param axis 旋转轴，默认已归一化
   * @param rad 旋转弧度
   * @static
   */
  ;

  Quat.rotateAround = function rotateAround(out, rot, axis, rad) {
    // get inv-axis (local to rot)
    Quat.invert(qt_1, rot);

    _vec["default"].transformQuat(v3_1, axis, qt_1); // rotate by inv-axis


    Quat.fromAxisAngle(qt_1, v3_1, rad);
    Quat.multiply(out, rot, qt_1);
    return out;
  }
  /**
   * !#zh 绕本地空间下指定轴旋转四元数
   * !#en Local space around the specified axis rotation quaternion
   * @method rotateAroundLocal
   * @typescript
   * rotateAroundLocal<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, rot: Out, axis: VecLike, rad: number)
   * @param axis 旋转轴
   * @param rad 旋转弧度
   * @static
   */
  ;

  Quat.rotateAroundLocal = function rotateAroundLocal(out, rot, axis, rad) {
    Quat.fromAxisAngle(qt_1, axis, rad);
    Quat.multiply(out, rot, qt_1);
    return out;
  }
  /**
   * !#zh 根据 xyz 分量计算 w 分量，默认已归一化
   * !#en The component w xyz components calculated, normalized by default
   * @method calculateW
   * @typescript
   * calculateW<Out extends IQuatLike> (out: Out, a: Out)
   * @static
   */
  ;

  Quat.calculateW = function calculateW(out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    out.w = Math.sqrt(Math.abs(1.0 - a.x * a.x - a.y * a.y - a.z * a.z));
    return out;
  }
  /**
   * !#zh 四元数点积（数量积）
   * !#en Quaternion dot product (scalar product)
   * @method dot
   * @typescript
   * dot<Out extends IQuatLike> (a: Out, b: Out)
   * @static
   */
  ;

  Quat.dot = function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
  }
  /**
   * !#zh 逐元素线性插值： A + t * (B - A)
   * !#en Element by element linear interpolation: A + t * (B - A)
   * @method lerp
   * @typescript
   * lerp<Out extends IQuatLike> (out: Out, a: Out, b: Out, t: number)
   * @static
   */
  ;

  Quat.lerp = function lerp(out, a, b, t) {
    out.x = a.x + t * (b.x - a.x);
    out.y = a.y + t * (b.y - a.y);
    out.z = a.z + t * (b.z - a.z);
    out.w = a.w + t * (b.w - a.w);
    return out;
  }
  /**
   * !#zh 四元数球面插值
   * !#en Spherical quaternion interpolation
   * @static
   */
  ;

  Quat.slerp = function slerp(out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations
    var scale0 = 0;
    var scale1 = 0; // calc cosine

    var cosom = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w; // adjust signs (if necessary)

    if (cosom < 0.0) {
      cosom = -cosom;
      b.x = -b.x;
      b.y = -b.y;
      b.z = -b.z;
      b.w = -b.w;
    } // calculate coefficients


    if (1.0 - cosom > 0.000001) {
      // standard case (slerp)
      var omega = Math.acos(cosom);
      var sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    } // calculate final values


    out.x = scale0 * a.x + scale1 * b.x;
    out.y = scale0 * a.y + scale1 * b.y;
    out.z = scale0 * a.z + scale1 * b.z;
    out.w = scale0 * a.w + scale1 * b.w;
    return out;
  }
  /**
   * !#zh 带两个控制点的四元数球面插值
   * !#en Quaternion with two spherical interpolation control points
   * @method sqlerp
   * @typescript
   * sqlerp<Out extends IQuatLike> (out: Out, a: Out, b: Out, c: Out, d: Out, t: number)
   * @static
   */
  ;

  Quat.sqlerp = function sqlerp(out, a, b, c, d, t) {
    Quat.slerp(qt_1, a, d, t);
    Quat.slerp(qt_2, b, c, t);
    Quat.slerp(out, qt_1, qt_2, 2 * t * (1 - t));
    return out;
  }
  /**
   * !#zh 四元数求逆
   * !#en Quaternion inverse
   * @method invert
   * @typescript
   * invert<Out extends IQuatLike, QuatLike extends IQuatLike> (out: Out, a: QuatLike)
   * @static
   */
  ;

  Quat.invert = function invert(out, a) {
    var dot = a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;
    var invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out.x = -a.x * invDot;
    out.y = -a.y * invDot;
    out.z = -a.z * invDot;
    out.w = a.w * invDot;
    return out;
  }
  /**
   * !#zh 求共轭四元数，对单位四元数与求逆等价，但更高效
   * !#en Conjugating a quaternion, and the unit quaternion equivalent to inversion, but more efficient
   * @method conjugate
   * @typescript
   * conjugate<Out extends IQuatLike> (out: Out, a: Out)
   * @static
   */
  ;

  Quat.conjugate = function conjugate(out, a) {
    out.x = -a.x;
    out.y = -a.y;
    out.z = -a.z;
    out.w = a.w;
    return out;
  }
  /**
   * !#zh 求四元数长度
   * !#en Seek length quaternion
   * @method len
   * @typescript
   * len<Out extends IQuatLike> (a: Out)
   * @static
   */
  ;

  Quat.len = function len(a) {
    return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w);
  }
  /**
   * !#zh 求四元数长度平方
   * !#en Seeking quaternion square of the length
   * @method lengthSqr
   * @typescript
   * lengthSqr<Out extends IQuatLike> (a: Out)
   * @static
   */
  ;

  Quat.lengthSqr = function lengthSqr(a) {
    return a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;
  }
  /**
   * !#zh 归一化四元数
   * !#en Normalized quaternions
   * @method normalize
   * @typescript
   * normalize<Out extends IQuatLike> (out: Out, a: Out)
   * @static
   */
  ;

  Quat.normalize = function normalize(out, a) {
    var len = a.x * a.x + a.y * a.y + a.z * a.z + a.w * a.w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
      out.x = a.x * len;
      out.y = a.y * len;
      out.z = a.z * len;
      out.w = a.w * len;
    }

    return out;
  }
  /**
   * !#zh 根据本地坐标轴朝向计算四元数，默认三向量都已归一化且相互垂直
   * !#en Calculated according to the local orientation quaternion coordinate axis, the default three vectors are normalized and mutually perpendicular
   * @method fromAxes
   * @typescript
   * fromAxes<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, xAxis: VecLike, yAxis: VecLike, zAxis: VecLike)
   * @static
   */
  ;

  Quat.fromAxes = function fromAxes(out, xAxis, yAxis, zAxis) {
    _mat["default"].set(m3_1, xAxis.x, xAxis.y, xAxis.z, yAxis.x, yAxis.y, yAxis.z, zAxis.x, zAxis.y, zAxis.z);

    return Quat.normalize(out, Quat.fromMat3(out, m3_1));
  }
  /**
   * !#zh 根据视口的前方向和上方向计算四元数
   * !#en The forward direction and the direction of the viewport computing quaternion
   * @method fromViewUp
   * @typescript
   * fromViewUp<Out extends IQuatLike> (out: Out, view: Vec3, up?: Vec3)
   * @param view 视口面向的前方向，必须归一化
   * @param up 视口的上方向，必须归一化，默认为 (0, 1, 0)
   * @static
   */
  ;

  Quat.fromViewUp = function fromViewUp(out, view, up) {
    _mat["default"].fromViewUp(m3_1, view, up);

    return Quat.normalize(out, Quat.fromMat3(out, m3_1));
  }
  /**
   * !#zh 根据旋转轴和旋转弧度计算四元数
   * !#en The quaternion calculated and the arc of rotation of the rotary shaft
   * @method fromAxisAngle
   * @typescript
   * fromAxisAngle<Out extends IQuatLike, VecLike extends IVec3Like> (out: Out, axis: VecLike, rad: number)
   * @static
   */
  ;

  Quat.fromAxisAngle = function fromAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out.x = s * axis.x;
    out.y = s * axis.y;
    out.z = s * axis.z;
    out.w = Math.cos(rad);
    return out;
  }
  /**
   * Set a quaternion from the given euler angle 0, 0, z.
   *
   * @param {quat} out - Quaternion to store result.
   * @param {number} z - Angle to rotate around Z axis in degrees.
   * @function
   */
  ;

  Quat.fromAngleZ = function fromAngleZ(out, z) {
    z *= halfToRad;
    out.x = out.y = 0;
    out.z = Math.sin(z);
    out.w = Math.cos(z);
    return out;
  }
  /**
   * !#zh 根据三维矩阵信息计算四元数，默认输入矩阵不含有缩放信息
   * !#en Calculating the three-dimensional quaternion matrix information, default zoom information input matrix does not contain
   * @method fromMat3
   * @typescript
   * fromMat3<Out extends IQuatLike> (out: Out, mat: Mat3)
   * @static
   */
  ;

  Quat.fromMat3 = function fromMat3(out, mat) {
    var m = mat.m;
    var m00 = m[0],
        m10 = m[1],
        m20 = m[2],
        m01 = m[3],
        m11 = m[4],
        m21 = m[5],
        m02 = m[6],
        m12 = m[7],
        m22 = m[8];
    var trace = m00 + m11 + m22;

    if (trace > 0) {
      var s = 0.5 / Math.sqrt(trace + 1.0);
      out.w = 0.25 / s;
      out.x = (m21 - m12) * s;
      out.y = (m02 - m20) * s;
      out.z = (m10 - m01) * s;
    } else if (m00 > m11 && m00 > m22) {
      var _s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);

      out.w = (m21 - m12) / _s;
      out.x = 0.25 * _s;
      out.y = (m01 + m10) / _s;
      out.z = (m02 + m20) / _s;
    } else if (m11 > m22) {
      var _s2 = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);

      out.w = (m02 - m20) / _s2;
      out.x = (m01 + m10) / _s2;
      out.y = 0.25 * _s2;
      out.z = (m12 + m21) / _s2;
    } else {
      var _s3 = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);

      out.w = (m10 - m01) / _s3;
      out.x = (m02 + m20) / _s3;
      out.y = (m12 + m21) / _s3;
      out.z = 0.25 * _s3;
    }

    return out;
  }
  /**
   * !#zh 根据欧拉角信息计算四元数，旋转顺序为 YZX
   * !#en The quaternion calculated Euler angle information, rotation order YZX
   * @method fromEuler
   * @typescript
   * fromEuler<Out extends IQuatLike> (out: Out, x: number, y: number, z: number)
   * @static
   */
  ;

  Quat.fromEuler = function fromEuler(out, x, y, z) {
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    var sx = Math.sin(x);
    var cx = Math.cos(x);
    var sy = Math.sin(y);
    var cy = Math.cos(y);
    var sz = Math.sin(z);
    var cz = Math.cos(z);
    out.x = sx * cy * cz + cx * sy * sz;
    out.y = cx * sy * cz + sx * cy * sz;
    out.z = cx * cy * sz - sx * sy * cz;
    out.w = cx * cy * cz - sx * sy * sz;
    return out;
  }
  /**
   * !#zh 返回定义此四元数的坐标系 X 轴向量
   * !#en This returns the result of the quaternion coordinate system X-axis vector
   * @method toAxisX
   * @typescript
   * toAxisX<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out)
   * @static
   */
  ;

  Quat.toAxisX = function toAxisX(out, q) {
    var fy = 2.0 * q.y;
    var fz = 2.0 * q.z;
    out.x = 1.0 - fy * q.y - fz * q.z;
    out.y = fy * q.x + fz * q.w;
    out.z = fz * q.x + fy * q.w;
    return out;
  }
  /**
   * !#zh 返回定义此四元数的坐标系 Y 轴向量
   * !#en This returns the result of the quaternion coordinate system Y axis vector
   * @method toAxisY
   * @typescript
   * toAxisY<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out)
   * @static
   */
  ;

  Quat.toAxisY = function toAxisY(out, q) {
    var fx = 2.0 * q.x;
    var fy = 2.0 * q.y;
    var fz = 2.0 * q.z;
    out.x = fy * q.x - fz * q.w;
    out.y = 1.0 - fx * q.x - fz * q.z;
    out.z = fz * q.y + fx * q.w;
    return out;
  }
  /**
   * !#zh 返回定义此四元数的坐标系 Z 轴向量
   * !#en This returns the result of the quaternion coordinate system the Z-axis vector
   * @method toAxisZ
   * @typescript
   * toAxisZ<Out extends IQuatLike, VecLike extends IVec3Like> (out: VecLike, q: Out)
   * @static
   */
  ;

  Quat.toAxisZ = function toAxisZ(out, q) {
    var fx = 2.0 * q.x;
    var fy = 2.0 * q.y;
    var fz = 2.0 * q.z;
    out.x = fz * q.x - fy * q.w;
    out.y = fz * q.y - fx * q.w;
    out.z = 1.0 - fx * q.x - fy * q.y;
    return out;
  }
  /**
   * !#zh 根据四元数计算欧拉角，返回角度 x, y 在 [-180, 180] 区间内, z 默认在 [-90, 90] 区间内，旋转顺序为 YZX
   * !#en The quaternion calculated Euler angles, return angle x, y in the [-180, 180] interval, z default the range [-90, 90] interval, the rotation order YZX
   * @method toEuler
   * @typescript
   * toEuler<Out extends IVec3Like> (out: Out, q: IQuatLike, outerZ?: boolean)
   * @param outerZ z 取值范围区间改为 [-180, -90] U [90, 180]
   * @static
   */
  ;

  Quat.toEuler = function toEuler(out, q, outerZ) {
    var x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    var bank = 0;
    var heading = 0;
    var attitude = 0;
    var test = x * y + z * w;

    if (test > 0.499999) {
      bank = 0; // default to zero

      heading = (0, _utils.toDegree)(2 * Math.atan2(x, w));
      attitude = 90;
    } else if (test < -0.499999) {
      bank = 0; // default to zero

      heading = -(0, _utils.toDegree)(2 * Math.atan2(x, w));
      attitude = -90;
    } else {
      var sqx = x * x;
      var sqy = y * y;
      var sqz = z * z;
      bank = (0, _utils.toDegree)(Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz));
      heading = (0, _utils.toDegree)(Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz));
      attitude = (0, _utils.toDegree)(Math.asin(2 * test));

      if (outerZ) {
        bank = -180 * Math.sign(bank + 1e-6) + bank;
        heading = -180 * Math.sign(heading + 1e-6) + heading;
        attitude = 180 * Math.sign(attitude + 1e-6) - attitude;
      }
    }

    out.x = bank;
    out.y = heading;
    out.z = attitude;
    return out;
  }
  /**
   * !#zh 四元数等价判断
   * !#en Analyzing quaternion equivalent
   * @method strictEquals
   * @typescript
   * strictEquals<Out extends IQuatLike> (a: Out, b: Out)
   * @static
   */
  ;

  Quat.strictEquals = function strictEquals(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
  }
  /**
   * !#zh 排除浮点数误差的四元数近似等价判断
   * !#en Negative floating point error quaternion approximately equivalent Analyzing
   * @method equals
   * @typescript
   * equals<Out extends IQuatLike> (a: Out, b: Out, epsilon = EPSILON)
   * @static
   */
  ;

  Quat.equals = function equals(a, b, epsilon) {
    if (epsilon === void 0) {
      epsilon = _utils.EPSILON;
    }

    return Math.abs(a.x - b.x) <= epsilon * Math.max(1.0, Math.abs(a.x), Math.abs(b.x)) && Math.abs(a.y - b.y) <= epsilon * Math.max(1.0, Math.abs(a.y), Math.abs(b.y)) && Math.abs(a.z - b.z) <= epsilon * Math.max(1.0, Math.abs(a.z), Math.abs(b.z)) && Math.abs(a.w - b.w) <= epsilon * Math.max(1.0, Math.abs(a.w), Math.abs(b.w));
  }
  /**
   * !#zh 四元数转数组
   * !#en Quaternion rotation array
   * @method toArray
   * @typescript
   * toArray <Out extends IWritableArrayLike<number>> (out: Out, q: IQuatLike, ofs = 0)
   * @param ofs 数组内的起始偏移量
   * @static
   */
  ;

  Quat.toArray = function toArray(out, q, ofs) {
    if (ofs === void 0) {
      ofs = 0;
    }

    out[ofs + 0] = q.x;
    out[ofs + 1] = q.y;
    out[ofs + 2] = q.z;
    out[ofs + 3] = q.w;
    return out;
  }
  /**
   * !#zh 数组转四元数
   * !#en Array to a quaternion
   * @method fromArray
   * @typescript
   * fromArray <Out extends IQuatLike> (out: Out, arr: IWritableArrayLike<number>, ofs = 0)
   * @param ofs 数组起始偏移量
   * @static
   */
  ;

  Quat.fromArray = function fromArray(out, arr, ofs) {
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

  function Quat(x, y, z, w) {
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
      w = 1;
    }

    _this = _ValueType.call(this) || this;
    _this.x = void 0;
    _this.y = void 0;
    _this.z = void 0;
    _this.w = void 0;

    if (x && typeof x === 'object') {
      _this.z = x.z;
      _this.y = x.y;
      _this.w = x.w;
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
   * !#en clone a Quat object and return the new object
   * !#zh 克隆一个四元数并返回
   * @method clone
   * @return {Quat}
   */


  _proto.clone = function clone() {
    return new Quat(this.x, this.y, this.z, this.w);
  }
  /**
   * !#en Set values with another quaternion
   * !#zh 用另一个四元数的值设置到当前对象上。
   * @method set
   * @param {Quat} newValue - !#en new value to set. !#zh 要设置的新值
   * @return {Quat} returns this
   * @chainable
   */
  ;

  _proto.set = function set(newValue) {
    this.x = newValue.x;
    this.y = newValue.y;
    this.z = newValue.z;
    this.w = newValue.w;
    return this;
  }
  /**
   * !#en Check whether current quaternion equals another
   * !#zh 当前的四元数是否与指定的四元数相等。
   * @method equals
   * @param {Quat} other
   * @return {Boolean}
   */
  ;

  _proto.equals = function equals(other) {
    return other && this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
  }
  /**
   * !#en Convert quaternion to euler
   * !#zh 转换四元数到欧拉角
   * @method toEuler
   * @param {Vec3} out
   * @return {Vec3}
   */
  ;

  _proto.toEuler = function toEuler(out) {
    return Quat.toEuler(out, this);
  }
  /**
   * !#en Convert euler to quaternion
   * !#zh 转换欧拉角到四元数
   * @method fromEuler
   * @param {Vec3} euler
   * @return {Quat}
   */
  ;

  _proto.fromEuler = function fromEuler(euler) {
    return Quat.fromEuler(this, euler.x, euler.y, euler.z);
  }
  /**
   * !#en Calculate the interpolation result between this quaternion and another one with given ratio
   * !#zh 计算四元数的插值结果
   * @member lerp
   * @param {Quat} to
   * @param {Number} ratio
   * @param {Quat} [out]
   * @returns {Quat} out
   */
  ;

  _proto.lerp = function lerp(to, ratio, out) {
    out = out || new Quat();
    Quat.slerp(out, this, to, ratio);
    return out;
  }
  /**
   * !#en Calculate the multiply result between this quaternion and another one
   * !#zh 计算四元数乘积的结果
   * @member multiply
   * @param {Quat} other
   * @returns {Quat} this
   */
  ;

  _proto.multiply = function multiply(other) {
    return Quat.multiply(this, this, other);
  }
  /**
   * !#en Rotates a quaternion by the given angle (in radians) about a world space axis.
   * !#zh 围绕世界空间轴按给定弧度旋转四元数
   * @member rotateAround
   * @param {Quat} rot - Quaternion to rotate
   * @param {Vec3} axis - The axis around which to rotate in world space
   * @param {Number} rad - Angle (in radians) to rotate
   * @param {Quat} [out] - Quaternion to store result
   * @returns {Quat} out
   */
  ;

  _proto.rotateAround = function rotateAround(rot, axis, rad, out) {
    out = out || new Quat();
    return Quat.rotateAround(out, rot, axis, rad);
  };

  return Quat;
}(_valueType["default"]);

exports["default"] = Quat;
Quat.mul = Quat.multiply;
Quat.scale = Quat.multiplyScalar;
Quat.mag = Quat.len;
Quat.IDENTITY = Object.freeze(new Quat());
var qt_1 = new Quat();
var qt_2 = new Quat();
var v3_1 = new _vec["default"]();
var m3_1 = new _mat["default"]();
var halfToRad = 0.5 * Math.PI / 180.0;

_CCClass["default"].fastDefine('cc.Quat', Quat, {
  x: 0,
  y: 0,
  z: 0,
  w: 1
});
/**
 * @module cc
 */

/**
 * !#en The convenience method to create a new {{#crossLink "Quat"}}cc.Quat{{/crossLink}}.
 * !#zh 通过该简便的函数进行创建 {{#crossLink "Quat"}}cc.Quat{{/crossLink}} 对象。
 * @method quat
 * @param {Number|Object} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [z=0]
 * @param {Number} [w=1]
 * @return {Quat}
 */


cc.quat = function quat(x, y, z, w) {
  return new Quat(x, y, z, w);
};

cc.Quat = Quat;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInF1YXQudHMiXSwibmFtZXMiOlsiX3giLCJfeSIsIl96IiwiX3ciLCJRdWF0IiwibXVsIiwib3RoZXIiLCJvdXQiLCJtdWx0aXBseSIsImNsb25lIiwiYSIsIngiLCJ5IiwieiIsInciLCJjb3B5Iiwic2V0IiwiaWRlbnRpdHkiLCJyb3RhdGlvblRvIiwiYiIsImRvdCIsIlZlYzMiLCJjcm9zcyIsInYzXzEiLCJSSUdIVCIsIm1hZyIsIlVQIiwibm9ybWFsaXplIiwiZnJvbUF4aXNBbmdsZSIsIk1hdGgiLCJQSSIsImdldEF4aXNBbmdsZSIsIm91dEF4aXMiLCJxIiwicmFkIiwiYWNvcyIsInMiLCJzaW4iLCJtdWx0aXBseVNjYWxhciIsInNjYWxlQW5kQWRkIiwic2NhbGUiLCJyb3RhdGVYIiwiYngiLCJidyIsImNvcyIsInJvdGF0ZVkiLCJieSIsInJvdGF0ZVoiLCJieiIsInJvdGF0ZUFyb3VuZCIsInJvdCIsImF4aXMiLCJpbnZlcnQiLCJxdF8xIiwidHJhbnNmb3JtUXVhdCIsInJvdGF0ZUFyb3VuZExvY2FsIiwiY2FsY3VsYXRlVyIsInNxcnQiLCJhYnMiLCJsZXJwIiwidCIsInNsZXJwIiwic2NhbGUwIiwic2NhbGUxIiwiY29zb20iLCJvbWVnYSIsInNpbm9tIiwic3FsZXJwIiwiYyIsImQiLCJxdF8yIiwiaW52RG90IiwiY29uanVnYXRlIiwibGVuIiwibGVuZ3RoU3FyIiwiZnJvbUF4ZXMiLCJ4QXhpcyIsInlBeGlzIiwiekF4aXMiLCJNYXQzIiwibTNfMSIsImZyb21NYXQzIiwiZnJvbVZpZXdVcCIsInZpZXciLCJ1cCIsImZyb21BbmdsZVoiLCJoYWxmVG9SYWQiLCJtYXQiLCJtIiwibTAwIiwibTEwIiwibTIwIiwibTAxIiwibTExIiwibTIxIiwibTAyIiwibTEyIiwibTIyIiwidHJhY2UiLCJmcm9tRXVsZXIiLCJzeCIsImN4Iiwic3kiLCJjeSIsInN6IiwiY3oiLCJ0b0F4aXNYIiwiZnkiLCJmeiIsInRvQXhpc1kiLCJmeCIsInRvQXhpc1oiLCJ0b0V1bGVyIiwib3V0ZXJaIiwiYmFuayIsImhlYWRpbmciLCJhdHRpdHVkZSIsInRlc3QiLCJhdGFuMiIsInNxeCIsInNxeSIsInNxeiIsImFzaW4iLCJzaWduIiwic3RyaWN0RXF1YWxzIiwiZXF1YWxzIiwiZXBzaWxvbiIsIkVQU0lMT04iLCJtYXgiLCJ0b0FycmF5Iiwib2ZzIiwiZnJvbUFycmF5IiwiYXJyIiwibmV3VmFsdWUiLCJldWxlciIsInRvIiwicmF0aW8iLCJWYWx1ZVR5cGUiLCJJREVOVElUWSIsIk9iamVjdCIsImZyZWV6ZSIsIkNDQ2xhc3MiLCJmYXN0RGVmaW5lIiwiY2MiLCJxdWF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFFQSxJQUFJQSxFQUFVLEdBQUcsR0FBakI7QUFDQSxJQUFJQyxFQUFVLEdBQUcsR0FBakI7QUFDQSxJQUFJQyxFQUFVLEdBQUcsR0FBakI7QUFDQSxJQUFJQyxFQUFVLEdBQUcsR0FBakI7QUFFQTs7Ozs7Ozs7QUFRQTs7Ozs7Ozs7Ozs7OztJQVlxQkM7Ozs7Ozs7QUFLakI7Ozs7Ozs7O1NBUUFDLE1BQUEsYUFBS0MsS0FBTCxFQUFrQkMsR0FBbEIsRUFBb0M7QUFDaEMsV0FBT0gsSUFBSSxDQUFDSSxRQUFMLENBQWNELEdBQUcsSUFBSSxJQUFJSCxJQUFKLEVBQXJCLEVBQWlDLElBQWpDLEVBQXVDRSxLQUF2QyxDQUFQO0FBQ0g7O0FBSUQ7Ozs7Ozs7O09BUU9HLFFBQVAsZUFBcUNDLENBQXJDLEVBQTZDO0FBQ3pDLFdBQU8sSUFBSU4sSUFBSixDQUFTTSxDQUFDLENBQUNDLENBQVgsRUFBY0QsQ0FBQyxDQUFDRSxDQUFoQixFQUFtQkYsQ0FBQyxDQUFDRyxDQUFyQixFQUF3QkgsQ0FBQyxDQUFDSSxDQUExQixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7OztPQVFPQyxPQUFQLGNBQWdFUixHQUFoRSxFQUEwRUcsQ0FBMUUsRUFBdUY7QUFDbkZILElBQUFBLEdBQUcsQ0FB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QUFJLEdBQUcsSUFBSUYsZUFBSixFQUFiO0FBQ0EsSUFBTTJELElBQUksR0FBRyxJQUFJRCxlQUFKLEVBQWI7QUFDQSxJQUFNTyxTQUFTLEdBQUcsTUFBTXpELElBQUksQ0FBQ0MsRUFBWCxHQUFnQixLQUFsQzs7QUFFQStHLG9CQUFRQyxVQUFSLENBQW1CLFNBQW5CLEVBQThCMUksSUFBOUIsRUFBb0M7QUFBRU8sRUFBQUEsQ0FBQyxFQUFFLENBQUw7QUFBUUMsRUFBQUEsQ0FBQyxFQUFFLENBQVg7QUFBY0MsRUFBQUEsQ0FBQyxFQUFFLENBQWpCO0FBQW9CQyxFQUFBQSxDQUFDLEVBQUU7QUFBdkIsQ0FBcEM7QUFHQTs7OztBQUlBOzs7Ozs7Ozs7Ozs7QUFVQWlJLEVBQUUsQ0FBQ0MsSUFBSCxHQUFVLFNBQVNBLElBQVQsQ0FBZXJJLENBQWYsRUFBa0JDLENBQWxCLEVBQXFCQyxDQUFyQixFQUF3QkMsQ0FBeEIsRUFBMkI7QUFDakMsU0FBTyxJQUFJVixJQUFKLENBQVNPLENBQVQsRUFBWUMsQ0FBWixFQUFlQyxDQUFmLEVBQWtCQyxDQUFsQixDQUFQO0FBQ0gsQ0FGRDs7QUFJQWlJLEVBQUUsQ0FBQzNJLElBQUgsR0FBVUEsSUFBViIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgVmFsdWVUeXBlIGZyb20gJy4vdmFsdWUtdHlwZSc7XG5pbXBvcnQgQ0NDbGFzcyBmcm9tICcuLi9wbGF0Zm9ybS9DQ0NsYXNzJztcbmltcG9ydCBWZWMzIGZyb20gJy4vdmVjMyc7XG5pbXBvcnQgTWF0MyBmcm9tICcuL21hdDMnO1xuaW1wb3J0IHsgRVBTSUxPTiwgdG9EZWdyZWUgfSBmcm9tICcuL3V0aWxzJztcblxubGV0IF94OiBudW1iZXIgPSAwLjA7XG5sZXQgX3k6IG51bWJlciA9IDAuMDtcbmxldCBfejogbnVtYmVyID0gMC4wO1xubGV0IF93OiBudW1iZXIgPSAwLjA7XG5cbi8qKlxuICogISNlbiBSZXByZXNlbnRhdGlvbiBvZiAyRCB2ZWN0b3JzIGFuZCBwb2ludHMuXG4gKiAhI3poIOihqOekuiAyRCDlkJHph4/lkozlnZDmoIdcbiAqXG4gKiBAY2xhc3MgUXVhdFxuICogQGV4dGVuZHMgVmFsdWVUeXBlXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBDb25zdHJ1Y3RvclxuICogc2VlIHt7I2Nyb3NzTGluayBcImNjL3F1YXQ6bWV0aG9kXCJ9fWNjLnF1YXR7ey9jcm9zc0xpbmt9fVxuICogISN6aFxuICog5p6E6YCg5Ye95pWw77yM5Y+v5p+l55yLIHt7I2Nyb3NzTGluayBcImNjL3F1YXQ6bWV0aG9kXCJ9fWNjLnF1YXR7ey9jcm9zc0xpbmt9fVxuICogQG1ldGhvZCBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtudW1iZXJ9IFt4PTBdXG4gKiBAcGFyYW0ge251bWJlcn0gW3k9MF1cbiAqIEBwYXJhbSB7bnVtYmVyfSBbej0wXVxuICogQHBhcmFtIHtudW1iZXJ9IFt3PTFdXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1YXQgZXh0ZW5kcyBWYWx1ZVR5cGUge1xuICAgIHN0YXRpYyBtdWwgPSBRdWF0Lm11bHRpcGx5O1xuICAgIHN0YXRpYyBzY2FsZSA9IFF1YXQubXVsdGlwbHlTY2FsYXI7XG4gICAgc3RhdGljIG1hZyA9IFF1YXQubGVuO1xuXG4gICAgLyoqXG4gICAgICogISNlbiBDYWxjdWxhdGUgdGhlIG11bHRpcGx5IHJlc3VsdCBiZXR3ZWVuIHRoaXMgcXVhdGVybmlvbiBhbmQgYW5vdGhlciBvbmVcbiAgICAgKiAhI3poIOiuoeeul+Wbm+WFg+aVsOS5mOenr+eahOe7k+aenFxuICAgICAqIEBtZXRob2QgbXVsXG4gICAgICogQHBhcmFtIHtRdWF0fSBvdGhlclxuICAgICAqIEBwYXJhbSB7UXVhdH0gW291dF1cbiAgICAgKiBAcmV0dXJucyB7UXVhdH0gb3V0XG4gICAgICovXG4gICAgbXVsIChvdGhlcjogUXVhdCwgb3V0PzogUXVhdCk6IFF1YXQge1xuICAgICAgICByZXR1cm4gUXVhdC5tdWx0aXBseShvdXQgfHwgbmV3IFF1YXQoKSwgdGhpcywgb3RoZXIpO1xuICAgIH1cblxuICAgIHN0YXRpYyBJREVOVElUWSA9IE9iamVjdC5mcmVlemUobmV3IFF1YXQoKSk7XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiOt+W+l+aMh+WumuWbm+WFg+aVsOeahOaLt+i0nVxuICAgICAqICEjZW4gT2J0YWluaW5nIGNvcHkgc3BlY2lmaWVkIHF1YXRlcm5pb25cbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjbG9uZTxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBjbG9uZTxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChhOiBPdXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBRdWF0KGEueCwgYS55LCBhLnosIGEudyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlpI3liLbnm67moIflm5vlhYPmlbBcbiAgICAgKiAhI2VuIENvcHkgcXVhdGVybmlvbiB0YXJnZXRcbiAgICAgKiBAbWV0aG9kIGNvcHlcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGNvcHk8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBRdWF0TGlrZSBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBRdWF0TGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNvcHk8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBRdWF0TGlrZSBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBRdWF0TGlrZSkge1xuICAgICAgICBvdXQueCA9IGEueDtcbiAgICAgICAgb3V0LnkgPSBhLnk7XG4gICAgICAgIG91dC56ID0gYS56O1xuICAgICAgICBvdXQudyA9IGEudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOiuvue9ruWbm+WFg+aVsOWAvFxuICAgICAqICEjZW4gUHJvdmlkZWQgUXVhdGVybmlvbiBWYWx1ZVxuICAgICAqIEBtZXRob2Qgc2V0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBzZXQ8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIsIHc6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHNldDxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlciwgdzogbnVtYmVyKSB7XG4gICAgICAgIG91dC54ID0geDtcbiAgICAgICAgb3V0LnkgPSB5O1xuICAgICAgICBvdXQueiA9IHo7XG4gICAgICAgIG91dC53ID0gdztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWwhuebruagh+i1i+WAvOS4uuWNleS9jeWbm+WFg+aVsFxuICAgICAqICEjZW4gVGhlIHRhcmdldCBvZiBhbiBhc3NpZ25tZW50IGFzIGEgdW5pdCBxdWF0ZXJuaW9uXG4gICAgICogQG1ldGhvZCBpZGVudGl0eVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogaWRlbnRpdHk8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBpZGVudGl0eTxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCkge1xuICAgICAgICBvdXQueCA9IDA7XG4gICAgICAgIG91dC55ID0gMDtcbiAgICAgICAgb3V0LnogPSAwO1xuICAgICAgICBvdXQudyA9IDE7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDorr7nva7lm5vlhYPmlbDkuLrkuKTlkJHph4/pl7TnmoTmnIDnn63ot6/lvoTml4vovazvvIzpu5jorqTkuKTlkJHph4/pg73lt7LlvZLkuIDljJZcbiAgICAgKiAhI2VuIFNldCBxdWF0ZXJuaW9uIHJvdGF0aW9uIGlzIHRoZSBzaG9ydGVzdCBwYXRoIGJldHdlZW4gdHdvIHZlY3RvcnMsIHRoZSBkZWZhdWx0IHR3byB2ZWN0b3JzIGFyZSBub3JtYWxpemVkXG4gICAgICogQG1ldGhvZCByb3RhdGlvblRvXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByb3RhdGlvblRvPE91dCBleHRlbmRzIElRdWF0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBhOiBWZWNMaWtlLCBiOiBWZWNMaWtlKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcm90YXRpb25UbzxPdXQgZXh0ZW5kcyBJUXVhdExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgYTogVmVjTGlrZSwgYjogVmVjTGlrZSkge1xuICAgICAgICBjb25zdCBkb3QgPSBWZWMzLmRvdChhLCBiKTtcbiAgICAgICAgaWYgKGRvdCA8IC0wLjk5OTk5OSkge1xuICAgICAgICAgICAgVmVjMy5jcm9zcyh2M18xLCBWZWMzLlJJR0hULCBhKTtcbiAgICAgICAgICAgIGlmICh2M18xLm1hZygpIDwgMC4wMDAwMDEpIHtcbiAgICAgICAgICAgICAgICBWZWMzLmNyb3NzKHYzXzEsIFZlYzMuVVAsIGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUodjNfMSwgdjNfMSk7XG4gICAgICAgICAgICBRdWF0LmZyb21BeGlzQW5nbGUob3V0LCB2M18xLCBNYXRoLlBJKTtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZG90ID4gMC45OTk5OTkpIHtcbiAgICAgICAgICAgIG91dC54ID0gMDtcbiAgICAgICAgICAgIG91dC55ID0gMDtcbiAgICAgICAgICAgIG91dC56ID0gMDtcbiAgICAgICAgICAgIG91dC53ID0gMTtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBWZWMzLmNyb3NzKHYzXzEsIGEsIGIpO1xuICAgICAgICAgICAgb3V0LnggPSB2M18xLng7XG4gICAgICAgICAgICBvdXQueSA9IHYzXzEueTtcbiAgICAgICAgICAgIG91dC56ID0gdjNfMS56O1xuICAgICAgICAgICAgb3V0LncgPSAxICsgZG90O1xuICAgICAgICAgICAgcmV0dXJuIFF1YXQubm9ybWFsaXplKG91dCwgb3V0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6I635Y+W5Zub5YWD5pWw55qE5peL6L2s6L205ZKM5peL6L2s5byn5bqmXG4gICAgICogISNlbiBHZXQgdGhlIHJvdGFyeSBzaGFmdCBhbmQgdGhlIGFyYyBvZiByb3RhdGlvbiBxdWF0ZXJuaW9uXG4gICAgICogQG1ldGhvZCBnZXRBeGlzQW5nbGVcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG91dEF4aXMgLSDml4vovazovbTovpPlh7pcbiAgICAgKiBAcGFyYW0ge1F1YXR9IHEgLSDmupDlm5vlhYPmlbBcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0g5peL6L2s5byn5bqmXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBnZXRBeGlzQW5nbGU8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0QXhpczogVmVjTGlrZSwgcTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0QXhpc0FuZ2xlPE91dCBleHRlbmRzIElRdWF0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dEF4aXM6IFZlY0xpa2UsIHE6IE91dCkge1xuICAgICAgICBjb25zdCByYWQgPSBNYXRoLmFjb3MocS53KSAqIDIuMDtcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKHJhZCAvIDIuMCk7XG4gICAgICAgIGlmIChzICE9PSAwLjApIHtcbiAgICAgICAgICAgIG91dEF4aXMueCA9IHEueCAvIHM7XG4gICAgICAgICAgICBvdXRBeGlzLnkgPSBxLnkgLyBzO1xuICAgICAgICAgICAgb3V0QXhpcy56ID0gcS56IC8gcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIHMgaXMgemVybywgcmV0dXJuIGFueSBheGlzIChubyByb3RhdGlvbiAtIGF4aXMgZG9lcyBub3QgbWF0dGVyKVxuICAgICAgICAgICAgb3V0QXhpcy54ID0gMTtcbiAgICAgICAgICAgIG91dEF4aXMueSA9IDA7XG4gICAgICAgICAgICBvdXRBeGlzLnogPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByYWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlm5vlhYPmlbDkuZjms5VcbiAgICAgKiAhI2VuIFF1YXRlcm5pb24gbXVsdGlwbGljYXRpb25cbiAgICAgKiBAbWV0aG9kIG11bHRpcGx5XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBtdWx0aXBseTxPdXQgZXh0ZW5kcyBJUXVhdExpa2UsIFF1YXRMaWtlXzEgZXh0ZW5kcyBJUXVhdExpa2UsIFF1YXRMaWtlXzIgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogUXVhdExpa2VfMSwgYjogUXVhdExpa2VfMilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5PE91dCBleHRlbmRzIElRdWF0TGlrZSwgUXVhdExpa2VfMSBleHRlbmRzIElRdWF0TGlrZSwgUXVhdExpa2VfMiBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBRdWF0TGlrZV8xLCBiOiBRdWF0TGlrZV8yKSB7XG4gICAgICAgIF94ID0gYS54ICogYi53ICsgYS53ICogYi54ICsgYS55ICogYi56IC0gYS56ICogYi55O1xuICAgICAgICBfeSA9IGEueSAqIGIudyArIGEudyAqIGIueSArIGEueiAqIGIueCAtIGEueCAqIGIuejtcbiAgICAgICAgX3ogPSBhLnogKiBiLncgKyBhLncgKiBiLnogKyBhLnggKiBiLnkgLSBhLnkgKiBiLng7XG4gICAgICAgIF93ID0gYS53ICogYi53IC0gYS54ICogYi54IC0gYS55ICogYi55IC0gYS56ICogYi56O1xuICAgICAgICBvdXQueCA9IF94O1xuICAgICAgICBvdXQueSA9IF95O1xuICAgICAgICBvdXQueiA9IF96O1xuICAgICAgICBvdXQudyA9IF93O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Zub5YWD5pWw5qCH6YeP5LmY5rOVXG4gICAgICogISNlbiBRdWF0ZXJuaW9uIHNjYWxhciBtdWx0aXBsaWNhdGlvblxuICAgICAqIEBtZXRob2QgbXVsdGlwbHlTY2FsYXJcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG11bHRpcGx5U2NhbGFyPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIG11bHRpcGx5U2NhbGFyPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IG51bWJlcikge1xuICAgICAgICBvdXQueCA9IGEueCAqIGI7XG4gICAgICAgIG91dC55ID0gYS55ICogYjtcbiAgICAgICAgb3V0LnogPSBhLnogKiBiO1xuICAgICAgICBvdXQudyA9IGEudyAqIGI7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlm5vlhYPmlbDkuZjliqDvvJpBICsgQiAqIHNjYWxlXG4gICAgICogISNlbiBRdWF0ZXJuaW9uIG11bHRpcGxpY2F0aW9uIGFuZCBhZGRpdGlvbjogQSArIEIgKiBzY2FsZVxuICAgICAqIEBtZXRob2Qgc2NhbGVBbmRBZGRcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHNjYWxlQW5kQWRkPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgc2NhbGU6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHNjYWxlQW5kQWRkPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgc2NhbGU6IG51bWJlcikge1xuICAgICAgICBvdXQueCA9IGEueCArIGIueCAqIHNjYWxlO1xuICAgICAgICBvdXQueSA9IGEueSArIGIueSAqIHNjYWxlO1xuICAgICAgICBvdXQueiA9IGEueiArIGIueiAqIHNjYWxlO1xuICAgICAgICBvdXQudyA9IGEudyArIGIudyAqIHNjYWxlO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg57uVIFgg6L205peL6L2s5oyH5a6a5Zub5YWD5pWwXG4gICAgICogISNlbiBBYm91dCB0aGUgWCBheGlzIHNwZWNpZmllZCBxdWF0ZXJuaW9uXG4gICAgICogQG1ldGhvZCByb3RhdGVYXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiByb3RhdGVYPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKVxuICAgICAqIEBwYXJhbSByYWQg5peL6L2s5byn5bqmXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyByb3RhdGVYPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIHJhZDogbnVtYmVyKSB7XG4gICAgICAgIHJhZCAqPSAwLjU7XG5cbiAgICAgICAgY29uc3QgYnggPSBNYXRoLnNpbihyYWQpO1xuICAgICAgICBjb25zdCBidyA9IE1hdGguY29zKHJhZCk7XG5cbiAgICAgICAgb3V0LnggPSBhLnggKiBidyArIGEudyAqIGJ4O1xuICAgICAgICBvdXQueSA9IGEueSAqIGJ3ICsgYS56ICogYng7XG4gICAgICAgIG91dC56ID0gYS56ICogYncgLSBhLnkgKiBieDtcbiAgICAgICAgb3V0LncgPSBhLncgKiBidyAtIGEueCAqIGJ4O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg57uVIFkg6L205peL6L2s5oyH5a6a5Zub5YWD5pWwXG4gICAgICogISNlbiBSb3RhdGlvbiBhYm91dCB0aGUgWSBheGlzIGRlc2lnbmF0ZWQgcXVhdGVybmlvblxuICAgICAqIEBtZXRob2Qgcm90YXRlWVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcm90YXRlWTxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCByYWQ6IG51bWJlcilcbiAgICAgKiBAcGFyYW0gcmFkIOaXi+i9rOW8p+W6plxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcm90YXRlWTxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCByYWQ6IG51bWJlcikge1xuICAgICAgICByYWQgKj0gMC41O1xuXG4gICAgICAgIGNvbnN0IGJ5ID0gTWF0aC5zaW4ocmFkKTtcbiAgICAgICAgY29uc3QgYncgPSBNYXRoLmNvcyhyYWQpO1xuXG4gICAgICAgIG91dC54ID0gYS54ICogYncgLSBhLnogKiBieTtcbiAgICAgICAgb3V0LnkgPSBhLnkgKiBidyArIGEudyAqIGJ5O1xuICAgICAgICBvdXQueiA9IGEueiAqIGJ3ICsgYS54ICogYnk7XG4gICAgICAgIG91dC53ID0gYS53ICogYncgLSBhLnkgKiBieTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOe7lSBaIOi9tOaXi+i9rOaMh+WumuWbm+WFg+aVsFxuICAgICAqICEjZW4gQXJvdW5kIHRoZSBaIGF4aXMgc3BlY2lmaWVkIHF1YXRlcm5pb25cbiAgICAgKiBAbWV0aG9kIHJvdGF0ZVpcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJvdGF0ZVo8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpXG4gICAgICogQHBhcmFtIHJhZCDml4vovazlvKfluqZcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdGF0ZVo8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgcmFkOiBudW1iZXIpIHtcbiAgICAgICAgcmFkICo9IDAuNTtcblxuICAgICAgICBjb25zdCBieiA9IE1hdGguc2luKHJhZCk7XG4gICAgICAgIGNvbnN0IGJ3ID0gTWF0aC5jb3MocmFkKTtcblxuICAgICAgICBvdXQueCA9IGEueCAqIGJ3ICsgYS55ICogYno7XG4gICAgICAgIG91dC55ID0gYS55ICogYncgLSBhLnggKiBiejtcbiAgICAgICAgb3V0LnogPSBhLnogKiBidyArIGEudyAqIGJ6O1xuICAgICAgICBvdXQudyA9IGEudyAqIGJ3IC0gYS56ICogYno7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnu5XkuJbnlYznqbrpl7TkuIvmjIflrprovbTml4vovazlm5vlhYPmlbBcbiAgICAgKiAhI2VuIFNwYWNlIGFyb3VuZCB0aGUgd29ybGQgYXQgYSBnaXZlbiBheGlzIG9mIHJvdGF0aW9uIHF1YXRlcm5pb25cbiAgICAgKiBAbWV0aG9kIHJvdGF0ZUFyb3VuZFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogcm90YXRlQXJvdW5kPE91dCBleHRlbmRzIElRdWF0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCByb3Q6IE91dCwgYXhpczogVmVjTGlrZSwgcmFkOiBudW1iZXIpXG4gICAgICogQHBhcmFtIGF4aXMg5peL6L2s6L2077yM6buY6K6k5bey5b2S5LiA5YyWXG4gICAgICogQHBhcmFtIHJhZCDml4vovazlvKfluqZcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdGF0ZUFyb3VuZDxPdXQgZXh0ZW5kcyBJUXVhdExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgcm90OiBPdXQsIGF4aXM6IFZlY0xpa2UsIHJhZDogbnVtYmVyKSB7XG4gICAgICAgIC8vIGdldCBpbnYtYXhpcyAobG9jYWwgdG8gcm90KVxuICAgICAgICBRdWF0LmludmVydChxdF8xLCByb3QpO1xuICAgICAgICBWZWMzLnRyYW5zZm9ybVF1YXQodjNfMSwgYXhpcywgcXRfMSk7XG4gICAgICAgIC8vIHJvdGF0ZSBieSBpbnYtYXhpc1xuICAgICAgICBRdWF0LmZyb21BeGlzQW5nbGUocXRfMSwgdjNfMSwgcmFkKTtcbiAgICAgICAgUXVhdC5tdWx0aXBseShvdXQsIHJvdCwgcXRfMSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDnu5XmnKzlnLDnqbrpl7TkuIvmjIflrprovbTml4vovazlm5vlhYPmlbBcbiAgICAgKiAhI2VuIExvY2FsIHNwYWNlIGFyb3VuZCB0aGUgc3BlY2lmaWVkIGF4aXMgcm90YXRpb24gcXVhdGVybmlvblxuICAgICAqIEBtZXRob2Qgcm90YXRlQXJvdW5kTG9jYWxcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIHJvdGF0ZUFyb3VuZExvY2FsPE91dCBleHRlbmRzIElRdWF0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCByb3Q6IE91dCwgYXhpczogVmVjTGlrZSwgcmFkOiBudW1iZXIpXG4gICAgICogQHBhcmFtIGF4aXMg5peL6L2s6L20XG4gICAgICogQHBhcmFtIHJhZCDml4vovazlvKfluqZcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHJvdGF0ZUFyb3VuZExvY2FsPE91dCBleHRlbmRzIElRdWF0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCByb3Q6IE91dCwgYXhpczogVmVjTGlrZSwgcmFkOiBudW1iZXIpIHtcbiAgICAgICAgUXVhdC5mcm9tQXhpc0FuZ2xlKHF0XzEsIGF4aXMsIHJhZCk7XG4gICAgICAgIFF1YXQubXVsdGlwbHkob3V0LCByb3QsIHF0XzEpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5qC55o2uIHh5eiDliIbph4/orqHnrpcgdyDliIbph4/vvIzpu5jorqTlt7LlvZLkuIDljJZcbiAgICAgKiAhI2VuIFRoZSBjb21wb25lbnQgdyB4eXogY29tcG9uZW50cyBjYWxjdWxhdGVkLCBub3JtYWxpemVkIGJ5IGRlZmF1bHRcbiAgICAgKiBAbWV0aG9kIGNhbGN1bGF0ZVdcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGNhbGN1bGF0ZVc8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGNhbGN1bGF0ZVc8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuXG4gICAgICAgIG91dC54ID0gYS54O1xuICAgICAgICBvdXQueSA9IGEueTtcbiAgICAgICAgb3V0LnogPSBhLno7XG4gICAgICAgIG91dC53ID0gTWF0aC5zcXJ0KE1hdGguYWJzKDEuMCAtIGEueCAqIGEueCAtIGEueSAqIGEueSAtIGEueiAqIGEueikpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5Zub5YWD5pWw54K556ev77yI5pWw6YeP56ev77yJXG4gICAgICogISNlbiBRdWF0ZXJuaW9uIGRvdCBwcm9kdWN0IChzY2FsYXIgcHJvZHVjdClcbiAgICAgKiBAbWV0aG9kIGRvdFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZG90PE91dCBleHRlbmRzIElRdWF0TGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZG90PE91dCBleHRlbmRzIElRdWF0TGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIHJldHVybiBhLnggKiBiLnggKyBhLnkgKiBiLnkgKyBhLnogKiBiLnogKyBhLncgKiBiLnc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDpgJDlhYPntKDnur/mgKfmj5LlgLzvvJogQSArIHQgKiAoQiAtIEEpXG4gICAgICogISNlbiBFbGVtZW50IGJ5IGVsZW1lbnQgbGluZWFyIGludGVycG9sYXRpb246IEEgKyB0ICogKEIgLSBBKVxuICAgICAqIEBtZXRob2QgbGVycFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogbGVycDxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIHQ6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGxlcnA8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCwgYjogT3V0LCB0OiBudW1iZXIpIHtcbiAgICAgICAgb3V0LnggPSBhLnggKyB0ICogKGIueCAtIGEueCk7XG4gICAgICAgIG91dC55ID0gYS55ICsgdCAqIChiLnkgLSBhLnkpO1xuICAgICAgICBvdXQueiA9IGEueiArIHQgKiAoYi56IC0gYS56KTtcbiAgICAgICAgb3V0LncgPSBhLncgKyB0ICogKGIudyAtIGEudyk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlm5vlhYPmlbDnkIPpnaLmj5LlgLxcbiAgICAgKiAhI2VuIFNwaGVyaWNhbCBxdWF0ZXJuaW9uIGludGVycG9sYXRpb25cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHNsZXJwPE91dCBleHRlbmRzIElRdWF0TGlrZSwgUXVhdExpa2VfMSBleHRlbmRzIElRdWF0TGlrZSwgUXVhdExpa2VfMiBleHRlbmRzIElRdWF0TGlrZT5cbiAgICAgICAgKG91dDogT3V0LCBhOiBRdWF0TGlrZV8xLCBiOiBRdWF0TGlrZV8yLCB0OiBudW1iZXIpIHtcbiAgICAgICAgLy8gYmVuY2htYXJrczpcbiAgICAgICAgLy8gICAgaHR0cDovL2pzcGVyZi5jb20vcXVhdGVybmlvbi1zbGVycC1pbXBsZW1lbnRhdGlvbnNcblxuICAgICAgICBsZXQgc2NhbGUwID0gMDtcbiAgICAgICAgbGV0IHNjYWxlMSA9IDA7XG5cbiAgICAgICAgLy8gY2FsYyBjb3NpbmVcbiAgICAgICAgbGV0IGNvc29tID0gYS54ICogYi54ICsgYS55ICogYi55ICsgYS56ICogYi56ICsgYS53ICogYi53O1xuICAgICAgICAvLyBhZGp1c3Qgc2lnbnMgKGlmIG5lY2Vzc2FyeSlcbiAgICAgICAgaWYgKGNvc29tIDwgMC4wKSB7XG4gICAgICAgICAgICBjb3NvbSA9IC1jb3NvbTtcbiAgICAgICAgICAgIGIueCA9IC1iLng7XG4gICAgICAgICAgICBiLnkgPSAtYi55O1xuICAgICAgICAgICAgYi56ID0gLWIuejtcbiAgICAgICAgICAgIGIudyA9IC1iLnc7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2FsY3VsYXRlIGNvZWZmaWNpZW50c1xuICAgICAgICBpZiAoKDEuMCAtIGNvc29tKSA+IDAuMDAwMDAxKSB7XG4gICAgICAgICAgICAvLyBzdGFuZGFyZCBjYXNlIChzbGVycClcbiAgICAgICAgICAgIGNvbnN0IG9tZWdhID0gTWF0aC5hY29zKGNvc29tKTtcbiAgICAgICAgICAgIGNvbnN0IHNpbm9tID0gTWF0aC5zaW4ob21lZ2EpO1xuICAgICAgICAgICAgc2NhbGUwID0gTWF0aC5zaW4oKDEuMCAtIHQpICogb21lZ2EpIC8gc2lub207XG4gICAgICAgICAgICBzY2FsZTEgPSBNYXRoLnNpbih0ICogb21lZ2EpIC8gc2lub207XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBcImZyb21cIiBhbmQgXCJ0b1wiIHF1YXRlcm5pb25zIGFyZSB2ZXJ5IGNsb3NlXG4gICAgICAgICAgICAvLyAgLi4uIHNvIHdlIGNhbiBkbyBhIGxpbmVhciBpbnRlcnBvbGF0aW9uXG4gICAgICAgICAgICBzY2FsZTAgPSAxLjAgLSB0O1xuICAgICAgICAgICAgc2NhbGUxID0gdDtcbiAgICAgICAgfVxuICAgICAgICAvLyBjYWxjdWxhdGUgZmluYWwgdmFsdWVzXG4gICAgICAgIG91dC54ID0gc2NhbGUwICogYS54ICsgc2NhbGUxICogYi54O1xuICAgICAgICBvdXQueSA9IHNjYWxlMCAqIGEueSArIHNjYWxlMSAqIGIueTtcbiAgICAgICAgb3V0LnogPSBzY2FsZTAgKiBhLnogKyBzY2FsZTEgKiBiLno7XG4gICAgICAgIG91dC53ID0gc2NhbGUwICogYS53ICsgc2NhbGUxICogYi53O1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDluKbkuKTkuKrmjqfliLbngrnnmoTlm5vlhYPmlbDnkIPpnaLmj5LlgLxcbiAgICAgKiAhI2VuIFF1YXRlcm5pb24gd2l0aCB0d28gc3BoZXJpY2FsIGludGVycG9sYXRpb24gY29udHJvbCBwb2ludHNcbiAgICAgKiBAbWV0aG9kIHNxbGVycFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3FsZXJwPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQsIGI6IE91dCwgYzogT3V0LCBkOiBPdXQsIHQ6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHNxbGVycDxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogT3V0LCBiOiBPdXQsIGM6IE91dCwgZDogT3V0LCB0OiBudW1iZXIpIHtcbiAgICAgICAgUXVhdC5zbGVycChxdF8xLCBhLCBkLCB0KTtcbiAgICAgICAgUXVhdC5zbGVycChxdF8yLCBiLCBjLCB0KTtcbiAgICAgICAgUXVhdC5zbGVycChvdXQsIHF0XzEsIHF0XzIsIDIgKiB0ICogKDEgLSB0KSk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlm5vlhYPmlbDmsYLpgIZcbiAgICAgKiAhI2VuIFF1YXRlcm5pb24gaW52ZXJzZVxuICAgICAqIEBtZXRob2QgaW52ZXJ0XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBpbnZlcnQ8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBRdWF0TGlrZSBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBRdWF0TGlrZSlcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGludmVydDxPdXQgZXh0ZW5kcyBJUXVhdExpa2UsIFF1YXRMaWtlIGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IFF1YXRMaWtlKSB7XG4gICAgICAgIGNvbnN0IGRvdCA9IGEueCAqIGEueCArIGEueSAqIGEueSArIGEueiAqIGEueiArIGEudyAqIGEudztcbiAgICAgICAgY29uc3QgaW52RG90ID0gZG90ID8gMS4wIC8gZG90IDogMDtcblxuICAgICAgICAvLyBUT0RPOiBXb3VsZCBiZSBmYXN0ZXIgdG8gcmV0dXJuIFswLDAsMCwwXSBpbW1lZGlhdGVseSBpZiBkb3QgPT0gMFxuXG4gICAgICAgIG91dC54ID0gLWEueCAqIGludkRvdDtcbiAgICAgICAgb3V0LnkgPSAtYS55ICogaW52RG90O1xuICAgICAgICBvdXQueiA9IC1hLnogKiBpbnZEb3Q7XG4gICAgICAgIG91dC53ID0gYS53ICogaW52RG90O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5rGC5YWx6L2t5Zub5YWD5pWw77yM5a+55Y2V5L2N5Zub5YWD5pWw5LiO5rGC6YCG562J5Lu377yM5L2G5pu06auY5pWIXG4gICAgICogISNlbiBDb25qdWdhdGluZyBhIHF1YXRlcm5pb24sIGFuZCB0aGUgdW5pdCBxdWF0ZXJuaW9uIGVxdWl2YWxlbnQgdG8gaW52ZXJzaW9uLCBidXQgbW9yZSBlZmZpY2llbnRcbiAgICAgKiBAbWV0aG9kIGNvbmp1Z2F0ZVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogY29uanVnYXRlPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBjb25qdWdhdGU8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAob3V0OiBPdXQsIGE6IE91dCkge1xuICAgICAgICBvdXQueCA9IC1hLng7XG4gICAgICAgIG91dC55ID0gLWEueTtcbiAgICAgICAgb3V0LnogPSAtYS56O1xuICAgICAgICBvdXQudyA9IGEudztcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaxguWbm+WFg+aVsOmVv+W6plxuICAgICAqICEjZW4gU2VlayBsZW5ndGggcXVhdGVybmlvblxuICAgICAqIEBtZXRob2QgbGVuXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBsZW48T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAoYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbGVuPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKGE6IE91dCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGEueCAqIGEueCArIGEueSAqIGEueSArIGEueiAqIGEueiArIGEudyAqIGEudyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmsYLlm5vlhYPmlbDplb/luqblubPmlrlcbiAgICAgKiAhI2VuIFNlZWtpbmcgcXVhdGVybmlvbiBzcXVhcmUgb2YgdGhlIGxlbmd0aFxuICAgICAqIEBtZXRob2QgbGVuZ3RoU3FyXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBsZW5ndGhTcXI8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAoYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbGVuZ3RoU3FyPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKGE6IE91dCkge1xuICAgICAgICByZXR1cm4gYS54ICogYS54ICsgYS55ICogYS55ICsgYS56ICogYS56ICsgYS53ICogYS53O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5b2S5LiA5YyW5Zub5YWD5pWwXG4gICAgICogISNlbiBOb3JtYWxpemVkIHF1YXRlcm5pb25zXG4gICAgICogQG1ldGhvZCBub3JtYWxpemVcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG5vcm1hbGl6ZTxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgbm9ybWFsaXplPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBhOiBPdXQpIHtcbiAgICAgICAgbGV0IGxlbiA9IGEueCAqIGEueCArIGEueSAqIGEueSArIGEueiAqIGEueiArIGEudyAqIGEudztcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICAgICAgICAgIG91dC54ID0gYS54ICogbGVuO1xuICAgICAgICAgICAgb3V0LnkgPSBhLnkgKiBsZW47XG4gICAgICAgICAgICBvdXQueiA9IGEueiAqIGxlbjtcbiAgICAgICAgICAgIG91dC53ID0gYS53ICogbGVuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmoLnmja7mnKzlnLDlnZDmoIfovbTmnJ3lkJHorqHnrpflm5vlhYPmlbDvvIzpu5jorqTkuInlkJHph4/pg73lt7LlvZLkuIDljJbkuJTnm7jkupLlnoLnm7RcbiAgICAgKiAhI2VuIENhbGN1bGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSBsb2NhbCBvcmllbnRhdGlvbiBxdWF0ZXJuaW9uIGNvb3JkaW5hdGUgYXhpcywgdGhlIGRlZmF1bHQgdGhyZWUgdmVjdG9ycyBhcmUgbm9ybWFsaXplZCBhbmQgbXV0dWFsbHkgcGVycGVuZGljdWxhclxuICAgICAqIEBtZXRob2QgZnJvbUF4ZXNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21BeGVzPE91dCBleHRlbmRzIElRdWF0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCB4QXhpczogVmVjTGlrZSwgeUF4aXM6IFZlY0xpa2UsIHpBeGlzOiBWZWNMaWtlKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUF4ZXM8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIHhBeGlzOiBWZWNMaWtlLCB5QXhpczogVmVjTGlrZSwgekF4aXM6IFZlY0xpa2UpIHtcbiAgICAgICAgTWF0My5zZXQobTNfMSxcbiAgICAgICAgICAgIHhBeGlzLngsIHhBeGlzLnksIHhBeGlzLnosXG4gICAgICAgICAgICB5QXhpcy54LCB5QXhpcy55LCB5QXhpcy56LFxuICAgICAgICAgICAgekF4aXMueCwgekF4aXMueSwgekF4aXMueixcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIFF1YXQubm9ybWFsaXplKG91dCwgUXVhdC5mcm9tTWF0MyhvdXQsIG0zXzEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOagueaNruinhuWPo+eahOWJjeaWueWQkeWSjOS4iuaWueWQkeiuoeeul+Wbm+WFg+aVsFxuICAgICAqICEjZW4gVGhlIGZvcndhcmQgZGlyZWN0aW9uIGFuZCB0aGUgZGlyZWN0aW9uIG9mIHRoZSB2aWV3cG9ydCBjb21wdXRpbmcgcXVhdGVybmlvblxuICAgICAqIEBtZXRob2QgZnJvbVZpZXdVcFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZnJvbVZpZXdVcDxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgdmlldzogVmVjMywgdXA/OiBWZWMzKVxuICAgICAqIEBwYXJhbSB2aWV3IOinhuWPo+mdouWQkeeahOWJjeaWueWQke+8jOW/hemhu+W9kuS4gOWMllxuICAgICAqIEBwYXJhbSB1cCDop4blj6PnmoTkuIrmlrnlkJHvvIzlv4XpobvlvZLkuIDljJbvvIzpu5jorqTkuLogKDAsIDEsIDApXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tVmlld1VwPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCB2aWV3OiBWZWMzLCB1cD86IFZlYzMpIHtcbiAgICAgICAgTWF0My5mcm9tVmlld1VwKG0zXzEsIHZpZXcsIHVwKTtcbiAgICAgICAgcmV0dXJuIFF1YXQubm9ybWFsaXplKG91dCwgUXVhdC5mcm9tTWF0MyhvdXQsIG0zXzEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOagueaNruaXi+i9rOi9tOWSjOaXi+i9rOW8p+W6puiuoeeul+Wbm+WFg+aVsFxuICAgICAqICEjZW4gVGhlIHF1YXRlcm5pb24gY2FsY3VsYXRlZCBhbmQgdGhlIGFyYyBvZiByb3RhdGlvbiBvZiB0aGUgcm90YXJ5IHNoYWZ0XG4gICAgICogQG1ldGhvZCBmcm9tQXhpc0FuZ2xlXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBmcm9tQXhpc0FuZ2xlPE91dCBleHRlbmRzIElRdWF0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBheGlzOiBWZWNMaWtlLCByYWQ6IG51bWJlcilcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIGZyb21BeGlzQW5nbGU8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBPdXQsIGF4aXM6IFZlY0xpa2UsIHJhZDogbnVtYmVyKSB7XG4gICAgICAgIHJhZCA9IHJhZCAqIDAuNTtcbiAgICAgICAgY29uc3QgcyA9IE1hdGguc2luKHJhZCk7XG4gICAgICAgIG91dC54ID0gcyAqIGF4aXMueDtcbiAgICAgICAgb3V0LnkgPSBzICogYXhpcy55O1xuICAgICAgICBvdXQueiA9IHMgKiBheGlzLno7XG4gICAgICAgIG91dC53ID0gTWF0aC5jb3MocmFkKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXQgYSBxdWF0ZXJuaW9uIGZyb20gdGhlIGdpdmVuIGV1bGVyIGFuZ2xlIDAsIDAsIHouXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3F1YXR9IG91dCAtIFF1YXRlcm5pb24gdG8gc3RvcmUgcmVzdWx0LlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6IC0gQW5nbGUgdG8gcm90YXRlIGFyb3VuZCBaIGF4aXMgaW4gZGVncmVlcy5cbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUFuZ2xlWiAob3V0OiBRdWF0LCB6OiBudW1iZXIpOiBRdWF0IHtcbiAgICAgICAgeiAqPSBoYWxmVG9SYWQ7XG4gICAgICAgIG91dC54ID0gb3V0LnkgPSAwO1xuICAgICAgICBvdXQueiA9IE1hdGguc2luKHopO1xuICAgICAgICBvdXQudyA9IE1hdGguY29zKHopO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5qC55o2u5LiJ57u055+p6Zi15L+h5oGv6K6h566X5Zub5YWD5pWw77yM6buY6K6k6L6T5YWl55+p6Zi15LiN5ZCr5pyJ57yp5pS+5L+h5oGvXG4gICAgICogISNlbiBDYWxjdWxhdGluZyB0aGUgdGhyZWUtZGltZW5zaW9uYWwgcXVhdGVybmlvbiBtYXRyaXggaW5mb3JtYXRpb24sIGRlZmF1bHQgem9vbSBpbmZvcm1hdGlvbiBpbnB1dCBtYXRyaXggZG9lcyBub3QgY29udGFpblxuICAgICAqIEBtZXRob2QgZnJvbU1hdDNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGZyb21NYXQzPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCBtYXQ6IE1hdDMpXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBmcm9tTWF0MzxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgbWF0OiBNYXQzKSB7XG4gICAgICAgIGxldCBtID0gbWF0Lm07XG4gICAgICAgIGxldCBtMDAgPSBtWzBdLCBtMTAgPSBtWzFdLCBtMjAgPSBtWzJdLFxuICAgICAgICAgICAgbTAxID0gbVszXSwgbTExID0gbVs0XSwgbTIxID0gbVs1XSxcbiAgICAgICAgICAgIG0wMiA9IG1bNl0sIG0xMiA9IG1bN10sIG0yMiA9IG1bOF07XG5cbiAgICAgICAgY29uc3QgdHJhY2UgPSBtMDAgKyBtMTEgKyBtMjI7XG5cbiAgICAgICAgaWYgKHRyYWNlID4gMCkge1xuICAgICAgICAgICAgY29uc3QgcyA9IDAuNSAvIE1hdGguc3FydCh0cmFjZSArIDEuMCk7XG5cbiAgICAgICAgICAgIG91dC53ID0gMC4yNSAvIHM7XG4gICAgICAgICAgICBvdXQueCA9IChtMjEgLSBtMTIpICogcztcbiAgICAgICAgICAgIG91dC55ID0gKG0wMiAtIG0yMCkgKiBzO1xuICAgICAgICAgICAgb3V0LnogPSAobTEwIC0gbTAxKSAqIHM7XG5cbiAgICAgICAgfSBlbHNlIGlmICgobTAwID4gbTExKSAmJiAobTAwID4gbTIyKSkge1xuICAgICAgICAgICAgY29uc3QgcyA9IDIuMCAqIE1hdGguc3FydCgxLjAgKyBtMDAgLSBtMTEgLSBtMjIpO1xuXG4gICAgICAgICAgICBvdXQudyA9IChtMjEgLSBtMTIpIC8gcztcbiAgICAgICAgICAgIG91dC54ID0gMC4yNSAqIHM7XG4gICAgICAgICAgICBvdXQueSA9IChtMDEgKyBtMTApIC8gcztcbiAgICAgICAgICAgIG91dC56ID0gKG0wMiArIG0yMCkgLyBzO1xuXG4gICAgICAgIH0gZWxzZSBpZiAobTExID4gbTIyKSB7XG4gICAgICAgICAgICBjb25zdCBzID0gMi4wICogTWF0aC5zcXJ0KDEuMCArIG0xMSAtIG0wMCAtIG0yMik7XG5cbiAgICAgICAgICAgIG91dC53ID0gKG0wMiAtIG0yMCkgLyBzO1xuICAgICAgICAgICAgb3V0LnggPSAobTAxICsgbTEwKSAvIHM7XG4gICAgICAgICAgICBvdXQueSA9IDAuMjUgKiBzO1xuICAgICAgICAgICAgb3V0LnogPSAobTEyICsgbTIxKSAvIHM7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHMgPSAyLjAgKiBNYXRoLnNxcnQoMS4wICsgbTIyIC0gbTAwIC0gbTExKTtcblxuICAgICAgICAgICAgb3V0LncgPSAobTEwIC0gbTAxKSAvIHM7XG4gICAgICAgICAgICBvdXQueCA9IChtMDIgKyBtMjApIC8gcztcbiAgICAgICAgICAgIG91dC55ID0gKG0xMiArIG0yMSkgLyBzO1xuICAgICAgICAgICAgb3V0LnogPSAwLjI1ICogcztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDmoLnmja7mrKfmi4nop5Lkv6Hmga/orqHnrpflm5vlhYPmlbDvvIzml4vovazpobrluo/kuLogWVpYXG4gICAgICogISNlbiBUaGUgcXVhdGVybmlvbiBjYWxjdWxhdGVkIEV1bGVyIGFuZ2xlIGluZm9ybWF0aW9uLCByb3RhdGlvbiBvcmRlciBZWlhcbiAgICAgKiBAbWV0aG9kIGZyb21FdWxlclxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZnJvbUV1bGVyPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUV1bGVyPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKG91dDogT3V0LCB4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKSB7XG4gICAgICAgIHggKj0gaGFsZlRvUmFkO1xuICAgICAgICB5ICo9IGhhbGZUb1JhZDtcbiAgICAgICAgeiAqPSBoYWxmVG9SYWQ7XG5cbiAgICAgICAgY29uc3Qgc3ggPSBNYXRoLnNpbih4KTtcbiAgICAgICAgY29uc3QgY3ggPSBNYXRoLmNvcyh4KTtcbiAgICAgICAgY29uc3Qgc3kgPSBNYXRoLnNpbih5KTtcbiAgICAgICAgY29uc3QgY3kgPSBNYXRoLmNvcyh5KTtcbiAgICAgICAgY29uc3Qgc3ogPSBNYXRoLnNpbih6KTtcbiAgICAgICAgY29uc3QgY3ogPSBNYXRoLmNvcyh6KTtcblxuICAgICAgICBvdXQueCA9IHN4ICogY3kgKiBjeiArIGN4ICogc3kgKiBzejtcbiAgICAgICAgb3V0LnkgPSBjeCAqIHN5ICogY3ogKyBzeCAqIGN5ICogc3o7XG4gICAgICAgIG91dC56ID0gY3ggKiBjeSAqIHN6IC0gc3ggKiBzeSAqIGN6O1xuICAgICAgICBvdXQudyA9IGN4ICogY3kgKiBjeiAtIHN4ICogc3kgKiBzejtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6L+U5Zue5a6a5LmJ5q2k5Zub5YWD5pWw55qE5Z2Q5qCH57O7IFgg6L205ZCR6YePXG4gICAgICogISNlbiBUaGlzIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgcXVhdGVybmlvbiBjb29yZGluYXRlIHN5c3RlbSBYLWF4aXMgdmVjdG9yXG4gICAgICogQG1ldGhvZCB0b0F4aXNYXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiB0b0F4aXNYPE91dCBleHRlbmRzIElRdWF0TGlrZSwgVmVjTGlrZSBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogVmVjTGlrZSwgcTogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgdG9BeGlzWDxPdXQgZXh0ZW5kcyBJUXVhdExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IFZlY0xpa2UsIHE6IE91dCkge1xuICAgICAgICBjb25zdCBmeSA9IDIuMCAqIHEueTtcbiAgICAgICAgY29uc3QgZnogPSAyLjAgKiBxLno7XG4gICAgICAgIG91dC54ID0gMS4wIC0gZnkgKiBxLnkgLSBmeiAqIHEuejtcbiAgICAgICAgb3V0LnkgPSBmeSAqIHEueCArIGZ6ICogcS53O1xuICAgICAgICBvdXQueiA9IGZ6ICogcS54ICsgZnkgKiBxLnc7XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOi/lOWbnuWumuS5ieatpOWbm+WFg+aVsOeahOWdkOagh+ezuyBZIOi9tOWQkemHj1xuICAgICAqICEjZW4gVGhpcyByZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIHF1YXRlcm5pb24gY29vcmRpbmF0ZSBzeXN0ZW0gWSBheGlzIHZlY3RvclxuICAgICAqIEBtZXRob2QgdG9BeGlzWVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdG9BeGlzWTxPdXQgZXh0ZW5kcyBJUXVhdExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IFZlY0xpa2UsIHE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRvQXhpc1k8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBWZWNMaWtlLCBxOiBPdXQpIHtcbiAgICAgICAgY29uc3QgZnggPSAyLjAgKiBxLng7XG4gICAgICAgIGNvbnN0IGZ5ID0gMi4wICogcS55O1xuICAgICAgICBjb25zdCBmeiA9IDIuMCAqIHEuejtcbiAgICAgICAgb3V0LnggPSBmeSAqIHEueCAtIGZ6ICogcS53O1xuICAgICAgICBvdXQueSA9IDEuMCAtIGZ4ICogcS54IC0gZnogKiBxLno7XG4gICAgICAgIG91dC56ID0gZnogKiBxLnkgKyBmeCAqIHEudztcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg6L+U5Zue5a6a5LmJ5q2k5Zub5YWD5pWw55qE5Z2Q5qCH57O7IFog6L205ZCR6YePXG4gICAgICogISNlbiBUaGlzIHJldHVybnMgdGhlIHJlc3VsdCBvZiB0aGUgcXVhdGVybmlvbiBjb29yZGluYXRlIHN5c3RlbSB0aGUgWi1heGlzIHZlY3RvclxuICAgICAqIEBtZXRob2QgdG9BeGlzWlxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdG9BeGlzWjxPdXQgZXh0ZW5kcyBJUXVhdExpa2UsIFZlY0xpa2UgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IFZlY0xpa2UsIHE6IE91dClcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RhdGljIHRvQXhpc1o8T3V0IGV4dGVuZHMgSVF1YXRMaWtlLCBWZWNMaWtlIGV4dGVuZHMgSVZlYzNMaWtlPiAob3V0OiBWZWNMaWtlLCBxOiBPdXQpIHtcbiAgICAgICAgY29uc3QgZnggPSAyLjAgKiBxLng7XG4gICAgICAgIGNvbnN0IGZ5ID0gMi4wICogcS55O1xuICAgICAgICBjb25zdCBmeiA9IDIuMCAqIHEuejtcbiAgICAgICAgb3V0LnggPSBmeiAqIHEueCAtIGZ5ICogcS53O1xuICAgICAgICBvdXQueSA9IGZ6ICogcS55IC0gZnggKiBxLnc7XG4gICAgICAgIG91dC56ID0gMS4wIC0gZnggKiBxLnggLSBmeSAqIHEueTtcblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5qC55o2u5Zub5YWD5pWw6K6h566X5qyn5ouJ6KeS77yM6L+U5Zue6KeS5bqmIHgsIHkg5ZyoIFstMTgwLCAxODBdIOWMuumXtOWGhSwgeiDpu5jorqTlnKggWy05MCwgOTBdIOWMuumXtOWGhe+8jOaXi+i9rOmhuuW6j+S4uiBZWlhcbiAgICAgKiAhI2VuIFRoZSBxdWF0ZXJuaW9uIGNhbGN1bGF0ZWQgRXVsZXIgYW5nbGVzLCByZXR1cm4gYW5nbGUgeCwgeSBpbiB0aGUgWy0xODAsIDE4MF0gaW50ZXJ2YWwsIHogZGVmYXVsdCB0aGUgcmFuZ2UgWy05MCwgOTBdIGludGVydmFsLCB0aGUgcm90YXRpb24gb3JkZXIgWVpYXG4gICAgICogQG1ldGhvZCB0b0V1bGVyXG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiB0b0V1bGVyPE91dCBleHRlbmRzIElWZWMzTGlrZT4gKG91dDogT3V0LCBxOiBJUXVhdExpa2UsIG91dGVyWj86IGJvb2xlYW4pXG4gICAgICogQHBhcmFtIG91dGVyWiB6IOWPluWAvOiMg+WbtOWMuumXtOaUueS4uiBbLTE4MCwgLTkwXSBVIFs5MCwgMTgwXVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgdG9FdWxlcjxPdXQgZXh0ZW5kcyBJVmVjM0xpa2U+IChvdXQ6IE91dCwgcTogSVF1YXRMaWtlLCBvdXRlclo/OiBib29sZWFuKSB7XG4gICAgICAgIGNvbnN0IHsgeCwgeSwgeiwgdyB9ID0gcTtcbiAgICAgICAgbGV0IGJhbmsgPSAwO1xuICAgICAgICBsZXQgaGVhZGluZyA9IDA7XG4gICAgICAgIGxldCBhdHRpdHVkZSA9IDA7XG4gICAgICAgIGNvbnN0IHRlc3QgPSB4ICogeSArIHogKiB3O1xuICAgICAgICBpZiAodGVzdCA+IDAuNDk5OTk5KSB7XG4gICAgICAgICAgICBiYW5rID0gMDsgLy8gZGVmYXVsdCB0byB6ZXJvXG4gICAgICAgICAgICBoZWFkaW5nID0gdG9EZWdyZWUoMiAqIE1hdGguYXRhbjIoeCwgdykpO1xuICAgICAgICAgICAgYXR0aXR1ZGUgPSA5MDtcbiAgICAgICAgfSBlbHNlIGlmICh0ZXN0IDwgLTAuNDk5OTk5KSB7XG4gICAgICAgICAgICBiYW5rID0gMDsgLy8gZGVmYXVsdCB0byB6ZXJvXG4gICAgICAgICAgICBoZWFkaW5nID0gLXRvRGVncmVlKDIgKiBNYXRoLmF0YW4yKHgsIHcpKTtcbiAgICAgICAgICAgIGF0dGl0dWRlID0gLTkwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc3F4ID0geCAqIHg7XG4gICAgICAgICAgICBjb25zdCBzcXkgPSB5ICogeTtcbiAgICAgICAgICAgIGNvbnN0IHNxeiA9IHogKiB6O1xuICAgICAgICAgICAgYmFuayA9IHRvRGVncmVlKE1hdGguYXRhbjIoMiAqIHggKiB3IC0gMiAqIHkgKiB6LCAxIC0gMiAqIHNxeCAtIDIgKiBzcXopKTtcbiAgICAgICAgICAgIGhlYWRpbmcgPSB0b0RlZ3JlZShNYXRoLmF0YW4yKDIgKiB5ICogdyAtIDIgKiB4ICogeiwgMSAtIDIgKiBzcXkgLSAyICogc3F6KSk7XG4gICAgICAgICAgICBhdHRpdHVkZSA9IHRvRGVncmVlKE1hdGguYXNpbigyICogdGVzdCkpO1xuICAgICAgICAgICAgaWYgKG91dGVyWikge1xuICAgICAgICAgICAgICAgIGJhbmsgPSAtMTgwICogTWF0aC5zaWduKGJhbmsgKyAxZS02KSArIGJhbms7XG4gICAgICAgICAgICAgICAgaGVhZGluZyA9IC0xODAgKiBNYXRoLnNpZ24oaGVhZGluZyArIDFlLTYpICsgaGVhZGluZztcbiAgICAgICAgICAgICAgICBhdHRpdHVkZSA9IDE4MCAqIE1hdGguc2lnbihhdHRpdHVkZSArIDFlLTYpIC0gYXR0aXR1ZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgb3V0LnggPSBiYW5rOyBvdXQueSA9IGhlYWRpbmc7IG91dC56ID0gYXR0aXR1ZGU7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISN6aCDlm5vlhYPmlbDnrYnku7fliKTmlq1cbiAgICAgKiAhI2VuIEFuYWx5emluZyBxdWF0ZXJuaW9uIGVxdWl2YWxlbnRcbiAgICAgKiBAbWV0aG9kIHN0cmljdEVxdWFsc1xuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogc3RyaWN0RXF1YWxzPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKGE6IE91dCwgYjogT3V0KVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgc3RyaWN0RXF1YWxzPE91dCBleHRlbmRzIElRdWF0TGlrZT4gKGE6IE91dCwgYjogT3V0KSB7XG4gICAgICAgIHJldHVybiBhLnggPT09IGIueCAmJiBhLnkgPT09IGIueSAmJiBhLnogPT09IGIueiAmJiBhLncgPT09IGIudztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI3poIOaOkumZpOa1rueCueaVsOivr+W3rueahOWbm+WFg+aVsOi/keS8vOetieS7t+WIpOaWrVxuICAgICAqICEjZW4gTmVnYXRpdmUgZmxvYXRpbmcgcG9pbnQgZXJyb3IgcXVhdGVybmlvbiBhcHByb3hpbWF0ZWx5IGVxdWl2YWxlbnQgQW5hbHl6aW5nXG4gICAgICogQG1ldGhvZCBlcXVhbHNcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGVxdWFsczxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChhOiBPdXQsIGI6IE91dCwgZXBzaWxvbiA9IEVQU0lMT04pXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyBlcXVhbHM8T3V0IGV4dGVuZHMgSVF1YXRMaWtlPiAoYTogT3V0LCBiOiBPdXQsIGVwc2lsb24gPSBFUFNJTE9OKSB7XG4gICAgICAgIHJldHVybiAoTWF0aC5hYnMoYS54IC0gYi54KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLngpLCBNYXRoLmFicyhiLngpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYS55IC0gYi55KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLnkpLCBNYXRoLmFicyhiLnkpKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYS56IC0gYi56KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLnopLCBNYXRoLmFicyhiLnopKSAmJlxuICAgICAgICAgICAgTWF0aC5hYnMoYS53IC0gYi53KSA8PSBlcHNpbG9uICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhLncpLCBNYXRoLmFicyhiLncpKSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiAhI3poIOWbm+WFg+aVsOi9rOaVsOe7hFxuICAgICAqICEjZW4gUXVhdGVybmlvbiByb3RhdGlvbiBhcnJheVxuICAgICAqIEBtZXRob2QgdG9BcnJheVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogdG9BcnJheSA8T3V0IGV4dGVuZHMgSVdyaXRhYmxlQXJyYXlMaWtlPG51bWJlcj4+IChvdXQ6IE91dCwgcTogSVF1YXRMaWtlLCBvZnMgPSAwKVxuICAgICAqIEBwYXJhbSBvZnMg5pWw57uE5YaF55qE6LW35aeL5YGP56e76YePXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIHN0YXRpYyB0b0FycmF5IDxPdXQgZXh0ZW5kcyBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPj4gKG91dDogT3V0LCBxOiBJUXVhdExpa2UsIG9mcyA9IDApIHtcbiAgICAgICAgb3V0W29mcyArIDBdID0gcS54O1xuICAgICAgICBvdXRbb2ZzICsgMV0gPSBxLnk7XG4gICAgICAgIG91dFtvZnMgKyAyXSA9IHEuejtcbiAgICAgICAgb3V0W29mcyArIDNdID0gcS53O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjemgg5pWw57uE6L2s5Zub5YWD5pWwXG4gICAgICogISNlbiBBcnJheSB0byBhIHF1YXRlcm5pb25cbiAgICAgKiBAbWV0aG9kIGZyb21BcnJheVxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogZnJvbUFycmF5IDxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb2ZzID0gMClcbiAgICAgKiBAcGFyYW0gb2ZzIOaVsOe7hOi1t+Wni+WBj+enu+mHj1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbUFycmF5IDxPdXQgZXh0ZW5kcyBJUXVhdExpa2U+IChvdXQ6IE91dCwgYXJyOiBJV3JpdGFibGVBcnJheUxpa2U8bnVtYmVyPiwgb2ZzID0gMCkge1xuICAgICAgICBvdXQueCA9IGFycltvZnMgKyAwXTtcbiAgICAgICAgb3V0LnkgPSBhcnJbb2ZzICsgMV07XG4gICAgICAgIG91dC56ID0gYXJyW29mcyArIDJdO1xuICAgICAgICBvdXQudyA9IGFycltvZnMgKyAzXTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB4XG4gICAgICovXG4gICAgeDogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB5XG4gICAgICovXG4gICAgeTogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB6XG4gICAgICovXG4gICAgejogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB3XG4gICAgICovXG4gICAgdzogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IgKHg6IFF1YXQgfCBudW1iZXIgPSAwLCB5OiBudW1iZXIgPSAwLCB6OiBudW1iZXIgPSAwLCB3OiBudW1iZXIgPSAxKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aGlzLnogPSB4Lno7XG4gICAgICAgICAgICB0aGlzLnkgPSB4Lnk7XG4gICAgICAgICAgICB0aGlzLncgPSB4Lnc7XG4gICAgICAgICAgICB0aGlzLnggPSB4Lng7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnggPSB4IGFzIG51bWJlcjtcbiAgICAgICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgICAgICB0aGlzLnogPSB6O1xuICAgICAgICAgICAgdGhpcy53ID0gdztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gY2xvbmUgYSBRdWF0IG9iamVjdCBhbmQgcmV0dXJuIHRoZSBuZXcgb2JqZWN0XG4gICAgICogISN6aCDlhYvpmobkuIDkuKrlm5vlhYPmlbDlubbov5Tlm55cbiAgICAgKiBAbWV0aG9kIGNsb25lXG4gICAgICogQHJldHVybiB7UXVhdH1cbiAgICAgKi9cbiAgICBjbG9uZSAoKTogUXVhdCB7XG4gICAgICAgIHJldHVybiBuZXcgUXVhdCh0aGlzLngsIHRoaXMueSwgdGhpcy56LCB0aGlzLncpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHZhbHVlcyB3aXRoIGFub3RoZXIgcXVhdGVybmlvblxuICAgICAqICEjemgg55So5Y+m5LiA5Liq5Zub5YWD5pWw55qE5YC86K6+572u5Yiw5b2T5YmN5a+56LGh5LiK44CCXG4gICAgICogQG1ldGhvZCBzZXRcbiAgICAgKiBAcGFyYW0ge1F1YXR9IG5ld1ZhbHVlIC0gISNlbiBuZXcgdmFsdWUgdG8gc2V0LiAhI3poIOimgeiuvue9rueahOaWsOWAvFxuICAgICAqIEByZXR1cm4ge1F1YXR9IHJldHVybnMgdGhpc1xuICAgICAqIEBjaGFpbmFibGVcbiAgICAgKi9cbiAgICBzZXQgKG5ld1ZhbHVlOiBRdWF0KTogdGhpcyB7XG4gICAgICAgIHRoaXMueCA9IG5ld1ZhbHVlLng7XG4gICAgICAgIHRoaXMueSA9IG5ld1ZhbHVlLnk7XG4gICAgICAgIHRoaXMueiA9IG5ld1ZhbHVlLno7XG4gICAgICAgIHRoaXMudyA9IG5ld1ZhbHVlLnc7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciBjdXJyZW50IHF1YXRlcm5pb24gZXF1YWxzIGFub3RoZXJcbiAgICAgKiAhI3poIOW9k+WJjeeahOWbm+WFg+aVsOaYr+WQpuS4juaMh+WumueahOWbm+WFg+aVsOebuOetieOAglxuICAgICAqIEBtZXRob2QgZXF1YWxzXG4gICAgICogQHBhcmFtIHtRdWF0fSBvdGhlclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgZXF1YWxzIChvdGhlcjogUXVhdCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gb3RoZXIgJiYgdGhpcy54ID09PSBvdGhlci54ICYmIHRoaXMueSA9PT0gb3RoZXIueSAmJiB0aGlzLnogPT09IG90aGVyLnogJiYgdGhpcy53ID09PSBvdGhlci53O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqICEjZW4gQ29udmVydCBxdWF0ZXJuaW9uIHRvIGV1bGVyXG4gICAgICogISN6aCDovazmjaLlm5vlhYPmlbDliLDmrKfmi4nop5JcbiAgICAgKiBAbWV0aG9kIHRvRXVsZXJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG91dFxuICAgICAqIEByZXR1cm4ge1ZlYzN9XG4gICAgICovXG4gICAgdG9FdWxlciAob3V0OiBWZWMzKTogVmVjMyB7XG4gICAgICAgIHJldHVybiBRdWF0LnRvRXVsZXIob3V0LCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENvbnZlcnQgZXVsZXIgdG8gcXVhdGVybmlvblxuICAgICAqICEjemgg6L2s5o2i5qyn5ouJ6KeS5Yiw5Zub5YWD5pWwXG4gICAgICogQG1ldGhvZCBmcm9tRXVsZXJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGV1bGVyXG4gICAgICogQHJldHVybiB7UXVhdH1cbiAgICAgKi9cbiAgICBmcm9tRXVsZXIgKGV1bGVyOiBWZWMzKTogdGhpcyB7XG4gICAgICAgIHJldHVybiBRdWF0LmZyb21FdWxlcih0aGlzLCBldWxlci54LCBldWxlci55LCBldWxlci56KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENhbGN1bGF0ZSB0aGUgaW50ZXJwb2xhdGlvbiByZXN1bHQgYmV0d2VlbiB0aGlzIHF1YXRlcm5pb24gYW5kIGFub3RoZXIgb25lIHdpdGggZ2l2ZW4gcmF0aW9cbiAgICAgKiAhI3poIOiuoeeul+Wbm+WFg+aVsOeahOaPkuWAvOe7k+aenFxuICAgICAqIEBtZW1iZXIgbGVycFxuICAgICAqIEBwYXJhbSB7UXVhdH0gdG9cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmF0aW9cbiAgICAgKiBAcGFyYW0ge1F1YXR9IFtvdXRdXG4gICAgICogQHJldHVybnMge1F1YXR9IG91dFxuICAgICAqL1xuICAgIGxlcnAgKHRvOiBRdWF0LCByYXRpbzogbnVtYmVyLCBvdXQ/OiBRdWF0KTogUXVhdCB7XG4gICAgICAgIG91dCA9IG91dCB8fCBuZXcgUXVhdCgpO1xuICAgICAgICBRdWF0LnNsZXJwKG91dCwgdGhpcywgdG8sIHJhdGlvKTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENhbGN1bGF0ZSB0aGUgbXVsdGlwbHkgcmVzdWx0IGJldHdlZW4gdGhpcyBxdWF0ZXJuaW9uIGFuZCBhbm90aGVyIG9uZVxuICAgICAqICEjemgg6K6h566X5Zub5YWD5pWw5LmY56ev55qE57uT5p6cXG4gICAgICogQG1lbWJlciBtdWx0aXBseVxuICAgICAqIEBwYXJhbSB7UXVhdH0gb3RoZXJcbiAgICAgKiBAcmV0dXJucyB7UXVhdH0gdGhpc1xuICAgICAqL1xuICAgIG11bHRpcGx5IChvdGhlcjogUXVhdCk6IHRoaXMge1xuICAgICAgICByZXR1cm4gUXVhdC5tdWx0aXBseSh0aGlzLCB0aGlzLCBvdGhlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogISNlbiBSb3RhdGVzIGEgcXVhdGVybmlvbiBieSB0aGUgZ2l2ZW4gYW5nbGUgKGluIHJhZGlhbnMpIGFib3V0IGEgd29ybGQgc3BhY2UgYXhpcy5cbiAgICAgKiAhI3poIOWbtOe7leS4lueVjOepuumXtOi9tOaMiee7meWumuW8p+W6puaXi+i9rOWbm+WFg+aVsFxuICAgICAqIEBtZW1iZXIgcm90YXRlQXJvdW5kXG4gICAgICogQHBhcmFtIHtRdWF0fSByb3QgLSBRdWF0ZXJuaW9uIHRvIHJvdGF0ZVxuICAgICAqIEBwYXJhbSB7VmVjM30gYXhpcyAtIFRoZSBheGlzIGFyb3VuZCB3aGljaCB0byByb3RhdGUgaW4gd29ybGQgc3BhY2VcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcmFkIC0gQW5nbGUgKGluIHJhZGlhbnMpIHRvIHJvdGF0ZVxuICAgICAqIEBwYXJhbSB7UXVhdH0gW291dF0gLSBRdWF0ZXJuaW9uIHRvIHN0b3JlIHJlc3VsdFxuICAgICAqIEByZXR1cm5zIHtRdWF0fSBvdXRcbiAgICAgKi9cbiAgICByb3RhdGVBcm91bmQgKHJvdDogUXVhdCwgYXhpczogVmVjMywgcmFkOiBudW1iZXIsIG91dD86IFF1YXQpOiBRdWF0IHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBRdWF0KCk7XG4gICAgICAgIHJldHVybiBRdWF0LnJvdGF0ZUFyb3VuZChvdXQsIHJvdCwgYXhpcywgcmFkKTtcbiAgICB9XG59XG5cbmNvbnN0IHF0XzEgPSBuZXcgUXVhdCgpO1xuY29uc3QgcXRfMiA9IG5ldyBRdWF0KCk7XG5jb25zdCB2M18xID0gbmV3IFZlYzMoKTtcbmNvbnN0IG0zXzEgPSBuZXcgTWF0MygpO1xuY29uc3QgaGFsZlRvUmFkID0gMC41ICogTWF0aC5QSSAvIDE4MC4wO1xuXG5DQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLlF1YXQnLCBRdWF0LCB7IHg6IDAsIHk6IDAsIHo6IDAsIHc6IDEgfSk7XG5cblxuLyoqXG4gKiBAbW9kdWxlIGNjXG4gKi9cblxuLyoqXG4gKiAhI2VuIFRoZSBjb252ZW5pZW5jZSBtZXRob2QgdG8gY3JlYXRlIGEgbmV3IHt7I2Nyb3NzTGluayBcIlF1YXRcIn19Y2MuUXVhdHt7L2Nyb3NzTGlua319LlxuICogISN6aCDpgJrov4for6XnroDkvr/nmoTlh73mlbDov5vooYzliJvlu7oge3sjY3Jvc3NMaW5rIFwiUXVhdFwifX1jYy5RdWF0e3svY3Jvc3NMaW5rfX0g5a+56LGh44CCXG4gKiBAbWV0aG9kIHF1YXRcbiAqIEBwYXJhbSB7TnVtYmVyfE9iamVjdH0gW3g9MF1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbeT0wXVxuICogQHBhcmFtIHtOdW1iZXJ9IFt6PTBdXG4gKiBAcGFyYW0ge051bWJlcn0gW3c9MV1cbiAqIEByZXR1cm4ge1F1YXR9XG4gKi9cbmNjLnF1YXQgPSBmdW5jdGlvbiBxdWF0ICh4LCB5LCB6LCB3KSB7XG4gICAgcmV0dXJuIG5ldyBRdWF0KHgsIHksIHosIHcpO1xufTtcblxuY2MuUXVhdCA9IFF1YXQ7XG4iXX0=