
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/extensions/dragonbones/CCFactory.js';
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
var BaseObject = dragonBones.BaseObject,
    BaseFactory = dragonBones.BaseFactory;
/**
 * @module dragonBones
*/

/**
 * DragonBones factory
 * @class CCFactory
 * @extends BaseFactory
*/

var CCFactory = dragonBones.CCFactory = cc.Class({
  name: 'dragonBones.CCFactory',
  "extends": BaseFactory,

  /**
   * @method getInstance
   * @return {CCFactory}
   * @static
   * @example
   * let factory = dragonBones.CCFactory.getInstance();
  */
  statics: {
    _factory: null,
    getInstance: function getInstance() {
      if (!CCFactory._factory) {
        CCFactory._factory = new CCFactory();
      }

      return CCFactory._factory;
    }
  },
  ctor: function ctor() {
    var eventManager = new dragonBones.CCArmatureDisplay();
    this._dragonBones = new dragonBones.DragonBones(eventManager);

    if (!CC_NATIVERENDERER && !CC_EDITOR && cc.director._scheduler) {
      cc.game.on(cc.game.EVENT_RESTART, this.initUpdate, this);
      this.initUpdate();
    }
  },
  initUpdate: function initUpdate(dt) {
    cc.director._scheduler.enableForTarget(this);

    cc.director._scheduler.scheduleUpdate(this, cc.Scheduler.PRIORITY_SYSTEM, false);
  },
  update: function update(dt) {
    this._dragonBones.advanceTime(dt);
  },
  getDragonBonesDataByRawData: function getDragonBonesDataByRawData(rawData) {
    var dataParser = rawData instanceof ArrayBuffer ? BaseFactory._binaryParser : this._dataParser;
    return dataParser.parseDragonBonesData(rawData, 1.0);
  },
  // Build new aramture with a new display.
  buildArmatureDisplay: function buildArmatureDisplay(armatureName, dragonBonesName, skinName, textureAtlasName) {
    var armature = this.buildArmature(armatureName, dragonBonesName, skinName, textureAtlasName);
    return armature && armature._display;
  },
  // Build sub armature from an exist armature component.
  // It will share dragonAsset and dragonAtlasAsset.
  // But node can not share,or will cause render error.
  createArmatureNode: function createArmatureNode(comp, armatureName, node) {
    node = node || new cc.Node();
    var display = node.getComponent(dragonBones.ArmatureDisplay);

    if (!display) {
      display = node.addComponent(dragonBones.ArmatureDisplay);
    }

    node.name = armatureName;
    display._armatureName = armatureName;
    display._N$dragonAsset = comp.dragonAsset;
    display._N$dragonAtlasAsset = comp.dragonAtlasAsset;

    display._init();

    return display;
  },
  _buildTextureAtlasData: function _buildTextureAtlasData(textureAtlasData, textureAtlas) {
    if (textureAtlasData) {
      textureAtlasData.renderTexture = textureAtlas;
    } else {
      textureAtlasData = BaseObject.borrowObject(dragonBones.CCTextureAtlasData);
    }

    return textureAtlasData;
  },
  _sortSlots: function _sortSlots() {
    var slots = this._slots;
    var sortedSlots = [];

    for (var i = 0, l = slots.length; i < l; i++) {
      var slot = slots[i];
      var zOrder = slot._zOrder;
      var inserted = false;

      for (var j = sortedSlots.length - 1; j >= 0; j--) {
        if (zOrder >= sortedSlots[j]._zOrder) {
          sortedSlots.splice(j + 1, 0, slot);
          inserted = true;
          break;
        }
      }

      if (!inserted) {
        sortedSlots.splice(0, 0, slot);
      }
    }

    this._slots = sortedSlots;
  },
  _buildArmature: function _buildArmature(dataPackage) {
    var armature = BaseObject.borrowObject(dragonBones.Armature);
    armature._skinData = dataPackage.skin;
    armature._animation = BaseObject.borrowObject(dragonBones.Animation);
    armature._animation._armature = armature;
    armature._animation.animations = dataPackage.armature.animations;
    armature._isChildArmature = false; // fixed dragonbones sort issue
    // armature._sortSlots = this._sortSlots;

    var display = new dragonBones.CCArmatureDisplay();
    armature.init(dataPackage.armature, display, display, this._dragonBones);
    return armature;
  },
  _buildSlot: function _buildSlot(dataPackage, slotData, displays) {
    var slot = BaseObject.borrowObject(dragonBones.CCSlot);
    var display = slot;
    slot.init(slotData, displays, display, display);
    return slot;
  },
  getDragonBonesDataByUUID: function getDragonBonesDataByUUID(uuid) {
    for (var name in this._dragonBonesDataMap) {
      if (name.indexOf(uuid) != -1) {
        return this._dragonBonesDataMap[name];
      }
    }

    return null;
  },
  removeDragonBonesDataByUUID: function removeDragonBonesDataByUUID(uuid, disposeData) {
    if (disposeData === void 0) {
      disposeData = true;
    }

    for (var name in this._dragonBonesDataMap) {
      if (name.indexOf(uuid) === -1) continue;

      if (disposeData) {
        this._dragonBones.bufferObject(this._dragonBonesDataMap[name]);
      }

      delete this._dragonBonesDataMap[name];
    }
  }
});
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDRmFjdG9yeS5qcyJdLCJuYW1lcyI6WyJCYXNlT2JqZWN0IiwiZHJhZ29uQm9uZXMiLCJCYXNlRmFjdG9yeSIsIkNDRmFjdG9yeSIsImNjIiwiQ2xhc3MiLCJuYW1lIiwic3RhdGljcyIsIl9mYWN0b3J5IiwiZ2V0SW5zdGFuY2UiLCJjdG9yIiwiZXZlbnRNYW5hZ2VyIiwiQ0NBcm1hdHVyZURpc3BsYXkiLCJfZHJhZ29uQm9uZXMiLCJEcmFnb25Cb25lcyIsIkNDX05BVElWRVJFTkRFUkVSIiwiQ0NfRURJVE9SIiwiZGlyZWN0b3IiLCJfc2NoZWR1bGVyIiwiZ2FtZSIsIm9uIiwiRVZFTlRfUkVTVEFSVCIsImluaXRVcGRhdGUiLCJkdCIsImVuYWJsZUZvclRhcmdldCIsInNjaGVkdWxlVXBkYXRlIiwiU2NoZWR1bGVyIiwiUFJJT1JJVFlfU1lTVEVNIiwidXBkYXRlIiwiYWR2YW5jZVRpbWUiLCJnZXREcmFnb25Cb25lc0RhdGFCeVJhd0RhdGEiLCJyYXdEYXRhIiwiZGF0YVBhcnNlciIsIkFycmF5QnVmZmVyIiwiX2JpbmFyeVBhcnNlciIsIl9kYXRhUGFyc2VyIiwicGFyc2VEcmFnb25Cb25lc0RhdGEiLCJidWlsZEFybWF0dXJlRGlzcGxheSIsImFybWF0dXJlTmFtZSIsImRyYWdvbkJvbmVzTmFtZSIsInNraW5OYW1lIiwidGV4dHVyZUF0bGFzTmFtZSIsImFybWF0dXJlIiwiYnVpbGRBcm1hdHVyZSIsIl9kaXNwbGF5IiwiY3JlYXRlQXJtYXR1cmVOb2RlIiwiY29tcCIsIm5vZGUiLCJOb2RlIiwiZGlzcGxheSIsImdldENvbXBvbmVudCIsIkFybWF0dXJlRGlzcGxheSIsImFkZENvbXBvbmVudCIsIl9hcm1hdHVyZU5hbWUiLCJfTiRkcmFnb25Bc3NldCIsImRyYWdvbkFzc2V0IiwiX04kZHJhZ29uQXRsYXNBc3NldCIsImRyYWdvbkF0bGFzQXNzZXQiLCJfaW5pdCIsIl9idWlsZFRleHR1cmVBdGxhc0RhdGEiLCJ0ZXh0dXJlQXRsYXNEYXRhIiwidGV4dHVyZUF0bGFzIiwicmVuZGVyVGV4dHVyZSIsImJvcnJvd09iamVjdCIsIkNDVGV4dHVyZUF0bGFzRGF0YSIsIl9zb3J0U2xvdHMiLCJzbG90cyIsIl9zbG90cyIsInNvcnRlZFNsb3RzIiwiaSIsImwiLCJsZW5ndGgiLCJzbG90Iiwiek9yZGVyIiwiX3pPcmRlciIsImluc2VydGVkIiwiaiIsInNwbGljZSIsIl9idWlsZEFybWF0dXJlIiwiZGF0YVBhY2thZ2UiLCJBcm1hdHVyZSIsIl9za2luRGF0YSIsInNraW4iLCJfYW5pbWF0aW9uIiwiQW5pbWF0aW9uIiwiX2FybWF0dXJlIiwiYW5pbWF0aW9ucyIsIl9pc0NoaWxkQXJtYXR1cmUiLCJpbml0IiwiX2J1aWxkU2xvdCIsInNsb3REYXRhIiwiZGlzcGxheXMiLCJDQ1Nsb3QiLCJnZXREcmFnb25Cb25lc0RhdGFCeVVVSUQiLCJ1dWlkIiwiX2RyYWdvbkJvbmVzRGF0YU1hcCIsImluZGV4T2YiLCJyZW1vdmVEcmFnb25Cb25lc0RhdGFCeVVVSUQiLCJkaXNwb3NlRGF0YSIsImJ1ZmZlck9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsSUFBSUEsVUFBVSxHQUFHQyxXQUFXLENBQUNELFVBQTdCO0FBQUEsSUFDSUUsV0FBVyxHQUFHRCxXQUFXLENBQUNDLFdBRDlCO0FBR0E7Ozs7QUFJQTs7Ozs7O0FBS0EsSUFBSUMsU0FBUyxHQUFHRixXQUFXLENBQUNFLFNBQVosR0FBd0JDLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQzdDQyxFQUFBQSxJQUFJLEVBQUUsdUJBRHVDO0FBRTdDLGFBQVNKLFdBRm9DOztBQUc3Qzs7Ozs7OztBQU9BSyxFQUFBQSxPQUFPLEVBQUU7QUFDTEMsSUFBQUEsUUFBUSxFQUFFLElBREw7QUFFTEMsSUFBQUEsV0FGSyx5QkFFVTtBQUNYLFVBQUksQ0FBQ04sU0FBUyxDQUFDSyxRQUFmLEVBQXlCO0FBQ3JCTCxRQUFBQSxTQUFTLENBQUNLLFFBQVYsR0FBcUIsSUFBSUwsU0FBSixFQUFyQjtBQUNIOztBQUNELGFBQU9BLFNBQVMsQ0FBQ0ssUUFBakI7QUFDSDtBQVBJLEdBVm9DO0FBb0I3Q0UsRUFBQUEsSUFwQjZDLGtCQW9CckM7QUFDSixRQUFJQyxZQUFZLEdBQUcsSUFBSVYsV0FBVyxDQUFDVyxpQkFBaEIsRUFBbkI7QUFDQSxTQUFLQyxZQUFMLEdBQW9CLElBQUlaLFdBQVcsQ0FBQ2EsV0FBaEIsQ0FBNEJILFlBQTVCLENBQXBCOztBQUVBLFFBQUksQ0FBQ0ksaUJBQUQsSUFBc0IsQ0FBQ0MsU0FBdkIsSUFBb0NaLEVBQUUsQ0FBQ2EsUUFBSCxDQUFZQyxVQUFwRCxFQUFnRTtBQUM1RGQsTUFBQUEsRUFBRSxDQUFDZSxJQUFILENBQVFDLEVBQVIsQ0FBV2hCLEVBQUUsQ0FBQ2UsSUFBSCxDQUFRRSxhQUFuQixFQUFrQyxLQUFLQyxVQUF2QyxFQUFtRCxJQUFuRDtBQUNBLFdBQUtBLFVBQUw7QUFDSDtBQUNKLEdBNUI0QztBQThCN0NBLEVBQUFBLFVBOUI2QyxzQkE4QmpDQyxFQTlCaUMsRUE4QjdCO0FBQ1puQixJQUFBQSxFQUFFLENBQUNhLFFBQUgsQ0FBWUMsVUFBWixDQUF1Qk0sZUFBdkIsQ0FBdUMsSUFBdkM7O0FBQ0FwQixJQUFBQSxFQUFFLENBQUNhLFFBQUgsQ0FBWUMsVUFBWixDQUF1Qk8sY0FBdkIsQ0FBc0MsSUFBdEMsRUFBNENyQixFQUFFLENBQUNzQixTQUFILENBQWFDLGVBQXpELEVBQTBFLEtBQTFFO0FBQ0gsR0FqQzRDO0FBbUM3Q0MsRUFBQUEsTUFuQzZDLGtCQW1DckNMLEVBbkNxQyxFQW1DakM7QUFDUixTQUFLVixZQUFMLENBQWtCZ0IsV0FBbEIsQ0FBOEJOLEVBQTlCO0FBQ0gsR0FyQzRDO0FBdUM3Q08sRUFBQUEsMkJBdkM2Qyx1Q0F1Q2hCQyxPQXZDZ0IsRUF1Q1A7QUFDbEMsUUFBSUMsVUFBVSxHQUFHRCxPQUFPLFlBQVlFLFdBQW5CLEdBQWlDL0IsV0FBVyxDQUFDZ0MsYUFBN0MsR0FBNkQsS0FBS0MsV0FBbkY7QUFDQSxXQUFPSCxVQUFVLENBQUNJLG9CQUFYLENBQWdDTCxPQUFoQyxFQUF5QyxHQUF6QyxDQUFQO0FBQ0gsR0ExQzRDO0FBNEM3QztBQUNBTSxFQUFBQSxvQkE3QzZDLGdDQTZDdkJDLFlBN0N1QixFQTZDVEMsZUE3Q1MsRUE2Q1FDLFFBN0NSLEVBNkNrQkMsZ0JBN0NsQixFQTZDb0M7QUFDN0UsUUFBSUMsUUFBUSxHQUFHLEtBQUtDLGFBQUwsQ0FBbUJMLFlBQW5CLEVBQWlDQyxlQUFqQyxFQUFrREMsUUFBbEQsRUFBNERDLGdCQUE1RCxDQUFmO0FBQ0EsV0FBT0MsUUFBUSxJQUFJQSxRQUFRLENBQUNFLFFBQTVCO0FBQ0gsR0FoRDRDO0FBa0Q3QztBQUNBO0FBQ0E7QUFDQUMsRUFBQUEsa0JBckQ2Qyw4QkFxRHpCQyxJQXJEeUIsRUFxRG5CUixZQXJEbUIsRUFxRExTLElBckRLLEVBcURDO0FBQzFDQSxJQUFBQSxJQUFJLEdBQUdBLElBQUksSUFBSSxJQUFJM0MsRUFBRSxDQUFDNEMsSUFBUCxFQUFmO0FBQ0EsUUFBSUMsT0FBTyxHQUFHRixJQUFJLENBQUNHLFlBQUwsQ0FBa0JqRCxXQUFXLENBQUNrRCxlQUE5QixDQUFkOztBQUNBLFFBQUksQ0FBQ0YsT0FBTCxFQUFjO0FBQ1ZBLE1BQUFBLE9BQU8sR0FBR0YsSUFBSSxDQUFDSyxZQUFMLENBQWtCbkQsV0FBVyxDQUFDa0QsZUFBOUIsQ0FBVjtBQUNIOztBQUVESixJQUFBQSxJQUFJLENBQUN6QyxJQUFMLEdBQVlnQyxZQUFaO0FBRUFXLElBQUFBLE9BQU8sQ0FBQ0ksYUFBUixHQUF3QmYsWUFBeEI7QUFDQVcsSUFBQUEsT0FBTyxDQUFDSyxjQUFSLEdBQXlCUixJQUFJLENBQUNTLFdBQTlCO0FBQ0FOLElBQUFBLE9BQU8sQ0FBQ08sbUJBQVIsR0FBOEJWLElBQUksQ0FBQ1csZ0JBQW5DOztBQUNBUixJQUFBQSxPQUFPLENBQUNTLEtBQVI7O0FBRUEsV0FBT1QsT0FBUDtBQUNILEdBcEU0QztBQXNFN0NVLEVBQUFBLHNCQXRFNkMsa0NBc0VyQkMsZ0JBdEVxQixFQXNFSEMsWUF0RUcsRUFzRVc7QUFDcEQsUUFBSUQsZ0JBQUosRUFBc0I7QUFDbEJBLE1BQUFBLGdCQUFnQixDQUFDRSxhQUFqQixHQUFpQ0QsWUFBakM7QUFDSCxLQUZELE1BR0s7QUFDREQsTUFBQUEsZ0JBQWdCLEdBQUc1RCxVQUFVLENBQUMrRCxZQUFYLENBQXdCOUQsV0FBVyxDQUFDK0Qsa0JBQXBDLENBQW5CO0FBQ0g7O0FBQ0QsV0FBT0osZ0JBQVA7QUFDSCxHQTlFNEM7QUFnRjdDSyxFQUFBQSxVQWhGNkMsd0JBZ0YvQjtBQUNWLFFBQUlDLEtBQUssR0FBRyxLQUFLQyxNQUFqQjtBQUNBLFFBQUlDLFdBQVcsR0FBRyxFQUFsQjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFSLEVBQVdDLENBQUMsR0FBR0osS0FBSyxDQUFDSyxNQUExQixFQUFrQ0YsQ0FBQyxHQUFHQyxDQUF0QyxFQUF5Q0QsQ0FBQyxFQUExQyxFQUE4QztBQUMxQyxVQUFJRyxJQUFJLEdBQUdOLEtBQUssQ0FBQ0csQ0FBRCxDQUFoQjtBQUNBLFVBQUlJLE1BQU0sR0FBR0QsSUFBSSxDQUFDRSxPQUFsQjtBQUNBLFVBQUlDLFFBQVEsR0FBRyxLQUFmOztBQUNBLFdBQUssSUFBSUMsQ0FBQyxHQUFHUixXQUFXLENBQUNHLE1BQVosR0FBcUIsQ0FBbEMsRUFBcUNLLENBQUMsSUFBSSxDQUExQyxFQUE2Q0EsQ0FBQyxFQUE5QyxFQUFrRDtBQUM5QyxZQUFJSCxNQUFNLElBQUlMLFdBQVcsQ0FBQ1EsQ0FBRCxDQUFYLENBQWVGLE9BQTdCLEVBQXNDO0FBQ2xDTixVQUFBQSxXQUFXLENBQUNTLE1BQVosQ0FBbUJELENBQUMsR0FBQyxDQUFyQixFQUF3QixDQUF4QixFQUEyQkosSUFBM0I7QUFDQUcsVUFBQUEsUUFBUSxHQUFHLElBQVg7QUFDQTtBQUNIO0FBQ0o7O0FBQ0QsVUFBSSxDQUFDQSxRQUFMLEVBQWU7QUFDWFAsUUFBQUEsV0FBVyxDQUFDUyxNQUFaLENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQXlCTCxJQUF6QjtBQUNIO0FBQ0o7O0FBQ0QsU0FBS0wsTUFBTCxHQUFjQyxXQUFkO0FBQ0gsR0FuRzRDO0FBcUc3Q1UsRUFBQUEsY0FyRzZDLDBCQXFHN0JDLFdBckc2QixFQXFHaEI7QUFDekIsUUFBSXJDLFFBQVEsR0FBRzFDLFVBQVUsQ0FBQytELFlBQVgsQ0FBd0I5RCxXQUFXLENBQUMrRSxRQUFwQyxDQUFmO0FBRUF0QyxJQUFBQSxRQUFRLENBQUN1QyxTQUFULEdBQXFCRixXQUFXLENBQUNHLElBQWpDO0FBQ0F4QyxJQUFBQSxRQUFRLENBQUN5QyxVQUFULEdBQXNCbkYsVUFBVSxDQUFDK0QsWUFBWCxDQUF3QjlELFdBQVcsQ0FBQ21GLFNBQXBDLENBQXRCO0FBQ0ExQyxJQUFBQSxRQUFRLENBQUN5QyxVQUFULENBQW9CRSxTQUFwQixHQUFnQzNDLFFBQWhDO0FBQ0FBLElBQUFBLFFBQVEsQ0FBQ3lDLFVBQVQsQ0FBb0JHLFVBQXBCLEdBQWlDUCxXQUFXLENBQUNyQyxRQUFaLENBQXFCNEMsVUFBdEQ7QUFFQTVDLElBQUFBLFFBQVEsQ0FBQzZDLGdCQUFULEdBQTRCLEtBQTVCLENBUnlCLENBVXpCO0FBQ0E7O0FBRUEsUUFBSXRDLE9BQU8sR0FBRyxJQUFJaEQsV0FBVyxDQUFDVyxpQkFBaEIsRUFBZDtBQUVBOEIsSUFBQUEsUUFBUSxDQUFDOEMsSUFBVCxDQUFjVCxXQUFXLENBQUNyQyxRQUExQixFQUNJTyxPQURKLEVBQ2FBLE9BRGIsRUFDc0IsS0FBS3BDLFlBRDNCO0FBSUEsV0FBTzZCLFFBQVA7QUFDSCxHQXpINEM7QUEySDdDK0MsRUFBQUEsVUEzSDZDLHNCQTJIakNWLFdBM0hpQyxFQTJIcEJXLFFBM0hvQixFQTJIVkMsUUEzSFUsRUEySEE7QUFDekMsUUFBSW5CLElBQUksR0FBR3hFLFVBQVUsQ0FBQytELFlBQVgsQ0FBd0I5RCxXQUFXLENBQUMyRixNQUFwQyxDQUFYO0FBQ0EsUUFBSTNDLE9BQU8sR0FBR3VCLElBQWQ7QUFDQUEsSUFBQUEsSUFBSSxDQUFDZ0IsSUFBTCxDQUFVRSxRQUFWLEVBQW9CQyxRQUFwQixFQUE4QjFDLE9BQTlCLEVBQXVDQSxPQUF2QztBQUNBLFdBQU91QixJQUFQO0FBQ0gsR0FoSTRDO0FBa0k3Q3FCLEVBQUFBLHdCQWxJNkMsb0NBa0luQkMsSUFsSW1CLEVBa0liO0FBQzVCLFNBQUssSUFBSXhGLElBQVQsSUFBaUIsS0FBS3lGLG1CQUF0QixFQUEyQztBQUN2QyxVQUFJekYsSUFBSSxDQUFDMEYsT0FBTCxDQUFhRixJQUFiLEtBQXNCLENBQUMsQ0FBM0IsRUFBOEI7QUFDMUIsZUFBTyxLQUFLQyxtQkFBTCxDQUF5QnpGLElBQXpCLENBQVA7QUFDSDtBQUNKOztBQUNELFdBQU8sSUFBUDtBQUNILEdBekk0QztBQTJJN0MyRixFQUFBQSwyQkEzSTZDLHVDQTJJaEJILElBM0lnQixFQTJJVkksV0EzSVUsRUEySUc7QUFDNUMsUUFBSUEsV0FBVyxLQUFLLEtBQUssQ0FBekIsRUFBNEI7QUFBRUEsTUFBQUEsV0FBVyxHQUFHLElBQWQ7QUFBcUI7O0FBQ25ELFNBQUssSUFBSTVGLElBQVQsSUFBaUIsS0FBS3lGLG1CQUF0QixFQUEyQztBQUN2QyxVQUFJekYsSUFBSSxDQUFDMEYsT0FBTCxDQUFhRixJQUFiLE1BQXVCLENBQUMsQ0FBNUIsRUFBK0I7O0FBQy9CLFVBQUlJLFdBQUosRUFBaUI7QUFDYixhQUFLckYsWUFBTCxDQUFrQnNGLFlBQWxCLENBQStCLEtBQUtKLG1CQUFMLENBQXlCekYsSUFBekIsQ0FBL0I7QUFDSDs7QUFDRCxhQUFPLEtBQUt5RixtQkFBTCxDQUF5QnpGLElBQXpCLENBQVA7QUFDSDtBQUNKO0FBcEo0QyxDQUFULENBQXhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5sZXQgQmFzZU9iamVjdCA9IGRyYWdvbkJvbmVzLkJhc2VPYmplY3QsXG4gICAgQmFzZUZhY3RvcnkgPSBkcmFnb25Cb25lcy5CYXNlRmFjdG9yeTtcblxuLyoqXG4gKiBAbW9kdWxlIGRyYWdvbkJvbmVzXG4qL1xuXG4vKipcbiAqIERyYWdvbkJvbmVzIGZhY3RvcnlcbiAqIEBjbGFzcyBDQ0ZhY3RvcnlcbiAqIEBleHRlbmRzIEJhc2VGYWN0b3J5XG4qL1xudmFyIENDRmFjdG9yeSA9IGRyYWdvbkJvbmVzLkNDRmFjdG9yeSA9IGNjLkNsYXNzKHtcbiAgICBuYW1lOiAnZHJhZ29uQm9uZXMuQ0NGYWN0b3J5JyxcbiAgICBleHRlbmRzOiBCYXNlRmFjdG9yeSxcbiAgICAvKipcbiAgICAgKiBAbWV0aG9kIGdldEluc3RhbmNlXG4gICAgICogQHJldHVybiB7Q0NGYWN0b3J5fVxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBmYWN0b3J5ID0gZHJhZ29uQm9uZXMuQ0NGYWN0b3J5LmdldEluc3RhbmNlKCk7XG4gICAgKi9cbiAgICBzdGF0aWNzOiB7XG4gICAgICAgIF9mYWN0b3J5OiBudWxsLFxuICAgICAgICBnZXRJbnN0YW5jZSAoKSB7XG4gICAgICAgICAgICBpZiAoIUNDRmFjdG9yeS5fZmFjdG9yeSkge1xuICAgICAgICAgICAgICAgIENDRmFjdG9yeS5fZmFjdG9yeSA9IG5ldyBDQ0ZhY3RvcnkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBDQ0ZhY3RvcnkuX2ZhY3Rvcnk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIGxldCBldmVudE1hbmFnZXIgPSBuZXcgZHJhZ29uQm9uZXMuQ0NBcm1hdHVyZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5fZHJhZ29uQm9uZXMgPSBuZXcgZHJhZ29uQm9uZXMuRHJhZ29uQm9uZXMoZXZlbnRNYW5hZ2VyKTtcblxuICAgICAgICBpZiAoIUNDX05BVElWRVJFTkRFUkVSICYmICFDQ19FRElUT1IgJiYgY2MuZGlyZWN0b3IuX3NjaGVkdWxlcikge1xuICAgICAgICAgICAgY2MuZ2FtZS5vbihjYy5nYW1lLkVWRU5UX1JFU1RBUlQsIHRoaXMuaW5pdFVwZGF0ZSwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLmluaXRVcGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0VXBkYXRlIChkdCkge1xuICAgICAgICBjYy5kaXJlY3Rvci5fc2NoZWR1bGVyLmVuYWJsZUZvclRhcmdldCh0aGlzKTtcbiAgICAgICAgY2MuZGlyZWN0b3IuX3NjaGVkdWxlci5zY2hlZHVsZVVwZGF0ZSh0aGlzLCBjYy5TY2hlZHVsZXIuUFJJT1JJVFlfU1lTVEVNLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIHVwZGF0ZSAoZHQpIHtcbiAgICAgICAgdGhpcy5fZHJhZ29uQm9uZXMuYWR2YW5jZVRpbWUoZHQpO1xuICAgIH0sXG5cbiAgICBnZXREcmFnb25Cb25lc0RhdGFCeVJhd0RhdGEgKHJhd0RhdGEpIHtcbiAgICAgICAgdmFyIGRhdGFQYXJzZXIgPSByYXdEYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgPyBCYXNlRmFjdG9yeS5fYmluYXJ5UGFyc2VyIDogdGhpcy5fZGF0YVBhcnNlcjtcbiAgICAgICAgcmV0dXJuIGRhdGFQYXJzZXIucGFyc2VEcmFnb25Cb25lc0RhdGEocmF3RGF0YSwgMS4wKTtcbiAgICB9LFxuXG4gICAgLy8gQnVpbGQgbmV3IGFyYW10dXJlIHdpdGggYSBuZXcgZGlzcGxheS5cbiAgICBidWlsZEFybWF0dXJlRGlzcGxheSAoYXJtYXR1cmVOYW1lLCBkcmFnb25Cb25lc05hbWUsIHNraW5OYW1lLCB0ZXh0dXJlQXRsYXNOYW1lKSB7XG4gICAgICAgIGxldCBhcm1hdHVyZSA9IHRoaXMuYnVpbGRBcm1hdHVyZShhcm1hdHVyZU5hbWUsIGRyYWdvbkJvbmVzTmFtZSwgc2tpbk5hbWUsIHRleHR1cmVBdGxhc05hbWUpO1xuICAgICAgICByZXR1cm4gYXJtYXR1cmUgJiYgYXJtYXR1cmUuX2Rpc3BsYXk7XG4gICAgfSxcblxuICAgIC8vIEJ1aWxkIHN1YiBhcm1hdHVyZSBmcm9tIGFuIGV4aXN0IGFybWF0dXJlIGNvbXBvbmVudC5cbiAgICAvLyBJdCB3aWxsIHNoYXJlIGRyYWdvbkFzc2V0IGFuZCBkcmFnb25BdGxhc0Fzc2V0LlxuICAgIC8vIEJ1dCBub2RlIGNhbiBub3Qgc2hhcmUsb3Igd2lsbCBjYXVzZSByZW5kZXIgZXJyb3IuXG4gICAgY3JlYXRlQXJtYXR1cmVOb2RlIChjb21wLCBhcm1hdHVyZU5hbWUsIG5vZGUpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUgfHwgbmV3IGNjLk5vZGUoKTtcbiAgICAgICAgbGV0IGRpc3BsYXkgPSBub2RlLmdldENvbXBvbmVudChkcmFnb25Cb25lcy5Bcm1hdHVyZURpc3BsYXkpO1xuICAgICAgICBpZiAoIWRpc3BsYXkpIHtcbiAgICAgICAgICAgIGRpc3BsYXkgPSBub2RlLmFkZENvbXBvbmVudChkcmFnb25Cb25lcy5Bcm1hdHVyZURpc3BsYXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9kZS5uYW1lID0gYXJtYXR1cmVOYW1lO1xuICAgICAgICBcbiAgICAgICAgZGlzcGxheS5fYXJtYXR1cmVOYW1lID0gYXJtYXR1cmVOYW1lO1xuICAgICAgICBkaXNwbGF5Ll9OJGRyYWdvbkFzc2V0ID0gY29tcC5kcmFnb25Bc3NldDtcbiAgICAgICAgZGlzcGxheS5fTiRkcmFnb25BdGxhc0Fzc2V0ID0gY29tcC5kcmFnb25BdGxhc0Fzc2V0O1xuICAgICAgICBkaXNwbGF5Ll9pbml0KCk7XG5cbiAgICAgICAgcmV0dXJuIGRpc3BsYXk7XG4gICAgfSxcbiAgICBcbiAgICBfYnVpbGRUZXh0dXJlQXRsYXNEYXRhICh0ZXh0dXJlQXRsYXNEYXRhLCB0ZXh0dXJlQXRsYXMpIHtcbiAgICAgICAgaWYgKHRleHR1cmVBdGxhc0RhdGEpIHtcbiAgICAgICAgICAgIHRleHR1cmVBdGxhc0RhdGEucmVuZGVyVGV4dHVyZSA9IHRleHR1cmVBdGxhcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRleHR1cmVBdGxhc0RhdGEgPSBCYXNlT2JqZWN0LmJvcnJvd09iamVjdChkcmFnb25Cb25lcy5DQ1RleHR1cmVBdGxhc0RhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0dXJlQXRsYXNEYXRhO1xuICAgIH0sXG5cbiAgICBfc29ydFNsb3RzICgpIHtcbiAgICAgICAgbGV0IHNsb3RzID0gdGhpcy5fc2xvdHM7XG4gICAgICAgIGxldCBzb3J0ZWRTbG90cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHNsb3RzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgbGV0IHNsb3QgPSBzbG90c1tpXTtcbiAgICAgICAgICAgIGxldCB6T3JkZXIgPSBzbG90Ll96T3JkZXI7XG4gICAgICAgICAgICBsZXQgaW5zZXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSBzb3J0ZWRTbG90cy5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICAgICAgICAgIGlmICh6T3JkZXIgPj0gc29ydGVkU2xvdHNbal0uX3pPcmRlcikge1xuICAgICAgICAgICAgICAgICAgICBzb3J0ZWRTbG90cy5zcGxpY2UoaisxLCAwLCBzbG90KTtcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWluc2VydGVkKSB7XG4gICAgICAgICAgICAgICAgc29ydGVkU2xvdHMuc3BsaWNlKDAsIDAsIHNsb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Nsb3RzID0gc29ydGVkU2xvdHM7XG4gICAgfSxcblxuICAgIF9idWlsZEFybWF0dXJlIChkYXRhUGFja2FnZSkge1xuICAgICAgICBsZXQgYXJtYXR1cmUgPSBCYXNlT2JqZWN0LmJvcnJvd09iamVjdChkcmFnb25Cb25lcy5Bcm1hdHVyZSk7XG5cbiAgICAgICAgYXJtYXR1cmUuX3NraW5EYXRhID0gZGF0YVBhY2thZ2Uuc2tpbjtcbiAgICAgICAgYXJtYXR1cmUuX2FuaW1hdGlvbiA9IEJhc2VPYmplY3QuYm9ycm93T2JqZWN0KGRyYWdvbkJvbmVzLkFuaW1hdGlvbik7XG4gICAgICAgIGFybWF0dXJlLl9hbmltYXRpb24uX2FybWF0dXJlID0gYXJtYXR1cmU7XG4gICAgICAgIGFybWF0dXJlLl9hbmltYXRpb24uYW5pbWF0aW9ucyA9IGRhdGFQYWNrYWdlLmFybWF0dXJlLmFuaW1hdGlvbnM7XG5cbiAgICAgICAgYXJtYXR1cmUuX2lzQ2hpbGRBcm1hdHVyZSA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGZpeGVkIGRyYWdvbmJvbmVzIHNvcnQgaXNzdWVcbiAgICAgICAgLy8gYXJtYXR1cmUuX3NvcnRTbG90cyA9IHRoaXMuX3NvcnRTbG90cztcblxuICAgICAgICB2YXIgZGlzcGxheSA9IG5ldyBkcmFnb25Cb25lcy5DQ0FybWF0dXJlRGlzcGxheSgpO1xuXG4gICAgICAgIGFybWF0dXJlLmluaXQoZGF0YVBhY2thZ2UuYXJtYXR1cmUsXG4gICAgICAgICAgICBkaXNwbGF5LCBkaXNwbGF5LCB0aGlzLl9kcmFnb25Cb25lc1xuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGFybWF0dXJlO1xuICAgIH0sXG5cbiAgICBfYnVpbGRTbG90IChkYXRhUGFja2FnZSwgc2xvdERhdGEsIGRpc3BsYXlzKSB7XG4gICAgICAgIGxldCBzbG90ID0gQmFzZU9iamVjdC5ib3Jyb3dPYmplY3QoZHJhZ29uQm9uZXMuQ0NTbG90KTtcbiAgICAgICAgbGV0IGRpc3BsYXkgPSBzbG90O1xuICAgICAgICBzbG90LmluaXQoc2xvdERhdGEsIGRpc3BsYXlzLCBkaXNwbGF5LCBkaXNwbGF5KTtcbiAgICAgICAgcmV0dXJuIHNsb3Q7XG4gICAgfSxcblxuICAgIGdldERyYWdvbkJvbmVzRGF0YUJ5VVVJRCAodXVpZCkge1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMuX2RyYWdvbkJvbmVzRGF0YU1hcCkge1xuICAgICAgICAgICAgaWYgKG5hbWUuaW5kZXhPZih1dWlkKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kcmFnb25Cb25lc0RhdGFNYXBbbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbW92ZURyYWdvbkJvbmVzRGF0YUJ5VVVJRCAodXVpZCwgZGlzcG9zZURhdGEpIHtcbiAgICAgICAgaWYgKGRpc3Bvc2VEYXRhID09PSB2b2lkIDApIHsgZGlzcG9zZURhdGEgPSB0cnVlOyB9XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcy5fZHJhZ29uQm9uZXNEYXRhTWFwKSB7XG4gICAgICAgICAgICBpZiAobmFtZS5pbmRleE9mKHV1aWQpID09PSAtMSkgY29udGludWU7XG4gICAgICAgICAgICBpZiAoZGlzcG9zZURhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kcmFnb25Cb25lcy5idWZmZXJPYmplY3QodGhpcy5fZHJhZ29uQm9uZXNEYXRhTWFwW25hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9kcmFnb25Cb25lc0RhdGFNYXBbbmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiJdfQ==