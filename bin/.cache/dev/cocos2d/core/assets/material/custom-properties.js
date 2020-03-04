(function () {
    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
    var __module = nodeEnv ? module : { exports: {} };
    var __filename = 'engine-dev/cocos2d/core/assets/material/custom-properties.js';
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
        exports.default = undefined;
        var _createClass = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ('value' in descriptor)
                        descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function (Constructor, protoProps, staticProps) {
                if (protoProps)
                    defineProperties(Constructor.prototype, protoProps);
                if (staticProps)
                    defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
        var _murmurhash2_gc = require('../../../renderer/murmurhash2_gc');
        var _murmurhash2_gc2 = _interopRequireDefault(_murmurhash2_gc);
        var _utils = require('./utils');
        var _utils2 = _interopRequireDefault(_utils);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError('Cannot call a class as a function');
            }
        }
        var CustomProperties = function () {
            function CustomProperties() {
                _classCallCheck(this, CustomProperties);
                this._properties = {};
                this._defines = {};
                this._dirty = false;
            }
            _createClass(CustomProperties, [
                {
                    key: 'setProperty',
                    value: function setProperty(name, value, type, directly) {
                        var uniform = this._properties[name];
                        if (!uniform) {
                            uniform = Object.create(null);
                            uniform.name = name;
                            uniform.type = type;
                            uniform.directly = directly;
                            this._properties[name] = uniform;
                        } else if (uniform.value === value)
                            return;
                        this._dirty = true;
                        uniform.directly = directly;
                        uniform.value = value;
                    }
                },
                {
                    key: 'getProperty',
                    value: function getProperty(name) {
                        var prop = this._properties[name];
                        if (prop)
                            return prop.value;
                        return null;
                    }
                },
                {
                    key: 'define',
                    value: function define(name, value) {
                        if (this._defines[name] === value)
                            return;
                        this._dirty = true;
                        this._defines[name] = value;
                    }
                },
                {
                    key: 'getDefine',
                    value: function getDefine(name) {
                        return this._defines[name];
                    }
                },
                {
                    key: 'extractProperties',
                    value: function extractProperties() {
                        var out = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                        Object.assign(out, this._properties);
                        return out;
                    }
                },
                {
                    key: 'extractDefines',
                    value: function extractDefines() {
                        var out = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                        Object.assign(out, this._defines);
                        return out;
                    }
                },
                {
                    key: 'getHash',
                    value: function getHash() {
                        if (!this._dirty)
                            return this._hash;
                        this._dirty = false;
                        var hash = '';
                        hash += _utils2.default.serializeDefines(this._defines);
                        hash += _utils2.default.serializeUniforms(this._properties);
                        return this._hash = (0, _murmurhash2_gc2.default)(hash, 666);
                    }
                }
            ]);
            return CustomProperties;
        }();
        exports.default = CustomProperties;
        cc.CustomProperties = CustomProperties;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImN1c3RvbS1wcm9wZXJ0aWVzLmpzIiwiL1VzZXJzL2FkbWluL0NDRW5naW5lL2NvY29zMmQvY29yZS9hc3NldHMvbWF0ZXJpYWwvY3VzdG9tLXByb3BlcnRpZXMuanMiXSwibmFtZXMiOlsiQ3VzdG9tUHJvcGVydGllcyIsIl9wcm9wZXJ0aWVzIiwiX2RlZmluZXMiLCJfZGlydHkiLCJuYW1lIiwidmFsdWUiLCJ0eXBlIiwiZGlyZWN0bHkiLCJ1bmlmb3JtIiwiT2JqZWN0IiwiY3JlYXRlIiwicHJvcCIsIm91dCIsImFzc2lnbiIsIl9oYXNoIiwiaGFzaCIsInV0aWxzIiwic2VyaWFsaXplRGVmaW5lcyIsInNlcmlhbGl6ZVVuaWZvcm1zIiwiY2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBQUEsSUFBQSxlQUFBLEdBQUEsT0FBQSxDQUFBLGtDQUFBLENBQUE7O1FBQ0EsSUFBQSxNQUFBLEdBQUEsT0FBQSxDQUFBLFNBQUEsQ0FBQTs7Ozs7Ozs7OztZQUVxQkEsZ0JBQUFBO1lBQ2pCLFNBQUEsZ0JBQUEsR0FBZTtBQUFBLGdCQUFBLGVBQUEsQ0FBQSxJQUFBLEVBQUEsZ0JBQUEsRUFBQTtBQUFBLGdCQUNYLEtBQUtDLFdBQUwsR0FBbUIsRUFBbkIsQ0FEVztBQUFBLGdCQUVYLEtBQUtDLFFBQUwsR0FBZ0IsRUFBaEIsQ0FGVztBQUFBLGdCQUdYLEtBQUtDLE1BQUwsR0FBYyxLQUFkLENBSFc7QUFBQTs7OztnREFNRkMsTUFBTUMsT0FBT0MsTUFBTUMsVUFBVTtBQUFBLHdCQUN0QyxJQUFJQyxPQUFBQSxHQUFVLEtBQUtQLFdBQUwsQ0FBaUJHLElBQWpCLENBQWQsQ0FEc0M7QUFBQSx3QkFFdEMsSUFBSSxDQUFDSSxPQUFMLEVBQWM7QUFBQSw0QkFDVkEsT0FBQUEsR0FBVUMsTUFBQUEsQ0FBT0MsTUFBUEQsQ0FBYyxJQUFkQSxDQUFWRCxDQURVO0FBQUEsNEJBRVZBLE9BQUFBLENBQVFKLElBQVJJLEdBQWVK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Y3VzdG9tLXByb3BlcnRpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXVybXVyaGFzaDIgZnJvbSAnLi4vLi4vLi4vcmVuZGVyZXIvbXVybXVyaGFzaDJfZ2MnO1xuaW1wb3J0IHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdXN0b21Qcm9wZXJ0aWVzIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSB7fTtcbiAgICAgICAgdGhpcy5fZGVmaW5lcyA9IHt9O1xuICAgICAgICB0aGlzLl9kaXJ0eSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHNldFByb3BlcnR5IChuYW1lLCB2YWx1ZSwgdHlwZSwgZGlyZWN0bHkpIHtcbiAgICAgICAgbGV0IHVuaWZvcm0gPSB0aGlzLl9wcm9wZXJ0aWVzW25hbWVdO1xuICAgICAgICBpZiAoIXVuaWZvcm0pIHtcbiAgICAgICAgICAgIHVuaWZvcm0gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgICAgdW5pZm9ybS5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgIHVuaWZvcm0udHlwZSA9IHR5cGVcbiAgICAgICAgICAgIHVuaWZvcm0uZGlyZWN0bHkgPSBkaXJlY3RseTtcbiAgICAgICAgICAgIHRoaXMuX3Byb3BlcnRpZXNbbmFtZV0gPSB1bmlmb3JtO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVuaWZvcm0udmFsdWUgPT09IHZhbHVlKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XG4gICAgICAgIHVuaWZvcm0uZGlyZWN0bHkgPSBkaXJlY3RseTtcbiAgICAgICAgdW5pZm9ybS52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldFByb3BlcnR5KG5hbWUpIHtcbiAgICAgICAgbGV0IHByb3AgPSB0aGlzLl9wcm9wZXJ0aWVzW25hbWVdO1xuICAgICAgICBpZiAocHJvcCkgcmV0dXJuIHByb3AudmFsdWU7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGRlZmluZSAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2RlZmluZXNbbmFtZV0gPT09IHZhbHVlKSByZXR1cm47XG4gICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fZGVmaW5lc1tuYW1lXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldERlZmluZSAobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGVmaW5lc1tuYW1lXTtcbiAgICB9XG5cbiAgICBleHRyYWN0UHJvcGVydGllcyhvdXQgPSB7fSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKG91dCwgdGhpcy5fcHJvcGVydGllcyk7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgZXh0cmFjdERlZmluZXMob3V0ID0ge30pIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihvdXQsIHRoaXMuX2RlZmluZXMpO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIGdldEhhc2ggKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2RpcnR5KSByZXR1cm4gdGhpcy5faGFzaDtcbiAgICAgICAgdGhpcy5fZGlydHkgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGxldCBoYXNoID0gJyc7XG4gICAgICAgIGhhc2ggKz0gdXRpbHMuc2VyaWFsaXplRGVmaW5lcyh0aGlzLl9kZWZpbmVzKTtcbiAgICAgICAgaGFzaCArPSB1dGlscy5zZXJpYWxpemVVbmlmb3Jtcyh0aGlzLl9wcm9wZXJ0aWVzKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5faGFzaCA9IG11cm11cmhhc2gyKGhhc2gsIDY2Nik7XG4gICAgfVxufVxuXG5jYy5DdXN0b21Qcm9wZXJ0aWVzID0gQ3VzdG9tUHJvcGVydGllcztcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kZWZhdWx0ID0gdW5kZWZpbmVkO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG52YXIgX211cm11cmhhc2gyX2djID0gcmVxdWlyZSgnLi4vLi4vLi4vcmVuZGVyZXIvbXVybXVyaGFzaDJfZ2MnKTtcblxudmFyIF9tdXJtdXJoYXNoMl9nYzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tdXJtdXJoYXNoMl9nYyk7XG5cbnZhciBfdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBfdXRpbHMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdXRpbHMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgQ3VzdG9tUHJvcGVydGllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDdXN0b21Qcm9wZXJ0aWVzKCkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ3VzdG9tUHJvcGVydGllcyk7XG5cbiAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IHt9O1xuICAgICAgICB0aGlzLl9kZWZpbmVzID0ge307XG4gICAgICAgIHRoaXMuX2RpcnR5ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEN1c3RvbVByb3BlcnRpZXMsIFt7XG4gICAgICAgIGtleTogJ3NldFByb3BlcnR5JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNldFByb3BlcnR5KG5hbWUsIHZhbHVlLCB0eXBlLCBkaXJlY3RseSkge1xuICAgICAgICAgICAgdmFyIHVuaWZvcm0gPSB0aGlzLl9wcm9wZXJ0aWVzW25hbWVdO1xuICAgICAgICAgICAgaWYgKCF1bmlmb3JtKSB7XG4gICAgICAgICAgICAgICAgdW5pZm9ybSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgICAgICAgdW5pZm9ybS5uYW1lID0gbmFtZTtcbiAgICAgICAgICAgICAgICB1bmlmb3JtLnR5cGUgPSB0eXBlO1xuICAgICAgICAgICAgICAgIHVuaWZvcm0uZGlyZWN0bHkgPSBkaXJlY3RseTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wcm9wZXJ0aWVzW25hbWVdID0gdW5pZm9ybTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodW5pZm9ybS52YWx1ZSA9PT0gdmFsdWUpIHJldHVybjtcblxuICAgICAgICAgICAgdGhpcy5fZGlydHkgPSB0cnVlO1xuICAgICAgICAgICAgdW5pZm9ybS5kaXJlY3RseSA9IGRpcmVjdGx5O1xuICAgICAgICAgICAgdW5pZm9ybS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdnZXRQcm9wZXJ0eScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRQcm9wZXJ0eShuYW1lKSB7XG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuX3Byb3BlcnRpZXNbbmFtZV07XG4gICAgICAgICAgICBpZiAocHJvcCkgcmV0dXJuIHByb3AudmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnZGVmaW5lJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRlZmluZShuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2RlZmluZXNbbmFtZV0gPT09IHZhbHVlKSByZXR1cm47XG4gICAgICAgICAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVzW25hbWVdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldERlZmluZScsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXREZWZpbmUobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmluZXNbbmFtZV07XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2V4dHJhY3RQcm9wZXJ0aWVzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGV4dHJhY3RQcm9wZXJ0aWVzKCkge1xuICAgICAgICAgICAgdmFyIG91dCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0LCB0aGlzLl9wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2V4dHJhY3REZWZpbmVzJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGV4dHJhY3REZWZpbmVzKCkge1xuICAgICAgICAgICAgdmFyIG91dCA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3V0LCB0aGlzLl9kZWZpbmVzKTtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ2dldEhhc2gnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SGFzaCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fZGlydHkpIHJldHVybiB0aGlzLl9oYXNoO1xuICAgICAgICAgICAgdGhpcy5fZGlydHkgPSBmYWxzZTtcblxuICAgICAgICAgICAgdmFyIGhhc2ggPSAnJztcbiAgICAgICAgICAgIGhhc2ggKz0gX3V0aWxzMi5kZWZhdWx0LnNlcmlhbGl6ZURlZmluZXModGhpcy5fZGVmaW5lcyk7XG4gICAgICAgICAgICBoYXNoICs9IF91dGlsczIuZGVmYXVsdC5zZXJpYWxpemVVbmlmb3Jtcyh0aGlzLl9wcm9wZXJ0aWVzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hhc2ggPSAoMCwgX211cm11cmhhc2gyX2djMi5kZWZhdWx0KShoYXNoLCA2NjYpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEN1c3RvbVByb3BlcnRpZXM7XG59KCk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IEN1c3RvbVByb3BlcnRpZXM7XG5cblxuY2MuQ3VzdG9tUHJvcGVydGllcyA9IEN1c3RvbVByb3BlcnRpZXM7XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltTjFjM1J2YlMxd2NtOXdaWEowYVdWekxtcHpJbDBzSW01aGJXVnpJanBiSWtOMWMzUnZiVkJ5YjNCbGNuUnBaWE1pTENKZmNISnZjR1Z5ZEdsbGN5SXNJbDlrWldacGJtVnpJaXdpWDJScGNuUjVJaXdpYm1GdFpTSXNJblpoYkhWbElpd2lkSGx3WlNJc0ltUnBjbVZqZEd4NUlpd2lkVzVwWm05eWJTSXNJazlpYW1WamRDSXNJbU55WldGMFpTSXNJbkJ5YjNBaUxDSnZkWFFpTENKaGMzTnBaMjRpTENKZmFHRnphQ0lzSW1oaGMyZ2lMQ0oxZEdsc2N5SXNJbk5sY21saGJHbDZaVVJsWm1sdVpYTWlMQ0p6WlhKcFlXeHBlbVZWYm1sbWIzSnRjeUlzSW1OaklsMHNJbTFoY0hCcGJtZHpJam9pT3pzN096czdPenM3UVVGQlFUczdPenRCUVVOQk96czdPenM3T3p0SlFVVnhRa0VzWjBJN1FVRkRha0lzWjBOQlFXVTdRVUZCUVRzN1FVRkRXQ3hoUVVGTFF5eFhRVUZNTEVkQlFXMUNMRVZCUVc1Q08wRkJRMEVzWVVGQlMwTXNVVUZCVEN4SFFVRm5RaXhGUVVGb1FqdEJRVU5CTEdGQlFVdERMRTFCUVV3c1IwRkJZeXhMUVVGa08wRkJRMGc3T3pzN2IwTkJSVmxETEVrc1JVRkJUVU1zU3l4RlFVRlBReXhKTEVWQlFVMURMRkVzUlVGQlZUdEJRVU4wUXl4blFrRkJTVU1zVlVGQlZTeExRVUZMVUN4WFFVRk1MRU5CUVdsQ1J5eEpRVUZxUWl4RFFVRmtPMEZCUTBFc1owSkJRVWtzUTBGQlEwa3NUMEZCVEN4RlFVRmpPMEZCUTFaQkxEQkNRVUZWUXl4UFFVRlBReXhOUVVGUUxFTkJRV01zU1VGQlpDeERRVUZXTzBGQlEwRkdMSGRDUVVGUlNpeEpRVUZTTEVkQlFXVkJMRWxCUVdZN1FVRkRRVWtzZDBKQlFWRkdMRWxCUVZJc1IwRkJaVUVzU1VGQlpqdEJRVU5CUlN4M1FrRkJVVVFzVVVGQlVpeEhRVUZ0UWtFc1VVRkJia0k3UVVGRFFTeHhRa0ZCUzA0c1YwRkJUQ3hEUVVGcFFrY3NTVUZCYWtJc1NVRkJlVUpKTEU5QlFYcENPMEZCUTBnc1lVRk9SQ3hOUVU5TExFbEJRVWxCTEZGQlFWRklMRXRCUVZJc1MwRkJhMEpCTEV0QlFYUkNMRVZCUVRaQ096dEJRVVZzUXl4cFFrRkJTMFlzVFVGQlRDeEhRVUZqTEVsQlFXUTdRVUZEUVVzc2IwSkJRVkZFTEZGQlFWSXNSMEZCYlVKQkxGRkJRVzVDTzBGQlEwRkRMRzlDUVVGUlNDeExRVUZTTEVkQlFXZENRU3hMUVVGb1FqdEJRVU5JT3pzN2IwTkJSVmRFTEVrc1JVRkJUVHRCUVVOa0xHZENRVUZKVHl4UFFVRlBMRXRCUVV0V0xGZEJRVXdzUTBGQmFVSkhMRWxCUVdwQ0xFTkJRVmc3UVVGRFFTeG5Ra0ZCU1U4c1NVRkJTaXhGUVVGVkxFOUJRVTlCTEV0QlFVdE9MRXRCUVZvN1FVRkRWaXh0UWtGQlR5eEpRVUZRTzBGQlEwZzdPenNyUWtGRlQwUXNTU3hGUVVGTlF5eExMRVZCUVU4N1FVRkRha0lzWjBKQlFVa3NTMEZCUzBnc1VVRkJUQ3hEUVVGalJTeEpRVUZrTEUxQlFYZENReXhMUVVFMVFpeEZRVUZ0UXp0QlFVTnVReXhwUWtGQlMwWXNUVUZCVEN4SFFVRmpMRWxCUVdRN1FVRkRRU3hwUWtGQlMwUXNVVUZCVEN4RFFVRmpSU3hKUVVGa0xFbEJRWE5DUXl4TFFVRjBRanRCUVVOSU96czdhME5CUlZWRUxFa3NSVUZCVFR0QlFVTmlMRzFDUVVGUExFdEJRVXRHTEZGQlFVd3NRMEZCWTBVc1NVRkJaQ3hEUVVGUU8wRkJRMGc3T3pzMFEwRkZNa0k3UVVGQlFTeG5Ra0ZCVmxFc1IwRkJWU3gxUlVGQlNpeEZRVUZKT3p0QlFVTjRRa2dzYlVKQlFVOUpMRTFCUVZBc1EwRkJZMFFzUjBGQlpDeEZRVUZ0UWl4TFFVRkxXQ3hYUVVGNFFqdEJRVU5CTEcxQ1FVRlBWeXhIUVVGUU8wRkJRMGc3T3p0NVEwRkZkMEk3UVVGQlFTeG5Ra0ZCVmtFc1IwRkJWU3gxUlVGQlNpeEZRVUZKT3p0QlFVTnlRa2dzYlVKQlFVOUpMRTFCUVZBc1EwRkJZMFFzUjBGQlpDeEZRVUZ0UWl4TFFVRkxWaXhSUVVGNFFqdEJRVU5CTEcxQ1FVRlBWU3hIUVVGUU8wRkJRMGc3T3p0clEwRkZWVHRCUVVOUUxHZENRVUZKTEVOQlFVTXNTMEZCUzFRc1RVRkJWaXhGUVVGclFpeFBRVUZQTEV0QlFVdFhMRXRCUVZvN1FVRkRiRUlzYVVKQlFVdFlMRTFCUVV3c1IwRkJZeXhMUVVGa096dEJRVVZCTEdkQ1FVRkpXU3hQUVVGUExFVkJRVmc3UVVGRFFVRXNiMEpCUVZGRExHZENRVUZOUXl4blFrRkJUaXhEUVVGMVFpeExRVUZMWml4UlFVRTFRaXhEUVVGU08wRkJRMEZoTEc5Q1FVRlJReXhuUWtGQlRVVXNhVUpCUVU0c1EwRkJkMElzUzBGQlMycENMRmRCUVRkQ0xFTkJRVkk3TzBGQlJVRXNiVUpCUVU4c1MwRkJTMkVzUzBGQlRDeEhRVUZoTERoQ1FVRlpReXhKUVVGYUxFVkJRV3RDTEVkQlFXeENMRU5CUVhCQ08wRkJRMGc3T3pzN096dHJRa0V4UkdkQ1ppeG5RanM3TzBGQk5rUnlRbTFDTEVkQlFVZHVRaXhuUWtGQlNDeEhRVUZ6UWtFc1owSkJRWFJDSWl3aVptbHNaU0k2SW1OMWMzUnZiUzF3Y205d1pYSjBhV1Z6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElHMTFjbTExY21oaGMyZ3lJR1p5YjIwZ0p5NHVMeTR1THk0dUwzSmxibVJsY21WeUwyMTFjbTExY21oaGMyZ3lYMmRqSnp0Y2JtbHRjRzl5ZENCMWRHbHNjeUJtY205dElDY3VMM1YwYVd4ekp6dGNibHh1Wlhod2IzSjBJR1JsWm1GMWJIUWdZMnhoYzNNZ1EzVnpkRzl0VUhKdmNHVnlkR2xsY3lCN1hHNGdJQ0FnWTI5dWMzUnlkV04wYjNJZ0tDa2dlMXh1SUNBZ0lDQWdJQ0IwYUdsekxsOXdjbTl3WlhKMGFXVnpJRDBnZTMwN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WDJSbFptbHVaWE1nUFNCN2ZUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlpHbHlkSGtnUFNCbVlXeHpaVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnpaWFJRY205d1pYSjBlU0FvYm1GdFpTd2dkbUZzZFdVc0lIUjVjR1VzSUdScGNtVmpkR3g1S1NCN1hHNGdJQ0FnSUNBZ0lHeGxkQ0IxYm1sbWIzSnRJRDBnZEdocGN5NWZjSEp2Y0dWeWRHbGxjMXR1WVcxbFhUdGNiaUFnSUNBZ0lDQWdhV1lnS0NGMWJtbG1iM0p0S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IxYm1sbWIzSnRJRDBnVDJKcVpXTjBMbU55WldGMFpTaHVkV3hzS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFZ1YVdadmNtMHVibUZ0WlNBOUlHNWhiV1U3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjFibWxtYjNKdExuUjVjR1VnUFNCMGVYQmxYRzRnSUNBZ0lDQWdJQ0FnSUNCMWJtbG1iM0p0TG1ScGNtVmpkR3g1SUQwZ1pHbHlaV04wYkhrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxsOXdjbTl3WlhKMGFXVnpXMjVoYldWZElEMGdkVzVwWm05eWJUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0JsYkhObElHbG1JQ2gxYm1sbWIzSnRMblpoYkhWbElEMDlQU0IyWVd4MVpTa2djbVYwZFhKdU8xeHVJQ0FnSUNBZ0lDQmNiaUFnSUNBZ0lDQWdkR2hwY3k1ZlpHbHlkSGtnUFNCMGNuVmxPMXh1SUNBZ0lDQWdJQ0IxYm1sbWIzSnRMbVJwY21WamRHeDVJRDBnWkdseVpXTjBiSGs3WEc0Z0lDQWdJQ0FnSUhWdWFXWnZjbTB1ZG1Gc2RXVWdQU0IyWVd4MVpUdGNiaUFnSUNCOVhHNWNiaUFnSUNCblpYUlFjbTl3WlhKMGVTaHVZVzFsS1NCN1hHNGdJQ0FnSUNBZ0lHeGxkQ0J3Y205d0lEMGdkR2hwY3k1ZmNISnZjR1Z5ZEdsbGMxdHVZVzFsWFR0Y2JpQWdJQ0FnSUNBZ2FXWWdLSEJ5YjNBcElISmxkSFZ5YmlCd2NtOXdMblpoYkhWbE8xeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2JuVnNiRHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQmtaV1pwYm1VZ0tHNWhiV1VzSUhaaGJIVmxLU0I3WEc0Z0lDQWdJQ0FnSUdsbUlDaDBhR2x6TGw5a1pXWnBibVZ6VzI1aGJXVmRJRDA5UFNCMllXeDFaU2tnY21WMGRYSnVPMXh1SUNBZ0lDQWdJQ0IwYUdsekxsOWthWEowZVNBOUlIUnlkV1U3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMlJsWm1sdVpYTmJibUZ0WlYwZ1BTQjJZV3gxWlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JuWlhSRVpXWnBibVVnS0c1aGJXVXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVgyUmxabWx1WlhOYmJtRnRaVjA3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdaWGgwY21GamRGQnliM0JsY25ScFpYTW9iM1YwSUQwZ2UzMHBJSHRjYmlBZ0lDQWdJQ0FnVDJKcVpXTjBMbUZ6YzJsbmJpaHZkWFFzSUhSb2FYTXVYM0J5YjNCbGNuUnBaWE1wTzF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYjNWME8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdWNGRISmhZM1JFWldacGJtVnpLRzkxZENBOUlIdDlLU0I3WEc0Z0lDQWdJQ0FnSUU5aWFtVmpkQzVoYzNOcFoyNG9iM1YwTENCMGFHbHpMbDlrWldacGJtVnpLVHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJRzkxZER0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JuWlhSSVlYTm9JQ2dwSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLQ0YwYUdsekxsOWthWEowZVNrZ2NtVjBkWEp1SUhSb2FYTXVYMmhoYzJnN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WDJScGNuUjVJRDBnWm1Gc2MyVTdYRzRnSUNBZ0lDQWdJRnh1SUNBZ0lDQWdJQ0JzWlhRZ2FHRnphQ0E5SUNjbk8xeHVJQ0FnSUNBZ0lDQm9ZWE5vSUNzOUlIVjBhV3h6TG5ObGNtbGhiR2w2WlVSbFptbHVaWE1vZEdocGN5NWZaR1ZtYVc1bGN5azdYRzRnSUNBZ0lDQWdJR2hoYzJnZ0t6MGdkWFJwYkhNdWMyVnlhV0ZzYVhwbFZXNXBabTl5YlhNb2RHaHBjeTVmY0hKdmNHVnlkR2xsY3lrN1hHNWNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlIUm9hWE11WDJoaGMyZ2dQU0J0ZFhKdGRYSm9ZWE5vTWlob1lYTm9MQ0EyTmpZcE8xeHVJQ0FnSUgxY2JuMWNibHh1WTJNdVEzVnpkRzl0VUhKdmNHVnlkR2xsY3lBOUlFTjFjM1J2YlZCeWIzQmxjblJwWlhNN1hHNGlYWDA9Il19