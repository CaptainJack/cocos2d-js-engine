(function () {
    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
    var __module = nodeEnv ? module : { exports: {} };
    var __filename = 'engine-dev/cocos2d/renderer/config.js';
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
        var _stageOffset = 0;
        var _name2stageID = {};
        exports.default = {
            addStage: function addStage(name) {
                if (_name2stageID[name] !== undefined) {
                    return;
                }
                var stageID = 1 << _stageOffset;
                _name2stageID[name] = stageID;
                _stageOffset += 1;
                CC_JSB && CC_NATIVERENDERER && window.renderer.addStage(name);
            },
            stageID: function stageID(name) {
                var id = _name2stageID[name];
                if (id === undefined) {
                    return -1;
                }
                return id;
            },
            stageIDs: function stageIDs(nameList) {
                var key = 0;
                for (var i = 0; i < nameList.length; ++i) {
                    var id = _name2stageID[nameList[i]];
                    if (id !== undefined) {
                        key |= id;
                    }
                }
                return key;
            }
        };
        module.exports = exports['default'];
    }
    if (nodeEnv) {
        __define(__module.exports, __require, __module);
    } else {
        __quick_compile__.registerModuleFunc(__filename, function () {
            __define(__module.exports, __require, __module);
        });
    }
}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy5qcyIsIi9Vc2Vycy9hZG1pbi9DQ0VuZ2luZS9jb2NvczJkL3JlbmRlcmVyL2NvbmZpZy5qcyJdLCJuYW1lcyI6WyJfc3RhZ2VPZmZzZXQiLCJfbmFtZTJzdGFnZUlEIiwiYWRkU3RhZ2UiLCJuYW1lIiwidW5kZWZpbmVkIiwic3RhZ2VJRCIsIkNDX0pTQiIsIkNDX05BVElWRVJFTkRFUkVSIiwid2luZG93IiwicmVuZGVyZXIiLCJpZCIsInN0YWdlSURzIiwibmFtZUxpc3QiLCJrZXkiLCJpIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7O0lBQUEsSUFBQSxTQUFBLEdBQUEsT0FBQSxHQUFBLFVBQUEsT0FBQSxFQUFBO0FBQUEsZ0NBQUE7QUFBQSxLQUFBLEdBRUEsVUFBQSxPQUFBLEVBQUE7QUFBQSxRQUNBLE9BQUEsaUJBQUEsQ0FBQSxPQUFBLENBQUEsT0FBQSxFQUFBLFVBQUEsQ0FBQSxDQURBO0FBQUEsS0FGQTtJQUtlLFNBQUEsUUFBQSxDQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxFQUFBO0FBQUEsUUFDSCxJQUFBLENBQUEsT0FBQSxFQUFnQjtBQUFBLFlBQUEsaUJBQUEsQ0FBQSxjQUFBLENBQUEsVUFBQSxFQUFBLE1BQUEsRUFBQTtBQUFBLFNBRGI7QUFBQTs7UUFIZixJQUFJQSxZQUFBQSxHQUFlLENBQW5CO1FBQ0EsSUFBSUMsYUFBQUEsR0FBZ0IsRUFBcEI7MEJBRWU7QUFBQSxZQUNiQyxRQUFBQSxFQUFVLFNBQUEsUUFBQSxDQUFVQyxJQUFWLEVBQWdCO0FBQUEsZ0JBRXhCLElBQUlGLGFBQUFBLENBQWNFLElBQWRGLE1BQXdCRyxTQUE1QixFQUF1QztBQUFBLG9CQUNyQyxPQURxQztBQUFBLGlCQUZmO0FBQUEsZ0JBTXhCLElBQUlDLE9BQUFBLEdBQVUsS0FBS0wsWUFBbkIsQ0FOd0I7QUFBQSxnQkFPeEJDLGFBQUFBLENBQWNFLElBQWRGLElBQXNCSSxPQUF0QkosQ0FQd0I7QUFBQSxnQkFTeEJELFlBQUFBLElBQWdCLENBQWhCQSxDQVR3QjtBQUFBLGdCQVd4Qk0sTUFBQUEsSUFBVUMsaUJBQVZELElBQStCRSxNQUFBQSxDQUFPQyxRQUFQRCxDQUFnQk4sUUFBaEJNLENBQXlCTCxJQUF6QkssQ0FBL0JGLENBWHdCO0FBQUEsYUFEYjtBQUFBLFlBZWJELE9BQUFBLEVBQVMsU0FBQSxPQUFBLENBQVVGLElBQVYsRUFBZ0I7QUFBQSxnQkFDdkIsSUFBSU8sRUFBQUEsR0FBS1QsYUFBQUEsQ0FBY0UsSUFBZEYsQ0FBVCxDQUR1QjtBQUFBLGdCQUV2QixJQUFJUyxFQUFBQSxLQUFPTixTQUFYLEVBQXNCO0FBQUEsb0JBQ3BCLE9BQU8sQ0FBQyxDQUFSLENBRG9CO0FBQUEsaUJBRkM7QUFBQSxnQkFLdkIsT0FBT00sRUFBUCxDQUx1QjtBQUFBLGFBZlo7QUFBQSxZQXVCYkMsUUFBQUEsRUFBVSxTQUFBLFFBQUEsQ0FBVUMsUUFBVixFQUFvQjtBQUFBLGdCQUM1QixJQUFJQyxHQUFBQSxHQUFNLENBQVYsQ0FENEI7QUFBQSxnQkFFNUIsS0FBSyxJQUFJQyxDQUFBQSxHQUFJLENBQVIsQ0FBTCxDQUFnQkEsQ0FBQUEsR0FBSUYsUUFBQUEsQ0FBU0csTUFBN0IsRUFBcUMsRUFBRUQsQ0FBdkMsRUFBMEM7QUFBQSxvQkFDeEMsSUFBSUosRUFBQUEsR0FBS1QsYUFBQUEsQ0FBY1csUUFBQUEsQ0FBU0UsQ0FBVEYsQ0FBZFgsQ0FBVCxDQUR3QztBQUFBLG9CQUV4QyxJQUFJUyxFQUFBQSxLQUFPTixTQUFYLEVBQXNCO0FBQUEsd0JBQ3BCUyxHQUFBQSxJQUFPSCxFQUFQRyxDQURvQjtBQUFBLHFCQUZrQjtBQUFBLGlCQUZkO0FBQUEsZ0JBUTVCLE9BQU9BLEdBQVAsQ0FSNEI7QUFBQSxhQXZCakI7QUFBQTs0Q0FBQTtBQUFBO0lBR1BaLElBQWNFLE9BQWRGLEVBQXdCRztBQUFBQSxRQUMxQixRQUFBLENBQUEsUUFBQSxDQUFBLE9BQUEsRUFBQSxTQUFBLEVBQUEsUUFBQSxFQUQwQkE7QUFBQUEsS0FBeEJIO1FBSWVELGlCQUFBQSxDQUFuQixrQkFBbUJBLENBQW5CLFVBQW1CQSxFQUFuQixZQUFBO0FBQUEsWUFDc0JLLFFBQUFBLENBQXRCLFFBQUEsQ0FBQSxPQUFzQkEsRUFBdEIsU0FBc0JBLEVBQXRCLFFBQXNCQSxFQUR0QjtBQUFBLFNBQW1CTCIsImZpbGUiOiJjb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxubGV0IF9zdGFnZU9mZnNldCA9IDA7XG5sZXQgX25hbWUyc3RhZ2VJRCA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFkZFN0YWdlOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIC8vIGFscmVhZHkgYWRkZWRcbiAgICBpZiAoX25hbWUyc3RhZ2VJRFtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHN0YWdlSUQgPSAxIDw8IF9zdGFnZU9mZnNldDtcbiAgICBfbmFtZTJzdGFnZUlEW25hbWVdID0gc3RhZ2VJRDtcblxuICAgIF9zdGFnZU9mZnNldCArPSAxO1xuXG4gICAgQ0NfSlNCICYmIENDX05BVElWRVJFTkRFUkVSICYmIHdpbmRvdy5yZW5kZXJlci5hZGRTdGFnZShuYW1lKTtcbiAgfSxcblxuICBzdGFnZUlEOiBmdW5jdGlvbiAobmFtZSkge1xuICAgIGxldCBpZCA9IF9uYW1lMnN0YWdlSURbbmFtZV07XG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgcmV0dXJuIGlkO1xuICB9LFxuXG4gIHN0YWdlSURzOiBmdW5jdGlvbiAobmFtZUxpc3QpIHtcbiAgICBsZXQga2V5ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWVMaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZXQgaWQgPSBfbmFtZTJzdGFnZUlEW25hbWVMaXN0W2ldXTtcbiAgICAgIGlmIChpZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGtleSB8PSBpZDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbi8vIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG52YXIgX3N0YWdlT2Zmc2V0ID0gMDtcbnZhciBfbmFtZTJzdGFnZUlEID0ge307XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHtcbiAgYWRkU3RhZ2U6IGZ1bmN0aW9uIGFkZFN0YWdlKG5hbWUpIHtcbiAgICAvLyBhbHJlYWR5IGFkZGVkXG4gICAgaWYgKF9uYW1lMnN0YWdlSURbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBzdGFnZUlEID0gMSA8PCBfc3RhZ2VPZmZzZXQ7XG4gICAgX25hbWUyc3RhZ2VJRFtuYW1lXSA9IHN0YWdlSUQ7XG5cbiAgICBfc3RhZ2VPZmZzZXQgKz0gMTtcblxuICAgIENDX0pTQiAmJiBDQ19OQVRJVkVSRU5ERVJFUiAmJiB3aW5kb3cucmVuZGVyZXIuYWRkU3RhZ2UobmFtZSk7XG4gIH0sXG5cbiAgc3RhZ2VJRDogZnVuY3Rpb24gc3RhZ2VJRChuYW1lKSB7XG4gICAgdmFyIGlkID0gX25hbWUyc3RhZ2VJRFtuYW1lXTtcbiAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICByZXR1cm4gaWQ7XG4gIH0sXG5cbiAgc3RhZ2VJRHM6IGZ1bmN0aW9uIHN0YWdlSURzKG5hbWVMaXN0KSB7XG4gICAgdmFyIGtleSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYW1lTGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGlkID0gX25hbWUyc3RhZ2VJRFtuYW1lTGlzdFtpXV07XG4gICAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBrZXkgfD0gaWQ7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG4gIH1cbn07XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbXCJkZWZhdWx0XCJdO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1OdmJtWnBaeTVxY3lKZExDSnVZVzFsY3lJNld5SmZjM1JoWjJWUFptWnpaWFFpTENKZmJtRnRaVEp6ZEdGblpVbEVJaXdpWVdSa1UzUmhaMlVpTENKdVlXMWxJaXdpZFc1a1pXWnBibVZrSWl3aWMzUmhaMlZKUkNJc0lrTkRYMHBUUWlJc0lrTkRYMDVCVkVsV1JWSkZUa1JGVWtWU0lpd2lkMmx1Wkc5M0lpd2ljbVZ1WkdWeVpYSWlMQ0pwWkNJc0luTjBZV2RsU1VSeklpd2libUZ0WlV4cGMzUWlMQ0pyWlhraUxDSnBJaXdpYkdWdVozUm9JbDBzSW0xaGNIQnBibWR6SWpvaU96czdPenRCUVVGQk96dEJRVVZCTEVsQlFVbEJMR1ZCUVdVc1EwRkJia0k3UVVGRFFTeEpRVUZKUXl4blFrRkJaMElzUlVGQmNFSTdPMnRDUVVWbE8wRkJRMkpETEZsQlFWVXNhMEpCUVZWRExFbEJRVllzUlVGQlowSTdRVUZEZUVJN1FVRkRRU3hSUVVGSlJpeGpRVUZqUlN4SlFVRmtMRTFCUVhkQ1F5eFRRVUUxUWl4RlFVRjFRenRCUVVOeVF6dEJRVU5FT3p0QlFVVkVMRkZCUVVsRExGVkJRVlVzUzBGQlMwd3NXVUZCYmtJN1FVRkRRVU1zYTBKQlFXTkZMRWxCUVdRc1NVRkJjMEpGTEU5QlFYUkNPenRCUVVWQlRDeHZRa0ZCWjBJc1EwRkJhRUk3TzBGQlJVRk5MR05CUVZWRExHbENRVUZXTEVsQlFTdENReXhQUVVGUFF5eFJRVUZRTEVOQlFXZENVQ3hSUVVGb1FpeERRVUY1UWtNc1NVRkJla0lzUTBGQkwwSTdRVUZEUkN4SFFXSlpPenRCUVdWaVJTeFhRVUZUTEdsQ1FVRlZSaXhKUVVGV0xFVkJRV2RDTzBGQlEzWkNMRkZCUVVsUExFdEJRVXRVTEdOQlFXTkZMRWxCUVdRc1EwRkJWRHRCUVVOQkxGRkJRVWxQTEU5QlFVOU9MRk5CUVZnc1JVRkJjMEk3UVVGRGNFSXNZVUZCVHl4RFFVRkRMRU5CUVZJN1FVRkRSRHRCUVVORUxGZEJRVTlOTEVWQlFWQTdRVUZEUkN4SFFYSkNXVHM3UVVGMVFtSkRMRmxCUVZVc2EwSkJRVlZETEZGQlFWWXNSVUZCYjBJN1FVRkROVUlzVVVGQlNVTXNUVUZCVFN4RFFVRldPMEZCUTBFc1UwRkJTeXhKUVVGSlF5eEpRVUZKTEVOQlFXSXNSVUZCWjBKQkxFbEJRVWxHTEZOQlFWTkhMRTFCUVRkQ0xFVkJRWEZETEVWQlFVVkVMRU5CUVhaRExFVkJRVEJETzBGQlEzaERMRlZCUVVsS0xFdEJRVXRVTEdOQlFXTlhMRk5CUVZORkxFTkJRVlFzUTBGQlpDeERRVUZVTzBGQlEwRXNWVUZCU1Vvc1QwRkJUMDRzVTBGQldDeEZRVUZ6UWp0QlFVTndRbE1zWlVGQlQwZ3NSVUZCVUR0QlFVTkVPMEZCUTBZN1FVRkRSQ3hYUVVGUFJ5eEhRVUZRTzBGQlEwUTdRVUZvUTFrc1F5SXNJbVpwYkdVaU9pSmpiMjVtYVdjdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUl2THlCRGIzQjVjbWxuYUhRZ0tHTXBJREl3TVRjdE1qQXhPQ0JZYVdGdFpXNGdXV0ZxYVNCVGIyWjBkMkZ5WlNCRGJ5NHNJRXgwWkM1Y2JseHViR1YwSUY5emRHRm5aVTltWm5ObGRDQTlJREE3WEc1c1pYUWdYMjVoYldVeWMzUmhaMlZKUkNBOUlIdDlPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0I3WEc0Z0lHRmtaRk4wWVdkbE9pQm1kVzVqZEdsdmJpQW9ibUZ0WlNrZ2UxeHVJQ0FnSUM4dklHRnNjbVZoWkhrZ1lXUmtaV1JjYmlBZ0lDQnBaaUFvWDI1aGJXVXljM1JoWjJWSlJGdHVZVzFsWFNBaFBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNDdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2JHVjBJSE4wWVdkbFNVUWdQU0F4SUR3OElGOXpkR0ZuWlU5bVpuTmxkRHRjYmlBZ0lDQmZibUZ0WlRKemRHRm5aVWxFVzI1aGJXVmRJRDBnYzNSaFoyVkpSRHRjYmx4dUlDQWdJRjl6ZEdGblpVOW1abk5sZENBclBTQXhPMXh1WEc0Z0lDQWdRME5mU2xOQ0lDWW1JRU5EWDA1QlZFbFdSVkpGVGtSRlVrVlNJQ1ltSUhkcGJtUnZkeTV5Wlc1a1pYSmxjaTVoWkdSVGRHRm5aU2h1WVcxbEtUdGNiaUFnZlN4Y2JseHVJQ0J6ZEdGblpVbEVPaUJtZFc1amRHbHZiaUFvYm1GdFpTa2dlMXh1SUNBZ0lHeGxkQ0JwWkNBOUlGOXVZVzFsTW5OMFlXZGxTVVJiYm1GdFpWMDdYRzRnSUNBZ2FXWWdLR2xrSUQwOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQXRNVHRjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUdsa08xeHVJQ0I5TEZ4dVhHNGdJSE4wWVdkbFNVUnpPaUJtZFc1amRHbHZiaUFvYm1GdFpVeHBjM1FwSUh0Y2JpQWdJQ0JzWlhRZ2EyVjVJRDBnTUR0Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUc1aGJXVk1hWE4wTG14bGJtZDBhRHNnS3l0cEtTQjdYRzRnSUNBZ0lDQnNaWFFnYVdRZ1BTQmZibUZ0WlRKemRHRm5aVWxFVzI1aGJXVk1hWE4wVzJsZFhUdGNiaUFnSUNBZ0lHbG1JQ2hwWkNBaFBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdJQ0FnSUd0bGVTQjhQU0JwWkR0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlHdGxlVHRjYmlBZ2ZWeHVmVHNpWFgwPSJdfQ==