
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/attribute.js';
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

var isPlainEmptyObj = require('./utils').isPlainEmptyObj_DEV;

var DELIMETER = '$_$';

function createAttrsSingle(owner, superAttrs) {
  var attrs = superAttrs ? Object.create(superAttrs) : {};
  js.value(owner, '__attrs__', attrs);
  return attrs;
} // subclass should not have __attrs__


function createAttrs(subclass) {
  if (typeof subclass !== 'function') {
    // attributes only in instance
    var instance = subclass;
    return createAttrsSingle(instance, getClassAttrs(instance.constructor));
  }

  var superClass;
  var chains = cc.Class.getInheritanceChain(subclass);

  for (var i = chains.length - 1; i >= 0; i--) {
    var cls = chains[i];

    var attrs = cls.hasOwnProperty('__attrs__') && cls.__attrs__;

    if (!attrs) {
      superClass = chains[i + 1];
      createAttrsSingle(cls, superClass && superClass.__attrs__);
    }
  }

  superClass = chains[0];
  createAttrsSingle(subclass, superClass && superClass.__attrs__);
  return subclass.__attrs__;
} // /**
//  * @class Class
//  */
//  *
//  * Tag the class with any meta attributes, then return all current attributes assigned to it.
//  * This function holds only the attributes, not their implementations.
//  *
//  * @method attr
//  * @param {Function|Object} ctor - the class or instance. If instance, the attribute will be dynamic and only available for the specified instance.
//  * @param {String} propName - the name of property or function, used to retrieve the attributes
//  * @param {Object} [newAttrs] - the attribute table to mark, new attributes will merged with existed attributes. Attribute whose key starts with '_' will be ignored.
//  * @static
//  * @private


function attr(ctor, propName, newAttrs) {
  var attrs = getClassAttrs(ctor);

  if (!CC_DEV || typeof newAttrs === 'undefined') {
    // get
    var prefix = propName + DELIMETER;
    var ret = {};

    for (var key in attrs) {
      if (key.startsWith(prefix)) {
        ret[key.slice(prefix.length)] = attrs[key];
      }
    }

    return ret;
  } else if (CC_DEV && typeof newAttrs === 'object') {
    // set
    cc.warn("`cc.Class.attr(obj, prop, { key: value });` is deprecated, use `cc.Class.Attr.setClassAttr(obj, prop, 'key', value);` instead please.");

    for (var _key in newAttrs) {
      attrs[propName + DELIMETER + _key] = newAttrs[_key];
    }
  }
} // returns a readonly meta object


function getClassAttrs(ctor) {
  return ctor.hasOwnProperty('__attrs__') && ctor.__attrs__ || createAttrs(ctor);
}

function setClassAttr(ctor, propName, key, value) {
  getClassAttrs(ctor)[propName + DELIMETER + key] = value;
}
/**
 * @module cc
 */


function PrimitiveType(name, def) {
  this.name = name;
  this["default"] = def;
}

PrimitiveType.prototype.toString = function () {
  return this.name;
};
/**
 * Specify that the input value must be integer in Inspector.
 * Also used to indicates that the elements in array should be type integer.
 * @property {string} Integer
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Integer
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Integer
 * })
 * member = [];
 */


cc.Integer = new PrimitiveType('Integer', 0);
/**
 * Indicates that the elements in array should be type double.
 * @property {string} Float
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Float
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Float
 * })
 * member = [];
 */

cc.Float = new PrimitiveType('Float', 0);

if (CC_EDITOR) {
  js.get(cc, 'Number', function () {
    cc.warnID(3603);
    return cc.Float;
  });
}
/**
 * Indicates that the elements in array should be type boolean.
 * @property {string} Boolean
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.Boolean
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.Boolean
 * })
 * member = [];
 */


cc.Boolean = new PrimitiveType('Boolean', false);
/**
 * Indicates that the elements in array should be type string.
 * @property {string} String
 * @readonly
 * @example
 * // in cc.Class
 * member: {
 *     default: [],
 *     type: cc.String
 * }
 * // ES6 ccclass
 * @cc._decorator.property({
 *     type: cc.String
 * })
 * member = [];
 */

cc.String = new PrimitiveType('String', ''); // Ensures the type matches its default value

