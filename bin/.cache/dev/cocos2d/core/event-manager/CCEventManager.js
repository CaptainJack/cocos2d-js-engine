
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/event-manager/CCEventManager.js';
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

require('./CCEventListener');

var ListenerID = cc.EventListener.ListenerID;

var _EventListenerVector = function _EventListenerVector() {
  this._fixedListeners = [];
  this._sceneGraphListeners = [];
  this.gt0Index = 0;
};

_EventListenerVector.prototype = {
  constructor: _EventListenerVector,
  size: function size() {
    return this._fixedListeners.length + this._sceneGraphListeners.length;
  },
  empty: function empty() {
    return this._fixedListeners.length === 0 && this._sceneGraphListeners.length === 0;
  },
  push: function push(listener) {
    if (listener._getFixedPriority() === 0) this._sceneGraphListeners.push(listener);else this._fixedListeners.push(listener);
  },
  clearSceneGraphListeners: function clearSceneGraphListeners() {
    this._sceneGraphListeners.length = 0;
  },
  clearFixedListeners: function clearFixedListeners() {
    this._fixedListeners.length = 0;
  },
  clear: function clear() {
    this._sceneGraphListeners.length = 0;
    this._fixedListeners.length = 0;
  },
  getFixedPriorityListeners: function getFixedPriorityListeners() {
    return this._fixedListeners;
  },
  getSceneGraphPriorityListeners: function getSceneGraphPriorityListeners() {
    return this._sceneGraphListeners;
  }
};

var __getListenerID = function __getListenerID(event) {
  var eventType = cc.Event,
      type = event.type;
  if (type === eventType.ACCELERATION) return ListenerID.ACCELERATION;
  if (type === eventType.KEYBOARD) return ListenerID.KEYBOARD;
  if (type.startsWith(eventType.MOUSE)) return ListenerID.MOUSE;

  if (type.startsWith(eventType.TOUCH)) {
    // Touch listener is very special, it contains two kinds of listeners, EventListenerTouchOneByOne and EventListenerTouchAllAtOnce.
    // return UNKNOWN instead.
    cc.logID(2000);
  }

  return "";
};
/**
 * !#en
 * This class has been deprecated, please use cc.systemEvent or cc.EventTarget instead. See [Listen to and launch events](../../../manual/en/scripting/events.md) for details.<br>
 * <br>
 * cc.eventManager is a singleton object which manages event listener subscriptions and event dispatching.
 * The EventListener list is managed in such way so that event listeners can be added and removed
 * while events are being dispatched.
 *
 * !#zh
 * 该类已废弃，请使用 cc.systemEvent 或 cc.EventTarget 代替，详见 [监听和发射事件](../../../manual/zh/scripting/events.md)。<br>
 * <br>
 * 事件管理器，它主要管理事件监听器注册和派发系统事件。
 *
 * @class eventManager
 * @static
 * @example {@link cocos2d/core/event-manager/CCEventManager/addListener.js}
 * @deprecated
 */


