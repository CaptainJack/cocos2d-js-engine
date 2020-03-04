
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCProgressBar.js';
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

var Component = require('./CCComponent');
/**
 * !#en Enum for ProgressBar mode
 * !#zh 进度条模式
 * @enum ProgressBar.Mode
 */


var Mode = cc.Enum({
  /**
   * !#en TODO
   * !#zh 水平方向模式
   * @property {Number} HORIZONTAL
   */
  HORIZONTAL: 0,

  /**
   * !#en TODO
   * !#zh 垂直方向模式
   * @property {Number} VERTICAL
   */
  VERTICAL: 1,

  /**
   * !#en TODO
   * !#zh 填充模式
   * @property {Number} FILLED
   */
  FILLED: 2
});
/**
 * !#en
 * Visual indicator of progress in some operation.
 * Displays a bar to the user representing how far the operation has progressed.
 * !#zh
 * 进度条组件，可用于显示加载资源时的进度。
 * @class ProgressBar
 * @extends Component
 * @example
 * // update progressBar
 * update: function (dt) {
 *     var progress = progressBar.progress;
 *     if (progress > 0) {
 *         progress += dt;
 *     }
 *     else {
 *         progress = 1;
 *     }
 *     progressBar.progress = progress;
 * }
 *
 */

var ProgressBar = cc.Class({
  name: 'cc.ProgressBar',
  "extends": Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/ProgressBar',
    help: 'i18n:COMPONENT.help_url.progressbar'
  },
  _initBarSprite: function _initBarSprite() {
    if (this.barSprite) {
      var entity = this.barSprite.node;
      if (!entity) return;
      var nodeSize = this.node.getContentSize();
      var nodeAnchor = this.node.getAnchorPoint();
      var entitySize = entity.getContentSize();

      if (entity.parent === this.node) {
        this.node.setContentSize(entitySize);
      }

      if (this.barSprite.fillType === cc.Sprite.FillType.RADIAL) {
        this.mode = Mode.FILLED;
      }

      var barSpriteSize = entity.getContentSize();

      if (this.mode === Mode.HORIZONTAL) {
        this.totalLength = barSpriteSize.width;
      } else if (this.mode === Mode.VERTICAL) {
        this.totalLength = barSpriteSize.height;
      } else {
        this.totalLength = this.barSprite.fillRange;
      }

      if (entity.parent === this.node) {
        var x = -nodeSize.width * nodeAnchor.x;
        var y = 0;
        entity.setPosition(cc.v2(x, y));
      }
    }
  },
  _updateBarStatus: function _updateBarStatus() {
    if (this.barSprite) {
      var entity = this.barSprite.node;
      if (!entity) return;
      var entityAnchorPoint = entity.getAnchorPoint();
      var entitySize = entity.getContentSize();
      var entityPosition = entity.getPosition();
      var anchorPoint = cc.v2(0, 0.5);
      var progress = misc.clamp01(this.progress);
      var actualLenth = this.totalLength * progress;
      var finalContentSize;
      var totalWidth;
      var totalHeight;

      switch (this.mode) {
        case Mode.HORIZONTAL:
          if (this.reverse) {
            anchorPoint = cc.v2(1, 0.5);
          }

          finalContentSize = cc.size(actualLenth, entitySize.height);
          totalWidth = this.totalLength;
          totalHeight = entitySize.height;
          break;

        case Mode.VERTICAL:
          if (this.reverse) {
            anchorPoint = cc.v2(0.5, 1);
          } else {
            anchorPoint = cc.v2(0.5, 0);
          }

          finalContentSize = cc.size(entitySize.width, actualLenth);
          totalWidth = entitySize.width;
          totalHeight = this.totalLength;
          break;
      } //handling filled mode


      if (this.mode === Mode.FILLED) {
        if (this.barSprite.type !== cc.Sprite.Type.FILLED) {
          cc.warn('ProgressBar FILLED mode only works when barSprite\'s Type is FILLED!');
        } else {
          if (this.reverse) {
            actualLenth = actualLenth * -1;
          }

          this.barSprite.fillRange = actualLenth;
        }
      } else {
        if (this.barSprite.type !== cc.Sprite.Type.FILLED) {
          var anchorOffsetX = anchorPoint.x - entityAnchorPoint.x;
          var anchorOffsetY = anchorPoint.y - entityAnchorPoint.y;
          var finalPosition = cc.v2(totalWidth * anchorOffsetX, totalHeight * anchorOffsetY);
          entity.setPosition(entityPosition.x + finalPosition.x, entityPosition.y + finalPosition.y);
          entity.setAnchorPoint(anchorPoint);
          entity.setContentSize(finalContentSize);
        } else {
          cc.warn('ProgressBar non-FILLED mode only works when barSprite\'s Type is non-FILLED!');
        }
      }
    }
  },
  properties: {
    /**
     * !#en The targeted Sprite which will be changed progressively.
     * !#zh 用来显示进度条比例的 Sprite 对象。
     * @property {Sprite} barSprite
     */
    barSprite: {
      "default": null,
      type: cc.Sprite,
      tooltip: CC_DEV && 'i18n:COMPONENT.progress.bar_sprite',
      notify: function notify() {
        this._initBarSprite();
      },
      animatable: false
    },

    /**
     * !#en The progress mode, there are two modes supported now: horizontal and vertical.
     * !#zh 进度条的模式
     * @property {ProgressBar.Mode} mode
     */
    mode: {
      "default": Mode.HORIZONTAL,
      type: Mode,
      tooltip: CC_DEV && 'i18n:COMPONENT.progress.mode',
      notify: function notify() {
        if (this.barSprite) {
          var entity = this.barSprite.node;
          if (!entity) return;
          var entitySize = entity.getContentSize();

          if (this.mode === Mode.HORIZONTAL) {
            this.totalLength = entitySize.width;
          } else if (this.mode === Mode.VERTICAL) {
            this.totalLength = entitySize.height;
          } else if (this.mode === Mode.FILLED) {
            this.totalLength = this.barSprite.fillRange;
          }
        }
      },
      animatable: false
    },
    _N$totalLength: 1,

    /**
     * !#en The total width or height of the bar sprite.
     * !#zh 进度条实际的总长度
     * @property {Number} totalLength
     */
    totalLength: {
      range: [0, Number.MAX_VALUE],
      tooltip: CC_DEV && 'i18n:COMPONENT.progress.total_length',
      get: function get() {
        return this._N$totalLength;
      },
      set: function set(value) {
        if (this.mode === Mode.FILLED) {
          value = misc.clamp01(value);
        }

        this._N$totalLength = value;

        this._updateBarStatus();
      }
    },

    /**
     * !#en The current progress of the bar sprite. The valid value is between 0-1.
     * !#zh 当前进度值，该数值的区间是 0-1 之间。
     * @property {Number} progress
     */
    progress: {
      "default": 1,
      type: cc.Float,
      range: [0, 1, 0.1],
      slide: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.progress.progress',
      notify: function notify() {
        this._updateBarStatus();
      }
    },

    /**
     * !#en Whether reverse the progress direction of the bar sprite.
     * !#zh 进度条是否进行反方向变化。
     * @property {Boolean} reverse
     */
    reverse: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.progress.reverse',
      notify: function notify() {
        if (this.barSprite) {
          this.barSprite.fillStart = 1 - this.barSprite.fillStart;
        }

        this._updateBarStatus();
      },
      animatable: false
    }
  },
  statics: {
    Mode: Mode
  }
});
cc.ProgressBar = module.exports = ProgressBar;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUHJvZ3Jlc3NCYXIuanMiXSwibmFtZXMiOlsibWlzYyIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlIiwiY2MiLCJFbnVtIiwiSE9SSVpPTlRBTCIsIlZFUlRJQ0FMIiwiRklMTEVEIiwiUHJvZ3Jlc3NCYXIiLCJDbGFzcyIsIm5hbWUiLCJlZGl0b3IiLCJDQ19FRElUT1IiLCJtZW51IiwiaGVscCIsIl9pbml0QmFyU3ByaXRlIiwiYmFyU3ByaXRlIiwiZW50aXR5Iiwibm9kZSIsIm5vZGVTaXplIiwiZ2V0Q29udGVudFNpemUiLCJub2RlQW5jaG9yIiwiZ2V0QW5jaG9yUG9pbnQiLCJlbnRpdHlTaXplIiwicGFyZW50Iiwic2V0Q29udGVudFNpemUiLCJmaWxsVHlwZSIsIlNwcml0ZSIsIkZpbGxUeXBlIiwiUkFESUFMIiwibW9kZSIsImJhclNwcml0ZVNpemUiLCJ0b3RhbExlbmd0aCIsIndpZHRoIiwiaGVpZ2h0IiwiZmlsbFJhbmdlIiwieCIsInkiLCJzZXRQb3NpdGlvbiIsInYyIiwiX3VwZGF0ZUJhclN0YXR1cyIsImVudGl0eUFuY2hvclBvaW50IiwiZW50aXR5UG9zaXRpb24iLCJnZXRQb3NpdGlvbiIsImFuY2hvclBvaW50IiwicHJvZ3Jlc3MiLCJjbGFtcDAxIiwiYWN0dWFsTGVudGgiLCJmaW5hbENvbnRlbnRTaXplIiwidG90YWxXaWR0aCIsInRvdGFsSGVpZ2h0IiwicmV2ZXJzZSIsInNpemUiLCJ0eXBlIiwiVHlwZSIsIndhcm4iLCJhbmNob3JPZmZzZXRYIiwiYW5jaG9yT2Zmc2V0WSIsImZpbmFsUG9zaXRpb24iLCJzZXRBbmNob3JQb2ludCIsInByb3BlcnRpZXMiLCJ0b29sdGlwIiwiQ0NfREVWIiwibm90aWZ5IiwiYW5pbWF0YWJsZSIsIl9OJHRvdGFsTGVuZ3RoIiwicmFuZ2UiLCJOdW1iZXIiLCJNQVhfVkFMVUUiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIkZsb2F0Iiwic2xpZGUiLCJmaWxsU3RhcnQiLCJzdGF0aWNzIiwi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S0FyRUY7O0FBZ0ZSOzs7OztBQUtBVyxJQUFBQSxPQUFPLEVBQUU7QUFDTCxpQkFBUyxLQURKO0FBRUxVLE1BQUFBLE9BQU8sRUFBRUMsTUFBTSxJQUFJLGlDQUZkO0FBR0xDLE1BQUFBLE1BQU0sRUFBRSxrQkFBVztBQUNmLFlBQUksS0FBSy9DLFNBQVQsRUFBb0I7QUFDaEIsZUFBS0EsU0FBTCxDQUFlMEQsU0FBZixHQUEyQixJQUFJLEtBQUsxRCxTQUFMLENBQWUwRCxTQUE5QztBQUNIOztBQUNELGFBQUtsQyxnQkFBTDtBQUNILE9BUkk7QUFTTHdCLE1BQUFBLFVBQVUsRUFBRTtBQVRQO0FBckZELEdBbEhXO0FBb052QlcsRUFBQUEsT0FBTyxFQUFFO0FBQ0x6RSxJQUFBQSxJQUFJLEVBQUVBO0FBREQ7QUFwTmMsQ0FBVCxDQUFsQjtBQTBOQUMsRUFBRSxDQUFDSyxXQUFILEdBQWlCb0UsTUFBTSxDQUFDQyxPQUFQLEdBQWlCckUsV0FBbEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmNvbnN0IG1pc2MgPSByZXF1aXJlKCcuLi91dGlscy9taXNjJyk7XG5jb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCcuL0NDQ29tcG9uZW50Jyk7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBQcm9ncmVzc0JhciBtb2RlXG4gKiAhI3poIOi/m+W6puadoeaooeW8j1xuICogQGVudW0gUHJvZ3Jlc3NCYXIuTW9kZVxuICovXG52YXIgTW9kZSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gVE9ET1xuICAgICAqICEjemgg5rC05bmz5pa55ZCR5qih5byPXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEhPUklaT05UQUxcbiAgICAgKi9cbiAgICBIT1JJWk9OVEFMOiAwLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUT0RPXG4gICAgICogISN6aCDlnoLnm7TmlrnlkJHmqKHlvI9cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gVkVSVElDQUxcbiAgICAgKi9cbiAgICBWRVJUSUNBTDogMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRPRE9cbiAgICAgKiAhI3poIOWhq+WFheaooeW8j1xuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBGSUxMRURcbiAgICAgKi9cbiAgICBGSUxMRUQ6IDIsXG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBWaXN1YWwgaW5kaWNhdG9yIG9mIHByb2dyZXNzIGluIHNvbWUgb3BlcmF0aW9uLlxuICogRGlzcGxheXMgYSBiYXIgdG8gdGhlIHVzZXIgcmVwcmVzZW50aW5nIGhvdyBmYXIgdGhlIG9wZXJhdGlvbiBoYXMgcHJvZ3Jlc3NlZC5cbiAqICEjemhcbiAqIOi/m+W6puadoee7hOS7tu+8jOWPr+eUqOS6juaYvuekuuWKoOi9vei1hOa6kOaXtueahOi/m+W6puOAglxuICogQGNsYXNzIFByb2dyZXNzQmFyXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqIEBleGFtcGxlXG4gKiAvLyB1cGRhdGUgcHJvZ3Jlc3NCYXJcbiAqIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG4gKiAgICAgdmFyIHByb2dyZXNzID0gcHJvZ3Jlc3NCYXIucHJvZ3Jlc3M7XG4gKiAgICAgaWYgKHByb2dyZXNzID4gMCkge1xuICogICAgICAgICBwcm9ncmVzcyArPSBkdDtcbiAqICAgICB9XG4gKiAgICAgZWxzZSB7XG4gKiAgICAgICAgIHByb2dyZXNzID0gMTtcbiAqICAgICB9XG4gKiAgICAgcHJvZ3Jlc3NCYXIucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAqIH1cbiAqXG4gKi9cbnZhciBQcm9ncmVzc0JhciA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuUHJvZ3Jlc3NCYXInLFxuICAgIGV4dGVuZHM6IENvbXBvbmVudCxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC51aS9Qcm9ncmVzc0JhcicsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC5wcm9ncmVzc2JhcicsXG4gICAgfSxcblxuICAgIF9pbml0QmFyU3ByaXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuYmFyU3ByaXRlKSB7XG4gICAgICAgICAgICB2YXIgZW50aXR5ID0gdGhpcy5iYXJTcHJpdGUubm9kZTtcbiAgICAgICAgICAgIGlmICghZW50aXR5KSByZXR1cm47XG5cbiAgICAgICAgICAgIHZhciBub2RlU2l6ZSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICAgICAgdmFyIG5vZGVBbmNob3IgPSB0aGlzLm5vZGUuZ2V0QW5jaG9yUG9pbnQoKTtcblxuICAgICAgICAgICAgdmFyIGVudGl0eVNpemUgPSBlbnRpdHkuZ2V0Q29udGVudFNpemUoKTtcblxuICAgICAgICAgICAgaWYoZW50aXR5LnBhcmVudCA9PT0gdGhpcy5ub2RlKXtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUuc2V0Q29udGVudFNpemUoZW50aXR5U2l6ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmJhclNwcml0ZS5maWxsVHlwZSA9PT0gY2MuU3ByaXRlLkZpbGxUeXBlLlJBRElBTCkge1xuICAgICAgICAgICAgICAgIHRoaXMubW9kZSA9IE1vZGUuRklMTEVEO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYmFyU3ByaXRlU2l6ZSA9IGVudGl0eS5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMubW9kZSA9PT0gTW9kZS5IT1JJWk9OVEFMKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IGJhclNwcml0ZVNpemUud2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMubW9kZSA9PT0gTW9kZS5WRVJUSUNBTCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxMZW5ndGggPSBiYXJTcHJpdGVTaXplLmhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxMZW5ndGggPSB0aGlzLmJhclNwcml0ZS5maWxsUmFuZ2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGVudGl0eS5wYXJlbnQgPT09IHRoaXMubm9kZSl7XG4gICAgICAgICAgICAgICAgdmFyIHggPSAtIG5vZGVTaXplLndpZHRoICogbm9kZUFuY2hvci54O1xuICAgICAgICAgICAgICAgIHZhciB5ID0gMDtcbiAgICAgICAgICAgICAgICBlbnRpdHkuc2V0UG9zaXRpb24oY2MudjIoeCwgeSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVCYXJTdGF0dXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5iYXJTcHJpdGUpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHkgPSB0aGlzLmJhclNwcml0ZS5ub2RlO1xuXG4gICAgICAgICAgICBpZiAoIWVudGl0eSkgcmV0dXJuO1xuXG4gICAgICAgICAgICB2YXIgZW50aXR5QW5jaG9yUG9pbnQgPSBlbnRpdHkuZ2V0QW5jaG9yUG9pbnQoKTtcbiAgICAgICAgICAgIHZhciBlbnRpdHlTaXplID0gZW50aXR5LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgICAgICB2YXIgZW50aXR5UG9zaXRpb24gPSBlbnRpdHkuZ2V0UG9zaXRpb24oKTtcblxuICAgICAgICAgICAgdmFyIGFuY2hvclBvaW50ID0gY2MudjIoMCwgMC41KTtcbiAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9IG1pc2MuY2xhbXAwMSh0aGlzLnByb2dyZXNzKTtcbiAgICAgICAgICAgIHZhciBhY3R1YWxMZW50aCA9IHRoaXMudG90YWxMZW5ndGggKiBwcm9ncmVzcztcbiAgICAgICAgICAgIHZhciBmaW5hbENvbnRlbnRTaXplO1xuICAgICAgICAgICAgdmFyIHRvdGFsV2lkdGg7XG4gICAgICAgICAgICB2YXIgdG90YWxIZWlnaHQ7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMubW9kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgTW9kZS5IT1JJWk9OVEFMOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXZlcnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3JQb2ludCA9IGNjLnYyKDEsIDAuNSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZmluYWxDb250ZW50U2l6ZSA9IGNjLnNpemUoYWN0dWFsTGVudGgsIGVudGl0eVNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxXaWR0aCA9IHRoaXMudG90YWxMZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsSGVpZ2h0ID0gZW50aXR5U2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgTW9kZS5WRVJUSUNBTDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmV2ZXJzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yUG9pbnQgPSBjYy52MigwLjUsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5jaG9yUG9pbnQgPSBjYy52MigwLjUsIDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsQ29udGVudFNpemUgPSBjYy5zaXplKGVudGl0eVNpemUud2lkdGgsIGFjdHVhbExlbnRoKTtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxXaWR0aCA9IGVudGl0eVNpemUud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsSGVpZ2h0ID0gdGhpcy50b3RhbExlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vaGFuZGxpbmcgZmlsbGVkIG1vZGVcbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGUgPT09IE1vZGUuRklMTEVEKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFyU3ByaXRlLnR5cGUgIT09IGNjLlNwcml0ZS5UeXBlLkZJTExFRCkge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKCdQcm9ncmVzc0JhciBGSUxMRUQgbW9kZSBvbmx5IHdvcmtzIHdoZW4gYmFyU3ByaXRlXFwncyBUeXBlIGlzIEZJTExFRCEnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yZXZlcnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWxMZW50aCA9IGFjdHVhbExlbnRoICogLTE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYXJTcHJpdGUuZmlsbFJhbmdlID0gYWN0dWFsTGVudGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iYXJTcHJpdGUudHlwZSAhPT0gY2MuU3ByaXRlLlR5cGUuRklMTEVEKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuY2hvck9mZnNldFggPSBhbmNob3JQb2ludC54IC0gZW50aXR5QW5jaG9yUG9pbnQueDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuY2hvck9mZnNldFkgPSBhbmNob3JQb2ludC55IC0gZW50aXR5QW5jaG9yUG9pbnQueTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZpbmFsUG9zaXRpb24gPSBjYy52Mih0b3RhbFdpZHRoICogYW5jaG9yT2Zmc2V0WCwgdG90YWxIZWlnaHQgKiBhbmNob3JPZmZzZXRZKTtcblxuICAgICAgICAgICAgICAgICAgICBlbnRpdHkuc2V0UG9zaXRpb24oZW50aXR5UG9zaXRpb24ueCArIGZpbmFsUG9zaXRpb24ueCwgZW50aXR5UG9zaXRpb24ueSArIGZpbmFsUG9zaXRpb24ueSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnNldEFuY2hvclBvaW50KGFuY2hvclBvaW50KTtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnNldENvbnRlbnRTaXplKGZpbmFsQ29udGVudFNpemUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm4oJ1Byb2dyZXNzQmFyIG5vbi1GSUxMRUQgbW9kZSBvbmx5IHdvcmtzIHdoZW4gYmFyU3ByaXRlXFwncyBUeXBlIGlzIG5vbi1GSUxMRUQhJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHRhcmdldGVkIFNwcml0ZSB3aGljaCB3aWxsIGJlIGNoYW5nZWQgcHJvZ3Jlc3NpdmVseS5cbiAgICAgICAgICogISN6aCDnlKjmnaXmmL7npLrov5vluqbmnaHmr5TkvovnmoQgU3ByaXRlIOWvueixoeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1Nwcml0ZX0gYmFyU3ByaXRlXG4gICAgICAgICAqL1xuICAgICAgICBiYXJTcHJpdGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnByb2dyZXNzLmJhcl9zcHJpdGUnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbml0QmFyU3ByaXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgcHJvZ3Jlc3MgbW9kZSwgdGhlcmUgYXJlIHR3byBtb2RlcyBzdXBwb3J0ZWQgbm93OiBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbC5cbiAgICAgICAgICogISN6aCDov5vluqbmnaHnmoTmqKHlvI9cbiAgICAgICAgICogQHByb3BlcnR5IHtQcm9ncmVzc0Jhci5Nb2RlfSBtb2RlXG4gICAgICAgICAqL1xuICAgICAgICBtb2RlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBNb2RlLkhPUklaT05UQUwsXG4gICAgICAgICAgICB0eXBlOiBNb2RlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wcm9ncmVzcy5tb2RlJyxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFyU3ByaXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbnRpdHkgPSB0aGlzLmJhclNwcml0ZS5ub2RlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWVudGl0eSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbnRpdHlTaXplID0gZW50aXR5LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vZGUgPT09IE1vZGUuSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IGVudGl0eVNpemUud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5tb2RlID09PSBNb2RlLlZFUlRJQ0FMKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsTGVuZ3RoID0gZW50aXR5U2l6ZS5oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5tb2RlID09PSBNb2RlLkZJTExFRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbExlbmd0aCA9IHRoaXMuYmFyU3ByaXRlLmZpbGxSYW5nZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIF9OJHRvdGFsTGVuZ3RoOiAxLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgdG90YWwgd2lkdGggb3IgaGVpZ2h0IG9mIHRoZSBiYXIgc3ByaXRlLlxuICAgICAgICAgKiAhI3poIOi/m+W6puadoeWunumZheeahOaAu+mVv+W6plxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdG90YWxMZW5ndGhcbiAgICAgICAgICovXG4gICAgICAgIHRvdGFsTGVuZ3RoOiB7XG4gICAgICAgICAgICByYW5nZTogWzAsIE51bWJlci5NQVhfVkFMVUVdLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5wcm9ncmVzcy50b3RhbF9sZW5ndGgnLFxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX04kdG90YWxMZW5ndGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vZGUgPT09IE1vZGUuRklMTEVEKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbWlzYy5jbGFtcDAxKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fTiR0b3RhbExlbmd0aCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUJhclN0YXR1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBjdXJyZW50IHByb2dyZXNzIG9mIHRoZSBiYXIgc3ByaXRlLiBUaGUgdmFsaWQgdmFsdWUgaXMgYmV0d2VlbiAwLTEuXG4gICAgICAgICAqICEjemgg5b2T5YmN6L+b5bqm5YC877yM6K+l5pWw5YC855qE5Yy66Ze05pivIDAtMSDkuYvpl7TjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHByb2dyZXNzXG4gICAgICAgICAqL1xuICAgICAgICBwcm9ncmVzczoge1xuICAgICAgICAgICAgZGVmYXVsdDogMSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICAgICAgcmFuZ2U6IFswLCAxLCAwLjFdLFxuICAgICAgICAgICAgc2xpZGU6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnByb2dyZXNzLnByb2dyZXNzJyxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQmFyU3RhdHVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hldGhlciByZXZlcnNlIHRoZSBwcm9ncmVzcyBkaXJlY3Rpb24gb2YgdGhlIGJhciBzcHJpdGUuXG4gICAgICAgICAqICEjemgg6L+b5bqm5p2h5piv5ZCm6L+b6KGM5Y+N5pa55ZCR5Y+Y5YyW44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gcmV2ZXJzZVxuICAgICAgICAgKi9cbiAgICAgICAgcmV2ZXJzZToge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnByb2dyZXNzLnJldmVyc2UnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5iYXJTcHJpdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iYXJTcHJpdGUuZmlsbFN0YXJ0ID0gMSAtIHRoaXMuYmFyU3ByaXRlLmZpbGxTdGFydDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQmFyU3RhdHVzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIE1vZGU6IE1vZGVcbiAgICB9XG59KTtcblxuXG5jYy5Qcm9ncmVzc0JhciA9IG1vZHVsZS5leHBvcnRzID0gUHJvZ3Jlc3NCYXI7XG4iXX0=