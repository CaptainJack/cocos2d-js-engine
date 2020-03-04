
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/ArmatureDisplay.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
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
var RenderComponent = require('../../cocos2d/core/components/CCRenderComponent');

var EventTarget = require('../../cocos2d/core/event/event-target');

var Graphics = require('../../cocos2d/core/graphics/graphics');

var RenderFlow = require('../../cocos2d/core/renderer/render-flow');

var FLAG_POST_RENDER = RenderFlow.FLAG_POST_RENDER;

var ArmatureCache = require('./ArmatureCache');

var AttachUtil = require('./AttachUtil');
/**
 * @module dragonBones
 */


var DefaultArmaturesEnum = cc.Enum({
  'default': -1
});
var DefaultAnimsEnum = cc.Enum({
  '<None>': 0
});
var DefaultCacheMode = cc.Enum({
  'REALTIME': 0
});
/**
 * !#en Enum for cache mode type.
 * !#zh Dragonbones渲染类型
 * @enum ArmatureDisplay.AnimationCacheMode
 */

var AnimationCacheMode = cc.Enum({
  /**
   * !#en The realtime mode.
   * !#zh 实时计算模式。
   * @property {Number} REALTIME
   */
  REALTIME: 0,

  /**
   * !#en The shared cache mode.
   * !#zh 共享缓存模式。
   * @property {Number} SHARED_CACHE
   */
  SHARED_CACHE: 1,

  /**
   * !#en The private cache mode.
   * !#zh 私有缓存模式。
   * @property {Number} PRIVATE_CACHE
   */
  PRIVATE_CACHE: 2
});

function setEnumAttr(obj, propName, enumDef) {
  cc.Class.Attr.setClassAttr(obj, propName, 'type', 'Enum');
  cc.Class.Attr.setClassAttr(obj, propName, 'enumList', cc.Enum.getList(enumDef));
}
/**
 * !#en
 * The Armature Display of DragonBones <br/>
 * <br/>
 * (Armature Display has a reference to a DragonBonesAsset and stores the state for ArmatureDisplay instance,
 * which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
 * Multiple Armature Display can use the same DragonBonesAsset which includes all animations, skins, and attachments.) <br/>
 * !#zh
 * DragonBones 骨骼动画 <br/>
 * <br/>
 * (Armature Display 具有对骨骼数据的引用并且存储了骨骼实例的状态，
 * 它由当前的骨骼动作，slot 颜色，和可见的 slot attachments 组成。<br/>
 * 多个 Armature Display 可以使用相同的骨骼数据，其中包括所有的动画，皮肤和 attachments。)<br/>
 *
 * @class ArmatureDisplay
 * @extends RenderComponent
 */


