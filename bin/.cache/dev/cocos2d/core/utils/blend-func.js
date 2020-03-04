
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/utils/blend-func.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var RenderComponent = require('../components/CCRenderComponent');

var BlendFactor = require('../platform/CCMacro').BlendFactor;

var gfx = require('../../renderer/gfx');
/**
 * !#en
 * Helper class for setting material blend function.
 * !#zh
 * 设置材质混合模式的辅助类。
 * @class BlendFunc
 */


var BlendFunc = cc.Class({
  properties: {
    _srcBlendFactor: BlendFactor.SRC_ALPHA,
    _dstBlendFactor: BlendFactor.ONE_MINUS_SRC_ALPHA,

    /**
     * !#en specify the source Blend Factor, this will generate a custom material object, please pay attention to the memory cost.
     * !#zh 指定原图的混合模式，这会克隆一个新的材质对象，注意这带来的开销
     * @property srcBlendFactor
     * @type {macro.BlendFactor}
     * @example
     * sprite.srcBlendFactor = cc.macro.BlendFactor.ONE;
     */
    srcBlendFactor: {
      get: function get() {
        return this._srcBlendFactor;
      },
      set: function set(value) {
        if (this._srcBlendFactor === value) return;
        this._srcBlendFactor = value;

        this._updateBlendFunc();
      },
      animatable: false,
      type: BlendFactor,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.src_blend_factor',
      visible: true
    },

    /**
     * !#en specify the destination Blend Factor.
     * !#zh 指定目标的混合模式
     * @property dstBlendFactor
     * @type {macro.BlendFactor}
     * @example
     * sprite.dstBlendFactor = cc.macro.BlendFactor.ONE;
     */
    dstBlendFactor: {
      get: function get() {
        return this._dstBlendFactor;
      },
      set: function set(value) {
        if (this._dstBlendFactor === value) return;
        this._dstBlendFactor = value;

        this._updateBlendFunc();
      },
      animatable: false,
      type: BlendFactor,
      tooltip: CC_DEV && 'i18n:COMPONENT.sprite.dst_blend_factor',
      visible: true
    }
  },
  setMaterial: function setMaterial(index, material) {
    RenderComponent.prototype.setMaterial.call(this, index, material);

    if (this._srcBlendFactor === BlendFactor.SRC_ALPHA && this._dstBlendFactor === BlendFactor.ONE_MINUS_SRC_ALPHA) {
      return;
    }

    this._updateMaterialBlendFunc(material);
  },
  _updateMaterial: function _updateMaterial() {
    this._updateBlendFunc();
  },
  _updateBlendFunc: function _updateBlendFunc() {
    if (this._srcBlendFactor === BlendFactor.SRC_ALPHA && this._dstBlendFactor === BlendFactor.ONE_MINUS_SRC_ALPHA) {
      return;
    }

    var materials = this.getMaterials();

    for (var i = 0; i < materials.length; i++) {
      var material = materials[i];

      this._updateMaterialBlendFunc(material);
    }
  },
  _updateMaterialBlendFunc: function _updateMaterialBlendFunc(material) {
    material.setBlend(true, gfx.BLEND_FUNC_ADD, this._srcBlendFactor, this._dstBlendFactor, gfx.BLEND_FUNC_ADD, this._srcBlendFactor, this._dstBlendFactor);
  }
});
module.exports = cc.BlendFunc = BlendFunc;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJsZW5kLWZ1bmMuanMiXSwibmFtZXMiOlsiUmVuZGVyQ29tcG9uZW50IiwicmVxdWlyZSIsIkJsZW5kRmFjdG9yIiwiZ2Z4IiwiQmxlbmRGdW5jIiwiY2MiLCJDbGFzcyIsInByb3BlcnRpZXMiLCJfc3JjQmxlbmRGYWN0b3IiLCJTUkNfQUxQSEEiLCJfZHN0QmxlbmRGYWN0b3IiLCJPTkVfTUlOVVNfU1JDX0FMUEhBIiwic3JjQmxlbmRGYWN0b3IiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl91cGRhdGVCbGVuZEZ1bmMiLCJhbmltYXRhYmxlIiwidHlwZSIsInRvb2x0aXAiLCJDQ19ERVYiLCJ2aXNpYmxlIiwiZHN0QmxlbmRGYWN0b3IiLCJzZXRNYXRlcmlhbCIsImluZGV4IiwibWF0ZXJpYWwiLCJwcm90b3R5cGUiLCJjYWxsIiwiX3VwZGF0ZU1hdGVyaWFsQmxlbmRGdW5jIiwiX3VwZGF0ZU1hdGVyaWFsIiwibWF0ZXJpYWxzIiwiZ2V0TWF0ZXJpYWxzIiwiaSIsImxlbmd0aCIsInNldEJsZW5kIiwiQkxFTkRfRlVOQ19BREQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBTUEsZUFBZSxHQUFHQyxPQUFPLENBQUMsaUNBQUQsQ0FBL0I7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHRCxPQUFPLENBQUMscUJBQUQsQ0FBUCxDQUErQkMsV0FBbkQ7O0FBQ0EsSUFBTUMsR0FBRyxHQUFHRixPQUFPLENBQUMsb0JBQUQsQ0FBbkI7QUFFQTs7Ozs7Ozs7O0FBT0EsSUFBSUcsU0FBUyxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNyQkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLGVBQWUsRUFBRU4sV0FBVyxDQUFDTyxTQURyQjtBQUVSQyxJQUFBQSxlQUFlLEVBQUVSLFdBQVcsQ0FBQ1MsbUJBRnJCOztBQUlSOzs7Ozs7OztBQVFBQyxJQUFBQSxjQUFjLEVBQUU7QUFDWkMsTUFBQUEsR0FEWSxpQkFDTDtBQUNILGVBQU8sS0FBS0wsZUFBWjtBQUNILE9BSFc7QUFJWk0sTUFBQUEsR0FKWSxlQUlQQyxLQUpPLEVBSUE7QUFDUixZQUFJLEtBQUtQLGVBQUwsS0FBeUJPLEtBQTdCLEVBQW9DO0FBQ3BDLGFBQUtQLGVBQUwsR0FBdUJPLEtBQXZCOztBQUNBLGFBQUtDLGdCQUFMO0FBQ0gsT0FSVztBQVNaQyxNQUFBQSxVQUFVLEVBQUUsS0FUQTtBQVVaQyxNQUFBQSxJQUFJLEVBQUVoQixXQVZNO0FBV1ppQixNQUFBQSxPQUFPLEVBQUVDLE1BQU0sSUFBSSx3Q0FYUDtBQVlaQyxNQUFBQSxPQUFPLEVBQUU7QUFaRyxLQVpSOztBQTJCUjs7Ozs7Ozs7QUFRQUMsSUFBQUEsY0FBYyxFQUFFO0FBQ1pULE1BQUFBLEdBRFksaUJBQ0w7QUFDSCxlQUFPLEtBQUtILGVBQVo7QUFDSCxPQUhXO0FBSVpJLE1BQUFBLEdBSlksZUFJUEMsS0FKTyxFQUlBO0FBQ1IsWUFBSSxLQUFLTCxlQUFMLEtBQXlCSyxLQUE3QixFQUFvQztBQUNwQyxhQUFLTCxlQUFMLEdBQXVCSyxLQUF2Qjs7QUFDQSxhQUFLQyxnQkFBTDtBQUNILE9BUlc7QUFTWkMsTUFBQUEsVUFBVSxFQUFFLEtBVEE7QUFVWkMsTUFBQUEsSUFBSSxFQUFFaEIsV0FWTTtBQVdaaUIsTUFBQUEsT0FBTyxFQUFFQyxNQUFNLElBQUksd0NBWFA7QUFZWkMsTUFBQUEsT0FBTyxFQUFFO0FBWkc7QUFuQ1IsR0FEUztBQW9EckJFLEVBQUFBLFdBcERxQix1QkFvRFJDLEtBcERRLEVBb0REQyxRQXBEQyxFQW9EUztBQUMxQnpCLElBQUFBLGVBQWUsQ0FBQzBCLFNBQWhCLENBQTBCSCxXQUExQixDQUFzQ0ksSUFBdEMsQ0FBMkMsSUFBM0MsRUFBaURILEtBQWpELEVBQXdEQyxRQUF4RDs7QUFFQSxRQUFJLEtBQUtqQixlQUFMLEtBQXlCTixXQUFXLENBQUNPLFNBQXJDLElBQWtELEtBQUtDLGVBQUwsS0FBeUJSLFdBQVcsQ0FBQ1MsbUJBQTNGLEVBQWdIO0FBQzVHO0FBQ0g7O0FBQ0QsU0FBS2lCLHdCQUFMLENBQThCSCxRQUE5QjtBQUNILEdBM0RvQjtBQTZEckJJLEVBQUFBLGVBN0RxQiw2QkE2REY7QUFDZixTQUFLYixnQkFBTDtBQUNILEdBL0RvQjtBQWlFckJBLEVBQUFBLGdCQWpFcUIsOEJBaUVEO0FBQ2hCLFFBQUksS0FBS1IsZUFBTCxLQUF5Qk4sV0FBVyxDQUFDTyxTQUFyQyxJQUFrRCxLQUFLQyxlQUFMLEtBQXlCUixXQUFXLENBQUNTLG1CQUEzRixFQUFnSDtBQUM1RztBQUNIOztBQUNELFFBQUltQixTQUFTLEdBQUcsS0FBS0MsWUFBTCxFQUFoQjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdGLFNBQVMsQ0FBQ0csTUFBOUIsRUFBc0NELENBQUMsRUFBdkMsRUFBMkM7QUFDdkMsVUFBSVAsUUFBUSxHQUFHSyxTQUFTLENBQUNFLENBQUQsQ0FBeEI7O0FBQ0EsV0FBS0osd0JBQUwsQ0FBOEJILFFBQTlCO0FBQ0g7QUFDSixHQTFFb0I7QUE0RXJCRyxFQUFBQSx3QkE1RXFCLG9DQTRFS0gsUUE1RUwsRUE0RWU7QUFDaENBLElBQUFBLFFBQVEsQ0FBQ1MsUUFBVCxDQUNJLElBREosRUFFSS9CLEdBQUcsQ0FBQ2dDLGNBRlIsRUFHSSxLQUFLM0IsZUFIVCxFQUcwQixLQUFLRSxlQUgvQixFQUlJUCxHQUFHLENBQUNnQyxjQUpSLEVBS0ksS0FBSzNCLGVBTFQsRUFLMEIsS0FBS0UsZUFML0I7QUFPSDtBQXBGb0IsQ0FBVCxDQUFoQjtBQXVGQTBCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmhDLEVBQUUsQ0FBQ0QsU0FBSCxHQUFlQSxTQUFoQyIsInNvdXJjZXNDb250ZW50IjpbIlxuY29uc3QgUmVuZGVyQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9DQ1JlbmRlckNvbXBvbmVudCcpO1xuY29uc3QgQmxlbmRGYWN0b3IgPSByZXF1aXJlKCcuLi9wbGF0Zm9ybS9DQ01hY3JvJykuQmxlbmRGYWN0b3I7XG5jb25zdCBnZnggPSByZXF1aXJlKCcuLi8uLi9yZW5kZXJlci9nZngnKTtcblxuLyoqXG4gKiAhI2VuXG4gKiBIZWxwZXIgY2xhc3MgZm9yIHNldHRpbmcgbWF0ZXJpYWwgYmxlbmQgZnVuY3Rpb24uXG4gKiAhI3poXG4gKiDorr7nva7mnZDotKjmt7flkIjmqKHlvI/nmoTovoXliqnnsbvjgIJcbiAqIEBjbGFzcyBCbGVuZEZ1bmNcbiAqL1xubGV0IEJsZW5kRnVuYyA9IGNjLkNsYXNzKHtcbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF9zcmNCbGVuZEZhY3RvcjogQmxlbmRGYWN0b3IuU1JDX0FMUEhBLFxuICAgICAgICBfZHN0QmxlbmRGYWN0b3I6IEJsZW5kRmFjdG9yLk9ORV9NSU5VU19TUkNfQUxQSEEsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gc3BlY2lmeSB0aGUgc291cmNlIEJsZW5kIEZhY3RvciwgdGhpcyB3aWxsIGdlbmVyYXRlIGEgY3VzdG9tIG1hdGVyaWFsIG9iamVjdCwgcGxlYXNlIHBheSBhdHRlbnRpb24gdG8gdGhlIG1lbW9yeSBjb3N0LlxuICAgICAgICAgKiAhI3poIOaMh+WumuWOn+WbvueahOa3t+WQiOaooeW8j++8jOi/meS8muWFi+mahuS4gOS4quaWsOeahOadkOi0qOWvueixoe+8jOazqOaEj+i/meW4puadpeeahOW8gOmUgFxuICAgICAgICAgKiBAcHJvcGVydHkgc3JjQmxlbmRGYWN0b3JcbiAgICAgICAgICogQHR5cGUge21hY3JvLkJsZW5kRmFjdG9yfVxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiBzcHJpdGUuc3JjQmxlbmRGYWN0b3IgPSBjYy5tYWNyby5CbGVuZEZhY3Rvci5PTkU7XG4gICAgICAgICAqL1xuICAgICAgICBzcmNCbGVuZEZhY3Rvcjoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3JjQmxlbmRGYWN0b3I7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zcmNCbGVuZEZhY3RvciA9PT0gdmFsdWUpIHJldHVybjtcbiAgICAgICAgICAgICAgICB0aGlzLl9zcmNCbGVuZEZhY3RvciA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUJsZW5kRnVuYygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgdHlwZTogQmxlbmRGYWN0b3IsXG4gICAgICAgICAgICB0b29sdGlwOiBDQ19ERVYgJiYgJ2kxOG46Q09NUE9ORU5ULnNwcml0ZS5zcmNfYmxlbmRfZmFjdG9yJyxcbiAgICAgICAgICAgIHZpc2libGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogISNlbiBzcGVjaWZ5IHRoZSBkZXN0aW5hdGlvbiBCbGVuZCBGYWN0b3IuXG4gICAgICAgICAqICEjemgg5oyH5a6a55uu5qCH55qE5re35ZCI5qih5byPXG4gICAgICAgICAqIEBwcm9wZXJ0eSBkc3RCbGVuZEZhY3RvclxuICAgICAgICAgKiBAdHlwZSB7bWFjcm8uQmxlbmRGYWN0b3J9XG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIHNwcml0ZS5kc3RCbGVuZEZhY3RvciA9IGNjLm1hY3JvLkJsZW5kRmFjdG9yLk9ORTtcbiAgICAgICAgICovXG4gICAgICAgIGRzdEJsZW5kRmFjdG9yOiB7XG4gICAgICAgICAgICBnZXQgKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9kc3RCbGVuZEZhY3RvcjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RzdEJsZW5kRmFjdG9yID09PSB2YWx1ZSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIHRoaXMuX2RzdEJsZW5kRmFjdG9yID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlQmxlbmRGdW5jKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0YWJsZTogZmFsc2UsXG4gICAgICAgICAgICB0eXBlOiBCbGVuZEZhY3RvcixcbiAgICAgICAgICAgIHRvb2x0aXA6IENDX0RFViAmJiAnaTE4bjpDT01QT05FTlQuc3ByaXRlLmRzdF9ibGVuZF9mYWN0b3InLFxuICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICBzZXRNYXRlcmlhbCAoaW5kZXgsIG1hdGVyaWFsKSB7XG4gICAgICAgIFJlbmRlckNvbXBvbmVudC5wcm90b3R5cGUuc2V0TWF0ZXJpYWwuY2FsbCh0aGlzLCBpbmRleCwgbWF0ZXJpYWwpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuX3NyY0JsZW5kRmFjdG9yID09PSBCbGVuZEZhY3Rvci5TUkNfQUxQSEEgJiYgdGhpcy5fZHN0QmxlbmRGYWN0b3IgPT09IEJsZW5kRmFjdG9yLk9ORV9NSU5VU19TUkNfQUxQSEEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbEJsZW5kRnVuYyhtYXRlcmlhbCk7XG4gICAgfSxcblxuICAgIF91cGRhdGVNYXRlcmlhbCAoKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUJsZW5kRnVuYygpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRlQmxlbmRGdW5jICgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NyY0JsZW5kRmFjdG9yID09PSBCbGVuZEZhY3Rvci5TUkNfQUxQSEEgJiYgdGhpcy5fZHN0QmxlbmRGYWN0b3IgPT09IEJsZW5kRmFjdG9yLk9ORV9NSU5VU19TUkNfQUxQSEEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gdGhpcy5nZXRNYXRlcmlhbHMoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRlcmlhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBtYXRlcmlhbCA9IG1hdGVyaWFsc1tpXTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZU1hdGVyaWFsQmxlbmRGdW5jKG1hdGVyaWFsKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfdXBkYXRlTWF0ZXJpYWxCbGVuZEZ1bmMgKG1hdGVyaWFsKSB7XG4gICAgICAgIG1hdGVyaWFsLnNldEJsZW5kKFxuICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgIGdmeC5CTEVORF9GVU5DX0FERCxcbiAgICAgICAgICAgIHRoaXMuX3NyY0JsZW5kRmFjdG9yLCB0aGlzLl9kc3RCbGVuZEZhY3RvcixcbiAgICAgICAgICAgIGdmeC5CTEVORF9GVU5DX0FERCxcbiAgICAgICAgICAgIHRoaXMuX3NyY0JsZW5kRmFjdG9yLCB0aGlzLl9kc3RCbGVuZEZhY3RvclxuICAgICAgICApO1xuICAgIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBjYy5CbGVuZEZ1bmMgPSBCbGVuZEZ1bmM7XG4iXX0=