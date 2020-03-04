
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCLabel.js';
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
var macro = require('../platform/CCMacro');

var RenderComponent = require('./CCRenderComponent');

var Material = require('../assets/material/CCMaterial');

var LabelFrame = require('../renderer/utils/label/label-frame');
/**
 * !#en Enum for text alignment.
 * !#zh 文本横向对齐类型
 * @enum Label.HorizontalAlign
 */

/**
 * !#en Alignment left for text.
 * !#zh 文本内容左对齐。
 * @property {Number} LEFT
 */

/**
 * !#en Alignment center for text.
 * !#zh 文本内容居中对齐。
 * @property {Number} CENTER
 */

/**
 * !#en Alignment right for text.
 * !#zh 文本内容右边对齐。
 * @property {Number} RIGHT
 */


var HorizontalAlign = macro.TextAlignment;
/**
 * !#en Enum for vertical text alignment.
 * !#zh 文本垂直对齐类型
 * @enum Label.VerticalAlign
 */

/**
 * !#en Vertical alignment top for text.
 * !#zh 文本顶部对齐。
 * @property {Number} TOP
 */

/**
 * !#en Vertical alignment center for text.
 * !#zh 文本居中对齐。
 * @property {Number} CENTER
 */

/**
 * !#en Vertical alignment bottom for text.
 * !#zh 文本底部对齐。
 * @property {Number} BOTTOM
 */

var VerticalAlign = macro.VerticalTextAlignment;
/**
 * !#en Enum for Overflow.
 * !#zh Overflow 类型
 * @enum Label.Overflow
 */

/**
 * !#en NONE.
 * !#zh 不做任何限制。
 * @property {Number} NONE
 */

/**
 * !#en In CLAMP mode, when label content goes out of the bounding box, it will be clipped.
 * !#zh CLAMP 模式中，当文本内容超出边界框时，多余的会被截断。
 * @property {Number} CLAMP
 */

/**
 * !#en In SHRINK mode, the font size will change dynamically to adapt the content size. This mode may takes up more CPU resources when the label is refreshed.
 * !#zh SHRINK 模式，字体大小会动态变化，以适应内容大小。这个模式在文本刷新的时候可能会占用较多 CPU 资源。
 * @property {Number} SHRINK
 */

/**
 * !#en In RESIZE_HEIGHT mode, you can only change the width of label and the height is changed automatically.
 * !#zh 在 RESIZE_HEIGHT 模式下，只能更改文本的宽度，高度是自动改变的。
 * @property {Number} RESIZE_HEIGHT
 */

var Overflow = cc.Enum({
  NONE: 0,
  CLAMP: 1,
  SHRINK: 2,
  RESIZE_HEIGHT: 3
});
/**
 * !#en Enum for font type.
 * !#zh Type 类型
 * @enum Label.Type
 */

/**
 * !#en The TTF font type.
 * !#zh TTF字体
 * @property {Number} TTF
 */

/**
 * !#en The bitmap font type.
 * !#zh 位图字体
 * @property {Number} BMFont
 */

/**
 * !#en The system font type.
 * !#zh 系统字体
 * @property {Number} SystemFont
 */

/**
 * !#en Enum for cache mode.
 * !#zh CacheMode 类型
 * @enum Label.CacheMode
 */

/**
* !#en Do not do any caching.
* !#zh 不做任何缓存。
* @property {Number} NONE
*/

/**
 * !#en In BITMAP mode, cache the label as a static image and add it to the dynamic atlas for batch rendering, and can batching with Sprites using broken images.
 * !#zh BITMAP 模式，将 label 缓存成静态图像并加入到动态图集，以便进行批次合并，可与使用碎图的 Sprite 进行合批（注：动态图集在 Chrome 以及微信小游戏暂时关闭，该功能无效）。
 * @property {Number} BITMAP
 */

/**
 * !#en In CHAR mode, split text into characters and cache characters into a dynamic atlas which the size of 2048*2048. 
 * !#zh CHAR 模式，将文本拆分为字符，并将字符缓存到一张单独的大小为 2048*2048 的图集中进行重复使用，不再使用动态图集（注：当图集满时将不再进行缓存，暂时不支持 SHRINK 自适应文本尺寸（后续完善））。
 * @property {Number} CHAR
 */

var CacheMode = cc.Enum({
  NONE: 0,
  BITMAP: 1,
  CHAR: 2
});
var BOLD_FLAG = 1 << 0;
var ITALIC_FLAG = 1 << 1;
var UNDERLINE_FLAG = 1 << 2;
/**
 * !#en The Label Component.
 * !#zh 文字标签组件
 * @class Label
 * @extends RenderComponent
 */

