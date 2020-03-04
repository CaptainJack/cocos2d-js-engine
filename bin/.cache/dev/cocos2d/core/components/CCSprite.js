
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCSprite.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

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

var NodeEvent = require('../CCNode').EventType;

var RenderComponent = require('./CCRenderComponent');

var BlendFunc = require('../utils/blend-func');
/**
 * !#en Enum for sprite type.
 * !#zh Sprite 类型
 * @enum Sprite.Type
 */


var SpriteType = cc.Enum({
  /**
   * !#en The simple type.
   * !#zh 普通类型
   * @property {Number} SIMPLE
   */
  SIMPLE: 0,

  /**
   * !#en The sliced type.
   * !#zh 切片（九宫格）类型
   * @property {Number} SLICED
   */
  SLICED: 1,

  /**
   * !#en The tiled type.
   * !#zh 平铺类型
   * @property {Number} TILED
   */
  TILED: 2,

  /**
   * !#en The filled type.
   * !#zh 填充类型
   * @property {Number} FILLED
   */
  FILLED: 3,

  /**
   * !#en The mesh type.
   * !#zh 以 Mesh 三角形组成的类型
   * @property {Number} MESH
   */
  MESH: 4
});
/**
 * !#en Enum for fill type.
 * !#zh 填充类型
 * @enum Sprite.FillType
 */

var FillType = cc.Enum({
  /**
   * !#en The horizontal fill.
   * !#zh 水平方向填充
   * @property {Number} HORIZONTAL
   */
  HORIZONTAL: 0,

  /**
   * !#en The vertical fill.
   * !#zh 垂直方向填充
   * @property {Number} VERTICAL
   */
  VERTICAL: 1,

  /**
   * !#en The radial fill.
   * !#zh 径向填充
   * @property {Number} RADIAL
   */
  RADIAL: 2
});
/**
 * !#en Sprite Size can track trimmed size, raw size or none.
 * !#zh 精灵尺寸调整模式
 * @enum Sprite.SizeMode
 */

var SizeMode = cc.Enum({
  /**
   * !#en Use the customized node size.
   * !#zh 使用节点预设的尺寸
   * @property {Number} CUSTOM
   */
  CUSTOM: 0,

  /**
   * !#en Match the trimmed size of the sprite frame automatically.
   * !#zh 自动适配为精灵裁剪后的尺寸
   * @property {Number} TRIMMED
   */
  TRIMMED: 1,

  /**
   * !#en Match the raw size of the sprite frame automatically.
   * !#zh 自动适配为精灵原图尺寸
   * @property {Number} RAW
   */
  RAW: 2
});
/**
 * !#en Sprite state can choice the normal or grayscale.
 * !#zh 精灵颜色通道模式。
 * @enum Sprite.State
 * @deprecated
 */

var State = cc.Enum({
  /**
   * !#en The normal state
   * !#zh 正常状态
   * @property {Number} NORMAL
   */
  NORMAL: 0,

  /**
   * !#en The gray state, all color will be modified to grayscale value.
   * !#zh 灰色状态，所有颜色会被转换成灰度值
   * @property {Number} GRAY
   */
  GRAY: 1
});
/**
 * !#en Renders a sprite in the scene.
 * !#zh 该组件用于在场景中渲染精灵。
 * @class Sprite
 * @extends RenderComponent
 * @uses BlendFunc
 * @example
 *  // Create a new node and add sprite components.
 *  var node = new cc.Node("New Sprite");
 *  var sprite = node.addComponent(cc.Sprite);
 *  node.parent = this.node;
 */

