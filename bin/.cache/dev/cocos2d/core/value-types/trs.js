
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/value-types/trs.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _quat = _interopRequireDefault(require("./quat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tmp_quat = new _quat["default"]();

var Trs =
/*#__PURE__*/
function () {
  function Trs() {}

  Trs.toRotation = function toRotation(out, a) {
    out.x = a[3];
    out.y = a[4];
    out.z = a[5];
    out.w = a[6];
    return out;
  };

  Trs.fromRotation = function fromRotation(out, a) {
    out[3] = a.x;
    out[4] = a.y;
    out[5] = a.z;
    out[6] = a.w;
    return out;
  };

  Trs.toEuler = function toEuler(out, a) {
    Trs.toRotation(tmp_quat, a);

    _quat["default"].toEuler(out, tmp_quat);

    return out;
  };

  Trs.fromEuler = function fromEuler(out, a) {
    _quat["default"].fromEuler(tmp_quat, a.x, a.y, a.z);

    Trs.fromRotation(out, tmp_quat);
    return out;
  };

  Trs.fromEulerNumber = function fromEulerNumber(out, x, y, z) {
    _quat["default"].fromEuler(tmp_quat, x, y, z);

    Trs.fromRotation(out, tmp_quat);
    return out;
  };

  Trs.toScale = function toScale(out, a) {
    out.x = a[7];
    out.y = a[8];
    out.z = a[9];
    return out;
  };

  Trs.fromScale = function fromScale(out, a) {
    out[7] = a.x;
    out[8] = a.y;
    out[9] = a.z;
    return out;
  };

  Trs.toPosition = function toPosition(out, a) {
    out.x = a[0];
    out.y = a[1];
    out.z = a[2];
    return out;
  };

  Trs.fromPosition = function fromPosition(out, a) {
    out[0] = a.x;
    out[1] = a.y;
    out[2] = a.z;
    return out;
  };

  Trs.fromAngleZ = function fromAngleZ(out, a) {
    _quat["default"].fromAngleZ(tmp_quat, a);

    Trs.fromRotation(out, tmp_quat);
    return out;
  };

  Trs.toMat4 = function toMat4(out, trs) {
    var x = trs[3],
        y = trs[4],
        z = trs[5],
        w = trs[6];
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
    var sx = trs[7];
    var sy = trs[8];
    var sz = trs[9];
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
    m[12] = trs[0];
    m[13] = trs[1];
    m[14] = trs[2];
    m[15] = 1;
    return out;
  };

  return Trs;
}();

exports["default"] = Trs;
cc.Trs = Trs;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRycy50cyJdLCJuYW1lcyI6WyJ0bXBfcXVhdCIsIlF1YXQiLCJUcnMiLCJ0b1JvdGF0aW9uIiwib3V0IiwiYSIsIngiLCJ5IiwieiIsInciLCJmcm9tUm90YXRpb24iLCJ0b0V1bGVyIiwiZnJvbUV1bGVyIiwiZnJvbUV1bGVyTnVtYmVyIiwidG9TY2FsZSIsImZyb21TY2FsZSIsInRvUG9zaXRpb24iLCJmcm9tUG9zaXRpb24iLCJmcm9tQW5nbGVaIiwidG9NYXQ0IiwidHJzIiwieDIiLCJ5MiIsInoyIiwieHgiLCJ4eSIsInh6IiwieXkiLCJ5eiIsInp6Iiwid3giLCJ3eSIsInd6Iiwic3giLCJzeSIsInN6IiwibSIsImNjIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7QUFJQSxJQUFJQSxRQUFRLEdBQUcsSUFBSUMsZ0JBQUosRUFBZjs7SUFFcUJDOzs7OztNQUNWQyxhQUFQLG9CQUFtQkMsR0FBbkIsRUFBOEJDLENBQTlCLEVBQW1EO0FBQy9DRCxJQUFBQSxHQUFHLENBQUNFLENBQUosR0FBUUQsQ0FBQyxDQUFDLENBQUQsQ0FBVDtBQUNBRCxJQUFBQSxHQUFHLENBQUNHLENBQUosR0FBUUYsQ0FBQyxDQUFDLENBQUQsQ0FBVDtBQUNBRCxJQUFBQSxHQUFHLENBQUNJLENBQUosR0FBUUgsQ0FBQyxDQUFDLENBQUQsQ0FBVDtBQUNBRCxJQUFBQSxHQUFHLENBQUNLLENBQUosR0FBUUosQ0FBQyxDQUFDLENBQUQsQ0FBVDtBQUNBLFdBQU9ELEdBQVA7QUFDSDs7TUFFTU0sZUFBUCxzQkFBcUJOLEdBQXJCLEVBQXNDQyxDQUF0QyxFQUEyRDtBQUN2REQsSUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxHQUFTQyxDQUFDLENBQUNDLENBQVg7QUFDQUYsSUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxHQUFTQyxDQUFDLENBQUNFLENBQVg7QUFDQUgsSUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxHQUFTQyxDQUFDLENBQUNHLENBQVg7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Z0IsSUFBQUEsQ0FBQyxDQUFDLEVBQUQsQ0FBRCxHQUFRLENBQVI7QUFFQSxXQUFPaEMsR0FBUDtBQUNIOzs7Ozs7QUFHTGlDLEVBQUUsQ0FBQ25DLEdBQUgsR0FBU0EsR0FBVCIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IFF1YXQgZnJvbSAnLi9xdWF0JztcbmltcG9ydCBWZWMzIGZyb20gJy4vdmVjMyc7XG5pbXBvcnQgTWF0NCBmcm9tICcuL01hdDQnO1xuXG5sZXQgdG1wX3F1YXQgPSBuZXcgUXVhdCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcnMge1xuICAgIHN0YXRpYyB0b1JvdGF0aW9uIChvdXQ6IFF1YXQsIGE6IEZsb2F0QXJyYXkpOiBRdWF0IHtcbiAgICAgICAgb3V0LnggPSBhWzNdO1xuICAgICAgICBvdXQueSA9IGFbNF07XG4gICAgICAgIG91dC56ID0gYVs1XTtcbiAgICAgICAgb3V0LncgPSBhWzZdO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tUm90YXRpb24gKG91dDogRmxvYXRBcnJheSwgYTogUXVhdCk6IEZsb2F0QXJyYXkge1xuICAgICAgICBvdXRbM10gPSBhLng7XG4gICAgICAgIG91dFs0XSA9IGEueTtcbiAgICAgICAgb3V0WzVdID0gYS56O1xuICAgICAgICBvdXRbNl0gPSBhLnc7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgc3RhdGljIHRvRXVsZXIgKG91dDogVmVjMywgYTogRmxvYXRBcnJheSk6IFZlYzMge1xuICAgICAgICBUcnMudG9Sb3RhdGlvbih0bXBfcXVhdCwgYSk7XG4gICAgICAgIFF1YXQudG9FdWxlcihvdXQsIHRtcF9xdWF0KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbUV1bGVyIChvdXQ6IEZsb2F0QXJyYXksIGE6IFZlYzMpOiBGbG9hdEFycmF5IHtcbiAgICAgICAgUXVhdC5mcm9tRXVsZXIodG1wX3F1YXQsIGEueCwgYS55LCBhLnopO1xuICAgICAgICBUcnMuZnJvbVJvdGF0aW9uKG91dCwgdG1wX3F1YXQpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tRXVsZXJOdW1iZXIgKG91dDogRmxvYXRBcnJheSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IEZsb2F0QXJyYXkge1xuICAgICAgICBRdWF0LmZyb21FdWxlcih0bXBfcXVhdCwgeCwgeSwgeik7XG4gICAgICAgIFRycy5mcm9tUm90YXRpb24ob3V0LCB0bXBfcXVhdCk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgc3RhdGljIHRvU2NhbGUgKG91dDogVmVjMywgYTogRmxvYXRBcnJheSk6IFZlYzMge1xuICAgICAgICBvdXQueCA9IGFbN107XG4gICAgICAgIG91dC55ID0gYVs4XTtcbiAgICAgICAgb3V0LnogPSBhWzldO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tU2NhbGUgKG91dDogRmxvYXRBcnJheSwgYTogVmVjMyk6IEZsb2F0QXJyYXkge1xuICAgICAgICBvdXRbN10gPSBhLng7XG4gICAgICAgIG91dFs4XSA9IGEueTtcbiAgICAgICAgb3V0WzldID0gYS56O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIHN0YXRpYyB0b1Bvc2l0aW9uIChvdXQ6IFZlYzMsIGE6IEZsb2F0QXJyYXkpOiBWZWMzIHtcbiAgICAgICAgb3V0LnggPSBhWzBdO1xuICAgICAgICBvdXQueSA9IGFbMV07XG4gICAgICAgIG91dC56ID0gYVsyXTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbVBvc2l0aW9uIChvdXQ6IEZsb2F0QXJyYXksIGE6IFZlYzMpOiBGbG9hdEFycmF5IHtcbiAgICAgICAgb3V0WzBdID0gYS54O1xuICAgICAgICBvdXRbMV0gPSBhLnk7XG4gICAgICAgIG91dFsyXSA9IGEuejtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbUFuZ2xlWiAob3V0OiBGbG9hdEFycmF5LCBhOiBudW1iZXIpOiBGbG9hdEFycmF5IHtcbiAgICAgICAgUXVhdC5mcm9tQW5nbGVaKHRtcF9xdWF0LCBhKTtcbiAgICAgICAgVHJzLmZyb21Sb3RhdGlvbihvdXQsIHRtcF9xdWF0KTtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBzdGF0aWMgdG9NYXQ0IChvdXQ6IE1hdDQsIHRyczogRmxvYXRBcnJheSk6IE1hdDQge1xuICAgICAgICBsZXQgeCA9IHRyc1szXSwgeSA9IHRyc1s0XSwgeiA9IHRyc1s1XSwgdyA9IHRyc1s2XTtcbiAgICAgICAgbGV0IHgyID0geCArIHg7XG4gICAgICAgIGxldCB5MiA9IHkgKyB5O1xuICAgICAgICBsZXQgejIgPSB6ICsgejtcblxuICAgICAgICBsZXQgeHggPSB4ICogeDI7XG4gICAgICAgIGxldCB4eSA9IHggKiB5MjtcbiAgICAgICAgbGV0IHh6ID0geCAqIHoyO1xuICAgICAgICBsZXQgeXkgPSB5ICogeTI7XG4gICAgICAgIGxldCB5eiA9IHkgKiB6MjtcbiAgICAgICAgbGV0IHp6ID0geiAqIHoyO1xuICAgICAgICBsZXQgd3ggPSB3ICogeDI7XG4gICAgICAgIGxldCB3eSA9IHcgKiB5MjtcbiAgICAgICAgbGV0IHd6ID0gdyAqIHoyO1xuICAgICAgICBsZXQgc3ggPSB0cnNbN107XG4gICAgICAgIGxldCBzeSA9IHRyc1s4XTtcbiAgICAgICAgbGV0IHN6ID0gdHJzWzldO1xuXG4gICAgICAgIGxldCBtID0gb3V0Lm07XG4gICAgICAgIG1bMF0gPSAoMSAtICh5eSArIHp6KSkgKiBzeDtcbiAgICAgICAgbVsxXSA9ICh4eSArIHd6KSAqIHN4O1xuICAgICAgICBtWzJdID0gKHh6IC0gd3kpICogc3g7XG4gICAgICAgIG1bM10gPSAwO1xuICAgICAgICBtWzRdID0gKHh5IC0gd3opICogc3k7XG4gICAgICAgIG1bNV0gPSAoMSAtICh4eCArIHp6KSkgKiBzeTtcbiAgICAgICAgbVs2XSA9ICh5eiArIHd4KSAqIHN5O1xuICAgICAgICBtWzddID0gMDtcbiAgICAgICAgbVs4XSA9ICh4eiArIHd5KSAqIHN6O1xuICAgICAgICBtWzldID0gKHl6IC0gd3gpICogc3o7XG4gICAgICAgIG1bMTBdID0gKDEgLSAoeHggKyB5eSkpICogc3o7XG4gICAgICAgIG1bMTFdID0gMDtcbiAgICAgICAgbVsxMl0gPSB0cnNbMF07XG4gICAgICAgIG1bMTNdID0gdHJzWzFdO1xuICAgICAgICBtWzE0XSA9IHRyc1syXTtcbiAgICAgICAgbVsxNV0gPSAxO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxufVxuXG5jYy5UcnMgPSBUcnM7Il19