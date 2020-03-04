
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/audio/CCAudio.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
var EventTarget = require('../core/event/event-target');

var sys = require('../core/platform/CCSys');

var LoadMode = require('../core/assets/CCAudioClip').LoadMode;

var touchBinded = false;
var touchPlayList = [//{ instance: Audio, offset: 0, audio: audio }
];

var Audio = function Audio(src) {
  EventTarget.call(this);
  this._src = src;
  this._element = null;
  this.id = 0;
  this._volume = 1;
  this._loop = false;
  this._nextTime = 0; // playback position to set

  this._state = Audio.State.INITIALZING;

  this._onended = function () {
    this._state = Audio.State.STOPPED;
    this.emit('ended');
  }.bind(this);
};

cc.js.extend(Audio, EventTarget);
/**
 * !#en Audio state.
 * !#zh 声音播放状态
 * @enum audioEngine.AudioState
 * @memberof cc
 */
// TODO - At present, the state is mixed with two states of users and systems, and it is best to split into two types. A "loading" should also be added to the system state.

Audio.State = {
  /**
   * @property {Number} ERROR
   */
  ERROR: -1,

  /**
   * @property {Number} INITIALZING
   */
  INITIALZING: 0,

  /**
   * @property {Number} PLAYING
   */
  PLAYING: 1,

  /**
   * @property {Number} PAUSED
   */
  PAUSED: 2,

  /**
   * @property {Number} STOPPED
   */
  STOPPED: 3
};

