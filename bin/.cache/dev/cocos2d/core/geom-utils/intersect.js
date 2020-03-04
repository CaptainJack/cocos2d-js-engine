
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/geom-utils/intersect.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

var _recyclePool = _interopRequireDefault(require("../../renderer/memop/recycle-pool"));

var _valueTypes = require("../value-types");

var _aabb = _interopRequireDefault(require("./aabb"));

var distance = _interopRequireWildcard(require("./distance"));

var _enums = _interopRequireDefault(require("./enums"));

var _ray = _interopRequireDefault(require("./ray"));

var _triangle = _interopRequireDefault(require("./triangle"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

/**
 * @class geomUtils.intersect
 */
var ray_mesh = function () {
  var tri = _triangle["default"].create();

  var minDist = Infinity;

  function getVec3(out, data, idx, stride) {
    _valueTypes.Vec3.set(out, data[idx * stride], data[idx * stride + 1], data[idx * stride + 2]);
  }

  return function (ray, mesh) {
    minDist = Infinity;
    var subMeshes = mesh._subMeshes;

    for (var i = 0; i < subMeshes.length; i++) {
      if (subMeshes[i]._primitiveType !== _gfx["default"].PT_TRIANGLES) continue;
      var subData = mesh._subDatas[i] || mesh._subDatas[0];

      var posData = mesh._getAttrMeshData(i, _gfx["default"].ATTR_POSITION);

      var iData = subData.getIData(Uint16Array);
      var format = subData.vfm;
      var fmt = format.element(_gfx["default"].ATTR_POSITION);
      var num = fmt.num;

      for (var _i = 0; _i < iData.length; _i += 3) {
        getVec3(tri.a, posData, iData[_i], num);
        getVec3(tri.b, posData, iData[_i + 1], num);
        getVec3(tri.c, posData, iData[_i + 2], num);
        var dist = ray_triangle(ray, tri);

        if (dist > 0 && dist < minDist) {
          minDist = dist;
        }
      }
    }

    return minDist;
  };
}(); // adapt to old api


var rayMesh = ray_mesh;
/** 
 * !#en
 * Check whether ray intersect with nodes
 * !#zh
 * 检测射线是否与物体有交集
 * @static
 * @method ray_cast
 * @param {Node} root - If root is null, then traversal nodes from scene node
 * @param {geomUtils.Ray} worldRay
 * @param {Function} handler
 * @param {Function} filter
 * @return {[]} [{node, distance}]
*/

var ray_cast = function () {
  function traversal(node, cb) {
    var children = node.children;

    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];
      traversal(child, cb);
    }

    cb(node);
  }

  function cmp(a, b) {
    return a.distance - b.distance;
  }

  function transformMat4Normal(out, a, m) {
    var mm = m.m;
    var x = a.x,
        y = a.y,
        z = a.z,
        rhw = mm[3] * x + mm[7] * y + mm[11] * z;
    rhw = rhw ? 1 / rhw : 1;
    out.x = (mm[0] * x + mm[4] * y + mm[8] * z) * rhw;
    out.y = (mm[1] * x + mm[5] * y + mm[9] * z) * rhw;
    out.z = (mm[2] * x + mm[6] * y + mm[10] * z) * rhw;
    return out;
  }

  var resultsPool = new _recyclePool["default"](function () {
    return {
      distance: 0,
      node: null
    };
  }, 1);
  var results = []; // temp variable

  var nodeAabb = _aabb["default"].create();

  var minPos = new _valueTypes.Vec3();
  var maxPos = new _valueTypes.Vec3();
  var modelRay = new _ray["default"]();
  var m4_1 = cc.mat4();
  var m4_2 = cc.mat4();
  var d = new _valueTypes.Vec3();

  function distanceValid(distance) {
    return distance > 0 && distance < Infinity;
  }

  return function (root, worldRay, handler, filter) {
    resultsPool.reset();
    results.length = 0;
    root = root || cc.director.getScene();
    traversal(root, function (node) {
      if (filter && !filter(node)) return; // transform world ray to model ray

      _valueTypes.Mat4.invert(m4_2, node.getWorldMatrix(m4_1));

      _valueTypes.Vec3.transformMat4(modelRay.o, worldRay.o, m4_2);

      _valueTypes.Vec3.normalize(modelRay.d, transformMat4Normal(modelRay.d, worldRay.d, m4_2)); // raycast with bounding box


      var distance = Infinity;
      var component = node._renderComponent;

      if (component instanceof cc.MeshRenderer) {
        distance = ray_aabb(modelRay, component._boundingBox);
      } else if (node.width && node.height) {
        _valueTypes.Vec3.set(minPos, -node.width * node.anchorX, -node.height * node.anchorY, node.z);

        _valueTypes.Vec3.set(maxPos, node.width * (1 - node.anchorX), node.height * (1 - node.anchorY), node.z);

        _aabb["default"].fromPoints(nodeAabb, minPos, maxPos);

        distance = ray_aabb(modelRay, nodeAabb);
      }

      if (!distanceValid(distance)) return;

      if (handler) {
        distance = handler(modelRay, node, distance);
      }

      if (distanceValid(distance)) {
        _valueTypes.Vec3.scale(d, modelRay.d, distance);

        transformMat4Normal(d, d, m4_1);
        var res = resultsPool.add();
        res.node = node;
        res.distance = _valueTypes.Vec3.mag(d);
        results.push(res);
      }
    });
    results.sort(cmp);
    return results;
  };
}(); // adapt to old api


var raycast = ray_cast;
/**
 * !#en ray-plane intersect<br/>
 * !#zh 射线与平面的相交性检测。
 * @static
 * @method ray_plane
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Plane} plane
 * @return {number} 0 or not 0
 */

var ray_plane = function () {
  var pt = new _valueTypes.Vec3(0, 0, 0);
  return function (ray, plane) {
    var denom = _valueTypes.Vec3.dot(ray.d, plane.n);

    if (Math.abs(denom) < Number.EPSILON) {
      return 0;
    }

    _valueTypes.Vec3.multiplyScalar(pt, plane.n, plane.d);

    var t = _valueTypes.Vec3.dot(_valueTypes.Vec3.subtract(pt, pt, ray.o), plane.n) / denom;

    if (t < 0) {
      return 0;
    }

    return t;
  };
}();
/**
 * !#en line-plane intersect<br/>
 * !#zh 线段与平面的相交性检测。
 * @static
 * @method line_plane
 * @param {geomUtils.Line} line
 * @param {geomUtils.Plane} plane
 * @return {number} 0 or not 0
 */


var line_plane = function () {
  var ab = new _valueTypes.Vec3(0, 0, 0);
  return function (line, plane) {
    _valueTypes.Vec3.subtract(ab, line.e, line.s);

    var t = (plane.d - _valueTypes.Vec3.dot(line.s, plane.n)) / _valueTypes.Vec3.dot(ab, plane.n);

    if (t < 0 || t > 1) {
      return 0;
    }

    return t;
  };
}(); // based on http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/raytri/

/**
 * !#en ray-triangle intersect<br/>
 * !#zh 射线与三角形的相交性检测。
 * @static
 * @method ray_triangle
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Triangle} triangle
 * @param {boolean} doubleSided
 * @return {number} 0 or not 0
 */


var ray_triangle = function () {
  var ab = new _valueTypes.Vec3(0, 0, 0);
  var ac = new _valueTypes.Vec3(0, 0, 0);
  var pvec = new _valueTypes.Vec3(0, 0, 0);
  var tvec = new _valueTypes.Vec3(0, 0, 0);
  var qvec = new _valueTypes.Vec3(0, 0, 0);
  return function (ray, triangle, doubleSided) {
    _valueTypes.Vec3.subtract(ab, triangle.b, triangle.a);

    _valueTypes.Vec3.subtract(ac, triangle.c, triangle.a);

    _valueTypes.Vec3.cross(pvec, ray.d, ac);

    var det = _valueTypes.Vec3.dot(ab, pvec);

    if (det < Number.EPSILON && (!doubleSided || det > -Number.EPSILON)) {
      return 0;
    }

    var inv_det = 1 / det;

    _valueTypes.Vec3.subtract(tvec, ray.o, triangle.a);

    var u = _valueTypes.Vec3.dot(tvec, pvec) * inv_det;

    if (u < 0 || u > 1) {
      return 0;
    }

    _valueTypes.Vec3.cross(qvec, tvec, ab);

    var v = _valueTypes.Vec3.dot(ray.d, qvec) * inv_det;

    if (v < 0 || u + v > 1) {
      return 0;
    }

    var t = _valueTypes.Vec3.dot(ac, qvec) * inv_det;
    return t < 0 ? 0 : t;
  };
}(); // adapt to old api


var rayTriangle = ray_triangle;
/**
 * !#en line-triangle intersect<br/>
 * !#zh 线段与三角形的相交性检测。
 * @static
 * @method line_triangle
 * @param {geomUtils.Line} line
 * @param {geomUtils.Triangle} triangle
 * @param {Vec3} outPt optional, The intersection point
 * @return {number} 0 or not 0
 */

var line_triangle = function () {
  var ab = new _valueTypes.Vec3(0, 0, 0);
  var ac = new _valueTypes.Vec3(0, 0, 0);
  var qp = new _valueTypes.Vec3(0, 0, 0);
  var ap = new _valueTypes.Vec3(0, 0, 0);
  var n = new _valueTypes.Vec3(0, 0, 0);
  var e = new _valueTypes.Vec3(0, 0, 0);
  return function (line, triangle, outPt) {
    _valueTypes.Vec3.subtract(ab, triangle.b, triangle.a);

    _valueTypes.Vec3.subtract(ac, triangle.c, triangle.a);

    _valueTypes.Vec3.subtract(qp, line.s, line.e);

    _valueTypes.Vec3.cross(n, ab, ac);

    var det = _valueTypes.Vec3.dot(qp, n);

    if (det <= 0.0) {
      return 0;
    }

    _valueTypes.Vec3.subtract(ap, line.s, triangle.a);

    var t = _valueTypes.Vec3.dot(ap, n);

    if (t < 0 || t > det) {
      return 0;
    }

    _valueTypes.Vec3.cross(e, qp, ap);

    var v = _valueTypes.Vec3.dot(ac, e);

    if (v < 0 || v > det) {
      return 0;
    }

    var w = -_valueTypes.Vec3.dot(ab, e);

    if (w < 0.0 || v + w > det) {
      return 0;
    }

    if (outPt) {
      var invDet = 1.0 / det;
      v *= invDet;
      w *= invDet;
      var u = 1.0 - v - w; // outPt = u*a + v*d + w*c;

      _valueTypes.Vec3.set(outPt, triangle.a.x * u + triangle.b.x * v + triangle.c.x * w, triangle.a.y * u + triangle.b.y * v + triangle.c.y * w, triangle.a.z * u + triangle.b.z * v + triangle.c.z * w);
    }

    return 1;
  };
}();
/**
 * !#en line-quad intersect<br/>
 * !#zh 线段与四边形的相交性检测。
 * @static
 * @method line_quad
 * @param {Vec3} p A point on a line segment
 * @param {Vec3} q Another point on the line segment
 * @param {Vec3} a Quadrilateral point a
 * @param {Vec3} b Quadrilateral point b
 * @param {Vec3} c Quadrilateral point c
 * @param {Vec3} d Quadrilateral point d
 * @param {Vec3} outPt optional, The intersection point
 * @return {number} 0 or not 0
 */


var line_quad = function () {
  var pq = new _valueTypes.Vec3(0, 0, 0);
  var pa = new _valueTypes.Vec3(0, 0, 0);
  var pb = new _valueTypes.Vec3(0, 0, 0);
  var pc = new _valueTypes.Vec3(0, 0, 0);
  var pd = new _valueTypes.Vec3(0, 0, 0);
  var m = new _valueTypes.Vec3(0, 0, 0);
  var tmp = new _valueTypes.Vec3(0, 0, 0);
  return function (p, q, a, b, c, d, outPt) {
    _valueTypes.Vec3.subtract(pq, q, p);

    _valueTypes.Vec3.subtract(pa, a, p);

    _valueTypes.Vec3.subtract(pb, b, p);

    _valueTypes.Vec3.subtract(pc, c, p); // Determine which triangle to test against by testing against diagonal first


    _valueTypes.Vec3.cross(m, pc, pq);

    var v = _valueTypes.Vec3.dot(pa, m);

    if (v >= 0) {
      // Test intersection against triangle abc
      var u = -_valueTypes.Vec3.dot(pb, m);

      if (u < 0) {
        return 0;
      }

      var w = _valueTypes.Vec3.dot(_valueTypes.Vec3.cross(tmp, pq, pb), pa);

      if (w < 0) {
        return 0;
      } // outPt = u*a + v*b + w*c;


      if (outPt) {
        var denom = 1.0 / (u + v + w);
        u *= denom;
        v *= denom;
        w *= denom;

        _valueTypes.Vec3.set(outPt, a.x * u + b.x * v + c.x * w, a.y * u + b.y * v + c.y * w, a.z * u + b.z * v + c.z * w);
      }
    } else {
      // Test intersection against triangle dac
      _valueTypes.Vec3.subtract(pd, d, p);

      var _u = _valueTypes.Vec3.dot(pd, m);

      if (_u < 0) {
        return 0;
      }

      var _w = _valueTypes.Vec3.dot(_valueTypes.Vec3.cross(tmp, pq, pa), pd);

      if (_w < 0) {
        return 0;
      } // outPt = u*a + v*d + w*c;


      if (outPt) {
        v = -v;

        var _denom = 1.0 / (_u + v + _w);

        _u *= _denom;
        v *= _denom;
        _w *= _denom;

        _valueTypes.Vec3.set(outPt, a.x * _u + d.x * v + c.x * _w, a.y * _u + d.y * v + c.y * _w, a.z * _u + d.z * v + c.z * _w);
      }
    }

    return 1;
  };
}();
/**
 * !#en ray-sphere intersect<br/>
 * !#zh 射线和球的相交性检测。
 * @static
 * @method ray_sphere
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Sphere} sphere
 * @return {number} 0 or not 0
 */


var ray_sphere = function () {
  var e = new _valueTypes.Vec3(0, 0, 0);
  return function (ray, sphere) {
    var r = sphere.radius;
    var c = sphere.center;
    var o = ray.o;
    var d = ray.d;
    var rSq = r * r;

    _valueTypes.Vec3.subtract(e, c, o);

    var eSq = e.lengthSqr();

    var aLength = _valueTypes.Vec3.dot(e, d); // assume ray direction already normalized


    var fSq = rSq - (eSq - aLength * aLength);

    if (fSq < 0) {
      return 0;
    }

    var f = Math.sqrt(fSq);
    var t = eSq < rSq ? aLength + f : aLength - f;

    if (t < 0) {
      return 0;
    }

    return t;
  };
}();
/**
 * !#en ray-aabb intersect<br/>
 * !#zh 射线和轴对齐包围盒的相交性检测。
 * @static
 * @method ray_aabb
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Aabb} aabb Align the axis around the box
 * @return {number} 0 or not 0
 */


var ray_aabb = function () {
  var min = new _valueTypes.Vec3();
  var max = new _valueTypes.Vec3();
  return function (ray, aabb) {
    var o = ray.o,
        d = ray.d;
    var ix = 1 / d.x,
        iy = 1 / d.y,
        iz = 1 / d.z;

    _valueTypes.Vec3.subtract(min, aabb.center, aabb.halfExtents);

    _valueTypes.Vec3.add(max, aabb.center, aabb.halfExtents);

    var t1 = (min.x - o.x) * ix;
    var t2 = (max.x - o.x) * ix;
    var t3 = (min.y - o.y) * iy;
    var t4 = (max.y - o.y) * iy;
    var t5 = (min.z - o.z) * iz;
    var t6 = (max.z - o.z) * iz;
    var tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
    var tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));

    if (tmax < 0 || tmin > tmax) {
      return 0;
    }

    ;
    return tmin;
  };
}(); // adapt to old api


var rayAabb = ray_aabb;
/**
 * !#en ray-obb intersect<br/>
 * !#zh 射线和方向包围盒的相交性检测。
 * @static
 * @method ray_obb
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Obb} obb Direction box
 * @return {number} 0 or or 0
 */

var ray_obb = function () {
  var center = new _valueTypes.Vec3();
  var o = new _valueTypes.Vec3();
  var d = new _valueTypes.Vec3();
  var X = new _valueTypes.Vec3();
  var Y = new _valueTypes.Vec3();
  var Z = new _valueTypes.Vec3();
  var p = new _valueTypes.Vec3();
  var size = new Array(3);
  var f = new Array(3);
  var e = new Array(3);
  var t = new Array(6);
  return function (ray, obb) {
    size[0] = obb.halfExtents.x;
    size[1] = obb.halfExtents.y;
    size[2] = obb.halfExtents.z;
    center = obb.center;
    o = ray.o;
    d = ray.d;
    var obbm = obb.orientation.m;

    _valueTypes.Vec3.set(X, obbm[0], obbm[1], obbm[2]);

    _valueTypes.Vec3.set(Y, obbm[3], obbm[4], obbm[5]);

    _valueTypes.Vec3.set(Z, obbm[6], obbm[7], obbm[8]);

    _valueTypes.Vec3.subtract(p, center, o); // The cos values of the ray on the X, Y, Z


    f[0] = _valueTypes.Vec3.dot(X, d);
    f[1] = _valueTypes.Vec3.dot(Y, d);
    f[2] = _valueTypes.Vec3.dot(Z, d); // The projection length of P on X, Y, Z

    e[0] = _valueTypes.Vec3.dot(X, p);
    e[1] = _valueTypes.Vec3.dot(Y, p);
    e[2] = _valueTypes.Vec3.dot(Z, p);

    for (var i = 0; i < 3; ++i) {
      if (f[i] === 0) {
        if (-e[i] - size[i] > 0 || -e[i] + size[i] < 0) {
          return 0;
        } // Avoid div by 0!


        f[i] = 0.0000001;
      } // min


      t[i * 2 + 0] = (e[i] + size[i]) / f[i]; // max

      t[i * 2 + 1] = (e[i] - size[i]) / f[i];
    }

    var tmin = Math.max(Math.max(Math.min(t[0], t[1]), Math.min(t[2], t[3])), Math.min(t[4], t[5]));
    var tmax = Math.min(Math.min(Math.max(t[0], t[1]), Math.max(t[2], t[3])), Math.max(t[4], t[5]));

    if (tmax < 0 || tmin > tmax || tmin < 0) {
      return 0;
    }

    return tmin;
  };
}();
/**
 * !#en aabb-aabb intersect<br/>
 * !#zh 轴对齐包围盒和轴对齐包围盒的相交性检测。
 * @static
 * @method aabb_aabb
 * @param {geomUtils.Aabb} aabb1 Axis alignment surrounds box 1
 * @param {geomUtils.Aabb} aabb2 Axis alignment surrounds box 2
 * @return {number} 0 or not 0
 */


