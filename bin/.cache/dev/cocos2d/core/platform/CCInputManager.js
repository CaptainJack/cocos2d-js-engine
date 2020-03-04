
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCInputManager.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
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
var macro = require('./CCMacro');

var sys = require('./CCSys');

var eventManager = require('../event-manager');

var TOUCH_TIMEOUT = macro.TOUCH_TIMEOUT;

var _vec2 = cc.v2();
/**
 *  This class manages all events of input. include: touch, mouse, accelerometer, keyboard
 */


var inputManager = {
  _mousePressed: false,
  _isRegisterEvent: false,
  _preTouchPoint: cc.v2(0, 0),
  _prevMousePoint: cc.v2(0, 0),
  _preTouchPool: [],
  _preTouchPoolPointer: 0,
  _touches: [],
  _touchesIntegerDict: {},
  _indexBitsUsed: 0,
  _maxTouches: 8,
  _accelEnabled: false,
  _accelInterval: 1 / 5,
  _accelMinus: 1,
  _accelCurTime: 0,
  _acceleration: null,
  _accelDeviceEvent: null,
  _canvasBoundingRect: {
    left: 0,
    top: 0,
    adjustedLeft: 0,
    adjustedTop: 0,
    width: 0,
    height: 0
  },
  _getUnUsedIndex: function _getUnUsedIndex() {
    var temp = this._indexBitsUsed;
    var now = cc.sys.now();

    for (var i = 0; i < this._maxTouches; i++) {
      if (!(temp & 0x00000001)) {
        this._indexBitsUsed |= 1 << i;
        return i;
      } else {
        var touch = this._touches[i];

        if (now - touch._lastModified > TOUCH_TIMEOUT) {
          this._removeUsedIndexBit(i);

          delete this._touchesIntegerDict[touch.getID()];
          return i;
        }
      }

      temp >>= 1;
    } // all bits are used


    return -1;
  },
  _removeUsedIndexBit: function _removeUsedIndexBit(index) {
    if (index < 0 || index >= this._maxTouches) return;
    var temp = 1 << index;
    temp = ~temp;
    this._indexBitsUsed &= temp;
  },
  _glView: null,
  _updateCanvasBoundingRect: function _updateCanvasBoundingRect() {
    var element = cc.game.canvas;
    var canvasBoundingRect = this._canvasBoundingRect;
    var docElem = document.documentElement;
    var leftOffset = window.pageXOffset - docElem.clientLeft;
    var topOffset = window.pageYOffset - docElem.clientTop;

    if (element.getBoundingClientRect) {
      var box = element.getBoundingClientRect();
      canvasBoundingRect.left = box.left + leftOffset;
      canvasBoundingRect.top = box.top + topOffset;
      canvasBoundingRect.width = box.width;
      canvasBoundingRect.height = box.height;
    } else if (element instanceof HTMLCanvasElement) {
      canvasBoundingRect.left = leftOffset;
      canvasBoundingRect.top = topOffset;
      canvasBoundingRect.width = element.width;
      canvasBoundingRect.height = element.height;
    } else {
      canvasBoundingRect.left = leftOffset;
      canvasBoundingRect.top = topOffset;
      canvasBoundingRect.width = parseInt(element.style.width);
      canvasBoundingRect.height = parseInt(element.style.height);
    }
  },

  /**
   * @method handleTouchesBegin
   * @param {Array} touches
   */
  handleTouchesBegin: function handleTouchesBegin(touches) {
    var selTouch,
        index,
        curTouch,
        touchID,
        handleTouches = [],
        locTouchIntDict = this._touchesIntegerDict,
        now = sys.now();

    for (var i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.getID();
      index = locTouchIntDict[touchID];

      if (index == null) {
        var unusedIndex = this._getUnUsedIndex();

        if (unusedIndex === -1) {
          cc.logID(2300, unusedIndex);
          continue;
        } //curTouch = this._touches[unusedIndex] = selTouch;


        curTouch = this._touches[unusedIndex] = new cc.Touch(selTouch._point.x, selTouch._point.y, selTouch.getID());
        curTouch._lastModified = now;

        curTouch._setPrevPoint(selTouch._prevPoint);

        locTouchIntDict[touchID] = unusedIndex;
        handleTouches.push(curTouch);
      }
    }

    if (handleTouches.length > 0) {
      this._glView._convertTouchesWithScale(handleTouches);

      var touchEvent = new cc.Event.EventTouch(handleTouches);
      touchEvent._eventCode = cc.Event.EventTouch.BEGAN;
      eventManager.dispatchEvent(touchEvent);
    }
  },

  /**
   * @method handleTouchesMove
   * @param {Array} touches
   */
  handleTouchesMove: function handleTouchesMove(touches) {
    var selTouch,
        index,
        touchID,
        handleTouches = [],
        locTouches = this._touches,
        now = sys.now();

    for (var i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.getID();
      index = this._touchesIntegerDict[touchID];

      if (index == null) {
        //cc.log("if the index doesn't exist, it is an error");
        continue;
      }

      if (locTouches[index]) {
        locTouches[index]._setPoint(selTouch._point);

        locTouches[index]._setPrevPoint(selTouch._prevPoint);

        locTouches[index]._lastModified = now;
        handleTouches.push(locTouches[index]);
      }
    }

    if (handleTouches.length > 0) {
      this._glView._convertTouchesWithScale(handleTouches);

      var touchEvent = new cc.Event.EventTouch(handleTouches);
      touchEvent._eventCode = cc.Event.EventTouch.MOVED;
      eventManager.dispatchEvent(touchEvent);
    }
  },

  /**
   * @method handleTouchesEnd
   * @param {Array} touches
   */
  handleTouchesEnd: function handleTouchesEnd(touches) {
    var handleTouches = this.getSetOfTouchesEndOrCancel(touches);

    if (handleTouches.length > 0) {
      this._glView._convertTouchesWithScale(handleTouches);

      var touchEvent = new cc.Event.EventTouch(handleTouches);
      touchEvent._eventCode = cc.Event.EventTouch.ENDED;
      eventManager.dispatchEvent(touchEvent);
    }

    this._preTouchPool.length = 0;
  },

  /**
   * @method handleTouchesCancel
   * @param {Array} touches
   */
  handleTouchesCancel: function handleTouchesCancel(touches) {
    var handleTouches = this.getSetOfTouchesEndOrCancel(touches);

    if (handleTouches.length > 0) {
      this._glView._convertTouchesWithScale(handleTouches);

      var touchEvent = new cc.Event.EventTouch(handleTouches);
      touchEvent._eventCode = cc.Event.EventTouch.CANCELLED;
      eventManager.dispatchEvent(touchEvent);
    }

    this._preTouchPool.length = 0;
  },

  /**
   * @method getSetOfTouchesEndOrCancel
   * @param {Array} touches
   * @returns {Array}
   */
  getSetOfTouchesEndOrCancel: function getSetOfTouchesEndOrCancel(touches) {
    var selTouch,
        index,
        touchID,
        handleTouches = [],
        locTouches = this._touches,
        locTouchesIntDict = this._touchesIntegerDict;

    for (var i = 0, len = touches.length; i < len; i++) {
      selTouch = touches[i];
      touchID = selTouch.getID();
      index = locTouchesIntDict[touchID];

      if (index == null) {
        continue; //cc.log("if the index doesn't exist, it is an error");
      }

      if (locTouches[index]) {
        locTouches[index]._setPoint(selTouch._point);

        locTouches[index]._setPrevPoint(selTouch._prevPoint);

        handleTouches.push(locTouches[index]);

        this._removeUsedIndexBit(index);

        delete locTouchesIntDict[touchID];
      }
    }

    return handleTouches;
  },

  /**
   * @method getPreTouch
   * @param {Touch} touch
   * @return {Touch}
   */
  getPreTouch: function getPreTouch(touch) {
    var preTouch = null;
    var locPreTouchPool = this._preTouchPool;
    var id = touch.getID();

    for (var i = locPreTouchPool.length - 1; i >= 0; i--) {
      if (locPreTouchPool[i].getID() === id) {
        preTouch = locPreTouchPool[i];
        break;
      }
    }

    if (!preTouch) preTouch = touch;
    return preTouch;
  },

  /**
   * @method setPreTouch
   * @param {Touch} touch
   */
  setPreTouch: function setPreTouch(touch) {
    var find = false;
    var locPreTouchPool = this._preTouchPool;
    var id = touch.getID();

    for (var i = locPreTouchPool.length - 1; i >= 0; i--) {
      if (locPreTouchPool[i].getID() === id) {
        locPreTouchPool[i] = touch;
        find = true;
        break;
      }
    }

    if (!find) {
      if (locPreTouchPool.length <= 50) {
        locPreTouchPool.push(touch);
      } else {
        locPreTouchPool[this._preTouchPoolPointer] = touch;
        this._preTouchPoolPointer = (this._preTouchPoolPointer + 1) % 50;
      }
    }
  },

  /**
   * @method getTouchByXY
   * @param {Number} tx
   * @param {Number} ty
   * @param {Vec2} pos
   * @return {Touch}
   */
  getTouchByXY: function getTouchByXY(tx, ty, pos) {
    var locPreTouch = this._preTouchPoint;

    var location = this._glView.convertToLocationInView(tx, ty, pos);

    var touch = new cc.Touch(location.x, location.y, 0);

    touch._setPrevPoint(locPreTouch.x, locPreTouch.y);

    locPreTouch.x = location.x;
    locPreTouch.y = location.y;
    return touch;
  },

  /**
   * @method getMouseEvent
   * @param {Vec2} location
   * @param {Vec2} pos
   * @param {Number} eventType
   * @returns {Event.EventMouse}
   */
  getMouseEvent: function getMouseEvent(location, pos, eventType) {
    var locPreMouse = this._prevMousePoint;
    var mouseEvent = new cc.Event.EventMouse(eventType);

    mouseEvent._setPrevCursor(locPreMouse.x, locPreMouse.y);

    locPreMouse.x = location.x;
    locPreMouse.y = location.y;

    this._glView._convertMouseToLocationInView(locPreMouse, pos);

    mouseEvent.setLocation(locPreMouse.x, locPreMouse.y);
    return mouseEvent;
  },

  /**
   * @method getPointByEvent
   * @param {Touch} event
   * @param {Vec2} pos
   * @return {Vec2}
   */
  getPointByEvent: function getPointByEvent(event, pos) {
    // qq , uc and safari browser can't calculate pageY correctly, need to refresh canvas bounding rect
    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_QQ || cc.sys.browserType === cc.sys.BROWSER_TYPE_UC || cc.sys.browserType === cc.sys.BROWSER_TYPE_SAFARI) {
      this._updateCanvasBoundingRect();
    }

    if (event.pageX != null) //not avalable in <= IE8
      return {
        x: event.pageX,
        y: event.pageY
      };
    pos.left -= document.body.scrollLeft;
    pos.top -= document.body.scrollTop;
    return {
      x: event.clientX,
      y: event.clientY
    };
  },

  /**
   * @method getTouchesByEvent
   * @param {Touch} event
   * @param {Vec2} pos
   * @returns {Array}
   */
  getTouchesByEvent: function getTouchesByEvent(event, pos) {
    var touchArr = [],
        locView = this._glView;
    var touch_event, touch, preLocation;
    var locPreTouch = this._preTouchPoint;
    var length = event.changedTouches.length;

    for (var i = 0; i < length; i++) {
      touch_event = event.changedTouches[i];

      if (touch_event) {
        var location = void 0;
        if (sys.BROWSER_TYPE_FIREFOX === sys.browserType) location = locView.convertToLocationInView(touch_event.pageX, touch_event.pageY, pos, _vec2);else location = locView.convertToLocationInView(touch_event.clientX, touch_event.clientY, pos, _vec2);

        if (touch_event.identifier != null) {
          touch = new cc.Touch(location.x, location.y, touch_event.identifier); //use Touch Pool

          preLocation = this.getPreTouch(touch).getLocation();

          touch._setPrevPoint(preLocation.x, preLocation.y);

          this.setPreTouch(touch);
        } else {
          touch = new cc.Touch(location.x, location.y);

          touch._setPrevPoint(locPreTouch.x, locPreTouch.y);
        }

        locPreTouch.x = location.x;
        locPreTouch.y = location.y;
        touchArr.push(touch);
      }
    }

    return touchArr;
  },

  /**
   * @method registerSystemEvent
   * @param {HTMLElement} element
   */
  registerSystemEvent: function registerSystemEvent(element) {
    if (this._isRegisterEvent) return;
    this._glView = cc.view;
    var selfPointer = this;
    var canvasBoundingRect = this._canvasBoundingRect;
    window.addEventListener('resize', this._updateCanvasBoundingRect.bind(this));
    var prohibition = sys.isMobile;
    var supportMouse = 'mouse' in sys.capabilities;
    var supportTouches = 'touches' in sys.capabilities;

    if (supportMouse) {
      //HACK
      //  - At the same time to trigger the ontouch event and onmouse event
      //  - The function will execute 2 times
      //The known browser:
      //  liebiao
      //  miui
      //  WECHAT
      if (!prohibition) {
        window.addEventListener('mousedown', function () {
          selfPointer._mousePressed = true;
        }, false);
        window.addEventListener('mouseup', function (event) {
          if (!selfPointer._mousePressed) return;
          selfPointer._mousePressed = false;
          var location = selfPointer.getPointByEvent(event, canvasBoundingRect);

          if (!cc.rect(canvasBoundingRect.left, canvasBoundingRect.top, canvasBoundingRect.width, canvasBoundingRect.height).contains(location)) {
            selfPointer.handleTouchesEnd([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);
            var mouseEvent = selfPointer.getMouseEvent(location, canvasBoundingRect, cc.Event.EventMouse.UP);
            mouseEvent.setButton(event.button);
            eventManager.dispatchEvent(mouseEvent);
          }
        }, false);
      } // register canvas mouse event


      var EventMouse = cc.Event.EventMouse;
      var _mouseEventsOnElement = [!prohibition && ["mousedown", EventMouse.DOWN, function (event, mouseEvent, location, canvasBoundingRect) {
        selfPointer._mousePressed = true;
        selfPointer.handleTouchesBegin([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);
        element.focus();
      }], !prohibition && ["mouseup", EventMouse.UP, function (event, mouseEvent, location, canvasBoundingRect) {
        selfPointer._mousePressed = false;
        selfPointer.handleTouchesEnd([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);
      }], !prohibition && ["mousemove", EventMouse.MOVE, function (event, mouseEvent, location, canvasBoundingRect) {
        selfPointer.handleTouchesMove([selfPointer.getTouchByXY(location.x, location.y, canvasBoundingRect)]);

        if (!selfPointer._mousePressed) {
          mouseEvent.setButton(null);
        }
      }], ["mousewheel", EventMouse.SCROLL, function (event, mouseEvent) {
        mouseEvent.setScrollData(0, event.wheelDelta);
      }],
      /* firefox fix */
      ["DOMMouseScroll", EventMouse.SCROLL, function (event, mouseEvent) {
        mouseEvent.setScrollData(0, event.detail * -120);
      }]];

      for (var i = 0; i < _mouseEventsOnElement.length; ++i) {
        var entry = _mouseEventsOnElement[i];

        if (entry) {
          (function () {
            var name = entry[0];
            var type = entry[1];
            var handler = entry[2];
            element.addEventListener(name, function (event) {
              var location = selfPointer.getPointByEvent(event, canvasBoundingRect);
              var mouseEvent = selfPointer.getMouseEvent(location, canvasBoundingRect, type);
              mouseEvent.setButton(event.button);
              handler(event, mouseEvent, location, canvasBoundingRect);
              eventManager.dispatchEvent(mouseEvent);
              event.stopPropagation();
              event.preventDefault();
            }, false);
          })();
        }
      }
    }

    if (window.navigator.msPointerEnabled) {
      var _pointerEventsMap = {
        "MSPointerDown": selfPointer.handleTouchesBegin,
        "MSPointerMove": selfPointer.handleTouchesMove,
        "MSPointerUp": selfPointer.handleTouchesEnd,
        "MSPointerCancel": selfPointer.handleTouchesCancel
      };

      var _loop = function _loop(eventName) {
        var touchEvent = _pointerEventsMap[eventName];
        element.addEventListener(eventName, function (event) {
          var documentElement = document.documentElement;
          canvasBoundingRect.adjustedLeft = canvasBoundingRect.left - documentElement.scrollLeft;
          canvasBoundingRect.adjustedTop = canvasBoundingRect.top - documentElement.scrollTop;
          touchEvent.call(selfPointer, [selfPointer.getTouchByXY(event.clientX, event.clientY, canvasBoundingRect)]);
          event.stopPropagation();
        }, false);
      };

      for (var eventName in _pointerEventsMap) {
        _loop(eventName);
      }
    } //register touch event


    if (supportTouches) {
      var _touchEventsMap = {
        "touchstart": function touchstart(touchesToHandle) {
          selfPointer.handleTouchesBegin(touchesToHandle);
          element.focus();
        },
        "touchmove": function touchmove(touchesToHandle) {
          selfPointer.handleTouchesMove(touchesToHandle);
        },
        "touchend": function touchend(touchesToHandle) {
          selfPointer.handleTouchesEnd(touchesToHandle);
        },
        "touchcancel": function touchcancel(touchesToHandle) {
          selfPointer.handleTouchesCancel(touchesToHandle);
        }
      };

      var registerTouchEvent = function registerTouchEvent(eventName) {
        var handler = _touchEventsMap[eventName];
        element.addEventListener(eventName, function (event) {
          if (!event.changedTouches) return;
          var body = document.body;
          canvasBoundingRect.adjustedLeft = canvasBoundingRect.left - (body.scrollLeft || 0);
          canvasBoundingRect.adjustedTop = canvasBoundingRect.top - (body.scrollTop || 0);
          handler(selfPointer.getTouchesByEvent(event, canvasBoundingRect));
          event.stopPropagation();
          event.preventDefault();
        }, false);
      };

      for (var _eventName in _touchEventsMap) {
        registerTouchEvent(_eventName);
      }
    }

    this._registerKeyboardEvent();

    this._isRegisterEvent = true;
  },
  _registerKeyboardEvent: function _registerKeyboardEvent() {},
  _registerAccelerometerEvent: function _registerAccelerometerEvent() {},

  /**
   * @method update
   * @param {Number} dt
   */
  update: function update(dt) {
    if (this._accelCurTime > this._accelInterval) {
      this._accelCurTime -= this._accelInterval;
      eventManager.dispatchEvent(new cc.Event.EventAcceleration(this._acceleration));
    }

    this._accelCurTime += dt;
  }
};
module.exports = cc.internal.inputManager = inputManager;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDSW5wdXRNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIm1hY3JvIiwicmVxdWlyZSIsInN5cyIsImV2ZW50TWFuYWdlciIsIlRPVUNIX1RJTUVPVVQiLCJfdmVjMiIsImNjIiwidjIiLCJpbnB1dE1hbmFnZXIiLCJfbW91c2VQcmVzc2VkIiwiX2lzUmVnaXN0ZXJFdmVudCIsIl9wcmVUb3VjaFBvaW50IiwiX3ByZXZNb3VzZVBvaW50IiwiX3ByZVRvdWNoUG9vbCIsIl9wcmVUb3VjaFBvb2xQb2ludGVyIiwiX3RvdWNoZXMiLCJfdG91Y2hlc0ludGVnZXJEaWN0IiwiX2luZGV4Qml0c1VzZWQiLCJfbWF4VG91Y2hlcyIsIl9hY2NlbEVuYWJsZWQiLCJfYWNjZWxJbnRlcnZhbCIsIl9hY2NlbE1pbnVzIiwiX2FjY2VsQ3VyVGltZSIsIl9hY2NlbGVyYXRpb24iLCJfYWNjZWxEZXZpY2VFdmVudCIsIl9jYW52YXNCb3VuZGluZ1JlY3QiLCJsZWZ0IiwidG9wIiwiYWRqdXN0ZWRMZWZ0IiwiYWRqdXN0ZWRUb3AiLCJ3aWR0aCIsImhlaWdodCIsIl9nZXRVblVzZWRJbmRleCIsInRlbXAiLCJub3ciLCJpIiwidG91Y2giLCJfbGFzdE1vZGlmaWVkIiwiX3JlbW92ZVVzZWRJbmRleEJpdCIsImdldElEIiwiaW5kZXgiLCJfZ2xWaWV3IiwiX3VwZGF0ZUNhbnZhc0JvdW5kaW5nUmVjdCIsImVsZW1lbnQiLCJnYW1lIiwiY2FudmFzIiwiY2FudmFzQm91bmRpbmdSZWN0IiwiZG9jRWxlbSIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwibGVmdE9mZnNldCIsIndpbmRvdyIsInBhZ2VYT2Zmc2V0IiwiY2xpZW50TGVmdCIsInRvcE9mZnNldCIsInBhZ2VZT2Zmc2V0IiwiY2xpZW50VG9wIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiYm94IiwiSFRNTENhbnZhc0VsZW1lbnQiLCJwYXJzZUludCIsInN0eWxlIiwiaGFuZGxlVG91Y2hlc0JlZ2luIiwidG91Y2hlcyIsInNlbFRvdWNoIiwiY3VyVG91Y2giLCJ0b3VjaElEIiwiaGFuZGxlVG91Y2hlcyIsImxvY1RvdWNoSW50RGljdCIsImxlbiIsImxlbmd0aCIsInVudXNlZEluZGV4IiwibG9nSUQiLCJUb3VjaCIsIl9wb2ludCIsIngiLCJ5IiwiX3NldFByZXZQb2ludCIsIl9wcmV2UG9pbnQiLCJwdXNoIiwiX2NvbnZlcnRUb3VjaGVzV2l0aFNjYWxlIiwidG91Y2hFdmVudCIsIkV2ZW50IiwiRXZlbnRUb3VjaCIsIl9ldmVudENvZGUiLCJCRUdBTiIsImRpc3BhdGNoRXZlbnQiLCJoYW5kbGVUb3VjaGVzTW92ZSIsImxvY1RvdWNoZXMiLCJfc2V0UG9pbnQiLCJNT1ZFRCIsImhhbmRsZVRvdWNoZXNFbmQiLCJnZXRTZXRPZlRvdWNoZXNFbmRPckNhbmNlbCIsIkVOREVEIiwiaGFuZGxlVG91Y2hlc0NhbmNlbCIsIkNBTkNFTExFRCIsImxvY1RvdWNoZXNJbnREaWN0IiwiZ2V0UHJlVG91Y2giLCJwcmVUb3VjaCIsImxvY1ByZVRvdWNoUG9vbCIsImlkIiwic2V0UHJlVG91Y2giLCJmaW5kIiwiZ2V0VG91Y2hCeVhZIiwidHgiLCJ0eSIsInBvcyIsImxvY1ByZVRvdWNoIiwibG9jYXRpb24iLCJjb252ZXJ0VG9Mb2NhdGlvbkluVmlldyIsImdldE1vdXNlRXZlbnQiLCJldmVudFR5cGUiLCJsb2NQcmVNb3VzZSIsIm1vdXNlRXZlbnQiLCJFdmVudE1vdXNlIiwiX3NldFByZXZDdXJzb3IiLCJfY29udmVydE1vdXNlVG9Mb2NhdGlvbkluVmlldyIsInNldExvY2F0aW9uIiwiZ2V0UG9pbnRCeUV2ZW50IiwiZXZlbnQiLCJicm93c2VyVHlwZSIsIkJST1dTRVJfVFlQRV9RUSIsIkJST1dTRVJfVFlQRV9VQyIsIkJST1dTRVJfVFlQRV9TQUZBUkkiLCJwYWdlWCIsInBhZ2VZIiwiYm9keSIsInNjcm9sbExlZnQiLCJzY3JvbGxUb3AiLCJjbGllbnRYIiwiY2xpZW50WSIsImdldFRvdWNoZXNCeUV2ZW50IiwidG91Y2hBcnIiLCJsb2NWaWV3IiwidG91Y2hfZXZlbnQiLCJwcmVMb2NhdGlvbiIsImNoYW5nZWRUb3VjaGVzIiwiQlJPV1NFUl9UWVBFX0ZJUkVGT1giLCJpZGVudGlmaWVyIiwiZ2V0TG9jYXRpb24iLCJyZWdpc3RlclN5c3RlbUV2ZW50IiwidmlldyIsInNlbGZQb2ludGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImJpbmQiLCJwcm9oaWJpdGlvbiIsImlzTW9iaWxlIiwic3VwcG9ydE1vdXNlIiwiY2FwYWJpbGl0aWVzIiwic3VwcG9ydFRvdWNoZXMiLCJyZWN0IiwiY29udGFpbnMiLCJVUCIsInNldEJ1dHRvbiIsImJ1dHRvbiIsIl9tb3VzZUV2ZW50c09uRWxlbWVudCIsIkRPV04iLCJmb2N1cyIsIk1PVkUiLCJTQ1JPTEwiLCJzZXRTY3JvbGxEYXRhIiwid2hlZWxEZWx0YSIsImRldGFpbCIsImVudHJ5IiwibmFtZSIsInR5cGUiLCJoYW5kbGVyIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJuYXZpZ2F0b3IiLCJtc1BvaW50ZXJFbmFibGVkIiwiX3BvaW50ZXJFdmVudHNNYXAiLCJldmVudE5hbWUiLCJjYWxsIiwiX3RvdWNoRXZlbnRzTWFwIiwidG91Y2hlc1RvSGFuZGxlIiwicmVnaXN0ZXJUb3VjaEV2ZW50IiwiX3JlZ2lzdGVyS2V5Ym9hcmRFdmVudCIsIl9yZWdpc3RlckFjY2VsZXJvbWV0ZXJFdmVudCIsInVwZGF0ZSIsImR0IiwiRXZlbnRBY2NlbGVyYXRpb24iLCJtb2R1bGUiLCJleHBvcnRzIiwiaW50ZXJuYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxXQUFELENBQXJCOztBQUNBLElBQU1DLEdBQUcsR0FBR0QsT0FBTyxDQUFDLFNBQUQsQ0FBbkI7O0FBQ0EsSUFBTUUsWUFBWSxHQUFHRixPQUFPLENBQUMsa0JBQUQsQ0FBNUI7O0FBRUEsSUFB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akM7QUFDQXNDLFVBQUFBLE9BQU8sQ0FBQ3hCLFdBQVcsQ0FBQ1gsaUJBQVosQ0FBOEJaLEtBQTlCLEVBQXFDekUsa0JBQXJDLENBQUQsQ0FBUDtBQUNBeUUsVUFBQUEsS0FBSyxDQUFDZ0QsZUFBTjtBQUNBaEQsVUFBQUEsS0FBSyxDQUFDaUQsY0FBTjtBQUNILFNBVEQsRUFTSSxLQVRKO0FBVUgsT0FaRDs7QUFhQSxXQUFLLElBQUlJLFVBQVQsSUFBc0JFLGVBQXRCLEVBQXVDO0FBQ25DRSxRQUFBQSxrQkFBa0IsQ0FBQ0osVUFBRCxDQUFsQjtBQUNIO0FBQ0o7O0FBRUQsU0FBS0ssc0JBQUw7O0FBRUEsU0FBS3ZLLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0gsR0FqZ0JjO0FBbWdCZnVLLEVBQUFBLHNCQW5nQmUsb0NBbWdCVyxDQUFFLENBbmdCYjtBQXFnQmZDLEVBQUFBLDJCQXJnQmUseUNBcWdCZ0IsQ0FBRSxDQXJnQmxCOztBQXVnQmY7Ozs7QUFJQUMsRUFBQUEsTUEzZ0JlLGtCQTJnQlBDLEVBM2dCTyxFQTJnQkg7QUFDUixRQUFJLEtBQUs5SixhQUFMLEdBQXFCLEtBQUtGLGNBQTlCLEVBQThDO0FBQzFDLFdBQUtFLGFBQUwsSUFBc0IsS0FBS0YsY0FBM0I7QUFDQWpCLE1BQUFBLFlBQVksQ0FBQ21GLGFBQWIsQ0FBMkIsSUFBSWhGLEVBQUUsQ0FBQzRFLEtBQUgsQ0FBU21HLGlCQUFiLENBQStCLEtBQUs5SixhQUFwQyxDQUEzQjtBQUNIOztBQUNELFNBQUtELGFBQUwsSUFBc0I4SixFQUF0QjtBQUNIO0FBamhCYyxDQUFuQjtBQW9oQkFFLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmpMLEVBQUUsQ0FBQ2tMLFFBQUgsQ0FBWWhMLFlBQVosR0FBMkJBLFlBQTVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBtYWNybyA9IHJlcXVpcmUoJy4vQ0NNYWNybycpO1xuY29uc3Qgc3lzID0gcmVxdWlyZSgnLi9DQ1N5cycpO1xuY29uc3QgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vZXZlbnQtbWFuYWdlcicpO1xuXG5jb25zdCBUT1VDSF9USU1FT1VUID0gbWFjcm8uVE9VQ0hfVElNRU9VVDtcblxubGV0IF92ZWMyID0gY2MudjIoKTtcblxuLyoqXG4gKiAgVGhpcyBjbGFzcyBtYW5hZ2VzIGFsbCBldmVudHMgb2YgaW5wdXQuIGluY2x1ZGU6IHRvdWNoLCBtb3VzZSwgYWNjZWxlcm9tZXRlciwga2V5Ym9hcmRcbiAqL1xubGV0IGlucHV0TWFuYWdlciA9IHtcbiAgICBfbW91c2VQcmVzc2VkOiBmYWxzZSxcblxuICAgIF9pc1JlZ2lzdGVyRXZlbnQ6IGZhbHNlLFxuXG4gICAgX3ByZVRvdWNoUG9pbnQ6IGNjLnYyKDAsMCksXG4gICAgX3ByZXZNb3VzZVBvaW50OiBjYy52MigwLDApLFxuXG4gICAgX3ByZVRvdWNoUG9vbDogW10sXG4gICAgX3ByZVRvdWNoUG9vbFBvaW50ZXI6IDAsXG5cbiAgICBfdG91Y2hlczogW10sXG4gICAgX3RvdWNoZXNJbnRlZ2VyRGljdDp7fSxcblxuICAgIF9pbmRleEJpdHNVc2VkOiAwLFxuICAgIF9tYXhUb3VjaGVzOiA4LFxuXG4gICAgX2FjY2VsRW5hYmxlZDogZmFsc2UsXG4gICAgX2FjY2VsSW50ZXJ2YWw6IDEvNSxcbiAgICBfYWNjZWxNaW51czogMSxcbiAgICBfYWNjZWxDdXJUaW1lOiAwLFxuICAgIF9hY2NlbGVyYXRpb246IG51bGwsXG4gICAgX2FjY2VsRGV2aWNlRXZlbnQ6IG51bGwsXG5cbiAgICBfY2FudmFzQm91bmRpbmdSZWN0OiB7XG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgYWRqdXN0ZWRMZWZ0OiAwLFxuICAgICAgICBhZGp1c3RlZFRvcDogMCxcbiAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgIGhlaWdodDogMCxcbiAgICB9LFxuXG4gICAgX2dldFVuVXNlZEluZGV4ICgpIHtcbiAgICAgICAgbGV0IHRlbXAgPSB0aGlzLl9pbmRleEJpdHNVc2VkO1xuICAgICAgICBsZXQgbm93ID0gY2Muc3lzLm5vdygpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbWF4VG91Y2hlczsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoISh0ZW1wICYgMHgwMDAwMDAwMSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbmRleEJpdHNVc2VkIHw9ICgxIDw8IGkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHRvdWNoID0gdGhpcy5fdG91Y2hlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAobm93IC0gdG91Y2guX2xhc3RNb2RpZmllZCA+IFRPVUNIX1RJTUVPVVQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlVXNlZEluZGV4Qml0KGkpO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fdG91Y2hlc0ludGVnZXJEaWN0W3RvdWNoLmdldElEKCldO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZW1wID4+PSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWxsIGJpdHMgYXJlIHVzZWRcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH0sXG5cbiAgICBfcmVtb3ZlVXNlZEluZGV4Qml0IChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuX21heFRvdWNoZXMpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgbGV0IHRlbXAgPSAxIDw8IGluZGV4O1xuICAgICAgICB0ZW1wID0gfnRlbXA7XG4gICAgICAgIHRoaXMuX2luZGV4Qml0c1VzZWQgJj0gdGVtcDtcbiAgICB9LFxuXG4gICAgX2dsVmlldzogbnVsbCxcblxuICAgIF91cGRhdGVDYW52YXNCb3VuZGluZ1JlY3QgKCkge1xuICAgICAgICBsZXQgZWxlbWVudCA9IGNjLmdhbWUuY2FudmFzO1xuICAgICAgICBsZXQgY2FudmFzQm91bmRpbmdSZWN0ID0gdGhpcy5fY2FudmFzQm91bmRpbmdSZWN0O1xuXG4gICAgICAgIGxldCBkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICBsZXQgbGVmdE9mZnNldCA9IHdpbmRvdy5wYWdlWE9mZnNldCAtIGRvY0VsZW0uY2xpZW50TGVmdDtcbiAgICAgICAgbGV0IHRvcE9mZnNldCA9IHdpbmRvdy5wYWdlWU9mZnNldCAtIGRvY0VsZW0uY2xpZW50VG9wO1xuICAgICAgICBpZiAoZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHtcbiAgICAgICAgICAgIGxldCBib3ggPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY2FudmFzQm91bmRpbmdSZWN0LmxlZnQgPSBib3gubGVmdCArIGxlZnRPZmZzZXQ7XG4gICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QudG9wID0gYm94LnRvcCArIHRvcE9mZnNldDtcbiAgICAgICAgICAgIGNhbnZhc0JvdW5kaW5nUmVjdC53aWR0aCA9IGJveC53aWR0aDtcbiAgICAgICAgICAgIGNhbnZhc0JvdW5kaW5nUmVjdC5oZWlnaHQgPSBib3guaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICAgICAgY2FudmFzQm91bmRpbmdSZWN0LmxlZnQgPSBsZWZ0T2Zmc2V0O1xuICAgICAgICAgICAgY2FudmFzQm91bmRpbmdSZWN0LnRvcCA9IHRvcE9mZnNldDtcbiAgICAgICAgICAgIGNhbnZhc0JvdW5kaW5nUmVjdC53aWR0aCA9IGVsZW1lbnQud2lkdGg7XG4gICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QuaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QubGVmdCA9IGxlZnRPZmZzZXQ7XG4gICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QudG9wID0gdG9wT2Zmc2V0O1xuICAgICAgICAgICAgY2FudmFzQm91bmRpbmdSZWN0LndpZHRoID0gcGFyc2VJbnQoZWxlbWVudC5zdHlsZS53aWR0aCk7XG4gICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QuaGVpZ2h0ID0gcGFyc2VJbnQoZWxlbWVudC5zdHlsZS5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgaGFuZGxlVG91Y2hlc0JlZ2luXG4gICAgICogQHBhcmFtIHtBcnJheX0gdG91Y2hlc1xuICAgICAqL1xuICAgIGhhbmRsZVRvdWNoZXNCZWdpbiAodG91Y2hlcykge1xuICAgICAgICBsZXQgc2VsVG91Y2gsIGluZGV4LCBjdXJUb3VjaCwgdG91Y2hJRCxcbiAgICAgICAgICAgIGhhbmRsZVRvdWNoZXMgPSBbXSwgbG9jVG91Y2hJbnREaWN0ID0gdGhpcy5fdG91Y2hlc0ludGVnZXJEaWN0LFxuICAgICAgICAgICAgbm93ID0gc3lzLm5vdygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdG91Y2hlcy5sZW5ndGg7IGkgPCBsZW47IGkgKyspIHtcbiAgICAgICAgICAgIHNlbFRvdWNoID0gdG91Y2hlc1tpXTtcbiAgICAgICAgICAgIHRvdWNoSUQgPSBzZWxUb3VjaC5nZXRJRCgpO1xuICAgICAgICAgICAgaW5kZXggPSBsb2NUb3VjaEludERpY3RbdG91Y2hJRF07XG5cbiAgICAgICAgICAgIGlmIChpbmRleCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IHVudXNlZEluZGV4ID0gdGhpcy5fZ2V0VW5Vc2VkSW5kZXgoKTtcbiAgICAgICAgICAgICAgICBpZiAodW51c2VkSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDIzMDAsIHVudXNlZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vY3VyVG91Y2ggPSB0aGlzLl90b3VjaGVzW3VudXNlZEluZGV4XSA9IHNlbFRvdWNoO1xuICAgICAgICAgICAgICAgIGN1clRvdWNoID0gdGhpcy5fdG91Y2hlc1t1bnVzZWRJbmRleF0gPSBuZXcgY2MuVG91Y2goc2VsVG91Y2guX3BvaW50LngsIHNlbFRvdWNoLl9wb2ludC55LCBzZWxUb3VjaC5nZXRJRCgpKTtcbiAgICAgICAgICAgICAgICBjdXJUb3VjaC5fbGFzdE1vZGlmaWVkID0gbm93O1xuICAgICAgICAgICAgICAgIGN1clRvdWNoLl9zZXRQcmV2UG9pbnQoc2VsVG91Y2guX3ByZXZQb2ludCk7XG4gICAgICAgICAgICAgICAgbG9jVG91Y2hJbnREaWN0W3RvdWNoSURdID0gdW51c2VkSW5kZXg7XG4gICAgICAgICAgICAgICAgaGFuZGxlVG91Y2hlcy5wdXNoKGN1clRvdWNoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFuZGxlVG91Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLl9nbFZpZXcuX2NvbnZlcnRUb3VjaGVzV2l0aFNjYWxlKGhhbmRsZVRvdWNoZXMpO1xuICAgICAgICAgICAgbGV0IHRvdWNoRXZlbnQgPSBuZXcgY2MuRXZlbnQuRXZlbnRUb3VjaChoYW5kbGVUb3VjaGVzKTtcbiAgICAgICAgICAgIHRvdWNoRXZlbnQuX2V2ZW50Q29kZSA9IGNjLkV2ZW50LkV2ZW50VG91Y2guQkVHQU47XG4gICAgICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudCh0b3VjaEV2ZW50KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGhhbmRsZVRvdWNoZXNNb3ZlXG4gICAgICogQHBhcmFtIHtBcnJheX0gdG91Y2hlc1xuICAgICAqL1xuICAgIGhhbmRsZVRvdWNoZXNNb3ZlICh0b3VjaGVzKSB7XG4gICAgICAgIGxldCBzZWxUb3VjaCwgaW5kZXgsIHRvdWNoSUQsXG4gICAgICAgICAgICBoYW5kbGVUb3VjaGVzID0gW10sIGxvY1RvdWNoZXMgPSB0aGlzLl90b3VjaGVzLFxuICAgICAgICAgICAgbm93ID0gc3lzLm5vdygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdG91Y2hlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgc2VsVG91Y2ggPSB0b3VjaGVzW2ldO1xuICAgICAgICAgICAgdG91Y2hJRCA9IHNlbFRvdWNoLmdldElEKCk7XG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuX3RvdWNoZXNJbnRlZ2VyRGljdFt0b3VjaElEXTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvL2NjLmxvZyhcImlmIHRoZSBpbmRleCBkb2Vzbid0IGV4aXN0LCBpdCBpcyBhbiBlcnJvclwiKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsb2NUb3VjaGVzW2luZGV4XSkge1xuICAgICAgICAgICAgICAgIGxvY1RvdWNoZXNbaW5kZXhdLl9zZXRQb2ludChzZWxUb3VjaC5fcG9pbnQpO1xuICAgICAgICAgICAgICAgIGxvY1RvdWNoZXNbaW5kZXhdLl9zZXRQcmV2UG9pbnQoc2VsVG91Y2guX3ByZXZQb2ludCk7XG4gICAgICAgICAgICAgICAgbG9jVG91Y2hlc1tpbmRleF0uX2xhc3RNb2RpZmllZCA9IG5vdztcbiAgICAgICAgICAgICAgICBoYW5kbGVUb3VjaGVzLnB1c2gobG9jVG91Y2hlc1tpbmRleF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChoYW5kbGVUb3VjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2dsVmlldy5fY29udmVydFRvdWNoZXNXaXRoU2NhbGUoaGFuZGxlVG91Y2hlcyk7XG4gICAgICAgICAgICBsZXQgdG91Y2hFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudFRvdWNoKGhhbmRsZVRvdWNoZXMpO1xuICAgICAgICAgICAgdG91Y2hFdmVudC5fZXZlbnRDb2RlID0gY2MuRXZlbnQuRXZlbnRUb3VjaC5NT1ZFRDtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KHRvdWNoRXZlbnQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgaGFuZGxlVG91Y2hlc0VuZFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHRvdWNoZXNcbiAgICAgKi9cbiAgICBoYW5kbGVUb3VjaGVzRW5kICh0b3VjaGVzKSB7XG4gICAgICAgIGxldCBoYW5kbGVUb3VjaGVzID0gdGhpcy5nZXRTZXRPZlRvdWNoZXNFbmRPckNhbmNlbCh0b3VjaGVzKTtcbiAgICAgICAgaWYgKGhhbmRsZVRvdWNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fZ2xWaWV3Ll9jb252ZXJ0VG91Y2hlc1dpdGhTY2FsZShoYW5kbGVUb3VjaGVzKTtcbiAgICAgICAgICAgIGxldCB0b3VjaEV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50VG91Y2goaGFuZGxlVG91Y2hlcyk7XG4gICAgICAgICAgICB0b3VjaEV2ZW50Ll9ldmVudENvZGUgPSBjYy5FdmVudC5FdmVudFRvdWNoLkVOREVEO1xuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLmRpc3BhdGNoRXZlbnQodG91Y2hFdmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcHJlVG91Y2hQb29sLmxlbmd0aCA9IDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2QgaGFuZGxlVG91Y2hlc0NhbmNlbFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHRvdWNoZXNcbiAgICAgKi9cbiAgICBoYW5kbGVUb3VjaGVzQ2FuY2VsICh0b3VjaGVzKSB7XG4gICAgICAgIGxldCBoYW5kbGVUb3VjaGVzID0gdGhpcy5nZXRTZXRPZlRvdWNoZXNFbmRPckNhbmNlbCh0b3VjaGVzKTtcbiAgICAgICAgaWYgKGhhbmRsZVRvdWNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5fZ2xWaWV3Ll9jb252ZXJ0VG91Y2hlc1dpdGhTY2FsZShoYW5kbGVUb3VjaGVzKTtcbiAgICAgICAgICAgIGxldCB0b3VjaEV2ZW50ID0gbmV3IGNjLkV2ZW50LkV2ZW50VG91Y2goaGFuZGxlVG91Y2hlcyk7XG4gICAgICAgICAgICB0b3VjaEV2ZW50Ll9ldmVudENvZGUgPSBjYy5FdmVudC5FdmVudFRvdWNoLkNBTkNFTExFRDtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KHRvdWNoRXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3ByZVRvdWNoUG9vbC5sZW5ndGggPSAwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldFNldE9mVG91Y2hlc0VuZE9yQ2FuY2VsXG4gICAgICogQHBhcmFtIHtBcnJheX0gdG91Y2hlc1xuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRTZXRPZlRvdWNoZXNFbmRPckNhbmNlbCAodG91Y2hlcykge1xuICAgICAgICBsZXQgc2VsVG91Y2gsIGluZGV4LCB0b3VjaElELCBoYW5kbGVUb3VjaGVzID0gW10sIGxvY1RvdWNoZXMgPSB0aGlzLl90b3VjaGVzLCBsb2NUb3VjaGVzSW50RGljdCA9IHRoaXMuX3RvdWNoZXNJbnRlZ2VyRGljdDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRvdWNoZXMubGVuZ3RoOyBpPCBsZW47IGkgKyspIHtcbiAgICAgICAgICAgIHNlbFRvdWNoID0gdG91Y2hlc1tpXTtcbiAgICAgICAgICAgIHRvdWNoSUQgPSBzZWxUb3VjaC5nZXRJRCgpO1xuICAgICAgICAgICAgaW5kZXggPSBsb2NUb3VjaGVzSW50RGljdFt0b3VjaElEXTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTsgIC8vY2MubG9nKFwiaWYgdGhlIGluZGV4IGRvZXNuJ3QgZXhpc3QsIGl0IGlzIGFuIGVycm9yXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxvY1RvdWNoZXNbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgbG9jVG91Y2hlc1tpbmRleF0uX3NldFBvaW50KHNlbFRvdWNoLl9wb2ludCk7XG4gICAgICAgICAgICAgICAgbG9jVG91Y2hlc1tpbmRleF0uX3NldFByZXZQb2ludChzZWxUb3VjaC5fcHJldlBvaW50KTtcbiAgICAgICAgICAgICAgICBoYW5kbGVUb3VjaGVzLnB1c2gobG9jVG91Y2hlc1tpbmRleF0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZVVzZWRJbmRleEJpdChpbmRleCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGxvY1RvdWNoZXNJbnREaWN0W3RvdWNoSURdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYW5kbGVUb3VjaGVzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldFByZVRvdWNoXG4gICAgICogQHBhcmFtIHtUb3VjaH0gdG91Y2hcbiAgICAgKiBAcmV0dXJuIHtUb3VjaH1cbiAgICAgKi9cbiAgICBnZXRQcmVUb3VjaCAodG91Y2gpIHtcbiAgICAgICAgbGV0IHByZVRvdWNoID0gbnVsbDtcbiAgICAgICAgbGV0IGxvY1ByZVRvdWNoUG9vbCA9IHRoaXMuX3ByZVRvdWNoUG9vbDtcbiAgICAgICAgbGV0IGlkID0gdG91Y2guZ2V0SUQoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IGxvY1ByZVRvdWNoUG9vbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKGxvY1ByZVRvdWNoUG9vbFtpXS5nZXRJRCgpID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHByZVRvdWNoID0gbG9jUHJlVG91Y2hQb29sW2ldO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghcHJlVG91Y2gpXG4gICAgICAgICAgICBwcmVUb3VjaCA9IHRvdWNoO1xuICAgICAgICByZXR1cm4gcHJlVG91Y2g7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2Qgc2V0UHJlVG91Y2hcbiAgICAgKiBAcGFyYW0ge1RvdWNofSB0b3VjaFxuICAgICAqL1xuICAgIHNldFByZVRvdWNoICh0b3VjaCkge1xuICAgICAgICBsZXQgZmluZCA9IGZhbHNlO1xuICAgICAgICBsZXQgbG9jUHJlVG91Y2hQb29sID0gdGhpcy5fcHJlVG91Y2hQb29sO1xuICAgICAgICBsZXQgaWQgPSB0b3VjaC5nZXRJRCgpO1xuICAgICAgICBmb3IgKGxldCBpID0gbG9jUHJlVG91Y2hQb29sLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBpZiAobG9jUHJlVG91Y2hQb29sW2ldLmdldElEKCkgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgbG9jUHJlVG91Y2hQb29sW2ldID0gdG91Y2g7XG4gICAgICAgICAgICAgICAgZmluZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFmaW5kKSB7XG4gICAgICAgICAgICBpZiAobG9jUHJlVG91Y2hQb29sLmxlbmd0aCA8PSA1MCkge1xuICAgICAgICAgICAgICAgIGxvY1ByZVRvdWNoUG9vbC5wdXNoKHRvdWNoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9jUHJlVG91Y2hQb29sW3RoaXMuX3ByZVRvdWNoUG9vbFBvaW50ZXJdID0gdG91Y2g7XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlVG91Y2hQb29sUG9pbnRlciA9ICh0aGlzLl9wcmVUb3VjaFBvb2xQb2ludGVyICsgMSkgJSA1MDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldFRvdWNoQnlYWVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0eFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0eVxuICAgICAqIEBwYXJhbSB7VmVjMn0gcG9zXG4gICAgICogQHJldHVybiB7VG91Y2h9XG4gICAgICovXG4gICAgZ2V0VG91Y2hCeVhZICh0eCwgdHksIHBvcykge1xuICAgICAgICBsZXQgbG9jUHJlVG91Y2ggPSB0aGlzLl9wcmVUb3VjaFBvaW50O1xuICAgICAgICBsZXQgbG9jYXRpb24gPSB0aGlzLl9nbFZpZXcuY29udmVydFRvTG9jYXRpb25JblZpZXcodHgsIHR5LCBwb3MpO1xuICAgICAgICBsZXQgdG91Y2ggPSBuZXcgY2MuVG91Y2gobG9jYXRpb24ueCwgbG9jYXRpb24ueSwgMCk7XG4gICAgICAgIHRvdWNoLl9zZXRQcmV2UG9pbnQobG9jUHJlVG91Y2gueCwgbG9jUHJlVG91Y2gueSk7XG4gICAgICAgIGxvY1ByZVRvdWNoLnggPSBsb2NhdGlvbi54O1xuICAgICAgICBsb2NQcmVUb3VjaC55ID0gbG9jYXRpb24ueTtcbiAgICAgICAgcmV0dXJuIHRvdWNoO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldE1vdXNlRXZlbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IGxvY2F0aW9uXG4gICAgICogQHBhcmFtIHtWZWMyfSBwb3NcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZXZlbnRUeXBlXG4gICAgICogQHJldHVybnMge0V2ZW50LkV2ZW50TW91c2V9XG4gICAgICovXG4gICAgZ2V0TW91c2VFdmVudCAobG9jYXRpb24sIHBvcywgZXZlbnRUeXBlKSB7XG4gICAgICAgIGxldCBsb2NQcmVNb3VzZSA9IHRoaXMuX3ByZXZNb3VzZVBvaW50O1xuICAgICAgICBsZXQgbW91c2VFdmVudCA9IG5ldyBjYy5FdmVudC5FdmVudE1vdXNlKGV2ZW50VHlwZSk7XG4gICAgICAgIG1vdXNlRXZlbnQuX3NldFByZXZDdXJzb3IobG9jUHJlTW91c2UueCwgbG9jUHJlTW91c2UueSk7XG4gICAgICAgIGxvY1ByZU1vdXNlLnggPSBsb2NhdGlvbi54O1xuICAgICAgICBsb2NQcmVNb3VzZS55ID0gbG9jYXRpb24ueTtcbiAgICAgICAgdGhpcy5fZ2xWaWV3Ll9jb252ZXJ0TW91c2VUb0xvY2F0aW9uSW5WaWV3KGxvY1ByZU1vdXNlLCBwb3MpO1xuICAgICAgICBtb3VzZUV2ZW50LnNldExvY2F0aW9uKGxvY1ByZU1vdXNlLngsIGxvY1ByZU1vdXNlLnkpO1xuICAgICAgICByZXR1cm4gbW91c2VFdmVudDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBnZXRQb2ludEJ5RXZlbnRcbiAgICAgKiBAcGFyYW0ge1RvdWNofSBldmVudFxuICAgICAqIEBwYXJhbSB7VmVjMn0gcG9zXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKi9cbiAgICBnZXRQb2ludEJ5RXZlbnQgKGV2ZW50LCBwb3MpIHtcbiAgICAgICAgLy8gcXEgLCB1YyBhbmQgc2FmYXJpIGJyb3dzZXIgY2FuJ3QgY2FsY3VsYXRlIHBhZ2VZIGNvcnJlY3RseSwgbmVlZCB0byByZWZyZXNoIGNhbnZhcyBib3VuZGluZyByZWN0XG4gICAgICAgIGlmIChjYy5zeXMuYnJvd3NlclR5cGUgPT09IGNjLnN5cy5CUk9XU0VSX1RZUEVfUVEgXG4gICAgICAgICAgICB8fCBjYy5zeXMuYnJvd3NlclR5cGUgPT09IGNjLnN5cy5CUk9XU0VSX1RZUEVfVUNcbiAgICAgICAgICAgIHx8IGNjLnN5cy5icm93c2VyVHlwZSA9PT0gY2Muc3lzLkJST1dTRVJfVFlQRV9TQUZBUkkpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNhbnZhc0JvdW5kaW5nUmVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoZXZlbnQucGFnZVggIT0gbnVsbCkgIC8vbm90IGF2YWxhYmxlIGluIDw9IElFOFxuICAgICAgICAgICAgcmV0dXJuIHt4OiBldmVudC5wYWdlWCwgeTogZXZlbnQucGFnZVl9O1xuXG4gICAgICAgIHBvcy5sZWZ0IC09IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdDtcbiAgICAgICAgcG9zLnRvcCAtPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcblxuICAgICAgICByZXR1cm4ge3g6IGV2ZW50LmNsaWVudFgsIHk6IGV2ZW50LmNsaWVudFl9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldFRvdWNoZXNCeUV2ZW50XG4gICAgICogQHBhcmFtIHtUb3VjaH0gZXZlbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHBvc1xuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRUb3VjaGVzQnlFdmVudCAoZXZlbnQsIHBvcykge1xuICAgICAgICBsZXQgdG91Y2hBcnIgPSBbXSwgbG9jVmlldyA9IHRoaXMuX2dsVmlldztcbiAgICAgICAgbGV0IHRvdWNoX2V2ZW50LCB0b3VjaCwgcHJlTG9jYXRpb247XG4gICAgICAgIGxldCBsb2NQcmVUb3VjaCA9IHRoaXMuX3ByZVRvdWNoUG9pbnQ7XG5cbiAgICAgICAgbGV0IGxlbmd0aCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG91Y2hfZXZlbnQgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1tpXTtcbiAgICAgICAgICAgIGlmICh0b3VjaF9ldmVudCkge1xuICAgICAgICAgICAgICAgIGxldCBsb2NhdGlvbjtcbiAgICAgICAgICAgICAgICBpZiAoc3lzLkJST1dTRVJfVFlQRV9GSVJFRk9YID09PSBzeXMuYnJvd3NlclR5cGUpXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gbG9jVmlldy5jb252ZXJ0VG9Mb2NhdGlvbkluVmlldyh0b3VjaF9ldmVudC5wYWdlWCwgdG91Y2hfZXZlbnQucGFnZVksIHBvcywgX3ZlYzIpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb24gPSBsb2NWaWV3LmNvbnZlcnRUb0xvY2F0aW9uSW5WaWV3KHRvdWNoX2V2ZW50LmNsaWVudFgsIHRvdWNoX2V2ZW50LmNsaWVudFksIHBvcywgX3ZlYzIpO1xuICAgICAgICAgICAgICAgIGlmICh0b3VjaF9ldmVudC5pZGVudGlmaWVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdG91Y2ggPSBuZXcgY2MuVG91Y2gobG9jYXRpb24ueCwgbG9jYXRpb24ueSwgdG91Y2hfZXZlbnQuaWRlbnRpZmllcik7XG4gICAgICAgICAgICAgICAgICAgIC8vdXNlIFRvdWNoIFBvb2xcbiAgICAgICAgICAgICAgICAgICAgcHJlTG9jYXRpb24gPSB0aGlzLmdldFByZVRvdWNoKHRvdWNoKS5nZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICB0b3VjaC5fc2V0UHJldlBvaW50KHByZUxvY2F0aW9uLngsIHByZUxvY2F0aW9uLnkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFByZVRvdWNoKHRvdWNoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0b3VjaCA9IG5ldyBjYy5Ub3VjaChsb2NhdGlvbi54LCBsb2NhdGlvbi55KTtcbiAgICAgICAgICAgICAgICAgICAgdG91Y2guX3NldFByZXZQb2ludChsb2NQcmVUb3VjaC54LCBsb2NQcmVUb3VjaC55KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbG9jUHJlVG91Y2gueCA9IGxvY2F0aW9uLng7XG4gICAgICAgICAgICAgICAgbG9jUHJlVG91Y2gueSA9IGxvY2F0aW9uLnk7XG4gICAgICAgICAgICAgICAgdG91Y2hBcnIucHVzaCh0b3VjaCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRvdWNoQXJyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIHJlZ2lzdGVyU3lzdGVtRXZlbnRcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICovXG4gICAgcmVnaXN0ZXJTeXN0ZW1FdmVudCAoZWxlbWVudCkge1xuICAgICAgICBpZih0aGlzLl9pc1JlZ2lzdGVyRXZlbnQpIHJldHVybjtcblxuICAgICAgICB0aGlzLl9nbFZpZXcgPSBjYy52aWV3O1xuICAgICAgICBsZXQgc2VsZlBvaW50ZXIgPSB0aGlzO1xuICAgICAgICBsZXQgY2FudmFzQm91bmRpbmdSZWN0ID0gdGhpcy5fY2FudmFzQm91bmRpbmdSZWN0O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl91cGRhdGVDYW52YXNCb3VuZGluZ1JlY3QuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgbGV0IHByb2hpYml0aW9uID0gc3lzLmlzTW9iaWxlO1xuICAgICAgICBsZXQgc3VwcG9ydE1vdXNlID0gKCdtb3VzZScgaW4gc3lzLmNhcGFiaWxpdGllcyk7XG4gICAgICAgIGxldCBzdXBwb3J0VG91Y2hlcyA9ICgndG91Y2hlcycgaW4gc3lzLmNhcGFiaWxpdGllcyk7XG5cbiAgICAgICAgaWYgKHN1cHBvcnRNb3VzZSkge1xuICAgICAgICAgICAgLy9IQUNLXG4gICAgICAgICAgICAvLyAgLSBBdCB0aGUgc2FtZSB0aW1lIHRvIHRyaWdnZXIgdGhlIG9udG91Y2ggZXZlbnQgYW5kIG9ubW91c2UgZXZlbnRcbiAgICAgICAgICAgIC8vICAtIFRoZSBmdW5jdGlvbiB3aWxsIGV4ZWN1dGUgMiB0aW1lc1xuICAgICAgICAgICAgLy9UaGUga25vd24gYnJvd3NlcjpcbiAgICAgICAgICAgIC8vICBsaWViaWFvXG4gICAgICAgICAgICAvLyAgbWl1aVxuICAgICAgICAgICAgLy8gIFdFQ0hBVFxuICAgICAgICAgICAgaWYgKCFwcm9oaWJpdGlvbikge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGZQb2ludGVyLl9tb3VzZVByZXNzZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2VsZlBvaW50ZXIuX21vdXNlUHJlc3NlZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHNlbGZQb2ludGVyLl9tb3VzZVByZXNzZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgbG9jYXRpb24gPSBzZWxmUG9pbnRlci5nZXRQb2ludEJ5RXZlbnQoZXZlbnQsIGNhbnZhc0JvdW5kaW5nUmVjdCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2MucmVjdChjYW52YXNCb3VuZGluZ1JlY3QubGVmdCwgY2FudmFzQm91bmRpbmdSZWN0LnRvcCwgY2FudmFzQm91bmRpbmdSZWN0LndpZHRoLCBjYW52YXNCb3VuZGluZ1JlY3QuaGVpZ2h0KS5jb250YWlucyhsb2NhdGlvbikpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZlBvaW50ZXIuaGFuZGxlVG91Y2hlc0VuZChbc2VsZlBvaW50ZXIuZ2V0VG91Y2hCeVhZKGxvY2F0aW9uLngsIGxvY2F0aW9uLnksIGNhbnZhc0JvdW5kaW5nUmVjdCldKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1vdXNlRXZlbnQgPSBzZWxmUG9pbnRlci5nZXRNb3VzZUV2ZW50KGxvY2F0aW9uLCBjYW52YXNCb3VuZGluZ1JlY3QsIGNjLkV2ZW50LkV2ZW50TW91c2UuVVApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW91c2VFdmVudC5zZXRCdXR0b24oZXZlbnQuYnV0dG9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KG1vdXNlRXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyByZWdpc3RlciBjYW52YXMgbW91c2UgZXZlbnRcbiAgICAgICAgICAgIGxldCBFdmVudE1vdXNlID0gY2MuRXZlbnQuRXZlbnRNb3VzZTtcbiAgICAgICAgICAgIGxldCBfbW91c2VFdmVudHNPbkVsZW1lbnQgPSBbXG4gICAgICAgICAgICAgICAgIXByb2hpYml0aW9uICYmIFtcIm1vdXNlZG93blwiLCBFdmVudE1vdXNlLkRPV04sIGZ1bmN0aW9uIChldmVudCwgbW91c2VFdmVudCwgbG9jYXRpb24sIGNhbnZhc0JvdW5kaW5nUmVjdCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmUG9pbnRlci5fbW91c2VQcmVzc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZlBvaW50ZXIuaGFuZGxlVG91Y2hlc0JlZ2luKFtzZWxmUG9pbnRlci5nZXRUb3VjaEJ5WFkobG9jYXRpb24ueCwgbG9jYXRpb24ueSwgY2FudmFzQm91bmRpbmdSZWN0KV0pO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgIXByb2hpYml0aW9uICYmIFtcIm1vdXNldXBcIiwgRXZlbnRNb3VzZS5VUCwgZnVuY3Rpb24gKGV2ZW50LCBtb3VzZUV2ZW50LCBsb2NhdGlvbiwgY2FudmFzQm91bmRpbmdSZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGZQb2ludGVyLl9tb3VzZVByZXNzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZlBvaW50ZXIuaGFuZGxlVG91Y2hlc0VuZChbc2VsZlBvaW50ZXIuZ2V0VG91Y2hCeVhZKGxvY2F0aW9uLngsIGxvY2F0aW9uLnksIGNhbnZhc0JvdW5kaW5nUmVjdCldKTtcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAhcHJvaGliaXRpb24gJiYgW1wibW91c2Vtb3ZlXCIsIEV2ZW50TW91c2UuTU9WRSwgZnVuY3Rpb24gKGV2ZW50LCBtb3VzZUV2ZW50LCBsb2NhdGlvbiwgY2FudmFzQm91bmRpbmdSZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGZQb2ludGVyLmhhbmRsZVRvdWNoZXNNb3ZlKFtzZWxmUG9pbnRlci5nZXRUb3VjaEJ5WFkobG9jYXRpb24ueCwgbG9jYXRpb24ueSwgY2FudmFzQm91bmRpbmdSZWN0KV0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGZQb2ludGVyLl9tb3VzZVByZXNzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdXNlRXZlbnQuc2V0QnV0dG9uKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgW1wibW91c2V3aGVlbFwiLCBFdmVudE1vdXNlLlNDUk9MTCwgZnVuY3Rpb24gKGV2ZW50LCBtb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdXNlRXZlbnQuc2V0U2Nyb2xsRGF0YSgwLCBldmVudC53aGVlbERlbHRhKTtcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAvKiBmaXJlZm94IGZpeCAqL1xuICAgICAgICAgICAgICAgIFtcIkRPTU1vdXNlU2Nyb2xsXCIsIEV2ZW50TW91c2UuU0NST0xMLCBmdW5jdGlvbiAoZXZlbnQsIG1vdXNlRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbW91c2VFdmVudC5zZXRTY3JvbGxEYXRhKDAsIGV2ZW50LmRldGFpbCAqIC0xMjApO1xuICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfbW91c2VFdmVudHNPbkVsZW1lbnQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBsZXQgZW50cnkgPSBfbW91c2VFdmVudHNPbkVsZW1lbnRbaV07XG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuYW1lID0gZW50cnlbMF07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0eXBlID0gZW50cnlbMV07XG4gICAgICAgICAgICAgICAgICAgIGxldCBoYW5kbGVyID0gZW50cnlbMl07XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsb2NhdGlvbiA9IHNlbGZQb2ludGVyLmdldFBvaW50QnlFdmVudChldmVudCwgY2FudmFzQm91bmRpbmdSZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtb3VzZUV2ZW50ID0gc2VsZlBvaW50ZXIuZ2V0TW91c2VFdmVudChsb2NhdGlvbiwgY2FudmFzQm91bmRpbmdSZWN0LCB0eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdXNlRXZlbnQuc2V0QnV0dG9uKGV2ZW50LmJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoZXZlbnQsIG1vdXNlRXZlbnQsIGxvY2F0aW9uLCBjYW52YXNCb3VuZGluZ1JlY3QpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudE1hbmFnZXIuZGlzcGF0Y2hFdmVudChtb3VzZUV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQpIHtcbiAgICAgICAgICAgIGxldCBfcG9pbnRlckV2ZW50c01hcCA9IHtcbiAgICAgICAgICAgICAgICBcIk1TUG9pbnRlckRvd25cIiAgICAgOiBzZWxmUG9pbnRlci5oYW5kbGVUb3VjaGVzQmVnaW4sXG4gICAgICAgICAgICAgICAgXCJNU1BvaW50ZXJNb3ZlXCIgICAgIDogc2VsZlBvaW50ZXIuaGFuZGxlVG91Y2hlc01vdmUsXG4gICAgICAgICAgICAgICAgXCJNU1BvaW50ZXJVcFwiICAgICAgIDogc2VsZlBvaW50ZXIuaGFuZGxlVG91Y2hlc0VuZCxcbiAgICAgICAgICAgICAgICBcIk1TUG9pbnRlckNhbmNlbFwiICAgOiBzZWxmUG9pbnRlci5oYW5kbGVUb3VjaGVzQ2FuY2VsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZm9yIChsZXQgZXZlbnROYW1lIGluIF9wb2ludGVyRXZlbnRzTWFwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRvdWNoRXZlbnQgPSBfcG9pbnRlckV2ZW50c01hcFtldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uIChldmVudCl7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkb2N1bWVudEVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGNhbnZhc0JvdW5kaW5nUmVjdC5hZGp1c3RlZExlZnQgPSBjYW52YXNCb3VuZGluZ1JlY3QubGVmdCAtIGRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QuYWRqdXN0ZWRUb3AgPSBjYW52YXNCb3VuZGluZ1JlY3QudG9wIC0gZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgICAgICAgICAgICAgICAgICB0b3VjaEV2ZW50LmNhbGwoc2VsZlBvaW50ZXIsIFtzZWxmUG9pbnRlci5nZXRUb3VjaEJ5WFkoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSwgY2FudmFzQm91bmRpbmdSZWN0KV0pO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL3JlZ2lzdGVyIHRvdWNoIGV2ZW50XG4gICAgICAgIGlmIChzdXBwb3J0VG91Y2hlcykge1xuICAgICAgICAgICAgbGV0IF90b3VjaEV2ZW50c01hcCA9IHtcbiAgICAgICAgICAgICAgICBcInRvdWNoc3RhcnRcIjogZnVuY3Rpb24gKHRvdWNoZXNUb0hhbmRsZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmUG9pbnRlci5oYW5kbGVUb3VjaGVzQmVnaW4odG91Y2hlc1RvSGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJ0b3VjaG1vdmVcIjogZnVuY3Rpb24gKHRvdWNoZXNUb0hhbmRsZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmUG9pbnRlci5oYW5kbGVUb3VjaGVzTW92ZSh0b3VjaGVzVG9IYW5kbGUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXCJ0b3VjaGVuZFwiOiBmdW5jdGlvbiAodG91Y2hlc1RvSGFuZGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGZQb2ludGVyLmhhbmRsZVRvdWNoZXNFbmQodG91Y2hlc1RvSGFuZGxlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwidG91Y2hjYW5jZWxcIjogZnVuY3Rpb24gKHRvdWNoZXNUb0hhbmRsZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmUG9pbnRlci5oYW5kbGVUb3VjaGVzQ2FuY2VsKHRvdWNoZXNUb0hhbmRsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgbGV0IHJlZ2lzdGVyVG91Y2hFdmVudCA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBsZXQgaGFuZGxlciA9IF90b3VjaEV2ZW50c01hcFtldmVudE5hbWVdO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWV2ZW50LmNoYW5nZWRUb3VjaGVzKSByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIGxldCBib2R5ID0gZG9jdW1lbnQuYm9keTtcblxuICAgICAgICAgICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QuYWRqdXN0ZWRMZWZ0ID0gY2FudmFzQm91bmRpbmdSZWN0LmxlZnQgLSAoYm9keS5zY3JvbGxMZWZ0IHx8IDApO1xuICAgICAgICAgICAgICAgICAgICBjYW52YXNCb3VuZGluZ1JlY3QuYWRqdXN0ZWRUb3AgPSBjYW52YXNCb3VuZGluZ1JlY3QudG9wIC0gKGJvZHkuc2Nyb2xsVG9wIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKHNlbGZQb2ludGVyLmdldFRvdWNoZXNCeUV2ZW50KGV2ZW50LCBjYW52YXNCb3VuZGluZ1JlY3QpKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfSksIGZhbHNlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBmb3IgKGxldCBldmVudE5hbWUgaW4gX3RvdWNoRXZlbnRzTWFwKSB7XG4gICAgICAgICAgICAgICAgcmVnaXN0ZXJUb3VjaEV2ZW50KGV2ZW50TmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yZWdpc3RlcktleWJvYXJkRXZlbnQoKTtcblxuICAgICAgICB0aGlzLl9pc1JlZ2lzdGVyRXZlbnQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBfcmVnaXN0ZXJLZXlib2FyZEV2ZW50ICgpIHt9LFxuXG4gICAgX3JlZ2lzdGVyQWNjZWxlcm9tZXRlckV2ZW50ICgpIHt9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCB1cGRhdGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZHRcbiAgICAgKi9cbiAgICB1cGRhdGUgKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLl9hY2NlbEN1clRpbWUgPiB0aGlzLl9hY2NlbEludGVydmFsKSB7XG4gICAgICAgICAgICB0aGlzLl9hY2NlbEN1clRpbWUgLT0gdGhpcy5fYWNjZWxJbnRlcnZhbDtcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5kaXNwYXRjaEV2ZW50KG5ldyBjYy5FdmVudC5FdmVudEFjY2VsZXJhdGlvbih0aGlzLl9hY2NlbGVyYXRpb24pKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hY2NlbEN1clRpbWUgKz0gZHQ7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5pbnRlcm5hbC5pbnB1dE1hbmFnZXIgPSBpbnB1dE1hbmFnZXI7XG4iXX0=