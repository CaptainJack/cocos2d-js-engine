
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/editbox/WebEditBoxImpl.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _mat = _interopRequireDefault(require("../../value-types/mat4"));

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
var utils = require('../../platform/utils');

var macro = require('../../platform/CCMacro');

var Types = require('./types');

var Label = require('../CCLabel');

var tabIndexUtil = require('./tabIndexUtil');

var EditBox = cc.EditBox;
var js = cc.js;
var InputMode = Types.InputMode;
var InputFlag = Types.InputFlag;
var KeyboardReturnType = Types.KeyboardReturnType; // polyfill

var polyfill = {
  zoomInvalid: false
};

if (cc.sys.OS_ANDROID === cc.sys.os && (cc.sys.browserType === cc.sys.BROWSER_TYPE_SOUGOU || cc.sys.browserType === cc.sys.BROWSER_TYPE_360)) {
  polyfill.zoomInvalid = true;
} // https://segmentfault.com/q/1010000002914610


var DELAY_TIME = 800;
var SCROLLY = 100;
var LEFT_PADDING = 2; // private static property

var _domCount = 0;

var _vec3 = cc.v3();

var _currentEditBoxImpl = null; // on mobile

var _fullscreen = false;
var _autoResize = false;
var BaseClass = EditBox._ImplClass; // This is an adapter for EditBoxImpl on web platform.
// For more adapters on other platforms, please inherit from EditBoxImplBase and implement the interface.

function WebEditBoxImpl() {
  BaseClass.call(this);
  this._domId = "EditBoxId_" + ++_domCount;
  this._placeholderStyleSheet = null;
  this._elem = null;
  this._isTextArea = false; // matrix

  this._worldMat = new _mat["default"]();
  this._cameraMat = new _mat["default"](); // matrix cache

  this._m00 = 0;
  this._m01 = 0;
  this._m04 = 0;
  this._m05 = 0;
  this._m12 = 0;
  this._m13 = 0;
  this._w = 0;
  this._h = 0; // inputType cache

  this._inputMode = null;
  this._inputFlag = null;
  this._returnType = null; // event listeners

  this._eventListeners = {}; // update style sheet cache

  this._textLabelFont = null;
  this._textLabelFontSize = null;
  this._textLabelFontColor = null;
  this._textLabelAlign = null;
  this._placeholderLabelFont = null;
  this._placeholderLabelFontSize = null;
  this._placeholderLabelFontColor = null;
  this._placeholderLabelAlign = null;
  this._placeholderLineHeight = null;
}