var ArmatureDisplay = cc.Class({
  name: 'dragonBones.ArmatureDisplay',
  "extends": RenderComponent,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/DragonBones',
    inspector: 'packages://inspector/inspectors/comps/skeleton2d.js'
  },
  statics: {
    AnimationCacheMode: AnimationCacheMode
  },
  properties: {
    _factory: {
      "default": null,
      type: dragonBones.CCFactory,
      serializable: false
    },

    /**
     * !#en
     * The DragonBones data contains the armatures information (bind pose bones, slots, draw order,
     * attachments, skins, etc) and animations but does not hold any state.<br/>
     * Multiple ArmatureDisplay can share the same DragonBones data.
     * !#zh
     * 骨骼数据包含了骨骼信息（绑定骨骼动作，slots，渲染顺序，
     * attachments，皮肤等等）和动画但不持有任何状态。<br/>
     * 多个 ArmatureDisplay 可以共用相同的骨骼数据。
     * @property {DragonBonesAsset} dragonAsset
     */
    dragonAsset: {
      "default": null,
      type: dragonBones.DragonBonesAsset,
      notify: function notify() {
        this._refresh();

        if (CC_EDITOR) {
          this._defaultArmatureIndex = 0;
          this._animationIndex = 0;
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.dragon_bones_asset'
    },

    /**
     * !#en
     * The atlas asset for the DragonBones.
     * !#zh
     * 骨骼数据所需的 Atlas Texture 数据。
     * @property {DragonBonesAtlasAsset} dragonAtlasAsset
     */
    dragonAtlasAsset: {
      "default": null,
      type: dragonBones.DragonBonesAtlasAsset,
      notify: function notify() {
        // parse the atlas asset data
        this._parseDragonAtlasAsset();

        this._refresh();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.dragon_bones_atlas_asset'
    },
    _armatureName: '',

    /**
     * !#en The name of current armature.
     * !#zh 当前的 Armature 名称。
     * @property {String} armatureName
     */
    armatureName: {
      get: function get() {
        return this._armatureName;
      },
      set: function set(value) {
        this._armatureName = value;
        var animNames = this.getAnimationNames(this._armatureName);

        if (!this.animationName || animNames.indexOf(this.animationName) < 0) {
          if (CC_EDITOR) {
            this.animationName = animNames[0];
          } else {
            // Not use default animation name at runtime
            this.animationName = '';
          }
        }

        if (this._armature && !this.isAnimationCached()) {
          this._factory._dragonBones.clock.remove(this._armature);
        }

        this._refresh();

        if (this._armature && !this.isAnimationCached()) {
          this._factory._dragonBones.clock.add(this._armature);
        }
      },
      visible: false
    },
    _animationName: '',

    /**
     * !#en The name of current playing animation.
     * !#zh 当前播放的动画名称。
     * @property {String} animationName
     */
    animationName: {
      get: function get() {
        return this._animationName;
      },
      set: function set(value) {
        this._animationName = value;
      },
      visible: false
    },

    /**
     * @property {Number} _defaultArmatureIndex
     */
    _defaultArmatureIndex: {
      "default": 0,
      notify: function notify() {
        var armatureName = '';

        if (this.dragonAsset) {
          var armaturesEnum;

          if (this.dragonAsset) {
            armaturesEnum = this.dragonAsset.getArmatureEnum();
          }

          if (!armaturesEnum) {
            return cc.errorID(7400, this.name);
          }

          armatureName = armaturesEnum[this._defaultArmatureIndex];
        }

        if (armatureName !== undefined) {
          this.armatureName = armatureName;
        } else {
          cc.errorID(7401, this.name);
        }
      },
      type: DefaultArmaturesEnum,
      visible: true,
      editorOnly: true,
      animatable: false,
      displayName: "Armature",
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.armature_name'
    },
    // value of 0 represents no animation
    _animationIndex: {
      "default": 0,
      notify: function notify() {
        if (this._animationIndex === 0) {
          this.animationName = '';
          return;
        }

        var animsEnum;

        if (this.dragonAsset) {
          animsEnum = this.dragonAsset.getAnimsEnum(this.armatureName);
        }

        if (!animsEnum) {
          return;
        }

        var animName = animsEnum[this._animationIndex];

        if (animName !== undefined) {
          this.playAnimation(animName, this.playTimes);
        } else {
          cc.errorID(7402, this.name);
        }
      },
      type: DefaultAnimsEnum,
      visible: true,
      editorOnly: true,
      displayName: 'Animation',
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.animation_name'
    },
    // Record pre cache mode.
    _preCacheMode: -1,
    _cacheMode: AnimationCacheMode.REALTIME,
    _defaultCacheMode: {
      "default": 0,
      type: AnimationCacheMode,
      notify: function notify() {
        if (this._defaultCacheMode !== AnimationCacheMode.REALTIME) {
          if (this._armature && !ArmatureCache.canCache(this._armature)) {
            this._defaultCacheMode = AnimationCacheMode.REALTIME;
            cc.warn("Animation cache mode doesn't support skeletal nesting");
            return;
          }
        }

        this.setAnimationCacheMode(this._defaultCacheMode);
      },
      editorOnly: true,
      visible: true,
      animatable: false,
      displayName: "Animation Cache Mode",
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.animation_cache_mode'
    },

    /**
     * !#en The time scale of this armature.
     * !#zh 当前骨骼中所有动画的时间缩放率。
     * @property {Number} timeScale
     * @default 1
     */
    timeScale: {
      "default": 1,
      notify: function notify() {
        if (this._armature && !this.isAnimationCached()) {
          this._armature.animation.timeScale = this.timeScale;
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.time_scale'
    },

    /**
     * !#en The play times of the default animation.
     *      -1 means using the value of config file;
     *      0 means repeat for ever
     *      >0 means repeat times
     * !#zh 播放默认动画的循环次数
     *      -1 表示使用配置文件中的默认值;
     *      0 表示无限循环
     *      >0 表示循环次数
     * @property {Number} playTimes
     * @default -1
     */
    playTimes: {
      "default": -1,
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.play_times'
    },

    /**
     * !#en Indicates whether to enable premultiplied alpha.
     * You should disable this option when image's transparent area appears to have opaque pixels,
     * or enable this option when image's half transparent area appears to be darken.
     * !#zh 是否启用贴图预乘。
     * 当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。
     * @property {Boolean} premultipliedAlpha
     * @default false
     */
    premultipliedAlpha: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.premultipliedAlpha'
    },

    /**
     * !#en Indicates whether open debug bones.
     * !#zh 是否显示 bone 的 debug 信息。
     * @property {Boolean} debugBones
     * @default false
     */
    debugBones: {
      "default": false,
      notify: function notify() {
        this._updateDebugDraw();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.debug_bones'
    },

    /**
     * !#en Enabled batch model, if skeleton is complex, do not enable batch, or will lower performance.
     * !#zh 开启合批，如果渲染大量相同纹理，且结构简单的骨骼动画，开启合批可以降低drawcall，否则请不要开启，cpu消耗会上升。
     * @property {Boolean} enableBatch
     * @default false
     */
    enableBatch: {
      "default": false,
      notify: function notify() {
        this._updateBatch();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.dragon_bones.enabled_batch'
    },
    // DragonBones data store key.
    _armatureKey: "",
    // Below properties will effect when cache mode is SHARED_CACHE or PRIVATE_CACHE.
    // accumulate time
    _accTime: 0,
    // Play times counter
    _playCount: 0,
    // Frame cache
    _frameCache: null,
    // Cur frame
    _curFrame: null,
    // Playing flag
    _playing: false,
    // Armature cache
    _armatureCache: null
  },
  ctor: function ctor() {
    // Property _materialCache Use to cache material,since dragonBones may use multiple texture,
    // it will clone from the '_material' property,if the dragonbones only have one texture,
    // it will just use the _material,won't clone it.
    // So if invoke getMaterial,it only return _material,if you want to change all materialCache,
    // you can change materialCache directly.
    this._eventTarget = new EventTarget();
    this._materialCache = {};
    this._inited = false;
    this.attachUtil = new AttachUtil();
    this._factory = dragonBones.CCFactory.getInstance();
  },
  onLoad: function onLoad() {
    // Adapt to old code,remove unuse child which is created by old code.
    // This logic can be remove after 2.2 or later.
    var children = this.node.children;

    for (var i = 0, n = children.length; i < n; i++) {
      var child = children[i];

      var pos = child._name && child._name.search('CHILD_ARMATURE-');

      if (pos === 0) {
        child.destroy();
      }
    }
  },
  // if change use batch mode, just clear material cache
  _updateBatch: function _updateBatch() {
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
    }

    this._materialCache = {};
  },
  // override base class _updateMaterial to set define value and clear material cache
  _updateMaterial: function _updateMaterial() {
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
      baseMaterial.define('USE_TEXTURE', true);
    }

    this._materialCache = {};
  },
  // override base class disableRender to clear post render flag
  disableRender: function disableRender() {
    this._super();

    this.node._renderFlag &= ~FLAG_POST_RENDER;
  },
  // override base class disableRender to add post render flag
  markForRender: function markForRender(enable) {
    this._super(enable);

    if (enable) {
      this.node._renderFlag |= FLAG_POST_RENDER;
    } else {
      this.node._renderFlag &= ~FLAG_POST_RENDER;
    }
  },
  _validateRender: function _validateRender() {
    var texture = this.dragonAtlasAsset && this.dragonAtlasAsset.texture;

    if (!texture || !texture.loaded) {
      this.disableRender();
      return;
    }

    this._super();
  },
  __preload: function __preload() {
    this._init();
  },
  _init: function _init() {
    if (this._inited) return;
    this._inited = true;

    this._resetAssembler();

    this._activateMaterial();

    this._parseDragonAtlasAsset();

    this._refresh();

    var children = this.node.children;

    for (var i = 0, n = children.length; i < n; i++) {
      var child = children[i];

      if (child && child._name === "DEBUG_DRAW_NODE") {
        child.destroy();
      }
    }

    this._updateDebugDraw();
  },

  /**
   * !#en
   * The key of dragonbones cache data, which is regard as 'dragonbonesName', when you want to change dragonbones cloth.
   * !#zh 
   * 缓存龙骨数据的key值，换装的时会使用到该值，作为dragonbonesName使用
   * @method getArmatureKey
   * @return {String}
   * @example
   * let factory = dragonBones.CCFactory.getInstance();
   * let needChangeSlot = needChangeArmature.armature().getSlot("changeSlotName");
   * factory.replaceSlotDisplay(toChangeArmature.getArmatureKey(), "armatureName", "slotName", "displayName", needChangeSlot);
   */
  getArmatureKey: function getArmatureKey() {
    return this._armatureKey;
  },

  /**
   * !#en
   * It's best to set cache mode before set property 'dragonAsset', or will waste some cpu time.
   * If set the mode in editor, then no need to worry about order problem.
   * !#zh 
   * 若想切换渲染模式，最好在设置'dragonAsset'之前，先设置好渲染模式，否则有运行时开销。
   * 若在编辑中设置渲染模式，则无需担心设置次序的问题。
   * 
   * @method setAnimationCacheMode
   * @param {AnimationCacheMode} cacheMode
   * @example
   * armatureDisplay.setAnimationCacheMode(dragonBones.ArmatureDisplay.AnimationCacheMode.SHARED_CACHE);
   */
  setAnimationCacheMode: function setAnimationCacheMode(cacheMode) {
    if (this._preCacheMode !== cacheMode) {
      this._cacheMode = cacheMode;

      this._buildArmature();
    }
  },

  /**
   * !#en Whether in cached mode.
   * !#zh 当前是否处于缓存模式。
   * @method isAnimationCached
   * @return {Boolean}
   */
  isAnimationCached: function isAnimationCached() {
    if (CC_EDITOR) return false;
    return this._cacheMode !== AnimationCacheMode.REALTIME;
  },
  onEnable: function onEnable() {
    this._super(); // If cache mode is cache, no need to update by dragonbones library.


    if (this._armature && !this.isAnimationCached()) {
      this._factory._dragonBones.clock.add(this._armature);
    }
  },
  onDisable: function onDisable() {
    this._super(); // If cache mode is cache, no need to update by dragonbones library.


    if (this._armature && !this.isAnimationCached()) {
      this._factory._dragonBones.clock.remove(this._armature);
    }
  },
  _emitCacheCompleteEvent: function _emitCacheCompleteEvent() {
    // Animation loop complete, the event diffrent from dragonbones inner event,
    // It has no event object.
    this._eventTarget.emit(dragonBones.EventObject.LOOP_COMPLETE); // Animation complete the event diffrent from dragonbones inner event,
    // It has no event object.


    this._eventTarget.emit(dragonBones.EventObject.COMPLETE);
  },
  update: function update(dt) {
    if (!this.isAnimationCached()) return;
    if (!this._frameCache) return;
    var frameCache = this._frameCache;

    if (!frameCache.isInited()) {
      return;
    }

    var frames = frameCache.frames;

    if (!this._playing) {
      if (frameCache.isInvalid()) {
        frameCache.updateToFrame();
        this._curFrame = frames[frames.length - 1];
      }

      return;
    }

    var frameTime = ArmatureCache.FrameTime; // Animation Start, the event diffrent from dragonbones inner event,
    // It has no event object.

    if (this._accTime == 0 && this._playCount == 0) {
      this._eventTarget.emit(dragonBones.EventObject.START);
    }

    var globalTimeScale = dragonBones.timeScale;
    this._accTime += dt * this.timeScale * globalTimeScale;
    var frameIdx = Math.floor(this._accTime / frameTime);

    if (!frameCache.isCompleted) {
      frameCache.updateToFrame(frameIdx);
    }

    if (frameCache.isCompleted && frameIdx >= frames.length) {
      this._playCount++;

      if (this.playTimes > 0 && this._playCount >= this.playTimes) {
        // set frame to end frame.
        this._curFrame = frames[frames.length - 1];
        this._accTime = 0;
        this._playing = false;
        this._playCount = 0;

        this._emitCacheCompleteEvent();

        return;
      }

      this._accTime = 0;
      frameIdx = 0;

      this._emitCacheCompleteEvent();
    }

    this._curFrame = frames[frameIdx];
  },
  onDestroy: function onDestroy() {
    this._super();

    this._inited = false;

    if (!CC_EDITOR) {
      if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
        this._armatureCache.dispose();

        this._armatureCache = null;
        this._armature = null;
      } else if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
        this._armatureCache = null;
        this._armature = null;
      } else if (this._armature) {
        this._armature.dispose();

        this._armature = null;
      }
    } else {
      if (this._armature) {
        this._armature.dispose();

        this._armature = null;
      }
    }
  },
  _updateDebugDraw: function _updateDebugDraw() {
    if (this.debugBones) {
      if (!this._debugDraw) {
        var debugDrawNode = new cc.PrivateNode();
        debugDrawNode.name = 'DEBUG_DRAW_NODE';
        var debugDraw = debugDrawNode.addComponent(Graphics);
        debugDraw.lineWidth = 1;
        debugDraw.strokeColor = cc.color(255, 0, 0, 255);
        this._debugDraw = debugDraw;
      }

      this._debugDraw.node.parent = this.node;
    } else if (this._debugDraw) {
      this._debugDraw.node.parent = null;
    }
  },
  _buildArmature: function _buildArmature() {
    if (!this.dragonAsset || !this.dragonAtlasAsset || !this.armatureName) return; // Switch Asset or Atlas or cacheMode will rebuild armature.

    if (this._armature) {
      // dispose pre build armature
      if (!CC_EDITOR) {
        if (this._preCacheMode === AnimationCacheMode.PRIVATE_CACHE) {
          this._armatureCache.dispose();
        } else if (this._preCacheMode === AnimationCacheMode.REALTIME) {
          this._armature.dispose();
        }
      } else {
        this._armature.dispose();
      }

      this._armatureCache = null;
      this._armature = null;
      this._displayProxy = null;
      this._frameCache = null;
      this._curFrame = null;
      this._playing = false;
      this._preCacheMode = null;
    }

    if (!CC_EDITOR) {
      if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
        this._armatureCache = ArmatureCache.sharedCache;
      } else if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
        this._armatureCache = new ArmatureCache();

        this._armatureCache.enablePrivateMode();
      }
    }

    var atlasUUID = this.dragonAtlasAsset._uuid;
    this._armatureKey = this.dragonAsset.init(this._factory, atlasUUID);

    if (this.isAnimationCached()) {
      this._armature = this._armatureCache.getArmatureCache(this.armatureName, this._armatureKey, atlasUUID);

      if (!this._armature) {
        // Cache fail,swith to REALTIME cache mode.
        this._cacheMode = AnimationCacheMode.REALTIME;
      }
    }

    this._preCacheMode = this._cacheMode;

    if (CC_EDITOR || this._cacheMode === AnimationCacheMode.REALTIME) {
      this._displayProxy = this._factory.buildArmatureDisplay(this.armatureName, this._armatureKey, "", atlasUUID);
      if (!this._displayProxy) return;
      this._displayProxy._ccNode = this.node;

      this._displayProxy.setEventTarget(this._eventTarget);

      this._armature = this._displayProxy._armature;
      this._armature.animation.timeScale = this.timeScale; // If change mode or armature, armature must insert into clock.

      this._factory._dragonBones.clock.add(this._armature);
    }

    if (this._cacheMode !== AnimationCacheMode.REALTIME && this.debugBones) {
      cc.warn("Debug bones is invalid in cached mode");
    }

    if (this._armature) {
      var armatureData = this._armature.armatureData;
      var aabb = armatureData.aabb;
      this.node.setContentSize(aabb.width, aabb.height);
    }

    this._updateBatch();

    this.attachUtil.init(this);

    this.attachUtil._associateAttachedNode();

    if (this.animationName) {
      this.playAnimation(this.animationName, this.playTimes);
    }

    this.markForRender(true);
  },
  _parseDragonAtlasAsset: function _parseDragonAtlasAsset() {
    if (this.dragonAtlasAsset) {
      this.dragonAtlasAsset.init(this._factory);
    }
  },
  _refresh: function _refresh() {
    this._buildArmature();

    if (CC_EDITOR) {
      // update inspector
      this._updateArmatureEnum();

      this._updateAnimEnum();

      this._updateCacheModeEnum();

      Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
    }
  },
  _updateCacheModeEnum: CC_EDITOR && function () {
    if (this._armature) {
      setEnumAttr(this, '_defaultCacheMode', AnimationCacheMode);
    } else {
      setEnumAttr(this, '_defaultCacheMode', DefaultCacheMode);
    }
  },
  // update animation list for editor
  _updateAnimEnum: CC_EDITOR && function () {
    var animEnum;

    if (this.dragonAsset) {
      animEnum = this.dragonAsset.getAnimsEnum(this.armatureName);
    } // change enum


    setEnumAttr(this, '_animationIndex', animEnum || DefaultAnimsEnum);
  },
  // update armature list for editor
  _updateArmatureEnum: CC_EDITOR && function () {
    var armatureEnum;

    if (this.dragonAsset) {
      armatureEnum = this.dragonAsset.getArmatureEnum();
    } // change enum


    setEnumAttr(this, '_defaultArmatureIndex', armatureEnum || DefaultArmaturesEnum);
  },

  /**
   * !#en
   * Play the specified animation.
   * Parameter animName specify the animation name.
   * Parameter playTimes specify the repeat times of the animation.
   * -1 means use the value of the config file.
   * 0 means play the animation for ever.
   * >0 means repeat times.
   * !#zh 
   * 播放指定的动画.
   * animName 指定播放动画的名称。
   * playTimes 指定播放动画的次数。
   * -1 为使用配置文件中的次数。
   * 0 为无限循环播放。
   * >0 为动画的重复次数。
   * @method playAnimation
   * @param {String} animName
   * @param {Number} playTimes
   * @return {dragonBones.AnimationState}
   */
  playAnimation: function playAnimation(animName, playTimes) {
    this.playTimes = playTimes === undefined ? -1 : playTimes;
    this.animationName = animName;

    if (this.isAnimationCached()) {
      var cache = this._armatureCache.getAnimationCache(this._armatureKey, animName);

      if (!cache) {
        cache = this._armatureCache.initAnimationCache(this._armatureKey, animName);
      }

      if (cache) {
        this._accTime = 0;
        this._playCount = 0;
        this._frameCache = cache;

        if (this.attachUtil._hasAttachedNode()) {
          this._frameCache.enableCacheAttachedInfo();
        }

        this._frameCache.updateToFrame(0);

        this._playing = true;
        this._curFrame = this._frameCache.frames[0];
      }
    } else {
      if (this._armature) {
        return this._armature.animation.play(animName, this.playTimes);
      }
    }
  },

  /**
   * !#en
   * Updating an animation cache to calculate all frame data in the animation is a cost in 
   * performance due to calculating all data in a single frame.
   * To update the cache, use the invalidAnimationCache method with high performance.
   * !#zh
   * 更新某个动画缓存, 预计算动画中所有帧数据，由于在单帧计算所有数据，所以较消耗性能。
   * 若想更新缓存，可使用 invalidAnimationCache 方法，具有较高性能。
   * @method updateAnimationCache
   * @param {String} animName
   */
  updateAnimationCache: function updateAnimationCache(animName) {
    if (!this.isAnimationCached()) return;

    this._armatureCache.updateAnimationCache(this._armatureKey, animName);
  },

  /**
   * !#en
   * Invalidates the animation cache, which is then recomputed on each frame..
   * !#zh
   * 使动画缓存失效，之后会在每帧重新计算。
   * @method invalidAnimationCache
   */
  invalidAnimationCache: function invalidAnimationCache() {
    if (!this.isAnimationCached()) return;

    this._armatureCache.invalidAnimationCache(this._armatureKey);
  },

  /**
   * !#en
   * Get the all armature names in the DragonBones Data.
   * !#zh
   * 获取 DragonBones 数据中所有的 armature 名称
   * @method getArmatureNames
   * @returns {Array}
   */
  getArmatureNames: function getArmatureNames() {
    var dragonBonesData = this._factory.getDragonBonesData(this._armatureKey);

    return dragonBonesData && dragonBonesData.armatureNames || [];
  },

  /**
   * !#en
   * Get the all animation names of specified armature.
   * !#zh
   * 获取指定的 armature 的所有动画名称。
   * @method getAnimationNames
   * @param {String} armatureName
   * @returns {Array}
   */
  getAnimationNames: function getAnimationNames(armatureName) {
    var ret = [];

    var dragonBonesData = this._factory.getDragonBonesData(this._armatureKey);

    if (dragonBonesData) {
      var armatureData = dragonBonesData.getArmature(armatureName);

      if (armatureData) {
        for (var animName in armatureData.animations) {
          if (armatureData.animations.hasOwnProperty(animName)) {
            ret.push(animName);
          }
        }
      }
    }

    return ret;
  },

  /**
   * !#en
   * Add event listener for the DragonBones Event, the same to addEventListener.
   * !#zh
   * 添加 DragonBones 事件监听器，与 addEventListener 作用相同。
   * @method on
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} listener - The callback that will be invoked when the event is dispatched.
   * @param {Event} listener.event event
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   */
  on: function on(eventType, listener, target) {
    this.addEventListener(eventType, listener, target);
  },

  /**
   * !#en
   * Remove the event listener for the DragonBones Event, the same to removeEventListener.
   * !#zh
   * 移除 DragonBones 事件监听器，与 removeEventListener 作用相同。
   * @method off
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} [listener]
   * @param {Object} [target]
   */
  off: function off(eventType, listener, target) {
    this.removeEventListener(eventType, listener, target);
  },

  /**
   * !#en
   * Add DragonBones one-time event listener, the callback will remove itself after the first time it is triggered.
   * !#zh
   * 添加 DragonBones 一次性事件监听器，回调会在第一时间被触发后删除自身。
   * @method once
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} listener - The callback that will be invoked when the event is dispatched.
   * @param {Event} listener.event event
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   */
  once: function once(eventType, listener, target) {
    this._eventTarget.once(eventType, listener, target);
  },

  /**
   * !#en
   * Add event listener for the DragonBones Event.
   * !#zh
   * 添加 DragonBones 事件监听器。
   * @method addEventListener
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} listener - The callback that will be invoked when the event is dispatched.
   * @param {Event} listener.event event
   * @param {Object} [target] - The target (this object) to invoke the callback, can be null
   */
  addEventListener: function addEventListener(eventType, listener, target) {
    this._eventTarget.on(eventType, listener, target);
  },

  /**
   * !#en
   * Remove the event listener for the DragonBones Event.
   * !#zh
   * 移除 DragonBones 事件监听器。
   * @method removeEventListener
   * @param {String} type - A string representing the event type to listen for.
   * @param {Function} [listener]
   * @param {Object} [target]
   */
  removeEventListener: function removeEventListener(eventType, listener, target) {
    this._eventTarget.off(eventType, listener, target);
  },

  /**
   * !#en
   * Build the armature for specified name.
   * !#zh
   * 构建指定名称的 armature 对象
   * @method buildArmature
   * @param {String} armatureName
   * @param {Node} node
   * @return {dragonBones.ArmatureDisplay}
   */
  buildArmature: function buildArmature(armatureName, node) {
    return this._factory.createArmatureNode(this, armatureName, node);
  },

  /**
   * !#en
   * Get the current armature object of the ArmatureDisplay.
   * !#zh
   * 获取 ArmatureDisplay 当前使用的 Armature 对象
   * @method armature
   * @returns {Object}
   */
  armature: function armature() {
    return this._armature;
  }
});
/**
 * !#en
 * Animation start play.
 * !#zh
 * 动画开始播放。
 *
 * @event dragonBones.EventObject.START
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation loop play complete once.
 * !#zh
 * 动画循环播放完成一次。
 *
 * @event dragonBones.EventObject.LOOP_COMPLETE
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation play complete.
 * !#zh
 * 动画播放完成。
 *
 * @event dragonBones.EventObject.COMPLETE
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation fade in start.
 * !#zh
 * 动画淡入开始。
 *
 * @event dragonBones.EventObject.FADE_IN
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation fade in complete.
 * !#zh
 * 动画淡入完成。
 *
 * @event dragonBones.EventObject.FADE_IN_COMPLETE
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation fade out start.
 * !#zh
 * 动画淡出开始。
 *
 * @event dragonBones.EventObject.FADE_OUT
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation fade out complete.
 * !#zh
 * 动画淡出完成。
 *
 * @event dragonBones.EventObject.FADE_OUT_COMPLETE
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 */

