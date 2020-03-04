
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/spine-assembler.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _assembler = _interopRequireDefault(require("../../cocos2d/core/renderer/assembler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Skeleton = require('./Skeleton');

var spine = require('./lib/spine');

var RenderFlow = require('../../cocos2d/core/renderer/render-flow');

var VertexFormat = require('../../cocos2d/core/renderer/webgl/vertex-format');

var VFOneColor = VertexFormat.vfmtPosUvColor;
var VFTwoColor = VertexFormat.vfmtPosUvTwoColor;
var gfx = cc.gfx;
var FLAG_BATCH = 0x10;
var FLAG_TWO_COLOR = 0x01;
var _handleVal = 0x00;
var _quadTriangles = [0, 1, 2, 2, 3, 0];

var _slotColor = cc.color(0, 0, 255, 255);

var _boneColor = cc.color(255, 0, 0, 255);

var _originColor = cc.color(0, 255, 0, 255);

var _meshColor = cc.color(255, 255, 0, 255);

var _finalColor = null;
var _darkColor = null;
var _tempPos = null,
    _tempUv = null;

if (!CC_NATIVERENDERER) {
  _finalColor = new spine.Color(1, 1, 1, 1);
  _darkColor = new spine.Color(1, 1, 1, 1);
  _tempPos = new spine.Vector2();
  _tempUv = new spine.Vector2();
}

var _premultipliedAlpha;

var _multiplier;

var _slotRangeStart;

var _slotRangeEnd;

var _useTint;

var _debugSlots;

var _debugBones;

var _debugMesh;

var _nodeR, _nodeG, _nodeB, _nodeA;

var _finalColor32, _darkColor32;

var _vertexFormat;

var _perVertexSize;

var _perClipVertexSize;

var _vertexFloatCount = 0,
    _vertexCount = 0,
    _vertexFloatOffset = 0,
    _vertexOffset = 0,
    _indexCount = 0,
    _indexOffset = 0,
    _vfOffset = 0;

var _tempr, _tempg, _tempb;

var _inRange;

var _mustFlush;

var _x, _y, _m00, _m04, _m12, _m01, _m05, _m13;

var _r, _g, _b, _fr, _fg, _fb, _fa, _dr, _dg, _db, _da;

var _comp, _buffer, _renderer, _node, _needColor, _vertexEffect;

function _getSlotMaterial(tex, blendMode) {
  var src, dst;

  switch (blendMode) {
    case spine.BlendMode.Additive:
      src = _premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
      dst = cc.macro.ONE;
      break;

    case spine.BlendMode.Multiply:
      src = cc.macro.DST_COLOR;
      dst = cc.macro.ONE_MINUS_SRC_ALPHA;
      break;

    case spine.BlendMode.Screen:
      src = cc.macro.ONE;
      dst = cc.macro.ONE_MINUS_SRC_COLOR;
      break;

    case spine.BlendMode.Normal:
    default:
      src = _premultipliedAlpha ? cc.macro.ONE : cc.macro.SRC_ALPHA;
      dst = cc.macro.ONE_MINUS_SRC_ALPHA;
      break;
  }

  var useModel = !_comp.enableBatch;
  var baseMaterial = _comp._materials[0];
  if (!baseMaterial) return null; // The key use to find corresponding material

  var key = tex.getId() + src + dst + _useTint + useModel;
  var materialCache = _comp._materialCache;
  var material = materialCache[key];

  if (!material) {
    if (!materialCache.baseMaterial) {
      material = baseMaterial;
      materialCache.baseMaterial = baseMaterial;
    } else {
      material = cc.MaterialVariant.create(baseMaterial);
    }

    material.define('CC_USE_MODEL', useModel);
    material.define('USE_TINT', _useTint); // update texture

    material.setProperty('texture', tex); // update blend function

    material.setBlend(true, gfx.BLEND_FUNC_ADD, src, dst, gfx.BLEND_FUNC_ADD, src, dst);
    materialCache[key] = material;
  }

  return material;
}

function _handleColor(color) {
  // temp rgb has multiply 255, so need divide 255;
  _fa = color.fa * _nodeA;
  _multiplier = _premultipliedAlpha ? _fa / 255 : 1;
  _r = _nodeR * _multiplier;
  _g = _nodeG * _multiplier;
  _b = _nodeB * _multiplier;
  _fr = color.fr * _r;
  _fg = color.fg * _g;
  _fb = color.fb * _b;
  _finalColor32 = (_fa << 24 >>> 0) + (_fb << 16) + (_fg << 8) + _fr;
  _dr = color.dr * _r;
  _dg = color.dg * _g;
  _db = color.db * _b;
  _da = _premultipliedAlpha ? 255 : 0;
  _darkColor32 = (_da << 24 >>> 0) + (_db << 16) + (_dg << 8) + _dr;
}

function _spineColorToInt32(spineColor) {
  return (spineColor.a << 24 >>> 0) + (spineColor.b << 16) + (spineColor.g << 8) + spineColor.r;
}

var SpineAssembler =
/*#__PURE__*/
function (_Assembler) {
  _inheritsLoose(SpineAssembler, _Assembler);

  function SpineAssembler() {
    return _Assembler.apply(this, arguments) || this;
  }

  var _proto = SpineAssembler.prototype;

  _proto.updateRenderData = function updateRenderData(comp) {
    if (comp.isAnimationCached()) return;
    var skeleton = comp._skeleton;

    if (skeleton) {
      skeleton.updateWorldTransform();
    }
  };

  _proto.fillVertices = function fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot) {
    var vbuf = _buffer._vData,
        ibuf = _buffer._iData,
        uintVData = _buffer._uintVData;
    var offsetInfo;
    _finalColor.a = slotColor.a * attachmentColor.a * skeletonColor.a * _nodeA * 255;
    _multiplier = _premultipliedAlpha ? _finalColor.a : 255;
    _tempr = _nodeR * attachmentColor.r * skeletonColor.r * _multiplier;
    _tempg = _nodeG * attachmentColor.g * skeletonColor.g * _multiplier;
    _tempb = _nodeB * attachmentColor.b * skeletonColor.b * _multiplier;
    _finalColor.r = _tempr * slotColor.r;
    _finalColor.g = _tempg * slotColor.g;
    _finalColor.b = _tempb * slotColor.b;

    if (slot.darkColor == null) {
      _darkColor.set(0.0, 0.0, 0.0, 1.0);
    } else {
      _darkColor.r = slot.darkColor.r * _tempr;
      _darkColor.g = slot.darkColor.g * _tempg;
      _darkColor.b = slot.darkColor.b * _tempb;
    }

    _darkColor.a = _premultipliedAlpha ? 255 : 0;

    if (!clipper.isClipping()) {
      if (_vertexEffect) {
        for (var v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount; v < n; v += _perVertexSize) {
          _tempPos.x = vbuf[v];
          _tempPos.y = vbuf[v + 1];
          _tempUv.x = vbuf[v + 2];
          _tempUv.y = vbuf[v + 3];

          _vertexEffect.transform(_tempPos, _tempUv, _finalColor, _darkColor);

          vbuf[v] = _tempPos.x; // x

          vbuf[v + 1] = _tempPos.y; // y

          vbuf[v + 2] = _tempUv.x; // u

          vbuf[v + 3] = _tempUv.y; // v

          uintVData[v + 4] = _spineColorToInt32(_finalColor); // light color

          _useTint && (uintVData[v + 5] = _spineColorToInt32(_darkColor)); // dark color
        }
      } else {
        _finalColor32 = _spineColorToInt32(_finalColor);
        _darkColor32 = _spineColorToInt32(_darkColor);

        for (var _v = _vertexFloatOffset, _n = _vertexFloatOffset + _vertexFloatCount; _v < _n; _v += _perVertexSize) {
          uintVData[_v + 4] = _finalColor32; // light color

          _useTint && (uintVData[_v + 5] = _darkColor32); // dark color
        }
      }
    } else {
      var uvs = vbuf.subarray(_vertexFloatOffset + 2);
      clipper.clipTriangles(vbuf.subarray(_vertexFloatOffset), _vertexFloatCount, ibuf.subarray(_indexOffset), _indexCount, uvs, _finalColor, _darkColor, _useTint, _perVertexSize);
      var clippedVertices = new Float32Array(clipper.clippedVertices);
      var clippedTriangles = clipper.clippedTriangles; // insure capacity

      _indexCount = clippedTriangles.length;
      _vertexFloatCount = clippedVertices.length / _perClipVertexSize * _perVertexSize;
      offsetInfo = _buffer.request(_vertexFloatCount / _perVertexSize, _indexCount);
      _indexOffset = offsetInfo.indiceOffset, _vertexOffset = offsetInfo.vertexOffset, _vertexFloatOffset = offsetInfo.byteOffset >> 2;
      vbuf = _buffer._vData, ibuf = _buffer._iData;
      uintVData = _buffer._uintVData; // fill indices

      ibuf.set(clippedTriangles, _indexOffset); // fill vertices contain x y u v light color dark color

      if (_vertexEffect) {
        for (var _v2 = 0, _n2 = clippedVertices.length, offset = _vertexFloatOffset; _v2 < _n2; _v2 += _perClipVertexSize, offset += _perVertexSize) {
          _tempPos.x = clippedVertices[_v2];
          _tempPos.y = clippedVertices[_v2 + 1];

          _finalColor.set(clippedVertices[_v2 + 2], clippedVertices[_v2 + 3], clippedVertices[_v2 + 4], clippedVertices[_v2 + 5]);

          _tempUv.x = clippedVertices[_v2 + 6];
          _tempUv.y = clippedVertices[_v2 + 7];

          if (_useTint) {
            _darkColor.set(clippedVertices[_v2 + 8], clippedVertices[_v2 + 9], clippedVertices[_v2 + 10], clippedVertices[_v2 + 11]);
          } else {
            _darkColor.set(0, 0, 0, 0);
          }

          _vertexEffect.transform(_tempPos, _tempUv, _finalColor, _darkColor);

          vbuf[offset] = _tempPos.x; // x

          vbuf[offset + 1] = _tempPos.y; // y

          vbuf[offset + 2] = _tempUv.x; // u

          vbuf[offset + 3] = _tempUv.y; // v

          uintVData[offset + 4] = _spineColorToInt32(_finalColor);

          if (_useTint) {
            uintVData[offset + 5] = _spineColorToInt32(_darkColor);
          }
        }
      } else {
        for (var _v3 = 0, _n3 = clippedVertices.length, _offset = _vertexFloatOffset; _v3 < _n3; _v3 += _perClipVertexSize, _offset += _perVertexSize) {
          vbuf[_offset] = clippedVertices[_v3]; // x

          vbuf[_offset + 1] = clippedVertices[_v3 + 1]; // y

          vbuf[_offset + 2] = clippedVertices[_v3 + 6]; // u

          vbuf[_offset + 3] = clippedVertices[_v3 + 7]; // v

          _finalColor32 = (clippedVertices[_v3 + 5] << 24 >>> 0) + (clippedVertices[_v3 + 4] << 16) + (clippedVertices[_v3 + 3] << 8) + clippedVertices[_v3 + 2];
          uintVData[_offset + 4] = _finalColor32;

          if (_useTint) {
            _darkColor32 = (clippedVertices[_v3 + 11] << 24 >>> 0) + (clippedVertices[_v3 + 10] << 16) + (clippedVertices[_v3 + 9] << 8) + clippedVertices[_v3 + 8];
            uintVData[_offset + 5] = _darkColor32;
          }
        }
      }
    }
  };

  _proto.realTimeTraverse = function realTimeTraverse(worldMat) {
    var vbuf;
    var ibuf;
    var locSkeleton = _comp._skeleton;
    var skeletonColor = locSkeleton.color;
    var graphics = _comp._debugRenderer;
    var clipper = _comp._clipper;
    var material = null;
    var attachment, attachmentColor, slotColor, uvs, triangles;
    var isRegion, isMesh, isClip;
    var offsetInfo;
    var slot;
    var worldMatm;
    _slotRangeStart = _comp._startSlotIndex;
    _slotRangeEnd = _comp._endSlotIndex;
    _inRange = false;
    if (_slotRangeStart == -1) _inRange = true;
    _debugSlots = _comp.debugSlots;
    _debugBones = _comp.debugBones;
    _debugMesh = _comp.debugMesh;

    if (graphics && (_debugBones || _debugSlots || _debugMesh)) {
      graphics.clear();
      graphics.lineWidth = 2;
    } // x y u v r1 g1 b1 a1 r2 g2 b2 a2 or x y u v r g b a 


    _perClipVertexSize = _useTint ? 12 : 8;
    _vertexFloatCount = 0;
    _vertexFloatOffset = 0;
    _vertexOffset = 0;
    _indexCount = 0;
    _indexOffset = 0;

    for (var slotIdx = 0, slotCount = locSkeleton.drawOrder.length; slotIdx < slotCount; slotIdx++) {
      slot = locSkeleton.drawOrder[slotIdx];

      if (_slotRangeStart >= 0 && _slotRangeStart == slot.data.index) {
        _inRange = true;
      }

      if (!_inRange) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      if (_slotRangeEnd >= 0 && _slotRangeEnd == slot.data.index) {
        _inRange = false;
      }

      _vertexFloatCount = 0;
      _indexCount = 0;
      attachment = slot.getAttachment();

      if (!attachment) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      isRegion = attachment instanceof spine.RegionAttachment;
      isMesh = attachment instanceof spine.MeshAttachment;
      isClip = attachment instanceof spine.ClippingAttachment;

      if (isClip) {
        clipper.clipStart(slot, attachment);
        continue;
      }

      if (!isRegion && !isMesh) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      material = _getSlotMaterial(attachment.region.texture._texture, slot.data.blendMode);

      if (!material) {
        clipper.clipEndWithSlot(slot);
        continue;
      }

      if (_mustFlush || material.getHash() !== _renderer.material.getHash()) {
        _mustFlush = false;

        _renderer._flush();

        _renderer.node = _node;
        _renderer.material = material;
      }

      if (isRegion) {
        triangles = _quadTriangles; // insure capacity

        _vertexFloatCount = 4 * _perVertexSize;
        _indexCount = 6;
        offsetInfo = _buffer.request(4, 6);
        _indexOffset = offsetInfo.indiceOffset, _vertexOffset = offsetInfo.vertexOffset, _vertexFloatOffset = offsetInfo.byteOffset >> 2;
        vbuf = _buffer._vData, ibuf = _buffer._iData; // compute vertex and fill x y

        attachment.computeWorldVertices(slot.bone, vbuf, _vertexFloatOffset, _perVertexSize); // draw debug slots if enabled graphics

        if (graphics && _debugSlots) {
          graphics.strokeColor = _slotColor;
          graphics.moveTo(vbuf[_vertexFloatOffset], vbuf[_vertexFloatOffset + 1]);

          for (var ii = _vertexFloatOffset + _perVertexSize, nn = _vertexFloatOffset + _vertexFloatCount; ii < nn; ii += _perVertexSize) {
            graphics.lineTo(vbuf[ii], vbuf[ii + 1]);
          }

          graphics.close();
          graphics.stroke();
        }
      } else if (isMesh) {
        triangles = attachment.triangles; // insure capacity

        _vertexFloatCount = (attachment.worldVerticesLength >> 1) * _perVertexSize;
        _indexCount = triangles.length;
        offsetInfo = _buffer.request(_vertexFloatCount / _perVertexSize, _indexCount);
        _indexOffset = offsetInfo.indiceOffset, _vertexOffset = offsetInfo.vertexOffset, _vertexFloatOffset = offsetInfo.byteOffset >> 2;
        vbuf = _buffer._vData, ibuf = _buffer._iData; // compute vertex and fill x y

        attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, vbuf, _vertexFloatOffset, _perVertexSize); // draw debug mesh if enabled graphics

        if (graphics && _debugMesh) {
          graphics.strokeColor = _meshColor;

          for (var _ii = 0, _nn = triangles.length; _ii < _nn; _ii += 3) {
            var v1 = triangles[_ii] * _perVertexSize + _vertexFloatOffset;
            var v2 = triangles[_ii + 1] * _perVertexSize + _vertexFloatOffset;
            var v3 = triangles[_ii + 2] * _perVertexSize + _vertexFloatOffset;
            graphics.moveTo(vbuf[v1], vbuf[v1 + 1]);
            graphics.lineTo(vbuf[v2], vbuf[v2 + 1]);
            graphics.lineTo(vbuf[v3], vbuf[v3 + 1]);
            graphics.close();
            graphics.stroke();
          }
        }
      }

      if (_vertexFloatCount == 0 || _indexCount == 0) {
        clipper.clipEndWithSlot(slot);
        continue;
      } // fill indices


      ibuf.set(triangles, _indexOffset); // fill u v

      uvs = attachment.uvs;

      for (var v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount, u = 0; v < n; v += _perVertexSize, u += 2) {
        vbuf[v + 2] = uvs[u]; // u

        vbuf[v + 3] = uvs[u + 1]; // v
      }

      attachmentColor = attachment.color, slotColor = slot.color;
      this.fillVertices(skeletonColor, attachmentColor, slotColor, clipper, slot);

      if (_indexCount > 0) {
        for (var _ii2 = _indexOffset, _nn2 = _indexOffset + _indexCount; _ii2 < _nn2; _ii2++) {
          ibuf[_ii2] += _vertexOffset;
        }

        if (worldMat) {
          worldMatm = worldMat.m;
          _m00 = worldMatm[0];
          _m04 = worldMatm[4];
          _m12 = worldMatm[12];
          _m01 = worldMatm[1];
          _m05 = worldMatm[5];
          _m13 = worldMatm[13];

          for (var _ii3 = _vertexFloatOffset, _nn3 = _vertexFloatOffset + _vertexFloatCount; _ii3 < _nn3; _ii3 += _perVertexSize) {
            _x = vbuf[_ii3];
            _y = vbuf[_ii3 + 1];
            vbuf[_ii3] = _x * _m00 + _y * _m04 + _m12;
            vbuf[_ii3 + 1] = _x * _m01 + _y * _m05 + _m13;
          }
        }

        _buffer.adjust(_vertexFloatCount / _perVertexSize, _indexCount);
      }

      clipper.clipEndWithSlot(slot);
    }

    clipper.clipEnd();

    if (graphics && _debugBones) {
      var bone;
      graphics.strokeColor = _boneColor;
      graphics.fillColor = _slotColor; // Root bone color is same as slot color.

      for (var i = 0, _n4 = locSkeleton.bones.length; i < _n4; i++) {
        bone = locSkeleton.bones[i];
        var x = bone.data.length * bone.a + bone.worldX;
        var y = bone.data.length * bone.c + bone.worldY; // Bone lengths.

        graphics.moveTo(bone.worldX, bone.worldY);
        graphics.lineTo(x, y);
        graphics.stroke(); // Bone origins.

        graphics.circle(bone.worldX, bone.worldY, Math.PI * 1.5);
        graphics.fill();

        if (i === 0) {
          graphics.fillColor = _originColor;
        }
      }
    }
  };

  _proto.cacheTraverse = function cacheTraverse(worldMat) {
    var frame = _comp._curFrame;
    if (!frame) return;
    var segments = frame.segments;
    if (segments.length == 0) return;
    var vbuf, ibuf, uintbuf;
    var material;
    var offsetInfo;
    var vertices = frame.vertices;
    var indices = frame.indices;
    var worldMatm;
    var frameVFOffset = 0,
        frameIndexOffset = 0,
        segVFCount = 0;

    if (worldMat) {
      worldMatm = worldMat.m;
      _m00 = worldMatm[0];
      _m01 = worldMatm[1];
      _m04 = worldMatm[4];
      _m05 = worldMatm[5];
      _m12 = worldMatm[12];
      _m13 = worldMatm[13];
    }

    var justTranslate = _m00 === 1 && _m01 === 0 && _m04 === 0 && _m05 === 1;
    var needBatch = _handleVal & FLAG_BATCH;
    var calcTranslate = needBatch && justTranslate;
    var colorOffset = 0;
    var colors = frame.colors;
    var nowColor = colors[colorOffset++];
    var maxVFOffset = nowColor.vfOffset;

    _handleColor(nowColor);

    for (var i = 0, n = segments.length; i < n; i++) {
      var segInfo = segments[i];
      material = _getSlotMaterial(segInfo.tex, segInfo.blendMode);
      if (!material) continue;

      if (_mustFlush || material.getHash() !== _renderer.material.getHash()) {
        _mustFlush = false;

        _renderer._flush();

        _renderer.node = _node;
        _renderer.material = material;
      }

      _vertexCount = segInfo.vertexCount;
      _indexCount = segInfo.indexCount;
      offsetInfo = _buffer.request(_vertexCount, _indexCount);
      _indexOffset = offsetInfo.indiceOffset;
      _vertexOffset = offsetInfo.vertexOffset;
      _vfOffset = offsetInfo.byteOffset >> 2;
      vbuf = _buffer._vData;
      ibuf = _buffer._iData;
      uintbuf = _buffer._uintVData;

      for (var ii = _indexOffset, il = _indexOffset + _indexCount; ii < il; ii++) {
        ibuf[ii] = _vertexOffset + indices[frameIndexOffset++];
      }

      segVFCount = segInfo.vfCount;
      vbuf.set(vertices.subarray(frameVFOffset, frameVFOffset + segVFCount), _vfOffset);
      frameVFOffset += segVFCount;

      if (calcTranslate) {
        for (var _ii4 = _vfOffset, _il = _vfOffset + segVFCount; _ii4 < _il; _ii4 += 6) {
          vbuf[_ii4] += _m12;
          vbuf[_ii4 + 1] += _m13;
        }
      } else if (needBatch) {
        for (var _ii5 = _vfOffset, _il2 = _vfOffset + segVFCount; _ii5 < _il2; _ii5 += 6) {
          _x = vbuf[_ii5];
          _y = vbuf[_ii5 + 1];
          vbuf[_ii5] = _x * _m00 + _y * _m04 + _m12;
          vbuf[_ii5 + 1] = _x * _m01 + _y * _m05 + _m13;
        }
      }

      _buffer.adjust(_vertexCount, _indexCount);

      if (!_needColor) continue; // handle color

      var frameColorOffset = frameVFOffset - segVFCount;

      for (var _ii6 = _vfOffset + 4, _il3 = _vfOffset + 4 + segVFCount; _ii6 < _il3; _ii6 += 6, frameColorOffset += 6) {
        if (frameColorOffset >= maxVFOffset) {
          nowColor = colors[colorOffset++];

          _handleColor(nowColor);

          maxVFOffset = nowColor.vfOffset;
        }

        uintbuf[_ii6] = _finalColor32;
        uintbuf[_ii6 + 1] = _darkColor32;
      }
    }
  };

  _proto.fillBuffers = function fillBuffers(comp, renderer) {
    var node = comp.node;
    node._renderFlag |= RenderFlow.FLAG_UPDATE_RENDER_DATA;
    if (!comp._skeleton) return;
    var nodeColor = node._color;
    _nodeR = nodeColor.r / 255;
    _nodeG = nodeColor.g / 255;
    _nodeB = nodeColor.b / 255;
    _nodeA = nodeColor.a / 255;
    _useTint = comp.useTint || comp.isAnimationCached();
    _vertexFormat = _useTint ? VFTwoColor : VFOneColor; // x y u v color1 color2 or x y u v color

    _perVertexSize = _useTint ? 6 : 5;
    _node = comp.node;
    _buffer = renderer.getBuffer('spine', _vertexFormat);
    _renderer = renderer;
    _comp = comp;
    _mustFlush = true;
    _premultipliedAlpha = comp.premultipliedAlpha;
    _multiplier = 1.0;
    _handleVal = 0x00;
    _needColor = false;
    _vertexEffect = comp._effectDelegate && comp._effectDelegate._vertexEffect;

    if (nodeColor._val !== 0xffffffff || _premultipliedAlpha) {
      _needColor = true;
    }

    if (_useTint) {
      _handleVal |= FLAG_TWO_COLOR;
    }

    var worldMat = undefined;

    if (_comp.enableBatch) {
      worldMat = _node._worldMatrix;
      _mustFlush = false;
      _handleVal |= FLAG_BATCH;
    }

    if (comp.isAnimationCached()) {
      // Traverse input assembler.
      this.cacheTraverse(worldMat);
    } else {
      if (_vertexEffect) _vertexEffect.begin(comp._skeleton);
      this.realTimeTraverse(worldMat);
      if (_vertexEffect) _vertexEffect.end();
    } // sync attached node matrix


    renderer.worldMatDirty++;

    comp.attachUtil._syncAttachedNode(); // Clear temp var.


    _node = undefined;
    _buffer = undefined;
    _renderer = undefined;
    _comp = undefined;
    _vertexEffect = null;
  };

  _proto.postFillBuffers = function postFillBuffers(comp, renderer) {
    renderer.worldMatDirty--;
  };

  return SpineAssembler;
}(_assembler["default"]);

