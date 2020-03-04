
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCAudioClip.js';
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
var Asset = require('./CCAsset');

var EventTarget = require('../event/event-target');

var LoadMode = cc.Enum({
  WEB_AUDIO: 0,
  DOM_AUDIO: 1
});
/**
 * !#en Class for audio data handling.
 * !#zh 音频资源类。
 * @class AudioClip
 * @extends Asset
 * @uses EventTarget
 */

var AudioClip = cc.Class({
  name: 'cc.AudioClip',
  "extends": Asset,
  mixins: [EventTarget],
  ctor: function ctor() {
    this.loaded = false; // the web audio buffer or <audio> element

    this._audio = null;
  },
  properties: {
    loadMode: {
      "default": LoadMode.WEB_AUDIO,
      type: LoadMode
    },
    _nativeAsset: {
      get: function get() {
        return this._audio;
      },
      set: function set(value) {
        // HACK: fix load mp3 as audioClip, _nativeAsset is set as audioClip.
        // Should load mp3 as audioBuffer indeed.
        if (value instanceof cc.AudioClip) {
          this._audio = value._nativeAsset;
        } else {
          this._audio = value;
        }

        if (this._audio) {
          this.loaded = true;
          this.emit('load');
        }
      },
      override: true
    }
  },
  statics: {
    LoadMode: LoadMode,
    _loadByUrl: function _loadByUrl(url, callback) {
      var item = cc.loader.getItem(url) || cc.loader.getItem(url + '?useDom=1');

      if (!item || !item.complete) {
        cc.loader.load(url, function (error, downloadUrl) {
          if (error) {
            return callback(error);
          }

          item = cc.loader.getItem(url) || cc.loader.getItem(url + '?useDom=1');
          callback(null, item.content);
        });
      } else {
        if (item._owner instanceof AudioClip) {
          // preloaded and retained by audio clip
          callback(null, item._owner);
        } else {
          callback(null, item.content);
        }
      }
    }
  },
  destroy: function destroy() {
    cc.audioEngine.uncache(this);

    this._super();
  }
});
/**
 * !#zh
 * 当该资源加载成功后触发该事件
 * !#en
 * This event is emitted when the asset is loaded
 *
 * @event load
 */

