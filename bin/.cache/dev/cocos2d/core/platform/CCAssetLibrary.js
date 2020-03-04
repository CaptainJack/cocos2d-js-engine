
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/platform/CCAssetLibrary.js';
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
var Asset = require('../assets/CCAsset');

var callInNextTick = require('./utils').callInNextTick;

var Loader = require('../load-pipeline/CCLoader');

var AssetTable = require('../load-pipeline/asset-table');

var PackDownloader = require('../load-pipeline/pack-downloader');

var AutoReleaseUtils = require('../load-pipeline/auto-release-utils');

var decodeUuid = require('../utils/decode-uuid');

var MD5Pipe = require('../load-pipeline/md5-pipe');

var SubPackPipe = require('../load-pipeline/subpackage-pipe');

var js = require('./js');
/**
 * The asset library which managing loading/unloading assets in project.
 *
 * @class AssetLibrary
 * @static
 */
// configs


var _libraryBase = '';
var _rawAssetsBase = ''; // The base dir for raw assets in runtime

var _uuidToRawAsset = js.createMap(true);

function isScene(asset) {
  return asset && (asset.constructor === cc.SceneAsset || asset instanceof cc.Scene);
} // types


function RawAssetEntry(url, type) {
  this.url = url;
  this.type = type;
} // publics


var AssetLibrary = {
  /**
   * @callback loadCallback
   * @param {String} error - null or the error info
   * @param {Asset} data - the loaded asset or null
   */

  /**
   * @method loadAsset
   * @param {String} uuid
   * @param {loadCallback} callback - the callback function once load finished
   * @param {Object} options
   * @param {Boolean} options.readMainCache - Default is true. If false, the asset and all its depends assets will reload and create new instances from library.
   * @param {Boolean} options.writeMainCache - Default is true. If true, the result will cache to AssetLibrary, and MUST be unload by user manually.
   * @param {Asset} options.existingAsset - load to existing asset, this argument is only available in editor
   * @private
   */
  loadAsset: function loadAsset(uuid, callback, options) {
    if (typeof uuid !== 'string') {
      return callInNextTick(callback, new Error('[AssetLibrary] uuid must be string'), null);
    } // var readMainCache = typeof (options && options.readMainCache) !== 'undefined' ? readMainCache : true;
    // var writeMainCache = typeof (options && options.writeMainCache) !== 'undefined' ? writeMainCache : true;


    var item = {
      uuid: uuid,
      type: 'uuid'
    };

    if (options && options.existingAsset) {
      item.existingAsset = options.existingAsset;
    }

    Loader.load(item, function (error, asset) {
      if (error || !asset) {
        var errorInfo = typeof error === 'string' ? error : error ? error.message || error.errorMessage || JSON.stringify(error) : 'Unknown error';
        error = new Error('[AssetLibrary] loading JSON or dependencies failed:' + errorInfo);
      } else {
        if (asset.constructor === cc.SceneAsset) {
          if (CC_EDITOR && !asset.scene) {
            Editor.error('Sorry, the scene data of "%s" is corrupted!', uuid);
          } else {
            var key = cc.loader._getReferenceKey(uuid);

            asset.scene.dependAssets = AutoReleaseUtils.getDependsRecursively(key);
          }
        }

        if (CC_EDITOR || isScene(asset)) {
          var id = cc.loader._getReferenceKey(uuid);

          Loader.removeItem(id);
        }
      }

      if (callback) {
        callback(error, asset);
      }
    });
  },
  getLibUrlNoExt: function getLibUrlNoExt(uuid, inRawAssetsDir) {
    if (CC_BUILD) {
      uuid = decodeUuid(uuid);
    }

    var base = CC_BUILD && inRawAssetsDir ? _rawAssetsBase + 'assets/' : _libraryBase;
    return base + uuid.slice(0, 2) + '/' + uuid;
  },
  _queryAssetInfoInEditor: function _queryAssetInfoInEditor(uuid, callback) {
    if (CC_EDITOR) {
      Editor.Ipc.sendToMain('scene:query-asset-info-by-uuid', uuid, function (err, info) {
        if (info) {
          Editor.Utils.UuidCache.cache(info.url, uuid);
          var ctor = Editor.assets[info.type];

          if (ctor) {
            var isRawAsset = !js.isChildClassOf(ctor, Asset);
            callback(null, info.url, isRawAsset, ctor);
          } else {
            callback(new Error('Can not find asset type ' + info.type));
          }
        } else {
          var error = new Error('Can not get asset url by uuid "' + uuid + '", the asset may be deleted.');
          error.errorCode = 'db.NOTFOUND';
          callback(error);
        }
      }, -1);
    }
  },
  _getAssetInfoInRuntime: function _getAssetInfoInRuntime(uuid, result) {
    result = result || {
      url: null,
      raw: false
    };
    var info = _uuidToRawAsset[uuid];

    if (info && !js.isChildClassOf(info.type, cc.Asset)) {
      // backward compatibility since 1.10
      result.url = _rawAssetsBase + info.url;
      result.raw = true;
    } else {
      result.url = this.getLibUrlNoExt(uuid) + '.json';
      result.raw = false;
    }

    return result;
  },
  _uuidInSettings: function _uuidInSettings(uuid) {
    return uuid in _uuidToRawAsset;
  },

  /**
   * @method queryAssetInfo
   * @param {String} uuid
   * @param {Function} callback
   * @param {Error} callback.error
   * @param {String} callback.url - the url of raw asset or imported asset
   * @param {Boolean} callback.raw - indicates whether the asset is raw asset
   * @param {Function} callback.ctorInEditor - the actual type of asset, used in editor only
   */
  queryAssetInfo: function queryAssetInfo(uuid, callback) {
    if (CC_EDITOR && !CC_TEST) {
      this._queryAssetInfoInEditor(uuid, callback);
    } else {
      var info = this._getAssetInfoInRuntime(uuid);

      callback(null, info.url, info.raw);
    }
  },
  // parse uuid out of url
  parseUuidInEditor: function parseUuidInEditor(url) {
    if (CC_EDITOR) {
      var uuid = '';
      var isImported = url.startsWith(_libraryBase);

      if (isImported) {
        var dir = cc.path.dirname(url);
        var dirBasename = cc.path.basename(dir);
        var isAssetUrl = dirBasename.length === 2;

        if (isAssetUrl) {
          uuid = cc.path.basename(url);
          var index = uuid.indexOf('.');

          if (index !== -1) {
            uuid = uuid.slice(0, index);
          }
        } else {
          // raw file url
          uuid = dirBasename;
        }
      } // If url is not in the library, just return ""


      return uuid;
    }
  },

  /**
   * @method loadJson
   * @param {String} json
   * @param {loadCallback} callback
   * @return {LoadingHandle}
   * @private
   */
  loadJson: function loadJson(json, callback) {
    var randomUuid = '' + (new Date().getTime() + Math.random());
    var item = {
      uuid: randomUuid,
      type: 'uuid',
      content: json,
      skips: [Loader.assetLoader.id, Loader.downloader.id]
    };
    Loader.load(item, function (error, asset) {
      if (error) {
        error = new Error('[AssetLibrary] loading JSON or dependencies failed: ' + error.message);
      } else {
        if (asset.constructor === cc.SceneAsset) {
          var key = cc.loader._getReferenceKey(randomUuid);

          asset.scene.dependAssets = AutoReleaseUtils.getDependsRecursively(key);
        }

        if (CC_EDITOR || isScene(asset)) {
          var id = cc.loader._getReferenceKey(randomUuid);

          Loader.removeItem(id);
        }
      }

      asset._uuid = '';

      if (callback) {
        callback(error, asset);
      }
    });
  },

  /**
   * Get the exists asset by uuid.
   *
   * @method getAssetByUuid
   * @param {String} uuid
   * @return {Asset} - the existing asset, if not loaded, just returns null.
   * @private
   */
  getAssetByUuid: function getAssetByUuid(uuid) {
    return AssetLibrary._uuidToAsset[uuid] || null;
  },

  /**
   * init the asset library
   *
   * @method init
   * @param {Object} options
   * @param {String} options.libraryPath - 能接收的任意类型的路径，通常在编辑器里使用绝对的，在网页里使用相对的。
   * @param {Object} options.mountPaths - mount point of actual urls for raw assets (only used in editor)
   * @param {Object} [options.rawAssets] - uuid to raw asset's urls (only used in runtime)
   * @param {String} [options.rawAssetsBase] - base of raw asset's urls (only used in runtime)
   * @param {String} [options.packedAssets] - packed assets (only used in runtime)
   */
  init: function init(options) {
    if (CC_EDITOR && _libraryBase) {
      cc.errorID(6402);
      return;
    } // 这里将路径转 url，不使用路径的原因是有的 runtime 不能解析 "\" 符号。
    // 不使用 url.format 的原因是 windows 不支持 file:// 和 /// 开头的协议，所以只能用 replace 操作直接把路径转成 URL。


    var libraryPath = options.libraryPath;
    libraryPath = libraryPath.replace(/\\/g, '/');
    _libraryBase = cc.path.stripSep(libraryPath) + '/';
    _rawAssetsBase = options.rawAssetsBase;

    if (options.subpackages) {
      var subPackPipe = new SubPackPipe(options.subpackages);
      cc.loader.insertPipeAfter(cc.loader.assetLoader, subPackPipe);
      cc.loader.subPackPipe = subPackPipe;
    }

    var md5AssetsMap = options.md5AssetsMap;

    if (md5AssetsMap && md5AssetsMap["import"]) {
      // decode uuid
      var i = 0,
          uuid = 0;
      var md5ImportMap = js.createMap(true);
      var md5Entries = md5AssetsMap["import"];

      for (i = 0; i < md5Entries.length; i += 2) {
        uuid = decodeUuid(md5Entries[i]);
        md5ImportMap[uuid] = md5Entries[i + 1];
      }

      var md5RawAssetsMap = js.createMap(true);
      md5Entries = md5AssetsMap['raw-assets'];

      for (i = 0; i < md5Entries.length; i += 2) {
        uuid = decodeUuid(md5Entries[i]);
        md5RawAssetsMap[uuid] = md5Entries[i + 1];
      }

      var md5Pipe = new MD5Pipe(md5ImportMap, md5RawAssetsMap, _libraryBase);
      cc.loader.insertPipeAfter(cc.loader.assetLoader, md5Pipe);
      cc.loader.md5Pipe = md5Pipe;
    } // init raw assets


    var assetTables = Loader._assetTables;

    for (var mount in assetTables) {
      assetTables[mount].reset();
    }

    var rawAssets = options.rawAssets;

    if (rawAssets) {
      for (var mountPoint in rawAssets) {
        var assets = rawAssets[mountPoint];

        for (var uuid in assets) {
          var info = assets[uuid];
          var url = info[0];
          var typeId = info[1];

          var type = cc.js._getClassById(typeId);

          if (!type) {
            cc.error('Cannot get', typeId);
            continue;
          } // backward compatibility since 1.10


          _uuidToRawAsset[uuid] = new RawAssetEntry(mountPoint + '/' + url, type); // init resources

          var ext = cc.path.extname(url);

          if (ext) {
            // trim base dir and extname
            url = url.slice(0, -ext.length);
          }

          var isSubAsset = info[2] === 1;

          if (!assetTables[mountPoint]) {
            assetTables[mountPoint] = new AssetTable();
          }

          assetTables[mountPoint].add(url, uuid, type, !isSubAsset);
        }
      }
    }

    if (options.packedAssets) {
      PackDownloader.initPacks(options.packedAssets);
    } // init cc.url


    cc.url._init(options.mountPaths && options.mountPaths.assets || _rawAssetsBase + 'assets');
  }
}; // unload asset if it is destoryed

