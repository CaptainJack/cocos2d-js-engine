
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/CCNode.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
'use strict';

var _valueTypes = require("./value-types");

var BaseNode = require('./utils/base-node');

var PrefabHelper = require('./utils/prefab-helper');

var nodeMemPool = require('./utils/trans-pool').NodeMemPool;

var AffineTrans = require('./utils/affine-transform');

var eventManager = require('./event-manager');

var macro = require('./platform/CCMacro');

var js = require('./platform/js');

var Event = require('./event/event');

var EventTarget = require('./event/event-target');

var RenderFlow = require('./renderer/render-flow');

var Flags = cc.Object.Flags;
var Destroying = Flags.Destroying;
var ERR_INVALID_NUMBER = CC_EDITOR && 'The %s is invalid';
var ONE_DEGREE = Math.PI / 180;
var ActionManagerExist = !!cc.ActionManager;

var emptyFunc = function emptyFunc() {}; // getWorldPosition temp var


var _gwpVec3 = new _valueTypes.Vec3();

var _gwpQuat = new _valueTypes.Quat(); // _invTransformPoint temp var


var _tpVec3a = new _valueTypes.Vec3();

var _tpVec3b = new _valueTypes.Vec3();

var _tpQuata = new _valueTypes.Quat();

var _tpQuatb = new _valueTypes.Quat(); // setWorldPosition temp var


var _swpVec3 = new _valueTypes.Vec3(); // getWorldScale temp var


var _gwsVec3 = new _valueTypes.Vec3(); // setWorldScale temp var


var _swsVec3 = new _valueTypes.Vec3(); // getWorldRT temp var


var _gwrtVec3a = new _valueTypes.Vec3();

var _gwrtVec3b = new _valueTypes.Vec3();

var _gwrtQuata = new _valueTypes.Quat();

var _gwrtQuatb = new _valueTypes.Quat(); // lookAt temp var


var _laVec3 = new _valueTypes.Vec3();

var _laQuat = new _valueTypes.Quat(); // _hitTest temp var


var _htVec3a = new _valueTypes.Vec3();

var _htVec3b = new _valueTypes.Vec3(); // getWorldRotation temp var


var _gwrQuat = new _valueTypes.Quat(); // setWorldRotation temp var


var _swrQuat = new _valueTypes.Quat();

var _quata = new _valueTypes.Quat();

var _mat4_temp = cc.mat4();

var _vec3_temp = new _valueTypes.Vec3();

var _cachedArray = new Array(16);

_cachedArray.length = 0;
var POSITION_ON = 1 << 0;
var SCALE_ON = 1 << 1;
var ROTATION_ON = 1 << 2;
var SIZE_ON = 1 << 3;
var ANCHOR_ON = 1 << 4;
var COLOR_ON = 1 << 5;
var BuiltinGroupIndex = cc.Enum({
  DEBUG: 31
});
/**
 * !#en Node's local dirty properties flag
 * !#zh Node 的本地属性 dirty 状态位
 * @enum Node._LocalDirtyFlag
 * @static
 * @private
 * @namespace Node
 */

var LocalDirtyFlag = cc.Enum({
  /**
   * !#en Flag for position dirty
   * !#zh 位置 dirty 的标记位
   * @property {Number} POSITION
   * @static
   */
  POSITION: 1 << 0,

  /**
   * !#en Flag for scale dirty
   * !#zh 缩放 dirty 的标记位
   * @property {Number} SCALE
   * @static
   */
  SCALE: 1 << 1,

  /**
   * !#en Flag for rotation dirty
   * !#zh 旋转 dirty 的标记位
   * @property {Number} ROTATION
   * @static
   */
  ROTATION: 1 << 2,

  /**
   * !#en Flag for skew dirty
   * !#zh skew dirty 的标记位
   * @property {Number} SKEW
   * @static
   */
  SKEW: 1 << 3,

  /**
   * !#en Flag for rotation, scale or position dirty
   * !#zh 旋转，缩放，或位置 dirty 的标记位
   * @property {Number} TRS
   * @static
   */
  TRS: 1 << 0 | 1 << 1 | 1 << 2,

  /**
   * !#en Flag for rotation or scale dirty
   * !#zh 旋转或缩放 dirty 的标记位
   * @property {Number} RS
   * @static
   */
  RS: 1 << 1 | 1 << 2,

  /**
   * !#en Flag for rotation, scale, position, skew dirty
   * !#zh 旋转，缩放，位置，或斜角 dirty 的标记位
   * @property {Number} TRS
   * @static
   */
  TRSS: 1 << 0 | 1 << 1 | 1 << 2 | 1 << 3,

  /**
   * !#en Flag for physics position dirty
   * !#zh 物理位置 dirty 的标记位
   * @property {Number} PHYSICS_POSITION
   * @static
   */
  PHYSICS_POSITION: 1 << 4,

  /**
   * !#en Flag for physics scale dirty
   * !#zh 物理缩放 dirty 的标记位
   * @property {Number} PHYSICS_SCALE
   * @static
   */
  PHYSICS_SCALE: 1 << 5,

  /**
   * !#en Flag for physics rotation dirty
   * !#zh 物理旋转 dirty 的标记位
   * @property {Number} PHYSICS_ROTATION
   * @static
   */
  PHYSICS_ROTATION: 1 << 6,

  /**
   * !#en Flag for physics trs dirty
   * !#zh 物理位置旋转缩放 dirty 的标记位
   * @property {Number} PHYSICS_TRS
   * @static
   */
  PHYSICS_TRS: 1 << 4 | 1 << 5 | 1 << 6,

  /**
   * !#en Flag for physics rs dirty
   * !#zh 物理旋转缩放 dirty 的标记位
   * @property {Number} PHYSICS_RS
   * @static
   */
  PHYSICS_RS: 1 << 5 | 1 << 6,

  /**
   * !#en Flag for node and physics position dirty
   * !#zh 所有位置 dirty 的标记位
   * @property {Number} ALL_POSITION
   * @static
   */
  ALL_POSITION: 1 << 0 | 1 << 4,

  /**
   * !#en Flag for node and physics scale dirty
   * !#zh 所有缩放 dirty 的标记位
   * @property {Number} ALL_SCALE
   * @static
   */
  ALL_SCALE: 1 << 1 | 1 << 5,

  /**
   * !#en Flag for node and physics rotation dirty
   * !#zh 所有旋转 dirty 的标记位
   * @property {Number} ALL_ROTATION
   * @static
   */
  ALL_ROTATION: 1 << 2 | 1 << 6,

  /**
   * !#en Flag for node and physics trs dirty
   * !#zh 所有trs dirty 的标记位
   * @property {Number} ALL_TRS
   * @static
   */
  ALL_TRS: 1 << 0 | 1 << 1 | 1 << 2 | 1 << 4 | 1 << 5 | 1 << 6,

  /**
   * !#en Flag for all dirty properties
   * !#zh 覆盖所有 dirty 状态的标记位
   * @property {Number} ALL
   * @static
   */
  ALL: 0xffff
});
/**
 * !#en The event type supported by Node
 * !#zh Node 支持的事件类型
 * @class Node.EventType
 * @static
 * @namespace Node
 */
// Why EventType defined as class, because the first parameter of Node.on method needs set as 'string' type.

var EventType = cc.Enum({
  /**
   * !#en The event type for touch start event, you can use its value directly: 'touchstart'
   * !#zh 当手指触摸到屏幕时。
   * @property {String} TOUCH_START
   * @static
   */
  TOUCH_START: 'touchstart',

  /**
   * !#en The event type for touch move event, you can use its value directly: 'touchmove'
   * !#zh 当手指在屏幕上移动时。
   * @property {String} TOUCH_MOVE
   * @static
   */
  TOUCH_MOVE: 'touchmove',

  /**
   * !#en The event type for touch end event, you can use its value directly: 'touchend'
   * !#zh 当手指在目标节点区域内离开屏幕时。
   * @property {String} TOUCH_END
   * @static
   */
  TOUCH_END: 'touchend',

  /**
   * !#en The event type for touch end event, you can use its value directly: 'touchcancel'
   * !#zh 当手指在目标节点区域外离开屏幕时。
   * @property {String} TOUCH_CANCEL
   * @static
   */
  TOUCH_CANCEL: 'touchcancel',

  /**
   * !#en The event type for mouse down events, you can use its value directly: 'mousedown'
   * !#zh 当鼠标按下时触发一次。
   * @property {String} MOUSE_DOWN
   * @static
   */
  MOUSE_DOWN: 'mousedown',

  /**
   * !#en The event type for mouse move events, you can use its value directly: 'mousemove'
   * !#zh 当鼠标在目标节点在目标节点区域中移动时，不论是否按下。
   * @property {String} MOUSE_MOVE
   * @static
   */
  MOUSE_MOVE: 'mousemove',

  /**
   * !#en The event type for mouse enter target events, you can use its value directly: 'mouseenter'
   * !#zh 当鼠标移入目标节点区域时，不论是否按下。
   * @property {String} MOUSE_ENTER
   * @static
   */
  MOUSE_ENTER: 'mouseenter',

  /**
   * !#en The event type for mouse leave target events, you can use its value directly: 'mouseleave'
   * !#zh 当鼠标移出目标节点区域时，不论是否按下。
   * @property {String} MOUSE_LEAVE
   * @static
   */
  MOUSE_LEAVE: 'mouseleave',

  /**
   * !#en The event type for mouse up events, you can use its value directly: 'mouseup'
   * !#zh 当鼠标从按下状态松开时触发一次。
   * @property {String} MOUSE_UP
   * @static
   */
  MOUSE_UP: 'mouseup',

  /**
   * !#en The event type for mouse wheel events, you can use its value directly: 'mousewheel'
   * !#zh 当鼠标滚轮滚动时。
   * @property {String} MOUSE_WHEEL
   * @static
   */
  MOUSE_WHEEL: 'mousewheel',

  /**
   * !#en The event type for position change events.
   * Performance note, this event will be triggered every time corresponding properties being changed,
   * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
   * !#zh 当节点位置改变时触发的事件。
   * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
   * @property {String} POSITION_CHANGED
   * @static
   */
  POSITION_CHANGED: 'position-changed',

  /**
   * !#en The event type for rotation change events.
   * Performance note, this event will be triggered every time corresponding properties being changed,
   * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
   * !#zh 当节点旋转改变时触发的事件。
   * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
   * @property {String} ROTATION_CHANGED
   * @static
   */
  ROTATION_CHANGED: 'rotation-changed',

  /**
   * !#en The event type for scale change events.
   * Performance note, this event will be triggered every time corresponding properties being changed,
   * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
   * !#zh 当节点缩放改变时触发的事件。
   * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
   * @property {String} SCALE_CHANGED
   * @static
   */
  SCALE_CHANGED: 'scale-changed',

  /**
   * !#en The event type for size change events.
   * Performance note, this event will be triggered every time corresponding properties being changed,
   * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
   * !#zh 当节点尺寸改变时触发的事件。
   * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
   * @property {String} SIZE_CHANGED
   * @static
   */
  SIZE_CHANGED: 'size-changed',

  /**
   * !#en The event type for anchor point change events.
   * Performance note, this event will be triggered every time corresponding properties being changed,
   * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
   * !#zh 当节点锚点改变时触发的事件。
   * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
   * @property {String} ANCHOR_CHANGED
   * @static
   */
  ANCHOR_CHANGED: 'anchor-changed',

  /**
  * !#en The event type for color change events.
  * Performance note, this event will be triggered every time corresponding properties being changed,
  * if the event callback have heavy logic it may have great performance impact, try to avoid such scenario.
  * !#zh 当节点颜色改变时触发的事件。
  * 性能警告：这个事件会在每次对应的属性被修改时触发，如果事件回调损耗较高，有可能对性能有很大的负面影响，请尽量避免这种情况。
  * @property {String} COLOR_CHANGED
  * @static
  */
  COLOR_CHANGED: 'color-changed',

  /**
   * !#en The event type for new child added events.
   * !#zh 当新的子节点被添加时触发的事件。
   * @property {String} CHILD_ADDED
   * @static
   */
  CHILD_ADDED: 'child-added',

  /**
   * !#en The event type for child removed events.
   * !#zh 当子节点被移除时触发的事件。
   * @property {String} CHILD_REMOVED
   * @static
   */
  CHILD_REMOVED: 'child-removed',

  /**
   * !#en The event type for children reorder events.
   * !#zh 当子节点顺序改变时触发的事件。
   * @property {String} CHILD_REORDER
   * @static
   */
  CHILD_REORDER: 'child-reorder',

  /**
   * !#en The event type for node group changed events.
   * !#zh 当节点归属群组发生变化时触发的事件。
   * @property {String} GROUP_CHANGED
   * @static
   */
  GROUP_CHANGED: 'group-changed',

  /**
   * !#en The event type for node's sibling order changed.
   * !#zh 当节点在兄弟节点中的顺序发生变化时触发的事件。
   * @property {String} SIBLING_ORDER_CHANGED
   * @static
   */
  SIBLING_ORDER_CHANGED: 'sibling-order-changed'
});
var _touchEvents = [EventType.TOUCH_START, EventType.TOUCH_MOVE, EventType.TOUCH_END, EventType.TOUCH_CANCEL];
var _mouseEvents = [EventType.MOUSE_DOWN, EventType.MOUSE_ENTER, EventType.MOUSE_MOVE, EventType.MOUSE_LEAVE, EventType.MOUSE_UP, EventType.MOUSE_WHEEL];
var _skewNeedWarn = true;

var _skewWarn = function _skewWarn(value, node) {
  if (value !== 0) {
    var nodePath = "";

    if (CC_EDITOR) {
      var NodeUtils = Editor.require('scene://utils/node');

      nodePath = "Node: " + NodeUtils.getNodePath(node) + ".";
    }

    _skewNeedWarn && cc.warn("`cc.Node.skewX/Y` is deprecated since v2.2.1, please use 3D node instead.", nodePath);
    !CC_EDITOR && (_skewNeedWarn = false);
  }
};

var _currentHovered = null;

var _touchStartHandler = function _touchStartHandler(touch, event) {
  var pos = touch.getLocation();
  var node = this.owner;

  if (node._hitTest(pos, this)) {
    event.type = EventType.TOUCH_START;
    event.touch = touch;
    event.bubbles = true;
    node.dispatchEvent(event);
    return true;
  }

  return false;
};

var _touchMoveHandler = function _touchMoveHandler(touch, event) {
  var node = this.owner;
  event.type = EventType.TOUCH_MOVE;
  event.touch = touch;
  event.bubbles = true;
  node.dispatchEvent(event);
};

var _touchEndHandler = function _touchEndHandler(touch, event) {
  var pos = touch.getLocation();
  var node = this.owner;

  if (node._hitTest(pos, this)) {
    event.type = EventType.TOUCH_END;
  } else {
    event.type = EventType.TOUCH_CANCEL;
  }

  event.touch = touch;
  event.bubbles = true;
  node.dispatchEvent(event);
};

var _touchCancelHandler = function _touchCancelHandler(touch, event) {
  var pos = touch.getLocation();
  var node = this.owner;
  event.type = EventType.TOUCH_CANCEL;
  event.touch = touch;
  event.bubbles = true;
  node.dispatchEvent(event);
};

var _mouseDownHandler = function _mouseDownHandler(event) {
  var pos = event.getLocation();
  var node = this.owner;

  if (node._hitTest(pos, this)) {
    event.type = EventType.MOUSE_DOWN;
    event.bubbles = true;
    node.dispatchEvent(event);
  }
};

var _mouseMoveHandler = function _mouseMoveHandler(event) {
  var pos = event.getLocation();
  var node = this.owner;

  var hit = node._hitTest(pos, this);

  if (hit) {
    if (!this._previousIn) {
      // Fix issue when hover node switched, previous hovered node won't get MOUSE_LEAVE notification
      if (_currentHovered && _currentHovered._mouseListener) {
        event.type = EventType.MOUSE_LEAVE;

        _currentHovered.dispatchEvent(event);

        _currentHovered._mouseListener._previousIn = false;
      }

      _currentHovered = this.owner;
      event.type = EventType.MOUSE_ENTER;
      node.dispatchEvent(event);
      this._previousIn = true;
    }

    event.type = EventType.MOUSE_MOVE;
    event.bubbles = true;
    node.dispatchEvent(event);
  } else if (this._previousIn) {
    event.type = EventType.MOUSE_LEAVE;
    node.dispatchEvent(event);
    this._previousIn = false;
    _currentHovered = null;
  } else {
    // continue dispatching
    return;
  } // Event processed, cleanup


  event.stopPropagation();
};

var _mouseUpHandler = function _mouseUpHandler(event) {
  var pos = event.getLocation();
  var node = this.owner;

  if (node._hitTest(pos, this)) {
    event.type = EventType.MOUSE_UP;
    event.bubbles = true;
    node.dispatchEvent(event);
    event.stopPropagation();
  }
};

var _mouseWheelHandler = function _mouseWheelHandler(event) {
  var pos = event.getLocation();
  var node = this.owner;

  if (node._hitTest(pos, this)) {
    event.type = EventType.MOUSE_WHEEL;
    event.bubbles = true;
    node.dispatchEvent(event);
    event.stopPropagation();
  }
};

function _searchComponentsInParent(node, comp) {
  if (comp) {
    var index = 0;
    var list = null;

    for (var curr = node; curr && cc.Node.isNode(curr); curr = curr._parent, ++index) {
      if (curr.getComponent(comp)) {
        var next = {
          index: index,
          node: curr
        };

        if (list) {
          list.push(next);
        } else {
          list = [next];
        }
      }
    }

    return list;
  }

  return null;
}

function _checkListeners(node, events) {
  if (!(node._objFlags & Destroying)) {
    var i = 0;

    if (node._bubblingListeners) {
      for (; i < events.length; ++i) {
        if (node._bubblingListeners.hasEventListener(events[i])) {
          return true;
        }
      }
    }

    if (node._capturingListeners) {
      for (; i < events.length; ++i) {
        if (node._capturingListeners.hasEventListener(events[i])) {
          return true;
        }
      }
    }

    return false;
  }

  return true;
}

function _doDispatchEvent(owner, event) {
  var target, i;
  event.target = owner; // Event.CAPTURING_PHASE

  _cachedArray.length = 0;

  owner._getCapturingTargets(event.type, _cachedArray); // capturing


  event.eventPhase = 1;

  for (i = _cachedArray.length - 1; i >= 0; --i) {
    target = _cachedArray[i];

    if (target._capturingListeners) {
      event.currentTarget = target; // fire event

      target._capturingListeners.emit(event.type, event, _cachedArray); // check if propagation stopped


      if (event._propagationStopped) {
        _cachedArray.length = 0;
        return;
      }
    }
  }

  _cachedArray.length = 0; // Event.AT_TARGET
  // checks if destroyed in capturing callbacks

  event.eventPhase = 2;
  event.currentTarget = owner;

  if (owner._capturingListeners) {
    owner._capturingListeners.emit(event.type, event);
  }

  if (!event._propagationImmediateStopped && owner._bubblingListeners) {
    owner._bubblingListeners.emit(event.type, event);
  }

  if (!event._propagationStopped && event.bubbles) {
    // Event.BUBBLING_PHASE
    owner._getBubblingTargets(event.type, _cachedArray); // propagate


    event.eventPhase = 3;

    for (i = 0; i < _cachedArray.length; ++i) {
      target = _cachedArray[i];

      if (target._bubblingListeners) {
        event.currentTarget = target; // fire event

        target._bubblingListeners.emit(event.type, event); // check if propagation stopped


        if (event._propagationStopped) {
          _cachedArray.length = 0;
          return;
        }
      }
    }
  }

  _cachedArray.length = 0;
} // traversal the node tree, child cullingMask must keep the same with the parent.


function _getActualGroupIndex(node) {
  var groupIndex = node.groupIndex;

  if (groupIndex === 0 && node.parent) {
    groupIndex = _getActualGroupIndex(node.parent);
  }

  return groupIndex;
}

function _updateCullingMask(node) {
  var index = _getActualGroupIndex(node);

  node._cullingMask = 1 << index;

  if (CC_JSB && CC_NATIVERENDERER) {
    node._proxy && node._proxy.updateCullingMask();
  }

  ;

  for (var i = 0; i < node._children.length; i++) {
    _updateCullingMask(node._children[i]);
  }
} // 2D/3D matrix functions


function updateLocalMatrix3D() {
  if (this._localMatDirty & LocalDirtyFlag.TRSS) {
    // Update transform
    var t = this._matrix;
    var tm = t.m;

    _valueTypes.Trs.toMat4(t, this._trs); // skew


    if (this._skewX || this._skewY) {
      var a = tm[0],
          b = tm[1],
          c = tm[4],
          d = tm[5];
      var skx = Math.tan(this._skewX * ONE_DEGREE);
      var sky = Math.tan(this._skewY * ONE_DEGREE);
      if (skx === Infinity) skx = 99999999;
      if (sky === Infinity) sky = 99999999;
      tm[0] = a + c * sky;
      tm[1] = b + d * sky;
      tm[4] = c + a * skx;
      tm[5] = d + b * skx;
    }

    this._localMatDirty &= ~LocalDirtyFlag.TRSS; // Register dirty status of world matrix so that it can be recalculated

    this._worldMatDirty = true;
  }
}

function updateLocalMatrix2D() {
  var dirtyFlag = this._localMatDirty;
  if (!(dirtyFlag & LocalDirtyFlag.TRSS)) return; // Update transform

  var t = this._matrix;
  var tm = t.m;
  var trs = this._trs;

  if (dirtyFlag & (LocalDirtyFlag.RS | LocalDirtyFlag.SKEW)) {
    var rotation = -this._eulerAngles.z;
    var hasSkew = this._skewX || this._skewY;
    var sx = trs[7],
        sy = trs[8];

    if (rotation || hasSkew) {
      var a = 1,
          b = 0,
          c = 0,
          d = 1; // rotation

      if (rotation) {
        var rotationRadians = rotation * ONE_DEGREE;
        c = Math.sin(rotationRadians);
        d = Math.cos(rotationRadians);
        a = d;
        b = -c;
      } // scale


      tm[0] = a *= sx;
      tm[1] = b *= sx;
      tm[4] = c *= sy;
      tm[5] = d *= sy; // skew

      if (hasSkew) {
        var _a = tm[0],
            _b = tm[1],
            _c = tm[4],
            _d = tm[5];
        var skx = Math.tan(this._skewX * ONE_DEGREE);
        var sky = Math.tan(this._skewY * ONE_DEGREE);
        if (skx === Infinity) skx = 99999999;
        if (sky === Infinity) sky = 99999999;
        tm[0] = _a + _c * sky;
        tm[1] = _b + _d * sky;
        tm[4] = _c + _a * skx;
        tm[5] = _d + _b * skx;
      }
    } else {
      tm[0] = sx;
      tm[1] = 0;
      tm[4] = 0;
      tm[5] = sy;
    }
  } // position


  tm[12] = trs[0];
  tm[13] = trs[1];
  this._localMatDirty &= ~LocalDirtyFlag.TRSS; // Register dirty status of world matrix so that it can be recalculated

  this._worldMatDirty = true;
}

function calculWorldMatrix3D() {
  // Avoid as much function call as possible
  if (this._localMatDirty & LocalDirtyFlag.TRSS) {
    this._updateLocalMatrix();
  }

  if (this._parent) {
    var parentMat = this._parent._worldMatrix;

    _valueTypes.Mat4.mul(this._worldMatrix, parentMat, this._matrix);
  } else {
    _valueTypes.Mat4.copy(this._worldMatrix, this._matrix);
  }

  this._worldMatDirty = false;
}

function calculWorldMatrix2D() {
  // Avoid as much function call as possible
  if (this._localMatDirty & LocalDirtyFlag.TRSS) {
    this._updateLocalMatrix();
  } // Assume parent world matrix is correct


  var parent = this._parent;

  if (parent) {
    this._mulMat(this._worldMatrix, parent._worldMatrix, this._matrix);
  } else {
    _valueTypes.Mat4.copy(this._worldMatrix, this._matrix);
  }

  this._worldMatDirty = false;
}

function mulMat2D(out, a, b) {
  var am = a.m,
      bm = b.m,
      outm = out.m;
  var aa = am[0],
      ab = am[1],
      ac = am[4],
      ad = am[5],
      atx = am[12],
      aty = am[13];
  var ba = bm[0],
      bb = bm[1],
      bc = bm[4],
      bd = bm[5],
      btx = bm[12],
      bty = bm[13];

  if (ab !== 0 || ac !== 0) {
    outm[0] = ba * aa + bb * ac;
    outm[1] = ba * ab + bb * ad;
    outm[4] = bc * aa + bd * ac;
    outm[5] = bc * ab + bd * ad;
    outm[12] = aa * btx + ac * bty + atx;
    outm[13] = ab * btx + ad * bty + aty;
  } else {
    outm[0] = ba * aa;
    outm[1] = bb * ad;
    outm[4] = bc * aa;
    outm[5] = bd * ad;
    outm[12] = aa * btx + atx;
    outm[13] = ad * bty + aty;
  }
}

var mulMat3D = _valueTypes.Mat4.mul;
/**
 * !#en
 * Class of all entities in Cocos Creator scenes.<br/>
 * For events supported by Node, please refer to {{#crossLink "Node.EventType"}}{{/crossLink}}
 * !#zh
 * Cocos Creator 场景中的所有节点类。<br/>
 * 支持的节点事件，请参阅 {{#crossLink "Node.EventType"}}{{/crossLink}}。
 * @class Node
 * @extends _BaseNode
 */

var NodeDefines = {
  name: 'cc.Node',
  "extends": BaseNode,
  properties: {
    // SERIALIZABLE
    _opacity: 255,
    _color: cc.Color.WHITE,
    _contentSize: cc.Size,
    _anchorPoint: cc.v2(0.5, 0.5),
    _position: undefined,
    _scale: undefined,
    _trs: null,
    _eulerAngles: cc.Vec3,
    _skewX: 0.0,
    _skewY: 0.0,
    _zIndex: {
      "default": undefined,
      type: cc.Integer
    },
    _localZOrder: {
      "default": 0,
      serializable: false
    },
    _is3DNode: false,
    // internal properties

    /**
     * !#en
     * Group index of node.<br/>
     * Which Group this node belongs to will resolve that this node's collision components can collide with which other collision componentns.<br/>
     * !#zh
     * 节点的分组索引。<br/>
     * 节点的分组将关系到节点的碰撞组件可以与哪些碰撞组件相碰撞。<br/>
     * @property groupIndex
     * @type {Integer}
     * @default 0
     */
    _groupIndex: {
      "default": 0,
      formerlySerializedAs: 'groupIndex'
    },
    groupIndex: {
      get: function get() {
        return this._groupIndex;
      },
      set: function set(value) {
        this._groupIndex = value;

        _updateCullingMask(this);

        this.emit(EventType.GROUP_CHANGED, this);
      }
    },

    /**
     * !#en
     * Group of node.<br/>
     * Which Group this node belongs to will resolve that this node's collision components can collide with which other collision componentns.<br/>
     * !#zh
     * 节点的分组。<br/>
     * 节点的分组将关系到节点的碰撞组件可以与哪些碰撞组件相碰撞。<br/>
     * @property group
     * @type {String}
     */
    group: {
      get: function get() {
        return cc.game.groupList[this.groupIndex] || '';
      },
      set: function set(value) {
        // update the groupIndex
        this.groupIndex = cc.game.groupList.indexOf(value);
      }
    },
    //properties moved from base node begin

    /**
     * !#en The position (x, y) of the node in its parent's coordinates.
     * !#zh 节点在父节点坐标系中的位置（x, y）。
     * @property {Vec3} position
     * @example
     * cc.log("Node Position: " + node.position);
     */

    /**
     * !#en x axis position of node.
     * !#zh 节点 X 轴坐标。
     * @property x
     * @type {Number}
     * @example
     * node.x = 100;
     * cc.log("Node Position X: " + node.x);
     */
    x: {
      get: function get() {
        return this._trs[0];
      },
      set: function set(value) {
        var trs = this._trs;

        if (value !== trs[0]) {
          if (!CC_EDITOR || isFinite(value)) {
            var oldValue;

            if (CC_EDITOR) {
              oldValue = trs[0];
            }

            trs[0] = value;
            this.setLocalDirty(LocalDirtyFlag.ALL_POSITION); // fast check event

            if (this._eventMask & POSITION_ON) {
              // send event
              if (CC_EDITOR) {
                this.emit(EventType.POSITION_CHANGED, new cc.Vec3(oldValue, trs[1], trs[2]));
              } else {
                this.emit(EventType.POSITION_CHANGED);
              }
            }
          } else {
            cc.error(ERR_INVALID_NUMBER, 'new x');
          }
        }
      }
    },

    /**
     * !#en y axis position of node.
     * !#zh 节点 Y 轴坐标。
     * @property y
     * @type {Number}
     * @example
     * node.y = 100;
     * cc.log("Node Position Y: " + node.y);
     */
    y: {
      get: function get() {
        return this._trs[1];
      },
      set: function set(value) {
        var trs = this._trs;

        if (value !== trs[1]) {
          if (!CC_EDITOR || isFinite(value)) {
            var oldValue;

            if (CC_EDITOR) {
              oldValue = trs[1];
            }

            trs[1] = value;
            this.setLocalDirty(LocalDirtyFlag.ALL_POSITION); // fast check event

            if (this._eventMask & POSITION_ON) {
              // send event
              if (CC_EDITOR) {
                this.emit(EventType.POSITION_CHANGED, new cc.Vec3(trs[0], oldValue, trs[2]));
              } else {
                this.emit(EventType.POSITION_CHANGED);
              }
            }
          } else {
            cc.error(ERR_INVALID_NUMBER, 'new y');
          }
        }
      }
    },

    /**
     * !#en z axis position of node.
     * !#zh 节点 Z 轴坐标。
     * @property z
     * @type {Number}
     */
    z: {
      get: function get() {
        return this._trs[2];
      },
      set: function set(value) {
        var trs = this._trs;

        if (value !== trs[2]) {
          if (!CC_EDITOR || isFinite(value)) {
            trs[2] = value;
            this.setLocalDirty(LocalDirtyFlag.ALL_POSITION);
            !CC_NATIVERENDERER && (this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM); // fast check event

            if (this._eventMask & POSITION_ON) {
              this.emit(EventType.POSITION_CHANGED);
            }
          } else {
            cc.error(ERR_INVALID_NUMBER, 'new z');
          }
        }
      }
    },

    /**
     * !#en Rotation of node.
     * !#zh 该节点旋转角度。
     * @property rotation
     * @type {Number}
     * @deprecated since v2.1
     * @example
     * node.rotation = 90;
     * cc.log("Node Rotation: " + node.rotation);
     */
    rotation: {
      get: function get() {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotation` is deprecated since v2.1.0, please use `-angle` instead. (`this.node.rotation` -> `-this.node.angle`)");
        }

        return -this.angle;
      },
      set: function set(value) {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotation` is deprecated since v2.1.0, please set `-angle` instead. (`this.node.rotation = x` -> `this.node.angle = -x`)");
        }

        this.angle = -value;
      }
    },

    /**
     * !#en
     * Angle of node, the positive value is anti-clockwise direction.
     * !#zh
     * 该节点的旋转角度，正值为逆时针方向。
     * @property angle
     * @type {Number}
     */
    angle: {
      get: function get() {
        return this._eulerAngles.z;
      },
      set: function set(value) {
        _valueTypes.Vec3.set(this._eulerAngles, 0, 0, value);

        _valueTypes.Trs.fromAngleZ(this._trs, value);

        this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);

        if (this._eventMask & ROTATION_ON) {
          this.emit(EventType.ROTATION_CHANGED);
        }
      }
    },

    /**
     * !#en The rotation as Euler angles in degrees, used in 3D node.
     * !#zh 该节点的欧拉角度，用于 3D 节点。
     * @property eulerAngles
     * @type {Vec3}
     * @example
     * node.is3DNode = true;
     * node.eulerAngles = cc.v3(45, 45, 45);
     * cc.log("Node eulerAngles (X, Y, Z): " + node.eulerAngles.toString());
     */

    /**
     * !#en Rotation on x axis.
     * !#zh 该节点 X 轴旋转角度。
     * @property rotationX
     * @type {Number}
     * @deprecated since v2.1
     * @example
     * node.is3DNode = true;
     * node.eulerAngles = cc.v3(45, 0, 0);
     * cc.log("Node eulerAngles X: " + node.eulerAngles.x);
     */
    rotationX: {
      get: function get() {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotationX` is deprecated since v2.1.0, please use `eulerAngles.x` instead. (`this.node.rotationX` -> `this.node.eulerAngles.x`)");
        }

        return this._eulerAngles.x;
      },
      set: function set(value) {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotationX` is deprecated since v2.1.0, please set `eulerAngles` instead. (`this.node.rotationX = x` -> `this.node.is3DNode = true; this.node.eulerAngles = cc.v3(x, 0, 0)`");
        }

        if (this._eulerAngles.x !== value) {
          this._eulerAngles.x = value; // Update quaternion from rotation

          if (this._eulerAngles.x === this._eulerAngles.y) {
            _valueTypes.Trs.fromAngleZ(this._trs, -value);
          } else {
            _valueTypes.Trs.fromEulerNumber(this._trs, value, this._eulerAngles.y, 0);
          }

          this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);

          if (this._eventMask & ROTATION_ON) {
            this.emit(EventType.ROTATION_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Rotation on y axis.
     * !#zh 该节点 Y 轴旋转角度。
     * @property rotationY
     * @type {Number}
     * @deprecated since v2.1
     * @example
     * node.is3DNode = true;
     * node.eulerAngles = cc.v3(0, 45, 0);
     * cc.log("Node eulerAngles Y: " + node.eulerAngles.y);
     */
    rotationY: {
      get: function get() {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotationY` is deprecated since v2.1.0, please use `eulerAngles.y` instead. (`this.node.rotationY` -> `this.node.eulerAngles.y`)");
        }

        return this._eulerAngles.y;
      },
      set: function set(value) {
        if (CC_DEBUG) {
          cc.warn("`cc.Node.rotationY` is deprecated since v2.1.0, please set `eulerAngles` instead. (`this.node.rotationY = y` -> `this.node.is3DNode = true; this.node.eulerAngles = cc.v3(0, y, 0)`");
        }

        if (this._eulerAngles.y !== value) {
          this._eulerAngles.y = value; // Update quaternion from rotation

          if (this._eulerAngles.x === this._eulerAngles.y) {
            _valueTypes.Trs.fromAngleZ(this._trs, -value);
          } else {
            _valueTypes.Trs.fromEulerNumber(this._trs, this._eulerAngles.x, value, 0);
          }

          this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);

          if (this._eventMask & ROTATION_ON) {
            this.emit(EventType.ROTATION_CHANGED);
          }
        }
      }
    },
    eulerAngles: {
      get: function get() {
        if (CC_EDITOR) {
          return this._eulerAngles;
        } else {
          return _valueTypes.Trs.toEuler(this._eulerAngles, this._trs);
        }
      },
      set: function set(v) {
        if (CC_EDITOR) {
          this._eulerAngles.set(v);
        }

        _valueTypes.Trs.fromEuler(this._trs, v);

        this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);
        !CC_NATIVERENDERER && (this._renderFlag |= RenderFlow.FLAG_TRANSFORM);
      }
    },
    // This property is used for Mesh Skeleton Animation
    // Should be removed when node.rotation upgrade to quaternion value
    quat: {
      get: function get() {
        var trs = this._trs;
        return new _valueTypes.Quat(trs[3], trs[4], trs[5], trs[6]);
      },
      set: function set(v) {
        this.setRotation(v);
      }
    },

    /**
     * !#en The local scale relative to the parent.
     * !#zh 节点相对父节点的缩放。
     * @property scale
     * @type {Number}
     * @example
     * node.scale = 1;
     */
    scale: {
      get: function get() {
        return this._trs[7];
      },
      set: function set(v) {
        this.setScale(v);
      }
    },

    /**
     * !#en Scale on x axis.
     * !#zh 节点 X 轴缩放。
     * @property scaleX
     * @type {Number}
     * @example
     * node.scaleX = 0.5;
     * cc.log("Node Scale X: " + node.scaleX);
     */
    scaleX: {
      get: function get() {
        return this._trs[7];
      },
      set: function set(value) {
        if (this._trs[7] !== value) {
          this._trs[7] = value;
          this.setLocalDirty(LocalDirtyFlag.ALL_SCALE);

          if (this._eventMask & SCALE_ON) {
            this.emit(EventType.SCALE_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Scale on y axis.
     * !#zh 节点 Y 轴缩放。
     * @property scaleY
     * @type {Number}
     * @example
     * node.scaleY = 0.5;
     * cc.log("Node Scale Y: " + node.scaleY);
     */
    scaleY: {
      get: function get() {
        return this._trs[8];
      },
      set: function set(value) {
        if (this._trs[8] !== value) {
          this._trs[8] = value;
          this.setLocalDirty(LocalDirtyFlag.ALL_SCALE);

          if (this._eventMask & SCALE_ON) {
            this.emit(EventType.SCALE_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Scale on z axis.
     * !#zh 节点 Z 轴缩放。
     * @property scaleZ
     * @type {Number}
     */
    scaleZ: {
      get: function get() {
        return this._trs[9];
      },
      set: function set(value) {
        if (this._trs[9] !== value) {
          this._trs[9] = value;
          this.setLocalDirty(LocalDirtyFlag.ALL_SCALE);
          !CC_NATIVERENDERER && (this._renderFlag |= RenderFlow.FLAG_TRANSFORM);

          if (this._eventMask & SCALE_ON) {
            this.emit(EventType.SCALE_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Skew x
     * !#zh 该节点 X 轴倾斜角度。
     * @property skewX
     * @type {Number}
     * @example
     * node.skewX = 0;
     * cc.log("Node SkewX: " + node.skewX);
     * @deprecated since v2.2.1
     */
    skewX: {
      get: function get() {
        return this._skewX;
      },
      set: function set(value) {
        _skewWarn(value, this);

        this._skewX = value;
        this.setLocalDirty(LocalDirtyFlag.SKEW);

        if (CC_JSB && CC_NATIVERENDERER) {
          this._proxy.updateSkew();
        }
      }
    },

    /**
     * !#en Skew y
     * !#zh 该节点 Y 轴倾斜角度。
     * @property skewY
     * @type {Number}
     * @example
     * node.skewY = 0;
     * cc.log("Node SkewY: " + node.skewY);
     * @deprecated since v2.2.1
     */
    skewY: {
      get: function get() {
        return this._skewY;
      },
      set: function set(value) {
        _skewWarn(value, this);

        this._skewY = value;
        this.setLocalDirty(LocalDirtyFlag.SKEW);

        if (CC_JSB && CC_NATIVERENDERER) {
          this._proxy.updateSkew();
        }
      }
    },

    /**
     * !#en Opacity of node, default value is 255.
     * !#zh 节点透明度，默认值为 255。
     * @property opacity
     * @type {Number}
     * @example
     * node.opacity = 255;
     */
    opacity: {
      get: function get() {
        return this._opacity;
      },
      set: function set(value) {
        value = cc.misc.clampf(value, 0, 255);

        if (this._opacity !== value) {
          this._opacity = value;

          if (CC_JSB && CC_NATIVERENDERER) {
            this._proxy.updateOpacity();
          }

          ;
          this._renderFlag |= RenderFlow.FLAG_OPACITY_COLOR;
        }
      },
      range: [0, 255]
    },

    /**
     * !#en Color of node, default value is white: (255, 255, 255).
     * !#zh 节点颜色。默认为白色，数值为：（255，255，255）。
     * @property color
     * @type {Color}
     * @example
     * node.color = new cc.Color(255, 255, 255);
     */
    color: {
      get: function get() {
        return this._color.clone();
      },
      set: function set(value) {
        if (!this._color.equals(value)) {
          this._color.set(value);

          if (CC_DEV && value.a !== 255) {
            cc.warnID(1626);
          }

          this._renderFlag |= RenderFlow.FLAG_COLOR;

          if (this._eventMask & COLOR_ON) {
            this.emit(EventType.COLOR_CHANGED, value);
          }
        }
      }
    },

    /**
     * !#en Anchor point's position on x axis.
     * !#zh 节点 X 轴锚点位置。
     * @property anchorX
     * @type {Number}
     * @example
     * node.anchorX = 0;
     */
    anchorX: {
      get: function get() {
        return this._anchorPoint.x;
      },
      set: function set(value) {
        var anchorPoint = this._anchorPoint;

        if (anchorPoint.x !== value) {
          anchorPoint.x = value;

          if (this._eventMask & ANCHOR_ON) {
            this.emit(EventType.ANCHOR_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Anchor point's position on y axis.
     * !#zh 节点 Y 轴锚点位置。
     * @property anchorY
     * @type {Number}
     * @example
     * node.anchorY = 0;
     */
    anchorY: {
      get: function get() {
        return this._anchorPoint.y;
      },
      set: function set(value) {
        var anchorPoint = this._anchorPoint;

        if (anchorPoint.y !== value) {
          anchorPoint.y = value;

          if (this._eventMask & ANCHOR_ON) {
            this.emit(EventType.ANCHOR_CHANGED);
          }
        }
      }
    },

    /**
     * !#en Width of node.
     * !#zh 节点宽度。
     * @property width
     * @type {Number}
     * @example
     * node.width = 100;
     */
    width: {
      get: function get() {
        return this._contentSize.width;
      },
      set: function set(value) {
        if (value !== this._contentSize.width) {
          if (CC_EDITOR) {
            var clone = cc.size(this._contentSize.width, this._contentSize.height);
          }

          this._contentSize.width = value;

          if (this._eventMask & SIZE_ON) {
            if (CC_EDITOR) {
              this.emit(EventType.SIZE_CHANGED, clone);
            } else {
              this.emit(EventType.SIZE_CHANGED);
            }
          }
        }
      }
    },

    /**
     * !#en Height of node.
     * !#zh 节点高度。
     * @property height
     * @type {Number}
     * @example
     * node.height = 100;
     */
    height: {
      get: function get() {
        return this._contentSize.height;
      },
      set: function set(value) {
        if (value !== this._contentSize.height) {
          if (CC_EDITOR) {
            var clone = cc.size(this._contentSize.width, this._contentSize.height);
          }

          this._contentSize.height = value;

          if (this._eventMask & SIZE_ON) {
            if (CC_EDITOR) {
              this.emit(EventType.SIZE_CHANGED, clone);
            } else {
              this.emit(EventType.SIZE_CHANGED);
            }
          }
        }
      }
    },

    /**
     * !#en zIndex is the 'key' used to sort the node relative to its siblings.<br/>
     * The value of zIndex should be in the range between cc.macro.MIN_ZINDEX and cc.macro.MAX_ZINDEX.<br/>
     * The Node's parent will sort all its children based on the zIndex value and the arrival order.<br/>
     * Nodes with greater zIndex will be sorted after nodes with smaller zIndex.<br/>
     * If two nodes have the same zIndex, then the node that was added first to the children's array will be in front of the other node in the array.<br/>
     * Node's order in children list will affect its rendering order. Parent is always rendering before all children.
     * !#zh zIndex 是用来对节点进行排序的关键属性，它决定一个节点在兄弟节点之间的位置。<br/>
     * zIndex 的取值应该介于 cc.macro.MIN_ZINDEX 和 cc.macro.MAX_ZINDEX 之间
     * 父节点主要根据节点的 zIndex 和添加次序来排序，拥有更高 zIndex 的节点将被排在后面，如果两个节点的 zIndex 一致，先添加的节点会稳定排在另一个节点之前。<br/>
     * 节点在 children 中的顺序决定了其渲染顺序。父节点永远在所有子节点之前被渲染
     * @property zIndex
     * @type {Number}
     * @example
     * node.zIndex = 1;
     * cc.log("Node zIndex: " + node.zIndex);
     */
    zIndex: {
      get: function get() {
        return this._localZOrder >> 16;
      },
      set: function set(value) {
        if (value > macro.MAX_ZINDEX) {
          cc.warnID(1636);
          value = macro.MAX_ZINDEX;
        } else if (value < macro.MIN_ZINDEX) {
          cc.warnID(1637);
          value = macro.MIN_ZINDEX;
        }

        if (this.zIndex !== value) {
          this._localZOrder = this._localZOrder & 0x0000ffff | value << 16;
          this.emit(EventType.SIBLING_ORDER_CHANGED);

          this._onSiblingIndexChanged();
        }
      }
    },

    /**
     * !#en
     * Switch 2D/3D node. The 2D nodes will run faster.
     * !#zh
     * 切换 2D/3D 节点，2D 节点会有更高的运行效率
     * @property {Boolean} is3DNode
     * @default false
    */
    is3DNode: {
      get: function get() {
        return this._is3DNode;
      },
      set: function set(v) {
        this._is3DNode = v;

        this._update3DFunction();
      }
    }
  },

  /**
   * @method constructor
   * @param {String} [name]
   */
  ctor: function ctor() {
    this._reorderChildDirty = false; // cache component

    this._widget = null; // fast render component access

    this._renderComponent = null; // Event listeners

    this._capturingListeners = null;
    this._bubblingListeners = null; // Touch event listener

    this._touchListener = null; // Mouse event listener

    this._mouseListener = null;

    this._initDataFromPool();

    this._eventMask = 0;
    this._cullingMask = 1;
    this._childArrivalOrder = 1; // Proxy

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy = new renderer.NodeProxy(this._spaceInfo.unitID, this._spaceInfo.index, this._id, this._name);

      this._proxy.init(this);
    } // should reset _renderFlag for both web and native


    this._renderFlag = RenderFlow.FLAG_TRANSFORM | RenderFlow.FLAG_OPACITY_COLOR;
  },
  statics: {
    EventType: EventType,
    _LocalDirtyFlag: LocalDirtyFlag,
    // is node but not scene
    isNode: function isNode(obj) {
      return obj instanceof Node && (obj.constructor === Node || !(obj instanceof cc.Scene));
    },
    BuiltinGroupIndex: BuiltinGroupIndex
  },
  // OVERRIDES
  _onSiblingIndexChanged: function _onSiblingIndexChanged() {
    // update rendering scene graph, sort them by arrivalOrder
    if (this._parent) {
      this._parent._delaySort();
    }
  },
  _onPreDestroy: function _onPreDestroy() {
    var destroyByParent = this._onPreDestroyBase(); // Actions


    if (ActionManagerExist) {
      cc.director.getActionManager().removeAllActionsFromTarget(this);
    } // Remove Node.currentHovered


    if (_currentHovered === this) {
      _currentHovered = null;
    } // Remove all event listeners if necessary


    if (this._touchListener || this._mouseListener) {
      eventManager.removeListeners(this);

      if (this._touchListener) {
        this._touchListener.owner = null;
        this._touchListener.mask = null;
        this._touchListener = null;
      }

      if (this._mouseListener) {
        this._mouseListener.owner = null;
        this._mouseListener.mask = null;
        this._mouseListener = null;
      }
    }

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy.destroy();

      this._proxy = null;
    }

    this._backDataIntoPool();

    if (this._reorderChildDirty) {
      cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
    }

    if (!destroyByParent) {
      // simulate some destruct logic to make undo system work correctly
      if (CC_EDITOR) {
        // ensure this node can reattach to scene by undo system
        this._parent = null;
      }
    }
  },
  _onPostActivated: function _onPostActivated(active) {
    var actionManager = ActionManagerExist ? cc.director.getActionManager() : null;

    if (active) {
      // Refresh transform
      this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM; // ActionManager & EventManager

      actionManager && actionManager.resumeTarget(this);
      eventManager.resumeTarget(this); // Search Mask in parent

      this._checkListenerMask();
    } else {
      // deactivate
      actionManager && actionManager.pauseTarget(this);
      eventManager.pauseTarget(this);
    }
  },
  _onHierarchyChanged: function _onHierarchyChanged(oldParent) {
    this._updateOrderOfArrival(); // Fixed a bug where children and parent node groups were forced to synchronize, instead of only synchronizing `_cullingMask` value


    _updateCullingMask(this);

    if (this._parent) {
      this._parent._delaySort();
    }

    this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM;

    this._onHierarchyChangedBase(oldParent);

    if (cc._widgetManager) {
      cc._widgetManager._nodesOrderDirty = true;
    }

    if (oldParent && this._activeInHierarchy) {
      //TODO: It may be necessary to update the listener mask of all child nodes.
      this._checkListenerMask();
    } // Node proxy


    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy.updateParent();
    }
  },
  // INTERNAL
  _update3DFunction: function _update3DFunction() {
    if (this._is3DNode) {
      this._updateLocalMatrix = updateLocalMatrix3D;
      this._calculWorldMatrix = calculWorldMatrix3D;
      this._mulMat = mulMat3D;
    } else {
      this._updateLocalMatrix = updateLocalMatrix2D;
      this._calculWorldMatrix = calculWorldMatrix2D;
      this._mulMat = mulMat2D;
    }

    if (this._renderComponent && this._renderComponent._on3DNodeChanged) {
      this._renderComponent._on3DNodeChanged();
    }

    this._renderFlag |= RenderFlow.FLAG_TRANSFORM;
    this._localMatDirty = LocalDirtyFlag.ALL;

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy.update3DNode();
    }
  },
  _initDataFromPool: function _initDataFromPool() {
    if (!this._spaceInfo) {
      if (CC_EDITOR || CC_TEST) {
        this._spaceInfo = {
          trs: new Float64Array(10),
          localMat: new Float64Array(16),
          worldMat: new Float64Array(16)
        };
      } else {
        this._spaceInfo = nodeMemPool.pop();
      }
    }

    var spaceInfo = this._spaceInfo;
    this._matrix = cc.mat4(spaceInfo.localMat);

    _valueTypes.Mat4.identity(this._matrix);

    this._worldMatrix = cc.mat4(spaceInfo.worldMat);

    _valueTypes.Mat4.identity(this._worldMatrix);

    this._localMatDirty = LocalDirtyFlag.ALL;
    this._worldMatDirty = true;
    var trs = this._trs = this._spaceInfo.trs;
    trs[0] = 0; // position.x

    trs[1] = 0; // position.y

    trs[2] = 0; // position.z

    trs[3] = 0; // rotation.x

    trs[4] = 0; // rotation.y

    trs[5] = 0; // rotation.z

    trs[6] = 1; // rotation.w

    trs[7] = 1; // scale.x

    trs[8] = 1; // scale.y

    trs[9] = 1; // scale.z
  },
  _backDataIntoPool: function _backDataIntoPool() {
    if (!(CC_EDITOR || CC_TEST)) {
      // push back to pool
      nodeMemPool.push(this._spaceInfo);
      this._matrix = null;
      this._worldMatrix = null;
      this._trs = null;
      this._spaceInfo = null;
    }
  },
  _toEuler: function _toEuler() {
    if (this.is3DNode) {
      _valueTypes.Trs.toEuler(this._eulerAngles, this._trs);
    } else {
      var z = Math.asin(this._trs[5]) / ONE_DEGREE * 2;

      _valueTypes.Vec3.set(this._eulerAngles, 0, 0, z);
    }
  },
  _fromEuler: function _fromEuler() {
    if (this.is3DNode) {
      _valueTypes.Trs.fromEuler(this._trs, this._eulerAngles);
    } else {
      _valueTypes.Trs.fromAngleZ(this._trs, this._eulerAngles.z);
    }
  },
  _upgrade_1x_to_2x: function _upgrade_1x_to_2x() {
    if (this._is3DNode) {
      this._update3DFunction();
    }

    var trs = this._trs;

    if (trs) {
      var desTrs = trs;
      trs = this._trs = this._spaceInfo.trs; // just adapt to old trs

      if (desTrs.length === 11) {
        trs.set(desTrs.subarray(1));
      } else {
        trs.set(desTrs);
      }
    } else {
      trs = this._trs = this._spaceInfo.trs;
    }

    if (this._zIndex !== undefined) {
      this._localZOrder = this._zIndex << 16;
      this._zIndex = undefined;
    }

    if (CC_EDITOR) {
      if (this._skewX !== 0 || this._skewY !== 0) {
        var NodeUtils = Editor.require('scene://utils/node');

        cc.warn("`cc.Node.skewX/Y` is deprecated since v2.2.1, please use 3D node instead.", "Node: " + NodeUtils.getNodePath(this) + ".");
      }
    }

    this._fromEuler();

    if (this._localZOrder !== 0) {
      this._zIndex = (this._localZOrder & 0xffff0000) >> 16;
    } // Upgrade from 2.0.0 preview 4 & earlier versions
    // TODO: Remove after final version


    if (this._color.a < 255 && this._opacity === 255) {
      this._opacity = this._color.a;
      this._color.a = 255;
    }

    if (CC_JSB && CC_NATIVERENDERER) {
      this._renderFlag |= RenderFlow.FLAG_TRANSFORM | RenderFlow.FLAG_OPACITY_COLOR;
    }
  },

  /*
   * The initializer for Node which will be called before all components onLoad
   */
  _onBatchCreated: function _onBatchCreated() {
    var prefabInfo = this._prefab;

    if (prefabInfo && prefabInfo.sync && prefabInfo.root === this) {
      if (CC_DEV) {
        // TODO - remove all usage of _synced
        cc.assert(!prefabInfo._synced, 'prefab should not synced');
      }

      PrefabHelper.syncWithPrefab(this);
    }

    this._upgrade_1x_to_2x();

    this._updateOrderOfArrival(); // Fixed a bug where children and parent node groups were forced to synchronize, instead of only synchronizing `_cullingMask` value


    this._cullingMask = 1 << _getActualGroupIndex(this);

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy && this._proxy.updateCullingMask();
    }

    ;

    if (!this._activeInHierarchy) {
      // deactivate ActionManager and EventManager by default
      if (ActionManagerExist) {
        cc.director.getActionManager().pauseTarget(this);
      }

      eventManager.pauseTarget(this);
    }

    var children = this._children;

    for (var i = 0, len = children.length; i < len; i++) {
      children[i]._onBatchCreated();
    }

    if (children.length > 0) {
      this._renderFlag |= RenderFlow.FLAG_CHILDREN;
    }

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy.initNative();
    }
  },
  // the same as _onBatchCreated but untouch prefab
  _onBatchRestored: function _onBatchRestored() {
    this._upgrade_1x_to_2x(); // Fixed a bug where children and parent node groups were forced to synchronize, instead of only synchronizing `_cullingMask` value


    this._cullingMask = 1 << _getActualGroupIndex(this);

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy && this._proxy.updateCullingMask();
    }

    ;

    if (!this._activeInHierarchy) {
      // deactivate ActionManager and EventManager by default
      // ActionManager may not be inited in the editor worker.
      var manager = cc.director.getActionManager();
      manager && manager.pauseTarget(this);
      eventManager.pauseTarget(this);
    }

    var children = this._children;

    for (var i = 0, len = children.length; i < len; i++) {
      children[i]._onBatchRestored();
    }

    if (children.length > 0) {
      this._renderFlag |= RenderFlow.FLAG_CHILDREN;
    }

    if (CC_JSB && CC_NATIVERENDERER) {
      this._proxy.initNative();
    }
  },
  // EVENT TARGET
  _checkListenerMask: function _checkListenerMask() {
    // Because Mask may be nested, need to find all the Mask components in the parent node. 
    // The click area must satisfy all Masks to trigger the click.
    if (this._touchListener) {
      var mask = this._touchListener.mask = _searchComponentsInParent(this, cc.Mask);

      if (this._mouseListener) {
        this._mouseListener.mask = mask;
      }
    } else if (this._mouseListener) {
      this._mouseListener.mask = _searchComponentsInParent(this, cc.Mask);
    }
  },
  _checknSetupSysEvent: function _checknSetupSysEvent(type) {
    var newAdded = false;
    var forDispatch = false;

    if (_touchEvents.indexOf(type) !== -1) {
      if (!this._touchListener) {
        this._touchListener = cc.EventListener.create({
          event: cc.EventListener.TOUCH_ONE_BY_ONE,
          swallowTouches: true,
          owner: this,
          mask: _searchComponentsInParent(this, cc.Mask),
          onTouchBegan: _touchStartHandler,
          onTouchMoved: _touchMoveHandler,
          onTouchEnded: _touchEndHandler,
          onTouchCancelled: _touchCancelHandler
        });
        eventManager.addListener(this._touchListener, this);
        newAdded = true;
      }

      forDispatch = true;
    } else if (_mouseEvents.indexOf(type) !== -1) {
      if (!this._mouseListener) {
        this._mouseListener = cc.EventListener.create({
          event: cc.EventListener.MOUSE,
          _previousIn: false,
          owner: this,
          mask: _searchComponentsInParent(this, cc.Mask),
          onMouseDown: _mouseDownHandler,
          onMouseMove: _mouseMoveHandler,
          onMouseUp: _mouseUpHandler,
          onMouseScroll: _mouseWheelHandler
        });
        eventManager.addListener(this._mouseListener, this);
        newAdded = true;
      }

      forDispatch = true;
    }

    if (newAdded && !this._activeInHierarchy) {
      cc.director.getScheduler().schedule(function () {
        if (!this._activeInHierarchy) {
          eventManager.pauseTarget(this);
        }
      }, this, 0, 0, 0, false);
    }

    return forDispatch;
  },

  /**
   * !#en
   * Register a callback of a specific event type on Node.<br/>
   * Use this method to register touch or mouse event permit propagation based on scene graph,<br/>
   * These kinds of event are triggered with dispatchEvent, the dispatch process has three steps:<br/>
   * 1. Capturing phase: dispatch in capture targets (`_getCapturingTargets`), e.g. parents in node tree, from root to the real target<br/>
   * 2. At target phase: dispatch to the listeners of the real target<br/>
   * 3. Bubbling phase: dispatch in bubble targets (`_getBubblingTargets`), e.g. parents in node tree, from the real target to root<br/>
   * In any moment of the dispatching process, it can be stopped via `event.stopPropagation()` or `event.stopPropagationImmidiate()`.<br/>
   * It's the recommended way to register touch/mouse event for Node,<br/>
   * please do not use cc.eventManager directly for Node.<br/>
   * You can also register custom event and use `emit` to trigger custom event on Node.<br/>
   * For such events, there won't be capturing and bubbling phase, your event will be dispatched directly to its listeners registered on the same node.<br/>
   * You can also pass event callback parameters with `emit` by passing parameters after `type`.
   * !#zh
   * 在节点上注册指定类型的回调函数，也可以设置 target 用于绑定响应函数的 this 对象。<br/>
   * 鼠标或触摸事件会被系统调用 dispatchEvent 方法触发，触发的过程包含三个阶段：<br/>
   * 1. 捕获阶段：派发事件给捕获目标（通过 `_getCapturingTargets` 获取），比如，节点树中注册了捕获阶段的父节点，从根节点开始派发直到目标节点。<br/>
   * 2. 目标阶段：派发给目标节点的监听器。<br/>
   * 3. 冒泡阶段：派发事件给冒泡目标（通过 `_getBubblingTargets` 获取），比如，节点树中注册了冒泡阶段的父节点，从目标节点开始派发直到根节点。<br/>
   * 同时您可以将事件派发到父节点或者通过调用 stopPropagation 拦截它。<br/>
   * 推荐使用这种方式来监听节点上的触摸或鼠标事件，请不要在节点上直接使用 cc.eventManager。<br/>
   * 你也可以注册自定义事件到节点上，并通过 emit 方法触发此类事件，对于这类事件，不会发生捕获冒泡阶段，只会直接派发给注册在该节点上的监听器<br/>
   * 你可以通过在 emit 方法调用时在 type 之后传递额外的参数作为事件回调的参数列表
   * @method on
   * @param {String|Node.EventType} type - A string representing the event type to listen for.<br>See {{#crossLink "Node/EventTyupe/POSITION_CHANGED"}}Node Events{{/crossLink}} for all builtin events.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched. The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {Event|any} [callback.event] event or first argument when emit
   * @param {any} [callback.arg2] arg2
   * @param {any} [callback.arg3] arg3
   * @param {any} [callback.arg4] arg4
   * @param {any} [callback.arg5] arg5
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   * @param {Boolean} [useCapture=false] - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
   * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
   * @typescript
   * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
   * @example
   * this.node.on(cc.Node.EventType.TOUCH_START, this.memberFunction, this);  // if "this" is component and the "memberFunction" declared in CCClass.
   * node.on(cc.Node.EventType.TOUCH_START, callback, this);
   * node.on(cc.Node.EventType.TOUCH_MOVE, callback, this);
   * node.on(cc.Node.EventType.TOUCH_END, callback, this);
   * node.on(cc.Node.EventType.TOUCH_CANCEL, callback, this);
   * node.on(cc.Node.EventType.ANCHOR_CHANGED, callback);
   * node.on(cc.Node.EventType.COLOR_CHANGED, callback);
   */
  on: function on(type, callback, target, useCapture) {
    var forDispatch = this._checknSetupSysEvent(type);

    if (forDispatch) {
      return this._onDispatch(type, callback, target, useCapture);
    } else {
      switch (type) {
        case EventType.POSITION_CHANGED:
          this._eventMask |= POSITION_ON;
          break;

        case EventType.SCALE_CHANGED:
          this._eventMask |= SCALE_ON;
          break;

        case EventType.ROTATION_CHANGED:
          this._eventMask |= ROTATION_ON;
          break;

        case EventType.SIZE_CHANGED:
          this._eventMask |= SIZE_ON;
          break;

        case EventType.ANCHOR_CHANGED:
          this._eventMask |= ANCHOR_ON;
          break;

        case EventType.COLOR_CHANGED:
          this._eventMask |= COLOR_ON;
          break;
      }

      if (!this._bubblingListeners) {
        this._bubblingListeners = new EventTarget();
      }

      return this._bubblingListeners.on(type, callback, target);
    }
  },

  /**
   * !#en
   * Register an callback of a specific event type on the Node,
   * the callback will remove itself after the first time it is triggered.
   * !#zh
   * 注册节点的特定事件类型回调，回调会在第一时间被触发后删除自身。
   *
   * @method once
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   *                              The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {Event|any} [callback.event] event or first argument when emit
   * @param {any} [callback.arg2] arg2
   * @param {any} [callback.arg3] arg3
   * @param {any} [callback.arg4] arg4
   * @param {any} [callback.arg5] arg5
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   * @typescript
   * once<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
   * @example
   * node.once(cc.Node.EventType.ANCHOR_CHANGED, callback);
   */
  once: function once(type, callback, target, useCapture) {
    var forDispatch = this._checknSetupSysEvent(type);

    var listeners = null;

    if (forDispatch && useCapture) {
      listeners = this._capturingListeners = this._capturingListeners || new EventTarget();
    } else {
      listeners = this._bubblingListeners = this._bubblingListeners || new EventTarget();
    }

    listeners.once(type, callback, target);
  },
  _onDispatch: function _onDispatch(type, callback, target, useCapture) {
    // Accept also patameters like: (type, callback, useCapture)
    if (typeof target === 'boolean') {
      useCapture = target;
      target = undefined;
    } else useCapture = !!useCapture;

    if (!callback) {
      cc.errorID(6800);
      return;
    }

    var listeners = null;

    if (useCapture) {
      listeners = this._capturingListeners = this._capturingListeners || new EventTarget();
    } else {
      listeners = this._bubblingListeners = this._bubblingListeners || new EventTarget();
    }

    if (!listeners.hasEventListener(type, callback, target)) {
      listeners.on(type, callback, target);

      if (target && target.__eventTargets) {
        target.__eventTargets.push(this);
      }
    }

    return callback;
  },

  /**
   * !#en
   * Removes the callback previously registered with the same type, callback, target and or useCapture.
   * This method is merely an alias to removeEventListener.
   * !#zh 删除之前与同类型，回调，目标或 useCapture 注册的回调。
   * @method off
   * @param {String} type - A string representing the event type being removed.
   * @param {Function} [callback] - The callback to remove.
   * @param {Object} [target] - The target (this object) to invoke the callback, if it's not given, only callback without target will be removed
   * @param {Boolean} [useCapture=false] - When set to true, the listener will be triggered at capturing phase which is ahead of the final target emit, otherwise it will be triggered during bubbling phase.
   * @example
   * this.node.off(cc.Node.EventType.TOUCH_START, this.memberFunction, this);
   * node.off(cc.Node.EventType.TOUCH_START, callback, this.node);
   * node.off(cc.Node.EventType.ANCHOR_CHANGED, callback, this);
   */
  off: function off(type, callback, target, useCapture) {
    var touchEvent = _touchEvents.indexOf(type) !== -1;
    var mouseEvent = !touchEvent && _mouseEvents.indexOf(type) !== -1;

    if (touchEvent || mouseEvent) {
      this._offDispatch(type, callback, target, useCapture);

      if (touchEvent) {
        if (this._touchListener && !_checkListeners(this, _touchEvents)) {
          eventManager.removeListener(this._touchListener);
          this._touchListener = null;
        }
      } else if (mouseEvent) {
        if (this._mouseListener && !_checkListeners(this, _mouseEvents)) {
          eventManager.removeListener(this._mouseListener);
          this._mouseListener = null;
        }
      }
    } else if (this._bubblingListeners) {
      this._bubblingListeners.off(type, callback, target);

      var hasListeners = this._bubblingListeners.hasEventListener(type); // All listener removed


      if (!hasListeners) {
        switch (type) {
          case EventType.POSITION_CHANGED:
            this._eventMask &= ~POSITION_ON;
            break;

          case EventType.SCALE_CHANGED:
            this._eventMask &= ~SCALE_ON;
            break;

          case EventType.ROTATION_CHANGED:
            this._eventMask &= ~ROTATION_ON;
            break;

          case EventType.SIZE_CHANGED:
            this._eventMask &= ~SIZE_ON;
            break;

          case EventType.ANCHOR_CHANGED:
            this._eventMask &= ~ANCHOR_ON;
            break;

          case EventType.COLOR_CHANGED:
            this._eventMask &= ~COLOR_ON;
            break;
        }
      }
    }
  },
  _offDispatch: function _offDispatch(type, callback, target, useCapture) {
    // Accept also patameters like: (type, callback, useCapture)
    if (typeof target === 'boolean') {
      useCapture = target;
      target = undefined;
    } else useCapture = !!useCapture;

    if (!callback) {
      this._capturingListeners && this._capturingListeners.removeAll(type);
      this._bubblingListeners && this._bubblingListeners.removeAll(type);
    } else {
      var listeners = useCapture ? this._capturingListeners : this._bubblingListeners;

      if (listeners) {
        listeners.off(type, callback, target);

        if (target && target.__eventTargets) {
          js.array.fastRemove(target.__eventTargets, this);
        }
      }
    }
  },

  /**
   * !#en Removes all callbacks previously registered with the same target.
   * !#zh 移除目标上的所有注册事件。
   * @method targetOff
   * @param {Object} target - The target to be searched for all related callbacks
   * @example
   * node.targetOff(target);
   */
  targetOff: function targetOff(target) {
    var listeners = this._bubblingListeners;

    if (listeners) {
      listeners.targetOff(target); // Check for event mask reset

      if (this._eventMask & POSITION_ON && !listeners.hasEventListener(EventType.POSITION_CHANGED)) {
        this._eventMask &= ~POSITION_ON;
      }

      if (this._eventMask & SCALE_ON && !listeners.hasEventListener(EventType.SCALE_CHANGED)) {
        this._eventMask &= ~SCALE_ON;
      }

      if (this._eventMask & ROTATION_ON && !listeners.hasEventListener(EventType.ROTATION_CHANGED)) {
        this._eventMask &= ~ROTATION_ON;
      }

      if (this._eventMask & SIZE_ON && !listeners.hasEventListener(EventType.SIZE_CHANGED)) {
        this._eventMask &= ~SIZE_ON;
      }

      if (this._eventMask & ANCHOR_ON && !listeners.hasEventListener(EventType.ANCHOR_CHANGED)) {
        this._eventMask &= ~ANCHOR_ON;
      }

      if (this._eventMask & COLOR_ON && !listeners.hasEventListener(EventType.COLOR_CHANGED)) {
        this._eventMask &= ~COLOR_ON;
      }
    }

    if (this._capturingListeners) {
      this._capturingListeners.targetOff(target);
    }

    if (target && target.__eventTargets) {
      js.array.fastRemove(target.__eventTargets, this);
    }

    if (this._touchListener && !_checkListeners(this, _touchEvents)) {
      eventManager.removeListener(this._touchListener);
      this._touchListener = null;
    }

    if (this._mouseListener && !_checkListeners(this, _mouseEvents)) {
      eventManager.removeListener(this._mouseListener);
      this._mouseListener = null;
    }
  },

  /**
   * !#en Checks whether the EventTarget object has any callback registered for a specific type of event.
   * !#zh 检查事件目标对象是否有为特定类型的事件注册的回调。
   * @method hasEventListener
   * @param {String} type - The type of event.
   * @return {Boolean} True if a callback of the specified type is registered; false otherwise.
   */
  hasEventListener: function hasEventListener(type) {
    var has = false;

    if (this._bubblingListeners) {
      has = this._bubblingListeners.hasEventListener(type);
    }

    if (!has && this._capturingListeners) {
      has = this._capturingListeners.hasEventListener(type);
    }

    return has;
  },

  /**
   * !#en
   * Trigger an event directly with the event name and necessary arguments.
   * !#zh
   * 通过事件名发送自定义事件
   *
   * @method emit
   * @param {String} type - event type
   * @param {*} [arg1] - First argument in callback
   * @param {*} [arg2] - Second argument in callback
   * @param {*} [arg3] - Third argument in callback
   * @param {*} [arg4] - Fourth argument in callback
   * @param {*} [arg5] - Fifth argument in callback
   * @example
   * 
   * eventTarget.emit('fire', event);
   * eventTarget.emit('fire', message, emitter);
   */
  emit: function emit(type, arg1, arg2, arg3, arg4, arg5) {
    if (this._bubblingListeners) {
      this._bubblingListeners.emit(type, arg1, arg2, arg3, arg4, arg5);
    }
  },

  /**
   * !#en
   * Dispatches an event into the event flow.
   * The event target is the EventTarget object upon which the dispatchEvent() method is called.
   * !#zh 分发事件到事件流中。
   *
   * @method dispatchEvent
   * @param {Event} event - The Event object that is dispatched into the event flow
   */
  dispatchEvent: function dispatchEvent(event) {
    _doDispatchEvent(this, event);

    _cachedArray.length = 0;
  },

  /**
   * !#en Pause node related system events registered with the current Node. Node system events includes touch and mouse events.
   * If recursive is set to true, then this API will pause the node system events for the node and all nodes in its sub node tree.
   * Reference: http://docs.cocos2d-x.org/editors_and_tools/creator-chapters/scripting/internal-events/
   * !#zh 暂停当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
   * 如果传递 recursive 为 true，那么这个 API 将暂停本节点和它的子树上所有节点的节点系统事件。
   * 参考：https://www.cocos.com/docs/creator/scripting/internal-events.html
   * @method pauseSystemEvents
   * @param {Boolean} recursive - Whether to pause node system events on the sub node tree.
   * @example
   * node.pauseSystemEvents(true);
   */
  pauseSystemEvents: function pauseSystemEvents(recursive) {
    eventManager.pauseTarget(this, recursive);
  },

  /**
   * !#en Resume node related system events registered with the current Node. Node system events includes touch and mouse events.
   * If recursive is set to true, then this API will resume the node system events for the node and all nodes in its sub node tree.
   * Reference: http://docs.cocos2d-x.org/editors_and_tools/creator-chapters/scripting/internal-events/
   * !#zh 恢复当前节点上注册的所有节点系统事件，节点系统事件包含触摸和鼠标事件。
   * 如果传递 recursive 为 true，那么这个 API 将恢复本节点和它的子树上所有节点的节点系统事件。
   * 参考：https://www.cocos.com/docs/creator/scripting/internal-events.html
   * @method resumeSystemEvents
   * @param {Boolean} recursive - Whether to resume node system events on the sub node tree.
   * @example
   * node.resumeSystemEvents(true);
   */
  resumeSystemEvents: function resumeSystemEvents(recursive) {
    eventManager.resumeTarget(this, recursive);
  },
  _hitTest: function _hitTest(point, listener) {
    var w = this._contentSize.width,
        h = this._contentSize.height,
        cameraPt = _htVec3a,
        testPt = _htVec3b;
    var camera = cc.Camera.findCamera(this);

    if (camera) {
      camera.getScreenToWorldPoint(point, cameraPt);
    } else {
      cameraPt.set(point);
    }

    this._updateWorldMatrix(); // If scale is 0, it can't be hit.


    if (!_valueTypes.Mat4.invert(_mat4_temp, this._worldMatrix)) {
      return false;
    }

    _valueTypes.Vec2.transformMat4(testPt, cameraPt, _mat4_temp);

    testPt.x += this._anchorPoint.x * w;
    testPt.y += this._anchorPoint.y * h;
    var hit = false;

    if (testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h) {
      hit = true;

      if (listener && listener.mask) {
        var mask = listener.mask;
        var parent = this;
        var length = mask ? mask.length : 0; // find mask parent, should hit test it

        for (var i = 0, j = 0; parent && j < length; ++i, parent = parent.parent) {
          var temp = mask[j];

          if (i === temp.index) {
            if (parent === temp.node) {
              var comp = parent.getComponent(cc.Mask);

              if (comp && comp._enabled && !comp._hitTest(cameraPt)) {
                hit = false;
                break;
              }

              j++;
            } else {
              // mask parent no longer exists
              mask.length = j;
              break;
            }
          } else if (i > temp.index) {
            // mask parent no longer exists
            mask.length = j;
            break;
          }
        }
      }
    }

    return hit;
  },

  /**
   * Get all the targets listening to the supplied type of event in the target's capturing phase.
   * The capturing phase comprises the journey from the root to the last node BEFORE the event target's node.
   * The result should save in the array parameter, and MUST SORT from child nodes to parent nodes.
   *
   * Subclasses can override this method to make event propagable.
   * @method _getCapturingTargets
   * @private
   * @param {String} type - the event type
   * @param {Array} array - the array to receive targets
   * @example {@link cocos2d/core/event/_getCapturingTargets.js}
   */
  _getCapturingTargets: function _getCapturingTargets(type, array) {
    var parent = this.parent;

    while (parent) {
      if (parent._capturingListeners && parent._capturingListeners.hasEventListener(type)) {
        array.push(parent);
      }

      parent = parent.parent;
    }
  },

  /**
   * Get all the targets listening to the supplied type of event in the target's bubbling phase.
   * The bubbling phase comprises any SUBSEQUENT nodes encountered on the return trip to the root of the tree.
   * The result should save in the array parameter, and MUST SORT from child nodes to parent nodes.
   *
   * Subclasses can override this method to make event propagable.
   * @method _getBubblingTargets
   * @private
   * @param {String} type - the event type
   * @param {Array} array - the array to receive targets
   */
  _getBubblingTargets: function _getBubblingTargets(type, array) {
    var parent = this.parent;

    while (parent) {
      if (parent._bubblingListeners && parent._bubblingListeners.hasEventListener(type)) {
        array.push(parent);
      }

      parent = parent.parent;
    }
  },
  // ACTIONS

  /**
   * !#en
   * Executes an action, and returns the action that is executed.<br/>
   * The node becomes the action's target. Refer to cc.Action's getTarget() <br/>
   * Calling runAction while the node is not active won't have any effect. <br/>
   * Note：You shouldn't modify the action after runAction, that won't take any effect.<br/>
   * if you want to modify, when you define action plus.
   * !#zh
   * 执行并返回该执行的动作。该节点将会变成动作的目标。<br/>
   * 调用 runAction 时，节点自身处于不激活状态将不会有任何效果。<br/>
   * 注意：你不应该修改 runAction 后的动作，将无法发挥作用，如果想进行修改，请在定义 action 时加入。
   * @method runAction
   * @param {Action} action
   * @return {Action} An Action pointer
   * @example
   * var action = cc.scaleTo(0.2, 1, 0.6);
   * node.runAction(action);
   * node.runAction(action).repeatForever(); // fail
   * node.runAction(action.repeatForever()); // right
   */
  runAction: ActionManagerExist ? function (action) {
    if (!this.active) return;
    cc.assertID(action, 1618);
    var am = cc.director.getActionManager();

    if (!am._suppressDeprecation) {
      am._suppressDeprecation = true;
      cc.warnID(1639);
    }

    am.addAction(action, this, false);
    return action;
  } : emptyFunc,

  /**
   * !#en Pause all actions running on the current node. Equals to `cc.director.getActionManager().pauseTarget(node)`.
   * !#zh 暂停本节点上所有正在运行的动作。和 `cc.director.getActionManager().pauseTarget(node);` 等价。
   * @method pauseAllActions
   * @example
   * node.pauseAllActions();
   */
  pauseAllActions: ActionManagerExist ? function () {
    cc.director.getActionManager().pauseTarget(this);
  } : emptyFunc,

  /**
   * !#en Resume all paused actions on the current node. Equals to `cc.director.getActionManager().resumeTarget(node)`.
   * !#zh 恢复运行本节点上所有暂停的动作。和 `cc.director.getActionManager().resumeTarget(node);` 等价。
   * @method resumeAllActions
   * @example
   * node.resumeAllActions();
   */
  resumeAllActions: ActionManagerExist ? function () {
    cc.director.getActionManager().resumeTarget(this);
  } : emptyFunc,

  /**
   * !#en Stops and removes all actions from the running action list .
   * !#zh 停止并且移除所有正在运行的动作列表。
   * @method stopAllActions
   * @example
   * node.stopAllActions();
   */
  stopAllActions: ActionManagerExist ? function () {
    cc.director.getActionManager().removeAllActionsFromTarget(this);
  } : emptyFunc,

  /**
   * !#en Stops and removes an action from the running action list.
   * !#zh 停止并移除指定的动作。
   * @method stopAction
   * @param {Action} action An action object to be removed.
   * @example
   * var action = cc.scaleTo(0.2, 1, 0.6);
   * node.stopAction(action);
   */
  stopAction: ActionManagerExist ? function (action) {
    cc.director.getActionManager().removeAction(action);
  } : emptyFunc,

  /**
   * !#en Removes an action from the running action list by its tag.
   * !#zh 停止并且移除指定标签的动作。
   * @method stopActionByTag
   * @param {Number} tag A tag that indicates the action to be removed.
   * @example
   * node.stopActionByTag(1);
   */
  stopActionByTag: ActionManagerExist ? function (tag) {
    if (tag === cc.Action.TAG_INVALID) {
      cc.logID(1612);
      return;
    }

    cc.director.getActionManager().removeActionByTag(tag, this);
  } : emptyFunc,

  /**
   * !#en Returns an action from the running action list by its tag.
   * !#zh 通过标签获取指定动作。
   * @method getActionByTag
   * @see cc.Action#getTag and cc.Action#setTag
   * @param {Number} tag
   * @return {Action} The action object with the given tag.
   * @example
   * var action = node.getActionByTag(1);
   */
  getActionByTag: ActionManagerExist ? function (tag) {
    if (tag === cc.Action.TAG_INVALID) {
      cc.logID(1613);
      return null;
    }

    return cc.director.getActionManager().getActionByTag(tag, this);
  } : function () {
    return null;
  },

  /**
   * !#en
   * Returns the numbers of actions that are running plus the ones that are schedule to run (actions in actionsToAdd and actions arrays).<br/>
   *    Composable actions are counted as 1 action. Example:<br/>
   *    If you are running 1 Sequence of 7 actions, it will return 1. <br/>
   *    If you are running 7 Sequences of 2 actions, it will return 7.</p>
   * !#zh
   * 获取运行着的动作加上正在调度运行的动作的总数。<br/>
   * 例如：<br/>
   * - 如果你正在运行 7 个动作中的 1 个 Sequence，它将返回 1。<br/>
   * - 如果你正在运行 2 个动作中的 7 个 Sequence，它将返回 7。<br/>
   *
   * @method getNumberOfRunningActions
   * @return {Number} The number of actions that are running plus the ones that are schedule to run
   * @example
   * var count = node.getNumberOfRunningActions();
   * cc.log("Running Action Count: " + count);
   */
  getNumberOfRunningActions: ActionManagerExist ? function () {
    return cc.director.getActionManager().getNumberOfRunningActionsInTarget(this);
  } : function () {
    return 0;
  },
  // TRANSFORM RELATED

  /**
   * !#en
   * Returns a copy of the position (x, y, z) of the node in its parent's coordinates.
   * You can pass a cc.Vec2 or cc.Vec3 as the argument to receive the return values.
   * !#zh
   * 获取节点在父节点坐标系中的位置（x, y, z）。
   * 你可以传一个 cc.Vec2 或者 cc.Vec3 作为参数来接收返回值。
   * @method getPosition
   * @param {Vec2|Vec3} [out] - The return value to receive position
   * @return {Vec2|Vec3} The position (x, y, z) of the node in its parent's coordinates
   * @example
   * cc.log("Node Position: " + node.getPosition());
   */
  getPosition: function getPosition(out) {
    out = out || new _valueTypes.Vec3();
    return _valueTypes.Trs.toPosition(out, this._trs);
  },

  /**
   * !#en
   * Sets the position (x, y, z) of the node in its parent's coordinates.<br/>
   * Usually we use cc.v2(x, y) to compose cc.Vec2 object,<br/>
   * and passing two numbers (x, y) is more efficient than passing cc.Vec2 object.
   * For 3D node we can use cc.v3(x, y, z) to compose cc.Vec3 object,<br/>
   * and passing three numbers (x, y, z) is more efficient than passing cc.Vec3 object.
   * !#zh
   * 设置节点在父节点坐标系中的位置。<br/>
   * 可以通过下面的方式设置坐标点：<br/>
   * 1. 传入 2 个数值 x, y。<br/>
   * 2. 传入 cc.v2(x, y) 类型为 cc.Vec2 的对象。
   * 3. 对于 3D 节点可以传入 3 个数值 x, y, z。<br/>
   * 4. 对于 3D 节点可以传入 cc.v3(x, y, z) 类型为 cc.Vec3 的对象。
   * @method setPosition
   * @param {Vec2|Vec3|Number} newPosOrX - X coordinate for position or the position (x, y, z) of the node in coordinates
   * @param {Number} [y] - Y coordinate for position
   * @param {Number} [z] - Z coordinate for position
   */
  setPosition: function setPosition(newPosOrX, y, z) {
    var x;

    if (y === undefined) {
      x = newPosOrX.x;
      y = newPosOrX.y;
      z = newPosOrX.z || 0;
    } else {
      x = newPosOrX;
      z = z || 0;
    }

    var trs = this._trs;

    if (trs[0] === x && trs[1] === y && trs[2] === z) {
      return;
    }

    if (CC_EDITOR) {
      var oldPosition = new cc.Vec3(trs[0], trs[1], trs[2]);
    }

    trs[0] = x;
    trs[1] = y;
    trs[2] = z;
    this.setLocalDirty(LocalDirtyFlag.ALL_POSITION);
    !CC_NATIVERENDERER && (this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM); // fast check event

    if (this._eventMask & POSITION_ON) {
      if (CC_EDITOR) {
        this.emit(EventType.POSITION_CHANGED, oldPosition);
      } else {
        this.emit(EventType.POSITION_CHANGED);
      }
    }
  },

  /**
   * !#en
   * Returns the scale factor of the node.
   * Need pass a cc.Vec2 or cc.Vec3 as the argument to receive the return values.
   * !#zh 获取节点的缩放，需要传一个 cc.Vec2 或者 cc.Vec3 作为参数来接收返回值。
   * @method getScale
   * @param {Vec2|Vec3} out
   * @return {Vec2|Vec3} The scale factor
   * @example
   * cc.log("Node Scale: " + node.getScale(cc.v3()));
   */
  getScale: function getScale(out) {
    if (out !== undefined) {
      return _valueTypes.Trs.toScale(out, this._trs);
    } else {
      cc.warnID(1400, 'cc.Node.getScale', 'cc.Node.scale or cc.Node.getScale(cc.Vec3)');
      return this._trs[7];
    }
  },

  /**
   * !#en
   * Sets the scale of axis in local coordinates of the node.
   * You can operate 2 axis in 2D node, and 3 axis in 3D node.
   * !#zh
   * 设置节点在本地坐标系中坐标轴上的缩放比例。
   * 2D 节点可以操作两个坐标轴，而 3D 节点可以操作三个坐标轴。
   * @method setScale
   * @param {Number|Vec2|Vec3} x - scaleX or scale object
   * @param {Number} [y]
   * @param {Number} [z]
   * @example
   * node.setScale(cc.v2(2, 2));
   * node.setScale(cc.v3(2, 2, 2)); // for 3D node
   * node.setScale(2);
   */
  setScale: function setScale(x, y, z) {
    if (x && typeof x !== 'number') {
      y = x.y;
      z = x.z === undefined ? 1 : x.z;
      x = x.x;
    } else if (x !== undefined && y === undefined) {
      y = x;
      z = x;
    } else if (z === undefined) {
      z = 1;
    }

    var trs = this._trs;

    if (trs[7] !== x || trs[8] !== y || trs[9] !== z) {
      trs[7] = x;
      trs[8] = y;
      trs[9] = z;
      this.setLocalDirty(LocalDirtyFlag.ALL_SCALE);
      !CC_NATIVERENDERER && (this._renderFlag |= RenderFlow.FLAG_TRANSFORM);

      if (this._eventMask & SCALE_ON) {
        this.emit(EventType.SCALE_CHANGED);
      }
    }
  },

  /**
   * !#en
   * Get rotation of node (in quaternion).
   * Need pass a cc.Quat as the argument to receive the return values.
   * !#zh
   * 获取该节点的 quaternion 旋转角度，需要传一个 cc.Quat 作为参数来接收返回值。
   * @method getRotation
   * @param {Quat} out
   * @return {Quat} Quaternion object represents the rotation
   */
  getRotation: function getRotation(out) {
    if (out instanceof _valueTypes.Quat) {
      return _valueTypes.Trs.toRotation(out, this._trs);
    } else {
      if (CC_DEBUG) {
        cc.warn("`cc.Node.getRotation()` is deprecated since v2.1.0, please use `-cc.Node.angle` instead. (`this.node.getRotation()` -> `-this.node.angle`)");
      }

      return -this.angle;
    }
  },

  /**
   * !#en Set rotation of node (in quaternion).
   * !#zh 设置该节点的 quaternion 旋转角度。
   * @method setRotation
   * @param {cc.Quat|Number} quat Quaternion object represents the rotation or the x value of quaternion
   * @param {Number} [y] y value of quternion
   * @param {Number} [z] z value of quternion
   * @param {Number} [w] w value of quternion
   */
  setRotation: function setRotation(rotation, y, z, w) {
    if (typeof rotation === 'number' && y === undefined) {
      if (CC_DEBUG) {
        cc.warn("`cc.Node.setRotation(degree)` is deprecated since v2.1.0, please set `-cc.Node.angle` instead. (`this.node.setRotation(x)` -> `this.node.angle = -x`)");
      }

      this.angle = -rotation;
    } else {
      var x = rotation;

      if (y === undefined) {
        x = rotation.x;
        y = rotation.y;
        z = rotation.z;
        w = rotation.w;
      }

      var trs = this._trs;

      if (trs[3] !== x || trs[4] !== y || trs[5] !== z || trs[6] !== w) {
        trs[3] = x;
        trs[4] = y;
        trs[5] = z;
        trs[6] = w;
        this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);

        if (this._eventMask & ROTATION_ON) {
          this.emit(EventType.ROTATION_CHANGED);
        }

        if (CC_EDITOR) {
          this._toEuler();
        }
      }
    }
  },

  /**
   * !#en
   * Returns a copy the untransformed size of the node. <br/>
   * The contentSize remains the same no matter the node is scaled or rotated.<br/>
   * All nodes has a size. Layer and Scene has the same size of the screen by default. <br/>
   * !#zh 获取节点自身大小，不受该节点是否被缩放或者旋转的影响。
   * @method getContentSize
   * @return {Size} The untransformed size of the node.
   * @example
   * cc.log("Content Size: " + node.getContentSize());
   */
  getContentSize: function getContentSize() {
    return cc.size(this._contentSize.width, this._contentSize.height);
  },

  /**
   * !#en
   * Sets the untransformed size of the node.<br/>
   * The contentSize remains the same no matter the node is scaled or rotated.<br/>
   * All nodes has a size. Layer and Scene has the same size of the screen.
   * !#zh 设置节点原始大小，不受该节点是否被缩放或者旋转的影响。
   * @method setContentSize
   * @param {Size|Number} size - The untransformed size of the node or The untransformed size's width of the node.
   * @param {Number} [height] - The untransformed size's height of the node.
   * @example
   * node.setContentSize(cc.size(100, 100));
   * node.setContentSize(100, 100);
   */
  setContentSize: function setContentSize(size, height) {
    var locContentSize = this._contentSize;
    var clone;

    if (height === undefined) {
      if (size.width === locContentSize.width && size.height === locContentSize.height) return;

      if (CC_EDITOR) {
        clone = cc.size(locContentSize.width, locContentSize.height);
      }

      locContentSize.width = size.width;
      locContentSize.height = size.height;
    } else {
      if (size === locContentSize.width && height === locContentSize.height) return;

      if (CC_EDITOR) {
        clone = cc.size(locContentSize.width, locContentSize.height);
      }

      locContentSize.width = size;
      locContentSize.height = height;
    }

    if (this._eventMask & SIZE_ON) {
      if (CC_EDITOR) {
        this.emit(EventType.SIZE_CHANGED, clone);
      } else {
        this.emit(EventType.SIZE_CHANGED);
      }
    }
  },

  /**
   * !#en
   * Returns a copy of the anchor point.<br/>
   * Anchor point is the point around which all transformations and positioning manipulations take place.<br/>
   * It's like a pin in the node where it is "attached" to its parent. <br/>
   * The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner. <br/>
   * But you can use values higher than (1,1) and lower than (0,0) too.  <br/>
   * The default anchor point is (0.5,0.5), so it starts at the center of the node.
   * !#zh
   * 获取节点锚点，用百分比表示。<br/>
   * 锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br/>
   * 锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br/>
   * 但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br/>
   * 默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br/>
   * 注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
   * @method getAnchorPoint
   * @return {Vec2} The anchor point of node.
   * @example
   * cc.log("Node AnchorPoint: " + node.getAnchorPoint());
   */
  getAnchorPoint: function getAnchorPoint() {
    return cc.v2(this._anchorPoint);
  },

  /**
   * !#en
   * Sets the anchor point in percent. <br/>
   * anchor point is the point around which all transformations and positioning manipulations take place. <br/>
   * It's like a pin in the node where it is "attached" to its parent. <br/>
   * The anchorPoint is normalized, like a percentage. (0,0) means the bottom-left corner and (1,1) means the top-right corner.<br/>
   * But you can use values higher than (1,1) and lower than (0,0) too.<br/>
   * The default anchor point is (0.5,0.5), so it starts at the center of the node.
   * !#zh
   * 设置锚点的百分比。<br/>
   * 锚点应用于所有变换和坐标点的操作，它就像在节点上连接其父节点的大头针。<br/>
   * 锚点是标准化的，就像百分比一样。(0，0) 表示左下角，(1，1) 表示右上角。<br/>
   * 但是你可以使用比（1，1）更高的值或者比（0，0）更低的值。<br/>
   * 默认的锚点是（0.5，0.5），因此它开始于节点的中心位置。<br/>
   * 注意：Creator 中的锚点仅用于定位所在的节点，子节点的定位不受影响。
   * @method setAnchorPoint
   * @param {Vec2|Number} point - The anchor point of node or The x axis anchor of node.
   * @param {Number} [y] - The y axis anchor of node.
   * @example
   * node.setAnchorPoint(cc.v2(1, 1));
   * node.setAnchorPoint(1, 1);
   */
  setAnchorPoint: function setAnchorPoint(point, y) {
    var locAnchorPoint = this._anchorPoint;

    if (y === undefined) {
      if (point.x === locAnchorPoint.x && point.y === locAnchorPoint.y) return;
      locAnchorPoint.x = point.x;
      locAnchorPoint.y = point.y;
    } else {
      if (point === locAnchorPoint.x && y === locAnchorPoint.y) return;
      locAnchorPoint.x = point;
      locAnchorPoint.y = y;
    }

    this.setLocalDirty(LocalDirtyFlag.ALL_POSITION);

    if (this._eventMask & ANCHOR_ON) {
      this.emit(EventType.ANCHOR_CHANGED);
    }
  },

  /*
   * Transforms position from world space to local space.
   * @method _invTransformPoint
   * @param {Vec3} out
   * @param {Vec3} vec3
   */
  _invTransformPoint: function _invTransformPoint(out, pos) {
    if (this._parent) {
      this._parent._invTransformPoint(out, pos);
    } else {
      _valueTypes.Vec3.copy(out, pos);
    }

    var ltrs = this._trs; // out = parent_inv_pos - pos

    _valueTypes.Trs.toPosition(_tpVec3a, ltrs);

    _valueTypes.Vec3.sub(out, out, _tpVec3a); // out = inv(rot) * out


    _valueTypes.Trs.toRotation(_tpQuata, ltrs);

    _valueTypes.Quat.conjugate(_tpQuatb, _tpQuata);

    _valueTypes.Vec3.transformQuat(out, out, _tpQuatb); // out = (1/scale) * out


    _valueTypes.Trs.toScale(_tpVec3a, ltrs);

    _valueTypes.Vec3.inverseSafe(_tpVec3b, _tpVec3a);

    _valueTypes.Vec3.mul(out, out, _tpVec3b);

    return out;
  },

  /*
   * Calculate and return world position.
   * This is not a public API yet, its usage could be updated
   * @method getWorldPosition
   * @param {Vec3} out
   * @return {Vec3}
   */
  getWorldPosition: function getWorldPosition(out) {
    _valueTypes.Trs.toPosition(out, this._trs);

    var curr = this._parent;
    var ltrs;

    while (curr) {
      ltrs = curr._trs; // out = parent_scale * pos

      _valueTypes.Trs.toScale(_gwpVec3, ltrs);

      _valueTypes.Vec3.mul(out, out, _gwpVec3); // out = parent_quat * out


      _valueTypes.Trs.toRotation(_gwpQuat, ltrs);

      _valueTypes.Vec3.transformQuat(out, out, _gwpQuat); // out = out + pos


      _valueTypes.Trs.toPosition(_gwpVec3, ltrs);

      _valueTypes.Vec3.add(out, out, _gwpVec3);

      curr = curr._parent;
    }

    return out;
  },

  /*
   * Set world position.
   * This is not a public API yet, its usage could be updated
   * @method setWorldPosition
   * @param {Vec3} pos
   */
  setWorldPosition: function setWorldPosition(pos) {
    var ltrs = this._trs;

    if (CC_EDITOR) {
      var oldPosition = new cc.Vec3(ltrs[0], ltrs[1], ltrs[2]);
    } // NOTE: this is faster than invert world matrix and transform the point


    if (this._parent) {
      this._parent._invTransformPoint(_swpVec3, pos);
    } else {
      _valueTypes.Vec3.copy(_swpVec3, pos);
    }

    _valueTypes.Trs.fromPosition(ltrs, _swpVec3);

    this.setLocalDirty(LocalDirtyFlag.ALL_POSITION); // fast check event

    if (this._eventMask & POSITION_ON) {
      // send event
      if (CC_EDITOR) {
        this.emit(EventType.POSITION_CHANGED, oldPosition);
      } else {
        this.emit(EventType.POSITION_CHANGED);
      }
    }
  },

  /*
   * Calculate and return world rotation
   * This is not a public API yet, its usage could be updated
   * @method getWorldRotation
   * @param {Quat} out
   * @return {Quat}
   */
  getWorldRotation: function getWorldRotation(out) {
    _valueTypes.Trs.toRotation(_gwrQuat, this._trs);

    _valueTypes.Quat.copy(out, _gwrQuat);

    var curr = this._parent;

    while (curr) {
      _valueTypes.Trs.toRotation(_gwrQuat, curr._trs);

      _valueTypes.Quat.mul(out, _gwrQuat, out);

      curr = curr._parent;
    }

    return out;
  },

  /*
   * Set world rotation with quaternion
   * This is not a public API yet, its usage could be updated
   * @method setWorldRotation
   * @param {Quat} val
   */
  setWorldRotation: function setWorldRotation(val) {
    if (this._parent) {
      this._parent.getWorldRotation(_swrQuat);

      _valueTypes.Quat.conjugate(_swrQuat, _swrQuat);

      _valueTypes.Quat.mul(_swrQuat, _swrQuat, val);
    } else {
      _valueTypes.Quat.copy(_swrQuat, val);
    }

    _valueTypes.Trs.fromRotation(this._trs, _swrQuat);

    if (CC_EDITOR) {
      this._toEuler();
    }

    this.setLocalDirty(LocalDirtyFlag.ALL_ROTATION);
  },

  /*
   * Calculate and return world scale
   * This is not a public API yet, its usage could be updated
   * @method getWorldScale
   * @param {Vec3} out
   * @return {Vec3}
   */
  getWorldScale: function getWorldScale(out) {
    _valueTypes.Trs.toScale(_gwsVec3, this._trs);

    _valueTypes.Vec3.copy(out, _gwsVec3);

    var curr = this._parent;

    while (curr) {
      _valueTypes.Trs.toScale(_gwsVec3, curr._trs);

      _valueTypes.Vec3.mul(out, out, _gwsVec3);

      curr = curr._parent;
    }

    return out;
  },

  /*
   * Set world scale with vec3
   * This is not a public API yet, its usage could be updated
   * @method setWorldScale
   * @param {Vec3} scale
   */
  setWorldScale: function setWorldScale(scale) {
    if (this._parent) {
      this._parent.getWorldScale(_swsVec3);

      _valueTypes.Vec3.div(_swsVec3, scale, _swsVec3);
    } else {
      _valueTypes.Vec3.copy(_swsVec3, scale);
    }

    _valueTypes.Trs.fromScale(this._trs, _swsVec3);

    this.setLocalDirty(LocalDirtyFlag.ALL_SCALE);
  },
  getWorldRT: function getWorldRT(out) {
    var opos = _gwrtVec3a;
    var orot = _gwrtQuata;
    var ltrs = this._trs;

    _valueTypes.Trs.toPosition(opos, ltrs);

    _valueTypes.Trs.toRotation(orot, ltrs);

    var curr = this._parent;

    while (curr) {
      ltrs = curr._trs; // opos = parent_lscale * lpos

      _valueTypes.Trs.toScale(_gwrtVec3b, ltrs);

      _valueTypes.Vec3.mul(opos, opos, _gwrtVec3b); // opos = parent_lrot * opos


      _valueTypes.Trs.toRotation(_gwrtQuatb, ltrs);

      _valueTypes.Vec3.transformQuat(opos, opos, _gwrtQuatb); // opos = opos + lpos


      _valueTypes.Trs.toPosition(_gwrtVec3b, ltrs);

      _valueTypes.Vec3.add(opos, opos, _gwrtVec3b); // orot = lrot * orot


      _valueTypes.Quat.mul(orot, _gwrtQuatb, orot);

      curr = curr._parent;
    }

    _valueTypes.Mat4.fromRT(out, orot, opos);

    return out;
  },

  /**
   * !#en Set rotation by lookAt target point, normally used by Camera Node
   * !#zh 通过观察目标来设置 rotation，一般用于 Camera Node 上
   * @method lookAt
   * @param {Vec3} pos
   * @param {Vec3} [up] - default is (0,1,0)
   */
  lookAt: function lookAt(pos, up) {
    this.getWorldPosition(_laVec3);

    _valueTypes.Vec3.sub(_laVec3, _laVec3, pos); // NOTE: we use -z for view-dir


    _valueTypes.Vec3.normalize(_laVec3, _laVec3);

    _valueTypes.Quat.fromViewUp(_laQuat, _laVec3, up);

    this.setWorldRotation(_laQuat);
  },
  _updateLocalMatrix: updateLocalMatrix2D,
  _calculWorldMatrix: function _calculWorldMatrix() {
    // Avoid as much function call as possible
    if (this._localMatDirty & LocalDirtyFlag.TRSS) {
      this._updateLocalMatrix();
    } // Assume parent world matrix is correct


    var parent = this._parent;

    if (parent) {
      this._mulMat(this._worldMatrix, parent._worldMatrix, this._matrix);
    } else {
      _valueTypes.Mat4.copy(this._worldMatrix, this._matrix);
    }

    this._worldMatDirty = false;
  },
  _mulMat: mulMat2D,
  _updateWorldMatrix: function _updateWorldMatrix() {
    if (this._parent) {
      this._parent._updateWorldMatrix();
    }

    if (this._worldMatDirty) {
      this._calculWorldMatrix(); // Sync dirty to children


      var children = this._children;

      for (var i = 0, l = children.length; i < l; i++) {
        children[i]._worldMatDirty = true;
      }
    }
  },
  setLocalDirty: function setLocalDirty(flag) {
    this._localMatDirty |= flag;
    this._worldMatDirty = true;

    if (flag === LocalDirtyFlag.ALL_POSITION || flag === LocalDirtyFlag.POSITION) {
      this._renderFlag |= RenderFlow.FLAG_WORLD_TRANSFORM;
    } else {
      this._renderFlag |= RenderFlow.FLAG_TRANSFORM;
    }
  },
  setWorldDirty: function setWorldDirty() {
    this._worldMatDirty = true;
  },

  /**
   * !#en
   * Get the local transform matrix (4x4), based on parent node coordinates
   * !#zh 返回局部空间坐标系的矩阵，基于父节点坐标系。
   * @method getLocalMatrix
   * @param {Mat4} out The matrix object to be filled with data
   * @return {Mat4} Same as the out matrix object
   * @example
   * let mat4 = cc.mat4();
   * node.getLocalMatrix(mat4);
   */
  getLocalMatrix: function getLocalMatrix(out) {
    this._updateLocalMatrix();

    return _valueTypes.Mat4.copy(out, this._matrix);
  },

  /**
   * !#en
   * Get the world transform matrix (4x4)
   * !#zh 返回世界空间坐标系的矩阵。
   * @method getWorldMatrix
   * @param {Mat4} out The matrix object to be filled with data
   * @return {Mat4} Same as the out matrix object
   * @example
   * let mat4 = cc.mat4();
   * node.getWorldMatrix(mat4);
   */
  getWorldMatrix: function getWorldMatrix(out) {
    this._updateWorldMatrix();

    return _valueTypes.Mat4.copy(out, this._worldMatrix);
  },

  /**
   * !#en
   * Converts a Point to node (local) space coordinates.
   * !#zh
   * 将一个点转换到节点 (局部) 空间坐标系。
   * @method convertToNodeSpaceAR
   * @param {Vec3|Vec2} worldPoint
   * @param {Vec3|Vec2} [out]
   * @return {Vec3|Vec2}
   * @typescript
   * convertToNodeSpaceAR<T extends cc.Vec2 | cc.Vec3>(worldPoint: T, out?: T): T
   * @example
   * var newVec2 = node.convertToNodeSpaceAR(cc.v2(100, 100));
   * var newVec3 = node.convertToNodeSpaceAR(cc.v3(100, 100, 100));
   */
  convertToNodeSpaceAR: function convertToNodeSpaceAR(worldPoint, out) {
    this._updateWorldMatrix();

    _valueTypes.Mat4.invert(_mat4_temp, this._worldMatrix);

    if (worldPoint instanceof cc.Vec2) {
      out = out || new cc.Vec2();
      return _valueTypes.Vec2.transformMat4(out, worldPoint, _mat4_temp);
    } else {
      out = out || new cc.Vec3();
      return _valueTypes.Vec3.transformMat4(out, worldPoint, _mat4_temp);
    }
  },

  /**
   * !#en
   * Converts a Point in node coordinates to world space coordinates.
   * !#zh
   * 将节点坐标系下的一个点转换到世界空间坐标系。
   * @method convertToWorldSpaceAR
   * @param {Vec3|Vec2} nodePoint
   * @param {Vec3|Vec2} [out]
   * @return {Vec3|Vec2}
   * @typescript
   * convertToWorldSpaceAR<T extends cc.Vec2 | cc.Vec3>(nodePoint: T, out?: T): T
   * @example
   * var newVec2 = node.convertToWorldSpaceAR(cc.v2(100, 100));
   * var newVec3 = node.convertToWorldSpaceAR(cc.v3(100, 100, 100));
   */
  convertToWorldSpaceAR: function convertToWorldSpaceAR(nodePoint, out) {
    this._updateWorldMatrix();

    if (nodePoint instanceof cc.Vec2) {
      out = out || new cc.Vec2();
      return _valueTypes.Vec2.transformMat4(out, nodePoint, this._worldMatrix);
    } else {
      out = out || new cc.Vec3();
      return _valueTypes.Vec3.transformMat4(out, nodePoint, this._worldMatrix);
    }
  },
  // OLD TRANSFORM ACCESS APIs

  /**
      * !#en Converts a Point to node (local) space coordinates then add the anchor point position.
      * So the return position will be related to the left bottom corner of the node's bounding box.
      * This equals to the API behavior of cocos2d-x, you probably want to use convertToNodeSpaceAR instead
      * !#zh 将一个点转换到节点 (局部) 坐标系，并加上锚点的坐标。<br/>
      * 也就是说返回的坐标是相对于节点包围盒左下角的坐标。<br/>
      * 这个 API 的设计是为了和 cocos2d-x 中行为一致，更多情况下你可能需要使用 convertToNodeSpaceAR。
      * @method convertToNodeSpace
      * @deprecated since v2.1.3
      * @param {Vec2} worldPoint
      * @return {Vec2}
      * @example
      * var newVec2 = node.convertToNodeSpace(cc.v2(100, 100));
      */
  convertToNodeSpace: function convertToNodeSpace(worldPoint) {
    this._updateWorldMatrix();

    _valueTypes.Mat4.invert(_mat4_temp, this._worldMatrix);

    var out = new cc.Vec2();

    _valueTypes.Vec2.transformMat4(out, worldPoint, _mat4_temp);

    out.x += this._anchorPoint.x * this._contentSize.width;
    out.y += this._anchorPoint.y * this._contentSize.height;
    return out;
  },

  /**
   * !#en Converts a Point related to the left bottom corner of the node's bounding box to world space coordinates.
   * This equals to the API behavior of cocos2d-x, you probably want to use convertToWorldSpaceAR instead
   * !#zh 将一个相对于节点左下角的坐标位置转换到世界空间坐标系。
   * 这个 API 的设计是为了和 cocos2d-x 中行为一致，更多情况下你可能需要使用 convertToWorldSpaceAR
   * @method convertToWorldSpace
   * @deprecated since v2.1.3
   * @param {Vec2} nodePoint
   * @return {Vec2}
   * @example
   * var newVec2 = node.convertToWorldSpace(cc.v2(100, 100));
   */
  convertToWorldSpace: function convertToWorldSpace(nodePoint) {
    this._updateWorldMatrix();

    var out = new cc.Vec2(nodePoint.x - this._anchorPoint.x * this._contentSize.width, nodePoint.y - this._anchorPoint.y * this._contentSize.height);
    return _valueTypes.Vec2.transformMat4(out, out, this._worldMatrix);
  },

  /**
   * !#en
   * Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
   * The matrix is in Pixels.
   * !#zh 返回这个将节点（局部）的空间坐标系转换成父节点的空间坐标系的矩阵。这个矩阵以像素为单位。
   * @method getNodeToParentTransform
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getNodeToParentTransform(affineTransform);
   */
  getNodeToParentTransform: function getNodeToParentTransform(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateLocalMatrix();

    var contentSize = this._contentSize;
    _vec3_temp.x = -this._anchorPoint.x * contentSize.width;
    _vec3_temp.y = -this._anchorPoint.y * contentSize.height;

    _valueTypes.Mat4.copy(_mat4_temp, this._matrix);

    _valueTypes.Mat4.transform(_mat4_temp, _mat4_temp, _vec3_temp);

    return AffineTrans.fromMat4(out, _mat4_temp);
  },

  /**
   * !#en
   * Returns the matrix that transform the node's (local) space coordinates into the parent's space coordinates.<br/>
   * The matrix is in Pixels.<br/>
   * This method is AR (Anchor Relative).
   * !#zh
   * 返回这个将节点（局部）的空间坐标系转换成父节点的空间坐标系的矩阵。<br/>
   * 这个矩阵以像素为单位。<br/>
   * 该方法基于节点坐标。
   * @method getNodeToParentTransformAR
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getNodeToParentTransformAR(affineTransform);
   */
  getNodeToParentTransformAR: function getNodeToParentTransformAR(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateLocalMatrix();

    return AffineTrans.fromMat4(out, this._matrix);
  },

  /**
   * !#en Returns the world affine transform matrix. The matrix is in Pixels.
   * !#zh 返回节点到世界坐标系的仿射变换矩阵。矩阵单位是像素。
   * @method getNodeToWorldTransform
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getNodeToWorldTransform(affineTransform);
   */
  getNodeToWorldTransform: function getNodeToWorldTransform(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateWorldMatrix();

    var contentSize = this._contentSize;
    _vec3_temp.x = -this._anchorPoint.x * contentSize.width;
    _vec3_temp.y = -this._anchorPoint.y * contentSize.height;

    _valueTypes.Mat4.copy(_mat4_temp, this._worldMatrix);

    _valueTypes.Mat4.transform(_mat4_temp, _mat4_temp, _vec3_temp);

    return AffineTrans.fromMat4(out, _mat4_temp);
  },

  /**
   * !#en
   * Returns the world affine transform matrix. The matrix is in Pixels.<br/>
   * This method is AR (Anchor Relative).
   * !#zh
   * 返回节点到世界坐标仿射变换矩阵。矩阵单位是像素。<br/>
   * 该方法基于节点坐标。
   * @method getNodeToWorldTransformAR
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getNodeToWorldTransformAR(affineTransform);
   */
  getNodeToWorldTransformAR: function getNodeToWorldTransformAR(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateWorldMatrix();

    return AffineTrans.fromMat4(out, this._worldMatrix);
  },

  /**
   * !#en
   * Returns the matrix that transform parent's space coordinates to the node's (local) space coordinates.<br/>
   * The matrix is in Pixels. The returned transform is readonly and cannot be changed.
   * !#zh
   * 返回将父节点的坐标系转换成节点（局部）的空间坐标系的矩阵。<br/>
   * 该矩阵以像素为单位。返回的矩阵是只读的，不能更改。
   * @method getParentToNodeTransform
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getParentToNodeTransform(affineTransform);
   */
  getParentToNodeTransform: function getParentToNodeTransform(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateLocalMatrix();

    _valueTypes.Mat4.invert(_mat4_temp, this._matrix);

    return AffineTrans.fromMat4(out, _mat4_temp);
  },

  /**
   * !#en Returns the inverse world affine transform matrix. The matrix is in Pixels.
   * !#en 返回世界坐标系到节点坐标系的逆矩阵。
   * @method getWorldToNodeTransform
   * @deprecated since v2.0
   * @param {AffineTransform} [out] The affine transform object to be filled with data
   * @return {AffineTransform} Same as the out affine transform object
   * @example
   * let affineTransform = cc.AffineTransform.create();
   * node.getWorldToNodeTransform(affineTransform);
   */
  getWorldToNodeTransform: function getWorldToNodeTransform(out) {
    if (!out) {
      out = AffineTrans.identity();
    }

    this._updateWorldMatrix();

    _valueTypes.Mat4.invert(_mat4_temp, this._worldMatrix);

    return AffineTrans.fromMat4(out, _mat4_temp);
  },

  /**
   * !#en convenience methods which take a cc.Touch instead of cc.Vec2.
   * !#zh 将触摸点转换成本地坐标系中位置。
   * @method convertTouchToNodeSpace
   * @deprecated since v2.0
   * @param {Touch} touch - The touch object
   * @return {Vec2}
   * @example
   * var newVec2 = node.convertTouchToNodeSpace(touch);
   */
  convertTouchToNodeSpace: function convertTouchToNodeSpace(touch) {
    return this.convertToNodeSpace(touch.getLocation());
  },

  /**
   * !#en converts a cc.Touch (world coordinates) into a local coordinate. This method is AR (Anchor Relative).
   * !#zh 转换一个 cc.Touch（世界坐标）到一个局部坐标，该方法基于节点坐标。
   * @method convertTouchToNodeSpaceAR
   * @deprecated since v2.0
   * @param {Touch} touch - The touch object
   * @return {Vec2}
   * @example
   * var newVec2 = node.convertTouchToNodeSpaceAR(touch);
   */
  convertTouchToNodeSpaceAR: function convertTouchToNodeSpaceAR(touch) {
    return this.convertToNodeSpaceAR(touch.getLocation());
  },

  /**
   * !#en
   * Returns a "local" axis aligned bounding box of the node. <br/>
   * The returned box is relative only to its parent.
   * !#zh 返回父节坐标系下的轴向对齐的包围盒。
   * @method getBoundingBox
   * @return {Rect} The calculated bounding box of the node
   * @example
   * var boundingBox = node.getBoundingBox();
   */
  getBoundingBox: function getBoundingBox() {
    this._updateLocalMatrix();

    var width = this._contentSize.width;
    var height = this._contentSize.height;
    var rect = cc.rect(-this._anchorPoint.x * width, -this._anchorPoint.y * height, width, height);
    return rect.transformMat4(rect, this._matrix);
  },

  /**
   * !#en
   * Returns a "world" axis aligned bounding box of the node.<br/>
   * The bounding box contains self and active children's world bounding box.
   * !#zh
   * 返回节点在世界坐标系下的对齐轴向的包围盒（AABB）。<br/>
   * 该边框包含自身和已激活的子节点的世界边框。
   * @method getBoundingBoxToWorld
   * @return {Rect}
   * @example
   * var newRect = node.getBoundingBoxToWorld();
   */
  getBoundingBoxToWorld: function getBoundingBoxToWorld() {
    if (this._parent) {
      this._parent._updateWorldMatrix();

      return this._getBoundingBoxTo();
    } else {
      return this.getBoundingBox();
    }
  },
  _getBoundingBoxTo: function _getBoundingBoxTo() {
    var width = this._contentSize.width;
    var height = this._contentSize.height;
    var rect = cc.rect(-this._anchorPoint.x * width, -this._anchorPoint.y * height, width, height);

    this._calculWorldMatrix();

    rect.transformMat4(rect, this._worldMatrix); //query child's BoundingBox

    if (!this._children) return rect;
    var locChildren = this._children;

    for (var i = 0; i < locChildren.length; i++) {
      var child = locChildren[i];

      if (child && child.active) {
        var childRect = child._getBoundingBoxTo();

        if (childRect) rect.union(rect, childRect);
      }
    }

    return rect;
  },
  _updateOrderOfArrival: function _updateOrderOfArrival() {
    var arrivalOrder = this._parent ? ++this._parent._childArrivalOrder : 0;
    this._localZOrder = this._localZOrder & 0xffff0000 | arrivalOrder;
    this.emit(EventType.SIBLING_ORDER_CHANGED);
  },

  /**
   * !#en
   * Adds a child to the node with z order and name.
   * !#zh
   * 添加子节点，并且可以修改该节点的 局部 Z 顺序和名字。
   * @method addChild
   * @param {Node} child - A child node
   * @param {Number} [zIndex] - Z order for drawing priority. Please refer to zIndex property
   * @param {String} [name] - A name to identify the node easily. Please refer to name property
   * @example
   * node.addChild(newNode, 1, "node");
   */
  addChild: function addChild(child, zIndex, name) {
    if (CC_DEV && !cc.Node.isNode(child)) {
      return cc.errorID(1634, cc.js.getClassName(child));
    }

    cc.assertID(child, 1606);
    cc.assertID(child._parent === null, 1605); // invokes the parent setter

    child.parent = this;

    if (zIndex !== undefined) {
      child.zIndex = zIndex;
    }

    if (name !== undefined) {
      child.name = name;
    }
  },

  /**
   * !#en Stops all running actions and schedulers.
   * !#zh 停止所有正在播放的动作和计时器。
   * @method cleanup
   * @example
   * node.cleanup();
   */
  cleanup: function cleanup() {
    // actions
    ActionManagerExist && cc.director.getActionManager().removeAllActionsFromTarget(this); // event

    eventManager.removeListeners(this); // children

    var i,
        len = this._children.length,
        node;

    for (i = 0; i < len; ++i) {
      node = this._children[i];
      if (node) node.cleanup();
    }
  },

  /**
   * !#en Sorts the children array depends on children's zIndex and arrivalOrder,
   * normally you won't need to invoke this function.
   * !#zh 根据子节点的 zIndex 和 arrivalOrder 进行排序，正常情况下开发者不需要手动调用这个函数。
   *
   * @method sortAllChildren
   */
  sortAllChildren: function sortAllChildren() {
    if (this._reorderChildDirty) {
      this._reorderChildDirty = false; // delay update arrivalOrder before sort children

      var _children = this._children,
          child; // reset arrivalOrder before sort children

      this._childArrivalOrder = 1;

      for (var i = 0, len = _children.length; i < len; i++) {
        child = _children[i];

        child._updateOrderOfArrival();
      } // Optimize reordering event code to fix problems with setting zindex
      // https://github.com/cocos-creator/2d-tasks/issues/1186


      eventManager._setDirtyForNode(this);

      if (_children.length > 1) {
        // insertion sort
        var j, child;

        for (var _i = 1, _len = _children.length; _i < _len; _i++) {
          child = _children[_i];
          j = _i - 1; //continue moving element downwards while zOrder is smaller or when zOrder is the same but mutatedIndex is smaller

          while (j >= 0) {
            if (child._localZOrder < _children[j]._localZOrder) {
              _children[j + 1] = _children[j];
            } else {
              break;
            }

            j--;
          }

          _children[j + 1] = child;
        }

        this.emit(EventType.CHILD_REORDER, this);
      }

      cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
    }
  },
  _delaySort: function _delaySort() {
    if (!this._reorderChildDirty) {
      this._reorderChildDirty = true;

      cc.director.__fastOn(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
    }
  },
  _restoreProperties: CC_EDITOR && function () {
    /*
     * TODO: Refine this code after completing undo/redo 2.0.
     * The node will be destroyed when deleting in the editor,
     * but it will be reserved and reused for undo.
    */
    // restore 3d node
    this.is3DNode = this.is3DNode;

    if (!this._matrix) {
      this._matrix = cc.mat4(this._spaceInfo.localMat);

      _valueTypes.Mat4.identity(this._matrix);
    }

    if (!this._worldMatrix) {
      this._worldMatrix = cc.mat4(this._spaceInfo.worldMat);

      _valueTypes.Mat4.identity(this._worldMatrix);
    }

    this._localMatDirty = LocalDirtyFlag.ALL;
    this._worldMatDirty = true;

    this._fromEuler();

    this._renderFlag |= RenderFlow.FLAG_TRANSFORM;

    if (this._renderComponent) {
      this._renderComponent.markForRender(true);
    }

    if (this._children.length > 0) {
      this._renderFlag |= RenderFlow.FLAG_CHILDREN;
    }
  },
  onRestore: CC_EDITOR && function () {
    this._onRestoreBase();

    this._restoreProperties();

    var actionManager = cc.director.getActionManager();

    if (this._activeInHierarchy) {
      actionManager && actionManager.resumeTarget(this);
      eventManager.resumeTarget(this);
    } else {
      actionManager && actionManager.pauseTarget(this);
      eventManager.pauseTarget(this);
    }
  }
};

if (CC_EDITOR) {
  // deprecated, only used to import old data in editor
  js.mixin(NodeDefines.properties, {
    _scaleX: {
      "default": undefined,
      type: cc.Float,
      editorOnly: true
    },
    _scaleY: {
      "default": undefined,
      type: cc.Float,
      editorOnly: true
    }
  });
}

var Node = cc.Class(NodeDefines); // 3D Node Property
// Node Event

/**
 * !#en
 * The position changing event, you can listen to this event through the statement this.node.on(cc.Node.EventType.POSITION_CHANGED, callback, this);
 * !#zh
 * 位置变动监听事件, 通过 this.node.on(cc.Node.EventType.POSITION_CHANGED, callback, this); 进行监听。
 * @event position-changed
 * @param {Vec2} oldPos - The old position, but this parameter is only available in editor!
 */

/**
 * !#en
 * The size changing event, you can listen to this event through the statement this.node.on(cc.Node.EventType.SIZE_CHANGED, callback, this);
 * !#zh
 * 尺寸变动监听事件，通过 this.node.on(cc.Node.EventType.SIZE_CHANGED, callback, this); 进行监听。
 * @event size-changed
 * @param {Size} oldSize - The old size, but this parameter is only available in editor!
 */

/**
 * !#en
 * The anchor changing event, you can listen to this event through the statement this.node.on(cc.Node.EventType.ANCHOR_CHANGED, callback, this);
 * !#zh
 * 锚点变动监听事件，通过 this.node.on(cc.Node.EventType.ANCHOR_CHANGED, callback, this); 进行监听。
 * @event anchor-changed
 */

/**
 * !#en
 * The adding child event, you can listen to this event through the statement this.node.on(cc.Node.EventType.CHILD_ADDED, callback, this);
 * !#zh
 * 增加子节点监听事件，通过 this.node.on(cc.Node.EventType.CHILD_ADDED, callback, this); 进行监听。
 * @event child-added
 * @param {Node} child - child which have been added
 */

/**
 * !#en
 * The removing child event, you can listen to this event through the statement this.node.on(cc.Node.EventType.CHILD_REMOVED, callback, this);
 * !#zh
 * 删除子节点监听事件，通过 this.node.on(cc.Node.EventType.CHILD_REMOVED, callback, this); 进行监听。
 * @event child-removed
 * @param {Node} child - child which have been removed
 */

/**
 * !#en
 * The reordering child event, you can listen to this event through the statement this.node.on(cc.Node.EventType.CHILD_REORDER, callback, this);
 * !#zh
 * 子节点顺序变动监听事件，通过 this.node.on(cc.Node.EventType.CHILD_REORDER, callback, this); 进行监听。
 * @event child-reorder
 * @param {Node} node - node whose children have been reordered
 */

/**
 * !#en
 * The group changing event, you can listen to this event through the statement this.node.on(cc.Node.EventType.GROUP_CHANGED, callback, this);
 * !#zh
 * 节点分组变动监听事件，通过 this.node.on(cc.Node.EventType.GROUP_CHANGED, callback, this); 进行监听。
 * @event group-changed
 * @param {Node} node - node whose group has changed
 */
// Deprecated APIs

/**
 * !#en
 * Returns the displayed opacity of Node,
 * the difference between displayed opacity and opacity is that displayed opacity is calculated based on opacity and parent node's opacity when cascade opacity enabled.
 * !#zh
 * 获取节点显示透明度，
 * 显示透明度和透明度之间的不同之处在于当启用级连透明度时，
 * 显示透明度是基于自身透明度和父节点透明度计算的。
 *
 * @method getDisplayedOpacity
 * @return {number} displayed opacity
 * @deprecated since v2.0, please use opacity property, cascade opacity is removed
 */

/**
 * !#en
 * Returns the displayed color of Node,
 * the difference between displayed color and color is that displayed color is calculated based on color and parent node's color when cascade color enabled.
 * !#zh
 * 获取节点的显示颜色，
 * 显示颜色和颜色之间的不同之处在于当启用级连颜色时，
 * 显示颜色是基于自身颜色和父节点颜色计算的。
 *
 * @method getDisplayedColor
 * @return {Color}
 * @deprecated since v2.0, please use color property, cascade color is removed
 */

/**
 * !#en Cascade opacity is removed from v2.0
 * Indicate whether node's opacity value affect its child nodes, default value is true.
 * !#zh 透明度级联功能从 v2.0 开始已移除
 * 节点的不透明度值是否影响其子节点，默认值为 true。
 * @property cascadeOpacity
 * @deprecated since v2.0
 * @type {Boolean}
 */

/**
 * !#en Cascade opacity is removed from v2.0
 * Returns whether node's opacity value affect its child nodes.
 * !#zh 透明度级联功能从 v2.0 开始已移除
 * 返回节点的不透明度值是否影响其子节点。
 * @method isCascadeOpacityEnabled
 * @deprecated since v2.0
 * @return {Boolean}
 */

/**
 * !#en Cascade opacity is removed from v2.0
 * Enable or disable cascade opacity, if cascade enabled, child nodes' opacity will be the multiplication of parent opacity and its own opacity.
 * !#zh 透明度级联功能从 v2.0 开始已移除
 * 启用或禁用级连不透明度，如果级连启用，子节点的不透明度将是父不透明度乘上它自己的不透明度。
 * @method setCascadeOpacityEnabled
 * @deprecated since v2.0
 * @param {Boolean} cascadeOpacityEnabled
 */

/**
 * !#en Opacity modify RGB have been removed since v2.0
 * Set whether color should be changed with the opacity value,
 * useless in ccsg.Node, but this function is override in some class to have such behavior.
 * !#zh 透明度影响颜色配置已经被废弃
 * 设置更改透明度时是否修改RGB值，
 * @method setOpacityModifyRGB
 * @deprecated since v2.0
 * @param {Boolean} opacityValue
 */

/**
 * !#en Opacity modify RGB have been removed since v2.0
 * Get whether color should be changed with the opacity value.
 * !#zh 透明度影响颜色配置已经被废弃
 * 获取更改透明度时是否修改RGB值。
 * @method isOpacityModifyRGB
 * @deprecated since v2.0
 * @return {Boolean}
 */

var _p = Node.prototype;
js.getset(_p, 'position', _p.getPosition, _p.setPosition, false, true);

if (CC_EDITOR) {
  var vec3_tmp = new _valueTypes.Vec3();
  cc.js.getset(_p, 'worldEulerAngles', function () {
    var angles = new _valueTypes.Vec3(this._eulerAngles);
    var parent = this.parent;

    while (parent) {
      angles.addSelf(parent._eulerAngles);
      parent = parent.parent;
    }

    return angles;
  }, function (v) {
    vec3_tmp.set(v);
    var parent = this.parent;

    while (parent) {
      vec3_tmp.subSelf(parent._eulerAngles);
      parent = parent.parent;
    }

    this.eulerAngles = vec3_tmp;
  });
}

cc.Node = module.exports = Node;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDTm9kZS5qcyJdLCJuYW1lcyI6WyJCYXNlTm9kZSIsInJlcXVpcmUiLCJQcmVmYWJIZWxwZXIiLCJub2RlTWVtUG9vbCIsIk5vZGVNZW1Qb29sIiwiQWZmaW5lVHJhbnMiLCJldmVudE1hbmFnZXIiLCJtYWNybyIsImpzIiwiRXZlbnQiLCJFdmVudFRhcmdldCIsIlJlbmRlckZsb3ciLCJGbGFncyIsImNjIiwiT2JqZWN0IiwiRGVzdHJveWluZyIsIkVSUl9JTlZBTElEX05VTUJFUiIsIkNDX0VESVRPUiIsIk9ORV9ERUdSRUUiLCJNYXRoIiwiUEkiLCJBY3Rpb25NYW5hZ2VyRXhpc3QiLCJBY3Rpb25NYW5hZ2VyIiwiZW1wdHlGdW5jIiwiX2d3cFZlYzMiLCJWZWMzIiwiX2d3cFF1YXQiLCJRdWF0IiwiX3RwVmVjM2EiLCJfdHBWZWMzYiIsIl90cFF1YXRhIiwiX3RwUXVhdGIiLCJfc3dwVmVjMyIsIl9nd3NWZWMzIiwiX3N3c1ZlYzMiLCJfZ3dydFZlYzNhIiwiX2d3cnRWZWMzYiIsIl9nd3J0UXVhdGEiLCJfZ3dydFF1YXRiIiwiX2xhVmVjMyIsIl9sYVF1YXQiLCJfaHRWZWMzYSIsIl9odFZlYzNiIiwiX2d3clF1YXQiLCJfc3dyUXVhdCIsIl9xdWF0YSIsIl9tYXQ0X3RlbXAiLCJtYXQ0IiwiX3ZlYzNfdGVtcCIsIl9jYWNoZWRBcnJheSIsIkFycmF5IiwibGVuZ3RoIiwiUE9TSVRJT05fT04iLCJTQ0FMRV9PTiIsIlJPVEFUSU9OX09OIiwiU0laRV9PTiIsIkFOQ0hPUl9PTiIsIkNPTE9SX09OIiwiQnVpbHRpbkdyb3VwSW5kZXgiLCJFbnVtIiwiREVCVUciLCJMb2NhbERpcnR5RmxhZyIsIlBPU0lUSU9OIiwiU0NBTEUiLCJST1RBVElPTiIsIlNLRVciLCJUUlMiLCJSUyIsIlRSU1MiLCJQSFlTSUNTX1BPU0lUSU9OIiwiUEhZU0lDU19TQ0FMRSIsIlBIWVNJQ1NfUk9UQVRJT04iLCJQSFlTSUNTX1RSUyIsIlBIWVNJQ1NfUlMiLCJBTExfUE9TSVRJT04iLCJBTExfU0NBTEUiLCJBTExfUk9UQVRJT04iLCJBTExfVFJTIiwiQUxMIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJUT1VDSF9NT1ZFIiwiVE9VQ0hfRU5EIiwiVE9VQ0hfQ0FOQ0VMIiwiTU9VU0VfRE9XTiIsIk1PVVNFX01PVkUiLCJNT1VTRV9FTlRFUiIsIk1PVVNFX0xFQVZFIiwiTU9VU0VfVVAiLCJNT1VTRV9XSEVFTCIsIlBPU0lUSU9OX0NIQU5HRUQiLCJST1RBVElPTl9DSEFOR0VEIiwiU0NBTEVfQ0hBTkdFRCIsIlNJWkVfQ0hBTkdFRCIsIkFOQ0hPUl9DSEFOR0VEIiwiQ09MT1JfQ0hBTkdFRCIsIkNISUxEX0FEREVEIiwiQ0hJTERfUkVNT1ZFRCIsIkNISUxEX1JFT1JERVIiLCJHUk9VUF9DSEFOR0VEIiwiU0lCTElOR19PUkRFUl9DSEFOR0VEIiwiX3RvdWNoRXZlbnRzIiwiX21vdXNlRXZlbnRzIiwiX3NrZXdOZWVkV2FybiIsIl9za2V3V2FybiIsInZhbHVlIiwibm9kZSIsIm5vZGVQYXRoIiwiTm9kZVV0aWxzIiwiRWRpdG9yIiwiZ2V0Tm9kZVBhdGgiLCJ3YXJuIiwiX2N1cnJlbnRIb3ZlcmVkIiwiX3RvdWNoU3RhcnRIYW5kbGVyIiwidG91Y2giLCJldmVudCIsInBvcyIsImdldExvY2F0aW9uIiwib3duZXIiLCJfaGl0VGVzdCIsInR5cGUiLCJidWJibGVzIiwiZGlzcGF0Y2hFdmVudCIsIl90b3VjaE1vdmVIYW5kbGVyIiwiX3RvdWNoRW5kSGFuZGxlciIsIl90b3VjaENhbmNlbEhhbmRsZXIiLCJfbW91c2VEb3duSGFuZGxlciIsIl9tb3VzZU1vdmVIYW5kbGVyIiwiaGl0IiwiX3ByZXZpb3VzSW4iLCJfbW91c2VMaXN0ZW5lciIsInN0b3BQcm9wYWdhdGlvbiIsIl9tb3VzZVVwSGFuZGxlciIsIl9tb3VzZVdoZWVsSGFuZGxlciIsIl9zZWFyY2hDb21wb25lbnRzSW5QYXJlbnQiLCJjb21wIiwiaW5kZXgiLCJsaXN0IiwiY3VyciIsIk5vZGUiLCJpc05vZGUiLCJfcGFyZW50IiwiZ2V0Q29tcG9uZW50IiwibmV4dCIsInB1c2giLCJfY2hlY2tMaXN0ZW5lcnMiLCJldmVudHMiLCJfb2JqRmxhZ3MiLCJpIiwiX2J1YmJsaW5nTGlzdGVuZXJzIiwiaGFzRXZlbnRMaXN0ZW5lciIsIl9jYXB0dXJpbmdMaXN0ZW5lcnMiLCJfZG9EaXNwYXRjaEV2ZW50IiwidGFyZ2V0IiwiX2dldENhcHR1cmluZ1RhcmdldHMiLCJldmVudFBoYXNlIiwiY3VycmVudFRhcmdldCIsImVtaXQiLCJfcHJvcGFnYXRpb25TdG9wcGVkIiwiX3Byb3BhZ2F0aW9uSW1tZWRpYXRlU3RvcHBlZCIsIl9nZXRCdWJibGluZ1RhcmdldHMiLCJfZ2V0QWN0dWFsR3JvdXBJbmRleCIsImdyb3VwSW5kZXgiLCJwYXJlbnQiLCJfdXBkYXRlQ3VsbGluZ01hc2siLCJfY3VsbGluZ01hc2siLCJDQ19KU0IiLCJDQ19OQVRJVkVSRU5ERVJFUiIsIl9wcm94eSIsInVwZGF0ZUN1bGxpbmdNYXNrIiwiX2NoaWxkcmVuIiwidXBkYXRlTG9jYWxNYXRyaXgzRCIsIl9sb2NhbE1hdERpcnR5IiwidCIsIl9tYXRyaXgiLCJ0bSIsIm0iLCJUcnMiLCJ0b01hdDQiLCJfdHJzIiwiX3NrZXdYIiwiX3NrZXdZIiwiYSIsImIiLCJjIiwiZCIsInNreCIsInRhbiIsInNreSIsIkluZmluaXR5IiwiX3dvcmxkTWF0RGlydHkiLCJ1cGRhdGVMb2NhbE1hdHJpeDJEIiwiZGlydHlGbGFnIiwidHJzIiwicm90YXRpb24iLCJfZXVsZXJBbmdsZXMiLCJ6IiwiaGFzU2tldyIsInN4Iiwic3kiLCJyb3RhdGlvblJhZGlhbnMiLCJzaW4iLCJjb3MiLCJjYWxjdWxXb3JsZE1hdHJpeDNEIiwiX3VwZGF0ZUxvY2FsTWF0cml4IiwicGFyZW50TWF0IiwiX3dvcmxkTWF0cml4IiwiTWF0NCIsIm11bCIsImNvcHkiLCJjYWxjdWxXb3JsZE1hdHJpeDJEIiwiX211bE1hdCIsIm11bE1hdDJEIiwib3V0IiwiYW0iLCJibSIsIm91dG0iLCJhYSIsImFiIiwiYWMiLCJhZCIsImF0eCIsImF0eSIsImJhIiwiYmIiLCJiYyIsImJkIiwiYnR4IiwiYnR5IiwibXVsTWF0M0QiLCJOb2RlRGVmaW5lcyIsIm5hbWUiLCJwcm9wZXJ0aWVzIiwiX29wYWNpdHkiLCJfY29sb3IiLCJDb2xvciIsIldISVRFIiwiX2NvbnRlbnRTaXplIiwiU2l6ZSIsIl9hbmNob3JQb2ludCIsInYyIiwiX3Bvc2l0aW9uIiwidW5kZWZpbmVkIiwiX3NjYWxlIiwiX3pJbmRleCIsIkludGVnZXIiLCJfbG9jYWxaT3JkZXIiLCJzZXJpYWxpemFibGUiLCJfaXMzRE5vZGUiLCJfZ3JvdXBJbmRleCIsImZvcm1lcmx5U2VyaWFsaXplZEFzIiwiZ2V0Iiwic2V0IiwiZ3JvdXAiLCJnYW1lIiwiZ3JvdXBMaXN0IiwiaW5kZXhPZiIsIngiLCJpc0Zpbml0ZSIsIm9sZFZhbHVlIiwic2V0TG9jYWxEaXJ0eSIsIl9ldmVudE1hc2siLCJlcnJvciIsInkiLCJfcmVuZGVyRmxhZyIsIkZMQUdfV09STERfVFJBTlNGT1JNIiwiQ0NfREVCVUciLCJhbmdsZSIsImZyb21BbmdsZVoiLCJyb3RhdGlvblgiLCJmcm9tRXVsZXJOdW1iZXIiLCJyb3RhdGlvblkiLCJldWxlckFuZ2xlcyIsInRvRXVsZXIiLCJ2IiwiZnJvbUV1bGVyIiwiRkxBR19UUkFOU0ZPUk0iLCJxdWF0Iiwic2V0Um90YXRpb24iLCJzY2FsZSIsInNldFNjYWxlIiwic2NhbGVYIiwic2NhbGVZIiwic2NhbGVaIiwic2tld1giLCJ1cGRhdGVTa2V3Iiwic2tld1kiLCJvcGFjaXR5IiwibWlzYyIsImNsYW1wZiIsInVwZGF0ZU9wYWNpdHkiLCJGTEFHX09QQUNJVFlfQ09MT1IiLCJyYW5nZSIsImNvbG9yIiwiY2xvbmUiLCJlcXVhbHMiLCJDQ19ERVYiLCJ3YXJuSUQiLCJGTEFHX0NPTE9SIiwiYW5jaG9yWCIsImFuY2hvclBvaW50IiwiYW5jaG9yWSIsIndpZHRoIiwic2l6ZSIsImhlaWdodCIsInpJbmRleCIsIk1BWF9aSU5ERVgiLCJNSU5fWklOREVYIiwiX29uU2libGluZ0luZGV4Q2hhbmdlZCIsImlzM0ROb2RlIiwiX3VwZGF0ZTNERnVuY3Rpb24iLCJjdG9yIiwiX3Jlb3JkZXJDaGlsZERpcnR5IiwiX3dpZGdldCIsIl9yZW5kZXJDb21wb25lbnQiLCJfdG91Y2hMaXN0ZW5lciIsIl9pbml0RGF0YUZyb21Qb29sIiwiX2NoaWxkQXJyaXZhbE9yZGVyIiwicmVuZGVyZXIiLCJOb2RlUHJveHkiLCJfc3BhY2VJbmZvIiwidW5pdElEIiwiX2lkIiwiX25hbWUiLCJpbml0Iiwic3RhdGljcyIsIl9Mb2NhbERpcnR5RmxhZyIsIm9iaiIsImNvbnN0cnVjdG9yIiwiU2NlbmUiLCJfZGVsYXlTb3J0IiwiX29uUHJlRGVzdHJveSIsImRlc3Ryb3lCeVBhcmVudCIsIl9vblByZURlc3Ryb3lCYXNlIiwiZGlyZWN0b3IiLCJnZXRBY3Rpb25NYW5hZ2VyIiwicmVtb3ZlQWxsQWN0aW9uc0Zyb21UYXJnZXQiLCJyZW1vdmVMaXN0ZW5lcnMiLCJtYXNrIiwiZGVzdHJveSIsIl9iYWNrRGF0YUludG9Qb29sIiwiX19mYXN0T2ZmIiwiRGlyZWN0b3IiLCJFVkVOVF9BRlRFUl9VUERBVEUiLCJzb3J0QWxsQ2hpbGRyZW4iLCJfb25Qb3N0QWN0aXZhdGVkIiwiYWN0aXZlIiwiYWN0aW9uTWFuYWdlciIsInJlc3VtZVRhcmdldCIsIl9jaGVja0xpc3RlbmVyTWFzayIsInBhdXNlVGFyZ2V0IiwiX29uSGllcmFyY2h5Q2hhbmdlZCIsIm9sZFBhcmVudCIsIl91cGRhdGVPcmRlck9mQXJyaXZhbCIsIl9vbkhpZXJhcmNoeUNoYW5nZWRCYXNlIiwiX3dpZGdldE1hbmFnZXIiLCJfbm9kZXNPcmRlckRpcnR5IiwiX2FjdGl2ZUluSGllcmFyY2h5IiwidXBkYXRlUGFyZW50IiwiX2NhbGN1bFdvcmxkTWF0cml4IiwiX29uM0ROb2RlQ2hhbmdlZCIsInVwZGF0ZTNETm9kZSIsIkNDX1RFU1QiLCJGbG9hdDY0QXJyYXkiLCJsb2NhbE1hdCIsIndvcmxkTWF0IiwicG9wIiwic3BhY2VJbmZvIiwiaWRlbnRpdHkiLCJfdG9FdWxlciIsImFzaW4iLCJfZnJvbUV1bGVyIiwiX3VwZ3JhZGVfMXhfdG9fMngiLCJkZXNUcnMiLCJzdWJhcnJheSIsIl9vbkJhdGNoQ3JlYXRlZCIsInByZWZhYkluZm8iLCJfcHJlZmFiIiwic3luYyIsInJvb3QiLCJhc3NlcnQiLCJfc3luY2VkIiwic3luY1dpdGhQcmVmYWIiLCJjaGlsZHJlbiIsImxlbiIsIkZMQUdfQ0hJTERSRU4iLCJpbml0TmF0aXZlIiwiX29uQmF0Y2hSZXN0b3JlZCIsIm1hbmFnZXIiLCJNYXNrIiwiX2NoZWNrblNldHVwU3lzRXZlbnQiLCJuZXdBZGRlZCIsImZvckRpc3BhdGNoIiwiRXZlbnRMaXN0ZW5lciIsImNyZWF0ZSIsIlRPVUNIX09ORV9CWV9PTkUiLCJzd2FsbG93VG91Y2hlcyIsIm9uVG91Y2hCZWdhbiIsIm9uVG91Y2hNb3ZlZCIsIm9uVG91Y2hFbmRlZCIsIm9uVG91Y2hDYW5jZWxsZWQiLCJhZGRMaXN0ZW5lciIsIk1PVVNFIiwib25Nb3VzZURvd24iLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VVcCIsIm9uTW91c2VTY3JvbGwiLCJnZXRTY2hlZHVsZXIiLCJzY2hlZHVsZSIsIm9uIiwiY2FsbGJhY2siLCJ1c2VDYXB0dXJlIiwiX29uRGlzcGF0Y2giLCJvbmNlIiwibGlzdGVuZXJzIiwiZXJyb3JJRCIsIl9fZXZlbnRUYXJnZXRzIiwib2ZmIiwidG91Y2hFdmVudCIsIm1vdXNlRXZlbnQiLCJfb2ZmRGlzcGF0Y2giLCJyZW1vdmVMaXN0ZW5lciIsImhhc0xpc3RlbmVycyIsInJlbW92ZUFsbCIsImFycmF5IiwiZmFzdFJlbW92ZSIsInRhcmdldE9mZiIsImhhcyIsImFyZzEiLCJhcmcyIiwiYXJnMyIsImFyZzQiLCJhcmc1IiwicGF1c2VTeXN0ZW1FdmVudHMiLCJyZWN1cnNpdmUiLCJyZXN1bWVTeXN0ZW1FdmVudHMiLCJwb2ludCIsImxpc3RlbmVyIiwidyIsImgiLCJjYW1lcmFQdCIsInRlc3RQdCIsImNhbWVyYSIsIkNhbWVyYSIsImZpbmRDYW1lcmEiLCJnZXRTY3JlZW5Ub1dvcmxkUG9pbnQiLCJfdXBkYXRlV29ybGRNYXRyaXgiLCJpbnZlcnQiLCJWZWMyIiwidHJhbnNmb3JtTWF0NCIsImoiLCJ0ZW1wIiwiX2VuYWJsZWQiLCJydW5BY3Rpb24iLCJhY3Rpb24iLCJhc3NlcnRJRCIsIl9zdXBwcmVzc0RlcHJlY2F0aW9uIiwiYWRkQWN0aW9uIiwicGF1c2VBbGxBY3Rpb25zIiwicmVzdW1lQWxsQWN0aW9ucyIsInN0b3BBbGxBY3Rpb25zIiwic3RvcEFjdGlvbiIsInJlbW92ZUFjdGlvbiIsInN0b3BBY3Rpb25CeVRhZyIsInRhZyIsIkFjdGlvbiIsIlRBR19JTlZBTElEIiwibG9nSUQiLCJyZW1vdmVBY3Rpb25CeVRhZyIsImdldEFjdGlvbkJ5VGFnIiwiZ2V0TnVtYmVyT2ZSdW5uaW5nQWN0aW9ucyIsImdldE51bWJlck9mUnVubmluZ0FjdGlvbnNJblRhcmdldCIsImdldFBvc2l0aW9uIiwidG9Qb3NpdGlvbiIsInNldFBvc2l0aW9uIiwibmV3UG9zT3JYIiwib2xkUG9zaXRpb24iLCJnZXRTY2FsZSIsInRvU2NhbGUiLCJnZXRSb3RhdGlvbiIsInRvUm90YXRpb24iLCJnZXRDb250ZW50U2l6ZSIsInNldENvbnRlbnRTaXplIiwibG9jQ29udGVudFNpemUiLCJnZXRBbmNob3JQb2ludCIsInNldEFuY2hvclBvaW50IiwibG9jQW5jaG9yUG9pbnQiLCJfaW52VHJhbnNmb3JtUG9pbnQiLCJsdHJzIiwic3ViIiwiY29uanVnYXRlIiwidHJhbnNmb3JtUXVhdCIsImludmVyc2VTYWZlIiwiZ2V0V29ybGRQb3NpdGlvbiIsImFkZCIsInNldFdvcmxkUG9zaXRpb24iLCJmcm9tUG9zaXRpb24iLCJnZXRXb3JsZFJvdGF0aW9uIiwic2V0V29ybGRSb3RhdGlvbiIsInZhbCIsImZyb21Sb3RhdGlvbiIsImdldFdvcmxkU2NhbGUiLCJzZXRXb3JsZFNjYWxlIiwiZGl2IiwiZnJvbVNjYWxlIiwiZ2V0V29ybGRSVCIsIm9wb3MiLCJvcm90IiwiZnJvbVJUIiwibG9va0F0IiwidXAiLCJub3JtYWxpemUiLCJmcm9tVmlld1VwIiwibCIsImZsYWciLCJzZXRXb3JsZERpcnR5IiwiZ2V0TG9jYWxNYXRyaXgiLCJnZXRXb3JsZE1hdHJpeCIsImNvbnZlcnRUb05vZGVTcGFjZUFSIiwid29ybGRQb2ludCIsImNvbnZlcnRUb1dvcmxkU3BhY2VBUiIsIm5vZGVQb2ludCIsImNvbnZlcnRUb05vZGVTcGFjZSIsImNvbnZlcnRUb1dvcmxkU3BhY2UiLCJnZXROb2RlVG9QYXJlbnRUcmFuc2Zvcm0iLCJjb250ZW50U2l6ZSIsInRyYW5zZm9ybSIsImZyb21NYXQ0IiwiZ2V0Tm9kZVRvUGFyZW50VHJhbnNmb3JtQVIiLCJnZXROb2RlVG9Xb3JsZFRyYW5zZm9ybSIsImdldE5vZGVUb1dvcmxkVHJhbnNmb3JtQVIiLCJnZXRQYXJlbnRUb05vZGVUcmFuc2Zvcm0iLCJnZXRXb3JsZFRvTm9kZVRyYW5zZm9ybSIsImNvbnZlcnRUb3VjaFRvTm9kZVNwYWNlIiwiY29udmVydFRvdWNoVG9Ob2RlU3BhY2VBUiIsImdldEJvdW5kaW5nQm94IiwicmVjdCIsImdldEJvdW5kaW5nQm94VG9Xb3JsZCIsIl9nZXRCb3VuZGluZ0JveFRvIiwibG9jQ2hpbGRyZW4iLCJjaGlsZCIsImNoaWxkUmVjdCIsInVuaW9uIiwiYXJyaXZhbE9yZGVyIiwiYWRkQ2hpbGQiLCJnZXRDbGFzc05hbWUiLCJjbGVhbnVwIiwiX3NldERpcnR5Rm9yTm9kZSIsIl9fZmFzdE9uIiwiX3Jlc3RvcmVQcm9wZXJ0aWVzIiwibWFya0ZvclJlbmRlciIsIm9uUmVzdG9yZSIsIl9vblJlc3RvcmVCYXNlIiwibWl4aW4iLCJfc2NhbGVYIiwiRmxvYXQiLCJlZGl0b3JPbmx5IiwiX3NjYWxlWSIsIkNsYXNzIiwiX3AiLCJwcm90b3R5cGUiLCJnZXRzZXQiLCJ2ZWMzX3RtcCIsImFuZ2xlcyIsImFkZFNlbGYiLCJzdWJTZWxmIiwibW9kdWxl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QUFqRTs7QUFFQSxJQUFJemMsU0FBSixFQUFlO0FBQ1gsTUFBSWlpQixRQUFRLEdBQUcsSUFBSXpoQixnQkFBSixFQUFmO0FBQ0FaLEVBQUFBLEVBQUUsQ0FBQ0wsRUFBSCxDQUFNeWlCLE1BQU4sQ0FBYUYsRUFBYixFQUFpQixrQkFBakIsRUFBcUMsWUFBWTtBQUM3QyxRQUFJSSxNQUFNLEdBQUcsSUFBSTFoQixnQkFBSixDQUFTLEtBQUswSyxZQUFkLENBQWI7QUFDQSxRQUFJaEMsTUFBTSxHQUFHLEtBQUtBLE1BQWxCOztBQUNBLFdBQU9BLE1BQVAsRUFBZTtBQUNYZ1osTUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVqWixNQUFNLENBQUNnQyxZQUF0QjtBQUNBaEMsTUFBQUEsTUFBTSxHQUFHQSxNQUFNLENBQUNBLE1BQWhCO0FBQ0g7O0FBQ0QsV0FBT2daLE1BQVA7QUFDSCxHQVJELEVBUUcsVUFBVWpTLENBQVYsRUFBYTtBQUNaZ1MsSUFBQUEsUUFBUSxDQUFDdFQsR0FBVCxDQUFhc0IsQ0FBYjtBQUNBLFFBQUkvRyxNQUFNLEdBQUcsS0FBS0EsTUFBbEI7O0FBQ0EsV0FBT0EsTUFBUCxFQUFlO0FBQ1grWSxNQUFBQSxRQUFRLENBQUNHLE9BQVQsQ0FBaUJsWixNQUFNLENBQUNnQyxZQUF4QjtBQUNBaEMsTUFBQUEsTUFBTSxHQUFHQSxNQUFNLENBQUNBLE1BQWhCO0FBQ0g7O0FBQ0QsU0FBSzZHLFdBQUwsR0FBbUJrUyxRQUFuQjtBQUNILEdBaEJEO0FBaUJIOztBQUVEcmlCLEVBQUUsQ0FBQzhILElBQUgsR0FBVTJhLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjVhLElBQTNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHsgTWF0NCwgVmVjMiwgVmVjMywgUXVhdCwgVHJzIH0gZnJvbSAnLi92YWx1ZS10eXBlcyc7XG5cbmNvbnN0IEJhc2VOb2RlID0gcmVxdWlyZSgnLi91dGlscy9iYXNlLW5vZGUnKTtcbmNvbnN0IFByZWZhYkhlbHBlciA9IHJlcXVpcmUoJy4vdXRpbHMvcHJlZmFiLWhlbHBlcicpO1xuY29uc3Qgbm9kZU1lbVBvb2wgPSByZXF1aXJlKCcuL3V0aWxzL3RyYW5zLXBvb2wnKS5Ob2RlTWVtUG9vbDtcbmNvbnN0IEFmZmluZVRyYW5zID0gcmVxdWlyZSgnLi91dGlscy9hZmZpbmUtdHJhbnNmb3JtJyk7XG5jb25zdCBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL2V2ZW50LW1hbmFnZXInKTtcbmNvbnN0IG1hY3JvID0gcmVxdWlyZSgnLi9wbGF0Zm9ybS9DQ01hY3JvJyk7XG5jb25zdCBqcyA9IHJlcXVpcmUoJy4vcGxhdGZvcm0vanMnKTtcbmNvbnN0IEV2ZW50ID0gcmVxdWlyZSgnLi9ldmVudC9ldmVudCcpO1xuY29uc3QgRXZlbnRUYXJnZXQgPSByZXF1aXJlKCcuL2V2ZW50L2V2ZW50LXRhcmdldCcpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4vcmVuZGVyZXIvcmVuZGVyLWZsb3cnKTtcblxuY29uc3QgRmxhZ3MgPSBjYy5PYmplY3QuRmxhZ3M7XG5jb25zdCBEZXN0cm95aW5nID0gRmxhZ3MuRGVzdHJveWluZztcblxuY29uc3QgRVJSX0lOVkFMSURfTlVNQkVSID0gQ0NfRURJVE9SICYmICdUaGUgJXMgaXMgaW52YWxpZCc7XG5jb25zdCBPTkVfREVHUkVFID0gTWF0aC5QSSAvIDE4MDtcblxudmFyIEFjdGlvbk1hbmFnZXJFeGlzdCA9ICEhY2MuQWN0aW9uTWFuYWdlcjtcbnZhciBlbXB0eUZ1bmMgPSBmdW5jdGlvbiAoKSB7fTtcblxuLy8gZ2V0V29ybGRQb3NpdGlvbiB0ZW1wIHZhclxudmFyIF9nd3BWZWMzID0gbmV3IFZlYzMoKTtcbnZhciBfZ3dwUXVhdCA9IG5ldyBRdWF0KCk7XG5cbi8vIF9pbnZUcmFuc2Zvcm1Qb2ludCB0ZW1wIHZhclxudmFyIF90cFZlYzNhID0gbmV3IFZlYzMoKTtcbnZhciBfdHBWZWMzYiA9IG5ldyBWZWMzKCk7XG52YXIgX3RwUXVhdGEgPSBuZXcgUXVhdCgpO1xudmFyIF90cFF1YXRiID0gbmV3IFF1YXQoKTtcblxuLy8gc2V0V29ybGRQb3NpdGlvbiB0ZW1wIHZhclxudmFyIF9zd3BWZWMzID0gbmV3IFZlYzMoKTtcblxuLy8gZ2V0V29ybGRTY2FsZSB0ZW1wIHZhclxudmFyIF9nd3NWZWMzID0gbmV3IFZlYzMoKTtcblxuLy8gc2V0V29ybGRTY2FsZSB0ZW1wIHZhclxudmFyIF9zd3NWZWMzID0gbmV3IFZlYzMoKTtcblxuLy8gZ2V0V29ybGRSVCB0ZW1wIHZhclxudmFyIF9nd3J0VmVjM2EgPSBuZXcgVmVjMygpO1xudmFyIF9nd3J0VmVjM2IgPSBuZXcgVmVjMygpO1xudmFyIF9nd3J0UXVhdGEgPSBuZXcgUXVhdCgpO1xudmFyIF9nd3J0UXVhdGIgPSBuZXcgUXVhdCgpO1xuXG4vLyBsb29rQXQgdGVtcCB2YXJcbnZhciBfbGFWZWMzID0gbmV3IFZlYzMoKTtcbnZhciBfbGFRdWF0ID0gbmV3IFF1YXQoKTtcblxuLy8gX2hpdFRlc3QgdGVtcCB2YXJcbnZhciBfaHRWZWMzYSA9IG5ldyBWZWMzKCk7XG52YXIgX2h0VmVjM2IgPSBuZXcgVmVjMygpO1xuXG4vLyBnZXRXb3JsZFJvdGF0aW9uIHRlbXAgdmFyXG52YXIgX2d3clF1YXQgPSBuZXcgUXVhdCgpO1xuXG4vLyBzZXRXb3JsZFJvdGF0aW9uIHRlbXAgdmFyXG52YXIgX3N3clF1YXQgPSBuZXcgUXVhdCgpO1xuXG52YXIgX3F1YXRhID0gbmV3IFF1YXQoKTtcbnZhciBfbWF0NF90ZW1wID0gY2MubWF0NCgpO1xudmFyIF92ZWMzX3RlbXAgPSBuZXcgVmVjMygpO1xuXG52YXIgX2NhY2hlZEFycmF5ID0gbmV3IEFycmF5KDE2KTtcbl9jYWNoZWRBcnJheS5sZW5ndGggPSAwO1xuXG5jb25zdCBQT1NJVElPTl9PTiA9IDEgPDwgMDtcbmNvbnN0IFNDQUxFX09OID0gMSA8PCAxO1xuY29uc3QgUk9UQVRJT05fT04gPSAxIDw8IDI7XG5jb25zdCBTSVpFX09OID0gMSA8PCAzO1xuY29uc3QgQU5DSE9SX09OID0gMSA8PCA0O1xuY29uc3QgQ09MT1JfT04gPSAxIDw8IDU7XG5cblxubGV0IEJ1aWx0aW5Hcm91cEluZGV4ID0gY2MuRW51bSh7XG4gICAgREVCVUc6IDMxXG59KTtcblxuLyoqXG4gKiAhI2VuIE5vZGUncyBsb2NhbCBkaXJ0eSBwcm9wZXJ0aWVzIGZsYWdcbiAqICEjemggTm9kZSDnmoTmnKzlnLDlsZ7mgKcgZGlydHkg54q25oCB5L2NXG4gKiBAZW51bSBOb2RlLl9Mb2NhbERpcnR5RmxhZ1xuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqIEBuYW1lc3BhY2UgTm9kZVxuICovXG52YXIgTG9jYWxEaXJ0eUZsYWcgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBvc2l0aW9uIGRpcnR5XG4gICAgICogISN6aCDkvY3nva4gZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFBPU0lUSU9OXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFBPU0lUSU9OOiAxIDw8IDAsXG4gICAgLyoqXG4gICAgICogISNlbiBGbGFnIGZvciBzY2FsZSBkaXJ0eVxuICAgICAqICEjemgg57yp5pS+IGRpcnR5IOeahOagh+iusOS9jVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTQ0FMRVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBTQ0FMRTogMSA8PCAxLFxuICAgIC8qKlxuICAgICAqICEjZW4gRmxhZyBmb3Igcm90YXRpb24gZGlydHlcbiAgICAgKiAhI3poIOaXi+i9rCBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUk9UQVRJT05cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgUk9UQVRJT046IDEgPDwgMixcbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHNrZXcgZGlydHlcbiAgICAgKiAhI3poIHNrZXcgZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNLRVdcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgU0tFVzogMSA8PCAzLFxuICAgIC8qKlxuICAgICAqICEjZW4gRmxhZyBmb3Igcm90YXRpb24sIHNjYWxlIG9yIHBvc2l0aW9uIGRpcnR5XG4gICAgICogISN6aCDml4vovazvvIznvKnmlL7vvIzmiJbkvY3nva4gZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFRSU1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBUUlM6IDEgPDwgMCB8IDEgPDwgMSB8IDEgPDwgMixcbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHJvdGF0aW9uIG9yIHNjYWxlIGRpcnR5XG4gICAgICogISN6aCDml4vovazmiJbnvKnmlL4gZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFJTXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFJTOiAxIDw8IDEgfCAxIDw8IDIsXG4gICAgLyoqXG4gICAgICogISNlbiBGbGFnIGZvciByb3RhdGlvbiwgc2NhbGUsIHBvc2l0aW9uLCBza2V3IGRpcnR5XG4gICAgICogISN6aCDml4vovazvvIznvKnmlL7vvIzkvY3nva7vvIzmiJbmlpzop5IgZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFRSU1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBUUlNTOiAxIDw8IDAgfCAxIDw8IDEgfCAxIDw8IDIgfCAxIDw8IDMsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBoeXNpY3MgcG9zaXRpb24gZGlydHlcbiAgICAgKiAhI3poIOeJqeeQhuS9jee9riBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUEhZU0lDU19QT1NJVElPTlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBQSFlTSUNTX1BPU0lUSU9OOiAxIDw8IDQsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBoeXNpY3Mgc2NhbGUgZGlydHlcbiAgICAgKiAhI3poIOeJqeeQhue8qeaUviBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUEhZU0lDU19TQ0FMRVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBQSFlTSUNTX1NDQUxFOiAxIDw8IDUsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBoeXNpY3Mgcm90YXRpb24gZGlydHlcbiAgICAgKiAhI3poIOeJqeeQhuaXi+i9rCBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUEhZU0lDU19ST1RBVElPTlxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBQSFlTSUNTX1JPVEFUSU9OOiAxIDw8IDYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBoeXNpY3MgdHJzIGRpcnR5XG4gICAgICogISN6aCDniannkIbkvY3nva7ml4vovaznvKnmlL4gZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFBIWVNJQ1NfVFJTXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFBIWVNJQ1NfVFJTOiAxIDw8IDQgfCAxIDw8IDUgfCAxIDw8IDYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIHBoeXNpY3MgcnMgZGlydHlcbiAgICAgKiAhI3poIOeJqeeQhuaXi+i9rOe8qeaUviBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUEhZU0lDU19SU1xuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBQSFlTSUNTX1JTOiAxIDw8IDUgfCAxIDw8IDYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIG5vZGUgYW5kIHBoeXNpY3MgcG9zaXRpb24gZGlydHlcbiAgICAgKiAhI3poIOaJgOacieS9jee9riBkaXJ0eSDnmoTmoIforrDkvY1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gQUxMX1BPU0lUSU9OXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIEFMTF9QT1NJVElPTjogMSA8PCAwIHwgMSA8PCA0LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBGbGFnIGZvciBub2RlIGFuZCBwaHlzaWNzIHNjYWxlIGRpcnR5XG4gICAgICogISN6aCDmiYDmnInnvKnmlL4gZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEFMTF9TQ0FMRVxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBBTExfU0NBTEU6IDEgPDwgMSB8IDEgPDwgNSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRmxhZyBmb3Igbm9kZSBhbmQgcGh5c2ljcyByb3RhdGlvbiBkaXJ0eVxuICAgICAqICEjemgg5omA5pyJ5peL6L2sIGRpcnR5IOeahOagh+iusOS9jVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBBTExfUk9UQVRJT05cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgQUxMX1JPVEFUSU9OOiAxIDw8IDIgfCAxIDw8IDYsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEZsYWcgZm9yIG5vZGUgYW5kIHBoeXNpY3MgdHJzIGRpcnR5XG4gICAgICogISN6aCDmiYDmnIl0cnMgZGlydHkg55qE5qCH6K6w5L2NXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IEFMTF9UUlNcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgQUxMX1RSUzogMSA8PCAwIHwgMSA8PCAxIHwgMSA8PCAyIHwgMSA8PCA0IHwgMSA8PCA1IHwgMSA8PCA2LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBGbGFnIGZvciBhbGwgZGlydHkgcHJvcGVydGllc1xuICAgICAqICEjemgg6KaG55uW5omA5pyJIGRpcnR5IOeKtuaAgeeahOagh+iusOS9jVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBBTExcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgQUxMOiAweGZmZmYsXG59KTtcblxuLyoqXG4gKiAhI2VuIFRoZSBldmVudCB0eXBlIHN1cHBvcnRlZCBieSBOb2RlXG4gKiAhI3poIE5vZGUg5pSv5oyB55qE5LqL5Lu257G75Z6LXG4gKiBAY2xhc3MgTm9kZS5FdmVudFR5cGVcbiAqIEBzdGF0aWNcbiAqIEBuYW1lc3BhY2UgTm9kZVxuICovXG4vLyBXaHkgRXZlbnRUeXBlIGRlZmluZWQgYXMgY2xhc3MsIGJlY2F1c2UgdGhlIGZpcnN0IHBhcmFtZXRlciBvZiBOb2RlLm9uIG1ldGhvZCBuZWVkcyBzZXQgYXMgJ3N0cmluZycgdHlwZS5cbnZhciBFdmVudFR5cGUgPSBjYy5FbnVtKHtcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciB0b3VjaCBzdGFydCBldmVudCwgeW91IGNhbiB1c2UgaXRzIHZhbHVlIGRpcmVjdGx5OiAndG91Y2hzdGFydCdcbiAgICAgKiAhI3poIOW9k+aJi+aMh+inpuaRuOWIsOWxj+W5leaXtuOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBUT1VDSF9TVEFSVFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBUT1VDSF9TVEFSVDogJ3RvdWNoc3RhcnQnLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgZm9yIHRvdWNoIG1vdmUgZXZlbnQsIHlvdSBjYW4gdXNlIGl0cyB2YWx1ZSBkaXJlY3RseTogJ3RvdWNobW92ZSdcbiAgICAgKiAhI3poIOW9k+aJi+aMh+WcqOWxj+W5leS4iuenu+WKqOaXtuOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBUT1VDSF9NT1ZFXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFRPVUNIX01PVkU6ICd0b3VjaG1vdmUnLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgZm9yIHRvdWNoIGVuZCBldmVudCwgeW91IGNhbiB1c2UgaXRzIHZhbHVlIGRpcmVjdGx5OiAndG91Y2hlbmQnXG4gICAgICogISN6aCDlvZPmiYvmjIflnKjnm67moIfoioLngrnljLrln5/lhoXnprvlvIDlsY/luZXml7bjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gVE9VQ0hfRU5EXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFRPVUNIX0VORDogJ3RvdWNoZW5kJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciB0b3VjaCBlbmQgZXZlbnQsIHlvdSBjYW4gdXNlIGl0cyB2YWx1ZSBkaXJlY3RseTogJ3RvdWNoY2FuY2VsJ1xuICAgICAqICEjemgg5b2T5omL5oyH5Zyo55uu5qCH6IqC54K55Yy65Z+f5aSW56a75byA5bGP5bmV5pe244CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IFRPVUNIX0NBTkNFTFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBUT1VDSF9DQU5DRUw6ICd0b3VjaGNhbmNlbCcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBtb3VzZSBkb3duIGV2ZW50cywgeW91IGNhbiB1c2UgaXRzIHZhbHVlIGRpcmVjdGx5OiAnbW91c2Vkb3duJ1xuICAgICAqICEjemgg5b2T6byg5qCH5oyJ5LiL5pe26Kem5Y+R5LiA5qyh44CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE1PVVNFX0RPV05cbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgTU9VU0VfRE9XTjogJ21vdXNlZG93bicsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3IgbW91c2UgbW92ZSBldmVudHMsIHlvdSBjYW4gdXNlIGl0cyB2YWx1ZSBkaXJlY3RseTogJ21vdXNlbW92ZSdcbiAgICAgKiAhI3poIOW9k+m8oOagh+WcqOebruagh+iKgueCueWcqOebruagh+iKgueCueWMuuWfn+S4reenu+WKqOaXtu+8jOS4jeiuuuaYr+WQpuaMieS4i+OAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBNT1VTRV9NT1ZFXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIE1PVVNFX01PVkU6ICdtb3VzZW1vdmUnLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgZm9yIG1vdXNlIGVudGVyIHRhcmdldCBldmVudHMsIHlvdSBjYW4gdXNlIGl0cyB2YWx1ZSBkaXJlY3RseTogJ21vdXNlZW50ZXInXG4gICAgICogISN6aCDlvZPpvKDmoIfnp7vlhaXnm67moIfoioLngrnljLrln5/ml7bvvIzkuI3orrrmmK/lkKbmjInkuIvjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gTU9VU0VfRU5URVJcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgTU9VU0VfRU5URVI6ICdtb3VzZWVudGVyJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBtb3VzZSBsZWF2ZSB0YXJnZXQgZXZlbnRzLCB5b3UgY2FuIHVzZSBpdHMgdmFsdWUgZGlyZWN0bHk6ICdtb3VzZWxlYXZlJ1xuICAgICAqICEjemgg5b2T6byg5qCH56e75Ye655uu5qCH6IqC54K55Yy65Z+f5pe277yM5LiN6K665piv5ZCm5oyJ5LiL44CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE1PVVNFX0xFQVZFXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIE1PVVNFX0xFQVZFOiAnbW91c2VsZWF2ZScsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3IgbW91c2UgdXAgZXZlbnRzLCB5b3UgY2FuIHVzZSBpdHMgdmFsdWUgZGlyZWN0bHk6ICdtb3VzZXVwJ1xuICAgICAqICEjemgg5b2T6byg5qCH5LuO5oyJ5LiL54q25oCB5p2+5byA5pe26Kem5Y+R5LiA5qyh44CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE1PVVNFX1VQXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIE1PVVNFX1VQOiAnbW91c2V1cCcsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3IgbW91c2Ugd2hlZWwgZXZlbnRzLCB5b3UgY2FuIHVzZSBpdHMgdmFsdWUgZGlyZWN0bHk6ICdtb3VzZXdoZWVsJ1xuICAgICAqICEjemgg5b2T6byg5qCH5rua6L2u5rua5Yqo5pe244CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IE1PVVNFX1dIRUVMXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIE1PVVNFX1dIRUVMOiAnbW91c2V3aGVlbCcsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBwb3NpdGlvbiBjaGFuZ2UgZXZlbnRzLlxuICAgICAqIFBlcmZvcm1hbmNlIG5vdGUsIHRoaXMgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgZXZlcnkgdGltZSBjb3JyZXNwb25kaW5nIHByb3BlcnRpZXMgYmVpbmcgY2hhbmdlZCxcbiAgICAgKiBpZiB0aGUgZXZlbnQgY2FsbGJhY2sgaGF2ZSBoZWF2eSBsb2dpYyBpdCBtYXkgaGF2ZSBncmVhdCBwZXJmb3JtYW5jZSBpbXBhY3QsIHRyeSB0byBhdm9pZCBzdWNoIHNjZW5hcmlvLlxuICAgICAqICEjemgg5b2T6IqC54K55L2N572u5pS55Y+Y5pe26Kem5Y+R55qE5LqL5Lu244CCXG4gICAgICog5oCn6IO96K2m5ZGK77ya6L+Z5Liq5LqL5Lu25Lya5Zyo5q+P5qyh5a+55bqU55qE5bGe5oCn6KKr5L+u5pS55pe26Kem5Y+R77yM5aaC5p6c5LqL5Lu25Zue6LCD5o2f6ICX6L6D6auY77yM5pyJ5Y+v6IO95a+55oCn6IO95pyJ5b6I5aSn55qE6LSf6Z2i5b2x5ZON77yM6K+35bC96YeP6YG/5YWN6L+Z56eN5oOF5Ya144CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IFBPU0lUSU9OX0NIQU5HRURcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgUE9TSVRJT05fQ0hBTkdFRDogJ3Bvc2l0aW9uLWNoYW5nZWQnLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgZm9yIHJvdGF0aW9uIGNoYW5nZSBldmVudHMuXG4gICAgICogUGVyZm9ybWFuY2Ugbm90ZSwgdGhpcyBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBldmVyeSB0aW1lIGNvcnJlc3BvbmRpbmcgcHJvcGVydGllcyBiZWluZyBjaGFuZ2VkLFxuICAgICAqIGlmIHRoZSBldmVudCBjYWxsYmFjayBoYXZlIGhlYXZ5IGxvZ2ljIGl0IG1heSBoYXZlIGdyZWF0IHBlcmZvcm1hbmNlIGltcGFjdCwgdHJ5IHRvIGF2b2lkIHN1Y2ggc2NlbmFyaW8uXG4gICAgICogISN6aCDlvZPoioLngrnml4vovazmlLnlj5jml7bop6blj5HnmoTkuovku7bjgIJcbiAgICAgKiDmgKfog73orablkYrvvJrov5nkuKrkuovku7bkvJrlnKjmr4/mrKHlr7nlupTnmoTlsZ7mgKfooqvkv67mlLnml7bop6blj5HvvIzlpoLmnpzkuovku7blm57osIPmjZ/ogJfovoPpq5jvvIzmnInlj6/og73lr7nmgKfog73mnInlvojlpKfnmoTotJ/pnaLlvbHlk43vvIzor7flsL3ph4/pgb/lhY3ov5nnp43mg4XlhrXjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gUk9UQVRJT05fQ0hBTkdFRFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBST1RBVElPTl9DSEFOR0VEOiAncm90YXRpb24tY2hhbmdlZCcsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3Igc2NhbGUgY2hhbmdlIGV2ZW50cy5cbiAgICAgKiBQZXJmb3JtYW5jZSBub3RlLCB0aGlzIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkIGV2ZXJ5IHRpbWUgY29ycmVzcG9uZGluZyBwcm9wZXJ0aWVzIGJlaW5nIGNoYW5nZWQsXG4gICAgICogaWYgdGhlIGV2ZW50IGNhbGxiYWNrIGhhdmUgaGVhdnkgbG9naWMgaXQgbWF5IGhhdmUgZ3JlYXQgcGVyZm9ybWFuY2UgaW1wYWN0LCB0cnkgdG8gYXZvaWQgc3VjaCBzY2VuYXJpby5cbiAgICAgKiAhI3poIOW9k+iKgueCuee8qeaUvuaUueWPmOaXtuinpuWPkeeahOS6i+S7tuOAglxuICAgICAqIOaAp+iDveitpuWRiu+8mui/meS4quS6i+S7tuS8muWcqOavj+asoeWvueW6lOeahOWxnuaAp+iiq+S/ruaUueaXtuinpuWPke+8jOWmguaenOS6i+S7tuWbnuiwg+aNn+iAl+i+g+mrmO+8jOacieWPr+iDveWvueaAp+iDveacieW+iOWkp+eahOi0n+mdouW9seWTje+8jOivt+WwvemHj+mBv+WFjei/meenjeaDheWGteOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBTQ0FMRV9DSEFOR0VEXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFNDQUxFX0NIQU5HRUQ6ICdzY2FsZS1jaGFuZ2VkJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBzaXplIGNoYW5nZSBldmVudHMuXG4gICAgICogUGVyZm9ybWFuY2Ugbm90ZSwgdGhpcyBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBldmVyeSB0aW1lIGNvcnJlc3BvbmRpbmcgcHJvcGVydGllcyBiZWluZyBjaGFuZ2VkLFxuICAgICAqIGlmIHRoZSBldmVudCBjYWxsYmFjayBoYXZlIGhlYXZ5IGxvZ2ljIGl0IG1heSBoYXZlIGdyZWF0IHBlcmZvcm1hbmNlIGltcGFjdCwgdHJ5IHRvIGF2b2lkIHN1Y2ggc2NlbmFyaW8uXG4gICAgICogISN6aCDlvZPoioLngrnlsLrlr7jmlLnlj5jml7bop6blj5HnmoTkuovku7bjgIJcbiAgICAgKiDmgKfog73orablkYrvvJrov5nkuKrkuovku7bkvJrlnKjmr4/mrKHlr7nlupTnmoTlsZ7mgKfooqvkv67mlLnml7bop6blj5HvvIzlpoLmnpzkuovku7blm57osIPmjZ/ogJfovoPpq5jvvIzmnInlj6/og73lr7nmgKfog73mnInlvojlpKfnmoTotJ/pnaLlvbHlk43vvIzor7flsL3ph4/pgb/lhY3ov5nnp43mg4XlhrXjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gU0laRV9DSEFOR0VEXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFNJWkVfQ0hBTkdFRDogJ3NpemUtY2hhbmdlZCcsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3IgYW5jaG9yIHBvaW50IGNoYW5nZSBldmVudHMuXG4gICAgICogUGVyZm9ybWFuY2Ugbm90ZSwgdGhpcyBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBldmVyeSB0aW1lIGNvcnJlc3BvbmRpbmcgcHJvcGVydGllcyBiZWluZyBjaGFuZ2VkLFxuICAgICAqIGlmIHRoZSBldmVudCBjYWxsYmFjayBoYXZlIGhlYXZ5IGxvZ2ljIGl0IG1heSBoYXZlIGdyZWF0IHBlcmZvcm1hbmNlIGltcGFjdCwgdHJ5IHRvIGF2b2lkIHN1Y2ggc2NlbmFyaW8uXG4gICAgICogISN6aCDlvZPoioLngrnplJrngrnmlLnlj5jml7bop6blj5HnmoTkuovku7bjgIJcbiAgICAgKiDmgKfog73orablkYrvvJrov5nkuKrkuovku7bkvJrlnKjmr4/mrKHlr7nlupTnmoTlsZ7mgKfooqvkv67mlLnml7bop6blj5HvvIzlpoLmnpzkuovku7blm57osIPmjZ/ogJfovoPpq5jvvIzmnInlj6/og73lr7nmgKfog73mnInlvojlpKfnmoTotJ/pnaLlvbHlk43vvIzor7flsL3ph4/pgb/lhY3ov5nnp43mg4XlhrXjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gQU5DSE9SX0NIQU5HRURcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgQU5DSE9SX0NIQU5HRUQ6ICdhbmNob3ItY2hhbmdlZCcsXG4gICAgLyoqXG4gICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBjb2xvciBjaGFuZ2UgZXZlbnRzLlxuICAgICogUGVyZm9ybWFuY2Ugbm90ZSwgdGhpcyBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCBldmVyeSB0aW1lIGNvcnJlc3BvbmRpbmcgcHJvcGVydGllcyBiZWluZyBjaGFuZ2VkLFxuICAgICogaWYgdGhlIGV2ZW50IGNhbGxiYWNrIGhhdmUgaGVhdnkgbG9naWMgaXQgbWF5IGhhdmUgZ3JlYXQgcGVyZm9ybWFuY2UgaW1wYWN0LCB0cnkgdG8gYXZvaWQgc3VjaCBzY2VuYXJpby5cbiAgICAqICEjemgg5b2T6IqC54K56aKc6Imy5pS55Y+Y5pe26Kem5Y+R55qE5LqL5Lu244CCXG4gICAgKiDmgKfog73orablkYrvvJrov5nkuKrkuovku7bkvJrlnKjmr4/mrKHlr7nlupTnmoTlsZ7mgKfooqvkv67mlLnml7bop6blj5HvvIzlpoLmnpzkuovku7blm57osIPmjZ/ogJfovoPpq5jvvIzmnInlj6/og73lr7nmgKfog73mnInlvojlpKfnmoTotJ/pnaLlvbHlk43vvIzor7flsL3ph4/pgb/lhY3ov5nnp43mg4XlhrXjgIJcbiAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBDT0xPUl9DSEFOR0VEXG4gICAgKiBAc3RhdGljXG4gICAgKi9cbiAgICBDT0xPUl9DSEFOR0VEOiAnY29sb3ItY2hhbmdlZCcsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgZXZlbnQgdHlwZSBmb3IgbmV3IGNoaWxkIGFkZGVkIGV2ZW50cy5cbiAgICAgKiAhI3poIOW9k+aWsOeahOWtkOiKgueCueiiq+a3u+WKoOaXtuinpuWPkeeahOS6i+S7tuOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBDSElMRF9BRERFRFxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cbiAgICBDSElMRF9BRERFRDogJ2NoaWxkLWFkZGVkJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBjaGlsZCByZW1vdmVkIGV2ZW50cy5cbiAgICAgKiAhI3poIOW9k+WtkOiKgueCueiiq+enu+mZpOaXtuinpuWPkeeahOS6i+S7tuOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBDSElMRF9SRU1PVkVEXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIENISUxEX1JFTU9WRUQ6ICdjaGlsZC1yZW1vdmVkJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBjaGlsZHJlbiByZW9yZGVyIGV2ZW50cy5cbiAgICAgKiAhI3poIOW9k+WtkOiKgueCuemhuuW6j+aUueWPmOaXtuinpuWPkeeahOS6i+S7tuOAglxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBDSElMRF9SRU9SREVSXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIENISUxEX1JFT1JERVI6ICdjaGlsZC1yZW9yZGVyJyxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBldmVudCB0eXBlIGZvciBub2RlIGdyb3VwIGNoYW5nZWQgZXZlbnRzLlxuICAgICAqICEjemgg5b2T6IqC54K55b2S5bGe576k57uE5Y+R55Sf5Y+Y5YyW5pe26Kem5Y+R55qE5LqL5Lu244CCXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IEdST1VQX0NIQU5HRURcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgR1JPVVBfQ0hBTkdFRDogJ2dyb3VwLWNoYW5nZWQnLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIGV2ZW50IHR5cGUgZm9yIG5vZGUncyBzaWJsaW5nIG9yZGVyIGNoYW5nZWQuXG4gICAgICogISN6aCDlvZPoioLngrnlnKjlhYTlvJ/oioLngrnkuK3nmoTpobrluo/lj5HnlJ/lj5jljJbml7bop6blj5HnmoTkuovku7bjgIJcbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gU0lCTElOR19PUkRFUl9DSEFOR0VEXG4gICAgICogQHN0YXRpY1xuICAgICAqL1xuICAgIFNJQkxJTkdfT1JERVJfQ0hBTkdFRDogJ3NpYmxpbmctb3JkZXItY2hhbmdlZCcsXG59KTtcblxudmFyIF90b3VjaEV2ZW50cyA9IFtcbiAgICBFdmVudFR5cGUuVE9VQ0hfU1RBUlQsXG4gICAgRXZlbnRUeXBlLlRPVUNIX01PVkUsXG4gICAgRXZlbnRUeXBlLlRPVUNIX0VORCxcbiAgICBFdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMLFxuXTtcbnZhciBfbW91c2VFdmVudHMgPSBbXG4gICAgRXZlbnRUeXBlLk1PVVNFX0RPV04sXG4gICAgRXZlbnRUeXBlLk1PVVNFX0VOVEVSLFxuICAgIEV2ZW50VHlwZS5NT1VTRV9NT1ZFLFxuICAgIEV2ZW50VHlwZS5NT1VTRV9MRUFWRSxcbiAgICBFdmVudFR5cGUuTU9VU0VfVVAsXG4gICAgRXZlbnRUeXBlLk1PVVNFX1dIRUVMLFxuXTtcblxudmFyIF9za2V3TmVlZFdhcm4gPSB0cnVlO1xudmFyIF9za2V3V2FybiA9IGZ1bmN0aW9uICh2YWx1ZSwgbm9kZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gMCkge1xuICAgICAgICB2YXIgbm9kZVBhdGggPSBcIlwiO1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB2YXIgTm9kZVV0aWxzID0gRWRpdG9yLnJlcXVpcmUoJ3NjZW5lOi8vdXRpbHMvbm9kZScpO1xuICAgICAgICAgICAgbm9kZVBhdGggPSBgTm9kZTogJHtOb2RlVXRpbHMuZ2V0Tm9kZVBhdGgobm9kZSl9LmBcbiAgICAgICAgfVxuICAgICAgICBfc2tld05lZWRXYXJuICYmIGNjLndhcm4oXCJgY2MuTm9kZS5za2V3WC9ZYCBpcyBkZXByZWNhdGVkIHNpbmNlIHYyLjIuMSwgcGxlYXNlIHVzZSAzRCBub2RlIGluc3RlYWQuXCIsIG5vZGVQYXRoKTtcbiAgICAgICAgIUNDX0VESVRPUiAmJiAoX3NrZXdOZWVkV2FybiA9IGZhbHNlKTtcbiAgICB9XG59XG5cbnZhciBfY3VycmVudEhvdmVyZWQgPSBudWxsO1xuXG52YXIgX3RvdWNoU3RhcnRIYW5kbGVyID0gZnVuY3Rpb24gKHRvdWNoLCBldmVudCkge1xuICAgIHZhciBwb3MgPSB0b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcblxuICAgIGlmIChub2RlLl9oaXRUZXN0KHBvcywgdGhpcykpIHtcbiAgICAgICAgZXZlbnQudHlwZSA9IEV2ZW50VHlwZS5UT1VDSF9TVEFSVDtcbiAgICAgICAgZXZlbnQudG91Y2ggPSB0b3VjaDtcbiAgICAgICAgZXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICAgIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xudmFyIF90b3VjaE1vdmVIYW5kbGVyID0gZnVuY3Rpb24gKHRvdWNoLCBldmVudCkge1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcbiAgICBldmVudC50eXBlID0gRXZlbnRUeXBlLlRPVUNIX01PVkU7XG4gICAgZXZlbnQudG91Y2ggPSB0b3VjaDtcbiAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufTtcbnZhciBfdG91Y2hFbmRIYW5kbGVyID0gZnVuY3Rpb24gKHRvdWNoLCBldmVudCkge1xuICAgIHZhciBwb3MgPSB0b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcblxuICAgIGlmIChub2RlLl9oaXRUZXN0KHBvcywgdGhpcykpIHtcbiAgICAgICAgZXZlbnQudHlwZSA9IEV2ZW50VHlwZS5UT1VDSF9FTkQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBldmVudC50eXBlID0gRXZlbnRUeXBlLlRPVUNIX0NBTkNFTDtcbiAgICB9XG4gICAgZXZlbnQudG91Y2ggPSB0b3VjaDtcbiAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufTtcbnZhciBfdG91Y2hDYW5jZWxIYW5kbGVyID0gZnVuY3Rpb24gKHRvdWNoLCBldmVudCkge1xuICAgIHZhciBwb3MgPSB0b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcblxuICAgIGV2ZW50LnR5cGUgPSBFdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMO1xuICAgIGV2ZW50LnRvdWNoID0gdG91Y2g7XG4gICAgZXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbn07XG5cbnZhciBfbW91c2VEb3duSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBwb3MgPSBldmVudC5nZXRMb2NhdGlvbigpO1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcblxuICAgIGlmIChub2RlLl9oaXRUZXN0KHBvcywgdGhpcykpIHtcbiAgICAgICAgZXZlbnQudHlwZSA9IEV2ZW50VHlwZS5NT1VTRV9ET1dOO1xuICAgICAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9XG59O1xudmFyIF9tb3VzZU1vdmVIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHBvcyA9IGV2ZW50LmdldExvY2F0aW9uKCk7XG4gICAgdmFyIG5vZGUgPSB0aGlzLm93bmVyO1xuICAgIHZhciBoaXQgPSBub2RlLl9oaXRUZXN0KHBvcywgdGhpcyk7XG4gICAgaWYgKGhpdCkge1xuICAgICAgICBpZiAoIXRoaXMuX3ByZXZpb3VzSW4pIHtcbiAgICAgICAgICAgIC8vIEZpeCBpc3N1ZSB3aGVuIGhvdmVyIG5vZGUgc3dpdGNoZWQsIHByZXZpb3VzIGhvdmVyZWQgbm9kZSB3b24ndCBnZXQgTU9VU0VfTEVBVkUgbm90aWZpY2F0aW9uXG4gICAgICAgICAgICBpZiAoX2N1cnJlbnRIb3ZlcmVkICYmIF9jdXJyZW50SG92ZXJlZC5fbW91c2VMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBFdmVudFR5cGUuTU9VU0VfTEVBVkU7XG4gICAgICAgICAgICAgICAgX2N1cnJlbnRIb3ZlcmVkLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIF9jdXJyZW50SG92ZXJlZC5fbW91c2VMaXN0ZW5lci5fcHJldmlvdXNJbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2N1cnJlbnRIb3ZlcmVkID0gdGhpcy5vd25lcjtcbiAgICAgICAgICAgIGV2ZW50LnR5cGUgPSBFdmVudFR5cGUuTU9VU0VfRU5URVI7XG4gICAgICAgICAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5fcHJldmlvdXNJbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQudHlwZSA9IEV2ZW50VHlwZS5NT1VTRV9NT1ZFO1xuICAgICAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5fcHJldmlvdXNJbikge1xuICAgICAgICBldmVudC50eXBlID0gRXZlbnRUeXBlLk1PVVNFX0xFQVZFO1xuICAgICAgICBub2RlLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB0aGlzLl9wcmV2aW91c0luID0gZmFsc2U7XG4gICAgICAgIF9jdXJyZW50SG92ZXJlZCA9IG51bGw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBjb250aW51ZSBkaXNwYXRjaGluZ1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRXZlbnQgcHJvY2Vzc2VkLCBjbGVhbnVwXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG59O1xudmFyIF9tb3VzZVVwSGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBwb3MgPSBldmVudC5nZXRMb2NhdGlvbigpO1xuICAgIHZhciBub2RlID0gdGhpcy5vd25lcjtcblxuICAgIGlmIChub2RlLl9oaXRUZXN0KHBvcywgdGhpcykpIHtcbiAgICAgICAgZXZlbnQudHlwZSA9IEV2ZW50VHlwZS5NT1VTRV9VUDtcbiAgICAgICAgZXZlbnQuYnViYmxlcyA9IHRydWU7XG4gICAgICAgIG5vZGUuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbn07XG52YXIgX21vdXNlV2hlZWxIYW5kbGVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIHBvcyA9IGV2ZW50LmdldExvY2F0aW9uKCk7XG4gICAgdmFyIG5vZGUgPSB0aGlzLm93bmVyO1xuXG4gICAgaWYgKG5vZGUuX2hpdFRlc3QocG9zLCB0aGlzKSkge1xuICAgICAgICBldmVudC50eXBlID0gRXZlbnRUeXBlLk1PVVNFX1dIRUVMO1xuICAgICAgICBldmVudC5idWJibGVzID0gdHJ1ZTtcbiAgICAgICAgbm9kZS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gX3NlYXJjaENvbXBvbmVudHNJblBhcmVudCAobm9kZSwgY29tcCkge1xuICAgIGlmIChjb21wKSB7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGxldCBsaXN0ID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgY3VyciA9IG5vZGU7IGN1cnIgJiYgY2MuTm9kZS5pc05vZGUoY3Vycik7IGN1cnIgPSBjdXJyLl9wYXJlbnQsICsraW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChjdXJyLmdldENvbXBvbmVudChjb21wKSkge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0ID0ge1xuICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IGN1cnIsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAobGlzdCkge1xuICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2gobmV4dCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IFtuZXh0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIF9jaGVja0xpc3RlbmVycyAobm9kZSwgZXZlbnRzKSB7XG4gICAgaWYgKCEobm9kZS5fb2JqRmxhZ3MgJiBEZXN0cm95aW5nKSkge1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIGlmIChub2RlLl9idWJibGluZ0xpc3RlbmVycykge1xuICAgICAgICAgICAgZm9yICg7IGkgPCBldmVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5fYnViYmxpbmdMaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcihldmVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5fY2FwdHVyaW5nTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGV2ZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLl9jYXB0dXJpbmdMaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcihldmVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfZG9EaXNwYXRjaEV2ZW50IChvd25lciwgZXZlbnQpIHtcbiAgICB2YXIgdGFyZ2V0LCBpO1xuICAgIGV2ZW50LnRhcmdldCA9IG93bmVyO1xuXG4gICAgLy8gRXZlbnQuQ0FQVFVSSU5HX1BIQVNFXG4gICAgX2NhY2hlZEFycmF5Lmxlbmd0aCA9IDA7XG4gICAgb3duZXIuX2dldENhcHR1cmluZ1RhcmdldHMoZXZlbnQudHlwZSwgX2NhY2hlZEFycmF5KTtcbiAgICAvLyBjYXB0dXJpbmdcbiAgICBldmVudC5ldmVudFBoYXNlID0gMTtcbiAgICBmb3IgKGkgPSBfY2FjaGVkQXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdGFyZ2V0ID0gX2NhY2hlZEFycmF5W2ldO1xuICAgICAgICBpZiAodGFyZ2V0Ll9jYXB0dXJpbmdMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGV2ZW50LmN1cnJlbnRUYXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgICAgICAvLyBmaXJlIGV2ZW50XG4gICAgICAgICAgICB0YXJnZXQuX2NhcHR1cmluZ0xpc3RlbmVycy5lbWl0KGV2ZW50LnR5cGUsIGV2ZW50LCBfY2FjaGVkQXJyYXkpO1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgcHJvcGFnYXRpb24gc3RvcHBlZFxuICAgICAgICAgICAgaWYgKGV2ZW50Ll9wcm9wYWdhdGlvblN0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICBfY2FjaGVkQXJyYXkubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2NhY2hlZEFycmF5Lmxlbmd0aCA9IDA7XG5cbiAgICAvLyBFdmVudC5BVF9UQVJHRVRcbiAgICAvLyBjaGVja3MgaWYgZGVzdHJveWVkIGluIGNhcHR1cmluZyBjYWxsYmFja3NcbiAgICBldmVudC5ldmVudFBoYXNlID0gMjtcbiAgICBldmVudC5jdXJyZW50VGFyZ2V0ID0gb3duZXI7XG4gICAgaWYgKG93bmVyLl9jYXB0dXJpbmdMaXN0ZW5lcnMpIHtcbiAgICAgICAgb3duZXIuX2NhcHR1cmluZ0xpc3RlbmVycy5lbWl0KGV2ZW50LnR5cGUsIGV2ZW50KTtcbiAgICB9XG4gICAgaWYgKCFldmVudC5fcHJvcGFnYXRpb25JbW1lZGlhdGVTdG9wcGVkICYmIG93bmVyLl9idWJibGluZ0xpc3RlbmVycykge1xuICAgICAgICBvd25lci5fYnViYmxpbmdMaXN0ZW5lcnMuZW1pdChldmVudC50eXBlLCBldmVudCk7XG4gICAgfVxuXG4gICAgaWYgKCFldmVudC5fcHJvcGFnYXRpb25TdG9wcGVkICYmIGV2ZW50LmJ1YmJsZXMpIHtcbiAgICAgICAgLy8gRXZlbnQuQlVCQkxJTkdfUEhBU0VcbiAgICAgICAgb3duZXIuX2dldEJ1YmJsaW5nVGFyZ2V0cyhldmVudC50eXBlLCBfY2FjaGVkQXJyYXkpO1xuICAgICAgICAvLyBwcm9wYWdhdGVcbiAgICAgICAgZXZlbnQuZXZlbnRQaGFzZSA9IDM7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBfY2FjaGVkQXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IF9jYWNoZWRBcnJheVtpXTtcbiAgICAgICAgICAgIGlmICh0YXJnZXQuX2J1YmJsaW5nTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQuY3VycmVudFRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgICAgICAgICAvLyBmaXJlIGV2ZW50XG4gICAgICAgICAgICAgICAgdGFyZ2V0Ll9idWJibGluZ0xpc3RlbmVycy5lbWl0KGV2ZW50LnR5cGUsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBwcm9wYWdhdGlvbiBzdG9wcGVkXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50Ll9wcm9wYWdhdGlvblN0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgX2NhY2hlZEFycmF5Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2NhY2hlZEFycmF5Lmxlbmd0aCA9IDA7XG59XG5cbi8vIHRyYXZlcnNhbCB0aGUgbm9kZSB0cmVlLCBjaGlsZCBjdWxsaW5nTWFzayBtdXN0IGtlZXAgdGhlIHNhbWUgd2l0aCB0aGUgcGFyZW50LlxuZnVuY3Rpb24gX2dldEFjdHVhbEdyb3VwSW5kZXggKG5vZGUpIHtcbiAgICBsZXQgZ3JvdXBJbmRleCA9IG5vZGUuZ3JvdXBJbmRleDtcbiAgICBpZiAoZ3JvdXBJbmRleCA9PT0gMCAmJiBub2RlLnBhcmVudCkge1xuICAgICAgICBncm91cEluZGV4ID0gX2dldEFjdHVhbEdyb3VwSW5kZXgobm9kZS5wYXJlbnQpO1xuICAgIH1cbiAgICByZXR1cm4gZ3JvdXBJbmRleDtcbn1cblxuZnVuY3Rpb24gX3VwZGF0ZUN1bGxpbmdNYXNrIChub2RlKSB7XG4gICAgbGV0IGluZGV4ID0gX2dldEFjdHVhbEdyb3VwSW5kZXgobm9kZSk7XG4gICAgbm9kZS5fY3VsbGluZ01hc2sgPSAxIDw8IGluZGV4O1xuICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgbm9kZS5fcHJveHkgJiYgbm9kZS5fcHJveHkudXBkYXRlQ3VsbGluZ01hc2soKTtcbiAgICB9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5fY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgX3VwZGF0ZUN1bGxpbmdNYXNrKG5vZGUuX2NoaWxkcmVuW2ldKTtcbiAgICB9XG59XG5cbi8vIDJELzNEIG1hdHJpeCBmdW5jdGlvbnNcbmZ1bmN0aW9uIHVwZGF0ZUxvY2FsTWF0cml4M0QgKCkge1xuICAgIGlmICh0aGlzLl9sb2NhbE1hdERpcnR5ICYgTG9jYWxEaXJ0eUZsYWcuVFJTUykge1xuICAgICAgICAvLyBVcGRhdGUgdHJhbnNmb3JtXG4gICAgICAgIGxldCB0ID0gdGhpcy5fbWF0cml4O1xuICAgICAgICBsZXQgdG0gPSB0Lm07XG4gICAgICAgIFRycy50b01hdDQodCwgdGhpcy5fdHJzKTtcblxuICAgICAgICAvLyBza2V3XG4gICAgICAgIGlmICh0aGlzLl9za2V3WCB8fCB0aGlzLl9za2V3WSkge1xuICAgICAgICAgICAgbGV0IGEgPSB0bVswXSwgYiA9IHRtWzFdLCBjID0gdG1bNF0sIGQgPSB0bVs1XTtcbiAgICAgICAgICAgIGxldCBza3ggPSBNYXRoLnRhbih0aGlzLl9za2V3WCAqIE9ORV9ERUdSRUUpO1xuICAgICAgICAgICAgbGV0IHNreSA9IE1hdGgudGFuKHRoaXMuX3NrZXdZICogT05FX0RFR1JFRSk7XG4gICAgICAgICAgICBpZiAoc2t4ID09PSBJbmZpbml0eSlcbiAgICAgICAgICAgICAgICBza3ggPSA5OTk5OTk5OTtcbiAgICAgICAgICAgIGlmIChza3kgPT09IEluZmluaXR5KVxuICAgICAgICAgICAgICAgIHNreSA9IDk5OTk5OTk5O1xuICAgICAgICAgICAgdG1bMF0gPSBhICsgYyAqIHNreTtcbiAgICAgICAgICAgIHRtWzFdID0gYiArIGQgKiBza3k7XG4gICAgICAgICAgICB0bVs0XSA9IGMgKyBhICogc2t4O1xuICAgICAgICAgICAgdG1bNV0gPSBkICsgYiAqIHNreDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9sb2NhbE1hdERpcnR5ICY9IH5Mb2NhbERpcnR5RmxhZy5UUlNTO1xuICAgICAgICAvLyBSZWdpc3RlciBkaXJ0eSBzdGF0dXMgb2Ygd29ybGQgbWF0cml4IHNvIHRoYXQgaXQgY2FuIGJlIHJlY2FsY3VsYXRlZFxuICAgICAgICB0aGlzLl93b3JsZE1hdERpcnR5ID0gdHJ1ZTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxvY2FsTWF0cml4MkQgKCkge1xuICAgIGxldCBkaXJ0eUZsYWcgPSB0aGlzLl9sb2NhbE1hdERpcnR5O1xuICAgIGlmICghKGRpcnR5RmxhZyAmIExvY2FsRGlydHlGbGFnLlRSU1MpKSByZXR1cm47XG5cbiAgICAvLyBVcGRhdGUgdHJhbnNmb3JtXG4gICAgbGV0IHQgPSB0aGlzLl9tYXRyaXg7XG4gICAgbGV0IHRtID0gdC5tO1xuICAgIGxldCB0cnMgPSB0aGlzLl90cnM7XG5cbiAgICBpZiAoZGlydHlGbGFnICYgKExvY2FsRGlydHlGbGFnLlJTIHwgTG9jYWxEaXJ0eUZsYWcuU0tFVykpIHtcbiAgICAgICAgbGV0IHJvdGF0aW9uID0gLXRoaXMuX2V1bGVyQW5nbGVzLno7XG4gICAgICAgIGxldCBoYXNTa2V3ID0gdGhpcy5fc2tld1ggfHwgdGhpcy5fc2tld1k7XG4gICAgICAgIGxldCBzeCA9IHRyc1s3XSwgc3kgPSB0cnNbOF07XG5cbiAgICAgICAgaWYgKHJvdGF0aW9uIHx8IGhhc1NrZXcpIHtcbiAgICAgICAgICAgIGxldCBhID0gMSwgYiA9IDAsIGMgPSAwLCBkID0gMTtcbiAgICAgICAgICAgIC8vIHJvdGF0aW9uXG4gICAgICAgICAgICBpZiAocm90YXRpb24pIHtcbiAgICAgICAgICAgICAgICBsZXQgcm90YXRpb25SYWRpYW5zID0gcm90YXRpb24gKiBPTkVfREVHUkVFO1xuICAgICAgICAgICAgICAgIGMgPSBNYXRoLnNpbihyb3RhdGlvblJhZGlhbnMpO1xuICAgICAgICAgICAgICAgIGQgPSBNYXRoLmNvcyhyb3RhdGlvblJhZGlhbnMpO1xuICAgICAgICAgICAgICAgIGEgPSBkO1xuICAgICAgICAgICAgICAgIGIgPSAtYztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNjYWxlXG4gICAgICAgICAgICB0bVswXSA9IGEgKj0gc3g7XG4gICAgICAgICAgICB0bVsxXSA9IGIgKj0gc3g7XG4gICAgICAgICAgICB0bVs0XSA9IGMgKj0gc3k7XG4gICAgICAgICAgICB0bVs1XSA9IGQgKj0gc3k7XG4gICAgICAgICAgICAvLyBza2V3XG4gICAgICAgICAgICBpZiAoaGFzU2tldykge1xuICAgICAgICAgICAgICAgIGxldCBhID0gdG1bMF0sIGIgPSB0bVsxXSwgYyA9IHRtWzRdLCBkID0gdG1bNV07XG4gICAgICAgICAgICAgICAgbGV0IHNreCA9IE1hdGgudGFuKHRoaXMuX3NrZXdYICogT05FX0RFR1JFRSk7XG4gICAgICAgICAgICAgICAgbGV0IHNreSA9IE1hdGgudGFuKHRoaXMuX3NrZXdZICogT05FX0RFR1JFRSk7XG4gICAgICAgICAgICAgICAgaWYgKHNreCA9PT0gSW5maW5pdHkpXG4gICAgICAgICAgICAgICAgICAgIHNreCA9IDk5OTk5OTk5O1xuICAgICAgICAgICAgICAgIGlmIChza3kgPT09IEluZmluaXR5KVxuICAgICAgICAgICAgICAgICAgICBza3kgPSA5OTk5OTk5OTtcbiAgICAgICAgICAgICAgICB0bVswXSA9IGEgKyBjICogc2t5O1xuICAgICAgICAgICAgICAgIHRtWzFdID0gYiArIGQgKiBza3k7XG4gICAgICAgICAgICAgICAgdG1bNF0gPSBjICsgYSAqIHNreDtcbiAgICAgICAgICAgICAgICB0bVs1XSA9IGQgKyBiICogc2t4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdG1bMF0gPSBzeDtcbiAgICAgICAgICAgIHRtWzFdID0gMDtcbiAgICAgICAgICAgIHRtWzRdID0gMDtcbiAgICAgICAgICAgIHRtWzVdID0gc3k7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBwb3NpdGlvblxuICAgIHRtWzEyXSA9IHRyc1swXTtcbiAgICB0bVsxM10gPSB0cnNbMV07XG4gICAgXG4gICAgdGhpcy5fbG9jYWxNYXREaXJ0eSAmPSB+TG9jYWxEaXJ0eUZsYWcuVFJTUztcbiAgICAvLyBSZWdpc3RlciBkaXJ0eSBzdGF0dXMgb2Ygd29ybGQgbWF0cml4IHNvIHRoYXQgaXQgY2FuIGJlIHJlY2FsY3VsYXRlZFxuICAgIHRoaXMuX3dvcmxkTWF0RGlydHkgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxXb3JsZE1hdHJpeDNEICgpIHtcbiAgICAvLyBBdm9pZCBhcyBtdWNoIGZ1bmN0aW9uIGNhbGwgYXMgcG9zc2libGVcbiAgICBpZiAodGhpcy5fbG9jYWxNYXREaXJ0eSAmIExvY2FsRGlydHlGbGFnLlRSU1MpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlTG9jYWxNYXRyaXgoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgIGxldCBwYXJlbnRNYXQgPSB0aGlzLl9wYXJlbnQuX3dvcmxkTWF0cml4O1xuICAgICAgICBNYXQ0Lm11bCh0aGlzLl93b3JsZE1hdHJpeCwgcGFyZW50TWF0LCB0aGlzLl9tYXRyaXgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgTWF0NC5jb3B5KHRoaXMuX3dvcmxkTWF0cml4LCB0aGlzLl9tYXRyaXgpO1xuICAgIH1cbiAgICB0aGlzLl93b3JsZE1hdERpcnR5ID0gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGNhbGN1bFdvcmxkTWF0cml4MkQgKCkge1xuICAgIC8vIEF2b2lkIGFzIG11Y2ggZnVuY3Rpb24gY2FsbCBhcyBwb3NzaWJsZVxuICAgIGlmICh0aGlzLl9sb2NhbE1hdERpcnR5ICYgTG9jYWxEaXJ0eUZsYWcuVFJTUykge1xuICAgICAgICB0aGlzLl91cGRhdGVMb2NhbE1hdHJpeCgpO1xuICAgIH1cbiAgICBcbiAgICAvLyBBc3N1bWUgcGFyZW50IHdvcmxkIG1hdHJpeCBpcyBjb3JyZWN0XG4gICAgbGV0IHBhcmVudCA9IHRoaXMuX3BhcmVudDtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIHRoaXMuX211bE1hdCh0aGlzLl93b3JsZE1hdHJpeCwgcGFyZW50Ll93b3JsZE1hdHJpeCwgdGhpcy5fbWF0cml4KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIE1hdDQuY29weSh0aGlzLl93b3JsZE1hdHJpeCwgdGhpcy5fbWF0cml4KTtcbiAgICB9XG4gICAgdGhpcy5fd29ybGRNYXREaXJ0eSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBtdWxNYXQyRCAob3V0LCBhLCBiKSB7XG4gICAgbGV0IGFtID0gYS5tLCBibSA9IGIubSwgb3V0bSA9IG91dC5tO1xuICAgIGxldCBhYT1hbVswXSwgYWI9YW1bMV0sIGFjPWFtWzRdLCBhZD1hbVs1XSwgYXR4PWFtWzEyXSwgYXR5PWFtWzEzXTtcbiAgICBsZXQgYmE9Ym1bMF0sIGJiPWJtWzFdLCBiYz1ibVs0XSwgYmQ9Ym1bNV0sIGJ0eD1ibVsxMl0sIGJ0eT1ibVsxM107XG4gICAgaWYgKGFiICE9PSAwIHx8IGFjICE9PSAwKSB7XG4gICAgICAgIG91dG1bMF0gPSBiYSAqIGFhICsgYmIgKiBhYztcbiAgICAgICAgb3V0bVsxXSA9IGJhICogYWIgKyBiYiAqIGFkO1xuICAgICAgICBvdXRtWzRdID0gYmMgKiBhYSArIGJkICogYWM7XG4gICAgICAgIG91dG1bNV0gPSBiYyAqIGFiICsgYmQgKiBhZDtcbiAgICAgICAgb3V0bVsxMl0gPSBhYSAqIGJ0eCArIGFjICogYnR5ICsgYXR4O1xuICAgICAgICBvdXRtWzEzXSA9IGFiICogYnR4ICsgYWQgKiBidHkgKyBhdHk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvdXRtWzBdID0gYmEgKiBhYTtcbiAgICAgICAgb3V0bVsxXSA9IGJiICogYWQ7XG4gICAgICAgIG91dG1bNF0gPSBiYyAqIGFhO1xuICAgICAgICBvdXRtWzVdID0gYmQgKiBhZDtcbiAgICAgICAgb3V0bVsxMl0gPSBhYSAqIGJ0eCArIGF0eDtcbiAgICAgICAgb3V0bVsxM10gPSBhZCAqIGJ0eSArIGF0eTtcbiAgICB9XG59XG5cbmNvbnN0IG11bE1hdDNEID0gTWF0NC5tdWw7XG5cbi8qKlxuICogISNlblxuICogQ2xhc3Mgb2YgYWxsIGVudGl0aWVzIGluIENvY29zIENyZWF0b3Igc2NlbmVzLjxici8+XG4gKiBGb3IgZXZlbnRzIHN1cHBvcnRlZCBieSBOb2RlLCBwbGVhc2UgcmVmZXIgdG8ge3sjY3Jvc3NMaW5rIFwiTm9kZS5FdmVudFR5cGVcIn19e3svY3Jvc3NMaW5rfX1cbiAqICEjemhcbiAqIENvY29zIENyZWF0b3Ig5Zy65pmv5Lit55qE5omA5pyJ6IqC54K557G744CCPGJyLz5cbiAqIOaUr+aMgeeahOiKgueCueS6i+S7tu+8jOivt+WPgumYhSB7eyNjcm9zc0xpbmsgXCJOb2RlLkV2ZW50VHlwZVwifX17ey9jcm9zc0xpbmt9feOAglxuICogQGNsYXNzIE5vZGVcbiAqIEBleHRlbmRzIF9CYXNlTm9kZVxuICovXG5sZXQgTm9kZURlZmluZXMgPSB7XG4gICAgbmFtZTogJ2NjLk5vZGUnLFxuICAgIGV4dGVuZHM6IEJhc2VOb2RlLFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBTRVJJQUxJWkFCTEVcbiAgICAgICAgX29wYWNpdHk6IDI1NSxcbiAgICAgICAgX2NvbG9yOiBjYy5Db2xvci5XSElURSxcbiAgICAgICAgX2NvbnRlbnRTaXplOiBjYy5TaXplLFxuICAgICAgICBfYW5jaG9yUG9pbnQ6IGNjLnYyKDAuNSwgMC41KSxcbiAgICAgICAgX3Bvc2l0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgIF9zY2FsZTogdW5kZWZpbmVkLFxuICAgICAgICBfdHJzOiBudWxsLFxuICAgICAgICBfZXVsZXJBbmdsZXM6IGNjLlZlYzMsXG4gICAgICAgIF9za2V3WDogMC4wLFxuICAgICAgICBfc2tld1k6IDAuMCxcbiAgICAgICAgX3pJbmRleDoge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlclxuICAgICAgICB9LFxuICAgICAgICBfbG9jYWxaT3JkZXI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICBzZXJpYWxpemFibGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgXG4gICAgICAgIF9pczNETm9kZTogZmFsc2UsXG5cbiAgICAgICAgLy8gaW50ZXJuYWwgcHJvcGVydGllc1xuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBHcm91cCBpbmRleCBvZiBub2RlLjxici8+XG4gICAgICAgICAqIFdoaWNoIEdyb3VwIHRoaXMgbm9kZSBiZWxvbmdzIHRvIHdpbGwgcmVzb2x2ZSB0aGF0IHRoaXMgbm9kZSdzIGNvbGxpc2lvbiBjb21wb25lbnRzIGNhbiBjb2xsaWRlIHdpdGggd2hpY2ggb3RoZXIgY29sbGlzaW9uIGNvbXBvbmVudG5zLjxici8+XG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6IqC54K555qE5YiG57uE57Si5byV44CCPGJyLz5cbiAgICAgICAgICog6IqC54K555qE5YiG57uE5bCG5YWz57O75Yiw6IqC54K555qE56Kw5pKe57uE5Lu25Y+v5Lul5LiO5ZOq5Lqb56Kw5pKe57uE5Lu255u456Kw5pKe44CCPGJyLz5cbiAgICAgICAgICogQHByb3BlcnR5IGdyb3VwSW5kZXhcbiAgICAgICAgICogQHR5cGUge0ludGVnZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIF9ncm91cEluZGV4OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgZm9ybWVybHlTZXJpYWxpemVkQXM6ICdncm91cEluZGV4J1xuICAgICAgICB9LFxuICAgICAgICBncm91cEluZGV4OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncm91cEluZGV4O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ncm91cEluZGV4ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgX3VwZGF0ZUN1bGxpbmdNYXNrKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuR1JPVVBfQ0hBTkdFRCwgdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogR3JvdXAgb2Ygbm9kZS48YnIvPlxuICAgICAgICAgKiBXaGljaCBHcm91cCB0aGlzIG5vZGUgYmVsb25ncyB0byB3aWxsIHJlc29sdmUgdGhhdCB0aGlzIG5vZGUncyBjb2xsaXNpb24gY29tcG9uZW50cyBjYW4gY29sbGlkZSB3aXRoIHdoaWNoIG90aGVyIGNvbGxpc2lvbiBjb21wb25lbnRucy48YnIvPlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOiKgueCueeahOWIhue7hOOAgjxici8+XG4gICAgICAgICAqIOiKgueCueeahOWIhue7hOWwhuWFs+ezu+WIsOiKgueCueeahOeisOaSnue7hOS7tuWPr+S7peS4juWTquS6m+eisOaSnue7hOS7tuebuOeisOaSnuOAgjxici8+XG4gICAgICAgICAqIEBwcm9wZXJ0eSBncm91cFxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ3JvdXA6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLmdhbWUuZ3JvdXBMaXN0W3RoaXMuZ3JvdXBJbmRleF0gfHwgJyc7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBncm91cEluZGV4XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cEluZGV4ID0gY2MuZ2FtZS5ncm91cExpc3QuaW5kZXhPZih2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy9wcm9wZXJ0aWVzIG1vdmVkIGZyb20gYmFzZSBub2RlIGJlZ2luXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHBvc2l0aW9uICh4LCB5KSBvZiB0aGUgbm9kZSBpbiBpdHMgcGFyZW50J3MgY29vcmRpbmF0ZXMuXG4gICAgICAgICAqICEjemgg6IqC54K55Zyo54i26IqC54K55Z2Q5qCH57O75Lit55qE5L2N572u77yIeCwgee+8ieOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1ZlYzN9IHBvc2l0aW9uXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGNjLmxvZyhcIk5vZGUgUG9zaXRpb246IFwiICsgbm9kZS5wb3NpdGlvbik7XG4gICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIHggYXhpcyBwb3NpdGlvbiBvZiBub2RlLlxuICAgICAgICAgKiAhI3poIOiKgueCuSBYIOi9tOWdkOagh+OAglxuICAgICAgICAgKiBAcHJvcGVydHkgeFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBub2RlLnggPSAxMDA7XG4gICAgICAgICAqIGNjLmxvZyhcIk5vZGUgUG9zaXRpb24gWDogXCIgKyBub2RlLngpO1xuICAgICAgICAgKi9cbiAgICAgICAgeDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJzWzBdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgdHJzID0gdGhpcy5fdHJzO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdHJzWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghQ0NfRURJVE9SIHx8IGlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZFZhbHVlID0gdHJzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnNbMF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxEaXJ0eShMb2NhbERpcnR5RmxhZy5BTExfUE9TSVRJT04pO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmYXN0IGNoZWNrIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZXZlbnRNYXNrICYgUE9TSVRJT05fT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZW5kIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlBPU0lUSU9OX0NIQU5HRUQsIG5ldyBjYy5WZWMzKG9sZFZhbHVlLCB0cnNbMV0sIHRyc1syXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VEKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcihFUlJfSU5WQUxJRF9OVU1CRVIsICduZXcgeCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiB5IGF4aXMgcG9zaXRpb24gb2Ygbm9kZS5cbiAgICAgICAgICogISN6aCDoioLngrkgWSDovbTlnZDmoIfjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHlcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS55ID0gMTAwO1xuICAgICAgICAgKiBjYy5sb2coXCJOb2RlIFBvc2l0aW9uIFk6IFwiICsgbm9kZS55KTtcbiAgICAgICAgICovXG4gICAgICAgIHk6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ryc1sxXTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRycyA9IHRoaXMuX3RycztcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgIT09IHRyc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIUNDX0VESVRPUiB8fCBpc0Zpbml0ZSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvbGRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRWYWx1ZSA9IHRyc1sxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgdHJzWzFdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1BPU0lUSU9OKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZmFzdCBjaGVjayBldmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFBPU0lUSU9OX09OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VuZCBldmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VELCBuZXcgY2MuVmVjMyh0cnNbMF0sIG9sZFZhbHVlLCB0cnNbMl0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3IoRVJSX0lOVkFMSURfTlVNQkVSLCAnbmV3IHknKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4geiBheGlzIHBvc2l0aW9uIG9mIG5vZGUuXG4gICAgICAgICAqICEjemgg6IqC54K5IFog6L205Z2Q5qCH44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB6XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB6OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90cnNbMl07XG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgdHJzID0gdGhpcy5fdHJzO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdHJzWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghQ0NfRURJVE9SIHx8IGlzRmluaXRlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJzWzJdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1BPU0lUSU9OKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICFDQ19OQVRJVkVSRU5ERVJFUiAmJiAodGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfV09STERfVFJBTlNGT1JNKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZhc3QgY2hlY2sgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBQT1NJVElPTl9PTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcihFUlJfSU5WQUxJRF9OVU1CRVIsICduZXcgeicpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFJvdGF0aW9uIG9mIG5vZGUuXG4gICAgICAgICAqICEjemgg6K+l6IqC54K55peL6L2s6KeS5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSByb3RhdGlvblxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5vZGUucm90YXRpb24gPSA5MDtcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSBSb3RhdGlvbjogXCIgKyBub2RlLnJvdGF0aW9uKTtcbiAgICAgICAgICovXG4gICAgICAgIHJvdGF0aW9uOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKFwiYGNjLk5vZGUucm90YXRpb25gIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4wLCBwbGVhc2UgdXNlIGAtYW5nbGVgIGluc3RlYWQuIChgdGhpcy5ub2RlLnJvdGF0aW9uYCAtPiBgLXRoaXMubm9kZS5hbmdsZWApXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gLXRoaXMuYW5nbGU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKFwiYGNjLk5vZGUucm90YXRpb25gIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4wLCBwbGVhc2Ugc2V0IGAtYW5nbGVgIGluc3RlYWQuIChgdGhpcy5ub2RlLnJvdGF0aW9uID0geGAgLT4gYHRoaXMubm9kZS5hbmdsZSA9IC14YClcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYW5nbGUgPSAtdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogQW5nbGUgb2Ygbm9kZSwgdGhlIHBvc2l0aXZlIHZhbHVlIGlzIGFudGktY2xvY2t3aXNlIGRpcmVjdGlvbi5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDor6XoioLngrnnmoTml4vovazop5LluqbvvIzmraPlgLzkuLrpgIbml7bpkojmlrnlkJHjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGFuZ2xlXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBhbmdsZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXVsZXJBbmdsZXMuejtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgVmVjMy5zZXQodGhpcy5fZXVsZXJBbmdsZXMsIDAsIDAsIHZhbHVlKTsgICBcbiAgICAgICAgICAgICAgICBUcnMuZnJvbUFuZ2xlWih0aGlzLl90cnMsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1JPVEFUSU9OKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBST1RBVElPTl9PTikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlJPVEFUSU9OX0NIQU5HRUQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgcm90YXRpb24gYXMgRXVsZXIgYW5nbGVzIGluIGRlZ3JlZXMsIHVzZWQgaW4gM0Qgbm9kZS5cbiAgICAgICAgICogISN6aCDor6XoioLngrnnmoTmrKfmi4nop5LluqbvvIznlKjkuo4gM0Qg6IqC54K544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBldWxlckFuZ2xlc1xuICAgICAgICAgKiBAdHlwZSB7VmVjM31cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5pczNETm9kZSA9IHRydWU7XG4gICAgICAgICAqIG5vZGUuZXVsZXJBbmdsZXMgPSBjYy52Myg0NSwgNDUsIDQ1KTtcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSBldWxlckFuZ2xlcyAoWCwgWSwgWik6IFwiICsgbm9kZS5ldWxlckFuZ2xlcy50b1N0cmluZygpKTtcbiAgICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gUm90YXRpb24gb24geCBheGlzLlxuICAgICAgICAgKiAhI3poIOivpeiKgueCuSBYIOi9tOaXi+i9rOinkuW6puOAglxuICAgICAgICAgKiBAcHJvcGVydHkgcm90YXRpb25YXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjFcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5pczNETm9kZSA9IHRydWU7XG4gICAgICAgICAqIG5vZGUuZXVsZXJBbmdsZXMgPSBjYy52Myg0NSwgMCwgMCk7XG4gICAgICAgICAqIGNjLmxvZyhcIk5vZGUgZXVsZXJBbmdsZXMgWDogXCIgKyBub2RlLmV1bGVyQW5nbGVzLngpO1xuICAgICAgICAgKi9cbiAgICAgICAgcm90YXRpb25YOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKFwiYGNjLk5vZGUucm90YXRpb25YYCBpcyBkZXByZWNhdGVkIHNpbmNlIHYyLjEuMCwgcGxlYXNlIHVzZSBgZXVsZXJBbmdsZXMueGAgaW5zdGVhZC4gKGB0aGlzLm5vZGUucm90YXRpb25YYCAtPiBgdGhpcy5ub2RlLmV1bGVyQW5nbGVzLnhgKVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V1bGVyQW5nbGVzLng7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChDQ19ERUJVRykge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuKFwiYGNjLk5vZGUucm90YXRpb25YYCBpcyBkZXByZWNhdGVkIHNpbmNlIHYyLjEuMCwgcGxlYXNlIHNldCBgZXVsZXJBbmdsZXNgIGluc3RlYWQuIChgdGhpcy5ub2RlLnJvdGF0aW9uWCA9IHhgIC0+IGB0aGlzLm5vZGUuaXMzRE5vZGUgPSB0cnVlOyB0aGlzLm5vZGUuZXVsZXJBbmdsZXMgPSBjYy52Myh4LCAwLCAwKWBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldWxlckFuZ2xlcy54ICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldWxlckFuZ2xlcy54ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBxdWF0ZXJuaW9uIGZyb20gcm90YXRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V1bGVyQW5nbGVzLnggPT09IHRoaXMuX2V1bGVyQW5nbGVzLnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRycy5mcm9tQW5nbGVaKHRoaXMuX3RycywgLXZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFRycy5mcm9tRXVsZXJOdW1iZXIodGhpcy5fdHJzLCB2YWx1ZSwgdGhpcy5fZXVsZXJBbmdsZXMueSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRMb2NhbERpcnR5KExvY2FsRGlydHlGbGFnLkFMTF9ST1RBVElPTik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFJPVEFUSU9OX09OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlJPVEFUSU9OX0NIQU5HRUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBSb3RhdGlvbiBvbiB5IGF4aXMuXG4gICAgICAgICAqICEjemgg6K+l6IqC54K5IFkg6L205peL6L2s6KeS5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSByb3RhdGlvbllcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBub2RlLmlzM0ROb2RlID0gdHJ1ZTtcbiAgICAgICAgICogbm9kZS5ldWxlckFuZ2xlcyA9IGNjLnYzKDAsIDQ1LCAwKTtcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSBldWxlckFuZ2xlcyBZOiBcIiArIG5vZGUuZXVsZXJBbmdsZXMueSk7XG4gICAgICAgICAqL1xuICAgICAgICByb3RhdGlvblk6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm4oXCJgY2MuTm9kZS5yb3RhdGlvbllgIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4wLCBwbGVhc2UgdXNlIGBldWxlckFuZ2xlcy55YCBpbnN0ZWFkLiAoYHRoaXMubm9kZS5yb3RhdGlvbllgIC0+IGB0aGlzLm5vZGUuZXVsZXJBbmdsZXMueWApXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZXVsZXJBbmdsZXMueTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm4oXCJgY2MuTm9kZS5yb3RhdGlvbllgIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4wLCBwbGVhc2Ugc2V0IGBldWxlckFuZ2xlc2AgaW5zdGVhZC4gKGB0aGlzLm5vZGUucm90YXRpb25ZID0geWAgLT4gYHRoaXMubm9kZS5pczNETm9kZSA9IHRydWU7IHRoaXMubm9kZS5ldWxlckFuZ2xlcyA9IGNjLnYzKDAsIHksIDApYFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V1bGVyQW5nbGVzLnkgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V1bGVyQW5nbGVzLnkgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXBkYXRlIHF1YXRlcm5pb24gZnJvbSByb3RhdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZXVsZXJBbmdsZXMueCA9PT0gdGhpcy5fZXVsZXJBbmdsZXMueSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgVHJzLmZyb21BbmdsZVoodGhpcy5fdHJzLCAtdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgVHJzLmZyb21FdWxlck51bWJlcih0aGlzLl90cnMsIHRoaXMuX2V1bGVyQW5nbGVzLngsIHZhbHVlLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1JPVEFUSU9OKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZXZlbnRNYXNrICYgUk9UQVRJT05fT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUk9UQVRJT05fQ0hBTkdFRCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIGV1bGVyQW5nbGVzOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V1bGVyQW5nbGVzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRycy50b0V1bGVyKHRoaXMuX2V1bGVyQW5nbGVzLCB0aGlzLl90cnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHNldCAodikge1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXVsZXJBbmdsZXMuc2V0KHYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFRycy5mcm9tRXVsZXIodGhpcy5fdHJzLCB2KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1JPVEFUSU9OKTtcbiAgICAgICAgICAgICAgICAhQ0NfTkFUSVZFUkVOREVSRVIgJiYgKHRoaXMuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1RSQU5TRk9STSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICAvLyBUaGlzIHByb3BlcnR5IGlzIHVzZWQgZm9yIE1lc2ggU2tlbGV0b24gQW5pbWF0aW9uXG4gICAgICAgIC8vIFNob3VsZCBiZSByZW1vdmVkIHdoZW4gbm9kZS5yb3RhdGlvbiB1cGdyYWRlIHRvIHF1YXRlcm5pb24gdmFsdWVcbiAgICAgICAgcXVhdDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICBsZXQgdHJzID0gdGhpcy5fdHJzO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUXVhdCh0cnNbM10sIHRyc1s0XSwgdHJzWzVdLCB0cnNbNl0pO1xuICAgICAgICAgICAgfSwgc2V0ICh2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRSb3RhdGlvbih2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUaGUgbG9jYWwgc2NhbGUgcmVsYXRpdmUgdG8gdGhlIHBhcmVudC5cbiAgICAgICAgICogISN6aCDoioLngrnnm7jlr7nniLboioLngrnnmoTnvKnmlL7jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHNjYWxlXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5vZGUuc2NhbGUgPSAxO1xuICAgICAgICAgKi9cbiAgICAgICAgc2NhbGU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ryc1s3XTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNjYWxlKHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFNjYWxlIG9uIHggYXhpcy5cbiAgICAgICAgICogISN6aCDoioLngrkgWCDovbTnvKnmlL7jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHNjYWxlWFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBub2RlLnNjYWxlWCA9IDAuNTtcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSBTY2FsZSBYOiBcIiArIG5vZGUuc2NhbGVYKTtcbiAgICAgICAgICovXG4gICAgICAgIHNjYWxlWDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJzWzddO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHJzWzddICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90cnNbN10gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRMb2NhbERpcnR5KExvY2FsRGlydHlGbGFnLkFMTF9TQ0FMRSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFNDQUxFX09OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlNDQUxFX0NIQU5HRUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTY2FsZSBvbiB5IGF4aXMuXG4gICAgICAgICAqICEjemgg6IqC54K5IFkg6L2057yp5pS+44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBzY2FsZVlcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5zY2FsZVkgPSAwLjU7XG4gICAgICAgICAqIGNjLmxvZyhcIk5vZGUgU2NhbGUgWTogXCIgKyBub2RlLnNjYWxlWSk7XG4gICAgICAgICAqL1xuICAgICAgICBzY2FsZVk6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ryc1s4XTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3Ryc1s4XSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdHJzWzhdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxEaXJ0eShMb2NhbERpcnR5RmxhZy5BTExfU0NBTEUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBTQ0FMRV9PTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5TQ0FMRV9DSEFOR0VEKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gU2NhbGUgb24geiBheGlzLlxuICAgICAgICAgKiAhI3poIOiKgueCuSBaIOi9tOe8qeaUvuOAglxuICAgICAgICAgKiBAcHJvcGVydHkgc2NhbGVaXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBzY2FsZVo6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ryc1s5XTtcbiAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90cnNbOV0gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Ryc1s5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1NDQUxFKTtcbiAgICAgICAgICAgICAgICAgICAgIUNDX05BVElWRVJFTkRFUkVSICYmICh0aGlzLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19UUkFOU0ZPUk0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBTQ0FMRV9PTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5TQ0FMRV9DSEFOR0VEKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTa2V3IHhcbiAgICAgICAgICogISN6aCDor6XoioLngrkgWCDovbTlgL7mlpzop5LluqbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHNrZXdYXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5vZGUuc2tld1ggPSAwO1xuICAgICAgICAgKiBjYy5sb2coXCJOb2RlIFNrZXdYOiBcIiArIG5vZGUuc2tld1gpO1xuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4yLjFcbiAgICAgICAgICovXG4gICAgICAgIHNrZXdYOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9za2V3WDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgX3NrZXdXYXJuKHZhbHVlLCB0aGlzKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3NrZXdYID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMb2NhbERpcnR5KExvY2FsRGlydHlGbGFnLlNLRVcpO1xuICAgICAgICAgICAgICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJveHkudXBkYXRlU2tldygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBTa2V3IHlcbiAgICAgICAgICogISN6aCDor6XoioLngrkgWSDovbTlgL7mlpzop5LluqbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHNrZXdZXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5vZGUuc2tld1kgPSAwO1xuICAgICAgICAgKiBjYy5sb2coXCJOb2RlIFNrZXdZOiBcIiArIG5vZGUuc2tld1kpO1xuICAgICAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4yLjFcbiAgICAgICAgICovXG4gICAgICAgIHNrZXdZOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9za2V3WTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgX3NrZXdXYXJuKHZhbHVlLCB0aGlzKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX3NrZXdZID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRMb2NhbERpcnR5KExvY2FsRGlydHlGbGFnLlNLRVcpO1xuICAgICAgICAgICAgICAgIGlmIChDQ19KU0IgJiYgQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcHJveHkudXBkYXRlU2tldygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBPcGFjaXR5IG9mIG5vZGUsIGRlZmF1bHQgdmFsdWUgaXMgMjU1LlxuICAgICAgICAgKiAhI3poIOiKgueCuemAj+aYjuW6pu+8jOm7mOiupOWAvOS4uiAyNTXjgIJcbiAgICAgICAgICogQHByb3BlcnR5IG9wYWNpdHlcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5vcGFjaXR5ID0gMjU1O1xuICAgICAgICAgKi9cbiAgICAgICAgb3BhY2l0eToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb3BhY2l0eTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjYy5taXNjLmNsYW1wZih2YWx1ZSwgMCwgMjU1KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fb3BhY2l0eSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3BhY2l0eSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcm94eS51cGRhdGVPcGFjaXR5KCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX09QQUNJVFlfQ09MT1I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhbmdlOiBbMCwgMjU1XVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIENvbG9yIG9mIG5vZGUsIGRlZmF1bHQgdmFsdWUgaXMgd2hpdGU6ICgyNTUsIDI1NSwgMjU1KS5cbiAgICAgICAgICogISN6aCDoioLngrnpopzoibLjgILpu5jorqTkuLrnmb3oibLvvIzmlbDlgLzkuLrvvJrvvIgyNTXvvIwyNTXvvIwyNTXvvInjgIJcbiAgICAgICAgICogQHByb3BlcnR5IGNvbG9yXG4gICAgICAgICAqIEB0eXBlIHtDb2xvcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5jb2xvciA9IG5ldyBjYy5Db2xvcigyNTUsIDI1NSwgMjU1KTtcbiAgICAgICAgICovXG4gICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvci5jbG9uZSgpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fY29sb3IuZXF1YWxzKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb2xvci5zZXQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfREVWICYmIHZhbHVlLmEgIT09IDI1NSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Mud2FybklEKDE2MjYpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfQ09MT1I7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIENPTE9SX09OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLkNPTE9SX0NIQU5HRUQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gQW5jaG9yIHBvaW50J3MgcG9zaXRpb24gb24geCBheGlzLlxuICAgICAgICAgKiAhI3poIOiKgueCuSBYIOi9tOmUmueCueS9jee9ruOAglxuICAgICAgICAgKiBAcHJvcGVydHkgYW5jaG9yWFxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBub2RlLmFuY2hvclggPSAwO1xuICAgICAgICAgKi9cbiAgICAgICAgYW5jaG9yWDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYW5jaG9yUG9pbnQueDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFuY2hvclBvaW50ID0gdGhpcy5fYW5jaG9yUG9pbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGFuY2hvclBvaW50LnggIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuY2hvclBvaW50LnggPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIEFOQ0hPUl9PTikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEFuY2hvciBwb2ludCdzIHBvc2l0aW9uIG9uIHkgYXhpcy5cbiAgICAgICAgICogISN6aCDoioLngrkgWSDovbTplJrngrnkvY3nva7jgIJcbiAgICAgICAgICogQHByb3BlcnR5IGFuY2hvcllcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5hbmNob3JZID0gMDtcbiAgICAgICAgICovXG4gICAgICAgIGFuY2hvclk6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FuY2hvclBvaW50Lnk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBhbmNob3JQb2ludCA9IHRoaXMuX2FuY2hvclBvaW50O1xuICAgICAgICAgICAgICAgIGlmIChhbmNob3JQb2ludC55ICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBhbmNob3JQb2ludC55ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBBTkNIT1JfT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBXaWR0aCBvZiBub2RlLlxuICAgICAgICAgKiAhI3poIOiKgueCueWuveW6puOAglxuICAgICAgICAgKiBAcHJvcGVydHkgd2lkdGhcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS53aWR0aCA9IDEwMDtcbiAgICAgICAgICovXG4gICAgICAgIHdpZHRoOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50U2l6ZS53aWR0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9jb250ZW50U2l6ZS53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xvbmUgPSBjYy5zaXplKHRoaXMuX2NvbnRlbnRTaXplLndpZHRoLCB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRTaXplLndpZHRoID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBTSVpFX09OKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIGNsb25lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuU0laRV9DSEFOR0VEKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSGVpZ2h0IG9mIG5vZGUuXG4gICAgICAgICAqICEjemgg6IqC54K56auY5bqm44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBoZWlnaHRcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogbm9kZS5oZWlnaHQgPSAxMDA7XG4gICAgICAgICAqL1xuICAgICAgICBoZWlnaHQ6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRTaXplLmhlaWdodDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsb25lID0gY2Muc2l6ZSh0aGlzLl9jb250ZW50U2l6ZS53aWR0aCwgdGhpcy5fY29udGVudFNpemUuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFNJWkVfT04pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgY2xvbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5TSVpFX0NIQU5HRUQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiB6SW5kZXggaXMgdGhlICdrZXknIHVzZWQgdG8gc29ydCB0aGUgbm9kZSByZWxhdGl2ZSB0byBpdHMgc2libGluZ3MuPGJyLz5cbiAgICAgICAgICogVGhlIHZhbHVlIG9mIHpJbmRleCBzaG91bGQgYmUgaW4gdGhlIHJhbmdlIGJldHdlZW4gY2MubWFjcm8uTUlOX1pJTkRFWCBhbmQgY2MubWFjcm8uTUFYX1pJTkRFWC48YnIvPlxuICAgICAgICAgKiBUaGUgTm9kZSdzIHBhcmVudCB3aWxsIHNvcnQgYWxsIGl0cyBjaGlsZHJlbiBiYXNlZCBvbiB0aGUgekluZGV4IHZhbHVlIGFuZCB0aGUgYXJyaXZhbCBvcmRlci48YnIvPlxuICAgICAgICAgKiBOb2RlcyB3aXRoIGdyZWF0ZXIgekluZGV4IHdpbGwgYmUgc29ydGVkIGFmdGVyIG5vZGVzIHdpdGggc21hbGxlciB6SW5kZXguPGJyLz5cbiAgICAgICAgICogSWYgdHdvIG5vZGVzIGhhdmUgdGhlIHNhbWUgekluZGV4LCB0aGVuIHRoZSBub2RlIHRoYXQgd2FzIGFkZGVkIGZpcnN0IHRvIHRoZSBjaGlsZHJlbidzIGFycmF5IHdpbGwgYmUgaW4gZnJvbnQgb2YgdGhlIG90aGVyIG5vZGUgaW4gdGhlIGFycmF5Ljxici8+XG4gICAgICAgICAqIE5vZGUncyBvcmRlciBpbiBjaGlsZHJlbiBsaXN0IHdpbGwgYWZmZWN0IGl0cyByZW5kZXJpbmcgb3JkZXIuIFBhcmVudCBpcyBhbHdheXMgcmVuZGVyaW5nIGJlZm9yZSBhbGwgY2hpbGRyZW4uXG4gICAgICAgICAqICEjemggekluZGV4IOaYr+eUqOadpeWvueiKgueCuei/m+ihjOaOkuW6j+eahOWFs+mUruWxnuaAp++8jOWug+WGs+WumuS4gOS4quiKgueCueWcqOWFhOW8n+iKgueCueS5i+mXtOeahOS9jee9ruOAgjxici8+XG4gICAgICAgICAqIHpJbmRleCDnmoTlj5blgLzlupTor6Xku4vkuo4gY2MubWFjcm8uTUlOX1pJTkRFWCDlkowgY2MubWFjcm8uTUFYX1pJTkRFWCDkuYvpl7RcbiAgICAgICAgICog54i26IqC54K55Li76KaB5qC55o2u6IqC54K555qEIHpJbmRleCDlkozmt7vliqDmrKHluo/mnaXmjpLluo/vvIzmi6XmnInmm7Tpq5ggekluZGV4IOeahOiKgueCueWwhuiiq+aOkuWcqOWQjumdou+8jOWmguaenOS4pOS4quiKgueCueeahCB6SW5kZXgg5LiA6Ie077yM5YWI5re75Yqg55qE6IqC54K55Lya56iz5a6a5o6S5Zyo5Y+m5LiA5Liq6IqC54K55LmL5YmN44CCPGJyLz5cbiAgICAgICAgICog6IqC54K55ZyoIGNoaWxkcmVuIOS4reeahOmhuuW6j+WGs+WumuS6huWFtua4suafk+mhuuW6j+OAgueItuiKgueCueawuOi/nOWcqOaJgOacieWtkOiKgueCueS5i+WJjeiiq+a4suafk1xuICAgICAgICAgKiBAcHJvcGVydHkgekluZGV4XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIG5vZGUuekluZGV4ID0gMTtcbiAgICAgICAgICogY2MubG9nKFwiTm9kZSB6SW5kZXg6IFwiICsgbm9kZS56SW5kZXgpO1xuICAgICAgICAgKi9cbiAgICAgICAgekluZGV4OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbFpPcmRlciA+PiAxNjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID4gbWFjcm8uTUFYX1pJTkRFWCkge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMTYzNik7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbWFjcm8uTUFYX1pJTkRFWDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUgPCBtYWNyby5NSU5fWklOREVYKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgxNjM3KTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtYWNyby5NSU5fWklOREVYO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnpJbmRleCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9jYWxaT3JkZXIgPSAodGhpcy5fbG9jYWxaT3JkZXIgJiAweDAwMDBmZmZmKSB8ICh2YWx1ZSA8PCAxNik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuU0lCTElOR19PUkRFUl9DSEFOR0VEKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vblNpYmxpbmdJbmRleENoYW5nZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogU3dpdGNoIDJELzNEIG5vZGUuIFRoZSAyRCBub2RlcyB3aWxsIHJ1biBmYXN0ZXIuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5YiH5o2iIDJELzNEIOiKgueCue+8jDJEIOiKgueCueS8muacieabtOmrmOeahOi/kOihjOaViOeOh1xuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzM0ROb2RlXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICovXG4gICAgICAgIGlzM0ROb2RlOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pczNETm9kZTtcbiAgICAgICAgICAgIH0sIHNldCAodikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzM0ROb2RlID0gdjtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGUzREZ1bmN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWVdXG4gICAgICovXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3Jlb3JkZXJDaGlsZERpcnR5ID0gZmFsc2U7XG5cbiAgICAgICAgLy8gY2FjaGUgY29tcG9uZW50XG4gICAgICAgIHRoaXMuX3dpZGdldCA9IG51bGw7XG4gICAgICAgIC8vIGZhc3QgcmVuZGVyIGNvbXBvbmVudCBhY2Nlc3NcbiAgICAgICAgdGhpcy5fcmVuZGVyQ29tcG9uZW50ID0gbnVsbDtcbiAgICAgICAgLy8gRXZlbnQgbGlzdGVuZXJzXG4gICAgICAgIHRoaXMuX2NhcHR1cmluZ0xpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2J1YmJsaW5nTGlzdGVuZXJzID0gbnVsbDtcbiAgICAgICAgLy8gVG91Y2ggZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgdGhpcy5fdG91Y2hMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIC8vIE1vdXNlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgIHRoaXMuX21vdXNlTGlzdGVuZXIgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX2luaXREYXRhRnJvbVBvb2woKTtcblxuICAgICAgICB0aGlzLl9ldmVudE1hc2sgPSAwO1xuICAgICAgICB0aGlzLl9jdWxsaW5nTWFzayA9IDE7XG4gICAgICAgIHRoaXMuX2NoaWxkQXJyaXZhbE9yZGVyID0gMTtcblxuICAgICAgICAvLyBQcm94eVxuICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm94eSA9IG5ldyByZW5kZXJlci5Ob2RlUHJveHkodGhpcy5fc3BhY2VJbmZvLnVuaXRJRCwgdGhpcy5fc3BhY2VJbmZvLmluZGV4LCB0aGlzLl9pZCwgdGhpcy5fbmFtZSk7XG4gICAgICAgICAgICB0aGlzLl9wcm94eS5pbml0KHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNob3VsZCByZXNldCBfcmVuZGVyRmxhZyBmb3IgYm90aCB3ZWIgYW5kIG5hdGl2ZVxuICAgICAgICB0aGlzLl9yZW5kZXJGbGFnID0gUmVuZGVyRmxvdy5GTEFHX1RSQU5TRk9STSB8IFJlbmRlckZsb3cuRkxBR19PUEFDSVRZX0NPTE9SO1xuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIEV2ZW50VHlwZSxcbiAgICAgICAgX0xvY2FsRGlydHlGbGFnOiBMb2NhbERpcnR5RmxhZyxcbiAgICAgICAgLy8gaXMgbm9kZSBidXQgbm90IHNjZW5lXG4gICAgICAgIGlzTm9kZSAob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTm9kZSAmJiAob2JqLmNvbnN0cnVjdG9yID09PSBOb2RlIHx8ICEob2JqIGluc3RhbmNlb2YgY2MuU2NlbmUpKTtcbiAgICAgICAgfSxcbiAgICAgICAgQnVpbHRpbkdyb3VwSW5kZXhcbiAgICB9LFxuXG4gICAgLy8gT1ZFUlJJREVTXG5cbiAgICBfb25TaWJsaW5nSW5kZXhDaGFuZ2VkICgpIHtcbiAgICAgICAgLy8gdXBkYXRlIHJlbmRlcmluZyBzY2VuZSBncmFwaCwgc29ydCB0aGVtIGJ5IGFycml2YWxPcmRlclxuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuX2RlbGF5U29ydCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9vblByZURlc3Ryb3kgKCkge1xuICAgICAgICB2YXIgZGVzdHJveUJ5UGFyZW50ID0gdGhpcy5fb25QcmVEZXN0cm95QmFzZSgpO1xuXG4gICAgICAgIC8vIEFjdGlvbnNcbiAgICAgICAgaWYgKEFjdGlvbk1hbmFnZXJFeGlzdCkge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnJlbW92ZUFsbEFjdGlvbnNGcm9tVGFyZ2V0KHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIE5vZGUuY3VycmVudEhvdmVyZWRcbiAgICAgICAgaWYgKF9jdXJyZW50SG92ZXJlZCA9PT0gdGhpcykge1xuICAgICAgICAgICAgX2N1cnJlbnRIb3ZlcmVkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBhbGwgZXZlbnQgbGlzdGVuZXJzIGlmIG5lY2Vzc2FyeVxuICAgICAgICBpZiAodGhpcy5fdG91Y2hMaXN0ZW5lciB8fCB0aGlzLl9tb3VzZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXJzKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3RvdWNoTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b3VjaExpc3RlbmVyLm93bmVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl90b3VjaExpc3RlbmVyLm1hc2sgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvdWNoTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX21vdXNlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZUxpc3RlbmVyLm93bmVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZUxpc3RlbmVyLm1hc2sgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vdXNlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgICAgICAgICAgdGhpcy5fcHJveHkuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5fcHJveHkgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fYmFja0RhdGFJbnRvUG9vbCgpO1xuXG4gICAgICAgIGlmICh0aGlzLl9yZW9yZGVyQ2hpbGREaXJ0eSkge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuX19mYXN0T2ZmKGNjLkRpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURSwgdGhpcy5zb3J0QWxsQ2hpbGRyZW4sIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFkZXN0cm95QnlQYXJlbnQpIHtcbiAgICAgICAgICAgIC8vIHNpbXVsYXRlIHNvbWUgZGVzdHJ1Y3QgbG9naWMgdG8gbWFrZSB1bmRvIHN5c3RlbSB3b3JrIGNvcnJlY3RseVxuICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIC8vIGVuc3VyZSB0aGlzIG5vZGUgY2FuIHJlYXR0YWNoIHRvIHNjZW5lIGJ5IHVuZG8gc3lzdGVtXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25Qb3N0QWN0aXZhdGVkIChhY3RpdmUpIHtcbiAgICAgICAgdmFyIGFjdGlvbk1hbmFnZXIgPSBBY3Rpb25NYW5hZ2VyRXhpc3QgPyBjYy5kaXJlY3Rvci5nZXRBY3Rpb25NYW5hZ2VyKCkgOiBudWxsO1xuICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgICAvLyBSZWZyZXNoIHRyYW5zZm9ybVxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfV09STERfVFJBTlNGT1JNO1xuICAgICAgICAgICAgLy8gQWN0aW9uTWFuYWdlciAmIEV2ZW50TWFuYWdlclxuICAgICAgICAgICAgYWN0aW9uTWFuYWdlciAmJiBhY3Rpb25NYW5hZ2VyLnJlc3VtZVRhcmdldCh0aGlzKTtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5yZXN1bWVUYXJnZXQodGhpcyk7XG4gICAgICAgICAgICAvLyBTZWFyY2ggTWFzayBpbiBwYXJlbnRcbiAgICAgICAgICAgIHRoaXMuX2NoZWNrTGlzdGVuZXJNYXNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkZWFjdGl2YXRlXG4gICAgICAgICAgICBhY3Rpb25NYW5hZ2VyICYmIGFjdGlvbk1hbmFnZXIucGF1c2VUYXJnZXQodGhpcyk7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIucGF1c2VUYXJnZXQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uSGllcmFyY2h5Q2hhbmdlZCAob2xkUGFyZW50KSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZU9yZGVyT2ZBcnJpdmFsKCk7XG4gICAgICAgIC8vIEZpeGVkIGEgYnVnIHdoZXJlIGNoaWxkcmVuIGFuZCBwYXJlbnQgbm9kZSBncm91cHMgd2VyZSBmb3JjZWQgdG8gc3luY2hyb25pemUsIGluc3RlYWQgb2Ygb25seSBzeW5jaHJvbml6aW5nIGBfY3VsbGluZ01hc2tgIHZhbHVlXG4gICAgICAgIF91cGRhdGVDdWxsaW5nTWFzayh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgICAgICAgdGhpcy5fcGFyZW50Ll9kZWxheVNvcnQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19XT1JMRF9UUkFOU0ZPUk07XG4gICAgICAgIHRoaXMuX29uSGllcmFyY2h5Q2hhbmdlZEJhc2Uob2xkUGFyZW50KTtcbiAgICAgICAgaWYgKGNjLl93aWRnZXRNYW5hZ2VyKSB7XG4gICAgICAgICAgICBjYy5fd2lkZ2V0TWFuYWdlci5fbm9kZXNPcmRlckRpcnR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvbGRQYXJlbnQgJiYgdGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgIC8vVE9ETzogSXQgbWF5IGJlIG5lY2Vzc2FyeSB0byB1cGRhdGUgdGhlIGxpc3RlbmVyIG1hc2sgb2YgYWxsIGNoaWxkIG5vZGVzLlxuICAgICAgICAgICAgdGhpcy5fY2hlY2tMaXN0ZW5lck1hc2soKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gTm9kZSBwcm94eVxuICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm94eS51cGRhdGVQYXJlbnQoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBJTlRFUk5BTFxuXG4gICAgX3VwZGF0ZTNERnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5faXMzRE5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxvY2FsTWF0cml4ID0gdXBkYXRlTG9jYWxNYXRyaXgzRDtcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bFdvcmxkTWF0cml4ID0gY2FsY3VsV29ybGRNYXRyaXgzRDtcbiAgICAgICAgICAgIHRoaXMuX211bE1hdCA9IG11bE1hdDNEO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTG9jYWxNYXRyaXggPSB1cGRhdGVMb2NhbE1hdHJpeDJEO1xuICAgICAgICAgICAgdGhpcy5fY2FsY3VsV29ybGRNYXRyaXggPSBjYWxjdWxXb3JsZE1hdHJpeDJEO1xuICAgICAgICAgICAgdGhpcy5fbXVsTWF0ID0gbXVsTWF0MkQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3JlbmRlckNvbXBvbmVudCAmJiB0aGlzLl9yZW5kZXJDb21wb25lbnQuX29uM0ROb2RlQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ29tcG9uZW50Ll9vbjNETm9kZUNoYW5nZWQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19UUkFOU0ZPUk07XG4gICAgICAgIHRoaXMuX2xvY2FsTWF0RGlydHkgPSBMb2NhbERpcnR5RmxhZy5BTEw7XG5cbiAgICAgICAgaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgICAgICAgICAgdGhpcy5fcHJveHkudXBkYXRlM0ROb2RlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2luaXREYXRhRnJvbVBvb2wgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX3NwYWNlSW5mbykge1xuICAgICAgICAgICAgaWYgKENDX0VESVRPUiB8fCBDQ19URVNUKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3BhY2VJbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICB0cnM6IG5ldyBGbG9hdDY0QXJyYXkoMTApLFxuICAgICAgICAgICAgICAgICAgICBsb2NhbE1hdDogbmV3IEZsb2F0NjRBcnJheSgxNiksXG4gICAgICAgICAgICAgICAgICAgIHdvcmxkTWF0OiBuZXcgRmxvYXQ2NEFycmF5KDE2KSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NwYWNlSW5mbyA9IG5vZGVNZW1Qb29sLnBvcCgpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNwYWNlSW5mbyA9IHRoaXMuX3NwYWNlSW5mbztcbiAgICAgICAgdGhpcy5fbWF0cml4ID0gY2MubWF0NChzcGFjZUluZm8ubG9jYWxNYXQpO1xuICAgICAgICBNYXQ0LmlkZW50aXR5KHRoaXMuX21hdHJpeCk7XG4gICAgICAgIHRoaXMuX3dvcmxkTWF0cml4ID0gY2MubWF0NChzcGFjZUluZm8ud29ybGRNYXQpO1xuICAgICAgICBNYXQ0LmlkZW50aXR5KHRoaXMuX3dvcmxkTWF0cml4KTtcbiAgICAgICAgdGhpcy5fbG9jYWxNYXREaXJ0eSA9IExvY2FsRGlydHlGbGFnLkFMTDtcbiAgICAgICAgdGhpcy5fd29ybGRNYXREaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgbGV0IHRycyA9IHRoaXMuX3RycyA9IHRoaXMuX3NwYWNlSW5mby50cnM7XG4gICAgICAgIHRyc1swXSA9IDA7IC8vIHBvc2l0aW9uLnhcbiAgICAgICAgdHJzWzFdID0gMDsgLy8gcG9zaXRpb24ueVxuICAgICAgICB0cnNbMl0gPSAwOyAvLyBwb3NpdGlvbi56XG4gICAgICAgIHRyc1szXSA9IDA7IC8vIHJvdGF0aW9uLnhcbiAgICAgICAgdHJzWzRdID0gMDsgLy8gcm90YXRpb24ueVxuICAgICAgICB0cnNbNV0gPSAwOyAvLyByb3RhdGlvbi56XG4gICAgICAgIHRyc1s2XSA9IDE7IC8vIHJvdGF0aW9uLndcbiAgICAgICAgdHJzWzddID0gMTsgLy8gc2NhbGUueFxuICAgICAgICB0cnNbOF0gPSAxOyAvLyBzY2FsZS55XG4gICAgICAgIHRyc1s5XSA9IDE7IC8vIHNjYWxlLnpcbiAgICB9LFxuXG4gICAgX2JhY2tEYXRhSW50b1Bvb2wgKCkge1xuICAgICAgICBpZiAoIShDQ19FRElUT1IgfHwgQ0NfVEVTVCkpIHtcbiAgICAgICAgICAgIC8vIHB1c2ggYmFjayB0byBwb29sXG4gICAgICAgICAgICBub2RlTWVtUG9vbC5wdXNoKHRoaXMuX3NwYWNlSW5mbyk7XG4gICAgICAgICAgICB0aGlzLl9tYXRyaXggPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fd29ybGRNYXRyaXggPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fdHJzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3NwYWNlSW5mbyA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3RvRXVsZXIgKCkge1xuICAgICAgICBpZiAodGhpcy5pczNETm9kZSkge1xuICAgICAgICAgICAgVHJzLnRvRXVsZXIodGhpcy5fZXVsZXJBbmdsZXMsIHRoaXMuX3Rycyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgeiA9IE1hdGguYXNpbih0aGlzLl90cnNbNV0pIC8gT05FX0RFR1JFRSAqIDI7XG4gICAgICAgICAgICBWZWMzLnNldCh0aGlzLl9ldWxlckFuZ2xlcywgMCwgMCwgeik7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2Zyb21FdWxlciAoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzM0ROb2RlKSB7XG4gICAgICAgICAgICBUcnMuZnJvbUV1bGVyKHRoaXMuX3RycywgdGhpcy5fZXVsZXJBbmdsZXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgVHJzLmZyb21BbmdsZVoodGhpcy5fdHJzLCB0aGlzLl9ldWxlckFuZ2xlcy56KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBncmFkZV8xeF90b18yeCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pczNETm9kZSkge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlM0RGdW5jdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRycyA9IHRoaXMuX3RycztcbiAgICAgICAgaWYgKHRycykge1xuICAgICAgICAgICAgbGV0IGRlc1RycyA9IHRycztcbiAgICAgICAgICAgIHRycyA9IHRoaXMuX3RycyA9IHRoaXMuX3NwYWNlSW5mby50cnM7XG4gICAgICAgICAgICAvLyBqdXN0IGFkYXB0IHRvIG9sZCB0cnNcbiAgICAgICAgICAgIGlmIChkZXNUcnMubGVuZ3RoID09PSAxMSkge1xuICAgICAgICAgICAgICAgIHRycy5zZXQoZGVzVHJzLnN1YmFycmF5KDEpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJzLnNldChkZXNUcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJzID0gdGhpcy5fdHJzID0gdGhpcy5fc3BhY2VJbmZvLnRycztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl96SW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5fbG9jYWxaT3JkZXIgPSB0aGlzLl96SW5kZXggPDwgMTY7XG4gICAgICAgICAgICB0aGlzLl96SW5kZXggPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2tld1ggIT09IDAgfHwgdGhpcy5fc2tld1kgIT09IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgTm9kZVV0aWxzID0gRWRpdG9yLnJlcXVpcmUoJ3NjZW5lOi8vdXRpbHMvbm9kZScpO1xuICAgICAgICAgICAgICAgIGNjLndhcm4oXCJgY2MuTm9kZS5za2V3WC9ZYCBpcyBkZXByZWNhdGVkIHNpbmNlIHYyLjIuMSwgcGxlYXNlIHVzZSAzRCBub2RlIGluc3RlYWQuXCIsIGBOb2RlOiAke05vZGVVdGlscy5nZXROb2RlUGF0aCh0aGlzKX0uYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9mcm9tRXVsZXIoKTtcblxuICAgICAgICBpZiAodGhpcy5fbG9jYWxaT3JkZXIgIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3pJbmRleCA9ICh0aGlzLl9sb2NhbFpPcmRlciAmIDB4ZmZmZjAwMDApID4+IDE2O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXBncmFkZSBmcm9tIDIuMC4wIHByZXZpZXcgNCAmIGVhcmxpZXIgdmVyc2lvbnNcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIGFmdGVyIGZpbmFsIHZlcnNpb25cbiAgICAgICAgaWYgKHRoaXMuX2NvbG9yLmEgPCAyNTUgJiYgdGhpcy5fb3BhY2l0eSA9PT0gMjU1KSB7XG4gICAgICAgICAgICB0aGlzLl9vcGFjaXR5ID0gdGhpcy5fY29sb3IuYTtcbiAgICAgICAgICAgIHRoaXMuX2NvbG9yLmEgPSAyNTU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19UUkFOU0ZPUk0gfCBSZW5kZXJGbG93LkZMQUdfT1BBQ0lUWV9DT0xPUjtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFRoZSBpbml0aWFsaXplciBmb3IgTm9kZSB3aGljaCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgYWxsIGNvbXBvbmVudHMgb25Mb2FkXG4gICAgICovXG4gICAgX29uQmF0Y2hDcmVhdGVkICgpIHtcbiAgICAgICAgbGV0IHByZWZhYkluZm8gPSB0aGlzLl9wcmVmYWI7XG4gICAgICAgIGlmIChwcmVmYWJJbmZvICYmIHByZWZhYkluZm8uc3luYyAmJiBwcmVmYWJJbmZvLnJvb3QgPT09IHRoaXMpIHtcbiAgICAgICAgICAgIGlmIChDQ19ERVYpIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPIC0gcmVtb3ZlIGFsbCB1c2FnZSBvZiBfc3luY2VkXG4gICAgICAgICAgICAgICAgY2MuYXNzZXJ0KCFwcmVmYWJJbmZvLl9zeW5jZWQsICdwcmVmYWIgc2hvdWxkIG5vdCBzeW5jZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFByZWZhYkhlbHBlci5zeW5jV2l0aFByZWZhYih0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VwZ3JhZGVfMXhfdG9fMngoKTtcblxuICAgICAgICB0aGlzLl91cGRhdGVPcmRlck9mQXJyaXZhbCgpO1xuXG4gICAgICAgIC8vIEZpeGVkIGEgYnVnIHdoZXJlIGNoaWxkcmVuIGFuZCBwYXJlbnQgbm9kZSBncm91cHMgd2VyZSBmb3JjZWQgdG8gc3luY2hyb25pemUsIGluc3RlYWQgb2Ygb25seSBzeW5jaHJvbml6aW5nIGBfY3VsbGluZ01hc2tgIHZhbHVlXG4gICAgICAgIHRoaXMuX2N1bGxpbmdNYXNrID0gMSA8PCBfZ2V0QWN0dWFsR3JvdXBJbmRleCh0aGlzKTtcbiAgICAgICAgaWYgKENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgICAgICAgICAgdGhpcy5fcHJveHkgJiYgdGhpcy5fcHJveHkudXBkYXRlQ3VsbGluZ01hc2soKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIXRoaXMuX2FjdGl2ZUluSGllcmFyY2h5KSB7XG4gICAgICAgICAgICAvLyBkZWFjdGl2YXRlIEFjdGlvbk1hbmFnZXIgYW5kIEV2ZW50TWFuYWdlciBieSBkZWZhdWx0XG4gICAgICAgICAgICBpZiAoQWN0aW9uTWFuYWdlckV4aXN0KSB7XG4gICAgICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnBhdXNlVGFyZ2V0KHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW47XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgY2hpbGRyZW5baV0uX29uQmF0Y2hDcmVhdGVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfQ0hJTERSRU47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm94eS5pbml0TmF0aXZlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdGhlIHNhbWUgYXMgX29uQmF0Y2hDcmVhdGVkIGJ1dCB1bnRvdWNoIHByZWZhYlxuICAgIF9vbkJhdGNoUmVzdG9yZWQgKCkge1xuICAgICAgICB0aGlzLl91cGdyYWRlXzF4X3RvXzJ4KCk7XG5cbiAgICAgICAgLy8gRml4ZWQgYSBidWcgd2hlcmUgY2hpbGRyZW4gYW5kIHBhcmVudCBub2RlIGdyb3VwcyB3ZXJlIGZvcmNlZCB0byBzeW5jaHJvbml6ZSwgaW5zdGVhZCBvZiBvbmx5IHN5bmNocm9uaXppbmcgYF9jdWxsaW5nTWFza2AgdmFsdWVcbiAgICAgICAgdGhpcy5fY3VsbGluZ01hc2sgPSAxIDw8IF9nZXRBY3R1YWxHcm91cEluZGV4KHRoaXMpO1xuICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm94eSAmJiB0aGlzLl9wcm94eS51cGRhdGVDdWxsaW5nTWFzaygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICghdGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgIC8vIGRlYWN0aXZhdGUgQWN0aW9uTWFuYWdlciBhbmQgRXZlbnRNYW5hZ2VyIGJ5IGRlZmF1bHRcblxuICAgICAgICAgICAgLy8gQWN0aW9uTWFuYWdlciBtYXkgbm90IGJlIGluaXRlZCBpbiB0aGUgZWRpdG9yIHdvcmtlci5cbiAgICAgICAgICAgIGxldCBtYW5hZ2VyID0gY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpO1xuICAgICAgICAgICAgbWFuYWdlciAmJiBtYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMpO1xuXG4gICAgICAgICAgICBldmVudE1hbmFnZXIucGF1c2VUYXJnZXQodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBjaGlsZHJlbltpXS5fb25CYXRjaFJlc3RvcmVkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfQ0hJTERSRU47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgICAgICAgICB0aGlzLl9wcm94eS5pbml0TmF0aXZlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gRVZFTlQgVEFSR0VUXG4gICAgX2NoZWNrTGlzdGVuZXJNYXNrICgpIHtcbiAgICAgICAgLy8gQmVjYXVzZSBNYXNrIG1heSBiZSBuZXN0ZWQsIG5lZWQgdG8gZmluZCBhbGwgdGhlIE1hc2sgY29tcG9uZW50cyBpbiB0aGUgcGFyZW50IG5vZGUuIFxuICAgICAgICAvLyBUaGUgY2xpY2sgYXJlYSBtdXN0IHNhdGlzZnkgYWxsIE1hc2tzIHRvIHRyaWdnZXIgdGhlIGNsaWNrLlxuICAgICAgICBpZiAodGhpcy5fdG91Y2hMaXN0ZW5lcikge1xuICAgICAgICAgICAgdmFyIG1hc2sgPSB0aGlzLl90b3VjaExpc3RlbmVyLm1hc2sgPSBfc2VhcmNoQ29tcG9uZW50c0luUGFyZW50KHRoaXMsIGNjLk1hc2spO1xuICAgICAgICAgICAgaWYgKHRoaXMuX21vdXNlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZUxpc3RlbmVyLm1hc2sgPSBtYXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX21vdXNlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlTGlzdGVuZXIubWFzayA9IF9zZWFyY2hDb21wb25lbnRzSW5QYXJlbnQodGhpcywgY2MuTWFzayk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NoZWNrblNldHVwU3lzRXZlbnQgKHR5cGUpIHtcbiAgICAgICAgbGV0IG5ld0FkZGVkID0gZmFsc2U7XG4gICAgICAgIGxldCBmb3JEaXNwYXRjaCA9IGZhbHNlO1xuICAgICAgICBpZiAoX3RvdWNoRXZlbnRzLmluZGV4T2YodHlwZSkgIT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX3RvdWNoTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90b3VjaExpc3RlbmVyID0gY2MuRXZlbnRMaXN0ZW5lci5jcmVhdGUoe1xuICAgICAgICAgICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FLFxuICAgICAgICAgICAgICAgICAgICBzd2FsbG93VG91Y2hlczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIG1hc2s6IF9zZWFyY2hDb21wb25lbnRzSW5QYXJlbnQodGhpcywgY2MuTWFzayksXG4gICAgICAgICAgICAgICAgICAgIG9uVG91Y2hCZWdhbjogX3RvdWNoU3RhcnRIYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICBvblRvdWNoTW92ZWQ6IF90b3VjaE1vdmVIYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICBvblRvdWNoRW5kZWQ6IF90b3VjaEVuZEhhbmRsZXIsXG4gICAgICAgICAgICAgICAgICAgIG9uVG91Y2hDYW5jZWxsZWQ6IF90b3VjaENhbmNlbEhhbmRsZXJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIodGhpcy5fdG91Y2hMaXN0ZW5lciwgdGhpcyk7XG4gICAgICAgICAgICAgICAgbmV3QWRkZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yRGlzcGF0Y2ggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKF9tb3VzZUV2ZW50cy5pbmRleE9mKHR5cGUpICE9PSAtMSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9tb3VzZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VMaXN0ZW5lciA9IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuTU9VU0UsXG4gICAgICAgICAgICAgICAgICAgIF9wcmV2aW91c0luOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIG1hc2s6IF9zZWFyY2hDb21wb25lbnRzSW5QYXJlbnQodGhpcywgY2MuTWFzayksXG4gICAgICAgICAgICAgICAgICAgIG9uTW91c2VEb3duOiBfbW91c2VEb3duSGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZU1vdmU6IF9tb3VzZU1vdmVIYW5kbGVyLFxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlVXA6IF9tb3VzZVVwSGFuZGxlcixcbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZVNjcm9sbDogX21vdXNlV2hlZWxIYW5kbGVyLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih0aGlzLl9tb3VzZUxpc3RlbmVyLCB0aGlzKTtcbiAgICAgICAgICAgICAgICBuZXdBZGRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3JEaXNwYXRjaCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5ld0FkZGVkICYmICF0aGlzLl9hY3RpdmVJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMsIDAsIDAsIDAsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm9yRGlzcGF0Y2g7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZWdpc3RlciBhIGNhbGxiYWNrIG9mIGEgc3BlY2lmaWMgZXZlbnQgdHlwZSBvbiBOb2RlLjxici8+XG4gICAgICogVXNlIHRoaXMgbWV0aG9kIHRvIHJlZ2lzdGVyIHRvdWNoIG9yIG1vdXNlIGV2ZW50IHBlcm1pdCBwcm9wYWdhdGlvbiBiYXNlZCBvbiBzY2VuZSBncmFwaCw8YnIvPlxuICAgICAqIFRoZXNlIGtpbmRzIG9mIGV2ZW50IGFyZSB0cmlnZ2VyZWQgd2l0aCBkaXNwYXRjaEV2ZW50LCB0aGUgZGlzcGF0Y2ggcHJvY2VzcyBoYXMgdGhyZWUgc3RlcHM6PGJyLz5cbiAgICAgKiAxLiBDYXB0dXJpbmcgcGhhc2U6IGRpc3BhdGNoIGluIGNhcHR1cmUgdGFyZ2V0cyAoYF9nZXRDYXB0dXJpbmdUYXJnZXRzYCksIGUuZy4gcGFyZW50cyBpbiBub2RlIHRyZWUsIGZyb20gcm9vdCB0byB0aGUgcmVhbCB0YXJnZXQ8YnIvPlxuICAgICAqIDIuIEF0IHRhcmdldCBwaGFzZTogZGlzcGF0Y2ggdG8gdGhlIGxpc3RlbmVycyBvZiB0aGUgcmVhbCB0YXJnZXQ8YnIvPlxuICAgICAqIDMuIEJ1YmJsaW5nIHBoYXNlOiBkaXNwYXRjaCBpbiBidWJibGUgdGFyZ2V0cyAoYF9nZXRCdWJibGluZ1RhcmdldHNgKSwgZS5nLiBwYXJlbnRzIGluIG5vZGUgdHJlZSwgZnJvbSB0aGUgcmVhbCB0YXJnZXQgdG8gcm9vdDxici8+XG4gICAgICogSW4gYW55IG1vbWVudCBvZiB0aGUgZGlzcGF0Y2hpbmcgcHJvY2VzcywgaXQgY2FuIGJlIHN0b3BwZWQgdmlhIGBldmVudC5zdG9wUHJvcGFnYXRpb24oKWAgb3IgYGV2ZW50LnN0b3BQcm9wYWdhdGlvbkltbWlkaWF0ZSgpYC48YnIvPlxuICAgICAqIEl0J3MgdGhlIHJlY29tbWVuZGVkIHdheSB0byByZWdpc3RlciB0b3VjaC9tb3VzZSBldmVudCBmb3IgTm9kZSw8YnIvPlxuICAgICAqIHBsZWFzZSBkbyBub3QgdXNlIGNjLmV2ZW50TWFuYWdlciBkaXJlY3RseSBmb3IgTm9kZS48YnIvPlxuICAgICAqIFlvdSBjYW4gYWxzbyByZWdpc3RlciBjdXN0b20gZXZlbnQgYW5kIHVzZSBgZW1pdGAgdG8gdHJpZ2dlciBjdXN0b20gZXZlbnQgb24gTm9kZS48YnIvPlxuICAgICAqIEZvciBzdWNoIGV2ZW50cywgdGhlcmUgd29uJ3QgYmUgY2FwdHVyaW5nIGFuZCBidWJibGluZyBwaGFzZSwgeW91ciBldmVudCB3aWxsIGJlIGRpc3BhdGNoZWQgZGlyZWN0bHkgdG8gaXRzIGxpc3RlbmVycyByZWdpc3RlcmVkIG9uIHRoZSBzYW1lIG5vZGUuPGJyLz5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBldmVudCBjYWxsYmFjayBwYXJhbWV0ZXJzIHdpdGggYGVtaXRgIGJ5IHBhc3NpbmcgcGFyYW1ldGVycyBhZnRlciBgdHlwZWAuXG4gICAgICogISN6aFxuICAgICAqIOWcqOiKgueCueS4iuazqOWGjOaMh+Wumuexu+Wei+eahOWbnuiwg+WHveaVsO+8jOS5n+WPr+S7peiuvue9riB0YXJnZXQg55So5LqO57uR5a6a5ZON5bqU5Ye95pWw55qEIHRoaXMg5a+56LGh44CCPGJyLz5cbiAgICAgKiDpvKDmoIfmiJbop6bmkbjkuovku7bkvJrooqvns7vnu5/osIPnlKggZGlzcGF0Y2hFdmVudCDmlrnms5Xop6blj5HvvIzop6blj5HnmoTov4fnqIvljIXlkKvkuInkuKrpmLbmrrXvvJo8YnIvPlxuICAgICAqIDEuIOaNleiOt+mYtuaute+8mua0vuWPkeS6i+S7tue7meaNleiOt+ebruagh++8iOmAmui/hyBgX2dldENhcHR1cmluZ1RhcmdldHNgIOiOt+WPlu+8ie+8jOavlOWmgu+8jOiKgueCueagkeS4reazqOWGjOS6huaNleiOt+mYtuauteeahOeItuiKgueCue+8jOS7juagueiKgueCueW8gOWni+a0vuWPkeebtOWIsOebruagh+iKgueCueOAgjxici8+XG4gICAgICogMi4g55uu5qCH6Zi25q6177ya5rS+5Y+R57uZ55uu5qCH6IqC54K555qE55uR5ZCs5Zmo44CCPGJyLz5cbiAgICAgKiAzLiDlhpLms6HpmLbmrrXvvJrmtL7lj5Hkuovku7bnu5nlhpLms6Hnm67moIfvvIjpgJrov4cgYF9nZXRCdWJibGluZ1RhcmdldHNgIOiOt+WPlu+8ie+8jOavlOWmgu+8jOiKgueCueagkeS4reazqOWGjOS6huWGkuazoemYtuauteeahOeItuiKgueCue+8jOS7juebruagh+iKgueCueW8gOWni+a0vuWPkeebtOWIsOagueiKgueCueOAgjxici8+XG4gICAgICog5ZCM5pe25oKo5Y+v5Lul5bCG5LqL5Lu25rS+5Y+R5Yiw54i26IqC54K55oiW6ICF6YCa6L+H6LCD55SoIHN0b3BQcm9wYWdhdGlvbiDmi6bmiKrlroPjgII8YnIvPlxuICAgICAqIOaOqOiNkOS9v+eUqOi/meenjeaWueW8j+adpeebkeWQrOiKgueCueS4iueahOinpuaRuOaIlum8oOagh+S6i+S7tu+8jOivt+S4jeimgeWcqOiKgueCueS4iuebtOaOpeS9v+eUqCBjYy5ldmVudE1hbmFnZXLjgII8YnIvPlxuICAgICAqIOS9oOS5n+WPr+S7peazqOWGjOiHquWumuS5ieS6i+S7tuWIsOiKgueCueS4iu+8jOW5tumAmui/hyBlbWl0IOaWueazleinpuWPkeatpOexu+S6i+S7tu+8jOWvueS6jui/meexu+S6i+S7tu+8jOS4jeS8muWPkeeUn+aNleiOt+WGkuazoemYtuaute+8jOWPquS8muebtOaOpea0vuWPkee7meazqOWGjOWcqOivpeiKgueCueS4iueahOebkeWQrOWZqDxici8+XG4gICAgICog5L2g5Y+v5Lul6YCa6L+H5ZyoIGVtaXQg5pa55rOV6LCD55So5pe25ZyoIHR5cGUg5LmL5ZCO5Lyg6YCS6aKd5aSW55qE5Y+C5pWw5L2c5Li65LqL5Lu25Zue6LCD55qE5Y+C5pWw5YiX6KGoXG4gICAgICogQG1ldGhvZCBvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfE5vZGUuRXZlbnRUeXBlfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIGxpc3RlbiBmb3IuPGJyPlNlZSB7eyNjcm9zc0xpbmsgXCJOb2RlL0V2ZW50VHl1cGUvUE9TSVRJT05fQ0hBTkdFRFwifX1Ob2RlIEV2ZW50c3t7L2Nyb3NzTGlua319IGZvciBhbGwgYnVpbHRpbiBldmVudHMuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC4gVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXG4gICAgICogQHBhcmFtIHtFdmVudHxhbnl9IFtjYWxsYmFjay5ldmVudF0gZXZlbnQgb3IgZmlyc3QgYXJndW1lbnQgd2hlbiBlbWl0XG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmcyXSBhcmcyXG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmczXSBhcmczXG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmc0XSBhcmc0XG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmc1XSBhcmc1XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbdXNlQ2FwdHVyZT1mYWxzZV0gLSBXaGVuIHNldCB0byB0cnVlLCB0aGUgbGlzdGVuZXIgd2lsbCBiZSB0cmlnZ2VyZWQgYXQgY2FwdHVyaW5nIHBoYXNlIHdoaWNoIGlzIGFoZWFkIG9mIHRoZSBmaW5hbCB0YXJnZXQgZW1pdCwgb3RoZXJ3aXNlIGl0IHdpbGwgYmUgdHJpZ2dlcmVkIGR1cmluZyBidWJibGluZyBwaGFzZS5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSBKdXN0IHJldHVybnMgdGhlIGluY29taW5nIGNhbGxiYWNrIHNvIHlvdSBjYW4gc2F2ZSB0aGUgYW5vbnltb3VzIGZ1bmN0aW9uIGVhc2llci5cbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIG9uPFQgZXh0ZW5kcyBGdW5jdGlvbj4odHlwZTogc3RyaW5nLCBjYWxsYmFjazogVCwgdGFyZ2V0PzogYW55LCB1c2VDYXB0dXJlPzogYm9vbGVhbik6IFRcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5tZW1iZXJGdW5jdGlvbiwgdGhpcyk7ICAvLyBpZiBcInRoaXNcIiBpcyBjb21wb25lbnQgYW5kIHRoZSBcIm1lbWJlckZ1bmN0aW9uXCIgZGVjbGFyZWQgaW4gQ0NDbGFzcy5cbiAgICAgKiBub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBjYWxsYmFjaywgdGhpcyk7XG4gICAgICogbm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCBjYWxsYmFjaywgdGhpcyk7XG4gICAgICogbm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICAgKiBub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgY2FsbGJhY2ssIHRoaXMpO1xuICAgICAqIG5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIGNhbGxiYWNrKTtcbiAgICAgKiBub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkNPTE9SX0NIQU5HRUQsIGNhbGxiYWNrKTtcbiAgICAgKi9cbiAgICBvbiAodHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgdXNlQ2FwdHVyZSkge1xuICAgICAgICBsZXQgZm9yRGlzcGF0Y2ggPSB0aGlzLl9jaGVja25TZXR1cFN5c0V2ZW50KHR5cGUpO1xuICAgICAgICBpZiAoZm9yRGlzcGF0Y2gpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbkRpc3BhdGNoKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIHVzZUNhcHR1cmUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgfD0gUE9TSVRJT05fT047XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuU0NBTEVfQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgfD0gU0NBTEVfT047XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuUk9UQVRJT05fQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgfD0gUk9UQVRJT05fT047XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuU0laRV9DSEFOR0VEOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50TWFzayB8PSBTSVpFX09OO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VEOlxuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50TWFzayB8PSBBTkNIT1JfT047XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuQ09MT1JfQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgfD0gQ09MT1JfT047XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2J1YmJsaW5nTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYnViYmxpbmdMaXN0ZW5lcnMgPSBuZXcgRXZlbnRUYXJnZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idWJibGluZ0xpc3RlbmVycy5vbih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVnaXN0ZXIgYW4gY2FsbGJhY2sgb2YgYSBzcGVjaWZpYyBldmVudCB0eXBlIG9uIHRoZSBOb2RlLFxuICAgICAqIHRoZSBjYWxsYmFjayB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgdGhlIGZpcnN0IHRpbWUgaXQgaXMgdHJpZ2dlcmVkLlxuICAgICAqICEjemhcbiAgICAgKiDms6jlhozoioLngrnnmoTnibnlrprkuovku7bnsbvlnovlm57osIPvvIzlm57osIPkvJrlnKjnrKzkuIDml7bpl7Tooqvop6blj5HlkI7liKDpmaToh6rouqvjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgb25jZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIGxpc3RlbiBmb3IuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICAgICAqIEBwYXJhbSB7RXZlbnR8YW55fSBbY2FsbGJhY2suZXZlbnRdIGV2ZW50IG9yIGZpcnN0IGFyZ3VtZW50IHdoZW4gZW1pdFxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnMl0gYXJnMlxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnM10gYXJnM1xuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNF0gYXJnNFxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNV0gYXJnNVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XSAtIFRoZSB0YXJnZXQgKHRoaXMgb2JqZWN0KSB0byBpbnZva2UgdGhlIGNhbGxiYWNrLCBjYW4gYmUgbnVsbFxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogb25jZTxUIGV4dGVuZHMgRnVuY3Rpb24+KHR5cGU6IHN0cmluZywgY2FsbGJhY2s6IFQsIHRhcmdldD86IGFueSwgdXNlQ2FwdHVyZT86IGJvb2xlYW4pOiBUXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLm9uY2UoY2MuTm9kZS5FdmVudFR5cGUuQU5DSE9SX0NIQU5HRUQsIGNhbGxiYWNrKTtcbiAgICAgKi9cbiAgICBvbmNlICh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0LCB1c2VDYXB0dXJlKSB7XG4gICAgICAgIGxldCBmb3JEaXNwYXRjaCA9IHRoaXMuX2NoZWNrblNldHVwU3lzRXZlbnQodHlwZSk7XG5cbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IG51bGw7XG4gICAgICAgIGlmIChmb3JEaXNwYXRjaCAmJiB1c2VDYXB0dXJlKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSB0aGlzLl9jYXB0dXJpbmdMaXN0ZW5lcnMgPSB0aGlzLl9jYXB0dXJpbmdMaXN0ZW5lcnMgfHwgbmV3IEV2ZW50VGFyZ2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSB0aGlzLl9idWJibGluZ0xpc3RlbmVycyA9IHRoaXMuX2J1YmJsaW5nTGlzdGVuZXJzIHx8IG5ldyBFdmVudFRhcmdldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGlzdGVuZXJzLm9uY2UodHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XG4gICAgfSxcblxuICAgIF9vbkRpc3BhdGNoICh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0LCB1c2VDYXB0dXJlKSB7XG4gICAgICAgIC8vIEFjY2VwdCBhbHNvIHBhdGFtZXRlcnMgbGlrZTogKHR5cGUsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKVxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB1c2VDYXB0dXJlID0gdGFyZ2V0O1xuICAgICAgICAgICAgdGFyZ2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgdXNlQ2FwdHVyZSA9ICEhdXNlQ2FwdHVyZTtcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCg2ODAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSBudWxsO1xuICAgICAgICBpZiAodXNlQ2FwdHVyZSkge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gdGhpcy5fY2FwdHVyaW5nTGlzdGVuZXJzID0gdGhpcy5fY2FwdHVyaW5nTGlzdGVuZXJzIHx8IG5ldyBFdmVudFRhcmdldCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gdGhpcy5fYnViYmxpbmdMaXN0ZW5lcnMgPSB0aGlzLl9idWJibGluZ0xpc3RlbmVycyB8fCBuZXcgRXZlbnRUYXJnZXQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggIWxpc3RlbmVycy5oYXNFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpICkge1xuICAgICAgICAgICAgbGlzdGVuZXJzLm9uKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpO1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5fX2V2ZW50VGFyZ2V0cykge1xuICAgICAgICAgICAgICAgIHRhcmdldC5fX2V2ZW50VGFyZ2V0cy5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVtb3ZlcyB0aGUgY2FsbGJhY2sgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggdGhlIHNhbWUgdHlwZSwgY2FsbGJhY2ssIHRhcmdldCBhbmQgb3IgdXNlQ2FwdHVyZS5cbiAgICAgKiBUaGlzIG1ldGhvZCBpcyBtZXJlbHkgYW4gYWxpYXMgdG8gcmVtb3ZlRXZlbnRMaXN0ZW5lci5cbiAgICAgKiAhI3poIOWIoOmZpOS5i+WJjeS4juWQjOexu+Wei++8jOWbnuiwg++8jOebruagh+aIliB1c2VDYXB0dXJlIOazqOWGjOeahOWbnuiwg+OAglxuICAgICAqIEBtZXRob2Qgb2ZmXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgYmVpbmcgcmVtb3ZlZC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdIC0gVGhlIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF0gLSBUaGUgdGFyZ2V0ICh0aGlzIG9iamVjdCkgdG8gaW52b2tlIHRoZSBjYWxsYmFjaywgaWYgaXQncyBub3QgZ2l2ZW4sIG9ubHkgY2FsbGJhY2sgd2l0aG91dCB0YXJnZXQgd2lsbCBiZSByZW1vdmVkXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbdXNlQ2FwdHVyZT1mYWxzZV0gLSBXaGVuIHNldCB0byB0cnVlLCB0aGUgbGlzdGVuZXIgd2lsbCBiZSB0cmlnZ2VyZWQgYXQgY2FwdHVyaW5nIHBoYXNlIHdoaWNoIGlzIGFoZWFkIG9mIHRoZSBmaW5hbCB0YXJnZXQgZW1pdCwgb3RoZXJ3aXNlIGl0IHdpbGwgYmUgdHJpZ2dlcmVkIGR1cmluZyBidWJibGluZyBwaGFzZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHRoaXMubm9kZS5vZmYoY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfU1RBUlQsIHRoaXMubWVtYmVyRnVuY3Rpb24sIHRoaXMpO1xuICAgICAqIG5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBjYWxsYmFjaywgdGhpcy5ub2RlKTtcbiAgICAgKiBub2RlLm9mZihjYy5Ob2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgY2FsbGJhY2ssIHRoaXMpO1xuICAgICAqL1xuICAgIG9mZiAodHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgdXNlQ2FwdHVyZSkge1xuICAgICAgICBsZXQgdG91Y2hFdmVudCA9IF90b3VjaEV2ZW50cy5pbmRleE9mKHR5cGUpICE9PSAtMTtcbiAgICAgICAgbGV0IG1vdXNlRXZlbnQgPSAhdG91Y2hFdmVudCAmJiBfbW91c2VFdmVudHMuaW5kZXhPZih0eXBlKSAhPT0gLTE7XG4gICAgICAgIGlmICh0b3VjaEV2ZW50IHx8IG1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX29mZkRpc3BhdGNoKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIHVzZUNhcHR1cmUpO1xuXG4gICAgICAgICAgICBpZiAodG91Y2hFdmVudCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90b3VjaExpc3RlbmVyICYmICFfY2hlY2tMaXN0ZW5lcnModGhpcywgX3RvdWNoRXZlbnRzKSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5fdG91Y2hMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RvdWNoTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbW91c2VMaXN0ZW5lciAmJiAhX2NoZWNrTGlzdGVuZXJzKHRoaXMsIF9tb3VzZUV2ZW50cykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKHRoaXMuX21vdXNlTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fYnViYmxpbmdMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1YmJsaW5nTGlzdGVuZXJzLm9mZih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KTtcblxuICAgICAgICAgICAgdmFyIGhhc0xpc3RlbmVycyA9IHRoaXMuX2J1YmJsaW5nTGlzdGVuZXJzLmhhc0V2ZW50TGlzdGVuZXIodHlwZSk7XG4gICAgICAgICAgICAvLyBBbGwgbGlzdGVuZXIgcmVtb3ZlZFxuICAgICAgICAgICAgaWYgKCFoYXNMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrICY9IH5QT1NJVElPTl9PTjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRXZlbnRUeXBlLlNDQUxFX0NIQU5HRUQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50TWFzayAmPSB+U0NBTEVfT047XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5ST1RBVElPTl9DSEFOR0VEOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gflJPVEFUSU9OX09OO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBFdmVudFR5cGUuU0laRV9DSEFOR0VEOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gflNJWkVfT047XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrICY9IH5BTkNIT1JfT047XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIEV2ZW50VHlwZS5DT0xPUl9DSEFOR0VEOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gfkNPTE9SX09OO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29mZkRpc3BhdGNoICh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0LCB1c2VDYXB0dXJlKSB7XG4gICAgICAgIC8vIEFjY2VwdCBhbHNvIHBhdGFtZXRlcnMgbGlrZTogKHR5cGUsIGNhbGxiYWNrLCB1c2VDYXB0dXJlKVxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICB1c2VDYXB0dXJlID0gdGFyZ2V0O1xuICAgICAgICAgICAgdGFyZ2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgdXNlQ2FwdHVyZSA9ICEhdXNlQ2FwdHVyZTtcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5fY2FwdHVyaW5nTGlzdGVuZXJzICYmIHRoaXMuX2NhcHR1cmluZ0xpc3RlbmVycy5yZW1vdmVBbGwodHlwZSk7XG4gICAgICAgICAgICB0aGlzLl9idWJibGluZ0xpc3RlbmVycyAmJiB0aGlzLl9idWJibGluZ0xpc3RlbmVycy5yZW1vdmVBbGwodHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgbGlzdGVuZXJzID0gdXNlQ2FwdHVyZSA/IHRoaXMuX2NhcHR1cmluZ0xpc3RlbmVycyA6IHRoaXMuX2J1YmJsaW5nTGlzdGVuZXJzO1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5vZmYodHlwZSwgY2FsbGJhY2ssIHRhcmdldCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0ICYmIHRhcmdldC5fX2V2ZW50VGFyZ2V0cykge1xuICAgICAgICAgICAgICAgICAgICBqcy5hcnJheS5mYXN0UmVtb3ZlKHRhcmdldC5fX2V2ZW50VGFyZ2V0cywgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZW1vdmVzIGFsbCBjYWxsYmFja3MgcHJldmlvdXNseSByZWdpc3RlcmVkIHdpdGggdGhlIHNhbWUgdGFyZ2V0LlxuICAgICAqICEjemgg56e76Zmk55uu5qCH5LiK55qE5omA5pyJ5rOo5YaM5LqL5Lu244CCXG4gICAgICogQG1ldGhvZCB0YXJnZXRPZmZcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IC0gVGhlIHRhcmdldCB0byBiZSBzZWFyY2hlZCBmb3IgYWxsIHJlbGF0ZWQgY2FsbGJhY2tzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLnRhcmdldE9mZih0YXJnZXQpO1xuICAgICAqL1xuICAgIHRhcmdldE9mZiAodGFyZ2V0KSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9idWJibGluZ0xpc3RlbmVycztcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgbGlzdGVuZXJzLnRhcmdldE9mZih0YXJnZXQpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBmb3IgZXZlbnQgbWFzayByZXNldFxuICAgICAgICAgICAgaWYgKCh0aGlzLl9ldmVudE1hc2sgJiBQT1NJVElPTl9PTikgJiYgIWxpc3RlbmVycy5oYXNFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VEKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50TWFzayAmPSB+UE9TSVRJT05fT047XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHRoaXMuX2V2ZW50TWFzayAmIFNDQUxFX09OKSAmJiAhbGlzdGVuZXJzLmhhc0V2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLlNDQUxFX0NIQU5HRUQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRNYXNrICY9IH5TQ0FMRV9PTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgodGhpcy5fZXZlbnRNYXNrICYgUk9UQVRJT05fT04pICYmICFsaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuUk9UQVRJT05fQ0hBTkdFRCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gflJPVEFUSU9OX09OO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCh0aGlzLl9ldmVudE1hc2sgJiBTSVpFX09OKSAmJiAhbGlzdGVuZXJzLmhhc0V2ZW50TGlzdGVuZXIoRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gflNJWkVfT047XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHRoaXMuX2V2ZW50TWFzayAmIEFOQ0hPUl9PTikgJiYgIWxpc3RlbmVycy5oYXNFdmVudExpc3RlbmVyKEV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gfkFOQ0hPUl9PTjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgodGhpcy5fZXZlbnRNYXNrICYgQ09MT1JfT04pICYmICFsaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcihFdmVudFR5cGUuQ09MT1JfQ0hBTkdFRCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudE1hc2sgJj0gfkNPTE9SX09OO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9jYXB0dXJpbmdMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhcHR1cmluZ0xpc3RlbmVycy50YXJnZXRPZmYodGFyZ2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0Ll9fZXZlbnRUYXJnZXRzKSB7XG4gICAgICAgICAgICBqcy5hcnJheS5mYXN0UmVtb3ZlKHRhcmdldC5fX2V2ZW50VGFyZ2V0cywgdGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fdG91Y2hMaXN0ZW5lciAmJiAhX2NoZWNrTGlzdGVuZXJzKHRoaXMsIF90b3VjaEV2ZW50cykpIHtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5yZW1vdmVMaXN0ZW5lcih0aGlzLl90b3VjaExpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuX3RvdWNoTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9tb3VzZUxpc3RlbmVyICYmICFfY2hlY2tMaXN0ZW5lcnModGhpcywgX21vdXNlRXZlbnRzKSkge1xuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnJlbW92ZUxpc3RlbmVyKHRoaXMuX21vdXNlTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5fbW91c2VMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBDaGVja3Mgd2hldGhlciB0aGUgRXZlbnRUYXJnZXQgb2JqZWN0IGhhcyBhbnkgY2FsbGJhY2sgcmVnaXN0ZXJlZCBmb3IgYSBzcGVjaWZpYyB0eXBlIG9mIGV2ZW50LlxuICAgICAqICEjemgg5qOA5p+l5LqL5Lu255uu5qCH5a+56LGh5piv5ZCm5pyJ5Li654m55a6a57G75Z6L55qE5LqL5Lu25rOo5YaM55qE5Zue6LCD44CCXG4gICAgICogQG1ldGhvZCBoYXNFdmVudExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiBldmVudC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIGEgY2FsbGJhY2sgb2YgdGhlIHNwZWNpZmllZCB0eXBlIGlzIHJlZ2lzdGVyZWQ7IGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBoYXNFdmVudExpc3RlbmVyICh0eXBlKSB7XG4gICAgICAgIGxldCBoYXMgPSBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuX2J1YmJsaW5nTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBoYXMgPSB0aGlzLl9idWJibGluZ0xpc3RlbmVycy5oYXNFdmVudExpc3RlbmVyKHR5cGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghaGFzICYmIHRoaXMuX2NhcHR1cmluZ0xpc3RlbmVycykge1xuICAgICAgICAgICAgaGFzID0gdGhpcy5fY2FwdHVyaW5nTGlzdGVuZXJzLmhhc0V2ZW50TGlzdGVuZXIodHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFRyaWdnZXIgYW4gZXZlbnQgZGlyZWN0bHkgd2l0aCB0aGUgZXZlbnQgbmFtZSBhbmQgbmVjZXNzYXJ5IGFyZ3VtZW50cy5cbiAgICAgKiAhI3poXG4gICAgICog6YCa6L+H5LqL5Lu25ZCN5Y+R6YCB6Ieq5a6a5LmJ5LqL5Lu2XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGVtaXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIGV2ZW50IHR5cGVcbiAgICAgKiBAcGFyYW0geyp9IFthcmcxXSAtIEZpcnN0IGFyZ3VtZW50IGluIGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHsqfSBbYXJnMl0gLSBTZWNvbmQgYXJndW1lbnQgaW4gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0geyp9IFthcmczXSAtIFRoaXJkIGFyZ3VtZW50IGluIGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHsqfSBbYXJnNF0gLSBGb3VydGggYXJndW1lbnQgaW4gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0geyp9IFthcmc1XSAtIEZpZnRoIGFyZ3VtZW50IGluIGNhbGxiYWNrXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBcbiAgICAgKiBldmVudFRhcmdldC5lbWl0KCdmaXJlJywgZXZlbnQpO1xuICAgICAqIGV2ZW50VGFyZ2V0LmVtaXQoJ2ZpcmUnLCBtZXNzYWdlLCBlbWl0dGVyKTtcbiAgICAgKi9cbiAgICBlbWl0ICh0eXBlLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0LCBhcmc1KSB7XG4gICAgICAgIGlmICh0aGlzLl9idWJibGluZ0xpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5fYnViYmxpbmdMaXN0ZW5lcnMuZW1pdCh0eXBlLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0LCBhcmc1KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRGlzcGF0Y2hlcyBhbiBldmVudCBpbnRvIHRoZSBldmVudCBmbG93LlxuICAgICAqIFRoZSBldmVudCB0YXJnZXQgaXMgdGhlIEV2ZW50VGFyZ2V0IG9iamVjdCB1cG9uIHdoaWNoIHRoZSBkaXNwYXRjaEV2ZW50KCkgbWV0aG9kIGlzIGNhbGxlZC5cbiAgICAgKiAhI3poIOWIhuWPkeS6i+S7tuWIsOS6i+S7tua1geS4reOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBkaXNwYXRjaEV2ZW50XG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlbnQgLSBUaGUgRXZlbnQgb2JqZWN0IHRoYXQgaXMgZGlzcGF0Y2hlZCBpbnRvIHRoZSBldmVudCBmbG93XG4gICAgICovXG4gICAgZGlzcGF0Y2hFdmVudCAoZXZlbnQpIHtcbiAgICAgICAgX2RvRGlzcGF0Y2hFdmVudCh0aGlzLCBldmVudCk7XG4gICAgICAgIF9jYWNoZWRBcnJheS5sZW5ndGggPSAwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhdXNlIG5vZGUgcmVsYXRlZCBzeXN0ZW0gZXZlbnRzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgY3VycmVudCBOb2RlLiBOb2RlIHN5c3RlbSBldmVudHMgaW5jbHVkZXMgdG91Y2ggYW5kIG1vdXNlIGV2ZW50cy5cbiAgICAgKiBJZiByZWN1cnNpdmUgaXMgc2V0IHRvIHRydWUsIHRoZW4gdGhpcyBBUEkgd2lsbCBwYXVzZSB0aGUgbm9kZSBzeXN0ZW0gZXZlbnRzIGZvciB0aGUgbm9kZSBhbmQgYWxsIG5vZGVzIGluIGl0cyBzdWIgbm9kZSB0cmVlLlxuICAgICAqIFJlZmVyZW5jZTogaHR0cDovL2RvY3MuY29jb3MyZC14Lm9yZy9lZGl0b3JzX2FuZF90b29scy9jcmVhdG9yLWNoYXB0ZXJzL3NjcmlwdGluZy9pbnRlcm5hbC1ldmVudHMvXG4gICAgICogISN6aCDmmoLlgZzlvZPliY3oioLngrnkuIrms6jlhoznmoTmiYDmnInoioLngrnns7vnu5/kuovku7bvvIzoioLngrnns7vnu5/kuovku7bljIXlkKvop6bmkbjlkozpvKDmoIfkuovku7bjgIJcbiAgICAgKiDlpoLmnpzkvKDpgJIgcmVjdXJzaXZlIOS4uiB0cnVl77yM6YKj5LmI6L+Z5LiqIEFQSSDlsIbmmoLlgZzmnKzoioLngrnlkozlroPnmoTlrZDmoJHkuIrmiYDmnInoioLngrnnmoToioLngrnns7vnu5/kuovku7bjgIJcbiAgICAgKiDlj4LogIPvvJpodHRwczovL3d3dy5jb2Nvcy5jb20vZG9jcy9jcmVhdG9yL3NjcmlwdGluZy9pbnRlcm5hbC1ldmVudHMuaHRtbFxuICAgICAqIEBtZXRob2QgcGF1c2VTeXN0ZW1FdmVudHNcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJlY3Vyc2l2ZSAtIFdoZXRoZXIgdG8gcGF1c2Ugbm9kZSBzeXN0ZW0gZXZlbnRzIG9uIHRoZSBzdWIgbm9kZSB0cmVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5wYXVzZVN5c3RlbUV2ZW50cyh0cnVlKTtcbiAgICAgKi9cbiAgICBwYXVzZVN5c3RlbUV2ZW50cyAocmVjdXJzaXZlKSB7XG4gICAgICAgIGV2ZW50TWFuYWdlci5wYXVzZVRhcmdldCh0aGlzLCByZWN1cnNpdmUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlc3VtZSBub2RlIHJlbGF0ZWQgc3lzdGVtIGV2ZW50cyByZWdpc3RlcmVkIHdpdGggdGhlIGN1cnJlbnQgTm9kZS4gTm9kZSBzeXN0ZW0gZXZlbnRzIGluY2x1ZGVzIHRvdWNoIGFuZCBtb3VzZSBldmVudHMuXG4gICAgICogSWYgcmVjdXJzaXZlIGlzIHNldCB0byB0cnVlLCB0aGVuIHRoaXMgQVBJIHdpbGwgcmVzdW1lIHRoZSBub2RlIHN5c3RlbSBldmVudHMgZm9yIHRoZSBub2RlIGFuZCBhbGwgbm9kZXMgaW4gaXRzIHN1YiBub2RlIHRyZWUuXG4gICAgICogUmVmZXJlbmNlOiBodHRwOi8vZG9jcy5jb2NvczJkLXgub3JnL2VkaXRvcnNfYW5kX3Rvb2xzL2NyZWF0b3ItY2hhcHRlcnMvc2NyaXB0aW5nL2ludGVybmFsLWV2ZW50cy9cbiAgICAgKiAhI3poIOaBouWkjeW9k+WJjeiKgueCueS4iuazqOWGjOeahOaJgOacieiKgueCueezu+e7n+S6i+S7tu+8jOiKgueCueezu+e7n+S6i+S7tuWMheWQq+inpuaRuOWSjOm8oOagh+S6i+S7tuOAglxuICAgICAqIOWmguaenOS8oOmAkiByZWN1cnNpdmUg5Li6IHRydWXvvIzpgqPkuYjov5nkuKogQVBJIOWwhuaBouWkjeacrOiKgueCueWSjOWug+eahOWtkOagkeS4iuaJgOacieiKgueCueeahOiKgueCueezu+e7n+S6i+S7tuOAglxuICAgICAqIOWPguiAg++8mmh0dHBzOi8vd3d3LmNvY29zLmNvbS9kb2NzL2NyZWF0b3Ivc2NyaXB0aW5nL2ludGVybmFsLWV2ZW50cy5odG1sXG4gICAgICogQG1ldGhvZCByZXN1bWVTeXN0ZW1FdmVudHNcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJlY3Vyc2l2ZSAtIFdoZXRoZXIgdG8gcmVzdW1lIG5vZGUgc3lzdGVtIGV2ZW50cyBvbiB0aGUgc3ViIG5vZGUgdHJlZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUucmVzdW1lU3lzdGVtRXZlbnRzKHRydWUpO1xuICAgICAqL1xuICAgIHJlc3VtZVN5c3RlbUV2ZW50cyAocmVjdXJzaXZlKSB7XG4gICAgICAgIGV2ZW50TWFuYWdlci5yZXN1bWVUYXJnZXQodGhpcywgcmVjdXJzaXZlKTtcbiAgICB9LFxuXG4gICAgX2hpdFRlc3QgKHBvaW50LCBsaXN0ZW5lcikge1xuICAgICAgICBsZXQgdyA9IHRoaXMuX2NvbnRlbnRTaXplLndpZHRoLFxuICAgICAgICAgICAgaCA9IHRoaXMuX2NvbnRlbnRTaXplLmhlaWdodCxcbiAgICAgICAgICAgIGNhbWVyYVB0ID0gX2h0VmVjM2EsXG4gICAgICAgICAgICB0ZXN0UHQgPSBfaHRWZWMzYjtcbiAgICAgICAgXG4gICAgICAgIGxldCBjYW1lcmEgPSBjYy5DYW1lcmEuZmluZENhbWVyYSh0aGlzKTtcbiAgICAgICAgaWYgKGNhbWVyYSkge1xuICAgICAgICAgICAgY2FtZXJhLmdldFNjcmVlblRvV29ybGRQb2ludChwb2ludCwgY2FtZXJhUHQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2FtZXJhUHQuc2V0KHBvaW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3VwZGF0ZVdvcmxkTWF0cml4KCk7XG4gICAgICAgIC8vIElmIHNjYWxlIGlzIDAsIGl0IGNhbid0IGJlIGhpdC5cbiAgICAgICAgaWYgKCFNYXQ0LmludmVydChfbWF0NF90ZW1wLCB0aGlzLl93b3JsZE1hdHJpeCkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBWZWMyLnRyYW5zZm9ybU1hdDQodGVzdFB0LCBjYW1lcmFQdCwgX21hdDRfdGVtcCk7XG4gICAgICAgIHRlc3RQdC54ICs9IHRoaXMuX2FuY2hvclBvaW50LnggKiB3O1xuICAgICAgICB0ZXN0UHQueSArPSB0aGlzLl9hbmNob3JQb2ludC55ICogaDtcblxuICAgICAgICBsZXQgaGl0ID0gZmFsc2U7XG4gICAgICAgIGlmICh0ZXN0UHQueCA+PSAwICYmIHRlc3RQdC55ID49IDAgJiYgdGVzdFB0LnggPD0gdyAmJiB0ZXN0UHQueSA8PSBoKSB7XG4gICAgICAgICAgICBoaXQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyICYmIGxpc3RlbmVyLm1hc2spIHtcbiAgICAgICAgICAgICAgICBsZXQgbWFzayA9IGxpc3RlbmVyLm1hc2s7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgbGV0IGxlbmd0aCA9IG1hc2sgPyBtYXNrLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICAgICAgLy8gZmluZCBtYXNrIHBhcmVudCwgc2hvdWxkIGhpdCB0ZXN0IGl0XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGogPSAwOyBwYXJlbnQgJiYgaiA8IGxlbmd0aDsgKytpLCBwYXJlbnQgPSBwYXJlbnQucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wID0gbWFza1tqXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IHRlbXAuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJlbnQgPT09IHRlbXAubm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21wID0gcGFyZW50LmdldENvbXBvbmVudChjYy5NYXNrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29tcCAmJiBjb21wLl9lbmFibGVkICYmICFjb21wLl9oaXRUZXN0KGNhbWVyYVB0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtYXNrIHBhcmVudCBubyBsb25nZXIgZXhpc3RzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFzay5sZW5ndGggPSBqO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA+IHRlbXAuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hc2sgcGFyZW50IG5vIGxvbmdlciBleGlzdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hc2subGVuZ3RoID0gajtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG5cbiAgICAgICAgcmV0dXJuIGhpdDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGFsbCB0aGUgdGFyZ2V0cyBsaXN0ZW5pbmcgdG8gdGhlIHN1cHBsaWVkIHR5cGUgb2YgZXZlbnQgaW4gdGhlIHRhcmdldCdzIGNhcHR1cmluZyBwaGFzZS5cbiAgICAgKiBUaGUgY2FwdHVyaW5nIHBoYXNlIGNvbXByaXNlcyB0aGUgam91cm5leSBmcm9tIHRoZSByb290IHRvIHRoZSBsYXN0IG5vZGUgQkVGT1JFIHRoZSBldmVudCB0YXJnZXQncyBub2RlLlxuICAgICAqIFRoZSByZXN1bHQgc2hvdWxkIHNhdmUgaW4gdGhlIGFycmF5IHBhcmFtZXRlciwgYW5kIE1VU1QgU09SVCBmcm9tIGNoaWxkIG5vZGVzIHRvIHBhcmVudCBub2Rlcy5cbiAgICAgKlxuICAgICAqIFN1YmNsYXNzZXMgY2FuIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIG1ha2UgZXZlbnQgcHJvcGFnYWJsZS5cbiAgICAgKiBAbWV0aG9kIF9nZXRDYXB0dXJpbmdUYXJnZXRzXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIHRoZSBldmVudCB0eXBlXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJyYXkgLSB0aGUgYXJyYXkgdG8gcmVjZWl2ZSB0YXJnZXRzXG4gICAgICogQGV4YW1wbGUge0BsaW5rIGNvY29zMmQvY29yZS9ldmVudC9fZ2V0Q2FwdHVyaW5nVGFyZ2V0cy5qc31cbiAgICAgKi9cbiAgICBfZ2V0Q2FwdHVyaW5nVGFyZ2V0cyAodHlwZSwgYXJyYXkpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50O1xuICAgICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgICAgICBpZiAocGFyZW50Ll9jYXB0dXJpbmdMaXN0ZW5lcnMgJiYgcGFyZW50Ll9jYXB0dXJpbmdMaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcih0eXBlKSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0IGFsbCB0aGUgdGFyZ2V0cyBsaXN0ZW5pbmcgdG8gdGhlIHN1cHBsaWVkIHR5cGUgb2YgZXZlbnQgaW4gdGhlIHRhcmdldCdzIGJ1YmJsaW5nIHBoYXNlLlxuICAgICAqIFRoZSBidWJibGluZyBwaGFzZSBjb21wcmlzZXMgYW55IFNVQlNFUVVFTlQgbm9kZXMgZW5jb3VudGVyZWQgb24gdGhlIHJldHVybiB0cmlwIHRvIHRoZSByb290IG9mIHRoZSB0cmVlLlxuICAgICAqIFRoZSByZXN1bHQgc2hvdWxkIHNhdmUgaW4gdGhlIGFycmF5IHBhcmFtZXRlciwgYW5kIE1VU1QgU09SVCBmcm9tIGNoaWxkIG5vZGVzIHRvIHBhcmVudCBub2Rlcy5cbiAgICAgKlxuICAgICAqIFN1YmNsYXNzZXMgY2FuIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIG1ha2UgZXZlbnQgcHJvcGFnYWJsZS5cbiAgICAgKiBAbWV0aG9kIF9nZXRCdWJibGluZ1RhcmdldHNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gdGhlIGV2ZW50IHR5cGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcnJheSAtIHRoZSBhcnJheSB0byByZWNlaXZlIHRhcmdldHNcbiAgICAgKi9cbiAgICBfZ2V0QnViYmxpbmdUYXJnZXRzICh0eXBlLCBhcnJheSkge1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnQuX2J1YmJsaW5nTGlzdGVuZXJzICYmIHBhcmVudC5fYnViYmxpbmdMaXN0ZW5lcnMuaGFzRXZlbnRMaXN0ZW5lcih0eXBlKSkge1xuICAgICAgICAgICAgICAgIGFycmF5LnB1c2gocGFyZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4vLyBBQ1RJT05TXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEV4ZWN1dGVzIGFuIGFjdGlvbiwgYW5kIHJldHVybnMgdGhlIGFjdGlvbiB0aGF0IGlzIGV4ZWN1dGVkLjxici8+XG4gICAgICogVGhlIG5vZGUgYmVjb21lcyB0aGUgYWN0aW9uJ3MgdGFyZ2V0LiBSZWZlciB0byBjYy5BY3Rpb24ncyBnZXRUYXJnZXQoKSA8YnIvPlxuICAgICAqIENhbGxpbmcgcnVuQWN0aW9uIHdoaWxlIHRoZSBub2RlIGlzIG5vdCBhY3RpdmUgd29uJ3QgaGF2ZSBhbnkgZWZmZWN0LiA8YnIvPlxuICAgICAqIE5vdGXvvJpZb3Ugc2hvdWxkbid0IG1vZGlmeSB0aGUgYWN0aW9uIGFmdGVyIHJ1bkFjdGlvbiwgdGhhdCB3b24ndCB0YWtlIGFueSBlZmZlY3QuPGJyLz5cbiAgICAgKiBpZiB5b3Ugd2FudCB0byBtb2RpZnksIHdoZW4geW91IGRlZmluZSBhY3Rpb24gcGx1cy5cbiAgICAgKiAhI3poXG4gICAgICog5omn6KGM5bm26L+U5Zue6K+l5omn6KGM55qE5Yqo5L2c44CC6K+l6IqC54K55bCG5Lya5Y+Y5oiQ5Yqo5L2c55qE55uu5qCH44CCPGJyLz5cbiAgICAgKiDosIPnlKggcnVuQWN0aW9uIOaXtu+8jOiKgueCueiHqui6q+WkhOS6juS4jea/gOa0u+eKtuaAgeWwhuS4jeS8muacieS7u+S9leaViOaenOOAgjxici8+XG4gICAgICog5rOo5oSP77ya5L2g5LiN5bqU6K+l5L+u5pS5IHJ1bkFjdGlvbiDlkI7nmoTliqjkvZzvvIzlsIbml6Dms5Xlj5HmjKXkvZznlKjvvIzlpoLmnpzmg7Pov5vooYzkv67mlLnvvIzor7flnKjlrprkuYkgYWN0aW9uIOaXtuWKoOWFpeOAglxuICAgICAqIEBtZXRob2QgcnVuQWN0aW9uXG4gICAgICogQHBhcmFtIHtBY3Rpb259IGFjdGlvblxuICAgICAqIEByZXR1cm4ge0FjdGlvbn0gQW4gQWN0aW9uIHBvaW50ZXJcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhY3Rpb24gPSBjYy5zY2FsZVRvKDAuMiwgMSwgMC42KTtcbiAgICAgKiBub2RlLnJ1bkFjdGlvbihhY3Rpb24pO1xuICAgICAqIG5vZGUucnVuQWN0aW9uKGFjdGlvbikucmVwZWF0Rm9yZXZlcigpOyAvLyBmYWlsXG4gICAgICogbm9kZS5ydW5BY3Rpb24oYWN0aW9uLnJlcGVhdEZvcmV2ZXIoKSk7IC8vIHJpZ2h0XG4gICAgICovXG4gICAgcnVuQWN0aW9uOiBBY3Rpb25NYW5hZ2VyRXhpc3QgPyBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIGlmICghdGhpcy5hY3RpdmUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNjLmFzc2VydElEKGFjdGlvbiwgMTYxOCk7XG4gICAgICAgIGxldCBhbSA9IGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKTtcbiAgICAgICAgaWYgKCFhbS5fc3VwcHJlc3NEZXByZWNhdGlvbikge1xuICAgICAgICAgICAgYW0uX3N1cHByZXNzRGVwcmVjYXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgY2Mud2FybklEKDE2MzkpO1xuICAgICAgICB9XG4gICAgICAgIGFtLmFkZEFjdGlvbihhY3Rpb24sIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcbiAgICB9IDogZW1wdHlGdW5jLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBQYXVzZSBhbGwgYWN0aW9ucyBydW5uaW5nIG9uIHRoZSBjdXJyZW50IG5vZGUuIEVxdWFscyB0byBgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnBhdXNlVGFyZ2V0KG5vZGUpYC5cbiAgICAgKiAhI3poIOaaguWBnOacrOiKgueCueS4iuaJgOacieato+WcqOi/kOihjOeahOWKqOS9nOOAguWSjCBgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnBhdXNlVGFyZ2V0KG5vZGUpO2Ag562J5Lu344CCXG4gICAgICogQG1ldGhvZCBwYXVzZUFsbEFjdGlvbnNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUucGF1c2VBbGxBY3Rpb25zKCk7XG4gICAgICovXG4gICAgcGF1c2VBbGxBY3Rpb25zOiBBY3Rpb25NYW5hZ2VyRXhpc3QgPyBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5wYXVzZVRhcmdldCh0aGlzKTtcbiAgICB9IDogZW1wdHlGdW5jLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN1bWUgYWxsIHBhdXNlZCBhY3Rpb25zIG9uIHRoZSBjdXJyZW50IG5vZGUuIEVxdWFscyB0byBgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnJlc3VtZVRhcmdldChub2RlKWAuXG4gICAgICogISN6aCDmgaLlpI3ov5DooYzmnKzoioLngrnkuIrmiYDmnInmmoLlgZznmoTliqjkvZzjgILlkowgYGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5yZXN1bWVUYXJnZXQobm9kZSk7YCDnrYnku7fjgIJcbiAgICAgKiBAbWV0aG9kIHJlc3VtZUFsbEFjdGlvbnNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUucmVzdW1lQWxsQWN0aW9ucygpO1xuICAgICAqL1xuICAgIHJlc3VtZUFsbEFjdGlvbnM6IEFjdGlvbk1hbmFnZXJFeGlzdCA/IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnJlc3VtZVRhcmdldCh0aGlzKTtcbiAgICB9IDogZW1wdHlGdW5jLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTdG9wcyBhbmQgcmVtb3ZlcyBhbGwgYWN0aW9ucyBmcm9tIHRoZSBydW5uaW5nIGFjdGlvbiBsaXN0IC5cbiAgICAgKiAhI3poIOWBnOatouW5tuS4lOenu+mZpOaJgOacieato+WcqOi/kOihjOeahOWKqOS9nOWIl+ihqOOAglxuICAgICAqIEBtZXRob2Qgc3RvcEFsbEFjdGlvbnNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICAgKi9cbiAgICBzdG9wQWxsQWN0aW9uczogQWN0aW9uTWFuYWdlckV4aXN0ID8gZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRBY3Rpb25NYW5hZ2VyKCkucmVtb3ZlQWxsQWN0aW9uc0Zyb21UYXJnZXQodGhpcyk7XG4gICAgfSA6IGVtcHR5RnVuYyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU3RvcHMgYW5kIHJlbW92ZXMgYW4gYWN0aW9uIGZyb20gdGhlIHJ1bm5pbmcgYWN0aW9uIGxpc3QuXG4gICAgICogISN6aCDlgZzmraLlubbnp7vpmaTmjIflrprnmoTliqjkvZzjgIJcbiAgICAgKiBAbWV0aG9kIHN0b3BBY3Rpb25cbiAgICAgKiBAcGFyYW0ge0FjdGlvbn0gYWN0aW9uIEFuIGFjdGlvbiBvYmplY3QgdG8gYmUgcmVtb3ZlZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhY3Rpb24gPSBjYy5zY2FsZVRvKDAuMiwgMSwgMC42KTtcbiAgICAgKiBub2RlLnN0b3BBY3Rpb24oYWN0aW9uKTtcbiAgICAgKi9cbiAgICBzdG9wQWN0aW9uOiBBY3Rpb25NYW5hZ2VyRXhpc3QgPyBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5yZW1vdmVBY3Rpb24oYWN0aW9uKTtcbiAgICB9IDogZW1wdHlGdW5jLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZW1vdmVzIGFuIGFjdGlvbiBmcm9tIHRoZSBydW5uaW5nIGFjdGlvbiBsaXN0IGJ5IGl0cyB0YWcuXG4gICAgICogISN6aCDlgZzmraLlubbkuJTnp7vpmaTmjIflrprmoIfnrb7nmoTliqjkvZzjgIJcbiAgICAgKiBAbWV0aG9kIHN0b3BBY3Rpb25CeVRhZ1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0YWcgQSB0YWcgdGhhdCBpbmRpY2F0ZXMgdGhlIGFjdGlvbiB0byBiZSByZW1vdmVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5zdG9wQWN0aW9uQnlUYWcoMSk7XG4gICAgICovXG4gICAgc3RvcEFjdGlvbkJ5VGFnOiBBY3Rpb25NYW5hZ2VyRXhpc3QgPyBmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgIGlmICh0YWcgPT09IGNjLkFjdGlvbi5UQUdfSU5WQUxJRCkge1xuICAgICAgICAgICAgY2MubG9nSUQoMTYxMik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnJlbW92ZUFjdGlvbkJ5VGFnKHRhZywgdGhpcyk7XG4gICAgfSA6IGVtcHR5RnVuYyxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyBhbiBhY3Rpb24gZnJvbSB0aGUgcnVubmluZyBhY3Rpb24gbGlzdCBieSBpdHMgdGFnLlxuICAgICAqICEjemgg6YCa6L+H5qCH562+6I635Y+W5oyH5a6a5Yqo5L2c44CCXG4gICAgICogQG1ldGhvZCBnZXRBY3Rpb25CeVRhZ1xuICAgICAqIEBzZWUgY2MuQWN0aW9uI2dldFRhZyBhbmQgY2MuQWN0aW9uI3NldFRhZ1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0YWdcbiAgICAgKiBAcmV0dXJuIHtBY3Rpb259IFRoZSBhY3Rpb24gb2JqZWN0IHdpdGggdGhlIGdpdmVuIHRhZy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBhY3Rpb24gPSBub2RlLmdldEFjdGlvbkJ5VGFnKDEpO1xuICAgICAqL1xuICAgIGdldEFjdGlvbkJ5VGFnOiBBY3Rpb25NYW5hZ2VyRXhpc3QgPyBmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgIGlmICh0YWcgPT09IGNjLkFjdGlvbi5UQUdfSU5WQUxJRCkge1xuICAgICAgICAgICAgY2MubG9nSUQoMTYxMyk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLmdldEFjdGlvbkJ5VGFnKHRhZywgdGhpcyk7XG4gICAgfSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXJzIG9mIGFjdGlvbnMgdGhhdCBhcmUgcnVubmluZyBwbHVzIHRoZSBvbmVzIHRoYXQgYXJlIHNjaGVkdWxlIHRvIHJ1biAoYWN0aW9ucyBpbiBhY3Rpb25zVG9BZGQgYW5kIGFjdGlvbnMgYXJyYXlzKS48YnIvPlxuICAgICAqICAgIENvbXBvc2FibGUgYWN0aW9ucyBhcmUgY291bnRlZCBhcyAxIGFjdGlvbi4gRXhhbXBsZTo8YnIvPlxuICAgICAqICAgIElmIHlvdSBhcmUgcnVubmluZyAxIFNlcXVlbmNlIG9mIDcgYWN0aW9ucywgaXQgd2lsbCByZXR1cm4gMS4gPGJyLz5cbiAgICAgKiAgICBJZiB5b3UgYXJlIHJ1bm5pbmcgNyBTZXF1ZW5jZXMgb2YgMiBhY3Rpb25zLCBpdCB3aWxsIHJldHVybiA3LjwvcD5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W6L+Q6KGM552A55qE5Yqo5L2c5Yqg5LiK5q2j5Zyo6LCD5bqm6L+Q6KGM55qE5Yqo5L2c55qE5oC75pWw44CCPGJyLz5cbiAgICAgKiDkvovlpoLvvJo8YnIvPlxuICAgICAqIC0g5aaC5p6c5L2g5q2j5Zyo6L+Q6KGMIDcg5Liq5Yqo5L2c5Lit55qEIDEg5LiqIFNlcXVlbmNl77yM5a6D5bCG6L+U5ZueIDHjgII8YnIvPlxuICAgICAqIC0g5aaC5p6c5L2g5q2j5Zyo6L+Q6KGMIDIg5Liq5Yqo5L2c5Lit55qEIDcg5LiqIFNlcXVlbmNl77yM5a6D5bCG6L+U5ZueIDfjgII8YnIvPlxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXROdW1iZXJPZlJ1bm5pbmdBY3Rpb25zXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgbnVtYmVyIG9mIGFjdGlvbnMgdGhhdCBhcmUgcnVubmluZyBwbHVzIHRoZSBvbmVzIHRoYXQgYXJlIHNjaGVkdWxlIHRvIHJ1blxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIGNvdW50ID0gbm9kZS5nZXROdW1iZXJPZlJ1bm5pbmdBY3Rpb25zKCk7XG4gICAgICogY2MubG9nKFwiUnVubmluZyBBY3Rpb24gQ291bnQ6IFwiICsgY291bnQpO1xuICAgICAqL1xuICAgIGdldE51bWJlck9mUnVubmluZ0FjdGlvbnM6IEFjdGlvbk1hbmFnZXJFeGlzdCA/IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLmRpcmVjdG9yLmdldEFjdGlvbk1hbmFnZXIoKS5nZXROdW1iZXJPZlJ1bm5pbmdBY3Rpb25zSW5UYXJnZXQodGhpcyk7XG4gICAgfSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfSxcblxuXG4vLyBUUkFOU0ZPUk0gUkVMQVRFRFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGUgcG9zaXRpb24gKHgsIHksIHopIG9mIHRoZSBub2RlIGluIGl0cyBwYXJlbnQncyBjb29yZGluYXRlcy5cbiAgICAgKiBZb3UgY2FuIHBhc3MgYSBjYy5WZWMyIG9yIGNjLlZlYzMgYXMgdGhlIGFyZ3VtZW50IHRvIHJlY2VpdmUgdGhlIHJldHVybiB2YWx1ZXMuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluiKgueCueWcqOeItuiKgueCueWdkOagh+ezu+S4reeahOS9jee9ru+8iHgsIHksIHrvvInjgIJcbiAgICAgKiDkvaDlj6/ku6XkvKDkuIDkuKogY2MuVmVjMiDmiJbogIUgY2MuVmVjMyDkvZzkuLrlj4LmlbDmnaXmjqXmlLbov5Tlm57lgLzjgIJcbiAgICAgKiBAbWV0aG9kIGdldFBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtWZWMyfFZlYzN9IFtvdXRdIC0gVGhlIHJldHVybiB2YWx1ZSB0byByZWNlaXZlIHBvc2l0aW9uXG4gICAgICogQHJldHVybiB7VmVjMnxWZWMzfSBUaGUgcG9zaXRpb24gKHgsIHksIHopIG9mIHRoZSBub2RlIGluIGl0cyBwYXJlbnQncyBjb29yZGluYXRlc1xuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MubG9nKFwiTm9kZSBQb3NpdGlvbjogXCIgKyBub2RlLmdldFBvc2l0aW9uKCkpO1xuICAgICAqL1xuICAgIGdldFBvc2l0aW9uIChvdXQpIHtcbiAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBWZWMzKCk7XG4gICAgICAgIHJldHVybiBUcnMudG9Qb3NpdGlvbihvdXQsIHRoaXMuX3Rycyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXRzIHRoZSBwb3NpdGlvbiAoeCwgeSwgeikgb2YgdGhlIG5vZGUgaW4gaXRzIHBhcmVudCdzIGNvb3JkaW5hdGVzLjxici8+XG4gICAgICogVXN1YWxseSB3ZSB1c2UgY2MudjIoeCwgeSkgdG8gY29tcG9zZSBjYy5WZWMyIG9iamVjdCw8YnIvPlxuICAgICAqIGFuZCBwYXNzaW5nIHR3byBudW1iZXJzICh4LCB5KSBpcyBtb3JlIGVmZmljaWVudCB0aGFuIHBhc3NpbmcgY2MuVmVjMiBvYmplY3QuXG4gICAgICogRm9yIDNEIG5vZGUgd2UgY2FuIHVzZSBjYy52Myh4LCB5LCB6KSB0byBjb21wb3NlIGNjLlZlYzMgb2JqZWN0LDxici8+XG4gICAgICogYW5kIHBhc3NpbmcgdGhyZWUgbnVtYmVycyAoeCwgeSwgeikgaXMgbW9yZSBlZmZpY2llbnQgdGhhbiBwYXNzaW5nIGNjLlZlYzMgb2JqZWN0LlxuICAgICAqICEjemhcbiAgICAgKiDorr7nva7oioLngrnlnKjniLboioLngrnlnZDmoIfns7vkuK3nmoTkvY3nva7jgII8YnIvPlxuICAgICAqIOWPr+S7pemAmui/h+S4i+mdoueahOaWueW8j+iuvue9ruWdkOagh+eCue+8mjxici8+XG4gICAgICogMS4g5Lyg5YWlIDIg5Liq5pWw5YC8IHgsIHnjgII8YnIvPlxuICAgICAqIDIuIOS8oOWFpSBjYy52Mih4LCB5KSDnsbvlnovkuLogY2MuVmVjMiDnmoTlr7nosaHjgIJcbiAgICAgKiAzLiDlr7nkuo4gM0Qg6IqC54K55Y+v5Lul5Lyg5YWlIDMg5Liq5pWw5YC8IHgsIHksIHrjgII8YnIvPlxuICAgICAqIDQuIOWvueS6jiAzRCDoioLngrnlj6/ku6XkvKDlhaUgY2MudjMoeCwgeSwgeikg57G75Z6L5Li6IGNjLlZlYzMg55qE5a+56LGh44CCXG4gICAgICogQG1ldGhvZCBzZXRQb3NpdGlvblxuICAgICAqIEBwYXJhbSB7VmVjMnxWZWMzfE51bWJlcn0gbmV3UG9zT3JYIC0gWCBjb29yZGluYXRlIGZvciBwb3NpdGlvbiBvciB0aGUgcG9zaXRpb24gKHgsIHksIHopIG9mIHRoZSBub2RlIGluIGNvb3JkaW5hdGVzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt5XSAtIFkgY29vcmRpbmF0ZSBmb3IgcG9zaXRpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3pdIC0gWiBjb29yZGluYXRlIGZvciBwb3NpdGlvblxuICAgICAqL1xuICAgIHNldFBvc2l0aW9uIChuZXdQb3NPclgsIHksIHopIHtcbiAgICAgICAgbGV0IHg7XG4gICAgICAgIGlmICh5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHggPSBuZXdQb3NPclgueDtcbiAgICAgICAgICAgIHkgPSBuZXdQb3NPclgueTtcbiAgICAgICAgICAgIHogPSBuZXdQb3NPclgueiB8fCAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeCA9IG5ld1Bvc09yWDtcbiAgICAgICAgICAgIHogPSB6IHx8IDBcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBsZXQgdHJzID0gdGhpcy5fdHJzO1xuICAgICAgICBpZiAodHJzWzBdID09PSB4ICYmIHRyc1sxXSA9PT0geSAmJiB0cnNbMl0gPT09IHopIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB2YXIgb2xkUG9zaXRpb24gPSBuZXcgY2MuVmVjMyh0cnNbMF0sIHRyc1sxXSwgdHJzWzJdKTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICB0cnNbMF0gPSB4O1xuICAgICAgICB0cnNbMV0gPSB5O1xuICAgICAgICB0cnNbMl0gPSB6O1xuICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1BPU0lUSU9OKTtcbiAgICAgICAgIUNDX05BVElWRVJFTkRFUkVSICYmICh0aGlzLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19XT1JMRF9UUkFOU0ZPUk0pO1xuICAgIFxuICAgICAgICAvLyBmYXN0IGNoZWNrIGV2ZW50XG4gICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBQT1NJVElPTl9PTikge1xuICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCwgb2xkUG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgc2NhbGUgZmFjdG9yIG9mIHRoZSBub2RlLlxuICAgICAqIE5lZWQgcGFzcyBhIGNjLlZlYzIgb3IgY2MuVmVjMyBhcyB0aGUgYXJndW1lbnQgdG8gcmVjZWl2ZSB0aGUgcmV0dXJuIHZhbHVlcy5cbiAgICAgKiAhI3poIOiOt+WPluiKgueCueeahOe8qeaUvu+8jOmcgOimgeS8oOS4gOS4qiBjYy5WZWMyIOaIluiAhSBjYy5WZWMzIOS9nOS4uuWPguaVsOadpeaOpeaUtui/lOWbnuWAvOOAglxuICAgICAqIEBtZXRob2QgZ2V0U2NhbGVcbiAgICAgKiBAcGFyYW0ge1ZlYzJ8VmVjM30gb3V0XG4gICAgICogQHJldHVybiB7VmVjMnxWZWMzfSBUaGUgc2NhbGUgZmFjdG9yXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5sb2coXCJOb2RlIFNjYWxlOiBcIiArIG5vZGUuZ2V0U2NhbGUoY2MudjMoKSkpO1xuICAgICAqL1xuICAgIGdldFNjYWxlIChvdXQpIHtcbiAgICAgICAgaWYgKG91dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gVHJzLnRvU2NhbGUob3V0LCB0aGlzLl90cnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2Mud2FybklEKDE0MDAsICdjYy5Ob2RlLmdldFNjYWxlJywgJ2NjLk5vZGUuc2NhbGUgb3IgY2MuTm9kZS5nZXRTY2FsZShjYy5WZWMzKScpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Ryc1s3XTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgc2NhbGUgb2YgYXhpcyBpbiBsb2NhbCBjb29yZGluYXRlcyBvZiB0aGUgbm9kZS5cbiAgICAgKiBZb3UgY2FuIG9wZXJhdGUgMiBheGlzIGluIDJEIG5vZGUsIGFuZCAzIGF4aXMgaW4gM0Qgbm9kZS5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572u6IqC54K55Zyo5pys5Zyw5Z2Q5qCH57O75Lit5Z2Q5qCH6L205LiK55qE57yp5pS+5q+U5L6L44CCXG4gICAgICogMkQg6IqC54K55Y+v5Lul5pON5L2c5Lik5Liq5Z2Q5qCH6L2077yM6ICMIDNEIOiKgueCueWPr+S7peaTjeS9nOS4ieS4quWdkOagh+i9tOOAglxuICAgICAqIEBtZXRob2Qgc2V0U2NhbGVcbiAgICAgKiBAcGFyYW0ge051bWJlcnxWZWMyfFZlYzN9IHggLSBzY2FsZVggb3Igc2NhbGUgb2JqZWN0XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt5XVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbel1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUuc2V0U2NhbGUoY2MudjIoMiwgMikpO1xuICAgICAqIG5vZGUuc2V0U2NhbGUoY2MudjMoMiwgMiwgMikpOyAvLyBmb3IgM0Qgbm9kZVxuICAgICAqIG5vZGUuc2V0U2NhbGUoMik7XG4gICAgICovXG4gICAgc2V0U2NhbGUgKHgsIHksIHopIHtcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB5ID0geC55O1xuICAgICAgICAgICAgeiA9IHgueiA9PT0gdW5kZWZpbmVkID8gMSA6IHguejtcbiAgICAgICAgICAgIHggPSB4Lng7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoeCAhPT0gdW5kZWZpbmVkICYmIHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgeSA9IHg7XG4gICAgICAgICAgICB6ID0geDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh6ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHogPSAxO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0cnMgPSB0aGlzLl90cnM7XG4gICAgICAgIGlmICh0cnNbN10gIT09IHggfHwgdHJzWzhdICE9PSB5IHx8IHRyc1s5XSAhPT0geikge1xuICAgICAgICAgICAgdHJzWzddID0geDtcbiAgICAgICAgICAgIHRyc1s4XSA9IHk7XG4gICAgICAgICAgICB0cnNbOV0gPSB6O1xuICAgICAgICAgICAgdGhpcy5zZXRMb2NhbERpcnR5KExvY2FsRGlydHlGbGFnLkFMTF9TQ0FMRSk7XG4gICAgICAgICAgICAhQ0NfTkFUSVZFUkVOREVSRVIgJiYgKHRoaXMuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1RSQU5TRk9STSk7XG4gICAgXG4gICAgICAgICAgICBpZiAodGhpcy5fZXZlbnRNYXNrICYgU0NBTEVfT04pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlNDQUxFX0NIQU5HRUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgcm90YXRpb24gb2Ygbm9kZSAoaW4gcXVhdGVybmlvbikuXG4gICAgICogTmVlZCBwYXNzIGEgY2MuUXVhdCBhcyB0aGUgYXJndW1lbnQgdG8gcmVjZWl2ZSB0aGUgcmV0dXJuIHZhbHVlcy5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W6K+l6IqC54K555qEIHF1YXRlcm5pb24g5peL6L2s6KeS5bqm77yM6ZyA6KaB5Lyg5LiA5LiqIGNjLlF1YXQg5L2c5Li65Y+C5pWw5p2l5o6l5pS26L+U5Zue5YC844CCXG4gICAgICogQG1ldGhvZCBnZXRSb3RhdGlvblxuICAgICAqIEBwYXJhbSB7UXVhdH0gb3V0XG4gICAgICogQHJldHVybiB7UXVhdH0gUXVhdGVybmlvbiBvYmplY3QgcmVwcmVzZW50cyB0aGUgcm90YXRpb25cbiAgICAgKi9cbiAgICBnZXRSb3RhdGlvbiAob3V0KSB7XG4gICAgICAgIGlmIChvdXQgaW5zdGFuY2VvZiBRdWF0KSB7XG4gICAgICAgICAgICByZXR1cm4gVHJzLnRvUm90YXRpb24ob3V0LCB0aGlzLl90cnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybihcImBjYy5Ob2RlLmdldFJvdGF0aW9uKClgIGlzIGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4wLCBwbGVhc2UgdXNlIGAtY2MuTm9kZS5hbmdsZWAgaW5zdGVhZC4gKGB0aGlzLm5vZGUuZ2V0Um90YXRpb24oKWAgLT4gYC10aGlzLm5vZGUuYW5nbGVgKVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtdGhpcy5hbmdsZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCByb3RhdGlvbiBvZiBub2RlIChpbiBxdWF0ZXJuaW9uKS5cbiAgICAgKiAhI3poIOiuvue9ruivpeiKgueCueeahCBxdWF0ZXJuaW9uIOaXi+i9rOinkuW6puOAglxuICAgICAqIEBtZXRob2Qgc2V0Um90YXRpb25cbiAgICAgKiBAcGFyYW0ge2NjLlF1YXR8TnVtYmVyfSBxdWF0IFF1YXRlcm5pb24gb2JqZWN0IHJlcHJlc2VudHMgdGhlIHJvdGF0aW9uIG9yIHRoZSB4IHZhbHVlIG9mIHF1YXRlcm5pb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ldIHkgdmFsdWUgb2YgcXV0ZXJuaW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IFt6XSB6IHZhbHVlIG9mIHF1dGVybmlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbd10gdyB2YWx1ZSBvZiBxdXRlcm5pb25cbiAgICAgKi9cbiAgICBzZXRSb3RhdGlvbiAocm90YXRpb24sIHksIHosIHcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByb3RhdGlvbiA9PT0gJ251bWJlcicgJiYgeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoQ0NfREVCVUcpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKFwiYGNjLk5vZGUuc2V0Um90YXRpb24oZGVncmVlKWAgaXMgZGVwcmVjYXRlZCBzaW5jZSB2Mi4xLjAsIHBsZWFzZSBzZXQgYC1jYy5Ob2RlLmFuZ2xlYCBpbnN0ZWFkLiAoYHRoaXMubm9kZS5zZXRSb3RhdGlvbih4KWAgLT4gYHRoaXMubm9kZS5hbmdsZSA9IC14YClcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFuZ2xlID0gLXJvdGF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHggPSByb3RhdGlvbjtcbiAgICAgICAgICAgIGlmICh5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB4ID0gcm90YXRpb24ueDtcbiAgICAgICAgICAgICAgICB5ID0gcm90YXRpb24ueTtcbiAgICAgICAgICAgICAgICB6ID0gcm90YXRpb24uejtcbiAgICAgICAgICAgICAgICB3ID0gcm90YXRpb24udztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHRycyA9IHRoaXMuX3RycztcbiAgICAgICAgICAgIGlmICh0cnNbM10gIT09IHggfHwgdHJzWzRdICE9PSB5IHx8IHRyc1s1XSAhPT0geiB8fCB0cnNbNl0gIT09IHcpIHtcbiAgICAgICAgICAgICAgICB0cnNbM10gPSB4O1xuICAgICAgICAgICAgICAgIHRyc1s0XSA9IHk7XG4gICAgICAgICAgICAgICAgdHJzWzVdID0gejtcbiAgICAgICAgICAgICAgICB0cnNbNl0gPSB3O1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxEaXJ0eShMb2NhbERpcnR5RmxhZy5BTExfUk9UQVRJT04pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFJPVEFUSU9OX09OKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUk9UQVRJT05fQ0hBTkdFRCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl90b0V1bGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIGEgY29weSB0aGUgdW50cmFuc2Zvcm1lZCBzaXplIG9mIHRoZSBub2RlLiA8YnIvPlxuICAgICAqIFRoZSBjb250ZW50U2l6ZSByZW1haW5zIHRoZSBzYW1lIG5vIG1hdHRlciB0aGUgbm9kZSBpcyBzY2FsZWQgb3Igcm90YXRlZC48YnIvPlxuICAgICAqIEFsbCBub2RlcyBoYXMgYSBzaXplLiBMYXllciBhbmQgU2NlbmUgaGFzIHRoZSBzYW1lIHNpemUgb2YgdGhlIHNjcmVlbiBieSBkZWZhdWx0LiA8YnIvPlxuICAgICAqICEjemgg6I635Y+W6IqC54K56Ieq6Lqr5aSn5bCP77yM5LiN5Y+X6K+l6IqC54K55piv5ZCm6KKr57yp5pS+5oiW6ICF5peL6L2s55qE5b2x5ZON44CCXG4gICAgICogQG1ldGhvZCBnZXRDb250ZW50U2l6ZVxuICAgICAqIEByZXR1cm4ge1NpemV9IFRoZSB1bnRyYW5zZm9ybWVkIHNpemUgb2YgdGhlIG5vZGUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5sb2coXCJDb250ZW50IFNpemU6IFwiICsgbm9kZS5nZXRDb250ZW50U2l6ZSgpKTtcbiAgICAgKi9cbiAgICBnZXRDb250ZW50U2l6ZSAoKSB7XG4gICAgICAgIHJldHVybiBjYy5zaXplKHRoaXMuX2NvbnRlbnRTaXplLndpZHRoLCB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgdW50cmFuc2Zvcm1lZCBzaXplIG9mIHRoZSBub2RlLjxici8+XG4gICAgICogVGhlIGNvbnRlbnRTaXplIHJlbWFpbnMgdGhlIHNhbWUgbm8gbWF0dGVyIHRoZSBub2RlIGlzIHNjYWxlZCBvciByb3RhdGVkLjxici8+XG4gICAgICogQWxsIG5vZGVzIGhhcyBhIHNpemUuIExheWVyIGFuZCBTY2VuZSBoYXMgdGhlIHNhbWUgc2l6ZSBvZiB0aGUgc2NyZWVuLlxuICAgICAqICEjemgg6K6+572u6IqC54K55Y6f5aeL5aSn5bCP77yM5LiN5Y+X6K+l6IqC54K55piv5ZCm6KKr57yp5pS+5oiW6ICF5peL6L2s55qE5b2x5ZON44CCXG4gICAgICogQG1ldGhvZCBzZXRDb250ZW50U2l6ZVxuICAgICAqIEBwYXJhbSB7U2l6ZXxOdW1iZXJ9IHNpemUgLSBUaGUgdW50cmFuc2Zvcm1lZCBzaXplIG9mIHRoZSBub2RlIG9yIFRoZSB1bnRyYW5zZm9ybWVkIHNpemUncyB3aWR0aCBvZiB0aGUgbm9kZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2hlaWdodF0gLSBUaGUgdW50cmFuc2Zvcm1lZCBzaXplJ3MgaGVpZ2h0IG9mIHRoZSBub2RlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICogbm9kZS5zZXRDb250ZW50U2l6ZShjYy5zaXplKDEwMCwgMTAwKSk7XG4gICAgICogbm9kZS5zZXRDb250ZW50U2l6ZSgxMDAsIDEwMCk7XG4gICAgICovXG4gICAgc2V0Q29udGVudFNpemUgKHNpemUsIGhlaWdodCkge1xuICAgICAgICB2YXIgbG9jQ29udGVudFNpemUgPSB0aGlzLl9jb250ZW50U2l6ZTtcbiAgICAgICAgdmFyIGNsb25lO1xuICAgICAgICBpZiAoaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICgoc2l6ZS53aWR0aCA9PT0gbG9jQ29udGVudFNpemUud2lkdGgpICYmIChzaXplLmhlaWdodCA9PT0gbG9jQ29udGVudFNpemUuaGVpZ2h0KSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgY2xvbmUgPSBjYy5zaXplKGxvY0NvbnRlbnRTaXplLndpZHRoLCBsb2NDb250ZW50U2l6ZS5oZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jQ29udGVudFNpemUud2lkdGggPSBzaXplLndpZHRoO1xuICAgICAgICAgICAgbG9jQ29udGVudFNpemUuaGVpZ2h0ID0gc2l6ZS5oZWlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoKHNpemUgPT09IGxvY0NvbnRlbnRTaXplLndpZHRoKSAmJiAoaGVpZ2h0ID09PSBsb2NDb250ZW50U2l6ZS5oZWlnaHQpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICBjbG9uZSA9IGNjLnNpemUobG9jQ29udGVudFNpemUud2lkdGgsIGxvY0NvbnRlbnRTaXplLmhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2NDb250ZW50U2l6ZS53aWR0aCA9IHNpemU7XG4gICAgICAgICAgICBsb2NDb250ZW50U2l6ZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFNJWkVfT04pIHtcbiAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgY2xvbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5TSVpFX0NIQU5HRUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGUgYW5jaG9yIHBvaW50Ljxici8+XG4gICAgICogQW5jaG9yIHBvaW50IGlzIHRoZSBwb2ludCBhcm91bmQgd2hpY2ggYWxsIHRyYW5zZm9ybWF0aW9ucyBhbmQgcG9zaXRpb25pbmcgbWFuaXB1bGF0aW9ucyB0YWtlIHBsYWNlLjxici8+XG4gICAgICogSXQncyBsaWtlIGEgcGluIGluIHRoZSBub2RlIHdoZXJlIGl0IGlzIFwiYXR0YWNoZWRcIiB0byBpdHMgcGFyZW50LiA8YnIvPlxuICAgICAqIFRoZSBhbmNob3JQb2ludCBpcyBub3JtYWxpemVkLCBsaWtlIGEgcGVyY2VudGFnZS4gKDAsMCkgbWVhbnMgdGhlIGJvdHRvbS1sZWZ0IGNvcm5lciBhbmQgKDEsMSkgbWVhbnMgdGhlIHRvcC1yaWdodCBjb3JuZXIuIDxici8+XG4gICAgICogQnV0IHlvdSBjYW4gdXNlIHZhbHVlcyBoaWdoZXIgdGhhbiAoMSwxKSBhbmQgbG93ZXIgdGhhbiAoMCwwKSB0b28uICA8YnIvPlxuICAgICAqIFRoZSBkZWZhdWx0IGFuY2hvciBwb2ludCBpcyAoMC41LDAuNSksIHNvIGl0IHN0YXJ0cyBhdCB0aGUgY2VudGVyIG9mIHRoZSBub2RlLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5boioLngrnplJrngrnvvIznlKjnmb7liIbmr5TooajnpLrjgII8YnIvPlxuICAgICAqIOmUmueCueW6lOeUqOS6juaJgOacieWPmOaNouWSjOWdkOagh+eCueeahOaTjeS9nO+8jOWug+WwseWDj+WcqOiKgueCueS4iui/nuaOpeWFtueItuiKgueCueeahOWkp+WktOmSiOOAgjxici8+XG4gICAgICog6ZSa54K55piv5qCH5YeG5YyW55qE77yM5bCx5YOP55m+5YiG5q+U5LiA5qC344CCKDDvvIwwKSDooajnpLrlt6bkuIvop5LvvIwoMe+8jDEpIOihqOekuuWPs+S4iuinkuOAgjxici8+XG4gICAgICog5L2G5piv5L2g5Y+v5Lul5L2/55So5q+U77yIMe+8jDHvvInmm7Tpq5jnmoTlgLzmiJbogIXmr5TvvIgw77yMMO+8ieabtOS9jueahOWAvOOAgjxici8+XG4gICAgICog6buY6K6k55qE6ZSa54K55piv77yIMC4177yMMC4177yJ77yM5Zug5q2k5a6D5byA5aeL5LqO6IqC54K555qE5Lit5b+D5L2N572u44CCPGJyLz5cbiAgICAgKiDms6jmhI/vvJpDcmVhdG9yIOS4reeahOmUmueCueS7heeUqOS6juWumuS9jeaJgOWcqOeahOiKgueCue+8jOWtkOiKgueCueeahOWumuS9jeS4jeWPl+W9seWTjeOAglxuICAgICAqIEBtZXRob2QgZ2V0QW5jaG9yUG9pbnRcbiAgICAgKiBAcmV0dXJuIHtWZWMyfSBUaGUgYW5jaG9yIHBvaW50IG9mIG5vZGUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBjYy5sb2coXCJOb2RlIEFuY2hvclBvaW50OiBcIiArIG5vZGUuZ2V0QW5jaG9yUG9pbnQoKSk7XG4gICAgICovXG4gICAgZ2V0QW5jaG9yUG9pbnQgKCkge1xuICAgICAgICByZXR1cm4gY2MudjIodGhpcy5fYW5jaG9yUG9pbnQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgYW5jaG9yIHBvaW50IGluIHBlcmNlbnQuIDxici8+XG4gICAgICogYW5jaG9yIHBvaW50IGlzIHRoZSBwb2ludCBhcm91bmQgd2hpY2ggYWxsIHRyYW5zZm9ybWF0aW9ucyBhbmQgcG9zaXRpb25pbmcgbWFuaXB1bGF0aW9ucyB0YWtlIHBsYWNlLiA8YnIvPlxuICAgICAqIEl0J3MgbGlrZSBhIHBpbiBpbiB0aGUgbm9kZSB3aGVyZSBpdCBpcyBcImF0dGFjaGVkXCIgdG8gaXRzIHBhcmVudC4gPGJyLz5cbiAgICAgKiBUaGUgYW5jaG9yUG9pbnQgaXMgbm9ybWFsaXplZCwgbGlrZSBhIHBlcmNlbnRhZ2UuICgwLDApIG1lYW5zIHRoZSBib3R0b20tbGVmdCBjb3JuZXIgYW5kICgxLDEpIG1lYW5zIHRoZSB0b3AtcmlnaHQgY29ybmVyLjxici8+XG4gICAgICogQnV0IHlvdSBjYW4gdXNlIHZhbHVlcyBoaWdoZXIgdGhhbiAoMSwxKSBhbmQgbG93ZXIgdGhhbiAoMCwwKSB0b28uPGJyLz5cbiAgICAgKiBUaGUgZGVmYXVsdCBhbmNob3IgcG9pbnQgaXMgKDAuNSwwLjUpLCBzbyBpdCBzdGFydHMgYXQgdGhlIGNlbnRlciBvZiB0aGUgbm9kZS5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572u6ZSa54K555qE55m+5YiG5q+U44CCPGJyLz5cbiAgICAgKiDplJrngrnlupTnlKjkuo7miYDmnInlj5jmjaLlkozlnZDmoIfngrnnmoTmk43kvZzvvIzlroPlsLHlg4/lnKjoioLngrnkuIrov57mjqXlhbbniLboioLngrnnmoTlpKflpLTpkojjgII8YnIvPlxuICAgICAqIOmUmueCueaYr+agh+WHhuWMlueahO+8jOWwseWDj+eZvuWIhuavlOS4gOagt+OAgigw77yMMCkg6KGo56S65bem5LiL6KeS77yMKDHvvIwxKSDooajnpLrlj7PkuIrop5LjgII8YnIvPlxuICAgICAqIOS9huaYr+S9oOWPr+S7peS9v+eUqOavlO+8iDHvvIwx77yJ5pu06auY55qE5YC85oiW6ICF5q+U77yIMO+8jDDvvInmm7TkvY7nmoTlgLzjgII8YnIvPlxuICAgICAqIOm7mOiupOeahOmUmueCueaYr++8iDAuNe+8jDAuNe+8ie+8jOWboOatpOWug+W8gOWni+S6juiKgueCueeahOS4reW/g+S9jee9ruOAgjxici8+XG4gICAgICog5rOo5oSP77yaQ3JlYXRvciDkuK3nmoTplJrngrnku4XnlKjkuo7lrprkvY3miYDlnKjnmoToioLngrnvvIzlrZDoioLngrnnmoTlrprkvY3kuI3lj5flvbHlk43jgIJcbiAgICAgKiBAbWV0aG9kIHNldEFuY2hvclBvaW50XG4gICAgICogQHBhcmFtIHtWZWMyfE51bWJlcn0gcG9pbnQgLSBUaGUgYW5jaG9yIHBvaW50IG9mIG5vZGUgb3IgVGhlIHggYXhpcyBhbmNob3Igb2Ygbm9kZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ldIC0gVGhlIHkgYXhpcyBhbmNob3Igb2Ygbm9kZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUuc2V0QW5jaG9yUG9pbnQoY2MudjIoMSwgMSkpO1xuICAgICAqIG5vZGUuc2V0QW5jaG9yUG9pbnQoMSwgMSk7XG4gICAgICovXG4gICAgc2V0QW5jaG9yUG9pbnQgKHBvaW50LCB5KSB7XG4gICAgICAgIHZhciBsb2NBbmNob3JQb2ludCA9IHRoaXMuX2FuY2hvclBvaW50O1xuICAgICAgICBpZiAoeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAoKHBvaW50LnggPT09IGxvY0FuY2hvclBvaW50LngpICYmIChwb2ludC55ID09PSBsb2NBbmNob3JQb2ludC55KSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBsb2NBbmNob3JQb2ludC54ID0gcG9pbnQueDtcbiAgICAgICAgICAgIGxvY0FuY2hvclBvaW50LnkgPSBwb2ludC55O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKChwb2ludCA9PT0gbG9jQW5jaG9yUG9pbnQueCkgJiYgKHkgPT09IGxvY0FuY2hvclBvaW50LnkpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGxvY0FuY2hvclBvaW50LnggPSBwb2ludDtcbiAgICAgICAgICAgIGxvY0FuY2hvclBvaW50LnkgPSB5O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0TG9jYWxEaXJ0eShMb2NhbERpcnR5RmxhZy5BTExfUE9TSVRJT04pO1xuICAgICAgICBpZiAodGhpcy5fZXZlbnRNYXNrICYgQU5DSE9SX09OKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXQoRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VEKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFRyYW5zZm9ybXMgcG9zaXRpb24gZnJvbSB3b3JsZCBzcGFjZSB0byBsb2NhbCBzcGFjZS5cbiAgICAgKiBAbWV0aG9kIF9pbnZUcmFuc2Zvcm1Qb2ludFxuICAgICAqIEBwYXJhbSB7VmVjM30gb3V0XG4gICAgICogQHBhcmFtIHtWZWMzfSB2ZWMzXG4gICAgICovXG4gICAgX2ludlRyYW5zZm9ybVBvaW50IChvdXQsIHBvcykge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuX2ludlRyYW5zZm9ybVBvaW50KG91dCwgcG9zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFZlYzMuY29weShvdXQsIHBvcyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbHRycyA9IHRoaXMuX3RycztcbiAgICAgICAgLy8gb3V0ID0gcGFyZW50X2ludl9wb3MgLSBwb3NcbiAgICAgICAgVHJzLnRvUG9zaXRpb24oX3RwVmVjM2EsIGx0cnMpO1xuICAgICAgICBWZWMzLnN1YihvdXQsIG91dCwgX3RwVmVjM2EpO1xuXG4gICAgICAgIC8vIG91dCA9IGludihyb3QpICogb3V0XG4gICAgICAgIFRycy50b1JvdGF0aW9uKF90cFF1YXRhLCBsdHJzKTtcbiAgICAgICAgUXVhdC5jb25qdWdhdGUoX3RwUXVhdGIsIF90cFF1YXRhKTtcbiAgICAgICAgVmVjMy50cmFuc2Zvcm1RdWF0KG91dCwgb3V0LCBfdHBRdWF0Yik7XG5cbiAgICAgICAgLy8gb3V0ID0gKDEvc2NhbGUpICogb3V0XG4gICAgICAgIFRycy50b1NjYWxlKF90cFZlYzNhLCBsdHJzKTtcbiAgICAgICAgVmVjMy5pbnZlcnNlU2FmZShfdHBWZWMzYiwgX3RwVmVjM2EpO1xuICAgICAgICBWZWMzLm11bChvdXQsIG91dCwgX3RwVmVjM2IpO1xuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcbiAgICBcbiAgICAvKlxuICAgICAqIENhbGN1bGF0ZSBhbmQgcmV0dXJuIHdvcmxkIHBvc2l0aW9uLlxuICAgICAqIFRoaXMgaXMgbm90IGEgcHVibGljIEFQSSB5ZXQsIGl0cyB1c2FnZSBjb3VsZCBiZSB1cGRhdGVkXG4gICAgICogQG1ldGhvZCBnZXRXb3JsZFBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtWZWMzfSBvdXRcbiAgICAgKiBAcmV0dXJuIHtWZWMzfVxuICAgICAqL1xuICAgIGdldFdvcmxkUG9zaXRpb24gKG91dCkge1xuICAgICAgICBUcnMudG9Qb3NpdGlvbihvdXQsIHRoaXMuX3Rycyk7XG4gICAgICAgIGxldCBjdXJyID0gdGhpcy5fcGFyZW50O1xuICAgICAgICBsZXQgbHRycztcbiAgICAgICAgd2hpbGUgKGN1cnIpIHtcbiAgICAgICAgICAgIGx0cnMgPSBjdXJyLl90cnM7XG4gICAgICAgICAgICAvLyBvdXQgPSBwYXJlbnRfc2NhbGUgKiBwb3NcbiAgICAgICAgICAgIFRycy50b1NjYWxlKF9nd3BWZWMzLCBsdHJzKTtcbiAgICAgICAgICAgIFZlYzMubXVsKG91dCwgb3V0LCBfZ3dwVmVjMyk7XG4gICAgICAgICAgICAvLyBvdXQgPSBwYXJlbnRfcXVhdCAqIG91dFxuICAgICAgICAgICAgVHJzLnRvUm90YXRpb24oX2d3cFF1YXQsIGx0cnMpO1xuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1RdWF0KG91dCwgb3V0LCBfZ3dwUXVhdCk7XG4gICAgICAgICAgICAvLyBvdXQgPSBvdXQgKyBwb3NcbiAgICAgICAgICAgIFRycy50b1Bvc2l0aW9uKF9nd3BWZWMzLCBsdHJzKTtcbiAgICAgICAgICAgIFZlYzMuYWRkKG91dCwgb3V0LCBfZ3dwVmVjMyk7XG4gICAgICAgICAgICBjdXJyID0gY3Vyci5fcGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogU2V0IHdvcmxkIHBvc2l0aW9uLlxuICAgICAqIFRoaXMgaXMgbm90IGEgcHVibGljIEFQSSB5ZXQsIGl0cyB1c2FnZSBjb3VsZCBiZSB1cGRhdGVkXG4gICAgICogQG1ldGhvZCBzZXRXb3JsZFBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtWZWMzfSBwb3NcbiAgICAgKi9cbiAgICBzZXRXb3JsZFBvc2l0aW9uIChwb3MpIHtcbiAgICAgICAgbGV0IGx0cnMgPSB0aGlzLl90cnM7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHZhciBvbGRQb3NpdGlvbiA9IG5ldyBjYy5WZWMzKGx0cnNbMF0sIGx0cnNbMV0sIGx0cnNbMl0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5PVEU6IHRoaXMgaXMgZmFzdGVyIHRoYW4gaW52ZXJ0IHdvcmxkIG1hdHJpeCBhbmQgdHJhbnNmb3JtIHRoZSBwb2ludFxuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuX2ludlRyYW5zZm9ybVBvaW50KF9zd3BWZWMzLCBwb3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgVmVjMy5jb3B5KF9zd3BWZWMzLCBwb3MpO1xuICAgICAgICB9XG4gICAgICAgIFRycy5mcm9tUG9zaXRpb24obHRycywgX3N3cFZlYzMpO1xuICAgICAgICB0aGlzLnNldExvY2FsRGlydHkoTG9jYWxEaXJ0eUZsYWcuQUxMX1BPU0lUSU9OKTtcblxuICAgICAgICAvLyBmYXN0IGNoZWNrIGV2ZW50XG4gICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBQT1NJVElPTl9PTikge1xuICAgICAgICAgICAgLy8gc2VuZCBldmVudFxuICAgICAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCwgb2xkUG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VEKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIENhbGN1bGF0ZSBhbmQgcmV0dXJuIHdvcmxkIHJvdGF0aW9uXG4gICAgICogVGhpcyBpcyBub3QgYSBwdWJsaWMgQVBJIHlldCwgaXRzIHVzYWdlIGNvdWxkIGJlIHVwZGF0ZWRcbiAgICAgKiBAbWV0aG9kIGdldFdvcmxkUm90YXRpb25cbiAgICAgKiBAcGFyYW0ge1F1YXR9IG91dFxuICAgICAqIEByZXR1cm4ge1F1YXR9XG4gICAgICovXG4gICAgZ2V0V29ybGRSb3RhdGlvbiAob3V0KSB7XG4gICAgICAgIFRycy50b1JvdGF0aW9uKF9nd3JRdWF0LCB0aGlzLl90cnMpO1xuICAgICAgICBRdWF0LmNvcHkob3V0LCBfZ3dyUXVhdCk7XG4gICAgICAgIGxldCBjdXJyID0gdGhpcy5fcGFyZW50O1xuICAgICAgICB3aGlsZSAoY3Vycikge1xuICAgICAgICAgICAgVHJzLnRvUm90YXRpb24oX2d3clF1YXQsIGN1cnIuX3Rycyk7XG4gICAgICAgICAgICBRdWF0Lm11bChvdXQsIF9nd3JRdWF0LCBvdXQpO1xuICAgICAgICAgICAgY3VyciA9IGN1cnIuX3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFNldCB3b3JsZCByb3RhdGlvbiB3aXRoIHF1YXRlcm5pb25cbiAgICAgKiBUaGlzIGlzIG5vdCBhIHB1YmxpYyBBUEkgeWV0LCBpdHMgdXNhZ2UgY291bGQgYmUgdXBkYXRlZFxuICAgICAqIEBtZXRob2Qgc2V0V29ybGRSb3RhdGlvblxuICAgICAqIEBwYXJhbSB7UXVhdH0gdmFsXG4gICAgICovXG4gICAgc2V0V29ybGRSb3RhdGlvbiAodmFsKSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5nZXRXb3JsZFJvdGF0aW9uKF9zd3JRdWF0KTtcbiAgICAgICAgICAgIFF1YXQuY29uanVnYXRlKF9zd3JRdWF0LCBfc3dyUXVhdCk7XG4gICAgICAgICAgICBRdWF0Lm11bChfc3dyUXVhdCwgX3N3clF1YXQsIHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBRdWF0LmNvcHkoX3N3clF1YXQsIHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgVHJzLmZyb21Sb3RhdGlvbih0aGlzLl90cnMsIF9zd3JRdWF0KTtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5fdG9FdWxlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0TG9jYWxEaXJ0eShMb2NhbERpcnR5RmxhZy5BTExfUk9UQVRJT04pO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIENhbGN1bGF0ZSBhbmQgcmV0dXJuIHdvcmxkIHNjYWxlXG4gICAgICogVGhpcyBpcyBub3QgYSBwdWJsaWMgQVBJIHlldCwgaXRzIHVzYWdlIGNvdWxkIGJlIHVwZGF0ZWRcbiAgICAgKiBAbWV0aG9kIGdldFdvcmxkU2NhbGVcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG91dFxuICAgICAqIEByZXR1cm4ge1ZlYzN9XG4gICAgICovXG4gICAgZ2V0V29ybGRTY2FsZSAob3V0KSB7XG4gICAgICAgIFRycy50b1NjYWxlKF9nd3NWZWMzLCB0aGlzLl90cnMpO1xuICAgICAgICBWZWMzLmNvcHkob3V0LCBfZ3dzVmVjMyk7XG4gICAgICAgIGxldCBjdXJyID0gdGhpcy5fcGFyZW50O1xuICAgICAgICB3aGlsZSAoY3Vycikge1xuICAgICAgICAgICAgVHJzLnRvU2NhbGUoX2d3c1ZlYzMsIGN1cnIuX3Rycyk7XG4gICAgICAgICAgICBWZWMzLm11bChvdXQsIG91dCwgX2d3c1ZlYzMpO1xuICAgICAgICAgICAgY3VyciA9IGN1cnIuX3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqIFNldCB3b3JsZCBzY2FsZSB3aXRoIHZlYzNcbiAgICAgKiBUaGlzIGlzIG5vdCBhIHB1YmxpYyBBUEkgeWV0LCBpdHMgdXNhZ2UgY291bGQgYmUgdXBkYXRlZFxuICAgICAqIEBtZXRob2Qgc2V0V29ybGRTY2FsZVxuICAgICAqIEBwYXJhbSB7VmVjM30gc2NhbGVcbiAgICAgKi9cbiAgICBzZXRXb3JsZFNjYWxlIChzY2FsZSkge1xuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQuZ2V0V29ybGRTY2FsZShfc3dzVmVjMyk7XG4gICAgICAgICAgICBWZWMzLmRpdihfc3dzVmVjMywgc2NhbGUsIF9zd3NWZWMzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFZlYzMuY29weShfc3dzVmVjMywgc2NhbGUpO1xuICAgICAgICB9XG4gICAgICAgIFRycy5mcm9tU2NhbGUodGhpcy5fdHJzLCBfc3dzVmVjMyk7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxEaXJ0eShMb2NhbERpcnR5RmxhZy5BTExfU0NBTEUpO1xuICAgIH0sXG5cbiAgICBnZXRXb3JsZFJUIChvdXQpIHtcbiAgICAgICAgbGV0IG9wb3MgPSBfZ3dydFZlYzNhO1xuICAgICAgICBsZXQgb3JvdCA9IF9nd3J0UXVhdGE7XG4gICAgICAgIGxldCBsdHJzID0gdGhpcy5fdHJzO1xuICAgICAgICBUcnMudG9Qb3NpdGlvbihvcG9zLCBsdHJzKTtcbiAgICAgICAgVHJzLnRvUm90YXRpb24ob3JvdCwgbHRycyk7XG5cbiAgICAgICAgbGV0IGN1cnIgPSB0aGlzLl9wYXJlbnQ7XG4gICAgICAgIHdoaWxlIChjdXJyKSB7XG4gICAgICAgICAgICBsdHJzID0gY3Vyci5fdHJzO1xuICAgICAgICAgICAgLy8gb3BvcyA9IHBhcmVudF9sc2NhbGUgKiBscG9zXG4gICAgICAgICAgICBUcnMudG9TY2FsZShfZ3dydFZlYzNiLCBsdHJzKTtcbiAgICAgICAgICAgIFZlYzMubXVsKG9wb3MsIG9wb3MsIF9nd3J0VmVjM2IpO1xuICAgICAgICAgICAgLy8gb3BvcyA9IHBhcmVudF9scm90ICogb3Bvc1xuICAgICAgICAgICAgVHJzLnRvUm90YXRpb24oX2d3cnRRdWF0YiwgbHRycyk7XG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybVF1YXQob3Bvcywgb3BvcywgX2d3cnRRdWF0Yik7XG4gICAgICAgICAgICAvLyBvcG9zID0gb3BvcyArIGxwb3NcbiAgICAgICAgICAgIFRycy50b1Bvc2l0aW9uKF9nd3J0VmVjM2IsIGx0cnMpO1xuICAgICAgICAgICAgVmVjMy5hZGQob3Bvcywgb3BvcywgX2d3cnRWZWMzYik7XG4gICAgICAgICAgICAvLyBvcm90ID0gbHJvdCAqIG9yb3RcbiAgICAgICAgICAgIFF1YXQubXVsKG9yb3QsIF9nd3J0UXVhdGIsIG9yb3QpO1xuICAgICAgICAgICAgY3VyciA9IGN1cnIuX3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBNYXQ0LmZyb21SVChvdXQsIG9yb3QsIG9wb3MpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCByb3RhdGlvbiBieSBsb29rQXQgdGFyZ2V0IHBvaW50LCBub3JtYWxseSB1c2VkIGJ5IENhbWVyYSBOb2RlXG4gICAgICogISN6aCDpgJrov4fop4Llr5/nm67moIfmnaXorr7nva4gcm90YXRpb27vvIzkuIDoiKznlKjkuo4gQ2FtZXJhIE5vZGUg5LiKXG4gICAgICogQG1ldGhvZCBsb29rQXRcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IHBvc1xuICAgICAqIEBwYXJhbSB7VmVjM30gW3VwXSAtIGRlZmF1bHQgaXMgKDAsMSwwKVxuICAgICAqL1xuICAgIGxvb2tBdCAocG9zLCB1cCkge1xuICAgICAgICB0aGlzLmdldFdvcmxkUG9zaXRpb24oX2xhVmVjMyk7XG4gICAgICAgIFZlYzMuc3ViKF9sYVZlYzMsIF9sYVZlYzMsIHBvcyk7IC8vIE5PVEU6IHdlIHVzZSAteiBmb3Igdmlldy1kaXJcbiAgICAgICAgVmVjMy5ub3JtYWxpemUoX2xhVmVjMywgX2xhVmVjMyk7XG4gICAgICAgIFF1YXQuZnJvbVZpZXdVcChfbGFRdWF0LCBfbGFWZWMzLCB1cCk7XG4gICAgXG4gICAgICAgIHRoaXMuc2V0V29ybGRSb3RhdGlvbihfbGFRdWF0KTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUxvY2FsTWF0cml4OiB1cGRhdGVMb2NhbE1hdHJpeDJELFxuXG4gICAgX2NhbGN1bFdvcmxkTWF0cml4ICgpIHtcbiAgICAgICAgLy8gQXZvaWQgYXMgbXVjaCBmdW5jdGlvbiBjYWxsIGFzIHBvc3NpYmxlXG4gICAgICAgIGlmICh0aGlzLl9sb2NhbE1hdERpcnR5ICYgTG9jYWxEaXJ0eUZsYWcuVFJTUykge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTG9jYWxNYXRyaXgoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gQXNzdW1lIHBhcmVudCB3b3JsZCBtYXRyaXggaXMgY29ycmVjdFxuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5fcGFyZW50O1xuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9tdWxNYXQodGhpcy5fd29ybGRNYXRyaXgsIHBhcmVudC5fd29ybGRNYXRyaXgsIHRoaXMuX21hdHJpeCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBNYXQ0LmNvcHkodGhpcy5fd29ybGRNYXRyaXgsIHRoaXMuX21hdHJpeCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fd29ybGRNYXREaXJ0eSA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICBfbXVsTWF0OiBtdWxNYXQyRCxcblxuICAgIF91cGRhdGVXb3JsZE1hdHJpeCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fd29ybGRNYXREaXJ0eSkge1xuICAgICAgICAgICAgdGhpcy5fY2FsY3VsV29ybGRNYXRyaXgoKTtcbiAgICAgICAgICAgIC8vIFN5bmMgZGlydHkgdG8gY2hpbGRyZW5cbiAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbltpXS5fd29ybGRNYXREaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0TG9jYWxEaXJ0eSAoZmxhZykge1xuICAgICAgICB0aGlzLl9sb2NhbE1hdERpcnR5IHw9IGZsYWc7XG4gICAgICAgIHRoaXMuX3dvcmxkTWF0RGlydHkgPSB0cnVlO1xuXG4gICAgICAgIGlmIChmbGFnID09PSBMb2NhbERpcnR5RmxhZy5BTExfUE9TSVRJT04gfHwgZmxhZyA9PT0gTG9jYWxEaXJ0eUZsYWcuUE9TSVRJT04pIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1dPUkxEX1RSQU5TRk9STTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX1RSQU5TRk9STTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgfSxcblxuICAgIHNldFdvcmxkRGlydHkgKCkge1xuICAgICAgICB0aGlzLl93b3JsZE1hdERpcnR5ID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgbG9jYWwgdHJhbnNmb3JtIG1hdHJpeCAoNHg0KSwgYmFzZWQgb24gcGFyZW50IG5vZGUgY29vcmRpbmF0ZXNcbiAgICAgKiAhI3poIOi/lOWbnuWxgOmDqOepuumXtOWdkOagh+ezu+eahOefqemYte+8jOWfuuS6jueItuiKgueCueWdkOagh+ezu+OAglxuICAgICAqIEBtZXRob2QgZ2V0TG9jYWxNYXRyaXhcbiAgICAgKiBAcGFyYW0ge01hdDR9IG91dCBUaGUgbWF0cml4IG9iamVjdCB0byBiZSBmaWxsZWQgd2l0aCBkYXRhXG4gICAgICogQHJldHVybiB7TWF0NH0gU2FtZSBhcyB0aGUgb3V0IG1hdHJpeCBvYmplY3RcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBtYXQ0ID0gY2MubWF0NCgpO1xuICAgICAqIG5vZGUuZ2V0TG9jYWxNYXRyaXgobWF0NCk7XG4gICAgICovXG4gICAgZ2V0TG9jYWxNYXRyaXggKG91dCkge1xuICAgICAgICB0aGlzLl91cGRhdGVMb2NhbE1hdHJpeCgpO1xuICAgICAgICByZXR1cm4gTWF0NC5jb3B5KG91dCwgdGhpcy5fbWF0cml4KTtcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIHdvcmxkIHRyYW5zZm9ybSBtYXRyaXggKDR4NClcbiAgICAgKiAhI3poIOi/lOWbnuS4lueVjOepuumXtOWdkOagh+ezu+eahOefqemYteOAglxuICAgICAqIEBtZXRob2QgZ2V0V29ybGRNYXRyaXhcbiAgICAgKiBAcGFyYW0ge01hdDR9IG91dCBUaGUgbWF0cml4IG9iamVjdCB0byBiZSBmaWxsZWQgd2l0aCBkYXRhXG4gICAgICogQHJldHVybiB7TWF0NH0gU2FtZSBhcyB0aGUgb3V0IG1hdHJpeCBvYmplY3RcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBtYXQ0ID0gY2MubWF0NCgpO1xuICAgICAqIG5vZGUuZ2V0V29ybGRNYXRyaXgobWF0NCk7XG4gICAgICovXG4gICAgZ2V0V29ybGRNYXRyaXggKG91dCkge1xuICAgICAgICB0aGlzLl91cGRhdGVXb3JsZE1hdHJpeCgpO1xuICAgICAgICByZXR1cm4gTWF0NC5jb3B5KG91dCwgdGhpcy5fd29ybGRNYXRyaXgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29udmVydHMgYSBQb2ludCB0byBub2RlIChsb2NhbCkgc3BhY2UgY29vcmRpbmF0ZXMuXG4gICAgICogISN6aFxuICAgICAqIOWwhuS4gOS4queCuei9rOaNouWIsOiKgueCuSAo5bGA6YOoKSDnqbrpl7TlnZDmoIfns7vjgIJcbiAgICAgKiBAbWV0aG9kIGNvbnZlcnRUb05vZGVTcGFjZUFSXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzJ9IHdvcmxkUG9pbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjMn0gW291dF1cbiAgICAgKiBAcmV0dXJuIHtWZWMzfFZlYzJ9XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjb252ZXJ0VG9Ob2RlU3BhY2VBUjxUIGV4dGVuZHMgY2MuVmVjMiB8IGNjLlZlYzM+KHdvcmxkUG9pbnQ6IFQsIG91dD86IFQpOiBUXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgbmV3VmVjMiA9IG5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIoY2MudjIoMTAwLCAxMDApKTtcbiAgICAgKiB2YXIgbmV3VmVjMyA9IG5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIoY2MudjMoMTAwLCAxMDAsIDEwMCkpO1xuICAgICAqL1xuICAgIGNvbnZlcnRUb05vZGVTcGFjZUFSICh3b3JsZFBvaW50LCBvdXQpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICAgICAgTWF0NC5pbnZlcnQoX21hdDRfdGVtcCwgdGhpcy5fd29ybGRNYXRyaXgpO1xuXG4gICAgICAgIGlmICh3b3JsZFBvaW50IGluc3RhbmNlb2YgY2MuVmVjMikge1xuICAgICAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgICAgICByZXR1cm4gVmVjMi50cmFuc2Zvcm1NYXQ0KG91dCwgd29ybGRQb2ludCwgX21hdDRfdGVtcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IGNjLlZlYzMoKTtcbiAgICAgICAgICAgIHJldHVybiBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LCB3b3JsZFBvaW50LCBfbWF0NF90ZW1wKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29udmVydHMgYSBQb2ludCBpbiBub2RlIGNvb3JkaW5hdGVzIHRvIHdvcmxkIHNwYWNlIGNvb3JkaW5hdGVzLlxuICAgICAqICEjemhcbiAgICAgKiDlsIboioLngrnlnZDmoIfns7vkuIvnmoTkuIDkuKrngrnovazmjaLliLDkuJbnlYznqbrpl7TlnZDmoIfns7vjgIJcbiAgICAgKiBAbWV0aG9kIGNvbnZlcnRUb1dvcmxkU3BhY2VBUlxuICAgICAqIEBwYXJhbSB7VmVjM3xWZWMyfSBub2RlUG9pbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjMn0gW291dF1cbiAgICAgKiBAcmV0dXJuIHtWZWMzfFZlYzJ9XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBjb252ZXJ0VG9Xb3JsZFNwYWNlQVI8VCBleHRlbmRzIGNjLlZlYzIgfCBjYy5WZWMzPihub2RlUG9pbnQ6IFQsIG91dD86IFQpOiBUXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgbmV3VmVjMiA9IG5vZGUuY29udmVydFRvV29ybGRTcGFjZUFSKGNjLnYyKDEwMCwgMTAwKSk7XG4gICAgICogdmFyIG5ld1ZlYzMgPSBub2RlLmNvbnZlcnRUb1dvcmxkU3BhY2VBUihjYy52MygxMDAsIDEwMCwgMTAwKSk7XG4gICAgICovXG4gICAgY29udmVydFRvV29ybGRTcGFjZUFSIChub2RlUG9pbnQsIG91dCkge1xuICAgICAgICB0aGlzLl91cGRhdGVXb3JsZE1hdHJpeCgpO1xuICAgICAgICBpZiAobm9kZVBvaW50IGluc3RhbmNlb2YgY2MuVmVjMikge1xuICAgICAgICAgICAgb3V0ID0gb3V0IHx8IG5ldyBjYy5WZWMyKCk7XG4gICAgICAgICAgICByZXR1cm4gVmVjMi50cmFuc2Zvcm1NYXQ0KG91dCwgbm9kZVBvaW50LCB0aGlzLl93b3JsZE1hdHJpeCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IGNjLlZlYzMoKTtcbiAgICAgICAgICAgIHJldHVybiBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LCBub2RlUG9pbnQsIHRoaXMuX3dvcmxkTWF0cml4KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbi8vIE9MRCBUUkFOU0ZPUk0gQUNDRVNTIEFQSXNcbiAvKipcbiAgICAgKiAhI2VuIENvbnZlcnRzIGEgUG9pbnQgdG8gbm9kZSAobG9jYWwpIHNwYWNlIGNvb3JkaW5hdGVzIHRoZW4gYWRkIHRoZSBhbmNob3IgcG9pbnQgcG9zaXRpb24uXG4gICAgICogU28gdGhlIHJldHVybiBwb3NpdGlvbiB3aWxsIGJlIHJlbGF0ZWQgdG8gdGhlIGxlZnQgYm90dG9tIGNvcm5lciBvZiB0aGUgbm9kZSdzIGJvdW5kaW5nIGJveC5cbiAgICAgKiBUaGlzIGVxdWFscyB0byB0aGUgQVBJIGJlaGF2aW9yIG9mIGNvY29zMmQteCwgeW91IHByb2JhYmx5IHdhbnQgdG8gdXNlIGNvbnZlcnRUb05vZGVTcGFjZUFSIGluc3RlYWRcbiAgICAgKiAhI3poIOWwhuS4gOS4queCuei9rOaNouWIsOiKgueCuSAo5bGA6YOoKSDlnZDmoIfns7vvvIzlubbliqDkuIrplJrngrnnmoTlnZDmoIfjgII8YnIvPlxuICAgICAqIOS5n+WwseaYr+ivtOi/lOWbnueahOWdkOagh+aYr+ebuOWvueS6juiKgueCueWMheWbtOebkuW3puS4i+inkueahOWdkOagh+OAgjxici8+XG4gICAgICog6L+Z5LiqIEFQSSDnmoTorr7orqHmmK/kuLrkuoblkowgY29jb3MyZC14IOS4reihjOS4uuS4gOiHtO+8jOabtOWkmuaDheWGteS4i+S9oOWPr+iDvemcgOimgeS9v+eUqCBjb252ZXJ0VG9Ob2RlU3BhY2VBUuOAglxuICAgICAqIEBtZXRob2QgY29udmVydFRvTm9kZVNwYWNlXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4zXG4gICAgICogQHBhcmFtIHtWZWMyfSB3b3JsZFBvaW50XG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBuZXdWZWMyID0gbm9kZS5jb252ZXJ0VG9Ob2RlU3BhY2UoY2MudjIoMTAwLCAxMDApKTtcbiAgICAgKi9cbiAgICBjb252ZXJ0VG9Ob2RlU3BhY2UgKHdvcmxkUG9pbnQpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICAgICAgTWF0NC5pbnZlcnQoX21hdDRfdGVtcCwgdGhpcy5fd29ybGRNYXRyaXgpO1xuICAgICAgICBsZXQgb3V0ID0gbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgVmVjMi50cmFuc2Zvcm1NYXQ0KG91dCwgd29ybGRQb2ludCwgX21hdDRfdGVtcCk7XG4gICAgICAgIG91dC54ICs9IHRoaXMuX2FuY2hvclBvaW50LnggKiB0aGlzLl9jb250ZW50U2l6ZS53aWR0aDtcbiAgICAgICAgb3V0LnkgKz0gdGhpcy5fYW5jaG9yUG9pbnQueSAqIHRoaXMuX2NvbnRlbnRTaXplLmhlaWdodDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBDb252ZXJ0cyBhIFBvaW50IHJlbGF0ZWQgdG8gdGhlIGxlZnQgYm90dG9tIGNvcm5lciBvZiB0aGUgbm9kZSdzIGJvdW5kaW5nIGJveCB0byB3b3JsZCBzcGFjZSBjb29yZGluYXRlcy5cbiAgICAgKiBUaGlzIGVxdWFscyB0byB0aGUgQVBJIGJlaGF2aW9yIG9mIGNvY29zMmQteCwgeW91IHByb2JhYmx5IHdhbnQgdG8gdXNlIGNvbnZlcnRUb1dvcmxkU3BhY2VBUiBpbnN0ZWFkXG4gICAgICogISN6aCDlsIbkuIDkuKrnm7jlr7nkuo7oioLngrnlt6bkuIvop5LnmoTlnZDmoIfkvY3nva7ovazmjaLliLDkuJbnlYznqbrpl7TlnZDmoIfns7vjgIJcbiAgICAgKiDov5nkuKogQVBJIOeahOiuvuiuoeaYr+S4uuS6huWSjCBjb2NvczJkLXgg5Lit6KGM5Li65LiA6Ie077yM5pu05aSa5oOF5Ya15LiL5L2g5Y+v6IO96ZyA6KaB5L2/55SoIGNvbnZlcnRUb1dvcmxkU3BhY2VBUlxuICAgICAqIEBtZXRob2QgY29udmVydFRvV29ybGRTcGFjZVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjEuM1xuICAgICAqIEBwYXJhbSB7VmVjMn0gbm9kZVBvaW50XG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBuZXdWZWMyID0gbm9kZS5jb252ZXJ0VG9Xb3JsZFNwYWNlKGNjLnYyKDEwMCwgMTAwKSk7XG4gICAgICovXG4gICAgY29udmVydFRvV29ybGRTcGFjZSAobm9kZVBvaW50KSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVdvcmxkTWF0cml4KCk7XG4gICAgICAgIGxldCBvdXQgPSBuZXcgY2MuVmVjMihcbiAgICAgICAgICAgIG5vZGVQb2ludC54IC0gdGhpcy5fYW5jaG9yUG9pbnQueCAqIHRoaXMuX2NvbnRlbnRTaXplLndpZHRoLFxuICAgICAgICAgICAgbm9kZVBvaW50LnkgLSB0aGlzLl9hbmNob3JQb2ludC55ICogdGhpcy5fY29udGVudFNpemUuaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBWZWMyLnRyYW5zZm9ybU1hdDQob3V0LCBvdXQsIHRoaXMuX3dvcmxkTWF0cml4KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIG1hdHJpeCB0aGF0IHRyYW5zZm9ybSB0aGUgbm9kZSdzIChsb2NhbCkgc3BhY2UgY29vcmRpbmF0ZXMgaW50byB0aGUgcGFyZW50J3Mgc3BhY2UgY29vcmRpbmF0ZXMuPGJyLz5cbiAgICAgKiBUaGUgbWF0cml4IGlzIGluIFBpeGVscy5cbiAgICAgKiAhI3poIOi/lOWbnui/meS4quWwhuiKgueCue+8iOWxgOmDqO+8ieeahOepuumXtOWdkOagh+ezu+i9rOaNouaIkOeItuiKgueCueeahOepuumXtOWdkOagh+ezu+eahOefqemYteOAgui/meS4quefqemYteS7peWDj+e0oOS4uuWNleS9jeOAglxuICAgICAqIEBtZXRob2QgZ2V0Tm9kZVRvUGFyZW50VHJhbnNmb3JtXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEBwYXJhbSB7QWZmaW5lVHJhbnNmb3JtfSBbb3V0XSBUaGUgYWZmaW5lIHRyYW5zZm9ybSBvYmplY3QgdG8gYmUgZmlsbGVkIHdpdGggZGF0YVxuICAgICAqIEByZXR1cm4ge0FmZmluZVRyYW5zZm9ybX0gU2FtZSBhcyB0aGUgb3V0IGFmZmluZSB0cmFuc2Zvcm0gb2JqZWN0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgYWZmaW5lVHJhbnNmb3JtID0gY2MuQWZmaW5lVHJhbnNmb3JtLmNyZWF0ZSgpO1xuICAgICAqIG5vZGUuZ2V0Tm9kZVRvUGFyZW50VHJhbnNmb3JtKGFmZmluZVRyYW5zZm9ybSk7XG4gICAgICovXG4gICAgZ2V0Tm9kZVRvUGFyZW50VHJhbnNmb3JtIChvdXQpIHtcbiAgICAgICAgaWYgKCFvdXQpIHtcbiAgICAgICAgICAgIG91dCA9IEFmZmluZVRyYW5zLmlkZW50aXR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlTG9jYWxNYXRyaXgoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBjb250ZW50U2l6ZSA9IHRoaXMuX2NvbnRlbnRTaXplO1xuICAgICAgICBfdmVjM190ZW1wLnggPSAtdGhpcy5fYW5jaG9yUG9pbnQueCAqIGNvbnRlbnRTaXplLndpZHRoO1xuICAgICAgICBfdmVjM190ZW1wLnkgPSAtdGhpcy5fYW5jaG9yUG9pbnQueSAqIGNvbnRlbnRTaXplLmhlaWdodDtcblxuICAgICAgICBNYXQ0LmNvcHkoX21hdDRfdGVtcCwgdGhpcy5fbWF0cml4KTtcbiAgICAgICAgTWF0NC50cmFuc2Zvcm0oX21hdDRfdGVtcCwgX21hdDRfdGVtcCwgX3ZlYzNfdGVtcCk7XG4gICAgICAgIHJldHVybiBBZmZpbmVUcmFucy5mcm9tTWF0NChvdXQsIF9tYXQ0X3RlbXApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgbWF0cml4IHRoYXQgdHJhbnNmb3JtIHRoZSBub2RlJ3MgKGxvY2FsKSBzcGFjZSBjb29yZGluYXRlcyBpbnRvIHRoZSBwYXJlbnQncyBzcGFjZSBjb29yZGluYXRlcy48YnIvPlxuICAgICAqIFRoZSBtYXRyaXggaXMgaW4gUGl4ZWxzLjxici8+XG4gICAgICogVGhpcyBtZXRob2QgaXMgQVIgKEFuY2hvciBSZWxhdGl2ZSkuXG4gICAgICogISN6aFxuICAgICAqIOi/lOWbnui/meS4quWwhuiKgueCue+8iOWxgOmDqO+8ieeahOepuumXtOWdkOagh+ezu+i9rOaNouaIkOeItuiKgueCueeahOepuumXtOWdkOagh+ezu+eahOefqemYteOAgjxici8+XG4gICAgICog6L+Z5Liq55+p6Zi15Lul5YOP57Sg5Li65Y2V5L2N44CCPGJyLz5cbiAgICAgKiDor6Xmlrnms5Xln7rkuo7oioLngrnlnZDmoIfjgIJcbiAgICAgKiBAbWV0aG9kIGdldE5vZGVUb1BhcmVudFRyYW5zZm9ybUFSXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEBwYXJhbSB7QWZmaW5lVHJhbnNmb3JtfSBbb3V0XSBUaGUgYWZmaW5lIHRyYW5zZm9ybSBvYmplY3QgdG8gYmUgZmlsbGVkIHdpdGggZGF0YVxuICAgICAqIEByZXR1cm4ge0FmZmluZVRyYW5zZm9ybX0gU2FtZSBhcyB0aGUgb3V0IGFmZmluZSB0cmFuc2Zvcm0gb2JqZWN0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgYWZmaW5lVHJhbnNmb3JtID0gY2MuQWZmaW5lVHJhbnNmb3JtLmNyZWF0ZSgpO1xuICAgICAqIG5vZGUuZ2V0Tm9kZVRvUGFyZW50VHJhbnNmb3JtQVIoYWZmaW5lVHJhbnNmb3JtKTtcbiAgICAgKi9cbiAgICBnZXROb2RlVG9QYXJlbnRUcmFuc2Zvcm1BUiAob3V0KSB7XG4gICAgICAgIGlmICghb3V0KSB7XG4gICAgICAgICAgICBvdXQgPSBBZmZpbmVUcmFucy5pZGVudGl0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZUxvY2FsTWF0cml4KCk7XG4gICAgICAgIHJldHVybiBBZmZpbmVUcmFucy5mcm9tTWF0NChvdXQsIHRoaXMuX21hdHJpeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgd29ybGQgYWZmaW5lIHRyYW5zZm9ybSBtYXRyaXguIFRoZSBtYXRyaXggaXMgaW4gUGl4ZWxzLlxuICAgICAqICEjemgg6L+U5Zue6IqC54K55Yiw5LiW55WM5Z2Q5qCH57O755qE5Lu/5bCE5Y+Y5o2i55+p6Zi144CC55+p6Zi15Y2V5L2N5piv5YOP57Sg44CCXG4gICAgICogQG1ldGhvZCBnZXROb2RlVG9Xb3JsZFRyYW5zZm9ybVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAcGFyYW0ge0FmZmluZVRyYW5zZm9ybX0gW291dF0gVGhlIGFmZmluZSB0cmFuc2Zvcm0gb2JqZWN0IHRvIGJlIGZpbGxlZCB3aXRoIGRhdGFcbiAgICAgKiBAcmV0dXJuIHtBZmZpbmVUcmFuc2Zvcm19IFNhbWUgYXMgdGhlIG91dCBhZmZpbmUgdHJhbnNmb3JtIG9iamVjdFxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IGFmZmluZVRyYW5zZm9ybSA9IGNjLkFmZmluZVRyYW5zZm9ybS5jcmVhdGUoKTtcbiAgICAgKiBub2RlLmdldE5vZGVUb1dvcmxkVHJhbnNmb3JtKGFmZmluZVRyYW5zZm9ybSk7XG4gICAgICovXG4gICAgZ2V0Tm9kZVRvV29ybGRUcmFuc2Zvcm0gKG91dCkge1xuICAgICAgICBpZiAoIW91dCkge1xuICAgICAgICAgICAgb3V0ID0gQWZmaW5lVHJhbnMuaWRlbnRpdHkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVXb3JsZE1hdHJpeCgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIGNvbnRlbnRTaXplID0gdGhpcy5fY29udGVudFNpemU7XG4gICAgICAgIF92ZWMzX3RlbXAueCA9IC10aGlzLl9hbmNob3JQb2ludC54ICogY29udGVudFNpemUud2lkdGg7XG4gICAgICAgIF92ZWMzX3RlbXAueSA9IC10aGlzLl9hbmNob3JQb2ludC55ICogY29udGVudFNpemUuaGVpZ2h0O1xuXG4gICAgICAgIE1hdDQuY29weShfbWF0NF90ZW1wLCB0aGlzLl93b3JsZE1hdHJpeCk7XG4gICAgICAgIE1hdDQudHJhbnNmb3JtKF9tYXQ0X3RlbXAsIF9tYXQ0X3RlbXAsIF92ZWMzX3RlbXApO1xuXG4gICAgICAgIHJldHVybiBBZmZpbmVUcmFucy5mcm9tTWF0NChvdXQsIF9tYXQ0X3RlbXApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgd29ybGQgYWZmaW5lIHRyYW5zZm9ybSBtYXRyaXguIFRoZSBtYXRyaXggaXMgaW4gUGl4ZWxzLjxici8+XG4gICAgICogVGhpcyBtZXRob2QgaXMgQVIgKEFuY2hvciBSZWxhdGl2ZSkuXG4gICAgICogISN6aFxuICAgICAqIOi/lOWbnuiKgueCueWIsOS4lueVjOWdkOagh+S7v+WwhOWPmOaNouefqemYteOAguefqemYteWNleS9jeaYr+WDj+e0oOOAgjxici8+XG4gICAgICog6K+l5pa55rOV5Z+65LqO6IqC54K55Z2Q5qCH44CCXG4gICAgICogQG1ldGhvZCBnZXROb2RlVG9Xb3JsZFRyYW5zZm9ybUFSXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEBwYXJhbSB7QWZmaW5lVHJhbnNmb3JtfSBbb3V0XSBUaGUgYWZmaW5lIHRyYW5zZm9ybSBvYmplY3QgdG8gYmUgZmlsbGVkIHdpdGggZGF0YVxuICAgICAqIEByZXR1cm4ge0FmZmluZVRyYW5zZm9ybX0gU2FtZSBhcyB0aGUgb3V0IGFmZmluZSB0cmFuc2Zvcm0gb2JqZWN0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgYWZmaW5lVHJhbnNmb3JtID0gY2MuQWZmaW5lVHJhbnNmb3JtLmNyZWF0ZSgpO1xuICAgICAqIG5vZGUuZ2V0Tm9kZVRvV29ybGRUcmFuc2Zvcm1BUihhZmZpbmVUcmFuc2Zvcm0pO1xuICAgICAqL1xuICAgIGdldE5vZGVUb1dvcmxkVHJhbnNmb3JtQVIgKG91dCkge1xuICAgICAgICBpZiAoIW91dCkge1xuICAgICAgICAgICAgb3V0ID0gQWZmaW5lVHJhbnMuaWRlbnRpdHkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVXb3JsZE1hdHJpeCgpO1xuICAgICAgICByZXR1cm4gQWZmaW5lVHJhbnMuZnJvbU1hdDQob3V0LCB0aGlzLl93b3JsZE1hdHJpeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSBtYXRyaXggdGhhdCB0cmFuc2Zvcm0gcGFyZW50J3Mgc3BhY2UgY29vcmRpbmF0ZXMgdG8gdGhlIG5vZGUncyAobG9jYWwpIHNwYWNlIGNvb3JkaW5hdGVzLjxici8+XG4gICAgICogVGhlIG1hdHJpeCBpcyBpbiBQaXhlbHMuIFRoZSByZXR1cm5lZCB0cmFuc2Zvcm0gaXMgcmVhZG9ubHkgYW5kIGNhbm5vdCBiZSBjaGFuZ2VkLlxuICAgICAqICEjemhcbiAgICAgKiDov5Tlm57lsIbniLboioLngrnnmoTlnZDmoIfns7vovazmjaLmiJDoioLngrnvvIjlsYDpg6jvvInnmoTnqbrpl7TlnZDmoIfns7vnmoTnn6npmLXjgII8YnIvPlxuICAgICAqIOivpeefqemYteS7peWDj+e0oOS4uuWNleS9jeOAgui/lOWbnueahOefqemYteaYr+WPquivu+eahO+8jOS4jeiDveabtOaUueOAglxuICAgICAqIEBtZXRob2QgZ2V0UGFyZW50VG9Ob2RlVHJhbnNmb3JtXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEBwYXJhbSB7QWZmaW5lVHJhbnNmb3JtfSBbb3V0XSBUaGUgYWZmaW5lIHRyYW5zZm9ybSBvYmplY3QgdG8gYmUgZmlsbGVkIHdpdGggZGF0YVxuICAgICAqIEByZXR1cm4ge0FmZmluZVRyYW5zZm9ybX0gU2FtZSBhcyB0aGUgb3V0IGFmZmluZSB0cmFuc2Zvcm0gb2JqZWN0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgYWZmaW5lVHJhbnNmb3JtID0gY2MuQWZmaW5lVHJhbnNmb3JtLmNyZWF0ZSgpO1xuICAgICAqIG5vZGUuZ2V0UGFyZW50VG9Ob2RlVHJhbnNmb3JtKGFmZmluZVRyYW5zZm9ybSk7XG4gICAgICovXG4gICAgZ2V0UGFyZW50VG9Ob2RlVHJhbnNmb3JtIChvdXQpIHtcbiAgICAgICAgaWYgKCFvdXQpIHtcbiAgICAgICAgICAgIG91dCA9IEFmZmluZVRyYW5zLmlkZW50aXR5KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlTG9jYWxNYXRyaXgoKTtcbiAgICAgICAgTWF0NC5pbnZlcnQoX21hdDRfdGVtcCwgdGhpcy5fbWF0cml4KTtcbiAgICAgICAgcmV0dXJuIEFmZmluZVRyYW5zLmZyb21NYXQ0KG91dCwgX21hdDRfdGVtcCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgaW52ZXJzZSB3b3JsZCBhZmZpbmUgdHJhbnNmb3JtIG1hdHJpeC4gVGhlIG1hdHJpeCBpcyBpbiBQaXhlbHMuXG4gICAgICogISNlbiDov5Tlm57kuJbnlYzlnZDmoIfns7vliLDoioLngrnlnZDmoIfns7vnmoTpgIbnn6npmLXjgIJcbiAgICAgKiBAbWV0aG9kIGdldFdvcmxkVG9Ob2RlVHJhbnNmb3JtXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICAgICAqIEBwYXJhbSB7QWZmaW5lVHJhbnNmb3JtfSBbb3V0XSBUaGUgYWZmaW5lIHRyYW5zZm9ybSBvYmplY3QgdG8gYmUgZmlsbGVkIHdpdGggZGF0YVxuICAgICAqIEByZXR1cm4ge0FmZmluZVRyYW5zZm9ybX0gU2FtZSBhcyB0aGUgb3V0IGFmZmluZSB0cmFuc2Zvcm0gb2JqZWN0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgYWZmaW5lVHJhbnNmb3JtID0gY2MuQWZmaW5lVHJhbnNmb3JtLmNyZWF0ZSgpO1xuICAgICAqIG5vZGUuZ2V0V29ybGRUb05vZGVUcmFuc2Zvcm0oYWZmaW5lVHJhbnNmb3JtKTtcbiAgICAgKi9cbiAgICBnZXRXb3JsZFRvTm9kZVRyYW5zZm9ybSAob3V0KSB7XG4gICAgICAgIGlmICghb3V0KSB7XG4gICAgICAgICAgICBvdXQgPSBBZmZpbmVUcmFucy5pZGVudGl0eSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZVdvcmxkTWF0cml4KCk7XG4gICAgICAgIE1hdDQuaW52ZXJ0KF9tYXQ0X3RlbXAsIHRoaXMuX3dvcmxkTWF0cml4KTtcbiAgICAgICAgcmV0dXJuIEFmZmluZVRyYW5zLmZyb21NYXQ0KG91dCwgX21hdDRfdGVtcCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gY29udmVuaWVuY2UgbWV0aG9kcyB3aGljaCB0YWtlIGEgY2MuVG91Y2ggaW5zdGVhZCBvZiBjYy5WZWMyLlxuICAgICAqICEjemgg5bCG6Kem5pG454K56L2s5o2i5oiQ5pys5Zyw5Z2Q5qCH57O75Lit5L2N572u44CCXG4gICAgICogQG1ldGhvZCBjb252ZXJ0VG91Y2hUb05vZGVTcGFjZVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAgICAgKiBAcGFyYW0ge1RvdWNofSB0b3VjaCAtIFRoZSB0b3VjaCBvYmplY3RcbiAgICAgKiBAcmV0dXJuIHtWZWMyfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIG5ld1ZlYzIgPSBub2RlLmNvbnZlcnRUb3VjaFRvTm9kZVNwYWNlKHRvdWNoKTtcbiAgICAgKi9cbiAgICBjb252ZXJ0VG91Y2hUb05vZGVTcGFjZSAodG91Y2gpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFRvTm9kZVNwYWNlKHRvdWNoLmdldExvY2F0aW9uKCkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIGNvbnZlcnRzIGEgY2MuVG91Y2ggKHdvcmxkIGNvb3JkaW5hdGVzKSBpbnRvIGEgbG9jYWwgY29vcmRpbmF0ZS4gVGhpcyBtZXRob2QgaXMgQVIgKEFuY2hvciBSZWxhdGl2ZSkuXG4gICAgICogISN6aCDovazmjaLkuIDkuKogY2MuVG91Y2jvvIjkuJbnlYzlnZDmoIfvvInliLDkuIDkuKrlsYDpg6jlnZDmoIfvvIzor6Xmlrnms5Xln7rkuo7oioLngrnlnZDmoIfjgIJcbiAgICAgKiBAbWV0aG9kIGNvbnZlcnRUb3VjaFRvTm9kZVNwYWNlQVJcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gICAgICogQHBhcmFtIHtUb3VjaH0gdG91Y2ggLSBUaGUgdG91Y2ggb2JqZWN0XG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBuZXdWZWMyID0gbm9kZS5jb252ZXJ0VG91Y2hUb05vZGVTcGFjZUFSKHRvdWNoKTtcbiAgICAgKi9cbiAgICBjb252ZXJ0VG91Y2hUb05vZGVTcGFjZUFSICh0b3VjaCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9Ob2RlU3BhY2VBUih0b3VjaC5nZXRMb2NhdGlvbigpKTtcbiAgICB9LFxuICAgIFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIGEgXCJsb2NhbFwiIGF4aXMgYWxpZ25lZCBib3VuZGluZyBib3ggb2YgdGhlIG5vZGUuIDxici8+XG4gICAgICogVGhlIHJldHVybmVkIGJveCBpcyByZWxhdGl2ZSBvbmx5IHRvIGl0cyBwYXJlbnQuXG4gICAgICogISN6aCDov5Tlm57niLboioLlnZDmoIfns7vkuIvnmoTovbTlkJHlr7npvZDnmoTljIXlm7Tnm5LjgIJcbiAgICAgKiBAbWV0aG9kIGdldEJvdW5kaW5nQm94XG4gICAgICogQHJldHVybiB7UmVjdH0gVGhlIGNhbGN1bGF0ZWQgYm91bmRpbmcgYm94IG9mIHRoZSBub2RlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgYm91bmRpbmdCb3ggPSBub2RlLmdldEJvdW5kaW5nQm94KCk7XG4gICAgICovXG4gICAgZ2V0Qm91bmRpbmdCb3ggKCkge1xuICAgICAgICB0aGlzLl91cGRhdGVMb2NhbE1hdHJpeCgpO1xuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLl9jb250ZW50U2l6ZS53aWR0aDtcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuX2NvbnRlbnRTaXplLmhlaWdodDtcbiAgICAgICAgbGV0IHJlY3QgPSBjYy5yZWN0KFxuICAgICAgICAgICAgLXRoaXMuX2FuY2hvclBvaW50LnggKiB3aWR0aCwgXG4gICAgICAgICAgICAtdGhpcy5fYW5jaG9yUG9pbnQueSAqIGhlaWdodCwgXG4gICAgICAgICAgICB3aWR0aCwgXG4gICAgICAgICAgICBoZWlnaHQpO1xuICAgICAgICByZXR1cm4gcmVjdC50cmFuc2Zvcm1NYXQ0KHJlY3QsIHRoaXMuX21hdHJpeCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIGEgXCJ3b3JsZFwiIGF4aXMgYWxpZ25lZCBib3VuZGluZyBib3ggb2YgdGhlIG5vZGUuPGJyLz5cbiAgICAgKiBUaGUgYm91bmRpbmcgYm94IGNvbnRhaW5zIHNlbGYgYW5kIGFjdGl2ZSBjaGlsZHJlbidzIHdvcmxkIGJvdW5kaW5nIGJveC5cbiAgICAgKiAhI3poXG4gICAgICog6L+U5Zue6IqC54K55Zyo5LiW55WM5Z2Q5qCH57O75LiL55qE5a+56b2Q6L205ZCR55qE5YyF5Zu055uS77yIQUFCQu+8ieOAgjxici8+XG4gICAgICog6K+l6L655qGG5YyF5ZCr6Ieq6Lqr5ZKM5bey5r+A5rS755qE5a2Q6IqC54K555qE5LiW55WM6L655qGG44CCXG4gICAgICogQG1ldGhvZCBnZXRCb3VuZGluZ0JveFRvV29ybGRcbiAgICAgKiBAcmV0dXJuIHtSZWN0fVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIG5ld1JlY3QgPSBub2RlLmdldEJvdW5kaW5nQm94VG9Xb3JsZCgpO1xuICAgICAqL1xuICAgIGdldEJvdW5kaW5nQm94VG9Xb3JsZCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlV29ybGRNYXRyaXgoKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9nZXRCb3VuZGluZ0JveFRvKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRCb3VuZGluZ0JveCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9nZXRCb3VuZGluZ0JveFRvICgpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5fY29udGVudFNpemUud2lkdGg7XG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLl9jb250ZW50U2l6ZS5oZWlnaHQ7XG4gICAgICAgIGxldCByZWN0ID0gY2MucmVjdChcbiAgICAgICAgICAgIC10aGlzLl9hbmNob3JQb2ludC54ICogd2lkdGgsIFxuICAgICAgICAgICAgLXRoaXMuX2FuY2hvclBvaW50LnkgKiBoZWlnaHQsIFxuICAgICAgICAgICAgd2lkdGgsIFxuICAgICAgICAgICAgaGVpZ2h0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX2NhbGN1bFdvcmxkTWF0cml4KCk7XG4gICAgICAgIHJlY3QudHJhbnNmb3JtTWF0NChyZWN0LCB0aGlzLl93b3JsZE1hdHJpeCk7XG5cbiAgICAgICAgLy9xdWVyeSBjaGlsZCdzIEJvdW5kaW5nQm94XG4gICAgICAgIGlmICghdGhpcy5fY2hpbGRyZW4pXG4gICAgICAgICAgICByZXR1cm4gcmVjdDtcblxuICAgICAgICB2YXIgbG9jQ2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2NDaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gbG9jQ2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQgJiYgY2hpbGQuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkUmVjdCA9IGNoaWxkLl9nZXRCb3VuZGluZ0JveFRvKCk7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkUmVjdClcbiAgICAgICAgICAgICAgICAgICAgcmVjdC51bmlvbihyZWN0LCBjaGlsZFJlY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZWN0O1xuICAgIH0sXG5cbiAgICBfdXBkYXRlT3JkZXJPZkFycml2YWwgKCkge1xuICAgICAgICB2YXIgYXJyaXZhbE9yZGVyID0gdGhpcy5fcGFyZW50ID8gKyt0aGlzLl9wYXJlbnQuX2NoaWxkQXJyaXZhbE9yZGVyIDogMDtcbiAgICAgICAgdGhpcy5fbG9jYWxaT3JkZXIgPSAodGhpcy5fbG9jYWxaT3JkZXIgJiAweGZmZmYwMDAwKSB8IGFycml2YWxPcmRlcjtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZW1pdChFdmVudFR5cGUuU0lCTElOR19PUkRFUl9DSEFOR0VEKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZHMgYSBjaGlsZCB0byB0aGUgbm9kZSB3aXRoIHogb3JkZXIgYW5kIG5hbWUuXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoOWtkOiKgueCue+8jOW5tuS4lOWPr+S7peS/ruaUueivpeiKgueCueeahCDlsYDpg6ggWiDpobrluo/lkozlkI3lrZfjgIJcbiAgICAgKiBAbWV0aG9kIGFkZENoaWxkXG4gICAgICogQHBhcmFtIHtOb2RlfSBjaGlsZCAtIEEgY2hpbGQgbm9kZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbekluZGV4XSAtIFogb3JkZXIgZm9yIGRyYXdpbmcgcHJpb3JpdHkuIFBsZWFzZSByZWZlciB0byB6SW5kZXggcHJvcGVydHlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWVdIC0gQSBuYW1lIHRvIGlkZW50aWZ5IHRoZSBub2RlIGVhc2lseS4gUGxlYXNlIHJlZmVyIHRvIG5hbWUgcHJvcGVydHlcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5vZGUuYWRkQ2hpbGQobmV3Tm9kZSwgMSwgXCJub2RlXCIpO1xuICAgICAqL1xuICAgIGFkZENoaWxkIChjaGlsZCwgekluZGV4LCBuYW1lKSB7XG4gICAgICAgIGlmIChDQ19ERVYgJiYgIWNjLk5vZGUuaXNOb2RlKGNoaWxkKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9ySUQoMTYzNCwgY2MuanMuZ2V0Q2xhc3NOYW1lKGNoaWxkKSk7XG4gICAgICAgIH1cbiAgICAgICAgY2MuYXNzZXJ0SUQoY2hpbGQsIDE2MDYpO1xuICAgICAgICBjYy5hc3NlcnRJRChjaGlsZC5fcGFyZW50ID09PSBudWxsLCAxNjA1KTtcblxuICAgICAgICAvLyBpbnZva2VzIHRoZSBwYXJlbnQgc2V0dGVyXG4gICAgICAgIGNoaWxkLnBhcmVudCA9IHRoaXM7XG5cbiAgICAgICAgaWYgKHpJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjaGlsZC56SW5kZXggPSB6SW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2hpbGQubmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTdG9wcyBhbGwgcnVubmluZyBhY3Rpb25zIGFuZCBzY2hlZHVsZXJzLlxuICAgICAqICEjemgg5YGc5q2i5omA5pyJ5q2j5Zyo5pKt5pS+55qE5Yqo5L2c5ZKM6K6h5pe25Zmo44CCXG4gICAgICogQG1ldGhvZCBjbGVhbnVwXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBub2RlLmNsZWFudXAoKTtcbiAgICAgKi9cbiAgICBjbGVhbnVwICgpIHtcbiAgICAgICAgLy8gYWN0aW9uc1xuICAgICAgICBBY3Rpb25NYW5hZ2VyRXhpc3QgJiYgY2MuZGlyZWN0b3IuZ2V0QWN0aW9uTWFuYWdlcigpLnJlbW92ZUFsbEFjdGlvbnNGcm9tVGFyZ2V0KHRoaXMpO1xuICAgICAgICAvLyBldmVudFxuICAgICAgICBldmVudE1hbmFnZXIucmVtb3ZlTGlzdGVuZXJzKHRoaXMpO1xuXG4gICAgICAgIC8vIGNoaWxkcmVuXG4gICAgICAgIHZhciBpLCBsZW4gPSB0aGlzLl9jaGlsZHJlbi5sZW5ndGgsIG5vZGU7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgbm9kZSA9IHRoaXMuX2NoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKG5vZGUpXG4gICAgICAgICAgICAgICAgbm9kZS5jbGVhbnVwKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTb3J0cyB0aGUgY2hpbGRyZW4gYXJyYXkgZGVwZW5kcyBvbiBjaGlsZHJlbidzIHpJbmRleCBhbmQgYXJyaXZhbE9yZGVyLFxuICAgICAqIG5vcm1hbGx5IHlvdSB3b24ndCBuZWVkIHRvIGludm9rZSB0aGlzIGZ1bmN0aW9uLlxuICAgICAqICEjemgg5qC55o2u5a2Q6IqC54K555qEIHpJbmRleCDlkowgYXJyaXZhbE9yZGVyIOi/m+ihjOaOkuW6j++8jOato+W4uOaDheWGteS4i+W8gOWPkeiAheS4jemcgOimgeaJi+WKqOiwg+eUqOi/meS4quWHveaVsOOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBzb3J0QWxsQ2hpbGRyZW5cbiAgICAgKi9cbiAgICBzb3J0QWxsQ2hpbGRyZW4gKCkge1xuICAgICAgICBpZiAodGhpcy5fcmVvcmRlckNoaWxkRGlydHkpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fcmVvcmRlckNoaWxkRGlydHkgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gZGVsYXkgdXBkYXRlIGFycml2YWxPcmRlciBiZWZvcmUgc29ydCBjaGlsZHJlblxuICAgICAgICAgICAgdmFyIF9jaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLCBjaGlsZDtcbiAgICAgICAgICAgIC8vIHJlc2V0IGFycml2YWxPcmRlciBiZWZvcmUgc29ydCBjaGlsZHJlblxuICAgICAgICAgICAgdGhpcy5fY2hpbGRBcnJpdmFsT3JkZXIgPSAxO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IF9jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIGNoaWxkID0gX2NoaWxkcmVuW2ldO1xuICAgICAgICAgICAgICAgIGNoaWxkLl91cGRhdGVPcmRlck9mQXJyaXZhbCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBPcHRpbWl6ZSByZW9yZGVyaW5nIGV2ZW50IGNvZGUgdG8gZml4IHByb2JsZW1zIHdpdGggc2V0dGluZyB6aW5kZXhcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2Nvcy1jcmVhdG9yLzJkLXRhc2tzL2lzc3Vlcy8xMTg2XG4gICAgICAgICAgICBldmVudE1hbmFnZXIuX3NldERpcnR5Rm9yTm9kZSh0aGlzKTtcblxuICAgICAgICAgICAgaWYgKF9jaGlsZHJlbi5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgLy8gaW5zZXJ0aW9uIHNvcnRcbiAgICAgICAgICAgICAgICB2YXIgaiwgY2hpbGQ7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDEsIGxlbiA9IF9jaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IF9jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICAgICAgaiA9IGkgLSAxO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vY29udGludWUgbW92aW5nIGVsZW1lbnQgZG93bndhcmRzIHdoaWxlIHpPcmRlciBpcyBzbWFsbGVyIG9yIHdoZW4gek9yZGVyIGlzIHRoZSBzYW1lIGJ1dCBtdXRhdGVkSW5kZXggaXMgc21hbGxlclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaiA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQuX2xvY2FsWk9yZGVyIDwgX2NoaWxkcmVuW2pdLl9sb2NhbFpPcmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jaGlsZHJlbltqICsgMV0gPSBfY2hpbGRyZW5bal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9jaGlsZHJlbltqICsgMV0gPSBjaGlsZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KEV2ZW50VHlwZS5DSElMRF9SRU9SREVSLCB0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLl9fZmFzdE9mZihjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUsIHRoaXMuc29ydEFsbENoaWxkcmVuLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZGVsYXlTb3J0ICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9yZW9yZGVyQ2hpbGREaXJ0eSkge1xuICAgICAgICAgICAgdGhpcy5fcmVvcmRlckNoaWxkRGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgY2MuZGlyZWN0b3IuX19mYXN0T24oY2MuRGlyZWN0b3IuRVZFTlRfQUZURVJfVVBEQVRFLCB0aGlzLnNvcnRBbGxDaGlsZHJlbiwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3Jlc3RvcmVQcm9wZXJ0aWVzOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICAvKlxuICAgICAgICAgKiBUT0RPOiBSZWZpbmUgdGhpcyBjb2RlIGFmdGVyIGNvbXBsZXRpbmcgdW5kby9yZWRvIDIuMC5cbiAgICAgICAgICogVGhlIG5vZGUgd2lsbCBiZSBkZXN0cm95ZWQgd2hlbiBkZWxldGluZyBpbiB0aGUgZWRpdG9yLFxuICAgICAgICAgKiBidXQgaXQgd2lsbCBiZSByZXNlcnZlZCBhbmQgcmV1c2VkIGZvciB1bmRvLlxuICAgICAgICAqL1xuXG4gICAgICAgIC8vIHJlc3RvcmUgM2Qgbm9kZVxuICAgICAgICB0aGlzLmlzM0ROb2RlID0gdGhpcy5pczNETm9kZTtcblxuICAgICAgICBpZiAoIXRoaXMuX21hdHJpeCkge1xuICAgICAgICAgICAgdGhpcy5fbWF0cml4ID0gY2MubWF0NCh0aGlzLl9zcGFjZUluZm8ubG9jYWxNYXQpO1xuICAgICAgICAgICAgTWF0NC5pZGVudGl0eSh0aGlzLl9tYXRyaXgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fd29ybGRNYXRyaXgpIHtcbiAgICAgICAgICAgIHRoaXMuX3dvcmxkTWF0cml4ID0gY2MubWF0NCh0aGlzLl9zcGFjZUluZm8ud29ybGRNYXQpO1xuICAgICAgICAgICAgTWF0NC5pZGVudGl0eSh0aGlzLl93b3JsZE1hdHJpeCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9sb2NhbE1hdERpcnR5ID0gTG9jYWxEaXJ0eUZsYWcuQUxMO1xuICAgICAgICB0aGlzLl93b3JsZE1hdERpcnR5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLl9mcm9tRXVsZXIoKTtcblxuICAgICAgICB0aGlzLl9yZW5kZXJGbGFnIHw9IFJlbmRlckZsb3cuRkxBR19UUkFOU0ZPUk07XG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJDb21wb25lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckNvbXBvbmVudC5tYXJrRm9yUmVuZGVyKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckZsYWcgfD0gUmVuZGVyRmxvdy5GTEFHX0NISUxEUkVOO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uUmVzdG9yZTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fb25SZXN0b3JlQmFzZSgpO1xuXG4gICAgICAgIHRoaXMuX3Jlc3RvcmVQcm9wZXJ0aWVzKCk7XG5cbiAgICAgICAgdmFyIGFjdGlvbk1hbmFnZXIgPSBjYy5kaXJlY3Rvci5nZXRBY3Rpb25NYW5hZ2VyKCk7XG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmVJbkhpZXJhcmNoeSkge1xuICAgICAgICAgICAgYWN0aW9uTWFuYWdlciAmJiBhY3Rpb25NYW5hZ2VyLnJlc3VtZVRhcmdldCh0aGlzKTtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5yZXN1bWVUYXJnZXQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhY3Rpb25NYW5hZ2VyICYmIGFjdGlvbk1hbmFnZXIucGF1c2VUYXJnZXQodGhpcyk7XG4gICAgICAgICAgICBldmVudE1hbmFnZXIucGF1c2VUYXJnZXQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG5cbn07XG5cbmlmIChDQ19FRElUT1IpIHtcbiAgICAvLyBkZXByZWNhdGVkLCBvbmx5IHVzZWQgdG8gaW1wb3J0IG9sZCBkYXRhIGluIGVkaXRvclxuICAgIGpzLm1peGluKE5vZGVEZWZpbmVzLnByb3BlcnRpZXMsIHtcbiAgICAgICAgX3NjYWxlWDoge1xuICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgICAgICBlZGl0b3JPbmx5OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIF9zY2FsZVk6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICAgICAgZWRpdG9yT25seTogdHJ1ZVxuICAgICAgICB9LFxuICAgIH0pO1xufVxuXG5sZXQgTm9kZSA9IGNjLkNsYXNzKE5vZGVEZWZpbmVzKTtcblxuLy8gM0QgTm9kZSBQcm9wZXJ0eVxuXG5cbi8vIE5vZGUgRXZlbnRcblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgcG9zaXRpb24gY2hhbmdpbmcgZXZlbnQsIHlvdSBjYW4gbGlzdGVuIHRvIHRoaXMgZXZlbnQgdGhyb3VnaCB0aGUgc3RhdGVtZW50IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5QT1NJVElPTl9DSEFOR0VELCBjYWxsYmFjaywgdGhpcyk7XG4gKiAhI3poXG4gKiDkvY3nva7lj5jliqjnm5HlkKzkuovku7YsIOmAmui/hyB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCwgY2FsbGJhY2ssIHRoaXMpOyDov5vooYznm5HlkKzjgIJcbiAqIEBldmVudCBwb3NpdGlvbi1jaGFuZ2VkXG4gKiBAcGFyYW0ge1ZlYzJ9IG9sZFBvcyAtIFRoZSBvbGQgcG9zaXRpb24sIGJ1dCB0aGlzIHBhcmFtZXRlciBpcyBvbmx5IGF2YWlsYWJsZSBpbiBlZGl0b3IhXG4gKi9cbi8qKlxuICogISNlblxuICogVGhlIHNpemUgY2hhbmdpbmcgZXZlbnQsIHlvdSBjYW4gbGlzdGVuIHRvIHRoaXMgZXZlbnQgdGhyb3VnaCB0aGUgc3RhdGVtZW50IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIGNhbGxiYWNrLCB0aGlzKTtcbiAqICEjemhcbiAqIOWwuuWvuOWPmOWKqOebkeWQrOS6i+S7tu+8jOmAmui/hyB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCBjYWxsYmFjaywgdGhpcyk7IOi/m+ihjOebkeWQrOOAglxuICogQGV2ZW50IHNpemUtY2hhbmdlZFxuICogQHBhcmFtIHtTaXplfSBvbGRTaXplIC0gVGhlIG9sZCBzaXplLCBidXQgdGhpcyBwYXJhbWV0ZXIgaXMgb25seSBhdmFpbGFibGUgaW4gZWRpdG9yIVxuICovXG4vKipcbiAqICEjZW5cbiAqIFRoZSBhbmNob3IgY2hhbmdpbmcgZXZlbnQsIHlvdSBjYW4gbGlzdGVuIHRvIHRoaXMgZXZlbnQgdGhyb3VnaCB0aGUgc3RhdGVtZW50IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgY2FsbGJhY2ssIHRoaXMpO1xuICogISN6aFxuICog6ZSa54K55Y+Y5Yqo55uR5ZCs5LqL5Lu277yM6YCa6L+HIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgY2FsbGJhY2ssIHRoaXMpOyDov5vooYznm5HlkKzjgIJcbiAqIEBldmVudCBhbmNob3ItY2hhbmdlZFxuICovXG4vKipcbiAqICEjZW5cbiAqIFRoZSBhZGRpbmcgY2hpbGQgZXZlbnQsIHlvdSBjYW4gbGlzdGVuIHRvIHRoaXMgZXZlbnQgdGhyb3VnaCB0aGUgc3RhdGVtZW50IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5DSElMRF9BRERFRCwgY2FsbGJhY2ssIHRoaXMpO1xuICogISN6aFxuICog5aKe5Yqg5a2Q6IqC54K555uR5ZCs5LqL5Lu277yM6YCa6L+HIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5DSElMRF9BRERFRCwgY2FsbGJhY2ssIHRoaXMpOyDov5vooYznm5HlkKzjgIJcbiAqIEBldmVudCBjaGlsZC1hZGRlZFxuICogQHBhcmFtIHtOb2RlfSBjaGlsZCAtIGNoaWxkIHdoaWNoIGhhdmUgYmVlbiBhZGRlZFxuICovXG4vKipcbiAqICEjZW5cbiAqIFRoZSByZW1vdmluZyBjaGlsZCBldmVudCwgeW91IGNhbiBsaXN0ZW4gdG8gdGhpcyBldmVudCB0aHJvdWdoIHRoZSBzdGF0ZW1lbnQgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkNISUxEX1JFTU9WRUQsIGNhbGxiYWNrLCB0aGlzKTtcbiAqICEjemhcbiAqIOWIoOmZpOWtkOiKgueCueebkeWQrOS6i+S7tu+8jOmAmui/hyB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuQ0hJTERfUkVNT1ZFRCwgY2FsbGJhY2ssIHRoaXMpOyDov5vooYznm5HlkKzjgIJcbiAqIEBldmVudCBjaGlsZC1yZW1vdmVkXG4gKiBAcGFyYW0ge05vZGV9IGNoaWxkIC0gY2hpbGQgd2hpY2ggaGF2ZSBiZWVuIHJlbW92ZWRcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBUaGUgcmVvcmRlcmluZyBjaGlsZCBldmVudCwgeW91IGNhbiBsaXN0ZW4gdG8gdGhpcyBldmVudCB0aHJvdWdoIHRoZSBzdGF0ZW1lbnQgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkNISUxEX1JFT1JERVIsIGNhbGxiYWNrLCB0aGlzKTtcbiAqICEjemhcbiAqIOWtkOiKgueCuemhuuW6j+WPmOWKqOebkeWQrOS6i+S7tu+8jOmAmui/hyB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuQ0hJTERfUkVPUkRFUiwgY2FsbGJhY2ssIHRoaXMpOyDov5vooYznm5HlkKzjgIJcbiAqIEBldmVudCBjaGlsZC1yZW9yZGVyXG4gKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBub2RlIHdob3NlIGNoaWxkcmVuIGhhdmUgYmVlbiByZW9yZGVyZWRcbiAqL1xuLyoqXG4gKiAhI2VuXG4gKiBUaGUgZ3JvdXAgY2hhbmdpbmcgZXZlbnQsIHlvdSBjYW4gbGlzdGVuIHRvIHRoaXMgZXZlbnQgdGhyb3VnaCB0aGUgc3RhdGVtZW50IHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5HUk9VUF9DSEFOR0VELCBjYWxsYmFjaywgdGhpcyk7XG4gKiAhI3poXG4gKiDoioLngrnliIbnu4Tlj5jliqjnm5HlkKzkuovku7bvvIzpgJrov4cgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLkdST1VQX0NIQU5HRUQsIGNhbGxiYWNrLCB0aGlzKTsg6L+b6KGM55uR5ZCs44CCXG4gKiBAZXZlbnQgZ3JvdXAtY2hhbmdlZFxuICogQHBhcmFtIHtOb2RlfSBub2RlIC0gbm9kZSB3aG9zZSBncm91cCBoYXMgY2hhbmdlZFxuICovXG5cbi8vIERlcHJlY2F0ZWQgQVBJc1xuXG4vKipcbiAqICEjZW5cbiAqIFJldHVybnMgdGhlIGRpc3BsYXllZCBvcGFjaXR5IG9mIE5vZGUsXG4gKiB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIGRpc3BsYXllZCBvcGFjaXR5IGFuZCBvcGFjaXR5IGlzIHRoYXQgZGlzcGxheWVkIG9wYWNpdHkgaXMgY2FsY3VsYXRlZCBiYXNlZCBvbiBvcGFjaXR5IGFuZCBwYXJlbnQgbm9kZSdzIG9wYWNpdHkgd2hlbiBjYXNjYWRlIG9wYWNpdHkgZW5hYmxlZC5cbiAqICEjemhcbiAqIOiOt+WPluiKgueCueaYvuekuumAj+aYjuW6pu+8jFxuICog5pi+56S66YCP5piO5bqm5ZKM6YCP5piO5bqm5LmL6Ze055qE5LiN5ZCM5LmL5aSE5Zyo5LqO5b2T5ZCv55So57qn6L+e6YCP5piO5bqm5pe277yMXG4gKiDmmL7npLrpgI/mmI7luqbmmK/ln7rkuo7oh6rouqvpgI/mmI7luqblkozniLboioLngrnpgI/mmI7luqborqHnrpfnmoTjgIJcbiAqXG4gKiBAbWV0aG9kIGdldERpc3BsYXllZE9wYWNpdHlcbiAqIEByZXR1cm4ge251bWJlcn0gZGlzcGxheWVkIG9wYWNpdHlcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjAsIHBsZWFzZSB1c2Ugb3BhY2l0eSBwcm9wZXJ0eSwgY2FzY2FkZSBvcGFjaXR5IGlzIHJlbW92ZWRcbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIFJldHVybnMgdGhlIGRpc3BsYXllZCBjb2xvciBvZiBOb2RlLFxuICogdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiBkaXNwbGF5ZWQgY29sb3IgYW5kIGNvbG9yIGlzIHRoYXQgZGlzcGxheWVkIGNvbG9yIGlzIGNhbGN1bGF0ZWQgYmFzZWQgb24gY29sb3IgYW5kIHBhcmVudCBub2RlJ3MgY29sb3Igd2hlbiBjYXNjYWRlIGNvbG9yIGVuYWJsZWQuXG4gKiAhI3poXG4gKiDojrflj5boioLngrnnmoTmmL7npLrpopzoibLvvIxcbiAqIOaYvuekuuminOiJsuWSjOminOiJsuS5i+mXtOeahOS4jeWQjOS5i+WkhOWcqOS6juW9k+WQr+eUqOe6p+i/numinOiJsuaXtu+8jFxuICog5pi+56S66aKc6Imy5piv5Z+65LqO6Ieq6Lqr6aKc6Imy5ZKM54i26IqC54K56aKc6Imy6K6h566X55qE44CCXG4gKlxuICogQG1ldGhvZCBnZXREaXNwbGF5ZWRDb2xvclxuICogQHJldHVybiB7Q29sb3J9XG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wLCBwbGVhc2UgdXNlIGNvbG9yIHByb3BlcnR5LCBjYXNjYWRlIGNvbG9yIGlzIHJlbW92ZWRcbiAqL1xuXG4vKipcbiAqICEjZW4gQ2FzY2FkZSBvcGFjaXR5IGlzIHJlbW92ZWQgZnJvbSB2Mi4wXG4gKiBJbmRpY2F0ZSB3aGV0aGVyIG5vZGUncyBvcGFjaXR5IHZhbHVlIGFmZmVjdCBpdHMgY2hpbGQgbm9kZXMsIGRlZmF1bHQgdmFsdWUgaXMgdHJ1ZS5cbiAqICEjemgg6YCP5piO5bqm57qn6IGU5Yqf6IO95LuOIHYyLjAg5byA5aeL5bey56e76ZmkXG4gKiDoioLngrnnmoTkuI3pgI/mmI7luqblgLzmmK/lkKblvbHlk43lhbblrZDoioLngrnvvIzpu5jorqTlgLzkuLogdHJ1ZeOAglxuICogQHByb3BlcnR5IGNhc2NhZGVPcGFjaXR5XG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXG4gKiBAdHlwZSB7Qm9vbGVhbn1cbiAqL1xuXG4vKipcbiAqICEjZW4gQ2FzY2FkZSBvcGFjaXR5IGlzIHJlbW92ZWQgZnJvbSB2Mi4wXG4gKiBSZXR1cm5zIHdoZXRoZXIgbm9kZSdzIG9wYWNpdHkgdmFsdWUgYWZmZWN0IGl0cyBjaGlsZCBub2Rlcy5cbiAqICEjemgg6YCP5piO5bqm57qn6IGU5Yqf6IO95LuOIHYyLjAg5byA5aeL5bey56e76ZmkXG4gKiDov5Tlm57oioLngrnnmoTkuI3pgI/mmI7luqblgLzmmK/lkKblvbHlk43lhbblrZDoioLngrnjgIJcbiAqIEBtZXRob2QgaXNDYXNjYWRlT3BhY2l0eUVuYWJsZWRcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuLyoqXG4gKiAhI2VuIENhc2NhZGUgb3BhY2l0eSBpcyByZW1vdmVkIGZyb20gdjIuMFxuICogRW5hYmxlIG9yIGRpc2FibGUgY2FzY2FkZSBvcGFjaXR5LCBpZiBjYXNjYWRlIGVuYWJsZWQsIGNoaWxkIG5vZGVzJyBvcGFjaXR5IHdpbGwgYmUgdGhlIG11bHRpcGxpY2F0aW9uIG9mIHBhcmVudCBvcGFjaXR5IGFuZCBpdHMgb3duIG9wYWNpdHkuXG4gKiAhI3poIOmAj+aYjuW6pue6p+iBlOWKn+iDveS7jiB2Mi4wIOW8gOWni+W3suenu+mZpFxuICog5ZCv55So5oiW56aB55So57qn6L+e5LiN6YCP5piO5bqm77yM5aaC5p6c57qn6L+e5ZCv55So77yM5a2Q6IqC54K555qE5LiN6YCP5piO5bqm5bCG5piv54i25LiN6YCP5piO5bqm5LmY5LiK5a6D6Ieq5bex55qE5LiN6YCP5piO5bqm44CCXG4gKiBAbWV0aG9kIHNldENhc2NhZGVPcGFjaXR5RW5hYmxlZFxuICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxuICogQHBhcmFtIHtCb29sZWFufSBjYXNjYWRlT3BhY2l0eUVuYWJsZWRcbiAqL1xuXG4vKipcbiAqICEjZW4gT3BhY2l0eSBtb2RpZnkgUkdCIGhhdmUgYmVlbiByZW1vdmVkIHNpbmNlIHYyLjBcbiAqIFNldCB3aGV0aGVyIGNvbG9yIHNob3VsZCBiZSBjaGFuZ2VkIHdpdGggdGhlIG9wYWNpdHkgdmFsdWUsXG4gKiB1c2VsZXNzIGluIGNjc2cuTm9kZSwgYnV0IHRoaXMgZnVuY3Rpb24gaXMgb3ZlcnJpZGUgaW4gc29tZSBjbGFzcyB0byBoYXZlIHN1Y2ggYmVoYXZpb3IuXG4gKiAhI3poIOmAj+aYjuW6puW9seWTjeminOiJsumFjee9ruW3sue7j+iiq+W6n+W8g1xuICog6K6+572u5pu05pS56YCP5piO5bqm5pe25piv5ZCm5L+u5pS5UkdC5YC877yMXG4gKiBAbWV0aG9kIHNldE9wYWNpdHlNb2RpZnlSR0JcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb3BhY2l0eVZhbHVlXG4gKi9cblxuLyoqXG4gKiAhI2VuIE9wYWNpdHkgbW9kaWZ5IFJHQiBoYXZlIGJlZW4gcmVtb3ZlZCBzaW5jZSB2Mi4wXG4gKiBHZXQgd2hldGhlciBjb2xvciBzaG91bGQgYmUgY2hhbmdlZCB3aXRoIHRoZSBvcGFjaXR5IHZhbHVlLlxuICogISN6aCDpgI/mmI7luqblvbHlk43popzoibLphY3nva7lt7Lnu4/ooqvlup/lvINcbiAqIOiOt+WPluabtOaUuemAj+aYjuW6puaXtuaYr+WQpuS/ruaUuVJHQuWAvOOAglxuICogQG1ldGhvZCBpc09wYWNpdHlNb2RpZnlSR0JcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cblxuXG5sZXQgX3AgPSBOb2RlLnByb3RvdHlwZTtcbmpzLmdldHNldChfcCwgJ3Bvc2l0aW9uJywgX3AuZ2V0UG9zaXRpb24sIF9wLnNldFBvc2l0aW9uLCBmYWxzZSwgdHJ1ZSk7XG5cbmlmIChDQ19FRElUT1IpIHtcbiAgICBsZXQgdmVjM190bXAgPSBuZXcgVmVjMygpO1xuICAgIGNjLmpzLmdldHNldChfcCwgJ3dvcmxkRXVsZXJBbmdsZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBhbmdsZXMgPSBuZXcgVmVjMyh0aGlzLl9ldWxlckFuZ2xlcyk7XG4gICAgICAgIGxldCBwYXJlbnQgPSB0aGlzLnBhcmVudDtcbiAgICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICAgICAgYW5nbGVzLmFkZFNlbGYocGFyZW50Ll9ldWxlckFuZ2xlcyk7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbmdsZXM7XG4gICAgfSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgdmVjM190bXAuc2V0KHYpO1xuICAgICAgICBsZXQgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG4gICAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgICAgIHZlYzNfdG1wLnN1YlNlbGYocGFyZW50Ll9ldWxlckFuZ2xlcyk7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXVsZXJBbmdsZXMgPSB2ZWMzX3RtcDtcbiAgICB9KTtcbn1cblxuY2MuTm9kZSA9IG1vZHVsZS5leHBvcnRzID0gTm9kZTtcbiJdfQ==