/**
 * !#en
 * Animation frame event.
 * !#zh
 * 动画帧事件。
 *
 * @event dragonBones.EventObject.FRAME_EVENT
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {String} [callback.event.name]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 * @param {dragonBones.Bone} [callback.event.bone]
 * @param {dragonBones.Slot} [callback.event.slot]
 */

/**
 * !#en
 * Animation frame sound event.
 * !#zh
 * 动画帧声音事件。
 *
 * @event dragonBones.EventObject.SOUND_EVENT
 * @param {String} type - A string representing the event type to listen for.
 * @param {Function} callback - The callback that will be invoked when the event is dispatched.
 *                              The callback is ignored if it is a duplicate (the callbacks are unique).
 * @param {dragonBones.EventObject} [callback.event]
 * @param {String} [callback.event.type]
 * @param {String} [callback.event.name]
 * @param {dragonBones.Armature} [callback.event.armature]
 * @param {dragonBones.AnimationState} [callback.event.animationState]
 * @param {dragonBones.Bone} [callback.event.bone]
 * @param {dragonBones.Slot} [callback.event.slot]
 */

module.exports = dragonBones.ArmatureDisplay = ArmatureDisplay;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFybWF0dXJlRGlzcGxheS5qcyJdLCJuYW1lcyI6WyJSZW5kZXJDb21wb25lbnQiLCJyZXF1aXJlIiwiRXZlbnRUYXJnZXQiLCJHcmFwaGljcyIsIlJlbmRlckZsb3ciLCJGTEFHX1BPU1RfUkVOREVSIiwiQXJtYXR1cmVDYWNoZSIsIkF0dGFjaFV0aWwiLCJEZWZhdWx0QXJtYXR1cmVzRW51bSIsImNjIiwiRW51bSIsIkRlZmF1bHRBbmltc0VudW0iLCJEZWZhdWx0Q2FjaGVNb2RlIiwiQW5pbWF0aW9uQ2FjaGVNb2RlIiwiUkVBTFRJTUUiLCJTSEFSRURfQ0FDSEUiLCJQUklWQVRFX0NBQ0hFIiwic2V0RW51bUF0dHIiLCJvYmoiLCJwcm9wTmFtZSIsImVudW1EZWYiLCJDbGFzcyIsIkF0dHIiLCJzZXRDbGFzc0F0dHIiLCJnZXRMaXN0IiwiQXJtYXR1cmVEaXNwbGF5IiwibmFtZSIsImVkaXRvciIsIkNDX0VESVRPUiIsIm1lbnUiLCJpbnNwZWN0b3IiLCJzdGF0aWNzIiwicHJvcGVydGllcyIsIl9mYWN0b3J5IiwidHlwZSIsImRyYWdvbkJvbmVzIiwiQ0NGYWN0b3J5Iiwic2VyaWFsaXphYmxlIiwiZHJhZ29uQXNzZXQiLCJEcmFnb25Cb25lc0Fzc2V0Iiwibm90aWZ5IiwiX3JlZnJlc2giLCJfZGVmYXVsdEFybWF0dXJlSW5kZXgiLCJfYW5pbWF0aW9uSW5kZXgiLCJ0b29sdGlwIiwiQ0NfREVWIiwiZHJhZ29uQXRsYXNBc3NldCIsIkRyYWdvbkJvbmVzQXRsYXNBc3NldCIsIl9wYXJzZURyYWdvbkF0bGFzQXNzZXQiLCJfYXJtYXR1cmVOYW1lIiwiYXJtYXR1cmVOYW1lIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJhbmltTmFtZXMiLCJnZXRBbmltYXRpb25OYW1lcyIsImFuaW1hdGlvbk5hbWUiLCJpbmRleE9mIiwiX2FybWF0dXJlIiwiaXNBbmltYXRpb25DYWNoZWQiLCJfZHJhZ29uQm9uZXMiLCJjbG9jayIsInJlbW92ZSIsImFkZCIsInZpc2libGUiLCJfYW5pbWF0aW9uTmFtZSIsImFybWF0dXJlc0VudW0iLCJnZXRBcm1hdHVyZUVudW0iLCJlcnJvcklEIiwidW5kZWZpbmVkIiwiZWRpdG9yT25seSIsImFuaW1hdGFibGUiLCJkaXNwbGF5TmFtZSIsImFuaW1zRW51bSIsImdldEFuaW1zRW51bSIsImFuaW1OYW1lIiwicGxheUFuaW1hdGlvbiIsInBsYXlUaW1lcyIsIl9wcmVDYWNoZU1vZGUiLCJfY2FjaGVNb2RlIiwiX2RlZmF1bHRDYWNoZU1vZGUiLCJjYW5DYWNoZSIsIndhcm4iLCJzZXRBbmltYXRpb25DYWNoZU1vZGUiLCJ0aW1lU2NhbGUiLCJhbmltYXRpb24iLCJwcmVtdWx0aXBsaWVkQWxwaGEiLCJkZWJ1Z0JvbmVzIiwiX3VwZGF0ZURlYnVnRHJhdyIsImVuYWJsZUJhdGNoIiwiX3VwZGF0ZUJhdGNoIiwiX2FybWF0dXJlS2V5IiwiX2FjY1RpbWUiLCJfcGxheUNvdW50IiwiX2ZyYW1lQ2FjaGUiLCJfY3VyRnJhbWUiLCJfcGxheWluZyIsIl9hcm1hdHVyZUNhY2hlIiwiY3RvciIsIl9ldmVudFRhcmdldCIsIl9tYXRlcmlhbENhY2hlIiwiX2luaXRlZCIsImF0dGFjaFV0aWwiLCJnZXRJbnN0YW5jZSIsIm9uTG9hZCIsImNoaWxkcmVuIiwibm9kZSIsImkiLCJuIiwibGVuZ3RoIiwiY2hpbGQiLCJwb3MiLCJfbmFtZSIsInNlYXJjaCIsImRlc3Ryb3kiLCJiYXNlTWF0ZXJpYWwiLCJnZXRNYXRlcmlhbCIsImRlZmluZSIsIl91cGRhdGVNYXRlcmlhbCIsImRpc2FibGVSZW5kZXIiLCJfc3VwZXIiLCJfcmVuZGVyRmxhZyIsIm1hcmtGb3JSZW5kZXIiLCJlbmFibGUiLCJfdmFsaWRhdGVSZW5kZXIiLCJ0ZXh0dXJlIiwibG9hZGVkIiwiX19wcmVsb2FkIiwiX2luaXQiLCJfcmVzZXRBc3NlbWJsZXIiLCJfYWN0aXZhdGVNYXRlcmlhbCIsImdldEFybWF0dXJlS2V5IiwiY2FjaGVNb2RlIiwiX2J1aWxkQXJtYXR1cmUiLCJvbkVuYWJsZSIsIm9uRGlzYWJsZSIsIl9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50IiwiZW1pdCIsIkV2ZW50T2JqZWN0IiwiTE9PUF9DT01QTEVURSIsIkNPTVBMRVRFIiwidXBkYXRlIiwiZHQiLCJmcmFtZUNhY2hlIiwiaXNJbml0ZWQiLCJmcmFtZXMiLCJpc0ludmFsaWQiLCJ1cGRhdGVUb0ZyYW1lIiwiZnJhbWVUaW1lIiwiRnJhbWVUaW1lIiwiU1RBUlQiLCJnbG9iYWxUaW1lU2NhbGUiLCJmcmFtZUlkeCIsIk1hdGgiLCJmbG9vciIsImlzQ29tcGxldGVkIiwib25EZXN0cm95IiwiZGlzcG9zZSIsIl9kZWJ1Z0RyYXciLCJkZWJ1Z0RyYXdOb2RlIiwiUHJpdmF0ZU5vZGUiLCJkZWJ1Z0RyYXciLCJhZGRDb21wb25lbnQiLCJsaW5lV2lkdGgiLCJzdHJva2VDb2xvciIsImNvbG9yIiwicGFyZW50IiwiX2Rpc3BsYXlQcm94eSIsInNoYXJlZENhY2hlIiwiZW5hYmxlUHJpdmF0ZU1vZGUiLCJhdGxhc1VVSUQiLCJfdXVpZCIsImluaXQiLCJnZXRBcm1hdHVyZUNhY2hlIiwiYnVpbGRBcm1hdHVyZURpc3BsYXkiLCJfY2NOb2RlIiwic2V0RXZlbnRUYXJnZXQiLCJhcm1hdHVyZURhdGEiLCJhYWJiIiwic2V0Q29udGVudFNpemUiLCJ3aWR0aCIsImhlaWdodCIsIl9hc3NvY2lhdGVBdHRhY2hlZE5vZGUiLCJfdXBkYXRlQXJtYXR1cmVFbnVtIiwiX3VwZGF0ZUFuaW1FbnVtIiwiX3VwZGF0ZUNhY2hlTW9kZUVudW0iLCJFZGl0b3IiLCJVdGlscyIsInJlZnJlc2hTZWxlY3RlZEluc3BlY3RvciIsInV1aWQiLCJhbmltRW51bSIsImFybWF0dXJlRW51bSIsImNhY2hlIiwiZ2V0QW5pbWF0aW9uQ2FjaGUiLCJpbml0QW5pbWF0aW9uQ2FjaGUiLCJfaGFzQXR0YWNoZWROb2RlIiwiZW5hYmxlQ2FjaGVBdHRhY2hlZEluZm8iLCJwbGF5IiwidXBkYXRlQW5pbWF0aW9uQ2FjaGUiLCJpbnZhbGlkQW5pbWF0aW9uQ2FjaGUiLCJnZXRBcm1hdHVyZU5hbWVzIiwiZHJhZ29uQm9uZXNEYXRhIiwiZ2V0RHJhZ29uQm9uZXNEYXRhIiwiYXJtYXR1cmVOYW1lcyIsInJldCIsImdldEFybWF0dXJlIiwiYW5pbWF0aW9ucyIsImhhc093blByb3BlcnR5IiwicHVzaCIsIm9uIiwiZXZlbnRUeXBlIiwibGlzdGVuZXIiLCJ0YXJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwib2ZmIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uY2UiLCJidWlsZEFybWF0dXJlIiwiY3JlYXRlQXJtYXR1cmVOb2RlIiwiYXJtYXR1cmUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsSUFBTUEsZUFBZSxHQUFHQyxPQUFPLENBQUMsaURBQUQsQ0FBL0I7O0FBQ0EsSUFBSUMsV0FBVyxHQUFHRCxPQUFPLENBQUMsdUNBQUQsQ0FBekI7O0FBQ0EsSUFBTUUsUUFBUSxHQUFHRixPQUFPLENBQUMsc0NBQUQsQ0FBeEI7O0FBQ0EsSUFBTUcsVUFBVSxHQUFHSCxPQUFPLENBQUMseUNBQUQsQ0FBMUI7O0FBQ0EsSUFBTUksZ0JBQWdCLEdBQUdELFVBQVUsQ0FBQ0MsZ0JBQXBDOztBQUVBLElBQUlDLGFBQWEsR0FBR0wsT0FBTyxDQUFDLGlCQUFELENBQTNCOztBQUNBLElBQUlNLFVBQVUsR0FBR04sT0FBTyxDQUFDLGNBQUQsQ0FBeEI7QUFFQTs7Ozs7QUFJQSxJQUFJTyxvQkFBb0IsR0FBR0MsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFBRSxhQUFXLENBQUM7QUFBZCxDQUFSLENBQTNCO0FBQ0EsSUFBSUMsZ0JBQWdCLEdBQUdGLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQUUsWUFBVTtBQUFaLENBQVIsQ0FBdkI7QUFDQSxJQUFJRSxnQkFBZ0IsR0FBR0gsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFBRSxjQUFZO0FBQWQsQ0FBUixDQUF2QjtBQUVBOzs7Ozs7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Ozs7QUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkFrSyxNQUFNLENBQUNDLE9BQVAsR0FBaUIxTCxXQUFXLENBQUNWLGVBQVosR0FBOEJBLGVBQS9DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBSZW5kZXJDb21wb25lbnQgPSByZXF1aXJlKCcuLi8uLi9jb2NvczJkL2NvcmUvY29tcG9uZW50cy9DQ1JlbmRlckNvbXBvbmVudCcpO1xubGV0IEV2ZW50VGFyZ2V0ID0gcmVxdWlyZSgnLi4vLi4vY29jb3MyZC9jb3JlL2V2ZW50L2V2ZW50LXRhcmdldCcpO1xuY29uc3QgR3JhcGhpY3MgPSByZXF1aXJlKCcuLi8uLi9jb2NvczJkL2NvcmUvZ3JhcGhpY3MvZ3JhcGhpY3MnKTtcbmNvbnN0IFJlbmRlckZsb3cgPSByZXF1aXJlKCcuLi8uLi9jb2NvczJkL2NvcmUvcmVuZGVyZXIvcmVuZGVyLWZsb3cnKTtcbmNvbnN0IEZMQUdfUE9TVF9SRU5ERVIgPSBSZW5kZXJGbG93LkZMQUdfUE9TVF9SRU5ERVI7XG5cbmxldCBBcm1hdHVyZUNhY2hlID0gcmVxdWlyZSgnLi9Bcm1hdHVyZUNhY2hlJyk7XG5sZXQgQXR0YWNoVXRpbCA9IHJlcXVpcmUoJy4vQXR0YWNoVXRpbCcpO1xuXG4vKipcbiAqIEBtb2R1bGUgZHJhZ29uQm9uZXNcbiAqL1xuXG5sZXQgRGVmYXVsdEFybWF0dXJlc0VudW0gPSBjYy5FbnVtKHsgJ2RlZmF1bHQnOiAtMSB9KTtcbmxldCBEZWZhdWx0QW5pbXNFbnVtID0gY2MuRW51bSh7ICc8Tm9uZT4nOiAwIH0pO1xubGV0IERlZmF1bHRDYWNoZU1vZGUgPSBjYy5FbnVtKHsgJ1JFQUxUSU1FJzogMCB9KTtcblxuLyoqXG4gKiAhI2VuIEVudW0gZm9yIGNhY2hlIG1vZGUgdHlwZS5cbiAqICEjemggRHJhZ29uYm9uZXPmuLLmn5PnsbvlnotcbiAqIEBlbnVtIEFybWF0dXJlRGlzcGxheS5BbmltYXRpb25DYWNoZU1vZGVcbiAqL1xubGV0IEFuaW1hdGlvbkNhY2hlTW9kZSA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHJlYWx0aW1lIG1vZGUuXG4gICAgICogISN6aCDlrp7ml7borqHnrpfmqKHlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUkVBTFRJTUVcbiAgICAgKi9cbiAgICBSRUFMVElNRTogMCxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBzaGFyZWQgY2FjaGUgbW9kZS5cbiAgICAgKiAhI3poIOWFseS6q+e8k+WtmOaooeW8j+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTSEFSRURfQ0FDSEVcbiAgICAgKi9cbiAgICBTSEFSRURfQ0FDSEU6IDEsXG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgcHJpdmF0ZSBjYWNoZSBtb2RlLlxuICAgICAqICEjemgg56eB5pyJ57yT5a2Y5qih5byP44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFBSSVZBVEVfQ0FDSEVcbiAgICAgKi9cbiAgICBQUklWQVRFX0NBQ0hFOiAyIFxufSk7XG5cbmZ1bmN0aW9uIHNldEVudW1BdHRyIChvYmosIHByb3BOYW1lLCBlbnVtRGVmKSB7XG4gICAgY2MuQ2xhc3MuQXR0ci5zZXRDbGFzc0F0dHIob2JqLCBwcm9wTmFtZSwgJ3R5cGUnLCAnRW51bScpO1xuICAgIGNjLkNsYXNzLkF0dHIuc2V0Q2xhc3NBdHRyKG9iaiwgcHJvcE5hbWUsICdlbnVtTGlzdCcsIGNjLkVudW0uZ2V0TGlzdChlbnVtRGVmKSk7XG59XG5cbi8qKlxuICogISNlblxuICogVGhlIEFybWF0dXJlIERpc3BsYXkgb2YgRHJhZ29uQm9uZXMgPGJyLz5cbiAqIDxici8+XG4gKiAoQXJtYXR1cmUgRGlzcGxheSBoYXMgYSByZWZlcmVuY2UgdG8gYSBEcmFnb25Cb25lc0Fzc2V0IGFuZCBzdG9yZXMgdGhlIHN0YXRlIGZvciBBcm1hdHVyZURpc3BsYXkgaW5zdGFuY2UsXG4gKiB3aGljaCBjb25zaXN0cyBvZiB0aGUgY3VycmVudCBwb3NlJ3MgYm9uZSBTUlQsIHNsb3QgY29sb3JzLCBhbmQgd2hpY2ggc2xvdCBhdHRhY2htZW50cyBhcmUgdmlzaWJsZS4gPGJyLz5cbiAqIE11bHRpcGxlIEFybWF0dXJlIERpc3BsYXkgY2FuIHVzZSB0aGUgc2FtZSBEcmFnb25Cb25lc0Fzc2V0IHdoaWNoIGluY2x1ZGVzIGFsbCBhbmltYXRpb25zLCBza2lucywgYW5kIGF0dGFjaG1lbnRzLikgPGJyLz5cbiAqICEjemhcbiAqIERyYWdvbkJvbmVzIOmqqOmqvOWKqOeUuyA8YnIvPlxuICogPGJyLz5cbiAqIChBcm1hdHVyZSBEaXNwbGF5IOWFt+acieWvuemqqOmqvOaVsOaNrueahOW8leeUqOW5tuS4lOWtmOWCqOS6humqqOmqvOWunuS+i+eahOeKtuaAge+8jFxuICog5a6D55Sx5b2T5YmN55qE6aqo6aq85Yqo5L2c77yMc2xvdCDpopzoibLvvIzlkozlj6/op4HnmoQgc2xvdCBhdHRhY2htZW50cyDnu4TmiJDjgII8YnIvPlxuICog5aSa5LiqIEFybWF0dXJlIERpc3BsYXkg5Y+v5Lul5L2/55So55u45ZCM55qE6aqo6aq85pWw5o2u77yM5YW25Lit5YyF5ous5omA5pyJ55qE5Yqo55S777yM55qu6IKk5ZKMIGF0dGFjaG1lbnRz44CCKTxici8+XG4gKlxuICogQGNsYXNzIEFybWF0dXJlRGlzcGxheVxuICogQGV4dGVuZHMgUmVuZGVyQ29tcG9uZW50XG4gKi9cbmxldCBBcm1hdHVyZURpc3BsYXkgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2RyYWdvbkJvbmVzLkFybWF0dXJlRGlzcGxheScsXG4gICAgZXh0ZW5kczogUmVuZGVyQ29tcG9uZW50LFxuXG4gICAgZWRpdG9yOiBDQ19FRElUT1IgJiYge1xuICAgICAgICBtZW51OiAnaTE4bjpNQUlOX01FTlUuY29tcG9uZW50LnJlbmRlcmVycy9EcmFnb25Cb25lcycsXG4gICAgICAgIGluc3BlY3RvcjogJ3BhY2thZ2VzOi8vaW5zcGVjdG9yL2luc3BlY3RvcnMvY29tcHMvc2tlbGV0b24yZC5qcycsXG4gICAgfSxcbiAgICBcbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIEFuaW1hdGlvbkNhY2hlTW9kZTogQW5pbWF0aW9uQ2FjaGVNb2RlLFxuICAgIH0sXG4gICAgXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBfZmFjdG9yeToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGRyYWdvbkJvbmVzLkNDRmFjdG9yeSxcbiAgICAgICAgICAgIHNlcmlhbGl6YWJsZTogZmFsc2UsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIERyYWdvbkJvbmVzIGRhdGEgY29udGFpbnMgdGhlIGFybWF0dXJlcyBpbmZvcm1hdGlvbiAoYmluZCBwb3NlIGJvbmVzLCBzbG90cywgZHJhdyBvcmRlcixcbiAgICAgICAgICogYXR0YWNobWVudHMsIHNraW5zLCBldGMpIGFuZCBhbmltYXRpb25zIGJ1dCBkb2VzIG5vdCBob2xkIGFueSBzdGF0ZS48YnIvPlxuICAgICAgICAgKiBNdWx0aXBsZSBBcm1hdHVyZURpc3BsYXkgY2FuIHNoYXJlIHRoZSBzYW1lIERyYWdvbkJvbmVzIGRhdGEuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6aqo6aq85pWw5o2u5YyF5ZCr5LqG6aqo6aq85L+h5oGv77yI57uR5a6a6aqo6aq85Yqo5L2c77yMc2xvdHPvvIzmuLLmn5Ppobrluo/vvIxcbiAgICAgICAgICogYXR0YWNobWVudHPvvIznmq7ogqTnrYnnrYnvvInlkozliqjnlLvkvYbkuI3mjIHmnInku7vkvZXnirbmgIHjgII8YnIvPlxuICAgICAgICAgKiDlpJrkuKogQXJtYXR1cmVEaXNwbGF5IOWPr+S7peWFseeUqOebuOWQjOeahOmqqOmqvOaVsOaNruOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0RyYWdvbkJvbmVzQXNzZXR9IGRyYWdvbkFzc2V0XG4gICAgICAgICAqL1xuICAgICAgICBkcmFnb25Bc3NldDoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGRyYWdvbkJvbmVzLkRyYWdvbkJvbmVzQXNzZXQsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2goKTtcbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRBcm1hdHVyZUluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYW5pbWF0aW9uSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmRyYWdvbl9ib25lcy5kcmFnb25fYm9uZXNfYXNzZXQnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGF0bGFzIGFzc2V0IGZvciB0aGUgRHJhZ29uQm9uZXMuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6aqo6aq85pWw5o2u5omA6ZyA55qEIEF0bGFzIFRleHR1cmUg5pWw5o2u44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7RHJhZ29uQm9uZXNBdGxhc0Fzc2V0fSBkcmFnb25BdGxhc0Fzc2V0XG4gICAgICAgICAqL1xuICAgICAgICBkcmFnb25BdGxhc0Fzc2V0OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogZHJhZ29uQm9uZXMuRHJhZ29uQm9uZXNBdGxhc0Fzc2V0LFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICAvLyBwYXJzZSB0aGUgYXRsYXMgYXNzZXQgZGF0YVxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlRHJhZ29uQXRsYXNBc3NldCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2goKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmRyYWdvbl9ib25lcy5kcmFnb25fYm9uZXNfYXRsYXNfYXNzZXQnXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2FybWF0dXJlTmFtZTogJycsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBuYW1lIG9mIGN1cnJlbnQgYXJtYXR1cmUuXG4gICAgICAgICAqICEjemgg5b2T5YmN55qEIEFybWF0dXJlIOWQjeensOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXJtYXR1cmVOYW1lXG4gICAgICAgICAqL1xuICAgICAgICBhcm1hdHVyZU5hbWU6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FybWF0dXJlTmFtZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVOYW1lID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgbGV0IGFuaW1OYW1lcyA9IHRoaXMuZ2V0QW5pbWF0aW9uTmFtZXModGhpcy5fYXJtYXR1cmVOYW1lKTtcblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5hbmltYXRpb25OYW1lIHx8IGFuaW1OYW1lcy5pbmRleE9mKHRoaXMuYW5pbWF0aW9uTmFtZSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uTmFtZSA9IGFuaW1OYW1lc1swXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdCB1c2UgZGVmYXVsdCBhbmltYXRpb24gbmFtZSBhdCBydW50aW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbk5hbWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hcm1hdHVyZSAmJiAhdGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZhY3RvcnkuX2RyYWdvbkJvbmVzLmNsb2NrLnJlbW92ZSh0aGlzLl9hcm1hdHVyZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVmcmVzaCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FybWF0dXJlICYmICF0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmFjdG9yeS5fZHJhZ29uQm9uZXMuY2xvY2suYWRkKHRoaXMuX2FybWF0dXJlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBfYW5pbWF0aW9uTmFtZTogJycsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBuYW1lIG9mIGN1cnJlbnQgcGxheWluZyBhbmltYXRpb24uXG4gICAgICAgICAqICEjemgg5b2T5YmN5pKt5pS+55qE5Yqo55S75ZCN56ew44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhbmltYXRpb25OYW1lXG4gICAgICAgICAqL1xuICAgICAgICBhbmltYXRpb25OYW1lOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25OYW1lO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hbmltYXRpb25OYW1lID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IF9kZWZhdWx0QXJtYXR1cmVJbmRleFxuICAgICAgICAgKi9cbiAgICAgICAgX2RlZmF1bHRBcm1hdHVyZUluZGV4OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICBsZXQgYXJtYXR1cmVOYW1lID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ29uQXNzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFybWF0dXJlc0VudW07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyYWdvbkFzc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcm1hdHVyZXNFbnVtID0gdGhpcy5kcmFnb25Bc3NldC5nZXRBcm1hdHVyZUVudW0oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWFybWF0dXJlc0VudW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYy5lcnJvcklEKDc0MDAsIHRoaXMubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhcm1hdHVyZU5hbWUgPSBhcm1hdHVyZXNFbnVtW3RoaXMuX2RlZmF1bHRBcm1hdHVyZUluZGV4XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYXJtYXR1cmVOYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcm1hdHVyZU5hbWUgPSBhcm1hdHVyZU5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjYy5lcnJvcklEKDc0MDEsIHRoaXMubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IERlZmF1bHRBcm1hdHVyZXNFbnVtLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWUsXG4gICAgICAgICAgICBhbmltYXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIkFybWF0dXJlXCIsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmRyYWdvbl9ib25lcy5hcm1hdHVyZV9uYW1lJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHZhbHVlIG9mIDAgcmVwcmVzZW50cyBubyBhbmltYXRpb25cbiAgICAgICAgX2FuaW1hdGlvbkluZGV4OiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAwLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYW5pbWF0aW9uSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb25OYW1lID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgYW5pbXNFbnVtO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyYWdvbkFzc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1zRW51bSA9IHRoaXMuZHJhZ29uQXNzZXQuZ2V0QW5pbXNFbnVtKHRoaXMuYXJtYXR1cmVOYW1lKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIWFuaW1zRW51bSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IGFuaW1OYW1lID0gYW5pbXNFbnVtW3RoaXMuX2FuaW1hdGlvbkluZGV4XTtcbiAgICAgICAgICAgICAgICBpZiAoYW5pbU5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXlBbmltYXRpb24oYW5pbU5hbWUsIHRoaXMucGxheVRpbWVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNzQwMiwgdGhpcy5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHlwZTogRGVmYXVsdEFuaW1zRW51bSxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICBlZGl0b3JPbmx5OiB0cnVlLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdBbmltYXRpb24nLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5kcmFnb25fYm9uZXMuYW5pbWF0aW9uX25hbWUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gUmVjb3JkIHByZSBjYWNoZSBtb2RlLlxuICAgICAgICBfcHJlQ2FjaGVNb2RlOiAtMSxcbiAgICAgICAgX2NhY2hlTW9kZTogQW5pbWF0aW9uQ2FjaGVNb2RlLlJFQUxUSU1FLFxuICAgICAgICBfZGVmYXVsdENhY2hlTW9kZToge1xuICAgICAgICAgICAgZGVmYXVsdDogMCxcbiAgICAgICAgICAgIHR5cGU6IEFuaW1hdGlvbkNhY2hlTW9kZSxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlZmF1bHRDYWNoZU1vZGUgIT09IEFuaW1hdGlvbkNhY2hlTW9kZS5SRUFMVElNRSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fYXJtYXR1cmUgJiYgIUFybWF0dXJlQ2FjaGUuY2FuQ2FjaGUodGhpcy5fYXJtYXR1cmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWZhdWx0Q2FjaGVNb2RlID0gQW5pbWF0aW9uQ2FjaGVNb2RlLlJFQUxUSU1FO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Mud2FybihcIkFuaW1hdGlvbiBjYWNoZSBtb2RlIGRvZXNuJ3Qgc3VwcG9ydCBza2VsZXRhbCBuZXN0aW5nXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uQ2FjaGVNb2RlKHRoaXMuX2RlZmF1bHRDYWNoZU1vZGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJBbmltYXRpb24gQ2FjaGUgTW9kZVwiLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5kcmFnb25fYm9uZXMuYW5pbWF0aW9uX2NhY2hlX21vZGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHRpbWUgc2NhbGUgb2YgdGhpcyBhcm1hdHVyZS5cbiAgICAgICAgICogISN6aCDlvZPliY3pqqjpqrzkuK3miYDmnInliqjnlLvnmoTml7bpl7TnvKnmlL7njofjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRpbWVTY2FsZVxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICB0aW1lU2NhbGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hcm1hdHVyZSAmJiAhdGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlLmFuaW1hdGlvbi50aW1lU2NhbGUgPSB0aGlzLnRpbWVTY2FsZTtcbiAgICAgICAgICAgICAgICB9ICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmRyYWdvbl9ib25lcy50aW1lX3NjYWxlJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBwbGF5IHRpbWVzIG9mIHRoZSBkZWZhdWx0IGFuaW1hdGlvbi5cbiAgICAgICAgICogICAgICAtMSBtZWFucyB1c2luZyB0aGUgdmFsdWUgb2YgY29uZmlnIGZpbGU7XG4gICAgICAgICAqICAgICAgMCBtZWFucyByZXBlYXQgZm9yIGV2ZXJcbiAgICAgICAgICogICAgICA+MCBtZWFucyByZXBlYXQgdGltZXNcbiAgICAgICAgICogISN6aCDmkq3mlL7pu5jorqTliqjnlLvnmoTlvqrnjq/mrKHmlbBcbiAgICAgICAgICogICAgICAtMSDooajnpLrkvb/nlKjphY3nva7mlofku7bkuK3nmoTpu5jorqTlgLw7XG4gICAgICAgICAqICAgICAgMCDooajnpLrml6DpmZDlvqrnjq9cbiAgICAgICAgICogICAgICA+MCDooajnpLrlvqrnjq/mrKHmlbBcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHBsYXlUaW1lc1xuICAgICAgICAgKiBAZGVmYXVsdCAtMVxuICAgICAgICAgKi9cbiAgICAgICAgcGxheVRpbWVzOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiAtMSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZHJhZ29uX2JvbmVzLnBsYXlfdGltZXMnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgdG8gZW5hYmxlIHByZW11bHRpcGxpZWQgYWxwaGEuXG4gICAgICAgICAqIFlvdSBzaG91bGQgZGlzYWJsZSB0aGlzIG9wdGlvbiB3aGVuIGltYWdlJ3MgdHJhbnNwYXJlbnQgYXJlYSBhcHBlYXJzIHRvIGhhdmUgb3BhcXVlIHBpeGVscyxcbiAgICAgICAgICogb3IgZW5hYmxlIHRoaXMgb3B0aW9uIHdoZW4gaW1hZ2UncyBoYWxmIHRyYW5zcGFyZW50IGFyZWEgYXBwZWFycyB0byBiZSBkYXJrZW4uXG4gICAgICAgICAqICEjemgg5piv5ZCm5ZCv55So6LS05Zu+6aKE5LmY44CCXG4gICAgICAgICAqIOW9k+WbvueJh+eahOmAj+aYjuWMuuWfn+WHuueOsOiJsuWdl+aXtumcgOimgeWFs+mXreivpemAiemhue+8jOW9k+WbvueJh+eahOWNiumAj+aYjuWMuuWfn+minOiJsuWPmOm7keaXtumcgOimgeWQr+eUqOivpemAiemhueOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHByZW11bHRpcGxpZWRBbHBoYVxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2tlbGV0b24ucHJlbXVsdGlwbGllZEFscGhhJ1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgb3BlbiBkZWJ1ZyBib25lcy5cbiAgICAgICAgICogISN6aCDmmK/lkKbmmL7npLogYm9uZSDnmoQgZGVidWcg5L+h5oGv44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVidWdCb25lc1xuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWdCb25lczoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURlYnVnRHJhdygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZHJhZ29uX2JvbmVzLmRlYnVnX2JvbmVzJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEVuYWJsZWQgYmF0Y2ggbW9kZWwsIGlmIHNrZWxldG9uIGlzIGNvbXBsZXgsIGRvIG5vdCBlbmFibGUgYmF0Y2gsIG9yIHdpbGwgbG93ZXIgcGVyZm9ybWFuY2UuXG4gICAgICAgICAqICEjemgg5byA5ZCv5ZCI5om577yM5aaC5p6c5riy5p+T5aSn6YeP55u45ZCM57q555CG77yM5LiU57uT5p6E566A5Y2V55qE6aqo6aq85Yqo55S777yM5byA5ZCv5ZCI5om55Y+v5Lul6ZmN5L2OZHJhd2NhbGzvvIzlkKbliJnor7fkuI3opoHlvIDlkK/vvIxjcHXmtojogJfkvJrkuIrljYfjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBlbmFibGVCYXRjaFxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZW5hYmxlQmF0Y2g6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVCYXRjaCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuZHJhZ29uX2JvbmVzLmVuYWJsZWRfYmF0Y2gnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gRHJhZ29uQm9uZXMgZGF0YSBzdG9yZSBrZXkuXG4gICAgICAgIF9hcm1hdHVyZUtleTogXCJcIixcblxuICAgICAgICAvLyBCZWxvdyBwcm9wZXJ0aWVzIHdpbGwgZWZmZWN0IHdoZW4gY2FjaGUgbW9kZSBpcyBTSEFSRURfQ0FDSEUgb3IgUFJJVkFURV9DQUNIRS5cbiAgICAgICAgLy8gYWNjdW11bGF0ZSB0aW1lXG4gICAgICAgIF9hY2NUaW1lOiAwLFxuICAgICAgICAvLyBQbGF5IHRpbWVzIGNvdW50ZXJcbiAgICAgICAgX3BsYXlDb3VudDogMCxcbiAgICAgICAgLy8gRnJhbWUgY2FjaGVcbiAgICAgICAgX2ZyYW1lQ2FjaGU6IG51bGwsXG4gICAgICAgIC8vIEN1ciBmcmFtZVxuICAgICAgICBfY3VyRnJhbWU6IG51bGwsXG4gICAgICAgIC8vIFBsYXlpbmcgZmxhZ1xuICAgICAgICBfcGxheWluZzogZmFsc2UsXG4gICAgICAgIC8vIEFybWF0dXJlIGNhY2hlXG4gICAgICAgIF9hcm1hdHVyZUNhY2hlOiBudWxsLFxuICAgIH0sXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgLy8gUHJvcGVydHkgX21hdGVyaWFsQ2FjaGUgVXNlIHRvIGNhY2hlIG1hdGVyaWFsLHNpbmNlIGRyYWdvbkJvbmVzIG1heSB1c2UgbXVsdGlwbGUgdGV4dHVyZSxcbiAgICAgICAgLy8gaXQgd2lsbCBjbG9uZSBmcm9tIHRoZSAnX21hdGVyaWFsJyBwcm9wZXJ0eSxpZiB0aGUgZHJhZ29uYm9uZXMgb25seSBoYXZlIG9uZSB0ZXh0dXJlLFxuICAgICAgICAvLyBpdCB3aWxsIGp1c3QgdXNlIHRoZSBfbWF0ZXJpYWwsd29uJ3QgY2xvbmUgaXQuXG4gICAgICAgIC8vIFNvIGlmIGludm9rZSBnZXRNYXRlcmlhbCxpdCBvbmx5IHJldHVybiBfbWF0ZXJpYWwsaWYgeW91IHdhbnQgdG8gY2hhbmdlIGFsbCBtYXRlcmlhbENhY2hlLFxuICAgICAgICAvLyB5b3UgY2FuIGNoYW5nZSBtYXRlcmlhbENhY2hlIGRpcmVjdGx5LlxuICAgICAgICB0aGlzLl9ldmVudFRhcmdldCA9IG5ldyBFdmVudFRhcmdldCgpO1xuICAgICAgICB0aGlzLl9tYXRlcmlhbENhY2hlID0ge307XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmF0dGFjaFV0aWwgPSBuZXcgQXR0YWNoVXRpbCgpO1xuICAgICAgICB0aGlzLl9mYWN0b3J5ID0gZHJhZ29uQm9uZXMuQ0NGYWN0b3J5LmdldEluc3RhbmNlKCk7XG4gICAgfSxcblxuICAgIG9uTG9hZCAoKSB7XG4gICAgICAgIC8vIEFkYXB0IHRvIG9sZCBjb2RlLHJlbW92ZSB1bnVzZSBjaGlsZCB3aGljaCBpcyBjcmVhdGVkIGJ5IG9sZCBjb2RlLlxuICAgICAgICAvLyBUaGlzIGxvZ2ljIGNhbiBiZSByZW1vdmUgYWZ0ZXIgMi4yIG9yIGxhdGVyLlxuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLm5vZGUuY2hpbGRyZW47XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGxldCBwb3MgPSBjaGlsZC5fbmFtZSAmJiBjaGlsZC5fbmFtZS5zZWFyY2goJ0NISUxEX0FSTUFUVVJFLScpO1xuICAgICAgICAgICAgaWYgKHBvcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBpZiBjaGFuZ2UgdXNlIGJhdGNoIG1vZGUsIGp1c3QgY2xlYXIgbWF0ZXJpYWwgY2FjaGVcbiAgICBfdXBkYXRlQmF0Y2ggKCkge1xuICAgICAgICBsZXQgYmFzZU1hdGVyaWFsID0gdGhpcy5nZXRNYXRlcmlhbCgwKTtcbiAgICAgICAgaWYgKGJhc2VNYXRlcmlhbCkge1xuICAgICAgICAgICAgYmFzZU1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX01PREVMJywgIXRoaXMuZW5hYmxlQmF0Y2gpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hdGVyaWFsQ2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAgLy8gb3ZlcnJpZGUgYmFzZSBjbGFzcyBfdXBkYXRlTWF0ZXJpYWwgdG8gc2V0IGRlZmluZSB2YWx1ZSBhbmQgY2xlYXIgbWF0ZXJpYWwgY2FjaGVcbiAgICBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBsZXQgYmFzZU1hdGVyaWFsID0gdGhpcy5nZXRNYXRlcmlhbCgwKTtcbiAgICAgICAgaWYgKGJhc2VNYXRlcmlhbCkge1xuICAgICAgICAgICAgYmFzZU1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX01PREVMJywgIXRoaXMuZW5hYmxlQmF0Y2gpO1xuICAgICAgICAgICAgYmFzZU1hdGVyaWFsLmRlZmluZSgnVVNFX1RFWFRVUkUnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXRlcmlhbENhY2hlID0ge307XG4gICAgfSxcblxuICAgIC8vIG92ZXJyaWRlIGJhc2UgY2xhc3MgZGlzYWJsZVJlbmRlciB0byBjbGVhciBwb3N0IHJlbmRlciBmbGFnXG4gICAgZGlzYWJsZVJlbmRlciAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyAmPSB+RkxBR19QT1NUX1JFTkRFUjtcbiAgICB9LFxuXG4gICAgLy8gb3ZlcnJpZGUgYmFzZSBjbGFzcyBkaXNhYmxlUmVuZGVyIHRvIGFkZCBwb3N0IHJlbmRlciBmbGFnXG4gICAgbWFya0ZvclJlbmRlciAoZW5hYmxlKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKGVuYWJsZSk7XG4gICAgICAgIGlmIChlbmFibGUpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5fcmVuZGVyRmxhZyB8PSBGTEFHX1BPU1RfUkVOREVSO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJGbGFnICY9IH5GTEFHX1BPU1RfUkVOREVSO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF92YWxpZGF0ZVJlbmRlciAoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlID0gdGhpcy5kcmFnb25BdGxhc0Fzc2V0ICYmIHRoaXMuZHJhZ29uQXRsYXNBc3NldC50ZXh0dXJlO1xuICAgICAgICBpZiAoIXRleHR1cmUgfHwgIXRleHR1cmUubG9hZGVkKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH0sXG5cbiAgICBfX3ByZWxvYWQgKCkge1xuICAgICAgICB0aGlzLl9pbml0KCk7XG4gICAgfSxcblxuICAgIF9pbml0ICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2luaXRlZCkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5fcmVzZXRBc3NlbWJsZXIoKTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVNYXRlcmlhbCgpO1xuICAgICAgICB0aGlzLl9wYXJzZURyYWdvbkF0bGFzQXNzZXQoKTtcbiAgICAgICAgdGhpcy5fcmVmcmVzaCgpO1xuXG4gICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMubm9kZS5jaGlsZHJlbjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkICYmIGNoaWxkLl9uYW1lID09PSBcIkRFQlVHX0RSQVdfTk9ERVwiKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZURlYnVnRHJhdygpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGtleSBvZiBkcmFnb25ib25lcyBjYWNoZSBkYXRhLCB3aGljaCBpcyByZWdhcmQgYXMgJ2RyYWdvbmJvbmVzTmFtZScsIHdoZW4geW91IHdhbnQgdG8gY2hhbmdlIGRyYWdvbmJvbmVzIGNsb3RoLlxuICAgICAqICEjemggXG4gICAgICog57yT5a2Y6b6Z6aqo5pWw5o2u55qEa2V55YC877yM5o2i6KOF55qE5pe25Lya5L2/55So5Yiw6K+l5YC877yM5L2c5Li6ZHJhZ29uYm9uZXNOYW1l5L2/55SoXG4gICAgICogQG1ldGhvZCBnZXRBcm1hdHVyZUtleVxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBmYWN0b3J5ID0gZHJhZ29uQm9uZXMuQ0NGYWN0b3J5LmdldEluc3RhbmNlKCk7XG4gICAgICogbGV0IG5lZWRDaGFuZ2VTbG90ID0gbmVlZENoYW5nZUFybWF0dXJlLmFybWF0dXJlKCkuZ2V0U2xvdChcImNoYW5nZVNsb3ROYW1lXCIpO1xuICAgICAqIGZhY3RvcnkucmVwbGFjZVNsb3REaXNwbGF5KHRvQ2hhbmdlQXJtYXR1cmUuZ2V0QXJtYXR1cmVLZXkoKSwgXCJhcm1hdHVyZU5hbWVcIiwgXCJzbG90TmFtZVwiLCBcImRpc3BsYXlOYW1lXCIsIG5lZWRDaGFuZ2VTbG90KTtcbiAgICAgKi9cbiAgICBnZXRBcm1hdHVyZUtleSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcm1hdHVyZUtleTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEl0J3MgYmVzdCB0byBzZXQgY2FjaGUgbW9kZSBiZWZvcmUgc2V0IHByb3BlcnR5ICdkcmFnb25Bc3NldCcsIG9yIHdpbGwgd2FzdGUgc29tZSBjcHUgdGltZS5cbiAgICAgKiBJZiBzZXQgdGhlIG1vZGUgaW4gZWRpdG9yLCB0aGVuIG5vIG5lZWQgdG8gd29ycnkgYWJvdXQgb3JkZXIgcHJvYmxlbS5cbiAgICAgKiAhI3poIFxuICAgICAqIOiLpeaDs+WIh+aNoua4suafk+aooeW8j++8jOacgOWlveWcqOiuvue9ridkcmFnb25Bc3NldCfkuYvliY3vvIzlhYjorr7nva7lpb3muLLmn5PmqKHlvI/vvIzlkKbliJnmnInov5DooYzml7blvIDplIDjgIJcbiAgICAgKiDoi6XlnKjnvJbovpHkuK3orr7nva7muLLmn5PmqKHlvI/vvIzliJnml6DpnIDmi4Xlv4Porr7nva7mrKHluo/nmoTpl67popjjgIJcbiAgICAgKiBcbiAgICAgKiBAbWV0aG9kIHNldEFuaW1hdGlvbkNhY2hlTW9kZVxuICAgICAqIEBwYXJhbSB7QW5pbWF0aW9uQ2FjaGVNb2RlfSBjYWNoZU1vZGVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGFybWF0dXJlRGlzcGxheS5zZXRBbmltYXRpb25DYWNoZU1vZGUoZHJhZ29uQm9uZXMuQXJtYXR1cmVEaXNwbGF5LkFuaW1hdGlvbkNhY2hlTW9kZS5TSEFSRURfQ0FDSEUpO1xuICAgICAqL1xuICAgIHNldEFuaW1hdGlvbkNhY2hlTW9kZSAoY2FjaGVNb2RlKSB7XG4gICAgICAgIGlmICh0aGlzLl9wcmVDYWNoZU1vZGUgIT09IGNhY2hlTW9kZSkge1xuICAgICAgICAgICAgdGhpcy5fY2FjaGVNb2RlID0gY2FjaGVNb2RlO1xuICAgICAgICAgICAgdGhpcy5fYnVpbGRBcm1hdHVyZSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBcbiAgICAvKipcbiAgICAgKiAhI2VuIFdoZXRoZXIgaW4gY2FjaGVkIG1vZGUuXG4gICAgICogISN6aCDlvZPliY3mmK/lkKblpITkuo7nvJPlrZjmqKHlvI/jgIJcbiAgICAgKiBAbWV0aG9kIGlzQW5pbWF0aW9uQ2FjaGVkXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0FuaW1hdGlvbkNhY2hlZCAoKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlTW9kZSAhPT0gQW5pbWF0aW9uQ2FjaGVNb2RlLlJFQUxUSU1FO1xuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIC8vIElmIGNhY2hlIG1vZGUgaXMgY2FjaGUsIG5vIG5lZWQgdG8gdXBkYXRlIGJ5IGRyYWdvbmJvbmVzIGxpYnJhcnkuXG4gICAgICAgIGlmICh0aGlzLl9hcm1hdHVyZSAmJiAhdGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLl9mYWN0b3J5Ll9kcmFnb25Cb25lcy5jbG9jay5hZGQodGhpcy5fYXJtYXR1cmUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uRGlzYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIC8vIElmIGNhY2hlIG1vZGUgaXMgY2FjaGUsIG5vIG5lZWQgdG8gdXBkYXRlIGJ5IGRyYWdvbmJvbmVzIGxpYnJhcnkuXG4gICAgICAgIGlmICh0aGlzLl9hcm1hdHVyZSAmJiAhdGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLl9mYWN0b3J5Ll9kcmFnb25Cb25lcy5jbG9jay5yZW1vdmUodGhpcy5fYXJtYXR1cmUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50ICgpIHtcbiAgICAgICAgLy8gQW5pbWF0aW9uIGxvb3AgY29tcGxldGUsIHRoZSBldmVudCBkaWZmcmVudCBmcm9tIGRyYWdvbmJvbmVzIGlubmVyIGV2ZW50LFxuICAgICAgICAvLyBJdCBoYXMgbm8gZXZlbnQgb2JqZWN0LlxuICAgICAgICB0aGlzLl9ldmVudFRhcmdldC5lbWl0KGRyYWdvbkJvbmVzLkV2ZW50T2JqZWN0LkxPT1BfQ09NUExFVEUpO1xuXG4gICAgICAgIC8vIEFuaW1hdGlvbiBjb21wbGV0ZSB0aGUgZXZlbnQgZGlmZnJlbnQgZnJvbSBkcmFnb25ib25lcyBpbm5lciBldmVudCxcbiAgICAgICAgLy8gSXQgaGFzIG5vIGV2ZW50IG9iamVjdC5cbiAgICAgICAgdGhpcy5fZXZlbnRUYXJnZXQuZW1pdChkcmFnb25Cb25lcy5FdmVudE9iamVjdC5DT01QTEVURSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZSAoZHQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHJldHVybjtcbiAgICAgICAgaWYgKCF0aGlzLl9mcmFtZUNhY2hlKSByZXR1cm47XG5cbiAgICAgICAgbGV0IGZyYW1lQ2FjaGUgPSB0aGlzLl9mcmFtZUNhY2hlO1xuICAgICAgICBpZiAoIWZyYW1lQ2FjaGUuaXNJbml0ZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBsZXQgZnJhbWVzID0gZnJhbWVDYWNoZS5mcmFtZXM7XG4gICAgICAgIGlmICghdGhpcy5fcGxheWluZykge1xuICAgICAgICAgICAgaWYgKGZyYW1lQ2FjaGUuaXNJbnZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICBmcmFtZUNhY2hlLnVwZGF0ZVRvRnJhbWUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJGcmFtZSA9IGZyYW1lc1tmcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZnJhbWVUaW1lID0gQXJtYXR1cmVDYWNoZS5GcmFtZVRpbWU7XG5cbiAgICAgICAgLy8gQW5pbWF0aW9uIFN0YXJ0LCB0aGUgZXZlbnQgZGlmZnJlbnQgZnJvbSBkcmFnb25ib25lcyBpbm5lciBldmVudCxcbiAgICAgICAgLy8gSXQgaGFzIG5vIGV2ZW50IG9iamVjdC5cbiAgICAgICAgaWYgKHRoaXMuX2FjY1RpbWUgPT0gMCAmJiB0aGlzLl9wbGF5Q291bnQgPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRUYXJnZXQuZW1pdChkcmFnb25Cb25lcy5FdmVudE9iamVjdC5TVEFSVCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZ2xvYmFsVGltZVNjYWxlID0gZHJhZ29uQm9uZXMudGltZVNjYWxlO1xuICAgICAgICB0aGlzLl9hY2NUaW1lICs9IGR0ICogdGhpcy50aW1lU2NhbGUgKiBnbG9iYWxUaW1lU2NhbGU7XG4gICAgICAgIGxldCBmcmFtZUlkeCA9IE1hdGguZmxvb3IodGhpcy5fYWNjVGltZSAvIGZyYW1lVGltZSk7XG4gICAgICAgIGlmICghZnJhbWVDYWNoZS5pc0NvbXBsZXRlZCkge1xuICAgICAgICAgICAgZnJhbWVDYWNoZS51cGRhdGVUb0ZyYW1lKGZyYW1lSWR4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmcmFtZUNhY2hlLmlzQ29tcGxldGVkICYmIGZyYW1lSWR4ID49IGZyYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsYXlDb3VudCArKztcbiAgICAgICAgICAgIGlmICgodGhpcy5wbGF5VGltZXMgPiAwICYmIHRoaXMuX3BsYXlDb3VudCA+PSB0aGlzLnBsYXlUaW1lcykpIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgZnJhbWUgdG8gZW5kIGZyYW1lLlxuICAgICAgICAgICAgICAgIHRoaXMuX2N1ckZyYW1lID0gZnJhbWVzW2ZyYW1lcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hY2NUaW1lID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGxheUNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYWNjVGltZSA9IDA7XG4gICAgICAgICAgICBmcmFtZUlkeCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jdXJGcmFtZSA9IGZyYW1lc1tmcmFtZUlkeF07XG4gICAgfSxcblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMuX2luaXRlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGVNb2RlID09PSBBbmltYXRpb25DYWNoZU1vZGUuUFJJVkFURV9DQUNIRSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlQ2FjaGUuZGlzcG9zZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlQ2FjaGUgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fY2FjaGVNb2RlID09PSBBbmltYXRpb25DYWNoZU1vZGUuU0hBUkVEX0NBQ0hFKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVDYWNoZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmUgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9hcm1hdHVyZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcm1hdHVyZSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYXJtYXR1cmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcm1hdHVyZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmUgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVEZWJ1Z0RyYXcgKCkge1xuICAgICAgICBpZiAodGhpcy5kZWJ1Z0JvbmVzKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RlYnVnRHJhdykge1xuICAgICAgICAgICAgICAgIGxldCBkZWJ1Z0RyYXdOb2RlID0gbmV3IGNjLlByaXZhdGVOb2RlKCk7XG4gICAgICAgICAgICAgICAgZGVidWdEcmF3Tm9kZS5uYW1lID0gJ0RFQlVHX0RSQVdfTk9ERSc7XG4gICAgICAgICAgICAgICAgbGV0IGRlYnVnRHJhdyA9IGRlYnVnRHJhd05vZGUuYWRkQ29tcG9uZW50KEdyYXBoaWNzKTtcbiAgICAgICAgICAgICAgICBkZWJ1Z0RyYXcubGluZVdpZHRoID0gMTtcbiAgICAgICAgICAgICAgICBkZWJ1Z0RyYXcuc3Ryb2tlQ29sb3IgPSBjYy5jb2xvcigyNTUsIDAsIDAsIDI1NSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVidWdEcmF3ID0gZGVidWdEcmF3O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0RyYXcubm9kZS5wYXJlbnQgPSB0aGlzLm5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fZGVidWdEcmF3KSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z0RyYXcubm9kZS5wYXJlbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9idWlsZEFybWF0dXJlICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRyYWdvbkFzc2V0IHx8ICF0aGlzLmRyYWdvbkF0bGFzQXNzZXQgfHwgIXRoaXMuYXJtYXR1cmVOYW1lKSByZXR1cm47XG5cbiAgICAgICAgLy8gU3dpdGNoIEFzc2V0IG9yIEF0bGFzIG9yIGNhY2hlTW9kZSB3aWxsIHJlYnVpbGQgYXJtYXR1cmUuXG4gICAgICAgIGlmICh0aGlzLl9hcm1hdHVyZSkge1xuICAgICAgICAgICAgLy8gZGlzcG9zZSBwcmUgYnVpbGQgYXJtYXR1cmVcbiAgICAgICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3ByZUNhY2hlTW9kZSA9PT0gQW5pbWF0aW9uQ2FjaGVNb2RlLlBSSVZBVEVfQ0FDSEUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVDYWNoZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9wcmVDYWNoZU1vZGUgPT09IEFuaW1hdGlvbkNhY2hlTW9kZS5SRUFMVElNRSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hcm1hdHVyZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcm1hdHVyZS5kaXNwb3NlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlQ2FjaGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheVByb3h5ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ2FjaGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fY3VyRnJhbWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fcGxheWluZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5fcHJlQ2FjaGVNb2RlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2FjaGVNb2RlID09PSBBbmltYXRpb25DYWNoZU1vZGUuU0hBUkVEX0NBQ0hFKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVDYWNoZSA9IEFybWF0dXJlQ2FjaGUuc2hhcmVkQ2FjaGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2NhY2hlTW9kZSA9PT0gQW5pbWF0aW9uQ2FjaGVNb2RlLlBSSVZBVEVfQ0FDSEUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hcm1hdHVyZUNhY2hlID0gbmV3IEFybWF0dXJlQ2FjaGU7XG4gICAgICAgICAgICAgICAgdGhpcy5fYXJtYXR1cmVDYWNoZS5lbmFibGVQcml2YXRlTW9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGF0bGFzVVVJRCA9IHRoaXMuZHJhZ29uQXRsYXNBc3NldC5fdXVpZDtcbiAgICAgICAgdGhpcy5fYXJtYXR1cmVLZXkgPSB0aGlzLmRyYWdvbkFzc2V0LmluaXQodGhpcy5fZmFjdG9yeSwgYXRsYXNVVUlEKTtcblxuICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLl9hcm1hdHVyZSA9IHRoaXMuX2FybWF0dXJlQ2FjaGUuZ2V0QXJtYXR1cmVDYWNoZSh0aGlzLmFybWF0dXJlTmFtZSwgdGhpcy5fYXJtYXR1cmVLZXksIGF0bGFzVVVJRCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2FybWF0dXJlKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2FjaGUgZmFpbCxzd2l0aCB0byBSRUFMVElNRSBjYWNoZSBtb2RlLlxuICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlTW9kZSA9IEFuaW1hdGlvbkNhY2hlTW9kZS5SRUFMVElNRTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgIH0gXG4gICAgICAgIFxuICAgICAgICB0aGlzLl9wcmVDYWNoZU1vZGUgPSB0aGlzLl9jYWNoZU1vZGU7XG4gICAgICAgIGlmIChDQ19FRElUT1IgfHwgdGhpcy5fY2FjaGVNb2RlID09PSBBbmltYXRpb25DYWNoZU1vZGUuUkVBTFRJTUUpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXlQcm94eSA9IHRoaXMuX2ZhY3RvcnkuYnVpbGRBcm1hdHVyZURpc3BsYXkodGhpcy5hcm1hdHVyZU5hbWUsIHRoaXMuX2FybWF0dXJlS2V5LCBcIlwiLCBhdGxhc1VVSUQpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9kaXNwbGF5UHJveHkpIHJldHVybjtcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BsYXlQcm94eS5fY2NOb2RlID0gdGhpcy5ub2RlO1xuICAgICAgICAgICAgdGhpcy5fZGlzcGxheVByb3h5LnNldEV2ZW50VGFyZ2V0KHRoaXMuX2V2ZW50VGFyZ2V0KTtcbiAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlID0gdGhpcy5fZGlzcGxheVByb3h5Ll9hcm1hdHVyZTtcbiAgICAgICAgICAgIHRoaXMuX2FybWF0dXJlLmFuaW1hdGlvbi50aW1lU2NhbGUgPSB0aGlzLnRpbWVTY2FsZTtcbiAgICAgICAgICAgIC8vIElmIGNoYW5nZSBtb2RlIG9yIGFybWF0dXJlLCBhcm1hdHVyZSBtdXN0IGluc2VydCBpbnRvIGNsb2NrLlxuICAgICAgICAgICAgdGhpcy5fZmFjdG9yeS5fZHJhZ29uQm9uZXMuY2xvY2suYWRkKHRoaXMuX2FybWF0dXJlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jYWNoZU1vZGUgIT09IEFuaW1hdGlvbkNhY2hlTW9kZS5SRUFMVElNRSAmJiB0aGlzLmRlYnVnQm9uZXMpIHtcbiAgICAgICAgICAgIGNjLndhcm4oXCJEZWJ1ZyBib25lcyBpcyBpbnZhbGlkIGluIGNhY2hlZCBtb2RlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2FybWF0dXJlKSB7XG4gICAgICAgICAgICBsZXQgYXJtYXR1cmVEYXRhID0gdGhpcy5fYXJtYXR1cmUuYXJtYXR1cmVEYXRhO1xuICAgICAgICAgICAgbGV0IGFhYmIgPSBhcm1hdHVyZURhdGEuYWFiYjtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRDb250ZW50U2l6ZShhYWJiLndpZHRoLCBhYWJiLmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl91cGRhdGVCYXRjaCgpO1xuICAgICAgICB0aGlzLmF0dGFjaFV0aWwuaW5pdCh0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRhY2hVdGlsLl9hc3NvY2lhdGVBdHRhY2hlZE5vZGUoKTtcblxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25OYW1lKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXlBbmltYXRpb24odGhpcy5hbmltYXRpb25OYW1lLCB0aGlzLnBsYXlUaW1lcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hcmtGb3JSZW5kZXIodHJ1ZSk7XG4gICAgfSxcblxuICAgIF9wYXJzZURyYWdvbkF0bGFzQXNzZXQgKCkge1xuICAgICAgICBpZiAodGhpcy5kcmFnb25BdGxhc0Fzc2V0KSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdvbkF0bGFzQXNzZXQuaW5pdCh0aGlzLl9mYWN0b3J5KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfcmVmcmVzaCAoKSB7XG4gICAgICAgIHRoaXMuX2J1aWxkQXJtYXR1cmUoKTtcblxuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAvLyB1cGRhdGUgaW5zcGVjdG9yXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVBcm1hdHVyZUVudW0oKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUFuaW1FbnVtKCk7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVDYWNoZU1vZGVFbnVtKCk7XG4gICAgICAgICAgICBFZGl0b3IuVXRpbHMucmVmcmVzaFNlbGVjdGVkSW5zcGVjdG9yKCdub2RlJywgdGhpcy5ub2RlLnV1aWQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVDYWNoZU1vZGVFbnVtOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fYXJtYXR1cmUpIHtcbiAgICAgICAgICAgIHNldEVudW1BdHRyKHRoaXMsICdfZGVmYXVsdENhY2hlTW9kZScsIEFuaW1hdGlvbkNhY2hlTW9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXRFbnVtQXR0cih0aGlzLCAnX2RlZmF1bHRDYWNoZU1vZGUnLCBEZWZhdWx0Q2FjaGVNb2RlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1cGRhdGUgYW5pbWF0aW9uIGxpc3QgZm9yIGVkaXRvclxuICAgIF91cGRhdGVBbmltRW51bTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGFuaW1FbnVtO1xuICAgICAgICBpZiAodGhpcy5kcmFnb25Bc3NldCkge1xuICAgICAgICAgICAgYW5pbUVudW0gPSB0aGlzLmRyYWdvbkFzc2V0LmdldEFuaW1zRW51bSh0aGlzLmFybWF0dXJlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hhbmdlIGVudW1cbiAgICAgICAgc2V0RW51bUF0dHIodGhpcywgJ19hbmltYXRpb25JbmRleCcsIGFuaW1FbnVtIHx8IERlZmF1bHRBbmltc0VudW0pO1xuICAgIH0sXG5cbiAgICAvLyB1cGRhdGUgYXJtYXR1cmUgbGlzdCBmb3IgZWRpdG9yXG4gICAgX3VwZGF0ZUFybWF0dXJlRW51bTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGFybWF0dXJlRW51bTtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ29uQXNzZXQpIHtcbiAgICAgICAgICAgIGFybWF0dXJlRW51bSA9IHRoaXMuZHJhZ29uQXNzZXQuZ2V0QXJtYXR1cmVFbnVtKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hhbmdlIGVudW1cbiAgICAgICAgc2V0RW51bUF0dHIodGhpcywgJ19kZWZhdWx0QXJtYXR1cmVJbmRleCcsIGFybWF0dXJlRW51bSB8fCBEZWZhdWx0QXJtYXR1cmVzRW51bSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBQbGF5IHRoZSBzcGVjaWZpZWQgYW5pbWF0aW9uLlxuICAgICAqIFBhcmFtZXRlciBhbmltTmFtZSBzcGVjaWZ5IHRoZSBhbmltYXRpb24gbmFtZS5cbiAgICAgKiBQYXJhbWV0ZXIgcGxheVRpbWVzIHNwZWNpZnkgdGhlIHJlcGVhdCB0aW1lcyBvZiB0aGUgYW5pbWF0aW9uLlxuICAgICAqIC0xIG1lYW5zIHVzZSB0aGUgdmFsdWUgb2YgdGhlIGNvbmZpZyBmaWxlLlxuICAgICAqIDAgbWVhbnMgcGxheSB0aGUgYW5pbWF0aW9uIGZvciBldmVyLlxuICAgICAqID4wIG1lYW5zIHJlcGVhdCB0aW1lcy5cbiAgICAgKiAhI3poIFxuICAgICAqIOaSreaUvuaMh+WumueahOWKqOeUuy5cbiAgICAgKiBhbmltTmFtZSDmjIflrprmkq3mlL7liqjnlLvnmoTlkI3np7DjgIJcbiAgICAgKiBwbGF5VGltZXMg5oyH5a6a5pKt5pS+5Yqo55S755qE5qyh5pWw44CCXG4gICAgICogLTEg5Li65L2/55So6YWN572u5paH5Lu25Lit55qE5qyh5pWw44CCXG4gICAgICogMCDkuLrml6DpmZDlvqrnjq/mkq3mlL7jgIJcbiAgICAgKiA+MCDkuLrliqjnlLvnmoTph43lpI3mrKHmlbDjgIJcbiAgICAgKiBAbWV0aG9kIHBsYXlBbmltYXRpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYW5pbU5hbWVcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcGxheVRpbWVzXG4gICAgICogQHJldHVybiB7ZHJhZ29uQm9uZXMuQW5pbWF0aW9uU3RhdGV9XG4gICAgICovXG4gICAgcGxheUFuaW1hdGlvbiAoYW5pbU5hbWUsIHBsYXlUaW1lcykge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5wbGF5VGltZXMgPSAocGxheVRpbWVzID09PSB1bmRlZmluZWQpID8gLTEgOiBwbGF5VGltZXM7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uTmFtZSA9IGFuaW1OYW1lO1xuXG4gICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIGxldCBjYWNoZSA9IHRoaXMuX2FybWF0dXJlQ2FjaGUuZ2V0QW5pbWF0aW9uQ2FjaGUodGhpcy5fYXJtYXR1cmVLZXksIGFuaW1OYW1lKTtcbiAgICAgICAgICAgIGlmICghY2FjaGUpIHtcbiAgICAgICAgICAgICAgICBjYWNoZSA9IHRoaXMuX2FybWF0dXJlQ2FjaGUuaW5pdEFuaW1hdGlvbkNhY2hlKHRoaXMuX2FybWF0dXJlS2V5LCBhbmltTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hY2NUaW1lID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5Q291bnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ2FjaGUgPSBjYWNoZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdHRhY2hVdGlsLl9oYXNBdHRhY2hlZE5vZGUoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcmFtZUNhY2hlLmVuYWJsZUNhY2hlQXR0YWNoZWRJbmZvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ2FjaGUudXBkYXRlVG9GcmFtZSgwKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJGcmFtZSA9IHRoaXMuX2ZyYW1lQ2FjaGUuZnJhbWVzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2FybWF0dXJlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FybWF0dXJlLmFuaW1hdGlvbi5wbGF5KGFuaW1OYW1lLCB0aGlzLnBsYXlUaW1lcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFVwZGF0aW5nIGFuIGFuaW1hdGlvbiBjYWNoZSB0byBjYWxjdWxhdGUgYWxsIGZyYW1lIGRhdGEgaW4gdGhlIGFuaW1hdGlvbiBpcyBhIGNvc3QgaW4gXG4gICAgICogcGVyZm9ybWFuY2UgZHVlIHRvIGNhbGN1bGF0aW5nIGFsbCBkYXRhIGluIGEgc2luZ2xlIGZyYW1lLlxuICAgICAqIFRvIHVwZGF0ZSB0aGUgY2FjaGUsIHVzZSB0aGUgaW52YWxpZEFuaW1hdGlvbkNhY2hlIG1ldGhvZCB3aXRoIGhpZ2ggcGVyZm9ybWFuY2UuXG4gICAgICogISN6aFxuICAgICAqIOabtOaWsOafkOS4quWKqOeUu+e8k+WtmCwg6aKE6K6h566X5Yqo55S75Lit5omA5pyJ5bin5pWw5o2u77yM55Sx5LqO5Zyo5Y2V5bin6K6h566X5omA5pyJ5pWw5o2u77yM5omA5Lul6L6D5raI6ICX5oCn6IO944CCXG4gICAgICog6Iul5oOz5pu05paw57yT5a2Y77yM5Y+v5L2/55SoIGludmFsaWRBbmltYXRpb25DYWNoZSDmlrnms5XvvIzlhbfmnInovoPpq5jmgKfog73jgIJcbiAgICAgKiBAbWV0aG9kIHVwZGF0ZUFuaW1hdGlvbkNhY2hlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGFuaW1OYW1lXG4gICAgICovXG4gICAgdXBkYXRlQW5pbWF0aW9uQ2FjaGUgKGFuaW1OYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2FybWF0dXJlQ2FjaGUudXBkYXRlQW5pbWF0aW9uQ2FjaGUodGhpcy5fYXJtYXR1cmVLZXksIGFuaW1OYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEludmFsaWRhdGVzIHRoZSBhbmltYXRpb24gY2FjaGUsIHdoaWNoIGlzIHRoZW4gcmVjb21wdXRlZCBvbiBlYWNoIGZyYW1lLi5cbiAgICAgKiAhI3poXG4gICAgICog5L2/5Yqo55S757yT5a2Y5aSx5pWI77yM5LmL5ZCO5Lya5Zyo5q+P5bin6YeN5paw6K6h566X44CCXG4gICAgICogQG1ldGhvZCBpbnZhbGlkQW5pbWF0aW9uQ2FjaGVcbiAgICAgKi9cbiAgICBpbnZhbGlkQW5pbWF0aW9uQ2FjaGUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9hcm1hdHVyZUNhY2hlLmludmFsaWRBbmltYXRpb25DYWNoZSh0aGlzLl9hcm1hdHVyZUtleSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIGFsbCBhcm1hdHVyZSBuYW1lcyBpbiB0aGUgRHJhZ29uQm9uZXMgRGF0YS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+WIERyYWdvbkJvbmVzIOaVsOaNruS4reaJgOacieeahCBhcm1hdHVyZSDlkI3np7BcbiAgICAgKiBAbWV0aG9kIGdldEFybWF0dXJlTmFtZXNcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgZ2V0QXJtYXR1cmVOYW1lcyAoKSB7XG4gICAgICAgIGxldCBkcmFnb25Cb25lc0RhdGEgPSB0aGlzLl9mYWN0b3J5LmdldERyYWdvbkJvbmVzRGF0YSh0aGlzLl9hcm1hdHVyZUtleSk7XG4gICAgICAgIHJldHVybiAoZHJhZ29uQm9uZXNEYXRhICYmIGRyYWdvbkJvbmVzRGF0YS5hcm1hdHVyZU5hbWVzKSB8fCBbXTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgYWxsIGFuaW1hdGlvbiBuYW1lcyBvZiBzcGVjaWZpZWQgYXJtYXR1cmUuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPluaMh+WumueahCBhcm1hdHVyZSDnmoTmiYDmnInliqjnlLvlkI3np7DjgIJcbiAgICAgKiBAbWV0aG9kIGdldEFuaW1hdGlvbk5hbWVzXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGFybWF0dXJlTmFtZVxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRBbmltYXRpb25OYW1lcyAoYXJtYXR1cmVOYW1lKSB7XG4gICAgICAgIGxldCByZXQgPSBbXTtcbiAgICAgICAgbGV0IGRyYWdvbkJvbmVzRGF0YSA9IHRoaXMuX2ZhY3RvcnkuZ2V0RHJhZ29uQm9uZXNEYXRhKHRoaXMuX2FybWF0dXJlS2V5KTtcbiAgICAgICAgaWYgKGRyYWdvbkJvbmVzRGF0YSkge1xuICAgICAgICAgICAgbGV0IGFybWF0dXJlRGF0YSA9IGRyYWdvbkJvbmVzRGF0YS5nZXRBcm1hdHVyZShhcm1hdHVyZU5hbWUpO1xuICAgICAgICAgICAgaWYgKGFybWF0dXJlRGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGFuaW1OYW1lIGluIGFybWF0dXJlRGF0YS5hbmltYXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhcm1hdHVyZURhdGEuYW5pbWF0aW9ucy5oYXNPd25Qcm9wZXJ0eShhbmltTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldC5wdXNoKGFuaW1OYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQWRkIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgRHJhZ29uQm9uZXMgRXZlbnQsIHRoZSBzYW1lIHRvIGFkZEV2ZW50TGlzdGVuZXIuXG4gICAgICogISN6aFxuICAgICAqIOa3u+WKoCBEcmFnb25Cb25lcyDkuovku7bnm5HlkKzlmajvvIzkuI4gYWRkRXZlbnRMaXN0ZW5lciDkvZznlKjnm7jlkIzjgIJcbiAgICAgKiBAbWV0aG9kIG9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGxpc3RlbmVyLmV2ZW50IGV2ZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsXG4gICAgICovXG4gICAgb24gKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHRhcmdldCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBsaXN0ZW5lciwgdGFyZ2V0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXIgZm9yIHRoZSBEcmFnb25Cb25lcyBFdmVudCwgdGhlIHNhbWUgdG8gcmVtb3ZlRXZlbnRMaXN0ZW5lci5cbiAgICAgKiAhI3poXG4gICAgICog56e76ZmkIERyYWdvbkJvbmVzIOS6i+S7tuebkeWQrOWZqO+8jOS4jiByZW1vdmVFdmVudExpc3RlbmVyIOS9nOeUqOebuOWQjOOAglxuICAgICAqIEBtZXRob2Qgb2ZmXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbbGlzdGVuZXJdXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdXG4gICAgICovXG4gICAgb2ZmIChldmVudFR5cGUsIGxpc3RlbmVyLCB0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHRhcmdldCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBBZGQgRHJhZ29uQm9uZXMgb25lLXRpbWUgZXZlbnQgbGlzdGVuZXIsIHRoZSBjYWxsYmFjayB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgdGhlIGZpcnN0IHRpbWUgaXQgaXMgdHJpZ2dlcmVkLlxuICAgICAqICEjemhcbiAgICAgKiDmt7vliqAgRHJhZ29uQm9uZXMg5LiA5qyh5oCn5LqL5Lu255uR5ZCs5Zmo77yM5Zue6LCD5Lya5Zyo56ys5LiA5pe26Ze06KKr6Kem5Y+R5ZCO5Yig6Zmk6Ieq6Lqr44CCXG4gICAgICogQG1ldGhvZCBvbmNlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGxpc3RlbmVyLmV2ZW50IGV2ZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsXG4gICAgICovXG4gICAgb25jZSAoZXZlbnRUeXBlLCBsaXN0ZW5lciwgdGFyZ2V0KSB7XG4gICAgICAgIHRoaXMuX2V2ZW50VGFyZ2V0Lm9uY2UoZXZlbnRUeXBlLCBsaXN0ZW5lciwgdGFyZ2V0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEFkZCBldmVudCBsaXN0ZW5lciBmb3IgdGhlIERyYWdvbkJvbmVzIEV2ZW50LlxuICAgICAqICEjemhcbiAgICAgKiDmt7vliqAgRHJhZ29uQm9uZXMg5LqL5Lu255uR5ZCs5Zmo44CCXG4gICAgICogQG1ldGhvZCBhZGRFdmVudExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IGxpc3RlbmVyLmV2ZW50IGV2ZW50XG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsXG4gICAgICovXG4gICAgYWRkRXZlbnRMaXN0ZW5lciAoZXZlbnRUeXBlLCBsaXN0ZW5lciwgdGFyZ2V0KSB7XG4gICAgICAgIHRoaXMuX2V2ZW50VGFyZ2V0Lm9uKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHRhcmdldCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZW1vdmUgdGhlIGV2ZW50IGxpc3RlbmVyIGZvciB0aGUgRHJhZ29uQm9uZXMgRXZlbnQuXG4gICAgICogISN6aFxuICAgICAqIOenu+mZpCBEcmFnb25Cb25lcyDkuovku7bnm5HlkKzlmajjgIJcbiAgICAgKiBAbWV0aG9kIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtsaXN0ZW5lcl1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF1cbiAgICAgKi9cbiAgICByZW1vdmVFdmVudExpc3RlbmVyIChldmVudFR5cGUsIGxpc3RlbmVyLCB0YXJnZXQpIHtcbiAgICAgICAgdGhpcy5fZXZlbnRUYXJnZXQub2ZmKGV2ZW50VHlwZSwgbGlzdGVuZXIsIHRhcmdldCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBCdWlsZCB0aGUgYXJtYXR1cmUgZm9yIHNwZWNpZmllZCBuYW1lLlxuICAgICAqICEjemhcbiAgICAgKiDmnoTlu7rmjIflrprlkI3np7DnmoQgYXJtYXR1cmUg5a+56LGhXG4gICAgICogQG1ldGhvZCBidWlsZEFybWF0dXJlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGFybWF0dXJlTmFtZVxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgICAqIEByZXR1cm4ge2RyYWdvbkJvbmVzLkFybWF0dXJlRGlzcGxheX1cbiAgICAgKi9cbiAgICBidWlsZEFybWF0dXJlIChhcm1hdHVyZU5hbWUsIG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhY3RvcnkuY3JlYXRlQXJtYXR1cmVOb2RlKHRoaXMsIGFybWF0dXJlTmFtZSwgbm9kZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIGN1cnJlbnQgYXJtYXR1cmUgb2JqZWN0IG9mIHRoZSBBcm1hdHVyZURpc3BsYXkuXG4gICAgICogISN6aFxuICAgICAqIOiOt+WPliBBcm1hdHVyZURpc3BsYXkg5b2T5YmN5L2/55So55qEIEFybWF0dXJlIOWvueixoVxuICAgICAqIEBtZXRob2QgYXJtYXR1cmVcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIGFybWF0dXJlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FybWF0dXJlO1xuICAgIH0sXG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBBbmltYXRpb24gc3RhcnQgcGxheS5cbiAqICEjemhcbiAqIOWKqOeUu+W8gOWni+aSreaUvuOAglxuICpcbiAqIEBldmVudCBkcmFnb25Cb25lcy5FdmVudE9iamVjdC5TVEFSVFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5FdmVudE9iamVjdH0gW2NhbGxiYWNrLmV2ZW50XVxuICogQHBhcmFtIHtTdHJpbmd9IFtjYWxsYmFjay5ldmVudC50eXBlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5Bcm1hdHVyZX0gW2NhbGxiYWNrLmV2ZW50LmFybWF0dXJlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5BbmltYXRpb25TdGF0ZX0gW2NhbGxiYWNrLmV2ZW50LmFuaW1hdGlvblN0YXRlXVxuICovXG5cbi8qKlxuICogISNlblxuICogQW5pbWF0aW9uIGxvb3AgcGxheSBjb21wbGV0ZSBvbmNlLlxuICogISN6aFxuICog5Yqo55S75b6q546v5pKt5pS+5a6M5oiQ5LiA5qyh44CCXG4gKlxuICogQGV2ZW50IGRyYWdvbkJvbmVzLkV2ZW50T2JqZWN0LkxPT1BfQ09NUExFVEVcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIGxpc3RlbiBmb3IuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgaXMgaWdub3JlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZSAodGhlIGNhbGxiYWNrcyBhcmUgdW5pcXVlKS5cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuRXZlbnRPYmplY3R9IFtjYWxsYmFjay5ldmVudF1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbY2FsbGJhY2suZXZlbnQudHlwZV1cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuQXJtYXR1cmV9IFtjYWxsYmFjay5ldmVudC5hcm1hdHVyZV1cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuQW5pbWF0aW9uU3RhdGV9IFtjYWxsYmFjay5ldmVudC5hbmltYXRpb25TdGF0ZV1cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIEFuaW1hdGlvbiBwbGF5IGNvbXBsZXRlLlxuICogISN6aFxuICog5Yqo55S75pKt5pS+5a6M5oiQ44CCXG4gKlxuICogQGV2ZW50IGRyYWdvbkJvbmVzLkV2ZW50T2JqZWN0LkNPTVBMRVRFXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkV2ZW50T2JqZWN0fSBbY2FsbGJhY2suZXZlbnRdXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NhbGxiYWNrLmV2ZW50LnR5cGVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFybWF0dXJlfSBbY2FsbGJhY2suZXZlbnQuYXJtYXR1cmVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFuaW1hdGlvblN0YXRlfSBbY2FsbGJhY2suZXZlbnQuYW5pbWF0aW9uU3RhdGVdXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBBbmltYXRpb24gZmFkZSBpbiBzdGFydC5cbiAqICEjemhcbiAqIOWKqOeUu+a3oeWFpeW8gOWni+OAglxuICpcbiAqIEBldmVudCBkcmFnb25Cb25lcy5FdmVudE9iamVjdC5GQURFX0lOXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkV2ZW50T2JqZWN0fSBbY2FsbGJhY2suZXZlbnRdXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NhbGxiYWNrLmV2ZW50LnR5cGVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFybWF0dXJlfSBbY2FsbGJhY2suZXZlbnQuYXJtYXR1cmVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFuaW1hdGlvblN0YXRlfSBbY2FsbGJhY2suZXZlbnQuYW5pbWF0aW9uU3RhdGVdXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBBbmltYXRpb24gZmFkZSBpbiBjb21wbGV0ZS5cbiAqICEjemhcbiAqIOWKqOeUu+a3oeWFpeWujOaIkOOAglxuICpcbiAqIEBldmVudCBkcmFnb25Cb25lcy5FdmVudE9iamVjdC5GQURFX0lOX0NPTVBMRVRFXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkV2ZW50T2JqZWN0fSBbY2FsbGJhY2suZXZlbnRdXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NhbGxiYWNrLmV2ZW50LnR5cGVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFybWF0dXJlfSBbY2FsbGJhY2suZXZlbnQuYXJtYXR1cmVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFuaW1hdGlvblN0YXRlfSBbY2FsbGJhY2suZXZlbnQuYW5pbWF0aW9uU3RhdGVdXG4gKi9cblxuLyoqXG4gKiAhI2VuXG4gKiBBbmltYXRpb24gZmFkZSBvdXQgc3RhcnQuXG4gKiAhI3poXG4gKiDliqjnlLvmt6Hlh7rlvIDlp4vjgIJcbiAqXG4gKiBAZXZlbnQgZHJhZ29uQm9uZXMuRXZlbnRPYmplY3QuRkFERV9PVVRcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIGxpc3RlbiBmb3IuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLlxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgaXMgaWdub3JlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZSAodGhlIGNhbGxiYWNrcyBhcmUgdW5pcXVlKS5cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuRXZlbnRPYmplY3R9IFtjYWxsYmFjay5ldmVudF1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbY2FsbGJhY2suZXZlbnQudHlwZV1cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuQXJtYXR1cmV9IFtjYWxsYmFjay5ldmVudC5hcm1hdHVyZV1cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuQW5pbWF0aW9uU3RhdGV9IFtjYWxsYmFjay5ldmVudC5hbmltYXRpb25TdGF0ZV1cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIEFuaW1hdGlvbiBmYWRlIG91dCBjb21wbGV0ZS5cbiAqICEjemhcbiAqIOWKqOeUu+a3oeWHuuWujOaIkOOAglxuICpcbiAqIEBldmVudCBkcmFnb25Cb25lcy5FdmVudE9iamVjdC5GQURFX09VVF9DT01QTEVURVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5FdmVudE9iamVjdH0gW2NhbGxiYWNrLmV2ZW50XVxuICogQHBhcmFtIHtTdHJpbmd9IFtjYWxsYmFjay5ldmVudC50eXBlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5Bcm1hdHVyZX0gW2NhbGxiYWNrLmV2ZW50LmFybWF0dXJlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5BbmltYXRpb25TdGF0ZX0gW2NhbGxiYWNrLmV2ZW50LmFuaW1hdGlvblN0YXRlXVxuICovXG5cbi8qKlxuICogISNlblxuICogQW5pbWF0aW9uIGZyYW1lIGV2ZW50LlxuICogISN6aFxuICog5Yqo55S75bin5LqL5Lu244CCXG4gKlxuICogQGV2ZW50IGRyYWdvbkJvbmVzLkV2ZW50T2JqZWN0LkZSQU1FX0VWRU5UXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXZlbnQgdHlwZSB0byBsaXN0ZW4gZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGludm9rZWQgd2hlbiB0aGUgZXZlbnQgaXMgZGlzcGF0Y2hlZC5cbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkV2ZW50T2JqZWN0fSBbY2FsbGJhY2suZXZlbnRdXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NhbGxiYWNrLmV2ZW50LnR5cGVdXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NhbGxiYWNrLmV2ZW50Lm5hbWVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFybWF0dXJlfSBbY2FsbGJhY2suZXZlbnQuYXJtYXR1cmVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkFuaW1hdGlvblN0YXRlfSBbY2FsbGJhY2suZXZlbnQuYW5pbWF0aW9uU3RhdGVdXG4gKiBAcGFyYW0ge2RyYWdvbkJvbmVzLkJvbmV9IFtjYWxsYmFjay5ldmVudC5ib25lXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5TbG90fSBbY2FsbGJhY2suZXZlbnQuc2xvdF1cbiAqL1xuXG4vKipcbiAqICEjZW5cbiAqIEFuaW1hdGlvbiBmcmFtZSBzb3VuZCBldmVudC5cbiAqICEjemhcbiAqIOWKqOeUu+W4p+WjsOmfs+S6i+S7tuOAglxuICpcbiAqIEBldmVudCBkcmFnb25Cb25lcy5FdmVudE9iamVjdC5TT1VORF9FVkVOVFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBjYWxsYmFjayBpcyBpZ25vcmVkIGlmIGl0IGlzIGEgZHVwbGljYXRlICh0aGUgY2FsbGJhY2tzIGFyZSB1bmlxdWUpLlxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5FdmVudE9iamVjdH0gW2NhbGxiYWNrLmV2ZW50XVxuICogQHBhcmFtIHtTdHJpbmd9IFtjYWxsYmFjay5ldmVudC50eXBlXVxuICogQHBhcmFtIHtTdHJpbmd9IFtjYWxsYmFjay5ldmVudC5uYW1lXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5Bcm1hdHVyZX0gW2NhbGxiYWNrLmV2ZW50LmFybWF0dXJlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5BbmltYXRpb25TdGF0ZX0gW2NhbGxiYWNrLmV2ZW50LmFuaW1hdGlvblN0YXRlXVxuICogQHBhcmFtIHtkcmFnb25Cb25lcy5Cb25lfSBbY2FsbGJhY2suZXZlbnQuYm9uZV1cbiAqIEBwYXJhbSB7ZHJhZ29uQm9uZXMuU2xvdH0gW2NhbGxiYWNrLmV2ZW50LnNsb3RdXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBkcmFnb25Cb25lcy5Bcm1hdHVyZURpc3BsYXkgPSBBcm1hdHVyZURpc3BsYXk7XG4iXX0=