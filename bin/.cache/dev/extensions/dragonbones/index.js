
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/index.js';
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

/**
 * !#en
 * The global main namespace of DragonBones, all classes, functions,
 * properties and constants of DragonBones are defined in this namespace
 * !#zh
 * DragonBones 的全局的命名空间，
 * 与 DragonBones 相关的所有的类，函数，属性，常量都在这个命名空间中定义。
 * @module dragonBones
 * @main dragonBones
 */

/*
 * Reference:
 * http://dragonbones.com/cn/index.html
 */
var _global = typeof window === 'undefined' ? global : window;

if (!CC_NATIVERENDERER) {
  _global.dragonBones = require('./lib/dragonBones');
}

if (_global.dragonBones !== undefined) {
  /**
   * !#en
   * The global time scale of DragonBones.
   * !#zh
   * DragonBones 全局时间缩放率。
   * @example
   * dragonBones.timeScale = 0.8;
   */
  dragonBones._timeScale = 1.0;
  Object.defineProperty(dragonBones, 'timeScale', {
    get: function get() {
      return this._timeScale;
    },
    set: function set(value) {
      this._timeScale = value;
      var factory = this.CCFactory.getInstance();
      factory._dragonBones.clock.timeScale = value;
    },
    configurable: true
  });
  dragonBones.DisplayType = {
    Image: 0,
    Armature: 1,
    Mesh: 2
  };
  dragonBones.ArmatureType = {
    Armature: 0,
    MovieClip: 1,
    Stage: 2
  };
  dragonBones.ExtensionType = {
    FFD: 0,
    AdjustColor: 10,
    BevelFilter: 11,
    BlurFilter: 12,
    DropShadowFilter: 13,
    GlowFilter: 14,
    GradientBevelFilter: 15,
    GradientGlowFilter: 16
  };
  dragonBones.EventType = {
    Frame: 0,
    Sound: 1
  };
  dragonBones.ActionType = {
    Play: 0,
    Stop: 1,
    GotoAndPlay: 2,
    GotoAndStop: 3,
    FadeIn: 4,
    FadeOut: 5
  };
  dragonBones.AnimationFadeOutMode = {
    None: 0,
    SameLayer: 1,
    SameGroup: 2,
    SameLayerAndGroup: 3,
    All: 4
  };
  dragonBones.BinaryOffset = {
    WeigthBoneCount: 0,
    WeigthFloatOffset: 1,
    WeigthBoneIndices: 2,
    MeshVertexCount: 0,
    MeshTriangleCount: 1,
    MeshFloatOffset: 2,
    MeshWeightOffset: 3,
    MeshVertexIndices: 4,
    TimelineScale: 0,
    TimelineOffset: 1,
    TimelineKeyFrameCount: 2,
    TimelineFrameValueCount: 3,
    TimelineFrameValueOffset: 4,
    TimelineFrameOffset: 5,
    FramePosition: 0,
    FrameTweenType: 1,
    FrameTweenEasingOrCurveSampleCount: 2,
    FrameCurveSamples: 3,
    DeformMeshOffset: 0,
    DeformCount: 1,
    DeformValueCount: 2,
    DeformValueOffset: 3,
    DeformFloatOffset: 4
  };
  dragonBones.BoneType = {
    Bone: 0,
    Surface: 1
  };

  if (!CC_EDITOR || !Editor.isMainProcess) {
    if (!CC_NATIVERENDERER) {
      require('./CCFactory');

      require('./CCSlot');

      require('./CCTextureData');

      require('./CCArmatureDisplay');

      require('./ArmatureCache');
    } // require the component for dragonbones


    require('./DragonBonesAsset');

    require('./DragonBonesAtlasAsset');

    require('./ArmatureDisplay');

    require('./webgl-assembler');
  } else {
    require('./DragonBonesAsset');

    require('./DragonBonesAtlasAsset');
  }
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbIl9nbG9iYWwiLCJ3aW5kb3ciLCJnbG9iYWwiLCJDQ19OQVRJVkVSRU5ERVJFUiIsImRyYWdvbkJvbmVzIiwicmVxdWlyZSIsInVuZGVmaW5lZCIsIl90aW1lU2NhbGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsInNldCIsInZhbHVlIiwiZmFjdG9yeSIsIkNDRmFjdG9yeSIsImdldEluc3RhbmNlIiwiX2RyYWdvbkJvbmVzIiwiY2xvY2siLCJ0aW1lU2NhbGUiLCJjb25maWd1cmFibGUiLCJEaXNwbGF5VHlwZSIsIkltYWdlIiwiQXJtYXR1cmUiLCJNZXNoIiwiQXJtYXR1cmVUeXBlIiwiTW92aWVDbGlwIiwiU3RhZ2UiLCJFeHRlbnNpb25UeXBlIiwiRkZEIiwiQWRqdXN0Q29sb3IiLCJCZXZlbEZpbHRlciIsIkJsdXJGaWx0ZXIiLCJEcm9wU2hhZG93RmlsdGVyIiwiR2xvd0ZpbHRlciIsIkdyYWRpZW50QmV2ZWxGaWx0ZXIiLCJHcmFkaWVudEdsb3dGaWx0ZXIiLCJFdmVudFR5cGUiLCJGcmFtZSIsIlNvdW5kIiwiQWN0aW9uVHlwZSIsIlBsYXkiLCJTdG9wIiwiR290b0FuZFBsYXkiLCJHb3RvQW5kU3RvcCIsIkZhZGVJbiIsIkZhZGVPdXQiLCJBbmltYXRpb25GYWRlT3V0TW9kZSIsIk5vbmUiLCJTYW1lTGF5ZXIiLCJTYW1lR3JvdXAiLCJTYW1lTGF5ZXJBbmRHcm91cCIsIkFsbCIsIkJpbmFyeU9mZnNldCIsIldlaWd0aEJvbmVDb3VudCIsIldlaWd0aEZsb2F0T2Zmc2V0IiwiV2VpZ3RoQm9uZUluZGljZXMiLCJNZXNoVmVydGV4Q291bnQiLCJNZXNoVHJpYW5nbGVDb3VudCIsIk1lc2hGbG9hdE9mZnNldCIsIk1lc2hXZWlnaHRPZmZzZXQiLCJNZXNoVmVydGV4SW5kaWNlcyIsIlRpbWVsaW5lU2NhbGUiLCJUaW1lbGluZU9mZnNldCIsIlRpbWVsaW5lS2V5RnJhbWVDb3VudCIsIlRpbWVsaW5lRnJhbWVWYWx1ZUNvdW50IiwiVGltZWxpbmVGcmFtZVZhbHVlT2Zmc2V0IiwiVGltZWxpbmVGcmFtZU9mZnNldCIsIkZyYW1lUG9zaXRpb24iLCJGcmFtZVR3ZWVuVHlwZSIsIkZyYW1lVHdlZW5FYXNpbmdPckN1cnZlU2FtcGxlQ291bnQiLCJGcmFtZUN1cnZlU2FtcGxlcyIsIkRlZm9ybU1lc2hPZmZzZXQiLCJEZWZvcm1Db3VudCIsIkRlZm9ybVZhbHVlQ291bnQiLCJEZWZvcm1WYWx1ZU9mZnNldCIsIkRlZm9ybUZsb2F0T2Zmc2V0IiwiQm9uZVR5cGUiLCJCb25lIiwiU3VyZmFjZSIsIkNDX0VESVRPUiIsIkVkaXRvciIsImlzTWFpblByb2Nlc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7Ozs7Ozs7Ozs7QUFXQTs7OztBQUtBLElBQUlBLE9BQU8sR0FBRyxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDQyxNQUFoQyxHQUF5Q0QsTUFBdkQ7O0FBQ0EsSUFBSSxDQUFDRSxpQkFBTCxFQUF3QjtBQUNwQkgsRUFBQUEsT0FBTyxDQUFDSSxXQUFSLEdBQXNCQyxPQUFPLENBQUMsbUJBQUQsQ0FBN0I7QUFDSDs7QUFFRCxJQUFJTCxPQUFPLENBQUNJLFdBQVIsS0FBd0JFLFNBQTVCLEVBQXVDO0FBRW5DOzs7Ozs7OztBQVFBRixFQUFBQSxXQUFXLENBQUNHLFVBQVosR0FBeUIsR0FBekI7QUFDQUMsRUFBQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCTCxXQUF0QixFQUFtQyxXQUFuQyxFQUFnRDtBQUM1Q00sSUFBQUEsR0FENEMsaUJBQ3JDO0FBQ0gsYUFBTyxLQUFLSCxVQUFaO0FBQ0gsS0FIMkM7QUFJNUNJLElBQUFBLEdBSjRDLGVBSXZDQyxLQUp1QyxFQUloQztBQUNSLFdBQUtMLFVBQUwsR0FBa0JLLEtBQWxCO0FBQ0EsVUFBSUMsT0FBTyxHQUFHLEtBQUtDLFNBQUwsQ0FBZUMsV0FBZixFQUFkO0FBQ0FGLE1BQUFB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QUEsaUJBQWlCLEVBQUUsQ0ExQkk7QUEyQnZCQyxJQUFBQSxpQkFBaUIsRUFBRTtBQTNCSSxHQUEzQjtBQThCQXZFLEVBQUFBLFdBQVcsQ0FBQ3dFLFFBQVosR0FBdUI7QUFDbkJDLElBQUFBLElBQUksRUFBRSxDQURhO0FBRW5CQyxJQUFBQSxPQUFPLEVBQUU7QUFGVSxHQUF2Qjs7QUFLQSxNQUFJLENBQUNDLFNBQUQsSUFBYyxDQUFDQyxNQUFNLENBQUNDLGFBQTFCLEVBQXlDO0FBRXJDLFFBQUksQ0FBQzlFLGlCQUFMLEVBQXdCO0FBQ3BCRSxNQUFBQSxPQUFPLENBQUMsYUFBRCxDQUFQOztBQUNBQSxNQUFBQSxPQUFPLENBQUMsVUFBRCxDQUFQOztBQUNBQSxNQUFBQSxPQUFPLENBQUMsaUJBQUQsQ0FBUDs7QUFDQUEsTUFBQUEsT0FBTyxDQUFDLHFCQUFELENBQVA7O0FBQ0FBLE1BQUFBLE9BQU8sQ0FBQyxpQkFBRCxDQUFQO0FBQ0gsS0FSb0MsQ0FVckM7OztBQUNBQSxJQUFBQSxPQUFPLENBQUMsb0JBQUQsQ0FBUDs7QUFDQUEsSUFBQUEsT0FBTyxDQUFDLHlCQUFELENBQVA7O0FBQ0FBLElBQUFBLE9BQU8sQ0FBQyxtQkFBRCxDQUFQOztBQUVBQSxJQUFBQSxPQUFPLENBQUMsbUJBQUQsQ0FBUDtBQUNILEdBaEJELE1BZ0JPO0FBQ0hBLElBQUFBLE9BQU8sQ0FBQyxvQkFBRCxDQUFQOztBQUNBQSxJQUFBQSxPQUFPLENBQUMseUJBQUQsQ0FBUDtBQUNIO0FBRUoiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXG5cbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qKlxuICogISNlblxuICogVGhlIGdsb2JhbCBtYWluIG5hbWVzcGFjZSBvZiBEcmFnb25Cb25lcywgYWxsIGNsYXNzZXMsIGZ1bmN0aW9ucyxcbiAqIHByb3BlcnRpZXMgYW5kIGNvbnN0YW50cyBvZiBEcmFnb25Cb25lcyBhcmUgZGVmaW5lZCBpbiB0aGlzIG5hbWVzcGFjZVxuICogISN6aFxuICogRHJhZ29uQm9uZXMg55qE5YWo5bGA55qE5ZG95ZCN56m66Ze077yMXG4gKiDkuI4gRHJhZ29uQm9uZXMg55u45YWz55qE5omA5pyJ55qE57G777yM5Ye95pWw77yM5bGe5oCn77yM5bi46YeP6YO95Zyo6L+Z5Liq5ZG95ZCN56m66Ze05Lit5a6a5LmJ44CCXG4gKiBAbW9kdWxlIGRyYWdvbkJvbmVzXG4gKiBAbWFpbiBkcmFnb25Cb25lc1xuICovXG5cbi8qXG4gKiBSZWZlcmVuY2U6XG4gKiBodHRwOi8vZHJhZ29uYm9uZXMuY29tL2NuL2luZGV4Lmh0bWxcbiAqL1xuXG52YXIgX2dsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93O1xuaWYgKCFDQ19OQVRJVkVSRU5ERVJFUikge1xuICAgIF9nbG9iYWwuZHJhZ29uQm9uZXMgPSByZXF1aXJlKCcuL2xpYi9kcmFnb25Cb25lcycpO1xufVxuXG5pZiAoX2dsb2JhbC5kcmFnb25Cb25lcyAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogVGhlIGdsb2JhbCB0aW1lIHNjYWxlIG9mIERyYWdvbkJvbmVzLlxuICAgICAqICEjemhcbiAgICAgKiBEcmFnb25Cb25lcyDlhajlsYDml7bpl7TnvKnmlL7njofjgIJcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGRyYWdvbkJvbmVzLnRpbWVTY2FsZSA9IDAuODtcbiAgICAgKi9cbiAgICBkcmFnb25Cb25lcy5fdGltZVNjYWxlID0gMS4wO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkcmFnb25Cb25lcywgJ3RpbWVTY2FsZScsIHtcbiAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90aW1lU2NhbGU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVTY2FsZSA9IHZhbHVlO1xuICAgICAgICAgICAgbGV0IGZhY3RvcnkgPSB0aGlzLkNDRmFjdG9yeS5nZXRJbnN0YW5jZSgpO1xuICAgICAgICAgICAgZmFjdG9yeS5fZHJhZ29uQm9uZXMuY2xvY2sudGltZVNjYWxlID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGRyYWdvbkJvbmVzLkRpc3BsYXlUeXBlID0ge1xuICAgICAgICBJbWFnZSA6IDAsXG4gICAgICAgIEFybWF0dXJlIDogMSxcbiAgICAgICAgTWVzaCA6IDJcbiAgICB9O1xuXG4gICAgZHJhZ29uQm9uZXMuQXJtYXR1cmVUeXBlID0ge1xuICAgICAgICBBcm1hdHVyZSA6IDAsXG4gICAgICAgIE1vdmllQ2xpcCA6IDEsXG4gICAgICAgIFN0YWdlIDogMlxuICAgIH07XG5cbiAgICBkcmFnb25Cb25lcy5FeHRlbnNpb25UeXBlID0ge1xuICAgICAgICBGRkQgOiAwLFxuICAgICAgICBBZGp1c3RDb2xvciA6IDEwLFxuICAgICAgICBCZXZlbEZpbHRlciA6IDExLFxuICAgICAgICBCbHVyRmlsdGVyIDogMTIsXG4gICAgICAgIERyb3BTaGFkb3dGaWx0ZXIgOiAxMyxcbiAgICAgICAgR2xvd0ZpbHRlciA6IDE0LFxuICAgICAgICBHcmFkaWVudEJldmVsRmlsdGVyIDogMTUsXG4gICAgICAgIEdyYWRpZW50R2xvd0ZpbHRlciA6IDE2XG4gICAgfTtcblxuICAgIGRyYWdvbkJvbmVzLkV2ZW50VHlwZSA9IHtcbiAgICAgICAgRnJhbWUgOiAwLFxuICAgICAgICBTb3VuZCA6IDFcbiAgICB9O1xuXG4gICAgZHJhZ29uQm9uZXMuQWN0aW9uVHlwZSA9IHtcbiAgICAgICAgUGxheSA6IDAsXG4gICAgICAgIFN0b3AgOiAxLFxuICAgICAgICBHb3RvQW5kUGxheSA6IDIsXG4gICAgICAgIEdvdG9BbmRTdG9wIDogMyxcbiAgICAgICAgRmFkZUluIDogNCxcbiAgICAgICAgRmFkZU91dCA6IDVcbiAgICB9O1xuXG4gICAgZHJhZ29uQm9uZXMuQW5pbWF0aW9uRmFkZU91dE1vZGUgPSB7XG4gICAgICAgIE5vbmUgOiAwLFxuICAgICAgICBTYW1lTGF5ZXIgOiAxLFxuICAgICAgICBTYW1lR3JvdXAgOiAyLFxuICAgICAgICBTYW1lTGF5ZXJBbmRHcm91cCA6IDMsXG4gICAgICAgIEFsbCA6IDRcbiAgICB9O1xuXG4gICAgZHJhZ29uQm9uZXMuQmluYXJ5T2Zmc2V0ID0ge1xuICAgICAgICBXZWlndGhCb25lQ291bnQ6IDAsXG4gICAgICAgIFdlaWd0aEZsb2F0T2Zmc2V0OiAxLFxuICAgICAgICBXZWlndGhCb25lSW5kaWNlczogMixcblxuICAgICAgICBNZXNoVmVydGV4Q291bnQ6IDAsXG4gICAgICAgIE1lc2hUcmlhbmdsZUNvdW50OiAxLFxuICAgICAgICBNZXNoRmxvYXRPZmZzZXQ6IDIsXG4gICAgICAgIE1lc2hXZWlnaHRPZmZzZXQ6IDMsXG4gICAgICAgIE1lc2hWZXJ0ZXhJbmRpY2VzOiA0LFxuXG4gICAgICAgIFRpbWVsaW5lU2NhbGU6IDAsXG4gICAgICAgIFRpbWVsaW5lT2Zmc2V0OiAxLFxuICAgICAgICBUaW1lbGluZUtleUZyYW1lQ291bnQ6IDIsXG4gICAgICAgIFRpbWVsaW5lRnJhbWVWYWx1ZUNvdW50OiAzLFxuICAgICAgICBUaW1lbGluZUZyYW1lVmFsdWVPZmZzZXQ6IDQsXG4gICAgICAgIFRpbWVsaW5lRnJhbWVPZmZzZXQ6IDUsXG5cbiAgICAgICAgRnJhbWVQb3NpdGlvbjogMCxcbiAgICAgICAgRnJhbWVUd2VlblR5cGU6IDEsXG4gICAgICAgIEZyYW1lVHdlZW5FYXNpbmdPckN1cnZlU2FtcGxlQ291bnQ6IDIsXG4gICAgICAgIEZyYW1lQ3VydmVTYW1wbGVzOiAzLFxuXG4gICAgICAgIERlZm9ybU1lc2hPZmZzZXQ6IDAsXG4gICAgICAgIERlZm9ybUNvdW50OiAxLFxuICAgICAgICBEZWZvcm1WYWx1ZUNvdW50OiAyLFxuICAgICAgICBEZWZvcm1WYWx1ZU9mZnNldDogMyxcbiAgICAgICAgRGVmb3JtRmxvYXRPZmZzZXQ6IDRcbiAgICB9OyBcblxuICAgIGRyYWdvbkJvbmVzLkJvbmVUeXBlID0ge1xuICAgICAgICBCb25lOiAwLFxuICAgICAgICBTdXJmYWNlOiAxXG4gICAgfTtcblxuICAgIGlmICghQ0NfRURJVE9SIHx8ICFFZGl0b3IuaXNNYWluUHJvY2Vzcykge1xuXG4gICAgICAgIGlmICghQ0NfTkFUSVZFUkVOREVSRVIpIHtcbiAgICAgICAgICAgIHJlcXVpcmUoJy4vQ0NGYWN0b3J5Jyk7XG4gICAgICAgICAgICByZXF1aXJlKCcuL0NDU2xvdCcpO1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9DQ1RleHR1cmVEYXRhJyk7XG4gICAgICAgICAgICByZXF1aXJlKCcuL0NDQXJtYXR1cmVEaXNwbGF5Jyk7XG4gICAgICAgICAgICByZXF1aXJlKCcuL0FybWF0dXJlQ2FjaGUnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gcmVxdWlyZSB0aGUgY29tcG9uZW50IGZvciBkcmFnb25ib25lc1xuICAgICAgICByZXF1aXJlKCcuL0RyYWdvbkJvbmVzQXNzZXQnKTtcbiAgICAgICAgcmVxdWlyZSgnLi9EcmFnb25Cb25lc0F0bGFzQXNzZXQnKTtcbiAgICAgICAgcmVxdWlyZSgnLi9Bcm1hdHVyZURpc3BsYXknKTtcblxuICAgICAgICByZXF1aXJlKCcuL3dlYmdsLWFzc2VtYmxlcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcXVpcmUoJy4vRHJhZ29uQm9uZXNBc3NldCcpO1xuICAgICAgICByZXF1aXJlKCcuL0RyYWdvbkJvbmVzQXRsYXNBc3NldCcpO1xuICAgIH1cblxufVxuIl19