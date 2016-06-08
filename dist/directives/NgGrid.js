"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var NgGridPlaceholder_1 = require("../components/NgGridPlaceholder");
var NgGrid = (function () {
    //	Constructor
    function NgGrid(_differs, _ngEl, _renderer, _loader, _containerRef) {
        this._differs = _differs;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this._loader = _loader;
        this._containerRef = _containerRef;
        //	Event Emitters
        this.onDragStart = new core_1.EventEmitter();
        this.onDrag = new core_1.EventEmitter();
        this.onDragStop = new core_1.EventEmitter();
        this.onResizeStart = new core_1.EventEmitter();
        this.onResize = new core_1.EventEmitter();
        this.onResizeStop = new core_1.EventEmitter();
        this.onItemChange = new core_1.EventEmitter();
        //	Public variables
        this.colWidth = 250;
        this.rowHeight = 250;
        this.minCols = 1;
        this.minRows = 1;
        this.marginTop = 10;
        this.marginRight = 10;
        this.marginBottom = 10;
        this.marginLeft = 10;
        this.isDragging = false;
        this.isResizing = false;
        this.autoStyle = true;
        this.resizeEnable = true;
        this.dragEnable = true;
        this.cascade = 'up';
        this.minWidth = 100;
        this.minHeight = 100;
        //	Private variables
        this._items = [];
        this._draggingItem = null;
        this._resizingItem = null;
        this._resizeDirection = null;
        this._itemGrid = { 1: { 1: null } };
        this._maxCols = 0;
        this._maxRows = 0;
        this._visibleCols = 0;
        this._visibleRows = 0;
        this._setWidth = 250;
        this._setHeight = 250;
        this._posOffset = null;
        this._adding = false;
        this._placeholderRef = null;
        this._fixToGrid = false;
        this._autoResize = false;
        this._destroyed = false;
        this._maintainRatio = false;
        this._preferNew = false;
        this._zoomOnDrag = false;
        this._limitToScreen = false;
        this._config = NgGrid.CONST_DEFAULT_CONFIG;
    }
    Object.defineProperty(NgGrid.prototype, "config", {
        //	[ng-grid] attribute handler
        set: function (v) {
            this.setConfig(v);
            if (this._differ == null && v != null) {
                this._differ = this._differs.find(this._config).create(null);
            }
        },
        enumerable: true,
        configurable: true
    });
    //	Public methods
    NgGrid.prototype.ngOnInit = function () {
        this._renderer.setElementClass(this._ngEl.nativeElement, 'grid', true);
        if (this.autoStyle)
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'relative');
        this.setConfig(this._config);
    };
    NgGrid.prototype.ngOnDestroy = function () {
        this._destroyed = true;
    };
    NgGrid.prototype.setConfig = function (config) {
        this._config = config;
        var maxColRowChanged = false;
        for (var x in config) {
            var val = config[x];
            var intVal = !val ? 0 : parseInt(val);
            switch (x) {
                case 'margins':
                    this.setMargins(val);
                    break;
                case 'col_width':
                    this.colWidth = intVal;
                    break;
                case 'row_height':
                    this.rowHeight = intVal;
                    break;
                case 'auto_style':
                    this.autoStyle = val ? true : false;
                    break;
                case 'auto_resize':
                    this._autoResize = val ? true : false;
                    break;
                case 'draggable':
                    this.dragEnable = val ? true : false;
                    break;
                case 'resizable':
                    this.resizeEnable = val ? true : false;
                    break;
                case 'max_rows':
                    maxColRowChanged = maxColRowChanged || this._maxRows != intVal;
                    this._maxRows = intVal < 0 ? 0 : intVal;
                    break;
                case 'max_cols':
                    maxColRowChanged = maxColRowChanged || this._maxCols != intVal;
                    this._maxCols = intVal < 0 ? 0 : intVal;
                    break;
                case 'visible_rows':
                    this._visibleRows = intVal < 0 ? 0 : intVal;
                    break;
                case 'visible_cols':
                    this._visibleCols = intVal < 0 ? 0 : intVal;
                    break;
                case 'min_rows':
                    this.minRows = Math.max(intVal, 1);
                    break;
                case 'min_cols':
                    this.minCols = Math.max(intVal, 1);
                    break;
                case 'min_height':
                    this.minHeight = intVal;
                    break;
                case 'min_width':
                    this.minWidth = intVal;
                    break;
                case 'zoom_on_drag':
                    this._zoomOnDrag = val ? true : false;
                    break;
                case 'cascade':
                    if (this.cascade != val) {
                        this.cascade = val;
                        this._cascadeGrid();
                    }
                    break;
                case 'fix_to_grid':
                    this._fixToGrid = val ? true : false;
                    break;
                case 'maintain_ratio':
                    this._maintainRatio = val ? true : false;
                    break;
                case 'prefer_new':
                    this._preferNew = val ? true : false;
                    break;
                case 'limit_to_screen':
                    this._limitToScreen = val ? true : false;
                    break;
            }
        }
        if (this._maintainRatio) {
            if (this.colWidth && this.rowHeight) {
                this._aspectRatio = this.colWidth / this.rowHeight;
            }
            else {
                this._maintainRatio = false;
            }
        }
        if (maxColRowChanged) {
            if (this._maxCols > 0 && this._maxRows > 0) {
                switch (this.cascade) {
                    case "left":
                    case "right":
                        this._maxCols = 0;
                        break;
                    case "up":
                    case "down":
                    default:
                        this._maxRows = 0;
                        break;
                }
            }
            for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                var item = _a[_i];
                var pos = item.getGridPosition();
                var dims = item.getSize();
                this._removeFromGrid(item);
                if (this._maxCols > 0 && dims.x > this._maxCols) {
                    dims.x = this._maxCols;
                    item.setSize(dims);
                }
                else if (this._maxRows > 0 && dims.y > this._maxRows) {
                    dims.y = this._maxRows;
                    item.setSize(dims);
                }
                if (this._hasGridCollision(pos, dims) || !this._isWithinBounds(pos, dims)) {
                    var newPosition = this._fixGridPosition(pos, dims);
                    item.setGridPosition(newPosition);
                }
                this._addToGrid(item);
            }
            this._cascadeGrid();
        }
        this._calculateRowHeight();
        this._calculateColWidth();
        var maxWidth = this._maxCols * this.colWidth;
        var maxHeight = this._maxRows * this.rowHeight;
        if (maxWidth > 0 && this.minWidth > maxWidth)
            this.minWidth = 0.75 * this.colWidth;
        if (maxHeight > 0 && this.minHeight > maxHeight)
            this.minHeight = 0.75 * this.rowHeight;
        if (this.minWidth > this.colWidth)
            this.minCols = Math.max(this.minCols, Math.ceil(this.minWidth / this.colWidth));
        if (this.minHeight > this.rowHeight)
            this.minRows = Math.max(this.minRows, Math.ceil(this.minHeight / this.rowHeight));
        if (this._maxCols > 0 && this.minCols > this._maxCols)
            this.minCols = 1;
        if (this._maxRows > 0 && this.minRows > this._maxRows)
            this.minRows = 1;
        this._updateRatio();
        for (var _b = 0, _c = this._items; _b < _c.length; _b++) {
            var item = _c[_b];
            this._removeFromGrid(item);
            item.setCascadeMode(this.cascade);
        }
        this._updateLimit();
        for (var _d = 0, _e = this._items; _d < _e.length; _d++) {
            var item = _e[_d];
            item.recalculateSelf();
            this._addToGrid(item);
        }
        this._cascadeGrid(null, null, false);
        this._updateSize();
    };
    NgGrid.prototype.getItemPosition = function (index) {
        return this._items[index].getGridPosition();
    };
    NgGrid.prototype.getItemSize = function (index) {
        return this._items[index].getSize();
    };
    NgGrid.prototype.ngDoCheck = function () {
        if (this._differ != null) {
            var changes = this._differ.diff(this._config);
            if (changes != null) {
                this._applyChanges(changes);
                return true;
            }
        }
        return false;
    };
    NgGrid.prototype.setMargins = function (margins) {
        this.marginTop = parseInt(margins[0]);
        this.marginRight = margins.length >= 2 ? parseInt(margins[1]) : this.marginTop;
        this.marginBottom = margins.length >= 3 ? parseInt(margins[2]) : this.marginTop;
        this.marginBottom = margins.length >= 3 ? parseInt(margins[2]) : this.marginTop;
        this.marginLeft = margins.length >= 4 ? parseInt(margins[3]) : this.marginRight;
    };
    NgGrid.prototype.enableDrag = function () {
        this.dragEnable = true;
    };
    NgGrid.prototype.disableDrag = function () {
        this.dragEnable = false;
    };
    NgGrid.prototype.enableResize = function () {
        this.resizeEnable = true;
    };
    NgGrid.prototype.disableResize = function () {
        this.resizeEnable = false;
    };
    NgGrid.prototype.addItem = function (ngItem) {
        ngItem.setCascadeMode(this.cascade);
        if (!this._preferNew) {
            var newPos = this._fixGridPosition(ngItem.getGridPosition(), ngItem.getSize());
            ngItem.savePosition(newPos);
        }
        this._items.push(ngItem);
        this._addToGrid(ngItem);
        ngItem.recalculateSelf();
        ngItem.onCascadeEvent();
    };
    NgGrid.prototype.removeItem = function (ngItem) {
        this._removeFromGrid(ngItem);
        for (var x = 0; x < this._items.length; x++) {
            if (this._items[x] == ngItem) {
                this._items.splice(x, 1);
            }
        }
        if (this._destroyed)
            return;
        this._cascadeGrid();
        this._updateSize();
        this._items.forEach(function (item) { return item.recalculateSelf(); });
    };
    NgGrid.prototype.updateItem = function (ngItem) {
        this._removeFromGrid(ngItem);
        this._addToGrid(ngItem);
        this._cascadeGrid();
        this._updateSize();
        ngItem.onCascadeEvent();
    };
    NgGrid.prototype.triggerCascade = function () {
        this._cascadeGrid(null, null, false);
    };
    //	Private methods
    NgGrid.prototype._calculateColWidth = function () {
        if (this._autoResize) {
            if (this._maxCols > 0 || this._visibleCols > 0) {
                var maxCols = this._maxCols > 0 ? this._maxCols : this._visibleCols;
                var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
                var colWidth = Math.floor(maxWidth / maxCols);
                colWidth -= (this.marginLeft + this.marginRight);
                if (colWidth > 0)
                    this.colWidth = colWidth;
                if (this.colWidth < this.minWidth || this.minCols > this._config.min_cols) {
                    this.minCols = Math.max(this._config.min_cols, Math.ceil(this.minWidth / this.colWidth));
                }
            }
        }
    };
    NgGrid.prototype._calculateRowHeight = function () {
        if (this._autoResize) {
            if (this._maxRows > 0 || this._visibleRows > 0) {
                var maxRows = this._maxRows > 0 ? this._maxRows : this._visibleRows;
                var maxHeight = window.innerHeight;
                var rowHeight = Math.max(Math.floor(maxHeight / maxRows), this.minHeight);
                rowHeight -= (this.marginTop + this.marginBottom);
                if (rowHeight > 0)
                    this.rowHeight = rowHeight;
                if (this.rowHeight < this.minHeight || this.minRows > this._config.min_rows) {
                    this.minRows = Math.max(this._config.min_rows, Math.ceil(this.minHeight / this.rowHeight));
                }
            }
        }
    };
    NgGrid.prototype._updateRatio = function () {
        if (this._autoResize && this._maintainRatio) {
            if (this._maxCols > 0 && this._visibleRows <= 0) {
                this.rowHeight = this.colWidth / this._aspectRatio;
            }
            else if (this._maxRows > 0 && this._visibleCols <= 0) {
                this.colWidth = this._aspectRatio * this.rowHeight;
            }
            else if (this._maxCols == 0 && this._maxRows == 0) {
                if (this._visibleCols > 0) {
                    this.rowHeight = this.colWidth / this._aspectRatio;
                }
                else if (this._visibleRows > 0) {
                    this.colWidth = this._aspectRatio * this.rowHeight;
                }
            }
        }
    };
    NgGrid.prototype._updateLimit = function () {
        if (!this._autoResize && this._limitToScreen) {
            this._limitGrid(this._getContainerColumns());
        }
    };
    NgGrid.prototype._onResize = function (e) {
        this._calculateColWidth();
        this._calculateRowHeight();
        this._updateRatio();
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var item = _a[_i];
            this._removeFromGrid(item);
        }
        this._updateLimit();
        for (var _b = 0, _c = this._items; _b < _c.length; _b++) {
            var item = _c[_b];
            item.recalculateSelf();
            this._addToGrid(item);
        }
        this._cascadeGrid(null, null, false);
        this._updateSize();
    };
    NgGrid.prototype._applyChanges = function (changes) {
        var _this = this;
        changes.forEachAddedItem(function (record) { _this._config[record.key] = record.currentValue; });
        changes.forEachChangedItem(function (record) { _this._config[record.key] = record.currentValue; });
        changes.forEachRemovedItem(function (record) { delete _this._config[record.key]; });
        this.setConfig(this._config);
    };
    NgGrid.prototype._onMouseDown = function (e) {
        var mousePos = this._getMousePosition(e);
        var item = this._getItemFromPosition(mousePos);
        if (item != null) {
            if (this.resizeEnable && item.canResize(e) != null) {
                this._resizeStart(e);
                return false;
            }
            else if (this.dragEnable && item.canDrag(e)) {
                this._dragStart(e);
                return false;
            }
        }
        return true;
    };
    NgGrid.prototype._resizeStart = function (e) {
        if (this.resizeEnable) {
            var mousePos = this._getMousePosition(e);
            var item = this._getItemFromPosition(mousePos);
            item.startMoving();
            this._resizingItem = item;
            this._resizeDirection = item.canResize(e);
            this._removeFromGrid(item);
            this._createPlaceholder(item);
            this.isResizing = true;
            this.onResizeStart.emit(item);
            item.onResizeStartEvent();
        }
    };
    NgGrid.prototype._dragStart = function (e) {
        if (this.dragEnable) {
            var mousePos = this._getMousePosition(e);
            var item = this._getItemFromPosition(mousePos);
            var itemPos = item.getPosition();
            var pOffset = { 'left': (mousePos.left - itemPos.left), 'top': (mousePos.top - itemPos.top) };
            item.startMoving();
            this._draggingItem = item;
            this._posOffset = pOffset;
            this._removeFromGrid(item);
            this._createPlaceholder(item);
            this.isDragging = true;
            this.onDragStart.emit(item);
            item.onDragStartEvent();
            if (this._zoomOnDrag) {
                this._zoomOut();
            }
        }
    };
    NgGrid.prototype._zoomOut = function () {
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', "scale(0.5, 0.5)");
    };
    NgGrid.prototype._resetZoom = function () {
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', "");
    };
    NgGrid.prototype._onMouseMove = function (e) {
        if (e.buttons == 0 && this.isDragging) {
            this._dragStop(e);
        }
        else if (e.buttons == 0 && this.isResizing) {
            this._resizeStop(e);
        }
        else if (this.isDragging) {
            this._drag(e);
        }
        else if (this.isResizing) {
            this._resize(e);
        }
        else {
            var mousePos = this._getMousePosition(e);
            var item = this._getItemFromPosition(mousePos);
            if (item) {
                item.onMouseMove(e);
            }
        }
    };
    NgGrid.prototype._drag = function (e) {
        if (this.isDragging) {
            var mousePos = this._getMousePosition(e);
            var newL = (mousePos.left - this._posOffset.left);
            var newT = (mousePos.top - this._posOffset.top);
            var itemPos = this._draggingItem.getGridPosition();
            var gridPos = this._calculateGridPosition(newL, newT);
            var dims = this._draggingItem.getSize();
            if (!this._isWithinBoundsX(gridPos, dims))
                gridPos.col = this._maxCols - (dims.x - 1);
            if (!this._isWithinBoundsY(gridPos, dims))
                gridPos.row = this._maxRows - (dims.y - 1);
            if (!this._autoResize && this._limitToScreen) {
                if ((gridPos.col + dims.x - 1) > this._getContainerColumns()) {
                    gridPos.col = this._getContainerColumns() - (dims.x - 1);
                }
            }
            if (gridPos.col != itemPos.col || gridPos.row != itemPos.row) {
                this._draggingItem.setGridPosition(gridPos, false);
                this._placeholderRef.instance.setGridPosition(gridPos);
                if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
                    this._fixGridCollisions(gridPos, dims);
                    this._cascadeGrid(gridPos, dims);
                }
            }
            if (!this._fixToGrid) {
                this._draggingItem.setPosition(newL, newT);
            }
            this.onDrag.emit(this._draggingItem);
            this._draggingItem.onDragEvent();
        }
    };
    NgGrid.prototype._resize = function (e) {
        if (this.isResizing) {
            var mousePos = this._getMousePosition(e);
            var itemPos = this._resizingItem.getPosition();
            var itemDims = this._resizingItem.getDimensions();
            var newW = this._resizeDirection == 'height' ? itemDims.width : (mousePos.left - itemPos.left + 10);
            var newH = this._resizeDirection == 'width' ? itemDims.height : (mousePos.top - itemPos.top + 10);
            if (newW < this.minWidth)
                newW = this.minWidth;
            if (newH < this.minHeight)
                newH = this.minHeight;
            var calcSize = this._calculateGridSize(newW, newH);
            var itemSize = this._resizingItem.getSize();
            var iGridPos = this._resizingItem.getGridPosition();
            if (!this._isWithinBoundsX(iGridPos, calcSize))
                calcSize.x = (this._maxCols - iGridPos.col) + 1;
            if (!this._isWithinBoundsY(iGridPos, calcSize))
                calcSize.y = (this._maxRows - iGridPos.row) + 1;
            calcSize = this._resizingItem.fixResize(calcSize);
            if (calcSize.x != itemSize.x || calcSize.y != itemSize.y) {
                this._resizingItem.setSize(calcSize, false);
                this._placeholderRef.instance.setSize(calcSize);
                if (['up', 'down', 'left', 'right'].indexOf(this.cascade) >= 0) {
                    this._fixGridCollisions(iGridPos, calcSize);
                    this._cascadeGrid(iGridPos, calcSize);
                }
            }
            if (!this._fixToGrid)
                this._resizingItem.setDimensions(newW, newH);
            var bigGrid = this._maxGridSize(itemPos.left + newW + (2 * e.movementX), itemPos.top + newH + (2 * e.movementY));
            if (this._resizeDirection == 'height')
                bigGrid.x = iGridPos.col + itemSize.x;
            if (this._resizeDirection == 'width')
                bigGrid.y = iGridPos.row + itemSize.y;
            this.onResize.emit(this._resizingItem);
            this._resizingItem.onResizeEvent();
        }
    };
    NgGrid.prototype._onMouseUp = function (e) {
        if (this.isDragging) {
            this._dragStop(e);
            return false;
        }
        else if (this.isResizing) {
            this._resizeStop(e);
            return false;
        }
        return true;
    };
    NgGrid.prototype._dragStop = function (e) {
        if (this.isDragging) {
            this.isDragging = false;
            var itemPos = this._draggingItem.getGridPosition();
            this._draggingItem.savePosition(itemPos);
            this._addToGrid(this._draggingItem);
            this._cascadeGrid();
            this._draggingItem.stopMoving();
            this._draggingItem.onDragStopEvent();
            this.onDragStop.emit(this._draggingItem);
            this._draggingItem = null;
            this._posOffset = null;
            this._placeholderRef.destroy();
            this.onItemChange.emit(this._items.map(function (item) { return item.getEventOutput(); }));
            if (this._zoomOnDrag) {
                this._resetZoom();
            }
        }
    };
    NgGrid.prototype._resizeStop = function (e) {
        if (this.isResizing) {
            this.isResizing = false;
            var itemDims = this._resizingItem.getSize();
            this._resizingItem.setSize(itemDims);
            this._addToGrid(this._resizingItem);
            this._cascadeGrid();
            this._resizingItem.stopMoving();
            this._resizingItem.onResizeStopEvent();
            this.onResizeStop.emit(this._resizingItem);
            this._resizingItem = null;
            this._resizeDirection = null;
            this._placeholderRef.destroy();
            this.onItemChange.emit(this._items.map(function (item) { return item.getEventOutput(); }));
        }
    };
    NgGrid.prototype._maxGridSize = function (w, h) {
        var sizex = Math.ceil(w / (this.colWidth + this.marginLeft + this.marginRight));
        var sizey = Math.ceil(h / (this.rowHeight + this.marginTop + this.marginBottom));
        return { 'x': sizex, 'y': sizey };
    };
    NgGrid.prototype._calculateGridSize = function (width, height) {
        width += this.marginLeft + this.marginRight;
        height += this.marginTop + this.marginBottom;
        var sizex = Math.max(this.minCols, Math.round(width / (this.colWidth + this.marginLeft + this.marginRight)));
        var sizey = Math.max(this.minRows, Math.round(height / (this.rowHeight + this.marginTop + this.marginBottom)));
        if (!this._isWithinBoundsX({ col: 1, row: 1 }, { x: sizex, y: sizey }))
            sizex = this._maxCols;
        if (!this._isWithinBoundsY({ col: 1, row: 1 }, { x: sizex, y: sizey }))
            sizey = this._maxRows;
        return { 'x': sizex, 'y': sizey };
    };
    NgGrid.prototype._calculateGridPosition = function (left, top) {
        var col = Math.max(1, Math.round(left / (this.colWidth + this.marginLeft + this.marginRight)) + 1);
        var row = Math.max(1, Math.round(top / (this.rowHeight + this.marginTop + this.marginBottom)) + 1);
        if (!this._isWithinBoundsX({ col: col, row: row }, { x: 1, y: 1 }))
            col = this._maxCols;
        if (!this._isWithinBoundsY({ col: col, row: row }, { x: 1, y: 1 }))
            row = this._maxRows;
        return { 'col': col, 'row': row };
    };
    NgGrid.prototype._hasGridCollision = function (pos, dims) {
        var positions = this._getCollisions(pos, dims);
        if (positions == null || positions.length == 0)
            return false;
        return positions.some(function (v) {
            return !(v === null);
        });
    };
    NgGrid.prototype._getCollisions = function (pos, dims) {
        var returns = [];
        for (var j = 0; j < dims.y; j++)
            if (this._itemGrid[pos.row + j] != null)
                for (var i = 0; i < dims.x; i++)
                    if (this._itemGrid[pos.row + j][pos.col + i] != null)
                        returns.push(this._itemGrid[pos.row + j][pos.col + i]);
        return returns;
    };
    NgGrid.prototype._fixGridCollisions = function (pos, dims) {
        while (this._hasGridCollision(pos, dims)) {
            var collisions = this._getCollisions(pos, dims);
            var me = this;
            this._removeFromGrid(collisions[0]);
            var itemPos = collisions[0].getGridPosition();
            var itemDims = collisions[0].getSize();
            switch (this.cascade) {
                case "up":
                case "down":
                default:
                    if (!this._isWithinBoundsY(itemPos, itemDims))
                        itemPos.col++;
                    else
                        itemPos.row++;
                    break;
                case "left":
                case "right":
                    if (!this._isWithinBoundsX(itemPos, itemDims))
                        itemPos.row++;
                    else
                        itemPos.col++;
                    break;
            }
            collisions[0].setGridPosition(itemPos);
            this._fixGridCollisions(itemPos, itemDims);
            this._addToGrid(collisions[0]);
            collisions[0].onCascadeEvent();
        }
    };
    NgGrid.prototype._limitGrid = function (maxCols) {
        var items = this._items;
        items.sort(function (a, b) {
            var aPos = a.getSavedPosition();
            var bPos = b.getSavedPosition();
            if (aPos.row == bPos.row) {
                return aPos.col == bPos.col ? 0 : (aPos.col < bPos.col ? -1 : 1);
            }
            else {
                return aPos.row < bPos.row ? -1 : 1;
            }
        });
        var columnMax = {};
        for (var i_1 = 1; i_1 <= maxCols; i_1++)
            columnMax[i_1] = 1;
        var curPos = { col: 1, row: 1 };
        console.log(items);
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var pos = item.getSavedPosition();
            var dims = item.getSize();
            console.log(pos);
            console.log(this._canFit(pos, dims, columnMax));
            if (!this._canFit(pos, dims, columnMax)) {
                pos = this._fitItem(dims, columnMax);
            }
            console.log(pos);
            for (var i = 0; i < dims.x; i++)
                columnMax[pos.col + i] = (pos.row + dims.y);
            console.log(columnMax);
            item.setGridPosition(pos);
        }
    };
    NgGrid.prototype._canFit = function (pos, dims, columnMax) {
        var keys = Object.keys(columnMax).map(function (x) { return parseInt(x, 10); });
        var maxCol = Math.max.apply(null, keys);
        if (pos.col + dims.x - 1 > maxCol)
            return false;
        for (var i = 0; i < dims.x; i++) {
            if (columnMax[pos.col + i] > pos.row) {
                return false;
            }
        }
        return true;
    };
    NgGrid.prototype._fitItem = function (dims, columnMax) {
        var keys = Object.keys(columnMax).map(function (x) { return parseInt(x, 10); });
        var maxCol = Math.max.apply(null, keys);
        var returnPos = { col: 1, row: 1 };
        keys.sort(function (a, b) {
            return columnMax[a] == columnMax[b] ? 0 : columnMax[a] < columnMax[b] ? -1 : 1;
        });
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (key + dims.x - 1 > maxCol) {
                if (key == 1) {
                    returnPos.col = key;
                    returnPos.row = columnMax[key];
                    break;
                }
            }
            else {
                var fits = true;
                var row = columnMax[key];
                for (var i = 1; i < dims.x; i++) {
                    if (columnMax[key + i] > row) {
                        fits = false;
                        break;
                    }
                }
                if (fits) {
                    returnPos.col = key;
                    returnPos.row = columnMax[key];
                    break;
                }
            }
        }
        return returnPos;
    };
    NgGrid.prototype._cascadeGrid = function (pos, dims, shouldSave) {
        if (shouldSave === void 0) { shouldSave = true; }
        if (this._destroyed)
            return;
        if (pos && !dims)
            throw new Error("Cannot cascade with only position and not dimensions");
        if (this.isDragging && this._draggingItem && !pos && !dims) {
            pos = this._draggingItem.getGridPosition();
            dims = this._draggingItem.getSize();
        }
        else if (this.isResizing && this._resizingItem && !pos && !dims) {
            pos = this._resizingItem.getGridPosition();
            dims = this._resizingItem.getSize();
        }
        switch (this.cascade) {
            case "up":
            case "down":
                var lowRow = [0];
                for (var i = 1; i <= this._getMaxCol(); i++)
                    lowRow[i] = 1;
                for (var r = 1; r <= this._getMaxRow(); r++) {
                    if (this._itemGrid[r] == undefined)
                        continue;
                    for (var c = 1; c <= this._getMaxCol(); c++) {
                        if (this._itemGrid[r] == undefined)
                            break;
                        if (r < lowRow[c])
                            continue;
                        if (this._itemGrid[r][c] != null) {
                            var item = this._itemGrid[r][c];
                            if (item.isFixed)
                                continue;
                            var itemDims = item.getSize();
                            var itemPos = item.getGridPosition();
                            if (itemPos.col != c || itemPos.row != r)
                                continue; //	If this is not the element's start
                            var lowest = lowRow[c];
                            for (var i = 1; i < itemDims.x; i++) {
                                lowest = Math.max(lowRow[(c + i)], lowest);
                            }
                            if (pos && (c + itemDims.x) > pos.col && c < (pos.col + dims.x)) {
                                if ((r >= pos.row && r < (pos.row + dims.y)) ||
                                    ((itemDims.y > (pos.row - lowest)) &&
                                        (r >= (pos.row + dims.y) && lowest < (pos.row + dims.y)))) {
                                    lowest = Math.max(lowest, pos.row + dims.y); //	Set the lowest row to be below it
                                }
                            }
                            if (lowest != itemPos.row) {
                                this._removeFromGrid(item);
                                if (shouldSave) {
                                    item.savePosition({ col: c, row: lowest });
                                }
                                else {
                                    item.setGridPosition({ col: c, row: lowest });
                                }
                                item.onCascadeEvent();
                                this._addToGrid(item);
                            }
                            for (var i = 0; i < itemDims.x; i++) {
                                lowRow[c + i] = lowest + itemDims.y; //	Update the lowest row to be below the item
                            }
                        }
                    }
                }
                break;
            case "left":
            case "right":
                var lowCol = [0];
                for (var i = 1; i <= this._getMaxRow(); i++)
                    lowCol[i] = 1;
                for (var r = 1; r <= this._getMaxRow(); r++) {
                    if (this._itemGrid[r] == undefined)
                        continue;
                    for (var c = 1; c <= this._getMaxCol(); c++) {
                        if (this._itemGrid[r] == undefined)
                            break;
                        if (c < lowCol[r])
                            continue;
                        if (this._itemGrid[r][c] != null) {
                            var item = this._itemGrid[r][c];
                            var itemDims = item.getSize();
                            var itemPos = item.getGridPosition();
                            if (itemPos.col != c || itemPos.row != r)
                                continue; //	If this is not the element's start
                            var lowest = lowCol[r];
                            for (var i = 1; i < itemDims.y; i++) {
                                lowest = Math.max(lowCol[(r + i)], lowest);
                            }
                            if (pos && (r + itemDims.y) > pos.row && r < (pos.row + dims.y)) {
                                if ((c >= pos.col && c < (pos.col + dims.x)) ||
                                    ((itemDims.x > (pos.col - lowest)) &&
                                        (c >= (pos.col + dims.x) && lowest < (pos.col + dims.x)))) {
                                    lowest = Math.max(lowest, pos.col + dims.x); //	Set the lowest col to be below it
                                }
                            }
                            if (lowest != itemPos.col) {
                                this._removeFromGrid(item);
                                if (shouldSave) {
                                    item.savePosition({ col: c, row: lowest });
                                }
                                else {
                                    item.setGridPosition({ col: lowest, row: r });
                                }
                                item.onCascadeEvent();
                                this._addToGrid(item);
                            }
                            for (var i = 0; i < itemDims.y; i++) {
                                lowCol[r + i] = lowest + itemDims.x; //	Update the lowest col to be below the item
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
    };
    NgGrid.prototype._fixGridPosition = function (pos, dims) {
        while (this._hasGridCollision(pos, dims) || !this._isWithinBounds(pos, dims)) {
            if (this._hasGridCollision(pos, dims)) {
                switch (this.cascade) {
                    case 'up':
                    case 'down':
                        pos.row++;
                        break;
                    case 'left':
                    case 'right':
                        pos.col++;
                        break;
                    default:
                        break;
                }
            }
            if (!this._isWithinBoundsY(pos, dims)) {
                pos.col++;
                pos.row = 1;
            }
            if (!this._isWithinBoundsX(pos, dims)) {
                pos.row++;
                pos.col = 1;
            }
        }
        return pos;
    };
    NgGrid.prototype._isWithinBoundsX = function (pos, dims) {
        return (this._maxCols == 0 || (pos.col + dims.x - 1) <= this._maxCols);
    };
    NgGrid.prototype._isWithinBoundsY = function (pos, dims) {
        return (this._maxRows == 0 || (pos.row + dims.y - 1) <= this._maxRows);
    };
    NgGrid.prototype._isWithinBounds = function (pos, dims) {
        return this._isWithinBoundsX(pos, dims) && this._isWithinBoundsY(pos, dims);
    };
    NgGrid.prototype._addToGrid = function (item) {
        var pos = item.getGridPosition();
        var dims = item.getSize();
        if (this._hasGridCollision(pos, dims)) {
            this._fixGridCollisions(pos, dims);
            pos = item.getGridPosition();
        }
        for (var j = 0; j < dims.y; j++) {
            if (this._itemGrid[pos.row + j] == null)
                this._itemGrid[pos.row + j] = {};
            for (var i = 0; i < dims.x; i++) {
                this._itemGrid[pos.row + j][pos.col + i] = item;
                this._updateSize(pos.col + dims.x - 1, pos.row + dims.y - 1);
            }
        }
    };
    NgGrid.prototype._removeFromGrid = function (item) {
        for (var y in this._itemGrid)
            for (var x in this._itemGrid[y])
                if (this._itemGrid[y][x] == item)
                    this._itemGrid[y][x] = null;
    };
    NgGrid.prototype._updateSize = function (col, row) {
        if (this._destroyed)
            return;
        col = (col == undefined) ? 0 : col;
        row = (row == undefined) ? 0 : row;
        this._filterGrid();
        var maxRow = Math.max(this._getMaxRow(), row);
        var maxCol = Math.max(this._getMaxCol(), col);
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'width', "100%"); //(maxCol * (this.colWidth + this.marginLeft + this.marginRight))+"px");
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'height', (maxRow * (this.rowHeight + this.marginTop + this.marginBottom)) + "px");
    };
    NgGrid.prototype._filterGrid = function () {
        var curMaxCol = this._getMaxCol();
        var curMaxRow = this._getMaxRow();
        var maxCol = 0;
        var maxRow = 0;
        for (var r = 1; r <= curMaxRow; r++) {
            if (this._itemGrid[r] == undefined)
                continue;
            for (var c = 1; c <= curMaxCol; c++) {
                if (this._itemGrid[r][c] != null) {
                    maxCol = Math.max(maxCol, c);
                    maxRow = Math.max(maxRow, r);
                }
            }
        }
        if (curMaxRow != maxRow)
            for (var r = maxRow + 1; r <= curMaxRow; r++)
                if (this._itemGrid[r] !== undefined)
                    delete this._itemGrid[r];
        if (curMaxCol != maxCol)
            for (var r = 1; r <= maxRow; r++) {
                if (this._itemGrid[r] == undefined)
                    continue;
                for (var c = maxCol + 1; c <= curMaxCol; c++)
                    if (this._itemGrid[r][c] !== undefined)
                        delete this._itemGrid[r][c];
            }
    };
    NgGrid.prototype._getMaxRow = function () {
        return Math.max.apply(null, Object.keys(this._itemGrid));
    };
    NgGrid.prototype._getMaxCol = function () {
        var me = this;
        var maxes = [0];
        Object.keys(me._itemGrid).map(function (v) { maxes.push(Math.max.apply(null, Object.keys(me._itemGrid[v]))); });
        return Math.max.apply(null, maxes);
    };
    NgGrid.prototype._getMousePosition = function (e) {
        if ((window.TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
            e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
        }
        var refPos = this._ngEl.nativeElement.getBoundingClientRect();
        var left = e.clientX - refPos.left;
        var top = e.clientY - refPos.top;
        if (this.cascade == "down")
            top = refPos.top + refPos.height - e.clientY;
        if (this.cascade == "right")
            left = refPos.left + refPos.width - e.clientX;
        if (this.isDragging && this._zoomOnDrag) {
            left *= 2;
            top *= 2;
        }
        return {
            left: left,
            top: top
        };
    };
    NgGrid.prototype._getAbsoluteMousePosition = function (e) {
        if ((window.TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
            e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
        }
        return {
            left: e.clientX,
            top: e.clientY
        };
    };
    NgGrid.prototype._getContainerColumns = function () {
        var maxWidth = this._ngEl.nativeElement.getBoundingClientRect().width;
        return Math.floor(maxWidth / this.colWidth);
    };
    NgGrid.prototype._getItemFromPosition = function (position) {
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var item = _a[_i];
            var size = item.getDimensions();
            var pos = item.getPosition();
            if (position.left > (pos.left + this.marginLeft) && position.left < (pos.left + this.marginLeft + size.width) &&
                position.top > (pos.top + this.marginTop) && position.top < (pos.top + this.marginTop + size.height)) {
                return item;
            }
        }
        return null;
    };
    NgGrid.prototype._createPlaceholder = function (item) {
        var _this = this;
        var me = this;
        var pos = item.getGridPosition(), dims = item.getSize();
        this._loader.loadNextToLocation(NgGridPlaceholder_1.NgGridPlaceholder, item.containerRef).then(function (componentRef) {
            me._placeholderRef = componentRef;
            var placeholder = componentRef.instance;
            placeholder.registerGrid(me);
            placeholder.setCascadeMode(_this.cascade);
            placeholder.setGridPosition({ col: pos.col, row: pos.row });
            placeholder.setSize({ x: dims.x, y: dims.y });
        });
    };
    //	Default config
    NgGrid.CONST_DEFAULT_CONFIG = {
        margins: [10],
        draggable: true,
        resizable: true,
        max_cols: 0,
        max_rows: 0,
        visible_cols: 0,
        visible_rows: 0,
        col_width: 250,
        row_height: 250,
        cascade: 'up',
        min_width: 100,
        min_height: 100,
        fix_to_grid: false,
        auto_style: true,
        auto_resize: false,
        maintain_ratio: false,
        prefer_new: false,
        zoom_on_drag: false
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onDragStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onDrag", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onDragStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onResizeStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onResize", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onResizeStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGrid.prototype, "onItemChange", void 0);
    NgGrid = __decorate([
        core_1.Directive({
            selector: '[ngGrid]',
            inputs: ['config: ngGrid'],
            host: {
                '(mousedown)': '_onMouseDown($event)',
                '(mousemove)': '_onMouseMove($event)',
                '(mouseup)': '_onMouseUp($event)',
                '(touchstart)': '_onMouseDown($event)',
                '(touchmove)': '_onMouseMove($event)',
                '(touchend)': '_onMouseUp($event)',
                '(window:resize)': '_onResize($event)',
                '(document:mousemove)': '_onMouseMove($event)',
                '(document:mouseup)': '_onMouseUp($event)'
            }
        }), 
        __metadata('design:paramtypes', [core_1.KeyValueDiffers, core_1.ElementRef, core_1.Renderer, core_1.DynamicComponentLoader, core_1.ViewContainerRef])
    ], NgGrid);
    return NgGrid;
}());
exports.NgGrid = NgGrid;

//# sourceMappingURL=data:application/json;base64,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SSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0csRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM5RixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRTlGLE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFTyx1Q0FBc0IsR0FBOUIsVUFBK0IsSUFBWSxFQUFFLEdBQVc7UUFDdkQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkcsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFH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QUNqQixZQUFZLEVBQUUsS0FBSztLQUNuQixDQUFDO0lBekVGO1FBQUMsYUFBTSxFQUFFOzsrQ0FBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOzswQ0FBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOzs4Q0FBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOztpREFBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOzs0Q0FBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOztnREFBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOztnREFBQTtJQXZCVjtRQUFDLGdCQUFTLENBQUM7WUFDVixRQUFRLEVBQUUsVUFBVTtZQUNwQixNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUMxQixJQUFJLEVBQUU7Z0JBQ0wsYUFBYSxFQUFFLHNCQUFzQjtnQkFDckMsYUFBYSxFQUFFLHNCQUFzQjtnQkFDckMsV0FBVyxFQUFFLG9CQUFvQjtnQkFDakMsY0FBYyxFQUFFLHNCQUFzQjtnQkFDdEMsYUFBYSxFQUFFLHNCQUFzQjtnQkFDckMsWUFBWSxFQUFFLG9CQUFvQjtnQkFDbEMsaUJBQWlCLEVBQUUsbUJBQW1CO2dCQUN0QyxzQkFBc0IsRUFBRSxzQkFBc0I7Z0JBQzlDLG9CQUFvQixFQUFFLG9CQUFvQjthQUMxQztTQUNELENBQUM7O2NBQUE7SUE0b0NGLGFBQUM7QUFBRCxDQTNvQ0EsQUEyb0NDLElBQUE7QUEzb0NZLGNBQU0sU0Eyb0NsQixDQUFBIiwiZmlsZSI6ImRpcmVjdGl2ZXMvTmdHcmlkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyLCBFdmVudEVtaXR0ZXIsIER5bmFtaWNDb21wb25lbnRMb2FkZXIsIEhvc3QsIFZpZXdFbmNhcHN1bGF0aW9uLCBUeXBlLCBDb21wb25lbnRSZWYsIEtleVZhbHVlRGlmZmVyLCBLZXlWYWx1ZURpZmZlcnMsIE9uSW5pdCwgT25EZXN0cm95LCBEb0NoZWNrLCBWaWV3Q29udGFpbmVyUmVmLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTmdHcmlkQ29uZmlnLCBOZ0dyaWRJdGVtRXZlbnQsIE5nR3JpZEl0ZW1Qb3NpdGlvbiwgTmdHcmlkSXRlbVNpemUgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JTmdHcmlkXCI7XHJcbmltcG9ydCB7IE5nR3JpZEl0ZW0gfSBmcm9tIFwiLi9OZ0dyaWRJdGVtXCI7XHJcbmltcG9ydCB7IE5nR3JpZFBsYWNlaG9sZGVyIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvTmdHcmlkUGxhY2Vob2xkZXJcIjtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG5cdHNlbGVjdG9yOiAnW25nR3JpZF0nLFxyXG5cdGlucHV0czogWydjb25maWc6IG5nR3JpZCddLFxyXG5cdGhvc3Q6IHtcclxuXHRcdCcobW91c2Vkb3duKSc6ICdfb25Nb3VzZURvd24oJGV2ZW50KScsXHJcblx0XHQnKG1vdXNlbW92ZSknOiAnX29uTW91c2VNb3ZlKCRldmVudCknLFxyXG5cdFx0Jyhtb3VzZXVwKSc6ICdfb25Nb3VzZVVwKCRldmVudCknLFxyXG5cdFx0Jyh0b3VjaHN0YXJ0KSc6ICdfb25Nb3VzZURvd24oJGV2ZW50KScsXHJcblx0XHQnKHRvdWNobW92ZSknOiAnX29uTW91c2VNb3ZlKCRldmVudCknLFxyXG5cdFx0Jyh0b3VjaGVuZCknOiAnX29uTW91c2VVcCgkZXZlbnQpJyxcclxuXHRcdCcod2luZG93OnJlc2l6ZSknOiAnX29uUmVzaXplKCRldmVudCknLFxyXG5cdFx0Jyhkb2N1bWVudDptb3VzZW1vdmUpJzogJ19vbk1vdXNlTW92ZSgkZXZlbnQpJyxcclxuXHRcdCcoZG9jdW1lbnQ6bW91c2V1cCknOiAnX29uTW91c2VVcCgkZXZlbnQpJ1xyXG5cdH1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5nR3JpZCBpbXBsZW1lbnRzIE9uSW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcclxuXHQvL1x0RXZlbnQgRW1pdHRlcnNcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uRHJhZ1N0YXJ0OiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvbkRyYWc6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uRHJhZ1N0b3A6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uUmVzaXplU3RhcnQ6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uUmVzaXplOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvblJlc2l6ZVN0b3A6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uSXRlbUNoYW5nZTogRXZlbnRFbWl0dGVyPEFycmF5PE5nR3JpZEl0ZW1FdmVudD4+ID0gbmV3IEV2ZW50RW1pdHRlcjxBcnJheTxOZ0dyaWRJdGVtRXZlbnQ+PigpO1xyXG5cclxuXHQvL1x0UHVibGljIHZhcmlhYmxlc1xyXG5cdHB1YmxpYyBjb2xXaWR0aDogbnVtYmVyID0gMjUwO1xyXG5cdHB1YmxpYyByb3dIZWlnaHQ6IG51bWJlciA9IDI1MDtcclxuXHRwdWJsaWMgbWluQ29sczogbnVtYmVyID0gMTtcclxuXHRwdWJsaWMgbWluUm93czogbnVtYmVyID0gMTtcclxuXHRwdWJsaWMgbWFyZ2luVG9wOiBudW1iZXIgPSAxMDtcclxuXHRwdWJsaWMgbWFyZ2luUmlnaHQ6IG51bWJlciA9IDEwO1xyXG5cdHB1YmxpYyBtYXJnaW5Cb3R0b206IG51bWJlciA9IDEwO1xyXG5cdHB1YmxpYyBtYXJnaW5MZWZ0OiBudW1iZXIgPSAxMDtcclxuXHRwdWJsaWMgaXNEcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHB1YmxpYyBpc1Jlc2l6aW5nOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHVibGljIGF1dG9TdHlsZTogYm9vbGVhbiA9IHRydWU7XHJcblx0cHVibGljIHJlc2l6ZUVuYWJsZTogYm9vbGVhbiA9IHRydWU7XHJcblx0cHVibGljIGRyYWdFbmFibGU6IGJvb2xlYW4gPSB0cnVlO1xyXG5cdHB1YmxpYyBjYXNjYWRlOiBzdHJpbmcgPSAndXAnO1xyXG5cdHB1YmxpYyBtaW5XaWR0aDogbnVtYmVyID0gMTAwO1xyXG5cdHB1YmxpYyBtaW5IZWlnaHQ6IG51bWJlciA9IDEwMDtcclxuXHJcblx0Ly9cdFByaXZhdGUgdmFyaWFibGVzXHJcblx0cHJpdmF0ZSBfaXRlbXM6IEFycmF5PE5nR3JpZEl0ZW0+ID0gW107XHJcblx0cHJpdmF0ZSBfZHJhZ2dpbmdJdGVtOiBOZ0dyaWRJdGVtID0gbnVsbDtcclxuXHRwcml2YXRlIF9yZXNpemluZ0l0ZW06IE5nR3JpZEl0ZW0gPSBudWxsO1xyXG5cdHByaXZhdGUgX3Jlc2l6ZURpcmVjdGlvbjogc3RyaW5nID0gbnVsbDtcclxuXHRwcml2YXRlIF9pdGVtR3JpZDogeyBba2V5OiBudW1iZXJdOiB7IFtrZXk6IG51bWJlcl06IE5nR3JpZEl0ZW0gfSB9ID0geyAxOiB7IDE6IG51bGwgfSB9O1xyXG5cdHByaXZhdGUgX2NvbnRhaW5lcldpZHRoOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfY29udGFpbmVySGVpZ2h0OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfbWF4Q29sczogbnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF9tYXhSb3dzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX3Zpc2libGVDb2xzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX3Zpc2libGVSb3dzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX3NldFdpZHRoOiBudW1iZXIgPSAyNTA7XHJcblx0cHJpdmF0ZSBfc2V0SGVpZ2h0OiBudW1iZXIgPSAyNTA7XHJcblx0cHJpdmF0ZSBfcG9zT2Zmc2V0OiB7IGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIgfSA9IG51bGw7XHJcblx0cHJpdmF0ZSBfYWRkaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfcGxhY2Vob2xkZXJSZWY6IENvbXBvbmVudFJlZjxOZ0dyaWRQbGFjZWhvbGRlcj4gPSBudWxsO1xyXG5cdHByaXZhdGUgX2ZpeFRvR3JpZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX2F1dG9SZXNpemU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9kaWZmZXI6IEtleVZhbHVlRGlmZmVyO1xyXG5cdHByaXZhdGUgX2Rlc3Ryb3llZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX21haW50YWluUmF0aW86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9hc3BlY3RSYXRpbzogbnVtYmVyO1xyXG5cdHByaXZhdGUgX3ByZWZlck5ldzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX3pvb21PbkRyYWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9saW1pdFRvU2NyZWVuOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG5cdC8vXHREZWZhdWx0IGNvbmZpZ1xyXG5cdHByaXZhdGUgc3RhdGljIENPTlNUX0RFRkFVTFRfQ09ORklHOiBOZ0dyaWRDb25maWcgPSB7XHJcblx0XHRtYXJnaW5zOiBbMTBdLFxyXG5cdFx0ZHJhZ2dhYmxlOiB0cnVlLFxyXG5cdFx0cmVzaXphYmxlOiB0cnVlLFxyXG5cdFx0bWF4X2NvbHM6IDAsXHJcblx0XHRtYXhfcm93czogMCxcclxuXHRcdHZpc2libGVfY29sczogMCxcclxuXHRcdHZpc2libGVfcm93czogMCxcclxuXHRcdGNvbF93aWR0aDogMjUwLFxyXG5cdFx0cm93X2hlaWdodDogMjUwLFxyXG5cdFx0Y2FzY2FkZTogJ3VwJyxcclxuXHRcdG1pbl93aWR0aDogMTAwLFxyXG5cdFx0bWluX2hlaWdodDogMTAwLFxyXG5cdFx0Zml4X3RvX2dyaWQ6IGZhbHNlLFxyXG5cdFx0YXV0b19zdHlsZTogdHJ1ZSxcclxuXHRcdGF1dG9fcmVzaXplOiBmYWxzZSxcclxuXHRcdG1haW50YWluX3JhdGlvOiBmYWxzZSxcclxuXHRcdHByZWZlcl9uZXc6IGZhbHNlLFxyXG5cdFx0em9vbV9vbl9kcmFnOiBmYWxzZVxyXG5cdH07XHJcblx0cHJpdmF0ZSBfY29uZmlnID0gTmdHcmlkLkNPTlNUX0RFRkFVTFRfQ09ORklHO1xyXG5cclxuXHQvL1x0W25nLWdyaWRdIGF0dHJpYnV0ZSBoYW5kbGVyXHJcblx0c2V0IGNvbmZpZyh2OiBOZ0dyaWRDb25maWcpIHtcclxuXHRcdHRoaXMuc2V0Q29uZmlnKHYpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9kaWZmZXIgPT0gbnVsbCAmJiB2ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5fZGlmZmVyID0gdGhpcy5fZGlmZmVycy5maW5kKHRoaXMuX2NvbmZpZykuY3JlYXRlKG51bGwpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly9cdENvbnN0cnVjdG9yXHJcblx0Y29uc3RydWN0b3IocHJpdmF0ZSBfZGlmZmVyczogS2V5VmFsdWVEaWZmZXJzLCBwcml2YXRlIF9uZ0VsOiBFbGVtZW50UmVmLCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIsIHByaXZhdGUgX2xvYWRlcjogRHluYW1pY0NvbXBvbmVudExvYWRlciwgcHJpdmF0ZSBfY29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7IH1cclxuXHJcblx0Ly9cdFB1YmxpYyBtZXRob2RzXHJcblx0cHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2dyaWQnLCB0cnVlKTtcclxuXHRcdGlmICh0aGlzLmF1dG9TdHlsZSkgdGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XHJcblx0XHR0aGlzLnNldENvbmZpZyh0aGlzLl9jb25maWcpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBOZ0dyaWRDb25maWcpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcclxuXHJcblx0XHR2YXIgbWF4Q29sUm93Q2hhbmdlZCA9IGZhbHNlO1xyXG5cdFx0Zm9yICh2YXIgeCBpbiBjb25maWcpIHtcclxuXHRcdFx0dmFyIHZhbCA9IGNvbmZpZ1t4XTtcclxuXHRcdFx0dmFyIGludFZhbCA9ICF2YWwgPyAwIDogcGFyc2VJbnQodmFsKTtcclxuXHJcblx0XHRcdHN3aXRjaCAoeCkge1xyXG5cdFx0XHRcdGNhc2UgJ21hcmdpbnMnOlxyXG5cdFx0XHRcdFx0dGhpcy5zZXRNYXJnaW5zKHZhbCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdjb2xfd2lkdGgnOlxyXG5cdFx0XHRcdFx0dGhpcy5jb2xXaWR0aCA9IGludFZhbDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3Jvd19oZWlnaHQnOlxyXG5cdFx0XHRcdFx0dGhpcy5yb3dIZWlnaHQgPSBpbnRWYWw7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdhdXRvX3N0eWxlJzpcclxuXHRcdFx0XHRcdHRoaXMuYXV0b1N0eWxlID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnYXV0b19yZXNpemUnOlxyXG5cdFx0XHRcdFx0dGhpcy5fYXV0b1Jlc2l6ZSA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2RyYWdnYWJsZSc6XHJcblx0XHRcdFx0XHR0aGlzLmRyYWdFbmFibGUgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdyZXNpemFibGUnOlxyXG5cdFx0XHRcdFx0dGhpcy5yZXNpemVFbmFibGUgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdtYXhfcm93cyc6XHJcblx0XHRcdFx0XHRtYXhDb2xSb3dDaGFuZ2VkID0gbWF4Q29sUm93Q2hhbmdlZCB8fCB0aGlzLl9tYXhSb3dzICE9IGludFZhbDtcclxuXHRcdFx0XHRcdHRoaXMuX21heFJvd3MgPSBpbnRWYWwgPCAwID8gMCA6IGludFZhbDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21heF9jb2xzJzpcclxuXHRcdFx0XHRcdG1heENvbFJvd0NoYW5nZWQgPSBtYXhDb2xSb3dDaGFuZ2VkIHx8IHRoaXMuX21heENvbHMgIT0gaW50VmFsO1xyXG5cdFx0XHRcdFx0dGhpcy5fbWF4Q29scyA9IGludFZhbCA8IDAgPyAwIDogaW50VmFsO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAndmlzaWJsZV9yb3dzJzpcclxuXHRcdFx0XHRcdHRoaXMuX3Zpc2libGVSb3dzID0gaW50VmFsIDwgMCA/IDAgOiBpbnRWYWw7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICd2aXNpYmxlX2NvbHMnOlxyXG5cdFx0XHRcdFx0dGhpcy5fdmlzaWJsZUNvbHMgPSBpbnRWYWwgPCAwID8gMCA6IGludFZhbDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21pbl9yb3dzJzpcclxuXHRcdFx0XHRcdHRoaXMubWluUm93cyA9IE1hdGgubWF4KGludFZhbCwgMSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdtaW5fY29scyc6XHJcblx0XHRcdFx0XHR0aGlzLm1pbkNvbHMgPSBNYXRoLm1heChpbnRWYWwsIDEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbWluX2hlaWdodCc6XHJcblx0XHRcdFx0XHR0aGlzLm1pbkhlaWdodCA9IGludFZhbDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21pbl93aWR0aCc6XHJcblx0XHRcdFx0XHR0aGlzLm1pbldpZHRoID0gaW50VmFsO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnem9vbV9vbl9kcmFnJzpcclxuXHRcdFx0XHRcdHRoaXMuX3pvb21PbkRyYWcgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdjYXNjYWRlJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmNhc2NhZGUgIT0gdmFsKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY2FzY2FkZSA9IHZhbDtcclxuXHRcdFx0XHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2ZpeF90b19ncmlkJzpcclxuXHRcdFx0XHRcdHRoaXMuX2ZpeFRvR3JpZCA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21haW50YWluX3JhdGlvJzpcclxuXHRcdFx0XHRcdHRoaXMuX21haW50YWluUmF0aW8gPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdwcmVmZXJfbmV3JzpcclxuXHRcdFx0XHRcdHRoaXMuX3ByZWZlck5ldyA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2xpbWl0X3RvX3NjcmVlbic6XHJcblx0XHRcdFx0XHR0aGlzLl9saW1pdFRvU2NyZWVuID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fbWFpbnRhaW5SYXRpbykge1xyXG5cdFx0XHRpZiAodGhpcy5jb2xXaWR0aCAmJiB0aGlzLnJvd0hlaWdodCkge1xyXG5cdFx0XHRcdHRoaXMuX2FzcGVjdFJhdGlvID0gdGhpcy5jb2xXaWR0aCAvIHRoaXMucm93SGVpZ2h0O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuX21haW50YWluUmF0aW8gPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChtYXhDb2xSb3dDaGFuZ2VkKSB7XHJcblx0XHRcdGlmICh0aGlzLl9tYXhDb2xzID4gMCAmJiB0aGlzLl9tYXhSb3dzID4gMCkge1x0Ly9cdENhbid0IGhhdmUgYm90aCwgcHJpb3JpdGlzZSBvbiBjYXNjYWRlXHJcblx0XHRcdFx0c3dpdGNoICh0aGlzLmNhc2NhZGUpIHtcclxuXHRcdFx0XHRcdGNhc2UgXCJsZWZ0XCI6XHJcblx0XHRcdFx0XHRjYXNlIFwicmlnaHRcIjpcclxuXHRcdFx0XHRcdFx0dGhpcy5fbWF4Q29scyA9IDA7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSBcInVwXCI6XHJcblx0XHRcdFx0XHRjYXNlIFwiZG93blwiOlxyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0dGhpcy5fbWF4Um93cyA9IDA7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHRcdHZhciBwb3MgPSBpdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdFx0XHRcdHZhciBkaW1zID0gaXRlbS5nZXRTaXplKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5fbWF4Q29scyA+IDAgJiYgZGltcy54ID4gdGhpcy5fbWF4Q29scykge1xyXG5cdFx0XHRcdFx0ZGltcy54ID0gdGhpcy5fbWF4Q29scztcclxuXHRcdFx0XHRcdGl0ZW0uc2V0U2l6ZShkaW1zKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX21heFJvd3MgPiAwICYmIGRpbXMueSA+IHRoaXMuX21heFJvd3MpIHtcclxuXHRcdFx0XHRcdGRpbXMueSA9IHRoaXMuX21heFJvd3M7XHJcblx0XHRcdFx0XHRpdGVtLnNldFNpemUoZGltcyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5faGFzR3JpZENvbGxpc2lvbihwb3MsIGRpbXMpIHx8ICF0aGlzLl9pc1dpdGhpbkJvdW5kcyhwb3MsIGRpbXMpKSB7XHJcblx0XHRcdFx0XHR2YXIgbmV3UG9zaXRpb24gPSB0aGlzLl9maXhHcmlkUG9zaXRpb24ocG9zLCBkaW1zKTtcclxuXHRcdFx0XHRcdGl0ZW0uc2V0R3JpZFBvc2l0aW9uKG5ld1Bvc2l0aW9uKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuX2FkZFRvR3JpZChpdGVtKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9jYWxjdWxhdGVSb3dIZWlnaHQoKTtcclxuXHRcdHRoaXMuX2NhbGN1bGF0ZUNvbFdpZHRoKCk7XHJcblxyXG5cdFx0dmFyIG1heFdpZHRoID0gdGhpcy5fbWF4Q29scyAqIHRoaXMuY29sV2lkdGg7XHJcblx0XHR2YXIgbWF4SGVpZ2h0ID0gdGhpcy5fbWF4Um93cyAqIHRoaXMucm93SGVpZ2h0O1xyXG5cclxuXHRcdGlmIChtYXhXaWR0aCA+IDAgJiYgdGhpcy5taW5XaWR0aCA+IG1heFdpZHRoKSB0aGlzLm1pbldpZHRoID0gMC43NSAqIHRoaXMuY29sV2lkdGg7XHJcblx0XHRpZiAobWF4SGVpZ2h0ID4gMCAmJiB0aGlzLm1pbkhlaWdodCA+IG1heEhlaWdodCkgdGhpcy5taW5IZWlnaHQgPSAwLjc1ICogdGhpcy5yb3dIZWlnaHQ7XHJcblxyXG5cdFx0aWYgKHRoaXMubWluV2lkdGggPiB0aGlzLmNvbFdpZHRoKSB0aGlzLm1pbkNvbHMgPSBNYXRoLm1heCh0aGlzLm1pbkNvbHMsIE1hdGguY2VpbCh0aGlzLm1pbldpZHRoIC8gdGhpcy5jb2xXaWR0aCkpO1xyXG5cdFx0aWYgKHRoaXMubWluSGVpZ2h0ID4gdGhpcy5yb3dIZWlnaHQpIHRoaXMubWluUm93cyA9IE1hdGgubWF4KHRoaXMubWluUm93cywgTWF0aC5jZWlsKHRoaXMubWluSGVpZ2h0IC8gdGhpcy5yb3dIZWlnaHQpKTtcclxuXHJcblx0XHRpZiAodGhpcy5fbWF4Q29scyA+IDAgJiYgdGhpcy5taW5Db2xzID4gdGhpcy5fbWF4Q29scykgdGhpcy5taW5Db2xzID0gMTtcclxuXHRcdGlmICh0aGlzLl9tYXhSb3dzID4gMCAmJiB0aGlzLm1pblJvd3MgPiB0aGlzLl9tYXhSb3dzKSB0aGlzLm1pblJvd3MgPSAxO1xyXG5cclxuXHRcdHRoaXMuX3VwZGF0ZVJhdGlvKCk7XHJcblx0XHRcclxuXHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdGl0ZW0uc2V0Q2FzY2FkZU1vZGUodGhpcy5jYXNjYWRlKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5fdXBkYXRlTGltaXQoKTtcclxuXHRcdFxyXG5cdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHRpdGVtLnJlY2FsY3VsYXRlU2VsZigpO1xyXG5cdFx0XHR0aGlzLl9hZGRUb0dyaWQoaXRlbSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY2FzY2FkZUdyaWQobnVsbCwgbnVsbCwgZmFsc2UpO1xyXG5cdFx0dGhpcy5fdXBkYXRlU2l6ZSgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEl0ZW1Qb3NpdGlvbihpbmRleDogbnVtYmVyKTogeyBjb2w6IG51bWJlciwgcm93OiBudW1iZXIgfSB7XHJcblx0XHRyZXR1cm4gdGhpcy5faXRlbXNbaW5kZXhdLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEl0ZW1TaXplKGluZGV4OiBudW1iZXIpOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2l0ZW1zW2luZGV4XS5nZXRTaXplKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgbmdEb0NoZWNrKCk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRoaXMuX2RpZmZlciAhPSBudWxsKSB7XHJcblx0XHRcdHZhciBjaGFuZ2VzID0gdGhpcy5fZGlmZmVyLmRpZmYodGhpcy5fY29uZmlnKTtcclxuXHJcblx0XHRcdGlmIChjaGFuZ2VzICE9IG51bGwpIHtcclxuXHRcdFx0XHR0aGlzLl9hcHBseUNoYW5nZXMoY2hhbmdlcyk7XHJcblxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldE1hcmdpbnMobWFyZ2luczogQXJyYXk8c3RyaW5nPik6IHZvaWQge1xyXG5cdFx0dGhpcy5tYXJnaW5Ub3AgPSBwYXJzZUludChtYXJnaW5zWzBdKTtcclxuXHRcdHRoaXMubWFyZ2luUmlnaHQgPSBtYXJnaW5zLmxlbmd0aCA+PSAyID8gcGFyc2VJbnQobWFyZ2luc1sxXSkgOiB0aGlzLm1hcmdpblRvcDtcclxuXHRcdHRoaXMubWFyZ2luQm90dG9tID0gbWFyZ2lucy5sZW5ndGggPj0gMyA/IHBhcnNlSW50KG1hcmdpbnNbMl0pIDogdGhpcy5tYXJnaW5Ub3A7XHJcblx0XHR0aGlzLm1hcmdpbkJvdHRvbSA9IG1hcmdpbnMubGVuZ3RoID49IDMgPyBwYXJzZUludChtYXJnaW5zWzJdKSA6IHRoaXMubWFyZ2luVG9wO1xyXG5cdFx0dGhpcy5tYXJnaW5MZWZ0ID0gbWFyZ2lucy5sZW5ndGggPj0gNCA/IHBhcnNlSW50KG1hcmdpbnNbM10pIDogdGhpcy5tYXJnaW5SaWdodDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBlbmFibGVEcmFnKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5kcmFnRW5hYmxlID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkaXNhYmxlRHJhZygpOiB2b2lkIHtcclxuXHRcdHRoaXMuZHJhZ0VuYWJsZSA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGVuYWJsZVJlc2l6ZSgpOiB2b2lkIHtcclxuXHRcdHRoaXMucmVzaXplRW5hYmxlID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkaXNhYmxlUmVzaXplKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5yZXNpemVFbmFibGUgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhZGRJdGVtKG5nSXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xyXG5cdFx0bmdJdGVtLnNldENhc2NhZGVNb2RlKHRoaXMuY2FzY2FkZSk7XHJcblx0XHRpZiAoIXRoaXMuX3ByZWZlck5ldykge1xyXG5cdFx0XHR2YXIgbmV3UG9zID0gdGhpcy5fZml4R3JpZFBvc2l0aW9uKG5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKSwgbmdJdGVtLmdldFNpemUoKSk7XHJcblx0XHRcdG5nSXRlbS5zYXZlUG9zaXRpb24obmV3UG9zKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX2l0ZW1zLnB1c2gobmdJdGVtKTtcclxuXHRcdHRoaXMuX2FkZFRvR3JpZChuZ0l0ZW0pO1xyXG5cdFx0bmdJdGVtLnJlY2FsY3VsYXRlU2VsZigpO1xyXG5cdFx0bmdJdGVtLm9uQ2FzY2FkZUV2ZW50KCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVtb3ZlSXRlbShuZ0l0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKG5nSXRlbSk7XHJcblxyXG5cdFx0Zm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLl9pdGVtcy5sZW5ndGg7IHgrKykge1xyXG5cdFx0XHRpZiAodGhpcy5faXRlbXNbeF0gPT0gbmdJdGVtKSB7XHJcblx0XHRcdFx0dGhpcy5faXRlbXMuc3BsaWNlKHgsIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX2Rlc3Ryb3llZCkgcmV0dXJuO1xyXG5cclxuXHRcdHRoaXMuX2Nhc2NhZGVHcmlkKCk7XHJcblx0XHR0aGlzLl91cGRhdGVTaXplKCk7XHJcblx0XHR0aGlzLl9pdGVtcy5mb3JFYWNoKChpdGVtKSA9PiBpdGVtLnJlY2FsY3VsYXRlU2VsZigpKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB1cGRhdGVJdGVtKG5nSXRlbTogTmdHcmlkSXRlbSkge1xyXG5cdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQobmdJdGVtKTtcclxuXHRcdHRoaXMuX2FkZFRvR3JpZChuZ0l0ZW0pO1xyXG5cdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHRcdHRoaXMuX3VwZGF0ZVNpemUoKTtcclxuXHRcdG5nSXRlbS5vbkNhc2NhZGVFdmVudCgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHRyaWdnZXJDYXNjYWRlKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fY2FzY2FkZUdyaWQobnVsbCwgbnVsbCwgZmFsc2UpO1xyXG5cdH1cclxuXHJcblx0Ly9cdFByaXZhdGUgbWV0aG9kc1xyXG5cdHByaXZhdGUgX2NhbGN1bGF0ZUNvbFdpZHRoKCk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2F1dG9SZXNpemUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX21heENvbHMgPiAwIHx8IHRoaXMuX3Zpc2libGVDb2xzID4gMCkge1xyXG5cdFx0XHRcdHZhciBtYXhDb2xzID0gdGhpcy5fbWF4Q29scyA+IDAgPyB0aGlzLl9tYXhDb2xzIDogdGhpcy5fdmlzaWJsZUNvbHM7XHJcblx0XHRcdFx0dmFyIG1heFdpZHRoOiBudW1iZXIgPSB0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcblxyXG5cdFx0XHRcdHZhciBjb2xXaWR0aDogbnVtYmVyID0gTWF0aC5mbG9vcihtYXhXaWR0aCAvIG1heENvbHMpO1xyXG5cdFx0XHRcdGNvbFdpZHRoIC09ICh0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KTtcclxuXHRcdFx0XHRpZiAoY29sV2lkdGggPiAwKSB0aGlzLmNvbFdpZHRoID0gY29sV2lkdGg7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmNvbFdpZHRoIDwgdGhpcy5taW5XaWR0aCB8fCB0aGlzLm1pbkNvbHMgPiB0aGlzLl9jb25maWcubWluX2NvbHMpIHtcclxuXHRcdFx0XHRcdHRoaXMubWluQ29scyA9IE1hdGgubWF4KHRoaXMuX2NvbmZpZy5taW5fY29scywgTWF0aC5jZWlsKHRoaXMubWluV2lkdGggLyB0aGlzLmNvbFdpZHRoKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9jYWxjdWxhdGVSb3dIZWlnaHQoKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fYXV0b1Jlc2l6ZSkge1xyXG5cdFx0XHRpZiAodGhpcy5fbWF4Um93cyA+IDAgfHwgdGhpcy5fdmlzaWJsZVJvd3MgPiAwKSB7XHJcblx0XHRcdFx0dmFyIG1heFJvd3MgPSB0aGlzLl9tYXhSb3dzID4gMCA/IHRoaXMuX21heFJvd3MgOiB0aGlzLl92aXNpYmxlUm93cztcclxuXHRcdFx0XHR2YXIgbWF4SGVpZ2h0OiBudW1iZXIgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcblxyXG5cdFx0XHRcdHZhciByb3dIZWlnaHQ6IG51bWJlciA9IE1hdGgubWF4KE1hdGguZmxvb3IobWF4SGVpZ2h0IC8gbWF4Um93cyksIHRoaXMubWluSGVpZ2h0KTtcclxuXHRcdFx0XHRyb3dIZWlnaHQgLT0gKHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b20pO1xyXG5cdFx0XHRcdGlmIChyb3dIZWlnaHQgPiAwKSB0aGlzLnJvd0hlaWdodCA9IHJvd0hlaWdodDtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMucm93SGVpZ2h0IDwgdGhpcy5taW5IZWlnaHQgfHwgdGhpcy5taW5Sb3dzID4gdGhpcy5fY29uZmlnLm1pbl9yb3dzKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1pblJvd3MgPSBNYXRoLm1heCh0aGlzLl9jb25maWcubWluX3Jvd3MsIE1hdGguY2VpbCh0aGlzLm1pbkhlaWdodCAvIHRoaXMucm93SGVpZ2h0KSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91cGRhdGVSYXRpbygpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9hdXRvUmVzaXplICYmIHRoaXMuX21haW50YWluUmF0aW8pIHtcclxuXHRcdFx0aWYgKHRoaXMuX21heENvbHMgPiAwICYmIHRoaXMuX3Zpc2libGVSb3dzIDw9IDApIHtcclxuXHRcdFx0XHR0aGlzLnJvd0hlaWdodCA9IHRoaXMuY29sV2lkdGggLyB0aGlzLl9hc3BlY3RSYXRpbztcclxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLl9tYXhSb3dzID4gMCAmJiB0aGlzLl92aXNpYmxlQ29scyA8PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5jb2xXaWR0aCA9IHRoaXMuX2FzcGVjdFJhdGlvICogdGhpcy5yb3dIZWlnaHQ7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbWF4Q29scyA9PSAwICYmIHRoaXMuX21heFJvd3MgPT0gMCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLl92aXNpYmxlQ29scyA+IDApIHtcclxuXHRcdFx0XHRcdHRoaXMucm93SGVpZ2h0ID0gdGhpcy5jb2xXaWR0aCAvIHRoaXMuX2FzcGVjdFJhdGlvO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fdmlzaWJsZVJvd3MgPiAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLmNvbFdpZHRoID0gdGhpcy5fYXNwZWN0UmF0aW8gKiB0aGlzLnJvd0hlaWdodDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfdXBkYXRlTGltaXQoKTogdm9pZCB7XHJcblx0XHRpZiAoIXRoaXMuX2F1dG9SZXNpemUgJiYgdGhpcy5fbGltaXRUb1NjcmVlbikge1xyXG5cdFx0XHR0aGlzLl9saW1pdEdyaWQodGhpcy5fZ2V0Q29udGFpbmVyQ29sdW1ucygpKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfb25SZXNpemUoZTogYW55KTogdm9pZCB7XHJcblx0XHR0aGlzLl9jYWxjdWxhdGVDb2xXaWR0aCgpO1xyXG5cdFx0dGhpcy5fY2FsY3VsYXRlUm93SGVpZ2h0KCk7XHJcblxyXG5cdFx0dGhpcy5fdXBkYXRlUmF0aW8oKTtcclxuXHRcdFxyXG5cdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHR0aGlzLl9yZW1vdmVGcm9tR3JpZChpdGVtKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5fdXBkYXRlTGltaXQoKTtcclxuXHRcdFxyXG5cdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHRpdGVtLnJlY2FsY3VsYXRlU2VsZigpO1xyXG5cdFx0XHR0aGlzLl9hZGRUb0dyaWQoaXRlbSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY2FzY2FkZUdyaWQobnVsbCwgbnVsbCwgZmFsc2UpO1xyXG5cdFx0dGhpcy5fdXBkYXRlU2l6ZSgpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfYXBwbHlDaGFuZ2VzKGNoYW5nZXM6IGFueSk6IHZvaWQge1xyXG5cdFx0Y2hhbmdlcy5mb3JFYWNoQWRkZWRJdGVtKChyZWNvcmQ6IGFueSkgPT4geyB0aGlzLl9jb25maWdbcmVjb3JkLmtleV0gPSByZWNvcmQuY3VycmVudFZhbHVlOyB9KTtcclxuXHRcdGNoYW5nZXMuZm9yRWFjaENoYW5nZWRJdGVtKChyZWNvcmQ6IGFueSkgPT4geyB0aGlzLl9jb25maWdbcmVjb3JkLmtleV0gPSByZWNvcmQuY3VycmVudFZhbHVlOyB9KTtcclxuXHRcdGNoYW5nZXMuZm9yRWFjaFJlbW92ZWRJdGVtKChyZWNvcmQ6IGFueSkgPT4geyBkZWxldGUgdGhpcy5fY29uZmlnW3JlY29yZC5rZXldOyB9KTtcclxuXHJcblx0XHR0aGlzLnNldENvbmZpZyh0aGlzLl9jb25maWcpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25Nb3VzZURvd24oZTogYW55KTogYm9vbGVhbiB7XHJcblx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0dmFyIGl0ZW0gPSB0aGlzLl9nZXRJdGVtRnJvbVBvc2l0aW9uKG1vdXNlUG9zKTtcclxuXHJcblx0XHRpZiAoaXRlbSAhPSBudWxsKSB7XHJcblx0XHRcdGlmICh0aGlzLnJlc2l6ZUVuYWJsZSAmJiBpdGVtLmNhblJlc2l6ZShlKSAhPSBudWxsKSB7XHJcblx0XHRcdFx0dGhpcy5fcmVzaXplU3RhcnQoZSk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuZHJhZ0VuYWJsZSAmJiBpdGVtLmNhbkRyYWcoZSkpIHtcclxuXHRcdFx0XHR0aGlzLl9kcmFnU3RhcnQoZSk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZXNpemVTdGFydChlOiBhbnkpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLnJlc2l6ZUVuYWJsZSkge1xyXG5cdFx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tUG9zaXRpb24obW91c2VQb3MpO1xyXG5cclxuXHRcdFx0aXRlbS5zdGFydE1vdmluZygpO1xyXG5cdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0gPSBpdGVtO1xyXG5cdFx0XHR0aGlzLl9yZXNpemVEaXJlY3Rpb24gPSBpdGVtLmNhblJlc2l6ZShlKTtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyKGl0ZW0pO1xyXG5cdFx0XHR0aGlzLmlzUmVzaXppbmcgPSB0cnVlO1xyXG5cclxuXHRcdFx0dGhpcy5vblJlc2l6ZVN0YXJ0LmVtaXQoaXRlbSk7XHJcblx0XHRcdGl0ZW0ub25SZXNpemVTdGFydEV2ZW50KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9kcmFnU3RhcnQoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5kcmFnRW5hYmxlKSB7XHJcblx0XHRcdHZhciBtb3VzZVBvcyA9IHRoaXMuX2dldE1vdXNlUG9zaXRpb24oZSk7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21Qb3NpdGlvbihtb3VzZVBvcyk7XHJcblx0XHRcdHZhciBpdGVtUG9zID0gaXRlbS5nZXRQb3NpdGlvbigpO1xyXG5cdFx0XHR2YXIgcE9mZnNldCA9IHsgJ2xlZnQnOiAobW91c2VQb3MubGVmdCAtIGl0ZW1Qb3MubGVmdCksICd0b3AnOiAobW91c2VQb3MudG9wIC0gaXRlbVBvcy50b3ApIH1cclxuXHJcblx0XHRcdGl0ZW0uc3RhcnRNb3ZpbmcoKTtcclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtID0gaXRlbTtcclxuXHRcdFx0dGhpcy5fcG9zT2Zmc2V0ID0gcE9mZnNldDtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyKGl0ZW0pO1xyXG5cdFx0XHR0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xyXG5cclxuXHRcdFx0dGhpcy5vbkRyYWdTdGFydC5lbWl0KGl0ZW0pO1xyXG5cdFx0XHRpdGVtLm9uRHJhZ1N0YXJ0RXZlbnQoKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLl96b29tT25EcmFnKSB7XHJcblx0XHRcdFx0dGhpcy5fem9vbU91dCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX3pvb21PdXQoKSB7XHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgXCJzY2FsZSgwLjUsIDAuNSlcIik7XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX3Jlc2V0Wm9vbSgpIHtcclxuXHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCBcIlwiKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX29uTW91c2VNb3ZlKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKGUuYnV0dG9ucyA9PSAwICYmIHRoaXMuaXNEcmFnZ2luZykge1xyXG5cdFx0XHR0aGlzLl9kcmFnU3RvcChlKTtcclxuXHRcdH0gZWxzZSBpZiAoZS5idXR0b25zID09IDAgJiYgdGhpcy5pc1Jlc2l6aW5nKSB7XHJcblx0XHRcdHRoaXMuX3Jlc2l6ZVN0b3AoZSk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG5cdFx0XHR0aGlzLl9kcmFnKGUpO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmlzUmVzaXppbmcpIHtcclxuXHRcdFx0dGhpcy5fcmVzaXplKGUpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzLl9nZXRJdGVtRnJvbVBvc2l0aW9uKG1vdXNlUG9zKTtcclxuXHJcblx0XHRcdGlmIChpdGVtKSB7XHJcblx0XHRcdFx0aXRlbS5vbk1vdXNlTW92ZShlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZHJhZyhlOiBhbnkpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcclxuXHRcdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHRcdFx0dmFyIG5ld0wgPSAobW91c2VQb3MubGVmdCAtIHRoaXMuX3Bvc09mZnNldC5sZWZ0KTtcclxuXHRcdFx0dmFyIG5ld1QgPSAobW91c2VQb3MudG9wIC0gdGhpcy5fcG9zT2Zmc2V0LnRvcCk7XHJcblxyXG5cdFx0XHR2YXIgaXRlbVBvcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0dmFyIGdyaWRQb3MgPSB0aGlzLl9jYWxjdWxhdGVHcmlkUG9zaXRpb24obmV3TCwgbmV3VCk7XHJcblx0XHRcdHZhciBkaW1zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldFNpemUoKTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNYKGdyaWRQb3MsIGRpbXMpKVxyXG5cdFx0XHRcdGdyaWRQb3MuY29sID0gdGhpcy5fbWF4Q29scyAtIChkaW1zLnggLSAxKTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKGdyaWRQb3MsIGRpbXMpKVxyXG5cdFx0XHRcdGdyaWRQb3Mucm93ID0gdGhpcy5fbWF4Um93cyAtIChkaW1zLnkgLSAxKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICghdGhpcy5fYXV0b1Jlc2l6ZSAmJiB0aGlzLl9saW1pdFRvU2NyZWVuKSB7XHJcblx0XHRcdFx0aWYgKChncmlkUG9zLmNvbCArIGRpbXMueCAtIDEpID4gdGhpcy5fZ2V0Q29udGFpbmVyQ29sdW1ucygpKSB7XHJcblx0XHRcdFx0XHRncmlkUG9zLmNvbCA9IHRoaXMuX2dldENvbnRhaW5lckNvbHVtbnMoKSAtIChkaW1zLnggLSAxKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChncmlkUG9zLmNvbCAhPSBpdGVtUG9zLmNvbCB8fCBncmlkUG9zLnJvdyAhPSBpdGVtUG9zLnJvdykge1xyXG5cdFx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbS5zZXRHcmlkUG9zaXRpb24oZ3JpZFBvcywgZmFsc2UpO1xyXG5cdFx0XHRcdHRoaXMuX3BsYWNlaG9sZGVyUmVmLmluc3RhbmNlLnNldEdyaWRQb3NpdGlvbihncmlkUG9zKTtcclxuXHJcblx0XHRcdFx0aWYgKFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZih0aGlzLmNhc2NhZGUpID49IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuX2ZpeEdyaWRDb2xsaXNpb25zKGdyaWRQb3MsIGRpbXMpO1xyXG5cdFx0XHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoZ3JpZFBvcywgZGltcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghdGhpcy5fZml4VG9HcmlkKSB7XHJcblx0XHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLnNldFBvc2l0aW9uKG5ld0wsIG5ld1QpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9uRHJhZy5lbWl0KHRoaXMuX2RyYWdnaW5nSXRlbSk7XHJcblx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbS5vbkRyYWdFdmVudCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfcmVzaXplKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNSZXNpemluZykge1xyXG5cdFx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0XHR2YXIgaXRlbVBvcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRQb3NpdGlvbigpO1xyXG5cdFx0XHR2YXIgaXRlbURpbXMgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0RGltZW5zaW9ucygpO1xyXG5cdFx0XHR2YXIgbmV3VyA9IHRoaXMuX3Jlc2l6ZURpcmVjdGlvbiA9PSAnaGVpZ2h0JyA/IGl0ZW1EaW1zLndpZHRoIDogKG1vdXNlUG9zLmxlZnQgLSBpdGVtUG9zLmxlZnQgKyAxMCk7XHJcblx0XHRcdHZhciBuZXdIID0gdGhpcy5fcmVzaXplRGlyZWN0aW9uID09ICd3aWR0aCcgPyBpdGVtRGltcy5oZWlnaHQgOiAobW91c2VQb3MudG9wIC0gaXRlbVBvcy50b3AgKyAxMCk7XHJcblxyXG5cdFx0XHRpZiAobmV3VyA8IHRoaXMubWluV2lkdGgpXHJcblx0XHRcdFx0bmV3VyA9IHRoaXMubWluV2lkdGg7XHJcblx0XHRcdGlmIChuZXdIIDwgdGhpcy5taW5IZWlnaHQpXHJcblx0XHRcdFx0bmV3SCA9IHRoaXMubWluSGVpZ2h0O1xyXG5cclxuXHRcdFx0dmFyIGNhbGNTaXplID0gdGhpcy5fY2FsY3VsYXRlR3JpZFNpemUobmV3VywgbmV3SCk7XHJcblx0XHRcdHZhciBpdGVtU2l6ZSA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRTaXplKCk7XHJcblx0XHRcdHZhciBpR3JpZFBvcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNYKGlHcmlkUG9zLCBjYWxjU2l6ZSkpXHJcblx0XHRcdFx0Y2FsY1NpemUueCA9ICh0aGlzLl9tYXhDb2xzIC0gaUdyaWRQb3MuY29sKSArIDE7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWShpR3JpZFBvcywgY2FsY1NpemUpKVxyXG5cdFx0XHRcdGNhbGNTaXplLnkgPSAodGhpcy5fbWF4Um93cyAtIGlHcmlkUG9zLnJvdykgKyAxO1xyXG5cclxuXHRcdFx0Y2FsY1NpemUgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZml4UmVzaXplKGNhbGNTaXplKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChjYWxjU2l6ZS54ICE9IGl0ZW1TaXplLnggfHwgY2FsY1NpemUueSAhPSBpdGVtU2l6ZS55KSB7XHJcblx0XHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtLnNldFNpemUoY2FsY1NpemUsIGZhbHNlKTtcclxuXHRcdFx0XHR0aGlzLl9wbGFjZWhvbGRlclJlZi5pbnN0YW5jZS5zZXRTaXplKGNhbGNTaXplKTtcclxuXHJcblx0XHRcdFx0aWYgKFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZih0aGlzLmNhc2NhZGUpID49IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuX2ZpeEdyaWRDb2xsaXNpb25zKGlHcmlkUG9zLCBjYWxjU2l6ZSk7XHJcblx0XHRcdFx0XHR0aGlzLl9jYXNjYWRlR3JpZChpR3JpZFBvcywgY2FsY1NpemUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9maXhUb0dyaWQpXHJcblx0XHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtLnNldERpbWVuc2lvbnMobmV3VywgbmV3SCk7XHJcblxyXG5cdFx0XHR2YXIgYmlnR3JpZCA9IHRoaXMuX21heEdyaWRTaXplKGl0ZW1Qb3MubGVmdCArIG5ld1cgKyAoMiAqIGUubW92ZW1lbnRYKSwgaXRlbVBvcy50b3AgKyBuZXdIICsgKDIgKiBlLm1vdmVtZW50WSkpO1xyXG5cclxuXHRcdFx0aWYgKHRoaXMuX3Jlc2l6ZURpcmVjdGlvbiA9PSAnaGVpZ2h0JykgYmlnR3JpZC54ID0gaUdyaWRQb3MuY29sICsgaXRlbVNpemUueDtcclxuXHRcdFx0aWYgKHRoaXMuX3Jlc2l6ZURpcmVjdGlvbiA9PSAnd2lkdGgnKSBiaWdHcmlkLnkgPSBpR3JpZFBvcy5yb3cgKyBpdGVtU2l6ZS55O1xyXG5cclxuXHRcdFx0dGhpcy5vblJlc2l6ZS5lbWl0KHRoaXMuX3Jlc2l6aW5nSXRlbSk7XHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbS5vblJlc2l6ZUV2ZW50KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9vbk1vdXNlVXAoZTogYW55KTogYm9vbGVhbiB7XHJcblx0XHRpZiAodGhpcy5pc0RyYWdnaW5nKSB7XHJcblx0XHRcdHRoaXMuX2RyYWdTdG9wKGUpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuaXNSZXNpemluZykge1xyXG5cdFx0XHR0aGlzLl9yZXNpemVTdG9wKGUpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9kcmFnU3RvcChlOiBhbnkpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcclxuXHRcdFx0dGhpcy5pc0RyYWdnaW5nID0gZmFsc2U7XHJcblxyXG5cdFx0XHR2YXIgaXRlbVBvcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHJcblx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbS5zYXZlUG9zaXRpb24oaXRlbVBvcyk7XHJcblx0XHRcdHRoaXMuX2FkZFRvR3JpZCh0aGlzLl9kcmFnZ2luZ0l0ZW0pO1xyXG5cclxuXHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHJcblx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbS5zdG9wTW92aW5nKCk7XHJcblx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbS5vbkRyYWdTdG9wRXZlbnQoKTtcclxuXHRcdFx0dGhpcy5vbkRyYWdTdG9wLmVtaXQodGhpcy5fZHJhZ2dpbmdJdGVtKTtcclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtID0gbnVsbDtcclxuXHRcdFx0dGhpcy5fcG9zT2Zmc2V0ID0gbnVsbDtcclxuXHRcdFx0dGhpcy5fcGxhY2Vob2xkZXJSZWYuZGVzdHJveSgpO1xyXG5cclxuXHRcdFx0dGhpcy5vbkl0ZW1DaGFuZ2UuZW1pdCh0aGlzLl9pdGVtcy5tYXAoaXRlbSA9PiBpdGVtLmdldEV2ZW50T3V0cHV0KCkpKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl96b29tT25EcmFnKSB7XHJcblx0XHRcdFx0dGhpcy5fcmVzZXRab29tKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3Jlc2l6ZVN0b3AoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5pc1Jlc2l6aW5nKSB7XHJcblx0XHRcdHRoaXMuaXNSZXNpemluZyA9IGZhbHNlO1xyXG5cclxuXHRcdFx0dmFyIGl0ZW1EaW1zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldFNpemUoKTtcclxuXHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbS5zZXRTaXplKGl0ZW1EaW1zKTtcclxuXHRcdFx0dGhpcy5fYWRkVG9HcmlkKHRoaXMuX3Jlc2l6aW5nSXRlbSk7XHJcblxyXG5cdFx0XHR0aGlzLl9jYXNjYWRlR3JpZCgpO1xyXG5cclxuXHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtLnN0b3BNb3ZpbmcoKTtcclxuXHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtLm9uUmVzaXplU3RvcEV2ZW50KCk7XHJcblx0XHRcdHRoaXMub25SZXNpemVTdG9wLmVtaXQodGhpcy5fcmVzaXppbmdJdGVtKTtcclxuXHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtID0gbnVsbDtcclxuXHRcdFx0dGhpcy5fcmVzaXplRGlyZWN0aW9uID0gbnVsbDtcclxuXHRcdFx0dGhpcy5fcGxhY2Vob2xkZXJSZWYuZGVzdHJveSgpO1xyXG5cclxuXHRcdFx0dGhpcy5vbkl0ZW1DaGFuZ2UuZW1pdCh0aGlzLl9pdGVtcy5tYXAoaXRlbSA9PiBpdGVtLmdldEV2ZW50T3V0cHV0KCkpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX21heEdyaWRTaXplKHc6IG51bWJlciwgaDogbnVtYmVyKTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9IHtcclxuXHRcdHZhciBzaXpleCA9IE1hdGguY2VpbCh3IC8gKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSk7XHJcblx0XHR2YXIgc2l6ZXkgPSBNYXRoLmNlaWwoaCAvICh0aGlzLnJvd0hlaWdodCArIHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b20pKTtcclxuXHRcdHJldHVybiB7ICd4Jzogc2l6ZXgsICd5Jzogc2l6ZXkgfTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2NhbGN1bGF0ZUdyaWRTaXplKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9IHtcclxuXHRcdHdpZHRoICs9IHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQ7XHJcblx0XHRoZWlnaHQgKz0gdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbTtcclxuXHJcblx0XHR2YXIgc2l6ZXggPSBNYXRoLm1heCh0aGlzLm1pbkNvbHMsIE1hdGgucm91bmQod2lkdGggLyAodGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpKSk7XHJcblx0XHR2YXIgc2l6ZXkgPSBNYXRoLm1heCh0aGlzLm1pblJvd3MsIE1hdGgucm91bmQoaGVpZ2h0IC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWCh7IGNvbDogMSwgcm93OiAxIH0sIHsgeDogc2l6ZXgsIHk6IHNpemV5IH0pKSBzaXpleCA9IHRoaXMuX21heENvbHM7XHJcblx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWSh7IGNvbDogMSwgcm93OiAxIH0sIHsgeDogc2l6ZXgsIHk6IHNpemV5IH0pKSBzaXpleSA9IHRoaXMuX21heFJvd3M7XHJcblxyXG5cdFx0cmV0dXJuIHsgJ3gnOiBzaXpleCwgJ3knOiBzaXpleSB9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfY2FsY3VsYXRlR3JpZFBvc2l0aW9uKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpOiB7IGNvbDogbnVtYmVyLCByb3c6IG51bWJlciB9IHtcclxuXHRcdHZhciBjb2wgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGxlZnQgLyAodGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpKSArIDEpO1xyXG5cdFx0dmFyIHJvdyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodG9wIC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpICsgMSk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goeyBjb2w6IGNvbCwgcm93OiByb3cgfSwgeyB4OiAxLCB5OiAxIH0pKSBjb2wgPSB0aGlzLl9tYXhDb2xzO1xyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koeyBjb2w6IGNvbCwgcm93OiByb3cgfSwgeyB4OiAxLCB5OiAxIH0pKSByb3cgPSB0aGlzLl9tYXhSb3dzO1xyXG5cclxuXHRcdHJldHVybiB7ICdjb2wnOiBjb2wsICdyb3cnOiByb3cgfTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2hhc0dyaWRDb2xsaXNpb24ocG9zOiB7IGNvbDogbnVtYmVyLCByb3c6IG51bWJlciB9LCBkaW1zOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pOiBib29sZWFuIHtcclxuXHRcdHZhciBwb3NpdGlvbnMgPSB0aGlzLl9nZXRDb2xsaXNpb25zKHBvcywgZGltcyk7XHJcblxyXG5cdFx0aWYgKHBvc2l0aW9ucyA9PSBudWxsIHx8IHBvc2l0aW9ucy5sZW5ndGggPT0gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHJldHVybiBwb3NpdGlvbnMuc29tZShmdW5jdGlvbih2KSB7XHJcblx0XHRcdHJldHVybiAhKHYgPT09IG51bGwpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9nZXRDb2xsaXNpb25zKHBvczogeyBjb2w6IG51bWJlciwgcm93OiBudW1iZXIgfSwgZGltczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KTogQXJyYXk8TmdHcmlkSXRlbT4ge1xyXG5cdFx0dmFyIHJldHVybnM6IEFycmF5PE5nR3JpZEl0ZW0+ID0gW107XHJcblxyXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkaW1zLnk7IGorKylcclxuXHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXSAhPSBudWxsKVxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGltcy54OyBpKyspXHJcblx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcG9zLnJvdyArIGpdW3Bvcy5jb2wgKyBpXSAhPSBudWxsKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm5zLnB1c2godGhpcy5faXRlbUdyaWRbcG9zLnJvdyArIGpdW3Bvcy5jb2wgKyBpXSk7XHJcblxyXG5cdFx0cmV0dXJuIHJldHVybnM7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9maXhHcmlkQ29sbGlzaW9ucyhwb3M6IHsgY29sOiBudW1iZXIsIHJvdzogbnVtYmVyIH0sIGRpbXM6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSk6IHZvaWQge1xyXG5cdFx0d2hpbGUgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSkge1xyXG5cdFx0XHR2YXIgY29sbGlzaW9ucyA9IHRoaXMuX2dldENvbGxpc2lvbnMocG9zLCBkaW1zKTtcclxuXHJcblx0XHRcdHZhciBtZSA9IHRoaXM7XHJcblx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGNvbGxpc2lvbnNbMF0pO1xyXG5cclxuXHRcdFx0dmFyIGl0ZW1Qb3MgPSBjb2xsaXNpb25zWzBdLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdFx0XHR2YXIgaXRlbURpbXMgPSBjb2xsaXNpb25zWzBdLmdldFNpemUoKTtcclxuXHJcblx0XHRcdHN3aXRjaCAodGhpcy5jYXNjYWRlKSB7XHJcblx0XHRcdFx0Y2FzZSBcInVwXCI6XHJcblx0XHRcdFx0Y2FzZSBcImRvd25cIjpcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koaXRlbVBvcywgaXRlbURpbXMpKVxyXG5cdFx0XHRcdFx0XHRpdGVtUG9zLmNvbCsrO1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpdGVtUG9zLnJvdysrO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSBcImxlZnRcIjpcclxuXHRcdFx0XHRjYXNlIFwicmlnaHRcIjpcclxuXHRcdFx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNYKGl0ZW1Qb3MsIGl0ZW1EaW1zKSlcclxuXHRcdFx0XHRcdFx0aXRlbVBvcy5yb3crKztcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aXRlbVBvcy5jb2wrKztcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb2xsaXNpb25zWzBdLnNldEdyaWRQb3NpdGlvbihpdGVtUG9zKTtcclxuXHRcdFx0dGhpcy5fZml4R3JpZENvbGxpc2lvbnMoaXRlbVBvcywgaXRlbURpbXMpO1xyXG5cdFx0XHR0aGlzLl9hZGRUb0dyaWQoY29sbGlzaW9uc1swXSk7XHJcblx0XHRcdGNvbGxpc2lvbnNbMF0ub25DYXNjYWRlRXZlbnQoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfbGltaXRHcmlkKG1heENvbHM6IG51bWJlcikge1xyXG5cdFx0bGV0IGl0ZW1zID0gdGhpcy5faXRlbXM7XHJcblx0XHRcclxuXHRcdGl0ZW1zLnNvcnQoKGE6IE5nR3JpZEl0ZW0sIGI6IE5nR3JpZEl0ZW0pID0+IHtcclxuXHRcdFx0bGV0IGFQb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGEuZ2V0U2F2ZWRQb3NpdGlvbigpO1xyXG5cdFx0XHRsZXQgYlBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gYi5nZXRTYXZlZFBvc2l0aW9uKCk7XHJcblxyXG5cdFx0XHRpZiAoYVBvcy5yb3cgPT0gYlBvcy5yb3cpIHtcclxuXHRcdFx0XHRyZXR1cm4gYVBvcy5jb2wgPT0gYlBvcy5jb2wgPyAwIDogKGFQb3MuY29sIDwgYlBvcy5jb2wgPyAtMSA6IDEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBhUG9zLnJvdyA8IGJQb3Mucm93ID8gLTEgOiAxO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0bGV0IGNvbHVtbk1heDogeyBbY29sOiBudW1iZXJdOiBudW1iZXIgfSA9IHt9O1xyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBpID0gMTsgaSA8PSBtYXhDb2xzOyBpKyspIGNvbHVtbk1heFtpXSA9IDE7XHJcblx0XHRcclxuXHRcdGxldCBjdXJQb3MgPSB7IGNvbDogMSwgcm93OiAxIH07XHJcblx0XHRjb25zb2xlLmxvZyhpdGVtcyk7XHJcblx0XHRmb3IgKGxldCBpdGVtIG9mIGl0ZW1zKSB7XHJcblx0XHRcdGxldCBwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0U2F2ZWRQb3NpdGlvbigpO1xyXG5cdFx0XHRsZXQgZGltczogTmdHcmlkSXRlbVNpemUgPSBpdGVtLmdldFNpemUoKTtcclxuXHRcdFx0Y29uc29sZS5sb2cocG9zKTtcclxuXHRcdFx0Y29uc29sZS5sb2codGhpcy5fY2FuRml0KHBvcywgZGltcywgY29sdW1uTWF4KSk7XHJcblx0XHRcdGlmICghdGhpcy5fY2FuRml0KHBvcywgZGltcywgY29sdW1uTWF4KSkge1xyXG5cdFx0XHRcdHBvcyA9IHRoaXMuX2ZpdEl0ZW0oZGltcywgY29sdW1uTWF4KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb25zb2xlLmxvZyhwb3MpO1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGRpbXMueDsgaSsrKVxyXG5cdFx0XHRcdGNvbHVtbk1heFtwb3MuY29sICsgaV0gPSAocG9zLnJvdyArIGRpbXMueSk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGNvbHVtbk1heCk7XHJcblx0XHRcdGl0ZW0uc2V0R3JpZFBvc2l0aW9uKHBvcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX2NhbkZpdChwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUsIGNvbHVtbk1heDogeyBbY29sOiBudW1iZXJdOiBudW1iZXIgfSk6IGJvb2xlYW4ge1xyXG5cdFx0bGV0IGtleXM6IEFycmF5PG51bWJlcj4gPSBPYmplY3Qua2V5cyhjb2x1bW5NYXgpLm1hcCh4ID0+IHBhcnNlSW50KHgsIDEwKSk7XHJcblx0XHRsZXQgbWF4Q29sID0gTWF0aC5tYXguYXBwbHkobnVsbCwga2V5cyk7XHJcblx0XHRcclxuXHRcdGlmIChwb3MuY29sICsgZGltcy54IC0gMSA+IG1heENvbCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGRpbXMueDsgaSsrKSB7XHJcblx0XHRcdGlmIChjb2x1bW5NYXhbcG9zLmNvbCArIGldID4gcG9zLnJvdykge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfZml0SXRlbShkaW1zOiBOZ0dyaWRJdGVtU2l6ZSwgY29sdW1uTWF4OiB7IFtjb2w6IG51bWJlcl06IG51bWJlciB9KTogTmdHcmlkSXRlbVBvc2l0aW9uIHtcclxuXHRcdGxldCBrZXlzOiBBcnJheTxudW1iZXI+ID0gT2JqZWN0LmtleXMoY29sdW1uTWF4KS5tYXAoeCA9PiBwYXJzZUludCh4LCAxMCkpO1xyXG5cdFx0bGV0IG1heENvbCA9IE1hdGgubWF4LmFwcGx5KG51bGwsIGtleXMpO1xyXG5cdFx0bGV0IHJldHVyblBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0geyBjb2w6IDEsIHJvdzogMSB9O1xyXG5cdFx0XHJcblx0XHRrZXlzLnNvcnQoKGEsIGIpID0+IHtcclxuXHRcdFx0cmV0dXJuIGNvbHVtbk1heFthXSA9PSBjb2x1bW5NYXhbYl0gPyAwIDogY29sdW1uTWF4W2FdIDwgY29sdW1uTWF4W2JdID8gLTEgOiAxO1xyXG5cdFx0fSk7XHJcblx0XHRcclxuXHRcdGZvciAobGV0IGtleSBvZiBrZXlzKSB7XHJcblx0XHRcdGlmIChrZXkgKyBkaW1zLnggLSAxID4gbWF4Q29sKSB7XHJcblx0XHRcdFx0aWYgKGtleSA9PSAxKSB7XHJcblx0XHRcdFx0XHRyZXR1cm5Qb3MuY29sID0ga2V5O1xyXG5cdFx0XHRcdFx0cmV0dXJuUG9zLnJvdyA9IGNvbHVtbk1heFtrZXldO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCBmaXRzID0gdHJ1ZTtcclxuXHRcdFx0XHRsZXQgcm93ID0gY29sdW1uTWF4W2tleV07XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDE7IGkgPCBkaW1zLng7IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKGNvbHVtbk1heFtrZXkgKyBpXSA+IHJvdykge1xyXG5cdFx0XHRcdFx0XHRmaXRzID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChmaXRzKSB7XHJcblx0XHRcdFx0XHRyZXR1cm5Qb3MuY29sID0ga2V5O1xyXG5cdFx0XHRcdFx0cmV0dXJuUG9zLnJvdyA9IGNvbHVtbk1heFtrZXldO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiByZXR1cm5Qb3M7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9jYXNjYWRlR3JpZChwb3M/OiB7IGNvbDogbnVtYmVyLCByb3c6IG51bWJlciB9LCBkaW1zPzogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCBzaG91bGRTYXZlID0gdHJ1ZSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2Rlc3Ryb3llZCkgcmV0dXJuO1xyXG5cdFx0aWYgKHBvcyAmJiAhZGltcykgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGNhc2NhZGUgd2l0aCBvbmx5IHBvc2l0aW9uIGFuZCBub3QgZGltZW5zaW9uc1wiKTtcclxuXHJcblx0XHRpZiAodGhpcy5pc0RyYWdnaW5nICYmIHRoaXMuX2RyYWdnaW5nSXRlbSAmJiAhcG9zICYmICFkaW1zKSB7XHJcblx0XHRcdHBvcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0ZGltcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRTaXplKCk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuaXNSZXNpemluZyAmJiB0aGlzLl9yZXNpemluZ0l0ZW0gJiYgIXBvcyAmJiAhZGltcykge1xyXG5cdFx0XHRwb3MgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRcdGRpbXMgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0U2l6ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN3aXRjaCAodGhpcy5jYXNjYWRlKSB7XHJcblx0XHRcdGNhc2UgXCJ1cFwiOlxyXG5cdFx0XHRjYXNlIFwiZG93blwiOlxyXG5cdFx0XHRcdHZhciBsb3dSb3c6IEFycmF5PG51bWJlcj4gPSBbMF07XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGk6IG51bWJlciA9IDE7IGkgPD0gdGhpcy5fZ2V0TWF4Q29sKCk7IGkrKylcclxuXHRcdFx0XHRcdGxvd1Jvd1tpXSA9IDE7XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIHI6IG51bWJlciA9IDE7IHIgPD0gdGhpcy5fZ2V0TWF4Um93KCk7IHIrKykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdID09IHVuZGVmaW5lZCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0Zm9yICh2YXIgYzogbnVtYmVyID0gMTsgYyA8PSB0aGlzLl9nZXRNYXhDb2woKTsgYysrKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXSA9PSB1bmRlZmluZWQpIGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRpZiAociA8IGxvd1Jvd1tjXSkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcl1bY10gIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBpdGVtID0gdGhpcy5faXRlbUdyaWRbcl1bY107XHJcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uaXNGaXhlZCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHZhciBpdGVtRGltcyA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdHZhciBpdGVtUG9zID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW1Qb3MuY29sICE9IGMgfHwgaXRlbVBvcy5yb3cgIT0gcikgY29udGludWU7XHQvL1x0SWYgdGhpcyBpcyBub3QgdGhlIGVsZW1lbnQncyBzdGFydFxyXG5cclxuXHRcdFx0XHRcdFx0XHR2YXIgbG93ZXN0ID0gbG93Um93W2NdO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRmb3IgKHZhciBpOiBudW1iZXIgPSAxOyBpIDwgaXRlbURpbXMueDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRsb3dlc3QgPSBNYXRoLm1heChsb3dSb3dbKGMgKyBpKV0sIGxvd2VzdCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAocG9zICYmIChjICsgaXRlbURpbXMueCkgPiBwb3MuY29sICYmIGMgPCAocG9zLmNvbCArIGRpbXMueCkpIHsgICAgICAgICAgLy9cdElmIG91ciBlbGVtZW50IGlzIGluIG9uZSBvZiB0aGUgaXRlbSdzIGNvbHVtbnNcclxuXHRcdFx0XHRcdFx0XHRcdGlmICgociA+PSBwb3Mucm93ICYmIHIgPCAocG9zLnJvdyArIGRpbXMueSkpIHx8ICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHRJZiB0aGlzIHJvdyBpcyBvY2N1cGllZCBieSBvdXIgZWxlbWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQoKGl0ZW1EaW1zLnkgPiAocG9zLnJvdyAtIGxvd2VzdCkpICYmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHRPciB0aGUgaXRlbSBjYW4ndCBmaXQgYWJvdmUgb3VyIGVsZW1lbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQociA+PSAocG9zLnJvdyArIGRpbXMueSkgJiYgbG93ZXN0IDwgKHBvcy5yb3cgKyBkaW1zLnkpKSkpIHsgICAgLy9cdFx0QW5kIHRoaXMgcm93IGlzIGJlbG93IG91ciBlbGVtZW50LCBidXQgd2UgaGF2ZW4ndCBjYXVnaHQgaXRcclxuXHRcdFx0XHRcdFx0XHRcdFx0bG93ZXN0ID0gTWF0aC5tYXgobG93ZXN0LCBwb3Mucm93ICsgZGltcy55KTsgICAgICAgICAgICAgICAgICAgICAgICAvL1x0U2V0IHRoZSBsb3dlc3Qgcm93IHRvIGJlIGJlbG93IGl0XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAobG93ZXN0ICE9IGl0ZW1Qb3Mucm93KSB7XHQvL1x0SWYgdGhlIGl0ZW0gaXMgbm90IGFscmVhZHkgb24gdGhpcyByb3cgbW92ZSBpdCB1cFxyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChzaG91bGRTYXZlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uc2F2ZVBvc2l0aW9uKHsgY29sOiBjLCByb3c6IGxvd2VzdCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uc2V0R3JpZFBvc2l0aW9uKHsgY29sOiBjLCByb3c6IGxvd2VzdCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5vbkNhc2NhZGVFdmVudCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IGl0ZW1EaW1zLng7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0bG93Um93W2MgKyBpXSA9IGxvd2VzdCArIGl0ZW1EaW1zLnk7XHQvL1x0VXBkYXRlIHRoZSBsb3dlc3Qgcm93IHRvIGJlIGJlbG93IHRoZSBpdGVtXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBcImxlZnRcIjpcclxuXHRcdFx0Y2FzZSBcInJpZ2h0XCI6XHJcblx0XHRcdFx0dmFyIGxvd0NvbDogQXJyYXk8bnVtYmVyPiA9IFswXTtcclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMTsgaSA8PSB0aGlzLl9nZXRNYXhSb3coKTsgaSsrKVxyXG5cdFx0XHRcdFx0bG93Q29sW2ldID0gMTtcclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgcjogbnVtYmVyID0gMTsgciA8PSB0aGlzLl9nZXRNYXhSb3coKTsgcisrKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcl0gPT0gdW5kZWZpbmVkKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRmb3IgKHZhciBjOiBudW1iZXIgPSAxOyBjIDw9IHRoaXMuX2dldE1heENvbCgpOyBjKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdID09IHVuZGVmaW5lZCkgYnJlYWs7XHJcblx0XHRcdFx0XHRcdGlmIChjIDwgbG93Q29sW3JdKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXVtjXSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGl0ZW0gPSB0aGlzLl9pdGVtR3JpZFtyXVtjXTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgaXRlbURpbXMgPSBpdGVtLmdldFNpemUoKTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgaXRlbVBvcyA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChpdGVtUG9zLmNvbCAhPSBjIHx8IGl0ZW1Qb3Mucm93ICE9IHIpIGNvbnRpbnVlO1x0Ly9cdElmIHRoaXMgaXMgbm90IHRoZSBlbGVtZW50J3Mgc3RhcnRcclxuXHJcblx0XHRcdFx0XHRcdFx0dmFyIGxvd2VzdCA9IGxvd0NvbFtyXTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgaTogbnVtYmVyID0gMTsgaSA8IGl0ZW1EaW1zLnk7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0bG93ZXN0ID0gTWF0aC5tYXgobG93Q29sWyhyICsgaSldLCBsb3dlc3QpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKHBvcyAmJiAociArIGl0ZW1EaW1zLnkpID4gcG9zLnJvdyAmJiByIDwgKHBvcy5yb3cgKyBkaW1zLnkpKSB7ICAgICAgICAgIC8vXHRJZiBvdXIgZWxlbWVudCBpcyBpbiBvbmUgb2YgdGhlIGl0ZW0ncyByb3dzXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoKGMgPj0gcG9zLmNvbCAmJiBjIDwgKHBvcy5jb2wgKyBkaW1zLngpKSB8fCAgICAgICAgICAgICAgICAgICAgICAgICAvL1x0SWYgdGhpcyBjb2wgaXMgb2NjdXBpZWQgYnkgb3VyIGVsZW1lbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0KChpdGVtRGltcy54ID4gKHBvcy5jb2wgLSBsb3dlc3QpKSAmJiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1x0T3IgdGhlIGl0ZW0gY2FuJ3QgZml0IGFib3ZlIG91ciBlbGVtZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KGMgPj0gKHBvcy5jb2wgKyBkaW1zLngpICYmIGxvd2VzdCA8IChwb3MuY29sICsgZGltcy54KSkpKSB7ICAgIC8vXHRcdEFuZCB0aGlzIGNvbCBpcyBiZWxvdyBvdXIgZWxlbWVudCwgYnV0IHdlIGhhdmVuJ3QgY2F1Z2h0IGl0XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxvd2VzdCA9IE1hdGgubWF4KGxvd2VzdCwgcG9zLmNvbCArIGRpbXMueCk7ICAgICAgICAgICAgICAgICAgICAgICAgLy9cdFNldCB0aGUgbG93ZXN0IGNvbCB0byBiZSBiZWxvdyBpdFxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGxvd2VzdCAhPSBpdGVtUG9zLmNvbCkge1x0Ly9cdElmIHRoZSBpdGVtIGlzIG5vdCBhbHJlYWR5IG9uIHRoaXMgY29sIG1vdmUgaXQgdXBcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2hvdWxkU2F2ZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpdGVtLnNhdmVQb3NpdGlvbih7IGNvbDogYywgcm93OiBsb3dlc3QgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpdGVtLnNldEdyaWRQb3NpdGlvbih7IGNvbDogbG93ZXN0LCByb3c6IHIgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0ub25DYXNjYWRlRXZlbnQoKTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2FkZFRvR3JpZChpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBpdGVtRGltcy55OyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdGxvd0NvbFtyICsgaV0gPSBsb3dlc3QgKyBpdGVtRGltcy54O1x0Ly9cdFVwZGF0ZSB0aGUgbG93ZXN0IGNvbCB0byBiZSBiZWxvdyB0aGUgaXRlbVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9maXhHcmlkUG9zaXRpb24ocG9zOiB7IGNvbDogbnVtYmVyLCByb3c6IG51bWJlciB9LCBkaW1zOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pOiB7IGNvbDogbnVtYmVyLCByb3c6IG51bWJlciB9IHtcclxuXHRcdHdoaWxlICh0aGlzLl9oYXNHcmlkQ29sbGlzaW9uKHBvcywgZGltcykgfHwgIXRoaXMuX2lzV2l0aGluQm91bmRzKHBvcywgZGltcykpIHtcclxuXHRcdFx0aWYgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRcdHN3aXRjaCAodGhpcy5jYXNjYWRlKSB7XHJcblx0XHRcdFx0XHRjYXNlICd1cCc6XHJcblx0XHRcdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHRcdFx0cG9zLnJvdysrO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdFx0XHRwb3MuY29sKys7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1kocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRcdHBvcy5jb2wrKztcclxuXHRcdFx0XHRwb3Mucm93ID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWChwb3MsIGRpbXMpKSB7XHJcblx0XHRcdFx0cG9zLnJvdysrO1xyXG5cdFx0XHRcdHBvcy5jb2wgPSAxO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcG9zO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfaXNXaXRoaW5Cb3VuZHNYKHBvczogeyBjb2w6IG51bWJlciwgcm93OiBudW1iZXIgfSwgZGltczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuX21heENvbHMgPT0gMCB8fCAocG9zLmNvbCArIGRpbXMueCAtIDEpIDw9IHRoaXMuX21heENvbHMpO1xyXG5cdH1cclxuXHRwcml2YXRlIF9pc1dpdGhpbkJvdW5kc1kocG9zOiB7IGNvbDogbnVtYmVyLCByb3c6IG51bWJlciB9LCBkaW1zOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0pIHtcclxuXHRcdHJldHVybiAodGhpcy5fbWF4Um93cyA9PSAwIHx8IChwb3Mucm93ICsgZGltcy55IC0gMSkgPD0gdGhpcy5fbWF4Um93cyk7XHJcblx0fVxyXG5cdHByaXZhdGUgX2lzV2l0aGluQm91bmRzKHBvczogeyBjb2w6IG51bWJlciwgcm93OiBudW1iZXIgfSwgZGltczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSB7XHJcblx0XHRyZXR1cm4gdGhpcy5faXNXaXRoaW5Cb3VuZHNYKHBvcywgZGltcykgJiYgdGhpcy5faXNXaXRoaW5Cb3VuZHNZKHBvcywgZGltcyk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9hZGRUb0dyaWQoaXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xyXG5cdFx0dmFyIHBvcyA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHR2YXIgZGltcyA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9oYXNHcmlkQ29sbGlzaW9uKHBvcywgZGltcykpIHtcclxuXHRcdFx0dGhpcy5fZml4R3JpZENvbGxpc2lvbnMocG9zLCBkaW1zKTtcclxuXHRcdFx0cG9zID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRpbXMueTsgaisrKSB7XHJcblx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtwb3Mucm93ICsgal0gPT0gbnVsbCkgdGhpcy5faXRlbUdyaWRbcG9zLnJvdyArIGpdID0ge307XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGltcy54OyBpKyspIHtcclxuXHRcdFx0XHR0aGlzLl9pdGVtR3JpZFtwb3Mucm93ICsgal1bcG9zLmNvbCArIGldID0gaXRlbTtcclxuXHJcblx0XHRcdFx0dGhpcy5fdXBkYXRlU2l6ZShwb3MuY29sICsgZGltcy54IC0gMSwgcG9zLnJvdyArIGRpbXMueSAtIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZW1vdmVGcm9tR3JpZChpdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XHJcblx0XHRmb3IgKHZhciB5IGluIHRoaXMuX2l0ZW1HcmlkKVxyXG5cdFx0XHRmb3IgKHZhciB4IGluIHRoaXMuX2l0ZW1HcmlkW3ldKVxyXG5cdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFt5XVt4XSA9PSBpdGVtKVxyXG5cdFx0XHRcdFx0dGhpcy5faXRlbUdyaWRbeV1beF0gPSBudWxsO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfdXBkYXRlU2l6ZShjb2w/OiBudW1iZXIsIHJvdz86IG51bWJlcik6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2Rlc3Ryb3llZCkgcmV0dXJuO1xyXG5cdFx0Y29sID0gKGNvbCA9PSB1bmRlZmluZWQpID8gMCA6IGNvbDtcclxuXHRcdHJvdyA9IChyb3cgPT0gdW5kZWZpbmVkKSA/IDAgOiByb3c7XHJcblxyXG5cdFx0dGhpcy5fZmlsdGVyR3JpZCgpO1xyXG5cclxuXHRcdHZhciBtYXhSb3cgPSBNYXRoLm1heCh0aGlzLl9nZXRNYXhSb3coKSwgcm93KTtcclxuXHRcdHZhciBtYXhDb2wgPSBNYXRoLm1heCh0aGlzLl9nZXRNYXhDb2woKSwgY29sKTtcclxuXHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnd2lkdGgnLCBcIjEwMCVcIik7Ly8obWF4Q29sICogKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSkrXCJweFwiKTtcclxuXHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCAobWF4Um93ICogKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpICsgXCJweFwiKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2ZpbHRlckdyaWQoKTogdm9pZCB7XHJcblx0XHR2YXIgY3VyTWF4Q29sID0gdGhpcy5fZ2V0TWF4Q29sKCk7XHJcblx0XHR2YXIgY3VyTWF4Um93ID0gdGhpcy5fZ2V0TWF4Um93KCk7XHJcblx0XHR2YXIgbWF4Q29sID0gMDtcclxuXHRcdHZhciBtYXhSb3cgPSAwO1xyXG5cclxuXHRcdGZvciAodmFyIHI6IG51bWJlciA9IDE7IHIgPD0gY3VyTWF4Um93OyByKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdID09IHVuZGVmaW5lZCkgY29udGludWU7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBjOiBudW1iZXIgPSAxOyBjIDw9IGN1ck1heENvbDsgYysrKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdW2NdICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdG1heENvbCA9IE1hdGgubWF4KG1heENvbCwgYyk7XHJcblx0XHRcdFx0XHRtYXhSb3cgPSBNYXRoLm1heChtYXhSb3csIHIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChjdXJNYXhSb3cgIT0gbWF4Um93KVxyXG5cdFx0XHRmb3IgKHZhciByOiBudW1iZXIgPSBtYXhSb3cgKyAxOyByIDw9IGN1ck1heFJvdzsgcisrKVxyXG5cdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0ZGVsZXRlIHRoaXMuX2l0ZW1HcmlkW3JdO1xyXG5cclxuXHRcdGlmIChjdXJNYXhDb2wgIT0gbWF4Q29sKVxyXG5cdFx0XHRmb3IgKHZhciByOiBudW1iZXIgPSAxOyByIDw9IG1heFJvdzsgcisrKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdID09IHVuZGVmaW5lZCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGM6IG51bWJlciA9IG1heENvbCArIDE7IGMgPD0gY3VyTWF4Q29sOyBjKyspXHJcblx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcl1bY10gIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdFx0ZGVsZXRlIHRoaXMuX2l0ZW1HcmlkW3JdW2NdO1xyXG5cdFx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9nZXRNYXhSb3coKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCBPYmplY3Qua2V5cyh0aGlzLl9pdGVtR3JpZCkpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0TWF4Q29sKCk6IG51bWJlciB7XHJcblx0XHR2YXIgbWUgPSB0aGlzO1xyXG5cdFx0dmFyIG1heGVzID0gWzBdO1xyXG5cdFx0T2JqZWN0LmtleXMobWUuX2l0ZW1HcmlkKS5tYXAoZnVuY3Rpb24odikgeyBtYXhlcy5wdXNoKE1hdGgubWF4LmFwcGx5KG51bGwsIE9iamVjdC5rZXlzKG1lLl9pdGVtR3JpZFt2XSkpKTsgfSk7XHJcblx0XHRyZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgbWF4ZXMpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0TW91c2VQb3NpdGlvbihlOiBhbnkpOiB7IGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIgfSB7XHJcblx0XHRpZiAoKCg8YW55PndpbmRvdykuVG91Y2hFdmVudCAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudCkgfHwgKGUudG91Y2hlcyB8fCBlLmNoYW5nZWRUb3VjaGVzKSkge1xyXG5cdFx0XHRlID0gZS50b3VjaGVzLmxlbmd0aCA+IDAgPyBlLnRvdWNoZXNbMF0gOiBlLmNoYW5nZWRUb3VjaGVzWzBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciByZWZQb3MgPSB0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG5cdFx0dmFyIGxlZnQgPSBlLmNsaWVudFggLSByZWZQb3MubGVmdDtcclxuXHRcdHZhciB0b3AgPSBlLmNsaWVudFkgLSByZWZQb3MudG9wO1xyXG5cclxuXHRcdGlmICh0aGlzLmNhc2NhZGUgPT0gXCJkb3duXCIpIHRvcCA9IHJlZlBvcy50b3AgKyByZWZQb3MuaGVpZ2h0IC0gZS5jbGllbnRZO1xyXG5cdFx0aWYgKHRoaXMuY2FzY2FkZSA9PSBcInJpZ2h0XCIpIGxlZnQgPSByZWZQb3MubGVmdCArIHJlZlBvcy53aWR0aCAtIGUuY2xpZW50WDtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLl96b29tT25EcmFnKSB7XHJcblx0XHRcdGxlZnQgKj0gMjtcclxuXHRcdFx0dG9wICo9IDI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGxlZnQ6IGxlZnQsXHJcblx0XHRcdHRvcDogdG9wXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0QWJzb2x1dGVNb3VzZVBvc2l0aW9uKGU6IGFueSk6IHsgbGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciB9IHtcclxuXHRcdGlmICgoKDxhbnk+d2luZG93KS5Ub3VjaEV2ZW50ICYmIGUgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB8fCAoZS50b3VjaGVzIHx8IGUuY2hhbmdlZFRvdWNoZXMpKSB7XHJcblx0XHRcdGUgPSBlLnRvdWNoZXMubGVuZ3RoID4gMCA/IGUudG91Y2hlc1swXSA6IGUuY2hhbmdlZFRvdWNoZXNbMF07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bGVmdDogZS5jbGllbnRYLFxyXG5cdFx0XHR0b3A6IGUuY2xpZW50WVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfZ2V0Q29udGFpbmVyQ29sdW1ucygpIHtcclxuXHRcdHZhciBtYXhXaWR0aDogbnVtYmVyID0gdGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG5cdFx0cmV0dXJuIE1hdGguZmxvb3IobWF4V2lkdGggLyB0aGlzLmNvbFdpZHRoKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldEl0ZW1Gcm9tUG9zaXRpb24ocG9zaXRpb246IHsgbGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciB9KTogTmdHcmlkSXRlbSB7XHJcblx0XHRmb3IgKGxldCBpdGVtIG9mIHRoaXMuX2l0ZW1zKSB7XHJcblx0XHRcdHZhciBzaXplID0gaXRlbS5nZXREaW1lbnNpb25zKCk7XHJcblx0XHRcdHZhciBwb3MgPSBpdGVtLmdldFBvc2l0aW9uKCk7XHJcblxyXG5cdFx0XHRpZiAocG9zaXRpb24ubGVmdCA+IChwb3MubGVmdCArIHRoaXMubWFyZ2luTGVmdCkgJiYgcG9zaXRpb24ubGVmdCA8IChwb3MubGVmdCArIHRoaXMubWFyZ2luTGVmdCArIHNpemUud2lkdGgpICYmXHJcblx0XHRcdFx0cG9zaXRpb24udG9wID4gKHBvcy50b3AgKyB0aGlzLm1hcmdpblRvcCkgJiYgcG9zaXRpb24udG9wIDwgKHBvcy50b3AgKyB0aGlzLm1hcmdpblRvcCArIHNpemUuaGVpZ2h0KSkge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9jcmVhdGVQbGFjZWhvbGRlcihpdGVtOiBOZ0dyaWRJdGVtKSB7XHJcblx0XHR2YXIgbWUgPSB0aGlzO1xyXG5cdFx0dmFyIHBvcyA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCksIGRpbXMgPSBpdGVtLmdldFNpemUoKTtcclxuXHJcblx0XHR0aGlzLl9sb2FkZXIubG9hZE5leHRUb0xvY2F0aW9uKCg8VHlwZT5OZ0dyaWRQbGFjZWhvbGRlciksIGl0ZW0uY29udGFpbmVyUmVmKS50aGVuKGNvbXBvbmVudFJlZiA9PiB7XHJcblx0XHRcdG1lLl9wbGFjZWhvbGRlclJlZiA9IGNvbXBvbmVudFJlZjtcclxuXHRcdFx0dmFyIHBsYWNlaG9sZGVyID0gY29tcG9uZW50UmVmLmluc3RhbmNlO1xyXG5cdFx0XHRwbGFjZWhvbGRlci5yZWdpc3RlckdyaWQobWUpO1xyXG5cdFx0XHRwbGFjZWhvbGRlci5zZXRDYXNjYWRlTW9kZSh0aGlzLmNhc2NhZGUpO1xyXG5cdFx0XHRwbGFjZWhvbGRlci5zZXRHcmlkUG9zaXRpb24oeyBjb2w6IHBvcy5jb2wsIHJvdzogcG9zLnJvdyB9KTtcclxuXHRcdFx0cGxhY2Vob2xkZXIuc2V0U2l6ZSh7IHg6IGRpbXMueCwgeTogZGltcy55IH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
