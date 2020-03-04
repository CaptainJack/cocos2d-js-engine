
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/camera/CCCamera.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _valueTypes = require("../value-types");

var _geomUtils = require("../geom-utils");

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
var AffineTrans = require('../utils/affine-transform');

var renderer = require('../renderer/index');

var RenderFlow = require('../renderer/render-flow');

var game = require('../CCGame');

var RendererCamera = null;

if (CC_JSB && CC_NATIVERENDERER) {
  RendererCamera = window.renderer.Camera;
} else {
  RendererCamera = require('../../renderer/scene/camera');
}

var _mat4_temp_1 = cc.mat4();

var _mat4_temp_2 = cc.mat4();

var _v3_temp_1 = cc.v3();

var _v3_temp_2 = cc.v3();

var _v3_temp_3 = cc.v3();

var _cameras = [];
var _debugCamera = null;

function repositionDebugCamera() {
  if (!_debugCamera) return;

  var node = _debugCamera.getNode();

  var canvas = cc.game.canvas;
  node.z = canvas.height / 1.1566;
  node.x = canvas.width / 2;
  node.y = canvas.height / 2;
}
/**
 * !#en Values for Camera.clearFlags, determining what to clear when rendering a Camera.
 * !#zh 摄像机清除标记位，决定摄像机渲染时会清除哪些状态
 * @enum Camera.ClearFlags
 */


var ClearFlags = cc.Enum({
  /**
   * !#en
   * Clear the background color.
   * !#zh
   * 清除背景颜色
   * @property COLOR
   */
  COLOR: 1,

  /**
   * !#en
   * Clear the depth buffer.
   * !#zh
   * 清除深度缓冲区
   * @property DEPTH
   */
  DEPTH: 2,

  /**
   * !#en
   * Clear the stencil.
   * !#zh
   * 清除模板缓冲区
   * @property STENCIL
   */
  STENCIL: 4
});
var StageFlags = cc.Enum({
  OPAQUE: 1,
  TRANSPARENT: 2
});
/**
 * !#en
 * Camera is usefull when making reel game or other games which need scroll screen.
 * Using camera will be more efficient than moving node to scroll screen.
 * Camera 
 * !#zh
 * 摄像机在制作卷轴或是其他需要移动屏幕的游戏时比较有用，使用摄像机将会比移动节点来移动屏幕更加高效。
 * @class Camera
 * @extends Component
 */

