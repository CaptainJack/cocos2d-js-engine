
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/editbox/CCEditBox.js';
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
var macro = require('../../platform/CCMacro');

var EditBoxImplBase = require('../editbox/EditBoxImplBase');

var Label = require('../CCLabel');

var Types = require('./types');

var InputMode = Types.InputMode;
var InputFlag = Types.InputFlag;
var KeyboardReturnType = Types.KeyboardReturnType;

function capitalize(string) {
  return string.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * !#en cc.EditBox is a component for inputing text, you can use it to gather small amounts of text from users.
 * !#zh EditBox 组件，用于获取用户的输入文本。
 * @class EditBox
 * @extends Component
 */


var EditBox = cc.Class({
  name: 'cc.EditBox',
  "extends": cc.Component,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.ui/EditBox',
    inspector: 'packages://inspector/inspectors/comps/cceditbox.js',
    help: 'i18n:COMPONENT.help_url.editbox',
    executeInEditMode: true
  },
  properties: {
    _useOriginalSize: true,
    _string: '',

    /**
     * !#en Input string of EditBox.
     * !#zh 输入框的初始输入内容，如果为空则会显示占位符的文本。
     * @property {String} string
     */
    string: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.string',
      get: function get() {
        return this._string;
      },
      set: function set(value) {
        value = '' + value;

        if (this.maxLength >= 0 && value.length >= this.maxLength) {
          value = value.slice(0, this.maxLength);
        }

        this._string = value;

        this._updateString(value);
      }
    },

    /**
     * !#en The Label component attached to the node for EditBox's input text label
     * !#zh 输入框输入文本节点上挂载的 Label 组件对象
     * @property {Label} textLabel
     */
    textLabel: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.textLabel',
      "default": null,
      type: Label,
      notify: function notify(oldValue) {
        if (this.textLabel && this.textLabel !== oldValue) {
          this._updateTextLabel();

          this._updateLabels();
        }
      }
    },

    /**
    * !#en The Label component attached to the node for EditBox's placeholder text label
    * !#zh 输入框占位符节点上挂载的 Label 组件对象
    * @property {Label} placeholderLabel
    */
    placeholderLabel: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholderLabel',
      "default": null,
      type: Label,
      notify: function notify(oldValue) {
        if (this.placeholderLabel && this.placeholderLabel !== oldValue) {
          this._updatePlaceholderLabel();

          this._updateLabels();
        }
      }
    },

    /**
     * !#en The Sprite component attached to the node for EditBox's background
     * !#zh 输入框背景节点上挂载的 Sprite 组件对象
     * @property {Sprite} background
     */
    background: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.background',
      "default": null,
      type: cc.Sprite,
      notify: function notify(oldValue) {
        if (this.background && this.background !== oldValue) {
          this._updateBackgroundSprite();
        }
      }
    },
    // To be removed in the future
    _N$backgroundImage: {
      "default": undefined,
      type: cc.SpriteFrame
    },

    /**
     * !#en The background image of EditBox. This property will be removed in the future, use editBox.background instead please.
     * !#zh 输入框的背景图片。 该属性会在将来的版本中移除，请用 editBox.background
     * @property {SpriteFrame} backgroundImage
     * @deprecated since v2.1
     */
    backgroundImage: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.backgroundImage', 'editBox.background');
        if (!this.background) {
          return null;
        }

        return this.background.spriteFrame;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.backgroundImage', 'editBox.background');
        if (this.background) {
          this.background.spriteFrame = value;
        }
      }
    },

    /**
     * !#en
     * The return key type of EditBox.
     * Note: it is meaningless for web platforms and desktop platforms.
     * !#zh
     * 指定移动设备上面回车按钮的样式。
     * 注意：这个选项对 web 平台与 desktop 平台无效。
     * @property {EditBox.KeyboardReturnType} returnType
     * @default KeyboardReturnType.DEFAULT
     */
    returnType: {
      "default": KeyboardReturnType.DEFAULT,
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.returnType',
      displayName: 'KeyboardReturnType',
      type: KeyboardReturnType
    },
    // To be removed in the future
    _N$returnType: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en Set the input flags that are to be applied to the EditBox.
     * !#zh 指定输入标志位，可以指定输入方式为密码或者单词首字母大写。
     * @property {EditBox.InputFlag} inputFlag
     * @default InputFlag.DEFAULT
     */
    inputFlag: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.input_flag',
      "default": InputFlag.DEFAULT,
      type: InputFlag,
      notify: function notify() {
        this._updateString(this._string);
      }
    },

    /**
     * !#en
     * Set the input mode of the edit box.
     * If you pass ANY, it will create a multiline EditBox.
     * !#zh
     * 指定输入模式: ANY表示多行输入，其它都是单行输入，移动平台上还可以指定键盘样式。
     * @property {EditBox.InputMode} inputMode
     * @default InputMode.ANY
     */
    inputMode: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.input_mode',
      "default": InputMode.ANY,
      type: InputMode,
      notify: function notify(oldValue) {
        if (this.inputMode !== oldValue) {
          this._updateTextLabel();

          this._updatePlaceholderLabel();
        }
      }
    },

    /**
     * !#en Font size of the input text. This property will be removed in the future, use editBox.textLabel.fontSize instead please.
     * !#zh 输入框文本的字体大小。 该属性会在将来的版本中移除，请使用 editBox.textLabel.fontSize。
     * @property {Number} fontSize
     * @deprecated since v2.1
     */
    fontSize: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontSize', 'editBox.textLabel.fontSize');
        if (!this.textLabel) {
          return null;
        }

        return this.textLabel.fontSize;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontSize', 'editBox.textLabel.fontSize');
        if (this.textLabel) {
          this.textLabel.fontSize = value;
        }
      }
    },
    // To be removed in the future
    _N$fontSize: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en Change the lineHeight of displayed text. This property will be removed in the future, use editBox.textLabel.lineHeight instead.
     * !#zh 输入框文本的行高。该属性会在将来的版本中移除，请使用 editBox.textLabel.lineHeight
     * @property {Number} lineHeight
     * @deprecated since v2.1
     */
    lineHeight: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.lineHeight', 'editBox.textLabel.lineHeight');
        if (!this.textLabel) {
          return null;
        }

        return this.textLabel.lineHeight;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.lineHeight', 'editBox.textLabel.lineHeight');
        if (this.textLabel) {
          this.textLabel.lineHeight = value;
        }
      }
    },
    // To be removed in the future
    _N$lineHeight: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en Font color of the input text. This property will be removed in the future, use editBox.textLabel.node.color instead.
     * !#zh 输入框文本的颜色。该属性会在将来的版本中移除，请使用 editBox.textLabel.node.color
     * @property {Color} fontColor
     * @deprecated since v2.1
     */
    fontColor: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontColor', 'editBox.textLabel.node.color');
        if (!this.textLabel) {
          return null;
        }

        return this.textLabel.node.color;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.fontColor', 'editBox.textLabel.node.color');
        if (this.textLabel) {
          this.textLabel.node.color = value;
          this.textLabel.node.opacity = value.a;
        }
      }
    },
    // To be removed in the future
    _N$fontColor: undefined,

    /**
     * !#en The display text of placeholder.
     * !#zh 输入框占位符的文本内容。
     * @property {String} placeholder
     */
    placeholder: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.placeholder',
      get: function get() {
        if (!this.placeholderLabel) {
          return '';
        }

        return this.placeholderLabel.string;
      },
      set: function set(value) {
        if (this.placeholderLabel) {
          this.placeholderLabel.string = value;
        }
      }
    },
    // To be removed in the future
    _N$placeholder: {
      "default": undefined,
      type: cc.String
    },

    /**
     * !#en The font size of placeholder. This property will be removed in the future, use editBox.placeholderLabel.fontSize instead.
     * !#zh 输入框占位符的字体大小。该属性会在将来的版本中移除，请使用 editBox.placeholderLabel.fontSize
     * @property {Number} placeholderFontSize
     * @deprecated since v2.1
     */
    placeholderFontSize: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontSize', 'editBox.placeholderLabel.fontSize');
        if (!this.placeholderLabel) {
          return null;
        }

        return this.placeholderLabel.fontSize;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontSize', 'editBox.placeholderLabel.fontSize');
        if (this.placeholderLabel) {
          this.placeholderLabel.fontSize = value;
        }
      }
    },
    // To be removed in the future
    _N$placeholderFontSize: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en The font color of placeholder. This property will be removed in the future, use editBox.placeholderLabel.node.color instead.
     * !#zh 输入框占位符的字体颜色。该属性会在将来的版本中移除，请使用 editBox.placeholderLabel.node.color
     * @property {Color} placeholderFontColor
     * @deprecated since v2.1
     */
    placeholderFontColor: {
      get: function get() {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontColor', 'editBox.placeholderLabel.node.color');
        if (!this.placeholderLabel) {
          return null;
        }

        return this.placeholderLabel.node.color;
      },
      set: function set(value) {
        // if (!CC_EDITOR) cc.warnID(5400, 'editBox.placeholderFontColor', 'editBox.placeholderLabel.node.color');
        if (this.placeholderLabel) {
          this.placeholderLabel.node.color = value;
          this.placeholderLabel.node.opacity = value.a;
        }
      }
    },
    // To be removed in the future
    _N$placeholderFontColor: undefined,

    /**
     * !#en The maximize input length of EditBox.
     * - If pass a value less than 0, it won't limit the input number of characters.
     * - If pass 0, it doesn't allow input any characters.
     * !#zh 输入框最大允许输入的字符个数。
     * - 如果值为小于 0 的值，则不会限制输入字符个数。
     * - 如果值为 0，则不允许用户进行任何输入。
     * @property {Number} maxLength
     */
    maxLength: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.max_length',
      "default": 20
    },
    // To be removed in the future
    _N$maxLength: {
      "default": undefined,
      type: cc.Float
    },

    /**
     * !#en The input is always visible and be on top of the game view (only useful on Web), this property will be removed on v2.1
     * !zh 输入框总是可见，并且永远在游戏视图的上面（这个属性只有在 Web 上面修改有意义），该属性会在 v2.1 中移除
     * Note: only available on Web at the moment.
     * @property {Boolean} stayOnTop
     * @deprecated since 2.0.8
     */
    stayOnTop: {
      "default": false,
      notify: function notify() {
        cc.warn('editBox.stayOnTop is removed since v2.1.');
      }
    },
    _tabIndex: 0,

    /**
     * !#en Set the tabIndex of the DOM input element (only useful on Web).
     * !#zh 修改 DOM 输入元素的 tabIndex（这个属性只有在 Web 上面修改有意义）。
     * @property {Number} tabIndex
     */
    tabIndex: {
      tooltip: CC_DEV && 'i18n:COMPONENT.editbox.tab_index',
      get: function get() {
        return this._tabIndex;
      },
      set: function set(value) {
        if (this._tabIndex !== value) {
          this._tabIndex = value;

          if (this._impl) {
            this._impl.setTabIndex(value);
          }
        }
      }
    },

    /**
     * !#en The event handler to be called when EditBox began to edit text.
     * !#zh 开始编辑文本输入框触发的事件回调。
     * @property {Component.EventHandler[]} editingDidBegan
     */
    editingDidBegan: {
      "default": [],
      type: cc.Component.EventHandler
    },

    /**
     * !#en The event handler to be called when EditBox text changes.
     * !#zh 编辑文本输入框时触发的事件回调。
     * @property {Component.EventHandler[]} textChanged
     */
    textChanged: {
      "default": [],
      type: cc.Component.EventHandler
    },

    /**
     * !#en The event handler to be called when EditBox edit ends.
     * !#zh 结束编辑文本输入框时触发的事件回调。
     * @property {Component.EventHandler[]} editingDidEnded
     */
    editingDidEnded: {
      "default": [],
      type: cc.Component.EventHandler
    },

    /**
     * !#en The event handler to be called when return key is pressed. Windows is not supported.
     * !#zh 当用户按下回车按键时的事件回调，目前不支持 windows 平台
     * @property {Component.EventHandler[]} editingReturn
     */
    editingReturn: {
      "default": [],
      type: cc.Component.EventHandler
    }
  },
  statics: {
    _ImplClass: EditBoxImplBase,
    // implemented on different platform adapter
    KeyboardReturnType: KeyboardReturnType,
    InputFlag: InputFlag,
    InputMode: InputMode
  },
  _init: function _init() {
    this._upgradeComp();

    this._isLabelVisible = true;
    this.node.on(cc.Node.EventType.SIZE_CHANGED, this._syncSize, this);
    var impl = this._impl = new EditBox._ImplClass();
    impl.init(this);

    this._updateString(this._string);

    this._syncSize();
  },
  _updateBackgroundSprite: function _updateBackgroundSprite() {
    var background = this.background; // If background doesn't exist, create one.

    if (!background) {
      var node = this.node.getChildByName('BACKGROUND_SPRITE');

      if (!node) {
        node = new cc.Node('BACKGROUND_SPRITE');
      }

      background = node.getComponent(cc.Sprite);

      if (!background) {
        background = node.addComponent(cc.Sprite);
      }

      node.parent = this.node;
      this.background = background;
    } // update


    background.type = cc.Sprite.Type.SLICED; // handle old data

    if (this._N$backgroundImage !== undefined) {
      background.spriteFrame = this._N$backgroundImage;
      this._N$backgroundImage = undefined;
    }
  },
  _updateTextLabel: function _updateTextLabel() {
    var textLabel = this.textLabel; // If textLabel doesn't exist, create one.

    if (!textLabel) {
      var node = this.node.getChildByName('TEXT_LABEL');

      if (!node) {
        node = new cc.Node('TEXT_LABEL');
      }

      textLabel = node.getComponent(Label);

      if (!textLabel) {
        textLabel = node.addComponent(Label);
      }

      node.parent = this.node;
      this.textLabel = textLabel;
    } // update


    textLabel.node.setAnchorPoint(0, 1);
    textLabel.overflow = Label.Overflow.CLAMP;

    if (this.inputMode === InputMode.ANY) {
      textLabel.verticalAlign = macro.VerticalTextAlignment.TOP;
      textLabel.enableWrapText = true;
    } else {
      textLabel.verticalAlign = macro.VerticalTextAlignment.CENTER;
      textLabel.enableWrapText = false;
    }

    textLabel.string = this._updateLabelStringStyle(this._string); // handle old data

    if (this._N$fontColor !== undefined) {
      textLabel.node.color = this._N$fontColor;
      textLabel.node.opacity = this._N$fontColor.a;
      this._N$fontColor = undefined;
    }

    if (this._N$fontSize !== undefined) {
      textLabel.fontSize = this._N$fontSize;
      this._N$fontSize = undefined;
    }

    if (this._N$lineHeight !== undefined) {
      textLabel.lineHeight = this._N$lineHeight;
      this._N$lineHeight = undefined;
    }
  },
  _updatePlaceholderLabel: function _updatePlaceholderLabel() {
    var placeholderLabel = this.placeholderLabel; // If placeholderLabel doesn't exist, create one.

    if (!placeholderLabel) {
      var node = this.node.getChildByName('PLACEHOLDER_LABEL');

      if (!node) {
        node = new cc.Node('PLACEHOLDER_LABEL');
      }

      placeholderLabel = node.getComponent(Label);

      if (!placeholderLabel) {
        placeholderLabel = node.addComponent(Label);
      }

      node.parent = this.node;
      this.placeholderLabel = placeholderLabel;
    } // update


    placeholderLabel.node.setAnchorPoint(0, 1);
    placeholderLabel.overflow = Label.Overflow.CLAMP;

    if (this.inputMode === InputMode.ANY) {
      placeholderLabel.verticalAlign = macro.VerticalTextAlignment.TOP;
      placeholderLabel.enableWrapText = true;
    } else {
      placeholderLabel.verticalAlign = macro.VerticalTextAlignment.CENTER;
      placeholderLabel.enableWrapText = false;
    }

    placeholderLabel.string = this.placeholder; // handle old data

    if (this._N$placeholderFontColor !== undefined) {
      placeholderLabel.node.color = this._N$placeholderFontColor;
      placeholderLabel.node.opacity = this._N$placeholderFontColor.a;
      this._N$placeholderFontColor = undefined;
    }

    if (this._N$placeholderFontSize !== undefined) {
      placeholderLabel.fontSize = this._N$placeholderFontSize;
      this._N$placeholderFontSize = undefined;
    }
  },
  _upgradeComp: function _upgradeComp() {
    if (this._N$returnType !== undefined) {
      this.returnType = this._N$returnType;
      this._N$returnType = undefined;
    }

    if (this._N$maxLength !== undefined) {
      this.maxLength = this._N$maxLength;
      this._N$maxLength = undefined;
    }

    if (this._N$backgroundImage !== undefined) {
      this._updateBackgroundSprite();
    }

    if (this._N$fontColor !== undefined || this._N$fontSize !== undefined || this._N$lineHeight !== undefined) {
      this._updateTextLabel();
    }

    if (this._N$placeholderFontColor !== undefined || this._N$placeholderFontSize !== undefined) {
      this._updatePlaceholderLabel();
    }

    if (this._N$placeholder !== undefined) {
      this.placeholder = this._N$placeholder;
      this._N$placeholder = undefined;
    }
  },
  _syncSize: function _syncSize() {
    if (this._impl) {
      var size = this.node.getContentSize();

      this._impl.setSize(size.width, size.height);
    }
  },
  _showLabels: function _showLabels() {
    this._isLabelVisible = true;

    this._updateLabels();
  },
  _hideLabels: function _hideLabels() {
    this._isLabelVisible = false;

    if (this.textLabel) {
      this.textLabel.node.active = false;
    }

    if (this.placeholderLabel) {
      this.placeholderLabel.node.active = false;
    }
  },
  _updateLabels: function _updateLabels() {
    if (this._isLabelVisible) {
      var content = this._string;

      if (this.textLabel) {
        this.textLabel.node.active = content !== '';
      }

      if (this.placeholderLabel) {
        this.placeholderLabel.node.active = content === '';
      }
    }
  },
  _updateString: function _updateString(text) {
    var textLabel = this.textLabel; // Not inited yet

    if (!textLabel) {
      return;
    }

    var displayText = text;

    if (displayText) {
      displayText = this._updateLabelStringStyle(displayText);
    }

    textLabel.string = displayText;

    this._updateLabels();
  },
  _updateLabelStringStyle: function _updateLabelStringStyle(text, ignorePassword) {
    var inputFlag = this.inputFlag;

    if (!ignorePassword && inputFlag === InputFlag.PASSWORD) {
      var passwordString = '';
      var len = text.length;

      for (var i = 0; i < len; ++i) {
        passwordString += "\u25CF";
      }

      text = passwordString;
    } else if (inputFlag === InputFlag.INITIAL_CAPS_ALL_CHARACTERS) {
      text = text.toUpperCase();
    } else if (inputFlag === InputFlag.INITIAL_CAPS_WORD) {
      text = capitalize(text);
    } else if (inputFlag === InputFlag.INITIAL_CAPS_SENTENCE) {
      text = capitalizeFirstLetter(text);
    }

    return text;
  },
  editBoxEditingDidBegan: function editBoxEditingDidBegan() {
    cc.Component.EventHandler.emitEvents(this.editingDidBegan, this);
    this.node.emit('editing-did-began', this);
  },
  editBoxEditingDidEnded: function editBoxEditingDidEnded() {
    cc.Component.EventHandler.emitEvents(this.editingDidEnded, this);
    this.node.emit('editing-did-ended', this);
  },
  editBoxTextChanged: function editBoxTextChanged(text) {
    text = this._updateLabelStringStyle(text, true);
    this.string = text;
    cc.Component.EventHandler.emitEvents(this.textChanged, text, this);
    this.node.emit('text-changed', this);
  },
  editBoxEditingReturn: function editBoxEditingReturn() {
    cc.Component.EventHandler.emitEvents(this.editingReturn, this);
    this.node.emit('editing-return', this);
  },
  onEnable: function onEnable() {
    if (!CC_EDITOR) {
      this._registerEvent();
    }

    if (this._impl) {
      this._impl.enable();
    }
  },
  onDisable: function onDisable() {
    if (!CC_EDITOR) {
      this._unregisterEvent();
    }

    if (this._impl) {
      this._impl.disable();
    }
  },
  onDestroy: function onDestroy() {
    if (this._impl) {
      this._impl.clear();
    }
  },
  __preload: function __preload() {
    this._init();
  },
  _registerEvent: function _registerEvent() {
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
  },
  _unregisterEvent: function _unregisterEvent() {
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
  },
  _onTouchBegan: function _onTouchBegan(event) {
    event.stopPropagation();
  },
  _onTouchCancel: function _onTouchCancel(event) {
    event.stopPropagation();
  },
  _onTouchEnded: function _onTouchEnded(event) {
    if (this._impl) {
      this._impl.beginEditing();
    }

    event.stopPropagation();
  },

  /**
   * !#en Let the EditBox get focus, this method will be removed on v2.1
   * !#zh 让当前 EditBox 获得焦点, 这个方法会在 v2.1 中移除
   * @method setFocus
   * @deprecated since 2.0.8
   */
  setFocus: function setFocus() {
    cc.warnID(1400, 'setFocus()', 'focus()');

    if (this._impl) {
      this._impl.setFocus(true);
    }
  },

  /**
   * !#en Let the EditBox get focus
   * !#zh 让当前 EditBox 获得焦点
   * @method focus
   */
  focus: function focus() {
    if (this._impl) {
      this._impl.setFocus(true);
    }
  },

  /**
   * !#en Let the EditBox lose focus
   * !#zh 让当前 EditBox 失去焦点
   * @method blur
   */
  blur: function blur() {
    if (this._impl) {
      this._impl.setFocus(false);
    }
  },

  /**
   * !#en Determine whether EditBox is getting focus or not.
   * !#zh 判断 EditBox 是否获得了焦点
   * @method isFocused
   */
  isFocused: function isFocused() {
    if (this._impl) {
      return this._impl.isFocused();
    } else {
      return false;
    }
  },
  update: function update() {
    if (this._impl) {
      this._impl.update();
    }
  }
});
cc.EditBox = module.exports = EditBox;

