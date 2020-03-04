
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCMask.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _gfx = _interopRequireDefault(require("../../renderer/gfx"));

var _mat = _interopRequireDefault(require("../value-types/mat4"));

var _vec = _interopRequireDefault(require("../value-types/vec2"));

var _materialVariant = _interopRequireDefault(require("../assets/material/material-variant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
var misc = require('../utils/misc');

var RenderComponent = require('./CCRenderComponent');

var RenderFlow = require('../renderer/render-flow');

var Graphics = require('../graphics/graphics');

var _vec2_temp = new _vec["default"]();

var _mat4_temp = new _mat["default"]();

var _circlepoints = [];

function _calculateCircle(center, radius, segements) {
  _circlepoints.length = 0;
  var anglePerStep = Math.PI * 2 / segements;

  for (var step = 0; step < segements; ++step) {
    _circlepoints.push(cc.v2(radius.x * Math.cos(anglePerStep * step) + center.x, radius.y * Math.sin(anglePerStep * step) + center.y));
  }

  return _circlepoints;
}
/**
 * !#en the type for mask.
 * !#zh 遮罩组件类型
 * @enum Mask.Type
 */


var MaskType = cc.Enum({
  /**
   * !#en Rect mask.
   * !#zh 使用矩形作为遮罩
   * @property {Number} RECT
   */
  RECT: 0,

  /**
   * !#en Ellipse Mask.
   * !#zh 使用椭圆作为遮罩
   * @property {Number} ELLIPSE
   */
  ELLIPSE: 1,

  /**
   * !#en Image Stencil Mask.
   * !#zh 使用图像模版作为遮罩
   * @property {Number} IMAGE_STENCIL
   */
  IMAGE_STENCIL: 2
});
var SEGEMENTS_MIN = 3;
var SEGEMENTS_MAX = 10000;
/**
 * !#en The Mask Component
 * !#zh 遮罩组件
 * @class Mask
 * @extends RenderComponent
 */

var Mask = cc.Class({
  name: 'cc.Mask',
  "extends": RenderComponent,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/Mask',
    help: 'i18n:COMPONENT.help_url.mask',
    inspector: 'packages://inspector/inspectors/comps/mask.js'
  },
  ctor: function ctor() {
    this._graphics = null;
    this._enableMaterial = null;
    this._exitMaterial = null;
    this._clearMaterial = null;
  },
  properties: {
    _spriteFrame: {
      "default": null,
      type: cc.SpriteFrame
    },

    /**
     * !#en The mask type.
     * !#zh 遮罩类型
     * @property type
     * @type {Mask.Type}
     * @example
     * mask.type = cc.Mask.Type.RECT;
     */
    _type: MaskType.RECT,
    type: {
      get: function get() {
        return this._type;
      },
      set: function set(value) {
        if (this._type !== value) {
          this._resetAssembler();
        }

        this._type = value;

        if (this._type !== MaskType.IMAGE_STENCIL) {
          this.spriteFrame = null;
          this.alphaThreshold = 0;

          this._updateGraphics();
        }

        this._activateMaterial();
      },
      type: MaskType,
      tooltip: CC_DEV && 'i18n:COMPONENT.mask.type'
    },

    /**
     * !#en The mask image
     * !#zh 遮罩所需要的贴图
     * @property spriteFrame
     * @type {SpriteFrame}
     * @default null
     * @example
     * mask.spriteFrame = newSpriteFrame;
     */
    spriteFrame: {
      type: cc.SpriteFrame,
      tooltip: CC_DEV && 'i18n:COMPONENT.mask.spriteFrame',
      get: function get() {
        return this._spriteFrame;
      },
      set: function set(value) {
        var lastSprite = this._spriteFrame;

        if (CC_EDITOR) {
          if ((lastSprite && lastSprite._uuid) === (value && value._uuid)) {
            return;
          }
        } else {
          if (lastSprite === value) {
            return;
          }
        }

        this._spriteFrame = value;
        this.setVertsDirty();

        this._updateMaterial();
      }
    },

    /**
     * !#en
     * The alpha threshold.(Not supported Canvas Mode) <br/>
     * The content is drawn only where the stencil have pixel with alpha greater than the alphaThreshold. <br/>
     * Should be a float between 0 and 1. <br/>
     * This default to 0.1.
     * When it's set to 1, the stencil will discard all pixels, nothing will be shown.
     * !#zh
     * Alpha 阈值（不支持 Canvas 模式）<br/>
     * 只有当模板的像素的 alpha 大于等于 alphaThreshold 时，才会绘制内容。<br/>
     * 该数值 0 ~ 1 之间的浮点数，默认值为 0.1
     * 当被设置为 1 时，会丢弃所有蒙版像素，所以不会显示任何内容
     * @property alphaThreshold
     * @type {Number}
     * @default 0.1
     */
    alphaThreshold: {
      "default": 0.1,
      type: cc.Float,
      range: [0, 1, 0.1],
      slide: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.mask.alphaThreshold',
      notify: function notify() {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
          cc.warnID(4201);
          return;
        }

        this._updateMaterial();
      }
    },

    /**
     * !#en Reverse mask (Not supported Canvas Mode)
     * !#zh 反向遮罩（不支持 Canvas 模式）
     * @property inverted
     * @type {Boolean}
     * @default false
     */
    inverted: {
      "default": false,
      type: cc.Boolean,
      tooltip: CC_DEV && 'i18n:COMPONENT.mask.inverted',
      notify: function notify() {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
          cc.warnID(4202);
        }
      }
    },

    /**
     * TODO: remove segments, not supported by graphics
     * !#en The segements for ellipse mask.
     * !#zh 椭圆遮罩的曲线细分数
     * @property segements
     * @type {Number}
     * @default 64
     */
    _segments: 64,
    segements: {
      get: function get() {
        return this._segments;
      },
      set: function set(value) {
        this._segments = misc.clampf(value, SEGEMENTS_MIN, SEGEMENTS_MAX);

        this._updateGraphics();
      },
      type: cc.Integer,
      tooltip: CC_DEV && 'i18n:COMPONENT.mask.segements'
    },
    _resizeToTarget: {
      animatable: false,
      set: function set(value) {
        if (value) {
          this._resizeNodeToTargetNode();
        }
      }
    }
  },
  statics: {
    Type: MaskType
  },
  onRestore: function onRestore() {
    this._activateMaterial();
  },
  onEnable: function onEnable() {
    this._super();

    if (this._type !== MaskType.IMAGE_STENCIL) {
      this._updateGraphics();
    }

    this.node.on(cc.Node.EventType.POSITION_CHANGED, this._updateGraphics, this);
    this.node.on(cc.Node.EventType.ROTATION_CHANGED, this._updateGraphics, this);
    this.node.on(cc.Node.EventType.SCALE_CHANGED, this._updateGraphics, this);
    this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateGraphics, this);
    this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._updateGraphics, this);
  },
  onDisable: function onDisable() {
    this._super();

    this.node.off(cc.Node.EventType.POSITION_CHANGED, this._updateGraphics, this);
    this.node.off(cc.Node.EventType.ROTATION_CHANGED, this._updateGraphics, this);
    this.node.off(cc.Node.EventType.SCALE_CHANGED, this._updateGraphics, this);
    this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateGraphics, this);
    this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._updateGraphics, this);
    this.node._renderFlag &= ~RenderFlow.FLAG_POST_RENDER;
  },
  onDestroy: function onDestroy() {
    this._super();

    this._removeGraphics();
  },
  _resizeNodeToTargetNode: CC_EDITOR && function () {
    if (this.spriteFrame) {
      var rect = this.spriteFrame.getRect();
      this.node.setContentSize(rect.width, rect.height);
    }
  },
  _validateRender: function _validateRender() {
    if (this._type !== MaskType.IMAGE_STENCIL) return;
    var spriteFrame = this._spriteFrame;

    if (spriteFrame && spriteFrame.textureLoaded()) {
      return;
    }

    this.disableRender();
  },
  _activateMaterial: function _activateMaterial() {
    this._createGraphics(); // Init material


    var material = this._materials[0];

    if (!material) {
      material = _materialVariant["default"].createWithBuiltin('2d-sprite', this);
    } else {
      material = _materialVariant["default"].create(material, this);
    }

    material.define('USE_ALPHA_TEST', true); // Reset material

    if (this._type === MaskType.IMAGE_STENCIL) {
      material.define('CC_USE_MODEL', false);
      material.define('USE_TEXTURE', true);
    } else {
      material.define('CC_USE_MODEL', true);
      material.define('USE_TEXTURE', false);
    }

    if (!this._enableMaterial) {
      this._enableMaterial = _materialVariant["default"].createWithBuiltin('2d-sprite', this);
    }

    if (!this._exitMaterial) {
      this._exitMaterial = _materialVariant["default"].createWithBuiltin('2d-sprite', this);

      this._exitMaterial.setStencilEnabled(_gfx["default"].STENCIL_DISABLE);
    }

    if (!this._clearMaterial) {
      this._clearMaterial = _materialVariant["default"].createWithBuiltin('clear-stencil', this);
    }

    this.setMaterial(0, material);
    this._graphics._materials[0] = material;

    this._updateMaterial();
  },
  _updateMaterial: function _updateMaterial() {
    var material = this._materials[0];
    if (!material) return;

    if (this._type === MaskType.IMAGE_STENCIL && this.spriteFrame) {
      var texture = this.spriteFrame.getTexture();
      material.setProperty('texture', texture);
    }

    material.setProperty('alphaThreshold', this.alphaThreshold);
  },
  _createGraphics: function _createGraphics() {
    if (!this._graphics) {
      this._graphics = new Graphics();
      cc.Assembler.init(this._graphics);
      this._graphics.node = this.node;
      this._graphics.lineWidth = 0;
      this._graphics.strokeColor = cc.color(0, 0, 0, 0);
    }
  },
  _updateGraphics: function _updateGraphics() {
    var node = this.node;
    var graphics = this._graphics; // Share render data with graphics content

    graphics.clear(false);
    var width = node._contentSize.width;
    var height = node._contentSize.height;
    var x = -width * node._anchorPoint.x;
    var y = -height * node._anchorPoint.y;

    if (this._type === MaskType.RECT) {
      graphics.rect(x, y, width, height);
    } else if (this._type === MaskType.ELLIPSE) {
      var center = cc.v2(x + width / 2, y + height / 2);
      var radius = {
        x: width / 2,
        y: height / 2
      };

      var points = _calculateCircle(center, radius, this._segments);

      for (var i = 0; i < points.length; ++i) {
        var point = points[i];

        if (i === 0) {
          graphics.moveTo(point.x, point.y);
        } else {
          graphics.lineTo(point.x, point.y);
        }
      }

      graphics.close();
    }

    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
      graphics.stroke();
    } else {
      graphics.fill();
    }
  },
  _removeGraphics: function _removeGraphics() {
    if (this._graphics) {
      this._graphics.destroy();

      this._graphics._destroyImmediate(); // FIX: cocos-creator/2d-tasks#2511. TODO: cocos-creator/2d-tasks#2516


      this._graphics = null;
    }
  },
  _hitTest: function _hitTest(cameraPt) {
    var node = this.node;
    var size = node.getContentSize(),
        w = size.width,
        h = size.height,
        testPt = _vec2_temp;

    node._updateWorldMatrix(); // If scale is 0, it can't be hit.


    if (!_mat["default"].invert(_mat4_temp, node._worldMatrix)) {
      return false;
    }

    _vec["default"].transformMat4(testPt, cameraPt, _mat4_temp);

    testPt.x += node._anchorPoint.x * w;
    testPt.y += node._anchorPoint.y * h;
    var result = false;

    if (this.type === MaskType.RECT || this.type === MaskType.IMAGE_STENCIL) {
      result = testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h;
    } else if (this.type === MaskType.ELLIPSE) {
      var rx = w / 2,
          ry = h / 2;
      var px = testPt.x - 0.5 * w,
          py = testPt.y - 0.5 * h;
      result = px * px / (rx * rx) + py * py / (ry * ry) < 1;
    }

    if (this.inverted) {
      result = !result;
    }

    return result;
  },
  markForRender: function markForRender(enable) {
    var flag = RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA | RenderFlow.FLAG_POST_RENDER;

    if (enable) {
      this.node._renderFlag |= flag;
      this.markForValidate();
    } else if (!enable) {
      this.node._renderFlag &= ~flag;
    }
  },
  disableRender: function disableRender() {
    this.node._renderFlag &= ~(RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA | RenderFlow.FLAG_POST_RENDER);
  }
});
cc.Mask = module.exports = Mask;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTWFzay5qcyJdLCJuYW1lcyI6WyJtaXNjIiwicmVxdWlyZSIsIlJlbmRlckNvbXBvbmVudCIsIlJlbmRlckZsb3ciLCJHcmFwaGljcyIsIl92ZWMyX3RlbXAiLCJWZWMyIiwiX21hdDRfdGVtcCIsIk1hdDQiLCJfY2lyY2xlcG9pbnRzIiwiX2NhbGN1bGF0ZUNpcmNsZSIsImNlbnRlciIsInJhZGl1cyIsInNlZ2VtZW50cyIsImxlbmd0aCIsImFuZ2xlUGVyU3RlcCIsIk1hdGgiLCJQSSIsInN0ZXAiLCJwdXNoIiwiY2MiLCJ2MiIsIngiLCJjb3MiLCJ5Iiwic2luIiwiTWFza1R5cGUiLCJFbnVtIiwiUkVDVCIsIkVMTElQU0UiLCJJTUFHRV9TVEVOQ0lMIiwiU0VHRU1FTlRTX01JTiIsIlNFR0VNRU5UU19NQVgiLCJNYXNrIiwiQ2xhc3MiLCJuYW1lIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImhlbHAiLCJpbnNwZWN0b3IiLCJjdG9yIiwiX2dyYXBoaWNzIiwiX2VuYWJsZU1hdGVyaWFsIiwiX2V4aXRNYXRlcmlhbCIsIl9jbGVhck1hdGVyaWFsIiwicHJvcGVydGllcyIsIl9zcHJpdGVGcmFtZSIsInR5cGUiLCJTcHJpdGVGcmFtZSIsIl90eXBlIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJfcmVzZXRBc3NlbWJsZXIiLCJzcHJpdGVGcmFtZSIsImFscGhhVGhyZXNob2xkIiwiX3VwZGF0ZUdyYXBoaWNzIiwiX2FjdGl2YXRlTWF0ZXJpYWwiLCJ0b29sdGlwIiwiQ0NfREVWIiwibGFzdFNwcml0ZSIsIl91dWlkIiwic2V0VmVydHNEaXJ0eSIsIl91cGRhdGVNYXRlcmlhbCIsIkZsb2F0IiwicmFuZ2UiLCJzbGlkZSIsIm5vdGlmeSIsImdhbWUiLCJyZW5kZXJUeXBlIiwiUkVOREVSX1RZUEVfQ0FOVkFTIiwid2FybklEIiwiaW52ZXJ0ZWQiLCJCb29sZWFuIiwiX3NlZ21lbnRzIiwiY2xhbXBmIiwiSW50ZWdlciIsIl9yZXNpemVUb1RhcmdldCIsImFuaW1hdGFibGUiLCJfcmVzaXplTm9kZVRvVGFyZ2V0Tm9kZSIsInN0YXRpY3MiLCJUeXBlIiwib25SZXN0b3JlIiwib25FbmFibGUiLCJfc3VwZXIiLCJub2RlIiwib24iLCJOb2RlIiwiRXZlbnRUeXBlIiwiUE9TSVRJT05fQ0hBTkdFRCIsIlJPVEFUSU9OX0NIQU5HRUQiLCJTQ0FMRV9DSEFOR0VEIiwiU0laRV9DSEFOR0VEIiwiQU5DSE9SX0NIQU5HRUQiLCJvbkRpc2FibGUiLCJvZmYiLCJfcmVuZGVyRmxhZyIsIkZMQUdfUE9TVF9SRU5ERVIiLCJvbkRlc3Ryb3kiLCJfcmVtb3ZlR3JhcGhpY3MiLCJyZWN0IiwiZ2V0UmVjdCIsInNldENvbnRlbnRTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJfdmFsaWRhdGVSZW5kZXIiLCJ0ZXh0dXJlTG9hZGVkIiwiZGlzYWJsZVJlbmRlciIsIl9jcmVhdGVHcmFwaGljcyIsIm1hdGVyaWFsIiwiX21hdGVyaWFscyIsIk1hdGVyaWFsVmFyaWFudCIsImNyZWF0ZVdpdGhCdWlsdGluIiwiY3JlYXRlIiwiZGVmaW5lIiwic2V0U3RlbmNpbEVuYWJsZWQiLCJnZngiLCJTVEVOQ0lMX0RJU0FCTEUiLCJzZXRNYXRlcmlhbCIsInRleHR1cmUiLCJnZXRUZXh0dXJlIiwic2V0UHJvcGVydHkiLCJBc3NlbWJsZXIiLCJpbml0IiwibGluZVdpZHRoIiwic3Ryb2tlQ29sb3IiLCJjb2xvciIsImdyYXBoaWNzIiwiY2xlYXIiLCJfY29udGVudFNpemUiLCJfYW5jaG9yUG9pbnQiLCJwb2ludHMiLCJpIiwicG9pbnQiLCJtb3ZlVG8iLCJsaW5lVG8iLCJjbG9zZSIsInN0cm9rZSIsImZpbGwiLCJkZXN0cm95IiwiX2Rlc3Ryb3lJbW1lZGlhdGUiLCJfaGl0VGVzdCIsImNhbWVyYVB0Iiwic2l6ZSIsImdldENvbnRlbnRTaXplIiwidyIsImgiLCJ0ZXN0UHQiLCJfdXBkYXRlV29ybGRNYXRyaXgiLCJpbnZlcnQiLCJfd29ybGRNYXRyaXgiLCJ0cmFuc2Zvcm1NYXQ0IiwicmVzdWx0IiwicngiLCJyeSIsInB4IiwicHkiLCJtYXJrRm9yUmVuZGVyIiwiZW5hYmxlIiwiZmxhZyIsIkZMQUdfUkVOREVSIiwiRkxBR19VUERBVEVfUkVOREVSX0RBVEEiLCJtYXJrRm9yVmFsaWRhdGUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBMEJBOztBQU9BOztBQUNBOztBQUNBOzs7O0FBbkNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLElBQU1BLElBQUksR0FBR0MsT0FBTyxDQUFDLGVBQUQsQ0FBcEI7O0FBQ0EsSUFBTUMsZUFBZSxHQUFHRCxPQUFPLENBQUMscUJBQUQsQ0FBL0I7O0FBQ0EsSUFBTUUsVUFBVSxHQUFHRixPQUFPLENBQUMseUJBQUQsQ0FBMUI7O0FBQ0EsSUFBTUcsUUFBUSxHQUFHSCxPQUFPLENBQUMsc0JBQUQsQ0FBeEI7O0FBTUEsSUFBSUksVUFBVSxHQUFHLElBQUlDLGVBQUosRUFBakI7O0FBQ0EsSUFBSUMsVUFBVSxHQUFHLElBQUlDLGVBQUosRUFBakI7O0FBRUEsSUFBSUMsYUFBYSxHQUFFLEVBQW5COztBQUNBLFNBQVNDLGdCQUFULENBQTJCQyxNQUEzQixFQUFtQ0MsTUFBbkMsRUFBMkNDLFNBQTNDLEVBQXNEO0FBQ2xESixFQUFBQSxhQUFhLENBQUNLLE1BQWQsR0FBdUIsQ0FBdkI7QUFDQSxNQUFJQyxZQUFZLEdBQUdDLElBQUksQ0FBQ0MsRUFBTCxHQUFVLENBQVYsR0FBY0osU0FBakM7O0FBQ0EsT0FBSyxJQUFJSyxJQUFJLEdBQUcsQ0FBaEIsRUFBbUJBLElBQUksR0FBR0wsU0FBMUIsRUFBcUMsRUFBRUssSUFBdkMsRUFBNkM7QUFDekNULElBQUFBLGFBQWEsQ0FBQ1UsSUFBZCxDQUFtQkMsRUFBRSxDQUFDQyxFQUFILENBQU1ULE1BQU0sQ0FBQ1UsQ0FBUCxHQUFXTixJQUFJLENBQUNPLEdBQUwsQ0FBU1IsWUFBWSxHQUFHRyxJQUF4QixDQUFYLEdBQTJDUCxNQUFNLENBQUNXLENBQXhE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TUFBVjtBQUNIOztBQUNELFdBQU9BLE1BQVA7QUFDSCxHQTlXZTtBQWdYaEJLLEVBQUFBLGFBaFhnQix5QkFnWERDLE1BaFhDLEVBZ1hPO0FBQ25CLFFBQUlDLElBQUksR0FBRzdKLFVBQVUsQ0FBQzhKLFdBQVgsR0FBeUI5SixVQUFVLENBQUMrSix1QkFBcEMsR0FBOEQvSixVQUFVLENBQUMrRixnQkFBcEY7O0FBQ0EsUUFBSTZELE1BQUosRUFBWTtBQUNSLFdBQUt6RSxJQUFMLENBQVVXLFdBQVYsSUFBeUIrRCxJQUF6QjtBQUNBLFdBQUtHLGVBQUw7QUFDSCxLQUhELE1BSUssSUFBSSxDQUFDSixNQUFMLEVBQWE7QUFDZCxXQUFLekUsSUFBTCxDQUFVVyxXQUFWLElBQXlCLENBQUMrRCxJQUExQjtBQUNIO0FBQ0osR0F6WGU7QUEyWGhCcEQsRUFBQUEsYUEzWGdCLDJCQTJYQztBQUNiLFNBQUt0QixJQUFMLENBQVVXLFdBQVYsSUFBeUIsRUFBRTlGLFVBQVUsQ0FBQzhKLFdBQVgsR0FBeUI5SixVQUFVLENBQUMrSix1QkFBcEMsR0FDQS9KLFVBQVUsQ0FBQytGLGdCQURiLENBQXpCO0FBRUg7QUE5WGUsQ0FBVCxDQUFYO0FBaVlBOUUsRUFBRSxDQUFDYSxJQUFILEdBQVVtSSxNQUFNLENBQUNDLE9BQVAsR0FBaUJwSSxJQUEzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuaW1wb3J0IGdmeCBmcm9tICcuLi8uLi9yZW5kZXJlci9nZngnO1xuXG5jb25zdCBtaXNjID0gcmVxdWlyZSgnLi4vdXRpbHMvbWlzYycpO1xuY29uc3QgUmVuZGVyQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9DQ1JlbmRlckNvbXBvbmVudCcpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5jb25zdCBHcmFwaGljcyA9IHJlcXVpcmUoJy4uL2dyYXBoaWNzL2dyYXBoaWNzJyk7XG5cbmltcG9ydCBNYXQ0IGZyb20gJy4uL3ZhbHVlLXR5cGVzL21hdDQnO1xuaW1wb3J0IFZlYzIgZnJvbSAnLi4vdmFsdWUtdHlwZXMvdmVjMic7XG5pbXBvcnQgTWF0ZXJpYWxWYXJpYW50IGZyb20gJy4uL2Fzc2V0cy9tYXRlcmlhbC9tYXRlcmlhbC12YXJpYW50JztcblxubGV0IF92ZWMyX3RlbXAgPSBuZXcgVmVjMigpO1xubGV0IF9tYXQ0X3RlbXAgPSBuZXcgTWF0NCgpO1xuXG5sZXQgX2NpcmNsZXBvaW50cyA9W107XG5mdW5jdGlvbiBfY2FsY3VsYXRlQ2lyY2xlIChjZW50ZXIsIHJhZGl1cywgc2VnZW1lbnRzKSB7XG4gICAgX2NpcmNsZXBvaW50cy5sZW5ndGggPSAwO1xuICAgIGxldCBhbmdsZVBlclN0ZXAgPSBNYXRoLlBJICogMiAvIHNlZ2VtZW50cztcbiAgICBmb3IgKGxldCBzdGVwID0gMDsgc3RlcCA8IHNlZ2VtZW50czsgKytzdGVwKSB7XG4gICAgICAgIF9jaXJjbGVwb2ludHMucHVzaChjYy52MihyYWRpdXMueCAqIE1hdGguY29zKGFuZ2xlUGVyU3RlcCAqIHN0ZXApICsgY2VudGVyLngsXG4gICAgICAgICAgICByYWRpdXMueSAqIE1hdGguc2luKGFuZ2xlUGVyU3RlcCAqIHN0ZXApICsgY2VudGVyLnkpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX2NpcmNsZXBvaW50cztcbn1cblxuLyoqXG4gKiAhI2VuIHRoZSB0eXBlIGZvciBtYXNrLlxuICogISN6aCDpga7nvannu4Tku7bnsbvlnotcbiAqIEBlbnVtIE1hc2suVHlwZVxuICovXG5sZXQgTWFza1R5cGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFJlY3QgbWFzay5cbiAgICAgKiAhI3poIOS9v+eUqOefqeW9ouS9nOS4uumBrue9qVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBSRUNUXG4gICAgICovXG4gICAgUkVDVDogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIEVsbGlwc2UgTWFzay5cbiAgICAgKiAhI3poIOS9v+eUqOakreWchuS9nOS4uumBrue9qVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBFTExJUFNFXG4gICAgICovXG4gICAgRUxMSVBTRTogMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIEltYWdlIFN0ZW5jaWwgTWFzay5cbiAgICAgKiAhI3poIOS9v+eUqOWbvuWDj+aooeeJiOS9nOS4uumBrue9qVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBJTUFHRV9TVEVOQ0lMXG4gICAgICovXG4gICAgSU1BR0VfU1RFTkNJTDogMixcbn0pO1xuXG5jb25zdCBTRUdFTUVOVFNfTUlOID0gMztcbmNvbnN0IFNFR0VNRU5UU19NQVggPSAxMDAwMDtcblxuLyoqXG4gKiAhI2VuIFRoZSBNYXNrIENvbXBvbmVudFxuICogISN6aCDpga7nvannu4Tku7ZcbiAqIEBjbGFzcyBNYXNrXG4gKiBAZXh0ZW5kcyBSZW5kZXJDb21wb25lbnRcbiAqL1xubGV0IE1hc2sgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLk1hc2snLFxuICAgIGV4dGVuZHM6IFJlbmRlckNvbXBvbmVudCxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5yZW5kZXJlcnMvTWFzaycsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC5tYXNrJyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9tYXNrLmpzJ1xuICAgIH0sXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5fZ3JhcGhpY3MgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX2VuYWJsZU1hdGVyaWFsID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZXhpdE1hdGVyaWFsID0gbnVsbDtcbiAgICAgICAgdGhpcy5fY2xlYXJNYXRlcmlhbCA9IG51bGw7XG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgX3Nwcml0ZUZyYW1lOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWVcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbWFzayB0eXBlLlxuICAgICAgICAgKiAhI3poIOmBrue9qeexu+Wei1xuICAgICAgICAgKiBAcHJvcGVydHkgdHlwZVxuICAgICAgICAgKiBAdHlwZSB7TWFzay5UeXBlfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBtYXNrLnR5cGUgPSBjYy5NYXNrLlR5cGUuUkVDVDtcbiAgICAgICAgICovXG4gICAgICAgIF90eXBlOiBNYXNrVHlwZS5SRUNULFxuICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90eXBlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNldEFzc2VtYmxlcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX3R5cGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHlwZSAhPT0gTWFza1R5cGUuSU1BR0VfU1RFTkNJTCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZUZyYW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbHBoYVRocmVzaG9sZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUdyYXBoaWNzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2YXRlTWF0ZXJpYWwoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBNYXNrVHlwZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubWFzay50eXBlJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbWFzayBpbWFnZVxuICAgICAgICAgKiAhI3poIOmBrue9qeaJgOmcgOimgeeahOi0tOWbvlxuICAgICAgICAgKiBAcHJvcGVydHkgc3ByaXRlRnJhbWVcbiAgICAgICAgICogQHR5cGUge1Nwcml0ZUZyYW1lfVxuICAgICAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG1hc2suc3ByaXRlRnJhbWUgPSBuZXdTcHJpdGVGcmFtZTtcbiAgICAgICAgICovXG4gICAgICAgIHNwcml0ZUZyYW1lOiB7XG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubWFzay5zcHJpdGVGcmFtZScsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGFzdFNwcml0ZSA9IHRoaXMuX3Nwcml0ZUZyYW1lO1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChsYXN0U3ByaXRlICYmIGxhc3RTcHJpdGUuX3V1aWQpID09PSAodmFsdWUgJiYgdmFsdWUuX3V1aWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0U3ByaXRlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3Nwcml0ZUZyYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGFscGhhIHRocmVzaG9sZC4oTm90IHN1cHBvcnRlZCBDYW52YXMgTW9kZSkgPGJyLz5cbiAgICAgICAgICogVGhlIGNvbnRlbnQgaXMgZHJhd24gb25seSB3aGVyZSB0aGUgc3RlbmNpbCBoYXZlIHBpeGVsIHdpdGggYWxwaGEgZ3JlYXRlciB0aGFuIHRoZSBhbHBoYVRocmVzaG9sZC4gPGJyLz5cbiAgICAgICAgICogU2hvdWxkIGJlIGEgZmxvYXQgYmV0d2VlbiAwIGFuZCAxLiA8YnIvPlxuICAgICAgICAgKiBUaGlzIGRlZmF1bHQgdG8gMC4xLlxuICAgICAgICAgKiBXaGVuIGl0J3Mgc2V0IHRvIDEsIHRoZSBzdGVuY2lsIHdpbGwgZGlzY2FyZCBhbGwgcGl4ZWxzLCBub3RoaW5nIHdpbGwgYmUgc2hvd24uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICogQWxwaGEg6ZiI5YC877yI5LiN5pSv5oyBIENhbnZhcyDmqKHlvI/vvIk8YnIvPlxuICAgICAgICAgKiDlj6rmnInlvZPmqKHmnb/nmoTlg4/ntKDnmoQgYWxwaGEg5aSn5LqO562J5LqOIGFscGhhVGhyZXNob2xkIOaXtu+8jOaJjeS8mue7mOWItuWGheWuueOAgjxici8+XG4gICAgICAgICAqIOivpeaVsOWAvCAwIH4gMSDkuYvpl7TnmoTmta7ngrnmlbDvvIzpu5jorqTlgLzkuLogMC4xXG4gICAgICAgICAqIOW9k+iiq+iuvue9ruS4uiAxIOaXtu+8jOS8muS4ouW8g+aJgOacieiSmeeJiOWDj+e0oO+8jOaJgOS7peS4jeS8muaYvuekuuS7u+S9leWGheWuuVxuICAgICAgICAgKiBAcHJvcGVydHkgYWxwaGFUaHJlc2hvbGRcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMC4xXG4gICAgICAgICAqL1xuICAgICAgICBhbHBoYVRocmVzaG9sZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogMC4xLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgICAgICByYW5nZTogWzAsIDEsIDAuMV0sXG4gICAgICAgICAgICBzbGlkZTogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubWFzay5hbHBoYVRocmVzaG9sZCcsXG4gICAgICAgICAgICBub3RpZnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2MuZ2FtZS5yZW5kZXJUeXBlID09PSBjYy5nYW1lLlJFTkRFUl9UWVBFX0NBTlZBUykge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoNDIwMSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBSZXZlcnNlIG1hc2sgKE5vdCBzdXBwb3J0ZWQgQ2FudmFzIE1vZGUpXG4gICAgICAgICAqICEjemgg5Y+N5ZCR6YGu572p77yI5LiN5pSv5oyBIENhbnZhcyDmqKHlvI/vvIlcbiAgICAgICAgICogQHByb3BlcnR5IGludmVydGVkXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgaW52ZXJ0ZWQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogY2MuQm9vbGVhbixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubWFzay5pbnZlcnRlZCcsXG4gICAgICAgICAgICBub3RpZnk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2MuZ2FtZS5yZW5kZXJUeXBlID09PSBjYy5nYW1lLlJFTkRFUl9UWVBFX0NBTlZBUykge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoNDIwMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUT0RPOiByZW1vdmUgc2VnbWVudHMsIG5vdCBzdXBwb3J0ZWQgYnkgZ3JhcGhpY3NcbiAgICAgICAgICogISNlbiBUaGUgc2VnZW1lbnRzIGZvciBlbGxpcHNlIG1hc2suXG4gICAgICAgICAqICEjemgg5qSt5ZyG6YGu572p55qE5puy57q/57uG5YiG5pWwXG4gICAgICAgICAqIEBwcm9wZXJ0eSBzZWdlbWVudHNcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgNjRcbiAgICAgICAgICovXG4gICAgICAgIF9zZWdtZW50czogNjQsXG4gICAgICAgIHNlZ2VtZW50czoge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NlZ21lbnRzO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VnbWVudHMgPSBtaXNjLmNsYW1wZih2YWx1ZSwgU0VHRU1FTlRTX01JTiwgU0VHRU1FTlRTX01BWCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlR3JhcGhpY3MoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5JbnRlZ2VyLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5tYXNrLnNlZ2VtZW50cycsXG4gICAgICAgIH0sXG5cbiAgICAgICAgX3Jlc2l6ZVRvVGFyZ2V0OiB7XG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplTm9kZVRvVGFyZ2V0Tm9kZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIFR5cGU6IE1hc2tUeXBlLFxuICAgIH0sXG5cbiAgICBvblJlc3RvcmUgKCkge1xuICAgICAgICB0aGlzLl9hY3RpdmF0ZU1hdGVyaWFsKCk7XG4gICAgfSxcblxuICAgIG9uRW5hYmxlICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgIT09IE1hc2tUeXBlLklNQUdFX1NURU5DSUwpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUdyYXBoaWNzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCwgdGhpcy5fdXBkYXRlR3JhcGhpY3MsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuUk9UQVRJT05fQ0hBTkdFRCwgdGhpcy5fdXBkYXRlR3JhcGhpY3MsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuU0NBTEVfQ0hBTkdFRCwgdGhpcy5fdXBkYXRlR3JhcGhpY3MsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLl91cGRhdGVHcmFwaGljcywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fdXBkYXRlR3JhcGhpY3MsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuXG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCwgdGhpcy5fdXBkYXRlR3JhcGhpY3MsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlJPVEFUSU9OX0NIQU5HRUQsIHRoaXMuX3VwZGF0ZUdyYXBoaWNzLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5TQ0FMRV9DSEFOR0VELCB0aGlzLl91cGRhdGVHcmFwaGljcywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLl91cGRhdGVHcmFwaGljcywgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIHRoaXMuX3VwZGF0ZUdyYXBoaWNzLCB0aGlzKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyAmPSB+UmVuZGVyRmxvdy5GTEFHX1BPU1RfUkVOREVSO1xuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3kgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLl9yZW1vdmVHcmFwaGljcygpO1xuICAgIH0sXG5cbiAgICBfcmVzaXplTm9kZVRvVGFyZ2V0Tm9kZTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYodGhpcy5zcHJpdGVGcmFtZSkge1xuICAgICAgICAgICAgbGV0IHJlY3QgPSB0aGlzLnNwcml0ZUZyYW1lLmdldFJlY3QoKTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZShyZWN0LndpZHRoLCByZWN0LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3ZhbGlkYXRlUmVuZGVyICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgIT09IE1hc2tUeXBlLklNQUdFX1NURU5DSUwpIHJldHVybjtcblxuICAgICAgICBsZXQgc3ByaXRlRnJhbWUgPSB0aGlzLl9zcHJpdGVGcmFtZTtcbiAgICAgICAgaWYgKHNwcml0ZUZyYW1lICYmIFxuICAgICAgICAgICAgc3ByaXRlRnJhbWUudGV4dHVyZUxvYWRlZCgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICB9LFxuXG4gICAgX2FjdGl2YXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICB0aGlzLl9jcmVhdGVHcmFwaGljcygpO1xuICAgICAgICBcbiAgICAgICAgLy8gSW5pdCBtYXRlcmlhbFxuICAgICAgICBsZXQgbWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbHNbMF07XG4gICAgICAgIGlmICghbWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZVdpdGhCdWlsdGluKCcyZC1zcHJpdGUnLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1hdGVyaWFsID0gTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZShtYXRlcmlhbCwgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBtYXRlcmlhbC5kZWZpbmUoJ1VTRV9BTFBIQV9URVNUJywgdHJ1ZSk7XG5cbiAgICAgICAgLy8gUmVzZXQgbWF0ZXJpYWxcbiAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IE1hc2tUeXBlLklNQUdFX1NURU5DSUwpIHtcbiAgICAgICAgICAgIG1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX01PREVMJywgZmFsc2UpO1xuICAgICAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdVU0VfVEVYVFVSRScsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbWF0ZXJpYWwuZGVmaW5lKCdDQ19VU0VfTU9ERUwnLCB0cnVlKTtcbiAgICAgICAgICAgIG1hdGVyaWFsLmRlZmluZSgnVVNFX1RFWFRVUkUnLCBmYWxzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2VuYWJsZU1hdGVyaWFsKSB7XG4gICAgICAgICAgICB0aGlzLl9lbmFibGVNYXRlcmlhbCA9IE1hdGVyaWFsVmFyaWFudC5jcmVhdGVXaXRoQnVpbHRpbignMmQtc3ByaXRlJywgdGhpcyk7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgaWYgKCF0aGlzLl9leGl0TWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2V4aXRNYXRlcmlhbCA9IE1hdGVyaWFsVmFyaWFudC5jcmVhdGVXaXRoQnVpbHRpbignMmQtc3ByaXRlJywgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLl9leGl0TWF0ZXJpYWwuc2V0U3RlbmNpbEVuYWJsZWQoZ2Z4LlNURU5DSUxfRElTQUJMRSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2NsZWFyTWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFyTWF0ZXJpYWwgPSBNYXRlcmlhbFZhcmlhbnQuY3JlYXRlV2l0aEJ1aWx0aW4oJ2NsZWFyLXN0ZW5jaWwnLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0TWF0ZXJpYWwoMCwgbWF0ZXJpYWwpO1xuXG4gICAgICAgIHRoaXMuX2dyYXBoaWNzLl9tYXRlcmlhbHNbMF0gPSBtYXRlcmlhbDtcblxuICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbCgpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBsZXQgbWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbHNbMF07XG4gICAgICAgIGlmICghbWF0ZXJpYWwpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gTWFza1R5cGUuSU1BR0VfU1RFTkNJTCAmJiB0aGlzLnNwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICBsZXQgdGV4dHVyZSA9IHRoaXMuc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xuICAgICAgICAgICAgbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ3RleHR1cmUnLCB0ZXh0dXJlKTtcbiAgICAgICAgfVxuICAgICAgICBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgnYWxwaGFUaHJlc2hvbGQnLCB0aGlzLmFscGhhVGhyZXNob2xkKTtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUdyYXBoaWNzICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9ncmFwaGljcykge1xuICAgICAgICAgICAgdGhpcy5fZ3JhcGhpY3MgPSBuZXcgR3JhcGhpY3MoKTtcbiAgICAgICAgICAgIGNjLkFzc2VtYmxlci5pbml0KHRoaXMuX2dyYXBoaWNzKTtcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoaWNzLm5vZGUgPSB0aGlzLm5vZGU7XG4gICAgICAgICAgICB0aGlzLl9ncmFwaGljcy5saW5lV2lkdGggPSAwO1xuICAgICAgICAgICAgdGhpcy5fZ3JhcGhpY3Muc3Ryb2tlQ29sb3IgPSBjYy5jb2xvcigwLCAwLCAwLCAwKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlR3JhcGhpY3MgKCkge1xuICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZTtcbiAgICAgICAgbGV0IGdyYXBoaWNzID0gdGhpcy5fZ3JhcGhpY3M7XG4gICAgICAgIC8vIFNoYXJlIHJlbmRlciBkYXRhIHdpdGggZ3JhcGhpY3MgY29udGVudFxuICAgICAgICBncmFwaGljcy5jbGVhcihmYWxzZSk7XG4gICAgICAgIGxldCB3aWR0aCA9IG5vZGUuX2NvbnRlbnRTaXplLndpZHRoO1xuICAgICAgICBsZXQgaGVpZ2h0ID0gbm9kZS5fY29udGVudFNpemUuaGVpZ2h0O1xuICAgICAgICBsZXQgeCA9IC13aWR0aCAqIG5vZGUuX2FuY2hvclBvaW50Lng7XG4gICAgICAgIGxldCB5ID0gLWhlaWdodCAqIG5vZGUuX2FuY2hvclBvaW50Lnk7XG4gICAgICAgIGlmICh0aGlzLl90eXBlID09PSBNYXNrVHlwZS5SRUNUKSB7XG4gICAgICAgICAgICBncmFwaGljcy5yZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3R5cGUgPT09IE1hc2tUeXBlLkVMTElQU0UpIHtcbiAgICAgICAgICAgIGxldCBjZW50ZXIgPSBjYy52Mih4ICsgd2lkdGggLyAyLCB5ICsgaGVpZ2h0IC8gMik7XG4gICAgICAgICAgICBsZXQgcmFkaXVzID0ge1xuICAgICAgICAgICAgICAgIHg6IHdpZHRoIC8gMixcbiAgICAgICAgICAgICAgICB5OiBoZWlnaHQgLyAyXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IHBvaW50cyA9IF9jYWxjdWxhdGVDaXJjbGUoY2VudGVyLCByYWRpdXMsIHRoaXMuX3NlZ21lbnRzKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9pbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBvaW50ID0gcG9pbnRzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLm1vdmVUbyhwb2ludC54LCBwb2ludC55KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzLmxpbmVUbyhwb2ludC54LCBwb2ludC55KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncmFwaGljcy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYy5nYW1lLnJlbmRlclR5cGUgPT09IGNjLmdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTKSB7XG4gICAgICAgICAgICBncmFwaGljcy5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdyYXBoaWNzLmZpbGwoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVtb3ZlR3JhcGhpY3MgKCkge1xuICAgICAgICBpZiAodGhpcy5fZ3JhcGhpY3MpIHtcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoaWNzLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoaWNzLl9kZXN0cm95SW1tZWRpYXRlKCk7IC8vIEZJWDogY29jb3MtY3JlYXRvci8yZC10YXNrcyMyNTExLiBUT0RPOiBjb2Nvcy1jcmVhdG9yLzJkLXRhc2tzIzI1MTZcbiAgICAgICAgICAgIHRoaXMuX2dyYXBoaWNzID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGl0VGVzdCAoY2FtZXJhUHQpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGU7XG4gICAgICAgIGxldCBzaXplID0gbm9kZS5nZXRDb250ZW50U2l6ZSgpLFxuICAgICAgICAgICAgdyA9IHNpemUud2lkdGgsXG4gICAgICAgICAgICBoID0gc2l6ZS5oZWlnaHQsXG4gICAgICAgICAgICB0ZXN0UHQgPSBfdmVjMl90ZW1wO1xuICAgICAgICBcbiAgICAgICAgbm9kZS5fdXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICAgICAgLy8gSWYgc2NhbGUgaXMgMCwgaXQgY2FuJ3QgYmUgaGl0LlxuICAgICAgICBpZiAoIU1hdDQuaW52ZXJ0KF9tYXQ0X3RlbXAsIG5vZGUuX3dvcmxkTWF0cml4KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFZlYzIudHJhbnNmb3JtTWF0NCh0ZXN0UHQsIGNhbWVyYVB0LCBfbWF0NF90ZW1wKTtcbiAgICAgICAgdGVzdFB0LnggKz0gbm9kZS5fYW5jaG9yUG9pbnQueCAqIHc7XG4gICAgICAgIHRlc3RQdC55ICs9IG5vZGUuX2FuY2hvclBvaW50LnkgKiBoO1xuXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gTWFza1R5cGUuUkVDVCB8fCB0aGlzLnR5cGUgPT09IE1hc2tUeXBlLklNQUdFX1NURU5DSUwpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHRlc3RQdC54ID49IDAgJiYgdGVzdFB0LnkgPj0gMCAmJiB0ZXN0UHQueCA8PSB3ICYmIHRlc3RQdC55IDw9IGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSBNYXNrVHlwZS5FTExJUFNFKSB7XG4gICAgICAgICAgICBsZXQgcnggPSB3IC8gMiwgcnkgPSBoIC8gMjtcbiAgICAgICAgICAgIGxldCBweCA9IHRlc3RQdC54IC0gMC41ICogdywgcHkgPSB0ZXN0UHQueSAtIDAuNSAqIGg7XG4gICAgICAgICAgICByZXN1bHQgPSBweCAqIHB4IC8gKHJ4ICogcngpICsgcHkgKiBweSAvIChyeSAqIHJ5KSA8IDE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaW52ZXJ0ZWQpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9ICFyZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuXG4gICAgbWFya0ZvclJlbmRlciAoZW5hYmxlKSB7XG4gICAgICAgIGxldCBmbGFnID0gUmVuZGVyRmxvdy5GTEFHX1JFTkRFUiB8IFJlbmRlckZsb3cuRkxBR19VUERBVEVfUkVOREVSX0RBVEEgfCBSZW5kZXJGbG93LkZMQUdfUE9TVF9SRU5ERVI7XG4gICAgICAgIGlmIChlbmFibGUpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyB8PSBmbGFnO1xuICAgICAgICAgICAgdGhpcy5tYXJrRm9yVmFsaWRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghZW5hYmxlKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuX3JlbmRlckZsYWcgJj0gfmZsYWc7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZGlzYWJsZVJlbmRlciAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyAmPSB+KFJlbmRlckZsb3cuRkxBR19SRU5ERVIgfCBSZW5kZXJGbG93LkZMQUdfVVBEQVRFX1JFTkRFUl9EQVRBIHwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlbmRlckZsb3cuRkxBR19QT1NUX1JFTkRFUik7XG4gICAgfSxcbn0pO1xuXG5jYy5NYXNrID0gbW9kdWxlLmV4cG9ydHMgPSBNYXNrO1xuIl19