var Sprite = cc.Class({
  name: 'cc.Sprite',
  "extends": RenderComponent,
  mixins: [BlendFunc],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/Sprite',
    help: 'i18n:COMPONENT.help_url.sprite',
    inspector: 'packages://inspector/inspectors/comps/sprite.js'
  },
  properties: {
    _spriteFrame: {
      "default": null,
      type: cc.SpriteFrame
    },
    _type: SpriteType.SIMPLE,
    _sizeMode: SizeMode.TRIMMED,
    _fillType: 0,
    _fillCenter: cc.v2(0, 0),
    _fillStart: 0,
    _fillRange: 0,
    _isTrimmedMode: true,
    _atlas: {
      "default": null,
      type: cc.SpriteAtlas,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.atlas',
      editorOnly: true,
      visible: true,
      animatable: false
    },

    /**
     * !#en The sprite frame of the sprite.
     * !#zh 精灵的精灵帧
     * @property spriteFrame
     * @type {SpriteFrame}
     * @example
     * sprite.spriteFrame = newSpriteFrame;
     */
    spriteFrame: {
      get: function get() {
        return this._spriteFrame;
      },
      set: function set(value, force) {
        var lastSprite = this._spriteFrame;

        if (CC_EDITOR) {
          if (!force && (lastSprite && lastSprite._uuid) === (value && value._uuid)) {
            return;
          }
        } else {
          if (lastSprite === value) {
            return;
          }
        }

        this._spriteFrame = value;

        this._applySpriteFrame(lastSprite);

        if (CC_EDITOR) {
          this.node.emit('spriteframe-changed', this);
        }
      },
      type: cc.SpriteFrame
    },

    /**
     * !#en The sprite render type.
     * !#zh 精灵渲染类型
     * @property type
     * @type {Sprite.Type}
     * @example
     * sprite.type = cc.Sprite.Type.SIMPLE;
     */
    type: {
      get: function get() {
        return this._type;
      },
      set: function set(value) {
        if (this._type !== value) {
          this._type = value;
          this.setVertsDirty();

          this._resetAssembler();
        }
      },
      type: SpriteType,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.type'
    },

    /**
     * !#en
     * The fill type, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 精灵填充类型，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillType
     * @type {Sprite.FillType}
     * @example
     * sprite.fillType = cc.Sprite.FillType.HORIZONTAL;
     */
    fillType: {
      get: function get() {
        return this._fillType;
      },
      set: function set(value) {
        if (value !== this._fillType) {
          this._fillType = value;
          this.setVertsDirty();

          this._resetAssembler();
        }
      },
      type: FillType,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_type'
    },

    /**
     * !#en
     * The fill Center, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 填充中心点，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillCenter
     * @type {Vec2}
     * @example
     * sprite.fillCenter = new cc.Vec2(0, 0);
     */
    fillCenter: {
      get: function get() {
        return this._fillCenter;
      },
      set: function set(value) {
        this._fillCenter.x = value.x;
        this._fillCenter.y = value.y;

        if (this._type === SpriteType.FILLED) {
          this.setVertsDirty();
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_center'
    },

    /**
     * !#en
     * The fill Start, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 填充起始点，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillStart
     * @type {Number}
     * @example
     * // -1 To 1 between the numbers
     * sprite.fillStart = 0.5;
     */
    fillStart: {
      get: function get() {
        return this._fillStart;
      },
      set: function set(value) {
        this._fillStart = misc.clampf(value, -1, 1);

        if (this._type === SpriteType.FILLED) {
          this.setVertsDirty();
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_start'
    },

    /**
     * !#en
     * The fill Range, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
     * !#zh
     * 填充范围，仅渲染类型设置为 cc.Sprite.Type.FILLED 时有效。
     * @property fillRange
     * @type {Number}
     * @example
     * // -1 To 1 between the numbers
     * sprite.fillRange = 1;
     */
    fillRange: {
      get: function get() {
        return this._fillRange;
      },
      set: function set(value) {
        this._fillRange = misc.clampf(value, -1, 1);

        if (this._type === SpriteType.FILLED) {
          this.setVertsDirty();
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.fill_range'
    },

    /**
     * !#en specify the frame is trimmed or not.
     * !#zh 是否使用裁剪模式
     * @property trim
     * @type {Boolean}
     * @example
     * sprite.trim = true;
     */
    trim: {
      get: function get() {
        return this._isTrimmedMode;
      },
      set: function set(value) {
        if (this._isTrimmedMode !== value) {
          this._isTrimmedMode = value;

          if (this._type === SpriteType.SIMPLE || this._type === SpriteType.MESH) {
            this.setVertsDirty();
          }
        }
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.trim'
    },

    /**
     * !#en specify the size tracing mode.
     * !#zh 精灵尺寸调整模式
     * @property sizeMode
     * @type {Sprite.SizeMode}
     * @example
     * sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
     */
    sizeMode: {
      get: function get() {
        return this._sizeMode;
      },
      set: function set(value) {
        this._sizeMode = value;

        if (value !== SizeMode.CUSTOM) {
          this._applySpriteSize();
        }
      },
      animatable: false,
      type: SizeMode,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.size_mode'
    }
  },
  statics: {
    FillType: FillType,
    Type: SpriteType,
    SizeMode: SizeMode,
    State: State
  },
  setVisible: function setVisible(visible) {
    this.enabled = visible;
  },

  /**
   * Change the state of sprite.
   * @method setState
   * @see `Sprite.State`
   * @param state {Sprite.State} NORMAL or GRAY State.
   * @deprecated
   */
  setState: function setState() {},

  /**
   * Gets the current state.
   * @method getState
   * @see `Sprite.State`
   * @return {Sprite.State}
   * @deprecated
   */
  getState: function getState() {},
  onEnable: function onEnable() {
    this._super();

    this._applySpriteFrame();

    this.node.on(cc.Node.EventType.SIZE_CHANGED, this.setVertsDirty, this);
    this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
  },
  onDisable: function onDisable() {
    this._super();

    this.node.off(cc.Node.EventType.SIZE_CHANGED, this.setVertsDirty, this);
    this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
  },
  _updateMaterial: function _updateMaterial() {
    var texture = this._spriteFrame && this._spriteFrame.getTexture(); // make sure material is belong to self.


    var material = this.getMaterial(0);
    material && material.setProperty('texture', texture);

    BlendFunc.prototype._updateMaterial.call(this);
  },
  _applyAtlas: CC_EDITOR && function (spriteFrame) {
    // Set atlas
    if (spriteFrame && spriteFrame._atlasUuid) {
      var self = this;
      cc.AssetLibrary.loadAsset(spriteFrame._atlasUuid, function (err, asset) {
        self._atlas = asset;
      });
    } else {
      this._atlas = null;
    }
  },
  _validateRender: function _validateRender() {
    var spriteFrame = this._spriteFrame;

    if (this._materials[0] && spriteFrame && spriteFrame.textureLoaded()) {
      return;
    }

    this.disableRender();
  },
  _applySpriteSize: function _applySpriteSize() {
    if (!this._spriteFrame || !this.isValid) return;

    if (SizeMode.RAW === this._sizeMode) {
      var size = this._spriteFrame._originalSize;
      this.node.setContentSize(size);
    } else if (SizeMode.TRIMMED === this._sizeMode) {
      var rect = this._spriteFrame._rect;
      this.node.setContentSize(rect.width, rect.height);
    }

    this.setVertsDirty();
  },
  _applySpriteFrame: function _applySpriteFrame(oldFrame) {
    var oldTexture = oldFrame && oldFrame.getTexture();

    if (oldTexture && !oldTexture.loaded) {
      oldFrame.off('load', this._applySpriteSize, this);
    }

    var spriteFrame = this._spriteFrame;

    if (spriteFrame) {
      this._updateMaterial();

      var newTexture = spriteFrame.getTexture();

      if (oldTexture === newTexture && newTexture.loaded) {
        this._applySpriteSize();
      } else {
        this.disableRender();
        spriteFrame.onTextureLoaded(this._applySpriteSize, this);
      }
    } else {
      this.disableRender();
    }

    if (CC_EDITOR) {
      // Set atlas
      this._applyAtlas(spriteFrame);
    }
  }
});

if (CC_EDITOR) {
  Sprite.prototype._resizedInEditor = function () {
    if (this._spriteFrame) {
      var actualSize = this.node.getContentSize();
      var expectedW = actualSize.width;
      var expectedH = actualSize.height;

      if (this._sizeMode === SizeMode.RAW) {
        var size = this._spriteFrame.getOriginalSize();

        expectedW = size.width;
        expectedH = size.height;
      } else if (this._sizeMode === SizeMode.TRIMMED) {
        var rect = this._spriteFrame.getRect();

        expectedW = rect.width;
        expectedH = rect.height;
      }

      if (expectedW !== actualSize.width || expectedH !== actualSize.height) {
        this._sizeMode = SizeMode.CUSTOM;
      }
    }
  }; // override __preload


  Sprite.prototype.__superPreload = cc.RenderComponent.prototype.__preload;

  Sprite.prototype.__preload = function () {
    if (this.__superPreload) this.__superPreload();
    this.node.on(NodeEvent.SIZE_CHANGED, this._resizedInEditor, this);
  }; // override onDestroy


  Sprite.prototype.__superOnDestroy = cc.Component.prototype.onDestroy;

  Sprite.prototype.onDestroy = function () {
    if (this.__superOnDestroy) this.__superOnDestroy();
    this.node.off(NodeEvent.SIZE_CHANGED, this._resizedInEditor, this);
  };
}

cc.Sprite = module.exports = Sprite;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU3ByaXRlLmpzIl0sIm5hbWVzIjpbIm1pc2MiLCJyZXF1aXJlIiwiTm9kZUV2ZW50IiwiRXZlbnRUeXBlIiwiUmVuZGVyQ29tcG9uZW50IiwiQmxlbmRGdW5jIiwiU3ByaXRlVHlwZSIsImNjIiwiRW51bSIsIlNJTVBMRSIsIlNMSUNFRCIsIlRJTEVEIiwiRklMTEVEIiwiTUVTSCIsIkZpbGxUeXBlIiwiSE9SSVpPTlRBTCIsIlZFUlRJQ0FMIiwiUkFESUFMIiwiU2l6ZU1vZGUiLCJDVVNUT00iLCJUUklNTUVEIiwiUkFXIiwiU3RhdGUiLCJOT1JNQUwiLCJHUkFZIiwiU3ByaXRlIiwiQ2xhc3MiLCJuYW1lIiwibWl4aW5zIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImhlbHAiLCJpbnNwZWN0b3IiLCJwcm9wZXJ0aWVzIiwiX3Nwcml0ZUZyYW1lIiwidHlwZSIsIlNwcml0ZUZyYW1lIiwiX3R5cGUiLCJfc2l6ZU1vZGUiLCJfZmlsbFR5cGUiLCJfZmlsbENlbnRlciIsInYyIiwiX2ZpbGxTdGFydCIsIl9maWxsUmFuZ2UiLCJfaXNUcmltbWVkTW9kZSIsIl9hdGxhcyIsIlNwcml0ZUF0bGFzIiwidG9vbHRpcCIsIkNDX0RFViIsImVkaXRvck9ubHkiLCJ2aXNpYmxlIiwiYW5pbWF0YWJsZSIsInNwcml0ZUZyYW1lIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJmb3JjZSIsImxhc3RTcHJpdGUiLCJfdXVpZCIsIl9hcHBseVNwcml0ZUZyYW1lIiwibm9kZSIsImVtaXQiLCJzZXRWZXJ0c0RpcnR5IiwiX3Jlc2V0QXNzZW1ibGVyIiwiZmlsbFR5cGUiLCJmaWxsQ2VudGVyIiwieCIsInkiLCJmaWxsU3RhcnQiLCJjbGFtcGYiLCJmaWxsUmFuZ2UiLCJ0cmltIiwic2l6ZU1vZGUiLCJfYXBwbHlTcHJpdGVTaXplIiwic3RhdGljcyIsIlR5cGUiLCJzZXRWaXNpYmxlIiwiZW5hYmxlZCIsInNldFN0YXRlIiwiZ2V0U3RhdGUiLCJvbkVuYWJsZSIsIl9zdXBlciIsIm9uIiwiTm9kZSIsIlNJWkVfQ0hBTkdFRCIsIkFOQ0hPUl9DSEFOR0VEIiwib25EaXNhYmxlIiwib2ZmIiwiX3VwZGF0ZU1hdGVyaWFsIiwidGV4dHVyZSIsImdldFRleHR1cmUiLCJtYXRlcmlhbCIsImdldE1hdGVyaWFsIiwic2V0UHJvcGVydHkiLCJwcm90b3R5cGUiLCJjYWxsIiwiX2FwcGx5QXRsYXMiLCJfYXRsYXNVdWlkIiwic2VsZiIsIkFzc2V0TGlicmFyeSIsImxvYWRBc3NldCIsImVyciIsImFzc2V0IiwiX3ZhbGlkYXRlUmVuZGVyIiwiX21hdGVyaWFscyIsInRleHR1cmVMb2FkZWQiLCJkaXNhYmxlUmVuZGVyIiwiaXNWYWxpZCIsInNpemUiLCJfb3JpZ2luYWxTaXplIiwic2V0Q29udGVudFNpemUiLCJyZWN0IiwiX3JlY3QiLCJ3aWR0aCIsImhlaWdodCIsIm9sZEZyYW1lIiwib2xkVGV4dHVyZSIsImxvYWRlZCIsIm5ld1RleHR1cmUiLCJvblRleHR1cmVMb2FkZWQiLCJfcmVzaXplZEluRWRpdG9yIiwiYWN0dWFsU2l6ZSIsImdldENvbnRlbnRTaXplIiwiZXhwZWN0ZWRXIiwiZXhwZWN0ZWRIIiwiZ2V0T3JpZ2luYWxTaXplIiwiZ2V0UmVjdCIsIl9fc3VwZXJQcmVsb2FkIiwiX19wcmVsb2FkIiwiX19zdXBlck9uRGVzdHJveSIsIkNvbXBvbmVudCIsIm9uRGVzdHJveSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxJQUFJLEdBQUdDLE9BQU8sQ0FBQyxlQUFELENBQXBCOztBQUNBLElBQU1DLFNBQVMsR0FBR0QsT0FBTyxDQUFDLFdBQUQsQ0FBUCxDQUFxQkUsU0FBdkM7O0FBQ0EsSUFBTUMsZUFBZSxHQUFHSCxPQUFPLENBQUMscUJBQUQsQ0FBL0I7O0FBQ0EsSUFBTUksU0FBUyxHQUFHSixPQUFPLENBQUMscUJBQUQsQ0FBekI7QUFHQTs7Ozs7OztB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KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBtaXNjID0gcmVxdWlyZSgnLi4vdXRpbHMvbWlzYycpO1xuY29uc3QgTm9kZUV2ZW50ID0gcmVxdWlyZSgnLi4vQ0NOb2RlJykuRXZlbnRUeXBlO1xuY29uc3QgUmVuZGVyQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9DQ1JlbmRlckNvbXBvbmVudCcpO1xuY29uc3QgQmxlbmRGdW5jID0gcmVxdWlyZSgnLi4vdXRpbHMvYmxlbmQtZnVuYycpO1xuXG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBzcHJpdGUgdHlwZS5cbiAqICEjemggU3ByaXRlIOexu+Wei1xuICogQGVudW0gU3ByaXRlLlR5cGVcbiAqL1xudmFyIFNwcml0ZVR5cGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzaW1wbGUgdHlwZS5cbiAgICAgKiAhI3poIOaZrumAmuexu+Wei1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTSU1QTEVcbiAgICAgKi9cbiAgICBTSU1QTEU6IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgc2xpY2VkIHR5cGUuXG4gICAgICogISN6aCDliIfniYfvvIjkuZ3lrqvmoLzvvInnsbvlnotcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gU0xJQ0VEXG4gICAgICovXG4gICAgU0xJQ0VEOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHRpbGVkIHR5cGUuXG4gICAgICogISN6aCDlubPpk7rnsbvlnotcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVElMRURcbiAgICAgKi9cbiAgICBUSUxFRDogMixcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBmaWxsZWQgdHlwZS5cbiAgICAgKiAhI3poIOWhq+WFheexu+Wei1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBGSUxMRURcbiAgICAgKi9cbiAgICBGSUxMRUQ6IDMsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbWVzaCB0eXBlLlxuICAgICAqICEjemgg5LulIE1lc2gg5LiJ6KeS5b2i57uE5oiQ55qE57G75Z6LXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IE1FU0hcbiAgICAgKi9cbiAgICBNRVNIOiA0XG59KTtcblxuLyoqXG4gKiAhI2VuIEVudW0gZm9yIGZpbGwgdHlwZS5cbiAqICEjemgg5aGr5YWF57G75Z6LXG4gKiBAZW51bSBTcHJpdGUuRmlsbFR5cGVcbiAqL1xudmFyIEZpbGxUeXBlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgaG9yaXpvbnRhbCBmaWxsLlxuICAgICAqICEjemgg5rC05bmz5pa55ZCR5aGr5YWFXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEhPUklaT05UQUxcbiAgICAgKi9cbiAgICBIT1JJWk9OVEFMOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHZlcnRpY2FsIGZpbGwuXG4gICAgICogISN6aCDlnoLnm7TmlrnlkJHloavlhYVcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVkVSVElDQUxcbiAgICAgKi9cbiAgICBWRVJUSUNBTDogMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSByYWRpYWwgZmlsbC5cbiAgICAgKiAhI3poIOW+hOWQkeWhq+WFhVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBSQURJQUxcbiAgICAgKi9cbiAgICBSQURJQUw6Mixcbn0pO1xuXG4vKipcbiAqICEjZW4gU3ByaXRlIFNpemUgY2FuIHRyYWNrIHRyaW1tZWQgc2l6ZSwgcmF3IHNpemUgb3Igbm9uZS5cbiAqICEjemgg57K+54G15bC65a+46LCD5pW05qih5byPXG4gKiBAZW51bSBTcHJpdGUuU2l6ZU1vZGVcbiAqL1xudmFyIFNpemVNb2RlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBVc2UgdGhlIGN1c3RvbWl6ZWQgbm9kZSBzaXplLlxuICAgICAqICEjemgg5L2/55So6IqC54K56aKE6K6+55qE5bC65a+4XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IENVU1RPTVxuICAgICAqL1xuICAgIENVU1RPTTogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIE1hdGNoIHRoZSB0cmltbWVkIHNpemUgb2YgdGhlIHNwcml0ZSBmcmFtZSBhdXRvbWF0aWNhbGx5LlxuICAgICAqICEjemgg6Ieq5Yqo6YCC6YWN5Li657K+54G16KOB5Ymq5ZCO55qE5bC65a+4XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFRSSU1NRURcbiAgICAgKi9cbiAgICBUUklNTUVEOiAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gTWF0Y2ggdGhlIHJhdyBzaXplIG9mIHRoZSBzcHJpdGUgZnJhbWUgYXV0b21hdGljYWxseS5cbiAgICAgKiAhI3poIOiHquWKqOmAgumFjeS4uueyvueBteWOn+WbvuWwuuWvuFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBSQVdcbiAgICAgKi9cbiAgICBSQVc6IDJcbn0pO1xuLyoqXG4gKiAhI2VuIFNwcml0ZSBzdGF0ZSBjYW4gY2hvaWNlIHRoZSBub3JtYWwgb3IgZ3JheXNjYWxlLlxuICogISN6aCDnsr7ngbXpopzoibLpgJrpgZPmqKHlvI/jgIJcbiAqIEBlbnVtIFNwcml0ZS5TdGF0ZVxuICogQGRlcHJlY2F0ZWRcbiAqL1xudmFyIFN0YXRlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgbm9ybWFsIHN0YXRlXG4gICAgICogISN6aCDmraPluLjnirbmgIFcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gTk9STUFMXG4gICAgICovXG4gICAgTk9STUFMOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGdyYXkgc3RhdGUsIGFsbCBjb2xvciB3aWxsIGJlIG1vZGlmaWVkIHRvIGdyYXlzY2FsZSB2YWx1ZS5cbiAgICAgKiAhI3poIOeBsOiJsueKtuaAge+8jOaJgOacieminOiJsuS8muiiq+i9rOaNouaIkOeBsOW6puWAvFxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBHUkFZXG4gICAgICovXG4gICAgR1JBWTogMVxufSk7XG5cbi8qKlxuICogISNlbiBSZW5kZXJzIGEgc3ByaXRlIGluIHRoZSBzY2VuZS5cbiAqICEjemgg6K+l57uE5Lu255So5LqO5Zyo5Zy65pmv5Lit5riy5p+T57K+54G144CCXG4gKiBAY2xhc3MgU3ByaXRlXG4gKiBAZXh0ZW5kcyBSZW5kZXJDb21wb25lbnRcbiAqIEB1c2VzIEJsZW5kRnVuY1xuICogQGV4YW1wbGVcbiAqICAvLyBDcmVhdGUgYSBuZXcgbm9kZSBhbmQgYWRkIHNwcml0ZSBjb21wb25lbnRzLlxuICogIHZhciBub2RlID0gbmV3IGNjLk5vZGUoXCJOZXcgU3ByaXRlXCIpO1xuICogIHZhciBzcHJpdGUgPSBub2RlLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICogIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICovXG52YXIgU3ByaXRlID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5TcHJpdGUnLFxuICAgIGV4dGVuZHM6IFJlbmRlckNvbXBvbmVudCxcbiAgICBtaXhpbnM6IFtCbGVuZEZ1bmNdLFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnJlbmRlcmVycy9TcHJpdGUnLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwuc3ByaXRlJyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9zcHJpdGUuanMnLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9zcHJpdGVGcmFtZToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lXG4gICAgICAgIH0sXG4gICAgICAgIF90eXBlOiBTcHJpdGVUeXBlLlNJTVBMRSxcbiAgICAgICAgX3NpemVNb2RlOiBTaXplTW9kZS5UUklNTUVELFxuICAgICAgICBfZmlsbFR5cGU6IDAsXG4gICAgICAgIF9maWxsQ2VudGVyOiBjYy52MigwLDApLFxuICAgICAgICBfZmlsbFN0YXJ0OiAwLFxuICAgICAgICBfZmlsbFJhbmdlOiAwLFxuICAgICAgICBfaXNUcmltbWVkTW9kZTogdHJ1ZSxcbiAgICAgICAgX2F0bGFzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlQXRsYXMsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNwcml0ZS5hdGxhcycsXG4gICAgICAgICAgICBlZGl0b3JPbmx5OiB0cnVlLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHNwcml0ZSBmcmFtZSBvZiB0aGUgc3ByaXRlLlxuICAgICAgICAgKiAhI3poIOeyvueBteeahOeyvueBteW4p1xuICAgICAgICAgKiBAcHJvcGVydHkgc3ByaXRlRnJhbWVcbiAgICAgICAgICogQHR5cGUge1Nwcml0ZUZyYW1lfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBzcHJpdGUuc3ByaXRlRnJhbWUgPSBuZXdTcHJpdGVGcmFtZTtcbiAgICAgICAgICovXG4gICAgICAgIHNwcml0ZUZyYW1lOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcHJpdGVGcmFtZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlLCBmb3JjZSkge1xuICAgICAgICAgICAgICAgIHZhciBsYXN0U3ByaXRlID0gdGhpcy5fc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvcmNlICYmICgobGFzdFNwcml0ZSAmJiBsYXN0U3ByaXRlLl91dWlkKSA9PT0gKHZhbHVlICYmIHZhbHVlLl91dWlkKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RTcHJpdGUgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fc3ByaXRlRnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcHBseVNwcml0ZUZyYW1lKGxhc3RTcHJpdGUpO1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ3Nwcml0ZWZyYW1lLWNoYW5nZWQnLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlRnJhbWUsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHNwcml0ZSByZW5kZXIgdHlwZS5cbiAgICAgICAgICogISN6aCDnsr7ngbXmuLLmn5PnsbvlnotcbiAgICAgICAgICogQHByb3BlcnR5IHR5cGVcbiAgICAgICAgICogQHR5cGUge1Nwcml0ZS5UeXBlfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBzcHJpdGUudHlwZSA9IGNjLlNwcml0ZS5UeXBlLlNJTVBMRTtcbiAgICAgICAgICovXG4gICAgICAgIHR5cGU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90eXBlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90eXBlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXNldEFzc2VtYmxlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBTcHJpdGVUeXBlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNwcml0ZS50eXBlJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgZmlsbCB0eXBlLCBUaGlzIHdpbGwgb25seSBoYXZlIGFueSBlZmZlY3QgaWYgdGhlIFwidHlwZVwiIGlzIHNldCB0byDigJxjYy5TcHJpdGUuVHlwZS5GSUxMRUTigJ0uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog57K+54G15aGr5YWF57G75Z6L77yM5LuF5riy5p+T57G75Z6L6K6+572u5Li6IGNjLlNwcml0ZS5UeXBlLkZJTExFRCDml7bmnInmlYjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGZpbGxUeXBlXG4gICAgICAgICAqIEB0eXBlIHtTcHJpdGUuRmlsbFR5cGV9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHNwcml0ZS5maWxsVHlwZSA9IGNjLlNwcml0ZS5GaWxsVHlwZS5IT1JJWk9OVEFMO1xuICAgICAgICAgKi9cbiAgICAgICAgZmlsbFR5cGUgOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9maWxsVHlwZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9maWxsVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9maWxsVHlwZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVzZXRBc3NlbWJsZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogRmlsbFR5cGUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNwcml0ZS5maWxsX3R5cGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGZpbGwgQ2VudGVyLCBUaGlzIHdpbGwgb25seSBoYXZlIGFueSBlZmZlY3QgaWYgdGhlIFwidHlwZVwiIGlzIHNldCB0byDigJxjYy5TcHJpdGUuVHlwZS5GSUxMRUTigJ0uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5aGr5YWF5Lit5b+D54K577yM5LuF5riy5p+T57G75Z6L6K6+572u5Li6IGNjLlNwcml0ZS5UeXBlLkZJTExFRCDml7bmnInmlYjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGZpbGxDZW50ZXJcbiAgICAgICAgICogQHR5cGUge1ZlYzJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHNwcml0ZS5maWxsQ2VudGVyID0gbmV3IGNjLlZlYzIoMCwgMCk7XG4gICAgICAgICAqL1xuICAgICAgICBmaWxsQ2VudGVyOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9maWxsQ2VudGVyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9maWxsQ2VudGVyLnggPSB2YWx1ZS54O1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbGxDZW50ZXIueSA9IHZhbHVlLnk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IFNwcml0ZVR5cGUuRklMTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNwcml0ZS5maWxsX2NlbnRlcicsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGZpbGwgU3RhcnQsIFRoaXMgd2lsbCBvbmx5IGhhdmUgYW55IGVmZmVjdCBpZiB0aGUgXCJ0eXBlXCIgaXMgc2V0IHRvIOKAnGNjLlNwcml0ZS5UeXBlLkZJTExFROKAnS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDloavlhYXotbflp4vngrnvvIzku4XmuLLmn5Pnsbvlnovorr7nva7kuLogY2MuU3ByaXRlLlR5cGUuRklMTEVEIOaXtuacieaViOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgZmlsbFN0YXJ0XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIC8vIC0xIFRvIDEgYmV0d2VlbiB0aGUgbnVtYmVyc1xuICAgICAgICAgKiBzcHJpdGUuZmlsbFN0YXJ0ID0gMC41O1xuICAgICAgICAgKi9cbiAgICAgICAgZmlsbFN0YXJ0OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9maWxsU3RhcnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZpbGxTdGFydCA9IG1pc2MuY2xhbXBmKHZhbHVlLCAtMSwgMSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IFNwcml0ZVR5cGUuRklMTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNwcml0ZS5maWxsX3N0YXJ0J1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBmaWxsIFJhbmdlLCBUaGlzIHdpbGwgb25seSBoYXZlIGFueSBlZmZlY3QgaWYgdGhlIFwidHlwZVwiIGlzIHNldCB0byDigJxjYy5TcHJpdGUuVHlwZS5GSUxMRUTigJ0uXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5aGr5YWF6IyD5Zu077yM5LuF5riy5p+T57G75Z6L6K6+572u5Li6IGNjLlNwcml0ZS5UeXBlLkZJTExFRCDml7bmnInmlYjjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGZpbGxSYW5nZVxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiAvLyAtMSBUbyAxIGJldHdlZW4gdGhlIG51bWJlcnNcbiAgICAgICAgICogc3ByaXRlLmZpbGxSYW5nZSA9IDE7XG4gICAgICAgICAqL1xuICAgICAgICBmaWxsUmFuZ2U6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZpbGxSYW5nZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmlsbFJhbmdlID0gbWlzYy5jbGFtcGYodmFsdWUsIC0xLCAxKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHlwZSA9PT0gU3ByaXRlVHlwZS5GSUxMRUQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc3ByaXRlLmZpbGxfcmFuZ2UnXG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIHNwZWNpZnkgdGhlIGZyYW1lIGlzIHRyaW1tZWQgb3Igbm90LlxuICAgICAgICAgKiAhI3poIOaYr+WQpuS9v+eUqOijgeWJquaooeW8j1xuICAgICAgICAgKiBAcHJvcGVydHkgdHJpbVxuICAgICAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogc3ByaXRlLnRyaW0gPSB0cnVlO1xuICAgICAgICAgKi9cbiAgICAgICAgdHJpbToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNUcmltbWVkTW9kZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzVHJpbW1lZE1vZGUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzVHJpbW1lZE1vZGUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3R5cGUgPT09IFNwcml0ZVR5cGUuU0lNUExFIHx8IHRoaXMuX3R5cGUgPT09IFNwcml0ZVR5cGUuTUVTSCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNwcml0ZS50cmltJ1xuICAgICAgICB9LFxuXG4gICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gc3BlY2lmeSB0aGUgc2l6ZSB0cmFjaW5nIG1vZGUuXG4gICAgICAgICAqICEjemgg57K+54G15bC65a+46LCD5pW05qih5byPXG4gICAgICAgICAqIEBwcm9wZXJ0eSBzaXplTW9kZVxuICAgICAgICAgKiBAdHlwZSB7U3ByaXRlLlNpemVNb2RlfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBzcHJpdGUuc2l6ZU1vZGUgPSBjYy5TcHJpdGUuU2l6ZU1vZGUuQ1VTVE9NO1xuICAgICAgICAgKi9cbiAgICAgICAgc2l6ZU1vZGU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NpemVNb2RlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplTW9kZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gU2l6ZU1vZGUuQ1VTVE9NKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FwcGx5U3ByaXRlU2l6ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHR5cGU6IFNpemVNb2RlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5zcHJpdGUuc2l6ZV9tb2RlJ1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHN0YXRpY3M6IHtcbiAgICAgICAgRmlsbFR5cGU6IEZpbGxUeXBlLFxuICAgICAgICBUeXBlOiBTcHJpdGVUeXBlLFxuICAgICAgICBTaXplTW9kZTogU2l6ZU1vZGUsXG4gICAgICAgIFN0YXRlOiBTdGF0ZSxcbiAgICB9LFxuXG4gICAgc2V0VmlzaWJsZSAodmlzaWJsZSkge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSB2aXNpYmxlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIHN0YXRlIG9mIHNwcml0ZS5cbiAgICAgKiBAbWV0aG9kIHNldFN0YXRlXG4gICAgICogQHNlZSBgU3ByaXRlLlN0YXRlYFxuICAgICAqIEBwYXJhbSBzdGF0ZSB7U3ByaXRlLlN0YXRlfSBOT1JNQUwgb3IgR1JBWSBTdGF0ZS5cbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIHNldFN0YXRlICgpIHt9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY3VycmVudCBzdGF0ZS5cbiAgICAgKiBAbWV0aG9kIGdldFN0YXRlXG4gICAgICogQHNlZSBgU3ByaXRlLlN0YXRlYFxuICAgICAqIEByZXR1cm4ge1Nwcml0ZS5TdGF0ZX1cbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIGdldFN0YXRlICgpIHt9LFxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLl9hcHBseVNwcml0ZUZyYW1lKCk7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5zZXRWZXJ0c0RpcnR5LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLnNldFZlcnRzRGlydHksIHRoaXMpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuc2V0VmVydHNEaXJ0eSwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIHRoaXMuc2V0VmVydHNEaXJ0eSwgdGhpcyk7XG4gICAgfSxcblxuICAgIF91cGRhdGVNYXRlcmlhbCAoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlID0gdGhpcy5fc3ByaXRlRnJhbWUgJiYgdGhpcy5fc3ByaXRlRnJhbWUuZ2V0VGV4dHVyZSgpO1xuICAgICAgICBcbiAgICAgICAgLy8gbWFrZSBzdXJlIG1hdGVyaWFsIGlzIGJlbG9uZyB0byBzZWxmLlxuICAgICAgICBsZXQgbWF0ZXJpYWwgPSB0aGlzLmdldE1hdGVyaWFsKDApO1xuICAgICAgICBtYXRlcmlhbCAmJiBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgndGV4dHVyZScsIHRleHR1cmUpO1xuXG4gICAgICAgIEJsZW5kRnVuYy5wcm90b3R5cGUuX3VwZGF0ZU1hdGVyaWFsLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIF9hcHBseUF0bGFzOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKHNwcml0ZUZyYW1lKSB7XG4gICAgICAgIC8vIFNldCBhdGxhc1xuICAgICAgICBpZiAoc3ByaXRlRnJhbWUgJiYgc3ByaXRlRnJhbWUuX2F0bGFzVXVpZCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgY2MuQXNzZXRMaWJyYXJ5LmxvYWRBc3NldChzcHJpdGVGcmFtZS5fYXRsYXNVdWlkLCBmdW5jdGlvbiAoZXJyLCBhc3NldCkge1xuICAgICAgICAgICAgICAgIHNlbGYuX2F0bGFzID0gYXNzZXQ7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2F0bGFzID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdmFsaWRhdGVSZW5kZXIgKCkge1xuICAgICAgICBsZXQgc3ByaXRlRnJhbWUgPSB0aGlzLl9zcHJpdGVGcmFtZTtcbiAgICAgICAgaWYgKHRoaXMuX21hdGVyaWFsc1swXSAmJlxuICAgICAgICAgICAgc3ByaXRlRnJhbWUgJiYgXG4gICAgICAgICAgICBzcHJpdGVGcmFtZS50ZXh0dXJlTG9hZGVkKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlTcHJpdGVTaXplICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zcHJpdGVGcmFtZSB8fCAhdGhpcy5pc1ZhbGlkKSAgcmV0dXJuO1xuICAgICAgICBcbiAgICAgICAgaWYgKFNpemVNb2RlLlJBVyA9PT0gdGhpcy5fc2l6ZU1vZGUpIHtcbiAgICAgICAgICAgIHZhciBzaXplID0gdGhpcy5fc3ByaXRlRnJhbWUuX29yaWdpbmFsU2l6ZTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZShzaXplKTtcbiAgICAgICAgfSBlbHNlIGlmIChTaXplTW9kZS5UUklNTUVEID09PSB0aGlzLl9zaXplTW9kZSkge1xuICAgICAgICAgICAgdmFyIHJlY3QgPSB0aGlzLl9zcHJpdGVGcmFtZS5fcmVjdDtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZShyZWN0LndpZHRoLCByZWN0LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgIH0sXG5cbiAgICBfYXBwbHlTcHJpdGVGcmFtZSAob2xkRnJhbWUpIHtcbiAgICAgICAgbGV0IG9sZFRleHR1cmUgPSBvbGRGcmFtZSAmJiBvbGRGcmFtZS5nZXRUZXh0dXJlKCk7XG4gICAgICAgIGlmIChvbGRUZXh0dXJlICYmICFvbGRUZXh0dXJlLmxvYWRlZCkge1xuICAgICAgICAgICAgb2xkRnJhbWUub2ZmKCdsb2FkJywgdGhpcy5fYXBwbHlTcHJpdGVTaXplLCB0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IHRoaXMuX3Nwcml0ZUZyYW1lO1xuICAgICAgICBpZiAoc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsKCk7XG4gICAgICAgICAgICBsZXQgbmV3VGV4dHVyZSA9IHNwcml0ZUZyYW1lLmdldFRleHR1cmUoKTtcbiAgICAgICAgICAgIGlmIChvbGRUZXh0dXJlID09PSBuZXdUZXh0dXJlICYmIG5ld1RleHR1cmUubG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXBwbHlTcHJpdGVTaXplKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgICAgICAgICBzcHJpdGVGcmFtZS5vblRleHR1cmVMb2FkZWQodGhpcy5fYXBwbHlTcHJpdGVTaXplLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgLy8gU2V0IGF0bGFzXG4gICAgICAgICAgICB0aGlzLl9hcHBseUF0bGFzKHNwcml0ZUZyYW1lKTtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxuaWYgKENDX0VESVRPUikge1xuICAgIFNwcml0ZS5wcm90b3R5cGUuX3Jlc2l6ZWRJbkVkaXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3Nwcml0ZUZyYW1lKSB7XG4gICAgICAgICAgICB2YXIgYWN0dWFsU2l6ZSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICAgICAgdmFyIGV4cGVjdGVkVyA9IGFjdHVhbFNpemUud2lkdGg7XG4gICAgICAgICAgICB2YXIgZXhwZWN0ZWRIID0gYWN0dWFsU2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2l6ZU1vZGUgPT09IFNpemVNb2RlLlJBVykge1xuICAgICAgICAgICAgICAgIHZhciBzaXplID0gdGhpcy5fc3ByaXRlRnJhbWUuZ2V0T3JpZ2luYWxTaXplKCk7XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWRXID0gc2l6ZS53aWR0aDtcbiAgICAgICAgICAgICAgICBleHBlY3RlZEggPSBzaXplLmhlaWdodDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fc2l6ZU1vZGUgPT09IFNpemVNb2RlLlRSSU1NRUQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVjdCA9IHRoaXMuX3Nwcml0ZUZyYW1lLmdldFJlY3QoKTtcbiAgICAgICAgICAgICAgICBleHBlY3RlZFcgPSByZWN0LndpZHRoO1xuICAgICAgICAgICAgICAgIGV4cGVjdGVkSCA9IHJlY3QuaGVpZ2h0O1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChleHBlY3RlZFcgIT09IGFjdHVhbFNpemUud2lkdGggfHwgZXhwZWN0ZWRIICE9PSBhY3R1YWxTaXplLmhlaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NpemVNb2RlID0gU2l6ZU1vZGUuQ1VTVE9NO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIG92ZXJyaWRlIF9fcHJlbG9hZFxuICAgIFNwcml0ZS5wcm90b3R5cGUuX19zdXBlclByZWxvYWQgPSBjYy5SZW5kZXJDb21wb25lbnQucHJvdG90eXBlLl9fcHJlbG9hZDtcbiAgICBTcHJpdGUucHJvdG90eXBlLl9fcHJlbG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX19zdXBlclByZWxvYWQpIHRoaXMuX19zdXBlclByZWxvYWQoKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKE5vZGVFdmVudC5TSVpFX0NIQU5HRUQsIHRoaXMuX3Jlc2l6ZWRJbkVkaXRvciwgdGhpcyk7XG4gICAgfTtcbiAgICAvLyBvdmVycmlkZSBvbkRlc3Ryb3lcbiAgICBTcHJpdGUucHJvdG90eXBlLl9fc3VwZXJPbkRlc3Ryb3kgPSBjYy5Db21wb25lbnQucHJvdG90eXBlLm9uRGVzdHJveTtcbiAgICBTcHJpdGUucHJvdG90eXBlLm9uRGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX19zdXBlck9uRGVzdHJveSkgdGhpcy5fX3N1cGVyT25EZXN0cm95KCk7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoTm9kZUV2ZW50LlNJWkVfQ0hBTkdFRCwgdGhpcy5fcmVzaXplZEluRWRpdG9yLCB0aGlzKTtcbiAgICB9O1xufVxuXG5jYy5TcHJpdGUgPSBtb2R1bGUuZXhwb3J0cyA9IFNwcml0ZTtcbiJdfQ==