(function (proto) {
  proto._bindEnded = function (callback) {
    callback = callback || this._onended;
    var elem = this._element;

    if (this._src && elem instanceof HTMLAudioElement) {
      elem.addEventListener('ended', callback);
    } else {
      elem.onended = callback;
    }
  };

  proto._unbindEnded = function () {
    var elem = this._element;

    if (elem instanceof HTMLAudioElement) {
      elem.removeEventListener('ended', this._onended);
    } else if (elem) {
      elem.onended = null;
    }
  }; // proto.mount = function (elem) {
  //     if (CC_DEBUG) {
  //         cc.warn('Audio.mount(value) is deprecated. Please use Audio._onLoaded().');
  //     }
  // };


  proto._onLoaded = function () {
    this._createElement();

    this.setVolume(this._volume);
    this.setLoop(this._loop);

    if (this._nextTime !== 0) {
      this.setCurrentTime(this._nextTime);
    }

    if (this.getState() === Audio.State.PLAYING) {
      this.play();
    } else {
      this._state = Audio.State.INITIALZING;
    }
  };

  proto._createElement = function () {
    var elem = this._src._nativeAsset;

    if (elem instanceof HTMLAudioElement) {
      // Reuse dom audio element
      if (!this._element) {
        this._element = document.createElement('audio');
      }

      this._element.src = elem.src;
    } else {
      this._element = new WebAudioElement(elem, this);
    }
  };

  proto.play = function () {
    // marked as playing so it will playOnLoad
    this._state = Audio.State.PLAYING;

    if (!this._element) {
      return;
    }

    this._bindEnded();

    this._element.play();

    this._touchToPlay();
  };

  proto._touchToPlay = function () {
    if (this._src && this._src.loadMode === LoadMode.DOM_AUDIO && this._element.paused) {
      touchPlayList.push({
        instance: this,
        offset: 0,
        audio: this._element
      });
    }

    if (touchBinded) return;
    touchBinded = true;
    var touchEventName = 'ontouchend' in window ? 'touchend' : 'mousedown'; // Listen to the touchstart body event and play the audio when necessary.

    cc.game.canvas.addEventListener(touchEventName, function () {
      var item;

      while (item = touchPlayList.pop()) {
        item.audio.play(item.offset);
      }
    });
  };

  proto.destroy = function () {
    this._element = null;
  };

  proto.pause = function () {
    if (!this._element || this.getState() !== Audio.State.PLAYING) return;

    this._unbindEnded();

    this._element.pause();

    this._state = Audio.State.PAUSED;
  };

  proto.resume = function () {
    if (!this._element || this.getState() !== Audio.State.PAUSED) return;

    this._bindEnded();

    this._element.play();

    this._state = Audio.State.PLAYING;
  };

  proto.stop = function () {
    if (!this._element) return;

    this._element.pause();

    try {
      this._element.currentTime = 0;
    } catch (error) {} // remove touchPlayList


    for (var i = 0; i < touchPlayList.length; i++) {
      if (touchPlayList[i].instance === this) {
        touchPlayList.splice(i, 1);
        break;
      }
    }

    this._unbindEnded();

    this.emit('stop');
    this._state = Audio.State.STOPPED;
  };

  proto.setLoop = function (loop) {
    this._loop = loop;

    if (this._element) {
      this._element.loop = loop;
    }
  };

  proto.getLoop = function () {
    return this._loop;
  };

  proto.setVolume = function (num) {
    this._volume = num;

    if (this._element) {
      this._element.volume = num;
    }
  };

  proto.getVolume = function () {
    return this._volume;
  };

  proto.setCurrentTime = function (num) {
    if (this._element) {
      this._nextTime = 0;
    } else {
      this._nextTime = num;
      return;
    } // setCurrentTime would fire 'ended' event
    // so we need to change the callback to rebind ended callback after setCurrentTime


    this._unbindEnded();

    this._bindEnded(function () {
      this._bindEnded();
    }.bind(this));

    try {
      this._element.currentTime = num;
    } catch (err) {
      var _element = this._element;

      if (_element.addEventListener) {
        var func = function func() {
          _element.removeEventListener('loadedmetadata', func);

          _element.currentTime = num;
        };

        _element.addEventListener('loadedmetadata', func);
      }
    }
  };

  proto.getCurrentTime = function () {
    return this._element ? this._element.currentTime : 0;
  };

  proto.getDuration = function () {
    return this._element ? this._element.duration : 0;
  };

  proto.getState = function () {
    // HACK: in some browser, audio may not fire 'ended' event
    // so we need to force updating the Audio state
    this._forceUpdatingState();

    return this._state;
  };

  proto._forceUpdatingState = function () {
    var elem = this._element;

    if (elem) {
      if (Audio.State.PLAYING === this._state && elem.paused) {
        this._state = Audio.State.STOPPED;
      } else if (Audio.State.STOPPED === this._state && !elem.paused) {
        this._state = Audio.State.PLAYING;
      }
    }
  };

  Object.defineProperty(proto, 'src', {
    get: function get() {
      return this._src;
    },
    set: function set(clip) {
      this._unbindEnded();

      if (clip) {
        this._src = clip;

        if (clip.loaded) {
          this._onLoaded();
        } else {
          var self = this;
          clip.once('load', function () {
            if (clip === self._src) {
              self._onLoaded();
            }
          });
          cc.loader.load({
            url: clip.nativeUrl,
            // For audio, we should skip loader otherwise it will load a new audioClip.
            skips: ['Loader']
          }, function (err, audioNativeAsset) {
            if (err) {
              cc.error(err);
              return;
            }

            if (!clip.loaded) {
              clip._nativeAsset = audioNativeAsset;
            }
          });
        }
      } else {
        this._src = null;

        if (this._element instanceof WebAudioElement) {
          this._element = null;
        } else {
          this._element.src = '';
        }

        this._state = Audio.State.INITIALZING;
      }

      return clip;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'paused', {
    get: function get() {
      return this._element ? this._element.paused : true;
    },
    enumerable: true,
    configurable: true
  }); // setFinishCallback
})(Audio.prototype); // TIME_CONSTANT is used as an argument of setTargetAtTime interface
// TIME_CONSTANT need to be a positive number on Edge and Baidu browser
// TIME_CONSTANT need to be 0 by default, or may fail to set volume at the very beginning of playing audio


var TIME_CONSTANT;

if (cc.sys.browserType === cc.sys.BROWSER_TYPE_EDGE || cc.sys.browserType === cc.sys.BROWSER_TYPE_BAIDU || cc.sys.browserType === cc.sys.BROWSER_TYPE_UC) {
  TIME_CONSTANT = 0.01;
} else {
  TIME_CONSTANT = 0;
} // Encapsulated WebAudio interface


var WebAudioElement = function WebAudioElement(buffer, audio) {
  this._audio = audio;
  this._context = sys.__audioSupport.context;
  this._buffer = buffer;
  this._gainObj = this._context['createGain']();
  this.volume = 1;

  this._gainObj['connect'](this._context['destination']);

  this._loop = false; // The time stamp on the audio time axis when the recording begins to play.

  this._startTime = -1; // Record the currently playing 'Source'

  this._currentSource = null; // Record the time has been played

  this.playedLength = 0;
  this._currentTimer = null;

  this._endCallback = function () {
    if (this.onended) {
      this.onended(this);
    }
  }.bind(this);
};

(function (proto) {
  proto.play = function (offset) {
    // If repeat play, you need to stop before an audio
    if (this._currentSource && !this.paused) {
      this._currentSource.onended = null;

      this._currentSource.stop(0);

      this.playedLength = 0;
    }

    var audio = this._context["createBufferSource"]();

    audio.buffer = this._buffer;
    audio["connect"](this._gainObj);
    audio.loop = this._loop;
    this._startTime = this._context.currentTime;
    offset = offset || this.playedLength;

    if (offset) {
      this._startTime -= offset;
    }

    var duration = this._buffer.duration;
    var startTime = offset;
    var endTime;

    if (this._loop) {
      if (audio.start) audio.start(0, startTime);else if (audio["notoGrainOn"]) audio["noteGrainOn"](0, startTime);else audio["noteOn"](0, startTime);
    } else {
      endTime = duration - offset;
      if (audio.start) audio.start(0, startTime, endTime);else if (audio["noteGrainOn"]) audio["noteGrainOn"](0, startTime, endTime);else audio["noteOn"](0, startTime, endTime);
    }

    this._currentSource = audio;
    audio.onended = this._endCallback; // If the current audio context time stamp is 0 and audio context state is suspended
    // There may be a need to touch events before you can actually start playing audio

    if ((!audio.context.state || audio.context.state === "suspended") && this._context.currentTime === 0) {
      var self = this;
      clearTimeout(this._currentTimer);
      this._currentTimer = setTimeout(function () {
        if (self._context.currentTime === 0) {
          touchPlayList.push({
            instance: self._audio,
            offset: offset,
            audio: self
          });
        }
      }, 10);
    } // HACK: fix mobile safari can't play


    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_SAFARI && cc.sys.isMobile) {
      if (audio.context.state === 'interrupted') {
        audio.context.resume();
      }
    }
  };

  proto.pause = function () {
    clearTimeout(this._currentTimer);
    if (this.paused) return; // Record the time the current has been played

    this.playedLength = this._context.currentTime - this._startTime; // If more than the duration of the audio, Need to take the remainder

    this.playedLength %= this._buffer.duration;
    var audio = this._currentSource;
    this._currentSource = null;
    this._startTime = -1;
    if (audio) audio.stop(0);
  };

  Object.defineProperty(proto, 'paused', {
    get: function get() {
      // If the current audio is a loop, paused is false
      if (this._currentSource && this._currentSource.loop) return false; // startTime default is -1

      if (this._startTime === -1) return true; // Current time -  Start playing time > Audio duration

      return this._context.currentTime - this._startTime > this._buffer.duration;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'loop', {
    get: function get() {
      return this._loop;
    },
    set: function set(bool) {
      if (this._currentSource) this._currentSource.loop = bool;
      return this._loop = bool;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'volume', {
    get: function get() {
      return this._volume;
    },
    set: function set(num) {
      this._volume = num; // https://www.chromestatus.com/features/5287995770929152

      if (this._gainObj.gain.setTargetAtTime) {
        try {
          this._gainObj.gain.setTargetAtTime(num, this._context.currentTime, TIME_CONSTANT);
        } catch (e) {
          // Some other unknown browsers may crash if TIME_CONSTANT is 0
          this._gainObj.gain.setTargetAtTime(num, this._context.currentTime, 0.01);
        }
      } else {
        this._gainObj.gain.value = num;
      }

      if (sys.os === sys.OS_IOS && !this.paused && this._currentSource) {
        // IOS must be stop webAudio
        this._currentSource.onended = null;
        this.pause();
        this.play();
      }
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'currentTime', {
    get: function get() {
      if (this.paused) {
        return this.playedLength;
      } // Record the time the current has been played


      this.playedLength = this._context.currentTime - this._startTime; // If more than the duration of the audio, Need to take the remainder

      this.playedLength %= this._buffer.duration;
      return this.playedLength;
    },
    set: function set(num) {
      if (!this.paused) {
        this.pause();
        this.playedLength = num;
        this.play();
      } else {
        this.playedLength = num;
      }

      return num;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'duration', {
    get: function get() {
      return this._buffer.duration;
    },
    enumerable: true,
    configurable: true
  });
})(WebAudioElement.prototype);

module.exports = cc.Audio = Audio;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQXVkaW8uanMiXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJyZXF1aXJlIiwic3lzIiwiTG9hZE1vZGUiLCJ0b3VjaEJpbmRlZCIsInRvdWNoUGxheUxpc3QiLCJBdWRpbyIsInNyYyIsImNhbGwiLCJfc3JjIiwiX2VsZW1lbnQiLCJpZCIsIl92b2x1bWUiLCJfbG9vcCIsIl9uZXh0VGltZSIsIl9zdGF0ZSIsIlN0YXRlIiwiSU5JVElBTFpJTkciLCJfb25lbmRlZCIsIlNUT1BQRUQiLCJlbWl0IiwiYmluZCIsImNjIiwianMiLCJleHRlbmQiLCJFUlJPUiIsIlBMQVlJTkciLCJQQVVTRUQiLCJwcm90byIsIl9iaW5kRW5kZWQiLCJjYWxsYmFjayIsImVsZW0iLCJIVE1MQXVkaW9FbGVtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uZW5kZWQiLCJfdW5iaW5kRW5kZWQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX29uTG9hZGVkIiwiX2NyZWF0ZUVsZW1lbnQiLCJzZXRWb2x1bWUiLCJzZXRMb29wIiwic2V0Q3VycmVudFRpbWUiLCJnZXRTdGF0ZSIsInBsYXkiLCJfbmF0aXZlQXNzZXQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJXZWJBdWRpb0VsZW1lbnQiLCJfdG91Y2hUb1BsYXkiLCJsb2FkTW9kZSIsIkRPTV9BVURJTyIsInBhdXNlZCIsInB1c2giLCJpbnN0YW5jZSIsIm9mZnNldCIsImF1ZGlvIiwidG91Y2hFdmVudE5hbWUiLCJ3aW5kb3ciLCJnYW1lIiwiY2FudmFzIiwiaXRlbSIsInBvcCIsImRlc3Ryb3kiLCJwYXVzZSIsInJlc3VtZSIsInN0b3AiLCJjdXJyZW50VGltZSIsImVycm9yIiwiaSIsImxlbmd0aCIsInNwbGljZSIsImxvb3AiLCJnZXRMb29wIiwibnVtIiwidm9sdW1lIiwiZ2V0Vm9sdW1lIiwiZXJyIiwiZnVuYyIsImdldEN1cnJlbnRUaW1lIiwiZ2V0RHVyYXRpb24iLCJkdXJhdGlvbiIsIl9mb3JjZVVwZGF0aW5nU3RhdGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsInNldCIsImNsaXAiLCJsb2FkZWQiLCJzZWxmIiwib25jZSIsImxvYWRlciIsImxvYWQiLCJ1cmwiLCJuYXRpdmVVcmwiLCJza2lwcyIsImF1ZGlvTmF0aXZlQXNzZXQiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwicHJvdG90eXBlIiwiVElNRV9DT05TVEFOVCIsImJyb3dzZXJUeXBlIiwiQlJPV1NFUl9UWVBFX0VER0UiLCJCUk9XU0VSX1RZUEVfQkFJRFUiLCJCUk9XU0VSX1RZUEVfVUMiLCJidWZmZXIiLCJfYXVkaW8iLCJfY29udGV4dCIsIl9fYXVkaW9TdXBwb3J0IiwiY29udGV4dCIsIl9idWZmZXIiLCJfZ2Fpbk9iaiIsIl9zdGFydFRpbWUiLCJfY3VycmVudFNvdXJjZSIsInBsYXllZExlbmd0aCIsIl9jdXJyZW50VGltZXIiLCJfZW5kQ2FsbGJhY2siLCJzdGFydFRpbWUiLCJlbmRUaW1lIiwic3RhcnQiLCJzdGF0ZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJCUk9XU0VSX1RZUEVfU0FGQVJJIiwiaXNNb2JpbGUiLCJib29sIiwiZ2FpbiIsInNldFRhcmdldEF0VGltZSIsImUiLCJ2YWx1ZSIsIm9zIiwiT1NfSU9TIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxJQUFNQSxXQUFXLEdBQUdDLE9BQU8sQ0FBQyw0QkFBRCxDQUEzQjs7QUFDQSxJQUFNQyxHQUFHLEdBQUdELE9BQU8sQ0FBQyx3QkFBRCxDQUFuQjs7QUFDQSxJQUFNRSxRQUFRLEdBQUdGLE9BQU8sQ0FBQyw0QkFBRCxDQUFQLENBQXNDRSxRQUF2RDs7QUFFQSxJQUFJQyxXQUFXLEdBQUcsS0FBbEI7QUFDQSxJQUFJQyxhQUFhLEdBQUcsQ0FDaEI7QUFEZ0IsQ0FBcEI7O0FBSUEsSUFBSUMsS0FBSyxHQUFHLFNBQVJBLEtBQVEs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QUEsR0FBRyxFQUFFLGVBQVk7QUFDYixVQUFJLEtBQUtqQyxNQUFULEVBQWlCO0FBQ2IsZUFBTyxLQUFLOEQsWUFBWjtBQUNILE9BSFksQ0FJYjs7O0FBQ0EsV0FBS0EsWUFBTCxHQUFvQixLQUFLUCxRQUFMLENBQWN4QyxXQUFkLEdBQTRCLEtBQUs2QyxVQUFyRCxDQUxhLENBTWI7O0FBQ0EsV0FBS0UsWUFBTCxJQUFxQixLQUFLSixPQUFMLENBQWE3QixRQUFsQztBQUNBLGFBQU8sS0FBS2lDLFlBQVo7QUFDSCxLQVZ1QztBQVd4QzVCLElBQUFBLEdBQUcsRUFBRSxhQUFVWixHQUFWLEVBQWU7QUFDaEIsVUFBSSxDQUFDLEtBQUt0QixNQUFWLEVBQWtCO0FBQ2QsYUFBS1ksS0FBTDtBQUNBLGFBQUtrRCxZQUFMLEdBQW9CeEMsR0FBcEI7QUFDQSxhQUFLOUIsSUFBTDtBQUNILE9BSkQsTUFJTztBQUNILGFBQUtzRSxZQUFMLEdBQW9CeEMsR0FBcEI7QUFDSDs7QUFDRCxhQUFPQSxHQUFQO0FBQ0gsS0FwQnVDO0FBcUJ4Q3VCLElBQUFBLFVBQVUsRUFBRSxJQXJCNEI7QUFzQnhDQyxJQUFBQSxZQUFZLEVBQUU7QUF0QjBCLEdBQTVDO0FBeUJBZixFQUFBQSxNQUFNLENBQUNDLGNBQVAsQ0FBc0J2RCxLQUF0QixFQUE2QixVQUE3QixFQUF5QztBQUNyQ3dELElBQUFBLEdBQUcsRUFBRSxlQUFZO0FBQ2IsYUFBTyxLQUFLeUIsT0FBTCxDQUFhN0IsUUFBcEI7QUFDSCxLQUhvQztBQUlyQ2dCLElBQUFBLFVBQVUsRUFBRSxJQUp5QjtBQUtyQ0MsSUFBQUEsWUFBWSxFQUFFO0FBTHVCLEdBQXpDO0FBUUgsQ0FoTEQsRUFnTEdsRCxlQUFlLENBQUNtRCxTQWhMbkI7O0FBa0xBaUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCOUcsRUFBRSxDQUFDaEIsS0FBSCxHQUFXQSxLQUE1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHA6Ly93d3cuY29jb3MyZC14Lm9yZ1xuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuY29uc3QgRXZlbnRUYXJnZXQgPSByZXF1aXJlKCcuLi9jb3JlL2V2ZW50L2V2ZW50LXRhcmdldCcpO1xuY29uc3Qgc3lzID0gcmVxdWlyZSgnLi4vY29yZS9wbGF0Zm9ybS9DQ1N5cycpO1xuY29uc3QgTG9hZE1vZGUgPSByZXF1aXJlKCcuLi9jb3JlL2Fzc2V0cy9DQ0F1ZGlvQ2xpcCcpLkxvYWRNb2RlO1xuXG5sZXQgdG91Y2hCaW5kZWQgPSBmYWxzZTtcbmxldCB0b3VjaFBsYXlMaXN0ID0gW1xuICAgIC8veyBpbnN0YW5jZTogQXVkaW8sIG9mZnNldDogMCwgYXVkaW86IGF1ZGlvIH1cbl07XG5cbmxldCBBdWRpbyA9IGZ1bmN0aW9uIChzcmMpIHtcbiAgICBFdmVudFRhcmdldC5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5fc3JjID0gc3JjO1xuICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xuICAgIHRoaXMuaWQgPSAwO1xuXG4gICAgdGhpcy5fdm9sdW1lID0gMTtcbiAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgdGhpcy5fbmV4dFRpbWUgPSAwOyAgLy8gcGxheWJhY2sgcG9zaXRpb24gdG8gc2V0XG5cbiAgICB0aGlzLl9zdGF0ZSA9IEF1ZGlvLlN0YXRlLklOSVRJQUxaSU5HO1xuXG4gICAgdGhpcy5fb25lbmRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBBdWRpby5TdGF0ZS5TVE9QUEVEO1xuICAgICAgICB0aGlzLmVtaXQoJ2VuZGVkJyk7XG4gICAgfS5iaW5kKHRoaXMpO1xufTtcblxuY2MuanMuZXh0ZW5kKEF1ZGlvLCBFdmVudFRhcmdldCk7XG5cbi8qKlxuICogISNlbiBBdWRpbyBzdGF0ZS5cbiAqICEjemgg5aOw6Z+z5pKt5pS+54q25oCBXG4gKiBAZW51bSBhdWRpb0VuZ2luZS5BdWRpb1N0YXRlXG4gKiBAbWVtYmVyb2YgY2NcbiAqL1xuLy8gVE9ETyAtIEF0IHByZXNlbnQsIHRoZSBzdGF0ZSBpcyBtaXhlZCB3aXRoIHR3byBzdGF0ZXMgb2YgdXNlcnMgYW5kIHN5c3RlbXMsIGFuZCBpdCBpcyBiZXN0IHRvIHNwbGl0IGludG8gdHdvIHR5cGVzLiBBIFwibG9hZGluZ1wiIHNob3VsZCBhbHNvIGJlIGFkZGVkIHRvIHRoZSBzeXN0ZW0gc3RhdGUuXG5BdWRpby5TdGF0ZSA9IHtcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gRVJST1JcbiAgICAgKi9cbiAgICBFUlJPUiA6IC0xLFxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBJTklUSUFMWklOR1xuICAgICAqL1xuICAgIElOSVRJQUxaSU5HOiAwLFxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBQTEFZSU5HXG4gICAgICovXG4gICAgUExBWUlORzogMSxcbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gUEFVU0VEXG4gICAgICovXG4gICAgUEFVU0VEOiAyLFxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBTVE9QUEVEXG4gICAgICovXG4gICAgU1RPUFBFRDogMyxcbn07XG5cbihmdW5jdGlvbiAocHJvdG8pIHtcblxuICAgIHByb3RvLl9iaW5kRW5kZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayB8fCB0aGlzLl9vbmVuZGVkO1xuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuX2VsZW1lbnQ7XG4gICAgICAgIGlmICh0aGlzLl9zcmMgJiYgKGVsZW0gaW5zdGFuY2VvZiBIVE1MQXVkaW9FbGVtZW50KSkge1xuICAgICAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW0ub25lbmRlZCA9IGNhbGxiYWNrO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHByb3RvLl91bmJpbmRFbmRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IGVsZW0gPSB0aGlzLl9lbGVtZW50O1xuICAgICAgICBpZiAoZWxlbSBpbnN0YW5jZW9mIEhUTUxBdWRpb0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcignZW5kZWQnLCB0aGlzLl9vbmVuZGVkKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtKSB7XG4gICAgICAgICAgICBlbGVtLm9uZW5kZWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIHByb3RvLm1vdW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAvLyAgICAgaWYgKENDX0RFQlVHKSB7XG4gICAgLy8gICAgICAgICBjYy53YXJuKCdBdWRpby5tb3VudCh2YWx1ZSkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBBdWRpby5fb25Mb2FkZWQoKS4nKTtcbiAgICAvLyAgICAgfVxuICAgIC8vIH07XG5cbiAgICBwcm90by5fb25Mb2FkZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2NyZWF0ZUVsZW1lbnQoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0Vm9sdW1lKHRoaXMuX3ZvbHVtZSk7XG4gICAgICAgIHRoaXMuc2V0TG9vcCh0aGlzLl9sb29wKTtcbiAgICAgICAgaWYgKHRoaXMuX25leHRUaW1lICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldEN1cnJlbnRUaW1lKHRoaXMuX25leHRUaW1lKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5nZXRTdGF0ZSgpID09PSBBdWRpby5TdGF0ZS5QTEFZSU5HKSB7XG4gICAgICAgICAgICB0aGlzLnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gQXVkaW8uU3RhdGUuSU5JVElBTFpJTkc7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHJvdG8uX2NyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBlbGVtID0gdGhpcy5fc3JjLl9uYXRpdmVBc3NldDtcbiAgICAgICAgaWYgKGVsZW0gaW5zdGFuY2VvZiBIVE1MQXVkaW9FbGVtZW50KSB7XG4gICAgICAgICAgICAvLyBSZXVzZSBkb20gYXVkaW8gZWxlbWVudFxuICAgICAgICAgICAgaWYgKCF0aGlzLl9lbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnNyYyA9IGVsZW0uc3JjO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZWxlbWVudCA9IG5ldyBXZWJBdWRpb0VsZW1lbnQoZWxlbSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHJvdG8ucGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gbWFya2VkIGFzIHBsYXlpbmcgc28gaXQgd2lsbCBwbGF5T25Mb2FkXG4gICAgICAgIHRoaXMuX3N0YXRlID0gQXVkaW8uU3RhdGUuUExBWUlORztcblxuICAgICAgICBpZiAoIXRoaXMuX2VsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2JpbmRFbmRlZCgpO1xuICAgICAgICB0aGlzLl9lbGVtZW50LnBsYXkoKTtcblxuICAgICAgICB0aGlzLl90b3VjaFRvUGxheSgpO1xuICAgIH07XG5cbiAgICBwcm90by5fdG91Y2hUb1BsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9zcmMgJiYgdGhpcy5fc3JjLmxvYWRNb2RlID09PSBMb2FkTW9kZS5ET01fQVVESU8gJiZcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQucGF1c2VkKSB7XG4gICAgICAgICAgICB0b3VjaFBsYXlMaXN0LnB1c2goeyBpbnN0YW5jZTogdGhpcywgb2Zmc2V0OiAwLCBhdWRpbzogdGhpcy5fZWxlbWVudCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b3VjaEJpbmRlZCkgcmV0dXJuO1xuICAgICAgICB0b3VjaEJpbmRlZCA9IHRydWU7XG5cbiAgICAgICAgbGV0IHRvdWNoRXZlbnROYW1lID0gKCdvbnRvdWNoZW5kJyBpbiB3aW5kb3cpID8gJ3RvdWNoZW5kJyA6ICdtb3VzZWRvd24nO1xuICAgICAgICAvLyBMaXN0ZW4gdG8gdGhlIHRvdWNoc3RhcnQgYm9keSBldmVudCBhbmQgcGxheSB0aGUgYXVkaW8gd2hlbiBuZWNlc3NhcnkuXG4gICAgICAgIGNjLmdhbWUuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIodG91Y2hFdmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBpdGVtO1xuICAgICAgICAgICAgd2hpbGUgKGl0ZW0gPSB0b3VjaFBsYXlMaXN0LnBvcCgpKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5hdWRpby5wbGF5KGl0ZW0ub2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHByb3RvLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xuICAgIH07XG5cbiAgICBwcm90by5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9lbGVtZW50IHx8IHRoaXMuZ2V0U3RhdGUoKSAhPT0gQXVkaW8uU3RhdGUuUExBWUlORykgcmV0dXJuO1xuICAgICAgICB0aGlzLl91bmJpbmRFbmRlZCgpO1xuICAgICAgICB0aGlzLl9lbGVtZW50LnBhdXNlKCk7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gQXVkaW8uU3RhdGUuUEFVU0VEO1xuICAgIH07XG5cbiAgICBwcm90by5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZWxlbWVudCB8fCB0aGlzLmdldFN0YXRlKCkgIT09IEF1ZGlvLlN0YXRlLlBBVVNFRCkgcmV0dXJuO1xuICAgICAgICB0aGlzLl9iaW5kRW5kZWQoKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5wbGF5KCk7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gQXVkaW8uU3RhdGUuUExBWUlORztcbiAgICB9O1xuXG4gICAgcHJvdG8uc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9lbGVtZW50KSByZXR1cm47XG4gICAgICAgIHRoaXMuX2VsZW1lbnQucGF1c2UoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuY3VycmVudFRpbWUgPSAwO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge31cbiAgICAgICAgLy8gcmVtb3ZlIHRvdWNoUGxheUxpc3RcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaFBsYXlMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodG91Y2hQbGF5TGlzdFtpXS5pbnN0YW5jZSA9PT0gdGhpcykge1xuICAgICAgICAgICAgICAgIHRvdWNoUGxheUxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VuYmluZEVuZGVkKCk7XG4gICAgICAgIHRoaXMuZW1pdCgnc3RvcCcpO1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IEF1ZGlvLlN0YXRlLlNUT1BQRUQ7XG4gICAgfTtcblxuICAgIHByb3RvLnNldExvb3AgPSBmdW5jdGlvbiAobG9vcCkge1xuICAgICAgICB0aGlzLl9sb29wID0gbG9vcDtcbiAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQubG9vcCA9IGxvb3A7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHByb3RvLmdldExvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb29wO1xuICAgIH07XG5cbiAgICBwcm90by5zZXRWb2x1bWUgPSBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgIHRoaXMuX3ZvbHVtZSA9IG51bTtcbiAgICAgICAgaWYgKHRoaXMuX2VsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQudm9sdW1lID0gbnVtO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBwcm90by5nZXRWb2x1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92b2x1bWU7XG4gICAgfTtcblxuICAgIHByb3RvLnNldEN1cnJlbnRUaW1lID0gZnVuY3Rpb24gKG51bSkge1xuICAgICAgICBpZiAodGhpcy5fZWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5fbmV4dFRpbWUgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fbmV4dFRpbWUgPSBudW07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZXRDdXJyZW50VGltZSB3b3VsZCBmaXJlICdlbmRlZCcgZXZlbnRcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byBjaGFuZ2UgdGhlIGNhbGxiYWNrIHRvIHJlYmluZCBlbmRlZCBjYWxsYmFjayBhZnRlciBzZXRDdXJyZW50VGltZVxuICAgICAgICB0aGlzLl91bmJpbmRFbmRlZCgpO1xuICAgICAgICB0aGlzLl9iaW5kRW5kZWQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5fYmluZEVuZGVkKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQuY3VycmVudFRpbWUgPSBudW07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgbGV0IF9lbGVtZW50ID0gdGhpcy5fZWxlbWVudDtcbiAgICAgICAgICAgIGlmIChfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGZ1bmMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF9lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgZnVuYyk7XG4gICAgICAgICAgICAgICAgICAgIF9lbGVtZW50LmN1cnJlbnRUaW1lID0gbnVtO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkbWV0YWRhdGEnLCBmdW5jKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcm90by5nZXRDdXJyZW50VGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQgPyB0aGlzLl9lbGVtZW50LmN1cnJlbnRUaW1lIDogMDtcbiAgICB9O1xuXG4gICAgcHJvdG8uZ2V0RHVyYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50ID8gdGhpcy5fZWxlbWVudC5kdXJhdGlvbiA6IDA7XG4gICAgfTtcblxuICAgIHByb3RvLmdldFN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBIQUNLOiBpbiBzb21lIGJyb3dzZXIsIGF1ZGlvIG1heSBub3QgZmlyZSAnZW5kZWQnIGV2ZW50XG4gICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gZm9yY2UgdXBkYXRpbmcgdGhlIEF1ZGlvIHN0YXRlXG4gICAgICAgIHRoaXMuX2ZvcmNlVXBkYXRpbmdTdGF0ZSgpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgIH07XG5cbiAgICBwcm90by5fZm9yY2VVcGRhdGluZ1N0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgZWxlbSA9IHRoaXMuX2VsZW1lbnQ7XG4gICAgICAgIGlmIChlbGVtKSB7XG4gICAgICAgICAgICBpZiAoQXVkaW8uU3RhdGUuUExBWUlORyA9PT0gdGhpcy5fc3RhdGUgJiYgZWxlbS5wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IEF1ZGlvLlN0YXRlLlNUT1BQRUQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChBdWRpby5TdGF0ZS5TVE9QUEVEID09PSB0aGlzLl9zdGF0ZSAmJiAhZWxlbS5wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IEF1ZGlvLlN0YXRlLlBMQVlJTkc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCAnc3JjJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zcmM7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGNsaXApIHtcbiAgICAgICAgICAgIHRoaXMuX3VuYmluZEVuZGVkKCk7XG4gICAgICAgICAgICBpZiAoY2xpcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NyYyA9IGNsaXA7XG4gICAgICAgICAgICAgICAgaWYgKGNsaXAubG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uTG9hZGVkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIGNsaXAub25jZSgnbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbGlwID09PSBzZWxmLl9zcmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9vbkxvYWRlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY2MubG9hZGVyLmxvYWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY2xpcC5uYXRpdmVVcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGF1ZGlvLCB3ZSBzaG91bGQgc2tpcCBsb2FkZXIgb3RoZXJ3aXNlIGl0IHdpbGwgbG9hZCBhIG5ldyBhdWRpb0NsaXAuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2tpcHM6IFsnTG9hZGVyJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVyciwgYXVkaW9OYXRpdmVBc3NldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNsaXAubG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXAuX25hdGl2ZUFzc2V0ID0gYXVkaW9OYXRpdmVBc3NldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zcmMgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9lbGVtZW50IGluc3RhbmNlb2YgV2ViQXVkaW9FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudC5zcmMgPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSBBdWRpby5TdGF0ZS5JTklUSUFMWklORztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjbGlwO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgJ3BhdXNlZCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudCA/IHRoaXMuX2VsZW1lbnQucGF1c2VkIDogdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICAvLyBzZXRGaW5pc2hDYWxsYmFja1xuXG59KShBdWRpby5wcm90b3R5cGUpO1xuXG5cbi8vIFRJTUVfQ09OU1RBTlQgaXMgdXNlZCBhcyBhbiBhcmd1bWVudCBvZiBzZXRUYXJnZXRBdFRpbWUgaW50ZXJmYWNlXG4vLyBUSU1FX0NPTlNUQU5UIG5lZWQgdG8gYmUgYSBwb3NpdGl2ZSBudW1iZXIgb24gRWRnZSBhbmQgQmFpZHUgYnJvd3NlclxuLy8gVElNRV9DT05TVEFOVCBuZWVkIHRvIGJlIDAgYnkgZGVmYXVsdCwgb3IgbWF5IGZhaWwgdG8gc2V0IHZvbHVtZSBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgcGxheWluZyBhdWRpb1xubGV0IFRJTUVfQ09OU1RBTlQ7XG5pZiAoY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX0VER0UgfHwgXG4gICAgY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX0JBSURVIHx8XG4gICAgY2Muc3lzLmJyb3dzZXJUeXBlID09PSBjYy5zeXMuQlJPV1NFUl9UWVBFX1VDKSB7XG4gICAgVElNRV9DT05TVEFOVCA9IDAuMDE7XG59XG5lbHNlIHtcbiAgICBUSU1FX0NPTlNUQU5UID0gMDtcbn1cblxuLy8gRW5jYXBzdWxhdGVkIFdlYkF1ZGlvIGludGVyZmFjZVxubGV0IFdlYkF1ZGlvRWxlbWVudCA9IGZ1bmN0aW9uIChidWZmZXIsIGF1ZGlvKSB7XG4gICAgdGhpcy5fYXVkaW8gPSBhdWRpbztcbiAgICB0aGlzLl9jb250ZXh0ID0gc3lzLl9fYXVkaW9TdXBwb3J0LmNvbnRleHQ7XG4gICAgdGhpcy5fYnVmZmVyID0gYnVmZmVyO1xuXG4gICAgdGhpcy5fZ2Fpbk9iaiA9IHRoaXMuX2NvbnRleHRbJ2NyZWF0ZUdhaW4nXSgpO1xuICAgIHRoaXMudm9sdW1lID0gMTtcblxuICAgIHRoaXMuX2dhaW5PYmpbJ2Nvbm5lY3QnXSh0aGlzLl9jb250ZXh0WydkZXN0aW5hdGlvbiddKTtcbiAgICB0aGlzLl9sb29wID0gZmFsc2U7XG4gICAgLy8gVGhlIHRpbWUgc3RhbXAgb24gdGhlIGF1ZGlvIHRpbWUgYXhpcyB3aGVuIHRoZSByZWNvcmRpbmcgYmVnaW5zIHRvIHBsYXkuXG4gICAgdGhpcy5fc3RhcnRUaW1lID0gLTE7XG4gICAgLy8gUmVjb3JkIHRoZSBjdXJyZW50bHkgcGxheWluZyAnU291cmNlJ1xuICAgIHRoaXMuX2N1cnJlbnRTb3VyY2UgPSBudWxsO1xuICAgIC8vIFJlY29yZCB0aGUgdGltZSBoYXMgYmVlbiBwbGF5ZWRcbiAgICB0aGlzLnBsYXllZExlbmd0aCA9IDA7XG5cbiAgICB0aGlzLl9jdXJyZW50VGltZXIgPSBudWxsO1xuXG4gICAgdGhpcy5fZW5kQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9uZW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMub25lbmRlZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKTtcbn07XG5cbihmdW5jdGlvbiAocHJvdG8pIHtcbiAgICBwcm90by5wbGF5ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICAgICAgICAvLyBJZiByZXBlYXQgcGxheSwgeW91IG5lZWQgdG8gc3RvcCBiZWZvcmUgYW4gYXVkaW9cbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRTb3VyY2UgJiYgIXRoaXMucGF1c2VkKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50U291cmNlLm9uZW5kZWQgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNvdXJjZS5zdG9wKDApO1xuICAgICAgICAgICAgdGhpcy5wbGF5ZWRMZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGF1ZGlvID0gdGhpcy5fY29udGV4dFtcImNyZWF0ZUJ1ZmZlclNvdXJjZVwiXSgpO1xuICAgICAgICBhdWRpby5idWZmZXIgPSB0aGlzLl9idWZmZXI7XG4gICAgICAgIGF1ZGlvW1wiY29ubmVjdFwiXSh0aGlzLl9nYWluT2JqKTtcbiAgICAgICAgYXVkaW8ubG9vcCA9IHRoaXMuX2xvb3A7XG5cbiAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gdGhpcy5fY29udGV4dC5jdXJyZW50VGltZTtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IHRoaXMucGxheWVkTGVuZ3RoO1xuICAgICAgICBpZiAob2Zmc2V0KSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFRpbWUgLT0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGxldCBkdXJhdGlvbiA9IHRoaXMuX2J1ZmZlci5kdXJhdGlvbjtcblxuICAgICAgICBsZXQgc3RhcnRUaW1lID0gb2Zmc2V0O1xuICAgICAgICBsZXQgZW5kVGltZTtcbiAgICAgICAgaWYgKHRoaXMuX2xvb3ApIHtcbiAgICAgICAgICAgIGlmIChhdWRpby5zdGFydClcbiAgICAgICAgICAgICAgICBhdWRpby5zdGFydCgwLCBzdGFydFRpbWUpO1xuICAgICAgICAgICAgZWxzZSBpZiAoYXVkaW9bXCJub3RvR3JhaW5PblwiXSlcbiAgICAgICAgICAgICAgICBhdWRpb1tcIm5vdGVHcmFpbk9uXCJdKDAsIHN0YXJ0VGltZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXVkaW9bXCJub3RlT25cIl0oMCwgc3RhcnRUaW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVuZFRpbWUgPSBkdXJhdGlvbiAtIG9mZnNldDtcbiAgICAgICAgICAgIGlmIChhdWRpby5zdGFydClcbiAgICAgICAgICAgICAgICBhdWRpby5zdGFydCgwLCBzdGFydFRpbWUsIGVuZFRpbWUpO1xuICAgICAgICAgICAgZWxzZSBpZiAoYXVkaW9bXCJub3RlR3JhaW5PblwiXSlcbiAgICAgICAgICAgICAgICBhdWRpb1tcIm5vdGVHcmFpbk9uXCJdKDAsIHN0YXJ0VGltZSwgZW5kVGltZSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgYXVkaW9bXCJub3RlT25cIl0oMCwgc3RhcnRUaW1lLCBlbmRUaW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTb3VyY2UgPSBhdWRpbztcblxuICAgICAgICBhdWRpby5vbmVuZGVkID0gdGhpcy5fZW5kQ2FsbGJhY2s7XG5cbiAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgYXVkaW8gY29udGV4dCB0aW1lIHN0YW1wIGlzIDAgYW5kIGF1ZGlvIGNvbnRleHQgc3RhdGUgaXMgc3VzcGVuZGVkXG4gICAgICAgIC8vIFRoZXJlIG1heSBiZSBhIG5lZWQgdG8gdG91Y2ggZXZlbnRzIGJlZm9yZSB5b3UgY2FuIGFjdHVhbGx5IHN0YXJ0IHBsYXlpbmcgYXVkaW9cbiAgICAgICAgaWYgKCghYXVkaW8uY29udGV4dC5zdGF0ZSB8fCBhdWRpby5jb250ZXh0LnN0YXRlID09PSBcInN1c3BlbmRlZFwiKSAmJiB0aGlzLl9jb250ZXh0LmN1cnJlbnRUaW1lID09PSAwKSB7XG4gICAgICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fY3VycmVudFRpbWVyKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLl9jb250ZXh0LmN1cnJlbnRUaW1lID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvdWNoUGxheUxpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZTogc2VsZi5fYXVkaW8sXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IG9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1ZGlvOiBzZWxmXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBIQUNLOiBmaXggbW9iaWxlIHNhZmFyaSBjYW4ndCBwbGF5XG4gICAgICAgIGlmIChjYy5zeXMuYnJvd3NlclR5cGUgPT09IGNjLnN5cy5CUk9XU0VSX1RZUEVfU0FGQVJJICYmIGNjLnN5cy5pc01vYmlsZSkge1xuICAgICAgICAgICAgaWYgKGF1ZGlvLmNvbnRleHQuc3RhdGUgPT09ICdpbnRlcnJ1cHRlZCcpIHtcbiAgICAgICAgICAgICAgICBhdWRpby5jb250ZXh0LnJlc3VtZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIHByb3RvLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fY3VycmVudFRpbWVyKTtcbiAgICAgICAgaWYgKHRoaXMucGF1c2VkKSByZXR1cm47XG4gICAgICAgIC8vIFJlY29yZCB0aGUgdGltZSB0aGUgY3VycmVudCBoYXMgYmVlbiBwbGF5ZWRcbiAgICAgICAgdGhpcy5wbGF5ZWRMZW5ndGggPSB0aGlzLl9jb250ZXh0LmN1cnJlbnRUaW1lIC0gdGhpcy5fc3RhcnRUaW1lO1xuICAgICAgICAvLyBJZiBtb3JlIHRoYW4gdGhlIGR1cmF0aW9uIG9mIHRoZSBhdWRpbywgTmVlZCB0byB0YWtlIHRoZSByZW1haW5kZXJcbiAgICAgICAgdGhpcy5wbGF5ZWRMZW5ndGggJT0gdGhpcy5fYnVmZmVyLmR1cmF0aW9uO1xuICAgICAgICBsZXQgYXVkaW8gPSB0aGlzLl9jdXJyZW50U291cmNlO1xuICAgICAgICB0aGlzLl9jdXJyZW50U291cmNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gLTE7XG4gICAgICAgIGlmIChhdWRpbylcbiAgICAgICAgICAgIGF1ZGlvLnN0b3AoMCk7XG4gICAgfTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgJ3BhdXNlZCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgY3VycmVudCBhdWRpbyBpcyBhIGxvb3AsIHBhdXNlZCBpcyBmYWxzZVxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRTb3VyY2UgJiYgdGhpcy5fY3VycmVudFNvdXJjZS5sb29wKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgLy8gc3RhcnRUaW1lIGRlZmF1bHQgaXMgLTFcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdGFydFRpbWUgPT09IC0xKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgICAgICAvLyBDdXJyZW50IHRpbWUgLSAgU3RhcnQgcGxheWluZyB0aW1lID4gQXVkaW8gZHVyYXRpb25cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0LmN1cnJlbnRUaW1lIC0gdGhpcy5fc3RhcnRUaW1lID4gdGhpcy5fYnVmZmVyLmR1cmF0aW9uO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgJ2xvb3AnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvb3A7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGJvb2wpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9jdXJyZW50U291cmNlKVxuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VyY2UubG9vcCA9IGJvb2w7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb29wID0gYm9vbDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sICd2b2x1bWUnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZvbHVtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgICAgICB0aGlzLl92b2x1bWUgPSBudW07XG4gICAgICAgICAgICAvLyBodHRwczovL3d3dy5jaHJvbWVzdGF0dXMuY29tL2ZlYXR1cmVzLzUyODc5OTU3NzA5MjkxNTJcbiAgICAgICAgICAgIGlmICh0aGlzLl9nYWluT2JqLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZ2Fpbk9iai5nYWluLnNldFRhcmdldEF0VGltZShudW0sIHRoaXMuX2NvbnRleHQuY3VycmVudFRpbWUsIFRJTUVfQ09OU1RBTlQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTb21lIG90aGVyIHVua25vd24gYnJvd3NlcnMgbWF5IGNyYXNoIGlmIFRJTUVfQ09OU1RBTlQgaXMgMFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9nYWluT2JqLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKG51bSwgdGhpcy5fY29udGV4dC5jdXJyZW50VGltZSwgMC4wMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZ2Fpbk9iai5nYWluLnZhbHVlID0gbnVtO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc3lzLm9zID09PSBzeXMuT1NfSU9TICYmICF0aGlzLnBhdXNlZCAmJiB0aGlzLl9jdXJyZW50U291cmNlKSB7XG4gICAgICAgICAgICAgICAgLy8gSU9TIG11c3QgYmUgc3RvcCB3ZWJBdWRpb1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTb3VyY2Uub25lbmRlZCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgJ2N1cnJlbnRUaW1lJywge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhdXNlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllZExlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFJlY29yZCB0aGUgdGltZSB0aGUgY3VycmVudCBoYXMgYmVlbiBwbGF5ZWRcbiAgICAgICAgICAgIHRoaXMucGxheWVkTGVuZ3RoID0gdGhpcy5fY29udGV4dC5jdXJyZW50VGltZSAtIHRoaXMuX3N0YXJ0VGltZTtcbiAgICAgICAgICAgIC8vIElmIG1vcmUgdGhhbiB0aGUgZHVyYXRpb24gb2YgdGhlIGF1ZGlvLCBOZWVkIHRvIHRha2UgdGhlIHJlbWFpbmRlclxuICAgICAgICAgICAgdGhpcy5wbGF5ZWRMZW5ndGggJT0gdGhpcy5fYnVmZmVyLmR1cmF0aW9uO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxheWVkTGVuZ3RoO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5wYXVzZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZWRMZW5ndGggPSBudW07XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVkTGVuZ3RoID0gbnVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sICdkdXJhdGlvbicsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVmZmVyLmR1cmF0aW9uO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcblxufSkoV2ViQXVkaW9FbGVtZW50LnByb3RvdHlwZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuQXVkaW8gPSBBdWRpbztcbiJdfQ==