if (cc.sys.isBrowser) {
  require('./WebEditBoxImpl');
}
/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-began
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-did-ended
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event text-changed
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en
 * Note: This event is emitted from the node to which the component belongs.
 * !#zh
 * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
 * @event editing-return
 * @param {Event.EventCustom} event
 * @param {EditBox} editbox - The EditBox component.
 */

/**
 * !#en if you don't need the EditBox and it isn't in any running Scene, you should
 * call the destroy method on this component or the associated node explicitly.
 * Otherwise, the created DOM element won't be removed from web page.
 * !#zh
 * 如果你不再使用 EditBox，并且组件未添加到场景中，那么你必须手动对组件或所在节点调用 destroy。
 * 这样才能移除网页上的 DOM 节点，避免 Web 平台内存泄露。
 * @example
 * editbox.node.parent = null;  // or  editbox.node.removeFromParent(false);
 * // when you don't need editbox anymore
 * editbox.node.destroy();
 * @method destroy
 * @return {Boolean} whether it is the first time the destroy being called
 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDRWRpdEJveC5qcyJdLCJuYW1lcyI6WyJtYWNybyIsInJlcXVpcmUiLCJFZGl0Qm94SW1wbEJhc2UiLCJMYWJlbCIsIlR5cGVzIiwiSW5wdXRNb2RlIiwiSW5wdXRGbGFnIiwiS2V5Ym9hcmRSZXR1cm5UeXBlIiwiY2FwaXRhbGl6ZSIsInN0cmluZyIsInJlcGxhY2UiLCJhIiwidG9VcHBlckNhc2UiLCJjYXBpdGFsaXplRmlyc3RMZXR0ZXIiLCJjaGFyQXQiLCJzbGljZSIsIkVkaXRCb3giLCJjYyIsIkNsYXNzIiwibmFtZSIsIkNvbXBvbmVudCIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJpbnNwZWN0b3IiLCJoZWxwIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJwcm9wZXJ0aWVzIiwiX3VzZU9yaWdpbmFsU2l6ZSIsIl9zdHJpbmciLCJ0b29sdGlwIiwiQ0NfREVWIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJtYXhMZW5ndGgiLCJsZW5ndGgiLCJfdXBkYXRlU3RyaW5nIiwidGV4dExhYmVsIiwidHlwZSIsIm5vdGlmeSIsIm9sZFZhbHVlIiwiX3VwZGF0ZVRleHRMYWJlbCIsIl91cGRhdGVMYWJlbHMiLCJwbGFjZWhvbGRlckxhYmVsIiwiX3VwZGF0ZVBsYWNlaG9sZGVyTGFiZWwiLCJiYWNrZ3JvdW5kIiwiU3ByaXRlIiwiX3VwZGF0ZUJhY2tncm91bmRTcHJpdGUiLCJfTiRiYWNrZ3JvdW5kSW1hZ2UiLCJ1bmRlZmluZWQiLCJTcHJpdGVGcmFtZSIsImJhY2tncm91bmRJbWFnZSIsInNwcml0ZUZyYW1lIiwicmV0dXJuVHlwZSIsIkRFRkFVTFQiLCJkaXNwbGF5TmFtZSIsIl9OJHJldHVyblR5cGUiLCJGbG9hdCIsImlucHV0RmxhZyIsImlucHV0TW9kZSIsIkFOWSIsImZvbnRTaXplIiwiX04kZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwiX04kbGluZUhlaWdodCIsImZvbnRDb2xvciIsIm5vZGUiLCJjb2xvciIsIm9wYWNpdHkiLCJfTiRmb250Q29sb3IiLCJwbGFjZWhvbGRlciIsIl9OJHBsYWNlaG9sZGVyIiwiU3RyaW5nIiwicGxhY2Vob2xkZXJGb250U2l6ZSIsIl9OJHBsYWNlaG9sZGVyRm9udFNpemUiLCJwbGFjZWhvbGRlckZvbnRDb2xvciIsIl9OJHBsYWNlaG9sZGVyRm9udENvbG9yIiwiX04kbWF4TGVuZ3RoIiwic3RheU9uVG9wIiwid2FybiIsIl90YWJJbmRleCIsInRhYkluZGV4IiwiX2ltcGwiLCJzZXRUYWJJbmRleCIsImVkaXRpbmdEaWRCZWdhbiIsIkV2ZW50SGFuZGxlciIsInRleHRDaGFuZ2VkIiwiZWRpdGluZ0RpZEVuZGVkIiwiZWRpdGluZ1JldHVybiIsInN0YXRpY3MiLCJfSW1wbENsYXNzIiwiX2luaXQiLCJfdXBncmFkZUNvbXAiLCJfaXNMYWJlbFZpc2libGUiLCJvbiIsIk5vZGUiLCJFdmVudFR5cGUiLCJTSVpFX0NIQU5HRUQiLCJfc3luY1NpemUiLCJpbXBsIiwiaW5pdCIsImdldENoaWxkQnlOYW1lIiwiZ2V0Q29tcG9uZW50IiwiYWRkQ29tcG9uZW50IiwicGFyZW50IiwiVHlwZSIsIlNMSUNFRCIsInNldEFuY2hvclBvaW50Iiwib3ZlcmZsb3ciLCJPdmVyZmxvdyIsIkNMQU1QIiwidmVydGljYWxBbGlnbiIsIlZlcnRpY2FsVGV4dEFsaWdubWVudCIsIlRPUCIsImVuYWJsZVdyYXBUZXh0IiwiQ0VOVEVSIiwiX3VwZGF0ZUxhYmVsU3RyaW5nU3R5bGUiLCJzaXplIiwiZ2V0Q29udGVudFNpemUiLCJzZXRTaXplIiwid2lkdGgiLCJoZWlnaHQiLCJfc2hvd0xhYmVscyIsIl9oaWRlTGFiZWxzIiwiYWN0aXZlIiwiY29udGVudCIsInRleHQiLCJkaXNwbGF5VGV4dCIsImlnbm9yZVBhc3N3b3JkIiwiUEFTU1dPUkQiLCJwYXNzd29yZFN0cmluZyIsImxlbiIsImkiLCJJTklUSUFMX0NBUFNfQUxMX0NIQVJBQ1RFUlMiLCJJTklUSUFMX0NBUFNfV09SRCIsIklOSVRJQUxfQ0FQU19TRU5URU5DRSIsImVkaXRCb3hFZGl0aW5nRGlkQmVnYW4iLCJlbWl0RXZlbnRzIiwiZW1pdCIsImVkaXRCb3hFZGl0aW5nRGlkRW5kZWQiLCJlZGl0Qm94VGV4dENoYW5nZWQiLCJlZGl0Qm94RWRpdGluZ1JldHVybiIsIm9uRW5hYmxlIiwiX3JlZ2lzdGVyRXZlbnQiLCJlbmFibGUiLCJvbkRpc2FibGUiLCJfdW5yZWdpc3RlckV2ZW50IiwiZGlzYWJsZSIsIm9uRGVzdHJveSIsImNsZWFyIiwiX19wcmVsb2FkIiwiVE9VQ0hfU1RBUlQiLCJfb25Ub3VjaEJlZ2FuIiwiVE9VQ0hfRU5EIiwiX29uVG91Y2hFbmRlZCIsIm9mZiIsImV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiX29uVG91Y2hDYW5jZWwiLCJiZWdpbkVkaXRpbmciLCJzZXRGb2N1cyIsIndhcm5JRCIsImZvY3VzIiwiYmx1ciIsImlzRm9jdXNlZCIsInVwZGF0ZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJzeXMiLCJpc0Jyb3dzZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyx3QkFBRCxDQUFyQjs7QUFDQSxJQUFNQyxlQUFlLEdBQUdELE9BQU8sQ0FBQyw0QkFBRCxDQUEvQjs7QUFDQSxJQUFNRSxLQUFLLEdBQUdGLE9BQU8sQ0FBQyxZQUFELENBQXJCOztBQUNBLElBQU1HLEtBQUssR0FBR0gsT0FBTyxDQUFDLFNBQUQsQ0FBckI7O0FBQ0EsSUFBTUksU0FBUyxHQUFHRCxLQUFLLENBQUNDLFNBQXhCO0FBQ0EsSUFBTUMsU0FBUyxHQUFHRixLQUFLLENBQUNFLFNBQXhCO0FBQ0EsSUFBTUMsa0JBQWtCLEdBQUdILEtBQUssQ0FBQ0csa0JBQWpDOztBQUVBLFNBQVNDLFVBQVQsQ0FBcUJDLE1BQXJCLEVBQTZCO0FBQ3pCLFNBQU9BLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlLGFBQWYsRUFBOEIsVUFBU0MsQ0FBVCxFQUFZO0FBQUUsV0FBT0EsQ0FB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QUNDLE9BQVAsR0FBaUJ4SixPQUE5Qjs7QUFFQSxJQUFJQyxFQUFFLENBQUN3SixHQUFILENBQU9DLFNBQVgsRUFBc0I7QUFDbEJ6SyxFQUFBQSxPQUFPLENBQUMsa0JBQUQsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7QUFVQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBtYWNybyA9IHJlcXVpcmUoJy4uLy4uL3BsYXRmb3JtL0NDTWFjcm8nKTtcbmNvbnN0IEVkaXRCb3hJbXBsQmFzZSA9IHJlcXVpcmUoJy4uL2VkaXRib3gvRWRpdEJveEltcGxCYXNlJyk7XG5jb25zdCBMYWJlbCA9IHJlcXVpcmUoJy4uL0NDTGFiZWwnKTtcbmNvbnN0IFR5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpO1xuY29uc3QgSW5wdXRNb2RlID0gVHlwZXMuSW5wdXRNb2RlO1xuY29uc3QgSW5wdXRGbGFnID0gVHlwZXMuSW5wdXRGbGFnO1xuY29uc3QgS2V5Ym9hcmRSZXR1cm5UeXBlID0gVHlwZXMuS2V5Ym9hcmRSZXR1cm5UeXBlO1xuXG5mdW5jdGlvbiBjYXBpdGFsaXplIChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyg/Ol58XFxzKVxcUy9nLCBmdW5jdGlvbihhKSB7IHJldHVybiBhLnRvVXBwZXJDYXNlKCk7IH0pO1xufVxuXG5mdW5jdGlvbiBjYXBpdGFsaXplRmlyc3RMZXR0ZXIgKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSk7XG59XG5cblxuLyoqXG4gKiAhI2VuIGNjLkVkaXRCb3ggaXMgYSBjb21wb25lbnQgZm9yIGlucHV0aW5nIHRleHQsIHlvdSBjYW4gdXNlIGl0IHRvIGdhdGhlciBzbWFsbCBhbW91bnRzIG9mIHRleHQgZnJvbSB1c2Vycy5cbiAqICEjemggRWRpdEJveCDnu4Tku7bvvIznlKjkuo7ojrflj5bnlKjmiLfnmoTovpPlhaXmlofmnKzjgIJcbiAqIEBjbGFzcyBFZGl0Qm94XG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xubGV0IEVkaXRCb3ggPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLkVkaXRCb3gnLFxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC51aS9FZGl0Qm94JyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9jY2VkaXRib3guanMnLFxuICAgICAgICBoZWxwOiAnaTE4bjpDT01QT05FTlQuaGVscF91cmwuZWRpdGJveCcsXG4gICAgICAgIGV4ZWN1dGVJbkVkaXRNb2RlOiB0cnVlLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF91c2VPcmlnaW5hbFNpemU6IHRydWUsXG4gICAgICAgIF9zdHJpbmc6ICcnLFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJbnB1dCBzdHJpbmcgb2YgRWRpdEJveC5cbiAgICAgICAgICogISN6aCDovpPlhaXmoYbnmoTliJ3lp4vovpPlhaXlhoXlrrnvvIzlpoLmnpzkuLrnqbrliJnkvJrmmL7npLrljaDkvY3nrKbnmoTmlofmnKzjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHN0cmluZ1xuICAgICAgICAgKi9cbiAgICAgICAgc3RyaW5nOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmVkaXRib3guc3RyaW5nJyxcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0cmluZztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICcnICsgdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4TGVuZ3RoID49IDAgJiYgdmFsdWUubGVuZ3RoID49IHRoaXMubWF4TGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMCwgdGhpcy5tYXhMZW5ndGgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX3N0cmluZyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN0cmluZyh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIExhYmVsIGNvbXBvbmVudCBhdHRhY2hlZCB0byB0aGUgbm9kZSBmb3IgRWRpdEJveCdzIGlucHV0IHRleHQgbGFiZWxcbiAgICAgICAgICogISN6aCDovpPlhaXmoYbovpPlhaXmlofmnKzoioLngrnkuIrmjILovb3nmoQgTGFiZWwg57uE5Lu25a+56LGhXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TGFiZWx9IHRleHRMYWJlbFxuICAgICAgICAgKi9cbiAgICAgICAgdGV4dExhYmVsOiB7XG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmVkaXRib3gudGV4dExhYmVsJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBMYWJlbCxcbiAgICAgICAgICAgIG5vdGlmeSAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0TGFiZWwgJiYgdGhpcy50ZXh0TGFiZWwgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRleHRMYWJlbCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMYWJlbHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgTGFiZWwgY29tcG9uZW50IGF0dGFjaGVkIHRvIHRoZSBub2RlIGZvciBFZGl0Qm94J3MgcGxhY2Vob2xkZXIgdGV4dCBsYWJlbFxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhuWNoOS9jeespuiKgueCueS4iuaMgui9veeahCBMYWJlbCDnu4Tku7blr7nosaFcbiAgICAgICAgICogQHByb3BlcnR5IHtMYWJlbH0gcGxhY2Vob2xkZXJMYWJlbFxuICAgICAgICAgKi9cbiAgICAgICAgcGxhY2Vob2xkZXJMYWJlbDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5lZGl0Ym94LnBsYWNlaG9sZGVyTGFiZWwnLFxuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IExhYmVsLFxuICAgICAgICAgICAgbm90aWZ5IChvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyTGFiZWwgJiYgdGhpcy5wbGFjZWhvbGRlckxhYmVsICE9PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVQbGFjZWhvbGRlckxhYmVsKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxhYmVscygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIFNwcml0ZSBjb21wb25lbnQgYXR0YWNoZWQgdG8gdGhlIG5vZGUgZm9yIEVkaXRCb3gncyBiYWNrZ3JvdW5kXG4gICAgICAgICAqICEjemgg6L6T5YWl5qGG6IOM5pmv6IqC54K55LiK5oyC6L2955qEIFNwcml0ZSDnu4Tku7blr7nosaFcbiAgICAgICAgICogQHByb3BlcnR5IHtTcHJpdGV9IGJhY2tncm91bmRcbiAgICAgICAgICovXG4gICAgICAgIGJhY2tncm91bmQ6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC5iYWNrZ3JvdW5kJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGUsXG4gICAgICAgICAgICBub3RpZnkgKG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZCAmJiB0aGlzLmJhY2tncm91bmQgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUJhY2tncm91bmRTcHJpdGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRvIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZVxuICAgICAgICBfTiRiYWNrZ3JvdW5kSW1hZ2U6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBiYWNrZ3JvdW5kIGltYWdlIG9mIEVkaXRCb3guIFRoaXMgcHJvcGVydHkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmUsIHVzZSBlZGl0Qm94LmJhY2tncm91bmQgaW5zdGVhZCBwbGVhc2UuXG4gICAgICAgICAqICEjemgg6L6T5YWl5qGG55qE6IOM5pmv5Zu+54mH44CCIOivpeWxnuaAp+S8muWcqOWwhuadpeeahOeJiOacrOS4reenu+mZpO+8jOivt+eUqCBlZGl0Qm94LmJhY2tncm91bmRcbiAgICAgICAgICogQHByb3BlcnR5IHtTcHJpdGVGcmFtZX0gYmFja2dyb3VuZEltYWdlXG4gICAgICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjFcbiAgICAgICAgICovXG4gICAgICAgIGJhY2tncm91bmRJbWFnZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIUNDX0VESVRPUikgY2Mud2FybklEKDU0MDAsICdlZGl0Qm94LmJhY2tncm91bmRJbWFnZScsICdlZGl0Qm94LmJhY2tncm91bmQnKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYmFja2dyb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYmFja2dyb3VuZC5zcHJpdGVGcmFtZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFDQ19FRElUT1IpIGNjLndhcm5JRCg1NDAwLCAnZWRpdEJveC5iYWNrZ3JvdW5kSW1hZ2UnLCAnZWRpdEJveC5iYWNrZ3JvdW5kJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYmFja2dyb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmQuc3ByaXRlRnJhbWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSByZXR1cm4ga2V5IHR5cGUgb2YgRWRpdEJveC5cbiAgICAgICAgICogTm90ZTogaXQgaXMgbWVhbmluZ2xlc3MgZm9yIHdlYiBwbGF0Zm9ybXMgYW5kIGRlc2t0b3AgcGxhdGZvcm1zLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaMh+Wumuenu+WKqOiuvuWkh+S4iumdouWbnui9puaMiemSrueahOagt+W8j+OAglxuICAgICAgICAgKiDms6jmhI/vvJrov5nkuKrpgInpobnlr7kgd2ViIOW5s+WPsOS4jiBkZXNrdG9wIOW5s+WPsOaXoOaViOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0VkaXRCb3guS2V5Ym9hcmRSZXR1cm5UeXBlfSByZXR1cm5UeXBlXG4gICAgICAgICAqIEBkZWZhdWx0IEtleWJvYXJkUmV0dXJuVHlwZS5ERUZBVUxUXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm5UeXBlOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBLZXlib2FyZFJldHVyblR5cGUuREVGQVVMVCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC5yZXR1cm5UeXBlJyxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnS2V5Ym9hcmRSZXR1cm5UeXBlJyxcbiAgICAgICAgICAgIHR5cGU6IEtleWJvYXJkUmV0dXJuVHlwZSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUbyBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmVcbiAgICAgICAgX04kcmV0dXJuVHlwZToge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gU2V0IHRoZSBpbnB1dCBmbGFncyB0aGF0IGFyZSB0byBiZSBhcHBsaWVkIHRvIHRoZSBFZGl0Qm94LlxuICAgICAgICAgKiAhI3poIOaMh+Wumui+k+WFpeagh+W/l+S9je+8jOWPr+S7peaMh+Wumui+k+WFpeaWueW8j+S4uuWvhueggeaIluiAheWNleivjemmluWtl+avjeWkp+WGmeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0VkaXRCb3guSW5wdXRGbGFnfSBpbnB1dEZsYWdcbiAgICAgICAgICogQGRlZmF1bHQgSW5wdXRGbGFnLkRFRkFVTFRcbiAgICAgICAgICovXG4gICAgICAgIGlucHV0RmxhZzoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5lZGl0Ym94LmlucHV0X2ZsYWcnLFxuICAgICAgICAgICAgZGVmYXVsdDogSW5wdXRGbGFnLkRFRkFVTFQsXG4gICAgICAgICAgICB0eXBlOiBJbnB1dEZsYWcsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN0cmluZyh0aGlzLl9zdHJpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBTZXQgdGhlIGlucHV0IG1vZGUgb2YgdGhlIGVkaXQgYm94LlxuICAgICAgICAgKiBJZiB5b3UgcGFzcyBBTlksIGl0IHdpbGwgY3JlYXRlIGEgbXVsdGlsaW5lIEVkaXRCb3guXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5oyH5a6a6L6T5YWl5qih5byPOiBBTlnooajnpLrlpJrooYzovpPlhaXvvIzlhbblroPpg73mmK/ljZXooYzovpPlhaXvvIznp7vliqjlubPlj7DkuIrov5jlj6/ku6XmjIflrprplK7nm5jmoLflvI/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtFZGl0Qm94LklucHV0TW9kZX0gaW5wdXRNb2RlXG4gICAgICAgICAqIEBkZWZhdWx0IElucHV0TW9kZS5BTllcbiAgICAgICAgICovXG4gICAgICAgIGlucHV0TW9kZToge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5lZGl0Ym94LmlucHV0X21vZGUnLFxuICAgICAgICAgICAgZGVmYXVsdDogSW5wdXRNb2RlLkFOWSxcbiAgICAgICAgICAgIHR5cGU6IElucHV0TW9kZSxcbiAgICAgICAgICAgIG5vdGlmeSAob2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnB1dE1vZGUgIT09IG9sZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRleHRMYWJlbCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVQbGFjZWhvbGRlckxhYmVsKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEZvbnQgc2l6ZSBvZiB0aGUgaW5wdXQgdGV4dC4gVGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZSwgdXNlIGVkaXRCb3gudGV4dExhYmVsLmZvbnRTaXplIGluc3RlYWQgcGxlYXNlLlxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhuaWh+acrOeahOWtl+S9k+Wkp+Wwj+OAgiDor6XlsZ7mgKfkvJrlnKjlsIbmnaXnmoTniYjmnKzkuK3np7vpmaTvvIzor7fkvb/nlKggZWRpdEJveC50ZXh0TGFiZWwuZm9udFNpemXjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZvbnRTaXplXG4gICAgICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjFcbiAgICAgICAgICovXG4gICAgICAgIGZvbnRTaXplOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoNTQwMCwgJ2VkaXRCb3guZm9udFNpemUnLCAnZWRpdEJveC50ZXh0TGFiZWwuZm9udFNpemUnKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudGV4dExhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0TGFiZWwuZm9udFNpemU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoNTQwMCwgJ2VkaXRCb3guZm9udFNpemUnLCAnZWRpdEJveC50ZXh0TGFiZWwuZm9udFNpemUnKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0TGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0TGFiZWwuZm9udFNpemUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFRvIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZVxuICAgICAgICBfTiRmb250U2l6ZToge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQ2hhbmdlIHRoZSBsaW5lSGVpZ2h0IG9mIGRpc3BsYXllZCB0ZXh0LiBUaGlzIHByb3BlcnR5IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLCB1c2UgZWRpdEJveC50ZXh0TGFiZWwubGluZUhlaWdodCBpbnN0ZWFkLlxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhuaWh+acrOeahOihjOmrmOOAguivpeWxnuaAp+S8muWcqOWwhuadpeeahOeJiOacrOS4reenu+mZpO+8jOivt+S9v+eUqCBlZGl0Qm94LnRleHRMYWJlbC5saW5lSGVpZ2h0XG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsaW5lSGVpZ2h0XG4gICAgICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjFcbiAgICAgICAgICovXG4gICAgICAgIGxpbmVIZWlnaHQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFDQ19FRElUT1IpIGNjLndhcm5JRCg1NDAwLCAnZWRpdEJveC5saW5lSGVpZ2h0JywgJ2VkaXRCb3gudGV4dExhYmVsLmxpbmVIZWlnaHQnKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudGV4dExhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0TGFiZWwubGluZUhlaWdodDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFDQ19FRElUT1IpIGNjLndhcm5JRCg1NDAwLCAnZWRpdEJveC5saW5lSGVpZ2h0JywgJ2VkaXRCb3gudGV4dExhYmVsLmxpbmVIZWlnaHQnKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0TGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0TGFiZWwubGluZUhlaWdodCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgIF9OJGxpbmVIZWlnaHQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEZvbnQgY29sb3Igb2YgdGhlIGlucHV0IHRleHQuIFRoaXMgcHJvcGVydHkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmUsIHVzZSBlZGl0Qm94LnRleHRMYWJlbC5ub2RlLmNvbG9yIGluc3RlYWQuXG4gICAgICAgICAqICEjemgg6L6T5YWl5qGG5paH5pys55qE6aKc6Imy44CC6K+l5bGe5oCn5Lya5Zyo5bCG5p2l55qE54mI5pys5Lit56e76Zmk77yM6K+35L2/55SoIGVkaXRCb3gudGV4dExhYmVsLm5vZGUuY29sb3JcbiAgICAgICAgICogQHByb3BlcnR5IHtDb2xvcn0gZm9udENvbG9yXG4gICAgICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjFcbiAgICAgICAgICovXG4gICAgICAgIGZvbnRDb2xvcjoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIUNDX0VESVRPUikgY2Mud2FybklEKDU0MDAsICdlZGl0Qm94LmZvbnRDb2xvcicsICdlZGl0Qm94LnRleHRMYWJlbC5ub2RlLmNvbG9yJyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnRleHRMYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dExhYmVsLm5vZGUuY29sb3I7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoNTQwMCwgJ2VkaXRCb3guZm9udENvbG9yJywgJ2VkaXRCb3gudGV4dExhYmVsLm5vZGUuY29sb3InKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0TGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0TGFiZWwubm9kZS5jb2xvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRMYWJlbC5ub2RlLm9wYWNpdHkgPSB2YWx1ZS5hO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgIF9OJGZvbnRDb2xvcjogdW5kZWZpbmVkLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBkaXNwbGF5IHRleHQgb2YgcGxhY2Vob2xkZXIuXG4gICAgICAgICAqICEjemgg6L6T5YWl5qGG5Y2g5L2N56ym55qE5paH5pys5YaF5a6544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwbGFjZWhvbGRlclxuICAgICAgICAgKi9cbiAgICAgICAgcGxhY2Vob2xkZXI6IHtcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZWRpdGJveC5wbGFjZWhvbGRlcicsXG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5zdHJpbmc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlckxhYmVsLnN0cmluZyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUbyBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmVcbiAgICAgICAgX04kcGxhY2Vob2xkZXI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlN0cmluZyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgZm9udCBzaXplIG9mIHBsYWNlaG9sZGVyLiBUaGlzIHByb3BlcnR5IHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLCB1c2UgZWRpdEJveC5wbGFjZWhvbGRlckxhYmVsLmZvbnRTaXplIGluc3RlYWQuXG4gICAgICAgICAqICEjemgg6L6T5YWl5qGG5Y2g5L2N56ym55qE5a2X5L2T5aSn5bCP44CC6K+l5bGe5oCn5Lya5Zyo5bCG5p2l55qE54mI5pys5Lit56e76Zmk77yM6K+35L2/55SoIGVkaXRCb3gucGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZVxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcGxhY2Vob2xkZXJGb250U2l6ZVxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xXG4gICAgICAgICAqL1xuICAgICAgICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIC8vIGlmICghQ0NfRURJVE9SKSBjYy53YXJuSUQoNTQwMCwgJ2VkaXRCb3gucGxhY2Vob2xkZXJGb250U2l6ZScsICdlZGl0Qm94LnBsYWNlaG9sZGVyTGFiZWwuZm9udFNpemUnKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGxhY2Vob2xkZXJMYWJlbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFDQ19FRElUT1IpIGNjLndhcm5JRCg1NDAwLCAnZWRpdEJveC5wbGFjZWhvbGRlckZvbnRTaXplJywgJ2VkaXRCb3gucGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZScpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlckxhYmVsLmZvbnRTaXplID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUbyBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmVcbiAgICAgICAgX04kcGxhY2Vob2xkZXJGb250U2l6ZToge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGZvbnQgY29sb3Igb2YgcGxhY2Vob2xkZXIuIFRoaXMgcHJvcGVydHkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmUsIHVzZSBlZGl0Qm94LnBsYWNlaG9sZGVyTGFiZWwubm9kZS5jb2xvciBpbnN0ZWFkLlxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhuWNoOS9jeespueahOWtl+S9k+minOiJsuOAguivpeWxnuaAp+S8muWcqOWwhuadpeeahOeJiOacrOS4reenu+mZpO+8jOivt+S9v+eUqCBlZGl0Qm94LnBsYWNlaG9sZGVyTGFiZWwubm9kZS5jb2xvclxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbG9yfSBwbGFjZWhvbGRlckZvbnRDb2xvclxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xXG4gICAgICAgICAqL1xuICAgICAgICBwbGFjZWhvbGRlckZvbnRDb2xvcjoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiAoIUNDX0VESVRPUikgY2Mud2FybklEKDU0MDAsICdlZGl0Qm94LnBsYWNlaG9sZGVyRm9udENvbG9yJywgJ2VkaXRCb3gucGxhY2Vob2xkZXJMYWJlbC5ub2RlLmNvbG9yJyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYWNlaG9sZGVyTGFiZWwubm9kZS5jb2xvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgKCFDQ19FRElUT1IpIGNjLndhcm5JRCg1NDAwLCAnZWRpdEJveC5wbGFjZWhvbGRlckZvbnRDb2xvcicsICdlZGl0Qm94LnBsYWNlaG9sZGVyTGFiZWwubm9kZS5jb2xvcicpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlckxhYmVsLm5vZGUuY29sb3IgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlckxhYmVsLm5vZGUub3BhY2l0eSA9IHZhbHVlLmE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBUbyBiZSByZW1vdmVkIGluIHRoZSBmdXR1cmVcbiAgICAgICAgX04kcGxhY2Vob2xkZXJGb250Q29sb3I6IHVuZGVmaW5lZCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbWF4aW1pemUgaW5wdXQgbGVuZ3RoIG9mIEVkaXRCb3guXG4gICAgICAgICAqIC0gSWYgcGFzcyBhIHZhbHVlIGxlc3MgdGhhbiAwLCBpdCB3b24ndCBsaW1pdCB0aGUgaW5wdXQgbnVtYmVyIG9mIGNoYXJhY3RlcnMuXG4gICAgICAgICAqIC0gSWYgcGFzcyAwLCBpdCBkb2Vzbid0IGFsbG93IGlucHV0IGFueSBjaGFyYWN0ZXJzLlxuICAgICAgICAgKiAhI3poIOi+k+WFpeahhuacgOWkp+WFgeiuuOi+k+WFpeeahOWtl+espuS4quaVsOOAglxuICAgICAgICAgKiAtIOWmguaenOWAvOS4uuWwj+S6jiAwIOeahOWAvO+8jOWImeS4jeS8mumZkOWItui+k+WFpeWtl+espuS4quaVsOOAglxuICAgICAgICAgKiAtIOWmguaenOWAvOS4uiAw77yM5YiZ5LiN5YWB6K6455So5oi36L+b6KGM5Lu75L2V6L6T5YWl44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBtYXhMZW5ndGhcbiAgICAgICAgICovXG4gICAgICAgIG1heExlbmd0aDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5lZGl0Ym94Lm1heF9sZW5ndGgnLFxuICAgICAgICAgICAgZGVmYXVsdDogMjAsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gVG8gYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlXG4gICAgICAgIF9OJG1heExlbmd0aDoge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGlucHV0IGlzIGFsd2F5cyB2aXNpYmxlIGFuZCBiZSBvbiB0b3Agb2YgdGhlIGdhbWUgdmlldyAob25seSB1c2VmdWwgb24gV2ViKSwgdGhpcyBwcm9wZXJ0eSB3aWxsIGJlIHJlbW92ZWQgb24gdjIuMVxuICAgICAgICAgKiAhemgg6L6T5YWl5qGG5oC75piv5Y+v6KeB77yM5bm25LiU5rC46L+c5Zyo5ri45oiP6KeG5Zu+55qE5LiK6Z2i77yI6L+Z5Liq5bGe5oCn5Y+q5pyJ5ZyoIFdlYiDkuIrpnaLkv67mlLnmnInmhI/kuYnvvInvvIzor6XlsZ7mgKfkvJrlnKggdjIuMSDkuK3np7vpmaRcbiAgICAgICAgICogTm90ZTogb25seSBhdmFpbGFibGUgb24gV2ViIGF0IHRoZSBtb21lbnQuXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gc3RheU9uVG9wXG4gICAgICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIDIuMC44XG4gICAgICAgICAqL1xuICAgICAgICBzdGF5T25Ub3A6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKCdlZGl0Qm94LnN0YXlPblRvcCBpcyByZW1vdmVkIHNpbmNlIHYyLjEuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3RhYkluZGV4OiAwLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFNldCB0aGUgdGFiSW5kZXggb2YgdGhlIERPTSBpbnB1dCBlbGVtZW50IChvbmx5IHVzZWZ1bCBvbiBXZWIpLlxuICAgICAgICAgKiAhI3poIOS/ruaUuSBET00g6L6T5YWl5YWD57Sg55qEIHRhYkluZGV477yI6L+Z5Liq5bGe5oCn5Y+q5pyJ5ZyoIFdlYiDkuIrpnaLkv67mlLnmnInmhI/kuYnvvInjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRhYkluZGV4XG4gICAgICAgICAqL1xuICAgICAgICB0YWJJbmRleDoge1xuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5lZGl0Ym94LnRhYl9pbmRleCcsXG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJJbmRleDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RhYkluZGV4ICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90YWJJbmRleCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW1wbC5zZXRUYWJJbmRleCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGV2ZW50IGhhbmRsZXIgdG8gYmUgY2FsbGVkIHdoZW4gRWRpdEJveCBiZWdhbiB0byBlZGl0IHRleHQuXG4gICAgICAgICAqICEjemgg5byA5aeL57yW6L6R5paH5pys6L6T5YWl5qGG6Kem5Y+R55qE5LqL5Lu25Zue6LCD44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29tcG9uZW50LkV2ZW50SGFuZGxlcltdfSBlZGl0aW5nRGlkQmVnYW5cbiAgICAgICAgICovXG4gICAgICAgIGVkaXRpbmdEaWRCZWdhbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBldmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZCB3aGVuIEVkaXRCb3ggdGV4dCBjaGFuZ2VzLlxuICAgICAgICAgKiAhI3poIOe8lui+keaWh+acrOi+k+WFpeahhuaXtuinpuWPkeeahOS6i+S7tuWbnuiwg+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbXBvbmVudC5FdmVudEhhbmRsZXJbXX0gdGV4dENoYW5nZWRcbiAgICAgICAgICovXG4gICAgICAgIHRleHRDaGFuZ2VkOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIGV2ZW50IGhhbmRsZXIgdG8gYmUgY2FsbGVkIHdoZW4gRWRpdEJveCBlZGl0IGVuZHMuXG4gICAgICAgICAqICEjemgg57uT5p2f57yW6L6R5paH5pys6L6T5YWl5qGG5pe26Kem5Y+R55qE5LqL5Lu25Zue6LCD44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Q29tcG9uZW50LkV2ZW50SGFuZGxlcltdfSBlZGl0aW5nRGlkRW5kZWRcbiAgICAgICAgICovXG4gICAgICAgIGVkaXRpbmdEaWRFbmRlZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBldmVudCBoYW5kbGVyIHRvIGJlIGNhbGxlZCB3aGVuIHJldHVybiBrZXkgaXMgcHJlc3NlZC4gV2luZG93cyBpcyBub3Qgc3VwcG9ydGVkLlxuICAgICAgICAgKiAhI3poIOW9k+eUqOaIt+aMieS4i+Wbnui9puaMiemUruaXtueahOS6i+S7tuWbnuiwg++8jOebruWJjeS4jeaUr+aMgSB3aW5kb3dzIOW5s+WPsFxuICAgICAgICAgKiBAcHJvcGVydHkge0NvbXBvbmVudC5FdmVudEhhbmRsZXJbXX0gZWRpdGluZ1JldHVyblxuICAgICAgICAgKi9cbiAgICAgICAgZWRpdGluZ1JldHVybjoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyXG4gICAgICAgIH1cblxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIF9JbXBsQ2xhc3M6IEVkaXRCb3hJbXBsQmFzZSwgIC8vIGltcGxlbWVudGVkIG9uIGRpZmZlcmVudCBwbGF0Zm9ybSBhZGFwdGVyXG4gICAgICAgIEtleWJvYXJkUmV0dXJuVHlwZTogS2V5Ym9hcmRSZXR1cm5UeXBlLFxuICAgICAgICBJbnB1dEZsYWc6IElucHV0RmxhZyxcbiAgICAgICAgSW5wdXRNb2RlOiBJbnB1dE1vZGVcbiAgICB9LFxuXG4gICAgX2luaXQgKCkge1xuICAgICAgICB0aGlzLl91cGdyYWRlQ29tcCgpO1xuXG4gICAgICAgIHRoaXMuX2lzTGFiZWxWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fc3luY1NpemUsIHRoaXMpO1xuXG4gICAgICAgIGxldCBpbXBsID0gdGhpcy5faW1wbCA9IG5ldyBFZGl0Qm94Ll9JbXBsQ2xhc3MoKTtcbiAgICAgICAgaW1wbC5pbml0KHRoaXMpO1xuXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0cmluZyh0aGlzLl9zdHJpbmcpO1xuICAgICAgICB0aGlzLl9zeW5jU2l6ZSgpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlQmFja2dyb3VuZFNwcml0ZSAoKSB7XG4gICAgICAgIGxldCBiYWNrZ3JvdW5kID0gdGhpcy5iYWNrZ3JvdW5kO1xuXG4gICAgICAgIC8vIElmIGJhY2tncm91bmQgZG9lc24ndCBleGlzdCwgY3JlYXRlIG9uZS5cbiAgICAgICAgaWYgKCFiYWNrZ3JvdW5kKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnQkFDS0dST1VORF9TUFJJVEUnKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBuZXcgY2MuTm9kZSgnQkFDS0dST1VORF9TUFJJVEUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYmFja2dyb3VuZCA9IG5vZGUuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgICAgICBpZiAoIWJhY2tncm91bmQpIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kID0gbm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZVxuICAgICAgICBiYWNrZ3JvdW5kLnR5cGUgPSBjYy5TcHJpdGUuVHlwZS5TTElDRUQ7XG4gICAgICAgIFxuICAgICAgICAvLyBoYW5kbGUgb2xkIGRhdGFcbiAgICAgICAgaWYgKHRoaXMuX04kYmFja2dyb3VuZEltYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQuc3ByaXRlRnJhbWUgPSB0aGlzLl9OJGJhY2tncm91bmRJbWFnZTtcbiAgICAgICAgICAgIHRoaXMuX04kYmFja2dyb3VuZEltYWdlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVUZXh0TGFiZWwgKCkge1xuICAgICAgICBsZXQgdGV4dExhYmVsID0gdGhpcy50ZXh0TGFiZWw7XG5cbiAgICAgICAgLy8gSWYgdGV4dExhYmVsIGRvZXNuJ3QgZXhpc3QsIGNyZWF0ZSBvbmUuXG4gICAgICAgIGlmICghdGV4dExhYmVsKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnVEVYVF9MQUJFTCcpO1xuICAgICAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5ldyBjYy5Ob2RlKCdURVhUX0xBQkVMJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZXh0TGFiZWwgPSBub2RlLmdldENvbXBvbmVudChMYWJlbCk7XG4gICAgICAgICAgICBpZiAoIXRleHRMYWJlbCkge1xuICAgICAgICAgICAgICAgIHRleHRMYWJlbCA9IG5vZGUuYWRkQ29tcG9uZW50KExhYmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgdGhpcy50ZXh0TGFiZWwgPSB0ZXh0TGFiZWw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGVcbiAgICAgICAgdGV4dExhYmVsLm5vZGUuc2V0QW5jaG9yUG9pbnQoMCwgMSk7XG4gICAgICAgIHRleHRMYWJlbC5vdmVyZmxvdyA9IExhYmVsLk92ZXJmbG93LkNMQU1QO1xuICAgICAgICBpZiAodGhpcy5pbnB1dE1vZGUgPT09IElucHV0TW9kZS5BTlkpIHtcbiAgICAgICAgICAgIHRleHRMYWJlbC52ZXJ0aWNhbEFsaWduID0gbWFjcm8uVmVydGljYWxUZXh0QWxpZ25tZW50LlRPUDtcbiAgICAgICAgICAgIHRleHRMYWJlbC5lbmFibGVXcmFwVGV4dCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0ZXh0TGFiZWwudmVydGljYWxBbGlnbiA9IG1hY3JvLlZlcnRpY2FsVGV4dEFsaWdubWVudC5DRU5URVI7XG4gICAgICAgICAgICB0ZXh0TGFiZWwuZW5hYmxlV3JhcFRleHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0ZXh0TGFiZWwuc3RyaW5nID0gdGhpcy5fdXBkYXRlTGFiZWxTdHJpbmdTdHlsZSh0aGlzLl9zdHJpbmcpO1xuXG4gICAgICAgIC8vIGhhbmRsZSBvbGQgZGF0YVxuICAgICAgICBpZiAodGhpcy5fTiRmb250Q29sb3IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGV4dExhYmVsLm5vZGUuY29sb3IgPSB0aGlzLl9OJGZvbnRDb2xvcjtcbiAgICAgICAgICAgIHRleHRMYWJlbC5ub2RlLm9wYWNpdHkgPSB0aGlzLl9OJGZvbnRDb2xvci5hO1xuICAgICAgICAgICAgdGhpcy5fTiRmb250Q29sb3IgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX04kZm9udFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGV4dExhYmVsLmZvbnRTaXplID0gdGhpcy5fTiRmb250U2l6ZTtcbiAgICAgICAgICAgIHRoaXMuX04kZm9udFNpemUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX04kbGluZUhlaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0ZXh0TGFiZWwubGluZUhlaWdodCA9IHRoaXMuX04kbGluZUhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuX04kbGluZUhlaWdodCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlUGxhY2Vob2xkZXJMYWJlbCAoKSB7XG4gICAgICAgIGxldCBwbGFjZWhvbGRlckxhYmVsID0gdGhpcy5wbGFjZWhvbGRlckxhYmVsO1xuXG4gICAgICAgIC8vIElmIHBsYWNlaG9sZGVyTGFiZWwgZG9lc24ndCBleGlzdCwgY3JlYXRlIG9uZS5cbiAgICAgICAgaWYgKCFwbGFjZWhvbGRlckxhYmVsKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMubm9kZS5nZXRDaGlsZEJ5TmFtZSgnUExBQ0VIT0xERVJfTEFCRUwnKTtcbiAgICAgICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBuZXcgY2MuTm9kZSgnUExBQ0VIT0xERVJfTEFCRUwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyTGFiZWwgPSBub2RlLmdldENvbXBvbmVudChMYWJlbCk7XG4gICAgICAgICAgICBpZiAoIXBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsID0gbm9kZS5hZGRDb21wb25lbnQoTGFiZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9kZS5wYXJlbnQgPSB0aGlzLm5vZGU7XG4gICAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyTGFiZWwgPSBwbGFjZWhvbGRlckxhYmVsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgIHBsYWNlaG9sZGVyTGFiZWwubm9kZS5zZXRBbmNob3JQb2ludCgwLCAxKTtcbiAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5vdmVyZmxvdyA9IExhYmVsLk92ZXJmbG93LkNMQU1QO1xuICAgICAgICBpZiAodGhpcy5pbnB1dE1vZGUgPT09IElucHV0TW9kZS5BTlkpIHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyTGFiZWwudmVydGljYWxBbGlnbiA9IG1hY3JvLlZlcnRpY2FsVGV4dEFsaWdubWVudC5UT1A7XG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsLmVuYWJsZVdyYXBUZXh0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyTGFiZWwudmVydGljYWxBbGlnbiA9IG1hY3JvLlZlcnRpY2FsVGV4dEFsaWdubWVudC5DRU5URVI7XG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsLmVuYWJsZVdyYXBUZXh0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5zdHJpbmcgPSB0aGlzLnBsYWNlaG9sZGVyO1xuXG4gICAgICAgIC8vIGhhbmRsZSBvbGQgZGF0YVxuICAgICAgICBpZiAodGhpcy5fTiRwbGFjZWhvbGRlckZvbnRDb2xvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwbGFjZWhvbGRlckxhYmVsLm5vZGUuY29sb3IgPSB0aGlzLl9OJHBsYWNlaG9sZGVyRm9udENvbG9yO1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5ub2RlLm9wYWNpdHkgPSB0aGlzLl9OJHBsYWNlaG9sZGVyRm9udENvbG9yLmE7XG4gICAgICAgICAgICB0aGlzLl9OJHBsYWNlaG9sZGVyRm9udENvbG9yID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9OJHBsYWNlaG9sZGVyRm9udFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcGxhY2Vob2xkZXJMYWJlbC5mb250U2l6ZSA9IHRoaXMuX04kcGxhY2Vob2xkZXJGb250U2l6ZTtcbiAgICAgICAgICAgIHRoaXMuX04kcGxhY2Vob2xkZXJGb250U2l6ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBncmFkZUNvbXAgKCkge1xuICAgICAgICBpZiAodGhpcy5fTiRyZXR1cm5UeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmV0dXJuVHlwZSA9IHRoaXMuX04kcmV0dXJuVHlwZTtcbiAgICAgICAgICAgIHRoaXMuX04kcmV0dXJuVHlwZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fTiRtYXhMZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5tYXhMZW5ndGggPSB0aGlzLl9OJG1heExlbmd0aDtcbiAgICAgICAgICAgIHRoaXMuX04kbWF4TGVuZ3RoID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9OJGJhY2tncm91bmRJbWFnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVCYWNrZ3JvdW5kU3ByaXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX04kZm9udENvbG9yICE9PSB1bmRlZmluZWQgfHwgdGhpcy5fTiRmb250U2l6ZSAhPT0gdW5kZWZpbmVkIHx8IHRoaXMuX04kbGluZUhlaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVUZXh0TGFiZWwoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fTiRwbGFjZWhvbGRlckZvbnRDb2xvciAhPT0gdW5kZWZpbmVkIHx8IHRoaXMuX04kcGxhY2Vob2xkZXJGb250U2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQbGFjZWhvbGRlckxhYmVsKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX04kcGxhY2Vob2xkZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlciA9IHRoaXMuX04kcGxhY2Vob2xkZXI7XG4gICAgICAgICAgICB0aGlzLl9OJHBsYWNlaG9sZGVyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zeW5jU2l6ZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICBsZXQgc2l6ZSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICAgICAgdGhpcy5faW1wbC5zZXRTaXplKHNpemUud2lkdGgsIHNpemUuaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc2hvd0xhYmVscyAoKSB7XG4gICAgICAgIHRoaXMuX2lzTGFiZWxWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fdXBkYXRlTGFiZWxzKCk7XG4gICAgfSxcblxuICAgIF9oaWRlTGFiZWxzICgpIHtcbiAgICAgICAgdGhpcy5faXNMYWJlbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMudGV4dExhYmVsKSB7XG4gICAgICAgICAgICB0aGlzLnRleHRMYWJlbC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyTGFiZWwpIHtcbiAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5ub2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVMYWJlbHMgKCkge1xuICAgICAgICBpZiAodGhpcy5faXNMYWJlbFZpc2libGUpIHtcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gdGhpcy5fc3RyaW5nO1xuICAgICAgICAgICAgaWYgKHRoaXMudGV4dExhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0TGFiZWwubm9kZS5hY3RpdmUgPSAoY29udGVudCAhPT0gJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXJMYWJlbCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXJMYWJlbC5ub2RlLmFjdGl2ZSA9IChjb250ZW50ID09PSAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZVN0cmluZyAodGV4dCkge1xuICAgICAgICBsZXQgdGV4dExhYmVsID0gdGhpcy50ZXh0TGFiZWw7XG4gICAgICAgIC8vIE5vdCBpbml0ZWQgeWV0XG4gICAgICAgIGlmICghdGV4dExhYmVsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGlzcGxheVRleHQgPSB0ZXh0O1xuICAgICAgICBpZiAoZGlzcGxheVRleHQpIHtcbiAgICAgICAgICAgIGRpc3BsYXlUZXh0ID0gdGhpcy5fdXBkYXRlTGFiZWxTdHJpbmdTdHlsZShkaXNwbGF5VGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0TGFiZWwuc3RyaW5nID0gZGlzcGxheVRleHQ7XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlTGFiZWxzKCk7XG4gICAgfSxcblxuICAgIF91cGRhdGVMYWJlbFN0cmluZ1N0eWxlICh0ZXh0LCBpZ25vcmVQYXNzd29yZCkge1xuICAgICAgICBsZXQgaW5wdXRGbGFnID0gdGhpcy5pbnB1dEZsYWc7XG4gICAgICAgIGlmICghaWdub3JlUGFzc3dvcmQgJiYgaW5wdXRGbGFnID09PSBJbnB1dEZsYWcuUEFTU1dPUkQpIHtcbiAgICAgICAgICAgIGxldCBwYXNzd29yZFN0cmluZyA9ICcnO1xuICAgICAgICAgICAgbGV0IGxlbiA9IHRleHQubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgICAgIHBhc3N3b3JkU3RyaW5nICs9ICdcXHUyNUNGJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRleHQgPSBwYXNzd29yZFN0cmluZztcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSBpZiAoaW5wdXRGbGFnID09PSBJbnB1dEZsYWcuSU5JVElBTF9DQVBTX0FMTF9DSEFSQUNURVJTKSB7XG4gICAgICAgICAgICB0ZXh0ID0gdGV4dC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlucHV0RmxhZyA9PT0gSW5wdXRGbGFnLklOSVRJQUxfQ0FQU19XT1JEKSB7XG4gICAgICAgICAgICB0ZXh0ID0gY2FwaXRhbGl6ZSh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbnB1dEZsYWcgPT09IElucHV0RmxhZy5JTklUSUFMX0NBUFNfU0VOVEVOQ0UpIHtcbiAgICAgICAgICAgIHRleHQgPSBjYXBpdGFsaXplRmlyc3RMZXR0ZXIodGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9LFxuXG4gICAgZWRpdEJveEVkaXRpbmdEaWRCZWdhbiAoKSB7XG4gICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLmVkaXRpbmdEaWRCZWdhbiwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdlZGl0aW5nLWRpZC1iZWdhbicsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBlZGl0Qm94RWRpdGluZ0RpZEVuZGVkICgpIHtcbiAgICAgICAgY2MuQ29tcG9uZW50LkV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMuZWRpdGluZ0RpZEVuZGVkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ2VkaXRpbmctZGlkLWVuZGVkJywgdGhpcyk7XG4gICAgfSxcblxuICAgIGVkaXRCb3hUZXh0Q2hhbmdlZCAodGV4dCkge1xuICAgICAgICB0ZXh0ID0gdGhpcy5fdXBkYXRlTGFiZWxTdHJpbmdTdHlsZSh0ZXh0LCB0cnVlKTtcbiAgICAgICAgdGhpcy5zdHJpbmcgPSB0ZXh0O1xuICAgICAgICBjYy5Db21wb25lbnQuRXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy50ZXh0Q2hhbmdlZCwgdGV4dCwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCd0ZXh0LWNoYW5nZWQnLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgZWRpdEJveEVkaXRpbmdSZXR1cm4oKSB7XG4gICAgICAgIGNjLkNvbXBvbmVudC5FdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLmVkaXRpbmdSZXR1cm4sIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUuZW1pdCgnZWRpdGluZy1yZXR1cm4nLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25FbmFibGUgKCkge1xuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fcmVnaXN0ZXJFdmVudCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLmVuYWJsZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB0aGlzLl91bnJlZ2lzdGVyRXZlbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5kaXNhYmxlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25EZXN0cm95ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfX3ByZWxvYWQgKCkge1xuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgfSxcblxuICAgIF9yZWdpc3RlckV2ZW50ICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLl9vblRvdWNoRW5kZWQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfdW5yZWdpc3RlckV2ZW50ICgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5fb25Ub3VjaEJlZ2FuLCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcyk7XG4gICAgfSxcblxuICAgIF9vblRvdWNoQmVnYW4gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sXG5cbiAgICBfb25Ub3VjaENhbmNlbCAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSxcblxuICAgIF9vblRvdWNoRW5kZWQgKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLmJlZ2luRWRpdGluZygpO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIExldCB0aGUgRWRpdEJveCBnZXQgZm9jdXMsIHRoaXMgbWV0aG9kIHdpbGwgYmUgcmVtb3ZlZCBvbiB2Mi4xXG4gICAgICogISN6aCDorqnlvZPliY0gRWRpdEJveCDojrflvpfnhKbngrksIOi/meS4quaWueazleS8muWcqCB2Mi4xIOS4reenu+mZpFxuICAgICAqIEBtZXRob2Qgc2V0Rm9jdXNcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSAyLjAuOFxuICAgICAqL1xuICAgIHNldEZvY3VzICgpIHtcbiAgICAgICAgY2Mud2FybklEKDE0MDAsICdzZXRGb2N1cygpJywgJ2ZvY3VzKCknKTtcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0Rm9jdXModHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBMZXQgdGhlIEVkaXRCb3ggZ2V0IGZvY3VzXG4gICAgICogISN6aCDorqnlvZPliY0gRWRpdEJveCDojrflvpfnhKbngrlcbiAgICAgKiBAbWV0aG9kIGZvY3VzXG4gICAgICovXG4gICAgZm9jdXMgKCkge1xuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xuICAgICAgICAgICAgdGhpcy5faW1wbC5zZXRGb2N1cyh0cnVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIExldCB0aGUgRWRpdEJveCBsb3NlIGZvY3VzXG4gICAgICogISN6aCDorqnlvZPliY0gRWRpdEJveCDlpLHljrvnhKbngrlcbiAgICAgKiBAbWV0aG9kIGJsdXJcbiAgICAgKi9cbiAgICBibHVyICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0Rm9jdXMoZmFsc2UpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRGV0ZXJtaW5lIHdoZXRoZXIgRWRpdEJveCBpcyBnZXR0aW5nIGZvY3VzIG9yIG5vdC5cbiAgICAgKiAhI3poIOWIpOaWrSBFZGl0Qm94IOaYr+WQpuiOt+W+l+S6hueEpueCuVxuICAgICAqIEBtZXRob2QgaXNGb2N1c2VkXG4gICAgICovXG4gICAgaXNGb2N1c2VkICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbXBsLmlzRm9jdXNlZCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XG4gICAgICAgICAgICB0aGlzLl9pbXBsLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG59KTtcblxuY2MuRWRpdEJveCA9IG1vZHVsZS5leHBvcnRzID0gRWRpdEJveDtcblxuaWYgKGNjLnN5cy5pc0Jyb3dzZXIpIHtcbiAgICByZXF1aXJlKCcuL1dlYkVkaXRCb3hJbXBsJyk7XG59XG5cbi8qKlxuICogISNlblxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxuICogISN6aFxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXG4gKiBAZXZlbnQgZWRpdGluZy1kaWQtYmVnYW5cbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XG4gKiBAcGFyYW0ge0VkaXRCb3h9IGVkaXRib3ggLSBUaGUgRWRpdEJveCBjb21wb25lbnQuXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXG4gKiAhI3poXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcbiAqIEBldmVudCBlZGl0aW5nLWRpZC1lbmRlZFxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7RWRpdEJveH0gZWRpdGJveCAtIFRoZSBFZGl0Qm94IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IHRleHQtY2hhbmdlZFxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcbiAqIEBwYXJhbSB7RWRpdEJveH0gZWRpdGJveCAtIFRoZSBFZGl0Qm94IGNvbXBvbmVudC5cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cbiAqICEjemhcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxuICogQGV2ZW50IGVkaXRpbmctcmV0dXJuXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxuICogQHBhcmFtIHtFZGl0Qm94fSBlZGl0Ym94IC0gVGhlIEVkaXRCb3ggY29tcG9uZW50LlxuICovXG5cbi8qKlxuICogISNlbiBpZiB5b3UgZG9uJ3QgbmVlZCB0aGUgRWRpdEJveCBhbmQgaXQgaXNuJ3QgaW4gYW55IHJ1bm5pbmcgU2NlbmUsIHlvdSBzaG91bGRcbiAqIGNhbGwgdGhlIGRlc3Ryb3kgbWV0aG9kIG9uIHRoaXMgY29tcG9uZW50IG9yIHRoZSBhc3NvY2lhdGVkIG5vZGUgZXhwbGljaXRseS5cbiAqIE90aGVyd2lzZSwgdGhlIGNyZWF0ZWQgRE9NIGVsZW1lbnQgd29uJ3QgYmUgcmVtb3ZlZCBmcm9tIHdlYiBwYWdlLlxuICogISN6aFxuICog5aaC5p6c5L2g5LiN5YaN5L2/55SoIEVkaXRCb3jvvIzlubbkuJTnu4Tku7bmnKrmt7vliqDliLDlnLrmma/kuK3vvIzpgqPkuYjkvaDlv4XpobvmiYvliqjlr7nnu4Tku7bmiJbmiYDlnKjoioLngrnosIPnlKggZGVzdHJveeOAglxuICog6L+Z5qC35omN6IO956e76Zmk572R6aG15LiK55qEIERPTSDoioLngrnvvIzpgb/lhY0gV2ViIOW5s+WPsOWGheWtmOazhOmcsuOAglxuICogQGV4YW1wbGVcbiAqIGVkaXRib3gubm9kZS5wYXJlbnQgPSBudWxsOyAgLy8gb3IgIGVkaXRib3gubm9kZS5yZW1vdmVGcm9tUGFyZW50KGZhbHNlKTtcbiAqIC8vIHdoZW4geW91IGRvbid0IG5lZWQgZWRpdGJveCBhbnltb3JlXG4gKiBlZGl0Ym94Lm5vZGUuZGVzdHJveSgpO1xuICogQG1ldGhvZCBkZXN0cm95XG4gKiBAcmV0dXJuIHtCb29sZWFufSB3aGV0aGVyIGl0IGlzIHRoZSBmaXJzdCB0aW1lIHRoZSBkZXN0cm95IGJlaW5nIGNhbGxlZFxuICovIl19