
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/renderer/webgl/mesh-buffer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _gfx = _interopRequireDefault(require("../../../renderer/gfx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
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
var MeshBuffer = cc.Class({
  name: 'cc.MeshBuffer',
  ctor: function ctor(batcher, vertexFormat) {
    this.init(batcher, vertexFormat);
  },
  init: function init(batcher, vertexFormat) {
    this.byteOffset = 0;
    this.indiceOffset = 0;
    this.vertexOffset = 0;
    this.indiceStart = 0;
    this._dirty = false;
    this._vertexFormat = vertexFormat;
    this._vertexBytes = this._vertexFormat._bytes;
    this._arrOffset = 0;
    this._vbArr = [];
    this._vb = new _gfx["default"].VertexBuffer(batcher._device, vertexFormat, _gfx["default"].USAGE_DYNAMIC, new ArrayBuffer(), 0);
    this._vbArr[0] = this._vb;
    this._ibArr = [];
    this._ib = new _gfx["default"].IndexBuffer(batcher._device, _gfx["default"].INDEX_FMT_UINT16, _gfx["default"].USAGE_STATIC, new ArrayBuffer(), 0);
    this._ibArr[0] = this._ib;
    this._vData = null;
    this._uintVData = null;
    this._iData = null;
    this._batcher = batcher;
    this._initVDataCount = 256 * vertexFormat._bytes; // actually 256 * 4 * (vertexFormat._bytes / 4)

    this._initIDataCount = 256 * 6;
    this._offsetInfo = {
      byteOffset: 0,
      vertexOffset: 0,
      indiceOffset: 0
    };

    this._reallocBuffer();
  },
  uploadData: function uploadData() {
    if (this.byteOffset === 0 || !this._dirty) {
      return;
    } // update vertext data


    var vertexsData = new Float32Array(this._vData.buffer, 0, this.byteOffset >> 2);
    var indicesData = new Uint16Array(this._iData.buffer, 0, this.indiceOffset);
    var vb = this._vb;
    vb.update(0, vertexsData);
    var ib = this._ib;
    ib.update(0, indicesData);
    this._dirty = false;
  },
  switchBuffer: function switchBuffer() {
    var offset = ++this._arrOffset;
    this.byteOffset = 0;
    this.vertexOffset = 0;
    this.indiceOffset = 0;
    this.indiceStart = 0;

    if (offset < this._vbArr.length) {
      this._vb = this._vbArr[offset];
      this._ib = this._ibArr[offset];
    } else {
      this._vb = new _gfx["default"].VertexBuffer(this._batcher._device, this._vertexFormat, _gfx["default"].USAGE_DYNAMIC, new ArrayBuffer(), 0);
      this._vbArr[offset] = this._vb;
      this._ib = new _gfx["default"].IndexBuffer(this._batcher._device, _gfx["default"].INDEX_FMT_UINT16, _gfx["default"].USAGE_STATIC, new ArrayBuffer(), 0);
      this._ibArr[offset] = this._ib;
    }
  },
  checkAndSwitchBuffer: function checkAndSwitchBuffer(vertexCount) {
    if (this.vertexOffset + vertexCount > 65535) {
      this.uploadData();

      this._batcher._flush();

      this.switchBuffer();
    }
  },
  requestStatic: function requestStatic(vertexCount, indiceCount) {
    this.checkAndSwitchBuffer(vertexCount);
    var byteOffset = this.byteOffset + vertexCount * this._vertexBytes;
    var indiceOffset = this.indiceOffset + indiceCount;
    var byteLength = this._vData.byteLength;
    var indiceLength = this._iData.length;

    if (byteOffset > byteLength || indiceOffset > indiceLength) {
      while (byteLength < byteOffset || indiceLength < indiceOffset) {
        this._initVDataCount *= 2;
        this._initIDataCount *= 2;
        byteLength = this._initVDataCount * 4;
        indiceLength = this._initIDataCount;
      }

      this._reallocBuffer();
    }

    this._updateOffset(vertexCount, indiceCount, byteOffset);
  },
  _updateOffset: function _updateOffset(vertexCount, indiceCount, byteOffset) {
    var offsetInfo = this._offsetInfo;
    offsetInfo.vertexOffset = this.vertexOffset;
    this.vertexOffset += vertexCount;
    offsetInfo.indiceOffset = this.indiceOffset;
    this.indiceOffset += indiceCount;
    offsetInfo.byteOffset = this.byteOffset;
    this.byteOffset = byteOffset;
    this._dirty = true;
  },
  request: function request(vertexCount, indiceCount) {
    if (this._batcher._buffer !== this) {
      this._batcher._flush();

      this._batcher._buffer = this;
    }

    this.requestStatic(vertexCount, indiceCount);
    return this._offsetInfo;
  },
  _reallocBuffer: function _reallocBuffer() {
    this._reallocVData(true);

    this._reallocIData(true);
  },
  _reallocVData: function _reallocVData(copyOldData) {
    var oldVData;

    if (this._vData) {
      oldVData = new Uint8Array(this._vData.buffer);
    }

    this._vData = new Float32Array(this._initVDataCount);
    this._uintVData = new Uint32Array(this._vData.buffer);
    var newData = new Uint8Array(this._uintVData.buffer);

    if (oldVData && copyOldData) {
      for (var i = 0, l = oldVData.length; i < l; i++) {
        newData[i] = oldVData[i];
      }
    }
  },
  _reallocIData: function _reallocIData(copyOldData) {
    var oldIData = this._iData;
    this._iData = new Uint16Array(this._initIDataCount);

    if (oldIData && copyOldData) {
      var iData = this._iData;

      for (var i = 0, l = oldIData.length; i < l; i++) {
        iData[i] = oldIData[i];
      }
    }
  },
  reset: function reset() {
    this._arrOffset = 0;
    this._vb = this._vbArr[0];
    this._ib = this._ibArr[0];
    this.byteOffset = 0;
    this.indiceOffset = 0;
    this.vertexOffset = 0;
    this.indiceStart = 0;
    this._dirty = false;
  },
  destroy: function destroy() {
    this.reset();

    for (var i = 0; i < this._vbArr.length; i++) {
      var vb = this._vbArr[i];
      vb.destroy();
    }

    this._vbArr = null;

    for (var _i = 0; _i < this._ibArr.length; _i++) {
      var ib = this._ibArr[_i];
      ib.destroy();
    }

    this._ibArr = null;
    this._ib = null;
    this._vb = null;
  },
  forwardIndiceStartToOffset: function forwardIndiceStartToOffset() {
    this.indiceStart = this.indiceOffset;
  }
});
cc.MeshBuffer = module.exports = MeshBuffer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1lc2gtYnVmZmVyLmpzIl0sIm5hbWVzIjpbIk1lc2hCdWZmZXIiLCJjYyIsIkNsYXNzIiwibmFtZSIsImN0b3IiLCJiYXRjaGVyIiwidmVydGV4Rm9ybWF0IiwiaW5pdCIsImJ5dGVPZmZzZXQiLCJpbmRpY2VPZmZzZXQiLCJ2ZXJ0ZXhPZmZzZXQiLCJpbmRpY2VTdGFydCIsIl9kaXJ0eSIsIl92ZXJ0ZXhGb3JtYXQiLCJfdmVydGV4Qnl0ZXMiLCJfYnl0ZXMiLCJfYXJyT2Zmc2V0IiwiX3ZiQXJyIiwiX3ZiIiwiZ2Z4IiwiVmVydGV4QnVmZmVyIiwiX2RldmljZSIsIlVTQUdFX0RZTkFNSUMiLCJBcnJheUJ1ZmZlciIsIl9pYkFyciIsIl9pYiIsIkluZGV4QnVmZmVyIiwiSU5ERVhfRk1UX1VJTlQxNiIsIlVTQUdFX1NUQVRJQyIsIl92RGF0YSIsIl91aW50VkRhdGEiLCJfaURhdGEiLCJfYmF0Y2hlciIsIl9pbml0VkRhdGFDb3VudCIsIl9pbml0SURhdGFDb3VudCIsIl9vZmZzZXRJbmZvIiwiX3JlYWxsb2NCdWZmZXIiLCJ1cGxvYWREYXRhIiwidmVydGV4c0RhdGEiLCJGbG9hdDMyQXJyYXkiLCJidWZmZXIiLCJpbmRpY2VzRGF0YSIsIlVpbnQxNkFycmF5IiwidmIiLCJ1cGRhdGUiLCJpYiIsInN3aXRjaEJ1ZmZlciIsIm9mZnNldCIsImxlbmd0aCIsImNoZWNrQW5kU3dpdGNoQnVmZmVyIiwidmVydGV4Q291bnQiLCJfZmx1c2giLCJyZXF1ZXN0U3RhdGljIiwiaW5kaWNlQ291bnQiLCJieXRlTGVuZ3RoIiwiaW5kaWNlTGVuZ3RoIiwiX3VwZGF0ZU9mZnNldCIsIm9mZnNldEluZm8iLCJyZXF1ZXN0IiwiX2J1ZmZlciIsIl9yZWFsbG9jVkRhdGEiLCJfcmVhbGxvY0lEYXRhIiwiY29weU9sZERhdGEiLCJvbGRWRGF0YSIsIlVpbnQ4QXJyYXkiLCJVaW50MzJBcnJheSIsIm5ld0RhdGEiLCJpIiwibCIsIm9sZElEYXRhIiwiaURhdGEiLCJyZXNl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Q0EsU0FBS0MsV0FBTCxHQUFtQixDQUFuQjtBQUVBLFNBQUtDLE1BQUwsR0FBYyxLQUFkO0FBQ0gsR0FoTnFCO0FBa050QjRELEVBQUFBLE9BbE5zQixxQkFrTlg7QUFDUCxTQUFLRCxLQUFMOztBQUNBLFNBQUssSUFBSUosQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBSSxLQUFLbEQsTUFBTCxDQUFZK0IsTUFBakMsRUFBeUNtQixDQUFDLEVBQTFDLEVBQThDO0FBQzFDLFVBQUl4QixFQUFFLEdBQUcsS0FBSzFCLE1BQUwsQ0FBWWtELENBQVosQ0FBVDtBQUNBeEIsTUFBQUEsRUFBRSxDQUFDNkIsT0FBSDtBQUNIOztBQUNELFNBQUt2RCxNQUFMLEdBQWMsSUFBZDs7QUFFQSxTQUFLLElBQUlrRCxFQUFDLEdBQUcsQ0FBYixFQUFnQkEsRUFBQyxHQUFHLEtBQUszQyxNQUFMLENBQVl3QixNQUFoQyxFQUF3Q21CLEVBQUMsRUFBekMsRUFBNkM7QUFDekMsVUFBSXRCLEVBQUUsR0FBRyxLQUFLckIsTUFBTCxDQUFZMkMsRUFBWixDQUFUO0FBQ0F0QixNQUFBQSxFQUFFLENBQUMyQixPQUFIO0FBQ0g7O0FBQ0QsU0FBS2hELE1BQUwsR0FBYyxJQUFkO0FBRUEsU0FBS0MsR0FBTCxHQUFXLElBQVg7QUFDQSxTQUFLUCxHQUFMLEdBQVcsSUFBWDtBQUNILEdBbE9xQjtBQW9PdEJ1RCxFQUFBQSwwQkFwT3NCLHdDQW9PUTtBQUMxQixTQUFLOUQsV0FBTCxHQUFtQixLQUFLRixZQUF4QjtBQUNIO0FBdE9xQixDQUFULENBQWpCO0FBeU9BUixFQUFFLENBQUNELFVBQUgsR0FBZ0IwRSxNQUFNLENBQUNDLE9BQVAsR0FBaUIzRSxVQUFqQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBnZnggZnJvbSAnLi4vLi4vLi4vcmVuZGVyZXIvZ2Z4JztcblxubGV0IE1lc2hCdWZmZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLk1lc2hCdWZmZXInLFxuICAgIGN0b3IgKGJhdGNoZXIsIHZlcnRleEZvcm1hdCkge1xuICAgICAgICB0aGlzLmluaXQgKGJhdGNoZXIsIHZlcnRleEZvcm1hdCk7XG4gICAgfSxcblxuICAgIGluaXQgKGJhdGNoZXIsIHZlcnRleEZvcm1hdCkge1xuICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgPSAwO1xuICAgICAgICB0aGlzLmluZGljZU9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMudmVydGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5pbmRpY2VTdGFydCA9IDA7XG5cbiAgICAgICAgdGhpcy5fZGlydHkgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl92ZXJ0ZXhGb3JtYXQgPSB2ZXJ0ZXhGb3JtYXQ7XG4gICAgICAgIHRoaXMuX3ZlcnRleEJ5dGVzID0gdGhpcy5fdmVydGV4Rm9ybWF0Ll9ieXRlcztcblxuICAgICAgICB0aGlzLl9hcnJPZmZzZXQgPSAwO1xuICAgICAgICB0aGlzLl92YkFyciA9IFtdO1xuICAgICAgICB0aGlzLl92YiA9IG5ldyBnZnguVmVydGV4QnVmZmVyKFxuICAgICAgICAgICAgYmF0Y2hlci5fZGV2aWNlLFxuICAgICAgICAgICAgdmVydGV4Rm9ybWF0LFxuICAgICAgICAgICAgZ2Z4LlVTQUdFX0RZTkFNSUMsXG4gICAgICAgICAgICBuZXcgQXJyYXlCdWZmZXIoKSxcbiAgICAgICAgICAgIDBcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5fdmJBcnJbMF0gPSB0aGlzLl92YjtcblxuICAgICAgICB0aGlzLl9pYkFyciA9IFtdO1xuICAgICAgICB0aGlzLl9pYiA9IG5ldyBnZnguSW5kZXhCdWZmZXIoXG4gICAgICAgICAgICBiYXRjaGVyLl9kZXZpY2UsXG4gICAgICAgICAgICBnZnguSU5ERVhfRk1UX1VJTlQxNixcbiAgICAgICAgICAgIGdmeC5VU0FHRV9TVEFUSUMsXG4gICAgICAgICAgICBuZXcgQXJyYXlCdWZmZXIoKSxcbiAgICAgICAgICAgIDBcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5faWJBcnJbMF0gPSB0aGlzLl9pYjtcblxuICAgICAgICB0aGlzLl92RGF0YSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3VpbnRWRGF0YSA9IG51bGw7XG4gICAgICAgIHRoaXMuX2lEYXRhID0gbnVsbDtcblxuICAgICAgICB0aGlzLl9iYXRjaGVyID0gYmF0Y2hlcjtcblxuICAgICAgICB0aGlzLl9pbml0VkRhdGFDb3VudCA9IDI1NiAqIHZlcnRleEZvcm1hdC5fYnl0ZXM7Ly8gYWN0dWFsbHkgMjU2ICogNCAqICh2ZXJ0ZXhGb3JtYXQuX2J5dGVzIC8gNClcbiAgICAgICAgdGhpcy5faW5pdElEYXRhQ291bnQgPSAyNTYgKiA2O1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fb2Zmc2V0SW5mbyA9IHtcbiAgICAgICAgICAgIGJ5dGVPZmZzZXQgOiAwLFxuICAgICAgICAgICAgdmVydGV4T2Zmc2V0IDogMCxcbiAgICAgICAgICAgIGluZGljZU9mZnNldCA6IDBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZWFsbG9jQnVmZmVyKCk7XG4gICAgfSxcblxuICAgIHVwbG9hZERhdGEgKCkge1xuICAgICAgICBpZiAodGhpcy5ieXRlT2Zmc2V0ID09PSAwIHx8ICF0aGlzLl9kaXJ0eSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIHZlcnRleHQgZGF0YVxuICAgICAgICBsZXQgdmVydGV4c0RhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuX3ZEYXRhLmJ1ZmZlciwgMCwgdGhpcy5ieXRlT2Zmc2V0ID4+IDIpO1xuICAgICAgICBsZXQgaW5kaWNlc0RhdGEgPSBuZXcgVWludDE2QXJyYXkodGhpcy5faURhdGEuYnVmZmVyLCAwLCB0aGlzLmluZGljZU9mZnNldCk7XG5cbiAgICAgICAgbGV0IHZiID0gdGhpcy5fdmI7XG4gICAgICAgIHZiLnVwZGF0ZSgwLCB2ZXJ0ZXhzRGF0YSk7XG5cbiAgICAgICAgbGV0IGliID0gdGhpcy5faWI7XG4gICAgICAgIGliLnVwZGF0ZSgwLCBpbmRpY2VzRGF0YSk7XG5cbiAgICAgICAgdGhpcy5fZGlydHkgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgc3dpdGNoQnVmZmVyICgpIHtcbiAgICAgICAgbGV0IG9mZnNldCA9ICsrdGhpcy5fYXJyT2Zmc2V0O1xuXG4gICAgICAgIHRoaXMuYnl0ZU9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMudmVydGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5pbmRpY2VPZmZzZXQgPSAwO1xuICAgICAgICB0aGlzLmluZGljZVN0YXJ0ID0gMDtcblxuICAgICAgICBpZiAob2Zmc2V0IDwgdGhpcy5fdmJBcnIubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLl92YiA9IHRoaXMuX3ZiQXJyW29mZnNldF07XG4gICAgICAgICAgICB0aGlzLl9pYiA9IHRoaXMuX2liQXJyW29mZnNldF07XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX3ZiID0gbmV3IGdmeC5WZXJ0ZXhCdWZmZXIoXG4gICAgICAgICAgICAgICAgdGhpcy5fYmF0Y2hlci5fZGV2aWNlLFxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRleEZvcm1hdCxcbiAgICAgICAgICAgICAgICBnZnguVVNBR0VfRFlOQU1JQyxcbiAgICAgICAgICAgICAgICBuZXcgQXJyYXlCdWZmZXIoKSxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5fdmJBcnJbb2Zmc2V0XSA9IHRoaXMuX3ZiO1xuXG4gICAgICAgICAgICB0aGlzLl9pYiA9IG5ldyBnZnguSW5kZXhCdWZmZXIoXG4gICAgICAgICAgICAgICAgdGhpcy5fYmF0Y2hlci5fZGV2aWNlLFxuICAgICAgICAgICAgICAgIGdmeC5JTkRFWF9GTVRfVUlOVDE2LFxuICAgICAgICAgICAgICAgIGdmeC5VU0FHRV9TVEFUSUMsXG4gICAgICAgICAgICAgICAgbmV3IEFycmF5QnVmZmVyKCksXG4gICAgICAgICAgICAgICAgMFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuX2liQXJyW29mZnNldF0gPSB0aGlzLl9pYjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjaGVja0FuZFN3aXRjaEJ1ZmZlciAodmVydGV4Q291bnQpIHtcbiAgICAgICAgaWYgKHRoaXMudmVydGV4T2Zmc2V0ICsgdmVydGV4Q291bnQgPiA2NTUzNSkge1xuICAgICAgICAgICAgdGhpcy51cGxvYWREYXRhKCk7XG4gICAgICAgICAgICB0aGlzLl9iYXRjaGVyLl9mbHVzaCgpO1xuICAgICAgICAgICAgdGhpcy5zd2l0Y2hCdWZmZXIoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXF1ZXN0U3RhdGljICh2ZXJ0ZXhDb3VudCwgaW5kaWNlQ291bnQpIHtcblxuICAgICAgICB0aGlzLmNoZWNrQW5kU3dpdGNoQnVmZmVyKHZlcnRleENvdW50KTtcblxuICAgICAgICBsZXQgYnl0ZU9mZnNldCA9IHRoaXMuYnl0ZU9mZnNldCArIHZlcnRleENvdW50ICogdGhpcy5fdmVydGV4Qnl0ZXM7XG4gICAgICAgIGxldCBpbmRpY2VPZmZzZXQgPSB0aGlzLmluZGljZU9mZnNldCArIGluZGljZUNvdW50O1xuXG4gICAgICAgIGxldCBieXRlTGVuZ3RoID0gdGhpcy5fdkRhdGEuYnl0ZUxlbmd0aDtcbiAgICAgICAgbGV0IGluZGljZUxlbmd0aCA9IHRoaXMuX2lEYXRhLmxlbmd0aDtcbiAgICAgICAgaWYgKGJ5dGVPZmZzZXQgPiBieXRlTGVuZ3RoIHx8IGluZGljZU9mZnNldCA+IGluZGljZUxlbmd0aCkge1xuICAgICAgICAgICAgd2hpbGUgKGJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0IHx8IGluZGljZUxlbmd0aCA8IGluZGljZU9mZnNldCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2luaXRWRGF0YUNvdW50ICo9IDI7XG4gICAgICAgICAgICAgICAgdGhpcy5faW5pdElEYXRhQ291bnQgKj0gMjtcblxuICAgICAgICAgICAgICAgIGJ5dGVMZW5ndGggPSB0aGlzLl9pbml0VkRhdGFDb3VudCAqIDQ7XG4gICAgICAgICAgICAgICAgaW5kaWNlTGVuZ3RoID0gdGhpcy5faW5pdElEYXRhQ291bnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3JlYWxsb2NCdWZmZXIoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVPZmZzZXQodmVydGV4Q291bnQsIGluZGljZUNvdW50LCBieXRlT2Zmc2V0KTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZU9mZnNldCAodmVydGV4Q291bnQsIGluZGljZUNvdW50LCBieXRlT2Zmc2V0KSB7XG4gICAgICAgIGxldCBvZmZzZXRJbmZvID0gdGhpcy5fb2Zmc2V0SW5mbztcbiAgICAgICAgb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQgPSB0aGlzLnZlcnRleE9mZnNldDtcbiAgICAgICAgdGhpcy52ZXJ0ZXhPZmZzZXQgKz0gdmVydGV4Q291bnQ7XG5cbiAgICAgICAgb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQgPSB0aGlzLmluZGljZU9mZnNldDtcbiAgICAgICAgdGhpcy5pbmRpY2VPZmZzZXQgKz0gaW5kaWNlQ291bnQ7XG5cbiAgICAgICAgb2Zmc2V0SW5mby5ieXRlT2Zmc2V0ID0gdGhpcy5ieXRlT2Zmc2V0O1xuICAgICAgICB0aGlzLmJ5dGVPZmZzZXQgPSBieXRlT2Zmc2V0O1xuXG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdCAodmVydGV4Q291bnQsIGluZGljZUNvdW50KSB7XG4gICAgICAgIGlmICh0aGlzLl9iYXRjaGVyLl9idWZmZXIgIT09IHRoaXMpIHtcbiAgICAgICAgICAgIHRoaXMuX2JhdGNoZXIuX2ZsdXNoKCk7XG4gICAgICAgICAgICB0aGlzLl9iYXRjaGVyLl9idWZmZXIgPSB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXF1ZXN0U3RhdGljKHZlcnRleENvdW50LCBpbmRpY2VDb3VudCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXRJbmZvO1xuICAgIH0sXG4gICAgXG4gICAgX3JlYWxsb2NCdWZmZXIgKCkge1xuICAgICAgICB0aGlzLl9yZWFsbG9jVkRhdGEodHJ1ZSk7XG4gICAgICAgIHRoaXMuX3JlYWxsb2NJRGF0YSh0cnVlKTtcbiAgICB9LFxuXG4gICAgX3JlYWxsb2NWRGF0YSAoY29weU9sZERhdGEpIHtcbiAgICAgICAgbGV0IG9sZFZEYXRhO1xuICAgICAgICBpZiAodGhpcy5fdkRhdGEpIHtcbiAgICAgICAgICAgIG9sZFZEYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fdkRhdGEuYnVmZmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3ZEYXRhID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9pbml0VkRhdGFDb3VudCk7XG4gICAgICAgIHRoaXMuX3VpbnRWRGF0YSA9IG5ldyBVaW50MzJBcnJheSh0aGlzLl92RGF0YS5idWZmZXIpO1xuXG4gICAgICAgIGxldCBuZXdEYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fdWludFZEYXRhLmJ1ZmZlcik7XG5cbiAgICAgICAgaWYgKG9sZFZEYXRhICYmIGNvcHlPbGREYXRhKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IG9sZFZEYXRhLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIG5ld0RhdGFbaV0gPSBvbGRWRGF0YVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVhbGxvY0lEYXRhIChjb3B5T2xkRGF0YSkge1xuICAgICAgICBsZXQgb2xkSURhdGEgPSB0aGlzLl9pRGF0YTtcblxuICAgICAgICB0aGlzLl9pRGF0YSA9IG5ldyBVaW50MTZBcnJheSh0aGlzLl9pbml0SURhdGFDb3VudCk7XG5cbiAgICAgICAgaWYgKG9sZElEYXRhICYmIGNvcHlPbGREYXRhKSB7XG4gICAgICAgICAgICBsZXQgaURhdGEgPSB0aGlzLl9pRGF0YTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gb2xkSURhdGEubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaURhdGFbaV0gPSBvbGRJRGF0YVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICByZXNldCAoKSB7XG4gICAgICAgIHRoaXMuX2Fyck9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMuX3ZiID0gdGhpcy5fdmJBcnJbMF07XG4gICAgICAgIHRoaXMuX2liID0gdGhpcy5faWJBcnJbMF07XG5cbiAgICAgICAgdGhpcy5ieXRlT2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5pbmRpY2VPZmZzZXQgPSAwO1xuICAgICAgICB0aGlzLnZlcnRleE9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMuaW5kaWNlU3RhcnQgPSAwO1xuXG4gICAgICAgIHRoaXMuX2RpcnR5ID0gZmFsc2U7XG4gICAgfSxcblxuICAgIGRlc3Ryb3kgKCkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgIHRoaXMuX3ZiQXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdmIgPSB0aGlzLl92YkFycltpXTtcbiAgICAgICAgICAgIHZiLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl92YkFyciA9IG51bGw7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9pYkFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGliID0gdGhpcy5faWJBcnJbaV07XG4gICAgICAgICAgICBpYi5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faWJBcnIgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX2liID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdmIgPSBudWxsO1xuICAgIH0sXG5cbiAgICBmb3J3YXJkSW5kaWNlU3RhcnRUb09mZnNldCAoKSB7XG4gICAgICAgIHRoaXMuaW5kaWNlU3RhcnQgPSB0aGlzLmluZGljZU9mZnNldDtcbiAgICB9XG59KTtcblxuY2MuTWVzaEJ1ZmZlciA9IG1vZHVsZS5leHBvcnRzID0gTWVzaEJ1ZmZlcjtcbiJdfQ==