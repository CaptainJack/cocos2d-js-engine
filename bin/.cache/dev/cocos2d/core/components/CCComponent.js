
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/components/CCComponent.js';
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
var CCObject = require('../platform/CCObject');

var js = require('../platform/js');

var idGenerater = new (require('../platform/id-generater'))('Comp');
var IsOnEnableCalled = CCObject.Flags.IsOnEnableCalled;
var IsOnLoadCalled = CCObject.Flags.IsOnLoadCalled;
/**
 * !#en
 * Base class for everything attached to Node(Entity).<br/>
 * <br/>
 * NOTE: Not allowed to use construction parameters for Component's subclasses,
 *       because Component is created by the engine.
 * !#zh
 * 所有附加到节点的基类。<br/>
 * <br/>
 * 注意：不允许使用组件的子类构造参数，因为组件是由引擎创建的。
 *
 * @class Component
 * @extends Object
 */

var Component = cc.Class({
  name: 'cc.Component',
  "extends": CCObject,
  ctor: CC_EDITOR ? function () {
    if (typeof _Scene !== "undefined" && _Scene.AssetsWatcher) {
      _Scene.AssetsWatcher.initComponent(this);
    }

    this._id = Editor.Utils.UuidUtils.uuid();
    /**
     * Register all related EventTargets,
     * all event callbacks will be removed in _onPreDestroy
     * @property {Array} __eventTargets
     * @private
     */

    this.__eventTargets = [];
  } : function () {
    this._id = idGenerater.getNewId();
    this.__eventTargets = [];
  },
  properties: {
    /**
     * !#en The node this component is attached to. A component is always attached to a node.
     * !#zh 该组件被附加到的节点。组件总会附加到一个节点。
     * @property node
     * @type {Node}
     * @example
     * cc.log(comp.node);
     */
    node: {
      "default": null,
      visible: false
    },
    name: {
      get: function get() {
        if (this._name) {
          return this._name;
        }

        var className = cc.js.getClassName(this);
        var trimLeft = className.lastIndexOf('.');

        if (trimLeft >= 0) {
          className = className.slice(trimLeft + 1);
        }

        return this.node.name + '<' + className + '>';
      },
      set: function set(value) {
        this._name = value;
      },
      visible: false
    },

    /**
     * !#en The uuid for editor.
     * !#zh 组件的 uuid，用于编辑器。
     * @property uuid
     * @type {String}
     * @readOnly
     * @example
     * cc.log(comp.uuid);
     */
    uuid: {
      get: function get() {
        return this._id;
      },
      visible: false
    },
    __scriptAsset: CC_EDITOR && {
      get: function get() {},
      //set (value) {
      //    if (this.__scriptUuid !== value) {
      //        if (value && Editor.Utils.UuidUtils.isUuid(value._uuid)) {
      //            var classId = Editor.Utils.UuidUtils.compressUuid(value._uuid);
      //            var NewComp = cc.js._getClassById(classId);
      //            if (js.isChildClassOf(NewComp, cc.Component)) {
      //                cc.warn('Sorry, replacing component script is not yet implemented.');
      //                //Editor.Ipc.sendToWins('reload:window-scripts', Editor._Sandbox.compiled);
      //            }
      //            else {
      //                cc.error('Can not find a component in the script which uuid is "%s".', value._uuid);
      //            }
      //        }
      //        else {
      //            cc.error('Invalid Script');
      //        }
      //    }
      //},
      displayName: 'Script',
      type: cc._Script,
      tooltip: CC_DEV && 'i18n:INSPECTOR.component.script'
    },

    /**
     * @property _enabled
     * @type {Boolean}
     * @private
     */
    _enabled: true,

    /**
     * !#en indicates whether this component is enabled or not.
     * !#zh 表示该组件自身是否启用。
     * @property enabled
     * @type {Boolean}
     * @default true
     * @example
     * comp.enabled = true;
     * cc.log(comp.enabled);
     */
    enabled: {
      get: function get() {
        return this._enabled;
      },
      set: function set(value) {
        if (this._enabled !== value) {
          this._enabled = value;

          if (this.node._activeInHierarchy) {
            var compScheduler = cc.director._compScheduler;

            if (value) {
              compScheduler.enableComp(this);
            } else {
              compScheduler.disableComp(this);
            }
          }
        }
      },
      visible: false,
      animatable: true
    },

    /**
     * !#en indicates whether this component is enabled and its node is also active in the hierarchy.
     * !#zh 表示该组件是否被启用并且所在的节点也处于激活状态。
     * @property enabledInHierarchy
     * @type {Boolean}
     * @readOnly
     * @example
     * cc.log(comp.enabledInHierarchy);
     */
    enabledInHierarchy: {
      get: function get() {
        return this._enabled && this.node._activeInHierarchy;
      },
      visible: false
    },

    /**
     * !#en Returns a value which used to indicate the onLoad get called or not.
     * !#zh 返回一个值用来判断 onLoad 是否被调用过，不等于 0 时调用过，等于 0 时未调用。
     * @property _isOnLoadCalled
     * @type {Number}
     * @readOnly
     * @example
     * cc.log(this._isOnLoadCalled > 0);
     */
    _isOnLoadCalled: {
      get: function get() {
        return this._objFlags & IsOnLoadCalled;
      }
    }
  },
  // LIFECYCLE METHODS
  // Fireball provides lifecycle methods that you can specify to hook into this process.
  // We provide Pre methods, which are called right before something happens, and Post methods which are called right after something happens.

  /**
   * !#en Update is called every frame, if the Component is enabled.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh 如果该组件启用，则每帧调用 update。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method update
   * @param {Number} dt - the delta time in seconds it took to complete the last frame
   * @protected
   */
  update: null,

  /**
   * !#en LateUpdate is called every frame, if the Component is enabled.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh 如果该组件启用，则每帧调用 LateUpdate。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method lateUpdate
   * @param {Number} dt - the delta time in seconds it took to complete the last frame
   * @protected
   */
  lateUpdate: null,

  /**
   * `__preload` is called before every onLoad.
   * It is used to initialize the builtin components internally,
   * to avoid checking whether onLoad is called before every public method calls.
   * This method should be removed if script priority is supported.
   *
   * @method __preload
   * @private
   */
  __preload: null,

  /**
   * !#en
   * When attaching to an active node or its node first activated.
   * onLoad is always called before any start functions, this allows you to order initialization of scripts.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh
   * 当附加到一个激活的节点上或者其节点第一次激活时候调用。onLoad 总是会在任何 start 方法调用前执行，这能用于安排脚本的初始化顺序。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method onLoad
   * @protected
   */
  onLoad: null,

  /**
   * !#en
   * Called before all scripts' update if the Component is enabled the first time.
   * Usually used to initialize some logic which need to be called after all components' `onload` methods called.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh
   * 如果该组件第一次启用，则在所有组件的 update 之前调用。通常用于需要在所有组件的 onLoad 初始化完毕后执行的逻辑。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method start
   * @protected
   */
  start: null,

  /**
   * !#en Called when this component becomes enabled and its node is active.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh 当该组件被启用，并且它的节点也激活时。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method onEnable
   * @protected
   */
  onEnable: null,

  /**
   * !#en Called when this component becomes disabled or its node becomes inactive.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh 当该组件被禁用或节点变为无效时调用。<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method onDisable
   * @protected
   */
  onDisable: null,

  /**
   * !#en Called when this component will be destroyed.<br/>
   * This is a lifecycle method. It may not be implemented in the super class. You can only call its super class method inside it. It should not be called manually elsewhere.
   * !#zh 当该组件被销毁时调用<br/>
   * 该方法为生命周期方法，父类未必会有实现。并且你只能在该方法内部调用父类的实现，不可在其它地方直接调用该方法。
   * @method onDestroy
   * @protected
   */
  onDestroy: null,

  /**
   * @method onFocusInEditor
   * @protected
   */
  onFocusInEditor: null,

  /**
   * @method onLostFocusInEditor
   * @protected
   */
  onLostFocusInEditor: null,

  /**
   * !#en Called to initialize the component or node’s properties when adding the component the first time or when the Reset command is used. This function is only called in editor.
   * !#zh 用来初始化组件或节点的一些属性，当该组件被第一次添加到节点上或用户点击了它的 Reset 菜单时调用。这个回调只会在编辑器下调用。
   * @method resetInEditor
   * @protected
   */
  resetInEditor: null,
  // PUBLIC

  /**
   * !#en Adds a component class to the node. You can also add component to node by passing in the name of the script.
   * !#zh 向节点添加一个组件类，你还可以通过传入脚本的名称来添加组件。
   *
   * @method addComponent
   * @param {Function|String} typeOrClassName - the constructor or the class name of the component to add
   * @return {Component} - the newly added component
   * @example
   * var sprite = node.addComponent(cc.Sprite);
   * var test = node.addComponent("Test");
   * @typescript
   * addComponent<T extends Component>(type: {new(): T}): T
   * addComponent(className: string): any
   */
  addComponent: function addComponent(typeOrClassName) {
    return this.node.addComponent(typeOrClassName);
  },

  /**
   * !#en
   * Returns the component of supplied type if the node has one attached, null if it doesn't.<br/>
   * You can also get component in the node by passing in the name of the script.
   * !#zh
   * 获取节点上指定类型的组件，如果节点有附加指定类型的组件，则返回，如果没有则为空。<br/>
   * 传入参数也可以是脚本的名称。
   *
   * @method getComponent
   * @param {Function|String} typeOrClassName
   * @return {Component}
   * @example
   * // get sprite component.
   * var sprite = node.getComponent(cc.Sprite);
   * // get custom test calss.
   * var test = node.getComponent("Test");
   * @typescript
   * getComponent<T extends Component>(type: {prototype: T}): T
   * getComponent(className: string): any
   */
  getComponent: function getComponent(typeOrClassName) {
    return this.node.getComponent(typeOrClassName);
  },

  /**
   * !#en Returns all components of supplied Type in the node.
   * !#zh 返回节点上指定类型的所有组件。
   *
   * @method getComponents
   * @param {Function|String} typeOrClassName
   * @return {Component[]}
   * @example
   * var sprites = node.getComponents(cc.Sprite);
   * var tests = node.getComponents("Test");
   * @typescript
   * getComponents<T extends Component>(type: {prototype: T}): T[]
   * getComponents(className: string): any[]
   */
  getComponents: function getComponents(typeOrClassName) {
    return this.node.getComponents(typeOrClassName);
  },

  /**
   * !#en Returns the component of supplied type in any of its children using depth first search.
   * !#zh 递归查找所有子节点中第一个匹配指定类型的组件。
   *
   * @method getComponentInChildren
   * @param {Function|String} typeOrClassName
   * @returns {Component}
   * @example
   * var sprite = node.getComponentInChildren(cc.Sprite);
   * var Test = node.getComponentInChildren("Test");
   * @typescript
   * getComponentInChildren<T extends Component>(type: {prototype: T}): T
   * getComponentInChildren(className: string): any
   */
  getComponentInChildren: function getComponentInChildren(typeOrClassName) {
    return this.node.getComponentInChildren(typeOrClassName);
  },

  /**
   * !#en Returns the components of supplied type in self or any of its children using depth first search.
   * !#zh 递归查找自身或所有子节点中指定类型的组件
   *
   * @method getComponentsInChildren
   * @param {Function|String} typeOrClassName
   * @returns {Component[]}
   * @example
   * var sprites = node.getComponentsInChildren(cc.Sprite);
   * var tests = node.getComponentsInChildren("Test");
   * @typescript
   * getComponentsInChildren<T extends Component>(type: {prototype: T}): T[]
   * getComponentsInChildren(className: string): any[]
   */
  getComponentsInChildren: function getComponentsInChildren(typeOrClassName) {
    return this.node.getComponentsInChildren(typeOrClassName);
  },
  // VIRTUAL

  /**
   * !#en
   * If the component's bounding box is different from the node's, you can implement this method to supply
   * a custom axis aligned bounding box (AABB), so the editor's scene view can perform hit test properly.
   * !#zh
   * 如果组件的包围盒与节点不同，您可以实现该方法以提供自定义的轴向对齐的包围盒（AABB），
   * 以便编辑器的场景视图可以正确地执行点选测试。
   *
   * @method _getLocalBounds
   * @param {Rect} out_rect - the Rect to receive the bounding box
   */
  _getLocalBounds: null,

  /**
   * !#en
   * onRestore is called after the user clicks the Reset item in the Inspector's context menu or performs
   * an undo operation on this component.<br/>
   * <br/>
   * If the component contains the "internal state", short for "temporary member variables which not included<br/>
   * in its CCClass properties", then you may need to implement this function.<br/>
   * <br/>
   * The editor will call the getset accessors of your component to record/restore the component's state<br/>
   * for undo/redo operation. However, in extreme cases, it may not works well. Then you should implement<br/>
   * this function to manually synchronize your component's "internal states" with its public properties.<br/>
   * Once you implement this function, all the getset accessors of your component will not be called when<br/>
   * the user performs an undo/redo operation. Which means that only the properties with default value<br/>
   * will be recorded or restored by editor.<br/>
   * <br/>
   * Similarly, the editor may failed to reset your component correctly in extreme cases. Then if you need<br/>
   * to support the reset menu, you should manually synchronize your component's "internal states" with its<br/>
   * properties in this function. Once you implement this function, all the getset accessors of your component<br/>
   * will not be called during reset operation. Which means that only the properties with default value<br/>
   * will be reset by editor.
   *
   * This function is only called in editor mode.
   * !#zh
   * onRestore 是用户在检查器菜单点击 Reset 时，对此组件执行撤消操作后调用的。<br/>
   * <br/>
   * 如果组件包含了“内部状态”（不在 CCClass 属性中定义的临时成员变量），那么你可能需要实现该方法。<br/>
   * <br/>
   * 编辑器执行撤销/重做操作时，将调用组件的 get set 来录制和还原组件的状态。
   * 然而，在极端的情况下，它可能无法良好运作。<br/>
   * 那么你就应该实现这个方法，手动根据组件的属性同步“内部状态”。
   * 一旦你实现这个方法，当用户撤销或重做时，组件的所有 get set 都不会再被调用。
   * 这意味着仅仅指定了默认值的属性将被编辑器记录和还原。<br/>
   * <br/>
   * 同样的，编辑可能无法在极端情况下正确地重置您的组件。<br/>
   * 于是如果你需要支持组件重置菜单，你需要在该方法中手工同步组件属性到“内部状态”。<br/>
   * 一旦你实现这个方法，组件的所有 get set 都不会在重置操作时被调用。
   * 这意味着仅仅指定了默认值的属性将被编辑器重置。
   * <br/>
   * 此方法仅在编辑器下会被调用。
   * @method onRestore
   */
  onRestore: null,
  // OVERRIDE
  destroy: function destroy() {
    if (CC_EDITOR) {
      var depend = this.node._getDependComponent(this);

      if (depend) {
        return cc.errorID(3626, cc.js.getClassName(this), cc.js.getClassName(depend));
      }
    }

    if (this._super()) {
      if (this._enabled && this.node._activeInHierarchy) {
        cc.director._compScheduler.disableComp(this);
      }
    }
  },
  _onPreDestroy: function _onPreDestroy() {
    // Schedules
    this.unscheduleAllCallbacks(); // Remove all listeners

    var eventTargets = this.__eventTargets;

    for (var i = eventTargets.length - 1; i >= 0; --i) {
      var target = eventTargets[i];
      target && target.targetOff(this);
    }

    eventTargets.length = 0; //

    if (CC_EDITOR && !CC_TEST) {
      _Scene.AssetsWatcher.stop(this);
    } // onDestroy


    cc.director._nodeActivator.destroyComp(this); // do remove component


    this.node._removeComponent(this);
  },
  _instantiate: function _instantiate(cloned) {
    if (!cloned) {
      cloned = cc.instantiate._clone(this, this);
    }

    cloned.node = null;
    return cloned;
  },
  // Scheduler

  /**
   * !#en
   * Schedules a custom selector.<br/>
   * If the selector is already scheduled, then the interval parameter will be updated without scheduling it again.
   * !#zh
   * 调度一个自定义的回调函数。<br/>
   * 如果回调函数已调度，那么将不会重复调度它，只会更新时间间隔参数。
   * @method schedule
   * @param {function} callback The callback function
   * @param {Number} [interval=0]  Tick interval in seconds. 0 means tick every frame.
   * @param {Number} [repeat=cc.macro.REPEAT_FOREVER]    The selector will be executed (repeat + 1) times, you can use cc.macro.REPEAT_FOREVER for tick infinitely.
   * @param {Number} [delay=0]     The amount of time that the first tick will wait before execution. Unit: s
   * @example
   * var timeCallback = function (dt) {
   *   cc.log("time: " + dt);
   * }
   * this.schedule(timeCallback, 1);
   */
  schedule: function schedule(callback, interval, repeat, delay) {
    cc.assertID(callback, 1619);
    interval = interval || 0;
    cc.assertID(interval >= 0, 1620);
    repeat = isNaN(repeat) ? cc.macro.REPEAT_FOREVER : repeat;
    delay = delay || 0;
    var scheduler = cc.director.getScheduler(); // should not use enabledInHierarchy to judge whether paused,
    // because enabledInHierarchy is assigned after onEnable.
    // Actually, if not yet scheduled, resumeTarget/pauseTarget has no effect on component,
    // therefore there is no way to guarantee the paused state other than isTargetPaused.

    var paused = scheduler.isTargetPaused(this);
    scheduler.schedule(callback, this, interval, repeat, delay, paused);
  },

  /**
   * !#en Schedules a callback function that runs only once, with a delay of 0 or larger.
   * !#zh 调度一个只运行一次的回调函数，可以指定 0 让回调函数在下一帧立即执行或者在一定的延时之后执行。
   * @method scheduleOnce
   * @see cc.Node#schedule
   * @param {function} callback  A function wrapped as a selector
   * @param {Number} [delay=0]  The amount of time that the first tick will wait before execution. Unit: s
   * @example
   * var timeCallback = function (dt) {
   *   cc.log("time: " + dt);
   * }
   * this.scheduleOnce(timeCallback, 2);
   */
  scheduleOnce: function scheduleOnce(callback, delay) {
    this.schedule(callback, 0, 0, delay);
  },

  /**
   * !#en Unschedules a custom callback function.
   * !#zh 取消调度一个自定义的回调函数。
   * @method unschedule
   * @see cc.Node#schedule
   * @param {function} callback_fn  A function wrapped as a selector
   * @example
   * this.unschedule(_callback);
   */
  unschedule: function unschedule(callback_fn) {
    if (!callback_fn) return;
    cc.director.getScheduler().unschedule(callback_fn, this);
  },

  /**
   * !#en
   * unschedule all scheduled callback functions: custom callback functions, and the 'update' callback function.<br/>
   * Actions are not affected by this method.
   * !#zh 取消调度所有已调度的回调函数：定制的回调函数以及 'update' 回调函数。动作不受此方法影响。
   * @method unscheduleAllCallbacks
   * @example
   * this.unscheduleAllCallbacks();
   */
  unscheduleAllCallbacks: function unscheduleAllCallbacks() {
    cc.director.getScheduler().unscheduleAllForTarget(this);
  }
});
Component._requireComponent = null;
Component._executionOrder = 0;