var aabb_aabb = function () {
  var aMin = new _valueTypes.Vec3();
  var aMax = new _valueTypes.Vec3();
  var bMin = new _valueTypes.Vec3();
  var bMax = new _valueTypes.Vec3();
  return function (aabb1, aabb2) {
    _valueTypes.Vec3.subtract(aMin, aabb1.center, aabb1.halfExtents);

    _valueTypes.Vec3.add(aMax, aabb1.center, aabb1.halfExtents);

    _valueTypes.Vec3.subtract(bMin, aabb2.center, aabb2.halfExtents);

    _valueTypes.Vec3.add(bMax, aabb2.center, aabb2.halfExtents);

    return aMin.x <= bMax.x && aMax.x >= bMin.x && aMin.y <= bMax.y && aMax.y >= bMin.y && aMin.z <= bMax.z && aMax.z >= bMin.z;
  };
}();

function getAABBVertices(min, max, out) {
  _valueTypes.Vec3.set(out[0], min.x, max.y, max.z);

  _valueTypes.Vec3.set(out[1], min.x, max.y, min.z);

  _valueTypes.Vec3.set(out[2], min.x, min.y, max.z);

  _valueTypes.Vec3.set(out[3], min.x, min.y, min.z);

  _valueTypes.Vec3.set(out[4], max.x, max.y, max.z);

  _valueTypes.Vec3.set(out[5], max.x, max.y, min.z);

  _valueTypes.Vec3.set(out[6], max.x, min.y, max.z);

  _valueTypes.Vec3.set(out[7], max.x, min.y, min.z);
}

function getOBBVertices(c, e, a1, a2, a3, out) {
  _valueTypes.Vec3.set(out[0], c.x + a1.x * e.x + a2.x * e.y + a3.x * e.z, c.y + a1.y * e.x + a2.y * e.y + a3.y * e.z, c.z + a1.z * e.x + a2.z * e.y + a3.z * e.z);

  _valueTypes.Vec3.set(out[1], c.x - a1.x * e.x + a2.x * e.y + a3.x * e.z, c.y - a1.y * e.x + a2.y * e.y + a3.y * e.z, c.z - a1.z * e.x + a2.z * e.y + a3.z * e.z);

  _valueTypes.Vec3.set(out[2], c.x + a1.x * e.x - a2.x * e.y + a3.x * e.z, c.y + a1.y * e.x - a2.y * e.y + a3.y * e.z, c.z + a1.z * e.x - a2.z * e.y + a3.z * e.z);

  _valueTypes.Vec3.set(out[3], c.x + a1.x * e.x + a2.x * e.y - a3.x * e.z, c.y + a1.y * e.x + a2.y * e.y - a3.y * e.z, c.z + a1.z * e.x + a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[4], c.x - a1.x * e.x - a2.x * e.y - a3.x * e.z, c.y - a1.y * e.x - a2.y * e.y - a3.y * e.z, c.z - a1.z * e.x - a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[5], c.x + a1.x * e.x - a2.x * e.y - a3.x * e.z, c.y + a1.y * e.x - a2.y * e.y - a3.y * e.z, c.z + a1.z * e.x - a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[6], c.x - a1.x * e.x + a2.x * e.y - a3.x * e.z, c.y - a1.y * e.x + a2.y * e.y - a3.y * e.z, c.z - a1.z * e.x + a2.z * e.y - a3.z * e.z);

  _valueTypes.Vec3.set(out[7], c.x - a1.x * e.x - a2.x * e.y + a3.x * e.z, c.y - a1.y * e.x - a2.y * e.y + a3.y * e.z, c.z - a1.z * e.x - a2.z * e.y + a3.z * e.z);
}

function getInterval(vertices, axis) {
  var min = _valueTypes.Vec3.dot(axis, vertices[0]),
      max = min;

  for (var i = 1; i < 8; ++i) {
    var projection = _valueTypes.Vec3.dot(axis, vertices[i]);

    min = projection < min ? projection : min;
    max = projection > max ? projection : max;
  }

  return [min, max];
}
/**
 * !#en aabb-obb intersect<br/>
 * !#zh 轴对齐包围盒和方向包围盒的相交性检测。
 * @static
 * @method aabb_obb
 * @param {geomUtils.Aabb} aabb Align the axis around the box
 * @param {geomUtils.Obb} obb Direction box
 * @return {number} 0 or not 0
 */