/**
 * !#en Caches uuid to all loaded assets in scenes.
 *
 * !#zh 这里保存所有已经加载的场景资源，防止同一个资源在内存中加载出多份拷贝。
 *
 * 这里用不了WeakMap，在浏览器中所有加载过的资源都只能手工调用 unloadAsset 释放。
 *
 * 参考：
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
 * https://github.com/TooTallNate/node-weak
 *
 * @property {object} _uuidToAsset
 * @private
 */

AssetLibrary._uuidToAsset = {}; //暂时屏蔽，因为目前没有缓存任何asset
//if (CC_DEV && Asset.prototype._onPreDestroy) {
//    cc.error('_onPreDestroy of Asset has already defined');
//}
//Asset.prototype._onPreDestroy = function () {
//    if (AssetLibrary._uuidToAsset[this._uuid] === this) {
//        AssetLibrary.unloadAsset(this);
//    }
//};
// TODO: Add BuiltinManager to handle builtin logic

var _builtins = {
  effect: {},
  material: {}
};
var _builtinDeps = {};

function loadBuiltins(name, type, cb) {
  var dirname = name + 's';
  var builtin = _builtins[name] = {};
  var internalMountPath = 'internal'; // internal path will be changed when run simulator

  if (CC_PREVIEW && CC_JSB) {
    internalMountPath = 'temp/internal';
  }

  cc.loader.loadResDir(dirname, type, internalMountPath, function () {}, function (err, assets) {
    if (err) {
      cc.error(err);
    } else {
      for (var i = 0; i < assets.length; i++) {
        var asset = assets[i];
        var deps = cc.loader.getDependsRecursively(asset);
        deps.forEach(function (uuid) {
          return _builtinDeps[uuid] = true;
        });
        builtin["" + asset.name] = asset;
      }
    }

    cb();
  });
}

AssetLibrary._loadBuiltins = function (cb) {
  if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
    return cb && cb();
  }

  loadBuiltins('effect', cc.EffectAsset, function () {
    loadBuiltins('material', cc.Material, cb);
  });
};

AssetLibrary.getBuiltin = function (type, name) {
  return _builtins[type][name];
};

AssetLibrary.getBuiltins = function (type) {
  if (!type) return _builtins;
  return _builtins[type];
};