var eventManager = {
  //Priority dirty flag
  DIRTY_NONE: 0,
  DIRTY_FIXED_PRIORITY: 1 << 0,
  DIRTY_SCENE_GRAPH_PRIORITY: 1 << 1,
  DIRTY_ALL: 3,
  _listenersMap: {},
  _priorityDirtyFlagMap: {},
  _nodeListenersMap: {},
  _toAddedListeners: [],
  _toRemovedListeners: [],
  _dirtyListeners: {},
  _inDispatch: 0,
  _isEnabled: false,
  _currentTouch: null,
  _internalCustomListenerIDs: [],
  _setDirtyForNode: function _setDirtyForNode(node) {
    // Mark the node dirty only when there is an event listener associated with it.
    var selListeners = this._nodeListenersMap[node._id];

    if (selListeners !== undefined) {
      for (var j = 0, len = selListeners.length; j < len; j++) {
        var selListener = selListeners[j];

        var listenerID = selListener._getListenerID();

        if (this._dirtyListeners[listenerID] == null) this._dirtyListeners[listenerID] = true;
      }
    }

    if (node.childrenCount > 0) {
      var children = node._children;

      for (var i = 0, _len = children.length; i < _len; i++) {
        this._setDirtyForNode(children[i]);
      }
    }
  },

  /**
   * !#en Pauses all listeners which are associated the specified target.
   * !#zh 暂停传入的 node 相关的所有监听器的事件响应。
   * @method pauseTarget
   * @param {Node} node
   * @param {Boolean} [recursive=false]
   */
  pauseTarget: function pauseTarget(node, recursive) {
    if (!(node instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    var listeners = this._nodeListenersMap[node._id],
        i,
        len;

    if (listeners) {
      for (i = 0, len = listeners.length; i < len; i++) {
        listeners[i]._setPaused(true);
      }
    }

    if (recursive === true) {
      var locChildren = node._children;

      for (i = 0, len = locChildren ? locChildren.length : 0; i < len; i++) {
        this.pauseTarget(locChildren[i], true);
      }
    }
  },

  /**
   * !#en Resumes all listeners which are associated the specified target.
   * !#zh 恢复传入的 node 相关的所有监听器的事件响应。
   * @method resumeTarget
   * @param {Node} node
   * @param {Boolean} [recursive=false]
   */
  resumeTarget: function resumeTarget(node, recursive) {
    if (!(node instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    var listeners = this._nodeListenersMap[node._id],
        i,
        len;

    if (listeners) {
      for (i = 0, len = listeners.length; i < len; i++) {
        listeners[i]._setPaused(false);
      }
    }

    this._setDirtyForNode(node);

    if (recursive === true) {
      var locChildren = node._children;

      for (i = 0, len = locChildren ? locChildren.length : 0; i < len; i++) {
        this.resumeTarget(locChildren[i], true);
      }
    }
  },
  _addListener: function _addListener(listener) {
    if (this._inDispatch === 0) this._forceAddEventListener(listener);else this._toAddedListeners.push(listener);
  },
  _forceAddEventListener: function _forceAddEventListener(listener) {
    var listenerID = listener._getListenerID();

    var listeners = this._listenersMap[listenerID];

    if (!listeners) {
      listeners = new _EventListenerVector();
      this._listenersMap[listenerID] = listeners;
    }

    listeners.push(listener);

    if (listener._getFixedPriority() === 0) {
      this._setDirty(listenerID, this.DIRTY_SCENE_GRAPH_PRIORITY);

      var node = listener._getSceneGraphPriority();

      if (node === null) cc.logID(3507);

      this._associateNodeAndEventListener(node, listener);

      if (node.activeInHierarchy) this.resumeTarget(node);
    } else this._setDirty(listenerID, this.DIRTY_FIXED_PRIORITY);
  },
  _getListeners: function _getListeners(listenerID) {
    return this._listenersMap[listenerID];
  },
  _updateDirtyFlagForSceneGraph: function _updateDirtyFlagForSceneGraph() {
    var locDirtyListeners = this._dirtyListeners;

    for (var selKey in locDirtyListeners) {
      this._setDirty(selKey, this.DIRTY_SCENE_GRAPH_PRIORITY);
    }

    this._dirtyListeners = {};
  },
  _removeAllListenersInVector: function _removeAllListenersInVector(listenerVector) {
    if (!listenerVector) return;
    var selListener;

    for (var i = listenerVector.length - 1; i >= 0; i--) {
      selListener = listenerVector[i];

      selListener._setRegistered(false);

      if (selListener._getSceneGraphPriority() != null) {
        this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);

        selListener._setSceneGraphPriority(null); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.

      }

      if (this._inDispatch === 0) cc.js.array.removeAt(listenerVector, i);
    }
  },
  _removeListenersForListenerID: function _removeListenersForListenerID(listenerID) {
    var listeners = this._listenersMap[listenerID],
        i;

    if (listeners) {
      var fixedPriorityListeners = listeners.getFixedPriorityListeners();
      var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

      this._removeAllListenersInVector(sceneGraphPriorityListeners);

      this._removeAllListenersInVector(fixedPriorityListeners); // Remove the dirty flag according the 'listenerID'.
      // No need to check whether the dispatcher is dispatching event.


      delete this._priorityDirtyFlagMap[listenerID];

      if (!this._inDispatch) {
        listeners.clear();
        delete this._listenersMap[listenerID];
      }
    }

    var locToAddedListeners = this._toAddedListeners,
        listener;

    for (i = locToAddedListeners.length - 1; i >= 0; i--) {
      listener = locToAddedListeners[i];
      if (listener && listener._getListenerID() === listenerID) cc.js.array.removeAt(locToAddedListeners, i);
    }
  },
  _sortEventListeners: function _sortEventListeners(listenerID) {
    var dirtyFlag = this.DIRTY_NONE,
        locFlagMap = this._priorityDirtyFlagMap;
    if (locFlagMap[listenerID]) dirtyFlag = locFlagMap[listenerID];

    if (dirtyFlag !== this.DIRTY_NONE) {
      // Clear the dirty flag first, if `rootNode` is null, then set its dirty flag of scene graph priority
      locFlagMap[listenerID] = this.DIRTY_NONE;
      if (dirtyFlag & this.DIRTY_FIXED_PRIORITY) this._sortListenersOfFixedPriority(listenerID);

      if (dirtyFlag & this.DIRTY_SCENE_GRAPH_PRIORITY) {
        var rootEntity = cc.director.getScene();
        if (rootEntity) this._sortListenersOfSceneGraphPriority(listenerID);
      }
    }
  },
  _sortListenersOfSceneGraphPriority: function _sortListenersOfSceneGraphPriority(listenerID) {
    var listeners = this._getListeners(listenerID);

    if (!listeners) return;
    var sceneGraphListener = listeners.getSceneGraphPriorityListeners();
    if (!sceneGraphListener || sceneGraphListener.length === 0) return; // After sort: priority < 0, > 0

    listeners.getSceneGraphPriorityListeners().sort(this._sortEventListenersOfSceneGraphPriorityDes);
  },
  _sortEventListenersOfSceneGraphPriorityDes: function _sortEventListenersOfSceneGraphPriorityDes(l1, l2) {
    var node1 = l1._getSceneGraphPriority(),
        node2 = l2._getSceneGraphPriority();

    if (!l2 || !node2 || !node2._activeInHierarchy || node2._parent === null) return -1;else if (!l1 || !node1 || !node1._activeInHierarchy || node1._parent === null) return 1;
    var p1 = node1,
        p2 = node2,
        ex = false;

    while (p1._parent._id !== p2._parent._id) {
      p1 = p1._parent._parent === null ? (ex = true) && node2 : p1._parent;
      p2 = p2._parent._parent === null ? (ex = true) && node1 : p2._parent;
    }

    if (p1._id === p2._id) {
      if (p1._id === node2._id) return -1;
      if (p1._id === node1._id) return 1;
    }

    return ex ? p1._localZOrder - p2._localZOrder : p2._localZOrder - p1._localZOrder;
  },
  _sortListenersOfFixedPriority: function _sortListenersOfFixedPriority(listenerID) {
    var listeners = this._listenersMap[listenerID];
    if (!listeners) return;
    var fixedListeners = listeners.getFixedPriorityListeners();
    if (!fixedListeners || fixedListeners.length === 0) return; // After sort: priority < 0, > 0

    fixedListeners.sort(this._sortListenersOfFixedPriorityAsc); // FIXME: Should use binary search

    var index = 0;

    for (var len = fixedListeners.length; index < len;) {
      if (fixedListeners[index]._getFixedPriority() >= 0) break;
      ++index;
    }

    listeners.gt0Index = index;
  },
  _sortListenersOfFixedPriorityAsc: function _sortListenersOfFixedPriorityAsc(l1, l2) {
    return l1._getFixedPriority() - l2._getFixedPriority();
  },
  _onUpdateListeners: function _onUpdateListeners(listeners) {
    var fixedPriorityListeners = listeners.getFixedPriorityListeners();
    var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
    var i,
        selListener,
        idx,
        toRemovedListeners = this._toRemovedListeners;

    if (sceneGraphPriorityListeners) {
      for (i = sceneGraphPriorityListeners.length - 1; i >= 0; i--) {
        selListener = sceneGraphPriorityListeners[i];

        if (!selListener._isRegistered()) {
          cc.js.array.removeAt(sceneGraphPriorityListeners, i); // if item in toRemove list, remove it from the list

          idx = toRemovedListeners.indexOf(selListener);
          if (idx !== -1) toRemovedListeners.splice(idx, 1);
        }
      }
    }

    if (fixedPriorityListeners) {
      for (i = fixedPriorityListeners.length - 1; i >= 0; i--) {
        selListener = fixedPriorityListeners[i];

        if (!selListener._isRegistered()) {
          cc.js.array.removeAt(fixedPriorityListeners, i); // if item in toRemove list, remove it from the list

          idx = toRemovedListeners.indexOf(selListener);
          if (idx !== -1) toRemovedListeners.splice(idx, 1);
        }
      }
    }

    if (sceneGraphPriorityListeners && sceneGraphPriorityListeners.length === 0) listeners.clearSceneGraphListeners();
    if (fixedPriorityListeners && fixedPriorityListeners.length === 0) listeners.clearFixedListeners();
  },
  frameUpdateListeners: function frameUpdateListeners() {
    var locListenersMap = this._listenersMap,
        locPriorityDirtyFlagMap = this._priorityDirtyFlagMap;

    for (var selKey in locListenersMap) {
      if (locListenersMap[selKey].empty()) {
        delete locPriorityDirtyFlagMap[selKey];
        delete locListenersMap[selKey];
      }
    }

    var locToAddedListeners = this._toAddedListeners;

    if (locToAddedListeners.length !== 0) {
      for (var i = 0, len = locToAddedListeners.length; i < len; i++) {
        this._forceAddEventListener(locToAddedListeners[i]);
      }

      locToAddedListeners.length = 0;
    }

    if (this._toRemovedListeners.length !== 0) {
      this._cleanToRemovedListeners();
    }
  },
  _updateTouchListeners: function _updateTouchListeners(event) {
    var locInDispatch = this._inDispatch;
    cc.assertID(locInDispatch > 0, 3508);
    if (locInDispatch > 1) return;
    var listeners;
    listeners = this._listenersMap[ListenerID.TOUCH_ONE_BY_ONE];

    if (listeners) {
      this._onUpdateListeners(listeners);
    }

    listeners = this._listenersMap[ListenerID.TOUCH_ALL_AT_ONCE];

    if (listeners) {
      this._onUpdateListeners(listeners);
    }

    cc.assertID(locInDispatch === 1, 3509);
    var locToAddedListeners = this._toAddedListeners;

    if (locToAddedListeners.length !== 0) {
      for (var i = 0, len = locToAddedListeners.length; i < len; i++) {
        this._forceAddEventListener(locToAddedListeners[i]);
      }

      this._toAddedListeners.length = 0;
    }

    if (this._toRemovedListeners.length !== 0) {
      this._cleanToRemovedListeners();
    }
  },
  //Remove all listeners in _toRemoveListeners list and cleanup
  _cleanToRemovedListeners: function _cleanToRemovedListeners() {
    var toRemovedListeners = this._toRemovedListeners;

    for (var i = 0; i < toRemovedListeners.length; i++) {
      var selListener = toRemovedListeners[i];

      var listeners = this._listenersMap[selListener._getListenerID()];

      if (!listeners) continue;
      var idx,
          fixedPriorityListeners = listeners.getFixedPriorityListeners(),
          sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

      if (sceneGraphPriorityListeners) {
        idx = sceneGraphPriorityListeners.indexOf(selListener);

        if (idx !== -1) {
          sceneGraphPriorityListeners.splice(idx, 1);
        }
      }

      if (fixedPriorityListeners) {
        idx = fixedPriorityListeners.indexOf(selListener);

        if (idx !== -1) {
          fixedPriorityListeners.splice(idx, 1);
        }
      }
    }

    toRemovedListeners.length = 0;
  },
  _onTouchEventCallback: function _onTouchEventCallback(listener, argsObj) {
    // Skip if the listener was removed.
    if (!listener._isRegistered()) return false;
    var event = argsObj.event,
        selTouch = event.currentTouch;
    event.currentTarget = listener._node;
    var isClaimed = false,
        removedIdx;
    var getCode = event.getEventCode(),
        EventTouch = cc.Event.EventTouch;

    if (getCode === EventTouch.BEGAN) {
      if (!cc.macro.ENABLE_MULTI_TOUCH && eventManager._currentTouch) {
        return false;
      }

      if (listener.onTouchBegan) {
        isClaimed = listener.onTouchBegan(selTouch, event);

        if (isClaimed && listener._registered) {
          listener._claimedTouches.push(selTouch);

          eventManager._currentTouch = selTouch;
        }
      }
    } else if (listener._claimedTouches.length > 0 && (removedIdx = listener._claimedTouches.indexOf(selTouch)) !== -1) {
      isClaimed = true;

      if (!cc.macro.ENABLE_MULTI_TOUCH && eventManager._currentTouch && eventManager._currentTouch !== selTouch) {
        return false;
      }

      if (getCode === EventTouch.MOVED && listener.onTouchMoved) {
        listener.onTouchMoved(selTouch, event);
      } else if (getCode === EventTouch.ENDED) {
        if (listener.onTouchEnded) listener.onTouchEnded(selTouch, event);
        if (listener._registered) listener._claimedTouches.splice(removedIdx, 1);
        eventManager._currentTouch = null;
      } else if (getCode === EventTouch.CANCELLED) {
        if (listener.onTouchCancelled) listener.onTouchCancelled(selTouch, event);
        if (listener._registered) listener._claimedTouches.splice(removedIdx, 1);
        eventManager._currentTouch = null;
      }
    } // If the event was stopped, return directly.


    if (event.isStopped()) {
      eventManager._updateTouchListeners(event);

      return true;
    }

    if (isClaimed && listener.swallowTouches) {
      if (argsObj.needsMutableSet) argsObj.touches.splice(selTouch, 1);
      return true;
    }

    return false;
  },
  _dispatchTouchEvent: function _dispatchTouchEvent(event) {
    this._sortEventListeners(ListenerID.TOUCH_ONE_BY_ONE);

    this._sortEventListeners(ListenerID.TOUCH_ALL_AT_ONCE);

    var oneByOneListeners = this._getListeners(ListenerID.TOUCH_ONE_BY_ONE);

    var allAtOnceListeners = this._getListeners(ListenerID.TOUCH_ALL_AT_ONCE); // If there aren't any touch listeners, return directly.


    if (null === oneByOneListeners && null === allAtOnceListeners) return;
    var originalTouches = event.getTouches(),
        mutableTouches = cc.js.array.copy(originalTouches);
    var oneByOneArgsObj = {
      event: event,
      needsMutableSet: oneByOneListeners && allAtOnceListeners,
      touches: mutableTouches,
      selTouch: null
    }; //
    // process the target handlers 1st
    //

    if (oneByOneListeners) {
      for (var i = 0; i < originalTouches.length; i++) {
        event.currentTouch = originalTouches[i];
        event._propagationStopped = event._propagationImmediateStopped = false;

        this._dispatchEventToListeners(oneByOneListeners, this._onTouchEventCallback, oneByOneArgsObj);
      }
    } //
    // process standard handlers 2nd
    //


    if (allAtOnceListeners && mutableTouches.length > 0) {
      this._dispatchEventToListeners(allAtOnceListeners, this._onTouchesEventCallback, {
        event: event,
        touches: mutableTouches
      });

      if (event.isStopped()) return;
    }

    this._updateTouchListeners(event);
  },
  _onTouchesEventCallback: function _onTouchesEventCallback(listener, callbackParams) {
    // Skip if the listener was removed.
    if (!listener._registered) return false;
    var EventTouch = cc.Event.EventTouch,
        event = callbackParams.event,
        touches = callbackParams.touches,
        getCode = event.getEventCode();
    event.currentTarget = listener._node;
    if (getCode === EventTouch.BEGAN && listener.onTouchesBegan) listener.onTouchesBegan(touches, event);else if (getCode === EventTouch.MOVED && listener.onTouchesMoved) listener.onTouchesMoved(touches, event);else if (getCode === EventTouch.ENDED && listener.onTouchesEnded) listener.onTouchesEnded(touches, event);else if (getCode === EventTouch.CANCELLED && listener.onTouchesCancelled) listener.onTouchesCancelled(touches, event); // If the event was stopped, return directly.

    if (event.isStopped()) {
      eventManager._updateTouchListeners(event);

      return true;
    }

    return false;
  },
  _associateNodeAndEventListener: function _associateNodeAndEventListener(node, listener) {
    var listeners = this._nodeListenersMap[node._id];

    if (!listeners) {
      listeners = [];
      this._nodeListenersMap[node._id] = listeners;
    }

    listeners.push(listener);
  },
  _dissociateNodeAndEventListener: function _dissociateNodeAndEventListener(node, listener) {
    var listeners = this._nodeListenersMap[node._id];

    if (listeners) {
      cc.js.array.remove(listeners, listener);
      if (listeners.length === 0) delete this._nodeListenersMap[node._id];
    }
  },
  _dispatchEventToListeners: function _dispatchEventToListeners(listeners, onEvent, eventOrArgs) {
    var shouldStopPropagation = false;
    var fixedPriorityListeners = listeners.getFixedPriorityListeners();
    var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
    var i = 0,
        j,
        selListener;

    if (fixedPriorityListeners) {
      // priority < 0
      if (fixedPriorityListeners.length !== 0) {
        for (; i < listeners.gt0Index; ++i) {
          selListener = fixedPriorityListeners[i];

          if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
            shouldStopPropagation = true;
            break;
          }
        }
      }
    }

    if (sceneGraphPriorityListeners && !shouldStopPropagation) {
      // priority == 0, scene graph priority
      for (j = 0; j < sceneGraphPriorityListeners.length; j++) {
        selListener = sceneGraphPriorityListeners[j];

        if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
          shouldStopPropagation = true;
          break;
        }
      }
    }

    if (fixedPriorityListeners && !shouldStopPropagation) {
      // priority > 0
      for (; i < fixedPriorityListeners.length; ++i) {
        selListener = fixedPriorityListeners[i];

        if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
          shouldStopPropagation = true;
          break;
        }
      }
    }
  },
  _setDirty: function _setDirty(listenerID, flag) {
    var locDirtyFlagMap = this._priorityDirtyFlagMap;
    if (locDirtyFlagMap[listenerID] == null) locDirtyFlagMap[listenerID] = flag;else locDirtyFlagMap[listenerID] = flag | locDirtyFlagMap[listenerID];
  },
  _sortNumberAsc: function _sortNumberAsc(a, b) {
    return a - b;
  },

  /**
   * !#en Query whether the specified event listener id has been added.
   * !#zh 查询指定的事件 ID 是否存在
   * @method hasEventListener
   * @param {String|Number} listenerID - The listener id.
   * @return {Boolean} true or false
   */
  hasEventListener: function hasEventListener(listenerID) {
    return !!this._getListeners(listenerID);
  },

  /**
   * !#en
   * <p>
   * Adds a event listener for a specified event.<br/>
   * if the parameter "nodeOrPriority" is a node,
   * it means to add a event listener for a specified event with the priority of scene graph.<br/>
   * if the parameter "nodeOrPriority" is a Number,
   * it means to add a event listener for a specified event with the fixed priority.<br/>
   * </p>
   * !#zh
   * 将事件监听器添加到事件管理器中。<br/>
   * 如果参数 “nodeOrPriority” 是节点，优先级由 node 的渲染顺序决定，显示在上层的节点将优先收到事件。<br/>
   * 如果参数 “nodeOrPriority” 是数字，优先级则固定为该参数的数值，数字越小，优先级越高。<br/>
   *
   * @method addListener
   * @param {EventListener|Object} listener - The listener of a specified event or a object of some event parameters.
   * @param {Node|Number} nodeOrPriority - The priority of the listener is based on the draw order of this node or fixedPriority The fixed priority of the listener.
   * @note  The priority of scene graph will be fixed value 0. So the order of listener item in the vector will be ' <0, scene graph (0 priority), >0'.
   *         A lower priority will be called before the ones that have a higher value. 0 priority is forbidden for fixed priority since it's used for scene graph based priority.
   *         The listener must be a cc.EventListener object when adding a fixed priority listener, because we can't remove a fixed priority listener without the listener handler,
   *         except calls removeAllListeners().
   * @return {EventListener} Return the listener. Needed in order to remove the event from the dispatcher.
   */
  addListener: function addListener(listener, nodeOrPriority) {
    cc.assertID(listener && nodeOrPriority, 3503);

    if (!(cc.js.isNumber(nodeOrPriority) || nodeOrPriority instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    if (!(listener instanceof cc.EventListener)) {
      cc.assertID(!cc.js.isNumber(nodeOrPriority), 3504);
      listener = cc.EventListener.create(listener);
    } else {
      if (listener._isRegistered()) {
        cc.logID(3505);
        return;
      }
    }

    if (!listener.checkAvailable()) return;

    if (cc.js.isNumber(nodeOrPriority)) {
      if (nodeOrPriority === 0) {
        cc.logID(3500);
        return;
      }

      listener._setSceneGraphPriority(null);

      listener._setFixedPriority(nodeOrPriority);

      listener._setRegistered(true);

      listener._setPaused(false);

      this._addListener(listener);
    } else {
      listener._setSceneGraphPriority(nodeOrPriority);

      listener._setFixedPriority(0);

      listener._setRegistered(true);

      this._addListener(listener);
    }

    return listener;
  },

  /*
   * !#en Adds a Custom event listener. It will use a fixed priority of 1.
   * !#zh 向事件管理器添加一个自定义事件监听器。
   * @method addCustomListener
   * @param {String} eventName
   * @param {Function} callback
   * @return {EventListener} the generated event. Needed in order to remove the event from the dispatcher
   */
  addCustomListener: function addCustomListener(eventName, callback) {
    var listener = new cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: eventName,
      callback: callback
    });
    this.addListener(listener, 1);
    return listener;
  },

  /**
   * !#en Remove a listener.
   * !#zh 移除一个已添加的监听器。
   * @method removeListener
   * @param {EventListener} listener - an event listener or a registered node target
   * @example {@link cocos2d/core/event-manager/CCEventManager/removeListener.js}
   */
  removeListener: function removeListener(listener) {
    if (listener == null) return;
    var isFound,
        locListener = this._listenersMap;

    for (var selKey in locListener) {
      var listeners = locListener[selKey];
      var fixedPriorityListeners = listeners.getFixedPriorityListeners(),
          sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
      isFound = this._removeListenerInVector(sceneGraphPriorityListeners, listener);

      if (isFound) {
        // fixed #4160: Dirty flag need to be updated after listeners were removed.
        this._setDirty(listener._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY);
      } else {
        isFound = this._removeListenerInVector(fixedPriorityListeners, listener);
        if (isFound) this._setDirty(listener._getListenerID(), this.DIRTY_FIXED_PRIORITY);
      }

      if (listeners.empty()) {
        delete this._priorityDirtyFlagMap[listener._getListenerID()];
        delete locListener[selKey];
      }

      if (isFound) break;
    }

    if (!isFound) {
      var locToAddedListeners = this._toAddedListeners;

      for (var i = locToAddedListeners.length - 1; i >= 0; i--) {
        var selListener = locToAddedListeners[i];

        if (selListener === listener) {
          cc.js.array.removeAt(locToAddedListeners, i);

          selListener._setRegistered(false);

          break;
        }
      }
    }
  },
  _removeListenerInCallback: function _removeListenerInCallback(listeners, callback) {
    if (listeners == null) return false;

    for (var i = listeners.length - 1; i >= 0; i--) {
      var selListener = listeners[i];

      if (selListener._onCustomEvent === callback || selListener._onEvent === callback) {
        selListener._setRegistered(false);

        if (selListener._getSceneGraphPriority() != null) {
          this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);

          selListener._setSceneGraphPriority(null); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.

        }

        if (this._inDispatch === 0) cc.js.array.removeAt(listeners, i);else this._toRemovedListeners.push(selListener);
        return true;
      }
    }

    return false;
  },
  _removeListenerInVector: function _removeListenerInVector(listeners, listener) {
    if (listeners == null) return false;

    for (var i = listeners.length - 1; i >= 0; i--) {
      var selListener = listeners[i];

      if (selListener === listener) {
        selListener._setRegistered(false);

        if (selListener._getSceneGraphPriority() != null) {
          this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);

          selListener._setSceneGraphPriority(null); // NULL out the node pointer so we don't have any dangling pointers to destroyed nodes.

        }

        if (this._inDispatch === 0) cc.js.array.removeAt(listeners, i);else this._toRemovedListeners.push(selListener);
        return true;
      }
    }

    return false;
  },

  /**
   * !#en Removes all listeners with the same event listener type or removes all listeners of a node.
   * !#zh
   * 移除注册到 eventManager 中指定类型的所有事件监听器。<br/>
   * 1. 如果传入的第一个参数类型是 Node，那么事件管理器将移除与该对象相关的所有事件监听器。
   * （如果第二参数 recursive 是 true 的话，就会连同该对象的子控件上所有的事件监听器也一并移除）<br/>
   * 2. 如果传入的第一个参数类型是 Number（该类型 EventListener 中定义的事件类型），
   * 那么事件管理器将移除该类型的所有事件监听器。<br/>
   *
   * 下列是目前存在监听器类型：       <br/>
   * cc.EventListener.UNKNOWN       <br/>
   * cc.EventListener.KEYBOARD      <br/>
   * cc.EventListener.ACCELERATION，<br/>
   *
   * @method removeListeners
   * @param {Number|Node} listenerType - listenerType or a node
   * @param {Boolean} [recursive=false]
   */
  removeListeners: function removeListeners(listenerType, recursive) {
    var i,
        _t = this;

    if (!(cc.js.isNumber(listenerType) || listenerType instanceof cc._BaseNode)) {
      cc.warnID(3506);
      return;
    }

    if (listenerType._id !== undefined) {
      // Ensure the node is removed from these immediately also.
      // Don't want any dangling pointers or the possibility of dealing with deleted objects..
      var listeners = _t._nodeListenersMap[listenerType._id],
          i;

      if (listeners) {
        var listenersCopy = cc.js.array.copy(listeners);

        for (i = 0; i < listenersCopy.length; i++) {
          _t.removeListener(listenersCopy[i]);
        }

        delete _t._nodeListenersMap[listenerType._id];
      } // Bug fix: ensure there are no references to the node in the list of listeners to be added.
      // If we find any listeners associated with the destroyed node in this list then remove them.
      // This is to catch the scenario where the node gets destroyed before it's listener
      // is added into the event dispatcher fully. This could happen if a node registers a listener
      // and gets destroyed while we are dispatching an event (touch etc.)


      var locToAddedListeners = _t._toAddedListeners;

      for (i = 0; i < locToAddedListeners.length;) {
        var listener = locToAddedListeners[i];

        if (listener._getSceneGraphPriority() === listenerType) {
          listener._setSceneGraphPriority(null); // Ensure no dangling ptr to the target node.


          listener._setRegistered(false);

          locToAddedListeners.splice(i, 1);
        } else ++i;
      }

      if (recursive === true) {
        var locChildren = listenerType.children,
            len;

        for (i = 0, len = locChildren.length; i < len; i++) {
          _t.removeListeners(locChildren[i], true);
        }
      }
    } else {
      if (listenerType === cc.EventListener.TOUCH_ONE_BY_ONE) _t._removeListenersForListenerID(ListenerID.TOUCH_ONE_BY_ONE);else if (listenerType === cc.EventListener.TOUCH_ALL_AT_ONCE) _t._removeListenersForListenerID(ListenerID.TOUCH_ALL_AT_ONCE);else if (listenerType === cc.EventListener.MOUSE) _t._removeListenersForListenerID(ListenerID.MOUSE);else if (listenerType === cc.EventListener.ACCELERATION) _t._removeListenersForListenerID(ListenerID.ACCELERATION);else if (listenerType === cc.EventListener.KEYBOARD) _t._removeListenersForListenerID(ListenerID.KEYBOARD);else cc.logID(3501);
    }
  },

  /*
   * !#en Removes all custom listeners with the same event name.
   * !#zh 移除同一事件名的自定义事件监听器。
   * @method removeCustomListeners
   * @param {String} customEventName
   */
  removeCustomListeners: function removeCustomListeners(customEventName) {
    this._removeListenersForListenerID(customEventName);
  },

  /**
   * !#en Removes all listeners
   * !#zh 移除所有事件监听器。
   * @method removeAllListeners
   */
  removeAllListeners: function removeAllListeners() {
    var locListeners = this._listenersMap,
        locInternalCustomEventIDs = this._internalCustomListenerIDs;

    for (var selKey in locListeners) {
      if (locInternalCustomEventIDs.indexOf(selKey) === -1) this._removeListenersForListenerID(selKey);
    }
  },

  /**
   * !#en Sets listener's priority with fixed value.
   * !#zh 设置 FixedPriority 类型监听器的优先级。
   * @method setPriority
   * @param {EventListener} listener
   * @param {Number} fixedPriority
   */
  setPriority: function setPriority(listener, fixedPriority) {
    if (listener == null) return;
    var locListeners = this._listenersMap;

    for (var selKey in locListeners) {
      var selListeners = locListeners[selKey];
      var fixedPriorityListeners = selListeners.getFixedPriorityListeners();

      if (fixedPriorityListeners) {
        var found = fixedPriorityListeners.indexOf(listener);

        if (found !== -1) {
          if (listener._getSceneGraphPriority() != null) cc.logID(3502);

          if (listener._getFixedPriority() !== fixedPriority) {
            listener._setFixedPriority(fixedPriority);

            this._setDirty(listener._getListenerID(), this.DIRTY_FIXED_PRIORITY);
          }

          return;
        }
      }
    }
  },

  /**
   * !#en Whether to enable dispatching events
   * !#zh 启用或禁用事件管理器，禁用后不会分发任何事件。
   * @method setEnabled
   * @param {Boolean} enabled
   */
  setEnabled: function setEnabled(enabled) {
    this._isEnabled = enabled;
  },

  /**
   * !#en Checks whether dispatching events is enabled
   * !#zh 检测事件管理器是否启用。
   * @method isEnabled
   * @returns {Boolean}
   */
  isEnabled: function isEnabled() {
    return this._isEnabled;
  },

  /*
   * !#en Dispatches the event, also removes all EventListeners marked for deletion from the event dispatcher list.
   * !#zh 分发事件。
   * @method dispatchEvent
   * @param {Event} event
   */
  dispatchEvent: function dispatchEvent(event) {
    if (!this._isEnabled) return;

    this._updateDirtyFlagForSceneGraph();

    this._inDispatch++;

    if (!event || !event.getType) {
      cc.errorID(3511);
      return;
    }

    if (event.getType().startsWith(cc.Event.TOUCH)) {
      this._dispatchTouchEvent(event);

      this._inDispatch--;
      return;
    }

    var listenerID = __getListenerID(event);

    this._sortEventListeners(listenerID);

    var selListeners = this._listenersMap[listenerID];

    if (selListeners != null) {
      this._dispatchEventToListeners(selListeners, this._onListenerCallback, event);

      this._onUpdateListeners(selListeners);
    }

    this._inDispatch--;
  },
  _onListenerCallback: function _onListenerCallback(listener, event) {
    event.currentTarget = listener._target;

    listener._onEvent(event);

    return event.isStopped();
  },

  /*
   * !#en Dispatches a Custom Event with a event name an optional user data
   * !#zh 分发自定义事件。
   * @method dispatchCustomEvent
   * @param {String} eventName
   * @param {*} optionalUserData
   */
  dispatchCustomEvent: function dispatchCustomEvent(eventName, optionalUserData) {
    var ev = new cc.Event.EventCustom(eventName);
    ev.setUserData(optionalUserData);
    this.dispatchEvent(ev);
  }
};
js.get(cc, 'eventManager', function () {
  cc.warnID(1405, 'cc.eventManager', 'cc.EventTarget or cc.systemEvent');
  return eventManager;
});
module.exports = cc.internal.eventManager = eventManager;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDRXZlbnRNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImpzIiwicmVxdWlyZSIsIkxpc3RlbmVySUQiLCJjYyIsIkV2ZW50TGlzdGVuZXIiLCJfRXZlbnRMaXN0ZW5lclZlY3RvciIsIl9maXhlZExpc3RlbmVycyIsIl9zY2VuZUdyYXBoTGlzdGVuZXJzIiwiZ3QwSW5kZXgiLCJwcm90b3R5cGUiLCJjb25zdHJ1Y3RvciIsInNpemUiLCJsZW5ndGgiLCJlbXB0eSIsInB1c2giLCJsaXN0ZW5lciIsIl9nZXRGaXhlZFByaW9yaXR5IiwiY2xlYXJTY2VuZUdyYXBoTGlzdGVuZXJzIiwiY2xlYXJGaXhlZExpc3RlbmVycyIsImNsZWFyIiwiZ2V0Rml4ZWRQcmlvcml0eUxpc3RlbmVycyIsImdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyIsIl9fZ2V0TGlzdGVuZXJJRCIsImV2ZW50IiwiZXZlbnRUeXBlIiwiRXZlbnQiLCJ0eXBlIiwiQUNDRUxFUkFUSU9OIiwiS0VZQk9BUkQiLCJzdGFydHNXaXRoIiwiTU9VU0UiLCJUT1VDSCIsImxvZ0lEIiwiZXZlbnRNYW5hZ2VyIiwiRElSVFlfTk9ORSIsIkRJUlRZX0ZJWEVEX1BSSU9SSVRZIiwiRElSVFlfU0NFTkVfR1JBUEhfUFJJT1JJVFkiLCJESVJUWV9BTEwiLCJfbGlzdGVuZXJzTWFwIiwiX3ByaW9yaXR5RGlydHlGbGFnTWFwIiwiX25vZGVMaXN0ZW5lcnNNYXAiLCJfdG9BZGRlZExpc3RlbmVycyIsIl90b1JlbW92ZWRMaXN0ZW5lcnMiLCJfZGlydHlMaXN0ZW5lcnMiLCJfaW5EaXNwYXRjaCIsIl9pc0VuYWJsZWQiLCJfY3VycmVudFRvdWNoIiwiX2ludGVybmFsQ3VzdG9tTGlzdGVuZXJJRHMiLCJfc2V0RGlydHlGb3JOb2RlIiwibm9kZSIsInNlbExpc3RlbmVycyIsIl9pZCIsInVuZGVmaW5lZCIsImoiLCJsZW4iLCJzZWxMaXN0ZW5lciIsImxpc3RlbmVySUQiLCJfZ2V0TGlzdGVuZXJJRCIsImNoaWxkcmVuQ291bnQiLCJjaGlsZHJlbiIsIl9jaGlsZHJlbiIsImkiLCJwYXVzZVRhcmdldCIsInJlY3Vyc2l2ZSIsIl9CYXNlTm9kZSIsIndhcm5JRCIsImxpc3RlbmVycyIsIl9zZXRQYXVzZWQiLCJsb2NDaGlsZHJlbiIsInJlc3VtZVRhcmdldCIsIl9hZGRMaXN0ZW5lciIsIl9mb3JjZUFkZEV2ZW50TGlzdGVuZXIiLCJfc2V0RGlydHkiLCJfZ2V0U2NlbmVHcmFwaFByaW9yaXR5IiwiX2Fzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyIiwiYWN0aXZlSW5IaWVyYXJjaHkiLCJfZ2V0TGlzdGVuZXJzIiwiX3VwZGF0ZURpcnR5RmxhZ0ZvclNjZW5lR3JhcGgiLCJsb2NEaXJ0eUxpc3RlbmVycyIsInNlbEtleSIsIl9yZW1vdmVBbGxMaXN0ZW5lcnNJblZlY3RvciIsImxpc3RlbmVyVmVjdG9yIiwiX3NldFJlZ2lzdGVyZWQiLCJfZGlzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyIiwiX3NldFNjZW5lR3JhcGhQcmlvcml0eSIsImFycmF5IiwicmVtb3ZlQXQiLCJfcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRCIsImZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMiLCJzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMiLCJsb2NUb0FkZGVkTGlzdGVuZXJzIiwiX3NvcnRFdmVudExpc3RlbmVycyIsImRpcnR5RmxhZyIsImxvY0ZsYWdNYXAiLCJfc29ydExpc3RlbmVyc09mRml4ZWRQcmlvcml0eSIsInJvb3RFbnRpdHkiLCJkaXJlY3RvciIsImdldFNjZW5lIiwiX3NvcnRMaXN0ZW5lcnNPZlNjZW5lR3JhcGhQcmlvcml0eSIsInNjZW5lR3JhcGhMaXN0ZW5lciIsInNvcnQiLCJfc29ydEV2ZW50TGlzdGVuZXJzT2ZTY2VuZUdyYXBoUHJpb3JpdHlEZXMiLCJsMSIsImwyIiwibm9kZTEiLCJub2RlMiIsIl9hY3RpdmVJbkhpZXJhcmNoeSIsIl9wYXJlbnQiLCJwMSIsInAyIiwiZXgiLCJfbG9jYWxaT3JkZXIiLCJmaXhlZExpc3RlbmVycyIsIl9zb3J0TGlzdGVuZXJzT2ZGaXhlZFByaW9yaXR5QXNjIiwiaW5kZXgiLCJfb25VcGRhdGVMaXN0ZW5lcnMiLCJpZHgiLCJ0b1JlbW92ZWRMaXN0ZW5lcnMiLCJfaXNSZWdpc3RlcmVkIiwiaW5kZXhPZiIsInNwbGljZSIsImZyYW1lVXBkYXRlTGlzdGVuZXJzIiwibG9jTGlzdGVuZXJzTWFwIiwibG9jUHJpb3JpdHlEaXJ0eUZsYWdNYXAiLCJfY2xlYW5Ub1JlbW92ZWRMaXN0ZW5lcnMiLCJfdXBkYXRlVG91Y2hMaXN0ZW5lcnMiLCJsb2NJbkRpc3BhdGNoIiwiYXNzZXJ0SUQiLCJUT1VDSF9PTkVfQllfT05FIiwiVE9VQ0hfQUxMX0FUX09OQ0UiLCJfb25Ub3VjaEV2ZW50Q2FsbGJhY2siLCJhcmdzT2JqIiwic2VsVG91Y2giLCJjdXJyZW50VG91Y2giLCJjdXJyZW50VGFyZ2V0IiwiX25vZGUiLCJpc0NsYWltZWQiLCJyZW1vdmVkSWR4IiwiZ2V0Q29kZSIsImdldEV2ZW50Q29kZSIsIkV2ZW50VG91Y2giLCJCRUdBTiIsIm1hY3JvIiwiRU5BQkxFX01VTFRJX1RPVUNIIiwib25Ub3VjaEJlZ2FuIiwiX3JlZ2lzdGVyZWQiLCJfY2xhaW1lZFRvdWNoZXMiLCJNT1ZFRCIsIm9uVG91Y2hNb3ZlZCIsIkVOREVEIiwib25Ub3VjaEVuZGVkIiwiQ0FOQ0VMTEVEIiwib25Ub3VjaENhbmNlbGxlZCIsImlzU3RvcHBlZCIsInN3YWxsb3dUb3VjaGVzIiwibmVlZHNNdXRhYmxlU2V0IiwidG91Y2hlcyIsIl9kaXNwYXRjaFRvdWNoRXZlbnQiLCJvbmVCeU9uZUxpc3RlbmVycyIsImFsbEF0T25jZUxpc3RlbmVycyIsIm9yaWdpbmFsVG91Y2hlcyIsImdldFRvdWNoZXMiLCJtdXRhYmxlVG91Y2hlcyIsImNvcHkiLCJvbmVCeU9uZUFyZ3NPYmoiLCJfcHJvcGFnYXRpb25TdG9wcGVkIiwiX3Byb3BhZ2F0aW9uSW1tZWRpYXRlU3RvcHBlZCIsIl9kaXNwYXRjaEV2ZW50VG9MaXN0ZW5lcnMiLCJfb25Ub3VjaGVzRXZlbnRDYWxsYmFjayIsImNhbGxiYWNrUGFyYW1zIiwib25Ub3VjaGVzQmVnYW4iLCJvblRvdWNoZXNNb3ZlZCIsIm9uVG91Y2hlc0VuZGVkIiwib25Ub3VjaGVzQ2FuY2VsbGVkIiwicmVtb3ZlIiwib25FdmVudCIsImV2ZW50T3JBcmdzIiwic2hvdWxkU3RvcFByb3BhZ2F0aW9uIiwiaXNFbmFibGVkIiwiX2lzUGF1c2VkIiwiZmxhZyIsImxvY0RpcnR5RmxhZ01hcCIsIl9zb3J0TnVtYmVyQXNjIiwiYSIsImIiLCJoYXNFdmVudExpc3RlbmVyIiwiYWRkTGlzdGVuZXIiLCJub2RlT3JQcmlvcml0eSIsImlzTnVtYmVyIiwiY3JlYXRlIiwiY2hlY2tBdmFpbGFibGUiLCJfc2V0Rml4ZWRQcmlvcml0eSIsImFkZEN1c3RvbUxpc3RlbmVyIiwiZXZlbnROYW1lIiwiY2FsbGJhY2siLCJDVVNUT00iLCJyZW1vdmVMaXN0ZW5lciIsImlzRm91bmQiLCJsb2NMaXN0ZW5lciIsIl9yZW1vdmVMaXN0ZW5lckluVmVjdG9yIiwiX3JlbW92ZUxpc3RlbmVySW5DYWxsYmFjayIsIl9vbkN1c3RvbUV2ZW50IiwiX29uRXZlbnQiLCJyZW1vdmVMaXN0ZW5lcnMiLCJsaXN0ZW5lclR5cGUiLCJfdCIsImxpc3RlbmVyc0NvcHkiLCJyZW1vdmVDdXN0b21MaXN0ZW5lcnMiLCJjdXN0b21FdmVudE5hbWUiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiLCJsb2NMaXN0ZW5lcnMiLCJsb2NJbnRlcm5hbEN1c3RvbUV2ZW50SURzIiwic2V0UHJpb3JpdHkiLCJmaXhlZFByaW9yaXR5IiwiZm91bmQiLCJzZXRFbmFibGVkIiwiZW5hYmxlZCIsImRpc3BhdGNoRXZlbnQiLCJnZXRUeXBlIiwiZXJyb3JJRCIsIl9vbkxpc3RlbmVyQ2FsbGJhY2siLCJfdGFyZ2V0IiwiZGlzcGF0Y2hDdXN0b21FdmVudCIsIm9wdGlvbmFsVXNlckRhdGEiLCJldiIsIkV2ZW50Q3VzdG9tIiwic2V0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RUFBNkMsS0FBSzBLLG1CQUFsRCxFQUF1RXJNLEtBQXZFOztBQUNBLFdBQUs0RixrQkFBTCxDQUF3QmpFLFlBQXhCO0FBQ0g7O0FBRUQsU0FBS04sV0FBTDtBQUNILEdBNzVCYztBQSs1QmZnTCxFQUFBQSxtQkFBbUIsRUFBRSw2QkFBUzdNLFFBQVQsRUFBbUJRLEtBQW5CLEVBQXlCO0FBQzFDQSxJQUFBQSxLQUFLLENBQUMrRyxhQUFOLEdBQXNCdkgsUUFBUSxDQUFDOE0sT0FBL0I7O0FBQ0E5TSxJQUFBQSxRQUFRLENBQUMyTCxRQUFULENBQWtCbkwsS0FBbEI7O0FBQ0EsV0FBT0EsS0FBSyxDQUFDa0ksU0FBTixFQUFQO0FBQ0gsR0FuNkJjOztBQXE2QmY7Ozs7Ozs7QUFPQXFFLEVBQUFBLG1CQUFtQixFQUFFLDZCQUFVN0IsU0FBVixFQUFxQjhCLGdCQUFyQixFQUF1QztBQUN4RCxRQUFJQyxFQUFFLEdBQUcsSUFBSTdOLEVBQUUsQ0FBQ3NCLEtBQUgsQ0FBU3dNLFdBQWIsQ0FBeUJoQyxTQUF6QixDQUFUO0FBQ0ErQixJQUFBQSxFQUFFLENBQUNFLFdBQUgsQ0FBZUgsZ0JBQWY7QUFDQSxTQUFLTixhQUFMLENBQW1CTyxFQUFuQjtBQUNIO0FBaDdCYyxDQUFuQjtBQW83QkFoTyxFQUFFLENBQUNtTyxHQUFILENBQU9oTyxFQUFQLEVBQVcsY0FBWCxFQUEyQixZQUFZO0FBQ25DQSxFQUFBQSxFQUFFLENBQUM4RCxNQUFILENBQVUsSUFBVixFQUFnQixpQkFBaEIsRUFBbUMsa0NBQW5DO0FBQ0EsU0FBT2hDLFlBQVA7QUFDSCxDQUhEO0FBS0FtTSxNQUFNLENBQUNDLE9BQVAsR0FBaUJsTyxFQUFFLENBQUNtTyxRQUFILENBQVlyTSxZQUFaLEdBQTJCQSxZQUE1QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbnZhciBqcyA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL2pzJyk7XG5yZXF1aXJlKCcuL0NDRXZlbnRMaXN0ZW5lcicpO1xudmFyIExpc3RlbmVySUQgPSBjYy5FdmVudExpc3RlbmVyLkxpc3RlbmVySUQ7XG5cbnZhciBfRXZlbnRMaXN0ZW5lclZlY3RvciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9maXhlZExpc3RlbmVycyA9IFtdO1xuICAgIHRoaXMuX3NjZW5lR3JhcGhMaXN0ZW5lcnMgPSBbXTtcbiAgICB0aGlzLmd0MEluZGV4ID0gMDtcbn07XG5fRXZlbnRMaXN0ZW5lclZlY3Rvci5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IF9FdmVudExpc3RlbmVyVmVjdG9yLFxuICAgIHNpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpeGVkTGlzdGVuZXJzLmxlbmd0aCArIHRoaXMuX3NjZW5lR3JhcGhMaXN0ZW5lcnMubGVuZ3RoO1xuICAgIH0sXG5cbiAgICBlbXB0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuX2ZpeGVkTGlzdGVuZXJzLmxlbmd0aCA9PT0gMCkgJiYgKHRoaXMuX3NjZW5lR3JhcGhMaXN0ZW5lcnMubGVuZ3RoID09PSAwKTtcbiAgICB9LFxuXG4gICAgcHVzaDogZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIGlmIChsaXN0ZW5lci5fZ2V0Rml4ZWRQcmlvcml0eSgpID09PSAwKVxuICAgICAgICAgICAgdGhpcy5fc2NlbmVHcmFwaExpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5fZml4ZWRMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfSxcblxuICAgIGNsZWFyU2NlbmVHcmFwaExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9zY2VuZUdyYXBoTGlzdGVuZXJzLmxlbmd0aCA9IDA7XG4gICAgfSxcblxuICAgIGNsZWFyRml4ZWRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fZml4ZWRMaXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgY2xlYXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc2NlbmVHcmFwaExpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLl9maXhlZExpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgIH0sXG5cbiAgICBnZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9maXhlZExpc3RlbmVycztcbiAgICB9LFxuXG4gICAgZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2VuZUdyYXBoTGlzdGVuZXJzO1xuICAgIH1cbn07XG5cbnZhciBfX2dldExpc3RlbmVySUQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgZXZlbnRUeXBlID0gY2MuRXZlbnQsIHR5cGUgPSBldmVudC50eXBlO1xuICAgIGlmICh0eXBlID09PSBldmVudFR5cGUuQUNDRUxFUkFUSU9OKVxuICAgICAgICByZXR1cm4gTGlzdGVuZXJJRC5BQ0NFTEVSQVRJT047XG4gICAgaWYgKHR5cGUgPT09IGV2ZW50VHlwZS5LRVlCT0FSRClcbiAgICAgICAgcmV0dXJuIExpc3RlbmVySUQuS0VZQk9BUkQ7XG4gICAgaWYgKHR5cGUuc3RhcnRzV2l0aChldmVudFR5cGUuTU9VU0UpKVxuICAgICAgICByZXR1cm4gTGlzdGVuZXJJRC5NT1VTRTtcbiAgICBpZiAodHlwZS5zdGFydHNXaXRoKGV2ZW50VHlwZS5UT1VDSCkpe1xuICAgICAgICAvLyBUb3VjaCBsaXN0ZW5lciBpcyB2ZXJ5IHNwZWNpYWwsIGl0IGNvbnRhaW5zIHR3byBraW5kcyBvZiBsaXN0ZW5lcnMsIEV2ZW50TGlzdGVuZXJUb3VjaE9uZUJ5T25lIGFuZCBFdmVudExpc3RlbmVyVG91Y2hBbGxBdE9uY2UuXG4gICAgICAgIC8vIHJldHVybiBVTktOT1dOIGluc3RlYWQuXG4gICAgICAgIGNjLmxvZ0lEKDIwMDApO1xuICAgIH1cbiAgICByZXR1cm4gXCJcIjtcbn07XG5cbi8qKlxuICogISNlblxuICogVGhpcyBjbGFzcyBoYXMgYmVlbiBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGNjLnN5c3RlbUV2ZW50IG9yIGNjLkV2ZW50VGFyZ2V0IGluc3RlYWQuIFNlZSBbTGlzdGVuIHRvIGFuZCBsYXVuY2ggZXZlbnRzXSguLi8uLi8uLi9tYW51YWwvZW4vc2NyaXB0aW5nL2V2ZW50cy5tZCkgZm9yIGRldGFpbHMuPGJyPlxuICogPGJyPlxuICogY2MuZXZlbnRNYW5hZ2VyIGlzIGEgc2luZ2xldG9uIG9iamVjdCB3aGljaCBtYW5hZ2VzIGV2ZW50IGxpc3RlbmVyIHN1YnNjcmlwdGlvbnMgYW5kIGV2ZW50IGRpc3BhdGNoaW5nLlxuICogVGhlIEV2ZW50TGlzdGVuZXIgbGlzdCBpcyBtYW5hZ2VkIGluIHN1Y2ggd2F5IHNvIHRoYXQgZXZlbnQgbGlzdGVuZXJzIGNhbiBiZSBhZGRlZCBhbmQgcmVtb3ZlZFxuICogd2hpbGUgZXZlbnRzIGFyZSBiZWluZyBkaXNwYXRjaGVkLlxuICpcbiAqICEjemhcbiAqIOivpeexu+W3suW6n+W8g++8jOivt+S9v+eUqCBjYy5zeXN0ZW1FdmVudCDmiJYgY2MuRXZlbnRUYXJnZXQg5Luj5pu/77yM6K+m6KeBIFvnm5HlkKzlkozlj5HlsITkuovku7ZdKC4uLy4uLy4uL21hbnVhbC96aC9zY3JpcHRpbmcvZXZlbnRzLm1kKeOAgjxicj5cbiAqIDxicj5cbiAqIOS6i+S7tueuoeeQhuWZqO+8jOWug+S4u+imgeeuoeeQhuS6i+S7tuebkeWQrOWZqOazqOWGjOWSjOa0vuWPkeezu+e7n+S6i+S7tuOAglxuICpcbiAqIEBjbGFzcyBldmVudE1hbmFnZXJcbiAqIEBzdGF0aWNcbiAqIEBleGFtcGxlIHtAbGluayBjb2NvczJkL2NvcmUvZXZlbnQtbWFuYWdlci9DQ0V2ZW50TWFuYWdlci9hZGRMaXN0ZW5lci5qc31cbiAqIEBkZXByZWNhdGVkXG4gKi9cbnZhciBldmVudE1hbmFnZXIgPSB7XG4gICAgLy9Qcmlvcml0eSBkaXJ0eSBmbGFnXG4gICAgRElSVFlfTk9ORTogMCxcbiAgICBESVJUWV9GSVhFRF9QUklPUklUWTogMSA8PCAwLFxuICAgIERJUlRZX1NDRU5FX0dSQVBIX1BSSU9SSVRZOiAxIDw8IDEsXG4gICAgRElSVFlfQUxMOiAzLFxuICAgIFxuICAgIF9saXN0ZW5lcnNNYXA6IHt9LFxuICAgIF9wcmlvcml0eURpcnR5RmxhZ01hcDoge30sXG4gICAgX25vZGVMaXN0ZW5lcnNNYXA6IHt9LFxuICAgIF90b0FkZGVkTGlzdGVuZXJzOiBbXSxcbiAgICBfdG9SZW1vdmVkTGlzdGVuZXJzOiBbXSxcbiAgICBfZGlydHlMaXN0ZW5lcnM6IHt9LFxuICAgIF9pbkRpc3BhdGNoOiAwLFxuICAgIF9pc0VuYWJsZWQ6IGZhbHNlLFxuICAgIF9jdXJyZW50VG91Y2g6IG51bGwsXG5cbiAgICBfaW50ZXJuYWxDdXN0b21MaXN0ZW5lcklEczpbXSxcblxuICAgIF9zZXREaXJ0eUZvck5vZGU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIC8vIE1hcmsgdGhlIG5vZGUgZGlydHkgb25seSB3aGVuIHRoZXJlIGlzIGFuIGV2ZW50IGxpc3RlbmVyIGFzc29jaWF0ZWQgd2l0aCBpdC5cbiAgICAgICAgbGV0IHNlbExpc3RlbmVycyA9IHRoaXMuX25vZGVMaXN0ZW5lcnNNYXBbbm9kZS5faWRdO1xuICAgICAgICBpZiAoc2VsTGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBsZW4gPSBzZWxMaXN0ZW5lcnMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsTGlzdGVuZXIgPSBzZWxMaXN0ZW5lcnNbal07XG4gICAgICAgICAgICAgICAgbGV0IGxpc3RlbmVySUQgPSBzZWxMaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9kaXJ0eUxpc3RlbmVyc1tsaXN0ZW5lcklEXSA9PSBudWxsKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXJ0eUxpc3RlbmVyc1tsaXN0ZW5lcklEXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW5Db3VudCA+IDApIHtcbiAgICAgICAgICAgIGxldCBjaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuO1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0RGlydHlGb3JOb2RlKGNoaWxkcmVuW2ldKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhdXNlcyBhbGwgbGlzdGVuZXJzIHdoaWNoIGFyZSBhc3NvY2lhdGVkIHRoZSBzcGVjaWZpZWQgdGFyZ2V0LlxuICAgICAqICEjemgg5pqC5YGc5Lyg5YWl55qEIG5vZGUg55u45YWz55qE5omA5pyJ55uR5ZCs5Zmo55qE5LqL5Lu25ZON5bqU44CCXG4gICAgICogQG1ldGhvZCBwYXVzZVRhcmdldFxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JlY3Vyc2l2ZT1mYWxzZV1cbiAgICAgKi9cbiAgICBwYXVzZVRhcmdldDogZnVuY3Rpb24gKG5vZGUsIHJlY3Vyc2l2ZSkge1xuICAgICAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlKSkge1xuICAgICAgICAgICAgY2Mud2FybklEKDM1MDYpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ub2RlTGlzdGVuZXJzTWFwW25vZGUuX2lkXSwgaSwgbGVuO1xuICAgICAgICBpZiAobGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzW2ldLl9zZXRQYXVzZWQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlY3Vyc2l2ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGxvY0NoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW47XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsb2NDaGlsZHJlbiA/IGxvY0NoaWxkcmVuLmxlbmd0aCA6IDA7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlVGFyZ2V0KGxvY0NoaWxkcmVuW2ldLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlc3VtZXMgYWxsIGxpc3RlbmVycyB3aGljaCBhcmUgYXNzb2NpYXRlZCB0aGUgc3BlY2lmaWVkIHRhcmdldC5cbiAgICAgKiAhI3poIOaBouWkjeS8oOWFpeeahCBub2RlIOebuOWFs+eahOaJgOacieebkeWQrOWZqOeahOS6i+S7tuWTjeW6lOOAglxuICAgICAqIEBtZXRob2QgcmVzdW1lVGFyZ2V0XG4gICAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbcmVjdXJzaXZlPWZhbHNlXVxuICAgICAqL1xuICAgIHJlc3VtZVRhcmdldDogZnVuY3Rpb24gKG5vZGUsIHJlY3Vyc2l2ZSkge1xuICAgICAgICBpZiAoIShub2RlIGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlKSkge1xuICAgICAgICAgICAgY2Mud2FybklEKDM1MDYpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ub2RlTGlzdGVuZXJzTWFwW25vZGUuX2lkXSwgaSwgbGVuO1xuICAgICAgICBpZiAobGlzdGVuZXJzKXtcbiAgICAgICAgICAgIGZvciAoIGkgPSAwLCBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzW2ldLl9zZXRQYXVzZWQoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3NldERpcnR5Rm9yTm9kZShub2RlKTtcbiAgICAgICAgaWYgKHJlY3Vyc2l2ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGxvY0NoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW47XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsb2NDaGlsZHJlbiA/IGxvY0NoaWxkcmVuLmxlbmd0aCA6IDA7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VtZVRhcmdldChsb2NDaGlsZHJlbltpXSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2FkZExpc3RlbmVyOiBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuX2luRGlzcGF0Y2ggPT09IDApXG4gICAgICAgICAgICB0aGlzLl9mb3JjZUFkZEV2ZW50TGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLl90b0FkZGVkTGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgIH0sXG5cbiAgICBfZm9yY2VBZGRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVySUQgPSBsaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpO1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwW2xpc3RlbmVySURdO1xuICAgICAgICBpZiAoIWxpc3RlbmVycykge1xuICAgICAgICAgICAgbGlzdGVuZXJzID0gbmV3IF9FdmVudExpc3RlbmVyVmVjdG9yKCk7XG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnNNYXBbbGlzdGVuZXJJRF0gPSBsaXN0ZW5lcnM7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuXG4gICAgICAgIGlmIChsaXN0ZW5lci5fZ2V0Rml4ZWRQcmlvcml0eSgpID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9zZXREaXJ0eShsaXN0ZW5lcklELCB0aGlzLkRJUlRZX1NDRU5FX0dSQVBIX1BSSU9SSVRZKTtcblxuICAgICAgICAgICAgdmFyIG5vZGUgPSBsaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCk7XG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICBjYy5sb2dJRCgzNTA3KTtcblxuICAgICAgICAgICAgdGhpcy5fYXNzb2NpYXRlTm9kZUFuZEV2ZW50TGlzdGVuZXIobm9kZSwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKG5vZGUuYWN0aXZlSW5IaWVyYXJjaHkpXG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1bWVUYXJnZXQobm9kZSk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgdGhpcy5fc2V0RGlydHkobGlzdGVuZXJJRCwgdGhpcy5ESVJUWV9GSVhFRF9QUklPUklUWSk7XG4gICAgfSxcblxuICAgIF9nZXRMaXN0ZW5lcnM6IGZ1bmN0aW9uIChsaXN0ZW5lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnNNYXBbbGlzdGVuZXJJRF07XG4gICAgfSxcblxuICAgIF91cGRhdGVEaXJ0eUZsYWdGb3JTY2VuZUdyYXBoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBsb2NEaXJ0eUxpc3RlbmVycyA9IHRoaXMuX2RpcnR5TGlzdGVuZXJzXG4gICAgICAgIGZvciAodmFyIHNlbEtleSBpbiBsb2NEaXJ0eUxpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5fc2V0RGlydHkoc2VsS2V5LCB0aGlzLkRJUlRZX1NDRU5FX0dSQVBIX1BSSU9SSVRZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2RpcnR5TGlzdGVuZXJzID0ge307XG4gICAgfSxcblxuICAgIF9yZW1vdmVBbGxMaXN0ZW5lcnNJblZlY3RvcjogZnVuY3Rpb24gKGxpc3RlbmVyVmVjdG9yKSB7XG4gICAgICAgIGlmICghbGlzdGVuZXJWZWN0b3IpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBzZWxMaXN0ZW5lcjtcbiAgICAgICAgZm9yICh2YXIgaSA9IGxpc3RlbmVyVmVjdG9yLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBzZWxMaXN0ZW5lciA9IGxpc3RlbmVyVmVjdG9yW2ldO1xuICAgICAgICAgICAgc2VsTGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQoZmFsc2UpO1xuICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyKHNlbExpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKSwgc2VsTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyLl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkobnVsbCk7ICAgLy8gTlVMTCBvdXQgdGhlIG5vZGUgcG9pbnRlciBzbyB3ZSBkb24ndCBoYXZlIGFueSBkYW5nbGluZyBwb2ludGVycyB0byBkZXN0cm95ZWQgbm9kZXMuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9pbkRpc3BhdGNoID09PSAwKVxuICAgICAgICAgICAgICAgIGNjLmpzLmFycmF5LnJlbW92ZUF0KGxpc3RlbmVyVmVjdG9yLCBpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRDogZnVuY3Rpb24gKGxpc3RlbmVySUQpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc01hcFtsaXN0ZW5lcklEXSwgaTtcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgdmFyIGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0Rml4ZWRQcmlvcml0eUxpc3RlbmVycygpO1xuICAgICAgICAgICAgdmFyIHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRTY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQWxsTGlzdGVuZXJzSW5WZWN0b3Ioc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKTtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUFsbExpc3RlbmVyc0luVmVjdG9yKGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMpO1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGRpcnR5IGZsYWcgYWNjb3JkaW5nIHRoZSAnbGlzdGVuZXJJRCcuXG4gICAgICAgICAgICAvLyBObyBuZWVkIHRvIGNoZWNrIHdoZXRoZXIgdGhlIGRpc3BhdGNoZXIgaXMgZGlzcGF0Y2hpbmcgZXZlbnQuXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJpb3JpdHlEaXJ0eUZsYWdNYXBbbGlzdGVuZXJJRF07XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5faW5EaXNwYXRjaCkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycy5jbGVhcigpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9saXN0ZW5lcnNNYXBbbGlzdGVuZXJJRF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jVG9BZGRlZExpc3RlbmVycyA9IHRoaXMuX3RvQWRkZWRMaXN0ZW5lcnMsIGxpc3RlbmVyO1xuICAgICAgICBmb3IgKGkgPSBsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBsaXN0ZW5lciA9IGxvY1RvQWRkZWRMaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICBpZiAobGlzdGVuZXIgJiYgbGlzdGVuZXIuX2dldExpc3RlbmVySUQoKSA9PT0gbGlzdGVuZXJJRClcbiAgICAgICAgICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmVBdChsb2NUb0FkZGVkTGlzdGVuZXJzLCBpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfc29ydEV2ZW50TGlzdGVuZXJzOiBmdW5jdGlvbiAobGlzdGVuZXJJRCkge1xuICAgICAgICB2YXIgZGlydHlGbGFnID0gdGhpcy5ESVJUWV9OT05FLCBsb2NGbGFnTWFwID0gdGhpcy5fcHJpb3JpdHlEaXJ0eUZsYWdNYXA7XG4gICAgICAgIGlmIChsb2NGbGFnTWFwW2xpc3RlbmVySURdKVxuICAgICAgICAgICAgZGlydHlGbGFnID0gbG9jRmxhZ01hcFtsaXN0ZW5lcklEXTtcbiAgICAgICAgXG4gICAgICAgIGlmIChkaXJ0eUZsYWcgIT09IHRoaXMuRElSVFlfTk9ORSkge1xuICAgICAgICAgICAgLy8gQ2xlYXIgdGhlIGRpcnR5IGZsYWcgZmlyc3QsIGlmIGByb290Tm9kZWAgaXMgbnVsbCwgdGhlbiBzZXQgaXRzIGRpcnR5IGZsYWcgb2Ygc2NlbmUgZ3JhcGggcHJpb3JpdHlcbiAgICAgICAgICAgIGxvY0ZsYWdNYXBbbGlzdGVuZXJJRF0gPSB0aGlzLkRJUlRZX05PTkU7XG5cbiAgICAgICAgICAgIGlmIChkaXJ0eUZsYWcgJiB0aGlzLkRJUlRZX0ZJWEVEX1BSSU9SSVRZKVxuICAgICAgICAgICAgICAgIHRoaXMuX3NvcnRMaXN0ZW5lcnNPZkZpeGVkUHJpb3JpdHkobGlzdGVuZXJJRCk7XG5cbiAgICAgICAgICAgIGlmIChkaXJ0eUZsYWcgJiB0aGlzLkRJUlRZX1NDRU5FX0dSQVBIX1BSSU9SSVRZKXtcbiAgICAgICAgICAgICAgICB2YXIgcm9vdEVudGl0eSA9IGNjLmRpcmVjdG9yLmdldFNjZW5lKCk7XG4gICAgICAgICAgICAgICAgaWYocm9vdEVudGl0eSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc29ydExpc3RlbmVyc09mU2NlbmVHcmFwaFByaW9yaXR5KGxpc3RlbmVySUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zb3J0TGlzdGVuZXJzT2ZTY2VuZUdyYXBoUHJpb3JpdHk6IGZ1bmN0aW9uIChsaXN0ZW5lcklEKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9nZXRMaXN0ZW5lcnMobGlzdGVuZXJJRCk7XG4gICAgICAgIGlmICghbGlzdGVuZXJzKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHZhciBzY2VuZUdyYXBoTGlzdGVuZXIgPSBsaXN0ZW5lcnMuZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKCk7XG4gICAgICAgIGlmICghc2NlbmVHcmFwaExpc3RlbmVyIHx8IHNjZW5lR3JhcGhMaXN0ZW5lci5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgLy8gQWZ0ZXIgc29ydDogcHJpb3JpdHkgPCAwLCA+IDBcbiAgICAgICAgbGlzdGVuZXJzLmdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycygpLnNvcnQodGhpcy5fc29ydEV2ZW50TGlzdGVuZXJzT2ZTY2VuZUdyYXBoUHJpb3JpdHlEZXMpO1xuICAgIH0sXG5cbiAgICBfc29ydEV2ZW50TGlzdGVuZXJzT2ZTY2VuZUdyYXBoUHJpb3JpdHlEZXM6IGZ1bmN0aW9uIChsMSwgbDIpIHtcbiAgICAgICAgbGV0IG5vZGUxID0gbDEuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpLFxuICAgICAgICAgICAgbm9kZTIgPSBsMi5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCk7XG5cbiAgICAgICAgaWYgKCFsMiB8fCAhbm9kZTIgfHwgIW5vZGUyLl9hY3RpdmVJbkhpZXJhcmNoeSB8fCBub2RlMi5fcGFyZW50ID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICBlbHNlIGlmICghbDEgfHwgIW5vZGUxIHx8ICFub2RlMS5fYWN0aXZlSW5IaWVyYXJjaHkgfHwgbm9kZTEuX3BhcmVudCA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICBcbiAgICAgICAgbGV0IHAxID0gbm9kZTEsIHAyID0gbm9kZTIsIGV4ID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChwMS5fcGFyZW50Ll9pZCAhPT0gcDIuX3BhcmVudC5faWQpIHtcbiAgICAgICAgICAgIHAxID0gcDEuX3BhcmVudC5fcGFyZW50ID09PSBudWxsID8gKGV4ID0gdHJ1ZSkgJiYgbm9kZTIgOiBwMS5fcGFyZW50O1xuICAgICAgICAgICAgcDIgPSBwMi5fcGFyZW50Ll9wYXJlbnQgPT09IG51bGwgPyAoZXggPSB0cnVlKSAmJiBub2RlMSA6IHAyLl9wYXJlbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocDEuX2lkID09PSBwMi5faWQpIHtcbiAgICAgICAgICAgIGlmIChwMS5faWQgPT09IG5vZGUyLl9pZCkgXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYgKHAxLl9pZCA9PT0gbm9kZTEuX2lkKVxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV4ID8gcDEuX2xvY2FsWk9yZGVyIC0gcDIuX2xvY2FsWk9yZGVyIDogcDIuX2xvY2FsWk9yZGVyIC0gcDEuX2xvY2FsWk9yZGVyO1xuICAgIH0sXG5cbiAgICBfc29ydExpc3RlbmVyc09mRml4ZWRQcmlvcml0eTogZnVuY3Rpb24gKGxpc3RlbmVySUQpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc01hcFtsaXN0ZW5lcklEXTtcbiAgICAgICAgaWYgKCFsaXN0ZW5lcnMpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGZpeGVkTGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKTtcbiAgICAgICAgaWYoIWZpeGVkTGlzdGVuZXJzIHx8IGZpeGVkTGlzdGVuZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gQWZ0ZXIgc29ydDogcHJpb3JpdHkgPCAwLCA+IDBcbiAgICAgICAgZml4ZWRMaXN0ZW5lcnMuc29ydCh0aGlzLl9zb3J0TGlzdGVuZXJzT2ZGaXhlZFByaW9yaXR5QXNjKTtcblxuICAgICAgICAvLyBGSVhNRTogU2hvdWxkIHVzZSBiaW5hcnkgc2VhcmNoXG4gICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICAgIGZvciAodmFyIGxlbiA9IGZpeGVkTGlzdGVuZXJzLmxlbmd0aDsgaW5kZXggPCBsZW47KSB7XG4gICAgICAgICAgICBpZiAoZml4ZWRMaXN0ZW5lcnNbaW5kZXhdLl9nZXRGaXhlZFByaW9yaXR5KCkgPj0gMClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgbGlzdGVuZXJzLmd0MEluZGV4ID0gaW5kZXg7XG4gICAgfSxcblxuICAgIF9zb3J0TGlzdGVuZXJzT2ZGaXhlZFByaW9yaXR5QXNjOiBmdW5jdGlvbiAobDEsIGwyKSB7XG4gICAgICAgIHJldHVybiBsMS5fZ2V0Rml4ZWRQcmlvcml0eSgpIC0gbDIuX2dldEZpeGVkUHJpb3JpdHkoKTtcbiAgICB9LFxuXG4gICAgX29uVXBkYXRlTGlzdGVuZXJzOiBmdW5jdGlvbiAobGlzdGVuZXJzKSB7XG4gICAgICAgIHZhciBmaXhlZFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKTtcbiAgICAgICAgdmFyIHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyA9IGxpc3RlbmVycy5nZXRTY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMoKTtcbiAgICAgICAgdmFyIGksIHNlbExpc3RlbmVyLCBpZHgsIHRvUmVtb3ZlZExpc3RlbmVycyA9IHRoaXMuX3RvUmVtb3ZlZExpc3RlbmVycztcblxuICAgICAgICBpZiAoc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBmb3IgKGkgPSBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lciA9IHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbExpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmVBdChzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMsIGkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdGVtIGluIHRvUmVtb3ZlIGxpc3QsIHJlbW92ZSBpdCBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAgICAgICAgICAgIGlkeCA9IHRvUmVtb3ZlZExpc3RlbmVycy5pbmRleE9mKHNlbExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoaWR4ICE9PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvUmVtb3ZlZExpc3RlbmVycy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZml4ZWRQcmlvcml0eUxpc3RlbmVycykge1xuICAgICAgICAgICAgZm9yIChpID0gZml4ZWRQcmlvcml0eUxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyID0gZml4ZWRQcmlvcml0eUxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbExpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmVBdChmaXhlZFByaW9yaXR5TGlzdGVuZXJzLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXRlbSBpbiB0b1JlbW92ZSBsaXN0LCByZW1vdmUgaXQgZnJvbSB0aGUgbGlzdFxuICAgICAgICAgICAgICAgICAgICBpZHggPSB0b1JlbW92ZWRMaXN0ZW5lcnMuaW5kZXhPZihzZWxMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIGlmKGlkeCAhPT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1JlbW92ZWRMaXN0ZW5lcnMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycyAmJiBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgbGlzdGVuZXJzLmNsZWFyU2NlbmVHcmFwaExpc3RlbmVycygpO1xuXG4gICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzICYmIGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgbGlzdGVuZXJzLmNsZWFyRml4ZWRMaXN0ZW5lcnMoKTtcbiAgICB9LFxuXG4gICAgZnJhbWVVcGRhdGVMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxvY0xpc3RlbmVyc01hcCA9IHRoaXMuX2xpc3RlbmVyc01hcCwgbG9jUHJpb3JpdHlEaXJ0eUZsYWdNYXAgPSB0aGlzLl9wcmlvcml0eURpcnR5RmxhZ01hcDtcbiAgICAgICAgZm9yICh2YXIgc2VsS2V5IGluIGxvY0xpc3RlbmVyc01hcCkge1xuICAgICAgICAgICAgaWYgKGxvY0xpc3RlbmVyc01hcFtzZWxLZXldLmVtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgbG9jUHJpb3JpdHlEaXJ0eUZsYWdNYXBbc2VsS2V5XTtcbiAgICAgICAgICAgICAgICBkZWxldGUgbG9jTGlzdGVuZXJzTWFwW3NlbEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9jVG9BZGRlZExpc3RlbmVycyA9IHRoaXMuX3RvQWRkZWRMaXN0ZW5lcnM7XG4gICAgICAgIGlmIChsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxvY1RvQWRkZWRMaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yY2VBZGRFdmVudExpc3RlbmVyKGxvY1RvQWRkZWRMaXN0ZW5lcnNbaV0pO1xuICAgICAgICAgICAgbG9jVG9BZGRlZExpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl90b1JlbW92ZWRMaXN0ZW5lcnMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9jbGVhblRvUmVtb3ZlZExpc3RlbmVycygpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVUb3VjaExpc3RlbmVyczogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBsb2NJbkRpc3BhdGNoID0gdGhpcy5faW5EaXNwYXRjaDtcbiAgICAgICAgY2MuYXNzZXJ0SUQobG9jSW5EaXNwYXRjaCA+IDAsIDM1MDgpO1xuXG4gICAgICAgIGlmIChsb2NJbkRpc3BhdGNoID4gMSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgbGlzdGVuZXJzO1xuICAgICAgICBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXBbTGlzdGVuZXJJRC5UT1VDSF9PTkVfQllfT05FXTtcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgdGhpcy5fb25VcGRhdGVMaXN0ZW5lcnMobGlzdGVuZXJzKTtcbiAgICAgICAgfVxuICAgICAgICBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXBbTGlzdGVuZXJJRC5UT1VDSF9BTExfQVRfT05DRV07XG4gICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHRoaXMuX29uVXBkYXRlTGlzdGVuZXJzKGxpc3RlbmVycyk7XG4gICAgICAgIH1cblxuICAgICAgICBjYy5hc3NlcnRJRChsb2NJbkRpc3BhdGNoID09PSAxLCAzNTA5KTtcblxuICAgICAgICB2YXIgbG9jVG9BZGRlZExpc3RlbmVycyA9IHRoaXMuX3RvQWRkZWRMaXN0ZW5lcnM7XG4gICAgICAgIGlmIChsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxvY1RvQWRkZWRMaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yY2VBZGRFdmVudExpc3RlbmVyKGxvY1RvQWRkZWRMaXN0ZW5lcnNbaV0pO1xuICAgICAgICAgICAgdGhpcy5fdG9BZGRlZExpc3RlbmVycy5sZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3RvUmVtb3ZlZExpc3RlbmVycy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2NsZWFuVG9SZW1vdmVkTGlzdGVuZXJzKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy9SZW1vdmUgYWxsIGxpc3RlbmVycyBpbiBfdG9SZW1vdmVMaXN0ZW5lcnMgbGlzdCBhbmQgY2xlYW51cFxuICAgIF9jbGVhblRvUmVtb3ZlZExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9SZW1vdmVkTGlzdGVuZXJzID0gdGhpcy5fdG9SZW1vdmVkTGlzdGVuZXJzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRvUmVtb3ZlZExpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHNlbExpc3RlbmVyID0gdG9SZW1vdmVkTGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc01hcFtzZWxMaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpXTtcbiAgICAgICAgICAgIGlmICghbGlzdGVuZXJzKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICB2YXIgaWR4LCBmaXhlZFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldEZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMoKSxcbiAgICAgICAgICAgICAgICBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgIGlmIChzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICBpZHggPSBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMuaW5kZXhPZihzZWxMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzKSB7XG4gICAgICAgICAgICAgICAgaWR4ID0gZml4ZWRQcmlvcml0eUxpc3RlbmVycy5pbmRleE9mKHNlbExpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBmaXhlZFByaW9yaXR5TGlzdGVuZXJzLnNwbGljZShpZHgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0b1JlbW92ZWRMaXN0ZW5lcnMubGVuZ3RoID0gMDtcbiAgICB9LFxuXG4gICAgX29uVG91Y2hFdmVudENhbGxiYWNrOiBmdW5jdGlvbiAobGlzdGVuZXIsIGFyZ3NPYmopIHtcbiAgICAgICAgLy8gU2tpcCBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG4gICAgICAgIGlmICghbGlzdGVuZXIuX2lzUmVnaXN0ZXJlZCgpKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIHZhciBldmVudCA9IGFyZ3NPYmouZXZlbnQsIHNlbFRvdWNoID0gZXZlbnQuY3VycmVudFRvdWNoO1xuICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0ID0gbGlzdGVuZXIuX25vZGU7XG5cbiAgICAgICAgdmFyIGlzQ2xhaW1lZCA9IGZhbHNlLCByZW1vdmVkSWR4O1xuICAgICAgICB2YXIgZ2V0Q29kZSA9IGV2ZW50LmdldEV2ZW50Q29kZSgpLCBFdmVudFRvdWNoID0gY2MuRXZlbnQuRXZlbnRUb3VjaDtcbiAgICAgICAgaWYgKGdldENvZGUgPT09IEV2ZW50VG91Y2guQkVHQU4pIHtcbiAgICAgICAgICAgIGlmICghY2MubWFjcm8uRU5BQkxFX01VTFRJX1RPVUNIICYmIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGlzdGVuZXIub25Ub3VjaEJlZ2FuKSB7XG4gICAgICAgICAgICAgICAgaXNDbGFpbWVkID0gbGlzdGVuZXIub25Ub3VjaEJlZ2FuKHNlbFRvdWNoLCBldmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ2xhaW1lZCAmJiBsaXN0ZW5lci5fcmVnaXN0ZXJlZCkge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5fY2xhaW1lZFRvdWNoZXMucHVzaChzZWxUb3VjaCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoID0gc2VsVG91Y2g7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGxpc3RlbmVyLl9jbGFpbWVkVG91Y2hlcy5sZW5ndGggPiAwXG4gICAgICAgICAgICAmJiAoKHJlbW92ZWRJZHggPSBsaXN0ZW5lci5fY2xhaW1lZFRvdWNoZXMuaW5kZXhPZihzZWxUb3VjaCkpICE9PSAtMSkpIHtcbiAgICAgICAgICAgIGlzQ2xhaW1lZCA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghY2MubWFjcm8uRU5BQkxFX01VTFRJX1RPVUNIICYmIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoICYmIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoICE9PSBzZWxUb3VjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGdldENvZGUgPT09IEV2ZW50VG91Y2guTU9WRUQgJiYgbGlzdGVuZXIub25Ub3VjaE1vdmVkKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaE1vdmVkKHNlbFRvdWNoLCBldmVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGdldENvZGUgPT09IEV2ZW50VG91Y2guRU5ERUQpIHtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIub25Ub3VjaEVuZGVkKVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5vblRvdWNoRW5kZWQoc2VsVG91Y2gsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIuX3JlZ2lzdGVyZWQpXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLl9jbGFpbWVkVG91Y2hlcy5zcGxpY2UocmVtb3ZlZElkeCwgMSk7XG4gICAgICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLl9jdXJyZW50VG91Y2ggPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkNBTkNFTExFRCkge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lci5vblRvdWNoQ2FuY2VsbGVkKVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5vblRvdWNoQ2FuY2VsbGVkKHNlbFRvdWNoLCBldmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLl9yZWdpc3RlcmVkKVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5fY2xhaW1lZFRvdWNoZXMuc3BsaWNlKHJlbW92ZWRJZHgsIDEpO1xuICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5fY3VycmVudFRvdWNoID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSBldmVudCB3YXMgc3RvcHBlZCwgcmV0dXJuIGRpcmVjdGx5LlxuICAgICAgICBpZiAoZXZlbnQuaXNTdG9wcGVkKCkpIHtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5fdXBkYXRlVG91Y2hMaXN0ZW5lcnMoZXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNDbGFpbWVkICYmIGxpc3RlbmVyLnN3YWxsb3dUb3VjaGVzKSB7XG4gICAgICAgICAgICBpZiAoYXJnc09iai5uZWVkc011dGFibGVTZXQpXG4gICAgICAgICAgICAgICAgYXJnc09iai50b3VjaGVzLnNwbGljZShzZWxUb3VjaCwgMSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIF9kaXNwYXRjaFRvdWNoRXZlbnQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0aGlzLl9zb3J0RXZlbnRMaXN0ZW5lcnMoTGlzdGVuZXJJRC5UT1VDSF9PTkVfQllfT05FKTtcbiAgICAgICAgdGhpcy5fc29ydEV2ZW50TGlzdGVuZXJzKExpc3RlbmVySUQuVE9VQ0hfQUxMX0FUX09OQ0UpO1xuXG4gICAgICAgIHZhciBvbmVCeU9uZUxpc3RlbmVycyA9IHRoaXMuX2dldExpc3RlbmVycyhMaXN0ZW5lcklELlRPVUNIX09ORV9CWV9PTkUpO1xuICAgICAgICB2YXIgYWxsQXRPbmNlTGlzdGVuZXJzID0gdGhpcy5fZ2V0TGlzdGVuZXJzKExpc3RlbmVySUQuVE9VQ0hfQUxMX0FUX09OQ0UpO1xuXG4gICAgICAgIC8vIElmIHRoZXJlIGFyZW4ndCBhbnkgdG91Y2ggbGlzdGVuZXJzLCByZXR1cm4gZGlyZWN0bHkuXG4gICAgICAgIGlmIChudWxsID09PSBvbmVCeU9uZUxpc3RlbmVycyAmJiBudWxsID09PSBhbGxBdE9uY2VMaXN0ZW5lcnMpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIG9yaWdpbmFsVG91Y2hlcyA9IGV2ZW50LmdldFRvdWNoZXMoKSwgbXV0YWJsZVRvdWNoZXMgPSBjYy5qcy5hcnJheS5jb3B5KG9yaWdpbmFsVG91Y2hlcyk7XG4gICAgICAgIHZhciBvbmVCeU9uZUFyZ3NPYmogPSB7ZXZlbnQ6IGV2ZW50LCBuZWVkc011dGFibGVTZXQ6IChvbmVCeU9uZUxpc3RlbmVycyAmJiBhbGxBdE9uY2VMaXN0ZW5lcnMpLCB0b3VjaGVzOiBtdXRhYmxlVG91Y2hlcywgc2VsVG91Y2g6IG51bGx9O1xuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIHByb2Nlc3MgdGhlIHRhcmdldCBoYW5kbGVycyAxc3RcbiAgICAgICAgLy9cbiAgICAgICAgaWYgKG9uZUJ5T25lTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9yaWdpbmFsVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGV2ZW50LmN1cnJlbnRUb3VjaCA9IG9yaWdpbmFsVG91Y2hlc1tpXTtcbiAgICAgICAgICAgICAgICBldmVudC5fcHJvcGFnYXRpb25TdG9wcGVkID0gZXZlbnQuX3Byb3BhZ2F0aW9uSW1tZWRpYXRlU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnRUb0xpc3RlbmVycyhvbmVCeU9uZUxpc3RlbmVycywgdGhpcy5fb25Ub3VjaEV2ZW50Q2FsbGJhY2ssIG9uZUJ5T25lQXJnc09iaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1xuICAgICAgICAvLyBwcm9jZXNzIHN0YW5kYXJkIGhhbmRsZXJzIDJuZFxuICAgICAgICAvL1xuICAgICAgICBpZiAoYWxsQXRPbmNlTGlzdGVuZXJzICYmIG11dGFibGVUb3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnRUb0xpc3RlbmVycyhhbGxBdE9uY2VMaXN0ZW5lcnMsIHRoaXMuX29uVG91Y2hlc0V2ZW50Q2FsbGJhY2ssIHtldmVudDogZXZlbnQsIHRvdWNoZXM6IG11dGFibGVUb3VjaGVzfSk7XG4gICAgICAgICAgICBpZiAoZXZlbnQuaXNTdG9wcGVkKCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRvdWNoTGlzdGVuZXJzKGV2ZW50KTtcbiAgICB9LFxuXG4gICAgX29uVG91Y2hlc0V2ZW50Q2FsbGJhY2s6IGZ1bmN0aW9uIChsaXN0ZW5lciwgY2FsbGJhY2tQYXJhbXMpIHtcbiAgICAgICAgLy8gU2tpcCBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG4gICAgICAgIGlmICghbGlzdGVuZXIuX3JlZ2lzdGVyZWQpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgdmFyIEV2ZW50VG91Y2ggPSBjYy5FdmVudC5FdmVudFRvdWNoLCBldmVudCA9IGNhbGxiYWNrUGFyYW1zLmV2ZW50LCB0b3VjaGVzID0gY2FsbGJhY2tQYXJhbXMudG91Y2hlcywgZ2V0Q29kZSA9IGV2ZW50LmdldEV2ZW50Q29kZSgpO1xuICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0ID0gbGlzdGVuZXIuX25vZGU7XG4gICAgICAgIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkJFR0FOICYmIGxpc3RlbmVyLm9uVG91Y2hlc0JlZ2FuKVxuICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaGVzQmVnYW4odG91Y2hlcywgZXZlbnQpO1xuICAgICAgICBlbHNlIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLk1PVkVEICYmIGxpc3RlbmVyLm9uVG91Y2hlc01vdmVkKVxuICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaGVzTW92ZWQodG91Y2hlcywgZXZlbnQpO1xuICAgICAgICBlbHNlIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkVOREVEICYmIGxpc3RlbmVyLm9uVG91Y2hlc0VuZGVkKVxuICAgICAgICAgICAgbGlzdGVuZXIub25Ub3VjaGVzRW5kZWQodG91Y2hlcywgZXZlbnQpO1xuICAgICAgICBlbHNlIGlmIChnZXRDb2RlID09PSBFdmVudFRvdWNoLkNBTkNFTExFRCAmJiBsaXN0ZW5lci5vblRvdWNoZXNDYW5jZWxsZWQpXG4gICAgICAgICAgICBsaXN0ZW5lci5vblRvdWNoZXNDYW5jZWxsZWQodG91Y2hlcywgZXZlbnQpO1xuXG4gICAgICAgIC8vIElmIHRoZSBldmVudCB3YXMgc3RvcHBlZCwgcmV0dXJuIGRpcmVjdGx5LlxuICAgICAgICBpZiAoZXZlbnQuaXNTdG9wcGVkKCkpIHtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5fdXBkYXRlVG91Y2hMaXN0ZW5lcnMoZXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICBfYXNzb2NpYXRlTm9kZUFuZEV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uIChub2RlLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fbm9kZUxpc3RlbmVyc01hcFtub2RlLl9pZF07XG4gICAgICAgIGlmICghbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBsaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX25vZGVMaXN0ZW5lcnNNYXBbbm9kZS5faWRdID0gbGlzdGVuZXJzO1xuICAgICAgICB9XG4gICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9LFxuXG4gICAgX2Rpc3NvY2lhdGVOb2RlQW5kRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gKG5vZGUsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ub2RlTGlzdGVuZXJzTWFwW25vZGUuX2lkXTtcbiAgICAgICAgaWYgKGxpc3RlbmVycykge1xuICAgICAgICAgICAgY2MuanMuYXJyYXkucmVtb3ZlKGxpc3RlbmVycywgbGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX25vZGVMaXN0ZW5lcnNNYXBbbm9kZS5faWRdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kaXNwYXRjaEV2ZW50VG9MaXN0ZW5lcnM6IGZ1bmN0aW9uIChsaXN0ZW5lcnMsIG9uRXZlbnQsIGV2ZW50T3JBcmdzKSB7XG4gICAgICAgIHZhciBzaG91bGRTdG9wUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgICAgICAgdmFyIGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0Rml4ZWRQcmlvcml0eUxpc3RlbmVycygpO1xuICAgICAgICB2YXIgc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzID0gbGlzdGVuZXJzLmdldFNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycygpO1xuXG4gICAgICAgIHZhciBpID0gMCwgaiwgc2VsTGlzdGVuZXI7XG4gICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzKSB7ICAvLyBwcmlvcml0eSA8IDBcbiAgICAgICAgICAgIGlmIChmaXhlZFByaW9yaXR5TGlzdGVuZXJzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGlzdGVuZXJzLmd0MEluZGV4OyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsTGlzdGVuZXIgPSBmaXhlZFByaW9yaXR5TGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIuaXNFbmFibGVkKCkgJiYgIXNlbExpc3RlbmVyLl9pc1BhdXNlZCgpICYmIHNlbExpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSAmJiBvbkV2ZW50KHNlbExpc3RlbmVyLCBldmVudE9yQXJncykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFN0b3BQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMgJiYgIXNob3VsZFN0b3BQcm9wYWdhdGlvbikgeyAgICAvLyBwcmlvcml0eSA9PSAwLCBzY2VuZSBncmFwaCBwcmlvcml0eVxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyID0gc2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzW2pdO1xuICAgICAgICAgICAgICAgIGlmIChzZWxMaXN0ZW5lci5pc0VuYWJsZWQoKSAmJiAhc2VsTGlzdGVuZXIuX2lzUGF1c2VkKCkgJiYgc2VsTGlzdGVuZXIuX2lzUmVnaXN0ZXJlZCgpICYmIG9uRXZlbnQoc2VsTGlzdGVuZXIsIGV2ZW50T3JBcmdzKSkge1xuICAgICAgICAgICAgICAgICAgICBzaG91bGRTdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZml4ZWRQcmlvcml0eUxpc3RlbmVycyAmJiAhc2hvdWxkU3RvcFByb3BhZ2F0aW9uKSB7ICAgIC8vIHByaW9yaXR5ID4gMFxuICAgICAgICAgICAgZm9yICg7IGkgPCBmaXhlZFByaW9yaXR5TGlzdGVuZXJzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgc2VsTGlzdGVuZXIgPSBmaXhlZFByaW9yaXR5TGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChzZWxMaXN0ZW5lci5pc0VuYWJsZWQoKSAmJiAhc2VsTGlzdGVuZXIuX2lzUGF1c2VkKCkgJiYgc2VsTGlzdGVuZXIuX2lzUmVnaXN0ZXJlZCgpICYmIG9uRXZlbnQoc2VsTGlzdGVuZXIsIGV2ZW50T3JBcmdzKSkge1xuICAgICAgICAgICAgICAgICAgICBzaG91bGRTdG9wUHJvcGFnYXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3NldERpcnR5OiBmdW5jdGlvbiAobGlzdGVuZXJJRCwgZmxhZykge1xuICAgICAgICB2YXIgbG9jRGlydHlGbGFnTWFwID0gdGhpcy5fcHJpb3JpdHlEaXJ0eUZsYWdNYXA7XG4gICAgICAgIGlmIChsb2NEaXJ0eUZsYWdNYXBbbGlzdGVuZXJJRF0gPT0gbnVsbClcbiAgICAgICAgICAgIGxvY0RpcnR5RmxhZ01hcFtsaXN0ZW5lcklEXSA9IGZsYWc7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxvY0RpcnR5RmxhZ01hcFtsaXN0ZW5lcklEXSA9IGZsYWcgfCBsb2NEaXJ0eUZsYWdNYXBbbGlzdGVuZXJJRF07XG4gICAgfSxcblxuICAgIF9zb3J0TnVtYmVyQXNjOiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUXVlcnkgd2hldGhlciB0aGUgc3BlY2lmaWVkIGV2ZW50IGxpc3RlbmVyIGlkIGhhcyBiZWVuIGFkZGVkLlxuICAgICAqICEjemgg5p+l6K+i5oyH5a6a55qE5LqL5Lu2IElEIOaYr+WQpuWtmOWcqFxuICAgICAqIEBtZXRob2QgaGFzRXZlbnRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gbGlzdGVuZXJJRCAtIFRoZSBsaXN0ZW5lciBpZC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIG9yIGZhbHNlXG4gICAgICovXG4gICAgaGFzRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24gKGxpc3RlbmVySUQpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fZ2V0TGlzdGVuZXJzKGxpc3RlbmVySUQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogPHA+XG4gICAgICogQWRkcyBhIGV2ZW50IGxpc3RlbmVyIGZvciBhIHNwZWNpZmllZCBldmVudC48YnIvPlxuICAgICAqIGlmIHRoZSBwYXJhbWV0ZXIgXCJub2RlT3JQcmlvcml0eVwiIGlzIGEgbm9kZSxcbiAgICAgKiBpdCBtZWFucyB0byBhZGQgYSBldmVudCBsaXN0ZW5lciBmb3IgYSBzcGVjaWZpZWQgZXZlbnQgd2l0aCB0aGUgcHJpb3JpdHkgb2Ygc2NlbmUgZ3JhcGguPGJyLz5cbiAgICAgKiBpZiB0aGUgcGFyYW1ldGVyIFwibm9kZU9yUHJpb3JpdHlcIiBpcyBhIE51bWJlcixcbiAgICAgKiBpdCBtZWFucyB0byBhZGQgYSBldmVudCBsaXN0ZW5lciBmb3IgYSBzcGVjaWZpZWQgZXZlbnQgd2l0aCB0aGUgZml4ZWQgcHJpb3JpdHkuPGJyLz5cbiAgICAgKiA8L3A+XG4gICAgICogISN6aFxuICAgICAqIOWwhuS6i+S7tuebkeWQrOWZqOa3u+WKoOWIsOS6i+S7tueuoeeQhuWZqOS4reOAgjxici8+XG4gICAgICog5aaC5p6c5Y+C5pWwIOKAnG5vZGVPclByaW9yaXR54oCdIOaYr+iKgueCue+8jOS8mOWFiOe6p+eUsSBub2RlIOeahOa4suafk+mhuuW6j+WGs+Wumu+8jOaYvuekuuWcqOS4iuWxgueahOiKgueCueWwhuS8mOWFiOaUtuWIsOS6i+S7tuOAgjxici8+XG4gICAgICog5aaC5p6c5Y+C5pWwIOKAnG5vZGVPclByaW9yaXR54oCdIOaYr+aVsOWtl++8jOS8mOWFiOe6p+WImeWbuuWumuS4uuivpeWPguaVsOeahOaVsOWAvO+8jOaVsOWtl+i2iuWwj++8jOS8mOWFiOe6p+i2iumrmOOAgjxici8+XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGFkZExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtFdmVudExpc3RlbmVyfE9iamVjdH0gbGlzdGVuZXIgLSBUaGUgbGlzdGVuZXIgb2YgYSBzcGVjaWZpZWQgZXZlbnQgb3IgYSBvYmplY3Qgb2Ygc29tZSBldmVudCBwYXJhbWV0ZXJzLlxuICAgICAqIEBwYXJhbSB7Tm9kZXxOdW1iZXJ9IG5vZGVPclByaW9yaXR5IC0gVGhlIHByaW9yaXR5IG9mIHRoZSBsaXN0ZW5lciBpcyBiYXNlZCBvbiB0aGUgZHJhdyBvcmRlciBvZiB0aGlzIG5vZGUgb3IgZml4ZWRQcmlvcml0eSBUaGUgZml4ZWQgcHJpb3JpdHkgb2YgdGhlIGxpc3RlbmVyLlxuICAgICAqIEBub3RlICBUaGUgcHJpb3JpdHkgb2Ygc2NlbmUgZ3JhcGggd2lsbCBiZSBmaXhlZCB2YWx1ZSAwLiBTbyB0aGUgb3JkZXIgb2YgbGlzdGVuZXIgaXRlbSBpbiB0aGUgdmVjdG9yIHdpbGwgYmUgJyA8MCwgc2NlbmUgZ3JhcGggKDAgcHJpb3JpdHkpLCA+MCcuXG4gICAgICogICAgICAgICBBIGxvd2VyIHByaW9yaXR5IHdpbGwgYmUgY2FsbGVkIGJlZm9yZSB0aGUgb25lcyB0aGF0IGhhdmUgYSBoaWdoZXIgdmFsdWUuIDAgcHJpb3JpdHkgaXMgZm9yYmlkZGVuIGZvciBmaXhlZCBwcmlvcml0eSBzaW5jZSBpdCdzIHVzZWQgZm9yIHNjZW5lIGdyYXBoIGJhc2VkIHByaW9yaXR5LlxuICAgICAqICAgICAgICAgVGhlIGxpc3RlbmVyIG11c3QgYmUgYSBjYy5FdmVudExpc3RlbmVyIG9iamVjdCB3aGVuIGFkZGluZyBhIGZpeGVkIHByaW9yaXR5IGxpc3RlbmVyLCBiZWNhdXNlIHdlIGNhbid0IHJlbW92ZSBhIGZpeGVkIHByaW9yaXR5IGxpc3RlbmVyIHdpdGhvdXQgdGhlIGxpc3RlbmVyIGhhbmRsZXIsXG4gICAgICogICAgICAgICBleGNlcHQgY2FsbHMgcmVtb3ZlQWxsTGlzdGVuZXJzKCkuXG4gICAgICogQHJldHVybiB7RXZlbnRMaXN0ZW5lcn0gUmV0dXJuIHRoZSBsaXN0ZW5lci4gTmVlZGVkIGluIG9yZGVyIHRvIHJlbW92ZSB0aGUgZXZlbnQgZnJvbSB0aGUgZGlzcGF0Y2hlci5cbiAgICAgKi9cbiAgICBhZGRMaXN0ZW5lcjogZnVuY3Rpb24gKGxpc3RlbmVyLCBub2RlT3JQcmlvcml0eSkge1xuICAgICAgICBjYy5hc3NlcnRJRChsaXN0ZW5lciAmJiBub2RlT3JQcmlvcml0eSwgMzUwMyk7XG4gICAgICAgIGlmICghKGNjLmpzLmlzTnVtYmVyKG5vZGVPclByaW9yaXR5KSB8fCBub2RlT3JQcmlvcml0eSBpbnN0YW5jZW9mIGNjLl9CYXNlTm9kZSkpIHtcbiAgICAgICAgICAgIGNjLndhcm5JRCgzNTA2KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShsaXN0ZW5lciBpbnN0YW5jZW9mIGNjLkV2ZW50TGlzdGVuZXIpKSB7XG4gICAgICAgICAgICBjYy5hc3NlcnRJRCghY2MuanMuaXNOdW1iZXIobm9kZU9yUHJpb3JpdHkpLCAzNTA0KTtcbiAgICAgICAgICAgIGxpc3RlbmVyID0gY2MuRXZlbnRMaXN0ZW5lci5jcmVhdGUobGlzdGVuZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyLl9pc1JlZ2lzdGVyZWQoKSkge1xuICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDM1MDUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbGlzdGVuZXIuY2hlY2tBdmFpbGFibGUoKSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAoY2MuanMuaXNOdW1iZXIobm9kZU9yUHJpb3JpdHkpKSB7XG4gICAgICAgICAgICBpZiAobm9kZU9yUHJpb3JpdHkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBjYy5sb2dJRCgzNTAwKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkobnVsbCk7XG4gICAgICAgICAgICBsaXN0ZW5lci5fc2V0Rml4ZWRQcmlvcml0eShub2RlT3JQcmlvcml0eSk7XG4gICAgICAgICAgICBsaXN0ZW5lci5fc2V0UmVnaXN0ZXJlZCh0cnVlKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRQYXVzZWQoZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5fYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGlzdGVuZXIuX3NldFNjZW5lR3JhcGhQcmlvcml0eShub2RlT3JQcmlvcml0eSk7XG4gICAgICAgICAgICBsaXN0ZW5lci5fc2V0Rml4ZWRQcmlvcml0eSgwKTtcbiAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRSZWdpc3RlcmVkKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5fYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqICEjZW4gQWRkcyBhIEN1c3RvbSBldmVudCBsaXN0ZW5lci4gSXQgd2lsbCB1c2UgYSBmaXhlZCBwcmlvcml0eSBvZiAxLlxuICAgICAqICEjemgg5ZCR5LqL5Lu2566h55CG5Zmo5re75Yqg5LiA5Liq6Ieq5a6a5LmJ5LqL5Lu255uR5ZCs5Zmo44CCXG4gICAgICogQG1ldGhvZCBhZGRDdXN0b21MaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEByZXR1cm4ge0V2ZW50TGlzdGVuZXJ9IHRoZSBnZW5lcmF0ZWQgZXZlbnQuIE5lZWRlZCBpbiBvcmRlciB0byByZW1vdmUgdGhlIGV2ZW50IGZyb20gdGhlIGRpc3BhdGNoZXJcbiAgICAgKi9cbiAgICBhZGRDdXN0b21MaXN0ZW5lcjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gbmV3IGNjLkV2ZW50TGlzdGVuZXIuY3JlYXRlKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLkNVU1RPTSxcbiAgICAgICAgICAgIGV2ZW50TmFtZTogZXZlbnROYW1lLCBcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihsaXN0ZW5lciwgMSk7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZW1vdmUgYSBsaXN0ZW5lci5cbiAgICAgKiAhI3poIOenu+mZpOS4gOS4quW3sua3u+WKoOeahOebkeWQrOWZqOOAglxuICAgICAqIEBtZXRob2QgcmVtb3ZlTGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge0V2ZW50TGlzdGVuZXJ9IGxpc3RlbmVyIC0gYW4gZXZlbnQgbGlzdGVuZXIgb3IgYSByZWdpc3RlcmVkIG5vZGUgdGFyZ2V0XG4gICAgICogQGV4YW1wbGUge0BsaW5rIGNvY29zMmQvY29yZS9ldmVudC1tYW5hZ2VyL0NDRXZlbnRNYW5hZ2VyL3JlbW92ZUxpc3RlbmVyLmpzfVxuICAgICAqL1xuICAgIHJlbW92ZUxpc3RlbmVyOiBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKGxpc3RlbmVyID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgdmFyIGlzRm91bmQsIGxvY0xpc3RlbmVyID0gdGhpcy5fbGlzdGVuZXJzTWFwO1xuICAgICAgICBmb3IgKHZhciBzZWxLZXkgaW4gbG9jTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHZhciBsaXN0ZW5lcnMgPSBsb2NMaXN0ZW5lcltzZWxLZXldO1xuICAgICAgICAgICAgdmFyIGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0Rml4ZWRQcmlvcml0eUxpc3RlbmVycygpLCBzY2VuZUdyYXBoUHJpb3JpdHlMaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZ2V0U2NlbmVHcmFwaFByaW9yaXR5TGlzdGVuZXJzKCk7XG5cbiAgICAgICAgICAgIGlzRm91bmQgPSB0aGlzLl9yZW1vdmVMaXN0ZW5lckluVmVjdG9yKHNjZW5lR3JhcGhQcmlvcml0eUxpc3RlbmVycywgbGlzdGVuZXIpO1xuICAgICAgICAgICAgaWYgKGlzRm91bmQpe1xuICAgICAgICAgICAgICAgIC8vIGZpeGVkICM0MTYwOiBEaXJ0eSBmbGFnIG5lZWQgdG8gYmUgdXBkYXRlZCBhZnRlciBsaXN0ZW5lcnMgd2VyZSByZW1vdmVkLlxuICAgICAgICAgICAgICAgIHRoaXMuX3NldERpcnR5KGxpc3RlbmVyLl9nZXRMaXN0ZW5lcklEKCksIHRoaXMuRElSVFlfU0NFTkVfR1JBUEhfUFJJT1JJVFkpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaXNGb3VuZCA9IHRoaXMuX3JlbW92ZUxpc3RlbmVySW5WZWN0b3IoZml4ZWRQcmlvcml0eUxpc3RlbmVycywgbGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIGlmIChpc0ZvdW5kKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXREaXJ0eShsaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpLCB0aGlzLkRJUlRZX0ZJWEVEX1BSSU9SSVRZKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5lbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3ByaW9yaXR5RGlydHlGbGFnTWFwW2xpc3RlbmVyLl9nZXRMaXN0ZW5lcklEKCldO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2NMaXN0ZW5lcltzZWxLZXldO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNGb3VuZClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNGb3VuZCkge1xuICAgICAgICAgICAgdmFyIGxvY1RvQWRkZWRMaXN0ZW5lcnMgPSB0aGlzLl90b0FkZGVkTGlzdGVuZXJzO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGxvY1RvQWRkZWRMaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsTGlzdGVuZXIgPSBsb2NUb0FkZGVkTGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChzZWxMaXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuanMuYXJyYXkucmVtb3ZlQXQobG9jVG9BZGRlZExpc3RlbmVycywgaSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyLl9zZXRSZWdpc3RlcmVkKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9yZW1vdmVMaXN0ZW5lckluQ2FsbGJhY2s6IGZ1bmN0aW9uKGxpc3RlbmVycywgY2FsbGJhY2spe1xuICAgICAgICBpZiAobGlzdGVuZXJzID09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgdmFyIHNlbExpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyLl9vbkN1c3RvbUV2ZW50ID09PSBjYWxsYmFjayB8fCBzZWxMaXN0ZW5lci5fb25FdmVudCA9PT0gY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lci5fc2V0UmVnaXN0ZXJlZChmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbExpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKSAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGlzc29jaWF0ZU5vZGVBbmRFdmVudExpc3RlbmVyKHNlbExpc3RlbmVyLl9nZXRTY2VuZUdyYXBoUHJpb3JpdHkoKSwgc2VsTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxMaXN0ZW5lci5fc2V0U2NlbmVHcmFwaFByaW9yaXR5KG51bGwpOyAgICAgICAgIC8vIE5VTEwgb3V0IHRoZSBub2RlIHBvaW50ZXIgc28gd2UgZG9uJ3QgaGF2ZSBhbnkgZGFuZ2xpbmcgcG9pbnRlcnMgdG8gZGVzdHJveWVkIG5vZGVzLlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9pbkRpc3BhdGNoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICBjYy5qcy5hcnJheS5yZW1vdmVBdChsaXN0ZW5lcnMsIGkpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9SZW1vdmVkTGlzdGVuZXJzLnB1c2goc2VsTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgX3JlbW92ZUxpc3RlbmVySW5WZWN0b3I6IGZ1bmN0aW9uIChsaXN0ZW5lcnMsIGxpc3RlbmVyKSB7XG4gICAgICAgIGlmIChsaXN0ZW5lcnMgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgc2VsTGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICBpZiAoc2VsTGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgc2VsTGlzdGVuZXIuX3NldFJlZ2lzdGVyZWQoZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxMaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNzb2NpYXRlTm9kZUFuZEV2ZW50TGlzdGVuZXIoc2VsTGlzdGVuZXIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpLCBzZWxMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIHNlbExpc3RlbmVyLl9zZXRTY2VuZUdyYXBoUHJpb3JpdHkobnVsbCk7ICAgICAgICAgLy8gTlVMTCBvdXQgdGhlIG5vZGUgcG9pbnRlciBzbyB3ZSBkb24ndCBoYXZlIGFueSBkYW5nbGluZyBwb2ludGVycyB0byBkZXN0cm95ZWQgbm9kZXMuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2luRGlzcGF0Y2ggPT09IDApXG4gICAgICAgICAgICAgICAgICAgIGNjLmpzLmFycmF5LnJlbW92ZUF0KGxpc3RlbmVycywgaSk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90b1JlbW92ZWRMaXN0ZW5lcnMucHVzaChzZWxMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlbW92ZXMgYWxsIGxpc3RlbmVycyB3aXRoIHRoZSBzYW1lIGV2ZW50IGxpc3RlbmVyIHR5cGUgb3IgcmVtb3ZlcyBhbGwgbGlzdGVuZXJzIG9mIGEgbm9kZS5cbiAgICAgKiAhI3poXG4gICAgICog56e76Zmk5rOo5YaM5YiwIGV2ZW50TWFuYWdlciDkuK3mjIflrprnsbvlnovnmoTmiYDmnInkuovku7bnm5HlkKzlmajjgII8YnIvPlxuICAgICAqIDEuIOWmguaenOS8oOWFpeeahOesrOS4gOS4quWPguaVsOexu+Wei+aYryBOb2Rl77yM6YKj5LmI5LqL5Lu2566h55CG5Zmo5bCG56e76Zmk5LiO6K+l5a+56LGh55u45YWz55qE5omA5pyJ5LqL5Lu255uR5ZCs5Zmo44CCXG4gICAgICog77yI5aaC5p6c56ys5LqM5Y+C5pWwIHJlY3Vyc2l2ZSDmmK8gdHJ1ZSDnmoTor53vvIzlsLHkvJrov57lkIzor6Xlr7nosaHnmoTlrZDmjqfku7bkuIrmiYDmnInnmoTkuovku7bnm5HlkKzlmajkuZ/kuIDlubbnp7vpmaTvvIk8YnIvPlxuICAgICAqIDIuIOWmguaenOS8oOWFpeeahOesrOS4gOS4quWPguaVsOexu+Wei+aYryBOdW1iZXLvvIjor6XnsbvlnosgRXZlbnRMaXN0ZW5lciDkuK3lrprkuYnnmoTkuovku7bnsbvlnovvvInvvIxcbiAgICAgKiDpgqPkuYjkuovku7bnrqHnkIblmajlsIbnp7vpmaTor6XnsbvlnovnmoTmiYDmnInkuovku7bnm5HlkKzlmajjgII8YnIvPlxuICAgICAqXG4gICAgICog5LiL5YiX5piv55uu5YmN5a2Y5Zyo55uR5ZCs5Zmo57G75Z6L77yaICAgICAgIDxici8+XG4gICAgICogY2MuRXZlbnRMaXN0ZW5lci5VTktOT1dOICAgICAgIDxici8+XG4gICAgICogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCAgICAgIDxici8+XG4gICAgICogY2MuRXZlbnRMaXN0ZW5lci5BQ0NFTEVSQVRJT07vvIw8YnIvPlxuICAgICAqXG4gICAgICogQG1ldGhvZCByZW1vdmVMaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0ge051bWJlcnxOb2RlfSBsaXN0ZW5lclR5cGUgLSBsaXN0ZW5lclR5cGUgb3IgYSBub2RlXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbcmVjdXJzaXZlPWZhbHNlXVxuICAgICAqL1xuICAgIHJlbW92ZUxpc3RlbmVyczogZnVuY3Rpb24gKGxpc3RlbmVyVHlwZSwgcmVjdXJzaXZlKSB7XG4gICAgICAgIHZhciBpLCBfdCA9IHRoaXM7XG4gICAgICAgIGlmICghKGNjLmpzLmlzTnVtYmVyKGxpc3RlbmVyVHlwZSkgfHwgbGlzdGVuZXJUeXBlIGluc3RhbmNlb2YgY2MuX0Jhc2VOb2RlKSkge1xuICAgICAgICAgICAgY2Mud2FybklEKDM1MDYpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaXN0ZW5lclR5cGUuX2lkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIEVuc3VyZSB0aGUgbm9kZSBpcyByZW1vdmVkIGZyb20gdGhlc2UgaW1tZWRpYXRlbHkgYWxzby5cbiAgICAgICAgICAgIC8vIERvbid0IHdhbnQgYW55IGRhbmdsaW5nIHBvaW50ZXJzIG9yIHRoZSBwb3NzaWJpbGl0eSBvZiBkZWFsaW5nIHdpdGggZGVsZXRlZCBvYmplY3RzLi5cbiAgICAgICAgICAgIHZhciBsaXN0ZW5lcnMgPSBfdC5fbm9kZUxpc3RlbmVyc01hcFtsaXN0ZW5lclR5cGUuX2lkXSwgaTtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGlzdGVuZXJzQ29weSA9IGNjLmpzLmFycmF5LmNvcHkobGlzdGVuZXJzKTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdGVuZXJzQ29weS5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgX3QucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXJzQ29weVtpXSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIF90Ll9ub2RlTGlzdGVuZXJzTWFwW2xpc3RlbmVyVHlwZS5faWRdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBCdWcgZml4OiBlbnN1cmUgdGhlcmUgYXJlIG5vIHJlZmVyZW5jZXMgdG8gdGhlIG5vZGUgaW4gdGhlIGxpc3Qgb2YgbGlzdGVuZXJzIHRvIGJlIGFkZGVkLlxuICAgICAgICAgICAgLy8gSWYgd2UgZmluZCBhbnkgbGlzdGVuZXJzIGFzc29jaWF0ZWQgd2l0aCB0aGUgZGVzdHJveWVkIG5vZGUgaW4gdGhpcyBsaXN0IHRoZW4gcmVtb3ZlIHRoZW0uXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRvIGNhdGNoIHRoZSBzY2VuYXJpbyB3aGVyZSB0aGUgbm9kZSBnZXRzIGRlc3Ryb3llZCBiZWZvcmUgaXQncyBsaXN0ZW5lclxuICAgICAgICAgICAgLy8gaXMgYWRkZWQgaW50byB0aGUgZXZlbnQgZGlzcGF0Y2hlciBmdWxseS4gVGhpcyBjb3VsZCBoYXBwZW4gaWYgYSBub2RlIHJlZ2lzdGVycyBhIGxpc3RlbmVyXG4gICAgICAgICAgICAvLyBhbmQgZ2V0cyBkZXN0cm95ZWQgd2hpbGUgd2UgYXJlIGRpc3BhdGNoaW5nIGFuIGV2ZW50ICh0b3VjaCBldGMuKVxuICAgICAgICAgICAgdmFyIGxvY1RvQWRkZWRMaXN0ZW5lcnMgPSBfdC5fdG9BZGRlZExpc3RlbmVycztcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsb2NUb0FkZGVkTGlzdGVuZXJzLmxlbmd0aDsgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gbG9jVG9BZGRlZExpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIuX2dldFNjZW5lR3JhcGhQcmlvcml0eSgpID09PSBsaXN0ZW5lclR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuX3NldFNjZW5lR3JhcGhQcmlvcml0eShudWxsKTsgICAgICAgICAgICAgICAgICAgICAgLy8gRW5zdXJlIG5vIGRhbmdsaW5nIHB0ciB0byB0aGUgdGFyZ2V0IG5vZGUuXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLl9zZXRSZWdpc3RlcmVkKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgbG9jVG9BZGRlZExpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICsraTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlY3Vyc2l2ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBsb2NDaGlsZHJlbiA9IGxpc3RlbmVyVHlwZS5jaGlsZHJlbiwgbGVuO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGxvY0NoaWxkcmVuLmxlbmd0aDsgaTwgbGVuOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIF90LnJlbW92ZUxpc3RlbmVycyhsb2NDaGlsZHJlbltpXSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJUeXBlID09PSBjYy5FdmVudExpc3RlbmVyLlRPVUNIX09ORV9CWV9PTkUpXG4gICAgICAgICAgICAgICAgX3QuX3JlbW92ZUxpc3RlbmVyc0Zvckxpc3RlbmVySUQoTGlzdGVuZXJJRC5UT1VDSF9PTkVfQllfT05FKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGxpc3RlbmVyVHlwZSA9PT0gY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9BTExfQVRfT05DRSlcbiAgICAgICAgICAgICAgICBfdC5fcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRChMaXN0ZW5lcklELlRPVUNIX0FMTF9BVF9PTkNFKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGxpc3RlbmVyVHlwZSA9PT0gY2MuRXZlbnRMaXN0ZW5lci5NT1VTRSlcbiAgICAgICAgICAgICAgICBfdC5fcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRChMaXN0ZW5lcklELk1PVVNFKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGxpc3RlbmVyVHlwZSA9PT0gY2MuRXZlbnRMaXN0ZW5lci5BQ0NFTEVSQVRJT04pXG4gICAgICAgICAgICAgICAgX3QuX3JlbW92ZUxpc3RlbmVyc0Zvckxpc3RlbmVySUQoTGlzdGVuZXJJRC5BQ0NFTEVSQVRJT04pO1xuICAgICAgICAgICAgZWxzZSBpZiAobGlzdGVuZXJUeXBlID09PSBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJEKVxuICAgICAgICAgICAgICAgIF90Ll9yZW1vdmVMaXN0ZW5lcnNGb3JMaXN0ZW5lcklEKExpc3RlbmVySUQuS0VZQk9BUkQpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDM1MDEpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogISNlbiBSZW1vdmVzIGFsbCBjdXN0b20gbGlzdGVuZXJzIHdpdGggdGhlIHNhbWUgZXZlbnQgbmFtZS5cbiAgICAgKiAhI3poIOenu+mZpOWQjOS4gOS6i+S7tuWQjeeahOiHquWumuS5ieS6i+S7tuebkeWQrOWZqOOAglxuICAgICAqIEBtZXRob2QgcmVtb3ZlQ3VzdG9tTGlzdGVuZXJzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGN1c3RvbUV2ZW50TmFtZVxuICAgICAqL1xuICAgIHJlbW92ZUN1c3RvbUxpc3RlbmVyczogZnVuY3Rpb24gKGN1c3RvbUV2ZW50TmFtZSkge1xuICAgICAgICB0aGlzLl9yZW1vdmVMaXN0ZW5lcnNGb3JMaXN0ZW5lcklEKGN1c3RvbUV2ZW50TmFtZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmVtb3ZlcyBhbGwgbGlzdGVuZXJzXG4gICAgICogISN6aCDnp7vpmaTmiYDmnInkuovku7bnm5HlkKzlmajjgIJcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUFsbExpc3RlbmVyc1xuICAgICAqL1xuICAgIHJlbW92ZUFsbExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbG9jTGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwLCBsb2NJbnRlcm5hbEN1c3RvbUV2ZW50SURzID0gdGhpcy5faW50ZXJuYWxDdXN0b21MaXN0ZW5lcklEcztcbiAgICAgICAgZm9yICh2YXIgc2VsS2V5IGluIGxvY0xpc3RlbmVycyl7XG4gICAgICAgICAgICBpZihsb2NJbnRlcm5hbEN1c3RvbUV2ZW50SURzLmluZGV4T2Yoc2VsS2V5KSA9PT0gLTEpXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXJzRm9yTGlzdGVuZXJJRChzZWxLZXkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyBsaXN0ZW5lcidzIHByaW9yaXR5IHdpdGggZml4ZWQgdmFsdWUuXG4gICAgICogISN6aCDorr7nva4gRml4ZWRQcmlvcml0eSDnsbvlnovnm5HlkKzlmajnmoTkvJjlhYjnuqfjgIJcbiAgICAgKiBAbWV0aG9kIHNldFByaW9yaXR5XG4gICAgICogQHBhcmFtIHtFdmVudExpc3RlbmVyfSBsaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBmaXhlZFByaW9yaXR5XG4gICAgICovXG4gICAgc2V0UHJpb3JpdHk6IGZ1bmN0aW9uIChsaXN0ZW5lciwgZml4ZWRQcmlvcml0eSkge1xuICAgICAgICBpZiAobGlzdGVuZXIgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB2YXIgbG9jTGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzTWFwO1xuICAgICAgICBmb3IgKHZhciBzZWxLZXkgaW4gbG9jTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICB2YXIgc2VsTGlzdGVuZXJzID0gbG9jTGlzdGVuZXJzW3NlbEtleV07XG4gICAgICAgICAgICB2YXIgZml4ZWRQcmlvcml0eUxpc3RlbmVycyA9IHNlbExpc3RlbmVycy5nZXRGaXhlZFByaW9yaXR5TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICBpZiAoZml4ZWRQcmlvcml0eUxpc3RlbmVycykge1xuICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IGZpeGVkUHJpb3JpdHlMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpZihsaXN0ZW5lci5fZ2V0U2NlbmVHcmFwaFByaW9yaXR5KCkgIT0gbnVsbClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDM1MDIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIuX2dldEZpeGVkUHJpb3JpdHkoKSAhPT0gZml4ZWRQcmlvcml0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuX3NldEZpeGVkUHJpb3JpdHkoZml4ZWRQcmlvcml0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXREaXJ0eShsaXN0ZW5lci5fZ2V0TGlzdGVuZXJJRCgpLCB0aGlzLkRJUlRZX0ZJWEVEX1BSSU9SSVRZKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gV2hldGhlciB0byBlbmFibGUgZGlzcGF0Y2hpbmcgZXZlbnRzXG4gICAgICogISN6aCDlkK/nlKjmiJbnpoHnlKjkuovku7bnrqHnkIblmajvvIznpoHnlKjlkI7kuI3kvJrliIblj5Hku7vkvZXkuovku7bjgIJcbiAgICAgKiBAbWV0aG9kIHNldEVuYWJsZWRcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZWRcbiAgICAgKi9cbiAgICBzZXRFbmFibGVkOiBmdW5jdGlvbiAoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLl9pc0VuYWJsZWQgPSBlbmFibGVkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENoZWNrcyB3aGV0aGVyIGRpc3BhdGNoaW5nIGV2ZW50cyBpcyBlbmFibGVkXG4gICAgICogISN6aCDmo4DmtYvkuovku7bnrqHnkIblmajmmK/lkKblkK/nlKjjgIJcbiAgICAgKiBAbWV0aG9kIGlzRW5hYmxlZFxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzRW5hYmxlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNFbmFibGVkO1xuICAgIH0sXG5cbiAgICAvKlxuICAgICAqICEjZW4gRGlzcGF0Y2hlcyB0aGUgZXZlbnQsIGFsc28gcmVtb3ZlcyBhbGwgRXZlbnRMaXN0ZW5lcnMgbWFya2VkIGZvciBkZWxldGlvbiBmcm9tIHRoZSBldmVudCBkaXNwYXRjaGVyIGxpc3QuXG4gICAgICogISN6aCDliIblj5Hkuovku7bjgIJcbiAgICAgKiBAbWV0aG9kIGRpc3BhdGNoRXZlbnRcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxuICAgICAqL1xuICAgIGRpc3BhdGNoRXZlbnQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuX2lzRW5hYmxlZClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLl91cGRhdGVEaXJ0eUZsYWdGb3JTY2VuZUdyYXBoKCk7XG4gICAgICAgIHRoaXMuX2luRGlzcGF0Y2grKztcbiAgICAgICAgaWYgKCFldmVudCB8fCAhZXZlbnQuZ2V0VHlwZSkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzNTExKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQuZ2V0VHlwZSgpLnN0YXJ0c1dpdGgoY2MuRXZlbnQuVE9VQ0gpKSB7XG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaFRvdWNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5faW5EaXNwYXRjaC0tO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxpc3RlbmVySUQgPSBfX2dldExpc3RlbmVySUQoZXZlbnQpO1xuICAgICAgICB0aGlzLl9zb3J0RXZlbnRMaXN0ZW5lcnMobGlzdGVuZXJJRCk7XG4gICAgICAgIHZhciBzZWxMaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNNYXBbbGlzdGVuZXJJRF07XG4gICAgICAgIGlmIChzZWxMaXN0ZW5lcnMgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudFRvTGlzdGVuZXJzKHNlbExpc3RlbmVycywgdGhpcy5fb25MaXN0ZW5lckNhbGxiYWNrLCBldmVudCk7XG4gICAgICAgICAgICB0aGlzLl9vblVwZGF0ZUxpc3RlbmVycyhzZWxMaXN0ZW5lcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faW5EaXNwYXRjaC0tO1xuICAgIH0sXG5cbiAgICBfb25MaXN0ZW5lckNhbGxiYWNrOiBmdW5jdGlvbihsaXN0ZW5lciwgZXZlbnQpe1xuICAgICAgICBldmVudC5jdXJyZW50VGFyZ2V0ID0gbGlzdGVuZXIuX3RhcmdldDtcbiAgICAgICAgbGlzdGVuZXIuX29uRXZlbnQoZXZlbnQpO1xuICAgICAgICByZXR1cm4gZXZlbnQuaXNTdG9wcGVkKCk7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogISNlbiBEaXNwYXRjaGVzIGEgQ3VzdG9tIEV2ZW50IHdpdGggYSBldmVudCBuYW1lIGFuIG9wdGlvbmFsIHVzZXIgZGF0YVxuICAgICAqICEjemgg5YiG5Y+R6Ieq5a6a5LmJ5LqL5Lu244CCXG4gICAgICogQG1ldGhvZCBkaXNwYXRjaEN1c3RvbUV2ZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9uYWxVc2VyRGF0YVxuICAgICAqL1xuICAgIGRpc3BhdGNoQ3VzdG9tRXZlbnQ6IGZ1bmN0aW9uIChldmVudE5hbWUsIG9wdGlvbmFsVXNlckRhdGEpIHtcbiAgICAgICAgdmFyIGV2ID0gbmV3IGNjLkV2ZW50LkV2ZW50Q3VzdG9tKGV2ZW50TmFtZSk7XG4gICAgICAgIGV2LnNldFVzZXJEYXRhKG9wdGlvbmFsVXNlckRhdGEpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZXYpO1xuICAgIH1cbn07XG5cblxuanMuZ2V0KGNjLCAnZXZlbnRNYW5hZ2VyJywgZnVuY3Rpb24gKCkge1xuICAgIGNjLndhcm5JRCgxNDA1LCAnY2MuZXZlbnRNYW5hZ2VyJywgJ2NjLkV2ZW50VGFyZ2V0IG9yIGNjLnN5c3RlbUV2ZW50Jyk7XG4gICAgcmV0dXJuIGV2ZW50TWFuYWdlcjtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjLmludGVybmFsLmV2ZW50TWFuYWdlciA9IGV2ZW50TWFuYWdlcjtcbiJdfQ==