var aabb_obb = function () {
  var test = new Array(15);

  for (var i = 0; i < 15; i++) {
    test[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  var vertices = new Array(8);
  var vertices2 = new Array(8);

  for (var _i2 = 0; _i2 < 8; _i2++) {
    vertices[_i2] = new _valueTypes.Vec3(0, 0, 0);
    vertices2[_i2] = new _valueTypes.Vec3(0, 0, 0);
  }

  var min = new _valueTypes.Vec3();
  var max = new _valueTypes.Vec3();
  return function (aabb, obb) {
    var obbm = obb.orientation.m;

    _valueTypes.Vec3.set(test[0], 1, 0, 0);

    _valueTypes.Vec3.set(test[1], 0, 1, 0);

    _valueTypes.Vec3.set(test[2], 0, 0, 1);

    _valueTypes.Vec3.set(test[3], obbm[0], obbm[1], obbm[2]);

    _valueTypes.Vec3.set(test[4], obbm[3], obbm[4], obbm[5]);

    _valueTypes.Vec3.set(test[5], obbm[6], obbm[7], obbm[8]);

    for (var _i3 = 0; _i3 < 3; ++_i3) {
      // Fill out rest of axis
      _valueTypes.Vec3.cross(test[6 + _i3 * 3 + 0], test[_i3], test[0]);

      _valueTypes.Vec3.cross(test[6 + _i3 * 3 + 1], test[_i3], test[1]);

      _valueTypes.Vec3.cross(test[6 + _i3 * 3 + 1], test[_i3], test[2]);
    }

    _valueTypes.Vec3.subtract(min, aabb.center, aabb.halfExtents);

    _valueTypes.Vec3.add(max, aabb.center, aabb.halfExtents);

    getAABBVertices(min, max, vertices);
    getOBBVertices(obb.center, obb.halfExtents, test[3], test[4], test[5], vertices2);

    for (var j = 0; j < 15; ++j) {
      var a = getInterval(vertices, test[j]);
      var b = getInterval(vertices2, test[j]);

      if (b[0] > a[1] || a[0] > b[1]) {
        return 0; // Seperating axis found
      }
    }

    return 1;
  };
}();
/**
 * !#en aabb-plane intersect<br/>
 * !#zh 轴对齐包围盒和平面的相交性检测。
 * @static
 * @method aabb_plane
 * @param {geomUtils.Aabb} aabb Align the axis around the box
 * @param {geomUtils.Plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */


var aabb_plane = function aabb_plane(aabb, plane) {
  var r = aabb.halfExtents.x * Math.abs(plane.n.x) + aabb.halfExtents.y * Math.abs(plane.n.y) + aabb.halfExtents.z * Math.abs(plane.n.z);

  var dot = _valueTypes.Vec3.dot(plane.n, aabb.center);

  if (dot + r < plane.d) {
    return -1;
  } else if (dot - r > plane.d) {
    return 0;
  }

  return 1;
};
/**
 * !#en aabb-frustum intersect, faster but has false positive corner cases<br/>
 * !#zh 轴对齐包围盒和锥台相交性检测，速度快，但有错误情况。
 * @static
 * @method aabb_frustum
 * @param {geomUtils.Aabb} aabb Align the axis around the box
 * @param {geomUtils.Frustum} frustum
 * @return {number} 0 or not 0
 */


var aabb_frustum = function aabb_frustum(aabb, frustum) {
  for (var i = 0; i < frustum.planes.length; i++) {
    // frustum plane normal points to the inside
    if (aabb_plane(aabb, frustum.planes[i]) === -1) {
      return 0;
    }
  } // completely outside


  return 1;
}; // https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/

/**
 * !#en aabb-frustum intersect, handles most of the false positives correctly<br/>
 * !#zh 轴对齐包围盒和锥台相交性检测，正确处理大多数错误情况。
 * @static
 * @method aabb_frustum_accurate
 * @param {geomUtils.Aabb} aabb Align the axis around the box
 * @param {geomUtils.Frustum} frustum
 * @return {number}
 */


var aabb_frustum_accurate = function () {
  var tmp = new Array(8);
  var out1 = 0,
      out2 = 0;

  for (var i = 0; i < tmp.length; i++) {
    tmp[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  return function (aabb, frustum) {
    var result = 0,
        intersects = false; // 1. aabb inside/outside frustum test

    for (var _i4 = 0; _i4 < frustum.planes.length; _i4++) {
      result = aabb_plane(aabb, frustum.planes[_i4]); // frustum plane normal points to the inside

      if (result === -1) {
        return 0;
      } // completely outside
      else if (result === 1) {
          intersects = true;
        }
    }

    if (!intersects) {
      return 1;
    } // completely inside
    // in case of false positives
    // 2. frustum inside/outside aabb test


    for (var _i5 = 0; _i5 < frustum.vertices.length; _i5++) {
      _valueTypes.Vec3.subtract(tmp[_i5], frustum.vertices[_i5], aabb.center);
    }

    out1 = 0, out2 = 0;

    for (var _i6 = 0; _i6 < frustum.vertices.length; _i6++) {
      if (tmp[_i6].x > aabb.halfExtents.x) {
        out1++;
      } else if (tmp[_i6].x < -aabb.halfExtents.x) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i7 = 0; _i7 < frustum.vertices.length; _i7++) {
      if (tmp[_i7].y > aabb.halfExtents.y) {
        out1++;
      } else if (tmp[_i7].y < -aabb.halfExtents.y) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i8 = 0; _i8 < frustum.vertices.length; _i8++) {
      if (tmp[_i8].z > aabb.halfExtents.z) {
        out1++;
      } else if (tmp[_i8].z < -aabb.halfExtents.z) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    return 1;
  };
}();
/**
 * !#en obb-point intersect<br/>
 * !#zh 方向包围盒和点的相交性检测。
 * @static
 * @method obb_point
 * @param {geomUtils.Obb} obb Direction box
 * @param {geomUtils.Vec3} point
 * @return {boolean} true or false
 */


var obb_point = function () {
  var tmp = new _valueTypes.Vec3(0, 0, 0),
      m3 = new _valueTypes.Mat3();

  var lessThan = function lessThan(a, b) {
    return Math.abs(a.x) < b.x && Math.abs(a.y) < b.y && Math.abs(a.z) < b.z;
  };

  return function (obb, point) {
    _valueTypes.Vec3.subtract(tmp, point, obb.center);

    _valueTypes.Vec3.transformMat3(tmp, tmp, _valueTypes.Mat3.transpose(m3, obb.orientation));

    return lessThan(tmp, obb.halfExtents);
  };
}();
/**
 * !#en obb-plane intersect<br/>
 * !#zh 方向包围盒和平面的相交性检测。
 * @static
 * @method obb_plane
 * @param {geomUtils.Obb} obb Direction box
 * @param {geomUtils.Plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */


var obb_plane = function () {
  var absDot = function absDot(n, x, y, z) {
    return Math.abs(n.x * x + n.y * y + n.z * z);
  };

  return function (obb, plane) {
    var obbm = obb.orientation.m; // Real-Time Collision Detection, Christer Ericson, p. 163.

    var r = obb.halfExtents.x * absDot(plane.n, obbm[0], obbm[1], obbm[2]) + obb.halfExtents.y * absDot(plane.n, obbm[3], obbm[4], obbm[5]) + obb.halfExtents.z * absDot(plane.n, obbm[6], obbm[7], obbm[8]);

    var dot = _valueTypes.Vec3.dot(plane.n, obb.center);

    if (dot + r < plane.d) {
      return -1;
    } else if (dot - r > plane.d) {
      return 0;
    }

    return 1;
  };
}();
/**
 * !#en obb-frustum intersect, faster but has false positive corner cases<br/>
 * !#zh 方向包围盒和锥台相交性检测，速度快，但有错误情况。
 * @static
 * @method obb_frustum
 * @param {geomUtils.Obb} obb Direction box
 * @param {geomUtils.Frustum} frustum
 * @return {number} 0 or not 0
 */


var obb_frustum = function obb_frustum(obb, frustum) {
  for (var i = 0; i < frustum.planes.length; i++) {
    // frustum plane normal points to the inside
    if (obb_plane(obb, frustum.planes[i]) === -1) {
      return 0;
    }
  } // completely outside


  return 1;
}; // https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/

/**
 * !#en obb-frustum intersect, handles most of the false positives correctly<br/>
 * !#zh 方向包围盒和锥台相交性检测，正确处理大多数错误情况。
 * @static
 * @method obb_frustum_accurate
 * @param {geomUtils.Obb} obb Direction box
 * @param {geomUtils.Frustum} frustum
 * @return {number} 0 or not 0
 */


var obb_frustum_accurate = function () {
  var tmp = new Array(8);
  var dist = 0,
      out1 = 0,
      out2 = 0;

  for (var i = 0; i < tmp.length; i++) {
    tmp[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  var dot = function dot(n, x, y, z) {
    return n.x * x + n.y * y + n.z * z;
  };

  return function (obb, frustum) {
    var result = 0,
        intersects = false; // 1. obb inside/outside frustum test

    for (var _i9 = 0; _i9 < frustum.planes.length; _i9++) {
      result = obb_plane(obb, frustum.planes[_i9]); // frustum plane normal points to the inside

      if (result === -1) {
        return 0;
      } // completely outside
      else if (result === 1) {
          intersects = true;
        }
    }

    if (!intersects) {
      return 1;
    } // completely inside
    // in case of false positives
    // 2. frustum inside/outside obb test


    for (var _i10 = 0; _i10 < frustum.vertices.length; _i10++) {
      _valueTypes.Vec3.subtract(tmp[_i10], frustum.vertices[_i10], obb.center);
    }

    out1 = 0, out2 = 0;
    var obbm = obb.orientation.m;

    for (var _i11 = 0; _i11 < frustum.vertices.length; _i11++) {
      dist = dot(tmp[_i11], obbm[0], obbm[1], obbm[2]);

      if (dist > obb.halfExtents.x) {
        out1++;
      } else if (dist < -obb.halfExtents.x) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i12 = 0; _i12 < frustum.vertices.length; _i12++) {
      dist = dot(tmp[_i12], obbm[3], obbm[4], obbm[5]);

      if (dist > obb.halfExtents.y) {
        out1++;
      } else if (dist < -obb.halfExtents.y) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    out1 = 0;
    out2 = 0;

    for (var _i13 = 0; _i13 < frustum.vertices.length; _i13++) {
      dist = dot(tmp[_i13], obbm[6], obbm[7], obbm[8]);

      if (dist > obb.halfExtents.z) {
        out1++;
      } else if (dist < -obb.halfExtents.z) {
        out2++;
      }
    }

    if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
      return 0;
    }

    return 1;
  };
}();
/**
 * !#en obb-obb intersect<br/>
 * !#zh 方向包围盒和方向包围盒的相交性检测。
 * @static
 * @method obb_obb
 * @param {geomUtils.Obb} obb1 Direction box1
 * @param {geomUtils.Obb} obb2 Direction box2
 * @return {number} 0 or not 0
 */


var obb_obb = function () {
  var test = new Array(15);

  for (var i = 0; i < 15; i++) {
    test[i] = new _valueTypes.Vec3(0, 0, 0);
  }

  var vertices = new Array(8);
  var vertices2 = new Array(8);

  for (var _i14 = 0; _i14 < 8; _i14++) {
    vertices[_i14] = new _valueTypes.Vec3(0, 0, 0);
    vertices2[_i14] = new _valueTypes.Vec3(0, 0, 0);
  }

  return function (obb1, obb2) {
    var obb1m = obb1.orientation.m;
    var obb2m = obb2.orientation.m;

    _valueTypes.Vec3.set(test[0], obb1m[0], obb1m[1], obb1m[2]);

    _valueTypes.Vec3.set(test[1], obb1m[3], obb1m[4], obb1m[5]);

    _valueTypes.Vec3.set(test[2], obb1m[6], obb1m[7], obb1m[8]);

    _valueTypes.Vec3.set(test[3], obb2m[0], obb2m[1], obb2m[2]);

    _valueTypes.Vec3.set(test[4], obb2m[3], obb2m[4], obb2m[5]);

    _valueTypes.Vec3.set(test[5], obb2m[6], obb2m[7], obb2m[8]);

    for (var _i15 = 0; _i15 < 3; ++_i15) {
      // Fill out rest of axis
      _valueTypes.Vec3.cross(test[6 + _i15 * 3 + 0], test[_i15], test[0]);

      _valueTypes.Vec3.cross(test[6 + _i15 * 3 + 1], test[_i15], test[1]);

      _valueTypes.Vec3.cross(test[6 + _i15 * 3 + 1], test[_i15], test[2]);
    }

    getOBBVertices(obb1.center, obb1.halfExtents, test[0], test[1], test[2], vertices);
    getOBBVertices(obb2.center, obb2.halfExtents, test[3], test[4], test[5], vertices2);

    for (var _i16 = 0; _i16 < 15; ++_i16) {
      var a = getInterval(vertices, test[_i16]);
      var b = getInterval(vertices2, test[_i16]);

      if (b[0] > a[1] || a[0] > b[1]) {
        return 0; // Seperating axis found
      }
    }

    return 1;
  };
}();
/**
 * !#en phere-plane intersect, not necessarily faster than obb-plane<br/>
 * due to the length calculation of the plane normal to factor out<br/>
 * the unnomalized plane distance<br/>
 * !#zh 球与平面的相交性检测。
 * @static
 * @method sphere_plane
 * @param {geomUtils.Sphere} sphere
 * @param {geomUtils.Plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */


var sphere_plane = function sphere_plane(sphere, plane) {
  var dot = _valueTypes.Vec3.dot(plane.n, sphere.center);

  var r = sphere.radius * plane.n.length();

  if (dot + r < plane.d) {
    return -1;
  } else if (dot - r > plane.d) {
    return 0;
  }

  return 1;
};
/**
 * !#en sphere-frustum intersect, faster but has false positive corner cases<br/>
 * !#zh 球和锥台的相交性检测，速度快，但有错误情况。
 * @static
 * @method sphere_frustum
 * @param {geomUtils.Sphere} sphere
 * @param {geomUtils.Frustum} frustum
 * @return {number} 0 or not 0
 */


var sphere_frustum = function sphere_frustum(sphere, frustum) {
  for (var i = 0; i < frustum.planes.length; i++) {
    // frustum plane normal points to the inside
    if (sphere_plane(sphere, frustum.planes[i]) === -1) {
      return 0;
    }
  } // completely outside


  return 1;
}; // https://stackoverflow.com/questions/20912692/view-frustum-culling-corner-cases

/**
 * !#en sphere-frustum intersect, handles the false positives correctly<br/>
 * !#zh 球和锥台的相交性检测，正确处理大多数错误情况。
 * @static
 * @method sphere_frustum_accurate
 * @param {geomUtils.Sphere} sphere
 * @param {geomUtils.Frustum} frustum
 * @return {number} 0 or not 0
 */


var sphere_frustum_accurate = function () {
  var pt = new _valueTypes.Vec3(0, 0, 0),
      map = [1, -1, 1, -1, 1, -1];
  return function (sphere, frustum) {
    for (var i = 0; i < 6; i++) {
      var plane = frustum.planes[i];
      var r = sphere.radius,
          c = sphere.center;
      var n = plane.n,
          d = plane.d;

      var dot = _valueTypes.Vec3.dot(n, c); // frustum plane normal points to the inside


      if (dot + r < d) {
        return 0;
      } // completely outside
      else if (dot - r > d) {
          continue;
        } // in case of false positives
      // has false negatives, still working on it


      _valueTypes.Vec3.add(pt, c, _valueTypes.Vec3.multiplyScalar(pt, n, r));

      for (var j = 0; j < 6; j++) {
        if (j === i || j === i + map[i]) {
          continue;
        }

        var test = frustum.planes[j];

        if (_valueTypes.Vec3.dot(test.n, pt) < test.d) {
          return 0;
        }
      }
    }

    return 1;
  };
}();
/**
 * !#en sphere-sphere intersect<br/>
 * !#zh 球和球的相交性检测。
 * @static
 * @method sphere_sphere
 * @param {geomUtils.Sphere} sphere0
 * @param {geomUtils.Sphere} sphere1
 * @return {boolean} true or false
 */


var sphere_sphere = function sphere_sphere(sphere0, sphere1) {
  var r = sphere0.radius + sphere1.radius;
  return _valueTypes.Vec3.squaredDistance(sphere0.center, sphere1.center) < r * r;
};
/**
 * !#en sphere-aabb intersect<br/>
 * !#zh 球和轴对齐包围盒的相交性检测。
 * @static
 * @method sphere_aabb
 * @param {geomUtils.Sphere} sphere
 * @param {geomUtils.Aabb} aabb
 * @return {boolean} true or false
 */


var sphere_aabb = function () {
  var pt = new _valueTypes.Vec3();
  return function (sphere, aabb) {
    distance.pt_point_aabb(pt, sphere.center, aabb);
    return _valueTypes.Vec3.squaredDistance(sphere.center, pt) < sphere.radius * sphere.radius;
  };
}();
/**
 * !#en sphere-obb intersect<br/>
 * !#zh 球和方向包围盒的相交性检测。
 * @static
 * @method sphere_obb
 * @param {geomUtils.Sphere} sphere
 * @param {geomUtils.Obb} obb
 * @return {boolean} true or false
 */


var sphere_obb = function () {
  var pt = new _valueTypes.Vec3();
  return function (sphere, obb) {
    distance.pt_point_obb(pt, sphere.center, obb);
    return _valueTypes.Vec3.squaredDistance(sphere.center, pt) < sphere.radius * sphere.radius;
  };
}();

var intersect = {
  // old api
  rayAabb: rayAabb,
  rayMesh: rayMesh,
  raycast: raycast,
  rayTriangle: rayTriangle,
  ray_sphere: ray_sphere,
  ray_aabb: ray_aabb,
  ray_obb: ray_obb,
  ray_plane: ray_plane,
  ray_triangle: ray_triangle,
  line_plane: line_plane,
  line_triangle: line_triangle,
  line_quad: line_quad,
  sphere_sphere: sphere_sphere,
  sphere_aabb: sphere_aabb,
  sphere_obb: sphere_obb,
  sphere_plane: sphere_plane,
  sphere_frustum: sphere_frustum,
  sphere_frustum_accurate: sphere_frustum_accurate,
  aabb_aabb: aabb_aabb,
  aabb_obb: aabb_obb,
  aabb_plane: aabb_plane,
  aabb_frustum: aabb_frustum,
  aabb_frustum_accurate: aabb_frustum_accurate,
  obb_obb: obb_obb,
  obb_plane: obb_plane,
  obb_frustum: obb_frustum,
  obb_frustum_accurate: obb_frustum_accurate,
  obb_point: obb_point,

  /**
   * !#en
   * The intersection detection of g1 and g2 can fill in the shape in the basic geometry.
   * !#zh
   * g1 和 g2 的相交性检测，可填入基础几何中的形状。
   * @static
   * @method resolve
   * @param g1 Geometry 1
   * @param g2 Geometry 2
   * @param outPt optional, Intersection point. (note: only partial shape detection with this return value)
   */
  resolve: function resolve(g1, g2, outPt) {
    if (outPt === void 0) {
      outPt = null;
    }

    var type1 = g1._type,
        type2 = g2._type;
    var resolver = this[type1 | type2];

    if (type1 < type2) {
      return resolver(g1, g2, outPt);
    } else {
      return resolver(g2, g1, outPt);
    }
  }
};
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_SPHERE] = ray_sphere;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_AABB] = ray_aabb;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_OBB] = ray_obb;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_PLANE] = ray_plane;
intersect[_enums["default"].SHAPE_RAY | _enums["default"].SHAPE_TRIANGLE] = ray_triangle;
intersect[_enums["default"].SHAPE_LINE | _enums["default"].SHAPE_PLANE] = line_plane;
intersect[_enums["default"].SHAPE_LINE | _enums["default"].SHAPE_TRIANGLE] = line_triangle;
intersect[_enums["default"].SHAPE_SPHERE] = sphere_sphere;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_AABB] = sphere_aabb;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_OBB] = sphere_obb;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_PLANE] = sphere_plane;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_FRUSTUM] = sphere_frustum;
intersect[_enums["default"].SHAPE_SPHERE | _enums["default"].SHAPE_FRUSTUM_ACCURATE] = sphere_frustum_accurate;
intersect[_enums["default"].SHAPE_AABB] = aabb_aabb;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_OBB] = aabb_obb;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_PLANE] = aabb_plane;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_FRUSTUM] = aabb_frustum;
intersect[_enums["default"].SHAPE_AABB | _enums["default"].SHAPE_FRUSTUM_ACCURATE] = aabb_frustum_accurate;
intersect[_enums["default"].SHAPE_OBB] = obb_obb;
intersect[_enums["default"].SHAPE_OBB | _enums["default"].SHAPE_PLANE] = obb_plane;
intersect[_enums["default"].SHAPE_OBB | _enums["default"].SHAPE_FRUSTUM] = obb_frustum;
intersect[_enums["default"].SHAPE_OBB | _enums["default"].SHAPE_FRUSTUM_ACCURATE] = obb_frustum_accurate;
var _default = intersect;
exports["default"] = _default;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImludGVyc2VjdC50cyJdLCJuYW1lcyI6WyJyYXlfbWVzaCIsInRyaSIsInRyaWFuZ2xlIiwiY3JlYXRlIiwibWluRGlzdCIsIkluZmluaXR5IiwiZ2V0VmVjMyIsIm91dCIsImRhdGEiLCJpZHgiLCJzdHJpZGUiLCJWZWMzIiwic2V0IiwicmF5IiwibWVzaCIsInN1Yk1lc2hlcyIsIl9zdWJNZXNoZXMiLCJpIiwibGVuZ3RoIiwiX3ByaW1pdGl2ZVR5cGUiLCJnZngiLCJQVF9UUklBTkdMRVMiLCJzdWJEYXRhIiwiX3N1YkRhdGFzIiwicG9zRGF0YSIsIl9nZXRBdHRyTWVzaERhdGEiLCJBVFRSX1BPU0lUSU9OIiwiaURhdGEiLCJnZXRJRGF0YSIsIlVpbnQxNkFycmF5IiwiZm9ybWF0IiwidmZtIiwiZm10IiwiZWxlbWVudCIsIm51bSIsImEiLCJiIiwiYyIsImRpc3QiLCJyYXlfdHJpYW5nbGUiLCJyYXlNZXNoIiwicmF5X2Nhc3QiLCJ0cmF2ZXJzYWwiLCJub2RlIiwiY2IiLCJjaGlsZHJlbiIsImNoaWxkIiwiY21wIiwiZGlzdGFuY2UiLCJ0cmFuc2Zvcm1NYXQ0Tm9ybWFsIiwibSIsIm1tIiwieCIsInkiLCJ6Iiwicmh3IiwicmVzdWx0c1Bvb2wiLCJSZWN5Y2xlUG9vbCIsInJlc3VsdHMiLCJub2RlQWFiYiIsImFhYmIiLCJtaW5Qb3MiLCJtYXhQb3MiLCJtb2RlbFJheSIsIm00XzEiLCJjYyIsIm1hdDQiLCJtNF8yIiwiZCIsImRpc3RhbmNlVmFsaWQiLCJyb290Iiwid29ybGRSYXkiLCJoYW5kbGVyIiwiZmlsdGVyIiwicmVzZXQiLCJkaXJlY3RvciIsImdldFNjZW5lIiwiTWF0NCIsImludmVydCIsImdldFdvcmxkTWF0cml4IiwidHJhbnNmb3JtTWF0NCIsIm8iLCJub3JtYWxpemUiLCJjb21wb25lbnQiLCJfcmVuZGVyQ29tcG9uZW50IiwiTWVzaFJlbmRlcmVyIiwicmF5X2FhYmIiLCJfYm91bmRpbmdCb3giLCJ3aWR0aCIsImhlaWdodCIsImFuY2hvclgiLCJhbmNob3JZIiwiZnJvbVBvaW50cyIsInNjYWxlIiwicmVzIiwiYWRkIiwibWFnIiwicHVzaCIsInNvcnQiLCJyYXljYXN0IiwicmF5X3BsYW5lIiwicHQiLCJwbGFuZSIsImRlbm9tIiwiZG90IiwibiIsIk1hdGgiLCJhYnMiLCJOdW1iZXIiLCJFUFNJTE9OIiwibXVsdGlwbHlTY2FsYXIiLCJ0Iiwic3VidHJhY3QiLCJsaW5lX3BsYW5lIiwiYWIiLCJsaW5lIiwiZSIsInMiLCJhYyIsInB2ZWMiLCJ0dmVjIiwicXZlYyIsImRvdWJsZVNpZGVkIiwiY3Jvc3MiLCJkZXQiLCJpbnZfZGV0IiwidSIsInYiLCJyYXlUcmlhbmdsZSIsImxpbmVfdHJpYW5nbGUiLCJxcCIsImFwIiwib3V0UHQiLCJ3IiwiaW52RGV0IiwibGluZV9xdWFkIiwicHEiLCJwYSIsInBiIiwicGMiLCJwZCIsInRtcCIsInAiLCJxIiwicmF5X3NwaGVyZSIsInNwaGVyZSIsInIiLCJyYWRpdXMiLCJjZW50ZXIiLCJyU3EiLCJlU3EiLCJsZW5ndGhTcXIiLCJhTGVuZ3RoIiwiZlNxIiwiZiIsInNxcnQiLCJtaW4iLCJtYXgiLCJpeCIsIml5IiwiaXoiLCJoYWxmRXh0ZW50cyIsInQxIiwidDIiLCJ0MyIsInQ0IiwidDUiLCJ0NiIsInRtaW4iLCJ0bWF4IiwicmF5QWFiYiIsInJheV9vYmIiLCJYIiwiWSIsIloiLCJzaXplIiwiQXJyYXkiLCJvYmIiLCJvYmJtIiwib3JpZW50YXRpb24iLCJhYWJiX2FhYmIiLCJhTWluIiwiYU1heCIsImJNaW4iLCJiTWF4IiwiYWFiYjEiLCJhYWJiMiIsImdldEFBQkJWZXJ0aWNlcyIsImdldE9CQlZlcnRpY2VzIiwiYTEiLCJhMiIsImEzIiwiZ2V0SW50ZXJ2YWwiLCJ2ZXJ0aWNlcyIsImF4aXMiLCJwcm9qZWN0aW9uIiwiYWFiYl9vYmIiLCJ0ZXN0IiwidmVydGljZXMyIiwiaiIsImFhYmJfcGxhbmUiLCJhYWJiX2ZydXN0dW0iLCJmcnVzdHVtIiwicGxhbmVzIiwiYWFiYl9mcnVzdHVtX2FjY3VyYXRlIiwib3V0MSIsIm91dDIiLCJyZXN1bHQiLCJpbnRlcnNlY3RzIiwib2JiX3BvaW50IiwibTMiLCJNYXQzIiwibGVzc1RoYW4iLCJwb2ludCIsInRyYW5zZm9ybU1hdDMiLCJ0cmFuc3Bvc2UiLCJvYmJfcGxhbmUiLCJhYnNEb3QiLCJvYmJfZnJ1c3R1bSIsIm9iYl9mcnVzdHVtX2FjY3VyYXRlIiwib2JiX29iYiIsIm9iYjEiLCJvYmIyIiwib2JiMW0iLCJvYmIybSIsInNwaGVyZV9wbGFuZSIsInNwaGVyZV9mcnVzdHVtIiwic3BoZXJlX2ZydXN0dW1fYWNjdXJhdGUiLCJtYXAiLCJzcGhlcmVfc3BoZXJlIiwic3BoZXJlMCIsInNwaGVyZTEiLCJzcXVhcmVkRGlzdGFuY2UiLCJzcGhlcmVfYWFiYiIsInB0X3BvaW50X2FhYmIiLCJzcGhlcmVfb2JiIiwicHRfcG9pbnRfb2JiIiwiaW50ZXJzZWN0IiwicmVzb2x2ZSIsImcxIiwiZzIiLCJ0eXBlMSIsIl90eXBlIiwidHlwZTIiLCJyZXNvbHZlciIsImVudW1zIiwiU0hBUEVfUkFZIiwiU0hBUEVfU1BIRVJFIiwiU0hBUEVfQUFCQiIsIlNIQVBFX09CQiIsIlNIQVBFX1BMQU5FIiwiU0hBUEVfVFJJQU5HTEUiLCJTSEFQRV9MSU5FIiwiU0hBUEVfRlJVU1RVTSIsIlNIQVBFX0ZSVVNUVU1fQUNDVVJBVEUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBS0E7O0FBRUE7Ozs7Ozs7O0FBdENBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0NBOzs7QUFJQSxJQUFNQSxRQUFRLEdBQUksWUFBWTtBQUMxQixNQUFJQyxHQUFHLEdBQUdDLHFCQUFTQyxNQUFULEVBQVY7O0FBQ0EsTUFBSUMsT0FBTyxHQUFHQyxRQUFkOztBQUVBLFdBQVNDLE9BQVQsQ0FBa0JDLEdBQWxCLEVBQXVCQyxJQUF2QixFQUE2QkMsR0FBN0IsRUFBa0NDLE1BQWxDLEVBQTBD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QU4sR0FBbUJILGtCQUFNSSxTQUExQixDQUFULEdBQWdEckQsUUFBaEQ7QUFDQXlDLFNBQVMsQ0FBQ1Esa0JBQU1HLFVBQU4sR0FBbUJILGtCQUFNSyxXQUExQixDQUFULEdBQWtEbEQsVUFBbEQ7QUFDQXFDLFNBQVMsQ0FBQ1Esa0JBQU1HLFVBQU4sR0FBbUJILGtCQUFNUSxhQUExQixDQUFULEdBQW9EcEQsWUFBcEQ7QUFDQW9DLFNBQVMsQ0FBQ1Esa0JBQU1HLFVBQU4sR0FBbUJILGtCQUFNUyxzQkFBMUIsQ0FBVCxHQUE2RGxELHFCQUE3RDtBQUVBaUMsU0FBUyxDQUFDUSxrQkFBTUksU0FBUCxDQUFULEdBQTZCN0IsT0FBN0I7QUFDQWlCLFNBQVMsQ0FBQ1Esa0JBQU1JLFNBQU4sR0FBa0JKLGtCQUFNSyxXQUF6QixDQUFULEdBQWlEbEMsU0FBakQ7QUFDQXFCLFNBQVMsQ0FBQ1Esa0JBQU1JLFNBQU4sR0FBa0JKLGtCQUFNUSxhQUF6QixDQUFULEdBQW1EbkMsV0FBbkQ7QUFDQW1CLFNBQVMsQ0FBQ1Esa0JBQU1JLFNBQU4sR0FBa0JKLGtCQUFNUyxzQkFBekIsQ0FBVCxHQUE0RG5DLG9CQUE1RDtlQUVla0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IGdmeCBmcm9tICcuLi8uLi9yZW5kZXJlci9nZngnO1xuaW1wb3J0IFJlY3ljbGVQb29sIGZyb20gJy4uLy4uL3JlbmRlcmVyL21lbW9wL3JlY3ljbGUtcG9vbCc7XG5cbmltcG9ydCB7IE1hdDMsIFZlYzMsIE1hdDQgfSBmcm9tICcuLi92YWx1ZS10eXBlcyc7XG5pbXBvcnQgYWFiYiBmcm9tICcuL2FhYmInO1xuaW1wb3J0ICogYXMgZGlzdGFuY2UgZnJvbSAnLi9kaXN0YW5jZSc7XG5pbXBvcnQgZW51bXMgZnJvbSAnLi9lbnVtcyc7XG5pbXBvcnQgeyBmcnVzdHVtIH0gZnJvbSAnLi9mcnVzdHVtJztcbmltcG9ydCBsaW5lIGZyb20gJy4vbGluZSc7XG5pbXBvcnQgb2JiIGZyb20gJy4vb2JiJztcbmltcG9ydCBwbGFuZSBmcm9tICcuL3BsYW5lJztcbmltcG9ydCByYXkgZnJvbSAnLi9yYXknO1xuaW1wb3J0IHNwaGVyZSBmcm9tICcuL3NwaGVyZSc7XG5pbXBvcnQgdHJpYW5nbGUgZnJvbSAnLi90cmlhbmdsZSc7XG5cbi8qKlxuICogQGNsYXNzIGdlb21VdGlscy5pbnRlcnNlY3RcbiAqL1xuXG5jb25zdCByYXlfbWVzaCA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHRyaSA9IHRyaWFuZ2xlLmNyZWF0ZSgpO1xuICAgIGxldCBtaW5EaXN0ID0gSW5maW5pdHk7XG5cbiAgICBmdW5jdGlvbiBnZXRWZWMzIChvdXQsIGRhdGEsIGlkeCwgc3RyaWRlKSB7XG4gICAgICAgIFZlYzMuc2V0KG91dCwgZGF0YVtpZHgqc3RyaWRlXSwgZGF0YVtpZHgqc3RyaWRlICsgMV0sIGRhdGFbaWR4KnN0cmlkZSArIDJdKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyYXksIG1lc2gpIHtcbiAgICAgICAgbWluRGlzdCA9IEluZmluaXR5O1xuICAgICAgICBsZXQgc3ViTWVzaGVzID0gbWVzaC5fc3ViTWVzaGVzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ViTWVzaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoc3ViTWVzaGVzW2ldLl9wcmltaXRpdmVUeXBlICE9PSBnZnguUFRfVFJJQU5HTEVTKSBjb250aW51ZTtcblxuICAgICAgICAgICAgbGV0IHN1YkRhdGEgPSAobWVzaC5fc3ViRGF0YXNbaV0gfHwgbWVzaC5fc3ViRGF0YXNbMF0pO1xuICAgICAgICAgICAgbGV0IHBvc0RhdGEgPSBtZXNoLl9nZXRBdHRyTWVzaERhdGEoaSwgZ2Z4LkFUVFJfUE9TSVRJT04pO1xuICAgICAgICAgICAgbGV0IGlEYXRhID0gc3ViRGF0YS5nZXRJRGF0YShVaW50MTZBcnJheSk7XG5cbiAgICAgICAgICAgIGxldCBmb3JtYXQgPSBzdWJEYXRhLnZmbTtcbiAgICAgICAgICAgIGxldCBmbXQgPSBmb3JtYXQuZWxlbWVudChnZnguQVRUUl9QT1NJVElPTik7XG4gICAgICAgICAgICBsZXQgbnVtID0gZm10Lm51bTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaURhdGEubGVuZ3RoOyBpICs9IDMpIHtcbiAgICAgICAgICAgICAgICBnZXRWZWMzKHRyaS5hLCBwb3NEYXRhLCBpRGF0YVsgaSBdLCBudW0pO1xuICAgICAgICAgICAgICAgIGdldFZlYzModHJpLmIsIHBvc0RhdGEsIGlEYXRhW2krMV0sIG51bSk7XG4gICAgICAgICAgICAgICAgZ2V0VmVjMyh0cmkuYywgcG9zRGF0YSwgaURhdGFbaSsyXSwgbnVtKTtcblxuICAgICAgICAgICAgICAgIGxldCBkaXN0ID0gcmF5X3RyaWFuZ2xlKHJheSwgdHJpKTtcbiAgICAgICAgICAgICAgICBpZiAoZGlzdCA+IDAgJiYgZGlzdCA8IG1pbkRpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbWluRGlzdCA9IGRpc3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW5EaXN0O1xuICAgIH07XG59KSgpO1xuXG4vLyBhZGFwdCB0byBvbGQgYXBpXG5jb25zdCByYXlNZXNoID0gcmF5X21lc2g7XG5cbi8qKiBcbiAqICEjZW5cbiAqIENoZWNrIHdoZXRoZXIgcmF5IGludGVyc2VjdCB3aXRoIG5vZGVzXG4gKiAhI3poXG4gKiDmo4DmtYvlsITnur/mmK/lkKbkuI7niankvZPmnInkuqTpm4ZcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2QgcmF5X2Nhc3RcbiAqIEBwYXJhbSB7Tm9kZX0gcm9vdCAtIElmIHJvb3QgaXMgbnVsbCwgdGhlbiB0cmF2ZXJzYWwgbm9kZXMgZnJvbSBzY2VuZSBub2RlXG4gKiBAcGFyYW0ge2dlb21VdGlscy5SYXl9IHdvcmxkUmF5XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmaWx0ZXJcbiAqIEByZXR1cm4ge1tdfSBbe25vZGUsIGRpc3RhbmNlfV1cbiovXG5jb25zdCByYXlfY2FzdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gdHJhdmVyc2FsIChub2RlLCBjYikge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSBjaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICB0cmF2ZXJzYWwoY2hpbGQsIGNiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNiKG5vZGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNtcCAoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5kaXN0YW5jZSAtIGIuZGlzdGFuY2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJhbnNmb3JtTWF0NE5vcm1hbCAob3V0LCBhLCBtKSB7XG4gICAgICAgIGxldCBtbSA9IG0ubTtcbiAgICAgICAgbGV0IHggPSBhLngsIHkgPSBhLnksIHogPSBhLnosXG4gICAgICAgICAgICByaHcgPSBtbVszXSAqIHggKyBtbVs3XSAqIHkgKyBtbVsxMV0gKiB6O1xuICAgICAgICByaHcgPSByaHcgPyAxIC8gcmh3IDogMTtcbiAgICAgICAgb3V0LnggPSAobW1bMF0gKiB4ICsgbW1bNF0gKiB5ICsgbW1bOF0gKiB6KSAqIHJodztcbiAgICAgICAgb3V0LnkgPSAobW1bMV0gKiB4ICsgbW1bNV0gKiB5ICsgbW1bOV0gKiB6KSAqIHJodztcbiAgICAgICAgb3V0LnogPSAobW1bMl0gKiB4ICsgbW1bNl0gKiB5ICsgbW1bMTBdICogeikgKiByaHc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdHNQb29sID0gbmV3IFJlY3ljbGVQb29sKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRpc3RhbmNlOiAwLFxuICAgICAgICAgICAgbm9kZTogbnVsbFxuICAgICAgICB9XG4gICAgfSwgMSk7XG5cbiAgICBsZXQgcmVzdWx0cyA9IFtdO1xuXG4gICAgLy8gdGVtcCB2YXJpYWJsZVxuICAgIGxldCBub2RlQWFiYiA9IGFhYmIuY3JlYXRlKCk7XG4gICAgbGV0IG1pblBvcyA9IG5ldyBWZWMzKCk7XG4gICAgbGV0IG1heFBvcyA9IG5ldyBWZWMzKCk7XG5cbiAgICBsZXQgbW9kZWxSYXkgPSBuZXcgcmF5KCk7XG4gICAgbGV0IG00XzEgPSBjYy5tYXQ0KCk7XG4gICAgbGV0IG00XzIgPSBjYy5tYXQ0KCk7XG4gICAgbGV0IGQgPSBuZXcgVmVjMygpO1xuXG4gICAgZnVuY3Rpb24gZGlzdGFuY2VWYWxpZCAoZGlzdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIGRpc3RhbmNlID4gMCAmJiBkaXN0YW5jZSA8IEluZmluaXR5O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAocm9vdCwgd29ybGRSYXksIGhhbmRsZXIsIGZpbHRlcikge1xuICAgICAgICByZXN1bHRzUG9vbC5yZXNldCgpO1xuICAgICAgICByZXN1bHRzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgcm9vdCA9IHJvb3QgfHwgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKTtcbiAgICAgICAgdHJhdmVyc2FsKHJvb3QsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICBpZiAoZmlsdGVyICYmICFmaWx0ZXIobm9kZSkpIHJldHVybjtcblxuICAgICAgICAgICAgLy8gdHJhbnNmb3JtIHdvcmxkIHJheSB0byBtb2RlbCByYXlcbiAgICAgICAgICAgIE1hdDQuaW52ZXJ0KG00XzIsIG5vZGUuZ2V0V29ybGRNYXRyaXgobTRfMSkpO1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG1vZGVsUmF5Lm8sIHdvcmxkUmF5Lm8sIG00XzIpO1xuICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUobW9kZWxSYXkuZCwgdHJhbnNmb3JtTWF0NE5vcm1hbChtb2RlbFJheS5kLCB3b3JsZFJheS5kLCBtNF8yKSk7XG5cbiAgICAgICAgICAgIC8vIHJheWNhc3Qgd2l0aCBib3VuZGluZyBib3hcbiAgICAgICAgICAgIGxldCBkaXN0YW5jZSA9IEluZmluaXR5O1xuICAgICAgICAgICAgbGV0IGNvbXBvbmVudCA9IG5vZGUuX3JlbmRlckNvbXBvbmVudDtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgaW5zdGFuY2VvZiBjYy5NZXNoUmVuZGVyZXIgKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSByYXlfYWFiYihtb2RlbFJheSwgY29tcG9uZW50Ll9ib3VuZGluZ0JveCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChub2RlLndpZHRoICYmIG5vZGUuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgVmVjMy5zZXQobWluUG9zLCAtbm9kZS53aWR0aCAqIG5vZGUuYW5jaG9yWCwgLW5vZGUuaGVpZ2h0ICogbm9kZS5hbmNob3JZLCBub2RlLnopO1xuICAgICAgICAgICAgICAgIFZlYzMuc2V0KG1heFBvcywgbm9kZS53aWR0aCAqICgxIC0gbm9kZS5hbmNob3JYKSwgbm9kZS5oZWlnaHQgKiAoMSAtIG5vZGUuYW5jaG9yWSksIG5vZGUueik7XG4gICAgICAgICAgICAgICAgYWFiYi5mcm9tUG9pbnRzKG5vZGVBYWJiLCBtaW5Qb3MsIG1heFBvcyk7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSByYXlfYWFiYihtb2RlbFJheSwgbm9kZUFhYmIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWRpc3RhbmNlVmFsaWQoZGlzdGFuY2UpKSByZXR1cm47XG5cbiAgICAgICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBoYW5kbGVyKG1vZGVsUmF5LCBub2RlLCBkaXN0YW5jZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkaXN0YW5jZVZhbGlkKGRpc3RhbmNlKSkge1xuICAgICAgICAgICAgICAgIFZlYzMuc2NhbGUoZCwgbW9kZWxSYXkuZCwgZGlzdGFuY2UpO1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybU1hdDROb3JtYWwoZCwgZCwgbTRfMSk7XG4gICAgICAgICAgICAgICAgbGV0IHJlcyA9IHJlc3VsdHNQb29sLmFkZCgpO1xuICAgICAgICAgICAgICAgIHJlcy5ub2RlID0gbm9kZTtcbiAgICAgICAgICAgICAgICByZXMuZGlzdGFuY2UgPSBWZWMzLm1hZyhkKTtcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2gocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzdWx0cy5zb3J0KGNtcCk7XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cbn0pKCk7XG5cbi8vIGFkYXB0IHRvIG9sZCBhcGlcbmNvbnN0IHJheWNhc3QgPSByYXlfY2FzdDtcblxuLyoqXG4gKiAhI2VuIHJheS1wbGFuZSBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDlsITnur/kuI7lubPpnaLnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2QgcmF5X3BsYW5lXG4gKiBAcGFyYW0ge2dlb21VdGlscy5SYXl9IHJheVxuICogQHBhcmFtIHtnZW9tVXRpbHMuUGxhbmV9IHBsYW5lXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3QgcmF5X3BsYW5lID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBwdCA9IG5ldyBWZWMzKDAsIDAsIDApO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyYXk6IHJheSwgcGxhbmU6IHBsYW5lKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgZGVub20gPSBWZWMzLmRvdChyYXkuZCwgcGxhbmUubik7XG4gICAgICAgIGlmIChNYXRoLmFicyhkZW5vbSkgPCBOdW1iZXIuRVBTSUxPTikgeyByZXR1cm4gMDsgfVxuICAgICAgICBWZWMzLm11bHRpcGx5U2NhbGFyKHB0LCBwbGFuZS5uLCBwbGFuZS5kKTtcbiAgICAgICAgY29uc3QgdCA9IFZlYzMuZG90KFZlYzMuc3VidHJhY3QocHQsIHB0LCByYXkubyksIHBsYW5lLm4pIC8gZGVub207XG4gICAgICAgIGlmICh0IDwgMCkgeyByZXR1cm4gMDsgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIGxpbmUtcGxhbmUgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg57q/5q615LiO5bmz6Z2i55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIGxpbmVfcGxhbmVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLkxpbmV9IGxpbmVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLlBsYW5lfSBwbGFuZVxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IGxpbmVfcGxhbmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFiID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGxpbmU6IGxpbmUsIHBsYW5lOiBwbGFuZSk6IG51bWJlciB7XG4gICAgICAgIFZlYzMuc3VidHJhY3QoYWIsIGxpbmUuZSwgbGluZS5zKTtcbiAgICAgICAgY29uc3QgdCA9IChwbGFuZS5kIC0gVmVjMy5kb3QobGluZS5zLCBwbGFuZS5uKSkgLyBWZWMzLmRvdChhYiwgcGxhbmUubik7XG4gICAgICAgIGlmICh0IDwgMCB8fCB0ID4gMSkgeyByZXR1cm4gMDsgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xufSkoKTtcblxuLy8gYmFzZWQgb24gaHR0cDovL2ZpbGVhZG1pbi5jcy5sdGguc2UvY3MvUGVyc29uYWwvVG9tYXNfQWtlbmluZS1Nb2xsZXIvcmF5dHJpL1xuLyoqXG4gKiAhI2VuIHJheS10cmlhbmdsZSBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDlsITnur/kuI7kuInop5LlvaLnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2QgcmF5X3RyaWFuZ2xlXG4gKiBAcGFyYW0ge2dlb21VdGlscy5SYXl9IHJheVxuICogQHBhcmFtIHtnZW9tVXRpbHMuVHJpYW5nbGV9IHRyaWFuZ2xlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGRvdWJsZVNpZGVkXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3QgcmF5X3RyaWFuZ2xlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhYiA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IGFjID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgY29uc3QgcHZlYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IHR2ZWMgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBxdmVjID0gbmV3IFZlYzMoMCwgMCwgMCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHJheTogcmF5LCB0cmlhbmdsZTogdHJpYW5nbGUsIGRvdWJsZVNpZGVkPzogYm9vbGVhbikge1xuICAgICAgICBWZWMzLnN1YnRyYWN0KGFiLCB0cmlhbmdsZS5iLCB0cmlhbmdsZS5hKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChhYywgdHJpYW5nbGUuYywgdHJpYW5nbGUuYSk7XG5cbiAgICAgICAgVmVjMy5jcm9zcyhwdmVjLCByYXkuZCwgYWMpO1xuICAgICAgICBjb25zdCBkZXQgPSBWZWMzLmRvdChhYiwgcHZlYyk7XG4gICAgICAgIGlmIChkZXQgPCBOdW1iZXIuRVBTSUxPTiAmJiAoIWRvdWJsZVNpZGVkIHx8IGRldCA+IC1OdW1iZXIuRVBTSUxPTikpIHsgcmV0dXJuIDA7IH1cblxuICAgICAgICBjb25zdCBpbnZfZGV0ID0gMSAvIGRldDtcblxuICAgICAgICBWZWMzLnN1YnRyYWN0KHR2ZWMsIHJheS5vLCB0cmlhbmdsZS5hKTtcbiAgICAgICAgY29uc3QgdSA9IFZlYzMuZG90KHR2ZWMsIHB2ZWMpICogaW52X2RldDtcbiAgICAgICAgaWYgKHUgPCAwIHx8IHUgPiAxKSB7IHJldHVybiAwOyB9XG5cbiAgICAgICAgVmVjMy5jcm9zcyhxdmVjLCB0dmVjLCBhYik7XG4gICAgICAgIGNvbnN0IHYgPSBWZWMzLmRvdChyYXkuZCwgcXZlYykgKiBpbnZfZGV0O1xuICAgICAgICBpZiAodiA8IDAgfHwgdSArIHYgPiAxKSB7IHJldHVybiAwOyB9XG5cbiAgICAgICAgY29uc3QgdCA9IFZlYzMuZG90KGFjLCBxdmVjKSAqIGludl9kZXQ7XG4gICAgICAgIHJldHVybiB0IDwgMCA/IDAgOiB0O1xuICAgIH07XG59KSgpO1xuXG4vLyBhZGFwdCB0byBvbGQgYXBpXG5jb25zdCByYXlUcmlhbmdsZSA9IHJheV90cmlhbmdsZTtcblxuLyoqXG4gKiAhI2VuIGxpbmUtdHJpYW5nbGUgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg57q/5q615LiO5LiJ6KeS5b2i55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIGxpbmVfdHJpYW5nbGVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLkxpbmV9IGxpbmVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLlRyaWFuZ2xlfSB0cmlhbmdsZVxuICogQHBhcmFtIHtWZWMzfSBvdXRQdCBvcHRpb25hbCwgVGhlIGludGVyc2VjdGlvbiBwb2ludFxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IGxpbmVfdHJpYW5nbGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGFiID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgY29uc3QgYWMgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBxcCA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IGFwID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgY29uc3QgbiA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IGUgPSBuZXcgVmVjMygwLCAwLCAwKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAobGluZTogbGluZSwgdHJpYW5nbGU6IHRyaWFuZ2xlLCBvdXRQdDogVmVjMyk6IG51bWJlciB7XG4gICAgICAgIFZlYzMuc3VidHJhY3QoYWIsIHRyaWFuZ2xlLmIsIHRyaWFuZ2xlLmEpO1xuICAgICAgICBWZWMzLnN1YnRyYWN0KGFjLCB0cmlhbmdsZS5jLCB0cmlhbmdsZS5hKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChxcCwgbGluZS5zLCBsaW5lLmUpO1xuXG4gICAgICAgIFZlYzMuY3Jvc3MobiwgYWIsIGFjKTtcbiAgICAgICAgY29uc3QgZGV0ID0gVmVjMy5kb3QocXAsIG4pO1xuXG4gICAgICAgIGlmIChkZXQgPD0gMC4wKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIFZlYzMuc3VidHJhY3QoYXAsIGxpbmUucywgdHJpYW5nbGUuYSk7XG4gICAgICAgIGNvbnN0IHQgPSBWZWMzLmRvdChhcCwgbik7XG4gICAgICAgIGlmICh0IDwgMCB8fCB0ID4gZGV0KSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIFZlYzMuY3Jvc3MoZSwgcXAsIGFwKTtcbiAgICAgICAgbGV0IHYgPSBWZWMzLmRvdChhYywgZSk7XG4gICAgICAgIGlmICh2IDwgMCB8fCB2ID4gZGV0KSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB3ID0gLVZlYzMuZG90KGFiLCBlKTtcbiAgICAgICAgaWYgKHcgPCAwLjAgfHwgdiArIHcgPiBkZXQpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG91dFB0KSB7XG4gICAgICAgICAgICBjb25zdCBpbnZEZXQgPSAxLjAgLyBkZXQ7XG4gICAgICAgICAgICB2ICo9IGludkRldDtcbiAgICAgICAgICAgIHcgKj0gaW52RGV0O1xuICAgICAgICAgICAgY29uc3QgdSA9IDEuMCAtIHYgLSB3O1xuXG4gICAgICAgICAgICAvLyBvdXRQdCA9IHUqYSArIHYqZCArIHcqYztcbiAgICAgICAgICAgIFZlYzMuc2V0KG91dFB0LFxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlLmEueCAqIHUgKyB0cmlhbmdsZS5iLnggKiB2ICsgdHJpYW5nbGUuYy54ICogdyxcbiAgICAgICAgICAgICAgICB0cmlhbmdsZS5hLnkgKiB1ICsgdHJpYW5nbGUuYi55ICogdiArIHRyaWFuZ2xlLmMueSAqIHcsXG4gICAgICAgICAgICAgICAgdHJpYW5nbGUuYS56ICogdSArIHRyaWFuZ2xlLmIueiAqIHYgKyB0cmlhbmdsZS5jLnogKiB3LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqICEjZW4gbGluZS1xdWFkIGludGVyc2VjdDxici8+XG4gKiAhI3poIOe6v+auteS4juWbm+i+ueW9oueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBsaW5lX3F1YWRcbiAqIEBwYXJhbSB7VmVjM30gcCBBIHBvaW50IG9uIGEgbGluZSBzZWdtZW50XG4gKiBAcGFyYW0ge1ZlYzN9IHEgQW5vdGhlciBwb2ludCBvbiB0aGUgbGluZSBzZWdtZW50XG4gKiBAcGFyYW0ge1ZlYzN9IGEgUXVhZHJpbGF0ZXJhbCBwb2ludCBhXG4gKiBAcGFyYW0ge1ZlYzN9IGIgUXVhZHJpbGF0ZXJhbCBwb2ludCBiXG4gKiBAcGFyYW0ge1ZlYzN9IGMgUXVhZHJpbGF0ZXJhbCBwb2ludCBjXG4gKiBAcGFyYW0ge1ZlYzN9IGQgUXVhZHJpbGF0ZXJhbCBwb2ludCBkXG4gKiBAcGFyYW0ge1ZlYzN9IG91dFB0IG9wdGlvbmFsLCBUaGUgaW50ZXJzZWN0aW9uIHBvaW50XG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3QgbGluZV9xdWFkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBwcSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IHBhID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgY29uc3QgcGIgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICBjb25zdCBwYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IHBkID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgY29uc3QgbSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIGNvbnN0IHRtcCA9IG5ldyBWZWMzKDAsIDAsIDApO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwOiBWZWMzLCBxOiBWZWMzLCBhOiBWZWMzLCBiOiBWZWMzLCBjOiBWZWMzLCBkOiBWZWMzLCBvdXRQdDogVmVjMyk6IG51bWJlciB7XG4gICAgICAgIFZlYzMuc3VidHJhY3QocHEsIHEsIHApO1xuICAgICAgICBWZWMzLnN1YnRyYWN0KHBhLCBhLCBwKTtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChwYiwgYiwgcCk7XG4gICAgICAgIFZlYzMuc3VidHJhY3QocGMsIGMsIHApO1xuXG4gICAgICAgIC8vIERldGVybWluZSB3aGljaCB0cmlhbmdsZSB0byB0ZXN0IGFnYWluc3QgYnkgdGVzdGluZyBhZ2FpbnN0IGRpYWdvbmFsIGZpcnN0XG4gICAgICAgIFZlYzMuY3Jvc3MobSwgcGMsIHBxKTtcbiAgICAgICAgbGV0IHYgPSBWZWMzLmRvdChwYSwgbSk7XG5cbiAgICAgICAgaWYgKHYgPj0gMCkge1xuICAgICAgICAgICAgLy8gVGVzdCBpbnRlcnNlY3Rpb24gYWdhaW5zdCB0cmlhbmdsZSBhYmNcbiAgICAgICAgICAgIGxldCB1ID0gLVZlYzMuZG90KHBiLCBtKTtcbiAgICAgICAgICAgIGlmICh1IDwgMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdyA9IFZlYzMuZG90KFZlYzMuY3Jvc3ModG1wLCBwcSwgcGIpLCBwYSk7XG4gICAgICAgICAgICBpZiAodyA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gb3V0UHQgPSB1KmEgKyB2KmIgKyB3KmM7XG4gICAgICAgICAgICBpZiAob3V0UHQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZW5vbSA9IDEuMCAvICh1ICsgdiArIHcpO1xuICAgICAgICAgICAgICAgIHUgKj0gZGVub207XG4gICAgICAgICAgICAgICAgdiAqPSBkZW5vbTtcbiAgICAgICAgICAgICAgICB3ICo9IGRlbm9tO1xuXG4gICAgICAgICAgICAgICAgVmVjMy5zZXQob3V0UHQsXG4gICAgICAgICAgICAgICAgICAgIGEueCAqIHUgKyBiLnggKiB2ICsgYy54ICogdyxcbiAgICAgICAgICAgICAgICAgICAgYS55ICogdSArIGIueSAqIHYgKyBjLnkgKiB3LFxuICAgICAgICAgICAgICAgICAgICBhLnogKiB1ICsgYi56ICogdiArIGMueiAqIHcsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRlc3QgaW50ZXJzZWN0aW9uIGFnYWluc3QgdHJpYW5nbGUgZGFjXG4gICAgICAgICAgICBWZWMzLnN1YnRyYWN0KHBkLCBkLCBwKTtcblxuICAgICAgICAgICAgbGV0IHUgPSBWZWMzLmRvdChwZCwgbSk7XG4gICAgICAgICAgICBpZiAodSA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHcgPSBWZWMzLmRvdChWZWMzLmNyb3NzKHRtcCwgcHEsIHBhKSwgcGQpO1xuICAgICAgICAgICAgaWYgKHcgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG91dFB0ID0gdSphICsgdipkICsgdypjO1xuICAgICAgICAgICAgaWYgKG91dFB0KSB7XG4gICAgICAgICAgICAgICAgdiA9IC12O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZGVub20gPSAxLjAgLyAodSArIHYgKyB3KTtcbiAgICAgICAgICAgICAgICB1ICo9IGRlbm9tO1xuICAgICAgICAgICAgICAgIHYgKj0gZGVub207XG4gICAgICAgICAgICAgICAgdyAqPSBkZW5vbTtcblxuICAgICAgICAgICAgICAgIFZlYzMuc2V0KG91dFB0LFxuICAgICAgICAgICAgICAgICAgICBhLnggKiB1ICsgZC54ICogdiArIGMueCAqIHcsXG4gICAgICAgICAgICAgICAgICAgIGEueSAqIHUgKyBkLnkgKiB2ICsgYy55ICogdyxcbiAgICAgICAgICAgICAgICAgICAgYS56ICogdSArIGQueiAqIHYgKyBjLnogKiB3LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIHJheS1zcGhlcmUgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg5bCE57q/5ZKM55CD55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIHJheV9zcGhlcmVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLlJheX0gcmF5XG4gKiBAcGFyYW0ge2dlb21VdGlscy5TcGhlcmV9IHNwaGVyZVxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IHJheV9zcGhlcmUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGUgPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJheTogcmF5LCBzcGhlcmU6IHNwaGVyZSk6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IHIgPSBzcGhlcmUucmFkaXVzO1xuICAgICAgICBjb25zdCBjID0gc3BoZXJlLmNlbnRlcjtcbiAgICAgICAgY29uc3QgbyA9IHJheS5vO1xuICAgICAgICBjb25zdCBkID0gcmF5LmQ7XG4gICAgICAgIGNvbnN0IHJTcSA9IHIgKiByO1xuICAgICAgICBWZWMzLnN1YnRyYWN0KGUsIGMsIG8pO1xuICAgICAgICBjb25zdCBlU3EgPSBlLmxlbmd0aFNxcigpO1xuXG4gICAgICAgIGNvbnN0IGFMZW5ndGggPSBWZWMzLmRvdChlLCBkKTsgLy8gYXNzdW1lIHJheSBkaXJlY3Rpb24gYWxyZWFkeSBub3JtYWxpemVkXG4gICAgICAgIGNvbnN0IGZTcSA9IHJTcSAtIChlU3EgLSBhTGVuZ3RoICogYUxlbmd0aCk7XG4gICAgICAgIGlmIChmU3EgPCAwKSB7IHJldHVybiAwOyB9XG5cbiAgICAgICAgY29uc3QgZiA9IE1hdGguc3FydChmU3EpO1xuICAgICAgICBjb25zdCB0ID0gZVNxIDwgclNxID8gYUxlbmd0aCArIGYgOiBhTGVuZ3RoIC0gZjtcbiAgICAgICAgaWYgKHQgPCAwKSB7IHJldHVybiAwOyB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqICEjZW4gcmF5LWFhYmIgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg5bCE57q/5ZKM6L205a+56b2Q5YyF5Zu055uS55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIHJheV9hYWJiXG4gKiBAcGFyYW0ge2dlb21VdGlscy5SYXl9IHJheVxuICogQHBhcmFtIHtnZW9tVXRpbHMuQWFiYn0gYWFiYiBBbGlnbiB0aGUgYXhpcyBhcm91bmQgdGhlIGJveFxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IHJheV9hYWJiID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtaW4gPSBuZXcgVmVjMygpO1xuICAgIGNvbnN0IG1heCA9IG5ldyBWZWMzKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyYXk6IHJheSwgYWFiYjogYWFiYik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IG8gPSByYXkubywgZCA9IHJheS5kO1xuICAgICAgICBjb25zdCBpeCA9IDEgLyBkLngsIGl5ID0gMSAvIGQueSwgaXogPSAxIC8gZC56O1xuICAgICAgICBWZWMzLnN1YnRyYWN0KG1pbiwgYWFiYi5jZW50ZXIsIGFhYmIuaGFsZkV4dGVudHMpO1xuICAgICAgICBWZWMzLmFkZChtYXgsIGFhYmIuY2VudGVyLCBhYWJiLmhhbGZFeHRlbnRzKTtcbiAgICAgICAgY29uc3QgdDEgPSAobWluLnggLSBvLngpICogaXg7XG4gICAgICAgIGNvbnN0IHQyID0gKG1heC54IC0gby54KSAqIGl4O1xuICAgICAgICBjb25zdCB0MyA9IChtaW4ueSAtIG8ueSkgKiBpeTtcbiAgICAgICAgY29uc3QgdDQgPSAobWF4LnkgLSBvLnkpICogaXk7XG4gICAgICAgIGNvbnN0IHQ1ID0gKG1pbi56IC0gby56KSAqIGl6O1xuICAgICAgICBjb25zdCB0NiA9IChtYXgueiAtIG8ueikgKiBpejtcbiAgICAgICAgY29uc3QgdG1pbiA9IE1hdGgubWF4KE1hdGgubWF4KE1hdGgubWluKHQxLCB0MiksIE1hdGgubWluKHQzLCB0NCkpLCBNYXRoLm1pbih0NSwgdDYpKTtcbiAgICAgICAgY29uc3QgdG1heCA9IE1hdGgubWluKE1hdGgubWluKE1hdGgubWF4KHQxLCB0MiksIE1hdGgubWF4KHQzLCB0NCkpLCBNYXRoLm1heCh0NSwgdDYpKTtcbiAgICAgICAgaWYgKHRtYXggPCAwIHx8IHRtaW4gPiB0bWF4KSB7IHJldHVybiAwIH07XG4gICAgICAgIHJldHVybiB0bWluO1xuICAgIH07XG59KSgpO1xuXG4vLyBhZGFwdCB0byBvbGQgYXBpXG5jb25zdCByYXlBYWJiID0gcmF5X2FhYmI7XG5cbi8qKlxuICogISNlbiByYXktb2JiIGludGVyc2VjdDxici8+XG4gKiAhI3poIOWwhOe6v+WSjOaWueWQkeWMheWbtOebkueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCByYXlfb2JiXG4gKiBAcGFyYW0ge2dlb21VdGlscy5SYXl9IHJheVxuICogQHBhcmFtIHtnZW9tVXRpbHMuT2JifSBvYmIgRGlyZWN0aW9uIGJveFxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG9yIDBcbiAqL1xuY29uc3QgcmF5X29iYiA9IChmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGNlbnRlciA9IG5ldyBWZWMzKCk7XG4gICAgbGV0IG8gPSBuZXcgVmVjMygpO1xuICAgIGxldCBkID0gbmV3IFZlYzMoKTtcbiAgICBjb25zdCBYID0gbmV3IFZlYzMoKTtcbiAgICBjb25zdCBZID0gbmV3IFZlYzMoKTtcbiAgICBjb25zdCBaID0gbmV3IFZlYzMoKTtcbiAgICBjb25zdCBwID0gbmV3IFZlYzMoKTtcbiAgICBjb25zdCBzaXplID0gbmV3IEFycmF5KDMpO1xuICAgIGNvbnN0IGYgPSBuZXcgQXJyYXkoMyk7XG4gICAgY29uc3QgZSA9IG5ldyBBcnJheSgzKTtcbiAgICBjb25zdCB0ID0gbmV3IEFycmF5KDYpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyYXk6IHJheSwgb2JiOiBvYmIpOiBudW1iZXIge1xuICAgICAgICBzaXplWzBdID0gb2JiLmhhbGZFeHRlbnRzLng7XG4gICAgICAgIHNpemVbMV0gPSBvYmIuaGFsZkV4dGVudHMueTtcbiAgICAgICAgc2l6ZVsyXSA9IG9iYi5oYWxmRXh0ZW50cy56O1xuICAgICAgICBjZW50ZXIgPSBvYmIuY2VudGVyO1xuICAgICAgICBvID0gcmF5Lm87XG4gICAgICAgIGQgPSByYXkuZDtcblxuICAgICAgICBsZXQgb2JibSA9IG9iYi5vcmllbnRhdGlvbi5tO1xuXG4gICAgICAgIFZlYzMuc2V0KFgsIG9iYm1bMF0sIG9iYm1bMV0sIG9iYm1bMl0pO1xuICAgICAgICBWZWMzLnNldChZLCBvYmJtWzNdLCBvYmJtWzRdLCBvYmJtWzVdKTtcbiAgICAgICAgVmVjMy5zZXQoWiwgb2JibVs2XSwgb2JibVs3XSwgb2JibVs4XSk7XG4gICAgICAgIFZlYzMuc3VidHJhY3QocCwgY2VudGVyLCBvKTtcblxuICAgICAgICAvLyBUaGUgY29zIHZhbHVlcyBvZiB0aGUgcmF5IG9uIHRoZSBYLCBZLCBaXG4gICAgICAgIGZbMF0gPSBWZWMzLmRvdChYLCBkKTtcbiAgICAgICAgZlsxXSA9IFZlYzMuZG90KFksIGQpO1xuICAgICAgICBmWzJdID0gVmVjMy5kb3QoWiwgZCk7XG5cbiAgICAgICAgLy8gVGhlIHByb2plY3Rpb24gbGVuZ3RoIG9mIFAgb24gWCwgWSwgWlxuICAgICAgICBlWzBdID0gVmVjMy5kb3QoWCwgcCk7XG4gICAgICAgIGVbMV0gPSBWZWMzLmRvdChZLCBwKTtcbiAgICAgICAgZVsyXSA9IFZlYzMuZG90KFosIHApO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgKytpKSB7XG4gICAgICAgICAgICBpZiAoZltpXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmICgtZVtpXSAtIHNpemVbaV0gPiAwIHx8IC1lW2ldICsgc2l6ZVtpXSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIEF2b2lkIGRpdiBieSAwIVxuICAgICAgICAgICAgICAgIGZbaV0gPSAwLjAwMDAwMDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBtaW5cbiAgICAgICAgICAgIHRbaSAqIDIgKyAwXSA9IChlW2ldICsgc2l6ZVtpXSkgLyBmW2ldO1xuICAgICAgICAgICAgLy8gbWF4XG4gICAgICAgICAgICB0W2kgKiAyICsgMV0gPSAoZVtpXSAtIHNpemVbaV0pIC8gZltpXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0bWluID0gTWF0aC5tYXgoXG4gICAgICAgICAgICBNYXRoLm1heChcbiAgICAgICAgICAgICAgICBNYXRoLm1pbih0WzBdLCB0WzFdKSxcbiAgICAgICAgICAgICAgICBNYXRoLm1pbih0WzJdLCB0WzNdKSksXG4gICAgICAgICAgICBNYXRoLm1pbih0WzRdLCB0WzVdKSxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgdG1heCA9IE1hdGgubWluKFxuICAgICAgICAgICAgTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgTWF0aC5tYXgodFswXSwgdFsxXSksXG4gICAgICAgICAgICAgICAgTWF0aC5tYXgodFsyXSwgdFszXSkpLFxuICAgICAgICAgICAgTWF0aC5tYXgodFs0XSwgdFs1XSksXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0bWF4IDwgMCB8fCB0bWluID4gdG1heCB8fCB0bWluIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdG1pbjtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIGFhYmItYWFiYiBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDovbTlr7npvZDljIXlm7Tnm5LlkozovbTlr7npvZDljIXlm7Tnm5LnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2QgYWFiYl9hYWJiXG4gKiBAcGFyYW0ge2dlb21VdGlscy5BYWJifSBhYWJiMSBBeGlzIGFsaWdubWVudCBzdXJyb3VuZHMgYm94IDFcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLkFhYmJ9IGFhYmIyIEF4aXMgYWxpZ25tZW50IHN1cnJvdW5kcyBib3ggMlxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IGFhYmJfYWFiYiA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgYU1pbiA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgYU1heCA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgYk1pbiA9IG5ldyBWZWMzKCk7XG4gICAgY29uc3QgYk1heCA9IG5ldyBWZWMzKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhYWJiMTogYWFiYiwgYWFiYjI6IGFhYmIpIHtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChhTWluLCBhYWJiMS5jZW50ZXIsIGFhYmIxLmhhbGZFeHRlbnRzKTtcbiAgICAgICAgVmVjMy5hZGQoYU1heCwgYWFiYjEuY2VudGVyLCBhYWJiMS5oYWxmRXh0ZW50cyk7XG4gICAgICAgIFZlYzMuc3VidHJhY3QoYk1pbiwgYWFiYjIuY2VudGVyLCBhYWJiMi5oYWxmRXh0ZW50cyk7XG4gICAgICAgIFZlYzMuYWRkKGJNYXgsIGFhYmIyLmNlbnRlciwgYWFiYjIuaGFsZkV4dGVudHMpO1xuICAgICAgICByZXR1cm4gKGFNaW4ueCA8PSBiTWF4LnggJiYgYU1heC54ID49IGJNaW4ueCkgJiZcbiAgICAgICAgICAgIChhTWluLnkgPD0gYk1heC55ICYmIGFNYXgueSA+PSBiTWluLnkpICYmXG4gICAgICAgICAgICAoYU1pbi56IDw9IGJNYXgueiAmJiBhTWF4LnogPj0gYk1pbi56KTtcbiAgICB9O1xufSkoKTtcblxuZnVuY3Rpb24gZ2V0QUFCQlZlcnRpY2VzIChtaW46IFZlYzMsIG1heDogVmVjMywgb3V0OiBWZWMzW10pIHtcbiAgICBWZWMzLnNldChvdXRbMF0sIG1pbi54LCBtYXgueSwgbWF4LnopO1xuICAgIFZlYzMuc2V0KG91dFsxXSwgbWluLngsIG1heC55LCBtaW4ueik7XG4gICAgVmVjMy5zZXQob3V0WzJdLCBtaW4ueCwgbWluLnksIG1heC56KTtcbiAgICBWZWMzLnNldChvdXRbM10sIG1pbi54LCBtaW4ueSwgbWluLnopO1xuICAgIFZlYzMuc2V0KG91dFs0XSwgbWF4LngsIG1heC55LCBtYXgueik7XG4gICAgVmVjMy5zZXQob3V0WzVdLCBtYXgueCwgbWF4LnksIG1pbi56KTtcbiAgICBWZWMzLnNldChvdXRbNl0sIG1heC54LCBtaW4ueSwgbWF4LnopO1xuICAgIFZlYzMuc2V0KG91dFs3XSwgbWF4LngsIG1pbi55LCBtaW4ueik7XG59XG5cbmZ1bmN0aW9uIGdldE9CQlZlcnRpY2VzIChjOiBWZWMzLCBlOiBWZWMzLCBhMTogVmVjMywgYTI6IFZlYzMsIGEzOiBWZWMzLCBvdXQ6IFZlYzNbXSkge1xuICAgIFZlYzMuc2V0KG91dFswXSxcbiAgICAgICAgYy54ICsgYTEueCAqIGUueCArIGEyLnggKiBlLnkgKyBhMy54ICogZS56LFxuICAgICAgICBjLnkgKyBhMS55ICogZS54ICsgYTIueSAqIGUueSArIGEzLnkgKiBlLnosXG4gICAgICAgIGMueiArIGExLnogKiBlLnggKyBhMi56ICogZS55ICsgYTMueiAqIGUueixcbiAgICApO1xuICAgIFZlYzMuc2V0KG91dFsxXSxcbiAgICAgICAgYy54IC0gYTEueCAqIGUueCArIGEyLnggKiBlLnkgKyBhMy54ICogZS56LFxuICAgICAgICBjLnkgLSBhMS55ICogZS54ICsgYTIueSAqIGUueSArIGEzLnkgKiBlLnosXG4gICAgICAgIGMueiAtIGExLnogKiBlLnggKyBhMi56ICogZS55ICsgYTMueiAqIGUueixcbiAgICApO1xuICAgIFZlYzMuc2V0KG91dFsyXSxcbiAgICAgICAgYy54ICsgYTEueCAqIGUueCAtIGEyLnggKiBlLnkgKyBhMy54ICogZS56LFxuICAgICAgICBjLnkgKyBhMS55ICogZS54IC0gYTIueSAqIGUueSArIGEzLnkgKiBlLnosXG4gICAgICAgIGMueiArIGExLnogKiBlLnggLSBhMi56ICogZS55ICsgYTMueiAqIGUueixcbiAgICApO1xuICAgIFZlYzMuc2V0KG91dFszXSxcbiAgICAgICAgYy54ICsgYTEueCAqIGUueCArIGEyLnggKiBlLnkgLSBhMy54ICogZS56LFxuICAgICAgICBjLnkgKyBhMS55ICogZS54ICsgYTIueSAqIGUueSAtIGEzLnkgKiBlLnosXG4gICAgICAgIGMueiArIGExLnogKiBlLnggKyBhMi56ICogZS55IC0gYTMueiAqIGUueixcbiAgICApO1xuICAgIFZlYzMuc2V0KG91dFs0XSxcbiAgICAgICAgYy54IC0gYTEueCAqIGUueCAtIGEyLnggKiBlLnkgLSBhMy54ICogZS56LFxuICAgICAgICBjLnkgLSBhMS55ICogZS54IC0gYTIueSAqIGUueSAtIGEzLnkgKiBlLnosXG4gICAgICAgIGMueiAtIGExLnogKiBlLnggLSBhMi56ICogZS55IC0gYTMueiAqIGUueixcbiAgICApO1xuICAgIFZlYzMuc2V0KG91dFs1XSxcbiAgICAgICAgYy54ICsgYTEueCAqIGUueCAtIGEyLnggKiBlLnkgLSBhMy54ICogZS56LFxuICAgICAgICBjLnkgKyBhMS55ICogZS54IC0gYTIueSAqIGUueSAtIGEzLnkgKiBlLnosXG4gICAgICAgIGMueiArIGExLnogKiBlLnggLSBhMi56ICogZS55IC0gYTMueiAqIGUueixcbiAgICApO1xuICAgIFZlYzMuc2V0KG91dFs2XSxcbiAgICAgICAgYy54IC0gYTEueCAqIGUueCArIGEyLnggKiBlLnkgLSBhMy54ICogZS56LFxuICAgICAgICBjLnkgLSBhMS55ICogZS54ICsgYTIueSAqIGUueSAtIGEzLnkgKiBlLnosXG4gICAgICAgIGMueiAtIGExLnogKiBlLnggKyBhMi56ICogZS55IC0gYTMueiAqIGUueixcbiAgICApO1xuICAgIFZlYzMuc2V0KG91dFs3XSxcbiAgICAgICAgYy54IC0gYTEueCAqIGUueCAtIGEyLnggKiBlLnkgKyBhMy54ICogZS56LFxuICAgICAgICBjLnkgLSBhMS55ICogZS54IC0gYTIueSAqIGUueSArIGEzLnkgKiBlLnosXG4gICAgICAgIGMueiAtIGExLnogKiBlLnggLSBhMi56ICogZS55ICsgYTMueiAqIGUueixcbiAgICApO1xufVxuXG5mdW5jdGlvbiBnZXRJbnRlcnZhbCAodmVydGljZXM6IGFueVtdIHwgVmVjM1tdLCBheGlzOiBWZWMzKSB7XG4gICAgbGV0IG1pbiA9IFZlYzMuZG90KGF4aXMsIHZlcnRpY2VzWzBdKSwgbWF4ID0gbWluO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgODsgKytpKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3Rpb24gPSBWZWMzLmRvdChheGlzLCB2ZXJ0aWNlc1tpXSk7XG4gICAgICAgIG1pbiA9IChwcm9qZWN0aW9uIDwgbWluKSA/IHByb2plY3Rpb24gOiBtaW47XG4gICAgICAgIG1heCA9IChwcm9qZWN0aW9uID4gbWF4KSA/IHByb2plY3Rpb24gOiBtYXg7XG4gICAgfVxuICAgIHJldHVybiBbbWluLCBtYXhdO1xufVxuXG4vKipcbiAqICEjZW4gYWFiYi1vYmIgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg6L205a+56b2Q5YyF5Zu055uS5ZKM5pa55ZCR5YyF5Zu055uS55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIGFhYmJfb2JiXG4gKiBAcGFyYW0ge2dlb21VdGlscy5BYWJifSBhYWJiIEFsaWduIHRoZSBheGlzIGFyb3VuZCB0aGUgYm94XG4gKiBAcGFyYW0ge2dlb21VdGlscy5PYmJ9IG9iYiBEaXJlY3Rpb24gYm94XG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3QgYWFiYl9vYmIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHRlc3QgPSBuZXcgQXJyYXkoMTUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTU7IGkrKykge1xuICAgICAgICB0ZXN0W2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgfVxuICAgIGNvbnN0IHZlcnRpY2VzID0gbmV3IEFycmF5KDgpO1xuICAgIGNvbnN0IHZlcnRpY2VzMiA9IG5ldyBBcnJheSg4KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgICB2ZXJ0aWNlc1tpXSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgICAgICB2ZXJ0aWNlczJbaV0gPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICB9XG4gICAgY29uc3QgbWluID0gbmV3IFZlYzMoKTtcbiAgICBjb25zdCBtYXggPSBuZXcgVmVjMygpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoYWFiYjogYWFiYiwgb2JiOiBvYmIpOiBudW1iZXIge1xuICAgICAgICBsZXQgb2JibSA9IG9iYi5vcmllbnRhdGlvbi5tO1xuXG4gICAgICAgIFZlYzMuc2V0KHRlc3RbMF0sIDEsIDAsIDApO1xuICAgICAgICBWZWMzLnNldCh0ZXN0WzFdLCAwLCAxLCAwKTtcbiAgICAgICAgVmVjMy5zZXQodGVzdFsyXSwgMCwgMCwgMSk7XG4gICAgICAgIFZlYzMuc2V0KHRlc3RbM10sIG9iYm1bMF0sIG9iYm1bMV0sIG9iYm1bMl0pO1xuICAgICAgICBWZWMzLnNldCh0ZXN0WzRdLCBvYmJtWzNdLCBvYmJtWzRdLCBvYmJtWzVdKTtcbiAgICAgICAgVmVjMy5zZXQodGVzdFs1XSwgb2JibVs2XSwgb2JibVs3XSwgb2JibVs4XSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyArK2kpIHsgLy8gRmlsbCBvdXQgcmVzdCBvZiBheGlzXG4gICAgICAgICAgICBWZWMzLmNyb3NzKHRlc3RbNiArIGkgKiAzICsgMF0sIHRlc3RbaV0sIHRlc3RbMF0pO1xuICAgICAgICAgICAgVmVjMy5jcm9zcyh0ZXN0WzYgKyBpICogMyArIDFdLCB0ZXN0W2ldLCB0ZXN0WzFdKTtcbiAgICAgICAgICAgIFZlYzMuY3Jvc3ModGVzdFs2ICsgaSAqIDMgKyAxXSwgdGVzdFtpXSwgdGVzdFsyXSk7XG4gICAgICAgIH1cblxuICAgICAgICBWZWMzLnN1YnRyYWN0KG1pbiwgYWFiYi5jZW50ZXIsIGFhYmIuaGFsZkV4dGVudHMpO1xuICAgICAgICBWZWMzLmFkZChtYXgsIGFhYmIuY2VudGVyLCBhYWJiLmhhbGZFeHRlbnRzKTtcbiAgICAgICAgZ2V0QUFCQlZlcnRpY2VzKG1pbiwgbWF4LCB2ZXJ0aWNlcyk7XG4gICAgICAgIGdldE9CQlZlcnRpY2VzKG9iYi5jZW50ZXIsIG9iYi5oYWxmRXh0ZW50cywgdGVzdFszXSwgdGVzdFs0XSwgdGVzdFs1XSwgdmVydGljZXMyKTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDE1OyArK2opIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBnZXRJbnRlcnZhbCh2ZXJ0aWNlcywgdGVzdFtqXSk7XG4gICAgICAgICAgICBjb25zdCBiID0gZ2V0SW50ZXJ2YWwodmVydGljZXMyLCB0ZXN0W2pdKTtcbiAgICAgICAgICAgIGlmIChiWzBdID4gYVsxXSB8fCBhWzBdID4gYlsxXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwOyAvLyBTZXBlcmF0aW5nIGF4aXMgZm91bmRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqICEjZW4gYWFiYi1wbGFuZSBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDovbTlr7npvZDljIXlm7Tnm5LlkozlubPpnaLnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2QgYWFiYl9wbGFuZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuQWFiYn0gYWFiYiBBbGlnbiB0aGUgYXhpcyBhcm91bmQgdGhlIGJveFxuICogQHBhcmFtIHtnZW9tVXRpbHMuUGxhbmV9IHBsYW5lXG4gKiBAcmV0dXJuIHtudW1iZXJ9IGluc2lkZShiYWNrKSA9IC0xLCBvdXRzaWRlKGZyb250KSA9IDAsIGludGVyc2VjdCA9IDFcbiAqL1xuY29uc3QgYWFiYl9wbGFuZSA9IGZ1bmN0aW9uIChhYWJiOiBhYWJiLCBwbGFuZTogcGxhbmUpOiBudW1iZXIge1xuICAgIGNvbnN0IHIgPSBhYWJiLmhhbGZFeHRlbnRzLnggKiBNYXRoLmFicyhwbGFuZS5uLngpICtcbiAgICAgICAgYWFiYi5oYWxmRXh0ZW50cy55ICogTWF0aC5hYnMocGxhbmUubi55KSArXG4gICAgICAgIGFhYmIuaGFsZkV4dGVudHMueiAqIE1hdGguYWJzKHBsYW5lLm4ueik7XG4gICAgY29uc3QgZG90ID0gVmVjMy5kb3QocGxhbmUubiwgYWFiYi5jZW50ZXIpO1xuICAgIGlmIChkb3QgKyByIDwgcGxhbmUuZCkgeyByZXR1cm4gLTE7IH1cbiAgICBlbHNlIGlmIChkb3QgLSByID4gcGxhbmUuZCkgeyByZXR1cm4gMDsgfVxuICAgIHJldHVybiAxO1xufTtcblxuLyoqXG4gKiAhI2VuIGFhYmItZnJ1c3R1bSBpbnRlcnNlY3QsIGZhc3RlciBidXQgaGFzIGZhbHNlIHBvc2l0aXZlIGNvcm5lciBjYXNlczxici8+XG4gKiAhI3poIOi9tOWvuem9kOWMheWbtOebkuWSjOmUpeWPsOebuOS6pOaAp+ajgOa1i++8jOmAn+W6puW/q++8jOS9huaciemUmeivr+aDheWGteOAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBhYWJiX2ZydXN0dW1cbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLkFhYmJ9IGFhYmIgQWxpZ24gdGhlIGF4aXMgYXJvdW5kIHRoZSBib3hcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLkZydXN0dW19IGZydXN0dW1cbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBub3QgMFxuICovXG5jb25zdCBhYWJiX2ZydXN0dW0gPSBmdW5jdGlvbiAoYWFiYjogYWFiYiwgZnJ1c3R1bTogZnJ1c3R1bSk6IG51bWJlciB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcnVzdHVtLnBsYW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBmcnVzdHVtIHBsYW5lIG5vcm1hbCBwb2ludHMgdG8gdGhlIGluc2lkZVxuICAgICAgICBpZiAoYWFiYl9wbGFuZShhYWJiLCBmcnVzdHVtLnBsYW5lc1tpXSkgPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgIH0gLy8gY29tcGxldGVseSBvdXRzaWRlXG4gICAgcmV0dXJuIDE7XG59O1xuXG4vLyBodHRwczovL2Nlc2l1bS5jb20vYmxvZy8yMDE3LzAyLzAyL3RpZ2h0ZXItZnJ1c3R1bS1jdWxsaW5nLWFuZC13aHkteW91LW1heS13YW50LXRvLWRpc3JlZ2FyZC1pdC9cbi8qKlxuICogISNlbiBhYWJiLWZydXN0dW0gaW50ZXJzZWN0LCBoYW5kbGVzIG1vc3Qgb2YgdGhlIGZhbHNlIHBvc2l0aXZlcyBjb3JyZWN0bHk8YnIvPlxuICogISN6aCDovbTlr7npvZDljIXlm7Tnm5LlkozplKXlj7Dnm7jkuqTmgKfmo4DmtYvvvIzmraPnoa7lpITnkIblpKflpJrmlbDplJnor6/mg4XlhrXjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2QgYWFiYl9mcnVzdHVtX2FjY3VyYXRlXG4gKiBAcGFyYW0ge2dlb21VdGlscy5BYWJifSBhYWJiIEFsaWduIHRoZSBheGlzIGFyb3VuZCB0aGUgYm94XG4gKiBAcGFyYW0ge2dlb21VdGlscy5GcnVzdHVtfSBmcnVzdHVtXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmNvbnN0IGFhYmJfZnJ1c3R1bV9hY2N1cmF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgdG1wID0gbmV3IEFycmF5KDgpO1xuICAgIGxldCBvdXQxID0gMCwgb3V0MiA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdG1wW2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoYWFiYjogYWFiYiwgZnJ1c3R1bTogZnJ1c3R1bSk6IG51bWJlciB7XG4gICAgICAgIGxldCByZXN1bHQgPSAwLCBpbnRlcnNlY3RzID0gZmFsc2U7XG4gICAgICAgIC8vIDEuIGFhYmIgaW5zaWRlL291dHNpZGUgZnJ1c3R1bSB0ZXN0XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS5wbGFuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGFhYmJfcGxhbmUoYWFiYiwgZnJ1c3R1bS5wbGFuZXNbaV0pO1xuICAgICAgICAgICAgLy8gZnJ1c3R1bSBwbGFuZSBub3JtYWwgcG9pbnRzIHRvIHRoZSBpbnNpZGVcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IC0xKSB7IHJldHVybiAwOyB9IC8vIGNvbXBsZXRlbHkgb3V0c2lkZVxuICAgICAgICAgICAgZWxzZSBpZiAocmVzdWx0ID09PSAxKSB7IGludGVyc2VjdHMgPSB0cnVlOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpbnRlcnNlY3RzKSB7IHJldHVybiAxOyB9IC8vIGNvbXBsZXRlbHkgaW5zaWRlXG4gICAgICAgIC8vIGluIGNhc2Ugb2YgZmFsc2UgcG9zaXRpdmVzXG4gICAgICAgIC8vIDIuIGZydXN0dW0gaW5zaWRlL291dHNpZGUgYWFiYiB0ZXN0XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdCh0bXBbaV0sIGZydXN0dW0udmVydGljZXNbaV0sIGFhYmIuY2VudGVyKTtcbiAgICAgICAgfVxuICAgICAgICBvdXQxID0gMCwgb3V0MiA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRtcFtpXS54ID4gYWFiYi5oYWxmRXh0ZW50cy54KSB7IG91dDErKzsgfVxuICAgICAgICAgICAgZWxzZSBpZiAodG1wW2ldLnggPCAtYWFiYi5oYWxmRXh0ZW50cy54KSB7IG91dDIrKzsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvdXQxID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCB8fCBvdXQyID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCkgeyByZXR1cm4gMDsgfVxuICAgICAgICBvdXQxID0gMDsgb3V0MiA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRtcFtpXS55ID4gYWFiYi5oYWxmRXh0ZW50cy55KSB7IG91dDErKzsgfVxuICAgICAgICAgICAgZWxzZSBpZiAodG1wW2ldLnkgPCAtYWFiYi5oYWxmRXh0ZW50cy55KSB7IG91dDIrKzsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvdXQxID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCB8fCBvdXQyID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCkgeyByZXR1cm4gMDsgfVxuICAgICAgICBvdXQxID0gMDsgb3V0MiA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRtcFtpXS56ID4gYWFiYi5oYWxmRXh0ZW50cy56KSB7IG91dDErKzsgfVxuICAgICAgICAgICAgZWxzZSBpZiAodG1wW2ldLnogPCAtYWFiYi5oYWxmRXh0ZW50cy56KSB7IG91dDIrKzsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvdXQxID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCB8fCBvdXQyID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCkgeyByZXR1cm4gMDsgfVxuICAgICAgICByZXR1cm4gMTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIG9iYi1wb2ludCBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDmlrnlkJHljIXlm7Tnm5LlkozngrnnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2Qgb2JiX3BvaW50XG4gKiBAcGFyYW0ge2dlb21VdGlscy5PYmJ9IG9iYiBEaXJlY3Rpb24gYm94XG4gKiBAcGFyYW0ge2dlb21VdGlscy5WZWMzfSBwb2ludFxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBvciBmYWxzZVxuICovXG5jb25zdCBvYmJfcG9pbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHRtcCA9IG5ldyBWZWMzKDAsIDAsIDApLCBtMyA9IG5ldyBNYXQzKCk7XG4gICAgY29uc3QgbGVzc1RoYW4gPSBmdW5jdGlvbiAoYTogVmVjMywgYjogVmVjMyk6IGJvb2xlYW4geyByZXR1cm4gTWF0aC5hYnMoYS54KSA8IGIueCAmJiBNYXRoLmFicyhhLnkpIDwgYi55ICYmIE1hdGguYWJzKGEueikgPCBiLno7IH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmI6IG9iYiwgcG9pbnQ6IFZlYzMpOiBib29sZWFuIHtcbiAgICAgICAgVmVjMy5zdWJ0cmFjdCh0bXAsIHBvaW50LCBvYmIuY2VudGVyKTtcbiAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQzKHRtcCwgdG1wLCBNYXQzLnRyYW5zcG9zZShtMywgb2JiLm9yaWVudGF0aW9uKSk7XG4gICAgICAgIHJldHVybiBsZXNzVGhhbih0bXAsIG9iYi5oYWxmRXh0ZW50cyk7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBvYmItcGxhbmUgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg5pa55ZCR5YyF5Zu055uS5ZKM5bmz6Z2i55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIG9iYl9wbGFuZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuT2JifSBvYmIgRGlyZWN0aW9uIGJveFxuICogQHBhcmFtIHtnZW9tVXRpbHMuUGxhbmV9IHBsYW5lXG4gKiBAcmV0dXJuIHtudW1iZXJ9IGluc2lkZShiYWNrKSA9IC0xLCBvdXRzaWRlKGZyb250KSA9IDAsIGludGVyc2VjdCA9IDFcbiAqL1xuY29uc3Qgb2JiX3BsYW5lID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBhYnNEb3QgPSBmdW5jdGlvbiAobjogVmVjMywgeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnMobi54ICogeCArIG4ueSAqIHkgKyBuLnogKiB6KTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAob2JiOiBvYmIsIHBsYW5lOiBwbGFuZSk6IG51bWJlciB7XG4gICAgICAgIGxldCBvYmJtID0gb2JiLm9yaWVudGF0aW9uLm07XG4gICAgICAgIC8vIFJlYWwtVGltZSBDb2xsaXNpb24gRGV0ZWN0aW9uLCBDaHJpc3RlciBFcmljc29uLCBwLiAxNjMuXG4gICAgICAgIGNvbnN0IHIgPSBvYmIuaGFsZkV4dGVudHMueCAqIGFic0RvdChwbGFuZS5uLCBvYmJtWzBdLCBvYmJtWzFdLCBvYmJtWzJdKSArXG4gICAgICAgICAgICBvYmIuaGFsZkV4dGVudHMueSAqIGFic0RvdChwbGFuZS5uLCBvYmJtWzNdLCBvYmJtWzRdLCBvYmJtWzVdKSArXG4gICAgICAgICAgICBvYmIuaGFsZkV4dGVudHMueiAqIGFic0RvdChwbGFuZS5uLCBvYmJtWzZdLCBvYmJtWzddLCBvYmJtWzhdKTtcblxuICAgICAgICBjb25zdCBkb3QgPSBWZWMzLmRvdChwbGFuZS5uLCBvYmIuY2VudGVyKTtcbiAgICAgICAgaWYgKGRvdCArIHIgPCBwbGFuZS5kKSB7IHJldHVybiAtMTsgfVxuICAgICAgICBlbHNlIGlmIChkb3QgLSByID4gcGxhbmUuZCkgeyByZXR1cm4gMDsgfVxuICAgICAgICByZXR1cm4gMTtcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIG9iYi1mcnVzdHVtIGludGVyc2VjdCwgZmFzdGVyIGJ1dCBoYXMgZmFsc2UgcG9zaXRpdmUgY29ybmVyIGNhc2VzPGJyLz5cbiAqICEjemgg5pa55ZCR5YyF5Zu055uS5ZKM6ZSl5Y+w55u45Lqk5oCn5qOA5rWL77yM6YCf5bqm5b+r77yM5L2G5pyJ6ZSZ6K+v5oOF5Ya144CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIG9iYl9mcnVzdHVtXG4gKiBAcGFyYW0ge2dlb21VdGlscy5PYmJ9IG9iYiBEaXJlY3Rpb24gYm94XG4gKiBAcGFyYW0ge2dlb21VdGlscy5GcnVzdHVtfSBmcnVzdHVtXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3Qgb2JiX2ZydXN0dW0gPSBmdW5jdGlvbiAob2JiOiBvYmIsIGZydXN0dW06IGZydXN0dW0pOiBudW1iZXIge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS5wbGFuZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gZnJ1c3R1bSBwbGFuZSBub3JtYWwgcG9pbnRzIHRvIHRoZSBpbnNpZGVcbiAgICAgICAgaWYgKG9iYl9wbGFuZShvYmIsIGZydXN0dW0ucGxhbmVzW2ldKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcbiAgICByZXR1cm4gMTtcbn07XG5cbi8vIGh0dHBzOi8vY2VzaXVtLmNvbS9ibG9nLzIwMTcvMDIvMDIvdGlnaHRlci1mcnVzdHVtLWN1bGxpbmctYW5kLXdoeS15b3UtbWF5LXdhbnQtdG8tZGlzcmVnYXJkLWl0L1xuLyoqXG4gKiAhI2VuIG9iYi1mcnVzdHVtIGludGVyc2VjdCwgaGFuZGxlcyBtb3N0IG9mIHRoZSBmYWxzZSBwb3NpdGl2ZXMgY29ycmVjdGx5PGJyLz5cbiAqICEjemgg5pa55ZCR5YyF5Zu055uS5ZKM6ZSl5Y+w55u45Lqk5oCn5qOA5rWL77yM5q2j56Gu5aSE55CG5aSn5aSa5pWw6ZSZ6K+v5oOF5Ya144CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIG9iYl9mcnVzdHVtX2FjY3VyYXRlXG4gKiBAcGFyYW0ge2dlb21VdGlscy5PYmJ9IG9iYiBEaXJlY3Rpb24gYm94XG4gKiBAcGFyYW0ge2dlb21VdGlscy5GcnVzdHVtfSBmcnVzdHVtXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAgb3Igbm90IDBcbiAqL1xuY29uc3Qgb2JiX2ZydXN0dW1fYWNjdXJhdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHRtcCA9IG5ldyBBcnJheSg4KTtcbiAgICBsZXQgZGlzdCA9IDAsIG91dDEgPSAwLCBvdXQyID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcC5sZW5ndGg7IGkrKykge1xuICAgICAgICB0bXBbaV0gPSBuZXcgVmVjMygwLCAwLCAwKTtcbiAgICB9XG4gICAgY29uc3QgZG90ID0gZnVuY3Rpb24gKG46IFZlYzMsIHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gbi54ICogeCArIG4ueSAqIHkgKyBuLnogKiB6O1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmI6IG9iYiwgZnJ1c3R1bTogZnJ1c3R1bSk6IG51bWJlciB7XG4gICAgICAgIGxldCByZXN1bHQgPSAwLCBpbnRlcnNlY3RzID0gZmFsc2U7XG4gICAgICAgIC8vIDEuIG9iYiBpbnNpZGUvb3V0c2lkZSBmcnVzdHVtIHRlc3RcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcnVzdHVtLnBsYW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0ID0gb2JiX3BsYW5lKG9iYiwgZnJ1c3R1bS5wbGFuZXNbaV0pO1xuICAgICAgICAgICAgLy8gZnJ1c3R1bSBwbGFuZSBub3JtYWwgcG9pbnRzIHRvIHRoZSBpbnNpZGVcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IC0xKSB7IHJldHVybiAwOyB9IC8vIGNvbXBsZXRlbHkgb3V0c2lkZVxuICAgICAgICAgICAgZWxzZSBpZiAocmVzdWx0ID09PSAxKSB7IGludGVyc2VjdHMgPSB0cnVlOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFpbnRlcnNlY3RzKSB7IHJldHVybiAxOyB9IC8vIGNvbXBsZXRlbHkgaW5zaWRlXG4gICAgICAgIC8vIGluIGNhc2Ugb2YgZmFsc2UgcG9zaXRpdmVzXG4gICAgICAgIC8vIDIuIGZydXN0dW0gaW5zaWRlL291dHNpZGUgb2JiIHRlc3RcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBWZWMzLnN1YnRyYWN0KHRtcFtpXSwgZnJ1c3R1bS52ZXJ0aWNlc1tpXSwgb2JiLmNlbnRlcik7XG4gICAgICAgIH1cbiAgICAgICAgb3V0MSA9IDAsIG91dDIgPSAwO1xuICAgICAgICBsZXQgb2JibSA9IG9iYi5vcmllbnRhdGlvbi5tO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0udmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGRpc3QgPSBkb3QodG1wW2ldLCBvYmJtWzBdLCBvYmJtWzFdLCBvYmJtWzJdKTtcbiAgICAgICAgICAgIGlmIChkaXN0ID4gb2JiLmhhbGZFeHRlbnRzLngpIHsgb3V0MSsrOyB9XG4gICAgICAgICAgICBlbHNlIGlmIChkaXN0IDwgLW9iYi5oYWxmRXh0ZW50cy54KSB7IG91dDIrKzsgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvdXQxID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCB8fCBvdXQyID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCkgeyByZXR1cm4gMDsgfVxuICAgICAgICBvdXQxID0gMDsgb3V0MiA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZGlzdCA9IGRvdCh0bXBbaV0sIG9iYm1bM10sIG9iYm1bNF0sIG9iYm1bNV0pO1xuICAgICAgICAgICAgaWYgKGRpc3QgPiBvYmIuaGFsZkV4dGVudHMueSkgeyBvdXQxKys7IH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRpc3QgPCAtb2JiLmhhbGZFeHRlbnRzLnkpIHsgb3V0MisrOyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG91dDEgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoIHx8IG91dDIgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoKSB7IHJldHVybiAwOyB9XG4gICAgICAgIG91dDEgPSAwOyBvdXQyID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBkaXN0ID0gZG90KHRtcFtpXSwgb2JibVs2XSwgb2JibVs3XSwgb2JibVs4XSk7XG4gICAgICAgICAgICBpZiAoZGlzdCA+IG9iYi5oYWxmRXh0ZW50cy56KSB7IG91dDErKzsgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZGlzdCA8IC1vYmIuaGFsZkV4dGVudHMueikgeyBvdXQyKys7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob3V0MSA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGggfHwgb3V0MiA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGgpIHsgcmV0dXJuIDA7IH1cbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfTtcbn0pKCk7XG5cbi8qKlxuICogISNlbiBvYmItb2JiIGludGVyc2VjdDxici8+XG4gKiAhI3poIOaWueWQkeWMheWbtOebkuWSjOaWueWQkeWMheWbtOebkueahOebuOS6pOaAp+ajgOa1i+OAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBvYmJfb2JiXG4gKiBAcGFyYW0ge2dlb21VdGlscy5PYmJ9IG9iYjEgRGlyZWN0aW9uIGJveDFcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLk9iYn0gb2JiMiBEaXJlY3Rpb24gYm94MlxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IG9iYl9vYmIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHRlc3QgPSBuZXcgQXJyYXkoMTUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTU7IGkrKykge1xuICAgICAgICB0ZXN0W2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmVydGljZXMgPSBuZXcgQXJyYXkoOCk7XG4gICAgY29uc3QgdmVydGljZXMyID0gbmV3IEFycmF5KDgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XG4gICAgICAgIHZlcnRpY2VzW2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XG4gICAgICAgIHZlcnRpY2VzMltpXSA9IG5ldyBWZWMzKDAsIDAsIDApO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAob2JiMTogb2JiLCBvYmIyOiBvYmIpOiBudW1iZXIge1xuXG4gICAgICAgIGxldCBvYmIxbSA9IG9iYjEub3JpZW50YXRpb24ubTtcbiAgICAgICAgbGV0IG9iYjJtID0gb2JiMi5vcmllbnRhdGlvbi5tO1xuXG4gICAgICAgIFZlYzMuc2V0KHRlc3RbMF0sIG9iYjFtWzBdLCBvYmIxbVsxXSwgb2JiMW1bMl0pO1xuICAgICAgICBWZWMzLnNldCh0ZXN0WzFdLCBvYmIxbVszXSwgb2JiMW1bNF0sIG9iYjFtWzVdKTtcbiAgICAgICAgVmVjMy5zZXQodGVzdFsyXSwgb2JiMW1bNl0sIG9iYjFtWzddLCBvYmIxbVs4XSk7XG4gICAgICAgIFZlYzMuc2V0KHRlc3RbM10sIG9iYjJtWzBdLCBvYmIybVsxXSwgb2JiMm1bMl0pO1xuICAgICAgICBWZWMzLnNldCh0ZXN0WzRdLCBvYmIybVszXSwgb2JiMm1bNF0sIG9iYjJtWzVdKTtcbiAgICAgICAgVmVjMy5zZXQodGVzdFs1XSwgb2JiMm1bNl0sIG9iYjJtWzddLCBvYmIybVs4XSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyArK2kpIHsgLy8gRmlsbCBvdXQgcmVzdCBvZiBheGlzXG4gICAgICAgICAgICBWZWMzLmNyb3NzKHRlc3RbNiArIGkgKiAzICsgMF0sIHRlc3RbaV0sIHRlc3RbMF0pO1xuICAgICAgICAgICAgVmVjMy5jcm9zcyh0ZXN0WzYgKyBpICogMyArIDFdLCB0ZXN0W2ldLCB0ZXN0WzFdKTtcbiAgICAgICAgICAgIFZlYzMuY3Jvc3ModGVzdFs2ICsgaSAqIDMgKyAxXSwgdGVzdFtpXSwgdGVzdFsyXSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRPQkJWZXJ0aWNlcyhvYmIxLmNlbnRlciwgb2JiMS5oYWxmRXh0ZW50cywgdGVzdFswXSwgdGVzdFsxXSwgdGVzdFsyXSwgdmVydGljZXMpO1xuICAgICAgICBnZXRPQkJWZXJ0aWNlcyhvYmIyLmNlbnRlciwgb2JiMi5oYWxmRXh0ZW50cywgdGVzdFszXSwgdGVzdFs0XSwgdGVzdFs1XSwgdmVydGljZXMyKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE1OyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBnZXRJbnRlcnZhbCh2ZXJ0aWNlcywgdGVzdFtpXSk7XG4gICAgICAgICAgICBjb25zdCBiID0gZ2V0SW50ZXJ2YWwodmVydGljZXMyLCB0ZXN0W2ldKTtcbiAgICAgICAgICAgIGlmIChiWzBdID4gYVsxXSB8fCBhWzBdID4gYlsxXSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwOyAvLyBTZXBlcmF0aW5nIGF4aXMgZm91bmRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqICEjZW4gcGhlcmUtcGxhbmUgaW50ZXJzZWN0LCBub3QgbmVjZXNzYXJpbHkgZmFzdGVyIHRoYW4gb2JiLXBsYW5lPGJyLz5cbiAqIGR1ZSB0byB0aGUgbGVuZ3RoIGNhbGN1bGF0aW9uIG9mIHRoZSBwbGFuZSBub3JtYWwgdG8gZmFjdG9yIG91dDxici8+XG4gKiB0aGUgdW5ub21hbGl6ZWQgcGxhbmUgZGlzdGFuY2U8YnIvPlxuICogISN6aCDnkIPkuI7lubPpnaLnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2Qgc3BoZXJlX3BsYW5lXG4gKiBAcGFyYW0ge2dlb21VdGlscy5TcGhlcmV9IHNwaGVyZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuUGxhbmV9IHBsYW5lXG4gKiBAcmV0dXJuIHtudW1iZXJ9IGluc2lkZShiYWNrKSA9IC0xLCBvdXRzaWRlKGZyb250KSA9IDAsIGludGVyc2VjdCA9IDFcbiAqL1xuY29uc3Qgc3BoZXJlX3BsYW5lID0gZnVuY3Rpb24gKHNwaGVyZTogc3BoZXJlLCBwbGFuZTogcGxhbmUpOiBudW1iZXIge1xuICAgIGNvbnN0IGRvdCA9IFZlYzMuZG90KHBsYW5lLm4sIHNwaGVyZS5jZW50ZXIpO1xuICAgIGNvbnN0IHIgPSBzcGhlcmUucmFkaXVzICogcGxhbmUubi5sZW5ndGgoKTtcbiAgICBpZiAoZG90ICsgciA8IHBsYW5lLmQpIHsgcmV0dXJuIC0xOyB9XG4gICAgZWxzZSBpZiAoZG90IC0gciA+IHBsYW5lLmQpIHsgcmV0dXJuIDA7IH1cbiAgICByZXR1cm4gMTtcbn07XG5cbi8qKlxuICogISNlbiBzcGhlcmUtZnJ1c3R1bSBpbnRlcnNlY3QsIGZhc3RlciBidXQgaGFzIGZhbHNlIHBvc2l0aXZlIGNvcm5lciBjYXNlczxici8+XG4gKiAhI3poIOeQg+WSjOmUpeWPsOeahOebuOS6pOaAp+ajgOa1i++8jOmAn+W6puW/q++8jOS9huaciemUmeivr+aDheWGteOAglxuICogQHN0YXRpY1xuICogQG1ldGhvZCBzcGhlcmVfZnJ1c3R1bVxuICogQHBhcmFtIHtnZW9tVXRpbHMuU3BoZXJlfSBzcGhlcmVcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLkZydXN0dW19IGZydXN0dW1cbiAqIEByZXR1cm4ge251bWJlcn0gMCBvciBub3QgMFxuICovXG5jb25zdCBzcGhlcmVfZnJ1c3R1bSA9IGZ1bmN0aW9uIChzcGhlcmU6IHNwaGVyZSwgZnJ1c3R1bTogZnJ1c3R1bSk6IG51bWJlciB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcnVzdHVtLnBsYW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBmcnVzdHVtIHBsYW5lIG5vcm1hbCBwb2ludHMgdG8gdGhlIGluc2lkZVxuICAgICAgICBpZiAoc3BoZXJlX3BsYW5lKHNwaGVyZSwgZnJ1c3R1bS5wbGFuZXNbaV0pID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICB9IC8vIGNvbXBsZXRlbHkgb3V0c2lkZVxuICAgIHJldHVybiAxO1xufTtcblxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjA5MTI2OTIvdmlldy1mcnVzdHVtLWN1bGxpbmctY29ybmVyLWNhc2VzXG4vKipcbiAqICEjZW4gc3BoZXJlLWZydXN0dW0gaW50ZXJzZWN0LCBoYW5kbGVzIHRoZSBmYWxzZSBwb3NpdGl2ZXMgY29ycmVjdGx5PGJyLz5cbiAqICEjemgg55CD5ZKM6ZSl5Y+w55qE55u45Lqk5oCn5qOA5rWL77yM5q2j56Gu5aSE55CG5aSn5aSa5pWw6ZSZ6K+v5oOF5Ya144CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIHNwaGVyZV9mcnVzdHVtX2FjY3VyYXRlXG4gKiBAcGFyYW0ge2dlb21VdGlscy5TcGhlcmV9IHNwaGVyZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuRnJ1c3R1bX0gZnJ1c3R1bVxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yIG5vdCAwXG4gKi9cbmNvbnN0IHNwaGVyZV9mcnVzdHVtX2FjY3VyYXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBwdCA9IG5ldyBWZWMzKDAsIDAsIDApLCBtYXAgPSBbMSwgLTEsIDEsIC0xLCAxLCAtMV07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzcGhlcmU6IHNwaGVyZSwgZnJ1c3R1bTogZnJ1c3R1bSk6IG51bWJlciB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwbGFuZSA9IGZydXN0dW0ucGxhbmVzW2ldO1xuICAgICAgICAgICAgY29uc3QgciA9IHNwaGVyZS5yYWRpdXMsIGMgPSBzcGhlcmUuY2VudGVyO1xuICAgICAgICAgICAgY29uc3QgbiA9IHBsYW5lLm4sIGQgPSBwbGFuZS5kO1xuICAgICAgICAgICAgY29uc3QgZG90ID0gVmVjMy5kb3QobiwgYyk7XG4gICAgICAgICAgICAvLyBmcnVzdHVtIHBsYW5lIG5vcm1hbCBwb2ludHMgdG8gdGhlIGluc2lkZVxuICAgICAgICAgICAgaWYgKGRvdCArIHIgPCBkKSB7IHJldHVybiAwOyB9IC8vIGNvbXBsZXRlbHkgb3V0c2lkZVxuICAgICAgICAgICAgZWxzZSBpZiAoZG90IC0gciA+IGQpIHsgY29udGludWU7IH1cbiAgICAgICAgICAgIC8vIGluIGNhc2Ugb2YgZmFsc2UgcG9zaXRpdmVzXG4gICAgICAgICAgICAvLyBoYXMgZmFsc2UgbmVnYXRpdmVzLCBzdGlsbCB3b3JraW5nIG9uIGl0XG4gICAgICAgICAgICBWZWMzLmFkZChwdCwgYywgVmVjMy5tdWx0aXBseVNjYWxhcihwdCwgbiwgcikpO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA2OyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gaSB8fCBqID09PSBpICsgbWFwW2ldKSB7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IGZydXN0dW0ucGxhbmVzW2pdO1xuICAgICAgICAgICAgICAgIGlmIChWZWMzLmRvdCh0ZXN0Lm4sIHB0KSA8IHRlc3QuZCkgeyByZXR1cm4gMDsgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG59KSgpO1xuXG4vKipcbiAqICEjZW4gc3BoZXJlLXNwaGVyZSBpbnRlcnNlY3Q8YnIvPlxuICogISN6aCDnkIPlkoznkIPnmoTnm7jkuqTmgKfmo4DmtYvjgIJcbiAqIEBzdGF0aWNcbiAqIEBtZXRob2Qgc3BoZXJlX3NwaGVyZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuU3BoZXJlfSBzcGhlcmUwXG4gKiBAcGFyYW0ge2dlb21VdGlscy5TcGhlcmV9IHNwaGVyZTFcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgb3IgZmFsc2VcbiAqL1xuY29uc3Qgc3BoZXJlX3NwaGVyZSA9IGZ1bmN0aW9uIChzcGhlcmUwOiBzcGhlcmUsIHNwaGVyZTE6IHNwaGVyZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHIgPSBzcGhlcmUwLnJhZGl1cyArIHNwaGVyZTEucmFkaXVzO1xuICAgIHJldHVybiBWZWMzLnNxdWFyZWREaXN0YW5jZShzcGhlcmUwLmNlbnRlciwgc3BoZXJlMS5jZW50ZXIpIDwgciAqIHI7XG59O1xuXG4vKipcbiAqICEjZW4gc3BoZXJlLWFhYmIgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg55CD5ZKM6L205a+56b2Q5YyF5Zu055uS55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIHNwaGVyZV9hYWJiXG4gKiBAcGFyYW0ge2dlb21VdGlscy5TcGhlcmV9IHNwaGVyZVxuICogQHBhcmFtIHtnZW9tVXRpbHMuQWFiYn0gYWFiYlxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBvciBmYWxzZVxuICovXG5jb25zdCBzcGhlcmVfYWFiYiA9IChmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcHQgPSBuZXcgVmVjMygpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoc3BoZXJlOiBzcGhlcmUsIGFhYmI6IGFhYmIpOiBib29sZWFuIHtcbiAgICAgICAgZGlzdGFuY2UucHRfcG9pbnRfYWFiYihwdCwgc3BoZXJlLmNlbnRlciwgYWFiYik7XG4gICAgICAgIHJldHVybiBWZWMzLnNxdWFyZWREaXN0YW5jZShzcGhlcmUuY2VudGVyLCBwdCkgPCBzcGhlcmUucmFkaXVzICogc3BoZXJlLnJhZGl1cztcbiAgICB9O1xufSkoKTtcblxuLyoqXG4gKiAhI2VuIHNwaGVyZS1vYmIgaW50ZXJzZWN0PGJyLz5cbiAqICEjemgg55CD5ZKM5pa55ZCR5YyF5Zu055uS55qE55u45Lqk5oCn5qOA5rWL44CCXG4gKiBAc3RhdGljXG4gKiBAbWV0aG9kIHNwaGVyZV9vYmJcbiAqIEBwYXJhbSB7Z2VvbVV0aWxzLlNwaGVyZX0gc3BoZXJlXG4gKiBAcGFyYW0ge2dlb21VdGlscy5PYmJ9IG9iYlxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBvciBmYWxzZVxuICovXG5jb25zdCBzcGhlcmVfb2JiID0gKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBwdCA9IG5ldyBWZWMzKCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzcGhlcmU6IHNwaGVyZSwgb2JiOiBvYmIpOiBib29sZWFuIHtcbiAgICAgICAgZGlzdGFuY2UucHRfcG9pbnRfb2JiKHB0LCBzcGhlcmUuY2VudGVyLCBvYmIpO1xuICAgICAgICByZXR1cm4gVmVjMy5zcXVhcmVkRGlzdGFuY2Uoc3BoZXJlLmNlbnRlciwgcHQpIDwgc3BoZXJlLnJhZGl1cyAqIHNwaGVyZS5yYWRpdXM7XG4gICAgfTtcbn0pKCk7XG5cbmNvbnN0IGludGVyc2VjdCA9IHtcbiAgICAvLyBvbGQgYXBpXG4gICAgcmF5QWFiYixcbiAgICByYXlNZXNoLFxuICAgIHJheWNhc3QsXG4gICAgcmF5VHJpYW5nbGUsXG5cbiAgICByYXlfc3BoZXJlLFxuICAgIHJheV9hYWJiLFxuICAgIHJheV9vYmIsXG4gICAgcmF5X3BsYW5lLFxuICAgIHJheV90cmlhbmdsZSxcbiAgICBsaW5lX3BsYW5lLFxuICAgIGxpbmVfdHJpYW5nbGUsXG4gICAgbGluZV9xdWFkLFxuXG4gICAgc3BoZXJlX3NwaGVyZSxcbiAgICBzcGhlcmVfYWFiYixcbiAgICBzcGhlcmVfb2JiLFxuICAgIHNwaGVyZV9wbGFuZSxcbiAgICBzcGhlcmVfZnJ1c3R1bSxcbiAgICBzcGhlcmVfZnJ1c3R1bV9hY2N1cmF0ZSxcblxuICAgIGFhYmJfYWFiYixcbiAgICBhYWJiX29iYixcbiAgICBhYWJiX3BsYW5lLFxuICAgIGFhYmJfZnJ1c3R1bSxcbiAgICBhYWJiX2ZydXN0dW1fYWNjdXJhdGUsXG5cbiAgICBvYmJfb2JiLFxuICAgIG9iYl9wbGFuZSxcbiAgICBvYmJfZnJ1c3R1bSxcbiAgICBvYmJfZnJ1c3R1bV9hY2N1cmF0ZSxcbiAgICBvYmJfcG9pbnQsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGludGVyc2VjdGlvbiBkZXRlY3Rpb24gb2YgZzEgYW5kIGcyIGNhbiBmaWxsIGluIHRoZSBzaGFwZSBpbiB0aGUgYmFzaWMgZ2VvbWV0cnkuXG4gICAgICogISN6aFxuICAgICAqIGcxIOWSjCBnMiDnmoTnm7jkuqTmgKfmo4DmtYvvvIzlj6/loavlhaXln7rnoYDlh6DkvZXkuK3nmoTlvaLnirbjgIJcbiAgICAgKiBAc3RhdGljXG4gICAgICogQG1ldGhvZCByZXNvbHZlXG4gICAgICogQHBhcmFtIGcxIEdlb21ldHJ5IDFcbiAgICAgKiBAcGFyYW0gZzIgR2VvbWV0cnkgMlxuICAgICAqIEBwYXJhbSBvdXRQdCBvcHRpb25hbCwgSW50ZXJzZWN0aW9uIHBvaW50LiAobm90ZTogb25seSBwYXJ0aWFsIHNoYXBlIGRldGVjdGlvbiB3aXRoIHRoaXMgcmV0dXJuIHZhbHVlKVxuICAgICAqL1xuICAgIHJlc29sdmUgKGcxOiBhbnksIGcyOiBhbnksIG91dFB0ID0gbnVsbCkge1xuICAgICAgICBjb25zdCB0eXBlMSA9IGcxLl90eXBlLCB0eXBlMiA9IGcyLl90eXBlO1xuICAgICAgICBjb25zdCByZXNvbHZlciA9IHRoaXNbdHlwZTEgfCB0eXBlMl07XG4gICAgICAgIGlmICh0eXBlMSA8IHR5cGUyKSB7IHJldHVybiByZXNvbHZlcihnMSwgZzIsIG91dFB0KTsgfVxuICAgICAgICBlbHNlIHsgcmV0dXJuIHJlc29sdmVyKGcyLCBnMSwgb3V0UHQpOyB9XG4gICAgfSxcbn07XG5cbmludGVyc2VjdFtlbnVtcy5TSEFQRV9SQVkgfCBlbnVtcy5TSEFQRV9TUEhFUkVdID0gcmF5X3NwaGVyZTtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9SQVkgfCBlbnVtcy5TSEFQRV9BQUJCXSA9IHJheV9hYWJiO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1JBWSB8IGVudW1zLlNIQVBFX09CQl0gPSByYXlfb2JiO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1JBWSB8IGVudW1zLlNIQVBFX1BMQU5FXSA9IHJheV9wbGFuZTtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9SQVkgfCBlbnVtcy5TSEFQRV9UUklBTkdMRV0gPSByYXlfdHJpYW5nbGU7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfTElORSB8IGVudW1zLlNIQVBFX1BMQU5FXSA9IGxpbmVfcGxhbmU7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfTElORSB8IGVudW1zLlNIQVBFX1RSSUFOR0xFXSA9IGxpbmVfdHJpYW5nbGU7XG5cbmludGVyc2VjdFtlbnVtcy5TSEFQRV9TUEhFUkVdID0gc3BoZXJlX3NwaGVyZTtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9TUEhFUkUgfCBlbnVtcy5TSEFQRV9BQUJCXSA9IHNwaGVyZV9hYWJiO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1NQSEVSRSB8IGVudW1zLlNIQVBFX09CQl0gPSBzcGhlcmVfb2JiO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1NQSEVSRSB8IGVudW1zLlNIQVBFX1BMQU5FXSA9IHNwaGVyZV9wbGFuZTtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9TUEhFUkUgfCBlbnVtcy5TSEFQRV9GUlVTVFVNXSA9IHNwaGVyZV9mcnVzdHVtO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1NQSEVSRSB8IGVudW1zLlNIQVBFX0ZSVVNUVU1fQUNDVVJBVEVdID0gc3BoZXJlX2ZydXN0dW1fYWNjdXJhdGU7XG5cbmludGVyc2VjdFtlbnVtcy5TSEFQRV9BQUJCXSA9IGFhYmJfYWFiYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9BQUJCIHwgZW51bXMuU0hBUEVfT0JCXSA9IGFhYmJfb2JiO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0FBQkIgfCBlbnVtcy5TSEFQRV9QTEFORV0gPSBhYWJiX3BsYW5lO1xuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0FBQkIgfCBlbnVtcy5TSEFQRV9GUlVTVFVNXSA9IGFhYmJfZnJ1c3R1bTtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9BQUJCIHwgZW51bXMuU0hBUEVfRlJVU1RVTV9BQ0NVUkFURV0gPSBhYWJiX2ZydXN0dW1fYWNjdXJhdGU7XG5cbmludGVyc2VjdFtlbnVtcy5TSEFQRV9PQkJdID0gb2JiX29iYjtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9PQkIgfCBlbnVtcy5TSEFQRV9QTEFORV0gPSBvYmJfcGxhbmU7XG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfT0JCIHwgZW51bXMuU0hBUEVfRlJVU1RVTV0gPSBvYmJfZnJ1c3R1bTtcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9PQkIgfCBlbnVtcy5TSEFQRV9GUlVTVFVNX0FDQ1VSQVRFXSA9IG9iYl9mcnVzdHVtX2FjY3VyYXRlO1xuXG5leHBvcnQgZGVmYXVsdCBpbnRlcnNlY3Q7XG4iXX0=