js.extend(WebEditBoxImpl, BaseClass);
EditBox._ImplClass = WebEditBoxImpl;
Object.assign(WebEditBoxImpl.prototype, {
  // =================================
  // implement EditBoxImplBase interface
  init: function init(delegate) {
    if (!delegate) {
      return;
    }

    this._delegate = delegate;

    if (delegate.inputMode === InputMode.ANY) {
      this._createTextArea();
    } else {
      this._createInput();
    }

    tabIndexUtil.add(this);
    this.setTabIndex(delegate.tabIndex);

    this._initStyleSheet();

    this._registerEventListeners();

    this._addDomToGameContainer();

    _fullscreen = cc.view.isAutoFullScreenEnabled();
    _autoResize = cc.view._resizeWithBrowserSize;
  },
  clear: function clear() {
    this._removeEventListeners();

    this._removeDomFromGameContainer();

    tabIndexUtil.remove(this); // clear while editing

    if (_currentEditBoxImpl === this) {
      _currentEditBoxImpl = null;
    }
  },
  update: function update() {// do nothing...
  },
  setTabIndex: function setTabIndex(index) {
    this._elem.tabIndex = index;
    tabIndexUtil.resort();
  },
  setSize: function setSize(width, height) {
    var elem = this._elem;
    elem.style.width = width + 'px';
    elem.style.height = height + 'px';
  },
  beginEditing: function beginEditing() {
    if (_currentEditBoxImpl && _currentEditBoxImpl !== this) {
      _currentEditBoxImpl.setFocus(false);
    }

    this._editing = true;
    _currentEditBoxImpl = this;

    this._delegate.editBoxEditingDidBegan();

    this._showDom();

    this._elem.focus(); // set focus

  },
  endEditing: function endEditing() {
    if (this._elem) {
      this._elem.blur();
    }
  },
  // ==========================================================================
  // implement dom input
  _createInput: function _createInput() {
    this._isTextArea = false;
    this._elem = document.createElement('input');
  },
  _createTextArea: function _createTextArea() {
    this._isTextArea = true;
    this._elem = document.createElement('textarea');
  },
  _addDomToGameContainer: function _addDomToGameContainer() {
    cc.game.container.appendChild(this._elem);
    document.head.appendChild(this._placeholderStyleSheet);
  },
  _removeDomFromGameContainer: function _removeDomFromGameContainer() {
    var hasElem = utils.contains(cc.game.container, this._elem);

    if (hasElem) {
      cc.game.container.removeChild(this._elem);
    }

    var hasStyleSheet = utils.contains(document.head, this._placeholderStyleSheet);

    if (hasStyleSheet) {
      document.head.removeChild(this._placeholderStyleSheet);
    }

    delete this._elem;
    delete this._placeholderStyleSheet;
  },
  _showDom: function _showDom() {
    this._updateMatrix();

    this._updateMaxLength();

    this._updateInputType();

    this._updateStyleSheet();

    this._elem.style.display = '';

    this._delegate._hideLabels();

    if (cc.sys.isMobile) {
      this._showDomOnMobile();
    }
  },
  _hideDom: function _hideDom() {
    var elem = this._elem;
    elem.style.display = 'none';

    this._delegate._showLabels();

    if (cc.sys.isMobile) {
      this._hideDomOnMobile();
    }
  },
  _showDomOnMobile: function _showDomOnMobile() {
    if (cc.sys.os !== cc.sys.OS_ANDROID) {
      return;
    }

    if (_fullscreen) {
      cc.view.enableAutoFullScreen(false);
      cc.screen.exitFullScreen();
    }

    if (_autoResize) {
      cc.view.resizeWithBrowserSize(false);
    }

    this._adjustWindowScroll();
  },
  _hideDomOnMobile: function _hideDomOnMobile() {
    if (cc.sys.os === cc.sys.OS_ANDROID) {
      if (_autoResize) {
        cc.view.resizeWithBrowserSize(true);
      } // In case enter full screen when soft keyboard still showing


      setTimeout(function () {
        if (!_currentEditBoxImpl) {
          if (_fullscreen) {
            cc.view.enableAutoFullScreen(true);
          }
        }
      }, DELAY_TIME);
    } // Some browser like wechat on iOS need to mannully scroll back window


    this._scrollBackWindow();
  },
  // adjust view to editBox
  _adjustWindowScroll: function _adjustWindowScroll() {
    var self = this;
    setTimeout(function () {
      if (window.scrollY < SCROLLY) {
        self._elem.scrollIntoView({
          block: "start",
          inline: "nearest",
          behavior: "smooth"
        });
      }
    }, DELAY_TIME);
  },
  _scrollBackWindow: function _scrollBackWindow() {
    setTimeout(function () {
      // FIX: wechat browser bug on iOS
      // If gameContainer is included in iframe,
      // Need to scroll the top window, not the one in the iframe
      // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/top
      var sys = cc.sys;

      if (sys.browserType === sys.BROWSER_TYPE_WECHAT && sys.os === sys.OS_IOS) {
        window.top && window.top.scrollTo(0, 0);
        return;
      }

      window.scrollTo(0, 0);
    }, DELAY_TIME);
  },
  _updateMatrix: function _updateMatrix() {
    var node = this._delegate.node;
    node.getWorldMatrix(this._worldMat);
    var worldMat = this._worldMat;
    var worldMatm = worldMat.m; // check whether need to update

    if (this._m00 === worldMatm[0] && this._m01 === worldMatm[1] && this._m04 === worldMatm[4] && this._m05 === worldMatm[5] && this._m12 === worldMatm[12] && this._m13 === worldMatm[13] && this._w === node._contentSize.width && this._h === node._contentSize.height) {
      return;
    } // update matrix cache


    this._m00 = worldMatm[0];
    this._m01 = worldMatm[1];
    this._m04 = worldMatm[4];
    this._m05 = worldMatm[5];
    this._m12 = worldMatm[12];
    this._m13 = worldMatm[13];
    this._w = node._contentSize.width;
    this._h = node._contentSize.height;
    var scaleX = cc.view._scaleX,
        scaleY = cc.view._scaleY,
        viewport = cc.view._viewportRect,
        dpr = cc.view._devicePixelRatio;
    _vec3.x = -node._anchorPoint.x * this._w;
    _vec3.y = -node._anchorPoint.y * this._h;

    _mat["default"].transform(worldMat, worldMat, _vec3); // can't find camera in editor


    var cameraMat;

    if (CC_EDITOR) {
      cameraMat = this._cameraMat = worldMat;
    } else {
      var camera = cc.Camera.findCamera(node);
      camera.getWorldToScreenMatrix2D(this._cameraMat);
      cameraMat = this._cameraMat;

      _mat["default"].mul(cameraMat, cameraMat, worldMat);
    }

    scaleX /= dpr;
    scaleY /= dpr;
    var container = cc.game.container;
    var cameraMatm = cameraMat.m;
    var a = cameraMatm[0] * scaleX,
        b = cameraMatm[1],
        c = cameraMatm[4],
        d = cameraMatm[5] * scaleY;
    var offsetX = container && container.style.paddingLeft && parseInt(container.style.paddingLeft);
    offsetX += viewport.x / dpr;
    var offsetY = container && container.style.paddingBottom && parseInt(container.style.paddingBottom);
    offsetY += viewport.y / dpr;
    var tx = cameraMatm[12] * scaleX + offsetX,
        ty = cameraMatm[13] * scaleY + offsetY;

    if (polyfill.zoomInvalid) {
      this.setSize(node.width * a, node.height * d);
      a = 1;
      d = 1;
    }

    var elem = this._elem;
    var matrix = "matrix(" + a + "," + -b + "," + -c + "," + d + "," + tx + "," + -ty + ")";
    elem.style['transform'] = matrix;
    elem.style['-webkit-transform'] = matrix;
    elem.style['transform-origin'] = '0px 100% 0px';
    elem.style['-webkit-transform-origin'] = '0px 100% 0px';
  },
  // ===========================================
  // input type and max length
  _updateInputType: function _updateInputType() {
    var delegate = this._delegate,
        inputMode = delegate.inputMode,
        inputFlag = delegate.inputFlag,
        returnType = delegate.returnType,
        elem = this._elem; // whether need to update

    if (this._inputMode === inputMode && this._inputFlag === inputFlag && this._returnType === returnType) {
      return;
    } // update cache


    this._inputMode = inputMode;
    this._inputFlag = inputFlag;
    this._returnType = returnType; // FIX ME: TextArea actually dose not support password type.

    if (this._isTextArea) {
      // input flag
      var _textTransform = 'none';

      if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
        _textTransform = 'uppercase';
      } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
        _textTransform = 'capitalize';
      }

      elem.style.textTransform = _textTransform;
      return;
    } // begin to updateInputType


    if (inputFlag === InputFlag.PASSWORD) {
      elem.type = 'password';
      return;
    } // input mode


    var type = elem.type;

    if (inputMode === InputMode.EMAIL_ADDR) {
      type = 'email';
    } else if (inputMode === InputMode.NUMERIC || inputMode === InputMode.DECIMAL) {
      type = 'number';
    } else if (inputMode === InputMode.PHONE_NUMBER) {
      type = 'number';
      elem.pattern = '[0-9]*';
    } else if (inputMode === InputMode.URL) {
      type = 'url';
    } else {
      type = 'text';

      if (returnType === KeyboardReturnType.SEARCH) {
        type = 'search';
      }
    }

    elem.type = type; // input flag

    var textTransform = 'none';

    if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
      textTransform = 'uppercase';
    } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
      textTransform = 'capitalize';
    }

    elem.style.textTransform = textTransform;
  },
  _updateMaxLength: function _updateMaxLength() {
    var maxLength = this._delegate.maxLength;

    if (maxLength < 0) {
      //we can't set Number.MAX_VALUE to input's maxLength property
      //so we use a magic number here, it should works at most use cases.
      maxLength = 65535;
    }

    this._elem.maxLength = maxLength;
  },
  // ===========================================
  // style sheet
  _initStyleSheet: function _initStyleSheet() {
    var elem = this._elem;
    elem.style.display = 'none';
    elem.style.border = 0;
    elem.style.background = 'transparent';
    elem.style.width = '100%';
    elem.style.height = '100%';
    elem.style.active = 0;
    elem.style.outline = 'medium';
    elem.style.padding = '0';
    elem.style.textTransform = 'uppercase';
    elem.style.position = "absolute";
    elem.style.bottom = "0px";
    elem.style.left = LEFT_PADDING + "px";
    elem.className = "cocosEditBox";
    elem.id = this._domId;

    if (!this._isTextArea) {
      elem.type = 'text';
      elem.style['-moz-appearance'] = 'textfield';
    } else {
      elem.style.resize = 'none';
      elem.style.overflow_y = 'scroll';
    }

    this._placeholderStyleSheet = document.createElement('style');
  },
  _updateStyleSheet: function _updateStyleSheet() {
    var delegate = this._delegate,
        elem = this._elem;
    elem.value = delegate.string;
    elem.placeholder = delegate.placeholder;

    this._updateTextLabel(delegate.textLabel);

    this._updatePlaceholderLabel(delegate.placeholderLabel);
  },
  _updateTextLabel: function _updateTextLabel(textLabel) {
    if (!textLabel) {
      return;
    } // get font


    var font = textLabel.font;

    if (font && !(font instanceof cc.BitmapFont)) {
      font = font._fontFamily;
    } else {
      font = textLabel.fontFamily;
    } // get font size


    var fontSize = textLabel.fontSize * textLabel.node.scaleY; // whether need to update

    if (this._textLabelFont === font && this._textLabelFontSize === fontSize && this._textLabelFontColor === textLabel.fontColor && this._textLabelAlign === textLabel.horizontalAlign) {
      return;
    } // update cache


    this._textLabelFont = font;
    this._textLabelFontSize = fontSize;
    this._textLabelFontColor = textLabel.fontColor;
    this._textLabelAlign = textLabel.horizontalAlign;
    var elem = this._elem; // font size

    elem.style.fontSize = fontSize + "px"; // font color

    elem.style.color = textLabel.node.color.toCSS(); // font family

    elem.style.fontFamily = font; // text-align

    switch (textLabel.horizontalAlign) {
      case Label.HorizontalAlign.LEFT:
        elem.style.textAlign = 'left';
        break;

      case Label.HorizontalAlign.CENTER:
        elem.style.textAlign = 'center';
        break;

      case Label.HorizontalAlign.RIGHT:
        elem.style.textAlign = 'right';
        break;
    } // lineHeight
    // Can't sync lineHeight property, because lineHeight would change the touch area of input

  },
  _updatePlaceholderLabel: function _updatePlaceholderLabel(placeholderLabel) {
    if (!placeholderLabel) {
      return;
    } // get font


    var font = placeholderLabel.font;

    if (font && !(font instanceof cc.BitmapFont)) {
      font = placeholderLabel.font._fontFamily;
    } else {
      font = placeholderLabel.fontFamily;
    } // get font size


    var fontSize = placeholderLabel.fontSize * placeholderLabel.node.scaleY; // whether need to update

    if (this._placeholderLabelFont === font && this._placeholderLabelFontSize === fontSize && this._placeholderLabelFontColor === placeholderLabel.fontColor && this._placeholderLabelAlign === placeholderLabel.horizontalAlign && this._placeholderLineHeight === placeholderLabel.fontSize) {
      return;
    } // update cache


    this._placeholderLabelFont = font;
    this._placeholderLabelFontSize = fontSize;
    this._placeholderLabelFontColor = placeholderLabel.fontColor;
    this._placeholderLabelAlign = placeholderLabel.horizontalAlign;
    this._placeholderLineHeight = placeholderLabel.fontSize;
    var styleEl = this._placeholderStyleSheet; // font color

    var fontColor = placeholderLabel.node.color.toCSS(); // line height

    var lineHeight = placeholderLabel.fontSize; // top vertical align by default
    // horizontal align

    var horizontalAlign;

    switch (placeholderLabel.horizontalAlign) {
      case Label.HorizontalAlign.LEFT:
        horizontalAlign = 'left';
        break;

      case Label.HorizontalAlign.CENTER:
        horizontalAlign = 'center';
        break;

      case Label.HorizontalAlign.RIGHT:
        horizontalAlign = 'right';
        break;
    }

    styleEl.innerHTML = "#" + this._domId + "::-webkit-input-placeholder,#" + this._domId + "::-moz-placeholder,#" + this._domId + ":-ms-input-placeholder" + ("{text-transform: initial; font-family: " + font + "; font-size: " + fontSize + "px; color: " + fontColor + "; line-height: " + lineHeight + "px; text-align: " + horizontalAlign + ";}"); // EDGE_BUG_FIX: hide clear button, because clearing input box in Edge does not emit input event 
    // issue refference: https://github.com/angular/angular/issues/26307

    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_EDGE) {
      styleEl.innerHTML += "#" + this._domId + "::-ms-clear{display: none;}";
    }
  },
  // ===========================================
  // handle event listeners
  _registerEventListeners: function _registerEventListeners() {
    var impl = this,
        elem = this._elem,
        inputLock = false,
        cbs = this._eventListeners;

    cbs.compositionStart = function () {
      inputLock = true;
    };

    cbs.compositionEnd = function () {
      inputLock = false;

      impl._delegate.editBoxTextChanged(elem.value);
    };

    cbs.onInput = function () {
      if (inputLock) {
        return;
      }

      impl._delegate.editBoxTextChanged(elem.value);
    }; // There are 2 ways to focus on the input element:
    // Click the input element, or call input.focus().
    // Both need to adjust window scroll.


    cbs.onClick = function (e) {
      // In case operation sequence: click input, hide keyboard, then click again.
      if (impl._editing) {
        if (cc.sys.isMobile) {
          impl._adjustWindowScroll();
        }
      }
    };

    cbs.onKeydown = function (e) {
      if (e.keyCode === macro.KEY.enter) {
        e.stopPropagation();

        impl._delegate.editBoxEditingReturn();

        if (!impl._isTextArea) {
          elem.blur();
        }
      } else if (e.keyCode === macro.KEY.tab) {
        e.stopPropagation();
        e.preventDefault();
        tabIndexUtil.next(impl);
      }
    };

    cbs.onBlur = function () {
      impl._editing = false;
      _currentEditBoxImpl = null;

      impl._hideDom();

      impl._delegate.editBoxEditingDidEnded();
    };

    elem.addEventListener('compositionstart', cbs.compositionStart);
    elem.addEventListener('compositionend', cbs.compositionEnd);
    elem.addEventListener('input', cbs.onInput);
    elem.addEventListener('keydown', cbs.onKeydown);
    elem.addEventListener('blur', cbs.onBlur);
    elem.addEventListener('touchstart', cbs.onClick);
  },
  _removeEventListeners: function _removeEventListeners() {
    var elem = this._elem,
        cbs = this._eventListeners;
    elem.removeEventListener('compositionstart', cbs.compositionStart);
    elem.removeEventListener('compositionend', cbs.compositionEnd);
    elem.removeEventListener('input', cbs.onInput);
    elem.removeEventListener('keydown', cbs.onKeydown);
    elem.removeEventListener('blur', cbs.onBlur);
    elem.removeEventListener('touchstart', cbs.onClick);
    cbs.compositionStart = null;
    cbs.compositionEnd = null;
    cbs.onInput = null;
    cbs.onKeydown = null;
    cbs.onBlur = null;
    cbs.onClick = null;
  }
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIldlYkVkaXRCb3hJbXBsLmpzIl0sIm5hbWVzIjpbInV0aWxzIiwicmVxdWlyZSIsIm1hY3JvIiwiVHlwZXMiLCJMYWJlbCIsInRhYkluZGV4VXRpbCIsIkVkaXRCb3giLCJjYyIsImpzIiwiSW5wdXRNb2RlIiwiSW5wdXRGbGFnIiwiS2V5Ym9hcmRSZXR1cm5UeXBlIiwicG9seWZpbGwiLCJ6b29tSW52YWxpZCIsInN5cyIsIk9TX0FORFJPSUQiLCJvcyIsImJyb3dzZXJUeXBlIiwiQlJPV1NFUl9UWVBFX1NPVUdPVSIsIkJST1dTRVJfVFlQRV8zNjAiLCJERUxBWV9USU1FIiwiU0NST0xMWSIsIkxFRlRfUEFERElORyIsIl9kb21Db3VudCIsIl92ZWMzIiwidjMiLCJfY3VycmVudEVkaXRCb3hJbXBsIiwiX2Z1bGxzY3JlZW4iLCJfYXV0b1Jlc2l6ZSIsIkJhc2VDbGFzcyIsIl9JbXBsQ2xhc3MiLCJXZWJFZGl0Qm94SW1wbCIsImNhbGwiLCJfZG9tSWQiLCJfcGxhY2Vob2xkZXJTdHlsZVNoZWV0IiwiX2VsZW0iLCJfaXNUZXh0QXJlYSIsIl93b3JsZE1hdCIsIk1hdDQiLCJfY2FtZXJhTWF0IiwiX20wMCIsIl9tMDEiLCJfbTA0IiwiX20wNSIsIl9tMTIiLCJfbTEzIiwiX3ciLCJfaCIsIl9pbnB1dE1vZGUiLCJfaW5wdXRGbGFnIiwiX3JldHVyblR5cGUiLCJfZXZlbnRMaXN0ZW5lcnMiLCJfdGV4dExhYmVsRm9udCIsIl90ZXh0TGFiZWxGb250U2l6ZSIsIl90ZXh0TGFiZWxGb250Q29sb3IiLCJfdGV4dExhYmVsQWxpZ24iLCJfcGxhY2Vob2xkZXJMYWJlbEZvbnQiLCJfcGxhY2Vob2xkZXJMYWJlbEZvbnRTaXplIiwiX3BsYWNlaG9sZGVyTGFiZWxGb250Q29sb3IiLCJfcGxhY2Vob2xkZXJMYWJlbEFsaWduIiwiX3BsYWNlaG9sZGVyTGluZUhlaWdodCIsImV4dGVuZCIsIk9iamVjdCIsImFzc2lnbiIsInByb3RvdHlwZSIsImluaXQiLCJkZWxlZ2F0ZSIsIl9kZWxlZ2F0ZSIsImlucHV0TW9kZSIsIkFOWSIsIl9jcmVhdGVUZXh0QXJlYSIsIl9jcmVhdGVJbnB1dCIsImFkZCIsInNldFRhYkluZGV4IiwidGFiSW5kZXgiLCJfaW5pdFN0eWxlU2hlZXQiLCJfcmVnaXN0ZXJFdmVudExpc3RlbmVycyIsIl9hZGREb21Ub0dhbWVDb250YWluZXIiLCJ2aWV3IiwiaXNBdXRvRnVsbFNjcmVlbkVuYWJsZWQiLCJfcmVzaXplV2l0aEJyb3dzZXJTaXplIiwiY2xlYXIiLCJfcmVtb3ZlRXZlbnRMaXN0ZW5lcnMiLCJfcmVtb3ZlRG9tRnJvbUdhbWVDb250YWluZXIiLCJyZW1vdmUiLCJ1cGRhdGUiLCJpbmRleCIsInJlc29ydCIsInNldFNpemUiLCJ3aWR0aCIsImhlaWdodCIsImVsZW0iLCJzdHlsZSIsImJlZ2luRWRpdGluZyIsInNldEZvY3VzIiwiX2VkaXRpbmciLCJlZGl0Qm94RWRpdGluZ0RpZEJlZ2FuIiwiX3Nob3dEb20iLCJmb2N1cyIsImVuZEVkaXRpbmciLCJibHVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZ2FtZSIsImNvbnRhaW5lciIsImFwcGVuZENoaWxkIiwiaGVhZCIsImhhc0VsZW0iLCJjb250YWlucyIsInJlbW92ZUNoaWxkIiwiaGFzU3R5bGVTaGVldCIsIl91cGRhdGVNYXRyaXgiLCJfdXBkYXRlTWF4TGVuZ3RoIiwiX3VwZGF0ZUlucHV0VHlwZSIsIl91cGRhdGVTdHlsZVNoZWV0IiwiZGlzcGxheSIsIl9oaWRlTGFiZWxzIiwiaXNNb2JpbGUiLCJfc2hvd0RvbU9uTW9iaWxlIiwiX2hpZGVEb20iLCJfc2hvd0xhYmVscyIsIl9oaWRlRG9tT25Nb2JpbGUiLCJlbmFibGVBdXRvRnVsbFNjcmVlbiIsInNjcmVlbiIsImV4aXRGdWxsU2NyZWVuIiwicmVzaXplV2l0aEJyb3dzZXJTaXplIiwiX2FkanVzdFdpbmRvd1Njcm9sbCIsInNldFRpbWVvdXQiLCJfc2Nyb2xsQmFja1dpbmRvdyIsInNlbGYiLCJ3aW5kb3ciLCJzY3JvbGxZIiwic2Nyb2xsSW50b1ZpZXciLCJibG9jayIsImlubGluZSIsImJlaGF2aW9yIiwiQlJPV1NFUl9UWVBFX1dFQ0hBVCIsIk9TX0lPUyIsInRvcCIsInNjcm9sbFRvIiwibm9kZSIsImdldFdvcmxkTWF0cml4Iiwid29ybGRNYXQiLCJ3b3JsZE1hdG0iLCJtIiwiX2NvbnRlbnRTaXplIiwic2NhbGVYIiwiX3NjYWxlWCIsInNjYWxlWSIsIl9zY2FsZVkiLCJ2aWV3cG9ydCIsIl92aWV3cG9ydFJlY3QiLCJkcHIiLCJfZGV2aWNlUGl4ZWxSYXRpbyIsIngiLCJfYW5jaG9yUG9pbnQiLCJ5IiwidHJhbnNmb3JtIiwiY2FtZXJhTWF0IiwiQ0NfRURJVE9SIiwiY2FtZXJhIiwiQ2FtZXJhIiwiZmluZENhbWVyYSIsImdldFdvcmxkVG9TY3JlZW5NYXRyaXgyRCIsIm11bCIsImNhbWVyYU1hdG0iLCJhIiwiYiIsImMiLCJkIiwib2Zmc2V0WCIsInBhZGRpbmdMZWZ0IiwicGFyc2VJbnQiLCJvZmZzZXRZIiwicGFkZGluZ0JvdHRvbSIsInR4IiwidHkiLCJtYXRyaXgiLCJpbnB1dEZsYWciLCJyZXR1cm5UeXBlIiwidGV4dFRyYW5zZm9ybSIsIklOSVRJQUxfQ0FQU19BTExfQ0hBUkFDVEVSUyIsIklOSVRJQUxfQ0FQU19XT1JEIiwiUEFTU1dPUkQiLCJ0eXBlIiwiRU1BSUxfQUREUiIsIk5VTUVSSUMiLCJERUNJTUFMIiwiUEhPTkVfTlVNQkVSIiwicGF0dGVybiIsIlVSTCIsIlNFQVJDSCIsIm1heExlbmd0aCIsImJvcmRlciIsImJhY2tncm91bmQiLCJhY3RpdmUiLCJvdXRsaW5lIiwicGFkZGluZyIsInBvc2l0aW9uIiwiYm90dG9tIiwibGVmdCIsImNsYXNzTmFtZSIsImlkIiwicmVzaXplIiwib3ZlcmZsb3dfeSIsInZhbHVlIiwic3RyaW5nIiwicGxhY2Vob2xkZXIiLCJfdXBkYXRlVGV4dExhYmVsIiwidGV4dExhYmVsIiwiX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwiLCJwbGFjZWhvbGRlckxhYmVsIiwiZm9udCIsIkJpdG1hcEZvbnQiLCJfZm9udEZhbWlseSIsImZvbnRGYW1pbHkiLCJmb250U2l6ZSIsImZvbnRDb2xvciIsImhvcml6b250YWxBbGlnbiIsImNvbG9yIiwidG9DU1MiLCJIb3Jpem9udGFsQWxpZ24iLCJMRUZUIiwidGV4dEFsaWduIiwiQ0VOVEVSIiwiUklHSFQiLCJzdHlsZUVsIiwibGluZUhlaWdodCIsImlubmVySFRNTCIsIkJST1dTRVJfVFlQRV9FREdFIiwiaW1wbCIsImlucHV0TG9jayIsImNicyIsImNvbXBvc2l0aW9uU3RhcnQiLCJjb21wb3NpdGlvbkVuZCIsImVkaXRCb3hUZXh0Q2hhbmdlZCIsIm9uSW5wdXQiLCJvbkNsaWNrIiwiZSIsIm9uS2V5ZG93biIsImtleUNvZGUiLCJLRVkiLCJlbnRlciIsInN0b3BQcm9wYWdhdGlvbiIsImVkaXRCb3hFZGl0aW5nUmV0dXJuIiwidGFiIiwicHJldmVudERlZmF1bHQiLCJuZXh0Iiwib25CbHVyIiwiZWRpdEJveEVkaXRpbmdEaWRFbmRlZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBMEJBOzs7O0FBMUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLElBQU1BLEtBQUssR0FBR0MsT0FBTyxDQUFDLHNCQUFELENBQXJCOztBQUNBLElBQU1DLEtBQUssR0FBR0QsT0FBTyxDQUFDLHdCQUFELENBQXJCOztBQUNBLElBQU1FLEtBQUssR0FBR0YsT0FBTyxDQUFDLFNBQUQsQ0FBckI7O0FBQ0EsSUFBTUcsS0FBSyxHQUFHSCxPQUFPLENBQUMsWUFBRCxDQUFyQjs7QUFDQSxJQUFNSSxZQUFZLEdBQUdKLE9BQU8sQ0FBQyxnQkFBRCxDQUE1Qjs7QUFFQSxJQUFNSyxPQUFPLEdBQUdDLEVBQUUsQ0FBQ0QsT0FBbkI7QUFDQSxJQUFNRSxFQUFFLEdBQUdELEVBQUUsQ0FBQ0MsRUFBZDtBQUNBLElBQU1DLFNBQVMsR0FBR04sS0FBSyxDQUFDTSxTQUF4QjtBQUNBLElBQU1DLFNBQVMsR0FBR1AsS0FBSyxDQUFDTyxTQUF4QjtBQUNBLElBQU1DLGtCQUFrQixHQUFHUixLQUFLLENBQUNRLGtCQUFqQyxFQUVBOztBQUNBLElBQUlDLFFBQVEsR0FBRztBQUNYQyxFQUFBQSxXQUFXLEVBQUU7QUFERixDQUFmOztBQUlBLElBQUlOLEVBQUUsQ0FBQ08sR0FBSCxDQUFPQyxVQUFQLEtBQXNCUixFQUFFLENBQUNPLEdBQUgsQ0FBT0UsRUFBN0IsS0FDQ1QsRUFBRSxDQUFDTyxHQUFILENBQU9HLFdBQVAsS0FBdUJWLEVBQUUsQ0FBQ08sR0FBSCxDQUFPSSxtQkFBOUIsSUFDRFgsRUFBRSxDQUFDTyxHQUFILENBQU9HLFdBQVAsS0FBdUJWLEVBQUUsQ0FBQ08sR0FBSCxDQUFPSyxnQkFGOUIsQ0FBSixFQUVxRDtBQUNqRFAsRUFBQUEsUUFBUSxDQUFDQyxXQUFULEdBQXVCLElBQXZCO0FBQ0gsRUFFRDs7O0FBQ0EsSUFBTU8sVUFBVSxHQUFHLEdBQW5CO0FBQ0EsSUFBTUMsT0FBTyxHQUFHLEdBQWhCO0FBQ0EsSUFBTUMsWUFBWSxHQUFHLENBQXJCLEVBRUE7O0FBQ0EsSUFBSUMsU0FBUyxHQUFHLENBQWhCOztBQUNBLElBQUlDLEtBQUssR0FBR2pCLEVBQUUsQ0FBQ2tCLEVBQUgsRUFBWjs7QUFDQSxJQUFJQyxtQkFBbUIsR0FBRyxJQUExQixFQUVBOztBQUNBLElBQUlDLFdBQVcsR0FBRyxLQUFsQjtBQUNBLElBQUlDLFdBQVcsR0FBRyxLQUFsQjtBQUVBLElBQU1DLFNBQVMsR0FBR3ZCLE9BQU8sQ0FBQ3dCLFVBQTFCLEVBQ0M7QUFDQTs7QUFDRCxTQUFTQyxjQUFULEdBQTJCO0FBQ3ZCRixFQUFBQSxTQUFTLENBQUNHLElBQVYsQ0FBZSxJQUFmO0FBQ0EsT0FBS0MsTUFBTCxrQkFBMkIsRUFBRVYsU0FBN0I7QUFDQSxPQUFLVyxzQkFBTCxHQUE4QixJQUE5QjtBQUNBLE9BQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsT0FBS0MsV0FBTCxHQUFtQixLQUFuQixDQUx1QixDQU92Qjs7QUFDQSxPQUFLQyxTQUFMLEdBQWlCLElBQUlDLGVBQUosRUFBakI7QUFDQSxPQUFLQyxVQUFMLEdBQWtCLElBQUlELGVBQUosRUFBbEIsQ0FUdUIsQ0FVdkI7O0FBQ0EsT0FBS0UsSUFBTCxHQUFZLENBQVo7QUFDQSxPQUFLQyxJQUFMLEdBQVksQ0FBWjtBQUNBLE9BQUtDLElBQUwsR0FBWSxDQUFaO0FBQ0EsT0FBS0MsSUFBTCxHQUFZLENBQVo7QUFDQSxPQUFLQyxJQUFMLEdBQVksQ0FBWjtBQUNBLE9BQUtDLElBQUwsR0FBWSxDQUFaO0FBQ0EsT0FBS0MsRUFBTCxHQUFVLENBQVY7QUFDQSxPQUFLQyxFQUFMLEdBQVUsQ0FBVixDQWxCdUIsQ0FvQnZCOztBQUNBLE9BQUtDLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxPQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0EsT0FBS0MsV0FBTCxHQUFtQixJQUFuQixDQXZCdUIsQ0F5QnZCOztBQUNBLE9BQUtDLGVBQUwsR0FBdUIsRUFBdkIsQ0ExQnVCLENBNEJ2Qjs7QUFDQSxPQUFLQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsT0FBS0Msa0JBQUwsR0FBMEIsSUFBMUI7QUFDQSxPQUFLQyxtQkFBTCxHQUEyQixJQUEzQjtBQUNBLE9BQUtDLGVBQUwsR0FBdUIsSUFBdkI7QUFFQSxPQUFLQyxxQkFBTCxHQUE2QixJQUE3QjtBQUNBLE9BQUtDLHlCQUFMLEdBQWlDLElBQWpDO0FBQ0EsT0FBS0MsMEJBQUwsR0FBa0MsSUFBbEM7QUFDQSxPQUFLQyxzQkFBTCxHQUE4QixJQUE5QjtBQUNBLE9BQUtDLHNCQUFMLEdBQThCLElBQTlCO0FBQ0g7O0FBRURwRCxFQUFFLENBQUNxRCxNQUFILENBQVU5QixjQUFWLEVBQTBCRixTQUExQjtBQUNBdkIsT0FBTyxDQUFDd0IsVUFBUixHQUFxQkMsY0FBckI7QUFFQStCLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjaEMsY0FBYyxDQUFDaUMsU0FBN0IsRUFBd0M7QUFDcEM7QUFDQTtBQUNBQyxFQUFBQSxJQUhvQyxnQkFHOUJDLFFBSDhCLEVBR3BCO0FBQ1osUUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDWDtBQUNIOztBQUVELFNBQUtDLFNBQUwsR0FBaUJELFFBQWpCOztBQUVBLFFBQUlBLFFBQVEsQ0FBQ0UsU0FBVCxLQUF1QjNELFNBQVMsQ0FBQzRELEdBQXJDLEVBQTBDO0FBQ3RDLFdBQUtDLGVBQUw7QUFDSCxLQUZELE1BR0s7QUFDRCxXQUFLQyxZQUFMO0FBQ0g7O0FBQ0RsRSxJQUFBQSxZQUFZLENBQUNtRSxHQUFiLENBQWlCLElBQWpCO0FBQ0EsU0FBS0MsV0FBTCxDQUFpQlAsUUFBUSxDQUFDUSxRQUExQjs7QUFDQSxTQUFLQyxlQUFMOztBQUNBLFNBQUtDLHVCQUFMOztBQUNBLFNBQUtDLHNCQUFMOztBQUVBbEQsSUFBQUEsV0FBVyxHQUFHcEIsRUFBRSxDQUFDdUUsSUFBSCxDQUFRQyx1QkFBUixFQUFkO0FBQ0FuRCxJQUFBQSxXQUFXLEdBQUdyQixFQUFFLENBQUN1RSxJQUFILENBQVFFLHNCQUF0QjtBQUNILEdBeEJtQztBQTBCcENDLEVBQUFBLEtBMUJvQyxtQkEwQjNCO0FBQ0wsU0FBS0MscUJBQUw7O0FBQ0EsU0FBS0MsMkJBQUw7O0FBRUE5RSxJQUFBQSxZQUFZLENBQUMrRSxNQUFiLENBQW9CLElBQXBCLEVBSkssQ0FNTDs7QUFDQSxRQUFJMUQsbUJBQW1CLEtBQUssSUFBNUIsRUFBa0M7QUFDOUJBLE1BQUFBLG1CQUFtQixHQUFHLElBQXRCO0FBQ0g7QUFDSixHQXBDbUM7QUFzQ3BDMkQsRUFBQUEsTUF0Q29DLG9CQXNDMUIsQ0FDTjtBQUNILEdBeENtQztBQTBDcENaLEVBQUFBLFdBMUNvQyx1QkEwQ3ZCYSxLQTFDdUIsRUEwQ2hCO0FBQ2hCLFNBQUtuRCxLQUFMLENBQVd1QyxRQUFYLEdBQXNCWSxLQUF0QjtBQUNBakYsSUFBQUEsWUFBWSxDQUFDa0YsTUFBYjtBQUNILEdBN0NtQztBQStDcENDLEVBQUFBLE9BL0NvQyxtQkErQzNCQyxLQS9DMkIsRUErQ3BCQyxNQS9Db0IsRUErQ1o7QUFDcEIsUUFBSUMsSUFBSSxHQUFHLEtBQUt4RCxLQUFoQjtBQUNBd0QsSUFBQUEsSUFBSSxDQUFDQyxLQUFMLENBQVdILEtBQVgsR0FBbUJBLEtBQUssR0FBRyxJQUEzQjtBQUNBRSxJQUFBQSxJQUFJLENBQUNDLEtBQUwsQ0FBV0YsTUFBWCxHQUFvQkEsTUFBTSxHQUFHLElBQTdCO0FBQ0gsR0FuRG1DO0FBcURwQ0csRUFBQUEsWUFyRG9DLDBCQXFEcEI7QUFDWixRQUFJbkUsbUJBQW1CLElBQUlBLG1CQUFtQixLQUFLLElBQW5ELEVBQXlEO0FBQ3JEQSxNQUFBQSxtQkFBbUIsQ0FBQ29FLFFBQXBCLENBQTZCLEtBQTdCO0FBQ0g7O0FBQ0QsU0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBckUsSUFBQUEsbUJBQW1CLEdBQUcsSUFBdEI7O0FBQ0EsU0FBS3lDLFNBQUwsQ0FBZTZCLHNCQUFmOztBQUNBLFNBQUtDLFFBQUw7O0FBQ0EsU0FBSzlELEtBQUwsQ0FBVytELEtBQVgsR0FSWSxDQVFTOztBQUN4QixHQTlEbUM7QUFnRXBDQyxFQUFBQSxVQWhFb0Msd0JBZ0V0QjtBQUNWLFFBQUksS0FBS2hFLEtBQVQsRUFBZ0I7QUFDWixXQUFLQSxLQUFMLENBQVdpRSxJQUFYO0FBQ0g7QUFDSixHQXBFbUM7QUFzRXBDO0FBQ0E7QUFDQTdCLEVBQUFBLFlBeEVvQywwQkF3RXBCO0FBQ1osU0FBS25DLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxTQUFLRCxLQUFMLEdBQWFrRSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBYjtBQUNILEdBM0VtQztBQTZFcENoQyxFQUFBQSxlQTdFb0MsNkJBNkVqQjtBQUNmLFNBQUtsQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsU0FBS0QsS0FBTCxHQUFha0UsUUFBUSxDQUFDQyxhQUFULENBQXVCLFVBQXZCLENBQWI7QUFDSCxHQWhGbUM7QUFrRnBDekIsRUFBQUEsc0JBbEZvQyxvQ0FrRlY7QUFDdEJ0RSxJQUFBQSxFQUFFLENBQUNnRyxJQUFILENBQVFDLFNBQVIsQ0FBa0JDLFdBQWxCLENBQThCLEtBQUt0RSxLQUFuQztBQUNBa0UsSUFBQUEsUUFBUSxDQUFDSyxJQUFULENBQWNELFdBQWQsQ0FBMEIsS0FBS3ZFLHNCQUEvQjtBQUNILEdBckZtQztBQXVGcENpRCxFQUFBQSwyQkF2Rm9DLHlDQXVGTDtBQUMzQixRQUFJd0IsT0FBTyxHQUFHM0csS0FBSyxDQUFDNEcsUUFBTixDQUFlckcsRUFBRSxDQUFDZ0csSUFBSCxDQUFRQyxTQUF2QixFQUFrQyxLQUFLckUsS0FBdkMsQ0FBZDs7QUFDQSxRQUFJd0UsT0FBSixFQUFhO0FBQ1RwRyxNQUFBQSxFQUFFLENBQUNnRyxJQUFILENBQVFDLFNBQVIsQ0FBa0JLLFdBQWxCLENBQThCLEtBQUsxRSxLQUFuQztBQUNIOztBQUNELFFBQUkyRSxhQUFhLEdBQUc5RyxLQUFLLENBQUM0RyxRQUFOLENBQWVQLFFBQVEsQ0FBQ0ssSUFBeEIsRUFBOEIsS0FBS3hFLHNCQUFuQyxDQUFwQjs7QUFDQSxRQUFJNEUsYUFBSixFQUFtQjtBQUNmVCxNQUFBQSxRQUFRLENBQUNLLElBQVQsQ0FBY0csV0FBZCxDQUEwQixLQUFLM0Usc0JBQS9CO0FBQ0g7O0FBRUQsV0FBTyxLQUFLQyxLQUFaO0FBQ0EsV0FBTyxLQUFLRCxzQkFBWjtBQUNILEdBbkdtQztBQXFHcEMrRCxFQUFBQSxRQXJHb0Msc0JBcUd4QjtBQUNSLFNBQUtjLGFBQUw7O0FBQ0EsU0FBS0MsZ0JBQUw7O0FBQ0EsU0FBS0MsZ0JBQUw7O0FBQ0EsU0FBS0MsaUJBQUw7O0FBRUEsU0FBSy9FLEtBQUwsQ0FBV3lELEtBQVgsQ0FBaUJ1QixPQUFqQixHQUEyQixFQUEzQjs7QUFDQSxTQUFLaEQsU0FBTCxDQUFlaUQsV0FBZjs7QUFFQSxRQUFJN0csRUFBRSxDQUFDTyxHQUFILENBQU91RyxRQUFYLEVBQXFCO0FBQ2pCLFdBQUtDLGdCQUFMO0FBQ0g7QUFDSixHQWpIbUM7QUFtSHBDQyxFQUFBQSxRQW5Ib0Msc0JBbUh4QjtBQUNSLFFBQUk1QixJQUFJLEdBQUcsS0FBS3hELEtBQWhCO0FBRUF3RCxJQUFBQSxJQUFJLENBQUNDLEtBQUwsQ0FBV3VCLE9BQVgsR0FBcUIsTUFBckI7O0FBQ0EsU0FBS2hELFNBQUwsQ0FBZXFELFdBQWY7O0FBRUEsUUFBSWpILEVBQUUsQ0FBQ08sR0FBSCxDQUFPdUcsUUFBWCxFQUFxQjtBQUNqQixXQUFLSSxnQkFBTDtBQUNIO0FBQ0osR0E1SG1DO0FBOEhwQ0gsRUFBQUEsZ0JBOUhvQyw4QkE4SGhCO0FBQ2hCLFFBQUkvRyxFQUFFLENBQUNPLEdBQUgsQ0FBT0UsRUFBUCxLQUFjVCxFQUFFLENBQUNPLEdBQUgsQ0FBT0MsVUFBekIsRUFBcUM7QUFDakM7QUFDSDs7QUFFRCxRQUFJWSxXQUFKLEVBQWlCO0FBQ2JwQixNQUFBQSxFQUFFLENBQUN1RSxJQUFILENBQVE0QyxvQkFBUixDQUE2QixLQUE3QjtBQUNBbkgsTUFBQUEsRUFBRSxDQUFDb0gsTUFBSCxDQUFVQyxjQUFWO0FBQ0g7O0FBQ0QsUUFBSWhHLFdBQUosRUFBaUI7QUFDYnJCLE1BQUFBLEVBQUUsQ0FBQ3VFLElBQUgsQ0FBUStDLHFCQUFSLENBQThCLEtBQTlCO0FBQ0g7O0FBRUQsU0FBS0MsbUJBQUw7QUFDSCxHQTVJbUM7QUE4SXBDTCxFQUFBQSxnQkE5SW9DLDhCQThJaEI7QUFDaEIsUUFBSWxILEVBQUUsQ0FBQ08sR0FBSCxDQUFPRSxFQUFQLEtBQWNULEVBQUUsQ0FBQ08sR0FBSCxDQUFPQyxVQUF6QixFQUFxQztBQUNqQyxVQUFJYSxXQUFKLEVBQWlCO0FBQ2JyQixRQUFBQSxFQUFFLENBQUN1RSxJQUFILENBQVErQyxxQkFBUixDQUE4QixJQUE5QjtBQUNILE9BSGdDLENBSWpDOzs7QUFDQUUsTUFBQUEsVUFBVSxDQUFDLFlBQVk7QUFDbkIsWUFBSSxDQUFDckcsbUJBQUwsRUFBMEI7QUFDdEIsY0FBSUMsV0FBSixFQUFpQjtBQUNicEIsWUFBQUEsRUFBRSxDQUFDdUUsSUFBSCxDQUFRNEMsb0JBQVIsQ0FBNkIsSUFBN0I7QUFDSDtBQUNKO0FBQ0osT0FOUyxFQU1QdEcsVUFOTyxDQUFWO0FBT0gsS0FiZSxDQWVoQjs7O0FBQ0EsU0FBSzRHLGlCQUFMO0FBQ0gsR0EvSm1DO0FBaUtwQztBQUNBRixFQUFBQSxtQkFsS29DLGlDQWtLYjtBQUNuQixRQUFJRyxJQUFJLEdBQUcsSUFBWDtBQUNBRixJQUFBQSxVQUFVLENBQUMsWUFBVztBQUNsQixVQUFJRyxNQUFNLENBQUNDLE9BQVAsR0FBaUI5RyxPQUFyQixFQUE4QjtBQUMxQjRHLFFBQUFBLElBQUksQ0FBQzlGLEtBQUwsQ0FBV2lHLGNBQVgsQ0FBMEI7QUFBQ0MsVUFBQUEsS0FBSyxFQUFFLE9BQVI7QUFBaUJDLFVBQUFBLE1BQU0sRUFBRSxTQUF6QjtBQUFvQ0MsVUFBQUEsUUFBUSxFQUFFO0FBQTlDLFNBQTFCO0FBQ0g7QUFDSixLQUpTLEVBSVBuSCxVQUpPLENBQVY7QUFLSCxHQXpLbUM7QUEyS3BDNEcsRUFBQUEsaUJBM0tvQywrQkEyS2Y7QUFDakJELElBQUFBLFVBQVUsQ0FBQyxZQUFZO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBSWpILEdBQUcsR0FBR1AsRUFBRSxDQUFDTyxHQUFiOztBQUNBLFVBQUlBLEdBQUcsQ0FBQ0csV0FBSixLQUFvQkgsR0FBRyxDQUFDMEgsbUJBQXhCLElBQStDMUgsR0FBRyxDQUFDRSxFQUFKLEtBQVdGLEdBQUcsQ0FBQzJILE1BQWxFLEVBQTBFO0FBQ3RFUCxRQUFBQSxNQUFNLENBQUNRLEdBQVAsSUFBY1IsTUFBTSxDQUFDUSxHQUFQLENBQVdDLFFBQVgsQ0FBb0IsQ0FBcEIsRUFBdUIsQ0FBdkIsQ0FBZDtBQUNBO0FBQ0g7O0FBRURULE1BQUFBLE1BQU0sQ0FBQ1MsUUFBUCxDQUFnQixDQUFoQixFQUFtQixDQUFuQjtBQUNILEtBWlMsRUFZUHZILFVBWk8sQ0FBVjtBQWFILEdBekxtQztBQTJMcEMyRixFQUFBQSxhQTNMb0MsMkJBMkxuQjtBQUNiLFFBQUk2QixJQUFJLEdBQUcsS0FBS3pFLFNBQUwsQ0FBZXlFLElBQTFCO0FBQ0FBLElBQUFBLElBQUksQ0FBQ0MsY0FBTCxDQUFvQixLQUFLeEcsU0FBekI7QUFDQSxRQUFJeUcsUUFBUSxHQUFHLEtBQUt6RyxTQUFwQjtBQUNBLFFBQUkwRyxTQUFTLEdBQUdELFFBQVEsQ0FBQ0UsQ0FBekIsQ0FKYSxDQU1iOztBQUNBLFFBQUksS0FBS3hHLElBQUwsS0FBY3VHLFNBQVMsQ0FBQyxDQUFELENBQXZCLElBQThCLEtBQUt0RyxJQUFMLEtBQWNzRyxTQUFTLENBQUMsQ0FBRCxDQUFyRCxJQUNBLEtBQUtyRyxJQUFMLEtBQWNxRyxTQUFTLENBQUMsQ0FBRCxDQUR2QixJQUM4QixLQUFLcEcsSUFBTCxLQUFjb0csU0FBUyxDQUFDLENBQUQsQ0FEckQsSUFFQSxLQUFLbkcsSUFBTCxLQUFjbUcsU0FBUyxDQUFDLEVBQUQsQ0FGdkIsSUFFK0IsS0FBS2xHLElBQUwsS0FBY2tHLFNBQVMsQ0FBQyxFQUFELENBRnRELElBR0EsS0FBS2pHLEVBQUwsS0FBWThGLElBQUksQ0FBQ0ssWUFBTCxDQUFrQnhELEtBSDlCLElBR3VDLEtBQUsxQyxFQUFMLEtBQVk2RixJQUFJLENBQUNLLFlBQUwsQ0FBa0J2RCxNQUh6RSxFQUdpRjtBQUM3RTtBQUNILEtBWlksQ0FjYjs7O0FBQ0EsU0FBS2xELElBQUwsR0FBWXVHLFNBQVMsQ0FBQyxDQUFELENBQXJCO0FBQ0EsU0FBS3RHLElBQUwsR0FBWXNHLFNBQVMsQ0FBQyxDQUFELENBQXJCO0FBQ0EsU0FBS3JHLElBQUwsR0FBWXFHLFNBQVMsQ0FBQyxDQUFELENBQXJCO0FBQ0EsU0FBS3BHLElBQUwsR0FBWW9HLFNBQVMsQ0FBQyxDQUFELENBQXJCO0FBQ0EsU0FBS25HLElBQUwsR0FBWW1HLFNBQVMsQ0FBQyxFQUFELENBQXJCO0FBQ0EsU0FBS2xHLElBQUwsR0FBWWtHLFNBQVMsQ0FBQyxFQUFELENBQXJCO0FBQ0EsU0FBS2pHLEVBQUwsR0FBVThGLElBQUksQ0FBQ0ssWUFBTCxDQUFrQnhELEtBQTVCO0FBQ0EsU0FBSzFDLEVBQUwsR0FBVTZGLElBQUksQ0FBQ0ssWUFBTCxDQUFrQnZELE1BQTVCO0FBRUEsUUFBSXdELE1BQU0sR0FBRzNJLEVBQUUsQ0FBQ3VFLElBQUgsQ0FBUXFFLE9BQXJCO0FBQUEsUUFBOEJDLE1BQU0sR0FBRzdJLEVBQUUsQ0FBQ3VFLElBQUgsQ0FBUXVFLE9BQS9DO0FBQUEsUUFDSUMsUUFBUSxHQUFHL0ksRUFBRSxDQUFDdUUsSUFBSCxDQUFReUUsYUFEdkI7QUFBQSxRQUVJQyxHQUFHLEdBQUdqSixFQUFFLENBQUN1RSxJQUFILENBQVEyRSxpQkFGbEI7QUFJQWpJLElBQUFBLEtBQUssQ0FBQ2tJLENBQU4sR0FBVSxDQUFDZCxJQUFJLENBQUNlLFlBQUwsQ0FBa0JELENBQW5CLEdBQXVCLEtBQUs1RyxFQUF0QztBQUNBdEIsSUFBQUEsS0FBSyxDQUFDb0ksQ0FBTixHQUFVLENBQUNoQixJQUFJLENBQUNlLFlBQUwsQ0FBa0JDLENBQW5CLEdBQXVCLEtBQUs3RyxFQUF0Qzs7QUFFQVQsb0JBQUt1SCxTQUFMLENBQWVmLFFBQWYsRUFBeUJBLFFBQXpCLEVBQW1DdEgsS0FBbkMsRUEvQmEsQ0FpQ2I7OztBQUNBLFFBQUlzSSxTQUFKOztBQUNBLFFBQUlDLFNBQUosRUFBZTtBQUNYRCxNQUFBQSxTQUFTLEdBQUcsS0FBS3ZILFVBQUwsR0FBa0J1RyxRQUE5QjtBQUNILEtBRkQsTUFHSztBQUNELFVBQUlrQixNQUFNLEdBQUd6SixFQUFFLENBQUMwSixNQUFILENBQVVDLFVBQVYsQ0FBcUJ0QixJQUFyQixDQUFiO0FBQ0FvQixNQUFBQSxNQUFNLENBQUNHLHdCQUFQLENBQWdDLEtBQUs1SCxVQUFyQztBQUNBdUgsTUFBQUEsU0FBUyxHQUFHLEtBQUt2SCxVQUFqQjs7QUFDQUQsc0JBQUs4SCxHQUFMLENBQVNOLFNBQVQsRUFBb0JBLFNBQXBCLEVBQStCaEIsUUFBL0I7QUFDSDs7QUFHREksSUFBQUEsTUFBTSxJQUFJTSxHQUFWO0FBQ0FKLElBQUFBLE1BQU0sSUFBSUksR0FBVjtBQUVBLFFBQUloRCxTQUFTLEdBQUdqRyxFQUFFLENBQUNnRyxJQUFILENBQVFDLFNBQXhCO0FBQ0EsUUFBSTZELFVBQVUsR0FBR1AsU0FBUyxDQUFDZCxDQUEzQjtBQUNBLFFBQUlzQixDQUFDLEdBQUdELFVBQVUsQ0FBQyxDQUFELENBQVYsR0FBZ0JuQixNQUF4QjtBQUFBLFFBQWdDcUIsQ0FBQyxHQUFHRixVQUFVLENBQUMsQ0FBRCxDQUE5QztBQUFBLFFBQW1ERyxDQUFDLEdBQUdILFVBQVUsQ0FBQyxDQUFELENBQWpFO0FBQUEsUUFBc0VJLENBQUMsR0FBR0osVUFBVSxDQUFDLENBQUQsQ0FBVixHQUFnQmpCLE1BQTFGO0FBRUEsUUFBSXNCLE9BQU8sR0FBR2xFLFNBQVMsSUFBSUEsU0FBUyxDQUFDWixLQUFWLENBQWdCK0UsV0FBN0IsSUFBNENDLFFBQVEsQ0FBQ3BFLFNBQVMsQ0FBQ1osS0FBVixDQUFnQitFLFdBQWpCLENBQWxFO0FBQ0FELElBQUFBLE9BQU8sSUFBSXBCLFFBQVEsQ0FBQ0ksQ0FBVCxHQUFhRixHQUF4QjtBQUNBLFFBQUlxQixPQUFPLEdBQUdyRSxTQUFTLElBQUlBLFNBQVMsQ0FBQ1osS0FBVixDQUFnQmtGLGFBQTdCLElBQThDRixRQUFRLENBQUNwRSxTQUFTLENBQUNaLEtBQVYsQ0FBZ0JrRixhQUFqQixDQUFwRTtBQUNBRCxJQUFBQSxPQUFPLElBQUl2QixRQUFRLENBQUNNLENBQVQsR0FBYUosR0FBeEI7QUFDQSxRQUFJdUIsRUFBRSxHQUFHVixVQUFVLENBQUMsRUFBRCxDQUFWLEdBQWlCbkIsTUFBakIsR0FBMEJ3QixPQUFuQztBQUFBLFFBQTRDTSxFQUFFLEdBQUdYLFVBQVUsQ0FBQyxFQUFELENBQVYsR0FBaUJqQixNQUFqQixHQUEwQnlCLE9BQTNFOztBQUVBLFFBQUlqSyxRQUFRLENBQUNDLFdBQWIsRUFBMEI7QUFDdEIsV0FBSzJFLE9BQUwsQ0FBYW9ELElBQUksQ0FBQ25ELEtBQUwsR0FBYTZFLENBQTFCLEVBQTZCMUIsSUFBSSxDQUFDbEQsTUFBTCxHQUFjK0UsQ0FBM0M7QUFDQUgsTUFBQUEsQ0FBQyxHQUFHLENBQUo7QUFDQUcsTUFBQUEsQ0FBQyxHQUFHLENBQUo7QUFDSDs7QUFFRCxRQUFJOUUsSUFBSSxHQUFHLEtBQUt4RCxLQUFoQjtBQUNBLFFBQUk4SSxNQUFNLEdBQUcsWUFBWVgsQ0FBWixHQUFnQixHQUFoQixHQUFzQixDQUFDQyxDQUF2QixHQUEyQixHQUEzQixHQUFpQyxDQUFDQyxDQUFsQyxHQUFzQyxHQUF0QyxHQUE0Q0MsQ0FBNUMsR0FBZ0QsR0FBaEQsR0FBc0RNLEVBQXRELEdBQTJELEdBQTNELEdBQWlFLENBQUNDLEVBQWxFLEdBQXVFLEdBQXBGO0FBQ0FyRixJQUFBQSxJQUFJLENBQUNDLEtBQUwsQ0FBVyxXQUFYLElBQTBCcUYsTUFBMUI7QUFDQXRGLElBQUFBLElBQUksQ0FBQ0MsS0FBTCxDQUFXLG1CQUFYLElBQWtDcUYsTUFBbEM7QUFDQXRGLElBQUFBLElBQUksQ0FBQ0MsS0FBTCxDQUFXLGtCQUFYLElBQWlDLGNBQWpDO0FBQ0FELElBQUFBLElBQUksQ0FBQ0MsS0FBTCxDQUFXLDBCQUFYLElBQXlDLGNBQXpDO0FBQ0gsR0FsUW1DO0FBb1FwQztBQUNBO0FBQ0FxQixFQUFBQSxnQkF0UW9DLDhCQXNRaEI7QUFDaEIsUUFBSS9DLFFBQVEsR0FBRyxLQUFLQyxTQUFwQjtBQUFBLFFBQ0lDLFNBQVMsR0FBR0YsUUFBUSxDQUFDRSxTQUR6QjtBQUFBLFFBRUk4RyxTQUFTLEdBQUdoSCxRQUFRLENBQUNnSCxTQUZ6QjtBQUFBLFFBR0lDLFVBQVUsR0FBR2pILFFBQVEsQ0FBQ2lILFVBSDFCO0FBQUEsUUFJSXhGLElBQUksR0FBRyxLQUFLeEQsS0FKaEIsQ0FEZ0IsQ0FPaEI7O0FBQ0EsUUFBSSxLQUFLYSxVQUFMLEtBQW9Cb0IsU0FBcEIsSUFDQSxLQUFLbkIsVUFBTCxLQUFvQmlJLFNBRHBCLElBRUEsS0FBS2hJLFdBQUwsS0FBcUJpSSxVQUZ6QixFQUVxQztBQUNqQztBQUNILEtBWmUsQ0FjaEI7OztBQUNBLFNBQUtuSSxVQUFMLEdBQWtCb0IsU0FBbEI7QUFDQSxTQUFLbkIsVUFBTCxHQUFrQmlJLFNBQWxCO0FBQ0EsU0FBS2hJLFdBQUwsR0FBbUJpSSxVQUFuQixDQWpCZ0IsQ0FtQmhCOztBQUNBLFFBQUksS0FBSy9JLFdBQVQsRUFBc0I7QUFDbEI7QUFDQSxVQUFJZ0osY0FBYSxHQUFHLE1BQXBCOztBQUNBLFVBQUlGLFNBQVMsS0FBS3hLLFNBQVMsQ0FBQzJLLDJCQUE1QixFQUF5RDtBQUNyREQsUUFBQUEsY0FBYSxHQUFHLFdBQWhCO0FBQ0gsT0FGRCxNQUdLLElBQUlGLFNBQVMsS0FBS3hLLFNBQVMsQ0FBQzRLLGlCQUE1QixFQUErQztBQUNoREYsUUFBQUEsY0FBYSxHQUFHLFlBQWhCO0FBQ0g7O0FBQ0R6RixNQUFBQSxJQUFJLENBQUNDLEtBQUwsQ0FBV3dGLGFBQVgsR0FBMkJBLGNBQTNCO0FBQ0E7QUFDSCxLQS9CZSxDQWlDaEI7OztBQUNBLFFBQUlGLFNBQVMsS0FBS3hLLFNBQVMsQ0FBQzZLLFFBQTVCLEVBQXNDO0FBQ2xDNUYsTUFBQUEsSUFBSSxDQUFDNkYsSUFBTCxHQUFZLFVBQVo7QUFDQTtBQUNILEtBckNlLENBdUNoQjs7O0FBQ0EsUUFBSUEsSUFBSSxHQUFHN0YsSUFBSSxDQUFDNkYsSUFBaEI7O0FBQ0EsUUFBSXBILFNBQVMsS0FBSzNELFNBQVMsQ0FBQ2dMLFVBQTVCLEVBQXdDO0FBQ3BDRCxNQUFBQSxJQUFJLEdBQUcsT0FBUDtBQUNILEtBRkQsTUFFTyxJQUFHcEgsU0FBUyxLQUFLM0QsU0FBUyxDQUFDaUwsT0FBeEIsSUFBbUN0SCxTQUFTLEtBQUszRCxTQUFTLENBQUNrTCxPQUE5RCxFQUF1RTtBQUMxRUgsTUFBQUEsSUFBSSxHQUFHLFFBQVA7QUFDSCxLQUZNLE1BRUEsSUFBR3BILFNBQVMsS0FBSzNELFNBQVMsQ0FBQ21MLFlBQTNCLEVBQXlDO0FBQzVDSixNQUFBQSxJQUFJLEdBQUcsUUFBUDtBQUNBN0YsTUFBQUEsSUFBSSxDQUFDa0csT0FBTCxHQUFlLFFBQWY7QUFDSCxLQUhNLE1BR0EsSUFBR3pILFNBQVMsS0FBSzNELFNBQVMsQ0FBQ3FMLEdBQTNCLEVBQWdDO0FBQ25DTixNQUFBQSxJQUFJLEdBQUcsS0FBUDtBQUNILEtBRk0sTUFFQTtBQUNIQSxNQUFBQSxJQUFJLEdBQUcsTUFBUDs7QUFFQSxVQUFJTCxVQUFVLEtBQUt4SyxrQkFBa0IsQ0FBQ29MLE1BQXRDLEVBQThDO0FBQzFDUCxRQUFBQSxJQUFJLEdBQUcsUUFBUDtBQUNIO0FBQ0o7O0FBQ0Q3RixJQUFBQSxJQUFJLENBQUM2RixJQUFMLEdBQVlBLElBQVosQ0F6RGdCLENBMkRoQjs7QUFDQSxRQUFJSixhQUFhLEdBQUcsTUFBcEI7O0FBQ0EsUUFBSUYsU0FBUyxLQUFLeEssU0FBUyxDQUFDMkssMkJBQTVCLEVBQXlEO0FBQ3JERCxNQUFBQSxhQUFhLEdBQUcsV0FBaEI7QUFDSCxLQUZELE1BR0ssSUFBSUYsU0FBUyxLQUFLeEssU0FBUyxDQUFDNEssaUJBQTVCLEVBQStDO0FBQ2hERixNQUFBQSxhQUFhLEdBQUcsWUFBaEI7QUFDSDs7QUFDRHpGLElBQUFBLElBQUksQ0FBQ0MsS0FBTCxDQUFXd0YsYUFBWCxHQUEyQkEsYUFBM0I7QUFDSCxHQTFVbUM7QUE0VXBDcEUsRUFBQUEsZ0JBNVVvQyw4QkE0VWhCO0FBQ2hCLFFBQUlnRixTQUFTLEdBQUcsS0FBSzdILFNBQUwsQ0FBZTZILFNBQS9COztBQUNBLFFBQUdBLFNBQVMsR0FBRyxDQUFmLEVBQWtCO0FBQ2Q7QUFDQTtBQUNBQSxNQUFBQSxTQUFTLEdBQUcsS0FBWjtBQUNIOztBQUNELFNBQUs3SixLQUFMLENBQVc2SixTQUFYLEdBQXVCQSxTQUF2QjtBQUNILEdBcFZtQztBQXNWcEM7QUFDQTtBQUNBckgsRUFBQUEsZUF4Vm9DLDZCQXdWakI7QUFDZixRQUFJZ0IsSUFBSSxHQUFHLEtBQUt4RCxLQUFoQjtBQUNBd0QsSUFBQUEsSUFBSSxDQUFDQyxLQUFMLENBQVd1QixPQUFYLEdBQXFCLE1BQXJCO0FBQ0F4QixJQUFBQSxJQUFJLENBQUNDLEtBQUwsQ0FBV3FHLE1BQVgsR0FBb0IsQ0FBcEI7QUFDQXRHLElBQUFBLElBQUksQ0FBQ0MsS0FBTCxDQUFXc0csVUFBWCxHQUF3QixhQUF4QjtBQUNBdkcsSUFBQUEsSUFBSSxDQUFDQyxLQUFMLENBQVdILEtBQVgsR0FBbUIsTUFBbkI7QUFDQUUsSUFBQUEsSUFBSSxDQUFDQyxLQUFMLENBQVdGLE1BQVgsR0FBb0IsTUFBcEI7QUFDQUMsSUFBQUEsSUFBSSxDQUFDQyxLQUFMLENBQVd1RyxNQUFYLEdBQW9CLENBQXBCO0FBQ0F4RyxJQUFBQSxJQUFJLENBQUNDLEtBQUwsQ0FBV3dHLE9BQVgsR0FBcUIsUUFBckI7QUFDQXpHLElBQUFBLElBQUksQ0FBQ0MsS0FBTCxDQUFXeUcsT0FBWCxHQUFxQixHQUFyQjtBQUNBMUcsSUFBQUEsSUFBSSxDQUFDQyxLQUFMLENBQVd3RixhQUFYLEdBQTJCLFdBQTNCO0FBQ0F6RixJQUFBQSxJQUFJLENBQUNDLEtBQUwsQ0FBVzBHLFFBQVgsR0FBc0IsVUFBdEI7QUFDQTNHLElBQUFBLElBQUksQ0FBQ0MsS0FBTCxDQUFXMkcsTUFBWCxHQUFvQixLQUFwQjtBQUNBNUcsSUFBQUEsSUFBSSxDQUFDQyxLQUFMLENBQVc0RyxJQUFYLEdBQWtCbEwsWUFBWSxHQUFHLElBQWpDO0FBQ0FxRSxJQUFBQSxJQUFJLENBQUM4RyxTQUFMLEdBQWlCLGNBQWpCO0FBQ0E5RyxJQUFBQSxJQUFJLENBQUMrRyxFQUFMLEdBQVUsS0FBS3pLLE1BQWY7O0FBRUEsUUFBSSxDQUFDLEtBQUtHLFdBQVYsRUFBdUI7QUFDbkJ1RCxNQUFBQSxJQUFJLENBQUM2RixJQUFMLEdBQVksTUFBWjtBQUNBN0YsTUFBQUEsSUFBSSxDQUFDQyxLQUFMLENBQVcsaUJBQVgsSUFBZ0MsV0FBaEM7QUFDSCxLQUhELE1BSUs7QUFDREQsTUFBQUEsSUFBSSxDQUFDQyxLQUFMLENBQVcrRyxNQUFYLEdBQW9CLE1BQXBCO0FBQ0FoSCxNQUFBQSxJQUFJLENBQUNDLEtBQUwsQ0FBV2dILFVBQVgsR0FBd0IsUUFBeEI7QUFDSDs7QUFFRCxTQUFLMUssc0JBQUwsR0FBOEJtRSxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBOUI7QUFDSCxHQW5YbUM7QUFxWHBDWSxFQUFBQSxpQkFyWG9DLCtCQXFYZjtBQUNqQixRQUFJaEQsUUFBUSxHQUFHLEtBQUtDLFNBQXBCO0FBQUEsUUFDSXdCLElBQUksR0FBRyxLQUFLeEQsS0FEaEI7QUFHQXdELElBQUFBLElBQUksQ0FBQ2tILEtBQUwsR0FBYTNJLFFBQVEsQ0FBQzRJLE1BQXRCO0FBQ0FuSCxJQUFBQSxJQUFJLENBQUNvSCxXQUFMLEdBQW1CN0ksUUFBUSxDQUFDNkksV0FBNUI7O0FBRUEsU0FBS0MsZ0JBQUwsQ0FBc0I5SSxRQUFRLENBQUMrSSxTQUEvQjs7QUFDQSxTQUFLQyx1QkFBTCxDQUE2QmhKLFFBQVEsQ0FBQ2lKLGdCQUF0QztBQUNILEdBOVhtQztBQWdZcENILEVBQUFBLGdCQWhZb0MsNEJBZ1lsQkMsU0FoWWtCLEVBZ1lQO0FBQ3pCLFFBQUksQ0FBQ0EsU0FBTCxFQUFnQjtBQUNaO0FBQ0gsS0FId0IsQ0FJekI7OztBQUNBLFFBQUlHLElBQUksR0FBR0gsU0FBUyxDQUFDRyxJQUFyQjs7QUFDQSxRQUFJQSxJQUFJLElBQUksRUFBRUEsSUFBSSxZQUFZN00sRUFBRSxDQUFDOE0sVUFBckIsQ0FBWixFQUE4QztBQUMxQ0QsTUFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUNFLFdBQVo7QUFDSCxLQUZELE1BR0s7QUFDREYsTUFBQUEsSUFBSSxHQUFHSCxTQUFTLENBQUNNLFVBQWpCO0FBQ0gsS0FYd0IsQ0FhekI7OztBQUNBLFFBQUlDLFFBQVEsR0FBR1AsU0FBUyxDQUFDTyxRQUFWLEdBQXFCUCxTQUFTLENBQUNyRSxJQUFWLENBQWVRLE1BQW5ELENBZHlCLENBZ0J6Qjs7QUFDQSxRQUFJLEtBQUtoRyxjQUFMLEtBQXdCZ0ssSUFBeEIsSUFDRyxLQUFLL0osa0JBQUwsS0FBNEJtSyxRQUQvQixJQUVHLEtBQUtsSyxtQkFBTCxLQUE2QjJKLFNBQVMsQ0FBQ1EsU0FGMUMsSUFHRyxLQUFLbEssZUFBTCxLQUF5QjBKLFNBQVMsQ0FBQ1MsZUFIMUMsRUFHMkQ7QUFDbkQ7QUFDUCxLQXRCd0IsQ0F3QnpCOzs7QUFDQSxTQUFLdEssY0FBTCxHQUFzQmdLLElBQXRCO0FBQ0EsU0FBSy9KLGtCQUFMLEdBQTBCbUssUUFBMUI7QUFDQSxTQUFLbEssbUJBQUwsR0FBMkIySixTQUFTLENBQUNRLFNBQXJDO0FBQ0EsU0FBS2xLLGVBQUwsR0FBdUIwSixTQUFTLENBQUNTLGVBQWpDO0FBRUEsUUFBSS9ILElBQUksR0FBRyxLQUFLeEQsS0FBaEIsQ0E5QnlCLENBK0J6Qjs7QUFDQXdELElBQUFBLElBQUksQ0FBQ0MsS0FBTCxDQUFXNEgsUUFBWCxHQUF5QkEsUUFBekIsUUFoQ3lCLENBaUN6Qjs7QUFDQTdILElBQUFBLElBQUksQ0FBQ0MsS0FBTCxDQUFXK0gsS0FBWCxHQUFtQlYsU0FBUyxDQUFDckUsSUFBVixDQUFlK0UsS0FBZixDQUFxQkMsS0FBckIsRUFBbkIsQ0FsQ3lCLENBbUN6Qjs7QUFDQWpJLElBQUFBLElBQUksQ0FBQ0MsS0FBTCxDQUFXMkgsVUFBWCxHQUF3QkgsSUFBeEIsQ0FwQ3lCLENBcUN6Qjs7QUFDQSxZQUFPSCxTQUFTLENBQUNTLGVBQWpCO0FBQ0ksV0FBS3ROLEtBQUssQ0FBQ3lOLGVBQU4sQ0FBc0JDLElBQTNCO0FBQ0luSSxRQUFBQSxJQUFJLENBQUNDLEtBQUwsQ0FBV21JLFNBQVgsR0FBdUIsTUFBdkI7QUFDQTs7QUFDSixXQUFLM04sS0FBSyxDQUFDeU4sZUFBTixDQUFzQkcsTUFBM0I7QUFDSXJJLFFBQUFBLElBQUksQ0FBQ0MsS0FBTCxDQUFXbUksU0FBWCxHQUF1QixRQUF2QjtBQUNBOztBQUNKLFdBQUszTixLQUFLLENBQUN5TixlQUFOLENBQXNCSSxLQUEzQjtBQUNJdEksUUFBQUEsSUFBSSxDQUFDQyxLQUFMLENBQVdtSSxTQUFYLEdBQXVCLE9BQXZCO0FBQ0E7QUFUUixLQXRDeUIsQ0FpRHpCO0FBQ0E7O0FBQ0gsR0FuYm1DO0FBcWJwQ2IsRUFBQUEsdUJBcmJvQyxtQ0FxYlhDLGdCQXJiVyxFQXFiTztBQUN2QyxRQUFJLENBQUNBLGdCQUFMLEVBQXVCO0FBQ25CO0FBQ0gsS0FIc0MsQ0FLdkM7OztBQUNBLFFBQUlDLElBQUksR0FBR0QsZ0JBQWdCLENBQUNDLElBQTVCOztBQUNBLFFBQUlBLElBQUksSUFBSSxFQUFFQSxJQUFJLFlBQVk3TSxFQUFFLENBQUM4TSxVQUFyQixDQUFaLEVBQThDO0FBQzFDRCxNQUFBQSxJQUFJLEdBQUdELGdCQUFnQixDQUFDQyxJQUFqQixDQUFzQkUsV0FBN0I7QUFDSCxLQUZELE1BR0s7QUFDREYsTUFBQUEsSUFBSSxHQUFHRCxnQkFBZ0IsQ0FBQ0ksVUFBeEI7QUFDSCxLQVpzQyxDQWN2Qzs7O0FBQ0EsUUFBSUMsUUFBUSxHQUFHTCxnQkFBZ0IsQ0FBQ0ssUUFBakIsR0FBNEJMLGdCQUFnQixDQUFDdkUsSUFBakIsQ0FBc0JRLE1BQWpFLENBZnVDLENBaUJ2Qzs7QUFDQSxRQUFJLEtBQUs1RixxQkFBTCxLQUErQjRKLElBQS9CLElBQ0csS0FBSzNKLHlCQUFMLEtBQW1DK0osUUFEdEMsSUFFRyxLQUFLOUosMEJBQUwsS0FBb0N5SixnQkFBZ0IsQ0FBQ00sU0FGeEQsSUFHRyxLQUFLOUosc0JBQUwsS0FBZ0N3SixnQkFBZ0IsQ0FBQ08sZUFIcEQsSUFJRyxLQUFLOUosc0JBQUwsS0FBZ0N1SixnQkFBZ0IsQ0FBQ0ssUUFKeEQsRUFJa0U7QUFDMUQ7QUFDUCxLQXhCc0MsQ0EwQnZDOzs7QUFDQSxTQUFLaEsscUJBQUwsR0FBNkI0SixJQUE3QjtBQUNBLFNBQUszSix5QkFBTCxHQUFpQytKLFFBQWpDO0FBQ0EsU0FBSzlKLDBCQUFMLEdBQWtDeUosZ0JBQWdCLENBQUNNLFNBQW5EO0FBQ0EsU0FBSzlKLHNCQUFMLEdBQThCd0osZ0JBQWdCLENBQUNPLGVBQS9DO0FBQ0EsU0FBSzlKLHNCQUFMLEdBQThCdUosZ0JBQWdCLENBQUNLLFFBQS9DO0FBRUEsUUFBSVUsT0FBTyxHQUFHLEtBQUtoTSxzQkFBbkIsQ0FqQ3VDLENBbUN2Qzs7QUFDQSxRQUFJdUwsU0FBUyxHQUFHTixnQkFBZ0IsQ0FBQ3ZFLElBQWpCLENBQXNCK0UsS0FBdEIsQ0FBNEJDLEtBQTVCLEVBQWhCLENBcEN1QyxDQXFDdkM7O0FBQ0EsUUFBSU8sVUFBVSxHQUFHaEIsZ0JBQWdCLENBQUNLLFFBQWxDLENBdEN1QyxDQXNDTTtBQUM3Qzs7QUFDQSxRQUFJRSxlQUFKOztBQUNBLFlBQVFQLGdCQUFnQixDQUFDTyxlQUF6QjtBQUNJLFdBQUt0TixLQUFLLENBQUN5TixlQUFOLENBQXNCQyxJQUEzQjtBQUNJSixRQUFBQSxlQUFlLEdBQUcsTUFBbEI7QUFDQTs7QUFDSixXQUFLdE4sS0FBSyxDQUFDeU4sZUFBTixDQUFzQkcsTUFBM0I7QUFDSU4sUUFBQUEsZUFBZSxHQUFHLFFBQWxCO0FBQ0E7O0FBQ0osV0FBS3ROLEtBQUssQ0FBQ3lOLGVBQU4sQ0FBc0JJLEtBQTNCO0FBQ0lQLFFBQUFBLGVBQWUsR0FBRyxPQUFsQjtBQUNBO0FBVFI7O0FBWUFRLElBQUFBLE9BQU8sQ0FBQ0UsU0FBUixHQUFvQixNQUFJLEtBQUtuTSxNQUFULHFDQUErQyxLQUFLQSxNQUFwRCw0QkFBaUYsS0FBS0EsTUFBdEYsMkVBQ3NCbUwsSUFEdEIscUJBQzBDSSxRQUQxQyxtQkFDZ0VDLFNBRGhFLHVCQUMyRlUsVUFEM0Ysd0JBQ3dIVCxlQUR4SCxRQUFwQixDQXJEdUMsQ0F1RHZDO0FBQ0E7O0FBQ0EsUUFBSW5OLEVBQUUsQ0FBQ08sR0FBSCxDQUFPRyxXQUFQLEtBQXVCVixFQUFFLENBQUNPLEdBQUgsQ0FBT3VOLGlCQUFsQyxFQUFxRDtBQUNqREgsTUFBQUEsT0FBTyxDQUFDRSxTQUFSLFVBQXlCLEtBQUtuTSxNQUE5QjtBQUNIO0FBQ0osR0FqZm1DO0FBbWZwQztBQUNBO0FBQ0EyQyxFQUFBQSx1QkFyZm9DLHFDQXFmVDtBQUN2QixRQUFJMEosSUFBSSxHQUFHLElBQVg7QUFBQSxRQUNJM0ksSUFBSSxHQUFHLEtBQUt4RCxLQURoQjtBQUFBLFFBRUlvTSxTQUFTLEdBQUcsS0FGaEI7QUFBQSxRQUdJQyxHQUFHLEdBQUcsS0FBS3JMLGVBSGY7O0FBS0FxTCxJQUFBQSxHQUFHLENBQUNDLGdCQUFKLEdBQXVCLFlBQVk7QUFDL0JGLE1BQUFBLFNBQVMsR0FBRyxJQUFaO0FBQ0gsS0FGRDs7QUFJQUMsSUFBQUEsR0FBRyxDQUFDRSxjQUFKLEdBQXFCLFlBQVk7QUFDN0JILE1BQUFBLFNBQVMsR0FBRyxLQUFaOztBQUNBRCxNQUFBQSxJQUFJLENBQUNuSyxTQUFMLENBQWV3SyxrQkFBZixDQUFrQ2hKLElBQUksQ0FBQ2tILEtBQXZDO0FBQ0gsS0FIRDs7QUFLQTJCLElBQUFBLEdBQUcsQ0FBQ0ksT0FBSixHQUFjLFlBQVk7QUFDdEIsVUFBSUwsU0FBSixFQUFlO0FBQ1g7QUFDSDs7QUFDREQsTUFBQUEsSUFBSSxDQUFDbkssU0FBTCxDQUFld0ssa0JBQWYsQ0FBa0NoSixJQUFJLENBQUNrSCxLQUF2QztBQUNILEtBTEQsQ0FmdUIsQ0FzQnZCO0FBQ0E7QUFDQTs7O0FBQ0EyQixJQUFBQSxHQUFHLENBQUNLLE9BQUosR0FBYyxVQUFVQyxDQUFWLEVBQWE7QUFDdkI7QUFDQSxVQUFJUixJQUFJLENBQUN2SSxRQUFULEVBQW1CO0FBQ2YsWUFBSXhGLEVBQUUsQ0FBQ08sR0FBSCxDQUFPdUcsUUFBWCxFQUFxQjtBQUNqQmlILFVBQUFBLElBQUksQ0FBQ3hHLG1CQUFMO0FBQ0g7QUFDSjtBQUNKLEtBUEQ7O0FBU0EwRyxJQUFBQSxHQUFHLENBQUNPLFNBQUosR0FBZ0IsVUFBVUQsQ0FBVixFQUFhO0FBQ3pCLFVBQUlBLENBQUMsQ0FBQ0UsT0FBRixLQUFjOU8sS0FBSyxDQUFDK08sR0FBTixDQUFVQyxLQUE1QixFQUFtQztBQUMvQkosUUFBQUEsQ0FBQyxDQUFDSyxlQUFGOztBQUNBYixRQUFBQSxJQUFJLENBQUNuSyxTQUFMLENBQWVpTCxvQkFBZjs7QUFFQSxZQUFJLENBQUNkLElBQUksQ0FBQ2xNLFdBQVYsRUFBdUI7QUFDbkJ1RCxVQUFBQSxJQUFJLENBQUNTLElBQUw7QUFDSDtBQUNKLE9BUEQsTUFRSyxJQUFJMEksQ0FBQyxDQUFDRSxPQUFGLEtBQWM5TyxLQUFLLENBQUMrTyxHQUFOLENBQVVJLEdBQTVCLEVBQWlDO0FBQ2xDUCxRQUFBQSxDQUFDLENBQUNLLGVBQUY7QUFDQUwsUUFBQUEsQ0FBQyxDQUFDUSxjQUFGO0FBRUFqUCxRQUFBQSxZQUFZLENBQUNrUCxJQUFiLENBQWtCakIsSUFBbEI7QUFDSDtBQUNKLEtBZkQ7O0FBaUJBRSxJQUFBQSxHQUFHLENBQUNnQixNQUFKLEdBQWEsWUFBWTtBQUNyQmxCLE1BQUFBLElBQUksQ0FBQ3ZJLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQXJFLE1BQUFBLG1CQUFtQixHQUFHLElBQXRCOztBQUNBNE0sTUFBQUEsSUFBSSxDQUFDL0csUUFBTDs7QUFDQStHLE1BQUFBLElBQUksQ0FBQ25LLFNBQUwsQ0FBZXNMLHNCQUFmO0FBQ0gsS0FMRDs7QUFRQTlKLElBQUFBLElBQUksQ0FBQytKLGdCQUFMLENBQXNCLGtCQUF0QixFQUEwQ2xCLEdBQUcsQ0FBQ0MsZ0JBQTlDO0FBQ0E5SSxJQUFBQSxJQUFJLENBQUMrSixnQkFBTCxDQUFzQixnQkFBdEIsRUFBd0NsQixHQUFHLENBQUNFLGNBQTVDO0FBQ0EvSSxJQUFBQSxJQUFJLENBQUMrSixnQkFBTCxDQUFzQixPQUF0QixFQUErQmxCLEdBQUcsQ0FBQ0ksT0FBbkM7QUFDQWpKLElBQUFBLElBQUksQ0FBQytKLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDbEIsR0FBRyxDQUFDTyxTQUFyQztBQUNBcEosSUFBQUEsSUFBSSxDQUFDK0osZ0JBQUwsQ0FBc0IsTUFBdEIsRUFBOEJsQixHQUFHLENBQUNnQixNQUFsQztBQUNBN0osSUFBQUEsSUFBSSxDQUFDK0osZ0JBQUwsQ0FBc0IsWUFBdEIsRUFBb0NsQixHQUFHLENBQUNLLE9BQXhDO0FBQ0gsR0F0akJtQztBQXdqQnBDM0osRUFBQUEscUJBeGpCb0MsbUNBd2pCWDtBQUNyQixRQUFJUyxJQUFJLEdBQUcsS0FBS3hELEtBQWhCO0FBQUEsUUFDSXFNLEdBQUcsR0FBRyxLQUFLckwsZUFEZjtBQUdBd0MsSUFBQUEsSUFBSSxDQUFDZ0ssbUJBQUwsQ0FBeUIsa0JBQXpCLEVBQTZDbkIsR0FBRyxDQUFDQyxnQkFBakQ7QUFDQTlJLElBQUFBLElBQUksQ0FBQ2dLLG1CQUFMLENBQXlCLGdCQUF6QixFQUEyQ25CLEdBQUcsQ0FBQ0UsY0FBL0M7QUFDQS9JLElBQUFBLElBQUksQ0FBQ2dLLG1CQUFMLENBQXlCLE9BQXpCLEVBQWtDbkIsR0FBRyxDQUFDSSxPQUF0QztBQUNBakosSUFBQUEsSUFBSSxDQUFDZ0ssbUJBQUwsQ0FBeUIsU0FBekIsRUFBb0NuQixHQUFHLENBQUNPLFNBQXhDO0FBQ0FwSixJQUFBQSxJQUFJLENBQUNnSyxtQkFBTCxDQUF5QixNQUF6QixFQUFpQ25CLEdBQUcsQ0FBQ2dCLE1BQXJDO0FBQ0E3SixJQUFBQSxJQUFJLENBQUNnSyxtQkFBTCxDQUF5QixZQUF6QixFQUF1Q25CLEdBQUcsQ0FBQ0ssT0FBM0M7QUFFQUwsSUFBQUEsR0FBRyxDQUFDQyxnQkFBSixHQUF1QixJQUF2QjtBQUNBRCxJQUFBQSxHQUFHLENBQUNFLGNBQUosR0FBcUIsSUFBckI7QUFDQUYsSUFBQUEsR0FBRyxDQUFDSSxPQUFKLEdBQWMsSUFBZDtBQUNBSixJQUFBQSxHQUFHLENBQUNPLFNBQUosR0FBZ0IsSUFBaEI7QUFDQVAsSUFBQUEsR0FBRyxDQUFDZ0IsTUFBSixHQUFhLElBQWI7QUFDQWhCLElBQUFBLEdBQUcsQ0FBQ0ssT0FBSixHQUFjLElBQWQ7QUFDSDtBQXprQm1DLENBQXhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbmltcG9ydCBNYXQ0IGZyb20gJy4uLy4uL3ZhbHVlLXR5cGVzL21hdDQnO1xuXG5jb25zdCB1dGlscyA9IHJlcXVpcmUoJy4uLy4uL3BsYXRmb3JtL3V0aWxzJyk7XG5jb25zdCBtYWNybyA9IHJlcXVpcmUoJy4uLy4uL3BsYXRmb3JtL0NDTWFjcm8nKTtcbmNvbnN0IFR5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xuY29uc3QgTGFiZWwgPSByZXF1aXJlKCcuLi9DQ0xhYmVsJyk7XG5jb25zdCB0YWJJbmRleFV0aWwgPSByZXF1aXJlKCcuL3RhYkluZGV4VXRpbCcpO1xuXG5jb25zdCBFZGl0Qm94ID0gY2MuRWRpdEJveDtcbmNvbnN0IGpzID0gY2MuanM7XG5jb25zdCBJbnB1dE1vZGUgPSBUeXBlcy5JbnB1dE1vZGU7XG5jb25zdCBJbnB1dEZsYWcgPSBUeXBlcy5JbnB1dEZsYWc7XG5jb25zdCBLZXlib2FyZFJldHVyblR5cGUgPSBUeXBlcy5LZXlib2FyZFJldHVyblR5cGU7XG5cbi8vIHBvbHlmaWxsXG5sZXQgcG9seWZpbGwgPSB7XG4gICAgem9vbUludmFsaWQ6IGZhbHNlXG59O1xuXG5pZiAoY2Muc3lzLk9TX0FORFJPSUQgPT09IGNjLnN5cy5vcyAmJlxuICAgIChjYy5zeXMuYnJvd3NlclR5cGUgPT09IGNjLnN5cy5CUk9XU0VSX1RZUEVfU09VR09VIHx8XG4gICAgY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFXzM2MCkpIHtcbiAgICBwb2x5ZmlsbC56b29tSW52YWxpZCA9IHRydWU7XG59XG5cbi8vIGh0dHBzOi8vc2VnbWVudGZhdWx0LmNvbS9xLzEwMTAwMDAwMDI5MTQ2MTBcbmNvbnN0IERFTEFZX1RJTUUgPSA4MDA7XG5jb25zdCBTQ1JPTExZID0gMTAwO1xuY29uc3QgTEVGVF9QQURESU5HID0gMjtcblxuLy8gcHJpdmF0ZSBzdGF0aWMgcHJvcGVydHlcbmxldCBfZG9tQ291bnQgPSAwO1xubGV0IF92ZWMzID0gY2MudjMoKTtcbmxldCBfY3VycmVudEVkaXRCb3hJbXBsID0gbnVsbDtcblxuLy8gb24gbW9iaWxlXG5sZXQgX2Z1bGxzY3JlZW4gPSBmYWxzZTtcbmxldCBfYXV0b1Jlc2l6ZSA9IGZhbHNlO1xuXG5jb25zdCBCYXNlQ2xhc3MgPSBFZGl0Qm94Ll9JbXBsQ2xhc3M7XG4gLy8gVGhpcyBpcyBhbiBhZGFwdGVyIGZvciBFZGl0Qm94SW1wbCBvbiB3ZWIgcGxhdGZvcm0uXG4gLy8gRm9yIG1vcmUgYWRhcHRlcnMgb24gb3RoZXIgcGxhdGZvcm1zLCBwbGVhc2UgaW5oZXJpdCBmcm9tIEVkaXRCb3hJbXBsQmFzZSBhbmQgaW1wbGVtZW50IHRoZSBpbnRlcmZhY2UuXG5mdW5jdGlvbiBXZWJFZGl0Qm94SW1wbCAoKSB7XG4gICAgQmFzZUNsYXNzLmNhbGwodGhpcyk7XG4gICAgdGhpcy5fZG9tSWQgPSBgRWRpdEJveElkXyR7KytfZG9tQ291bnR9YDtcbiAgICB0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQgPSBudWxsO1xuICAgIHRoaXMuX2VsZW0gPSBudWxsO1xuICAgIHRoaXMuX2lzVGV4dEFyZWEgPSBmYWxzZTtcblxuICAgIC8vIG1hdHJpeFxuICAgIHRoaXMuX3dvcmxkTWF0ID0gbmV3IE1hdDQoKTtcbiAgICB0aGlzLl9jYW1lcmFNYXQgPSBuZXcgTWF0NCgpO1xuICAgIC8vIG1hdHJpeCBjYWNoZVxuICAgIHRoaXMuX20wMCA9IDA7XG4gICAgdGhpcy5fbTAxID0gMDtcbiAgICB0aGlzLl9tMDQgPSAwO1xuICAgIHRoaXMuX20wNSA9IDA7XG4gICAgdGhpcy5fbTEyID0gMDtcbiAgICB0aGlzLl9tMTMgPSAwO1xuICAgIHRoaXMuX3cgPSAwO1xuICAgIHRoaXMuX2ggPSAwO1xuXG4gICAgLy8gaW5wdXRUeXBlIGNhY2hlXG4gICAgdGhpcy5faW5wdXRNb2RlID0gbnVsbDtcbiAgICB0aGlzLl9pbnB1dEZsYWcgPSBudWxsO1xuICAgIHRoaXMuX3JldHVyblR5cGUgPSBudWxsO1xuXG4gICAgLy8gZXZlbnQgbGlzdGVuZXJzXG4gICAgdGhpcy5fZXZlbnRMaXN0ZW5lcnMgPSB7fTtcblxuICAgIC8vIHVwZGF0ZSBzdHlsZSBzaGVldCBjYWNoZVxuICAgIHRoaXMuX3RleHRMYWJlbEZvbnQgPSBudWxsO1xuICAgIHRoaXMuX3RleHRMYWJlbEZvbnRTaXplID0gbnVsbDtcbiAgICB0aGlzLl90ZXh0TGFiZWxGb250Q29sb3IgPSBudWxsO1xuICAgIHRoaXMuX3RleHRMYWJlbEFsaWduID0gbnVsbDtcblxuICAgIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxGb250ID0gbnVsbDtcbiAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udFNpemUgPSBudWxsO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxGb250Q29sb3IgPSBudWxsO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxBbGlnbiA9IG51bGw7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXJMaW5lSGVpZ2h0ID0gbnVsbDtcbn1cblxuanMuZXh0ZW5kKFdlYkVkaXRCb3hJbXBsLCBCYXNlQ2xhc3MpO1xuRWRpdEJveC5fSW1wbENsYXNzID0gV2ViRWRpdEJveEltcGw7XG5cbk9iamVjdC5hc3NpZ24oV2ViRWRpdEJveEltcGwucHJvdG90eXBlLCB7XG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gaW1wbGVtZW50IEVkaXRCb3hJbXBsQmFzZSBpbnRlcmZhY2VcbiAgICBpbml0IChkZWxlZ2F0ZSkge1xuICAgICAgICBpZiAoIWRlbGVnYXRlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pbnB1dE1vZGUgPT09IElucHV0TW9kZS5BTlkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVRleHRBcmVhKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVJbnB1dCgpO1xuICAgICAgICB9XG4gICAgICAgIHRhYkluZGV4VXRpbC5hZGQodGhpcyk7XG4gICAgICAgIHRoaXMuc2V0VGFiSW5kZXgoZGVsZWdhdGUudGFiSW5kZXgpO1xuICAgICAgICB0aGlzLl9pbml0U3R5bGVTaGVldCgpO1xuICAgICAgICB0aGlzLl9yZWdpc3RlckV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuX2FkZERvbVRvR2FtZUNvbnRhaW5lcigpO1xuXG4gICAgICAgIF9mdWxsc2NyZWVuID0gY2Mudmlldy5pc0F1dG9GdWxsU2NyZWVuRW5hYmxlZCgpO1xuICAgICAgICBfYXV0b1Jlc2l6ZSA9IGNjLnZpZXcuX3Jlc2l6ZVdpdGhCcm93c2VyU2l6ZTtcbiAgICB9LFxuXG4gICAgY2xlYXIgKCkge1xuICAgICAgICB0aGlzLl9yZW1vdmVFdmVudExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLl9yZW1vdmVEb21Gcm9tR2FtZUNvbnRhaW5lcigpO1xuXG4gICAgICAgIHRhYkluZGV4VXRpbC5yZW1vdmUodGhpcyk7XG5cbiAgICAgICAgLy8gY2xlYXIgd2hpbGUgZWRpdGluZ1xuICAgICAgICBpZiAoX2N1cnJlbnRFZGl0Qm94SW1wbCA9PT0gdGhpcykge1xuICAgICAgICAgICAgX2N1cnJlbnRFZGl0Qm94SW1wbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlICgpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZy4uLlxuICAgIH0sXG5cbiAgICBzZXRUYWJJbmRleCAoaW5kZXgpIHtcbiAgICAgICAgdGhpcy5fZWxlbS50YWJJbmRleCA9IGluZGV4O1xuICAgICAgICB0YWJJbmRleFV0aWwucmVzb3J0KCk7XG4gICAgfSxcblxuICAgIHNldFNpemUgKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lbGVtO1xuICAgICAgICBlbGVtLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuICAgICAgICBlbGVtLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XG4gICAgfSxcblxuICAgIGJlZ2luRWRpdGluZyAoKSB7XG4gICAgICAgIGlmIChfY3VycmVudEVkaXRCb3hJbXBsICYmIF9jdXJyZW50RWRpdEJveEltcGwgIT09IHRoaXMpIHtcbiAgICAgICAgICAgIF9jdXJyZW50RWRpdEJveEltcGwuc2V0Rm9jdXMoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2VkaXRpbmcgPSB0cnVlO1xuICAgICAgICBfY3VycmVudEVkaXRCb3hJbXBsID0gdGhpcztcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUuZWRpdEJveEVkaXRpbmdEaWRCZWdhbigpO1xuICAgICAgICB0aGlzLl9zaG93RG9tKCk7XG4gICAgICAgIHRoaXMuX2VsZW0uZm9jdXMoKTsgIC8vIHNldCBmb2N1c1xuICAgIH0sXG5cbiAgICBlbmRFZGl0aW5nICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VsZW0pIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW0uYmx1cigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gaW1wbGVtZW50IGRvbSBpbnB1dFxuICAgIF9jcmVhdGVJbnB1dCAoKSB7XG4gICAgICAgIHRoaXMuX2lzVGV4dEFyZWEgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgfSxcblxuICAgIF9jcmVhdGVUZXh0QXJlYSAoKSB7XG4gICAgICAgIHRoaXMuX2lzVGV4dEFyZWEgPSB0cnVlO1xuICAgICAgICB0aGlzLl9lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICB9LFxuXG4gICAgX2FkZERvbVRvR2FtZUNvbnRhaW5lciAoKSB7XG4gICAgICAgIGNjLmdhbWUuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX2VsZW0pO1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRoaXMuX3BsYWNlaG9sZGVyU3R5bGVTaGVldCk7XG4gICAgfSxcblxuICAgIF9yZW1vdmVEb21Gcm9tR2FtZUNvbnRhaW5lciAoKSB7XG4gICAgICAgIGxldCBoYXNFbGVtID0gdXRpbHMuY29udGFpbnMoY2MuZ2FtZS5jb250YWluZXIsIHRoaXMuX2VsZW0pO1xuICAgICAgICBpZiAoaGFzRWxlbSkge1xuICAgICAgICAgICAgY2MuZ2FtZS5jb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5fZWxlbSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGhhc1N0eWxlU2hlZXQgPSB1dGlscy5jb250YWlucyhkb2N1bWVudC5oZWFkLCB0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQpO1xuICAgICAgICBpZiAoaGFzU3R5bGVTaGVldCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZCh0aGlzLl9wbGFjZWhvbGRlclN0eWxlU2hlZXQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBkZWxldGUgdGhpcy5fZWxlbTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX3BsYWNlaG9sZGVyU3R5bGVTaGVldDtcbiAgICB9LFxuXG4gICAgX3Nob3dEb20gKCkge1xuICAgICAgICB0aGlzLl91cGRhdGVNYXRyaXgoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlTWF4TGVuZ3RoKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUlucHV0VHlwZSgpO1xuICAgICAgICB0aGlzLl91cGRhdGVTdHlsZVNoZWV0KCk7XG5cbiAgICAgICAgdGhpcy5fZWxlbS5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgIHRoaXMuX2RlbGVnYXRlLl9oaWRlTGFiZWxzKCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoY2Muc3lzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9zaG93RG9tT25Nb2JpbGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaGlkZURvbSAoKSB7XG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5fZWxlbTtcblxuICAgICAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHRoaXMuX2RlbGVnYXRlLl9zaG93TGFiZWxzKCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoY2Muc3lzLmlzTW9iaWxlKSB7XG4gICAgICAgICAgICB0aGlzLl9oaWRlRG9tT25Nb2JpbGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2hvd0RvbU9uTW9iaWxlICgpIHtcbiAgICAgICAgaWYgKGNjLnN5cy5vcyAhPT0gY2Muc3lzLk9TX0FORFJPSUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKF9mdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICBjYy52aWV3LmVuYWJsZUF1dG9GdWxsU2NyZWVuKGZhbHNlKTtcbiAgICAgICAgICAgIGNjLnNjcmVlbi5leGl0RnVsbFNjcmVlbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChfYXV0b1Jlc2l6ZSkge1xuICAgICAgICAgICAgY2Mudmlldy5yZXNpemVXaXRoQnJvd3NlclNpemUoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYWRqdXN0V2luZG93U2Nyb2xsKCk7XG4gICAgfSxcblxuICAgIF9oaWRlRG9tT25Nb2JpbGUgKCkge1xuICAgICAgICBpZiAoY2Muc3lzLm9zID09PSBjYy5zeXMuT1NfQU5EUk9JRCkge1xuICAgICAgICAgICAgaWYgKF9hdXRvUmVzaXplKSB7XG4gICAgICAgICAgICAgICAgY2Mudmlldy5yZXNpemVXaXRoQnJvd3NlclNpemUodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJbiBjYXNlIGVudGVyIGZ1bGwgc2NyZWVuIHdoZW4gc29mdCBrZXlib2FyZCBzdGlsbCBzaG93aW5nXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV9jdXJyZW50RWRpdEJveEltcGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9mdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy52aWV3LmVuYWJsZUF1dG9GdWxsU2NyZWVuKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgREVMQVlfVElNRSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTb21lIGJyb3dzZXIgbGlrZSB3ZWNoYXQgb24gaU9TIG5lZWQgdG8gbWFubnVsbHkgc2Nyb2xsIGJhY2sgd2luZG93XG4gICAgICAgIHRoaXMuX3Njcm9sbEJhY2tXaW5kb3coKTtcbiAgICB9LFxuXG4gICAgLy8gYWRqdXN0IHZpZXcgdG8gZWRpdEJveFxuICAgIF9hZGp1c3RXaW5kb3dTY3JvbGwgKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LnNjcm9sbFkgPCBTQ1JPTExZKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fZWxlbS5zY3JvbGxJbnRvVmlldyh7YmxvY2s6IFwic3RhcnRcIiwgaW5saW5lOiBcIm5lYXJlc3RcIiwgYmVoYXZpb3I6IFwic21vb3RoXCJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgREVMQVlfVElNRSk7XG4gICAgfSxcblxuICAgIF9zY3JvbGxCYWNrV2luZG93ICgpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBGSVg6IHdlY2hhdCBicm93c2VyIGJ1ZyBvbiBpT1NcbiAgICAgICAgICAgIC8vIElmIGdhbWVDb250YWluZXIgaXMgaW5jbHVkZWQgaW4gaWZyYW1lLFxuICAgICAgICAgICAgLy8gTmVlZCB0byBzY3JvbGwgdGhlIHRvcCB3aW5kb3csIG5vdCB0aGUgb25lIGluIHRoZSBpZnJhbWVcbiAgICAgICAgICAgIC8vIFJlZmVyZW5jZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvdy90b3BcbiAgICAgICAgICAgIGxldCBzeXMgPSBjYy5zeXM7XG4gICAgICAgICAgICBpZiAoc3lzLmJyb3dzZXJUeXBlID09PSBzeXMuQlJPV1NFUl9UWVBFX1dFQ0hBVCAmJiBzeXMub3MgPT09IHN5cy5PU19JT1MpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cudG9wICYmIHdpbmRvdy50b3Auc2Nyb2xsVG8oMCwgMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gICAgICAgIH0sIERFTEFZX1RJTUUpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF0cml4ICgpIHsgICAgXG4gICAgICAgIGxldCBub2RlID0gdGhpcy5fZGVsZWdhdGUubm9kZTsgICAgXG4gICAgICAgIG5vZGUuZ2V0V29ybGRNYXRyaXgodGhpcy5fd29ybGRNYXQpO1xuICAgICAgICBsZXQgd29ybGRNYXQgPSB0aGlzLl93b3JsZE1hdDtcbiAgICAgICAgbGV0IHdvcmxkTWF0bSA9IHdvcmxkTWF0Lm07XG5cbiAgICAgICAgLy8gY2hlY2sgd2hldGhlciBuZWVkIHRvIHVwZGF0ZVxuICAgICAgICBpZiAodGhpcy5fbTAwID09PSB3b3JsZE1hdG1bMF0gJiYgdGhpcy5fbTAxID09PSB3b3JsZE1hdG1bMV0gJiZcbiAgICAgICAgICAgIHRoaXMuX20wNCA9PT0gd29ybGRNYXRtWzRdICYmIHRoaXMuX20wNSA9PT0gd29ybGRNYXRtWzVdICYmXG4gICAgICAgICAgICB0aGlzLl9tMTIgPT09IHdvcmxkTWF0bVsxMl0gJiYgdGhpcy5fbTEzID09PSB3b3JsZE1hdG1bMTNdICYmXG4gICAgICAgICAgICB0aGlzLl93ID09PSBub2RlLl9jb250ZW50U2l6ZS53aWR0aCAmJiB0aGlzLl9oID09PSBub2RlLl9jb250ZW50U2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBtYXRyaXggY2FjaGVcbiAgICAgICAgdGhpcy5fbTAwID0gd29ybGRNYXRtWzBdO1xuICAgICAgICB0aGlzLl9tMDEgPSB3b3JsZE1hdG1bMV07XG4gICAgICAgIHRoaXMuX20wNCA9IHdvcmxkTWF0bVs0XTtcbiAgICAgICAgdGhpcy5fbTA1ID0gd29ybGRNYXRtWzVdO1xuICAgICAgICB0aGlzLl9tMTIgPSB3b3JsZE1hdG1bMTJdO1xuICAgICAgICB0aGlzLl9tMTMgPSB3b3JsZE1hdG1bMTNdO1xuICAgICAgICB0aGlzLl93ID0gbm9kZS5fY29udGVudFNpemUud2lkdGg7XG4gICAgICAgIHRoaXMuX2ggPSBub2RlLl9jb250ZW50U2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgbGV0IHNjYWxlWCA9IGNjLnZpZXcuX3NjYWxlWCwgc2NhbGVZID0gY2Mudmlldy5fc2NhbGVZLFxuICAgICAgICAgICAgdmlld3BvcnQgPSBjYy52aWV3Ll92aWV3cG9ydFJlY3QsXG4gICAgICAgICAgICBkcHIgPSBjYy52aWV3Ll9kZXZpY2VQaXhlbFJhdGlvO1xuXG4gICAgICAgIF92ZWMzLnggPSAtbm9kZS5fYW5jaG9yUG9pbnQueCAqIHRoaXMuX3c7XG4gICAgICAgIF92ZWMzLnkgPSAtbm9kZS5fYW5jaG9yUG9pbnQueSAqIHRoaXMuX2g7XG4gICAgXG4gICAgICAgIE1hdDQudHJhbnNmb3JtKHdvcmxkTWF0LCB3b3JsZE1hdCwgX3ZlYzMpO1xuXG4gICAgICAgIC8vIGNhbid0IGZpbmQgY2FtZXJhIGluIGVkaXRvclxuICAgICAgICBsZXQgY2FtZXJhTWF0O1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBjYW1lcmFNYXQgPSB0aGlzLl9jYW1lcmFNYXQgPSB3b3JsZE1hdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBjYW1lcmEgPSBjYy5DYW1lcmEuZmluZENhbWVyYShub2RlKTtcbiAgICAgICAgICAgIGNhbWVyYS5nZXRXb3JsZFRvU2NyZWVuTWF0cml4MkQodGhpcy5fY2FtZXJhTWF0KTtcbiAgICAgICAgICAgIGNhbWVyYU1hdCA9IHRoaXMuX2NhbWVyYU1hdDtcbiAgICAgICAgICAgIE1hdDQubXVsKGNhbWVyYU1hdCwgY2FtZXJhTWF0LCB3b3JsZE1hdCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgXG4gICAgICAgIHNjYWxlWCAvPSBkcHI7XG4gICAgICAgIHNjYWxlWSAvPSBkcHI7XG4gICAgXG4gICAgICAgIGxldCBjb250YWluZXIgPSBjYy5nYW1lLmNvbnRhaW5lcjtcbiAgICAgICAgbGV0IGNhbWVyYU1hdG0gPSBjYW1lcmFNYXQubTtcbiAgICAgICAgbGV0IGEgPSBjYW1lcmFNYXRtWzBdICogc2NhbGVYLCBiID0gY2FtZXJhTWF0bVsxXSwgYyA9IGNhbWVyYU1hdG1bNF0sIGQgPSBjYW1lcmFNYXRtWzVdICogc2NhbGVZO1xuICAgIFxuICAgICAgICBsZXQgb2Zmc2V0WCA9IGNvbnRhaW5lciAmJiBjb250YWluZXIuc3R5bGUucGFkZGluZ0xlZnQgJiYgcGFyc2VJbnQoY29udGFpbmVyLnN0eWxlLnBhZGRpbmdMZWZ0KTtcbiAgICAgICAgb2Zmc2V0WCArPSB2aWV3cG9ydC54IC8gZHByO1xuICAgICAgICBsZXQgb2Zmc2V0WSA9IGNvbnRhaW5lciAmJiBjb250YWluZXIuc3R5bGUucGFkZGluZ0JvdHRvbSAmJiBwYXJzZUludChjb250YWluZXIuc3R5bGUucGFkZGluZ0JvdHRvbSk7XG4gICAgICAgIG9mZnNldFkgKz0gdmlld3BvcnQueSAvIGRwcjtcbiAgICAgICAgbGV0IHR4ID0gY2FtZXJhTWF0bVsxMl0gKiBzY2FsZVggKyBvZmZzZXRYLCB0eSA9IGNhbWVyYU1hdG1bMTNdICogc2NhbGVZICsgb2Zmc2V0WTtcbiAgICBcbiAgICAgICAgaWYgKHBvbHlmaWxsLnpvb21JbnZhbGlkKSB7XG4gICAgICAgICAgICB0aGlzLnNldFNpemUobm9kZS53aWR0aCAqIGEsIG5vZGUuaGVpZ2h0ICogZCk7XG4gICAgICAgICAgICBhID0gMTtcbiAgICAgICAgICAgIGQgPSAxO1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5fZWxlbTtcbiAgICAgICAgbGV0IG1hdHJpeCA9IFwibWF0cml4KFwiICsgYSArIFwiLFwiICsgLWIgKyBcIixcIiArIC1jICsgXCIsXCIgKyBkICsgXCIsXCIgKyB0eCArIFwiLFwiICsgLXR5ICsgXCIpXCI7XG4gICAgICAgIGVsZW0uc3R5bGVbJ3RyYW5zZm9ybSddID0gbWF0cml4O1xuICAgICAgICBlbGVtLnN0eWxlWyctd2Via2l0LXRyYW5zZm9ybSddID0gbWF0cml4O1xuICAgICAgICBlbGVtLnN0eWxlWyd0cmFuc2Zvcm0tb3JpZ2luJ10gPSAnMHB4IDEwMCUgMHB4JztcbiAgICAgICAgZWxlbS5zdHlsZVsnLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luJ10gPSAnMHB4IDEwMCUgMHB4JztcbiAgICB9LFxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIGlucHV0IHR5cGUgYW5kIG1heCBsZW5ndGhcbiAgICBfdXBkYXRlSW5wdXRUeXBlICgpIHtcbiAgICAgICAgbGV0IGRlbGVnYXRlID0gdGhpcy5fZGVsZWdhdGUsXG4gICAgICAgICAgICBpbnB1dE1vZGUgPSBkZWxlZ2F0ZS5pbnB1dE1vZGUsXG4gICAgICAgICAgICBpbnB1dEZsYWcgPSBkZWxlZ2F0ZS5pbnB1dEZsYWcsXG4gICAgICAgICAgICByZXR1cm5UeXBlID0gZGVsZWdhdGUucmV0dXJuVHlwZSxcbiAgICAgICAgICAgIGVsZW0gPSB0aGlzLl9lbGVtO1xuXG4gICAgICAgIC8vIHdoZXRoZXIgbmVlZCB0byB1cGRhdGVcbiAgICAgICAgaWYgKHRoaXMuX2lucHV0TW9kZSA9PT0gaW5wdXRNb2RlICYmXG4gICAgICAgICAgICB0aGlzLl9pbnB1dEZsYWcgPT09IGlucHV0RmxhZyAmJlxuICAgICAgICAgICAgdGhpcy5fcmV0dXJuVHlwZSA9PT0gcmV0dXJuVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIGNhY2hlXG4gICAgICAgIHRoaXMuX2lucHV0TW9kZSA9IGlucHV0TW9kZTtcbiAgICAgICAgdGhpcy5faW5wdXRGbGFnID0gaW5wdXRGbGFnO1xuICAgICAgICB0aGlzLl9yZXR1cm5UeXBlID0gcmV0dXJuVHlwZTtcblxuICAgICAgICAvLyBGSVggTUU6IFRleHRBcmVhIGFjdHVhbGx5IGRvc2Ugbm90IHN1cHBvcnQgcGFzc3dvcmQgdHlwZS5cbiAgICAgICAgaWYgKHRoaXMuX2lzVGV4dEFyZWEpIHtcbiAgICAgICAgICAgIC8vIGlucHV0IGZsYWdcbiAgICAgICAgICAgIGxldCB0ZXh0VHJhbnNmb3JtID0gJ25vbmUnO1xuICAgICAgICAgICAgaWYgKGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLklOSVRJQUxfQ0FQU19BTExfQ0hBUkFDVEVSUykge1xuICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm0gPSAndXBwZXJjYXNlJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLklOSVRJQUxfQ0FQU19XT1JEKSB7XG4gICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybSA9ICdjYXBpdGFsaXplJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW0uc3R5bGUudGV4dFRyYW5zZm9ybSA9IHRleHRUcmFuc2Zvcm07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgLy8gYmVnaW4gdG8gdXBkYXRlSW5wdXRUeXBlXG4gICAgICAgIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5QQVNTV09SRCkge1xuICAgICAgICAgICAgZWxlbS50eXBlID0gJ3Bhc3N3b3JkJztcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAvLyBpbnB1dCBtb2RlXG4gICAgICAgIGxldCB0eXBlID0gZWxlbS50eXBlO1xuICAgICAgICBpZiAoaW5wdXRNb2RlID09PSBJbnB1dE1vZGUuRU1BSUxfQUREUikge1xuICAgICAgICAgICAgdHlwZSA9ICdlbWFpbCc7XG4gICAgICAgIH0gZWxzZSBpZihpbnB1dE1vZGUgPT09IElucHV0TW9kZS5OVU1FUklDIHx8IGlucHV0TW9kZSA9PT0gSW5wdXRNb2RlLkRFQ0lNQUwpIHtcbiAgICAgICAgICAgIHR5cGUgPSAnbnVtYmVyJztcbiAgICAgICAgfSBlbHNlIGlmKGlucHV0TW9kZSA9PT0gSW5wdXRNb2RlLlBIT05FX05VTUJFUikge1xuICAgICAgICAgICAgdHlwZSA9ICdudW1iZXInO1xuICAgICAgICAgICAgZWxlbS5wYXR0ZXJuID0gJ1swLTldKic7XG4gICAgICAgIH0gZWxzZSBpZihpbnB1dE1vZGUgPT09IElucHV0TW9kZS5VUkwpIHtcbiAgICAgICAgICAgIHR5cGUgPSAndXJsJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHR5cGUgPSAndGV4dCc7XG4gICAgXG4gICAgICAgICAgICBpZiAocmV0dXJuVHlwZSA9PT0gS2V5Ym9hcmRSZXR1cm5UeXBlLlNFQVJDSCkge1xuICAgICAgICAgICAgICAgIHR5cGUgPSAnc2VhcmNoJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbGVtLnR5cGUgPSB0eXBlO1xuXG4gICAgICAgIC8vIGlucHV0IGZsYWdcbiAgICAgICAgbGV0IHRleHRUcmFuc2Zvcm0gPSAnbm9uZSc7XG4gICAgICAgIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5JTklUSUFMX0NBUFNfQUxMX0NIQVJBQ1RFUlMpIHtcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm0gPSAndXBwZXJjYXNlJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5JTklUSUFMX0NBUFNfV09SRCkge1xuICAgICAgICAgICAgdGV4dFRyYW5zZm9ybSA9ICdjYXBpdGFsaXplJztcbiAgICAgICAgfVxuICAgICAgICBlbGVtLnN0eWxlLnRleHRUcmFuc2Zvcm0gPSB0ZXh0VHJhbnNmb3JtO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF4TGVuZ3RoICgpIHtcbiAgICAgICAgbGV0IG1heExlbmd0aCA9IHRoaXMuX2RlbGVnYXRlLm1heExlbmd0aDtcbiAgICAgICAgaWYobWF4TGVuZ3RoIDwgMCkge1xuICAgICAgICAgICAgLy93ZSBjYW4ndCBzZXQgTnVtYmVyLk1BWF9WQUxVRSB0byBpbnB1dCdzIG1heExlbmd0aCBwcm9wZXJ0eVxuICAgICAgICAgICAgLy9zbyB3ZSB1c2UgYSBtYWdpYyBudW1iZXIgaGVyZSwgaXQgc2hvdWxkIHdvcmtzIGF0IG1vc3QgdXNlIGNhc2VzLlxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gNjU1MzU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZWxlbS5tYXhMZW5ndGggPSBtYXhMZW5ndGg7XG4gICAgfSxcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBzdHlsZSBzaGVldFxuICAgIF9pbml0U3R5bGVTaGVldCAoKSB7XG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5fZWxlbTtcbiAgICAgICAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBlbGVtLnN0eWxlLmJvcmRlciA9IDA7XG4gICAgICAgIGVsZW0uc3R5bGUuYmFja2dyb3VuZCA9ICd0cmFuc3BhcmVudCc7XG4gICAgICAgIGVsZW0uc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgIGVsZW0uc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgICBlbGVtLnN0eWxlLmFjdGl2ZSA9IDA7XG4gICAgICAgIGVsZW0uc3R5bGUub3V0bGluZSA9ICdtZWRpdW0nO1xuICAgICAgICBlbGVtLnN0eWxlLnBhZGRpbmcgPSAnMCc7XG4gICAgICAgIGVsZW0uc3R5bGUudGV4dFRyYW5zZm9ybSA9ICd1cHBlcmNhc2UnO1xuICAgICAgICBlbGVtLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICBlbGVtLnN0eWxlLmJvdHRvbSA9IFwiMHB4XCI7XG4gICAgICAgIGVsZW0uc3R5bGUubGVmdCA9IExFRlRfUEFERElORyArIFwicHhcIjtcbiAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBcImNvY29zRWRpdEJveFwiO1xuICAgICAgICBlbGVtLmlkID0gdGhpcy5fZG9tSWQ7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc1RleHRBcmVhKSB7XG4gICAgICAgICAgICBlbGVtLnR5cGUgPSAndGV4dCc7XG4gICAgICAgICAgICBlbGVtLnN0eWxlWyctbW96LWFwcGVhcmFuY2UnXSA9ICd0ZXh0ZmllbGQnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZWxlbS5zdHlsZS5yZXNpemUgPSAnbm9uZSc7XG4gICAgICAgICAgICBlbGVtLnN0eWxlLm92ZXJmbG93X3kgPSAnc2Nyb2xsJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyU3R5bGVTaGVldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgfSxcbiAgICBcbiAgICBfdXBkYXRlU3R5bGVTaGVldCAoKSB7XG4gICAgICAgIGxldCBkZWxlZ2F0ZSA9IHRoaXMuX2RlbGVnYXRlLFxuICAgICAgICAgICAgZWxlbSA9IHRoaXMuX2VsZW07XG5cbiAgICAgICAgZWxlbS52YWx1ZSA9IGRlbGVnYXRlLnN0cmluZztcbiAgICAgICAgZWxlbS5wbGFjZWhvbGRlciA9IGRlbGVnYXRlLnBsYWNlaG9sZGVyO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZVRleHRMYWJlbChkZWxlZ2F0ZS50ZXh0TGFiZWwpO1xuICAgICAgICB0aGlzLl91cGRhdGVQbGFjZWhvbGRlckxhYmVsKGRlbGVnYXRlLnBsYWNlaG9sZGVyTGFiZWwpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlVGV4dExhYmVsICh0ZXh0TGFiZWwpIHtcbiAgICAgICAgaWYgKCF0ZXh0TGFiZWwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBnZXQgZm9udFxuICAgICAgICBsZXQgZm9udCA9IHRleHRMYWJlbC5mb250O1xuICAgICAgICBpZiAoZm9udCAmJiAhKGZvbnQgaW5zdGFuY2VvZiBjYy5CaXRtYXBGb250KSkge1xuICAgICAgICAgICAgZm9udCA9IGZvbnQuX2ZvbnRGYW1pbHk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb250ID0gdGV4dExhYmVsLmZvbnRGYW1pbHk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgZm9udCBzaXplXG4gICAgICAgIGxldCBmb250U2l6ZSA9IHRleHRMYWJlbC5mb250U2l6ZSAqIHRleHRMYWJlbC5ub2RlLnNjYWxlWTtcblxuICAgICAgICAvLyB3aGV0aGVyIG5lZWQgdG8gdXBkYXRlXG4gICAgICAgIGlmICh0aGlzLl90ZXh0TGFiZWxGb250ID09PSBmb250XG4gICAgICAgICAgICAmJiB0aGlzLl90ZXh0TGFiZWxGb250U2l6ZSA9PT0gZm9udFNpemVcbiAgICAgICAgICAgICYmIHRoaXMuX3RleHRMYWJlbEZvbnRDb2xvciA9PT0gdGV4dExhYmVsLmZvbnRDb2xvclxuICAgICAgICAgICAgJiYgdGhpcy5fdGV4dExhYmVsQWxpZ24gPT09IHRleHRMYWJlbC5ob3Jpem9udGFsQWxpZ24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgY2FjaGVcbiAgICAgICAgdGhpcy5fdGV4dExhYmVsRm9udCA9IGZvbnQ7XG4gICAgICAgIHRoaXMuX3RleHRMYWJlbEZvbnRTaXplID0gZm9udFNpemU7XG4gICAgICAgIHRoaXMuX3RleHRMYWJlbEZvbnRDb2xvciA9IHRleHRMYWJlbC5mb250Q29sb3I7XG4gICAgICAgIHRoaXMuX3RleHRMYWJlbEFsaWduID0gdGV4dExhYmVsLmhvcml6b250YWxBbGlnbjtcblxuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuX2VsZW07XG4gICAgICAgIC8vIGZvbnQgc2l6ZVxuICAgICAgICBlbGVtLnN0eWxlLmZvbnRTaXplID0gYCR7Zm9udFNpemV9cHhgO1xuICAgICAgICAvLyBmb250IGNvbG9yXG4gICAgICAgIGVsZW0uc3R5bGUuY29sb3IgPSB0ZXh0TGFiZWwubm9kZS5jb2xvci50b0NTUygpO1xuICAgICAgICAvLyBmb250IGZhbWlseVxuICAgICAgICBlbGVtLnN0eWxlLmZvbnRGYW1pbHkgPSBmb250O1xuICAgICAgICAvLyB0ZXh0LWFsaWduXG4gICAgICAgIHN3aXRjaCh0ZXh0TGFiZWwuaG9yaXpvbnRhbEFsaWduKSB7XG4gICAgICAgICAgICBjYXNlIExhYmVsLkhvcml6b250YWxBbGlnbi5MRUZUOlxuICAgICAgICAgICAgICAgIGVsZW0uc3R5bGUudGV4dEFsaWduID0gJ2xlZnQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMYWJlbC5Ib3Jpem9udGFsQWxpZ24uQ0VOVEVSOlxuICAgICAgICAgICAgICAgIGVsZW0uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExhYmVsLkhvcml6b250YWxBbGlnbi5SSUdIVDpcbiAgICAgICAgICAgICAgICBlbGVtLnN0eWxlLnRleHRBbGlnbiA9ICdyaWdodCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbGluZUhlaWdodFxuICAgICAgICAvLyBDYW4ndCBzeW5jIGxpbmVIZWlnaHQgcHJvcGVydHksIGJlY2F1c2UgbGluZUhlaWdodCB3b3VsZCBjaGFuZ2UgdGhlIHRvdWNoIGFyZWEgb2YgaW5wdXRcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwgKHBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgaWYgKCFwbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgZm9udFxuICAgICAgICBsZXQgZm9udCA9IHBsYWNlaG9sZGVyTGFiZWwuZm9udDtcbiAgICAgICAgaWYgKGZvbnQgJiYgIShmb250IGluc3RhbmNlb2YgY2MuQml0bWFwRm9udCkpIHtcbiAgICAgICAgICAgIGZvbnQgPSBwbGFjZWhvbGRlckxhYmVsLmZvbnQuX2ZvbnRGYW1pbHk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb250ID0gcGxhY2Vob2xkZXJMYWJlbC5mb250RmFtaWx5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGZvbnQgc2l6ZVxuICAgICAgICBsZXQgZm9udFNpemUgPSBwbGFjZWhvbGRlckxhYmVsLmZvbnRTaXplICogcGxhY2Vob2xkZXJMYWJlbC5ub2RlLnNjYWxlWTtcblxuICAgICAgICAvLyB3aGV0aGVyIG5lZWQgdG8gdXBkYXRlXG4gICAgICAgIGlmICh0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udCA9PT0gZm9udFxuICAgICAgICAgICAgJiYgdGhpcy5fcGxhY2Vob2xkZXJMYWJlbEZvbnRTaXplID09PSBmb250U2l6ZVxuICAgICAgICAgICAgJiYgdGhpcy5fcGxhY2Vob2xkZXJMYWJlbEZvbnRDb2xvciA9PT0gcGxhY2Vob2xkZXJMYWJlbC5mb250Q29sb3JcbiAgICAgICAgICAgICYmIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxBbGlnbiA9PT0gcGxhY2Vob2xkZXJMYWJlbC5ob3Jpem9udGFsQWxpZ25cbiAgICAgICAgICAgICYmIHRoaXMuX3BsYWNlaG9sZGVyTGluZUhlaWdodCA9PT0gcGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSBjYWNoZVxuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udCA9IGZvbnQ7XG4gICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxGb250U2l6ZSA9IGZvbnRTaXplO1xuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlckxhYmVsRm9udENvbG9yID0gcGxhY2Vob2xkZXJMYWJlbC5mb250Q29sb3I7XG4gICAgICAgIHRoaXMuX3BsYWNlaG9sZGVyTGFiZWxBbGlnbiA9IHBsYWNlaG9sZGVyTGFiZWwuaG9yaXpvbnRhbEFsaWduO1xuICAgICAgICB0aGlzLl9wbGFjZWhvbGRlckxpbmVIZWlnaHQgPSBwbGFjZWhvbGRlckxhYmVsLmZvbnRTaXplO1xuXG4gICAgICAgIGxldCBzdHlsZUVsID0gdGhpcy5fcGxhY2Vob2xkZXJTdHlsZVNoZWV0O1xuICAgICAgICBcbiAgICAgICAgLy8gZm9udCBjb2xvclxuICAgICAgICBsZXQgZm9udENvbG9yID0gcGxhY2Vob2xkZXJMYWJlbC5ub2RlLmNvbG9yLnRvQ1NTKCk7XG4gICAgICAgIC8vIGxpbmUgaGVpZ2h0XG4gICAgICAgIGxldCBsaW5lSGVpZ2h0ID0gcGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZTsgIC8vIHRvcCB2ZXJ0aWNhbCBhbGlnbiBieSBkZWZhdWx0XG4gICAgICAgIC8vIGhvcml6b250YWwgYWxpZ25cbiAgICAgICAgbGV0IGhvcml6b250YWxBbGlnbjtcbiAgICAgICAgc3dpdGNoIChwbGFjZWhvbGRlckxhYmVsLmhvcml6b250YWxBbGlnbikge1xuICAgICAgICAgICAgY2FzZSBMYWJlbC5Ib3Jpem9udGFsQWxpZ24uTEVGVDpcbiAgICAgICAgICAgICAgICBob3Jpem9udGFsQWxpZ24gPSAnbGVmdCc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExhYmVsLkhvcml6b250YWxBbGlnbi5DRU5URVI6XG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbEFsaWduID0gJ2NlbnRlcic7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExhYmVsLkhvcml6b250YWxBbGlnbi5SSUdIVDpcbiAgICAgICAgICAgICAgICBob3Jpem9udGFsQWxpZ24gPSAncmlnaHQnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgc3R5bGVFbC5pbm5lckhUTUwgPSBgIyR7dGhpcy5fZG9tSWR9Ojotd2Via2l0LWlucHV0LXBsYWNlaG9sZGVyLCMke3RoaXMuX2RvbUlkfTo6LW1vei1wbGFjZWhvbGRlciwjJHt0aGlzLl9kb21JZH06LW1zLWlucHV0LXBsYWNlaG9sZGVyYCArXG4gICAgICAgIGB7dGV4dC10cmFuc2Zvcm06IGluaXRpYWw7IGZvbnQtZmFtaWx5OiAke2ZvbnR9OyBmb250LXNpemU6ICR7Zm9udFNpemV9cHg7IGNvbG9yOiAke2ZvbnRDb2xvcn07IGxpbmUtaGVpZ2h0OiAke2xpbmVIZWlnaHR9cHg7IHRleHQtYWxpZ246ICR7aG9yaXpvbnRhbEFsaWdufTt9YDtcbiAgICAgICAgLy8gRURHRV9CVUdfRklYOiBoaWRlIGNsZWFyIGJ1dHRvbiwgYmVjYXVzZSBjbGVhcmluZyBpbnB1dCBib3ggaW4gRWRnZSBkb2VzIG5vdCBlbWl0IGlucHV0IGV2ZW50IFxuICAgICAgICAvLyBpc3N1ZSByZWZmZXJlbmNlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yNjMwN1xuICAgICAgICBpZiAoY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX0VER0UpIHtcbiAgICAgICAgICAgIHN0eWxlRWwuaW5uZXJIVE1MICs9IGAjJHt0aGlzLl9kb21JZH06Oi1tcy1jbGVhcntkaXNwbGF5OiBub25lO31gO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBoYW5kbGUgZXZlbnQgbGlzdGVuZXJzXG4gICAgX3JlZ2lzdGVyRXZlbnRMaXN0ZW5lcnMgKCkgeyAgICAgICAgXG4gICAgICAgIGxldCBpbXBsID0gdGhpcyxcbiAgICAgICAgICAgIGVsZW0gPSB0aGlzLl9lbGVtLFxuICAgICAgICAgICAgaW5wdXRMb2NrID0gZmFsc2UsXG4gICAgICAgICAgICBjYnMgPSB0aGlzLl9ldmVudExpc3RlbmVycztcblxuICAgICAgICBjYnMuY29tcG9zaXRpb25TdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlucHV0TG9jayA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBjYnMuY29tcG9zaXRpb25FbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbnB1dExvY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIGltcGwuX2RlbGVnYXRlLmVkaXRCb3hUZXh0Q2hhbmdlZChlbGVtLnZhbHVlKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjYnMub25JbnB1dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dExvY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbXBsLl9kZWxlZ2F0ZS5lZGl0Qm94VGV4dENoYW5nZWQoZWxlbS52YWx1ZSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICAvLyBUaGVyZSBhcmUgMiB3YXlzIHRvIGZvY3VzIG9uIHRoZSBpbnB1dCBlbGVtZW50OlxuICAgICAgICAvLyBDbGljayB0aGUgaW5wdXQgZWxlbWVudCwgb3IgY2FsbCBpbnB1dC5mb2N1cygpLlxuICAgICAgICAvLyBCb3RoIG5lZWQgdG8gYWRqdXN0IHdpbmRvdyBzY3JvbGwuXG4gICAgICAgIGNicy5vbkNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIC8vIEluIGNhc2Ugb3BlcmF0aW9uIHNlcXVlbmNlOiBjbGljayBpbnB1dCwgaGlkZSBrZXlib2FyZCwgdGhlbiBjbGljayBhZ2Fpbi5cbiAgICAgICAgICAgIGlmIChpbXBsLl9lZGl0aW5nKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNjLnN5cy5pc01vYmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBpbXBsLl9hZGp1c3RXaW5kb3dTY3JvbGwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBjYnMub25LZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IG1hY3JvLktFWS5lbnRlcikge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaW1wbC5fZGVsZWdhdGUuZWRpdEJveEVkaXRpbmdSZXR1cm4oKTtcblxuICAgICAgICAgICAgICAgIGlmICghaW1wbC5faXNUZXh0QXJlYSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtLmJsdXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChlLmtleUNvZGUgPT09IG1hY3JvLktFWS50YWIpIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIHRhYkluZGV4VXRpbC5uZXh0KGltcGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNicy5vbkJsdXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbXBsLl9lZGl0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICBfY3VycmVudEVkaXRCb3hJbXBsID0gbnVsbDtcbiAgICAgICAgICAgIGltcGwuX2hpZGVEb20oKTtcbiAgICAgICAgICAgIGltcGwuX2RlbGVnYXRlLmVkaXRCb3hFZGl0aW5nRGlkRW5kZWQoKTtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25zdGFydCcsIGNicy5jb21wb3NpdGlvblN0YXJ0KTtcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjb21wb3NpdGlvbmVuZCcsIGNicy5jb21wb3NpdGlvbkVuZCk7XG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBjYnMub25JbnB1dCk7XG4gICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGNicy5vbktleWRvd24pO1xuICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBjYnMub25CbHVyKTtcbiAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgY2JzLm9uQ2xpY2spO1xuICAgIH0sXG5cbiAgICBfcmVtb3ZlRXZlbnRMaXN0ZW5lcnMgKCkge1xuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuX2VsZW0sXG4gICAgICAgICAgICBjYnMgPSB0aGlzLl9ldmVudExpc3RlbmVycztcblxuICAgICAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbXBvc2l0aW9uc3RhcnQnLCBjYnMuY29tcG9zaXRpb25TdGFydCk7XG4gICAgICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29tcG9zaXRpb25lbmQnLCBjYnMuY29tcG9zaXRpb25FbmQpO1xuICAgICAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2lucHV0JywgY2JzLm9uSW5wdXQpO1xuICAgICAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBjYnMub25LZXlkb3duKTtcbiAgICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKCdibHVyJywgY2JzLm9uQmx1cik7XG4gICAgICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGNicy5vbkNsaWNrKTtcbiAgICAgICAgXG4gICAgICAgIGNicy5jb21wb3NpdGlvblN0YXJ0ID0gbnVsbDtcbiAgICAgICAgY2JzLmNvbXBvc2l0aW9uRW5kID0gbnVsbDtcbiAgICAgICAgY2JzLm9uSW5wdXQgPSBudWxsO1xuICAgICAgICBjYnMub25LZXlkb3duID0gbnVsbDtcbiAgICAgICAgY2JzLm9uQmx1ciA9IG51bGw7XG4gICAgICAgIGNicy5vbkNsaWNrID0gbnVsbDtcbiAgICB9LFxufSk7XG5cbiJdfQ==