if (CC_EDITOR || CC_TEST) {
  // INHERITABLE STATIC MEMBERS
  Component._executeInEditMode = false;
  Component._playOnFocus = false;
  Component._disallowMultiple = null;
  Component._help = ''; // NON-INHERITED STATIC MEMBERS
  // (TypeScript 2.3 will still inherit them, so always check hasOwnProperty before using)

  js.value(Component, '_inspector', '', true);
  js.value(Component, '_icon', '', true); // COMPONENT HELPERS

  cc._componentMenuItems = [];

  Component._addMenuItem = function (cls, path, priority) {
    cc._componentMenuItems.push({
      component: cls,
      menuPath: path,
      priority: priority
    });
  };
} // we make this non-enumerable, to prevent inherited by sub classes.


js.value(Component, '_registerEditorProps', function (cls, props) {
  var reqComp = props.requireComponent;

  if (reqComp) {
    cls._requireComponent = reqComp;
  }

  var order = props.executionOrder;

  if (order && typeof order === 'number') {
    cls._executionOrder = order;
  }

  if (CC_EDITOR || CC_TEST) {
    var name = cc.js.getClassName(cls);

    for (var key in props) {
      var val = props[key];

      switch (key) {
        case 'executeInEditMode':
          cls._executeInEditMode = !!val;
          break;

        case 'playOnFocus':
          if (val) {
            var willExecuteInEditMode = 'executeInEditMode' in props ? props.executeInEditMode : cls._executeInEditMode;

            if (willExecuteInEditMode) {
              cls._playOnFocus = true;
            } else {
              cc.warnID(3601, name);
            }
          }

          break;

        case 'inspector':
          js.value(cls, '_inspector', val, true);
          break;

        case 'icon':
          js.value(cls, '_icon', val, true);
          break;

        case 'menu':
          Component._addMenuItem(cls, val, props.menuPriority);

          break;

        case 'disallowMultiple':
          cls._disallowMultiple = cls;
          break;

        case 'requireComponent':
        case 'executionOrder':
          // skip here
          break;

        case 'help':
          cls._help = val;
          break;

        default:
          cc.warnID(3602, key, name);
          break;
      }
    }
  }
});
Component.prototype.__scriptUuid = '';
cc.Component = module.exports = Component;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQ29tcG9uZW50LmpzIl0sIm5hbWVzIjpbIkNDT2JqZWN0IiwicmVxdWlyZSIsImpzIiwiaWRHZW5lcmF0ZXIiLCJJc09uRW5hYmxlQ2FsbGVkIiwiRmxhZ3MiLCJJc09uTG9hZENhbGxlZCIsIkNvbXBvbmVudCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwiY3RvciIsIkNDX0VESVRPUiIsIl9TY2VuZSIsIkFzc2V0c1dhdGNoZXIiLCJpbml0Q29tcG9uZW50IiwiX2lkIiwiRWRpdG9yIiwiVXRpbHMiLCJVdWlkVXRpbHMiLCJ1dWlkIiwiX19ldmVudFRhcmdldHMiLCJnZXROZXdJZCIsInByb3BlcnRpZXMiLCJub2RlIiwidmlzaWJsZSIsImdldCIsIl9uYW1lIiwiY2xhc3NOYW1lIiwiZ2V0Q2xhc3NOYW1lIiwidHJpbUxlZnQiLCJsYXN0SW5kZXhPZiIsInNsaWNlIiwic2V0IiwidmFsdWUiLCJfX3NjcmlwdEFzc2V0IiwiZGlzcGxheU5hbWUiLCJ0eXBlIiwiX1NjcmlwdCIsInRvb2x0aXAiLCJDQ19ERVYiLCJfZW5hYmxlZCIsImVuYWJsZWQiLCJfYWN0aXZlSW5IaWVyYXJjaHkiLCJjb21wU2NoZWR1bGVyIiwiZGlyZWN0b3IiLCJfY29tcFNjaGVkdWxlciIsImVuYWJsZUNvbXAiLCJkaXNhYmxlQ29tcCIsImFuaW1hdGFibGUiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJfaXNPbkxvYWRDYWxsZWQiLCJfb2JqRmxhZ3MiLCJ1cGRhdGUiLCJsYXRlVXBkYXRlIiwiX19wcmVsb2FkIiwib25Mb2FkIiwic3RhcnQiLCJvbkVuYWJsZSIsIm9uRGlzYWJsZSIsIm9uRGVzdHJveSIsIm9uRm9jdXNJbkVkaXRvciIsIm9uTG9zdEZvY3VzSW5FZGl0b3IiLCJyZXNldEluRWRpdG9yIiwiYWRkQ29tcG9uZW50IiwidHlwZU9yQ2xhc3NOYW1lIiwiZ2V0Q29tcG9uZW50IiwiZ2V0Q29tcG9uZW50cyIsImdldENvbXBvbmVudEluQ2hpbGRyZW4iLCJnZXRDb21wb25lbnRzSW5DaGlsZHJlbiIsIl9nZXRMb2NhbEJvdW5kcyIsIm9uUmVzdG9yZSIsImRlc3Ryb3kiLCJkZXBlbmQiLCJfZ2V0RGVwZW5kQ29tcG9uZW50IiwiZXJyb3JJRCIsIl9zdXBlciIsIl9vblByZURlc3Ryb3kiLCJ1bnNjaGVkdWxlQWxsQ2FsbGJhY2tzIiwiZXZlbnRUYXJnZXRzIiwiaSIsImxlbmd0aCIsInRhcmdldCIsInRhcmdldE9mZiIsIkNDX1RFU1QiLCJzdG9wIiwiX25vZGVBY3RpdmF0b3IiLCJkZXN0cm95Q29tcCIsIl9yZW1vdmVDb21wb25lbnQiLCJfaW5zdGFudGlhdGUiLCJjbG9uZWQiLCJpbnN0YW50aWF0ZSIsIl9jbG9uZSIsInNjaGVkdWxlIiwiY2FsbGJhY2siLCJpbnRlcnZhbCIsInJlcGVhdCIsImRlbGF5IiwiYXNzZXJ0SUQiLCJpc05hTiIsIm1hY3JvIiwiUkVQRUFUX0ZPUkVWRVIiLCJzY2hlZHVsZXIiLCJnZXRTY2hlZHVsZXIiLCJwYXVzZWQiLCJpc1RhcmdldFBhdXNlZCIsInNjaGVkdWxlT25jZSIsInVuc2NoZWR1bGUiLCJjYWxsYmFja19mbiIsInVuc2NoZWR1bGVBbGxGb3JUYXJnZXQiLCJfcmVxdWlyZUNvbXBvbmVudCIsIl9leGVjdXRpb25PcmRlciIsIl9leGVjdXRlSW5FZGl0TW9kZSIsIl9wbGF5T25Gb2N1cyIsIl9kaXNhbGxvd011bHRpcGxlIiwiX2hlbHAiLCJfY29tcG9uZW50TWVudUl0ZW1zIiwiX2FkZE1lbnVJdGVtIiwiY2xzIiwicGF0aCIsInByaW9yaXR5IiwicHVzaCIsImNvbXBvbmVudCIsIm1lbnVQYXRoIiwicHJvcHMiLCJyZXFDb21wIiwicmVxdWlyZUNvbXBvbmVudCIsIm9yZGVyIiwiZXhlY3V0aW9uT3JkZXIiLCJrZXkiLCJ2YWwiLCJ3aWxsRXhlY3V0ZUluRWRpdE1vZGUiLCJleGVjdXRlSW5FZGl0TW9kZSIsIndhcm5JRCIsIm1lbnVQcmlvcml0eSIsInByb3RvdHlwZSIsIl9fc2NyaXB0VXVpZCIsIm1vZHVsZSIsImV4cG9y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aUMsSUFBakM7QUFDQTs7QUFFSixhQUFLLE1BQUw7QUFDSWhJLFVBQUFBLEVBQUUsQ0FBQ2dDLEtBQUgsQ0FBU29GLEdBQVQsRUFBYyxPQUFkLEVBQXVCWSxHQUF2QixFQUE0QixJQUE1QjtBQUNBOztBQUVKLGFBQUssTUFBTDtBQUNJM0gsVUFBQUEsU0FBUyxDQUFDOEcsWUFBVixDQUF1QkMsR0FBdkIsRUFBNEJZLEdBQTVCLEVBQWlDTixLQUFLLENBQUNVLFlBQXZDOztBQUNBOztBQUVKLGFBQUssa0JBQUw7QUFDSWhCLFVBQUFBLEdBQUcsQ0FBQ0osaUJBQUosR0FBd0JJLEdBQXhCO0FBQ0E7O0FBRUosYUFBSyxrQkFBTDtBQUNBLGFBQUssZ0JBQUw7QUFDSTtBQUNBOztBQUVKLGFBQUssTUFBTDtBQUNJQSxVQUFBQSxHQUFHLENBQUNILEtBQUosR0FBWWUsR0FBWjtBQUNBOztBQUVKO0FBQ0kxSCxVQUFBQSxFQUFFLENBQUM2SCxNQUFILENBQVUsSUFBVixFQUFnQkosR0FBaEIsRUFBcUJ2SCxJQUFyQjtBQUNBO0FBNUNSO0FBOENIO0FBQ0o7QUFDSixDQTdERDtBQStEQUgsU0FBUyxDQUFDZ0ksU0FBVixDQUFvQkMsWUFBcEIsR0FBbUMsRUFBbkM7QUFFQWhJLEVBQUUsQ0FBQ0QsU0FBSCxHQUFla0ksTUFBTSxDQUFDQyxPQUFQLEdBQWlCbkksU0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBDQ09iamVjdCA9IHJlcXVpcmUoJy4uL3BsYXRmb3JtL0NDT2JqZWN0Jyk7XG52YXIganMgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9qcycpO1xudmFyIGlkR2VuZXJhdGVyID0gbmV3IChyZXF1aXJlKCcuLi9wbGF0Zm9ybS9pZC1nZW5lcmF0ZXInKSkoJ0NvbXAnKTtcblxudmFyIElzT25FbmFibGVDYWxsZWQgPSBDQ09iamVjdC5GbGFncy5Jc09uRW5hYmxlQ2FsbGVkO1xudmFyIElzT25Mb2FkQ2FsbGVkID0gQ0NPYmplY3QuRmxhZ3MuSXNPbkxvYWRDYWxsZWQ7XG5cbi8qKlxuICogISNlblxuICogQmFzZSBjbGFzcyBmb3IgZXZlcnl0aGluZyBhdHRhY2hlZCB0byBOb2RlKEVudGl0eSkuPGJyLz5cbiAqIDxici8+XG4gKiBOT1RFOiBOb3QgYWxsb3dlZCB0byB1c2UgY29uc3RydWN0aW9uIHBhcmFtZXRlcnMgZm9yIENvbXBvbmVudCdzIHN1YmNsYXNzZXMsXG4gKiAgICAgICBiZWNhdXNlIENvbXBvbmVudCBpcyBjcmVhdGVkIGJ5IHRoZSBlbmdpbmUuXG4gKiAhI3poXG4gKiDmiYDmnInpmYTliqDliLDoioLngrnnmoTln7rnsbvjgII8YnIvPlxuICogPGJyLz5cbiAqIOazqOaEj++8muS4jeWFgeiuuOS9v+eUqOe7hOS7tueahOWtkOexu+aehOmAoOWPguaVsO+8jOWboOS4uue7hOS7tuaYr+eUseW8leaTjuWIm+W7uueahOOAglxuICpcbiAqIEBjbGFzcyBDb21wb25lbnRcbiAqIEBleHRlbmRzIE9iamVjdFxuICovXG52YXIgQ29tcG9uZW50ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5Db21wb25lbnQnLFxuICAgIGV4dGVuZHM6IENDT2JqZWN0LFxuXG4gICAgY3RvcjogQ0NfRURJVE9SID8gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoKHR5cGVvZiBfU2NlbmUgIT09IFwidW5kZWZpbmVkXCIpICYmIF9TY2VuZS5Bc3NldHNXYXRjaGVyKSB7XG4gICAgICAgICAgICBfU2NlbmUuQXNzZXRzV2F0Y2hlci5pbml0Q29tcG9uZW50KHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2lkID0gRWRpdG9yLlV0aWxzLlV1aWRVdGlscy51dWlkKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlZ2lzdGVyIGFsbCByZWxhdGVkIEV2ZW50VGFyZ2V0cyxcbiAgICAgICAgICogYWxsIGV2ZW50IGNhbGxiYWNrcyB3aWxsIGJlIHJlbW92ZWQgaW4gX29uUHJlRGVzdHJveVxuICAgICAgICAgKiBAcHJvcGVydHkge0FycmF5fSBfX2V2ZW50VGFyZ2V0c1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fX2V2ZW50VGFyZ2V0cyA9IFtdO1xuICAgIH0gOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2lkID0gaWRHZW5lcmF0ZXIuZ2V0TmV3SWQoKTtcblxuICAgICAgICB0aGlzLl9fZXZlbnRUYXJnZXRzID0gW107XG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIG5vZGUgdGhpcyBjb21wb25lbnQgaXMgYXR0YWNoZWQgdG8uIEEgY29tcG9uZW50IGlzIGFsd2F5cyBhdHRhY2hlZCB0byBhIG5vZGUuXG4gICAgICAgICAqICEjemgg6K+l57uE5Lu26KKr6ZmE5Yqg5Yiw55qE6IqC54K544CC57uE5Lu25oC75Lya6ZmE5Yqg5Yiw5LiA5Liq6IqC54K544CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBub2RlXG4gICAgICAgICAqIEB0eXBlIHtOb2RlfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBjYy5sb2coY29tcC5ub2RlKTtcbiAgICAgICAgICovXG4gICAgICAgIG5vZGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX25hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSBjYy5qcy5nZXRDbGFzc05hbWUodGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIHRyaW1MZWZ0ID0gY2xhc3NOYW1lLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRyaW1MZWZ0ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLnNsaWNlKHRyaW1MZWZ0ICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGUubmFtZSArICc8JyArIGNsYXNzTmFtZSArICc+JztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHV1aWQgZm9yIGVkaXRvci5cbiAgICAgICAgICogISN6aCDnu4Tku7bnmoQgdXVpZO+8jOeUqOS6jue8lui+keWZqOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgdXVpZFxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogY2MubG9nKGNvbXAudXVpZCk7XG4gICAgICAgICAqL1xuICAgICAgICB1dWlkOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIF9fc2NyaXB0QXNzZXQ6IENDX0VESVRPUiAmJiB7XG4gICAgICAgICAgICBnZXQgKCkge30sXG4gICAgICAgICAgICAvL3NldCAodmFsdWUpIHtcbiAgICAgICAgICAgIC8vICAgIGlmICh0aGlzLl9fc2NyaXB0VXVpZCAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgIC8vICAgICAgICBpZiAodmFsdWUgJiYgRWRpdG9yLlV0aWxzLlV1aWRVdGlscy5pc1V1aWQodmFsdWUuX3V1aWQpKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIHZhciBjbGFzc0lkID0gRWRpdG9yLlV0aWxzLlV1aWRVdGlscy5jb21wcmVzc1V1aWQodmFsdWUuX3V1aWQpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICB2YXIgTmV3Q29tcCA9IGNjLmpzLl9nZXRDbGFzc0J5SWQoY2xhc3NJZCk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIGlmIChqcy5pc0NoaWxkQ2xhc3NPZihOZXdDb21wLCBjYy5Db21wb25lbnQpKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICBjYy53YXJuKCdTb3JyeSwgcmVwbGFjaW5nIGNvbXBvbmVudCBzY3JpcHQgaXMgbm90IHlldCBpbXBsZW1lbnRlZC4nKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIC8vRWRpdG9yLklwYy5zZW5kVG9XaW5zKCdyZWxvYWQ6d2luZG93LXNjcmlwdHMnLCBFZGl0b3IuX1NhbmRib3guY29tcGlsZWQpO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgY2MuZXJyb3IoJ0NhbiBub3QgZmluZCBhIGNvbXBvbmVudCBpbiB0aGUgc2NyaXB0IHdoaWNoIHV1aWQgaXMgXCIlc1wiLicsIHZhbHVlLl91dWlkKTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgY2MuZXJyb3IoJ0ludmFsaWQgU2NyaXB0Jyk7XG4gICAgICAgICAgICAvLyAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgfVxuICAgICAgICAgICAgLy99LFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdTY3JpcHQnLFxuICAgICAgICAgICAgdHlwZTogY2MuX1NjcmlwdCxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpJTlNQRUNUT1IuY29tcG9uZW50LnNjcmlwdCdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IF9lbmFibGVkXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgX2VuYWJsZWQ6IHRydWUsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gaW5kaWNhdGVzIHdoZXRoZXIgdGhpcyBjb21wb25lbnQgaXMgZW5hYmxlZCBvciBub3QuXG4gICAgICAgICAqICEjemgg6KGo56S66K+l57uE5Lu26Ieq6Lqr5piv5ZCm5ZCv55So44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBlbmFibGVkXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGNvbXAuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAqIGNjLmxvZyhjb21wLmVuYWJsZWQpO1xuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlZDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlZDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2VuYWJsZWQgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb21wU2NoZWR1bGVyID0gY2MuZGlyZWN0b3IuX2NvbXBTY2hlZHVsZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wU2NoZWR1bGVyLmVuYWJsZUNvbXAodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wU2NoZWR1bGVyLmRpc2FibGVDb21wKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogdHJ1ZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIGluZGljYXRlcyB3aGV0aGVyIHRoaXMgY29tcG9uZW50IGlzIGVuYWJsZWQgYW5kIGl0cyBub2RlIGlzIGFsc28gYWN0aXZlIGluIHRoZSBoaWVyYXJjaHkuXG4gICAgICAgICAqICEjemgg6KGo56S66K+l57uE5Lu25piv5ZCm6KKr5ZCv55So5bm25LiU5omA5Zyo55qE6IqC54K55Lmf5aSE5LqO5r+A5rS754q25oCB44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBlbmFibGVkSW5IaWVyYXJjaHlcbiAgICAgICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICAgICAqIEByZWFkT25seVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBjYy5sb2coY29tcC5lbmFibGVkSW5IaWVyYXJjaHkpO1xuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlZEluSGllcmFyY2h5OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVkICYmIHRoaXMubm9kZS5fYWN0aXZlSW5IaWVyYXJjaHk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBSZXR1cm5zIGEgdmFsdWUgd2hpY2ggdXNlZCB0byBpbmRpY2F0ZSB0aGUgb25Mb2FkIGdldCBjYWxsZWQgb3Igbm90LlxuICAgICAgICAgKiAhI3poIOi/lOWbnuS4gOS4quWAvOeUqOadpeWIpOaWrSBvbkxvYWQg5piv5ZCm6KKr6LCD55So6L+H77yM5LiN562J5LqOIDAg5pe26LCD55So6L+H77yM562J5LqOIDAg5pe25pyq6LCD55So44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSBfaXNPbkxvYWRDYWxsZWRcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQHJlYWRPbmx5XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIGNjLmxvZyh0aGlzLl9pc09uTG9hZENhbGxlZCA+IDApO1xuICAgICAgICAgKi9cbiAgICAgICAgX2lzT25Mb2FkQ2FsbGVkOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9vYmpGbGFncyAmIElzT25Mb2FkQ2FsbGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvLyBMSUZFQ1lDTEUgTUVUSE9EU1xuXG4gICAgLy8gRmlyZWJhbGwgcHJvdmlkZXMgbGlmZWN5Y2xlIG1ldGhvZHMgdGhhdCB5b3UgY2FuIHNwZWNpZnkgdG8gaG9vayBpbnRvIHRoaXMgcHJvY2Vzcy5cbiAgICAvLyBXZSBwcm92aWRlIFByZSBtZXRob2RzLCB3aGljaCBhcmUgY2FsbGVkIHJpZ2h0IGJlZm9yZSBzb21ldGhpbmcgaGFwcGVucywgYW5kIFBvc3QgbWV0aG9kcyB3aGljaCBhcmUgY2FsbGVkIHJpZ2h0IGFmdGVyIHNvbWV0aGluZyBoYXBwZW5zLlxuXG4gICAgLyoqXG4gICAgICogISNlbiBVcGRhdGUgaXMgY2FsbGVkIGV2ZXJ5IGZyYW1lLCBpZiB0aGUgQ29tcG9uZW50IGlzIGVuYWJsZWQuPGJyLz5cbiAgICAgKiBUaGlzIGlzIGEgbGlmZWN5Y2xlIG1ldGhvZC4gSXQgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgc3VwZXIgY2xhc3MuIFlvdSBjYW4gb25seSBjYWxsIGl0cyBzdXBlciBjbGFzcyBtZXRob2QgaW5zaWRlIGl0LiBJdCBzaG91bGQgbm90IGJlIGNhbGxlZCBtYW51YWxseSBlbHNld2hlcmUuXG4gICAgICogISN6aCDlpoLmnpzor6Xnu4Tku7blkK/nlKjvvIzliJnmr4/luKfosIPnlKggdXBkYXRl44CCPGJyLz5cbiAgICAgKiDor6Xmlrnms5XkuLrnlJ/lkb3lkajmnJ/mlrnms5XvvIzniLbnsbvmnKrlv4XkvJrmnInlrp7njrDjgILlubbkuJTkvaDlj6rog73lnKjor6Xmlrnms5XlhoXpg6josIPnlKjniLbnsbvnmoTlrp7njrDvvIzkuI3lj6/lnKjlhbblroPlnLDmlrnnm7TmjqXosIPnlKjor6Xmlrnms5XjgIJcbiAgICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIHRoZSBkZWx0YSB0aW1lIGluIHNlY29uZHMgaXQgdG9vayB0byBjb21wbGV0ZSB0aGUgbGFzdCBmcmFtZVxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICB1cGRhdGU6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIExhdGVVcGRhdGUgaXMgY2FsbGVkIGV2ZXJ5IGZyYW1lLCBpZiB0aGUgQ29tcG9uZW50IGlzIGVuYWJsZWQuPGJyLz5cbiAgICAgKiBUaGlzIGlzIGEgbGlmZWN5Y2xlIG1ldGhvZC4gSXQgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgc3VwZXIgY2xhc3MuIFlvdSBjYW4gb25seSBjYWxsIGl0cyBzdXBlciBjbGFzcyBtZXRob2QgaW5zaWRlIGl0LiBJdCBzaG91bGQgbm90IGJlIGNhbGxlZCBtYW51YWxseSBlbHNld2hlcmUuXG4gICAgICogISN6aCDlpoLmnpzor6Xnu4Tku7blkK/nlKjvvIzliJnmr4/luKfosIPnlKggTGF0ZVVwZGF0ZeOAgjxici8+XG4gICAgICog6K+l5pa55rOV5Li655Sf5ZG95ZGo5pyf5pa55rOV77yM54i257G75pyq5b+F5Lya5pyJ5a6e546w44CC5bm25LiU5L2g5Y+q6IO95Zyo6K+l5pa55rOV5YaF6YOo6LCD55So54i257G755qE5a6e546w77yM5LiN5Y+v5Zyo5YW25a6D5Zyw5pa555u05o6l6LCD55So6K+l5pa55rOV44CCXG4gICAgICogQG1ldGhvZCBsYXRlVXBkYXRlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gdGhlIGRlbHRhIHRpbWUgaW4gc2Vjb25kcyBpdCB0b29rIHRvIGNvbXBsZXRlIHRoZSBsYXN0IGZyYW1lXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIGxhdGVVcGRhdGU6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBgX19wcmVsb2FkYCBpcyBjYWxsZWQgYmVmb3JlIGV2ZXJ5IG9uTG9hZC5cbiAgICAgKiBJdCBpcyB1c2VkIHRvIGluaXRpYWxpemUgdGhlIGJ1aWx0aW4gY29tcG9uZW50cyBpbnRlcm5hbGx5LFxuICAgICAqIHRvIGF2b2lkIGNoZWNraW5nIHdoZXRoZXIgb25Mb2FkIGlzIGNhbGxlZCBiZWZvcmUgZXZlcnkgcHVibGljIG1ldGhvZCBjYWxscy5cbiAgICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgcmVtb3ZlZCBpZiBzY3JpcHQgcHJpb3JpdHkgaXMgc3VwcG9ydGVkLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBfX3ByZWxvYWRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9fcHJlbG9hZDogbnVsbCxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBXaGVuIGF0dGFjaGluZyB0byBhbiBhY3RpdmUgbm9kZSBvciBpdHMgbm9kZSBmaXJzdCBhY3RpdmF0ZWQuXG4gICAgICogb25Mb2FkIGlzIGFsd2F5cyBjYWxsZWQgYmVmb3JlIGFueSBzdGFydCBmdW5jdGlvbnMsIHRoaXMgYWxsb3dzIHlvdSB0byBvcmRlciBpbml0aWFsaXphdGlvbiBvZiBzY3JpcHRzLjxici8+XG4gICAgICogVGhpcyBpcyBhIGxpZmVjeWNsZSBtZXRob2QuIEl0IG1heSBub3QgYmUgaW1wbGVtZW50ZWQgaW4gdGhlIHN1cGVyIGNsYXNzLiBZb3UgY2FuIG9ubHkgY2FsbCBpdHMgc3VwZXIgY2xhc3MgbWV0aG9kIGluc2lkZSBpdC4gSXQgc2hvdWxkIG5vdCBiZSBjYWxsZWQgbWFudWFsbHkgZWxzZXdoZXJlLlxuICAgICAqICEjemhcbiAgICAgKiDlvZPpmYTliqDliLDkuIDkuKrmv4DmtLvnmoToioLngrnkuIrmiJbogIXlhbboioLngrnnrKzkuIDmrKHmv4DmtLvml7blgJnosIPnlKjjgIJvbkxvYWQg5oC75piv5Lya5Zyo5Lu75L2VIHN0YXJ0IOaWueazleiwg+eUqOWJjeaJp+ihjO+8jOi/meiDveeUqOS6juWuieaOkuiEmuacrOeahOWIneWni+WMlumhuuW6j+OAgjxici8+XG4gICAgICog6K+l5pa55rOV5Li655Sf5ZG95ZGo5pyf5pa55rOV77yM54i257G75pyq5b+F5Lya5pyJ5a6e546w44CC5bm25LiU5L2g5Y+q6IO95Zyo6K+l5pa55rOV5YaF6YOo6LCD55So54i257G755qE5a6e546w77yM5LiN5Y+v5Zyo5YW25a6D5Zyw5pa555u05o6l6LCD55So6K+l5pa55rOV44CCXG4gICAgICogQG1ldGhvZCBvbkxvYWRcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgb25Mb2FkOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENhbGxlZCBiZWZvcmUgYWxsIHNjcmlwdHMnIHVwZGF0ZSBpZiB0aGUgQ29tcG9uZW50IGlzIGVuYWJsZWQgdGhlIGZpcnN0IHRpbWUuXG4gICAgICogVXN1YWxseSB1c2VkIHRvIGluaXRpYWxpemUgc29tZSBsb2dpYyB3aGljaCBuZWVkIHRvIGJlIGNhbGxlZCBhZnRlciBhbGwgY29tcG9uZW50cycgYG9ubG9hZGAgbWV0aG9kcyBjYWxsZWQuPGJyLz5cbiAgICAgKiBUaGlzIGlzIGEgbGlmZWN5Y2xlIG1ldGhvZC4gSXQgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgc3VwZXIgY2xhc3MuIFlvdSBjYW4gb25seSBjYWxsIGl0cyBzdXBlciBjbGFzcyBtZXRob2QgaW5zaWRlIGl0LiBJdCBzaG91bGQgbm90IGJlIGNhbGxlZCBtYW51YWxseSBlbHNld2hlcmUuXG4gICAgICogISN6aFxuICAgICAqIOWmguaenOivpee7hOS7tuesrOS4gOasoeWQr+eUqO+8jOWImeWcqOaJgOaciee7hOS7tueahCB1cGRhdGUg5LmL5YmN6LCD55So44CC6YCa5bi455So5LqO6ZyA6KaB5Zyo5omA5pyJ57uE5Lu255qEIG9uTG9hZCDliJ3lp4vljJblrozmr5XlkI7miafooYznmoTpgLvovpHjgII8YnIvPlxuICAgICAqIOivpeaWueazleS4uueUn+WRveWRqOacn+aWueazle+8jOeItuexu+acquW/heS8muacieWunueOsOOAguW5tuS4lOS9oOWPquiDveWcqOivpeaWueazleWGhemDqOiwg+eUqOeItuexu+eahOWunueOsO+8jOS4jeWPr+WcqOWFtuWug+WcsOaWueebtOaOpeiwg+eUqOivpeaWueazleOAglxuICAgICAqIEBtZXRob2Qgc3RhcnRcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgc3RhcnQ6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENhbGxlZCB3aGVuIHRoaXMgY29tcG9uZW50IGJlY29tZXMgZW5hYmxlZCBhbmQgaXRzIG5vZGUgaXMgYWN0aXZlLjxici8+XG4gICAgICogVGhpcyBpcyBhIGxpZmVjeWNsZSBtZXRob2QuIEl0IG1heSBub3QgYmUgaW1wbGVtZW50ZWQgaW4gdGhlIHN1cGVyIGNsYXNzLiBZb3UgY2FuIG9ubHkgY2FsbCBpdHMgc3VwZXIgY2xhc3MgbWV0aG9kIGluc2lkZSBpdC4gSXQgc2hvdWxkIG5vdCBiZSBjYWxsZWQgbWFudWFsbHkgZWxzZXdoZXJlLlxuICAgICAqICEjemgg5b2T6K+l57uE5Lu26KKr5ZCv55So77yM5bm25LiU5a6D55qE6IqC54K55Lmf5r+A5rS75pe244CCPGJyLz5cbiAgICAgKiDor6Xmlrnms5XkuLrnlJ/lkb3lkajmnJ/mlrnms5XvvIzniLbnsbvmnKrlv4XkvJrmnInlrp7njrDjgILlubbkuJTkvaDlj6rog73lnKjor6Xmlrnms5XlhoXpg6josIPnlKjniLbnsbvnmoTlrp7njrDvvIzkuI3lj6/lnKjlhbblroPlnLDmlrnnm7TmjqXosIPnlKjor6Xmlrnms5XjgIJcbiAgICAgKiBAbWV0aG9kIG9uRW5hYmxlXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIG9uRW5hYmxlOiBudWxsLFxuXG4gICAgLyoqXG4gICAgICogISNlbiBDYWxsZWQgd2hlbiB0aGlzIGNvbXBvbmVudCBiZWNvbWVzIGRpc2FibGVkIG9yIGl0cyBub2RlIGJlY29tZXMgaW5hY3RpdmUuPGJyLz5cbiAgICAgKiBUaGlzIGlzIGEgbGlmZWN5Y2xlIG1ldGhvZC4gSXQgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgc3VwZXIgY2xhc3MuIFlvdSBjYW4gb25seSBjYWxsIGl0cyBzdXBlciBjbGFzcyBtZXRob2QgaW5zaWRlIGl0LiBJdCBzaG91bGQgbm90IGJlIGNhbGxlZCBtYW51YWxseSBlbHNld2hlcmUuXG4gICAgICogISN6aCDlvZPor6Xnu4Tku7booqvnpoHnlKjmiJboioLngrnlj5jkuLrml6DmlYjml7bosIPnlKjjgII8YnIvPlxuICAgICAqIOivpeaWueazleS4uueUn+WRveWRqOacn+aWueazle+8jOeItuexu+acquW/heS8muacieWunueOsOOAguW5tuS4lOS9oOWPquiDveWcqOivpeaWueazleWGhemDqOiwg+eUqOeItuexu+eahOWunueOsO+8jOS4jeWPr+WcqOWFtuWug+WcsOaWueebtOaOpeiwg+eUqOivpeaWueazleOAglxuICAgICAqIEBtZXRob2Qgb25EaXNhYmxlXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIG9uRGlzYWJsZTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2FsbGVkIHdoZW4gdGhpcyBjb21wb25lbnQgd2lsbCBiZSBkZXN0cm95ZWQuPGJyLz5cbiAgICAgKiBUaGlzIGlzIGEgbGlmZWN5Y2xlIG1ldGhvZC4gSXQgbWF5IG5vdCBiZSBpbXBsZW1lbnRlZCBpbiB0aGUgc3VwZXIgY2xhc3MuIFlvdSBjYW4gb25seSBjYWxsIGl0cyBzdXBlciBjbGFzcyBtZXRob2QgaW5zaWRlIGl0LiBJdCBzaG91bGQgbm90IGJlIGNhbGxlZCBtYW51YWxseSBlbHNld2hlcmUuXG4gICAgICogISN6aCDlvZPor6Xnu4Tku7booqvplIDmr4Hml7bosIPnlKg8YnIvPlxuICAgICAqIOivpeaWueazleS4uueUn+WRveWRqOacn+aWueazle+8jOeItuexu+acquW/heS8muacieWunueOsOOAguW5tuS4lOS9oOWPquiDveWcqOivpeaWueazleWGhemDqOiwg+eUqOeItuexu+eahOWunueOsO+8jOS4jeWPr+WcqOWFtuWug+WcsOaWueebtOaOpeiwg+eUqOivpeaWueazleOAglxuICAgICAqIEBtZXRob2Qgb25EZXN0cm95XG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIG9uRGVzdHJveTogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIEBtZXRob2Qgb25Gb2N1c0luRWRpdG9yXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIG9uRm9jdXNJbkVkaXRvcjogbnVsbCxcbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIG9uTG9zdEZvY3VzSW5FZGl0b3JcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgb25Mb3N0Rm9jdXNJbkVkaXRvcjogbnVsbCxcbiAgICAvKipcbiAgICAgKiAhI2VuIENhbGxlZCB0byBpbml0aWFsaXplIHRoZSBjb21wb25lbnQgb3Igbm9kZeKAmXMgcHJvcGVydGllcyB3aGVuIGFkZGluZyB0aGUgY29tcG9uZW50IHRoZSBmaXJzdCB0aW1lIG9yIHdoZW4gdGhlIFJlc2V0IGNvbW1hbmQgaXMgdXNlZC4gVGhpcyBmdW5jdGlvbiBpcyBvbmx5IGNhbGxlZCBpbiBlZGl0b3IuXG4gICAgICogISN6aCDnlKjmnaXliJ3lp4vljJbnu4Tku7bmiJboioLngrnnmoTkuIDkupvlsZ7mgKfvvIzlvZPor6Xnu4Tku7booqvnrKzkuIDmrKHmt7vliqDliLDoioLngrnkuIrmiJbnlKjmiLfngrnlh7vkuoblroPnmoQgUmVzZXQg6I+c5Y2V5pe26LCD55So44CC6L+Z5Liq5Zue6LCD5Y+q5Lya5Zyo57yW6L6R5Zmo5LiL6LCD55So44CCXG4gICAgICogQG1ldGhvZCByZXNldEluRWRpdG9yXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIHJlc2V0SW5FZGl0b3I6IG51bGwsXG5cbiAgICAvLyBQVUJMSUNcblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyBhIGNvbXBvbmVudCBjbGFzcyB0byB0aGUgbm9kZS4gWW91IGNhbiBhbHNvIGFkZCBjb21wb25lbnQgdG8gbm9kZSBieSBwYXNzaW5nIGluIHRoZSBuYW1lIG9mIHRoZSBzY3JpcHQuXG4gICAgICogISN6aCDlkJHoioLngrnmt7vliqDkuIDkuKrnu4Tku7bnsbvvvIzkvaDov5jlj6/ku6XpgJrov4fkvKDlhaXohJrmnKznmoTlkI3np7DmnaXmt7vliqDnu4Tku7bjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYWRkQ29tcG9uZW50XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbnxTdHJpbmd9IHR5cGVPckNsYXNzTmFtZSAtIHRoZSBjb25zdHJ1Y3RvciBvciB0aGUgY2xhc3MgbmFtZSBvZiB0aGUgY29tcG9uZW50IHRvIGFkZFxuICAgICAqIEByZXR1cm4ge0NvbXBvbmVudH0gLSB0aGUgbmV3bHkgYWRkZWQgY29tcG9uZW50XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgc3ByaXRlID0gbm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgKiB2YXIgdGVzdCA9IG5vZGUuYWRkQ29tcG9uZW50KFwiVGVzdFwiKTtcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGFkZENvbXBvbmVudDxUIGV4dGVuZHMgQ29tcG9uZW50Pih0eXBlOiB7bmV3KCk6IFR9KTogVFxuICAgICAqIGFkZENvbXBvbmVudChjbGFzc05hbWU6IHN0cmluZyk6IGFueVxuICAgICAqL1xuICAgIGFkZENvbXBvbmVudCAodHlwZU9yQ2xhc3NOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vZGUuYWRkQ29tcG9uZW50KHR5cGVPckNsYXNzTmFtZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZXR1cm5zIHRoZSBjb21wb25lbnQgb2Ygc3VwcGxpZWQgdHlwZSBpZiB0aGUgbm9kZSBoYXMgb25lIGF0dGFjaGVkLCBudWxsIGlmIGl0IGRvZXNuJ3QuPGJyLz5cbiAgICAgKiBZb3UgY2FuIGFsc28gZ2V0IGNvbXBvbmVudCBpbiB0aGUgbm9kZSBieSBwYXNzaW5nIGluIHRoZSBuYW1lIG9mIHRoZSBzY3JpcHQuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluiKgueCueS4iuaMh+Wumuexu+Wei+eahOe7hOS7tu+8jOWmguaenOiKgueCueaciemZhOWKoOaMh+Wumuexu+Wei+eahOe7hOS7tu+8jOWImei/lOWbnu+8jOWmguaenOayoeacieWImeS4uuepuuOAgjxici8+XG4gICAgICog5Lyg5YWl5Y+C5pWw5Lmf5Y+v5Lul5piv6ISa5pys55qE5ZCN56ew44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldENvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSB0eXBlT3JDbGFzc05hbWVcbiAgICAgKiBAcmV0dXJuIHtDb21wb25lbnR9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyBnZXQgc3ByaXRlIGNvbXBvbmVudC5cbiAgICAgKiB2YXIgc3ByaXRlID0gbm9kZS5nZXRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgKiAvLyBnZXQgY3VzdG9tIHRlc3QgY2Fsc3MuXG4gICAgICogdmFyIHRlc3QgPSBub2RlLmdldENvbXBvbmVudChcIlRlc3RcIik7XG4gICAgICogQHR5cGVzY3JpcHRcbiAgICAgKiBnZXRDb21wb25lbnQ8VCBleHRlbmRzIENvbXBvbmVudD4odHlwZToge3Byb3RvdHlwZTogVH0pOiBUXG4gICAgICogZ2V0Q29tcG9uZW50KGNsYXNzTmFtZTogc3RyaW5nKTogYW55XG4gICAgICovXG4gICAgZ2V0Q29tcG9uZW50ICh0eXBlT3JDbGFzc05hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5nZXRDb21wb25lbnQodHlwZU9yQ2xhc3NOYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIGFsbCBjb21wb25lbnRzIG9mIHN1cHBsaWVkIFR5cGUgaW4gdGhlIG5vZGUuXG4gICAgICogISN6aCDov5Tlm57oioLngrnkuIrmjIflrprnsbvlnovnmoTmiYDmnInnu4Tku7bjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0Q29tcG9uZW50c1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSB0eXBlT3JDbGFzc05hbWVcbiAgICAgKiBAcmV0dXJuIHtDb21wb25lbnRbXX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBzcHJpdGVzID0gbm9kZS5nZXRDb21wb25lbnRzKGNjLlNwcml0ZSk7XG4gICAgICogdmFyIHRlc3RzID0gbm9kZS5nZXRDb21wb25lbnRzKFwiVGVzdFwiKTtcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldENvbXBvbmVudHM8VCBleHRlbmRzIENvbXBvbmVudD4odHlwZToge3Byb3RvdHlwZTogVH0pOiBUW11cbiAgICAgKiBnZXRDb21wb25lbnRzKGNsYXNzTmFtZTogc3RyaW5nKTogYW55W11cbiAgICAgKi9cbiAgICBnZXRDb21wb25lbnRzICh0eXBlT3JDbGFzc05hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5nZXRDb21wb25lbnRzKHR5cGVPckNsYXNzTmFtZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgY29tcG9uZW50IG9mIHN1cHBsaWVkIHR5cGUgaW4gYW55IG9mIGl0cyBjaGlsZHJlbiB1c2luZyBkZXB0aCBmaXJzdCBzZWFyY2guXG4gICAgICogISN6aCDpgJLlvZLmn6Xmib7miYDmnInlrZDoioLngrnkuK3nrKzkuIDkuKrljLnphY3mjIflrprnsbvlnovnmoTnu4Tku7bjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZ2V0Q29tcG9uZW50SW5DaGlsZHJlblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSB0eXBlT3JDbGFzc05hbWVcbiAgICAgKiBAcmV0dXJucyB7Q29tcG9uZW50fVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdmFyIHNwcml0ZSA9IG5vZGUuZ2V0Q29tcG9uZW50SW5DaGlsZHJlbihjYy5TcHJpdGUpO1xuICAgICAqIHZhciBUZXN0ID0gbm9kZS5nZXRDb21wb25lbnRJbkNoaWxkcmVuKFwiVGVzdFwiKTtcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldENvbXBvbmVudEluQ2hpbGRyZW48VCBleHRlbmRzIENvbXBvbmVudD4odHlwZToge3Byb3RvdHlwZTogVH0pOiBUXG4gICAgICogZ2V0Q29tcG9uZW50SW5DaGlsZHJlbihjbGFzc05hbWU6IHN0cmluZyk6IGFueVxuICAgICAqL1xuICAgIGdldENvbXBvbmVudEluQ2hpbGRyZW4gKHR5cGVPckNsYXNzTmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ub2RlLmdldENvbXBvbmVudEluQ2hpbGRyZW4odHlwZU9yQ2xhc3NOYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBjb21wb25lbnRzIG9mIHN1cHBsaWVkIHR5cGUgaW4gc2VsZiBvciBhbnkgb2YgaXRzIGNoaWxkcmVuIHVzaW5nIGRlcHRoIGZpcnN0IHNlYXJjaC5cbiAgICAgKiAhI3poIOmAkuW9kuafpeaJvuiHqui6q+aIluaJgOacieWtkOiKgueCueS4reaMh+Wumuexu+Wei+eahOe7hOS7tlxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRDb21wb25lbnRzSW5DaGlsZHJlblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb258U3RyaW5nfSB0eXBlT3JDbGFzc05hbWVcbiAgICAgKiBAcmV0dXJucyB7Q29tcG9uZW50W119XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgc3ByaXRlcyA9IG5vZGUuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oY2MuU3ByaXRlKTtcbiAgICAgKiB2YXIgdGVzdHMgPSBub2RlLmdldENvbXBvbmVudHNJbkNoaWxkcmVuKFwiVGVzdFwiKTtcbiAgICAgKiBAdHlwZXNjcmlwdFxuICAgICAqIGdldENvbXBvbmVudHNJbkNoaWxkcmVuPFQgZXh0ZW5kcyBDb21wb25lbnQ+KHR5cGU6IHtwcm90b3R5cGU6IFR9KTogVFtdXG4gICAgICogZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4oY2xhc3NOYW1lOiBzdHJpbmcpOiBhbnlbXVxuICAgICAqL1xuICAgIGdldENvbXBvbmVudHNJbkNoaWxkcmVuICh0eXBlT3JDbGFzc05hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5nZXRDb21wb25lbnRzSW5DaGlsZHJlbih0eXBlT3JDbGFzc05hbWUpO1xuICAgIH0sXG5cbiAgICAvLyBWSVJUVUFMXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogSWYgdGhlIGNvbXBvbmVudCdzIGJvdW5kaW5nIGJveCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgbm9kZSdzLCB5b3UgY2FuIGltcGxlbWVudCB0aGlzIG1ldGhvZCB0byBzdXBwbHlcbiAgICAgKiBhIGN1c3RvbSBheGlzIGFsaWduZWQgYm91bmRpbmcgYm94IChBQUJCKSwgc28gdGhlIGVkaXRvcidzIHNjZW5lIHZpZXcgY2FuIHBlcmZvcm0gaGl0IHRlc3QgcHJvcGVybHkuXG4gICAgICogISN6aFxuICAgICAqIOWmguaenOe7hOS7tueahOWMheWbtOebkuS4juiKgueCueS4jeWQjO+8jOaCqOWPr+S7peWunueOsOivpeaWueazleS7peaPkOS+m+iHquWumuS5ieeahOi9tOWQkeWvuem9kOeahOWMheWbtOebku+8iEFBQkLvvInvvIxcbiAgICAgKiDku6Xkvr/nvJbovpHlmajnmoTlnLrmma/op4blm77lj6/ku6XmraPnoa7lnLDmiafooYzngrnpgInmtYvor5XjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgX2dldExvY2FsQm91bmRzXG4gICAgICogQHBhcmFtIHtSZWN0fSBvdXRfcmVjdCAtIHRoZSBSZWN0IHRvIHJlY2VpdmUgdGhlIGJvdW5kaW5nIGJveFxuICAgICAqL1xuICAgIF9nZXRMb2NhbEJvdW5kczogbnVsbCxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBvblJlc3RvcmUgaXMgY2FsbGVkIGFmdGVyIHRoZSB1c2VyIGNsaWNrcyB0aGUgUmVzZXQgaXRlbSBpbiB0aGUgSW5zcGVjdG9yJ3MgY29udGV4dCBtZW51IG9yIHBlcmZvcm1zXG4gICAgICogYW4gdW5kbyBvcGVyYXRpb24gb24gdGhpcyBjb21wb25lbnQuPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIElmIHRoZSBjb21wb25lbnQgY29udGFpbnMgdGhlIFwiaW50ZXJuYWwgc3RhdGVcIiwgc2hvcnQgZm9yIFwidGVtcG9yYXJ5IG1lbWJlciB2YXJpYWJsZXMgd2hpY2ggbm90IGluY2x1ZGVkPGJyLz5cbiAgICAgKiBpbiBpdHMgQ0NDbGFzcyBwcm9wZXJ0aWVzXCIsIHRoZW4geW91IG1heSBuZWVkIHRvIGltcGxlbWVudCB0aGlzIGZ1bmN0aW9uLjxici8+XG4gICAgICogPGJyLz5cbiAgICAgKiBUaGUgZWRpdG9yIHdpbGwgY2FsbCB0aGUgZ2V0c2V0IGFjY2Vzc29ycyBvZiB5b3VyIGNvbXBvbmVudCB0byByZWNvcmQvcmVzdG9yZSB0aGUgY29tcG9uZW50J3Mgc3RhdGU8YnIvPlxuICAgICAqIGZvciB1bmRvL3JlZG8gb3BlcmF0aW9uLiBIb3dldmVyLCBpbiBleHRyZW1lIGNhc2VzLCBpdCBtYXkgbm90IHdvcmtzIHdlbGwuIFRoZW4geW91IHNob3VsZCBpbXBsZW1lbnQ8YnIvPlxuICAgICAqIHRoaXMgZnVuY3Rpb24gdG8gbWFudWFsbHkgc3luY2hyb25pemUgeW91ciBjb21wb25lbnQncyBcImludGVybmFsIHN0YXRlc1wiIHdpdGggaXRzIHB1YmxpYyBwcm9wZXJ0aWVzLjxici8+XG4gICAgICogT25jZSB5b3UgaW1wbGVtZW50IHRoaXMgZnVuY3Rpb24sIGFsbCB0aGUgZ2V0c2V0IGFjY2Vzc29ycyBvZiB5b3VyIGNvbXBvbmVudCB3aWxsIG5vdCBiZSBjYWxsZWQgd2hlbjxici8+XG4gICAgICogdGhlIHVzZXIgcGVyZm9ybXMgYW4gdW5kby9yZWRvIG9wZXJhdGlvbi4gV2hpY2ggbWVhbnMgdGhhdCBvbmx5IHRoZSBwcm9wZXJ0aWVzIHdpdGggZGVmYXVsdCB2YWx1ZTxici8+XG4gICAgICogd2lsbCBiZSByZWNvcmRlZCBvciByZXN0b3JlZCBieSBlZGl0b3IuPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIFNpbWlsYXJseSwgdGhlIGVkaXRvciBtYXkgZmFpbGVkIHRvIHJlc2V0IHlvdXIgY29tcG9uZW50IGNvcnJlY3RseSBpbiBleHRyZW1lIGNhc2VzLiBUaGVuIGlmIHlvdSBuZWVkPGJyLz5cbiAgICAgKiB0byBzdXBwb3J0IHRoZSByZXNldCBtZW51LCB5b3Ugc2hvdWxkIG1hbnVhbGx5IHN5bmNocm9uaXplIHlvdXIgY29tcG9uZW50J3MgXCJpbnRlcm5hbCBzdGF0ZXNcIiB3aXRoIGl0czxici8+XG4gICAgICogcHJvcGVydGllcyBpbiB0aGlzIGZ1bmN0aW9uLiBPbmNlIHlvdSBpbXBsZW1lbnQgdGhpcyBmdW5jdGlvbiwgYWxsIHRoZSBnZXRzZXQgYWNjZXNzb3JzIG9mIHlvdXIgY29tcG9uZW50PGJyLz5cbiAgICAgKiB3aWxsIG5vdCBiZSBjYWxsZWQgZHVyaW5nIHJlc2V0IG9wZXJhdGlvbi4gV2hpY2ggbWVhbnMgdGhhdCBvbmx5IHRoZSBwcm9wZXJ0aWVzIHdpdGggZGVmYXVsdCB2YWx1ZTxici8+XG4gICAgICogd2lsbCBiZSByZXNldCBieSBlZGl0b3IuXG4gICAgICpcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGlzIG9ubHkgY2FsbGVkIGluIGVkaXRvciBtb2RlLlxuICAgICAqICEjemhcbiAgICAgKiBvblJlc3RvcmUg5piv55So5oi35Zyo5qOA5p+l5Zmo6I+c5Y2V54K55Ye7IFJlc2V0IOaXtu+8jOWvueatpOe7hOS7tuaJp+ihjOaSpOa2iOaTjeS9nOWQjuiwg+eUqOeahOOAgjxici8+XG4gICAgICogPGJyLz5cbiAgICAgKiDlpoLmnpznu4Tku7bljIXlkKvkuobigJzlhoXpg6jnirbmgIHigJ3vvIjkuI3lnKggQ0NDbGFzcyDlsZ7mgKfkuK3lrprkuYnnmoTkuLTml7bmiJDlkZjlj5jph4/vvInvvIzpgqPkuYjkvaDlj6/og73pnIDopoHlrp7njrDor6Xmlrnms5XjgII8YnIvPlxuICAgICAqIDxici8+XG4gICAgICog57yW6L6R5Zmo5omn6KGM5pKk6ZSAL+mHjeWBmuaTjeS9nOaXtu+8jOWwhuiwg+eUqOe7hOS7tueahCBnZXQgc2V0IOadpeW9leWItuWSjOi/mOWOn+e7hOS7tueahOeKtuaAgeOAglxuICAgICAqIOeEtuiAjO+8jOWcqOaegeerr+eahOaDheWGteS4i++8jOWug+WPr+iDveaXoOazleiJr+Wlvei/kOS9nOOAgjxici8+XG4gICAgICog6YKj5LmI5L2g5bCx5bqU6K+l5a6e546w6L+Z5Liq5pa55rOV77yM5omL5Yqo5qC55o2u57uE5Lu255qE5bGe5oCn5ZCM5q2l4oCc5YaF6YOo54q25oCB4oCd44CCXG4gICAgICog5LiA5pem5L2g5a6e546w6L+Z5Liq5pa55rOV77yM5b2T55So5oi35pKk6ZSA5oiW6YeN5YGa5pe277yM57uE5Lu255qE5omA5pyJIGdldCBzZXQg6YO95LiN5Lya5YaN6KKr6LCD55So44CCXG4gICAgICog6L+Z5oSP5ZGz552A5LuF5LuF5oyH5a6a5LqG6buY6K6k5YC855qE5bGe5oCn5bCG6KKr57yW6L6R5Zmo6K6w5b2V5ZKM6L+Y5Y6f44CCPGJyLz5cbiAgICAgKiA8YnIvPlxuICAgICAqIOWQjOagt+eahO+8jOe8lui+keWPr+iDveaXoOazleWcqOaegeerr+aDheWGteS4i+ato+ehruWcsOmHjee9ruaCqOeahOe7hOS7tuOAgjxici8+XG4gICAgICog5LqO5piv5aaC5p6c5L2g6ZyA6KaB5pSv5oyB57uE5Lu26YeN572u6I+c5Y2V77yM5L2g6ZyA6KaB5Zyo6K+l5pa55rOV5Lit5omL5bel5ZCM5q2l57uE5Lu25bGe5oCn5Yiw4oCc5YaF6YOo54q25oCB4oCd44CCPGJyLz5cbiAgICAgKiDkuIDml6bkvaDlrp7njrDov5nkuKrmlrnms5XvvIznu4Tku7bnmoTmiYDmnIkgZ2V0IHNldCDpg73kuI3kvJrlnKjph43nva7mk43kvZzml7booqvosIPnlKjjgIJcbiAgICAgKiDov5nmhI/lkbPnnYDku4Xku4XmjIflrprkuobpu5jorqTlgLznmoTlsZ7mgKflsIbooqvnvJbovpHlmajph43nva7jgIJcbiAgICAgKiA8YnIvPlxuICAgICAqIOatpOaWueazleS7heWcqOe8lui+keWZqOS4i+S8muiiq+iwg+eUqOOAglxuICAgICAqIEBtZXRob2Qgb25SZXN0b3JlXG4gICAgICovXG4gICAgb25SZXN0b3JlOiBudWxsLFxuXG4gICAgLy8gT1ZFUlJJREVcblxuICAgIGRlc3Ryb3kgKCkge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICB2YXIgZGVwZW5kID0gdGhpcy5ub2RlLl9nZXREZXBlbmRDb21wb25lbnQodGhpcyk7XG4gICAgICAgICAgICBpZiAoZGVwZW5kKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNjLmVycm9ySUQoMzYyNixcbiAgICAgICAgICAgICAgICAgICAgY2MuanMuZ2V0Q2xhc3NOYW1lKHRoaXMpLCBjYy5qcy5nZXRDbGFzc05hbWUoZGVwZW5kKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3N1cGVyKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9lbmFibGVkICYmIHRoaXMubm9kZS5fYWN0aXZlSW5IaWVyYXJjaHkpIHtcbiAgICAgICAgICAgICAgICBjYy5kaXJlY3Rvci5fY29tcFNjaGVkdWxlci5kaXNhYmxlQ29tcCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfb25QcmVEZXN0cm95ICgpIHtcbiAgICAgICAgLy8gU2NoZWR1bGVzXG4gICAgICAgIHRoaXMudW5zY2hlZHVsZUFsbENhbGxiYWNrcygpO1xuXG4gICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzXG4gICAgICAgIHZhciBldmVudFRhcmdldHMgPSB0aGlzLl9fZXZlbnRUYXJnZXRzO1xuICAgICAgICBmb3IgKHZhciBpID0gZXZlbnRUYXJnZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZXZlbnRUYXJnZXRzW2ldO1xuICAgICAgICAgICAgdGFyZ2V0ICYmIHRhcmdldC50YXJnZXRPZmYodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnRUYXJnZXRzLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgLy9cbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiAhQ0NfVEVTVCkge1xuICAgICAgICAgICAgX1NjZW5lLkFzc2V0c1dhdGNoZXIuc3RvcCh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9uRGVzdHJveVxuICAgICAgICBjYy5kaXJlY3Rvci5fbm9kZUFjdGl2YXRvci5kZXN0cm95Q29tcCh0aGlzKTtcblxuICAgICAgICAvLyBkbyByZW1vdmUgY29tcG9uZW50XG4gICAgICAgIHRoaXMubm9kZS5fcmVtb3ZlQ29tcG9uZW50KHRoaXMpO1xuICAgIH0sXG5cbiAgICBfaW5zdGFudGlhdGUgKGNsb25lZCkge1xuICAgICAgICBpZiAoIWNsb25lZCkge1xuICAgICAgICAgICAgY2xvbmVkID0gY2MuaW5zdGFudGlhdGUuX2Nsb25lKHRoaXMsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGNsb25lZC5ub2RlID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIGNsb25lZDtcbiAgICB9LFxuXG4vLyBTY2hlZHVsZXJcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTY2hlZHVsZXMgYSBjdXN0b20gc2VsZWN0b3IuPGJyLz5cbiAgICAgKiBJZiB0aGUgc2VsZWN0b3IgaXMgYWxyZWFkeSBzY2hlZHVsZWQsIHRoZW4gdGhlIGludGVydmFsIHBhcmFtZXRlciB3aWxsIGJlIHVwZGF0ZWQgd2l0aG91dCBzY2hlZHVsaW5nIGl0IGFnYWluLlxuICAgICAqICEjemhcbiAgICAgKiDosIPluqbkuIDkuKroh6rlrprkuYnnmoTlm57osIPlh73mlbDjgII8YnIvPlxuICAgICAqIOWmguaenOWbnuiwg+WHveaVsOW3suiwg+W6pu+8jOmCo+S5iOWwhuS4jeS8mumHjeWkjeiwg+W6puWug++8jOWPquS8muabtOaWsOaXtumXtOmXtOmalOWPguaVsOOAglxuICAgICAqIEBtZXRob2Qgc2NoZWR1bGVcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2ludGVydmFsPTBdICBUaWNrIGludGVydmFsIGluIHNlY29uZHMuIDAgbWVhbnMgdGljayBldmVyeSBmcmFtZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3JlcGVhdD1jYy5tYWNyby5SRVBFQVRfRk9SRVZFUl0gICAgVGhlIHNlbGVjdG9yIHdpbGwgYmUgZXhlY3V0ZWQgKHJlcGVhdCArIDEpIHRpbWVzLCB5b3UgY2FuIHVzZSBjYy5tYWNyby5SRVBFQVRfRk9SRVZFUiBmb3IgdGljayBpbmZpbml0ZWx5LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsYXk9MF0gICAgIFRoZSBhbW91bnQgb2YgdGltZSB0aGF0IHRoZSBmaXJzdCB0aWNrIHdpbGwgd2FpdCBiZWZvcmUgZXhlY3V0aW9uLiBVbml0OiBzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdGltZUNhbGxiYWNrID0gZnVuY3Rpb24gKGR0KSB7XG4gICAgICogICBjYy5sb2coXCJ0aW1lOiBcIiArIGR0KTtcbiAgICAgKiB9XG4gICAgICogdGhpcy5zY2hlZHVsZSh0aW1lQ2FsbGJhY2ssIDEpO1xuICAgICAqL1xuICAgIHNjaGVkdWxlIChjYWxsYmFjaywgaW50ZXJ2YWwsIHJlcGVhdCwgZGVsYXkpIHtcbiAgICAgICAgY2MuYXNzZXJ0SUQoY2FsbGJhY2ssIDE2MTkpO1xuXG4gICAgICAgIGludGVydmFsID0gaW50ZXJ2YWwgfHwgMDtcbiAgICAgICAgY2MuYXNzZXJ0SUQoaW50ZXJ2YWwgPj0gMCwgMTYyMCk7XG5cbiAgICAgICAgcmVwZWF0ID0gaXNOYU4ocmVwZWF0KSA/IGNjLm1hY3JvLlJFUEVBVF9GT1JFVkVSIDogcmVwZWF0O1xuICAgICAgICBkZWxheSA9IGRlbGF5IHx8IDA7XG5cbiAgICAgICAgdmFyIHNjaGVkdWxlciA9IGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpO1xuXG4gICAgICAgIC8vIHNob3VsZCBub3QgdXNlIGVuYWJsZWRJbkhpZXJhcmNoeSB0byBqdWRnZSB3aGV0aGVyIHBhdXNlZCxcbiAgICAgICAgLy8gYmVjYXVzZSBlbmFibGVkSW5IaWVyYXJjaHkgaXMgYXNzaWduZWQgYWZ0ZXIgb25FbmFibGUuXG4gICAgICAgIC8vIEFjdHVhbGx5LCBpZiBub3QgeWV0IHNjaGVkdWxlZCwgcmVzdW1lVGFyZ2V0L3BhdXNlVGFyZ2V0IGhhcyBubyBlZmZlY3Qgb24gY29tcG9uZW50LFxuICAgICAgICAvLyB0aGVyZWZvcmUgdGhlcmUgaXMgbm8gd2F5IHRvIGd1YXJhbnRlZSB0aGUgcGF1c2VkIHN0YXRlIG90aGVyIHRoYW4gaXNUYXJnZXRQYXVzZWQuXG4gICAgICAgIHZhciBwYXVzZWQgPSBzY2hlZHVsZXIuaXNUYXJnZXRQYXVzZWQodGhpcyk7XG5cbiAgICAgICAgc2NoZWR1bGVyLnNjaGVkdWxlKGNhbGxiYWNrLCB0aGlzLCBpbnRlcnZhbCwgcmVwZWF0LCBkZWxheSwgcGF1c2VkKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTY2hlZHVsZXMgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IHJ1bnMgb25seSBvbmNlLCB3aXRoIGEgZGVsYXkgb2YgMCBvciBsYXJnZXIuXG4gICAgICogISN6aCDosIPluqbkuIDkuKrlj6rov5DooYzkuIDmrKHnmoTlm57osIPlh73mlbDvvIzlj6/ku6XmjIflrpogMCDorqnlm57osIPlh73mlbDlnKjkuIvkuIDluKfnq4vljbPmiafooYzmiJbogIXlnKjkuIDlrprnmoTlu7bml7bkuYvlkI7miafooYzjgIJcbiAgICAgKiBAbWV0aG9kIHNjaGVkdWxlT25jZVxuICAgICAqIEBzZWUgY2MuTm9kZSNzY2hlZHVsZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrICBBIGZ1bmN0aW9uIHdyYXBwZWQgYXMgYSBzZWxlY3RvclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsYXk9MF0gIFRoZSBhbW91bnQgb2YgdGltZSB0aGF0IHRoZSBmaXJzdCB0aWNrIHdpbGwgd2FpdCBiZWZvcmUgZXhlY3V0aW9uLiBVbml0OiBzXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgdGltZUNhbGxiYWNrID0gZnVuY3Rpb24gKGR0KSB7XG4gICAgICogICBjYy5sb2coXCJ0aW1lOiBcIiArIGR0KTtcbiAgICAgKiB9XG4gICAgICogdGhpcy5zY2hlZHVsZU9uY2UodGltZUNhbGxiYWNrLCAyKTtcbiAgICAgKi9cbiAgICBzY2hlZHVsZU9uY2UgKGNhbGxiYWNrLCBkZWxheSkge1xuICAgICAgICB0aGlzLnNjaGVkdWxlKGNhbGxiYWNrLCAwLCAwLCBkZWxheSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gVW5zY2hlZHVsZXMgYSBjdXN0b20gY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAgICogISN6aCDlj5bmtojosIPluqbkuIDkuKroh6rlrprkuYnnmoTlm57osIPlh73mlbDjgIJcbiAgICAgKiBAbWV0aG9kIHVuc2NoZWR1bGVcbiAgICAgKiBAc2VlIGNjLk5vZGUjc2NoZWR1bGVcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja19mbiAgQSBmdW5jdGlvbiB3cmFwcGVkIGFzIGEgc2VsZWN0b3JcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHRoaXMudW5zY2hlZHVsZShfY2FsbGJhY2spO1xuICAgICAqL1xuICAgIHVuc2NoZWR1bGUgKGNhbGxiYWNrX2ZuKSB7XG4gICAgICAgIGlmICghY2FsbGJhY2tfZm4pXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0U2NoZWR1bGVyKCkudW5zY2hlZHVsZShjYWxsYmFja19mbiwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiB1bnNjaGVkdWxlIGFsbCBzY2hlZHVsZWQgY2FsbGJhY2sgZnVuY3Rpb25zOiBjdXN0b20gY2FsbGJhY2sgZnVuY3Rpb25zLCBhbmQgdGhlICd1cGRhdGUnIGNhbGxiYWNrIGZ1bmN0aW9uLjxici8+XG4gICAgICogQWN0aW9ucyBhcmUgbm90IGFmZmVjdGVkIGJ5IHRoaXMgbWV0aG9kLlxuICAgICAqICEjemgg5Y+W5raI6LCD5bqm5omA5pyJ5bey6LCD5bqm55qE5Zue6LCD5Ye95pWw77ya5a6a5Yi255qE5Zue6LCD5Ye95pWw5Lul5Y+KICd1cGRhdGUnIOWbnuiwg+WHveaVsOOAguWKqOS9nOS4jeWPl+atpOaWueazleW9seWTjeOAglxuICAgICAqIEBtZXRob2QgdW5zY2hlZHVsZUFsbENhbGxiYWNrc1xuICAgICAqIEBleGFtcGxlXG4gICAgICogdGhpcy51bnNjaGVkdWxlQWxsQ2FsbGJhY2tzKCk7XG4gICAgICovXG4gICAgdW5zY2hlZHVsZUFsbENhbGxiYWNrcyAoKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmdldFNjaGVkdWxlcigpLnVuc2NoZWR1bGVBbGxGb3JUYXJnZXQodGhpcyk7XG4gICAgfSxcbn0pO1xuXG5Db21wb25lbnQuX3JlcXVpcmVDb21wb25lbnQgPSBudWxsO1xuQ29tcG9uZW50Ll9leGVjdXRpb25PcmRlciA9IDA7XG5cbmlmIChDQ19FRElUT1IgfHwgQ0NfVEVTVCkge1xuXG4gICAgLy8gSU5IRVJJVEFCTEUgU1RBVElDIE1FTUJFUlNcblxuICAgIENvbXBvbmVudC5fZXhlY3V0ZUluRWRpdE1vZGUgPSBmYWxzZTtcbiAgICBDb21wb25lbnQuX3BsYXlPbkZvY3VzID0gZmFsc2U7XG4gICAgQ29tcG9uZW50Ll9kaXNhbGxvd011bHRpcGxlID0gbnVsbDtcbiAgICBDb21wb25lbnQuX2hlbHAgPSAnJztcblxuICAgIC8vIE5PTi1JTkhFUklURUQgU1RBVElDIE1FTUJFUlNcbiAgICAvLyAoVHlwZVNjcmlwdCAyLjMgd2lsbCBzdGlsbCBpbmhlcml0IHRoZW0sIHNvIGFsd2F5cyBjaGVjayBoYXNPd25Qcm9wZXJ0eSBiZWZvcmUgdXNpbmcpXG5cbiAgICBqcy52YWx1ZShDb21wb25lbnQsICdfaW5zcGVjdG9yJywgJycsIHRydWUpO1xuICAgIGpzLnZhbHVlKENvbXBvbmVudCwgJ19pY29uJywgJycsIHRydWUpO1xuXG4gICAgLy8gQ09NUE9ORU5UIEhFTFBFUlNcblxuICAgIGNjLl9jb21wb25lbnRNZW51SXRlbXMgPSBbXTtcblxuICAgIENvbXBvbmVudC5fYWRkTWVudUl0ZW0gPSBmdW5jdGlvbiAoY2xzLCBwYXRoLCBwcmlvcml0eSkge1xuICAgICAgICBjYy5fY29tcG9uZW50TWVudUl0ZW1zLnB1c2goe1xuICAgICAgICAgICAgY29tcG9uZW50OiBjbHMsXG4gICAgICAgICAgICBtZW51UGF0aDogcGF0aCxcbiAgICAgICAgICAgIHByaW9yaXR5OiBwcmlvcml0eVxuICAgICAgICB9KTtcbiAgICB9O1xufVxuXG4vLyB3ZSBtYWtlIHRoaXMgbm9uLWVudW1lcmFibGUsIHRvIHByZXZlbnQgaW5oZXJpdGVkIGJ5IHN1YiBjbGFzc2VzLlxuanMudmFsdWUoQ29tcG9uZW50LCAnX3JlZ2lzdGVyRWRpdG9yUHJvcHMnLCBmdW5jdGlvbiAoY2xzLCBwcm9wcykge1xuICAgIHZhciByZXFDb21wID0gcHJvcHMucmVxdWlyZUNvbXBvbmVudDtcbiAgICBpZiAocmVxQ29tcCkge1xuICAgICAgICBjbHMuX3JlcXVpcmVDb21wb25lbnQgPSByZXFDb21wO1xuICAgIH1cbiAgICB2YXIgb3JkZXIgPSBwcm9wcy5leGVjdXRpb25PcmRlcjtcbiAgICBpZiAob3JkZXIgJiYgdHlwZW9mIG9yZGVyID09PSAnbnVtYmVyJykge1xuICAgICAgICBjbHMuX2V4ZWN1dGlvbk9yZGVyID0gb3JkZXI7XG4gICAgfVxuICAgIGlmIChDQ19FRElUT1IgfHwgQ0NfVEVTVCkge1xuICAgICAgICB2YXIgbmFtZSA9IGNjLmpzLmdldENsYXNzTmFtZShjbHMpO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIHZhciB2YWwgPSBwcm9wc1trZXldO1xuICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdleGVjdXRlSW5FZGl0TW9kZSc6XG4gICAgICAgICAgICAgICAgICAgIGNscy5fZXhlY3V0ZUluRWRpdE1vZGUgPSAhIXZhbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdwbGF5T25Gb2N1cyc6XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB3aWxsRXhlY3V0ZUluRWRpdE1vZGUgPSAoJ2V4ZWN1dGVJbkVkaXRNb2RlJyBpbiBwcm9wcykgPyBwcm9wcy5leGVjdXRlSW5FZGl0TW9kZSA6IGNscy5fZXhlY3V0ZUluRWRpdE1vZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAod2lsbEV4ZWN1dGVJbkVkaXRNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xzLl9wbGF5T25Gb2N1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYy53YXJuSUQoMzYwMSwgbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdpbnNwZWN0b3InOlxuICAgICAgICAgICAgICAgICAgICBqcy52YWx1ZShjbHMsICdfaW5zcGVjdG9yJywgdmFsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdpY29uJzpcbiAgICAgICAgICAgICAgICAgICAganMudmFsdWUoY2xzLCAnX2ljb24nLCB2YWwsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ21lbnUnOlxuICAgICAgICAgICAgICAgICAgICBDb21wb25lbnQuX2FkZE1lbnVJdGVtKGNscywgdmFsLCBwcm9wcy5tZW51UHJpb3JpdHkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2Rpc2FsbG93TXVsdGlwbGUnOlxuICAgICAgICAgICAgICAgICAgICBjbHMuX2Rpc2FsbG93TXVsdGlwbGUgPSBjbHM7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAncmVxdWlyZUNvbXBvbmVudCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnZXhlY3V0aW9uT3JkZXInOlxuICAgICAgICAgICAgICAgICAgICAvLyBza2lwIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdoZWxwJzpcbiAgICAgICAgICAgICAgICAgICAgY2xzLl9oZWxwID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGNjLndhcm5JRCgzNjAyLCBrZXksIG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5Db21wb25lbnQucHJvdG90eXBlLl9fc2NyaXB0VXVpZCA9ICcnO1xuXG5jYy5Db21wb25lbnQgPSBtb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudDtcbiJdfQ==