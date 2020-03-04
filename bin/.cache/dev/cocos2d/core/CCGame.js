
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/CCGame.js';
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
var EventTarget = require('./event/event-target');

require('../audio/CCAudioEngine');

var debug = require('./CCDebug');

var renderer = require('./renderer/index.js');

var dynamicAtlasManager = require('../core/renderer/utils/dynamic-atlas/manager');
/**
 * @module cc
 */

/**
 * !#en An object to boot the game.
 * !#zh 包含游戏主体信息并负责驱动游戏的游戏对象。
 * @class Game
 * @extends EventTarget
 */


var game = {
  /**
   * !#en Event triggered when game hide to background.
   * Please note that this event is not 100% guaranteed to be fired on Web platform,
   * on native platforms, it corresponds to enter background event, os status bar or notification center may not trigger this event.
   * !#zh 游戏进入后台时触发的事件。
   * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。
   * 在原生平台，它对应的是应用被切换到后台事件，下拉菜单和上拉状态栏等不一定会触发这个事件，这取决于系统行为。
   * @property EVENT_HIDE
   * @type {String}
   * @example
   * cc.game.on(cc.game.EVENT_HIDE, function () {
   *     cc.audioEngine.pauseMusic();
   *     cc.audioEngine.pauseAllEffects();
   * });
   */
  EVENT_HIDE: "game_on_hide",

  /**
   * !#en Event triggered when game back to foreground
   * Please note that this event is not 100% guaranteed to be fired on Web platform,
   * on native platforms, it corresponds to enter foreground event.
   * !#zh 游戏进入前台运行时触发的事件。
   * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。
   * 在原生平台，它对应的是应用被切换到前台事件。
   * @property EVENT_SHOW
   * @constant
   * @type {String}
   */
  EVENT_SHOW: "game_on_show",

  /**
   * !#en Event triggered when game restart
   * !#zh 调用restart后，触发事件。
   * @property EVENT_RESTART
   * @constant
   * @type {String}
   */
  EVENT_RESTART: "game_on_restart",

  /**
   * Event triggered after game inited, at this point all engine objects and game scripts are loaded
   * @property EVENT_GAME_INITED
   * @constant
   * @type {String}
   */
  EVENT_GAME_INITED: "game_inited",

  /**
   * Event triggered after engine inited, at this point you will be able to use all engine classes. 
   * It was defined as EVENT_RENDERER_INITED in cocos creator v1.x and renamed in v2.0
   * @property EVENT_ENGINE_INITED
   * @constant
   * @type {String}
   */
  EVENT_ENGINE_INITED: "engine_inited",
  // deprecated
  EVENT_RENDERER_INITED: "engine_inited",

  /**
   * Web Canvas 2d API as renderer backend
   * @property RENDER_TYPE_CANVAS
   * @constant
   * @type {Number}
   */
  RENDER_TYPE_CANVAS: 0,

  /**
   * WebGL API as renderer backend
   * @property RENDER_TYPE_WEBGL
   * @constant
   * @type {Number}
   */
  RENDER_TYPE_WEBGL: 1,

  /**
   * OpenGL API as renderer backend
   * @property RENDER_TYPE_OPENGL
   * @constant
   * @type {Number}
   */
  RENDER_TYPE_OPENGL: 2,
  _persistRootNodes: {},
  // states
  _paused: true,
  //whether the game is paused
  _configLoaded: false,
  //whether config loaded
  _isCloning: false,
  // deserializing or instantiating
  _prepared: false,
  //whether the engine has prepared
  _rendererInitialized: false,
  _renderContext: null,
  _intervalId: null,
  //interval target of main
  _lastTime: null,
  _frameTime: null,
  // Scenes list
  _sceneInfos: [],

  /**
   * !#en The outer frame of the game canvas, parent of game container.
   * !#zh 游戏画布的外框，container 的父容器。
   * @property frame
   * @type {Object}
   */
  frame: null,

  /**
   * !#en The container of game canvas.
   * !#zh 游戏画布的容器。
   * @property container
   * @type {HTMLDivElement}
   */
  container: null,

  /**
   * !#en The canvas of the game.
   * !#zh 游戏的画布。
   * @property canvas
   * @type {HTMLCanvasElement}
   */
  canvas: null,

  /**
   * !#en The renderer backend of the game.
   * !#zh 游戏的渲染器类型。
   * @property renderType
   * @type {Number}
   */
  renderType: -1,

  /**
   * !#en
   * The current game configuration, including:<br/>
   * 1. debugMode<br/>
   *      "debugMode" possible values :<br/>
   *      0 - No message will be printed.                                                      <br/>
   *      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.                      <br/>
   *      2 - cc.error, cc.assert, cc.warn will print in console.                              <br/>
   *      3 - cc.error, cc.assert will print in console.                                       <br/>
   *      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.<br/>
   *      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.        <br/>
   *      6 - cc.error, cc.assert will print on canvas, available only on web.                 <br/>
   * 2. showFPS<br/>
   *      Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.<br/>
   * 3. exposeClassName<br/>
   *      Expose class name to chrome debug tools, the class intantiate performance is a little bit slower when exposed.<br/>
   * 4. frameRate<br/>
   *      "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.<br/>
   * 5. id<br/>
   *      "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.<br/>
   * 6. renderMode<br/>
   *      "renderMode" sets the renderer type, only useful on web :<br/>
   *      0 - Automatically chosen by engine<br/>
   *      1 - Forced to use canvas renderer<br/>
   *      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers<br/>
   * 7. scenes<br/>
   *      "scenes" include available scenes in the current bundle.<br/>
   *<br/>
   * Please DO NOT modify this object directly, it won't have any effect.<br/>
   * !#zh
   * 当前的游戏配置，包括：                                                                  <br/>
   * 1. debugMode（debug 模式，但是在浏览器中这个选项会被忽略）                                <br/>
   *      "debugMode" 各种设置选项的意义。                                                   <br/>
   *          0 - 没有消息被打印出来。                                                       <br/>
   *          1 - cc.error，cc.assert，cc.warn，cc.log 将打印在 console 中。                  <br/>
   *          2 - cc.error，cc.assert，cc.warn 将打印在 console 中。                          <br/>
   *          3 - cc.error，cc.assert 将打印在 console 中。                                   <br/>
   *          4 - cc.error，cc.assert，cc.warn，cc.log 将打印在 canvas 中（仅适用于 web 端）。 <br/>
   *          5 - cc.error，cc.assert，cc.warn 将打印在 canvas 中（仅适用于 web 端）。         <br/>
   *          6 - cc.error，cc.assert 将打印在 canvas 中（仅适用于 web 端）。                  <br/>
   * 2. showFPS（显示 FPS）                                                            <br/>
   *      当 showFPS 为 true 的时候界面的左下角将显示 fps 的信息，否则被隐藏。              <br/>
   * 3. exposeClassName                                                           <br/>
   *      暴露类名让 Chrome DevTools 可以识别，如果开启会稍稍降低类的创建过程的性能，但对对象构造没有影响。 <br/>
   * 4. frameRate (帧率)                                                              <br/>
   *      “frameRate” 设置想要的帧率你的游戏，但真正的FPS取决于你的游戏实现和运行环境。      <br/>
   * 5. id                                                                            <br/>
   *      "gameCanvas" Web 页面上的 Canvas Element ID，仅适用于 web 端。                         <br/>
   * 6. renderMode（渲染模式）                                                         <br/>
   *      “renderMode” 设置渲染器类型，仅适用于 web 端：                              <br/>
   *          0 - 通过引擎自动选择。                                                     <br/>
   *          1 - 强制使用 canvas 渲染。
   *          2 - 强制使用 WebGL 渲染，但是在部分 Android 浏览器中这个选项会被忽略。     <br/>
   * 7. scenes                                                                         <br/>
   *      “scenes” 当前包中可用场景。                                                   <br/>
   * <br/>
   * 注意：请不要直接修改这个对象，它不会有任何效果。
   * @property config
   * @type {Object}
   */
  config: null,

  /**
   * !#en Callback when the scripts of engine have been load.
   * !#zh 当引擎完成启动后的回调函数。
   * @method onStart
   * @type {Function}
   */
  onStart: null,
  //@Public Methods
  //  @Game play control

  /**
   * !#en Set frame rate of game.
   * !#zh 设置游戏帧率。
   * @method setFrameRate
   * @param {Number} frameRate
   */
  setFrameRate: function setFrameRate(frameRate) {
    var config = this.config;
    config.frameRate = frameRate;
    if (this._intervalId) window.cancelAnimFrame(this._intervalId);
    this._intervalId = 0;
    this._paused = true;

    this._setAnimFrame();

    this._runMainLoop();
  },

  /**
   * !#en Get frame rate set for the game, it doesn't represent the real frame rate.
   * !#zh 获取设置的游戏帧率（不等同于实际帧率）。
   * @method getFrameRate
   * @return {Number} frame rate
   */
  getFrameRate: function getFrameRate() {
    return this.config.frameRate;
  },

  /**
   * !#en Run the game frame by frame.
   * !#zh 执行一帧游戏循环。
   * @method step
   */
  step: function step() {
    cc.director.mainLoop();
  },

  /**
   * !#en Pause the game main loop. This will pause:
   * game logic execution, rendering process, event manager, background music and all audio effects.
   * This is different with cc.director.pause which only pause the game logic execution.
   * !#zh 暂停游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。这点和只暂停游戏逻辑的 cc.director.pause 不同。
   * @method pause
   */
  pause: function pause() {
    if (this._paused) return;
    this._paused = true; // Pause audio engine

    if (cc.audioEngine) {
      cc.audioEngine._break();
    } // Pause main loop


    if (this._intervalId) window.cancelAnimFrame(this._intervalId);
    this._intervalId = 0;
  },

  /**
   * !#en Resume the game from pause. This will resume:
   * game logic execution, rendering process, event manager, background music and all audio effects.
   * !#zh 恢复游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。
   * @method resume
   */
  resume: function resume() {
    if (!this._paused) return;
    this._paused = false; // Resume audio engine

    if (cc.audioEngine) {
      cc.audioEngine._restore();
    }

    cc.director._resetDeltaTime(); // Resume main loop


    this._runMainLoop();
  },

  /**
   * !#en Check whether the game is paused.
   * !#zh 判断游戏是否暂停。
   * @method isPaused
   * @return {Boolean}
   */
  isPaused: function isPaused() {
    return this._paused;
  },

  /**
   * !#en Restart game.
   * !#zh 重新开始游戏
   * @method restart
   */
  restart: function restart() {
    cc.director.once(cc.Director.EVENT_AFTER_DRAW, function () {
      for (var id in game._persistRootNodes) {
        game.removePersistRootNode(game._persistRootNodes[id]);
      } // Clear scene


      cc.director.getScene().destroy();

      cc.Object._deferredDestroy(); // Clean up audio


      if (cc.audioEngine) {
        cc.audioEngine.uncacheAll();
      }

      cc.director.reset();
      game.pause();

      cc.AssetLibrary._loadBuiltins(function () {
        game.onStart();
        game.emit(game.EVENT_RESTART);
      });
    });
  },

  /**
   * !#en End game, it will close the game window
   * !#zh 退出游戏
   * @method end
   */
  end: function end() {
    close();
  },
  //  @Game loading
  _initEngine: function _initEngine() {
    if (this._rendererInitialized) {
      return;
    }

    this._initRenderer();

    if (!CC_EDITOR) {
      this._initEvents();
    }

    this.emit(this.EVENT_ENGINE_INITED);
  },
  _loadPreviewScript: function _loadPreviewScript(cb) {
    if (CC_PREVIEW && window.__quick_compile_project__) {
      window.__quick_compile_project__.load(cb);
    } else {
      cb();
    }
  },
  _prepareFinished: function _prepareFinished(cb) {
    var _this = this;

    // Init engine
    this._initEngine();

    this._setAnimFrame();

    cc.AssetLibrary._loadBuiltins(function () {
      // Log engine version
      console.log('Cocos Creator v' + cc.ENGINE_VERSION);
      _this._prepared = true;

      _this._runMainLoop();

      _this.emit(_this.EVENT_GAME_INITED);

      if (cb) cb();
    });
  },
  eventTargetOn: EventTarget.prototype.on,
  eventTargetOnce: EventTarget.prototype.once,

  /**
   * !#en
   * Register an callback of a specific event type on the game object.
   * This type of event should be triggered via `emit`.
   * !#zh
   * 注册 game 的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
   *
   * @method on
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   *                              The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {any} [callback.arg1] arg1
   * @param {any} [callback.arg2] arg2
   * @param {any} [callback.arg3] arg3
   * @param {any} [callback.arg4] arg4
   * @param {any} [callback.arg5] arg5
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
   * @typescript
   * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
   */
  on: function on(type, callback, target, once) {
    // Make sure EVENT_ENGINE_INITED and EVENT_GAME_INITED callbacks to be invoked
    if (this._prepared && type === this.EVENT_ENGINE_INITED || !this._paused && type === this.EVENT_GAME_INITED) {
      callback.call(target);
    } else {
      this.eventTargetOn(type, callback, target, once);
    }
  },

  /**
   * !#en
   * Register an callback of a specific event type on the game object,
   * the callback will remove itself after the first time it is triggered.
   * !#zh
   * 注册 game 的特定事件类型回调，回调会在第一时间被触发后删除自身。
   *
   * @method once
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} callback - The callback that will be invoked when the event is dispatched.
   *                              The callback is ignored if it is a duplicate (the callbacks are unique).
   * @param {any} [callback.arg1] arg1
   * @param {any} [callback.arg2] arg2
   * @param {any} [callback.arg3] arg3
   * @param {any} [callback.arg4] arg4
   * @param {any} [callback.arg5] arg5
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   */
  once: function once(type, callback, target) {
    // Make sure EVENT_ENGINE_INITED and EVENT_GAME_INITED callbacks to be invoked
    if (this._prepared && type === this.EVENT_ENGINE_INITED || !this._paused && type === this.EVENT_GAME_INITED) {
      callback.call(target);
    } else {
      this.eventTargetOnce(type, callback, target);
    }
  },

  /**
   * !#en Prepare game.
   * !#zh 准备引擎，请不要直接调用这个函数。
   * @param {Function} cb
   * @method prepare
   */
  prepare: function prepare(cb) {
    var _this2 = this;

    // Already prepared
    if (this._prepared) {
      if (cb) cb();
      return;
    } // Load game scripts


    var jsList = this.config.jsList;

    if (jsList && jsList.length > 0) {
      cc.loader.load(jsList, function (err) {
        if (err) throw new Error(JSON.stringify(err));

        _this2._loadPreviewScript(function () {
          _this2._prepareFinished(cb);
        });
      });
    } else {
      this._loadPreviewScript(function () {
        _this2._prepareFinished(cb);
      });
    }
  },

  /**
   * !#en Run game with configuration object and onStart function.
   * !#zh 运行游戏，并且指定引擎配置和 onStart 的回调。
   * @method run
   * @param {Object} config - Pass configuration object or onStart function
   * @param {Function} onStart - function to be executed after game initialized
   */
  run: function run(config, onStart) {
    this._initConfig(config);

    this.onStart = onStart;
    this.prepare(game.onStart && game.onStart.bind(game));
  },
  //  @ Persist root node section

  /**
   * !#en
   * Add a persistent root node to the game, the persistent node won't be destroyed during scene transition.<br/>
   * The target node must be placed in the root level of hierarchy, otherwise this API won't have any effect.
   * !#zh
   * 声明常驻根节点，该节点不会被在场景切换中被销毁。<br/>
   * 目标节点必须位于为层级的根节点，否则无效。
   * @method addPersistRootNode
   * @param {Node} node - The node to be made persistent
   */
  addPersistRootNode: function addPersistRootNode(node) {
    if (!cc.Node.isNode(node) || !node.uuid) {
      cc.warnID(3800);
      return;
    }

    var id = node.uuid;

    if (!this._persistRootNodes[id]) {
      var scene = cc.director._scene;

      if (cc.isValid(scene)) {
        if (!node.parent) {
          node.parent = scene;
        } else if (!(node.parent instanceof cc.Scene)) {
          cc.warnID(3801);
          return;
        } else if (node.parent !== scene) {
          cc.warnID(3802);
          return;
        }
      }

      this._persistRootNodes[id] = node;
      node._persistNode = true;
    }
  },

  /**
   * !#en Remove a persistent root node.
   * !#zh 取消常驻根节点。
   * @method removePersistRootNode
   * @param {Node} node - The node to be removed from persistent node list
   */
  removePersistRootNode: function removePersistRootNode(node) {
    var id = node.uuid || '';

    if (node === this._persistRootNodes[id]) {
      delete this._persistRootNodes[id];
      node._persistNode = false;
    }
  },

  /**
   * !#en Check whether the node is a persistent root node.
   * !#zh 检查节点是否是常驻根节点。
   * @method isPersistRootNode
   * @param {Node} node - The node to be checked
   * @return {Boolean}
   */
  isPersistRootNode: function isPersistRootNode(node) {
    return node._persistNode;
  },
  //@Private Methods
  //  @Time ticker section
  _setAnimFrame: function _setAnimFrame() {
    this._lastTime = performance.now();
    var frameRate = game.config.frameRate;
    this._frameTime = 1000 / frameRate;
    cc.director._maxParticleDeltaTime = this._frameTime / 1000 * 2;

    if (CC_JSB || CC_RUNTIME) {
      jsb.setPreferredFramesPerSecond(frameRate);
      window.requestAnimFrame = window.requestAnimationFrame;
      window.cancelAnimFrame = window.cancelAnimationFrame;
    } else {
      if (frameRate !== 60 && frameRate !== 30) {
        window.requestAnimFrame = this._stTime;
        window.cancelAnimFrame = this._ctTime;
      } else {
        window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || this._stTime;
        window.cancelAnimFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame || this._ctTime;
      }
    }
  },
  _stTime: function _stTime(callback) {
    var currTime = performance.now();
    var timeToCall = Math.max(0, game._frameTime - (currTime - game._lastTime));
    var id = window.setTimeout(function () {
      callback();
    }, timeToCall);
    game._lastTime = currTime + timeToCall;
    return id;
  },
  _ctTime: function _ctTime(id) {
    window.clearTimeout(id);
  },
  //Run game.
  _runMainLoop: function _runMainLoop() {
    if (CC_EDITOR) {
      return;
    }

    if (!this._prepared) return;

    var self = this,
        _callback,
        config = self.config,
        director = cc.director,
        skip = true,
        frameRate = config.frameRate;

    debug.setDisplayStats(config.showFPS);

    _callback = function callback(now) {
      if (!self._paused) {
        self._intervalId = window.requestAnimFrame(_callback);

        if (!CC_JSB && !CC_RUNTIME && frameRate === 30) {
          if (skip = !skip) {
            return;
          }
        }

        director.mainLoop(now);
      }
    };

    self._intervalId = window.requestAnimFrame(_callback);
    self._paused = false;
  },
  //  @Game loading section
  _initConfig: function _initConfig(config) {
    // Configs adjustment
    if (typeof config.debugMode !== 'number') {
      config.debugMode = 0;
    }

    config.exposeClassName = !!config.exposeClassName;

    if (typeof config.frameRate !== 'number') {
      config.frameRate = 60;
    }

    var renderMode = config.renderMode;

    if (typeof renderMode !== 'number' || renderMode > 2 || renderMode < 0) {
      config.renderMode = 0;
    }

    if (typeof config.registerSystemEvent !== 'boolean') {
      config.registerSystemEvent = true;
    }

    if (renderMode === 1) {
      config.showFPS = false;
    } else {
      config.showFPS = !!config.showFPS;
    } // Scene parser


    this._sceneInfos = config.scenes || []; // Collide Map and Group List

    this.collisionMatrix = config.collisionMatrix || [];
    this.groupList = config.groupList || [];

    debug._resetDebugSetting(config.debugMode);

    this.config = config;
    this._configLoaded = true;
  },
  _determineRenderType: function _determineRenderType() {
    var config = this.config,
        userRenderMode = parseInt(config.renderMode) || 0; // Determine RenderType

    this.renderType = this.RENDER_TYPE_CANVAS;
    var supportRender = false;

    if (userRenderMode === 0) {
      if (cc.sys.capabilities['opengl']) {
        this.renderType = this.RENDER_TYPE_WEBGL;
        supportRender = true;
      } else if (cc.sys.capabilities['canvas']) {
        this.renderType = this.RENDER_TYPE_CANVAS;
        supportRender = true;
      }
    } else if (userRenderMode === 1 && cc.sys.capabilities['canvas']) {
      this.renderType = this.RENDER_TYPE_CANVAS;
      supportRender = true;
    } else if (userRenderMode === 2 && cc.sys.capabilities['opengl']) {
      this.renderType = this.RENDER_TYPE_WEBGL;
      supportRender = true;
    }

    if (!supportRender) {
      throw new Error(debug.getError(3820, userRenderMode));
    }
  },
  _initRenderer: function _initRenderer() {
    // Avoid setup to be called twice.
    if (this._rendererInitialized) return;
    var el = this.config.id,
        width,
        height,
        localCanvas,
        localContainer;

    if (CC_JSB || CC_RUNTIME) {
      this.container = localContainer = document.createElement("DIV");
      this.frame = localContainer.parentNode === document.body ? document.documentElement : localContainer.parentNode;
      localCanvas = window.__canvas;
      this.canvas = localCanvas;
    } else {
      var addClass = function addClass(element, name) {
        var hasClass = (' ' + element.className + ' ').indexOf(' ' + name + ' ') > -1;

        if (!hasClass) {
          if (element.className) {
            element.className += " ";
          }

          element.className += name;
        }
      };

      var element = el instanceof HTMLElement ? el : document.querySelector(el) || document.querySelector('#' + el);

      if (element.tagName === "CANVAS") {
        width = element.width;
        height = element.height; //it is already a canvas, we wrap it around with a div

        this.canvas = localCanvas = element;
        this.container = localContainer = document.createElement("DIV");
        if (localCanvas.parentNode) localCanvas.parentNode.insertBefore(localContainer, localCanvas);
      } else {
        //we must make a new canvas and place into this element
        if (element.tagName !== "DIV") {
          cc.warnID(3819);
        }

        width = element.clientWidth;
        height = element.clientHeight;
        this.canvas = localCanvas = document.createElement("CANVAS");
        this.container = localContainer = document.createElement("DIV");
        element.appendChild(localContainer);
      }

      localContainer.setAttribute('id', 'Cocos2dGameContainer');
      localContainer.appendChild(localCanvas);
      this.frame = localContainer.parentNode === document.body ? document.documentElement : localContainer.parentNode;
      addClass(localCanvas, "gameCanvas");
      localCanvas.setAttribute("width", width || 480);
      localCanvas.setAttribute("height", height || 320);
      localCanvas.setAttribute("tabindex", 99);
    }

    this._determineRenderType(); // WebGL context created successfully


    if (this.renderType === this.RENDER_TYPE_WEBGL) {
      var opts = {
        'stencil': true,
        // MSAA is causing serious performance dropdown on some browsers.
        'antialias': cc.macro.ENABLE_WEBGL_ANTIALIAS,
        'alpha': cc.macro.ENABLE_TRANSPARENT_CANVAS
      };
      renderer.initWebGL(localCanvas, opts);
      this._renderContext = renderer.device._gl; // Enable dynamic atlas manager by default

      if (!cc.macro.CLEANUP_IMAGE_CACHE && dynamicAtlasManager) {
        dynamicAtlasManager.enabled = true;
      }
    }

    if (!this._renderContext) {
      this.renderType = this.RENDER_TYPE_CANVAS; // Could be ignored by module settings

      renderer.initCanvas(localCanvas);
      this._renderContext = renderer.device._ctx;
    }

    this.canvas.oncontextmenu = function () {
      if (!cc._isContextMenuEnable) return false;
    };

    this._rendererInitialized = true;
  },
  _initEvents: function _initEvents() {
    var win = window,
        hiddenPropName; // register system events

    if (this.config.registerSystemEvent) cc.internal.inputManager.registerSystemEvent(this.canvas);

    if (typeof document.hidden !== 'undefined') {
      hiddenPropName = "hidden";
    } else if (typeof document.mozHidden !== 'undefined') {
      hiddenPropName = "mozHidden";
    } else if (typeof document.msHidden !== 'undefined') {
      hiddenPropName = "msHidden";
    } else if (typeof document.webkitHidden !== 'undefined') {
      hiddenPropName = "webkitHidden";
    }

    var hidden = false;

    function onHidden() {
      if (!hidden) {
        hidden = true;
        game.emit(game.EVENT_HIDE);
      }
    } // In order to adapt the most of platforms the onshow API.


    function onShown(arg0, arg1, arg2, arg3, arg4) {
      if (hidden) {
        hidden = false;
        game.emit(game.EVENT_SHOW, arg0, arg1, arg2, arg3, arg4);
      }
    }

    if (hiddenPropName) {
      var changeList = ["visibilitychange", "mozvisibilitychange", "msvisibilitychange", "webkitvisibilitychange", "qbrowserVisibilityChange"];

      for (var i = 0; i < changeList.length; i++) {
        document.addEventListener(changeList[i], function (event) {
          var visible = document[hiddenPropName]; // QQ App

          visible = visible || event["hidden"];
          if (visible) onHidden();else onShown();
        });
      }
    } else {
      win.addEventListener("blur", onHidden);
      win.addEventListener("focus", onShown);
    }

    if (navigator.userAgent.indexOf("MicroMessenger") > -1) {
      win.onfocus = onShown;
    }

    if ("onpageshow" in window && "onpagehide" in window) {
      win.addEventListener("pagehide", onHidden);
      win.addEventListener("pageshow", onShown); // Taobao UIWebKit

      document.addEventListener("pagehide", onHidden);
      document.addEventListener("pageshow", onShown);
    }

    this.on(game.EVENT_HIDE, function () {
      game.pause();
    });
    this.on(game.EVENT_SHOW, function () {
      game.resume();
    });
  }
};
EventTarget.call(game);
cc.js.addon(game, EventTarget.prototype);
/**
 * @module cc
 */

/**
 * !#en This is a Game instance.
 * !#zh 这是一个 Game 类的实例，包含游戏主体信息并负责驱动游戏的游戏对象。。
 * @property game
 * @type Game
 */

cc.game = module.exports = game;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDR2FtZS5qcyJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInJlcXVpcmUiLCJkZWJ1ZyIsInJlbmRlcmVyIiwiZHluYW1pY0F0bGFzTWFuYWdlciIsImdhbWUiLCJFVkVOVF9ISURFIiwiRVZFTlRfU0hPVyIsIkVWRU5UX1JFU1RBUlQiLCJFVkVOVF9HQU1FX0lOSVRFRCIsIkVWRU5UX0VOR0lORV9JTklURUQiLCJFVkVOVF9SRU5ERVJFUl9JTklURUQiLCJSRU5ERVJfVFlQRV9DQU5WQVMiLCJSRU5ERVJfVFlQRV9XRUJHTCIsIlJFTkRFUl9UWVBFX09QRU5HTCIsIl9wZXJzaXN0Um9vdE5vZGVzIiwiX3BhdXNlZCIsIl9jb25maWdMb2FkZWQiLCJfaXNDbG9uaW5nIiwiX3ByZXBhcmVkIiwiX3JlbmRlcmVySW5pdGlhbGl6ZWQiLCJfcmVuZGVyQ29udGV4dCIsIl9pbnRlcnZhbElkIiwiX2xhc3RUaW1lIiwiX2ZyYW1lVGltZSIsIl9zY2VuZUluZm9zIiwiZnJhbWUiLCJjb250YWluZXIiLCJjYW52YXMiLCJyZW5kZXJUeXBlIiwiY29uZmlnIiwib25TdGFydCIsInNldEZyYW1lUmF0ZSIsImZyYW1lUmF0ZSIsIndpbmRvdyIsImNhbmNlbEFuaW1GcmFtZSIsIl9zZXRBbmltRnJhbWUiLCJfcnVuTWFpbkxvb3AiLCJnZXRGcmFtZVJhdGUiLCJzdGVwIiwiY2MiLCJkaXJlY3RvciIsIm1haW5Mb29wIiwicGF1c2UiLCJhdWRpb0VuZ2luZSIsIl9icmVhayIsInJlc3VtZSIsIl9yZXN0b3JlIiwiX3Jlc2V0RGVsdGFUaW1lIiwiaXNQYXVzZWQiLCJyZXN0YXJ0Iiwib25jZSIsIkRpcmVjdG9yIiwiRVZFTlRfQUZURVJfRFJBVyIsImlkIiwicmVtb3ZlUGVyc2lzdFJvb3ROb2RlIiwiZ2V0U2NlbmUiLCJkZXN0cm95IiwiT2JqZWN0IiwiX2RlZmVycmVkRGVzdHJveSIsInVuY2FjaGVBbGwiLCJyZXNldCIsIkFzc2V0TGlicmFyeSIsIl9sb2FkQnVpbHRpbnMiLCJlbWl0IiwiZW5kIiwiY2xvc2UiLCJfaW5pdEVuZ2luZSIsIl9pbml0UmVuZGVyZXIiLCJDQ19FRElUT1IiLCJfaW5pdEV2ZW50cyIsIl9sb2FkUHJldmlld1NjcmlwdCIsImNiIiwiQ0NfUFJFVklFVyIsIl9fcXVpY2tfY29tcGlsZV9wcm9qZWN0X18iLCJsb2FkIiwiX3ByZXBhcmVGaW5pc2hlZCIsImNvbnNvbGUiLCJsb2ciLCJFTkdJTkVfVkVSU0lPTiIsImV2ZW50VGFyZ2V0T24iLCJwcm90b3R5cGUiLCJvbiIsImV2ZW50VGFyZ2V0T25jZSIsInR5cGUiLCJjYWxsYmFjayIsInRhcmdldCIsImNhbGwiLCJwcmVwYXJlIiwianNMaXN0IiwibGVuZ3RoIiwibG9hZGVyIiwiZXJyIiwiRXJyb3IiLCJKU09OIiwic3RyaW5naWZ5IiwicnVuIiwiX2luaXRDb25maWciLCJiaW5kIiwiYWRkUGVyc2lzdFJvb3ROb2RlIiwibm9kZSIsIk5vZGUiLCJpc05vZGUiLCJ1dWlkIiwid2FybklEIiwic2NlbmUiLCJfc2NlbmUiLCJpc1ZhbGlkIiwicGFyZW50IiwiU2NlbmUiLCJfcGVyc2lzdE5vZGUiLCJpc1BlcnNpc3RSb290Tm9kZSIsInBlcmZvcm1hbmNlIiwibm93IiwiX21heFBhcnRpY2xlRGVsdGFUaW1lIiwiQ0NfSlNCIiwiQ0NfUlVOVElNRSIsImpzYiIsInNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCIsInJlcXVlc3RBbmltRnJhbWUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsIl9zdFRpbWUiLCJfY3RUaW1lIiwid2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwib1JlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibXNDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJvQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2Via2l0Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibXNDYW5jZWxBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIiwid2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJvQ2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjdXJyVGltZSIsInRpbWVUb0NhbGwiLCJNYXRoIiwibWF4Iiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsInNlbGYiLCJza2lwIiwic2V0RGlzcGxheVN0YXRzIiwic2hvd0ZQUyIsImRlYnVnTW9kZSIsImV4cG9zZUNsYXNzTmFtZSIsInJlbmRlck1vZGUiLCJyZWdpc3RlclN5c3RlbUV2ZW50Iiwic2NlbmVzIiwiY29sbGlzaW9uTWF0cml4IiwiZ3JvdXBMaXN0IiwiX3Jlc2V0RGVidWdTZXR0aW5nIiwiX2RldGVybWluZVJlbmRlclR5cGUiLCJ1c2VyUmVuZGVyTW9kZSIsInBhcnNlSW50Iiwic3VwcG9ydFJlbmRlciIsInN5cyIsImNhcGFiaWxpdGllcyIsImdldEVycm9yIiwiZWwiLCJ3aWR0aCIsImhlaWdodCIsImxvY2FsQ2FudmFzIiwibG9jYWxDb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJwYXJlbnROb2RlIiwiYm9keSIsImRvY3VtZW50RWxlbWVudCIsIl9fY2FudmFzIiwiYWRkQ2xhc3MiLCJlbGVtZW50IiwibmFtZSIsImhhc0NsYXNzIiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsIkhUTUxFbGVtZW50IiwicXVlcnlTZWxlY3RvciIsInRhZ05hbWUiLCJpbnNlcnRCZWZvcmUiLCJjbGllbnRXaWR0aCIsImNsaWVudEhlaWdodCIsImFwcGVuZENoaWxkIiwic2V0QXR0cmlidXRlIiwib3B0cyIsIm1hY3JvIiwiRU5BQkxFX1dFQkdMX0FOVElBTElBUyIsIkVOQUJMRV9UUkFOU1BBUkVOVF9DQU5WQVMiLCJpbml0V2ViR0wiLCJkZXZpY2UiLCJfZ2wiLCJDTEVBTlVQX0lNQUdFX0NBQ0hFIiwiZW5hYmxlZCIsImluaXRDYW52YXMiLCJfY3R4Iiwib25jb250ZXh0bWVudSIsIl9pc0NvbnRleHRNZW51RW5hYmxlIiwid2luIiwiaGlkZGVuUHJvcE5hbWUiLCJpbnRlcm5hbCIsImlucHV0TWFuYWdlciIsImhpZGRlbiIsIm1vekhpZGRlbiIsIm1zSGlkZGVuIiwid2Via2l0SGlkZGVuIiwib25IaWRkZW4iLCJvblNob3duIiwiYXJnMCIsImFyZzEiLCJhcmcyIiwiYXJnMyIsImFyZzQiLCJjaGFuZ2VMaXN0IiwiaSIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsInZpc2libGUiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJvbmZvY3VzIiwianMiLCJhZGRvbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFJQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQyxzQkFBRCxDQUF6Qjs7QUFDQUEsT0FBTyxDQUFDLHdCQUFELENBQVA7O0FBQ0EsSUFBTUMsS0FBSyxHQUFHRCxPQUFPLENBQUMsV0FBRCxDQUFyQjs7QUFDQSxJQUFNRSxRQUFRLEdBQUdGLE9BQU8sQ0FBQyxxQkFBRCxDQUF4Qjs7QUFDQSxJQUFNRyxtQkFBbUIsR0FBR0gsT0FBTyxDQUFDLDhDQUFELENBQW5DO0FBRUE7Ozs7QUFJQTs7Ozs7Ozs7QUFNQSxJQUFJSSxJQUFJLEdBQUc7QUFDUDs7Ozs7Ozs7Ozs7Ozs7O0FBZUFDLEVBQUFBLFVBQVUsRUFBRSxjQWhCTDs7QUFrQlA7Ozs7Ozs7Ozs7O0FBV0FDLEVBQUFBLFVBQVUsRUFBRSxjQTdCTDs7QUErQlA7Ozs7Ozs7QUFPQUMsRUFBQUEsYUFBYSxFQUFFLGlCQXRDUjs7QUF3Q1A7Ozs7OztBQU1BQyxFQUFBQSxpQkFBaUIsRUFBRSxhQTlDWjs7QUFnRFA7Ozs7Ozs7QUFPQUMsRUFBQUEsbUJBQW1CLEVBQUUs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LE9BQVAsR0FBaUI3TixJQUEzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxudmFyIEV2ZW50VGFyZ2V0ID0gcmVxdWlyZSgnLi9ldmVudC9ldmVudC10YXJnZXQnKTtcbnJlcXVpcmUoJy4uL2F1ZGlvL0NDQXVkaW9FbmdpbmUnKTtcbmNvbnN0IGRlYnVnID0gcmVxdWlyZSgnLi9DQ0RlYnVnJyk7XG5jb25zdCByZW5kZXJlciA9IHJlcXVpcmUoJy4vcmVuZGVyZXIvaW5kZXguanMnKTtcbmNvbnN0IGR5bmFtaWNBdGxhc01hbmFnZXIgPSByZXF1aXJlKCcuLi9jb3JlL3JlbmRlcmVyL3V0aWxzL2R5bmFtaWMtYXRsYXMvbWFuYWdlcicpO1xuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKipcbiAqICEjZW4gQW4gb2JqZWN0IHRvIGJvb3QgdGhlIGdhbWUuXG4gKiAhI3poIOWMheWQq+a4uOaIj+S4u+S9k+S/oeaBr+W5tui0n+i0o+mpseWKqOa4uOaIj+eahOa4uOaIj+WvueixoeOAglxuICogQGNsYXNzIEdhbWVcbiAqIEBleHRlbmRzIEV2ZW50VGFyZ2V0XG4gKi9cbnZhciBnYW1lID0ge1xuICAgIC8qKlxuICAgICAqICEjZW4gRXZlbnQgdHJpZ2dlcmVkIHdoZW4gZ2FtZSBoaWRlIHRvIGJhY2tncm91bmQuXG4gICAgICogUGxlYXNlIG5vdGUgdGhhdCB0aGlzIGV2ZW50IGlzIG5vdCAxMDAlIGd1YXJhbnRlZWQgdG8gYmUgZmlyZWQgb24gV2ViIHBsYXRmb3JtLFxuICAgICAqIG9uIG5hdGl2ZSBwbGF0Zm9ybXMsIGl0IGNvcnJlc3BvbmRzIHRvIGVudGVyIGJhY2tncm91bmQgZXZlbnQsIG9zIHN0YXR1cyBiYXIgb3Igbm90aWZpY2F0aW9uIGNlbnRlciBtYXkgbm90IHRyaWdnZXIgdGhpcyBldmVudC5cbiAgICAgKiAhI3poIOa4uOaIj+i/m+WFpeWQjuWPsOaXtuinpuWPkeeahOS6i+S7tuOAglxuICAgICAqIOivt+azqOaEj++8jOWcqCBXRUIg5bmz5Y+w77yM6L+Z5Liq5LqL5Lu25LiN5LiA5a6a5LyaIDEwMCUg6Kem5Y+R77yM6L+Z5a6M5YWo5Y+W5Yaz5LqO5rWP6KeI5Zmo55qE5Zue6LCD6KGM5Li644CCXG4gICAgICog5Zyo5Y6f55Sf5bmz5Y+w77yM5a6D5a+55bqU55qE5piv5bqU55So6KKr5YiH5o2i5Yiw5ZCO5Y+w5LqL5Lu277yM5LiL5ouJ6I+c5Y2V5ZKM5LiK5ouJ54q25oCB5qCP562J5LiN5LiA5a6a5Lya6Kem5Y+R6L+Z5Liq5LqL5Lu277yM6L+Z5Y+W5Yaz5LqO57O757uf6KGM5Li644CCXG4gICAgICogQHByb3BlcnR5IEVWRU5UX0hJREVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogY2MuZ2FtZS5vbihjYy5nYW1lLkVWRU5UX0hJREUsIGZ1bmN0aW9uICgpIHtcbiAgICAgKiAgICAgY2MuYXVkaW9FbmdpbmUucGF1c2VNdXNpYygpO1xuICAgICAqICAgICBjYy5hdWRpb0VuZ2luZS5wYXVzZUFsbEVmZmVjdHMoKTtcbiAgICAgKiB9KTtcbiAgICAgKi9cbiAgICBFVkVOVF9ISURFOiBcImdhbWVfb25faGlkZVwiLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBFdmVudCB0cmlnZ2VyZWQgd2hlbiBnYW1lIGJhY2sgdG8gZm9yZWdyb3VuZFxuICAgICAqIFBsZWFzZSBub3RlIHRoYXQgdGhpcyBldmVudCBpcyBub3QgMTAwJSBndWFyYW50ZWVkIHRvIGJlIGZpcmVkIG9uIFdlYiBwbGF0Zm9ybSxcbiAgICAgKiBvbiBuYXRpdmUgcGxhdGZvcm1zLCBpdCBjb3JyZXNwb25kcyB0byBlbnRlciBmb3JlZ3JvdW5kIGV2ZW50LlxuICAgICAqICEjemgg5ri45oiP6L+b5YWl5YmN5Y+w6L+Q6KGM5pe26Kem5Y+R55qE5LqL5Lu244CCXG4gICAgICog6K+35rOo5oSP77yM5ZyoIFdFQiDlubPlj7DvvIzov5nkuKrkuovku7bkuI3kuIDlrprkvJogMTAwJSDop6blj5HvvIzov5nlrozlhajlj5blhrPkuo7mtY/op4jlmajnmoTlm57osIPooYzkuLrjgIJcbiAgICAgKiDlnKjljp/nlJ/lubPlj7DvvIzlroPlr7nlupTnmoTmmK/lupTnlKjooqvliIfmjaLliLDliY3lj7Dkuovku7bjgIJcbiAgICAgKiBAcHJvcGVydHkgRVZFTlRfU0hPV1xuICAgICAqIEBjb25zdGFudFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgRVZFTlRfU0hPVzogXCJnYW1lX29uX3Nob3dcIixcblxuICAgIC8qKlxuICAgICAqICEjZW4gRXZlbnQgdHJpZ2dlcmVkIHdoZW4gZ2FtZSByZXN0YXJ0XG4gICAgICogISN6aCDosIPnlKhyZXN0YXJ05ZCO77yM6Kem5Y+R5LqL5Lu244CCXG4gICAgICogQHByb3BlcnR5IEVWRU5UX1JFU1RBUlRcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIEVWRU5UX1JFU1RBUlQ6IFwiZ2FtZV9vbl9yZXN0YXJ0XCIsXG5cbiAgICAvKipcbiAgICAgKiBFdmVudCB0cmlnZ2VyZWQgYWZ0ZXIgZ2FtZSBpbml0ZWQsIGF0IHRoaXMgcG9pbnQgYWxsIGVuZ2luZSBvYmplY3RzIGFuZCBnYW1lIHNjcmlwdHMgYXJlIGxvYWRlZFxuICAgICAqIEBwcm9wZXJ0eSBFVkVOVF9HQU1FX0lOSVRFRFxuICAgICAqIEBjb25zdGFudFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgRVZFTlRfR0FNRV9JTklURUQ6IFwiZ2FtZV9pbml0ZWRcIixcblxuICAgIC8qKlxuICAgICAqIEV2ZW50IHRyaWdnZXJlZCBhZnRlciBlbmdpbmUgaW5pdGVkLCBhdCB0aGlzIHBvaW50IHlvdSB3aWxsIGJlIGFibGUgdG8gdXNlIGFsbCBlbmdpbmUgY2xhc3Nlcy4gXG4gICAgICogSXQgd2FzIGRlZmluZWQgYXMgRVZFTlRfUkVOREVSRVJfSU5JVEVEIGluIGNvY29zIGNyZWF0b3IgdjEueCBhbmQgcmVuYW1lZCBpbiB2Mi4wXG4gICAgICogQHByb3BlcnR5IEVWRU5UX0VOR0lORV9JTklURURcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIEVWRU5UX0VOR0lORV9JTklURUQ6IFwiZW5naW5lX2luaXRlZFwiLFxuICAgIC8vIGRlcHJlY2F0ZWRcbiAgICBFVkVOVF9SRU5ERVJFUl9JTklURUQ6IFwiZW5naW5lX2luaXRlZFwiLFxuXG4gICAgLyoqXG4gICAgICogV2ViIENhbnZhcyAyZCBBUEkgYXMgcmVuZGVyZXIgYmFja2VuZFxuICAgICAqIEBwcm9wZXJ0eSBSRU5ERVJfVFlQRV9DQU5WQVNcbiAgICAgKiBAY29uc3RhbnRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIFJFTkRFUl9UWVBFX0NBTlZBUzogMCxcbiAgICAvKipcbiAgICAgKiBXZWJHTCBBUEkgYXMgcmVuZGVyZXIgYmFja2VuZFxuICAgICAqIEBwcm9wZXJ0eSBSRU5ERVJfVFlQRV9XRUJHTFxuICAgICAqIEBjb25zdGFudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkVOREVSX1RZUEVfV0VCR0w6IDEsXG4gICAgLyoqXG4gICAgICogT3BlbkdMIEFQSSBhcyByZW5kZXJlciBiYWNrZW5kXG4gICAgICogQHByb3BlcnR5IFJFTkRFUl9UWVBFX09QRU5HTFxuICAgICAqIEBjb25zdGFudFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgUkVOREVSX1RZUEVfT1BFTkdMOiAyLFxuXG4gICAgX3BlcnNpc3RSb290Tm9kZXM6IHt9LFxuXG4gICAgLy8gc3RhdGVzXG4gICAgX3BhdXNlZDogdHJ1ZSwvL3doZXRoZXIgdGhlIGdhbWUgaXMgcGF1c2VkXG4gICAgX2NvbmZpZ0xvYWRlZDogZmFsc2UsLy93aGV0aGVyIGNvbmZpZyBsb2FkZWRcbiAgICBfaXNDbG9uaW5nOiBmYWxzZSwgICAgLy8gZGVzZXJpYWxpemluZyBvciBpbnN0YW50aWF0aW5nXG4gICAgX3ByZXBhcmVkOiBmYWxzZSwgLy93aGV0aGVyIHRoZSBlbmdpbmUgaGFzIHByZXBhcmVkXG4gICAgX3JlbmRlcmVySW5pdGlhbGl6ZWQ6IGZhbHNlLFxuXG4gICAgX3JlbmRlckNvbnRleHQ6IG51bGwsXG5cbiAgICBfaW50ZXJ2YWxJZDogbnVsbCwvL2ludGVydmFsIHRhcmdldCBvZiBtYWluXG5cbiAgICBfbGFzdFRpbWU6IG51bGwsXG4gICAgX2ZyYW1lVGltZTogbnVsbCxcblxuICAgIC8vIFNjZW5lcyBsaXN0XG4gICAgX3NjZW5lSW5mb3M6IFtdLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgb3V0ZXIgZnJhbWUgb2YgdGhlIGdhbWUgY2FudmFzLCBwYXJlbnQgb2YgZ2FtZSBjb250YWluZXIuXG4gICAgICogISN6aCDmuLjmiI/nlLvluIPnmoTlpJbmoYbvvIxjb250YWluZXIg55qE54i25a655Zmo44CCXG4gICAgICogQHByb3BlcnR5IGZyYW1lXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICBmcmFtZTogbnVsbCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBjb250YWluZXIgb2YgZ2FtZSBjYW52YXMuXG4gICAgICogISN6aCDmuLjmiI/nlLvluIPnmoTlrrnlmajjgIJcbiAgICAgKiBAcHJvcGVydHkgY29udGFpbmVyXG4gICAgICogQHR5cGUge0hUTUxEaXZFbGVtZW50fVxuICAgICAqL1xuICAgIGNvbnRhaW5lcjogbnVsbCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBjYW52YXMgb2YgdGhlIGdhbWUuXG4gICAgICogISN6aCDmuLjmiI/nmoTnlLvluIPjgIJcbiAgICAgKiBAcHJvcGVydHkgY2FudmFzXG4gICAgICogQHR5cGUge0hUTUxDYW52YXNFbGVtZW50fVxuICAgICAqL1xuICAgIGNhbnZhczogbnVsbCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHJlbmRlcmVyIGJhY2tlbmQgb2YgdGhlIGdhbWUuXG4gICAgICogISN6aCDmuLjmiI/nmoTmuLLmn5PlmajnsbvlnovjgIJcbiAgICAgKiBAcHJvcGVydHkgcmVuZGVyVHlwZVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgcmVuZGVyVHlwZTogLTEsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGN1cnJlbnQgZ2FtZSBjb25maWd1cmF0aW9uLCBpbmNsdWRpbmc6PGJyLz5cbiAgICAgKiAxLiBkZWJ1Z01vZGU8YnIvPlxuICAgICAqICAgICAgXCJkZWJ1Z01vZGVcIiBwb3NzaWJsZSB2YWx1ZXMgOjxici8+XG4gICAgICogICAgICAwIC0gTm8gbWVzc2FnZSB3aWxsIGJlIHByaW50ZWQuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIDEgLSBjYy5lcnJvciwgY2MuYXNzZXJ0LCBjYy53YXJuLCBjYy5sb2cgd2lsbCBwcmludCBpbiBjb25zb2xlLiAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgMiAtIGNjLmVycm9yLCBjYy5hc3NlcnQsIGNjLndhcm4gd2lsbCBwcmludCBpbiBjb25zb2xlLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAzIC0gY2MuZXJyb3IsIGNjLmFzc2VydCB3aWxsIHByaW50IGluIGNvbnNvbGUuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIDQgLSBjYy5lcnJvciwgY2MuYXNzZXJ0LCBjYy53YXJuLCBjYy5sb2cgd2lsbCBwcmludCBvbiBjYW52YXMsIGF2YWlsYWJsZSBvbmx5IG9uIHdlYi48YnIvPlxuICAgICAqICAgICAgNSAtIGNjLmVycm9yLCBjYy5hc3NlcnQsIGNjLndhcm4gd2lsbCBwcmludCBvbiBjYW52YXMsIGF2YWlsYWJsZSBvbmx5IG9uIHdlYi4gICAgICAgIDxici8+XG4gICAgICogICAgICA2IC0gY2MuZXJyb3IsIGNjLmFzc2VydCB3aWxsIHByaW50IG9uIGNhbnZhcywgYXZhaWxhYmxlIG9ubHkgb24gd2ViLiAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAyLiBzaG93RlBTPGJyLz5cbiAgICAgKiAgICAgIExlZnQgYm90dG9tIGNvcm5lciBmcHMgaW5mb3JtYXRpb24gd2lsbCBzaG93IHdoZW4gXCJzaG93RlBTXCIgZXF1YWxzIHRydWUsIG90aGVyd2lzZSBpdCB3aWxsIGJlIGhpZGUuPGJyLz5cbiAgICAgKiAzLiBleHBvc2VDbGFzc05hbWU8YnIvPlxuICAgICAqICAgICAgRXhwb3NlIGNsYXNzIG5hbWUgdG8gY2hyb21lIGRlYnVnIHRvb2xzLCB0aGUgY2xhc3MgaW50YW50aWF0ZSBwZXJmb3JtYW5jZSBpcyBhIGxpdHRsZSBiaXQgc2xvd2VyIHdoZW4gZXhwb3NlZC48YnIvPlxuICAgICAqIDQuIGZyYW1lUmF0ZTxici8+XG4gICAgICogICAgICBcImZyYW1lUmF0ZVwiIHNldCB0aGUgd2FudGVkIGZyYW1lIHJhdGUgZm9yIHlvdXIgZ2FtZSwgYnV0IHRoZSByZWFsIGZwcyBkZXBlbmRzIG9uIHlvdXIgZ2FtZSBpbXBsZW1lbnRhdGlvbiBhbmQgdGhlIHJ1bm5pbmcgZW52aXJvbm1lbnQuPGJyLz5cbiAgICAgKiA1LiBpZDxici8+XG4gICAgICogICAgICBcImdhbWVDYW52YXNcIiBzZXRzIHRoZSBpZCBvZiB5b3VyIGNhbnZhcyBlbGVtZW50IG9uIHRoZSB3ZWIgcGFnZSwgaXQncyB1c2VmdWwgb25seSBvbiB3ZWIuPGJyLz5cbiAgICAgKiA2LiByZW5kZXJNb2RlPGJyLz5cbiAgICAgKiAgICAgIFwicmVuZGVyTW9kZVwiIHNldHMgdGhlIHJlbmRlcmVyIHR5cGUsIG9ubHkgdXNlZnVsIG9uIHdlYiA6PGJyLz5cbiAgICAgKiAgICAgIDAgLSBBdXRvbWF0aWNhbGx5IGNob3NlbiBieSBlbmdpbmU8YnIvPlxuICAgICAqICAgICAgMSAtIEZvcmNlZCB0byB1c2UgY2FudmFzIHJlbmRlcmVyPGJyLz5cbiAgICAgKiAgICAgIDIgLSBGb3JjZWQgdG8gdXNlIFdlYkdMIHJlbmRlcmVyLCBidXQgdGhpcyB3aWxsIGJlIGlnbm9yZWQgb24gbW9iaWxlIGJyb3dzZXJzPGJyLz5cbiAgICAgKiA3LiBzY2VuZXM8YnIvPlxuICAgICAqICAgICAgXCJzY2VuZXNcIiBpbmNsdWRlIGF2YWlsYWJsZSBzY2VuZXMgaW4gdGhlIGN1cnJlbnQgYnVuZGxlLjxici8+XG4gICAgICo8YnIvPlxuICAgICAqIFBsZWFzZSBETyBOT1QgbW9kaWZ5IHRoaXMgb2JqZWN0IGRpcmVjdGx5LCBpdCB3b24ndCBoYXZlIGFueSBlZmZlY3QuPGJyLz5cbiAgICAgKiAhI3poXG4gICAgICog5b2T5YmN55qE5ri45oiP6YWN572u77yM5YyF5ous77yaICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAxLiBkZWJ1Z01vZGXvvIhkZWJ1ZyDmqKHlvI/vvIzkvYbmmK/lnKjmtY/op4jlmajkuK3ov5nkuKrpgInpobnkvJrooqvlv73nlaXvvIkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICBcImRlYnVnTW9kZVwiIOWQhOenjeiuvue9rumAiemhueeahOaEj+S5ieOAgiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAgICAgMCAtIOayoeaciea2iOaBr+iiq+aJk+WNsOWHuuadpeOAgiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgICAgIDEgLSBjYy5lcnJvcu+8jGNjLmFzc2VydO+8jGNjLndhcm7vvIxjYy5sb2cg5bCG5omT5Y2w5ZyoIGNvbnNvbGUg5Lit44CCICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgICAgICAyIC0gY2MuZXJyb3LvvIxjYy5hc3NlcnTvvIxjYy53YXJuIOWwhuaJk+WNsOWcqCBjb25zb2xlIOS4reOAgiAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgICAgICAzIC0gY2MuZXJyb3LvvIxjYy5hc3NlcnQg5bCG5omT5Y2w5ZyoIGNvbnNvbGUg5Lit44CCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAgICAgIDQgLSBjYy5lcnJvcu+8jGNjLmFzc2VydO+8jGNjLndhcm7vvIxjYy5sb2cg5bCG5omT5Y2w5ZyoIGNhbnZhcyDkuK3vvIjku4XpgILnlKjkuo4gd2ViIOerr++8ieOAgiA8YnIvPlxuICAgICAqICAgICAgICAgIDUgLSBjYy5lcnJvcu+8jGNjLmFzc2VydO+8jGNjLndhcm4g5bCG5omT5Y2w5ZyoIGNhbnZhcyDkuK3vvIjku4XpgILnlKjkuo4gd2ViIOerr++8ieOAgiAgICAgICAgIDxici8+XG4gICAgICogICAgICAgICAgNiAtIGNjLmVycm9y77yMY2MuYXNzZXJ0IOWwhuaJk+WNsOWcqCBjYW52YXMg5Lit77yI5LuF6YCC55So5LqOIHdlYiDnq6/vvInjgIIgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqIDIuIHNob3dGUFPvvIjmmL7npLogRlBT77yJICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIOW9kyBzaG93RlBTIOS4uiB0cnVlIOeahOaXtuWAmeeVjOmdoueahOW3puS4i+inkuWwhuaYvuekuiBmcHMg55qE5L+h5oGv77yM5ZCm5YiZ6KKr6ZqQ6JeP44CCICAgICAgICAgICAgICA8YnIvPlxuICAgICAqIDMuIGV4cG9zZUNsYXNzTmFtZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIOaatOmcsuexu+WQjeiuqSBDaHJvbWUgRGV2VG9vbHMg5Y+v5Lul6K+G5Yir77yM5aaC5p6c5byA5ZCv5Lya56iN56iN6ZmN5L2O57G755qE5Yib5bu66L+H56iL55qE5oCn6IO977yM5L2G5a+55a+56LGh5p6E6YCg5rKh5pyJ5b2x5ZON44CCIDxici8+XG4gICAgICogNC4gZnJhbWVSYXRlICjluKfnjocpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAg4oCcZnJhbWVSYXRl4oCdIOiuvue9ruaDs+imgeeahOW4p+eOh+S9oOeahOa4uOaIj++8jOS9huecn+ato+eahEZQU+WPluWGs+S6juS9oOeahOa4uOaIj+WunueOsOWSjOi/kOihjOeOr+Wig+OAgiAgICAgIDxici8+XG4gICAgICogNS4gaWQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIFwiZ2FtZUNhbnZhc1wiIFdlYiDpobXpnaLkuIrnmoQgQ2FudmFzIEVsZW1lbnQgSUTvvIzku4XpgILnlKjkuo4gd2ViIOerr+OAgiAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqIDYuIHJlbmRlck1vZGXvvIjmuLLmn5PmqKHlvI/vvIkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqICAgICAg4oCccmVuZGVyTW9kZeKAnSDorr7nva7muLLmn5PlmajnsbvlnovvvIzku4XpgILnlKjkuo4gd2ViIOerr++8miAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICogICAgICAgICAgMCAtIOmAmui/h+W8leaTjuiHquWKqOmAieaLqeOAgiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgICAgICAxIC0g5by65Yi25L2/55SoIGNhbnZhcyDmuLLmn5PjgIJcbiAgICAgKiAgICAgICAgICAyIC0g5by65Yi25L2/55SoIFdlYkdMIOa4suafk++8jOS9huaYr+WcqOmDqOWIhiBBbmRyb2lkIOa1j+iniOWZqOS4rei/meS4qumAiemhueS8muiiq+W/veeVpeOAgiAgICAgPGJyLz5cbiAgICAgKiA3LiBzY2VuZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgKiAgICAgIOKAnHNjZW5lc+KAnSDlvZPliY3ljIXkuK3lj6/nlKjlnLrmma/jgIIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnIvPlxuICAgICAqIDxici8+XG4gICAgICog5rOo5oSP77ya6K+35LiN6KaB55u05o6l5L+u5pS56L+Z5Liq5a+56LGh77yM5a6D5LiN5Lya5pyJ5Lu75L2V5pWI5p6c44CCXG4gICAgICogQHByb3BlcnR5IGNvbmZpZ1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgY29uZmlnOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBDYWxsYmFjayB3aGVuIHRoZSBzY3JpcHRzIG9mIGVuZ2luZSBoYXZlIGJlZW4gbG9hZC5cbiAgICAgKiAhI3poIOW9k+W8leaTjuWujOaIkOWQr+WKqOWQjueahOWbnuiwg+WHveaVsOOAglxuICAgICAqIEBtZXRob2Qgb25TdGFydFxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICBvblN0YXJ0OiBudWxsLFxuXG4vL0BQdWJsaWMgTWV0aG9kc1xuXG4vLyAgQEdhbWUgcGxheSBjb250cm9sXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgZnJhbWUgcmF0ZSBvZiBnYW1lLlxuICAgICAqICEjemgg6K6+572u5ri45oiP5bin546H44CCXG4gICAgICogQG1ldGhvZCBzZXRGcmFtZVJhdGVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZnJhbWVSYXRlXG4gICAgICovXG4gICAgc2V0RnJhbWVSYXRlOiBmdW5jdGlvbiAoZnJhbWVSYXRlKSB7XG4gICAgICAgIHZhciBjb25maWcgPSB0aGlzLmNvbmZpZztcbiAgICAgICAgY29uZmlnLmZyYW1lUmF0ZSA9IGZyYW1lUmF0ZTtcbiAgICAgICAgaWYgKHRoaXMuX2ludGVydmFsSWQpXG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbUZyYW1lKHRoaXMuX2ludGVydmFsSWQpO1xuICAgICAgICB0aGlzLl9pbnRlcnZhbElkID0gMDtcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fc2V0QW5pbUZyYW1lKCk7XG4gICAgICAgIHRoaXMuX3J1bk1haW5Mb29wKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0IGZyYW1lIHJhdGUgc2V0IGZvciB0aGUgZ2FtZSwgaXQgZG9lc24ndCByZXByZXNlbnQgdGhlIHJlYWwgZnJhbWUgcmF0ZS5cbiAgICAgKiAhI3poIOiOt+WPluiuvue9rueahOa4uOaIj+W4p+eOh++8iOS4jeetieWQjOS6juWunumZheW4p+eOh++8ieOAglxuICAgICAqIEBtZXRob2QgZ2V0RnJhbWVSYXRlXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBmcmFtZSByYXRlXG4gICAgICovXG4gICAgZ2V0RnJhbWVSYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5mcmFtZVJhdGU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUnVuIHRoZSBnYW1lIGZyYW1lIGJ5IGZyYW1lLlxuICAgICAqICEjemgg5omn6KGM5LiA5bin5ri45oiP5b6q546v44CCXG4gICAgICogQG1ldGhvZCBzdGVwXG4gICAgICovXG4gICAgc3RlcDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5tYWluTG9vcCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFBhdXNlIHRoZSBnYW1lIG1haW4gbG9vcC4gVGhpcyB3aWxsIHBhdXNlOlxuICAgICAqIGdhbWUgbG9naWMgZXhlY3V0aW9uLCByZW5kZXJpbmcgcHJvY2VzcywgZXZlbnQgbWFuYWdlciwgYmFja2dyb3VuZCBtdXNpYyBhbmQgYWxsIGF1ZGlvIGVmZmVjdHMuXG4gICAgICogVGhpcyBpcyBkaWZmZXJlbnQgd2l0aCBjYy5kaXJlY3Rvci5wYXVzZSB3aGljaCBvbmx5IHBhdXNlIHRoZSBnYW1lIGxvZ2ljIGV4ZWN1dGlvbi5cbiAgICAgKiAhI3poIOaaguWBnOa4uOaIj+S4u+W+queOr+OAguWMheWQq++8mua4uOaIj+mAu+i+ke+8jOa4suafk++8jOS6i+S7tuWkhOeQhu+8jOiDjOaZr+mfs+S5kOWSjOaJgOaciemfs+aViOOAgui/meeCueWSjOWPquaaguWBnOa4uOaIj+mAu+i+keeahCBjYy5kaXJlY3Rvci5wYXVzZSDkuI3lkIzjgIJcbiAgICAgKiBAbWV0aG9kIHBhdXNlXG4gICAgICovXG4gICAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3BhdXNlZCkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9wYXVzZWQgPSB0cnVlO1xuICAgICAgICAvLyBQYXVzZSBhdWRpbyBlbmdpbmVcbiAgICAgICAgaWYgKGNjLmF1ZGlvRW5naW5lKSB7XG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5fYnJlYWsoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBQYXVzZSBtYWluIGxvb3BcbiAgICAgICAgaWYgKHRoaXMuX2ludGVydmFsSWQpXG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbUZyYW1lKHRoaXMuX2ludGVydmFsSWQpO1xuICAgICAgICB0aGlzLl9pbnRlcnZhbElkID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXN1bWUgdGhlIGdhbWUgZnJvbSBwYXVzZS4gVGhpcyB3aWxsIHJlc3VtZTpcbiAgICAgKiBnYW1lIGxvZ2ljIGV4ZWN1dGlvbiwgcmVuZGVyaW5nIHByb2Nlc3MsIGV2ZW50IG1hbmFnZXIsIGJhY2tncm91bmQgbXVzaWMgYW5kIGFsbCBhdWRpbyBlZmZlY3RzLlxuICAgICAqICEjemgg5oGi5aSN5ri45oiP5Li75b6q546v44CC5YyF5ZCr77ya5ri45oiP6YC76L6R77yM5riy5p+T77yM5LqL5Lu25aSE55CG77yM6IOM5pmv6Z+z5LmQ5ZKM5omA5pyJ6Z+z5pWI44CCXG4gICAgICogQG1ldGhvZCByZXN1bWVcbiAgICAgKi9cbiAgICByZXN1bWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9wYXVzZWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG4gICAgICAgIC8vIFJlc3VtZSBhdWRpbyBlbmdpbmVcbiAgICAgICAgaWYgKGNjLmF1ZGlvRW5naW5lKSB7XG4gICAgICAgICAgICBjYy5hdWRpb0VuZ2luZS5fcmVzdG9yZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNjLmRpcmVjdG9yLl9yZXNldERlbHRhVGltZSgpO1xuICAgICAgICAvLyBSZXN1bWUgbWFpbiBsb29wXG4gICAgICAgIHRoaXMuX3J1bk1haW5Mb29wKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciB0aGUgZ2FtZSBpcyBwYXVzZWQuXG4gICAgICogISN6aCDliKTmlq3muLjmiI/mmK/lkKbmmoLlgZzjgIJcbiAgICAgKiBAbWV0aG9kIGlzUGF1c2VkXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1BhdXNlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGF1c2VkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlc3RhcnQgZ2FtZS5cbiAgICAgKiAhI3poIOmHjeaWsOW8gOWni+a4uOaIj1xuICAgICAqIEBtZXRob2QgcmVzdGFydFxuICAgICAqL1xuICAgIHJlc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3Iub25jZShjYy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9EUkFXLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpZCBpbiBnYW1lLl9wZXJzaXN0Um9vdE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgZ2FtZS5yZW1vdmVQZXJzaXN0Um9vdE5vZGUoZ2FtZS5fcGVyc2lzdFJvb3ROb2Rlc1tpZF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDbGVhciBzY2VuZVxuICAgICAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NlbmUoKS5kZXN0cm95KCk7XG4gICAgICAgICAgICBjYy5PYmplY3QuX2RlZmVycmVkRGVzdHJveSgpO1xuXG4gICAgICAgICAgICAvLyBDbGVhbiB1cCBhdWRpb1xuICAgICAgICAgICAgaWYgKGNjLmF1ZGlvRW5naW5lKSB7XG4gICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUudW5jYWNoZUFsbCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5yZXNldCgpO1xuXG4gICAgICAgICAgICBnYW1lLnBhdXNlKCk7XG4gICAgICAgICAgICBjYy5Bc3NldExpYnJhcnkuX2xvYWRCdWlsdGlucygoKSA9PiB7XG4gICAgICAgICAgICAgICAgZ2FtZS5vblN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgZ2FtZS5lbWl0KGdhbWUuRVZFTlRfUkVTVEFSVCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRW5kIGdhbWUsIGl0IHdpbGwgY2xvc2UgdGhlIGdhbWUgd2luZG93XG4gICAgICogISN6aCDpgIDlh7rmuLjmiI9cbiAgICAgKiBAbWV0aG9kIGVuZFxuICAgICAqL1xuICAgIGVuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjbG9zZSgpO1xuICAgIH0sXG5cbi8vICBAR2FtZSBsb2FkaW5nXG5cbiAgICBfaW5pdEVuZ2luZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJlckluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9pbml0UmVuZGVyZXIoKTtcblxuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5faW5pdEV2ZW50cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfRU5HSU5FX0lOSVRFRCk7XG4gICAgfSxcblxuICAgIF9sb2FkUHJldmlld1NjcmlwdCAoY2IpIHtcbiAgICAgICAgaWYgKENDX1BSRVZJRVcgJiYgd2luZG93Ll9fcXVpY2tfY29tcGlsZV9wcm9qZWN0X18pIHtcbiAgICAgICAgICAgIHdpbmRvdy5fX3F1aWNrX2NvbXBpbGVfcHJvamVjdF9fLmxvYWQoY2IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2IoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcHJlcGFyZUZpbmlzaGVkIChjYikge1xuICAgICAgICAvLyBJbml0IGVuZ2luZVxuICAgICAgICB0aGlzLl9pbml0RW5naW5lKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9zZXRBbmltRnJhbWUoKTtcbiAgICAgICAgY2MuQXNzZXRMaWJyYXJ5Ll9sb2FkQnVpbHRpbnMoKCkgPT4ge1xuICAgICAgICAgICAgLy8gTG9nIGVuZ2luZSB2ZXJzaW9uXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ29jb3MgQ3JlYXRvciB2JyArIGNjLkVOR0lORV9WRVJTSU9OKTtcbiAgICAgICAgICAgIHRoaXMuX3ByZXBhcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3J1bk1haW5Mb29wKCk7XG5cbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX0dBTUVfSU5JVEVEKTtcblxuICAgICAgICAgICAgaWYgKGNiKSBjYigpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZXZlbnRUYXJnZXRPbjogRXZlbnRUYXJnZXQucHJvdG90eXBlLm9uLFxuICAgIGV2ZW50VGFyZ2V0T25jZTogRXZlbnRUYXJnZXQucHJvdG90eXBlLm9uY2UsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmVnaXN0ZXIgYW4gY2FsbGJhY2sgb2YgYSBzcGVjaWZpYyBldmVudCB0eXBlIG9uIHRoZSBnYW1lIG9iamVjdC5cbiAgICAgKiBUaGlzIHR5cGUgb2YgZXZlbnQgc2hvdWxkIGJlIHRyaWdnZXJlZCB2aWEgYGVtaXRgLlxuICAgICAqICEjemhcbiAgICAgKiDms6jlhowgZ2FtZSDnmoTnibnlrprkuovku7bnsbvlnovlm57osIPjgILov5nnp43nsbvlnovnmoTkuovku7blupTor6XooqsgYGVtaXRgIOinpuWPkeOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIGxpc3RlbiBmb3IuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnMV0gYXJnMVxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnMl0gYXJnMlxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnM10gYXJnM1xuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNF0gYXJnNFxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNV0gYXJnNVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XSAtIFRoZSB0YXJnZXQgKHRoaXMgb2JqZWN0KSB0byBpbnZva2UgdGhlIGNhbGxiYWNrLCBjYW4gYmUgbnVsbFxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSAtIEp1c3QgcmV0dXJucyB0aGUgaW5jb21pbmcgY2FsbGJhY2sgc28geW91IGNhbiBzYXZlIHRoZSBhbm9ueW1vdXMgZnVuY3Rpb24gZWFzaWVyLlxuICAgICAqIEB0eXBlc2NyaXB0XG4gICAgICogb248VCBleHRlbmRzIEZ1bmN0aW9uPih0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiBULCB0YXJnZXQ/OiBhbnksIHVzZUNhcHR1cmU/OiBib29sZWFuKTogVFxuICAgICAqL1xuICAgIG9uICh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0LCBvbmNlKSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBFVkVOVF9FTkdJTkVfSU5JVEVEIGFuZCBFVkVOVF9HQU1FX0lOSVRFRCBjYWxsYmFja3MgdG8gYmUgaW52b2tlZFxuICAgICAgICBpZiAoKHRoaXMuX3ByZXBhcmVkICYmIHR5cGUgPT09IHRoaXMuRVZFTlRfRU5HSU5FX0lOSVRFRCkgfHxcbiAgICAgICAgICAgICghdGhpcy5fcGF1c2VkICYmIHR5cGUgPT09IHRoaXMuRVZFTlRfR0FNRV9JTklURUQpKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50VGFyZ2V0T24odHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgb25jZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZWdpc3RlciBhbiBjYWxsYmFjayBvZiBhIHNwZWNpZmljIGV2ZW50IHR5cGUgb24gdGhlIGdhbWUgb2JqZWN0LFxuICAgICAqIHRoZSBjYWxsYmFjayB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgdGhlIGZpcnN0IHRpbWUgaXQgaXMgdHJpZ2dlcmVkLlxuICAgICAqICEjemhcbiAgICAgKiDms6jlhowgZ2FtZSDnmoTnibnlrprkuovku7bnsbvlnovlm57osIPvvIzlm57osIPkvJrlnKjnrKzkuIDml7bpl7Tooqvop6blj5HlkI7liKDpmaToh6rouqvjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2Qgb25jZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIGxpc3RlbiBmb3IuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnMV0gYXJnMVxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnMl0gYXJnMlxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnM10gYXJnM1xuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNF0gYXJnNFxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNV0gYXJnNVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbdGFyZ2V0XSAtIFRoZSB0YXJnZXQgKHRoaXMgb2JqZWN0KSB0byBpbnZva2UgdGhlIGNhbGxiYWNrLCBjYW4gYmUgbnVsbFxuICAgICAqL1xuICAgIG9uY2UgKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpIHtcbiAgICAgICAgLy8gTWFrZSBzdXJlIEVWRU5UX0VOR0lORV9JTklURUQgYW5kIEVWRU5UX0dBTUVfSU5JVEVEIGNhbGxiYWNrcyB0byBiZSBpbnZva2VkXG4gICAgICAgIGlmICgodGhpcy5fcHJlcGFyZWQgJiYgdHlwZSA9PT0gdGhpcy5FVkVOVF9FTkdJTkVfSU5JVEVEKSB8fFxuICAgICAgICAgICAgKCF0aGlzLl9wYXVzZWQgJiYgdHlwZSA9PT0gdGhpcy5FVkVOVF9HQU1FX0lOSVRFRCkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRUYXJnZXRPbmNlKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUHJlcGFyZSBnYW1lLlxuICAgICAqICEjemgg5YeG5aSH5byV5pOO77yM6K+35LiN6KaB55u05o6l6LCD55So6L+Z5Liq5Ye95pWw44CCXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2JcbiAgICAgKiBAbWV0aG9kIHByZXBhcmVcbiAgICAgKi9cbiAgICBwcmVwYXJlIChjYikge1xuICAgICAgICAvLyBBbHJlYWR5IHByZXBhcmVkXG4gICAgICAgIGlmICh0aGlzLl9wcmVwYXJlZCkge1xuICAgICAgICAgICAgaWYgKGNiKSBjYigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTG9hZCBnYW1lIHNjcmlwdHNcbiAgICAgICAgbGV0IGpzTGlzdCA9IHRoaXMuY29uZmlnLmpzTGlzdDtcbiAgICAgICAgaWYgKGpzTGlzdCAmJiBqc0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY2MubG9hZGVyLmxvYWQoanNMaXN0LCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgbmV3IEVycm9yKEpTT04uc3RyaW5naWZ5KGVycikpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fbG9hZFByZXZpZXdTY3JpcHQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wcmVwYXJlRmluaXNoZWQoY2IpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRQcmV2aWV3U2NyaXB0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcmVwYXJlRmluaXNoZWQoY2IpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJ1biBnYW1lIHdpdGggY29uZmlndXJhdGlvbiBvYmplY3QgYW5kIG9uU3RhcnQgZnVuY3Rpb24uXG4gICAgICogISN6aCDov5DooYzmuLjmiI/vvIzlubbkuJTmjIflrprlvJXmk47phY3nva7lkowgb25TdGFydCDnmoTlm57osIPjgIJcbiAgICAgKiBAbWV0aG9kIHJ1blxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBQYXNzIGNvbmZpZ3VyYXRpb24gb2JqZWN0IG9yIG9uU3RhcnQgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvblN0YXJ0IC0gZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZ2FtZSBpbml0aWFsaXplZFxuICAgICAqL1xuICAgIHJ1bjogZnVuY3Rpb24gKGNvbmZpZywgb25TdGFydCkge1xuICAgICAgICB0aGlzLl9pbml0Q29uZmlnKGNvbmZpZyk7XG4gICAgICAgIHRoaXMub25TdGFydCA9IG9uU3RhcnQ7XG4gICAgICAgIHRoaXMucHJlcGFyZShnYW1lLm9uU3RhcnQgJiYgZ2FtZS5vblN0YXJ0LmJpbmQoZ2FtZSkpO1xuICAgIH0sXG5cbi8vICBAIFBlcnNpc3Qgcm9vdCBub2RlIHNlY3Rpb25cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQWRkIGEgcGVyc2lzdGVudCByb290IG5vZGUgdG8gdGhlIGdhbWUsIHRoZSBwZXJzaXN0ZW50IG5vZGUgd29uJ3QgYmUgZGVzdHJveWVkIGR1cmluZyBzY2VuZSB0cmFuc2l0aW9uLjxici8+XG4gICAgICogVGhlIHRhcmdldCBub2RlIG11c3QgYmUgcGxhY2VkIGluIHRoZSByb290IGxldmVsIG9mIGhpZXJhcmNoeSwgb3RoZXJ3aXNlIHRoaXMgQVBJIHdvbid0IGhhdmUgYW55IGVmZmVjdC5cbiAgICAgKiAhI3poXG4gICAgICog5aOw5piO5bi46am75qC56IqC54K577yM6K+l6IqC54K55LiN5Lya6KKr5Zyo5Zy65pmv5YiH5o2i5Lit6KKr6ZSA5q+B44CCPGJyLz5cbiAgICAgKiDnm67moIfoioLngrnlv4XpobvkvY3kuo7kuLrlsYLnuqfnmoTmoLnoioLngrnvvIzlkKbliJnml6DmlYjjgIJcbiAgICAgKiBAbWV0aG9kIGFkZFBlcnNpc3RSb290Tm9kZVxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAtIFRoZSBub2RlIHRvIGJlIG1hZGUgcGVyc2lzdGVudFxuICAgICAqL1xuICAgIGFkZFBlcnNpc3RSb290Tm9kZTogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaWYgKCFjYy5Ob2RlLmlzTm9kZShub2RlKSB8fCAhbm9kZS51dWlkKSB7XG4gICAgICAgICAgICBjYy53YXJuSUQoMzgwMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlkID0gbm9kZS51dWlkO1xuICAgICAgICBpZiAoIXRoaXMuX3BlcnNpc3RSb290Tm9kZXNbaWRdKSB7XG4gICAgICAgICAgICB2YXIgc2NlbmUgPSBjYy5kaXJlY3Rvci5fc2NlbmU7XG4gICAgICAgICAgICBpZiAoY2MuaXNWYWxpZChzY2VuZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gc2NlbmU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCAhKG5vZGUucGFyZW50IGluc3RhbmNlb2YgY2MuU2NlbmUpICkge1xuICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzgwMSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5wYXJlbnQgIT09IHNjZW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzODAyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3BlcnNpc3RSb290Tm9kZXNbaWRdID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUuX3BlcnNpc3ROb2RlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJlbW92ZSBhIHBlcnNpc3RlbnQgcm9vdCBub2RlLlxuICAgICAqICEjemgg5Y+W5raI5bi46am75qC56IqC54K544CCXG4gICAgICogQG1ldGhvZCByZW1vdmVQZXJzaXN0Um9vdE5vZGVcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBUaGUgbm9kZSB0byBiZSByZW1vdmVkIGZyb20gcGVyc2lzdGVudCBub2RlIGxpc3RcbiAgICAgKi9cbiAgICByZW1vdmVQZXJzaXN0Um9vdE5vZGU6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIHZhciBpZCA9IG5vZGUudXVpZCB8fCAnJztcbiAgICAgICAgaWYgKG5vZGUgPT09IHRoaXMuX3BlcnNpc3RSb290Tm9kZXNbaWRdKSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fcGVyc2lzdFJvb3ROb2Rlc1tpZF07XG4gICAgICAgICAgICBub2RlLl9wZXJzaXN0Tm9kZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2hlY2sgd2hldGhlciB0aGUgbm9kZSBpcyBhIHBlcnNpc3RlbnQgcm9vdCBub2RlLlxuICAgICAqICEjemgg5qOA5p+l6IqC54K55piv5ZCm5piv5bi46am75qC56IqC54K544CCXG4gICAgICogQG1ldGhvZCBpc1BlcnNpc3RSb290Tm9kZVxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZSAtIFRoZSBub2RlIHRvIGJlIGNoZWNrZWRcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzUGVyc2lzdFJvb3ROb2RlOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICByZXR1cm4gbm9kZS5fcGVyc2lzdE5vZGU7XG4gICAgfSxcblxuLy9AUHJpdmF0ZSBNZXRob2RzXG5cbi8vICBAVGltZSB0aWNrZXIgc2VjdGlvblxuICAgIF9zZXRBbmltRnJhbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fbGFzdFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgdmFyIGZyYW1lUmF0ZSA9IGdhbWUuY29uZmlnLmZyYW1lUmF0ZTtcbiAgICAgICAgdGhpcy5fZnJhbWVUaW1lID0gMTAwMCAvIGZyYW1lUmF0ZTtcbiAgICAgICAgY2MuZGlyZWN0b3IuX21heFBhcnRpY2xlRGVsdGFUaW1lID0gdGhpcy5fZnJhbWVUaW1lIC8gMTAwMCAqIDI7XG4gICAgICAgIGlmIChDQ19KU0IgfHwgQ0NfUlVOVElNRSkge1xuICAgICAgICAgICAganNiLnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZChmcmFtZVJhdGUpO1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1GcmFtZSA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmcmFtZVJhdGUgIT09IDYwICYmIGZyYW1lUmF0ZSAhPT0gMzApIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IHRoaXMuX3N0VGltZTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbUZyYW1lID0gdGhpcy5fY3RUaW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuX3N0VGltZTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbUZyYW1lID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICAgICAgd2luZG93LmNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy5tc0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cub0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cubXNDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy5vQ2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgICAgICB0aGlzLl9jdFRpbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIF9zdFRpbWU6IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgZ2FtZS5fZnJhbWVUaW1lIC0gKGN1cnJUaW1lIC0gZ2FtZS5fbGFzdFRpbWUpKTtcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKCk7IH0sXG4gICAgICAgICAgICB0aW1lVG9DYWxsKTtcbiAgICAgICAgZ2FtZS5fbGFzdFRpbWUgPSBjdXJyVGltZSArIHRpbWVUb0NhbGw7XG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9LFxuICAgIF9jdFRpbWU6IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChpZCk7XG4gICAgfSxcbiAgICAvL1J1biBnYW1lLlxuICAgIF9ydW5NYWluTG9vcDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9wcmVwYXJlZCkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBzZWxmID0gdGhpcywgY2FsbGJhY2ssIGNvbmZpZyA9IHNlbGYuY29uZmlnLFxuICAgICAgICAgICAgZGlyZWN0b3IgPSBjYy5kaXJlY3RvcixcbiAgICAgICAgICAgIHNraXAgPSB0cnVlLCBmcmFtZVJhdGUgPSBjb25maWcuZnJhbWVSYXRlO1xuXG4gICAgICAgIGRlYnVnLnNldERpc3BsYXlTdGF0cyhjb25maWcuc2hvd0ZQUyk7XG5cbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAobm93KSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYuX3BhdXNlZCkge1xuICAgICAgICAgICAgICAgIHNlbGYuX2ludGVydmFsSWQgPSB3aW5kb3cucmVxdWVzdEFuaW1GcmFtZShjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgaWYgKCFDQ19KU0IgJiYgIUNDX1JVTlRJTUUgJiYgZnJhbWVSYXRlID09PSAzMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2tpcCA9ICFza2lwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGlyZWN0b3IubWFpbkxvb3Aobm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBzZWxmLl9pbnRlcnZhbElkID0gd2luZG93LnJlcXVlc3RBbmltRnJhbWUoY2FsbGJhY2spO1xuICAgICAgICBzZWxmLl9wYXVzZWQgPSBmYWxzZTtcbiAgICB9LFxuXG4vLyAgQEdhbWUgbG9hZGluZyBzZWN0aW9uXG4gICAgX2luaXRDb25maWcgKGNvbmZpZykge1xuICAgICAgICAvLyBDb25maWdzIGFkanVzdG1lbnRcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuZGVidWdNb2RlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgY29uZmlnLmRlYnVnTW9kZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY29uZmlnLmV4cG9zZUNsYXNzTmFtZSA9ICEhY29uZmlnLmV4cG9zZUNsYXNzTmFtZTtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuZnJhbWVSYXRlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgY29uZmlnLmZyYW1lUmF0ZSA9IDYwO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZW5kZXJNb2RlID0gY29uZmlnLnJlbmRlck1vZGU7XG4gICAgICAgIGlmICh0eXBlb2YgcmVuZGVyTW9kZSAhPT0gJ251bWJlcicgfHwgcmVuZGVyTW9kZSA+IDIgfHwgcmVuZGVyTW9kZSA8IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5yZW5kZXJNb2RlID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy5yZWdpc3RlclN5c3RlbUV2ZW50ICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGNvbmZpZy5yZWdpc3RlclN5c3RlbUV2ZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVuZGVyTW9kZSA9PT0gMSkge1xuICAgICAgICAgICAgY29uZmlnLnNob3dGUFMgPSBmYWxzZTsgICAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuc2hvd0ZQUyA9ICEhY29uZmlnLnNob3dGUFM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTY2VuZSBwYXJzZXJcbiAgICAgICAgdGhpcy5fc2NlbmVJbmZvcyA9IGNvbmZpZy5zY2VuZXMgfHwgW107XG5cbiAgICAgICAgLy8gQ29sbGlkZSBNYXAgYW5kIEdyb3VwIExpc3RcbiAgICAgICAgdGhpcy5jb2xsaXNpb25NYXRyaXggPSBjb25maWcuY29sbGlzaW9uTWF0cml4IHx8IFtdO1xuICAgICAgICB0aGlzLmdyb3VwTGlzdCA9IGNvbmZpZy5ncm91cExpc3QgfHwgW107XG5cbiAgICAgICAgZGVidWcuX3Jlc2V0RGVidWdTZXR0aW5nKGNvbmZpZy5kZWJ1Z01vZGUpO1xuXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLl9jb25maWdMb2FkZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBfZGV0ZXJtaW5lUmVuZGVyVHlwZSAoKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgIHVzZXJSZW5kZXJNb2RlID0gcGFyc2VJbnQoY29uZmlnLnJlbmRlck1vZGUpIHx8IDA7XG4gICAgXG4gICAgICAgIC8vIERldGVybWluZSBSZW5kZXJUeXBlXG4gICAgICAgIHRoaXMucmVuZGVyVHlwZSA9IHRoaXMuUkVOREVSX1RZUEVfQ0FOVkFTO1xuICAgICAgICBsZXQgc3VwcG9ydFJlbmRlciA9IGZhbHNlO1xuICAgIFxuICAgICAgICBpZiAodXNlclJlbmRlck1vZGUgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuY2FwYWJpbGl0aWVzWydvcGVuZ2wnXSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVHlwZSA9IHRoaXMuUkVOREVSX1RZUEVfV0VCR0w7XG4gICAgICAgICAgICAgICAgc3VwcG9ydFJlbmRlciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjYy5zeXMuY2FwYWJpbGl0aWVzWydjYW52YXMnXSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVHlwZSA9IHRoaXMuUkVOREVSX1RZUEVfQ0FOVkFTO1xuICAgICAgICAgICAgICAgIHN1cHBvcnRSZW5kZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVzZXJSZW5kZXJNb2RlID09PSAxICYmIGNjLnN5cy5jYXBhYmlsaXRpZXNbJ2NhbnZhcyddKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclR5cGUgPSB0aGlzLlJFTkRFUl9UWVBFX0NBTlZBUztcbiAgICAgICAgICAgIHN1cHBvcnRSZW5kZXIgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVzZXJSZW5kZXJNb2RlID09PSAyICYmIGNjLnN5cy5jYXBhYmlsaXRpZXNbJ29wZW5nbCddKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclR5cGUgPSB0aGlzLlJFTkRFUl9UWVBFX1dFQkdMO1xuICAgICAgICAgICAgc3VwcG9ydFJlbmRlciA9IHRydWU7XG4gICAgICAgIH1cbiAgICBcbiAgICAgICAgaWYgKCFzdXBwb3J0UmVuZGVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGVidWcuZ2V0RXJyb3IoMzgyMCwgdXNlclJlbmRlck1vZGUpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfaW5pdFJlbmRlcmVyICgpIHtcbiAgICAgICAgLy8gQXZvaWQgc2V0dXAgdG8gYmUgY2FsbGVkIHR3aWNlLlxuICAgICAgICBpZiAodGhpcy5fcmVuZGVyZXJJbml0aWFsaXplZCkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBlbCA9IHRoaXMuY29uZmlnLmlkLFxuICAgICAgICAgICAgd2lkdGgsIGhlaWdodCxcbiAgICAgICAgICAgIGxvY2FsQ2FudmFzLCBsb2NhbENvbnRhaW5lcjtcblxuICAgICAgICBpZiAoQ0NfSlNCIHx8IENDX1JVTlRJTUUpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gbG9jYWxDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IGxvY2FsQ29udGFpbmVyLnBhcmVudE5vZGUgPT09IGRvY3VtZW50LmJvZHkgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgOiBsb2NhbENvbnRhaW5lci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgbG9jYWxDYW52YXMgPSB3aW5kb3cuX19jYW52YXM7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IGxvY2FsQ2FudmFzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSAoZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgPyBlbCA6IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKSB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIGVsKSk7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT09IFwiQ0FOVkFTXCIpIHtcbiAgICAgICAgICAgICAgICB3aWR0aCA9IGVsZW1lbnQud2lkdGg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAvL2l0IGlzIGFscmVhZHkgYSBjYW52YXMsIHdlIHdyYXAgaXQgYXJvdW5kIHdpdGggYSBkaXZcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcyA9IGxvY2FsQ2FudmFzID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGxvY2FsQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxDYW52YXMucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxDYW52YXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobG9jYWxDb250YWluZXIsIGxvY2FsQ2FudmFzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy93ZSBtdXN0IG1ha2UgYSBuZXcgY2FudmFzIGFuZCBwbGFjZSBpbnRvIHRoaXMgZWxlbWVudFxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUgIT09IFwiRElWXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2Mud2FybklEKDM4MTkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3aWR0aCA9IGVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gZWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMgPSBsb2NhbENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJDQU5WQVNcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBsb2NhbENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChsb2NhbENvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2NhbENvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ0NvY29zMmRHYW1lQ29udGFpbmVyJyk7XG4gICAgICAgICAgICBsb2NhbENvbnRhaW5lci5hcHBlbmRDaGlsZChsb2NhbENhbnZhcyk7XG4gICAgICAgICAgICB0aGlzLmZyYW1lID0gKGxvY2FsQ29udGFpbmVyLnBhcmVudE5vZGUgPT09IGRvY3VtZW50LmJvZHkpID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IDogbG9jYWxDb250YWluZXIucGFyZW50Tm9kZTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkQ2xhc3MgKGVsZW1lbnQsIG5hbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGFzQ2xhc3MgPSAoJyAnICsgZWxlbWVudC5jbGFzc05hbWUgKyAnICcpLmluZGV4T2YoJyAnICsgbmFtZSArICcgJykgPiAtMTtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgKz0gXCIgXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgKz0gbmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRDbGFzcyhsb2NhbENhbnZhcywgXCJnYW1lQ2FudmFzXCIpO1xuICAgICAgICAgICAgbG9jYWxDYW52YXMuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgd2lkdGggfHwgNDgwKTtcbiAgICAgICAgICAgIGxvY2FsQ2FudmFzLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBoZWlnaHQgfHwgMzIwKTtcbiAgICAgICAgICAgIGxvY2FsQ2FudmFzLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIDk5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2RldGVybWluZVJlbmRlclR5cGUoKTtcbiAgICAgICAgLy8gV2ViR0wgY29udGV4dCBjcmVhdGVkIHN1Y2Nlc3NmdWxseVxuICAgICAgICBpZiAodGhpcy5yZW5kZXJUeXBlID09PSB0aGlzLlJFTkRFUl9UWVBFX1dFQkdMKSB7XG4gICAgICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgICAgICAnc3RlbmNpbCc6IHRydWUsXG4gICAgICAgICAgICAgICAgLy8gTVNBQSBpcyBjYXVzaW5nIHNlcmlvdXMgcGVyZm9ybWFuY2UgZHJvcGRvd24gb24gc29tZSBicm93c2Vycy5cbiAgICAgICAgICAgICAgICAnYW50aWFsaWFzJzogY2MubWFjcm8uRU5BQkxFX1dFQkdMX0FOVElBTElBUyxcbiAgICAgICAgICAgICAgICAnYWxwaGEnOiBjYy5tYWNyby5FTkFCTEVfVFJBTlNQQVJFTlRfQ0FOVkFTXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVuZGVyZXIuaW5pdFdlYkdMKGxvY2FsQ2FudmFzLCBvcHRzKTtcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlckNvbnRleHQgPSByZW5kZXJlci5kZXZpY2UuX2dsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBFbmFibGUgZHluYW1pYyBhdGxhcyBtYW5hZ2VyIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgIGlmICghY2MubWFjcm8uQ0xFQU5VUF9JTUFHRV9DQUNIRSAmJiBkeW5hbWljQXRsYXNNYW5hZ2VyKSB7XG4gICAgICAgICAgICAgICAgZHluYW1pY0F0bGFzTWFuYWdlci5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3JlbmRlckNvbnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyVHlwZSA9IHRoaXMuUkVOREVSX1RZUEVfQ0FOVkFTO1xuICAgICAgICAgICAgLy8gQ291bGQgYmUgaWdub3JlZCBieSBtb2R1bGUgc2V0dGluZ3NcbiAgICAgICAgICAgIHJlbmRlcmVyLmluaXRDYW52YXMobG9jYWxDYW52YXMpO1xuICAgICAgICAgICAgdGhpcy5fcmVuZGVyQ29udGV4dCA9IHJlbmRlcmVyLmRldmljZS5fY3R4O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYW52YXMub25jb250ZXh0bWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghY2MuX2lzQ29udGV4dE1lbnVFbmFibGUpIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9yZW5kZXJlckluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX2luaXRFdmVudHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHdpbiA9IHdpbmRvdywgaGlkZGVuUHJvcE5hbWU7XG5cbiAgICAgICAgLy8gcmVnaXN0ZXIgc3lzdGVtIGV2ZW50c1xuICAgICAgICBpZiAodGhpcy5jb25maWcucmVnaXN0ZXJTeXN0ZW1FdmVudClcbiAgICAgICAgICAgIGNjLmludGVybmFsLmlucHV0TWFuYWdlci5yZWdpc3RlclN5c3RlbUV2ZW50KHRoaXMuY2FudmFzKTtcblxuICAgICAgICBpZiAodHlwZW9mIGRvY3VtZW50LmhpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGhpZGRlblByb3BOYW1lID0gXCJoaWRkZW5cIjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaGlkZGVuUHJvcE5hbWUgPSBcIm1vekhpZGRlblwiO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC5tc0hpZGRlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGhpZGRlblByb3BOYW1lID0gXCJtc0hpZGRlblwiO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudC53ZWJraXRIaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBoaWRkZW5Qcm9wTmFtZSA9IFwid2Via2l0SGlkZGVuXCI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGlkZGVuID0gZmFsc2U7XG5cbiAgICAgICAgZnVuY3Rpb24gb25IaWRkZW4gKCkge1xuICAgICAgICAgICAgaWYgKCFoaWRkZW4pIHtcbiAgICAgICAgICAgICAgICBoaWRkZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGdhbWUuZW1pdChnYW1lLkVWRU5UX0hJREUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEluIG9yZGVyIHRvIGFkYXB0IHRoZSBtb3N0IG9mIHBsYXRmb3JtcyB0aGUgb25zaG93IEFQSS5cbiAgICAgICAgZnVuY3Rpb24gb25TaG93biAoYXJnMCwgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCkge1xuICAgICAgICAgICAgaWYgKGhpZGRlbikge1xuICAgICAgICAgICAgICAgIGhpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGdhbWUuZW1pdChnYW1lLkVWRU5UX1NIT1csIGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhpZGRlblByb3BOYW1lKSB7XG4gICAgICAgICAgICB2YXIgY2hhbmdlTGlzdCA9IFtcbiAgICAgICAgICAgICAgICBcInZpc2liaWxpdHljaGFuZ2VcIixcbiAgICAgICAgICAgICAgICBcIm1venZpc2liaWxpdHljaGFuZ2VcIixcbiAgICAgICAgICAgICAgICBcIm1zdmlzaWJpbGl0eWNoYW5nZVwiLFxuICAgICAgICAgICAgICAgIFwid2Via2l0dmlzaWJpbGl0eWNoYW5nZVwiLFxuICAgICAgICAgICAgICAgIFwicWJyb3dzZXJWaXNpYmlsaXR5Q2hhbmdlXCJcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYW5nZUxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGNoYW5nZUxpc3RbaV0sIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmlzaWJsZSA9IGRvY3VtZW50W2hpZGRlblByb3BOYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gUVEgQXBwXG4gICAgICAgICAgICAgICAgICAgIHZpc2libGUgPSB2aXNpYmxlIHx8IGV2ZW50W1wiaGlkZGVuXCJdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmlzaWJsZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uSGlkZGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU2hvd24oKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBvbkhpZGRlbik7XG4gICAgICAgICAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIG9uU2hvd24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1pY3JvTWVzc2VuZ2VyXCIpID4gLTEpIHtcbiAgICAgICAgICAgIHdpbi5vbmZvY3VzID0gb25TaG93bjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcIm9ucGFnZXNob3dcIiBpbiB3aW5kb3cgJiYgXCJvbnBhZ2VoaWRlXCIgaW4gd2luZG93KSB7XG4gICAgICAgICAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VoaWRlXCIsIG9uSGlkZGVuKTtcbiAgICAgICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKFwicGFnZXNob3dcIiwgb25TaG93bik7XG4gICAgICAgICAgICAvLyBUYW9iYW8gVUlXZWJLaXRcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlaGlkZVwiLCBvbkhpZGRlbik7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGFnZXNob3dcIiwgb25TaG93bik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uKGdhbWUuRVZFTlRfSElERSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZ2FtZS5wYXVzZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbihnYW1lLkVWRU5UX1NIT1csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGdhbWUucmVzdW1lKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbkV2ZW50VGFyZ2V0LmNhbGwoZ2FtZSk7XG5jYy5qcy5hZGRvbihnYW1lLCBFdmVudFRhcmdldC5wcm90b3R5cGUpO1xuXG4vKipcbiAqIEBtb2R1bGUgY2NcbiAqL1xuXG4vKipcbiAqICEjZW4gVGhpcyBpcyBhIEdhbWUgaW5zdGFuY2UuXG4gKiAhI3poIOi/meaYr+S4gOS4qiBHYW1lIOexu+eahOWunuS+i++8jOWMheWQq+a4uOaIj+S4u+S9k+S/oeaBr+W5tui0n+i0o+mpseWKqOa4uOaIj+eahOa4uOaIj+WvueixoeOAguOAglxuICogQHByb3BlcnR5IGdhbWVcbiAqIEB0eXBlIEdhbWVcbiAqL1xuY2MuZ2FtZSA9IG1vZHVsZS5leHBvcnRzID0gZ2FtZTtcbiJdfQ==