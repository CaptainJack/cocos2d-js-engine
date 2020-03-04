
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/renderer/gfx/state.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _enums = require("./enums");

var _default = {
  // blend
  blend: false,
  blendSep: false,
  blendColor: 0xffffffff,
  blendEq: _enums.enums.BLEND_FUNC_ADD,
  blendAlphaEq: _enums.enums.BLEND_FUNC_ADD,
  blendSrc: _enums.enums.BLEND_ONE,
  blendDst: _enums.enums.BLEND_ZERO,
  blendSrcAlpha: _enums.enums.BLEND_ONE,
  blendDstAlpha: _enums.enums.BLEND_ZERO,
  // depth
  depthTest: false,
  depthWrite: false,
  depthFunc: _enums.enums.DS_FUNC_LESS,
  // stencil
  stencilTest: false,
  stencilSep: false,
  stencilFuncFront: _enums.enums.DS_FUNC_ALWAYS,
  stencilRefFront: 0,
  stencilMaskFront: 0xff,
  stencilFailOpFront: _enums.enums.STENCIL_OP_KEEP,
  stencilZFailOpFront: _enums.enums.STENCIL_OP_KEEP,
  stencilZPassOpFront: _enums.enums.STENCIL_OP_KEEP,
  stencilWriteMaskFront: 0xff,
  stencilFuncBack: _enums.enums.DS_FUNC_ALWAYS,
  stencilRefBack: 0,
  stencilMaskBack: 0xff,
  stencilFailOpBack: _enums.enums.STENCIL_OP_KEEP,
  stencilZFailOpBack: _enums.enums.STENCIL_OP_KEEP,
  stencilZPassOpBack: _enums.enums.STENCIL_OP_KEEP,
  stencilWriteMaskBack: 0xff,
  // cull-mode
  cullMode: _enums.enums.CULL_BACK,
  // primitive-type
  primitiveType: _enums.enums.PT_TRIANGLES,
  // bindings
  maxStream: -1,
  vertexBuffers: [],
  vertexBufferOffsets: [],
  indexBuffer: null,
  maxTextureSlot: -1,
  textureUnits: [],
  program: null
};

var State =
/*#__PURE__*/
function () {
  function State(device) {
    // bindings
    this.vertexBuffers = new Array(device._caps.maxVertexStreams);
    this.vertexBufferOffsets = new Array(device._caps.maxVertexStreams);
    this.textureUnits = new Array(device._caps.maxTextureUnits);
    this.set(_default);
  }

  State.initDefault = function initDefault(device) {
    _default.vertexBuffers = new Array(device._caps.maxVertexStreams);
    _default.vertexBufferOffsets = new Array(device._caps.maxVertexStreams);
    _default.textureUnits = new Array(device._caps.maxTextureUnits);
  };

  var _proto = State.prototype;

  _proto.reset = function reset() {
    this.set(_default);
  };

  _proto.set = function set(cpy) {
    // blending
    this.blend = cpy.blend;
    this.blendSep = cpy.blendSep;
    this.blendColor = cpy.blendColor;
    this.blendEq = cpy.blendEq;
    this.blendAlphaEq = cpy.blendAlphaEq;
    this.blendSrc = cpy.blendSrc;
    this.blendDst = cpy.blendDst;
    this.blendSrcAlpha = cpy.blendSrcAlpha;
    this.blendDstAlpha = cpy.blendDstAlpha; // depth

    this.depthTest = cpy.depthTest;
    this.depthWrite = cpy.depthWrite;
    this.depthFunc = cpy.depthFunc; // stencil

    this.stencilTest = cpy.stencilTest;
    this.stencilSep = cpy.stencilSep;
    this.stencilFuncFront = cpy.stencilFuncFront;
    this.stencilRefFront = cpy.stencilRefFront;
    this.stencilMaskFront = cpy.stencilMaskFront;
    this.stencilFailOpFront = cpy.stencilFailOpFront;
    this.stencilZFailOpFront = cpy.stencilZFailOpFront;
    this.stencilZPassOpFront = cpy.stencilZPassOpFront;
    this.stencilWriteMaskFront = cpy.stencilWriteMaskFront;
    this.stencilFuncBack = cpy.stencilFuncBack;
    this.stencilRefBack = cpy.stencilRefBack;
    this.stencilMaskBack = cpy.stencilMaskBack;
    this.stencilFailOpBack = cpy.stencilFailOpBack;
    this.stencilZFailOpBack = cpy.stencilZFailOpBack;
    this.stencilZPassOpBack = cpy.stencilZPassOpBack;
    this.stencilWriteMaskBack = cpy.stencilWriteMaskBack; // cull-mode

    this.cullMode = cpy.cullMode; // primitive-type

    this.primitiveType = cpy.primitiveType; // buffer bindings

    this.maxStream = cpy.maxStream;

    for (var i = 0; i < cpy.vertexBuffers.length; ++i) {
      this.vertexBuffers[i] = cpy.vertexBuffers[i];
    }

    for (var _i = 0; _i < cpy.vertexBufferOffsets.length; ++_i) {
      this.vertexBufferOffsets[_i] = cpy.vertexBufferOffsets[_i];
    }

    this.indexBuffer = cpy.indexBuffer; // texture bindings

    this.maxTextureSlot = cpy.maxTextureSlot;

    for (var _i2 = 0; _i2 < cpy.textureUnits.length; ++_i2) {
      this.textureUnits[_i2] = cpy.textureUnits[_i2];
    }

    this.program = cpy.program;
  };

  return State;
}();

