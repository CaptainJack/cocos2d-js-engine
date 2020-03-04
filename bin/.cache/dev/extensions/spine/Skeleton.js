
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/spine/Skeleton.js';
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
var TrackEntryListeners = require('./track-entry-listeners');

var RenderComponent = require('../../cocos2d/core/components/CCRenderComponent');

var spine = require('./lib/spine');

var Graphics = require('../../cocos2d/core/graphics/graphics');

var RenderFlow = require('../../cocos2d/core/renderer/render-flow');

var FLAG_POST_RENDER = RenderFlow.FLAG_POST_RENDER;

var SkeletonCache = require('./skeleton-cache');

var AttachUtil = require('./AttachUtil');
/**
 * @module sp
 */


var DefaultSkinsEnum = cc.Enum({
  'default': -1
});
var DefaultAnimsEnum = cc.Enum({
  '<None>': 0
});
/**
 * !#en Enum for animation cache mode type.
 * !#zh Spine动画缓存类型
 * @enum Skeleton.AnimationCacheMode
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
 * The skeleton of Spine <br/>
 * <br/>
 * (Skeleton has a reference to a SkeletonData and stores the state for skeleton instance,
 * which consists of the current pose's bone SRT, slot colors, and which slot attachments are visible. <br/>
 * Multiple skeletons can use the same SkeletonData which includes all animations, skins, and attachments.) <br/>
 * !#zh
 * Spine 骨骼动画 <br/>
 * <br/>
 * (Skeleton 具有对骨骼数据的引用并且存储了骨骼实例的状态，
 * 它由当前的骨骼动作，slot 颜色，和可见的 slot attachments 组成。<br/>
 * 多个 Skeleton 可以使用相同的骨骼数据，其中包括所有的动画，皮肤和 attachments。
 *
 * @class Skeleton
 * @extends RenderComponent
 */


