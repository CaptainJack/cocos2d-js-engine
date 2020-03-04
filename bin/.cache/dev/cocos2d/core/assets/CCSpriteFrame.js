
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/core/assets/CCSpriteFrame.js';
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
var EventTarget = require("../event/event-target");

var textureUtil = require('../utils/texture-util');

var INSET_LEFT = 0;
var INSET_TOP = 1;
var INSET_RIGHT = 2;
var INSET_BOTTOM = 3;
var temp_uvs = [{
  u: 0,
  v: 0
}, {
  u: 0,
  v: 0
}, {
  u: 0,
  v: 0
}, {
  u: 0,
  v: 0
}];
/**
 * !#en
 * A cc.SpriteFrame has:<br/>
 *  - texture: A cc.Texture2D that will be used by render components<br/>
 *  - rectangle: A rectangle of the texture
 *
 * !#zh
 * 一个 SpriteFrame 包含：<br/>
 *  - 纹理：会被渲染组件使用的 Texture2D 对象。<br/>
 *  - 矩形：在纹理中的矩形区域。
 *
 * @class SpriteFrame
 * @extends Asset
 * @uses EventTarget
 * @example
 * // load a cc.SpriteFrame with image path (Recommend)
 * var self = this;
 * var url = "test assets/PurpleMonster";
 * cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
 *  var node = new cc.Node("New Sprite");
 *  var sprite = node.addComponent(cc.Sprite);
 *  sprite.spriteFrame = spriteFrame;
 *  node.parent = self.node
 * });
 */