exports["default"] = State;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0YXRlLmpzIl0sIm5hbWVzIjpbIl9kZWZhdWx0IiwiYmxlbmQiLCJibGVuZFNlcCIsImJsZW5kQ29sb3IiLCJibGVuZEVxIiwiZW51bXMiLCJCTEVORF9GVU5DX0FERCIsImJsZW5kQWxwaGFFcSIsImJsZW5kU3JjIiwiQkxFTkRfT05FIiwiYmxlbmREc3QiLCJCTEVORF9aRVJPIiwiYmxlbmRTcmNBbHBoYSIsImJsZW5kRHN0QWxwaGEiLCJkZXB0aFRlc3QiLCJkZXB0aFdyaXRlIiwiZGVwdGhGdW5jIiwiRFNfRlVOQ19MRVNTIiwic3RlbmNpbFRlc3QiLCJzdGVuY2lsU2VwIiwic3RlbmNpbEZ1bmNGcm9udCIsIkRTX0ZVTkNfQUxXQVlTIiwic3RlbmNpbFJlZkZyb250Iiwic3RlbmNpbE1hc2tGcm9udCIsInN0ZW5jaWxGYWlsT3BGcm9udCIsIlNURU5DSUxfT1BfS0VFUCIsInN0ZW5jaWxaRmFpbE9wRnJvbnQiLCJzdGVuY2lsWlBhc3NPcEZyb250Iiwic3RlbmNpbFdyaXRlTWFza0Zyb250Iiwic3RlbmNpbEZ1bmNCYWNrIiwic3RlbmNpbFJlZkJhY2siLCJzdGVuY2lsTWFza0JhY2siLCJzdGVuY2lsRmFpbE9wQmFjayIsInN0ZW5jaWxaRmFpbE9wQmFjayIsInN0ZW5jaWxaUGFzc09wQmFjayIsInN0ZW5jaWxXcml0ZU1hc2tCYWNrIiwiY3VsbE1vZGUiLCJDVUxMX0JBQ0siLCJwcmltaXRpdmVUeXBlIiwiUFRfVFJJQU5HTEVTIiwibWF4U3RyZWFtIiwidmVydGV4QnVmZmVycyIsInZlcnRleEJ1ZmZlck9mZnNldHMiLCJpbmRleEJ1ZmZlciIsIm1heFRleHR1cmVTbG90IiwidGV4dHVyZVVuaXRzIiwicHJvZ3JhbSIsIlN0YXRlIiwiZGV2aWNlIiwiQXJyYXkiLCJfY2FwcyIsIm1heFZlcnRleFN0cmVhbXMiLCJtYXhUZXh0dXJlVW5pdHMiLCJzZXQiLCJpbml0RGVmYXVsdCIsInJlc2V0IiwiY3B5IiwiaSIsImxlbmd0aCJdLCJtYXBwaW5n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R0FBR0QsR0FBRyxDQUFDZCxtQkFBSixDQUF3QmdCLE1BQTVDLEVBQW9ELEVBQUVELEVBQXRELEVBQXlEO0FBQ3ZELFdBQUtmLG1CQUFMLENBQXlCZSxFQUF6QixJQUE4QkQsR0FBRyxDQUFDZCxtQkFBSixDQUF3QmUsRUFBeEIsQ0FBOUI7QUFDRDs7QUFDRCxTQUFLZCxXQUFMLEdBQW1CYSxHQUFHLENBQUNiLFdBQXZCLENBakRRLENBbURSOztBQUNBLFNBQUtDLGNBQUwsR0FBc0JZLEdBQUcsQ0FBQ1osY0FBMUI7O0FBQ0EsU0FBSyxJQUFJYSxHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHRCxHQUFHLENBQUNYLFlBQUosQ0FBaUJhLE1BQXJDLEVBQTZDLEVBQUVELEdBQS9DLEVBQWtEO0FBQ2hELFdBQUtaLFlBQUwsQ0FBa0JZLEdBQWxCLElBQXVCRCxHQUFHLENBQUNYLFlBQUosQ0FBaUJZLEdBQWpCLENBQXZCO0FBQ0Q7O0FBRUQsU0FBS1gsT0FBTCxHQUFlVSxHQUFHLENBQUNWLE9BQW5CO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBlbnVtcyB9IGZyb20gJy4vZW51bXMnO1xuXG5jb25zdCBfZGVmYXVsdCA9IHtcbiAgLy8gYmxlbmRcbiAgYmxlbmQ6IGZhbHNlLFxuICBibGVuZFNlcDogZmFsc2UsXG4gIGJsZW5kQ29sb3I6IDB4ZmZmZmZmZmYsXG4gIGJsZW5kRXE6IGVudW1zLkJMRU5EX0ZVTkNfQURELFxuICBibGVuZEFscGhhRXE6IGVudW1zLkJMRU5EX0ZVTkNfQURELFxuICBibGVuZFNyYzogZW51bXMuQkxFTkRfT05FLFxuICBibGVuZERzdDogZW51bXMuQkxFTkRfWkVSTyxcbiAgYmxlbmRTcmNBbHBoYTogZW51bXMuQkxFTkRfT05FLFxuICBibGVuZERzdEFscGhhOiBlbnVtcy5CTEVORF9aRVJPLFxuXG4gIC8vIGRlcHRoXG4gIGRlcHRoVGVzdDogZmFsc2UsXG4gIGRlcHRoV3JpdGU6IGZhbHNlLFxuICBkZXB0aEZ1bmM6IGVudW1zLkRTX0ZVTkNfTEVTUyxcblxuICAvLyBzdGVuY2lsXG4gIHN0ZW5jaWxUZXN0OiBmYWxzZSxcbiAgc3RlbmNpbFNlcDogZmFsc2UsXG4gIHN0ZW5jaWxGdW5jRnJvbnQ6IGVudW1zLkRTX0ZVTkNfQUxXQVlTLFxuICBzdGVuY2lsUmVmRnJvbnQ6IDAsXG4gIHN0ZW5jaWxNYXNrRnJvbnQ6IDB4ZmYsXG4gIHN0ZW5jaWxGYWlsT3BGcm9udDogZW51bXMuU1RFTkNJTF9PUF9LRUVQLFxuICBzdGVuY2lsWkZhaWxPcEZyb250OiBlbnVtcy5TVEVOQ0lMX09QX0tFRVAsXG4gIHN0ZW5jaWxaUGFzc09wRnJvbnQ6IGVudW1zLlNURU5DSUxfT1BfS0VFUCxcbiAgc3RlbmNpbFdyaXRlTWFza0Zyb250OiAweGZmLFxuICBzdGVuY2lsRnVuY0JhY2s6IGVudW1zLkRTX0ZVTkNfQUxXQVlTLFxuICBzdGVuY2lsUmVmQmFjazogMCxcbiAgc3RlbmNpbE1hc2tCYWNrOiAweGZmLFxuICBzdGVuY2lsRmFpbE9wQmFjazogZW51bXMuU1RFTkNJTF9PUF9LRUVQLFxuICBzdGVuY2lsWkZhaWxPcEJhY2s6IGVudW1zLlNURU5DSUxfT1BfS0VFUCxcbiAgc3RlbmNpbFpQYXNzT3BCYWNrOiBlbnVtcy5TVEVOQ0lMX09QX0tFRVAsXG4gIHN0ZW5jaWxXcml0ZU1hc2tCYWNrOiAweGZmLFxuXG4gIC8vIGN1bGwtbW9kZVxuICBjdWxsTW9kZTogZW51bXMuQ1VMTF9CQUNLLFxuXG4gIC8vIHByaW1pdGl2ZS10eXBlXG4gIHByaW1pdGl2ZVR5cGU6IGVudW1zLlBUX1RSSUFOR0xFUyxcblxuICAvLyBiaW5kaW5nc1xuICBtYXhTdHJlYW06IC0xLFxuICB2ZXJ0ZXhCdWZmZXJzOiBbXSxcbiAgdmVydGV4QnVmZmVyT2Zmc2V0czogW10sXG4gIGluZGV4QnVmZmVyOiBudWxsLFxuICBtYXhUZXh0dXJlU2xvdDogLTEsXG4gIHRleHR1cmVVbml0czogW10sXG4gIHByb2dyYW06IG51bGwsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKGRldmljZSkge1xuICAgIC8vIGJpbmRpbmdzXG4gICAgdGhpcy52ZXJ0ZXhCdWZmZXJzID0gbmV3IEFycmF5KGRldmljZS5fY2Fwcy5tYXhWZXJ0ZXhTdHJlYW1zKTtcbiAgICB0aGlzLnZlcnRleEJ1ZmZlck9mZnNldHMgPSBuZXcgQXJyYXkoZGV2aWNlLl9jYXBzLm1heFZlcnRleFN0cmVhbXMpO1xuICAgIHRoaXMudGV4dHVyZVVuaXRzID0gbmV3IEFycmF5KGRldmljZS5fY2Fwcy5tYXhUZXh0dXJlVW5pdHMpO1xuXG4gICAgdGhpcy5zZXQoX2RlZmF1bHQpO1xuICB9XG5cbiAgc3RhdGljIGluaXREZWZhdWx0KGRldmljZSkge1xuICAgIF9kZWZhdWx0LnZlcnRleEJ1ZmZlcnMgPSBuZXcgQXJyYXkoZGV2aWNlLl9jYXBzLm1heFZlcnRleFN0cmVhbXMpO1xuICAgIF9kZWZhdWx0LnZlcnRleEJ1ZmZlck9mZnNldHMgPSBuZXcgQXJyYXkoZGV2aWNlLl9jYXBzLm1heFZlcnRleFN0cmVhbXMpO1xuICAgIF9kZWZhdWx0LnRleHR1cmVVbml0cyA9IG5ldyBBcnJheShkZXZpY2UuX2NhcHMubWF4VGV4dHVyZVVuaXRzKTtcbiAgfVxuXG4gIHJlc2V0ICgpIHtcbiAgICB0aGlzLnNldChfZGVmYXVsdCk7XG4gIH1cblxuICBzZXQgKGNweSkge1xuICAgIC8vIGJsZW5kaW5nXG4gICAgdGhpcy5ibGVuZCA9IGNweS5ibGVuZDtcbiAgICB0aGlzLmJsZW5kU2VwID0gY3B5LmJsZW5kU2VwO1xuICAgIHRoaXMuYmxlbmRDb2xvciA9IGNweS5ibGVuZENvbG9yO1xuICAgIHRoaXMuYmxlbmRFcSA9IGNweS5ibGVuZEVxO1xuICAgIHRoaXMuYmxlbmRBbHBoYUVxID0gY3B5LmJsZW5kQWxwaGFFcTtcbiAgICB0aGlzLmJsZW5kU3JjID0gY3B5LmJsZW5kU3JjO1xuICAgIHRoaXMuYmxlbmREc3QgPSBjcHkuYmxlbmREc3Q7XG4gICAgdGhpcy5ibGVuZFNyY0FscGhhID0gY3B5LmJsZW5kU3JjQWxwaGE7XG4gICAgdGhpcy5ibGVuZERzdEFscGhhID0gY3B5LmJsZW5kRHN0QWxwaGE7XG5cbiAgICAvLyBkZXB0aFxuICAgIHRoaXMuZGVwdGhUZXN0ID0gY3B5LmRlcHRoVGVzdDtcbiAgICB0aGlzLmRlcHRoV3JpdGUgPSBjcHkuZGVwdGhXcml0ZTtcbiAgICB0aGlzLmRlcHRoRnVuYyA9IGNweS5kZXB0aEZ1bmM7XG5cbiAgICAvLyBzdGVuY2lsXG4gICAgdGhpcy5zdGVuY2lsVGVzdCA9IGNweS5zdGVuY2lsVGVzdDtcbiAgICB0aGlzLnN0ZW5jaWxTZXAgPSBjcHkuc3RlbmNpbFNlcDtcbiAgICB0aGlzLnN0ZW5jaWxGdW5jRnJvbnQgPSBjcHkuc3RlbmNpbEZ1bmNGcm9udDtcbiAgICB0aGlzLnN0ZW5jaWxSZWZGcm9udCA9IGNweS5zdGVuY2lsUmVmRnJvbnQ7XG4gICAgdGhpcy5zdGVuY2lsTWFza0Zyb250ID0gY3B5LnN0ZW5jaWxNYXNrRnJvbnQ7XG4gICAgdGhpcy5zdGVuY2lsRmFpbE9wRnJvbnQgPSBjcHkuc3RlbmNpbEZhaWxPcEZyb250O1xuICAgIHRoaXMuc3RlbmNpbFpGYWlsT3BGcm9udCA9IGNweS5zdGVuY2lsWkZhaWxPcEZyb250O1xuICAgIHRoaXMuc3RlbmNpbFpQYXNzT3BGcm9udCA9IGNweS5zdGVuY2lsWlBhc3NPcEZyb250O1xuICAgIHRoaXMuc3RlbmNpbFdyaXRlTWFza0Zyb250ID0gY3B5LnN0ZW5jaWxXcml0ZU1hc2tGcm9udDtcbiAgICB0aGlzLnN0ZW5jaWxGdW5jQmFjayA9IGNweS5zdGVuY2lsRnVuY0JhY2s7XG4gICAgdGhpcy5zdGVuY2lsUmVmQmFjayA9IGNweS5zdGVuY2lsUmVmQmFjaztcbiAgICB0aGlzLnN0ZW5jaWxNYXNrQmFjayA9IGNweS5zdGVuY2lsTWFza0JhY2s7XG4gICAgdGhpcy5zdGVuY2lsRmFpbE9wQmFjayA9IGNweS5zdGVuY2lsRmFpbE9wQmFjaztcbiAgICB0aGlzLnN0ZW5jaWxaRmFpbE9wQmFjayA9IGNweS5zdGVuY2lsWkZhaWxPcEJhY2s7XG4gICAgdGhpcy5zdGVuY2lsWlBhc3NPcEJhY2sgPSBjcHkuc3RlbmNpbFpQYXNzT3BCYWNrO1xuICAgIHRoaXMuc3RlbmNpbFdyaXRlTWFza0JhY2sgPSBjcHkuc3RlbmNpbFdyaXRlTWFza0JhY2s7XG5cbiAgICAvLyBjdWxsLW1vZGVcbiAgICB0aGlzLmN1bGxNb2RlID0gY3B5LmN1bGxNb2RlO1xuXG4gICAgLy8gcHJpbWl0aXZlLXR5cGVcbiAgICB0aGlzLnByaW1pdGl2ZVR5cGUgPSBjcHkucHJpbWl0aXZlVHlwZTtcblxuICAgIC8vIGJ1ZmZlciBiaW5kaW5nc1xuICAgIHRoaXMubWF4U3RyZWFtID0gY3B5Lm1heFN0cmVhbTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNweS52ZXJ0ZXhCdWZmZXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICB0aGlzLnZlcnRleEJ1ZmZlcnNbaV0gPSBjcHkudmVydGV4QnVmZmVyc1tpXTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjcHkudmVydGV4QnVmZmVyT2Zmc2V0cy5sZW5ndGg7ICsraSkge1xuICAgICAgdGhpcy52ZXJ0ZXhCdWZmZXJPZmZzZXRzW2ldID0gY3B5LnZlcnRleEJ1ZmZlck9mZnNldHNbaV07XG4gICAgfVxuICAgIHRoaXMuaW5kZXhCdWZmZXIgPSBjcHkuaW5kZXhCdWZmZXI7XG5cbiAgICAvLyB0ZXh0dXJlIGJpbmRpbmdzXG4gICAgdGhpcy5tYXhUZXh0dXJlU2xvdCA9IGNweS5tYXhUZXh0dXJlU2xvdDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNweS50ZXh0dXJlVW5pdHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHRoaXMudGV4dHVyZVVuaXRzW2ldID0gY3B5LnRleHR1cmVVbml0c1tpXTtcbiAgICB9XG5cbiAgICB0aGlzLnByb2dyYW0gPSBjcHkucHJvZ3JhbTtcbiAgfVxufSJdfQ==