function getTypeChecker(type, attrName) {
  return function (constructor, mainPropName) {
    var propInfo = '"' + js.getClassName(constructor) + '.' + mainPropName + '"';
    var mainPropAttrs = attr(constructor, mainPropName);

    if (!mainPropAttrs.saveUrlAsAsset) {
      var mainPropAttrsType = mainPropAttrs.type;

      if (mainPropAttrsType === cc.Integer || mainPropAttrsType === cc.Float) {
        mainPropAttrsType = 'Number';
      } else if (mainPropAttrsType === cc.String || mainPropAttrsType === cc.Boolean) {
        mainPropAttrsType = '' + mainPropAttrsType;
      }

      if (mainPropAttrsType !== type) {
        cc.warnID(3604, propInfo);
        return;
      }
    }

    if (!mainPropAttrs.hasOwnProperty('default')) {
      return;
    }

    var defaultVal = mainPropAttrs["default"];

    if (typeof defaultVal === 'undefined') {
      return;
    }

    var isContainer = Array.isArray(defaultVal) || isPlainEmptyObj(defaultVal);

    if (isContainer) {
      return;
    }

    var defaultType = typeof defaultVal;
    var type_lowerCase = type.toLowerCase();

    if (defaultType === type_lowerCase) {
      if (!mainPropAttrs.saveUrlAsAsset) {
        if (type_lowerCase === 'object') {
          if (defaultVal && !(defaultVal instanceof mainPropAttrs.ctor)) {
            cc.warnID(3605, propInfo, js.getClassName(mainPropAttrs.ctor));
          } else {
            return;
          }
        } else if (type !== 'Number') {
          cc.warnID(3606, attrName, propInfo, type);
        }
      }
    } else if (defaultType !== 'function') {
      if (type === cc.String && defaultVal == null) {
        if (!js.isChildClassOf(mainPropAttrs.ctor, cc.RawAsset)) {
          cc.warnID(3607, propInfo);
        }
      } else {
        cc.warnID(3611, attrName, propInfo, defaultType);
      }
    } else {
      return;
    }

    delete mainPropAttrs.type;
  };
} // Ensures the type matches its default value


function getObjTypeChecker(typeCtor) {
  return function (classCtor, mainPropName) {
    getTypeChecker('Object', 'type')(classCtor, mainPropName); // check ValueType

    var defaultDef = getClassAttrs(classCtor)[mainPropName + DELIMETER + 'default'];

    var defaultVal = require('./CCClass').getDefault(defaultDef);

    if (!Array.isArray(defaultVal) && js.isChildClassOf(typeCtor, cc.ValueType)) {
      var typename = js.getClassName(typeCtor);
      var info = cc.js.formatStr('No need to specify the "type" of "%s.%s" because %s is a child class of ValueType.', js.getClassName(classCtor), mainPropName, typename);

      if (defaultDef) {
        cc.log(info);
      } else {
        cc.warnID(3612, info, typename, js.getClassName(classCtor), mainPropName, typename);
      }
    }
  };
}