var Camera = cc.Class({
  name: 'cc.Camera',
  "extends": cc.Component,
  ctor: function ctor() {
    if (game.renderType !== game.RENDER_TYPE_CANVAS) {
      var camera = new RendererCamera();
      camera.setStages(['opaque']);
      camera.dirty = true;
      this._inited = false;
      this._camera = camera;
    } else {
      this._inited = true;
    }
  },
  editor: CC_EDITOR && {
    menu: 'i18n:MAIN_MENU.component.others/Camera',
    inspector: 'packages://inspector/inspectors/comps/camera.js',
    executeInEditMode: true
  },
  properties: {
    _cullingMask: 0xffffffff,
    _clearFlags: ClearFlags.DEPTH | ClearFlags.STENCIL,
    _backgroundColor: cc.color(0, 0, 0, 255),
    _depth: 0,
    _zoomRatio: 1,
    _targetTexture: null,
    _fov: 60,
    _orthoSize: 10,
    _nearClip: 1,
    _farClip: 4096,
    _ortho: true,
    _rect: cc.rect(0, 0, 1, 1),
    _renderStages: 1,
    _alignWithScreen: false,

    /**
     * !#en
     * The camera zoom ratio, only support 2D camera.
     * !#zh
     * 摄像机缩放比率, 只支持 2D camera。
     * @property {Number} zoomRatio
     */
    zoomRatio: {
      get: function get() {
        return this._zoomRatio;
      },
      set: function set(value) {
        this._zoomRatio = value;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.zoomRatio'
    },

    /**
     * !#en
     * Field of view. The width of the Camera’s view angle, measured in degrees along the local Y axis.
     * !#zh
     * 决定摄像机视角的宽度，当摄像机处于透视投影模式下这个属性才会生效。
     * @property {Number} fov
     * @default 60
     */
    fov: {
      get: function get() {
        return this._fov;
      },
      set: function set(v) {
        this._fov = v;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.fov'
    },

    /**
     * !#en
     * The viewport size of the Camera when set to orthographic projection.
     * !#zh
     * 摄像机在正交投影模式下的视窗大小。
     * @property {Number} orthoSize
     * @default 10
     */
    orthoSize: {
      get: function get() {
        return this._orthoSize;
      },
      set: function set(v) {
        this._orthoSize = v;
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.orthoSize'
    },

    /**
     * !#en
     * The near clipping plane.
     * !#zh
     * 摄像机的近剪裁面。
     * @property {Number} nearClip
     * @default 0.1
     */
    nearClip: {
      get: function get() {
        return this._nearClip;
      },
      set: function set(v) {
        this._nearClip = v;

        this._updateClippingpPlanes();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.nearClip'
    },

    /**
     * !#en
     * The far clipping plane.
     * !#zh
     * 摄像机的远剪裁面。
     * @property {Number} farClip
     * @default 4096
     */
    farClip: {
      get: function get() {
        return this._farClip;
      },
      set: function set(v) {
        this._farClip = v;

        this._updateClippingpPlanes();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.farClip'
    },

    /**
     * !#en
     * Is the camera orthographic (true) or perspective (false)?
     * !#zh
     * 设置摄像机的投影模式是正交还是透视模式。
     * @property {Boolean} ortho
     * @default false
     */
    ortho: {
      get: function get() {
        return this._ortho;
      },
      set: function set(v) {
        this._ortho = v;

        this._updateProjection();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.ortho'
    },

    /**
     * !#en
     * Four values (0 ~ 1) that indicate where on the screen this camera view will be drawn.
     * !#zh
     * 决定摄像机绘制在屏幕上哪个位置，值为（0 ~ 1）。
     * @property {Rect} rect
     * @default cc.rect(0,0,1,1)
     */
    rect: {
      get: function get() {
        return this._rect;
      },
      set: function set(v) {
        this._rect = v;

        this._updateRect();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.rect'
    },

    /**
     * !#en
     * This is used to render parts of the scene selectively.
     * !#zh
     * 决定摄像机会渲染场景的哪一部分。
     * @property {Number} cullingMask
     */
    cullingMask: {
      get: function get() {
        return this._cullingMask;
      },
      set: function set(value) {
        this._cullingMask = value;

        this._updateCameraMask();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.cullingMask'
    },

    /**
     * !#en
     * Determining what to clear when camera rendering.
     * !#zh
     * 决定摄像机渲染时会清除哪些状态。
     * @property {Camera.ClearFlags} clearFlags
     */
    clearFlags: {
      get: function get() {
        return this._clearFlags;
      },
      set: function set(value) {
        this._clearFlags = value;

        if (this._camera) {
          this._camera.setClearFlags(value);
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.clearFlags'
    },

    /**
     * !#en
     * The color with which the screen will be cleared.
     * !#zh
     * 摄像机用于清除屏幕的背景色。
     * @property {Color} backgroundColor
     */
    backgroundColor: {
      get: function get() {
        return this._backgroundColor;
      },
      set: function set(value) {
        this._backgroundColor = value;

        this._updateBackgroundColor();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.backgroundColor'
    },

    /**
     * !#en
     * Camera's depth in the camera rendering order.
     * !#zh
     * 摄像机深度，用于决定摄像机的渲染顺序。
     * @property {Number} depth
     */
    depth: {
      get: function get() {
        return this._depth;
      },
      set: function set(value) {
        this._depth = value;

        if (this._camera) {
          this._camera.setPriority(value);
        }
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.depth'
    },

    /**
     * !#en
     * Destination render texture.
     * Usually cameras render directly to screen, but for some effects it is useful to make a camera render into a texture.
     * !#zh
     * 摄像机渲染的目标 RenderTexture。
     * 一般摄像机会直接渲染到屏幕上，但是有一些效果可以使用摄像机渲染到 RenderTexture 上再对 RenderTexture 进行处理来实现。
     * @property {RenderTexture} targetTexture
     */
    targetTexture: {
      get: function get() {
        return this._targetTexture;
      },
      set: function set(value) {
        this._targetTexture = value;

        this._updateTargetTexture();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.targetTexture'
    },

    /**
     * !#en
     * Sets the camera's render stages.
     * !#zh
     * 设置摄像机渲染的阶段
     * @property {Number} renderStages
     */
    renderStages: {
      get: function get() {
        return this._renderStages;
      },
      set: function set(val) {
        this._renderStages = val;

        this._updateStages();
      },
      tooltip: CC_DEV && 'i18n:COMPONENT.camera.renderStages'
    },

    /**
     * !#en Whether auto align camera viewport to screen
     * !#zh 是否自动将摄像机的视口对准屏幕
     * @property {Boolean} alignWithScreen
     */
    alignWithScreen: {
      get: function get() {
        return this._alignWithScreen;
      },
      set: function set(v) {
        this._alignWithScreen = v;
      }
    },
    _is3D: {
      get: function get() {
        return this.node && this.node._is3DNode;
      }
    }
  },
  statics: {
    /**
     * !#en
     * The first enabled camera.
     * !#zh
     * 第一个被激活的摄像机。
     * @property {Camera} main
     * @static
     */
    main: null,

    /**
     * !#en
     * All enabled cameras.
     * !#zh
     * 激活的所有摄像机。
     * @property {[Camera]} cameras
     * @static
     */
    cameras: _cameras,
    ClearFlags: ClearFlags,

    /**
     * !#en
     * Get the first camera which the node belong to.
     * !#zh
     * 获取节点所在的第一个摄像机。
     * @method findCamera
     * @param {Node} node 
     * @return {Camera}
     * @static
     */
    findCamera: function findCamera(node) {
      for (var i = 0, l = _cameras.length; i < l; i++) {
        var camera = _cameras[i];

        if (camera.containsNode(node)) {
          return camera;
        }
      }

      return null;
    },
    _findRendererCamera: function _findRendererCamera(node) {
      var cameras = renderer.scene._cameras;

      for (var i = 0; i < cameras._count; i++) {
        if (cameras._data[i]._cullingMask & node._cullingMask) {
          return cameras._data[i];
        }
      }

      return null;
    },
    _setupDebugCamera: function _setupDebugCamera() {
      if (_debugCamera) return;
      if (game.renderType === game.RENDER_TYPE_CANVAS) return;
      var camera = new RendererCamera();
      _debugCamera = camera;
      camera.setStages(['opaque']);
      camera.setFov(Math.PI * 60 / 180);
      camera.setNear(0.1);
      camera.setFar(4096);
      camera.dirty = true;
      camera.cullingMask = 1 << cc.Node.BuiltinGroupIndex.DEBUG;
      camera.setPriority(cc.macro.MAX_ZINDEX);
      camera.setClearFlags(0);
      camera.setColor(0, 0, 0, 0);
      var node = new cc.Node();
      camera.setNode(node);
      repositionDebugCamera();
      cc.view.on('design-resolution-changed', repositionDebugCamera);
      renderer.scene.addCamera(camera);
    }
  },
  _updateCameraMask: function _updateCameraMask() {
    if (this._camera) {
      var mask = this._cullingMask & ~(1 << cc.Node.BuiltinGroupIndex.DEBUG);
      this._camera.cullingMask = mask;
    }
  },
  _updateBackgroundColor: function _updateBackgroundColor() {
    if (!this._camera) return;
    var color = this._backgroundColor;

    this._camera.setColor(color.r / 255, color.g / 255, color.b / 255, color.a / 255);
  },
  _updateTargetTexture: function _updateTargetTexture() {
    if (!this._camera) return;
    var texture = this._targetTexture;

    this._camera.setFrameBuffer(texture ? texture._framebuffer : null);
  },
  _updateClippingpPlanes: function _updateClippingpPlanes() {
    if (!this._camera) return;

    this._camera.setNear(this._nearClip);

    this._camera.setFar(this._farClip);
  },
  _updateProjection: function _updateProjection() {
    if (!this._camera) return;
    var type = this._ortho ? 1 : 0;

    this._camera.setType(type);
  },
  _updateRect: function _updateRect() {
    if (!this._camera) return;
    var rect = this._rect;

    this._camera.setRect(rect.x, rect.y, rect.width, rect.height);
  },
  _updateStages: function _updateStages() {
    var flags = this._renderStages;
    var stages = [];

    if (flags & StageFlags.OPAQUE) {
      stages.push('opaque');
    }

    if (flags & StageFlags.TRANSPARENT) {
      stages.push('transparent');
    }

    this._camera.setStages(stages);
  },
  _init: function _init() {
    if (this._inited) return;
    this._inited = true;
    var camera = this._camera;
    if (!camera) return;
    camera.setNode(this.node);
    camera.setClearFlags(this._clearFlags);
    camera.setPriority(this._depth);

    this._updateBackgroundColor();

    this._updateCameraMask();

    this._updateTargetTexture();

    this._updateClippingpPlanes();

    this._updateProjection();

    this._updateStages();

    this._updateRect();

    this.beforeDraw();
  },
  onLoad: function onLoad() {
    this._init();
  },
  onEnable: function onEnable() {
    if (!CC_EDITOR && game.renderType !== game.RENDER_TYPE_CANVAS) {
      cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
      renderer.scene.addCamera(this._camera);
    }

    _cameras.push(this);
  },
  onDisable: function onDisable() {
    if (!CC_EDITOR && game.renderType !== game.RENDER_TYPE_CANVAS) {
      cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
      renderer.scene.removeCamera(this._camera);
    }

    cc.js.array.remove(_cameras, this);
  },

  /**
   * !#en
   * Get the screen to world matrix, only support 2D camera which alignWithScreen is true.
   * !#zh
   * 获取屏幕坐标系到世界坐标系的矩阵，只适用于 alignWithScreen 为 true 的 2D 摄像机。
   * @method getScreenToWorldMatrix2D
   * @param {Mat4} out - the matrix to receive the result
   * @return {Mat4} out
   */
  getScreenToWorldMatrix2D: function getScreenToWorldMatrix2D(out) {
    this.getWorldToScreenMatrix2D(out);

    _valueTypes.Mat4.invert(out, out);

    return out;
  },

  /**
   * !#en
   * Get the world to camera matrix, only support 2D camera which alignWithScreen is true.
   * !#zh
   * 获取世界坐标系到摄像机坐标系的矩阵，只适用于 alignWithScreen 为 true 的 2D 摄像机。
   * @method getWorldToScreenMatrix2D
   * @param {Mat4} out - the matrix to receive the result
   * @return {Mat4} out
   */
  getWorldToScreenMatrix2D: function getWorldToScreenMatrix2D(out) {
    this.node.getWorldRT(_mat4_temp_1);
    var zoomRatio = this.zoomRatio;
    var _mat4_temp_1m = _mat4_temp_1.m;
    _mat4_temp_1m[0] *= zoomRatio;
    _mat4_temp_1m[1] *= zoomRatio;
    _mat4_temp_1m[4] *= zoomRatio;
    _mat4_temp_1m[5] *= zoomRatio;
    var m12 = _mat4_temp_1m[12];
    var m13 = _mat4_temp_1m[13];
    var center = cc.visibleRect.center;
    _mat4_temp_1m[12] = center.x - (_mat4_temp_1m[0] * m12 + _mat4_temp_1m[4] * m13);
    _mat4_temp_1m[13] = center.y - (_mat4_temp_1m[1] * m12 + _mat4_temp_1m[5] * m13);

    if (out !== _mat4_temp_1) {
      _valueTypes.Mat4.copy(out, _mat4_temp_1);
    }

    return out;
  },

  /**
   * !#en
   * Convert point from screen to world.
   * !#zh
   * 将坐标从屏幕坐标系转换到世界坐标系。
   * @method getScreenToWorldPoint
   * @param {Vec3|Vec2} screenPosition 
   * @param {Vec3|Vec2} [out] 
   * @return {Vec3|Vec2} out
   */
  getScreenToWorldPoint: function getScreenToWorldPoint(screenPosition, out) {
    if (this.node.is3DNode) {
      out = out || new cc.Vec3();

      this._camera.screenToWorld(out, screenPosition, cc.visibleRect.width, cc.visibleRect.height);
    } else {
      out = out || new cc.Vec2();
      this.getScreenToWorldMatrix2D(_mat4_temp_1);

      _valueTypes.Vec2.transformMat4(out, screenPosition, _mat4_temp_1);
    }

    return out;
  },

  /**
   * !#en
   * Convert point from world to screen.
   * !#zh
   * 将坐标从世界坐标系转化到屏幕坐标系。
   * @method getWorldToScreenPoint
   * @param {Vec3|Vec2} worldPosition 
   * @param {Vec3|Vec2} [out] 
   * @return {Vec3|Vec2} out
   */
  getWorldToScreenPoint: function getWorldToScreenPoint(worldPosition, out) {
    if (this.node.is3DNode) {
      out = out || new cc.Vec3();

      this._camera.worldToScreen(out, worldPosition, cc.visibleRect.width, cc.visibleRect.height);
    } else {
      out = out || new cc.Vec2();
      this.getWorldToScreenMatrix2D(_mat4_temp_1);

      _valueTypes.Vec2.transformMat4(out, worldPosition, _mat4_temp_1);
    }

    return out;
  },

  /**
   * !#en
   * Get a ray from screen position
   * !#zh
   * 从屏幕坐标获取一条射线
   * @method getRay
   * @param {Vec2} screenPos
   * @return {Ray}
   */
  getRay: function getRay(screenPos) {
    if (!cc.geomUtils) return screenPos;

    _valueTypes.Vec3.set(_v3_temp_3, screenPos.x, screenPos.y, 1);

    this._camera.screenToWorld(_v3_temp_2, _v3_temp_3, cc.visibleRect.width, cc.visibleRect.height);

    if (this.ortho) {
      _valueTypes.Vec3.set(_v3_temp_3, screenPos.x, screenPos.y, -1);

      this._camera.screenToWorld(_v3_temp_1, _v3_temp_3, cc.visibleRect.width, cc.visibleRect.height);
    } else {
      this.node.getWorldPosition(_v3_temp_1);
    }

    return _geomUtils.Ray.fromPoints(new _geomUtils.Ray(), _v3_temp_1, _v3_temp_2);
  },

  /**
   * !#en
   * Check whether the node is in the camera.
   * !#zh
   * 检测节点是否被此摄像机影响
   * @method containsNode
   * @param {Node} node - the node which need to check
   * @return {Boolean}
   */
  containsNode: function containsNode(node) {
    return node._cullingMask & this.cullingMask;
  },

  /**
   * !#en
   * Render the camera manually.
   * !#zh
   * 手动渲染摄像机。
   * @method render
   * @param {Node} root 
   */
  render: function render(root) {
    root = root || cc.director.getScene();
    if (!root) return null; // force update node world matrix

    this.node.getWorldMatrix(_mat4_temp_1);
    this.beforeDraw();
    RenderFlow.render(root);

    if (!CC_JSB) {
      renderer._forward.renderCamera(this._camera, renderer.scene);
    }
  },
  _onAlignWithScreen: function _onAlignWithScreen() {
    var height = cc.game.canvas.height / cc.view._scaleY;
    var targetTexture = this._targetTexture;

    if (targetTexture) {
      if (CC_EDITOR) {
        height = cc.engine.getDesignResolutionSize().height;
      } else {
        height = cc.visibleRect.height;
      }
    }

    var fov = this._fov * cc.macro.RAD;
    this.node.z = height / (Math.tan(fov / 2) * 2);
    fov = Math.atan(Math.tan(fov / 2) / this.zoomRatio) * 2;

    this._camera.setFov(fov);

    this._camera.setOrthoHeight(height / 2 / this.zoomRatio);

    this.node.setRotation(0, 0, 0, 1);
  },
  beforeDraw: function beforeDraw() {
    if (!this._camera) return;

    if (this._alignWithScreen) {
      this._onAlignWithScreen();
    } else {
      var fov = this._fov * cc.macro.RAD;
      fov = Math.atan(Math.tan(fov / 2) / this.zoomRatio) * 2;

      this._camera.setFov(fov);

      this._camera.setOrthoHeight(this._orthoSize / this.zoomRatio);
    }

    this._camera.dirty = true;
  }
}); // deprecated

cc.js.mixin(Camera.prototype, {
  /**
   * !#en
   * Returns the matrix that transform the node's (local) space coordinates into the camera's space coordinates.
   * !#zh
   * 返回一个将节点坐标系转换到摄像机坐标系下的矩阵
   * @method getNodeToCameraTransform
   * @deprecated since v2.0.0
   * @param {Node} node - the node which should transform
   * @return {AffineTransform}
   */
  getNodeToCameraTransform: function getNodeToCameraTransform(node) {
    var out = AffineTrans.identity();
    node.getWorldMatrix(_mat4_temp_2);

    if (this.containsNode(node)) {
      this.getWorldToCameraMatrix(_mat4_temp_1);

      _valueTypes.Mat4.mul(_mat4_temp_2, _mat4_temp_2, _mat4_temp_1);
    }

    AffineTrans.fromMat4(out, _mat4_temp_2);
    return out;
  },

  /**
   * !#en
   * Conver a camera coordinates point to world coordinates.
   * !#zh
   * 将一个摄像机坐标系下的点转换到世界坐标系下。
   * @method getCameraToWorldPoint
   * @deprecated since v2.1.3
   * @param {Vec2} point - the point which should transform
   * @param {Vec2} [out] - the point to receive the result
   * @return {Vec2} out
   */
  getCameraToWorldPoint: function getCameraToWorldPoint(point, out) {
    return this.getScreenToWorldPoint(point, out);
  },

  /**
   * !#en
   * Conver a world coordinates point to camera coordinates.
   * !#zh
   * 将一个世界坐标系下的点转换到摄像机坐标系下。
   * @method getWorldToCameraPoint
   * @deprecated since v2.1.3
   * @param {Vec2} point 
   * @param {Vec2} [out] - the point to receive the result
   * @return {Vec2} out
   */
  getWorldToCameraPoint: function getWorldToCameraPoint(point, out) {
    return this.getWorldToScreenPoint(point, out);
  },

  /**
   * !#en
   * Get the camera to world matrix
   * !#zh
   * 获取摄像机坐标系到世界坐标系的矩阵
   * @method getCameraToWorldMatrix
   * @deprecated since v2.1.3
   * @param {Mat4} out - the matrix to receive the result
   * @return {Mat4} out
   */
  getCameraToWorldMatrix: function getCameraToWorldMatrix(out) {
    return this.getScreenToWorldMatrix2D(out);
  },

  /**
   * !#en
   * Get the world to camera matrix
   * !#zh
   * 获取世界坐标系到摄像机坐标系的矩阵
   * @method getWorldToCameraMatrix
   * @deprecated since v2.1.3
   * @param {Mat4} out - the matrix to receive the result
   * @return {Mat4} out
   */
  getWorldToCameraMatrix: function getWorldToCameraMatrix(out) {
    return this.getWorldToScreenMatrix2D(out);
  }
});
module.exports = cc.Camera = Camera;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQ2FtZXJhLmpzIl0sIm5hbWVzIjpbIkFmZmluZVRyYW5zIiwicmVxdWlyZSIsInJlbmRlcmVyIiwiUmVuZGVyRmxvdyIsImdhbWUiLCJSZW5kZXJlckNhbWVyYSIsIkNDX0pTQiIsIkNDX05BVElWRVJFTkRFUkVSIiwid2luZG93IiwiQ2FtZXJhIiwiX21hdDRfdGVtcF8xIiwiY2MiLCJtYXQ0IiwiX21hdDRfdGVtcF8yIiwiX3YzX3RlbXBfMSIsInYzIiwiX3YzX3RlbXBfMiIsIl92M190ZW1wXzMiLCJfY2FtZXJhcyIsIl9kZWJ1Z0NhbWVyYSIsInJlcG9zaXRpb25EZWJ1Z0NhbWVyYSIsIm5vZGUiLCJnZXROb2RlIiwiY2FudmFzIiwieiIsImhlaWdodCIsIngiLCJ3aWR0aCIsInkiLCJDbGVhckZsYWdzIiwiRW51bSIsIkNPTE9SIiwiREVQVEgiLCJTVEVOQ0lMIiwiU3RhZ2VGbGFncyIsIk9QQVFVRSIsIlRSQU5TUEFSRU5UIiwiQ2xhc3MiLCJuYW1lIiwiQ29tcG9uZW50IiwiY3RvciIsInJlbmRlclR5cGUiLCJSRU5ERVJfVFlQRV9DQU5WQVMiLCJjYW1lcmEiLCJzZXRTdGFnZXMiLCJkaXJ0eSIsIl9pbml0ZWQiLCJfY2FtZXJhIiwiZWRpdG9yIiwiQ0NfRURJVE9SIiwibWVudSIsImluc3BlY3RvciIsImV4ZWN1dGVJbkVkaXRNb2RlIiwicHJvcGVydGllcyIsIl9jdWxsaW5nTWFzayIsIl9jbGVhckZsYWdzIiwiX2JhY2tncm91bmRDb2xvciIsImNvbG9yIiwiX2RlcHRoIiwiX3pvb21SYXRpbyIsIl90YXJnZXRUZXh0dXJlIiwiX2ZvdiIsIl9vcnRob1NpemUiLCJfbmVhckNsaXAiLCJfZmFyQ2xpcCIsIl9vcnRobyIsIl9yZWN0IiwicmVjdCIsIl9yZW5kZXJTdGFnZXMiLCJfYWxpZ25XaXRoU2NyZWVuIiwiem9vbVJhdGlvIiwiZ2V0Iiwic2V0IiwidmFsdWUiLCJ0b29sdGlwIiwiQ0NfREVWIiwiZm92IiwidiIsIm9ydGhvU2l6ZSIsIm5lYXJDbGlwIiwiX3VwZGF0ZUNsaXBwaW5ncFBsYW5lcyIsImZhckNsaXAiLCJvcnRobyIsIl91cGRhdGVQcm9qZWN0aW9uIiwiX3VwZGF0ZVJlY3QiLCJjdWxsaW5nTWFzayIsIl91cGRhdGVDYW1lcmFNYXNrIiwiY2xlYXJGbGFncyIsInNldENsZWFyRmxhZ3MiLCJiYWNrZ3JvdW5kQ29sb3IiLCJfdXBkYXRlQmFja2dyb3VuZENvbG9yIiwiZGVwdGgiLCJzZXRQcmlvcml0eSIsInRhcmdldFRleHR1cmUiLCJfdXBkYXRlVGFyZ2V0VGV4dHVyZSIsInJlbmRlclN0YWdlcyIsInZhbCIsIl91cGRhdGVTdGFnZXMiLCJhbGlnbldpdGhTY3JlZW4iLCJfaXMzRCIsIl9pczNETm9kZSIsInN0YXRpY3MiLCJtYWluIiwiY2FtZXJhcyIsImZpbmRDYW1lcmEiLCJpIiwibCIsImxlbmd0aCIsImNvbnRhaW5zTm9kZSIsIl9maW5kUmVuZGVyZXJDYW1lcmEiLCJzY2VuZSIsIl9jb3VudCIsIl9kYXRhIiwiX3NldHVwRGVidWdDYW1lcmEiLCJzZXRGb3YiLCJNYXRoIiwiUEkiLCJzZXROZWFyIiwic2V0RmFyIiwiTm9kZSIsIkJ1aWx0aW5Hcm91cEluZGV4IiwiREVCVUciLCJtYWNybyIsIk1BWF9aSU5ERVgiLCJzZXRDb2xvciIsInNldE5vZGUiLCJ2aWV3Iiwib24iLCJhZGRDYW1lcmEiLCJtYXNrIiwiciIsImciLCJiIiwiYSIsInRleHR1cmUiLCJzZXRGcmFtZUJ1ZmZlciIsIl9mcmFtZWJ1ZmZlciIsInR5cGUiLCJzZXRUeXBlIiwic2V0UmVjdCIsImZsYWdzIiwic3RhZ2VzIiwicHVzaCIsIl9pbml0IiwiYmVmb3JlRHJhdyIsIm9uTG9hZCIsIm9uRW5hYmxlIiwiZGlyZWN0b3IiLCJEaXJlY3RvciIsIkVWRU5UX0JFRk9SRV9EUkFXIiwib25EaXNhYmxlIiwib2ZmIiwicmVtb3ZlQ2FtZXJhIiwianMiLCJhcnJheSIsInJlbW92ZSIsImdldFNjcmVlblRvV29ybGRNYXRyaXgyRCIsIm91dCIsImdldFdvcmxkVG9TY3JlZW5NYXRyaXgyRCIsIk1hdDQiLCJpbnZlcnQiLCJnZXRXb3JsZFJUIiwiX21hdDRfdGVtcF8xbSIsIm0iLCJtMTIiLCJtMTMiLCJjZW50ZXIiLCJ2aXNpYmxlUmVjdCIsImNvcHkiLCJnZXRTY3JlZW5Ub1dvcmxkUG9pbnQiLCJzY3JlZW5Qb3NpdGlvbiIsImlzM0ROb2RlIiwiVmVjMyIsInNjcmVlblRvV29ybGQiLCJWZWMyIiwidHJhbnNmb3JtTWF0NCIsImdldFdvcmxkVG9TY3JlZW5Qb2ludCIsIndvcmxkUG9zaXRpb24iLCJ3b3JsZFRvU2NyZWVuIiwiZ2V0UmF5Iiwic2NyZWVuUG9zIiwiZ2VvbVV0aWxzIiwiZ2V0V29ybGRQb3NpdGlvbiIsIlJheSIsImZyb21Qb2ludHMiLCJyZW5kZXIiLCJyb290IiwiZ2V0U2NlbmUiLCJnZXRXb3JsZE1hdHJpeCIsIl9mb3J3YXJkIiwicmVuZGVyQ2FtZXJhIiwiX29uQWxpZ25XaXRoU2NyZWVuIiwiX3NjYWxlWSIsImVuZ2luZSIsImdldERlc2lnblJlc29sdXRpb25TaXplIiwiUkFEIiwidGFuIiwiYXRhbiIsInNldE9ydGhvSGVpZ2h0Iiwic2V0Um90YXRpb24iLCJtaXhpbiIsInByb3RvdHlwZSIsImdldE5vZGVUb0NhbWVyYVRyYW5zZm9ybSIsImlkZW50aXR5IiwiZ2V0V29ybGRUb0NhbWVyYU1hdHJpeCIsIm11bCIsImZyb21NYXQ0IiwiZ2V0Q2FtZXJhVG9Xb3JsZFBvaW50IiwicG9pbnQiLCJnZXRXb3JsZFRvQ2FtZXJhUG9pbnQiLCJnZXRDYW1lcmFUb1dvcmxkTWF0cml4IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQTBCQTs7QUFDQTs7QUEzQkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QkEsSUFBTUEsV0FBVyxHQUFHQyxPQUFPLENBQUMsMkJBQUQsQ0FBM0I7O0FBQ0EsSUFBTUMsUUFBUSxHQUFHRCxPQUFPLENBQUMsbUJBQUQsQ0FBeEI7O0FBQ0EsSUFBTUUsVUFB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QUNIOztBQUNEVixJQUFBQSxXQUFXLENBQUM4TSxRQUFaLENBQXFCakQsR0FBckIsRUFBMEJoSixZQUExQjtBQUNBLFdBQU9nSixHQUFQO0FBQ0gsR0FwQnlCOztBQXNCMUI7Ozs7Ozs7Ozs7O0FBV0FrRCxFQUFBQSxxQkFqQzBCLGlDQWlDSEMsS0FqQ0csRUFpQ0luRCxHQWpDSixFQWlDUztBQUMvQixXQUFPLEtBQUtZLHFCQUFMLENBQTJCdUMsS0FBM0IsRUFBa0NuRCxHQUFsQyxDQUFQO0FBQ0gsR0FuQ3lCOztBQXFDMUI7Ozs7Ozs7Ozs7O0FBV0FvRCxFQUFBQSxxQkFoRDBCLGlDQWdESEQsS0FoREcsRUFnREluRCxHQWhESixFQWdEUztBQUMvQixXQUFPLEtBQUttQixxQkFBTCxDQUEyQmdDLEtBQTNCLEVBQWtDbkQsR0FBbEMsQ0FBUDtBQUNILEdBbER5Qjs7QUFvRDFCOzs7Ozs7Ozs7O0FBVUFxRCxFQUFBQSxzQkE5RDBCLGtDQThERnJELEdBOURFLEVBOERHO0FBQ3pCLFdBQU8sS0FBS0Qsd0JBQUwsQ0FBOEJDLEdBQTlCLENBQVA7QUFDSCxHQWhFeUI7O0FBbUUxQjs7Ozs7Ozs7OztBQVVBK0MsRUFBQUEsc0JBN0UwQixrQ0E2RUYvQyxHQTdFRSxFQTZFRztBQUN6QixXQUFPLEtBQUtDLHdCQUFMLENBQThCRCxHQUE5QixDQUFQO0FBQ0g7QUEvRXlCLENBQTlCO0FBa0ZBc0QsTUFBTSxDQUFDQyxPQUFQLEdBQWlCek0sRUFBRSxDQUFDRixNQUFILEdBQVlBLE1BQTdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXG5cbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5pbXBvcnQgeyBNYXQ0LCBWZWMyLCBWZWMzIH0gZnJvbSAnLi4vdmFsdWUtdHlwZXMnO1xuaW1wb3J0IHsgUmF5IH0gZnJvbSAnLi4vZ2VvbS11dGlscyc7XG5cbmNvbnN0IEFmZmluZVRyYW5zID0gcmVxdWlyZSgnLi4vdXRpbHMvYWZmaW5lLXRyYW5zZm9ybScpO1xuY29uc3QgcmVuZGVyZXIgPSByZXF1aXJlKCcuLi9yZW5kZXJlci9pbmRleCcpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4uL3JlbmRlcmVyL3JlbmRlci1mbG93Jyk7XG5jb25zdCBnYW1lID0gcmVxdWlyZSgnLi4vQ0NHYW1lJyk7XG5cbmxldCBSZW5kZXJlckNhbWVyYSA9IG51bGw7XG5pZiAoQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSKSB7XG4gICAgUmVuZGVyZXJDYW1lcmEgPSB3aW5kb3cucmVuZGVyZXIuQ2FtZXJhO1xufSBlbHNlIHtcbiAgICBSZW5kZXJlckNhbWVyYSA9IHJlcXVpcmUoJy4uLy4uL3JlbmRlcmVyL3NjZW5lL2NhbWVyYScpO1xufVxuXG5sZXQgX21hdDRfdGVtcF8xID0gY2MubWF0NCgpO1xubGV0IF9tYXQ0X3RlbXBfMiA9IGNjLm1hdDQoKTtcblxubGV0IF92M190ZW1wXzEgPSBjYy52MygpO1xubGV0IF92M190ZW1wXzIgPSBjYy52MygpO1xubGV0IF92M190ZW1wXzMgPSBjYy52MygpO1xuXG5sZXQgX2NhbWVyYXMgPSBbXTtcblxubGV0IF9kZWJ1Z0NhbWVyYSA9IG51bGw7XG5cbmZ1bmN0aW9uIHJlcG9zaXRpb25EZWJ1Z0NhbWVyYSAoKSB7XG4gICAgaWYgKCFfZGVidWdDYW1lcmEpIHJldHVybjtcblxuICAgIGxldCBub2RlID0gX2RlYnVnQ2FtZXJhLmdldE5vZGUoKTtcbiAgICBsZXQgY2FudmFzID0gY2MuZ2FtZS5jYW52YXM7XG4gICAgbm9kZS56ID0gY2FudmFzLmhlaWdodCAvIDEuMTU2NjtcbiAgICBub2RlLnggPSBjYW52YXMud2lkdGggLyAyO1xuICAgIG5vZGUueSA9IGNhbnZhcy5oZWlnaHQgLyAyO1xufVxuXG4vKipcbiAqICEjZW4gVmFsdWVzIGZvciBDYW1lcmEuY2xlYXJGbGFncywgZGV0ZXJtaW5pbmcgd2hhdCB0byBjbGVhciB3aGVuIHJlbmRlcmluZyBhIENhbWVyYS5cbiAqICEjemgg5pGE5YOP5py65riF6Zmk5qCH6K6w5L2N77yM5Yaz5a6a5pGE5YOP5py65riy5p+T5pe25Lya5riF6Zmk5ZOq5Lqb54q25oCBXG4gKiBAZW51bSBDYW1lcmEuQ2xlYXJGbGFnc1xuICovXG5sZXQgQ2xlYXJGbGFncyA9IGNjLkVudW0oe1xuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDbGVhciB0aGUgYmFja2dyb3VuZCBjb2xvci5cbiAgICAgKiAhI3poXG4gICAgICog5riF6Zmk6IOM5pmv6aKc6ImyXG4gICAgICogQHByb3BlcnR5IENPTE9SXG4gICAgICovXG4gICAgQ09MT1I6IDEsXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENsZWFyIHRoZSBkZXB0aCBidWZmZXIuXG4gICAgICogISN6aFxuICAgICAqIOa4hemZpOa3seW6pue8k+WGsuWMulxuICAgICAqIEBwcm9wZXJ0eSBERVBUSFxuICAgICAqL1xuICAgIERFUFRIOiAyLFxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDbGVhciB0aGUgc3RlbmNpbC5cbiAgICAgKiAhI3poXG4gICAgICog5riF6Zmk5qih5p2/57yT5Yay5Yy6XG4gICAgICogQHByb3BlcnR5IFNURU5DSUxcbiAgICAgKi9cbiAgICBTVEVOQ0lMOiA0LFxufSk7XG5cbmxldCBTdGFnZUZsYWdzID0gY2MuRW51bSh7XG4gICAgT1BBUVVFOiAxLFxuICAgIFRSQU5TUEFSRU5UOiAyXG59KTtcblxuLyoqXG4gKiAhI2VuXG4gKiBDYW1lcmEgaXMgdXNlZnVsbCB3aGVuIG1ha2luZyByZWVsIGdhbWUgb3Igb3RoZXIgZ2FtZXMgd2hpY2ggbmVlZCBzY3JvbGwgc2NyZWVuLlxuICogVXNpbmcgY2FtZXJhIHdpbGwgYmUgbW9yZSBlZmZpY2llbnQgdGhhbiBtb3Zpbmcgbm9kZSB0byBzY3JvbGwgc2NyZWVuLlxuICogQ2FtZXJhIFxuICogISN6aFxuICog5pGE5YOP5py65Zyo5Yi25L2c5Y236L205oiW5piv5YW25LuW6ZyA6KaB56e75Yqo5bGP5bmV55qE5ri45oiP5pe25q+U6L6D5pyJ55So77yM5L2/55So5pGE5YOP5py65bCG5Lya5q+U56e75Yqo6IqC54K55p2l56e75Yqo5bGP5bmV5pu05Yqg6auY5pWI44CCXG4gKiBAY2xhc3MgQ2FtZXJhXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xubGV0IENhbWVyYSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnY2MuQ2FtZXJhJyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgaWYgKGdhbWUucmVuZGVyVHlwZSAhPT0gZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcbiAgICAgICAgICAgIGxldCBjYW1lcmEgPSBuZXcgUmVuZGVyZXJDYW1lcmEoKTtcblxuICAgICAgICAgICAgY2FtZXJhLnNldFN0YWdlcyhbXG4gICAgICAgICAgICAgICAgJ29wYXF1ZScsXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgY2FtZXJhLmRpcnR5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy5faW5pdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEgPSBjYW1lcmE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGVkaXRvcjogQ0NfRURJVE9SICYmIHtcbiAgICAgICAgbWVudTogJ2kxOG46TUFJTl9NRU5VLmNvbXBvbmVudC5vdGhlcnMvQ2FtZXJhJyxcbiAgICAgICAgaW5zcGVjdG9yOiAncGFja2FnZXM6Ly9pbnNwZWN0b3IvaW5zcGVjdG9ycy9jb21wcy9jYW1lcmEuanMnLFxuICAgICAgICBleGVjdXRlSW5FZGl0TW9kZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9jdWxsaW5nTWFzazogMHhmZmZmZmZmZixcbiAgICAgICAgX2NsZWFyRmxhZ3M6IENsZWFyRmxhZ3MuREVQVEggfCBDbGVhckZsYWdzLlNURU5DSUwsXG4gICAgICAgIF9iYWNrZ3JvdW5kQ29sb3I6IGNjLmNvbG9yKDAsIDAsIDAsIDI1NSksXG4gICAgICAgIF9kZXB0aDogMCxcbiAgICAgICAgX3pvb21SYXRpbzogMSxcbiAgICAgICAgX3RhcmdldFRleHR1cmU6IG51bGwsXG4gICAgICAgIF9mb3Y6IDYwLFxuICAgICAgICBfb3J0aG9TaXplOiAxMCxcbiAgICAgICAgX25lYXJDbGlwOiAxLFxuICAgICAgICBfZmFyQ2xpcDogNDA5NixcbiAgICAgICAgX29ydGhvOiB0cnVlLFxuICAgICAgICBfcmVjdDogY2MucmVjdCgwLCAwLCAxLCAxKSxcbiAgICAgICAgX3JlbmRlclN0YWdlczogMSxcbiAgICAgICAgX2FsaWduV2l0aFNjcmVlbjogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIGNhbWVyYSB6b29tIHJhdGlvLCBvbmx5IHN1cHBvcnQgMkQgY2FtZXJhLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaRhOWDj+acuue8qeaUvuavlOeOhywg5Y+q5pSv5oyBIDJEIGNhbWVyYeOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gem9vbVJhdGlvXG4gICAgICAgICAqL1xuICAgICAgICB6b29tUmF0aW86IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3pvb21SYXRpbztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fem9vbVJhdGlvID0gdmFsdWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5jYW1lcmEuem9vbVJhdGlvJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBGaWVsZCBvZiB2aWV3LiBUaGUgd2lkdGggb2YgdGhlIENhbWVyYeKAmXMgdmlldyBhbmdsZSwgbWVhc3VyZWQgaW4gZGVncmVlcyBhbG9uZyB0aGUgbG9jYWwgWSBheGlzLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWGs+WumuaRhOWDj+acuuinhuinkueahOWuveW6pu+8jOW9k+aRhOWDj+acuuWkhOS6jumAj+inhuaKleW9seaooeW8j+S4i+i/meS4quWxnuaAp+aJjeS8mueUn+aViOOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZm92XG4gICAgICAgICAqIEBkZWZhdWx0IDYwXG4gICAgICAgICAqL1xuICAgICAgICBmb3Y6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZvdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mb3YgPSB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuY2FtZXJhLmZvdicsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogVGhlIHZpZXdwb3J0IHNpemUgb2YgdGhlIENhbWVyYSB3aGVuIHNldCB0byBvcnRob2dyYXBoaWMgcHJvamVjdGlvbi5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmkYTlg4/mnLrlnKjmraPkuqTmipXlvbHmqKHlvI/kuIvnmoTop4bnqpflpKflsI/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IG9ydGhvU2l6ZVxuICAgICAgICAgKiBAZGVmYXVsdCAxMFxuICAgICAgICAgKi9cbiAgICAgICAgb3J0aG9TaXplOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9vcnRob1NpemU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3J0aG9TaXplID0gdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmNhbWVyYS5vcnRob1NpemUnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBuZWFyIGNsaXBwaW5nIHBsYW5lLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaRhOWDj+acuueahOi/keWJquijgemdouOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gbmVhckNsaXBcbiAgICAgICAgICogQGRlZmF1bHQgMC4xXG4gICAgICAgICAqL1xuICAgICAgICBuZWFyQ2xpcDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbmVhckNsaXA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbmVhckNsaXAgPSB2O1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNsaXBwaW5ncFBsYW5lcygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuY2FtZXJhLm5lYXJDbGlwJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgZmFyIGNsaXBwaW5nIHBsYW5lLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOaRhOWDj+acuueahOi/nOWJquijgemdouOAglxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZmFyQ2xpcFxuICAgICAgICAgKiBAZGVmYXVsdCA0MDk2XG4gICAgICAgICAqL1xuICAgICAgICBmYXJDbGlwOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9mYXJDbGlwO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodikge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZhckNsaXAgPSB2O1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUNsaXBwaW5ncFBsYW5lcygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuY2FtZXJhLmZhckNsaXAnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIElzIHRoZSBjYW1lcmEgb3J0aG9ncmFwaGljICh0cnVlKSBvciBwZXJzcGVjdGl2ZSAoZmFsc2UpP1xuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOiuvue9ruaRhOWDj+acuueahOaKleW9seaooeW8j+aYr+ato+S6pOi/mOaYr+mAj+inhuaooeW8j+OAglxuICAgICAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IG9ydGhvXG4gICAgICAgICAqIEBkZWZhdWx0IGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBvcnRobzoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb3J0aG87XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fb3J0aG8gPSB2O1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVByb2plY3Rpb24oKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmNhbWVyYS5vcnRobycsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogRm91ciB2YWx1ZXMgKDAgfiAxKSB0aGF0IGluZGljYXRlIHdoZXJlIG9uIHRoZSBzY3JlZW4gdGhpcyBjYW1lcmEgdmlldyB3aWxsIGJlIGRyYXduLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOWGs+WumuaRhOWDj+acuue7mOWItuWcqOWxj+W5leS4iuWTquS4quS9jee9ru+8jOWAvOS4uu+8iDAgfiAx77yJ44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7UmVjdH0gcmVjdFxuICAgICAgICAgKiBAZGVmYXVsdCBjYy5yZWN0KDAsMCwxLDEpXG4gICAgICAgICAqL1xuICAgICAgICByZWN0OiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWN0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldCAodikge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlY3QgPSB2O1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVJlY3QoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmNhbWVyYS5yZWN0JyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGlzIGlzIHVzZWQgdG8gcmVuZGVyIHBhcnRzIG9mIHRoZSBzY2VuZSBzZWxlY3RpdmVseS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlhrPlrprmkYTlg4/mnLrkvJrmuLLmn5PlnLrmma/nmoTlk6rkuIDpg6jliIbjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGN1bGxpbmdNYXNrXG4gICAgICAgICAqL1xuICAgICAgICBjdWxsaW5nTWFzazoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY3VsbGluZ01hc2s7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1bGxpbmdNYXNrID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ2FtZXJhTWFzaygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuY2FtZXJhLmN1bGxpbmdNYXNrJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBEZXRlcm1pbmluZyB3aGF0IHRvIGNsZWFyIHdoZW4gY2FtZXJhIHJlbmRlcmluZy5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDlhrPlrprmkYTlg4/mnLrmuLLmn5Pml7bkvJrmuIXpmaTlk6rkupvnirbmgIHjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtDYW1lcmEuQ2xlYXJGbGFnc30gY2xlYXJGbGFnc1xuICAgICAgICAgKi9cbiAgICAgICAgY2xlYXJGbGFnczoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2xlYXJGbGFncztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2xlYXJGbGFncyA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jYW1lcmEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FtZXJhLnNldENsZWFyRmxhZ3ModmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmNhbWVyYS5jbGVhckZsYWdzJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBUaGUgY29sb3Igd2l0aCB3aGljaCB0aGUgc2NyZWVuIHdpbGwgYmUgY2xlYXJlZC5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmkYTlg4/mnLrnlKjkuo7muIXpmaTlsY/luZXnmoTog4zmma/oibLjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtDb2xvcn0gYmFja2dyb3VuZENvbG9yXG4gICAgICAgICAqL1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2tncm91bmRDb2xvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fYmFja2dyb3VuZENvbG9yID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQmFja2dyb3VuZENvbG9yKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9vbHRpcDogQ0NfREVWICYmICdpMThuOkNPTVBPTkVOVC5jYW1lcmEuYmFja2dyb3VuZENvbG9yJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBDYW1lcmEncyBkZXB0aCBpbiB0aGUgY2FtZXJhIHJlbmRlcmluZyBvcmRlci5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDmkYTlg4/mnLrmt7HluqbvvIznlKjkuo7lhrPlrprmkYTlg4/mnLrnmoTmuLLmn5Ppobrluo/jgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGRlcHRoXG4gICAgICAgICAqL1xuICAgICAgICBkZXB0aDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVwdGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NhbWVyYSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYW1lcmEuc2V0UHJpb3JpdHkodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmNhbWVyYS5kZXB0aCcsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogRGVzdGluYXRpb24gcmVuZGVyIHRleHR1cmUuXG4gICAgICAgICAqIFVzdWFsbHkgY2FtZXJhcyByZW5kZXIgZGlyZWN0bHkgdG8gc2NyZWVuLCBidXQgZm9yIHNvbWUgZWZmZWN0cyBpdCBpcyB1c2VmdWwgdG8gbWFrZSBhIGNhbWVyYSByZW5kZXIgaW50byBhIHRleHR1cmUuXG4gICAgICAgICAqICEjemhcbiAgICAgICAgICog5pGE5YOP5py65riy5p+T55qE55uu5qCHIFJlbmRlclRleHR1cmXjgIJcbiAgICAgICAgICog5LiA6Iis5pGE5YOP5py65Lya55u05o6l5riy5p+T5Yiw5bGP5bmV5LiK77yM5L2G5piv5pyJ5LiA5Lqb5pWI5p6c5Y+v5Lul5L2/55So5pGE5YOP5py65riy5p+T5YiwIFJlbmRlclRleHR1cmUg5LiK5YaN5a+5IFJlbmRlclRleHR1cmUg6L+b6KGM5aSE55CG5p2l5a6e546w44CCXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7UmVuZGVyVGV4dHVyZX0gdGFyZ2V0VGV4dHVyZVxuICAgICAgICAgKi9cbiAgICAgICAgdGFyZ2V0VGV4dHVyZToge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFyZ2V0VGV4dHVyZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGFyZ2V0VGV4dHVyZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRhcmdldFRleHR1cmUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmNhbWVyYS50YXJnZXRUZXh0dXJlJyxcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBTZXRzIHRoZSBjYW1lcmEncyByZW5kZXIgc3RhZ2VzLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOiuvue9ruaRhOWDj+acuua4suafk+eahOmYtuautVxuICAgICAgICAgKiBAcHJvcGVydHkge051bWJlcn0gcmVuZGVyU3RhZ2VzXG4gICAgICAgICAqL1xuICAgICAgICByZW5kZXJTdGFnZXM6IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlclN0YWdlcztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlclN0YWdlcyA9IHZhbDtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVTdGFnZXMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULmNhbWVyYS5yZW5kZXJTdGFnZXMnLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFdoZXRoZXIgYXV0byBhbGlnbiBjYW1lcmEgdmlld3BvcnQgdG8gc2NyZWVuXG4gICAgICAgICAqICEjemgg5piv5ZCm6Ieq5Yqo5bCG5pGE5YOP5py655qE6KeG5Y+j5a+55YeG5bGP5bmVXG4gICAgICAgICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYWxpZ25XaXRoU2NyZWVuXG4gICAgICAgICAqL1xuICAgICAgICBhbGlnbldpdGhTY3JlZW46IHtcbiAgICAgICAgICAgIGdldCAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FsaWduV2l0aFNjcmVlbjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9hbGlnbldpdGhTY3JlZW4gPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9pczNEOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5vZGUgJiYgdGhpcy5ub2RlLl9pczNETm9kZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuXG4gICAgICAgICAqIFRoZSBmaXJzdCBlbmFibGVkIGNhbWVyYS5cbiAgICAgICAgICogISN6aFxuICAgICAgICAgKiDnrKzkuIDkuKrooqvmv4DmtLvnmoTmkYTlg4/mnLrjgIJcbiAgICAgICAgICogQHByb3BlcnR5IHtDYW1lcmF9IG1haW5cbiAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgKi9cbiAgICAgICAgbWFpbjogbnVsbCxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlblxuICAgICAgICAgKiBBbGwgZW5hYmxlZCBjYW1lcmFzLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOa/gOa0u+eahOaJgOacieaRhOWDj+acuuOAglxuICAgICAgICAgKiBAcHJvcGVydHkge1tDYW1lcmFdfSBjYW1lcmFzXG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIGNhbWVyYXM6IF9jYW1lcmFzLFxuXG4gICAgICAgIENsZWFyRmxhZ3M6IENsZWFyRmxhZ3MsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW5cbiAgICAgICAgICogR2V0IHRoZSBmaXJzdCBjYW1lcmEgd2hpY2ggdGhlIG5vZGUgYmVsb25nIHRvLlxuICAgICAgICAgKiAhI3poXG4gICAgICAgICAqIOiOt+WPluiKgueCueaJgOWcqOeahOesrOS4gOS4quaRhOWDj+acuuOAglxuICAgICAgICAgKiBAbWV0aG9kIGZpbmRDYW1lcmFcbiAgICAgICAgICogQHBhcmFtIHtOb2RlfSBub2RlIFxuICAgICAgICAgKiBAcmV0dXJuIHtDYW1lcmF9XG4gICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICovXG4gICAgICAgIGZpbmRDYW1lcmEgKG5vZGUpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gX2NhbWVyYXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNhbWVyYSA9IF9jYW1lcmFzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjYW1lcmEuY29udGFpbnNOb2RlKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYW1lcmE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICBfZmluZFJlbmRlcmVyQ2FtZXJhIChub2RlKSB7XG4gICAgICAgICAgICBsZXQgY2FtZXJhcyA9IHJlbmRlcmVyLnNjZW5lLl9jYW1lcmFzO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYW1lcmFzLl9jb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNhbWVyYXMuX2RhdGFbaV0uX2N1bGxpbmdNYXNrICYgbm9kZS5fY3VsbGluZ01hc2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbWVyYXMuX2RhdGFbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3NldHVwRGVidWdDYW1lcmEgKCkge1xuICAgICAgICAgICAgaWYgKF9kZWJ1Z0NhbWVyYSkgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKGdhbWUucmVuZGVyVHlwZSA9PT0gZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHJldHVybjtcbiAgICAgICAgICAgIGxldCBjYW1lcmEgPSBuZXcgUmVuZGVyZXJDYW1lcmEoKTtcbiAgICAgICAgICAgIF9kZWJ1Z0NhbWVyYSA9IGNhbWVyYTtcblxuICAgICAgICAgICAgY2FtZXJhLnNldFN0YWdlcyhbXG4gICAgICAgICAgICAgICAgJ29wYXF1ZScsXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FtZXJhLnNldEZvdihNYXRoLlBJICogNjAgLyAxODApO1xuICAgICAgICAgICAgY2FtZXJhLnNldE5lYXIoMC4xKTtcbiAgICAgICAgICAgIGNhbWVyYS5zZXRGYXIoNDA5Nik7XG5cbiAgICAgICAgICAgIGNhbWVyYS5kaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIGNhbWVyYS5jdWxsaW5nTWFzayA9IDEgPDwgY2MuTm9kZS5CdWlsdGluR3JvdXBJbmRleC5ERUJVRztcbiAgICAgICAgICAgIGNhbWVyYS5zZXRQcmlvcml0eShjYy5tYWNyby5NQVhfWklOREVYKTtcbiAgICAgICAgICAgIGNhbWVyYS5zZXRDbGVhckZsYWdzKDApO1xuICAgICAgICAgICAgY2FtZXJhLnNldENvbG9yKDAsIDAsIDAsIDApO1xuXG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBjYy5Ob2RlKCk7XG4gICAgICAgICAgICBjYW1lcmEuc2V0Tm9kZShub2RlKTtcblxuICAgICAgICAgICAgcmVwb3NpdGlvbkRlYnVnQ2FtZXJhKCk7XG4gICAgICAgICAgICBjYy52aWV3Lm9uKCdkZXNpZ24tcmVzb2x1dGlvbi1jaGFuZ2VkJywgcmVwb3NpdGlvbkRlYnVnQ2FtZXJhKTtcblxuICAgICAgICAgICAgcmVuZGVyZXIuc2NlbmUuYWRkQ2FtZXJhKGNhbWVyYSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZUNhbWVyYU1hc2sgKCkge1xuICAgICAgICBpZiAodGhpcy5fY2FtZXJhKSB7XG4gICAgICAgICAgICBsZXQgbWFzayA9IHRoaXMuX2N1bGxpbmdNYXNrICYgKH4oMSA8PCBjYy5Ob2RlLkJ1aWx0aW5Hcm91cEluZGV4LkRFQlVHKSk7XG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuY3VsbGluZ01hc2sgPSBtYXNrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91cGRhdGVCYWNrZ3JvdW5kQ29sb3IgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBjb2xvciA9IHRoaXMuX2JhY2tncm91bmRDb2xvcjtcbiAgICAgICAgdGhpcy5fY2FtZXJhLnNldENvbG9yKFxuICAgICAgICAgICAgY29sb3IuciAvIDI1NSxcbiAgICAgICAgICAgIGNvbG9yLmcgLyAyNTUsXG4gICAgICAgICAgICBjb2xvci5iIC8gMjU1LFxuICAgICAgICAgICAgY29sb3IuYSAvIDI1NSxcbiAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZVRhcmdldFRleHR1cmUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCB0ZXh0dXJlID0gdGhpcy5fdGFyZ2V0VGV4dHVyZTtcbiAgICAgICAgdGhpcy5fY2FtZXJhLnNldEZyYW1lQnVmZmVyKHRleHR1cmUgPyB0ZXh0dXJlLl9mcmFtZWJ1ZmZlciA6IG51bGwpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlQ2xpcHBpbmdwUGxhbmVzICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jYW1lcmEpIHJldHVybjtcbiAgICAgICAgdGhpcy5fY2FtZXJhLnNldE5lYXIodGhpcy5fbmVhckNsaXApO1xuICAgICAgICB0aGlzLl9jYW1lcmEuc2V0RmFyKHRoaXMuX2ZhckNsaXApO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlUHJvamVjdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fY2FtZXJhKSByZXR1cm47XG4gICAgICAgIGxldCB0eXBlID0gdGhpcy5fb3J0aG8gPyAxIDogMDtcbiAgICAgICAgdGhpcy5fY2FtZXJhLnNldFR5cGUodHlwZSk7XG4gICAgfSxcblxuICAgIF91cGRhdGVSZWN0ICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jYW1lcmEpIHJldHVybjtcbiAgICAgICAgbGV0IHJlY3QgPSB0aGlzLl9yZWN0O1xuICAgICAgICB0aGlzLl9jYW1lcmEuc2V0UmVjdChyZWN0LngsIHJlY3QueSwgcmVjdC53aWR0aCwgcmVjdC5oZWlnaHQpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlU3RhZ2VzICgpIHtcbiAgICAgICAgbGV0IGZsYWdzID0gdGhpcy5fcmVuZGVyU3RhZ2VzO1xuICAgICAgICBsZXQgc3RhZ2VzID0gW107XG4gICAgICAgIGlmIChmbGFncyAmIFN0YWdlRmxhZ3MuT1BBUVVFKSB7XG4gICAgICAgICAgICBzdGFnZXMucHVzaCgnb3BhcXVlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZsYWdzICYgU3RhZ2VGbGFncy5UUkFOU1BBUkVOVCkge1xuICAgICAgICAgICAgc3RhZ2VzLnB1c2goJ3RyYW5zcGFyZW50Jyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2FtZXJhLnNldFN0YWdlcyhzdGFnZXMpO1xuICAgIH0sXG5cbiAgICBfaW5pdCAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbml0ZWQpIHJldHVybjtcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcblxuICAgICAgICBsZXQgY2FtZXJhID0gdGhpcy5fY2FtZXJhO1xuICAgICAgICBpZiAoIWNhbWVyYSkgcmV0dXJuO1xuICAgICAgICBjYW1lcmEuc2V0Tm9kZSh0aGlzLm5vZGUpO1xuICAgICAgICBjYW1lcmEuc2V0Q2xlYXJGbGFncyh0aGlzLl9jbGVhckZsYWdzKTtcbiAgICAgICAgY2FtZXJhLnNldFByaW9yaXR5KHRoaXMuX2RlcHRoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlQmFja2dyb3VuZENvbG9yKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUNhbWVyYU1hc2soKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVGFyZ2V0VGV4dHVyZSgpO1xuICAgICAgICB0aGlzLl91cGRhdGVDbGlwcGluZ3BQbGFuZXMoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUHJvamVjdGlvbigpO1xuICAgICAgICB0aGlzLl91cGRhdGVTdGFnZXMoKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUmVjdCgpO1xuICAgICAgICB0aGlzLmJlZm9yZURyYXcoKTtcbiAgICB9LFxuXG4gICAgb25Mb2FkICgpIHtcbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIGlmICghQ0NfRURJVE9SICYmIGdhbWUucmVuZGVyVHlwZSAhPT0gZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcbiAgICAgICAgICAgIGNjLmRpcmVjdG9yLm9uKGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXLCB0aGlzLmJlZm9yZURyYXcsIHRoaXMpO1xuICAgICAgICAgICAgcmVuZGVyZXIuc2NlbmUuYWRkQ2FtZXJhKHRoaXMuX2NhbWVyYSk7XG4gICAgICAgIH1cbiAgICAgICAgX2NhbWVyYXMucHVzaCh0aGlzKTtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlICgpIHtcbiAgICAgICAgaWYgKCFDQ19FRElUT1IgJiYgZ2FtZS5yZW5kZXJUeXBlICE9PSBnYW1lLlJFTkRFUl9UWVBFX0NBTlZBUykge1xuICAgICAgICAgICAgY2MuZGlyZWN0b3Iub2ZmKGNjLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXLCB0aGlzLmJlZm9yZURyYXcsIHRoaXMpO1xuICAgICAgICAgICAgcmVuZGVyZXIuc2NlbmUucmVtb3ZlQ2FtZXJhKHRoaXMuX2NhbWVyYSk7XG4gICAgICAgIH1cbiAgICAgICAgY2MuanMuYXJyYXkucmVtb3ZlKF9jYW1lcmFzLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgc2NyZWVuIHRvIHdvcmxkIG1hdHJpeCwgb25seSBzdXBwb3J0IDJEIGNhbWVyYSB3aGljaCBhbGlnbldpdGhTY3JlZW4gaXMgdHJ1ZS5cbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5bGP5bmV5Z2Q5qCH57O75Yiw5LiW55WM5Z2Q5qCH57O755qE55+p6Zi177yM5Y+q6YCC55So5LqOIGFsaWduV2l0aFNjcmVlbiDkuLogdHJ1ZSDnmoQgMkQg5pGE5YOP5py644CCXG4gICAgICogQG1ldGhvZCBnZXRTY3JlZW5Ub1dvcmxkTWF0cml4MkRcbiAgICAgKiBAcGFyYW0ge01hdDR9IG91dCAtIHRoZSBtYXRyaXggdG8gcmVjZWl2ZSB0aGUgcmVzdWx0XG4gICAgICogQHJldHVybiB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgZ2V0U2NyZWVuVG9Xb3JsZE1hdHJpeDJEIChvdXQpIHtcbiAgICAgICAgdGhpcy5nZXRXb3JsZFRvU2NyZWVuTWF0cml4MkQob3V0KTtcbiAgICAgICAgTWF0NC5pbnZlcnQob3V0LCBvdXQpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IHRoZSB3b3JsZCB0byBjYW1lcmEgbWF0cml4LCBvbmx5IHN1cHBvcnQgMkQgY2FtZXJhIHdoaWNoIGFsaWduV2l0aFNjcmVlbiBpcyB0cnVlLlxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bkuJbnlYzlnZDmoIfns7vliLDmkYTlg4/mnLrlnZDmoIfns7vnmoTnn6npmLXvvIzlj6rpgILnlKjkuo4gYWxpZ25XaXRoU2NyZWVuIOS4uiB0cnVlIOeahCAyRCDmkYTlg4/mnLrjgIJcbiAgICAgKiBAbWV0aG9kIGdldFdvcmxkVG9TY3JlZW5NYXRyaXgyRFxuICAgICAqIEBwYXJhbSB7TWF0NH0gb3V0IC0gdGhlIG1hdHJpeCB0byByZWNlaXZlIHRoZSByZXN1bHRcbiAgICAgKiBAcmV0dXJuIHtNYXQ0fSBvdXRcbiAgICAgKi9cbiAgICBnZXRXb3JsZFRvU2NyZWVuTWF0cml4MkQgKG91dCkge1xuICAgICAgICB0aGlzLm5vZGUuZ2V0V29ybGRSVChfbWF0NF90ZW1wXzEpO1xuXG4gICAgICAgIGxldCB6b29tUmF0aW8gPSB0aGlzLnpvb21SYXRpbztcbiAgICAgICAgbGV0IF9tYXQ0X3RlbXBfMW0gPSBfbWF0NF90ZW1wXzEubTtcbiAgICAgICAgX21hdDRfdGVtcF8xbVswXSAqPSB6b29tUmF0aW87XG4gICAgICAgIF9tYXQ0X3RlbXBfMW1bMV0gKj0gem9vbVJhdGlvO1xuICAgICAgICBfbWF0NF90ZW1wXzFtWzRdICo9IHpvb21SYXRpbztcbiAgICAgICAgX21hdDRfdGVtcF8xbVs1XSAqPSB6b29tUmF0aW87XG5cbiAgICAgICAgbGV0IG0xMiA9IF9tYXQ0X3RlbXBfMW1bMTJdO1xuICAgICAgICBsZXQgbTEzID0gX21hdDRfdGVtcF8xbVsxM107XG5cbiAgICAgICAgbGV0IGNlbnRlciA9IGNjLnZpc2libGVSZWN0LmNlbnRlcjtcbiAgICAgICAgX21hdDRfdGVtcF8xbVsxMl0gPSBjZW50ZXIueCAtIChfbWF0NF90ZW1wXzFtWzBdICogbTEyICsgX21hdDRfdGVtcF8xbVs0XSAqIG0xMyk7XG4gICAgICAgIF9tYXQ0X3RlbXBfMW1bMTNdID0gY2VudGVyLnkgLSAoX21hdDRfdGVtcF8xbVsxXSAqIG0xMiArIF9tYXQ0X3RlbXBfMW1bNV0gKiBtMTMpO1xuXG4gICAgICAgIGlmIChvdXQgIT09IF9tYXQ0X3RlbXBfMSkge1xuICAgICAgICAgICAgTWF0NC5jb3B5KG91dCwgX21hdDRfdGVtcF8xKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29udmVydCBwb2ludCBmcm9tIHNjcmVlbiB0byB3b3JsZC5cbiAgICAgKiAhI3poXG4gICAgICog5bCG5Z2Q5qCH5LuO5bGP5bmV5Z2Q5qCH57O76L2s5o2i5Yiw5LiW55WM5Z2Q5qCH57O744CCXG4gICAgICogQG1ldGhvZCBnZXRTY3JlZW5Ub1dvcmxkUG9pbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjMn0gc2NyZWVuUG9zaXRpb24gXG4gICAgICogQHBhcmFtIHtWZWMzfFZlYzJ9IFtvdXRdIFxuICAgICAqIEByZXR1cm4ge1ZlYzN8VmVjMn0gb3V0XG4gICAgICovXG4gICAgZ2V0U2NyZWVuVG9Xb3JsZFBvaW50IChzY3JlZW5Qb3NpdGlvbiwgb3V0KSB7XG4gICAgICAgIGlmICh0aGlzLm5vZGUuaXMzRE5vZGUpIHtcbiAgICAgICAgICAgIG91dCA9IG91dCB8fCBuZXcgY2MuVmVjMygpO1xuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLnNjcmVlblRvV29ybGQob3V0LCBzY3JlZW5Qb3NpdGlvbiwgY2MudmlzaWJsZVJlY3Qud2lkdGgsIGNjLnZpc2libGVSZWN0LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0U2NyZWVuVG9Xb3JsZE1hdHJpeDJEKF9tYXQ0X3RlbXBfMSk7XG4gICAgICAgICAgICBWZWMyLnRyYW5zZm9ybU1hdDQob3V0LCBzY3JlZW5Qb3NpdGlvbiwgX21hdDRfdGVtcF8xKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29udmVydCBwb2ludCBmcm9tIHdvcmxkIHRvIHNjcmVlbi5cbiAgICAgKiAhI3poXG4gICAgICog5bCG5Z2Q5qCH5LuO5LiW55WM5Z2Q5qCH57O76L2s5YyW5Yiw5bGP5bmV5Z2Q5qCH57O744CCXG4gICAgICogQG1ldGhvZCBnZXRXb3JsZFRvU2NyZWVuUG9pbnRcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjMn0gd29ybGRQb3NpdGlvbiBcbiAgICAgKiBAcGFyYW0ge1ZlYzN8VmVjMn0gW291dF0gXG4gICAgICogQHJldHVybiB7VmVjM3xWZWMyfSBvdXRcbiAgICAgKi9cbiAgICBnZXRXb3JsZFRvU2NyZWVuUG9pbnQgKHdvcmxkUG9zaXRpb24sIG91dCkge1xuICAgICAgICBpZiAodGhpcy5ub2RlLmlzM0ROb2RlKSB7XG4gICAgICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IGNjLlZlYzMoKTtcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS53b3JsZFRvU2NyZWVuKG91dCwgd29ybGRQb3NpdGlvbiwgY2MudmlzaWJsZVJlY3Qud2lkdGgsIGNjLnZpc2libGVSZWN0LmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvdXQgPSBvdXQgfHwgbmV3IGNjLlZlYzIoKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0V29ybGRUb1NjcmVlbk1hdHJpeDJEKF9tYXQ0X3RlbXBfMSk7XG4gICAgICAgICAgICBWZWMyLnRyYW5zZm9ybU1hdDQob3V0LCB3b3JsZFBvc2l0aW9uLCBfbWF0NF90ZW1wXzEpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogR2V0IGEgcmF5IGZyb20gc2NyZWVuIHBvc2l0aW9uXG4gICAgICogISN6aFxuICAgICAqIOS7juWxj+W5leWdkOagh+iOt+WPluS4gOadoeWwhOe6v1xuICAgICAqIEBtZXRob2QgZ2V0UmF5XG4gICAgICogQHBhcmFtIHtWZWMyfSBzY3JlZW5Qb3NcbiAgICAgKiBAcmV0dXJuIHtSYXl9XG4gICAgICovXG4gICAgZ2V0UmF5IChzY3JlZW5Qb3MpIHtcbiAgICAgICAgaWYgKCFjYy5nZW9tVXRpbHMpIHJldHVybiBzY3JlZW5Qb3M7XG4gICAgICAgIFxuICAgICAgICBWZWMzLnNldChfdjNfdGVtcF8zLCBzY3JlZW5Qb3MueCwgc2NyZWVuUG9zLnksIDEpO1xuICAgICAgICB0aGlzLl9jYW1lcmEuc2NyZWVuVG9Xb3JsZChfdjNfdGVtcF8yLCBfdjNfdGVtcF8zLCBjYy52aXNpYmxlUmVjdC53aWR0aCwgY2MudmlzaWJsZVJlY3QuaGVpZ2h0KTtcblxuICAgICAgICBpZiAodGhpcy5vcnRobykge1xuICAgICAgICAgICAgVmVjMy5zZXQoX3YzX3RlbXBfMywgc2NyZWVuUG9zLngsIHNjcmVlblBvcy55LCAtMSk7XG4gICAgICAgICAgICB0aGlzLl9jYW1lcmEuc2NyZWVuVG9Xb3JsZChfdjNfdGVtcF8xLCBfdjNfdGVtcF8zLCBjYy52aXNpYmxlUmVjdC53aWR0aCwgY2MudmlzaWJsZVJlY3QuaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5nZXRXb3JsZFBvc2l0aW9uKF92M190ZW1wXzEpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFJheS5mcm9tUG9pbnRzKG5ldyBSYXkoKSwgX3YzX3RlbXBfMSwgX3YzX3RlbXBfMik7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBDaGVjayB3aGV0aGVyIHRoZSBub2RlIGlzIGluIHRoZSBjYW1lcmEuXG4gICAgICogISN6aFxuICAgICAqIOajgOa1i+iKgueCueaYr+WQpuiiq+atpOaRhOWDj+acuuW9seWTjVxuICAgICAqIEBtZXRob2QgY29udGFpbnNOb2RlXG4gICAgICogQHBhcmFtIHtOb2RlfSBub2RlIC0gdGhlIG5vZGUgd2hpY2ggbmVlZCB0byBjaGVja1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgY29udGFpbnNOb2RlIChub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlLl9jdWxsaW5nTWFzayAmIHRoaXMuY3VsbGluZ01hc2s7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBSZW5kZXIgdGhlIGNhbWVyYSBtYW51YWxseS5cbiAgICAgKiAhI3poXG4gICAgICog5omL5Yqo5riy5p+T5pGE5YOP5py644CCXG4gICAgICogQG1ldGhvZCByZW5kZXJcbiAgICAgKiBAcGFyYW0ge05vZGV9IHJvb3QgXG4gICAgICovXG4gICAgcmVuZGVyIChyb290KSB7XG4gICAgICAgIHJvb3QgPSByb290IHx8IGNjLmRpcmVjdG9yLmdldFNjZW5lKCk7XG4gICAgICAgIGlmICghcm9vdCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgLy8gZm9yY2UgdXBkYXRlIG5vZGUgd29ybGQgbWF0cml4XG4gICAgICAgIHRoaXMubm9kZS5nZXRXb3JsZE1hdHJpeChfbWF0NF90ZW1wXzEpO1xuICAgICAgICB0aGlzLmJlZm9yZURyYXcoKTtcbiAgICAgICAgUmVuZGVyRmxvdy5yZW5kZXIocm9vdCk7XG4gICAgICAgIGlmICghQ0NfSlNCKSB7XG4gICAgICAgICAgICByZW5kZXJlci5fZm9yd2FyZC5yZW5kZXJDYW1lcmEodGhpcy5fY2FtZXJhLCByZW5kZXJlci5zY2VuZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX29uQWxpZ25XaXRoU2NyZWVuICgpIHtcbiAgICAgICAgbGV0IGhlaWdodCA9IGNjLmdhbWUuY2FudmFzLmhlaWdodCAvIGNjLnZpZXcuX3NjYWxlWTtcblxuICAgICAgICBsZXQgdGFyZ2V0VGV4dHVyZSA9IHRoaXMuX3RhcmdldFRleHR1cmU7XG4gICAgICAgIGlmICh0YXJnZXRUZXh0dXJlKSB7XG4gICAgICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gY2MuZW5naW5lLmdldERlc2lnblJlc29sdXRpb25TaXplKCkuaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gY2MudmlzaWJsZVJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZvdiA9IHRoaXMuX2ZvdiAqIGNjLm1hY3JvLlJBRDtcbiAgICAgICAgdGhpcy5ub2RlLnogPSBoZWlnaHQgLyAoTWF0aC50YW4oZm92IC8gMikgKiAyKTtcblxuICAgICAgICBmb3YgPSBNYXRoLmF0YW4oTWF0aC50YW4oZm92IC8gMikgLyB0aGlzLnpvb21SYXRpbykgKiAyO1xuICAgICAgICB0aGlzLl9jYW1lcmEuc2V0Rm92KGZvdik7XG4gICAgICAgIHRoaXMuX2NhbWVyYS5zZXRPcnRob0hlaWdodChoZWlnaHQgLyAyIC8gdGhpcy56b29tUmF0aW8pO1xuICAgICAgICB0aGlzLm5vZGUuc2V0Um90YXRpb24oMCwgMCwgMCwgMSk7XG4gICAgfSxcblxuICAgIGJlZm9yZURyYXcgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2NhbWVyYSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLl9hbGlnbldpdGhTY3JlZW4pIHtcbiAgICAgICAgICAgIHRoaXMuX29uQWxpZ25XaXRoU2NyZWVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgZm92ID0gdGhpcy5fZm92ICogY2MubWFjcm8uUkFEO1xuICAgICAgICAgICAgZm92ID0gTWF0aC5hdGFuKE1hdGgudGFuKGZvdiAvIDIpIC8gdGhpcy56b29tUmF0aW8pICogMjtcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYS5zZXRGb3YoZm92KTtcblxuICAgICAgICAgICAgdGhpcy5fY2FtZXJhLnNldE9ydGhvSGVpZ2h0KHRoaXMuX29ydGhvU2l6ZSAvIHRoaXMuem9vbVJhdGlvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2NhbWVyYS5kaXJ0eSA9IHRydWU7XG4gICAgfVxufSk7XG5cbi8vIGRlcHJlY2F0ZWRcbmNjLmpzLm1peGluKENhbWVyYS5wcm90b3R5cGUsIHtcbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogUmV0dXJucyB0aGUgbWF0cml4IHRoYXQgdHJhbnNmb3JtIHRoZSBub2RlJ3MgKGxvY2FsKSBzcGFjZSBjb29yZGluYXRlcyBpbnRvIHRoZSBjYW1lcmEncyBzcGFjZSBjb29yZGluYXRlcy5cbiAgICAgKiAhI3poXG4gICAgICog6L+U5Zue5LiA5Liq5bCG6IqC54K55Z2Q5qCH57O76L2s5o2i5Yiw5pGE5YOP5py65Z2Q5qCH57O75LiL55qE55+p6Zi1XG4gICAgICogQG1ldGhvZCBnZXROb2RlVG9DYW1lcmFUcmFuc2Zvcm1cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wLjBcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgLSB0aGUgbm9kZSB3aGljaCBzaG91bGQgdHJhbnNmb3JtXG4gICAgICogQHJldHVybiB7QWZmaW5lVHJhbnNmb3JtfVxuICAgICAqL1xuICAgIGdldE5vZGVUb0NhbWVyYVRyYW5zZm9ybSAobm9kZSkge1xuICAgICAgICBsZXQgb3V0ID0gQWZmaW5lVHJhbnMuaWRlbnRpdHkoKTtcbiAgICAgICAgbm9kZS5nZXRXb3JsZE1hdHJpeChfbWF0NF90ZW1wXzIpO1xuICAgICAgICBpZiAodGhpcy5jb250YWluc05vZGUobm9kZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0V29ybGRUb0NhbWVyYU1hdHJpeChfbWF0NF90ZW1wXzEpO1xuICAgICAgICAgICAgTWF0NC5tdWwoX21hdDRfdGVtcF8yLCBfbWF0NF90ZW1wXzIsIF9tYXQ0X3RlbXBfMSk7XG4gICAgICAgIH1cbiAgICAgICAgQWZmaW5lVHJhbnMuZnJvbU1hdDQob3V0LCBfbWF0NF90ZW1wXzIpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29udmVyIGEgY2FtZXJhIGNvb3JkaW5hdGVzIHBvaW50IHRvIHdvcmxkIGNvb3JkaW5hdGVzLlxuICAgICAqICEjemhcbiAgICAgKiDlsIbkuIDkuKrmkYTlg4/mnLrlnZDmoIfns7vkuIvnmoTngrnovazmjaLliLDkuJbnlYzlnZDmoIfns7vkuIvjgIJcbiAgICAgKiBAbWV0aG9kIGdldENhbWVyYVRvV29ybGRQb2ludFxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjEuM1xuICAgICAqIEBwYXJhbSB7VmVjMn0gcG9pbnQgLSB0aGUgcG9pbnQgd2hpY2ggc2hvdWxkIHRyYW5zZm9ybVxuICAgICAqIEBwYXJhbSB7VmVjMn0gW291dF0gLSB0aGUgcG9pbnQgdG8gcmVjZWl2ZSB0aGUgcmVzdWx0XG4gICAgICogQHJldHVybiB7VmVjMn0gb3V0XG4gICAgICovXG4gICAgZ2V0Q2FtZXJhVG9Xb3JsZFBvaW50IChwb2ludCwgb3V0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNjcmVlblRvV29ybGRQb2ludChwb2ludCwgb3V0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIENvbnZlciBhIHdvcmxkIGNvb3JkaW5hdGVzIHBvaW50IHRvIGNhbWVyYSBjb29yZGluYXRlcy5cbiAgICAgKiAhI3poXG4gICAgICog5bCG5LiA5Liq5LiW55WM5Z2Q5qCH57O75LiL55qE54K56L2s5o2i5Yiw5pGE5YOP5py65Z2Q5qCH57O75LiL44CCXG4gICAgICogQG1ldGhvZCBnZXRXb3JsZFRvQ2FtZXJhUG9pbnRcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xLjNcbiAgICAgKiBAcGFyYW0ge1ZlYzJ9IHBvaW50IFxuICAgICAqIEBwYXJhbSB7VmVjMn0gW291dF0gLSB0aGUgcG9pbnQgdG8gcmVjZWl2ZSB0aGUgcmVzdWx0XG4gICAgICogQHJldHVybiB7VmVjMn0gb3V0XG4gICAgICovXG4gICAgZ2V0V29ybGRUb0NhbWVyYVBvaW50IChwb2ludCwgb3V0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFdvcmxkVG9TY3JlZW5Qb2ludChwb2ludCwgb3V0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgY2FtZXJhIHRvIHdvcmxkIG1hdHJpeFxuICAgICAqICEjemhcbiAgICAgKiDojrflj5bmkYTlg4/mnLrlnZDmoIfns7vliLDkuJbnlYzlnZDmoIfns7vnmoTnn6npmLVcbiAgICAgKiBAbWV0aG9kIGdldENhbWVyYVRvV29ybGRNYXRyaXhcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4xLjNcbiAgICAgKiBAcGFyYW0ge01hdDR9IG91dCAtIHRoZSBtYXRyaXggdG8gcmVjZWl2ZSB0aGUgcmVzdWx0XG4gICAgICogQHJldHVybiB7TWF0NH0gb3V0XG4gICAgICovXG4gICAgZ2V0Q2FtZXJhVG9Xb3JsZE1hdHJpeCAob3V0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFNjcmVlblRvV29ybGRNYXRyaXgyRChvdXQpO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBHZXQgdGhlIHdvcmxkIHRvIGNhbWVyYSBtYXRyaXhcbiAgICAgKiAhI3poXG4gICAgICog6I635Y+W5LiW55WM5Z2Q5qCH57O75Yiw5pGE5YOP5py65Z2Q5qCH57O755qE55+p6Zi1XG4gICAgICogQG1ldGhvZCBnZXRXb3JsZFRvQ2FtZXJhTWF0cml4XG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMS4zXG4gICAgICogQHBhcmFtIHtNYXQ0fSBvdXQgLSB0aGUgbWF0cml4IHRvIHJlY2VpdmUgdGhlIHJlc3VsdFxuICAgICAqIEByZXR1cm4ge01hdDR9IG91dFxuICAgICAqL1xuICAgIGdldFdvcmxkVG9DYW1lcmFNYXRyaXggKG91dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRXb3JsZFRvU2NyZWVuTWF0cml4MkQob3V0KTtcbiAgICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuQ2FtZXJhID0gQ2FtZXJhO1xuIl19