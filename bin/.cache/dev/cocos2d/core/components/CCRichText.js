
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCRichText.js';
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
var js = require('../platform/js');

var macro = require('../platform/CCMacro');

var textUtils = require('../utils/text-utils');

var HtmlTextParser = require('../utils/html-text-parser');

var _htmlTextParser = new HtmlTextParser();

var HorizontalAlign = macro.TextAlignment;
var VerticalAlign = macro.VerticalTextAlignment;
var RichTextChildName = "RICHTEXT_CHILD";
var RichTextChildImageName = "RICHTEXT_Image_CHILD";
var CacheMode = cc.Label.CacheMode; // Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, arguments);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, arguments);
  };
}
/**
 * RichText pool
 */


var pool = new js.Pool(function (node) {
  if (CC_EDITOR) {
    cc.isValid(node) && node.destroy();
    return false;
  }

  if (CC_DEV) {
    cc.assert(!node._parent, 'Recycling node\'s parent should be null!');
  }

  if (!cc.isValid(node)) {
    return false;
  } else {
    var outline = node.getComponent(cc.LabelOutline);

    if (outline) {
      outline.width = 0;
    }
  }

  return true;
}, 20);

pool.get = function (string, richtext) {
  var labelNode = this._get();

  if (!labelNode) {
    labelNode = new cc.PrivateNode(RichTextChildName);
  }

  labelNode.setPosition(0, 0);
  labelNode.setAnchorPoint(0.5, 0.5);
  labelNode.skewX = 0;
  var labelComponent = labelNode.getComponent(cc.Label);

  if (!labelComponent) {
    labelComponent = labelNode.addComponent(cc.Label);
  }

  labelComponent.string = "";
  labelComponent.horizontalAlign = HorizontalAlign.LEFT;
  labelComponent.verticalAlign = VerticalAlign.CENTER;
  return labelNode;
};
/**
 * !#en The RichText Component.
 * !#zh 富文本组件
 * @class RichText
 * @extends Component
 */