sp.Skeleton = cc.Class({
  name: 'sp.Skeleton',
  "extends": RenderComponent,
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.renderers/Spine Skeleton',
    help: 'app://docs/html/components/spine.html',
    inspector: 'packages://inspector/inspectors/comps/skeleton2d.js'
  },
  statics: {
    AnimationCacheMode: AnimationCacheMode
  },
  properties: {
    /**
     * !#en The skeletal animation is paused?
     * !#zh 该骨骼动画是否暂停。
     * @property paused
     * @type {Boolean}
     * @readOnly
     * @default false
     */
    paused: {
      "default": false,
      visible: false
    },

    /**
     * !#en
     * The skeleton data contains the skeleton information (bind pose bones, slots, draw order,
     * attachments, skins, etc) and animations but does not hold any state.<br/>
     * Multiple skeletons can share the same skeleton data.
     * !#zh
     * 骨骼数据包含了骨骼信息（绑定骨骼动作，slots，渲染顺序，
     * attachments，皮肤等等）和动画但不持有任何状态。<br/>
     * 多个 Skeleton 可以共用相同的骨骼数据。
     * @property {sp.SkeletonData} skeletonData
     */
    skeletonData: {
      "default": null,
      type: sp.SkeletonData,
      notify: function notify() {
        this.defaultSkin = '';
        this.defaultAnimation = '';

        if (CC_EDITOR) {
          this._refreshInspector();
        }

        this._updateSkeletonData();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.skeleton_data'
    },
    // 由于 spine 的 skin 是无法二次替换的，所以只能设置默认的 skin

    /**
     * !#en The name of default skin.
     * !#zh 默认的皮肤名称。
     * @property {String} defaultSkin
     */
    defaultSkin: {
      "default": '',
      visible: false
    },

    /**
     * !#en The name of default animation.
     * !#zh 默认的动画名称。
     * @property {String} defaultAnimation
     */
    defaultAnimation: {
      "default": '',
      visible: false
    },

    /**
     * !#en The name of current playing animation.
     * !#zh 当前播放的动画名称。
     * @property {String} animation
     */
    animation: {
      get: function get() {
        if (this.isAnimationCached()) {
          return this._animationName;
        } else {
          var entry = this.getCurrent(0);
          return entry && entry.animation.name || "";
        }
      },
      set: function set(value) {
        this.defaultAnimation = value;

        if (value) {
          this.setAnimation(0, value, this.loop);
        } else if (!this.isAnimationCached()) {
          this.clearTrack(0);
          this.setToSetupPose();
        }
      },
      visible: false
    },

    /**
     * @property {Number} _defaultSkinIndex
     */
    _defaultSkinIndex: {
      get: function get() {
        if (this.skeletonData && this.defaultSkin) {
          var skinsEnum = this.skeletonData.getSkinsEnum();

          if (skinsEnum) {
            var skinIndex = skinsEnum[this.defaultSkin];

            if (skinIndex !== undefined) {
              return skinIndex;
            }
          }
        }

        return 0;
      },
      set: function set(value) {
        var skinsEnum;

        if (this.skeletonData) {
          skinsEnum = this.skeletonData.getSkinsEnum();
        }

        if (!skinsEnum) {
          return cc.errorID('', this.name);
        }

        var skinName = skinsEnum[value];

        if (skinName !== undefined) {
          this.defaultSkin = skinName;
          this.setSkin(this.defaultSkin);

          if (CC_EDITOR && !cc.engine.isPlaying) {
            this._refreshInspector();
          }
        } else {
          cc.errorID(7501, this.name);
        }
      },
      type: DefaultSkinsEnum,
      visible: true,
      displayName: "Default Skin",
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.default_skin'
    },
    // value of 0 represents no animation
    _animationIndex: {
      get: function get() {
        var animationName = !CC_EDITOR || cc.engine.isPlaying ? this.animation : this.defaultAnimation;

        if (this.skeletonData && animationName) {
          var animsEnum = this.skeletonData.getAnimsEnum();

          if (animsEnum) {
            var animIndex = animsEnum[animationName];

            if (animIndex !== undefined) {
              return animIndex;
            }
          }
        }

        return 0;
      },
      set: function set(value) {
        if (value === 0) {
          this.animation = '';
          return;
        }

        var animsEnum;

        if (this.skeletonData) {
          animsEnum = this.skeletonData.getAnimsEnum();
        }

        if (!animsEnum) {
          return cc.errorID(7502, this.name);
        }

        var animName = animsEnum[value];

        if (animName !== undefined) {
          this.animation = animName;
        } else {
          cc.errorID(7503, this.name);
        }
      },
      type: DefaultAnimsEnum,
      visible: true,
      displayName: 'Animation',
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.animation'
    },
    // Record pre cache mode.
    _preCacheMode: -1,
    _cacheMode: AnimationCacheMode.REALTIME,
    _defaultCacheMode: {
      "default": 0,
      type: AnimationCacheMode,
      notify: function notify() {
        this.setAnimationCacheMode(this._defaultCacheMode);
      },
      editorOnly: true,
      visible: true,
      animatable: false,
      displayName: "Animation Cache Mode",
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.animation_cache_mode'
    },

    /**
     * !#en TODO
     * !#zh 是否循环播放当前骨骼动画。
     * @property {Boolean} loop
     * @default true
     */
    loop: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.loop'
    },

    /**
     * !#en Indicates whether to enable premultiplied alpha.
     * You should disable this option when image's transparent area appears to have opaque pixels,
     * or enable this option when image's half transparent area appears to be darken.
     * !#zh 是否启用贴图预乘。
     * 当图片的透明区域出现色块时需要关闭该选项，当图片的半透明区域颜色变黑时需要启用该选项。
     * @property {Boolean} premultipliedAlpha
     * @default true
     */
    premultipliedAlpha: {
      "default": true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.premultipliedAlpha'
    },

    /**
     * !#en The time scale of this skeleton.
     * !#zh 当前骨骼中所有动画的时间缩放率。
     * @property {Number} timeScale
     * @default 1
     */
    timeScale: {
      "default": 1,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.time_scale'
    },

    /**
     * !#en Indicates whether open debug slots.
     * !#zh 是否显示 slot 的 debug 信息。
     * @property {Boolean} debugSlots
     * @default false
     */
    debugSlots: {
      "default": false,
      editorOnly: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.debug_slots',
      notify: function notify() {
        this._updateDebugDraw();
      }
    },

    /**
     * !#en Indicates whether open debug bones.
     * !#zh 是否显示 bone 的 debug 信息。
     * @property {Boolean} debugBones
     * @default false
     */
    debugBones: {
      "default": false,
      editorOnly: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.debug_bones',
      notify: function notify() {
        this._updateDebugDraw();
      }
    },

    /**
     * !#en Indicates whether open debug mesh.
     * !#zh 是否显示 mesh 的 debug 信息。
     * @property {Boolean} debugMesh
     * @default false
     */
    debugMesh: {
      "default": false,
      editorOnly: true,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.debug_mesh',
      notify: function notify() {
        this._updateDebugDraw();
      }
    },

    /**
     * !#en Enabled two color tint.
     * !#zh 是否启用染色效果。
     * @property {Boolean} useTint
     * @default false
     */
    useTint: {
      "default": false,
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.use_tint',
      notify: function notify() {
        this._updateUseTint();
      }
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
      tooltip: CC_DEV && 'i18n:COMPONENT.skeleton.enabled_batch'
    },
    // Below properties will effect when cache mode is SHARED_CACHE or PRIVATE_CACHE.
    // accumulate time
    _accTime: 0,
    // Play times counter
    _playCount: 0,
    // Frame cache
    _frameCache: null,
    // Cur frame
    _curFrame: null,
    // Skeleton cache
    _skeletonCache: null,
    // Aimation name
    _animationName: "",
    // Animation queue
    _animationQueue: [],
    // Head animation info of 
    _headAniInfo: null,
    // Play times
    _playTimes: 0,
    // Is animation complete.
    _isAniComplete: true
  },
  // CONSTRUCTOR
  ctor: function ctor() {
    this._effectDelegate = null;
    this._skeleton = null;
    this._rootBone = null;
    this._listener = null;
    this._materialCache = {};
    this._debugRenderer = null;
    this._startSlotIndex = -1;
    this._endSlotIndex = -1;
    this._startEntry = {
      animation: {
        name: ""
      },
      trackIndex: 0
    };
    this._endEntry = {
      animation: {
        name: ""
      },
      trackIndex: 0
    };
    this.attachUtil = new AttachUtil();
  },
  // override base class _getDefaultMaterial to modify default material
  _getDefaultMaterial: function _getDefaultMaterial() {
    return cc.Material.getBuiltinMaterial('2d-spine');
  },
  // override base class _updateMaterial to set define value and clear material cache
  _updateMaterial: function _updateMaterial() {
    var useTint = this.useTint || this.isAnimationCached() && !CC_NATIVERENDERER;
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      baseMaterial.define('USE_TINT', useTint);
      baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
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
  // if change use tint mode, just clear material cache
  _updateUseTint: function _updateUseTint() {
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      var useTint = this.useTint || this.isAnimationCached() && !CC_NATIVERENDERER;
      baseMaterial.define('USE_TINT', useTint);
    }

    this._materialCache = {};
  },
  // if change use batch mode, just clear material cache
  _updateBatch: function _updateBatch() {
    var baseMaterial = this.getMaterial(0);

    if (baseMaterial) {
      baseMaterial.define('CC_USE_MODEL', !this.enableBatch);
    }

    this._materialCache = {};
  },
  _validateRender: function _validateRender() {
    var skeletonData = this.skeletonData;

    if (!skeletonData || !skeletonData.isTexturesLoaded()) {
      this.disableRender();
      return;
    }

    this._super();
  },

  /**
   * !#en
   * Sets runtime skeleton data to sp.Skeleton.<br>
   * This method is different from the `skeletonData` property. This method is passed in the raw data provided by the Spine runtime, and the skeletonData type is the asset type provided by Creator.
   * !#zh
   * 设置底层运行时用到的 SkeletonData。<br>
   * 这个接口有别于 `skeletonData` 属性，这个接口传入的是 Spine runtime 提供的原始数据，而 skeletonData 的类型是 Creator 提供的资源类型。
   * @method setSkeletonData
   * @param {sp.spine.SkeletonData} skeletonData
   */
  setSkeletonData: function setSkeletonData(skeletonData) {
    if (skeletonData.width != null && skeletonData.height != null) {
      this.node.setContentSize(skeletonData.width, skeletonData.height);
    }

    if (!CC_EDITOR) {
      if (this._cacheMode === AnimationCacheMode.SHARED_CACHE) {
        this._skeletonCache = SkeletonCache.sharedCache;
      } else if (this._cacheMode === AnimationCacheMode.PRIVATE_CACHE) {
        this._skeletonCache = new SkeletonCache();

        this._skeletonCache.enablePrivateMode();
      }
    }

    if (this.isAnimationCached()) {
      if (this.debugBones || this.debugSlots) {
        cc.warn("Debug bones or slots is invalid in cached mode");
      }

      var skeletonInfo = this._skeletonCache.getSkeletonCache(this.skeletonData._uuid, skeletonData);

      this._skeleton = skeletonInfo.skeleton;
      this._clipper = skeletonInfo.clipper;
      this._rootBone = this._skeleton.getRootBone();
    } else {
      this._skeleton = new spine.Skeleton(skeletonData);
      this._clipper = new spine.SkeletonClipping();
      this._rootBone = this._skeleton.getRootBone();
    }

    this.markForRender(true);
  },

  /**
   * !#en Sets slots visible range.
   * !#zh 设置骨骼插槽可视范围。
   * @method setSlotsRange
   * @param {Number} startSlotIndex
   * @param {Number} endSlotIndex
   */
  setSlotsRange: function setSlotsRange(startSlotIndex, endSlotIndex) {
    if (this.isAnimationCached()) {
      cc.warn("Slots visible range can not be modified in cached mode.");
    } else {
      this._startSlotIndex = startSlotIndex;
      this._endSlotIndex = endSlotIndex;
    }
  },

  /**
   * !#en Sets animation state data.<br>
   * The parameter type is {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData.
   * !#zh 设置动画状态数据。<br>
   * 参数是 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.AnimationStateData。
   * @method setAnimationStateData
   * @param {sp.spine.AnimationStateData} stateData
   */
  setAnimationStateData: function setAnimationStateData(stateData) {
    if (this.isAnimationCached()) {
      cc.warn("'setAnimationStateData' interface can not be invoked in cached mode.");
    } else {
      var state = new spine.AnimationState(stateData);

      if (this._listener) {
        if (this._state) {
          this._state.removeListener(this._listener);
        }

        state.addListener(this._listener);
      }

      this._state = state;
    }
  },
  // IMPLEMENT
  __preload: function __preload() {
    this._super();

    if (CC_EDITOR) {
      var Flags = cc.Object.Flags;
      this._objFlags |= Flags.IsAnchorLocked | Flags.IsSizeLocked;

      this._refreshInspector();
    }

    var children = this.node.children;

    for (var i = 0, n = children.length; i < n; i++) {
      var child = children[i];

      if (child && child._name === "DEBUG_DRAW_NODE") {
        child.destroy();
      }
    }

    this._updateSkeletonData();

    this._updateDebugDraw();

    this._updateUseTint();

    this._updateBatch();
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
   * skeleton.setAnimationCacheMode(sp.Skeleton.AnimationCacheMode.SHARED_CACHE);
   */
  setAnimationCacheMode: function setAnimationCacheMode(cacheMode) {
    if (this._preCacheMode !== cacheMode) {
      this._cacheMode = cacheMode;

      this._updateSkeletonData();

      this._updateUseTint();
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
  update: function update(dt) {
    if (CC_EDITOR) return;
    if (this.paused) return;
    dt *= this.timeScale * sp.timeScale;

    if (this.isAnimationCached()) {
      // Cache mode and has animation queue.
      if (this._isAniComplete) {
        if (this._animationQueue.length === 0 && !this._headAniInfo) {
          var frameCache = this._frameCache;

          if (frameCache && frameCache.isInvalid()) {
            frameCache.updateToFrame();
            var frames = frameCache.frames;
            this._curFrame = frames[frames.length - 1];
          }

          return;
        }

        if (!this._headAniInfo) {
          this._headAniInfo = this._animationQueue.shift();
        }

        this._accTime += dt;

        if (this._accTime > this._headAniInfo.delay) {
          var aniInfo = this._headAniInfo;
          this._headAniInfo = null;
          this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
        }

        return;
      }

      this._updateCache(dt);
    } else {
      this._updateRealtime(dt);
    }
  },
  _emitCacheCompleteEvent: function _emitCacheCompleteEvent() {
    if (!this._listener) return;
    this._endEntry.animation.name = this._animationName;
    this._listener.complete && this._listener.complete(this._endEntry);
    this._listener.end && this._listener.end(this._endEntry);
  },
  _updateCache: function _updateCache(dt) {
    var frameCache = this._frameCache;

    if (!frameCache.isInited()) {
      return;
    }

    var frames = frameCache.frames;
    var frameTime = SkeletonCache.FrameTime; // Animation Start, the event diffrent from dragonbones inner event,
    // It has no event object.

    if (this._accTime == 0 && this._playCount == 0) {
      this._startEntry.animation.name = this._animationName;
      this._listener && this._listener.start && this._listener.start(this._startEntry);
    }

    this._accTime += dt;
    var frameIdx = Math.floor(this._accTime / frameTime);

    if (!frameCache.isCompleted) {
      frameCache.updateToFrame(frameIdx);
    }

    if (frameCache.isCompleted && frameIdx >= frames.length) {
      this._playCount++;

      if (this._playTimes > 0 && this._playCount >= this._playTimes) {
        // set frame to end frame.
        this._curFrame = frames[frames.length - 1];
        this._accTime = 0;
        this._playCount = 0;
        this._isAniComplete = true;

        this._emitCacheCompleteEvent();

        return;
      }

      this._accTime = 0;
      frameIdx = 0;

      this._emitCacheCompleteEvent();
    }

    this._curFrame = frames[frameIdx];
  },
  _updateRealtime: function _updateRealtime(dt) {
    var skeleton = this._skeleton;
    var state = this._state;

    if (skeleton) {
      skeleton.update(dt);

      if (state) {
        state.update(dt);
        state.apply(skeleton);
      }
    }
  },

  /**
   * !#en Sets vertex effect delegate.
   * !#zh 设置顶点动画代理
   * @method setVertexEffectDelegate
   * @param {sp.VertexEffectDelegate} effectDelegate
   */
  setVertexEffectDelegate: function setVertexEffectDelegate(effectDelegate) {
    this._effectDelegate = effectDelegate;
  },
  // RENDERER

  /**
   * !#en Computes the world SRT from the local SRT for each bone.
   * !#zh 重新更新所有骨骼的世界 Transform，
   * 当获取 bone 的数值未更新时，即可使用该函数进行更新数值。
   * @method updateWorldTransform
   * @example
   * var bone = spine.findBone('head');
   * cc.log(bone.worldX); // return 0;
   * spine.updateWorldTransform();
   * bone = spine.findBone('head');
   * cc.log(bone.worldX); // return -23.12;
   */
  updateWorldTransform: function updateWorldTransform() {
    if (!this.isAnimationCached()) return;

    if (this._skeleton) {
      this._skeleton.updateWorldTransform();
    }
  },

  /**
   * !#en Sets the bones and slots to the setup pose.
   * !#zh 还原到起始动作
   * @method setToSetupPose
   */
  setToSetupPose: function setToSetupPose() {
    if (this._skeleton) {
      this._skeleton.setToSetupPose();
    }
  },

  /**
   * !#en
   * Sets the bones to the setup pose,
   * using the values from the `BoneData` list in the `SkeletonData`.
   * !#zh
   * 设置 bone 到起始动作
   * 使用 SkeletonData 中的 BoneData 列表中的值。
   * @method setBonesToSetupPose
   */
  setBonesToSetupPose: function setBonesToSetupPose() {
    if (this._skeleton) {
      this._skeleton.setBonesToSetupPose();
    }
  },

  /**
   * !#en
   * Sets the slots to the setup pose,
   * using the values from the `SlotData` list in the `SkeletonData`.
   * !#zh
   * 设置 slot 到起始动作。
   * 使用 SkeletonData 中的 SlotData 列表中的值。
   * @method setSlotsToSetupPose
   */
  setSlotsToSetupPose: function setSlotsToSetupPose() {
    if (this._skeleton) {
      this._skeleton.setSlotsToSetupPose();
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
    var uuid = this.skeletonData._uuid;

    if (this._skeletonCache) {
      this._skeletonCache.updateAnimationCache(uuid, animName);
    }
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

    if (this._skeletonCache) {
      this._skeletonCache.invalidAnimationCache(this.skeletonData._uuid);
    }
  },

  /**
   * !#en
   * Finds a bone by name.
   * This does a string comparison for every bone.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone object.
   * !#zh
   * 通过名称查找 bone。
   * 这里对每个 bone 的名称进行了对比。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Bone 对象。
   *
   * @method findBone
   * @param {String} boneName
   * @return {sp.spine.Bone}
   */
  findBone: function findBone(boneName) {
    if (this._skeleton) {
      return this._skeleton.findBone(boneName);
    }

    return null;
  },

  /**
   * !#en
   * Finds a slot by name. This does a string comparison for every slot.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot object.
   * !#zh
   * 通过名称查找 slot。这里对每个 slot 的名称进行了比较。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Slot 对象。
   *
   * @method findSlot
   * @param {String} slotName
   * @return {sp.spine.Slot}
   */
  findSlot: function findSlot(slotName) {
    if (this._skeleton) {
      return this._skeleton.findSlot(slotName);
    }

    return null;
  },

  /**
   * !#en
   * Finds a skin by name and makes it the active skin.
   * This does a string comparison for every skin.<br>
   * Note that setting the skin does not change which attachments are visible.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin object.
   * !#zh
   * 按名称查找皮肤，激活该皮肤。这里对每个皮肤的名称进行了比较。<br>
   * 注意：设置皮肤不会改变 attachment 的可见性。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Skin 对象。
   *
   * @method setSkin
   * @param {String} skinName
   */
  setSkin: function setSkin(skinName) {
    if (this._skeleton) {
      this._skeleton.setSkinByName(skinName);

      this._skeleton.setSlotsToSetupPose();
    }

    this.invalidAnimationCache();
  },

  /**
   * !#en
   * Returns the attachment for the slot and attachment name.
   * The skeleton looks first in its skin, then in the skeleton data’s default skin.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment object.
   * !#zh
   * 通过 slot 和 attachment 的名称获取 attachment。Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.Attachment 对象。
   *
   * @method getAttachment
   * @param {String} slotName
   * @param {String} attachmentName
   * @return {sp.spine.Attachment}
   */
  getAttachment: function getAttachment(slotName, attachmentName) {
    if (this._skeleton) {
      return this._skeleton.getAttachmentByName(slotName, attachmentName);
    }

    return null;
  },

  /**
   * !#en
   * Sets the attachment for the slot and attachment name.
   * The skeleton looks first in its skin, then in the skeleton data’s default skin.
   * !#zh
   * 通过 slot 和 attachment 的名字来设置 attachment。
   * Skeleton 优先查找它的皮肤，然后才是 Skeleton Data 中默认的皮肤。
   * @method setAttachment
   * @param {String} slotName
   * @param {String} attachmentName
   */
  setAttachment: function setAttachment(slotName, attachmentName) {
    if (this._skeleton) {
      this._skeleton.setAttachment(slotName, attachmentName);
    }

    this.invalidAnimationCache();
  },

  /**
  * Return the renderer of attachment.
  * @method getTextureAtlas
  * @param {sp.spine.RegionAttachment|spine.BoundingBoxAttachment} regionAttachment
  * @return {sp.spine.TextureAtlasRegion}
  */
  getTextureAtlas: function getTextureAtlas(regionAttachment) {
    return regionAttachment.region;
  },
  // ANIMATION

  /**
   * !#en
   * Mix applies all keyframe values,
   * interpolated for the specified time and mixed with the current values.
   * !#zh 为所有关键帧设定混合及混合时间（从当前值开始差值）。
   * @method setMix
   * @param {String} fromAnimation
   * @param {String} toAnimation
   * @param {Number} duration
   */
  setMix: function setMix(fromAnimation, toAnimation, duration) {
    if (this._state) {
      this._state.data.setMix(fromAnimation, toAnimation, duration);
    }
  },

  /**
   * !#en Set the current animation. Any queued animations are cleared.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
   * !#zh 设置当前动画。队列中的任何的动画将被清除。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
   * @method setAnimation
   * @param {Number} trackIndex
   * @param {String} name
   * @param {Boolean} loop
   * @return {sp.spine.TrackEntry}
   */
  setAnimation: function setAnimation(trackIndex, name, loop) {
    this._playTimes = loop ? 0 : 1;
    this._animationName = name;

    if (this.isAnimationCached()) {
      if (trackIndex !== 0) {
        cc.warn("Track index can not greater than 0 in cached mode.");
      }

      if (!this._skeletonCache) return null;

      var cache = this._skeletonCache.getAnimationCache(this.skeletonData._uuid, name);

      if (!cache) {
        cache = this._skeletonCache.initAnimationCache(this.skeletonData._uuid, name);
      }

      if (cache) {
        this._isAniComplete = false;
        this._accTime = 0;
        this._playCount = 0;
        this._frameCache = cache;

        if (this.attachUtil._hasAttachedNode()) {
          this._frameCache.enableCacheAttachedInfo();
        }

        this._frameCache.updateToFrame(0);

        this._curFrame = this._frameCache.frames[0];
      }
    } else {
      if (this._skeleton) {
        var animation = this._skeleton.data.findAnimation(name);

        if (!animation) {
          cc.logID(7509, name);
          return null;
        }

        var res = this._state.setAnimationWith(trackIndex, animation, loop);

        this._state.apply(this._skeleton);

        return res;
      }
    }

    return null;
  },

  /**
   * !#en Adds an animation to be played delay seconds after the current or last queued animation.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
   * !#zh 添加一个动画到动画队列尾部，还可以延迟指定的秒数。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
   * @method addAnimation
   * @param {Number} trackIndex
   * @param {String} name
   * @param {Boolean} loop
   * @param {Number} [delay=0]
   * @return {sp.spine.TrackEntry}
   */
  addAnimation: function addAnimation(trackIndex, name, loop, delay) {
    delay = delay || 0;

    if (this.isAnimationCached()) {
      if (trackIndex !== 0) {
        cc.warn("Track index can not greater than 0 in cached mode.");
      }

      this._animationQueue.push({
        animationName: name,
        loop: loop,
        delay: delay
      });
    } else {
      if (this._skeleton) {
        var animation = this._skeleton.data.findAnimation(name);

        if (!animation) {
          cc.logID(7510, name);
          return null;
        }

        return this._state.addAnimationWith(trackIndex, animation, loop, delay);
      }
    }

    return null;
  },

  /**
   * !#en Find animation with specified name.
   * !#zh 查找指定名称的动画
   * @method findAnimation
   * @param {String} name
   * @returns {sp.spine.Animation}
   */
  findAnimation: function findAnimation(name) {
    if (this._skeleton) {
      return this._skeleton.data.findAnimation(name);
    }

    return null;
  },

  /**
   * !#en Returns track entry by trackIndex.<br>
   * Returns a {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry object.
   * !#zh 通过 track 索引获取 TrackEntry。<br>
   * 返回一个 {{#crossLinkModule "sp.spine"}}sp.spine{{/crossLinkModule}}.TrackEntry 对象。
   * @method getCurrent
   * @param trackIndex
   * @return {sp.spine.TrackEntry}
   */
  getCurrent: function getCurrent(trackIndex) {
    if (this.isAnimationCached()) {
      cc.warn("'getCurrent' interface can not be invoked in cached mode.");
    } else {
      if (this._state) {
        return this._state.getCurrent(trackIndex);
      }
    }

    return null;
  },

  /**
   * !#en Clears all tracks of animation state.
   * !#zh 清除所有 track 的动画状态。
   * @method clearTracks
   */
  clearTracks: function clearTracks() {
    if (this.isAnimationCached()) {
      cc.warn("'clearTracks' interface can not be invoked in cached mode.");
    } else {
      if (this._state) {
        this._state.clearTracks();
      }
    }
  },

  /**
   * !#en Clears track of animation state by trackIndex.
   * !#zh 清除出指定 track 的动画状态。
   * @method clearTrack
   * @param {number} trackIndex
   */
  clearTrack: function clearTrack(trackIndex) {
    if (this.isAnimationCached()) {
      cc.warn("'clearTrack' interface can not be invoked in cached mode.");
    } else {
      if (this._state) {
        this._state.clearTrack(trackIndex);

        if (CC_EDITOR && !cc.engine.isPlaying) {
          this._state.update(0);
        }
      }
    }
  },

  /**
   * !#en Set the start event listener.
   * !#zh 用来设置开始播放动画的事件监听。
   * @method setStartListener
   * @param {function} listener
   */
  setStartListener: function setStartListener(listener) {
    this._ensureListener();

    this._listener.start = listener;
  },

  /**
   * !#en Set the interrupt event listener.
   * !#zh 用来设置动画被打断的事件监听。
   * @method setInterruptListener
   * @param {function} listener
   */
  setInterruptListener: function setInterruptListener(listener) {
    this._ensureListener();

    this._listener.interrupt = listener;
  },

  /**
   * !#en Set the end event listener.
   * !#zh 用来设置动画播放完后的事件监听。
   * @method setEndListener
   * @param {function} listener
   */
  setEndListener: function setEndListener(listener) {
    this._ensureListener();

    this._listener.end = listener;
  },

  /**
   * !#en Set the dispose event listener.
   * !#zh 用来设置动画将被销毁的事件监听。
   * @method setDisposeListener
   * @param {function} listener
   */
  setDisposeListener: function setDisposeListener(listener) {
    this._ensureListener();

    this._listener.dispose = listener;
  },

  /**
   * !#en Set the complete event listener.
   * !#zh 用来设置动画播放一次循环结束后的事件监听。
   * @method setCompleteListener
   * @param {function} listener
   */
  setCompleteListener: function setCompleteListener(listener) {
    this._ensureListener();

    this._listener.complete = listener;
  },

  /**
   * !#en Set the animation event listener.
   * !#zh 用来设置动画播放过程中帧事件的监听。
   * @method setEventListener
   * @param {function} listener
   */
  setEventListener: function setEventListener(listener) {
    this._ensureListener();

    this._listener.event = listener;
  },

  /**
   * !#en Set the start event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画开始播放的事件监听。
   * @method setTrackStartListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackStartListener: function setTrackStartListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).start = listener;
  },

  /**
   * !#en Set the interrupt event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画被打断的事件监听。
   * @method setTrackInterruptListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackInterruptListener: function setTrackInterruptListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).interrupt = listener;
  },

  /**
   * !#en Set the end event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画播放结束的事件监听。
   * @method setTrackEndListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackEndListener: function setTrackEndListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).end = listener;
  },

  /**
   * !#en Set the dispose event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画即将被销毁的事件监听。
   * @method setTrackDisposeListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackDisposeListener: function setTrackDisposeListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).dispose = listener;
  },

  /**
   * !#en Set the complete event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画一次循环播放结束的事件监听。
   * @method setTrackCompleteListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   * @param {sp.spine.TrackEntry} listener.entry
   * @param {Number} listener.loopCount
   */
  setTrackCompleteListener: function setTrackCompleteListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).complete = function (trackEntry) {
      var loopCount = Math.floor(trackEntry.trackTime / trackEntry.animationEnd);
      listener(trackEntry, loopCount);
    };
  },

  /**
   * !#en Set the event listener for specified TrackEntry.
   * !#zh 用来为指定的 TrackEntry 设置动画帧事件的监听。
   * @method setTrackEventListener
   * @param {sp.spine.TrackEntry} entry
   * @param {function} listener
   */
  setTrackEventListener: function setTrackEventListener(entry, listener) {
    TrackEntryListeners.getListeners(entry).event = listener;
  },

  /**
   * !#en Get the animation state object
   * !#zh 获取动画状态
   * @method getState
   * @return {sp.spine.AnimationState} state
   */
  getState: function getState() {
    return this._state;
  },
  // update animation list for editor
  _updateAnimEnum: CC_EDITOR && function () {
    var animEnum;

    if (this.skeletonData) {
      animEnum = this.skeletonData.getAnimsEnum();
    } // change enum


    setEnumAttr(this, '_animationIndex', animEnum || DefaultAnimsEnum);
  },
  // update skin list for editor
  _updateSkinEnum: CC_EDITOR && function () {
    var skinEnum;

    if (this.skeletonData) {
      skinEnum = this.skeletonData.getSkinsEnum();
    } // change enum


    setEnumAttr(this, '_defaultSkinIndex', skinEnum || DefaultSkinsEnum);
  },
  _ensureListener: function _ensureListener() {
    if (!this._listener) {
      this._listener = new TrackEntryListeners();

      if (this._state) {
        this._state.addListener(this._listener);
      }
    }
  },
  _updateSkeletonData: function _updateSkeletonData() {
    if (!this.skeletonData) {
      this.disableRender();
      return;
    }

    var data = this.skeletonData.getRuntimeData();

    if (!data) {
      this.disableRender();
      return;
    }

    try {
      this.setSkeletonData(data);

      if (!this.isAnimationCached()) {
        this.setAnimationStateData(new spine.AnimationStateData(this._skeleton.data));
      }

      this.defaultSkin && this.setSkin(this.defaultSkin);
    } catch (e) {
      cc.warn(e);
    }

    this.attachUtil.init(this);

    this.attachUtil._associateAttachedNode();

    this._preCacheMode = this._cacheMode;
    this.animation = this.defaultAnimation;
  },
  _refreshInspector: function _refreshInspector() {
    // update inspector
    this._updateAnimEnum();

    this._updateSkinEnum();

    Editor.Utils.refreshSelectedInspector('node', this.node.uuid);
  },
  _updateDebugDraw: function _updateDebugDraw() {
    if (this.debugBones || this.debugSlots) {
      if (!this._debugRenderer) {
        var debugDrawNode = new cc.PrivateNode();
        debugDrawNode.name = 'DEBUG_DRAW_NODE';
        var debugDraw = debugDrawNode.addComponent(Graphics);
        debugDraw.lineWidth = 1;
        debugDraw.strokeColor = cc.color(255, 0, 0, 255);
        this._debugRenderer = debugDraw;
      }

      this._debugRenderer.node.parent = this.node;

      if (this.isAnimationCached()) {
        cc.warn("Debug bones or slots is invalid in cached mode");
      }
    } else if (this._debugRenderer) {
      this._debugRenderer.node.parent = null;
    }
  }
});
module.exports = sp.Skeleton;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNrZWxldG9uLmpzIl0sIm5hbWVzIjpbIlRyYWNrRW50cnlMaXN0ZW5lcnMiLCJyZXF1aXJlIiwiUmVuZGVyQ29tcG9uZW50Iiwic3BpbmUiLCJHcmFwaGljcyIsIlJlbmRlckZsb3ciLCJGTEFHX1BPU1RfUkVOREVSIiwiU2tlbGV0b25DYWNoZSIsIkF0dGFjaFV0aWwiLCJEZWZhdWx0U2tpbnNFbnVtIiwiY2MiLCJFbnVtIiwiRGVmYXVsdEFuaW1zRW51bSIsIkFuaW1hdGlvbkNhY2hlTW9kZSIsIlJFQUxUSU1FIiwiU0hBUkVEX0NBQ0hFIiwiUFJJVkFURV9DQUNIRSIsInNldEVudW1BdHRyIiwib2JqIiwicHJvcE5hbWUiLCJlbnVtRGVmIiwiQ2xhc3MiLCJBdHRyIiwic2V0Q2xhc3NBdHRyIiwiZ2V0TGlzdCIsInNwIiwiU2tlbGV0b24iLCJuYW1lIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImhlbHAiLCJpbnNwZWN0b3IiLCJzdGF0aWNzIiwicHJvcGVydGllcyIsInBhdXNlZCIsInZpc2libGUiLCJza2VsZXRvbkRhdGEiLCJ0eXBlIiwiU2tlbGV0b25EYXRhIiwibm90aWZ5IiwiZGVmYXVsdFNraW4iLCJkZWZhdWx0QW5pbWF0aW9uIiwiX3JlZnJlc2hJbnNwZWN0b3IiLCJfdXBkYXRlU2tlbGV0b25EYXRhIiwidG9vbHRpcCIsIkNDX0RFViIsImFuaW1hdGlvbiIsImdldCIsImlzQW5pbWF0aW9uQ2FjaGVkIiwiX2FuaW1hdGlvbk5hbWUiLCJlbnRyeSIsImdldEN1cnJlbnQiLCJzZXQiLCJ2YWx1ZSIsInNldEFuaW1hdGlvbiIsImxvb3AiLCJjbGVhclRyYWNrIiwic2V0VG9TZXR1cFBvc2UiLCJfZGVmYXVsdFNraW5JbmRleCIsInNraW5zRW51bSIsImdldFNraW5zRW51bSIsInNraW5JbmRleCIsInVuZGVmaW5lZCIsImVycm9ySUQiLCJza2luTmFtZSIsInNldFNraW4iLCJlbmdpbmUiLCJpc1BsYXlpbmciLCJkaXNwbGF5TmFtZSIsIl9hbmltYXRpb25JbmRleCIsImFuaW1hdGlvbk5hbWUiLCJhbmltc0VudW0iLCJnZXRBbmltc0VudW0iLCJhbmltSW5kZXgiLCJhbmltTmFtZSIsIl9wcmVDYWNoZU1vZGUiLCJfY2FjaGVNb2RlIiwiX2RlZmF1bHRDYWNoZU1vZGUiLCJzZXRBbmltYXRpb25DYWNoZU1vZGUiLCJlZGl0b3JPbmx5IiwiYW5pbWF0YWJsZSIsInByZW11bHRpcGxpZWRBbHBoYSIsInRpbWVTY2FsZSIsImRlYnVnU2xvdHMiLCJfdXBkYXRlRGVidWdEcmF3IiwiZGVidWdCb25lcyIsImRlYnVnTWVzaCIsInVzZVRpbnQiLCJfdXBkYXRlVXNlVGludCIsImVuYWJsZUJhdGNoIiwiX3VwZGF0ZUJhdGNoIiwiX2FjY1RpbWUiLCJfcGxheUNvdW50IiwiX2ZyYW1lQ2FjaGUiLCJfY3VyRnJhbWUiLCJfc2tlbGV0b25DYWNoZSIsIl9hbmltYXRpb25RdWV1ZSIsIl9oZWFkQW5pSW5mbyIsIl9wbGF5VGltZXMiLCJfaXNBbmlDb21wbGV0ZSIsImN0b3IiLCJfZWZmZWN0RGVsZWdhdGUiLCJfc2tlbGV0b24iLCJfcm9vdEJvbmUiLCJfbGlzdGVuZXIiLCJfbWF0ZXJpYWxDYWNoZSIsIl9kZWJ1Z1JlbmRlcmVyIiwiX3N0YXJ0U2xvdEluZGV4IiwiX2VuZFNsb3RJbmRleCIsIl9zdGFydEVudHJ5IiwidHJhY2tJbmRleCIsIl9lbmRFbnRyeSIsImF0dGFjaFV0aWwiLCJfZ2V0RGVmYXVsdE1hdGVyaWFsIiwiTWF0ZXJpYWwiLCJnZXRCdWlsdGluTWF0ZXJpYWwiLCJfdXBkYXRlTWF0ZXJpYWwiLCJDQ19OQVRJVkVSRU5ERVJFUiIsImJhc2VNYXRlcmlhbCIsImdldE1hdGVyaWFsIiwiZGVmaW5lIiwiZGlzYWJsZVJlbmRlciIsIl9zdXBlciIsIm5vZGUiLCJfcmVuZGVyRmxhZyIsIm1hcmtGb3JSZW5kZXIiLCJlbmFibGUiLCJfdmFsaWRhdGVSZW5kZXIiLCJpc1RleHR1cmVzTG9hZGVkIiwic2V0U2tlbGV0b25EYXRhIiwid2lkdGgiLCJoZWlnaHQiLCJzZXRDb250ZW50U2l6ZSIsInNoYXJlZENhY2hlIiwiZW5hYmxlUHJpdmF0ZU1vZGUiLCJ3YXJuIiwic2tlbGV0b25JbmZvIiwiZ2V0U2tlbGV0b25DYWNoZSIsIl91dWlkIiwic2tlbGV0b24iLCJfY2xpcHBlciIsImNsaXBwZXIiLCJnZXRSb290Qm9uZSIsIlNrZWxldG9uQ2xpcHBpbmciLCJzZXRTbG90c1JhbmdlIiwic3RhcnRTbG90SW5kZXgiLCJlbmRTbG90SW5kZXgiLCJzZXRBbmltYXRpb25TdGF0ZURhdGEiLCJzdGF0ZURhdGEiLCJzdGF0ZSIsIkFuaW1hdGlvblN0YXRlIiwiX3N0YXRlIiwicmVtb3ZlTGlzdGVuZXIiLCJhZGRMaXN0ZW5lciIsIl9fcHJlbG9hZCIsIkZsYWdzIiwiT2JqZWN0IiwiX29iakZsYWdzIiwiSXNBbmNob3JMb2NrZWQiLCJJc1NpemVMb2NrZWQiLCJjaGlsZHJlbiIsImkiLCJuIiwibGVuZ3RoIiwiY2hpbGQiLCJfbmFtZSIsImRlc3Ryb3kiLCJjYWNoZU1vZGUiLCJ1cGRhdGUiLCJkdCIsImZyYW1lQ2FjaGUiLCJpc0ludmFsaWQiLCJ1cGRhdGVUb0ZyYW1lIiwiZnJhbWVzIiwic2hpZnQiLCJkZWxheSIsImFuaUluZm8iLCJfdXBkYXRlQ2FjaGUiLCJfdXBkYXRlUmVhbHRpbWUiLCJfZW1pdENhY2hlQ29tcGxldGVFdmVudCIsImNvbXBsZXRlIiwiZW5kIiwiaXNJbml0ZWQiLCJmcmFtZVRpbWUiLCJGcmFtZVRpbWUiLCJzdGFydCIsImZyYW1lSWR4IiwiTWF0aCIsImZsb29yIiwiaXNDb21wbGV0ZWQiLCJhcHBseSIsInNldFZlcnRleEVmZmVjdERlbGVnYXRlIiwiZWZmZWN0RGVsZWdhdGUiLCJ1cGRhdGVXb3JsZFRyYW5zZm9ybSIsInNldEJvbmVzVG9TZXR1cFBvc2UiLCJzZXRTbG90c1RvU2V0dXBQb3NlIiwidXBkYXRlQW5pbWF0aW9uQ2FjaGUiLCJ1dWlkIiwiaW52YWxpZEFuaW1hdGlvbkNhY2hlIiwiZmluZEJvbmUiLCJib25lTmFtZSIsImZpbmRTbG90Iiwic2xvdE5hbWUiLCJzZXRTa2luQnlOYW1lIiwiZ2V0QXR0YWNobWVudCIsImF0dGFjaG1lbnROYW1lIiwiZ2V0QXR0YWNobWVudEJ5TmFtZSIsInNldEF0dGFjaG1lbnQiLCJnZXRUZXh0dXJlQXRsYXMiLCJyZWdpb25BdHRhY2htZW50IiwicmVnaW9uIiwic2V0TWl4IiwiZnJvbUFuaW1hdGlvbiIsInRvQW5pbWF0aW9uIiwiZHVyYXRpb24iLCJkYXRhIiwiY2FjaGUiLCJnZXRBbmltYXRpb25DYWNoZSIsImluaXRBbmltYXRpb25DYWNoZSIsIl9oYXNBdHRhY2hlZE5vZGUiLCJlbmFibGVDYWNoZUF0dGFjaGVkSW5mbyIsImZpbmRBbmltYXRpb24iLCJsb2dJRCIsInJlcyIsInNldEFuaW1hdGlvbldpdGgiLCJhZGRBbmltYXRpb24iLCJwdXNoIiwiYWRkQW5pbWF0aW9uV2l0aCIsImNsZWFyVHJhY2tzIiwic2V0U3RhcnRMaXN0ZW5lciIsImxpc3RlbmVyIiwiX2Vuc3VyZUxpc3RlbmVyIiwic2V0SW50ZXJydXB0TGlzdGVuZXIiLCJpbnRlcnJ1cHQiLCJzZXRFbmRMaXN0ZW5lciIsInNldERpc3Bvc2VMaXN0ZW5lciIsImRpc3Bvc2UiLCJzZXRDb21wbGV0ZUxpc3RlbmVyIiwic2V0RXZlbnRMaXN0ZW5lciIsImV2ZW50Iiwic2V0VHJhY2tTdGFydExpc3RlbmVyIiwiZ2V0TGlzdGVuZXJzIiwic2V0VHJhY2tJbnRlcnJ1cHRMaXN0ZW5lciIsInNldFRyYWNrRW5kTGlzdGVuZXIiLCJzZXRUcmFja0Rpc3Bvc2VMaXN0ZW5lciIsInNldFRyYWNrQ29tcGxldGVMaXN0ZW5lciIsInRyYWNrRW50cnkiLCJsb29wQ291bnQiLCJ0cmFja1RpbWUiLCJhbmltYXRpb25FbmQiLCJzZXRUcmFja0V2ZW50TGlzdGVuZXIiLCJnZXRTdGF0ZSIsIl91cGRhdGVBbmltRW51bSIsImFuaW1FbnVtIiwiX3VwZGF0ZVNraW5FbnVtIiwic2tpbkVudW0iLCJnZXRSdW50aW1lRGF0YSIsIkFuaW1hdGlvblN0YXRlRGF0YSIsImUiLCJpbml0IiwiX2Fzc29jaWF0ZUF0dGFjaGVkTm9kZSIsIkVkaXRvciIsIlV0aWxzIiwicmVmcmVzaFNlbGVjdGVkSW5zcGVjdG9yIiwiZGVidWdEcmF3Tm9kZSIsIlByaXZhdGVOb2RlIiwiZGVidWdEcmF3IiwiYWRkQ29tcG9uZW50IiwibGluZVdpZHRoIiwic3Ryb2tlQ29sb3IiLCJjb2xvciIsInBhcmVudCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxJQUFNQSxtQkFBbUIsR0FBR0MsT0FBTyxDQUFDLHlCQUFELENBQW5DOztBQUNBLElBQU1DLGVBQWUsR0FBR0QsT0FBTyxDQUFDLGlEQUFELENBQS9COztBQUNBLElBQU1FLEtBQUssR0FBR0YsT0FBTyxDQUFDLGFBQUQsQ0FBckI7O0FBQ0EsSUFBTUcsUUFBUSxHQUFHSCxPQUFPLENBQUMsc0NBQUQsQ0FBeEI7O0FBQ0EsSUFBTUksVUFBVSxHQUFHSixPQUFPLENBQUMseUNBQUQsQ0FBMUI7O0FBQ0EsSUFBTUssZ0JBQWdCLEdBQUdELFVBQVUsQ0FBQ0MsZ0JBQXBDOztBQUVBLElBQUlDLGFBQWEsR0FBR04sT0FBTyxDQUFDLGtCQUFELENBQTNCOztBQUNBLElBQUlPLFVBQVUsR0FBR1AsT0FBTyxDQUFDLGNBQUQsQ0FBeEI7QUFFQTs7Ozs7QUFHQSxJQUFJUSxnQkFBZ0IsR0FBR0MsRUFBRSxDQUFDQyxJQUFILENBQVE7QUFBRSxhQUFXLENBQUM7QUFBZCxDQUFSLENBQXZCO0FBQ0EsSUFBSUMsZ0JBQWdCLEdBQUdGLEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQUUsWUFBVTtBQUFaLENBQVIsQ0FBdkI7QUFFQTs7Ozs7O0FBS0EsSUFBSUUsa0JBQWtCLEdBQUdILEVBQUUsQ0FBQ0MsSUFBSCxDQUFRO0FBQzdCOzs7OztBQUtBRyxFQUFBQSxRQUFRLEVBQUUsQ0FObUI7O0FBTzdCOzs7OztB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RUFBcEI7QUFDQUQsUUFBQUEsYUFBYSxDQUFDOU8sSUFBZCxHQUFxQixpQkFBckI7QUFDQSxZQUFJZ1AsU0FBUyxHQUFHRixhQUFhLENBQUNHLFlBQWQsQ0FBMkJ4USxRQUEzQixDQUFoQjtBQUNBdVEsUUFBQUEsU0FBUyxDQUFDRSxTQUFWLEdBQXNCLENBQXRCO0FBQ0FGLFFBQUFBLFNBQVMsQ0FBQ0csV0FBVixHQUF3QnBRLEVBQUUsQ0FBQ3FRLEtBQUgsQ0FBUyxHQUFULEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixHQUFwQixDQUF4QjtBQUVBLGFBQUtwSyxjQUFMLEdBQXNCZ0ssU0FBdEI7QUFDSDs7QUFFRCxXQUFLaEssY0FBTCxDQUFvQmlCLElBQXBCLENBQXlCb0osTUFBekIsR0FBa0MsS0FBS3BKLElBQXZDOztBQUNBLFVBQUksS0FBSzNFLGlCQUFMLEVBQUosRUFBOEI7QUFDMUJ2QyxRQUFBQSxFQUFFLENBQUM4SCxJQUFILENBQVEsZ0RBQVI7QUFDSDtBQUNKLEtBZkQsTUFnQkssSUFBSSxLQUFLN0IsY0FBVCxFQUF5QjtBQUMxQixXQUFLQSxjQUFMLENBQW9CaUIsSUFBcEIsQ0FBeUJvSixNQUF6QixHQUFrQyxJQUFsQztBQUNIO0FBQ0o7QUF4dUNrQixDQUFULENBQWQ7QUEydUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJ6UCxFQUFFLENBQUNDLFFBQXBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBUcmFja0VudHJ5TGlzdGVuZXJzID0gcmVxdWlyZSgnLi90cmFjay1lbnRyeS1saXN0ZW5lcnMnKTtcbmNvbnN0IFJlbmRlckNvbXBvbmVudCA9IHJlcXVpcmUoJy4uLy4uL2NvY29zMmQvY29yZS9jb21wb25lbnRzL0NDUmVuZGVyQ29tcG9uZW50Jyk7XG5jb25zdCBzcGluZSA9IHJlcXVpcmUoJy4vbGliL3NwaW5lJyk7XG5jb25zdCBHcmFwaGljcyA9IHJlcXVpcmUoJy4uLy4uL2NvY29zMmQvY29yZS9ncmFwaGljcy9ncmFwaGljcycpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4uLy4uL2NvY29zMmQvY29yZS9yZW5kZXJlci9yZW5kZXItZmxvdycpO1xuY29uc3QgRkxBR19QT1NUX1JFTkRFUiA9IFJlbmRlckZsb3cuRkxBR19QT1NUX1JFTkRFUjtcblxubGV0IFNrZWxldG9uQ2FjaGUgPSByZXF1aXJlKCcuL3NrZWxldG9uLWNhY2hlJyk7XG5sZXQgQXR0YWNoVXRpbCA9IHJlcXVpcmUoJy4vQXR0YWNoVXRpbCcpO1xuXG4vKipcbiAqIEBtb2R1bGUgc3BcbiAqL1xubGV0IERlZmF1bHRTa2luc0VudW0gPSBjYy5FbnVtKHsgJ2RlZmF1bHQnOiAtMSB9KTtcbmxldCBEZWZhdWx0QW5pbXNFbnVtID0gY2MuRW51bSh7ICc8Tm9uZT4nOiAwIH0pO1xuXG4vKipcbiAqICEjZW4gRW51bSBmb3IgYW5pbWF0aW9uIGNhY2hlIG1vZGUgdHlwZS5cbiAqICEjemggU3BpbmXliqjnlLvnvJPlrZjnsbvlnotcbiAqIEBlbnVtIFNrZWxldG9uLkFuaW1hdGlvbkNhY2hlTW9kZVxuICovXG5sZXQgQW5pbWF0aW9uQ2FjaGVNb2RlID0gY2MuRW51bSh7XG4gICAgLyoqXG4gICAgICogISNlbiBUaGUgcmVhbHRpbWUgbW9kZS5cbiAgICAgKiAhI3poIOWunuaXtuiuoeeul+aooeW8j+OAglxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBSRUFMVElNRVxuICAgICAqL1xuICAgIFJFQUxUSU1FOiAwLFxuICAgIC8qKlxuICAgICAqICEjZW4gVGhlIHNoYXJlZCBjYWNoZSBtb2RlLlxuICAgICAqICEjemgg5YWx5Lqr57yT5a2Y5qih5byP44CCXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IFNIQVJFRF9DQUNIRVxuICAgICAqL1xuICAgIFNIQVJFRF9DQUNIRTogMSxcbiAgICAvKipcbiAgICAgKiAhI2VuIFRoZSBwcml2YXRlIGNhY2hlIG1vZGUuXG4gICAgICogISN6aCDnp4HmnInnvJPlrZjmqKHlvI/jgIJcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUFJJVkFURV9DQUNIRVxuICAgICAqL1xuICAgIFBSSVZBVEVfQ0FDSEU6IDIgXG59KTtcblxuZnVuY3Rpb24gc2V0RW51bUF0dHIgKG9iaiwgcHJvcE5hbWUsIGVudW1EZWYpIHtcbiAgICBjYy5DbGFzcy5BdHRyLnNldENsYXNzQXR0cihvYmosIHByb3BOYW1lLCAndHlwZScsICdFbnVtJyk7XG4gICAgY2MuQ2xhc3MuQXR0ci5zZXRDbGFzc0F0dHIob2JqLCBwcm9wTmFtZSwgJ2VudW1MaXN0JywgY2MuRW51bS5nZXRMaXN0KGVudW1EZWYpKTtcbn1cblxuLyoqXG4gKiAhI2VuXG4gKiBUaGUgc2tlbGV0b24gb2YgU3BpbmUgPGJyLz5cbiAqIDxici8+XG4gKiAoU2tlbGV0b24gaGFzIGEgcmVmZXJlbmNlIHRvIGEgU2tlbGV0b25EYXRhIGFuZCBzdG9yZXMgdGhlIHN0YXRlIGZvciBza2VsZXRvbiBpbnN0YW5jZSxcbiAqIHdoaWNoIGNvbnNpc3RzIG9mIHRoZSBjdXJyZW50IHBvc2UncyBib25lIFNSVCwgc2xvdCBjb2xvcnMsIGFuZCB3aGljaCBzbG90IGF0dGFjaG1lbnRzIGFyZSB2aXNpYmxlLiA8YnIvPlxuICogTXVsdGlwbGUgc2tlbGV0b25zIGNhbiB1c2UgdGhlIHNhbWUgU2tlbGV0b25EYXRhIHdoaWNoIGluY2x1ZGVzIGFsbCBhbmltYXRpb25zLCBza2lucywgYW5kIGF0dGFjaG1lbnRzLikgPGJyLz5cbiAqICEjemhcbiAqIFNwaW5lIOmqqOmqvOWKqOeUuyA8YnIvPlxuICogPGJyLz5cbiAqIChTa2VsZXRvbiDlhbfmnInlr7npqqjpqrzmlbDmja7nmoTlvJXnlKjlubbkuJTlrZjlgqjkuobpqqjpqrzlrp7kvovnmoTnirbmgIHvvIxcbiAqIOWug+eUseW9k+WJjeeahOmqqOmqvOWKqOS9nO+8jHNsb3Qg6aKc6Imy77yM5ZKM5Y+v6KeB55qEIHNsb3QgYXR0YWNobWVudHMg57uE5oiQ44CCPGJyLz5cbiAqIOWkmuS4qiBTa2VsZXRvbiDlj6/ku6Xkvb/nlKjnm7jlkIznmoTpqqjpqrzmlbDmja7vvIzlhbbkuK3ljIXmi6zmiYDmnInnmoTliqjnlLvvvIznmq7ogqTlkowgYXR0YWNobWVudHPjgIJcbiAqXG4gKiBAY2xhc3MgU2tlbGV0b25cbiAqIEBleHRlbmRzIFJlbmRlckNvbXBvbmVudFxuICovXG5zcC5Ta2VsZXRvbiA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnc3AuU2tlbGV0b24nLFxuICAgIGV4dGVuZHM6IFJlbmRlckNvbXBvbmVudCxcbiAgICBlZGl0b3I6IENDX0VESVRPUiAmJiB7XG4gICAgICAgIG1lbnU6ICdpMThuOk1BSU5fTUVOVS5jb21wb25lbnQucmVuZGVyZXJzL1NwaW5lIFNrZWxldG9uJyxcbiAgICAgICAgaGVscDogJ2FwcDovL2RvY3MvaHRtbC9jb21wb25lbnRzL3NwaW5lLmh0bWwnLFxuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL3NrZWxldG9uMmQuanMnLFxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIEFuaW1hdGlvbkNhY2hlTW9kZTogQW5pbWF0aW9uQ2FjaGVNb2RlLFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBza2VsZXRhbCBhbmltYXRpb24gaXMgcGF1c2VkP1xuICAgICAgICAgKiAhI3poIOivpemqqOmqvOWKqOeUu+aYr+WQpuaaguWBnOOAglxuICAgICAgICAgKiBAcHJvcGVydHkgcGF1c2VkXG4gICAgICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAgICAgKiBAcmVhZE9ubHlcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIHBhdXNlZDoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBza2VsZXRvbiBkYXRhIGNvbnRhaW5zIHRoZSBza2VsZXRvbiBpbmZvcm1hdGlvbiAoYmluZCBwb3NlIGJvbmVzLCBzbG90cywgZHJhdyBvcmRlcixcbiAgICAgICAgICogYXR0YWNobWVudHMsIHNraW5zLCBldGMpIGFuZCBhbmltYXRpb25zIGJ1dCBkb2VzIG5vdCBob2xkIGFueSBzdGF0ZS48YnIvPlxuICAgICAgICAgKiBNdWx0aXBsZSBza2VsZXRvbnMgY2FuIHNoYXJlIHRoZSBzYW1lIHNrZWxldG9uIGRhdGEuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog6aqo6aq85pWw5o2u5YyF5ZCr5LqG6aqo6aq85L+h5oGv77yI57uR5a6a6aqo6aq85Yqo5L2c77yMc2xvdHPvvIzmuLLmn5Ppobrluo/vvIxcbiAgICAgICAgICogYXR0YWNobWVudHPvvIznmq7ogqTnrYnnrYnvvInlkozliqjnlLvkvYbkuI3mjIHmnInku7vkvZXnirbmgIHjgII8YnIvPlxuICAgICAgICAgKiDlpJrkuKogU2tlbGV0b24g5Y+v5Lul5YWx55So55u45ZCM55qE6aqo6aq85pWw5o2u44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7c3AuU2tlbGV0b25EYXRhfSBza2VsZXRvbkRhdGFcbiAgICAgICAgICovXG4gICAgICAgIHNrZWxldG9uRGF0YToge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IHNwLlNrZWxldG9uRGF0YSxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2tpbiA9ICcnO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdEFuaW1hdGlvbiA9ICcnO1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVmcmVzaEluc3BlY3RvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTa2VsZXRvbkRhdGEoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLnNrZWxldG9uX2RhdGEnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g55Sx5LqOIHNwaW5lIOeahCBza2luIOaYr+aXoOazleS6jOasoeabv+aNoueahO+8jOaJgOS7peWPquiDveiuvue9rum7mOiupOeahCBza2luXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBuYW1lIG9mIGRlZmF1bHQgc2tpbi5cbiAgICAgICAgICogISN6aCDpu5jorqTnmoTnmq7ogqTlkI3np7DjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGRlZmF1bHRTa2luXG4gICAgICAgICAqL1xuICAgICAgICBkZWZhdWx0U2tpbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBuYW1lIG9mIGRlZmF1bHQgYW5pbWF0aW9uLlxuICAgICAgICAgKiAhI3poIOm7mOiupOeahOWKqOeUu+WQjeensOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gZGVmYXVsdEFuaW1hdGlvblxuICAgICAgICAgKi9cbiAgICAgICAgZGVmYXVsdEFuaW1hdGlvbjoge1xuICAgICAgICAgICAgZGVmYXVsdDogJycsXG4gICAgICAgICAgICB2aXNpYmxlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRoZSBuYW1lIG9mIGN1cnJlbnQgcGxheWluZyBhbmltYXRpb24uXG4gICAgICAgICAqICEjemgg5b2T5YmN5pKt5pS+55qE5Yqo55S75ZCN56ew44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhbmltYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIGFuaW1hdGlvbjoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25OYW1lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IHRoaXMuZ2V0Q3VycmVudCgwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChlbnRyeSAmJiBlbnRyeS5hbmltYXRpb24ubmFtZSkgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdEFuaW1hdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvbigwLCB2YWx1ZSwgdGhpcy5sb29wKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIXRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyVHJhY2soMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VG9TZXR1cFBvc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IF9kZWZhdWx0U2tpbkluZGV4XG4gICAgICAgICAqL1xuICAgICAgICBfZGVmYXVsdFNraW5JbmRleDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5za2VsZXRvbkRhdGEgJiYgdGhpcy5kZWZhdWx0U2tpbikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2tpbnNFbnVtID0gdGhpcy5za2VsZXRvbkRhdGEuZ2V0U2tpbnNFbnVtKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChza2luc0VudW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBza2luSW5kZXggPSBza2luc0VudW1bdGhpcy5kZWZhdWx0U2tpbl07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2tpbkluZGV4ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2tpbkluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2tpbnNFbnVtO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNrZWxldG9uRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBza2luc0VudW0gPSB0aGlzLnNrZWxldG9uRGF0YS5nZXRTa2luc0VudW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCAhc2tpbnNFbnVtICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2MuZXJyb3JJRCgnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBza2luTmFtZSA9IHNraW5zRW51bVt2YWx1ZV07XG4gICAgICAgICAgICAgICAgaWYgKHNraW5OYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0U2tpbiA9IHNraW5OYW1lO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFNraW4odGhpcy5kZWZhdWx0U2tpbik7XG4gICAgICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IgJiYgIWNjLmVuZ2luZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hJbnNwZWN0b3IoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3JJRCg3NTAxLCB0aGlzLm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBEZWZhdWx0U2tpbnNFbnVtLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiBcIkRlZmF1bHQgU2tpblwiLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5kZWZhdWx0X3NraW4nXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gdmFsdWUgb2YgMCByZXByZXNlbnRzIG5vIGFuaW1hdGlvblxuICAgICAgICBfYW5pbWF0aW9uSW5kZXg6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFuaW1hdGlvbk5hbWUgPSAoIUNDX0VESVRPUiB8fCBjYy5lbmdpbmUuaXNQbGF5aW5nKSA/IHRoaXMuYW5pbWF0aW9uIDogdGhpcy5kZWZhdWx0QW5pbWF0aW9uO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNrZWxldG9uRGF0YSAmJiBhbmltYXRpb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmltc0VudW0gPSB0aGlzLnNrZWxldG9uRGF0YS5nZXRBbmltc0VudW0oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1zRW51bSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFuaW1JbmRleCA9IGFuaW1zRW51bVthbmltYXRpb25OYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbmltSW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhbmltSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbiA9ICcnO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhbmltc0VudW07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2tlbGV0b25EYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1zRW51bSA9IHRoaXMuc2tlbGV0b25EYXRhLmdldEFuaW1zRW51bSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoICFhbmltc0VudW0gKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYy5lcnJvcklEKDc1MDIsIHRoaXMubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhbmltTmFtZSA9IGFuaW1zRW51bVt2YWx1ZV07XG4gICAgICAgICAgICAgICAgaWYgKGFuaW1OYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRpb24gPSBhbmltTmFtZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmVycm9ySUQoNzUwMywgdGhpcy5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBEZWZhdWx0QW5pbXNFbnVtLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnQW5pbWF0aW9uJyxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2tlbGV0b24uYW5pbWF0aW9uJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFJlY29yZCBwcmUgY2FjaGUgbW9kZS5cbiAgICAgICAgX3ByZUNhY2hlTW9kZTogLTEsXG4gICAgICAgIF9jYWNoZU1vZGU6IEFuaW1hdGlvbkNhY2hlTW9kZS5SRUFMVElNRSxcbiAgICAgICAgX2RlZmF1bHRDYWNoZU1vZGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDAsXG4gICAgICAgICAgICB0eXBlOiBBbmltYXRpb25DYWNoZU1vZGUsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uQ2FjaGVNb2RlKHRoaXMuX2RlZmF1bHRDYWNoZU1vZGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWUsXG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogXCJBbmltYXRpb24gQ2FjaGUgTW9kZVwiLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5hbmltYXRpb25fY2FjaGVfbW9kZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBUT0RPXG4gICAgICAgICAqICEjemgg5piv5ZCm5b6q546v5pKt5pS+5b2T5YmN6aqo6aq85Yqo55S744CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gbG9vcFxuICAgICAgICAgKiBAZGVmYXVsdCB0cnVlXG4gICAgICAgICAqL1xuICAgICAgICBsb29wOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5sb29wJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEluZGljYXRlcyB3aGV0aGVyIHRvIGVuYWJsZSBwcmVtdWx0aXBsaWVkIGFscGhhLlxuICAgICAgICAgKiBZb3Ugc2hvdWxkIGRpc2FibGUgdGhpcyBvcHRpb24gd2hlbiBpbWFnZSdzIHRyYW5zcGFyZW50IGFyZWEgYXBwZWFycyB0byBoYXZlIG9wYXF1ZSBwaXhlbHMsXG4gICAgICAgICAqIG9yIGVuYWJsZSB0aGlzIG9wdGlvbiB3aGVuIGltYWdlJ3MgaGFsZiB0cmFuc3BhcmVudCBhcmVhIGFwcGVhcnMgdG8gYmUgZGFya2VuLlxuICAgICAgICAgKiAhI3poIOaYr+WQpuWQr+eUqOi0tOWbvumihOS5mOOAglxuICAgICAgICAgKiDlvZPlm77niYfnmoTpgI/mmI7ljLrln5/lh7rnjrDoibLlnZfml7bpnIDopoHlhbPpl63or6XpgInpobnvvIzlvZPlm77niYfnmoTljYrpgI/mmI7ljLrln5/popzoibLlj5jpu5Hml7bpnIDopoHlkK/nlKjor6XpgInpobnjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtCb29sZWFufSBwcmVtdWx0aXBsaWVkQWxwaGFcbiAgICAgICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAgICAgKi9cbiAgICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5wcmVtdWx0aXBsaWVkQWxwaGEnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gVGhlIHRpbWUgc2NhbGUgb2YgdGhpcyBza2VsZXRvbi5cbiAgICAgICAgICogISN6aCDlvZPliY3pqqjpqrzkuK3miYDmnInliqjnlLvnmoTml7bpl7TnvKnmlL7njofjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHRpbWVTY2FsZVxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICB0aW1lU2NhbGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLnRpbWVfc2NhbGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gSW5kaWNhdGVzIHdoZXRoZXIgb3BlbiBkZWJ1ZyBzbG90cy5cbiAgICAgICAgICogISN6aCDmmK/lkKbmmL7npLogc2xvdCDnmoQgZGVidWcg5L+h5oGv44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVidWdTbG90c1xuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWdTbG90czoge1xuICAgICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgICBlZGl0b3JPbmx5OiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi5kZWJ1Z19zbG90cycsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURlYnVnRHJhdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEluZGljYXRlcyB3aGV0aGVyIG9wZW4gZGVidWcgYm9uZXMuXG4gICAgICAgICAqICEjemgg5piv5ZCm5pi+56S6IGJvbmUg55qEIGRlYnVnIOS/oeaBr+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGRlYnVnQm9uZXNcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGRlYnVnQm9uZXM6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgZWRpdG9yT25seTogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc2tlbGV0b24uZGVidWdfYm9uZXMnLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVEZWJ1Z0RyYXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBJbmRpY2F0ZXMgd2hldGhlciBvcGVuIGRlYnVnIG1lc2guXG4gICAgICAgICAqICEjemgg5piv5ZCm5pi+56S6IG1lc2gg55qEIGRlYnVnIOS/oeaBr+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGRlYnVnTWVzaFxuICAgICAgICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgICAgICAgKi9cbiAgICAgICAgZGVidWdNZXNoOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIGVkaXRvck9ubHk6IHRydWUsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLmRlYnVnX21lc2gnLFxuICAgICAgICAgICAgbm90aWZ5ICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVEZWJ1Z0RyYXcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBFbmFibGVkIHR3byBjb2xvciB0aW50LlxuICAgICAgICAgKiAhI3poIOaYr+WQpuWQr+eUqOafk+iJsuaViOaenOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHVzZVRpbnRcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIHVzZVRpbnQ6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5za2VsZXRvbi51c2VfdGludCcsXG4gICAgICAgICAgICBub3RpZnkgKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVVzZVRpbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBFbmFibGVkIGJhdGNoIG1vZGVsLCBpZiBza2VsZXRvbiBpcyBjb21wbGV4LCBkbyBub3QgZW5hYmxlIGJhdGNoLCBvciB3aWxsIGxvd2VyIHBlcmZvcm1hbmNlLlxuICAgICAgICAgKiAhI3poIOW8gOWQr+WQiOaJue+8jOWmguaenOa4suafk+Wkp+mHj+ebuOWQjOe6ueeQhu+8jOS4lOe7k+aehOeugOWNleeahOmqqOmqvOWKqOeUu++8jOW8gOWQr+WQiOaJueWPr+S7pemZjeS9jmRyYXdjYWxs77yM5ZCm5YiZ6K+35LiN6KaB5byA5ZCv77yMY3B15raI6ICX5Lya5LiK5Y2H44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZW5hYmxlQmF0Y2hcbiAgICAgICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgICAgICovXG4gICAgICAgIGVuYWJsZUJhdGNoOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICAgIG5vdGlmeSAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQmF0Y2goKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNrZWxldG9uLmVuYWJsZWRfYmF0Y2gnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gQmVsb3cgcHJvcGVydGllcyB3aWxsIGVmZmVjdCB3aGVuIGNhY2hlIG1vZGUgaXMgU0hBUkVEX0NBQ0hFIG9yIFBSSVZBVEVfQ0FDSEUuXG4gICAgICAgIC8vIGFjY3VtdWxhdGUgdGltZVxuICAgICAgICBfYWNjVGltZTogMCxcbiAgICAgICAgLy8gUGxheSB0aW1lcyBjb3VudGVyXG4gICAgICAgIF9wbGF5Q291bnQ6IDAsXG4gICAgICAgIC8vIEZyYW1lIGNhY2hlXG4gICAgICAgIF9mcmFtZUNhY2hlOiBudWxsLFxuICAgICAgICAvLyBDdXIgZnJhbWVcbiAgICAgICAgX2N1ckZyYW1lOiBudWxsLFxuICAgICAgICAvLyBTa2VsZXRvbiBjYWNoZVxuICAgICAgICBfc2tlbGV0b25DYWNoZSA6IG51bGwsXG4gICAgICAgIC8vIEFpbWF0aW9uIG5hbWVcbiAgICAgICAgX2FuaW1hdGlvbk5hbWUgOiBcIlwiLFxuICAgICAgICAvLyBBbmltYXRpb24gcXVldWVcbiAgICAgICAgX2FuaW1hdGlvblF1ZXVlIDogW10sXG4gICAgICAgIC8vIEhlYWQgYW5pbWF0aW9uIGluZm8gb2YgXG4gICAgICAgIF9oZWFkQW5pSW5mbyA6IG51bGwsXG4gICAgICAgIC8vIFBsYXkgdGltZXNcbiAgICAgICAgX3BsYXlUaW1lcyA6IDAsXG4gICAgICAgIC8vIElzIGFuaW1hdGlvbiBjb21wbGV0ZS5cbiAgICAgICAgX2lzQW5pQ29tcGxldGUgOiB0cnVlLFxuICAgIH0sXG5cbiAgICAvLyBDT05TVFJVQ1RPUlxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLl9lZmZlY3REZWxlZ2F0ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3NrZWxldG9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5fcm9vdEJvbmUgPSBudWxsO1xuICAgICAgICB0aGlzLl9saXN0ZW5lciA9IG51bGw7XG4gICAgICAgIHRoaXMuX21hdGVyaWFsQ2FjaGUgPSB7fTtcbiAgICAgICAgdGhpcy5fZGVidWdSZW5kZXJlciA9IG51bGw7XG4gICAgICAgIHRoaXMuX3N0YXJ0U2xvdEluZGV4ID0gLTE7XG4gICAgICAgIHRoaXMuX2VuZFNsb3RJbmRleCA9IC0xO1xuICAgICAgICB0aGlzLl9zdGFydEVudHJ5ID0ge2FuaW1hdGlvbiA6IHtuYW1lIDogXCJcIn0sIHRyYWNrSW5kZXggOiAwfTtcbiAgICAgICAgdGhpcy5fZW5kRW50cnkgPSB7YW5pbWF0aW9uIDoge25hbWUgOiBcIlwifSwgdHJhY2tJbmRleCA6IDB9O1xuICAgICAgICB0aGlzLmF0dGFjaFV0aWwgPSBuZXcgQXR0YWNoVXRpbCgpO1xuICAgIH0sXG5cbiAgICAvLyBvdmVycmlkZSBiYXNlIGNsYXNzIF9nZXREZWZhdWx0TWF0ZXJpYWwgdG8gbW9kaWZ5IGRlZmF1bHQgbWF0ZXJpYWxcbiAgICBfZ2V0RGVmYXVsdE1hdGVyaWFsICgpIHtcbiAgICAgICAgcmV0dXJuIGNjLk1hdGVyaWFsLmdldEJ1aWx0aW5NYXRlcmlhbCgnMmQtc3BpbmUnKTtcbiAgICB9LFxuXG4gICAgLy8gb3ZlcnJpZGUgYmFzZSBjbGFzcyBfdXBkYXRlTWF0ZXJpYWwgdG8gc2V0IGRlZmluZSB2YWx1ZSBhbmQgY2xlYXIgbWF0ZXJpYWwgY2FjaGVcbiAgICBfdXBkYXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBsZXQgdXNlVGludCA9IHRoaXMudXNlVGludCB8fCAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpICYmICFDQ19OQVRJVkVSRU5ERVJFUik7XG4gICAgICAgIGxldCBiYXNlTWF0ZXJpYWwgPSB0aGlzLmdldE1hdGVyaWFsKDApO1xuICAgICAgICBpZiAoYmFzZU1hdGVyaWFsKSB7XG4gICAgICAgICAgICBiYXNlTWF0ZXJpYWwuZGVmaW5lKCdVU0VfVElOVCcsIHVzZVRpbnQpO1xuICAgICAgICAgICAgYmFzZU1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX01PREVMJywgIXRoaXMuZW5hYmxlQmF0Y2gpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hdGVyaWFsQ2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAgLy8gb3ZlcnJpZGUgYmFzZSBjbGFzcyBkaXNhYmxlUmVuZGVyIHRvIGNsZWFyIHBvc3QgcmVuZGVyIGZsYWdcbiAgICBkaXNhYmxlUmVuZGVyICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJGbGFnICY9IH5GTEFHX1BPU1RfUkVOREVSO1xuICAgIH0sXG5cbiAgICAvLyBvdmVycmlkZSBiYXNlIGNsYXNzIGRpc2FibGVSZW5kZXIgdG8gYWRkIHBvc3QgcmVuZGVyIGZsYWdcbiAgICBtYXJrRm9yUmVuZGVyIChlbmFibGUpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoZW5hYmxlKTtcbiAgICAgICAgaWYgKGVuYWJsZSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLl9yZW5kZXJGbGFnIHw9IEZMQUdfUE9TVF9SRU5ERVI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuX3JlbmRlckZsYWcgJj0gfkZMQUdfUE9TVF9SRU5ERVI7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gaWYgY2hhbmdlIHVzZSB0aW50IG1vZGUsIGp1c3QgY2xlYXIgbWF0ZXJpYWwgY2FjaGVcbiAgICBfdXBkYXRlVXNlVGludCAoKSB7XG4gICAgICAgIGxldCBiYXNlTWF0ZXJpYWwgPSB0aGlzLmdldE1hdGVyaWFsKDApO1xuICAgICAgICBpZiAoYmFzZU1hdGVyaWFsKSB7XG4gICAgICAgICAgICBsZXQgdXNlVGludCA9IHRoaXMudXNlVGludCB8fCAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpICYmICFDQ19OQVRJVkVSRU5ERVJFUik7XG4gICAgICAgICAgICBiYXNlTWF0ZXJpYWwuZGVmaW5lKCdVU0VfVElOVCcsIHVzZVRpbnQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hdGVyaWFsQ2FjaGUgPSB7fTtcbiAgICB9LFxuXG4gICAgLy8gaWYgY2hhbmdlIHVzZSBiYXRjaCBtb2RlLCBqdXN0IGNsZWFyIG1hdGVyaWFsIGNhY2hlXG4gICAgX3VwZGF0ZUJhdGNoICgpIHtcbiAgICAgICAgbGV0IGJhc2VNYXRlcmlhbCA9IHRoaXMuZ2V0TWF0ZXJpYWwoMCk7XG4gICAgICAgIGlmIChiYXNlTWF0ZXJpYWwpIHtcbiAgICAgICAgICAgIGJhc2VNYXRlcmlhbC5kZWZpbmUoJ0NDX1VTRV9NT0RFTCcsICF0aGlzLmVuYWJsZUJhdGNoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXRlcmlhbENhY2hlID0ge307XG4gICAgfSxcblxuICAgIF92YWxpZGF0ZVJlbmRlciAoKSB7XG4gICAgICAgIGxldCBza2VsZXRvbkRhdGEgPSB0aGlzLnNrZWxldG9uRGF0YTtcbiAgICAgICAgaWYgKCFza2VsZXRvbkRhdGEgfHwgIXNrZWxldG9uRGF0YS5pc1RleHR1cmVzTG9hZGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzYWJsZVJlbmRlcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXRzIHJ1bnRpbWUgc2tlbGV0b24gZGF0YSB0byBzcC5Ta2VsZXRvbi48YnI+XG4gICAgICogVGhpcyBtZXRob2QgaXMgZGlmZmVyZW50IGZyb20gdGhlIGBza2VsZXRvbkRhdGFgIHByb3BlcnR5LiBUaGlzIG1ldGhvZCBpcyBwYXNzZWQgaW4gdGhlIHJhdyBkYXRhIHByb3ZpZGVkIGJ5IHRoZSBTcGluZSBydW50aW1lLCBhbmQgdGhlIHNrZWxldG9uRGF0YSB0eXBlIGlzIHRoZSBhc3NldCB0eXBlIHByb3ZpZGVkIGJ5IENyZWF0b3IuXG4gICAgICogISN6aFxuICAgICAqIOiuvue9ruW6leWxgui/kOihjOaXtueUqOWIsOeahCBTa2VsZXRvbkRhdGHjgII8YnI+XG4gICAgICog6L+Z5Liq5o6l5Y+j5pyJ5Yir5LqOIGBza2VsZXRvbkRhdGFgIOWxnuaAp++8jOi/meS4quaOpeWPo+S8oOWFpeeahOaYryBTcGluZSBydW50aW1lIOaPkOS+m+eahOWOn+Wni+aVsOaNru+8jOiAjCBza2VsZXRvbkRhdGEg55qE57G75Z6L5pivIENyZWF0b3Ig5o+Q5L6b55qE6LWE5rqQ57G75Z6L44CCXG4gICAgICogQG1ldGhvZCBzZXRTa2VsZXRvbkRhdGFcbiAgICAgKiBAcGFyYW0ge3NwLnNwaW5lLlNrZWxldG9uRGF0YX0gc2tlbGV0b25EYXRhXG4gICAgICovXG4gICAgc2V0U2tlbGV0b25EYXRhIChza2VsZXRvbkRhdGEpIHtcbiAgICAgICAgaWYgKHNrZWxldG9uRGF0YS53aWR0aCAhPSBudWxsICYmIHNrZWxldG9uRGF0YS5oZWlnaHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldENvbnRlbnRTaXplKHNrZWxldG9uRGF0YS53aWR0aCwgc2tlbGV0b25EYXRhLmhlaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUNDX0VESVRPUikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NhY2hlTW9kZSA9PT0gQW5pbWF0aW9uQ2FjaGVNb2RlLlNIQVJFRF9DQUNIRSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uQ2FjaGUgPSBTa2VsZXRvbkNhY2hlLnNoYXJlZENhY2hlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9jYWNoZU1vZGUgPT09IEFuaW1hdGlvbkNhY2hlTW9kZS5QUklWQVRFX0NBQ0hFKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2tlbGV0b25DYWNoZSA9IG5ldyBTa2VsZXRvbkNhY2hlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uQ2FjaGUuZW5hYmxlUHJpdmF0ZU1vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRlYnVnQm9uZXMgfHwgdGhpcy5kZWJ1Z1Nsb3RzKSB7XG4gICAgICAgICAgICAgICAgY2Mud2FybihcIkRlYnVnIGJvbmVzIG9yIHNsb3RzIGlzIGludmFsaWQgaW4gY2FjaGVkIG1vZGVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgc2tlbGV0b25JbmZvID0gdGhpcy5fc2tlbGV0b25DYWNoZS5nZXRTa2VsZXRvbkNhY2hlKHRoaXMuc2tlbGV0b25EYXRhLl91dWlkLCBza2VsZXRvbkRhdGEpO1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b24gPSBza2VsZXRvbkluZm8uc2tlbGV0b247XG4gICAgICAgICAgICB0aGlzLl9jbGlwcGVyID0gc2tlbGV0b25JbmZvLmNsaXBwZXI7XG4gICAgICAgICAgICB0aGlzLl9yb290Qm9uZSA9IHRoaXMuX3NrZWxldG9uLmdldFJvb3RCb25lKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9za2VsZXRvbiA9IG5ldyBzcGluZS5Ta2VsZXRvbihza2VsZXRvbkRhdGEpO1xuICAgICAgICAgICAgdGhpcy5fY2xpcHBlciA9IG5ldyBzcGluZS5Ta2VsZXRvbkNsaXBwaW5nKCk7XG4gICAgICAgICAgICB0aGlzLl9yb290Qm9uZSA9IHRoaXMuX3NrZWxldG9uLmdldFJvb3RCb25lKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1hcmtGb3JSZW5kZXIodHJ1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyBzbG90cyB2aXNpYmxlIHJhbmdlLlxuICAgICAqICEjemgg6K6+572u6aqo6aq85o+S5qe95Y+v6KeG6IyD5Zu044CCXG4gICAgICogQG1ldGhvZCBzZXRTbG90c1JhbmdlXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0U2xvdEluZGV4XG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGVuZFNsb3RJbmRleFxuICAgICAqL1xuICAgIHNldFNsb3RzUmFuZ2UgKHN0YXJ0U2xvdEluZGV4LCBlbmRTbG90SW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgY2Mud2FybihcIlNsb3RzIHZpc2libGUgcmFuZ2UgY2FuIG5vdCBiZSBtb2RpZmllZCBpbiBjYWNoZWQgbW9kZS5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFNsb3RJbmRleCA9IHN0YXJ0U2xvdEluZGV4O1xuICAgICAgICAgICAgdGhpcy5fZW5kU2xvdEluZGV4ID0gZW5kU2xvdEluZGV4O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0cyBhbmltYXRpb24gc3RhdGUgZGF0YS48YnI+XG4gICAgICogVGhlIHBhcmFtZXRlciB0eXBlIGlzIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uQW5pbWF0aW9uU3RhdGVEYXRhLlxuICAgICAqICEjemgg6K6+572u5Yqo55S754q25oCB5pWw5o2u44CCPGJyPlxuICAgICAqIOWPguaVsOaYryB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LkFuaW1hdGlvblN0YXRlRGF0YeOAglxuICAgICAqIEBtZXRob2Qgc2V0QW5pbWF0aW9uU3RhdGVEYXRhXG4gICAgICogQHBhcmFtIHtzcC5zcGluZS5BbmltYXRpb25TdGF0ZURhdGF9IHN0YXRlRGF0YVxuICAgICAqL1xuICAgIHNldEFuaW1hdGlvblN0YXRlRGF0YSAoc3RhdGVEYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIGNjLndhcm4oXCInc2V0QW5pbWF0aW9uU3RhdGVEYXRhJyBpbnRlcmZhY2UgY2FuIG5vdCBiZSBpbnZva2VkIGluIGNhY2hlZCBtb2RlLlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IG5ldyBzcGluZS5BbmltYXRpb25TdGF0ZShzdGF0ZURhdGEpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlLnJlbW92ZUxpc3RlbmVyKHRoaXMuX2xpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RhdGUuYWRkTGlzdGVuZXIodGhpcy5fbGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9LFxuXG4gICAgLy8gSU1QTEVNRU5UXG4gICAgX19wcmVsb2FkICgpIHtcbiAgICAgICAgdGhpcy5fc3VwZXIoKTtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdmFyIEZsYWdzID0gY2MuT2JqZWN0LkZsYWdzO1xuICAgICAgICAgICAgdGhpcy5fb2JqRmxhZ3MgfD0gKEZsYWdzLklzQW5jaG9yTG9ja2VkIHwgRmxhZ3MuSXNTaXplTG9ja2VkKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5fcmVmcmVzaEluc3BlY3RvcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5ub2RlLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQgJiYgY2hpbGQuX25hbWUgPT09IFwiREVCVUdfRFJBV19OT0RFXCIgKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQuZGVzdHJveSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdXBkYXRlU2tlbGV0b25EYXRhKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZURlYnVnRHJhdygpO1xuICAgICAgICB0aGlzLl91cGRhdGVVc2VUaW50KCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUJhdGNoKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJdCdzIGJlc3QgdG8gc2V0IGNhY2hlIG1vZGUgYmVmb3JlIHNldCBwcm9wZXJ0eSAnZHJhZ29uQXNzZXQnLCBvciB3aWxsIHdhc3RlIHNvbWUgY3B1IHRpbWUuXG4gICAgICogSWYgc2V0IHRoZSBtb2RlIGluIGVkaXRvciwgdGhlbiBubyBuZWVkIHRvIHdvcnJ5IGFib3V0IG9yZGVyIHByb2JsZW0uXG4gICAgICogISN6aCBcbiAgICAgKiDoi6Xmg7PliIfmjaLmuLLmn5PmqKHlvI/vvIzmnIDlpb3lnKjorr7nva4nZHJhZ29uQXNzZXQn5LmL5YmN77yM5YWI6K6+572u5aW95riy5p+T5qih5byP77yM5ZCm5YiZ5pyJ6L+Q6KGM5pe25byA6ZSA44CCXG4gICAgICog6Iul5Zyo57yW6L6R5Lit6K6+572u5riy5p+T5qih5byP77yM5YiZ5peg6ZyA5ouF5b+D6K6+572u5qyh5bqP55qE6Zeu6aKY44CCXG4gICAgICogXG4gICAgICogQG1ldGhvZCBzZXRBbmltYXRpb25DYWNoZU1vZGVcbiAgICAgKiBAcGFyYW0ge0FuaW1hdGlvbkNhY2hlTW9kZX0gY2FjaGVNb2RlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBza2VsZXRvbi5zZXRBbmltYXRpb25DYWNoZU1vZGUoc3AuU2tlbGV0b24uQW5pbWF0aW9uQ2FjaGVNb2RlLlNIQVJFRF9DQUNIRSk7XG4gICAgICovXG4gICAgc2V0QW5pbWF0aW9uQ2FjaGVNb2RlIChjYWNoZU1vZGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3ByZUNhY2hlTW9kZSAhPT0gY2FjaGVNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWNoZU1vZGUgPSBjYWNoZU1vZGU7XG4gICAgICAgICAgICB0aGlzLl91cGRhdGVTa2VsZXRvbkRhdGEoKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVVzZVRpbnQoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFdoZXRoZXIgaW4gY2FjaGVkIG1vZGUuXG4gICAgICogISN6aCDlvZPliY3mmK/lkKblpITkuo7nvJPlrZjmqKHlvI/jgIJcbiAgICAgKiBAbWV0aG9kIGlzQW5pbWF0aW9uQ2FjaGVkXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0FuaW1hdGlvbkNhY2hlZCAoKSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlTW9kZSAhPT0gQW5pbWF0aW9uQ2FjaGVNb2RlLlJFQUxUSU1FO1xuICAgIH0sXG5cbiAgICB1cGRhdGUgKGR0KSB7XG4gICAgICAgIGlmIChDQ19FRElUT1IpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMucGF1c2VkKSByZXR1cm47XG5cbiAgICAgICAgZHQgKj0gdGhpcy50aW1lU2NhbGUgKiBzcC50aW1lU2NhbGU7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuXG4gICAgICAgICAgICAvLyBDYWNoZSBtb2RlIGFuZCBoYXMgYW5pbWF0aW9uIHF1ZXVlLlxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzQW5pQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYW5pbWF0aW9uUXVldWUubGVuZ3RoID09PSAwICYmICF0aGlzLl9oZWFkQW5pSW5mbykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZnJhbWVDYWNoZSA9IHRoaXMuX2ZyYW1lQ2FjaGU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmcmFtZUNhY2hlICYmIGZyYW1lQ2FjaGUuaXNJbnZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lQ2FjaGUudXBkYXRlVG9GcmFtZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZyYW1lcyA9IGZyYW1lQ2FjaGUuZnJhbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VyRnJhbWUgPSBmcmFtZXNbZnJhbWVzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9oZWFkQW5pSW5mbykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWFkQW5pSW5mbyA9IHRoaXMuX2FuaW1hdGlvblF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2FjY1RpbWUgKz0gZHQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FjY1RpbWUgPiB0aGlzLl9oZWFkQW5pSW5mby5kZWxheSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYW5pSW5mbyA9IHRoaXMuX2hlYWRBbmlJbmZvO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oZWFkQW5pSW5mbyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0QW5pbWF0aW9uICgwLCBhbmlJbmZvLmFuaW1hdGlvbk5hbWUsIGFuaUluZm8ubG9vcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2FjaGUoZHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUmVhbHRpbWUoZHQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50ICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9saXN0ZW5lcikgcmV0dXJuO1xuICAgICAgICB0aGlzLl9lbmRFbnRyeS5hbmltYXRpb24ubmFtZSA9IHRoaXMuX2FuaW1hdGlvbk5hbWU7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyLmNvbXBsZXRlICYmIHRoaXMuX2xpc3RlbmVyLmNvbXBsZXRlKHRoaXMuX2VuZEVudHJ5KTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIuZW5kICYmIHRoaXMuX2xpc3RlbmVyLmVuZCh0aGlzLl9lbmRFbnRyeSk7XG4gICAgfSxcblxuICAgIF91cGRhdGVDYWNoZSAoZHQpIHtcbiAgICAgICAgbGV0IGZyYW1lQ2FjaGUgPSB0aGlzLl9mcmFtZUNhY2hlO1xuICAgICAgICBpZiAoIWZyYW1lQ2FjaGUuaXNJbml0ZWQoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmcmFtZXMgPSBmcmFtZUNhY2hlLmZyYW1lcztcbiAgICAgICAgbGV0IGZyYW1lVGltZSA9IFNrZWxldG9uQ2FjaGUuRnJhbWVUaW1lO1xuXG4gICAgICAgIC8vIEFuaW1hdGlvbiBTdGFydCwgdGhlIGV2ZW50IGRpZmZyZW50IGZyb20gZHJhZ29uYm9uZXMgaW5uZXIgZXZlbnQsXG4gICAgICAgIC8vIEl0IGhhcyBubyBldmVudCBvYmplY3QuXG4gICAgICAgIGlmICh0aGlzLl9hY2NUaW1lID09IDAgJiYgdGhpcy5fcGxheUNvdW50ID09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0RW50cnkuYW5pbWF0aW9uLm5hbWUgPSB0aGlzLl9hbmltYXRpb25OYW1lO1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXIgJiYgdGhpcy5fbGlzdGVuZXIuc3RhcnQgJiYgdGhpcy5fbGlzdGVuZXIuc3RhcnQodGhpcy5fc3RhcnRFbnRyeSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9hY2NUaW1lICs9IGR0O1xuICAgICAgICBsZXQgZnJhbWVJZHggPSBNYXRoLmZsb29yKHRoaXMuX2FjY1RpbWUgLyBmcmFtZVRpbWUpO1xuICAgICAgICBpZiAoIWZyYW1lQ2FjaGUuaXNDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgIGZyYW1lQ2FjaGUudXBkYXRlVG9GcmFtZShmcmFtZUlkeCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZnJhbWVDYWNoZS5pc0NvbXBsZXRlZCAmJiBmcmFtZUlkeCA+PSBmcmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5Q291bnQgKys7XG4gICAgICAgICAgICBpZiAodGhpcy5fcGxheVRpbWVzID4gMCAmJiB0aGlzLl9wbGF5Q291bnQgPj0gdGhpcy5fcGxheVRpbWVzKSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0IGZyYW1lIHRvIGVuZCBmcmFtZS5cbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJGcmFtZSA9IGZyYW1lc1tmcmFtZXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgdGhpcy5fYWNjVGltZSA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGxheUNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc0FuaUNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50KCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fYWNjVGltZSA9IDA7XG4gICAgICAgICAgICBmcmFtZUlkeCA9IDA7XG4gICAgICAgICAgICB0aGlzLl9lbWl0Q2FjaGVDb21wbGV0ZUV2ZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3VyRnJhbWUgPSBmcmFtZXNbZnJhbWVJZHhdO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlUmVhbHRpbWUgKGR0KSB7XG4gICAgICAgIGxldCBza2VsZXRvbiA9IHRoaXMuX3NrZWxldG9uO1xuICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLl9zdGF0ZTtcbiAgICAgICAgaWYgKHNrZWxldG9uKSB7XG4gICAgICAgICAgICBza2VsZXRvbi51cGRhdGUoZHQpO1xuICAgICAgICAgICAgaWYgKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUudXBkYXRlKGR0KTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hcHBseShza2VsZXRvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHZlcnRleCBlZmZlY3QgZGVsZWdhdGUuXG4gICAgICogISN6aCDorr7nva7pobbngrnliqjnlLvku6PnkIZcbiAgICAgKiBAbWV0aG9kIHNldFZlcnRleEVmZmVjdERlbGVnYXRlXG4gICAgICogQHBhcmFtIHtzcC5WZXJ0ZXhFZmZlY3REZWxlZ2F0ZX0gZWZmZWN0RGVsZWdhdGVcbiAgICAgKi9cbiAgICBzZXRWZXJ0ZXhFZmZlY3REZWxlZ2F0ZSAoZWZmZWN0RGVsZWdhdGUpIHtcbiAgICAgICAgdGhpcy5fZWZmZWN0RGVsZWdhdGUgPSBlZmZlY3REZWxlZ2F0ZTtcbiAgICB9LFxuXG4gICAgLy8gUkVOREVSRVJcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ29tcHV0ZXMgdGhlIHdvcmxkIFNSVCBmcm9tIHRoZSBsb2NhbCBTUlQgZm9yIGVhY2ggYm9uZS5cbiAgICAgKiAhI3poIOmHjeaWsOabtOaWsOaJgOaciemqqOmqvOeahOS4lueVjCBUcmFuc2Zvcm3vvIxcbiAgICAgKiDlvZPojrflj5YgYm9uZSDnmoTmlbDlgLzmnKrmm7TmlrDml7bvvIzljbPlj6/kvb/nlKjor6Xlh73mlbDov5vooYzmm7TmlrDmlbDlgLzjgIJcbiAgICAgKiBAbWV0aG9kIHVwZGF0ZVdvcmxkVHJhbnNmb3JtXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB2YXIgYm9uZSA9IHNwaW5lLmZpbmRCb25lKCdoZWFkJyk7XG4gICAgICogY2MubG9nKGJvbmUud29ybGRYKTsgLy8gcmV0dXJuIDA7XG4gICAgICogc3BpbmUudXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcbiAgICAgKiBib25lID0gc3BpbmUuZmluZEJvbmUoJ2hlYWQnKTtcbiAgICAgKiBjYy5sb2coYm9uZS53b3JsZFgpOyAvLyByZXR1cm4gLTIzLjEyO1xuICAgICAqL1xuICAgIHVwZGF0ZVdvcmxkVHJhbnNmb3JtICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHJldHVybjtcblxuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHRoZSBib25lcyBhbmQgc2xvdHMgdG8gdGhlIHNldHVwIHBvc2UuXG4gICAgICogISN6aCDov5jljp/liLDotbflp4vliqjkvZxcbiAgICAgKiBAbWV0aG9kIHNldFRvU2V0dXBQb3NlXG4gICAgICovXG4gICAgc2V0VG9TZXR1cFBvc2UgKCkge1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uLnNldFRvU2V0dXBQb3NlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFNldHMgdGhlIGJvbmVzIHRvIHRoZSBzZXR1cCBwb3NlLFxuICAgICAqIHVzaW5nIHRoZSB2YWx1ZXMgZnJvbSB0aGUgYEJvbmVEYXRhYCBsaXN0IGluIHRoZSBgU2tlbGV0b25EYXRhYC5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572uIGJvbmUg5Yiw6LW35aeL5Yqo5L2cXG4gICAgICog5L2/55SoIFNrZWxldG9uRGF0YSDkuK3nmoQgQm9uZURhdGEg5YiX6KGo5Lit55qE5YC844CCXG4gICAgICogQG1ldGhvZCBzZXRCb25lc1RvU2V0dXBQb3NlXG4gICAgICovXG4gICAgc2V0Qm9uZXNUb1NldHVwUG9zZSAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgdGhpcy5fc2tlbGV0b24uc2V0Qm9uZXNUb1NldHVwUG9zZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXRzIHRoZSBzbG90cyB0byB0aGUgc2V0dXAgcG9zZSxcbiAgICAgKiB1c2luZyB0aGUgdmFsdWVzIGZyb20gdGhlIGBTbG90RGF0YWAgbGlzdCBpbiB0aGUgYFNrZWxldG9uRGF0YWAuXG4gICAgICogISN6aFxuICAgICAqIOiuvue9riBzbG90IOWIsOi1t+Wni+WKqOS9nOOAglxuICAgICAqIOS9v+eUqCBTa2VsZXRvbkRhdGEg5Lit55qEIFNsb3REYXRhIOWIl+ihqOS4reeahOWAvOOAglxuICAgICAqIEBtZXRob2Qgc2V0U2xvdHNUb1NldHVwUG9zZVxuICAgICAqL1xuICAgIHNldFNsb3RzVG9TZXR1cFBvc2UgKCkge1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uLnNldFNsb3RzVG9TZXR1cFBvc2UoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVXBkYXRpbmcgYW4gYW5pbWF0aW9uIGNhY2hlIHRvIGNhbGN1bGF0ZSBhbGwgZnJhbWUgZGF0YSBpbiB0aGUgYW5pbWF0aW9uIGlzIGEgY29zdCBpbiBcbiAgICAgKiBwZXJmb3JtYW5jZSBkdWUgdG8gY2FsY3VsYXRpbmcgYWxsIGRhdGEgaW4gYSBzaW5nbGUgZnJhbWUuXG4gICAgICogVG8gdXBkYXRlIHRoZSBjYWNoZSwgdXNlIHRoZSBpbnZhbGlkQW5pbWF0aW9uQ2FjaGUgbWV0aG9kIHdpdGggaGlnaCBwZXJmb3JtYW5jZS5cbiAgICAgKiAhI3poXG4gICAgICog5pu05paw5p+Q5Liq5Yqo55S757yT5a2YLCDpooTorqHnrpfliqjnlLvkuK3miYDmnInluKfmlbDmja7vvIznlLHkuo7lnKjljZXluKforqHnrpfmiYDmnInmlbDmja7vvIzmiYDku6XovoPmtojogJfmgKfog73jgIJcbiAgICAgKiDoi6Xmg7Pmm7TmlrDnvJPlrZjvvIzlj6/kvb/nlKggaW52YWxpZEFuaW1hdGlvbkNhY2hlIOaWueazle+8jOWFt+aciei+g+mrmOaAp+iDveOAglxuICAgICAqIEBtZXRob2QgdXBkYXRlQW5pbWF0aW9uQ2FjaGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYW5pbU5hbWVcbiAgICAgKi9cbiAgICB1cGRhdGVBbmltYXRpb25DYWNoZSAoYW5pbU5hbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHJldHVybjtcbiAgICAgICAgbGV0IHV1aWQgPSB0aGlzLnNrZWxldG9uRGF0YS5fdXVpZDtcbiAgICAgICAgaWYgKHRoaXMuX3NrZWxldG9uQ2FjaGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uQ2FjaGUudXBkYXRlQW5pbWF0aW9uQ2FjaGUodXVpZCwgYW5pbU5hbWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJbnZhbGlkYXRlcyB0aGUgYW5pbWF0aW9uIGNhY2hlLCB3aGljaCBpcyB0aGVuIHJlY29tcHV0ZWQgb24gZWFjaCBmcmFtZS4uXG4gICAgICogISN6aFxuICAgICAqIOS9v+WKqOeUu+e8k+WtmOWkseaViO+8jOS5i+WQjuS8muWcqOavj+W4p+mHjeaWsOiuoeeul+OAglxuICAgICAqIEBtZXRob2QgaW52YWxpZEFuaW1hdGlvbkNhY2hlXG4gICAgICovXG4gICAgaW52YWxpZEFuaW1hdGlvbkNhY2hlICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuX3NrZWxldG9uQ2FjaGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uQ2FjaGUuaW52YWxpZEFuaW1hdGlvbkNhY2hlKHRoaXMuc2tlbGV0b25EYXRhLl91dWlkKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRmluZHMgYSBib25lIGJ5IG5hbWUuXG4gICAgICogVGhpcyBkb2VzIGEgc3RyaW5nIGNvbXBhcmlzb24gZm9yIGV2ZXJ5IGJvbmUuPGJyPlxuICAgICAqIFJldHVybnMgYSB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LkJvbmUgb2JqZWN0LlxuICAgICAqICEjemhcbiAgICAgKiDpgJrov4flkI3np7Dmn6Xmib4gYm9uZeOAglxuICAgICAqIOi/memHjOWvueavj+S4qiBib25lIOeahOWQjeensOi/m+ihjOS6huWvueavlOOAgjxicj5cbiAgICAgKiDov5Tlm57kuIDkuKoge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5Cb25lIOWvueixoeOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBmaW5kQm9uZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBib25lTmFtZVxuICAgICAqIEByZXR1cm4ge3NwLnNwaW5lLkJvbmV9XG4gICAgICovXG4gICAgZmluZEJvbmUgKGJvbmVOYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NrZWxldG9uLmZpbmRCb25lKGJvbmVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEZpbmRzIGEgc2xvdCBieSBuYW1lLiBUaGlzIGRvZXMgYSBzdHJpbmcgY29tcGFyaXNvbiBmb3IgZXZlcnkgc2xvdC48YnI+XG4gICAgICogUmV0dXJucyBhIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uU2xvdCBvYmplY3QuXG4gICAgICogISN6aFxuICAgICAqIOmAmui/h+WQjeensOafpeaJviBzbG9044CC6L+Z6YeM5a+55q+P5LiqIHNsb3Qg55qE5ZCN56ew6L+b6KGM5LqG5q+U6L6D44CCPGJyPlxuICAgICAqIOi/lOWbnuS4gOS4qiB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlNsb3Qg5a+56LGh44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGZpbmRTbG90XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNsb3ROYW1lXG4gICAgICogQHJldHVybiB7c3Auc3BpbmUuU2xvdH1cbiAgICAgKi9cbiAgICBmaW5kU2xvdCAoc2xvdE5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NrZWxldG9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2tlbGV0b24uZmluZFNsb3Qoc2xvdE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogRmluZHMgYSBza2luIGJ5IG5hbWUgYW5kIG1ha2VzIGl0IHRoZSBhY3RpdmUgc2tpbi5cbiAgICAgKiBUaGlzIGRvZXMgYSBzdHJpbmcgY29tcGFyaXNvbiBmb3IgZXZlcnkgc2tpbi48YnI+XG4gICAgICogTm90ZSB0aGF0IHNldHRpbmcgdGhlIHNraW4gZG9lcyBub3QgY2hhbmdlIHdoaWNoIGF0dGFjaG1lbnRzIGFyZSB2aXNpYmxlLjxicj5cbiAgICAgKiBSZXR1cm5zIGEge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5Ta2luIG9iamVjdC5cbiAgICAgKiAhI3poXG4gICAgICog5oyJ5ZCN56ew5p+l5om+55qu6IKk77yM5r+A5rS76K+l55qu6IKk44CC6L+Z6YeM5a+55q+P5Liq55qu6IKk55qE5ZCN56ew6L+b6KGM5LqG5q+U6L6D44CCPGJyPlxuICAgICAqIOazqOaEj++8muiuvue9ruearuiCpOS4jeS8muaUueWPmCBhdHRhY2htZW50IOeahOWPr+ingeaAp+OAgjxicj5cbiAgICAgKiDov5Tlm57kuIDkuKoge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5Ta2luIOWvueixoeOAglxuICAgICAqXG4gICAgICogQG1ldGhvZCBzZXRTa2luXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNraW5OYW1lXG4gICAgICovXG4gICAgc2V0U2tpbiAoc2tpbk5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NrZWxldG9uKSB7XG4gICAgICAgICAgICB0aGlzLl9za2VsZXRvbi5zZXRTa2luQnlOYW1lKHNraW5OYW1lKTtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uLnNldFNsb3RzVG9TZXR1cFBvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludmFsaWRBbmltYXRpb25DYWNoZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgYXR0YWNobWVudCBmb3IgdGhlIHNsb3QgYW5kIGF0dGFjaG1lbnQgbmFtZS5cbiAgICAgKiBUaGUgc2tlbGV0b24gbG9va3MgZmlyc3QgaW4gaXRzIHNraW4sIHRoZW4gaW4gdGhlIHNrZWxldG9uIGRhdGHigJlzIGRlZmF1bHQgc2tpbi48YnI+XG4gICAgICogUmV0dXJucyBhIHt7I2Nyb3NzTGlua01vZHVsZSBcInNwLnNwaW5lXCJ9fXNwLnNwaW5le3svY3Jvc3NMaW5rTW9kdWxlfX0uQXR0YWNobWVudCBvYmplY3QuXG4gICAgICogISN6aFxuICAgICAqIOmAmui/hyBzbG90IOWSjCBhdHRhY2htZW50IOeahOWQjeensOiOt+WPliBhdHRhY2htZW5044CCU2tlbGV0b24g5LyY5YWI5p+l5om+5a6D55qE55qu6IKk77yM54S25ZCO5omN5pivIFNrZWxldG9uIERhdGEg5Lit6buY6K6k55qE55qu6IKk44CCPGJyPlxuICAgICAqIOi/lOWbnuS4gOS4qiB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LkF0dGFjaG1lbnQg5a+56LGh44CCXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldEF0dGFjaG1lbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2xvdE5hbWVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYXR0YWNobWVudE5hbWVcbiAgICAgKiBAcmV0dXJuIHtzcC5zcGluZS5BdHRhY2htZW50fVxuICAgICAqL1xuICAgIGdldEF0dGFjaG1lbnQgKHNsb3ROYW1lLCBhdHRhY2htZW50TmFtZSkge1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9za2VsZXRvbi5nZXRBdHRhY2htZW50QnlOYW1lKHNsb3ROYW1lLCBhdHRhY2htZW50TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBTZXRzIHRoZSBhdHRhY2htZW50IGZvciB0aGUgc2xvdCBhbmQgYXR0YWNobWVudCBuYW1lLlxuICAgICAqIFRoZSBza2VsZXRvbiBsb29rcyBmaXJzdCBpbiBpdHMgc2tpbiwgdGhlbiBpbiB0aGUgc2tlbGV0b24gZGF0YeKAmXMgZGVmYXVsdCBza2luLlxuICAgICAqICEjemhcbiAgICAgKiDpgJrov4cgc2xvdCDlkowgYXR0YWNobWVudCDnmoTlkI3lrZfmnaXorr7nva4gYXR0YWNobWVudOOAglxuICAgICAqIFNrZWxldG9uIOS8mOWFiOafpeaJvuWug+eahOearuiCpO+8jOeEtuWQjuaJjeaYryBTa2VsZXRvbiBEYXRhIOS4rem7mOiupOeahOearuiCpOOAglxuICAgICAqIEBtZXRob2Qgc2V0QXR0YWNobWVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzbG90TmFtZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRhY2htZW50TmFtZVxuICAgICAqL1xuICAgIHNldEF0dGFjaG1lbnQgKHNsb3ROYW1lLCBhdHRhY2htZW50TmFtZSkge1xuICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgIHRoaXMuX3NrZWxldG9uLnNldEF0dGFjaG1lbnQoc2xvdE5hbWUsIGF0dGFjaG1lbnROYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmludmFsaWRBbmltYXRpb25DYWNoZSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAqIFJldHVybiB0aGUgcmVuZGVyZXIgb2YgYXR0YWNobWVudC5cbiAgICAqIEBtZXRob2QgZ2V0VGV4dHVyZUF0bGFzXG4gICAgKiBAcGFyYW0ge3NwLnNwaW5lLlJlZ2lvbkF0dGFjaG1lbnR8c3BpbmUuQm91bmRpbmdCb3hBdHRhY2htZW50fSByZWdpb25BdHRhY2htZW50XG4gICAgKiBAcmV0dXJuIHtzcC5zcGluZS5UZXh0dXJlQXRsYXNSZWdpb259XG4gICAgKi9cbiAgICBnZXRUZXh0dXJlQXRsYXMgKHJlZ2lvbkF0dGFjaG1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHJlZ2lvbkF0dGFjaG1lbnQucmVnaW9uO1xuICAgIH0sXG5cbiAgICAvLyBBTklNQVRJT05cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogTWl4IGFwcGxpZXMgYWxsIGtleWZyYW1lIHZhbHVlcyxcbiAgICAgKiBpbnRlcnBvbGF0ZWQgZm9yIHRoZSBzcGVjaWZpZWQgdGltZSBhbmQgbWl4ZWQgd2l0aCB0aGUgY3VycmVudCB2YWx1ZXMuXG4gICAgICogISN6aCDkuLrmiYDmnInlhbPplK7luKforr7lrprmt7flkIjlj4rmt7flkIjml7bpl7TvvIjku47lvZPliY3lgLzlvIDlp4vlt67lgLzvvInjgIJcbiAgICAgKiBAbWV0aG9kIHNldE1peFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmcm9tQW5pbWF0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRvQW5pbWF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGR1cmF0aW9uXG4gICAgICovXG4gICAgc2V0TWl4IChmcm9tQW5pbWF0aW9uLCB0b0FuaW1hdGlvbiwgZHVyYXRpb24pIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZS5kYXRhLnNldE1peChmcm9tQW5pbWF0aW9uLCB0b0FuaW1hdGlvbiwgZHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBjdXJyZW50IGFuaW1hdGlvbi4gQW55IHF1ZXVlZCBhbmltYXRpb25zIGFyZSBjbGVhcmVkLjxicj5cbiAgICAgKiBSZXR1cm5zIGEge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5UcmFja0VudHJ5IG9iamVjdC5cbiAgICAgKiAhI3poIOiuvue9ruW9k+WJjeWKqOeUu+OAgumYn+WIl+S4reeahOS7u+S9leeahOWKqOeUu+Wwhuiiq+a4hemZpOOAgjxicj5cbiAgICAgKiDov5Tlm57kuIDkuKoge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5UcmFja0VudHJ5IOWvueixoeOAglxuICAgICAqIEBtZXRob2Qgc2V0QW5pbWF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRyYWNrSW5kZXhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gbG9vcFxuICAgICAqIEByZXR1cm4ge3NwLnNwaW5lLlRyYWNrRW50cnl9XG4gICAgICovXG4gICAgc2V0QW5pbWF0aW9uICh0cmFja0luZGV4LCBuYW1lLCBsb29wKSB7XG5cbiAgICAgICAgdGhpcy5fcGxheVRpbWVzID0gbG9vcCA/IDAgOiAxO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25OYW1lID0gbmFtZTtcblxuICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICBpZiAodHJhY2tJbmRleCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm4oXCJUcmFjayBpbmRleCBjYW4gbm90IGdyZWF0ZXIgdGhhbiAwIGluIGNhY2hlZCBtb2RlLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5fc2tlbGV0b25DYWNoZSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBsZXQgY2FjaGUgPSB0aGlzLl9za2VsZXRvbkNhY2hlLmdldEFuaW1hdGlvbkNhY2hlKHRoaXMuc2tlbGV0b25EYXRhLl91dWlkLCBuYW1lKTtcbiAgICAgICAgICAgIGlmICghY2FjaGUpIHtcbiAgICAgICAgICAgICAgICBjYWNoZSA9IHRoaXMuX3NrZWxldG9uQ2FjaGUuaW5pdEFuaW1hdGlvbkNhY2hlKHRoaXMuc2tlbGV0b25EYXRhLl91dWlkLCBuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYWNoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzQW5pQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9hY2NUaW1lID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9wbGF5Q291bnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ2FjaGUgPSBjYWNoZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdHRhY2hVdGlsLl9oYXNBdHRhY2hlZE5vZGUoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mcmFtZUNhY2hlLmVuYWJsZUNhY2hlQXR0YWNoZWRJbmZvKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ2FjaGUudXBkYXRlVG9GcmFtZSgwKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdXJGcmFtZSA9IHRoaXMuX2ZyYW1lQ2FjaGUuZnJhbWVzWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3NrZWxldG9uKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFuaW1hdGlvbiA9IHRoaXMuX3NrZWxldG9uLmRhdGEuZmluZEFuaW1hdGlvbihuYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoIWFuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYy5sb2dJRCg3NTA5LCBuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZXMgPSB0aGlzLl9zdGF0ZS5zZXRBbmltYXRpb25XaXRoKHRyYWNrSW5kZXgsIGFuaW1hdGlvbiwgbG9vcCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUuYXBwbHkodGhpcy5fc2tlbGV0b24pO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyBhbiBhbmltYXRpb24gdG8gYmUgcGxheWVkIGRlbGF5IHNlY29uZHMgYWZ0ZXIgdGhlIGN1cnJlbnQgb3IgbGFzdCBxdWV1ZWQgYW5pbWF0aW9uLjxicj5cbiAgICAgKiBSZXR1cm5zIGEge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5UcmFja0VudHJ5IG9iamVjdC5cbiAgICAgKiAhI3poIOa3u+WKoOS4gOS4quWKqOeUu+WIsOWKqOeUu+mYn+WIl+WwvumDqO+8jOi/mOWPr+S7peW7tui/n+aMh+WumueahOenkuaVsOOAgjxicj5cbiAgICAgKiDov5Tlm57kuIDkuKoge3sjY3Jvc3NMaW5rTW9kdWxlIFwic3Auc3BpbmVcIn19c3Auc3BpbmV7ey9jcm9zc0xpbmtNb2R1bGV9fS5UcmFja0VudHJ5IOWvueixoeOAglxuICAgICAqIEBtZXRob2QgYWRkQW5pbWF0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRyYWNrSW5kZXhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gbG9vcFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsYXk9MF1cbiAgICAgKiBAcmV0dXJuIHtzcC5zcGluZS5UcmFja0VudHJ5fVxuICAgICAqL1xuICAgIGFkZEFuaW1hdGlvbiAodHJhY2tJbmRleCwgbmFtZSwgbG9vcCwgZGVsYXkpIHtcbiAgICAgICAgZGVsYXkgPSBkZWxheSB8fCAwO1xuICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICBpZiAodHJhY2tJbmRleCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGNjLndhcm4oXCJUcmFjayBpbmRleCBjYW4gbm90IGdyZWF0ZXIgdGhhbiAwIGluIGNhY2hlZCBtb2RlLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2FuaW1hdGlvblF1ZXVlLnB1c2goe2FuaW1hdGlvbk5hbWUgOiBuYW1lLCBsb29wOiBsb29wLCBkZWxheSA6IGRlbGF5fSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc2tlbGV0b24pIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0aW9uID0gdGhpcy5fc2tlbGV0b24uZGF0YS5maW5kQW5pbWF0aW9uKG5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICghYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZ0lEKDc1MTAsIG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlLmFkZEFuaW1hdGlvbldpdGgodHJhY2tJbmRleCwgYW5pbWF0aW9uLCBsb29wLCBkZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gRmluZCBhbmltYXRpb24gd2l0aCBzcGVjaWZpZWQgbmFtZS5cbiAgICAgKiAhI3poIOafpeaJvuaMh+WumuWQjeensOeahOWKqOeUu1xuICAgICAqIEBtZXRob2QgZmluZEFuaW1hdGlvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gICAgICogQHJldHVybnMge3NwLnNwaW5lLkFuaW1hdGlvbn1cbiAgICAgKi9cbiAgICBmaW5kQW5pbWF0aW9uIChuYW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9za2VsZXRvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NrZWxldG9uLmRhdGEuZmluZEFuaW1hdGlvbihuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRyYWNrIGVudHJ5IGJ5IHRyYWNrSW5kZXguPGJyPlxuICAgICAqIFJldHVybnMgYSB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlRyYWNrRW50cnkgb2JqZWN0LlxuICAgICAqICEjemgg6YCa6L+HIHRyYWNrIOe0ouW8leiOt+WPliBUcmFja0VudHJ544CCPGJyPlxuICAgICAqIOi/lOWbnuS4gOS4qiB7eyNjcm9zc0xpbmtNb2R1bGUgXCJzcC5zcGluZVwifX1zcC5zcGluZXt7L2Nyb3NzTGlua01vZHVsZX19LlRyYWNrRW50cnkg5a+56LGh44CCXG4gICAgICogQG1ldGhvZCBnZXRDdXJyZW50XG4gICAgICogQHBhcmFtIHRyYWNrSW5kZXhcbiAgICAgKiBAcmV0dXJuIHtzcC5zcGluZS5UcmFja0VudHJ5fVxuICAgICAqL1xuICAgIGdldEN1cnJlbnQgKHRyYWNrSW5kZXgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbmltYXRpb25DYWNoZWQoKSkge1xuICAgICAgICAgICAgY2Mud2FybihcIidnZXRDdXJyZW50JyBpbnRlcmZhY2UgY2FuIG5vdCBiZSBpbnZva2VkIGluIGNhY2hlZCBtb2RlLlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZS5nZXRDdXJyZW50KHRyYWNrSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIENsZWFycyBhbGwgdHJhY2tzIG9mIGFuaW1hdGlvbiBzdGF0ZS5cbiAgICAgKiAhI3poIOa4hemZpOaJgOaciSB0cmFjayDnmoTliqjnlLvnirbmgIHjgIJcbiAgICAgKiBAbWV0aG9kIGNsZWFyVHJhY2tzXG4gICAgICovXG4gICAgY2xlYXJUcmFja3MgKCkge1xuICAgICAgICBpZiAodGhpcy5pc0FuaW1hdGlvbkNhY2hlZCgpKSB7XG4gICAgICAgICAgICBjYy53YXJuKFwiJ2NsZWFyVHJhY2tzJyBpbnRlcmZhY2UgY2FuIG5vdCBiZSBpbnZva2VkIGluIGNhY2hlZCBtb2RlLlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlLmNsZWFyVHJhY2tzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBDbGVhcnMgdHJhY2sgb2YgYW5pbWF0aW9uIHN0YXRlIGJ5IHRyYWNrSW5kZXguXG4gICAgICogISN6aCDmuIXpmaTlh7rmjIflrpogdHJhY2sg55qE5Yqo55S754q25oCB44CCXG4gICAgICogQG1ldGhvZCBjbGVhclRyYWNrXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRyYWNrSW5kZXhcbiAgICAgKi9cbiAgICBjbGVhclRyYWNrICh0cmFja0luZGV4KSB7XG4gICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgIGNjLndhcm4oXCInY2xlYXJUcmFjaycgaW50ZXJmYWNlIGNhbiBub3QgYmUgaW52b2tlZCBpbiBjYWNoZWQgbW9kZS5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3RhdGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZS5jbGVhclRyYWNrKHRyYWNrSW5kZXgpO1xuICAgICAgICAgICAgICAgIGlmIChDQ19FRElUT1IgJiYgIWNjLmVuZ2luZS5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUudXBkYXRlKDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgc3RhcnQgZXZlbnQgbGlzdGVuZXIuXG4gICAgICogISN6aCDnlKjmnaXorr7nva7lvIDlp4vmkq3mlL7liqjnlLvnmoTkuovku7bnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFN0YXJ0TGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldFN0YXJ0TGlzdGVuZXIgKGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuX2Vuc3VyZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyLnN0YXJ0ID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBpbnRlcnJ1cHQgZXZlbnQgbGlzdGVuZXIuXG4gICAgICogISN6aCDnlKjmnaXorr7nva7liqjnlLvooqvmiZPmlq3nmoTkuovku7bnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldEludGVycnVwdExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcbiAgICAgKi9cbiAgICBzZXRJbnRlcnJ1cHRMaXN0ZW5lciAobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5fZW5zdXJlTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIuaW50ZXJydXB0ID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBlbmQgZXZlbnQgbGlzdGVuZXIuXG4gICAgICogISN6aCDnlKjmnaXorr7nva7liqjnlLvmkq3mlL7lrozlkI7nmoTkuovku7bnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldEVuZExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbGlzdGVuZXJcbiAgICAgKi9cbiAgICBzZXRFbmRMaXN0ZW5lciAobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5fZW5zdXJlTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIuZW5kID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBkaXNwb3NlIGV2ZW50IGxpc3RlbmVyLlxuICAgICAqICEjemgg55So5p2l6K6+572u5Yqo55S75bCG6KKr6ZSA5q+B55qE5LqL5Lu255uR5ZCs44CCXG4gICAgICogQG1ldGhvZCBzZXREaXNwb3NlTGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldERpc3Bvc2VMaXN0ZW5lciAobGlzdGVuZXIpIHtcbiAgICAgICAgdGhpcy5fZW5zdXJlTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIuZGlzcG9zZSA9IGxpc3RlbmVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgY29tcGxldGUgZXZlbnQgbGlzdGVuZXIuXG4gICAgICogISN6aCDnlKjmnaXorr7nva7liqjnlLvmkq3mlL7kuIDmrKHlvqrnjq/nu5PmnZ/lkI7nmoTkuovku7bnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldENvbXBsZXRlTGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldENvbXBsZXRlTGlzdGVuZXIgKGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuX2Vuc3VyZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyLmNvbXBsZXRlID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBhbmltYXRpb24gZXZlbnQgbGlzdGVuZXIuXG4gICAgICogISN6aCDnlKjmnaXorr7nva7liqjnlLvmkq3mlL7ov4fnqIvkuK3luKfkuovku7bnmoTnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldEV2ZW50TGlzdGVuZXJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldEV2ZW50TGlzdGVuZXIgKGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuX2Vuc3VyZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVyLmV2ZW50ID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBzdGFydCBldmVudCBsaXN0ZW5lciBmb3Igc3BlY2lmaWVkIFRyYWNrRW50cnkuXG4gICAgICogISN6aCDnlKjmnaXkuLrmjIflrprnmoQgVHJhY2tFbnRyeSDorr7nva7liqjnlLvlvIDlp4vmkq3mlL7nmoTkuovku7bnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRyYWNrU3RhcnRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7c3Auc3BpbmUuVHJhY2tFbnRyeX0gZW50cnlcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldFRyYWNrU3RhcnRMaXN0ZW5lciAoZW50cnksIGxpc3RlbmVyKSB7XG4gICAgICAgIFRyYWNrRW50cnlMaXN0ZW5lcnMuZ2V0TGlzdGVuZXJzKGVudHJ5KS5zdGFydCA9IGxpc3RlbmVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgaW50ZXJydXB0IGV2ZW50IGxpc3RlbmVyIGZvciBzcGVjaWZpZWQgVHJhY2tFbnRyeS5cbiAgICAgKiAhI3poIOeUqOadpeS4uuaMh+WumueahCBUcmFja0VudHJ5IOiuvue9ruWKqOeUu+iiq+aJk+aWreeahOS6i+S7tuebkeWQrOOAglxuICAgICAqIEBtZXRob2Qgc2V0VHJhY2tJbnRlcnJ1cHRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7c3Auc3BpbmUuVHJhY2tFbnRyeX0gZW50cnlcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldFRyYWNrSW50ZXJydXB0TGlzdGVuZXIgKGVudHJ5LCBsaXN0ZW5lcikge1xuICAgICAgICBUcmFja0VudHJ5TGlzdGVuZXJzLmdldExpc3RlbmVycyhlbnRyeSkuaW50ZXJydXB0ID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBlbmQgZXZlbnQgbGlzdGVuZXIgZm9yIHNwZWNpZmllZCBUcmFja0VudHJ5LlxuICAgICAqICEjemgg55So5p2l5Li65oyH5a6a55qEIFRyYWNrRW50cnkg6K6+572u5Yqo55S75pKt5pS+57uT5p2f55qE5LqL5Lu255uR5ZCs44CCXG4gICAgICogQG1ldGhvZCBzZXRUcmFja0VuZExpc3RlbmVyXG4gICAgICogQHBhcmFtIHtzcC5zcGluZS5UcmFja0VudHJ5fSBlbnRyeVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gICAgICovXG4gICAgc2V0VHJhY2tFbmRMaXN0ZW5lciAoZW50cnksIGxpc3RlbmVyKSB7XG4gICAgICAgIFRyYWNrRW50cnlMaXN0ZW5lcnMuZ2V0TGlzdGVuZXJzKGVudHJ5KS5lbmQgPSBsaXN0ZW5lcjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXQgdGhlIGRpc3Bvc2UgZXZlbnQgbGlzdGVuZXIgZm9yIHNwZWNpZmllZCBUcmFja0VudHJ5LlxuICAgICAqICEjemgg55So5p2l5Li65oyH5a6a55qEIFRyYWNrRW50cnkg6K6+572u5Yqo55S75Y2z5bCG6KKr6ZSA5q+B55qE5LqL5Lu255uR5ZCs44CCXG4gICAgICogQG1ldGhvZCBzZXRUcmFja0Rpc3Bvc2VMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7c3Auc3BpbmUuVHJhY2tFbnRyeX0gZW50cnlcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldFRyYWNrRGlzcG9zZUxpc3RlbmVyKGVudHJ5LCBsaXN0ZW5lcil7XG4gICAgICAgIFRyYWNrRW50cnlMaXN0ZW5lcnMuZ2V0TGlzdGVuZXJzKGVudHJ5KS5kaXNwb3NlID0gbGlzdGVuZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBjb21wbGV0ZSBldmVudCBsaXN0ZW5lciBmb3Igc3BlY2lmaWVkIFRyYWNrRW50cnkuXG4gICAgICogISN6aCDnlKjmnaXkuLrmjIflrprnmoQgVHJhY2tFbnRyeSDorr7nva7liqjnlLvkuIDmrKHlvqrnjq/mkq3mlL7nu5PmnZ/nmoTkuovku7bnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRyYWNrQ29tcGxldGVMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7c3Auc3BpbmUuVHJhY2tFbnRyeX0gZW50cnlcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7c3Auc3BpbmUuVHJhY2tFbnRyeX0gbGlzdGVuZXIuZW50cnlcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbGlzdGVuZXIubG9vcENvdW50XG4gICAgICovXG4gICAgc2V0VHJhY2tDb21wbGV0ZUxpc3RlbmVyIChlbnRyeSwgbGlzdGVuZXIpIHtcbiAgICAgICAgVHJhY2tFbnRyeUxpc3RlbmVycy5nZXRMaXN0ZW5lcnMoZW50cnkpLmNvbXBsZXRlID0gZnVuY3Rpb24gKHRyYWNrRW50cnkpIHtcbiAgICAgICAgICAgIHZhciBsb29wQ291bnQgPSBNYXRoLmZsb29yKHRyYWNrRW50cnkudHJhY2tUaW1lIC8gdHJhY2tFbnRyeS5hbmltYXRpb25FbmQpOyBcbiAgICAgICAgICAgIGxpc3RlbmVyKHRyYWNrRW50cnksIGxvb3BDb3VudCk7XG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSBldmVudCBsaXN0ZW5lciBmb3Igc3BlY2lmaWVkIFRyYWNrRW50cnkuXG4gICAgICogISN6aCDnlKjmnaXkuLrmjIflrprnmoQgVHJhY2tFbnRyeSDorr7nva7liqjnlLvluKfkuovku7bnmoTnm5HlkKzjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRyYWNrRXZlbnRMaXN0ZW5lclxuICAgICAqIEBwYXJhbSB7c3Auc3BpbmUuVHJhY2tFbnRyeX0gZW50cnlcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgICAqL1xuICAgIHNldFRyYWNrRXZlbnRMaXN0ZW5lciAoZW50cnksIGxpc3RlbmVyKSB7XG4gICAgICAgIFRyYWNrRW50cnlMaXN0ZW5lcnMuZ2V0TGlzdGVuZXJzKGVudHJ5KS5ldmVudCA9IGxpc3RlbmVyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldCB0aGUgYW5pbWF0aW9uIHN0YXRlIG9iamVjdFxuICAgICAqICEjemgg6I635Y+W5Yqo55S754q25oCBXG4gICAgICogQG1ldGhvZCBnZXRTdGF0ZVxuICAgICAqIEByZXR1cm4ge3NwLnNwaW5lLkFuaW1hdGlvblN0YXRlfSBzdGF0ZVxuICAgICAqL1xuICAgIGdldFN0YXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgIH0sXG5cbiAgICAvLyB1cGRhdGUgYW5pbWF0aW9uIGxpc3QgZm9yIGVkaXRvclxuICAgIF91cGRhdGVBbmltRW51bTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFuaW1FbnVtO1xuICAgICAgICBpZiAodGhpcy5za2VsZXRvbkRhdGEpIHtcbiAgICAgICAgICAgIGFuaW1FbnVtID0gdGhpcy5za2VsZXRvbkRhdGEuZ2V0QW5pbXNFbnVtKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hhbmdlIGVudW1cbiAgICAgICAgc2V0RW51bUF0dHIodGhpcywgJ19hbmltYXRpb25JbmRleCcsIGFuaW1FbnVtIHx8IERlZmF1bHRBbmltc0VudW0pO1xuICAgIH0sXG4gICAgLy8gdXBkYXRlIHNraW4gbGlzdCBmb3IgZWRpdG9yXG4gICAgX3VwZGF0ZVNraW5FbnVtOiBDQ19FRElUT1IgJiYgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2tpbkVudW07XG4gICAgICAgIGlmICh0aGlzLnNrZWxldG9uRGF0YSkge1xuICAgICAgICAgICAgc2tpbkVudW0gPSB0aGlzLnNrZWxldG9uRGF0YS5nZXRTa2luc0VudW0oKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjaGFuZ2UgZW51bVxuICAgICAgICBzZXRFbnVtQXR0cih0aGlzLCAnX2RlZmF1bHRTa2luSW5kZXgnLCBza2luRW51bSB8fCBEZWZhdWx0U2tpbnNFbnVtKTtcbiAgICB9LFxuXG4gICAgX2Vuc3VyZUxpc3RlbmVyICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9saXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSBuZXcgVHJhY2tFbnRyeUxpc3RlbmVycygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUuYWRkTGlzdGVuZXIodGhpcy5fbGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVTa2VsZXRvbkRhdGEgKCkge1xuICAgICAgICBpZiAoIXRoaXMuc2tlbGV0b25EYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5za2VsZXRvbkRhdGEuZ2V0UnVudGltZURhdGEoKTtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVSZW5kZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2tlbGV0b25EYXRhKGRhdGEpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFuaW1hdGlvblN0YXRlRGF0YShuZXcgc3BpbmUuQW5pbWF0aW9uU3RhdGVEYXRhKHRoaXMuX3NrZWxldG9uLmRhdGEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdFNraW4gJiYgdGhpcy5zZXRTa2luKHRoaXMuZGVmYXVsdFNraW4pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjYy53YXJuKGUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmF0dGFjaFV0aWwuaW5pdCh0aGlzKTtcbiAgICAgICAgdGhpcy5hdHRhY2hVdGlsLl9hc3NvY2lhdGVBdHRhY2hlZE5vZGUoKTtcbiAgICAgICAgdGhpcy5fcHJlQ2FjaGVNb2RlID0gdGhpcy5fY2FjaGVNb2RlO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IHRoaXMuZGVmYXVsdEFuaW1hdGlvbjtcbiAgICB9LFxuXG4gICAgX3JlZnJlc2hJbnNwZWN0b3IgKCkge1xuICAgICAgICAvLyB1cGRhdGUgaW5zcGVjdG9yXG4gICAgICAgIHRoaXMuX3VwZGF0ZUFuaW1FbnVtKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVNraW5FbnVtKCk7XG4gICAgICAgIEVkaXRvci5VdGlscy5yZWZyZXNoU2VsZWN0ZWRJbnNwZWN0b3IoJ25vZGUnLCB0aGlzLm5vZGUudXVpZCk7XG4gICAgfSxcblxuICAgIF91cGRhdGVEZWJ1Z0RyYXc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVidWdCb25lcyB8fCB0aGlzLmRlYnVnU2xvdHMpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZGVidWdSZW5kZXJlcikge1xuICAgICAgICAgICAgICAgIGxldCBkZWJ1Z0RyYXdOb2RlID0gbmV3IGNjLlByaXZhdGVOb2RlKCk7XG4gICAgICAgICAgICAgICAgZGVidWdEcmF3Tm9kZS5uYW1lID0gJ0RFQlVHX0RSQVdfTk9ERSc7XG4gICAgICAgICAgICAgICAgbGV0IGRlYnVnRHJhdyA9IGRlYnVnRHJhd05vZGUuYWRkQ29tcG9uZW50KEdyYXBoaWNzKTtcbiAgICAgICAgICAgICAgICBkZWJ1Z0RyYXcubGluZVdpZHRoID0gMTtcbiAgICAgICAgICAgICAgICBkZWJ1Z0RyYXcuc3Ryb2tlQ29sb3IgPSBjYy5jb2xvcigyNTUsIDAsIDAsIDI1NSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVidWdSZW5kZXJlciA9IGRlYnVnRHJhdztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fZGVidWdSZW5kZXJlci5ub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQW5pbWF0aW9uQ2FjaGVkKCkpIHtcbiAgICAgICAgICAgICAgICBjYy53YXJuKFwiRGVidWcgYm9uZXMgb3Igc2xvdHMgaXMgaW52YWxpZCBpbiBjYWNoZWQgbW9kZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLl9kZWJ1Z1JlbmRlcmVyKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z1JlbmRlcmVyLm5vZGUucGFyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzcC5Ta2VsZXRvbjtcbiJdfQ==