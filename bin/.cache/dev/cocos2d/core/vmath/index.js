(function () {
    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
    var __module = nodeEnv ? module : { exports: {} };
    var __filename = 'engine-dev/cocos2d/core/vmath/index.js';
    var __require = nodeEnv ? function (request) {
        return require(request);
    } : function (request) {
        return __quick_compile__.require(request, __filename);
    };
    function __define(exports, require, module) {
        if (!nodeEnv) {
            __quick_compile__.registerModule(__filename, module);
        }
                'use strict';
        Object.defineProperty(exports, '__esModule', { value: true });
        exports.color4 = exports.color3 = exports.mat4 = exports.mat3 = exports.mat23 = exports.mat2 = exports.trs = exports.quat = exports.vec4 = exports.vec3 = exports.vec2 = undefined;
        var _utils = require('./utils');
        Object.keys(_utils).forEach(function (key) {
            if (key === 'default' || key === '__esModule')
                return;
            Object.defineProperty(exports, key, {
                enumerable: true,
                get: function get() {
                    return _utils[key];
                }
            });
        });
        var _vec = require('./vec2');
        var _vec2 = _interopRequireDefault(_vec);
        var _vec3 = require('./vec3');
        var _vec4 = _interopRequireDefault(_vec3);
        var _vec5 = require('./vec4');
        var _vec6 = _interopRequireDefault(_vec5);
        var _quat = require('./quat');
        var _quat2 = _interopRequireDefault(_quat);
        var _trs = require('./trs');
        var _trs2 = _interopRequireDefault(_trs);
        var _mat = require('./mat2');
        var _mat2 = _interopRequireDefault(_mat);
        var _mat3 = require('./mat23');
        var _mat4 = _interopRequireDefault(_mat3);
        var _mat5 = require('./mat3');
        var _mat6 = _interopRequireDefault(_mat5);
        var _mat7 = require('./mat4');
        var _mat8 = _interopRequireDefault(_mat7);
        var _color = require('./color3');
        var _color2 = _interopRequireDefault(_color);
        var _color3 = require('./color4');
        var _color4 = _interopRequireDefault(_color3);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
        }
        exports.vec2 = _vec2.default;
        exports.vec3 = _vec4.default;
        exports.vec4 = _vec6.default;
        exports.quat = _quat2.default;
        exports.trs = _trs2.default;
        exports.mat2 = _mat2.default;
        exports.mat23 = _mat4.default;
        exports.mat3 = _mat6.default;
        exports.mat4 = _mat8.default;
        exports.color3 = _color2.default;
        exports.color4 = _color4.default;
        exports.default = {
            vec2: _vec2.default,
            vec3: _vec4.default,
            vec4: _vec6.default,
            quat: _quat2.default,
            trs: _trs2.default,
            mat2: _mat2.default,
            mat23: _mat4.default,
            mat3: _mat6.default,
            mat4: _mat8.default,
            color3: _color2.default,
            color4: _color4.default
        };
    }
    if (nodeEnv) {
        __define(__module.exports, __require, __module);
    } else {
        __quick_compile__.registerModuleFunc(__filename, function () {
            __define(__module.exports, __require, __module);
        });
    }
}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiL1VzZXJzL2FkbWluL0NDRW5naW5lL2NvY29zMmQvY29yZS92bWF0aC9pbmRleC5qcyJdLCJuYW1lcyI6WyJ2ZWMyIiwidmVjMyIsInZlYzQiLCJxdWF0IiwidHJzIiwibWF0MiIsIm1hdDIzIiwibWF0MyIsIm1hdDQiLCJjb2xvcjMiLCJjb2xvcjQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQUFBLFNBQUEsUUFBQSxDQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBO0FBQUEsUUFBQSxJQUFBLENBQUEsT0FBQSxFQUFBO0FBQUEsWUFBQSxpQkFBQSxDQUFBLGNBQUEsQ0FBQSxVQUFBLEVBQUEsTUFBQSxFQUFBO0FBQUEsU0FBQTtBQUFBOzs7O1FBQUEsTUFBQSxDQUFBLElBQUEsQ0FBQSxNQUFBLEVBQUEsT0FBQSxDQUFBLFVBQUEsR0FBQSxFQUFBO0FBQUEsWUFBQSxJQUFBLEdBQUEsS0FBQSxTQUFBLElBQUEsR0FBQSxLQUFBLFlBQUE7QUFBQSxnQkFBQSxPQUFBO0FBQUEsWUFBQSxNQUFBLENBQUEsY0FBQSxDQUFBLE9BQUEsRUFBQSxHQUFBLEVBQUE7QUFBQSxnQkFBQSxVQUFBLEVBQUEsSUFBQTtBQUFBLGdCQUFBLEdBQUEsRUFBQSxTQUFBLEdBQUEsR0FBQTtBQUFBLG9CQUFBLE9BQUEsTUFBQSxDQUFBLEdBQUEsQ0FBQSxDQUFBO0FBQUEsaUJBQUE7QUFBQSxhQUFBLEVBQUE7QUFBQSxTQUFBO1FBRUEsSUFBQSxJQUFBLEdBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQTs7UUFDQSxJQUFBLEtBQUEsR0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBOztRQUNBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUE7O1FBQ0EsSUFBQSxLQUFBLEdBQUEsT0FBQSxDQUFBLFFBQUEsQ0FBQTs7UUFDQSxJQUFBLElBQUEsR0FBQSxPQUFBLENBQUEsT0FBQSxDQUFBOztRQUNBLElBQUEsSUFBQSxHQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUE7O1FBQ0EsSUFBQSxLQUFBLEdBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQTs7UUFDQSxJQUFBLEtBQUEsR0FBQSxPQUFBLENBQUEsUUFBQSxDQUFBOztRQUNBLElBQUEsS0FBQSxHQUFBLE9BQUEsQ0FBQSxRQUFBLENBQUE7O1FBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxDQUFBLFVBQUEsQ0FBQTs7UUFDQSxJQUFBLE9BQUEsR0FBQSxPQUFBLENBQUEsVUFBQSxDQUFBOzs7OztnQkFFU0EsT0FBQUEsS0FBQUEsQ0FBQUE7Z0JBQU1DLE9BQUFBLEtBQUFBLENBQUFBO2dCQUFNQyxPQUFBQSxLQUFBQSxDQUFBQTtnQkFBTUMsT0FBQUEsTUFBQUEsQ0FBQUE7Z0JBQU1DLE1BQUFBLEtBQUFBLENBQUFBO2dCQUFLQyxPQUFBQSxLQUFBQSxDQUFBQTtnQkFBTUMsUUFBQUEsS0FBQUEsQ0FBQUE7Z0JBQU9DLE9BQUFBLEtBQUFBLENBQUFBO2dCQUFNQyxPQUFBQSxLQUFBQSxDQUFBQTtnQkFBTUMsU0FBQUEsT0FBQUEsQ0FBQUE7Z0JBQVFDLFNBQUFBLE9BQUFBLENBQUFBOzBCQUN4RDtBQUFBLFlBQUVWLElBQUFBLEVBQUFBLEtBQUFBLENBQUFBLE9BQUY7QUFBQSxZQUFRQyxJQUFBQSxFQUFBQSxLQUFBQSxDQUFBQSxPQUFSO0FBQUEsWUFBY0MsSUFBQUEsRUFBQUEsS0FBQUEsQ0FBQUEsT0FBZDtBQUFBLFlBQW9CQyxJQUFBQSxFQUFBQSxNQUFBQSxDQUFBQSxPQUFwQjtBQUFBLFlBQTBCQyxHQUFBQSxFQUFBQSxLQUFBQSxDQUFBQSxPQUExQjtBQUFBLFlBQStCQyxJQUFBQSxFQUFBQSxLQUFBQSxDQUFBQSxPQUEvQjtBQUFBLFlBQXFDQyxLQUFBQSxFQUFBQSxLQUFBQSxDQUFBQSxPQUFyQztBQUFBLFlBQTRDQyxJQUFBQSxFQUFBQSxLQUFBQSxDQUFBQSxPQUE1QztBQUFBLFlBQWtEQyxJQUFBQSxFQUFBQSxLQUFBQSxDQUFBQSxPQUFsRDtBQUFBLFlBQXdEQyxNQUFBQSxFQUFBQSxPQUFBQSxDQUFBQSxPQUF4RDtBQUFBLFlBQWdFQyxNQUFBQSxFQUFBQSxPQUFBQSxDQUFBQSxPQUFoRTtBQUFBLFVBZmY7QUFBQTtJQUFBLElBQUEsT0FBQSxFQUFBO0FBQUEsUUFBQSxRQUFBLENBQUEsUUFBQSxDQUFBLE9BQUEsRUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBO0FBQUEsS0FBQSxNQUFBO0FBQUEsUUFBQSxpQkFBQSxDQUFBLGtCQUFBLENBQUEsVUFBQSxFQUFBLFlBQUE7QUFBQSw0REFBQTtBQUFBLFNBQUEsRUFBQTtBQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi91dGlscyc7XG5cbmltcG9ydCB2ZWMyIGZyb20gJy4vdmVjMic7XG5pbXBvcnQgdmVjMyBmcm9tICcuL3ZlYzMnO1xuaW1wb3J0IHZlYzQgZnJvbSAnLi92ZWM0JztcbmltcG9ydCBxdWF0IGZyb20gJy4vcXVhdCc7XG5pbXBvcnQgdHJzIGZyb20gJy4vdHJzJztcbmltcG9ydCBtYXQyIGZyb20gJy4vbWF0Mic7XG5pbXBvcnQgbWF0MjMgZnJvbSAnLi9tYXQyMyc7XG5pbXBvcnQgbWF0MyBmcm9tICcuL21hdDMnO1xuaW1wb3J0IG1hdDQgZnJvbSAnLi9tYXQ0JztcbmltcG9ydCBjb2xvcjMgZnJvbSAnLi9jb2xvcjMnO1xuaW1wb3J0IGNvbG9yNCBmcm9tICcuL2NvbG9yNCc7XG5cbmV4cG9ydCB7IHZlYzIsIHZlYzMsIHZlYzQsIHF1YXQsIHRycywgbWF0MiwgbWF0MjMsIG1hdDMsIG1hdDQsIGNvbG9yMywgY29sb3I0IH07XG5leHBvcnQgZGVmYXVsdCB7IHZlYzIsIHZlYzMsIHZlYzQsIHF1YXQsIHRycywgbWF0MiwgbWF0MjMsIG1hdDMsIG1hdDQsIGNvbG9yMywgY29sb3I0IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmNvbG9yNCA9IGV4cG9ydHMuY29sb3IzID0gZXhwb3J0cy5tYXQ0ID0gZXhwb3J0cy5tYXQzID0gZXhwb3J0cy5tYXQyMyA9IGV4cG9ydHMubWF0MiA9IGV4cG9ydHMudHJzID0gZXhwb3J0cy5xdWF0ID0gZXhwb3J0cy52ZWM0ID0gZXhwb3J0cy52ZWMzID0gZXhwb3J0cy52ZWMyID0gdW5kZWZpbmVkO1xuXG52YXIgX3V0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5PYmplY3Qua2V5cyhfdXRpbHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICBpZiAoa2V5ID09PSBcImRlZmF1bHRcIiB8fCBrZXkgPT09IFwiX19lc01vZHVsZVwiKSByZXR1cm47XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIF91dGlsc1trZXldO1xuICAgIH1cbiAgfSk7XG59KTtcblxudmFyIF92ZWMgPSByZXF1aXJlKCcuL3ZlYzInKTtcblxudmFyIF92ZWMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdmVjKTtcblxudmFyIF92ZWMzID0gcmVxdWlyZSgnLi92ZWMzJyk7XG5cbnZhciBfdmVjNCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ZlYzMpO1xuXG52YXIgX3ZlYzUgPSByZXF1aXJlKCcuL3ZlYzQnKTtcblxudmFyIF92ZWM2ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdmVjNSk7XG5cbnZhciBfcXVhdCA9IHJlcXVpcmUoJy4vcXVhdCcpO1xuXG52YXIgX3F1YXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcXVhdCk7XG5cbnZhciBfdHJzID0gcmVxdWlyZSgnLi90cnMnKTtcblxudmFyIF90cnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHJzKTtcblxudmFyIF9tYXQgPSByZXF1aXJlKCcuL21hdDInKTtcblxudmFyIF9tYXQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWF0KTtcblxudmFyIF9tYXQzID0gcmVxdWlyZSgnLi9tYXQyMycpO1xuXG52YXIgX21hdDQgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXQzKTtcblxudmFyIF9tYXQ1ID0gcmVxdWlyZSgnLi9tYXQzJyk7XG5cbnZhciBfbWF0NiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hdDUpO1xuXG52YXIgX21hdDcgPSByZXF1aXJlKCcuL21hdDQnKTtcblxudmFyIF9tYXQ4ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWF0Nyk7XG5cbnZhciBfY29sb3IgPSByZXF1aXJlKCcuL2NvbG9yMycpO1xuXG52YXIgX2NvbG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbG9yKTtcblxudmFyIF9jb2xvcjMgPSByZXF1aXJlKCcuL2NvbG9yNCcpO1xuXG52YXIgX2NvbG9yNCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NvbG9yMyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMudmVjMiA9IF92ZWMyLmRlZmF1bHQ7XG5leHBvcnRzLnZlYzMgPSBfdmVjNC5kZWZhdWx0O1xuZXhwb3J0cy52ZWM0ID0gX3ZlYzYuZGVmYXVsdDtcbmV4cG9ydHMucXVhdCA9IF9xdWF0Mi5kZWZhdWx0O1xuZXhwb3J0cy50cnMgPSBfdHJzMi5kZWZhdWx0O1xuZXhwb3J0cy5tYXQyID0gX21hdDIuZGVmYXVsdDtcbmV4cG9ydHMubWF0MjMgPSBfbWF0NC5kZWZhdWx0O1xuZXhwb3J0cy5tYXQzID0gX21hdDYuZGVmYXVsdDtcbmV4cG9ydHMubWF0NCA9IF9tYXQ4LmRlZmF1bHQ7XG5leHBvcnRzLmNvbG9yMyA9IF9jb2xvcjIuZGVmYXVsdDtcbmV4cG9ydHMuY29sb3I0ID0gX2NvbG9yNC5kZWZhdWx0O1xuZXhwb3J0cy5kZWZhdWx0ID0geyB2ZWMyOiBfdmVjMi5kZWZhdWx0LCB2ZWMzOiBfdmVjNC5kZWZhdWx0LCB2ZWM0OiBfdmVjNi5kZWZhdWx0LCBxdWF0OiBfcXVhdDIuZGVmYXVsdCwgdHJzOiBfdHJzMi5kZWZhdWx0LCBtYXQyOiBfbWF0Mi5kZWZhdWx0LCBtYXQyMzogX21hdDQuZGVmYXVsdCwgbWF0MzogX21hdDYuZGVmYXVsdCwgbWF0NDogX21hdDguZGVmYXVsdCwgY29sb3IzOiBfY29sb3IyLmRlZmF1bHQsIGNvbG9yNDogX2NvbG9yNC5kZWZhdWx0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbWx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiSW5abFl6SWlMQ0oyWldNeklpd2lkbVZqTkNJc0luRjFZWFFpTENKMGNuTWlMQ0p0WVhReUlpd2liV0YwTWpNaUxDSnRZWFF6SWl3aWJXRjBOQ0lzSW1OdmJHOXlNeUlzSW1OdmJHOXlOQ0pkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN08wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk96dEJRVVZCT3pzN08wRkJRMEU3T3pzN1FVRkRRVHM3T3p0QlFVTkJPenM3TzBGQlEwRTdPenM3UVVGRFFUczdPenRCUVVOQk96czdPMEZCUTBFN096czdRVUZEUVRzN096dEJRVU5CT3pzN08wRkJRMEU3T3pzN096dFJRVVZUUVN4SkxFZEJRVUZCTEdFN1VVRkJUVU1zU1N4SFFVRkJRU3hoTzFGQlFVMURMRWtzUjBGQlFVRXNZVHRSUVVGTlF5eEpMRWRCUVVGQkxHTTdVVUZCVFVNc1J5eEhRVUZCUVN4aE8xRkJRVXRETEVrc1IwRkJRVUVzWVR0UlFVRk5ReXhMTEVkQlFVRkJMR0U3VVVGQlQwTXNTU3hIUVVGQlFTeGhPMUZCUVUxRExFa3NSMEZCUVVFc1lUdFJRVUZOUXl4TkxFZEJRVUZCTEdVN1VVRkJVVU1zVFN4SFFVRkJRU3hsTzJ0Q1FVTjRSQ3hGUVVGRlZpeHRRa0ZCUml4RlFVRlJReXh0UWtGQlVpeEZRVUZqUXl4dFFrRkJaQ3hGUVVGdlFrTXNiMEpCUVhCQ0xFVkJRVEJDUXl4clFrRkJNVUlzUlVGQkswSkRMRzFDUVVFdlFpeEZRVUZ4UTBNc2IwSkJRWEpETEVWQlFUUkRReXh0UWtGQk5VTXNSVUZCYTBSRExHMUNRVUZzUkN4RlFVRjNSRU1zZFVKQlFYaEVMRVZCUVdkRlF5eDFRa0ZCYUVVc1JTSXNJbVpwYkdVaU9pSnBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbVY0Y0c5eWRDQXFJR1p5YjIwZ0p5NHZkWFJwYkhNbk8xeHVYRzVwYlhCdmNuUWdkbVZqTWlCbWNtOXRJQ2N1TDNabFl6SW5PMXh1YVcxd2IzSjBJSFpsWXpNZ1puSnZiU0FuTGk5MlpXTXpKenRjYm1sdGNHOXlkQ0IyWldNMElHWnliMjBnSnk0dmRtVmpOQ2M3WEc1cGJYQnZjblFnY1hWaGRDQm1jbTl0SUNjdUwzRjFZWFFuTzF4dWFXMXdiM0owSUhSeWN5Qm1jbTl0SUNjdUwzUnljeWM3WEc1cGJYQnZjblFnYldGME1pQm1jbTl0SUNjdUwyMWhkREluTzF4dWFXMXdiM0owSUcxaGRESXpJR1p5YjIwZ0p5NHZiV0YwTWpNbk8xeHVhVzF3YjNKMElHMWhkRE1nWm5KdmJTQW5MaTl0WVhRekp6dGNibWx0Y0c5eWRDQnRZWFEwSUdaeWIyMGdKeTR2YldGME5DYzdYRzVwYlhCdmNuUWdZMjlzYjNJeklHWnliMjBnSnk0dlkyOXNiM0l6Snp0Y2JtbHRjRzl5ZENCamIyeHZjalFnWm5KdmJTQW5MaTlqYjJ4dmNqUW5PMXh1WEc1bGVIQnZjblFnZXlCMlpXTXlMQ0IyWldNekxDQjJaV00wTENCeGRXRjBMQ0IwY25Nc0lHMWhkRElzSUcxaGRESXpMQ0J0WVhRekxDQnRZWFEwTENCamIyeHZjak1zSUdOdmJHOXlOQ0I5TzF4dVpYaHdiM0owSUdSbFptRjFiSFFnZXlCMlpXTXlMQ0IyWldNekxDQjJaV00wTENCeGRXRjBMQ0IwY25Nc0lHMWhkRElzSUcxaGRESXpMQ0J0WVhRekxDQnRZWFEwTENCamIyeHZjak1zSUdOdmJHOXlOQ0I5TzF4dUlsMTkiXX0=