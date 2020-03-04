
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'engine-dev/cocos2d/tilemap/CCTiledLayer.js';
                    var __require = nodeEnv ? function (request) {
                        return require(request);
                    } : function (request) {
                        return __quick_compile_engine__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_engine__.registerModule(__filename, module);}"use strict";

var _valueTypes = require("../core/value-types");

var _materialVariant = _interopRequireDefault(require("../core/assets/material/material-variant"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
var RenderComponent = require('../core/components/CCRenderComponent');

var Material = require('../core/assets/material/CCMaterial');

var RenderFlow = require('../core/renderer/render-flow');

var _mat4_temp = cc.mat4();

var _vec2_temp = cc.v2();

var _vec2_temp2 = cc.v2();

var _tempRowCol = {
  row: 0,
  col: 0
};
var TiledUserNodeData = cc.Class({
  name: 'cc.TiledUserNodeData',
  "extends": cc.Component,
  ctor: function ctor() {
    this._index = -1;
    this._row = -1;
    this._col = -1;
    this._tiledLayer = null;
  }
});
/**
 * !#en Render the TMX layer.
 * !#zh 渲染 TMX layer。
 * @class TiledLayer
 * @extends Component
 */

var TiledLayer = cc.Class({
  name: 'cc.TiledLayer',
  // Inherits from the abstract class directly,
  // because TiledLayer not create or maintains the sgNode by itself.
  "extends": RenderComponent,
  editor: {
    inspector: 'packages://inspector/inspectors/comps/tiled-layer.js'
  },
  ctor: function ctor() {
    this._userNodeGrid = {}; // [row][col] = {count: 0, nodesList: []};

    this._userNodeMap = {}; // [id] = node;

    this._userNodeDirty = false; // store the layer tiles node, index is caculated by 'x + width * y', format likes '[0]=tileNode0,[1]=tileNode1, ...'

    this._tiledTiles = []; // store the layer tilesets index array

    this._tilesetIndexArr = []; // texture id to material index

    this._texIdToMatIndex = {};
    this._viewPort = {
      x: -1,
      y: -1,
      width: -1,
      height: -1
    };
    this._cullingRect = {
      leftDown: {
        row: -1,
        col: -1
      },
      rightTop: {
        row: -1,
        col: -1
      }
    };
    this._cullingDirty = true;
    this._rightTop = {
      row: -1,
      col: -1
    };
    this._layerInfo = null;
    this._mapInfo = null; // record max or min tile texture offset, 
    // it will make culling rect more large, which insure culling rect correct.

    this._topOffset = 0;
    this._downOffset = 0;
    this._leftOffset = 0;
    this._rightOffset = 0; // store the layer tiles, index is caculated by 'x + width * y', format likes '[0]=gid0,[1]=gid1, ...'

    this._tiles = []; // vertex array

    this._vertices = []; // vertices dirty

    this._verticesDirty = true;
    this._layerName = '';
    this._layerOrientation = null; // store all layer gid corresponding texture info, index is gid, format likes '[gid0]=tex-info,[gid1]=tex-info, ...'

    this._texGrids = null; // store all tileset texture, index is tileset index, format likes '[0]=texture0, [1]=texture1, ...'

    this._textures = null;
    this._tilesets = null;
    this._leftDownToCenterX = 0;
    this._leftDownToCenterY = 0;
    this._hasTiledNodeGrid = false;
    this._hasAniGrid = false;
    this._animations = null; // switch of culling

    this._enableCulling = cc.macro.ENABLE_TILEDMAP_CULLING;
  },
  _hasTiledNode: function _hasTiledNode() {
    return this._hasTiledNodeGrid;
  },
  _hasAnimation: function _hasAnimation() {
    return this._hasAniGrid;
  },

  /**
   * !#en enable or disable culling
   * !#zh 开启或关闭裁剪。
   * @method enableCulling
   * @param value
   */
  enableCulling: function enableCulling(value) {
    if (this._enableCulling != value) {
      this._enableCulling = value;
      this._cullingDirty = true;
    }
  },

  /**
   * !#en Adds user's node into layer.
   * !#zh 添加用户节点。
   * @method addUserNode
   * @param {cc.Node} node
   * @return {Boolean}
   */
  addUserNode: function addUserNode(node) {
    var dataComp = node.getComponent(TiledUserNodeData);

    if (dataComp) {
      cc.warn("CCTiledLayer:addUserNode node has been added");
      return false;
    }

    dataComp = node.addComponent(TiledUserNodeData);
    node.parent = this.node;
    node._renderFlag |= RenderFlow.FLAG_BREAK_FLOW;
    this._userNodeMap[node._id] = dataComp;
    dataComp._row = -1;
    dataComp._col = -1;
    dataComp._tiledLayer = this;

    this._nodeLocalPosToLayerPos(node, _vec2_temp);

    this._positionToRowCol(_vec2_temp.x, _vec2_temp.y, _tempRowCol);

    this._addUserNodeToGrid(dataComp, _tempRowCol);

    this._updateCullingOffsetByUserNode(node);

    node.on(cc.Node.EventType.POSITION_CHANGED, this._userNodePosChange, dataComp);
    node.on(cc.Node.EventType.SIZE_CHANGED, this._userNodeSizeChange, dataComp);
    return true;
  },

  /**
   * !#en Removes user's node.
   * !#zh 移除用户节点。
   * @method removeUserNode
   * @param {cc.Node} node
   * @return {Boolean}
   */
  removeUserNode: function removeUserNode(node) {
    var dataComp = node.getComponent(TiledUserNodeData);

    if (!dataComp) {
      cc.warn("CCTiledLayer:removeUserNode node is not exist");
      return false;
    }

    node.off(cc.Node.EventType.POSITION_CHANGED, this._userNodePosChange, dataComp);
    node.off(cc.Node.EventType.SIZE_CHANGED, this._userNodeSizeChange, dataComp);

    this._removeUserNodeFromGrid(dataComp);

    delete this._userNodeMap[node._id];

    node._removeComponent(dataComp);

    dataComp.destroy();
    node.removeFromParent(true);
    node._renderFlag &= ~RenderFlow.FLAG_BREAK_FLOW;
    return true;
  },

  /**
   * !#en Destroy user's node.
   * !#zh 销毁用户节点。
   * @method destroyUserNode
   * @param {cc.Node} node
   */
  destroyUserNode: function destroyUserNode(node) {
    this.removeUserNode(node);
    node.destroy();
  },
  // acording layer anchor point to calculate node layer pos
  _nodeLocalPosToLayerPos: function _nodeLocalPosToLayerPos(nodePos, out) {
    out.x = nodePos.x + this._leftDownToCenterX;
    out.y = nodePos.y + this._leftDownToCenterY;
  },
  _getNodesByRowCol: function _getNodesByRowCol(row, col) {
    var rowData = this._userNodeGrid[row];
    if (!rowData) return null;
    return rowData[col];
  },
  _getNodesCountByRow: function _getNodesCountByRow(row) {
    var rowData = this._userNodeGrid[row];
    if (!rowData) return 0;
    return rowData.count;
  },
  _updateAllUserNode: function _updateAllUserNode() {
    this._userNodeGrid = {};

    for (var dataId in this._userNodeMap) {
      var dataComp = this._userNodeMap[dataId];

      this._nodeLocalPosToLayerPos(dataComp.node, _vec2_temp);

      this._positionToRowCol(_vec2_temp.x, _vec2_temp.y, _tempRowCol);

      this._addUserNodeToGrid(dataComp, _tempRowCol);

      this._updateCullingOffsetByUserNode(dataComp.node);
    }
  },
  _updateCullingOffsetByUserNode: function _updateCullingOffsetByUserNode(node) {
    if (this._topOffset < node.height) {
      this._topOffset = node.height;
    }

    if (this._downOffset < node.height) {
      this._downOffset = node.height;
    }

    if (this._leftOffset < node.width) {
      this._leftOffset = node.width;
    }

    if (this._rightOffset < node.width) {
      this._rightOffset = node.width;
    }
  },
  _userNodeSizeChange: function _userNodeSizeChange() {
    var dataComp = this;
    var node = dataComp.node;
    var self = dataComp._tiledLayer;

    self._updateCullingOffsetByUserNode(node);
  },
  _userNodePosChange: function _userNodePosChange() {
    var dataComp = this;
    var node = dataComp.node;
    var self = dataComp._tiledLayer;

    self._nodeLocalPosToLayerPos(node, _vec2_temp);

    self._positionToRowCol(_vec2_temp.x, _vec2_temp.y, _tempRowCol);

    self._limitInLayer(_tempRowCol); // users pos not change


    if (_tempRowCol.row === dataComp._row && _tempRowCol.col === dataComp._col) return;

    self._removeUserNodeFromGrid(dataComp);

    self._addUserNodeToGrid(dataComp, _tempRowCol);
  },
  _removeUserNodeFromGrid: function _removeUserNodeFromGrid(dataComp) {
    var row = dataComp._row;
    var col = dataComp._col;
    var index = dataComp._index;
    var rowData = this._userNodeGrid[row];
    var colData = rowData && rowData[col];

    if (colData) {
      rowData.count--;
      colData.count--;
      colData.list[index] = null;

      if (colData.count <= 0) {
        colData.list.length = 0;
        colData.count = 0;
      }
    }

    dataComp._row = -1;
    dataComp._col = -1;
    dataComp._index = -1;
    this._userNodeDirty = true;
  },
  _limitInLayer: function _limitInLayer(rowCol) {
    var row = rowCol.row;
    var col = rowCol.col;
    if (row < 0) rowCol.row = 0;
    if (row > this._rightTop.row) rowCol.row = this._rightTop.row;
    if (col < 0) rowCol.col = 0;
    if (col > this._rightTop.col) rowCol.col = this._rightTop.col;
  },
  _addUserNodeToGrid: function _addUserNodeToGrid(dataComp, tempRowCol) {
    var row = tempRowCol.row;
    var col = tempRowCol.col;
    var rowData = this._userNodeGrid[row] = this._userNodeGrid[row] || {
      count: 0
    };
    var colData = rowData[col] = rowData[col] || {
      count: 0,
      list: []
    };
    dataComp._row = row;
    dataComp._col = col;
    dataComp._index = colData.list.length;
    rowData.count++;
    colData.count++;
    colData.list.push(dataComp);
    this._userNodeDirty = true;
  },
  _isUserNodeDirty: function _isUserNodeDirty() {
    return this._userNodeDirty;
  },
  _setUserNodeDirty: function _setUserNodeDirty(value) {
    this._userNodeDirty = value;
  },
  onEnable: function onEnable() {
    this._super();

    this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);

    this._activateMaterial();
  },
  onDisable: function onDisable() {
    this._super();

    this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
  },
  _syncAnchorPoint: function _syncAnchorPoint() {
    var node = this.node;
    this._leftDownToCenterX = node.width * node.anchorX * node.scaleX;
    this._leftDownToCenterY = node.height * node.anchorY * node.scaleY;
    this._cullingDirty = true;
  },
  onDestroy: function onDestroy() {
    this._super();

    if (this._buffer) {
      this._buffer.destroy();

      this._buffer = null;
    }

    this._renderDataList = null;
  },

  /**
   * !#en Gets the layer name.
   * !#zh 获取层的名称。
   * @method getLayerName
   * @return {String}
   * @example
   * let layerName = tiledLayer.getLayerName();
   * cc.log(layerName);
   */
  getLayerName: function getLayerName() {
    return this._layerName;
  },

  /**
   * !#en Set the layer name.
   * !#zh 设置层的名称
   * @method SetLayerName
   * @param {String} layerName
   * @example
   * tiledLayer.setLayerName("New Layer");
   */
  setLayerName: function setLayerName(layerName) {
    this._layerName = layerName;
  },

  /**
   * !#en Return the value for the specific property name.
   * !#zh 获取指定属性名的值。
   * @method getProperty
   * @param {String} propertyName
   * @return {*}
   * @example
   * let property = tiledLayer.getProperty("info");
   * cc.log(property);
   */
  getProperty: function getProperty(propertyName) {
    return this._properties[propertyName];
  },

  /**
   * !#en Returns the position in pixels of a given tile coordinate.
   * !#zh 获取指定 tile 的像素坐标。
   * @method getPositionAt
   * @param {Vec2|Number} pos position or x
   * @param {Number} [y]
   * @return {Vec2}
   * @example
   * let pos = tiledLayer.getPositionAt(cc.v2(0, 0));
   * cc.log("Pos: " + pos);
   * let pos = tiledLayer.getPositionAt(0, 0);
   * cc.log("Pos: " + pos);
   */
  getPositionAt: function getPositionAt(pos, y) {
    var x;

    if (y !== undefined) {
      x = Math.floor(pos);
      y = Math.floor(y);
    } else {
      x = Math.floor(pos.x);
      y = Math.floor(pos.y);
    }

    var ret;

    switch (this._layerOrientation) {
      case cc.TiledMap.Orientation.ORTHO:
        ret = this._positionForOrthoAt(x, y);
        break;

      case cc.TiledMap.Orientation.ISO:
        ret = this._positionForIsoAt(x, y);
        break;

      case cc.TiledMap.Orientation.HEX:
        ret = this._positionForHexAt(x, y);
        break;
    }

    return ret;
  },
  _isInvalidPosition: function _isInvalidPosition(x, y) {
    if (x && typeof x === 'object') {
      var pos = x;
      y = pos.y;
      x = pos.x;
    }

    return x >= this._layerSize.width || y >= this._layerSize.height || x < 0 || y < 0;
  },
  _positionForIsoAt: function _positionForIsoAt(x, y) {
    var offsetX = 0,
        offsetY = 0;

    var index = Math.floor(x) + Math.floor(y) * this._layerSize.width;

    var gid = this._tiles[index];

    if (gid) {
      var tileset = this._texGrids[gid].tileset;
      var offset = tileset.tileOffset;
      offsetX = offset.x;
      offsetY = offset.y;
    }

    return cc.v2(this._mapTileSize.width * 0.5 * (this._layerSize.height + x - y - 1) + offsetX, this._mapTileSize.height * 0.5 * (this._layerSize.width - x + this._layerSize.height - y - 2) - offsetY);
  },
  _positionForOrthoAt: function _positionForOrthoAt(x, y) {
    var offsetX = 0,
        offsetY = 0;

    var index = Math.floor(x) + Math.floor(y) * this._layerSize.width;

    var gid = this._tiles[index];

    if (gid) {
      var tileset = this._texGrids[gid].tileset;
      var offset = tileset.tileOffset;
      offsetX = offset.x;
      offsetY = offset.y;
    }

    return cc.v2(x * this._mapTileSize.width + offsetX, (this._layerSize.height - y - 1) * this._mapTileSize.height - offsetY);
  },
  _positionForHexAt: function _positionForHexAt(col, row) {
    var tileWidth = this._mapTileSize.width;
    var tileHeight = this._mapTileSize.height;
    var rows = this._layerSize.height;

    var index = Math.floor(col) + Math.floor(row) * this._layerSize.width;

    var gid = this._tiles[index];
    var tileset = this._texGrids[gid].tileset;
    var offset = tileset.tileOffset;
    var odd_even = this._staggerIndex === cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD ? 1 : -1;
    var x = 0,
        y = 0;
    var diffX = 0;
    var diffY = 0;

    switch (this._staggerAxis) {
      case cc.TiledMap.StaggerAxis.STAGGERAXIS_Y:
        diffX = 0;

        if (row % 2 === 1) {
          diffX = tileWidth / 2 * odd_even;
        }

        x = col * tileWidth + diffX + offset.x;
        y = (rows - row - 1) * (tileHeight - (tileHeight - this._hexSideLength) / 2) - offset.y;
        break;

      case cc.TiledMap.StaggerAxis.STAGGERAXIS_X:
        diffY = 0;

        if (col % 2 === 1) {
          diffY = tileHeight / 2 * -odd_even;
        }

        x = col * (tileWidth - (tileWidth - this._hexSideLength) / 2) + offset.x;
        y = (rows - row - 1) * tileHeight + diffY - offset.y;
        break;
    }

    return cc.v2(x, y);
  },

  /**
   * !#en
   * Sets the tile gid (gid = tile global id) at a given tile coordinate.<br />
   * The Tile GID can be obtained by using the method "tileGIDAt" or by using the TMX editor . Tileset Mgr +1.<br />
   * If a tile is already placed at that position, then it will be removed.
   * !#zh
   * 设置给定坐标的 tile 的 gid (gid = tile 全局 id)，
   * tile 的 GID 可以使用方法 “tileGIDAt” 来获得。<br />
   * 如果一个 tile 已经放在那个位置，那么它将被删除。
   * @method setTileGIDAt
   * @param {Number} gid
   * @param {Vec2|Number} posOrX position or x
   * @param {Number} flagsOrY flags or y
   * @param {Number} [flags]
   * @example
   * tiledLayer.setTileGIDAt(1001, 10, 10, 1)
   */
  setTileGIDAt: function setTileGIDAt(gid, posOrX, flagsOrY, flags) {
    if (posOrX === undefined) {
      throw new Error("cc.TiledLayer.setTileGIDAt(): pos should be non-null");
    }

    var pos;

    if (flags !== undefined || !(posOrX instanceof cc.Vec2)) {
      // four parameters or posOrX is not a Vec2 object
      pos = cc.v2(posOrX, flagsOrY);
    } else {
      pos = posOrX;
      flags = flagsOrY;
    }

    pos.x = Math.floor(pos.x);
    pos.y = Math.floor(pos.y);

    if (this._isInvalidPosition(pos)) {
      throw new Error("cc.TiledLayer.setTileGIDAt(): invalid position");
    }

    if (!this._tiles || !this._tilesets || this._tilesets.length == 0) {
      cc.logID(7238);
      return;
    }

    if (gid !== 0 && gid < this._tilesets[0].firstGid) {
      cc.logID(7239, gid);
      return;
    }

    flags = flags || 0;
    var currentFlags = this.getTileFlagsAt(pos);
    var currentGID = this.getTileGIDAt(pos);
    if (currentGID === gid && currentFlags === flags) return;
    var gidAndFlags = (gid | flags) >>> 0;

    this._updateTileForGID(gidAndFlags, pos);
  },
  _updateTileForGID: function _updateTileForGID(gid, pos) {
    if (gid !== 0 && !this._texGrids[gid]) {
      return;
    }

    var idx = 0 | pos.x + pos.y * this._layerSize.width;

    if (idx < this._tiles.length) {
      this._tiles[idx] = gid;
      this._cullingDirty = true;
    }
  },

  /**
   * !#en
   * Returns the tile gid at a given tile coordinate. <br />
   * if it returns 0, it means that the tile is empty. <br />
   * !#zh
   * 通过给定的 tile 坐标、flags（可选）返回 tile 的 GID. <br />
   * 如果它返回 0，则表示该 tile 为空。<br />
   * @method getTileGIDAt
   * @param {Vec2|Number} pos or x
   * @param {Number} [y]
   * @return {Number}
   * @example
   * let tileGid = tiledLayer.getTileGIDAt(0, 0);
   */
  getTileGIDAt: function getTileGIDAt(pos, y) {
    if (pos === undefined) {
      throw new Error("cc.TiledLayer.getTileGIDAt(): pos should be non-null");
    }

    var x = pos;

    if (y === undefined) {
      x = pos.x;
      y = pos.y;
    }

    if (this._isInvalidPosition(x, y)) {
      throw new Error("cc.TiledLayer.getTileGIDAt(): invalid position");
    }

    if (!this._tiles) {
      cc.logID(7237);
      return null;
    }

    var index = Math.floor(x) + Math.floor(y) * this._layerSize.width; // Bits on the far end of the 32-bit global tile ID are used for tile flags


    var tile = this._tiles[index];
    return (tile & cc.TiledMap.TileFlag.FLIPPED_MASK) >>> 0;
  },
  getTileFlagsAt: function getTileFlagsAt(pos, y) {
    if (!pos) {
      throw new Error("TiledLayer.getTileFlagsAt: pos should be non-null");
    }

    if (y !== undefined) {
      pos = cc.v2(pos, y);
    }

    if (this._isInvalidPosition(pos)) {
      throw new Error("TiledLayer.getTileFlagsAt: invalid position");
    }

    if (!this._tiles) {
      cc.logID(7240);
      return null;
    }

    var idx = Math.floor(pos.x) + Math.floor(pos.y) * this._layerSize.width; // Bits on the far end of the 32-bit global tile ID are used for tile flags


    var tile = this._tiles[idx];
    return (tile & cc.TiledMap.TileFlag.FLIPPED_ALL) >>> 0;
  },
  _setCullingDirty: function _setCullingDirty(value) {
    this._cullingDirty = value;
  },
  _isCullingDirty: function _isCullingDirty() {
    return this._cullingDirty;
  },
  // 'x, y' is the position of viewPort, which's anchor point is at the center of rect.
  // 'width, height' is the size of viewPort.
  _updateViewPort: function _updateViewPort(x, y, width, height) {
    if (this._viewPort.width === width && this._viewPort.height === height && this._viewPort.x === x && this._viewPort.y === y) {
      return;
    }

    this._viewPort.x = x;
    this._viewPort.y = y;
    this._viewPort.width = width;
    this._viewPort.height = height; // if map's type is iso, reserve bottom line is 2 to avoid show empty grid because of iso grid arithmetic

    var reserveLine = 1;

    if (this._layerOrientation === cc.TiledMap.Orientation.ISO) {
      reserveLine = 2;
    }

    var vpx = this._viewPort.x - this._offset.x + this._leftDownToCenterX;
    var vpy = this._viewPort.y - this._offset.y + this._leftDownToCenterY;
    var leftDownX = vpx - this._leftOffset;
    var leftDownY = vpy - this._downOffset;
    var rightTopX = vpx + width + this._rightOffset;
    var rightTopY = vpy + height + this._topOffset;
    var leftDown = this._cullingRect.leftDown;
    var rightTop = this._cullingRect.rightTop;
    if (leftDownX < 0) leftDownX = 0;
    if (leftDownY < 0) leftDownY = 0; // calc left down

    this._positionToRowCol(leftDownX, leftDownY, _tempRowCol); // make range large


    _tempRowCol.row -= reserveLine;
    _tempRowCol.col -= reserveLine; // insure left down row col greater than 0

    _tempRowCol.row = _tempRowCol.row > 0 ? _tempRowCol.row : 0;
    _tempRowCol.col = _tempRowCol.col > 0 ? _tempRowCol.col : 0;

    if (_tempRowCol.row !== leftDown.row || _tempRowCol.col !== leftDown.col) {
      leftDown.row = _tempRowCol.row;
      leftDown.col = _tempRowCol.col;
      this._cullingDirty = true;
    } // show nothing


    if (rightTopX < 0 || rightTopY < 0) {
      _tempRowCol.row = -1;
      _tempRowCol.col = -1;
    } else {
      // calc right top
      this._positionToRowCol(rightTopX, rightTopY, _tempRowCol); // make range large


      _tempRowCol.row++;
      _tempRowCol.col++;
    } // avoid range out of max rect


    if (_tempRowCol.row > this._rightTop.row) _tempRowCol.row = this._rightTop.row;
    if (_tempRowCol.col > this._rightTop.col) _tempRowCol.col = this._rightTop.col;

    if (_tempRowCol.row !== rightTop.row || _tempRowCol.col !== rightTop.col) {
      rightTop.row = _tempRowCol.row;
      rightTop.col = _tempRowCol.col;
      this._cullingDirty = true;
    }
  },
  // the result may not precise, but it dose't matter, it just uses to be got range
  _positionToRowCol: function _positionToRowCol(x, y, result) {
    var TiledMap = cc.TiledMap;
    var Orientation = TiledMap.Orientation;
    var StaggerAxis = TiledMap.StaggerAxis;
    var maptw = this._mapTileSize.width,
        mapth = this._mapTileSize.height,
        maptw2 = maptw * 0.5,
        mapth2 = mapth * 0.5;
    var row = 0,
        col = 0,
        diffX2 = 0,
        diffY2 = 0,
        axis = this._staggerAxis;
    var cols = this._layerSize.width;

    switch (this._layerOrientation) {
      // left top to right dowm
      case Orientation.ORTHO:
        col = Math.floor(x / maptw);
        row = Math.floor(y / mapth);
        break;
      // right top to left down
      // iso can be treat as special hex whose hex side length is 0

      case Orientation.ISO:
        col = Math.floor(x / maptw2);
        row = Math.floor(y / mapth2);
        break;
      // left top to right dowm

      case Orientation.HEX:
        if (axis === StaggerAxis.STAGGERAXIS_Y) {
          row = Math.floor(y / (mapth - this._diffY1));
          diffX2 = row % 2 === 1 ? maptw2 * this._odd_even : 0;
          col = Math.floor((x - diffX2) / maptw);
        } else {
          col = Math.floor(x / (maptw - this._diffX1));
          diffY2 = col % 2 === 1 ? mapth2 * -this._odd_even : 0;
          row = Math.floor((y - diffY2) / mapth);
        }

        break;
    }

    result.row = row;
    result.col = col;
    return result;
  },
  _updateCulling: function _updateCulling() {
    if (CC_EDITOR) {
      this.enableCulling(false);
    } else if (this._enableCulling) {
      this.node._updateWorldMatrix();

      _valueTypes.Mat4.invert(_mat4_temp, this.node._worldMatrix);

      var rect = cc.visibleRect;
      var camera = cc.Camera.findCamera(this.node);

      if (camera) {
        _vec2_temp.x = 0;
        _vec2_temp.y = 0;
        _vec2_temp2.x = _vec2_temp.x + rect.width;
        _vec2_temp2.y = _vec2_temp.y + rect.height;
        camera.getScreenToWorldPoint(_vec2_temp, _vec2_temp);
        camera.getScreenToWorldPoint(_vec2_temp2, _vec2_temp2);

        _valueTypes.Vec2.transformMat4(_vec2_temp, _vec2_temp, _mat4_temp);

        _valueTypes.Vec2.transformMat4(_vec2_temp2, _vec2_temp2, _mat4_temp);

        this._updateViewPort(_vec2_temp.x, _vec2_temp.y, _vec2_temp2.x - _vec2_temp.x, _vec2_temp2.y - _vec2_temp.y);
      }
    }
  },

  /**
   * !#en Layer orientation, which is the same as the map orientation.
   * !#zh 获取 Layer 方向(同地图方向)。
   * @method getLayerOrientation
   * @return {Number}
   * @example
   * let orientation = tiledLayer.getLayerOrientation();
   * cc.log("Layer Orientation: " + orientation);
   */
  getLayerOrientation: function getLayerOrientation() {
    return this._layerOrientation;
  },

  /**
   * !#en properties from the layer. They can be added using Tiled.
   * !#zh 获取 layer 的属性，可以使用 Tiled 编辑器添加属性。
   * @method getProperties
   * @return {Object}
   * @example
   * let properties = tiledLayer.getProperties();
   * cc.log("Properties: " + properties);
   */
  getProperties: function getProperties() {
    return this._properties;
  },
  _updateVertices: function _updateVertices() {
    var TiledMap = cc.TiledMap;
    var TileFlag = TiledMap.TileFlag;
    var FLIPPED_MASK = TileFlag.FLIPPED_MASK;
    var StaggerAxis = TiledMap.StaggerAxis;
    var Orientation = TiledMap.Orientation;
    var vertices = this._vertices;
    vertices.length = 0;
    var layerOrientation = this._layerOrientation,
        tiles = this._tiles;

    if (!tiles) {
      return;
    }

    var rightTop = this._rightTop;
    rightTop.row = -1;
    rightTop.col = -1;
    var maptw = this._mapTileSize.width,
        mapth = this._mapTileSize.height,
        maptw2 = maptw * 0.5,
        mapth2 = mapth * 0.5,
        rows = this._layerSize.height,
        cols = this._layerSize.width,
        grids = this._texGrids;
    var colOffset = 0,
        gid,
        grid,
        left,
        bottom,
        axis,
        diffX1,
        diffY1,
        odd_even,
        diffX2,
        diffY2;

    if (layerOrientation === Orientation.HEX) {
      axis = this._staggerAxis;
      diffX1 = this._diffX1;
      diffY1 = this._diffY1;
      odd_even = this._odd_even;
    }

    var cullingCol = 0,
        cullingRow = 0;
    var tileOffset = null,
        gridGID = 0;
    this._topOffset = 0;
    this._downOffset = 0;
    this._leftOffset = 0;
    this._rightOffset = 0;
    this._hasAniGrid = false; // grid border

    var topBorder = 0,
        downBorder = 0,
        leftBorder = 0,
        rightBorder = 0;

    for (var row = 0; row < rows; ++row) {
      for (var col = 0; col < cols; ++col) {
        var index = colOffset + col;
        gid = tiles[index];
        gridGID = (gid & FLIPPED_MASK) >>> 0;
        grid = grids[gridGID]; // if has animation, grid must be updated per frame

        if (this._animations[gridGID]) {
          this._hasAniGrid = true;
        }

        if (!grid) {
          continue;
        }

        switch (layerOrientation) {
          // left top to right dowm
          case Orientation.ORTHO:
            cullingCol = col;
            cullingRow = rows - row - 1;
            left = cullingCol * maptw;
            bottom = cullingRow * mapth;
            break;
          // right top to left down

          case Orientation.ISO:
            // if not consider about col, then left is 'w/2 * (rows - row - 1)'
            // if consider about col then left must add 'w/2 * col'
            // so left is 'w/2 * (rows - row - 1) + w/2 * col'
            // combine expression is 'w/2 * (rows - row + col -1)'
            cullingCol = rows + col - row - 1; // if not consider about row, then bottom is 'h/2 * (cols - col -1)'
            // if consider about row then bottom must add 'h/2 * (rows - row - 1)'
            // so bottom is 'h/2 * (cols - col -1) + h/2 * (rows - row - 1)'
            // combine expressionn is 'h/2 * (rows + cols - col - row - 2)'

            cullingRow = rows + cols - col - row - 2;
            left = maptw2 * cullingCol;
            bottom = mapth2 * cullingRow;
            break;
          // left top to right dowm

          case Orientation.HEX:
            diffX2 = axis === StaggerAxis.STAGGERAXIS_Y && row % 2 === 1 ? maptw2 * odd_even : 0;
            diffY2 = axis === StaggerAxis.STAGGERAXIS_X && col % 2 === 1 ? mapth2 * -odd_even : 0;
            left = col * (maptw - diffX1) + diffX2;
            bottom = (rows - row - 1) * (mapth - diffY1) + diffY2;
            cullingCol = col;
            cullingRow = rows - row - 1;
            break;
        }

        var rowData = vertices[cullingRow] = vertices[cullingRow] || {
          minCol: 0,
          maxCol: 0
        };
        var colData = rowData[cullingCol] = rowData[cullingCol] || {}; // record each row range, it will faster when culling grid

        if (rowData.minCol > cullingCol) {
          rowData.minCol = cullingCol;
        }

        if (rowData.maxCol < cullingCol) {
          rowData.maxCol = cullingCol;
        } // record max rect, when viewPort is bigger than layer, can make it smaller


        if (rightTop.row < cullingRow) {
          rightTop.row = cullingRow;
        }

        if (rightTop.col < cullingCol) {
          rightTop.col = cullingCol;
        } // _offset is whole layer offset
        // tileOffset is tileset offset which is related to each grid
        // tileOffset coordinate system's y axis is opposite with engine's y axis.


        tileOffset = grid.tileset.tileOffset;
        left += this._offset.x + tileOffset.x;
        bottom += this._offset.y - tileOffset.y;
        topBorder = -tileOffset.y + grid.tileset._tileSize.height - mapth;
        topBorder = topBorder < 0 ? 0 : topBorder;
        downBorder = tileOffset.y < 0 ? 0 : tileOffset.y;
        leftBorder = -tileOffset.x < 0 ? 0 : -tileOffset.x;
        rightBorder = tileOffset.x + grid.tileset._tileSize.width - maptw;
        rightBorder = rightBorder < 0 ? 0 : rightBorder;

        if (this._rightOffset < leftBorder) {
          this._rightOffset = leftBorder;
        }

        if (this._leftOffset < rightBorder) {
          this._leftOffset = rightBorder;
        }

        if (this._topOffset < downBorder) {
          this._topOffset = downBorder;
        }

        if (this._downOffset < topBorder) {
          this._downOffset = topBorder;
        }

        colData.left = left;
        colData.bottom = bottom; // this index is tiledmap grid index

        colData.index = index;
      }

      colOffset += cols;
    }

    this._verticesDirty = false;
  },

  /**
   * !#en
   * Get the TiledTile with the tile coordinate.<br/>
   * If there is no tile in the specified coordinate and forceCreate parameter is true, <br/>
   * then will create a new TiledTile at the coordinate.
   * The renderer will render the tile with the rotation, scale, position and color property of the TiledTile.
   * !#zh
   * 通过指定的 tile 坐标获取对应的 TiledTile。 <br/>
   * 如果指定的坐标没有 tile，并且设置了 forceCreate 那么将会在指定的坐标创建一个新的 TiledTile 。<br/>
   * 在渲染这个 tile 的时候，将会使用 TiledTile 的节点的旋转、缩放、位移、颜色属性。<br/>
   * @method getTiledTileAt
   * @param {Integer} x
   * @param {Integer} y
   * @param {Boolean} forceCreate
   * @return {cc.TiledTile}
   * @example
   * let tile = tiledLayer.getTiledTileAt(100, 100, true);
   * cc.log(tile);
   */
  getTiledTileAt: function getTiledTileAt(x, y, forceCreate) {
    if (this._isInvalidPosition(x, y)) {
      throw new Error("TiledLayer.getTiledTileAt: invalid position");
    }

    if (!this._tiles) {
      cc.logID(7236);
      return null;
    }

    var index = Math.floor(x) + Math.floor(y) * this._layerSize.width;

    var tile = this._tiledTiles[index];

    if (!tile && forceCreate) {
      var node = new cc.Node();
      tile = node.addComponent(cc.TiledTile);
      tile._x = x;
      tile._y = y;
      tile._layer = this;

      tile._updateInfo();

      node.parent = this.node;
      return tile;
    }

    return tile;
  },

  /** 
   * !#en
   * Change tile to TiledTile at the specified coordinate.
   * !#zh
   * 将指定的 tile 坐标替换为指定的 TiledTile。
   * @method setTiledTileAt
   * @param {Integer} x
   * @param {Integer} y
   * @param {cc.TiledTile} tiledTile
   * @return {cc.TiledTile}
   */
  setTiledTileAt: function setTiledTileAt(x, y, tiledTile) {
    if (this._isInvalidPosition(x, y)) {
      throw new Error("TiledLayer.setTiledTileAt: invalid position");
    }

    if (!this._tiles) {
      cc.logID(7236);
      return null;
    }

    var index = Math.floor(x) + Math.floor(y) * this._layerSize.width;

    this._tiledTiles[index] = tiledTile;
    this._cullingDirty = true;

    if (tiledTile) {
      this._hasTiledNodeGrid = true;
    } else {
      this._hasTiledNodeGrid = this._tiledTiles.some(function (tiledNode, index) {
        return !!tiledNode;
      });
    }

    return tiledTile;
  },

  /**
   * !#en Return texture.
   * !#zh 获取纹理。
   * @method getTexture
   * @param index The index of textures
   * @return {Texture2D}
   */
  getTexture: function getTexture(index) {
    index = index || 0;

    if (this._textures && index >= 0 && this._textures.length > index) {
      return this._textures[index];
    }

    return null;
  },

  /**
   * !#en Return texture.
   * !#zh 获取纹理。
   * @method getTextures
   * @return {Texture2D}
   */
  getTextures: function getTextures() {
    return this._textures;
  },

  /**
   * !#en Set the texture.
   * !#zh 设置纹理。
   * @method setTexture
   * @param {Texture2D} texture
   */
  setTexture: function setTexture(texture) {
    this.setTextures([texture]);
  },

  /**
   * !#en Set the texture.
   * !#zh 设置纹理。
   * @method setTexture
   * @param {Texture2D} textures
   */
  setTextures: function setTextures(textures) {
    this._textures = textures;

    this._activateMaterial();
  },

  /**
   * !#en Gets layer size.
   * !#zh 获得层大小。
   * @method getLayerSize
   * @return {Size}
   * @example
   * let size = tiledLayer.getLayerSize();
   * cc.log("layer size: " + size);
   */
  getLayerSize: function getLayerSize() {
    return this._layerSize;
  },

  /**
   * !#en Size of the map's tile (could be different from the tile's size).
   * !#zh 获取 tile 的大小( tile 的大小可能会有所不同)。
   * @method getMapTileSize
   * @return {Size}
   * @example
   * let mapTileSize = tiledLayer.getMapTileSize();
   * cc.log("MapTile size: " + mapTileSize);
   */
  getMapTileSize: function getMapTileSize() {
    return this._mapTileSize;
  },

  /**
   * !#en Gets Tile set first information for the layer.
   * !#zh 获取 layer 索引位置为0的 Tileset 信息。
   * @method getTileSet
   * @param index The index of tilesets
   * @return {TMXTilesetInfo}
   */
  getTileSet: function getTileSet(index) {
    index = index || 0;

    if (this._tilesets && index >= 0 && this._tilesets.length > index) {
      return this._tilesets[index];
    }

    return null;
  },

  /**
   * !#en Gets tile set all information for the layer.
   * !#zh 获取 layer 所有的 Tileset 信息。
   * @method getTileSet
   * @return {TMXTilesetInfo}
   */
  getTileSets: function getTileSets() {
    return this._tilesets;
  },

  /**
   * !#en Sets tile set information for the layer.
   * !#zh 设置 layer 的 tileset 信息。
   * @method setTileSet
   * @param {TMXTilesetInfo} tileset
   */
  setTileSet: function setTileSet(tileset) {
    this.setTileSets([tileset]);
  },

  /**
   * !#en Sets Tile set information for the layer.
   * !#zh 设置 layer 的 Tileset 信息。
   * @method setTileSets
   * @param {TMXTilesetInfo} tilesets
   */
  setTileSets: function setTileSets(tilesets) {
    this._tilesets = tilesets;
    var textures = this._textures = [];
    var texGrids = this._texGrids = [];

    for (var i = 0; i < tilesets.length; i++) {
      var tileset = tilesets[i];

      if (tileset) {
        textures[i] = tileset.sourceImage;
      }
    }

    cc.TiledMap.loadAllTextures(textures, function () {
      for (var _i = 0, l = tilesets.length; _i < l; ++_i) {
        var tilesetInfo = tilesets[_i];
        if (!tilesetInfo) continue;
        cc.TiledMap.fillTextureGrids(tilesetInfo, texGrids, _i);
      }

      this._prepareToRender();
    }.bind(this));
  },
  _traverseAllGrid: function _traverseAllGrid() {
    var tiles = this._tiles;
    var texGrids = this._texGrids;
    var tilesetIndexArr = this._tilesetIndexArr;
    var tilesetIdxMap = {};
    var TiledMap = cc.TiledMap;
    var TileFlag = TiledMap.TileFlag;
    var FLIPPED_MASK = TileFlag.FLIPPED_MASK;
    tilesetIndexArr.length = 0;

    for (var i = 0; i < tiles.length; i++) {
      var gid = tiles[i];
      if (gid === 0) continue;
      gid = (gid & FLIPPED_MASK) >>> 0;
      var grid = texGrids[gid];

      if (!grid) {
        cc.error("CCTiledLayer:_traverseAllGrid grid is null, gid is:", gid);
        continue;
      }

      var tilesetIdx = grid.texId;
      if (tilesetIdxMap[tilesetIdx]) continue;
      tilesetIdxMap[tilesetIdx] = true;
      tilesetIndexArr.push(tilesetIdx);
    }
  },
  _init: function _init(layerInfo, mapInfo, tilesets, textures, texGrids) {
    this._cullingDirty = true;
    this._layerInfo = layerInfo;
    this._mapInfo = mapInfo;
    var size = layerInfo._layerSize; // layerInfo

    this._layerName = layerInfo.name;
    this._tiles = layerInfo._tiles;
    this._properties = layerInfo.properties;
    this._layerSize = size;
    this._minGID = layerInfo._minGID;
    this._maxGID = layerInfo._maxGID;
    this._opacity = layerInfo._opacity;
    this._renderOrder = mapInfo.renderOrder;
    this._staggerAxis = mapInfo.getStaggerAxis();
    this._staggerIndex = mapInfo.getStaggerIndex();
    this._hexSideLength = mapInfo.getHexSideLength();
    this._animations = mapInfo.getTileAnimations(); // tilesets

    this._tilesets = tilesets; // textures

    this._textures = textures; // grid texture

    this._texGrids = texGrids; // mapInfo

    this._layerOrientation = mapInfo.orientation;
    this._mapTileSize = mapInfo.getTileSize();
    var maptw = this._mapTileSize.width;
    var mapth = this._mapTileSize.height;
    var layerW = this._layerSize.width;
    var layerH = this._layerSize.height;

    if (this._layerOrientation === cc.TiledMap.Orientation.HEX) {
      // handle hex map
      var TiledMap = cc.TiledMap;
      var StaggerAxis = TiledMap.StaggerAxis;
      var StaggerIndex = TiledMap.StaggerIndex;
      var width = 0,
          height = 0;
      this._odd_even = this._staggerIndex === StaggerIndex.STAGGERINDEX_ODD ? 1 : -1;

      if (this._staggerAxis === StaggerAxis.STAGGERAXIS_X) {
        this._diffX1 = (maptw - this._hexSideLength) / 2;
        this._diffY1 = 0;
        height = mapth * (layerH + 0.5);
        width = (maptw + this._hexSideLength) * Math.floor(layerW / 2) + maptw * (layerW % 2);
      } else {
        this._diffX1 = 0;
        this._diffY1 = (mapth - this._hexSideLength) / 2;
        width = maptw * (layerW + 0.5);
        height = (mapth + this._hexSideLength) * Math.floor(layerH / 2) + mapth * (layerH % 2);
      }

      this.node.setContentSize(width, height);
    } else if (this._layerOrientation === cc.TiledMap.Orientation.ISO) {
      var wh = layerW + layerH;
      this.node.setContentSize(maptw * 0.5 * wh, mapth * 0.5 * wh);
    } else {
      this.node.setContentSize(layerW * maptw, layerH * mapth);
    } // offset (after layer orientation is set);


    this._offset = cc.v2(layerInfo.offset.x, -layerInfo.offset.y);
    this._useAutomaticVertexZ = false;
    this._vertexZvalue = 0;

    this._syncAnchorPoint();

    this._prepareToRender();
  },
  _prepareToRender: function _prepareToRender() {
    this._updateVertices();

    this._traverseAllGrid();

    this._updateAllUserNode();

    this._activateMaterial();
  },
  _activateMaterial: function _activateMaterial() {
    var tilesetIndexArr = this._tilesetIndexArr;

    if (tilesetIndexArr.length === 0) {
      this.disableRender();
      return;
    }

    var texIdMatIdx = this._texIdToMatIndex = {};
    var textures = this._textures;
    var matLen = tilesetIndexArr.length;

    for (var i = 0; i < matLen; i++) {
      var tilesetIdx = tilesetIndexArr[i];
      var texture = textures[tilesetIdx];
      var material = this._materials[i];

      if (!material) {
        material = Material.getBuiltinMaterial('2d-sprite');
      }

      material = _materialVariant["default"].create(material, this);
      material.define('CC_USE_MODEL', true);
      material.setProperty('texture', texture);
      this._materials[i] = material;
      texIdMatIdx[tilesetIdx] = i;
    }

    this._materials.length = matLen;
    this.markForRender(true);
  }
});
cc.TiledLayer = module.exports = TiledLayer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNDVGlsZWRMYXllci5qcyJdLCJuYW1lcyI6WyJSZW5kZXJDb21wb25lbnQiLCJyZXF1aXJlIiwiTWF0ZXJpYWwiLCJSZW5kZXJGbG93IiwiX21hdDRfdGVtcCIsImNjIiwibWF0NCIsIl92ZWMyX3RlbXAiLCJ2MiIsIl92ZWMyX3RlbXAyIiwiX3RlbXBSb3dDb2wiLCJyb3ciLCJjb2wiLCJUaWxlZFVzZXJOb2RlRGF0YSIsIkNsYXNzIiwibmFtZSIsIkNvbXBvbmVudCIsImN0b3IiLCJfaW5kZXgiLCJfcm93IiwiX2NvbCIsIl90aWxlZExheWVyIiwiVGlsZWRMYXllciIsImVkaXRvciIsImluc3BlY3RvciIsIl91c2VyTm9kZUdyaWQiLCJfdXNlck5vZGVNYXAiLCJfdXNlck5vZGVEaXJ0eSIsIl90aWxlZFRpbGVzIiwiX3RpbGVzZXRJbmRleEFyciIsIl90ZXhJZFRvTWF0SW5kZXgiLCJfdmlld1BvcnQiLCJ4IiwieSIsIndpZHRoIiwiaGVpZ2h0IiwiX2N1bGxpbmdSZWN0IiwibGVmdERvd24iLCJyaWdodFRvcCIsIl9jdWxsaW5nRGlydHkiLCJfcmlnaHRUb3AiLCJfbGF5ZXJJbmZvIiwiX21hcEluZm8iLCJfdG9wT2Zmc2V0IiwiX2Rvd25PZmZzZXQiLCJfbGVmdE9mZnNldCIsIl9yaWdodE9mZnNldCIsIl90aWxlcyIsIl92ZXJ0aWNlcyIsIl92ZXJ0aWNlc0RpcnR5IiwiX2xheWVyTmFtZSIsIl9sYXllck9yaWVudGF0aW9uIiwiX3RleEdyaWRzIiwiX3RleHR1cmVzIiwiX3RpbGVzZXRzIiwiX2xlZnREb3duVG9DZW50ZXJYIiwiX2xlZnREb3duVG9DZW50ZXJZIiwiX2hhc1RpbGVkTm9kZUdyaWQiLCJfaGFzQW5pR3JpZCIsIl9hbmltYXRpb25zIiwiX2VuYWJsZUN1bGxpbmciLCJtYWNybyIsIkVOQUJMRV9USUxFRE1BUF9DVUxMSU5HIiwiX2hhc1RpbGVkTm9kZSIsIl9oYXNBbmltYXRpb24iLCJlbmFibGVDdWxsaW5nIiwidmFsdWUiLCJhZGRVc2VyTm9kZSIsIm5vZGUiLCJkYXRhQ29tcCIsImdldENvbXBvbmVudCIsIndhcm4iLCJhZGRDb21wb25lbnQiLCJwYXJlbnQiLCJfcmVuZGVyRmxhZyIsIkZMQUdfQlJFQUtfRkxPVyIsIl9pZCIsIl9ub2RlTG9jYWxQb3NUb0xheWVyUG9zIiwiX3Bvc2l0aW9uVG9Sb3dDb2wiLCJfYWRkVXNlck5vZGVUb0dyaWQiLCJfdXBkYXRlQ3VsbGluZ09mZnNldEJ5VXNlck5vZGUiLCJvbiIsIk5vZGUiLCJFdmVudFR5cGUiLCJQT1NJVElPTl9DSEFOR0VEIiwiX3VzZXJOb2RlUG9zQ2hhbmdlIiwiU0laRV9DSEFOR0VEIiwiX3VzZXJOb2RlU2l6ZUNoYW5nZSIsInJlbW92ZVVzZXJOb2RlIiwib2ZmIiwiX3JlbW92ZVVzZXJOb2RlRnJvbUdyaWQiLCJfcmVtb3ZlQ29tcG9uZW50IiwiZGVzdHJveSIsInJlbW92ZUZyb21QYXJlbnQiLCJkZXN0cm95VXNlck5vZGUiLCJub2RlUG9zIiwib3V0IiwiX2dldE5vZGVzQnlSb3dDb2wiLCJyb3dEYXRhIiwiX2dldE5vZGVzQ291bnRCeVJvdyIsImNvdW50IiwiX3VwZGF0ZUFsbFVzZXJOb2RlIiwiZGF0YUlkIiwic2VsZiIsIl9saW1pdEluTGF5ZXIiLCJpbmRleCIsImNvbERhdGEiLCJsaXN0IiwibGVuZ3RoIiwicm93Q29sIiwidGVtcFJvd0NvbCIsInB1c2giLCJfaXNVc2VyTm9kZURpcnR5IiwiX3NldFVzZXJOb2RlRGlydHkiLCJvbkVuYWJsZSIsIl9zdXBlciIsIkFOQ0hPUl9DSEFOR0VEIiwiX3N5bmNBbmNob3JQb2ludCIsIl9hY3RpdmF0ZU1hdGVyaWFsIiwib25EaXNhYmxlIiwiYW5jaG9yWCIsInNjYWxlWCIsImFuY2hvclkiLCJzY2FsZVkiLCJvbkRlc3Ryb3kiLCJfYnVmZmVyIiwiX3JlbmRlckRhdGFMaXN0IiwiZ2V0TGF5ZXJOYW1lIiwic2V0TGF5ZXJOYW1lIiwibGF5ZXJOYW1lIiwiZ2V0UHJvcGVydHkiLCJwcm9wZXJ0eU5hbWUiLCJfcHJvcGVydGllcyIsImdldFBvc2l0aW9uQXQiLCJwb3MiLCJ1bmRlZmluZWQiLCJNYXRoIiwiZmxvb3IiLCJyZXQiLCJUaWxlZE1hcCIsIk9yaWVudGF0aW9uIiwiT1JUSE8iLCJfcG9zaXRpb25Gb3JPcnRob0F0IiwiSVNPIiwiX3Bvc2l0aW9uRm9ySXNvQXQiLCJIRVgiLCJfcG9zaXRpb25Gb3JIZXhBdCIsIl9pc0ludmFsaWRQb3NpdGlvbiIsIl9sYXllclNpemUiLCJvZmZzZXRYIiwib2Zmc2V0WSIsImdpZCIsInRpbGVzZXQiLCJvZmZzZXQiLCJ0aWxlT2Zmc2V0IiwiX21hcFRpbGVTaXplIiwidGlsZVdpZHRoIiwidGlsZUhlaWdodCIsInJvd3MiLCJvZGRfZXZlbiIsIl9zdGFnZ2VySW5kZXgiLCJTdGFnZ2VySW5kZXgiLCJTVEFHR0VSSU5ERVhfT0REIiwiZGlmZlgiLCJkaWZmWSIsIl9zdGFnZ2VyQXhpcyIsIlN0YWdnZXJBeGlzIiwiU1RBR0dFUkFYSVNfWSIsIl9oZXhTaWRlTGVuZ3RoIiwiU1RBR0dFUkFYSVNfWCIsInNldFRpbGVHSURBdCIsInBvc09yWCIsImZsYWdzT3JZIiwiZmxhZ3MiLCJFcnJvciIsIlZlYzIiLCJsb2dJRCIsImZpcnN0R2lkIiwiY3VycmVudEZsYWdzIiwiZ2V0VGlsZUZsYWdzQXQiLCJjdXJyZW50R0lEIiwiZ2V0VGlsZUdJREF0IiwiZ2lkQW5kRmxhZ3MiLCJfdXBkYXRlVGlsZUZvckdJRCIsImlkeCIsInRpbGUiLCJUaWxlRmxhZyIsIkZMSVBQRURfTUFTSyIsIkZMSVBQRURfQUxMIiwiX3NldEN1bGxpbmdEaXJ0eSIsIl9pc0N1bGxpbmdEaXJ0eSIsIl91cGRhdGVWaWV3UG9ydCIsInJlc2VydmVMaW5lIiwidnB4IiwiX29mZnNldCIsInZweSIsImxlZnREb3duWCIsImxlZnREb3duWSIsInJpZ2h0VG9wWCIsInJpZ2h0VG9wWSIsInJlc3VsdCIsIm1hcHR3IiwibWFwdGgiLCJtYXB0dzIiLCJtYXB0aDIiLCJkaWZmWDIiLCJkaWZmWTIiLCJheGlzIiwiY29scyIsIl9kaWZmWTEiLCJfb2RkX2V2ZW4iLCJfZGlmZlgxIiwiX3VwZGF0ZUN1bGxpbmciLCJDQ19FRElUT1IiLCJfdXBkYXRlV29ybGRNYXRyaXgiLCJNYXQ0IiwiaW52ZXJ0IiwiX3dvcmxkTWF0cml4IiwicmVjdCIsInZpc2libGVSZWN0IiwiY2FtZXJhIiwiQ2FtZXJhIiwiZmluZENhbWVyYSIsImdldFNjcmVlblRvV29ybGRQb2ludCIsInRyYW5zZm9ybU1hdDQiLCJnZXRMYXllck9yaWVudGF0aW9uIiwiZ2V0UHJvcGVydGllcyIsIl91cGRhdGVWZXJ0aWNlcyIsInZlcnRpY2VzIiwibGF5ZXJPcmllbnRhdGlvbiIsInRpbGVzIiwiZ3JpZHMiLCJjb2xPZmZzZXQiLCJncmlkIiwibGVmdCIsImJvdHRvbSIsImRpZmZYMSIsImRpZmZZMSIsImN1bGxpbmdDb2wiLCJjdWxsaW5nUm93IiwiZ3JpZEdJRCIsInRvcEJvcmRlciIsImRvd25Cb3JkZXIiLCJsZWZ0Qm9yZGVyIiwicmlnaHRCb3JkZXIiLCJtaW5Db2wiLCJtYXhDb2wiLCJfdGlsZVNpemUiLCJnZXRUaWxlZFRpbGVBdCIsImZvcmNlQ3JlYXRlIiwiVGlsZWRUaWxlIiwiX3giLCJfeSIsIl9sYXllciIsIl91cGRhdGVJbmZvIiwic2V0VGlsZWRUaWxlQXQiLCJ0aWxlZFRpbGUiLCJzb21lIiwidGlsZWROb2RlIiwiZ2V0VGV4dHVyZSIsImdldFRleHR1cmVzIiwic2V0VGV4dHVyZSIsInRleHR1cmUiLCJzZXRUZXh0dXJlcyIsInRleHR1cmVzIiwiZ2V0TGF5ZXJTaXplIiwiZ2V0TWFwVGlsZVNpemUiLCJnZXRUaWxlU2V0IiwiZ2V0VGlsZVNldHMiLCJzZXRUaWxlU2V0Iiwic2V0VGlsZVNldHMiLCJ0aWxlc2V0cyIsInRleEdyaWRzIiwiaSIsInNvdXJjZUltYWdlIiwibG9hZEFsbFRleHR1cmVzIiwibCIsInRpbGVzZXRJbmZvIiwiZmlsbFRleHR1cmVHcmlkcyIsIl9wcmVwYXJlVG9SZW5kZXIiLCJiaW5kIiwiX3RyYXZlcnNlQWxsR3JpZCIsInRpbGVzZXRJbmRleEFyciIsInRpbGVzZXRJZHhNYXAiLCJlcnJvciIsInRpbGVzZXRJZHgiLCJ0ZXhJZCIsIl9pbml0IiwibGF5ZXJJbmZvIiwibWFwSW5mbyIsInNpemUiLCJwcm9wZXJ0aWVzIiwiX21pbkdJRCIsIl9tYXhHSUQiLCJfb3BhY2l0eSIsIl9yZW5kZXJPcmRlciIsInJlbmRlck9yZGVyIiwiZ2V0U3RhZ2dlckF4aXMiLCJnZXRTdGFnZ2VySW5kZXgiLCJnZXRIZXhTaWRlTGVuZ3RoIiwiZ2V0VGlsZUFuaW1hdGlvbnMiLCJvcmllbnRhdGlvbiIsImdldFRpbGVTaXplIiwibGF5ZXJXIiwibGF5ZXJIIiwic2V0Q29udGVudFNpemUiLCJ3aCIsIl91c2VBdXRvbWF0aWNWZXJ0ZXhaIiwiX3ZlcnRleFp2YWx1ZSIsImRpc2FibGVSZW5kZXIiLCJ0ZXhJZE1hdElkeCIsIm1hdExlbiIsIm1hdGVyaWFsIiwiX21hdGVyaWFscyIsImdldEJ1aWx0aW5NYXRlcmlhbCIsIk1hdGVyaWFsVmFyaWFudCIsImNyZWF0ZSIsImRlZmluZSIsInNldFByb3BlcnR5IiwibWFya0ZvclJlbmRlciIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUE2QkE7O0FBQ0E7Ozs7QUE5QkE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsSUFBTUEsZUFBZSxHQUFHQyxPQUFPLENBQUMsc0NBQUQsQ0FBL0I7O0FBQ0EsSUFBTUMsUUFBUSxHQUFHRCxPQUFPLENBQUMsb0NBQUQsQ0FBeEI7O0FBQ0EsSUFBTUUsVUFBVSxHQUFHRixPQUFPLENBQUMsOEJBQUQsQ0FBMUI7O0FBSUEsSUFBSUcsVUFBVSxHQUFHQyxFQUFFLENBQUNDLElBQUgsRUFBakI7O0FBQ0EsSUFBSUMsVUFBVSxHQUFHRixFQUFFLENBQUNHLEVBQUgsRUFBakI7O0FBQ0EsSUFBSUMsV0FBVyxHQUFHSixFQUFFLENBQUNHLEVBQUgsRUFBbEI7O0FBQ0EsSUFBSUUsV0FBVyxHQUFHO0FBQUND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VUFBSSxDQUFDdUMsUUFBTCxFQUFlO0FBQ1hBLFFBQUFBLFFBQVEsR0FBR3RULFFBQVEsQ0FBQ3dULGtCQUFULENBQTRCLFdBQTVCLENBQVg7QUFDSDs7QUFDREYsTUFBQUEsUUFBUSxHQUFHRyw0QkFBZ0JDLE1BQWhCLENBQXVCSixRQUF2QixFQUFpQyxJQUFqQyxDQUFYO0FBRUFBLE1BQUFBLFFBQVEsQ0FBQ0ssTUFBVCxDQUFnQixjQUFoQixFQUFnQyxJQUFoQztBQUNBTCxNQUFBQSxRQUFRLENBQUNNLFdBQVQsQ0FBcUIsU0FBckIsRUFBZ0N4RCxPQUFoQztBQUVBLFdBQUttRCxVQUFMLENBQWdCeEMsQ0FBaEIsSUFBcUJ1QyxRQUFyQjtBQUVBRixNQUFBQSxXQUFXLENBQUN6QixVQUFELENBQVgsR0FBMEJaLENBQTFCO0FBQ0g7O0FBQ0QsU0FBS3dDLFVBQUwsQ0FBZ0I3TSxNQUFoQixHQUF5QjJNLE1BQXpCO0FBQ0EsU0FBS1EsYUFBTCxDQUFtQixJQUFuQjtBQUNIO0FBcHZDcUIsQ0FBVCxDQUFqQjtBQXV2Q0ExVCxFQUFFLENBQUNpQixVQUFILEdBQWdCMFMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCM1MsVUFBakMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cblxuIGh0dHBzOi8vd3d3LmNvY29zLmNvbS9cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cblxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5jb25zdCBSZW5kZXJDb21wb25lbnQgPSByZXF1aXJlKCcuLi9jb3JlL2NvbXBvbmVudHMvQ0NSZW5kZXJDb21wb25lbnQnKTtcbmNvbnN0IE1hdGVyaWFsID0gcmVxdWlyZSgnLi4vY29yZS9hc3NldHMvbWF0ZXJpYWwvQ0NNYXRlcmlhbCcpO1xuY29uc3QgUmVuZGVyRmxvdyA9IHJlcXVpcmUoJy4uL2NvcmUvcmVuZGVyZXIvcmVuZGVyLWZsb3cnKTtcblxuaW1wb3J0IHsgTWF0NCwgVmVjMiB9IGZyb20gJy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xuaW1wb3J0IE1hdGVyaWFsVmFyaWFudCBmcm9tICcuLi9jb3JlL2Fzc2V0cy9tYXRlcmlhbC9tYXRlcmlhbC12YXJpYW50JztcbmxldCBfbWF0NF90ZW1wID0gY2MubWF0NCgpO1xubGV0IF92ZWMyX3RlbXAgPSBjYy52MigpO1xubGV0IF92ZWMyX3RlbXAyID0gY2MudjIoKTtcbmxldCBfdGVtcFJvd0NvbCA9IHtyb3c6MCwgY29sOjB9O1xuXG5sZXQgVGlsZWRVc2VyTm9kZURhdGEgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlRpbGVkVXNlck5vZGVEYXRhJyxcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBjdG9yICgpIHtcbiAgICAgICAgdGhpcy5faW5kZXggPSAtMTtcbiAgICAgICAgdGhpcy5fcm93ID0gLTE7XG4gICAgICAgIHRoaXMuX2NvbCA9IC0xO1xuICAgICAgICB0aGlzLl90aWxlZExheWVyID0gbnVsbDtcbiAgICB9XG5cbn0pO1xuXG4vKipcbiAqICEjZW4gUmVuZGVyIHRoZSBUTVggbGF5ZXIuXG4gKiAhI3poIOa4suafkyBUTVggbGF5ZXLjgIJcbiAqIEBjbGFzcyBUaWxlZExheWVyXG4gKiBAZXh0ZW5kcyBDb21wb25lbnRcbiAqL1xubGV0IFRpbGVkTGF5ZXIgPSBjYy5DbGFzcyh7XG4gICAgbmFtZTogJ2NjLlRpbGVkTGF5ZXInLFxuXG4gICAgLy8gSW5oZXJpdHMgZnJvbSB0aGUgYWJzdHJhY3QgY2xhc3MgZGlyZWN0bHksXG4gICAgLy8gYmVjYXVzZSBUaWxlZExheWVyIG5vdCBjcmVhdGUgb3IgbWFpbnRhaW5zIHRoZSBzZ05vZGUgYnkgaXRzZWxmLlxuICAgIGV4dGVuZHM6IFJlbmRlckNvbXBvbmVudCxcblxuICAgIGVkaXRvcjoge1xuICAgICAgICBpbnNwZWN0b3I6ICdwYWNrYWdlczovL2luc3BlY3Rvci9pbnNwZWN0b3JzL2NvbXBzL3RpbGVkLWxheWVyLmpzJyxcbiAgICB9LFxuXG4gICAgY3RvciAoKSB7XG4gICAgICAgIHRoaXMuX3VzZXJOb2RlR3JpZCA9IHt9Oy8vIFtyb3ddW2NvbF0gPSB7Y291bnQ6IDAsIG5vZGVzTGlzdDogW119O1xuICAgICAgICB0aGlzLl91c2VyTm9kZU1hcCA9IHt9Oy8vIFtpZF0gPSBub2RlO1xuICAgICAgICB0aGlzLl91c2VyTm9kZURpcnR5ID0gZmFsc2U7XG5cbiAgICAgICAgLy8gc3RvcmUgdGhlIGxheWVyIHRpbGVzIG5vZGUsIGluZGV4IGlzIGNhY3VsYXRlZCBieSAneCArIHdpZHRoICogeScsIGZvcm1hdCBsaWtlcyAnWzBdPXRpbGVOb2RlMCxbMV09dGlsZU5vZGUxLCAuLi4nXG4gICAgICAgIHRoaXMuX3RpbGVkVGlsZXMgPSBbXTtcblxuICAgICAgICAvLyBzdG9yZSB0aGUgbGF5ZXIgdGlsZXNldHMgaW5kZXggYXJyYXlcbiAgICAgICAgdGhpcy5fdGlsZXNldEluZGV4QXJyID0gW107XG4gICAgICAgIC8vIHRleHR1cmUgaWQgdG8gbWF0ZXJpYWwgaW5kZXhcbiAgICAgICAgdGhpcy5fdGV4SWRUb01hdEluZGV4ID0ge307XG5cbiAgICAgICAgdGhpcy5fdmlld1BvcnQgPSB7eDotMSwgeTotMSwgd2lkdGg6LTEsIGhlaWdodDotMX07XG4gICAgICAgIHRoaXMuX2N1bGxpbmdSZWN0ID0ge1xuICAgICAgICAgICAgbGVmdERvd246e3JvdzotMSwgY29sOi0xfSxcbiAgICAgICAgICAgIHJpZ2h0VG9wOntyb3c6LTEsIGNvbDotMX1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fY3VsbGluZ0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcmlnaHRUb3AgPSB7cm93Oi0xLCBjb2w6LTF9O1xuXG4gICAgICAgIHRoaXMuX2xheWVySW5mbyA9IG51bGw7XG4gICAgICAgIHRoaXMuX21hcEluZm8gPSBudWxsO1xuXG4gICAgICAgIC8vIHJlY29yZCBtYXggb3IgbWluIHRpbGUgdGV4dHVyZSBvZmZzZXQsIFxuICAgICAgICAvLyBpdCB3aWxsIG1ha2UgY3VsbGluZyByZWN0IG1vcmUgbGFyZ2UsIHdoaWNoIGluc3VyZSBjdWxsaW5nIHJlY3QgY29ycmVjdC5cbiAgICAgICAgdGhpcy5fdG9wT2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5fZG93bk9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMuX2xlZnRPZmZzZXQgPSAwO1xuICAgICAgICB0aGlzLl9yaWdodE9mZnNldCA9IDA7XG5cbiAgICAgICAgLy8gc3RvcmUgdGhlIGxheWVyIHRpbGVzLCBpbmRleCBpcyBjYWN1bGF0ZWQgYnkgJ3ggKyB3aWR0aCAqIHknLCBmb3JtYXQgbGlrZXMgJ1swXT1naWQwLFsxXT1naWQxLCAuLi4nXG4gICAgICAgIHRoaXMuX3RpbGVzID0gW107XG4gICAgICAgIC8vIHZlcnRleCBhcnJheVxuICAgICAgICB0aGlzLl92ZXJ0aWNlcyA9IFtdO1xuICAgICAgICAvLyB2ZXJ0aWNlcyBkaXJ0eVxuICAgICAgICB0aGlzLl92ZXJ0aWNlc0RpcnR5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLl9sYXllck5hbWUgPSAnJztcbiAgICAgICAgdGhpcy5fbGF5ZXJPcmllbnRhdGlvbiA9IG51bGw7XG5cbiAgICAgICAgLy8gc3RvcmUgYWxsIGxheWVyIGdpZCBjb3JyZXNwb25kaW5nIHRleHR1cmUgaW5mbywgaW5kZXggaXMgZ2lkLCBmb3JtYXQgbGlrZXMgJ1tnaWQwXT10ZXgtaW5mbyxbZ2lkMV09dGV4LWluZm8sIC4uLidcbiAgICAgICAgdGhpcy5fdGV4R3JpZHMgPSBudWxsO1xuICAgICAgICAvLyBzdG9yZSBhbGwgdGlsZXNldCB0ZXh0dXJlLCBpbmRleCBpcyB0aWxlc2V0IGluZGV4LCBmb3JtYXQgbGlrZXMgJ1swXT10ZXh0dXJlMCwgWzFdPXRleHR1cmUxLCAuLi4nXG4gICAgICAgIHRoaXMuX3RleHR1cmVzID0gbnVsbDtcbiAgICAgICAgdGhpcy5fdGlsZXNldHMgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuX2xlZnREb3duVG9DZW50ZXJYID0gMDtcbiAgICAgICAgdGhpcy5fbGVmdERvd25Ub0NlbnRlclkgPSAwO1xuXG4gICAgICAgIHRoaXMuX2hhc1RpbGVkTm9kZUdyaWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faGFzQW5pR3JpZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9hbmltYXRpb25zID0gbnVsbDtcblxuICAgICAgICAvLyBzd2l0Y2ggb2YgY3VsbGluZ1xuICAgICAgICB0aGlzLl9lbmFibGVDdWxsaW5nID0gY2MubWFjcm8uRU5BQkxFX1RJTEVETUFQX0NVTExJTkc7XG4gICAgfSxcblxuICAgIF9oYXNUaWxlZE5vZGUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faGFzVGlsZWROb2RlR3JpZDtcbiAgICB9LFxuXG4gICAgX2hhc0FuaW1hdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNBbmlHcmlkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIGVuYWJsZSBvciBkaXNhYmxlIGN1bGxpbmdcbiAgICAgKiAhI3poIOW8gOWQr+aIluWFs+mXreijgeWJquOAglxuICAgICAqIEBtZXRob2QgZW5hYmxlQ3VsbGluZ1xuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIGVuYWJsZUN1bGxpbmcgKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbmFibGVDdWxsaW5nICE9IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLl9lbmFibGVDdWxsaW5nID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLl9jdWxsaW5nRGlydHkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gQWRkcyB1c2VyJ3Mgbm9kZSBpbnRvIGxheWVyLlxuICAgICAqICEjemgg5re75Yqg55So5oi36IqC54K544CCXG4gICAgICogQG1ldGhvZCBhZGRVc2VyTm9kZVxuICAgICAqIEBwYXJhbSB7Y2MuTm9kZX0gbm9kZVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgYWRkVXNlck5vZGUgKG5vZGUpIHtcbiAgICAgICAgbGV0IGRhdGFDb21wID0gbm9kZS5nZXRDb21wb25lbnQoVGlsZWRVc2VyTm9kZURhdGEpO1xuICAgICAgICBpZiAoZGF0YUNvbXApIHtcbiAgICAgICAgICAgIGNjLndhcm4oXCJDQ1RpbGVkTGF5ZXI6YWRkVXNlck5vZGUgbm9kZSBoYXMgYmVlbiBhZGRlZFwiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGFDb21wID0gbm9kZS5hZGRDb21wb25lbnQoVGlsZWRVc2VyTm9kZURhdGEpO1xuICAgICAgICBub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICAgICAgbm9kZS5fcmVuZGVyRmxhZyB8PSBSZW5kZXJGbG93LkZMQUdfQlJFQUtfRkxPVztcbiAgICAgICAgdGhpcy5fdXNlck5vZGVNYXBbbm9kZS5faWRdID0gZGF0YUNvbXA7XG5cbiAgICAgICAgZGF0YUNvbXAuX3JvdyA9IC0xO1xuICAgICAgICBkYXRhQ29tcC5fY29sID0gLTE7XG4gICAgICAgIGRhdGFDb21wLl90aWxlZExheWVyID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX25vZGVMb2NhbFBvc1RvTGF5ZXJQb3Mobm9kZSwgX3ZlYzJfdGVtcCk7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uVG9Sb3dDb2woX3ZlYzJfdGVtcC54LCBfdmVjMl90ZW1wLnksIF90ZW1wUm93Q29sKTtcbiAgICAgICAgdGhpcy5fYWRkVXNlck5vZGVUb0dyaWQoZGF0YUNvbXAsIF90ZW1wUm93Q29sKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlQ3VsbGluZ09mZnNldEJ5VXNlck5vZGUobm9kZSk7XG4gICAgICAgIG5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuUE9TSVRJT05fQ0hBTkdFRCwgdGhpcy5fdXNlck5vZGVQb3NDaGFuZ2UsIGRhdGFDb21wKTtcbiAgICAgICAgbm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX3VzZXJOb2RlU2l6ZUNoYW5nZSwgZGF0YUNvbXApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZW1vdmVzIHVzZXIncyBub2RlLlxuICAgICAqICEjemgg56e76Zmk55So5oi36IqC54K544CCXG4gICAgICogQG1ldGhvZCByZW1vdmVVc2VyTm9kZVxuICAgICAqIEBwYXJhbSB7Y2MuTm9kZX0gbm9kZVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgcmVtb3ZlVXNlck5vZGUgKG5vZGUpIHtcbiAgICAgICAgbGV0IGRhdGFDb21wID0gbm9kZS5nZXRDb21wb25lbnQoVGlsZWRVc2VyTm9kZURhdGEpO1xuICAgICAgICBpZiAoIWRhdGFDb21wKSB7XG4gICAgICAgICAgICBjYy53YXJuKFwiQ0NUaWxlZExheWVyOnJlbW92ZVVzZXJOb2RlIG5vZGUgaXMgbm90IGV4aXN0XCIpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlBPU0lUSU9OX0NIQU5HRUQsIHRoaXMuX3VzZXJOb2RlUG9zQ2hhbmdlLCBkYXRhQ29tcCk7XG4gICAgICAgIG5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fdXNlck5vZGVTaXplQ2hhbmdlLCBkYXRhQ29tcCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZVVzZXJOb2RlRnJvbUdyaWQoZGF0YUNvbXApO1xuICAgICAgICBkZWxldGUgdGhpcy5fdXNlck5vZGVNYXBbbm9kZS5faWRdO1xuICAgICAgICBub2RlLl9yZW1vdmVDb21wb25lbnQoZGF0YUNvbXApO1xuICAgICAgICBkYXRhQ29tcC5kZXN0cm95KCk7XG4gICAgICAgIG5vZGUucmVtb3ZlRnJvbVBhcmVudCh0cnVlKTtcbiAgICAgICAgbm9kZS5fcmVuZGVyRmxhZyAmPSB+UmVuZGVyRmxvdy5GTEFHX0JSRUFLX0ZMT1c7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIERlc3Ryb3kgdXNlcidzIG5vZGUuXG4gICAgICogISN6aCDplIDmr4HnlKjmiLfoioLngrnjgIJcbiAgICAgKiBAbWV0aG9kIGRlc3Ryb3lVc2VyTm9kZVxuICAgICAqIEBwYXJhbSB7Y2MuTm9kZX0gbm9kZVxuICAgICAqL1xuICAgIGRlc3Ryb3lVc2VyTm9kZSAobm9kZSkge1xuICAgICAgICB0aGlzLnJlbW92ZVVzZXJOb2RlKG5vZGUpO1xuICAgICAgICBub2RlLmRlc3Ryb3koKTtcbiAgICB9LFxuXG4gICAgLy8gYWNvcmRpbmcgbGF5ZXIgYW5jaG9yIHBvaW50IHRvIGNhbGN1bGF0ZSBub2RlIGxheWVyIHBvc1xuICAgIF9ub2RlTG9jYWxQb3NUb0xheWVyUG9zIChub2RlUG9zLCBvdXQpIHtcbiAgICAgICAgb3V0LnggPSBub2RlUG9zLnggKyB0aGlzLl9sZWZ0RG93blRvQ2VudGVyWDtcbiAgICAgICAgb3V0LnkgPSBub2RlUG9zLnkgKyB0aGlzLl9sZWZ0RG93blRvQ2VudGVyWTtcbiAgICB9LFxuXG4gICAgX2dldE5vZGVzQnlSb3dDb2wgKHJvdywgY29sKSB7XG4gICAgICAgIGxldCByb3dEYXRhID0gdGhpcy5fdXNlck5vZGVHcmlkW3Jvd107XG4gICAgICAgIGlmICghcm93RGF0YSkgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiByb3dEYXRhW2NvbF07XG4gICAgfSxcblxuICAgIF9nZXROb2Rlc0NvdW50QnlSb3cgKHJvdykge1xuICAgICAgICBsZXQgcm93RGF0YSA9IHRoaXMuX3VzZXJOb2RlR3JpZFtyb3ddO1xuICAgICAgICBpZiAoIXJvd0RhdGEpIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gcm93RGF0YS5jb3VudDtcbiAgICB9LFxuXG4gICAgX3VwZGF0ZUFsbFVzZXJOb2RlICgpIHtcbiAgICAgICAgdGhpcy5fdXNlck5vZGVHcmlkID0ge307XG4gICAgICAgIGZvciAobGV0IGRhdGFJZCBpbiB0aGlzLl91c2VyTm9kZU1hcCkge1xuICAgICAgICAgICAgbGV0IGRhdGFDb21wID0gdGhpcy5fdXNlck5vZGVNYXBbZGF0YUlkXTtcbiAgICAgICAgICAgIHRoaXMuX25vZGVMb2NhbFBvc1RvTGF5ZXJQb3MoZGF0YUNvbXAubm9kZSwgX3ZlYzJfdGVtcCk7XG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvblRvUm93Q29sKF92ZWMyX3RlbXAueCwgX3ZlYzJfdGVtcC55LCBfdGVtcFJvd0NvbCk7XG4gICAgICAgICAgICB0aGlzLl9hZGRVc2VyTm9kZVRvR3JpZChkYXRhQ29tcCwgX3RlbXBSb3dDb2wpO1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlQ3VsbGluZ09mZnNldEJ5VXNlck5vZGUoZGF0YUNvbXAubm9kZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX3VwZGF0ZUN1bGxpbmdPZmZzZXRCeVVzZXJOb2RlIChub2RlKSB7XG4gICAgICAgIGlmICh0aGlzLl90b3BPZmZzZXQgPCBub2RlLmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy5fdG9wT2Zmc2V0ID0gbm9kZS5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2Rvd25PZmZzZXQgPCBub2RlLmhlaWdodCkge1xuICAgICAgICAgICAgdGhpcy5fZG93bk9mZnNldCA9IG5vZGUuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9sZWZ0T2Zmc2V0IDwgbm9kZS53aWR0aCkge1xuICAgICAgICAgICAgdGhpcy5fbGVmdE9mZnNldCA9IG5vZGUud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX3JpZ2h0T2Zmc2V0IDwgbm9kZS53aWR0aCkge1xuICAgICAgICAgICAgdGhpcy5fcmlnaHRPZmZzZXQgPSBub2RlLndpZHRoO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF91c2VyTm9kZVNpemVDaGFuZ2UgKCkge1xuICAgICAgICBsZXQgZGF0YUNvbXAgPSB0aGlzO1xuICAgICAgICBsZXQgbm9kZSA9IGRhdGFDb21wLm5vZGU7XG4gICAgICAgIGxldCBzZWxmID0gZGF0YUNvbXAuX3RpbGVkTGF5ZXI7XG4gICAgICAgIHNlbGYuX3VwZGF0ZUN1bGxpbmdPZmZzZXRCeVVzZXJOb2RlKG5vZGUpO1xuICAgIH0sXG5cbiAgICBfdXNlck5vZGVQb3NDaGFuZ2UgKCkge1xuICAgICAgICBsZXQgZGF0YUNvbXAgPSB0aGlzO1xuICAgICAgICBsZXQgbm9kZSA9IGRhdGFDb21wLm5vZGU7XG4gICAgICAgIGxldCBzZWxmID0gZGF0YUNvbXAuX3RpbGVkTGF5ZXI7XG4gICAgICAgIHNlbGYuX25vZGVMb2NhbFBvc1RvTGF5ZXJQb3Mobm9kZSwgX3ZlYzJfdGVtcCk7XG4gICAgICAgIHNlbGYuX3Bvc2l0aW9uVG9Sb3dDb2woX3ZlYzJfdGVtcC54LCBfdmVjMl90ZW1wLnksIF90ZW1wUm93Q29sKTtcbiAgICAgICAgc2VsZi5fbGltaXRJbkxheWVyKF90ZW1wUm93Q29sKTtcbiAgICAgICAgLy8gdXNlcnMgcG9zIG5vdCBjaGFuZ2VcbiAgICAgICAgaWYgKF90ZW1wUm93Q29sLnJvdyA9PT0gZGF0YUNvbXAuX3JvdyAmJiBfdGVtcFJvd0NvbC5jb2wgPT09IGRhdGFDb21wLl9jb2wpIHJldHVybjtcblxuICAgICAgICBzZWxmLl9yZW1vdmVVc2VyTm9kZUZyb21HcmlkKGRhdGFDb21wKTtcbiAgICAgICAgc2VsZi5fYWRkVXNlck5vZGVUb0dyaWQoZGF0YUNvbXAsIF90ZW1wUm93Q29sKTtcbiAgICB9LFxuXG4gICAgX3JlbW92ZVVzZXJOb2RlRnJvbUdyaWQgKGRhdGFDb21wKSB7XG4gICAgICAgIGxldCByb3cgPSBkYXRhQ29tcC5fcm93O1xuICAgICAgICBsZXQgY29sID0gZGF0YUNvbXAuX2NvbDtcbiAgICAgICAgbGV0IGluZGV4ID0gZGF0YUNvbXAuX2luZGV4O1xuXG4gICAgICAgIGxldCByb3dEYXRhID0gdGhpcy5fdXNlck5vZGVHcmlkW3Jvd107XG4gICAgICAgIGxldCBjb2xEYXRhID0gcm93RGF0YSAmJiByb3dEYXRhW2NvbF07XG4gICAgICAgIGlmIChjb2xEYXRhKSB7XG4gICAgICAgICAgICByb3dEYXRhLmNvdW50IC0tO1xuICAgICAgICAgICAgY29sRGF0YS5jb3VudCAtLTtcbiAgICAgICAgICAgIGNvbERhdGEubGlzdFtpbmRleF0gPSBudWxsO1xuICAgICAgICAgICAgaWYgKGNvbERhdGEuY291bnQgPD0gMCkge1xuICAgICAgICAgICAgICAgIGNvbERhdGEubGlzdC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIGNvbERhdGEuY291bnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGF0YUNvbXAuX3JvdyA9IC0xO1xuICAgICAgICBkYXRhQ29tcC5fY29sID0gLTE7XG4gICAgICAgIGRhdGFDb21wLl9pbmRleCA9IC0xO1xuICAgICAgICB0aGlzLl91c2VyTm9kZURpcnR5ID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX2xpbWl0SW5MYXllciAocm93Q29sKSB7XG4gICAgICAgIGxldCByb3cgPSByb3dDb2wucm93O1xuICAgICAgICBsZXQgY29sID0gcm93Q29sLmNvbDtcbiAgICAgICAgaWYgKHJvdyA8IDApIHJvd0NvbC5yb3cgPSAwO1xuICAgICAgICBpZiAocm93ID4gdGhpcy5fcmlnaHRUb3Aucm93KSByb3dDb2wucm93ID0gdGhpcy5fcmlnaHRUb3Aucm93O1xuICAgICAgICBpZiAoY29sIDwgMCkgcm93Q29sLmNvbCA9IDA7XG4gICAgICAgIGlmIChjb2wgPiB0aGlzLl9yaWdodFRvcC5jb2wpIHJvd0NvbC5jb2wgPSB0aGlzLl9yaWdodFRvcC5jb2w7XG4gICAgfSxcblxuICAgIF9hZGRVc2VyTm9kZVRvR3JpZCAoZGF0YUNvbXAsIHRlbXBSb3dDb2wpIHtcbiAgICAgICAgbGV0IHJvdyA9IHRlbXBSb3dDb2wucm93O1xuICAgICAgICBsZXQgY29sID0gdGVtcFJvd0NvbC5jb2w7XG4gICAgICAgIGxldCByb3dEYXRhID0gdGhpcy5fdXNlck5vZGVHcmlkW3Jvd10gPSB0aGlzLl91c2VyTm9kZUdyaWRbcm93XSB8fCB7Y291bnQgOiAwfTtcbiAgICAgICAgbGV0IGNvbERhdGEgPSByb3dEYXRhW2NvbF0gPSByb3dEYXRhW2NvbF0gfHwge2NvdW50IDogMCwgbGlzdDogW119O1xuICAgICAgICBkYXRhQ29tcC5fcm93ID0gcm93O1xuICAgICAgICBkYXRhQ29tcC5fY29sID0gY29sO1xuICAgICAgICBkYXRhQ29tcC5faW5kZXggPSBjb2xEYXRhLmxpc3QubGVuZ3RoO1xuICAgICAgICByb3dEYXRhLmNvdW50Kys7XG4gICAgICAgIGNvbERhdGEuY291bnQrKztcbiAgICAgICAgY29sRGF0YS5saXN0LnB1c2goZGF0YUNvbXApO1xuICAgICAgICB0aGlzLl91c2VyTm9kZURpcnR5ID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX2lzVXNlck5vZGVEaXJ0eSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyTm9kZURpcnR5O1xuICAgIH0sXG5cbiAgICBfc2V0VXNlck5vZGVEaXJ0eSAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fdXNlck5vZGVEaXJ0eSA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICBvbkVuYWJsZSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5BTkNIT1JfQ0hBTkdFRCwgdGhpcy5fc3luY0FuY2hvclBvaW50LCB0aGlzKTtcbiAgICAgICAgdGhpcy5fYWN0aXZhdGVNYXRlcmlhbCgpO1xuICAgIH0sXG5cbiAgICBvbkRpc2FibGUgKCkge1xuICAgICAgICB0aGlzLl9zdXBlcigpO1xuICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLkFOQ0hPUl9DSEFOR0VELCB0aGlzLl9zeW5jQW5jaG9yUG9pbnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBfc3luY0FuY2hvclBvaW50ICgpIHtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLm5vZGU7XG4gICAgICAgIHRoaXMuX2xlZnREb3duVG9DZW50ZXJYID0gbm9kZS53aWR0aCAqIG5vZGUuYW5jaG9yWCAqIG5vZGUuc2NhbGVYO1xuICAgICAgICB0aGlzLl9sZWZ0RG93blRvQ2VudGVyWSA9IG5vZGUuaGVpZ2h0ICogbm9kZS5hbmNob3JZICogbm9kZS5zY2FsZVk7XG4gICAgICAgIHRoaXMuX2N1bGxpbmdEaXJ0eSA9IHRydWU7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveSAoKSB7XG4gICAgICAgIHRoaXMuX3N1cGVyKCk7XG4gICAgICAgIGlmICh0aGlzLl9idWZmZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLl9idWZmZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3JlbmRlckRhdGFMaXN0ID0gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBHZXRzIHRoZSBsYXllciBuYW1lLlxuICAgICAqICEjemgg6I635Y+W5bGC55qE5ZCN56ew44CCXG4gICAgICogQG1ldGhvZCBnZXRMYXllck5hbWVcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgbGF5ZXJOYW1lID0gdGlsZWRMYXllci5nZXRMYXllck5hbWUoKTtcbiAgICAgKiBjYy5sb2cobGF5ZXJOYW1lKTtcbiAgICAgKi9cbiAgICBnZXRMYXllck5hbWUgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGF5ZXJOYW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgbGF5ZXIgbmFtZS5cbiAgICAgKiAhI3poIOiuvue9ruWxgueahOWQjeensFxuICAgICAqIEBtZXRob2QgU2V0TGF5ZXJOYW1lXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxheWVyTmFtZVxuICAgICAqIEBleGFtcGxlXG4gICAgICogdGlsZWRMYXllci5zZXRMYXllck5hbWUoXCJOZXcgTGF5ZXJcIik7XG4gICAgICovXG4gICAgc2V0TGF5ZXJOYW1lIChsYXllck5hbWUpIHtcbiAgICAgICAgdGhpcy5fbGF5ZXJOYW1lID0gbGF5ZXJOYW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFJldHVybiB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBwcm9wZXJ0eSBuYW1lLlxuICAgICAqICEjemgg6I635Y+W5oyH5a6a5bGe5oCn5ZCN55qE5YC844CCXG4gICAgICogQG1ldGhvZCBnZXRQcm9wZXJ0eVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eU5hbWVcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IHByb3BlcnR5ID0gdGlsZWRMYXllci5nZXRQcm9wZXJ0eShcImluZm9cIik7XG4gICAgICogY2MubG9nKHByb3BlcnR5KTtcbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0eSAocHJvcGVydHlOYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gUmV0dXJucyB0aGUgcG9zaXRpb24gaW4gcGl4ZWxzIG9mIGEgZ2l2ZW4gdGlsZSBjb29yZGluYXRlLlxuICAgICAqICEjemgg6I635Y+W5oyH5a6aIHRpbGUg55qE5YOP57Sg5Z2Q5qCH44CCXG4gICAgICogQG1ldGhvZCBnZXRQb3NpdGlvbkF0XG4gICAgICogQHBhcmFtIHtWZWMyfE51bWJlcn0gcG9zIHBvc2l0aW9uIG9yIHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3ldXG4gICAgICogQHJldHVybiB7VmVjMn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBwb3MgPSB0aWxlZExheWVyLmdldFBvc2l0aW9uQXQoY2MudjIoMCwgMCkpO1xuICAgICAqIGNjLmxvZyhcIlBvczogXCIgKyBwb3MpO1xuICAgICAqIGxldCBwb3MgPSB0aWxlZExheWVyLmdldFBvc2l0aW9uQXQoMCwgMCk7XG4gICAgICogY2MubG9nKFwiUG9zOiBcIiArIHBvcyk7XG4gICAgICovXG4gICAgZ2V0UG9zaXRpb25BdCAocG9zLCB5KSB7XG4gICAgICAgIGxldCB4O1xuICAgICAgICBpZiAoeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB4ID0gTWF0aC5mbG9vcihwb3MpO1xuICAgICAgICAgICAgeSA9IE1hdGguZmxvb3IoeSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB4ID0gTWF0aC5mbG9vcihwb3MueCk7XG4gICAgICAgICAgICB5ID0gTWF0aC5mbG9vcihwb3MueSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGxldCByZXQ7XG4gICAgICAgIHN3aXRjaCAodGhpcy5fbGF5ZXJPcmllbnRhdGlvbikge1xuICAgICAgICAgICAgY2FzZSBjYy5UaWxlZE1hcC5PcmllbnRhdGlvbi5PUlRITzpcbiAgICAgICAgICAgICAgICByZXQgPSB0aGlzLl9wb3NpdGlvbkZvck9ydGhvQXQoeCwgeSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLlRpbGVkTWFwLk9yaWVudGF0aW9uLklTTzpcbiAgICAgICAgICAgICAgICByZXQgPSB0aGlzLl9wb3NpdGlvbkZvcklzb0F0KHgsIHkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5UaWxlZE1hcC5PcmllbnRhdGlvbi5IRVg6XG4gICAgICAgICAgICAgICAgcmV0ID0gdGhpcy5fcG9zaXRpb25Gb3JIZXhBdCh4LCB5KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG5cbiAgICBfaXNJbnZhbGlkUG9zaXRpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBsZXQgcG9zID0geDtcbiAgICAgICAgICAgIHkgPSBwb3MueTtcbiAgICAgICAgICAgIHggPSBwb3MueDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geCA+PSB0aGlzLl9sYXllclNpemUud2lkdGggfHwgeSA+PSB0aGlzLl9sYXllclNpemUuaGVpZ2h0IHx8IHggPCAwIHx8IHkgPCAwO1xuICAgIH0sXG5cbiAgICBfcG9zaXRpb25Gb3JJc29BdCAoeCwgeSkge1xuICAgICAgICBsZXQgb2Zmc2V0WCA9IDAsIG9mZnNldFkgPSAwO1xuICAgICAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKHgpICsgTWF0aC5mbG9vcih5KSAqIHRoaXMuX2xheWVyU2l6ZS53aWR0aDtcbiAgICAgICAgbGV0IGdpZCA9IHRoaXMuX3RpbGVzW2luZGV4XTtcbiAgICAgICAgaWYgKGdpZCkge1xuICAgICAgICAgICAgbGV0IHRpbGVzZXQgPSB0aGlzLl90ZXhHcmlkc1tnaWRdLnRpbGVzZXQ7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gdGlsZXNldC50aWxlT2Zmc2V0O1xuICAgICAgICAgICAgb2Zmc2V0WCA9IG9mZnNldC54O1xuICAgICAgICAgICAgb2Zmc2V0WSA9IG9mZnNldC55O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNjLnYyKFxuICAgICAgICAgICAgdGhpcy5fbWFwVGlsZVNpemUud2lkdGggKiAwLjUgKiAodGhpcy5fbGF5ZXJTaXplLmhlaWdodCArIHggLSB5IC0gMSkgKyBvZmZzZXRYLFxuICAgICAgICAgICAgdGhpcy5fbWFwVGlsZVNpemUuaGVpZ2h0ICogMC41ICogKHRoaXMuX2xheWVyU2l6ZS53aWR0aCAtIHggKyB0aGlzLl9sYXllclNpemUuaGVpZ2h0IC0geSAtIDIpIC0gb2Zmc2V0WVxuICAgICAgICApO1xuICAgIH0sXG5cbiAgICBfcG9zaXRpb25Gb3JPcnRob0F0ICh4LCB5KSB7XG4gICAgICAgIGxldCBvZmZzZXRYID0gMCwgb2Zmc2V0WSA9IDA7XG4gICAgICAgIGxldCBpbmRleCA9IE1hdGguZmxvb3IoeCkgKyBNYXRoLmZsb29yKHkpICogdGhpcy5fbGF5ZXJTaXplLndpZHRoO1xuICAgICAgICBsZXQgZ2lkID0gdGhpcy5fdGlsZXNbaW5kZXhdO1xuICAgICAgICBpZiAoZ2lkKSB7XG4gICAgICAgICAgICBsZXQgdGlsZXNldCA9IHRoaXMuX3RleEdyaWRzW2dpZF0udGlsZXNldDtcbiAgICAgICAgICAgIGxldCBvZmZzZXQgPSB0aWxlc2V0LnRpbGVPZmZzZXQ7XG4gICAgICAgICAgICBvZmZzZXRYID0gb2Zmc2V0Lng7XG4gICAgICAgICAgICBvZmZzZXRZID0gb2Zmc2V0Lnk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2MudjIoXG4gICAgICAgICAgICB4ICogdGhpcy5fbWFwVGlsZVNpemUud2lkdGggKyBvZmZzZXRYLFxuICAgICAgICAgICAgKHRoaXMuX2xheWVyU2l6ZS5oZWlnaHQgLSB5IC0gMSkgKiB0aGlzLl9tYXBUaWxlU2l6ZS5oZWlnaHQgLSBvZmZzZXRZXG4gICAgICAgICk7XG4gICAgfSxcblxuICAgIF9wb3NpdGlvbkZvckhleEF0IChjb2wsIHJvdykge1xuICAgICAgICBsZXQgdGlsZVdpZHRoID0gdGhpcy5fbWFwVGlsZVNpemUud2lkdGg7XG4gICAgICAgIGxldCB0aWxlSGVpZ2h0ID0gdGhpcy5fbWFwVGlsZVNpemUuaGVpZ2h0O1xuICAgICAgICBsZXQgcm93cyA9IHRoaXMuX2xheWVyU2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcihjb2wpICsgTWF0aC5mbG9vcihyb3cpICogdGhpcy5fbGF5ZXJTaXplLndpZHRoO1xuICAgICAgICBsZXQgZ2lkID0gdGhpcy5fdGlsZXNbaW5kZXhdO1xuICAgICAgICBsZXQgdGlsZXNldCA9IHRoaXMuX3RleEdyaWRzW2dpZF0udGlsZXNldDtcbiAgICAgICAgbGV0IG9mZnNldCA9IHRpbGVzZXQudGlsZU9mZnNldDtcblxuICAgICAgICBsZXQgb2RkX2V2ZW4gPSAodGhpcy5fc3RhZ2dlckluZGV4ID09PSBjYy5UaWxlZE1hcC5TdGFnZ2VySW5kZXguU1RBR0dFUklOREVYX09ERCkgPyAxIDogLTE7XG4gICAgICAgIGxldCB4ID0gMCwgeSA9IDA7XG4gICAgICAgIGxldCBkaWZmWCA9IDA7XG4gICAgICAgIGxldCBkaWZmWSA9IDA7XG4gICAgICAgIHN3aXRjaCAodGhpcy5fc3RhZ2dlckF4aXMpIHtcbiAgICAgICAgICAgIGNhc2UgY2MuVGlsZWRNYXAuU3RhZ2dlckF4aXMuU1RBR0dFUkFYSVNfWTpcbiAgICAgICAgICAgICAgICBkaWZmWCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHJvdyAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlmZlggPSB0aWxlV2lkdGggLyAyICogb2RkX2V2ZW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHggPSBjb2wgKiB0aWxlV2lkdGggKyBkaWZmWCArIG9mZnNldC54O1xuICAgICAgICAgICAgICAgIHkgPSAocm93cyAtIHJvdyAtIDEpICogKHRpbGVIZWlnaHQgLSAodGlsZUhlaWdodCAtIHRoaXMuX2hleFNpZGVMZW5ndGgpIC8gMikgLSBvZmZzZXQueTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuVGlsZWRNYXAuU3RhZ2dlckF4aXMuU1RBR0dFUkFYSVNfWDpcbiAgICAgICAgICAgICAgICBkaWZmWSA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKGNvbCAlIDIgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlmZlkgPSB0aWxlSGVpZ2h0IC8gMiAqIC1vZGRfZXZlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeCA9IGNvbCAqICh0aWxlV2lkdGggLSAodGlsZVdpZHRoIC0gdGhpcy5faGV4U2lkZUxlbmd0aCkgLyAyKSArIG9mZnNldC54O1xuICAgICAgICAgICAgICAgIHkgPSAocm93cyAtIHJvdyAtIDEpICogdGlsZUhlaWdodCArIGRpZmZZIC0gb2Zmc2V0Lnk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNjLnYyKHgsIHkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuXG4gICAgICogU2V0cyB0aGUgdGlsZSBnaWQgKGdpZCA9IHRpbGUgZ2xvYmFsIGlkKSBhdCBhIGdpdmVuIHRpbGUgY29vcmRpbmF0ZS48YnIgLz5cbiAgICAgKiBUaGUgVGlsZSBHSUQgY2FuIGJlIG9idGFpbmVkIGJ5IHVzaW5nIHRoZSBtZXRob2QgXCJ0aWxlR0lEQXRcIiBvciBieSB1c2luZyB0aGUgVE1YIGVkaXRvciAuIFRpbGVzZXQgTWdyICsxLjxiciAvPlxuICAgICAqIElmIGEgdGlsZSBpcyBhbHJlYWR5IHBsYWNlZCBhdCB0aGF0IHBvc2l0aW9uLCB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZC5cbiAgICAgKiAhI3poXG4gICAgICog6K6+572u57uZ5a6a5Z2Q5qCH55qEIHRpbGUg55qEIGdpZCAoZ2lkID0gdGlsZSDlhajlsYAgaWQp77yMXG4gICAgICogdGlsZSDnmoQgR0lEIOWPr+S7peS9v+eUqOaWueazlSDigJx0aWxlR0lEQXTigJ0g5p2l6I635b6X44CCPGJyIC8+XG4gICAgICog5aaC5p6c5LiA5LiqIHRpbGUg5bey57uP5pS+5Zyo6YKj5Liq5L2N572u77yM6YKj5LmI5a6D5bCG6KKr5Yig6Zmk44CCXG4gICAgICogQG1ldGhvZCBzZXRUaWxlR0lEQXRcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZ2lkXG4gICAgICogQHBhcmFtIHtWZWMyfE51bWJlcn0gcG9zT3JYIHBvc2l0aW9uIG9yIHhcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZmxhZ3NPclkgZmxhZ3Mgb3IgeVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbZmxhZ3NdXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aWxlZExheWVyLnNldFRpbGVHSURBdCgxMDAxLCAxMCwgMTAsIDEpXG4gICAgICovXG4gICAgc2V0VGlsZUdJREF0IChnaWQsIHBvc09yWCwgZmxhZ3NPclksIGZsYWdzKSB7XG4gICAgICAgIGlmIChwb3NPclggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2MuVGlsZWRMYXllci5zZXRUaWxlR0lEQXQoKTogcG9zIHNob3VsZCBiZSBub24tbnVsbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcG9zO1xuICAgICAgICBpZiAoZmxhZ3MgIT09IHVuZGVmaW5lZCB8fCAhKHBvc09yWCBpbnN0YW5jZW9mIGNjLlZlYzIpKSB7XG4gICAgICAgICAgICAvLyBmb3VyIHBhcmFtZXRlcnMgb3IgcG9zT3JYIGlzIG5vdCBhIFZlYzIgb2JqZWN0XG4gICAgICAgICAgICBwb3MgPSBjYy52Mihwb3NPclgsIGZsYWdzT3JZKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBvcyA9IHBvc09yWDtcbiAgICAgICAgICAgIGZsYWdzID0gZmxhZ3NPclk7XG4gICAgICAgIH1cblxuICAgICAgICBwb3MueCA9IE1hdGguZmxvb3IocG9zLngpO1xuICAgICAgICBwb3MueSA9IE1hdGguZmxvb3IocG9zLnkpO1xuICAgICAgICBpZiAodGhpcy5faXNJbnZhbGlkUG9zaXRpb24ocG9zKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2MuVGlsZWRMYXllci5zZXRUaWxlR0lEQXQoKTogaW52YWxpZCBwb3NpdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3RpbGVzIHx8ICF0aGlzLl90aWxlc2V0cyB8fCB0aGlzLl90aWxlc2V0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgY2MubG9nSUQoNzIzOCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGdpZCAhPT0gMCAmJiBnaWQgPCB0aGlzLl90aWxlc2V0c1swXS5maXJzdEdpZCkge1xuICAgICAgICAgICAgY2MubG9nSUQoNzIzOSwgZ2lkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZsYWdzID0gZmxhZ3MgfHwgMDtcbiAgICAgICAgbGV0IGN1cnJlbnRGbGFncyA9IHRoaXMuZ2V0VGlsZUZsYWdzQXQocG9zKTtcbiAgICAgICAgbGV0IGN1cnJlbnRHSUQgPSB0aGlzLmdldFRpbGVHSURBdChwb3MpO1xuXG4gICAgICAgIGlmIChjdXJyZW50R0lEID09PSBnaWQgJiYgY3VycmVudEZsYWdzID09PSBmbGFncykgcmV0dXJuO1xuXG4gICAgICAgIGxldCBnaWRBbmRGbGFncyA9IChnaWQgfCBmbGFncykgPj4+IDA7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRpbGVGb3JHSUQoZ2lkQW5kRmxhZ3MsIHBvcyk7XG4gICAgfSxcblxuICAgIF91cGRhdGVUaWxlRm9yR0lEIChnaWQsIHBvcykge1xuICAgICAgICBpZiAoZ2lkICE9PSAwICYmICF0aGlzLl90ZXhHcmlkc1tnaWRdKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaWR4ID0gMCB8IChwb3MueCArIHBvcy55ICogdGhpcy5fbGF5ZXJTaXplLndpZHRoKTtcbiAgICAgICAgaWYgKGlkeCA8IHRoaXMuX3RpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5fdGlsZXNbaWR4XSA9IGdpZDtcbiAgICAgICAgICAgIHRoaXMuX2N1bGxpbmdEaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIFJldHVybnMgdGhlIHRpbGUgZ2lkIGF0IGEgZ2l2ZW4gdGlsZSBjb29yZGluYXRlLiA8YnIgLz5cbiAgICAgKiBpZiBpdCByZXR1cm5zIDAsIGl0IG1lYW5zIHRoYXQgdGhlIHRpbGUgaXMgZW1wdHkuIDxiciAvPlxuICAgICAqICEjemhcbiAgICAgKiDpgJrov4fnu5nlrprnmoQgdGlsZSDlnZDmoIfjgIFmbGFnc++8iOWPr+mAie+8iei/lOWbniB0aWxlIOeahCBHSUQuIDxiciAvPlxuICAgICAqIOWmguaenOWug+i/lOWbniAw77yM5YiZ6KGo56S66K+lIHRpbGUg5Li656m644CCPGJyIC8+XG4gICAgICogQG1ldGhvZCBnZXRUaWxlR0lEQXRcbiAgICAgKiBAcGFyYW0ge1ZlYzJ8TnVtYmVyfSBwb3Mgb3IgeFxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbeV1cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgdGlsZUdpZCA9IHRpbGVkTGF5ZXIuZ2V0VGlsZUdJREF0KDAsIDApO1xuICAgICAqL1xuICAgIGdldFRpbGVHSURBdCAocG9zLCB5KSB7XG4gICAgICAgIGlmIChwb3MgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2MuVGlsZWRMYXllci5nZXRUaWxlR0lEQXQoKTogcG9zIHNob3VsZCBiZSBub24tbnVsbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgeCA9IHBvcztcbiAgICAgICAgaWYgKHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgeCA9IHBvcy54O1xuICAgICAgICAgICAgeSA9IHBvcy55O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pc0ludmFsaWRQb3NpdGlvbih4LCB5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2MuVGlsZWRMYXllci5nZXRUaWxlR0lEQXQoKTogaW52YWxpZCBwb3NpdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3RpbGVzKSB7XG4gICAgICAgICAgICBjYy5sb2dJRCg3MjM3KTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcih4KSArIE1hdGguZmxvb3IoeSkgKiB0aGlzLl9sYXllclNpemUud2lkdGg7XG4gICAgICAgIC8vIEJpdHMgb24gdGhlIGZhciBlbmQgb2YgdGhlIDMyLWJpdCBnbG9iYWwgdGlsZSBJRCBhcmUgdXNlZCBmb3IgdGlsZSBmbGFnc1xuICAgICAgICBsZXQgdGlsZSA9IHRoaXMuX3RpbGVzW2luZGV4XTtcblxuICAgICAgICByZXR1cm4gKHRpbGUgJiBjYy5UaWxlZE1hcC5UaWxlRmxhZy5GTElQUEVEX01BU0spID4+PiAwO1xuICAgIH0sXG5cbiAgICBnZXRUaWxlRmxhZ3NBdCAocG9zLCB5KSB7XG4gICAgICAgIGlmICghcG9zKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlZExheWVyLmdldFRpbGVGbGFnc0F0OiBwb3Mgc2hvdWxkIGJlIG5vbi1udWxsXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBvcyA9IGNjLnYyKHBvcywgeSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2lzSW52YWxpZFBvc2l0aW9uKHBvcykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRpbGVkTGF5ZXIuZ2V0VGlsZUZsYWdzQXQ6IGludmFsaWQgcG9zaXRpb25cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl90aWxlcykge1xuICAgICAgICAgICAgY2MubG9nSUQoNzI0MCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpZHggPSBNYXRoLmZsb29yKHBvcy54KSArIE1hdGguZmxvb3IocG9zLnkpICogdGhpcy5fbGF5ZXJTaXplLndpZHRoO1xuICAgICAgICAvLyBCaXRzIG9uIHRoZSBmYXIgZW5kIG9mIHRoZSAzMi1iaXQgZ2xvYmFsIHRpbGUgSUQgYXJlIHVzZWQgZm9yIHRpbGUgZmxhZ3NcbiAgICAgICAgbGV0IHRpbGUgPSB0aGlzLl90aWxlc1tpZHhdO1xuXG4gICAgICAgIHJldHVybiAodGlsZSAmIGNjLlRpbGVkTWFwLlRpbGVGbGFnLkZMSVBQRURfQUxMKSA+Pj4gMDtcbiAgICB9LFxuXG4gICAgX3NldEN1bGxpbmdEaXJ0eSAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fY3VsbGluZ0RpcnR5ID0gdmFsdWU7XG4gICAgfSxcblxuICAgIF9pc0N1bGxpbmdEaXJ0eSAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdWxsaW5nRGlydHk7XG4gICAgfSxcblxuICAgIC8vICd4LCB5JyBpcyB0aGUgcG9zaXRpb24gb2Ygdmlld1BvcnQsIHdoaWNoJ3MgYW5jaG9yIHBvaW50IGlzIGF0IHRoZSBjZW50ZXIgb2YgcmVjdC5cbiAgICAvLyAnd2lkdGgsIGhlaWdodCcgaXMgdGhlIHNpemUgb2Ygdmlld1BvcnQuXG4gICAgX3VwZGF0ZVZpZXdQb3J0ICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIGlmICh0aGlzLl92aWV3UG9ydC53aWR0aCA9PT0gd2lkdGggJiYgXG4gICAgICAgICAgICB0aGlzLl92aWV3UG9ydC5oZWlnaHQgPT09IGhlaWdodCAmJlxuICAgICAgICAgICAgdGhpcy5fdmlld1BvcnQueCA9PT0geCAmJlxuICAgICAgICAgICAgdGhpcy5fdmlld1BvcnQueSA9PT0geSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3ZpZXdQb3J0LnggPSB4O1xuICAgICAgICB0aGlzLl92aWV3UG9ydC55ID0geTtcbiAgICAgICAgdGhpcy5fdmlld1BvcnQud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5fdmlld1BvcnQuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgICAgIC8vIGlmIG1hcCdzIHR5cGUgaXMgaXNvLCByZXNlcnZlIGJvdHRvbSBsaW5lIGlzIDIgdG8gYXZvaWQgc2hvdyBlbXB0eSBncmlkIGJlY2F1c2Ugb2YgaXNvIGdyaWQgYXJpdGhtZXRpY1xuICAgICAgICBsZXQgcmVzZXJ2ZUxpbmUgPSAxO1xuICAgICAgICBpZiAodGhpcy5fbGF5ZXJPcmllbnRhdGlvbiA9PT0gY2MuVGlsZWRNYXAuT3JpZW50YXRpb24uSVNPKSB7XG4gICAgICAgICAgICByZXNlcnZlTGluZSA9IDI7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdnB4ID0gdGhpcy5fdmlld1BvcnQueCAtIHRoaXMuX29mZnNldC54ICsgdGhpcy5fbGVmdERvd25Ub0NlbnRlclg7XG4gICAgICAgIGxldCB2cHkgPSB0aGlzLl92aWV3UG9ydC55IC0gdGhpcy5fb2Zmc2V0LnkgKyB0aGlzLl9sZWZ0RG93blRvQ2VudGVyWTtcblxuICAgICAgICBsZXQgbGVmdERvd25YID0gdnB4IC0gdGhpcy5fbGVmdE9mZnNldDtcbiAgICAgICAgbGV0IGxlZnREb3duWSA9IHZweSAtIHRoaXMuX2Rvd25PZmZzZXQ7XG4gICAgICAgIGxldCByaWdodFRvcFggPSB2cHggKyB3aWR0aCArIHRoaXMuX3JpZ2h0T2Zmc2V0O1xuICAgICAgICBsZXQgcmlnaHRUb3BZID0gdnB5ICsgaGVpZ2h0ICsgdGhpcy5fdG9wT2Zmc2V0O1xuXG4gICAgICAgIGxldCBsZWZ0RG93biA9IHRoaXMuX2N1bGxpbmdSZWN0LmxlZnREb3duO1xuICAgICAgICBsZXQgcmlnaHRUb3AgPSB0aGlzLl9jdWxsaW5nUmVjdC5yaWdodFRvcDtcblxuICAgICAgICBpZiAobGVmdERvd25YIDwgMCkgbGVmdERvd25YID0gMDtcbiAgICAgICAgaWYgKGxlZnREb3duWSA8IDApIGxlZnREb3duWSA9IDA7XG5cbiAgICAgICAgLy8gY2FsYyBsZWZ0IGRvd25cbiAgICAgICAgdGhpcy5fcG9zaXRpb25Ub1Jvd0NvbChsZWZ0RG93blgsIGxlZnREb3duWSwgX3RlbXBSb3dDb2wpO1xuICAgICAgICAvLyBtYWtlIHJhbmdlIGxhcmdlXG4gICAgICAgIF90ZW1wUm93Q29sLnJvdy09cmVzZXJ2ZUxpbmU7XG4gICAgICAgIF90ZW1wUm93Q29sLmNvbC09cmVzZXJ2ZUxpbmU7XG4gICAgICAgIC8vIGluc3VyZSBsZWZ0IGRvd24gcm93IGNvbCBncmVhdGVyIHRoYW4gMFxuICAgICAgICBfdGVtcFJvd0NvbC5yb3cgPSBfdGVtcFJvd0NvbC5yb3cgPiAwID8gX3RlbXBSb3dDb2wucm93IDogMDtcbiAgICAgICAgX3RlbXBSb3dDb2wuY29sID0gX3RlbXBSb3dDb2wuY29sID4gMCA/IF90ZW1wUm93Q29sLmNvbCA6IDA7ICAgICAgICBcblxuICAgICAgICBpZiAoX3RlbXBSb3dDb2wucm93ICE9PSBsZWZ0RG93bi5yb3cgfHwgX3RlbXBSb3dDb2wuY29sICE9PSBsZWZ0RG93bi5jb2wpIHtcbiAgICAgICAgICAgIGxlZnREb3duLnJvdyA9IF90ZW1wUm93Q29sLnJvdztcbiAgICAgICAgICAgIGxlZnREb3duLmNvbCA9IF90ZW1wUm93Q29sLmNvbDtcbiAgICAgICAgICAgIHRoaXMuX2N1bGxpbmdEaXJ0eSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzaG93IG5vdGhpbmdcbiAgICAgICAgaWYgKHJpZ2h0VG9wWCA8IDAgfHwgcmlnaHRUb3BZIDwgMCkge1xuICAgICAgICAgICAgX3RlbXBSb3dDb2wucm93ID0gLTE7XG4gICAgICAgICAgICBfdGVtcFJvd0NvbC5jb2wgPSAtMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNhbGMgcmlnaHQgdG9wXG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvblRvUm93Q29sKHJpZ2h0VG9wWCwgcmlnaHRUb3BZLCBfdGVtcFJvd0NvbCk7XG4gICAgICAgICAgICAvLyBtYWtlIHJhbmdlIGxhcmdlXG4gICAgICAgICAgICBfdGVtcFJvd0NvbC5yb3crKztcbiAgICAgICAgICAgIF90ZW1wUm93Q29sLmNvbCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXZvaWQgcmFuZ2Ugb3V0IG9mIG1heCByZWN0XG4gICAgICAgIGlmIChfdGVtcFJvd0NvbC5yb3cgPiB0aGlzLl9yaWdodFRvcC5yb3cpIF90ZW1wUm93Q29sLnJvdyA9IHRoaXMuX3JpZ2h0VG9wLnJvdztcbiAgICAgICAgaWYgKF90ZW1wUm93Q29sLmNvbCA+IHRoaXMuX3JpZ2h0VG9wLmNvbCkgX3RlbXBSb3dDb2wuY29sID0gdGhpcy5fcmlnaHRUb3AuY29sO1xuXG4gICAgICAgIGlmIChfdGVtcFJvd0NvbC5yb3cgIT09IHJpZ2h0VG9wLnJvdyB8fCBfdGVtcFJvd0NvbC5jb2wgIT09IHJpZ2h0VG9wLmNvbCkge1xuICAgICAgICAgICAgcmlnaHRUb3Aucm93ID0gX3RlbXBSb3dDb2wucm93O1xuICAgICAgICAgICAgcmlnaHRUb3AuY29sID0gX3RlbXBSb3dDb2wuY29sO1xuICAgICAgICAgICAgdGhpcy5fY3VsbGluZ0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB0aGUgcmVzdWx0IG1heSBub3QgcHJlY2lzZSwgYnV0IGl0IGRvc2UndCBtYXR0ZXIsIGl0IGp1c3QgdXNlcyB0byBiZSBnb3QgcmFuZ2VcbiAgICBfcG9zaXRpb25Ub1Jvd0NvbCAoeCwgeSwgcmVzdWx0KSB7XG4gICAgICAgIGNvbnN0IFRpbGVkTWFwID0gY2MuVGlsZWRNYXA7XG4gICAgICAgIGNvbnN0IE9yaWVudGF0aW9uID0gVGlsZWRNYXAuT3JpZW50YXRpb247XG4gICAgICAgIGNvbnN0IFN0YWdnZXJBeGlzID0gVGlsZWRNYXAuU3RhZ2dlckF4aXM7XG5cbiAgICAgICAgbGV0IG1hcHR3ID0gdGhpcy5fbWFwVGlsZVNpemUud2lkdGgsXG4gICAgICAgICAgICBtYXB0aCA9IHRoaXMuX21hcFRpbGVTaXplLmhlaWdodCxcbiAgICAgICAgICAgIG1hcHR3MiA9IG1hcHR3ICogMC41LFxuICAgICAgICAgICAgbWFwdGgyID0gbWFwdGggKiAwLjU7XG4gICAgICAgIGxldCByb3cgPSAwLCBjb2wgPSAwLCBkaWZmWDIgPSAwLCBkaWZmWTIgPSAwLCBheGlzID0gdGhpcy5fc3RhZ2dlckF4aXM7XG4gICAgICAgIGxldCBjb2xzID0gdGhpcy5fbGF5ZXJTaXplLndpZHRoO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5fbGF5ZXJPcmllbnRhdGlvbikge1xuICAgICAgICAgICAgLy8gbGVmdCB0b3AgdG8gcmlnaHQgZG93bVxuICAgICAgICAgICAgY2FzZSBPcmllbnRhdGlvbi5PUlRITzpcbiAgICAgICAgICAgICAgICBjb2wgPSBNYXRoLmZsb29yKHggLyBtYXB0dyk7XG4gICAgICAgICAgICAgICAgcm93ID0gTWF0aC5mbG9vcih5IC8gbWFwdGgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gcmlnaHQgdG9wIHRvIGxlZnQgZG93blxuICAgICAgICAgICAgLy8gaXNvIGNhbiBiZSB0cmVhdCBhcyBzcGVjaWFsIGhleCB3aG9zZSBoZXggc2lkZSBsZW5ndGggaXMgMFxuICAgICAgICAgICAgY2FzZSBPcmllbnRhdGlvbi5JU086XG4gICAgICAgICAgICAgICAgY29sID0gTWF0aC5mbG9vcih4IC8gbWFwdHcyKTtcbiAgICAgICAgICAgICAgICByb3cgPSBNYXRoLmZsb29yKHkgLyBtYXB0aDIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gbGVmdCB0b3AgdG8gcmlnaHQgZG93bVxuICAgICAgICAgICAgY2FzZSBPcmllbnRhdGlvbi5IRVg6XG4gICAgICAgICAgICAgICAgaWYgKGF4aXMgPT09IFN0YWdnZXJBeGlzLlNUQUdHRVJBWElTX1kpIHtcbiAgICAgICAgICAgICAgICAgICAgcm93ID0gTWF0aC5mbG9vcih5IC8gKG1hcHRoIC0gdGhpcy5fZGlmZlkxKSk7XG4gICAgICAgICAgICAgICAgICAgIGRpZmZYMiA9IHJvdyAlIDIgPT09IDEgPyBtYXB0dzIgKiB0aGlzLl9vZGRfZXZlbiA6IDA7XG4gICAgICAgICAgICAgICAgICAgIGNvbCA9IE1hdGguZmxvb3IoKHggLSBkaWZmWDIpIC8gbWFwdHcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbCA9IE1hdGguZmxvb3IoeCAvIChtYXB0dyAtIHRoaXMuX2RpZmZYMSkpO1xuICAgICAgICAgICAgICAgICAgICBkaWZmWTIgPSBjb2wgJSAyID09PSAxID8gbWFwdGgyICogLXRoaXMuX29kZF9ldmVuIDogMDtcbiAgICAgICAgICAgICAgICAgICAgcm93ID0gTWF0aC5mbG9vcigoeSAtIGRpZmZZMikgLyBtYXB0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdC5yb3cgPSByb3c7XG4gICAgICAgIHJlc3VsdC5jb2wgPSBjb2w7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIF91cGRhdGVDdWxsaW5nICgpIHtcbiAgICAgICAgaWYgKENDX0VESVRPUikge1xuICAgICAgICAgICAgdGhpcy5lbmFibGVDdWxsaW5nKGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9lbmFibGVDdWxsaW5nKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuX3VwZGF0ZVdvcmxkTWF0cml4KCk7XG4gICAgICAgICAgICBNYXQ0LmludmVydChfbWF0NF90ZW1wLCB0aGlzLm5vZGUuX3dvcmxkTWF0cml4KTtcbiAgICAgICAgICAgIGxldCByZWN0ID0gY2MudmlzaWJsZVJlY3Q7XG4gICAgICAgICAgICBsZXQgY2FtZXJhID0gY2MuQ2FtZXJhLmZpbmRDYW1lcmEodGhpcy5ub2RlKTtcbiAgICAgICAgICAgIGlmIChjYW1lcmEpIHtcbiAgICAgICAgICAgICAgICBfdmVjMl90ZW1wLnggPSAwO1xuICAgICAgICAgICAgICAgIF92ZWMyX3RlbXAueSA9IDA7XG4gICAgICAgICAgICAgICAgX3ZlYzJfdGVtcDIueCA9IF92ZWMyX3RlbXAueCArIHJlY3Qud2lkdGg7XG4gICAgICAgICAgICAgICAgX3ZlYzJfdGVtcDIueSA9IF92ZWMyX3RlbXAueSArIHJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIGNhbWVyYS5nZXRTY3JlZW5Ub1dvcmxkUG9pbnQoX3ZlYzJfdGVtcCwgX3ZlYzJfdGVtcCk7XG4gICAgICAgICAgICAgICAgY2FtZXJhLmdldFNjcmVlblRvV29ybGRQb2ludChfdmVjMl90ZW1wMiwgX3ZlYzJfdGVtcDIpO1xuICAgICAgICAgICAgICAgIFZlYzIudHJhbnNmb3JtTWF0NChfdmVjMl90ZW1wLCBfdmVjMl90ZW1wLCBfbWF0NF90ZW1wKTtcbiAgICAgICAgICAgICAgICBWZWMyLnRyYW5zZm9ybU1hdDQoX3ZlYzJfdGVtcDIsIF92ZWMyX3RlbXAyLCBfbWF0NF90ZW1wKTtcbiAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVWaWV3UG9ydChfdmVjMl90ZW1wLngsIF92ZWMyX3RlbXAueSwgX3ZlYzJfdGVtcDIueCAtIF92ZWMyX3RlbXAueCwgX3ZlYzJfdGVtcDIueSAtIF92ZWMyX3RlbXAueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBMYXllciBvcmllbnRhdGlvbiwgd2hpY2ggaXMgdGhlIHNhbWUgYXMgdGhlIG1hcCBvcmllbnRhdGlvbi5cbiAgICAgKiAhI3poIOiOt+WPliBMYXllciDmlrnlkJEo5ZCM5Zyw5Zu+5pa55ZCRKeOAglxuICAgICAqIEBtZXRob2QgZ2V0TGF5ZXJPcmllbnRhdGlvblxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBvcmllbnRhdGlvbiA9IHRpbGVkTGF5ZXIuZ2V0TGF5ZXJPcmllbnRhdGlvbigpO1xuICAgICAqIGNjLmxvZyhcIkxheWVyIE9yaWVudGF0aW9uOiBcIiArIG9yaWVudGF0aW9uKTtcbiAgICAgKi9cbiAgICBnZXRMYXllck9yaWVudGF0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xheWVyT3JpZW50YXRpb247XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gcHJvcGVydGllcyBmcm9tIHRoZSBsYXllci4gVGhleSBjYW4gYmUgYWRkZWQgdXNpbmcgVGlsZWQuXG4gICAgICogISN6aCDojrflj5YgbGF5ZXIg55qE5bGe5oCn77yM5Y+v5Lul5L2/55SoIFRpbGVkIOe8lui+keWZqOa3u+WKoOWxnuaAp+OAglxuICAgICAqIEBtZXRob2QgZ2V0UHJvcGVydGllc1xuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBwcm9wZXJ0aWVzID0gdGlsZWRMYXllci5nZXRQcm9wZXJ0aWVzKCk7XG4gICAgICogY2MubG9nKFwiUHJvcGVydGllczogXCIgKyBwcm9wZXJ0aWVzKTtcbiAgICAgKi9cbiAgICBnZXRQcm9wZXJ0aWVzICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnRpZXM7XG4gICAgfSxcblxuICAgIF91cGRhdGVWZXJ0aWNlcyAoKSB7XG4gICAgICAgIGNvbnN0IFRpbGVkTWFwID0gY2MuVGlsZWRNYXA7XG4gICAgICAgIGNvbnN0IFRpbGVGbGFnID0gVGlsZWRNYXAuVGlsZUZsYWc7XG4gICAgICAgIGNvbnN0IEZMSVBQRURfTUFTSyA9IFRpbGVGbGFnLkZMSVBQRURfTUFTSztcbiAgICAgICAgY29uc3QgU3RhZ2dlckF4aXMgPSBUaWxlZE1hcC5TdGFnZ2VyQXhpcztcbiAgICAgICAgY29uc3QgT3JpZW50YXRpb24gPSBUaWxlZE1hcC5PcmllbnRhdGlvbjtcblxuICAgICAgICBsZXQgdmVydGljZXMgPSB0aGlzLl92ZXJ0aWNlcztcbiAgICAgICAgdmVydGljZXMubGVuZ3RoID0gMDtcblxuICAgICAgICBsZXQgbGF5ZXJPcmllbnRhdGlvbiA9IHRoaXMuX2xheWVyT3JpZW50YXRpb24sXG4gICAgICAgICAgICB0aWxlcyA9IHRoaXMuX3RpbGVzO1xuXG4gICAgICAgIGlmICghdGlsZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByaWdodFRvcCA9IHRoaXMuX3JpZ2h0VG9wO1xuICAgICAgICByaWdodFRvcC5yb3cgPSAtMTtcbiAgICAgICAgcmlnaHRUb3AuY29sID0gLTE7XG5cbiAgICAgICAgbGV0IG1hcHR3ID0gdGhpcy5fbWFwVGlsZVNpemUud2lkdGgsXG4gICAgICAgICAgICBtYXB0aCA9IHRoaXMuX21hcFRpbGVTaXplLmhlaWdodCxcbiAgICAgICAgICAgIG1hcHR3MiA9IG1hcHR3ICogMC41LFxuICAgICAgICAgICAgbWFwdGgyID0gbWFwdGggKiAwLjUsXG4gICAgICAgICAgICByb3dzID0gdGhpcy5fbGF5ZXJTaXplLmhlaWdodCxcbiAgICAgICAgICAgIGNvbHMgPSB0aGlzLl9sYXllclNpemUud2lkdGgsXG4gICAgICAgICAgICBncmlkcyA9IHRoaXMuX3RleEdyaWRzO1xuICAgICAgICBcbiAgICAgICAgbGV0IGNvbE9mZnNldCA9IDAsIGdpZCwgZ3JpZCwgbGVmdCwgYm90dG9tLFxuICAgICAgICAgICAgYXhpcywgZGlmZlgxLCBkaWZmWTEsIG9kZF9ldmVuLCBkaWZmWDIsIGRpZmZZMjtcblxuICAgICAgICBpZiAobGF5ZXJPcmllbnRhdGlvbiA9PT0gT3JpZW50YXRpb24uSEVYKSB7XG4gICAgICAgICAgICBheGlzID0gdGhpcy5fc3RhZ2dlckF4aXM7XG4gICAgICAgICAgICBkaWZmWDEgPSB0aGlzLl9kaWZmWDE7XG4gICAgICAgICAgICBkaWZmWTEgPSB0aGlzLl9kaWZmWTE7XG4gICAgICAgICAgICBvZGRfZXZlbiA9IHRoaXMuX29kZF9ldmVuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGN1bGxpbmdDb2wgPSAwLCBjdWxsaW5nUm93ID0gMDtcbiAgICAgICAgbGV0IHRpbGVPZmZzZXQgPSBudWxsLCBncmlkR0lEID0gMDtcblxuICAgICAgICB0aGlzLl90b3BPZmZzZXQgPSAwO1xuICAgICAgICB0aGlzLl9kb3duT2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5fbGVmdE9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMuX3JpZ2h0T2Zmc2V0ID0gMDtcbiAgICAgICAgdGhpcy5faGFzQW5pR3JpZCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGdyaWQgYm9yZGVyXG4gICAgICAgIGxldCB0b3BCb3JkZXIgPSAwLCBkb3duQm9yZGVyID0gMCwgbGVmdEJvcmRlciA9IDAsIHJpZ2h0Qm9yZGVyID0gMDtcblxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCByb3dzOyArK3Jvdykge1xuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgY29sczsgKytjb2wpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBjb2xPZmZzZXQgKyBjb2w7XG4gICAgICAgICAgICAgICAgZ2lkID0gdGlsZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIGdyaWRHSUQgPSAoKGdpZCAmIEZMSVBQRURfTUFTSykgPj4+IDApO1xuICAgICAgICAgICAgICAgIGdyaWQgPSBncmlkc1tncmlkR0lEXTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIGhhcyBhbmltYXRpb24sIGdyaWQgbXVzdCBiZSB1cGRhdGVkIHBlciBmcmFtZVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbmltYXRpb25zW2dyaWRHSURdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2hhc0FuaUdyaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghZ3JpZCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGxheWVyT3JpZW50YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbGVmdCB0b3AgdG8gcmlnaHQgZG93bVxuICAgICAgICAgICAgICAgICAgICBjYXNlIE9yaWVudGF0aW9uLk9SVEhPOlxuICAgICAgICAgICAgICAgICAgICAgICAgY3VsbGluZ0NvbCA9IGNvbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1bGxpbmdSb3cgPSByb3dzIC0gcm93IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgPSBjdWxsaW5nQ29sICogbWFwdHc7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3R0b20gPSBjdWxsaW5nUm93ICogbWFwdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgLy8gcmlnaHQgdG9wIHRvIGxlZnQgZG93blxuICAgICAgICAgICAgICAgICAgICBjYXNlIE9yaWVudGF0aW9uLklTTzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vdCBjb25zaWRlciBhYm91dCBjb2wsIHRoZW4gbGVmdCBpcyAndy8yICogKHJvd3MgLSByb3cgLSAxKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGNvbnNpZGVyIGFib3V0IGNvbCB0aGVuIGxlZnQgbXVzdCBhZGQgJ3cvMiAqIGNvbCdcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvIGxlZnQgaXMgJ3cvMiAqIChyb3dzIC0gcm93IC0gMSkgKyB3LzIgKiBjb2wnXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb21iaW5lIGV4cHJlc3Npb24gaXMgJ3cvMiAqIChyb3dzIC0gcm93ICsgY29sIC0xKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1bGxpbmdDb2wgPSByb3dzICsgY29sIC0gcm93IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIG5vdCBjb25zaWRlciBhYm91dCByb3csIHRoZW4gYm90dG9tIGlzICdoLzIgKiAoY29scyAtIGNvbCAtMSknXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiBjb25zaWRlciBhYm91dCByb3cgdGhlbiBib3R0b20gbXVzdCBhZGQgJ2gvMiAqIChyb3dzIC0gcm93IC0gMSknXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzbyBib3R0b20gaXMgJ2gvMiAqIChjb2xzIC0gY29sIC0xKSArIGgvMiAqIChyb3dzIC0gcm93IC0gMSknXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb21iaW5lIGV4cHJlc3Npb25uIGlzICdoLzIgKiAocm93cyArIGNvbHMgLSBjb2wgLSByb3cgLSAyKSdcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1bGxpbmdSb3cgPSByb3dzICsgY29scyAtIGNvbCAtIHJvdyAtIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gbWFwdHcyICogY3VsbGluZ0NvbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbSA9IG1hcHRoMiAqIGN1bGxpbmdSb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgLy8gbGVmdCB0b3AgdG8gcmlnaHQgZG93bVxuICAgICAgICAgICAgICAgICAgICBjYXNlIE9yaWVudGF0aW9uLkhFWDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpZmZYMiA9IChheGlzID09PSBTdGFnZ2VyQXhpcy5TVEFHR0VSQVhJU19ZICYmIHJvdyAlIDIgPT09IDEpID8gbWFwdHcyICogb2RkX2V2ZW4gOiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlmZlkyID0gKGF4aXMgPT09IFN0YWdnZXJBeGlzLlNUQUdHRVJBWElTX1ggJiYgY29sICUgMiA9PT0gMSkgPyBtYXB0aDIgKiAtb2RkX2V2ZW4gOiAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gY29sICogKG1hcHR3IC0gZGlmZlgxKSArIGRpZmZYMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvdHRvbSA9IChyb3dzIC0gcm93IC0gMSkgKiAobWFwdGggLSBkaWZmWTEpICsgZGlmZlkyO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VsbGluZ0NvbCA9IGNvbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1bGxpbmdSb3cgPSByb3dzIC0gcm93IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCByb3dEYXRhID0gdmVydGljZXNbY3VsbGluZ1Jvd10gPSB2ZXJ0aWNlc1tjdWxsaW5nUm93XSB8fCB7bWluQ29sOjAsIG1heENvbDowfTtcbiAgICAgICAgICAgICAgICBsZXQgY29sRGF0YSA9IHJvd0RhdGFbY3VsbGluZ0NvbF0gPSByb3dEYXRhW2N1bGxpbmdDb2xdIHx8IHt9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHJlY29yZCBlYWNoIHJvdyByYW5nZSwgaXQgd2lsbCBmYXN0ZXIgd2hlbiBjdWxsaW5nIGdyaWRcbiAgICAgICAgICAgICAgICBpZiAocm93RGF0YS5taW5Db2wgPiBjdWxsaW5nQ29sKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0RhdGEubWluQ29sID0gY3VsbGluZ0NvbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocm93RGF0YS5tYXhDb2wgPCBjdWxsaW5nQ29sKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd0RhdGEubWF4Q29sID0gY3VsbGluZ0NvbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyByZWNvcmQgbWF4IHJlY3QsIHdoZW4gdmlld1BvcnQgaXMgYmlnZ2VyIHRoYW4gbGF5ZXIsIGNhbiBtYWtlIGl0IHNtYWxsZXJcbiAgICAgICAgICAgICAgICBpZiAocmlnaHRUb3Aucm93IDwgY3VsbGluZ1Jvdykge1xuICAgICAgICAgICAgICAgICAgICByaWdodFRvcC5yb3cgPSBjdWxsaW5nUm93O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyaWdodFRvcC5jb2wgPCBjdWxsaW5nQ29sKSB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0VG9wLmNvbCA9IGN1bGxpbmdDb2w7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gX29mZnNldCBpcyB3aG9sZSBsYXllciBvZmZzZXRcbiAgICAgICAgICAgICAgICAvLyB0aWxlT2Zmc2V0IGlzIHRpbGVzZXQgb2Zmc2V0IHdoaWNoIGlzIHJlbGF0ZWQgdG8gZWFjaCBncmlkXG4gICAgICAgICAgICAgICAgLy8gdGlsZU9mZnNldCBjb29yZGluYXRlIHN5c3RlbSdzIHkgYXhpcyBpcyBvcHBvc2l0ZSB3aXRoIGVuZ2luZSdzIHkgYXhpcy5cbiAgICAgICAgICAgICAgICB0aWxlT2Zmc2V0ID0gZ3JpZC50aWxlc2V0LnRpbGVPZmZzZXQ7XG4gICAgICAgICAgICAgICAgbGVmdCArPSB0aGlzLl9vZmZzZXQueCArIHRpbGVPZmZzZXQueDtcbiAgICAgICAgICAgICAgICBib3R0b20gKz0gdGhpcy5fb2Zmc2V0LnkgLSB0aWxlT2Zmc2V0Lnk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdG9wQm9yZGVyID0gLXRpbGVPZmZzZXQueSArIGdyaWQudGlsZXNldC5fdGlsZVNpemUuaGVpZ2h0IC0gbWFwdGg7XG4gICAgICAgICAgICAgICAgdG9wQm9yZGVyID0gdG9wQm9yZGVyIDwgMCA/IDAgOiB0b3BCb3JkZXI7XG4gICAgICAgICAgICAgICAgZG93bkJvcmRlciA9IHRpbGVPZmZzZXQueSA8IDAgPyAwIDogdGlsZU9mZnNldC55O1xuICAgICAgICAgICAgICAgIGxlZnRCb3JkZXIgPSAtdGlsZU9mZnNldC54IDwgMCA/IDAgOiAtdGlsZU9mZnNldC54O1xuICAgICAgICAgICAgICAgIHJpZ2h0Qm9yZGVyID0gdGlsZU9mZnNldC54ICsgZ3JpZC50aWxlc2V0Ll90aWxlU2l6ZS53aWR0aCAtIG1hcHR3O1xuICAgICAgICAgICAgICAgIHJpZ2h0Qm9yZGVyID0gcmlnaHRCb3JkZXIgPCAwID8gMCA6IHJpZ2h0Qm9yZGVyO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3JpZ2h0T2Zmc2V0IDwgbGVmdEJvcmRlcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yaWdodE9mZnNldCA9IGxlZnRCb3JkZXI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xlZnRPZmZzZXQgPCByaWdodEJvcmRlcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sZWZ0T2Zmc2V0ID0gcmlnaHRCb3JkZXI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3RvcE9mZnNldCA8IGRvd25Cb3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdG9wT2Zmc2V0ID0gZG93bkJvcmRlcjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZG93bk9mZnNldCA8IHRvcEJvcmRlcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kb3duT2Zmc2V0ID0gdG9wQm9yZGVyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbERhdGEubGVmdCA9IGxlZnQ7XG4gICAgICAgICAgICAgICAgY29sRGF0YS5ib3R0b20gPSBib3R0b207XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpbmRleCBpcyB0aWxlZG1hcCBncmlkIGluZGV4XG4gICAgICAgICAgICAgICAgY29sRGF0YS5pbmRleCA9IGluZGV4OyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbE9mZnNldCArPSBjb2xzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3ZlcnRpY2VzRGlydHkgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlblxuICAgICAqIEdldCB0aGUgVGlsZWRUaWxlIHdpdGggdGhlIHRpbGUgY29vcmRpbmF0ZS48YnIvPlxuICAgICAqIElmIHRoZXJlIGlzIG5vIHRpbGUgaW4gdGhlIHNwZWNpZmllZCBjb29yZGluYXRlIGFuZCBmb3JjZUNyZWF0ZSBwYXJhbWV0ZXIgaXMgdHJ1ZSwgPGJyLz5cbiAgICAgKiB0aGVuIHdpbGwgY3JlYXRlIGEgbmV3IFRpbGVkVGlsZSBhdCB0aGUgY29vcmRpbmF0ZS5cbiAgICAgKiBUaGUgcmVuZGVyZXIgd2lsbCByZW5kZXIgdGhlIHRpbGUgd2l0aCB0aGUgcm90YXRpb24sIHNjYWxlLCBwb3NpdGlvbiBhbmQgY29sb3IgcHJvcGVydHkgb2YgdGhlIFRpbGVkVGlsZS5cbiAgICAgKiAhI3poXG4gICAgICog6YCa6L+H5oyH5a6a55qEIHRpbGUg5Z2Q5qCH6I635Y+W5a+55bqU55qEIFRpbGVkVGlsZeOAgiA8YnIvPlxuICAgICAqIOWmguaenOaMh+WumueahOWdkOagh+ayoeaciSB0aWxl77yM5bm25LiU6K6+572u5LqGIGZvcmNlQ3JlYXRlIOmCo+S5iOWwhuS8muWcqOaMh+WumueahOWdkOagh+WIm+W7uuS4gOS4quaWsOeahCBUaWxlZFRpbGUg44CCPGJyLz5cbiAgICAgKiDlnKjmuLLmn5Pov5nkuKogdGlsZSDnmoTml7blgJnvvIzlsIbkvJrkvb/nlKggVGlsZWRUaWxlIOeahOiKgueCueeahOaXi+i9rOOAgee8qeaUvuOAgeS9jeenu+OAgeminOiJsuWxnuaAp+OAgjxici8+XG4gICAgICogQG1ldGhvZCBnZXRUaWxlZFRpbGVBdFxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0geFxuICAgICAqIEBwYXJhbSB7SW50ZWdlcn0geVxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZm9yY2VDcmVhdGVcbiAgICAgKiBAcmV0dXJuIHtjYy5UaWxlZFRpbGV9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgdGlsZSA9IHRpbGVkTGF5ZXIuZ2V0VGlsZWRUaWxlQXQoMTAwLCAxMDAsIHRydWUpO1xuICAgICAqIGNjLmxvZyh0aWxlKTtcbiAgICAgKi9cbiAgICBnZXRUaWxlZFRpbGVBdCAoeCwgeSwgZm9yY2VDcmVhdGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzSW52YWxpZFBvc2l0aW9uKHgsIHkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlZExheWVyLmdldFRpbGVkVGlsZUF0OiBpbnZhbGlkIHBvc2l0aW9uXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fdGlsZXMpIHtcbiAgICAgICAgICAgIGNjLmxvZ0lEKDcyMzYpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKHgpICsgTWF0aC5mbG9vcih5KSAqIHRoaXMuX2xheWVyU2l6ZS53aWR0aDtcbiAgICAgICAgbGV0IHRpbGUgPSB0aGlzLl90aWxlZFRpbGVzW2luZGV4XTtcbiAgICAgICAgaWYgKCF0aWxlICYmIGZvcmNlQ3JlYXRlKSB7XG4gICAgICAgICAgICBsZXQgbm9kZSA9IG5ldyBjYy5Ob2RlKCk7XG4gICAgICAgICAgICB0aWxlID0gbm9kZS5hZGRDb21wb25lbnQoY2MuVGlsZWRUaWxlKTtcbiAgICAgICAgICAgIHRpbGUuX3ggPSB4O1xuICAgICAgICAgICAgdGlsZS5feSA9IHk7XG4gICAgICAgICAgICB0aWxlLl9sYXllciA9IHRoaXM7XG4gICAgICAgICAgICB0aWxlLl91cGRhdGVJbmZvKCk7XG4gICAgICAgICAgICBub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICAgICAgICAgIHJldHVybiB0aWxlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aWxlO1xuICAgIH0sXG5cbiAgICAvKiogXG4gICAgICogISNlblxuICAgICAqIENoYW5nZSB0aWxlIHRvIFRpbGVkVGlsZSBhdCB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGUuXG4gICAgICogISN6aFxuICAgICAqIOWwhuaMh+WumueahCB0aWxlIOWdkOagh+abv+aNouS4uuaMh+WumueahCBUaWxlZFRpbGXjgIJcbiAgICAgKiBAbWV0aG9kIHNldFRpbGVkVGlsZUF0XG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSB4XG4gICAgICogQHBhcmFtIHtJbnRlZ2VyfSB5XG4gICAgICogQHBhcmFtIHtjYy5UaWxlZFRpbGV9IHRpbGVkVGlsZVxuICAgICAqIEByZXR1cm4ge2NjLlRpbGVkVGlsZX1cbiAgICAgKi9cbiAgICBzZXRUaWxlZFRpbGVBdCAoeCwgeSwgdGlsZWRUaWxlKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc0ludmFsaWRQb3NpdGlvbih4LCB5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGlsZWRMYXllci5zZXRUaWxlZFRpbGVBdDogaW52YWxpZCBwb3NpdGlvblwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3RpbGVzKSB7XG4gICAgICAgICAgICBjYy5sb2dJRCg3MjM2KTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGluZGV4ID0gTWF0aC5mbG9vcih4KSArIE1hdGguZmxvb3IoeSkgKiB0aGlzLl9sYXllclNpemUud2lkdGg7XG4gICAgICAgIHRoaXMuX3RpbGVkVGlsZXNbaW5kZXhdID0gdGlsZWRUaWxlO1xuICAgICAgICB0aGlzLl9jdWxsaW5nRGlydHkgPSB0cnVlO1xuXG4gICAgICAgIGlmICh0aWxlZFRpbGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2hhc1RpbGVkTm9kZUdyaWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faGFzVGlsZWROb2RlR3JpZCA9IHRoaXMuX3RpbGVkVGlsZXMuc29tZShmdW5jdGlvbiAodGlsZWROb2RlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIXRpbGVkTm9kZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpbGVkVGlsZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm4gdGV4dHVyZS5cbiAgICAgKiAhI3poIOiOt+WPlue6ueeQhuOAglxuICAgICAqIEBtZXRob2QgZ2V0VGV4dHVyZVxuICAgICAqIEBwYXJhbSBpbmRleCBUaGUgaW5kZXggb2YgdGV4dHVyZXNcbiAgICAgKiBAcmV0dXJuIHtUZXh0dXJlMkR9XG4gICAgICovXG4gICAgZ2V0VGV4dHVyZSAoaW5kZXgpIHtcbiAgICAgICAgaW5kZXggPSBpbmRleCB8fCAwO1xuICAgICAgICBpZiAodGhpcy5fdGV4dHVyZXMgJiYgaW5kZXggPj0gMCAmJiB0aGlzLl90ZXh0dXJlcy5sZW5ndGggPiBpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RleHR1cmVzW2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBSZXR1cm4gdGV4dHVyZS5cbiAgICAgKiAhI3poIOiOt+WPlue6ueeQhuOAglxuICAgICAqIEBtZXRob2QgZ2V0VGV4dHVyZXNcbiAgICAgKiBAcmV0dXJuIHtUZXh0dXJlMkR9XG4gICAgICovXG4gICAgZ2V0VGV4dHVyZXMgKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dHVyZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gU2V0IHRoZSB0ZXh0dXJlLlxuICAgICAqICEjemgg6K6+572u57q555CG44CCXG4gICAgICogQG1ldGhvZCBzZXRUZXh0dXJlXG4gICAgICogQHBhcmFtIHtUZXh0dXJlMkR9IHRleHR1cmVcbiAgICAgKi9cbiAgICBzZXRUZXh0dXJlICh0ZXh0dXJlKXtcbiAgICAgICAgdGhpcy5zZXRUZXh0dXJlcyhbdGV4dHVyZV0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldCB0aGUgdGV4dHVyZS5cbiAgICAgKiAhI3poIOiuvue9rue6ueeQhuOAglxuICAgICAqIEBtZXRob2Qgc2V0VGV4dHVyZVxuICAgICAqIEBwYXJhbSB7VGV4dHVyZTJEfSB0ZXh0dXJlc1xuICAgICAqL1xuICAgIHNldFRleHR1cmVzICh0ZXh0dXJlcykge1xuICAgICAgICB0aGlzLl90ZXh0dXJlcyA9IHRleHR1cmVzO1xuICAgICAgICB0aGlzLl9hY3RpdmF0ZU1hdGVyaWFsKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyBsYXllciBzaXplLlxuICAgICAqICEjemgg6I635b6X5bGC5aSn5bCP44CCXG4gICAgICogQG1ldGhvZCBnZXRMYXllclNpemVcbiAgICAgKiBAcmV0dXJuIHtTaXplfVxuICAgICAqIEBleGFtcGxlXG4gICAgICogbGV0IHNpemUgPSB0aWxlZExheWVyLmdldExheWVyU2l6ZSgpO1xuICAgICAqIGNjLmxvZyhcImxheWVyIHNpemU6IFwiICsgc2l6ZSk7XG4gICAgICovXG4gICAgZ2V0TGF5ZXJTaXplICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xheWVyU2l6ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTaXplIG9mIHRoZSBtYXAncyB0aWxlIChjb3VsZCBiZSBkaWZmZXJlbnQgZnJvbSB0aGUgdGlsZSdzIHNpemUpLlxuICAgICAqICEjemgg6I635Y+WIHRpbGUg55qE5aSn5bCPKCB0aWxlIOeahOWkp+Wwj+WPr+iDveS8muacieaJgOS4jeWQjCnjgIJcbiAgICAgKiBAbWV0aG9kIGdldE1hcFRpbGVTaXplXG4gICAgICogQHJldHVybiB7U2l6ZX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGxldCBtYXBUaWxlU2l6ZSA9IHRpbGVkTGF5ZXIuZ2V0TWFwVGlsZVNpemUoKTtcbiAgICAgKiBjYy5sb2coXCJNYXBUaWxlIHNpemU6IFwiICsgbWFwVGlsZVNpemUpO1xuICAgICAqL1xuICAgIGdldE1hcFRpbGVTaXplICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcFRpbGVTaXplO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIEdldHMgVGlsZSBzZXQgZmlyc3QgaW5mb3JtYXRpb24gZm9yIHRoZSBsYXllci5cbiAgICAgKiAhI3poIOiOt+WPliBsYXllciDntKLlvJXkvY3nva7kuLow55qEIFRpbGVzZXQg5L+h5oGv44CCXG4gICAgICogQG1ldGhvZCBnZXRUaWxlU2V0XG4gICAgICogQHBhcmFtIGluZGV4IFRoZSBpbmRleCBvZiB0aWxlc2V0c1xuICAgICAqIEByZXR1cm4ge1RNWFRpbGVzZXRJbmZvfVxuICAgICAqL1xuICAgIGdldFRpbGVTZXQgKGluZGV4KSB7XG4gICAgICAgIGluZGV4ID0gaW5kZXggfHwgMDtcbiAgICAgICAgaWYgKHRoaXMuX3RpbGVzZXRzICYmIGluZGV4ID49IDAgJiYgdGhpcy5fdGlsZXNldHMubGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90aWxlc2V0c1tpbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqICEjZW4gR2V0cyB0aWxlIHNldCBhbGwgaW5mb3JtYXRpb24gZm9yIHRoZSBsYXllci5cbiAgICAgKiAhI3poIOiOt+WPliBsYXllciDmiYDmnInnmoQgVGlsZXNldCDkv6Hmga/jgIJcbiAgICAgKiBAbWV0aG9kIGdldFRpbGVTZXRcbiAgICAgKiBAcmV0dXJuIHtUTVhUaWxlc2V0SW5mb31cbiAgICAgKi9cbiAgICBnZXRUaWxlU2V0cyAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90aWxlc2V0cztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogISNlbiBTZXRzIHRpbGUgc2V0IGluZm9ybWF0aW9uIGZvciB0aGUgbGF5ZXIuXG4gICAgICogISN6aCDorr7nva4gbGF5ZXIg55qEIHRpbGVzZXQg5L+h5oGv44CCXG4gICAgICogQG1ldGhvZCBzZXRUaWxlU2V0XG4gICAgICogQHBhcmFtIHtUTVhUaWxlc2V0SW5mb30gdGlsZXNldFxuICAgICAqL1xuICAgIHNldFRpbGVTZXQgKHRpbGVzZXQpIHtcbiAgICAgICAgdGhpcy5zZXRUaWxlU2V0cyhbdGlsZXNldF0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiAhI2VuIFNldHMgVGlsZSBzZXQgaW5mb3JtYXRpb24gZm9yIHRoZSBsYXllci5cbiAgICAgKiAhI3poIOiuvue9riBsYXllciDnmoQgVGlsZXNldCDkv6Hmga/jgIJcbiAgICAgKiBAbWV0aG9kIHNldFRpbGVTZXRzXG4gICAgICogQHBhcmFtIHtUTVhUaWxlc2V0SW5mb30gdGlsZXNldHNcbiAgICAgKi9cbiAgICBzZXRUaWxlU2V0cyAodGlsZXNldHMpIHtcbiAgICAgICAgdGhpcy5fdGlsZXNldHMgPSB0aWxlc2V0cztcbiAgICAgICAgbGV0IHRleHR1cmVzID0gdGhpcy5fdGV4dHVyZXMgPSBbXTtcbiAgICAgICAgbGV0IHRleEdyaWRzID0gdGhpcy5fdGV4R3JpZHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlc2V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHRpbGVzZXQgPSB0aWxlc2V0c1tpXTtcbiAgICAgICAgICAgIGlmICh0aWxlc2V0KSB7XG4gICAgICAgICAgICAgICAgdGV4dHVyZXNbaV0gPSB0aWxlc2V0LnNvdXJjZUltYWdlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY2MuVGlsZWRNYXAubG9hZEFsbFRleHR1cmVzICh0ZXh0dXJlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aWxlc2V0cy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgICAgICAgICAgICBsZXQgdGlsZXNldEluZm8gPSB0aWxlc2V0c1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoIXRpbGVzZXRJbmZvKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYy5UaWxlZE1hcC5maWxsVGV4dHVyZUdyaWRzKHRpbGVzZXRJbmZvLCB0ZXhHcmlkcywgaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9wcmVwYXJlVG9SZW5kZXIoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgX3RyYXZlcnNlQWxsR3JpZCAoKSB7XG4gICAgICAgIGxldCB0aWxlcyA9IHRoaXMuX3RpbGVzO1xuICAgICAgICBsZXQgdGV4R3JpZHMgPSB0aGlzLl90ZXhHcmlkcztcbiAgICAgICAgbGV0IHRpbGVzZXRJbmRleEFyciA9IHRoaXMuX3RpbGVzZXRJbmRleEFycjtcbiAgICAgICAgbGV0IHRpbGVzZXRJZHhNYXAgPSB7fTtcblxuICAgICAgICBjb25zdCBUaWxlZE1hcCA9IGNjLlRpbGVkTWFwO1xuICAgICAgICBjb25zdCBUaWxlRmxhZyA9IFRpbGVkTWFwLlRpbGVGbGFnO1xuICAgICAgICBjb25zdCBGTElQUEVEX01BU0sgPSBUaWxlRmxhZy5GTElQUEVEX01BU0s7XG5cbiAgICAgICAgdGlsZXNldEluZGV4QXJyLmxlbmd0aCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBnaWQgPSB0aWxlc1tpXTtcbiAgICAgICAgICAgIGlmIChnaWQgPT09IDApIGNvbnRpbnVlO1xuICAgICAgICAgICAgZ2lkID0gKChnaWQgJiBGTElQUEVEX01BU0spID4+PiAwKTtcbiAgICAgICAgICAgIGxldCBncmlkID0gdGV4R3JpZHNbZ2lkXTtcbiAgICAgICAgICAgIGlmICghZ3JpZCkge1xuICAgICAgICAgICAgICAgIGNjLmVycm9yKFwiQ0NUaWxlZExheWVyOl90cmF2ZXJzZUFsbEdyaWQgZ3JpZCBpcyBudWxsLCBnaWQgaXM6XCIsIGdpZCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgdGlsZXNldElkeCA9IGdyaWQudGV4SWQ7XG4gICAgICAgICAgICBpZiAodGlsZXNldElkeE1hcFt0aWxlc2V0SWR4XSkgY29udGludWU7XG4gICAgICAgICAgICB0aWxlc2V0SWR4TWFwW3RpbGVzZXRJZHhdID0gdHJ1ZTtcbiAgICAgICAgICAgIHRpbGVzZXRJbmRleEFyci5wdXNoKHRpbGVzZXRJZHgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9pbml0IChsYXllckluZm8sIG1hcEluZm8sIHRpbGVzZXRzLCB0ZXh0dXJlcywgdGV4R3JpZHMpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuX2N1bGxpbmdEaXJ0eSA9IHRydWU7XG4gICAgICAgIHRoaXMuX2xheWVySW5mbyA9IGxheWVySW5mbztcbiAgICAgICAgdGhpcy5fbWFwSW5mbyA9IG1hcEluZm87XG5cbiAgICAgICAgbGV0IHNpemUgPSBsYXllckluZm8uX2xheWVyU2l6ZTtcblxuICAgICAgICAvLyBsYXllckluZm9cbiAgICAgICAgdGhpcy5fbGF5ZXJOYW1lID0gbGF5ZXJJbmZvLm5hbWU7XG4gICAgICAgIHRoaXMuX3RpbGVzID0gbGF5ZXJJbmZvLl90aWxlcztcbiAgICAgICAgdGhpcy5fcHJvcGVydGllcyA9IGxheWVySW5mby5wcm9wZXJ0aWVzO1xuICAgICAgICB0aGlzLl9sYXllclNpemUgPSBzaXplO1xuICAgICAgICB0aGlzLl9taW5HSUQgPSBsYXllckluZm8uX21pbkdJRDtcbiAgICAgICAgdGhpcy5fbWF4R0lEID0gbGF5ZXJJbmZvLl9tYXhHSUQ7XG4gICAgICAgIHRoaXMuX29wYWNpdHkgPSBsYXllckluZm8uX29wYWNpdHk7XG4gICAgICAgIHRoaXMuX3JlbmRlck9yZGVyID0gbWFwSW5mby5yZW5kZXJPcmRlcjtcbiAgICAgICAgdGhpcy5fc3RhZ2dlckF4aXMgPSBtYXBJbmZvLmdldFN0YWdnZXJBeGlzKCk7XG4gICAgICAgIHRoaXMuX3N0YWdnZXJJbmRleCA9IG1hcEluZm8uZ2V0U3RhZ2dlckluZGV4KCk7XG4gICAgICAgIHRoaXMuX2hleFNpZGVMZW5ndGggPSBtYXBJbmZvLmdldEhleFNpZGVMZW5ndGgoKTtcbiAgICAgICAgdGhpcy5fYW5pbWF0aW9ucyA9IG1hcEluZm8uZ2V0VGlsZUFuaW1hdGlvbnMoKTtcblxuICAgICAgICAvLyB0aWxlc2V0c1xuICAgICAgICB0aGlzLl90aWxlc2V0cyA9IHRpbGVzZXRzO1xuICAgICAgICAvLyB0ZXh0dXJlc1xuICAgICAgICB0aGlzLl90ZXh0dXJlcyA9IHRleHR1cmVzO1xuICAgICAgICAvLyBncmlkIHRleHR1cmVcbiAgICAgICAgdGhpcy5fdGV4R3JpZHMgPSB0ZXhHcmlkcztcblxuICAgICAgICAvLyBtYXBJbmZvXG4gICAgICAgIHRoaXMuX2xheWVyT3JpZW50YXRpb24gPSBtYXBJbmZvLm9yaWVudGF0aW9uO1xuICAgICAgICB0aGlzLl9tYXBUaWxlU2l6ZSA9IG1hcEluZm8uZ2V0VGlsZVNpemUoKTtcblxuICAgICAgICBsZXQgbWFwdHcgPSB0aGlzLl9tYXBUaWxlU2l6ZS53aWR0aDtcbiAgICAgICAgbGV0IG1hcHRoID0gdGhpcy5fbWFwVGlsZVNpemUuaGVpZ2h0O1xuICAgICAgICBsZXQgbGF5ZXJXID0gdGhpcy5fbGF5ZXJTaXplLndpZHRoO1xuICAgICAgICBsZXQgbGF5ZXJIID0gdGhpcy5fbGF5ZXJTaXplLmhlaWdodDtcblxuICAgICAgICBpZiAodGhpcy5fbGF5ZXJPcmllbnRhdGlvbiA9PT0gY2MuVGlsZWRNYXAuT3JpZW50YXRpb24uSEVYKSB7XG4gICAgICAgICAgICAvLyBoYW5kbGUgaGV4IG1hcFxuICAgICAgICAgICAgY29uc3QgVGlsZWRNYXAgPSBjYy5UaWxlZE1hcDtcbiAgICAgICAgICAgIGNvbnN0IFN0YWdnZXJBeGlzID0gVGlsZWRNYXAuU3RhZ2dlckF4aXM7XG4gICAgICAgICAgICBjb25zdCBTdGFnZ2VySW5kZXggPSBUaWxlZE1hcC5TdGFnZ2VySW5kZXg7ICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgd2lkdGggPSAwLCBoZWlnaHQgPSAwO1xuXG4gICAgICAgICAgICB0aGlzLl9vZGRfZXZlbiA9ICh0aGlzLl9zdGFnZ2VySW5kZXggPT09IFN0YWdnZXJJbmRleC5TVEFHR0VSSU5ERVhfT0REKSA/IDEgOiAtMTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdGFnZ2VyQXhpcyA9PT0gU3RhZ2dlckF4aXMuU1RBR0dFUkFYSVNfWCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RpZmZYMSA9IChtYXB0dyAtIHRoaXMuX2hleFNpZGVMZW5ndGgpIC8gMjtcbiAgICAgICAgICAgICAgICB0aGlzLl9kaWZmWTEgPSAwO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IG1hcHRoICogKGxheWVySCArIDAuNSk7XG4gICAgICAgICAgICAgICAgd2lkdGggPSAobWFwdHcgKyB0aGlzLl9oZXhTaWRlTGVuZ3RoKSAqIE1hdGguZmxvb3IobGF5ZXJXIC8gMikgKyBtYXB0dyAqIChsYXllclcgJSAyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlmZlgxID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9kaWZmWTEgPSAobWFwdGggLSB0aGlzLl9oZXhTaWRlTGVuZ3RoKSAvIDI7XG4gICAgICAgICAgICAgICAgd2lkdGggPSBtYXB0dyAqIChsYXllclcgKyAwLjUpO1xuICAgICAgICAgICAgICAgIGhlaWdodCA9IChtYXB0aCArIHRoaXMuX2hleFNpZGVMZW5ndGgpICogTWF0aC5mbG9vcihsYXllckggLyAyKSArIG1hcHRoICogKGxheWVySCAlIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5ub2RlLnNldENvbnRlbnRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2xheWVyT3JpZW50YXRpb24gPT09IGNjLlRpbGVkTWFwLk9yaWVudGF0aW9uLklTTykge1xuICAgICAgICAgICAgbGV0IHdoID0gbGF5ZXJXICsgbGF5ZXJIO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldENvbnRlbnRTaXplKG1hcHR3ICogMC41ICogd2gsIG1hcHRoICogMC41ICogd2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldENvbnRlbnRTaXplKGxheWVyVyAqIG1hcHR3LCBsYXllckggKiBtYXB0aCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBvZmZzZXQgKGFmdGVyIGxheWVyIG9yaWVudGF0aW9uIGlzIHNldCk7XG4gICAgICAgIHRoaXMuX29mZnNldCA9IGNjLnYyKGxheWVySW5mby5vZmZzZXQueCwgLWxheWVySW5mby5vZmZzZXQueSk7XG4gICAgICAgIHRoaXMuX3VzZUF1dG9tYXRpY1ZlcnRleFogPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdmVydGV4WnZhbHVlID0gMDtcbiAgICAgICAgdGhpcy5fc3luY0FuY2hvclBvaW50KCk7XG4gICAgICAgIHRoaXMuX3ByZXBhcmVUb1JlbmRlcigpO1xuICAgIH0sXG5cbiAgICBfcHJlcGFyZVRvUmVuZGVyICgpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlVmVydGljZXMoKTtcbiAgICAgICAgdGhpcy5fdHJhdmVyc2VBbGxHcmlkKCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUFsbFVzZXJOb2RlKCk7XG4gICAgICAgIHRoaXMuX2FjdGl2YXRlTWF0ZXJpYWwoKTtcbiAgICB9LFxuXG4gICAgX2FjdGl2YXRlTWF0ZXJpYWwgKCkge1xuICAgICAgICBsZXQgdGlsZXNldEluZGV4QXJyID0gdGhpcy5fdGlsZXNldEluZGV4QXJyO1xuICAgICAgICBpZiAodGlsZXNldEluZGV4QXJyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5kaXNhYmxlUmVuZGVyKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdGV4SWRNYXRJZHggPSB0aGlzLl90ZXhJZFRvTWF0SW5kZXggPSB7fTtcbiAgICAgICAgbGV0IHRleHR1cmVzID0gdGhpcy5fdGV4dHVyZXM7XG4gICAgICAgIGxldCBtYXRMZW4gPSB0aWxlc2V0SW5kZXhBcnIubGVuZ3RoO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0TGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB0aWxlc2V0SWR4ID0gdGlsZXNldEluZGV4QXJyW2ldO1xuICAgICAgICAgICAgbGV0IHRleHR1cmUgPSB0ZXh0dXJlc1t0aWxlc2V0SWR4XTtcblxuICAgICAgICAgICAgbGV0IG1hdGVyaWFsID0gdGhpcy5fbWF0ZXJpYWxzW2ldO1xuICAgICAgICAgICAgaWYgKCFtYXRlcmlhbCkge1xuICAgICAgICAgICAgICAgIG1hdGVyaWFsID0gTWF0ZXJpYWwuZ2V0QnVpbHRpbk1hdGVyaWFsKCcyZC1zcHJpdGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdGVyaWFsID0gTWF0ZXJpYWxWYXJpYW50LmNyZWF0ZShtYXRlcmlhbCwgdGhpcyk7XG5cbiAgICAgICAgICAgIG1hdGVyaWFsLmRlZmluZSgnQ0NfVVNFX01PREVMJywgdHJ1ZSk7XG4gICAgICAgICAgICBtYXRlcmlhbC5zZXRQcm9wZXJ0eSgndGV4dHVyZScsIHRleHR1cmUpO1xuXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbHNbaV0gPSBtYXRlcmlhbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGV4SWRNYXRJZHhbdGlsZXNldElkeF0gPSBpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hdGVyaWFscy5sZW5ndGggPSBtYXRMZW47XG4gICAgICAgIHRoaXMubWFya0ZvclJlbmRlcih0cnVlKTtcbiAgICB9XG59KTtcblxuY2MuVGlsZWRMYXllciA9IG1vZHVsZS5leHBvcnRzID0gVGlsZWRMYXllcjtcbiJdfQ==