AssetLibrary.resetBuiltins = function () {
  _builtins = {
    effect: {},
    material: {}
  };
  _builtinDeps = {};
};

AssetLibrary.getBuiltinDeps = function () {
  return _builtinDeps;
};

module.exports = cc.AssetLibrary = AssetLibrary;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDQXNzZXRMaWJyYXJ5LmpzIl0sIm5hbWVzIjpbIkFzc2V0IiwicmVxdWlyZSIsImNhbGxJbk5leHRUaWNrIiwiTG9hZGVyIiwiQXNzZXRUYWJsZSIsIlBhY2tEb3dubG9hZGVyIiwiQXV0b1JlbGVhc2VVdGlscyIsImRlY29kZVV1aWQiLCJNRDVQaXBlIiwiU3ViUGFja1BpcGUiLCJqcyIsIl9saWJyYXJ5QmFzZSIsIl9yYXdBc3NldHNCYXNlIiwiX3V1aWRUb1Jhd0Fzc2V0IiwiY3JlYXRlTWFwIiwiaXNTY2VuZSIsImFzc2V0IiwiY29uc3RydWN0b3IiLCJjYyIsIlNjZW5lQXNzZXQiLCJTY2VuZSIsIlJhd0Fzc2V0RW50cnkiLCJ1cmwiLCJ0eXBlIiwiQXNzZXRMaWJyYXJ5IiwibG9hZEFzc2V0IiwidXVpZCIsImNhbGxiYWNrIiwib3B0aW9ucyIsIkVycm9yIiwiaXRlbSIsImV4aXN0aW5nQXNzZXQiLCJsb2FkIiwiZXJyb3IiLCJlcnJvckluZm8iLCJtZXNzYWdlIiwiZXJyb3JNZXNzYWdlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkNDX0VESVRPUiIsInNjZW5lIiwiRWRpdG9yIiwia2V5IiwibG9hZGVyIiwiX2dldFJlZmVyZW5jZUtleSIsImRlcGVuZEFzc2V0cyIsImdldERlcGVuZHNSZWN1cnNpdmVseSIsImlkIiwicmVtb3ZlSXRlbSIsImdldExpYlVybE5vRXh0IiwiaW5SYXdBc3NldHNEaXIiLCJDQ19CVUlMRCIsImJhc2UiLCJzbGljZSIsIl9xdWVyeUFzc2V0SW5mb0luRWRpdG9yIiwiSXBjIiwic2VuZFRvTWFpbiIsImVyciIsImluZm8iLCJVdGlscyIsIlV1aWRDYWNoZSIsImNhY2hlIiwiY3RvciIsImFzc2V0cyIsImlzUmF3QXNzZXQiLCJpc0NoaWxkQ2xhc3NPZiIsImVycm9yQ29kZSIsIl9nZXRBc3NldEluZm9JblJ1bnRpbWUiLCJyZXN1bHQiLCJyYXciLCJfdXVpZEluU2V0dGluZ3MiLCJxdWVyeUFzc2V0SW5mbyIsIkNDX1RFU1QiLCJwYXJzZVV1aWRJbkVkaXRvciIsImlzSW1wb3J0ZWQiLCJzdGFydHNXaXRoIiwiZGlyIiwicGF0aCIsImRpcm5hbWUiLCJkaXJCYXNlbmFtZSIsImJhc2VuYW1lIiwiaXNBc3NldFVybCIsImxlbmd0aCIsImluZGV4IiwiaW5kZXhPZiIsImxvYWRKc29uIiwianNvbiIsInJhbmRvbVV1aWQiLCJEYXRlIiwiZ2V0VGltZSIsIk1hdGgiLCJyYW5kb20iLCJjb250ZW50Iiwic2tpcHMiLCJhc3NldExvYWRlciIsImRvd25sb2FkZXIiLCJfdXVpZCIsImdldEFzc2V0QnlVdWlkIiwiX3V1aWRUb0Fzc2V0IiwiaW5pdCIsImVycm9ySUQiLCJsaWJyYXJ5UGF0aCIsInJlcGxhY2UiLCJzdHJpcFNlcCIsInJhd0Fzc2V0c0Jhc2UiLCJzdWJwYWNrYWdlcyIsInN1YlBhY2tQaXBlIiwiaW5zZXJ0UGlwZUFmdGVyIiwibWQ1QXNzZXRzTWFwIiwiaSIsIm1kNUltcG9ydE1hcCIsIm1kNUVudHJpZXMiLCJtZDVSYXdBc3NldHNNYXAiLCJtZDVQaXBlIiwiYXNzZXRUYWJsZXMiLCJfYXNzZXRUYWJsZXMiLCJtb3VudCIsInJlc2V0IiwicmF3QXNzZXRzIiwibW91bnRQb2ludCIsInR5cGVJZCIsIl9nZXRDbGFzc0J5SWQiLCJleHQiLCJleHRuYW1lIiwiaXNTdWJBc3NldCIsImFkZCIsInBhY2tlZEFzc2V0cyIsImluaXRQYWNrcyIsIl9pbml0IiwibW91bnRQYXRocyIsIl9idWlsdGlucyIsImVmZmVjdCIsIm1hdGVyaWFsIiwiX2J1aWx0aW5EZXBzIiwibG9hZEJ1aWx0aW5zIiwibmFtZSIsImNiIiwiYnVpbHRpbiIsImludGVybmFsTW91bnRQYXRoIiwiQ0NfUFJFVklFVyIsIkNDX0pTQiIsImxvYWRSZXNEaXIiLCJkZXBzIiwiZm9yRWFjaCIsIl9sb2FkQnVpbHRpbnMiLCJnYW1lIiwicmVuZGVyVHlwZSIsIlJFTkRFUl9UWVBFX0NBTlZBUyIsIkVmZmVjdEFzc2V0IiwiTWF0ZXJpYWwiLCJnZXRCdWlsdGluIiwiZ2V0QnVpbHRpbnMiLCJyZXNldEJ1aWx0aW5zIiwiZ2V0QnVpbHRpbkRlcHMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCRCxJQUFJQSxLQUFLLEdBQUdDLE9BQU8sQ0FBQyxtQkFBRCxDQUFuQjs7QUFDQSxJQUFJQyxjQUFjLEdBQUdELE9BQU8sQ0FBQyxTQUFELENBQVAsQ0FBbUJDLGNBQXhDOztBQUNBLElBQUlDLE1BQU0sR0FBR0YsT0FBTyxDQUFDLDJCQUFELENBQXBCOztBQUNBLElBQUlHLFVBQVUsR0FBR0gsT0FBTyxDQUFDLDhCQUFELENBQXhCOztBQUNBLElBQUlJLGNBQWMsR0FBR0osT0FBTyxDQUFDLGtDQUFELENBQTVCOztBQUNBLElBQUlLLGdCQUFnQixHQUFHTCxPQUFPLENBQUMscUNBQUQsQ0FBOUI7O0FBQ0EsSUFBSU0sVUFBVSxHQUFHTixPQUFPLENBQUMsc0JBQUQsQ0FBeEI7O0FBQ0EsSUFBSU8sT0FBTyxHQUFHUCxPQUFPLENBQUMsMkJBQUQsQ0FBckI7O0FBQ0EsSUFBSVEsV0FBVyxHQUFHUixPQUFPLENBQUMsa0NBQUQsQ0FBekI7O0FBQ0EsSUFBSVMsRUFBRSxHQUFHVCxPQUFPLENBQUMsTUFBRCxDQUFoQjtBQUVBOzs7Ozs7QUFPQTs7O0FBRUEsSUFBSVUsWUFBWSxHQUFHLEVBQW5CO0FBQ0EsSUFBSUMsY0FBYyxHQUFHLEVBQXJCLEVBQTZCOztBQUM3QixJQUFJQyxlQUFlLEdBQUdILEVBQUUsQ0FBQ0ksU0FBSCxDQUFhLElBQWIsQ0FBdEI7O0FBRUEsU0FBU0MsT0FBVCxDQUFrQkMsS0FBbEIsRUFBeUI7QUFDckIsU0FBT0EsS0FBSyxLQUFLQSxLQUFLLENBQUNDLFdBQU4sS0FBc0JDLEVBQUUsQ0FBQ0MsVUFBekIsSUFBdUNILEtBQUssWUFBWUUsRUFBRSxDQUFDRSxLQUFoRSxDQUFaO0FBQ0gsRUFFRDs7O0FBRUEsU0FBU0MsYUFBVCxDQUF3QkMsR0FBeEIsRUFB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Q00sWUFBSCxHQUFrQkEsWUFBbkMiLCJzb3VyY2VzQ29udGVudCI6WyLvu78vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbnZhciBBc3NldCA9IHJlcXVpcmUoJy4uL2Fzc2V0cy9DQ0Fzc2V0Jyk7XG52YXIgY2FsbEluTmV4dFRpY2sgPSByZXF1aXJlKCcuL3V0aWxzJykuY2FsbEluTmV4dFRpY2s7XG52YXIgTG9hZGVyID0gcmVxdWlyZSgnLi4vbG9hZC1waXBlbGluZS9DQ0xvYWRlcicpO1xudmFyIEFzc2V0VGFibGUgPSByZXF1aXJlKCcuLi9sb2FkLXBpcGVsaW5lL2Fzc2V0LXRhYmxlJyk7XG52YXIgUGFja0Rvd25sb2FkZXIgPSByZXF1aXJlKCcuLi9sb2FkLXBpcGVsaW5lL3BhY2stZG93bmxvYWRlcicpO1xudmFyIEF1dG9SZWxlYXNlVXRpbHMgPSByZXF1aXJlKCcuLi9sb2FkLXBpcGVsaW5lL2F1dG8tcmVsZWFzZS11dGlscycpO1xudmFyIGRlY29kZVV1aWQgPSByZXF1aXJlKCcuLi91dGlscy9kZWNvZGUtdXVpZCcpO1xudmFyIE1ENVBpcGUgPSByZXF1aXJlKCcuLi9sb2FkLXBpcGVsaW5lL21kNS1waXBlJyk7XG52YXIgU3ViUGFja1BpcGUgPSByZXF1aXJlKCcuLi9sb2FkLXBpcGVsaW5lL3N1YnBhY2thZ2UtcGlwZScpO1xudmFyIGpzID0gcmVxdWlyZSgnLi9qcycpO1xuXG4vKipcbiAqIFRoZSBhc3NldCBsaWJyYXJ5IHdoaWNoIG1hbmFnaW5nIGxvYWRpbmcvdW5sb2FkaW5nIGFzc2V0cyBpbiBwcm9qZWN0LlxuICpcbiAqIEBjbGFzcyBBc3NldExpYnJhcnlcbiAqIEBzdGF0aWNcbiAqL1xuXG4vLyBjb25maWdzXG5cbnZhciBfbGlicmFyeUJhc2UgPSAnJztcbnZhciBfcmF3QXNzZXRzQmFzZSA9ICcnOyAgICAgLy8gVGhlIGJhc2UgZGlyIGZvciByYXcgYXNzZXRzIGluIHJ1bnRpbWVcbnZhciBfdXVpZFRvUmF3QXNzZXQgPSBqcy5jcmVhdGVNYXAodHJ1ZSk7XG5cbmZ1bmN0aW9uIGlzU2NlbmUgKGFzc2V0KSB7XG4gICAgcmV0dXJuIGFzc2V0ICYmIChhc3NldC5jb25zdHJ1Y3RvciA9PT0gY2MuU2NlbmVBc3NldCB8fCBhc3NldCBpbnN0YW5jZW9mIGNjLlNjZW5lKTtcbn1cblxuLy8gdHlwZXNcblxuZnVuY3Rpb24gUmF3QXNzZXRFbnRyeSAodXJsLCB0eXBlKSB7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbn1cblxuLy8gcHVibGljc1xuXG52YXIgQXNzZXRMaWJyYXJ5ID0ge1xuICAgIC8qKlxuICAgICAqIEBjYWxsYmFjayBsb2FkQ2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXJyb3IgLSBudWxsIG9yIHRoZSBlcnJvciBpbmZvXG4gICAgICogQHBhcmFtIHtBc3NldH0gZGF0YSAtIHRoZSBsb2FkZWQgYXNzZXQgb3IgbnVsbFxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBsb2FkQXNzZXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXVpZFxuICAgICAqIEBwYXJhbSB7bG9hZENhbGxiYWNrfSBjYWxsYmFjayAtIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBvbmNlIGxvYWQgZmluaXNoZWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gb3B0aW9ucy5yZWFkTWFpbkNhY2hlIC0gRGVmYXVsdCBpcyB0cnVlLiBJZiBmYWxzZSwgdGhlIGFzc2V0IGFuZCBhbGwgaXRzIGRlcGVuZHMgYXNzZXRzIHdpbGwgcmVsb2FkIGFuZCBjcmVhdGUgbmV3IGluc3RhbmNlcyBmcm9tIGxpYnJhcnkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLndyaXRlTWFpbkNhY2hlIC0gRGVmYXVsdCBpcyB0cnVlLiBJZiB0cnVlLCB0aGUgcmVzdWx0IHdpbGwgY2FjaGUgdG8gQXNzZXRMaWJyYXJ5LCBhbmQgTVVTVCBiZSB1bmxvYWQgYnkgdXNlciBtYW51YWxseS5cbiAgICAgKiBAcGFyYW0ge0Fzc2V0fSBvcHRpb25zLmV4aXN0aW5nQXNzZXQgLSBsb2FkIHRvIGV4aXN0aW5nIGFzc2V0LCB0aGlzIGFyZ3VtZW50IGlzIG9ubHkgYXZhaWxhYmxlIGluIGVkaXRvclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgbG9hZEFzc2V0OiBmdW5jdGlvbiAodXVpZCwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB1dWlkICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxJbk5leHRUaWNrKGNhbGxiYWNrLCBuZXcgRXJyb3IoJ1tBc3NldExpYnJhcnldIHV1aWQgbXVzdCBiZSBzdHJpbmcnKSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdmFyIHJlYWRNYWluQ2FjaGUgPSB0eXBlb2YgKG9wdGlvbnMgJiYgb3B0aW9ucy5yZWFkTWFpbkNhY2hlKSAhPT0gJ3VuZGVmaW5lZCcgPyByZWFkTWFpbkNhY2hlIDogdHJ1ZTtcbiAgICAgICAgLy8gdmFyIHdyaXRlTWFpbkNhY2hlID0gdHlwZW9mIChvcHRpb25zICYmIG9wdGlvbnMud3JpdGVNYWluQ2FjaGUpICE9PSAndW5kZWZpbmVkJyA/IHdyaXRlTWFpbkNhY2hlIDogdHJ1ZTtcbiAgICAgICAgdmFyIGl0ZW0gPSB7XG4gICAgICAgICAgICB1dWlkOiB1dWlkLFxuICAgICAgICAgICAgdHlwZTogJ3V1aWQnXG4gICAgICAgIH07XG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZXhpc3RpbmdBc3NldCkge1xuICAgICAgICAgICAgaXRlbS5leGlzdGluZ0Fzc2V0ID0gb3B0aW9ucy5leGlzdGluZ0Fzc2V0O1xuICAgICAgICB9XG4gICAgICAgIExvYWRlci5sb2FkKGl0ZW0sIGZ1bmN0aW9uIChlcnJvciwgYXNzZXQpIHtcbiAgICAgICAgICAgIGlmIChlcnJvciB8fCAhYXNzZXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3JJbmZvID0gdHlwZW9mIGVycm9yID09PSAnc3RyaW5nJyA/IGVycm9yIDogKGVycm9yID8gKGVycm9yLm1lc3NhZ2UgfHwgZXJyb3IuZXJyb3JNZXNzYWdlIHx8IEpTT04uc3RyaW5naWZ5KGVycm9yKSkgOiAnVW5rbm93biBlcnJvcicpO1xuICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdbQXNzZXRMaWJyYXJ5XSBsb2FkaW5nIEpTT04gb3IgZGVwZW5kZW5jaWVzIGZhaWxlZDonICsgZXJyb3JJbmZvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChhc3NldC5jb25zdHJ1Y3RvciA9PT0gY2MuU2NlbmVBc3NldCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SICYmICFhc3NldC5zY2VuZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgRWRpdG9yLmVycm9yKCdTb3JyeSwgdGhlIHNjZW5lIGRhdGEgb2YgXCIlc1wiIGlzIGNvcnJ1cHRlZCEnLCB1dWlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSBjYy5sb2FkZXIuX2dldFJlZmVyZW5jZUtleSh1dWlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0LnNjZW5lLmRlcGVuZEFzc2V0cyA9IEF1dG9SZWxlYXNlVXRpbHMuZ2V0RGVwZW5kc1JlY3Vyc2l2ZWx5KGtleSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKENDX0VESVRPUiB8fCBpc1NjZW5lKGFzc2V0KSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBjYy5sb2FkZXIuX2dldFJlZmVyZW5jZUtleSh1dWlkKTtcbiAgICAgICAgICAgICAgICAgICAgTG9hZGVyLnJlbW92ZUl0ZW0oaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBhc3NldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXRMaWJVcmxOb0V4dDogZnVuY3Rpb24gKHV1aWQsIGluUmF3QXNzZXRzRGlyKSB7XG4gICAgICAgIGlmIChDQ19CVUlMRCkge1xuICAgICAgICAgICAgdXVpZCA9IGRlY29kZVV1aWQodXVpZCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJhc2UgPSAoQ0NfQlVJTEQgJiYgaW5SYXdBc3NldHNEaXIpID8gKF9yYXdBc3NldHNCYXNlICsgJ2Fzc2V0cy8nKSA6IF9saWJyYXJ5QmFzZTtcbiAgICAgICAgcmV0dXJuIGJhc2UgKyB1dWlkLnNsaWNlKDAsIDIpICsgJy8nICsgdXVpZDtcbiAgICB9LFxuXG4gICAgX3F1ZXJ5QXNzZXRJbmZvSW5FZGl0b3I6IGZ1bmN0aW9uICh1dWlkLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoQ0NfRURJVE9SKSB7XG4gICAgICAgICAgICBFZGl0b3IuSXBjLnNlbmRUb01haW4oJ3NjZW5lOnF1ZXJ5LWFzc2V0LWluZm8tYnktdXVpZCcsIHV1aWQsIGZ1bmN0aW9uIChlcnIsIGluZm8pIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5mbykge1xuICAgICAgICAgICAgICAgICAgICBFZGl0b3IuVXRpbHMuVXVpZENhY2hlLmNhY2hlKGluZm8udXJsLCB1dWlkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN0b3IgPSBFZGl0b3IuYXNzZXRzW2luZm8udHlwZV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXNSYXdBc3NldCA9ICFqcy5pc0NoaWxkQ2xhc3NPZihjdG9yLCBBc3NldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBpbmZvLnVybCwgaXNSYXdBc3NldCwgY3Rvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhuZXcgRXJyb3IoJ0NhbiBub3QgZmluZCBhc3NldCB0eXBlICcgKyBpbmZvLnR5cGUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKCdDYW4gbm90IGdldCBhc3NldCB1cmwgYnkgdXVpZCBcIicgKyB1dWlkICsgJ1wiLCB0aGUgYXNzZXQgbWF5IGJlIGRlbGV0ZWQuJyk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yLmVycm9yQ29kZSA9ICdkYi5OT1RGT1VORCc7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAtMSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldEFzc2V0SW5mb0luUnVudGltZTogZnVuY3Rpb24gKHV1aWQsIHJlc3VsdCkge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQgfHwge3VybDogbnVsbCwgcmF3OiBmYWxzZX07XG4gICAgICAgIHZhciBpbmZvID0gX3V1aWRUb1Jhd0Fzc2V0W3V1aWRdO1xuICAgICAgICBpZiAoaW5mbyAmJiAhanMuaXNDaGlsZENsYXNzT2YoaW5mby50eXBlLCBjYy5Bc3NldCkpIHtcbiAgICAgICAgICAgIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgc2luY2UgMS4xMFxuICAgICAgICAgICAgcmVzdWx0LnVybCA9IF9yYXdBc3NldHNCYXNlICsgaW5mby51cmw7XG4gICAgICAgICAgICByZXN1bHQucmF3ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC51cmwgPSB0aGlzLmdldExpYlVybE5vRXh0KHV1aWQpICsgJy5qc29uJztcbiAgICAgICAgICAgIHJlc3VsdC5yYXcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBfdXVpZEluU2V0dGluZ3M6IGZ1bmN0aW9uICh1dWlkKSB7XG4gICAgICAgIHJldHVybiB1dWlkIGluIF91dWlkVG9SYXdBc3NldDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBxdWVyeUFzc2V0SW5mb1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1dWlkXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBjYWxsYmFjay5lcnJvclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjYWxsYmFjay51cmwgLSB0aGUgdXJsIG9mIHJhdyBhc3NldCBvciBpbXBvcnRlZCBhc3NldFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FsbGJhY2sucmF3IC0gaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGFzc2V0IGlzIHJhdyBhc3NldFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrLmN0b3JJbkVkaXRvciAtIHRoZSBhY3R1YWwgdHlwZSBvZiBhc3NldCwgdXNlZCBpbiBlZGl0b3Igb25seVxuICAgICAqL1xuICAgIHF1ZXJ5QXNzZXRJbmZvOiBmdW5jdGlvbiAodXVpZCwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiAhQ0NfVEVTVCkge1xuICAgICAgICAgICAgdGhpcy5fcXVlcnlBc3NldEluZm9JbkVkaXRvcih1dWlkLCBjYWxsYmFjayk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgaW5mbyA9IHRoaXMuX2dldEFzc2V0SW5mb0luUnVudGltZSh1dWlkKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGluZm8udXJsLCBpbmZvLnJhdyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gcGFyc2UgdXVpZCBvdXQgb2YgdXJsXG4gICAgcGFyc2VVdWlkSW5FZGl0b3I6IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdmFyIHV1aWQgPSAnJztcbiAgICAgICAgICAgIHZhciBpc0ltcG9ydGVkID0gdXJsLnN0YXJ0c1dpdGgoX2xpYnJhcnlCYXNlKTtcbiAgICAgICAgICAgIGlmIChpc0ltcG9ydGVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpciA9IGNjLnBhdGguZGlybmFtZSh1cmwpO1xuICAgICAgICAgICAgICAgIHZhciBkaXJCYXNlbmFtZSA9IGNjLnBhdGguYmFzZW5hbWUoZGlyKTtcblxuICAgICAgICAgICAgICAgIHZhciBpc0Fzc2V0VXJsID0gZGlyQmFzZW5hbWUubGVuZ3RoID09PSAyO1xuICAgICAgICAgICAgICAgIGlmIChpc0Fzc2V0VXJsKSB7XG4gICAgICAgICAgICAgICAgICAgIHV1aWQgPSBjYy5wYXRoLmJhc2VuYW1lKHVybCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHV1aWQuaW5kZXhPZignLicpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1dWlkID0gdXVpZC5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJhdyBmaWxlIHVybFxuICAgICAgICAgICAgICAgICAgICB1dWlkID0gZGlyQmFzZW5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgdXJsIGlzIG5vdCBpbiB0aGUgbGlicmFyeSwganVzdCByZXR1cm4gXCJcIlxuICAgICAgICAgICAgcmV0dXJuIHV1aWQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQG1ldGhvZCBsb2FkSnNvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBqc29uXG4gICAgICogQHBhcmFtIHtsb2FkQ2FsbGJhY2t9IGNhbGxiYWNrXG4gICAgICogQHJldHVybiB7TG9hZGluZ0hhbmRsZX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGxvYWRKc29uOiBmdW5jdGlvbiAoanNvbiwgY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHJhbmRvbVV1aWQgPSAnJyArICgobmV3IERhdGUoKSkuZ2V0VGltZSgpICsgTWF0aC5yYW5kb20oKSk7XG4gICAgICAgIHZhciBpdGVtID0ge1xuICAgICAgICAgICAgdXVpZDogcmFuZG9tVXVpZCxcbiAgICAgICAgICAgIHR5cGU6ICd1dWlkJyxcbiAgICAgICAgICAgIGNvbnRlbnQ6IGpzb24sXG4gICAgICAgICAgICBza2lwczogWyBMb2FkZXIuYXNzZXRMb2FkZXIuaWQsIExvYWRlci5kb3dubG9hZGVyLmlkIF1cbiAgICAgICAgfTtcbiAgICAgICAgTG9hZGVyLmxvYWQoaXRlbSwgZnVuY3Rpb24gKGVycm9yLCBhc3NldCkge1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ1tBc3NldExpYnJhcnldIGxvYWRpbmcgSlNPTiBvciBkZXBlbmRlbmNpZXMgZmFpbGVkOiAnICsgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYXNzZXQuY29uc3RydWN0b3IgPT09IGNjLlNjZW5lQXNzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IGNjLmxvYWRlci5fZ2V0UmVmZXJlbmNlS2V5KHJhbmRvbVV1aWQpO1xuICAgICAgICAgICAgICAgICAgICBhc3NldC5zY2VuZS5kZXBlbmRBc3NldHMgPSBBdXRvUmVsZWFzZVV0aWxzLmdldERlcGVuZHNSZWN1cnNpdmVseShrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SIHx8IGlzU2NlbmUoYXNzZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IGNjLmxvYWRlci5fZ2V0UmVmZXJlbmNlS2V5KHJhbmRvbVV1aWQpO1xuICAgICAgICAgICAgICAgICAgICBMb2FkZXIucmVtb3ZlSXRlbShpZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXNzZXQuX3V1aWQgPSAnJztcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBhc3NldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGV4aXN0cyBhc3NldCBieSB1dWlkLlxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRBc3NldEJ5VXVpZFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1dWlkXG4gICAgICogQHJldHVybiB7QXNzZXR9IC0gdGhlIGV4aXN0aW5nIGFzc2V0LCBpZiBub3QgbG9hZGVkLCBqdXN0IHJldHVybnMgbnVsbC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldEFzc2V0QnlVdWlkOiBmdW5jdGlvbiAodXVpZCkge1xuICAgICAgICByZXR1cm4gQXNzZXRMaWJyYXJ5Ll91dWlkVG9Bc3NldFt1dWlkXSB8fCBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBpbml0IHRoZSBhc3NldCBsaWJyYXJ5XG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGluaXRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmxpYnJhcnlQYXRoIC0g6IO95o6l5pS255qE5Lu75oSP57G75Z6L55qE6Lev5b6E77yM6YCa5bi45Zyo57yW6L6R5Zmo6YeM5L2/55So57ud5a+555qE77yM5Zyo572R6aG16YeM5L2/55So55u45a+555qE44CCXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMubW91bnRQYXRocyAtIG1vdW50IHBvaW50IG9mIGFjdHVhbCB1cmxzIGZvciByYXcgYXNzZXRzIChvbmx5IHVzZWQgaW4gZWRpdG9yKVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5yYXdBc3NldHNdIC0gdXVpZCB0byByYXcgYXNzZXQncyB1cmxzIChvbmx5IHVzZWQgaW4gcnVudGltZSlcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucmF3QXNzZXRzQmFzZV0gLSBiYXNlIG9mIHJhdyBhc3NldCdzIHVybHMgKG9ubHkgdXNlZCBpbiBydW50aW1lKVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wYWNrZWRBc3NldHNdIC0gcGFja2VkIGFzc2V0cyAob25seSB1c2VkIGluIHJ1bnRpbWUpXG4gICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUiAmJiBfbGlicmFyeUJhc2UpIHtcbiAgICAgICAgICAgIGNjLmVycm9ySUQoNjQwMik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIOi/memHjOWwhui3r+W+hOi9rCB1cmzvvIzkuI3kvb/nlKjot6/lvoTnmoTljp/lm6DmmK/mnInnmoQgcnVudGltZSDkuI3og73op6PmnpAgXCJcXFwiIOespuWPt+OAglxuICAgICAgICAvLyDkuI3kvb/nlKggdXJsLmZvcm1hdCDnmoTljp/lm6DmmK8gd2luZG93cyDkuI3mlK/mjIEgZmlsZTovLyDlkowgLy8vIOW8gOWktOeahOWNj+iuru+8jOaJgOS7peWPquiDveeUqCByZXBsYWNlIOaTjeS9nOebtOaOpeaKiui3r+W+hOi9rOaIkCBVUkzjgIJcbiAgICAgICAgdmFyIGxpYnJhcnlQYXRoID0gb3B0aW9ucy5saWJyYXJ5UGF0aDtcbiAgICAgICAgbGlicmFyeVBhdGggPSBsaWJyYXJ5UGF0aC5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG4gICAgICAgIF9saWJyYXJ5QmFzZSA9IGNjLnBhdGguc3RyaXBTZXAobGlicmFyeVBhdGgpICsgJy8nO1xuXG4gICAgICAgIF9yYXdBc3NldHNCYXNlID0gb3B0aW9ucy5yYXdBc3NldHNCYXNlO1xuXG4gICAgICAgIGlmIChvcHRpb25zLnN1YnBhY2thZ2VzKSB7XG4gICAgICAgICAgICB2YXIgc3ViUGFja1BpcGUgPSBuZXcgU3ViUGFja1BpcGUob3B0aW9ucy5zdWJwYWNrYWdlcyk7XG4gICAgICAgICAgICBjYy5sb2FkZXIuaW5zZXJ0UGlwZUFmdGVyKGNjLmxvYWRlci5hc3NldExvYWRlciwgc3ViUGFja1BpcGUpO1xuICAgICAgICAgICAgY2MubG9hZGVyLnN1YlBhY2tQaXBlID0gc3ViUGFja1BpcGU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHZhciBtZDVBc3NldHNNYXAgPSBvcHRpb25zLm1kNUFzc2V0c01hcDtcbiAgICAgICAgaWYgKG1kNUFzc2V0c01hcCAmJiBtZDVBc3NldHNNYXAuaW1wb3J0KSB7XG4gICAgICAgICAgICAvLyBkZWNvZGUgdXVpZFxuICAgICAgICAgICAgdmFyIGkgPSAwLCB1dWlkID0gMDtcbiAgICAgICAgICAgIHZhciBtZDVJbXBvcnRNYXAgPSBqcy5jcmVhdGVNYXAodHJ1ZSk7XG4gICAgICAgICAgICB2YXIgbWQ1RW50cmllcyA9IG1kNUFzc2V0c01hcC5pbXBvcnQ7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWQ1RW50cmllcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHV1aWQgPSBkZWNvZGVVdWlkKG1kNUVudHJpZXNbaV0pO1xuICAgICAgICAgICAgICAgIG1kNUltcG9ydE1hcFt1dWlkXSA9IG1kNUVudHJpZXNbaSArIDFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbWQ1UmF3QXNzZXRzTWFwID0ganMuY3JlYXRlTWFwKHRydWUpO1xuICAgICAgICAgICAgbWQ1RW50cmllcyA9IG1kNUFzc2V0c01hcFsncmF3LWFzc2V0cyddO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG1kNUVudHJpZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICB1dWlkID0gZGVjb2RlVXVpZChtZDVFbnRyaWVzW2ldKTtcbiAgICAgICAgICAgICAgICBtZDVSYXdBc3NldHNNYXBbdXVpZF0gPSBtZDVFbnRyaWVzW2kgKyAxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1kNVBpcGUgPSBuZXcgTUQ1UGlwZShtZDVJbXBvcnRNYXAsIG1kNVJhd0Fzc2V0c01hcCwgX2xpYnJhcnlCYXNlKTtcbiAgICAgICAgICAgIGNjLmxvYWRlci5pbnNlcnRQaXBlQWZ0ZXIoY2MubG9hZGVyLmFzc2V0TG9hZGVyLCBtZDVQaXBlKTtcbiAgICAgICAgICAgIGNjLmxvYWRlci5tZDVQaXBlID0gbWQ1UGlwZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGluaXQgcmF3IGFzc2V0c1xuXG4gICAgICAgIHZhciBhc3NldFRhYmxlcyA9IExvYWRlci5fYXNzZXRUYWJsZXM7XG4gICAgICAgIGZvciAodmFyIG1vdW50IGluIGFzc2V0VGFibGVzKSB7XG4gICAgICAgICAgICBhc3NldFRhYmxlc1ttb3VudF0ucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdmFyIHJhd0Fzc2V0cyA9IG9wdGlvbnMucmF3QXNzZXRzO1xuICAgICAgICBpZiAocmF3QXNzZXRzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBtb3VudFBvaW50IGluIHJhd0Fzc2V0cykge1xuICAgICAgICAgICAgICAgIHZhciBhc3NldHMgPSByYXdBc3NldHNbbW91bnRQb2ludF07XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdXVpZCBpbiBhc3NldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZm8gPSBhc3NldHNbdXVpZF07XG4gICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBpbmZvWzBdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZUlkID0gaW5mb1sxXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBjYy5qcy5fZ2V0Q2xhc3NCeUlkKHR5cGVJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2MuZXJyb3IoJ0Nhbm5vdCBnZXQnLCB0eXBlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eSBzaW5jZSAxLjEwXG4gICAgICAgICAgICAgICAgICAgIF91dWlkVG9SYXdBc3NldFt1dWlkXSA9IG5ldyBSYXdBc3NldEVudHJ5KG1vdW50UG9pbnQgKyAnLycgKyB1cmwsIHR5cGUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpbml0IHJlc291cmNlc1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXh0ID0gY2MucGF0aC5leHRuYW1lKHVybCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyaW0gYmFzZSBkaXIgYW5kIGV4dG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHVybC5zbGljZSgwLCAtIGV4dC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzU3ViQXNzZXQgPSBpbmZvWzJdID09PSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWFzc2V0VGFibGVzW21vdW50UG9pbnRdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NldFRhYmxlc1ttb3VudFBvaW50XSA9IG5ldyBBc3NldFRhYmxlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgICAgICAgICAgYXNzZXRUYWJsZXNbbW91bnRQb2ludF0uYWRkKHVybCwgdXVpZCwgdHlwZSwgIWlzU3ViQXNzZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLnBhY2tlZEFzc2V0cykge1xuICAgICAgICAgICAgUGFja0Rvd25sb2FkZXIuaW5pdFBhY2tzKG9wdGlvbnMucGFja2VkQXNzZXRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGluaXQgY2MudXJsXG4gICAgICAgIGNjLnVybC5faW5pdCgob3B0aW9ucy5tb3VudFBhdGhzICYmIG9wdGlvbnMubW91bnRQYXRocy5hc3NldHMpIHx8IF9yYXdBc3NldHNCYXNlICsgJ2Fzc2V0cycpO1xuICAgIH1cblxufTtcblxuLy8gdW5sb2FkIGFzc2V0IGlmIGl0IGlzIGRlc3RvcnllZFxuXG4vKipcbiAqICEjZW4gQ2FjaGVzIHV1aWQgdG8gYWxsIGxvYWRlZCBhc3NldHMgaW4gc2NlbmVzLlxuICpcbiAqICEjemgg6L+Z6YeM5L+d5a2Y5omA5pyJ5bey57uP5Yqg6L2955qE5Zy65pmv6LWE5rqQ77yM6Ziy5q2i5ZCM5LiA5Liq6LWE5rqQ5Zyo5YaF5a2Y5Lit5Yqg6L295Ye65aSa5Lu95ou36LSd44CCXG4gKlxuICog6L+Z6YeM55So5LiN5LqGV2Vha01hcO+8jOWcqOa1j+iniOWZqOS4reaJgOacieWKoOi9vei/h+eahOi1hOa6kOmDveWPquiDveaJi+W3peiwg+eUqCB1bmxvYWRBc3NldCDph4rmlL7jgIJcbiAqXG4gKiDlj4LogIPvvJpcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1dlYWtNYXBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9Ub29UYWxsTmF0ZS9ub2RlLXdlYWtcbiAqXG4gKiBAcHJvcGVydHkge29iamVjdH0gX3V1aWRUb0Fzc2V0XG4gKiBAcHJpdmF0ZVxuICovXG5Bc3NldExpYnJhcnkuX3V1aWRUb0Fzc2V0ID0ge307XG5cbi8v5pqC5pe25bGP6JS977yM5Zug5Li655uu5YmN5rKh5pyJ57yT5a2Y5Lu75L2VYXNzZXRcbi8vaWYgKENDX0RFViAmJiBBc3NldC5wcm90b3R5cGUuX29uUHJlRGVzdHJveSkge1xuLy8gICAgY2MuZXJyb3IoJ19vblByZURlc3Ryb3kgb2YgQXNzZXQgaGFzIGFscmVhZHkgZGVmaW5lZCcpO1xuLy99XG4vL0Fzc2V0LnByb3RvdHlwZS5fb25QcmVEZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuLy8gICAgaWYgKEFzc2V0TGlicmFyeS5fdXVpZFRvQXNzZXRbdGhpcy5fdXVpZF0gPT09IHRoaXMpIHtcbi8vICAgICAgICBBc3NldExpYnJhcnkudW5sb2FkQXNzZXQodGhpcyk7XG4vLyAgICB9XG4vL307XG5cblxuLy8gVE9ETzogQWRkIEJ1aWx0aW5NYW5hZ2VyIHRvIGhhbmRsZSBidWlsdGluIGxvZ2ljXG5sZXQgX2J1aWx0aW5zID0ge1xuICAgIGVmZmVjdDoge30sXG4gICAgbWF0ZXJpYWw6IHt9XG59O1xuXG5sZXQgX2J1aWx0aW5EZXBzID0ge307XG5cbmZ1bmN0aW9uIGxvYWRCdWlsdGlucyAobmFtZSwgdHlwZSwgY2IpIHtcbiAgICBsZXQgZGlybmFtZSA9IG5hbWUgICsgJ3MnO1xuICAgIGxldCBidWlsdGluID0gX2J1aWx0aW5zW25hbWVdID0ge307XG4gICAgbGV0IGludGVybmFsTW91bnRQYXRoID0gJ2ludGVybmFsJztcbiAgICAvLyBpbnRlcm5hbCBwYXRoIHdpbGwgYmUgY2hhbmdlZCB3aGVuIHJ1biBzaW11bGF0b3JcbiAgICBpZiAoQ0NfUFJFVklFVyAmJiBDQ19KU0IpIHtcbiAgICAgICAgaW50ZXJuYWxNb3VudFBhdGggPSAndGVtcC9pbnRlcm5hbCc7XG4gICAgfVxuICAgIGNjLmxvYWRlci5sb2FkUmVzRGlyKGRpcm5hbWUsIHR5cGUsIGludGVybmFsTW91bnRQYXRoLCAoKSA9PiB7IH0sIChlcnIsIGFzc2V0cykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjYy5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhc3NldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYXNzZXQgPSBhc3NldHNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGRlcHMgPSBjYy5sb2FkZXIuZ2V0RGVwZW5kc1JlY3Vyc2l2ZWx5KGFzc2V0KTtcbiAgICAgICAgICAgICAgICBkZXBzLmZvckVhY2godXVpZCA9PiBfYnVpbHRpbkRlcHNbdXVpZF0gPSB0cnVlKTtcbiAgICAgICAgICAgICAgICBidWlsdGluW2Ake2Fzc2V0Lm5hbWV9YF0gPSBhc3NldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNiKCk7XG4gICAgfSk7XG59XG5cbkFzc2V0TGlicmFyeS5fbG9hZEJ1aWx0aW5zID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgaWYgKGNjLmdhbWUucmVuZGVyVHlwZSA9PT0gY2MuZ2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcbiAgICAgICAgcmV0dXJuIGNiICYmIGNiKCk7XG4gICAgfVxuXG4gICAgbG9hZEJ1aWx0aW5zKCdlZmZlY3QnLCBjYy5FZmZlY3RBc3NldCwgKCkgPT4ge1xuICAgICAgICBsb2FkQnVpbHRpbnMoJ21hdGVyaWFsJywgY2MuTWF0ZXJpYWwsIGNiKTtcbiAgICB9KTtcbn07XG5cbkFzc2V0TGlicmFyeS5nZXRCdWlsdGluID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUpIHtcbiAgICByZXR1cm4gX2J1aWx0aW5zW3R5cGVdW25hbWVdO1xufTtcblxuQXNzZXRMaWJyYXJ5LmdldEJ1aWx0aW5zID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBpZiAoIXR5cGUpIHJldHVybiBfYnVpbHRpbnM7XG4gICAgcmV0dXJuIF9idWlsdGluc1t0eXBlXTtcbn07XG5Bc3NldExpYnJhcnkucmVzZXRCdWlsdGlucyA9IGZ1bmN0aW9uICgpIHtcbiAgICBfYnVpbHRpbnMgPSB7XG4gICAgICAgIGVmZmVjdDoge30sXG4gICAgICAgIG1hdGVyaWFsOiB7fVxuICAgIH07XG4gICAgX2J1aWx0aW5EZXBzID0ge307XG59O1xuQXNzZXRMaWJyYXJ5LmdldEJ1aWx0aW5EZXBzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBfYnVpbHRpbkRlcHM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2MuQXNzZXRMaWJyYXJ5ID0gQXNzZXRMaWJyYXJ5O1xuIl19