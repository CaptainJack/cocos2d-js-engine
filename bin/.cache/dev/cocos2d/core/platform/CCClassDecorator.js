
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCClassDecorator.js';
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
// const FIX_BABEL6 = true;

/**
 * !#en Some JavaScript decorators which can be accessed with "cc._decorator".
 * !#zh 一些 JavaScript 装饰器，目前可以通过 "cc._decorator" 来访问。
 * （这些 API 仍不完全稳定，有可能随着 JavaScript 装饰器的标准实现而调整）
 *
 * @submodule _decorator
 * @module _decorator
 * @main
 */
// inspired by toddlxt (https://github.com/toddlxt/Creator-TypeScript-Boilerplate)
require('./CCClass');

var Preprocess = require('./preprocess-class');

var js = require('./js');

var isPlainEmptyObj_DEV = CC_DEV && require('./utils').isPlainEmptyObj_DEV; // caches for class construction


var CACHE_KEY = '__ccclassCache__';

function fNOP(ctor) {
  return ctor;
}

function getSubDict(obj, key) {
  return obj[key] || (obj[key] = {});
}

function checkCtorArgument(decorate) {
  return function (target) {
    if (typeof target === 'function') {
      // no parameter, target is ctor
      return decorate(target);
    }

    return function (ctor) {
      return decorate(ctor, target);
    };
  };
}

function _checkNormalArgument(validator_DEV, decorate, decoratorName) {
  return function (target) {
    if (CC_DEV && validator_DEV(target, decoratorName) === false) {
      return function () {
        return fNOP;
      };
    }

    return function (ctor) {
      return decorate(ctor, target);
    };
  };
}

var checkCompArgument = _checkNormalArgument.bind(null, CC_DEV && function (arg, decoratorName) {
  if (!cc.Class._isCCClass(arg)) {
    cc.error('The parameter for %s is missing.', decoratorName);
    return false;
  }
});

function _argumentChecker(type) {
  return _checkNormalArgument.bind(null, CC_DEV && function (arg, decoratorName) {
    if (arg instanceof cc.Component || arg === undefined) {
      cc.error('The parameter for %s is missing.', decoratorName);
      return false;
    } else if (typeof arg !== type) {
      cc.error('The parameter for %s must be type %s.', decoratorName, type);
      return false;
    }
  });
}

var checkStringArgument = _argumentChecker('string');

var checkNumberArgument = _argumentChecker('number'); // var checkBooleanArgument = _argumentChecker('boolean');


function getClassCache(ctor, decoratorName) {
  if (CC_DEV && cc.Class._isCCClass(ctor)) {
    cc.error('`@%s` should be used after @ccclass for class "%s"', decoratorName, js.getClassName(ctor));
    return null;
  }

  return getSubDict(ctor, CACHE_KEY);
}

function getDefaultFromInitializer(initializer) {
  var value;

  try {
    value = initializer();
  } catch (e) {
    // just lazy initialize by CCClass
    return initializer;
  }

  if (typeof value !== 'object' || value === null) {
    // string boolean number function undefined null
    return value;
  } else {
    // The default attribute will not be used in ES6 constructor actually,
    // so we dont need to simplify into `{}` or `[]` or vec2 completely.
    return initializer;
  }
}

function extractActualDefaultValues(ctor) {
  var dummyObj;

  try {
    dummyObj = new ctor();
  } catch (e) {
    if (CC_DEV) {
      cc.warnID(3652, js.getClassName(ctor), e);
    }

    return {};
  }

  return dummyObj;
}

function genProperty(ctor, properties, propName, options, desc, cache) {
  var fullOptions;

  if (options) {
    fullOptions = CC_DEV ? Preprocess.getFullFormOfProperty(options, propName, js.getClassName(ctor)) : Preprocess.getFullFormOfProperty(options);
  }

  var existsProperty = properties[propName];
  var prop = js.mixin(existsProperty || {}, fullOptions || options || {});
  var isGetset = desc && (desc.get || desc.set);

  if (isGetset) {
    // typescript or babel
    if (CC_DEV && options && (options.get || options.set)) {
      var errorProps = getSubDict(cache, 'errorProps');

      if (!errorProps[propName]) {
        errorProps[propName] = true;
        cc.warnID(3655, propName, js.getClassName(ctor), propName, propName);
      }
    }

    if (desc.get) {
      prop.get = desc.get;
    }

    if (desc.set) {
      prop.set = desc.set;
    }
  } else {
    if (CC_DEV && (prop.get || prop.set)) {
      // @property({
      //     get () { ... },
      //     set (...) { ... },
      // })
      // value;
      cc.errorID(3655, propName, js.getClassName(ctor), propName, propName);
      return;
    } // member variables


    var defaultValue = undefined;
    var isDefaultValueSpecified = false;

    if (desc) {
      // babel
      if (desc.initializer) {
        // @property(...)
        // value = null;
        defaultValue = getDefaultFromInitializer(desc.initializer);
        isDefaultValueSpecified = true;
      } else {// @property(...)
        // value;
      }
    } else {
      // typescript
      var actualDefaultValues = cache["default"] || (cache["default"] = extractActualDefaultValues(ctor));

      if (actualDefaultValues.hasOwnProperty(propName)) {
        // @property(...)
        // value = null;
        defaultValue = actualDefaultValues[propName];
        isDefaultValueSpecified = true;
      } else {// @property(...)
        // value;
      }
    }

    if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
      if (!fullOptions && options && options.hasOwnProperty('default')) {
        cc.warnID(3653, propName, js.getClassName(ctor)); // prop.default = options.default;
      } else if (!isDefaultValueSpecified) {
        cc.warnID(3654, js.getClassName(ctor), propName); // prop.default = fullOptions.hasOwnProperty('default') ? fullOptions.default : undefined;
      }

      if (cc.RawAsset.wasRawAssetType(prop.url) && prop._short && isDefaultValueSpecified && defaultValue == null) {
        // Avoid excessive warning when the ts decorator format is wrong
        if (typeof options !== 'function' || cc.RawAsset.isRawAssetType(options)) {
          cc.warnID(3656, js.getClassName(ctor), propName);
        }
      }
    }

    prop["default"] = defaultValue;
  }

  properties[propName] = prop;
}
/**
 * !#en
 * Declare the standard [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
 * as CCClass, please see [Class](../../../manual/en/scripting/class.html) for details.
 * !#zh
 * 将标准写法的 [ES6 Class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 声明为 CCClass，具体用法请参阅[类型定义](../../../manual/zh/scripting/class.html)。
 *
 * @method ccclass
 * @param {String} [name] - The class name used for serialization.
 * @example
 * const {ccclass} = cc._decorator;
 *
 * // define a CCClass, omit the name
 * &#64;ccclass
 * class NewScript extends cc.Component {
 *     // ...
 * }
 *
 * // define a CCClass with a name
 * &#64;ccclass('LoginData')
 * class LoginData {
 *     // ...
 * }
 * @typescript
 * ccclass(name?: string): Function
 * ccclass(_class?: Function): void
 */


var ccclass = checkCtorArgument(function (ctor, name) {
  // if (FIX_BABEL6) {
  //     eval('if(typeof _classCallCheck==="function"){_classCallCheck=function(){};}');
  // }
  var base = js.getSuper(ctor);

  if (base === Object) {
    base = null;
  }

  var proto = {
    name: name,
    "extends": base,
    ctor: ctor,
    __ES6__: true
  };
  var cache = ctor[CACHE_KEY];

  if (cache) {
    var decoratedProto = cache.proto;

    if (decoratedProto) {
      // decoratedProto.properties = createProperties(ctor, decoratedProto.properties);
      js.mixin(proto, decoratedProto);
    }

    ctor[CACHE_KEY] = undefined;
  }

  var res = cc.Class(proto); // validate methods

  if (CC_DEV) {
    var propNames = Object.getOwnPropertyNames(ctor.prototype);

    for (var i = 0; i < propNames.length; ++i) {
      var prop = propNames[i];

      if (prop !== 'constructor') {
        var desc = Object.getOwnPropertyDescriptor(ctor.prototype, prop);
        var func = desc && desc.value;

        if (typeof func === 'function') {
          Preprocess.doValidateMethodWithProps_DEV(func, prop, js.getClassName(ctor), ctor, base);
        }
      }
    }
  }

  return res;
});
/**
 * !#en
 * Declare property for [CCClass](../../../manual/en/scripting/reference/attributes.html).
 * !#zh
 * 定义 [CCClass](../../../manual/zh/scripting/reference/attributes.html) 所用的属性。
 *
 * @method property
 * @param {Object} [options] - an object with some property attributes
 * @param {Any} [options.type]
 * @param {Boolean|Function} [options.visible]
 * @param {String} [options.displayName]
 * @param {String} [options.tooltip]
 * @param {Boolean} [options.multiline]
 * @param {Boolean} [options.readonly]
 * @param {Number} [options.min]
 * @param {Number} [options.max]
 * @param {Number} [options.step]
 * @param {Number[]} [options.range]
 * @param {Boolean} [options.slide]
 * @param {Boolean} [options.serializable]
 * @param {Boolean} [options.editorOnly]
 * @param {Boolean} [options.override]
 * @param {Boolean} [options.animatable]
 * @param {String} [options.formerlySerializedAs]
 * @example
 * const {ccclass, property} = cc._decorator;
 *
 * &#64;ccclass
 * class NewScript extends cc.Component {
 *     &#64;property({
 *         type: cc.Node
 *     })
 *     targetNode1 = null;
 *
 *     &#64;property(cc.Node)
 *     targetNode2 = null;
 *
 *     &#64;property(cc.Button)
 *     targetButton = null;
 *
 *     &#64;property
 *     _width = 100;
 *
 *     &#64;property
 *     get width () {
 *         return this._width;
 *     }
 *
 *     &#64;property
 *     set width (value) {
 *         this._width = value;
 *     }
 *
 *     &#64;property
 *     offset = new cc.Vec2(100, 100);
 *
 *     &#64;property(cc.Vec2)
 *     offsets = [];
 *
 *     &#64;property(cc.SpriteFrame)
 *     frame = null;
 * }
 *
 * // above is equivalent to (上面的代码相当于):
 *
 * var NewScript = cc.Class({
 *     properties: {
 *         targetNode1: {
 *             default: null,
 *             type: cc.Node
 *         },
 *
 *         targetNode2: {
 *             default: null,
 *             type: cc.Node
 *         },
 *
 *         targetButton: {
 *             default: null,
 *             type: cc.Button
 *         },
 *
 *         _width: 100,
 *
 *         width: {
 *             get () {
 *                 return this._width;
 *             },
 *             set (value) {
 *                 this._width = value;
 *             }
 *         },
 *
 *         offset: new cc.Vec2(100, 100)
 *
 *         offsets: {
 *             default: [],
 *             type: cc.Vec2
 *         }
 *
 *         frame: {
 *             default: null,
 *             type: cc.SpriteFrame
 *         },
 *     }
 * });
 * @typescript
 * property(options?: {type?: any; visible?: boolean|(() => boolean); displayName?: string; tooltip?: string; multiline?: boolean; readonly?: boolean; min?: number; max?: number; step?: number; range?: number[]; slide?: boolean; serializable?: boolean; formerlySerializedAs?: string; editorOnly?: boolean; override?: boolean; animatable?: boolean} | any[]|Function|cc.ValueType|number|string|boolean): Function
 * property(_target: Object, _key: any, _desc?: any): void
 */

