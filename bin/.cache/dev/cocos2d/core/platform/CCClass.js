
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCClass.js';
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
var js = require('./js');

var Enum = require('./CCEnum');

var utils = require('./utils');

var _isPlainEmptyObj_DEV = utils.isPlainEmptyObj_DEV;
var _cloneable_DEV = utils.cloneable_DEV;

var Attr = require('./attribute');

var DELIMETER = Attr.DELIMETER;

var preprocess = require('./preprocess-class');

require('./requiring-frame');

var BUILTIN_ENTRIES = ['name', 'extends', 'mixins', 'ctor', '__ctor__', 'properties', 'statics', 'editor', '__ES6__'];
var INVALID_STATICS_DEV = CC_DEV && ['name', '__ctors__', '__props__', 'arguments', 'call', 'apply', 'caller', 'length', 'prototype'];

function pushUnique(array, item) {
  if (array.indexOf(item) < 0) {
    array.push(item);
  }
}

var deferredInitializer = {
  // Configs for classes which needs deferred initialization
  datas: null,
  // register new class
  // data - {cls: cls, cb: properties, mixins: options.mixins}
  push: function push(data) {
    if (this.datas) {
      this.datas.push(data);
    } else {
      this.datas = [data]; // start a new timer to initialize

      var self = this;
      setTimeout(function () {
        self.init();
      }, 0);
    }
  },
  init: function init() {
    var datas = this.datas;

    if (datas) {
      for (var i = 0; i < datas.length; ++i) {
        var data = datas[i];
        var cls = data.cls;
        var properties = data.props;

        if (typeof properties === 'function') {
          properties = properties();
        }

        var name = js.getClassName(cls);

        if (properties) {
          declareProperties(cls, name, properties, cls.$super, data.mixins);
        } else {
          cc.errorID(3633, name);
        }
      }

      this.datas = null;
    }
  }
}; // both getter and prop must register the name into __props__ array

function appendProp(cls, name) {
  if (CC_DEV) {
    //if (!IDENTIFIER_RE.test(name)) {
    //    cc.error('The property name "' + name + '" is not compliant with JavaScript naming standards');
    //    return;
    //}
    if (name.indexOf('.') !== -1) {
      cc.errorID(3634);
      return;
    }
  }

  pushUnique(cls.__props__, name);
}

function defineProp(cls, className, propName, val, es6) {
  var defaultValue = val["default"];

  if (CC_DEV) {
    if (!es6) {
      // check default object value
      if (typeof defaultValue === 'object' && defaultValue) {
        if (Array.isArray(defaultValue)) {
          // check array empty
          if (defaultValue.length > 0) {
            cc.errorID(3635, className, propName, propName);
            return;
          }
        } else if (!_isPlainEmptyObj_DEV(defaultValue)) {
          // check cloneable
          if (!_cloneable_DEV(defaultValue)) {
            cc.errorID(3636, className, propName, propName);
            return;
          }
        }
      }
    } // check base prototype to avoid name collision


    if (CCClass.getInheritanceChain(cls).some(function (x) {
      return x.prototype.hasOwnProperty(propName);
    })) {
      cc.errorID(3637, className, propName, className);
      return;
    }
  } // set default value


  Attr.setClassAttr(cls, propName, 'default', defaultValue);
  appendProp(cls, propName); // apply attributes

  parseAttributes(cls, val, className, propName, false);

  if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
    for (var i = 0; i < onAfterProps_ET.length; i++) {
      onAfterProps_ET[i](cls, propName);
    }

    onAfterProps_ET.length = 0;
  }
}

function defineGetSet(cls, name, propName, val, es6) {
  var getter = val.get;
  var setter = val.set;
  var proto = cls.prototype;
  var d = Object.getOwnPropertyDescriptor(proto, propName);
  var setterUndefined = !d;

  if (getter) {
    if (CC_DEV && !es6 && d && d.get) {
      cc.errorID(3638, name, propName);
      return;
    }

    parseAttributes(cls, val, name, propName, true);

    if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
      onAfterProps_ET.length = 0;
    }

    Attr.setClassAttr(cls, propName, 'serializable', false);

    if (CC_DEV) {
      // 不论是否 visible 都要添加到 props，否则 asset watcher 不能正常工作
      appendProp(cls, propName);
    }

    if (!es6) {
      js.get(proto, propName, getter, setterUndefined, setterUndefined);
    }

    if (CC_EDITOR || CC_DEV) {
      Attr.setClassAttr(cls, propName, 'hasGetter', true); // 方便 editor 做判断
    }
  }

  if (setter) {
    if (!es6) {
      if (CC_DEV && d && d.set) {
        return cc.errorID(3640, name, propName);
      }

      js.set(proto, propName, setter, setterUndefined, setterUndefined);
    }

    if (CC_EDITOR || CC_DEV) {
      Attr.setClassAttr(cls, propName, 'hasSetter', true); // 方便 editor 做判断
    }
  }
}

function getDefault(defaultVal) {
  if (typeof defaultVal === 'function') {
    if (CC_EDITOR) {
      try {
        return defaultVal();
      } catch (e) {
        cc._throw(e);

        return undefined;
      }
    } else {
      return defaultVal();
    }
  }

  return defaultVal;
}

function mixinWithInherited(dest, src, filter) {
  for (var prop in src) {
    if (!dest.hasOwnProperty(prop) && (!filter || filter(prop))) {
      Object.defineProperty(dest, prop, js.getPropertyDescriptor(src, prop));
    }
  }
}

function doDefine(className, baseClass, mixins, options) {
  var shouldAddProtoCtor;
  var __ctor__ = options.__ctor__;
  var ctor = options.ctor;
  var __es6__ = options.__ES6__;

  if (CC_DEV) {
    // check ctor
    var ctorToUse = __ctor__ || ctor;

    if (ctorToUse) {
      if (CCClass._isCCClass(ctorToUse)) {
        cc.errorID(3618, className);
      } else if (typeof ctorToUse !== 'function') {
        cc.errorID(3619, className);
      } else {
        if (baseClass && /\bprototype.ctor\b/.test(ctorToUse)) {
          if (__es6__) {
            cc.errorID(3651, className || "");
          } else {
            cc.warnID(3600, className || "");
            shouldAddProtoCtor = true;
          }
        }
      }

      if (ctor) {
        if (__ctor__) {
          cc.errorID(3649, className);
        } else {
          ctor = options.ctor = _validateCtor_DEV(ctor, baseClass, className, options);
        }
      }
    }
  }

  var ctors;
  var fireClass;

  if (__es6__) {
    ctors = [ctor];
    fireClass = ctor;
  } else {
    ctors = __ctor__ ? [__ctor__] : _getAllCtors(baseClass, mixins, options);
    fireClass = _createCtor(ctors, baseClass, className, options); // extend - Create a new Class that inherits from this Class

    js.value(fireClass, 'extend', function (options) {
      options["extends"] = this;
      return CCClass(options);
    }, true);
  }

  js.value(fireClass, '__ctors__', ctors.length > 0 ? ctors : null, true);
  var prototype = fireClass.prototype;

  if (baseClass) {
    if (!__es6__) {
      js.extend(fireClass, baseClass); // 这里会把父类的 __props__ 复制给子类

      prototype = fireClass.prototype; // get extended prototype
    }

    fireClass.$super = baseClass;

    if (CC_DEV && shouldAddProtoCtor) {
      prototype.ctor = function () {};
    }
  }

  if (mixins) {
    for (var m = mixins.length - 1; m >= 0; m--) {
      var mixin = mixins[m];
      mixinWithInherited(prototype, mixin.prototype); // mixin statics (this will also copy editor attributes for component)

      mixinWithInherited(fireClass, mixin, function (prop) {
        return mixin.hasOwnProperty(prop) && (!CC_DEV || INVALID_STATICS_DEV.indexOf(prop) < 0);
      }); // mixin attributes

      if (CCClass._isCCClass(mixin)) {
        mixinWithInherited(Attr.getClassAttrs(fireClass), Attr.getClassAttrs(mixin));
      }
    } // restore constuctor overridden by mixin


    prototype.constructor = fireClass;
  }

  if (!__es6__) {
    prototype.__initProps__ = compileProps;
  }

  js.setClassName(className, fireClass);
  return fireClass;
}

function define(className, baseClass, mixins, options) {
  var Component = cc.Component;

  var frame = cc._RF.peek();

  if (frame && js.isChildClassOf(baseClass, Component)) {
    // project component
    if (js.isChildClassOf(frame.cls, Component)) {
      cc.errorID(3615);
      return null;
    }

    if (CC_DEV && frame.uuid && className) {
      cc.warnID(3616, className);
    }

    className = className || frame.script;
  }

  var cls = doDefine(className, baseClass, mixins, options);

  if (frame) {
    if (js.isChildClassOf(baseClass, Component)) {
      var uuid = frame.uuid;

      if (uuid) {
        js._setClassId(uuid, cls);

        if (CC_EDITOR) {
          Component._addMenuItem(cls, 'i18n:MAIN_MENU.component.scripts/' + className, -1);

          cls.prototype.__scriptUuid = Editor.Utils.UuidUtils.decompressUuid(uuid);
        }
      }

      frame.cls = cls;
    } else if (!js.isChildClassOf(frame.cls, Component)) {
      frame.cls = cls;
    }
  }

  return cls;
}

function normalizeClassName_DEV(className) {
  var DefaultName = 'CCClass';

  if (className) {
    className = className.replace(/^[^$A-Za-z_]/, '_').replace(/[^0-9A-Za-z_$]/g, '_');

    try {
      // validate name
      Function('function ' + className + '(){}')();
      return className;
    } catch (e) {
      ;
    }
  }

  return DefaultName;
}

function getNewValueTypeCodeJit(value) {
  var clsName = js.getClassName(value);
  var type = value.constructor;
  var res = 'new ' + clsName + '(';

  for (var i = 0; i < type.__props__.length; i++) {
    var prop = type.__props__[i];
    var propVal = value[prop];

    if (CC_DEV && typeof propVal === 'object') {
      cc.errorID(3641, clsName);
      return 'new ' + clsName + '()';
    }

    res += propVal;

    if (i < type.__props__.length - 1) {
      res += ',';
    }
  }

  return res + ')';
} // TODO - move escapeForJS, IDENTIFIER_RE, getNewValueTypeCodeJit to misc.js or a new source file
// convert a normal string including newlines, quotes and unicode characters into a string literal
// ready to use in JavaScript source