module.exports = {
  PrimitiveType: PrimitiveType,
  attr: attr,
  getClassAttrs: getClassAttrs,
  setClassAttr: setClassAttr,
  DELIMETER: DELIMETER,
  getTypeChecker_ET: (CC_EDITOR && !Editor.isBuilder || CC_TEST) && getTypeChecker,
  getObjTypeChecker_ET: (CC_EDITOR && !Editor.isBuilder || CC_TEST) && getObjTypeChecker,
  ScriptUuid: {} // the value will be represented as a uuid string

};
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZS5qcyJdLCJuYW1lcyI6WyJqcyIsInJlcXVpcmUiLCJpc1BsYWluRW1wdHlPYmoiLCJpc1BsYWluRW1wdHlPYmpfREVWIiwiREVMSU1FVEVSIiwiY3JlYXRlQXR0cnNTaW5nbGUiLCJvd25lciIsInN1cGVyQXR0cnMiLCJhdHRycyIsIk9iamVjdCIsImNyZWF0ZSIsInZhbHVlIiwiY3JlYXRlQXR0cnMiLCJzdWJjbGFzcyIsImluc3RhbmNlIiwiZ2V0Q2xhc3NBdHRycyIsImNvbnN0cnVjdG9yIiwic3VwZXJDbGFzcyIsImNoYWlucyIsImNjIiwiQ2xhc3MiLCJnZXRJbmhlcml0YW5jZUNoYWluIiwiaSIsImxlbmd0aCIsImNscyIsImhhc093blByb3BlcnR5IiwiX19hdHRyc19fIiwiYXR0ciIsImN0b3IiLCJwcm9wTmFtZSIsIm5ld0F0dHJzIiwiQ0NfREVWIiwicHJlZml4IiwicmV0Iiwia2V5Iiwic3RhcnRzV2l0aCIsInNsaWNlIiwid2FybiIsInNldENsYXNzQXR0ciIsIlByaW1pdGl2ZVR5cGUiLCJuYW1lIiwiZGVmIiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJJbnRlZ2VyIiwiRmxvYXQiLCJDQ19FRElUT1IiLCJnZXQiLCJ3YXJuSUQiLCJCb29sZWFuIiwiU3RyaW5nIiwiZ2V0VHlwZUNoZWNrZXIiLCJ0eXBlIiwiYXR0ck5hbWUiLCJtYWluUHJvcE5hbWUiLCJwcm9wSW5mbyIsImdldENsYXNzTmFtZSIsIm1haW5Qcm9wQXR0cnMiLCJzYXZlVXJsQXNBc3NldCIsIm1haW5Qcm9wQXR0cnNUeXBlIiwiZGVmYXVsdFZhbCIsImlzQ29udGFpbmVyIiwiQXJyYXkiLCJpc0FycmF5IiwiZGVmYXVsdFR5cGUiLCJ0eXBlX2xvd2VyQ2FzZSIsInRvTG93ZXJDYXNlIiwiaXNDaGlsZENsYXNzT2YiLCJSYXdBc3NldCIsImdldE9ialR5cGVDaGVja2VyIiwidHlwZUN0b3IiLCJjbGFzc0N0b3IiLCJkZWZhdWx0RGVmIiwiZ2V0RGVmYXVsdCIsIlZhbHVlVHlwZSIsInR5cGVuYW1lIiwiaW5mbyIsImZvcm1hdFN0ciIsImxvZyIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRUeXBlQ2hlY2tlcl9FVCIsIkVkaXRvciIsImlzQnVpbGRlciIsIkNDX1RFU1QiLCJnZXRPYmpUeXBlQ2hlY2tlcl9FVCIsIlNjcmlwdFV1aWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJELElBQUlBLEVBQUUsR0FBR0MsT0FBTyxDQUFDLE1BQUQsQ0FBaEI7O0FBQ0EsSUFBSUMsZUFBZSxHQUFHRCxPQUFPLENBQUMsU0FBRCxDQUFQLENBQW1CRSxtQkFBekM7O0FBRUEsSUFBTUMsU0FBUyxHQUFHLEtBQWxCOztBQUVBLFNBQVNDLGlCQUFULENBQTRCQyxLQUE1QixFQUFtQ0MsVUFBbkMsRUFBK0M7QUFDM0MsTUFBSUMsS0FBSyxHQUFHRCxVQUFVLEdBQUdFLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjSCxVQUFkLENBQUgsR0FBK0IsRUFBckQ7QUFDQVAsRUFBQUEsRUFBRSxDQUFDVyxLQUFILENBQVNMLEtBQVQsRUFBZ0IsV0FBaEIsRUFBNkJFLEtBQTdCO0FBQ0EsU0FBT0EsS0FBUDtBQUNILEVBRUQ7OztBQUNBLFNBQVNJLFdBQVQsQ0FBc0JDLFFBQXRCLEVBQWdDO0FBQzVCLE1BQUksT0FBT0EsUUFBUCxLQUFvQixVQUF4QixFQUFvQztBQUNoQztBQUNBLFFBQUlDLFFBQVEsR0FBR0QsUUFBZjtBQUNBLFdBQU9SLGlCQUFpQixDQUFDUyxRQUFELEVBQVdDLGFBQWEsQ0FBQ0QsUUFBUSxDQUFDRSxXQUFWLENBQXhCLENBQXhCO0FBQ0g7O0FBQ0QsTUFBSUMsVUFBSjtBQUNBLE1BQUlDLE1BQU0sR0FBR0MsRUFBRSxDQUFDQyxLQUFILENBQVNDLG1CQUFULENBQTZCUixRQUE3QixDQUFiOztBQUNBLE9BQUssSUFBSVMsQ0FBQyxHQUFHSixNQUFNLENBQUNLLE1BQVAsR0FBZ0IsQ0FBN0IsRUFBZ0NELENBQUMsSUFB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QyxTQUFTLElBQUksQ0FBQ29DLE1BQU0sQ0FBQ0MsU0FBdEIsSUFBb0NDLE9BQXJDLEtBQWlEZixpQkFQMUQ7QUFRYmlCLEVBQUFBLFVBQVUsRUFBRSxFQVJDLENBUVE7O0FBUlIsQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyLvu78vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBqcyA9IHJlcXVpcmUoJy4vanMnKTtcbnZhciBpc1BsYWluRW1wdHlPYmogPSByZXF1aXJlKCcuL3V0aWxzJykuaXNQbGFpbkVtcHR5T2JqX0RFVjtcblxuY29uc3QgREVMSU1FVEVSID0gJyRfJCc7XG5cbmZ1bmN0aW9uIGNyZWF0ZUF0dHJzU2luZ2xlIChvd25lciwgc3VwZXJBdHRycykge1xuICAgIHZhciBhdHRycyA9IHN1cGVyQXR0cnMgPyBPYmplY3QuY3JlYXRlKHN1cGVyQXR0cnMpIDoge307XG4gICAganMudmFsdWUob3duZXIsICdfX2F0dHJzX18nLCBhdHRycyk7XG4gICAgcmV0dXJuIGF0dHJzO1xufVxuXG4vLyBzdWJjbGFzcyBzaG91bGQgbm90IGhhdmUgX19hdHRyc19fXG5mdW5jdGlvbiBjcmVhdGVBdHRycyAoc3ViY2xhc3MpIHtcbiAgICBpZiAodHlwZW9mIHN1YmNsYXNzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIGF0dHJpYnV0ZXMgb25seSBpbiBpbnN0YW5jZVxuICAgICAgICBsZXQgaW5zdGFuY2UgPSBzdWJjbGFzcztcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUF0dHJzU2luZ2xlKGluc3RhbmNlLCBnZXRDbGFzc0F0dHJzKGluc3RhbmNlLmNvbnN0cnVjdG9yKSk7XG4gICAgfVxuICAgIHZhciBzdXBlckNsYXNzO1xuICAgIHZhciBjaGFpbnMgPSBjYy5DbGFzcy5nZXRJbmhlcml0YW5jZUNoYWluKHN1YmNsYXNzKTtcbiAgICBmb3IgKHZhciBpID0gY2hhaW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciBjbHMgPSBjaGFpbnNbaV07XG4gICAgICAgIHZhciBhdHRycyA9IGNscy5oYXNPd25Qcm9wZXJ0eSgnX19hdHRyc19fJykgJiYgY2xzLl9fYXR0cnNfXztcbiAgICAgICAgaWYgKCFhdHRycykge1xuICAgICAgICAgICAgc3VwZXJDbGFzcyA9IGNoYWluc1tpICsgMV07XG4gICAgICAgICAgICBjcmVhdGVBdHRyc1NpbmdsZShjbHMsIHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5fX2F0dHJzX18pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN1cGVyQ2xhc3MgPSBjaGFpbnNbMF07XG4gICAgY3JlYXRlQXR0cnNTaW5nbGUoc3ViY2xhc3MsIHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5fX2F0dHJzX18pO1xuICAgIHJldHVybiBzdWJjbGFzcy5fX2F0dHJzX187XG59XG5cbi8vIC8qKlxuLy8gICogQGNsYXNzIENsYXNzXG4vLyAgKi9cblxuLy8gICpcbi8vICAqIFRhZyB0aGUgY2xhc3Mgd2l0aCBhbnkgbWV0YSBhdHRyaWJ1dGVzLCB0aGVuIHJldHVybiBhbGwgY3VycmVudCBhdHRyaWJ1dGVzIGFzc2lnbmVkIHRvIGl0LlxuLy8gICogVGhpcyBmdW5jdGlvbiBob2xkcyBvbmx5IHRoZSBhdHRyaWJ1dGVzLCBub3QgdGhlaXIgaW1wbGVtZW50YXRpb25zLlxuLy8gICpcbi8vICAqIEBtZXRob2QgYXR0clxuLy8gICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R9IGN0b3IgLSB0aGUgY2xhc3Mgb3IgaW5zdGFuY2UuIElmIGluc3RhbmNlLCB0aGUgYXR0cmlidXRlIHdpbGwgYmUgZHluYW1pYyBhbmQgb25seSBhdmFpbGFibGUgZm9yIHRoZSBzcGVjaWZpZWQgaW5zdGFuY2UuXG4vLyAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcE5hbWUgLSB0aGUgbmFtZSBvZiBwcm9wZXJ0eSBvciBmdW5jdGlvbiwgdXNlZCB0byByZXRyaWV2ZSB0aGUgYXR0cmlidXRlc1xuLy8gICogQHBhcmFtIHtPYmplY3R9IFtuZXdBdHRyc10gLSB0aGUgYXR0cmlidXRlIHRhYmxlIHRvIG1hcmssIG5ldyBhdHRyaWJ1dGVzIHdpbGwgbWVyZ2VkIHdpdGggZXhpc3RlZCBhdHRyaWJ1dGVzLiBBdHRyaWJ1dGUgd2hvc2Uga2V5IHN0YXJ0cyB3aXRoICdfJyB3aWxsIGJlIGlnbm9yZWQuXG4vLyAgKiBAc3RhdGljXG4vLyAgKiBAcHJpdmF0ZVxuZnVuY3Rpb24gYXR0ciAoY3RvciwgcHJvcE5hbWUsIG5ld0F0dHJzKSB7XG4gICAgdmFyIGF0dHJzID0gZ2V0Q2xhc3NBdHRycyhjdG9yKTtcbiAgICBpZiAoIUNDX0RFViB8fCB0eXBlb2YgbmV3QXR0cnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIGdldFxuICAgICAgICB2YXIgcHJlZml4ID0gcHJvcE5hbWUgKyBERUxJTUVURVI7XG4gICAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGF0dHJzKSB7XG4gICAgICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgocHJlZml4KSkge1xuICAgICAgICAgICAgICAgIHJldFtrZXkuc2xpY2UocHJlZml4Lmxlbmd0aCldID0gYXR0cnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBlbHNlIGlmIChDQ19ERVYgJiYgdHlwZW9mIG5ld0F0dHJzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBzZXRcbiAgICAgICAgY2Mud2FybihgXFxgY2MuQ2xhc3MuYXR0cihvYmosIHByb3AsIHsga2V5OiB2YWx1ZSB9KTtcXGAgaXMgZGVwcmVjYXRlZCwgdXNlIFxcYGNjLkNsYXNzLkF0dHIuc2V0Q2xhc3NBdHRyKG9iaiwgcHJvcCwgJ2tleScsIHZhbHVlKTtcXGAgaW5zdGVhZCBwbGVhc2UuYCk7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBuZXdBdHRycykge1xuICAgICAgICAgICAgYXR0cnNbcHJvcE5hbWUgKyBERUxJTUVURVIgKyBrZXldID0gbmV3QXR0cnNba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gcmV0dXJucyBhIHJlYWRvbmx5IG1ldGEgb2JqZWN0XG5mdW5jdGlvbiBnZXRDbGFzc0F0dHJzIChjdG9yKSB7XG4gICAgcmV0dXJuIChjdG9yLmhhc093blByb3BlcnR5KCdfX2F0dHJzX18nKSAmJiBjdG9yLl9fYXR0cnNfXykgfHwgY3JlYXRlQXR0cnMoY3Rvcik7XG59XG5cbmZ1bmN0aW9uIHNldENsYXNzQXR0ciAoY3RvciwgcHJvcE5hbWUsIGtleSwgdmFsdWUpIHtcbiAgICBnZXRDbGFzc0F0dHJzKGN0b3IpW3Byb3BOYW1lICsgREVMSU1FVEVSICsga2V5XSA9IHZhbHVlO1xufVxuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG5mdW5jdGlvbiBQcmltaXRpdmVUeXBlIChuYW1lLCBkZWYpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZGVmYXVsdCA9IGRlZjtcbn1cblByaW1pdGl2ZVR5cGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG59O1xuXG4vKipcbiAqIFNwZWNpZnkgdGhhdCB0aGUgaW5wdXQgdmFsdWUgbXVzdCBiZSBpbnRlZ2VyIGluIEluc3BlY3Rvci5cbiAqIEFsc28gdXNlZCB0byBpbmRpY2F0ZXMgdGhhdCB0aGUgZWxlbWVudHMgaW4gYXJyYXkgc2hvdWxkIGJlIHR5cGUgaW50ZWdlci5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBJbnRlZ2VyXG4gKiBAcmVhZG9ubHlcbiAqIEBleGFtcGxlXG4gKiAvLyBpbiBjYy5DbGFzc1xuICogbWVtYmVyOiB7XG4gKiAgICAgZGVmYXVsdDogW10sXG4gKiAgICAgdHlwZTogY2MuSW50ZWdlclxuICogfVxuICogLy8gRVM2IGNjY2xhc3NcbiAqIEBjYy5fZGVjb3JhdG9yLnByb3BlcnR5KHtcbiAqICAgICB0eXBlOiBjYy5JbnRlZ2VyXG4gKiB9KVxuICogbWVtYmVyID0gW107XG4gKi9cbmNjLkludGVnZXIgPSBuZXcgUHJpbWl0aXZlVHlwZSgnSW50ZWdlcicsIDApO1xuXG4vKipcbiAqIEluZGljYXRlcyB0aGF0IHRoZSBlbGVtZW50cyBpbiBhcnJheSBzaG91bGQgYmUgdHlwZSBkb3VibGUuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gRmxvYXRcbiAqIEByZWFkb25seVxuICogQGV4YW1wbGVcbiAqIC8vIGluIGNjLkNsYXNzXG4gKiBtZW1iZXI6IHtcbiAqICAgICBkZWZhdWx0OiBbXSxcbiAqICAgICB0eXBlOiBjYy5GbG9hdFxuICogfVxuICogLy8gRVM2IGNjY2xhc3NcbiAqIEBjYy5fZGVjb3JhdG9yLnByb3BlcnR5KHtcbiAqICAgICB0eXBlOiBjYy5GbG9hdFxuICogfSlcbiAqIG1lbWJlciA9IFtdO1xuICovXG5jYy5GbG9hdCA9IG5ldyBQcmltaXRpdmVUeXBlKCdGbG9hdCcsIDApO1xuXG5pZiAoQ0NfRURJVE9SKSB7XG4gICAganMuZ2V0KGNjLCAnTnVtYmVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy53YXJuSUQoMzYwMyk7XG4gICAgICAgIHJldHVybiBjYy5GbG9hdDtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBJbmRpY2F0ZXMgdGhhdCB0aGUgZWxlbWVudHMgaW4gYXJyYXkgc2hvdWxkIGJlIHR5cGUgYm9vbGVhbi5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBCb29sZWFuXG4gKiBAcmVhZG9ubHlcbiAqIEBleGFtcGxlXG4gKiAvLyBpbiBjYy5DbGFzc1xuICogbWVtYmVyOiB7XG4gKiAgICAgZGVmYXVsdDogW10sXG4gKiAgICAgdHlwZTogY2MuQm9vbGVhblxuICogfVxuICogLy8gRVM2IGNjY2xhc3NcbiAqIEBjYy5fZGVjb3JhdG9yLnByb3BlcnR5KHtcbiAqICAgICB0eXBlOiBjYy5Cb29sZWFuXG4gKiB9KVxuICogbWVtYmVyID0gW107XG4gKi9cbmNjLkJvb2xlYW4gPSBuZXcgUHJpbWl0aXZlVHlwZSgnQm9vbGVhbicsIGZhbHNlKTtcblxuLyoqXG4gKiBJbmRpY2F0ZXMgdGhhdCB0aGUgZWxlbWVudHMgaW4gYXJyYXkgc2hvdWxkIGJlIHR5cGUgc3RyaW5nLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFN0cmluZ1xuICogQHJlYWRvbmx5XG4gKiBAZXhhbXBsZVxuICogLy8gaW4gY2MuQ2xhc3NcbiAqIG1lbWJlcjoge1xuICogICAgIGRlZmF1bHQ6IFtdLFxuICogICAgIHR5cGU6IGNjLlN0cmluZ1xuICogfVxuICogLy8gRVM2IGNjY2xhc3NcbiAqIEBjYy5fZGVjb3JhdG9yLnByb3BlcnR5KHtcbiAqICAgICB0eXBlOiBjYy5TdHJpbmdcbiAqIH0pXG4gKiBtZW1iZXIgPSBbXTtcbiAqL1xuY2MuU3RyaW5nID0gbmV3IFByaW1pdGl2ZVR5cGUoJ1N0cmluZycsICcnKTtcblxuLy8gRW5zdXJlcyB0aGUgdHlwZSBtYXRjaGVzIGl0cyBkZWZhdWx0IHZhbHVlXG5mdW5jdGlvbiBnZXRUeXBlQ2hlY2tlciAodHlwZSwgYXR0ck5hbWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGNvbnN0cnVjdG9yLCBtYWluUHJvcE5hbWUpIHtcbiAgICAgICAgdmFyIHByb3BJbmZvID0gJ1wiJyArIGpzLmdldENsYXNzTmFtZShjb25zdHJ1Y3RvcikgKyAnLicgKyBtYWluUHJvcE5hbWUgKyAnXCInO1xuICAgICAgICB2YXIgbWFpblByb3BBdHRycyA9IGF0dHIoY29uc3RydWN0b3IsIG1haW5Qcm9wTmFtZSk7XG4gICAgICAgIGlmICghbWFpblByb3BBdHRycy5zYXZlVXJsQXNBc3NldCkge1xuICAgICAgICAgICAgdmFyIG1haW5Qcm9wQXR0cnNUeXBlID0gbWFpblByb3BBdHRycy50eXBlO1xuICAgICAgICAgICAgaWYgKG1haW5Qcm9wQXR0cnNUeXBlID09PSBjYy5JbnRlZ2VyIHx8IG1haW5Qcm9wQXR0cnNUeXBlID09PSBjYy5GbG9hdCkge1xuICAgICAgICAgICAgICAgIG1haW5Qcm9wQXR0cnNUeXBlID0gJ051bWJlcic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtYWluUHJvcEF0dHJzVHlwZSA9PT0gY2MuU3RyaW5nIHx8IG1haW5Qcm9wQXR0cnNUeXBlID09PSBjYy5Cb29sZWFuKSB7XG4gICAgICAgICAgICAgICAgbWFpblByb3BBdHRyc1R5cGUgPSAnJyArIG1haW5Qcm9wQXR0cnNUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1haW5Qcm9wQXR0cnNUeXBlICE9PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDM2MDQsIHByb3BJbmZvKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtYWluUHJvcEF0dHJzLmhhc093blByb3BlcnR5KCdkZWZhdWx0JykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVmYXVsdFZhbCA9IG1haW5Qcm9wQXR0cnMuZGVmYXVsdDtcbiAgICAgICAgaWYgKHR5cGVvZiBkZWZhdWx0VmFsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpc0NvbnRhaW5lciA9IEFycmF5LmlzQXJyYXkoZGVmYXVsdFZhbCkgfHwgaXNQbGFpbkVtcHR5T2JqKGRlZmF1bHRWYWwpO1xuICAgICAgICBpZiAoaXNDb250YWluZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVmYXVsdFR5cGUgPSB0eXBlb2YgZGVmYXVsdFZhbDtcbiAgICAgICAgdmFyIHR5cGVfbG93ZXJDYXNlID0gdHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoZGVmYXVsdFR5cGUgPT09IHR5cGVfbG93ZXJDYXNlKSB7XG4gICAgICAgICAgICBpZiAoIW1haW5Qcm9wQXR0cnMuc2F2ZVVybEFzQXNzZXQpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZV9sb3dlckNhc2UgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0VmFsICYmICEoZGVmYXVsdFZhbCBpbnN0YW5jZW9mIG1haW5Qcm9wQXR0cnMuY3RvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjA1LCBwcm9wSW5mbywganMuZ2V0Q2xhc3NOYW1lKG1haW5Qcm9wQXR0cnMuY3RvcikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGUgIT09ICdOdW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjA2LCBhdHRyTmFtZSwgcHJvcEluZm8sIHR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkZWZhdWx0VHlwZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgaWYgKHR5cGUgPT09IGNjLlN0cmluZyAmJiBkZWZhdWx0VmFsID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWpzLmlzQ2hpbGRDbGFzc09mKG1haW5Qcm9wQXR0cnMuY3RvciwgY2MuUmF3QXNzZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjA3LCBwcm9wSW5mbyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybklEKDM2MTEsIGF0dHJOYW1lLCBwcm9wSW5mbywgZGVmYXVsdFR5cGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBtYWluUHJvcEF0dHJzLnR5cGU7XG4gICAgfTtcbn1cblxuLy8gRW5zdXJlcyB0aGUgdHlwZSBtYXRjaGVzIGl0cyBkZWZhdWx0IHZhbHVlXG5mdW5jdGlvbiBnZXRPYmpUeXBlQ2hlY2tlciAodHlwZUN0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGNsYXNzQ3RvciwgbWFpblByb3BOYW1lKSB7XG4gICAgICAgIGdldFR5cGVDaGVja2VyKCdPYmplY3QnLCAndHlwZScpKGNsYXNzQ3RvciwgbWFpblByb3BOYW1lKTtcbiAgICAgICAgLy8gY2hlY2sgVmFsdWVUeXBlXG4gICAgICAgIHZhciBkZWZhdWx0RGVmID0gZ2V0Q2xhc3NBdHRycyhjbGFzc0N0b3IpW21haW5Qcm9wTmFtZSArIERFTElNRVRFUiArICdkZWZhdWx0J107XG4gICAgICAgIHZhciBkZWZhdWx0VmFsID0gcmVxdWlyZSgnLi9DQ0NsYXNzJykuZ2V0RGVmYXVsdChkZWZhdWx0RGVmKTtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGRlZmF1bHRWYWwpICYmIGpzLmlzQ2hpbGRDbGFzc09mKHR5cGVDdG9yLCBjYy5WYWx1ZVR5cGUpKSB7XG4gICAgICAgICAgICB2YXIgdHlwZW5hbWUgPSBqcy5nZXRDbGFzc05hbWUodHlwZUN0b3IpO1xuICAgICAgICAgICAgdmFyIGluZm8gPSBjYy5qcy5mb3JtYXRTdHIoJ05vIG5lZWQgdG8gc3BlY2lmeSB0aGUgXCJ0eXBlXCIgb2YgXCIlcy4lc1wiIGJlY2F1c2UgJXMgaXMgYSBjaGlsZCBjbGFzcyBvZiBWYWx1ZVR5cGUuJyxcbiAgICAgICAgICAgICAgICBqcy5nZXRDbGFzc05hbWUoY2xhc3NDdG9yKSwgbWFpblByb3BOYW1lLCB0eXBlbmFtZSk7XG4gICAgICAgICAgICBpZiAoZGVmYXVsdERlZikge1xuICAgICAgICAgICAgICAgIGNjLmxvZyhpbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjEyLCBpbmZvLCB0eXBlbmFtZSwganMuZ2V0Q2xhc3NOYW1lKGNsYXNzQ3RvciksIG1haW5Qcm9wTmFtZSwgdHlwZW5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUHJpbWl0aXZlVHlwZSxcbiAgICBhdHRyOiBhdHRyLFxuICAgIGdldENsYXNzQXR0cnM6IGdldENsYXNzQXR0cnMsXG4gICAgc2V0Q2xhc3NBdHRyOiBzZXRDbGFzc0F0dHIsXG4gICAgREVMSU1FVEVSOiBERUxJTUVURVIsXG4gICAgZ2V0VHlwZUNoZWNrZXJfRVQ6ICgoQ0NfRURJVE9SICYmICFFZGl0b3IuaXNCdWlsZGVyKSB8fCBDQ19URVNUKSAmJiBnZXRUeXBlQ2hlY2tlcixcbiAgICBnZXRPYmpUeXBlQ2hlY2tlcl9FVDogKChDQ19FRElUT1IgJiYgIUVkaXRvci5pc0J1aWxkZXIpIHx8IENDX1RFU1QpICYmIGdldE9ialR5cGVDaGVja2VyLFxuICAgIFNjcmlwdFV1aWQ6IHt9LCAgICAgIC8vIHRoZSB2YWx1ZSB3aWxsIGJlIHJlcHJlc2VudGVkIGFzIGEgdXVpZCBzdHJpbmdcbn07XG4iXX0=