function property(ctorProtoOrOptions, propName, desc) {
  var options = null;

  function normalized(ctorProto, propName, desc) {
    var cache = getClassCache(ctorProto.constructor);

    if (cache) {
      var ccclassProto = getSubDict(cache, 'proto');
      var properties = getSubDict(ccclassProto, 'properties');
      genProperty(ctorProto.constructor, properties, propName, options, desc, cache);
    }
  }

  if (typeof propName === 'undefined') {
    options = ctorProtoOrOptions;
    return normalized;
  } else {
    normalized(ctorProtoOrOptions, propName, desc);
  }
} // Editor Decorators


function createEditorDecorator(argCheckFunc, editorPropName, staticValue) {
  return argCheckFunc(function (ctor, decoratedValue) {
    var cache = getClassCache(ctor, editorPropName);

    if (cache) {
      var value = staticValue !== undefined ? staticValue : decoratedValue;
      var proto = getSubDict(cache, 'proto');
      getSubDict(proto, 'editor')[editorPropName] = value;
    }
  }, editorPropName);
}

function createDummyDecorator(argCheckFunc) {
  return argCheckFunc(fNOP);
}
/**
 * !#en
 * Makes a CCClass that inherit from component execute in edit mode.<br>
 * By default, all components are only executed in play mode,
 * which means they will not have their callback functions executed while the Editor is in edit mode.
 * !#zh
 * 允许继承自 Component 的 CCClass 在编辑器里执行。<br>
 * 默认情况下，所有 Component 都只会在运行时才会执行，也就是说它们的生命周期回调不会在编辑器里触发。
 *
 * @method executeInEditMode
 * @example
 * const {ccclass, executeInEditMode} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executeInEditMode
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * executeInEditMode(): Function
 * executeInEditMode(_class: Function): void
 */


var executeInEditMode = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'executeInEditMode', true);
/**
 * !#en
 * Automatically add required component as a dependency for the CCClass that inherit from component.
 * !#zh
 * 为声明为 CCClass 的组件添加依赖的其它组件。当组件添加到节点上时，如果依赖的组件不存在，引擎将会自动将依赖组件添加到同一个节点，防止脚本出错。该设置在运行时同样有效。
 *
 * @method requireComponent
 * @param {Component} requiredComponent
 * @example
 * const {ccclass, requireComponent} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;requireComponent(cc.Sprite)
 * class SpriteCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * requireComponent(requiredComponent: typeof cc.Component): Function
 */

var requireComponent = createEditorDecorator(checkCompArgument, 'requireComponent');
/**
 * !#en
 * The menu path to register a component to the editors "Component" menu. Eg. "Rendering/CameraCtrl".
 * !#zh
 * 将当前组件添加到组件菜单中，方便用户查找。例如 "Rendering/CameraCtrl"。
 *
 * @method menu
 * @param {String} path - The path is the menu represented like a pathname.
 *                        For example the menu could be "Rendering/CameraCtrl".
 * @example
 * const {ccclass, menu} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;menu("Rendering/CameraCtrl")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * menu(path: string): Function
 */

var menu = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'menu');
/**
 * !#en
 * The execution order of lifecycle methods for Component.
 * Those less than 0 will execute before while those greater than 0 will execute after.
 * The order will only affect onLoad, onEnable, start, update and lateUpdate while onDisable and onDestroy will not be affected.
 * !#zh
 * 设置脚本生命周期方法调用的优先级。优先级小于 0 的组件将会优先执行，优先级大于 0 的组件将会延后执行。优先级仅会影响 onLoad, onEnable, start, update 和 lateUpdate，而 onDisable 和 onDestroy 不受影响。
 *
 * @method executionOrder
 * @param {Number} order - The execution order of lifecycle methods for Component. Those less than 0 will execute before while those greater than 0 will execute after.
 * @example
 * const {ccclass, executionOrder} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executionOrder(1)
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * executionOrder(order: number): Function
 */

var executionOrder = createEditorDecorator(checkNumberArgument, 'executionOrder');
/**
 * !#en
 * Prevents Component of the same type (or subtype) to be added more than once to a Node.
 * !#zh
 * 防止多个相同类型（或子类型）的组件被添加到同一个节点。
 *
 * @method disallowMultiple
 * @example
 * const {ccclass, disallowMultiple} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;disallowMultiple
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * disallowMultiple(): Function
 * disallowMultiple(_class: Function): void
 */

var disallowMultiple = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'disallowMultiple');
/**
 * !#en
 * If specified, the editor's scene view will keep updating this node in 60 fps when it is selected, otherwise, it will update only if necessary.<br>
 * This property is only available if executeInEditMode is true.
 * !#zh
 * 当指定了 "executeInEditMode" 以后，playOnFocus 可以在选中当前组件所在的节点时，提高编辑器的场景刷新频率到 60 FPS，否则场景就只会在必要的时候进行重绘。
 *
 * @method playOnFocus
 * @example
 * const {ccclass, playOnFocus, executeInEditMode} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;executeInEditMode
 * &#64;playOnFocus
 * class CameraCtrl extends cc.Component {
 *     // ...
 * }
 * @typescript
 * playOnFocus(): Function
 * playOnFocus(_class: Function): void
 */

var playOnFocus = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkCtorArgument, 'playOnFocus', true);
/**
 * !#en
 * Specifying the url of the custom html to draw the component in **Properties**.
 * !#zh
 * 自定义当前组件在 **属性检查器** 中渲染时所用的网页 url。
 *
 * @method inspector
 * @param {String} url
 * @example
 * const {ccclass, inspector} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;inspector("packages://inspector/inspectors/comps/camera-ctrl.js")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * inspector(path: string): Function
 */

var inspector = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'inspector');
/**
 * !#en
 * Specifying the url of the icon to display in the editor.
 * !#zh
 * 自定义当前组件在编辑器中显示的图标 url。
 *
 * @method icon
 * @param {String} url
 * @private
 * @example
 * const {ccclass, icon} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;icon("xxxx.png")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * icon(path: string): Function
 */

var icon = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'icon');
/**
 * !#en
 * The custom documentation URL.
 * !#zh
 * 指定当前组件的帮助文档的 url，设置过后，在 **属性检查器** 中就会出现一个帮助图标，用户点击将打开指定的网页。
 *
 * @method help
 * @param {String} url
 * @example
 * const {ccclass, help} = cc._decorator;
 *
 * &#64;ccclass
 * &#64;help("app://docs/html/components/spine.html")
 * class NewScript extends cc.Component {
 *     // ...
 * }
 * @typescript
 * help(path: string): Function
 */

var help = (CC_DEV ? createEditorDecorator : createDummyDecorator)(checkStringArgument, 'help'); // Other Decorators

/**
 * NOTE:<br>
 * The old mixins implemented in cc.Class(ES5) behaves exact the same as multiple inheritance.
 * But since ES6, class constructor can't be function-called and class methods become non-enumerable,
 * so we can not mix in ES6 Classes.<br>
 * See:<br>
 * [https://esdiscuss.org/topic/traits-are-now-impossible-in-es6-until-es7-since-rev32](https://esdiscuss.org/topic/traits-are-now-impossible-in-es6-until-es7-since-rev32)<br>
 * One possible solution (but IDE unfriendly):<br>
 * [http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/)<br>
 * <br>
 * NOTE:<br>
 * You must manually call mixins constructor, this is different from cc.Class(ES5).
 *
 * @method mixins
 * @param {Function} ...ctor - constructors to mix, only support ES5 constructors or classes defined by using `cc.Class`,
 *                             not support ES6 Classes.
 * @example
 * const {ccclass, mixins} = cc._decorator;
 *
 * class Animal { ... }
 *
 * const Fly = cc.Class({
 *     constructor () { ... }
 * });
 *
 * &#64;ccclass
 * &#64;mixins(cc.EventTarget, Fly)
 * class Bird extends Animal {
 *     constructor () {
 *         super();
 *
 *         // You must manually call mixins constructor, this is different from cc.Class(ES5)
 *         cc.EventTarget.call(this);
 *         Fly.call(this);
 *     }
 *     // ...
 * }
 * @typescript
 * mixins(ctor: Function, ...rest: Function[]): Function
 */

function mixins() {
  var mixins = [];

  for (var i = 0; i < arguments.length; i++) {
    mixins[i] = arguments[i];
  }

  return function (ctor) {
    var cache = getClassCache(ctor, 'mixins');

    if (cache) {
      getSubDict(cache, 'proto').mixins = mixins;
    }
  };
}

cc._decorator = module.exports = {
  ccclass: ccclass,
  property: property,
  executeInEditMode: executeInEditMode,
  requireComponent: requireComponent,
  menu: menu,
  executionOrder: executionOrder,
  disallowMultiple: disallowMultiple,
  playOnFocus: playOnFocus,
  inspector: inspector,
  icon: icon,
  help: help,
  mixins: mixins
}; // fix submodule pollute ...