function escapeForJS(s) {
  return JSON.stringify(s). // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
  replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

function getInitPropsJit(attrs, propList) {
  // functions for generated code
  var F = [];
  var func = '';

  for (var i = 0; i < propList.length; i++) {
    var prop = propList[i];
    var attrKey = prop + DELIMETER + 'default';

    if (attrKey in attrs) {
      // getter does not have default
      var statement;

      if (IDENTIFIER_RE.test(prop)) {
        statement = 'this.' + prop + '=';
      } else {
        statement = 'this[' + escapeForJS(prop) + ']=';
      }

      var expression;
      var def = attrs[attrKey];

      if (typeof def === 'object' && def) {
        if (def instanceof cc.ValueType) {
          expression = getNewValueTypeCodeJit(def);
        } else if (Array.isArray(def)) {
          expression = '[]';
        } else {
          expression = '{}';
        }
      } else if (typeof def === 'function') {
        var index = F.length;
        F.push(def);
        expression = 'F[' + index + ']()';

        if (CC_EDITOR) {
          func += 'try {\n' + statement + expression + ';\n}\ncatch(e) {\ncc._throw(e);\n' + statement + 'undefined;\n}\n';
          continue;
        }
      } else if (typeof def === 'string') {
        expression = escapeForJS(def);
      } else {
        // number, boolean, null, undefined
        expression = def;
      }

      statement = statement + expression + ';\n';
      func += statement;
    }
  } // if (CC_TEST && !isPhantomJS) {
  //     console.log(func);
  // }


  var initProps;

  if (F.length === 0) {
    initProps = Function(func);
  } else {
    initProps = Function('F', 'return (function(){\n' + func + '})')(F);
  }

  return initProps;
}

function getInitProps(attrs, propList) {
  var advancedProps = [];
  var advancedValues = [];
  var simpleProps = [];
  var simpleValues = [];

  for (var i = 0; i < propList.length; ++i) {
    var prop = propList[i];
    var attrKey = prop + DELIMETER + 'default';

    if (attrKey in attrs) {
      // getter does not have default
      var def = attrs[attrKey];

      if (typeof def === 'object' && def || typeof def === 'function') {
        advancedProps.push(prop);
        advancedValues.push(def);
      } else {
        // number, boolean, null, undefined, string
        simpleProps.push(prop);
        simpleValues.push(def);
      }
    }
  }

  return function () {
    for (var _i = 0; _i < simpleProps.length; ++_i) {
      this[simpleProps[_i]] = simpleValues[_i];
    }

    for (var _i2 = 0; _i2 < advancedProps.length; _i2++) {
      var _prop = advancedProps[_i2];
      var expression;
      var def = advancedValues[_i2];

      if (typeof def === 'object') {
        if (def instanceof cc.ValueType) {
          expression = def.clone();
        } else if (Array.isArray(def)) {
          expression = [];
        } else {
          expression = {};
        }
      } else {
        // def is function
        if (CC_EDITOR) {
          try {
            expression = def();
          } catch (err) {
            cc._throw(e);

            continue;
          }
        } else {
          expression = def();
        }
      }

      this[_prop] = expression;
    }
  };
} // simple test variable name


var IDENTIFIER_RE = /^[A-Za-z_$][0-9A-Za-z_$]*$/;

function compileProps(actualClass) {
  // init deferred properties
  var attrs = Attr.getClassAttrs(actualClass);
  var propList = actualClass.__props__;

  if (propList === null) {
    deferredInitializer.init();
    propList = actualClass.__props__;
  } // Overwite __initProps__ to avoid compile again.


  var initProps = CC_SUPPORT_JIT ? getInitPropsJit(attrs, propList) : getInitProps(attrs, propList);
  actualClass.prototype.__initProps__ = initProps; // call instantiateProps immediately, no need to pass actualClass into it anymore
  // (use call to manually bind `this` because `this` may not instanceof actualClass)

  initProps.call(this);
}

var _createCtor = CC_SUPPORT_JIT ? function (ctors, baseClass, className, options) {
  var superCallBounded = baseClass && boundSuperCalls(baseClass, options, className);
  var ctorName = CC_DEV ? normalizeClassName_DEV(className) : 'CCClass';
  var body = 'return function ' + ctorName + '(){\n';

  if (superCallBounded) {
    body += 'this._super=null;\n';
  } // instantiate props


  body += 'this.__initProps__(' + ctorName + ');\n'; // call user constructors

  var ctorLen = ctors.length;

  if (ctorLen > 0) {
    var useTryCatch = CC_DEV && !(className && className.startsWith('cc.'));

    if (useTryCatch) {
      body += 'try{\n';
    }

    var SNIPPET = '].apply(this,arguments);\n';

    if (ctorLen === 1) {
      body += ctorName + '.__ctors__[0' + SNIPPET;
    } else {
      body += 'var cs=' + ctorName + '.__ctors__;\n';

      for (var i = 0; i < ctorLen; i++) {
        body += 'cs[' + i + SNIPPET;
      }
    }

    if (useTryCatch) {
      body += '}catch(e){\n' + 'cc._throw(e);\n' + '}\n';
    }
  }

  body += '}';
  return Function(body)();
} : function (ctors, baseClass, className, options) {
  var superCallBounded = baseClass && boundSuperCalls(baseClass, options, className);
  var ctorLen = ctors.length;

  var _Class5;

  if (ctorLen > 0) {
    if (superCallBounded) {
      if (ctorLen === 2) {
        // User Component
        _Class5 = function Class() {
          this._super = null;

          this.__initProps__(_Class5);

          ctors[0].apply(this, arguments);
          ctors[1].apply(this, arguments);
        };
      } else {
        _Class5 = function _Class() {
          this._super = null;

          this.__initProps__(_Class5);

          for (var i = 0; i < ctors.length; ++i) {
            ctors[i].apply(this, arguments);
          }
        };
      }
    } else {
      if (ctorLen === 3) {
        // Node
        _Class5 = function _Class2() {
          this.__initProps__(_Class5);

          ctors[0].apply(this, arguments);
          ctors[1].apply(this, arguments);
          ctors[2].apply(this, arguments);
        };
      } else {
        _Class5 = function _Class3() {
          this.__initProps__(_Class5);

          var ctors = _Class5.__ctors__;

          for (var i = 0; i < ctors.length; ++i) {
            ctors[i].apply(this, arguments);
          }
        };
      }
    }
  } else {
    _Class5 = function _Class4() {
      if (superCallBounded) {
        this._super = null;
      }

      this.__initProps__(_Class5);
    };
  }

  return _Class5;
};

function _validateCtor_DEV(ctor, baseClass, className, options) {
  if (CC_EDITOR && baseClass) {
    // check super call in constructor
    var originCtor = ctor;

    if (SuperCallReg.test(ctor)) {
      if (options.__ES6__) {
        cc.errorID(3651, className);
      } else {
        cc.warnID(3600, className); // suppresss super call

        ctor = function ctor() {
          this._super = function () {};

          var ret = originCtor.apply(this, arguments);
          this._super = null;
          return ret;
        };
      }
    }
  } // check ctor


  if (ctor.length > 0 && (!className || !className.startsWith('cc.'))) {
    // To make a unified CCClass serialization process,
    // we don't allow parameters for constructor when creating instances of CCClass.
    // For advanced user, construct arguments can still get from 'arguments'.
    cc.warnID(3617, className);
  }

  return ctor;
}

function _getAllCtors(baseClass, mixins, options) {
  // get base user constructors
  function getCtors(cls) {
    if (CCClass._isCCClass(cls)) {
      return cls.__ctors__ || [];
    } else {
      return [cls];
    }
  }

  var ctors = []; // if (options.__ES6__) {
  //     if (mixins) {
  //         let baseOrMixins = getCtors(baseClass);
  //         for (let b = 0; b < mixins.length; b++) {
  //             let mixin = mixins[b];
  //             if (mixin) {
  //                 let baseCtors = getCtors(mixin);
  //                 for (let c = 0; c < baseCtors.length; c++) {
  //                     if (baseOrMixins.indexOf(baseCtors[c]) < 0) {
  //                         pushUnique(ctors, baseCtors[c]);
  //                     }
  //                 }
  //             }
  //         }
  //     }
  // }
  // else {

  var baseOrMixins = [baseClass].concat(mixins);

  for (var b = 0; b < baseOrMixins.length; b++) {
    var baseOrMixin = baseOrMixins[b];

    if (baseOrMixin) {
      var baseCtors = getCtors(baseOrMixin);

      for (var c = 0; c < baseCtors.length; c++) {
        pushUnique(ctors, baseCtors[c]);
      }
    }
  } // }
  // append subclass user constructors


  var ctor = options.ctor;

  if (ctor) {
    ctors.push(ctor);
  }

  return ctors;
}

var SuperCallReg = /xyz/.test(function () {
  xyz;
}) ? /\b\._super\b/ : /.*/;
var SuperCallRegStrict = /xyz/.test(function () {
  xyz;
}) ? /this\._super\s*\(/ : /(NONE){99}/;

function boundSuperCalls(baseClass, options, className) {
  var hasSuperCall = false;

  for (var funcName in options) {
    if (BUILTIN_ENTRIES.indexOf(funcName) >= 0) {
      continue;
    }

    var func = options[funcName];

    if (typeof func !== 'function') {
      continue;
    }

    var pd = js.getPropertyDescriptor(baseClass.prototype, funcName);

    if (pd) {
      var superFunc = pd.value; // ignore pd.get, assume that function defined by getter is just for warnings

      if (typeof superFunc === 'function') {
        if (SuperCallReg.test(func)) {
          hasSuperCall = true; // boundSuperCall

          options[funcName] = function (superFunc, func) {
            return function () {
              var tmp = this._super; // Add a new ._super() method that is the same method but on the super-Class

              this._super = superFunc;
              var ret = func.apply(this, arguments); // The method only need to be bound temporarily, so we remove it when we're done executing

              this._super = tmp;
              return ret;
            };
          }(superFunc, func);
        }

        continue;
      }
    }

    if (CC_DEV && SuperCallRegStrict.test(func)) {
      cc.warnID(3620, className, funcName);
    }
  }

  return hasSuperCall;
}

function declareProperties(cls, className, properties, baseClass, mixins, es6) {
  cls.__props__ = [];

  if (baseClass && baseClass.__props__) {
    cls.__props__ = baseClass.__props__.slice();
  }

  if (mixins) {
    for (var m = 0; m < mixins.length; ++m) {
      var mixin = mixins[m];

      if (mixin.__props__) {
        cls.__props__ = cls.__props__.concat(mixin.__props__.filter(function (x) {
          return cls.__props__.indexOf(x) < 0;
        }));
      }
    }
  }

  if (properties) {
    // 预处理属性
    preprocess.preprocessAttrs(properties, className, cls, es6);

    for (var propName in properties) {
      var val = properties[propName];

      if ('default' in val) {
        defineProp(cls, className, propName, val, es6);
      } else {
        defineGetSet(cls, className, propName, val, es6);
      }
    }
  }

  var attrs = Attr.getClassAttrs(cls);
  cls.__values__ = cls.__props__.filter(function (prop) {
    return attrs[prop + DELIMETER + 'serializable'] !== false;
  });
}
/**
 * @module cc
 */

/**
 * !#en Defines a CCClass using the given specification, please see [Class](/docs/editors_and_tools/creator-chapters/scripting/class.html) for details.
 * !#zh 定义一个 CCClass，传入参数必须是一个包含类型参数的字面量对象，具体用法请查阅[类型定义](/docs/creator/scripting/class.html)。
 *
 * @method Class
 *
 * @param {Object} [options]
 * @param {String} [options.name] - The class name used for serialization.
 * @param {Function} [options.extends] - The base class.
 * @param {Function} [options.ctor] - The constructor.
 * @param {Function} [options.__ctor__] - The same as ctor, but less encapsulated.
 * @param {Object} [options.properties] - The property definitions.
 * @param {Object} [options.statics] - The static members.
 * @param {Function[]} [options.mixins]
 *
 * @param {Object} [options.editor] - attributes for Component listed below.
 * @param {Boolean} [options.editor.executeInEditMode=false] - Allows the current component to run in edit mode. By default, all components are executed only at runtime, meaning that they will not have their callback functions executed while the Editor is in edit mode.
 * @param {Function} [options.editor.requireComponent] - Automatically add required component as a dependency.
 * @param {String} [options.editor.menu] - The menu path to register a component to the editors "Component" menu. Eg. "Rendering/Camera".
 * @param {Number} [options.editor.executionOrder=0] - The execution order of lifecycle methods for Component. Those less than 0 will execute before while those greater than 0 will execute after. The order will only affect onLoad, onEnable, start, update and lateUpdate while onDisable and onDestroy will not be affected.
 * @param {Boolean} [options.editor.disallowMultiple] - If specified to a type, prevents Component of the same type (or subtype) to be added more than once to a Node.
 * @param {Boolean} [options.editor.playOnFocus=false] - This property is only available when executeInEditMode is set. If specified, the editor's scene view will keep updating this node in 60 fps when it is selected, otherwise, it will update only if necessary.
 * @param {String} [options.editor.inspector] - Customize the page url used by the current component to render in the Properties.
 * @param {String} [options.editor.icon] - Customize the icon that the current component displays in the editor.
 * @param {String} [options.editor.help] - The custom documentation URL
 *
 * @param {Function} [options.update] - lifecycle method for Component, see {{#crossLink "Component/update:method"}}{{/crossLink}}
 * @param {Function} [options.lateUpdate] - lifecycle method for Component, see {{#crossLink "Component/lateUpdate:method"}}{{/crossLink}}
 * @param {Function} [options.onLoad] - lifecycle method for Component, see {{#crossLink "Component/onLoad:method"}}{{/crossLink}}
 * @param {Function} [options.start] - lifecycle method for Component, see {{#crossLink "Component/start:method"}}{{/crossLink}}
 * @param {Function} [options.onEnable] - lifecycle method for Component, see {{#crossLink "Component/onEnable:method"}}{{/crossLink}}
 * @param {Function} [options.onDisable] - lifecycle method for Component, see {{#crossLink "Component/onDisable:method"}}{{/crossLink}}
 * @param {Function} [options.onDestroy] - lifecycle method for Component, see {{#crossLink "Component/onDestroy:method"}}{{/crossLink}}
 * @param {Function} [options.onFocusInEditor] - lifecycle method for Component, see {{#crossLink "Component/onFocusInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.onLostFocusInEditor] - lifecycle method for Component, see {{#crossLink "Component/onLostFocusInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.resetInEditor] - lifecycle method for Component, see {{#crossLink "Component/resetInEditor:method"}}{{/crossLink}}
 * @param {Function} [options.onRestore] - for Component only, see {{#crossLink "Component/onRestore:method"}}{{/crossLink}}
 * @param {Function} [options._getLocalBounds] - for Component only, see {{#crossLink "Component/_getLocalBounds:method"}}{{/crossLink}}
 *
 * @return {Function} - the created class
 *
 * @example

 // define base class
 var Node = cc.Class();

 // define sub class
 var Sprite = cc.Class({
     name: 'Sprite',
     extends: Node,

     ctor: function () {
         this.url = "";
         this.id = 0;
     },

     statics: {
         // define static members
         count: 0,
         getBounds: function (spriteList) {
             // compute bounds...
         }
     },

     properties {
         width: {
             default: 128,
             type: cc.Integer,
             tooltip: 'The width of sprite'
         },
         height: 128,
         size: {
             get: function () {
                 return cc.v2(this.width, this.height);
             }
         }
     },

     load: function () {
         // load this.url...
     };
 });

 // instantiate

 var obj = new Sprite();
 obj.url = 'sprite.png';
 obj.load();
 */


function CCClass(options) {
  options = options || {};
  var name = options.name;
  var base = options["extends"]
  /* || CCObject*/
  ;
  var mixins = options.mixins; // create constructor

  var cls = define(name, base, mixins, options);

  if (!name) {
    name = cc.js.getClassName(cls);
  }

  cls._sealed = true;

  if (base) {
    base._sealed = false;
  } // define Properties


  var properties = options.properties;

  if (typeof properties === 'function' || base && base.__props__ === null || mixins && mixins.some(function (x) {
    return x.__props__ === null;
  })) {
    if (CC_DEV && options.__ES6__) {
      cc.error('not yet implement deferred properties for ES6 Classes');
    } else {
      deferredInitializer.push({
        cls: cls,
        props: properties,
        mixins: mixins
      });
      cls.__props__ = cls.__values__ = null;
    }
  } else {
    declareProperties(cls, name, properties, base, options.mixins, options.__ES6__);
  } // define statics


  var statics = options.statics;

  if (statics) {
    var staticPropName;

    if (CC_DEV) {
      for (staticPropName in statics) {
        if (INVALID_STATICS_DEV.indexOf(staticPropName) !== -1) {
          cc.errorID(3642, name, staticPropName, staticPropName);
        }
      }
    }

    for (staticPropName in statics) {
      cls[staticPropName] = statics[staticPropName];
    }
  } // define functions


  for (var funcName in options) {
    if (BUILTIN_ENTRIES.indexOf(funcName) >= 0) {
      continue;
    }

    var func = options[funcName];

    if (!preprocess.validateMethodWithProps(func, funcName, name, cls, base)) {
      continue;
    } // use value to redefine some super method defined as getter


    js.value(cls.prototype, funcName, func, true, true);
  }

  var editor = options.editor;

  if (editor) {
    if (js.isChildClassOf(base, cc.Component)) {
      cc.Component._registerEditorProps(cls, editor);
    } else if (CC_DEV) {
      cc.warnID(3623, name);
    }
  }

  return cls;
}
/**
 * Checks whether the constructor is created by cc.Class
 *
 * @method _isCCClass
 * @param {Function} constructor
 * @return {Boolean}
 * @private
 */


CCClass._isCCClass = function (constructor) {
  return constructor && constructor.hasOwnProperty('__ctors__'); // is not inherited __ctors__
}; //
// Optimized define function only for internal classes
//
// @method _fastDefine
// @param {String} className
// @param {Function} constructor
// @param {Object} serializableFields
// @private
//


CCClass._fastDefine = function (className, constructor, serializableFields) {
  js.setClassName(className, constructor); //constructor.__ctors__ = constructor.__ctors__ || null;

  var props = constructor.__props__ = constructor.__values__ = Object.keys(serializableFields);
  var attrs = Attr.getClassAttrs(constructor);

  for (var i = 0; i < props.length; i++) {
    var key = props[i];
    attrs[key + DELIMETER + 'visible'] = false;
    attrs[key + DELIMETER + 'default'] = serializableFields[key];
  }
};

CCClass.Attr = Attr;
CCClass.attr = Attr.attr;
/*
 * Return all super classes
 * @method getInheritanceChain
 * @param {Function} constructor
 * @return {Function[]}
 */

CCClass.getInheritanceChain = function (klass) {
  var chain = [];

  for (;;) {
    klass = js.getSuper(klass);

    if (!klass) {
      break;
    }

    if (klass !== Object) {
      chain.push(klass);
    }
  }

  return chain;
};

var PrimitiveTypes = {
  // Specify that the input value must be integer in Properties.
  // Also used to indicates that the type of elements in array or the type of value in dictionary is integer.
  Integer: 'Number',
  // Indicates that the type of elements in array or the type of value in dictionary is double.
  Float: 'Number',
  Boolean: 'Boolean',
  String: 'String'
};
var onAfterProps_ET = [];

function parseAttributes(cls, attributes, className, propName, usedInGetter) {
  var ERR_Type = CC_DEV ? 'The %s of %s must be type %s' : '';
  var attrs = null;
  var propNamePrefix = '';

  function initAttrs() {
    propNamePrefix = propName + DELIMETER;
    return attrs = Attr.getClassAttrs(cls);
  }

  if (CC_EDITOR && !Editor.isBuilder || CC_TEST) {
    onAfterProps_ET.length = 0;
  }

  var type = attributes.type;

  if (type) {
    var primitiveType = PrimitiveTypes[type];

    if (primitiveType) {
      (attrs || initAttrs())[propNamePrefix + 'type'] = type;

      if ((CC_EDITOR && !Editor.isBuilder || CC_TEST) && !attributes._short) {
        onAfterProps_ET.push(Attr.getTypeChecker_ET(primitiveType, 'cc.' + type));
      }
    } else if (type === 'Object') {
      if (CC_DEV) {
        cc.errorID(3644, className, propName);
      }
    } else {
      if (type === Attr.ScriptUuid) {
        (attrs || initAttrs())[propNamePrefix + 'type'] = 'Script';
        attrs[propNamePrefix + 'ctor'] = cc.ScriptAsset;
      } else {
        if (typeof type === 'object') {
          if (Enum.isEnum(type)) {
            (attrs || initAttrs())[propNamePrefix + 'type'] = 'Enum';
            attrs[propNamePrefix + 'enumList'] = Enum.getList(type);
          } else if (CC_DEV) {
            cc.errorID(3645, className, propName, type);
          }
        } else if (typeof type === 'function') {
          (attrs || initAttrs())[propNamePrefix + 'type'] = 'Object';
          attrs[propNamePrefix + 'ctor'] = type;

          if ((CC_EDITOR && !Editor.isBuilder || CC_TEST) && !attributes._short) {
            onAfterProps_ET.push(attributes.url ? Attr.getTypeChecker_ET('String', 'cc.String') : Attr.getObjTypeChecker_ET(type));
          }
        } else if (CC_DEV) {
          cc.errorID(3646, className, propName, type);
        }
      }
    }
  }

  function parseSimpleAttr(attrName, expectType) {
    if (attrName in attributes) {
      var val = attributes[attrName];

      if (typeof val === expectType) {
        (attrs || initAttrs())[propNamePrefix + attrName] = val;
      } else if (CC_DEV) {
        cc.error(ERR_Type, attrName, className, propName, expectType);
      }
    }
  }

  if (attributes.editorOnly) {
    if (CC_DEV && usedInGetter) {
      cc.errorID(3613, "editorOnly", name, propName);
    } else {
      (attrs || initAttrs())[propNamePrefix + 'editorOnly'] = true;
    }
  } //parseSimpleAttr('preventDeferredLoad', 'boolean');


  if (CC_DEV) {
    parseSimpleAttr('displayName', 'string');
    parseSimpleAttr('multiline', 'boolean');

    if (attributes.readonly) {
      (attrs || initAttrs())[propNamePrefix + 'readonly'] = true;
    }

    parseSimpleAttr('tooltip', 'string');
    parseSimpleAttr('slide', 'boolean');
  }

  if (attributes.url) {
    (attrs || initAttrs())[propNamePrefix + 'saveUrlAsAsset'] = true;
  }

  if (attributes.serializable === false) {
    if (CC_DEV && usedInGetter) {
      cc.errorID(3613, "serializable", name, propName);
    } else {
      (attrs || initAttrs())[propNamePrefix + 'serializable'] = false;
    }
  }

  parseSimpleAttr('formerlySerializedAs', 'string');

  if (CC_EDITOR) {
    parseSimpleAttr('notifyFor', 'string');

    if ('animatable' in attributes) {
      (attrs || initAttrs())[propNamePrefix + 'animatable'] = !!attributes.animatable;
    }
  }

  if (CC_DEV) {
    var visible = attributes.visible;

    if (typeof visible !== 'undefined') {
      if (!visible) {
        (attrs || initAttrs())[propNamePrefix + 'visible'] = false;
      } else if (typeof visible === 'function') {
        (attrs || initAttrs())[propNamePrefix + 'visible'] = visible;
      }
    } else {
      var startsWithUS = propName.charCodeAt(0) === 95;

      if (startsWithUS) {
        (attrs || initAttrs())[propNamePrefix + 'visible'] = false;
      }
    }
  }

  var range = attributes.range;

  if (range) {
    if (Array.isArray(range)) {
      if (range.length >= 2) {
        (attrs || initAttrs())[propNamePrefix + 'min'] = range[0];
        attrs[propNamePrefix + 'max'] = range[1];

        if (range.length > 2) {
          attrs[propNamePrefix + 'step'] = range[2];
        }
      } else if (CC_DEV) {
        cc.errorID(3647);
      }
    } else if (CC_DEV) {
      cc.error(ERR_Type, 'range', className, propName, 'array');
    }
  }

  parseSimpleAttr('min', 'number');
  parseSimpleAttr('max', 'number');
  parseSimpleAttr('step', 'number');
}

cc.Class = CCClass;
module.exports = {
  isArray: function isArray(defaultVal) {
    defaultVal = getDefault(defaultVal);
    return Array.isArray(defaultVal);
  },
  fastDefine: CCClass._fastDefine,
  getNewValueTypeCode: CC_SUPPORT_JIT && getNewValueTypeCodeJit,
  IDENTIFIER_RE: IDENTIFIER_RE,
  escapeForJS: escapeForJS,
  getDefault: getDefault
};

if (CC_TEST) {
  js.mixin(CCClass, module.exports);
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQ2xhc3MuanMiXSwibmFtZXMiOlsianMiLCJyZXF1aXJlIiwiRW51bSIsInV0aWxzIiwiX2lzUGxhaW5FbXB0eU9ial9ERVYiLCJpc1BsYWluRW1wdHlPYmpfREVWIiwiX2Nsb25lYWJsZV9ERVYiLCJjbG9uZWFibGVfREVWIiwiQXR0ciIsIkRFTElNRVRFUiIsInByZXByb2Nlc3MiLCJCVUlMVElOX0VOVFJJRVMiLCJJTlZBTElEX1NUQVRJQ1NfREVWIiwiQ0NfREVWIiwicHVzaFVuaXF1ZSIsImFycmF5IiwiaXRlbSIsImluZGV4T2YiLCJwdXNoIiwiZGVmZXJyZWRJbml0aWFsaXplciIsImRhdGFzIiwiZGF0YSIsInNlbGYiLCJzZXRUaW1lb3V0IiwiaW5pdCIsImkiLCJsZW5ndGgiLCJjbHMiLCJwcm9wZXJ0aWVzIiwicHJvcHMiLCJuYW1lIiwiZ2V0Q2xhc3NOYW1lIiwiZGVjbGFyZVByb3BlcnRpZXMiLCIkc3VwZXIiLCJtaXhpbnMiLCJjYyIsImVycm9ySUQiLCJhcHBlbmRQcm9wIiwiX19wcm9wc19fIiwiZGVmaW5lUHJvcCIsImNsYXNzTmFtZSIsInByb3BOYW1lIiwidmFsIiwiZXM2IiwiZGVmYXVsdFZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwiQ0NDbGFzcyIsImdldEluaGVyaXRhbmNlQ2hhaW4iLCJzb21lIiwieCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5Iiwic2V0Q2xhc3NBdHRyIiwicGFyc2VBdHRyaWJ1dGVzIiwiQ0NfRURJVE9SIiwiRWRpdG9yIiwiaXNCdWlsZGVyIiwiQ0NfVEVTVCIsIm9uQWZ0ZXJQcm9wc19FVCIsImRlZmluZUdldFNldCIsImdldHRlciIsImdldCIsInNldHRlciIsInNldCIsInByb3RvIiwiZCIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsInNldHRlclVuZGVmaW5lZCIsImdldERlZmF1bHQiLCJkZWZhdWx0VmFsIiwiZSIsIl90aHJvdyIsInVuZGVmaW5lZCIsIm1peGluV2l0aEluaGVyaXRlZCIsImRlc3QiLCJzcmMiLCJmaWx0ZXIiLCJwcm9wIiwiZGVmaW5lUHJvcGVydHkiLCJnZXRQcm9wZXJ0eURlc2NyaXB0b3IiLCJkb0RlZmluZSIsImJhc2VDbGFzcyIsIm9wdGlvbnMiLCJzaG91bGRBZGRQcm90b0N0b3IiLCJfX2N0b3JfXyIsImN0b3IiLCJfX2VzNl9fIiwiX19FUzZfXyIsImN0b3JUb1VzZSIsIl9pc0NDQ2xhc3MiLCJ0ZXN0Iiwid2FybklEIiwiX3ZhbGlkYXRlQ3Rvcl9ERVYiLCJjdG9ycyIsImZpcmVDbGFzcyIsIl9nZXRBbGxDdG9ycyIsIl9jcmVhdGVDdG9yIiwidmFsdWUiLCJleHRlbmQiLCJtIiwibWl4aW4iLCJnZXRDbGFzc0F0dHJzIiwiY29uc3RydWN0b3IiLCJfX2luaXRQcm9wc19fIiwiY29tcGlsZVByb3BzIiwic2V0Q2xhc3NOYW1lIiwiZGVmaW5lIiwiQ29tcG9uZW50IiwiZnJhbWUiLCJfUkYiLCJwZWVrIiwiaXNDaGlsZENsYXNzT2YiLCJ1dWlkIiwic2NyaXB0IiwiX3NldENsYXNzSWQiLCJfYWRkTWVudUl0ZW0iLCJfX3NjcmlwdFV1aWQiLCJVdGlscyIsIlV1aWRVdGlscyIsImRlY29tcHJlc3NVdWlkIiwibm9ybWFsaXplQ2xhc3NOYW1lX0RFViIsIkRlZmF1bHROYW1lIiwicmVwbGFjZSIsIkZ1bmN0aW9uIiwiZ2V0TmV3VmFsdWVUeXBlQ29kZUppdCIsImNsc05hbWUiLCJ0eXBlIiwicmVzIiwicHJvcFZhbCIsImVzY2FwZUZvckpTIiwicyIsIkpTT04iLCJzdHJpbmdpZnkiLCJnZXRJbml0UHJvcHNKaXQiLCJhdHRycyIsInByb3BMaXN0IiwiRiIsImZ1bmMiLCJhdHRyS2V5Iiwic3RhdGVtZW50IiwiSURFTlRJRklFUl9SRSIsImV4cHJlc3Npb24iLCJkZWYiLCJWYWx1ZVR5cGUiLCJpbmRleCIsImluaXRQcm9wcyIsImdldEluaXRQcm9wcyIsImFkdmFuY2VkUHJvcHMiLCJhZHZhbmNlZFZhbHVlcyIsInNpbXBsZVByb3BzIiwic2ltcGxlVmFsdWVzIiwiY2xvbmUiLCJlcnIiLCJhY3R1YWxDbGFzcyIsIkNDX1NVUFBPUlRfSklUIiwiY2FsbCIsInN1cGVyQ2FsbEJvdW5kZWQiLCJib3VuZFN1cGVyQ2FsbHMiLCJjdG9yTmFtZSIsImJvZHkiLCJjdG9yTGVuIiwidXNlVHJ5Q2F0Y2giLCJzdGFydHNXaXRoIiwiU05JUFBFVCIsIkNsYXNzIiwiX3N1cGVyIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJfX2N0b3JzX18iLCJvcmlnaW5DdG9yIiwiU3VwZXJDYWxsUmVnIiwicmV0IiwiZ2V0Q3RvcnMiLCJiYXNlT3JNaXhpbnMiLCJjb25jYXQiLCJiIiwiYmFzZU9yTWl4aW4iLCJiYXNlQ3RvcnMiLCJjIiwieHl6IiwiU3VwZXJDYWxsUmVnU3RyaWN0IiwiaGFzU3VwZXJDYWxsIiwiZnVuY05hbWUiLCJwZCIsInN1cGVyRnVuYyIsInRtcCIsInNsaWNlIiwicHJlcHJvY2Vzc0F0dHJzIiwiX192YWx1ZXNfXyIsImJhc2UiLCJfc2VhbGVkIiwiZXJyb3IiLCJzdGF0aWNzIiwic3RhdGljUHJvcE5hbWUiLCJ2YWxpZGF0ZU1ldGhvZFdpdGhQcm9wcyIsImVkaXRvciIsIl9yZWdpc3RlckVkaXRvclByb3BzIiwiX2Zhc3REZWZpbmUiLCJzZXJpYWxpemFibGVGaWVsZHMiLCJrZXlzIiwia2V5IiwiYXR0ciIsImtsYXNzIiwiY2hhaW4iLCJnZXRTdXBlciIsIlByaW1pdGl2ZVR5cGVzIiwiSW50ZWdlciIsIkZsb2F0IiwiQm9vbGVhbiIsIlN0cmluZyIsImF0dHJpYnV0ZXMiLCJ1c2VkSW5HZXR0ZXIiLCJFUlJfVHlwZSIsInByb3BOYW1lUHJlZml4IiwiaW5pdEF0dHJzIiwicHJpbWl0aXZlVHlwZSIsIl9zaG9ydCIsImdldFR5cGVDaGVja2VyX0VUIiwiU2NyaXB0VXVpZCIsIlNjcmlwdEFzc2V0IiwiaXNFbnVtIiwiZ2V0TGlzdCIsInVybCIsImdldE9ialR5cGVDaGVja2VyX0VUIiwicGFyc2VTaW1wbGVBdHRyIiwiYXR0ck5hbWUiLCJleHBlY3RUeXBlIiwiZWRpdG9yT25seSIsInJlYWRvbmx5Iiwic2VyaWFsaXphYmxlIiwiYW5pbWF0YWJsZSIsInZpc2libGUiLCJzdGFydHNXaXRoVVMiLCJjaGFyQ29kZUF0IiwicmFuZ2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZmFzdERlZmluZSIsImdldE5ld1ZhbHVlVHlwZUNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJELElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLE1BQUQsQ0FBaEI7O0FBQ0EsSUFBSUMsSUFBSSxHQUFHRCxPQUFPLENBQUMsVUFBRCxDQUFsQjs7QUFDQSxJQUFJRSxLQUFLLEdBQUdGLE9BQU8sQ0FBQyxTQUFELENBQW5COztBQUNBLElBQUlHLG9CQUFvQixHQUFHRCxLQUFLLENBQUNFLG1CQUFqQztBQUNBLElBQUlDLGNBQWMsR0FBR0gsS0FBSyxDQUFDSSxhQUEzQjs7QUFDQSxJQUFJQyxJQUFJLEdBQUdQLE9BQU8sQ0FBQyxhQUFELENBQWxCOztBQUNBLElBQUlRLFNBQVMsR0FBR0QsSUFBSSxDQUFDQyxTQUFyQjs7QUFDQSxJQUFJQyxVQUFVLEdBQUdULE9BQU8sQ0FBQyxvQkFBRCxDQUF4Qjs7QUFDQUEsT0FBTyxDQUFDLG1CQUFELENBQVA7O0FBRUEsSUFBSVUsZUFBZSxHQUFHLENBQUMsTUFBRCxFQUFTLFNBQVQsRUFBb0IsUUFBcEIsRUFBOEIsTUFBOUIsRUFBc0MsVUFBdEMsRUFBa0QsWUFBbEQsRUFBZ0UsU0FBaEUsRUFBMkUsUUFBM0UsRUFBcUYsU0FBckYsQ0FBdEI7QUFFQSxJQUFJQyxtQkFBbUIsR0FBR0MsTUFBTSxJQUFJLENBQUMsTUFBRCxFQUFTLFdBQVQsRUFBc0IsV0FBdEIsRUFBbUMsV0FBbkMsRUFBZ0QsTUFBaEQsRUFBd0QsT0FBeEQsRUFBaUUsUUFBakUsRUFDYixRQURhLEVBQ0gsV0FERyxDQUFwQzs7QUFHQSxTQUFTQyxVQUFULENBQXFCQyxLQUFyQixFQUE0QkMsSUFBNUIsRUFBa0M7QUFDOUIsTUFBSUQsS0FBSyxDQUFDRSxPQUFOLENBQWNELElBQWQsSUFBc0IsQ0FBMUIsRUFBNkI7QUFDekJELElBQUFBLEtBQUssQ0FBQ0csSUFBTixDQUFXRixJQUFYO0FBQ0g7QUFDSjs7QUFFRCxJQUFJRyxtQkFBbUIsR0FBRztBQUV0QjtBQUNBQyxFQUFBQSxLQUFLLEVBQUUsSUFIZTtBQUt0QjtBQUNBO0FBQ0FGLEVBQUFBLElBQUksRUFBRSxjQUFVRyxJQUFWLEVBQWdCO0FBQ2xCLFFBQUksS0FBS0QsS0FBVCxFQUFnQjtBQUNaLFdBQUtBLEtBQUwsQ0FBV0YsSUFBWCxDQUFnQkcsSUFBaEI7QUFDSCxLQUZELE1BR0s7QUFDRCxXQUFLRCxLQUFMLEdBQWEsQ0FBQ0MsSUFBRCxDQUFiLENBREMsQ0FFRDs7QUFDQSxVQUFJQyxJQUFJLEdBQUcsSUFBWDtBQUNBQyxNQUFBQSxVQUFVLENBQUMsWUFBWTtBQUNuQkQsUUFBQUEsSUFBSSxDQUFDRSxJQUFMO0FBQ0gsT0FGUyxFQUVQLENBRk8sQ0FBVjtBQUdIO0FBQ0osR0FuQnFCO0FBcUJ0QkEsRUFBQUEsSUFBSSxFQUFFLGdCQUFZO0FBQ2QsUUFBSUosS0FBSyxHQUFHLEtBQUtBLEtBQWpCOztBQUNBLFFBQUlBLEtBQUosRUFBVztBQUNQLFdBQUssSUFBSUssQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0wsS0FBSyxDQUFDTSxNQUExQixFQUFrQyxFQUFFRCxDQUFwQyxFQUF1QztBQUNuQyxZQUFJSixJQUFJLEdBQUdELEtBQUssQ0FBQ0ssQ0FBRCxDQUFoQjtBQUNBLFlBQUlFLEdBQUcsR0FBR04sSUFBSSxDQUFDTSxHQUFmO0FBQ0EsWUFBSUMsVUFBVSxHQUFHUCxJQUFJLENBQUNRLEtBQXRCOztBQUNBLFlBQUksT0FBT0QsVUFBUCxLQUFzQixVQUExQixFQUFzQztBQUNsQ0EsVUFBQUEsVUFBVSxHQUFHQSxVQUFVLEVBQXZCO0FBQ0g7O0FBQ0QsWUFBSUUsSUFBSSxHQUFHOUIsRUFBRSxDQUFDK0IsWUFBSCxDQUFnQkosR0FBaEIsQ0FBWDs7QUFDQSxZQUFJQyxVQUFKLEVBQWdCO0FBQ1pJLFVBQUFBLGlCQUFpQixDQUFDTCxHQUFELEVBQU1HLElBQU4sRUFBWUYsVUFBWixFQUF3QkQsR0FBRyxDQUFDTSxNQUE1QixFQUFvQ1osSUFBSSxDQUFDYSxNQUF6QyxDQUFqQjtBQUNILFNBRkQsTUFHSztBQUNEQyxVQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCTixJQUFqQjtBQUNIO0FBQ0o7O0FBQ0QsV0FBS1YsS0FBTCxHQUFhLElBQWI7QUFDSDtBQUNKO0FBekNxQixDQUExQixFQTRDQTs7QUFDQSxTQUFTaUIsVUFBVCxDQUFxQlYsR0FBckIsRUFBMEJHLElBQTFCLEVBQWdDO0FBQzVCLE1BQUlqQixNQUFKLEVBQVk7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQUlpQixJQUFJLENBQUNiLE9BQUwsQ0FBYSxHQUFiLE1BQXNCLENBQUMsQ0FBM0IsRUFBOEI7QUFDMUJrQixNQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYO0FBQ0E7QUFDSDtBQUNKOztBQUNEdEIsRUFBQUEsVUFBVSxDQUFDYSxHQUFHLENBQUNXLFNBQUwsRUFBZ0JSLElBQWhCLENBQVY7QUFDSDs7QUFFRCxTQUFTUyxVQUFULENBQXFCWixHQUFyQixFQUEwQmEsU0FBMUIsRUFBcUNDLFFBQXJDLEVBQStDQyxHQUEvQyxFQUFvREMsR0FBcEQsRUFBeUQ7QUFDckQsTUFBSUMsWUFBWSxHQUFHRixHQUFHLFdBQXRCOztBQUVBLE1BQUk3QixNQUFKLEVBQVk7QUFDUixRQUFJLENBQUM4QixHQUFMLEVBQVU7QUFDTjtBQUNBLFVBQUksT0FBT0MsWUFBUCxLQUF3QixRQUF4QixJQUFvQ0EsWUFBeEMsRUFBc0Q7QUFDbEQsWUFBSUMsS0FBSyxDQUFDQyxPQUFOLENBQWNGLFlBQWQsQ0FBSixFQUFpQztBQUM3QjtBQUNBLGNBQUlBLFlBQVksQ0FBQ2xCLE1BQWIsR0FBc0IsQ0FBMUIsRUFBNkI7QUFDekJTLFlBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUJJLFNBQWpCLEVBQTRCQyxRQUE1QixFQUFzQ0EsUUFBdEM7QUFDQTtBQUNIO0FBQ0osU0FORCxNQU9LLElBQUksQ0FBQ3JDLG9CQUFvQixDQUFDd0MsWUFBRCxDQUF6QixFQUF5QztBQUMxQztBQUNBLGNBQUksQ0FBQ3RDLGNBQWMsQ0FBQ3NDLFlBQUQsQ0FBbkIsRUFBbUM7QUFDL0JULFlBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUJJLFNBQWpCLEVBQTRCQyxRQUE1QixFQUFzQ0EsUUFBdEM7QUFDQTtBQUNIO0FBQ0o7QUFDSjtBQUNKLEtBbkJPLENBcUJSOzs7QUFDQSxRQUFJTSxPQUFPLENBQUNDLG1CQUFSLENBQTRCckIsR0FBNUIsRUFDUXNCLElBRFIsQ0FDYSxVQUFVQyxDQUFWLEVBQWE7QUFBRSxhQUFPQSxDQUFDLENBQUNDLFNBQUYsQ0FBWUMsY0FBWixDQUEyQlgsUUFBM0IsQ0FBUDtBQUE4QyxLQUQxRSxDQUFKLEVBRUE7QUFDSU4sTUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWCxFQUFpQkksU0FBakIsRUFBNEJDLFFBQTVCLEVBQXNDRCxTQUF0QztBQUNBO0FBQ0g7QUFDSixHQS9Cb0QsQ0FpQ3JEOzs7QUFDQWhDLEVBQUFBLElBQUksQ0FBQzZDLFlBQUwsQ0FBa0IxQixHQUFsQixFQUF1QmMsUUFBdkIsRUFBaUMsU0FBakMsRUFBNENHLFlBQTVDO0FBRUFQLEVBQUFBLFVBQVUsQ0FBQ1YsR0FBRCxFQUFNYyxRQUFOLENBQVYsQ0FwQ3FELENBc0NyRDs7QUFDQWEsRUFBQUEsZUFBZSxDQUFDM0IsR0FBRCxFQUFNZSxHQUFOLEVBQVdGLFNBQVgsRUFBc0JDLFFBQXRCLEVBQWdDLEtBQWhDLENBQWY7O0FBQ0EsTUFBS2MsU0FBUyxJQUFJLENBQUNDLE1BQU0sQ0FBQ0MsU0FBdEIsSUFBb0NDLE9BQXhDLEVBQWlEO0FBQzdDLFNBQUssSUFBSWpDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdrQyxlQUFlLENBQUNqQyxNQUFwQyxFQUE0Q0QsQ0FBQyxFQUE3QyxFQUFpRDtBQUM3Q2tDLE1BQUFBLGVBQWUsQ0FBQ2xDLENBQUQsQ0FBZixDQUFtQkUsR0FBbkIsRUFBd0JjLFFBQXhCO0FBQ0g7O0FBQ0RrQixJQUFBQSxlQUFlLENBQUNqQyxNQUFoQixHQUF5QixDQUF6QjtBQUNIO0FBQ0o7O0FBRUQsU0FBU2tDLFlBQVQsQ0FBdUJqQyxHQUF2QixFQUE0QkcsSUFBNUIsRUFBa0NXLFFBQWxDLEVBQTRDQyxHQUE1QyxFQUFpREMsR0FBakQsRUFBc0Q7QUFDbEQsTUFBSWtCLE1BQU0sR0FBR25CLEdBQUcsQ0FBQ29CLEdBQWpCO0FBQ0EsTUFBSUMsTUFBTSxHQUFHckIsR0FBRyxDQUFDc0IsR0FBakI7QUFDQSxNQUFJQyxLQUFLLEdBQUd0QyxHQUFHLENBQUN3QixTQUFoQjtBQUNBLE1BQUllLENBQUMsR0FBR0MsTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ0gsS0FBaEMsRUFBdUN4QixRQUF2QyxDQUFSO0FBQ0EsTUFBSTRCLGVBQWUsR0FBRyxDQUFDSCxDQUF2Qjs7QUFFQSxNQUFJTCxNQUFKLEVBQVk7QUFDUixRQUFJaEQsTUFBTSxJQUFJLENBQUM4QixHQUFYLElBQWtCdUIsQ0FBbEIsSUFBdUJBLENBQUMsQ0FBQ0osR0FBN0IsRUFBa0M7QUFDOUIzQixNQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCTixJQUFqQixFQUF1QlcsUUFBdkI7QUFDQTtBQUNIOztBQUVEYSxJQUFBQSxlQUFlLENBQUMzQixHQUFELEVBQU1lLEdBQU4sRUFBV1osSUFBWCxFQUFpQlcsUUFBakIsRUFBMkIsSUFBM0IsQ0FBZjs7QUFDQSxRQUFLYyxTQUFTLElBQUksQ0FBQ0MsTUFBTSxDQUFDQyxTQUF0QixJQUFvQ0MsT0FBeEMsRUFBaUQ7QUFDN0NDLE1BQUFBLGVBQWUsQ0FBQ2pDLE1BQWhCLEdBQXlCLENBQXpCO0FBQ0g7O0FBRURsQixJQUFBQSxJQUFJLENBQUM2QyxZQUFMLENBQWtCMUIsR0FBbEIsRUFBdUJjLFFBQXZCLEVBQWlDLGNBQWpDLEVBQWlELEtBQWpEOztBQUVBLFFBQUk1QixNQUFKLEVBQVk7QUFDUjtBQUNBd0IsTUFBQUEsVUFBVSxDQUFDVixHQUFELEVBQU1jLFFBQU4sQ0FBVjtBQUNIOztBQUVELFFBQUksQ0FBQ0UsR0FBTCxFQUFVO0FBQ04zQyxNQUFBQSxFQUFFLENBQUM4RCxHQUFILENBQU9HLEtBQVAsRUFBY3hCLFFBQWQsRUFBd0JvQixNQUF4QixFQUFnQ1EsZUFBaEMsRUFBaURBLGVBQWpEO0FBQ0g7O0FBRUQsUUFBSWQsU0FBUyxJQUFJMUMsTUFBakIsRUFBeUI7QUFDckJMLE1BQUFBLElBQUksQ0FBQzZDLFlBQUwsQ0FBa0IxQixHQUFsQixFQUF1QmMsUUFBdkIsRUFBaUMsV0FBakMsRUFBOEMsSUFBOUMsRUFEcUIsQ0FDZ0M7QUFDeEQ7QUFDSjs7QUFFRCxNQUFJc0IsTUFBSixFQUFZO0FBQ1IsUUFBSSxDQUFDcEIsR0FBTCxFQUFVO0FBQ04sVUFBSTlCLE1BQU0sSUFBSXFELENBQVYsSUFBZUEsQ0FBQyxDQUFDRixHQUFyQixFQUEwQjtBQUN0QixlQUFPN0IsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWCxFQUFpQk4sSUFBakIsRUFBdUJXLFFBQXZCLENBQVA7QUFDSDs7QUFDRHpDLE1BQUFBLEVBQUUsQ0FBQ2dFLEdBQUgsQ0FBT0MsS0FBUCxFQUFjeEIsUUFBZCxFQUF3QnNCLE1BQXhCLEVBQWdDTSxlQUFoQyxFQUFpREEsZUFBakQ7QUFDSDs7QUFDRCxRQUFJZCxTQUFTLElBQUkxQyxNQUFqQixFQUF5QjtBQUNyQkwsTUFBQUEsSUFBSSxDQUFDNkMsWUFBTCxDQUFrQjFCLEdBQWxCLEVBQXVCYyxRQUF2QixFQUFpQyxXQUFqQyxFQUE4QyxJQUE5QyxFQURxQixDQUNnQztBQUN4RDtBQUNKO0FBQ0o7O0FBRUQsU0FBUzZCLFVBQVQsQ0FBcUJDLFVBQXJCLEVBQWlDO0FBQzdCLE1BQUksT0FBT0EsVUFBUCxLQUFzQixVQUExQixFQUFzQztBQUNsQyxRQUFJaEIsU0FBSixFQUFlO0FBQ1gsVUFBSTtBQUNBLGVBQU9nQixVQUFVLEVBQWpCO0FBQ0gsT0FGRCxDQUdBLE9BQU9DLENBQVAsRUFBVTtBQUNOckMsUUFBQUEsRUFBRSxDQUFDc0MsTUFBSCxDQUFVRCxDQUFWOztBQUNBLGVBQU9FLFNBQVA7QUFDSDtBQUNKLEtBUkQsTUFTSztBQUNELGFBQU9ILFVBQVUsRUFBakI7QUFDSDtBQUNKOztBQUNELFNBQU9BLFVBQVA7QUFDSDs7QUFFRCxTQUFTSSxrQkFBVCxDQUE2QkMsSUFBN0IsRUFBbUNDLEdBQW5DLEVBQXdDQyxNQUF4QyxFQUFnRDtBQUM1QyxPQUFLLElBQUlDLElBQVQsSUFBaUJGLEdBQWpCLEVBQXNCO0FBQ2xCLFFBQUksQ0FBQ0QsSUFBSSxDQUFDeEIsY0FBTCxDQUFvQjJCLElBQXBCLENBQUQsS0FBK0IsQ0FBQ0QsTUFBRCxJQUFXQSxNQUFNLENBQUNDLElBQUQsQ0FBaEQsQ0FBSixFQUE2RDtBQUN6RFosTUFBQUEsTUFBTSxDQUFDYSxjQUFQLENBQXNCSixJQUF0QixFQUE0QkcsSUFBNUIsRUFBa0MvRSxFQUFFLENBQUNpRixxQkFBSCxDQUF5QkosR0FBekIsRUFBOEJFLElBQTlCLENBQWxDO0FBQ0g7QUFDSjtBQUNKOztBQUVELFNBQVNHLFFBQVQsQ0FBbUIxQyxTQUFuQixFQUE4QjJDLFNBQTlCLEVBQXlDakQsTUFBekMsRUFBaURrRCxPQUFqRCxFQUEwRDtBQUN0RCxNQUFJQyxrQkFBSjtBQUNBLE1BQUlDLFFBQVEsR0FBR0YsT0FBTyxDQUFDRSxRQUF2QjtBQUNBLE1BQUlDLElBQUksR0FBR0gsT0FBTyxDQUFDRyxJQUFuQjtBQUNBLE1BQUlDLE9BQU8sR0FBR0osT0FBTyxDQUFDSyxPQUF0Qjs7QUFFQSxNQUFJNUUsTUFBSixFQUFZO0FBQ1I7QUFDQSxRQUFJNkUsU0FBUyxHQUFHSixRQUFRLElBQUlDLElBQTVCOztBQUNBLFFBQUlHLFNBQUosRUFBZTtBQUNYLFVBQUkzQyxPQUFPLENBQUM0QyxVQUFSLENBQW1CRCxTQUFuQixDQUFKLEVBQW1DO0FBQy9CdkQsUUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWCxFQUFpQkksU0FBakI7QUFDSCxPQUZELE1BR0ssSUFBSSxPQUFPa0QsU0FBUCxLQUFxQixVQUF6QixFQUFxQztBQUN0Q3ZELFFBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUJJLFNBQWpCO0FBQ0gsT0FGSSxNQUdBO0FBQ0QsWUFBSTJDLFNBQVMsSUFBSSxxQkFBcUJTLElBQXJCLENBQTBCRixTQUExQixDQUFqQixFQUF1RDtBQUNuRCxjQUFJRixPQUFKLEVBQWE7QUFDVHJELFlBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUJJLFNBQVMsSUFBSSxFQUE5QjtBQUNILFdBRkQsTUFHSztBQUNETCxZQUFBQSxFQUFFLENBQUMwRCxNQUFILENBQVUsSUFBVixFQUFnQnJELFNBQVMsSUFBSSxFQUE3QjtBQUNBNkMsWUFBQUEsa0JBQWtCLEdBQUcsSUFBckI7QUFDSDtBQUNKO0FBQ0o7O0FBQ0QsVUFBSUUsSUFBSixFQUFVO0FBQ04sWUFBSUQsUUFBSixFQUFjO0FBQ1ZuRCxVQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCSSxTQUFqQjtBQUNILFNBRkQsTUFHSztBQUNEK0MsVUFBQUEsSUFBSSxHQUFHSCxPQUFPLENBQUNHLElBQVIsR0FBZU8saUJBQWlCLENBQUNQLElBQUQsRUFBT0osU0FBUCxFQUFrQjNDLFNBQWxCLEVBQTZCNEMsT0FBN0IsQ0FBdkM7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFFRCxNQUFJVyxLQUFKO0FBQ0EsTUFBSUMsU0FBSjs7QUFDQSxNQUFJUixPQUFKLEVBQWE7QUFDVE8sSUFBQUEsS0FBSyxHQUFHLENBQUNSLElBQUQsQ0FBUjtBQUNBUyxJQUFBQSxTQUFTLEdBQUdULElBQVo7QUFDSCxHQUhELE1BSUs7QUFDRFEsSUFBQUEsS0FBSyxHQUFHVCxRQUFRLEdBQUcsQ0FBQ0EsUUFBRCxDQUFILEdBQWdCVyxZQUFZLENBQUNkLFNBQUQsRUFBWWpELE1BQVosRUFBb0JrRCxPQUFwQixDQUE1QztBQUNBWSxJQUFBQSxTQUFTLEdBQUdFLFdBQVcsQ0FBQ0gsS0FBRCxFQUFRWixTQUFSLEVBQW1CM0MsU0FBbkIsRUFBOEI0QyxPQUE5QixDQUF2QixDQUZDLENBSUQ7O0FBQ0FwRixJQUFBQSxFQUFFLENBQUNtRyxLQUFILENBQVNILFNBQVQsRUFBb0IsUUFBcEIsRUFBOEIsVUFBVVosT0FBVixFQUFtQjtBQUM3Q0EsTUFBQUEsT0FBTyxXQUFQLEdBQWtCLElBQWxCO0FBQ0EsYUFBT3JDLE9BQU8sQ0FBQ3FDLE9BQUQsQ0FBZDtBQUNILEtBSEQsRUFHRyxJQUhIO0FBSUg7O0FBRURwRixFQUFBQSxFQUFFLENBQUNtRyxLQUFILENBQVNILFNBQVQsRUFBb0IsV0FBcEIsRUFBaUNELEtBQUssQ0FBQ3JFLE1BQU4sR0FBZSxDQUFmLEdBQW1CcUUsS0FBbkIsR0FBMkIsSUFBNUQsRUFBa0UsSUFBbEU7QUFHQSxNQUFJNUMsU0FBUyxHQUFHNkMsU0FBUyxDQUFDN0MsU0FBMUI7O0FBQ0EsTUFBSWdDLFNBQUosRUFBZTtBQUNYLFFBQUksQ0FBQ0ssT0FBTCxFQUFjO0FBQ1Z4RixNQUFBQSxFQUFFLENBQUNvRyxNQUFILENBQVVKLFNBQVYsRUFBcUJiLFNBQXJCLEVBRFUsQ0FDOEI7O0FBQ3hDaEMsTUFBQUEsU0FBUyxHQUFHNkMsU0FBUyxDQUFDN0MsU0FBdEIsQ0FGVSxDQUU4QjtBQUMzQzs7QUFDRDZDLElBQUFBLFNBQVMsQ0FBQy9ELE1BQVYsR0FBbUJrRCxTQUFuQjs7QUFDQSxRQUFJdEUsTUFBTSxJQUFJd0Usa0JBQWQsRUFBa0M7QUFDOUJsQyxNQUFBQSxTQUFTLENBQUNvQyxJQUFWLEdBQWlCLFlBQVksQ0FBRSxDQUEvQjtBQUNIO0FBQ0o7O0FBRUQsTUFBSXJELE1BQUosRUFBWTtBQUNSLFNBQUssSUFBSW1FLENBQUMsR0FBR25FLE1BQU0sQ0FBQ1IsTUFBUCxHQUFnQixDQUE3QixFQUFnQzJFLENBQUMsSUFBSSxDQUFyQyxFQUF3Q0EsQ0FBQyxFQUF6QyxFQUE2QztBQUN6QyxVQUFJQyxLQUFLLEdBQUdwRSxNQUFNLENBQUNtRSxDQUFELENBQWxCO0FBQ0ExQixNQUFBQSxrQkFBa0IsQ0FBQ3hCLFNBQUQsRUFBWW1ELEtBQUssQ0FBQ25ELFNBQWxCLENBQWxCLENBRnlDLENBSXpDOztBQUNBd0IsTUFBQUEsa0JBQWtCLENBQUNxQixTQUFELEVBQVlNLEtBQVosRUFBbUIsVUFBVXZCLElBQVYsRUFBZ0I7QUFDakQsZUFBT3VCLEtBQUssQ0FBQ2xELGNBQU4sQ0FBcUIyQixJQUFyQixNQUErQixDQUFDbEUsTUFBRCxJQUFXRCxtQkFBbUIsQ0FBQ0ssT0FBcEIsQ0FBNEI4RCxJQUE1QixJQUFvQyxDQUE5RSxDQUFQO0FBQ0gsT0FGaUIsQ0FBbEIsQ0FMeUMsQ0FTekM7O0FBQ0EsVUFBSWhDLE9BQU8sQ0FBQzRDLFVBQVIsQ0FBbUJXLEtBQW5CLENBQUosRUFBK0I7QUFDM0IzQixRQUFBQSxrQkFBa0IsQ0FBQ25FLElBQUksQ0FBQytGLGFBQUwsQ0FBbUJQLFNBQW5CLENBQUQsRUFBZ0N4RixJQUFJLENBQUMrRixhQUFMLENBQW1CRCxLQUFuQixDQUFoQyxDQUFsQjtBQUNIO0FBQ0osS0FkTyxDQWVSOzs7QUFDQW5ELElBQUFBLFNBQVMsQ0FBQ3FELFdBQVYsR0FBd0JSLFNBQXhCO0FBQ0g7O0FBRUQsTUFBSSxDQUFDUixPQUFMLEVBQWM7QUFDVnJDLElBQUFBLFNBQVMsQ0FBQ3NELGFBQVYsR0FBMEJDLFlBQTFCO0FBQ0g7O0FBRUQxRyxFQUFBQSxFQUFFLENBQUMyRyxZQUFILENBQWdCbkUsU0FBaEIsRUFBMkJ3RCxTQUEzQjtBQUNBLFNBQU9BLFNBQVA7QUFDSDs7QUFFRCxTQUFTWSxNQUFULENBQWlCcEUsU0FBakIsRUFBNEIyQyxTQUE1QixFQUF1Q2pELE1BQXZDLEVBQStDa0QsT0FBL0MsRUFBd0Q7QUFDcEQsTUFBSXlCLFNBQVMsR0FBRzFFLEVBQUUsQ0FBQzBFLFNBQW5COztBQUNBLE1BQUlDLEtBQUssR0FBRzNFLEVBQUUsQ0FBQzRFLEdBQUgsQ0FBT0MsSUFBUCxFQUFaOztBQUNBLE1BQUlGLEtBQUssSUFBSTlHLEVBQUUsQ0FBQ2lILGNBQUgsQ0FBa0I5QixTQUFsQixFQUE2QjBCLFNBQTdCLENBQWIsRUFBc0Q7QUFDbEQ7QUFDQSxRQUFJN0csRUFBRSxDQUFDaUgsY0FBSCxDQUFrQkgsS0FBSyxDQUFDbkYsR0FBeEIsRUFBNkJrRixTQUE3QixDQUFKLEVBQTZDO0FBQ3pDMUUsTUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWDtBQUNBLGFBQU8sSUFBUDtBQUNIOztBQUNELFFBQUl2QixNQUFNLElBQUlpRyxLQUFLLENBQUNJLElBQWhCLElBQXdCMUUsU0FBNUIsRUFBdUM7QUFDbkNMLE1BQUFBLEVBQUUsQ0FBQzBELE1BQUgsQ0FBVSxJQUFWLEVBQWdCckQsU0FBaEI7QUFDSDs7QUFDREEsSUFBQUEsU0FBUyxHQUFHQSxTQUFTLElBQUlzRSxLQUFLLENBQUNLLE1BQS9CO0FBQ0g7O0FBRUQsTUFBSXhGLEdBQUcsR0FBR3VELFFBQVEsQ0FBQzFDLFNBQUQsRUFBWTJDLFNBQVosRUFBdUJqRCxNQUF2QixFQUErQmtELE9BQS9CLENBQWxCOztBQUVBLE1BQUkwQixLQUFKLEVBQVc7QUFDUCxRQUFJOUcsRUFBRSxDQUFDaUgsY0FBSCxDQUFrQjlCLFNBQWxCLEVBQTZCMEIsU0FBN0IsQ0FBSixFQUE2QztBQUN6QyxVQUFJSyxJQUFJLEdBQUdKLEtBQUssQ0FBQ0ksSUFBakI7O0FBQ0EsVUFBSUEsSUFBSixFQUFVO0FBQ05sSCxRQUFBQSxFQUFFLENBQUNvSCxXQUFILENBQWVGLElBQWYsRUFBcUJ2RixHQUFyQjs7QUFDQSxZQUFJNEIsU0FBSixFQUFlO0FBQ1hzRCxVQUFBQSxTQUFTLENBQUNRLFlBQVYsQ0FBdUIxRixHQUF2QixFQUE0QixzQ0FBc0NhLFNBQWxFLEVBQTZFLENBQUMsQ0FBOUU7O0FBQ0FiLFVBQUFBLEdBQUcsQ0FBQ3dCLFNBQUosQ0FBY21FLFlBQWQsR0FBNkI5RCxNQUFNLENBQUMrRCxLQUFQLENBQWFDLFNBQWIsQ0FBdUJDLGNBQXZCLENBQXNDUCxJQUF0QyxDQUE3QjtBQUNIO0FBQ0o7O0FBQ0RKLE1BQUFBLEtBQUssQ0FBQ25GLEdBQU4sR0FBWUEsR0FBWjtBQUNILEtBVkQsTUFXSyxJQUFJLENBQUMzQixFQUFFLENBQUNpSCxjQUFILENBQWtCSCxLQUFLLENBQUNuRixHQUF4QixFQUE2QmtGLFNBQTdCLENBQUwsRUFBOEM7QUFDL0NDLE1BQUFBLEtBQUssQ0FBQ25GLEdBQU4sR0FBWUEsR0FBWjtBQUNIO0FBQ0o7O0FBQ0QsU0FBT0EsR0FBUDtBQUNIOztBQUVELFNBQVMrRixzQkFBVCxDQUFpQ2xGLFNBQWpDLEVBQTRDO0FBQ3hDLE1BQUltRixXQUFXLEdBQUcsU0FBbEI7O0FBQ0EsTUFBSW5GLFNBQUosRUFBZTtBQUNYQSxJQUFBQSxTQUFTLEdBQUdBLFNBQVMsQ0FBQ29GLE9BQVYsQ0FBa0IsY0FBbEIsRUFBa0MsR0FBbEMsRUFBdUNBLE9BQXZDLENBQStDLGlCQUEvQyxFQUFrRSxHQUFsRSxDQUFaOztBQUNBLFFBQUk7QUFDQTtBQUNBQyxNQUFBQSxRQUFRLENBQUMsY0FBY3JGLFNBQWQsR0FBMEIsTUFBM0IsQ0FBUjtBQUNBLGFBQU9BLFNBQVA7QUFDSCxLQUpELENBS0EsT0FBT2dDLENBQVAsRUFBVTtBQUNOO0FBQ0g7QUFDSjs7QUFDRCxTQUFPbUQsV0FBUDtBQUNIOztBQUVELFNBQVNHLHNCQUFULENBQWlDM0IsS0FBakMsRUFBd0M7QUFDcEMsTUFBSTRCLE9BQU8sR0FBRy9ILEVBQUUsQ0FBQytCLFlBQUgsQ0FBZ0JvRSxLQUFoQixDQUFkO0FBQ0EsTUFBSTZCLElBQUksR0FBRzdCLEtBQUssQ0FBQ0ssV0FBakI7QUFDQSxNQUFJeUIsR0FBRyxHQUFHLFNBQVNGLE9BQVQsR0FBbUIsR0FBN0I7O0FBQ0EsT0FBSyxJQUFJdEcsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3VHLElBQUksQ0FBQzFGLFNBQUwsQ0FBZVosTUFBbkMsRUFBMkNELENBQUMsRUFBNUMsRUFBZ0Q7QUFDNUMsUUFBSXNELElBQUksR0FBR2lELElBQUksQ0FBQzFGLFNBQUwsQ0FBZWIsQ0FBZixDQUFYO0FBQ0EsUUFBSXlHLE9BQU8sR0FBRy9CLEtBQUssQ0FBQ3BCLElBQUQsQ0FBbkI7O0FBQ0EsUUFBSWxFLE1BQU0sSUFBSSxPQUFPcUgsT0FBUCxLQUFtQixRQUFqQyxFQUEyQztBQUN2Qy9GLE1BQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUIyRixPQUFqQjtBQUNBLGFBQU8sU0FBU0EsT0FBVCxHQUFtQixJQUExQjtBQUNIOztBQUNERSxJQUFBQSxHQUFHLElBQUlDLE9BQVA7O0FBQ0EsUUFBSXpHLENBQUMsR0FBR3VHLElBQUksQ0FBQzFGLFNBQUwsQ0FBZVosTUFBZixHQUF3QixDQUFoQyxFQUFtQztBQUMvQnVHLE1BQUFBLEdBQUcsSUFBSSxHQUFQO0FBQ0g7QUFDSjs7QUFDRCxTQUFPQSxHQUFHLEdBQUcsR0FBYjtBQUNILEVBRUQ7QUFFQTtBQUNBOzs7QUFDQSxTQUFTRSxXQUFULENBQXNCQyxDQUF0QixFQUF5QjtBQUNyQixTQUFPQyxJQUFJLENBQUNDLFNBQUwsQ0FBZUYsQ0FBZixHQUNIO0FBQ0FSLEVBQUFBLE9BRkcsQ0FFSyxTQUZMLEVBRWdCLFNBRmhCLEVBR0hBLE9BSEcsQ0FHSyxTQUhMLEVBR2dCLFNBSGhCLENBQVA7QUFJSDs7QUFFRCxTQUFTVyxlQUFULENBQTBCQyxLQUExQixFQUFpQ0MsUUFBakMsRUFBMkM7QUFDdkM7QUFDQSxNQUFJQyxDQUFDLEdBQUcsRUFBUjtBQUNBLE1BQUlDLElBQUksR0FBRyxFQUFYOztBQUVBLE9BQUssSUFBSWxILENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdnSCxRQUFRLENBQUMvRyxNQUE3QixFQUFxQ0QsQ0FBQyxFQUF0QyxFQUEwQztBQUN0QyxRQUFJc0QsSUFBSSxHQUFHMEQsUUFBUSxDQUFDaEgsQ0FBRCxDQUFuQjtBQUNBLFFBQUltSCxPQUFPLEdBQUc3RCxJQUFJLEdBQUd0RSxTQUFQLEdBQW1CLFNBQWpDOztBQUNBLFFBQUltSSxPQUFPLElBQUlKLEtBQWYsRUFBc0I7QUFBRztBQUNyQixVQUFJSyxTQUFKOztBQUNBLFVBQUlDLGFBQWEsQ0FBQ2xELElBQWQsQ0FBbUJiLElBQW5CLENBQUosRUFBOEI7QUFDMUI4RCxRQUFBQSxTQUFTLEdBQUcsVUFBVTlELElBQVYsR0FBaUIsR0FBN0I7QUFDSCxPQUZELE1BR0s7QUFDRDhELFFBQUFBLFNBQVMsR0FBRyxVQUFVVixXQUFXLENBQUNwRCxJQUFELENBQXJCLEdBQThCLElBQTFDO0FBQ0g7O0FBQ0QsVUFBSWdFLFVBQUo7QUFDQSxVQUFJQyxHQUFHLEdBQUdSLEtBQUssQ0FBQ0ksT0FBRCxDQUFmOztBQUNBLFVBQUksT0FBT0ksR0FBUCxLQUFlLFFBQWYsSUFBMkJBLEdBQS9CLEVBQW9DO0FBQ2hDLFlBQUlBLEdBQUcsWUFBWTdHLEVBQUUsQ0FBQzhHLFNBQXRCLEVBQWlDO0FBQzdCRixVQUFBQSxVQUFVLEdBQUdqQixzQkFBc0IsQ0FBQ2tCLEdBQUQsQ0FBbkM7QUFDSCxTQUZELE1BR0ssSUFBSW5HLEtBQUssQ0FBQ0MsT0FBTixDQUFja0csR0FBZCxDQUFKLEVBQXdCO0FBQ3pCRCxVQUFBQSxVQUFVLEdBQUcsSUFBYjtBQUNILFNBRkksTUFHQTtBQUNEQSxVQUFBQSxVQUFVLEdBQUcsSUFBYjtBQUNIO0FBQ0osT0FWRCxNQVdLLElBQUksT0FBT0MsR0FBUCxLQUFlLFVBQW5CLEVBQStCO0FBQ2hDLFlBQUlFLEtBQUssR0FBR1IsQ0FBQyxDQUFDaEgsTUFBZDtBQUNBZ0gsUUFBQUEsQ0FBQyxDQUFDeEgsSUFBRixDQUFPOEgsR0FBUDtBQUNBRCxRQUFBQSxVQUFVLEdBQUcsT0FBT0csS0FBUCxHQUFlLEtBQTVCOztBQUNBLFlBQUkzRixTQUFKLEVBQWU7QUFDWG9GLFVBQUFBLElBQUksSUFBSSxZQUFZRSxTQUFaLEdBQXdCRSxVQUF4QixHQUFxQyxtQ0FBckMsR0FBMkVGLFNBQTNFLEdBQXVGLGlCQUEvRjtBQUNBO0FBQ0g7QUFDSixPQVJJLE1BU0EsSUFBSSxPQUFPRyxHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDOUJELFFBQUFBLFVBQVUsR0FBR1osV0FBVyxDQUFDYSxHQUFELENBQXhCO0FBQ0gsT0FGSSxNQUdBO0FBQ0Q7QUFDQUQsUUFBQUEsVUFBVSxHQUFHQyxHQUFiO0FBQ0g7O0FBQ0RILE1BQUFBLFNBQVMsR0FBR0EsU0FBUyxHQUFHRSxVQUFaLEdBQXlCLEtBQXJDO0FBQ0FKLE1BQUFBLElBQUksSUFBSUUsU0FBUjtBQUNIO0FBQ0osR0FoRHNDLENBa0R2QztBQUNBO0FBQ0E7OztBQUVBLE1BQUlNLFNBQUo7O0FBQ0EsTUFBSVQsQ0FBQyxDQUFDaEgsTUFBRixLQUFhLENBQWpCLEVBQW9CO0FBQ2hCeUgsSUFBQUEsU0FBUyxHQUFHdEIsUUFBUSxDQUFDYyxJQUFELENBQXBCO0FBQ0gsR0FGRCxNQUdLO0FBQ0RRLElBQUFBLFNBQVMsR0FBR3RCLFFBQVEsQ0FBQyxHQUFELEVBQU0sMEJBQTBCYyxJQUExQixHQUFpQyxJQUF2QyxDQUFSLENBQXFERCxDQUFyRCxDQUFaO0FBQ0g7O0FBRUQsU0FBT1MsU0FBUDtBQUNIOztBQUVELFNBQVNDLFlBQVQsQ0FBdUJaLEtBQXZCLEVBQThCQyxRQUE5QixFQUF3QztBQUNwQyxNQUFJWSxhQUFhLEdBQUcsRUFBcEI7QUFDQSxNQUFJQyxjQUFjLEdBQUcsRUFBckI7QUFDQSxNQUFJQyxXQUFXLEdBQUcsRUFBbEI7QUFDQSxNQUFJQyxZQUFZLEdBQUcsRUFBbkI7O0FBRUEsT0FBSyxJQUFJL0gsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR2dILFFBQVEsQ0FBQy9HLE1BQTdCLEVBQXFDLEVBQUVELENBQXZDLEVBQTBDO0FBQ3RDLFFBQUlzRCxJQUFJLEdBQUcwRCxRQUFRLENBQUNoSCxDQUFELENBQW5CO0FBQ0EsUUFBSW1ILE9BQU8sR0FBRzdELElBQUksR0FBR3RFLFNBQVAsR0FBbUIsU0FBakM7O0FBQ0EsUUFBSW1JLE9BQU8sSUFBSUosS0FBZixFQUFzQjtBQUFFO0FBQ3BCLFVBQUlRLEdBQUcsR0FBR1IsS0FBSyxDQUFDSSxPQUFELENBQWY7O0FBQ0EsVUFBSyxPQUFPSSxHQUFQLEtBQWUsUUFBZixJQUEyQkEsR0FBNUIsSUFBb0MsT0FBT0EsR0FBUCxLQUFlLFVBQXZELEVBQW1FO0FBQy9ESyxRQUFBQSxhQUFhLENBQUNuSSxJQUFkLENBQW1CNkQsSUFBbkI7QUFDQXVFLFFBQUFBLGNBQWMsQ0FBQ3BJLElBQWYsQ0FBb0I4SCxHQUFwQjtBQUNILE9BSEQsTUFJSztBQUNEO0FBQ0FPLFFBQUFBLFdBQVcsQ0FBQ3JJLElBQVosQ0FBaUI2RCxJQUFqQjtBQUNBeUUsUUFBQUEsWUFBWSxDQUFDdEksSUFBYixDQUFrQjhILEdBQWxCO0FBQ0g7QUFDSjtBQUNKOztBQUVELFNBQU8sWUFBWTtBQUNmLFNBQUssSUFBSXZILEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUc4SCxXQUFXLENBQUM3SCxNQUFoQyxFQUF3QyxFQUFFRCxFQUExQyxFQUE2QztBQUN6QyxXQUFLOEgsV0FBVyxDQUFDOUgsRUFBRCxDQUFoQixJQUF1QitILFlBQVksQ0FBQy9ILEVBQUQsQ0FBbkM7QUFDSDs7QUFDRCxTQUFLLElBQUlBLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUc0SCxhQUFhLENBQUMzSCxNQUFsQyxFQUEwQ0QsR0FBQyxFQUEzQyxFQUErQztBQUMzQyxVQUFJc0QsS0FBSSxHQUFHc0UsYUFBYSxDQUFDNUgsR0FBRCxDQUF4QjtBQUNBLFVBQUlzSCxVQUFKO0FBQ0EsVUFBSUMsR0FBRyxHQUFHTSxjQUFjLENBQUM3SCxHQUFELENBQXhCOztBQUNBLFVBQUksT0FBT3VILEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUN6QixZQUFJQSxHQUFHLFlBQVk3RyxFQUFFLENBQUM4RyxTQUF0QixFQUFpQztBQUM3QkYsVUFBQUEsVUFBVSxHQUFHQyxHQUFHLENBQUNTLEtBQUosRUFBYjtBQUNILFNBRkQsTUFHSyxJQUFJNUcsS0FBSyxDQUFDQyxPQUFOLENBQWNrRyxHQUFkLENBQUosRUFBd0I7QUFDekJELFVBQUFBLFVBQVUsR0FBRyxFQUFiO0FBQ0gsU0FGSSxNQUdBO0FBQ0RBLFVBQUFBLFVBQVUsR0FBRyxFQUFiO0FBQ0g7QUFDSixPQVZELE1BV0s7QUFDRDtBQUNBLFlBQUl4RixTQUFKLEVBQWU7QUFDWCxjQUFJO0FBQ0F3RixZQUFBQSxVQUFVLEdBQUdDLEdBQUcsRUFBaEI7QUFDSCxXQUZELENBR0EsT0FBT1UsR0FBUCxFQUFZO0FBQ1J2SCxZQUFBQSxFQUFFLENBQUNzQyxNQUFILENBQVVELENBQVY7O0FBQ0E7QUFDSDtBQUNKLFNBUkQsTUFTSztBQUNEdUUsVUFBQUEsVUFBVSxHQUFHQyxHQUFHLEVBQWhCO0FBQ0g7QUFDSjs7QUFDRCxXQUFLakUsS0FBTCxJQUFhZ0UsVUFBYjtBQUNIO0FBQ0osR0FwQ0Q7QUFxQ0gsRUFFRDs7O0FBQ0EsSUFBSUQsYUFBYSxHQUFHLDRCQUFwQjs7QUFDQSxTQUFTcEMsWUFBVCxDQUF1QmlELFdBQXZCLEVBQW9DO0FBQ2hDO0FBQ0EsTUFBSW5CLEtBQUssR0FBR2hJLElBQUksQ0FBQytGLGFBQUwsQ0FBbUJvRCxXQUFuQixDQUFaO0FBQ0EsTUFBSWxCLFFBQVEsR0FBR2tCLFdBQVcsQ0FBQ3JILFNBQTNCOztBQUNBLE1BQUltRyxRQUFRLEtBQUssSUFBakIsRUFBdUI7QUFDbkJ0SCxJQUFBQSxtQkFBbUIsQ0FBQ0ssSUFBcEI7QUFDQWlILElBQUFBLFFBQVEsR0FBR2tCLFdBQVcsQ0FBQ3JILFNBQXZCO0FBQ0gsR0FQK0IsQ0FTaEM7OztBQUNBLE1BQUk2RyxTQUFTLEdBQUdTLGNBQWMsR0FBR3JCLGVBQWUsQ0FBQ0MsS0FBRCxFQUFRQyxRQUFSLENBQWxCLEdBQXNDVyxZQUFZLENBQUNaLEtBQUQsRUFBUUMsUUFBUixDQUFoRjtBQUNBa0IsRUFBQUEsV0FBVyxDQUFDeEcsU0FBWixDQUFzQnNELGFBQXRCLEdBQXNDMEMsU0FBdEMsQ0FYZ0MsQ0FhaEM7QUFDQTs7QUFDQUEsRUFBQUEsU0FBUyxDQUFDVSxJQUFWLENBQWUsSUFBZjtBQUNIOztBQUVELElBQUkzRCxXQUFXLEdBQUcwRCxjQUFjLEdBQUcsVUFBVTdELEtBQVYsRUFBaUJaLFNBQWpCLEVBQTRCM0MsU0FBNUIsRUFBdUM0QyxPQUF2QyxFQUFnRDtBQUMvRSxNQUFJMEUsZ0JBQWdCLEdBQUczRSxTQUFTLElBQUk0RSxlQUFlLENBQUM1RSxTQUFELEVBQVlDLE9BQVosRUFBcUI1QyxTQUFyQixDQUFuRDtBQUVBLE1BQUl3SCxRQUFRLEdBQUduSixNQUFNLEdBQUc2RyxzQkFBc0IsQ0FBQ2xGLFNBQUQsQ0FBekIsR0FBdUMsU0FBNUQ7QUFDQSxNQUFJeUgsSUFBSSxHQUFHLHFCQUFxQkQsUUFBckIsR0FBZ0MsT0FBM0M7O0FBRUEsTUFBSUYsZ0JBQUosRUFBc0I7QUFDbEJHLElBQUFBLElBQUksSUFBSSxxQkFBUjtBQUNILEdBUjhFLENBVS9FOzs7QUFDQUEsRUFBQUEsSUFBSSxJQUFJLHdCQUF3QkQsUUFBeEIsR0FBbUMsTUFBM0MsQ0FYK0UsQ0FhL0U7O0FBQ0EsTUFBSUUsT0FBTyxHQUFHbkUsS0FBSyxDQUFDckUsTUFBcEI7O0FBQ0EsTUFBSXdJLE9BQU8sR0FBRyxDQUFkLEVBQWlCO0FBQ2IsUUFBSUMsV0FBVyxHQUFHdEosTUFBTSxJQUFJLEVBQUcyQixTQUFTLElBQUlBLFNBQVMsQ0FBQzRILFVBQVYsQ0FBcUIsS0FBckIsQ0FBaEIsQ0FBNUI7O0FBQ0EsUUFBSUQsV0FBSixFQUFpQjtBQUNiRixNQUFBQSxJQUFJLElBQUksUUFBUjtBQUNIOztBQUNELFFBQUlJLE9BQU8sR0FBRyw0QkFBZDs7QUFDQSxRQUFJSCxPQUFPLEtBQUssQ0FBaEIsRUFBbUI7QUFDZkQsTUFBQUEsSUFBSSxJQUFJRCxRQUFRLEdBQUcsY0FBWCxHQUE0QkssT0FBcEM7QUFDSCxLQUZELE1BR0s7QUFDREosTUFBQUEsSUFBSSxJQUFJLFlBQVlELFFBQVosR0FBdUIsZUFBL0I7O0FBQ0EsV0FBSyxJQUFJdkksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3lJLE9BQXBCLEVBQTZCekksQ0FBQyxFQUE5QixFQUFrQztBQUM5QndJLFFBQUFBLElBQUksSUFBSSxRQUFReEksQ0FBUixHQUFZNEksT0FBcEI7QUFDSDtBQUNKOztBQUNELFFBQUlGLFdBQUosRUFBaUI7QUFDYkYsTUFBQUEsSUFBSSxJQUFJLGlCQUNJLGlCQURKLEdBRUEsS0FGUjtBQUdIO0FBQ0o7O0FBQ0RBLEVBQUFBLElBQUksSUFBSSxHQUFSO0FBRUEsU0FBT3BDLFFBQVEsQ0FBQ29DLElBQUQsQ0FBUixFQUFQO0FBQ0gsQ0F2QytCLEdBdUM1QixVQUFVbEUsS0FBVixFQUFpQlosU0FBakIsRUFBNEIzQyxTQUE1QixFQUF1QzRDLE9BQXZDLEVBQWdEO0FBQ2hELE1BQUkwRSxnQkFBZ0IsR0FBRzNFLFNBQVMsSUFBSTRFLGVBQWUsQ0FBQzVFLFNBQUQsRUFBWUMsT0FBWixFQUFxQjVDLFNBQXJCLENBQW5EO0FBQ0EsTUFBSTBILE9BQU8sR0FBR25FLEtBQUssQ0FBQ3JFLE1BQXBCOztBQUVBLE1BQUk0SSxPQUFKOztBQUVBLE1BQUlKLE9BQU8sR0FBRyxDQUFkLEVBQWlCO0FBQ2IsUUFBSUosZ0JBQUosRUFBc0I7QUFDbEIsVUFBSUksT0FBTyxLQUFLLENBQWhCLEVBQW1CO0FBQ2Y7QUFDQUksUUFBQUEsT0FBSyxHQUFHLGlCQUFZO0FBQ2hCLGVBQUtDLE1BQUwsR0FBYyxJQUFkOztBQUNBLGVBQUs5RCxhQUFMLENBQW1CNkQsT0FBbkI7O0FBQ0F2RSxVQUFBQSxLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVN5RSxLQUFULENBQWUsSUFBZixFQUFxQkMsU0FBckI7QUFDQTFFLFVBQUFBLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBU3lFLEtBQVQsQ0FBZSxJQUFmLEVBQXFCQyxTQUFyQjtBQUNILFNBTEQ7QUFNSCxPQVJELE1BU0s7QUFDREgsUUFBQUEsT0FBSyxHQUFHLGtCQUFZO0FBQ2hCLGVBQUtDLE1BQUwsR0FBYyxJQUFkOztBQUNBLGVBQUs5RCxhQUFMLENBQW1CNkQsT0FBbkI7O0FBQ0EsZUFBSyxJQUFJN0ksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3NFLEtBQUssQ0FBQ3JFLE1BQTFCLEVBQWtDLEVBQUVELENBQXBDLEVBQXVDO0FBQ25Dc0UsWUFBQUEsS0FBSyxDQUFDdEUsQ0FBRCxDQUFMLENBQVMrSSxLQUFULENBQWUsSUFBZixFQUFxQkMsU0FBckI7QUFDSDtBQUNKLFNBTkQ7QUFPSDtBQUNKLEtBbkJELE1Bb0JLO0FBQ0QsVUFBSVAsT0FBTyxLQUFLLENBQWhCLEVBQW1CO0FBQ2Y7QUFDQUksUUFBQUEsT0FBSyxHQUFHLG1CQUFZO0FBQ2hCLGVBQUs3RCxhQUFMLENBQW1CNkQsT0FBbkI7O0FBQ0F2RSxVQUFBQSxLQUFLLENBQUMsQ0FBRCxDQUFMLENBQVN5RSxLQUFULENBQWUsSUFBZixFQUFxQkMsU0FBckI7QUFDQTFFLFVBQUFBLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBU3lFLEtBQVQsQ0FBZSxJQUFmLEVBQXFCQyxTQUFyQjtBQUNBMUUsVUFBQUEsS0FBSyxDQUFDLENBQUQsQ0FBTCxDQUFTeUUsS0FBVCxDQUFlLElBQWYsRUFBcUJDLFNBQXJCO0FBQ0gsU0FMRDtBQU1ILE9BUkQsTUFTSztBQUNESCxRQUFBQSxPQUFLLEdBQUcsbUJBQVk7QUFDaEIsZUFBSzdELGFBQUwsQ0FBbUI2RCxPQUFuQjs7QUFDQSxjQUFJdkUsS0FBSyxHQUFHdUUsT0FBSyxDQUFDSSxTQUFsQjs7QUFDQSxlQUFLLElBQUlqSixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHc0UsS0FBSyxDQUFDckUsTUFBMUIsRUFBa0MsRUFBRUQsQ0FBcEMsRUFBdUM7QUFDbkNzRSxZQUFBQSxLQUFLLENBQUN0RSxDQUFELENBQUwsQ0FBUytJLEtBQVQsQ0FBZSxJQUFmLEVBQXFCQyxTQUFyQjtBQUNIO0FBQ0osU0FORDtBQU9IO0FBQ0o7QUFDSixHQXpDRCxNQTBDSztBQUNESCxJQUFBQSxPQUFLLEdBQUcsbUJBQVk7QUFDaEIsVUFBSVIsZ0JBQUosRUFBc0I7QUFDbEIsYUFBS1MsTUFBTCxHQUFjLElBQWQ7QUFDSDs7QUFDRCxXQUFLOUQsYUFBTCxDQUFtQjZELE9BQW5CO0FBQ0gsS0FMRDtBQU1IOztBQUNELFNBQU9BLE9BQVA7QUFDSCxDQWhHRDs7QUFrR0EsU0FBU3hFLGlCQUFULENBQTRCUCxJQUE1QixFQUFrQ0osU0FBbEMsRUFBNkMzQyxTQUE3QyxFQUF3RDRDLE9BQXhELEVBQWlFO0FBQzdELE1BQUk3QixTQUFTLElBQUk0QixTQUFqQixFQUE0QjtBQUN4QjtBQUNBLFFBQUl3RixVQUFVLEdBQUdwRixJQUFqQjs7QUFDQSxRQUFJcUYsWUFBWSxDQUFDaEYsSUFBYixDQUFrQkwsSUFBbEIsQ0FBSixFQUE2QjtBQUN6QixVQUFJSCxPQUFPLENBQUNLLE9BQVosRUFBcUI7QUFDakJ0RCxRQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCSSxTQUFqQjtBQUNILE9BRkQsTUFHSztBQUNETCxRQUFBQSxFQUFFLENBQUMwRCxNQUFILENBQVUsSUFBVixFQUFnQnJELFNBQWhCLEVBREMsQ0FFRDs7QUFDQStDLFFBQUFBLElBQUksR0FBRyxnQkFBWTtBQUNmLGVBQUtnRixNQUFMLEdBQWMsWUFBWSxDQUFFLENBQTVCOztBQUNBLGNBQUlNLEdBQUcsR0FBR0YsVUFBVSxDQUFDSCxLQUFYLENBQWlCLElBQWpCLEVBQXVCQyxTQUF2QixDQUFWO0FBQ0EsZUFBS0YsTUFBTCxHQUFjLElBQWQ7QUFDQSxpQkFBT00sR0FBUDtBQUNILFNBTEQ7QUFNSDtBQUNKO0FBQ0osR0FuQjRELENBcUI3RDs7O0FBQ0EsTUFBSXRGLElBQUksQ0FBQzdELE1BQUwsR0FBYyxDQUFkLEtBQW9CLENBQUNjLFNBQUQsSUFBYyxDQUFDQSxTQUFTLENBQUM0SCxVQUFWLENBQXFCLEtBQXJCLENBQW5DLENBQUosRUFBcUU7QUFDakU7QUFDQTtBQUNBO0FBQ0FqSSxJQUFBQSxFQUFFLENBQUMwRCxNQUFILENBQVUsSUFBVixFQUFnQnJELFNBQWhCO0FBQ0g7O0FBRUQsU0FBTytDLElBQVA7QUFDSDs7QUFFRCxTQUFTVSxZQUFULENBQXVCZCxTQUF2QixFQUFrQ2pELE1BQWxDLEVBQTBDa0QsT0FBMUMsRUFBbUQ7QUFDL0M7QUFDQSxXQUFTMEYsUUFBVCxDQUFtQm5KLEdBQW5CLEVBQXdCO0FBQ3BCLFFBQUlvQixPQUFPLENBQUM0QyxVQUFSLENBQW1CaEUsR0FBbkIsQ0FBSixFQUE2QjtBQUN6QixhQUFPQSxHQUFHLENBQUMrSSxTQUFKLElBQWlCLEVBQXhCO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsYUFBTyxDQUFDL0ksR0FBRCxDQUFQO0FBQ0g7QUFDSjs7QUFFRCxNQUFJb0UsS0FBSyxHQUFHLEVBQVosQ0FYK0MsQ0FZL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFJZ0YsWUFBWSxHQUFHLENBQUM1RixTQUFELEVBQVk2RixNQUFaLENBQW1COUksTUFBbkIsQ0FBbkI7O0FBQ0EsT0FBSyxJQUFJK0ksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsWUFBWSxDQUFDckosTUFBakMsRUFBeUN1SixDQUFDLEVBQTFDLEVBQThDO0FBQzFDLFFBQUlDLFdBQVcsR0FBR0gsWUFBWSxDQUFDRSxDQUFELENBQTlCOztBQUNBLFFBQUlDLFdBQUosRUFBaUI7QUFDYixVQUFJQyxTQUFTLEdBQUdMLFFBQVEsQ0FBQ0ksV0FBRCxDQUF4Qjs7QUFDQSxXQUFLLElBQUlFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELFNBQVMsQ0FBQ3pKLE1BQTlCLEVBQXNDMEosQ0FBQyxFQUF2QyxFQUEyQztBQUN2Q3RLLFFBQUFBLFVBQVUsQ0FBQ2lGLEtBQUQsRUFBUW9GLFNBQVMsQ0FBQ0MsQ0FBRCxDQUFqQixDQUFWO0FBQ0g7QUFDSjtBQUNKLEdBdEM4QyxDQXVDL0M7QUFFQTs7O0FBQ0EsTUFBSTdGLElBQUksR0FBR0gsT0FBTyxDQUFDRyxJQUFuQjs7QUFDQSxNQUFJQSxJQUFKLEVBQVU7QUFDTlEsSUFBQUEsS0FBSyxDQUFDN0UsSUFBTixDQUFXcUUsSUFBWDtBQUNIOztBQUVELFNBQU9RLEtBQVA7QUFDSDs7QUFFRCxJQUFJNkUsWUFBWSxHQUFHLE1BQU1oRixJQUFOLENBQVcsWUFBVTtBQUFDeUYsRUFBQUEsR0FBRztBQUFDLENBQTFCLElBQThCLGNBQTlCLEdBQStDLElBQWxFO0FBQ0EsSUFBSUMsa0JBQWtCLEdBQUcsTUFBTTFGLElBQU4sQ0FBVyxZQUFVO0FBQUN5RixFQUFBQSxHQUFHO0FBQUMsQ0FBMUIsSUFBOEIsbUJBQTlCLEdBQW9ELFlBQTdFOztBQUNBLFNBQVN0QixlQUFULENBQTBCNUUsU0FBMUIsRUFBcUNDLE9BQXJDLEVBQThDNUMsU0FBOUMsRUFBeUQ7QUFDckQsTUFBSStJLFlBQVksR0FBRyxLQUFuQjs7QUFDQSxPQUFLLElBQUlDLFFBQVQsSUFBcUJwRyxPQUFyQixFQUE4QjtBQUMxQixRQUFJekUsZUFBZSxDQUFDTSxPQUFoQixDQUF3QnVLLFFBQXhCLEtBQXFDLENBQXpDLEVBQTRDO0FBQ3hDO0FBQ0g7O0FBQ0QsUUFBSTdDLElBQUksR0FBR3ZELE9BQU8sQ0FBQ29HLFFBQUQsQ0FBbEI7O0FBQ0EsUUFBSSxPQUFPN0MsSUFBUCxLQUFnQixVQUFwQixFQUFnQztBQUM1QjtBQUNIOztBQUNELFFBQUk4QyxFQUFFLEdBQUd6TCxFQUFFLENBQUNpRixxQkFBSCxDQUF5QkUsU0FBUyxDQUFDaEMsU0FBbkMsRUFBOENxSSxRQUE5QyxDQUFUOztBQUNBLFFBQUlDLEVBQUosRUFBUTtBQUNKLFVBQUlDLFNBQVMsR0FBR0QsRUFBRSxDQUFDdEYsS0FBbkIsQ0FESSxDQUVKOztBQUNBLFVBQUksT0FBT3VGLFNBQVAsS0FBcUIsVUFBekIsRUFBcUM7QUFDakMsWUFBSWQsWUFBWSxDQUFDaEYsSUFBYixDQUFrQitDLElBQWxCLENBQUosRUFBNkI7QUFDekI0QyxVQUFBQSxZQUFZLEdBQUcsSUFBZixDQUR5QixDQUV6Qjs7QUFDQW5HLFVBQUFBLE9BQU8sQ0FBQ29HLFFBQUQsQ0FBUCxHQUFxQixVQUFVRSxTQUFWLEVBQXFCL0MsSUFBckIsRUFBMkI7QUFDNUMsbUJBQU8sWUFBWTtBQUNmLGtCQUFJZ0QsR0FBRyxHQUFHLEtBQUtwQixNQUFmLENBRGUsQ0FHZjs7QUFDQSxtQkFBS0EsTUFBTCxHQUFjbUIsU0FBZDtBQUVBLGtCQUFJYixHQUFHLEdBQUdsQyxJQUFJLENBQUM2QixLQUFMLENBQVcsSUFBWCxFQUFpQkMsU0FBakIsQ0FBVixDQU5lLENBUWY7O0FBQ0EsbUJBQUtGLE1BQUwsR0FBY29CLEdBQWQ7QUFFQSxxQkFBT2QsR0FBUDtBQUNILGFBWkQ7QUFhSCxXQWRtQixDQWNqQmEsU0FkaUIsRUFjTi9DLElBZE0sQ0FBcEI7QUFlSDs7QUFDRDtBQUNIO0FBQ0o7O0FBQ0QsUUFBSTlILE1BQU0sSUFBSXlLLGtCQUFrQixDQUFDMUYsSUFBbkIsQ0FBd0IrQyxJQUF4QixDQUFkLEVBQTZDO0FBQ3pDeEcsTUFBQUEsRUFBRSxDQUFDMEQsTUFBSCxDQUFVLElBQVYsRUFBZ0JyRCxTQUFoQixFQUEyQmdKLFFBQTNCO0FBQ0g7QUFDSjs7QUFDRCxTQUFPRCxZQUFQO0FBQ0g7O0FBRUQsU0FBU3ZKLGlCQUFULENBQTRCTCxHQUE1QixFQUFpQ2EsU0FBakMsRUFBNENaLFVBQTVDLEVBQXdEdUQsU0FBeEQsRUFBbUVqRCxNQUFuRSxFQUEyRVMsR0FBM0UsRUFBZ0Y7QUFDNUVoQixFQUFBQSxHQUFHLENBQUNXLFNBQUosR0FBZ0IsRUFBaEI7O0FBRUEsTUFBSTZDLFNBQVMsSUFBSUEsU0FBUyxDQUFDN0MsU0FBM0IsRUFBc0M7QUFDbENYLElBQUFBLEdBQUcsQ0FBQ1csU0FBSixHQUFnQjZDLFNBQVMsQ0FBQzdDLFNBQVYsQ0FBb0JzSixLQUFwQixFQUFoQjtBQUNIOztBQUVELE1BQUkxSixNQUFKLEVBQVk7QUFDUixTQUFLLElBQUltRSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHbkUsTUFBTSxDQUFDUixNQUEzQixFQUFtQyxFQUFFMkUsQ0FBckMsRUFBd0M7QUFDcEMsVUFBSUMsS0FBSyxHQUFHcEUsTUFBTSxDQUFDbUUsQ0FBRCxDQUFsQjs7QUFDQSxVQUFJQyxLQUFLLENBQUNoRSxTQUFWLEVBQXFCO0FBQ2pCWCxRQUFBQSxHQUFHLENBQUNXLFNBQUosR0FBZ0JYLEdBQUcsQ0FBQ1csU0FBSixDQUFjMEksTUFBZCxDQUFxQjFFLEtBQUssQ0FBQ2hFLFNBQU4sQ0FBZ0J3QyxNQUFoQixDQUF1QixVQUFVNUIsQ0FBVixFQUFhO0FBQ3JFLGlCQUFPdkIsR0FBRyxDQUFDVyxTQUFKLENBQWNyQixPQUFkLENBQXNCaUMsQ0FBdEIsSUFBMkIsQ0FBbEM7QUFDSCxTQUZvQyxDQUFyQixDQUFoQjtBQUdIO0FBQ0o7QUFDSjs7QUFFRCxNQUFJdEIsVUFBSixFQUFnQjtBQUNaO0FBQ0FsQixJQUFBQSxVQUFVLENBQUNtTCxlQUFYLENBQTJCakssVUFBM0IsRUFBdUNZLFNBQXZDLEVBQWtEYixHQUFsRCxFQUF1RGdCLEdBQXZEOztBQUVBLFNBQUssSUFBSUYsUUFBVCxJQUFxQmIsVUFBckIsRUFBaUM7QUFDN0IsVUFBSWMsR0FBRyxHQUFHZCxVQUFVLENBQUNhLFFBQUQsQ0FBcEI7O0FBQ0EsVUFBSSxhQUFhQyxHQUFqQixFQUFzQjtBQUNsQkgsUUFBQUEsVUFBVSxDQUFDWixHQUFELEVBQU1hLFNBQU4sRUFBaUJDLFFBQWpCLEVBQTJCQyxHQUEzQixFQUFnQ0MsR0FBaEMsQ0FBVjtBQUNILE9BRkQsTUFHSztBQUNEaUIsUUFBQUEsWUFBWSxDQUFDakMsR0FBRCxFQUFNYSxTQUFOLEVBQWlCQyxRQUFqQixFQUEyQkMsR0FBM0IsRUFBZ0NDLEdBQWhDLENBQVo7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsTUFBSTZGLEtBQUssR0FBR2hJLElBQUksQ0FBQytGLGFBQUwsQ0FBbUI1RSxHQUFuQixDQUFaO0FBQ0FBLEVBQUFBLEdBQUcsQ0FBQ21LLFVBQUosR0FBaUJuSyxHQUFHLENBQUNXLFNBQUosQ0FBY3dDLE1BQWQsQ0FBcUIsVUFBVUMsSUFBVixFQUFnQjtBQUNsRCxXQUFPeUQsS0FBSyxDQUFDekQsSUFBSSxHQUFHdEUsU0FBUCxHQUFtQixjQUFwQixDQUFMLEtBQTZDLEtBQXBEO0FBQ0gsR0FGZ0IsQ0FBakI7QUFHSDtBQUVEOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5RkEsU0FBU3NDLE9BQVQsQ0FBa0JxQyxPQUFsQixFQUEyQjtBQUN2QkEsRUFBQUEsT0FBTyxHQUFHQSxPQUFPLElBQUksRUFBckI7QUFFQSxNQUFJdEQsSUFBSSxHQUFHc0QsT0FBTyxDQUFDdEQsSUFBbkI7QUFDQSxNQUFJaUssSUFBSSxHQUFHM0csT0FBTztBQUFRO0FBQTFCO0FBQ0EsTUFBSWxELE1BQU0sR0FBR2tELE9BQU8sQ0FBQ2xELE1BQXJCLENBTHVCLENBT3ZCOztBQUNBLE1BQUlQLEdBQUcsR0FBR2lGLE1BQU0sQ0FBQzlFLElBQUQsRUFBT2lLLElBQVAsRUFBYTdKLE1BQWIsRUFBcUJrRCxPQUFyQixDQUFoQjs7QUFDQSxNQUFJLENBQUN0RCxJQUFMLEVBQVc7QUFDUEEsSUFBQUEsSUFBSSxHQUFHSyxFQUFFLENBQUNuQyxFQUFILENBQU0rQixZQUFOLENBQW1CSixHQUFuQixDQUFQO0FBQ0g7O0FBRURBLEVBQUFBLEdBQUcsQ0FBQ3FLLE9BQUosR0FBYyxJQUFkOztBQUNBLE1BQUlELElBQUosRUFBVTtBQUNOQSxJQUFBQSxJQUFJLENBQUNDLE9BQUwsR0FBZSxLQUFmO0FBQ0gsR0FoQnNCLENBa0J2Qjs7O0FBQ0EsTUFBSXBLLFVBQVUsR0FBR3dELE9BQU8sQ0FBQ3hELFVBQXpCOztBQUNBLE1BQUksT0FBT0EsVUFBUCxLQUFzQixVQUF0QixJQUNDbUssSUFBSSxJQUFJQSxJQUFJLENBQUN6SixTQUFMLEtBQW1CLElBRDVCLElBRUNKLE1BQU0sSUFBSUEsTUFBTSxDQUFDZSxJQUFQLENBQVksVUFBVUMsQ0FBVixFQUFhO0FBQ2hDLFdBQU9BLENBQUMsQ0FBQ1osU0FBRixLQUFnQixJQUF2QjtBQUNILEdBRlUsQ0FGZixFQUtFO0FBQ0UsUUFBSXpCLE1BQU0sSUFBSXVFLE9BQU8sQ0FBQ0ssT0FBdEIsRUFBK0I7QUFDM0J0RCxNQUFBQSxFQUFFLENBQUM4SixLQUFILENBQVMsdURBQVQ7QUFDSCxLQUZELE1BR0s7QUFDRDlLLE1BQUFBLG1CQUFtQixDQUFDRCxJQUFwQixDQUF5QjtBQUFDUyxRQUFBQSxHQUFHLEVBQUVBLEdBQU47QUFBV0UsUUFBQUEsS0FBSyxFQUFFRCxVQUFsQjtBQUE4Qk0sUUFBQUEsTUFBTSxFQUFFQTtBQUF0QyxPQUF6QjtBQUNBUCxNQUFBQSxHQUFHLENBQUNXLFNBQUosR0FBZ0JYLEdBQUcsQ0FBQ21LLFVBQUosR0FBaUIsSUFBakM7QUFDSDtBQUNKLEdBYkQsTUFjSztBQUNEOUosSUFBQUEsaUJBQWlCLENBQUNMLEdBQUQsRUFBTUcsSUFBTixFQUFZRixVQUFaLEVBQXdCbUssSUFBeEIsRUFBOEIzRyxPQUFPLENBQUNsRCxNQUF0QyxFQUE4Q2tELE9BQU8sQ0FBQ0ssT0FBdEQsQ0FBakI7QUFDSCxHQXBDc0IsQ0FzQ3ZCOzs7QUFDQSxNQUFJeUcsT0FBTyxHQUFHOUcsT0FBTyxDQUFDOEcsT0FBdEI7O0FBQ0EsTUFBSUEsT0FBSixFQUFhO0FBQ1QsUUFBSUMsY0FBSjs7QUFDQSxRQUFJdEwsTUFBSixFQUFZO0FBQ1IsV0FBS3NMLGNBQUwsSUFBdUJELE9BQXZCLEVBQWdDO0FBQzVCLFlBQUl0TCxtQkFBbUIsQ0FBQ0ssT0FBcEIsQ0FBNEJrTCxjQUE1QixNQUFnRCxDQUFDLENBQXJELEVBQXdEO0FBQ3BEaEssVUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWCxFQUFpQk4sSUFBakIsRUFBdUJxSyxjQUF2QixFQUNJQSxjQURKO0FBRUg7QUFDSjtBQUNKOztBQUNELFNBQUtBLGNBQUwsSUFBdUJELE9BQXZCLEVBQWdDO0FBQzVCdkssTUFBQUEsR0FBRyxDQUFDd0ssY0FBRCxDQUFILEdBQXNCRCxPQUFPLENBQUNDLGNBQUQsQ0FBN0I7QUFDSDtBQUNKLEdBckRzQixDQXVEdkI7OztBQUNBLE9BQUssSUFBSVgsUUFBVCxJQUFxQnBHLE9BQXJCLEVBQThCO0FBQzFCLFFBQUl6RSxlQUFlLENBQUNNLE9BQWhCLENBQXdCdUssUUFBeEIsS0FBcUMsQ0FBekMsRUFBNEM7QUFDeEM7QUFDSDs7QUFDRCxRQUFJN0MsSUFBSSxHQUFHdkQsT0FBTyxDQUFDb0csUUFBRCxDQUFsQjs7QUFDQSxRQUFJLENBQUM5SyxVQUFVLENBQUMwTCx1QkFBWCxDQUFtQ3pELElBQW5DLEVBQXlDNkMsUUFBekMsRUFBbUQxSixJQUFuRCxFQUF5REgsR0FBekQsRUFBOERvSyxJQUE5RCxDQUFMLEVBQTBFO0FBQ3RFO0FBQ0gsS0FQeUIsQ0FRMUI7OztBQUNBL0wsSUFBQUEsRUFBRSxDQUFDbUcsS0FBSCxDQUFTeEUsR0FBRyxDQUFDd0IsU0FBYixFQUF3QnFJLFFBQXhCLEVBQWtDN0MsSUFBbEMsRUFBd0MsSUFBeEMsRUFBOEMsSUFBOUM7QUFDSDs7QUFHRCxNQUFJMEQsTUFBTSxHQUFHakgsT0FBTyxDQUFDaUgsTUFBckI7O0FBQ0EsTUFBSUEsTUFBSixFQUFZO0FBQ1IsUUFBSXJNLEVBQUUsQ0FBQ2lILGNBQUgsQ0FBa0I4RSxJQUFsQixFQUF3QjVKLEVBQUUsQ0FBQzBFLFNBQTNCLENBQUosRUFBMkM7QUFDdkMxRSxNQUFBQSxFQUFFLENBQUMwRSxTQUFILENBQWF5RixvQkFBYixDQUFrQzNLLEdBQWxDLEVBQXVDMEssTUFBdkM7QUFDSCxLQUZELE1BR0ssSUFBSXhMLE1BQUosRUFBWTtBQUNic0IsTUFBQUEsRUFBRSxDQUFDMEQsTUFBSCxDQUFVLElBQVYsRUFBZ0IvRCxJQUFoQjtBQUNIO0FBQ0o7O0FBRUQsU0FBT0gsR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7QUFRQW9CLE9BQU8sQ0FBQzRDLFVBQVIsR0FBcUIsVUFBVWEsV0FBVixFQUF1QjtBQUN4QyxTQUFPQSxXQUFXLElBQ1hBLFdBQVcsQ0FBQ3BELGNBQVosQ0FBMkIsV0FBM0IsQ0FEUCxDQUR3QyxDQUVZO0FBQ3ZELENBSEQsRUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBTCxPQUFPLENBQUN3SixXQUFSLEdBQXNCLFVBQVUvSixTQUFWLEVBQXFCZ0UsV0FBckIsRUFBa0NnRyxrQkFBbEMsRUFBc0Q7QUFDeEV4TSxFQUFBQSxFQUFFLENBQUMyRyxZQUFILENBQWdCbkUsU0FBaEIsRUFBMkJnRSxXQUEzQixFQUR3RSxDQUV4RTs7QUFDQSxNQUFJM0UsS0FBSyxHQUFHMkUsV0FBVyxDQUFDbEUsU0FBWixHQUF3QmtFLFdBQVcsQ0FBQ3NGLFVBQVosR0FBeUIzSCxNQUFNLENBQUNzSSxJQUFQLENBQVlELGtCQUFaLENBQTdEO0FBQ0EsTUFBSWhFLEtBQUssR0FBR2hJLElBQUksQ0FBQytGLGFBQUwsQ0FBbUJDLFdBQW5CLENBQVo7O0FBQ0EsT0FBSyxJQUFJL0UsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0ksS0FBSyxDQUFDSCxNQUExQixFQUFrQ0QsQ0FBQyxFQUFuQyxFQUF1QztBQUNuQyxRQUFJaUwsR0FBRyxHQUFHN0ssS0FBSyxDQUFDSixDQUFELENBQWY7QUFDQStHLElBQUFBLEtBQUssQ0FBQ2tFLEdBQUcsR0FBR2pNLFNBQU4sR0FBa0IsU0FBbkIsQ0FBTCxHQUFxQyxLQUFyQztBQUNBK0gsSUFBQUEsS0FBSyxDQUFDa0UsR0FBRyxHQUFHak0sU0FBTixHQUFrQixTQUFuQixDQUFMLEdBQXFDK0wsa0JBQWtCLENBQUNFLEdBQUQsQ0FBdkQ7QUFDSDtBQUNKLENBVkQ7O0FBWUEzSixPQUFPLENBQUN2QyxJQUFSLEdBQWVBLElBQWY7QUFDQXVDLE9BQU8sQ0FBQzRKLElBQVIsR0FBZW5NLElBQUksQ0FBQ21NLElBQXBCO0FBRUE7Ozs7Ozs7QUFNQTVKLE9BQU8sQ0FBQ0MsbUJBQVIsR0FBOEIsVUFBVTRKLEtBQVYsRUFBaUI7QUFDM0MsTUFBSUMsS0FBSyxHQUFHLEVBQVo7O0FBQ0EsV0FBUztBQUNMRCxJQUFBQSxLQUFLLEdBQUc1TSxFQUFFLENBQUM4TSxRQUFILENBQVlGLEtBQVosQ0FBUjs7QUFDQSxRQUFJLENBQUNBLEtBQUwsRUFBWTtBQUNSO0FBQ0g7O0FBQ0QsUUFBSUEsS0FBSyxLQUFLekksTUFBZCxFQUFzQjtBQUNsQjBJLE1BQUFBLEtBQUssQ0FBQzNMLElBQU4sQ0FBVzBMLEtBQVg7QUFDSDtBQUNKOztBQUNELFNBQU9DLEtBQVA7QUFDSCxDQVpEOztBQWNBLElBQUlFLGNBQWMsR0FBRztBQUNqQjtBQUNBO0FBQ0FDLEVBQUFBLE9BQU8sRUFBRSxRQUhRO0FBSWpCO0FBQ0FDLEVBQUFBLEtBQUssRUFBRSxRQUxVO0FBTWpCQyxFQUFBQSxPQUFPLEVBQUUsU0FOUTtBQU9qQkMsRUFBQUEsTUFBTSxFQUFFO0FBUFMsQ0FBckI7QUFTQSxJQUFJeEosZUFBZSxHQUFHLEVBQXRCOztBQUNBLFNBQVNMLGVBQVQsQ0FBMEIzQixHQUExQixFQUErQnlMLFVBQS9CLEVBQTJDNUssU0FBM0MsRUFBc0RDLFFBQXRELEVBQWdFNEssWUFBaEUsRUFBOEU7QUFDMUUsTUFBSUMsUUFBUSxHQUFHek0sTUFBTSxHQUFHLDhCQUFILEdBQW9DLEVBQXpEO0FBRUEsTUFBSTJILEtBQUssR0FBRyxJQUFaO0FBQ0EsTUFBSStFLGNBQWMsR0FBRyxFQUFyQjs7QUFDQSxXQUFTQyxTQUFULEdBQXNCO0FBQ2xCRCxJQUFBQSxjQUFjLEdBQUc5SyxRQUFRLEdBQUdoQyxTQUE1QjtBQUNBLFdBQU8rSCxLQUFLLEdBQUdoSSxJQUFJLENBQUMrRixhQUFMLENBQW1CNUUsR0FBbkIsQ0FBZjtBQUNIOztBQUVELE1BQUs0QixTQUFTLElBQUksQ0FBQ0MsTUFBTSxDQUFDQyxTQUF0QixJQUFvQ0MsT0FBeEMsRUFBaUQ7QUFDN0NDLElBQUFBLGVBQWUsQ0FBQ2pDLE1BQWhCLEdBQXlCLENBQXpCO0FBQ0g7O0FBRUQsTUFBSXNHLElBQUksR0FBR29GLFVBQVUsQ0FBQ3BGLElBQXRCOztBQUNBLE1BQUlBLElBQUosRUFBVTtBQUNOLFFBQUl5RixhQUFhLEdBQUdWLGNBQWMsQ0FBQy9FLElBQUQsQ0FBbEM7O0FBQ0EsUUFBSXlGLGFBQUosRUFBbUI7QUFDZixPQUFDakYsS0FBSyxJQUFJZ0YsU0FBUyxFQUFuQixFQUF1QkQsY0FBYyxHQUFHLE1BQXhDLElBQWtEdkYsSUFBbEQ7O0FBQ0EsVUFBSSxDQUFFekUsU0FBUyxJQUFJLENBQUNDLE1BQU0sQ0FBQ0MsU0FBdEIsSUFBb0NDLE9BQXJDLEtBQWlELENBQUMwSixVQUFVLENBQUNNLE1BQWpFLEVBQXlFO0FBQ3JFL0osUUFBQUEsZUFBZSxDQUFDekMsSUFBaEIsQ0FBcUJWLElBQUksQ0FBQ21OLGlCQUFMLENBQXVCRixhQUF2QixFQUFzQyxRQUFRekYsSUFBOUMsQ0FBckI7QUFDSDtBQUNKLEtBTEQsTUFNSyxJQUFJQSxJQUFJLEtBQUssUUFBYixFQUF1QjtBQUN4QixVQUFJbkgsTUFBSixFQUFZO0FBQ1JzQixRQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYLEVBQWlCSSxTQUFqQixFQUE0QkMsUUFBNUI7QUFDSDtBQUNKLEtBSkksTUFLQTtBQUNELFVBQUl1RixJQUFJLEtBQUt4SCxJQUFJLENBQUNvTixVQUFsQixFQUE4QjtBQUMxQixTQUFDcEYsS0FBSyxJQUFJZ0YsU0FBUyxFQUFuQixFQUF1QkQsY0FBYyxHQUFHLE1BQXhDLElBQWtELFFBQWxEO0FBQ0EvRSxRQUFBQSxLQUFLLENBQUMrRSxjQUFjLEdBQUcsTUFBbEIsQ0FBTCxHQUFpQ3BMLEVBQUUsQ0FBQzBMLFdBQXBDO0FBQ0gsT0FIRCxNQUlLO0FBQ0QsWUFBSSxPQUFPN0YsSUFBUCxLQUFnQixRQUFwQixFQUE4QjtBQUMxQixjQUFJOUgsSUFBSSxDQUFDNE4sTUFBTCxDQUFZOUYsSUFBWixDQUFKLEVBQXVCO0FBQ25CLGFBQUNRLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBRyxNQUF4QyxJQUFrRCxNQUFsRDtBQUNBL0UsWUFBQUEsS0FBSyxDQUFDK0UsY0FBYyxHQUFHLFVBQWxCLENBQUwsR0FBcUNyTixJQUFJLENBQUM2TixPQUFMLENBQWEvRixJQUFiLENBQXJDO0FBQ0gsV0FIRCxNQUlLLElBQUluSCxNQUFKLEVBQVk7QUFDYnNCLFlBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUJJLFNBQWpCLEVBQTRCQyxRQUE1QixFQUFzQ3VGLElBQXRDO0FBQ0g7QUFDSixTQVJELE1BU0ssSUFBSSxPQUFPQSxJQUFQLEtBQWdCLFVBQXBCLEVBQWdDO0FBQ2pDLFdBQUNRLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBRyxNQUF4QyxJQUFrRCxRQUFsRDtBQUNBL0UsVUFBQUEsS0FBSyxDQUFDK0UsY0FBYyxHQUFHLE1BQWxCLENBQUwsR0FBaUN2RixJQUFqQzs7QUFDQSxjQUFJLENBQUV6RSxTQUFTLElBQUksQ0FBQ0MsTUFBTSxDQUFDQyxTQUF0QixJQUFvQ0MsT0FBckMsS0FBaUQsQ0FBQzBKLFVBQVUsQ0FBQ00sTUFBakUsRUFBeUU7QUFDckUvSixZQUFBQSxlQUFlLENBQUN6QyxJQUFoQixDQUFxQmtNLFVBQVUsQ0FBQ1ksR0FBWCxHQUFpQnhOLElBQUksQ0FBQ21OLGlCQUFMLENBQXVCLFFBQXZCLEVBQWlDLFdBQWpDLENBQWpCLEdBQWlFbk4sSUFBSSxDQUFDeU4sb0JBQUwsQ0FBMEJqRyxJQUExQixDQUF0RjtBQUNIO0FBQ0osU0FOSSxNQU9BLElBQUluSCxNQUFKLEVBQVk7QUFDYnNCLFVBQUFBLEVBQUUsQ0FBQ0MsT0FBSCxDQUFXLElBQVgsRUFBaUJJLFNBQWpCLEVBQTRCQyxRQUE1QixFQUFzQ3VGLElBQXRDO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBRUQsV0FBU2tHLGVBQVQsQ0FBMEJDLFFBQTFCLEVBQW9DQyxVQUFwQyxFQUFnRDtBQUM1QyxRQUFJRCxRQUFRLElBQUlmLFVBQWhCLEVBQTRCO0FBQ3hCLFVBQUkxSyxHQUFHLEdBQUcwSyxVQUFVLENBQUNlLFFBQUQsQ0FBcEI7O0FBQ0EsVUFBSSxPQUFPekwsR0FBUCxLQUFlMEwsVUFBbkIsRUFBK0I7QUFDM0IsU0FBQzVGLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBR1ksUUFBeEMsSUFBb0R6TCxHQUFwRDtBQUNILE9BRkQsTUFHSyxJQUFJN0IsTUFBSixFQUFZO0FBQ2JzQixRQUFBQSxFQUFFLENBQUM4SixLQUFILENBQVNxQixRQUFULEVBQW1CYSxRQUFuQixFQUE2QjNMLFNBQTdCLEVBQXdDQyxRQUF4QyxFQUFrRDJMLFVBQWxEO0FBQ0g7QUFDSjtBQUNKOztBQUVELE1BQUloQixVQUFVLENBQUNpQixVQUFmLEVBQTJCO0FBQ3ZCLFFBQUl4TixNQUFNLElBQUl3TSxZQUFkLEVBQTRCO0FBQ3hCbEwsTUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWCxFQUFpQixZQUFqQixFQUErQk4sSUFBL0IsRUFBcUNXLFFBQXJDO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsT0FBQytGLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBRyxZQUF4QyxJQUF3RCxJQUF4RDtBQUNIO0FBQ0osR0E1RXlFLENBNkUxRTs7O0FBQ0EsTUFBSTFNLE1BQUosRUFBWTtBQUNScU4sSUFBQUEsZUFBZSxDQUFDLGFBQUQsRUFBZ0IsUUFBaEIsQ0FBZjtBQUNBQSxJQUFBQSxlQUFlLENBQUMsV0FBRCxFQUFjLFNBQWQsQ0FBZjs7QUFDQSxRQUFJZCxVQUFVLENBQUNrQixRQUFmLEVBQXlCO0FBQ3JCLE9BQUM5RixLQUFLLElBQUlnRixTQUFTLEVBQW5CLEVBQXVCRCxjQUFjLEdBQUcsVUFBeEMsSUFBc0QsSUFBdEQ7QUFDSDs7QUFDRFcsSUFBQUEsZUFBZSxDQUFDLFNBQUQsRUFBWSxRQUFaLENBQWY7QUFDQUEsSUFBQUEsZUFBZSxDQUFDLE9BQUQsRUFBVSxTQUFWLENBQWY7QUFDSDs7QUFFRCxNQUFJZCxVQUFVLENBQUNZLEdBQWYsRUFBb0I7QUFDaEIsS0FBQ3hGLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBRyxnQkFBeEMsSUFBNEQsSUFBNUQ7QUFDSDs7QUFDRCxNQUFJSCxVQUFVLENBQUNtQixZQUFYLEtBQTRCLEtBQWhDLEVBQXVDO0FBQ25DLFFBQUkxTixNQUFNLElBQUl3TSxZQUFkLEVBQTRCO0FBQ3hCbEwsTUFBQUEsRUFBRSxDQUFDQyxPQUFILENBQVcsSUFBWCxFQUFpQixjQUFqQixFQUFpQ04sSUFBakMsRUFBdUNXLFFBQXZDO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsT0FBQytGLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBRyxjQUF4QyxJQUEwRCxLQUExRDtBQUNIO0FBQ0o7O0FBQ0RXLEVBQUFBLGVBQWUsQ0FBQyxzQkFBRCxFQUF5QixRQUF6QixDQUFmOztBQUVBLE1BQUkzSyxTQUFKLEVBQWU7QUFDWDJLLElBQUFBLGVBQWUsQ0FBQyxXQUFELEVBQWMsUUFBZCxDQUFmOztBQUVBLFFBQUksZ0JBQWdCZCxVQUFwQixFQUFnQztBQUM1QixPQUFDNUUsS0FBSyxJQUFJZ0YsU0FBUyxFQUFuQixFQUF1QkQsY0FBYyxHQUFHLFlBQXhDLElBQXdELENBQUMsQ0FBQ0gsVUFBVSxDQUFDb0IsVUFBckU7QUFDSDtBQUNKOztBQUVELE1BQUkzTixNQUFKLEVBQVk7QUFDUixRQUFJNE4sT0FBTyxHQUFHckIsVUFBVSxDQUFDcUIsT0FBekI7O0FBQ0EsUUFBSSxPQUFPQSxPQUFQLEtBQW1CLFdBQXZCLEVBQW9DO0FBQ2hDLFVBQUksQ0FBQ0EsT0FBTCxFQUFjO0FBQ1YsU0FBQ2pHLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBRyxTQUF4QyxJQUFxRCxLQUFyRDtBQUNILE9BRkQsTUFHSyxJQUFJLE9BQU9rQixPQUFQLEtBQW1CLFVBQXZCLEVBQW1DO0FBQ3BDLFNBQUNqRyxLQUFLLElBQUlnRixTQUFTLEVBQW5CLEVBQXVCRCxjQUFjLEdBQUcsU0FBeEMsSUFBcURrQixPQUFyRDtBQUNIO0FBQ0osS0FQRCxNQVFLO0FBQ0QsVUFBSUMsWUFBWSxHQUFJak0sUUFBUSxDQUFDa00sVUFBVCxDQUFvQixDQUFwQixNQUEyQixFQUEvQzs7QUFDQSxVQUFJRCxZQUFKLEVBQWtCO0FBQ2QsU0FBQ2xHLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBRyxTQUF4QyxJQUFxRCxLQUFyRDtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxNQUFJcUIsS0FBSyxHQUFHeEIsVUFBVSxDQUFDd0IsS0FBdkI7O0FBQ0EsTUFBSUEsS0FBSixFQUFXO0FBQ1AsUUFBSS9MLEtBQUssQ0FBQ0MsT0FBTixDQUFjOEwsS0FBZCxDQUFKLEVBQTBCO0FBQ3RCLFVBQUlBLEtBQUssQ0FBQ2xOLE1BQU4sSUFBZ0IsQ0FBcEIsRUFBdUI7QUFDbkIsU0FBQzhHLEtBQUssSUFBSWdGLFNBQVMsRUFBbkIsRUFBdUJELGNBQWMsR0FBRyxLQUF4QyxJQUFpRHFCLEtBQUssQ0FBQyxDQUFELENBQXREO0FBQ0FwRyxRQUFBQSxLQUFLLENBQUMrRSxjQUFjLEdBQUcsS0FBbEIsQ0FBTCxHQUFnQ3FCLEtBQUssQ0FBQyxDQUFELENBQXJDOztBQUNBLFlBQUlBLEtBQUssQ0FBQ2xOLE1BQU4sR0FBZSxDQUFuQixFQUFzQjtBQUNsQjhHLFVBQUFBLEtBQUssQ0FBQytFLGNBQWMsR0FBRyxNQUFsQixDQUFMLEdBQWlDcUIsS0FBSyxDQUFDLENBQUQsQ0FBdEM7QUFDSDtBQUNKLE9BTkQsTUFPSyxJQUFJL04sTUFBSixFQUFZO0FBQ2JzQixRQUFBQSxFQUFFLENBQUNDLE9BQUgsQ0FBVyxJQUFYO0FBQ0g7QUFDSixLQVhELE1BWUssSUFBSXZCLE1BQUosRUFBWTtBQUNic0IsTUFBQUEsRUFBRSxDQUFDOEosS0FBSCxDQUFTcUIsUUFBVCxFQUFtQixPQUFuQixFQUE0QjlLLFNBQTVCLEVBQXVDQyxRQUF2QyxFQUFpRCxPQUFqRDtBQUNIO0FBQ0o7O0FBQ0R5TCxFQUFBQSxlQUFlLENBQUMsS0FBRCxFQUFRLFFBQVIsQ0FBZjtBQUNBQSxFQUFBQSxlQUFlLENBQUMsS0FBRCxFQUFRLFFBQVIsQ0FBZjtBQUNBQSxFQUFBQSxlQUFlLENBQUMsTUFBRCxFQUFTLFFBQVQsQ0FBZjtBQUNIOztBQUVEL0wsRUFBRSxDQUFDbUksS0FBSCxHQUFXdkgsT0FBWDtBQUVBOEwsTUFBTSxDQUFDQyxPQUFQLEdBQWlCO0FBQ2JoTSxFQUFBQSxPQUFPLEVBQUUsaUJBQVV5QixVQUFWLEVBQXNCO0FBQzNCQSxJQUFBQSxVQUFVLEdBQUdELFVBQVUsQ0FBQ0MsVUFBRCxDQUF2QjtBQUNBLFdBQU8xQixLQUFLLENBQUNDLE9BQU4sQ0FBY3lCLFVBQWQsQ0FBUDtBQUNILEdBSlk7QUFLYndLLEVBQUFBLFVBQVUsRUFBRWhNLE9BQU8sQ0FBQ3dKLFdBTFA7QUFNYnlDLEVBQUFBLG1CQUFtQixFQUFFcEYsY0FBYyxJQUFJOUIsc0JBTjFCO0FBT2JnQixFQUFBQSxhQUFhLEVBQWJBLGFBUGE7QUFRYlgsRUFBQUEsV0FBVyxFQUFYQSxXQVJhO0FBU2I3RCxFQUFBQSxVQUFVLEVBQUVBO0FBVEMsQ0FBakI7O0FBWUEsSUFBSVosT0FBSixFQUFhO0FBQ1QxRCxFQUFBQSxFQUFFLENBQUNzRyxLQUFILENBQVN2RCxPQUFULEVBQWtCOEwsTUFBTSxDQUFDQyxPQUF6QjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsi77u/LyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG52YXIganMgPSByZXF1aXJlKCcuL2pzJyk7XG52YXIgRW51bSA9IHJlcXVpcmUoJy4vQ0NFbnVtJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG52YXIgX2lzUGxhaW5FbXB0eU9ial9ERVYgPSB1dGlscy5pc1BsYWluRW1wdHlPYmpfREVWO1xudmFyIF9jbG9uZWFibGVfREVWID0gdXRpbHMuY2xvbmVhYmxlX0RFVjtcbnZhciBBdHRyID0gcmVxdWlyZSgnLi9hdHRyaWJ1dGUnKTtcbnZhciBERUxJTUVURVIgPSBBdHRyLkRFTElNRVRFUjtcbnZhciBwcmVwcm9jZXNzID0gcmVxdWlyZSgnLi9wcmVwcm9jZXNzLWNsYXNzJyk7XG5yZXF1aXJlKCcuL3JlcXVpcmluZy1mcmFtZScpO1xuXG52YXIgQlVJTFRJTl9FTlRSSUVTID0gWyduYW1lJywgJ2V4dGVuZHMnLCAnbWl4aW5zJywgJ2N0b3InLCAnX19jdG9yX18nLCAncHJvcGVydGllcycsICdzdGF0aWNzJywgJ2VkaXRvcicsICdfX0VTNl9fJ107XG5cbnZhciBJTlZBTElEX1NUQVRJQ1NfREVWID0gQ0NfREVWICYmIFsnbmFtZScsICdfX2N0b3JzX18nLCAnX19wcm9wc19fJywgJ2FyZ3VtZW50cycsICdjYWxsJywgJ2FwcGx5JywgJ2NhbGxlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICdsZW5ndGgnLCAncHJvdG90eXBlJ107XG5cbmZ1bmN0aW9uIHB1c2hVbmlxdWUgKGFycmF5LCBpdGVtKSB7XG4gICAgaWYgKGFycmF5LmluZGV4T2YoaXRlbSkgPCAwKSB7XG4gICAgICAgIGFycmF5LnB1c2goaXRlbSk7XG4gICAgfVxufVxuXG52YXIgZGVmZXJyZWRJbml0aWFsaXplciA9IHtcblxuICAgIC8vIENvbmZpZ3MgZm9yIGNsYXNzZXMgd2hpY2ggbmVlZHMgZGVmZXJyZWQgaW5pdGlhbGl6YXRpb25cbiAgICBkYXRhczogbnVsbCxcblxuICAgIC8vIHJlZ2lzdGVyIG5ldyBjbGFzc1xuICAgIC8vIGRhdGEgLSB7Y2xzOiBjbHMsIGNiOiBwcm9wZXJ0aWVzLCBtaXhpbnM6IG9wdGlvbnMubWl4aW5zfVxuICAgIHB1c2g6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmRhdGFzKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFzLnB1c2goZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFzID0gW2RhdGFdO1xuICAgICAgICAgICAgLy8gc3RhcnQgYSBuZXcgdGltZXIgdG8gaW5pdGlhbGl6ZVxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhcyA9IHRoaXMuZGF0YXM7XG4gICAgICAgIGlmIChkYXRhcykge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZGF0YXNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGNscyA9IGRhdGEuY2xzO1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gZGF0YS5wcm9wcztcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBqcy5nZXRDbGFzc05hbWUoY2xzKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgICAgICBkZWNsYXJlUHJvcGVydGllcyhjbHMsIG5hbWUsIHByb3BlcnRpZXMsIGNscy4kc3VwZXIsIGRhdGEubWl4aW5zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzYzMywgbmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kYXRhcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBib3RoIGdldHRlciBhbmQgcHJvcCBtdXN0IHJlZ2lzdGVyIHRoZSBuYW1lIGludG8gX19wcm9wc19fIGFycmF5XG5mdW5jdGlvbiBhcHBlbmRQcm9wIChjbHMsIG5hbWUpIHtcbiAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgIC8vaWYgKCFJREVOVElGSUVSX1JFLnRlc3QobmFtZSkpIHtcbiAgICAgICAgLy8gICAgY2MuZXJyb3IoJ1RoZSBwcm9wZXJ0eSBuYW1lIFwiJyArIG5hbWUgKyAnXCIgaXMgbm90IGNvbXBsaWFudCB3aXRoIEphdmFTY3JpcHQgbmFtaW5nIHN0YW5kYXJkcycpO1xuICAgICAgICAvLyAgICByZXR1cm47XG4gICAgICAgIC8vfVxuICAgICAgICBpZiAobmFtZS5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM2MzQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1c2hVbmlxdWUoY2xzLl9fcHJvcHNfXywgbmFtZSk7XG59XG5cbmZ1bmN0aW9uIGRlZmluZVByb3AgKGNscywgY2xhc3NOYW1lLCBwcm9wTmFtZSwgdmFsLCBlczYpIHtcbiAgICB2YXIgZGVmYXVsdFZhbHVlID0gdmFsLmRlZmF1bHQ7XG5cbiAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgIGlmICghZXM2KSB7XG4gICAgICAgICAgICAvLyBjaGVjayBkZWZhdWx0IG9iamVjdCB2YWx1ZVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBkZWZhdWx0VmFsdWUgPT09ICdvYmplY3QnICYmIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgYXJyYXkgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRlZmF1bHRWYWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM2MzUsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICghX2lzUGxhaW5FbXB0eU9ial9ERVYoZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBjbG9uZWFibGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfY2xvbmVhYmxlX0RFVihkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM2MzYsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNoZWNrIGJhc2UgcHJvdG90eXBlIHRvIGF2b2lkIG5hbWUgY29sbGlzaW9uXG4gICAgICAgIGlmIChDQ0NsYXNzLmdldEluaGVyaXRhbmNlQ2hhaW4oY2xzKVxuICAgICAgICAgICAgICAgICAgIC5zb21lKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSk7IH0pKVxuICAgICAgICB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM2MzcsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzZXQgZGVmYXVsdCB2YWx1ZVxuICAgIEF0dHIuc2V0Q2xhc3NBdHRyKGNscywgcHJvcE5hbWUsICdkZWZhdWx0JywgZGVmYXVsdFZhbHVlKTtcblxuICAgIGFwcGVuZFByb3AoY2xzLCBwcm9wTmFtZSk7XG5cbiAgICAvLyBhcHBseSBhdHRyaWJ1dGVzXG4gICAgcGFyc2VBdHRyaWJ1dGVzKGNscywgdmFsLCBjbGFzc05hbWUsIHByb3BOYW1lLCBmYWxzZSk7XG4gICAgaWYgKChDQ19FRElUT1IgJiYgIUVkaXRvci5pc0J1aWxkZXIpIHx8IENDX1RFU1QpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvbkFmdGVyUHJvcHNfRVQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG9uQWZ0ZXJQcm9wc19FVFtpXShjbHMsIHByb3BOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBvbkFmdGVyUHJvcHNfRVQubGVuZ3RoID0gMDtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRlZmluZUdldFNldCAoY2xzLCBuYW1lLCBwcm9wTmFtZSwgdmFsLCBlczYpIHtcbiAgICB2YXIgZ2V0dGVyID0gdmFsLmdldDtcbiAgICB2YXIgc2V0dGVyID0gdmFsLnNldDtcbiAgICB2YXIgcHJvdG8gPSBjbHMucHJvdG90eXBlO1xuICAgIHZhciBkID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgcHJvcE5hbWUpO1xuICAgIHZhciBzZXR0ZXJVbmRlZmluZWQgPSAhZDtcblxuICAgIGlmIChnZXR0ZXIpIHtcbiAgICAgICAgaWYgKENDX0RFViAmJiAhZXM2ICYmIGQgJiYgZC5nZXQpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzYzOCwgbmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcGFyc2VBdHRyaWJ1dGVzKGNscywgdmFsLCBuYW1lLCBwcm9wTmFtZSwgdHJ1ZSk7XG4gICAgICAgIGlmICgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSB7XG4gICAgICAgICAgICBvbkFmdGVyUHJvcHNfRVQubGVuZ3RoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIEF0dHIuc2V0Q2xhc3NBdHRyKGNscywgcHJvcE5hbWUsICdzZXJpYWxpemFibGUnLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgLy8g5LiN6K665piv5ZCmIHZpc2libGUg6YO96KaB5re75Yqg5YiwIHByb3Bz77yM5ZCm5YiZIGFzc2V0IHdhdGNoZXIg5LiN6IO95q2j5bi45bel5L2cXG4gICAgICAgICAgICBhcHBlbmRQcm9wKGNscywgcHJvcE5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFlczYpIHtcbiAgICAgICAgICAgIGpzLmdldChwcm90bywgcHJvcE5hbWUsIGdldHRlciwgc2V0dGVyVW5kZWZpbmVkLCBzZXR0ZXJVbmRlZmluZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENDX0VESVRPUiB8fCBDQ19ERVYpIHtcbiAgICAgICAgICAgIEF0dHIuc2V0Q2xhc3NBdHRyKGNscywgcHJvcE5hbWUsICdoYXNHZXR0ZXInLCB0cnVlKTsgLy8g5pa55L6/IGVkaXRvciDlgZrliKTmlq1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzZXR0ZXIpIHtcbiAgICAgICAgaWYgKCFlczYpIHtcbiAgICAgICAgICAgIGlmIChDQ19ERVYgJiYgZCAmJiBkLnNldCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYy5lcnJvcklEKDM2NDAsIG5hbWUsIHByb3BOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGpzLnNldChwcm90bywgcHJvcE5hbWUsIHNldHRlciwgc2V0dGVyVW5kZWZpbmVkLCBzZXR0ZXJVbmRlZmluZWQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChDQ19FRElUT1IgfHwgQ0NfREVWKSB7XG4gICAgICAgICAgICBBdHRyLnNldENsYXNzQXR0cihjbHMsIHByb3BOYW1lLCAnaGFzU2V0dGVyJywgdHJ1ZSk7IC8vIOaWueS+vyBlZGl0b3Ig5YGa5Yik5patXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHQgKGRlZmF1bHRWYWwpIHtcbiAgICBpZiAodHlwZW9mIGRlZmF1bHRWYWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjYy5fdGhyb3coZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRWYWw7XG59XG5cbmZ1bmN0aW9uIG1peGluV2l0aEluaGVyaXRlZCAoZGVzdCwgc3JjLCBmaWx0ZXIpIHtcbiAgICBmb3IgKHZhciBwcm9wIGluIHNyYykge1xuICAgICAgICBpZiAoIWRlc3QuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgKCFmaWx0ZXIgfHwgZmlsdGVyKHByb3ApKSkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlc3QsIHByb3AsIGpzLmdldFByb3BlcnR5RGVzY3JpcHRvcihzcmMsIHByb3ApKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZG9EZWZpbmUgKGNsYXNzTmFtZSwgYmFzZUNsYXNzLCBtaXhpbnMsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2hvdWxkQWRkUHJvdG9DdG9yO1xuICAgIHZhciBfX2N0b3JfXyA9IG9wdGlvbnMuX19jdG9yX187XG4gICAgdmFyIGN0b3IgPSBvcHRpb25zLmN0b3I7XG4gICAgdmFyIF9fZXM2X18gPSBvcHRpb25zLl9fRVM2X187XG5cbiAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgIC8vIGNoZWNrIGN0b3JcbiAgICAgICAgdmFyIGN0b3JUb1VzZSA9IF9fY3Rvcl9fIHx8IGN0b3I7XG4gICAgICAgIGlmIChjdG9yVG9Vc2UpIHtcbiAgICAgICAgICAgIGlmIChDQ0NsYXNzLl9pc0NDQ2xhc3MoY3RvclRvVXNlKSkge1xuICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoMzYxOCwgY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjdG9yVG9Vc2UgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM2MTksIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYmFzZUNsYXNzICYmIC9cXGJwcm90b3R5cGUuY3RvclxcYi8udGVzdChjdG9yVG9Vc2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfX2VzNl9fKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM2NTEsIGNsYXNzTmFtZSB8fCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjAwLCBjbGFzc05hbWUgfHwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG91bGRBZGRQcm90b0N0b3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGN0b3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoX19jdG9yX18pIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjQ5LCBjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3RvciA9IG9wdGlvbnMuY3RvciA9IF92YWxpZGF0ZUN0b3JfREVWKGN0b3IsIGJhc2VDbGFzcywgY2xhc3NOYW1lLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY3RvcnM7XG4gICAgdmFyIGZpcmVDbGFzcztcbiAgICBpZiAoX19lczZfXykge1xuICAgICAgICBjdG9ycyA9IFtjdG9yXTtcbiAgICAgICAgZmlyZUNsYXNzID0gY3RvcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGN0b3JzID0gX19jdG9yX18gPyBbX19jdG9yX19dIDogX2dldEFsbEN0b3JzKGJhc2VDbGFzcywgbWl4aW5zLCBvcHRpb25zKTtcbiAgICAgICAgZmlyZUNsYXNzID0gX2NyZWF0ZUN0b3IoY3RvcnMsIGJhc2VDbGFzcywgY2xhc3NOYW1lLCBvcHRpb25zKTtcblxuICAgICAgICAvLyBleHRlbmQgLSBDcmVhdGUgYSBuZXcgQ2xhc3MgdGhhdCBpbmhlcml0cyBmcm9tIHRoaXMgQ2xhc3NcbiAgICAgICAganMudmFsdWUoZmlyZUNsYXNzLCAnZXh0ZW5kJywgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZXh0ZW5kcyA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gQ0NDbGFzcyhvcHRpb25zKTtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAganMudmFsdWUoZmlyZUNsYXNzLCAnX19jdG9yc19fJywgY3RvcnMubGVuZ3RoID4gMCA/IGN0b3JzIDogbnVsbCwgdHJ1ZSk7XG5cblxuICAgIHZhciBwcm90b3R5cGUgPSBmaXJlQ2xhc3MucHJvdG90eXBlO1xuICAgIGlmIChiYXNlQ2xhc3MpIHtcbiAgICAgICAgaWYgKCFfX2VzNl9fKSB7XG4gICAgICAgICAgICBqcy5leHRlbmQoZmlyZUNsYXNzLCBiYXNlQ2xhc3MpOyAgICAgICAgLy8g6L+Z6YeM5Lya5oqK54i257G755qEIF9fcHJvcHNfXyDlpI3liLbnu5nlrZDnsbtcbiAgICAgICAgICAgIHByb3RvdHlwZSA9IGZpcmVDbGFzcy5wcm90b3R5cGU7ICAgICAgICAvLyBnZXQgZXh0ZW5kZWQgcHJvdG90eXBlXG4gICAgICAgIH1cbiAgICAgICAgZmlyZUNsYXNzLiRzdXBlciA9IGJhc2VDbGFzcztcbiAgICAgICAgaWYgKENDX0RFViAmJiBzaG91bGRBZGRQcm90b0N0b3IpIHtcbiAgICAgICAgICAgIHByb3RvdHlwZS5jdG9yID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWl4aW5zKSB7XG4gICAgICAgIGZvciAodmFyIG0gPSBtaXhpbnMubGVuZ3RoIC0gMTsgbSA+PSAwOyBtLS0pIHtcbiAgICAgICAgICAgIHZhciBtaXhpbiA9IG1peGluc1ttXTtcbiAgICAgICAgICAgIG1peGluV2l0aEluaGVyaXRlZChwcm90b3R5cGUsIG1peGluLnByb3RvdHlwZSk7XG5cbiAgICAgICAgICAgIC8vIG1peGluIHN0YXRpY3MgKHRoaXMgd2lsbCBhbHNvIGNvcHkgZWRpdG9yIGF0dHJpYnV0ZXMgZm9yIGNvbXBvbmVudClcbiAgICAgICAgICAgIG1peGluV2l0aEluaGVyaXRlZChmaXJlQ2xhc3MsIG1peGluLCBmdW5jdGlvbiAocHJvcCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtaXhpbi5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiAoIUNDX0RFViB8fCBJTlZBTElEX1NUQVRJQ1NfREVWLmluZGV4T2YocHJvcCkgPCAwKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBtaXhpbiBhdHRyaWJ1dGVzXG4gICAgICAgICAgICBpZiAoQ0NDbGFzcy5faXNDQ0NsYXNzKG1peGluKSkge1xuICAgICAgICAgICAgICAgIG1peGluV2l0aEluaGVyaXRlZChBdHRyLmdldENsYXNzQXR0cnMoZmlyZUNsYXNzKSwgQXR0ci5nZXRDbGFzc0F0dHJzKG1peGluKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVzdG9yZSBjb25zdHVjdG9yIG92ZXJyaWRkZW4gYnkgbWl4aW5cbiAgICAgICAgcHJvdG90eXBlLmNvbnN0cnVjdG9yID0gZmlyZUNsYXNzO1xuICAgIH1cblxuICAgIGlmICghX19lczZfXykge1xuICAgICAgICBwcm90b3R5cGUuX19pbml0UHJvcHNfXyA9IGNvbXBpbGVQcm9wcztcbiAgICB9XG5cbiAgICBqcy5zZXRDbGFzc05hbWUoY2xhc3NOYW1lLCBmaXJlQ2xhc3MpO1xuICAgIHJldHVybiBmaXJlQ2xhc3M7XG59XG5cbmZ1bmN0aW9uIGRlZmluZSAoY2xhc3NOYW1lLCBiYXNlQ2xhc3MsIG1peGlucywgb3B0aW9ucykge1xuICAgIHZhciBDb21wb25lbnQgPSBjYy5Db21wb25lbnQ7XG4gICAgdmFyIGZyYW1lID0gY2MuX1JGLnBlZWsoKTtcbiAgICBpZiAoZnJhbWUgJiYganMuaXNDaGlsZENsYXNzT2YoYmFzZUNsYXNzLCBDb21wb25lbnQpKSB7XG4gICAgICAgIC8vIHByb2plY3QgY29tcG9uZW50XG4gICAgICAgIGlmIChqcy5pc0NoaWxkQ2xhc3NPZihmcmFtZS5jbHMsIENvbXBvbmVudCkpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoMzYxNSk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQ0NfREVWICYmIGZyYW1lLnV1aWQgJiYgY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoMzYxNiwgY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUgfHwgZnJhbWUuc2NyaXB0O1xuICAgIH1cblxuICAgIHZhciBjbHMgPSBkb0RlZmluZShjbGFzc05hbWUsIGJhc2VDbGFzcywgbWl4aW5zLCBvcHRpb25zKTtcblxuICAgIGlmIChmcmFtZSkge1xuICAgICAgICBpZiAoanMuaXNDaGlsZENsYXNzT2YoYmFzZUNsYXNzLCBDb21wb25lbnQpKSB7XG4gICAgICAgICAgICB2YXIgdXVpZCA9IGZyYW1lLnV1aWQ7XG4gICAgICAgICAgICBpZiAodXVpZCkge1xuICAgICAgICAgICAgICAgIGpzLl9zZXRDbGFzc0lkKHV1aWQsIGNscyk7XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICBDb21wb25lbnQuX2FkZE1lbnVJdGVtKGNscywgJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5zY3JpcHRzLycgKyBjbGFzc05hbWUsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgY2xzLnByb3RvdHlwZS5fX3NjcmlwdFV1aWQgPSBFZGl0b3IuVXRpbHMuVXVpZFV0aWxzLmRlY29tcHJlc3NVdWlkKHV1aWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZyYW1lLmNscyA9IGNscztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghanMuaXNDaGlsZENsYXNzT2YoZnJhbWUuY2xzLCBDb21wb25lbnQpKSB7XG4gICAgICAgICAgICBmcmFtZS5jbHMgPSBjbHM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNscztcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQ2xhc3NOYW1lX0RFViAoY2xhc3NOYW1lKSB7XG4gICAgdmFyIERlZmF1bHROYW1lID0gJ0NDQ2xhc3MnO1xuICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLnJlcGxhY2UoL15bXiRBLVphLXpfXS8sICdfJykucmVwbGFjZSgvW14wLTlBLVphLXpfJF0vZywgJ18nKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIHZhbGlkYXRlIG5hbWVcbiAgICAgICAgICAgIEZ1bmN0aW9uKCdmdW5jdGlvbiAnICsgY2xhc3NOYW1lICsgJygpe30nKSgpO1xuICAgICAgICAgICAgcmV0dXJuIGNsYXNzTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBEZWZhdWx0TmFtZTtcbn1cblxuZnVuY3Rpb24gZ2V0TmV3VmFsdWVUeXBlQ29kZUppdCAodmFsdWUpIHtcbiAgICB2YXIgY2xzTmFtZSA9IGpzLmdldENsYXNzTmFtZSh2YWx1ZSk7XG4gICAgdmFyIHR5cGUgPSB2YWx1ZS5jb25zdHJ1Y3RvcjtcbiAgICB2YXIgcmVzID0gJ25ldyAnICsgY2xzTmFtZSArICcoJztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR5cGUuX19wcm9wc19fLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwcm9wID0gdHlwZS5fX3Byb3BzX19baV07XG4gICAgICAgIHZhciBwcm9wVmFsID0gdmFsdWVbcHJvcF07XG4gICAgICAgIGlmIChDQ19ERVYgJiYgdHlwZW9mIHByb3BWYWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjYy5lcnJvcklEKDM2NDEsIGNsc05hbWUpO1xuICAgICAgICAgICAgcmV0dXJuICduZXcgJyArIGNsc05hbWUgKyAnKCknO1xuICAgICAgICB9XG4gICAgICAgIHJlcyArPSBwcm9wVmFsO1xuICAgICAgICBpZiAoaSA8IHR5cGUuX19wcm9wc19fLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIHJlcyArPSAnLCc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcyArICcpJztcbn1cblxuLy8gVE9ETyAtIG1vdmUgZXNjYXBlRm9ySlMsIElERU5USUZJRVJfUkUsIGdldE5ld1ZhbHVlVHlwZUNvZGVKaXQgdG8gbWlzYy5qcyBvciBhIG5ldyBzb3VyY2UgZmlsZVxuXG4vLyBjb252ZXJ0IGEgbm9ybWFsIHN0cmluZyBpbmNsdWRpbmcgbmV3bGluZXMsIHF1b3RlcyBhbmQgdW5pY29kZSBjaGFyYWN0ZXJzIGludG8gYSBzdHJpbmcgbGl0ZXJhbFxuLy8gcmVhZHkgdG8gdXNlIGluIEphdmFTY3JpcHQgc291cmNlXG5mdW5jdGlvbiBlc2NhcGVGb3JKUyAocykge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzKS5cbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0pTT04vc3RyaW5naWZ5XG4gICAgICAgIHJlcGxhY2UoL1xcdTIwMjgvZywgJ1xcXFx1MjAyOCcpLlxuICAgICAgICByZXBsYWNlKC9cXHUyMDI5L2csICdcXFxcdTIwMjknKTtcbn1cblxuZnVuY3Rpb24gZ2V0SW5pdFByb3BzSml0IChhdHRycywgcHJvcExpc3QpIHtcbiAgICAvLyBmdW5jdGlvbnMgZm9yIGdlbmVyYXRlZCBjb2RlXG4gICAgdmFyIEYgPSBbXTtcbiAgICB2YXIgZnVuYyA9ICcnO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcHJvcCA9IHByb3BMaXN0W2ldO1xuICAgICAgICB2YXIgYXR0cktleSA9IHByb3AgKyBERUxJTUVURVIgKyAnZGVmYXVsdCc7XG4gICAgICAgIGlmIChhdHRyS2V5IGluIGF0dHJzKSB7ICAvLyBnZXR0ZXIgZG9lcyBub3QgaGF2ZSBkZWZhdWx0XG4gICAgICAgICAgICB2YXIgc3RhdGVtZW50O1xuICAgICAgICAgICAgaWYgKElERU5USUZJRVJfUkUudGVzdChwcm9wKSkge1xuICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9ICd0aGlzLicgKyBwcm9wICsgJz0nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gJ3RoaXNbJyArIGVzY2FwZUZvckpTKHByb3ApICsgJ109JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBleHByZXNzaW9uO1xuICAgICAgICAgICAgdmFyIGRlZiA9IGF0dHJzW2F0dHJLZXldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkZWYgPT09ICdvYmplY3QnICYmIGRlZikge1xuICAgICAgICAgICAgICAgIGlmIChkZWYgaW5zdGFuY2VvZiBjYy5WYWx1ZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGdldE5ld1ZhbHVlVHlwZUNvZGVKaXQoZGVmKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkZWYpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSAnW10nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9ICd7fSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IEYubGVuZ3RoO1xuICAgICAgICAgICAgICAgIEYucHVzaChkZWYpO1xuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSAnRlsnICsgaW5kZXggKyAnXSgpJztcbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIGZ1bmMgKz0gJ3RyeSB7XFxuJyArIHN0YXRlbWVudCArIGV4cHJlc3Npb24gKyAnO1xcbn1cXG5jYXRjaChlKSB7XFxuY2MuX3Rocm93KGUpO1xcbicgKyBzdGF0ZW1lbnQgKyAndW5kZWZpbmVkO1xcbn1cXG4nO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGVmID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBlc2NhcGVGb3JKUyhkZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbnVtYmVyLCBib29sZWFuLCBudWxsLCB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uID0gZGVmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhdGVtZW50ID0gc3RhdGVtZW50ICsgZXhwcmVzc2lvbiArICc7XFxuJztcbiAgICAgICAgICAgIGZ1bmMgKz0gc3RhdGVtZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgKENDX1RFU1QgJiYgIWlzUGhhbnRvbUpTKSB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGZ1bmMpO1xuICAgIC8vIH1cblxuICAgIHZhciBpbml0UHJvcHM7XG4gICAgaWYgKEYubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGluaXRQcm9wcyA9IEZ1bmN0aW9uKGZ1bmMpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaW5pdFByb3BzID0gRnVuY3Rpb24oJ0YnLCAncmV0dXJuIChmdW5jdGlvbigpe1xcbicgKyBmdW5jICsgJ30pJykoRik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGluaXRQcm9wcztcbn1cblxuZnVuY3Rpb24gZ2V0SW5pdFByb3BzIChhdHRycywgcHJvcExpc3QpIHtcbiAgICB2YXIgYWR2YW5jZWRQcm9wcyA9IFtdO1xuICAgIHZhciBhZHZhbmNlZFZhbHVlcyA9IFtdO1xuICAgIHZhciBzaW1wbGVQcm9wcyA9IFtdO1xuICAgIHZhciBzaW1wbGVWYWx1ZXMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcExpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHByb3AgPSBwcm9wTGlzdFtpXTtcbiAgICAgICAgdmFyIGF0dHJLZXkgPSBwcm9wICsgREVMSU1FVEVSICsgJ2RlZmF1bHQnO1xuICAgICAgICBpZiAoYXR0cktleSBpbiBhdHRycykgeyAvLyBnZXR0ZXIgZG9lcyBub3QgaGF2ZSBkZWZhdWx0XG4gICAgICAgICAgICB2YXIgZGVmID0gYXR0cnNbYXR0cktleV07XG4gICAgICAgICAgICBpZiAoKHR5cGVvZiBkZWYgPT09ICdvYmplY3QnICYmIGRlZikgfHwgdHlwZW9mIGRlZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGFkdmFuY2VkUHJvcHMucHVzaChwcm9wKTtcbiAgICAgICAgICAgICAgICBhZHZhbmNlZFZhbHVlcy5wdXNoKGRlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBudW1iZXIsIGJvb2xlYW4sIG51bGwsIHVuZGVmaW5lZCwgc3RyaW5nXG4gICAgICAgICAgICAgICAgc2ltcGxlUHJvcHMucHVzaChwcm9wKTtcbiAgICAgICAgICAgICAgICBzaW1wbGVWYWx1ZXMucHVzaChkZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaW1wbGVQcm9wcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdGhpc1tzaW1wbGVQcm9wc1tpXV0gPSBzaW1wbGVWYWx1ZXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZHZhbmNlZFByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcHJvcCA9IGFkdmFuY2VkUHJvcHNbaV07XG4gICAgICAgICAgICB2YXIgZXhwcmVzc2lvbjtcbiAgICAgICAgICAgIHZhciBkZWYgPSBhZHZhbmNlZFZhbHVlc1tpXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVmID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGlmIChkZWYgaW5zdGFuY2VvZiBjYy5WYWx1ZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGRlZi5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGRlZikpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IHt9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZiBpcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSBkZWYoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5fdGhyb3coZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbiA9IGRlZigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXNbcHJvcF0gPSBleHByZXNzaW9uO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuLy8gc2ltcGxlIHRlc3QgdmFyaWFibGUgbmFtZVxudmFyIElERU5USUZJRVJfUkUgPSAvXltBLVphLXpfJF1bMC05QS1aYS16XyRdKiQvO1xuZnVuY3Rpb24gY29tcGlsZVByb3BzIChhY3R1YWxDbGFzcykge1xuICAgIC8vIGluaXQgZGVmZXJyZWQgcHJvcGVydGllc1xuICAgIHZhciBhdHRycyA9IEF0dHIuZ2V0Q2xhc3NBdHRycyhhY3R1YWxDbGFzcyk7XG4gICAgdmFyIHByb3BMaXN0ID0gYWN0dWFsQ2xhc3MuX19wcm9wc19fO1xuICAgIGlmIChwcm9wTGlzdCA9PT0gbnVsbCkge1xuICAgICAgICBkZWZlcnJlZEluaXRpYWxpemVyLmluaXQoKTtcbiAgICAgICAgcHJvcExpc3QgPSBhY3R1YWxDbGFzcy5fX3Byb3BzX187XG4gICAgfVxuXG4gICAgLy8gT3ZlcndpdGUgX19pbml0UHJvcHNfXyB0byBhdm9pZCBjb21waWxlIGFnYWluLlxuICAgIHZhciBpbml0UHJvcHMgPSBDQ19TVVBQT1JUX0pJVCA/IGdldEluaXRQcm9wc0ppdChhdHRycywgcHJvcExpc3QpIDogZ2V0SW5pdFByb3BzKGF0dHJzLCBwcm9wTGlzdCk7XG4gICAgYWN0dWFsQ2xhc3MucHJvdG90eXBlLl9faW5pdFByb3BzX18gPSBpbml0UHJvcHM7XG5cbiAgICAvLyBjYWxsIGluc3RhbnRpYXRlUHJvcHMgaW1tZWRpYXRlbHksIG5vIG5lZWQgdG8gcGFzcyBhY3R1YWxDbGFzcyBpbnRvIGl0IGFueW1vcmVcbiAgICAvLyAodXNlIGNhbGwgdG8gbWFudWFsbHkgYmluZCBgdGhpc2AgYmVjYXVzZSBgdGhpc2AgbWF5IG5vdCBpbnN0YW5jZW9mIGFjdHVhbENsYXNzKVxuICAgIGluaXRQcm9wcy5jYWxsKHRoaXMpO1xufVxuXG52YXIgX2NyZWF0ZUN0b3IgPSBDQ19TVVBQT1JUX0pJVCA/IGZ1bmN0aW9uIChjdG9ycywgYmFzZUNsYXNzLCBjbGFzc05hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgc3VwZXJDYWxsQm91bmRlZCA9IGJhc2VDbGFzcyAmJiBib3VuZFN1cGVyQ2FsbHMoYmFzZUNsYXNzLCBvcHRpb25zLCBjbGFzc05hbWUpO1xuXG4gICAgdmFyIGN0b3JOYW1lID0gQ0NfREVWID8gbm9ybWFsaXplQ2xhc3NOYW1lX0RFVihjbGFzc05hbWUpIDogJ0NDQ2xhc3MnO1xuICAgIHZhciBib2R5ID0gJ3JldHVybiBmdW5jdGlvbiAnICsgY3Rvck5hbWUgKyAnKCl7XFxuJztcblxuICAgIGlmIChzdXBlckNhbGxCb3VuZGVkKSB7XG4gICAgICAgIGJvZHkgKz0gJ3RoaXMuX3N1cGVyPW51bGw7XFxuJztcbiAgICB9XG5cbiAgICAvLyBpbnN0YW50aWF0ZSBwcm9wc1xuICAgIGJvZHkgKz0gJ3RoaXMuX19pbml0UHJvcHNfXygnICsgY3Rvck5hbWUgKyAnKTtcXG4nO1xuXG4gICAgLy8gY2FsbCB1c2VyIGNvbnN0cnVjdG9yc1xuICAgIHZhciBjdG9yTGVuID0gY3RvcnMubGVuZ3RoO1xuICAgIGlmIChjdG9yTGVuID4gMCkge1xuICAgICAgICB2YXIgdXNlVHJ5Q2F0Y2ggPSBDQ19ERVYgJiYgISAoY2xhc3NOYW1lICYmIGNsYXNzTmFtZS5zdGFydHNXaXRoKCdjYy4nKSk7XG4gICAgICAgIGlmICh1c2VUcnlDYXRjaCkge1xuICAgICAgICAgICAgYm9keSArPSAndHJ5e1xcbic7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIFNOSVBQRVQgPSAnXS5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XFxuJztcbiAgICAgICAgaWYgKGN0b3JMZW4gPT09IDEpIHtcbiAgICAgICAgICAgIGJvZHkgKz0gY3Rvck5hbWUgKyAnLl9fY3RvcnNfX1swJyArIFNOSVBQRVQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBib2R5ICs9ICd2YXIgY3M9JyArIGN0b3JOYW1lICsgJy5fX2N0b3JzX187XFxuJztcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY3RvckxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYm9keSArPSAnY3NbJyArIGkgKyBTTklQUEVUO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh1c2VUcnlDYXRjaCkge1xuICAgICAgICAgICAgYm9keSArPSAnfWNhdGNoKGUpe1xcbicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2NjLl90aHJvdyhlKTtcXG4nICtcbiAgICAgICAgICAgICAgICAgICAgJ31cXG4nO1xuICAgICAgICB9XG4gICAgfVxuICAgIGJvZHkgKz0gJ30nO1xuXG4gICAgcmV0dXJuIEZ1bmN0aW9uKGJvZHkpKCk7XG59IDogZnVuY3Rpb24gKGN0b3JzLCBiYXNlQ2xhc3MsIGNsYXNzTmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBzdXBlckNhbGxCb3VuZGVkID0gYmFzZUNsYXNzICYmIGJvdW5kU3VwZXJDYWxscyhiYXNlQ2xhc3MsIG9wdGlvbnMsIGNsYXNzTmFtZSk7XG4gICAgdmFyIGN0b3JMZW4gPSBjdG9ycy5sZW5ndGg7XG5cbiAgICB2YXIgQ2xhc3M7XG5cbiAgICBpZiAoY3RvckxlbiA+IDApIHtcbiAgICAgICAgaWYgKHN1cGVyQ2FsbEJvdW5kZWQpIHtcbiAgICAgICAgICAgIGlmIChjdG9yTGVuID09PSAyKSB7XG4gICAgICAgICAgICAgICAgLy8gVXNlciBDb21wb25lbnRcbiAgICAgICAgICAgICAgICBDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9faW5pdFByb3BzX18oQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICBjdG9yc1swXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICBjdG9yc1sxXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3VwZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9faW5pdFByb3BzX18oQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0b3JzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdG9yc1tpXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjdG9yTGVuID09PSAzKSB7XG4gICAgICAgICAgICAgICAgLy8gTm9kZVxuICAgICAgICAgICAgICAgIENsYXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9faW5pdFByb3BzX18oQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICBjdG9yc1swXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICBjdG9yc1sxXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICBjdG9yc1syXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBDbGFzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2luaXRQcm9wc19fKENsYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN0b3JzID0gQ2xhc3MuX19jdG9yc19fO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN0b3JzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdG9yc1tpXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoc3VwZXJDYWxsQm91bmRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX19pbml0UHJvcHNfXyhDbGFzcyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBDbGFzcztcbn07XG5cbmZ1bmN0aW9uIF92YWxpZGF0ZUN0b3JfREVWIChjdG9yLCBiYXNlQ2xhc3MsIGNsYXNzTmFtZSwgb3B0aW9ucykge1xuICAgIGlmIChDQ19FRElUT1IgJiYgYmFzZUNsYXNzKSB7XG4gICAgICAgIC8vIGNoZWNrIHN1cGVyIGNhbGwgaW4gY29uc3RydWN0b3JcbiAgICAgICAgdmFyIG9yaWdpbkN0b3IgPSBjdG9yO1xuICAgICAgICBpZiAoU3VwZXJDYWxsUmVnLnRlc3QoY3RvcikpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLl9fRVM2X18pIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM2NTEsIGNsYXNzTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYwMCwgY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBzdXBwcmVzc3Mgc3VwZXIgY2FsbFxuICAgICAgICAgICAgICAgIGN0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSBvcmlnaW5DdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgY3RvclxuICAgIGlmIChjdG9yLmxlbmd0aCA+IDAgJiYgKCFjbGFzc05hbWUgfHwgIWNsYXNzTmFtZS5zdGFydHNXaXRoKCdjYy4nKSkpIHtcbiAgICAgICAgLy8gVG8gbWFrZSBhIHVuaWZpZWQgQ0NDbGFzcyBzZXJpYWxpemF0aW9uIHByb2Nlc3MsXG4gICAgICAgIC8vIHdlIGRvbid0IGFsbG93IHBhcmFtZXRlcnMgZm9yIGNvbnN0cnVjdG9yIHdoZW4gY3JlYXRpbmcgaW5zdGFuY2VzIG9mIENDQ2xhc3MuXG4gICAgICAgIC8vIEZvciBhZHZhbmNlZCB1c2VyLCBjb25zdHJ1Y3QgYXJndW1lbnRzIGNhbiBzdGlsbCBnZXQgZnJvbSAnYXJndW1lbnRzJy5cbiAgICAgICAgY2Mud2FybklEKDM2MTcsIGNsYXNzTmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN0b3I7XG59XG5cbmZ1bmN0aW9uIF9nZXRBbGxDdG9ycyAoYmFzZUNsYXNzLCBtaXhpbnMsIG9wdGlvbnMpIHtcbiAgICAvLyBnZXQgYmFzZSB1c2VyIGNvbnN0cnVjdG9yc1xuICAgIGZ1bmN0aW9uIGdldEN0b3JzIChjbHMpIHtcbiAgICAgICAgaWYgKENDQ2xhc3MuX2lzQ0NDbGFzcyhjbHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gY2xzLl9fY3RvcnNfXyB8fCBbXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbY2xzXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjdG9ycyA9IFtdO1xuICAgIC8vIGlmIChvcHRpb25zLl9fRVM2X18pIHtcbiAgICAvLyAgICAgaWYgKG1peGlucykge1xuICAgIC8vICAgICAgICAgbGV0IGJhc2VPck1peGlucyA9IGdldEN0b3JzKGJhc2VDbGFzcyk7XG4gICAgLy8gICAgICAgICBmb3IgKGxldCBiID0gMDsgYiA8IG1peGlucy5sZW5ndGg7IGIrKykge1xuICAgIC8vICAgICAgICAgICAgIGxldCBtaXhpbiA9IG1peGluc1tiXTtcbiAgICAvLyAgICAgICAgICAgICBpZiAobWl4aW4pIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgbGV0IGJhc2VDdG9ycyA9IGdldEN0b3JzKG1peGluKTtcbiAgICAvLyAgICAgICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBiYXNlQ3RvcnMubGVuZ3RoOyBjKyspIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGlmIChiYXNlT3JNaXhpbnMuaW5kZXhPZihiYXNlQ3RvcnNbY10pIDwgMCkge1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hVbmlxdWUoY3RvcnMsIGJhc2VDdG9yc1tjXSk7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG4gICAgLy8gZWxzZSB7XG4gICAgbGV0IGJhc2VPck1peGlucyA9IFtiYXNlQ2xhc3NdLmNvbmNhdChtaXhpbnMpO1xuICAgIGZvciAobGV0IGIgPSAwOyBiIDwgYmFzZU9yTWl4aW5zLmxlbmd0aDsgYisrKSB7XG4gICAgICAgIGxldCBiYXNlT3JNaXhpbiA9IGJhc2VPck1peGluc1tiXTtcbiAgICAgICAgaWYgKGJhc2VPck1peGluKSB7XG4gICAgICAgICAgICBsZXQgYmFzZUN0b3JzID0gZ2V0Q3RvcnMoYmFzZU9yTWl4aW4pO1xuICAgICAgICAgICAgZm9yIChsZXQgYyA9IDA7IGMgPCBiYXNlQ3RvcnMubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICBwdXNoVW5pcXVlKGN0b3JzLCBiYXNlQ3RvcnNbY10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIH1cblxuICAgIC8vIGFwcGVuZCBzdWJjbGFzcyB1c2VyIGNvbnN0cnVjdG9yc1xuICAgIHZhciBjdG9yID0gb3B0aW9ucy5jdG9yO1xuICAgIGlmIChjdG9yKSB7XG4gICAgICAgIGN0b3JzLnB1c2goY3Rvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN0b3JzO1xufVxuXG52YXIgU3VwZXJDYWxsUmVnID0gL3h5ei8udGVzdChmdW5jdGlvbigpe3h5en0pID8gL1xcYlxcLl9zdXBlclxcYi8gOiAvLiovO1xudmFyIFN1cGVyQ2FsbFJlZ1N0cmljdCA9IC94eXovLnRlc3QoZnVuY3Rpb24oKXt4eXp9KSA/IC90aGlzXFwuX3N1cGVyXFxzKlxcKC8gOiAvKE5PTkUpezk5fS87XG5mdW5jdGlvbiBib3VuZFN1cGVyQ2FsbHMgKGJhc2VDbGFzcywgb3B0aW9ucywgY2xhc3NOYW1lKSB7XG4gICAgdmFyIGhhc1N1cGVyQ2FsbCA9IGZhbHNlO1xuICAgIGZvciAodmFyIGZ1bmNOYW1lIGluIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKEJVSUxUSU5fRU5UUklFUy5pbmRleE9mKGZ1bmNOYW1lKSA+PSAwKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZnVuYyA9IG9wdGlvbnNbZnVuY05hbWVdO1xuICAgICAgICBpZiAodHlwZW9mIGZ1bmMgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwZCA9IGpzLmdldFByb3BlcnR5RGVzY3JpcHRvcihiYXNlQ2xhc3MucHJvdG90eXBlLCBmdW5jTmFtZSk7XG4gICAgICAgIGlmIChwZCkge1xuICAgICAgICAgICAgdmFyIHN1cGVyRnVuYyA9IHBkLnZhbHVlO1xuICAgICAgICAgICAgLy8gaWdub3JlIHBkLmdldCwgYXNzdW1lIHRoYXQgZnVuY3Rpb24gZGVmaW5lZCBieSBnZXR0ZXIgaXMganVzdCBmb3Igd2FybmluZ3NcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3VwZXJGdW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgaWYgKFN1cGVyQ2FsbFJlZy50ZXN0KGZ1bmMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc1N1cGVyQ2FsbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJvdW5kU3VwZXJDYWxsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbZnVuY05hbWVdID0gKGZ1bmN0aW9uIChzdXBlckZ1bmMsIGZ1bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRtcCA9IHRoaXMuX3N1cGVyO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGEgbmV3IC5fc3VwZXIoKSBtZXRob2QgdGhhdCBpcyB0aGUgc2FtZSBtZXRob2QgYnV0IG9uIHRoZSBzdXBlci1DbGFzc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gc3VwZXJGdW5jO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJldCA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBtZXRob2Qgb25seSBuZWVkIHRvIGJlIGJvdW5kIHRlbXBvcmFyaWx5LCBzbyB3ZSByZW1vdmUgaXQgd2hlbiB3ZSdyZSBkb25lIGV4ZWN1dGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1cGVyID0gdG1wO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0pKHN1cGVyRnVuYywgZnVuYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChDQ19ERVYgJiYgU3VwZXJDYWxsUmVnU3RyaWN0LnRlc3QoZnVuYykpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCgzNjIwLCBjbGFzc05hbWUsIGZ1bmNOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzU3VwZXJDYWxsO1xufVxuXG5mdW5jdGlvbiBkZWNsYXJlUHJvcGVydGllcyAoY2xzLCBjbGFzc05hbWUsIHByb3BlcnRpZXMsIGJhc2VDbGFzcywgbWl4aW5zLCBlczYpIHtcbiAgICBjbHMuX19wcm9wc19fID0gW107XG5cbiAgICBpZiAoYmFzZUNsYXNzICYmIGJhc2VDbGFzcy5fX3Byb3BzX18pIHtcbiAgICAgICAgY2xzLl9fcHJvcHNfXyA9IGJhc2VDbGFzcy5fX3Byb3BzX18uc2xpY2UoKTtcbiAgICB9XG5cbiAgICBpZiAobWl4aW5zKSB7XG4gICAgICAgIGZvciAodmFyIG0gPSAwOyBtIDwgbWl4aW5zLmxlbmd0aDsgKyttKSB7XG4gICAgICAgICAgICB2YXIgbWl4aW4gPSBtaXhpbnNbbV07XG4gICAgICAgICAgICBpZiAobWl4aW4uX19wcm9wc19fKSB7XG4gICAgICAgICAgICAgICAgY2xzLl9fcHJvcHNfXyA9IGNscy5fX3Byb3BzX18uY29uY2F0KG1peGluLl9fcHJvcHNfXy5maWx0ZXIoZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNscy5fX3Byb3BzX18uaW5kZXhPZih4KSA8IDA7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgICAgLy8g6aKE5aSE55CG5bGe5oCnXG4gICAgICAgIHByZXByb2Nlc3MucHJlcHJvY2Vzc0F0dHJzKHByb3BlcnRpZXMsIGNsYXNzTmFtZSwgY2xzLCBlczYpO1xuXG4gICAgICAgIGZvciAodmFyIHByb3BOYW1lIGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBwcm9wZXJ0aWVzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIGlmICgnZGVmYXVsdCcgaW4gdmFsKSB7XG4gICAgICAgICAgICAgICAgZGVmaW5lUHJvcChjbHMsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHZhbCwgZXM2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlZmluZUdldFNldChjbHMsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIHZhbCwgZXM2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhdHRycyA9IEF0dHIuZ2V0Q2xhc3NBdHRycyhjbHMpO1xuICAgIGNscy5fX3ZhbHVlc19fID0gY2xzLl9fcHJvcHNfXy5maWx0ZXIoZnVuY3Rpb24gKHByb3ApIHtcbiAgICAgICAgcmV0dXJuIGF0dHJzW3Byb3AgKyBERUxJTUVURVIgKyAnc2VyaWFsaXphYmxlJ10gIT09IGZhbHNlO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKipcbiAqICEjZW4gRGVmaW5lcyBhIENDQ2xhc3MgdXNpbmcgdGhlIGdpdmVuIHNwZWNpZmljYXRpb24sIHBsZWFzZSBzZWUgW0NsYXNzXSgvZG9jcy9lZGl0b3JzX2FuZF90b29scy9jcmVhdG9yLWNoYXB0ZXJzL3NjcmlwdGluZy9jbGFzcy5odG1sKSBmb3IgZGV0YWlscy5cbiAqICEjemgg5a6a5LmJ5LiA5LiqIENDQ2xhc3PvvIzkvKDlhaXlj4LmlbDlv4XpobvmmK/kuIDkuKrljIXlkKvnsbvlnovlj4LmlbDnmoTlrZfpnaLph4/lr7nosaHvvIzlhbfkvZPnlKjms5Xor7fmn6XpmIVb57G75Z6L5a6a5LmJXSgvZG9jcy9jcmVhdG9yL3NjcmlwdGluZy9jbGFzcy5odG1sKeOAglxuICpcbiAqIEBtZXRob2QgQ2xhc3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZV0gLSBUaGUgY2xhc3MgbmFtZSB1c2VkIGZvciBzZXJpYWxpemF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuZXh0ZW5kc10gLSBUaGUgYmFzZSBjbGFzcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmN0b3JdIC0gVGhlIGNvbnN0cnVjdG9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuX19jdG9yX19dIC0gVGhlIHNhbWUgYXMgY3RvciwgYnV0IGxlc3MgZW5jYXBzdWxhdGVkLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnByb3BlcnRpZXNdIC0gVGhlIHByb3BlcnR5IGRlZmluaXRpb25zLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnN0YXRpY3NdIC0gVGhlIHN0YXRpYyBtZW1iZXJzLlxuICogQHBhcmFtIHtGdW5jdGlvbltdfSBbb3B0aW9ucy5taXhpbnNdXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmVkaXRvcl0gLSBhdHRyaWJ1dGVzIGZvciBDb21wb25lbnQgbGlzdGVkIGJlbG93LlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5lZGl0b3IuZXhlY3V0ZUluRWRpdE1vZGU9ZmFsc2VdIC0gQWxsb3dzIHRoZSBjdXJyZW50IGNvbXBvbmVudCB0byBydW4gaW4gZWRpdCBtb2RlLiBCeSBkZWZhdWx0LCBhbGwgY29tcG9uZW50cyBhcmUgZXhlY3V0ZWQgb25seSBhdCBydW50aW1lLCBtZWFuaW5nIHRoYXQgdGhleSB3aWxsIG5vdCBoYXZlIHRoZWlyIGNhbGxiYWNrIGZ1bmN0aW9ucyBleGVjdXRlZCB3aGlsZSB0aGUgRWRpdG9yIGlzIGluIGVkaXQgbW9kZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmVkaXRvci5yZXF1aXJlQ29tcG9uZW50XSAtIEF1dG9tYXRpY2FsbHkgYWRkIHJlcXVpcmVkIGNvbXBvbmVudCBhcyBhIGRlcGVuZGVuY3kuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZWRpdG9yLm1lbnVdIC0gVGhlIG1lbnUgcGF0aCB0byByZWdpc3RlciBhIGNvbXBvbmVudCB0byB0aGUgZWRpdG9ycyBcIkNvbXBvbmVudFwiIG1lbnUuIEVnLiBcIlJlbmRlcmluZy9DYW1lcmFcIi5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5lZGl0b3IuZXhlY3V0aW9uT3JkZXI9MF0gLSBUaGUgZXhlY3V0aW9uIG9yZGVyIG9mIGxpZmVjeWNsZSBtZXRob2RzIGZvciBDb21wb25lbnQuIFRob3NlIGxlc3MgdGhhbiAwIHdpbGwgZXhlY3V0ZSBiZWZvcmUgd2hpbGUgdGhvc2UgZ3JlYXRlciB0aGFuIDAgd2lsbCBleGVjdXRlIGFmdGVyLiBUaGUgb3JkZXIgd2lsbCBvbmx5IGFmZmVjdCBvbkxvYWQsIG9uRW5hYmxlLCBzdGFydCwgdXBkYXRlIGFuZCBsYXRlVXBkYXRlIHdoaWxlIG9uRGlzYWJsZSBhbmQgb25EZXN0cm95IHdpbGwgbm90IGJlIGFmZmVjdGVkLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5lZGl0b3IuZGlzYWxsb3dNdWx0aXBsZV0gLSBJZiBzcGVjaWZpZWQgdG8gYSB0eXBlLCBwcmV2ZW50cyBDb21wb25lbnQgb2YgdGhlIHNhbWUgdHlwZSAob3Igc3VidHlwZSkgdG8gYmUgYWRkZWQgbW9yZSB0aGFuIG9uY2UgdG8gYSBOb2RlLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5lZGl0b3IucGxheU9uRm9jdXM9ZmFsc2VdIC0gVGhpcyBwcm9wZXJ0eSBpcyBvbmx5IGF2YWlsYWJsZSB3aGVuIGV4ZWN1dGVJbkVkaXRNb2RlIGlzIHNldC4gSWYgc3BlY2lmaWVkLCB0aGUgZWRpdG9yJ3Mgc2NlbmUgdmlldyB3aWxsIGtlZXAgdXBkYXRpbmcgdGhpcyBub2RlIGluIDYwIGZwcyB3aGVuIGl0IGlzIHNlbGVjdGVkLCBvdGhlcndpc2UsIGl0IHdpbGwgdXBkYXRlIG9ubHkgaWYgbmVjZXNzYXJ5LlxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmVkaXRvci5pbnNwZWN0b3JdIC0gQ3VzdG9taXplIHRoZSBwYWdlIHVybCB1c2VkIGJ5IHRoZSBjdXJyZW50IGNvbXBvbmVudCB0byByZW5kZXIgaW4gdGhlIFByb3BlcnRpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZWRpdG9yLmljb25dIC0gQ3VzdG9taXplIHRoZSBpY29uIHRoYXQgdGhlIGN1cnJlbnQgY29tcG9uZW50IGRpc3BsYXlzIGluIHRoZSBlZGl0b3IuXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZWRpdG9yLmhlbHBdIC0gVGhlIGN1c3RvbSBkb2N1bWVudGF0aW9uIFVSTFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnVwZGF0ZV0gLSBsaWZlY3ljbGUgbWV0aG9kIGZvciBDb21wb25lbnQsIHNlZSB7eyNjcm9zc0xpbmsgXCJDb21wb25lbnQvdXBkYXRlOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMubGF0ZVVwZGF0ZV0gLSBsaWZlY3ljbGUgbWV0aG9kIGZvciBDb21wb25lbnQsIHNlZSB7eyNjcm9zc0xpbmsgXCJDb21wb25lbnQvbGF0ZVVwZGF0ZTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uTG9hZF0gLSBsaWZlY3ljbGUgbWV0aG9kIGZvciBDb21wb25lbnQsIHNlZSB7eyNjcm9zc0xpbmsgXCJDb21wb25lbnQvb25Mb2FkOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMuc3RhcnRdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L3N0YXJ0Om1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25FbmFibGVdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L29uRW5hYmxlOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25EaXNhYmxlXSAtIGxpZmVjeWNsZSBtZXRob2QgZm9yIENvbXBvbmVudCwgc2VlIHt7I2Nyb3NzTGluayBcIkNvbXBvbmVudC9vbkRpc2FibGU6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vbkRlc3Ryb3ldIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L29uRGVzdHJveTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLm9uRm9jdXNJbkVkaXRvcl0gLSBsaWZlY3ljbGUgbWV0aG9kIGZvciBDb21wb25lbnQsIHNlZSB7eyNjcm9zc0xpbmsgXCJDb21wb25lbnQvb25Gb2N1c0luRWRpdG9yOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdGlvbnMub25Mb3N0Rm9jdXNJbkVkaXRvcl0gLSBsaWZlY3ljbGUgbWV0aG9kIGZvciBDb21wb25lbnQsIHNlZSB7eyNjcm9zc0xpbmsgXCJDb21wb25lbnQvb25Mb3N0Rm9jdXNJbkVkaXRvcjptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnJlc2V0SW5FZGl0b3JdIC0gbGlmZWN5Y2xlIG1ldGhvZCBmb3IgQ29tcG9uZW50LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L3Jlc2V0SW5FZGl0b3I6bWV0aG9kXCJ9fXt7L2Nyb3NzTGlua319XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0aW9ucy5vblJlc3RvcmVdIC0gZm9yIENvbXBvbmVudCBvbmx5LCBzZWUge3sjY3Jvc3NMaW5rIFwiQ29tcG9uZW50L29uUmVzdG9yZTptZXRob2RcIn19e3svY3Jvc3NMaW5rfX1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLl9nZXRMb2NhbEJvdW5kc10gLSBmb3IgQ29tcG9uZW50IG9ubHksIHNlZSB7eyNjcm9zc0xpbmsgXCJDb21wb25lbnQvX2dldExvY2FsQm91bmRzOm1ldGhvZFwifX17ey9jcm9zc0xpbmt9fVxuICpcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIHRoZSBjcmVhdGVkIGNsYXNzXG4gKlxuICogQGV4YW1wbGVcblxuIC8vIGRlZmluZSBiYXNlIGNsYXNzXG4gdmFyIE5vZGUgPSBjYy5DbGFzcygpO1xuXG4gLy8gZGVmaW5lIHN1YiBjbGFzc1xuIHZhciBTcHJpdGUgPSBjYy5DbGFzcyh7XG4gICAgIG5hbWU6ICdTcHJpdGUnLFxuICAgICBleHRlbmRzOiBOb2RlLFxuXG4gICAgIGN0b3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgIHRoaXMudXJsID0gXCJcIjtcbiAgICAgICAgIHRoaXMuaWQgPSAwO1xuICAgICB9LFxuXG4gICAgIHN0YXRpY3M6IHtcbiAgICAgICAgIC8vIGRlZmluZSBzdGF0aWMgbWVtYmVyc1xuICAgICAgICAgY291bnQ6IDAsXG4gICAgICAgICBnZXRCb3VuZHM6IGZ1bmN0aW9uIChzcHJpdGVMaXN0KSB7XG4gICAgICAgICAgICAgLy8gY29tcHV0ZSBib3VuZHMuLi5cbiAgICAgICAgIH1cbiAgICAgfSxcblxuICAgICBwcm9wZXJ0aWVzIHtcbiAgICAgICAgIHdpZHRoOiB7XG4gICAgICAgICAgICAgZGVmYXVsdDogMTI4LFxuICAgICAgICAgICAgIHR5cGU6IGNjLkludGVnZXIsXG4gICAgICAgICAgICAgdG9vbHRpcDogJ1RoZSB3aWR0aCBvZiBzcHJpdGUnXG4gICAgICAgICB9LFxuICAgICAgICAgaGVpZ2h0OiAxMjgsXG4gICAgICAgICBzaXplOiB7XG4gICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiBjYy52Mih0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICB9LFxuXG4gICAgIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgIC8vIGxvYWQgdGhpcy51cmwuLi5cbiAgICAgfTtcbiB9KTtcblxuIC8vIGluc3RhbnRpYXRlXG5cbiB2YXIgb2JqID0gbmV3IFNwcml0ZSgpO1xuIG9iai51cmwgPSAnc3ByaXRlLnBuZyc7XG4gb2JqLmxvYWQoKTtcbiAqL1xuZnVuY3Rpb24gQ0NDbGFzcyAob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIG5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdmFyIGJhc2UgPSBvcHRpb25zLmV4dGVuZHMvKiB8fCBDQ09iamVjdCovO1xuICAgIHZhciBtaXhpbnMgPSBvcHRpb25zLm1peGlucztcblxuICAgIC8vIGNyZWF0ZSBjb25zdHJ1Y3RvclxuICAgIHZhciBjbHMgPSBkZWZpbmUobmFtZSwgYmFzZSwgbWl4aW5zLCBvcHRpb25zKTtcbiAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgbmFtZSA9IGNjLmpzLmdldENsYXNzTmFtZShjbHMpO1xuICAgIH1cblxuICAgIGNscy5fc2VhbGVkID0gdHJ1ZTtcbiAgICBpZiAoYmFzZSkge1xuICAgICAgICBiYXNlLl9zZWFsZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBkZWZpbmUgUHJvcGVydGllc1xuICAgIHZhciBwcm9wZXJ0aWVzID0gb3B0aW9ucy5wcm9wZXJ0aWVzO1xuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyA9PT0gJ2Z1bmN0aW9uJyB8fFxuICAgICAgICAoYmFzZSAmJiBiYXNlLl9fcHJvcHNfXyA9PT0gbnVsbCkgfHxcbiAgICAgICAgKG1peGlucyAmJiBtaXhpbnMuc29tZShmdW5jdGlvbiAoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHguX19wcm9wc19fID09PSBudWxsO1xuICAgICAgICB9KSlcbiAgICApIHtcbiAgICAgICAgaWYgKENDX0RFViAmJiBvcHRpb25zLl9fRVM2X18pIHtcbiAgICAgICAgICAgIGNjLmVycm9yKCdub3QgeWV0IGltcGxlbWVudCBkZWZlcnJlZCBwcm9wZXJ0aWVzIGZvciBFUzYgQ2xhc3NlcycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZGVmZXJyZWRJbml0aWFsaXplci5wdXNoKHtjbHM6IGNscywgcHJvcHM6IHByb3BlcnRpZXMsIG1peGluczogbWl4aW5zfSk7XG4gICAgICAgICAgICBjbHMuX19wcm9wc19fID0gY2xzLl9fdmFsdWVzX18gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkZWNsYXJlUHJvcGVydGllcyhjbHMsIG5hbWUsIHByb3BlcnRpZXMsIGJhc2UsIG9wdGlvbnMubWl4aW5zLCBvcHRpb25zLl9fRVM2X18pO1xuICAgIH1cblxuICAgIC8vIGRlZmluZSBzdGF0aWNzXG4gICAgdmFyIHN0YXRpY3MgPSBvcHRpb25zLnN0YXRpY3M7XG4gICAgaWYgKHN0YXRpY3MpIHtcbiAgICAgICAgdmFyIHN0YXRpY1Byb3BOYW1lO1xuICAgICAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICBmb3IgKHN0YXRpY1Byb3BOYW1lIGluIHN0YXRpY3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoSU5WQUxJRF9TVEFUSUNTX0RFVi5pbmRleE9mKHN0YXRpY1Byb3BOYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjQyLCBuYW1lLCBzdGF0aWNQcm9wTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRpY1Byb3BOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChzdGF0aWNQcm9wTmFtZSBpbiBzdGF0aWNzKSB7XG4gICAgICAgICAgICBjbHNbc3RhdGljUHJvcE5hbWVdID0gc3RhdGljc1tzdGF0aWNQcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkZWZpbmUgZnVuY3Rpb25zXG4gICAgZm9yICh2YXIgZnVuY05hbWUgaW4gb3B0aW9ucykge1xuICAgICAgICBpZiAoQlVJTFRJTl9FTlRSSUVTLmluZGV4T2YoZnVuY05hbWUpID49IDApIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmdW5jID0gb3B0aW9uc1tmdW5jTmFtZV07XG4gICAgICAgIGlmICghcHJlcHJvY2Vzcy52YWxpZGF0ZU1ldGhvZFdpdGhQcm9wcyhmdW5jLCBmdW5jTmFtZSwgbmFtZSwgY2xzLCBiYXNlKSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdXNlIHZhbHVlIHRvIHJlZGVmaW5lIHNvbWUgc3VwZXIgbWV0aG9kIGRlZmluZWQgYXMgZ2V0dGVyXG4gICAgICAgIGpzLnZhbHVlKGNscy5wcm90b3R5cGUsIGZ1bmNOYW1lLCBmdW5jLCB0cnVlLCB0cnVlKTtcbiAgICB9XG5cblxuICAgIHZhciBlZGl0b3IgPSBvcHRpb25zLmVkaXRvcjtcbiAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgIGlmIChqcy5pc0NoaWxkQ2xhc3NPZihiYXNlLCBjYy5Db21wb25lbnQpKSB7XG4gICAgICAgICAgICBjYy5Db21wb25lbnQuX3JlZ2lzdGVyRWRpdG9yUHJvcHMoY2xzLCBlZGl0b3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgY2Mud2FybklEKDM2MjMsIG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNscztcbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciB0aGUgY29uc3RydWN0b3IgaXMgY3JlYXRlZCBieSBjYy5DbGFzc1xuICpcbiAqIEBtZXRob2QgX2lzQ0NDbGFzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gY29uc3RydWN0b3JcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAcHJpdmF0ZVxuICovXG5DQ0NsYXNzLl9pc0NDQ2xhc3MgPSBmdW5jdGlvbiAoY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gY29uc3RydWN0b3IgJiZcbiAgICAgICAgICAgY29uc3RydWN0b3IuaGFzT3duUHJvcGVydHkoJ19fY3RvcnNfXycpOyAgICAgLy8gaXMgbm90IGluaGVyaXRlZCBfX2N0b3JzX19cbn07XG5cbi8vXG4vLyBPcHRpbWl6ZWQgZGVmaW5lIGZ1bmN0aW9uIG9ubHkgZm9yIGludGVybmFsIGNsYXNzZXNcbi8vXG4vLyBAbWV0aG9kIF9mYXN0RGVmaW5lXG4vLyBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lXG4vLyBAcGFyYW0ge0Z1bmN0aW9ufSBjb25zdHJ1Y3RvclxuLy8gQHBhcmFtIHtPYmplY3R9IHNlcmlhbGl6YWJsZUZpZWxkc1xuLy8gQHByaXZhdGVcbi8vXG5DQ0NsYXNzLl9mYXN0RGVmaW5lID0gZnVuY3Rpb24gKGNsYXNzTmFtZSwgY29uc3RydWN0b3IsIHNlcmlhbGl6YWJsZUZpZWxkcykge1xuICAgIGpzLnNldENsYXNzTmFtZShjbGFzc05hbWUsIGNvbnN0cnVjdG9yKTtcbiAgICAvL2NvbnN0cnVjdG9yLl9fY3RvcnNfXyA9IGNvbnN0cnVjdG9yLl9fY3RvcnNfXyB8fCBudWxsO1xuICAgIHZhciBwcm9wcyA9IGNvbnN0cnVjdG9yLl9fcHJvcHNfXyA9IGNvbnN0cnVjdG9yLl9fdmFsdWVzX18gPSBPYmplY3Qua2V5cyhzZXJpYWxpemFibGVGaWVsZHMpO1xuICAgIHZhciBhdHRycyA9IEF0dHIuZ2V0Q2xhc3NBdHRycyhjb25zdHJ1Y3Rvcik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0gcHJvcHNbaV07XG4gICAgICAgIGF0dHJzW2tleSArIERFTElNRVRFUiArICd2aXNpYmxlJ10gPSBmYWxzZTtcbiAgICAgICAgYXR0cnNba2V5ICsgREVMSU1FVEVSICsgJ2RlZmF1bHQnXSA9IHNlcmlhbGl6YWJsZUZpZWxkc1trZXldO1xuICAgIH1cbn07XG5cbkNDQ2xhc3MuQXR0ciA9IEF0dHI7XG5DQ0NsYXNzLmF0dHIgPSBBdHRyLmF0dHI7XG5cbi8qXG4gKiBSZXR1cm4gYWxsIHN1cGVyIGNsYXNzZXNcbiAqIEBtZXRob2QgZ2V0SW5oZXJpdGFuY2VDaGFpblxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29uc3RydWN0b3JcbiAqIEByZXR1cm4ge0Z1bmN0aW9uW119XG4gKi9cbkNDQ2xhc3MuZ2V0SW5oZXJpdGFuY2VDaGFpbiA9IGZ1bmN0aW9uIChrbGFzcykge1xuICAgIHZhciBjaGFpbiA9IFtdO1xuICAgIGZvciAoOzspIHtcbiAgICAgICAga2xhc3MgPSBqcy5nZXRTdXBlcihrbGFzcyk7XG4gICAgICAgIGlmICgha2xhc3MpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrbGFzcyAhPT0gT2JqZWN0KSB7XG4gICAgICAgICAgICBjaGFpbi5wdXNoKGtsYXNzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2hhaW47XG59O1xuXG52YXIgUHJpbWl0aXZlVHlwZXMgPSB7XG4gICAgLy8gU3BlY2lmeSB0aGF0IHRoZSBpbnB1dCB2YWx1ZSBtdXN0IGJlIGludGVnZXIgaW4gUHJvcGVydGllcy5cbiAgICAvLyBBbHNvIHVzZWQgdG8gaW5kaWNhdGVzIHRoYXQgdGhlIHR5cGUgb2YgZWxlbWVudHMgaW4gYXJyYXkgb3IgdGhlIHR5cGUgb2YgdmFsdWUgaW4gZGljdGlvbmFyeSBpcyBpbnRlZ2VyLlxuICAgIEludGVnZXI6ICdOdW1iZXInLFxuICAgIC8vIEluZGljYXRlcyB0aGF0IHRoZSB0eXBlIG9mIGVsZW1lbnRzIGluIGFycmF5IG9yIHRoZSB0eXBlIG9mIHZhbHVlIGluIGRpY3Rpb25hcnkgaXMgZG91YmxlLlxuICAgIEZsb2F0OiAnTnVtYmVyJyxcbiAgICBCb29sZWFuOiAnQm9vbGVhbicsXG4gICAgU3RyaW5nOiAnU3RyaW5nJyxcbn07XG52YXIgb25BZnRlclByb3BzX0VUID0gW107XG5mdW5jdGlvbiBwYXJzZUF0dHJpYnV0ZXMgKGNscywgYXR0cmlidXRlcywgY2xhc3NOYW1lLCBwcm9wTmFtZSwgdXNlZEluR2V0dGVyKSB7XG4gICAgdmFyIEVSUl9UeXBlID0gQ0NfREVWID8gJ1RoZSAlcyBvZiAlcyBtdXN0IGJlIHR5cGUgJXMnIDogJyc7XG5cbiAgICB2YXIgYXR0cnMgPSBudWxsO1xuICAgIHZhciBwcm9wTmFtZVByZWZpeCA9ICcnO1xuICAgIGZ1bmN0aW9uIGluaXRBdHRycyAoKSB7XG4gICAgICAgIHByb3BOYW1lUHJlZml4ID0gcHJvcE5hbWUgKyBERUxJTUVURVI7XG4gICAgICAgIHJldHVybiBhdHRycyA9IEF0dHIuZ2V0Q2xhc3NBdHRycyhjbHMpO1xuICAgIH1cblxuICAgIGlmICgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSB7XG4gICAgICAgIG9uQWZ0ZXJQcm9wc19FVC5sZW5ndGggPSAwO1xuICAgIH1cblxuICAgIHZhciB0eXBlID0gYXR0cmlidXRlcy50eXBlO1xuICAgIGlmICh0eXBlKSB7XG4gICAgICAgIHZhciBwcmltaXRpdmVUeXBlID0gUHJpbWl0aXZlVHlwZXNbdHlwZV07XG4gICAgICAgIGlmIChwcmltaXRpdmVUeXBlKSB7XG4gICAgICAgICAgICAoYXR0cnMgfHwgaW5pdEF0dHJzKCkpW3Byb3BOYW1lUHJlZml4ICsgJ3R5cGUnXSA9IHR5cGU7XG4gICAgICAgICAgICBpZiAoKChDQ19FRElUT1IgJiYgIUVkaXRvci5pc0J1aWxkZXIpIHx8IENDX1RFU1QpICYmICFhdHRyaWJ1dGVzLl9zaG9ydCkge1xuICAgICAgICAgICAgICAgIG9uQWZ0ZXJQcm9wc19FVC5wdXNoKEF0dHIuZ2V0VHlwZUNoZWNrZXJfRVQocHJpbWl0aXZlVHlwZSwgJ2NjLicgKyB0eXBlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ09iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDM2NDQsIGNsYXNzTmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09IEF0dHIuU2NyaXB0VXVpZCkge1xuICAgICAgICAgICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyAndHlwZSddID0gJ1NjcmlwdCc7XG4gICAgICAgICAgICAgICAgYXR0cnNbcHJvcE5hbWVQcmVmaXggKyAnY3RvciddID0gY2MuU2NyaXB0QXNzZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChFbnVtLmlzRW51bSh0eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICd0eXBlJ10gPSAnRW51bSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyc1twcm9wTmFtZVByZWZpeCArICdlbnVtTGlzdCddID0gRW51bS5nZXRMaXN0KHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKENDX0RFVikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjQ1LCBjbGFzc05hbWUsIHByb3BOYW1lLCB0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAoYXR0cnMgfHwgaW5pdEF0dHJzKCkpW3Byb3BOYW1lUHJlZml4ICsgJ3R5cGUnXSA9ICdPYmplY3QnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyc1twcm9wTmFtZVByZWZpeCArICdjdG9yJ10gPSB0eXBlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKChDQ19FRElUT1IgJiYgIUVkaXRvci5pc0J1aWxkZXIpIHx8IENDX1RFU1QpICYmICFhdHRyaWJ1dGVzLl9zaG9ydCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb25BZnRlclByb3BzX0VULnB1c2goYXR0cmlidXRlcy51cmwgPyBBdHRyLmdldFR5cGVDaGVja2VyX0VUKCdTdHJpbmcnLCAnY2MuU3RyaW5nJykgOiBBdHRyLmdldE9ialR5cGVDaGVja2VyX0VUKHR5cGUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjQ2LCBjbGFzc05hbWUsIHByb3BOYW1lLCB0eXBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVNpbXBsZUF0dHIgKGF0dHJOYW1lLCBleHBlY3RUeXBlKSB7XG4gICAgICAgIGlmIChhdHRyTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gYXR0cmlidXRlc1thdHRyTmFtZV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gZXhwZWN0VHlwZSkge1xuICAgICAgICAgICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyBhdHRyTmFtZV0gPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgICAgICBjYy5lcnJvcihFUlJfVHlwZSwgYXR0ck5hbWUsIGNsYXNzTmFtZSwgcHJvcE5hbWUsIGV4cGVjdFR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGF0dHJpYnV0ZXMuZWRpdG9yT25seSkge1xuICAgICAgICBpZiAoQ0NfREVWICYmIHVzZWRJbkdldHRlcikge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjEzLCBcImVkaXRvck9ubHlcIiwgbmFtZSwgcHJvcE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICdlZGl0b3JPbmx5J10gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vcGFyc2VTaW1wbGVBdHRyKCdwcmV2ZW50RGVmZXJyZWRMb2FkJywgJ2Jvb2xlYW4nKTtcbiAgICBpZiAoQ0NfREVWKSB7XG4gICAgICAgIHBhcnNlU2ltcGxlQXR0cignZGlzcGxheU5hbWUnLCAnc3RyaW5nJyk7XG4gICAgICAgIHBhcnNlU2ltcGxlQXR0cignbXVsdGlsaW5lJywgJ2Jvb2xlYW4nKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIChhdHRycyB8fCBpbml0QXR0cnMoKSlbcHJvcE5hbWVQcmVmaXggKyAncmVhZG9ubHknXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcGFyc2VTaW1wbGVBdHRyKCd0b29sdGlwJywgJ3N0cmluZycpO1xuICAgICAgICBwYXJzZVNpbXBsZUF0dHIoJ3NsaWRlJywgJ2Jvb2xlYW4nKTtcbiAgICB9XG5cbiAgICBpZiAoYXR0cmlidXRlcy51cmwpIHtcbiAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICdzYXZlVXJsQXNBc3NldCddID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGF0dHJpYnV0ZXMuc2VyaWFsaXphYmxlID09PSBmYWxzZSkge1xuICAgICAgICBpZiAoQ0NfREVWICYmIHVzZWRJbkdldHRlcikge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjEzLCBcInNlcmlhbGl6YWJsZVwiLCBuYW1lLCBwcm9wTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAoYXR0cnMgfHwgaW5pdEF0dHJzKCkpW3Byb3BOYW1lUHJlZml4ICsgJ3NlcmlhbGl6YWJsZSddID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGFyc2VTaW1wbGVBdHRyKCdmb3JtZXJseVNlcmlhbGl6ZWRBcycsICdzdHJpbmcnKTtcblxuICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgcGFyc2VTaW1wbGVBdHRyKCdub3RpZnlGb3InLCAnc3RyaW5nJyk7XG5cbiAgICAgICAgaWYgKCdhbmltYXRhYmxlJyBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICAoYXR0cnMgfHwgaW5pdEF0dHJzKCkpW3Byb3BOYW1lUHJlZml4ICsgJ2FuaW1hdGFibGUnXSA9ICEhYXR0cmlidXRlcy5hbmltYXRhYmxlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKENDX0RFVikge1xuICAgICAgICB2YXIgdmlzaWJsZSA9IGF0dHJpYnV0ZXMudmlzaWJsZTtcbiAgICAgICAgaWYgKHR5cGVvZiB2aXNpYmxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWYgKCF2aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICd2aXNpYmxlJ10gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2aXNpYmxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICd2aXNpYmxlJ10gPSB2aXNpYmxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHN0YXJ0c1dpdGhVUyA9IChwcm9wTmFtZS5jaGFyQ29kZUF0KDApID09PSA5NSk7XG4gICAgICAgICAgICBpZiAoc3RhcnRzV2l0aFVTKSB7XG4gICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICd2aXNpYmxlJ10gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciByYW5nZSA9IGF0dHJpYnV0ZXMucmFuZ2U7XG4gICAgaWYgKHJhbmdlKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHJhbmdlKSkge1xuICAgICAgICAgICAgaWYgKHJhbmdlLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgKGF0dHJzIHx8IGluaXRBdHRycygpKVtwcm9wTmFtZVByZWZpeCArICdtaW4nXSA9IHJhbmdlWzBdO1xuICAgICAgICAgICAgICAgIGF0dHJzW3Byb3BOYW1lUHJlZml4ICsgJ21heCddID0gcmFuZ2VbMV07XG4gICAgICAgICAgICAgICAgaWYgKHJhbmdlLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cnNbcHJvcE5hbWVQcmVmaXggKyAnc3RlcCddID0gcmFuZ2VbMl07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoQ0NfREVWKSB7XG4gICAgICAgICAgICAgICAgY2MuZXJyb3JJRCgzNjQ3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgIGNjLmVycm9yKEVSUl9UeXBlLCAncmFuZ2UnLCBjbGFzc05hbWUsIHByb3BOYW1lLCAnYXJyYXknKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwYXJzZVNpbXBsZUF0dHIoJ21pbicsICdudW1iZXInKTtcbiAgICBwYXJzZVNpbXBsZUF0dHIoJ21heCcsICdudW1iZXInKTtcbiAgICBwYXJzZVNpbXBsZUF0dHIoJ3N0ZXAnLCAnbnVtYmVyJyk7XG59XG5cbmNjLkNsYXNzID0gQ0NDbGFzcztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaXNBcnJheTogZnVuY3Rpb24gKGRlZmF1bHRWYWwpIHtcbiAgICAgICAgZGVmYXVsdFZhbCA9IGdldERlZmF1bHQoZGVmYXVsdFZhbCk7XG4gICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGRlZmF1bHRWYWwpO1xuICAgIH0sXG4gICAgZmFzdERlZmluZTogQ0NDbGFzcy5fZmFzdERlZmluZSxcbiAgICBnZXROZXdWYWx1ZVR5cGVDb2RlOiBDQ19TVVBQT1JUX0pJVCAmJiBnZXROZXdWYWx1ZVR5cGVDb2RlSml0LFxuICAgIElERU5USUZJRVJfUkUsXG4gICAgZXNjYXBlRm9ySlMsXG4gICAgZ2V0RGVmYXVsdDogZ2V0RGVmYXVsdFxufTtcblxuaWYgKENDX1RFU1QpIHtcbiAgICBqcy5taXhpbihDQ0NsYXNzLCBtb2R1bGUuZXhwb3J0cyk7XG59XG4iXX0=