var Label = cc.Class({
  name: 'cc.Label',
  "extends": RenderComponent,
  ctor: function ctor() {
    if (CC_EDITOR) {
      this._userDefinedFont = null;
    }

    this._actualFontSize = 0;
    this._assemblerData = null;
    this._frame = null;
    this._ttfTexture = null;
    this._letterTexture = null;

    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
      this._updateMaterial = this._updateMaterialCanvas;
    } else {
      this._updateMaterial = this._updateMaterialWebgl;
    }
  },
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/Label',
    help: 'i18n:COMPONENT.help_url.label',
    inspector: 'packages://inspector/inspectors/comps/label.js'
  },
  properties: {
    _useOriginalSize: true,

    /**
     * !#en Content string of label.
     * !#zh 标签显示的文本内容。
     * @property {String} string
     */
    _string: {
      "default": '',
      formerlySerializedAs: '_N$string'
    },
    string: {
      get: function get() {
        return this._string;
      },
      set: function set(value) {
        var oldValue = this._string;
        this._string = '' + value;

        if (this.string !== oldValue) {
          this.setVertsDirty();
        }

        this._checkStringEmpty();
      },
      multiline: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.string'
    },

    /**
     * !#en Horizontal Alignment of label.
     * !#zh 文本内容的水平对齐方式。
     * @property {Label.HorizontalAlign} horizontalAlign
     */
    horizontalAlign: {
      "default": HorizontalAlign.LEFT,
      type: HorizontalAlign,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.horizontal_align',
      notify: function notify(oldValue) {
        if (this.horizontalAlign === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },

    /**
     * !#en Vertical Alignment of label.
     * !#zh 文本内容的垂直对齐方式。
     * @property {Label.VerticalAlign} verticalAlign
     */
    verticalAlign: {
      "default": VerticalAlign.TOP,
      type: VerticalAlign,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.vertical_align',
      notify: function notify(oldValue) {
        if (this.verticalAlign === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },

    /**
     * !#en The actual rendering font size in shrink mode
     * !#zh SHRINK 模式下面文本实际渲染的字体大小
     * @property {Number} actualFontSize
     */
    actualFontSize: {
      displayName: 'Actual Font Size',
      animatable: false,
      readonly: true,
      get: function get() {
        return this._actualFontSize;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.actualFontSize'
    },
    _fontSize: 40,

    /**
     * !#en Font size of label.
     * !#zh 文本字体大小。
     * @property {Number} fontSize
     */
    fontSize: {
      get: function get() {
        return this._fontSize;
      },
      set: function set(value) {
        if (this._fontSize === value) return;
        this._fontSize = value;
        this.setVertsDirty();
      },
      range: [0, 512],
      tooltip: CC_DEV && 'i18n:COMPONENT.label.font_size'
    },

    /**
     * !#en Font family of label, only take effect when useSystemFont property is true.
     * !#zh 文本字体名称, 只在 useSystemFont 属性为 true 的时候生效。
     * @property {String} fontFamily
     */
    fontFamily: {
      "default": "Arial",
      tooltip: CC_DEV && 'i18n:COMPONENT.label.font_family',
      notify: function notify(oldValue) {
        if (this.fontFamily === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },
    _lineHeight: 40,

    /**
     * !#en Line Height of label.
     * !#zh 文本行高。
     * @property {Number} lineHeight
     */
    lineHeight: {
      get: function get() {
        return this._lineHeight;
      },
      set: function set(value) {
        if (this._lineHeight === value) return;
        this._lineHeight = value;
        this.setVertsDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.line_height'
    },

    /**
     * !#en Overflow of label.
     * !#zh 文字显示超出范围时的处理方式。
     * @property {Label.Overflow} overflow
     */
    overflow: {
      "default": Overflow.NONE,
      type: Overflow,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.overflow',
      notify: function notify(oldValue) {
        if (this.overflow === oldValue) return;
        this.setVertsDirty();
      },
      animatable: false
    },
    _enableWrapText: true,

    /**
     * !#en Whether auto wrap label when string width is large than label width.
     * !#zh 是否自动换行。
     * @property {Boolean} enableWrapText
     */
    enableWrapText: {
      get: function get() {
        return this._enableWrapText;
      },
      set: function set(value) {
        if (this._enableWrapText === value) return;
        this._enableWrapText = value;
        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.wrap'
    },
    // 这个保存了旧项目的 file 数据
    _N$file: null,

    /**
     * !#en The font of label.
     * !#zh 文本字体。
     * @property {Font} font
     */
    font: {
      get: function get() {
        return this._N$file;
      },
      set: function set(value) {
        if (this.font === value) return; //if delete the font, we should change isSystemFontUsed to true

        if (!value) {
          this._isSystemFontUsed = true;
        }

        if (CC_EDITOR && value) {
          this._userDefinedFont = value;
        }

        this._N$file = value;
        if (value && this._isSystemFontUsed) this._isSystemFontUsed = false;

        if (typeof value === 'string') {
          cc.warnID(4000);
        }

        if (!this.enabledInHierarchy) return;

        this._forceUpdateRenderData();
      },
      type: cc.Font,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.font',
      animatable: false
    },
    _isSystemFontUsed: true,

    /**
     * !#en Whether use system font name or not.
     * !#zh 是否使用系统字体。
     * @property {Boolean} useSystemFont
     */
    useSystemFont: {
      get: function get() {
        return this._isSystemFontUsed;
      },
      set: function set(value) {
        if (this._isSystemFontUsed === value) return;
        this._isSystemFontUsed = !!value;

        if (CC_EDITOR) {
          if (!value && this._userDefinedFont) {
            this.font = this._userDefinedFont;
            this.spacingX = this._spacingX;
            return;
          }
        }

        if (value) {
          this.font = null;
          if (!this.enabledInHierarchy) return;

          this._forceUpdateRenderData();
        }

        this.markForValidate();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.system_font'
    },
    _bmFontOriginalSize: {
      displayName: 'BMFont Original Size',
      get: function get() {
        if (this._N$file instanceof cc.BitmapFont) {
          return this._N$file.fontSize;
        } else {
          return -1;
        }
      },
      visible: true,
      animatable: false
    },
    _spacingX: 0,

    /**
     * !#en The spacing of the x axis between characters.
     * !#zh 文字之间 x 轴的间距。
     * @property {Number} spacingX
     */
    spacingX: {
      get: function get() {
        return this._spacingX;
      },
      set: function set(value) {
        this._spacingX = value;
        this.setVertsDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.spacingX'
    },
    //For compatibility with v2.0.x temporary reservation.
    _batchAsBitmap: false,

    /**
     * !#en The cache mode of label. This mode only supports system fonts.
     * !#zh 文本缓存模式, 该模式只支持系统字体。
     * @property {Label.CacheMode} cacheMode
     */
    cacheMode: {
      "default": CacheMode.NONE,
      type: CacheMode,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.cacheMode',
      notify: function notify(oldValue) {
        if (this.cacheMode === oldValue) return;

        if (oldValue === CacheMode.BITMAP && !(this.font instanceof cc.BitmapFont)) {
          this._frame && this._frame._resetDynamicAtlasFrame();
        }

        if (oldValue === CacheMode.CHAR) {
          this._ttfTexture = null;
        }

        if (!this.enabledInHierarchy) return;

        this._forceUpdateRenderData();
      },
      animatable: false
    },
    _styleFlags: 0,

    /**
     * !#en Whether enable bold.
     * !#zh 是否启用黑体。
     * @property {Boolean} enableBold
     */
    enableBold: {
      get: function get() {
        return !!(this._styleFlags & BOLD_FLAG);
      },
      set: function set(value) {
        if (value) {
          this._styleFlags |= BOLD_FLAG;
        } else {
          this._styleFlags &= ~BOLD_FLAG;
        }

        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.bold'
    },

    /**
     * !#en Whether enable italic.
     * !#zh 是否启用黑体。
     * @property {Boolean} enableItalic
     */
    enableItalic: {
      get: function get() {
        return !!(this._styleFlags & ITALIC_FLAG);
      },
      set: function set(value) {
        if (value) {
          this._styleFlags |= ITALIC_FLAG;
        } else {
          this._styleFlags &= ~ITALIC_FLAG;
        }

        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.italic'
    },

    /**
     * !#en Whether enable underline.
     * !#zh 是否启用下划线。
     * @property {Boolean} enableUnderline
     */
    enableUnderline: {
      get: function get() {
        return !!(this._styleFlags & UNDERLINE_FLAG);
      },
      set: function set(value) {
        if (value) {
          this._styleFlags |= UNDERLINE_FLAG;
        } else {
          this._styleFlags &= ~UNDERLINE_FLAG;
        }

        this.setVertsDirty();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.label.underline'
    },
    _underlineHeight: 0,

    /**
     * !#en The height of underline.
     * !#zh 下划线高度。
     * @property {Number} underlineHeight
     */
    underlineHeight: {
      get: function get() {
        return this._underlineHeight;
      },
      set: function set(value) {
        if (this._underlineHeight === value) return;
        this._underlineHeight = value;
        this.setVertsDirty();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.label.underline_height'
    }
  },
  statics: {
    HorizontalAlign: HorizontalAlign,
    VerticalAlign: VerticalAlign,
    Overflow: Overflow,
    CacheMode: CacheMode,
    _shareAtlas: null,

    /**
     * !#zh 需要保证当前场景中没有使用CHAR缓存的Label才可以清除，否则已渲染的文字没有重新绘制会不显示
     * !#en It can be cleared that need to ensure there is not use the CHAR cache in the current scene. Otherwise, the rendered text will not be displayed without repainting.
     * @method clearCharCache
     * @static
     */
    clearCharCache: function clearCharCache() {
      if (Label._shareAtlas) {
        Label._shareAtlas.clearAllCache();
      }
    }
  },
  onLoad: function onLoad() {
    // For compatibility with v2.0.x temporary reservation.
    if (this._batchAsBitmap && this.cacheMode === CacheMode.NONE) {
      this.cacheMode = CacheMode.BITMAP;
      this._batchAsBitmap = false;
    }

    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
      // CacheMode is not supported in Canvas.
      this.cacheMode = CacheMode.NONE;
    }
  },
  onEnable: function onEnable() {
    this._super(); // Keep track of Node size


    this.node.on(cc.Node.EventType.SIZE_CHANGED, this._nodeSizeChanged, this);
    this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);

    this._forceUpdateRenderData();
  },
  onDisable: function onDisable() {
    this._super();

    this.node.off(cc.Node.EventType.SIZE_CHANGED, this._nodeSizeChanged, this);
    this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this.setVertsDirty, this);
  },
  onDestroy: function onDestroy() {
    this._assembler && this._assembler._resetAssemblerData && this._assembler._resetAssemblerData(this._assemblerData);
    this._assemblerData = null;
    this._letterTexture = null;

    if (this._ttfTexture) {
      this._ttfTexture.destroy();

      this._ttfTexture = null;
    }

    this._super();
  },
  _nodeSizeChanged: function _nodeSizeChanged() {
    // Because the content size is automatically updated when overflow is NONE.
    // And this will conflict with the alignment of the CCWidget.
    if (CC_EDITOR || this.overflow !== Overflow.NONE) {
      this.setVertsDirty();
    }
  },
  _updateColor: function _updateColor() {
    if (!(this.font instanceof cc.BitmapFont)) {
      this.setVertsDirty();
    }

    RenderComponent.prototype._updateColor.call(this);
  },
  _validateRender: function _validateRender() {
    if (!this.string) {
      this.disableRender();
      return;
    }

    if (this._materials[0]) {
      var font = this.font;

      if (font instanceof cc.BitmapFont) {
        var spriteFrame = font.spriteFrame;

        if (spriteFrame && spriteFrame.textureLoaded() && font._fntConfig) {
          return;
        }
      } else {
        return;
      }
    }

    this.disableRender();
  },
  _resetAssembler: function _resetAssembler() {
    this._frame = null;

    RenderComponent.prototype._resetAssembler.call(this);
  },
  _checkStringEmpty: function _checkStringEmpty() {
    this.markForRender(!!this.string);
  },
  _on3DNodeChanged: function _on3DNodeChanged() {
    this._resetAssembler();

    this._applyFontTexture();
  },
  _onBMFontTextureLoaded: function _onBMFontTextureLoaded() {
    this._frame._texture = this.font.spriteFrame._texture;
    this.markForRender(true);

    this._updateMaterial();

    this._assembler && this._assembler.updateRenderData(this);
  },
  _applyFontTexture: function _applyFontTexture() {
    var font = this.font;

    if (font instanceof cc.BitmapFont) {
      var spriteFrame = font.spriteFrame;
      this._frame = spriteFrame;

      if (spriteFrame) {
        spriteFrame.onTextureLoaded(this._onBMFontTextureLoaded, this);
      }
    } else {
      if (!this._frame) {
        this._frame = new LabelFrame();
      }

      if (this.cacheMode === CacheMode.CHAR) {
        this._letterTexture = this._assembler._getAssemblerData();

        this._frame._refreshTexture(this._letterTexture);
      } else if (!this._ttfTexture) {
        this._ttfTexture = new cc.Texture2D();
        this._assemblerData = this._assembler._getAssemblerData();

        this._ttfTexture.initWithElement(this._assemblerData.canvas);
      }

      if (this.cacheMode !== CacheMode.CHAR) {
        this._frame._resetDynamicAtlasFrame();

        this._frame._refreshTexture(this._ttfTexture);
      }

      this._updateMaterial();

      this._assembler && this._assembler.updateRenderData(this);
    }

    this.markForValidate();
  },
  _updateMaterialCanvas: function _updateMaterialCanvas() {
    if (!this._frame) return;
    this._frame._texture.url = this.uuid + '_texture';
  },
  _updateMaterialWebgl: function _updateMaterialWebgl() {
    if (!this._frame) return;
    var material = this.getMaterial(0);
    material && material.setProperty('texture', this._frame._texture);
  },
  _forceUpdateRenderData: function _forceUpdateRenderData() {
    this.setVertsDirty();

    this._resetAssembler();

    this._applyFontTexture();
  },

  /**
   * @deprecated `label._enableBold` is deprecated, use `label.enableBold = true` instead please.
   */
  _enableBold: function _enableBold(enabled) {
    if (CC_DEBUG) {
      cc.warn('`label._enableBold` is deprecated, use `label.enableBold = true` instead please');
    }

    this.enableBold = !!enabled;
  },

  /**
   * @deprecated `label._enableItalics` is deprecated, use `label.enableItalics = true` instead please.
   */
  _enableItalics: function _enableItalics(enabled) {
    if (CC_DEBUG) {
      cc.warn('`label._enableItalics` is deprecated, use `label.enableItalics = true` instead please');
    }

    this.enableItalic = !!enabled;
  },

  /**
   * @deprecated `label._enableUnderline` is deprecated, use `label.enableUnderline = true` instead please.
   */
  _enableUnderline: function _enableUnderline(enabled) {
    if (CC_DEBUG) {
      cc.warn('`label._enableUnderline` is deprecated, use `label.enableUnderline = true` instead please');
    }

    this.enableUnderline = !!enabled;
  }
});
cc.Label = module.exports = Label;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTGFiZWwuanMiXSwibmFtZXMiOlsibWFjcm8iLCJyZXF1aXJlIiwiUmVuZGVyQ29tcG9uZW50IiwiTWF0ZXJpYWwiLCJMYWJlbEZyYW1lIiwiSG9yaXpvbnRhbEFsaWduIiwiVGV4dEFsaWdubWVudCIsIlZlcnRpY2FsQWxpZ24iLCJWZXJ0aWNhbFRleHRBbGlnbm1lbnQiLCJPdmVyZmxvdyIsImNjIiwiRW51bSIsIk5PTkUiLCJDTEFNUCIsIlNIUklOSyIsIlJFU0laRV9IRUlHSFQiLCJDYWNoZU1vZGUiLCJCSVRNQVAiLCJDSEFSIiwiQk9MRF9GTEFHIiwiSVRBTElDX0ZMQUciLCJVTkRFUkxJTkVfRkxBRyIsIkxhYmVsIiwiQ2xhc3MiLCJuYW1lIiwiY3RvciIsIkNDX0VESVRPUiIsIl91c2VyRGVmaW5lZEZvbnQiLCJfYWN0dWFsRm9udFNpemUiLCJfYXNzZW1ibGVyRGF0YSIsIl9mcmFtZSIsIl90dGZUZXh0dXJlIiwiX2xldHRlclRleHR1cmUiLCJnYW1lIiwicmVuZGVyVHlwZSIsIlJFTkRFUl9UWVBFX0NBTlZBUyIsIl91cGRhdGVNYXRlcmlhbCIsIl91cGRhdGVNYXRlcmlhbENhbnZhcyIsIl91cGRhdGVNYXRlcmlhbFdlYmdsIiwiZWRpdG9yIiwibWVudSIsImhlbHAiLCJpbnNwZWN0b3IiLCJwcm9wZXJ0aWVzIiwiX3VzZU9yaWdpbmFsU2l6ZSIsIl9zdHJpbmciLCJmb3JtZXJseVNlcmlhbGl6ZWRBcyIsInN0cmluZyIsImdldCIsInNldCIsInZhbHVlIiwib2xkVmFsdWUiLCJzZXRWZXJ0c0RpcnR5IiwiX2NoZWNrU3RyaW5nRW1wdHkiLCJtdWx0aWxpbmUiLCJ0b29sdGlwIiwiQ0NfREVWIiwiaG9yaXpvbnRhbEFsaWduIiwiTEVGVCIsInR5cGUiLCJub3RpZnkiLCJhbmltYXRhYmxlIiwidmVydGljYWxBbGlnbiIsIlRPUCIsImFjdHVhbEZvbnRTaXplIiwiZGlzcGxheU5hbWUiLCJyZWFkb25seSIsIl9mb250U2l6ZSIsImZvbnRTaXplIiwicmFuZ2UiLCJmb250RmFtaWx5IiwiX2xpbmVIZWlnaHQiLCJsaW5lSGVpZ2h0Iiwib3ZlcmZsb3ciLCJfZW5hYmxlV3JhcFRleHQiLCJlbmFibGVXcmFwVGV4dCIsIl9OJGZpbGUiLCJmb250IiwiX2lzU3lzdGVtRm9udFVzZWQiLCJ3YXJuSUQiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJfZm9yY2VVcGRhdGVSZW5kZXJEYXRhIiwiRm9udCIsInVzZVN5c3RlbUZvbnQiLCJzcGFjaW5nWCIsIl9zcGFjaW5nWCIsIm1hcmtGb3JWYWxpZGF0ZSIsIl9ibUZvbnRPcmlnaW5hbFNpemUiLCJCaXRtYXBGb250IiwidmlzaWJsZSIsIl9iYXRjaEFzQml0bWFwIiwiY2FjaGVNb2RlIiwiX3Jlc2V0RHluYW1pY0F0bGFzRnJhbWUiLCJfc3R5bGVGbGFncyIsImVuYWJsZUJvbGQiLCJlbmFibGVJdGFsaWMiLCJlbmFibGVVbmRlcmxpbmUiLCJfdW5kZXJsaW5lSGVpZ2h0IiwidW5kZXJsaW5lSGVpZ2h0Iiwic3RhdGljcyIsIl9zaGFyZUF0bGFzIiwiY2xlYXJDaGFyQ2FjaGUiLCJjbGVhckFsbENhY2hlIiwib25Mb2FkIiwib25FbmFibGUiLCJfc3VwZXIiLCJub2RlIiwib24iLCJOb2RlIiwiRXZlbnRUeXBlIiwiU0laRV9DSEFOR0VEIiwiX25vZGVTaXplQ2hhbmdlZCIsIkFOQ0hPUl9DSEFOR0VEIiwib25EaXNhYmxlIiwib2ZmIiwib25EZXN0cm95IiwiX2Fzc2VtYmxlciIsIl9yZXNldEFzc2VtYmxlckRhdGEiLCJkZXN0cm95IiwiX3VwZGF0ZUNvbG9yIiwicHJvdG90eXBlIiwiY2FsbCIsIl92YWxpZGF0ZVJlbmRlciIsImRpc2FibGVSZW5kZXIiLCJfbWF0ZXJpYWxzIiwic3ByaXRlRnJhbWUiLCJ0ZXh0dXJlTG9hZGVkIiwiX2ZudENvbmZpZyIsIl9yZXNldEFzc2VtYmxlciIsIm1hcmtGb3JSZW5kZXIiLCJfb24zRE5vZGVDaGFuZ2VkIiwiX2FwcGx5Rm9udFRleHR1cmUiLCJfb25CTUZvbnRUZXh0dXJlTG9hZGVkIiwiX3RleHR1cmUiLCJ1cGRhdGVSZW5kZXJEYXRhIiwib25UZXh0dXJlTG9hZGVkIiwiX2dldEFzc2VtYmxlckRhdGEiLCJfcmVmcmVzaFRleHR1cmUiLCJUZXh0dXJlMkQiLCJpbml0V2l0aEVsZW1lbnQiLCJjYW52YXMiLCJ1cmwiLCJ1dWlkIiwibWF0ZXJpYWwiLCJnZXRNYXRlcmlhbCIsInNldFByb3BlcnR5IiwiX2VuYWJsZUJvbGQiLCJlbmFibGVkIiwiQ0NfREVCVUciLCJ3YXJuIiwiX2VuYWJsZUl0YWxpY3MiLCJfZW5hYmxlVW5kZXJsaW5lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQU1BLEtBQUssR0FBR0MsT0FBTyxDQUFDLHFCQUFELENBQXJCOztBQUNBLElBQU1DLGVBQWUsR0FBR0QsT0FBTyxDQUFDLHFCQUFELENBQS9COztBQUNBLElBQU1FLFFBQVEsR0FBR0YsT0FBTyxDQUFDLCtCQUFELENBQXhCOztBQUNBLElBQU1HLFVBQVUsR0FBR0gsT0FBTyxDQUFDLHFDQUFELENBQTFCO0FBRUE7Ozs7OztBQUtBOzs7Ozs7QUFLQTs7Ozs7O0FBS0E7Ozs7Ozs7QUFLQSxJQUFNSSxlQUFlLEdBQUdMLEtBQUssQ0FBQ00sYUFBOUI7QUFFQTs7Ozs7O0FBS0E7Ozs7OztBQUtBOzs7Ozs7QUFLQTs7Ozs7O0FBS0EsSUFBTUMsYUFBYSxHQUFHUCxLQUFLLENBQUNRLHFCQUE1QjtBQUVBOzs7Ozs7QUFLQTs7Ozs7O0FBS0E7Ozs7OztBQUtBOzs7Ozs7QUFLQTs7Ozs7O0FBS0EsSUFBTUMsUUFBUSxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNyQkMsRUFBQUEsSUFBSSxFQUFFLENBRGU7QUFFckJDLEVBQUFBLEtBQUssRUFBRSxDQUZjO0FBR3JCQyxFQUFBQSxNQUFNLEVBQUUsQ0FIYTtBQUlyQkMsRUFBQUEsYUFBYSxFQUFFO0FBSk0sQ0FBUixDQUFq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UztBQUN0QixTQUFLN0IsYUFBTDs7QUFDQSxTQUFLNEUsZUFBTDs7QUFDQSxTQUFLRyxpQkFBTDtBQUNILEdBOWtCZ0I7O0FBZ2xCakI7OztBQUdBZSxFQUFBQSxXQW5sQmlCLHVCQW1sQkpDLE9BbmxCSSxFQW1sQks7QUFDbEIsUUFBSUMsUUFBSixFQUFjO0FBQ1YxSSxNQUFBQSxFQUFFLENBQUMySSxJQUFILENBQVEsaUZBQVI7QUFDSDs7QUFDRCxTQUFLdkQsVUFBTCxHQUFrQixDQUFDLENBQUNxRCxPQUFwQjtBQUNILEdBeGxCZ0I7O0FBMGxCakI7OztBQUdBRyxFQUFBQSxjQTdsQmlCLDBCQTZsQkRILE9BN2xCQyxFQTZsQlE7QUFDckIsUUFBSUMsUUFBSixFQUFjO0FBQ1YxSSxNQUFBQSxFQUFFLENBQUMySSxJQUFILENBQVEsdUZBQVI7QUFDSDs7QUFDRCxTQUFLdEQsWUFBTCxHQUFvQixDQUFDLENBQUNvRCxPQUF0QjtBQUNILEdBbG1CZ0I7O0FBb21CakI7OztBQUdBSSxFQUFBQSxnQkF2bUJpQiw0QkF1bUJDSixPQXZtQkQsRUF1bUJVO0FBQ3ZCLFFBQUlDLFFBQUosRUFBYztBQUNWMUksTUFBQUEsRUFBRSxDQUFDMkksSUFBSCxDQUFRLDJGQUFSO0FBQ0g7O0FBQ0QsU0FBS3JELGVBQUwsR0FBdUIsQ0FBQyxDQUFDbUQsT0FBekI7QUFDSDtBQTVtQmdCLENBQVQsQ0FBWjtBQSttQkN6SSxFQUFFLENBQUNZLEtBQUgsR0FBV2tJLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQm5JLEtBQTVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBtYWNybyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL0NDTWFjcm8nKTtcbmNvbnN0IFJlbmRlckNvbXBvbmVudCA9IHJlcXVpcmUoJy4vQ0NSZW5kZXJDb21wb25lbnQnKTtcbmNvbnN0IE1hdGVyaWFsID0gcmVxdWlyZSgnLi4vYXNzZXRzL21hdGVyaWFsL0NDTWF0ZXJpYWwnKTtcbmNvbnN0IExhYmVsRnJhbWUgPSByZXF1aXJlKCcuLi9yZW5kZXJlci91dGlscy9sYWJlbC9sYWJlbC1mcmFtZScpO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgdGV4dCBhbGlnbm1lbnQuXG4gKiAhI3poIOaWh+acrOaoquWQkeWvuem9kOexu+Wei1xuICogQGVudW0gTGFiZWwuSG9yaXpvbnRhbEFsaWduXG4gKi9cbi8qKlxuICogISNlbiBBbGlnbm1lbnQgbGVmdCBmb3IgdGV4dC5cbiAqICEjemgg5paH5pys5YaF5a655bem5a+56b2Q44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gTEVGVFxuICovXG4vKipcbiAqICEjZW4gQWxpZ25tZW50IGNlbnRlciBmb3IgdGV4dC5cbiAqICEjemgg5paH5pys5YaF5a655bGF5Lit5a+56b2Q44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQ0VOVEVSXG4gKi9cbi8qKlxuICogISNlbiBBbGlnbm1lbnQgcmlnaHQgZm9yIHRleHQuXG4gKiAhI3poIOaWh+acrOWGheWuueWPs+i+ueWvuem9kOOAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IFJJR0hUXG4gKi9cbmNvbnN0IEhvcml6b250YWxBbGlnbiA9IG1hY3JvLlRleHRBbGlnbm1lbnQ7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciB2ZXJ0aWNhbCB0ZXh0IGFsaWdubWVudC5cbiAqICEjemgg5paH5pys5Z6C55u05a+56b2Q57G75Z6LXG4gKiBAZW51bSBMYWJlbC5WZXJ0aWNhbEFsaWduXG4gKi9cbi8qKlxuICogISNlbiBWZXJ0aWNhbCBhbGlnbm1lbnQgdG9wIGZvciB0ZXh0LlxuICogISN6aCDmlofmnKzpobbpg6jlr7npvZDjgIJcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBUT1BcbiAqL1xuLyoqXG4gKiAhI2VuIFZlcnRpY2FsIGFsaWdubWVudCBjZW50ZXIgZm9yIHRleHQuXG4gKiAhI3poIOaWh+acrOWxheS4reWvuem9kOOAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IENFTlRFUlxuICovXG4vKipcbiAqICEjZW4gVmVydGljYWwgYWxpZ25tZW50IGJvdHRvbSBmb3IgdGV4dC5cbiAqICEjemgg5paH5pys5bqV6YOo5a+56b2Q44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQk9UVE9NXG4gKi9cbmNvbnN0IFZlcnRpY2FsQWxpZ24gPSBtYWNyby5WZXJ0aWNhbFRleHRBbGlnbm1lbnQ7XG5cbi8qKlxuICogISNlbiBFbnVtIGZvciBPdmVyZmxvdy5cbiAqICEjemggT3ZlcmZsb3cg57G75Z6LXG4gKiBAZW51bSBMYWJlbC5PdmVyZmxvd1xuICovXG4vKipcbiAqICEjZW4gTk9ORS5cbiAqICEjemgg5LiN5YGa5Lu75L2V6ZmQ5Yi244CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gTk9ORVxuICovXG4vKipcbiAqICEjZW4gSW4gQ0xBTVAgbW9kZSwgd2hlbiBsYWJlbCBjb250ZW50IGdvZXMgb3V0IG9mIHRoZSBib3VuZGluZyBib3gsIGl0IHdpbGwgYmUgY2xpcHBlZC5cbiAqICEjemggQ0xBTVAg5qih5byP5Lit77yM5b2T5paH5pys5YaF5a656LaF5Ye66L6555WM5qGG5pe277yM5aSa5L2Z55qE5Lya6KKr5oiq5pat44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQ0xBTVBcbiAqL1xuLyoqXG4gKiAhI2VuIEluIFNIUklOSyBtb2RlLCB0aGUgZm9udCBzaXplIHdpbGwgY2hhbmdlIGR5bmFtaWNhbGx5IHRvIGFkYXB0IHRoZSBjb250ZW50IHNpemUuIFRoaXMgbW9kZSBtYXkgdGFrZXMgdXAgbW9yZSBDUFUgcmVzb3VyY2VzIHdoZW4gdGhlIGxhYmVsIGlzIHJlZnJlc2hlZC5cbiAqICEjemggU0hSSU5LIOaooeW8j++8jOWtl+S9k+Wkp+Wwj+S8muWKqOaAgeWPmOWMlu+8jOS7pemAguW6lOWGheWuueWkp+Wwj+OAgui/meS4quaooeW8j+WcqOaWh+acrOWIt+aWsOeahOaXtuWAmeWPr+iDveS8muWNoOeUqOi+g+WkmiBDUFUg6LWE5rqQ44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gU0hSSU5LXG4gKi9cbi8qKlxuICogISNlbiBJbiBSRVNJWkVfSEVJR0hUIG1vZGUsIHlvdSBjYW4gb25seSBjaGFuZ2UgdGhlIHdpZHRoIG9mIGxhYmVsIGFuZCB0aGUgaGVpZ2h0IGlzIGNoYW5nZWQgYXV0b21hdGljYWxseS5cbiAqICEjemgg5ZyoIFJFU0laRV9IRUlHSFQg5qih5byP5LiL77yM5Y+q6IO95pu05pS55paH5pys55qE5a695bqm77yM6auY5bqm5piv6Ieq5Yqo5pS55Y+Y55qE44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gUkVTSVpFX0hFSUdIVFxuICovXG5jb25zdCBPdmVyZmxvdyA9IGNjLkVudW0oe1xuICAgIE5PTkU6IDAsXG4gICAgQ0xBTVA6IDEsXG4gICAgU0hSSU5LOiAyLFxuICAgIFJFU0laRV9IRUlHSFQ6IDNcbn0pO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgZm9udCB0eXBlLlxuICogISN6aCBUeXBlIOexu+Wei1xuICogQGVudW0gTGFiZWwuVHlwZVxuICovXG4vKipcbiAqICEjZW4gVGhlIFRURiBmb250IHR5cGUuXG4gKiAhI3poIFRURuWtl+S9k1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IFRURlxuICovXG4vKipcbiAqICEjZW4gVGhlIGJpdG1hcCBmb250IHR5cGUuXG4gKiAhI3poIOS9jeWbvuWtl+S9k1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IEJNRm9udFxuICovXG4vKipcbiAqICEjZW4gVGhlIHN5c3RlbSBmb250IHR5cGUuXG4gKiAhI3poIOezu+e7n+Wtl+S9k1xuICogQHByb3BlcnR5IHtOdW1iZXJ9IFN5c3RlbUZvbnRcbiAqL1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgY2FjaGUgbW9kZS5cbiAqICEjemggQ2FjaGVNb2RlIOexu+Wei1xuICogQGVudW0gTGFiZWwuQ2FjaGVNb2RlXG4gKi9cbiAvKipcbiAqICEjZW4gRG8gbm90IGRvIGFueSBjYWNoaW5nLlxuICogISN6aCDkuI3lgZrku7vkvZXnvJPlrZjjgIJcbiAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBOT05FXG4gKi9cbi8qKlxuICogISNlbiBJbiBCSVRNQVAgbW9kZSwgY2FjaGUgdGhlIGxhYmVsIGFzIGEgc3RhdGljIGltYWdlIGFuZCBhZGQgaXQgdG8gdGhlIGR5bmFtaWMgYXRsYXMgZm9yIGJhdGNoIHJlbmRlcmluZywgYW5kIGNhbiBiYXRjaGluZyB3aXRoIFNwcml0ZXMgdXNpbmcgYnJva2VuIGltYWdlcy5cbiAqICEjemggQklUTUFQIOaooeW8j++8jOWwhiBsYWJlbCDnvJPlrZjmiJDpnZnmgIHlm77lg4/lubbliqDlhaXliLDliqjmgIHlm77pm4bvvIzku6Xkvr/ov5vooYzmibnmrKHlkIjlubbvvIzlj6/kuI7kvb/nlKjnoo7lm77nmoQgU3ByaXRlIOi/m+ihjOWQiOaJue+8iOazqO+8muWKqOaAgeWbvumbhuWcqCBDaHJvbWUg5Lul5Y+K5b6u5L+h5bCP5ri45oiP5pqC5pe25YWz6Zet77yM6K+l5Yqf6IO95peg5pWI77yJ44CCXG4gKiBAcHJvcGVydHkge051bWJlcn0gQklUTUFQXG4gKi9cbi8qKlxuICogISNlbiBJbiBDSEFSIG1vZGUsIHNwbGl0IHRleHQgaW50byBjaGFyYWN0ZXJzIGFuZCBjYWNoZSBjaGFyYWN0ZXJzIGludG8gYSBkeW5hbWljIGF0bGFzIHdoaWNoIHRoZSBzaXplIG9mIDIwNDgqMjA0OC4gXG4gKiAhI3poIENIQVIg5qih5byP77yM5bCG5paH5pys5ouG5YiG5Li65a2X56ym77yM5bm25bCG5a2X56ym57yT5a2Y5Yiw5LiA5byg5Y2V54us55qE5aSn5bCP5Li6IDIwNDgqMjA0OCDnmoTlm77pm4bkuK3ov5vooYzph43lpI3kvb/nlKjvvIzkuI3lho3kvb/nlKjliqjmgIHlm77pm4bvvIjms6jvvJrlvZPlm77pm4bmu6Hml7blsIbkuI3lho3ov5vooYznvJPlrZjvvIzmmoLml7bkuI3mlK/mjIEgU0hSSU5LIOiHqumAguW6lOaWh+acrOWwuuWvuO+8iOWQjue7reWujOWWhO+8ie+8ieOAglxuICogQHByb3BlcnR5IHtOdW1iZXJ9IENIQVJcbiAqL1xuY29uc3QgQ2FjaGVNb2RlID0gY2MuRW51bSh7XG4gICAgTk9ORTogMCxcbiAgICBCSVRNQVA6IDEsXG4gICAgQ0hBUjogMixcbn0pO1xuXG5jb25zdCBCT0xEX0ZMQUcgPSAxIDw8IDA7XG5jb25zdCBJVEFMSUNfRkxBRyA9IDEgPDwgMTtcbmNvbnN0IFVOREVSTElORV9GTEFHID0gMSA8PCAyO1xuXG4vKipcbiAqICEjZW4gVGhlIExhYmVsIENvbXBvbmVudC5cbiAqICEjemgg5paH5a2X5qCH562+57uE5Lu2XG4gKiBAY2xhc3MgTGFiZWxcbiAqIEBleHRlbmRzIFJlbmRlckNvbXBvbmVudFxuICovXG5sZXQgTGFiZWwgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkxhYmVsJyxcbiAgICBleHRlbmRzOiBSZW5kZXJDb21wb25lbnQsXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fdXNlckRlZmluZWRGb250ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2FjdHVhbEZvbnRTaXplID0gMDtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyRGF0YSA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fZnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLl90dGZUZXh0dXJlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbGV0dGVyVGV4dHVyZSA9IG51bGw7XG5cbiAgICAgICAgaWYgKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsID0gdGhpcy5fdXBkYXRlTWF0ZXJpYWxDYW52YXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbCA9IHRoaXMuX3VwZGF0ZU1hdGVyaWFsV2ViZ2w7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnJlbmRlcmVycy9MYWJlbCcsXG4gICAgICAgIGhlbHA6ICdpMThuOkNPTVBPTkVOVC5oZWxwX3VybC5sYWJlbCcsXG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvbGFiZWwuanMnLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF91c2VPcmlnaW5hbFNpemU6IHRydWUsXG4gICAgICAgIFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDb250ZW50IHN0cmluZyBvZiBsYWJlbC5cbiAgICAgICAgICogISN6aCDmoIfnrb7mmL7npLrnmoTmlofmnKzlhoXlrrnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHN0cmluZ1xuICAgICAgICAgKi9cbiAgICAgICAgX3N0cmluZzoge1xuICAgICAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICAgICAgICBmb3JtZXJseVNlcmlhbGl6ZWRBczogJ19OJHN0cmluZycsXG4gICAgICAgIH0sXG4gICAgICAgIHN0cmluZzoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RyaW5nO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSB0aGlzLl9zdHJpbmc7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RyaW5nID0gJycgKyB2YWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0cmluZyAhPT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hlY2tTdHJpbmdFbXB0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG11bHRpbGluZTogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuc3RyaW5nJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEhvcml6b250YWwgQWxpZ25tZW50IG9mIGxhYmVsLlxuICAgICAgICAgKiAhI3poIOaWh+acrOWGheWuueeahOawtOW5s+Wvuem9kOaWueW8j+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0xhYmVsLkhvcml6b250YWxBbGlnbn0gaG9yaXpvbnRhbEFsaWduXG4gICAgICAgICAqL1xuICAgICAgICBob3Jpem9udGFsQWxpZ246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IEhvcml6b250YWxBbGlnbi5MRUZULFxuICAgICAgICAgICAgdHlwZTogSG9yaXpvbnRhbEFsaWduLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5ob3Jpem9udGFsX2FsaWduJyxcbiAgICAgICAgICAgIG5vdGlmeSAgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbEFsaWduID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVmVydGljYWwgQWxpZ25tZW50IG9mIGxhYmVsLlxuICAgICAgICAgKiAhI3poIOaWh+acrOWGheWuueeahOWeguebtOWvuem9kOaWueW8j+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0xhYmVsLlZlcnRpY2FsQWxpZ259IHZlcnRpY2FsQWxpZ25cbiAgICAgICAgICovXG4gICAgICAgIHZlcnRpY2FsQWxpZ246IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IFZlcnRpY2FsQWxpZ24uVE9QLFxuICAgICAgICAgICAgdHlwZTogVmVydGljYWxBbGlnbixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwudmVydGljYWxfYWxpZ24nLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRpY2FsQWxpZ24gPT09IG9sZFZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBhY3R1YWwgcmVuZGVyaW5nIGZvbnQgc2l6ZSBpbiBzaHJpbmsgbW9kZVxuICAgICAgICAgKiAhI3poIFNIUklOSyDmqKHlvI/kuIvpnaLmlofmnKzlrp7pmYXmuLLmn5PnmoTlrZfkvZPlpKflsI9cbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGFjdHVhbEZvbnRTaXplXG4gICAgICAgICAqL1xuICAgICAgICBhY3R1YWxGb250U2l6ZToge1xuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdBY3R1YWwgRm9udCBTaXplJyxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgcmVhZG9ubHk6IHRydWUsXG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3R1YWxGb250U2l6ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLmFjdHVhbEZvbnRTaXplJyxcbiAgICAgICAgfSxcblxuICAgICAgICBfZm9udFNpemU6IDQwLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBGb250IHNpemUgb2YgbGFiZWwuXG4gICAgICAgICAqICEjemgg5paH5pys5a2X5L2T5aSn5bCP44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBmb250U2l6ZVxuICAgICAgICAgKi9cbiAgICAgICAgZm9udFNpemU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvbnRTaXplO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZm9udFNpemUgPT09IHZhbHVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9mb250U2l6ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhbmdlOiBbMCwgNTEyXSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuZm9udF9zaXplJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBGb250IGZhbWlseSBvZiBsYWJlbCwgb25seSB0YWtlIGVmZmVjdCB3aGVuIHVzZVN5c3RlbUZvbnQgcHJvcGVydHkgaXMgdHJ1ZS5cbiAgICAgICAgICogISN6aCDmlofmnKzlrZfkvZPlkI3np7AsIOWPquWcqCB1c2VTeXN0ZW1Gb250IOWxnuaAp+S4uiB0cnVlIOeahOaXtuWAmeeUn+aViOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gZm9udEZhbWlseVxuICAgICAgICAgKi9cbiAgICAgICAgZm9udEZhbWlseToge1xuICAgICAgICAgICAgZGVmYXVsdDogXCJBcmlhbFwiLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5mb250X2ZhbWlseScsXG4gICAgICAgICAgICBub3RpZnkgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9udEZhbWlseSA9PT0gb2xkVmFsdWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIF9saW5lSGVpZ2h0OiA0MCxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gTGluZSBIZWlnaHQgb2YgbGFiZWwuXG4gICAgICAgICAqICEjemgg5paH5pys6KGM6auY44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsaW5lSGVpZ2h0XG4gICAgICAgICAqL1xuICAgICAgICBsaW5lSGVpZ2h0OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9saW5lSGVpZ2h0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGluZUhlaWdodCA9PT0gdmFsdWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLl9saW5lSGVpZ2h0ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5saW5lX2hlaWdodCcsXG4gICAgICAgIH0sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIE92ZXJmbG93IG9mIGxhYmVsLlxuICAgICAgICAgKiAhI3poIOaWh+Wtl+aYvuekuui2heWHuuiMg+WbtOaXtueahOWkhOeQhuaWueW8j+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0xhYmVsLk92ZXJmbG93fSBvdmVyZmxvd1xuICAgICAgICAgKi9cbiAgICAgICAgb3ZlcmZsb3c6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IE92ZXJmbG93Lk5PTkUsXG4gICAgICAgICAgICB0eXBlOiBPdmVyZmxvdyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwub3ZlcmZsb3cnLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm92ZXJmbG93ID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2VuYWJsZVdyYXBUZXh0OiB0cnVlLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIGF1dG8gd3JhcCBsYWJlbCB3aGVuIHN0cmluZyB3aWR0aCBpcyBsYXJnZSB0aGFuIGxhYmVsIHdpZHRoLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuiHquWKqOaNouihjOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGVuYWJsZVdyYXBUZXh0XG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVXcmFwVGV4dDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlV3JhcFRleHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9lbmFibGVXcmFwVGV4dCA9PT0gdmFsdWUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZVdyYXBUZXh0ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLndyYXAnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIOi/meS4quS/neWtmOS6huaXp+mhueebrueahCBmaWxlIOaVsOaNrlxuICAgICAgICBfTiRmaWxlOiBudWxsLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBmb250IG9mIGxhYmVsLlxuICAgICAgICAgKiAhI3poIOaWh+acrOWtl+S9k+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0ZvbnR9IGZvbnRcbiAgICAgICAgICovXG4gICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX04kZmlsZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9udCA9PT0gdmFsdWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL2lmIGRlbGV0ZSB0aGUgZm9udCwgd2Ugc2hvdWxkIGNoYW5nZSBpc1N5c3RlbUZvbnRVc2VkIHRvIHRydWVcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzU3lzdGVtRm9udFVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXNlckRlZmluZWRGb250ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX04kZmlsZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0aGlzLl9pc1N5c3RlbUZvbnRVc2VkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc1N5c3RlbUZvbnRVc2VkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCg0MDAwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9mb3JjZVVwZGF0ZVJlbmRlckRhdGEoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBjYy5Gb250LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC5mb250JyxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2lzU3lzdGVtRm9udFVzZWQ6IHRydWUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hldGhlciB1c2Ugc3lzdGVtIGZvbnQgbmFtZSBvciBub3QuXG4gICAgICAgICAqICEjemgg5piv5ZCm5L2/55So57O757uf5a2X5L2T44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gdXNlU3lzdGVtRm9udFxuICAgICAgICAgKi9cbiAgICAgICAgdXNlU3lzdGVtRm9udDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNTeXN0ZW1Gb250VXNlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzU3lzdGVtRm9udFVzZWQgPT09IHZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5faXNTeXN0ZW1Gb250VXNlZCA9ICEhdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlICYmIHRoaXMuX3VzZXJEZWZpbmVkRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mb250ID0gdGhpcy5fdXNlckRlZmluZWRGb250O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjaW5nWCA9IHRoaXMuX3NwYWNpbmdYO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9udCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZm9yY2VVcGRhdGVSZW5kZXJEYXRhKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMubWFya0ZvclZhbGlkYXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLnN5c3RlbV9mb250JyxcbiAgICAgICAgfSxcblxuICAgICAgICBfYm1Gb250T3JpZ2luYWxTaXplOiB7XG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0JNRm9udCBPcmlnaW5hbCBTaXplJyxcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX04kZmlsZSBpbnN0YW5jZW9mIGNjLkJpdG1hcEZvbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX04kZmlsZS5mb250U2l6ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgX3NwYWNpbmdYOiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBzcGFjaW5nIG9mIHRoZSB4IGF4aXMgYmV0d2VlbiBjaGFyYWN0ZXJzLlxuICAgICAgICAgKiAhI3poIOaWh+Wtl+S5i+mXtCB4IOi9tOeahOmXtOi3neOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc3BhY2luZ1hcbiAgICAgICAgICovXG4gICAgICAgIHNwYWNpbmdYOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcGFjaW5nWDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3BhY2luZ1ggPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLnNwYWNpbmdYJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvL0ZvciBjb21wYXRpYmlsaXR5IHdpdGggdjIuMC54IHRlbXBvcmFyeSByZXNlcnZhdGlvbi5cbiAgICAgICAgX2JhdGNoQXNCaXRtYXA6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBjYWNoZSBtb2RlIG9mIGxhYmVsLiBUaGlzIG1vZGUgb25seSBzdXBwb3J0cyBzeXN0ZW0gZm9udHMuXG4gICAgICAgICAqICEjemgg5paH5pys57yT5a2Y5qih5byPLCDor6XmqKHlvI/lj6rmlK/mjIHns7vnu5/lrZfkvZPjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtMYWJlbC5DYWNoZU1vZGV9IGNhY2hlTW9kZVxuICAgICAgICAgKi9cbiAgICAgICAgY2FjaGVNb2RlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBDYWNoZU1vZGUuTk9ORSxcbiAgICAgICAgICAgIHR5cGU6IENhY2hlTW9kZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuY2FjaGVNb2RlJyxcbiAgICAgICAgICAgIG5vdGlmeSAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jYWNoZU1vZGUgPT09IG9sZFZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG9sZFZhbHVlID09PSBDYWNoZU1vZGUuQklUTUFQICYmICEodGhpcy5mb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZnJhbWUgJiYgdGhpcy5fZnJhbWUuX3Jlc2V0RHluYW1pY0F0bGFzRnJhbWUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob2xkVmFsdWUgPT09IENhY2hlTW9kZS5DSEFSKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3R0ZlRleHR1cmUgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmNlVXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgX3N0eWxlRmxhZ3M6IDAsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hldGhlciBlbmFibGUgYm9sZC5cbiAgICAgICAgICogISN6aCDmmK/lkKblkK/nlKjpu5HkvZPjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVCb2xkXG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVCb2xkOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhISh0aGlzLl9zdHlsZUZsYWdzICYgQk9MRF9GTEFHKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0eWxlRmxhZ3MgfD0gQk9MRF9GTEFHO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0eWxlRmxhZ3MgJj0gfkJPTERfRkxBRztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuYm9sZCdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaGV0aGVyIGVuYWJsZSBpdGFsaWMuXG4gICAgICAgICAqICEjemgg5piv5ZCm5ZCv55So6buR5L2T44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlSXRhbGljXG4gICAgICAgICAqL1xuICAgICAgICBlbmFibGVJdGFsaWM6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKHRoaXMuX3N0eWxlRmxhZ3MgJiBJVEFMSUNfRkxBRyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHlsZUZsYWdzIHw9IElUQUxJQ19GTEFHO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0eWxlRmxhZ3MgJj0gfklUQUxJQ19GTEFHO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQubGFiZWwuaXRhbGljJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFdoZXRoZXIgZW5hYmxlIHVuZGVybGluZS5cbiAgICAgICAgICogISN6aCDmmK/lkKblkK/nlKjkuIvliJLnur/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVVbmRlcmxpbmVcbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZVVuZGVybGluZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISEodGhpcy5fc3R5bGVGbGFncyAmIFVOREVSTElORV9GTEFHKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0eWxlRmxhZ3MgfD0gVU5ERVJMSU5FX0ZMQUc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3R5bGVGbGFncyAmPSB+VU5ERVJMSU5FX0ZMQUc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLnVuZGVybGluZSdcbiAgICAgICAgfSxcblxuICAgICAgICBfdW5kZXJsaW5lSGVpZ2h0OiAwLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgaGVpZ2h0IG9mIHVuZGVybGluZS5cbiAgICAgICAgICogISN6aCDkuIvliJLnur/pq5jluqbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHVuZGVybGluZUhlaWdodFxuICAgICAgICAgKi9cbiAgICAgICAgdW5kZXJsaW5lSGVpZ2h0OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl91bmRlcmxpbmVIZWlnaHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl91bmRlcmxpbmVIZWlnaHQgPT09IHZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5fdW5kZXJsaW5lSGVpZ2h0ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWZXJ0c0RpcnR5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5sYWJlbC51bmRlcmxpbmVfaGVpZ2h0JyxcbiAgICAgICAgfSxcbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBIb3Jpem9udGFsQWxpZ246IEhvcml6b250YWxBbGlnbixcbiAgICAgICAgVmVydGljYWxBbGlnbjogVmVydGljYWxBbGlnbixcbiAgICAgICAgT3ZlcmZsb3c6IE92ZXJmbG93LFxuICAgICAgICBDYWNoZU1vZGU6IENhY2hlTW9kZSxcblxuICAgICAgICBfc2hhcmVBdGxhczogbnVsbCxcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjemgg6ZyA6KaB5L+d6K+B5b2T5YmN5Zy65pmv5Lit5rKh5pyJ5L2/55SoQ0hBUue8k+WtmOeahExhYmVs5omN5Y+v5Lul5riF6Zmk77yM5ZCm5YiZ5bey5riy5p+T55qE5paH5a2X5rKh5pyJ6YeN5paw57uY5Yi25Lya5LiN5pi+56S6XG4gICAgICAgICAqICEjZW4gSXQgY2FuIGJlIGNsZWFyZWQgdGhhdCBuZWVkIHRvIGVuc3VyZSB0aGVyZSBpcyBub3QgdXNlIHRoZSBDSEFSIGNhY2hlIGluIHRoZSBjdXJyZW50IHNjZW5lLiBPdGhlcndpc2UsIHRoZSByZW5kZXJlZCB0ZXh0IHdpbGwgbm90IGJlIGRpc3BsYXllZCB3aXRob3V0IHJlcGFpbnRpbmcuXG4gICAgICAgICAqIEBtZXRob2QgY2xlYXJDaGFyQ2FjaGVcbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKi9cbiAgICAgICAgY2xlYXJDaGFyQ2FjaGUgKCkge1xuICAgICAgICAgICAgaWYgKExhYmVsLl9zaGFyZUF0bGFzKSB7XG4gICAgICAgICAgICAgICAgTGFiZWwuX3NoYXJlQXRsYXMuY2xlYXJBbGxDYWNoZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIC8vIEZvciBjb21wYXRpYmlsaXR5IHdpdGggdjIuMC54IHRlbXBvcmFyeSByZXNlcnZhdGlvbi5cbiAgICAgICAgaWYgKHRoaXMuX2JhdGNoQXNCaXRtYXAgJiYgdGhpcy5jYWNoZU1vZGUgPT09IENhY2hlTW9kZS5OT05FKSB7XG4gICAgICAgICAgICB0aGlzLmNhY2hlTW9kZSA9IENhY2hlTW9kZS5CSVRNQVA7XG4gICAgICAgICAgICB0aGlzLl9iYXRjaEFzQml0bWFwID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2MuZ2FtZS5yZW5kZXJUeXBlID09PSBjYy5nYW1lLlJFTkRFUl9UWVBFX0NBTlZBUykge1xuICAgICAgICAgICAgLy8gQ2FjaGVNb2RlIGlzIG5vdCBzdXBwb3J0ZWQgaW4gQ2FudmFzLlxuICAgICAgICAgICAgdGhpcy5jYWNoZU1vZGUgPSBDYWNoZU1vZGUuTk9ORTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG5cbiAgICAgICAgLy8gS2VlcCB0cmFjayBvZiBOb2RlIHNpemVcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fbm9kZVNpemVDaGFuZ2VkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLnNldFZlcnRzRGlydHksIHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX2ZvcmNlVXBkYXRlUmVuZGVyRGF0YSgpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fbm9kZVNpemVDaGFuZ2VkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5zZXRWZXJ0c0RpcnR5LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgdGhpcy5fYXNzZW1ibGVyICYmIHRoaXMuX2Fzc2VtYmxlci5fcmVzZXRBc3NlbWJsZXJEYXRhICYmIHRoaXMuX2Fzc2VtYmxlci5fcmVzZXRBc3NlbWJsZXJEYXRhKHRoaXMuX2Fzc2VtYmxlckRhdGEpO1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXJEYXRhID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbGV0dGVyVGV4dHVyZSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLl90dGZUZXh0dXJlKSB7XG4gICAgICAgICAgICB0aGlzLl90dGZUZXh0dXJlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX3R0ZlRleHR1cmUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIF9ub2RlU2l6ZUNoYW5nZWQgKCkge1xuICAgICAgICAvLyBCZWNhdXNlIHRoZSBjb250ZW50IHNpemUgaXMgYXV0b21hdGljYWxseSB1cGRhdGVkIHdoZW4gb3ZlcmZsb3cgaXMgTk9ORS5cbiAgICAgICAgLy8gQW5kIHRoaXMgd2lsbCBjb25mbGljdCB3aXRoIHRoZSBhbGlnbm1lbnQgb2YgdGhlIENDV2lkZ2V0LlxuICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IHRoaXMub3ZlcmZsb3cgIT09IE92ZXJmbG93Lk5PTkUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0VmVydHNEaXJ0eSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVDb2xvciAoKSB7XG4gICAgICAgIGlmICghKHRoaXMuZm9udCBpbnN0YW5jZW9mIGNjLkJpdG1hcEZvbnQpKSB7XG4gICAgICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgfVxuICAgICAgIFJlbmRlckNvbXBvbmVudC5wcm90b3R5cGUuX3VwZGF0ZUNvbG9yLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIF92YWxpZGF0ZVJlbmRlciAoKSB7XG4gICAgICAgIGlmICghdGhpcy5zdHJpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX21hdGVyaWFsc1swXSkge1xuICAgICAgICAgICAgbGV0IGZvbnQgPSB0aGlzLmZvbnQ7XG4gICAgICAgICAgICBpZiAoZm9udCBpbnN0YW5jZW9mIGNjLkJpdG1hcEZvbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3ByaXRlRnJhbWUgPSBmb250LnNwcml0ZUZyYW1lO1xuICAgICAgICAgICAgICAgIGlmIChzcHJpdGVGcmFtZSAmJiBcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlRnJhbWUudGV4dHVyZUxvYWRlZCgpICYmXG4gICAgICAgICAgICAgICAgICAgIGZvbnQuX2ZudENvbmZpZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgfSxcblxuICAgIF9yZXNldEFzc2VtYmxlciAoKSB7XG4gICAgICAgIHRoaXMuX2ZyYW1lID0gbnVsbDtcbiAgICAgICAgUmVuZGVyQ29tcG9uZW50LnByb3RvdHlwZS5fcmVzZXRBc3NlbWJsZXIuY2FsbCh0aGlzKTtcbiAgICB9LFxuXG4gICAgX2NoZWNrU3RyaW5nRW1wdHkgKCkge1xuICAgICAgICB0aGlzLm1hcmtGb3JSZW5kZXIoISF0aGlzLnN0cmluZyk7XG4gICAgfSxcblxuICAgIF9vbjNETm9kZUNoYW5nZWQgKCkge1xuICAgICAgICB0aGlzLl9yZXNldEFzc2VtYmxlcigpO1xuICAgICAgICB0aGlzLl9hcHBseUZvbnRUZXh0dXJlKCk7XG4gICAgfSxcblxuICAgIF9vbkJNRm9udFRleHR1cmVMb2FkZWQgKCkge1xuICAgICAgICB0aGlzLl9mcmFtZS5fdGV4dHVyZSA9IHRoaXMuZm9udC5zcHJpdGVGcmFtZS5fdGV4dHVyZTtcbiAgICAgICAgdGhpcy5tYXJrRm9yUmVuZGVyKHRydWUpO1xuICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbCgpO1xuICAgICAgICB0aGlzLl9hc3NlbWJsZXIgJiYgdGhpcy5fYXNzZW1ibGVyLnVwZGF0ZVJlbmRlckRhdGEodGhpcyk7XG4gICAgfSxcblxuICAgIF9hcHBseUZvbnRUZXh0dXJlICgpIHtcbiAgICAgICAgbGV0IGZvbnQgPSB0aGlzLmZvbnQ7XG4gICAgICAgIGlmIChmb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkge1xuICAgICAgICAgICAgbGV0IHNwcml0ZUZyYW1lID0gZm9udC5zcHJpdGVGcmFtZTtcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lID0gc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICBpZiAoc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgICAgICBzcHJpdGVGcmFtZS5vblRleHR1cmVMb2FkZWQodGhpcy5fb25CTUZvbnRUZXh0dXJlTG9hZGVkLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZnJhbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mcmFtZSA9IG5ldyBMYWJlbEZyYW1lKCk7XG4gICAgICAgICAgICB9XG4gXG4gICAgICAgICAgICBpZiAodGhpcy5jYWNoZU1vZGUgPT09IENhY2hlTW9kZS5DSEFSKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGV0dGVyVGV4dHVyZSA9IHRoaXMuX2Fzc2VtYmxlci5fZ2V0QXNzZW1ibGVyRGF0YSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lLl9yZWZyZXNoVGV4dHVyZSh0aGlzLl9sZXR0ZXJUZXh0dXJlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX3R0ZlRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90dGZUZXh0dXJlID0gbmV3IGNjLlRleHR1cmUyRCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Fzc2VtYmxlckRhdGEgPSB0aGlzLl9hc3NlbWJsZXIuX2dldEFzc2VtYmxlckRhdGEoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl90dGZUZXh0dXJlLmluaXRXaXRoRWxlbWVudCh0aGlzLl9hc3NlbWJsZXJEYXRhLmNhbnZhcyk7XG4gICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICBpZiAodGhpcy5jYWNoZU1vZGUgIT09IENhY2hlTW9kZS5DSEFSKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZnJhbWUuX3Jlc2V0RHluYW1pY0F0bGFzRnJhbWUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9mcmFtZS5fcmVmcmVzaFRleHR1cmUodGhpcy5fdHRmVGV4dHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsKCk7XG4gICAgICAgICAgICB0aGlzLl9hc3NlbWJsZXIgJiYgdGhpcy5fYXNzZW1ibGVyLnVwZGF0ZVJlbmRlckRhdGEodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXJrRm9yVmFsaWRhdGUoKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZU1hdGVyaWFsQ2FudmFzICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9mcmFtZSkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9mcmFtZS5fdGV4dHVyZS51cmwgPSB0aGlzLnV1aWQgKyAnX3RleHR1cmUnO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF0ZXJpYWxXZWJnbCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZnJhbWUpIHJldHVybjtcbiAgICAgICAgbGV0IG1hdGVyaWFsID0gdGhpcy5nZXRNYXRlcmlhbCgwKTtcbiAgICAgICAgbWF0ZXJpYWwgJiYgbWF0ZXJpYWwuc2V0UHJvcGVydHkoJ3RleHR1cmUnLCB0aGlzLl9mcmFtZS5fdGV4dHVyZSk7XG4gICAgfSxcblxuICAgIF9mb3JjZVVwZGF0ZVJlbmRlckRhdGEgKCkge1xuICAgICAgICB0aGlzLnNldFZlcnRzRGlydHkoKTtcbiAgICAgICAgdGhpcy5fcmVzZXRBc3NlbWJsZXIoKTtcbiAgICAgICAgdGhpcy5fYXBwbHlGb250VGV4dHVyZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgbGFiZWwuX2VuYWJsZUJvbGRgIGlzIGRlcHJlY2F0ZWQsIHVzZSBgbGFiZWwuZW5hYmxlQm9sZCA9IHRydWVgIGluc3RlYWQgcGxlYXNlLlxuICAgICAqL1xuICAgIF9lbmFibGVCb2xkIChlbmFibGVkKSB7XG4gICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgY2Mud2FybignYGxhYmVsLl9lbmFibGVCb2xkYCBpcyBkZXByZWNhdGVkLCB1c2UgYGxhYmVsLmVuYWJsZUJvbGQgPSB0cnVlYCBpbnN0ZWFkIHBsZWFzZScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW5hYmxlQm9sZCA9ICEhZW5hYmxlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYGxhYmVsLl9lbmFibGVJdGFsaWNzYCBpcyBkZXByZWNhdGVkLCB1c2UgYGxhYmVsLmVuYWJsZUl0YWxpY3MgPSB0cnVlYCBpbnN0ZWFkIHBsZWFzZS5cbiAgICAgKi9cbiAgICBfZW5hYmxlSXRhbGljcyAoZW5hYmxlZCkge1xuICAgICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ2BsYWJlbC5fZW5hYmxlSXRhbGljc2AgaXMgZGVwcmVjYXRlZCwgdXNlIGBsYWJlbC5lbmFibGVJdGFsaWNzID0gdHJ1ZWAgaW5zdGVhZCBwbGVhc2UnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVuYWJsZUl0YWxpYyA9ICEhZW5hYmxlZDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYGxhYmVsLl9lbmFibGVVbmRlcmxpbmVgIGlzIGRlcHJlY2F0ZWQsIHVzZSBgbGFiZWwuZW5hYmxlVW5kZXJsaW5lID0gdHJ1ZWAgaW5zdGVhZCBwbGVhc2UuXG4gICAgICovXG4gICAgX2VuYWJsZVVuZGVybGluZSAoZW5hYmxlZCkge1xuICAgICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgICAgIGNjLndhcm4oJ2BsYWJlbC5fZW5hYmxlVW5kZXJsaW5lYCBpcyBkZXByZWNhdGVkLCB1c2UgYGxhYmVsLmVuYWJsZVVuZGVybGluZSA9IHRydWVgIGluc3RlYWQgcGxlYXNlJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmFibGVVbmRlcmxpbmUgPSAhIWVuYWJsZWQ7XG4gICAgfSxcbiB9KTtcblxuIGNjLkxhYmVsID0gbW9kdWxlLmV4cG9ydHMgPSBMYWJlbDtcbiJdfQ==