var RichText = cc.Class({
  name: 'cc.RichText',
  "extends": cc.Component,
  ctor: function ctor() {
    this._textArray = null;
    this._labelSegments = [];
    this._labelSegmentsCache = [];
    this._linesWidth = [];

    if (CC_EDITOR) {
      this._userDefinedFont = null;
      this._updateRichTextStatus = debounce(this._updateRichText, 200);
    } else {
      this._updateRichTextStatus = this._updateRichText;
    }
  },
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/RichText',
    help: 'i18n:COMPONENT.help_url.richtext',
    inspector: 'packages://inspector/inspectors/comps/richtext.js',
    executeInEditMode: true
  },
  properties: {
    /**
     * !#en Content string of RichText.
     * !#zh 富文本显示的文本内容。
     * @property {String} string
     */
    string: {
      "default": '<color=#00ff00>Rich</c><color=#0fffff>Text</color>',
      multiline: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.string',
      notify: function notify() {
        this._updateRichTextStatus();
      }
    },

    /**
     * !#en Horizontal Alignment of each line in RichText.
     * !#zh 文本内容的水平对齐方式。
     * @property {macro.TextAlignment} horizontalAlign
     */
    horizontalAlign: {
      "default": HorizontalAlign.LEFT,
      type: HorizontalAlign,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.horizontal_align',
      animatable: false,
      notify: function notify(oldValue) {
        if (this.horizontalAlign === oldValue) return;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en Font size of RichText.
     * !#zh 富文本字体大小。
     * @property {Number} fontSize
     */
    fontSize: {
      "default": 40,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.font_size',
      notify: function notify(oldValue) {
        if (this.fontSize === oldValue) return;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en Custom System font of RichText
     * !#zh 富文本定制系统字体
     * @property {String} fontFamily
     */
    _fontFamily: "Arial",
    fontFamily: {
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.font_family',
      get: function get() {
        return this._fontFamily;
      },
      set: function set(value) {
        if (this._fontFamily === value) return;
        this._fontFamily = value;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      },
      animatable: false
    },

    /**
     * !#en Custom TTF font of RichText
     * !#zh  富文本定制字体
     * @property {cc.TTFFont} font
     */
    font: {
      "default": null,
      type: cc.TTFFont,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.font',
      notify: function notify(oldValue) {
        if (this.font === oldValue) return;
        this._layoutDirty = true;

        if (this.font) {
          if (CC_EDITOR) {
            this._userDefinedFont = this.font;
          }

          this.useSystemFont = false;

          this._onTTFLoaded();
        } else {
          this.useSystemFont = true;
        }

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en Whether use system font name or not.
     * !#zh 是否使用系统字体。
     * @property {Boolean} useSystemFont
     */
    _isSystemFontUsed: true,
    useSystemFont: {
      get: function get() {
        return this._isSystemFontUsed;
      },
      set: function set(value) {
        if (this._isSystemFontUsed === value) {
          return;
        }

        this._isSystemFontUsed = value;

        if (CC_EDITOR) {
          if (value) {
            this.font = null;
          } else if (this._userDefinedFont) {
            this.font = this._userDefinedFont;
            return;
          }
        }

        this._layoutDirty = true;

        this._updateRichTextStatus();
      },
      animatable: false,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.system_font'
    },

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

        this._updateRichTextStatus();
      },
      animatable: false
    },

    /**
     * !#en The maximize width of the RichText
     * !#zh 富文本的最大宽度
     * @property {Number} maxWidth
     */
    maxWidth: {
      "default": 0,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.max_width',
      notify: function notify(oldValue) {
        if (this.maxWidth === oldValue) return;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en Line Height of RichText.
     * !#zh 富文本行高。
     * @property {Number} lineHeight
     */
    lineHeight: {
      "default": 40,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.line_height',
      notify: function notify(oldValue) {
        if (this.lineHeight === oldValue) return;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en The image atlas for the img tag. For each src value in the img tag, there should be a valid spriteFrame in the image atlas.
     * !#zh 对于 img 标签里面的 src 属性名称，都需要在 imageAtlas 里面找到一个有效的 spriteFrame，否则 img tag 会判定为无效。
     * @property {SpriteAtlas} imageAtlas
     */
    imageAtlas: {
      "default": null,
      type: cc.SpriteAtlas,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.image_atlas',
      notify: function notify(oldValue) {
        if (this.imageAtlas === oldValue) return;
        this._layoutDirty = true;

        this._updateRichTextStatus();
      }
    },

    /**
     * !#en
     * Once checked, the RichText will block all input events (mouse and touch) within
     * the bounding box of the node, preventing the input from penetrating into the underlying node.
     * !#zh
     * 选中此选项后，RichText 将阻止节点边界框中的所有输入事件（鼠标和触摸），从而防止输入事件穿透到底层节点。
     * @property {Boolean} handleTouchEvent
     * @default true
     */
    handleTouchEvent: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.richtext.handleTouchEvent',
      notify: function notify(oldValue) {
        if (this.handleTouchEvent === oldValue) return;

        if (this.enabledInHierarchy) {
          this.handleTouchEvent ? this._addEventListeners() : this._removeEventListeners();
        }
      }
    }
  },
  statics: {
    HorizontalAlign: HorizontalAlign,
    VerticalAlign: VerticalAlign
  },
  onEnable: function onEnable() {
    if (this.handleTouchEvent) {
      this._addEventListeners();
    }

    this._updateRichText();

    this._activateChildren(true);
  },
  onDisable: function onDisable() {
    if (this.handleTouchEvent) {
      this._removeEventListeners();
    }

    this._activateChildren(false);
  },
  start: function start() {
    this._onTTFLoaded();
  },
  _onColorChanged: function _onColorChanged(parentColor) {
    var children = this.node.children;
    children.forEach(function (childNode) {
      childNode.color = parentColor;
    });
  },
  _addEventListeners: function _addEventListeners() {
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    this.node.on(cc.Node.EventType.COLOR_CHANGED, this._onColorChanged, this);
  },
  _removeEventListeners: function _removeEventListeners() {
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
    this.node.off(cc.Node.EventType.COLOR_CHANGED, this._onColorChanged, this);
  },
  _updateLabelSegmentTextAttributes: function _updateLabelSegmentTextAttributes() {
    this._labelSegments.forEach(function (item) {
      this._applyTextAttribute(item, null, true);
    }.bind(this));
  },
  _createFontLabel: function _createFontLabel(string) {
    return pool.get(string, this);
  },
  _onTTFLoaded: function _onTTFLoaded() {
    if (this.font instanceof cc.TTFFont) {
      if (this.font._nativeAsset) {
        this._layoutDirty = true;

        this._updateRichText();
      } else {
        var self = this;
        cc.loader.load(this.font.nativeUrl, function (err, fontFamily) {
          self._layoutDirty = true;

          self._updateRichText();
        });
      }
    } else {
      this._layoutDirty = true;

      this._updateRichText();
    }
  },
  _measureText: function _measureText(styleIndex, string) {
    var self = this;

    var func = function func(string) {
      var label;

      if (self._labelSegmentsCache.length === 0) {
        label = self._createFontLabel(string);

        self._labelSegmentsCache.push(label);
      } else {
        label = self._labelSegmentsCache[0];
      }

      label._styleIndex = styleIndex;

      self._applyTextAttribute(label, string, true);

      var labelSize = label.getContentSize();
      return labelSize.width;
    };

    if (string) {
      return func(string);
    } else {
      return func;
    }
  },
  _onTouchEnded: function _onTouchEnded(event) {
    var _this = this;

    var components = this.node.getComponents(cc.Component);

    var _loop = function _loop(i) {
      var labelSegment = _this._labelSegments[i];
      var clickHandler = labelSegment._clickHandler;
      var clickParam = labelSegment._clickParam;

      if (clickHandler && _this._containsTouchLocation(labelSegment, event.touch.getLocation())) {
        components.forEach(function (component) {
          if (component.enabledInHierarchy && component[clickHandler]) {
            component[clickHandler](event, clickParam);
          }
        });
        event.stopPropagation();
      }
    };

    for (var i = 0; i < this._labelSegments.length; ++i) {
      _loop(i);
    }
  },
  _containsTouchLocation: function _containsTouchLocation(label, point) {
    var myRect = label.getBoundingBoxToWorld();
    return myRect.contains(point);
  },
  _resetState: function _resetState() {
    var children = this.node.children;

    for (var i = children.length - 1; i >= 0; i--) {
      var child = children[i];

      if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
        if (child.parent === this.node) {
          child.parent = null;
        } else {
          // In case child.parent !== this.node, child cannot be removed from children
          children.splice(i, 1);
        }

        if (child.name === RichTextChildName) {
          pool.put(child);
        }
      }
    }

    this._labelSegments.length = 0;
    this._labelSegmentsCache.length = 0;
    this._linesWidth.length = 0;
    this._lineOffsetX = 0;
    this._lineCount = 1;
    this._labelWidth = 0;
    this._labelHeight = 0;
    this._layoutDirty = true;
  },
  onRestore: CC_EDITOR && function () {
    // TODO: refine undo/redo system
    // Because undo/redo will not call onEnable/onDisable,
    // we need call onEnable/onDisable manually to active/disactive children nodes.
    if (this.enabledInHierarchy) {
      this.onEnable();
    } else {
      this.onDisable();
    }
  },
  _activateChildren: function _activateChildren(active) {
    for (var i = this.node.children.length - 1; i >= 0; i--) {
      var child = this.node.children[i];

      if (child.name === RichTextChildName || child.name === RichTextChildImageName) {
        child.active = active;
      }
    }
  },
  _addLabelSegment: function _addLabelSegment(stringToken, styleIndex) {
    var labelSegment;

    if (this._labelSegmentsCache.length === 0) {
      labelSegment = this._createFontLabel(stringToken);
    } else {
      labelSegment = this._labelSegmentsCache.pop();
    }

    labelSegment._styleIndex = styleIndex;
    labelSegment._lineCount = this._lineCount;
    labelSegment.active = this.node.active;
    labelSegment.setAnchorPoint(0, 0);

    this._applyTextAttribute(labelSegment, stringToken);

    this.node.addChild(labelSegment);

    this._labelSegments.push(labelSegment);

    return labelSegment;
  },
  _updateRichTextWithMaxWidth: function _updateRichTextWithMaxWidth(labelString, labelWidth, styleIndex) {
    var fragmentWidth = labelWidth;
    var labelSegment;

    if (this._lineOffsetX > 0 && fragmentWidth + this._lineOffsetX > this.maxWidth) {
      //concat previous line
      var checkStartIndex = 0;

      while (this._lineOffsetX <= this.maxWidth) {
        var checkEndIndex = this._getFirstWordLen(labelString, checkStartIndex, labelString.length);

        var checkString = labelString.substr(checkStartIndex, checkEndIndex);

        var checkStringWidth = this._measureText(styleIndex, checkString);

        if (this._lineOffsetX + checkStringWidth <= this.maxWidth) {
          this._lineOffsetX += checkStringWidth;
          checkStartIndex += checkEndIndex;
        } else {
          if (checkStartIndex > 0) {
            var remainingString = labelString.substr(0, checkStartIndex);

            this._addLabelSegment(remainingString, styleIndex);

            labelString = labelString.substr(checkStartIndex, labelString.length);
            fragmentWidth = this._measureText(styleIndex, labelString);
          }

          this._updateLineInfo();

          break;
        }
      }
    }

    if (fragmentWidth > this.maxWidth) {
      var fragments = textUtils.fragmentText(labelString, fragmentWidth, this.maxWidth, this._measureText(styleIndex));

      for (var k = 0; k < fragments.length; ++k) {
        var splitString = fragments[k];
        labelSegment = this._addLabelSegment(splitString, styleIndex);
        var labelSize = labelSegment.getContentSize();
        this._lineOffsetX += labelSize.width;

        if (fragments.length > 1 && k < fragments.length - 1) {
          this._updateLineInfo();
        }
      }
    } else {
      this._lineOffsetX += fragmentWidth;

      this._addLabelSegment(labelString, styleIndex);
    }
  },
  _isLastComponentCR: function _isLastComponentCR(stringToken) {
    return stringToken.length - 1 === stringToken.lastIndexOf("\n");
  },
  _updateLineInfo: function _updateLineInfo() {
    this._linesWidth.push(this._lineOffsetX);

    this._lineOffsetX = 0;
    this._lineCount++;
  },
  _needsUpdateTextLayout: function _needsUpdateTextLayout(newTextArray) {
    if (this._layoutDirty || !this._textArray || !newTextArray) {
      return true;
    }

    if (this._textArray.length !== newTextArray.length) {
      return true;
    }

    for (var i = 0; i < this._textArray.length; ++i) {
      var oldItem = this._textArray[i];
      var newItem = newTextArray[i];

      if (oldItem.text !== newItem.text) {
        return true;
      } else {
        if (oldItem.style) {
          if (newItem.style) {
            if (!!newItem.style.outline !== !!oldItem.style.outline) {
              return true;
            }

            if (oldItem.style.size !== newItem.style.size || oldItem.style.italic !== newItem.style.italic || oldItem.style.isImage !== newItem.style.isImage) {
              return true;
            }

            if (oldItem.style.isImage === newItem.style.isImage) {
              if (oldItem.style.src !== newItem.style.src) {
                return true;
              }
            }
          } else {
            if (oldItem.style.size || oldItem.style.italic || oldItem.style.isImage || oldItem.style.outline) {
              return true;
            }
          }
        } else {
          if (newItem.style) {
            if (newItem.style.size || newItem.style.italic || newItem.style.isImage || newItem.style.outline) {
              return true;
            }
          }
        }
      }
    }

    return false;
  },
  _addRichTextImageElement: function _addRichTextImageElement(richTextElement) {
    var spriteFrameName = richTextElement.style.src;
    var spriteFrame = this.imageAtlas.getSpriteFrame(spriteFrameName);

    if (spriteFrame) {
      var spriteNode = new cc.PrivateNode(RichTextChildImageName);
      var spriteComponent = spriteNode.addComponent(cc.Sprite);

      switch (richTextElement.style.imageAlign) {
        case 'top':
          spriteNode.setAnchorPoint(0, 1);
          break;

        case 'center':
          spriteNode.setAnchorPoint(0, 0.5);
          break;

        default:
          spriteNode.setAnchorPoint(0, 0);
          break;
      }

      if (richTextElement.style.imageOffset) spriteNode._imageOffset = richTextElement.style.imageOffset;
      spriteComponent.type = cc.Sprite.Type.SLICED;
      spriteComponent.sizeMode = cc.Sprite.SizeMode.CUSTOM;
      this.node.addChild(spriteNode);

      this._labelSegments.push(spriteNode);

      var spriteRect = spriteFrame.getRect();
      var scaleFactor = 1;
      var spriteWidth = spriteRect.width;
      var spriteHeight = spriteRect.height;
      var expectWidth = richTextElement.style.imageWidth;
      var expectHeight = richTextElement.style.imageHeight;

      if (expectHeight > 0) {
        scaleFactor = expectHeight / spriteHeight;
        spriteWidth = spriteWidth * scaleFactor;
        spriteHeight = spriteHeight * scaleFactor;
      } else {
        scaleFactor = this.lineHeight / spriteHeight;
        spriteWidth = spriteWidth * scaleFactor;
        spriteHeight = spriteHeight * scaleFactor;
      }

      if (expectWidth > 0) spriteWidth = expectWidth;

      if (this.maxWidth > 0) {
        if (this._lineOffsetX + spriteWidth > this.maxWidth) {
          this._updateLineInfo();
        }

        this._lineOffsetX += spriteWidth;
      } else {
        this._lineOffsetX += spriteWidth;

        if (this._lineOffsetX > this._labelWidth) {
          this._labelWidth = this._lineOffsetX;
        }
      }

      spriteComponent.spriteFrame = spriteFrame;
      spriteNode.setContentSize(spriteWidth, spriteHeight);
      spriteNode._lineCount = this._lineCount;

      if (richTextElement.style.event) {
        if (richTextElement.style.event.click) {
          spriteNode._clickHandler = richTextElement.style.event.click;
        }

        if (richTextElement.style.event.param) {
          spriteNode._clickParam = richTextElement.style.event.param;
        } else {
          spriteNode._clickParam = '';
        }
      } else {
        spriteNode._clickHandler = null;
      }
    } else {
      cc.warnID(4400);
    }
  },
  _updateRichText: function _updateRichText() {
    if (!this.enabledInHierarchy) return;

    var newTextArray = _htmlTextParser.parse(this.string);

    if (!this._needsUpdateTextLayout(newTextArray)) {
      this._textArray = newTextArray;

      this._updateLabelSegmentTextAttributes();

      return;
    }

    this._textArray = newTextArray;

    this._resetState();

    var lastEmptyLine = false;
    var label;
    var labelSize;

    for (var i = 0; i < this._textArray.length; ++i) {
      var richTextElement = this._textArray[i];
      var text = richTextElement.text; //handle <br/> <img /> tag

      if (text === "") {
        if (richTextElement.style && richTextElement.style.newline) {
          this._updateLineInfo();

          continue;
        }

        if (richTextElement.style && richTextElement.style.isImage && this.imageAtlas) {
          this._addRichTextImageElement(richTextElement);

          continue;
        }
      }

      var multilineTexts = text.split("\n");

      for (var j = 0; j < multilineTexts.length; ++j) {
        var labelString = multilineTexts[j];

        if (labelString === "") {
          //for continues \n
          if (this._isLastComponentCR(text) && j === multilineTexts.length - 1) {
            continue;
          }

          this._updateLineInfo();

          lastEmptyLine = true;
          continue;
        }

        lastEmptyLine = false;

        if (this.maxWidth > 0) {
          var labelWidth = this._measureText(i, labelString);

          this._updateRichTextWithMaxWidth(labelString, labelWidth, i);

          if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
            this._updateLineInfo();
          }
        } else {
          label = this._addLabelSegment(labelString, i);
          labelSize = label.getContentSize();
          this._lineOffsetX += labelSize.width;

          if (this._lineOffsetX > this._labelWidth) {
            this._labelWidth = this._lineOffsetX;
          }

          if (multilineTexts.length > 1 && j < multilineTexts.length - 1) {
            this._updateLineInfo();
          }
        }
      }
    }

    if (!lastEmptyLine) {
      this._linesWidth.push(this._lineOffsetX);
    }

    if (this.maxWidth > 0) {
      this._labelWidth = this.maxWidth;
    }

    this._labelHeight = (this._lineCount + textUtils.BASELINE_RATIO) * this.lineHeight; // trigger "size-changed" event

    this.node.setContentSize(this._labelWidth, this._labelHeight);

    this._updateRichTextPosition();

    this._layoutDirty = false;
  },
  _getFirstWordLen: function _getFirstWordLen(text, startIndex, textLen) {
    var character = text.charAt(startIndex);

    if (textUtils.isUnicodeCJK(character) || textUtils.isUnicodeSpace(character)) {
      return 1;
    }

    var len = 1;

    for (var index = startIndex + 1; index < textLen; ++index) {
      character = text.charAt(index);

      if (textUtils.isUnicodeSpace(character) || textUtils.isUnicodeCJK(character)) {
        break;
      }

      len++;
    }

    return len;
  },
  _updateRichTextPosition: function _updateRichTextPosition() {
    var nextTokenX = 0;
    var nextLineIndex = 1;
    var totalLineCount = this._lineCount;

    for (var i = 0; i < this._labelSegments.length; ++i) {
      var label = this._labelSegments[i];
      var lineCount = label._lineCount;

      if (lineCount > nextLineIndex) {
        nextTokenX = 0;
        nextLineIndex = lineCount;
      }

      var lineOffsetX = 0; // let nodeAnchorXOffset = (0.5 - this.node.anchorX) * this._labelWidth;

      switch (this.horizontalAlign) {
        case HorizontalAlign.LEFT:
          lineOffsetX = -this._labelWidth / 2;
          break;

        case HorizontalAlign.CENTER:
          lineOffsetX = -this._linesWidth[lineCount - 1] / 2;
          break;

        case HorizontalAlign.RIGHT:
          lineOffsetX = this._labelWidth / 2 - this._linesWidth[lineCount - 1];
          break;

        default:
          break;
      }

      label.x = nextTokenX + lineOffsetX;
      var labelSize = label.getContentSize();
      label.y = this.lineHeight * (totalLineCount - lineCount) - this._labelHeight / 2;

      if (lineCount === nextLineIndex) {
        nextTokenX += labelSize.width;
      }

      var sprite = label.getComponent(cc.Sprite);

      if (sprite) {
        // adjust img align (from <img align=top|center|bottom>)
        var lineHeightSet = this.lineHeight;
        var lineHeightReal = this.lineHeight * (1 + textUtils.BASELINE_RATIO); //single line node height

        switch (label.anchorY) {
          case 1:
            label.y += lineHeightSet + (lineHeightReal - lineHeightSet) / 2;
            break;

          case 0.5:
            label.y += lineHeightReal / 2;
            break;

          default:
            label.y += (lineHeightReal - lineHeightSet) / 2;
            break;
        } // adjust img offset (from <img offset=12|12,34>)


        if (label._imageOffset) {
          var offsets = label._imageOffset.split(',');

          if (offsets.length === 1 && offsets[0]) {
            var offsetY = parseFloat(offsets[0]);
            if (Number.isInteger(offsetY)) label.y += offsetY;
          } else if (offsets.length === 2) {
            var offsetX = parseFloat(offsets[0]);

            var _offsetY = parseFloat(offsets[1]);

            if (Number.isInteger(offsetX)) label.x += offsetX;
            if (Number.isInteger(_offsetY)) label.y += _offsetY;
          }
        }
      } //adjust y for label with outline


      var outline = label.getComponent(cc.LabelOutline);
      if (outline && outline.width) label.y = label.y - outline.width;
    }
  },
  _convertLiteralColorValue: function _convertLiteralColorValue(color) {
    var colorValue = color.toUpperCase();

    if (cc.Color[colorValue]) {
      return cc.Color[colorValue];
    } else {
      var out = cc.color();
      return out.fromHEX(color);
    }
  },
  // When string is null, it means that the text does not need to be updated. 
  _applyTextAttribute: function _applyTextAttribute(labelNode, string, force) {
    var labelComponent = labelNode.getComponent(cc.Label);

    if (!labelComponent) {
      return;
    }

    var index = labelNode._styleIndex;
    var textStyle = null;

    if (this._textArray[index]) {
      textStyle = this._textArray[index].style;
    }

    if (textStyle && textStyle.color) {
      labelNode.color = this._convertLiteralColorValue(textStyle.color);
    } else {
      labelNode.color = this.node.color;
    }

    labelComponent.cacheMode = this.cacheMode;
    var isAsset = this.font instanceof cc.Font;

    if (isAsset && !this._isSystemFontUsed) {
      labelComponent.font = this.font;
    } else {
      labelComponent.fontFamily = this.fontFamily;
    }

    labelComponent.useSystemFont = this._isSystemFontUsed;
    labelComponent.lineHeight = this.lineHeight;
    labelComponent.enableBold = textStyle && textStyle.bold;
    labelComponent.enableItalics = textStyle && textStyle.italic; //TODO: temporary implementation, the italic effect should be implemented in the internal of label-assembler.

    if (textStyle && textStyle.italic) {
      labelNode.skewX = 12;
    }

    labelComponent.enableUnderline = textStyle && textStyle.underline;

    if (textStyle && textStyle.outline) {
      var labelOutlineComponent = labelNode.getComponent(cc.LabelOutline);

      if (!labelOutlineComponent) {
        labelOutlineComponent = labelNode.addComponent(cc.LabelOutline);
      }

      labelOutlineComponent.color = this._convertLiteralColorValue(textStyle.outline.color);
      labelOutlineComponent.width = textStyle.outline.width;
    }

    if (textStyle && textStyle.size) {
      labelComponent.fontSize = textStyle.size;
    } else {
      labelComponent.fontSize = this.fontSize;
    }

    if (string !== null) {
      if (typeof string !== 'string') {
        string = '' + string;
      }

      labelComponent.string = string;
    }

    force && labelComponent._forceUpdateRenderData();

    if (textStyle && textStyle.event) {
      if (textStyle.event.click) {
        labelNode._clickHandler = textStyle.event.click;
      }

      if (textStyle.event.param) {
        labelNode._clickParam = textStyle.event.param;
      } else {
        labelNode._clickParam = '';
      }
    } else {
      labelNode._clickHandler = null;
    }
  },
  onDestroy: function onDestroy() {
    for (var i = 0; i < this._labelSegments.length; ++i) {
      this._labelSegments[i].removeFromParent();

      pool.put(this._labelSegments[i]);
    }
  }
});
cc.RichText = module.exports = RichText;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDUmljaFRleHQuanMiXSwibmFtZXMiOlsianMiLCJyZXF1aXJlIiwibWFjcm8iLCJ0ZXh0VXRpbHMiLCJIdG1sVGV4dFBhcnNlciIsIl9odG1sVGV4dFBhcnNlciIsIkhvcml6b250YWxBbGlnbiIsIlRleHRBbGlnbm1lbnQiLCJWZXJ0aWNhbEFsaWduIiwiVmVydGljYWxUZXh0QWxpZ25tZW50IiwiUmljaFRleHRDaGlsZE5hbWUiLCJSaWNoVGV4dENoaWxkSW1hZ2VOYW1lIiwiQ2FjaGVNb2RlIiwiY2MiLCJMYWJlbCIsImRlYm91bmNlIiwiZnVuYyIsIndhaXQiLCJpbW1lZGlhdGUiLCJ0aW1lb3V0IiwiY29udGV4dCIsImxhdGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJjYWxsTm93IiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInBvb2wiLCJQb29sIiwibm9kZSIsIkNDX0VESVRPUiIsImlzVmFsaWQiLCJkZXN0cm95IiwiQ0NfREVWIiwiYXNzZXJ0IiwiX3BhcmVudCIsIm91dGxpbmUiLCJnZXRDb21wb25lbnQiLCJMYWJlbE91dGxpbmUiLCJ3aWR0aCIsImdldCIsInN0cmluZyIsInJpY2h0ZXh0IiwibGFiZWxOb2RlIiwiX2dldCIsIlByaXZhdGVOb2RlIiwic2V0UG9zaXRpb24iLCJzZXRBbmNob3JQb2ludCIsInNrZXdYIiwibGFiZWxDb21wb25lbnQiLCJhZGRDb21wb25lbnQiLCJob3Jpem9udGFsQWxpZ24iLCJMRUZUIiwidmVydGljYWxBbGlnbiIsIkNFTlRFUiIsIlJpY2hUZXh0IiwiQ2xhc3MiLCJuYW1lIiwiQ29tcG9uZW50IiwiY3RvciIsIl90ZXh0QXJyYXkiLCJfbGFiZWxTZWdtZW50cyIsIl9sYWJlbFNlZ21lbnRzQ2FjaGUiLCJfbGluZXNXaWR0aCIsIl91c2VyRGVmaW5lZEZvbnQiLCJfdXBkYXRlUmljaFRleHRTdGF0dXMiLCJfdXBkYXRlUmljaFRleHQiLCJlZGl0b3IiLCJtZW51IiwiaGVscCIsImluc3BlY3RvciIsImV4ZWN1dGVJbkVkaXRNb2RlIiwicHJvcGVydGllcyIsIm11bHRpbGluZSIsInRvb2x0aXAiLCJub3RpZnkiLCJ0eXBlIiwiYW5pbWF0YWJsZSIsIm9sZFZhbHVlIiwiX2xheW91dERpcnR5IiwiZm9udFNpemUiLCJfZm9udEZhbWlseSIsImZvbnRGYW1pbHkiLCJzZXQiLCJ2YWx1ZSIsImZvbnQiLCJUVEZGb250IiwidXNlU3lzdGVtRm9udCIsIl9vblRURkxvYWRlZCIsIl9pc1N5c3RlbUZvbnRVc2VkIiwiY2FjaGVNb2RlIiwiTk9ORSIsIm1heFdpZHRoIiwibGluZUhlaWdodCIsImltYWdlQXRsYXMiLCJTcHJpdGVBdGxhcyIsImhhbmRsZVRvdWNoRXZlbnQiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJfYWRkRXZlbnRMaXN0ZW5lcnMiLCJfcmVtb3ZlRXZlbnRMaXN0ZW5lcnMiLCJzdGF0aWNzIiwib25FbmFibGUiLCJfYWN0aXZhdGVDaGlsZHJlbiIsIm9uRGlzYWJsZSIsInN0YXJ0IiwiX29uQ29sb3JDaGFuZ2VkIiwicGFyZW50Q29sb3IiLCJjaGlsZHJlbiIsImZvckVhY2giLCJjaGlsZE5vZGUiLCJjb2xvciIsIm9uIiwiTm9kZSIsIkV2ZW50VHlwZSIsIlRPVUNIX0VORCIsIl9vblRvdWNoRW5kZWQiLCJDT0xPUl9DSEFOR0VEIiwib2ZmIiwiX3VwZGF0ZUxhYmVsU2VnbWVudFRleHRBdHRyaWJ1dGVzIiwiaXRlbSIsIl9hcHBseVRleHRBdHRyaWJ1dGUiLCJiaW5kIiwiX2NyZWF0ZUZvbnRMYWJlbCIsIl9uYXRpdmVBc3NldCIsInNlbGYiLCJsb2FkZXIiLCJsb2FkIiwibmF0aXZlVXJsIiwiZXJyIiwiX21lYXN1cmVUZXh0Iiwic3R5bGVJbmRleCIsImxhYmVsIiwibGVuZ3RoIiwicHVzaCIsIl9zdHlsZUluZGV4IiwibGFiZWxTaXplIiwiZ2V0Q29udGVudFNpemUiLCJldmVudCIsImNvbXBvbmVudHMiLCJnZXRDb21wb25lbnRzIiwiaSIsImxhYmVsU2VnbWVudCIsImNsaWNrSGFuZGxlciIsIl9jbGlja0hhbmRsZXIiLCJjbGlja1BhcmFtIiwiX2NsaWNrUGFyYW0iLCJfY29udGFpbnNUb3VjaExvY2F0aW9uIiwidG91Y2giLCJnZXRMb2NhdGlvbiIsImNvbXBvbmVudCIsInN0b3BQcm9wYWdhdGlvbiIsInBvaW50IiwibXlSZWN0IiwiZ2V0Qm91bmRpbmdCb3hUb1dvcmxkIiwiY29udGFpbnMiLCJfcmVzZXRTdGF0ZSIsImNoaWxkIiwicGFyZW50Iiwic3BsaWNlIiwicHV0IiwiX2xpbmVPZmZzZXRYIiwiX2xpbmVDb3VudCIsIl9sYWJlbFdpZHRoIiwiX2xhYmVsSGVpZ2h0Iiwib25SZXN0b3JlIiwiYWN0aXZlIiwiX2FkZExhYmVsU2VnbWVudCIsInN0cmluZ1Rva2VuIiwicG9wIiwiYWRkQ2hpbGQiLCJfdXBkYXRlUmljaFRleHRXaXRoTWF4V2lkdGgiLCJsYWJlbFN0cmluZyIsImxhYmVsV2lkdGgiLCJmcmFnbWVudFdpZHRoIiwiY2hlY2tTdGFydEluZGV4IiwiY2hlY2tFbmRJbmRleCIsIl9nZXRGaXJzdFdvcmRMZW4iLCJjaGVja1N0cmluZyIsInN1YnN0ciIsImNoZWNrU3RyaW5nV2lkdGgiLCJyZW1haW5pbmdTdHJpbmciLCJfdXBkYXRlTGluZUluZm8iLCJmcmFnbWVudHMiLCJmcmFnbWVudFRleHQiLCJrIiwic3BsaXRTdHJpbmciLCJfaXNMYXN0Q29tcG9uZW50Q1IiLCJsYXN0SW5kZXhPZiIsIl9uZWVkc1VwZGF0ZVRleHRMYXlvdXQiLCJuZXdUZXh0QXJyYXkiLCJvbGRJdGVtIiwibmV3SXRlbSIsInRleHQiLCJzdHlsZSIsInNpemUiLCJpdGFsaWMiLCJpc0ltYWdlIiwic3JjIiwiX2FkZFJpY2hUZXh0SW1hZ2VFbGVtZW50IiwicmljaFRleHRFbGVtZW50Iiwic3ByaXRlRnJhbWVOYW1lIiwic3ByaXRlRnJhbWUiLCJnZXRTcHJpdGVGcmFtZSIsInNwcml0ZU5vZGUiLCJzcHJpdGVDb21wb25lbnQiLCJTcHJpdGUiLCJpbWFnZUFsaWduIiwiaW1hZ2VPZmZzZXQiLCJfaW1hZ2VPZmZzZXQiLCJUeXBlIiwiU0xJQ0VEIiwic2l6ZU1vZGUiLCJTaXplTW9kZSIsIkNVU1RPTSIsInNwcml0ZVJlY3QiLCJnZXRSZWN0Iiwic2NhbGVGYWN0b3IiLCJzcHJpdGVXaWR0aCIsInNwcml0ZUhlaWdodCIsImhlaWdodCIsImV4cGVjdFdpZHRoIiwiaW1hZ2VXaWR0aCIsImV4cGVjdEhlaWdodCIsImltYWdlSGVpZ2h0Iiwic2V0Q29udGVudFNpemUiLCJjbGljayIsInBhcmFtIiwid2FybklEIiwicGFyc2UiLCJsYXN0RW1wdHlMaW5lIiwibmV3bGluZSIsIm11bHRpbGluZVRleHRzIiwic3BsaXQiLCJqIiwiQkFTRUxJTkVfUkFUSU8iLCJfdXBkYXRlUmljaFRleHRQb3NpdGlvbiIsInN0YXJ0SW5kZXgiLCJ0ZXh0TGVuIiwiY2hhcmFjdGVyIiwiY2hhckF0IiwiaXNVbmljb2RlQ0pLIiwiaXNVbmljb2RlU3BhY2UiLCJsZW4iLCJpbmRleCIsIm5leHRUb2tlblgiLCJuZXh0TGluZUluZGV4IiwidG90YWxMaW5lQ291bnQiLCJsaW5lQ291bnQiLCJsaW5lT2Zmc2V0WCIsIlJJR0hUIiwieCIsInkiLCJzcHJpdGUiLCJsaW5lSGVpZ2h0U2V0IiwibGluZUhlaWdodFJlYWwiLCJhbmNob3JZIiwib2Zmc2V0cyIsIm9mZnNldFkiLCJwYXJzZUZsb2F0IiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwib2Zmc2V0WCIsIl9jb252ZXJ0TGl0ZXJhbENvbG9yVmFsdWUiLCJjb2xvclZhbHVlIiwidG9VcHBlckNhc2UiLCJDb2xvciIsIm91dCIsImZyb21IRVgiLCJmb3JjZSIsInRleHRTdHlsZSIsImlzQXNzZXQiLCJGb250IiwiZW5hYmxlQm9sZCIsImJvbGQiLCJlbmFibGVJdGFsaWNzIiwiZW5hYmxlVW5kZXJsaW5lIiwidW5kZXJsaW5lIiwibGFiZWxPdXRsaW5lQ29tcG9uZW50IiwiX2ZvcmNlVXBkYXRlUmVuZGVyRGF0YSIsIm9uRGVzdHJveSIsInJlbW92ZUZyb21QYXJl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RixLQUF4QztBQUNILE9BRkQsTUFHSztBQUNEdkwsUUFBQUEsU0FBUyxDQUFDc0csV0FBVixHQUF3QixFQUF4QjtBQUNIO0FBQ0osS0FWRCxNQVdLO0FBQ0R0RyxNQUFBQSxTQUFTLENBQUNvRyxhQUFWLEdBQTBCLElBQTFCO0FBQ0g7QUFDSixHQS8zQm1CO0FBaTRCcEJ3SSxFQUFBQSxTQWo0Qm9CLHVCQWk0QlA7QUFDVCxTQUFLLElBQUkzSSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUsvRSxjQUFMLENBQW9CdUUsTUFBeEMsRUFBZ0QsRUFBRVEsQ0FBbEQsRUFBcUQ7QUFDakQsV0FBSy9FLGNBQUwsQ0FBb0IrRSxDQUFwQixFQUF1QjRJLGdCQUF2Qjs7QUFDQTdQLE1BQUFBLElBQUksQ0FBQ29JLEdBQUwsQ0FBUyxLQUFLbEcsY0FBTCxDQUFvQitFLENBQXBCLENBQVQ7QUFDSDtBQUNKO0FBdDRCbUIsQ0FBVCxDQUFmO0FBeTRCQS9ILEVBQUUsQ0FBQzBDLFFBQUgsR0FBY2tPLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQm5PLFFBQS9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBqcyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2pzJyk7XG5jb25zdCBtYWNybyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL0NDTWFjcm8nKTtcbmNvbnN0IHRleHRVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL3RleHQtdXRpbHMnKTtcbmNvbnN0IEh0bWxUZXh0UGFyc2VyID0gcmVxdWlyZSgnLi4vdXRpbHMvaHRtbC10ZXh0LXBhcnNlcicpO1xuY29uc3QgX2h0bWxUZXh0UGFyc2VyID0gbmV3IEh0bWxUZXh0UGFyc2VyKCk7XG5cbmNvbnN0IEhvcml6b250YWxBbGlnbiA9IG1hY3JvLlRleHRBbGlnbm1lbnQ7XG5jb25zdCBWZXJ0aWNhbEFsaWduID0gbWFjcm8uVmVydGljYWxUZXh0QWxpZ25tZW50O1xuY29uc3QgUmljaFRleHRDaGlsZE5hbWUgPSBcIlJJQ0hURVhUX0NISUxEXCI7XG5jb25zdCBSaWNoVGV4dENoaWxkSW1hZ2VOYW1lID0gXCJSSUNIVEVYVF9JbWFnZV9DSElMRFwiO1xuY29uc3QgQ2FjaGVNb2RlID0gY2MuTGFiZWwuQ2FjaGVNb2RlO1xuXG4vLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4vLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4vLyBOIG1pbGxpc2Vjb25kcy4gSWYgYGltbWVkaWF0ZWAgaXMgcGFzc2VkLCB0cmlnZ2VyIHRoZSBmdW5jdGlvbiBvbiB0aGVcbi8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICBsZXQgdGltZW91dDtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGxldCBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgICAgbGV0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8qKlxuICogUmljaFRleHQgcG9vbFxuICovXG5sZXQgcG9vbCA9IG5ldyBqcy5Qb29sKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICBjYy5pc1ZhbGlkKG5vZGUpICYmIG5vZGUuZGVzdHJveSgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgY2MuYXNzZXJ0KCFub2RlLl9wYXJlbnQsICdSZWN5Y2xpbmcgbm9kZVxcJ3MgcGFyZW50IHNob3VsZCBiZSBudWxsIScpO1xuICAgIH1cbiAgICBpZiAoIWNjLmlzVmFsaWQobm9kZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBvdXRsaW5lID0gbm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWxPdXRsaW5lKTtcbiAgICAgICAgaWYgKG91dGxpbmUpIHtcbiAgICAgICAgICAgIG91dGxpbmUud2lkdGggPSAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59LCAyMCk7XG5cbnBvb2wuZ2V0ID0gZnVuY3Rpb24gKHN0cmluZywgcmljaHRleHQpIHtcbiAgICBsZXQgbGFiZWxOb2RlID0gdGhpcy5fZ2V0KCk7XG4gICAgaWYgKCFsYWJlbE5vZGUpIHtcbiAgICAgICAgbGFiZWxOb2RlID0gbmV3IGNjLlByaXZhdGVOb2RlKFJpY2hUZXh0Q2hpbGROYW1lKTtcbiAgICB9XG5cbiAgICBsYWJlbE5vZGUuc2V0UG9zaXRpb24oMCwgMCk7XG4gICAgbGFiZWxOb2RlLnNldEFuY2hvclBvaW50KDAuNSwgMC41KTtcbiAgICBsYWJlbE5vZGUuc2tld1ggPSAwO1xuXG4gICAgbGV0IGxhYmVsQ29tcG9uZW50ID0gbGFiZWxOb2RlLmdldENvbXBvbmVudChjYy5MYWJlbCk7XG4gICAgaWYgKCFsYWJlbENvbXBvbmVudCkge1xuICAgICAgICBsYWJlbENvbXBvbmVudCA9IGxhYmVsTm9kZS5hZGRDb21wb25lbnQoY2MuTGFiZWwpO1xuICAgIH1cblxuICAgIGxhYmVsQ29tcG9uZW50LnN0cmluZyA9IFwiXCI7XG4gICAgbGFiZWxDb21wb25lbnQuaG9yaXpvbnRhbEFsaWduID0gSG9yaXpvbnRhbEFsaWduLkxFRlQ7XG4gICAgbGFiZWxDb21wb25lbnQudmVydGljYWxBbGlnbiA9IFZlcnRpY2FsQWxpZ24uQ0VOVEVSO1xuXG4gICAgcmV0dXJuIGxhYmVsTm9kZTtcbn07XG5cbi8qKlxuICogISNlbiBUaGUgUmljaFRleHQgQ29tcG9uZW50LlxuICogISN6aCDlr4zmlofmnKznu4Tku7ZcbiAqIEBjbGFzcyBSaWNoVGV4dFxuICogQGV4dGVuZHMgQ29tcG9uZW50XG4gKi9cbmxldCBSaWNoVGV4dCA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuUmljaFRleHQnLFxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIGN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fdGV4dEFycmF5ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fbGFiZWxTZWdtZW50cyA9IFtdO1xuICAgICAgICB0aGlzLl9sYWJlbFNlZ21lbnRzQ2FjaGUgPSBbXTtcbiAgICAgICAgdGhpcy5fbGluZXNXaWR0aCA9IFtdO1xuXG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX3VzZXJEZWZpbmVkRm9udCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVSaWNoVGV4dFN0YXR1cyA9IGRlYm91bmNlKHRoaXMuX3VwZGF0ZVJpY2hUZXh0LCAyMDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMgPSB0aGlzLl91cGRhdGVSaWNoVGV4dDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucmVuZGVyZXJzL1JpY2hUZXh0JyxcbiAgICAgICAgaGVscDogJ2kxOG46Q09NUE9ORU5ULmhlbHBfdXJsLnJpY2h0ZXh0JyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9yaWNodGV4dC5qcycsXG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlXG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQ29udGVudCBzdHJpbmcgb2YgUmljaFRleHQuXG4gICAgICAgICAqICEjemgg5a+M5paH5pys5pi+56S655qE5paH5pys5YaF5a6544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBzdHJpbmdcbiAgICAgICAgICovXG4gICAgICAgIHN0cmluZzoge1xuICAgICAgICAgICAgZGVmYXVsdDogJzxjb2xvcj0jMDBmZjAwPlJpY2g8L2M+PGNvbG9yPSMwZmZmZmY+VGV4dDwvY29sb3I+JyxcbiAgICAgICAgICAgIG11bHRpbGluZTogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQuc3RyaW5nJyxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSG9yaXpvbnRhbCBBbGlnbm1lbnQgb2YgZWFjaCBsaW5lIGluIFJpY2hUZXh0LlxuICAgICAgICAgKiAhI3poIOaWh+acrOWGheWuueeahOawtOW5s+Wvuem9kOaWueW8j+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge21hY3JvLlRleHRBbGlnbm1lbnR9IGhvcml6b250YWxBbGlnblxuICAgICAgICAgKi9cbiAgICAgICAgaG9yaXpvbnRhbEFsaWduOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBIb3Jpem9udGFsQWxpZ24uTEVGVCxcbiAgICAgICAgICAgIHR5cGU6IEhvcml6b250YWxBbGlnbixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQuaG9yaXpvbnRhbF9hbGlnbicsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbEFsaWduID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gRm9udCBzaXplIG9mIFJpY2hUZXh0LlxuICAgICAgICAgKiAhI3poIOWvjOaWh+acrOWtl+S9k+Wkp+Wwj+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZm9udFNpemVcbiAgICAgICAgICovXG4gICAgICAgIGZvbnRTaXplOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiA0MCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQuZm9udF9zaXplJyxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9udFNpemUgPT09IG9sZFZhbHVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBDdXN0b20gU3lzdGVtIGZvbnQgb2YgUmljaFRleHRcbiAgICAgICAgICogISN6aCDlr4zmlofmnKzlrprliLbns7vnu5/lrZfkvZNcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGZvbnRGYW1pbHlcbiAgICAgICAgICovXG4gICAgICAgIF9mb250RmFtaWx5OiBcIkFyaWFsXCIsXG4gICAgICAgIGZvbnRGYW1pbHk6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQuZm9udF9mYW1pbHknLFxuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZm9udEZhbWlseTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ZvbnRGYW1pbHkgPT09IHZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICAgICAgdGhpcy5fZm9udEZhbWlseSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xheW91dERpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVSaWNoVGV4dFN0YXR1cygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQ3VzdG9tIFRURiBmb250IG9mIFJpY2hUZXh0XG4gICAgICAgICAqICEjemggIOWvjOaWh+acrOWumuWItuWtl+S9k1xuICAgICAgICAgKiBAcHJvcGVydHkge2NjLlRURkZvbnR9IGZvbnRcbiAgICAgICAgICovXG4gICAgICAgIGZvbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5UVEZGb250LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5yaWNodGV4dC5mb250JyxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZm9udCA9PT0gb2xkVmFsdWUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2xheW91dERpcnR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mb250KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3VzZXJEZWZpbmVkRm9udCA9IHRoaXMuZm9udDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZVN5c3RlbUZvbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25UVEZMb2FkZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXNlU3lzdGVtRm9udCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gV2hldGhlciB1c2Ugc3lzdGVtIGZvbnQgbmFtZSBvciBub3QuXG4gICAgICAgICAqICEjemgg5piv5ZCm5L2/55So57O757uf5a2X5L2T44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gdXNlU3lzdGVtRm9udFxuICAgICAgICAgKi9cbiAgICAgICAgX2lzU3lzdGVtRm9udFVzZWQ6IHRydWUsXG4gICAgICAgIHVzZVN5c3RlbUZvbnQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzU3lzdGVtRm9udFVzZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pc1N5c3RlbUZvbnRVc2VkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2lzU3lzdGVtRm9udFVzZWQgPSB2YWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZvbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3VzZXJEZWZpbmVkRm9udCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mb250ID0gdGhpcy5fdXNlckRlZmluZWRGb250O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnJpY2h0ZXh0LnN5c3RlbV9mb250JyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgY2FjaGUgbW9kZSBvZiBsYWJlbC4gVGhpcyBtb2RlIG9ubHkgc3VwcG9ydHMgc3lzdGVtIGZvbnRzLlxuICAgICAgICAgKiAhI3poIOaWh+acrOe8k+WtmOaooeW8jywg6K+l5qih5byP5Y+q5pSv5oyB57O757uf5a2X5L2T44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TGFiZWwuQ2FjaGVNb2RlfSBjYWNoZU1vZGVcbiAgICAgICAgICovXG4gICAgICAgIGNhY2hlTW9kZToge1xuICAgICAgICAgICAgZGVmYXVsdDogQ2FjaGVNb2RlLk5PTkUsXG4gICAgICAgICAgICB0eXBlOiBDYWNoZU1vZGUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmxhYmVsLmNhY2hlTW9kZScsXG4gICAgICAgICAgICBub3RpZnkgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FjaGVNb2RlID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBtYXhpbWl6ZSB3aWR0aCBvZiB0aGUgUmljaFRleHRcbiAgICAgICAgICogISN6aCDlr4zmlofmnKznmoTmnIDlpKflrr3luqZcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG1heFdpZHRoXG4gICAgICAgICAqL1xuICAgICAgICBtYXhXaWR0aDoge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQubWF4X3dpZHRoJyxcbiAgICAgICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4V2lkdGggPT09IG9sZFZhbHVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBMaW5lIEhlaWdodCBvZiBSaWNoVGV4dC5cbiAgICAgICAgICogISN6aCDlr4zmlofmnKzooYzpq5jjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxpbmVIZWlnaHRcbiAgICAgICAgICovXG4gICAgICAgIGxpbmVIZWlnaHQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDQwLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5yaWNodGV4dC5saW5lX2hlaWdodCcsXG4gICAgICAgICAgICBub3RpZnk6IGZ1bmN0aW9uIChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbmVIZWlnaHQgPT09IG9sZFZhbHVlKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRTdGF0dXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgaW1hZ2UgYXRsYXMgZm9yIHRoZSBpbWcgdGFnLiBGb3IgZWFjaCBzcmMgdmFsdWUgaW4gdGhlIGltZyB0YWcsIHRoZXJlIHNob3VsZCBiZSBhIHZhbGlkIHNwcml0ZUZyYW1lIGluIHRoZSBpbWFnZSBhdGxhcy5cbiAgICAgICAgICogISN6aCDlr7nkuo4gaW1nIOagh+etvumHjOmdoueahCBzcmMg5bGe5oCn5ZCN56ew77yM6YO96ZyA6KaB5ZyoIGltYWdlQXRsYXMg6YeM6Z2i5om+5Yiw5LiA5Liq5pyJ5pWI55qEIHNwcml0ZUZyYW1l77yM5ZCm5YiZIGltZyB0YWcg5Lya5Yik5a6a5Li65peg5pWI44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3ByaXRlQXRsYXN9IGltYWdlQXRsYXNcbiAgICAgICAgICovXG4gICAgICAgIGltYWdlQXRsYXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhcyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQucmljaHRleHQuaW1hZ2VfYXRsYXMnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbiAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbWFnZUF0bGFzID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0U3RhdHVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogT25jZSBjaGVja2VkLCB0aGUgUmljaFRleHQgd2lsbCBibG9jayBhbGwgaW5wdXQgZXZlbnRzIChtb3VzZSBhbmQgdG91Y2gpIHdpdGhpblxuICAgICAgICAgKiB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBub2RlLCBwcmV2ZW50aW5nIHRoZSBpbnB1dCBmcm9tIHBlbmV0cmF0aW5nIGludG8gdGhlIHVuZGVybHlpbmcgbm9kZS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDpgInkuK3mraTpgInpobnlkI7vvIxSaWNoVGV4dCDlsIbpmLvmraLoioLngrnovrnnlYzmoYbkuK3nmoTmiYDmnInovpPlhaXkuovku7bvvIjpvKDmoIflkozop6bmkbjvvInvvIzku47ogIzpmLLmraLovpPlhaXkuovku7bnqb/pgI/liLDlupXlsYLoioLngrnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBoYW5kbGVUb3VjaEV2ZW50XG4gICAgICAgICAqIEBkZWZhdWx0IHRydWVcbiAgICAgICAgICovXG4gICAgICAgIGhhbmRsZVRvdWNoRXZlbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnJpY2h0ZXh0LmhhbmRsZVRvdWNoRXZlbnQnLFxuICAgICAgICAgICAgbm90aWZ5OiBmdW5jdGlvbiAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYW5kbGVUb3VjaEV2ZW50ID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVRvdWNoRXZlbnQgPyB0aGlzLl9hZGRFdmVudExpc3RlbmVycygpIDogdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBIb3Jpem9udGFsQWxpZ246IEhvcml6b250YWxBbGlnbixcbiAgICAgICAgVmVydGljYWxBbGlnbjogVmVydGljYWxBbGlnblxuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZVRvdWNoRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHQoKTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVDaGlsZHJlbih0cnVlKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFuZGxlVG91Y2hFdmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hY3RpdmF0ZUNoaWxkcmVuKGZhbHNlKTtcbiAgICB9LFxuXG4gICAgc3RhcnQgKCkge1xuICAgICAgICB0aGlzLl9vblRURkxvYWRlZCgpO1xuICAgIH0sXG5cbiAgICBfb25Db2xvckNoYW5nZWQgKHBhcmVudENvbG9yKSB7XG4gICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcbiAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGROb2RlKSB7XG4gICAgICAgICAgICBjaGlsZE5vZGUuY29sb3IgPSBwYXJlbnRDb2xvcjtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIF9hZGRFdmVudExpc3RlbmVycyAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5DT0xPUl9DSEFOR0VELCB0aGlzLl9vbkNvbG9yQ2hhbmdlZCwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9yZW1vdmVFdmVudExpc3RlbmVycyAoKSB7XG4gICAgICAgIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLkNPTE9SX0NIQU5HRUQsIHRoaXMuX29uQ29sb3JDaGFuZ2VkLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUxhYmVsU2VnbWVudFRleHRBdHRyaWJ1dGVzICgpIHtcbiAgICAgICAgdGhpcy5fbGFiZWxTZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICB0aGlzLl9hcHBseVRleHRBdHRyaWJ1dGUoaXRlbSwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIF9jcmVhdGVGb250TGFiZWwgKHN0cmluZykge1xuICAgICAgICByZXR1cm4gcG9vbC5nZXQoc3RyaW5nLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgX29uVFRGTG9hZGVkICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9udCBpbnN0YW5jZW9mIGNjLlRURkZvbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZvbnQuX25hdGl2ZUFzc2V0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJpY2hUZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY2MubG9hZGVyLmxvYWQodGhpcy5mb250Lm5hdGl2ZVVybCwgZnVuY3Rpb24gKGVyciwgZm9udEZhbWlseSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9sYXlvdXREaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3VwZGF0ZVJpY2hUZXh0KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVSaWNoVGV4dCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9tZWFzdXJlVGV4dCAoc3R5bGVJbmRleCwgc3RyaW5nKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGZ1bmMgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICBsZXQgbGFiZWw7XG4gICAgICAgICAgICBpZiAoc2VsZi5fbGFiZWxTZWdtZW50c0NhY2hlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGxhYmVsID0gc2VsZi5fY3JlYXRlRm9udExhYmVsKHN0cmluZyk7XG4gICAgICAgICAgICAgICAgc2VsZi5fbGFiZWxTZWdtZW50c0NhY2hlLnB1c2gobGFiZWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsYWJlbCA9IHNlbGYuX2xhYmVsU2VnbWVudHNDYWNoZVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhYmVsLl9zdHlsZUluZGV4ID0gc3R5bGVJbmRleDtcbiAgICAgICAgICAgIHNlbGYuX2FwcGx5VGV4dEF0dHJpYnV0ZShsYWJlbCwgc3RyaW5nLCB0cnVlKTtcbiAgICAgICAgICAgIGxldCBsYWJlbFNpemUgPSBsYWJlbC5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGxhYmVsU2l6ZS53aWR0aDtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmMoc3RyaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vblRvdWNoRW5kZWQgKGV2ZW50KSB7XG4gICAgICAgIGxldCBjb21wb25lbnRzID0gdGhpcy5ub2RlLmdldENvbXBvbmVudHMoY2MuQ29tcG9uZW50KTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xhYmVsU2VnbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBsYWJlbFNlZ21lbnQgPSB0aGlzLl9sYWJlbFNlZ21lbnRzW2ldO1xuICAgICAgICAgICAgbGV0IGNsaWNrSGFuZGxlciA9IGxhYmVsU2VnbWVudC5fY2xpY2tIYW5kbGVyO1xuICAgICAgICAgICAgbGV0IGNsaWNrUGFyYW0gPSBsYWJlbFNlZ21lbnQuX2NsaWNrUGFyYW07XG4gICAgICAgICAgICBpZiAoY2xpY2tIYW5kbGVyICYmIHRoaXMuX2NvbnRhaW5zVG91Y2hMb2NhdGlvbihsYWJlbFNlZ21lbnQsIGV2ZW50LnRvdWNoLmdldExvY2F0aW9uKCkpKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5lbmFibGVkSW5IaWVyYXJjaHkgJiYgY29tcG9uZW50W2NsaWNrSGFuZGxlcl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFtjbGlja0hhbmRsZXJdKGV2ZW50LCBjbGlja1BhcmFtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jb250YWluc1RvdWNoTG9jYXRpb24gKGxhYmVsLCBwb2ludCkge1xuICAgICAgICBsZXQgbXlSZWN0ID0gbGFiZWwuZ2V0Qm91bmRpbmdCb3hUb1dvcmxkKCk7XG4gICAgICAgIHJldHVybiBteVJlY3QuY29udGFpbnMocG9pbnQpO1xuICAgIH0sXG5cbiAgICBfcmVzZXRTdGF0ZSAoKSB7XG4gICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcbiAgICAgICAgZm9yIChsZXQgaSA9IGNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZC5uYW1lID09PSBSaWNoVGV4dENoaWxkTmFtZSB8fCBjaGlsZC5uYW1lID09PSBSaWNoVGV4dENoaWxkSW1hZ2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLnBhcmVudCA9PT0gdGhpcy5ub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnBhcmVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbiBjYXNlIGNoaWxkLnBhcmVudCAhPT0gdGhpcy5ub2RlLCBjaGlsZCBjYW5ub3QgYmUgcmVtb3ZlZCBmcm9tIGNoaWxkcmVuXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkLm5hbWUgPT09IFJpY2hUZXh0Q2hpbGROYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvb2wucHV0KGNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sYWJlbFNlZ21lbnRzLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX2xhYmVsU2VnbWVudHNDYWNoZS5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9saW5lc1dpZHRoLmxlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMuX2xpbmVPZmZzZXRYID0gMDtcbiAgICAgICAgdGhpcy5fbGluZUNvdW50ID0gMTtcbiAgICAgICAgdGhpcy5fbGFiZWxXaWR0aCA9IDA7XG4gICAgICAgIHRoaXMuX2xhYmVsSGVpZ2h0ID0gMDtcbiAgICAgICAgdGhpcy5fbGF5b3V0RGlydHkgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBvblJlc3RvcmU6IENDX0VESVRPUiAmJiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IHJlZmluZSB1bmRvL3JlZG8gc3lzdGVtXG4gICAgICAgIC8vIEJlY2F1c2UgdW5kby9yZWRvIHdpbGwgbm90IGNhbGwgb25FbmFibGUvb25EaXNhYmxlLFxuICAgICAgICAvLyB3ZSBuZWVkIGNhbGwgb25FbmFibGUvb25EaXNhYmxlIG1hbnVhbGx5IHRvIGFjdGl2ZS9kaXNhY3RpdmUgY2hpbGRyZW4gbm9kZXMuXG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgdGhpcy5vbkVuYWJsZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbkRpc2FibGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfYWN0aXZhdGVDaGlsZHJlbiAoYWN0aXZlKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IHRoaXMubm9kZS5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmIChjaGlsZC5uYW1lID09PSBSaWNoVGV4dENoaWxkTmFtZSB8fCBjaGlsZC5uYW1lID09PSBSaWNoVGV4dENoaWxkSW1hZ2VOYW1lKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQuYWN0aXZlID0gYWN0aXZlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9hZGRMYWJlbFNlZ21lbnQgKHN0cmluZ1Rva2VuLCBzdHlsZUluZGV4KSB7XG4gICAgICAgIGxldCBsYWJlbFNlZ21lbnQ7XG4gICAgICAgIGlmICh0aGlzLl9sYWJlbFNlZ21lbnRzQ2FjaGUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBsYWJlbFNlZ21lbnQgPSB0aGlzLl9jcmVhdGVGb250TGFiZWwoc3RyaW5nVG9rZW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGFiZWxTZWdtZW50ID0gdGhpcy5fbGFiZWxTZWdtZW50c0NhY2hlLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGxhYmVsU2VnbWVudC5fc3R5bGVJbmRleCA9IHN0eWxlSW5kZXg7XG4gICAgICAgIGxhYmVsU2VnbWVudC5fbGluZUNvdW50ID0gdGhpcy5fbGluZUNvdW50O1xuICAgICAgICBsYWJlbFNlZ21lbnQuYWN0aXZlID0gdGhpcy5ub2RlLmFjdGl2ZTtcblxuICAgICAgICBsYWJlbFNlZ21lbnQuc2V0QW5jaG9yUG9pbnQoMCwgMCk7XG4gICAgICAgIHRoaXMuX2FwcGx5VGV4dEF0dHJpYnV0ZShsYWJlbFNlZ21lbnQsIHN0cmluZ1Rva2VuKTtcblxuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQobGFiZWxTZWdtZW50KTtcbiAgICAgICAgdGhpcy5fbGFiZWxTZWdtZW50cy5wdXNoKGxhYmVsU2VnbWVudCk7XG5cbiAgICAgICAgcmV0dXJuIGxhYmVsU2VnbWVudDtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVJpY2hUZXh0V2l0aE1heFdpZHRoIChsYWJlbFN0cmluZywgbGFiZWxXaWR0aCwgc3R5bGVJbmRleCkge1xuICAgICAgICBsZXQgZnJhZ21lbnRXaWR0aCA9IGxhYmVsV2lkdGg7XG4gICAgICAgIGxldCBsYWJlbFNlZ21lbnQ7XG5cbiAgICAgICAgaWYgKHRoaXMuX2xpbmVPZmZzZXRYID4gMCAmJiBmcmFnbWVudFdpZHRoICsgdGhpcy5fbGluZU9mZnNldFggPiB0aGlzLm1heFdpZHRoKSB7XG4gICAgICAgICAgICAvL2NvbmNhdCBwcmV2aW91cyBsaW5lXG4gICAgICAgICAgICBsZXQgY2hlY2tTdGFydEluZGV4ID0gMDtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLl9saW5lT2Zmc2V0WCA8PSB0aGlzLm1heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNoZWNrRW5kSW5kZXggPSB0aGlzLl9nZXRGaXJzdFdvcmRMZW4obGFiZWxTdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrU3RhcnRJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBsZXQgY2hlY2tTdHJpbmcgPSBsYWJlbFN0cmluZy5zdWJzdHIoY2hlY2tTdGFydEluZGV4LCBjaGVja0VuZEluZGV4KTtcbiAgICAgICAgICAgICAgICBsZXQgY2hlY2tTdHJpbmdXaWR0aCA9IHRoaXMuX21lYXN1cmVUZXh0KHN0eWxlSW5kZXgsIGNoZWNrU3RyaW5nKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saW5lT2Zmc2V0WCArIGNoZWNrU3RyaW5nV2lkdGggPD0gdGhpcy5tYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5lT2Zmc2V0WCArPSBjaGVja1N0cmluZ1dpZHRoO1xuICAgICAgICAgICAgICAgICAgICBjaGVja1N0YXJ0SW5kZXggKz0gY2hlY2tFbmRJbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrU3RhcnRJbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZW1haW5pbmdTdHJpbmcgPSBsYWJlbFN0cmluZy5zdWJzdHIoMCwgY2hlY2tTdGFydEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2FkZExhYmVsU2VnbWVudChyZW1haW5pbmdTdHJpbmcsIHN0eWxlSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxTdHJpbmcgPSBsYWJlbFN0cmluZy5zdWJzdHIoY2hlY2tTdGFydEluZGV4LCBsYWJlbFN0cmluZy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnRXaWR0aCA9IHRoaXMuX21lYXN1cmVUZXh0KHN0eWxlSW5kZXgsIGxhYmVsU3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaW5lSW5mbygpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZyYWdtZW50V2lkdGggPiB0aGlzLm1heFdpZHRoKSB7XG4gICAgICAgICAgICBsZXQgZnJhZ21lbnRzID0gdGV4dFV0aWxzLmZyYWdtZW50VGV4dChsYWJlbFN0cmluZyxcbiAgICAgICAgICAgICAgICBmcmFnbWVudFdpZHRoLFxuICAgICAgICAgICAgICAgIHRoaXMubWF4V2lkdGgsXG4gICAgICAgICAgICAgICAgdGhpcy5fbWVhc3VyZVRleHQoc3R5bGVJbmRleCkpO1xuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBmcmFnbWVudHMubGVuZ3RoOyArK2spIHtcbiAgICAgICAgICAgICAgICBsZXQgc3BsaXRTdHJpbmcgPSBmcmFnbWVudHNba107XG4gICAgICAgICAgICAgICAgbGFiZWxTZWdtZW50ID0gdGhpcy5fYWRkTGFiZWxTZWdtZW50KHNwbGl0U3RyaW5nLCBzdHlsZUluZGV4KTtcbiAgICAgICAgICAgICAgICBsZXQgbGFiZWxTaXplID0gbGFiZWxTZWdtZW50LmdldENvbnRlbnRTaXplKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZU9mZnNldFggKz0gbGFiZWxTaXplLndpZHRoO1xuICAgICAgICAgICAgICAgIGlmIChmcmFnbWVudHMubGVuZ3RoID4gMSAmJiBrIDwgZnJhZ21lbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGluZUluZm8oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9saW5lT2Zmc2V0WCArPSBmcmFnbWVudFdpZHRoO1xuICAgICAgICAgICAgdGhpcy5fYWRkTGFiZWxTZWdtZW50KGxhYmVsU3RyaW5nLCBzdHlsZUluZGV4KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaXNMYXN0Q29tcG9uZW50Q1IgKHN0cmluZ1Rva2VuKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdUb2tlbi5sZW5ndGggLSAxID09PSBzdHJpbmdUb2tlbi5sYXN0SW5kZXhPZihcIlxcblwiKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUxpbmVJbmZvICgpIHtcbiAgICAgICAgdGhpcy5fbGluZXNXaWR0aC5wdXNoKHRoaXMuX2xpbmVPZmZzZXRYKTtcbiAgICAgICAgdGhpcy5fbGluZU9mZnNldFggPSAwO1xuICAgICAgICB0aGlzLl9saW5lQ291bnQrKztcbiAgICB9LFxuXG4gICAgX25lZWRzVXBkYXRlVGV4dExheW91dCAobmV3VGV4dEFycmF5KSB7XG4gICAgICAgIGlmICh0aGlzLl9sYXlvdXREaXJ0eSB8fCAhdGhpcy5fdGV4dEFycmF5IHx8ICFuZXdUZXh0QXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3RleHRBcnJheS5sZW5ndGggIT09IG5ld1RleHRBcnJheS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl90ZXh0QXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBvbGRJdGVtID0gdGhpcy5fdGV4dEFycmF5W2ldO1xuICAgICAgICAgICAgbGV0IG5ld0l0ZW0gPSBuZXdUZXh0QXJyYXlbaV07XG4gICAgICAgICAgICBpZiAob2xkSXRlbS50ZXh0ICE9PSBuZXdJdGVtLnRleHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvbGRJdGVtLnN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdJdGVtLnN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISFuZXdJdGVtLnN0eWxlLm91dGxpbmUgIT09ICEhb2xkSXRlbS5zdHlsZS5vdXRsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2xkSXRlbS5zdHlsZS5zaXplICE9PSBuZXdJdGVtLnN0eWxlLnNpemVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBvbGRJdGVtLnN0eWxlLml0YWxpYyAhPT0gbmV3SXRlbS5zdHlsZS5pdGFsaWNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBvbGRJdGVtLnN0eWxlLmlzSW1hZ2UgIT09IG5ld0l0ZW0uc3R5bGUuaXNJbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9sZEl0ZW0uc3R5bGUuaXNJbWFnZSA9PT0gbmV3SXRlbS5zdHlsZS5pc0ltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9sZEl0ZW0uc3R5bGUuc3JjICE9PSBuZXdJdGVtLnN0eWxlLnNyYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob2xkSXRlbS5zdHlsZS5zaXplIHx8IG9sZEl0ZW0uc3R5bGUuaXRhbGljIHx8IG9sZEl0ZW0uc3R5bGUuaXNJbWFnZSB8fCBvbGRJdGVtLnN0eWxlLm91dGxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0l0ZW0uc3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXdJdGVtLnN0eWxlLnNpemUgfHwgbmV3SXRlbS5zdHlsZS5pdGFsaWMgfHwgbmV3SXRlbS5zdHlsZS5pc0ltYWdlIHx8IG5ld0l0ZW0uc3R5bGUub3V0bGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgX2FkZFJpY2hUZXh0SW1hZ2VFbGVtZW50IChyaWNoVGV4dEVsZW1lbnQpIHtcbiAgICAgICAgbGV0IHNwcml0ZUZyYW1lTmFtZSA9IHJpY2hUZXh0RWxlbWVudC5zdHlsZS5zcmM7XG4gICAgICAgIGxldCBzcHJpdGVGcmFtZSA9IHRoaXMuaW1hZ2VBdGxhcy5nZXRTcHJpdGVGcmFtZShzcHJpdGVGcmFtZU5hbWUpO1xuICAgICAgICBpZiAoc3ByaXRlRnJhbWUpIHtcbiAgICAgICAgICAgIGxldCBzcHJpdGVOb2RlID0gbmV3IGNjLlByaXZhdGVOb2RlKFJpY2hUZXh0Q2hpbGRJbWFnZU5hbWUpO1xuICAgICAgICAgICAgbGV0IHNwcml0ZUNvbXBvbmVudCA9IHNwcml0ZU5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgICAgICBzd2l0Y2ggKHJpY2hUZXh0RWxlbWVudC5zdHlsZS5pbWFnZUFsaWduKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZU5vZGUuc2V0QW5jaG9yUG9pbnQoMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZU5vZGUuc2V0QW5jaG9yUG9pbnQoMCwgMC41KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlTm9kZS5zZXRBbmNob3JQb2ludCgwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmljaFRleHRFbGVtZW50LnN0eWxlLmltYWdlT2Zmc2V0KSBzcHJpdGVOb2RlLl9pbWFnZU9mZnNldCA9IHJpY2hUZXh0RWxlbWVudC5zdHlsZS5pbWFnZU9mZnNldDtcbiAgICAgICAgICAgIHNwcml0ZUNvbXBvbmVudC50eXBlID0gY2MuU3ByaXRlLlR5cGUuU0xJQ0VEO1xuICAgICAgICAgICAgc3ByaXRlQ29tcG9uZW50LnNpemVNb2RlID0gY2MuU3ByaXRlLlNpemVNb2RlLkNVU1RPTTtcbiAgICAgICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChzcHJpdGVOb2RlKTtcbiAgICAgICAgICAgIHRoaXMuX2xhYmVsU2VnbWVudHMucHVzaChzcHJpdGVOb2RlKTtcblxuICAgICAgICAgICAgbGV0IHNwcml0ZVJlY3QgPSBzcHJpdGVGcmFtZS5nZXRSZWN0KCk7XG4gICAgICAgICAgICBsZXQgc2NhbGVGYWN0b3IgPSAxO1xuICAgICAgICAgICAgbGV0IHNwcml0ZVdpZHRoID0gc3ByaXRlUmVjdC53aWR0aDtcbiAgICAgICAgICAgIGxldCBzcHJpdGVIZWlnaHQgPSBzcHJpdGVSZWN0LmhlaWdodDtcbiAgICAgICAgICAgIGxldCBleHBlY3RXaWR0aCA9IHJpY2hUZXh0RWxlbWVudC5zdHlsZS5pbWFnZVdpZHRoO1xuICAgICAgICAgICAgbGV0IGV4cGVjdEhlaWdodCA9IHJpY2hUZXh0RWxlbWVudC5zdHlsZS5pbWFnZUhlaWdodDtcblxuICAgICAgICAgICAgaWYgKGV4cGVjdEhlaWdodCA+IDApIHtcbiAgICAgICAgICAgICAgICBzY2FsZUZhY3RvciA9IGV4cGVjdEhlaWdodCAvIHNwcml0ZUhlaWdodDtcbiAgICAgICAgICAgICAgICBzcHJpdGVXaWR0aCA9IHNwcml0ZVdpZHRoICogc2NhbGVGYWN0b3I7XG4gICAgICAgICAgICAgICAgc3ByaXRlSGVpZ2h0ID0gc3ByaXRlSGVpZ2h0ICogc2NhbGVGYWN0b3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZUZhY3RvciA9IHRoaXMubGluZUhlaWdodCAvIHNwcml0ZUhlaWdodDtcbiAgICAgICAgICAgICAgICBzcHJpdGVXaWR0aCA9IHNwcml0ZVdpZHRoICogc2NhbGVGYWN0b3I7XG4gICAgICAgICAgICAgICAgc3ByaXRlSGVpZ2h0ID0gc3ByaXRlSGVpZ2h0ICogc2NhbGVGYWN0b3I7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChleHBlY3RXaWR0aCA+IDApIHNwcml0ZVdpZHRoID0gZXhwZWN0V2lkdGg7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm1heFdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9saW5lT2Zmc2V0WCArIHNwcml0ZVdpZHRoID4gdGhpcy5tYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaW5lSW5mbygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl9saW5lT2Zmc2V0WCArPSBzcHJpdGVXaWR0aDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZU9mZnNldFggKz0gc3ByaXRlV2lkdGg7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xpbmVPZmZzZXRYID4gdGhpcy5fbGFiZWxXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYWJlbFdpZHRoID0gdGhpcy5fbGluZU9mZnNldFg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ByaXRlQ29tcG9uZW50LnNwcml0ZUZyYW1lID0gc3ByaXRlRnJhbWU7XG4gICAgICAgICAgICBzcHJpdGVOb2RlLnNldENvbnRlbnRTaXplKHNwcml0ZVdpZHRoLCBzcHJpdGVIZWlnaHQpO1xuICAgICAgICAgICAgc3ByaXRlTm9kZS5fbGluZUNvdW50ID0gdGhpcy5fbGluZUNvdW50O1xuXG4gICAgICAgICAgICBpZiAocmljaFRleHRFbGVtZW50LnN0eWxlLmV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKHJpY2hUZXh0RWxlbWVudC5zdHlsZS5ldmVudC5jbGljaykge1xuICAgICAgICAgICAgICAgICAgICBzcHJpdGVOb2RlLl9jbGlja0hhbmRsZXIgPSByaWNoVGV4dEVsZW1lbnQuc3R5bGUuZXZlbnQuY2xpY2s7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyaWNoVGV4dEVsZW1lbnQuc3R5bGUuZXZlbnQucGFyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgc3ByaXRlTm9kZS5fY2xpY2tQYXJhbSA9IHJpY2hUZXh0RWxlbWVudC5zdHlsZS5ldmVudC5wYXJhbTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNwcml0ZU5vZGUuX2NsaWNrUGFyYW0gPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzcHJpdGVOb2RlLl9jbGlja0hhbmRsZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2Mud2FybklEKDQ0MDApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVSaWNoVGV4dCAoKSB7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkpIHJldHVybjtcblxuICAgICAgICBsZXQgbmV3VGV4dEFycmF5ID0gX2h0bWxUZXh0UGFyc2VyLnBhcnNlKHRoaXMuc3RyaW5nKTtcbiAgICAgICAgaWYgKCF0aGlzLl9uZWVkc1VwZGF0ZVRleHRMYXlvdXQobmV3VGV4dEFycmF5KSkge1xuICAgICAgICAgICAgdGhpcy5fdGV4dEFycmF5ID0gbmV3VGV4dEFycmF5O1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGFiZWxTZWdtZW50VGV4dEF0dHJpYnV0ZXMoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3RleHRBcnJheSA9IG5ld1RleHRBcnJheTtcbiAgICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xuXG4gICAgICAgIGxldCBsYXN0RW1wdHlMaW5lID0gZmFsc2U7XG4gICAgICAgIGxldCBsYWJlbDtcbiAgICAgICAgbGV0IGxhYmVsU2l6ZTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3RleHRBcnJheS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IHJpY2hUZXh0RWxlbWVudCA9IHRoaXMuX3RleHRBcnJheVtpXTtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gcmljaFRleHRFbGVtZW50LnRleHQ7XG4gICAgICAgICAgICAvL2hhbmRsZSA8YnIvPiA8aW1nIC8+IHRhZ1xuICAgICAgICAgICAgaWYgKHRleHQgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAocmljaFRleHRFbGVtZW50LnN0eWxlICYmIHJpY2hUZXh0RWxlbWVudC5zdHlsZS5uZXdsaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxpbmVJbmZvKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmljaFRleHRFbGVtZW50LnN0eWxlICYmIHJpY2hUZXh0RWxlbWVudC5zdHlsZS5pc0ltYWdlICYmIHRoaXMuaW1hZ2VBdGxhcykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hZGRSaWNoVGV4dEltYWdlRWxlbWVudChyaWNoVGV4dEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbXVsdGlsaW5lVGV4dHMgPSB0ZXh0LnNwbGl0KFwiXFxuXCIpO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG11bHRpbGluZVRleHRzLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsU3RyaW5nID0gbXVsdGlsaW5lVGV4dHNbal07XG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsU3RyaW5nID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vZm9yIGNvbnRpbnVlcyBcXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzTGFzdENvbXBvbmVudENSKHRleHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBqID09PSBtdWx0aWxpbmVUZXh0cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaW5lSW5mbygpO1xuICAgICAgICAgICAgICAgICAgICBsYXN0RW1wdHlMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RFbXB0eUxpbmUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1heFdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGFiZWxXaWR0aCA9IHRoaXMuX21lYXN1cmVUZXh0KGksIGxhYmVsU3RyaW5nKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRXaXRoTWF4V2lkdGgobGFiZWxTdHJpbmcsIGxhYmVsV2lkdGgsIGkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChtdWx0aWxpbmVUZXh0cy5sZW5ndGggPiAxICYmIGogPCBtdWx0aWxpbmVUZXh0cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaW5lSW5mbygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbCA9IHRoaXMuX2FkZExhYmVsU2VnbWVudChsYWJlbFN0cmluZywgaSk7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsU2l6ZSA9IGxhYmVsLmdldENvbnRlbnRTaXplKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGluZU9mZnNldFggKz0gbGFiZWxTaXplLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGluZU9mZnNldFggPiB0aGlzLl9sYWJlbFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYWJlbFdpZHRoID0gdGhpcy5fbGluZU9mZnNldFg7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobXVsdGlsaW5lVGV4dHMubGVuZ3RoID4gMSAmJiBqIDwgbXVsdGlsaW5lVGV4dHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTGluZUluZm8oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWxhc3RFbXB0eUxpbmUpIHtcbiAgICAgICAgICAgIHRoaXMuX2xpbmVzV2lkdGgucHVzaCh0aGlzLl9saW5lT2Zmc2V0WCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXhXaWR0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2xhYmVsV2lkdGggPSB0aGlzLm1heFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xhYmVsSGVpZ2h0ID0gKHRoaXMuX2xpbmVDb3VudCArIHRleHRVdGlscy5CQVNFTElORV9SQVRJTykgKiB0aGlzLmxpbmVIZWlnaHQ7XG5cbiAgICAgICAgLy8gdHJpZ2dlciBcInNpemUtY2hhbmdlZFwiIGV2ZW50XG4gICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZSh0aGlzLl9sYWJlbFdpZHRoLCB0aGlzLl9sYWJlbEhlaWdodCk7XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlUmljaFRleHRQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLl9sYXlvdXREaXJ0eSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBfZ2V0Rmlyc3RXb3JkTGVuICh0ZXh0LCBzdGFydEluZGV4LCB0ZXh0TGVuKSB7XG4gICAgICAgIGxldCBjaGFyYWN0ZXIgPSB0ZXh0LmNoYXJBdChzdGFydEluZGV4KTtcbiAgICAgICAgaWYgKHRleHRVdGlscy5pc1VuaWNvZGVDSksoY2hhcmFjdGVyKVxuICAgICAgICAgICAgfHwgdGV4dFV0aWxzLmlzVW5pY29kZVNwYWNlKGNoYXJhY3RlcikpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxlbiA9IDE7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gc3RhcnRJbmRleCArIDE7IGluZGV4IDwgdGV4dExlbjsgKytpbmRleCkge1xuICAgICAgICAgICAgY2hhcmFjdGVyID0gdGV4dC5jaGFyQXQoaW5kZXgpO1xuICAgICAgICAgICAgaWYgKHRleHRVdGlscy5pc1VuaWNvZGVTcGFjZShjaGFyYWN0ZXIpXG4gICAgICAgICAgICAgICAgfHwgdGV4dFV0aWxzLmlzVW5pY29kZUNKSyhjaGFyYWN0ZXIpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZW4rKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsZW47XG4gICAgfSxcblxuICAgIF91cGRhdGVSaWNoVGV4dFBvc2l0aW9uICgpIHtcbiAgICAgICAgbGV0IG5leHRUb2tlblggPSAwO1xuICAgICAgICBsZXQgbmV4dExpbmVJbmRleCA9IDE7XG4gICAgICAgIGxldCB0b3RhbExpbmVDb3VudCA9IHRoaXMuX2xpbmVDb3VudDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9sYWJlbFNlZ21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBsZXQgbGFiZWwgPSB0aGlzLl9sYWJlbFNlZ21lbnRzW2ldO1xuICAgICAgICAgICAgbGV0IGxpbmVDb3VudCA9IGxhYmVsLl9saW5lQ291bnQ7XG4gICAgICAgICAgICBpZiAobGluZUNvdW50ID4gbmV4dExpbmVJbmRleCkge1xuICAgICAgICAgICAgICAgIG5leHRUb2tlblggPSAwO1xuICAgICAgICAgICAgICAgIG5leHRMaW5lSW5kZXggPSBsaW5lQ291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbGluZU9mZnNldFggPSAwO1xuICAgICAgICAgICAgLy8gbGV0IG5vZGVBbmNob3JYT2Zmc2V0ID0gKDAuNSAtIHRoaXMubm9kZS5hbmNob3JYKSAqIHRoaXMuX2xhYmVsV2lkdGg7XG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuaG9yaXpvbnRhbEFsaWduKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBIb3Jpem9udGFsQWxpZ24uTEVGVDpcbiAgICAgICAgICAgICAgICAgICAgbGluZU9mZnNldFggPSAtIHRoaXMuX2xhYmVsV2lkdGggLyAyO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIEhvcml6b250YWxBbGlnbi5DRU5URVI6XG4gICAgICAgICAgICAgICAgICAgIGxpbmVPZmZzZXRYID0gLSB0aGlzLl9saW5lc1dpZHRoW2xpbmVDb3VudCAtIDFdIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBIb3Jpem9udGFsQWxpZ24uUklHSFQ6XG4gICAgICAgICAgICAgICAgICAgIGxpbmVPZmZzZXRYID0gdGhpcy5fbGFiZWxXaWR0aCAvIDIgLSB0aGlzLl9saW5lc1dpZHRoW2xpbmVDb3VudCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhYmVsLnggPSBuZXh0VG9rZW5YICsgbGluZU9mZnNldFg7XG5cbiAgICAgICAgICAgIGxldCBsYWJlbFNpemUgPSBsYWJlbC5nZXRDb250ZW50U2l6ZSgpO1xuXG4gICAgICAgICAgICBsYWJlbC55ID0gdGhpcy5saW5lSGVpZ2h0ICogKHRvdGFsTGluZUNvdW50IC0gbGluZUNvdW50KSAtIHRoaXMuX2xhYmVsSGVpZ2h0IC8gMjtcblxuICAgICAgICAgICAgaWYgKGxpbmVDb3VudCA9PT0gbmV4dExpbmVJbmRleCkge1xuICAgICAgICAgICAgICAgIG5leHRUb2tlblggKz0gbGFiZWxTaXplLndpZHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc3ByaXRlID0gbGFiZWwuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgICAgICBpZiAoc3ByaXRlKSB7XG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IGltZyBhbGlnbiAoZnJvbSA8aW1nIGFsaWduPXRvcHxjZW50ZXJ8Ym90dG9tPilcbiAgICAgICAgICAgICAgICBsZXQgbGluZUhlaWdodFNldCA9IHRoaXMubGluZUhlaWdodDtcbiAgICAgICAgICAgICAgICBsZXQgbGluZUhlaWdodFJlYWwgPSB0aGlzLmxpbmVIZWlnaHQgKiAoMSArIHRleHRVdGlscy5CQVNFTElORV9SQVRJTyk7IC8vc2luZ2xlIGxpbmUgbm9kZSBoZWlnaHRcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGxhYmVsLmFuY2hvclkpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbC55ICs9ICggbGluZUhlaWdodFNldCArICggKCBsaW5lSGVpZ2h0UmVhbCAtIGxpbmVIZWlnaHRTZXQpIC8gMiApICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwLjU6XG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbC55ICs9ICggbGluZUhlaWdodFJlYWwgLyAyICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsLnkgKz0gKCAobGluZUhlaWdodFJlYWwgLSBsaW5lSGVpZ2h0U2V0KSAvIDIgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBhZGp1c3QgaW1nIG9mZnNldCAoZnJvbSA8aW1nIG9mZnNldD0xMnwxMiwzND4pXG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsLl9pbWFnZU9mZnNldClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRzID0gbGFiZWwuX2ltYWdlT2Zmc2V0LnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvZmZzZXRzLmxlbmd0aCA9PT0gMSAmJiBvZmZzZXRzWzBdKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IHBhcnNlRmxvYXQob2Zmc2V0c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvZmZzZXRZKSkgbGFiZWwueSArPSBvZmZzZXRZO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYob2Zmc2V0cy5sZW5ndGggPT09IDIpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRYID0gcGFyc2VGbG9hdChvZmZzZXRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXRZID0gcGFyc2VGbG9hdChvZmZzZXRzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG9mZnNldFgpKSBsYWJlbC54ICs9IG9mZnNldFg7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihvZmZzZXRZKSkgbGFiZWwueSArPSBvZmZzZXRZO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2FkanVzdCB5IGZvciBsYWJlbCB3aXRoIG91dGxpbmVcbiAgICAgICAgICAgIGxldCBvdXRsaW5lID0gbGFiZWwuZ2V0Q29tcG9uZW50KGNjLkxhYmVsT3V0bGluZSk7XG4gICAgICAgICAgICBpZiAob3V0bGluZSAmJiBvdXRsaW5lLndpZHRoKSBsYWJlbC55ID0gbGFiZWwueSAtIG91dGxpbmUud2lkdGg7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NvbnZlcnRMaXRlcmFsQ29sb3JWYWx1ZSAoY29sb3IpIHtcbiAgICAgICAgbGV0IGNvbG9yVmFsdWUgPSBjb2xvci50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBpZiAoY2MuQ29sb3JbY29sb3JWYWx1ZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBjYy5Db2xvcltjb2xvclZhbHVlXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBvdXQgPSBjYy5jb2xvcigpO1xuICAgICAgICAgICAgcmV0dXJuIG91dC5mcm9tSEVYKGNvbG9yKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBXaGVuIHN0cmluZyBpcyBudWxsLCBpdCBtZWFucyB0aGF0IHRoZSB0ZXh0IGRvZXMgbm90IG5lZWQgdG8gYmUgdXBkYXRlZC4gXG4gICAgX2FwcGx5VGV4dEF0dHJpYnV0ZSAobGFiZWxOb2RlLCBzdHJpbmcsIGZvcmNlKSB7XG4gICAgICAgIGxldCBsYWJlbENvbXBvbmVudCA9IGxhYmVsTm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpO1xuICAgICAgICBpZiAoIWxhYmVsQ29tcG9uZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW5kZXggPSBsYWJlbE5vZGUuX3N0eWxlSW5kZXg7XG5cbiAgICAgICAgbGV0IHRleHRTdHlsZSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLl90ZXh0QXJyYXlbaW5kZXhdKSB7XG4gICAgICAgICAgICB0ZXh0U3R5bGUgPSB0aGlzLl90ZXh0QXJyYXlbaW5kZXhdLnN0eWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRleHRTdHlsZSAmJiB0ZXh0U3R5bGUuY29sb3IpIHtcbiAgICAgICAgICAgIGxhYmVsTm9kZS5jb2xvciA9IHRoaXMuX2NvbnZlcnRMaXRlcmFsQ29sb3JWYWx1ZSh0ZXh0U3R5bGUuY29sb3IpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBsYWJlbE5vZGUuY29sb3IgPSB0aGlzLm5vZGUuY29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICBsYWJlbENvbXBvbmVudC5jYWNoZU1vZGUgPSB0aGlzLmNhY2hlTW9kZTtcblxuICAgICAgICBsZXQgaXNBc3NldCA9IHRoaXMuZm9udCBpbnN0YW5jZW9mIGNjLkZvbnQ7XG4gICAgICAgIGlmIChpc0Fzc2V0ICYmICF0aGlzLl9pc1N5c3RlbUZvbnRVc2VkKSB7XG4gICAgICAgICAgICBsYWJlbENvbXBvbmVudC5mb250ID0gdGhpcy5mb250O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGFiZWxDb21wb25lbnQuZm9udEZhbWlseSA9IHRoaXMuZm9udEZhbWlseTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBsYWJlbENvbXBvbmVudC51c2VTeXN0ZW1Gb250ID0gdGhpcy5faXNTeXN0ZW1Gb250VXNlZDtcbiAgICAgICAgbGFiZWxDb21wb25lbnQubGluZUhlaWdodCA9IHRoaXMubGluZUhlaWdodDtcbiAgICAgICAgbGFiZWxDb21wb25lbnQuZW5hYmxlQm9sZCA9IHRleHRTdHlsZSAmJiB0ZXh0U3R5bGUuYm9sZDtcbiAgICAgICAgbGFiZWxDb21wb25lbnQuZW5hYmxlSXRhbGljcyA9IHRleHRTdHlsZSAmJiB0ZXh0U3R5bGUuaXRhbGljO1xuICAgICAgICAvL1RPRE86IHRlbXBvcmFyeSBpbXBsZW1lbnRhdGlvbiwgdGhlIGl0YWxpYyBlZmZlY3Qgc2hvdWxkIGJlIGltcGxlbWVudGVkIGluIHRoZSBpbnRlcm5hbCBvZiBsYWJlbC1hc3NlbWJsZXIuXG4gICAgICAgIGlmICh0ZXh0U3R5bGUgJiYgdGV4dFN0eWxlLml0YWxpYykge1xuICAgICAgICAgICAgbGFiZWxOb2RlLnNrZXdYID0gMTI7XG4gICAgICAgIH1cblxuICAgICAgICBsYWJlbENvbXBvbmVudC5lbmFibGVVbmRlcmxpbmUgPSB0ZXh0U3R5bGUgJiYgdGV4dFN0eWxlLnVuZGVybGluZTtcblxuICAgICAgICBpZiAodGV4dFN0eWxlICYmIHRleHRTdHlsZS5vdXRsaW5lKSB7XG4gICAgICAgICAgICBsZXQgbGFiZWxPdXRsaW5lQ29tcG9uZW50ID0gbGFiZWxOb2RlLmdldENvbXBvbmVudChjYy5MYWJlbE91dGxpbmUpO1xuICAgICAgICAgICAgaWYgKCFsYWJlbE91dGxpbmVDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICBsYWJlbE91dGxpbmVDb21wb25lbnQgPSBsYWJlbE5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsT3V0bGluZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYWJlbE91dGxpbmVDb21wb25lbnQuY29sb3IgPSB0aGlzLl9jb252ZXJ0TGl0ZXJhbENvbG9yVmFsdWUodGV4dFN0eWxlLm91dGxpbmUuY29sb3IpO1xuICAgICAgICAgICAgbGFiZWxPdXRsaW5lQ29tcG9uZW50LndpZHRoID0gdGV4dFN0eWxlLm91dGxpbmUud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGV4dFN0eWxlICYmIHRleHRTdHlsZS5zaXplKSB7XG4gICAgICAgICAgICBsYWJlbENvbXBvbmVudC5mb250U2l6ZSA9IHRleHRTdHlsZS5zaXplO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGFiZWxDb21wb25lbnQuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0cmluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgc3RyaW5nID0gJycgKyBzdHJpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYWJlbENvbXBvbmVudC5zdHJpbmcgPSBzdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBmb3JjZSAmJiBsYWJlbENvbXBvbmVudC5fZm9yY2VVcGRhdGVSZW5kZXJEYXRhKCk7XG5cbiAgICAgICAgaWYgKHRleHRTdHlsZSAmJiB0ZXh0U3R5bGUuZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICh0ZXh0U3R5bGUuZXZlbnQuY2xpY2spIHtcbiAgICAgICAgICAgICAgICBsYWJlbE5vZGUuX2NsaWNrSGFuZGxlciA9IHRleHRTdHlsZS5ldmVudC5jbGljaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0ZXh0U3R5bGUuZXZlbnQucGFyYW0pIHtcbiAgICAgICAgICAgICAgICBsYWJlbE5vZGUuX2NsaWNrUGFyYW0gPSB0ZXh0U3R5bGUuZXZlbnQucGFyYW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsYWJlbE5vZGUuX2NsaWNrUGFyYW0gPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxhYmVsTm9kZS5fY2xpY2tIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkRlc3Ryb3kgKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xhYmVsU2VnbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHRoaXMuX2xhYmVsU2VnbWVudHNbaV0ucmVtb3ZlRnJvbVBhcmVudCgpO1xuICAgICAgICAgICAgcG9vbC5wdXQodGhpcy5fbGFiZWxTZWdtZW50c1tpXSk7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG5cbmNjLlJpY2hUZXh0ID0gbW9kdWxlLmV4cG9ydHMgPSBSaWNoVGV4dDtcbiJdfQ==