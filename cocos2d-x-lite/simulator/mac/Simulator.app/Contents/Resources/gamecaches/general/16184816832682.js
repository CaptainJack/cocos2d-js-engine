window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  ButtonWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "42ed4AdT2lLrL3Olzt4TKac", "ButtonWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ButtonWidget = function(_super) {
      __extends(ButtonWidget, _super);
      function ButtonWidget() {
        var _this_1 = null !== _super && _super.apply(this, arguments) || this;
        _this_1.onTouchEvent = function() {};
        _this_1.action = function() {};
        _this_1.holdAction = function() {};
        _this_1._enabled = true;
        _this_1._isCancelled = false;
        _this_1._isHover = false;
        return _this_1;
      }
      ButtonWidget.prototype.onLoad = function() {
        var _this = this;
        this.node.on("touchstart", function(event) {
          if (!_this._enabled) return;
          _this._isCancelled = false;
          _this.onTouchEvent(cc.Node.EventType.TOUCH_START);
          _this.unscheduleAllCallbacks();
          _this.scheduleOnce(function() {
            _this.holdAction();
          }, 1);
        }, this);
        this.node.on("touchend", function(event) {
          _this.unscheduleAllCallbacks();
          if (!_this._enabled) return;
          _this.onTouchEvent(cc.Node.EventType.TOUCH_END);
          _this._isCancelled || _this.action();
        }, this);
        this.node.on("touchcancel", function(event) {
          _this.unscheduleAllCallbacks();
          _this.onTouchEvent(cc.Node.EventType.MOUSE_LEAVE);
          _this.onTouchEvent(cc.Node.EventType.TOUCH_CANCEL);
          _this._isHover = false;
        }, this);
        this.node.on("touchmove", function(event) {
          if (!_this._enabled) return;
          if (_this._isCancelled) return;
          var startLocation = event.touch.getStartLocationInView();
          var v1 = new cc.Vec2(startLocation.x, startLocation.y);
          var location = event.touch.getLocationInView();
          var v2 = new cc.Vec2(location.x, location.y);
          var dx = v1.x - v2.x;
          var dy = v1.y - v2.y;
          var delta = dx * dx + dy * dy;
          delta > 1e3 && (_this._isCancelled = true);
          _this.onTouchEvent(cc.Node.EventType.TOUCH_MOVE);
        }, this);
        this.node.on("mouseenter", function(event) {
          if (!_this._enabled) return;
          _this._isHover = true;
          _this.onTouchEvent(cc.Node.EventType.MOUSE_ENTER);
        });
        this.node.on("mouseleave", function(event) {
          _this.onTouchEvent(cc.Node.EventType.MOUSE_LEAVE);
          _this._isHover = false;
        });
      };
      ButtonWidget = __decorate([ ccclass ], ButtonWidget);
      return ButtonWidget;
    }(cc.Component);
    exports.default = ButtonWidget;
    cc._RF.pop();
  }, {} ],
  CamWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "51761KVOxlPb5t2BVI4aS32", "CamWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var MainScene_1 = require("../Scene/MainScene");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var CamWidget = function(_super) {
      __extends(CamWidget, _super);
      function CamWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.sprites = [];
        _this.isHideSprite = false;
        _this.isAutoShow = false;
        _this._camera = null;
        _this._texture = null;
        _this._spriteFrame = null;
        _this._renderNode = null;
        _this._lastSize = new cc.Size(0, 0);
        return _this;
      }
      CamWidget_1 = CamWidget;
      CamWidget.prototype.onLoad = function() {
        var _this = this;
        this._texture = new cc.RenderTexture();
        this._texture.initWithSize(this.node.width, this.node.height);
        this._camera = this.node.getComponent(cc.Camera);
        this._camera.targetTexture = this._texture;
        this._spriteFrame = new cc.SpriteFrame();
        this._spriteFrame.setTexture(this._texture);
        0 == this.sprites.length && this.sprites.push(this.node.addComponent(cc.Sprite));
        this.sprites.forEach(function(sprite) {
          sprite.node.scaleY = -1;
          sprite.spriteFrame = _this._spriteFrame;
        });
        this.clear();
      };
      CamWidget.prototype.start = function() {
        this._camera.alignWithScreen = true;
        this._camera.zoomRatio = Math.abs(cc.winSize.height / this._camera.node.getContentSize().height / CamWidget_1.getRecursiveScale(1, this.node) / MainScene_1.default.mainContentScale);
      };
      CamWidget.prototype.snapshot = function() {
        var _this = this;
        if (!this.node || !this._camera || !this._camera.enabled) return;
        !this._renderNode && this.isHideSprite || this.sprites.forEach(function(sprite) {
          return sprite.node.opacity = 255;
        });
        var size = this.node.getContentSize();
        if (size.width !== this._lastSize.width || size.height !== this._lastSize.height) {
          this._texture.initWithSize(this.node.width, this.node.height);
          this._camera.targetTexture = this._texture;
          this._camera.zoomRatio = Math.abs(cc.winSize.height / this._camera.node.getContentSize().height / CamWidget_1.getRecursiveScale(1, this.node) / MainScene_1.default.mainContentScale);
          this._spriteFrame = new cc.SpriteFrame();
          this._spriteFrame.setTexture(this._texture);
          this.sprites.forEach(function(sprite) {
            return sprite.spriteFrame = _this._spriteFrame;
          });
        }
        this._lastSize.width = size.width;
        this._lastSize.height = size.height;
        if (this._renderNode && this._renderNode.isValid) {
          var oldGroup = this._renderNode.group;
          this._renderNode.group = "mask";
          this._camera.render(this._renderNode);
          this._renderNode.group = oldGroup;
        } else this.node.childrenCount > 0 && this._camera.render(this.node);
      };
      CamWidget.prototype.update = function(dt) {
        this.snapshot();
      };
      CamWidget.prototype.show = function() {
        this.setCamEnabled(true);
      };
      CamWidget.prototype.setRenderNode = function(node) {
        this._renderNode = node;
      };
      CamWidget.prototype.getRenderNode = function() {
        return this._renderNode;
      };
      CamWidget.prototype.setCamEnabled = function(enabled) {
        this._camera.enabled = enabled;
        this._camera.zoomRatio = Math.abs(cc.winSize.height / this._camera.node.getContentSize().height / CamWidget_1.getRecursiveScale(1, this.node) / MainScene_1.default.mainContentScale);
      };
      CamWidget.prototype.clear = function() {
        this.isAutoShow || this.setCamEnabled(false);
        this.sprites.forEach(function(sprite) {
          return sprite.node.opacity = 0;
        });
        this._renderNode = null;
      };
      CamWidget.getRecursiveScale = function(scale, node) {
        scale *= node.scaleY;
        if (node.getParent() && "mainContent" != node.getParent().name) return CamWidget_1.getRecursiveScale(scale, node.getParent());
        return scale;
      };
      CamWidget.prototype.getSpriteFrame = function() {
        return this._spriteFrame;
      };
      var CamWidget_1;
      __decorate([ property(cc.Sprite) ], CamWidget.prototype, "sprites", void 0);
      __decorate([ property ], CamWidget.prototype, "isHideSprite", void 0);
      __decorate([ property ], CamWidget.prototype, "isAutoShow", void 0);
      CamWidget = CamWidget_1 = __decorate([ ccclass ], CamWidget);
      return CamWidget;
    }(cc.Component);
    exports.default = CamWidget;
    cc._RF.pop();
  }, {
    "../Scene/MainScene": "MainScene"
  } ],
  CheatAddCoins: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d346aQJfl9Ela/2gzUxrnIE", "CheatAddCoins");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var FacadeCommand_1 = require("../../../PureMVC/FacadeCommand");
    var SessionService_1 = require("../../../Proxy/Interfaces/SessionService");
    var CheatAddCoins = function(_super) {
      __extends(CheatAddCoins, _super);
      function CheatAddCoins() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "Session_CheatAddCoins";
        return _this;
      }
      CheatAddCoins.prototype.execute = function(notification) {
        notification.notificationName.startsWith("callback_") ? this.fromServer(notification.body) : this.toServer(notification.body);
      };
      CheatAddCoins.prototype.toServer = function(body) {
        SessionService_1.default.cheatAddCoins(body);
      };
      CheatAddCoins.prototype.fromServer = function(body) {};
      return CheatAddCoins;
    }(FacadeCommand_1.default);
    exports.default = CheatAddCoins;
    cc._RF.pop();
  }, {
    "../../../Proxy/Interfaces/SessionService": "SessionService",
    "../../../PureMVC/FacadeCommand": "FacadeCommand"
  } ],
  CheatAddFoods: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "36943GvgWhDpaqs3ezcxa7G", "CheatAddFoods");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var FacadeCommand_1 = require("../../../PureMVC/FacadeCommand");
    var SessionService_1 = require("../../../Proxy/Interfaces/SessionService");
    var CheatAddFoods = function(_super) {
      __extends(CheatAddFoods, _super);
      function CheatAddFoods() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "Session_CheatAddFoods";
        return _this;
      }
      CheatAddFoods.prototype.execute = function(notification) {
        notification.notificationName.startsWith("callback_") ? this.fromServer(notification.body) : this.toServer(notification.body);
      };
      CheatAddFoods.prototype.toServer = function(body) {
        SessionService_1.default.cheatAddFoods(body);
      };
      CheatAddFoods.prototype.fromServer = function(body) {};
      return CheatAddFoods;
    }(FacadeCommand_1.default);
    exports.default = CheatAddFoods;
    cc._RF.pop();
  }, {
    "../../../Proxy/Interfaces/SessionService": "SessionService",
    "../../../PureMVC/FacadeCommand": "FacadeCommand"
  } ],
  CloneTextWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bc19eAvKQ9M/6gwGk0MwZ3l", "CloneTextWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode;
    var CloneTextWidget = function(_super) {
      __extends(CloneTextWidget, _super);
      function CloneTextWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.from = null;
        _this.to = null;
        return _this;
      }
      CloneTextWidget.prototype.onLoad = function() {
        this.clone();
      };
      CloneTextWidget.prototype.onFocusInEditor = function() {
        this.clone();
      };
      CloneTextWidget.prototype.onLostFocusInEditor = function() {
        this.clone();
      };
      CloneTextWidget.prototype.update = function(dt) {
        this.from && this.to && this.to.string != this.from.string && this.clone();
      };
      CloneTextWidget.prototype.clone = function() {
        this.from && this.to && (this.to.string = this.from.string);
      };
      __decorate([ property(cc.Label) ], CloneTextWidget.prototype, "from", void 0);
      __decorate([ property(cc.Label) ], CloneTextWidget.prototype, "to", void 0);
      CloneTextWidget = __decorate([ ccclass, executeInEditMode ], CloneTextWidget);
      return CloneTextWidget;
    }(cc.Component);
    exports.default = CloneTextWidget;
    cc._RF.pop();
  }, {} ],
  Connection: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4a444GI+7tAqqNB4VCOxTIy", "Connection");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ConnectionState = void 0;
    var DataWriter_1 = require("../io/DataWriter");
    var DataReader_1 = require("../io/DataReader");
    var Protocol_1 = require("./Protocol");
    var MainScenePreloaderMediator_1 = require("../../../Mediator/MainScenePreloaderMediator");
    var MainScene_1 = require("../../../Scene/MainScene");
    var Constants_1 = require("../../../Constants");
    var ConnectionState;
    (function(ConnectionState) {
      ConnectionState[ConnectionState["STATE_NONE"] = 0] = "STATE_NONE";
      ConnectionState[ConnectionState["STATE_CONNECTING"] = 1] = "STATE_CONNECTING";
      ConnectionState[ConnectionState["STATE_AUTHORIZATION"] = 2] = "STATE_AUTHORIZATION";
      ConnectionState[ConnectionState["STATE_CONNECTED"] = 3] = "STATE_CONNECTED";
      ConnectionState[ConnectionState["STATE_RECONNECTING"] = 4] = "STATE_RECONNECTING";
      ConnectionState[ConnectionState["STATE_RECOVERY"] = 5] = "STATE_RECOVERY";
    })(ConnectionState = exports.ConnectionState || (exports.ConnectionState = {}));
    var Connection = function() {
      function Connection() {
        var _this = this;
        this.onOpenFunc = function() {};
        this.onMessageFunc = function(message) {};
        this.onCloseFunc = function(isValid) {};
        this.onErrorFunc = function(errorCode) {};
        this.onShutdownFunc = function() {};
        this.onPingFunc = function() {};
        this._webSocket = null;
        this._queue = [];
        this._state = ConnectionState.STATE_NONE;
        this._cmid = 0;
        this._smid = 0;
        this._activityTimeout = 0;
        this._recoveryTimeout = 0;
        this._timeToPing = 0;
        this._timeToReconnect = 0;
        this._timeToConnect = 0;
        this._inBackground = false;
        this._connectionTimer = null;
        this._connectionTimer = new Constants_1.TimerObject(1e3, function(dt) {
          switch (_this._state) {
           case ConnectionState.STATE_CONNECTING:
            _this.connecting(dt);
            break;

           case ConnectionState.STATE_RECONNECTING:
            _this.reconnecting(dt);
            break;

           case ConnectionState.STATE_CONNECTED:
            _this.ping(dt);
          }
        });
      }
      Connection.destroyInstance = function(dontRecovery) {
        if (Connection._instance) if (dontRecovery) Connection._instance.disconnect(); else {
          Connection._instance.closeConnection("DESTROY_INSTANCE");
          Connection._instance = null;
        }
      };
      Connection.getInstance = function() {
        return Connection._instance || (Connection._instance = new this());
      };
      Connection.prototype.connect = function(address, authorizationKey) {
        if (this._state != ConnectionState.STATE_NONE) return;
        this._address = address;
        this._authorizationKey = authorizationKey;
        this._state = ConnectionState.STATE_CONNECTING;
        this._timeToConnect = 0;
        this.createWebSocket();
        this._connectionTimer.start();
      };
      Connection.prototype.closeConnection = function(reason) {
        MainScene_1.default.log("Close by: " + reason);
        this.onCloseFunc(this._state == ConnectionState.STATE_NONE);
        this._state = ConnectionState.STATE_NONE;
        this._queue.length = 0;
        this._activityTimeout = -1;
        this._recoveryTimeout = -1;
        this._sid = null;
        this._cmid = 0;
        this._smid = 0;
        this.onOpenFunc = function() {};
        this.onMessageFunc = function(message) {};
        this.onCloseFunc = function(isValid) {};
        this.onErrorFunc = function(errorCode) {};
        this.onShutdownFunc = function() {};
        this.onPingFunc = function() {};
        this.clean();
      };
      Connection.prototype.disconnect = function() {
        this.clean();
      };
      Connection.prototype.getState = function() {
        return this._state;
      };
      Connection.prototype.sendMessage = function(message) {
        this._cmid++;
        var dataWriter = new DataWriter_1.default();
        dataWriter.writeByte(Protocol_1.default.P_MESSAGE);
        dataWriter.writeRawInt(this._cmid);
        dataWriter.writeRawInt(message.length);
        dataWriter.writeRawBytes(message);
        var messageData = dataWriter.getArray();
        this._queue.push({
          cmid: this._cmid,
          messageData: messageData
        });
        this._state == ConnectionState.STATE_CONNECTED && this.send(messageData);
      };
      Connection.prototype.sendPing = function() {
        var message = new Uint8Array(1);
        message[0] = Protocol_1.default.P_PING;
        MainScene_1.default.log("SEND PING");
        this.send(message) || this.closeConnection("WRONG_CONNECTION_STATE");
      };
      Connection.prototype.ping = function(dt) {
        this._timeToPing += dt;
        if (this._timeToPing >= 2 * this._activityTimeout) {
          this.reconnect();
          return;
        }
        if (this._timeToPing > this._activityTimeout / 2) {
          var message = new Uint8Array(1);
          message[0] = Protocol_1.default.P_PING;
          this.send(message);
          MainScene_1.default.log("SEND PING");
        }
      };
      Connection.prototype.reconnecting = function(dt) {
        this._timeToReconnect += dt;
        if (this._timeToReconnect >= this._recoveryTimeout) {
          this.closeConnection("RECONNECTING");
          return;
        }
      };
      Connection.prototype.connecting = function(dt) {
        this._timeToConnect += dt;
        if (this._timeToConnect >= 60) {
          this.closeConnection("CONNECTING");
          return;
        }
      };
      Connection.prototype.setInBackground = function(val) {
        this._inBackground = val;
      };
      Connection.prototype.onOpen = function(messageEvent) {
        switch (this._state) {
         case ConnectionState.STATE_CONNECTING:
          this._state = ConnectionState.STATE_AUTHORIZATION;
          var dataWriter = new DataWriter_1.default();
          dataWriter.writeByte(Protocol_1.default.P_AUTHORIZATION);
          dataWriter.writeRawInt(this._authorizationKey.length, false);
          dataWriter.writeRawString(this._authorizationKey);
          this.send(dataWriter.getArray());
          break;

         case ConnectionState.STATE_RECONNECTING:
          this._state = ConnectionState.STATE_RECOVERY;
          var dataWriter = new DataWriter_1.default();
          dataWriter.writeByte(Protocol_1.default.P_RECOVERY);
          dataWriter.writeRawInt(4 + this._sid.length, false);
          dataWriter.writeRawInt(this._smid);
          dataWriter.writeRawBytes(this._sid);
          this.send(dataWriter.getArray());
        }
      };
      Connection.prototype.onMessage = function(messageEvent) {
        var dataReader = new DataReader_1.default(messageEvent.data);
        this._timeToPing = 0;
        this._inBackground = false;
        while (dataReader.isReadable()) {
          var commandId = dataReader.readByte();
          switch (commandId) {
           case Protocol_1.default.P_AUTHORIZATION:
            this._activityTimeout = dataReader.readClearInt();
            this._recoveryTimeout = dataReader.readClearInt();
            var len = dataReader.readClearInt(false);
            this._sid = dataReader.readBytes(len);
            this._state = ConnectionState.STATE_CONNECTED;
            this.onOpenFunc();
            this._connectionTimer.start();
            break;

           case Protocol_1.default.P_CLOSE_AUTHORIZATION_REJECT:
            this.onErrorFunc(Protocol_1.default.CONNECTION_ERROR_AUTHORIZATION_REJECT);
            this.closeConnection("CLOSE_AUTHORIZATION_REJECT");
            break;

           case Protocol_1.default.P_RECOVERY:
            var len = dataReader.readClearInt(false);
            var cmid = dataReader.readClearInt();
            this._sid = dataReader.readBytes(len - 4);
            this._state = ConnectionState.STATE_CONNECTED;
            this._connectionTimer.start();
            this.clearMessageQueue(cmid);
            this.sendMessageQueue(cmid);
            break;

           case Protocol_1.default.P_CLOSE_RECOVERY_REJECT:
            this.onErrorFunc(Protocol_1.default.CONNECTION_ERROR_RECOVERY_REJECT);
            this.closeConnection("CLOSE_RECOVERY_REJECT");
            break;

           case Protocol_1.default.P_MESSAGE:
            this._smid = dataReader.readClearInt();
            var len = dataReader.readClearInt();
            var messageByteArray = dataReader.readBytes(len);
            this.onMessageFunc(messageByteArray);
            break;

           case Protocol_1.default.P_MESSAGE_RECEIVED:
            var cmid = dataReader.readClearInt();
            this.clearMessageQueue(cmid);
            break;

           case Protocol_1.default.P_SERVER_SHUTDOWN_TIMEOUT:
            var timeout = dataReader.readClearInt();
            this.onShutdownFunc(timeout);
            break;

           case Protocol_1.default.P_PING:
            this.onPingFunc();
            MainScene_1.default.log("GET PING");
            break;

           case Protocol_1.default.P_CLOSE:
           case Protocol_1.default.P_CLOSE_SERVER_SHUTDOWN:
           case Protocol_1.default.P_CLOSE_ACTIVITY_TIMEOUT_EXPIRED:
           case Protocol_1.default.P_CLOSE_CONCURRENT:
           case Protocol_1.default.P_CLOSE_PROTOCOL_BROKEN:
           case Protocol_1.default.P_CLOSE_SERVER_ERROR:
            MainScenePreloaderMediator_1.default.ConnectionAttempts = 0;
            this._state = ConnectionState.STATE_NONE;
            this.onErrorFunc(commandId);
            if (commandId == Protocol_1.default.P_CLOSE_SERVER_ERROR) throw new Error("Server connection close on error");
          }
        }
      };
      Connection.prototype.onClose = function(closeEvent) {
        this._inBackground ? this.closeConnection(closeEvent.reason.toUpperCase()) : this.reconnect();
      };
      Connection.prototype.onError = function(errorEvent) {
        this.onErrorFunc(errorEvent.error);
      };
      Connection.prototype.send = function(message) {
        if (this._state != ConnectionState.STATE_AUTHORIZATION && this._state != ConnectionState.STATE_CONNECTED && this._state != ConnectionState.STATE_RECOVERY) return false;
        try {
          this._webSocket.send(message);
        } catch (e) {
          this.onErrorFunc(e);
        }
      };
      Connection.prototype.clean = function() {
        this._connectionTimer.stop();
        this._webSocket && this._webSocket.readyState == WebSocket.OPEN && this._webSocket.close();
        this._webSocket = null;
      };
      Connection.prototype.reconnect = function() {
        if (this._state <= ConnectionState.STATE_AUTHORIZATION) {
          this.closeConnection("WRONG_CONNECTION_STATE");
          return;
        }
        this.clean();
        this._timeToReconnect = 0;
        this._state = ConnectionState.STATE_RECONNECTING;
        this.createWebSocket();
        this._connectionTimer.start();
      };
      Connection.prototype.clearMessageQueue = function(cmid) {
        var lastMessage = _.find(this._queue, function(m) {
          return m.cmid == cmid;
        });
        if (lastMessage) {
          var index = _.indexOf(this._queue, lastMessage, 0);
          index == this._queue.length - 1 ? this._queue = [] : this._queue = _.slice(this._queue, index + 1, this._queue.length);
        }
      };
      Connection.prototype.sendMessageQueue = function(cmid) {
        for (var i = 0; i < this._queue.length; i++) this.send(this._queue[i].messageData);
        MainScene_1.default.log("SEND MESSAGE QUEUE: " + JSON.stringify(this._queue));
      };
      Connection.prototype.createWebSocket = function() {
        var _this = this;
        this._webSocket = new WebSocket(this._address);
        this._webSocket.binaryType = "arraybuffer";
        this._webSocket.onopen = function(event) {
          _this.onOpen(event);
        };
        this._webSocket.onmessage = function(event) {
          _this.onMessage(event);
        };
        this._webSocket.onerror = function(event) {
          _this.onError(event);
        };
        this._webSocket.onclose = function(event) {
          _this.onClose(event);
        };
      };
      Connection._instance = null;
      return Connection;
    }();
    exports.default = Connection;
    cc._RF.pop();
  }, {
    "../../../Constants": "Constants",
    "../../../Mediator/MainScenePreloaderMediator": "MainScenePreloaderMediator",
    "../../../Scene/MainScene": "MainScene",
    "../io/DataReader": "DataReader",
    "../io/DataWriter": "DataWriter",
    "./Protocol": "Protocol"
  } ],
  Constants: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "33f48M9/+9CEqERWhb4a2pS", "Constants");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TimerObject = exports.CountObject = void 0;
    var Constants = function() {
      function Constants() {}
      Constants.isTestServer = function() {
        var address = window.csiAddress ? window.csiAddress : Constants.SERVER_ADDRESS_WS;
        return address && (address.indexOf("test.capjack.ru") >= 0 || address.indexOf("192.168.1.46") >= 0);
      };
      Constants.Z_LOBBY = 1e3;
      Constants.Z_SLOT = 1200;
      Constants.Z_TOP_MENU = 2e3;
      Constants.Z_PRELOADER = 2200;
      Constants.Z_POPUP = 3e3;
      Constants.Z_EMULATE = 4e3;
      Constants.Z_MAX = cc.macro.MAX_ZINDEX;
      Constants.HIDE_OPACITY = 100;
      Constants.SERVER_VERSION = "1.0.0";
      Constants.CLIENT_VERSION = "1";
      Constants.SERVER_ADDRESS_WS = "ws://test.capjack.ru/ws-11002/";
      Constants.CPD_PROJECT_NAME = "AnimalSlots";
      Constants.LOCAL_STORAGE = "as_local_data";
      Constants.BUNDLE_RESOURCE = "resource";
      Constants.BUNDLE_GENERAL = "general";
      Constants.BUNDLE_LOBBY = "lobby";
      Constants.BUNDLE_SLOTS = "slots";
      Constants.BUNDLE_ANIMALS = "animals";
      return Constants;
    }();
    exports.default = Constants;
    var CountObject = function(_super) {
      __extends(CountObject, _super);
      function CountObject() {
        var _this_1 = null !== _super && _super.apply(this, arguments) || this;
        _this_1._count = 0;
        _this_1._changeCallback = void 0;
        _this_1.isRunning = false;
        return _this_1;
      }
      Object.defineProperty(CountObject.prototype, "count", {
        get: function() {
          return this._count;
        },
        set: function(value) {
          this._count = value;
          this._changeCallback && this._changeCallback(this._count);
        },
        enumerable: false,
        configurable: true
      });
      CountObject.prototype.stop = function(saveCount) {
        cc.Tween.stopAllByTarget(this);
        saveCount || (this._count = 0);
        this.isRunning = false;
      };
      CountObject.prototype.run = function(changeCallback) {
        cc.Tween.stopAllByTarget(this);
        this.isRunning = true;
        this._changeCallback = changeCallback;
      };
      return CountObject;
    }(cc.Object);
    exports.CountObject = CountObject;
    var TimerObject = function() {
      function TimerObject(interval, callback) {
        this._lastTime = 0;
        this._timer = null;
        this._interval = 0;
        this._callback = null;
        this._interval = interval;
        this._callback = callback;
      }
      TimerObject.prototype.start = function() {
        var _this_1 = this;
        this._timer && clearInterval(this._timer);
        var _this = this;
        this._lastTime = Date.now();
        this._timer = setInterval(function() {
          var now = Date.now();
          var dt = now - _this._lastTime;
          _this._lastTime = dt % 1e3;
          _this._callback(Math.round((dt - _this._lastTime) / 1e3));
          _this_1._lastTime = now - _this_1._lastTime;
        }, this._interval);
      };
      TimerObject.prototype.stop = function() {
        this._timer && clearInterval(this._timer);
        this._timer = null;
      };
      return TimerObject;
    }();
    exports.TimerObject = TimerObject;
    cc._RF.pop();
  }, {} ],
  CsiAnimalSkill_Upgrade: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d552faKNtpHEa3DnKz3mOAz", "CsiAnimalSkill_Upgrade");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Entity_1 = require("../../io/Entity");
    var CsiAnimalSkill_Upgrade = function(_super) {
      __extends(CsiAnimalSkill_Upgrade, _super);
      function CsiAnimalSkill_Upgrade() {
        var _this = _super.call(this) || this;
        _this.type = null;
        _this.power = 0;
        _this.foods = 0;
        _this.duration = 0;
        _this.setEId(CsiAnimalSkill_Upgrade.ID);
        return _this;
      }
      CsiAnimalSkill_Upgrade.prototype.write = function(writer) {
        writer.writeEnum(this.type);
        writer.writeInt(this.power);
        writer.writeInt(this.foods);
        writer.writeInt(this.duration);
      };
      CsiAnimalSkill_Upgrade.prototype.read = function(reader) {
        this.type = reader.readEnum();
        this.power = reader.readInt();
        this.foods = reader.readInt();
        this.duration = reader.readInt();
      };
      CsiAnimalSkill_Upgrade.ID = 12;
      return CsiAnimalSkill_Upgrade;
    }(Entity_1.default);
    exports.default = CsiAnimalSkill_Upgrade;
    cc._RF.pop();
  }, {
    "../../io/Entity": "Entity"
  } ],
  CsiAnimalSkill: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "16a94h59qBOsLCT7uKhfi9+", "CsiAnimalSkill");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Entity_1 = require("../../io/Entity");
    var CsiAnimalSkill = function(_super) {
      __extends(CsiAnimalSkill, _super);
      function CsiAnimalSkill() {
        var _this = _super.call(this) || this;
        _this.type = null;
        _this.power = 0;
        _this.foods = 0;
        _this.duration = 0;
        _this.expiration = 0;
        _this.setEId(CsiAnimalSkill.ID);
        return _this;
      }
      CsiAnimalSkill.prototype.write = function(writer) {
        writer.writeEnum(this.type);
        writer.writeInt(this.power);
        writer.writeInt(this.foods);
        writer.writeInt(this.duration);
        writer.writeInt(this.expiration);
      };
      CsiAnimalSkill.prototype.read = function(reader) {
        this.type = reader.readEnum();
        this.power = reader.readInt();
        this.foods = reader.readInt();
        this.duration = reader.readInt();
        this.expiration = reader.readInt();
      };
      CsiAnimalSkill.ID = 11;
      return CsiAnimalSkill;
    }(Entity_1.default);
    exports.default = CsiAnimalSkill;
    cc._RF.pop();
  }, {
    "../../io/Entity": "Entity"
  } ],
  CsiAnimalState_Available: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1547bO4AF1G14khHDBBpEDd", "CsiAnimalState_Available");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CsiAnimalState_1 = require("./CsiAnimalState");
    var CsiAnimalState_Available = function(_super) {
      __extends(CsiAnimalState_Available, _super);
      function CsiAnimalState_Available() {
        var _this = _super.call(this) || this;
        _this.level = 0;
        _this.levelPoints = 0;
        _this.levelPointsLimit = 0;
        _this.skills = [];
        _this.skillUpgrade = null;
        _this.setEId(CsiAnimalState_Available.ID);
        return _this;
      }
      CsiAnimalState_Available.prototype.write = function(writer) {
        _super.prototype.write.call(this, writer);
        writer.writeInt(this.level);
        writer.writeInt(this.levelPoints);
        writer.writeInt(this.levelPointsLimit);
        writer.writeObjectArray(this.skills);
        writer.writeEntity(this.skillUpgrade);
      };
      CsiAnimalState_Available.prototype.read = function(reader) {
        _super.prototype.read.call(this, reader);
        this.level = reader.readInt();
        this.levelPoints = reader.readInt();
        this.levelPointsLimit = reader.readInt();
        this.skills = reader.readObjectArray();
        this.skillUpgrade = reader.readEntity();
      };
      CsiAnimalState_Available.ID = 8;
      return CsiAnimalState_Available;
    }(CsiAnimalState_1.default);
    exports.default = CsiAnimalState_Available;
    cc._RF.pop();
  }, {
    "./CsiAnimalState": "CsiAnimalState"
  } ],
  CsiAnimalState_Locked: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "63eb90QHhVMhJ5OYUGUZeiB", "CsiAnimalState_Locked");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CsiAnimalState_1 = require("./CsiAnimalState");
    var CsiAnimalState_Locked = function(_super) {
      __extends(CsiAnimalState_Locked, _super);
      function CsiAnimalState_Locked() {
        var _this = _super.call(this) || this;
        _this.setEId(CsiAnimalState_Locked.ID);
        return _this;
      }
      CsiAnimalState_Locked.ID = 7;
      CsiAnimalState_Locked.INSTANCE = new CsiAnimalState_Locked();
      return CsiAnimalState_Locked;
    }(CsiAnimalState_1.default);
    exports.default = CsiAnimalState_Locked;
    cc._RF.pop();
  }, {
    "./CsiAnimalState": "CsiAnimalState"
  } ],
  CsiAnimalState_Unavailable: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "38ae1Yg+zBKF7bA1VvDCNn2", "CsiAnimalState_Unavailable");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CsiAnimalState_1 = require("./CsiAnimalState");
    var CsiAnimalState_Unavailable = function(_super) {
      __extends(CsiAnimalState_Unavailable, _super);
      function CsiAnimalState_Unavailable() {
        var _this = _super.call(this) || this;
        _this.requiredUserLevel = 0;
        _this.setEId(CsiAnimalState_Unavailable.ID);
        return _this;
      }
      CsiAnimalState_Unavailable.prototype.write = function(writer) {
        _super.prototype.write.call(this, writer);
        writer.writeInt(this.requiredUserLevel);
      };
      CsiAnimalState_Unavailable.prototype.read = function(reader) {
        _super.prototype.read.call(this, reader);
        this.requiredUserLevel = reader.readInt();
      };
      CsiAnimalState_Unavailable.ID = 6;
      return CsiAnimalState_Unavailable;
    }(CsiAnimalState_1.default);
    exports.default = CsiAnimalState_Unavailable;
    cc._RF.pop();
  }, {
    "./CsiAnimalState": "CsiAnimalState"
  } ],
  CsiAnimalState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "81a35bUizBIKIhUJreF+Hwg", "CsiAnimalState");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Entity_1 = require("../../io/Entity");
    var CsiAnimalState = function(_super) {
      __extends(CsiAnimalState, _super);
      function CsiAnimalState() {
        var _this = _super.call(this) || this;
        _this.setEId(CsiAnimalState.ID);
        return _this;
      }
      CsiAnimalState.ID = 5;
      return CsiAnimalState;
    }(Entity_1.default);
    exports.default = CsiAnimalState;
    cc._RF.pop();
  }, {
    "../../io/Entity": "Entity"
  } ],
  CsiAnimal: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1c21640FVdJ87cVi0ivXOSi", "CsiAnimal");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DataTypes_1 = require("../../io/DataTypes");
    var Entity_1 = require("../../io/Entity");
    var CsiAnimal = function(_super) {
      __extends(CsiAnimal, _super);
      function CsiAnimal() {
        var _this = _super.call(this) || this;
        _this.id = "";
        _this.slots = [];
        _this.state = null;
        _this.setEId(CsiAnimal.ID);
        return _this;
      }
      CsiAnimal.prototype.write = function(writer) {
        writer.writeString(this.id);
        writer.writeRawArray(this.slots, DataTypes_1.DataTypes.STRING);
        writer.writeEntity(this.state);
      };
      CsiAnimal.prototype.read = function(reader) {
        this.id = reader.readString();
        this.slots = reader.readRawArray(DataTypes_1.DataTypes.STRING);
        this.state = reader.readEntity();
      };
      CsiAnimal.ID = 4;
      return CsiAnimal;
    }(Entity_1.default);
    exports.default = CsiAnimal;
    cc._RF.pop();
  }, {
    "../../io/DataTypes": "DataTypes",
    "../../io/Entity": "Entity"
  } ],
  CsiApiIds: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "97d1c5jE2ZNsKS2GpU4RUni", "CsiApiIds");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CsiApi = function() {
      function CsiApi() {}
      CsiApi.CSI_SERVICE_SLOTS = 2;
      CsiApi.CSI_SERVICE_SESSION = 1;
      CsiApi.CSI_SERVICE_ANIMALS = 3;
      CsiApi.CSI_SERVICE_ACTIONS_SESSION = 1;
      CsiApi.CSI_SERVICE_ACTIONS_ANIMALS = 2;
      CsiApi.CSI_SERVER_SLOTS_EXECUTE_GAME_COMMAND = 3;
      CsiApi.CSI_SERVER_SLOTS_EXECUTE_GAME_COMMAND_CALLBACK = 203;
      CsiApi.CSI_SERVER_SLOTS_GET_LIST = 1;
      CsiApi.CSI_SERVER_SLOTS_GET_LIST_CALLBACK = 201;
      CsiApi.CSI_SERVER_SLOTS_LAUNCH_GAME = 2;
      CsiApi.CSI_SERVER_SESSION_CHEAT_ADD_FOODS = 4;
      CsiApi.CSI_SERVER_SESSION_GET_USER = 1;
      CsiApi.CSI_SERVER_SESSION_GET_USER_CALLBACK = 101;
      CsiApi.CSI_SERVER_SESSION_UP_LEVEL = 2;
      CsiApi.CSI_SERVER_SESSION_CHEAT_ADD_COINS = 3;
      CsiApi.CSI_SERVER_ANIMALS_FEED = 2;
      CsiApi.CSI_SERVER_ANIMALS_FEED_CALLBACK = 302;
      CsiApi.CSI_SERVER_ANIMALS_GET_LIST = 1;
      CsiApi.CSI_SERVER_ANIMALS_GET_LIST_CALLBACK = 301;
      CsiApi.CSI_SERVER_ANIMALS_CHEAT_UNLOCK_ANIMAL = 3;
      CsiApi.CSI_CLIENT_SESSION_UPDATE_USER_COINS = 3;
      CsiApi.CSI_CLIENT_SESSION_UPDATE_USER_FOODS = 4;
      CsiApi.CSI_CLIENT_SESSION_UPDATE_USER_LEVEL = 1;
      CsiApi.CSI_CLIENT_SESSION_UPDATE_USER_LEVEL_POINTS = 2;
      CsiApi.CSI_CLIENT_ANIMALS_UPDATE_STATE = 1;
      CsiApi.CSI_CLIENT_ANIMALS_UPDATE_LEVEL = 2;
      CsiApi.CSI_CLIENT_ANIMALS_UPDATE_LEVEL_POINTS = 3;
      CsiApi.CSI_CLIENT_ANIMALS_UPDATE_SATURATION_UPGRADE = 4;
      return CsiApi;
    }();
    exports.default = CsiApi;
    cc._RF.pop();
  }, {} ],
  CsiEnums: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0fc7fVY/75LC4zJE8Dt04bQ", "CsiEnums");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CsiAnimalSkill_Type = exports.CsiShopProduct_Resource = void 0;
    var CsiShopProduct_Resource;
    (function(CsiShopProduct_Resource) {
      CsiShopProduct_Resource[CsiShopProduct_Resource["COINS"] = 0] = "COINS";
    })(CsiShopProduct_Resource = exports.CsiShopProduct_Resource || (exports.CsiShopProduct_Resource = {}));
    var CsiAnimalSkill_Type;
    (function(CsiAnimalSkill_Type) {
      CsiAnimalSkill_Type[CsiAnimalSkill_Type["USER_COINS"] = 0] = "USER_COINS";
      CsiAnimalSkill_Type[CsiAnimalSkill_Type["USER_EXPERIENCE"] = 1] = "USER_EXPERIENCE";
      CsiAnimalSkill_Type[CsiAnimalSkill_Type["SLOT_FEATURE"] = 2] = "SLOT_FEATURE";
    })(CsiAnimalSkill_Type = exports.CsiAnimalSkill_Type || (exports.CsiAnimalSkill_Type = {}));
    cc._RF.pop();
  }, {} ],
  CsiSessionUser: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "426a1pbitBNwbBarW/q3k4X", "CsiSessionUser");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CsiUser_1 = require("./CsiUser");
    var CsiSessionUser = function(_super) {
      __extends(CsiSessionUser, _super);
      function CsiSessionUser() {
        var _this = _super.call(this) || this;
        _this.levelPoints = 0;
        _this.levelPointsLimit = 0;
        _this.coins = bigInt(0);
        _this.foods = 0;
        _this.setEId(CsiSessionUser.ID);
        return _this;
      }
      CsiSessionUser.prototype.write = function(writer) {
        _super.prototype.write.call(this, writer);
        writer.writeInt(this.levelPoints);
        writer.writeInt(this.levelPointsLimit);
        writer.writeLong(this.coins);
        writer.writeInt(this.foods);
      };
      CsiSessionUser.prototype.read = function(reader) {
        _super.prototype.read.call(this, reader);
        this.levelPoints = reader.readInt();
        this.levelPointsLimit = reader.readInt();
        this.coins = reader.readLong();
        this.foods = reader.readInt();
      };
      CsiSessionUser.ID = 2;
      return CsiSessionUser;
    }(CsiUser_1.default);
    exports.default = CsiSessionUser;
    cc._RF.pop();
  }, {
    "./CsiUser": "CsiUser"
  } ],
  CsiShopProduct_Item: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f7dcexptYFFQrtbA0aGqiC6", "CsiShopProduct_Item");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Entity_1 = require("../../io/Entity");
    var CsiShopProduct_Item = function(_super) {
      __extends(CsiShopProduct_Item, _super);
      function CsiShopProduct_Item() {
        var _this = _super.call(this) || this;
        _this.resource = null;
        _this.value = 0;
        _this.baseValue = 0;
        _this.bonusPercent = 0;
        _this.setEId(CsiShopProduct_Item.ID);
        return _this;
      }
      CsiShopProduct_Item.prototype.write = function(writer) {
        writer.writeEnum(this.resource);
        writer.writeInt(this.value);
        writer.writeInt(this.baseValue);
        writer.writeInt(this.bonusPercent);
      };
      CsiShopProduct_Item.prototype.read = function(reader) {
        this.resource = reader.readEnum();
        this.value = reader.readInt();
        this.baseValue = reader.readInt();
        this.bonusPercent = reader.readInt();
      };
      CsiShopProduct_Item.ID = 12;
      return CsiShopProduct_Item;
    }(Entity_1.default);
    exports.default = CsiShopProduct_Item;
    cc._RF.pop();
  }, {
    "../../io/Entity": "Entity"
  } ],
  CsiShopProduct: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2aa20xcWCRAWqY2TyH8KuQq", "CsiShopProduct");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Entity_1 = require("../../io/Entity");
    var CsiShopProduct = function(_super) {
      __extends(CsiShopProduct, _super);
      function CsiShopProduct() {
        var _this = _super.call(this) || this;
        _this.id = 0;
        _this.code = "";
        _this.name = "";
        _this.price = 0;
        _this.items = [];
        _this.setEId(CsiShopProduct.ID);
        return _this;
      }
      CsiShopProduct.prototype.write = function(writer) {
        writer.writeInt(this.id);
        writer.writeString(this.code);
        writer.writeString(this.name);
        writer.writeInt(this.price);
        writer.writeObjectArray(this.items);
      };
      CsiShopProduct.prototype.read = function(reader) {
        this.id = reader.readInt();
        this.code = reader.readString();
        this.name = reader.readString();
        this.price = reader.readInt();
        this.items = reader.readObjectArray();
      };
      CsiShopProduct.ID = 11;
      return CsiShopProduct;
    }(Entity_1.default);
    exports.default = CsiShopProduct;
    cc._RF.pop();
  }, {
    "../../io/Entity": "Entity"
  } ],
  CsiSlot: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "68044HBVANEgrcPVJVkJiMD", "CsiSlot");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Entity_1 = require("../../io/Entity");
    var CsiSlot = function(_super) {
      __extends(CsiSlot, _super);
      function CsiSlot() {
        var _this = _super.call(this) || this;
        _this.id = "";
        _this.level = 0;
        _this.setEId(CsiSlot.ID);
        return _this;
      }
      CsiSlot.prototype.write = function(writer) {
        writer.writeString(this.id);
        writer.writeInt(this.level);
      };
      CsiSlot.prototype.read = function(reader) {
        this.id = reader.readString();
        this.level = reader.readInt();
      };
      CsiSlot.ID = 3;
      return CsiSlot;
    }(Entity_1.default);
    exports.default = CsiSlot;
    cc._RF.pop();
  }, {
    "../../io/Entity": "Entity"
  } ],
  CsiUser: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e2b8b5ms7dORrzqdat8mWe3", "CsiUser");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Entity_1 = require("../../io/Entity");
    var CsiUser = function(_super) {
      __extends(CsiUser, _super);
      function CsiUser() {
        var _this = _super.call(this) || this;
        _this.id = 0;
        _this.level = 0;
        _this.name = "";
        _this.avatar = null;
        _this.setEId(CsiUser.ID);
        return _this;
      }
      CsiUser.prototype.write = function(writer) {
        writer.writeInt(this.id);
        writer.writeInt(this.level);
        writer.writeString(this.name);
        writer.writeString(this.avatar);
      };
      CsiUser.prototype.read = function(reader) {
        this.id = reader.readInt();
        this.level = reader.readInt();
        this.name = reader.readString();
        this.avatar = reader.readString();
      };
      CsiUser.ID = 1;
      return CsiUser;
    }(Entity_1.default);
    exports.default = CsiUser;
    cc._RF.pop();
  }, {
    "../../io/Entity": "Entity"
  } ],
  CustomPagesIndicator: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "926bdwlhjdEcKlHnbsbc9JC", "CustomPagesIndicator");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SpriteButton_1 = require("./SpriteButton");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executionOrder = _a.executionOrder;
    var CustomPagesIndicator = function(_super) {
      __extends(CustomPagesIndicator, _super);
      function CustomPagesIndicator() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.buttonSize = cc.Size.ZERO;
        return _this;
      }
      CustomPagesIndicator.prototype._createIndicator = function() {
        var _this = this;
        var node = new cc.Node();
        var spriteNode = new cc.Node();
        var spriteButton = spriteNode.addComponent(SpriteButton_1.default);
        spriteButton.spriteFrame = null;
        spriteNode.parent = node;
        spriteNode.width = this.buttonSize.width;
        spriteNode.height = this.buttonSize.height;
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.spriteFrame;
        node.parent = this.node;
        node.width = this.cellSize.width;
        node.height = this.cellSize.height;
        spriteButton.onTouchEnd = function() {
          var pageIndex = _this._indicators.indexOf(node);
          _this._pageView.scrollToPage(pageIndex, .5);
        };
        return node;
      };
      CustomPagesIndicator.prototype._changedState = function() {
        _super.prototype._changedState.call(this);
        for (var i = 0; i < this._indicators.length; ++i) {
          var node = this._indicators[i];
          255 == node.opacity ? node.scale = 1 : node.scale = .6363;
        }
      };
      __decorate([ property(cc.Size) ], CustomPagesIndicator.prototype, "buttonSize", void 0);
      CustomPagesIndicator = __decorate([ ccclass ], CustomPagesIndicator);
      return CustomPagesIndicator;
    }(cc.PageViewIndicator);
    exports.default = CustomPagesIndicator;
    cc._RF.pop();
  }, {
    "./SpriteButton": "SpriteButton"
  } ],
  CustomPagesWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "51a04rKo6dDab+z20VDJNjK", "CustomPagesWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SizeWidget_1 = require("../SizeWidget");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executionOrder = _a.executionOrder;
    var CustomPagesWidget = function(_super) {
      __extends(CustomPagesWidget, _super);
      function CustomPagesWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.content = null;
        _this._lastMaxHeight = 0;
        _this._lastWidth = 0;
        _this._selectedPageIndex = 0;
        return _this;
      }
      CustomPagesWidget.prototype.onEnable = function() {
        this.getComponent(cc.PageView)._unregisterEvent();
      };
      CustomPagesWidget.prototype.update = function(dt) {
        var updateIndex = -1;
        var maxHeight = 0;
        var maxWidth = 0;
        for (var i = 0; i < this.content.children.length; i++) {
          var size = this.content.children[i].getContentSize();
          if (size.height > maxHeight) {
            updateIndex = i;
            maxHeight = size.height;
          }
          maxWidth += size.width;
        }
        if (maxWidth != this._lastWidth) {
          this._lastWidth = maxWidth;
          var pageView = this.node.getComponent(cc.PageView);
          pageView._updatePageView();
          this.selectNewPage(0);
        }
        if (maxHeight != this._lastMaxHeight) {
          this._lastMaxHeight = maxHeight;
          this.node.getComponent(SizeWidget_1.default).setTarget(this.content.children[updateIndex]);
        }
      };
      CustomPagesWidget.prototype.selectNewPage = function(duration) {
        var pageView = this.node.getComponent(cc.PageView);
        pageView.scrollToPage(this._selectedPageIndex, duration);
      };
      CustomPagesWidget.prototype.setSelectedPageIndex = function(page) {
        var pageView = this.node.getComponent(cc.PageView);
        this._selectedPageIndex = pageView.getPages().indexOf(page);
        this.update(0);
      };
      __decorate([ property(cc.Node) ], CustomPagesWidget.prototype, "content", void 0);
      CustomPagesWidget = __decorate([ ccclass ], CustomPagesWidget);
      return CustomPagesWidget;
    }(cc.Component);
    exports.default = CustomPagesWidget;
    cc._RF.pop();
  }, {
    "../SizeWidget": "SizeWidget"
  } ],
  DVD: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a8643G0VI1LaalQ2eiopQAD", "DVD");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Constants_1 = require("../Constants");
    var DVD = function() {
      function DVD() {}
      DVD.init = function() {
        if (cc.sys.isNative || Constants_1.default.isTestServer()) return;
        try {
          var key = window.devtodevKey;
          "" != key && devtodev.init(key, window.userId ? window.userId : "");
        } catch (e) {
          cc.log(e);
        }
      };
      DVD.setFullScreenMode = function(status) {
        if (cc.sys.isNative || Constants_1.default.isTestServer()) return;
      };
      DVD.setCrossplatformUserId = function(uid) {
        if (cc.sys.isNative || Constants_1.default.isTestServer()) return;
        try {
          devtodev.setCrossplatformUserId(uid);
        } catch (e) {
          cc.log(e);
        }
      };
      DVD.setCurrentLevel = function(currentUserLevel) {
        if (cc.sys.isNative || Constants_1.default.isTestServer()) return;
        try {
          devtodev.setCurrentLevel(currentUserLevel);
        } catch (e) {
          cc.log(e);
        }
      };
      DVD.setAppData = function() {
        if (cc.sys.isNative || Constants_1.default.isTestServer()) return;
        try {
          var appData = {
            appVersion: Constants_1.default.SERVER_VERSION,
            codeVersion: Constants_1.default.CLIENT_VERSION
          };
          devtodev.setAppData(appData);
        } catch (e) {
          cc.log(e);
        }
      };
      DVD.tutorialCompleted = function(step) {
        if (cc.sys.isNative || Constants_1.default.isTestServer()) return;
        try {
          devtodev.tutorialCompleted(step);
        } catch (e) {
          cc.log(e);
        }
      };
      DVD.levelUp = function(level) {
        if (cc.sys.isNative || Constants_1.default.isTestServer()) return;
        try {
          devtodev.levelUp(level);
        } catch (e) {
          cc.log(e);
        }
      };
      DVD.customEvent = function(eventName, params) {
        if (cc.sys.isNative || Constants_1.default.isTestServer()) return;
        try {
          devtodev.customEvent(eventName, params.params);
        } catch (e) {
          cc.log(e);
        }
      };
      DVD.realPayment = function(transactionId, productPrice, productName, transactionCurrencyISOCode) {
        if (cc.sys.isNative || Constants_1.default.isTestServer()) return;
        try {
          devtodev.realPayment(transactionId, productPrice, productName, transactionCurrencyISOCode);
        } catch (e) {
          cc.log(e);
        }
      };
      return DVD;
    }();
    exports.default = DVD;
    cc._RF.pop();
  }, {
    "../Constants": "Constants"
  } ],
  DataReader: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "095506AONtEvp6p/+b3FGb9", "DataReader");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DataTypes_1 = require("./DataTypes");
    var EntityFabric_1 = require("./EntityFabric");
    var DataReader = function() {
      function DataReader(array) {
        if (array instanceof ArrayBuffer) {
          this._arrayBuffer = array;
          this._dataView = new DataView(this._arrayBuffer);
          this._cursor = 0;
        } else {
          this._arrayBuffer = array.buffer;
          this._dataView = new DataView(this._arrayBuffer);
          this._cursor = array.byteOffset;
        }
      }
      DataReader.prototype.isReadable = function() {
        return this._cursor < this._dataView.byteLength;
      };
      DataReader.prototype.getReadableBytes = function() {
        return this._arrayBuffer.byteLength - this._cursor;
      };
      DataReader.prototype.readByte = function() {
        return this._dataView.getUint8(this._cursor++);
      };
      DataReader.prototype.readBool = function() {
        return 0 != this.readByte();
      };
      DataReader.prototype.readInt = function() {
        var v = this.readByte();
        switch (v) {
         case 255:
          return -1;

         case 254:
          var value = this._dataView.getInt32(this._cursor);
          this._cursor += 4;
          return value;
        }
        return v;
      };
      DataReader.prototype.readLong = function() {
        var v = this.readByte();
        switch (v) {
         case 255:
          return bigInt(-1);

         case 254:
          var array = new Uint8Array(this._arrayBuffer, this._cursor, 8);
          this._cursor += 8;
          var bigIntArray = [];
          for (var i = 0; i < array.length; i++) bigIntArray.push(array[i]);
          return bigInt.fromArray(bigIntArray, 256);
        }
        return bigInt(v);
      };
      DataReader.prototype.readFloat = function() {
        var value = this._dataView.getFloat32(this._cursor);
        this._cursor += 4;
        return value;
      };
      DataReader.prototype.readDouble = function() {
        var value = this._dataView.getFloat64(this._cursor);
        this._cursor += 8;
        return value;
      };
      DataReader.prototype.readBytes = function(len) {
        var buffer = this._arrayBuffer.slice(this._cursor, this._cursor + len);
        var array = new Uint8Array(buffer);
        this._cursor += len;
        return array.slice();
      };
      DataReader.prototype.readString = function() {
        return this.readClearString(this.readInt());
      };
      DataReader.prototype.readEnum = function() {
        return this.readInt();
      };
      DataReader.prototype.readClearInt = function(full) {
        void 0 === full && (full = true);
        if (full) {
          var value = this._dataView.getInt32(this._cursor);
          this._cursor += 4;
          return value;
        }
        return this.readByte();
      };
      DataReader.prototype.readClearString = function(len) {
        if (-1 == len) return null;
        if (0 == len) return "";
        var rawArray = this.readBytes(len);
        return this.decodeUTF8(rawArray);
      };
      DataReader.prototype.readRawArray = function(type) {
        var len = this.readInt();
        var array = [];
        for (var i = 0; i < len; i++) array.push(this.readRawValue(type));
        return array;
      };
      DataReader.prototype.readObjectArray = function(eId) {
        var len = this.readInt();
        var array = [];
        for (var i = 0; i < len; i++) array.push(this.readEntity(eId));
        return array;
      };
      DataReader.prototype.readRawValue = function(type) {
        switch (type) {
         case DataTypes_1.DataTypes.BYTE:
          return this.readByte();

         case DataTypes_1.DataTypes.BOOLEAN:
          return this.readBool();

         case DataTypes_1.DataTypes.INTEGER:
          return this.readInt();

         case DataTypes_1.DataTypes.LONGLONG:
          return this.readLong();

         case DataTypes_1.DataTypes.FLOAT:
          return this.readFloat();

         case DataTypes_1.DataTypes.DOUBLE:
          return this.readDouble();

         case DataTypes_1.DataTypes.STRING:
          return this.readString();
        }
        throw new Error("Unsupported type " + type);
      };
      DataReader.prototype.readEntity = function(eId) {
        var _eId = this.readInt();
        if (-1 == _eId || void 0 !== eId && _eId != eId) return null;
        var entity = EntityFabric_1.default.create(_eId);
        entity && entity.read(this);
        return entity;
      };
      DataReader.prototype.decodeUTF8 = function(bytes) {
        var i = 0, s = "";
        while (i < bytes.length) {
          var c = bytes[i++];
          if (c > 127) if (c > 191 && c < 224) {
            if (i >= bytes.length) throw new Error("UTF-8 decode: incomplete 2-byte sequence");
            c = (31 & c) << 6 | 63 & bytes[i++];
          } else if (c > 223 && c < 240) {
            if (i + 1 >= bytes.length) throw new Error("UTF-8 decode: incomplete 3-byte sequence");
            c = (15 & c) << 12 | (63 & bytes[i++]) << 6 | 63 & bytes[i++];
          } else {
            if (!(c > 239 && c < 248)) throw new Error("UTF-8 decode: unknown multibyte start 0x" + c.toString(16) + " at index " + (i - 1));
            if (i + 2 >= bytes.length) throw new Error("UTF-8 decode: incomplete 4-byte sequence");
            c = (7 & c) << 18 | (63 & bytes[i++]) << 12 | (63 & bytes[i++]) << 6 | 63 & bytes[i++];
          }
          if (c <= 65535) s += String.fromCharCode(c); else {
            if (!(c <= 1114111)) throw new Error("UTF-8 decode: code point 0x" + c.toString(16) + " exceeds UTF-16 reach");
            c -= 65536;
            s += String.fromCharCode(c >> 10 | 55296);
            s += String.fromCharCode(1023 & c | 56320);
          }
        }
        return s;
      };
      return DataReader;
    }();
    exports.default = DataReader;
    cc._RF.pop();
  }, {
    "./DataTypes": "DataTypes",
    "./EntityFabric": "EntityFabric"
  } ],
  DataTypes: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e9d28phgE9NSIH205nTg/9A", "DataTypes");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.DataTypes = void 0;
    var DataTypes;
    (function(DataTypes) {
      DataTypes[DataTypes["BYTE"] = 0] = "BYTE";
      DataTypes[DataTypes["BOOLEAN"] = 1] = "BOOLEAN";
      DataTypes[DataTypes["INTEGER"] = 2] = "INTEGER";
      DataTypes[DataTypes["LONGLONG"] = 3] = "LONGLONG";
      DataTypes[DataTypes["FLOAT"] = 4] = "FLOAT";
      DataTypes[DataTypes["DOUBLE"] = 5] = "DOUBLE";
      DataTypes[DataTypes["STRING"] = 6] = "STRING";
    })(DataTypes = exports.DataTypes || (exports.DataTypes = {}));
    cc._RF.pop();
  }, {} ],
  DataWriter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fcc240cSgFJfpPQISXYGoci", "DataWriter");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DataTypes_1 = require("./DataTypes");
    ArrayBuffer.transfer || (ArrayBuffer.transfer = function(oldBuffer, newByteLength) {
      var srcBuffer = Object(oldBuffer);
      var destBuffer = new ArrayBuffer(newByteLength);
      if (!(srcBuffer instanceof ArrayBuffer) || !(destBuffer instanceof ArrayBuffer)) throw new TypeError("Source and destination must be ArrayBuffer instances");
      var copylen = Math.min(srcBuffer.byteLength, destBuffer.byteLength);
      new Uint8Array(destBuffer, 0, copylen).set(new Uint8Array(srcBuffer, 0, copylen));
      return destBuffer;
    });
    var DataWriter = function() {
      function DataWriter() {
        this._arrayBuffer = new ArrayBuffer(32);
        this._dataView = new DataView(this._arrayBuffer);
        this._cursor = 0;
      }
      DataWriter.prototype.checkAndResize = function(length) {
        if (this._cursor + length > this._arrayBuffer.byteLength) {
          this._arrayBuffer = ArrayBuffer.transfer(this._arrayBuffer, this._arrayBuffer.byteLength + 32 * Math.ceil(length / 32));
          this._dataView = new DataView(this._arrayBuffer);
        }
      };
      DataWriter.prototype.writeByte = function(value) {
        this.checkAndResize(1);
        this._dataView.setUint8(this._cursor++, value);
      };
      DataWriter.prototype.writeBool = function(value) {
        value ? this.writeByte(1) : this.writeByte(0);
      };
      DataWriter.prototype.writeInt = function(value) {
        if (-1 == value) this.writeByte(255); else if (value >= 0 && value <= 253) this.writeByte(value); else {
          this.writeByte(254);
          this.checkAndResize(4);
          this._dataView.setUint32(this._cursor, value);
          this._cursor += 4;
        }
      };
      DataWriter.prototype.writeLong = function(value) {
        if (value.equals(bigInt(-1))) this.writeByte(255); else if (value.greaterOrEquals(bigInt(0)) && value.lesserOrEquals(253)) this.writeByte(value.toJSNumber()); else {
          this.writeByte(254);
          this.checkAndResize(8);
          var array = new Uint8Array(this._arrayBuffer, this._cursor, 8);
          var bigIntArray = new Uint8Array(value.toArray(256).value);
          array.set(bigIntArray, 8 - bigIntArray.length);
          this._cursor += 8;
        }
      };
      DataWriter.prototype.writeFloat = function(value) {
        this.checkAndResize(4);
        this._dataView.setFloat32(this._cursor, value);
        this._cursor += 4;
      };
      DataWriter.prototype.writeDouble = function(value) {
        this.checkAndResize(8);
        this._dataView.setFloat64(this._cursor, value);
        this._cursor += 8;
      };
      DataWriter.prototype.writeBytes = function(value) {
        this.writeInt(value.length);
        this.writeRawBytes(value);
      };
      DataWriter.prototype.writeString = function(value) {
        null === value ? this.writeInt(-1) : 0 == value.length ? this.writeInt(0) : this.writeBytes(DataWriter.encodeUTF8(value));
      };
      DataWriter.prototype.writeEnum = function(value) {
        this.writeInt(value);
      };
      DataWriter.prototype.writeRawInt = function(value, full) {
        void 0 === full && (full = true);
        if (full) {
          this.checkAndResize(4);
          this._dataView.setUint32(this._cursor, value);
          this._cursor += 4;
        } else this.writeByte(value);
      };
      DataWriter.prototype.writeRawString = function(value) {
        this.writeRawBytes(DataWriter.encodeUTF8(value));
      };
      DataWriter.prototype.writeRawBytes = function(value) {
        this.checkAndResize(value.length);
        var array = new Uint8Array(this._arrayBuffer, this._cursor, value.length);
        array.set(value);
        this._cursor += value.length;
      };
      DataWriter.prototype.writeRawArray = function(value, type) {
        var _this = this;
        if (!value) {
          this.writeInt(0);
          return;
        }
        this.writeInt(value.length);
        value.forEach(function(v) {
          _this.writeRawValue(v, type);
        });
      };
      DataWriter.prototype.writeObjectArray = function(value) {
        var _this = this;
        if (!value) {
          this.writeInt(0);
          return;
        }
        this.writeInt(value.length);
        value.forEach(function(v) {
          _this.writeEntity(v);
        });
      };
      DataWriter.prototype.writeRawValue = function(value, type) {
        switch (type) {
         case DataTypes_1.DataTypes.BYTE:
          return this.writeByte(value);

         case DataTypes_1.DataTypes.BOOLEAN:
          return this.writeBool(value);

         case DataTypes_1.DataTypes.INTEGER:
          return this.writeInt(value);

         case DataTypes_1.DataTypes.LONGLONG:
          return this.writeLong(value);

         case DataTypes_1.DataTypes.FLOAT:
          return this.writeFloat(value);

         case DataTypes_1.DataTypes.DOUBLE:
          return this.writeDouble(value);

         case DataTypes_1.DataTypes.STRING:
          return this.writeString(value);
        }
      };
      DataWriter.prototype.writeEntity = function(value) {
        if (value) {
          this.writeInt(value.getEId());
          value.write(this);
        } else this.writeInt(-1);
      };
      DataWriter.prototype.getArray = function() {
        return new Uint8Array(this._arrayBuffer, 0, this._cursor);
      };
      DataWriter.encodeUTF8 = function(s) {
        var i = 0, bytes = new Uint8Array(4 * s.length);
        for (var ci = 0; ci != s.length; ci++) {
          var c = s.charCodeAt(ci);
          if (c < 128) {
            bytes[i++] = c;
            continue;
          }
          if (c < 2048) bytes[i++] = c >> 6 | 192; else {
            if (c > 55295 && c < 56320) {
              if (++ci >= s.length) throw new Error("UTF-8 encode: incomplete surrogate pair");
              var c2 = s.charCodeAt(ci);
              if (c2 < 56320 || c2 > 57343) throw new Error("UTF-8 encode: second surrogate character 0x" + c2.toString(16) + " at index " + ci + " out of range");
              c = 65536 + ((1023 & c) << 10) + (1023 & c2);
              bytes[i++] = c >> 18 | 240;
              bytes[i++] = c >> 12 & 63 | 128;
            } else bytes[i++] = c >> 12 | 224;
            bytes[i++] = c >> 6 & 63 | 128;
          }
          bytes[i++] = 63 & c | 128;
        }
        return bytes.subarray(0, i);
      };
      return DataWriter;
    }();
    exports.default = DataWriter;
    cc._RF.pop();
  }, {
    "./DataTypes": "DataTypes"
  } ],
  DefaultButtonWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7b4dbTLnzBL1KecUIFN0wEP", "DefaultButtonWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ButtonWidget_1 = require("./ButtonWidget");
    var Facade_1 = require("../../PureMVC/Facade");
    var MessageConfig_1 = require("../../PureMVC/MessageConfig");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DefaultButtonWidget = function(_super) {
      __extends(DefaultButtonWidget, _super);
      function DefaultButtonWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.active = null;
        _this.disabled = null;
        _this.keyDown = null;
        _this.selected = null;
        _this.hover = null;
        _this.icon = null;
        _this.label = null;
        _this.onSelect = function(button, selected) {};
        return _this;
      }
      DefaultButtonWidget.prototype.onLoad = function() {
        var _this = this;
        _super.prototype.onLoad.call(this);
        this.selected && (this.selected.node.active = false);
        this.hover && (this.hover.node.active = false);
        this.disabled.node.active = false;
        this.keyDown.node.active = false;
        this.onTouchEvent = function(event) {
          if (event == cc.Node.EventType.TOUCH_START) {
            _this.hover && (_this.hover.node.active = false);
            _this.active.node.active = false;
            _this.keyDown.node.active = true;
          } else if (event == cc.Node.EventType.TOUCH_CANCEL) {
            _this.hover && (_this.hover.node.active = false);
            _this.active.node.active = _this.enabled;
            _this.disabled.node.active = !_this.enabled;
            _this.keyDown.node.active = false;
          } else if (event == cc.Node.EventType.TOUCH_END) {
            _this.playClickSound();
            if (_this.hover && _this._isHover) {
              _this.hover.node.active = true;
              _this.active.node.active = false;
              _this.disabled.node.active = false;
              _this.keyDown.node.active = false;
            } else {
              _this.hover && (_this.hover.node.active = false);
              _this.active.node.active = _this.enabled;
              _this.disabled.node.active = !_this.enabled;
              _this.keyDown.node.active = false;
            }
          } else if (event == cc.Node.EventType.MOUSE_ENTER) {
            if (_this.hover && _this._isHover && _this.enabled) {
              _this.hover.node.active = true;
              _this.active.node.active = false;
              _this.disabled.node.active = false;
              _this.keyDown.node.active = false;
            }
          } else if (event == cc.Node.EventType.MOUSE_LEAVE && _this._isHover) {
            _this.hover && (_this.hover.node.active = false);
            _this.active.node.active = _this.enabled;
            _this.disabled.node.active = !_this.enabled;
            _this.keyDown.node.active = false;
          }
        };
      };
      DefaultButtonWidget.prototype.setEnabled = function(isEnabled) {
        if (this.isEnabled() == isEnabled) return;
        this._enabled = isEnabled;
        this.updateEnableImage();
      };
      DefaultButtonWidget.prototype.updateEnableImage = function() {
        this.active.node.active = this._enabled;
        this.disabled.node.active = !this._enabled;
        this.selected && (this.selected.node.active = false);
        !this._enabled && this.hover && (this.hover.node.active = false);
      };
      DefaultButtonWidget.prototype.setSelected = function(isSelected) {
        if (this.isEnabled() == !isSelected) return;
        this._enabled = !isSelected;
        this.active.node.active = !isSelected;
        if (this.selected) {
          this.selected.node.active = isSelected;
          this.disabled.node.active = false;
        } else this.disabled.node.active = isSelected;
        this.onSelect(this, isSelected);
      };
      DefaultButtonWidget.prototype.isEnabled = function() {
        return this._enabled;
      };
      DefaultButtonWidget.prototype.playClickSound = function() {
        Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.PLAY_SOUND, "click");
      };
      __decorate([ property(cc.Sprite) ], DefaultButtonWidget.prototype, "active", void 0);
      __decorate([ property(cc.Sprite) ], DefaultButtonWidget.prototype, "disabled", void 0);
      __decorate([ property(cc.Sprite) ], DefaultButtonWidget.prototype, "keyDown", void 0);
      __decorate([ property(cc.Sprite) ], DefaultButtonWidget.prototype, "selected", void 0);
      __decorate([ property(cc.Sprite) ], DefaultButtonWidget.prototype, "hover", void 0);
      __decorate([ property(cc.Sprite) ], DefaultButtonWidget.prototype, "icon", void 0);
      __decorate([ property(cc.Label) ], DefaultButtonWidget.prototype, "label", void 0);
      DefaultButtonWidget = __decorate([ ccclass ], DefaultButtonWidget);
      return DefaultButtonWidget;
    }(ButtonWidget_1.default);
    exports.default = DefaultButtonWidget;
    cc._RF.pop();
  }, {
    "../../PureMVC/Facade": "Facade",
    "../../PureMVC/MessageConfig": "MessageConfig",
    "./ButtonWidget": "ButtonWidget"
  } ],
  DropSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4f944ff1TVISJHFEPMw1z8Y", "DropSprite");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.DropSprite = void 0;
    var Loader_1 = require("../Utils/Loader");
    var Utils_1 = require("../Utils/Utils");
    var Constants_1 = require("../Constants");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DropSprite = function(_super) {
      __extends(DropSprite, _super);
      function DropSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._currentVector = cc.Vec2.ZERO;
        _this._state = DropSprite_1.State.NONE;
        _this._isFade = false;
        _this._isScale = false;
        _this.speed = 1e3;
        _this.fadeLength = 100;
        _this.scaleFactor = 1;
        _this.delay = 0;
        _this.magnetic = .5;
        _this.onDrop = function() {};
        return _this;
      }
      DropSprite_1 = DropSprite;
      DropSprite.create = function(type, parent, startPosition, targetPosition) {
        var node = new cc.Node();
        parent.addChild(node);
        var dropSprite = node.addComponent(DropSprite_1);
        dropSprite.setType(type);
        dropSprite._startPosition = startPosition;
        dropSprite._targetPosition = targetPosition;
        node.setPosition(startPosition);
        node.opacity = 0;
        return dropSprite;
      };
      DropSprite.prototype.drop = function() {
        var _this = this;
        this.unscheduleAllCallbacks();
        this.scheduleOnce(function() {
          _this.node.opacity = 255;
          _this._state = DropSprite_1.State.DROPPING;
        }, this.delay);
      };
      DropSprite.prototype.setType = function(type) {
        switch (type) {
         case DropSprite_1.Type.COINS:
         case DropSprite_1.Type.WHEEL_COINS:
          var coinPrefab = Loader_1.default.getRes(Constants_1.default.BUNDLE_GENERAL, "csd/Coins", cc.Prefab);
          var coin = cc.instantiate(coinPrefab);
          this.node.addChild(coin);
          coin.getComponent(cc.Animation).play("Coins", .25 * (Utils_1.default.randomMinus1To1() + 1));
          this._isFade = true;
          this._isScale = true;
          this.scaleFactor = .5;
          this._currentVector = new cc.Vec2(Utils_1.default.randomMinus1To1(), Utils_1.default.randomMinus1To1());
        }
      };
      DropSprite.prototype.update = function(dt) {
        if (this._state == DropSprite_1.State.DROPPING) {
          var targetVector = this._targetPosition.sub(this.node.position);
          var lengthSQ = targetVector.magSqr();
          var fadeLengthSQ = this.fadeLength * this.fadeLength;
          var s = this.speed * dt;
          this._currentVector = this._currentVector.normalize().add(targetVector.normalize().mul(this.magnetic));
          var resultVector = this._currentVector.normalize().mul(s);
          this._isFade && lengthSQ <= fadeLengthSQ && (this.node.opacity = 255 * lengthSQ / fadeLengthSQ);
          if (this._isScale) {
            var kSQ = lengthSQ / this._startPosition.sub(this._targetPosition).magSqr();
            this.node.scale = kSQ + this.scaleFactor * (1 - kSQ);
          }
          var slowDown = Math.max(.1, Math.min(1, lengthSQ / fadeLengthSQ));
          this.node.position = this.node.position.add(resultVector.mul(slowDown));
          if (lengthSQ < 100) {
            Utils_1.default.removeFromParent(this.node);
            this.onDrop();
          }
        }
      };
      var DropSprite_1;
      DropSprite = DropSprite_1 = __decorate([ ccclass ], DropSprite);
      return DropSprite;
    }(cc.Component);
    exports.DropSprite = DropSprite;
    (function(DropSprite) {
      var Type;
      (function(Type) {
        Type[Type["COINS"] = 0] = "COINS";
        Type[Type["WHEEL_COINS"] = 1] = "WHEEL_COINS";
      })(Type = DropSprite.Type || (DropSprite.Type = {}));
      var State;
      (function(State) {
        State[State["NONE"] = 0] = "NONE";
        State[State["DROPPING"] = 1] = "DROPPING";
      })(State = DropSprite.State || (DropSprite.State = {}));
    })(DropSprite = exports.DropSprite || (exports.DropSprite = {}));
    exports.DropSprite = DropSprite;
    cc._RF.pop();
  }, {
    "../Constants": "Constants",
    "../Utils/Loader": "Loader",
    "../Utils/Utils": "Utils"
  } ],
  EmulateButtonWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "59d22MPNbpCC6voNzDUTykn", "EmulateButtonWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DefaultButtonWidget_1 = require("../../../../general/script/View/UI/DefaultButtonWidget");
    var Facade_1 = require("../../../../general/script/PureMVC/Facade");
    var Constants_1 = require("../../../../general/script/Constants");
    var MessageConfig_1 = require("../../../../general/script/PureMVC/MessageConfig");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var EmulateButtonWidget = function(_super) {
      __extends(EmulateButtonWidget, _super);
      function EmulateButtonWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.value = "";
        return _this;
      }
      EmulateButtonWidget.prototype.onLoad = function() {
        var _this = this;
        _super.prototype.onLoad.call(this);
        Constants_1.default.isTestServer() ? this.action = function() {
          _this.value.startsWith("UNLOCK_ANIMAL") ? Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.UNLOCK_ANIMAL, _this.value.split(" ")[1]) : _this.value.startsWith("FEED") ? Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ANIMALS_FEED, {
            animalId: _this.value.split(" ")[1],
            skill: parseInt(_this.value.split(" ")[2])
          }) : _this.value.startsWith("ADD_COINS") ? Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ADD_COINS, _this.value.split(" ")[1]) : _this.value.startsWith("ADD_FOODS") ? Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ADD_FOODS, _this.value.split(" ")[1]) : Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.EMULATE_GAME, _this.value);
        } : this.node.active = false;
      };
      __decorate([ property() ], EmulateButtonWidget.prototype, "value", void 0);
      EmulateButtonWidget = __decorate([ ccclass, menu("Slot/EmulateButtonWidget") ], EmulateButtonWidget);
      return EmulateButtonWidget;
    }(DefaultButtonWidget_1.default);
    exports.default = EmulateButtonWidget;
    cc._RF.pop();
  }, {
    "../../../../general/script/Constants": "Constants",
    "../../../../general/script/PureMVC/Facade": "Facade",
    "../../../../general/script/PureMVC/MessageConfig": "MessageConfig",
    "../../../../general/script/View/UI/DefaultButtonWidget": "DefaultButtonWidget"
  } ],
  EntityFabric: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3b942Zlja9P1ZxOhcvzVXFU", "EntityFabric");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CsiUser_1 = require("../csi/Objects/CsiUser");
    var CsiSessionUser_1 = require("../csi/Objects/CsiSessionUser");
    var CsiSlot_1 = require("../csi/Objects/CsiSlot");
    var CsiAnimal_1 = require("../csi/Objects/CsiAnimal");
    var CsiAnimalState_1 = require("../csi/Objects/CsiAnimalState");
    var CsiAnimalState_Unavailable_1 = require("../csi/Objects/CsiAnimalState_Unavailable");
    var CsiAnimalState_Locked_1 = require("../csi/Objects/CsiAnimalState_Locked");
    var CsiAnimalState_Available_1 = require("../csi/Objects/CsiAnimalState_Available");
    var CsiAnimalSkill_1 = require("../csi/Objects/CsiAnimalSkill");
    var CsiAnimalSkill_Upgrade_1 = require("../csi/Objects/CsiAnimalSkill_Upgrade");
    var EntityFabric = function() {
      function EntityFabric() {}
      EntityFabric.create = function(eId) {
        switch (eId) {
         case CsiUser_1.default.ID:
          return new CsiUser_1.default();

         case CsiSessionUser_1.default.ID:
          return new CsiSessionUser_1.default();

         case CsiSlot_1.default.ID:
          return new CsiSlot_1.default();

         case CsiAnimal_1.default.ID:
          return new CsiAnimal_1.default();

         case CsiAnimalState_1.default.ID:
          return new CsiAnimalState_1.default();

         case CsiAnimalState_Unavailable_1.default.ID:
          return new CsiAnimalState_Unavailable_1.default();

         case CsiAnimalState_Locked_1.default.ID:
          return CsiAnimalState_Locked_1.default.INSTANCE;

         case CsiAnimalState_Available_1.default.ID:
          return new CsiAnimalState_Available_1.default();

         case CsiAnimalSkill_1.default.ID:
          return new CsiAnimalSkill_1.default();

         case CsiAnimalSkill_Upgrade_1.default.ID:
          return new CsiAnimalSkill_Upgrade_1.default();

         case -1:
          return null;

         default:
          throw new Error("Unknown entity id " + eId);
        }
      };
      return EntityFabric;
    }();
    exports.default = EntityFabric;
    cc._RF.pop();
  }, {
    "../csi/Objects/CsiAnimal": "CsiAnimal",
    "../csi/Objects/CsiAnimalSkill": "CsiAnimalSkill",
    "../csi/Objects/CsiAnimalSkill_Upgrade": "CsiAnimalSkill_Upgrade",
    "../csi/Objects/CsiAnimalState": "CsiAnimalState",
    "../csi/Objects/CsiAnimalState_Available": "CsiAnimalState_Available",
    "../csi/Objects/CsiAnimalState_Locked": "CsiAnimalState_Locked",
    "../csi/Objects/CsiAnimalState_Unavailable": "CsiAnimalState_Unavailable",
    "../csi/Objects/CsiSessionUser": "CsiSessionUser",
    "../csi/Objects/CsiSlot": "CsiSlot",
    "../csi/Objects/CsiUser": "CsiUser"
  } ],
  Entity: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3e122ChJrlPA5KUHP9VvIrG", "Entity");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Entity = function() {
      function Entity() {
        this._eId = -1;
      }
      Entity.prototype.setEId = function(value) {
        this._eId = value;
      };
      Entity.prototype.getEId = function() {
        return this._eId;
      };
      Entity.prototype.write = function(writer) {};
      Entity.prototype.read = function(reader) {};
      return Entity;
    }();
    exports.default = Entity;
    cc._RF.pop();
  }, {} ],
  FacadeCommand: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dcad1sGFgZHdq8rbO1YG/bQ", "FacadeCommand");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var FacadeCommand = function() {
      function FacadeCommand() {}
      FacadeCommand.prototype.execute = function(notification) {
        void 0 === notification && (notification = null);
      };
      return FacadeCommand;
    }();
    exports.default = FacadeCommand;
    cc._RF.pop();
  }, {} ],
  Facade: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b5137cxyH9HX7XvZWwl6RYm", "Facade");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Notification_1 = require("./Notification");
    var FacadeCommand_1 = require("./FacadeCommand");
    var Mediator_1 = require("./Mediator");
    var Proxy_1 = require("./Proxy");
    var Facade = function() {
      function Facade() {
        this.name = "Facade";
        this.proxyDict = null;
        this.mediatorDict = null;
        this.commandDict = null;
        this.proxyDict = new cc.Object();
        this.mediatorDict = new cc.Object();
        this.commandDict = new cc.Object();
      }
      Facade.getInstance = function() {
        return this._instance || (this._instance = new this());
      };
      Facade.prototype.delete = function() {
        delete this.proxyDict;
        delete this.mediatorDict;
        delete this.commandDict;
      };
      Facade.prototype.registerProxy = function(proxy) {
        var value = this.proxyDict[proxy.NAME()];
        void 0 != value && value instanceof Proxy_1.default && this.removeProxy(value.NAME());
        proxy.onRegister();
        this.proxyDict[proxy.NAME()] = proxy;
      };
      Facade.prototype.retrieveProxy = function(type) {
        var value = this.proxyDict[type.prototype.NAME()];
        if (void 0 != value) return value;
        return;
      };
      Facade.prototype.removeProxy = function(proxyName) {
        var value = this.proxyDict[proxyName];
        if (void 0 != value && value instanceof Proxy_1.default) {
          delete this.proxyDict[proxyName];
          value.setDeleted();
          value.onRemove();
        }
      };
      Facade.prototype.removeAllProxy = function() {
        for (var key in this.proxyDict) {
          var value = this.proxyDict[key];
          value instanceof Proxy_1.default && this.removeProxy(key);
        }
      };
      Facade.prototype.initProxyData = function() {
        for (var key in this.proxyDict) {
          var value = this.proxyDict[key];
          value instanceof Proxy_1.default && value.initData();
        }
      };
      Facade.prototype.registerMediator = function(mediator) {
        var value = this.mediatorDict[mediator.NAME()];
        void 0 != value && value instanceof Mediator_1.default && this.removeMediator(value.NAME());
        this.mediatorDict[mediator.NAME()] = mediator;
        mediator.listNotificationInterests();
        mediator.registerObserver();
        mediator.onRegister();
      };
      Facade.prototype.retrieveMediator = function(type) {
        var value = this.mediatorDict[type.prototype.NAME()];
        if (void 0 != value) return value;
        return;
      };
      Facade.prototype.retrieveMediatorByName = function(name) {
        var value = this.mediatorDict[name];
        if (void 0 != value) return value;
        return;
      };
      Facade.prototype.removeMediator = function(mediatorName) {
        var value = this.mediatorDict[mediatorName];
        if (void 0 != value && value instanceof Mediator_1.default) {
          delete this.mediatorDict[mediatorName];
          value.removeAllObservers();
          value.setDeleted();
          value.onRemove();
        }
      };
      Facade.prototype.removeAllMediators = function() {
        for (var key in this.mediatorDict) {
          var value = this.mediatorDict[key];
          value instanceof Mediator_1.default && value.removeAllObservers();
        }
        for (var key in this.mediatorDict) {
          var value = this.mediatorDict[key];
          value instanceof Mediator_1.default && this.removeMediator(key);
        }
      };
      Facade.prototype.registerCommand = function(command, name) {
        var value = this.commandDict[name];
        void 0 != value && value instanceof FacadeCommand_1.default && this.removeCommand(name);
        this.commandDict[name] = command;
      };
      Facade.prototype.removeCommand = function(commandName) {
        var value = this.commandDict[commandName];
        void 0 != value && value instanceof FacadeCommand_1.default && delete this.commandDict[commandName];
      };
      Facade.prototype.removeAllCommands = function() {
        for (var key in this.commandDict) {
          var value = this.commandDict[key];
          value instanceof FacadeCommand_1.default && this.removeCommand(key);
        }
      };
      Facade.prototype.sendNotification = function(notificationName, body) {
        void 0 === body && (body = null);
        var notification = new Notification_1.default();
        notification.notificationName = notificationName;
        notification.body = body;
        var command = this.commandDict[notificationName];
        void 0 != command && command instanceof FacadeCommand_1.default && command.execute(notification);
        for (var key in this.mediatorDict) {
          var value = this.mediatorDict[key];
          value instanceof Mediator_1.default && value.postNotification(notification);
        }
      };
      return Facade;
    }();
    exports.default = Facade;
    cc._RF.pop();
  }, {
    "./FacadeCommand": "FacadeCommand",
    "./Mediator": "Mediator",
    "./Notification": "Notification",
    "./Proxy": "Proxy"
  } ],
  GetStartUpData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6335oAZVxJq7KuA1sbSPsc", "GetStartUpData");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Facade_1 = require("../../PureMVC/Facade");
    var FacadeCommand_1 = require("../../PureMVC/FacadeCommand");
    var MessageConfig_1 = require("../../PureMVC/MessageConfig");
    var GetStartUpData = function(_super) {
      __extends(GetStartUpData, _super);
      function GetStartUpData() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "GetStartUpData";
        return _this;
      }
      GetStartUpData.prototype.execute = function(notification) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.GET_USER);
            return [ 2 ];
          });
        });
      };
      return GetStartUpData;
    }(FacadeCommand_1.default);
    exports.default = GetStartUpData;
    cc._RF.pop();
  }, {
    "../../PureMVC/Facade": "Facade",
    "../../PureMVC/FacadeCommand": "FacadeCommand",
    "../../PureMVC/MessageConfig": "MessageConfig"
  } ],
  GetUser: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c6783/4ZytKgaWkTeHuip23", "GetUser");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var FacadeCommand_1 = require("../../../PureMVC/FacadeCommand");
    var SessionService_1 = require("../../../Proxy/Interfaces/SessionService");
    var MainScenePreloaderMediator_1 = require("../../../Mediator/MainScenePreloaderMediator");
    var Facade_1 = require("../../../PureMVC/Facade");
    var SessionUserProxy_1 = require("../../../Proxy/SessionUserProxy");
    var MessageConfig_1 = require("../../../PureMVC/MessageConfig");
    var Utils_1 = require("../../../Utils/Utils");
    var GetUser = function(_super) {
      __extends(GetUser, _super);
      function GetUser() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "Session_GetUser";
        return _this;
      }
      GetUser.prototype.execute = function(notification) {
        notification.notificationName.startsWith("callback_") ? this.fromServer(notification.body) : this.toServer(notification.body);
      };
      GetUser.prototype.toServer = function(body) {
        SessionService_1.default.getUser();
      };
      GetUser.prototype.fromServer = function(body) {
        MainScenePreloaderMediator_1.default.ConnectionAttempts = 5;
        var sessionUser = SessionService_1.default.getUserResult(body);
        Facade_1.default.getInstance().retrieveProxy(SessionUserProxy_1.default).setUserModel(sessionUser);
        Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ON_LOGIN_OK);
        Utils_1.default.dvdSetUserId(sessionUser.id.toString());
        Utils_1.default.dvdSetCurrentLevel(sessionUser.level);
      };
      return GetUser;
    }(FacadeCommand_1.default);
    exports.default = GetUser;
    cc._RF.pop();
  }, {
    "../../../Mediator/MainScenePreloaderMediator": "MainScenePreloaderMediator",
    "../../../Proxy/Interfaces/SessionService": "SessionService",
    "../../../Proxy/SessionUserProxy": "SessionUserProxy",
    "../../../PureMVC/Facade": "Facade",
    "../../../PureMVC/FacadeCommand": "FacadeCommand",
    "../../../PureMVC/MessageConfig": "MessageConfig",
    "../../../Utils/Utils": "Utils"
  } ],
  ISocial: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "39364bEagJOyo107Tkyx+XV", "ISocial");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.emptyProductName = exports.emptyProduct = exports.CsiSessionExternalProfileType = void 0;
    var CsiSessionExternalProfileType;
    (function(CsiSessionExternalProfileType) {
      CsiSessionExternalProfileType[CsiSessionExternalProfileType["FACEBOOK"] = 0] = "FACEBOOK";
    })(CsiSessionExternalProfileType = exports.CsiSessionExternalProfileType || (exports.CsiSessionExternalProfileType = {}));
    var emptyProduct = function() {
      return {
        name: "",
        id: "",
        title: "",
        transactionID: "",
        priceValue: 0,
        price: "",
        description: "",
        currencyCode: "",
        receipt: "",
        receiptCipheredPayload: "",
        itemId: 0,
        market: 0
      };
    };
    exports.emptyProduct = emptyProduct;
    var emptyProductName = function(name, itemId) {
      return {
        name: name,
        id: "",
        title: "",
        transactionID: "",
        priceValue: 0,
        price: "",
        description: "",
        currencyCode: "",
        receipt: "",
        receiptCipheredPayload: "",
        itemId: itemId,
        market: 0
      };
    };
    exports.emptyProductName = emptyProductName;
    cc._RF.pop();
  }, {} ],
  LayoutSpacingWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eb46a2B3UFETqt8r4ma1KW2", "LayoutSpacingWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode;
    var LayoutSpacingWidget = function(_super) {
      __extends(LayoutSpacingWidget, _super);
      function LayoutSpacingWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.layout = null;
        _this.minimalSpacing = 0;
        return _this;
      }
      LayoutSpacingWidget.prototype.onLoad = function() {
        this.addChildrenEventListeners();
        this.updateLayoutSpacing();
      };
      LayoutSpacingWidget.prototype.onDestroy = function() {
        this.removeChildrenEventListeners();
      };
      LayoutSpacingWidget.prototype.onFocusInEditor = function() {
        this.updateAlignment();
      };
      LayoutSpacingWidget.prototype.onLostFocusInEditor = function() {
        this.updateAlignment();
      };
      LayoutSpacingWidget.prototype.updateAlignment = function() {
        _super.prototype.updateAlignment.call(this);
        this.updateLayoutSpacing();
      };
      LayoutSpacingWidget.prototype.childAdded = function() {
        this.addChildrenEventListeners();
        this.updateAlignment();
      };
      LayoutSpacingWidget.prototype.childRemoved = function() {
        this.addChildrenEventListeners();
        this.updateAlignment();
      };
      LayoutSpacingWidget.prototype.addChildrenEventListeners = function() {
        var _this = this;
        if (!this.layout || !this.layout.node || !this.layout.node.isValid) return;
        this.removeChildrenEventListeners();
        this.layout.node.on("child-added", this.childAdded, this);
        this.layout.node.on("child-removed", this.childRemoved, this);
        this.layout.node.on("size-changed", this.updateAlignment, this);
        this.layout.node.children.forEach(function(child) {
          child.on("active-in-hierarchy-changed", _this.updateAlignment, _this);
        });
      };
      LayoutSpacingWidget.prototype.removeChildrenEventListeners = function() {
        var _this = this;
        if (!this.layout || !this.layout.node || !this.layout.node.isValid) return;
        this.layout.node.off("child-added", this.childAdded, this);
        this.layout.node.off("child-removed", this.childRemoved, this);
        this.layout.node.off("size-changed", this.updateAlignment, this);
        this.layout.node.children.forEach(function(child) {
          child.off("active-in-hierarchy-changed", _this.updateAlignment, _this);
        });
      };
      LayoutSpacingWidget.prototype.updateLayoutSpacing = function(notUpdateLayout) {
        if (!this.layout || !this.layout.node || !this.layout.node.isValid) return;
        if (this.layout.type == cc.Layout.Type.HORIZONTAL) {
          var children = this.layout.node.children;
          var count = _.sumBy(children, function(child) {
            return child.active ? 1 : 0;
          });
          var width = _.sumBy(children, function(child) {
            return child.active ? child.width : 0;
          });
          var allSpacing = this.node.width - width - this.layout.paddingLeft - this.layout.paddingRight;
          this.layout.spacingX = Math.max(this.minimalSpacing, allSpacing / Math.max(count - 1, 1));
          notUpdateLayout || this.layout.updateLayout();
        } else if (this.layout.type == cc.Layout.Type.VERTICAL) {
          var children = this.layout.node.children;
          var count = _.sumBy(children, function(child) {
            return child.active ? 1 : 0;
          });
          var height = _.sumBy(children, function(child) {
            return child.active ? child.height : 0;
          });
          var allSpacing = this.node.height - height - this.layout.paddingTop - this.layout.paddingBottom;
          this.layout.spacingY = Math.max(this.minimalSpacing, allSpacing / Math.max(count - 1, 1));
          notUpdateLayout || this.layout.updateLayout();
        }
      };
      __decorate([ property(cc.Layout) ], LayoutSpacingWidget.prototype, "layout", void 0);
      __decorate([ property() ], LayoutSpacingWidget.prototype, "minimalSpacing", void 0);
      LayoutSpacingWidget = __decorate([ ccclass, executeInEditMode ], LayoutSpacingWidget);
      return LayoutSpacingWidget;
    }(cc.Widget);
    exports.default = LayoutSpacingWidget;
    cc._RF.pop();
  }, {} ],
  Loader: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b5533c6JnxIJ5m1EGA32h/e", "Loader");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var MainScene_1 = require("../Scene/MainScene");
    var Loader = function() {
      function Loader() {}
      Loader.loadRes = function(bundleName, url, type) {
        return new Promise(function(resolve) {
          var bundle = cc.assetManager.getBundle(bundleName);
          if (bundle) {
            MainScene_1.default.log("LOADER LOAD RES: " + bundleName + ": " + url);
            bundle.load(url, type, function(error, resource) {
              if (error) {
                MainScene_1.default.log("LOADER ERROR: " + bundleName + ": " + url + ". " + error.message);
                resolve(null);
              } else resolve(resource);
            });
          } else resolve(null);
        });
      };
      Loader.loadResAsync = function(bundleName, url, type, completeCallback) {
        var promise = new Promise(function(resolve) {
          var bundle = cc.assetManager.getBundle(bundleName);
          if (bundle) {
            MainScene_1.default.log("LOADER LOAD RES: " + bundleName + ": " + url);
            bundle.load(url, type, function(error, resource) {
              if (error) {
                MainScene_1.default.log("LOADER ERROR: " + bundleName + ": " + url + ". " + error.message);
                resolve(null);
              } else resolve(resource);
            });
          } else resolve(null);
        });
        promise.then(completeCallback);
      };
      Loader.loadResDirAsync = function(bundleName, url, progressCallback, completeCallback) {
        var promise = new Promise(function(resolve) {
          var bundle = cc.assetManager.getBundle(bundleName);
          if (bundle) {
            MainScene_1.default.log("LOADER LOAD DIR: " + bundleName + ": " + url);
            bundle.loadDir(url, function(completedCount, totalCount, item) {
              progressCallback(completedCount, totalCount, item);
            }, function(error, resource) {
              if (error) {
                MainScene_1.default.log("LOADER ERROR: " + bundleName + ": " + url + ". " + error.message);
                resolve(null);
              } else resolve(resource);
            });
          } else resolve(null);
        });
        promise.then(completeCallback);
      };
      Loader.getRes = function(bundleName, url, type) {
        var bundle = cc.assetManager.getBundle(bundleName);
        if (bundle) {
          var asset = bundle.get(url, type);
          if (asset) return asset;
        }
        return null;
      };
      Loader.releaseAsset = function(bundleName, url) {
        var bundle = cc.assetManager.getBundle(bundleName);
        if (bundle) {
          bundle.release(url);
          MainScene_1.default.log("RELEASE ASSET: " + bundle + ": " + url);
        }
      };
      Loader.releaseBundle = function(bundleName) {
        var bundle = cc.assetManager.getBundle(bundleName);
        if (bundle) {
          bundle.releaseAll();
          MainScene_1.default.log("RELEASE BUNDLE: " + bundleName);
        }
      };
      return Loader;
    }();
    exports.default = Loader;
    cc._RF.pop();
  }, {
    "../Scene/MainScene": "MainScene"
  } ],
  Login: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b1a5cwbcjxHjZJoji94WYq2", "Login");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Facade_1 = require("../../PureMVC/Facade");
    var FacadeCommand_1 = require("../../PureMVC/FacadeCommand");
    var ServerProxy_1 = require("../../Proxy/ServerProxy");
    var Login = function(_super) {
      __extends(Login, _super);
      function Login() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "Login";
        return _this;
      }
      Login.prototype.execute = function(notification) {
        Facade_1.default.getInstance().retrieveProxy(ServerProxy_1.default).login();
      };
      return Login;
    }(FacadeCommand_1.default);
    exports.default = Login;
    cc._RF.pop();
  }, {
    "../../Proxy/ServerProxy": "ServerProxy",
    "../../PureMVC/Facade": "Facade",
    "../../PureMVC/FacadeCommand": "FacadeCommand"
  } ],
  MainSceneMediator: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "74a65y73S1IeJpRhRaDoJug", "MainSceneMediator");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Mediator_1 = require("../PureMVC/Mediator");
    var MainScene_1 = require("../Scene/MainScene");
    var Loader_1 = require("../Utils/Loader");
    var Facade_1 = require("../PureMVC/Facade");
    var MessageConfig_1 = require("../PureMVC/MessageConfig");
    var Utils_1 = require("../Utils/Utils");
    var Constants_1 = require("../Constants");
    var MainSceneMediator = function(_super) {
      __extends(MainSceneMediator, _super);
      function MainSceneMediator() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._timer = null;
        _this._timeLeft = 0;
        return _this;
      }
      MainSceneMediator.NAME = function() {
        return "MainSceneMediator";
      };
      MainSceneMediator.prototype.NAME = function() {
        return MainSceneMediator.NAME();
      };
      MainSceneMediator.prototype.onRegister = function() {
        var _this = this;
        var prefab = Loader_1.default.getRes(Constants_1.default.BUNDLE_GENERAL, "csd/MainSceneLocal", cc.Prefab);
        this.content = cc.instantiate(prefab);
        cc.director.getScene().getChildByName("Canvas").getComponent(MainScene_1.default).content.addChild(this.content);
        this._timer = new Constants_1.TimerObject(1e3, function(dt) {
          _this._timeLeft -= dt;
          MainScene_1.default.showErrorMessage(true, "The server will be stopped in " + Utils_1.default.numToTimeStr(Math.max(_this._timeLeft, 0)), true);
          _this._timeLeft <= 0 && _this._timer.stop();
        });
      };
      MainSceneMediator.prototype.onRemove = function() {
        this._timer.stop();
        this.content && Utils_1.default.removeFromParent(this.content);
      };
      MainSceneMediator.prototype.listNotificationInterests = function() {
        this.notificationInterests = [ MessageConfig_1.default.ON_DISCONNECT, MessageConfig_1.default.ON_LOGIN_FAIL, MessageConfig_1.default.ON_SHUTDOWN ];
      };
      MainSceneMediator.prototype.handleNotification = function(notification) {
        if (notification.notificationName == MessageConfig_1.default.ON_DISCONNECT || notification.notificationName == MessageConfig_1.default.ON_LOGIN_FAIL) Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.START_UP); else if (notification.notificationName == MessageConfig_1.default.ON_SHUTDOWN) {
          this._timeLeft = notification.body;
          this._timer.start();
        }
      };
      return MainSceneMediator;
    }(Mediator_1.default);
    exports.default = MainSceneMediator;
    cc._RF.pop();
  }, {
    "../Constants": "Constants",
    "../PureMVC/Facade": "Facade",
    "../PureMVC/Mediator": "Mediator",
    "../PureMVC/MessageConfig": "MessageConfig",
    "../Scene/MainScene": "MainScene",
    "../Utils/Loader": "Loader",
    "../Utils/Utils": "Utils"
  } ],
  MainScenePreloaderMediator: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e7944NQ5cZLhIBLf427o+ep", "MainScenePreloaderMediator");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Facade_1 = require("../PureMVC/Facade");
    var Mediator_1 = require("../PureMVC/Mediator");
    var MainScene_1 = require("../Scene/MainScene");
    var MessageConfig_1 = require("../PureMVC/MessageConfig");
    var ProgressBarWidget_1 = require("../View/UI/ProgressBarWidget");
    var Loader_1 = require("../Utils/Loader");
    var Utils_1 = require("../Utils/Utils");
    var ServerProxy_1 = require("../Proxy/ServerProxy");
    var Constants_1 = require("../Constants");
    var SocialProxy_1 = require("../Proxy/SocialProxy");
    var MainScenePreloaderMediator = function(_super) {
      __extends(MainScenePreloaderMediator, _super);
      function MainScenePreloaderMediator() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._bundles = [];
        _this._assets = [];
        _this._assetsLoaded = [];
        _this._dirsLoaded = 0;
        _this._percent = 0;
        _this._errorCount = 0;
        _this._isErrorShowed = false;
        return _this;
      }
      MainScenePreloaderMediator.NAME = function() {
        return "MainScenePreloaderMediator";
      };
      MainScenePreloaderMediator.prototype.NAME = function() {
        return MainScenePreloaderMediator.NAME();
      };
      MainScenePreloaderMediator.prototype.onRegister = function() {
        var _this = this;
        this._bundles = [ {
          bundleName: Constants_1.default.BUNDLE_GENERAL,
          dirs: [ "textures", "csd" ],
          configLoaded: false,
          bundleLoaded: false,
          json: null
        }, {
          bundleName: Constants_1.default.BUNDLE_LOBBY,
          dirs: [ "textures", "csd" ],
          configLoaded: false,
          bundleLoaded: false,
          json: null
        }, {
          bundleName: Constants_1.default.BUNDLE_SLOTS,
          dirs: [ "textures", "csd" ],
          configLoaded: false,
          bundleLoaded: false,
          json: null
        }, {
          bundleName: Constants_1.default.BUNDLE_ANIMALS,
          dirs: [ "textures", "csd" ],
          configLoaded: false,
          bundleLoaded: false,
          json: null
        } ];
        this._assets = [];
        this._assetsLoaded = [];
        this._bundles.forEach(function(b) {
          b.dirs.forEach(function(d) {
            _this._assets.push(-1);
            _this._assetsLoaded.push(0);
          });
        });
        var prefab = Loader_1.default.getRes(Constants_1.default.BUNDLE_GENERAL, "csd/PreloaderSceneLocal", cc.Prefab);
        if (!prefab) {
          MainScene_1.default.showErrorMessage(true);
          return;
        }
        this.content = cc.instantiate(prefab);
        this.content.zIndex = Constants_1.default.Z_PRELOADER;
        cc.director.getScene().getChildByName("Canvas").getComponent(MainScene_1.default).content.addChild(this.content);
        Utils_1.default.getChild("layout", this.content).on("touchend", function() {});
        Utils_1.default.getChildComponent(cc.Label, "version", this.content).string = void 0 !== window["csiVersion"] ? "v" + window["csiVersion"] : "";
        this._progressBar = Utils_1.default.getChild("progress", this.content).getComponent(ProgressBarWidget_1.default);
        this._progressBar.setProgress(0, true);
        this._progressBar.onComplete = function() {
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.START_UP);
        };
        MainScene_1.default.widget.schedule(function() {
          var socialProxy = Facade_1.default.getInstance().retrieveProxy(SocialProxy_1.default);
          if (socialProxy && socialProxy.getSocial()) {
            MainScene_1.default.widget.unscheduleAllCallbacks();
            if (MainScenePreloaderMediator.ConnectionAttempts > 0) {
              Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ASSETS_UPDATE_PROGRESS, .01);
              Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.LOGIN);
            } else MainScene_1.default.showErrorMessage(true);
          }
        }, .1);
      };
      MainScenePreloaderMediator.prototype.onRemove = function() {
        var _this = this;
        if (this.content) {
          cc.tween(this.content).delay(.2).to(.3, {
            opacity: 0
          }).start();
          var obj = new cc.Object();
          cc.tween(obj).delay(.5).call(function() {
            Utils_1.default.removeFromParent(_this.content);
          }).start();
        }
      };
      MainScenePreloaderMediator.prototype.listNotificationInterests = function() {
        this.notificationInterests = [ MessageConfig_1.default.ON_LOGIN_OK, MessageConfig_1.default.ON_LOGIN_FAIL, MessageConfig_1.default.ASSETS_UPDATE_PROGRESS, MessageConfig_1.default.ASSETS_UPDATE_OK, MessageConfig_1.default.ASSETS_RELOADED, MessageConfig_1.default.ON_DISCONNECT ];
      };
      MainScenePreloaderMediator.prototype.handleNotification = function(notification) {
        var _this = this;
        if (this._isErrorShowed) return;
        if (notification.notificationName == MessageConfig_1.default.ON_LOGIN_OK) {
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ASSETS_UPDATE_PROGRESS, .02);
          this._progressBar.onComplete = function() {
            _this._bundles.forEach(function(bundle) {
              var initClass = cc.js.getClassByName("Init" + (bundle.bundleName && bundle.bundleName[0].toUpperCase() + bundle.bundleName.slice(1)));
              initClass && initClass.prototype.constructor();
            });
            Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.RUN_MAIN_SCENE);
          };
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ASSETS_UPDATE_OK);
        } else if (notification.notificationName == MessageConfig_1.default.ASSETS_UPDATE_PROGRESS) {
          0 == notification.body && (this._percent = 0);
          this._percent = Math.max(this._percent, notification.body);
          this._progressBar.setProgress(this._percent);
        } else if (notification.notificationName == MessageConfig_1.default.ASSETS_UPDATE_OK) {
          this._errorCount = 0;
          this._dirsLoaded = 0;
          var dirNumber_1 = 0;
          var loadDirCallback_1 = function(bundleName, dirPath) {
            var index = dirNumber_1;
            dirNumber_1++;
            Loader_1.default.loadResDirAsync(bundleName, dirPath, function(completedCount, totalCount, item) {
              _this._assets[index] < totalCount && (_this._assets[index] = totalCount);
              _this._assetsLoaded[index] = completedCount;
              completedCount > 0 && Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ASSETS_RELOADED, false);
            }, function(resource) {
              if (null == resource) _this._errorCount++; else try {
                _this._assets[index] = resource.length;
                _this._assetsLoaded[index] = resource.length;
              } catch (e) {
                _this._errorCount++;
              }
              _this._assets[index] < 0 && (_this._assets[index] = 0);
              _this._dirsLoaded++;
              Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ASSETS_RELOADED, true);
            });
          };
          var loadBundlesCallback_1 = function() {
            _.filter(_this._bundles, {
              bundleLoaded: true
            }).length == _this._bundles.length && _this._bundles.forEach(function(bundle) {
              var bundleDirs = _.find(_this._bundles, {
                bundleName: bundle.bundleName
              }).dirs;
              for (var d = 0; d < bundleDirs.length; d++) loadDirCallback_1(bundle.bundleName, bundleDirs[d]);
            });
          };
          var loadConfigsCallback_1 = function() {
            if (_.filter(_this._bundles, {
              configLoaded: true
            }).length == _this._bundles.length) {
              var _loop_2 = function(i) {
                var bundle = _this._bundles[i];
                if (!bundle.bundleLoaded) {
                  var bundleName_1 = bundle.bundleName;
                  var json = bundle.json;
                  var lastBundleUrl = cc.sys.localStorage.getItem(bundleName_1 + "BundleUrl");
                  if (cc.sys.isNative && lastBundleUrl != json.url) {
                    cc.assetManager.cacheManager.cachedFiles.forEach(function(value, key) {
                      value.bundle == bundleName_1 && cc.assetManager.cacheManager.removeCache(key);
                    });
                    cc.sys.localStorage.setItem(bundleName_1 + "BundleUrl", json.url);
                  }
                  MainScene_1.default.log(bundleName_1 + " start loading");
                  cc.assetManager.loadBundle(json.url, {
                    version: json.hash
                  }, function(err) {
                    if (err) {
                      _this._errorCount++;
                      Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ASSETS_RELOADED, false);
                    } else {
                      _.find(_this._bundles, {
                        bundleName: bundleName_1
                      }).bundleLoaded = true;
                      loadConfigsCallback_1();
                    }
                  });
                  return "break";
                }
              };
              for (var i = 0; i < _this._bundles.length; i++) {
                var state_1 = _loop_2(i);
                if ("break" === state_1) break;
              }
              loadBundlesCallback_1();
            }
          };
          var _loop_1 = function(i) {
            var bundleName = this_1._bundles[i].bundleName;
            var bundle = cc.assetManager.getBundle(bundleName);
            if (bundle) {
              this_1._bundles[i].configLoaded = true;
              this_1._bundles[i].bundleLoaded = true;
              loadBundlesCallback_1();
            } else {
              var loadRemoteConfig_1 = function() {
                var platform = "";
                switch (cc.sys.os) {
                 case cc.sys.OS_ANDROID:
                  platform = "android";
                  break;

                 default:
                  platform = "ios";
                }
                var configUrl = window["configUrl"] + "?platform=" + platform + "&bundle=" + bundleName;
                cc.assetManager.cacheManager.removeCache(configUrl);
                cc.assetManager.loadRemote(configUrl, {
                  ext: ".json",
                  priority: 200 - i
                }, function(err, asset) {
                  if (err) {
                    _this._errorCount++;
                    Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ASSETS_RELOADED, false);
                  } else {
                    var bundle_1 = _.find(_this._bundles, {
                      bundleName: bundleName
                    });
                    bundle_1.json = asset.json;
                    bundle_1.configLoaded = true;
                    MainScene_1.default.log(bundleName + " config loaded: " + JSON.stringify(bundle_1.json));
                    loadConfigsCallback_1();
                  }
                });
              };
              cc.sys.isBrowser ? cc.assetManager.loadBundle(bundleName, {
                priority: 100 - i
              }, function(err) {
                if (err) loadRemoteConfig_1(); else {
                  _.find(_this._bundles, {
                    bundleName: bundleName
                  }).configLoaded = true;
                  _.find(_this._bundles, {
                    bundleName: bundleName
                  }).bundleLoaded = true;
                  loadBundlesCallback_1();
                }
              }) : loadRemoteConfig_1();
            }
          };
          var this_1 = this;
          for (var i = 0; i < this._bundles.length; i++) _loop_1(i);
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ASSETS_RELOADED, false);
        } else if (notification.notificationName == MessageConfig_1.default.ASSETS_RELOADED) {
          if (this._errorCount > 0) {
            Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ASSETS_UPDATE_PROGRESS, 0);
            if (MainScenePreloaderMediator.LoadAttempts > 0) {
              MainScenePreloaderMediator.LoadAttempts--;
              Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.START_UP);
            } else this.showError();
            return;
          }
          if (this._assets.indexOf(-1) >= 0 || 1 == this._progressBar.getProgress()) return;
          var loadingDirs = 0;
          for (var i = 0; i < this._assets.length; i++) this._assets[i] >= 0 && loadingDirs++;
          var completedCount = _.sum(this._assetsLoaded);
          var totalCount = Math.max(_.sum(this._assets), 1);
          if (totalCount <= 0 || loadingDirs <= 0) return;
          if (notification.body && this._dirsLoaded == this._assets.length) {
            Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ASSETS_UPDATE_PROGRESS, 1);
            return;
          }
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ASSETS_UPDATE_PROGRESS, Math.min((loadingDirs + completedCount) / (loadingDirs + totalCount), .99));
        } else if (notification.notificationName == MessageConfig_1.default.ON_DISCONNECT || notification.notificationName == MessageConfig_1.default.ON_LOGIN_FAIL) if (MainScenePreloaderMediator.ConnectionAttempts > 0 && MainScenePreloaderMediator.LoadAttempts > 0) {
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.START_UP);
          MainScenePreloaderMediator.ConnectionAttempts--;
        } else this.showError();
      };
      MainScenePreloaderMediator.prototype.showError = function() {
        if (this._isErrorShowed) return;
        this._isErrorShowed = true;
        MainScenePreloaderMediator.ConnectionAttempts = 0;
        MainScenePreloaderMediator.LoadAttempts = 0;
        Facade_1.default.getInstance().retrieveProxy(ServerProxy_1.default).getConnection().close();
        this._progressBar.isAutoprogress = false;
        this._progressBar.setProgress(0);
        this._progressBar.onComplete = function() {};
        MainScene_1.default.showErrorMessage(true);
      };
      MainScenePreloaderMediator.ConnectionAttempts = 5;
      MainScenePreloaderMediator.LoadAttempts = 5;
      return MainScenePreloaderMediator;
    }(Mediator_1.default);
    exports.default = MainScenePreloaderMediator;
    cc._RF.pop();
  }, {
    "../Constants": "Constants",
    "../Proxy/ServerProxy": "ServerProxy",
    "../Proxy/SocialProxy": "SocialProxy",
    "../PureMVC/Facade": "Facade",
    "../PureMVC/Mediator": "Mediator",
    "../PureMVC/MessageConfig": "MessageConfig",
    "../Scene/MainScene": "MainScene",
    "../Utils/Loader": "Loader",
    "../Utils/Utils": "Utils",
    "../View/UI/ProgressBarWidget": "ProgressBarWidget"
  } ],
  MainScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "572afwf3z5FD4LYbNMIdaFS", "MainScene");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Facade_1 = require("../PureMVC/Facade");
    var MessageConfig_1 = require("../PureMVC/MessageConfig");
    var StartUp_1 = require("../Command/StartUp");
    var Utils_1 = require("../Utils/Utils");
    var MainScenePreloaderMediator_1 = require("../Mediator/MainScenePreloaderMediator");
    var ServerProxy_1 = require("../Proxy/ServerProxy");
    var Connection_1 = require("../Utils/biser-legacy/csi/Connection");
    var Constants_1 = require("../Constants");
    var DVD_1 = require("../Utils/DVD");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MainScene = function(_super) {
      __extends(MainScene, _super);
      function MainScene() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.mainContent = null;
        _this.content = null;
        _this.errorMessage = null;
        _this.restart = null;
        return _this;
      }
      MainScene_1 = MainScene;
      MainScene.log = function() {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) arg[_i] = arguments[_i];
        var msg = cc.js.formatStr.apply(null, arguments);
        console.log(msg);
        try {
          if (void 0 !== window["evlog"] && void 0 !== msg && "" != msg) {
            var date = new Date();
            MainScene_1.logMessage.push(date.toISOString() + " : " + msg);
          }
        } catch (e) {}
      };
      MainScene.sendLog = function() {
        try {
          void 0 !== window["evlog"] && void 0 !== MainScene_1.logMessage && MainScene_1.logMessage.length > 0 && window["evlog"].send("game-log", {
            message: _.join(MainScene_1.logMessage, "\n")
          });
          MainScene_1.logMessage = [];
        } catch (e) {}
      };
      MainScene.showErrorMessage = function(isShow, msg, isNotLock) {
        var errorMessage = cc.director.getScene().getChildByName("Canvas").getComponent(MainScene_1).errorMessage;
        errorMessage.active = isShow;
        Utils_1.default.getChild("restart", errorMessage).active = !isNotLock;
        Utils_1.default.getChild("lock", errorMessage).active = !isNotLock;
        Utils_1.default.getChild("fade", errorMessage).opacity = isNotLock ? 50 : 180;
        isShow && (Utils_1.default.getChildComponent(cc.Label, "errorLabel", errorMessage).string = msg || "Server connection error.\nTry restarting the game.");
      };
      MainScene.restart = function() {
        if (cc.sys.isNative) {
          MainScenePreloaderMediator_1.default.ConnectionAttempts = 5;
          Connection_1.default.destroyInstance();
          Facade_1.default.getInstance().removeAllCommands();
          Facade_1.default.getInstance().removeAllMediators();
          Facade_1.default.getInstance().removeAllProxy();
          cc.game.pause();
          cc.game.restart();
        } else window.location.reload();
      };
      MainScene.prototype.onLoad = function() {
        var _this = this;
        MainScene_1.timer.start();
        this.restart.on("touchstart", function(event) {
          this.restart.opacity = 100;
        }, this);
        this.restart.on("touchend", function(event) {
          MainScene_1.sendLog();
          this.restart.active = false;
          MainScene_1.restart();
        }, this);
        this.restart.on("touchcancel", function(event) {
          this.restart.opacity = 255;
        }, this);
        MainScene_1.widget = this;
        window.addEventListener("error", function(e) {
          MainScene_1.sendLog();
          var error = e.error;
          var errorMessage = error ? error.message || error.toString() : e.message;
          if (errorMessage.startsWith("request error")) {
            var serverProxy = Facade_1.default.getInstance().retrieveProxy(ServerProxy_1.default);
            serverProxy && serverProxy.getConnection().close();
            MainScene_1.showErrorMessage(true);
          }
        });
        DVD_1.default.init();
        var errorLock = Utils_1.default.getChild("lock", this.errorMessage);
        errorLock.on("touchend", function() {});
        errorLock.on("mousewheel", function(event) {});
        MainScene_1.showErrorMessage(false);
        MainScenePreloaderMediator_1.default.LoadAttempts = 5;
        cc.view.setResizeCallback(function() {
          _this.resize();
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.DO_LAYOUT);
        });
        this.resize();
        var splash = document.getElementById("splash");
        splash && (splash.style.display = "none");
        Facade_1.default.getInstance().registerCommand(new StartUp_1.default(), MessageConfig_1.default.START_UP);
        Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.START_UP);
      };
      MainScene.prototype.onDestroy = function() {
        MainScene_1.timer.stop();
      };
      MainScene.prototype.resize = function() {
        var scale = cc.view.getCanvasSize().width / MainScene_1.portraitDesignWidth;
        cc.view.enableRetina(true);
        cc.view.setDesignResolutionSize(MainScene_1.portraitDesignWidth, cc.view.getCanvasSize().height / scale, cc.view.getResolutionPolicy());
        var parent = this.mainContent.getParent();
        cc.sys.isNative && parent.getComponent(cc.SafeArea) ? parent.getComponent(cc.SafeArea).updateArea() : parent.getComponent(cc.Widget).updateAlignment();
        var parentSize = parent.getContentSize();
        var size = parentSize;
        if (parentSize.height < MainScene_1.portraitDesignHeight) {
          scale = parentSize.height / MainScene_1.portraitDesignHeight;
          size = cc.size(parentSize.width / scale, MainScene_1.portraitDesignHeight);
        } else {
          scale = parentSize.width / MainScene_1.portraitDesignWidth;
          size = cc.size(MainScene_1.portraitDesignWidth, parentSize.height / scale);
        }
        this.mainContent.setContentSize(size);
        this.mainContent.scale = scale;
        MainScene_1.mainContentScale = this.mainContent.scale;
        MainScene_1.mainContentSize = this.mainContent.getContentSize();
      };
      var MainScene_1;
      MainScene.mainContentScale = 1;
      MainScene.mainContentSize = cc.Size.ZERO;
      MainScene.portraitDesignWidth = 1080;
      MainScene.portraitDesignHeight = 1920;
      MainScene.widget = null;
      MainScene.timer = new Constants_1.TimerObject(6e4, function(dt) {
        MainScene_1.sendLog();
      });
      MainScene.logMessage = [];
      __decorate([ property(cc.Node) ], MainScene.prototype, "mainContent", void 0);
      __decorate([ property(cc.Node) ], MainScene.prototype, "content", void 0);
      __decorate([ property(cc.Node) ], MainScene.prototype, "errorMessage", void 0);
      __decorate([ property(cc.Node) ], MainScene.prototype, "restart", void 0);
      MainScene = MainScene_1 = __decorate([ ccclass ], MainScene);
      return MainScene;
    }(cc.Component);
    exports.default = MainScene;
    cc._RF.pop();
  }, {
    "../Command/StartUp": "StartUp",
    "../Constants": "Constants",
    "../Mediator/MainScenePreloaderMediator": "MainScenePreloaderMediator",
    "../Proxy/ServerProxy": "ServerProxy",
    "../PureMVC/Facade": "Facade",
    "../PureMVC/MessageConfig": "MessageConfig",
    "../Utils/DVD": "DVD",
    "../Utils/Utils": "Utils",
    "../Utils/biser-legacy/csi/Connection": "Connection"
  } ],
  Mediator: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "40d5fCiCMFDCo+Y3ndjtU04", "Mediator");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Mediator = function() {
      function Mediator() {
        this.isObserver = false;
        this.deleted = false;
        this.notificationInterests = [];
        this.content = null;
        this.missClick = false;
      }
      Mediator.NAME = function() {
        return "Mediator";
      };
      Mediator.prototype.NAME = function() {
        return Mediator.NAME();
      };
      Mediator.prototype.onRegister = function() {};
      Mediator.prototype.onRemove = function() {};
      Mediator.prototype.startOpen = function() {};
      Mediator.prototype.startClose = function() {};
      Mediator.prototype.listNotificationInterests = function() {};
      Mediator.prototype.handleNotification = function(notification) {};
      Mediator.prototype.registerObserver = function() {
        this.isObserver = true;
      };
      Mediator.prototype.removeAllObservers = function() {
        this.isObserver = false;
      };
      Mediator.prototype.setDeleted = function() {
        this.deleted = true;
      };
      Mediator.prototype.postNotification = function(notification) {
        if (!this.isObserver) return;
        for (var _i = 0, _a = this.notificationInterests; _i < _a.length; _i++) {
          var notificationName = _a[_i];
          if (notificationName == notification.notificationName) {
            this.handleNotification(notification);
            break;
          }
        }
      };
      Mediator.prototype.getSoundSource = function(name) {
        return null;
      };
      return Mediator;
    }();
    exports.default = Mediator;
    cc._RF.pop();
  }, {} ],
  MessageConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "90a59+/Fq1GepATtfu6AvPm", "MessageConfig");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Message = function() {
      function Message() {}
      Message.START_UP = "start_up";
      Message.RUN_MAIN_SCENE_PRELOADER = "run_main_scene_preloader";
      Message.RUN_MAIN_SCENE = "run_main_scene";
      Message.RUN_SLOT_PRELOADER = "run_slot_preloader";
      Message.RUN_SLOT = "run_slot";
      Message.INIT_LOBBY = "init_lobby";
      Message.RUN_LOBBY = "run_lobby";
      Message.LOGIN = "login";
      Message.PING = "ping";
      Message.GET_START_UP_DATA = "get_start_up_data";
      Message.GET_USER = "get_user";
      Message.UP_LEVEL = "up_level";
      Message.ADD_COINS = "add_coins";
      Message.ADD_FOODS = "add_foods";
      Message.GET_LIST = "get_list";
      Message.LAUNCH_GAME = "launch_game";
      Message.ANIMALS_GET_LIST = "animals_get_list";
      Message.ANIMALS_FEED = "animals_feed";
      Message.UNLOCK_ANIMAL = "unlock_animal";
      Message.EXECUTE_GAME_COMMAND = "execute_game_command";
      Message.EMULATE_GAME = "emulate_game";
      Message.ON_LOGIN_OK = "on_login_ok";
      Message.ON_LOGIN_FAIL = "on_login_fail";
      Message.ON_LOGIN_REJECT = "on_login_reject";
      Message.ON_DISCONNECT = "on_disconnect";
      Message.ON_RECONNECT = "on_reconnect";
      Message.ON_SHUTDOWN = "on_shutdown";
      Message.ON_GAME_START_LOADING = "on_game_start_loading";
      Message.ON_GAME_ENTER = "on_game_enter";
      Message.ON_QUEST_ENTER = "on_quest_enter";
      Message.DO_LAYOUT = "do_layout";
      Message.ENTER_BACKGROUND = "enter_background";
      Message.CLIENT_GAME_ACTION = "client_game_action";
      Message.SHOW_POPUP = "show_popup";
      Message.CLOSE_POPUP = "close_popup";
      Message.CLOSE_ALL_POPUP = "close_all_popup";
      Message.REFRESH_CLANS_WINDOW = "refresh_clans_window";
      Message.RESUME_PHASES = "resume_phases";
      Message.SWITCH_LOGIC = "switch_logic";
      Message.SHOW_SLOT_LIST = "show_slot_list";
      Message.SHOW_SHOP = "show_shop";
      Message.SHOW_EVENTS = "show_events";
      Message.SHOW_PETS = "show_pets";
      Message.SHOW_COLLECTIONS = "show_collections";
      Message.ASSETS_UPDATE_PROGRESS = "assets_update_progress";
      Message.ASSETS_UPDATE_OK = "assets_update_ok";
      Message.RELOAD_ASSETS = "reload_assets";
      Message.ASSETS_RELOADED = "assets_reloaded";
      Message.START_ASSETS_RELOAD = "start_assets_reload";
      Message.PLAY_SLOT_SOUND = "play_slot_sound";
      Message.PLAY_SLOT_AUDIO = "play_slot_audio";
      Message.PLAY_SLOT_LOOP_SOUND = "play_slot_loop_sound";
      Message.PAUSE_SLOT_LOOP_SOUND = "pause_slot_loop_sound";
      Message.STOP_SLOT_SOUND = "stop_slot_sound";
      Message.PLAY_SOUND = "play_sound";
      Message.PLAY_LOOP_SOUND = "play_loop_sound";
      Message.STOP_SOUND = "stop_sound";
      Message.PLAY_SLOT_MUSIC = "play_slot_music";
      Message.STOP_SLOT_MUSIC = "stop_slot_music";
      Message.PLAY_MUSIC = "play_music";
      Message.STOP_MUSIC = "stop_music";
      Message.SOUND_MUTE = "sound_mute";
      Message.MUSIC_MUTE = "music_mute";
      Message.STOP_ALL_SOUNDS = "stop_all_sounds";
      Message.STOP_ALL_FX = "stop_all_fx";
      Message.PAUSE_MUSIC = "pause_music";
      Message.RESUME_MUSIC = "resume_music";
      Message.SLOT_SOUND_SET_TIME = "slot_sound_set_time";
      Message.GET_SLOT_SOUND_DURATION = "get_slot_sound_duration";
      Message.IS_SLOT_SOUND_PLAYING = "is_slot_sound_playing";
      Message.IS_SLOT_SOUND_EXIST = "is_slot_sound_exist";
      return Message;
    }();
    exports.default = Message;
    cc._RF.pop();
  }, {} ],
  Notification: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d9851K+liBEaYSOpratS41u", "Notification");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Notification = function() {
      function Notification(notificationName, body) {
        this.notificationName = "";
        this.body = null;
        notificationName && (this.notificationName = notificationName);
        body && (this.body = body);
      }
      return Notification;
    }();
    exports.default = Notification;
    cc._RF.pop();
  }, {} ],
  ParallaxScrollWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b0038VZ5PJGkp8ot4xL/h88", "ParallaxScrollWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ParallaxScrollWidget = function(_super) {
      __extends(ParallaxScrollWidget, _super);
      function ParallaxScrollWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.mainScroll = null;
        _this.scrolls = [];
        return _this;
      }
      ParallaxScrollWidget.prototype.onLoad = function() {
        var _this = this;
        this.mainScroll.node.on("scrolling", function(scrollView) {
          var d = scrollView.content.getContentSize().width - scrollView.node.getContentSize().width;
          var perc = scrollView.content.position.x / d;
          _this.scrolls.forEach(function(scroll) {
            scroll.position = cc.v2((scroll.getContentSize().width - scrollView.node.getContentSize().width) * perc, scroll.position.y);
          });
        });
      };
      __decorate([ property(cc.ScrollView) ], ParallaxScrollWidget.prototype, "mainScroll", void 0);
      __decorate([ property(cc.Node) ], ParallaxScrollWidget.prototype, "scrolls", void 0);
      ParallaxScrollWidget = __decorate([ ccclass ], ParallaxScrollWidget);
      return ParallaxScrollWidget;
    }(cc.Component);
    exports.default = ParallaxScrollWidget;
    cc._RF.pop();
  }, {} ],
  PopupMediator: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1d2a4RtHSZF4IVWuXjf9k+5", "PopupMediator");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Mediator_1 = require("../../PureMVC/Mediator");
    var MainScene_1 = require("../../Scene/MainScene");
    var Loader_1 = require("../../Utils/Loader");
    var Constants_1 = require("../../Constants");
    var MessageConfig_1 = require("../../PureMVC/MessageConfig");
    var Facade_1 = require("../../PureMVC/Facade");
    var Utils_1 = require("../../Utils/Utils");
    var PopupMediator = function(_super) {
      __extends(PopupMediator, _super);
      function PopupMediator() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._popupMediatorClasses = [];
        _this._root = null;
        _this._lock = null;
        _this._missClick = false;
        _this._isAlreadyClosing = false;
        _this._currentMediator = null;
        return _this;
      }
      PopupMediator.NAME = function() {
        return "PopupMediator";
      };
      PopupMediator.prototype.NAME = function() {
        return PopupMediator.NAME();
      };
      PopupMediator.prototype.onRegister = function() {
        var prefab = Loader_1.default.getRes(Constants_1.default.BUNDLE_GENERAL, "csd/Popup", cc.Prefab);
        this.content = cc.instantiate(prefab);
        cc.director.getScene().getChildByName("Canvas").getComponent(MainScene_1.default).content.addChild(this.content, Constants_1.default.Z_POPUP);
        this.content.active = false;
        this._root = Utils_1.default.getChild("root", this.content);
        this._lock = Utils_1.default.getChild("lock", this.content);
        this._lock.zIndex = Constants_1.default.Z_MAX;
      };
      PopupMediator.prototype.onRemove = function() {
        this.content && Utils_1.default.removeFromParent(this.content);
      };
      PopupMediator.prototype.listNotificationInterests = function() {
        this.notificationInterests = [ MessageConfig_1.default.SHOW_POPUP, MessageConfig_1.default.CLOSE_POPUP, MessageConfig_1.default.CLOSE_ALL_POPUP ];
      };
      PopupMediator.prototype.handleNotification = function(notification) {
        if (notification.notificationName == MessageConfig_1.default.SHOW_POPUP) {
          this._popupMediatorClasses.push(notification.body);
          1 == this._popupMediatorClasses.length && this.nextPopup();
        } else if (notification.notificationName == MessageConfig_1.default.CLOSE_POPUP) this.close(); else if (notification.notificationName == MessageConfig_1.default.CLOSE_ALL_POPUP) {
          if (this._popupMediatorClasses.length > 1) {
            var oldPopupMediatorClasses = this._popupMediatorClasses;
            this._popupMediatorClasses = [];
            this._popupMediatorClasses.push(oldPopupMediatorClasses[0]);
          }
          this.close();
        }
      };
      PopupMediator.prototype.isPopupShown = function() {
        return null != this._currentMediator;
      };
      PopupMediator.prototype.nextPopup = function() {
        var _this = this;
        if (0 == this._popupMediatorClasses.length) return;
        var mediatorClass = this._popupMediatorClasses[0];
        this._currentMediator = new mediatorClass();
        Facade_1.default.getInstance().registerMediator(this._currentMediator);
        if (!this._currentMediator.content) {
          if (this._popupMediatorClasses.length > 0) {
            Facade_1.default.getInstance().removeMediator(this._popupMediatorClasses[0].NAME());
            this._popupMediatorClasses.shift();
          }
          this.nextPopup();
          return;
        }
        this._root.addChild(this._currentMediator.content);
        this._missClick = this._currentMediator.missClick;
        this._currentMediator.startOpen();
        this.content.active = true;
        this._currentMediator.content.scale = 1;
        var topPanel = Utils_1.default.getChild("top-panel", this._currentMediator.content);
        topPanel && (this._currentMediator.content.scale = MainScene_1.default.portraitDesignWidth / topPanel.width);
        this.content.opacity = 0;
        cc.tween(this.content).stop().delay(.05).to(.3, {
          opacity: 255
        }).call(function() {
          _this.onIn();
        }).start();
        this.setLocked(true);
      };
      PopupMediator.prototype.onIn = function() {
        this.setLocked(false);
        var missClick = this._missClick;
        this._root.on("touchend", function() {
          missClick && Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.CLOSE_POPUP);
        });
        this._root.on("mousewheel", function(event) {});
      };
      PopupMediator.prototype.onOut = function() {
        this.setLocked(false);
        this.content.active = false;
        this._root.off("touchend");
        this._lock.off("mousewheel");
        this._currentMediator = null;
        if (this._popupMediatorClasses.length > 0) {
          Facade_1.default.getInstance().removeMediator(this._popupMediatorClasses[0].NAME());
          this._popupMediatorClasses.shift();
        }
        this._isAlreadyClosing = false;
        this.nextPopup();
      };
      PopupMediator.prototype.close = function() {
        var _this = this;
        if (!this._currentMediator || this._isAlreadyClosing) return;
        this._currentMediator.startClose();
        this._isAlreadyClosing = true;
        cc.tween(this.content).stop().to(.3, {
          opacity: 0
        }).call(function() {
          _this.onOut();
        }).start();
        this.setLocked(true);
      };
      PopupMediator.prototype.setLocked = function(isLocked) {
        isLocked ? this._lock.on("touchend", function(event) {}) : this._lock.off("touchend");
      };
      return PopupMediator;
    }(Mediator_1.default);
    exports.default = PopupMediator;
    cc._RF.pop();
  }, {
    "../../Constants": "Constants",
    "../../PureMVC/Facade": "Facade",
    "../../PureMVC/Mediator": "Mediator",
    "../../PureMVC/MessageConfig": "MessageConfig",
    "../../Scene/MainScene": "MainScene",
    "../../Utils/Loader": "Loader",
    "../../Utils/Utils": "Utils"
  } ],
  PrefabWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b1b72oGM9dDGJCUZDlXA2RA", "PrefabWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode;
    var PrefabWidget = function(_super) {
      __extends(PrefabWidget, _super);
      function PrefabWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.prefab = null;
        _this.removedInEditor = false;
        return _this;
      }
      PrefabWidget.prototype.onLoad = function() {
        this.reload();
      };
      PrefabWidget.prototype.onFocusInEditor = function() {
        this.reload();
      };
      PrefabWidget.prototype.onLostFocusInEditor = function() {
        this.reload();
      };
      PrefabWidget.prototype.reload = function() {
        this.node.removeAllChildren(true);
        if (this.prefab && true) {
          var node_1 = cc.instantiate(this.prefab);
          this.node.addChild(node_1);
          this.scheduleOnce(function() {
            var widget = node_1.getComponent(cc.Widget);
            widget && widget.updateAlignment();
          });
        }
      };
      __decorate([ property(cc.Prefab) ], PrefabWidget.prototype, "prefab", void 0);
      __decorate([ property() ], PrefabWidget.prototype, "removedInEditor", void 0);
      PrefabWidget = __decorate([ ccclass, executeInEditMode ], PrefabWidget);
      return PrefabWidget;
    }(cc.Component);
    exports.default = PrefabWidget;
    cc._RF.pop();
  }, {} ],
  ProgressBarWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "49c0cHU0sdKR4vZm4FN7aAE", "ProgressBarWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ProgressBar = cc.ProgressBar;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ProgressBarWidget = function(_super) {
      __extends(ProgressBarWidget, _super);
      function ProgressBarWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.mask = null;
        _this.isAutoprogress = false;
        _this.isCanBackProgress = false;
        _this.stretchByRootNode = false;
        _this.suffix = "%";
        _this.speed = 3.5;
        _this.precision = 0;
        _this.onComplete = function() {};
        _this.onProgress = function(progress) {};
        _this._targetProgress = 0;
        _this._isComplete = false;
        _this._stopUpdate = false;
        return _this;
      }
      ProgressBarWidget.prototype.onLoad = function() {
        this.updateTotalLength();
        this.mode == ProgressBar.Mode.HORIZONTAL && (this.barSprite.node.width = this.node.width);
        this.progress = this._targetProgress;
      };
      ProgressBarWidget.prototype.setProgress = function(progress, isFast) {
        void 0 === isFast && (isFast = false);
        progress = cc.misc.clampf(progress, 0, 1);
        this._stopUpdate = false;
        if (isFast) {
          this._targetProgress = progress;
          this.progress = this._targetProgress;
        } else {
          if (this.isAutoprogress && progress <= this.progress) return;
          if (this.progress > progress && !this.isCanBackProgress) {
            this.progress = progress;
            this._targetProgress = this.progress;
          } else this._targetProgress = progress;
        }
      };
      ProgressBarWidget.prototype.getProgress = function() {
        return this._targetProgress;
      };
      ProgressBarWidget.prototype.updateLabel = function() {
        if (this.label) {
          var percent = 0;
          percent = this.precision > 0 ? Math.round(100 * this.progress * Math.pow(10, this.precision)) / Math.pow(10, this.precision) : Math.round(100 * this.progress);
          var str = percent.toString();
          if (this.precision > 0) {
            var index = str.indexOf(".");
            index < 0 && (str += ".");
            var suf = str.substring(str.indexOf("."));
            for (var i = 0; i < this.precision + 1; i++) i >= suf.length && (str += "0");
          }
          this.label.string = str + this.suffix;
        }
      };
      ProgressBarWidget.prototype.updateMask = function() {
        if (this.mask) {
          var size = this.barSprite.node.getContentSize();
          this.mask.setContentSize(size.width, this.mask.getContentSize().height);
        }
      };
      ProgressBarWidget.prototype.updateTotalLength = function() {
        this.mode == ProgressBar.Mode.HORIZONTAL && this.stretchByRootNode && this.totalLength != this.node.width && (this.totalLength = this.node.width);
      };
      ProgressBarWidget.prototype.update = function(dt) {
        var _this = this;
        if (this._stopUpdate) return;
        this.updateTotalLength();
        if (this.progress < this._targetProgress) {
          this.progress += dt * this.speed;
          this.progress = cc.misc.clampf(this.progress, 0, this._targetProgress);
          this.onProgress(this.progress);
        } else if (this.progress > this._targetProgress && this.isCanBackProgress) {
          this.progress -= dt * this.speed;
          this.progress = cc.misc.clampf(this.progress, this._targetProgress, 1);
          this.onProgress(this.progress);
        } else if (this.isAutoprogress && this.progress > 0 && this.progress < .9) {
          this.progress += .01 * dt;
          this.progress = cc.misc.clampf(this.progress, 0, .9);
          this.onProgress(this.progress);
        } else this.progress == this._targetProgress && (!this.isAutoprogress || this.progress >= .9) && (this._stopUpdate = true);
        this.updateLabel();
        this.updateMask();
        if (1 == this.progress && this.onComplete && !this._isComplete) {
          this.onProgress(this.progress);
          this._isComplete = true;
          this.unscheduleAllCallbacks();
          this.scheduleOnce(function() {
            _this.onComplete();
            _this.onComplete = function() {};
          }, .3);
        } else this.progress < 1 && (this._isComplete = false);
      };
      __decorate([ property(cc.Label) ], ProgressBarWidget.prototype, "label", void 0);
      __decorate([ property(cc.Node) ], ProgressBarWidget.prototype, "mask", void 0);
      __decorate([ property ], ProgressBarWidget.prototype, "isAutoprogress", void 0);
      __decorate([ property ], ProgressBarWidget.prototype, "isCanBackProgress", void 0);
      __decorate([ property ], ProgressBarWidget.prototype, "stretchByRootNode", void 0);
      __decorate([ property ], ProgressBarWidget.prototype, "suffix", void 0);
      __decorate([ property ], ProgressBarWidget.prototype, "speed", void 0);
      __decorate([ property ], ProgressBarWidget.prototype, "precision", void 0);
      ProgressBarWidget = __decorate([ ccclass ], ProgressBarWidget);
      return ProgressBarWidget;
    }(cc.ProgressBar);
    exports.default = ProgressBarWidget;
    cc._RF.pop();
  }, {} ],
  Protocol: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c7b80762odA9Ypp/yBTw0m1", "Protocol");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Protocol = function() {
      function Protocol() {}
      Protocol.P_AUTHORIZATION = 1;
      Protocol.P_MESSAGE = 2;
      Protocol.P_MESSAGE_RECEIVED = 3;
      Protocol.P_PING = 6;
      Protocol.P_RECOVERY = 7;
      Protocol.P_SERVER_SHUTDOWN_TIMEOUT = 8;
      Protocol.P_CLOSE = 16;
      Protocol.P_CLOSE_SERVER_SHUTDOWN = 17;
      Protocol.P_CLOSE_ACTIVITY_TIMEOUT_EXPIRED = 18;
      Protocol.P_CLOSE_AUTHORIZATION_REJECT = 19;
      Protocol.P_CLOSE_RECOVERY_REJECT = 20;
      Protocol.P_CLOSE_CONCURRENT = 21;
      Protocol.P_CLOSE_PROTOCOL_BROKEN = 22;
      Protocol.P_CLOSE_SERVER_ERROR = 23;
      Protocol.CONNECTION_ERROR_TIME_OUT = 0;
      Protocol.CONNECTION_ERROR_CONNECTION_FAILURE = 1;
      Protocol.CONNECTION_ERROR_UNKNOWN = 2;
      Protocol.CONNECTION_ERROR_AUTHORIZATION_REJECT = 3;
      Protocol.CONNECTION_ERROR_RECOVERY_REJECT = 4;
      return Protocol;
    }();
    exports.default = Protocol;
    cc._RF.pop();
  }, {} ],
  Proxy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a76ber/4YhBmLZWNZXo8z+H", "Proxy");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Proxy = function() {
      function Proxy() {
        this.deleted = false;
      }
      Proxy.NAME = function() {
        return "Proxy";
      };
      Proxy.prototype.NAME = function() {
        return Proxy.NAME();
      };
      Proxy.prototype.onRegister = function() {};
      Proxy.prototype.onRemove = function() {};
      Proxy.prototype.initData = function() {};
      Proxy.prototype.setDeleted = function() {
        this.deleted = true;
      };
      return Proxy;
    }();
    exports.default = Proxy;
    cc._RF.pop();
  }, {} ],
  RepeatPropertyWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9ff4evUnCxMe701RRvjwHq3", "RepeatPropertyWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode;
    var RepeatPropertyWidget = function(_super) {
      __extends(RepeatPropertyWidget, _super);
      function RepeatPropertyWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.target = null;
        return _this;
      }
      RepeatPropertyWidget.prototype.onLoad = function() {
        this.addParentEventListeners();
        this.updateProperty();
      };
      RepeatPropertyWidget.prototype.onDestroy = function() {
        this.removeParentEventListeners();
      };
      RepeatPropertyWidget.prototype.onFocusInEditor = function() {
        this.updateProperty();
      };
      RepeatPropertyWidget.prototype.onLostFocusInEditor = function() {
        this.updateProperty();
      };
      RepeatPropertyWidget.prototype.addParentEventListeners = function() {
        if (!this.target || !this.target.isValid) return;
        this.removeParentEventListeners();
        this.target.on("size-changed", this.updateProperty, this);
        this.target.on("scale-changed", this.updateProperty, this);
        this.target.on("anchor-changed", this.updateProperty, this);
        this.target.on("rotation-changed", this.updateProperty, this);
        this.target.on("position-changed", this.updateProperty, this);
      };
      RepeatPropertyWidget.prototype.removeParentEventListeners = function() {
        if (!this.target || !this.target.isValid) return;
        this.target.off("size-changed", this.updateProperty, this);
        this.target.off("scale-changed", this.updateProperty, this);
        this.target.off("anchor-changed", this.updateProperty, this);
        this.target.off("rotation-changed", this.updateProperty, this);
        this.target.off("position-changed", this.updateProperty, this);
      };
      RepeatPropertyWidget.prototype.updateProperty = function() {
        if (!this.target || !this.target.isValid) return;
        this.node.scale = this.target.scale;
        this.node.width = this.target.width;
        this.node.height = this.target.height;
        this.node.angle = this.target.angle;
        this.node.anchorX = this.target.anchorX;
        this.node.anchorY = this.target.anchorY;
        this.node.position = this.target.position;
      };
      __decorate([ property(cc.Node) ], RepeatPropertyWidget.prototype, "target", void 0);
      RepeatPropertyWidget = __decorate([ ccclass, executeInEditMode ], RepeatPropertyWidget);
      return RepeatPropertyWidget;
    }(cc.Component);
    exports.default = RepeatPropertyWidget;
    cc._RF.pop();
  }, {} ],
  RunMainScenePreloader: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f4c93QHZ8ZJGbOvBxa9kcrO", "RunMainScenePreloader");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Facade_1 = require("../PureMVC/Facade");
    var FacadeCommand_1 = require("../PureMVC/FacadeCommand");
    var MainScenePreloaderMediator_1 = require("../Mediator/MainScenePreloaderMediator");
    var SettingsProxy_1 = require("../Proxy/SettingsProxy");
    var ServerProxy_1 = require("../Proxy/ServerProxy");
    var SocialProxy_1 = require("../Proxy/SocialProxy");
    var Loader_1 = require("../Utils/Loader");
    var SessionUserProxy_1 = require("../Proxy/SessionUserProxy");
    var Constants_1 = require("../Constants");
    var RunMainScenePreloader = function(_super) {
      __extends(RunMainScenePreloader, _super);
      function RunMainScenePreloader() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "RunPreloaderScene";
        return _this;
      }
      RunMainScenePreloader.prototype.execute = function(notification) {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              Facade_1.default.getInstance().removeAllMediators();
              Facade_1.default.getInstance().removeAllProxy();
              Facade_1.default.getInstance().registerProxy(new SocialProxy_1.default());
              Facade_1.default.getInstance().registerProxy(new ServerProxy_1.default());
              Facade_1.default.getInstance().registerProxy(new SettingsProxy_1.default());
              Facade_1.default.getInstance().registerProxy(new SessionUserProxy_1.default());
              return [ 4, Loader_1.default.loadRes(Constants_1.default.BUNDLE_GENERAL, "csd/PreloaderSceneLocal", cc.Prefab) ];

             case 1:
              _a.sent();
              Facade_1.default.getInstance().registerMediator(new MainScenePreloaderMediator_1.default());
              return [ 2 ];
            }
          });
        });
      };
      return RunMainScenePreloader;
    }(FacadeCommand_1.default);
    exports.default = RunMainScenePreloader;
    cc._RF.pop();
  }, {
    "../Constants": "Constants",
    "../Mediator/MainScenePreloaderMediator": "MainScenePreloaderMediator",
    "../Proxy/ServerProxy": "ServerProxy",
    "../Proxy/SessionUserProxy": "SessionUserProxy",
    "../Proxy/SettingsProxy": "SettingsProxy",
    "../Proxy/SocialProxy": "SocialProxy",
    "../PureMVC/Facade": "Facade",
    "../PureMVC/FacadeCommand": "FacadeCommand",
    "../Utils/Loader": "Loader"
  } ],
  RunMainScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3fdb54p+WNMooEXqf/5qNN6", "RunMainScene");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Facade_1 = require("../PureMVC/Facade");
    var MainSceneMediator_1 = require("../Mediator/MainSceneMediator");
    var FacadeCommand_1 = require("../PureMVC/FacadeCommand");
    var MessageConfig_1 = require("../PureMVC/MessageConfig");
    var SoundMediator_1 = require("../Mediator/SoundMediator");
    var PopupMediator_1 = require("../Mediator/Windows/PopupMediator");
    var RunMainScene = function(_super) {
      __extends(RunMainScene, _super);
      function RunMainScene() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "RunMainScene";
        return _this;
      }
      RunMainScene.prototype.execute = function(notification) {
        Facade_1.default.getInstance().removeAllMediators();
        Facade_1.default.getInstance().registerMediator(new MainSceneMediator_1.default());
        Facade_1.default.getInstance().registerMediator(new SoundMediator_1.default());
        Facade_1.default.getInstance().registerMediator(new PopupMediator_1.default());
        Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.RUN_LOBBY);
      };
      return RunMainScene;
    }(FacadeCommand_1.default);
    exports.default = RunMainScene;
    cc._RF.pop();
  }, {
    "../Mediator/MainSceneMediator": "MainSceneMediator",
    "../Mediator/SoundMediator": "SoundMediator",
    "../Mediator/Windows/PopupMediator": "PopupMediator",
    "../PureMVC/Facade": "Facade",
    "../PureMVC/FacadeCommand": "FacadeCommand",
    "../PureMVC/MessageConfig": "MessageConfig"
  } ],
  ScaleWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f076cPp2IFABZsnvRYGqLYa", "ScaleWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode;
    var ScaleWidget = function(_super) {
      __extends(ScaleWidget, _super);
      function ScaleWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.byWidth = false;
        _this.byHeight = false;
        return _this;
      }
      ScaleWidget.prototype.onLoad = function() {
        this.addParentEventListeners();
        this.updateScale();
      };
      ScaleWidget.prototype.onDestroy = function() {
        this.removeParentEventListeners();
      };
      ScaleWidget.prototype.onFocusInEditor = function() {
        this.updateScale();
      };
      ScaleWidget.prototype.onLostFocusInEditor = function() {
        this.updateScale();
      };
      ScaleWidget.prototype.addParentEventListeners = function() {
        if (!this.node.parent || !this.node.parent.isValid) return;
        this.removeParentEventListeners();
        this.node.parent.on("size-changed", this.updateScale, this);
      };
      ScaleWidget.prototype.removeParentEventListeners = function() {
        if (!this.node.parent || !this.node.parent.isValid) return;
        this.node.parent.off("size-changed", this.updateScale, this);
      };
      ScaleWidget.prototype.updateScale = function() {
        if (!this.node.parent || !this.node.parent.isValid || !this.byWidth && !this.byHeight) return;
        this.node.scale = Math.max(this.byWidth ? this.node.parent.width / this.node.width : 0, this.byHeight ? this.node.parent.height / this.node.height : 0);
      };
      __decorate([ property() ], ScaleWidget.prototype, "byWidth", void 0);
      __decorate([ property() ], ScaleWidget.prototype, "byHeight", void 0);
      ScaleWidget = __decorate([ ccclass, executeInEditMode ], ScaleWidget);
      return ScaleWidget;
    }(cc.Component);
    exports.default = ScaleWidget;
    cc._RF.pop();
  }, {} ],
  ScrollWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f576fVE+85Dqox9HxET586J", "ScrollWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Utils_1 = require("../../Utils/Utils");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ScrollWidget = function(_super) {
      __extends(ScrollWidget, _super);
      function ScrollWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.scrollView = null;
        _this.scrollContent = null;
        _this.scrollBar = null;
        return _this;
      }
      ScrollWidget.prototype.onLoad = function() {
        var _this = this;
        this.scrollView.node.on("scrolling", function(scrollView) {
          var d = scrollView.content.getContentSize().height - scrollView.node.getContentSize().height;
          var perc = (scrollView.content.position.y - scrollView.content["origY"]) / d;
          _this.scrollBar.setPosition(0, -_this.scrollBar.getParent().getContentSize().height * perc);
        });
        this.scrollBar.on("touchmove", function(event) {
          var parent = _this.scrollBar.parent;
          var local = parent.convertToNodeSpaceAR(event.getLocation());
          var h = parent.getContentSize().height;
          var y = Utils_1.default.clamp(local.y, -h, 0);
          _this.scrollBar.setPosition(0, y);
          var perc = -y / h;
          _this.scrollView.stopAutoScroll();
          _this.scrollView.scrollTo(cc.v2(0, 1 - perc));
        });
        this.scrollContent["origY"] = this.scrollContent.position.y;
      };
      __decorate([ property(cc.ScrollView) ], ScrollWidget.prototype, "scrollView", void 0);
      __decorate([ property(cc.Node) ], ScrollWidget.prototype, "scrollContent", void 0);
      __decorate([ property(cc.Node) ], ScrollWidget.prototype, "scrollBar", void 0);
      ScrollWidget = __decorate([ ccclass ], ScrollWidget);
      return ScrollWidget;
    }(cc.Component);
    exports.default = ScrollWidget;
    cc._RF.pop();
  }, {
    "../../Utils/Utils": "Utils"
  } ],
  SelectBoxWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e6e3621rx5FKbHAkYVgxBhE", "SelectBoxWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DefaultButtonWidget_1 = require("./DefaultButtonWidget");
    var Utils_1 = require("../../Utils/Utils");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var SelectBoxWidget = function(_super) {
      __extends(SelectBoxWidget, _super);
      function SelectBoxWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.string = "";
        _this.text = null;
        _this.left = null;
        _this.right = null;
        _this.values = [];
        _this._currentIndex = -1;
        return _this;
      }
      SelectBoxWidget.prototype.onLoad = function() {
        var _this = this;
        this.scheduleOnce(function() {
          _this.left.action = function() {
            _this._currentIndex--;
            _this.updateBox();
          };
          _this.right.action = function() {
            _this._currentIndex++;
            _this.updateBox();
          };
          _this.updateBox();
        });
      };
      SelectBoxWidget.prototype.updateBox = function() {
        if (0 == this.values.length) {
          this.text.string = "";
          this.string = "";
          this.left.setEnabled(false);
          this.right.setEnabled(false);
          return;
        }
        this._currentIndex = Utils_1.default.clamp(this._currentIndex, 0, this.values.length - 1);
        this.text.string = this.values[this._currentIndex];
        this.string = this.text.string;
        this.left.setEnabled(this._currentIndex > 0);
        this.right.setEnabled(this._currentIndex < this.values.length - 1);
      };
      SelectBoxWidget.prototype.setSelectedIndex = function(index) {
        var _this = this;
        this._currentIndex = index >= 0 && index < this.values.length ? index : 0;
        this.scheduleOnce(function() {
          _this.updateBox();
        });
      };
      SelectBoxWidget.prototype.getSelectedIndex = function() {
        return this._currentIndex;
      };
      SelectBoxWidget.prototype.getValues = function() {
        return this.values;
      };
      __decorate([ property() ], SelectBoxWidget.prototype, "string", void 0);
      __decorate([ property(cc.Label) ], SelectBoxWidget.prototype, "text", void 0);
      __decorate([ property(DefaultButtonWidget_1.default) ], SelectBoxWidget.prototype, "left", void 0);
      __decorate([ property(DefaultButtonWidget_1.default) ], SelectBoxWidget.prototype, "right", void 0);
      __decorate([ property({
        type: [ cc.String ]
      }) ], SelectBoxWidget.prototype, "values", void 0);
      SelectBoxWidget = __decorate([ ccclass ], SelectBoxWidget);
      return SelectBoxWidget;
    }(cc.Component);
    exports.default = SelectBoxWidget;
    cc._RF.pop();
  }, {
    "../../Utils/Utils": "Utils",
    "./DefaultButtonWidget": "DefaultButtonWidget"
  } ],
  ServerConnection: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "68a116tjHxDOaBaEvqLi/G0", "ServerConnection");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Connection_1 = require("../../Utils/biser-legacy/csi/Connection");
    var Facade_1 = require("../../PureMVC/Facade");
    var MessageConfig_1 = require("../../PureMVC/MessageConfig");
    var DataReader_1 = require("../../Utils/biser-legacy/io/DataReader");
    var Protocol_1 = require("../../Utils/biser-legacy/csi/Protocol");
    var MainScene_1 = require("../../Scene/MainScene");
    var ServerConnection = function() {
      function ServerConnection() {}
      ServerConnection.prototype.login = function(address, key) {
        var connection = Connection_1.default.getInstance();
        connection.onOpenFunc = function() {
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.GET_START_UP_DATA);
        };
        connection.onCloseFunc = function(isValid) {
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.PING, true);
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ON_DISCONNECT, isValid);
        };
        connection.onPingFunc = function() {
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.PING, true);
        };
        connection.onErrorFunc = function(error) {
          MainScene_1.default.log("CLOSE BY: " + (error && !_.isNumber(error) ? Protocol_1.default[error] : "undefined") + " (" + (error && void 0 !== error.toString ? error.toString() : "") + ")");
          switch (error) {
           case Protocol_1.default.CONNECTION_ERROR_TIME_OUT:
           case Protocol_1.default.CONNECTION_ERROR_CONNECTION_FAILURE:
           case Protocol_1.default.CONNECTION_ERROR_UNKNOWN:
           case Protocol_1.default.CONNECTION_ERROR_RECOVERY_REJECT:
           case Protocol_1.default.CONNECTION_ERROR_AUTHORIZATION_REJECT:
           default:
            Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ON_LOGIN_FAIL);
          }
        };
        connection.onShutdownFunc = function(time) {
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ON_SHUTDOWN, time);
        };
        connection.onMessageFunc = function(message) {
          var dataReader = new DataReader_1.default(message);
          var callbackId = dataReader.readInt();
          var notificationName;
          var data;
          if (0 == callbackId) {
            var serviceId = dataReader.readInt();
            data = dataReader.readBytes(dataReader.getReadableBytes());
            notificationName = "action_" + serviceId;
          } else {
            data = dataReader.readBytes(dataReader.getReadableBytes());
            notificationName = "callback_" + callbackId;
          }
          MainScene_1.default.log("server message: id=" + callbackId);
          Facade_1.default.getInstance().sendNotification(notificationName, data);
        };
        connection.connect(address, key);
      };
      ServerConnection.prototype.close = function() {
        Connection_1.default.destroyInstance();
      };
      ServerConnection.prototype.disconnect = function() {
        Connection_1.default.destroyInstance(true);
      };
      ServerConnection.prototype.isConnected = function() {
        return Connection_1.default.getInstance().getState() == Connection_1.ConnectionState.STATE_CONNECTED;
      };
      return ServerConnection;
    }();
    exports.default = ServerConnection;
    cc._RF.pop();
  }, {
    "../../PureMVC/Facade": "Facade",
    "../../PureMVC/MessageConfig": "MessageConfig",
    "../../Scene/MainScene": "MainScene",
    "../../Utils/biser-legacy/csi/Connection": "Connection",
    "../../Utils/biser-legacy/csi/Protocol": "Protocol",
    "../../Utils/biser-legacy/io/DataReader": "DataReader"
  } ],
  ServerProxy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3782cr9Do1IbZWErxBfnXZU", "ServerProxy");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Proxy_1 = require("../PureMVC/Proxy");
    var ServerConnection_1 = require("./Interfaces/ServerConnection");
    var Facade_1 = require("../PureMVC/Facade");
    var SocialProxy_1 = require("./SocialProxy");
    var MainScene_1 = require("../Scene/MainScene");
    var MessageConfig_1 = require("../PureMVC/MessageConfig");
    var Constants_1 = require("../Constants");
    var ServerProxy = function(_super) {
      __extends(ServerProxy, _super);
      function ServerProxy() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.serverConnection = null;
        return _this;
      }
      ServerProxy.NAME = function() {
        return "ServerProxy";
      };
      ServerProxy.prototype.NAME = function() {
        return ServerProxy.NAME();
      };
      ServerProxy.prototype.onRegister = function() {
        this.serverConnection = new ServerConnection_1.default();
      };
      ServerProxy.prototype.onRemove = function() {
        this.save();
        this.serverConnection.close();
      };
      ServerProxy.prototype.reset = function() {
        this.serverConnection.close();
      };
      ServerProxy.prototype.load = function() {};
      ServerProxy.prototype.save = function() {};
      ServerProxy.prototype.login = function() {
        var _this = this;
        capjack.tool.cpd.init(Constants_1.default.CPD_PROJECT_NAME).then(function(result) {
          var social = Facade_1.default.getInstance().retrieveProxy(SocialProxy_1.default).getSocial();
          MainScene_1.default.log("Login: " + result.key);
          _this.serverConnection.login(social.getAddress(), result.key);
        }).catch(function(error) {
          Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.ON_LOGIN_FAIL);
        });
      };
      ServerProxy.prototype.getConnection = function() {
        return this.serverConnection;
      };
      ServerProxy.version = "1";
      return ServerProxy;
    }(Proxy_1.default);
    exports.default = ServerProxy;
    cc._RF.pop();
  }, {
    "../Constants": "Constants",
    "../PureMVC/Facade": "Facade",
    "../PureMVC/MessageConfig": "MessageConfig",
    "../PureMVC/Proxy": "Proxy",
    "../Scene/MainScene": "MainScene",
    "./Interfaces/ServerConnection": "ServerConnection",
    "./SocialProxy": "SocialProxy"
  } ],
  SessionAPI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "41ce6qaG4dJxqNwY4OZI90m", "SessionAPI");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Facade_1 = require("../../PureMVC/Facade");
    var MessageConfig_1 = require("../../PureMVC/MessageConfig");
    var GetUser_1 = require("./Session/GetUser");
    var CsiApiIds_1 = require("../../Utils/biser-legacy/csi/Objects/CsiApiIds");
    var SessionServiceActions_1 = require("./Session/SessionServiceActions");
    var UpLevel_1 = require("./Session/UpLevel");
    var CheatAddCoins_1 = require("./Session/CheatAddCoins");
    var CheatAddFoods_1 = require("./Session/CheatAddFoods");
    var SessionAPI = function() {
      function SessionAPI() {}
      SessionAPI.register = function() {
        Facade_1.default.getInstance().registerCommand(new GetUser_1.default(), MessageConfig_1.default.GET_USER);
        Facade_1.default.getInstance().registerCommand(new UpLevel_1.default(), MessageConfig_1.default.UP_LEVEL);
        Facade_1.default.getInstance().registerCommand(new CheatAddCoins_1.default(), MessageConfig_1.default.ADD_COINS);
        Facade_1.default.getInstance().registerCommand(new CheatAddFoods_1.default(), MessageConfig_1.default.ADD_FOODS);
        Facade_1.default.getInstance().registerCommand(new GetUser_1.default(), "callback_" + CsiApiIds_1.default.CSI_SERVER_SESSION_GET_USER_CALLBACK.toString());
        Facade_1.default.getInstance().registerCommand(new SessionServiceActions_1.default(), "action_" + CsiApiIds_1.default.CSI_SERVICE_ACTIONS_SESSION.toString());
      };
      return SessionAPI;
    }();
    exports.default = SessionAPI;
    cc._RF.pop();
  }, {
    "../../PureMVC/Facade": "Facade",
    "../../PureMVC/MessageConfig": "MessageConfig",
    "../../Utils/biser-legacy/csi/Objects/CsiApiIds": "CsiApiIds",
    "./Session/CheatAddCoins": "CheatAddCoins",
    "./Session/CheatAddFoods": "CheatAddFoods",
    "./Session/GetUser": "GetUser",
    "./Session/SessionServiceActions": "SessionServiceActions",
    "./Session/UpLevel": "UpLevel"
  } ],
  SessionServiceActions: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "68d6d1maC5LOqtf/VSZEXjU", "SessionServiceActions");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.UpdateFoodsReason = exports.UpdateCoinsReason = void 0;
    var FacadeCommand_1 = require("../../../PureMVC/FacadeCommand");
    var DataReader_1 = require("../../../Utils/biser-legacy/io/DataReader");
    var Facade_1 = require("../../../PureMVC/Facade");
    var SessionUserProxy_1 = require("../../../Proxy/SessionUserProxy");
    var CsiApiIds_1 = require("../../../Utils/biser-legacy/csi/Objects/CsiApiIds");
    var MainScene_1 = require("../../../Scene/MainScene");
    var Utils_1 = require("../../../Utils/Utils");
    var UpdateCoinsReason;
    (function(UpdateCoinsReason) {
      UpdateCoinsReason[UpdateCoinsReason["GAME_BET"] = 0] = "GAME_BET";
      UpdateCoinsReason[UpdateCoinsReason["REGULAR_BONUS"] = 1] = "REGULAR_BONUS";
      UpdateCoinsReason[UpdateCoinsReason["LEVEL_REWARD"] = 2] = "LEVEL_REWARD";
      UpdateCoinsReason[UpdateCoinsReason["GAME_PRIZE_BASE"] = 3] = "GAME_PRIZE_BASE";
      UpdateCoinsReason[UpdateCoinsReason["GAME_PRIZE_FREE_SPIN"] = 4] = "GAME_PRIZE_FREE_SPIN";
      UpdateCoinsReason[UpdateCoinsReason["GAME_PRIZE_RE_SPIN"] = 5] = "GAME_PRIZE_RE_SPIN";
      UpdateCoinsReason[UpdateCoinsReason["GAME_PRIZE_CASH_RE_SPIN"] = 6] = "GAME_PRIZE_CASH_RE_SPIN";
    })(UpdateCoinsReason = exports.UpdateCoinsReason || (exports.UpdateCoinsReason = {}));
    var UpdateFoodsReason;
    (function(UpdateFoodsReason) {
      UpdateFoodsReason[UpdateFoodsReason["LEVEL_REWARD"] = 0] = "LEVEL_REWARD";
    })(UpdateFoodsReason = exports.UpdateFoodsReason || (exports.UpdateFoodsReason = {}));
    var SessionServiceActions = function(_super) {
      __extends(SessionServiceActions, _super);
      function SessionServiceActions() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "Session_ServiceActions";
        return _this;
      }
      SessionServiceActions.prototype.execute = function(notification) {
        var dataReader = new DataReader_1.default(notification.body);
        var actionId = dataReader.readInt();
        var sessionUserProxy = Facade_1.default.getInstance().retrieveProxy(SessionUserProxy_1.default);
        var userModel = sessionUserProxy.getUserModel();
        switch (actionId) {
         case CsiApiIds_1.default.CSI_CLIENT_SESSION_UPDATE_USER_COINS:
          var coins = dataReader.readLong();
          var reason = dataReader.readString();
          userModel.addCoinsToPool(reason, coins);
          switch (reason) {
           case UpdateCoinsReason[UpdateCoinsReason.LEVEL_REWARD]:
           case UpdateCoinsReason[UpdateCoinsReason.GAME_PRIZE_BASE]:
           case UpdateCoinsReason[UpdateCoinsReason.GAME_PRIZE_FREE_SPIN]:
           case UpdateCoinsReason[UpdateCoinsReason.GAME_PRIZE_RE_SPIN]:
           case UpdateCoinsReason[UpdateCoinsReason.GAME_PRIZE_CASH_RE_SPIN]:
            break;

           default:
            userModel.addCoinsToBalance(reason);
          }
          MainScene_1.default.log("UPDATE_BALANCE: " + coins.toString() + " reason: " + reason);
          break;

         case CsiApiIds_1.default.CSI_CLIENT_SESSION_UPDATE_USER_FOODS:
          var foods = dataReader.readInt();
          var reason = dataReader.readString();
          userModel.addFoodsToPool(reason, foods);
          switch (reason) {
           case UpdateCoinsReason[UpdateFoodsReason.LEVEL_REWARD]:
            break;

           default:
            userModel.addFoodsToBalance(reason);
          }
          MainScene_1.default.log("UPDATE_FOODS: " + foods.toString() + " reason: " + reason);
          break;

         case CsiApiIds_1.default.CSI_CLIENT_SESSION_UPDATE_USER_LEVEL_POINTS:
          sessionUserProxy.addLevelPoints(dataReader.readInt());
          MainScene_1.default.log("UPDATE_LEVEL_POINTS: " + userModel.levelPoints.toString());
          break;

         case CsiApiIds_1.default.CSI_CLIENT_SESSION_UPDATE_USER_LEVEL:
          SessionUserProxy_1.default.needShowLevelUp = true;
          userModel.level = dataReader.readInt();
          userModel.levelPointsLimit = dataReader.readInt();
          MainScene_1.default.log("LEVEL_UP: " + JSON.stringify(userModel.level));
          Utils_1.default.dvdLevelUp(userModel.level, 0);
        }
      };
      return SessionServiceActions;
    }(FacadeCommand_1.default);
    exports.default = SessionServiceActions;
    cc._RF.pop();
  }, {
    "../../../Proxy/SessionUserProxy": "SessionUserProxy",
    "../../../PureMVC/Facade": "Facade",
    "../../../PureMVC/FacadeCommand": "FacadeCommand",
    "../../../Scene/MainScene": "MainScene",
    "../../../Utils/Utils": "Utils",
    "../../../Utils/biser-legacy/csi/Objects/CsiApiIds": "CsiApiIds",
    "../../../Utils/biser-legacy/io/DataReader": "DataReader"
  } ],
  SessionService: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cb6d2tN6jhNa4RoLD9CsHCk", "SessionService");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CsiApiIds_1 = require("../../Utils/biser-legacy/csi/Objects/CsiApiIds");
    var MainScene_1 = require("../../Scene/MainScene");
    var DataReader_1 = require("../../Utils/biser-legacy/io/DataReader");
    var DataWriter_1 = require("../../Utils/biser-legacy/io/DataWriter");
    var Connection_1 = require("../../Utils/biser-legacy/csi/Connection");
    var SessionService = function() {
      function SessionService() {}
      SessionService.getUser = function() {
        var connection = Connection_1.default.getInstance();
        var dataWriter = new DataWriter_1.default();
        dataWriter.writeInt(CsiApiIds_1.default.CSI_SERVICE_SESSION);
        dataWriter.writeInt(CsiApiIds_1.default.CSI_SERVER_SESSION_GET_USER);
        dataWriter.writeInt(CsiApiIds_1.default.CSI_SERVER_SESSION_GET_USER_CALLBACK);
        connection.sendMessage(dataWriter.getArray());
      };
      SessionService.getUserResult = function(data) {
        var dataReader = new DataReader_1.default(data);
        var result = dataReader.readEntity();
        MainScene_1.default.log("GET_USER: " + JSON.stringify(result));
        return result;
      };
      SessionService.upLevel = function() {
        var connection = Connection_1.default.getInstance();
        var dataWriter = new DataWriter_1.default();
        dataWriter.writeInt(CsiApiIds_1.default.CSI_SERVICE_SESSION);
        dataWriter.writeInt(CsiApiIds_1.default.CSI_SERVER_SESSION_UP_LEVEL);
        connection.sendMessage(dataWriter.getArray());
      };
      SessionService.cheatAddFoods = function(value) {
        var connection = Connection_1.default.getInstance();
        var dataWriter = new DataWriter_1.default();
        dataWriter.writeInt(CsiApiIds_1.default.CSI_SERVICE_SESSION);
        dataWriter.writeInt(CsiApiIds_1.default.CSI_SERVER_SESSION_CHEAT_ADD_FOODS);
        dataWriter.writeInt(value);
        connection.sendMessage(dataWriter.getArray());
      };
      SessionService.cheatAddCoins = function(value) {
        var connection = Connection_1.default.getInstance();
        var dataWriter = new DataWriter_1.default();
        dataWriter.writeInt(CsiApiIds_1.default.CSI_SERVICE_SESSION);
        dataWriter.writeInt(CsiApiIds_1.default.CSI_SERVER_SESSION_CHEAT_ADD_COINS);
        dataWriter.writeInt(value);
        connection.sendMessage(dataWriter.getArray());
      };
      return SessionService;
    }();
    exports.default = SessionService;
    cc._RF.pop();
  }, {
    "../../Scene/MainScene": "MainScene",
    "../../Utils/biser-legacy/csi/Connection": "Connection",
    "../../Utils/biser-legacy/csi/Objects/CsiApiIds": "CsiApiIds",
    "../../Utils/biser-legacy/io/DataReader": "DataReader",
    "../../Utils/biser-legacy/io/DataWriter": "DataWriter"
  } ],
  SessionUserProxy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ae3edppXi9NAoludZ15lKuT", "SessionUserProxy");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Proxy_1 = require("../PureMVC/Proxy");
    var UserModel_1 = require("./Models/UserModel");
    var SessionUserProxy = function(_super) {
      __extends(SessionUserProxy, _super);
      function SessionUserProxy() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._sessionUser = new UserModel_1.default();
        return _this;
      }
      SessionUserProxy.NAME = function() {
        return "SessionUserProxy";
      };
      SessionUserProxy.prototype.NAME = function() {
        return SessionUserProxy.NAME();
      };
      SessionUserProxy.prototype.onRegister = function() {};
      SessionUserProxy.prototype.onRemove = function() {};
      SessionUserProxy.prototype.checkLevelUp = function() {
        this._sessionUser.levelPoints >= this._sessionUser.levelPointsLimit && (SessionUserProxy.readyToLevelUp = true);
      };
      SessionUserProxy.prototype.setUserModel = function(sessionUser) {
        _.merge(this._sessionUser, sessionUser);
        this.checkLevelUp();
      };
      SessionUserProxy.prototype.addLevelPoints = function(levelPoints) {
        this._sessionUser.levelPoints = levelPoints;
        this.checkLevelUp();
      };
      SessionUserProxy.prototype.getUserModel = function() {
        return this._sessionUser;
      };
      SessionUserProxy.needShowLevelUp = false;
      SessionUserProxy.readyToLevelUp = false;
      return SessionUserProxy;
    }(Proxy_1.default);
    exports.default = SessionUserProxy;
    cc._RF.pop();
  }, {
    "../PureMVC/Proxy": "Proxy",
    "./Models/UserModel": "UserModel"
  } ],
  SettingsProxy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aee9d+ituhKtqUoBpFvR1Ev", "SettingsProxy");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Proxy_1 = require("../PureMVC/Proxy");
    var Constants_1 = require("../Constants");
    var SettingsProxy = function(_super) {
      __extends(SettingsProxy, _super);
      function SettingsProxy() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._localSettings = new Object();
        return _this;
      }
      SettingsProxy.NAME = function() {
        return "SettingsProxy";
      };
      SettingsProxy.prototype.NAME = function() {
        return SettingsProxy.NAME();
      };
      SettingsProxy.prototype.onRegister = function() {
        this.load();
      };
      SettingsProxy.prototype.onRemove = function() {};
      SettingsProxy.prototype.load = function() {
        var value = cc.sys.localStorage.getItem(Constants_1.default.LOCAL_STORAGE);
        value && this.updateData(value);
      };
      SettingsProxy.prototype.save = function() {
        cc.sys.localStorage.setItem(Constants_1.default.LOCAL_STORAGE, this.getJsonString());
      };
      SettingsProxy.prototype.clear = function() {
        cc.sys.localStorage.clear();
        this._localSettings = new Object();
      };
      SettingsProxy.prototype.setItem = function(key, value) {
        this._localSettings[key] = value;
        this.save();
      };
      SettingsProxy.prototype.getItem = function(key) {
        return this._localSettings[key];
      };
      SettingsProxy.prototype.updateData = function(data) {
        var json = JSON.parse(data);
        this._localSettings = _.merge(this._localSettings, json);
        this.getItem("language") || this.setItem("language", "ru");
      };
      SettingsProxy.prototype.getJsonString = function() {
        return JSON.stringify(this._localSettings);
      };
      return SettingsProxy;
    }(Proxy_1.default);
    exports.default = SettingsProxy;
    cc._RF.pop();
  }, {
    "../Constants": "Constants",
    "../PureMVC/Proxy": "Proxy"
  } ],
  SizeWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71fc40gX25KmrU8Zjvt3r6B", "SizeWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executionOrder = _a.executionOrder;
    var SizeWidget = function(_super) {
      __extends(SizeWidget, _super);
      function SizeWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.targetNode = null;
        _this.fitWidth = false;
        _this.fitHeight = false;
        _this.additionalHeight = 0;
        _this.additionalWidth = 0;
        _this.minHeight = 0;
        _this.minWidth = 0;
        return _this;
      }
      SizeWidget.prototype.lateUpdate = function(dt) {
        var oldSize = this.node.getContentSize();
        var newSize = this.targetNode ? this.targetNode.getContentSize() : this.node.getParent().getContentSize();
        if (this.fitWidth && oldSize.width != newSize.width) {
          this.node.width = newSize.width + this.additionalWidth;
          this.minWidth > 0 && this.node.width < this.minWidth && (this.node.width = this.minWidth);
        }
        if (this.fitHeight && oldSize.height != newSize.height) {
          this.node.height = newSize.height + this.additionalHeight;
          this.minHeight > 0 && this.node.height < this.minHeight && (this.node.height = this.minHeight);
        }
      };
      SizeWidget.prototype.setTarget = function(node) {
        this.targetNode = node;
        this.lateUpdate(0);
      };
      SizeWidget.prototype.updateSize = function() {
        this.lateUpdate(0);
      };
      __decorate([ property(cc.Node) ], SizeWidget.prototype, "targetNode", void 0);
      __decorate([ property(cc.Boolean) ], SizeWidget.prototype, "fitWidth", void 0);
      __decorate([ property(cc.Boolean) ], SizeWidget.prototype, "fitHeight", void 0);
      __decorate([ property() ], SizeWidget.prototype, "additionalHeight", void 0);
      __decorate([ property() ], SizeWidget.prototype, "additionalWidth", void 0);
      __decorate([ property() ], SizeWidget.prototype, "minHeight", void 0);
      __decorate([ property() ], SizeWidget.prototype, "minWidth", void 0);
      SizeWidget = __decorate([ ccclass ], SizeWidget);
      return SizeWidget;
    }(cc.Component);
    exports.default = SizeWidget;
    cc._RF.pop();
  }, {} ],
  SocialAndroid: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "29ecf3xJ6FCE7LYuJM62Rsa", "SocialAndroid");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Constants_1 = require("../../Constants");
    var StoreModel_1 = require("../Models/StoreModel");
    var CsiShopProduct_1 = require("../../Utils/biser-legacy/csi/Objects/CsiShopProduct");
    var SocialAndroid = function() {
      function SocialAndroid() {
        this.storeModel = new StoreModel_1.default();
        this.socialActive = true;
        this.friends = [];
      }
      SocialAndroid.prototype.login = function() {};
      SocialAndroid.prototype.isLogin = function() {
        return false;
      };
      SocialAndroid.prototype.getAddress = function() {
        return window.csiAddress && "" != window.csiAddress ? window.csiAddress : Constants_1.default.SERVER_ADDRESS_WS;
      };
      SocialAndroid.prototype.getCurrencyCode = function() {
        return "USD";
      };
      SocialAndroid.prototype.getDVDCurrencyCode = function(product) {
        if (!product || product instanceof CsiShopProduct_1.default) return "USD";
        return product.currencyCode;
      };
      SocialAndroid.prototype.getDVDCurrencyMultiplier = function() {
        return 1;
      };
      SocialAndroid.prototype.getDVDKey = function() {
        return "";
      };
      SocialAndroid.prototype.getUserData = function(callback) {
        callback(null);
      };
      SocialAndroid.prototype.getConnectedPlayersAsync = function(callback) {
        callback([]);
      };
      SocialAndroid.prototype.share = function(base64Url, text) {};
      SocialAndroid.prototype.invite = function(text) {};
      SocialAndroid.prototype.sendNotification = function(text, usersId) {};
      SocialAndroid.prototype.joinGroup = function() {};
      SocialAndroid.prototype.purchase = function(name) {};
      SocialAndroid.prototype.purchaseOffer = function(id, name) {};
      SocialAndroid.prototype.checkPurchases = function() {};
      return SocialAndroid;
    }();
    exports.default = SocialAndroid;
    cc._RF.pop();
  }, {
    "../../Constants": "Constants",
    "../../Utils/biser-legacy/csi/Objects/CsiShopProduct": "CsiShopProduct",
    "../Models/StoreModel": "StoreModel"
  } ],
  SocialEmpty: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4ba6dG3ymRHz5FdJlYeEMfg", "SocialEmpty");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Constants_1 = require("../../Constants");
    var StoreModel_1 = require("../Models/StoreModel");
    var SocialEmpty = function() {
      function SocialEmpty() {
        this.storeModel = new StoreModel_1.default();
        this.socialActive = false;
        this.friends = [];
      }
      SocialEmpty.prototype.login = function() {};
      SocialEmpty.prototype.isLogin = function() {
        return true;
      };
      SocialEmpty.prototype.getAddress = function() {
        return window.csiAddress && "" != window.csiAddress ? window.csiAddress : Constants_1.default.SERVER_ADDRESS_WS;
      };
      SocialEmpty.prototype.getCurrencyCode = function() {
        return "OK";
      };
      SocialEmpty.prototype.getDVDCurrencyCode = function() {
        return "RUB";
      };
      SocialEmpty.prototype.getDVDCurrencyMultiplier = function() {
        return 1;
      };
      SocialEmpty.prototype.getDVDKey = function() {
        return "";
      };
      SocialEmpty.prototype.getUserData = function(callback) {
        callback(null);
      };
      SocialEmpty.prototype.getConnectedPlayersAsync = function(callback) {
        callback([]);
      };
      SocialEmpty.prototype.share = function(base64Url, text) {};
      SocialEmpty.prototype.invite = function(text) {};
      SocialEmpty.prototype.sendNotification = function(text, usersId) {};
      SocialEmpty.prototype.joinGroup = function() {};
      SocialEmpty.prototype.purchase = function(name) {};
      SocialEmpty.prototype.purchaseOffer = function(id, name) {};
      SocialEmpty.prototype.checkPurchases = function() {};
      return SocialEmpty;
    }();
    exports.default = SocialEmpty;
    cc._RF.pop();
  }, {
    "../../Constants": "Constants",
    "../Models/StoreModel": "StoreModel"
  } ],
  SocialIOS: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "21bb9gMIrZFwp1E+m0PqnKW", "SocialIOS");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Constants_1 = require("../../Constants");
    var StoreModel_1 = require("../Models/StoreModel");
    var CsiShopProduct_1 = require("../../Utils/biser-legacy/csi/Objects/CsiShopProduct");
    var SocialIOS = function() {
      function SocialIOS() {
        this.getFriendsCallback = null;
        this.getUserCallback = null;
        this.storeModel = new StoreModel_1.default();
        this.socialActive = true;
        this.friends = [];
        this.player = null;
      }
      SocialIOS.prototype.login = function() {};
      SocialIOS.prototype.isLogin = function() {
        return false;
      };
      SocialIOS.prototype.getAddress = function() {
        return window.csiAddress && "" != window.csiAddress ? window.csiAddress : Constants_1.default.SERVER_ADDRESS_WS;
      };
      SocialIOS.prototype.getCurrencyCode = function() {
        return "USD";
      };
      SocialIOS.prototype.getDVDCurrencyCode = function(product) {
        if (!product || product instanceof CsiShopProduct_1.default) return "USD";
        return product.currencyCode;
      };
      SocialIOS.prototype.getDVDCurrencyMultiplier = function() {
        return 1;
      };
      SocialIOS.prototype.getDVDKey = function() {
        return "";
      };
      SocialIOS.prototype.getUserData = function(callback) {
        if (this.player) {
          callback(this.player);
          return;
        }
        this.isLogin() ? this.getUserCallback = callback : callback(null);
      };
      SocialIOS.prototype.getConnectedPlayersAsync = function(callback) {
        this.isLogin() ? this.getFriendsCallback = callback : callback([]);
      };
      SocialIOS.prototype.share = function(base64Url, text) {};
      SocialIOS.prototype.invite = function(text) {};
      SocialIOS.prototype.sendNotification = function(text, usersId) {};
      SocialIOS.prototype.joinGroup = function() {};
      SocialIOS.prototype.purchase = function(name) {};
      SocialIOS.prototype.purchaseOffer = function(id, name) {};
      SocialIOS.prototype.checkPurchases = function() {};
      return SocialIOS;
    }();
    exports.default = SocialIOS;
    cc._RF.pop();
  }, {
    "../../Constants": "Constants",
    "../../Utils/biser-legacy/csi/Objects/CsiShopProduct": "CsiShopProduct",
    "../Models/StoreModel": "StoreModel"
  } ],
  SocialOK: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7561dKvOH9OFLZFeEaGZpb+", "SocialOK");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SocialPlayer_1 = require("./SocialPlayer");
    var StoreModel_1 = require("../Models/StoreModel");
    var MainScene_1 = require("../../Scene/MainScene");
    var SocialOK = function() {
      function SocialOK() {
        this.storeModel = new StoreModel_1.default();
        this.socialActive = true;
        this.friends = [];
        this.player = null;
      }
      SocialOK.prototype.login = function() {};
      SocialOK.prototype.isLogin = function() {
        return true;
      };
      SocialOK.prototype.getAddress = function() {
        return window.csiAddress && "" != window.csiAddress ? window.csiAddress : Constants.SERVER_ADDRESS_WS;
      };
      SocialOK.prototype.getCurrencyCode = function() {
        return "OK";
      };
      SocialOK.prototype.getDVDCurrencyCode = function() {
        return "RUB";
      };
      SocialOK.prototype.getDVDCurrencyMultiplier = function() {
        return 1;
      };
      SocialOK.prototype.getDVDKey = function() {
        return window.devtodevKey;
      };
      SocialOK.prototype.getUserData = function(callback) {
        if (this.player) {
          callback(this.player);
          return;
        }
        var _this = this;
        try {
          FAPI.Client.call({
            method: "users.getCurrentUser",
            fields: "name,pic128x128"
          }, function(status, data, error) {
            if (void 0 !== data && null !== data) {
              MainScene_1.default.log(JSON.stringify(data));
              _this.player = _this.mapSocialPlayer(data.name, data.pic128x128, data.uid);
              callback(_this.player);
            }
          });
        } catch (e) {
          callback(null);
        }
      };
      SocialOK.prototype.getConnectedPlayersAsync = function(callback) {
        var _this = this;
        try {
          FAPI.Client.call({
            method: "friends.getAppUsers"
          }, function(status, data, error) {
            var players = [];
            data && void 0 !== data["uids"] && data["uids"] && Array.isArray(data["uids"]) && data["uids"].forEach(function(uid) {
              return players.push(_this.mapSocialPlayer("", "", uid));
            });
            _this.friends = players;
            callback(players);
          });
        } catch (e) {
          callback([]);
        }
      };
      SocialOK.prototype.share = function(base64Url, text) {};
      SocialOK.prototype.invite = function(text) {
        FAPI.UI.showInvite(text);
      };
      SocialOK.prototype.sendNotification = function(text, usersIds) {
        FAPI.UI.showNotification(text, "", usersIds);
      };
      SocialOK.prototype.joinGroup = function() {};
      SocialOK.prototype.purchase = function(name) {
        var product = this.storeModel.getProductData(name);
        product && FAPI.UI.showPayment(product.name, "", product.id, product.price, null, null, "ok", "true");
      };
      SocialOK.prototype.purchaseOffer = function(id, name) {};
      SocialOK.prototype.checkPurchases = function() {};
      SocialOK.prototype.mapSocialPlayer = function(name, photoUrl, playerId) {
        var sp = new SocialPlayer_1.default();
        sp.name = name;
        sp.photoUrl = photoUrl;
        sp.playerID = playerId;
        MainScene_1.default.log("Player: " + JSON.stringify(sp));
        return sp;
      };
      return SocialOK;
    }();
    exports.default = SocialOK;
    cc._RF.pop();
  }, {
    "../../Scene/MainScene": "MainScene",
    "../Models/StoreModel": "StoreModel",
    "./SocialPlayer": "SocialPlayer"
  } ],
  SocialPlayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2e05d5kDhNEbK5URo+IcbJP", "SocialPlayer");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SocialPlayer = function() {
      function SocialPlayer() {
        this.name = "";
        this.photoUrl = "";
        this.playerID = "";
      }
      return SocialPlayer;
    }();
    exports.default = SocialPlayer;
    cc._RF.pop();
  }, {} ],
  SocialProxy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c9ff30sO8FHTrQMIsnYHp5r", "SocialProxy");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SocialAPI = void 0;
    var Proxy_1 = require("../PureMVC/Proxy");
    var SocialEmpty_1 = require("./Social/SocialEmpty");
    var SocialOK_1 = require("./Social/SocialOK");
    var MainScene_1 = require("../Scene/MainScene");
    var Constants_1 = require("../Constants");
    var SocialVK_1 = require("./Social/SocialVK");
    var SocialIOS_1 = require("./Social/SocialIOS");
    var SocialAndroid_1 = require("./Social/SocialAndroid");
    var SocialAPI;
    (function(SocialAPI) {
      SocialAPI[SocialAPI["NONE"] = 0] = "NONE";
      SocialAPI[SocialAPI["OK"] = 1] = "OK";
      SocialAPI[SocialAPI["VK"] = 2] = "VK";
      SocialAPI[SocialAPI["GOOGLE_PLAY"] = 3] = "GOOGLE_PLAY";
      SocialAPI[SocialAPI["APPSTORE"] = 4] = "APPSTORE";
    })(SocialAPI = exports.SocialAPI || (exports.SocialAPI = {}));
    var SocialProxy = function(_super) {
      __extends(SocialProxy, _super);
      function SocialProxy() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._timer = null;
        return _this;
      }
      SocialProxy.NAME = function() {
        return "SocialProxy";
      };
      SocialProxy.prototype.NAME = function() {
        return SocialProxy.NAME();
      };
      SocialProxy.prototype.onRegister = function() {
        var _this = this;
        try {
          this.detectSocialAPI();
        } catch (error) {}
        this._timer = new Constants_1.TimerObject(1e3, function(dt) {
          _this.getSocial() && _this.getSocial().storeModel;
        });
        this._timer.start();
      };
      SocialProxy.prototype.onRemove = function() {
        this._timer.stop();
      };
      SocialProxy.prototype.getSocial = function() {
        return SocialProxy._social;
      };
      SocialProxy.prototype.getSocialApi = function() {
        return SocialProxy._socialApi;
      };
      SocialProxy.prototype.detectSocialAPI = function() {
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS) {
          SocialProxy._socialApi = SocialAPI.APPSTORE;
          SocialProxy._social = new SocialIOS_1.default();
          MainScene_1.default.log("Init Social.APPSTORE");
          return;
        }
        if (cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID) {
          SocialProxy._socialApi = SocialAPI.GOOGLE_PLAY;
          SocialProxy._social = new SocialAndroid_1.default();
          MainScene_1.default.log("Init Social.GOOGLE_PLAY");
          return;
        }
        try {
          if (FAPI) {
            if (SocialProxy._socialApi != SocialAPI.OK) {
              var rParams = FAPI.Util.getRequestParameters();
              window["API_callback"] = function(method, result, data) {};
              FAPI.init(rParams["api_server"], rParams["apiconnection"], function() {
                SocialProxy._socialApi = SocialAPI.OK;
                SocialProxy._social = new SocialOK_1.default();
                SocialProxy._social.getUserData(function() {});
                SocialProxy._social.getConnectedPlayersAsync(function() {});
                MainScene_1.default.log("Init SocialOK");
              }, function(error) {
                MainScene_1.default.showErrorMessage(true, "API error: " + JSON.stringify(error));
              });
            }
            return;
          }
        } catch (error) {
          cc.log(error);
        }
        try {
          if (VK) {
            SocialProxy._socialApi != SocialAPI.VK && VK.init(function() {
              SocialProxy._socialApi = SocialAPI.VK;
              SocialProxy._social = new SocialVK_1.default();
              SocialProxy._social.getUserData(function() {});
              SocialProxy._social.getConnectedPlayersAsync(function() {});
              MainScene_1.default.log("Init SocialVK");
            }, function() {
              MainScene_1.default.showErrorMessage(true, "API error:");
            }, "5.101");
            return;
          }
        } catch (error) {
          cc.log(error);
        }
        SocialProxy._socialApi = SocialAPI.NONE;
        SocialProxy._social = new SocialEmpty_1.default();
        MainScene_1.default.log("Init SocialEmpty");
      };
      SocialProxy._socialApi = SocialAPI.NONE;
      SocialProxy._social = null;
      return SocialProxy;
    }(Proxy_1.default);
    exports.default = SocialProxy;
    cc._RF.pop();
  }, {
    "../Constants": "Constants",
    "../PureMVC/Proxy": "Proxy",
    "../Scene/MainScene": "MainScene",
    "./Social/SocialAndroid": "SocialAndroid",
    "./Social/SocialEmpty": "SocialEmpty",
    "./Social/SocialIOS": "SocialIOS",
    "./Social/SocialOK": "SocialOK",
    "./Social/SocialVK": "SocialVK"
  } ],
  SocialVK: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "05ff6ZWzplAvIfCrs04VT3p", "SocialVK");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SocialPlayer_1 = require("./SocialPlayer");
    var Constants_1 = require("../../Constants");
    var StoreModel_1 = require("../Models/StoreModel");
    var MainScene_1 = require("../../Scene/MainScene");
    var SocialVK = function() {
      function SocialVK() {
        this.storeModel = new StoreModel_1.default();
        this.socialActive = true;
        this.friends = [];
        this.player = null;
      }
      SocialVK.prototype.login = function() {};
      SocialVK.prototype.isLogin = function() {
        return true;
      };
      SocialVK.prototype.getAddress = function() {
        return window.csiAddress && "" != window.csiAddress ? window.csiAddress : Constants_1.default.SERVER_ADDRESS_WS;
      };
      SocialVK.prototype.getCurrencyCode = function() {
        return "\u0413\u041e\u041b\u041e\u0421\u041e\u0412";
      };
      SocialVK.prototype.getDVDCurrencyCode = function() {
        return "RUB";
      };
      SocialVK.prototype.getDVDCurrencyMultiplier = function() {
        return 7;
      };
      SocialVK.prototype.getDVDKey = function() {
        return window.devtodevKey;
      };
      SocialVK.prototype.getUserData = function(callback) {
        if (this.player) {
          callback(this.player);
          return;
        }
        var _this = this;
        try {
          VK.api("users.get", {
            fields: "first_name, photo_100"
          }, function(data) {
            if (data && void 0 !== data["response"] && Array.isArray(data["response"]) && data["response"].length > 0) {
              MainScene_1.default.log(JSON.stringify(data));
              _this.player = _this.mapSocialPlayer(data.response[0].first_name, data.response[0].photo_100, data.response[0].id);
              callback(_this.player);
            }
          });
        } catch (e) {
          callback(null);
        }
      };
      SocialVK.prototype.getConnectedPlayersAsync = function(callback) {
        var _this = this;
        try {
          VK.api("friends.getAppUsers", {}, function(data) {
            var players = [];
            if (data && void 0 !== data["response"] && Array.isArray(data["response"])) {
              MainScene_1.default.log(JSON.stringify(data));
              data["response"].forEach(function(uid) {
                return players.push(_this.mapSocialPlayer("", "", uid.toString()));
              });
            }
            _this.friends = players;
            callback(players);
          });
        } catch (e) {
          callback([]);
        }
      };
      SocialVK.prototype.share = function(base64Url, text) {};
      SocialVK.prototype.invite = function(text) {
        VK.callMethod("showInviteBox");
      };
      SocialVK.prototype.sendNotification = function(text, usersId) {
        VK.callMethod("showRequestBox", usersId[0], text, "");
      };
      SocialVK.prototype.joinGroup = function() {};
      SocialVK.prototype.purchase = function(name) {
        var product = this.storeModel.getProductData(name);
        if (product) {
          var params = {
            type: "item",
            item: product.id
          };
          VK.callMethod("showOrderBox", params);
        }
      };
      SocialVK.prototype.purchaseOffer = function(id, name) {};
      SocialVK.prototype.checkPurchases = function() {};
      SocialVK.prototype.mapSocialPlayer = function(name, photoUrl, playerId) {
        var sp = new SocialPlayer_1.default();
        sp.name = name;
        sp.photoUrl = photoUrl;
        sp.playerID = playerId;
        MainScene_1.default.log("Player: " + JSON.stringify(sp));
        return sp;
      };
      return SocialVK;
    }();
    exports.default = SocialVK;
    cc._RF.pop();
  }, {
    "../../Constants": "Constants",
    "../../Scene/MainScene": "MainScene",
    "../Models/StoreModel": "StoreModel",
    "./SocialPlayer": "SocialPlayer"
  } ],
  SoundMediator: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a59aWsr+JLf4DNf3wv98ER", "SoundMediator");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Mediator_1 = require("../PureMVC/Mediator");
    var MessageConfig_1 = require("../PureMVC/MessageConfig");
    var MainScene_1 = require("../Scene/MainScene");
    var Loader_1 = require("../Utils/Loader");
    var Utils_1 = require("../Utils/Utils");
    var Facade_1 = require("../PureMVC/Facade");
    var SettingsProxy_1 = require("../Proxy/SettingsProxy");
    var AudioState = cc.audioEngine.AudioState;
    var Constants_1 = require("../Constants");
    var SoundMediator = function(_super) {
      __extends(SoundMediator, _super);
      function SoundMediator() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isMute = false;
        _this.isMuteMusic = false;
        _this._currentMusic = "";
        return _this;
      }
      SoundMediator.NAME = function() {
        return "SoundMediator";
      };
      SoundMediator.prototype.NAME = function() {
        return SoundMediator.NAME();
      };
      SoundMediator.prototype.onRegister = function() {
        var prefab = Loader_1.default.getRes(Constants_1.default.BUNDLE_GENERAL, "csd/SoundSources", cc.Prefab);
        this.content = cc.instantiate(prefab);
        cc.director.getScene().getChildByName("Canvas").getComponent(MainScene_1.default).content.addChild(this.content);
        var sound_mute = Facade_1.default.getInstance().retrieveProxy(SettingsProxy_1.default).getItem(MessageConfig_1.default.SOUND_MUTE);
        this.isMute = void 0 !== sound_mute && "true" === sound_mute;
        this.mute(this.isMute);
        var music_mute = Facade_1.default.getInstance().retrieveProxy(SettingsProxy_1.default).getItem(MessageConfig_1.default.MUSIC_MUTE);
        this.isMuteMusic = void 0 !== music_mute && "true" === music_mute;
        this.muteMusic(this.isMuteMusic);
      };
      SoundMediator.prototype.onRemove = function() {
        this.stopMusic();
        if (this.content) {
          this.content.children.forEach(function(child) {
            child.getComponent(cc.AudioSource).stop();
          });
          Utils_1.default.removeFromParent(this.content);
        }
      };
      SoundMediator.prototype.listNotificationInterests = function() {
        this.notificationInterests = [ MessageConfig_1.default.PLAY_SOUND, MessageConfig_1.default.PLAY_LOOP_SOUND, MessageConfig_1.default.STOP_SOUND, MessageConfig_1.default.PLAY_SLOT_SOUND, MessageConfig_1.default.PLAY_SLOT_LOOP_SOUND, MessageConfig_1.default.PAUSE_SLOT_LOOP_SOUND, MessageConfig_1.default.STOP_SLOT_SOUND, MessageConfig_1.default.PLAY_MUSIC, MessageConfig_1.default.STOP_MUSIC, MessageConfig_1.default.PLAY_SLOT_MUSIC, MessageConfig_1.default.STOP_SLOT_MUSIC, MessageConfig_1.default.PLAY_SLOT_AUDIO, MessageConfig_1.default.SOUND_MUTE, MessageConfig_1.default.MUSIC_MUTE, MessageConfig_1.default.SLOT_SOUND_SET_TIME, MessageConfig_1.default.GET_SLOT_SOUND_DURATION, MessageConfig_1.default.IS_SLOT_SOUND_PLAYING, MessageConfig_1.default.IS_SLOT_SOUND_EXIST, MessageConfig_1.default.STOP_ALL_SOUNDS, MessageConfig_1.default.STOP_ALL_FX, MessageConfig_1.default.PAUSE_MUSIC, MessageConfig_1.default.RESUME_MUSIC ];
      };
      SoundMediator.prototype.handleNotification = function(notification) {
        notification.notificationName == MessageConfig_1.default.PLAY_SOUND ? this.playSound(notification.body, false) : notification.notificationName == MessageConfig_1.default.PLAY_LOOP_SOUND ? this.playSound(notification.body, true) : notification.notificationName == MessageConfig_1.default.STOP_SOUND ? this.stopSound(notification.body) : notification.notificationName == MessageConfig_1.default.PLAY_SLOT_SOUND ? this.playSlotSound(notification.body) : notification.notificationName == MessageConfig_1.default.PLAY_SLOT_LOOP_SOUND ? this.playSlotLoopSound(notification.body) : notification.notificationName == MessageConfig_1.default.PAUSE_SLOT_LOOP_SOUND ? this.pauseSlotLoopSound(notification.body, false) : notification.notificationName == MessageConfig_1.default.STOP_SLOT_SOUND ? this.stopSlotSound(notification.body) : notification.notificationName == MessageConfig_1.default.PLAY_MUSIC ? this.playMusic(notification.body) : notification.notificationName == MessageConfig_1.default.STOP_MUSIC ? this.stopMusic() : notification.notificationName == MessageConfig_1.default.PLAY_SLOT_MUSIC ? this.playSlotMusic(notification.body) : notification.notificationName == MessageConfig_1.default.STOP_SLOT_MUSIC ? this.stopMusic() : notification.notificationName == MessageConfig_1.default.PAUSE_MUSIC ? this.pauseMusic() : notification.notificationName == MessageConfig_1.default.RESUME_MUSIC ? this.resumeMusic() : notification.notificationName == MessageConfig_1.default.SOUND_MUTE ? this.mute(notification.body) : notification.notificationName == MessageConfig_1.default.MUSIC_MUTE ? this.muteMusic(notification.body) : notification.notificationName == MessageConfig_1.default.SLOT_SOUND_SET_TIME ? this.setCurrentTime(notification.body["name"], notification.body["time"]) : notification.notificationName == MessageConfig_1.default.GET_SLOT_SOUND_DURATION ? notification.body["duration"] = this.getSlotSoundDuration(notification.body["name"], notification.body["duration"]) : notification.notificationName == MessageConfig_1.default.IS_SLOT_SOUND_PLAYING ? notification.body["isPlaying"] = this.isSlotSoundPlaying(notification.body["name"]) : notification.notificationName == MessageConfig_1.default.IS_SLOT_SOUND_EXIST ? notification.body["isExist"] = this.isSlotSoundExist(notification.body["name"]) : notification.notificationName == MessageConfig_1.default.PLAY_SLOT_AUDIO ? this.playSlotAudio(notification.body) : notification.notificationName == MessageConfig_1.default.STOP_ALL_SOUNDS ? this.stopAll() : notification.notificationName == MessageConfig_1.default.STOP_ALL_FX && this.stopAllFX();
      };
      SoundMediator.prototype.playSound = function(name, loop) {
        this.stopSound(name);
        var soundSource = Utils_1.default.getChildComponent(cc.AudioSource, name, this.content);
        if (soundSource) {
          void 0 === soundSource["soundIds"] && (soundSource["soundIds"] = []);
          soundSource["soundIds"].push(cc.audioEngine.play(soundSource.clip, loop, this.isMute ? 0 : 1));
        }
      };
      SoundMediator.prototype.stopSound = function(name) {
        var soundSource = Utils_1.default.getChildComponent(cc.AudioSource, name, this.content);
        if (soundSource && void 0 !== soundSource["soundIds"]) {
          soundSource["soundIds"].forEach(function(soundId) {
            cc.audioEngine.stop(soundId);
          });
          soundSource["soundIds"] = [];
        }
        if (soundSource && void 0 !== soundSource["soundId"]) {
          cc.audioEngine.stop(soundSource["soundId"]);
          delete soundSource["soundId"];
        }
      };
      SoundMediator.prototype.playSlotSound = function(name) {
        this.stopSlotSound(name);
        this.playSlotAudio(name);
      };
      SoundMediator.prototype.playSlotAudio = function(name) {
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (!contentMediator) return;
        var soundSource = contentMediator.getSoundSource(name);
        if (soundSource) {
          void 0 === soundSource["soundIds"] && (soundSource["soundIds"] = []);
          soundSource["soundIds"].push(cc.audioEngine.play(soundSource.clip, false, this.isMute ? 0 : 1));
        }
      };
      SoundMediator.prototype.setCurrentTime = function(name, time) {
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (!contentMediator) return;
        var soundSource = contentMediator.getSoundSource(name);
        soundSource && void 0 !== soundSource["soundId"] ? cc.audioEngine.setCurrentTime(soundSource["soundId"], time) : soundSource && (soundSource["startTime"] = time);
      };
      SoundMediator.prototype.playSlotLoopSound = function(name) {
        var _this = this;
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (!contentMediator) return;
        var soundSource = contentMediator.getSoundSource(name);
        if (soundSource) {
          void 0 === soundSource["tweenObj"] && (soundSource["tweenObj"] = {
            volume: 1
          });
          if (void 0 === soundSource["soundId"]) {
            cc.Tween.stopAllByTarget(soundSource["tweenObj"]);
            soundSource["tweenObj"].isActive = false;
            soundSource["tweenObj"].needResume = false;
            soundSource["tweenObj"].volume = this.isMute ? 0 : 1;
            this.stopSlotSound(name);
            soundSource["soundId"] = cc.audioEngine.play(soundSource.clip, true, soundSource["tweenObj"].volume);
            if (void 0 !== soundSource["startTime"]) {
              cc.audioEngine.setCurrentTime(soundSource["soundId"], soundSource["startTime"]);
              delete soundSource["startTime"];
            }
          } else if (cc.audioEngine.getState(soundSource["soundId"]) != AudioState.PLAYING) {
            cc.Tween.stopAllByTarget(soundSource["tweenObj"]);
            soundSource["tweenObj"].isActive = true;
            soundSource["tweenObj"].needResume = false;
            this.stopSlotFX(name);
            cc.audioEngine.setVolume(soundSource["soundId"], this.isMute ? 0 : soundSource["tweenObj"].volume);
            cc.audioEngine.resume(soundSource["soundId"]);
            cc.tween(soundSource["tweenObj"]).parallel(cc.tween().to(SoundMediator.FADE_TIME, {
              volume: this.isMute ? 0 : 1
            }), cc.tween().repeat(30, cc.tween().delay(SoundMediator.FADE_TIME / 30).call(function() {
              soundSource["tweenObj"].isActive && cc.audioEngine.setVolume(soundSource["soundId"], soundSource["tweenObj"].volume);
            }))).call(function() {
              if (soundSource["tweenObj"].isActive) {
                soundSource["tweenObj"].volume = _this.isMute ? 0 : 1;
                cc.audioEngine.setVolume(soundSource["soundId"], soundSource["tweenObj"].volume);
              }
            }).start();
          } else if (cc.audioEngine.getState(soundSource["soundId"]) == AudioState.PLAYING) {
            cc.Tween.stopAllByTarget(soundSource["tweenObj"]);
            soundSource["tweenObj"].isActive = false;
            soundSource["tweenObj"].needResume = false;
            soundSource["tweenObj"].volume = this.isMute ? 0 : 1;
            this.stopSlotFX(name);
            cc.audioEngine.setVolume(soundSource["soundId"], soundSource["tweenObj"].volume);
            cc.audioEngine.resume(soundSource["soundId"]);
          }
        }
      };
      SoundMediator.prototype.pauseSlotLoopSound = function(name, needResume) {
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (!contentMediator) return;
        var soundSource = contentMediator.getSoundSource(name);
        if (soundSource && void 0 !== soundSource["soundId"] && cc.audioEngine.getState(soundSource["soundId"]) == AudioState.PLAYING) {
          void 0 === soundSource["tweenObj"] && (soundSource["tweenObj"] = {
            volume: this.isMute ? 0 : 1
          });
          cc.Tween.stopAllByTarget(soundSource["tweenObj"]);
          soundSource["tweenObj"].isActive = true;
          soundSource["tweenObj"].needResume = needResume;
          cc.log("PAUSE: volume", soundSource["tweenObj"].volume);
          cc.tween(soundSource["tweenObj"]).parallel(cc.tween().to(SoundMediator.FADE_TIME, {
            volume: 0
          }), cc.tween().repeat(30, cc.tween().delay(SoundMediator.FADE_TIME / 30).call(function() {
            soundSource["tweenObj"].isActive && cc.audioEngine.setVolume(soundSource["soundId"], soundSource["tweenObj"].volume);
          }))).call(function() {
            if (soundSource["tweenObj"].isActive) {
              soundSource["tweenObj"].volume = 0;
              cc.audioEngine.setVolume(soundSource["soundId"], soundSource["tweenObj"].volume);
              cc.audioEngine.pause(soundSource["soundId"]);
            }
          }).start();
        }
      };
      SoundMediator.prototype.stopSlotSound = function(name) {
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (!contentMediator) return;
        var soundSource = contentMediator.getSoundSource(name);
        if (soundSource) {
          if (void 0 !== soundSource["soundId"]) {
            cc.audioEngine.stop(soundSource["soundId"]);
            delete soundSource["soundId"];
          }
          if (void 0 !== soundSource["soundIds"]) {
            soundSource["soundIds"].forEach(function(soundId) {
              cc.audioEngine.stop(soundId);
            });
            soundSource["soundIds"] = [];
          }
          if (soundSource["tweenObj"]) {
            soundSource["tweenObj"].needResume = false;
            soundSource["tweenObj"].volume = this.isMute ? 0 : 1;
          }
        }
      };
      SoundMediator.prototype.stopSlotFX = function(name) {
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (!contentMediator) return;
        var soundSource = contentMediator.getSoundSource(name);
        if (soundSource && void 0 !== soundSource["soundIds"]) {
          soundSource["soundIds"].forEach(function(soundId) {
            cc.audioEngine.stop(soundId);
          });
          soundSource["soundIds"] = [];
        }
      };
      SoundMediator.prototype.playMusic = function(name) {
        var soundSource = Utils_1.default.getChildComponent(cc.AudioSource, name, this.content);
        if (soundSource) {
          if (void 0 !== soundSource["soundId"] || name == this._currentMusic) return;
          this.stopMusic();
          this._currentMusic = name;
          soundSource["soundId"] = cc.audioEngine.playMusic(soundSource.clip, true);
          cc.audioEngine.setVolume(soundSource["soundId"], this.isMuteMusic ? 0 : 1);
        } else this.stopMusic();
      };
      SoundMediator.prototype.playSlotMusic = function(name) {
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (!contentMediator) {
          this.stopMusic();
          return;
        }
        var soundSource = contentMediator.getSoundSource(name);
        if (soundSource) {
          if (void 0 !== soundSource["soundId"] || name == this._currentMusic) return;
          this.stopMusic();
          this._currentMusic = name;
          soundSource["soundId"] = cc.audioEngine.playMusic(soundSource.clip, true);
          cc.audioEngine.setVolume(soundSource["soundId"], this.isMuteMusic ? 0 : 1);
        } else this.stopMusic();
      };
      SoundMediator.prototype.stopMusic = function() {
        var soundSource = Utils_1.default.getChildComponent(cc.AudioSource, this._currentMusic, this.content);
        if (soundSource && void 0 !== soundSource["soundId"]) {
          if (void 0 !== soundSource["tweenObj"]) {
            cc.Tween.stopAllByTarget(soundSource["tweenObj"]);
            soundSource["tweenObj"].isActive = false;
          }
          cc.audioEngine.stop(soundSource["soundId"]);
          delete soundSource["soundId"];
        }
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (contentMediator) {
          var soundSource_1 = contentMediator.getSoundSource(this._currentMusic);
          if (soundSource_1 && void 0 !== soundSource_1["soundId"]) {
            if (void 0 !== soundSource_1["tweenObj"]) {
              cc.Tween.stopAllByTarget(soundSource_1["tweenObj"]);
              soundSource_1["tweenObj"].isActive = false;
            }
            cc.audioEngine.stop(soundSource_1["soundId"]);
            delete soundSource_1["soundId"];
          }
        }
        cc.audioEngine.stopMusic();
        this._currentMusic = "";
      };
      SoundMediator.prototype.pauseMusic = function() {
        var _this = this;
        var soundSource = Utils_1.default.getChildComponent(cc.AudioSource, this._currentMusic, this.content);
        if (!soundSource || void 0 === soundSource["soundId"]) {
          var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
          if (contentMediator) {
            soundSource = contentMediator.getSoundSource(this._currentMusic);
            var soundsNode = Utils_1.default.getChild("sounds", contentMediator.content);
            soundsNode && soundsNode.children.forEach(function(node) {
              var ss = node.getComponent(cc.AudioSource);
              ss && void 0 !== ss["soundId"] && void 0 !== ss["tweenObj"] && cc.audioEngine.getState(ss["soundId"]) == AudioState.PLAYING && _this.pauseSlotLoopSound(node.name, true);
            });
          }
        }
        if (soundSource && void 0 !== soundSource["soundId"]) {
          void 0 === soundSource["tweenObj"] && (soundSource["tweenObj"] = {
            volume: this.isMuteMusic ? 0 : 1
          });
          cc.Tween.stopAllByTarget(soundSource["tweenObj"]);
          soundSource["tweenObj"].isActive = true;
          cc.log("PAUSE: volume", soundSource["tweenObj"].volume);
          cc.tween(soundSource["tweenObj"]).parallel(cc.tween().to(SoundMediator.FADE_TIME, {
            volume: 0
          }), cc.tween().repeat(30, cc.tween().delay(SoundMediator.FADE_TIME / 30).call(function() {
            soundSource["tweenObj"].isActive && cc.audioEngine.setMusicVolume(soundSource["tweenObj"].volume);
          }))).call(function() {
            if (soundSource["tweenObj"].isActive) {
              soundSource["tweenObj"].volume = 0;
              soundSource["tweenObj"].isActive = false;
              cc.audioEngine.setMusicVolume(soundSource["tweenObj"].volume);
              cc.audioEngine.pauseMusic();
            }
          }).start();
        }
      };
      SoundMediator.prototype.resumeMusic = function() {
        var _this = this;
        var soundSource = Utils_1.default.getChildComponent(cc.AudioSource, this._currentMusic, this.content);
        if (!soundSource || void 0 === soundSource["soundId"]) {
          var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
          contentMediator && (soundSource = contentMediator.getSoundSource(this._currentMusic));
          var soundsNode = Utils_1.default.getChild("sounds", contentMediator.content);
          soundsNode && soundsNode.children.forEach(function(node) {
            var ss = node.getComponent(cc.AudioSource);
            ss && void 0 !== ss["soundId"] && void 0 !== ss["tweenObj"] && ss["tweenObj"].needResume && _this.playSlotLoopSound(node.name);
          });
        }
        if (soundSource && void 0 !== soundSource["soundId"] && void 0 !== soundSource["tweenObj"]) {
          cc.Tween.stopAllByTarget(soundSource["tweenObj"]);
          soundSource["tweenObj"].isActive = true;
          cc.audioEngine.setMusicVolume(this.isMuteMusic ? 0 : soundSource["tweenObj"].volume);
          cc.audioEngine.resumeMusic();
          cc.tween(soundSource["tweenObj"]).parallel(cc.tween().to(SoundMediator.FADE_TIME, {
            volume: this.isMuteMusic ? 0 : 1
          }), cc.tween().repeat(30, cc.tween().delay(SoundMediator.FADE_TIME / 30).call(function() {
            soundSource["tweenObj"].isActive && cc.audioEngine.setMusicVolume(soundSource["tweenObj"].volume);
          }))).call(function() {
            if (soundSource["tweenObj"].isActive) {
              soundSource["tweenObj"].isActive = false;
              soundSource["tweenObj"].volume = _this.isMuteMusic ? 0 : 1;
              cc.audioEngine.setMusicVolume(soundSource["tweenObj"].volume);
            }
          }).start();
        }
      };
      SoundMediator.prototype.mute = function(isMute) {
        this.isMute = isMute;
        Facade_1.default.getInstance().retrieveProxy(SettingsProxy_1.default).setItem(MessageConfig_1.default.SOUND_MUTE, isMute ? "true" : "false");
        this.isMute ? cc.audioEngine.setEffectsVolume(0) : cc.audioEngine.setEffectsVolume(1);
      };
      SoundMediator.prototype.muteMusic = function(isMute) {
        this.isMuteMusic = isMute;
        Facade_1.default.getInstance().retrieveProxy(SettingsProxy_1.default).setItem(MessageConfig_1.default.MUSIC_MUTE, isMute ? "true" : "false");
        this.isMuteMusic ? cc.audioEngine.setMusicVolume(0) : cc.audioEngine.setMusicVolume(1);
      };
      SoundMediator.prototype.getSlotSoundDuration = function(name, defaultDuration) {
        var dur = defaultDuration;
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (!contentMediator) return dur;
        var soundSource = contentMediator.getSoundSource(name);
        if (soundSource) {
          dur = soundSource.getDuration();
          if (!dur) {
            soundSource["_ensureDataLoaded"]();
            dur = soundSource.getDuration();
            dur || (dur = defaultDuration);
          }
        }
        return dur;
      };
      SoundMediator.prototype.isSlotSoundPlaying = function(name) {
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (!contentMediator) return false;
        var isPlaying = false;
        var soundSource = contentMediator.getSoundSource(name);
        soundSource && void 0 !== soundSource["soundId"] && (isPlaying = cc.audioEngine.getState(soundSource["soundId"]) == AudioState.PLAYING);
        soundSource && void 0 !== soundSource["soundIds"] && soundSource["soundIds"].forEach(function(soundId) {
          isPlaying || (isPlaying = cc.audioEngine.getState(soundId) == AudioState.PLAYING);
        });
        return isPlaying;
      };
      SoundMediator.prototype.isSlotSoundExist = function(name) {
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (!contentMediator) return false;
        return null != contentMediator.getSoundSource(name);
      };
      SoundMediator.prototype.stopAllFX = function() {
        var _this = this;
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (contentMediator) {
          var sounds = Utils_1.default.getChild("sounds", contentMediator.content);
          sounds && sounds.children.forEach(function(child) {
            _this.stopSlotFX(child.name);
          });
        }
      };
      SoundMediator.prototype.stopAll = function() {
        var _this = this;
        this.content.children.forEach(function(child) {
          _this.stopSound(child.name);
        });
        var contentMediator = Facade_1.default.getInstance().retrieveMediatorByName("SlotMediator");
        if (contentMediator) {
          var sounds = Utils_1.default.getChild("sounds", contentMediator.content);
          sounds && sounds.children.forEach(function(child) {
            _this.stopSlotSound(child.name);
          });
        }
        this.stopMusic();
        cc.audioEngine.stopAll();
      };
      SoundMediator.FADE_TIME = 1;
      return SoundMediator;
    }(Mediator_1.default);
    exports.default = SoundMediator;
    cc._RF.pop();
  }, {
    "../Constants": "Constants",
    "../Proxy/SettingsProxy": "SettingsProxy",
    "../PureMVC/Facade": "Facade",
    "../PureMVC/Mediator": "Mediator",
    "../PureMVC/MessageConfig": "MessageConfig",
    "../Scene/MainScene": "MainScene",
    "../Utils/Loader": "Loader",
    "../Utils/Utils": "Utils"
  } ],
  SpeakingTextWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "079a064pedMp5tfMauIrrTS", "SpeakingTextWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Constants_1 = require("../../Constants");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode;
    var SpeakingTextWidget = function(_super) {
      __extends(SpeakingTextWidget, _super);
      function SpeakingTextWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.hideColor = cc.Color.BLACK;
        _this.timePerChar = .1;
        _this.preview = false;
        _this._speakingText = "";
        _this._countObject = new Constants_1.CountObject();
        return _this;
      }
      Object.defineProperty(SpeakingTextWidget.prototype, "speakingText", {
        get: function() {
          return this._speakingText;
        },
        set: function(value) {
          this._speakingText = value;
          this.speak();
        },
        enumerable: false,
        configurable: true
      });
      SpeakingTextWidget.prototype.onLoad = function() {
        this.speak();
      };
      SpeakingTextWidget.prototype.updateInstantly = function() {
        this._countObject.stop();
        this.updateString(this._speakingText.length);
      };
      SpeakingTextWidget.prototype.speak = function() {
        var _this = this;
        this.updateString(0);
        var prev = 0;
        this._countObject.stop();
        this._countObject.run(function(count) {
          var cur = Math.round(count);
          if (cur == prev) return;
          prev = cur;
          _this.updateString(cur);
        });
        cc.tween(this._countObject).to(this.timePerChar * this._speakingText.length, {
          count: this._speakingText.length
        }).start();
      };
      SpeakingTextWidget.prototype.updateString = function(visibleCount) {
        if (0 == this._speakingText.length) {
          this.string = this._speakingText;
          return;
        }
        this.string = "<color=" + this.node.color.toHEX("#rrggbb") + ">" + this._speakingText.substr(0, visibleCount) + "</c><color=" + (this.preview ? this.node.color.toHEX("#rrggbb") : this.hideColor.toHEX("#rrggbb")) + ">" + this._speakingText.substr(visibleCount) + "</color>";
      };
      __decorate([ property({
        type: cc.String,
        multiline: true
      }) ], SpeakingTextWidget.prototype, "speakingText", null);
      __decorate([ property(cc.Color) ], SpeakingTextWidget.prototype, "hideColor", void 0);
      __decorate([ property() ], SpeakingTextWidget.prototype, "timePerChar", void 0);
      __decorate([ property(cc.Boolean) ], SpeakingTextWidget.prototype, "preview", void 0);
      SpeakingTextWidget = __decorate([ ccclass, executeInEditMode ], SpeakingTextWidget);
      return SpeakingTextWidget;
    }(cc.RichText);
    exports.default = SpeakingTextWidget;
    cc._RF.pop();
  }, {
    "../../Constants": "Constants"
  } ],
  SpineProgressBarWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bd5b9h2zENJca6+NMOpTICT", "SpineProgressBarWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Mode = cc.Enum({
      HORIZONTAL: 0,
      VERTICAL: 1
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode;
    var SpineProgressBarWidget = function(_super) {
      __extends(SpineProgressBarWidget, _super);
      function SpineProgressBarWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.spine = null;
        _this.track = 0;
        _this.label = null;
        _this.mode = Mode.HORIZONTAL;
        _this.isAutoprogress = false;
        _this.isCanBackProgress = false;
        _this.suffix = "%";
        _this.length = 100;
        _this.speed = 3.5;
        _this.precision = 0;
        _this.onComplete = function() {};
        _this.onProgress = function(progress) {};
        _this._progress = 1;
        _this._targetProgress = 0;
        _this._isComplete = false;
        _this._stopUpdate = false;
        return _this;
      }
      Object.defineProperty(SpineProgressBarWidget.prototype, "progress", {
        get: function() {
          return this._progress;
        },
        set: function(value) {
          this._progress = value;
          this.updateProgress();
        },
        enumerable: false,
        configurable: true
      });
      SpineProgressBarWidget.prototype.onLoad = function() {};
      SpineProgressBarWidget.prototype.onFocusInEditor = function() {
        this._progress = this.progress;
        this.updateProgress();
      };
      SpineProgressBarWidget.prototype.onLostFocusInEditor = function() {
        this._progress = this.progress;
        this.updateProgress();
      };
      SpineProgressBarWidget.prototype.setProgress = function(progress, isFast) {
        void 0 === isFast && (isFast = false);
        progress = cc.misc.clampf(progress, 0, 1);
        this._stopUpdate = false;
        if (isFast) {
          this._targetProgress = progress;
          this._progress = this._targetProgress;
        } else {
          if (this.isAutoprogress && progress <= this._progress) return;
          if (this._progress > progress && !this.isCanBackProgress) {
            this._progress = progress;
            this._targetProgress = this._progress;
          } else this._targetProgress = progress;
        }
      };
      SpineProgressBarWidget.prototype.getProgress = function() {
        return this._targetProgress;
      };
      SpineProgressBarWidget.prototype.updateProgress = function() {
        if (!this.spine) return;
        this.spine.setAnimation(this.track, "progress-bar", false);
        var bone = this.spine.findBone("prg");
        if (!bone) return;
        this.mode == Mode.HORIZONTAL ? bone.x = this.length * this._progress : bone.y = this.length * this._progress;
      };
      SpineProgressBarWidget.prototype.updateLabel = function() {
        if (this.label) {
          var percent = 0;
          percent = this.precision > 0 ? Math.round(100 * this._progress * Math.pow(10, this.precision)) / Math.pow(10, this.precision) : Math.round(100 * this._progress);
          var str = percent.toString();
          if (this.precision > 0) {
            var index = str.indexOf(".");
            index < 0 && (str += ".");
            var suf = str.substring(str.indexOf("."));
            for (var i = 0; i < this.precision + 1; i++) i >= suf.length && (str += "0");
          }
          this.label.string = str + this.suffix;
        }
      };
      SpineProgressBarWidget.prototype.update = function(dt) {
        var _this = this;
        if (this._stopUpdate) return;
        if (this._progress < this._targetProgress) {
          this._progress += dt * this.speed;
          this._progress = cc.misc.clampf(this._progress, 0, this._targetProgress);
          this.onProgress(this._progress);
        } else if (this._progress > this._targetProgress && this.isCanBackProgress) {
          this._progress -= dt * this.speed;
          this._progress = cc.misc.clampf(this._progress, this._targetProgress, 1);
          this.onProgress(this._progress);
        } else if (this.isAutoprogress && this._progress > 0 && this._progress < .9) {
          this._progress += .01 * dt;
          this._progress = cc.misc.clampf(this._progress, 0, .9);
          this.onProgress(this._progress);
        } else this._progress == this._targetProgress && (!this.isAutoprogress || this._progress >= .9) && (this._stopUpdate = true);
        this.updateProgress();
        this.updateLabel();
        if (1 == this._progress && this.onComplete && !this._isComplete) {
          this.onProgress(this._progress);
          this._isComplete = true;
          this.unscheduleAllCallbacks();
          this.scheduleOnce(function() {
            _this.onComplete();
            _this.onComplete = function() {};
          }, .3);
        } else this._progress < 1 && (this._isComplete = false);
      };
      __decorate([ property(sp.Skeleton) ], SpineProgressBarWidget.prototype, "spine", void 0);
      __decorate([ property ], SpineProgressBarWidget.prototype, "track", void 0);
      __decorate([ property(cc.Label) ], SpineProgressBarWidget.prototype, "label", void 0);
      __decorate([ property({
        type: Mode
      }) ], SpineProgressBarWidget.prototype, "mode", void 0);
      __decorate([ property ], SpineProgressBarWidget.prototype, "isAutoprogress", void 0);
      __decorate([ property ], SpineProgressBarWidget.prototype, "isCanBackProgress", void 0);
      __decorate([ property ], SpineProgressBarWidget.prototype, "suffix", void 0);
      __decorate([ property({
        type: cc.Float,
        range: [ 0, 1, .1 ],
        slide: true
      }) ], SpineProgressBarWidget.prototype, "progress", null);
      __decorate([ property ], SpineProgressBarWidget.prototype, "length", void 0);
      __decorate([ property ], SpineProgressBarWidget.prototype, "speed", void 0);
      __decorate([ property ], SpineProgressBarWidget.prototype, "precision", void 0);
      SpineProgressBarWidget = __decorate([ ccclass, executeInEditMode ], SpineProgressBarWidget);
      return SpineProgressBarWidget;
    }(cc.Component);
    exports.default = SpineProgressBarWidget;
    cc._RF.pop();
  }, {} ],
  SpriteButton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6038doIRztAI5YM3t2Mpgxq", "SpriteButton");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Utils_1 = require("../../Utils/Utils");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SpriteButton = function(_super) {
      __extends(SpriteButton, _super);
      function SpriteButton() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.onTouchEnd = function() {};
        _this.disableColor = SpriteButton_1.DISABLED_COLOR;
        _this._isCancelled = false;
        _this._enabledButton = true;
        return _this;
      }
      SpriteButton_1 = SpriteButton;
      Object.defineProperty(SpriteButton.prototype, "enabledButton", {
        get: function() {
          return this._enabledButton;
        },
        set: function(enabled) {
          this._enabledButton = enabled;
          if (this._enabledButton) {
            this.node.color = SpriteButton_1.ENABLED_COLOR;
            Utils_1.default.setChildOpacity(SpriteButton_1.ENABLED_COLOR.getR(), this.node);
          } else {
            this.node.color = this.disableColor;
            Utils_1.default.setChildOpacity(this.disableColor.getA(), this.node);
          }
        },
        enumerable: false,
        configurable: true
      });
      SpriteButton.prototype.onLoad = function() {
        this.node.on("touchstart", function(event) {
          this.processTouch(cc.Node.EventType.TOUCH_START, event.touch);
        }, this);
        this.node.on("touchend", function(event) {
          this.processTouch(cc.Node.EventType.TOUCH_END, event.touch);
        }, this);
        this.node.on("touchmove", function(event) {
          this.processTouch(cc.Node.EventType.TOUCH_MOVE, event.touch);
        }, this);
      };
      SpriteButton.prototype.processTouch = function(eventType, touch) {
        if (!this._enabledButton) return;
        switch (eventType) {
         case cc.Node.EventType.TOUCH_START:
          this._isCancelled = false;
          this.node.color = this.disableColor;
          Utils_1.default.setChildOpacity(this.disableColor.getR(), this.node);
          break;

         case cc.Node.EventType.TOUCH_END:
          if (this._isCancelled) break;
          this.node.color = SpriteButton_1.ENABLED_COLOR;
          Utils_1.default.setChildOpacity(SpriteButton_1.ENABLED_COLOR.getR(), this.node);
          this.onTouchEnd();
          break;

         case cc.Node.EventType.TOUCH_MOVE:
          if (this._isCancelled) break;
          var startLocation = touch.getStartLocationInView();
          var v1 = new cc.Vec2(startLocation.x, startLocation.y);
          var location = touch.getLocationInView();
          var v2 = new cc.Vec2(location.x, location.y);
          var dx = v1.x - v2.x;
          var dy = v1.y - v2.y;
          var delta = dx * dx + dy * dy;
          if (delta > 1e3) {
            this._isCancelled = true;
            this.node.color = SpriteButton_1.ENABLED_COLOR;
            Utils_1.default.setChildOpacity(SpriteButton_1.ENABLED_COLOR.getR(), this.node);
          }
        }
      };
      var SpriteButton_1;
      SpriteButton.ENABLED_COLOR = cc.Color.WHITE;
      SpriteButton.DISABLED_COLOR = new cc.Color(150, 150, 150, 255);
      SpriteButton = SpriteButton_1 = __decorate([ ccclass ], SpriteButton);
      return SpriteButton;
    }(cc.Sprite);
    exports.default = SpriteButton;
    cc._RF.pop();
  }, {
    "../../Utils/Utils": "Utils"
  } ],
  StartUp: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "146acdPUiVI04y/loDLf+qW", "StartUp");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Facade_1 = require("../PureMVC/Facade");
    var MessageConfig_1 = require("../PureMVC/MessageConfig");
    var FacadeCommand_1 = require("../PureMVC/FacadeCommand");
    var RunMainScenePreloader_1 = require("./RunMainScenePreloader");
    var RunMainScene_1 = require("./RunMainScene");
    var SessionAPI_1 = require("./ServerAPI/SessionAPI");
    var Login_1 = require("./ServerAPI/Login");
    var GetStartUpData_1 = require("./ServerAPI/GetStartUpData");
    var StartUp = function(_super) {
      __extends(StartUp, _super);
      function StartUp() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "StartUp";
        return _this;
      }
      StartUp.prototype.execute = function(notification) {
        Facade_1.default.getInstance().removeAllCommands();
        Facade_1.default.getInstance().removeAllMediators();
        Facade_1.default.getInstance().removeAllProxy();
        Facade_1.default.getInstance().registerCommand(new StartUp(), MessageConfig_1.default.START_UP);
        Facade_1.default.getInstance().registerCommand(new RunMainScene_1.default(), MessageConfig_1.default.RUN_MAIN_SCENE);
        Facade_1.default.getInstance().registerCommand(new RunMainScenePreloader_1.default(), MessageConfig_1.default.RUN_MAIN_SCENE_PRELOADER);
        Facade_1.default.getInstance().registerCommand(new Login_1.default(), MessageConfig_1.default.LOGIN);
        Facade_1.default.getInstance().registerCommand(new GetStartUpData_1.default(), MessageConfig_1.default.GET_START_UP_DATA);
        SessionAPI_1.default.register();
        Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.RUN_MAIN_SCENE_PRELOADER);
      };
      return StartUp;
    }(FacadeCommand_1.default);
    exports.default = StartUp;
    cc._RF.pop();
  }, {
    "../PureMVC/Facade": "Facade",
    "../PureMVC/FacadeCommand": "FacadeCommand",
    "../PureMVC/MessageConfig": "MessageConfig",
    "./RunMainScene": "RunMainScene",
    "./RunMainScenePreloader": "RunMainScenePreloader",
    "./ServerAPI/GetStartUpData": "GetStartUpData",
    "./ServerAPI/Login": "Login",
    "./ServerAPI/SessionAPI": "SessionAPI"
  } ],
  StoreModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ed121bOWMVLor/BpYA9D82z", "StoreModel");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SaleTimer = void 0;
    var SaleTimer = function() {
      function SaleTimer() {
        this.id = 0;
        this.left = 0;
      }
      return SaleTimer;
    }();
    exports.SaleTimer = SaleTimer;
    var StoreModel = function() {
      function StoreModel() {
        this.marketProducts = [];
        this.serverProducts = [];
      }
      StoreModel.prototype.getProduct = function(name) {
        var product = _.find(this.marketProducts, {
          name: name
        });
        var serverProduct = _.find(this.serverProducts, {
          code: name
        });
        if (product && serverProduct) {
          var p = _.cloneDeep(product);
          p.description = serverProduct.name;
          return p;
        }
        return null;
      };
      StoreModel.prototype.getProductData = function(name) {
        var serverProduct = _.find(this.serverProducts, {
          code: name
        });
        if (serverProduct) return serverProduct;
        return null;
      };
      StoreModel.prototype.getProductById = function(productId) {
        var serverProduct = _.find(this.serverProducts, {
          id: productId
        });
        if (serverProduct) {
          var product = _.find(this.marketProducts, {
            name: serverProduct.code
          });
          if (product) return _.cloneDeep(product);
          return _.cloneDeep(serverProduct);
        }
        return null;
      };
      return StoreModel;
    }();
    exports.default = StoreModel;
    cc._RF.pop();
  }, {} ],
  TabWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "13002UBWe9GyJPt6oYRlRju", "TabWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DefaultButtonWidget_1 = require("./DefaultButtonWidget");
    var Facade_1 = require("../../PureMVC/Facade");
    var MessageConfig_1 = require("../../PureMVC/MessageConfig");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, menu = _a.menu;
    var TabWidget = function(_super) {
      __extends(TabWidget, _super);
      function TabWidget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.selector = null;
        _this._name = "";
        _this._isSelected = false;
        return _this;
      }
      TabWidget.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
      };
      TabWidget.prototype.moveSelector = function(duration) {
        this._isSelected = true;
        if (0 == duration) {
          this.selector.position = cc.v2(this.node.position.x, this.selector.position.y);
          this.selector.width = this.node.width;
          return;
        }
        Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.PLAY_SOUND, "page-change-main");
        cc.tween(this.selector).stop();
        cc.tween(this.selector).to(duration, {
          position: cc.v2(this.node.position.x, this.selector.position.y),
          width: this.node.width
        }, {
          easing: "sineOut"
        }).start();
      };
      __decorate([ property(cc.Node) ], TabWidget.prototype, "selector", void 0);
      TabWidget = __decorate([ ccclass ], TabWidget);
      return TabWidget;
    }(DefaultButtonWidget_1.default);
    exports.default = TabWidget;
    cc._RF.pop();
  }, {
    "../../PureMVC/Facade": "Facade",
    "../../PureMVC/MessageConfig": "MessageConfig",
    "./DefaultButtonWidget": "DefaultButtonWidget"
  } ],
  TextUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "33cb836JypNYalLZ4IBnSRA", "TextUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TextUtil = function() {
      function TextUtil() {}
      TextUtil.setData = function(data) {
        TextUtil._data = data;
      };
      TextUtil.makeTextPath = function(path) {
        var p = _.split(path, ",");
        if (3 != p.length) return "";
        return TextUtil._data.json[p[0]][p[1]][p[2]];
      };
      TextUtil.makeText = function(section, container, key) {
        return TextUtil._data.json[section][container][key];
      };
      TextUtil.getTexts = function(section, container) {
        return TextUtil._data.json[section][container];
      };
      TextUtil._data = null;
      return TextUtil;
    }();
    exports.default = TextUtil;
    cc._RF.pop();
  }, {} ],
  ToggleWidget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fae3ahv+zpKuI3dFDcIZCGL", "ToggleWidget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Facade_1 = require("../../PureMVC/Facade");
    var MessageConfig_1 = require("../../PureMVC/MessageConfig");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ToggleWidget = function(_super) {
      __extends(ToggleWidget, _super);
      function ToggleWidget() {
        var _this_1 = null !== _super && _super.apply(this, arguments) || this;
        _this_1.frameOn = null;
        _this_1.frameOff = null;
        _this_1.toggleSpeed = 500;
        _this_1.swipeLimit = 5;
        _this_1._isOn = false;
        _this_1._isSwiping = false;
        _this_1._swipedX = 0;
        _this_1._prevX = 0;
        _this_1.onToggled = function(toggle) {};
        return _this_1;
      }
      ToggleWidget.prototype.onLoad = function() {
        this._button = this.node.getChildByName("btn");
        this._back = this.node.getChildByName("back");
        this._minX = this._button.getPosition().x;
        this._maxX = -this._minX;
        var _this = this;
        this.node.on("touchstart", function(event) {
          _this._button.stopAllActions();
          _this._isSwiping = false;
          _this._swipedX = 0;
          _this._prevX = _this._back.convertToNodeSpaceAR(event.getLocation()).x;
        }, this);
        this.node.on("touchend", function(event) {
          _this._isSwiping ? _this.runToggleAction(_this._button.getPosition().x > 0) : _this.runToggleAction(!_this._isOn);
        }, this);
        this.node.on("touchcancel", function(event) {
          _this._isSwiping ? _this.runToggleAction(_this._button.getPosition().x > 0) : _this.runToggleAction(!_this._isOn);
        }, this);
        this.node.on("touchmove", function(event) {
          var posX = _this._back.convertToNodeSpaceAR(event.getLocation()).x;
          _this._swipedX += Math.abs(_this._prevX - posX);
          _this._prevX = posX;
          _this._swipedX > _this.swipeLimit && (_this._isSwiping = true);
          _this._isSwiping && _this._button.setPosition(new cc.Vec2(cc.misc.clampf(posX, _this._minX, _this._maxX), _this._button.position.y));
        }, this);
        this.toggle(false);
      };
      ToggleWidget.prototype.runToggleAction = function(isOn) {
        var _this_1 = this;
        this._isOn = isOn;
        this.onToggled(this);
        this._button.stopAllActions();
        Facade_1.default.getInstance().sendNotification(MessageConfig_1.default.PLAY_SOUND, "click");
        var destX = isOn ? this._maxX : this._minX;
        cc.tween(this._button).stop().to(Math.abs(destX / this.toggleSpeed), {
          position: cc.v2(destX, this._button.position.y)
        }).call(function() {
          _this_1.toggle(_this_1._isOn);
        }).start();
      };
      ToggleWidget.prototype.toggle = function(isOn) {
        this._isOn = isOn;
        if (this._isOn) {
          this._back.getComponent(cc.Sprite).spriteFrame = this.frameOn;
          this._button.position = new cc.Vec2(this._maxX, this._button.position.y);
        } else {
          this._back.getComponent(cc.Sprite).spriteFrame = this.frameOff;
          this._button.position = new cc.Vec2(this._minX, this._button.position.y);
        }
      };
      ToggleWidget.prototype.isOn = function() {
        return this._isOn;
      };
      __decorate([ property(cc.SpriteFrame) ], ToggleWidget.prototype, "frameOn", void 0);
      __decorate([ property(cc.SpriteFrame) ], ToggleWidget.prototype, "frameOff", void 0);
      __decorate([ property ], ToggleWidget.prototype, "toggleSpeed", void 0);
      __decorate([ property ], ToggleWidget.prototype, "swipeLimit", void 0);
      ToggleWidget = __decorate([ ccclass ], ToggleWidget);
      return ToggleWidget;
    }(cc.Component);
    exports.default = ToggleWidget;
    cc._RF.pop();
  }, {
    "../../PureMVC/Facade": "Facade",
    "../../PureMVC/MessageConfig": "MessageConfig"
  } ],
  UpLevel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0c3b6hptahJy440I36/O8rR", "UpLevel");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var FacadeCommand_1 = require("../../../PureMVC/FacadeCommand");
    var SessionService_1 = require("../../../Proxy/Interfaces/SessionService");
    var UpLevel = function(_super) {
      __extends(UpLevel, _super);
      function UpLevel() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.name = "Session_UpLevel";
        return _this;
      }
      UpLevel.prototype.execute = function(notification) {
        notification.notificationName.startsWith("callback_") ? this.fromServer(notification.body) : this.toServer(notification.body);
      };
      UpLevel.prototype.toServer = function(body) {
        SessionService_1.default.upLevel();
      };
      UpLevel.prototype.fromServer = function(body) {};
      return UpLevel;
    }(FacadeCommand_1.default);
    exports.default = UpLevel;
    cc._RF.pop();
  }, {
    "../../../Proxy/Interfaces/SessionService": "SessionService",
    "../../../PureMVC/FacadeCommand": "FacadeCommand"
  } ],
  UserModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4777a7KifVIMqwMCQ6nKFIq", "UserModel");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var CsiSessionUser_1 = require("../../Utils/biser-legacy/csi/Objects/CsiSessionUser");
    var UserModel = function(_super) {
      __extends(UserModel, _super);
      function UserModel() {
        var _this = _super.call(this) || this;
        _this._coinsByReasonPool = [];
        _this._foodsByReasonPool = [];
        _this.levelRewardCoins = 0;
        return _this;
      }
      UserModel.prototype.addCoinsToPool = function(reason, newBalance) {
        var coins = bigInt(this.coins);
        this._coinsByReasonPool.forEach(function(coinsByReason) {
          coins = coins.add(coinsByReason.coins);
        });
        coins = newBalance.minus(coins);
        var coinsByReason = _.find(this._coinsByReasonPool, {
          reason: reason
        });
        if (!coinsByReason) {
          this._coinsByReasonPool.push({
            reason: reason,
            coins: coins
          });
          return;
        }
        coinsByReason.coins = coinsByReason.coins.plus(coins);
      };
      UserModel.prototype.getCoinsByReason = function(reason) {
        var coinsByReason = _.find(this._coinsByReasonPool, {
          reason: reason
        });
        if (!coinsByReason) return bigInt(0);
        return coinsByReason.coins;
      };
      UserModel.prototype.addCoinsToBalance = function(reason) {
        var coinsByReason = _.find(this._coinsByReasonPool, {
          reason: reason
        });
        if (!coinsByReason) return;
        this.coins = this.coins.add(coinsByReason.coins);
        coinsByReason.coins = bigInt(0);
      };
      UserModel.prototype.addAllToBalance = function() {
        var _this = this;
        this._coinsByReasonPool.forEach(function(coinsByReason) {
          _this.coins = _this.coins.add(coinsByReason.coins);
          coinsByReason.coins = bigInt(0);
        });
      };
      UserModel.prototype.addFoodsToPool = function(reason, newBalance) {
        var foods = this.foods;
        this._foodsByReasonPool.forEach(function(foodsByReason) {
          foods += foodsByReason.foods;
        });
        foods = newBalance - foods;
        var foodsByReason = _.find(this._foodsByReasonPool, {
          reason: reason
        });
        if (!foodsByReason) {
          this._foodsByReasonPool.push({
            reason: reason,
            foods: foods
          });
          return;
        }
        foodsByReason.foods = foodsByReason.foods + foods;
      };
      UserModel.prototype.getFoodsByReason = function(reason) {
        var foodsByReason = _.find(this._foodsByReasonPool, {
          reason: reason
        });
        if (!foodsByReason) return 0;
        return foodsByReason.foods;
      };
      UserModel.prototype.addFoodsToBalance = function(reason) {
        var foodsByReason = _.find(this._foodsByReasonPool, {
          reason: reason
        });
        if (!foodsByReason) return;
        this.foods = this.foods + foodsByReason.foods;
        foodsByReason.foods = 0;
      };
      UserModel.prototype.addAllFoodsToBalance = function() {
        var _this = this;
        this._foodsByReasonPool.forEach(function(foodsByReason) {
          _this.foods = _this.foods + foodsByReason.foods;
          foodsByReason.foods = 0;
        });
      };
      return UserModel;
    }(CsiSessionUser_1.default);
    exports.default = UserModel;
    cc._RF.pop();
  }, {
    "../../Utils/biser-legacy/csi/Objects/CsiSessionUser": "CsiSessionUser"
  } ],
  Utils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "00278CRGsZP9oyiZqyITHgr", "Utils");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.EventParam = exports.EventParams = void 0;
    var Facade_1 = require("../PureMVC/Facade");
    var DVD_1 = require("./DVD");
    var SettingsProxy_1 = require("../Proxy/SettingsProxy");
    var MainScene_1 = require("../Scene/MainScene");
    var Utils = function() {
      function Utils() {}
      Utils.getChild = function(name, parent) {
        if (!name || "" == name) return null;
        var node = parent.getChildByName(name);
        if (!node) for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
          var child = _a[_i];
          node = Utils.getChild(name, child);
          if (node) break;
        }
        return node;
      };
      Utils.getChildComponent = function(type, name, parent) {
        if (!name || "" == name) return null;
        var node = parent.getChildByName(name);
        if (!node) for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
          var child = _a[_i];
          node = Utils.getChild(name, child);
          if (node) break;
        }
        return node ? node.getComponent(type) : null;
      };
      Utils.getChildren = function(name, node) {
        var result = [];
        node.children.forEach(function(child) {
          child.name == name && result.push(child);
        });
        return result;
      };
      Utils.getParent = function(name, parent) {
        if (parent) return parent.name == name ? parent : Utils.getParent(name, parent.parent);
        return null;
      };
      Utils.moveChildToParent = function(child, parent) {
        if (!parent || !parent.isValid) return;
        child.removeFromParent(false);
        parent.addChild(child);
      };
      Utils.emit = function(type, parent, arg1, arg2, arg3, arg4, arg5) {
        if (!parent || !parent.isValid || !parent.active) return;
        parent.emit(type, arg1, arg2, arg3, arg4, arg5);
        var children = _.concat([], parent.children);
        children.forEach(function(child) {
          Utils.emit(type, child, arg1, arg2, arg3, arg4, arg5);
        });
      };
      Utils.setCascadeColor = function(color, node) {
        node.color = color;
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
          var child = _a[_i];
          Utils.setCascadeColor(color, child);
        }
      };
      Utils.setChildOpacity = function(opacity, node) {
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
          var child = _a[_i];
          child.opacity = opacity;
        }
      };
      Utils.getRand = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      };
      Utils.getRandomInt = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
      Utils.cloneObject = function(obj) {
        return _.cloneDeep(obj);
      };
      Utils.numberToPrice = function(val, sep) {
        void 0 === sep && (sep = " ");
        val = Math.round(val);
        var absVal = Math.abs(val);
        var result = "";
        while (absVal > 0) {
          var n = absVal % 1e3;
          absVal = (absVal - n) / 1e3;
          result = absVal > 0 ? (n >= 100 ? n.toString() : n >= 10 ? "0" + n.toString() : "00" + n.toString()) + ("" == result ? result : sep + result) : n.toString() + ("" == result ? result : sep + result);
        }
        return (val < 0 ? "-" : "") + ("" == result ? "0" : result);
      };
      Utils.bigIntToPrice = function(val, sep) {
        void 0 === sep && (sep = " ");
        var str = val.toString();
        for (var i = str.length - 3; i > 0; i -= 3) str = str.substring(0, i) + sep + str.substring(i, str.length);
        return str;
      };
      Utils.intToPrice = function(val, sep) {
        void 0 === sep && (sep = " ");
        var str = val.toString();
        for (var i = str.length - 3; i > 0; i -= 3) str = str.substring(0, i) + sep + str.substring(i, str.length);
        return str;
      };
      Utils.numberToShort = function(val, precision) {
        val = Math.round(val);
        var absVal = Math.abs(val);
        if (absVal < 1e3) return this.numberToPrice(absVal);
        var type = 0;
        while (absVal >= 1e3) {
          absVal /= 1e3;
          type++;
        }
        var res = precision && precision > 0 && type > 0 ? Math.floor(absVal * precision * 10) / (10 * precision) : Math.floor(absVal);
        return (val < 0 ? "-" : "") + (type > 0 ? res.toString() + (1 == type ? "K" : "M") : val.toString());
      };
      Utils.bigIntToShort = function(val, isShort) {
        if (val.lesser(1e3)) return this.bigIntToPrice(val);
        var type = 0;
        while (bigInt(1e3).lesserOrEquals(val)) {
          val = val.divide(1e3);
          type++;
        }
        return (val.lesser(0) ? "-" : "") + (type > 0 || isShort ? val.toString() + (1 == type ? "K" : "M") : val.toString());
      };
      Utils.numberToBet = function(val) {
        val = Math.round(val);
        var absVal = Math.abs(val);
        if (absVal < 1e3) return this.numberToPrice(absVal);
        absVal /= 1e3;
        if (absVal < 1e3) return (val < 0 ? "-" : "") + Math.round(absVal).toString() + "K";
        absVal /= 1e3;
        return (val < 0 ? "-" : "") + Math.round(absVal).toString() + "M";
      };
      Utils.checkPosInRect = function(rect, pos) {
        if (pos.x > rect.x + rect.width / 2 || pos.x < -(rect.x + rect.width / 2) || pos.y > rect.y + rect.height / 2 || pos.y < -(rect.y + rect.height / 2)) return false;
        return true;
      };
      Utils.create2DArray = function(rows, cols, value) {
        var X = new Array(rows);
        for (var i = 0; i < X.length; i++) {
          X[i] = new Array(cols);
          if (void 0 != value) for (var j = 0; j < X[i].length; j++) X[i][j] = value;
        }
        return X;
      };
      Utils.log2DArray = function(array) {
        MainScene_1.default.log("ARRAY:");
        array.forEach(function(value) {
          MainScene_1.default.log(value);
        });
      };
      Utils.shuffleArray = function(array) {
        return array.map(function(a) {
          return {
            sort: Math.random(),
            value: a
          };
        }).sort(function(a, b) {
          return a.sort - b.sort;
        }).map(function(a) {
          return a.value;
        });
      };
      Utils.randomMinus1To1 = function() {
        return 2 * Math.random() - 1;
      };
      Utils.parseData = function(data) {
        if (data && _.isString(data)) return JSON.parse(data);
        return data;
      };
      Utils.generateUUID = function() {
        var d = new Date().getTime();
        "undefined" !== typeof performance && "function" === typeof performance.now && (d += performance.now());
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
          var r = (d + 16 * Math.random()) % 16 | 0;
          d = Math.floor(d / 16);
          return ("x" === c ? r : 3 & r | 8).toString(16);
        });
      };
      Utils.numToTimeStr = function(time) {
        var date = new Date(null);
        date.setSeconds(time);
        var str = date.toISOString().substr(11, 8);
        return "00" == str.substr(0, 2) ? date.toISOString().substr(14, 5) : str;
      };
      Utils.numToDateStr = function(time) {
        var date = new Date(null);
        date.setSeconds(time);
        var str = date.toISOString();
        return str.substr(8, 2) + "/" + str.substr(5, 2) + "/" + str.substr(0, 4);
      };
      Utils.numToTimeDelta = function(time) {
        var date = new Date(null);
        date.setSeconds(time);
        var fullString = date.toISOString();
        var m = parseInt(fullString.substr(5, 2));
        var d = parseInt(fullString.substr(8, 2));
        var t = fullString.substr(11, 8);
        if (m > 1) return (m - 1).toString() + " " + Utils.defineWordDeclinationRu(m - 1, "MONTH", "MONTHS", "MONTHS");
        if (d > 1) return (d - 1).toString() + " " + Utils.defineWordDeclinationRu(d - 1, "DAY", "DAYS", "DAYS");
        if (time > 3600) {
          var res = t.substr(0, 5);
          time % 2 > 0 && (res = res.replace(":", " "));
          return res;
        }
        return t.substr(3, 5);
      };
      Utils.defineWordDeclinationRu = function(number, word1, word2, word5) {
        if (number % 100 > 10 && number % 100 < 15) return word5;
        var str = number.toString();
        var last = parseInt(str.charAt(str.length - 1));
        if (1 == last) return word1;
        if (0 != last && last < 5) return word2;
        return word5;
      };
      Utils.convertPosition = function(from, to) {
        return from.getParent().convertToNodeSpaceAR(to.getParent().convertToWorldSpaceAR(to.position));
      };
      Utils.removeFromParent = function(node) {
        node.stopAllActions();
        node.removeFromParent(true);
        node.destroy();
        node = null;
      };
      Utils.isTutorStep = function(step) {
        return "1" == Facade_1.default.getInstance().retrieveProxy(SettingsProxy_1.default).getItem("TUTOR_STEP_" + step.toString());
      };
      Utils.completeTutorStep = function(step) {
        Facade_1.default.getInstance().retrieveProxy(SettingsProxy_1.default).setItem("TUTOR_STEP_" + step.toString(), "1");
        Utils.dvdTutorialCompleted(step);
      };
      Utils.showCoinsFly = function(from, endCallBack) {};
      Utils.setAvatar = function(parent, url, userId, defaultAvatar) {
        var avatar = Utils.getChildComponent(cc.Sprite, "avatar", parent);
        if (!avatar) return;
        avatar.node.off("touchend");
        avatar.node.on("touchend", function(event) {});
        avatar.node.off("mouseenter");
        avatar.node.off("mouseleave");
        var avatarHover = Utils.getChild("hover", avatar.node.parent);
        if (avatarHover) {
          avatarHover.active = false;
          avatar.node.on("mouseenter", function(event) {
            avatarHover.active = true;
          });
          avatar.node.on("mouseleave", function(event) {
            avatarHover.active = false;
          });
        }
        avatar.spriteFrame = defaultAvatar;
        url && "" != url && url.indexOf("api.ok.ru/img/stub/user/male/128.png") < 0 && url.indexOf("vk.com/images/camera_100.png") < 0 && cc.assetManager.loadRemote(url, {
          ext: ".jpg"
        }, function(err, tex) {
          if (!err && tex && avatar && avatar.isValid) {
            var lastSize = avatar.node.getContentSize();
            avatar.spriteFrame = new cc.SpriteFrame(tex);
            avatar.node.setContentSize(lastSize);
          }
        });
      };
      Utils.clamp = function(val, min, max) {
        return Math.min(Math.max(val, min), max);
      };
      Utils.setUserId = function(uid, isNew) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "setUserId", "(Ljava/lang/String;Z)V", uid, isNew);
        Utils.dvdSetUserId(uid);
      };
      Utils.dvdInit = function() {
        DVD_1.default.init();
      };
      Utils.dvdSetUserId = function(uid) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdSetUserId", "(Ljava/lang/String;)V", uid) : cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("DTDHelper", "dtdSetUserId:", uid) : DVD_1.default.setCrossplatformUserId(uid);
      };
      Utils.dvdReplaceUserId = function(prevUid, uid) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdReplaceUserId", "(Ljava/lang/String;Ljava/lang/String;)V", prevUid, uid) : cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS && jsb.reflection.callStaticMethod("DTDHelper", "dtdReplaceUserId:to:", prevUid, uid);
      };
      Utils.dvdSetCurrentLevel = function(level) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdSetCurrentLevel", "(I)V", level) : cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("DTDHelper", "dtdSetCurrentLevel:", level) : DVD_1.default.setCurrentLevel(level);
      };
      Utils.dvdTutorialCompleted = function(step) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdTutorialCompleted", "(I)V", step) : cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("DTDHelper", "dtdTutorialCompleted:", step) : DVD_1.default.tutorialCompleted(step);
      };
      Utils.dvdLevelUp = function(level, coins) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdLevelUp", "(II)V", level, coins) : cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("DTDHelper", "dtdLevelUp:coins:", level, coins) : DVD_1.default.levelUp(level);
      };
      Utils.dvdCurrencyEarned = function(currency, count) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdCurrencyEarned", "(Ljava/lang/String;I)V", currency, count);
      };
      Utils.dvdCurrencyPurchased = function(currency, count) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdCurrencyPurchased", "(Ljava/lang/String;I)V", currency, count);
      };
      Utils.dvdItemPurchased = function(item, type, count, price, currency) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdItemPurchased", "(Ljava/lang/String;Ljava/lang/String;IILjava/lang/String;)V", item, type, count, price, currency);
      };
      Utils.dvdRealPayment = function(paymentId, inAppPrice, inAppName, inAppCurrencyISOCode) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdRealPayment", "(Ljava/lang/String;FLjava/lang/String;Ljava/lang/String;)V", paymentId, inAppPrice, inAppName, inAppCurrencyISOCode) : cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("DTDHelper", "dtdRealPayment:inAppPrice:inAppName:inAppCurrencyISOCode:", paymentId, inAppPrice, inAppName, inAppCurrencyISOCode) : DVD_1.default.realPayment(paymentId, inAppPrice, inAppName, inAppCurrencyISOCode);
      };
      Utils.dvdCustomEvent = function(eventName, params) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdCustomEvent", "(Ljava/lang/String;Ljava/lang/String;)V", eventName, params.getParamsJSON()) : cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS ? jsb.reflection.callStaticMethod("DTDHelper", "dtdCustomEvent:params:", eventName, params.getParamsJSON()) : DVD_1.default.customEvent(eventName, params);
      };
      Utils.dvdStartProgressionEvent = function(name) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdStartProgressionEvent", "(Ljava/lang/String;)V", name);
      };
      Utils.dvdEndProgressionEvent = function(name, isWin, time, coins, power) {
        cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID && jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UtilsHelper", "dvdEndProgressionEvent", "(Ljava/lang/String;ZIII)V", name, isWin, time, coins, power);
      };
      return Utils;
    }();
    exports.default = Utils;
    var EventParams = function() {
      function EventParams() {
        this.params = [];
      }
      EventParams.prototype.addParam = function(param) {
        this.params.push(param);
      };
      EventParams.prototype.getParamsJSON = function() {
        return JSON.stringify(this);
      };
      return EventParams;
    }();
    exports.EventParams = EventParams;
    var EventParam = function() {
      function EventParam(name, value, type) {
        this.name = "";
        this.value = 0;
        this.type = "int";
        this.name = name;
        this.value = value;
        this.type = type;
      }
      return EventParam;
    }();
    exports.EventParam = EventParam;
    cc._RF.pop();
  }, {
    "../Proxy/SettingsProxy": "SettingsProxy",
    "../PureMVC/Facade": "Facade",
    "../Scene/MainScene": "MainScene",
    "./DVD": "DVD"
  } ]
}, {}, [ "RunMainScene", "RunMainScenePreloader", "GetStartUpData", "Login", "CheatAddCoins", "CheatAddFoods", "GetUser", "SessionServiceActions", "UpLevel", "SessionAPI", "StartUp", "Constants", "MainSceneMediator", "MainScenePreloaderMediator", "SoundMediator", "PopupMediator", "ServerConnection", "SessionService", "StoreModel", "UserModel", "ServerProxy", "SessionUserProxy", "SettingsProxy", "ISocial", "SocialAndroid", "SocialEmpty", "SocialIOS", "SocialOK", "SocialPlayer", "SocialVK", "SocialProxy", "Facade", "FacadeCommand", "Mediator", "MessageConfig", "Notification", "Proxy", "MainScene", "DVD", "Loader", "TextUtil", "Utils", "Connection", "CsiAnimal", "CsiAnimalSkill", "CsiAnimalSkill_Upgrade", "CsiAnimalState", "CsiAnimalState_Available", "CsiAnimalState_Locked", "CsiAnimalState_Unavailable", "CsiApiIds", "CsiEnums", "CsiSessionUser", "CsiShopProduct", "CsiShopProduct_Item", "CsiSlot", "CsiUser", "Protocol", "DataReader", "DataTypes", "DataWriter", "Entity", "EntityFabric", "CamWidget", "DropSprite", "LayoutSpacingWidget", "PrefabWidget", "RepeatPropertyWidget", "ScaleWidget", "SizeWidget", "ButtonWidget", "CloneTextWidget", "CustomPagesIndicator", "CustomPagesWidget", "DefaultButtonWidget", "EmulateButtonWidget", "ParallaxScrollWidget", "ProgressBarWidget", "ScrollWidget", "SelectBoxWidget", "SpeakingTextWidget", "SpineProgressBarWidget", "SpriteButton", "TabWidget", "ToggleWidget" ]);