exports["default"] = SpineAssembler;

_assembler["default"].register(Skeleton, SpineAssembler);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwaW5lLWFzc2VtYmxlci5qcyJdLCJuYW1lcyI6WyJTa2VsZXRvbiIsInJlcXVpcmUiLCJzcGluZSIsIlJlbmRlckZsb3ciLCJWZXJ0ZXhGb3JtYXQiLCJWRk9uZUNvbG9yIiwidmZtdFBvc1V2Q29sb3IiLCJWRlR3b0NvbG9yIiwidmZtdFBvc1V2VHdvQ29sb3IiLCJnZngiLCJjYyIsIkZMQUdfQkFUQ0giLCJGTEFHX1RXT19DT0xPUiIsIl9oYW5kbGVWYWwiLCJfcXVhZFRyaWFuZ2xlcyIsIl9zbG90Q29sb3IiLCJjb2xvciIsIl9ib25lQ29sb3IiLCJfb3JpZ2luQ29sb3IiLCJfbWVzaENvbG9yIiwiX2ZpbmFsQ29sb3IiLCJfZGFya0NvbG9yIiwiX3RlbXBQb3MiLCJfdGVtcFV2IiwiQ0NfTkFUSVZFUkVOREVSRVIiLCJDb2xvciIsIlZlY3RvcjIiLCJfcHJlbXVsdGlwbGllZEFscGhhIiwiX211bHRpcGxpZXIiLCJfc2xvdFJhbmdlU3RhcnQiLCJfc2xvdFJhbmdlRW5kIiwiX3VzZVRpbnQiLCJfZGVidWdTbG90cyIsIl9kZWJ1Z0JvbmVzIiwiX2RlYnVnTWVzaCIsIl9ub2RlUiIsIl9ub2RlRyIsIl9ub2RlQiIsIl9ub2RlQSIsIl9maW5hbENvbG9yMzIiLCJfZGFya0NvbG9yMzIiLCJfdmVydGV4Rm9ybWF0IiwiX3BlclZlcnRleFNpemUiLCJfcGVyQ2xpcFZlcnRleFNpemUiLCJfdmVydGV4RmxvYXRDb3VudCIsIl92ZXJ0ZXhDb3VudCIsIl92ZXJ0ZXhGbG9hdE9mZnNldCIsIl92ZXJ0ZXhPZmZzZXQiLCJfaW5kZXhDb3VudCIsIl9pbmRleE9mZnNldCIsIl92Zk9mZnNldCIsIl90ZW1wciIsIl90ZW1wZyIsIl90ZW1wYiIsIl9pblJhbmdlIiwiX211c3RGbHVzaCIsIl94IiwiX3kiLCJfbTAwIiwiX20wNCIsIl9tMTIiLCJfbTAxIiwiX20wNSIsIl9tMTMiLCJfciIsIl9nIiwiX2IiLCJfZnIiLCJfZmciLCJfZmIiLCJfZmEiLCJfZHIiLCJfZGciLCJfZGIiLCJfZGEiLCJfY29tcCIsIl9idWZmZXIiLCJfcmVuZGVyZXIiLCJfbm9kZSIsIl9uZWVkQ29sb3IiLCJfdmVydGV4RWZmZWN0IiwiX2dldFNsb3RNYXRlcmlhbCIsInRleCIsImJsZW5kTW9kZSIsInNyYyIsImRzdCIsIkJsZW5kTW9kZSIsIkFkZGl0aXZlIiwibWFjcm8iLCJPTkUiLCJTUkNfQUxQSEEiLCJNdWx0aXBseSIsIkRTVF9DT0xPUiIsIk9ORV9NSU5VU19TUkNfQUxQSEEiLCJTY3JlZW4iLCJPTkVfTUlOVVNfU1JDX0NPTE9SIiwiTm9ybWFsIiwidXNlTW9kZWwiLCJlbmFibGVCYXRjaCIsImJhc2VNYXRlcmlhbCIsIl9tYXRlcmlhbHMiLCJrZXkiLCJnZXRJZCIsIm1hdGVyaWFsQ2FjaGUiLCJfbWF0ZXJpYWxDYWNoZSIsIm1hdGVyaWFsIiwiTWF0ZXJpYWxWYXJpYW50IiwiY3JlYXRlIiwiZGVmaW5lIiwic2V0UHJvcGVydHkiLCJzZXRCbGVuZCIsIkJMRU5EX0ZVTkNfQUREIiwiX2hhbmRsZUNvbG9yIiwiZmEiLCJmciIsImZnIiwiZmIiLCJkciIsImRnIiwiZGIiLCJfc3BpbmVDb2xvclRvSW50MzIiLCJzcGluZUNvbG9yIiwiYSIsImIiLCJnIiwiciIsIlNwaW5lQXNzZW1ibGVyIiwidXBkYXRlUmVuZGVyRGF0YSIsImNvbXAiLCJpc0FuaW1hdGlvbkNhY2hlZCIsInNrZWxldG9uIiwiX3NrZWxldG9uIiwidXBkYXRlV29ybGRUcmFuc2Zvcm0iLCJmaWxsVmVydGljZXMiLCJza2VsZXRvbkNvbG9yIiwiYXR0YWNobWVudENvbG9yIiwic2xvdENvbG9yIiwiY2xpcHBlciIsInNsb3QiLCJ2YnVmIiwiX3ZEYXRhIiwiaWJ1ZiIsIl9pRGF0YSIsInVpbnRWRGF0YSIsIl91aW50VkRhdGEiLCJvZmZzZXRJbmZvIiwiZGFya0NvbG9yIiwic2V0IiwiaXNDbGlwcGluZyIsInYiLCJuIiwieCIsInkiLCJ0cmFuc2Zvcm0iLCJ1dnMiLCJzdWJhcnJheSIsImNsaXBUcmlhbmdsZXMiLCJjbGlwcGVkVmVydGljZXMiLCJGbG9hdDMyQXJyYXkiLCJjbGlwcGVkVHJpYW5nbGVzIiwibGVuZ3RoIiwicmVxdWVzdCIsImluZGljZU9mZnNldCIsInZlcnRleE9mZnNldCIsImJ5dGVPZmZzZXQiLCJvZmZzZXQiLCJyZWFsVGltZVRyYXZlcnNlIiwid29ybGRNYXQiLCJsb2NTa2VsZXRvbiIsImdyYXBoaWNzIiwiX2RlYnVnUmVuZGVyZXIiLCJfY2xpcHBlciIsImF0dGFjaG1lbnQiLCJ0cmlhbmdsZXMiLCJpc1JlZ2lvbiIsImlzTWVzaCIsImlzQ2xpcCIsIndvcmxkTWF0bSIsIl9zdGFydFNsb3RJbmRleCIsIl9lbmRTbG90SW5kZXgiLCJkZWJ1Z1Nsb3RzIiwiZGVidWdCb25lcyIsImRlYnVnTWVzaCIsImNsZWFyIiwibGluZVdpZHRoIiwic2xvdElkeCIsInNsb3RDb3VudCIsImRyYXdPcmRlciIsImRhdGEiLCJpbmRleCIsImNsaXBFbmRXaXRoU2xvdCIsImdldEF0dGFjaG1lbnQiLCJSZWdpb25BdHRhY2htZW50IiwiTWVzaEF0dGFjaG1lbnQiLCJDbGlwcGluZ0F0dGFjaG1lbnQiLCJjbGlwU3RhcnQiLCJyZWdpb24iLCJ0ZXh0dXJlIiwiX3RleHR1cmUiLCJnZXRIYXNoIiwiX2ZsdXNoIiwibm9kZSIsImNvbXB1dGVXb3JsZFZlcnRpY2VzIiwiYm9uZSIsInN0cm9rZUNvbG9yIiwibW92ZVRvIiwiaWkiLCJubiIsImxpbmVUbyIsImNsb3NlIiwic3Ryb2tlIiwid29ybGRWZXJ0aWNlc0xlbmd0aCIsInYxIiwidjIiLCJ2MyIsInUiLCJtIiwiYWRqdXN0IiwiY2xpcEVuZCIsImZpbGxDb2xvciIsImkiLCJib25lcyIsIndvcmxkWCIsImMiLCJ3b3JsZFkiLCJjaXJjbGUiLCJNYXRoIiwiUEkiLCJmaWxsIiwiY2FjaGVUcmF2ZXJzZSIsImZyYW1lIiwiX2N1ckZyYW1lIiwic2VnbWVudHMiLCJ1aW50YnVmIiwidmVydGljZXMiLCJpbmRpY2VzIiwiZnJhbWVWRk9mZnNldCIsImZyYW1lSW5kZXhPZmZzZXQiLCJzZWdWRkNvdW50IiwianVzdFRyYW5zbGF0ZSIsIm5lZWRCYXRjaCIsImNhbGNUcmFuc2xhdGUiLCJjb2xvck9mZnNldCIsImNvbG9ycyIsIm5vd0NvbG9yIiwibWF4VkZPZmZzZXQiLCJ2Zk9mZnNldCIsInNlZ0luZm8iLCJ2ZXJ0ZXhDb3VudCIsImluZGV4Q291bnQiLCJpbCIsInZmQ291bnQiLCJmcmFtZUNvbG9yT2Zmc2V0IiwiZmlsbEJ1ZmZlcnMiLCJyZW5kZXJlciIsIl9yZW5kZXJGbGFnIiwiRkxBR19VUERBVEVfUkVOREVSX0RBVEEiLCJub2RlQ29sb3IiLCJfY29sb3IiLCJ1c2VUaW50IiwiZ2V0QnVmZmVyIiwicHJlbXVsdGlwbGllZEFscGhhIiwiX2VmZmVjdERlbGVnYXRlIiwiX3ZhbCIsInVuZGVmaW5lZCIsIl93b3JsZE1hdHJpeCIsImJlZ2luIiwiZW5kIiwid29ybGRNYXREaXJ0eSIsImF0dGFjaFV0aWwiLCJfc3luY0F0dGFjaGVkTm9kZSIsInBvc3RGaWxsQnVmZmVycyIsIkFzc2VtYmxlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7Ozs7QUFFQSxJQUFNQSxRQUFRLEdBQUdDLE9BQU8sQ0FBQyxZQUFELENBQXhCOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLGFBQUQsQ0FBckI7O0FBQ0EsSUFBTUUsVUFBVSxHQUFHRixPQUFPLENBQUMseUNBQUQsQ0FBMUI7O0FBQ0EsSUFBTUcsWUFBWSxHQUFHSCxPQUFPLENBQUMsaURBQUQsQ0FBNUI7O0FBQ0EsSUFBTUksVUFBVSxHQUFHRCxZQUFZLENBQUNFLGNBQWhDO0FBQ0EsSUFBTUMsVUFBVSxHQUFHSCxZQUFZLENBQUNJLGlCQUFoQztBQUNBLElBQU1DLEdBQUcsR0FBR0MsRUFBRSxDQUFDRCxHQUFmO0FBRUEsSUFBTUUsVUFBVSxHQUFHLElBQW5CO0FBQ0EsSUFBTUMsY0FBYyxHQUFHLElBQXZCO0FBRUEsSUFBSUMsVUFBVSxHQUFHLElBQWpCO0FBQ0EsSUFBSUMsY0FBYyxHQUFHLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBckI7O0FBQ0EsSUFBSUMsVUFBVSxHQUFHTCxFQUFFLENBQUNNLEtBQUgsQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLEdBQWYsRUFBb0IsR0FBcEIsQ0FBakI7O0FBQ0EsSUFBSUMsVUFBVSxHQUFHUCxFQUFFLENBQUNNLEtBQUgsQ0FBUyxHQUFULEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixHQUFwQixDQUFqQjs7QUFDQSxJQUFJRSxZQUFZLEdBQUdSLEVBQUUsQ0FBQ00sS0FBSCxDQUFTLENBQVQsRUFBWSxHQUFaLEVBQWlCLENBQWpCLEVBQW9CLEdBQXBCLENBQW5COztBQUNBLElBQUlHLFVBQVUsR0FBR1QsRUFBRSxDQUFDTSxLQUFILENBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsQ0FBbkIsRUFBc0IsR0FBdEIsQ0FBakI7O0FBRUEsSUFBSUksV0FBVyxHQUFHLElBQWxCO0FBQ0EsSUFBSUMsVUFBVSxHQUFHLElBQWpCO0FBQ0EsSUFBSUMsUUFBUSxHQUFHLElBQWY7QUFBQSxJQUFxQkMsT0FBTyxHQUFHLElBQS9COztBQUNBLElBQUksQ0FBQ0MsaUJBQUwsRUFBd0I7QUFDcEJKLEVBQUFBLFdBQVcsR0FBRyxJQUFJbEIsS0FBSyxDQUFDdUIsS0FBVixDQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixDQUF6QixDQUFkO0FBQ0FKLEVBQUFBLFVBQVUsR0FBRyxJQUFJbkIsS0FBSyxDQUFDdUIsS0FBVixDQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixDQUF6QixDQUFiO0FBQ0FILEVBQUFBLFFBQVEsR0FBRyxJQUFJcEIsS0FBSyxDQUFDd0IsT0FBVixFQUFYO0FBQ0FILEVBQUFBLE9BQU8sR0FBRyxJQUFJckIsS0FBSyxDQUFDd0IsT0FBVixFQUFWO0FBQ0g7O0FBRUQsSUFBSUMsbUJBQUo7O0FBQ0EsSUFBSUMsV0FBSjs7QUFDQSxJQUFJQyxlQUFKOztBQUNBLElBQUlDLGFBQUo7O0FBQ0EsSUFBSUMsUUFBSjs7QUFDQSxJQUFJQyxXQUFKOztBQUNBLElBQUlDLFdBQUo7O0FBQ0EsSUFBSUMsVUFBSjs7QUFDQSxJQUFJQyxNQUFKLEVBQ0lDLE1BREosRUFFSUMsTUFGSixFQUdJQyxNQUhKOztBQUlBLElBQUlDLGFBQUosRUFBbUJDLFlBQW5COztBQUNBLElBQUlDLGFBQUo7O0FBQ0EsSUFBSUMsY0FBSjs7QUFDQSxJQUFJQyxrQkFBSjs7QUFFQSxJQUFJQyxpQkFBaUIsR0FBRyxDQUF4QjtBQUFBLElBQTJCQyxZQUFZLEdBQUcsQ0FBMUM7QUFBQSxJQUE2Q0Msa0JBQWtCLEdBQUcsQ0FBbEU7QUFBQSxJQUFxRUMsYUFBYSxHQUFHLENBQXJGO0FBQUEsSUFDSUMsV0FBVyxHQUFHLENBRGxCO0FBQUEsSUFDcUJDLFlBQVksR0FBRyxDQURwQztBQUFBLElBQ3VDQyxTQUFTLEdBQUcsQ0FEbkQ7O0FBRUEsSUFBSUMsTUFBSixFQUFZQyxNQUFaLEVBQW9CQyxNQUFwQjs7QUFDQSxJQUFJQyxRQUFKOztBQUNBLElBQUlDLFVBQUo7O0FBQ0EsSUFBSUMsRUFBSixFQUFRQyxFQUFSLEVBQVlDLElBQVosRUFBa0JDLElBQWxCLEVBQXdCQyxJQUF4QixFQUE4QkMsSUFBOUIsRUFBb0NDLElBQXBDLEVBQTBDQyxJQUExQzs7QUFDQSxJQUFJQyxFQUFKLEVBQVFDLEVBQVIsRUFBWUMsRUFBWixFQUFnQkMsR0FBaEIsRUFBcUJDLEdBQXJCLEVBQTBCQyxHQUExQixFQUErQkMsR0FBL0IsRUFBb0NDLEdBQXBDLEVBQXlDQyxHQUF6QyxFQUE4Q0MsR0FBOUMsRUFBbURDLEdBQW5EOztBQUNBLElBQUlDLEtBQUosRUFBV0MsT0FBWCxFQUFvQkMsU0FBcEIsRUFBK0JDLEtBQS9CLEVBQXNDQyxVQUF0QyxFQUFrREMsYUFBbEQ7O0FBRUEsU0FBU0MsZ0JBQVQsQ0FBMkJDLEdBQTNCLEVBQWdDQyxTQUFoQyxFQUEyQztBQUN2QyxNQUFJQyxHQUFKLEVBQVNDLEdBQVQ7O0FBQ0EsVUFBUUYsU0FBUjtBQUNJLFNBQUtqRixLQUFLLENBQUNvRixTQUFOLENBQWdCQyxRQUFyQjtBQUNJSCxNQUFBQSxHQUFHLEdBQUd6RCxtQkFBbUIsR0FBR2pCLEVBQUUsQ0FBQzhFLEtBQUgsQ0FBU0MsR0FBWixHQUFrQi9FLEVBQUUsQ0FBQzhFLEtBQUgsQ0FBU0UsU0FBcEQ7QUFDQUwsTUFBQUEsR0FBRyxHQUFHM0UsRUFBRSxDQUFDOEUsS0FBSCxDQUFTQyxHQUFmO0FBQ0E7O0FBQ0osU0FBS3ZGLEtBQUssQ0FBQ29GLFNBQU4sQ0FBZ0JLLFFBQXJCO0FBQ0lQLE1BQUFBLEdBQUcsR0FBRzFFLEVBQUUsQ0FBQzhFLEtBQUgsQ0FBU0ksU0FBZjtBQUNBUCxNQUFBQSxHQUFHLEdBQUczRSxFQUFFLENBQUM4RSxLQUFILENBQVNLLG1CQUFmO0FBQ0E7O0FBQ0osU0FBSzNGLEtBQUssQ0FBQ29GLFNBQU4sQ0FBZ0JRLE1BQXJCO0FBQ0lWLE1BQUFBLEdBQUcsR0FBRzFFLEVBQUUsQ0FBQzhFLEtBQUgsQ0FBU0MsR0FBZjtBQUNBSixNQUFBQSxHQUFHLEdBQUczRSxFQUFFLENBQUM4RSxLQUFILENBQVNPLG1CQUFmO0FBQ0E7O0FBQ0osU0FBSzdGLEtBQUssQ0FBQ29GLFNBQU4sQ0FBZ0JVLE1BQXJCO0FBQ0E7QUFDSVosTUFBQUEsR0FBRyxHQUFHekQsbUJBQW1CLEdBQUdqQixFQUFFLENBQUM4RSxLQUFILENBQVNDLEdBQVosR0FBa0IvRSxFQUFFLENBQUM4RSxLQUFILENBQVNFLFNBQXBEO0FBQ0FMLE1BQUFBLEdBQUcsR0FBRzNFLEVBQUUsQ0FBQzhFLEtBQUgsQ0FBU0ssbUJBQWY7QUFDQTtBQWpCUjs7QUFvQkEsTUFBSUksUUFBUSxHQUFHLENBQUN0QixLQUFLLENBQUN1QixXQUF0QjtBQUNBLE1BQUlDLFlBQVksR0FBR3hCLEtBQUssQ0FBQ3lCLFVBQU4sQ0FBaUIsQ0FBakIsQ0FBbkI7QUFDQSxNQUFJLENBQUNELFlBQUwsRUFBbUIsT0FBTyxJQUFQLENBeEJvQixDQTBCdkM7O0FBQ0EsTUFBSUUsR0FBRyxHQUFHbkIsR0FBRyxDQUFDb0IsS0FBSixLQUFjbEIsR0FBZCxHQUFvQkMsR0FBcEIsR0FBMEJ0RCxRQUExQixHQUFxQ2tFLFFBQS9DO0FBQ0EsTUFBSU0sYUFBYSxHQUFHNUIsS0FBSyxDQUFDNkIsY0FBMUI7QUFDQSxNQUFJQyxRQUFRLEdBQUdGLGFBQWEsQ0FBQ0YsR0FBRCxDQUE1Qjs7QUFDQSxNQUFJLENBQUNJLFFBQUwsRUFBZTtBQUNYLFFBQUksQ0FBQ0YsYUFBYSxDQUFDSixZQUFuQixFQUFpQztBQUM3Qk0sTUFBQUEsUUFBUSxHQUFHTixZQUFYO0FBQ0FJLE1BQUFBLGFBQWEsQ0FBQ0osWUFBZCxHQUE2QkEsWUFBN0I7QUFDSCxLQUhELE1BR087QUFDSE0sTUFBQUEsUUFBUSxHQUFHL0YsRUFBRSxDQUFDZ0csZUFBSCxDQUFtQkMsTUFBbkIsQ0FBMEJSLFlBQTFCLENBQVg7QUFDSDs7QUFFRE0sSUFBQUEsUUFBUSxDQUFDRyxNQUFULENBQWdCLGNBQWhCLEVBQWdDWCxRQUFoQztBQUNBUSxJQUFBQSxRQUFRLENBQUNHLE1BQVQsQ0FBZ0IsVUFBaEIsRUFBNEI3RSxRQUE1QixFQVRXLENBVVg7O0FBQ0EwRSxJQUFBQSxRQUFRLENBQUNJLFdBQVQsQ0FBcUIsU0FBckIsRUFBZ0MzQixHQUFoQyxFQVhXLENBYVg7O0FBQ0F1QixJQUFBQSxRQUFRLENBQUNLLFFBQVQsQ0FDSSxJQURKLEVBRUlyRyxHQUFHLENBQUNzRyxjQUZSLEVBR0kzQixHQUhKLEVBR1NDLEdBSFQsRUFJSTVFLEdBQUcsQ0FBQ3NHLGNBSlIsRUFLSTNCLEdBTEosRUFLU0MsR0FMVDtBQU9Ba0IsSUFBQUEsYUFBYSxDQUFDRixHQUFELENBQWIsR0FBcUJJLFFBQXJCO0FBQ0g7O0FBQ0QsU0FBT0EsUUFBUDtBQUNIOztBQUVELFNBQVNPLFlBQVQsQ0FBdUJoRyxLQUF2QixFQUE4QjtBQUMxQjtBQUNBc0QsRUFBQUEsR0FBRyxHQUFHdEQsS0FBSyxDQUFDaUcsRUFBTixHQUFXM0UsTUFBakI7QUFDQVYsRUFBQUEsV0FBVyxHQUFHRCxtQkFBbUIsR0FBRzJDLEdBQUcsR0FBRyxHQUFULEdBQWUsQ0FBaEQ7QUFDQU4sRUFBQUEsRUFBRSxHQUFHN0IsTUFBTSxHQUFHUCxXQUFkO0FBQ0FxQyxFQUFBQSxFQUFFLEdBQUc3QixNQUFNLEdBQUdSLFdBQWQ7QUFDQXNDLEVBQUFBLEVBQUUsR0FBRzdCLE1BQU0sR0FBR1QsV0FBZDtBQUVBdUMsRUFBQUEsR0FBRyxHQUFHbkQsS0FBSyxDQUFDa0csRUFBTixHQUFXbEQsRUFBakI7QUFDQUksRUFBQUEsR0FBRyxHQUFHcEQsS0FBSyxDQUFDbUcsRUFBTixHQUFXbEQsRUFBakI7QUFDQUksRUFBQUEsR0FBRyxHQUFHckQsS0FBSyxDQUFDb0csRUFBTixHQUFXbEQsRUFBakI7QUFDQTNCLEVBQUFBLGFBQWEsR0FBRyxDQUFFK0IsR0FBRyxJQUFFLEVBQU4sS0FBYyxDQUFmLEtBQXFCRCxHQUFHLElBQUUsRUFBMUIsS0FBaUNELEdBQUcsSUFBRSxDQUF0QyxJQUEyQ0QsR0FBM0Q7QUFFQUksRUFBQUEsR0FBRyxHQUFHdkQsS0FBSyxDQUFDcUcsRUFBTixHQUFXckQsRUFBakI7QUFDQVEsRUFBQUEsR0FBRyxHQUFHeEQsS0FBSyxDQUFDc0csRUFBTixHQUFXckQsRUFBakI7QUFDQVEsRUFBQUEsR0FBRyxHQUFHekQsS0FBSyxDQUFDdUcsRUFBTixHQUFXckQsRUFBakI7QUFDQVEsRUFBQUEsR0FBRyxHQUFHL0MsbUJBQW1CLEdBQUcsR0FBSCxHQUFTLENBQWxDO0FBQ0FhLEVBQUFBLFlBQVksR0FBRyxDQUFFa0MsR0FBRyxJQUFFLEVBQU4sS0FBYyxDQUFmLEtBQXFCRCxHQUFHLElBQUUsRUFBMUIsS0FBaUNELEdBQUcsSUFBRSxDQUF0QyxJQUEyQ0QsR0FBMUQ7QUFDSDs7QUFFRCxTQUFTaUQsa0JBQVQsQ0FBNkJDLFVBQTdCLEVBQXlDO0FBQ3JDLFNBQU8sQ0FBRUEsVUFBVSxDQUFDQyxDQUFYLElBQWMsRUFBZixLQUF1QixDQUF4QixLQUE4QkQsVUFBVSxDQUFDRSxDQUFYLElBQWMsRUFBNUMsS0FBbURGLFVBQVUsQ0FBQ0csQ0FBWCxJQUFjLENBQWpFLElBQXNFSCxVQUFVLENBQUNJLENBQXhGO0FBQ0g7O0lBRW9CQzs7Ozs7Ozs7Ozs7U0FDakJDLG1CQUFBLDBCQUFrQkMsSUFBbEIsRUFBd0I7QUFDcEIsUUFBSUEsSUFBSSxDQUFDQyxpQkFBTCxFQUFKLEVBQThCO0FBQzlCLFFBQUlDLFFBQVEsR0FBR0YsSUFBSSxDQUFDRyxTQUFwQjs7QUFDQSxRQUFJRCxRQUFKLEVBQWM7QUFDVkEsTUFBQUEsUUFBUSxDQUFDRSxvQkFBVDtBQUNIO0FBQ0o7O1NBRURDLGVBQUEsc0JBQWNDLGFBQWQsRUFBNkJDLGVBQTdCLEVBQThDQyxTQUE5QyxFQUF5REMsT0FBekQsRUFBa0VDLElBQWxFLEVBQXdFO0FBRXBFLFFBQUlDLElBQUksR0FBRy9ELE9BQU8sQ0FBQ2dFLE1BQW5CO0FBQUEsUUFDSUMsSUFBSSxHQUFHakUsT0FBTyxDQUFDa0UsTUFEbkI7QUFBQSxRQUVJQyxTQUFTLEdBQUduRSxPQUFPLENBQUNvRSxVQUZ4QjtBQUdBLFFBQUlDLFVBQUo7QUFFQTdILElBQUFBLFdBQVcsQ0FBQ3NHLENBQVosR0FBZ0JjLFNBQVMsQ0FBQ2QsQ0FBVixHQUFjYSxlQUFlLENBQUNiLENBQTlCLEdBQWtDWSxhQUFhLENBQUNaLENBQWhELEdBQW9EcEYsTUFBcEQsR0FBNkQsR0FBN0U7QUFDQVYsSUFBQUEsV0FBVyxHQUFHRCxtQkFBbUIsR0FBRVAsV0FBVyxDQUFDc0csQ0FBZCxHQUFrQixHQUFuRDtBQUNBdkUsSUFBQUEsTUFBTSxHQUFHaEIsTUFBTSxHQUFHb0csZUFBZSxDQUFDVixDQUF6QixHQUE2QlMsYUFBYSxDQUFDVCxDQUEzQyxHQUErQ2pHLFdBQXhEO0FBQ0F3QixJQUFBQSxNQUFNLEdBQUdoQixNQUFNLEdBQUdtRyxlQUFlLENBQUNYLENBQXpCLEdBQTZCVSxhQUFhLENBQUNWLENBQTNDLEdBQStDaEcsV0FBeEQ7QUFDQXlCLElBQUFBLE1BQU0sR0FBR2hCLE1BQU0sR0FBR2tHLGVBQWUsQ0FBQ1osQ0FBekIsR0FBNkJXLGFBQWEsQ0FBQ1gsQ0FBM0MsR0FBK0MvRixXQUF4RDtBQUVBUixJQUFBQSxXQUFXLENBQUN5RyxDQUFaLEdBQWdCMUUsTUFBTSxHQUFHcUYsU0FBUyxDQUFDWCxDQUFuQztBQUNBekcsSUFBQUEsV0FBVyxDQUFDd0csQ0FBWixHQUFnQnhFLE1BQU0sR0FBR29GLFNBQVMsQ0FBQ1osQ0FBbkM7QUFDQXhHLElBQUFBLFdBQVcsQ0FBQ3VHLENBQVosR0FBZ0J0RSxNQUFNLEdBQUdtRixTQUFTLENBQUNiLENBQW5DOztBQUVBLFFBQUllLElBQUksQ0FBQ1EsU0FBTCxJQUFrQixJQUF0QixFQUE0QjtBQUN4QjdILE1BQUFBLFVBQVUsQ0FBQzhILEdBQVgsQ0FBZSxHQUFmLEVBQW9CLEdBQXBCLEVBQXlCLEdBQXpCLEVBQThCLEdBQTlCO0FBQ0gsS0FGRCxNQUVPO0FBQ0g5SCxNQUFBQSxVQUFVLENBQUN3RyxDQUFYLEdBQWVhLElBQUksQ0FBQ1EsU0FBTCxDQUFlckIsQ0FBZixHQUFtQjFFLE1BQWxDO0FBQ0E5QixNQUFBQSxVQUFVLENBQUN1RyxDQUFYLEdBQWVjLElBQUksQ0FBQ1EsU0FBTCxDQUFldEIsQ0FBZixHQUFtQnhFLE1BQWxDO0FBQ0EvQixNQUFBQSxVQUFVLENBQUNzRyxDQUFYLEdBQWVlLElBQUksQ0FBQ1EsU0FBTCxDQUFldkIsQ0FBZixHQUFtQnRFLE1BQWxDO0FBQ0g7O0FBQ0RoQyxJQUFBQSxVQUFVLENBQUNxRyxDQUFYLEdBQWUvRixtQkFBbUIsR0FBRyxHQUFILEdBQVMsQ0FBM0M7O0FBRUEsUUFBSSxDQUFDOEcsT0FBTyxDQUFDVyxVQUFSLEVBQUwsRUFBMkI7QUFDdkIsVUFBSXBFLGFBQUosRUFBbUI7QUFDZixhQUFLLElBQUlxRSxDQUFDLEdBQUd2RyxrQkFBUixFQUE0QndHLENBQUMsR0FBR3hHLGtCQUFrQixHQUFHRixpQkFBMUQsRUFBNkV5RyxDQUFDLEdBQUdDLENBQWpGLEVBQW9GRCxDQUFDLElBQUkzRyxjQUF6RixFQUF5RztBQUNyR3BCLFVBQUFBLFFBQVEsQ0FBQ2lJLENBQVQsR0FBYVosSUFBSSxDQUFDVSxDQUFELENBQWpCO0FBQ0EvSCxVQUFBQSxRQUFRLENBQUNrSSxDQUFULEdBQWFiLElBQUksQ0FBQ1UsQ0FBQyxHQUFHLENBQUwsQ0FBakI7QUFDQTlILFVBQUFBLE9BQU8sQ0FBQ2dJLENBQVIsR0FBWVosSUFBSSxDQUFDVSxDQUFDLEdBQUcsQ0FBTCxDQUFoQjtBQUNBOUgsVUFBQUEsT0FBTyxDQUFDaUksQ0FBUixHQUFZYixJQUFJLENBQUNVLENBQUMsR0FBRyxDQUFMLENBQWhCOztBQUNBckUsVUFBQUEsYUFBYSxDQUFDeUUsU0FBZCxDQUF3Qm5JLFFBQXhCLEVBQWtDQyxPQUFsQyxFQUEyQ0gsV0FBM0MsRUFBd0RDLFVBQXhEOztBQUVBc0gsVUFBQUEsSUFBSSxDQUFDVSxDQUFELENBQUosR0FBYy9ILFFBQVEsQ0FBQ2lJLENBQXZCLENBUHFHLENBT3BFOztBQUNqQ1osVUFBQUEsSUFBSSxDQUFDVSxDQUFDLEdBQUcsQ0FBTCxDQUFKLEdBQWMvSCxRQUFRLENBQUNrSSxDQUF2QixDQVJxRyxDQVFwRTs7QUFDakNiLFVBQUFBLElBQUksQ0FBQ1UsQ0FBQyxHQUFHLENBQUwsQ0FBSixHQUFjOUgsT0FBTyxDQUFDZ0ksQ0FBdEIsQ0FUcUcsQ0FTcEU7O0FBQ2pDWixVQUFBQSxJQUFJLENBQUNVLENBQUMsR0FBRyxDQUFMLENBQUosR0FBYzlILE9BQU8sQ0FBQ2lJLENBQXRCLENBVnFHLENBVXBFOztBQUNqQ1QsVUFBQUEsU0FBUyxDQUFDTSxDQUFDLEdBQUcsQ0FBTCxDQUFULEdBQW9CN0Isa0JBQWtCLENBQUNwRyxXQUFELENBQXRDLENBWHFHLENBVy9COztBQUN0RVcsVUFBQUEsUUFBUSxLQUFLZ0gsU0FBUyxDQUFDTSxDQUFDLEdBQUcsQ0FBTCxDQUFULEdBQW1CN0Isa0JBQWtCLENBQUNuRyxVQUFELENBQTFDLENBQVIsQ0FacUcsQ0FZL0I7QUFDekU7QUFDSixPQWZELE1BZU87QUFDSGtCLFFBQUFBLGFBQWEsR0FBR2lGLGtCQUFrQixDQUFDcEcsV0FBRCxDQUFsQztBQUNBb0IsUUFBQUEsWUFBWSxHQUFHZ0Ysa0JBQWtCLENBQUNuRyxVQUFELENBQWpDOztBQUVBLGFBQUssSUFBSWdJLEVBQUMsR0FBR3ZHLGtCQUFSLEVBQTRCd0csRUFBQyxHQUFHeEcsa0JBQWtCLEdBQUdGLGlCQUExRCxFQUE2RXlHLEVBQUMsR0FBR0MsRUFBakYsRUFBb0ZELEVBQUMsSUFBSTNHLGNBQXpGLEVBQXlHO0FBQ3JHcUcsVUFBQUEsU0FBUyxDQUFDTSxFQUFDLEdBQUcsQ0FBTCxDQUFULEdBQW9COUcsYUFBcEIsQ0FEcUcsQ0FDaEQ7O0FBQ3JEUixVQUFBQSxRQUFRLEtBQUtnSCxTQUFTLENBQUNNLEVBQUMsR0FBRyxDQUFMLENBQVQsR0FBb0I3RyxZQUF6QixDQUFSLENBRnFHLENBRWhEO0FBQ3hEO0FBQ0o7QUFDSixLQXpCRCxNQXlCTztBQUNILFVBQUlrSCxHQUFHLEdBQUdmLElBQUksQ0FBQ2dCLFFBQUwsQ0FBYzdHLGtCQUFrQixHQUFHLENBQW5DLENBQVY7QUFDQTJGLE1BQUFBLE9BQU8sQ0FBQ21CLGFBQVIsQ0FBc0JqQixJQUFJLENBQUNnQixRQUFMLENBQWM3RyxrQkFBZCxDQUF0QixFQUF5REYsaUJBQXpELEVBQTRFaUcsSUFBSSxDQUFDYyxRQUFMLENBQWMxRyxZQUFkLENBQTVFLEVBQXlHRCxXQUF6RyxFQUFzSDBHLEdBQXRILEVBQTJIdEksV0FBM0gsRUFBd0lDLFVBQXhJLEVBQW9KVSxRQUFwSixFQUE4SlcsY0FBOUo7QUFDQSxVQUFJbUgsZUFBZSxHQUFHLElBQUlDLFlBQUosQ0FBaUJyQixPQUFPLENBQUNvQixlQUF6QixDQUF0QjtBQUNBLFVBQUlFLGdCQUFnQixHQUFHdEIsT0FBTyxDQUFDc0IsZ0JBQS9CLENBSkcsQ0FNSDs7QUFDQS9HLE1BQUFBLFdBQVcsR0FBRytHLGdCQUFnQixDQUFDQyxNQUEvQjtBQUNBcEgsTUFBQUEsaUJBQWlCLEdBQUdpSCxlQUFlLENBQUNHLE1BQWhCLEdBQXlCckgsa0JBQXpCLEdBQThDRCxjQUFsRTtBQUVBdUcsTUFBQUEsVUFBVSxHQUFHckUsT0FBTyxDQUFDcUYsT0FBUixDQUFnQnJILGlCQUFpQixHQUFHRixjQUFwQyxFQUFvRE0sV0FBcEQsQ0FBYjtBQUNBQyxNQUFBQSxZQUFZLEdBQUdnRyxVQUFVLENBQUNpQixZQUExQixFQUNBbkgsYUFBYSxHQUFHa0csVUFBVSxDQUFDa0IsWUFEM0IsRUFFQXJILGtCQUFrQixHQUFHbUcsVUFBVSxDQUFDbUIsVUFBWCxJQUF5QixDQUY5QztBQUdBekIsTUFBQUEsSUFBSSxHQUFHL0QsT0FBTyxDQUFDZ0UsTUFBZixFQUNBQyxJQUFJLEdBQUdqRSxPQUFPLENBQUNrRSxNQURmO0FBRUFDLE1BQUFBLFNBQVMsR0FBR25FLE9BQU8sQ0FBQ29FLFVBQXBCLENBaEJHLENBa0JIOztBQUNBSCxNQUFBQSxJQUFJLENBQUNNLEdBQUwsQ0FBU1ksZ0JBQVQsRUFBMkI5RyxZQUEzQixFQW5CRyxDQXFCSDs7QUFDQSxVQUFJK0IsYUFBSixFQUFtQjtBQUNmLGFBQUssSUFBSXFFLEdBQUMsR0FBRyxDQUFSLEVBQVdDLEdBQUMsR0FBR08sZUFBZSxDQUFDRyxNQUEvQixFQUF1Q0ssTUFBTSxHQUFHdkgsa0JBQXJELEVBQXlFdUcsR0FBQyxHQUFHQyxHQUE3RSxFQUFnRkQsR0FBQyxJQUFJMUcsa0JBQUwsRUFBeUIwSCxNQUFNLElBQUkzSCxjQUFuSCxFQUFtSTtBQUMvSHBCLFVBQUFBLFFBQVEsQ0FBQ2lJLENBQVQsR0FBYU0sZUFBZSxDQUFDUixHQUFELENBQTVCO0FBQ0EvSCxVQUFBQSxRQUFRLENBQUNrSSxDQUFULEdBQWFLLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLENBQUwsQ0FBNUI7O0FBQ0FqSSxVQUFBQSxXQUFXLENBQUMrSCxHQUFaLENBQWdCVSxlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQS9CLEVBQXdDUSxlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQXZELEVBQWdFUSxlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQS9FLEVBQXdGUSxlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQXZHOztBQUNBOUgsVUFBQUEsT0FBTyxDQUFDZ0ksQ0FBUixHQUFZTSxlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQTNCO0FBQ0E5SCxVQUFBQSxPQUFPLENBQUNpSSxDQUFSLEdBQVlLLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLENBQUwsQ0FBM0I7O0FBQ0EsY0FBSXRILFFBQUosRUFBYztBQUNWVixZQUFBQSxVQUFVLENBQUM4SCxHQUFYLENBQWVVLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLENBQUwsQ0FBOUIsRUFBdUNRLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLENBQUwsQ0FBdEQsRUFBK0RRLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLEVBQUwsQ0FBOUUsRUFBd0ZRLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLEVBQUwsQ0FBdkc7QUFDSCxXQUZELE1BRU87QUFDSGhJLFlBQUFBLFVBQVUsQ0FBQzhILEdBQVgsQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCO0FBQ0g7O0FBQ0RuRSxVQUFBQSxhQUFhLENBQUN5RSxTQUFkLENBQXdCbkksUUFBeEIsRUFBa0NDLE9BQWxDLEVBQTJDSCxXQUEzQyxFQUF3REMsVUFBeEQ7O0FBRUFzSCxVQUFBQSxJQUFJLENBQUMwQixNQUFELENBQUosR0FBZS9JLFFBQVEsQ0FBQ2lJLENBQXhCLENBYitILENBYXhGOztBQUN2Q1osVUFBQUEsSUFBSSxDQUFDMEIsTUFBTSxHQUFHLENBQVYsQ0FBSixHQUFtQi9JLFFBQVEsQ0FBQ2tJLENBQTVCLENBZCtILENBY3hGOztBQUN2Q2IsVUFBQUEsSUFBSSxDQUFDMEIsTUFBTSxHQUFHLENBQVYsQ0FBSixHQUFtQjlJLE9BQU8sQ0FBQ2dJLENBQTNCLENBZitILENBZXhGOztBQUN2Q1osVUFBQUEsSUFBSSxDQUFDMEIsTUFBTSxHQUFHLENBQVYsQ0FBSixHQUFtQjlJLE9BQU8sQ0FBQ2lJLENBQTNCLENBaEIrSCxDQWdCeEY7O0FBQ3ZDVCxVQUFBQSxTQUFTLENBQUNzQixNQUFNLEdBQUcsQ0FBVixDQUFULEdBQXdCN0Msa0JBQWtCLENBQUNwRyxXQUFELENBQTFDOztBQUNBLGNBQUlXLFFBQUosRUFBYztBQUNWZ0gsWUFBQUEsU0FBUyxDQUFDc0IsTUFBTSxHQUFHLENBQVYsQ0FBVCxHQUF3QjdDLGtCQUFrQixDQUFDbkcsVUFBRCxDQUExQztBQUNIO0FBQ0o7QUFDSixPQXZCRCxNQXVCTztBQUNILGFBQUssSUFBSWdJLEdBQUMsR0FBRyxDQUFSLEVBQVdDLEdBQUMsR0FBR08sZUFBZSxDQUFDRyxNQUEvQixFQUF1Q0ssT0FBTSxHQUFHdkgsa0JBQXJELEVBQXlFdUcsR0FBQyxHQUFHQyxHQUE3RSxFQUFnRkQsR0FBQyxJQUFJMUcsa0JBQUwsRUFBeUIwSCxPQUFNLElBQUkzSCxjQUFuSCxFQUFtSTtBQUMvSGlHLFVBQUFBLElBQUksQ0FBQzBCLE9BQUQsQ0FBSixHQUFtQlIsZUFBZSxDQUFDUixHQUFELENBQWxDLENBRCtILENBQ2hGOztBQUMvQ1YsVUFBQUEsSUFBSSxDQUFDMEIsT0FBTSxHQUFHLENBQVYsQ0FBSixHQUFtQlIsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUFsQyxDQUYrSCxDQUVoRjs7QUFDL0NWLFVBQUFBLElBQUksQ0FBQzBCLE9BQU0sR0FBRyxDQUFWLENBQUosR0FBbUJSLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLENBQUwsQ0FBbEMsQ0FIK0gsQ0FHaEY7O0FBQy9DVixVQUFBQSxJQUFJLENBQUMwQixPQUFNLEdBQUcsQ0FBVixDQUFKLEdBQW1CUixlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQWxDLENBSitILENBSWhGOztBQUUvQzlHLFVBQUFBLGFBQWEsR0FBRyxDQUFFc0gsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUFmLElBQXdCLEVBQXpCLEtBQWlDLENBQWxDLEtBQXdDUSxlQUFlLENBQUNSLEdBQUMsR0FBRyxDQUFMLENBQWYsSUFBd0IsRUFBaEUsS0FBdUVRLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLENBQUwsQ0FBZixJQUF3QixDQUEvRixJQUFvR1EsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUFuSTtBQUNBTixVQUFBQSxTQUFTLENBQUNzQixPQUFNLEdBQUcsQ0FBVixDQUFULEdBQXdCOUgsYUFBeEI7O0FBRUEsY0FBSVIsUUFBSixFQUFjO0FBQ1ZTLFlBQUFBLFlBQVksR0FBRyxDQUFFcUgsZUFBZSxDQUFDUixHQUFDLEdBQUcsRUFBTCxDQUFmLElBQXlCLEVBQTFCLEtBQWtDLENBQW5DLEtBQXlDUSxlQUFlLENBQUNSLEdBQUMsR0FBRyxFQUFMLENBQWYsSUFBeUIsRUFBbEUsS0FBeUVRLGVBQWUsQ0FBQ1IsR0FBQyxHQUFHLENBQUwsQ0FBZixJQUF3QixDQUFqRyxJQUFzR1EsZUFBZSxDQUFDUixHQUFDLEdBQUcsQ0FBTCxDQUFwSTtBQUNBTixZQUFBQSxTQUFTLENBQUNzQixPQUFNLEdBQUcsQ0FBVixDQUFULEdBQXdCN0gsWUFBeEI7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNKOztTQUVEOEgsbUJBQUEsMEJBQWtCQyxRQUFsQixFQUE0QjtBQUN4QixRQUFJNUIsSUFBSjtBQUNBLFFBQUlFLElBQUo7QUFFQSxRQUFJMkIsV0FBVyxHQUFHN0YsS0FBSyxDQUFDd0QsU0FBeEI7QUFDQSxRQUFJRyxhQUFhLEdBQUdrQyxXQUFXLENBQUN4SixLQUFoQztBQUNBLFFBQUl5SixRQUFRLEdBQUc5RixLQUFLLENBQUMrRixjQUFyQjtBQUNBLFFBQUlqQyxPQUFPLEdBQUc5RCxLQUFLLENBQUNnRyxRQUFwQjtBQUNBLFFBQUlsRSxRQUFRLEdBQUcsSUFBZjtBQUNBLFFBQUltRSxVQUFKLEVBQWdCckMsZUFBaEIsRUFBaUNDLFNBQWpDLEVBQTRDa0IsR0FBNUMsRUFBaURtQixTQUFqRDtBQUNBLFFBQUlDLFFBQUosRUFBY0MsTUFBZCxFQUFzQkMsTUFBdEI7QUFDQSxRQUFJL0IsVUFBSjtBQUNBLFFBQUlQLElBQUo7QUFDQSxRQUFJdUMsU0FBSjtBQUVBcEosSUFBQUEsZUFBZSxHQUFHOEMsS0FBSyxDQUFDdUcsZUFBeEI7QUFDQXBKLElBQUFBLGFBQWEsR0FBRzZDLEtBQUssQ0FBQ3dHLGFBQXRCO0FBQ0E3SCxJQUFBQSxRQUFRLEdBQUcsS0FBWDtBQUNBLFFBQUl6QixlQUFlLElBQUksQ0FBQyxDQUF4QixFQUEyQnlCLFFBQVEsR0FBRyxJQUFYO0FBRTNCdEIsSUFBQUEsV0FBVyxHQUFHMkMsS0FBSyxDQUFDeUcsVUFBcEI7QUFDQW5KLElBQUFBLFdBQVcsR0FBRzBDLEtBQUssQ0FBQzBHLFVBQXBCO0FBQ0FuSixJQUFBQSxVQUFVLEdBQUd5QyxLQUFLLENBQUMyRyxTQUFuQjs7QUFDQSxRQUFJYixRQUFRLEtBQUt4SSxXQUFXLElBQUlELFdBQWYsSUFBOEJFLFVBQW5DLENBQVosRUFBNEQ7QUFDeER1SSxNQUFBQSxRQUFRLENBQUNjLEtBQVQ7QUFDQWQsTUFBQUEsUUFBUSxDQUFDZSxTQUFULEdBQXFCLENBQXJCO0FBQ0gsS0ExQnVCLENBNEJ4Qjs7O0FBQ0E3SSxJQUFBQSxrQkFBa0IsR0FBR1osUUFBUSxHQUFHLEVBQUgsR0FBUSxDQUFyQztBQUVBYSxJQUFBQSxpQkFBaUIsR0FBRyxDQUFwQjtBQUNBRSxJQUFBQSxrQkFBa0IsR0FBRyxDQUFyQjtBQUNBQyxJQUFBQSxhQUFhLEdBQUcsQ0FBaEI7QUFDQUMsSUFBQUEsV0FBVyxHQUFHLENBQWQ7QUFDQUMsSUFBQUEsWUFBWSxHQUFHLENBQWY7O0FBRUEsU0FBSyxJQUFJd0ksT0FBTyxHQUFHLENBQWQsRUFBaUJDLFNBQVMsR0FBR2xCLFdBQVcsQ0FBQ21CLFNBQVosQ0FBc0IzQixNQUF4RCxFQUFnRXlCLE9BQU8sR0FBR0MsU0FBMUUsRUFBcUZELE9BQU8sRUFBNUYsRUFBZ0c7QUFDNUYvQyxNQUFBQSxJQUFJLEdBQUc4QixXQUFXLENBQUNtQixTQUFaLENBQXNCRixPQUF0QixDQUFQOztBQUVBLFVBQUk1SixlQUFlLElBQUksQ0FBbkIsSUFBd0JBLGVBQWUsSUFBSTZHLElBQUksQ0FBQ2tELElBQUwsQ0FBVUMsS0FBekQsRUFBZ0U7QUFDNUR2SSxRQUFBQSxRQUFRLEdBQUcsSUFBWDtBQUNIOztBQUVELFVBQUksQ0FBQ0EsUUFBTCxFQUFlO0FBQ1htRixRQUFBQSxPQUFPLENBQUNxRCxlQUFSLENBQXdCcEQsSUFBeEI7QUFDQTtBQUNIOztBQUVELFVBQUk1RyxhQUFhLElBQUksQ0FBakIsSUFBc0JBLGFBQWEsSUFBSTRHLElBQUksQ0FBQ2tELElBQUwsQ0FBVUMsS0FBckQsRUFBNEQ7QUFDeER2SSxRQUFBQSxRQUFRLEdBQUcsS0FBWDtBQUNIOztBQUVEVixNQUFBQSxpQkFBaUIsR0FBRyxDQUFwQjtBQUNBSSxNQUFBQSxXQUFXLEdBQUcsQ0FBZDtBQUVBNEgsTUFBQUEsVUFBVSxHQUFHbEMsSUFBSSxDQUFDcUQsYUFBTCxFQUFiOztBQUNBLFVBQUksQ0FBQ25CLFVBQUwsRUFBaUI7QUFDYm5DLFFBQUFBLE9BQU8sQ0FBQ3FELGVBQVIsQ0FBd0JwRCxJQUF4QjtBQUNBO0FBQ0g7O0FBRURvQyxNQUFBQSxRQUFRLEdBQUdGLFVBQVUsWUFBWTFLLEtBQUssQ0FBQzhMLGdCQUF2QztBQUNBakIsTUFBQUEsTUFBTSxHQUFHSCxVQUFVLFlBQVkxSyxLQUFLLENBQUMrTCxjQUFyQztBQUNBakIsTUFBQUEsTUFBTSxHQUFHSixVQUFVLFlBQVkxSyxLQUFLLENBQUNnTSxrQkFBckM7O0FBRUEsVUFBSWxCLE1BQUosRUFBWTtBQUNSdkMsUUFBQUEsT0FBTyxDQUFDMEQsU0FBUixDQUFrQnpELElBQWxCLEVBQXdCa0MsVUFBeEI7QUFDQTtBQUNIOztBQUVELFVBQUksQ0FBQ0UsUUFBRCxJQUFhLENBQUNDLE1BQWxCLEVBQTBCO0FBQ3RCdEMsUUFBQUEsT0FBTyxDQUFDcUQsZUFBUixDQUF3QnBELElBQXhCO0FBQ0E7QUFDSDs7QUFFRGpDLE1BQUFBLFFBQVEsR0FBR3hCLGdCQUFnQixDQUFDMkYsVUFBVSxDQUFDd0IsTUFBWCxDQUFrQkMsT0FBbEIsQ0FBMEJDLFFBQTNCLEVBQXFDNUQsSUFBSSxDQUFDa0QsSUFBTCxDQUFVekcsU0FBL0MsQ0FBM0I7O0FBQ0EsVUFBSSxDQUFDc0IsUUFBTCxFQUFlO0FBQ1hnQyxRQUFBQSxPQUFPLENBQUNxRCxlQUFSLENBQXdCcEQsSUFBeEI7QUFDQTtBQUNIOztBQUVELFVBQUluRixVQUFVLElBQUlrRCxRQUFRLENBQUM4RixPQUFULE9BQXVCMUgsU0FBUyxDQUFDNEIsUUFBVixDQUFtQjhGLE9BQW5CLEVBQXpDLEVBQXVFO0FBQ25FaEosUUFBQUEsVUFBVSxHQUFHLEtBQWI7O0FBQ0FzQixRQUFBQSxTQUFTLENBQUMySCxNQUFWOztBQUNBM0gsUUFBQUEsU0FBUyxDQUFDNEgsSUFBVixHQUFpQjNILEtBQWpCO0FBQ0FELFFBQUFBLFNBQVMsQ0FBQzRCLFFBQVYsR0FBcUJBLFFBQXJCO0FBQ0g7O0FBRUQsVUFBSXFFLFFBQUosRUFBYztBQUVWRCxRQUFBQSxTQUFTLEdBQUcvSixjQUFaLENBRlUsQ0FJVjs7QUFDQThCLFFBQUFBLGlCQUFpQixHQUFHLElBQUlGLGNBQXhCO0FBQ0FNLFFBQUFBLFdBQVcsR0FBRyxDQUFkO0FBRUFpRyxRQUFBQSxVQUFVLEdBQUdyRSxPQUFPLENBQUNxRixPQUFSLENBQWdCLENBQWhCLEVBQW1CLENBQW5CLENBQWI7QUFDQWhILFFBQUFBLFlBQVksR0FBR2dHLFVBQVUsQ0FBQ2lCLFlBQTFCLEVBQ0FuSCxhQUFhLEdBQUdrRyxVQUFVLENBQUNrQixZQUQzQixFQUVBckgsa0JBQWtCLEdBQUdtRyxVQUFVLENBQUNtQixVQUFYLElBQXlCLENBRjlDO0FBR0F6QixRQUFBQSxJQUFJLEdBQUcvRCxPQUFPLENBQUNnRSxNQUFmLEVBQ0FDLElBQUksR0FBR2pFLE9BQU8sQ0FBQ2tFLE1BRGYsQ0FaVSxDQWVWOztBQUNBOEIsUUFBQUEsVUFBVSxDQUFDOEIsb0JBQVgsQ0FBZ0NoRSxJQUFJLENBQUNpRSxJQUFyQyxFQUEyQ2hFLElBQTNDLEVBQWlEN0Ysa0JBQWpELEVBQXFFSixjQUFyRSxFQWhCVSxDQWtCVjs7QUFDQSxZQUFJK0gsUUFBUSxJQUFJekksV0FBaEIsRUFBNkI7QUFDekJ5SSxVQUFBQSxRQUFRLENBQUNtQyxXQUFULEdBQXVCN0wsVUFBdkI7QUFDQTBKLFVBQUFBLFFBQVEsQ0FBQ29DLE1BQVQsQ0FBZ0JsRSxJQUFJLENBQUM3RixrQkFBRCxDQUFwQixFQUEwQzZGLElBQUksQ0FBQzdGLGtCQUFrQixHQUFHLENBQXRCLENBQTlDOztBQUNBLGVBQUssSUFBSWdLLEVBQUUsR0FBR2hLLGtCQUFrQixHQUFHSixjQUE5QixFQUE4Q3FLLEVBQUUsR0FBR2pLLGtCQUFrQixHQUFHRixpQkFBN0UsRUFBZ0drSyxFQUFFLEdBQUdDLEVBQXJHLEVBQXlHRCxFQUFFLElBQUlwSyxjQUEvRyxFQUErSDtBQUMzSCtILFlBQUFBLFFBQVEsQ0FBQ3VDLE1BQVQsQ0FBZ0JyRSxJQUFJLENBQUNtRSxFQUFELENBQXBCLEVBQTBCbkUsSUFBSSxDQUFDbUUsRUFBRSxHQUFHLENBQU4sQ0FBOUI7QUFDSDs7QUFDRHJDLFVBQUFBLFFBQVEsQ0FBQ3dDLEtBQVQ7QUFDQXhDLFVBQUFBLFFBQVEsQ0FBQ3lDLE1BQVQ7QUFDSDtBQUNKLE9BNUJELE1BNkJLLElBQUluQyxNQUFKLEVBQVk7QUFFYkYsUUFBQUEsU0FBUyxHQUFHRCxVQUFVLENBQUNDLFNBQXZCLENBRmEsQ0FJYjs7QUFDQWpJLFFBQUFBLGlCQUFpQixHQUFHLENBQUNnSSxVQUFVLENBQUN1QyxtQkFBWCxJQUFrQyxDQUFuQyxJQUF3Q3pLLGNBQTVEO0FBQ0FNLFFBQUFBLFdBQVcsR0FBRzZILFNBQVMsQ0FBQ2IsTUFBeEI7QUFFQWYsUUFBQUEsVUFBVSxHQUFHckUsT0FBTyxDQUFDcUYsT0FBUixDQUFnQnJILGlCQUFpQixHQUFHRixjQUFwQyxFQUFvRE0sV0FBcEQsQ0FBYjtBQUNBQyxRQUFBQSxZQUFZLEdBQUdnRyxVQUFVLENBQUNpQixZQUExQixFQUNBbkgsYUFBYSxHQUFHa0csVUFBVSxDQUFDa0IsWUFEM0IsRUFFQXJILGtCQUFrQixHQUFHbUcsVUFBVSxDQUFDbUIsVUFBWCxJQUF5QixDQUY5QztBQUdBekIsUUFBQUEsSUFBSSxHQUFHL0QsT0FBTyxDQUFDZ0UsTUFBZixFQUNBQyxJQUFJLEdBQUdqRSxPQUFPLENBQUNrRSxNQURmLENBWmEsQ0FlYjs7QUFDQThCLFFBQUFBLFVBQVUsQ0FBQzhCLG9CQUFYLENBQWdDaEUsSUFBaEMsRUFBc0MsQ0FBdEMsRUFBeUNrQyxVQUFVLENBQUN1QyxtQkFBcEQsRUFBeUV4RSxJQUF6RSxFQUErRTdGLGtCQUEvRSxFQUFtR0osY0FBbkcsRUFoQmEsQ0FrQmI7O0FBQ0EsWUFBSStILFFBQVEsSUFBSXZJLFVBQWhCLEVBQTRCO0FBQ3hCdUksVUFBQUEsUUFBUSxDQUFDbUMsV0FBVCxHQUF1QnpMLFVBQXZCOztBQUVBLGVBQUssSUFBSTJMLEdBQUUsR0FBRyxDQUFULEVBQVlDLEdBQUUsR0FBR2xDLFNBQVMsQ0FBQ2IsTUFBaEMsRUFBd0M4QyxHQUFFLEdBQUdDLEdBQTdDLEVBQWlERCxHQUFFLElBQUksQ0FBdkQsRUFBMEQ7QUFDdEQsZ0JBQUlNLEVBQUUsR0FBR3ZDLFNBQVMsQ0FBQ2lDLEdBQUQsQ0FBVCxHQUFnQnBLLGNBQWhCLEdBQWlDSSxrQkFBMUM7QUFDQSxnQkFBSXVLLEVBQUUsR0FBR3hDLFNBQVMsQ0FBQ2lDLEdBQUUsR0FBRyxDQUFOLENBQVQsR0FBb0JwSyxjQUFwQixHQUFxQ0ksa0JBQTlDO0FBQ0EsZ0JBQUl3SyxFQUFFLEdBQUd6QyxTQUFTLENBQUNpQyxHQUFFLEdBQUcsQ0FBTixDQUFULEdBQW9CcEssY0FBcEIsR0FBcUNJLGtCQUE5QztBQUVBMkgsWUFBQUEsUUFBUSxDQUFDb0MsTUFBVCxDQUFnQmxFLElBQUksQ0FBQ3lFLEVBQUQsQ0FBcEIsRUFBMEJ6RSxJQUFJLENBQUN5RSxFQUFFLEdBQUcsQ0FBTixDQUE5QjtBQUNBM0MsWUFBQUEsUUFBUSxDQUFDdUMsTUFBVCxDQUFnQnJFLElBQUksQ0FBQzBFLEVBQUQsQ0FBcEIsRUFBMEIxRSxJQUFJLENBQUMwRSxFQUFFLEdBQUcsQ0FBTixDQUE5QjtBQUNBNUMsWUFBQUEsUUFBUSxDQUFDdUMsTUFBVCxDQUFnQnJFLElBQUksQ0FBQzJFLEVBQUQsQ0FBcEIsRUFBMEIzRSxJQUFJLENBQUMyRSxFQUFFLEdBQUcsQ0FBTixDQUE5QjtBQUNBN0MsWUFBQUEsUUFBUSxDQUFDd0MsS0FBVDtBQUNBeEMsWUFBQUEsUUFBUSxDQUFDeUMsTUFBVDtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxVQUFJdEssaUJBQWlCLElBQUksQ0FBckIsSUFBMEJJLFdBQVcsSUFBSSxDQUE3QyxFQUFnRDtBQUM1Q3lGLFFBQUFBLE9BQU8sQ0FBQ3FELGVBQVIsQ0FBd0JwRCxJQUF4QjtBQUNBO0FBQ0gsT0F4SDJGLENBMEg1Rjs7O0FBQ0FHLE1BQUFBLElBQUksQ0FBQ00sR0FBTCxDQUFTMEIsU0FBVCxFQUFvQjVILFlBQXBCLEVBM0g0RixDQTZINUY7O0FBQ0F5RyxNQUFBQSxHQUFHLEdBQUdrQixVQUFVLENBQUNsQixHQUFqQjs7QUFDQSxXQUFLLElBQUlMLENBQUMsR0FBR3ZHLGtCQUFSLEVBQTRCd0csQ0FBQyxHQUFHeEcsa0JBQWtCLEdBQUdGLGlCQUFyRCxFQUF3RTJLLENBQUMsR0FBRyxDQUFqRixFQUFvRmxFLENBQUMsR0FBR0MsQ0FBeEYsRUFBMkZELENBQUMsSUFBSTNHLGNBQUwsRUFBcUI2SyxDQUFDLElBQUksQ0FBckgsRUFBd0g7QUFDcEg1RSxRQUFBQSxJQUFJLENBQUNVLENBQUMsR0FBRyxDQUFMLENBQUosR0FBY0ssR0FBRyxDQUFDNkQsQ0FBRCxDQUFqQixDQURvSCxDQUNwRjs7QUFDaEM1RSxRQUFBQSxJQUFJLENBQUNVLENBQUMsR0FBRyxDQUFMLENBQUosR0FBY0ssR0FBRyxDQUFDNkQsQ0FBQyxHQUFHLENBQUwsQ0FBakIsQ0FGb0gsQ0FFcEY7QUFDbkM7O0FBRURoRixNQUFBQSxlQUFlLEdBQUdxQyxVQUFVLENBQUM1SixLQUE3QixFQUNBd0gsU0FBUyxHQUFHRSxJQUFJLENBQUMxSCxLQURqQjtBQUdBLFdBQUtxSCxZQUFMLENBQWtCQyxhQUFsQixFQUFpQ0MsZUFBakMsRUFBa0RDLFNBQWxELEVBQTZEQyxPQUE3RCxFQUFzRUMsSUFBdEU7O0FBRUEsVUFBSTFGLFdBQVcsR0FBRyxDQUFsQixFQUFxQjtBQUNqQixhQUFLLElBQUk4SixJQUFFLEdBQUc3SixZQUFULEVBQXVCOEosSUFBRSxHQUFHOUosWUFBWSxHQUFHRCxXQUFoRCxFQUE2RDhKLElBQUUsR0FBR0MsSUFBbEUsRUFBc0VELElBQUUsRUFBeEUsRUFBNEU7QUFDeEVqRSxVQUFBQSxJQUFJLENBQUNpRSxJQUFELENBQUosSUFBWS9KLGFBQVo7QUFDSDs7QUFFRCxZQUFJd0gsUUFBSixFQUFjO0FBQ1ZVLFVBQUFBLFNBQVMsR0FBR1YsUUFBUSxDQUFDaUQsQ0FBckI7QUFDQTlKLFVBQUFBLElBQUksR0FBR3VILFNBQVMsQ0FBQyxDQUFELENBQWhCO0FBQ0F0SCxVQUFBQSxJQUFJLEdBQUdzSCxTQUFTLENBQUMsQ0FBRCxDQUFoQjtBQUNBckgsVUFBQUEsSUFBSSxHQUFHcUgsU0FBUyxDQUFDLEVBQUQsQ0FBaEI7QUFDQXBILFVBQUFBLElBQUksR0FBR29ILFNBQVMsQ0FBQyxDQUFELENBQWhCO0FBQ0FuSCxVQUFBQSxJQUFJLEdBQUdtSCxTQUFTLENBQUMsQ0FBRCxDQUFoQjtBQUNBbEgsVUFBQUEsSUFBSSxHQUFHa0gsU0FBUyxDQUFDLEVBQUQsQ0FBaEI7O0FBQ0EsZUFBSyxJQUFJNkIsSUFBRSxHQUFHaEssa0JBQVQsRUFBNkJpSyxJQUFFLEdBQUdqSyxrQkFBa0IsR0FBR0YsaUJBQTVELEVBQStFa0ssSUFBRSxHQUFHQyxJQUFwRixFQUF3RkQsSUFBRSxJQUFJcEssY0FBOUYsRUFBOEc7QUFDMUdjLFlBQUFBLEVBQUUsR0FBR21GLElBQUksQ0FBQ21FLElBQUQsQ0FBVDtBQUNBckosWUFBQUEsRUFBRSxHQUFHa0YsSUFBSSxDQUFDbUUsSUFBRSxHQUFHLENBQU4sQ0FBVDtBQUNBbkUsWUFBQUEsSUFBSSxDQUFDbUUsSUFBRCxDQUFKLEdBQVd0SixFQUFFLEdBQUdFLElBQUwsR0FBWUQsRUFBRSxHQUFHRSxJQUFqQixHQUF3QkMsSUFBbkM7QUFDQStFLFlBQUFBLElBQUksQ0FBQ21FLElBQUUsR0FBRyxDQUFOLENBQUosR0FBZXRKLEVBQUUsR0FBR0ssSUFBTCxHQUFZSixFQUFFLEdBQUdLLElBQWpCLEdBQXdCQyxJQUF2QztBQUNIO0FBQ0o7O0FBQ0RhLFFBQUFBLE9BQU8sQ0FBQzZJLE1BQVIsQ0FBZTdLLGlCQUFpQixHQUFHRixjQUFuQyxFQUFtRE0sV0FBbkQ7QUFDSDs7QUFFRHlGLE1BQUFBLE9BQU8sQ0FBQ3FELGVBQVIsQ0FBd0JwRCxJQUF4QjtBQUNIOztBQUVERCxJQUFBQSxPQUFPLENBQUNpRixPQUFSOztBQUVBLFFBQUlqRCxRQUFRLElBQUl4SSxXQUFoQixFQUE2QjtBQUN6QixVQUFJMEssSUFBSjtBQUNBbEMsTUFBQUEsUUFBUSxDQUFDbUMsV0FBVCxHQUF1QjNMLFVBQXZCO0FBQ0F3SixNQUFBQSxRQUFRLENBQUNrRCxTQUFULEdBQXFCNU0sVUFBckIsQ0FIeUIsQ0FHUTs7QUFFakMsV0FBSyxJQUFJNk0sQ0FBQyxHQUFHLENBQVIsRUFBV3RFLEdBQUMsR0FBR2tCLFdBQVcsQ0FBQ3FELEtBQVosQ0FBa0I3RCxNQUF0QyxFQUE4QzRELENBQUMsR0FBR3RFLEdBQWxELEVBQXFEc0UsQ0FBQyxFQUF0RCxFQUEwRDtBQUN0RGpCLFFBQUFBLElBQUksR0FBR25DLFdBQVcsQ0FBQ3FELEtBQVosQ0FBa0JELENBQWxCLENBQVA7QUFDQSxZQUFJckUsQ0FBQyxHQUFHb0QsSUFBSSxDQUFDZixJQUFMLENBQVU1QixNQUFWLEdBQW1CMkMsSUFBSSxDQUFDakYsQ0FBeEIsR0FBNEJpRixJQUFJLENBQUNtQixNQUF6QztBQUNBLFlBQUl0RSxDQUFDLEdBQUdtRCxJQUFJLENBQUNmLElBQUwsQ0FBVTVCLE1BQVYsR0FBbUIyQyxJQUFJLENBQUNvQixDQUF4QixHQUE0QnBCLElBQUksQ0FBQ3FCLE1BQXpDLENBSHNELENBS3REOztBQUNBdkQsUUFBQUEsUUFBUSxDQUFDb0MsTUFBVCxDQUFnQkYsSUFBSSxDQUFDbUIsTUFBckIsRUFBNkJuQixJQUFJLENBQUNxQixNQUFsQztBQUNBdkQsUUFBQUEsUUFBUSxDQUFDdUMsTUFBVCxDQUFnQnpELENBQWhCLEVBQW1CQyxDQUFuQjtBQUNBaUIsUUFBQUEsUUFBUSxDQUFDeUMsTUFBVCxHQVJzRCxDQVV0RDs7QUFDQXpDLFFBQUFBLFFBQVEsQ0FBQ3dELE1BQVQsQ0FBZ0J0QixJQUFJLENBQUNtQixNQUFyQixFQUE2Qm5CLElBQUksQ0FBQ3FCLE1BQWxDLEVBQTBDRSxJQUFJLENBQUNDLEVBQUwsR0FBVSxHQUFwRDtBQUNBMUQsUUFBQUEsUUFBUSxDQUFDMkQsSUFBVDs7QUFDQSxZQUFJUixDQUFDLEtBQUssQ0FBVixFQUFhO0FBQ1RuRCxVQUFBQSxRQUFRLENBQUNrRCxTQUFULEdBQXFCek0sWUFBckI7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7U0FFRG1OLGdCQUFBLHVCQUFlOUQsUUFBZixFQUF5QjtBQUVyQixRQUFJK0QsS0FBSyxHQUFHM0osS0FBSyxDQUFDNEosU0FBbEI7QUFDQSxRQUFJLENBQUNELEtBQUwsRUFBWTtBQUVaLFFBQUlFLFFBQVEsR0FBR0YsS0FBSyxDQUFDRSxRQUFyQjtBQUNBLFFBQUlBLFFBQVEsQ0FBQ3hFLE1BQVQsSUFBbUIsQ0FBdkIsRUFBMEI7QUFFMUIsUUFBSXJCLElBQUosRUFBVUUsSUFBVixFQUFnQjRGLE9BQWhCO0FBQ0EsUUFBSWhJLFFBQUo7QUFDQSxRQUFJd0MsVUFBSjtBQUNBLFFBQUl5RixRQUFRLEdBQUdKLEtBQUssQ0FBQ0ksUUFBckI7QUFDQSxRQUFJQyxPQUFPLEdBQUdMLEtBQUssQ0FBQ0ssT0FBcEI7QUFDQSxRQUFJMUQsU0FBSjtBQUVBLFFBQUkyRCxhQUFhLEdBQUcsQ0FBcEI7QUFBQSxRQUF1QkMsZ0JBQWdCLEdBQUcsQ0FBMUM7QUFBQSxRQUE2Q0MsVUFBVSxHQUFHLENBQTFEOztBQUNBLFFBQUl2RSxRQUFKLEVBQWM7QUFDVlUsTUFBQUEsU0FBUyxHQUFHVixRQUFRLENBQUNpRCxDQUFyQjtBQUNBOUosTUFBQUEsSUFBSSxHQUFHdUgsU0FBUyxDQUFDLENBQUQsQ0FBaEI7QUFDQXBILE1BQUFBLElBQUksR0FBR29ILFNBQVMsQ0FBQyxDQUFELENBQWhCO0FBQ0F0SCxNQUFBQSxJQUFJLEdBQUdzSCxTQUFTLENBQUMsQ0FBRCxDQUFoQjtBQUNBbkgsTUFBQUEsSUFBSSxHQUFHbUgsU0FBUyxDQUFDLENBQUQsQ0FBaEI7QUFDQXJILE1BQUFBLElBQUksR0FBR3FILFNBQVMsQ0FBQyxFQUFELENBQWhCO0FBQ0FsSCxNQUFBQSxJQUFJLEdBQUdrSCxTQUFTLENBQUMsRUFBRCxDQUFoQjtBQUNIOztBQUVELFFBQUk4RCxhQUFhLEdBQUdyTCxJQUFJLEtBQUssQ0FBVCxJQUFjRyxJQUFJLEtBQUssQ0FBdkIsSUFBNEJGLElBQUksS0FBSyxDQUFyQyxJQUEwQ0csSUFBSSxLQUFLLENBQXZFO0FBQ0EsUUFBSWtMLFNBQVMsR0FBSW5PLFVBQVUsR0FBR0YsVUFBOUI7QUFDQSxRQUFJc08sYUFBYSxHQUFHRCxTQUFTLElBQUlELGFBQWpDO0FBRUEsUUFBSUcsV0FBVyxHQUFHLENBQWxCO0FBQ0EsUUFBSUMsTUFBTSxHQUFHYixLQUFLLENBQUNhLE1BQW5CO0FBQ0EsUUFBSUMsUUFBUSxHQUFHRCxNQUFNLENBQUNELFdBQVcsRUFBWixDQUFyQjtBQUNBLFFBQUlHLFdBQVcsR0FBR0QsUUFBUSxDQUFDRSxRQUEzQjs7QUFDQXRJLElBQUFBLFlBQVksQ0FBQ29JLFFBQUQsQ0FBWjs7QUFFQSxTQUFLLElBQUl4QixDQUFDLEdBQUcsQ0FBUixFQUFXdEUsQ0FBQyxHQUFHa0YsUUFBUSxDQUFDeEUsTUFBN0IsRUFBcUM0RCxDQUFDLEdBQUd0RSxDQUF6QyxFQUE0Q3NFLENBQUMsRUFBN0MsRUFBaUQ7QUFDN0MsVUFBSTJCLE9BQU8sR0FBR2YsUUFBUSxDQUFDWixDQUFELENBQXRCO0FBQ0FuSCxNQUFBQSxRQUFRLEdBQUd4QixnQkFBZ0IsQ0FBQ3NLLE9BQU8sQ0FBQ3JLLEdBQVQsRUFBY3FLLE9BQU8sQ0FBQ3BLLFNBQXRCLENBQTNCO0FBQ0EsVUFBSSxDQUFDc0IsUUFBTCxFQUFlOztBQUVmLFVBQUlsRCxVQUFVLElBQUlrRCxRQUFRLENBQUM4RixPQUFULE9BQXVCMUgsU0FBUyxDQUFDNEIsUUFBVixDQUFtQjhGLE9BQW5CLEVBQXpDLEVBQXVFO0FBQ25FaEosUUFBQUEsVUFBVSxHQUFHLEtBQWI7O0FBQ0FzQixRQUFBQSxTQUFTLENBQUMySCxNQUFWOztBQUNBM0gsUUFBQUEsU0FBUyxDQUFDNEgsSUFBVixHQUFpQjNILEtBQWpCO0FBQ0FELFFBQUFBLFNBQVMsQ0FBQzRCLFFBQVYsR0FBcUJBLFFBQXJCO0FBQ0g7O0FBRUQ1RCxNQUFBQSxZQUFZLEdBQUcwTSxPQUFPLENBQUNDLFdBQXZCO0FBQ0F4TSxNQUFBQSxXQUFXLEdBQUd1TSxPQUFPLENBQUNFLFVBQXRCO0FBRUF4RyxNQUFBQSxVQUFVLEdBQUdyRSxPQUFPLENBQUNxRixPQUFSLENBQWdCcEgsWUFBaEIsRUFBOEJHLFdBQTlCLENBQWI7QUFDQUMsTUFBQUEsWUFBWSxHQUFHZ0csVUFBVSxDQUFDaUIsWUFBMUI7QUFDQW5ILE1BQUFBLGFBQWEsR0FBR2tHLFVBQVUsQ0FBQ2tCLFlBQTNCO0FBQ0FqSCxNQUFBQSxTQUFTLEdBQUcrRixVQUFVLENBQUNtQixVQUFYLElBQXlCLENBQXJDO0FBQ0F6QixNQUFBQSxJQUFJLEdBQUcvRCxPQUFPLENBQUNnRSxNQUFmO0FBQ0FDLE1BQUFBLElBQUksR0FBR2pFLE9BQU8sQ0FBQ2tFLE1BQWY7QUFDQTJGLE1BQUFBLE9BQU8sR0FBRzdKLE9BQU8sQ0FBQ29FLFVBQWxCOztBQUVBLFdBQUssSUFBSThELEVBQUUsR0FBRzdKLFlBQVQsRUFBdUJ5TSxFQUFFLEdBQUd6TSxZQUFZLEdBQUdELFdBQWhELEVBQTZEOEosRUFBRSxHQUFHNEMsRUFBbEUsRUFBc0U1QyxFQUFFLEVBQXhFLEVBQTRFO0FBQ3hFakUsUUFBQUEsSUFBSSxDQUFDaUUsRUFBRCxDQUFKLEdBQVcvSixhQUFhLEdBQUc0TCxPQUFPLENBQUNFLGdCQUFnQixFQUFqQixDQUFsQztBQUNIOztBQUVEQyxNQUFBQSxVQUFVLEdBQUdTLE9BQU8sQ0FBQ0ksT0FBckI7QUFDQWhILE1BQUFBLElBQUksQ0FBQ1EsR0FBTCxDQUFTdUYsUUFBUSxDQUFDL0UsUUFBVCxDQUFrQmlGLGFBQWxCLEVBQWlDQSxhQUFhLEdBQUdFLFVBQWpELENBQVQsRUFBdUU1TCxTQUF2RTtBQUNBMEwsTUFBQUEsYUFBYSxJQUFJRSxVQUFqQjs7QUFFQSxVQUFJRyxhQUFKLEVBQW1CO0FBQ2YsYUFBSyxJQUFJbkMsSUFBRSxHQUFHNUosU0FBVCxFQUFvQndNLEdBQUUsR0FBR3hNLFNBQVMsR0FBRzRMLFVBQTFDLEVBQXNEaEMsSUFBRSxHQUFHNEMsR0FBM0QsRUFBK0Q1QyxJQUFFLElBQUksQ0FBckUsRUFBd0U7QUFDcEVuRSxVQUFBQSxJQUFJLENBQUNtRSxJQUFELENBQUosSUFBWWxKLElBQVo7QUFDQStFLFVBQUFBLElBQUksQ0FBQ21FLElBQUUsR0FBRyxDQUFOLENBQUosSUFBZ0IvSSxJQUFoQjtBQUNIO0FBQ0osT0FMRCxNQUtPLElBQUlpTCxTQUFKLEVBQWU7QUFDbEIsYUFBSyxJQUFJbEMsSUFBRSxHQUFHNUosU0FBVCxFQUFvQndNLElBQUUsR0FBR3hNLFNBQVMsR0FBRzRMLFVBQTFDLEVBQXNEaEMsSUFBRSxHQUFHNEMsSUFBM0QsRUFBK0Q1QyxJQUFFLElBQUksQ0FBckUsRUFBd0U7QUFDcEV0SixVQUFBQSxFQUFFLEdBQUdtRixJQUFJLENBQUNtRSxJQUFELENBQVQ7QUFDQXJKLFVBQUFBLEVBQUUsR0FBR2tGLElBQUksQ0FBQ21FLElBQUUsR0FBRyxDQUFOLENBQVQ7QUFDQW5FLFVBQUFBLElBQUksQ0FBQ21FLElBQUQsQ0FBSixHQUFXdEosRUFBRSxHQUFHRSxJQUFMLEdBQVlELEVBQUUsR0FBR0UsSUFBakIsR0FBd0JDLElBQW5DO0FBQ0ErRSxVQUFBQSxJQUFJLENBQUNtRSxJQUFFLEdBQUcsQ0FBTixDQUFKLEdBQWV0SixFQUFFLEdBQUdLLElBQUwsR0FBWUosRUFBRSxHQUFHSyxJQUFqQixHQUF3QkMsSUFBdkM7QUFDSDtBQUNKOztBQUVEYSxNQUFBQSxPQUFPLENBQUM2SSxNQUFSLENBQWU1SyxZQUFmLEVBQTZCRyxXQUE3Qjs7QUFDQSxVQUFLLENBQUMrQixVQUFOLEVBQW1CLFNBOUMwQixDQWdEN0M7O0FBQ0EsVUFBSTZLLGdCQUFnQixHQUFHaEIsYUFBYSxHQUFHRSxVQUF2Qzs7QUFDQSxXQUFLLElBQUloQyxJQUFFLEdBQUc1SixTQUFTLEdBQUcsQ0FBckIsRUFBd0J3TSxJQUFFLEdBQUd4TSxTQUFTLEdBQUcsQ0FBWixHQUFnQjRMLFVBQWxELEVBQThEaEMsSUFBRSxHQUFHNEMsSUFBbkUsRUFBdUU1QyxJQUFFLElBQUksQ0FBTixFQUFTOEMsZ0JBQWdCLElBQUksQ0FBcEcsRUFBdUc7QUFDbkcsWUFBSUEsZ0JBQWdCLElBQUlQLFdBQXhCLEVBQXFDO0FBQ2pDRCxVQUFBQSxRQUFRLEdBQUdELE1BQU0sQ0FBQ0QsV0FBVyxFQUFaLENBQWpCOztBQUNBbEksVUFBQUEsWUFBWSxDQUFDb0ksUUFBRCxDQUFaOztBQUNBQyxVQUFBQSxXQUFXLEdBQUdELFFBQVEsQ0FBQ0UsUUFBdkI7QUFDSDs7QUFDRGIsUUFBQUEsT0FBTyxDQUFDM0IsSUFBRCxDQUFQLEdBQWN2SyxhQUFkO0FBQ0FrTSxRQUFBQSxPQUFPLENBQUMzQixJQUFFLEdBQUcsQ0FBTixDQUFQLEdBQWtCdEssWUFBbEI7QUFDSDtBQUNKO0FBQ0o7O1NBRURxTixjQUFBLHFCQUFhN0gsSUFBYixFQUFtQjhILFFBQW5CLEVBQTZCO0FBRXpCLFFBQUlyRCxJQUFJLEdBQUd6RSxJQUFJLENBQUN5RSxJQUFoQjtBQUNBQSxJQUFBQSxJQUFJLENBQUNzRCxXQUFMLElBQW9CNVAsVUFBVSxDQUFDNlAsdUJBQS9CO0FBQ0EsUUFBSSxDQUFDaEksSUFBSSxDQUFDRyxTQUFWLEVBQXFCO0FBRXJCLFFBQUk4SCxTQUFTLEdBQUd4RCxJQUFJLENBQUN5RCxNQUFyQjtBQUNBL04sSUFBQUEsTUFBTSxHQUFHOE4sU0FBUyxDQUFDcEksQ0FBVixHQUFjLEdBQXZCO0FBQ0F6RixJQUFBQSxNQUFNLEdBQUc2TixTQUFTLENBQUNySSxDQUFWLEdBQWMsR0FBdkI7QUFDQXZGLElBQUFBLE1BQU0sR0FBRzROLFNBQVMsQ0FBQ3RJLENBQVYsR0FBYyxHQUF2QjtBQUNBckYsSUFBQUEsTUFBTSxHQUFHMk4sU0FBUyxDQUFDdkksQ0FBVixHQUFjLEdBQXZCO0FBRUEzRixJQUFBQSxRQUFRLEdBQUdpRyxJQUFJLENBQUNtSSxPQUFMLElBQWdCbkksSUFBSSxDQUFDQyxpQkFBTCxFQUEzQjtBQUNBeEYsSUFBQUEsYUFBYSxHQUFHVixRQUFRLEdBQUV4QixVQUFGLEdBQWVGLFVBQXZDLENBYnlCLENBY3pCOztBQUNBcUMsSUFBQUEsY0FBYyxHQUFHWCxRQUFRLEdBQUcsQ0FBSCxHQUFPLENBQWhDO0FBRUErQyxJQUFBQSxLQUFLLEdBQUdrRCxJQUFJLENBQUN5RSxJQUFiO0FBQ0E3SCxJQUFBQSxPQUFPLEdBQUdrTCxRQUFRLENBQUNNLFNBQVQsQ0FBbUIsT0FBbkIsRUFBNEIzTixhQUE1QixDQUFWO0FBQ0FvQyxJQUFBQSxTQUFTLEdBQUdpTCxRQUFaO0FBQ0FuTCxJQUFBQSxLQUFLLEdBQUdxRCxJQUFSO0FBRUF6RSxJQUFBQSxVQUFVLEdBQUcsSUFBYjtBQUNBNUIsSUFBQUEsbUJBQW1CLEdBQUdxRyxJQUFJLENBQUNxSSxrQkFBM0I7QUFDQXpPLElBQUFBLFdBQVcsR0FBRyxHQUFkO0FBQ0FmLElBQUFBLFVBQVUsR0FBRyxJQUFiO0FBQ0FrRSxJQUFBQSxVQUFVLEdBQUcsS0FBYjtBQUNBQyxJQUFBQSxhQUFhLEdBQUdnRCxJQUFJLENBQUNzSSxlQUFMLElBQXdCdEksSUFBSSxDQUFDc0ksZUFBTCxDQUFxQnRMLGFBQTdEOztBQUVBLFFBQUlpTCxTQUFTLENBQUNNLElBQVYsS0FBbUIsVUFBbkIsSUFBaUM1TyxtQkFBckMsRUFBMEQ7QUFDdERvRCxNQUFBQSxVQUFVLEdBQUcsSUFBYjtBQUNIOztBQUVELFFBQUloRCxRQUFKLEVBQWM7QUFDVmxCLE1BQUFBLFVBQVUsSUFBSUQsY0FBZDtBQUNIOztBQUVELFFBQUkySixRQUFRLEdBQUdpRyxTQUFmOztBQUNBLFFBQUk3TCxLQUFLLENBQUN1QixXQUFWLEVBQXVCO0FBQ25CcUUsTUFBQUEsUUFBUSxHQUFHekYsS0FBSyxDQUFDMkwsWUFBakI7QUFDQWxOLE1BQUFBLFVBQVUsR0FBRyxLQUFiO0FBQ0ExQyxNQUFBQSxVQUFVLElBQUlGLFVBQWQ7QUFDSDs7QUFFRCxRQUFJcUgsSUFBSSxDQUFDQyxpQkFBTCxFQUFKLEVBQThCO0FBQzFCO0FBQ0EsV0FBS29HLGFBQUwsQ0FBbUI5RCxRQUFuQjtBQUNILEtBSEQsTUFHTztBQUNILFVBQUl2RixhQUFKLEVBQW1CQSxhQUFhLENBQUMwTCxLQUFkLENBQW9CMUksSUFBSSxDQUFDRyxTQUF6QjtBQUNuQixXQUFLbUMsZ0JBQUwsQ0FBc0JDLFFBQXRCO0FBQ0EsVUFBSXZGLGFBQUosRUFBbUJBLGFBQWEsQ0FBQzJMLEdBQWQ7QUFDdEIsS0FuRHdCLENBcUR6Qjs7O0FBQ0FiLElBQUFBLFFBQVEsQ0FBQ2MsYUFBVDs7QUFDQTVJLElBQUFBLElBQUksQ0FBQzZJLFVBQUwsQ0FBZ0JDLGlCQUFoQixHQXZEeUIsQ0F5RHpCOzs7QUFDQWhNLElBQUFBLEtBQUssR0FBRzBMLFNBQVI7QUFDQTVMLElBQUFBLE9BQU8sR0FBRzRMLFNBQVY7QUFDQTNMLElBQUFBLFNBQVMsR0FBRzJMLFNBQVo7QUFDQTdMLElBQUFBLEtBQUssR0FBRzZMLFNBQVI7QUFDQXhMLElBQUFBLGFBQWEsR0FBRyxJQUFoQjtBQUNIOztTQUVEK0wsa0JBQUEseUJBQWlCL0ksSUFBakIsRUFBdUI4SCxRQUF2QixFQUFpQztBQUM3QkEsSUFBQUEsUUFBUSxDQUFDYyxhQUFUO0FBQ0g7OztFQXBnQnVDSTs7OztBQXVnQjVDQSxzQkFBVUMsUUFBVixDQUFtQmpSLFFBQW5CLEVBQTZCOEgsY0FBN0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgQXNzZW1ibGVyIGZyb20gJy4uLy4uL2NvY29zMmQvY29yZS9yZW5kZXJlci9hc3NlbWJsZXInO1xuXG5jb25zdCBTa2VsZXRvbiA9IHJlcXVpcmUoJy4vU2tlbGV0b24nKTtcbmNvbnN0IHNwaW5lID0gcmVxdWlyZSgnLi9saWIvc3BpbmUnKTtcbmNvbnN0IFJlbmRlckZsb3cgPSByZXF1aXJlKCcuLi8uLi9jb2NvczJkL2NvcmUvcmVuZGVyZXIvcmVuZGVyLWZsb3cnKTtcbmNvbnN0IFZlcnRleEZvcm1hdCA9IHJlcXVpcmUoJy4uLy4uL2NvY29zMmQvY29yZS9yZW5kZXJlci93ZWJnbC92ZXJ0ZXgtZm9ybWF0JylcbmNvbnN0IFZGT25lQ29sb3IgPSBWZXJ0ZXhGb3JtYXQudmZtdFBvc1V2Q29sb3I7XG5jb25zdCBWRlR3b0NvbG9yID0gVmVydGV4Rm9ybWF0LnZmbXRQb3NVdlR3b0NvbG9yO1xuY29uc3QgZ2Z4ID0gY2MuZ2Z4O1xuXG5jb25zdCBGTEFHX0JBVENIID0gMHgxMDtcbmNvbnN0IEZMQUdfVFdPX0NPTE9SID0gMHgwMTtcblxubGV0IF9oYW5kbGVWYWwgPSAweDAwO1xubGV0IF9xdWFkVHJpYW5nbGVzID0gWzAsIDEsIDIsIDIsIDMsIDBdO1xubGV0IF9zbG90Q29sb3IgPSBjYy5jb2xvcigwLCAwLCAyNTUsIDI1NSk7XG5sZXQgX2JvbmVDb2xvciA9IGNjLmNvbG9yKDI1NSwgMCwgMCwgMjU1KTtcbmxldCBfb3JpZ2luQ29sb3IgPSBjYy5jb2xvcigwLCAyNTUsIDAsIDI1NSk7XG5sZXQgX21lc2hDb2xvciA9IGNjLmNvbG9yKDI1NSwgMjU1LCAwLCAyNTUpO1xuXG5sZXQgX2ZpbmFsQ29sb3IgPSBudWxsO1xubGV0IF9kYXJrQ29sb3IgPSBudWxsO1xubGV0IF90ZW1wUG9zID0gbnVsbCwgX3RlbXBVdiA9IG51bGw7XG5pZiAoIUNDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgX2ZpbmFsQ29sb3IgPSBuZXcgc3BpbmUuQ29sb3IoMSwgMSwgMSwgMSk7XG4gICAgX2RhcmtDb2xvciA9IG5ldyBzcGluZS5Db2xvcigxLCAxLCAxLCAxKTtcbiAgICBfdGVtcFBvcyA9IG5ldyBzcGluZS5WZWN0b3IyKCk7XG4gICAgX3RlbXBVdiA9IG5ldyBzcGluZS5WZWN0b3IyKCk7XG59XG5cbmxldCBfcHJlbXVsdGlwbGllZEFscGhhO1xubGV0IF9tdWx0aXBsaWVyO1xubGV0IF9zbG90UmFuZ2VTdGFydDtcbmxldCBfc2xvdFJhbmdlRW5kO1xubGV0IF91c2VUaW50O1xubGV0IF9kZWJ1Z1Nsb3RzO1xubGV0IF9kZWJ1Z0JvbmVzO1xubGV0IF9kZWJ1Z01lc2g7XG5sZXQgX25vZGVSLFxuICAgIF9ub2RlRyxcbiAgICBfbm9kZUIsXG4gICAgX25vZGVBO1xubGV0IF9maW5hbENvbG9yMzIsIF9kYXJrQ29sb3IzMjtcbmxldCBfdmVydGV4Rm9ybWF0O1xubGV0IF9wZXJWZXJ0ZXhTaXplO1xubGV0IF9wZXJDbGlwVmVydGV4U2l6ZTtcblxubGV0IF92ZXJ0ZXhGbG9hdENvdW50ID0gMCwgX3ZlcnRleENvdW50ID0gMCwgX3ZlcnRleEZsb2F0T2Zmc2V0ID0gMCwgX3ZlcnRleE9mZnNldCA9IDAsXG4gICAgX2luZGV4Q291bnQgPSAwLCBfaW5kZXhPZmZzZXQgPSAwLCBfdmZPZmZzZXQgPSAwO1xubGV0IF90ZW1wciwgX3RlbXBnLCBfdGVtcGI7XG5sZXQgX2luUmFuZ2U7XG5sZXQgX211c3RGbHVzaDtcbmxldCBfeCwgX3ksIF9tMDAsIF9tMDQsIF9tMTIsIF9tMDEsIF9tMDUsIF9tMTM7XG5sZXQgX3IsIF9nLCBfYiwgX2ZyLCBfZmcsIF9mYiwgX2ZhLCBfZHIsIF9kZywgX2RiLCBfZGE7XG5sZXQgX2NvbXAsIF9idWZmZXIsIF9yZW5kZXJlciwgX25vZGUsIF9uZWVkQ29sb3IsIF92ZXJ0ZXhFZmZlY3Q7XG5cbmZ1bmN0aW9uIF9nZXRTbG90TWF0ZXJpYWwgKHRleCwgYmxlbmRNb2RlKSB7XG4gICAgbGV0IHNyYywgZHN0O1xuICAgIHN3aXRjaCAoYmxlbmRNb2RlKSB7XG4gICAgICAgIGNhc2Ugc3BpbmUuQmxlbmRNb2RlLkFkZGl0aXZlOlxuICAgICAgICAgICAgc3JjID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IGNjLm1hY3JvLk9ORSA6IGNjLm1hY3JvLlNSQ19BTFBIQTtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNwaW5lLkJsZW5kTW9kZS5NdWx0aXBseTpcbiAgICAgICAgICAgIHNyYyA9IGNjLm1hY3JvLkRTVF9DT0xPUjtcbiAgICAgICAgICAgIGRzdCA9IGNjLm1hY3JvLk9ORV9NSU5VU19TUkNfQUxQSEE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBzcGluZS5CbGVuZE1vZGUuU2NyZWVuOlxuICAgICAgICAgICAgc3JjID0gY2MubWFjcm8uT05FO1xuICAgICAgICAgICAgZHN0ID0gY2MubWFjcm8uT05FX01JTlVTX1NSQ19DT0xPUjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHNwaW5lLkJsZW5kTW9kZS5Ob3JtYWw6XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBzcmMgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gY2MubWFjcm8uT05FIDogY2MubWFjcm8uU1JDX0FMUEhBO1xuICAgICAgICAgICAgZHN0ID0gY2MubWFjcm8uT05FX01JTlVTX1NSQ19BTFBIQTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGxldCB1c2VNb2RlbCA9ICFfY29tcC5lbmFibGVCYXRjaDtcbiAgICBsZXQgYmFzZU1hdGVyaWFsID0gX2NvbXAuX21hdGVyaWFsc1swXTtcbiAgICBpZiAoIWJhc2VNYXRlcmlhbCkgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBUaGUga2V5IHVzZSB0byBmaW5kIGNvcnJlc3BvbmRpbmcgbWF0ZXJpYWxcbiAgICBsZXQga2V5ID0gdGV4LmdldElkKCkgKyBzcmMgKyBkc3QgKyBfdXNlVGludCArIHVzZU1vZGVsO1xuICAgIGxldCBtYXRlcmlhbENhY2hlID0gX2NvbXAuX21hdGVyaWFsQ2FjaGU7XG4gICAgbGV0IG1hdGVyaWFsID0gbWF0ZXJpYWxDYWNoZVtrZXldO1xuICAgIGlmICghbWF0ZXJpYWwpIHtcbiAgICAgICAgaWYgKCFtYXRlcmlhbENhY2hlLmJhc2VNYXRlcmlhbCkge1xuICAgICAgICAgICAgbWF0ZXJpYWwgPSBiYXNlTWF0ZXJpYWw7XG4gICAgICAgICAgICBtYXRlcmlhbENhY2hlLmJhc2VNYXRlcmlhbCA9IGJhc2VNYXRlcmlhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gY2MuTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZShiYXNlTWF0ZXJpYWwpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBtYXRlcmlhbC5kZWZpbmUoJ0NDX1VTRV9NT0RFTCcsIHVzZU1vZGVsKTtcbiAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdVU0VfVElOVCcsIF91c2VUaW50KTtcbiAgICAgICAgLy8gdXBkYXRlIHRleHR1cmVcbiAgICAgICAgbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ3RleHR1cmUnLCB0ZXgpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBibGVuZCBmdW5jdGlvblxuICAgICAgICBtYXRlcmlhbC5zZXRCbGVuZChcbiAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICBnZnguQkxFTkRfRlVOQ19BREQsXG4gICAgICAgICAgICBzcmMsIGRzdCxcbiAgICAgICAgICAgIGdmeC5CTEVORF9GVU5DX0FERCxcbiAgICAgICAgICAgIHNyYywgZHN0XG4gICAgICAgICk7XG4gICAgICAgIG1hdGVyaWFsQ2FjaGVba2V5XSA9IG1hdGVyaWFsO1xuICAgIH1cbiAgICByZXR1cm4gbWF0ZXJpYWw7XG59XG5cbmZ1bmN0aW9uIF9oYW5kbGVDb2xvciAoY29sb3IpIHtcbiAgICAvLyB0ZW1wIHJnYiBoYXMgbXVsdGlwbHkgMjU1LCBzbyBuZWVkIGRpdmlkZSAyNTU7XG4gICAgX2ZhID0gY29sb3IuZmEgKiBfbm9kZUE7XG4gICAgX211bHRpcGxpZXIgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gX2ZhIC8gMjU1IDogMTtcbiAgICBfciA9IF9ub2RlUiAqIF9tdWx0aXBsaWVyO1xuICAgIF9nID0gX25vZGVHICogX211bHRpcGxpZXI7XG4gICAgX2IgPSBfbm9kZUIgKiBfbXVsdGlwbGllcjtcblxuICAgIF9mciA9IGNvbG9yLmZyICogX3I7XG4gICAgX2ZnID0gY29sb3IuZmcgKiBfZztcbiAgICBfZmIgPSBjb2xvci5mYiAqIF9iO1xuICAgIF9maW5hbENvbG9yMzIgPSAoKF9mYTw8MjQpID4+PiAwKSArIChfZmI8PDE2KSArIChfZmc8PDgpICsgX2ZyO1xuXG4gICAgX2RyID0gY29sb3IuZHIgKiBfcjtcbiAgICBfZGcgPSBjb2xvci5kZyAqIF9nO1xuICAgIF9kYiA9IGNvbG9yLmRiICogX2I7XG4gICAgX2RhID0gX3ByZW11bHRpcGxpZWRBbHBoYSA/IDI1NSA6IDA7XG4gICAgX2RhcmtDb2xvcjMyID0gKChfZGE8PDI0KSA+Pj4gMCkgKyAoX2RiPDwxNikgKyAoX2RnPDw4KSArIF9kcjtcbn1cblxuZnVuY3Rpb24gX3NwaW5lQ29sb3JUb0ludDMyIChzcGluZUNvbG9yKSB7XG4gICAgcmV0dXJuICgoc3BpbmVDb2xvci5hPDwyNCkgPj4+IDApICsgKHNwaW5lQ29sb3IuYjw8MTYpICsgKHNwaW5lQ29sb3IuZzw8OCkgKyBzcGluZUNvbG9yLnI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwaW5lQXNzZW1ibGVyIGV4dGVuZHMgQXNzZW1ibGVyIHtcbiAgICB1cGRhdGVSZW5kZXJEYXRhIChjb21wKSB7XG4gICAgICAgIGlmIChjb21wLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHJldHVybjtcbiAgICAgICAgbGV0IHNrZWxldG9uID0gY29tcC5fc2tlbGV0b247XG4gICAgICAgIGlmIChza2VsZXRvbikge1xuICAgICAgICAgICAgc2tlbGV0b24udXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbGxWZXJ0aWNlcyAoc2tlbGV0b25Db2xvciwgYXR0YWNobWVudENvbG9yLCBzbG90Q29sb3IsIGNsaXBwZXIsIHNsb3QpIHtcblxuICAgICAgICBsZXQgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhLFxuICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhLFxuICAgICAgICAgICAgdWludFZEYXRhID0gX2J1ZmZlci5fdWludFZEYXRhO1xuICAgICAgICBsZXQgb2Zmc2V0SW5mbztcblxuICAgICAgICBfZmluYWxDb2xvci5hID0gc2xvdENvbG9yLmEgKiBhdHRhY2htZW50Q29sb3IuYSAqIHNrZWxldG9uQ29sb3IuYSAqIF9ub2RlQSAqIDI1NTtcbiAgICAgICAgX211bHRpcGxpZXIgPSBfcHJlbXVsdGlwbGllZEFscGhhPyBfZmluYWxDb2xvci5hIDogMjU1O1xuICAgICAgICBfdGVtcHIgPSBfbm9kZVIgKiBhdHRhY2htZW50Q29sb3IuciAqIHNrZWxldG9uQ29sb3IuciAqIF9tdWx0aXBsaWVyO1xuICAgICAgICBfdGVtcGcgPSBfbm9kZUcgKiBhdHRhY2htZW50Q29sb3IuZyAqIHNrZWxldG9uQ29sb3IuZyAqIF9tdWx0aXBsaWVyO1xuICAgICAgICBfdGVtcGIgPSBfbm9kZUIgKiBhdHRhY2htZW50Q29sb3IuYiAqIHNrZWxldG9uQ29sb3IuYiAqIF9tdWx0aXBsaWVyO1xuICAgICAgICBcbiAgICAgICAgX2ZpbmFsQ29sb3IuciA9IF90ZW1wciAqIHNsb3RDb2xvci5yO1xuICAgICAgICBfZmluYWxDb2xvci5nID0gX3RlbXBnICogc2xvdENvbG9yLmc7XG4gICAgICAgIF9maW5hbENvbG9yLmIgPSBfdGVtcGIgKiBzbG90Q29sb3IuYjtcblxuICAgICAgICBpZiAoc2xvdC5kYXJrQ29sb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgX2RhcmtDb2xvci5zZXQoMC4wLCAwLjAsIDAuMCwgMS4wKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9kYXJrQ29sb3IuciA9IHNsb3QuZGFya0NvbG9yLnIgKiBfdGVtcHI7XG4gICAgICAgICAgICBfZGFya0NvbG9yLmcgPSBzbG90LmRhcmtDb2xvci5nICogX3RlbXBnO1xuICAgICAgICAgICAgX2RhcmtDb2xvci5iID0gc2xvdC5kYXJrQ29sb3IuYiAqIF90ZW1wYjtcbiAgICAgICAgfVxuICAgICAgICBfZGFya0NvbG9yLmEgPSBfcHJlbXVsdGlwbGllZEFscGhhID8gMjU1IDogMDtcblxuICAgICAgICBpZiAoIWNsaXBwZXIuaXNDbGlwcGluZygpKSB7XG4gICAgICAgICAgICBpZiAoX3ZlcnRleEVmZmVjdCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmVydGV4RmxvYXRPZmZzZXQsIG4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudDsgdiA8IG47IHYgKz0gX3BlclZlcnRleFNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBQb3MueCA9IHZidWZbdl07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wUG9zLnkgPSB2YnVmW3YgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgX3RlbXBVdi54ID0gdmJ1Zlt2ICsgMl07XG4gICAgICAgICAgICAgICAgICAgIF90ZW1wVXYueSA9IHZidWZbdiArIDNdO1xuICAgICAgICAgICAgICAgICAgICBfdmVydGV4RWZmZWN0LnRyYW5zZm9ybShfdGVtcFBvcywgX3RlbXBVdiwgX2ZpbmFsQ29sb3IsIF9kYXJrQ29sb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZidWZbdl0gICAgID0gX3RlbXBQb3MueDsgICAgICAgIC8vIHhcbiAgICAgICAgICAgICAgICAgICAgdmJ1Zlt2ICsgMV0gPSBfdGVtcFBvcy55OyAgICAgICAgLy8geVxuICAgICAgICAgICAgICAgICAgICB2YnVmW3YgKyAyXSA9IF90ZW1wVXYueDsgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgICAgIHZidWZbdiArIDNdID0gX3RlbXBVdi55OyAgICAgICAgIC8vIHZcbiAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW3YgKyA0XSAgPSBfc3BpbmVDb2xvclRvSW50MzIoX2ZpbmFsQ29sb3IpOyAgICAgICAgICAgICAgICAgIC8vIGxpZ2h0IGNvbG9yXG4gICAgICAgICAgICAgICAgICAgIF91c2VUaW50ICYmICh1aW50VkRhdGFbdiArIDVdID0gX3NwaW5lQ29sb3JUb0ludDMyKF9kYXJrQ29sb3IpKTsgICAgICAvLyBkYXJrIGNvbG9yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfZmluYWxDb2xvcjMyID0gX3NwaW5lQ29sb3JUb0ludDMyKF9maW5hbENvbG9yKTtcbiAgICAgICAgICAgICAgICBfZGFya0NvbG9yMzIgPSBfc3BpbmVDb2xvclRvSW50MzIoX2RhcmtDb2xvcik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCwgbiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF92ZXJ0ZXhGbG9hdENvdW50OyB2IDwgbjsgdiArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbdiArIDRdICA9IF9maW5hbENvbG9yMzI7ICAgICAgICAgICAgICAgICAgIC8vIGxpZ2h0IGNvbG9yXG4gICAgICAgICAgICAgICAgICAgIF91c2VUaW50ICYmICh1aW50VkRhdGFbdiArIDVdICA9IF9kYXJrQ29sb3IzMik7ICAgICAgLy8gZGFyayBjb2xvclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCB1dnMgPSB2YnVmLnN1YmFycmF5KF92ZXJ0ZXhGbG9hdE9mZnNldCArIDIpO1xuICAgICAgICAgICAgY2xpcHBlci5jbGlwVHJpYW5nbGVzKHZidWYuc3ViYXJyYXkoX3ZlcnRleEZsb2F0T2Zmc2V0KSwgX3ZlcnRleEZsb2F0Q291bnQsIGlidWYuc3ViYXJyYXkoX2luZGV4T2Zmc2V0KSwgX2luZGV4Q291bnQsIHV2cywgX2ZpbmFsQ29sb3IsIF9kYXJrQ29sb3IsIF91c2VUaW50LCBfcGVyVmVydGV4U2l6ZSk7XG4gICAgICAgICAgICBsZXQgY2xpcHBlZFZlcnRpY2VzID0gbmV3IEZsb2F0MzJBcnJheShjbGlwcGVyLmNsaXBwZWRWZXJ0aWNlcyk7XG4gICAgICAgICAgICBsZXQgY2xpcHBlZFRyaWFuZ2xlcyA9IGNsaXBwZXIuY2xpcHBlZFRyaWFuZ2xlcztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gaW5zdXJlIGNhcGFjaXR5XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IGNsaXBwZWRUcmlhbmdsZXMubGVuZ3RoO1xuICAgICAgICAgICAgX3ZlcnRleEZsb2F0Q291bnQgPSBjbGlwcGVkVmVydGljZXMubGVuZ3RoIC8gX3BlckNsaXBWZXJ0ZXhTaXplICogX3BlclZlcnRleFNpemU7XG5cbiAgICAgICAgICAgIG9mZnNldEluZm8gPSBfYnVmZmVyLnJlcXVlc3QoX3ZlcnRleEZsb2F0Q291bnQgLyBfcGVyVmVydGV4U2l6ZSwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgX2luZGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQsXG4gICAgICAgICAgICBfdmVydGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby52ZXJ0ZXhPZmZzZXQsXG4gICAgICAgICAgICBfdmVydGV4RmxvYXRPZmZzZXQgPSBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPj4gMjtcbiAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YSxcbiAgICAgICAgICAgIGlidWYgPSBfYnVmZmVyLl9pRGF0YTtcbiAgICAgICAgICAgIHVpbnRWRGF0YSA9IF9idWZmZXIuX3VpbnRWRGF0YTtcblxuICAgICAgICAgICAgLy8gZmlsbCBpbmRpY2VzXG4gICAgICAgICAgICBpYnVmLnNldChjbGlwcGVkVHJpYW5nbGVzLCBfaW5kZXhPZmZzZXQpO1xuXG4gICAgICAgICAgICAvLyBmaWxsIHZlcnRpY2VzIGNvbnRhaW4geCB5IHUgdiBsaWdodCBjb2xvciBkYXJrIGNvbG9yXG4gICAgICAgICAgICBpZiAoX3ZlcnRleEVmZmVjdCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSAwLCBuID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCwgb2Zmc2V0ID0gX3ZlcnRleEZsb2F0T2Zmc2V0OyB2IDwgbjsgdiArPSBfcGVyQ2xpcFZlcnRleFNpemUsIG9mZnNldCArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFBvcy54ID0gY2xpcHBlZFZlcnRpY2VzW3ZdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFBvcy55ID0gY2xpcHBlZFZlcnRpY2VzW3YgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgX2ZpbmFsQ29sb3Iuc2V0KGNsaXBwZWRWZXJ0aWNlc1t2ICsgMl0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgM10sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgNF0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgNV0pO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFV2LnggPSBjbGlwcGVkVmVydGljZXNbdiArIDZdO1xuICAgICAgICAgICAgICAgICAgICBfdGVtcFV2LnkgPSBjbGlwcGVkVmVydGljZXNbdiArIDddO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX3VzZVRpbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXJrQ29sb3Iuc2V0KGNsaXBwZWRWZXJ0aWNlc1t2ICsgOF0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgOV0sIGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTBdLCBjbGlwcGVkVmVydGljZXNbdiArIDExXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZGFya0NvbG9yLnNldCgwLCAwLCAwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfdmVydGV4RWZmZWN0LnRyYW5zZm9ybShfdGVtcFBvcywgX3RlbXBVdiwgX2ZpbmFsQ29sb3IsIF9kYXJrQ29sb3IpO1xuXG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0XSA9IF90ZW1wUG9zLng7ICAgICAgICAgICAgIC8vIHhcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAxXSA9IF90ZW1wUG9zLnk7ICAgICAgICAgLy8geVxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDJdID0gX3RlbXBVdi54OyAgICAgICAgICAvLyB1XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgM10gPSBfdGVtcFV2Lnk7ICAgICAgICAgIC8vIHZcbiAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW29mZnNldCArIDRdID0gX3NwaW5lQ29sb3JUb0ludDMyKF9maW5hbENvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF91c2VUaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1aW50VkRhdGFbb2Zmc2V0ICsgNV0gPSBfc3BpbmVDb2xvclRvSW50MzIoX2RhcmtDb2xvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSAwLCBuID0gY2xpcHBlZFZlcnRpY2VzLmxlbmd0aCwgb2Zmc2V0ID0gX3ZlcnRleEZsb2F0T2Zmc2V0OyB2IDwgbjsgdiArPSBfcGVyQ2xpcFZlcnRleFNpemUsIG9mZnNldCArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldF0gICAgID0gY2xpcHBlZFZlcnRpY2VzW3ZdOyAgICAgICAgIC8vIHhcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltvZmZzZXQgKyAxXSA9IGNsaXBwZWRWZXJ0aWNlc1t2ICsgMV07ICAgICAvLyB5XG4gICAgICAgICAgICAgICAgICAgIHZidWZbb2Zmc2V0ICsgMl0gPSBjbGlwcGVkVmVydGljZXNbdiArIDZdOyAgICAgLy8gdVxuICAgICAgICAgICAgICAgICAgICB2YnVmW29mZnNldCArIDNdID0gY2xpcHBlZFZlcnRpY2VzW3YgKyA3XTsgICAgIC8vIHZcblxuICAgICAgICAgICAgICAgICAgICBfZmluYWxDb2xvcjMyID0gKChjbGlwcGVkVmVydGljZXNbdiArIDVdPDwyNCkgPj4+IDApICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgNF08PDE2KSArIChjbGlwcGVkVmVydGljZXNbdiArIDNdPDw4KSArIGNsaXBwZWRWZXJ0aWNlc1t2ICsgMl07XG4gICAgICAgICAgICAgICAgICAgIHVpbnRWRGF0YVtvZmZzZXQgKyA0XSA9IF9maW5hbENvbG9yMzI7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKF91c2VUaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZGFya0NvbG9yMzIgPSAoKGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTFdPDwyNCkgPj4+IDApICsgKGNsaXBwZWRWZXJ0aWNlc1t2ICsgMTBdPDwxNikgKyAoY2xpcHBlZFZlcnRpY2VzW3YgKyA5XTw8OCkgKyBjbGlwcGVkVmVydGljZXNbdiArIDhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdWludFZEYXRhW29mZnNldCArIDVdID0gX2RhcmtDb2xvcjMyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVhbFRpbWVUcmF2ZXJzZSAod29ybGRNYXQpIHtcbiAgICAgICAgbGV0IHZidWY7XG4gICAgICAgIGxldCBpYnVmO1xuXG4gICAgICAgIGxldCBsb2NTa2VsZXRvbiA9IF9jb21wLl9za2VsZXRvbjtcbiAgICAgICAgbGV0IHNrZWxldG9uQ29sb3IgPSBsb2NTa2VsZXRvbi5jb2xvcjtcbiAgICAgICAgbGV0IGdyYXBoaWNzID0gX2NvbXAuX2RlYnVnUmVuZGVyZXI7XG4gICAgICAgIGxldCBjbGlwcGVyID0gX2NvbXAuX2NsaXBwZXI7XG4gICAgICAgIGxldCBtYXRlcmlhbCA9IG51bGw7XG4gICAgICAgIGxldCBhdHRhY2htZW50LCBhdHRhY2htZW50Q29sb3IsIHNsb3RDb2xvciwgdXZzLCB0cmlhbmdsZXM7XG4gICAgICAgIGxldCBpc1JlZ2lvbiwgaXNNZXNoLCBpc0NsaXA7XG4gICAgICAgIGxldCBvZmZzZXRJbmZvO1xuICAgICAgICBsZXQgc2xvdDtcbiAgICAgICAgbGV0IHdvcmxkTWF0bTtcblxuICAgICAgICBfc2xvdFJhbmdlU3RhcnQgPSBfY29tcC5fc3RhcnRTbG90SW5kZXg7XG4gICAgICAgIF9zbG90UmFuZ2VFbmQgPSBfY29tcC5fZW5kU2xvdEluZGV4O1xuICAgICAgICBfaW5SYW5nZSA9IGZhbHNlO1xuICAgICAgICBpZiAoX3Nsb3RSYW5nZVN0YXJ0ID09IC0xKSBfaW5SYW5nZSA9IHRydWU7XG5cbiAgICAgICAgX2RlYnVnU2xvdHMgPSBfY29tcC5kZWJ1Z1Nsb3RzO1xuICAgICAgICBfZGVidWdCb25lcyA9IF9jb21wLmRlYnVnQm9uZXM7XG4gICAgICAgIF9kZWJ1Z01lc2ggPSBfY29tcC5kZWJ1Z01lc2g7XG4gICAgICAgIGlmIChncmFwaGljcyAmJiAoX2RlYnVnQm9uZXMgfHwgX2RlYnVnU2xvdHMgfHwgX2RlYnVnTWVzaCkpIHtcbiAgICAgICAgICAgIGdyYXBoaWNzLmNsZWFyKCk7XG4gICAgICAgICAgICBncmFwaGljcy5saW5lV2lkdGggPSAyO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIC8vIHggeSB1IHYgcjEgZzEgYjEgYTEgcjIgZzIgYjIgYTIgb3IgeCB5IHUgdiByIGcgYiBhIFxuICAgICAgICBfcGVyQ2xpcFZlcnRleFNpemUgPSBfdXNlVGludCA/IDEyIDogODtcbiAgICBcbiAgICAgICAgX3ZlcnRleEZsb2F0Q291bnQgPSAwO1xuICAgICAgICBfdmVydGV4RmxvYXRPZmZzZXQgPSAwO1xuICAgICAgICBfdmVydGV4T2Zmc2V0ID0gMDtcbiAgICAgICAgX2luZGV4Q291bnQgPSAwO1xuICAgICAgICBfaW5kZXhPZmZzZXQgPSAwO1xuXG4gICAgICAgIGZvciAobGV0IHNsb3RJZHggPSAwLCBzbG90Q291bnQgPSBsb2NTa2VsZXRvbi5kcmF3T3JkZXIubGVuZ3RoOyBzbG90SWR4IDwgc2xvdENvdW50OyBzbG90SWR4KyspIHtcbiAgICAgICAgICAgIHNsb3QgPSBsb2NTa2VsZXRvbi5kcmF3T3JkZXJbc2xvdElkeF07XG4gICAgXG4gICAgICAgICAgICBpZiAoX3Nsb3RSYW5nZVN0YXJ0ID49IDAgJiYgX3Nsb3RSYW5nZVN0YXJ0ID09IHNsb3QuZGF0YS5pbmRleCkge1xuICAgICAgICAgICAgICAgIF9pblJhbmdlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFfaW5SYW5nZSkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKF9zbG90UmFuZ2VFbmQgPj0gMCAmJiBfc2xvdFJhbmdlRW5kID09IHNsb3QuZGF0YS5pbmRleCkge1xuICAgICAgICAgICAgICAgIF9pblJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBfdmVydGV4RmxvYXRDb3VudCA9IDA7XG4gICAgICAgICAgICBfaW5kZXhDb3VudCA9IDA7XG5cbiAgICAgICAgICAgIGF0dGFjaG1lbnQgPSBzbG90LmdldEF0dGFjaG1lbnQoKTtcbiAgICAgICAgICAgIGlmICghYXR0YWNobWVudCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpc1JlZ2lvbiA9IGF0dGFjaG1lbnQgaW5zdGFuY2VvZiBzcGluZS5SZWdpb25BdHRhY2htZW50O1xuICAgICAgICAgICAgaXNNZXNoID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLk1lc2hBdHRhY2htZW50O1xuICAgICAgICAgICAgaXNDbGlwID0gYXR0YWNobWVudCBpbnN0YW5jZW9mIHNwaW5lLkNsaXBwaW5nQXR0YWNobWVudDtcblxuICAgICAgICAgICAgaWYgKGlzQ2xpcCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcFN0YXJ0KHNsb3QsIGF0dGFjaG1lbnQpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWlzUmVnaW9uICYmICFpc01lc2gpIHtcbiAgICAgICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0ZXJpYWwgPSBfZ2V0U2xvdE1hdGVyaWFsKGF0dGFjaG1lbnQucmVnaW9uLnRleHR1cmUuX3RleHR1cmUsIHNsb3QuZGF0YS5ibGVuZE1vZGUpO1xuICAgICAgICAgICAgaWYgKCFtYXRlcmlhbCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX211c3RGbHVzaCB8fCBtYXRlcmlhbC5nZXRIYXNoKCkgIT09IF9yZW5kZXJlci5tYXRlcmlhbC5nZXRIYXNoKCkpIHtcbiAgICAgICAgICAgICAgICBfbXVzdEZsdXNoID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLl9mbHVzaCgpO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5ub2RlID0gX25vZGU7XG4gICAgICAgICAgICAgICAgX3JlbmRlcmVyLm1hdGVyaWFsID0gbWF0ZXJpYWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpc1JlZ2lvbikge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlcyA9IF9xdWFkVHJpYW5nbGVzO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gNCAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIF9pbmRleENvdW50ID0gNjtcblxuICAgICAgICAgICAgICAgIG9mZnNldEluZm8gPSBfYnVmZmVyLnJlcXVlc3QoNCwgNik7XG4gICAgICAgICAgICAgICAgX2luZGV4T2Zmc2V0ID0gb2Zmc2V0SW5mby5pbmRpY2VPZmZzZXQsXG4gICAgICAgICAgICAgICAgX3ZlcnRleE9mZnNldCA9IG9mZnNldEluZm8udmVydGV4T2Zmc2V0LFxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdE9mZnNldCA9IG9mZnNldEluZm8uYnl0ZU9mZnNldCA+PiAyO1xuICAgICAgICAgICAgICAgIHZidWYgPSBfYnVmZmVyLl92RGF0YSxcbiAgICAgICAgICAgICAgICBpYnVmID0gX2J1ZmZlci5faURhdGE7XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZSB2ZXJ0ZXggYW5kIGZpbGwgeCB5XG4gICAgICAgICAgICAgICAgYXR0YWNobWVudC5jb21wdXRlV29ybGRWZXJ0aWNlcyhzbG90LmJvbmUsIHZidWYsIF92ZXJ0ZXhGbG9hdE9mZnNldCwgX3BlclZlcnRleFNpemUpO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGRyYXcgZGVidWcgc2xvdHMgaWYgZW5hYmxlZCBncmFwaGljc1xuICAgICAgICAgICAgICAgIGlmIChncmFwaGljcyAmJiBfZGVidWdTbG90cykge1xuICAgICAgICAgICAgICAgICAgICBncmFwaGljcy5zdHJva2VDb2xvciA9IF9zbG90Q29sb3I7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLm1vdmVUbyh2YnVmW192ZXJ0ZXhGbG9hdE9mZnNldF0sIHZidWZbX3ZlcnRleEZsb2F0T2Zmc2V0ICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF9wZXJWZXJ0ZXhTaXplLCBubiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF92ZXJ0ZXhGbG9hdENvdW50OyBpaSA8IG5uOyBpaSArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHZidWZbaWldLCB2YnVmW2lpICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzTWVzaCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRyaWFuZ2xlcyA9IGF0dGFjaG1lbnQudHJpYW5nbGVzO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGluc3VyZSBjYXBhY2l0eVxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhGbG9hdENvdW50ID0gKGF0dGFjaG1lbnQud29ybGRWZXJ0aWNlc0xlbmd0aCA+PiAxKSAqIF9wZXJWZXJ0ZXhTaXplO1xuICAgICAgICAgICAgICAgIF9pbmRleENvdW50ID0gdHJpYW5nbGVzLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIG9mZnNldEluZm8gPSBfYnVmZmVyLnJlcXVlc3QoX3ZlcnRleEZsb2F0Q291bnQgLyBfcGVyVmVydGV4U2l6ZSwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgICAgIF9pbmRleE9mZnNldCA9IG9mZnNldEluZm8uaW5kaWNlT2Zmc2V0LFxuICAgICAgICAgICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSBvZmZzZXRJbmZvLnZlcnRleE9mZnNldCxcbiAgICAgICAgICAgICAgICBfdmVydGV4RmxvYXRPZmZzZXQgPSBvZmZzZXRJbmZvLmJ5dGVPZmZzZXQgPj4gMjtcbiAgICAgICAgICAgICAgICB2YnVmID0gX2J1ZmZlci5fdkRhdGEsXG4gICAgICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIGNvbXB1dGUgdmVydGV4IGFuZCBmaWxsIHggeVxuICAgICAgICAgICAgICAgIGF0dGFjaG1lbnQuY29tcHV0ZVdvcmxkVmVydGljZXMoc2xvdCwgMCwgYXR0YWNobWVudC53b3JsZFZlcnRpY2VzTGVuZ3RoLCB2YnVmLCBfdmVydGV4RmxvYXRPZmZzZXQsIF9wZXJWZXJ0ZXhTaXplKTtcblxuICAgICAgICAgICAgICAgIC8vIGRyYXcgZGVidWcgbWVzaCBpZiBlbmFibGVkIGdyYXBoaWNzXG4gICAgICAgICAgICAgICAgaWYgKGdyYXBoaWNzICYmIF9kZWJ1Z01lc2gpIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3Muc3Ryb2tlQ29sb3IgPSBfbWVzaENvbG9yO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gMCwgbm4gPSB0cmlhbmdsZXMubGVuZ3RoOyBpaSA8IG5uOyBpaSArPSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdjEgPSB0cmlhbmdsZXNbaWldICogX3BlclZlcnRleFNpemUgKyBfdmVydGV4RmxvYXRPZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdjIgPSB0cmlhbmdsZXNbaWkgKyAxXSAqIF9wZXJWZXJ0ZXhTaXplICsgX3ZlcnRleEZsb2F0T2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHYzID0gdHJpYW5nbGVzW2lpICsgMl0gKiBfcGVyVmVydGV4U2l6ZSArIF92ZXJ0ZXhGbG9hdE9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubW92ZVRvKHZidWZbdjFdLCB2YnVmW3YxICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHZidWZbdjJdLCB2YnVmW3YyICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHZidWZbdjNdLCB2YnVmW3YzICsgMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgaWYgKF92ZXJ0ZXhGbG9hdENvdW50ID09IDAgfHwgX2luZGV4Q291bnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNsaXBwZXIuY2xpcEVuZFdpdGhTbG90KHNsb3QpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICAgICAgLy8gZmlsbCBpbmRpY2VzXG4gICAgICAgICAgICBpYnVmLnNldCh0cmlhbmdsZXMsIF9pbmRleE9mZnNldCk7XG5cbiAgICAgICAgICAgIC8vIGZpbGwgdSB2XG4gICAgICAgICAgICB1dnMgPSBhdHRhY2htZW50LnV2cztcbiAgICAgICAgICAgIGZvciAobGV0IHYgPSBfdmVydGV4RmxvYXRPZmZzZXQsIG4gPSBfdmVydGV4RmxvYXRPZmZzZXQgKyBfdmVydGV4RmxvYXRDb3VudCwgdSA9IDA7IHYgPCBuOyB2ICs9IF9wZXJWZXJ0ZXhTaXplLCB1ICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YnVmW3YgKyAyXSA9IHV2c1t1XTsgICAgICAgICAgIC8vIHVcbiAgICAgICAgICAgICAgICB2YnVmW3YgKyAzXSA9IHV2c1t1ICsgMV07ICAgICAgIC8vIHZcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXR0YWNobWVudENvbG9yID0gYXR0YWNobWVudC5jb2xvcixcbiAgICAgICAgICAgIHNsb3RDb2xvciA9IHNsb3QuY29sb3I7XG5cbiAgICAgICAgICAgIHRoaXMuZmlsbFZlcnRpY2VzKHNrZWxldG9uQ29sb3IsIGF0dGFjaG1lbnRDb2xvciwgc2xvdENvbG9yLCBjbGlwcGVyLCBzbG90KTtcbiAgICBcbiAgICAgICAgICAgIGlmIChfaW5kZXhDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IF9pbmRleE9mZnNldCwgbm4gPSBfaW5kZXhPZmZzZXQgKyBfaW5kZXhDb3VudDsgaWkgPCBubjsgaWkrKykge1xuICAgICAgICAgICAgICAgICAgICBpYnVmW2lpXSArPSBfdmVydGV4T2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh3b3JsZE1hdCkge1xuICAgICAgICAgICAgICAgICAgICB3b3JsZE1hdG0gPSB3b3JsZE1hdC5tO1xuICAgICAgICAgICAgICAgICAgICBfbTAwID0gd29ybGRNYXRtWzBdO1xuICAgICAgICAgICAgICAgICAgICBfbTA0ID0gd29ybGRNYXRtWzRdO1xuICAgICAgICAgICAgICAgICAgICBfbTEyID0gd29ybGRNYXRtWzEyXTtcbiAgICAgICAgICAgICAgICAgICAgX20wMSA9IHdvcmxkTWF0bVsxXTtcbiAgICAgICAgICAgICAgICAgICAgX20wNSA9IHdvcmxkTWF0bVs1XTtcbiAgICAgICAgICAgICAgICAgICAgX20xMyA9IHdvcmxkTWF0bVsxM107XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gX3ZlcnRleEZsb2F0T2Zmc2V0LCBubiA9IF92ZXJ0ZXhGbG9hdE9mZnNldCArIF92ZXJ0ZXhGbG9hdENvdW50OyBpaSA8IG5uOyBpaSArPSBfcGVyVmVydGV4U2l6ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3ggPSB2YnVmW2lpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF95ID0gdmJ1ZltpaSArIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaV0gPSBfeCAqIF9tMDAgKyBfeSAqIF9tMDQgKyBfbTEyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaSArIDFdID0gX3ggKiBfbTAxICsgX3kgKiBfbTA1ICsgX20xMztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfYnVmZmVyLmFkanVzdChfdmVydGV4RmxvYXRDb3VudCAvIF9wZXJWZXJ0ZXhTaXplLCBfaW5kZXhDb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICBjbGlwcGVyLmNsaXBFbmRXaXRoU2xvdChzbG90KTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjbGlwcGVyLmNsaXBFbmQoKTtcbiAgICBcbiAgICAgICAgaWYgKGdyYXBoaWNzICYmIF9kZWJ1Z0JvbmVzKSB7XG4gICAgICAgICAgICBsZXQgYm9uZTtcbiAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZUNvbG9yID0gX2JvbmVDb2xvcjtcbiAgICAgICAgICAgIGdyYXBoaWNzLmZpbGxDb2xvciA9IF9zbG90Q29sb3I7IC8vIFJvb3QgYm9uZSBjb2xvciBpcyBzYW1lIGFzIHNsb3QgY29sb3IuXG4gICAgXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IGxvY1NrZWxldG9uLmJvbmVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgICAgIGJvbmUgPSBsb2NTa2VsZXRvbi5ib25lc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgeCA9IGJvbmUuZGF0YS5sZW5ndGggKiBib25lLmEgKyBib25lLndvcmxkWDtcbiAgICAgICAgICAgICAgICBsZXQgeSA9IGJvbmUuZGF0YS5sZW5ndGggKiBib25lLmMgKyBib25lLndvcmxkWTtcbiAgICBcbiAgICAgICAgICAgICAgICAvLyBCb25lIGxlbmd0aHMuXG4gICAgICAgICAgICAgICAgZ3JhcGhpY3MubW92ZVRvKGJvbmUud29ybGRYLCBib25lLndvcmxkWSk7XG4gICAgICAgICAgICAgICAgZ3JhcGhpY3MubGluZVRvKHgsIHkpO1xuICAgICAgICAgICAgICAgIGdyYXBoaWNzLnN0cm9rZSgpO1xuICAgIFxuICAgICAgICAgICAgICAgIC8vIEJvbmUgb3JpZ2lucy5cbiAgICAgICAgICAgICAgICBncmFwaGljcy5jaXJjbGUoYm9uZS53b3JsZFgsIGJvbmUud29ybGRZLCBNYXRoLlBJICogMS41KTtcbiAgICAgICAgICAgICAgICBncmFwaGljcy5maWxsKCk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JhcGhpY3MuZmlsbENvbG9yID0gX29yaWdpbkNvbG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNhY2hlVHJhdmVyc2UgKHdvcmxkTWF0KSB7XG4gICAgICAgIFxuICAgICAgICBsZXQgZnJhbWUgPSBfY29tcC5fY3VyRnJhbWU7XG4gICAgICAgIGlmICghZnJhbWUpIHJldHVybjtcblxuICAgICAgICBsZXQgc2VnbWVudHMgPSBmcmFtZS5zZWdtZW50cztcbiAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA9PSAwKSByZXR1cm47XG5cbiAgICAgICAgbGV0IHZidWYsIGlidWYsIHVpbnRidWY7XG4gICAgICAgIGxldCBtYXRlcmlhbDtcbiAgICAgICAgbGV0IG9mZnNldEluZm87XG4gICAgICAgIGxldCB2ZXJ0aWNlcyA9IGZyYW1lLnZlcnRpY2VzO1xuICAgICAgICBsZXQgaW5kaWNlcyA9IGZyYW1lLmluZGljZXM7XG4gICAgICAgIGxldCB3b3JsZE1hdG07XG5cbiAgICAgICAgbGV0IGZyYW1lVkZPZmZzZXQgPSAwLCBmcmFtZUluZGV4T2Zmc2V0ID0gMCwgc2VnVkZDb3VudCA9IDA7XG4gICAgICAgIGlmICh3b3JsZE1hdCkge1xuICAgICAgICAgICAgd29ybGRNYXRtID0gd29ybGRNYXQubTtcbiAgICAgICAgICAgIF9tMDAgPSB3b3JsZE1hdG1bMF07XG4gICAgICAgICAgICBfbTAxID0gd29ybGRNYXRtWzFdO1xuICAgICAgICAgICAgX20wNCA9IHdvcmxkTWF0bVs0XTtcbiAgICAgICAgICAgIF9tMDUgPSB3b3JsZE1hdG1bNV07XG4gICAgICAgICAgICBfbTEyID0gd29ybGRNYXRtWzEyXTtcbiAgICAgICAgICAgIF9tMTMgPSB3b3JsZE1hdG1bMTNdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGp1c3RUcmFuc2xhdGUgPSBfbTAwID09PSAxICYmIF9tMDEgPT09IDAgJiYgX20wNCA9PT0gMCAmJiBfbTA1ID09PSAxO1xuICAgICAgICBsZXQgbmVlZEJhdGNoID0gKF9oYW5kbGVWYWwgJiBGTEFHX0JBVENIKTtcbiAgICAgICAgbGV0IGNhbGNUcmFuc2xhdGUgPSBuZWVkQmF0Y2ggJiYganVzdFRyYW5zbGF0ZTtcblxuICAgICAgICBsZXQgY29sb3JPZmZzZXQgPSAwO1xuICAgICAgICBsZXQgY29sb3JzID0gZnJhbWUuY29sb3JzO1xuICAgICAgICBsZXQgbm93Q29sb3IgPSBjb2xvcnNbY29sb3JPZmZzZXQrK107XG4gICAgICAgIGxldCBtYXhWRk9mZnNldCA9IG5vd0NvbG9yLnZmT2Zmc2V0O1xuICAgICAgICBfaGFuZGxlQ29sb3Iobm93Q29sb3IpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc2VnSW5mbyA9IHNlZ21lbnRzW2ldO1xuICAgICAgICAgICAgbWF0ZXJpYWwgPSBfZ2V0U2xvdE1hdGVyaWFsKHNlZ0luZm8udGV4LCBzZWdJbmZvLmJsZW5kTW9kZSk7XG4gICAgICAgICAgICBpZiAoIW1hdGVyaWFsKSBjb250aW51ZTtcblxuICAgICAgICAgICAgaWYgKF9tdXN0Rmx1c2ggfHwgbWF0ZXJpYWwuZ2V0SGFzaCgpICE9PSBfcmVuZGVyZXIubWF0ZXJpYWwuZ2V0SGFzaCgpKSB7XG4gICAgICAgICAgICAgICAgX211c3RGbHVzaCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5fZmx1c2goKTtcbiAgICAgICAgICAgICAgICBfcmVuZGVyZXIubm9kZSA9IF9ub2RlO1xuICAgICAgICAgICAgICAgIF9yZW5kZXJlci5tYXRlcmlhbCA9IG1hdGVyaWFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfdmVydGV4Q291bnQgPSBzZWdJbmZvLnZlcnRleENvdW50O1xuICAgICAgICAgICAgX2luZGV4Q291bnQgPSBzZWdJbmZvLmluZGV4Q291bnQ7XG5cbiAgICAgICAgICAgIG9mZnNldEluZm8gPSBfYnVmZmVyLnJlcXVlc3QoX3ZlcnRleENvdW50LCBfaW5kZXhDb3VudCk7XG4gICAgICAgICAgICBfaW5kZXhPZmZzZXQgPSBvZmZzZXRJbmZvLmluZGljZU9mZnNldDtcbiAgICAgICAgICAgIF92ZXJ0ZXhPZmZzZXQgPSBvZmZzZXRJbmZvLnZlcnRleE9mZnNldDtcbiAgICAgICAgICAgIF92Zk9mZnNldCA9IG9mZnNldEluZm8uYnl0ZU9mZnNldCA+PiAyO1xuICAgICAgICAgICAgdmJ1ZiA9IF9idWZmZXIuX3ZEYXRhO1xuICAgICAgICAgICAgaWJ1ZiA9IF9idWZmZXIuX2lEYXRhO1xuICAgICAgICAgICAgdWludGJ1ZiA9IF9idWZmZXIuX3VpbnRWRGF0YTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfaW5kZXhPZmZzZXQsIGlsID0gX2luZGV4T2Zmc2V0ICsgX2luZGV4Q291bnQ7IGlpIDwgaWw7IGlpKyspIHtcbiAgICAgICAgICAgICAgICBpYnVmW2lpXSA9IF92ZXJ0ZXhPZmZzZXQgKyBpbmRpY2VzW2ZyYW1lSW5kZXhPZmZzZXQrK107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlZ1ZGQ291bnQgPSBzZWdJbmZvLnZmQ291bnQ7XG4gICAgICAgICAgICB2YnVmLnNldCh2ZXJ0aWNlcy5zdWJhcnJheShmcmFtZVZGT2Zmc2V0LCBmcmFtZVZGT2Zmc2V0ICsgc2VnVkZDb3VudCksIF92Zk9mZnNldCk7XG4gICAgICAgICAgICBmcmFtZVZGT2Zmc2V0ICs9IHNlZ1ZGQ291bnQ7XG5cbiAgICAgICAgICAgIGlmIChjYWxjVHJhbnNsYXRlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaWkgPSBfdmZPZmZzZXQsIGlsID0gX3ZmT2Zmc2V0ICsgc2VnVkZDb3VudDsgaWkgPCBpbDsgaWkgKz0gNikge1xuICAgICAgICAgICAgICAgICAgICB2YnVmW2lpXSArPSBfbTEyO1xuICAgICAgICAgICAgICAgICAgICB2YnVmW2lpICsgMV0gKz0gX20xMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5lZWRCYXRjaCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGlpID0gX3ZmT2Zmc2V0LCBpbCA9IF92Zk9mZnNldCArIHNlZ1ZGQ291bnQ7IGlpIDwgaWw7IGlpICs9IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgX3ggPSB2YnVmW2lpXTtcbiAgICAgICAgICAgICAgICAgICAgX3kgPSB2YnVmW2lpICsgMV07XG4gICAgICAgICAgICAgICAgICAgIHZidWZbaWldID0gX3ggKiBfbTAwICsgX3kgKiBfbTA0ICsgX20xMjtcbiAgICAgICAgICAgICAgICAgICAgdmJ1ZltpaSArIDFdID0gX3ggKiBfbTAxICsgX3kgKiBfbTA1ICsgX20xMztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9idWZmZXIuYWRqdXN0KF92ZXJ0ZXhDb3VudCwgX2luZGV4Q291bnQpO1xuICAgICAgICAgICAgaWYgKCAhX25lZWRDb2xvciApIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAvLyBoYW5kbGUgY29sb3JcbiAgICAgICAgICAgIGxldCBmcmFtZUNvbG9yT2Zmc2V0ID0gZnJhbWVWRk9mZnNldCAtIHNlZ1ZGQ291bnQ7XG4gICAgICAgICAgICBmb3IgKGxldCBpaSA9IF92Zk9mZnNldCArIDQsIGlsID0gX3ZmT2Zmc2V0ICsgNCArIHNlZ1ZGQ291bnQ7IGlpIDwgaWw7IGlpICs9IDYsIGZyYW1lQ29sb3JPZmZzZXQgKz0gNikge1xuICAgICAgICAgICAgICAgIGlmIChmcmFtZUNvbG9yT2Zmc2V0ID49IG1heFZGT2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vd0NvbG9yID0gY29sb3JzW2NvbG9yT2Zmc2V0KytdO1xuICAgICAgICAgICAgICAgICAgICBfaGFuZGxlQ29sb3Iobm93Q29sb3IpO1xuICAgICAgICAgICAgICAgICAgICBtYXhWRk9mZnNldCA9IG5vd0NvbG9yLnZmT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1aW50YnVmW2lpXSA9IF9maW5hbENvbG9yMzI7XG4gICAgICAgICAgICAgICAgdWludGJ1ZltpaSArIDFdID0gX2RhcmtDb2xvcjMyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmlsbEJ1ZmZlcnMgKGNvbXAsIHJlbmRlcmVyKSB7XG4gICAgICAgIFxuICAgICAgICBsZXQgbm9kZSA9IGNvbXAubm9kZTtcbiAgICAgICAgbm9kZS5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfVVBEQVRFX1JFTkRFUl9EQVRBO1xuICAgICAgICBpZiAoIWNvbXAuX3NrZWxldG9uKSByZXR1cm47XG5cbiAgICAgICAgbGV0IG5vZGVDb2xvciA9IG5vZGUuX2NvbG9yO1xuICAgICAgICBfbm9kZVIgPSBub2RlQ29sb3IuciAvIDI1NTtcbiAgICAgICAgX25vZGVHID0gbm9kZUNvbG9yLmcgLyAyNTU7XG4gICAgICAgIF9ub2RlQiA9IG5vZGVDb2xvci5iIC8gMjU1O1xuICAgICAgICBfbm9kZUEgPSBub2RlQ29sb3IuYSAvIDI1NTtcblxuICAgICAgICBfdXNlVGludCA9IGNvbXAudXNlVGludCB8fCBjb21wLmlzQW5pbWF0aW9uQ2FjaGVkKCk7XG4gICAgICAgIF92ZXJ0ZXhGb3JtYXQgPSBfdXNlVGludD8gVkZUd29Db2xvciA6IFZGT25lQ29sb3I7XG4gICAgICAgIC8vIHggeSB1IHYgY29sb3IxIGNvbG9yMiBvciB4IHkgdSB2IGNvbG9yXG4gICAgICAgIF9wZXJWZXJ0ZXhTaXplID0gX3VzZVRpbnQgPyA2IDogNTtcblxuICAgICAgICBfbm9kZSA9IGNvbXAubm9kZTtcbiAgICAgICAgX2J1ZmZlciA9IHJlbmRlcmVyLmdldEJ1ZmZlcignc3BpbmUnLCBfdmVydGV4Rm9ybWF0KTtcbiAgICAgICAgX3JlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgICAgIF9jb21wID0gY29tcDtcblxuICAgICAgICBfbXVzdEZsdXNoID0gdHJ1ZTtcbiAgICAgICAgX3ByZW11bHRpcGxpZWRBbHBoYSA9IGNvbXAucHJlbXVsdGlwbGllZEFscGhhO1xuICAgICAgICBfbXVsdGlwbGllciA9IDEuMDtcbiAgICAgICAgX2hhbmRsZVZhbCA9IDB4MDA7XG4gICAgICAgIF9uZWVkQ29sb3IgPSBmYWxzZTtcbiAgICAgICAgX3ZlcnRleEVmZmVjdCA9IGNvbXAuX2VmZmVjdERlbGVnYXRlICYmIGNvbXAuX2VmZmVjdERlbGVnYXRlLl92ZXJ0ZXhFZmZlY3Q7XG5cbiAgICAgICAgaWYgKG5vZGVDb2xvci5fdmFsICE9PSAweGZmZmZmZmZmIHx8IF9wcmVtdWx0aXBsaWVkQWxwaGEpIHtcbiAgICAgICAgICAgIF9uZWVkQ29sb3IgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF91c2VUaW50KSB7XG4gICAgICAgICAgICBfaGFuZGxlVmFsIHw9IEZMQUdfVFdPX0NPTE9SO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHdvcmxkTWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAoX2NvbXAuZW5hYmxlQmF0Y2gpIHtcbiAgICAgICAgICAgIHdvcmxkTWF0ID0gX25vZGUuX3dvcmxkTWF0cml4O1xuICAgICAgICAgICAgX211c3RGbHVzaCA9IGZhbHNlO1xuICAgICAgICAgICAgX2hhbmRsZVZhbCB8PSBGTEFHX0JBVENIO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXAuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgLy8gVHJhdmVyc2UgaW5wdXQgYXNzZW1ibGVyLlxuICAgICAgICAgICAgdGhpcy5jYWNoZVRyYXZlcnNlKHdvcmxkTWF0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChfdmVydGV4RWZmZWN0KSBfdmVydGV4RWZmZWN0LmJlZ2luKGNvbXAuX3NrZWxldG9uKTtcbiAgICAgICAgICAgIHRoaXMucmVhbFRpbWVUcmF2ZXJzZSh3b3JsZE1hdCk7XG4gICAgICAgICAgICBpZiAoX3ZlcnRleEVmZmVjdCkgX3ZlcnRleEVmZmVjdC5lbmQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN5bmMgYXR0YWNoZWQgbm9kZSBtYXRyaXhcbiAgICAgICAgcmVuZGVyZXIud29ybGRNYXREaXJ0eSsrO1xuICAgICAgICBjb21wLmF0dGFjaFV0aWwuX3N5bmNBdHRhY2hlZE5vZGUoKTtcblxuICAgICAgICAvLyBDbGVhciB0ZW1wIHZhci5cbiAgICAgICAgX25vZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9idWZmZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIF9yZW5kZXJlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgX2NvbXAgPSB1bmRlZmluZWQ7XG4gICAgICAgIF92ZXJ0ZXhFZmZlY3QgPSBudWxsO1xuICAgIH1cblxuICAgIHBvc3RGaWxsQnVmZmVycyAoY29tcCwgcmVuZGVyZXIpIHtcbiAgICAgICAgcmVuZGVyZXIud29ybGRNYXREaXJ0eS0tO1xuICAgIH1cbn1cblxuQXNzZW1ibGVyLnJlZ2lzdGVyKFNrZWxldG9uLCBTcGluZUFzc2VtYmxlcik7XG4iXX0=