var SpriteFrame = cc.Class(
/** @lends cc.SpriteFrame# */
{
  name: 'cc.SpriteFrame',
  "extends": require('../assets/CCAsset'),
  mixins: [EventTarget],
  properties: {
    // Use this property to set texture when loading dependency
    _textureSetter: {
      set: function set(texture) {
        if (texture) {
          if (CC_EDITOR && Editor.isBuilder) {
            // just building
            this._texture = texture;
            return;
          }

          if (this._texture !== texture) {
            this._refreshTexture(texture);
          }

          this._textureFilename = texture.url;
        }
      }
    },
    // _textureFilename: {
    //     get () {
    //         return (this._texture && this._texture.url) || "";
    //     },
    //     set (url) {
    //         let texture = cc.textureCache.addImage(url);
    //         this._refreshTexture(texture);
    //     }
    // },

    /**
     * !#en Top border of the sprite
     * !#zh sprite 的顶部边框
     * @property insetTop
     * @type {Number}
     * @default 0
     */
    insetTop: {
      get: function get() {
        return this._capInsets[INSET_TOP];
      },
      set: function set(value) {
        this._capInsets[INSET_TOP] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    },

    /**
     * !#en Bottom border of the sprite
     * !#zh sprite 的底部边框
     * @property insetBottom
     * @type {Number}
     * @default 0
     */
    insetBottom: {
      get: function get() {
        return this._capInsets[INSET_BOTTOM];
      },
      set: function set(value) {
        this._capInsets[INSET_BOTTOM] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    },

    /**
     * !#en Left border of the sprite
     * !#zh sprite 的左边边框
     * @property insetLeft
     * @type {Number}
     * @default 0
     */
    insetLeft: {
      get: function get() {
        return this._capInsets[INSET_LEFT];
      },
      set: function set(value) {
        this._capInsets[INSET_LEFT] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    },

    /**
     * !#en Right border of the sprite
     * !#zh sprite 的左边边框
     * @property insetRight
     * @type {Number}
     * @default 0
     */
    insetRight: {
      get: function get() {
        return this._capInsets[INSET_RIGHT];
      },
      set: function set(value) {
        this._capInsets[INSET_RIGHT] = value;

        if (this._texture) {
          this._calculateSlicedUV();
        }
      }
    }
  },

  /**
   * !#en
   * Constructor of SpriteFrame class.
   * !#zh
   * SpriteFrame 类的构造函数。
   * @method constructor
   * @param {String|Texture2D} [filename]
   * @param {Rect} [rect]
   * @param {Boolean} [rotated] - Whether the frame is rotated in the texture
   * @param {Vec2} [offset] - The offset of the frame in the texture
   * @param {Size} [originalSize] - The size of the frame in the texture
   */
  ctor: function ctor() {
    // Init EventTarget data
    EventTarget.call(this);
    var filename = arguments[0];
    var rect = arguments[1];
    var rotated = arguments[2];
    var offset = arguments[3];
    var originalSize = arguments[4]; // the location of the sprite on rendering texture

    this._rect = null; // uv data of frame

    this.uv = []; // texture of frame

    this._texture = null; // store original info before packed to dynamic atlas

    this._original = null; // for trimming

    this._offset = null; // for trimming

    this._originalSize = null;
    this._rotated = false;
    this._flipX = false;
    this._flipY = false;
    this.vertices = null;
    this._capInsets = [0, 0, 0, 0];
    this.uvSliced = [];
    this._textureFilename = '';

    if (CC_EDITOR) {
      // Atlas asset uuid
      this._atlasUuid = '';
    }

    if (filename !== undefined) {
      this.setTexture(filename, rect, rotated, offset, originalSize);
    } else {//todo log Error
    }
  },

  /**
   * !#en Returns whether the texture have been loaded
   * !#zh 返回是否已加载纹理
   * @method textureLoaded
   * @returns {boolean}
   */
  textureLoaded: function textureLoaded() {
    return this._texture && this._texture.loaded;
  },
  onTextureLoaded: function onTextureLoaded(callback, target) {
    if (this.textureLoaded()) {
      callback.call(target);
    } else {
      this.once('load', callback, target);
      this.ensureLoadTexture();
      return false;
    }

    return true;
  },

  /**
   * !#en Returns whether the sprite frame is rotated in the texture.
   * !#zh 获取 SpriteFrame 是否旋转
   * @method isRotated
   * @return {Boolean}
   */
  isRotated: function isRotated() {
    return this._rotated;
  },

  /**
   * !#en Set whether the sprite frame is rotated in the texture.
   * !#zh 设置 SpriteFrame 是否旋转
   * @method setRotated
   * @param {Boolean} bRotated
   */
  setRotated: function setRotated(bRotated) {
    this._rotated = bRotated;
    if (this._texture) this._calculateUV();
  },

  /**
   * !#en Returns whether the sprite frame is flip x axis in the texture.
   * !#zh 获取 SpriteFrame 是否反转 x 轴
   * @method isFlipX
   * @return {Boolean}
   */
  isFlipX: function isFlipX() {
    return this._flipX;
  },

  /**
   * !#en Returns whether the sprite frame is flip y axis in the texture.
   * !#zh 获取 SpriteFrame 是否反转 y 轴
   * @method isFlipY
   * @return {Boolean}
   */
  isFlipY: function isFlipY() {
    return this._flipY;
  },

  /**
   * !#en Set whether the sprite frame is flip x axis in the texture.
   * !#zh 设置 SpriteFrame 是否翻转 x 轴
   * @method setFlipX
   * @param {Boolean} flipX
   */
  setFlipX: function setFlipX(flipX) {
    this._flipX = flipX;

    if (this._texture) {
      this._calculateUV();
    }
  },

  /**
   * !#en Set whether the sprite frame is flip y axis in the texture.
   * !#zh 设置 SpriteFrame 是否翻转 y 轴
   * @method setFlipY
   * @param {Boolean} flipY
   */
  setFlipY: function setFlipY(flipY) {
    this._flipY = flipY;

    if (this._texture) {
      this._calculateUV();
    }
  },

  /**
   * !#en Returns the rect of the sprite frame in the texture.
   * !#zh 获取 SpriteFrame 的纹理矩形区域
   * @method getRect
   * @return {Rect}
   */
  getRect: function getRect() {
    return cc.rect(this._rect);
  },

  /**
   * !#en Sets the rect of the sprite frame in the texture.
   * !#zh 设置 SpriteFrame 的纹理矩形区域
   * @method setRect
   * @param {Rect} rect
   */
  setRect: function setRect(rect) {
    this._rect = rect;
    if (this._texture) this._calculateUV();
  },

  /**
   * !#en Returns the original size of the trimmed image.
   * !#zh 获取修剪前的原始大小
   * @method getOriginalSize
   * @return {Size}
   */
  getOriginalSize: function getOriginalSize() {
    return cc.size(this._originalSize);
  },

  /**
   * !#en Sets the original size of the trimmed image.
   * !#zh 设置修剪前的原始大小
   * @method setOriginalSize
   * @param {Size} size
   */
  setOriginalSize: function setOriginalSize(size) {
    if (!this._originalSize) {
      this._originalSize = cc.size(size);
    } else {
      this._originalSize.width = size.width;
      this._originalSize.height = size.height;
    }
  },

  /**
   * !#en Returns the texture of the frame.
   * !#zh 获取使用的纹理实例
   * @method getTexture
   * @return {Texture2D}
   */
  getTexture: function getTexture() {
    return this._texture;
  },
  _textureLoadedCallback: function _textureLoadedCallback() {
    var self = this;
    var texture = this._texture;

    if (!texture) {
      // clearTexture called while loading texture...
      return;
    }

    var w = texture.width,
        h = texture.height;

    if (self._rect) {
      self._checkRect(self._texture);
    } else {
      self._rect = cc.rect(0, 0, w, h);
    }

    if (!self._originalSize) {
      self.setOriginalSize(cc.size(w, h));
    }

    if (!self._offset) {
      self.setOffset(cc.v2(0, 0));
    }

    self._calculateUV(); // dispatch 'load' event of cc.SpriteFrame


    self.emit("load");
  },

  /*
   * !#en Sets the texture of the frame.
   * !#zh 设置使用的纹理实例。
   * @method _refreshTexture
   * @param {Texture2D} texture
   */
  _refreshTexture: function _refreshTexture(texture) {
    this._texture = texture;

    if (texture.loaded) {
      this._textureLoadedCallback();
    } else {
      texture.once('load', this._textureLoadedCallback, this);
    }
  },

  /**
   * !#en Returns the offset of the frame in the texture.
   * !#zh 获取偏移量
   * @method getOffset
   * @return {Vec2}
   */
  getOffset: function getOffset() {
    return cc.v2(this._offset);
  },

  /**
   * !#en Sets the offset of the frame in the texture.
   * !#zh 设置偏移量
   * @method setOffset
   * @param {Vec2} offsets
   */
  setOffset: function setOffset(offsets) {
    this._offset = cc.v2(offsets);
  },

  /**
   * !#en Clone the sprite frame.
   * !#zh 克隆 SpriteFrame
   * @method clone
   * @return {SpriteFrame}
   */
  clone: function clone() {
    return new SpriteFrame(this._texture || this._textureFilename, this._rect, this._rotated, this._offset, this._originalSize);
  },

  /**
   * !#en Set SpriteFrame with Texture, rect, rotated, offset and originalSize.<br/>
   * !#zh 通过 Texture，rect，rotated，offset 和 originalSize 设置 SpriteFrame。
   * @method setTexture
   * @param {String|Texture2D} textureOrTextureFile
   * @param {Rect} [rect=null]
   * @param {Boolean} [rotated=false]
   * @param {Vec2} [offset=cc.v2(0,0)]
   * @param {Size} [originalSize=rect.size]
   * @return {Boolean}
   */
  setTexture: function setTexture(textureOrTextureFile, rect, rotated, offset, originalSize) {
    if (rect) {
      this._rect = rect;
    } else {
      this._rect = null;
    }

    if (offset) {
      this.setOffset(offset);
    } else {
      this._offset = null;
    }

    if (originalSize) {
      this.setOriginalSize(originalSize);
    } else {
      this._originalSize = null;
    }

    this._rotated = rotated || false; // loading texture

    var texture = textureOrTextureFile;

    if (typeof texture === 'string' && texture) {
      this._textureFilename = texture;

      this._loadTexture();
    }

    if (texture instanceof cc.Texture2D && this._texture !== texture) {
      this._refreshTexture(texture);
    }

    return true;
  },
  _loadTexture: function _loadTexture() {
    if (this._textureFilename) {
      var texture = textureUtil.loadImage(this._textureFilename);

      this._refreshTexture(texture);
    }
  },

  /**
   * !#en If a loading scene (or prefab) is marked as `asyncLoadAssets`, all the textures of the SpriteFrame which
   * associated by user's custom Components in the scene, will not preload automatically.
   * These textures will be load when Sprite component is going to render the SpriteFrames.
   * You can call this method if you want to load the texture early.
   * !#zh 当加载中的场景或 Prefab 被标记为 `asyncLoadAssets` 时，用户在场景中由自定义组件关联到的所有 SpriteFrame 的贴图都不会被提前加载。
   * 只有当 Sprite 组件要渲染这些 SpriteFrame 时，才会检查贴图是否加载。如果你希望加载过程提前，你可以手工调用这个方法。
   *
   * @method ensureLoadTexture
   * @example
   * if (spriteFrame.textureLoaded()) {
   *     this._onSpriteFrameLoaded();
   * }
   * else {
   *     spriteFrame.once('load', this._onSpriteFrameLoaded, this);
   *     spriteFrame.ensureLoadTexture();
   * }
   */
  ensureLoadTexture: function ensureLoadTexture() {
    if (this._texture) {
      if (!this._texture.loaded) {
        // load exists texture
        this._refreshTexture(this._texture);

        textureUtil.postLoadTexture(this._texture);
      }
    } else if (this._textureFilename) {
      // load new texture
      this._loadTexture();
    }
  },

  /**
   * !#en
   * If you do not need to use the SpriteFrame temporarily, you can call this method so that its texture could be garbage collected. Then when you need to render the SpriteFrame, you should call `ensureLoadTexture` manually to reload texture.
   * !#zh
   * 当你暂时不再使用这个 SpriteFrame 时，可以调用这个方法来保证引用的贴图对象能被 GC。然后当你要渲染 SpriteFrame 时，你需要手动调用 `ensureLoadTexture` 来重新加载贴图。
   * @method clearTexture
   * @deprecated since 2.1
   */
  _checkRect: function _checkRect(texture) {
    var rect = this._rect;
    var maxX = rect.x,
        maxY = rect.y;

    if (this._rotated) {
      maxX += rect.height;
      maxY += rect.width;
    } else {
      maxX += rect.width;
      maxY += rect.height;
    }

    if (maxX > texture.width) {
      cc.errorID(3300, texture.url + '/' + this.name, maxX, texture.width);
    }

    if (maxY > texture.height) {
      cc.errorID(3400, texture.url + '/' + this.name, maxY, texture.height);
    }
  },
  _flipXY: function _flipXY(uvs) {
    if (this._flipX) {
      var tempVal = uvs[0];
      uvs[0] = uvs[1];
      uvs[1] = tempVal;
      tempVal = uvs[2];
      uvs[2] = uvs[3];
      uvs[3] = tempVal;
    }

    if (this._flipY) {
      var _tempVal = uvs[0];
      uvs[0] = uvs[2];
      uvs[2] = _tempVal;
      _tempVal = uvs[1];
      uvs[1] = uvs[3];
      uvs[3] = _tempVal;
    }
  },
  _calculateSlicedUV: function _calculateSlicedUV() {
    var rect = this._rect;
    var atlasWidth = this._texture.width;
    var atlasHeight = this._texture.height;
    var leftWidth = this._capInsets[INSET_LEFT];
    var rightWidth = this._capInsets[INSET_RIGHT];
    var centerWidth = rect.width - leftWidth - rightWidth;
    var topHeight = this._capInsets[INSET_TOP];
    var bottomHeight = this._capInsets[INSET_BOTTOM];
    var centerHeight = rect.height - topHeight - bottomHeight;
    var uvSliced = this.uvSliced;
    uvSliced.length = 0;

    if (this._rotated) {
      temp_uvs[0].u = rect.x / atlasWidth;
      temp_uvs[1].u = (rect.x + bottomHeight) / atlasWidth;
      temp_uvs[2].u = (rect.x + bottomHeight + centerHeight) / atlasWidth;
      temp_uvs[3].u = (rect.x + rect.height) / atlasWidth;
      temp_uvs[3].v = rect.y / atlasHeight;
      temp_uvs[2].v = (rect.y + leftWidth) / atlasHeight;
      temp_uvs[1].v = (rect.y + leftWidth + centerWidth) / atlasHeight;
      temp_uvs[0].v = (rect.y + rect.width) / atlasHeight;

      this._flipXY(temp_uvs);

      for (var row = 0; row < 4; ++row) {
        var rowD = temp_uvs[row];

        for (var col = 0; col < 4; ++col) {
          var colD = temp_uvs[3 - col];
          uvSliced.push({
            u: rowD.u,
            v: colD.v
          });
        }
      }
    } else {
      temp_uvs[0].u = rect.x / atlasWidth;
      temp_uvs[1].u = (rect.x + leftWidth) / atlasWidth;
      temp_uvs[2].u = (rect.x + leftWidth + centerWidth) / atlasWidth;
      temp_uvs[3].u = (rect.x + rect.width) / atlasWidth;
      temp_uvs[3].v = rect.y / atlasHeight;
      temp_uvs[2].v = (rect.y + topHeight) / atlasHeight;
      temp_uvs[1].v = (rect.y + topHeight + centerHeight) / atlasHeight;
      temp_uvs[0].v = (rect.y + rect.height) / atlasHeight;

      this._flipXY(temp_uvs);

      for (var _row = 0; _row < 4; ++_row) {
        var _rowD = temp_uvs[_row];

        for (var _col = 0; _col < 4; ++_col) {
          var _colD = temp_uvs[_col];
          uvSliced.push({
            u: _colD.u,
            v: _rowD.v
          });
        }
      }
    }
  },
  _setDynamicAtlasFrame: function _setDynamicAtlasFrame(frame) {
    if (!frame) return;
    this._original = {
      _texture: this._texture,
      _x: this._rect.x,
      _y: this._rect.y
    };
    this._texture = frame.texture;
    this._rect.x = frame.x;
    this._rect.y = frame.y;

    this._calculateUV();
  },
  _resetDynamicAtlasFrame: function _resetDynamicAtlasFrame() {
    if (!this._original) return;
    this._rect.x = this._original._x;
    this._rect.y = this._original._y;
    this._texture = this._original._texture;
    this._original = null;

    this._calculateUV();
  },
  _calculateUV: function _calculateUV() {
    var rect = this._rect,
        texture = this._texture,
        uv = this.uv,
        texw = texture.width,
        texh = texture.height;

    if (this._rotated) {
      var l = texw === 0 ? 0 : rect.x / texw;
      var r = texw === 0 ? 0 : (rect.x + rect.height) / texw;
      var b = texh === 0 ? 0 : (rect.y + rect.width) / texh;
      var t = texh === 0 ? 0 : rect.y / texh;
      uv[0] = l;
      uv[1] = t;
      uv[2] = l;
      uv[3] = b;
      uv[4] = r;
      uv[5] = t;
      uv[6] = r;
      uv[7] = b;
    } else {
      var _l = texw === 0 ? 0 : rect.x / texw;

      var _r = texw === 0 ? 0 : (rect.x + rect.width) / texw;

      var _b = texh === 0 ? 0 : (rect.y + rect.height) / texh;

      var _t = texh === 0 ? 0 : rect.y / texh;

      uv[0] = _l;
      uv[1] = _b;
      uv[2] = _r;
      uv[3] = _b;
      uv[4] = _l;
      uv[5] = _t;
      uv[6] = _r;
      uv[7] = _t;
    }

    if (this._flipX) {
      var tempVal = uv[0];
      uv[0] = uv[2];
      uv[2] = tempVal;
      tempVal = uv[1];
      uv[1] = uv[3];
      uv[3] = tempVal;
      tempVal = uv[4];
      uv[4] = uv[6];
      uv[6] = tempVal;
      tempVal = uv[5];
      uv[5] = uv[7];
      uv[7] = tempVal;
    }

    if (this._flipY) {
      var _tempVal2 = uv[0];
      uv[0] = uv[4];
      uv[4] = _tempVal2;
      _tempVal2 = uv[1];
      uv[1] = uv[5];
      uv[5] = _tempVal2;
      _tempVal2 = uv[2];
      uv[2] = uv[6];
      uv[6] = _tempVal2;
      _tempVal2 = uv[3];
      uv[3] = uv[7];
      uv[7] = _tempVal2;
    }

    var vertices = this.vertices;

    if (vertices) {
      vertices.nu.length = 0;
      vertices.nv.length = 0;

      for (var i = 0; i < vertices.u.length; i++) {
        vertices.nu[i] = vertices.u[i] / texw;
        vertices.nv[i] = vertices.v[i] / texh;
      }
    }

    this._calculateSlicedUV();
  },
  // SERIALIZATION
  _serialize: CC_EDITOR && function (exporting) {
    var rect = this._rect;
    var offset = this._offset;
    var size = this._originalSize;
    var uuid;
    var texture = this._texture;

    if (texture) {
      uuid = texture._uuid;
    }

    if (!uuid) {
      var url = this._textureFilename;

      if (url) {
        uuid = Editor.Utils.UuidCache.urlToUuid(url);
      }
    }

    if (uuid && exporting) {
      uuid = Editor.Utils.UuidUtils.compressUuid(uuid, true);
    }

    var vertices;

    if (this.vertices) {
      vertices = {
        triangles: this.vertices.triangles,
        x: this.vertices.x,
        y: this.vertices.y,
        u: this.vertices.u,
        v: this.vertices.v
      };
    }

    return {
      name: this._name,
      texture: uuid || undefined,
      atlas: exporting ? undefined : this._atlasUuid,
      // strip from json if exporting
      rect: rect ? [rect.x, rect.y, rect.width, rect.height] : undefined,
      offset: offset ? [offset.x, offset.y] : undefined,
      originalSize: size ? [size.width, size.height] : undefined,
      rotated: this._rotated ? 1 : undefined,
      capInsets: this._capInsets,
      vertices: vertices
    };
  },
  _deserialize: function _deserialize(data, handle) {
    var rect = data.rect;

    if (rect) {
      this._rect = new cc.Rect(rect[0], rect[1], rect[2], rect[3]);
    }

    if (data.offset) {
      this.setOffset(new cc.Vec2(data.offset[0], data.offset[1]));
    }

    if (data.originalSize) {
      this.setOriginalSize(new cc.Size(data.originalSize[0], data.originalSize[1]));
    }

    this._rotated = data.rotated === 1;
    this._name = data.name;
    var capInsets = data.capInsets;

    if (capInsets) {
      this._capInsets[INSET_LEFT] = capInsets[INSET_LEFT];
      this._capInsets[INSET_TOP] = capInsets[INSET_TOP];
      this._capInsets[INSET_RIGHT] = capInsets[INSET_RIGHT];
      this._capInsets[INSET_BOTTOM] = capInsets[INSET_BOTTOM];
    }

    if (CC_EDITOR) {
      this._atlasUuid = data.atlas;
    }

    this.vertices = data.vertices;

    if (this.vertices) {
      // initialize normal uv arrays
      this.vertices.nu = [];
      this.vertices.nv = [];
    } // load texture via _textureSetter


    var textureUuid = data.texture;

    if (textureUuid) {
      handle.result.push(this, '_textureSetter', textureUuid);
    }
  }
});
var proto = SpriteFrame.prototype;
proto.copyWithZone = proto.clone;
proto.copy = proto.clone;
proto.initWithTexture = proto.setTexture;
cc.SpriteFrame = SpriteFrame;
module.exports = SpriteFrame;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDU3ByaXRlRnJhbWUuanMiXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJyZXF1aXJlIiwidGV4dHVyZVV0aWwiLCJJTlNFVF9MRUZUIiwiSU5TRVRfVE9QIiwiSU5TRVRfUklHSFQiLCJJTlNFVF9CT1RUT00iLCJ0ZW1wX3V2cyIsInUiLCJ2IiwiU3ByaXRlRnJhbWUiLCJjYyIsIkNsYXNzIiwibmFtZSIsIm1peGlucyIsInByb3BlcnRpZXMiLCJfdGV4dHVyZVNldHRlciIsInNldCIsInRleHR1cmUiLCJDQ19FRElUT1IiLCJFZGl0b3IiLCJpc0J1aWxkZXIiLCJfdGV4dHVyZSIsIl9yZWZyZXNoVGV4dHVyZSIsIl90ZXh0dXJlRmlsZW5hbWUiLCJ1cmwiLCJpbnNldFRvcCIsImdldCIsIl9jYXBJbnNldHMiLCJ2YWx1ZSIsIl9jYWxjdWxhdGVTbGljZWRVViIsImluc2V0Qm90dG9tIiwiaW5zZXRMZWZ0IiwiaW5zZXRSaWdodCIsImN0b3IiLCJjYWxsIiwiZmlsZW5hbWUiLCJhcmd1bWVudHMiLCJyZWN0Iiwicm90YXRlZCIsIm9mZnNldCIsIm9yaWdpbmFsU2l6ZSIsIl9yZWN0IiwidXYiLCJfb3JpZ2luYWwiLCJfb2Zmc2V0IiwiX29yaWdpbmFsU2l6ZSIsIl9yb3RhdGVkIiwiX2ZsaXBYIiwiX2ZsaXBZIiwidmVydGljZXMiLCJ1dlNsaWNlZCIsIl9hdGxhc1V1aWQiLCJ1bmRlZmluZWQiLCJzZXRUZXh0dXJlIiwidGV4dHVyZUxvYWRlZCIsImxvYWRlZCIsIm9uVGV4dHVyZUxvYWRlZCIsImNhbGxiYWNrIiwidGFyZ2V0Iiwib25jZSIsImVuc3VyZUxvYWRUZXh0dXJlIiwiaXNSb3RhdGVkIiwic2V0Um90YXRlZCIsImJSb3RhdGVkIiwiX2NhbGN1bGF0ZVVWIiwiaXNGbGlwWCIsImlzRmxpcFkiLCJzZXRGbGlwWCIsImZsaXBYIiwic2V0RmxpcFkiLCJmbGlwWSIsImdldFJlY3QiLCJzZXRSZWN0IiwiZ2V0T3JpZ2luYWxTaXplIiwic2l6ZSIsInNldE9yaWdpbmFsU2l6ZSIsIndpZHRoIiwiaGVpZ2h0IiwiZ2V0VGV4dHVyZSIsIl90ZXh0dXJlTG9hZGVkQ2FsbGJhY2siLCJzZWxmIiwidyIsImgiLCJfY2hlY2tSZWN0Iiwic2V0T2Zmc2V0IiwidjIiLCJlbWl0IiwiZ2V0T2Zmc2V0Iiwib2Zmc2V0cyIsImNsb25lIiwidGV4dHVyZU9yVGV4dHVyZUZpbGUiLCJfbG9hZFRleHR1cmUiLCJUZXh0dXJlMkQiLCJsb2FkSW1hZ2UiLCJwb3N0TG9hZFRleHR1cmUiLCJtYXhYIiwieCIsIm1heFkiLCJ5IiwiZXJyb3JJRCIsIl9mbGlwWFkiLCJ1dnMiLCJ0ZW1wVmFsIiwiYXRsYXNXaWR0aCIsImF0bGFzSGVpZ2h0IiwibGVmdFdpZHRoIiwicmlnaHRXaWR0aCIsImNlbnRlcldpZHRoIiwidG9wSGVpZ2h0IiwiYm90dG9tSGVpZ2h0IiwiY2VudGVySGVpZ2h0IiwibGVuZ3RoIiwicm93Iiwicm93RCIsImNvbCIsImNvbEQiLCJwdXNoIiwiX3NldER5bmFtaWNBdGxhc0ZyYW1lIiwiZnJhbWUiLCJfeCIsIl95IiwiX3Jlc2V0RHluYW1pY0F0bGFzRnJhbWUiLCJ0ZXh3IiwidGV4aCIsImwiLCJyIiwiYiIsInQiLCJudSIsIm52IiwiaSIsIl9zZXJpYWxpemUiLCJleHBvcnRpbmciLCJ1dWlkIiwiX3V1aWQiLCJVdGlscyIsIlV1aWRDYWNoZSIsInVybFRvVXVpZCIsIlV1aWRVdGlscyIsImNvbXByZXNzVXVpZCIsInRyaWFuZ2xlcyIsIl9uYW1lIiwiYXRsYXMiLCJjYXBJbnNldHMiLCJfZGVzZXJpYWxpemUiLCJkYXRhIiwiaGFuZGxlIiwiUmVjdCIsIlZlYzIiLCJTaXplIiwidGV4dHVyZVV1aWQiLCJyZXN1bHQiLCJwcm90byIsInByb3RvdHlwZSIsImNvcHlXaXRoWm9uZSIsImNvcHkiLCJpbml0V2l0aFRleHR1cmUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUQsQ0FBekM7QUFDSDs7QUFFRCxRQUFJYSxTQUFKLEVBQWU7QUFDWCxXQUFLaUMsVUFBTCxHQUFrQjhGLElBQUksQ0FBQ0gsS0FBdkI7QUFDSDs7QUFFRCxTQUFLN0YsUUFBTCxHQUFnQmdHLElBQUksQ0FBQ2hHLFFBQXJCOztBQUNBLFFBQUksS0FBS0EsUUFBVCxFQUFtQjtBQUNmO0FBQ0EsV0FBS0EsUUFBTCxDQUFjK0UsRUFBZCxHQUFtQixFQUFuQjtBQUNBLFdBQUsvRSxRQUFMLENBQWNnRixFQUFkLEdBQW1CLEVBQW5CO0FBQ0gsS0EvQmlDLENBaUNsQzs7O0FBQ0EsUUFBSXFCLFdBQVcsR0FBR0wsSUFBSSxDQUFDaEksT0FBdkI7O0FBQ0EsUUFBSXFJLFdBQUosRUFBaUI7QUFDYkosTUFBQUEsTUFBTSxDQUFDSyxNQUFQLENBQWNuQyxJQUFkLENBQW1CLElBQW5CLEVBQXlCLGdCQUF6QixFQUEyQ2tDLFdBQTNDO0FBQ0g7QUFDSjtBQWx4Qm1ELENBQXRDLENBQWxCO0FBcXhCQSxJQUFJRSxLQUFLLEdBQUcvSSxXQUFXLENBQUNnSixTQUF4QjtBQUVBRCxLQUFLLENBQUNFLFlBQU4sR0FBcUJGLEtBQUssQ0FBQy9ELEtBQTNCO0FBQ0ErRCxLQUFLLENBQUNHLElBQU4sR0FBYUgsS0FBSyxDQUFDL0QsS0FBbkI7QUFDQStELEtBQUssQ0FBQ0ksZUFBTixHQUF3QkosS0FBSyxDQUFDbkcsVUFBOUI7QUFFQTNDLEVBQUUsQ0FBQ0QsV0FBSCxHQUFpQkEsV0FBakI7QUFFQW9KLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnJKLFdBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiBDb3B5cmlnaHQgKGMpIDIwMDgtMjAxMCBSaWNhcmRvIFF1ZXNhZGFcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxuXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5jb25zdCBFdmVudFRhcmdldCA9IHJlcXVpcmUoXCIuLi9ldmVudC9ldmVudC10YXJnZXRcIik7XG5jb25zdCB0ZXh0dXJlVXRpbCA9IHJlcXVpcmUoJy4uL3V0aWxzL3RleHR1cmUtdXRpbCcpO1xuXG5jb25zdCBJTlNFVF9MRUZUID0gMDtcbmNvbnN0IElOU0VUX1RPUCA9IDE7XG5jb25zdCBJTlNFVF9SSUdIVCA9IDI7XG5jb25zdCBJTlNFVF9CT1RUT00gPSAzO1xuXG5sZXQgdGVtcF91dnMgPSBbe3U6IDAsIHY6IDB9LCB7dTogMCwgdjogMH0sIHt1OiAwLCB2OiAwfSwge3U6IDAsIHY6IDB9XTtcblxuLyoqXG4gKiAhI2VuXG4gKiBBIGNjLlNwcml0ZUZyYW1lIGhhczo8YnIvPlxuICogIC0gdGV4dHVyZTogQSBjYy5UZXh0dXJlMkQgdGhhdCB3aWxsIGJlIHVzZWQgYnkgcmVuZGVyIGNvbXBvbmVudHM8YnIvPlxuICogIC0gcmVjdGFuZ2xlOiBBIHJlY3RhbmdsZSBvZiB0aGUgdGV4dHVyZVxuICpcbiAqICEjemhcbiAqIOS4gOS4qiBTcHJpdGVGcmFtZSDljIXlkKvvvJo8YnIvPlxuICogIC0g57q555CG77ya5Lya6KKr5riy5p+T57uE5Lu25L2/55So55qEIFRleHR1cmUyRCDlr7nosaHjgII8YnIvPlxuICogIC0g55+p5b2i77ya5Zyo57q555CG5Lit55qE55+p5b2i5Yy65Z+f44CCXG4gKlxuICogQGNsYXNzIFNwcml0ZUZyYW1lXG4gKiBAZXh0ZW5kcyBBc3NldFxuICogQHVzZXMgRXZlbnRUYXJnZXRcbiAqIEBleGFtcGxlXG4gKiAvLyBsb2FkIGEgY2MuU3ByaXRlRnJhbWUgd2l0aCBpbWFnZSBwYXRoIChSZWNvbW1lbmQpXG4gKiB2YXIgc2VsZiA9IHRoaXM7XG4gKiB2YXIgdXJsID0gXCJ0ZXN0IGFzc2V0cy9QdXJwbGVNb25zdGVyXCI7XG4gKiBjYy5sb2FkZXIubG9hZFJlcyh1cmwsIGNjLlNwcml0ZUZyYW1lLCBmdW5jdGlvbiAoZXJyLCBzcHJpdGVGcmFtZSkge1xuICogIHZhciBub2RlID0gbmV3IGNjLk5vZGUoXCJOZXcgU3ByaXRlXCIpO1xuICogIHZhciBzcHJpdGUgPSBub2RlLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICogIHNwcml0ZS5zcHJpdGVGcmFtZSA9IHNwcml0ZUZyYW1lO1xuICogIG5vZGUucGFyZW50ID0gc2VsZi5ub2RlXG4gKiB9KTtcbiAqL1xubGV0IFNwcml0ZUZyYW1lID0gY2MuQ2xhc3MoLyoqIEBsZW5kcyBjYy5TcHJpdGVGcmFtZSMgKi97XG4gICAgbmFtZTogJ2NjLlNwcml0ZUZyYW1lJyxcbiAgICBleHRlbmRzOiByZXF1aXJlKCcuLi9hc3NldHMvQ0NBc3NldCcpLFxuICAgIG1peGluczogW0V2ZW50VGFyZ2V0XSxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gVXNlIHRoaXMgcHJvcGVydHkgdG8gc2V0IHRleHR1cmUgd2hlbiBsb2FkaW5nIGRlcGVuZGVuY3lcbiAgICAgICAgX3RleHR1cmVTZXR0ZXI6IHtcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHRleHR1cmUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGV4dHVyZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ0NfRURJVE9SICYmIEVkaXRvci5pc0J1aWxkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGp1c3QgYnVpbGRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3RleHR1cmUgPSB0ZXh0dXJlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0dXJlICE9PSB0ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGV4dHVyZSh0ZXh0dXJlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90ZXh0dXJlRmlsZW5hbWUgPSB0ZXh0dXJlLnVybDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gX3RleHR1cmVGaWxlbmFtZToge1xuICAgICAgICAvLyAgICAgZ2V0ICgpIHtcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gKHRoaXMuX3RleHR1cmUgJiYgdGhpcy5fdGV4dHVyZS51cmwpIHx8IFwiXCI7XG4gICAgICAgIC8vICAgICB9LFxuICAgICAgICAvLyAgICAgc2V0ICh1cmwpIHtcbiAgICAgICAgLy8gICAgICAgICBsZXQgdGV4dHVyZSA9IGNjLnRleHR1cmVDYWNoZS5hZGRJbWFnZSh1cmwpO1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuX3JlZnJlc2hUZXh0dXJlKHRleHR1cmUpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIFRvcCBib3JkZXIgb2YgdGhlIHNwcml0ZVxuICAgICAgICAgKiAhI3poIHNwcml0ZSDnmoTpobbpg6jovrnmoYZcbiAgICAgICAgICogQHByb3BlcnR5IGluc2V0VG9wXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGluc2V0VG9wOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1RPUF07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfVE9QXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNsaWNlZFVWKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIEJvdHRvbSBib3JkZXIgb2YgdGhlIHNwcml0ZVxuICAgICAgICAgKiAhI3poIHNwcml0ZSDnmoTlupXpg6jovrnmoYZcbiAgICAgICAgICogQHByb3BlcnR5IGluc2V0Qm90dG9tXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGluc2V0Qm90dG9tOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0JPVFRPTV07XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYXBJbnNldHNbSU5TRVRfQk9UVE9NXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNsaWNlZFVWKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiAhI2VuIExlZnQgYm9yZGVyIG9mIHRoZSBzcHJpdGVcbiAgICAgICAgICogISN6aCBzcHJpdGUg55qE5bem6L656L655qGGXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpbnNldExlZnRcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICogQGRlZmF1bHQgMFxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXRMZWZ0OiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0xFRlRdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0xFRlRdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlU2xpY2VkVVYoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqICEjZW4gUmlnaHQgYm9yZGVyIG9mIHRoZSBzcHJpdGVcbiAgICAgICAgICogISN6aCBzcHJpdGUg55qE5bem6L656L655qGGXG4gICAgICAgICAqIEBwcm9wZXJ0eSBpbnNldFJpZ2h0XG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqIEBkZWZhdWx0IDBcbiAgICAgICAgICovXG4gICAgICAgIGluc2V0UmlnaHQ6IHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYXBJbnNldHNbSU5TRVRfUklHSFRdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1JJR0hUXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVNsaWNlZFVWKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogQ29uc3RydWN0b3Igb2YgU3ByaXRlRnJhbWUgY2xhc3MuXG4gICAgICogISN6aFxuICAgICAqIFNwcml0ZUZyYW1lIOexu+eahOaehOmAoOWHveaVsOOAglxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xUZXh0dXJlMkR9IFtmaWxlbmFtZV1cbiAgICAgKiBAcGFyYW0ge1JlY3R9IFtyZWN0XVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JvdGF0ZWRdIC0gV2hldGhlciB0aGUgZnJhbWUgaXMgcm90YXRlZCBpbiB0aGUgdGV4dHVyZVxuICAgICAqIEBwYXJhbSB7VmVjMn0gW29mZnNldF0gLSBUaGUgb2Zmc2V0IG9mIHRoZSBmcmFtZSBpbiB0aGUgdGV4dHVyZVxuICAgICAqIEBwYXJhbSB7U2l6ZX0gW29yaWdpbmFsU2l6ZV0gLSBUaGUgc2l6ZSBvZiB0aGUgZnJhbWUgaW4gdGhlIHRleHR1cmVcbiAgICAgKi9cbiAgICBjdG9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEluaXQgRXZlbnRUYXJnZXQgZGF0YVxuICAgICAgICBFdmVudFRhcmdldC5jYWxsKHRoaXMpO1xuXG4gICAgICAgIGxldCBmaWxlbmFtZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgbGV0IHJlY3QgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIGxldCByb3RhdGVkID0gYXJndW1lbnRzWzJdO1xuICAgICAgICBsZXQgb2Zmc2V0ID0gYXJndW1lbnRzWzNdO1xuICAgICAgICBsZXQgb3JpZ2luYWxTaXplID0gYXJndW1lbnRzWzRdO1xuXG4gICAgICAgIC8vIHRoZSBsb2NhdGlvbiBvZiB0aGUgc3ByaXRlIG9uIHJlbmRlcmluZyB0ZXh0dXJlXG4gICAgICAgIHRoaXMuX3JlY3QgPSBudWxsO1xuICAgICAgICAvLyB1diBkYXRhIG9mIGZyYW1lXG4gICAgICAgIHRoaXMudXYgPSBbXTtcbiAgICAgICAgLy8gdGV4dHVyZSBvZiBmcmFtZVxuICAgICAgICB0aGlzLl90ZXh0dXJlID0gbnVsbDtcbiAgICAgICAgLy8gc3RvcmUgb3JpZ2luYWwgaW5mbyBiZWZvcmUgcGFja2VkIHRvIGR5bmFtaWMgYXRsYXNcbiAgICAgICAgdGhpcy5fb3JpZ2luYWwgPSBudWxsO1xuXG4gICAgICAgIC8vIGZvciB0cmltbWluZ1xuICAgICAgICB0aGlzLl9vZmZzZXQgPSBudWxsO1xuXG4gICAgICAgIC8vIGZvciB0cmltbWluZ1xuICAgICAgICB0aGlzLl9vcmlnaW5hbFNpemUgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX3JvdGF0ZWQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9mbGlwWCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9mbGlwWSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMudmVydGljZXMgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX2NhcEluc2V0cyA9IFswLCAwLCAwLCAwXTtcblxuICAgICAgICB0aGlzLnV2U2xpY2VkID0gW107XG5cbiAgICAgICAgdGhpcy5fdGV4dHVyZUZpbGVuYW1lID0gJyc7XG5cbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgLy8gQXRsYXMgYXNzZXQgdXVpZFxuICAgICAgICAgICAgdGhpcy5fYXRsYXNVdWlkID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlsZW5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRUZXh0dXJlKGZpbGVuYW1lLCByZWN0LCByb3RhdGVkLCBvZmZzZXQsIG9yaWdpbmFsU2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL3RvZG8gbG9nIEVycm9yXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHdoZXRoZXIgdGhlIHRleHR1cmUgaGF2ZSBiZWVuIGxvYWRlZFxuICAgICAqICEjemgg6L+U5Zue5piv5ZCm5bey5Yqg6L2957q555CGXG4gICAgICogQG1ldGhvZCB0ZXh0dXJlTG9hZGVkXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGV4dHVyZUxvYWRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZSAmJiB0aGlzLl90ZXh0dXJlLmxvYWRlZDtcbiAgICB9LFxuXG4gICAgb25UZXh0dXJlTG9hZGVkIChjYWxsYmFjaywgdGFyZ2V0KSB7XG4gICAgICAgIGlmICh0aGlzLnRleHR1cmVMb2FkZWQoKSkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vbmNlKCdsb2FkJywgY2FsbGJhY2ssIHRhcmdldCk7XG4gICAgICAgICAgICB0aGlzLmVuc3VyZUxvYWRUZXh0dXJlKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHdoZXRoZXIgdGhlIHNwcml0ZSBmcmFtZSBpcyByb3RhdGVkIGluIHRoZSB0ZXh0dXJlLlxuICAgICAqICEjemgg6I635Y+WIFNwcml0ZUZyYW1lIOaYr+WQpuaXi+i9rFxuICAgICAqIEBtZXRob2QgaXNSb3RhdGVkXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1JvdGF0ZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0ZWQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHdoZXRoZXIgdGhlIHNwcml0ZSBmcmFtZSBpcyByb3RhdGVkIGluIHRoZSB0ZXh0dXJlLlxuICAgICAqICEjemgg6K6+572uIFNwcml0ZUZyYW1lIOaYr+WQpuaXi+i9rFxuICAgICAqIEBtZXRob2Qgc2V0Um90YXRlZFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gYlJvdGF0ZWRcbiAgICAgKi9cbiAgICBzZXRSb3RhdGVkOiBmdW5jdGlvbiAoYlJvdGF0ZWQpIHtcbiAgICAgICAgdGhpcy5fcm90YXRlZCA9IGJSb3RhdGVkO1xuICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSlcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVVWKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB3aGV0aGVyIHRoZSBzcHJpdGUgZnJhbWUgaXMgZmxpcCB4IGF4aXMgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDojrflj5YgU3ByaXRlRnJhbWUg5piv5ZCm5Y+N6L2sIHgg6L20XG4gICAgICogQG1ldGhvZCBpc0ZsaXBYXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0ZsaXBYOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mbGlwWDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHdoZXRoZXIgdGhlIHNwcml0ZSBmcmFtZSBpcyBmbGlwIHkgYXhpcyBpbiB0aGUgdGV4dHVyZS5cbiAgICAgKiAhI3poIOiOt+WPliBTcHJpdGVGcmFtZSDmmK/lkKblj43ovawgeSDovbRcbiAgICAgKiBAbWV0aG9kIGlzRmxpcFlcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIGlzRmxpcFk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZsaXBZO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB3aGV0aGVyIHRoZSBzcHJpdGUgZnJhbWUgaXMgZmxpcCB4IGF4aXMgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDorr7nva4gU3ByaXRlRnJhbWUg5piv5ZCm57+76L2sIHgg6L20XG4gICAgICogQG1ldGhvZCBzZXRGbGlwWFxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZmxpcFhcbiAgICAgKi9cbiAgICBzZXRGbGlwWDogZnVuY3Rpb24gKGZsaXBYKSB7XG4gICAgICAgIHRoaXMuX2ZsaXBYID0gZmxpcFg7XG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVVVigpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHdoZXRoZXIgdGhlIHNwcml0ZSBmcmFtZSBpcyBmbGlwIHkgYXhpcyBpbiB0aGUgdGV4dHVyZS5cbiAgICAgKiAhI3poIOiuvue9riBTcHJpdGVGcmFtZSDmmK/lkKbnv7vovawgeSDovbRcbiAgICAgKiBAbWV0aG9kIHNldEZsaXBZXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBmbGlwWVxuICAgICAqL1xuICAgIHNldEZsaXBZOiBmdW5jdGlvbiAoZmxpcFkpIHtcbiAgICAgICAgdGhpcy5fZmxpcFkgPSBmbGlwWTtcbiAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbGN1bGF0ZVVWKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSByZWN0IG9mIHRoZSBzcHJpdGUgZnJhbWUgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDojrflj5YgU3ByaXRlRnJhbWUg55qE57q555CG55+p5b2i5Yy65Z+fXG4gICAgICogQG1ldGhvZCBnZXRSZWN0XG4gICAgICogQHJldHVybiB7UmVjdH1cbiAgICAgKi9cbiAgICBnZXRSZWN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy5yZWN0KHRoaXMuX3JlY3QpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIHJlY3Qgb2YgdGhlIHNwcml0ZSBmcmFtZSBpbiB0aGUgdGV4dHVyZS5cbiAgICAgKiAhI3poIOiuvue9riBTcHJpdGVGcmFtZSDnmoTnurnnkIbnn6nlvaLljLrln59cbiAgICAgKiBAbWV0aG9kIHNldFJlY3RcbiAgICAgKiBAcGFyYW0ge1JlY3R9IHJlY3RcbiAgICAgKi9cbiAgICBzZXRSZWN0OiBmdW5jdGlvbiAocmVjdCkge1xuICAgICAgICB0aGlzLl9yZWN0ID0gcmVjdDtcbiAgICAgICAgaWYgKHRoaXMuX3RleHR1cmUpXG4gICAgICAgICAgICB0aGlzLl9jYWxjdWxhdGVVVigpO1xuICAgIH0sXG4gICAgXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm5zIHRoZSBvcmlnaW5hbCBzaXplIG9mIHRoZSB0cmltbWVkIGltYWdlLlxuICAgICAqICEjemgg6I635Y+W5L+u5Ymq5YmN55qE5Y6f5aeL5aSn5bCPXG4gICAgICogQG1ldGhvZCBnZXRPcmlnaW5hbFNpemVcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqL1xuICAgIGdldE9yaWdpbmFsU2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2Muc2l6ZSh0aGlzLl9vcmlnaW5hbFNpemUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIG9yaWdpbmFsIHNpemUgb2YgdGhlIHRyaW1tZWQgaW1hZ2UuXG4gICAgICogISN6aCDorr7nva7kv67liarliY3nmoTljp/lp4vlpKflsI9cbiAgICAgKiBAbWV0aG9kIHNldE9yaWdpbmFsU2l6ZVxuICAgICAqIEBwYXJhbSB7U2l6ZX0gc2l6ZVxuICAgICAqL1xuICAgIHNldE9yaWdpbmFsU2l6ZTogZnVuY3Rpb24gKHNpemUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9vcmlnaW5hbFNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuX29yaWdpbmFsU2l6ZSA9IGNjLnNpemUoc2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFNpemUud2lkdGggPSBzaXplLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5fb3JpZ2luYWxTaXplLmhlaWdodCA9IHNpemUuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgdGV4dHVyZSBvZiB0aGUgZnJhbWUuXG4gICAgICogISN6aCDojrflj5bkvb/nlKjnmoTnurnnkIblrp7kvotcbiAgICAgKiBAbWV0aG9kIGdldFRleHR1cmVcbiAgICAgKiBAcmV0dXJuIHtUZXh0dXJlMkR9XG4gICAgICovXG4gICAgZ2V0VGV4dHVyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZTtcbiAgICB9LFxuXG4gICAgX3RleHR1cmVMb2FkZWRDYWxsYmFjayAoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlO1xuICAgICAgICBpZiAoIXRleHR1cmUpIHtcbiAgICAgICAgICAgIC8vIGNsZWFyVGV4dHVyZSBjYWxsZWQgd2hpbGUgbG9hZGluZyB0ZXh0dXJlLi4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHcgPSB0ZXh0dXJlLndpZHRoLCBoID0gdGV4dHVyZS5oZWlnaHQ7XG5cbiAgICAgICAgaWYgKHNlbGYuX3JlY3QpIHtcbiAgICAgICAgICAgIHNlbGYuX2NoZWNrUmVjdChzZWxmLl90ZXh0dXJlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYuX3JlY3QgPSBjYy5yZWN0KDAsIDAsIHcsIGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLl9vcmlnaW5hbFNpemUpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0T3JpZ2luYWxTaXplKGNjLnNpemUodywgaCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFzZWxmLl9vZmZzZXQpIHtcbiAgICAgICAgICAgIHNlbGYuc2V0T2Zmc2V0KGNjLnYyKDAsIDApKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuX2NhbGN1bGF0ZVVWKCk7XG5cbiAgICAgICAgLy8gZGlzcGF0Y2ggJ2xvYWQnIGV2ZW50IG9mIGNjLlNwcml0ZUZyYW1lXG4gICAgICAgIHNlbGYuZW1pdChcImxvYWRcIik7XG4gICAgfSxcblxuICAgIC8qXG4gICAgICogISNlbiBTZXRzIHRoZSB0ZXh0dXJlIG9mIHRoZSBmcmFtZS5cbiAgICAgKiAhI3poIOiuvue9ruS9v+eUqOeahOe6ueeQhuWunuS+i+OAglxuICAgICAqIEBtZXRob2QgX3JlZnJlc2hUZXh0dXJlXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmVcbiAgICAgKi9cbiAgICBfcmVmcmVzaFRleHR1cmU6IGZ1bmN0aW9uICh0ZXh0dXJlKSB7XG4gICAgICAgIHRoaXMuX3RleHR1cmUgPSB0ZXh0dXJlO1xuICAgICAgICBpZiAodGV4dHVyZS5sb2FkZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3RleHR1cmVMb2FkZWRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGV4dHVyZS5vbmNlKCdsb2FkJywgdGhpcy5fdGV4dHVyZUxvYWRlZENhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybnMgdGhlIG9mZnNldCBvZiB0aGUgZnJhbWUgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDojrflj5blgY/np7vph49cbiAgICAgKiBAbWV0aG9kIGdldE9mZnNldFxuICAgICAqIEByZXR1cm4ge1ZlYzJ9XG4gICAgICovXG4gICAgZ2V0T2Zmc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjYy52Mih0aGlzLl9vZmZzZXQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgdGhlIG9mZnNldCBvZiB0aGUgZnJhbWUgaW4gdGhlIHRleHR1cmUuXG4gICAgICogISN6aCDorr7nva7lgY/np7vph49cbiAgICAgKiBAbWV0aG9kIHNldE9mZnNldFxuICAgICAqIEBwYXJhbSB7VmVjMn0gb2Zmc2V0c1xuICAgICAqL1xuICAgIHNldE9mZnNldDogZnVuY3Rpb24gKG9mZnNldHMpIHtcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gY2MudjIob2Zmc2V0cyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQ2xvbmUgdGhlIHNwcml0ZSBmcmFtZS5cbiAgICAgKiAhI3poIOWFi+mahiBTcHJpdGVGcmFtZVxuICAgICAqIEBtZXRob2QgY2xvbmVcbiAgICAgKiBAcmV0dXJuIHtTcHJpdGVGcmFtZX1cbiAgICAgKi9cbiAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNwcml0ZUZyYW1lKHRoaXMuX3RleHR1cmUgfHwgdGhpcy5fdGV4dHVyZUZpbGVuYW1lLCB0aGlzLl9yZWN0LCB0aGlzLl9yb3RhdGVkLCB0aGlzLl9vZmZzZXQsIHRoaXMuX29yaWdpbmFsU2l6ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IFNwcml0ZUZyYW1lIHdpdGggVGV4dHVyZSwgcmVjdCwgcm90YXRlZCwgb2Zmc2V0IGFuZCBvcmlnaW5hbFNpemUuPGJyLz5cbiAgICAgKiAhI3poIOmAmui/hyBUZXh0dXJl77yMcmVjdO+8jHJvdGF0ZWTvvIxvZmZzZXQg5ZKMIG9yaWdpbmFsU2l6ZSDorr7nva4gU3ByaXRlRnJhbWXjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRleHR1cmVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xUZXh0dXJlMkR9IHRleHR1cmVPclRleHR1cmVGaWxlXG4gICAgICogQHBhcmFtIHtSZWN0fSBbcmVjdD1udWxsXVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JvdGF0ZWQ9ZmFsc2VdXG4gICAgICogQHBhcmFtIHtWZWMyfSBbb2Zmc2V0PWNjLnYyKDAsMCldXG4gICAgICogQHBhcmFtIHtTaXplfSBbb3JpZ2luYWxTaXplPXJlY3Quc2l6ZV1cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqL1xuICAgIHNldFRleHR1cmU6IGZ1bmN0aW9uICh0ZXh0dXJlT3JUZXh0dXJlRmlsZSwgcmVjdCwgcm90YXRlZCwgb2Zmc2V0LCBvcmlnaW5hbFNpemUpIHtcbiAgICAgICAgaWYgKHJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlY3QgPSByZWN0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fcmVjdCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob2Zmc2V0KSB7XG4gICAgICAgICAgICB0aGlzLnNldE9mZnNldChvZmZzZXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcmlnaW5hbFNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3JpZ2luYWxTaXplKG9yaWdpbmFsU2l6ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9vcmlnaW5hbFNpemUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcm90YXRlZCA9IHJvdGF0ZWQgfHwgZmFsc2U7XG5cbiAgICAgICAgLy8gbG9hZGluZyB0ZXh0dXJlXG4gICAgICAgIGxldCB0ZXh0dXJlID0gdGV4dHVyZU9yVGV4dHVyZUZpbGU7XG4gICAgICAgIGlmICh0eXBlb2YgdGV4dHVyZSA9PT0gJ3N0cmluZycgJiYgdGV4dHVyZSkge1xuICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUZpbGVuYW1lID0gdGV4dHVyZTtcbiAgICAgICAgICAgIHRoaXMuX2xvYWRUZXh0dXJlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRleHR1cmUgaW5zdGFuY2VvZiBjYy5UZXh0dXJlMkQgJiYgdGhpcy5fdGV4dHVyZSAhPT0gdGV4dHVyZSkge1xuICAgICAgICAgICAgdGhpcy5fcmVmcmVzaFRleHR1cmUodGV4dHVyZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX2xvYWRUZXh0dXJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlRmlsZW5hbWUpIHtcbiAgICAgICAgICAgIGxldCB0ZXh0dXJlID0gdGV4dHVyZVV0aWwubG9hZEltYWdlKHRoaXMuX3RleHR1cmVGaWxlbmFtZSk7XG4gICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGV4dHVyZSh0ZXh0dXJlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIElmIGEgbG9hZGluZyBzY2VuZSAob3IgcHJlZmFiKSBpcyBtYXJrZWQgYXMgYGFzeW5jTG9hZEFzc2V0c2AsIGFsbCB0aGUgdGV4dHVyZXMgb2YgdGhlIFNwcml0ZUZyYW1lIHdoaWNoXG4gICAgICogYXNzb2NpYXRlZCBieSB1c2VyJ3MgY3VzdG9tIENvbXBvbmVudHMgaW4gdGhlIHNjZW5lLCB3aWxsIG5vdCBwcmVsb2FkIGF1dG9tYXRpY2FsbHkuXG4gICAgICogVGhlc2UgdGV4dHVyZXMgd2lsbCBiZSBsb2FkIHdoZW4gU3ByaXRlIGNvbXBvbmVudCBpcyBnb2luZyB0byByZW5kZXIgdGhlIFNwcml0ZUZyYW1lcy5cbiAgICAgKiBZb3UgY2FuIGNhbGwgdGhpcyBtZXRob2QgaWYgeW91IHdhbnQgdG8gbG9hZCB0aGUgdGV4dHVyZSBlYXJseS5cbiAgICAgKiAhI3poIOW9k+WKoOi9veS4reeahOWcuuaZr+aIliBQcmVmYWIg6KKr5qCH6K6w5Li6IGBhc3luY0xvYWRBc3NldHNgIOaXtu+8jOeUqOaIt+WcqOWcuuaZr+S4reeUseiHquWumuS5iee7hOS7tuWFs+iBlOWIsOeahOaJgOaciSBTcHJpdGVGcmFtZSDnmoTotLTlm77pg73kuI3kvJrooqvmj5DliY3liqDovb3jgIJcbiAgICAgKiDlj6rmnInlvZMgU3ByaXRlIOe7hOS7tuimgea4suafk+i/meS6myBTcHJpdGVGcmFtZSDml7bvvIzmiY3kvJrmo4Dmn6XotLTlm77mmK/lkKbliqDovb3jgILlpoLmnpzkvaDluIzmnJvliqDovb3ov4fnqIvmj5DliY3vvIzkvaDlj6/ku6XmiYvlt6XosIPnlKjov5nkuKrmlrnms5XjgIJcbiAgICAgKlxuICAgICAqIEBtZXRob2QgZW5zdXJlTG9hZFRleHR1cmVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGlmIChzcHJpdGVGcmFtZS50ZXh0dXJlTG9hZGVkKCkpIHtcbiAgICAgKiAgICAgdGhpcy5fb25TcHJpdGVGcmFtZUxvYWRlZCgpO1xuICAgICAqIH1cbiAgICAgKiBlbHNlIHtcbiAgICAgKiAgICAgc3ByaXRlRnJhbWUub25jZSgnbG9hZCcsIHRoaXMuX29uU3ByaXRlRnJhbWVMb2FkZWQsIHRoaXMpO1xuICAgICAqICAgICBzcHJpdGVGcmFtZS5lbnN1cmVMb2FkVGV4dHVyZSgpO1xuICAgICAqIH1cbiAgICAgKi9cbiAgICBlbnN1cmVMb2FkVGV4dHVyZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fdGV4dHVyZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl90ZXh0dXJlLmxvYWRlZCkge1xuICAgICAgICAgICAgICAgIC8vIGxvYWQgZXhpc3RzIHRleHR1cmVcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGV4dHVyZSh0aGlzLl90ZXh0dXJlKTtcbiAgICAgICAgICAgICAgICB0ZXh0dXJlVXRpbC5wb3N0TG9hZFRleHR1cmUodGhpcy5fdGV4dHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fdGV4dHVyZUZpbGVuYW1lKSB7XG4gICAgICAgICAgICAvLyBsb2FkIG5ldyB0ZXh0dXJlXG4gICAgICAgICAgICB0aGlzLl9sb2FkVGV4dHVyZSgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW5cbiAgICAgKiBJZiB5b3UgZG8gbm90IG5lZWQgdG8gdXNlIHRoZSBTcHJpdGVGcmFtZSB0ZW1wb3JhcmlseSwgeW91IGNhbiBjYWxsIHRoaXMgbWV0aG9kIHNvIHRoYXQgaXRzIHRleHR1cmUgY291bGQgYmUgZ2FyYmFnZSBjb2xsZWN0ZWQuIFRoZW4gd2hlbiB5b3UgbmVlZCB0byByZW5kZXIgdGhlIFNwcml0ZUZyYW1lLCB5b3Ugc2hvdWxkIGNhbGwgYGVuc3VyZUxvYWRUZXh0dXJlYCBtYW51YWxseSB0byByZWxvYWQgdGV4dHVyZS5cbiAgICAgKiAhI3poXG4gICAgICog5b2T5L2g5pqC5pe25LiN5YaN5L2/55So6L+Z5LiqIFNwcml0ZUZyYW1lIOaXtu+8jOWPr+S7peiwg+eUqOi/meS4quaWueazleadpeS/neivgeW8leeUqOeahOi0tOWbvuWvueixoeiDveiiqyBHQ+OAgueEtuWQjuW9k+S9oOimgea4suafkyBTcHJpdGVGcmFtZSDml7bvvIzkvaDpnIDopoHmiYvliqjosIPnlKggYGVuc3VyZUxvYWRUZXh0dXJlYCDmnaXph43mlrDliqDovb3otLTlm77jgIJcbiAgICAgKiBAbWV0aG9kIGNsZWFyVGV4dHVyZVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIDIuMVxuICAgICAqL1xuXG4gICAgX2NoZWNrUmVjdDogZnVuY3Rpb24gKHRleHR1cmUpIHtcbiAgICAgICAgbGV0IHJlY3QgPSB0aGlzLl9yZWN0O1xuICAgICAgICBsZXQgbWF4WCA9IHJlY3QueCwgbWF4WSA9IHJlY3QueTtcbiAgICAgICAgaWYgKHRoaXMuX3JvdGF0ZWQpIHtcbiAgICAgICAgICAgIG1heFggKz0gcmVjdC5oZWlnaHQ7XG4gICAgICAgICAgICBtYXhZICs9IHJlY3Qud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtYXhYICs9IHJlY3Qud2lkdGg7XG4gICAgICAgICAgICBtYXhZICs9IHJlY3QuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXhYID4gdGV4dHVyZS53aWR0aCkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzMzAwLCB0ZXh0dXJlLnVybCArICcvJyArIHRoaXMubmFtZSwgbWF4WCwgdGV4dHVyZS53aWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1heFkgPiB0ZXh0dXJlLmhlaWdodCkge1xuICAgICAgICAgICAgY2MuZXJyb3JJRCgzNDAwLCB0ZXh0dXJlLnVybCArICcvJyArIHRoaXMubmFtZSwgbWF4WSwgdGV4dHVyZS5oZWlnaHQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9mbGlwWFkgKHV2cykge1xuICAgICAgICBpZiAodGhpcy5fZmxpcFgpIHtcbiAgICAgICAgICAgIGxldCB0ZW1wVmFsID0gdXZzWzBdO1xuICAgICAgICAgICAgdXZzWzBdID0gdXZzWzFdO1xuICAgICAgICAgICAgdXZzWzFdID0gdGVtcFZhbDtcblxuICAgICAgICAgICAgdGVtcFZhbCA9IHV2c1syXTtcbiAgICAgICAgICAgIHV2c1syXSA9IHV2c1szXTtcbiAgICAgICAgICAgIHV2c1szXSA9IHRlbXBWYWw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fZmxpcFkpIHtcbiAgICAgICAgICAgIGxldCB0ZW1wVmFsID0gdXZzWzBdO1xuICAgICAgICAgICAgdXZzWzBdID0gdXZzWzJdO1xuICAgICAgICAgICAgdXZzWzJdID0gdGVtcFZhbDtcblxuICAgICAgICAgICAgdGVtcFZhbCA9IHV2c1sxXTtcbiAgICAgICAgICAgIHV2c1sxXSA9IHV2c1szXTtcbiAgICAgICAgICAgIHV2c1szXSA9IHRlbXBWYWw7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NhbGN1bGF0ZVNsaWNlZFVWICgpIHtcbiAgICAgICAgbGV0IHJlY3QgPSB0aGlzLl9yZWN0O1xuICAgICAgICBsZXQgYXRsYXNXaWR0aCA9IHRoaXMuX3RleHR1cmUud2lkdGg7XG4gICAgICAgIGxldCBhdGxhc0hlaWdodCA9IHRoaXMuX3RleHR1cmUuaGVpZ2h0O1xuICAgICAgICBsZXQgbGVmdFdpZHRoID0gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0xFRlRdO1xuICAgICAgICBsZXQgcmlnaHRXaWR0aCA9IHRoaXMuX2NhcEluc2V0c1tJTlNFVF9SSUdIVF07XG4gICAgICAgIGxldCBjZW50ZXJXaWR0aCA9IHJlY3Qud2lkdGggLSBsZWZ0V2lkdGggLSByaWdodFdpZHRoO1xuICAgICAgICBsZXQgdG9wSGVpZ2h0ID0gdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1RPUF07XG4gICAgICAgIGxldCBib3R0b21IZWlnaHQgPSB0aGlzLl9jYXBJbnNldHNbSU5TRVRfQk9UVE9NXTtcbiAgICAgICAgbGV0IGNlbnRlckhlaWdodCA9IHJlY3QuaGVpZ2h0IC0gdG9wSGVpZ2h0IC0gYm90dG9tSGVpZ2h0O1xuXG4gICAgICAgIGxldCB1dlNsaWNlZCA9IHRoaXMudXZTbGljZWQ7XG4gICAgICAgIHV2U2xpY2VkLmxlbmd0aCA9IDA7XG4gICAgICAgIGlmICh0aGlzLl9yb3RhdGVkKSB7XG4gICAgICAgICAgICB0ZW1wX3V2c1swXS51ID0gKHJlY3QueCkgLyBhdGxhc1dpZHRoO1xuICAgICAgICAgICAgdGVtcF91dnNbMV0udSA9IChyZWN0LnggKyBib3R0b21IZWlnaHQpIC8gYXRsYXNXaWR0aDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzJdLnUgPSAocmVjdC54ICsgYm90dG9tSGVpZ2h0ICsgY2VudGVySGVpZ2h0KSAvIGF0bGFzV2lkdGg7XG4gICAgICAgICAgICB0ZW1wX3V2c1szXS51ID0gKHJlY3QueCArIHJlY3QuaGVpZ2h0KSAvIGF0bGFzV2lkdGg7XG4gICAgICAgICAgICB0ZW1wX3V2c1szXS52ID0gKHJlY3QueSkgLyBhdGxhc0hlaWdodDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzJdLnYgPSAocmVjdC55ICsgbGVmdFdpZHRoKSAvIGF0bGFzSGVpZ2h0O1xuICAgICAgICAgICAgdGVtcF91dnNbMV0udiA9IChyZWN0LnkgKyBsZWZ0V2lkdGggKyBjZW50ZXJXaWR0aCkgLyBhdGxhc0hlaWdodDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzBdLnYgPSAocmVjdC55ICsgcmVjdC53aWR0aCkgLyBhdGxhc0hlaWdodDtcblxuICAgICAgICAgICAgdGhpcy5fZmxpcFhZKHRlbXBfdXZzKTtcblxuICAgICAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgNDsgKytyb3cpIHtcbiAgICAgICAgICAgICAgICBsZXQgcm93RCA9IHRlbXBfdXZzW3Jvd107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgNDsgKytjb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbEQgPSB0ZW1wX3V2c1szIC0gY29sXTtcbiAgICAgICAgICAgICAgICAgICAgdXZTbGljZWQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1OiByb3dELnUsXG4gICAgICAgICAgICAgICAgICAgICAgICB2OiBjb2xELnZcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGVtcF91dnNbMF0udSA9IChyZWN0LngpIC8gYXRsYXNXaWR0aDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzFdLnUgPSAocmVjdC54ICsgbGVmdFdpZHRoKSAvIGF0bGFzV2lkdGg7XG4gICAgICAgICAgICB0ZW1wX3V2c1syXS51ID0gKHJlY3QueCArIGxlZnRXaWR0aCArIGNlbnRlcldpZHRoKSAvIGF0bGFzV2lkdGg7XG4gICAgICAgICAgICB0ZW1wX3V2c1szXS51ID0gKHJlY3QueCArIHJlY3Qud2lkdGgpIC8gYXRsYXNXaWR0aDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzNdLnYgPSAocmVjdC55KSAvIGF0bGFzSGVpZ2h0O1xuICAgICAgICAgICAgdGVtcF91dnNbMl0udiA9IChyZWN0LnkgKyB0b3BIZWlnaHQpIC8gYXRsYXNIZWlnaHQ7XG4gICAgICAgICAgICB0ZW1wX3V2c1sxXS52ID0gKHJlY3QueSArIHRvcEhlaWdodCArIGNlbnRlckhlaWdodCkgLyBhdGxhc0hlaWdodDtcbiAgICAgICAgICAgIHRlbXBfdXZzWzBdLnYgPSAocmVjdC55ICsgcmVjdC5oZWlnaHQpIC8gYXRsYXNIZWlnaHQ7XG5cbiAgICAgICAgICAgIHRoaXMuX2ZsaXBYWSh0ZW1wX3V2cyk7XG5cbiAgICAgICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDQ7ICsrcm93KSB7XG4gICAgICAgICAgICAgICAgbGV0IHJvd0QgPSB0ZW1wX3V2c1tyb3ddO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDQ7ICsrY29sKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb2xEID0gdGVtcF91dnNbY29sXTtcbiAgICAgICAgICAgICAgICAgICAgdXZTbGljZWQucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1OiBjb2xELnUsXG4gICAgICAgICAgICAgICAgICAgICAgICB2OiByb3dELnZcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9zZXREeW5hbWljQXRsYXNGcmFtZSAoZnJhbWUpIHtcbiAgICAgICAgaWYgKCFmcmFtZSkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuX29yaWdpbmFsID0ge1xuICAgICAgICAgICAgX3RleHR1cmUgOiB0aGlzLl90ZXh0dXJlLFxuICAgICAgICAgICAgX3ggOiB0aGlzLl9yZWN0LngsXG4gICAgICAgICAgICBfeSA6IHRoaXMuX3JlY3QueVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLl90ZXh0dXJlID0gZnJhbWUudGV4dHVyZTtcbiAgICAgICAgdGhpcy5fcmVjdC54ID0gZnJhbWUueDtcbiAgICAgICAgdGhpcy5fcmVjdC55ID0gZnJhbWUueTtcbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlVVYoKTtcbiAgICB9LFxuXG4gICAgX3Jlc2V0RHluYW1pY0F0bGFzRnJhbWUgKCkge1xuICAgICAgICBpZiAoIXRoaXMuX29yaWdpbmFsKSByZXR1cm47XG4gICAgICAgIHRoaXMuX3JlY3QueCA9IHRoaXMuX29yaWdpbmFsLl94O1xuICAgICAgICB0aGlzLl9yZWN0LnkgPSB0aGlzLl9vcmlnaW5hbC5feTtcbiAgICAgICAgdGhpcy5fdGV4dHVyZSA9IHRoaXMuX29yaWdpbmFsLl90ZXh0dXJlO1xuICAgICAgICB0aGlzLl9vcmlnaW5hbCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZVVWKCk7XG4gICAgfSxcblxuICAgIF9jYWxjdWxhdGVVViAoKSB7XG4gICAgICAgIGxldCByZWN0ID0gdGhpcy5fcmVjdCxcbiAgICAgICAgICAgIHRleHR1cmUgPSB0aGlzLl90ZXh0dXJlLFxuICAgICAgICAgICAgdXYgPSB0aGlzLnV2LFxuICAgICAgICAgICAgdGV4dyA9IHRleHR1cmUud2lkdGgsXG4gICAgICAgICAgICB0ZXhoID0gdGV4dHVyZS5oZWlnaHQ7XG5cbiAgICAgICAgaWYgKHRoaXMuX3JvdGF0ZWQpIHtcbiAgICAgICAgICAgIGxldCBsID0gdGV4dyA9PT0gMCA/IDAgOiByZWN0LnggLyB0ZXh3O1xuICAgICAgICAgICAgbGV0IHIgPSB0ZXh3ID09PSAwID8gMCA6IChyZWN0LnggKyByZWN0LmhlaWdodCkgLyB0ZXh3O1xuICAgICAgICAgICAgbGV0IGIgPSB0ZXhoID09PSAwID8gMCA6IChyZWN0LnkgKyByZWN0LndpZHRoKSAvIHRleGg7XG4gICAgICAgICAgICBsZXQgdCA9IHRleGggPT09IDAgPyAwIDogcmVjdC55IC8gdGV4aDtcbiAgICAgICAgICAgIHV2WzBdID0gbDtcbiAgICAgICAgICAgIHV2WzFdID0gdDtcbiAgICAgICAgICAgIHV2WzJdID0gbDtcbiAgICAgICAgICAgIHV2WzNdID0gYjtcbiAgICAgICAgICAgIHV2WzRdID0gcjtcbiAgICAgICAgICAgIHV2WzVdID0gdDtcbiAgICAgICAgICAgIHV2WzZdID0gcjtcbiAgICAgICAgICAgIHV2WzddID0gYjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBsID0gdGV4dyA9PT0gMCA/IDAgOiByZWN0LnggLyB0ZXh3O1xuICAgICAgICAgICAgbGV0IHIgPSB0ZXh3ID09PSAwID8gMCA6IChyZWN0LnggKyByZWN0LndpZHRoKSAvIHRleHc7XG4gICAgICAgICAgICBsZXQgYiA9IHRleGggPT09IDAgPyAwIDogKHJlY3QueSArIHJlY3QuaGVpZ2h0KSAvIHRleGg7XG4gICAgICAgICAgICBsZXQgdCA9IHRleGggPT09IDAgPyAwIDogcmVjdC55IC8gdGV4aDtcbiAgICAgICAgICAgIHV2WzBdID0gbDtcbiAgICAgICAgICAgIHV2WzFdID0gYjtcbiAgICAgICAgICAgIHV2WzJdID0gcjtcbiAgICAgICAgICAgIHV2WzNdID0gYjtcbiAgICAgICAgICAgIHV2WzRdID0gbDtcbiAgICAgICAgICAgIHV2WzVdID0gdDtcbiAgICAgICAgICAgIHV2WzZdID0gcjtcbiAgICAgICAgICAgIHV2WzddID0gdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9mbGlwWCkge1xuICAgICAgICAgICAgbGV0IHRlbXBWYWwgPSB1dlswXTtcbiAgICAgICAgICAgIHV2WzBdID0gdXZbMl07XG4gICAgICAgICAgICB1dlsyXSA9IHRlbXBWYWw7XG5cbiAgICAgICAgICAgIHRlbXBWYWwgPSB1dlsxXTtcbiAgICAgICAgICAgIHV2WzFdID0gdXZbM107XG4gICAgICAgICAgICB1dlszXSA9IHRlbXBWYWw7XG5cbiAgICAgICAgICAgIHRlbXBWYWwgPSB1dls0XTtcbiAgICAgICAgICAgIHV2WzRdID0gdXZbNl07XG4gICAgICAgICAgICB1dls2XSA9IHRlbXBWYWw7XG5cbiAgICAgICAgICAgIHRlbXBWYWwgPSB1dls1XTtcbiAgICAgICAgICAgIHV2WzVdID0gdXZbN107XG4gICAgICAgICAgICB1dls3XSA9IHRlbXBWYWw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fZmxpcFkpIHtcbiAgICAgICAgICAgIGxldCB0ZW1wVmFsID0gdXZbMF07XG4gICAgICAgICAgICB1dlswXSA9IHV2WzRdO1xuICAgICAgICAgICAgdXZbNF0gPSB0ZW1wVmFsO1xuXG4gICAgICAgICAgICB0ZW1wVmFsID0gdXZbMV07XG4gICAgICAgICAgICB1dlsxXSA9IHV2WzVdO1xuICAgICAgICAgICAgdXZbNV0gPSB0ZW1wVmFsO1xuXG4gICAgICAgICAgICB0ZW1wVmFsID0gdXZbMl07XG4gICAgICAgICAgICB1dlsyXSA9IHV2WzZdO1xuICAgICAgICAgICAgdXZbNl0gPSB0ZW1wVmFsO1xuXG4gICAgICAgICAgICB0ZW1wVmFsID0gdXZbM107XG4gICAgICAgICAgICB1dlszXSA9IHV2WzddO1xuICAgICAgICAgICAgdXZbN10gPSB0ZW1wVmFsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcztcbiAgICAgICAgaWYgKHZlcnRpY2VzKSB7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5udS5sZW5ndGggPSAwO1xuICAgICAgICAgICAgdmVydGljZXMubnYubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmVydGljZXMudS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZlcnRpY2VzLm51W2ldID0gdmVydGljZXMudVtpXS90ZXh3O1xuICAgICAgICAgICAgICAgIHZlcnRpY2VzLm52W2ldID0gdmVydGljZXMudltpXS90ZXhoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY2FsY3VsYXRlU2xpY2VkVVYoKTtcbiAgICB9LFxuXG4gICAgLy8gU0VSSUFMSVpBVElPTlxuXG4gICAgX3NlcmlhbGl6ZTogQ0NfRURJVE9SICYmIGZ1bmN0aW9uIChleHBvcnRpbmcpIHtcbiAgICAgICAgbGV0IHJlY3QgPSB0aGlzLl9yZWN0O1xuICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5fb2Zmc2V0O1xuICAgICAgICBsZXQgc2l6ZSA9IHRoaXMuX29yaWdpbmFsU2l6ZTtcbiAgICAgICAgbGV0IHV1aWQ7XG4gICAgICAgIGxldCB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcbiAgICAgICAgaWYgKHRleHR1cmUpIHtcbiAgICAgICAgICAgIHV1aWQgPSB0ZXh0dXJlLl91dWlkO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdXVpZCkge1xuICAgICAgICAgICAgbGV0IHVybCA9IHRoaXMuX3RleHR1cmVGaWxlbmFtZTtcbiAgICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgICAgICB1dWlkID0gRWRpdG9yLlV0aWxzLlV1aWRDYWNoZS51cmxUb1V1aWQodXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodXVpZCAmJiBleHBvcnRpbmcpIHtcbiAgICAgICAgICAgIHV1aWQgPSBFZGl0b3IuVXRpbHMuVXVpZFV0aWxzLmNvbXByZXNzVXVpZCh1dWlkLCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2ZXJ0aWNlcztcbiAgICAgICAgaWYgKHRoaXMudmVydGljZXMpIHtcbiAgICAgICAgICAgIHZlcnRpY2VzID0ge1xuICAgICAgICAgICAgICAgIHRyaWFuZ2xlczogdGhpcy52ZXJ0aWNlcy50cmlhbmdsZXMsXG4gICAgICAgICAgICAgICAgeDogdGhpcy52ZXJ0aWNlcy54LFxuICAgICAgICAgICAgICAgIHk6IHRoaXMudmVydGljZXMueSxcbiAgICAgICAgICAgICAgICB1OiB0aGlzLnZlcnRpY2VzLnUsXG4gICAgICAgICAgICAgICAgdjogdGhpcy52ZXJ0aWNlcy52XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IHRoaXMuX25hbWUsXG4gICAgICAgICAgICB0ZXh0dXJlOiB1dWlkIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGF0bGFzOiBleHBvcnRpbmcgPyB1bmRlZmluZWQgOiB0aGlzLl9hdGxhc1V1aWQsICAvLyBzdHJpcCBmcm9tIGpzb24gaWYgZXhwb3J0aW5nXG4gICAgICAgICAgICByZWN0OiByZWN0ID8gW3JlY3QueCwgcmVjdC55LCByZWN0LndpZHRoLCByZWN0LmhlaWdodF0gOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBvZmZzZXQ6IG9mZnNldCA/IFtvZmZzZXQueCwgb2Zmc2V0LnldIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgb3JpZ2luYWxTaXplOiBzaXplID8gW3NpemUud2lkdGgsIHNpemUuaGVpZ2h0XSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHJvdGF0ZWQ6IHRoaXMuX3JvdGF0ZWQgPyAxIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY2FwSW5zZXRzOiB0aGlzLl9jYXBJbnNldHMsXG4gICAgICAgICAgICB2ZXJ0aWNlczogdmVydGljZXNcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgX2Rlc2VyaWFsaXplOiBmdW5jdGlvbiAoZGF0YSwgaGFuZGxlKSB7XG4gICAgICAgIGxldCByZWN0ID0gZGF0YS5yZWN0O1xuICAgICAgICBpZiAocmVjdCkge1xuICAgICAgICAgICAgdGhpcy5fcmVjdCA9IG5ldyBjYy5SZWN0KHJlY3RbMF0sIHJlY3RbMV0sIHJlY3RbMl0sIHJlY3RbM10pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLm9mZnNldCkge1xuICAgICAgICAgICAgdGhpcy5zZXRPZmZzZXQobmV3IGNjLlZlYzIoZGF0YS5vZmZzZXRbMF0sIGRhdGEub2Zmc2V0WzFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEub3JpZ2luYWxTaXplKSB7XG4gICAgICAgICAgICB0aGlzLnNldE9yaWdpbmFsU2l6ZShuZXcgY2MuU2l6ZShkYXRhLm9yaWdpbmFsU2l6ZVswXSwgZGF0YS5vcmlnaW5hbFNpemVbMV0pKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9yb3RhdGVkID0gZGF0YS5yb3RhdGVkID09PSAxO1xuICAgICAgICB0aGlzLl9uYW1lID0gZGF0YS5uYW1lO1xuXG4gICAgICAgIGxldCBjYXBJbnNldHMgPSBkYXRhLmNhcEluc2V0cztcbiAgICAgICAgaWYgKGNhcEluc2V0cykge1xuICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0xFRlRdID0gY2FwSW5zZXRzW0lOU0VUX0xFRlRdO1xuICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX1RPUF0gPSBjYXBJbnNldHNbSU5TRVRfVE9QXTtcbiAgICAgICAgICAgIHRoaXMuX2NhcEluc2V0c1tJTlNFVF9SSUdIVF0gPSBjYXBJbnNldHNbSU5TRVRfUklHSFRdO1xuICAgICAgICAgICAgdGhpcy5fY2FwSW5zZXRzW0lOU0VUX0JPVFRPTV0gPSBjYXBJbnNldHNbSU5TRVRfQk9UVE9NXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChDQ19FRElUT1IpIHtcbiAgICAgICAgICAgIHRoaXMuX2F0bGFzVXVpZCA9IGRhdGEuYXRsYXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZlcnRpY2VzID0gZGF0YS52ZXJ0aWNlcztcbiAgICAgICAgaWYgKHRoaXMudmVydGljZXMpIHtcbiAgICAgICAgICAgIC8vIGluaXRpYWxpemUgbm9ybWFsIHV2IGFycmF5c1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNlcy5udSA9IFtdO1xuICAgICAgICAgICAgdGhpcy52ZXJ0aWNlcy5udiA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbG9hZCB0ZXh0dXJlIHZpYSBfdGV4dHVyZVNldHRlclxuICAgICAgICBsZXQgdGV4dHVyZVV1aWQgPSBkYXRhLnRleHR1cmU7XG4gICAgICAgIGlmICh0ZXh0dXJlVXVpZCkge1xuICAgICAgICAgICAgaGFuZGxlLnJlc3VsdC5wdXNoKHRoaXMsICdfdGV4dHVyZVNldHRlcicsIHRleHR1cmVVdWlkKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5sZXQgcHJvdG8gPSBTcHJpdGVGcmFtZS5wcm90b3R5cGU7XG5cbnByb3RvLmNvcHlXaXRoWm9uZSA9IHByb3RvLmNsb25lO1xucHJvdG8uY29weSA9IHByb3RvLmNsb25lO1xucHJvdG8uaW5pdFdpdGhUZXh0dXJlID0gcHJvdG8uc2V0VGV4dHVyZTtcblxuY2MuU3ByaXRlRnJhbWUgPSBTcHJpdGVGcmFtZTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcHJpdGVGcmFtZTtcbiJdfQ==