cc.AudioClip = AudioClip;
module.exports = AudioClip;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQXVkaW9DbGlwLmpzIl0sIm5hbWVzIjpbIkFzc2V0IiwicmVxdWlyZSIsIkV2ZW50VGFyZ2V0IiwiTG9hZE1vZGUiLCJjYyIsIkVudW0iLCJXRUJfQVVESU8iLCJET01fQVVESU8iLCJBdWRpb0NsaXAiLCJDbGFzcyIsIm5hbWUiLCJtaXhpbnMiLCJjdG9yIiwibG9hZGVkIiwiX2F1ZGlvIiwicHJvcGVydGllcyIsImxvYWRNb2RlIiwidHlwZSIsIl9uYXRpdmVBc3NldCIsImdldCIsInNldCIsInZhbHVlIiwiZW1pdCIsIm92ZXJyaWRlIiwic3RhdGljcyIsIl9sb2FkQnlVcmwiLCJ1cmwiLCJjYWxsYmFjayIsIml0ZW0iLCJsb2FkZXIiLCJnZXRJdGVtIiwiY29tcGxldGUiLCJsb2FkIiwiZXJyb3IiLCJkb3dubG9hZFVybCIsImNvbnRlbnQiLCJfb3duZXIiLCJkZXN0cm95IiwiYXVkaW9FbmdpbmUiLCJ1bmNhY2hlIiwiX3N1cGVyIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLElBQU1BLEtBQUssR0FBR0MsT0FBTyxDQUFDLFdBQUQsQ0FBckI7O0FBQ0EsSUFBTUMsV0FBVyxHQUFHRCxPQUFPLENBQUMsdUJBQUQsQ0FBM0I7O0FBRUEsSUFBSUUsUUFBUSxHQUFHQyxFQUFFLENBQUNDLElBQUgsQ0FBUTtBQUNuQkMsRUFBQUEsU0FBUyxFQUFFLENBRFE7QUFFbkJDLEVBQUFBLFNBQVMsRUFBRTtBQUZRLENBQVIsQ0FBZjtBQUtBOzs7Ozs7OztBQU9BLElBQUlDLFNBQVMsR0FBR0osRUFBRSxDQUFDSyxLQUFILENBQVM7QUFDckJDLEVBQUFBLElBQUksRUFBRSxjQURlO0FBRXJCLGFBQVNWLEtBRlk7QUFHckJXLEVBQUFBLE1BQU0sRUFBRSxDQUFDVCxXQUFELENBSGE7QUFLckJVLEVBQUFBLElBTHFCLGtCQUtiO0FBQ0osU0FBS0MsTUFBTCxHQUFjLEtBQWQsQ0FESSxDQUdKOztBQUNBLFNBQUtDLE1BQUwsR0FBYyxJQUFkO0FBQ0gsR0FWb0I7QUFZckJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxRQUFRLEVBQUU7QUFDTixpQkFBU2IsUUFBUSxDQUFDRyxTQURaO0FBRU5XLE1BQUFBLElBQUksRUFBRWQ7QUFGQSxLQURGO0FBS1JlLElBQUFBLFlBQVksRUFBRTtBQUNWQyxNQUFBQSxHQURVLGlCQUNIO0FBQ0gsZUFBTyxLQUFLTCxNQUFaO0FBQ0gsT0FIUztBQUlWTSxNQUFBQSxHQUpVLGVBSUxDLEtBSkssRUFJRTtBQUNSO0FBQ0E7QUFDQSxZQUFJQSxLQUFLLFlBQVlqQixFQUFFLENBQUNJLFNBQXhCLEVBQW1DO0FBQy9CLGVBQUtNLE1BQUwsR0FBY08sS0FBSyxDQUFDSCxZQUFwQjtBQUNILFNBRkQsTUFHSztBQUNELGVBQUtKLE1BQUwsR0FBY08sS0FBZDtBQUNIOztBQUNELFlBQUksS0FBS1AsTUFBVCxFQUFpQjtBQUNiLGVBQUtELE1BQUwsR0FBYyxJQUFkO0FBQ0EsZUFBS1MsSUFBTCxDQUFVLE1BQVY7QUFDSDtBQUNKLE9BakJTO0FBa0JWQyxNQUFBQSxRQUFRLEVBQUU7QUFsQkE7QUFMTixHQVpTO0FBdUNyQkMsRUFBQUEsT0FBTyxFQUFFO0FBQ0xyQixJQUFBQSxRQUFRLEVBQUVBLFFBREw7QUFFTHNCLElBQUFBLFVBQVUsRUFBRSxvQkFBVUMsR0FBVixFQUFlQyxRQUFmLEVBQXlCO0FBQ2pDLFVBQUlDLElBQUksR0FBR3hCLEVBQUUsQ0FBQ3lCLE1BQUgsQ0FBVUMsT0FBVixDQUFrQkosR0FBbEIsS0FBMEJ0QixFQUFFLENBQUN5QixNQUFILENBQVVDLE9BQVYsQ0FBa0JKLEdBQUcsR0FBRyxXQUF4QixDQUFyQzs7QUFDQSxVQUFJLENBQUNFLElBQUQsSUFBUyxDQUFDQSxJQUFJLENBQUNHLFFBQW5CLEVBQTZCO0FBQ3pCM0IsUUFBQUEsRUFBRSxDQUFDeUIsTUFBSCxDQUFVRyxJQUFWLENBQWVOLEdBQWYsRUFBb0IsVUFBVU8sS0FBVixFQUFpQkMsV0FBakIsRUFBOEI7QUFDOUMsY0FBSUQsS0FBSixFQUFXO0FBQ1AsbUJBQU9OLFFBQVEsQ0FBQ00sS0FBRCxDQUFmO0FBQ0g7O0FBQ0RMLFVBQUFBLElBQUksR0FBR3hCLEVBQUUsQ0FBQ3lCLE1BQUgsQ0FBVUMsT0FBVixDQUFrQkosR0FBbEIsS0FBMEJ0QixFQUFFLENBQUN5QixNQUFILENBQVVDLE9BQVYsQ0FBa0JKLEdBQUcsR0FBRyxXQUF4QixDQUFqQztBQUNBQyxVQUFBQSxRQUFRLENBQUMsSUFBRCxFQUFPQyxJQUFJLENBQUNPLE9BQVosQ0FBUjtBQUNILFNBTkQ7QUFPSCxPQVJELE1BU0s7QUFDRCxZQUFJUCxJQUFJLENBQUNRLE1BQUwsWUFBdUI1QixTQUEzQixFQUFzQztBQUNsQztBQUNBbUIsVUFBQUEsUUFBUSxDQUFDLElBQUQsRUFBT0MsSUFBSSxDQUFDUSxNQUFaLENBQVI7QUFDSCxTQUhELE1BSUs7QUFDRFQsVUFBQUEsUUFBUSxDQUFDLElBQUQsRUFBT0MsSUFBSSxDQUFDTyxPQUFaLENBQVI7QUFDSDtBQUNKO0FBQ0o7QUF0QkksR0F2Q1k7QUFnRXJCRSxFQUFBQSxPQWhFcUIscUJBZ0VWO0FBQ1BqQyxJQUFBQSxFQUFFLENBQUNrQyxXQUFILENBQWVDLE9BQWYsQ0FBdUIsSUFBdkI7O0FBQ0EsU0FBS0MsTUFBTDtBQUNIO0FBbkVvQixDQUFULENBQWhCO0FBc0VBOzs7Ozs7Ozs7QUFTQXBDLEVBQUUsQ0FBQ0ksU0FBSCxHQUFlQSxTQUFmO0FBQ0FpQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJsQyxTQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cHM6Ly93d3cuY29jb3MuY29tL1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxuXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgQXNzZXQgPSByZXF1aXJlKCcuL0NDQXNzZXQnKTtcbmNvbnN0IEV2ZW50VGFyZ2V0ID0gcmVxdWlyZSgnLi4vZXZlbnQvZXZlbnQtdGFyZ2V0Jyk7XG5cbnZhciBMb2FkTW9kZSA9IGNjLkVudW0oe1xuICAgIFdFQl9BVURJTzogMCxcbiAgICBET01fQVVESU86IDEsXG59KTtcblxuLyoqXG4gKiAhI2VuIENsYXNzIGZvciBhdWRpbyBkYXRhIGhhbmRsaW5nLlxuICogISN6aCDpn7PpopHotYTmupDnsbvjgIJcbiAqIEBjbGFzcyBBdWRpb0NsaXBcbiAqIEBleHRlbmRzIEFzc2V0XG4gKiBAdXNlcyBFdmVudFRhcmdldFxuICovXG52YXIgQXVkaW9DbGlwID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdjYy5BdWRpb0NsaXAnLFxuICAgIGV4dGVuZHM6IEFzc2V0LFxuICAgIG1peGluczogW0V2ZW50VGFyZ2V0XSxcblxuICAgIGN0b3IgKCkge1xuICAgICAgICB0aGlzLmxvYWRlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIHRoZSB3ZWIgYXVkaW8gYnVmZmVyIG9yIDxhdWRpbz4gZWxlbWVudFxuICAgICAgICB0aGlzLl9hdWRpbyA9IG51bGw7XG4gICAgfSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbG9hZE1vZGU6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IExvYWRNb2RlLldFQl9BVURJTyxcbiAgICAgICAgICAgIHR5cGU6IExvYWRNb2RlXG4gICAgICAgIH0sXG4gICAgICAgIF9uYXRpdmVBc3NldDoge1xuICAgICAgICAgICAgZ2V0ICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYXVkaW87XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0ICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIC8vIEhBQ0s6IGZpeCBsb2FkIG1wMyBhcyBhdWRpb0NsaXAsIF9uYXRpdmVBc3NldCBpcyBzZXQgYXMgYXVkaW9DbGlwLlxuICAgICAgICAgICAgICAgIC8vIFNob3VsZCBsb2FkIG1wMyBhcyBhdWRpb0J1ZmZlciBpbmRlZWQuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgY2MuQXVkaW9DbGlwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F1ZGlvID0gdmFsdWUuX25hdGl2ZUFzc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXVkaW8gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2F1ZGlvKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdsb2FkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG92ZXJyaWRlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhdGljczoge1xuICAgICAgICBMb2FkTW9kZTogTG9hZE1vZGUsXG4gICAgICAgIF9sb2FkQnlVcmw6IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNjLmxvYWRlci5nZXRJdGVtKHVybCkgfHwgY2MubG9hZGVyLmdldEl0ZW0odXJsICsgJz91c2VEb209MScpO1xuICAgICAgICAgICAgaWYgKCFpdGVtIHx8ICFpdGVtLmNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgY2MubG9hZGVyLmxvYWQodXJsLCBmdW5jdGlvbiAoZXJyb3IsIGRvd25sb2FkVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpdGVtID0gY2MubG9hZGVyLmdldEl0ZW0odXJsKSB8fCBjYy5sb2FkZXIuZ2V0SXRlbSh1cmwgKyAnP3VzZURvbT0xJyk7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0uY29udGVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5fb3duZXIgaW5zdGFuY2VvZiBBdWRpb0NsaXApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcHJlbG9hZGVkIGFuZCByZXRhaW5lZCBieSBhdWRpbyBjbGlwXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0uX293bmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGl0ZW0uY29udGVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlc3Ryb3kgKCkge1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS51bmNhY2hlKHRoaXMpO1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqICEjemhcbiAqIOW9k+ivpei1hOa6kOWKoOi9veaIkOWKn+WQjuinpuWPkeivpeS6i+S7tlxuICogISNlblxuICogVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gdGhlIGFzc2V0IGlzIGxvYWRlZFxuICpcbiAqIEBldmVudCBsb2FkXG4gKi9cblxuY2MuQXVkaW9DbGlwID0gQXVkaW9DbGlwO1xubW9kdWxlLmV4cG9ydHMgPSBBdWRpb0NsaXA7XG4iXX0=