/**
 * @submodule cc
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQ2xhc3NEZWNvcmF0b3IuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsIlByZXByb2Nlc3MiLCJqcyIsImlzUGxhaW5FbXB0eU9ial9ERVYiLCJDQ19ERVYiLCJDQUNIRV9LRVkiLCJmTk9QIiwiY3RvciIsImdldFN1YkRpY3QiLCJvYmoiLCJrZXkiLCJjaGVja0N0b3JBcmd1bWVudCIsImRlY29yYXRlIiwidGFyZ2V0IiwiX2NoZWNrTm9ybWFsQXJndW1lbnQiLCJ2YWxpZGF0b3JfREVWIiwiZGVjb3JhdG9yTmFtZSIsImNoZWNrQ29tcEFyZ3VtZW50IiwiYmluZCIsImFyZyIsImNjIiwiQ2xhc3MiLCJfaXNDQ0NsYXNzIiwiZXJyb3IiLCJfYXJndW1lbnRDaGVja2VyIiwidHlwZSIsIkNvbXBvbmVudCIsInVuZGVmaW5lZCIsImNoZWNrU3RyaW5nQXJndW1lbnQiLCJjaGVja051bWJlckFyZ3VtZW50IiwiZ2V0Q2xhc3NDYWNoZSIsImdldENsYXNzTmFtZSIsImdldERlZmF1bHRGcm9tSW5pdGlhbGl6ZXIiLCJpbml0aWFsaXplciIsInZhbHVlIiwiZSIsImV4dHJhY3RBY3R1YWxEZWZhdWx0VmFsdWVzIiwiZHVtbXlPYmoiLCJ3YXJuSUQiLCJnZW5Qcm9wZXJ0eSIsInByb3BlcnRpZXMiLCJwcm9wTmFtZSIsIm9wdGlvbnMiLCJkZXNjIiwiY2FjaGUiLCJmdWxsT3B0aW9ucyIsImdldEZ1bGxGb3JtT2ZQcm9wZXJ0eSIsImV4aXN0c1Byb3BlcnR5IiwicHJvcCIsIm1peGluIiwiaXNHZXRzZXQiLCJnZXQiLCJzZXQiLCJlcnJvclByb3BzIiwiZXJyb3JJRCIsImRlZmF1bHRWYWx1ZSIsImlzRGVmYXVsdFZhbHVlU3BlY2lmaWVkIiwiYWN0dWFsRGVmYXVsdFZhbHVlcyIsImhhc093blByb3BlcnR5IiwiQ0NfRURJVE9SIiwiRWRpdG9yIiwiaXNCdWlsZGVyIiwiQ0NfVEVTVCIsIlJhd0Fzc2V0Iiwid2FzUmF3QXNzZXRUeXBlIiwidXJsIiwiX3Nob3J0IiwiaXNSYXdBc3NldFR5cGUiLCJjY2NsYXNzIiwibmFtZSIsImJhc2UiLCJnZXRTdXBlciIsIk9iamVjdCIsInByb3RvIiwiX19FUzZfXyIsImRlY29yYXRlZFByb3RvIiwicmVzIiwicHJvcE5hbWVzIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsInByb3RvdHlwZSIsImkiLCJsZW5ndGgiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJmdW5jIiwiZG9WYWxpZGF0ZU1ldGhvZFdpdGhQcm9wc19ERVYiLCJwcm9wZXJ0eSIsImN0b3JQcm90b09yT3B0aW9ucyIsIm5vcm1hbGl6ZWQiLCJjdG9yUHJvdG8iLCJjb25zdHJ1Y3RvciIsImNjY2xhc3NQcm90byIsImNyZWF0ZUVkaXRvckRlY29yYXRvciIsImFyZ0NoZWNrRnVuYyIsImVkaXRvclByb3BOYW1lIiwic3RhdGljVmFsdWUiLCJkZWNvcmF0ZWRWYWx1ZSIsImNyZWF0ZUR1bW15RGVjb3JhdG9yIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJyZXF1aXJlQ29tcG9uZW50IiwibWVudSIsImV4ZWN1dGlvbk9yZGVyIiwiZGlzYWxsb3dNdWx0aXBsZSIsInBsYXlPbkZvY3VzIiwiaW5zcGVjdG9yIiwiaWNvbiIsImhlbHAiLCJtaXhpbnMiLCJhcmd1bWVudHMiLCJfZGVjb3JhdG9yIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBOztBQUVBOzs7Ozs7Ozs7QUFVQTtBQUVBQSxPQUFPLENBQUMsV0FBRCxDQUFQOztBQUNBLElBQU1DLFVBQVUsR0FBR0QsT0FBTyxDQUFDLG9CQUFELENBQTFCOztBQUNBLElBQU1FLEVBQUUsR0FBR0YsT0FBTyxDQUFDLE1BQUQsQ0FBbEI7O0FBQ0EsSUFBTUcsbUJBQW1CLEdBQUdDLE1BQU0sSUFBSUosT0FBTyxDQUFDLFNBQUQsQ0FBUCxDQUFtQkcsbUJBQXpELEVBRUE7OztBQUNBLElBQU1FLFNBQVMsR0FBRyxrQkFBbEI7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QixNQUE5QixFQUFzQ0QsQ0FBQyxFQUF2QyxFQUEyQztBQUN2QzBCLElBQUFBLE1BQU0sQ0FBQzFCLENBQUQsQ0FBTixHQUFZMkIsU0FBUyxDQUFDM0IsQ0FBRCxDQUFyQjtBQUNIOztBQUNELFNBQU8sVUFBVXpFLElBQVYsRUFBZ0I7QUFDbkIsUUFBSXFDLEtBQUssR0FBR2QsYUFBYSxDQUFDdkIsSUFBRCxFQUFPLFFBQVAsQ0FBekI7O0FBQ0EsUUFBSXFDLEtBQUosRUFBVztBQUNQcEMsTUFBQUEsVUFBVSxDQUFDb0MsS0FBRCxFQUFRLE9BQVIsQ0FBVixDQUEyQjhELE1BQTNCLEdBQW9DQSxNQUFwQztBQUNIO0FBQ0osR0FMRDtBQU1IOztBQUVEdEYsRUFBRSxDQUFDd0YsVUFBSCxHQUFnQkMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQzdCMUMsRUFBQUEsT0FBTyxFQUFQQSxPQUQ2QjtBQUU3QmlCLEVBQUFBLFFBQVEsRUFBUkEsUUFGNkI7QUFHN0JZLEVBQUFBLGlCQUFpQixFQUFqQkEsaUJBSDZCO0FBSTdCQyxFQUFBQSxnQkFBZ0IsRUFBaEJBLGdCQUo2QjtBQUs3QkMsRUFBQUEsSUFBSSxFQUFKQSxJQUw2QjtBQU03QkMsRUFBQUEsY0FBYyxFQUFkQSxjQU42QjtBQU83QkMsRUFBQUEsZ0JBQWdCLEVBQWhCQSxnQkFQNkI7QUFRN0JDLEVBQUFBLFdBQVcsRUFBWEEsV0FSNkI7QUFTN0JDLEVBQUFBLFNBQVMsRUFBVEEsU0FUNkI7QUFVN0JDLEVBQUFBLElBQUksRUFBSkEsSUFWNkI7QUFXN0JDLEVBQUFBLElBQUksRUFBSkEsSUFYNkI7QUFZN0JDLEVBQUFBLE1BQU0sRUFBTkE7QUFaNkIsQ0FBakMsRUFlQTs7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuLy8gY29uc3QgRklYX0JBQkVMNiA9IHRydWU7XG5cbi8qKlxuICogISNlbiBTb21lIEphdmFTY3JpcHQgZGVjb3JhdG9ycyB3aGljaCBjYW4gYmUgYWNjZXNzZWQgd2l0aCBcImNjLl9kZWNvcmF0b3JcIi5cbiAqICEjemgg5LiA5LqbIEphdmFTY3JpcHQg6KOF6aWw5Zmo77yM55uu5YmN5Y+v5Lul6YCa6L+HIFwiY2MuX2RlY29yYXRvclwiIOadpeiuv+mXruOAglxuICog77yI6L+Z5LqbIEFQSSDku43kuI3lrozlhajnqLPlrprvvIzmnInlj6/og73pmo/nnYAgSmF2YVNjcmlwdCDoo4XppbDlmajnmoTmoIflh4blrp7njrDogIzosIPmlbTvvIlcbiAqXG4gKiBAc3VibW9kdWxlIF9kZWNvcmF0b3JcbiAqIEBtb2R1bGUgX2RlY29yYXRvclxuICogQG1haW5cbiAqL1xuXG4vLyBpbnNwaXJlZCBieSB0b2RkbHh0IChodHRwczovL2dpdGh1Yi5jb20vdG9kZGx4dC9DcmVhdG9yLVR5cGVTY3JpcHQtQm9pbGVycGxhdGUpXG5cbnJlcXVpcmUoJy4vQ0NDbGFzcycpO1xuY29uc3QgUHJlcHJvY2VzcyA9IHJlcXVpcmUoJy4vcHJlcHJvY2Vzcy1jbGFzcycpO1xuY29uc3QganMgPSByZXF1aXJlKCcuL2pzJyk7XG5jb25zdCBpc1BsYWluRW1wdHlPYmpfREVWID0gQ0NfREVWICYmIHJlcXVpcmUoJy4vdXRpbHMnKS5pc1BsYWluRW1wdHlPYmpfREVWO1xuXG4vLyBjYWNoZXMgZm9yIGNsYXNzIGNvbnN0cnVjdGlvblxuY29uc3QgQ0FDSEVfS0VZID0gJ19fY2NjbGFzc0NhY2hlX18nO1xuXG5mdW5jdGlvbiBmTk9QIChjdG9yKSB7XG4gICAgcmV0dXJuIGN0b3I7XG59XG5cbmZ1bmN0aW9uIGdldFN1YkRpY3QgKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIG9ialtrZXldIHx8IChvYmpba2V5XSA9IHt9KTtcbn1cblxuZnVuY3Rpb24gY2hlY2tDdG9yQXJndW1lbnQgKGRlY29yYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIG5vIHBhcmFtZXRlciwgdGFyZ2V0IGlzIGN0b3JcbiAgICAgICAgICAgIHJldHVybiBkZWNvcmF0ZSh0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoY3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIGRlY29yYXRlKGN0b3IsIHRhcmdldCk7XG4gICAgICAgIH07XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gX2NoZWNrTm9ybWFsQXJndW1lbnQgKHZhbGlkYXRvcl9ERVYsIGRlY29yYXRlLCBkZWNvcmF0b3JOYW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgaWYgKENDX0RFViAmJiB2YWxpZGF0b3JfREVWKHRhcmdldCwgZGVjb3JhdG9yTmFtZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmTk9QO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWNvcmF0ZShjdG9yLCB0YXJnZXQpO1xuICAgICAgICB9O1xuICAgIH07XG59XG5cbnZhciBjaGVja0NvbXBBcmd1bWVudCA9IF9jaGVja05vcm1hbEFyZ3VtZW50LmJpbmQobnVsbCwgQ0NfREVWICYmIGZ1bmN0aW9uIChhcmcsIGRlY29yYXRvck5hbWUpIHtcbiAgICBpZiAoIWNjLkNsYXNzLl9pc0NDQ2xhc3MoYXJnKSkge1xuICAgICAgICBjYy5lcnJvcignVGhlIHBhcmFtZXRlciBmb3IgJXMgaXMgbWlzc2luZy4nLCBkZWNvcmF0b3JOYW1lKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBfYXJndW1lbnRDaGVja2VyICh0eXBlKSB7XG4gICAgcmV0dXJuIF9jaGVja05vcm1hbEFyZ3VtZW50LmJpbmQobnVsbCwgQ0NfREVWICYmIGZ1bmN0aW9uIChhcmcsIGRlY29yYXRvck5hbWUpIHtcbiAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIGNjLkNvbXBvbmVudCB8fCBhcmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2MuZXJyb3IoJ1RoZSBwYXJhbWV0ZXIgZm9yICVzIGlzIG1pc3NpbmcuJywgZGVjb3JhdG9yTmFtZSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGFyZyAhPT0gdHlwZSkge1xuICAgICAgICAgICAgY2MuZXJyb3IoJ1RoZSBwYXJhbWV0ZXIgZm9yICVzIG11c3QgYmUgdHlwZSAlcy4nLCBkZWNvcmF0b3JOYW1lLCB0eXBlKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxudmFyIGNoZWNrU3RyaW5nQXJndW1lbnQgPSBfYXJndW1lbnRDaGVja2VyKCdzdHJpbmcnKTtcbnZhciBjaGVja051bWJlckFyZ3VtZW50ID0gX2FyZ3VtZW50Q2hlY2tlcignbnVtYmVyJyk7XG4vLyB2YXIgY2hlY2tCb29sZWFuQXJndW1lbnQgPSBfYXJndW1lbnRDaGVja2VyKCdib29sZWFuJyk7XG5cblxuZnVuY3Rpb24gZ2V0Q2xhc3NDYWNoZSAoY3RvciwgZGVjb3JhdG9yTmFtZSkge1xuICAgIGlmIChDQ19ERVYgJiYgY2MuQ2xhc3MuX2lzQ0NDbGFzcyhjdG9yKSkge1xuICAgICAgICBjYy5lcnJvcignYEAlc2Agc2hvdWxkIGJlIHVzZWQgYWZ0ZXIgQGNjY2xhc3MgZm9yIGNsYXNzIFwiJXNcIicsIGRlY29yYXRvck5hbWUsIGpzLmdldENsYXNzTmFtZShjdG9yKSk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0U3ViRGljdChjdG9yLCBDQUNIRV9LRVkpO1xufVxuXG5mdW5jdGlvbiBnZXREZWZhdWx0RnJvbUluaXRpYWxpemVyIChpbml0aWFsaXplcikge1xuICAgIHZhciB2YWx1ZTtcbiAgICB0cnkge1xuICAgICAgICB2YWx1ZSA9IGluaXRpYWxpemVyKCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGp1c3QgbGF6eSBpbml0aWFsaXplIGJ5IENDQ2xhc3NcbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemVyO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAvLyBzdHJpbmcgYm9vbGVhbiBudW1iZXIgZnVuY3Rpb24gdW5kZWZpbmVkIG51bGxcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gVGhlIGRlZmF1bHQgYXR0cmlidXRlIHdpbGwgbm90IGJlIHVzZWQgaW4gRVM2IGNvbnN0cnVjdG9yIGFjdHVhbGx5LFxuICAgICAgICAvLyBzbyB3ZSBkb250IG5lZWQgdG8gc2ltcGxpZnkgaW50byBge31gIG9yIGBbXWAgb3IgdmVjMiBjb21wbGV0ZWx5LlxuICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZXI7XG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGV4dHJhY3RBY3R1YWxEZWZhdWx0VmFsdWVzIChjdG9yKSB7XG4gICAgdmFyIGR1bW15T2JqO1xuICAgIHRyeSB7XG4gICAgICAgIGR1bW15T2JqID0gbmV3IGN0b3IoKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgY2Mud2FybklEKDM2NTIsIGpzLmdldENsYXNzTmFtZShjdG9yKSwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICByZXR1cm4gZHVtbXlPYmo7XG59XG5cbmZ1bmN0aW9uIGdlblByb3BlcnR5IChjdG9yLCBwcm9wZXJ0aWVzLCBwcm9wTmFtZSwgb3B0aW9ucywgZGVzYywgY2FjaGUpIHtcbiAgICB2YXIgZnVsbE9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgZnVsbE9wdGlvbnMgPSBDQ19ERVYgPyBQcmVwcm9jZXNzLmdldEZ1bGxGb3JtT2ZQcm9wZXJ0eShvcHRpb25zLCBwcm9wTmFtZSwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJlcHJvY2Vzcy5nZXRGdWxsRm9ybU9mUHJvcGVydHkob3B0aW9ucyk7XG4gICAgfVxuICAgIHZhciBleGlzdHNQcm9wZXJ0eSA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xuICAgIHZhciBwcm9wID0ganMubWl4aW4oZXhpc3RzUHJvcGVydHkgfHwge30sIGZ1bGxPcHRpb25zIHx8IG9wdGlvbnMgfHwge30pO1xuXG4gICAgdmFyIGlzR2V0c2V0ID0gZGVzYyAmJiAoZGVzYy5nZXQgfHwgZGVzYy5zZXQpO1xuICAgIGlmIChpc0dldHNldCkge1xuICAgICAgICAvLyB0eXBlc2NyaXB0IG9yIGJhYmVsXG4gICAgICAgIGlmIChDQ19ERVYgJiYgb3B0aW9ucyAmJiAob3B0aW9ucy5nZXQgfHwgb3B0aW9ucy5zZXQpKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JQcm9wcyA9IGdldFN1YkRpY3QoY2FjaGUsICdlcnJvclByb3BzJyk7XG4gICAgICAgICAgICBpZiAoIWVycm9yUHJvcHNbcHJvcE5hbWVdKSB7XG4gICAgICAgICAgICAgICAgZXJyb3JQcm9wc1twcm9wTmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjU1LCBwcm9wTmFtZSwganMuZ2V0Q2xhc3NOYW1lKGN0b3IpLCBwcm9wTmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkZXNjLmdldCkge1xuICAgICAgICAgICAgcHJvcC5nZXQgPSBkZXNjLmdldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgICAgICAgIHByb3Auc2V0ID0gZGVzYy5zZXQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgKHByb3AuZ2V0IHx8IHByb3Auc2V0KSkge1xuICAgICAgICAgICAgLy8gQHByb3BlcnR5KHtcbiAgICAgICAgICAgIC8vICAgICBnZXQgKCkgeyAuLi4gfSxcbiAgICAgICAgICAgIC8vICAgICBzZXQgKC4uLikgeyAuLi4gfSxcbiAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICAvLyB2YWx1ZTtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzY1NSwgcHJvcE5hbWUsIGpzLmdldENsYXNzTmFtZShjdG9yKSwgcHJvcE5hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBtZW1iZXIgdmFyaWFibGVzXG4gICAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBpc0RlZmF1bHRWYWx1ZVNwZWNpZmllZCA9IGZhbHNlO1xuICAgICAgICBpZiAoZGVzYykge1xuICAgICAgICAgICAgLy8gYmFiZWxcbiAgICAgICAgICAgIGlmIChkZXNjLmluaXRpYWxpemVyKSB7XG4gICAgICAgICAgICAgICAgLy8gQHByb3BlcnR5KC4uLilcbiAgICAgICAgICAgICAgICAvLyB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlID0gZ2V0RGVmYXVsdEZyb21Jbml0aWFsaXplcihkZXNjLmluaXRpYWxpemVyKTtcbiAgICAgICAgICAgICAgICBpc0RlZmF1bHRWYWx1ZVNwZWNpZmllZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBAcHJvcGVydHkoLi4uKVxuICAgICAgICAgICAgICAgIC8vIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gdHlwZXNjcmlwdFxuICAgICAgICAgICAgdmFyIGFjdHVhbERlZmF1bHRWYWx1ZXMgPSBjYWNoZS5kZWZhdWx0IHx8IChjYWNoZS5kZWZhdWx0ID0gZXh0cmFjdEFjdHVhbERlZmF1bHRWYWx1ZXMoY3RvcikpO1xuICAgICAgICAgICAgaWYgKGFjdHVhbERlZmF1bHRWYWx1ZXMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgLy8gQHByb3BlcnR5KC4uLilcbiAgICAgICAgICAgICAgICAvLyB2YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgZGVmYXVsdFZhbHVlID0gYWN0dWFsRGVmYXVsdFZhbHVlc1twcm9wTmFtZV07XG4gICAgICAgICAgICAgICAgaXNEZWZhdWx0VmFsdWVTcGVjaWZpZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gQHByb3BlcnR5KC4uLilcbiAgICAgICAgICAgICAgICAvLyB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSB7XG4gICAgICAgICAgICBpZiAoIWZ1bGxPcHRpb25zICYmIG9wdGlvbnMgJiYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDM2NTMsIHByb3BOYW1lLCBqcy5nZXRDbGFzc05hbWUoY3RvcikpO1xuICAgICAgICAgICAgICAgIC8vIHByb3AuZGVmYXVsdCA9IG9wdGlvbnMuZGVmYXVsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFpc0RlZmF1bHRWYWx1ZVNwZWNpZmllZCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjU0LCBqcy5nZXRDbGFzc05hbWUoY3RvciksIHByb3BOYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBwcm9wLmRlZmF1bHQgPSBmdWxsT3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnZGVmYXVsdCcpID8gZnVsbE9wdGlvbnMuZGVmYXVsdCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYy5SYXdBc3NldC53YXNSYXdBc3NldFR5cGUocHJvcC51cmwpICYmXG4gICAgICAgICAgICAgICAgcHJvcC5fc2hvcnQgJiZcbiAgICAgICAgICAgICAgICBpc0RlZmF1bHRWYWx1ZVNwZWNpZmllZCAmJlxuICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZSA9PSBudWxsXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBBdm9pZCBleGNlc3NpdmUgd2FybmluZyB3aGVuIHRoZSB0cyBkZWNvcmF0b3IgZm9ybWF0IGlzIHdyb25nXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAnZnVuY3Rpb24nIHx8IGNjLlJhd0Fzc2V0LmlzUmF3QXNzZXRUeXBlKG9wdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjU2LCBqcy5nZXRDbGFzc05hbWUoY3RvciksIHByb3BOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJvcC5kZWZhdWx0ID0gZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIHByb3BlcnRpZXNbcHJvcE5hbWVdID0gcHJvcDtcbn1cblxuLyoqXG4gKiAhI2VuXG4gKiBEZWNsYXJlIHRoZSBzdGFuZGFyZCBbRVM2IENsYXNzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9DbGFzc2VzKVxuICogYXMgQ0NDbGFzcywgcGxlYXNlIHNlZSBbQ2xhc3NdKC4uLy4uLy4uL21hbnVhbC9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbCkgZm9yIGRldGFpbHMuXG4gKiAhI3poXG4gKiDlsIbmoIflh4blhpnms5XnmoQgW0VTNiBDbGFzc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvQ2xhc3Nlcykg5aOw5piO5Li6IENDQ2xhc3PvvIzlhbfkvZPnlKjms5Xor7flj4LpmIVb57G75Z6L5a6a5LmJXSguLi8uLi8uLi9tYW51YWwvemgvc2NyaXB0aW5nL2NsYXNzLmh0bWwp44CCXG4gKlxuICogQG1ldGhvZCBjY2NsYXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gW25hbWVdIC0gVGhlIGNsYXNzIG5hbWUgdXNlZCBmb3Igc2VyaWFsaXphdGlvbi5cbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzc30gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqIC8vIGRlZmluZSBhIENDQ2xhc3MsIG9taXQgdGhlIG5hbWVcbiAqICYjNjQ7Y2NjbGFzc1xuICogY2xhc3MgTmV3U2NyaXB0IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqXG4gKiAvLyBkZWZpbmUgYSBDQ0NsYXNzIHdpdGggYSBuYW1lXG4gKiAmIzY0O2NjY2xhc3MoJ0xvZ2luRGF0YScpXG4gKiBjbGFzcyBMb2dpbkRhdGEge1xuICogICAgIC8vIC4uLlxuICogfVxuICogQHR5cGVzY3JpcHRcbiAqIGNjY2xhc3MobmFtZT86IHN0cmluZyk6IEZ1bmN0aW9uXG4gKiBjY2NsYXNzKF9jbGFzcz86IEZ1bmN0aW9uKTogdm9pZFxuICovXG52YXIgY2NjbGFzcyA9IGNoZWNrQ3RvckFyZ3VtZW50KGZ1bmN0aW9uIChjdG9yLCBuYW1lKSB7XG4gICAgLy8gaWYgKEZJWF9CQUJFTDYpIHtcbiAgICAvLyAgICAgZXZhbCgnaWYodHlwZW9mIF9jbGFzc0NhbGxDaGVjaz09PVwiZnVuY3Rpb25cIil7X2NsYXNzQ2FsbENoZWNrPWZ1bmN0aW9uKCl7fTt9Jyk7XG4gICAgLy8gfVxuICAgIHZhciBiYXNlID0ganMuZ2V0U3VwZXIoY3Rvcik7XG4gICAgaWYgKGJhc2UgPT09IE9iamVjdCkge1xuICAgICAgICBiYXNlID0gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcHJvdG8gPSB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIGV4dGVuZHM6IGJhc2UsXG4gICAgICAgIGN0b3IsXG4gICAgICAgIF9fRVM2X186IHRydWUsXG4gICAgfTtcbiAgICB2YXIgY2FjaGUgPSBjdG9yW0NBQ0hFX0tFWV07XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICAgIHZhciBkZWNvcmF0ZWRQcm90byA9IGNhY2hlLnByb3RvO1xuICAgICAgICBpZiAoZGVjb3JhdGVkUHJvdG8pIHtcbiAgICAgICAgICAgIC8vIGRlY29yYXRlZFByb3RvLnByb3BlcnRpZXMgPSBjcmVhdGVQcm9wZXJ0aWVzKGN0b3IsIGRlY29yYXRlZFByb3RvLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAganMubWl4aW4ocHJvdG8sIGRlY29yYXRlZFByb3RvKTtcbiAgICAgICAgfVxuICAgICAgICBjdG9yW0NBQ0hFX0tFWV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIHJlcyA9IGNjLkNsYXNzKHByb3RvKTtcblxuICAgIC8vIHZhbGlkYXRlIG1ldGhvZHNcbiAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgIHZhciBwcm9wTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhjdG9yLnByb3RvdHlwZSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcE5hbWVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHByb3BOYW1lc1tpXTtcbiAgICAgICAgICAgIGlmIChwcm9wICE9PSAnY29uc3RydWN0b3InKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGN0b3IucHJvdG90eXBlLCBwcm9wKTtcbiAgICAgICAgICAgICAgICB2YXIgZnVuYyA9IGRlc2MgJiYgZGVzYy52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZ1bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgUHJlcHJvY2Vzcy5kb1ZhbGlkYXRlTWV0aG9kV2l0aFByb3BzX0RFVihmdW5jLCBwcm9wLCBqcy5nZXRDbGFzc05hbWUoY3RvciksIGN0b3IsIGJhc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXM7XG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBEZWNsYXJlIHByb3BlcnR5IGZvciBbQ0NDbGFzc10oLi4vLi4vLi4vbWFudWFsL2VuL3NjcmlwdGluZy9yZWZlcmVuY2UvYXR0cmlidXRlcy5odG1sKS5cbiAqICEjemhcbiAqIOWumuS5iSBbQ0NDbGFzc10oLi4vLi4vLi4vbWFudWFsL3poL3NjcmlwdGluZy9yZWZlcmVuY2UvYXR0cmlidXRlcy5odG1sKSDmiYDnlKjnmoTlsZ7mgKfjgIJcbiAqXG4gKiBAbWV0aG9kIHByb3BlcnR5XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gYW4gb2JqZWN0IHdpdGggc29tZSBwcm9wZXJ0eSBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0ge0FueX0gW29wdGlvbnMudHlwZV1cbiAqIEBwYXJhbSB7Qm9vbGVhbnxGdW5jdGlvbn0gW29wdGlvbnMudmlzaWJsZV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5kaXNwbGF5TmFtZV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50b29sdGlwXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5tdWx0aWxpbmVdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJlYWRvbmx5XVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm1pbl1cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tYXhdXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuc3RlcF1cbiAqIEBwYXJhbSB7TnVtYmVyW119IFtvcHRpb25zLnJhbmdlXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zbGlkZV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2VyaWFsaXphYmxlXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5lZGl0b3JPbmx5XVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5vdmVycmlkZV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuYW5pbWF0YWJsZV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mb3JtZXJseVNlcmlhbGl6ZWRBc11cbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzcywgcHJvcGVydHl9ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiAmIzY0O2NjY2xhc3NcbiAqIGNsYXNzIE5ld1NjcmlwdCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gKiAgICAgJiM2NDtwcm9wZXJ0eSh7XG4gKiAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAqICAgICB9KVxuICogICAgIHRhcmdldE5vZGUxID0gbnVsbDtcbiAqXG4gKiAgICAgJiM2NDtwcm9wZXJ0eShjYy5Ob2RlKVxuICogICAgIHRhcmdldE5vZGUyID0gbnVsbDtcbiAqXG4gKiAgICAgJiM2NDtwcm9wZXJ0eShjYy5CdXR0b24pXG4gKiAgICAgdGFyZ2V0QnV0dG9uID0gbnVsbDtcbiAqXG4gKiAgICAgJiM2NDtwcm9wZXJ0eVxuICogICAgIF93aWR0aCA9IDEwMDtcbiAqXG4gKiAgICAgJiM2NDtwcm9wZXJ0eVxuICogICAgIGdldCB3aWR0aCAoKSB7XG4gKiAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAqICAgICB9XG4gKlxuICogICAgICYjNjQ7cHJvcGVydHlcbiAqICAgICBzZXQgd2lkdGggKHZhbHVlKSB7XG4gKiAgICAgICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XG4gKiAgICAgfVxuICpcbiAqICAgICAmIzY0O3Byb3BlcnR5XG4gKiAgICAgb2Zmc2V0ID0gbmV3IGNjLlZlYzIoMTAwLCAxMDApO1xuICpcbiAqICAgICAmIzY0O3Byb3BlcnR5KGNjLlZlYzIpXG4gKiAgICAgb2Zmc2V0cyA9IFtdO1xuICpcbiAqICAgICAmIzY0O3Byb3BlcnR5KGNjLlNwcml0ZUZyYW1lKVxuICogICAgIGZyYW1lID0gbnVsbDtcbiAqIH1cbiAqXG4gKiAvLyBhYm92ZSBpcyBlcXVpdmFsZW50IHRvICjkuIrpnaLnmoTku6PnoIHnm7jlvZPkuo4pOlxuICpcbiAqIHZhciBOZXdTY3JpcHQgPSBjYy5DbGFzcyh7XG4gKiAgICAgcHJvcGVydGllczoge1xuICogICAgICAgICB0YXJnZXROb2RlMToge1xuICogICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAqICAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAqICAgICAgICAgfSxcbiAqXG4gKiAgICAgICAgIHRhcmdldE5vZGUyOiB7XG4gKiAgICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICogICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICogICAgICAgICB9LFxuICpcbiAqICAgICAgICAgdGFyZ2V0QnV0dG9uOiB7XG4gKiAgICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICogICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gKiAgICAgICAgIH0sXG4gKlxuICogICAgICAgICBfd2lkdGg6IDEwMCxcbiAqXG4gKiAgICAgICAgIHdpZHRoOiB7XG4gKiAgICAgICAgICAgICBnZXQgKCkge1xuICogICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAqICAgICAgICAgICAgIH0sXG4gKiAgICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gKiAgICAgICAgICAgICAgICAgdGhpcy5fd2lkdGggPSB2YWx1ZTtcbiAqICAgICAgICAgICAgIH1cbiAqICAgICAgICAgfSxcbiAqXG4gKiAgICAgICAgIG9mZnNldDogbmV3IGNjLlZlYzIoMTAwLCAxMDApXG4gKlxuICogICAgICAgICBvZmZzZXRzOiB7XG4gKiAgICAgICAgICAgICBkZWZhdWx0OiBbXSxcbiAqICAgICAgICAgICAgIHR5cGU6IGNjLlZlYzJcbiAqICAgICAgICAgfVxuICpcbiAqICAgICAgICAgZnJhbWU6IHtcbiAqICAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gKiAgICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZVxuICogICAgICAgICB9LFxuICogICAgIH1cbiAqIH0pO1xuICogQHR5cGVzY3JpcHRcbiAqIHByb3BlcnR5KG9wdGlvbnM/OiB7dHlwZT86IGFueTsgdmlzaWJsZT86IGJvb2xlYW58KCgpID0+IGJvb2xlYW4pOyBkaXNwbGF5TmFtZT86IHN0cmluZzsgdG9vbHRpcD86IHN0cmluZzsgbXVsdGlsaW5lPzogYm9vbGVhbjsgcmVhZG9ubHk/OiBib29sZWFuOyBtaW4/OiBudW1iZXI7IG1heD86IG51bWJlcjsgc3RlcD86IG51bWJlcjsgcmFuZ2U/OiBudW1iZXJbXTsgc2xpZGU/OiBib29sZWFuOyBzZXJpYWxpemFibGU/OiBib29sZWFuOyBmb3JtZXJseVNlcmlhbGl6ZWRBcz86IHN0cmluZzsgZWRpdG9yT25seT86IGJvb2xlYW47IG92ZXJyaWRlPzogYm9vbGVhbjsgYW5pbWF0YWJsZT86IGJvb2xlYW59IHwgYW55W118RnVuY3Rpb258Y2MuVmFsdWVUeXBlfG51bWJlcnxzdHJpbmd8Ym9vbGVhbik6IEZ1bmN0aW9uXG4gKiBwcm9wZXJ0eShfdGFyZ2V0OiBPYmplY3QsIF9rZXk6IGFueSwgX2Rlc2M/OiBhbnkpOiB2b2lkXG4gKi9cbmZ1bmN0aW9uIHByb3BlcnR5IChjdG9yUHJvdG9Pck9wdGlvbnMsIHByb3BOYW1lLCBkZXNjKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBudWxsO1xuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZWQgKGN0b3JQcm90bywgcHJvcE5hbWUsIGRlc2MpIHtcbiAgICAgICAgdmFyIGNhY2hlID0gZ2V0Q2xhc3NDYWNoZShjdG9yUHJvdG8uY29uc3RydWN0b3IpO1xuICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICAgIHZhciBjY2NsYXNzUHJvdG8gPSBnZXRTdWJEaWN0KGNhY2hlLCAncHJvdG8nKTtcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gZ2V0U3ViRGljdChjY2NsYXNzUHJvdG8sICdwcm9wZXJ0aWVzJyk7XG4gICAgICAgICAgICBnZW5Qcm9wZXJ0eShjdG9yUHJvdG8uY29uc3RydWN0b3IsIHByb3BlcnRpZXMsIHByb3BOYW1lLCBvcHRpb25zLCBkZXNjLCBjYWNoZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBwcm9wTmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb3B0aW9ucyA9IGN0b3JQcm90b09yT3B0aW9ucztcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBub3JtYWxpemVkKGN0b3JQcm90b09yT3B0aW9ucywgcHJvcE5hbWUsIGRlc2MpO1xuICAgIH1cbn1cblxuLy8gRWRpdG9yIERlY29yYXRvcnNcblxuZnVuY3Rpb24gY3JlYXRlRWRpdG9yRGVjb3JhdG9yIChhcmdDaGVja0Z1bmMsIGVkaXRvclByb3BOYW1lLCBzdGF0aWNWYWx1ZSkge1xuICAgIHJldHVybiBhcmdDaGVja0Z1bmMoZnVuY3Rpb24gKGN0b3IsIGRlY29yYXRlZFZhbHVlKSB7XG4gICAgICAgIHZhciBjYWNoZSA9IGdldENsYXNzQ2FjaGUoY3RvciwgZWRpdG9yUHJvcE5hbWUpO1xuICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IChzdGF0aWNWYWx1ZSAhPT0gdW5kZWZpbmVkKSA/IHN0YXRpY1ZhbHVlIDogZGVjb3JhdGVkVmFsdWU7XG4gICAgICAgICAgICB2YXIgcHJvdG8gPSBnZXRTdWJEaWN0KGNhY2hlLCAncHJvdG8nKTtcbiAgICAgICAgICAgIGdldFN1YkRpY3QocHJvdG8sICdlZGl0b3InKVtlZGl0b3JQcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH0sIGVkaXRvclByb3BOYW1lKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRHVtbXlEZWNvcmF0b3IgKGFyZ0NoZWNrRnVuYykge1xuICAgIHJldHVybiBhcmdDaGVja0Z1bmMoZk5PUCk7XG59XG5cbi8qKlxuICogISNlblxuICogTWFrZXMgYSBDQ0NsYXNzIHRoYXQgaW5oZXJpdCBmcm9tIGNvbXBvbmVudCBleGVjdXRlIGluIGVkaXQgbW9kZS48YnI+XG4gKiBCeSBkZWZhdWx0LCBhbGwgY29tcG9uZW50cyBhcmUgb25seSBleGVjdXRlZCBpbiBwbGF5IG1vZGUsXG4gKiB3aGljaCBtZWFucyB0aGV5IHdpbGwgbm90IGhhdmUgdGhlaXIgY2FsbGJhY2sgZnVuY3Rpb25zIGV4ZWN1dGVkIHdoaWxlIHRoZSBFZGl0b3IgaXMgaW4gZWRpdCBtb2RlLlxuICogISN6aFxuICog5YWB6K6457un5om/6IeqIENvbXBvbmVudCDnmoQgQ0NDbGFzcyDlnKjnvJbovpHlmajph4zmiafooYzjgII8YnI+XG4gKiDpu5jorqTmg4XlhrXkuIvvvIzmiYDmnIkgQ29tcG9uZW50IOmDveWPquS8muWcqOi/kOihjOaXtuaJjeS8muaJp+ihjO+8jOS5n+WwseaYr+ivtOWug+S7rOeahOeUn+WRveWRqOacn+Wbnuiwg+S4jeS8muWcqOe8lui+keWZqOmHjOinpuWPkeOAglxuICpcbiAqIEBtZXRob2QgZXhlY3V0ZUluRWRpdE1vZGVcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzcywgZXhlY3V0ZUluRWRpdE1vZGV9ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiAmIzY0O2NjY2xhc3NcbiAqICYjNjQ7ZXhlY3V0ZUluRWRpdE1vZGVcbiAqIGNsYXNzIE5ld1NjcmlwdCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKiBAdHlwZXNjcmlwdFxuICogZXhlY3V0ZUluRWRpdE1vZGUoKTogRnVuY3Rpb25cbiAqIGV4ZWN1dGVJbkVkaXRNb2RlKF9jbGFzczogRnVuY3Rpb24pOiB2b2lkXG4gKi9cbnZhciBleGVjdXRlSW5FZGl0TW9kZSA9IChDQ19ERVYgPyBjcmVhdGVFZGl0b3JEZWNvcmF0b3IgOiBjcmVhdGVEdW1teURlY29yYXRvcikoY2hlY2tDdG9yQXJndW1lbnQsICdleGVjdXRlSW5FZGl0TW9kZScsIHRydWUpO1xuXG4vKipcbiAqICEjZW5cbiAqIEF1dG9tYXRpY2FsbHkgYWRkIHJlcXVpcmVkIGNvbXBvbmVudCBhcyBhIGRlcGVuZGVuY3kgZm9yIHRoZSBDQ0NsYXNzIHRoYXQgaW5oZXJpdCBmcm9tIGNvbXBvbmVudC5cbiAqICEjemhcbiAqIOS4uuWjsOaYjuS4uiBDQ0NsYXNzIOeahOe7hOS7tua3u+WKoOS+nei1lueahOWFtuWug+e7hOS7tuOAguW9k+e7hOS7tua3u+WKoOWIsOiKgueCueS4iuaXtu+8jOWmguaenOS+nei1lueahOe7hOS7tuS4jeWtmOWcqO+8jOW8leaTjuWwhuS8muiHquWKqOWwhuS+nei1lue7hOS7tua3u+WKoOWIsOWQjOS4gOS4quiKgueCue+8jOmYsuatouiEmuacrOWHuumUmeOAguivpeiuvue9ruWcqOi/kOihjOaXtuWQjOagt+acieaViOOAglxuICpcbiAqIEBtZXRob2QgcmVxdWlyZUNvbXBvbmVudFxuICogQHBhcmFtIHtDb21wb25lbnR9IHJlcXVpcmVkQ29tcG9uZW50XG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3MsIHJlcXVpcmVDb21wb25lbnR9ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiAmIzY0O2NjY2xhc3NcbiAqICYjNjQ7cmVxdWlyZUNvbXBvbmVudChjYy5TcHJpdGUpXG4gKiBjbGFzcyBTcHJpdGVDdHJsIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqIEB0eXBlc2NyaXB0XG4gKiByZXF1aXJlQ29tcG9uZW50KHJlcXVpcmVkQ29tcG9uZW50OiB0eXBlb2YgY2MuQ29tcG9uZW50KTogRnVuY3Rpb25cbiAqL1xudmFyIHJlcXVpcmVDb21wb25lbnQgPSBjcmVhdGVFZGl0b3JEZWNvcmF0b3IoY2hlY2tDb21wQXJndW1lbnQsICdyZXF1aXJlQ29tcG9uZW50Jyk7XG5cbi8qKlxuICogISNlblxuICogVGhlIG1lbnUgcGF0aCB0byByZWdpc3RlciBhIGNvbXBvbmVudCB0byB0aGUgZWRpdG9ycyBcIkNvbXBvbmVudFwiIG1lbnUuIEVnLiBcIlJlbmRlcmluZy9DYW1lcmFDdHJsXCIuXG4gKiAhI3poXG4gKiDlsIblvZPliY3nu4Tku7bmt7vliqDliLDnu4Tku7boj5zljZXkuK3vvIzmlrnkvr/nlKjmiLfmn6Xmib7jgILkvovlpoIgXCJSZW5kZXJpbmcvQ2FtZXJhQ3RybFwi44CCXG4gKlxuICogQG1ldGhvZCBtZW51XG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aCAtIFRoZSBwYXRoIGlzIHRoZSBtZW51IHJlcHJlc2VudGVkIGxpa2UgYSBwYXRobmFtZS5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgRm9yIGV4YW1wbGUgdGhlIG1lbnUgY291bGQgYmUgXCJSZW5kZXJpbmcvQ2FtZXJhQ3RybFwiLlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzLCBtZW51fSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogJiM2NDtjY2NsYXNzXG4gKiAmIzY0O21lbnUoXCJSZW5kZXJpbmcvQ2FtZXJhQ3RybFwiKVxuICogY2xhc3MgTmV3U2NyaXB0IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqIEB0eXBlc2NyaXB0XG4gKiBtZW51KHBhdGg6IHN0cmluZyk6IEZ1bmN0aW9uXG4gKi9cbnZhciBtZW51ID0gKENDX0RFViA/IGNyZWF0ZUVkaXRvckRlY29yYXRvciA6IGNyZWF0ZUR1bW15RGVjb3JhdG9yKShjaGVja1N0cmluZ0FyZ3VtZW50LCAnbWVudScpO1xuXG4vKipcbiAqICEjZW5cbiAqIFRoZSBleGVjdXRpb24gb3JkZXIgb2YgbGlmZWN5Y2xlIG1ldGhvZHMgZm9yIENvbXBvbmVudC5cbiAqIFRob3NlIGxlc3MgdGhhbiAwIHdpbGwgZXhlY3V0ZSBiZWZvcmUgd2hpbGUgdGhvc2UgZ3JlYXRlciB0aGFuIDAgd2lsbCBleGVjdXRlIGFmdGVyLlxuICogVGhlIG9yZGVyIHdpbGwgb25seSBhZmZlY3Qgb25Mb2FkLCBvbkVuYWJsZSwgc3RhcnQsIHVwZGF0ZSBhbmQgbGF0ZVVwZGF0ZSB3aGlsZSBvbkRpc2FibGUgYW5kIG9uRGVzdHJveSB3aWxsIG5vdCBiZSBhZmZlY3RlZC5cbiAqICEjemhcbiAqIOiuvue9ruiEmuacrOeUn+WRveWRqOacn+aWueazleiwg+eUqOeahOS8mOWFiOe6p+OAguS8mOWFiOe6p+Wwj+S6jiAwIOeahOe7hOS7tuWwhuS8muS8mOWFiOaJp+ihjO+8jOS8mOWFiOe6p+Wkp+S6jiAwIOeahOe7hOS7tuWwhuS8muW7tuWQjuaJp+ihjOOAguS8mOWFiOe6p+S7heS8muW9seWTjSBvbkxvYWQsIG9uRW5hYmxlLCBzdGFydCwgdXBkYXRlIOWSjCBsYXRlVXBkYXRl77yM6ICMIG9uRGlzYWJsZSDlkowgb25EZXN0cm95IOS4jeWPl+W9seWTjeOAglxuICpcbiAqIEBtZXRob2QgZXhlY3V0aW9uT3JkZXJcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcmRlciAtIFRoZSBleGVjdXRpb24gb3JkZXIgb2YgbGlmZWN5Y2xlIG1ldGhvZHMgZm9yIENvbXBvbmVudC4gVGhvc2UgbGVzcyB0aGFuIDAgd2lsbCBleGVjdXRlIGJlZm9yZSB3aGlsZSB0aG9zZSBncmVhdGVyIHRoYW4gMCB3aWxsIGV4ZWN1dGUgYWZ0ZXIuXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3MsIGV4ZWN1dGlvbk9yZGVyfSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogJiM2NDtjY2NsYXNzXG4gKiAmIzY0O2V4ZWN1dGlvbk9yZGVyKDEpXG4gKiBjbGFzcyBDYW1lcmFDdHJsIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqIEB0eXBlc2NyaXB0XG4gKiBleGVjdXRpb25PcmRlcihvcmRlcjogbnVtYmVyKTogRnVuY3Rpb25cbiAqL1xudmFyIGV4ZWN1dGlvbk9yZGVyID0gY3JlYXRlRWRpdG9yRGVjb3JhdG9yKGNoZWNrTnVtYmVyQXJndW1lbnQsICdleGVjdXRpb25PcmRlcicpO1xuXG4vKipcbiAqICEjZW5cbiAqIFByZXZlbnRzIENvbXBvbmVudCBvZiB0aGUgc2FtZSB0eXBlIChvciBzdWJ0eXBlKSB0byBiZSBhZGRlZCBtb3JlIHRoYW4gb25jZSB0byBhIE5vZGUuXG4gKiAhI3poXG4gKiDpmLLmraLlpJrkuKrnm7jlkIznsbvlnovvvIjmiJblrZDnsbvlnovvvInnmoTnu4Tku7booqvmt7vliqDliLDlkIzkuIDkuKroioLngrnjgIJcbiAqXG4gKiBAbWV0aG9kIGRpc2FsbG93TXVsdGlwbGVcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB7Y2NjbGFzcywgZGlzYWxsb3dNdWx0aXBsZX0gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqICYjNjQ7Y2NjbGFzc1xuICogJiM2NDtkaXNhbGxvd011bHRpcGxlXG4gKiBjbGFzcyBDYW1lcmFDdHJsIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqIEB0eXBlc2NyaXB0XG4gKiBkaXNhbGxvd011bHRpcGxlKCk6IEZ1bmN0aW9uXG4gKiBkaXNhbGxvd011bHRpcGxlKF9jbGFzczogRnVuY3Rpb24pOiB2b2lkXG4gKi9cbnZhciBkaXNhbGxvd011bHRpcGxlID0gKENDX0RFViA/IGNyZWF0ZUVkaXRvckRlY29yYXRvciA6IGNyZWF0ZUR1bW15RGVjb3JhdG9yKShjaGVja0N0b3JBcmd1bWVudCwgJ2Rpc2FsbG93TXVsdGlwbGUnKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBJZiBzcGVjaWZpZWQsIHRoZSBlZGl0b3IncyBzY2VuZSB2aWV3IHdpbGwga2VlcCB1cGRhdGluZyB0aGlzIG5vZGUgaW4gNjAgZnBzIHdoZW4gaXQgaXMgc2VsZWN0ZWQsIG90aGVyd2lzZSwgaXQgd2lsbCB1cGRhdGUgb25seSBpZiBuZWNlc3NhcnkuPGJyPlxuICogVGhpcyBwcm9wZXJ0eSBpcyBvbmx5IGF2YWlsYWJsZSBpZiBleGVjdXRlSW5FZGl0TW9kZSBpcyB0cnVlLlxuICogISN6aFxuICog5b2T5oyH5a6a5LqGIFwiZXhlY3V0ZUluRWRpdE1vZGVcIiDku6XlkI7vvIxwbGF5T25Gb2N1cyDlj6/ku6XlnKjpgInkuK3lvZPliY3nu4Tku7bmiYDlnKjnmoToioLngrnml7bvvIzmj5Dpq5jnvJbovpHlmajnmoTlnLrmma/liLfmlrDpopHnjofliLAgNjAgRlBT77yM5ZCm5YiZ5Zy65pmv5bCx5Y+q5Lya5Zyo5b+F6KaB55qE5pe25YCZ6L+b6KGM6YeN57uY44CCXG4gKlxuICogQG1ldGhvZCBwbGF5T25Gb2N1c1xuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzLCBwbGF5T25Gb2N1cywgZXhlY3V0ZUluRWRpdE1vZGV9ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiAmIzY0O2NjY2xhc3NcbiAqICYjNjQ7ZXhlY3V0ZUluRWRpdE1vZGVcbiAqICYjNjQ7cGxheU9uRm9jdXNcbiAqIGNsYXNzIENhbWVyYUN0cmwgZXh0ZW5kcyBjYy5Db21wb25lbnQge1xuICogICAgIC8vIC4uLlxuICogfVxuICogQHR5cGVzY3JpcHRcbiAqIHBsYXlPbkZvY3VzKCk6IEZ1bmN0aW9uXG4gKiBwbGF5T25Gb2N1cyhfY2xhc3M6IEZ1bmN0aW9uKTogdm9pZFxuICovXG52YXIgcGxheU9uRm9jdXMgPSAoQ0NfREVWID8gY3JlYXRlRWRpdG9yRGVjb3JhdG9yIDogY3JlYXRlRHVtbXlEZWNvcmF0b3IpKGNoZWNrQ3RvckFyZ3VtZW50LCAncGxheU9uRm9jdXMnLCB0cnVlKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBTcGVjaWZ5aW5nIHRoZSB1cmwgb2YgdGhlIGN1c3RvbSBodG1sIHRvIGRyYXcgdGhlIGNvbXBvbmVudCBpbiAqKlByb3BlcnRpZXMqKi5cbiAqICEjemhcbiAqIOiHquWumuS5ieW9k+WJjee7hOS7tuWcqCAqKuWxnuaAp+ajgOafpeWZqCoqIOS4rea4suafk+aXtuaJgOeUqOeahOe9kemhtSB1cmzjgIJcbiAqXG4gKiBAbWV0aG9kIGluc3BlY3RvclxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzLCBpbnNwZWN0b3J9ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiAmIzY0O2NjY2xhc3NcbiAqICYjNjQ7aW5zcGVjdG9yKFwicGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9jYW1lcmEtY3RybC5qc1wiKVxuICogY2xhc3MgTmV3U2NyaXB0IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqIEB0eXBlc2NyaXB0XG4gKiBpbnNwZWN0b3IocGF0aDogc3RyaW5nKTogRnVuY3Rpb25cbiAqL1xudmFyIGluc3BlY3RvciA9IChDQ19ERVYgPyBjcmVhdGVFZGl0b3JEZWNvcmF0b3IgOiBjcmVhdGVEdW1teURlY29yYXRvcikoY2hlY2tTdHJpbmdBcmd1bWVudCwgJ2luc3BlY3RvcicpO1xuXG4vKipcbiAqICEjZW5cbiAqIFNwZWNpZnlpbmcgdGhlIHVybCBvZiB0aGUgaWNvbiB0byBkaXNwbGF5IGluIHRoZSBlZGl0b3IuXG4gKiAhI3poXG4gKiDoh6rlrprkuYnlvZPliY3nu4Tku7blnKjnvJbovpHlmajkuK3mmL7npLrnmoTlm77moIcgdXJs44CCXG4gKlxuICogQG1ldGhvZCBpY29uXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcHJpdmF0ZVxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHtjY2NsYXNzLCBpY29ufSA9IGNjLl9kZWNvcmF0b3I7XG4gKlxuICogJiM2NDtjY2NsYXNzXG4gKiAmIzY0O2ljb24oXCJ4eHh4LnBuZ1wiKVxuICogY2xhc3MgTmV3U2NyaXB0IGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcbiAqICAgICAvLyAuLi5cbiAqIH1cbiAqIEB0eXBlc2NyaXB0XG4gKiBpY29uKHBhdGg6IHN0cmluZyk6IEZ1bmN0aW9uXG4gKi9cbnZhciBpY29uID0gKENDX0RFViA/IGNyZWF0ZUVkaXRvckRlY29yYXRvciA6IGNyZWF0ZUR1bW15RGVjb3JhdG9yKShjaGVja1N0cmluZ0FyZ3VtZW50LCAnaWNvbicpO1xuXG4vKipcbiAqICEjZW5cbiAqIFRoZSBjdXN0b20gZG9jdW1lbnRhdGlvbiBVUkwuXG4gKiAhI3poXG4gKiDmjIflrprlvZPliY3nu4Tku7bnmoTluK7liqnmlofmoaPnmoQgdXJs77yM6K6+572u6L+H5ZCO77yM5ZyoICoq5bGe5oCn5qOA5p+l5ZmoKiog5Lit5bCx5Lya5Ye6546w5LiA5Liq5biu5Yqp5Zu+5qCH77yM55So5oi354K55Ye75bCG5omT5byA5oyH5a6a55qE572R6aG144CCXG4gKlxuICogQG1ldGhvZCBoZWxwXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3MsIGhlbHB9ID0gY2MuX2RlY29yYXRvcjtcbiAqXG4gKiAmIzY0O2NjY2xhc3NcbiAqICYjNjQ7aGVscChcImFwcDovL2RvY3MvaHRtbC9jb21wb25lbnRzL3NwaW5lLmh0bWxcIilcbiAqIGNsYXNzIE5ld1NjcmlwdCBleHRlbmRzIGNjLkNvbXBvbmVudCB7XG4gKiAgICAgLy8gLi4uXG4gKiB9XG4gKiBAdHlwZXNjcmlwdFxuICogaGVscChwYXRoOiBzdHJpbmcpOiBGdW5jdGlvblxuICovXG52YXIgaGVscCA9IChDQ19ERVYgPyBjcmVhdGVFZGl0b3JEZWNvcmF0b3IgOiBjcmVhdGVEdW1teURlY29yYXRvcikoY2hlY2tTdHJpbmdBcmd1bWVudCwgJ2hlbHAnKTtcblxuLy8gT3RoZXIgRGVjb3JhdG9yc1xuXG4vKipcbiAqIE5PVEU6PGJyPlxuICogVGhlIG9sZCBtaXhpbnMgaW1wbGVtZW50ZWQgaW4gY2MuQ2xhc3MoRVM1KSBiZWhhdmVzIGV4YWN0IHRoZSBzYW1lIGFzIG11bHRpcGxlIGluaGVyaXRhbmNlLlxuICogQnV0IHNpbmNlIEVTNiwgY2xhc3MgY29uc3RydWN0b3IgY2FuJ3QgYmUgZnVuY3Rpb24tY2FsbGVkIGFuZCBjbGFzcyBtZXRob2RzIGJlY29tZSBub24tZW51bWVyYWJsZSxcbiAqIHNvIHdlIGNhbiBub3QgbWl4IGluIEVTNiBDbGFzc2VzLjxicj5cbiAqIFNlZTo8YnI+XG4gKiBbaHR0cHM6Ly9lc2Rpc2N1c3Mub3JnL3RvcGljL3RyYWl0cy1hcmUtbm93LWltcG9zc2libGUtaW4tZXM2LXVudGlsLWVzNy1zaW5jZS1yZXYzMl0oaHR0cHM6Ly9lc2Rpc2N1c3Mub3JnL3RvcGljL3RyYWl0cy1hcmUtbm93LWltcG9zc2libGUtaW4tZXM2LXVudGlsLWVzNy1zaW5jZS1yZXYzMik8YnI+XG4gKiBPbmUgcG9zc2libGUgc29sdXRpb24gKGJ1dCBJREUgdW5mcmllbmRseSk6PGJyPlxuICogW2h0dHA6Ly9qdXN0aW5mYWduYW5pLmNvbS8yMDE1LzEyLzIxL3JlYWwtbWl4aW5zLXdpdGgtamF2YXNjcmlwdC1jbGFzc2VzXShodHRwOi8vanVzdGluZmFnbmFuaS5jb20vMjAxNS8xMi8yMS9yZWFsLW1peGlucy13aXRoLWphdmFzY3JpcHQtY2xhc3Nlcy8pPGJyPlxuICogPGJyPlxuICogTk9URTo8YnI+XG4gKiBZb3UgbXVzdCBtYW51YWxseSBjYWxsIG1peGlucyBjb25zdHJ1Y3RvciwgdGhpcyBpcyBkaWZmZXJlbnQgZnJvbSBjYy5DbGFzcyhFUzUpLlxuICpcbiAqIEBtZXRob2QgbWl4aW5zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSAuLi5jdG9yIC0gY29uc3RydWN0b3JzIHRvIG1peCwgb25seSBzdXBwb3J0IEVTNSBjb25zdHJ1Y3RvcnMgb3IgY2xhc3NlcyBkZWZpbmVkIGJ5IHVzaW5nIGBjYy5DbGFzc2AsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90IHN1cHBvcnQgRVM2IENsYXNzZXMuXG4gKiBAZXhhbXBsZVxuICogY29uc3Qge2NjY2xhc3MsIG1peGluc30gPSBjYy5fZGVjb3JhdG9yO1xuICpcbiAqIGNsYXNzIEFuaW1hbCB7IC4uLiB9XG4gKlxuICogY29uc3QgRmx5ID0gY2MuQ2xhc3Moe1xuICogICAgIGNvbnN0cnVjdG9yICgpIHsgLi4uIH1cbiAqIH0pO1xuICpcbiAqICYjNjQ7Y2NjbGFzc1xuICogJiM2NDttaXhpbnMoY2MuRXZlbnRUYXJnZXQsIEZseSlcbiAqIGNsYXNzIEJpcmQgZXh0ZW5kcyBBbmltYWwge1xuICogICAgIGNvbnN0cnVjdG9yICgpIHtcbiAqICAgICAgICAgc3VwZXIoKTtcbiAqXG4gKiAgICAgICAgIC8vIFlvdSBtdXN0IG1hbnVhbGx5IGNhbGwgbWl4aW5zIGNvbnN0cnVjdG9yLCB0aGlzIGlzIGRpZmZlcmVudCBmcm9tIGNjLkNsYXNzKEVTNSlcbiAqICAgICAgICAgY2MuRXZlbnRUYXJnZXQuY2FsbCh0aGlzKTtcbiAqICAgICAgICAgRmx5LmNhbGwodGhpcyk7XG4gKiAgICAgfVxuICogICAgIC8vIC4uLlxuICogfVxuICogQHR5cGVzY3JpcHRcbiAqIG1peGlucyhjdG9yOiBGdW5jdGlvbiwgLi4ucmVzdDogRnVuY3Rpb25bXSk6IEZ1bmN0aW9uXG4gKi9cbmZ1bmN0aW9uIG1peGlucyAoKSB7XG4gICAgdmFyIG1peGlucyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIG1peGluc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjdG9yKSB7XG4gICAgICAgIHZhciBjYWNoZSA9IGdldENsYXNzQ2FjaGUoY3RvciwgJ21peGlucycpO1xuICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICAgIGdldFN1YkRpY3QoY2FjaGUsICdwcm90bycpLm1peGlucyA9IG1peGlucztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2MuX2RlY29yYXRvciA9IG1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNjY2xhc3MsXG4gICAgcHJvcGVydHksXG4gICAgZXhlY3V0ZUluRWRpdE1vZGUsXG4gICAgcmVxdWlyZUNvbXBvbmVudCxcbiAgICBtZW51LFxuICAgIGV4ZWN1dGlvbk9yZGVyLFxuICAgIGRpc2FsbG93TXVsdGlwbGUsXG4gICAgcGxheU9uRm9jdXMsXG4gICAgaW5zcGVjdG9yLFxuICAgIGljb24sXG4gICAgaGVscCxcbiAgICBtaXhpbnMsXG59O1xuXG4vLyBmaXggc3VibW9kdWxlIHBvbGx1dGUgLi4uXG4vKipcbiAqIEBzdWJtb2R1bGUgY2NcbiAqL1xuIl19