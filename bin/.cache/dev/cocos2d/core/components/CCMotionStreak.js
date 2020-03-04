
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCMotionStreak.js';
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
var RenderComponent = require('../components/CCRenderComponent');

var BlendFunc = require('../../core/utils/blend-func');
/**
 * !#en
 * cc.MotionStreak manages a Ribbon based on it's motion in absolute space.                 <br/>
 * You construct it with a fadeTime, minimum segment size, texture path, texture            <br/>
 * length and color. The fadeTime controls how long it takes each vertex in                 <br/>
 * the streak to fade out, the minimum segment size it how many pixels the                  <br/>
 * streak will move before adding a new ribbon segment, and the texture                     <br/>
 * length is the how many pixels the texture is stretched across. The texture               <br/>
 * is vertically aligned along the streak segment.
 * !#zh 运动轨迹，用于游戏对象的运动轨迹上实现拖尾渐隐效果。
 * @class MotionStreak
 * @extends Component
 * @uses BlendFunc
 */


var MotionStreak = cc.Class({
  name: 'cc.MotionStreak',
  // To avoid conflict with other render component, we haven't use ComponentUnderSG,
  // its implementation also requires some different approach:
  //   1.Needed a parent node to make motion streak's position global related.
  //   2.Need to update the position in each frame by itself because we don't know
  //     whether the global position have changed
  "extends": RenderComponent,
  mixins: [BlendFunc],
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.others/MotionStreak',
    help: 'i18n:COMPONENT.help_url.motionStreak',
    playOnFocus: true,
    executeInEditMode: true
  },
  ctor: function ctor() {
    this._points = [];
  },
  properties: {
    /**
     * !#en
     * !#zh 在编辑器模式下预览拖尾效果。
     * @property {Boolean} preview
     * @default false
     */
    preview: {
      "default": false,
      editorOnly: true,
      notify: CC_EDITOR && function () {
        this.reset();
      },
      animatable: false
    },

    /**
     * !#en The fade time to fade.
     * !#zh 拖尾的渐隐时间，以秒为单位。
     * @property fadeTime
     * @type {Number}
     * @example
     * motionStreak.fadeTime = 3;
     */
    _fadeTime: 1,
    fadeTime: {
      get: function get() {
        return this._fadeTime;
      },
      set: function set(value) {
        this._fadeTime = value;
        this.reset();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.fadeTime'
    },

    /**
     * !#en The minimum segment size.
     * !#zh 拖尾之间最小距离。
     * @property minSeg
     * @type {Number}
     * @example
     * motionStreak.minSeg = 3;
     */
    _minSeg: 1,
    minSeg: {
      get: function get() {
        return this._minSeg;
      },
      set: function set(value) {
        this._minSeg = value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.minSeg'
    },

    /**
     * !#en The stroke's width.
     * !#zh 拖尾的宽度。
     * @property stroke
     * @type {Number}
     * @example
     * motionStreak.stroke = 64;
     */
    _stroke: 64,
    stroke: {
      get: function get() {
        return this._stroke;
      },
      set: function set(value) {
        this._stroke = value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.stroke'
    },

    /**
     * !#en The texture of the MotionStreak.
     * !#zh 拖尾的贴图。
     * @property texture
     * @type {Texture2D}
     * @example
     * motionStreak.texture = newTexture;
     */
    _texture: {
      "default": null,
      type: cc.Texture2D
    },
    texture: {
      get: function get() {
        return this._texture;
      },
      set: function set(value) {
        if (this._texture === value) return;
        this._texture = value;

        this._updateMaterial();
      },
      type: cc.Texture2D,
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.texture'
    },

    /**
     * !#en The color of the MotionStreak.
     * !#zh 拖尾的颜色
     * @property color
     * @type {Color}
     * @default cc.Color.WHITE
     * @example
     * motionStreak.color = new cc.Color(255, 255, 255);
     */
    _color: cc.Color.WHITE,
    color: {
      get: function get() {
        return this._color;
      },
      set: function set(value) {
        this._color = value;
      },
      type: cc.Color,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.color'
    },

    /**
     * !#en The fast Mode.
     * !#zh 是否启用了快速模式。当启用快速模式，新的点会被更快地添加，但精度较低。
     * @property fastMode
     * @type {Boolean}
     * @default false
     * @example
     * motionStreak.fastMode = true;
     */
    _fastMode: false,
    fastMode: {
      get: function get() {
        return this._fastMode;
      },
      set: function set(value) {
        this._fastMode = value;
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.fastMode'
    }
  },
  onEnable: function onEnable() {
    this._super();

    this.reset();
  },
  _updateMaterial: function _updateMaterial() {
    var material = this.getMaterial(0);
    material && material.setProperty('texture', this._texture);

    BlendFunc.prototype._updateMaterial.call(this);
  },
  onFocusInEditor: CC_EDITOR && function () {
    if (this.preview) {
      this.reset();
    }
  },
  onLostFocusInEditor: CC_EDITOR && function () {
    if (this.preview) {
      this.reset();
    }
  },

  /**
   * !#en Remove all living segments of the ribbon.
   * !#zh 删除当前所有的拖尾片段。
   * @method reset
   * @example
   * // Remove all living segments of the ribbon.
   * myMotionStreak.reset();
   */
  reset: function reset() {
    this._points.length = 0;
    this._assembler && this._assembler._renderData.clear();

    if (CC_EDITOR) {
      cc.engine.repaintInEditMode();
    }
  },
  lateUpdate: function lateUpdate(dt) {
    this._assembler && this._assembler.update(this, dt);
  }
});
cc.MotionStreak = module.exports = MotionStreak;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTW90aW9uU3RyZWFrLmpzIl0sIm5hbWVzIjpbIlJlbmRlckNvbXBvbmVudCIsInJlcXVpcmUiLCJCbGVuZEZ1bmMiLCJNb3Rpb25TdHJlYWsiLCJjYyIsIkNsYXNzIiwibmFtZSIsIm1peGlucyIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJoZWxwIiwicGxheU9uRm9jdXMiLCJleGVjdXRlSW5FZGl0TW9kZSIsImN0b3IiLCJfcG9pbnRzIiwicHJvcGVydGllcyIsInByZXZpZXciLCJlZGl0b3JPbmx5Iiwibm90aWZ5IiwicmVzZXQiLCJhbmltYXRhYmxlIiwiX2ZhZGVUaW1lIiwiZmFkZVRpbWUiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsInRvb2x0aXAiLCJDQ19ERVYiLCJfbWluU2VnIiwibWluU2VnIiwiX3N0cm9rZSIsInN0cm9rZSIsIl90ZXh0dXJlIiwidHlwZSIsIlRleHR1cmUyRCIsInRleHR1cmUiLCJfdXBkYXRlTWF0ZXJpYWwiLCJfY29sb3IiLCJDb2xvciIsIldISVRFIiwiY29sb3IiLCJfZmFzdE1vZGUiLCJmYXN0TW9kZSIsIm9uRW5hYmxlIiwiX3N1cGVyIiwibWF0ZXJpYWwiLCJnZXRNYXRlcmlhbCIsInNldFByb3BlcnR5IiwicHJvdG90eXBlIiwiY2FsbCIsIm9uRm9jdXNJbkVkaXRvciIsIm9uTG9zdEZvY3VzSW5FZGl0b3IiLCJsZW5ndGgiLCJfYXNzZW1ibGVyIiwiX3JlbmRlckRhdGEiLCJjbGVhciIsImVuZ2luZSIsInJlcGFpbnRJbkVkaXRNb2RlIiwibGF0ZVVwZGF0ZSIsImR0IiwidXBkYXRlIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQU1BLGVBQWUsR0FBR0MsT0FBTyxDQUFDLGlDQUFELENBQS9COztBQUNBLElBQU1DLFNBQVMsR0FBR0QsT0FBTyxDQUFDLDZCQUFELENBQXpCO0FBRUE7Ozs7Ozs7Ozs7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QUUxQyxTQUFTLElBQUksWUFBWTtBQUN0QyxRQUFJLEtBQUtRLE9BQVQsRUFBa0I7QUFDZCxXQUFLRyxLQUFMO0FBQ0g7QUFDSixHQXpMdUI7QUEyTHhCZ0MsRUFBQUEsbUJBQW1CLEVBQUUzQyxTQUFTLElBQUksWUFBWTtBQUMxQyxRQUFJLEtBQUtRLE9BQVQsRUFBa0I7QUFDZCxXQUFLRyxLQUFMO0FBQ0g7QUFDSixHQS9MdUI7O0FBaU14Qjs7Ozs7Ozs7QUFRQUEsRUFBQUEsS0F6TXdCLG1CQXlNZjtBQUNMLFNBQUtMLE9BQUwsQ0FBYXNDLE1BQWIsR0FBc0IsQ0FBdEI7QUFDQSxTQUFLQyxVQUFMLElBQW1CLEtBQUtBLFVBQUwsQ0FBZ0JDLFdBQWhCLENBQTRCQyxLQUE1QixFQUFuQjs7QUFDQSxRQUFJL0MsU0FBSixFQUFlO0FBQ1hMLE1BQUFBLEVBQUUsQ0FBQ3FELE1BQUgsQ0FBVUMsaUJBQVY7QUFDSDtBQUNKLEdBL011QjtBQWlOeEJDLEVBQUFBLFVBak53QixzQkFpTlpDLEVBak5ZLEVBaU5SO0FBQ1osU0FBS04sVUFBTCxJQUFtQixLQUFLQSxVQUFMLENBQWdCTyxNQUFoQixDQUF1QixJQUF2QixFQUE2QkQsRUFBN0IsQ0FBbkI7QUFDSDtBQW5OdUIsQ0FBVCxDQUFuQjtBQXNOQXhELEVBQUUsQ0FBQ0QsWUFBSCxHQUFrQjJELE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjVELFlBQW5DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IFJlbmRlckNvbXBvbmVudCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvQ0NSZW5kZXJDb21wb25lbnQnKTtcbmNvbnN0IEJsZW5kRnVuYyA9IHJlcXVpcmUoJy4uLy4uL2NvcmUvdXRpbHMvYmxlbmQtZnVuYycpO1xuXG4vKipcbiAqICEjZW5cbiAqIGNjLk1vdGlvblN0cmVhayBtYW5hZ2VzIGEgUmliYm9uIGJhc2VkIG9uIGl0J3MgbW90aW9uIGluIGFic29sdXRlIHNwYWNlLiAgICAgICAgICAgICAgICAgPGJyLz5cbiAqIFlvdSBjb25zdHJ1Y3QgaXQgd2l0aCBhIGZhZGVUaW1lLCBtaW5pbXVtIHNlZ21lbnQgc2l6ZSwgdGV4dHVyZSBwYXRoLCB0ZXh0dXJlICAgICAgICAgICAgPGJyLz5cbiAqIGxlbmd0aCBhbmQgY29sb3IuIFRoZSBmYWRlVGltZSBjb250cm9scyBob3cgbG9uZyBpdCB0YWtlcyBlYWNoIHZlcnRleCBpbiAgICAgICAgICAgICAgICAgPGJyLz5cbiAqIHRoZSBzdHJlYWsgdG8gZmFkZSBvdXQsIHRoZSBtaW5pbXVtIHNlZ21lbnQgc2l6ZSBpdCBob3cgbWFueSBwaXhlbHMgdGhlICAgICAgICAgICAgICAgICAgPGJyLz5cbiAqIHN0cmVhayB3aWxsIG1vdmUgYmVmb3JlIGFkZGluZyBhIG5ldyByaWJib24gc2VnbWVudCwgYW5kIHRoZSB0ZXh0dXJlICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAqIGxlbmd0aCBpcyB0aGUgaG93IG1hbnkgcGl4ZWxzIHRoZSB0ZXh0dXJlIGlzIHN0cmV0Y2hlZCBhY3Jvc3MuIFRoZSB0ZXh0dXJlICAgICAgICAgICAgICAgPGJyLz5cbiAqIGlzIHZlcnRpY2FsbHkgYWxpZ25lZCBhbG9uZyB0aGUgc3RyZWFrIHNlZ21lbnQuXG4gKiAhI3poIOi/kOWKqOi9qOi/ue+8jOeUqOS6jua4uOaIj+WvueixoeeahOi/kOWKqOi9qOi/ueS4iuWunueOsOaLluWwvua4kOmakOaViOaenOOAglxuICogQGNsYXNzIE1vdGlvblN0cmVha1xuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKiBAdXNlcyBCbGVuZEZ1bmNcbiAqL1xudmFyIE1vdGlvblN0cmVhayA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuTW90aW9uU3RyZWFrJyxcblxuICAgIC8vIFRvIGF2b2lkIGNvbmZsaWN0IHdpdGggb3RoZXIgcmVuZGVyIGNvbXBvbmVudCwgd2UgaGF2ZW4ndCB1c2UgQ29tcG9uZW50VW5kZXJTRyxcbiAgICAvLyBpdHMgaW1wbGVtZW50YXRpb24gYWxzbyByZXF1aXJlcyBzb21lIGRpZmZlcmVudCBhcHByb2FjaDpcbiAgICAvLyAgIDEuTmVlZGVkIGEgcGFyZW50IG5vZGUgdG8gbWFrZSBtb3Rpb24gc3RyZWFrJ3MgcG9zaXRpb24gZ2xvYmFsIHJlbGF0ZWQuXG4gICAgLy8gICAyLk5lZWQgdG8gdXBkYXRlIHRoZSBwb3NpdGlvbiBpbiBlYWNoIGZyYW1lIGJ5IGl0c2VsZiBiZWNhdXNlIHdlIGRvbid0IGtub3dcbiAgICAvLyAgICAgd2hldGhlciB0aGUgZ2xvYmFsIHBvc2l0aW9uIGhhdmUgY2hhbmdlZFxuICAgIGV4dGVuZHM6IFJlbmRlckNvbXBvbmVudCxcbiAgICBtaXhpbnM6IFtCbGVuZEZ1bmNdLFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50Lm90aGVycy9Nb3Rpb25TdHJlYWsnLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwubW90aW9uU3RyZWFrJyxcbiAgICAgICAgcGxheU9uRm9jdXM6IHRydWUsXG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlXG4gICAgfSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9wb2ludHMgPSBbXTtcbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiAhI3poIOWcqOe8lui+keWZqOaooeW8j+S4i+mihOiniOaLluWwvuaViOaenOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHByZXZpZXdcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIHByZXZpZXc6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgZWRpdG9yT25seTogdHJ1ZSxcbiAgICAgICAgICAgIG5vdGlmeTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgZmFkZSB0aW1lIHRvIGZhZGUuXG4gICAgICAgICAqICEjemgg5ouW5bC+55qE5riQ6ZqQ5pe26Ze077yM5Lul56eS5Li65Y2V5L2N44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBmYWRlVGltZVxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBtb3Rpb25TdHJlYWsuZmFkZVRpbWUgPSAzO1xuICAgICAgICAgKi9cbiAgICAgICAgX2ZhZGVUaW1lOiAxLFxuICAgICAgICBmYWRlVGltZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZmFkZVRpbWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZhZGVUaW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5tb3Rpb25TdHJlYWsuZmFkZVRpbWUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIG1pbmltdW0gc2VnbWVudCBzaXplLlxuICAgICAgICAgKiAhI3poIOaLluWwvuS5i+mXtOacgOWwj+i3neemu+OAglxuICAgICAgICAgKiBAcHJvcGVydHkgbWluU2VnXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG1vdGlvblN0cmVhay5taW5TZWcgPSAzO1xuICAgICAgICAgKi9cbiAgICAgICAgX21pblNlZzogMSxcbiAgICAgICAgbWluU2VnOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9taW5TZWc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21pblNlZyA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5tb3Rpb25TdHJlYWsubWluU2VnJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBzdHJva2UncyB3aWR0aC5cbiAgICAgICAgICogISN6aCDmi5blsL7nmoTlrr3luqbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHN0cm9rZVxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBtb3Rpb25TdHJlYWsuc3Ryb2tlID0gNjQ7XG4gICAgICAgICAqL1xuICAgICAgICBfc3Ryb2tlOiA2NCxcbiAgICAgICAgc3Ryb2tlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdHJva2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0cm9rZSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5tb3Rpb25TdHJlYWsuc3Ryb2tlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSB0ZXh0dXJlIG9mIHRoZSBNb3Rpb25TdHJlYWsuXG4gICAgICAgICAqICEjemgg5ouW5bC+55qE6LS05Zu+44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB0ZXh0dXJlXG4gICAgICAgICAqIEB0eXBlIHtUZXh0dXJlMkR9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG1vdGlvblN0cmVhay50ZXh0dXJlID0gbmV3VGV4dHVyZTtcbiAgICAgICAgICovXG4gICAgICAgIF90ZXh0dXJlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuVGV4dHVyZTJEXG4gICAgICAgIH0sXG4gICAgICAgIHRleHR1cmU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHR1cmU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0dXJlID09PSB2YWx1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fdGV4dHVyZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogY2MuVGV4dHVyZTJELFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULm1vdGlvblN0cmVhay50ZXh0dXJlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBjb2xvciBvZiB0aGUgTW90aW9uU3RyZWFrLlxuICAgICAgICAgKiAhI3poIOaLluWwvueahOminOiJslxuICAgICAgICAgKiBAcHJvcGVydHkgY29sb3JcbiAgICAgICAgICogQHR5cGUge0NvbG9yfVxuICAgICAgICAgKiBAZGVmYXVsdCBjYy5Db2xvci5XSElURVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBtb3Rpb25TdHJlYWsuY29sb3IgPSBuZXcgY2MuQ29sb3IoMjU1LCAyNTUsIDI1NSk7XG4gICAgICAgICAqL1xuICAgICAgICBfY29sb3I6IGNjLkNvbG9yLldISVRFLFxuICAgICAgICBjb2xvcjoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogY2MuQ29sb3IsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULm1vdGlvblN0cmVhay5jb2xvcidcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgZmFzdCBNb2RlLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuWQr+eUqOS6huW/q+mAn+aooeW8j+OAguW9k+WQr+eUqOW/q+mAn+aooeW8j++8jOaWsOeahOeCueS8muiiq+abtOW/q+WcsOa3u+WKoO+8jOS9hueyvuW6pui+g+S9juOAglxuICAgICAgICAgKiBAcHJvcGVydHkgZmFzdE1vZGVcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG1vdGlvblN0cmVhay5mYXN0TW9kZSA9IHRydWU7XG4gICAgICAgICAqL1xuICAgICAgICBfZmFzdE1vZGU6IGZhbHNlLFxuICAgICAgICBmYXN0TW9kZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZmFzdE1vZGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Zhc3RNb2RlID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULm1vdGlvblN0cmVhay5mYXN0TW9kZSdcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZU1hdGVyaWFsICgpIHtcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gdGhpcy5nZXRNYXRlcmlhbCgwKTtcbiAgICAgICAgbWF0ZXJpYWwgJiYgbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ3RleHR1cmUnLCB0aGlzLl90ZXh0dXJlKTtcblxuICAgICAgICBCbGVuZEZ1bmMucHJvdG90eXBlLl91cGRhdGVNYXRlcmlhbC5jYWxsKHRoaXMpO1xuICAgIH0sXG5cbiAgICBvbkZvY3VzSW5FZGl0b3I6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnByZXZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvc3RGb2N1c0luRWRpdG9yOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wcmV2aWV3KSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZW1vdmUgYWxsIGxpdmluZyBzZWdtZW50cyBvZiB0aGUgcmliYm9uLlxuICAgICAqICEjemgg5Yig6Zmk5b2T5YmN5omA5pyJ55qE5ouW5bC+54mH5q6144CCXG4gICAgICogQG1ldGhvZCByZXNldFxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gUmVtb3ZlIGFsbCBsaXZpbmcgc2VnbWVudHMgb2YgdGhlIHJpYmJvbi5cbiAgICAgKiBteU1vdGlvblN0cmVhay5yZXNldCgpO1xuICAgICAqL1xuICAgIHJlc2V0ICgpIHtcbiAgICAgICAgdGhpcy5fcG9pbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX2Fzc2VtYmxlciAmJiB0aGlzLl9hc3NlbWJsZXIuX3JlbmRlckRhdGEuY2xlYXIoKTtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgY2MuZW5naW5lLnJlcGFpbnRJbkVkaXRNb2RlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgbGF0ZVVwZGF0ZSAoZHQpIHtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyICYmIHRoaXMuX2Fzc2VtYmxlci51cGRhdGUodGhpcywgZHQpO1xuICAgIH1cbn0pO1xuXG5jYy5Nb3Rpb25TdHJlYWsgPSBtb2R1bGUuZXhwb3J0cyA9IE1vdGlvblN0cmVhazsiXX0=