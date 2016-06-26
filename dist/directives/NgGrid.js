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
var NgGridPlaceholder_1 = require('../components/NgGridPlaceholder');
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
        this._curMaxRow = 0;
        this._curMaxCol = 0;
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
                    this.colWidth = Math.max(intVal, 1);
                    break;
                case 'row_height':
                    this.rowHeight = Math.max(intVal, 1);
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
                    this._visibleRows = Math.max(intVal, 0);
                    break;
                case 'visible_cols':
                    this._visibleCols = Math.max(intVal, 0);
                    break;
                case 'min_rows':
                    this.minRows = Math.max(intVal, 1);
                    break;
                case 'min_cols':
                    this.minCols = Math.max(intVal, 1);
                    break;
                case 'min_height':
                    this.minHeight = Math.max(intVal, 1);
                    break;
                case 'min_width':
                    this.minWidth = Math.max(intVal, 1);
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
                    case 'left':
                    case 'right':
                        this._maxCols = 0;
                        break;
                    case 'up':
                    case 'down':
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
        this._cascadeGrid();
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
        this.marginTop = Math.max(parseInt(margins[0]), 0);
        this.marginRight = margins.length >= 2 ? Math.max(parseInt(margins[1]), 0) : this.marginTop;
        this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2]), 0) : this.marginTop;
        this.marginBottom = margins.length >= 3 ? Math.max(parseInt(margins[2]), 0) : this.marginTop;
        this.marginLeft = margins.length >= 4 ? Math.max(parseInt(margins[3]), 0) : this.marginRight;
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
            this._addToGrid(item);
            item.recalculateSelf();
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
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'scale(0.5, 0.5)');
    };
    NgGrid.prototype._resetZoom = function () {
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', '');
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
                this._draggingItem.setGridPosition(gridPos, this._fixToGrid);
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
        for (var j = 0; j < dims.y; j++) {
            if (this._itemGrid[pos.row + j] != null) {
                for (var i = 0; i < dims.x; i++) {
                    if (this._itemGrid[pos.row + j][pos.col + i] != null) {
                        var item = this._itemGrid[pos.row + j][pos.col + i];
                        if (returns.indexOf(item) < 0)
                            returns.push(item);
                        var itemPos = item.getGridPosition();
                        var itemDims = item.getSize();
                        i = itemPos.col + itemDims.x - pos.col;
                    }
                }
            }
        }
        return returns;
    };
    NgGrid.prototype._fixGridCollisions = function (pos, dims) {
        while (this._hasGridCollision(pos, dims)) {
            var collisions = this._getCollisions(pos, dims);
            this._removeFromGrid(collisions[0]);
            var itemPos = collisions[0].getGridPosition();
            var itemDims = collisions[0].getSize();
            switch (this.cascade) {
                case 'up':
                case 'down':
                default:
                    var oldRow = itemPos.row;
                    itemPos.row = pos.row + dims.y;
                    if (!this._isWithinBoundsY(itemPos, itemDims)) {
                        itemPos.col = pos.col + dims.x;
                        itemPos.row = oldRow;
                    }
                    break;
                case 'left':
                case 'right':
                    var oldCol = itemPos.col;
                    itemPos.col = pos.col + dims.x;
                    if (!this._isWithinBoundsX(itemPos, itemDims)) {
                        itemPos.col = oldCol;
                        itemPos.row = pos.row + dims.y;
                    }
                    break;
            }
            collisions[0].savePosition(itemPos);
            this._fixGridCollisions(itemPos, itemDims);
            this._addToGrid(collisions[0]);
            collisions[0].onCascadeEvent();
        }
    };
    NgGrid.prototype._limitGrid = function (maxCols) {
        var items = this._items.slice();
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
        var largestGap = {};
        for (var i = 1; i <= maxCols; i++) {
            columnMax[i] = 1;
            largestGap[i] = 1;
        }
        var curPos = { col: 1, row: 1 };
        var currentRow = 1;
        var willCascade = function (item, col) {
            for (var i = col; i < col + item.sizex; i++) {
                if (columnMax[i] == currentRow)
                    return true;
            }
            return false;
        };
        while (items.length > 0) {
            var columns = [];
            var newBlock = {
                start: 1,
                end: 1,
                length: 0,
            };
            for (var col = 1; col <= maxCols; col++) {
                if (columnMax[col] <= currentRow) {
                    if (newBlock.length == 0) {
                        newBlock.start = col;
                    }
                    newBlock.length++;
                    newBlock.end = col + 1;
                }
                else if (newBlock.length > 0) {
                    columns.push(newBlock);
                    newBlock = {
                        start: col,
                        end: col,
                        length: 0,
                    };
                }
            }
            if (newBlock.length > 0) {
                columns.push(newBlock);
            }
            var tempColumns = columns.map(function (block) { return block.length; });
            var currentItems = [];
            while (items.length > 0) {
                var item = items[0];
                if (item.row > currentRow)
                    break;
                var fits = false;
                for (var x in tempColumns) {
                    if (item.sizex <= tempColumns[x]) {
                        tempColumns[x] -= item.sizex;
                        fits = true;
                        break;
                    }
                    else if (item.sizex > tempColumns[x]) {
                        tempColumns[x] = 0;
                    }
                }
                if (fits) {
                    currentItems.push(items.shift());
                }
                else {
                    break;
                }
            }
            if (currentItems.length > 0) {
                var itemPositions = [];
                var lastPosition = maxCols;
                for (var i = currentItems.length - 1; i >= 0; i--) {
                    var maxPosition = 1;
                    for (var j = columns.length - 1; j >= 0; j--) {
                        if (columns[j].start > lastPosition)
                            continue;
                        if (columns[j].start > (maxCols - currentItems[i].sizex))
                            continue;
                        if (columns[j].length < currentItems[i].sizex)
                            continue;
                        if (lastPosition < columns[j].end && (lastPosition - columns[j].start) < currentItems[i].sizex)
                            continue;
                        maxPosition = (lastPosition < columns[j].end ? lastPosition : columns[j].end) - currentItems[i].sizex;
                        break;
                    }
                    itemPositions[i] = Math.min(maxPosition, currentItems[i].row == currentRow ? currentItems[i].col : 1);
                    lastPosition = itemPositions[i];
                }
                var minPosition = 1;
                var currentItem = 0;
                while (currentItems.length > 0) {
                    var item = currentItems.shift();
                    for (var j = 0; j < columns.length; j++) {
                        if (minPosition > columns[j].end)
                            continue;
                        if (minPosition > columns[j].start && (columns[j].end - minPosition) < item.sizex)
                            continue;
                        if (minPosition < columns[j].start)
                            minPosition = columns[j].start;
                        break;
                    }
                    item.setGridPosition({ col: Math.max(minPosition, itemPositions[currentItem]), row: currentRow });
                    minPosition = item.currentCol + item.sizex;
                    currentItem++;
                    for (var i = item.currentCol; i < item.currentCol + item.sizex; i++) {
                        columnMax[i] = item.currentRow + item.sizey;
                    }
                }
            }
            else if (currentItems.length == 0 && columns.length == 1) {
                var item = items.shift();
                item.setGridPosition({ col: 1, row: currentRow });
                for (var i = item.currentCol; i < item.currentCol + item.sizex; i++) {
                    columnMax[i] = item.currentRow + item.sizey;
                }
            }
            var newRow = 0;
            for (var x in columnMax) {
                if (columnMax[x] > currentRow && (newRow == 0 || columnMax[x] < newRow)) {
                    newRow = columnMax[x];
                }
            }
            currentRow = newRow == 0 ? currentRow + 1 : newRow;
        }
    };
    NgGrid.prototype._cascadeGrid = function (pos, dims, shouldSave) {
        if (shouldSave === void 0) { shouldSave = true; }
        if (this._destroyed)
            return;
        if (pos && !dims)
            throw new Error('Cannot cascade with only position and not dimensions');
        if (this.isDragging && this._draggingItem && !pos && !dims) {
            pos = this._draggingItem.getGridPosition();
            dims = this._draggingItem.getSize();
        }
        else if (this.isResizing && this._resizingItem && !pos && !dims) {
            pos = this._resizingItem.getGridPosition();
            dims = this._resizingItem.getSize();
        }
        switch (this.cascade) {
            case 'up':
            case 'down':
                var lowRow = [0];
                for (var i = 1; i <= this._curMaxCol; i++)
                    lowRow[i] = 1;
                for (var r = 1; r <= this._curMaxRow; r++) {
                    if (this._itemGrid[r] == undefined)
                        continue;
                    for (var c = 1; c <= this._curMaxCol; c++) {
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
            case 'left':
            case 'right':
                var lowCol = [0];
                for (var i = 1; i <= this._curMaxRow; i++)
                    lowCol[i] = 1;
                for (var r = 1; r <= this._curMaxRow; r++) {
                    if (this._itemGrid[r] == undefined)
                        continue;
                    for (var c = 1; c <= this._curMaxCol; c++) {
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
                    default:
                        pos.row++;
                        break;
                    case 'left':
                    case 'right':
                        pos.col++;
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
                    delete this._itemGrid[y][x];
    };
    NgGrid.prototype._updateSize = function (col, row) {
        if (this._destroyed)
            return;
        col = (col == undefined) ? this._getMaxCol() : col;
        row = (row == undefined) ? this._getMaxRow() : row;
        var maxCol = Math.max(this._curMaxCol, col);
        var maxRow = Math.max(this._curMaxRow, row);
        if (maxCol != this._curMaxCol || maxRow != this._curMaxRow) {
            this._curMaxCol = maxCol;
            this._curMaxRow = maxRow;
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'width', '100%'); //(maxCol * (this.colWidth + this.marginLeft + this.marginRight))+'px');
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'height', (this._curMaxRow * (this.rowHeight + this.marginTop + this.marginBottom)) + 'px');
        }
    };
    NgGrid.prototype._getMaxRow = function () {
        return Math.max.apply(null, this._items.map(function (item) { return item.getGridPosition().row + item.getSize().y - 1; }));
    };
    NgGrid.prototype._getMaxCol = function () {
        return Math.max.apply(null, this._items.map(function (item) { return item.getGridPosition().col + item.getSize().x - 1; }));
    };
    NgGrid.prototype._getMousePosition = function (e) {
        if ((window.TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
            e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
        }
        var refPos = this._ngEl.nativeElement.getBoundingClientRect();
        var left = e.clientX - refPos.left;
        var top = e.clientY - refPos.top;
        if (this.cascade == 'down')
            top = refPos.top + refPos.height - e.clientY;
        if (this.cascade == 'right')
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
        return Math.floor(maxWidth / (this.colWidth + this.marginLeft + this.marginRight));
    };
    NgGrid.prototype._getItemFromPosition = function (position) {
        for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
            var item = _a[_i];
            var size = item.getDimensions();
            var pos = item.getPosition();
            if (position.left > (pos.left) && position.left < (pos.left + size.width) &&
                position.top > (pos.top) && position.top < (pos.top + size.height)) {
                return item;
            }
        }
        return null;
    };
    NgGrid.prototype._createPlaceholder = function (item) {
        var _this = this;
        var pos = item.getGridPosition();
        var dims = item.getSize();
        this._loader.loadNextToLocation(NgGridPlaceholder_1.NgGridPlaceholder, item.containerRef).then(function (componentRef) {
            _this._placeholderRef = componentRef;
            var placeholder = componentRef.instance;
            placeholder.registerGrid(_this);
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

//# sourceMappingURL=data:application/json;base64,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IiwiZmlsZSI6ImRpcmVjdGl2ZXMvTmdHcmlkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyLCBFdmVudEVtaXR0ZXIsIER5bmFtaWNDb21wb25lbnRMb2FkZXIsIEhvc3QsIFZpZXdFbmNhcHN1bGF0aW9uLCBUeXBlLCBDb21wb25lbnRSZWYsIEtleVZhbHVlRGlmZmVyLCBLZXlWYWx1ZURpZmZlcnMsIE9uSW5pdCwgT25EZXN0cm95LCBEb0NoZWNrLCBWaWV3Q29udGFpbmVyUmVmLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTmdHcmlkQ29uZmlnLCBOZ0dyaWRJdGVtRXZlbnQsIE5nR3JpZEl0ZW1Qb3NpdGlvbiwgTmdHcmlkSXRlbVNpemUsIE5nR3JpZFJhd1Bvc2l0aW9uLCBOZ0dyaWRJdGVtRGltZW5zaW9ucyB9IGZyb20gJy4uL2ludGVyZmFjZXMvSU5nR3JpZCc7XHJcbmltcG9ydCB7IE5nR3JpZEl0ZW0gfSBmcm9tICcuL05nR3JpZEl0ZW0nO1xyXG5pbXBvcnQgeyBOZ0dyaWRQbGFjZWhvbGRlciB9IGZyb20gJy4uL2NvbXBvbmVudHMvTmdHcmlkUGxhY2Vob2xkZXInO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcblx0c2VsZWN0b3I6ICdbbmdHcmlkXScsXHJcblx0aW5wdXRzOiBbJ2NvbmZpZzogbmdHcmlkJ10sXHJcblx0aG9zdDoge1xyXG5cdFx0Jyhtb3VzZWRvd24pJzogJ19vbk1vdXNlRG93bigkZXZlbnQpJyxcclxuXHRcdCcobW91c2Vtb3ZlKSc6ICdfb25Nb3VzZU1vdmUoJGV2ZW50KScsXHJcblx0XHQnKG1vdXNldXApJzogJ19vbk1vdXNlVXAoJGV2ZW50KScsXHJcblx0XHQnKHRvdWNoc3RhcnQpJzogJ19vbk1vdXNlRG93bigkZXZlbnQpJyxcclxuXHRcdCcodG91Y2htb3ZlKSc6ICdfb25Nb3VzZU1vdmUoJGV2ZW50KScsXHJcblx0XHQnKHRvdWNoZW5kKSc6ICdfb25Nb3VzZVVwKCRldmVudCknLFxyXG5cdFx0Jyh3aW5kb3c6cmVzaXplKSc6ICdfb25SZXNpemUoJGV2ZW50KScsXHJcblx0XHQnKGRvY3VtZW50Om1vdXNlbW92ZSknOiAnX29uTW91c2VNb3ZlKCRldmVudCknLFxyXG5cdFx0Jyhkb2N1bWVudDptb3VzZXVwKSc6ICdfb25Nb3VzZVVwKCRldmVudCknXHJcblx0fVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmdHcmlkIGltcGxlbWVudHMgT25Jbml0LCBEb0NoZWNrLCBPbkRlc3Ryb3kge1xyXG5cdC8vXHRFdmVudCBFbWl0dGVyc1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25EcmFnU3RhcnQ6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uRHJhZzogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25EcmFnU3RvcDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25SZXNpemVTdGFydDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25SZXNpemU6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uUmVzaXplU3RvcDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25JdGVtQ2hhbmdlOiBFdmVudEVtaXR0ZXI8QXJyYXk8TmdHcmlkSXRlbUV2ZW50Pj4gPSBuZXcgRXZlbnRFbWl0dGVyPEFycmF5PE5nR3JpZEl0ZW1FdmVudD4+KCk7XHJcblxyXG5cdC8vXHRQdWJsaWMgdmFyaWFibGVzXHJcblx0cHVibGljIGNvbFdpZHRoOiBudW1iZXIgPSAyNTA7XHJcblx0cHVibGljIHJvd0hlaWdodDogbnVtYmVyID0gMjUwO1xyXG5cdHB1YmxpYyBtaW5Db2xzOiBudW1iZXIgPSAxO1xyXG5cdHB1YmxpYyBtaW5Sb3dzOiBudW1iZXIgPSAxO1xyXG5cdHB1YmxpYyBtYXJnaW5Ub3A6IG51bWJlciA9IDEwO1xyXG5cdHB1YmxpYyBtYXJnaW5SaWdodDogbnVtYmVyID0gMTA7XHJcblx0cHVibGljIG1hcmdpbkJvdHRvbTogbnVtYmVyID0gMTA7XHJcblx0cHVibGljIG1hcmdpbkxlZnQ6IG51bWJlciA9IDEwO1xyXG5cdHB1YmxpYyBpc0RyYWdnaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHVibGljIGlzUmVzaXppbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwdWJsaWMgYXV0b1N0eWxlOiBib29sZWFuID0gdHJ1ZTtcclxuXHRwdWJsaWMgcmVzaXplRW5hYmxlOiBib29sZWFuID0gdHJ1ZTtcclxuXHRwdWJsaWMgZHJhZ0VuYWJsZTogYm9vbGVhbiA9IHRydWU7XHJcblx0cHVibGljIGNhc2NhZGU6IHN0cmluZyA9ICd1cCc7XHJcblx0cHVibGljIG1pbldpZHRoOiBudW1iZXIgPSAxMDA7XHJcblx0cHVibGljIG1pbkhlaWdodDogbnVtYmVyID0gMTAwO1xyXG5cclxuXHQvL1x0UHJpdmF0ZSB2YXJpYWJsZXNcclxuXHRwcml2YXRlIF9pdGVtczogQXJyYXk8TmdHcmlkSXRlbT4gPSBbXTtcclxuXHRwcml2YXRlIF9kcmFnZ2luZ0l0ZW06IE5nR3JpZEl0ZW0gPSBudWxsO1xyXG5cdHByaXZhdGUgX3Jlc2l6aW5nSXRlbTogTmdHcmlkSXRlbSA9IG51bGw7XHJcblx0cHJpdmF0ZSBfcmVzaXplRGlyZWN0aW9uOiBzdHJpbmcgPSBudWxsO1xyXG5cdHByaXZhdGUgX2l0ZW1HcmlkOiB7IFtrZXk6IG51bWJlcl06IHsgW2tleTogbnVtYmVyXTogTmdHcmlkSXRlbSB9IH0gPSB7IDE6IHsgMTogbnVsbCB9IH07XHJcblx0cHJpdmF0ZSBfY29udGFpbmVyV2lkdGg6IG51bWJlcjtcclxuXHRwcml2YXRlIF9jb250YWluZXJIZWlnaHQ6IG51bWJlcjtcclxuXHRwcml2YXRlIF9tYXhDb2xzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX21heFJvd3M6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfdmlzaWJsZUNvbHM6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfdmlzaWJsZVJvd3M6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfc2V0V2lkdGg6IG51bWJlciA9IDI1MDtcclxuXHRwcml2YXRlIF9zZXRIZWlnaHQ6IG51bWJlciA9IDI1MDtcclxuXHRwcml2YXRlIF9wb3NPZmZzZXQ6IE5nR3JpZFJhd1Bvc2l0aW9uID0gbnVsbDtcclxuXHRwcml2YXRlIF9hZGRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9wbGFjZWhvbGRlclJlZjogQ29tcG9uZW50UmVmPE5nR3JpZFBsYWNlaG9sZGVyPiA9IG51bGw7XHJcblx0cHJpdmF0ZSBfZml4VG9HcmlkOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfYXV0b1Jlc2l6ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX2RpZmZlcjogS2V5VmFsdWVEaWZmZXI7XHJcblx0cHJpdmF0ZSBfZGVzdHJveWVkOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfbWFpbnRhaW5SYXRpbzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX2FzcGVjdFJhdGlvOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfcHJlZmVyTmV3OiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfem9vbU9uRHJhZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX2xpbWl0VG9TY3JlZW46IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9jdXJNYXhSb3c6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfY3VyTWF4Q29sOiBudW1iZXIgPSAwO1xyXG5cclxuXHQvL1x0RGVmYXVsdCBjb25maWdcclxuXHRwcml2YXRlIHN0YXRpYyBDT05TVF9ERUZBVUxUX0NPTkZJRzogTmdHcmlkQ29uZmlnID0ge1xyXG5cdFx0bWFyZ2luczogWzEwXSxcclxuXHRcdGRyYWdnYWJsZTogdHJ1ZSxcclxuXHRcdHJlc2l6YWJsZTogdHJ1ZSxcclxuXHRcdG1heF9jb2xzOiAwLFxyXG5cdFx0bWF4X3Jvd3M6IDAsXHJcblx0XHR2aXNpYmxlX2NvbHM6IDAsXHJcblx0XHR2aXNpYmxlX3Jvd3M6IDAsXHJcblx0XHRjb2xfd2lkdGg6IDI1MCxcclxuXHRcdHJvd19oZWlnaHQ6IDI1MCxcclxuXHRcdGNhc2NhZGU6ICd1cCcsXHJcblx0XHRtaW5fd2lkdGg6IDEwMCxcclxuXHRcdG1pbl9oZWlnaHQ6IDEwMCxcclxuXHRcdGZpeF90b19ncmlkOiBmYWxzZSxcclxuXHRcdGF1dG9fc3R5bGU6IHRydWUsXHJcblx0XHRhdXRvX3Jlc2l6ZTogZmFsc2UsXHJcblx0XHRtYWludGFpbl9yYXRpbzogZmFsc2UsXHJcblx0XHRwcmVmZXJfbmV3OiBmYWxzZSxcclxuXHRcdHpvb21fb25fZHJhZzogZmFsc2VcclxuXHR9O1xyXG5cdHByaXZhdGUgX2NvbmZpZyA9IE5nR3JpZC5DT05TVF9ERUZBVUxUX0NPTkZJRztcclxuXHJcblx0Ly9cdFtuZy1ncmlkXSBhdHRyaWJ1dGUgaGFuZGxlclxyXG5cdHNldCBjb25maWcodjogTmdHcmlkQ29uZmlnKSB7XHJcblx0XHR0aGlzLnNldENvbmZpZyh2KTtcclxuXHJcblx0XHRpZiAodGhpcy5fZGlmZmVyID09IG51bGwgJiYgdiAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX2RpZmZlciA9IHRoaXMuX2RpZmZlcnMuZmluZCh0aGlzLl9jb25maWcpLmNyZWF0ZShudWxsKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vXHRDb25zdHJ1Y3RvclxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgX2RpZmZlcnM6IEtleVZhbHVlRGlmZmVycywgcHJpdmF0ZSBfbmdFbDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyLCBwcml2YXRlIF9sb2FkZXI6IER5bmFtaWNDb21wb25lbnRMb2FkZXIsIHByaXZhdGUgX2NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikgeyB9XHJcblxyXG5cdC8vXHRQdWJsaWMgbWV0aG9kc1xyXG5cdHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdncmlkJywgdHJ1ZSk7XHJcblx0XHRpZiAodGhpcy5hdXRvU3R5bGUpIHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xyXG5cdFx0dGhpcy5zZXRDb25maWcodGhpcy5fY29uZmlnKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2Rlc3Ryb3llZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0Q29uZmlnKGNvbmZpZzogTmdHcmlkQ29uZmlnKTogdm9pZCB7XHJcblx0XHR0aGlzLl9jb25maWcgPSBjb25maWc7XHJcblxyXG5cdFx0dmFyIG1heENvbFJvd0NoYW5nZWQgPSBmYWxzZTtcclxuXHRcdGZvciAodmFyIHggaW4gY29uZmlnKSB7XHJcblx0XHRcdHZhciB2YWwgPSBjb25maWdbeF07XHJcblx0XHRcdHZhciBpbnRWYWwgPSAhdmFsID8gMCA6IHBhcnNlSW50KHZhbCk7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKHgpIHtcclxuXHRcdFx0XHRjYXNlICdtYXJnaW5zJzpcclxuXHRcdFx0XHRcdHRoaXMuc2V0TWFyZ2lucyh2YWwpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnY29sX3dpZHRoJzpcclxuXHRcdFx0XHRcdHRoaXMuY29sV2lkdGggPSBNYXRoLm1heChpbnRWYWwsIDEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAncm93X2hlaWdodCc6XHJcblx0XHRcdFx0XHR0aGlzLnJvd0hlaWdodCA9IE1hdGgubWF4KGludFZhbCwgMSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdhdXRvX3N0eWxlJzpcclxuXHRcdFx0XHRcdHRoaXMuYXV0b1N0eWxlID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnYXV0b19yZXNpemUnOlxyXG5cdFx0XHRcdFx0dGhpcy5fYXV0b1Jlc2l6ZSA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2RyYWdnYWJsZSc6XHJcblx0XHRcdFx0XHR0aGlzLmRyYWdFbmFibGUgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdyZXNpemFibGUnOlxyXG5cdFx0XHRcdFx0dGhpcy5yZXNpemVFbmFibGUgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdtYXhfcm93cyc6XHJcblx0XHRcdFx0XHRtYXhDb2xSb3dDaGFuZ2VkID0gbWF4Q29sUm93Q2hhbmdlZCB8fCB0aGlzLl9tYXhSb3dzICE9IGludFZhbDtcclxuXHRcdFx0XHRcdHRoaXMuX21heFJvd3MgPSBpbnRWYWwgPCAwID8gMCA6IGludFZhbDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21heF9jb2xzJzpcclxuXHRcdFx0XHRcdG1heENvbFJvd0NoYW5nZWQgPSBtYXhDb2xSb3dDaGFuZ2VkIHx8IHRoaXMuX21heENvbHMgIT0gaW50VmFsO1xyXG5cdFx0XHRcdFx0dGhpcy5fbWF4Q29scyA9IGludFZhbCA8IDAgPyAwIDogaW50VmFsO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAndmlzaWJsZV9yb3dzJzpcclxuXHRcdFx0XHRcdHRoaXMuX3Zpc2libGVSb3dzID0gTWF0aC5tYXgoaW50VmFsLCAwKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3Zpc2libGVfY29scyc6XHJcblx0XHRcdFx0XHR0aGlzLl92aXNpYmxlQ29scyA9IE1hdGgubWF4KGludFZhbCwgMCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdtaW5fcm93cyc6XHJcblx0XHRcdFx0XHR0aGlzLm1pblJvd3MgPSBNYXRoLm1heChpbnRWYWwsIDEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbWluX2NvbHMnOlxyXG5cdFx0XHRcdFx0dGhpcy5taW5Db2xzID0gTWF0aC5tYXgoaW50VmFsLCAxKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21pbl9oZWlnaHQnOlxyXG5cdFx0XHRcdFx0dGhpcy5taW5IZWlnaHQgPSBNYXRoLm1heChpbnRWYWwsIDEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbWluX3dpZHRoJzpcclxuXHRcdFx0XHRcdHRoaXMubWluV2lkdGggPSBNYXRoLm1heChpbnRWYWwsIDEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnem9vbV9vbl9kcmFnJzpcclxuXHRcdFx0XHRcdHRoaXMuX3pvb21PbkRyYWcgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdjYXNjYWRlJzpcclxuXHRcdFx0XHRcdGlmICh0aGlzLmNhc2NhZGUgIT0gdmFsKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY2FzY2FkZSA9IHZhbDtcclxuXHRcdFx0XHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2ZpeF90b19ncmlkJzpcclxuXHRcdFx0XHRcdHRoaXMuX2ZpeFRvR3JpZCA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21haW50YWluX3JhdGlvJzpcclxuXHRcdFx0XHRcdHRoaXMuX21haW50YWluUmF0aW8gPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdwcmVmZXJfbmV3JzpcclxuXHRcdFx0XHRcdHRoaXMuX3ByZWZlck5ldyA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2xpbWl0X3RvX3NjcmVlbic6XHJcblx0XHRcdFx0XHR0aGlzLl9saW1pdFRvU2NyZWVuID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fbWFpbnRhaW5SYXRpbykge1xyXG5cdFx0XHRpZiAodGhpcy5jb2xXaWR0aCAmJiB0aGlzLnJvd0hlaWdodCkge1xyXG5cdFx0XHRcdHRoaXMuX2FzcGVjdFJhdGlvID0gdGhpcy5jb2xXaWR0aCAvIHRoaXMucm93SGVpZ2h0O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuX21haW50YWluUmF0aW8gPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChtYXhDb2xSb3dDaGFuZ2VkKSB7XHJcblx0XHRcdGlmICh0aGlzLl9tYXhDb2xzID4gMCAmJiB0aGlzLl9tYXhSb3dzID4gMCkge1x0Ly9cdENhbid0IGhhdmUgYm90aCwgcHJpb3JpdGlzZSBvbiBjYXNjYWRlXHJcblx0XHRcdFx0c3dpdGNoICh0aGlzLmNhc2NhZGUpIHtcclxuXHRcdFx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9tYXhDb2xzID0gMDtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd1cCc6XHJcblx0XHRcdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdHRoaXMuX21heFJvd3MgPSAwO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0XHR2YXIgcG9zID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0XHR2YXIgZGltcyA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cclxuXHRcdFx0XHR0aGlzLl9yZW1vdmVGcm9tR3JpZChpdGVtKTtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuX21heENvbHMgPiAwICYmIGRpbXMueCA+IHRoaXMuX21heENvbHMpIHtcclxuXHRcdFx0XHRcdGRpbXMueCA9IHRoaXMuX21heENvbHM7XHJcblx0XHRcdFx0XHRpdGVtLnNldFNpemUoZGltcyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl9tYXhSb3dzID4gMCAmJiBkaW1zLnkgPiB0aGlzLl9tYXhSb3dzKSB7XHJcblx0XHRcdFx0XHRkaW1zLnkgPSB0aGlzLl9tYXhSb3dzO1xyXG5cdFx0XHRcdFx0aXRlbS5zZXRTaXplKGRpbXMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSB8fCAhdGhpcy5faXNXaXRoaW5Cb3VuZHMocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRcdFx0dmFyIG5ld1Bvc2l0aW9uID0gdGhpcy5fZml4R3JpZFBvc2l0aW9uKHBvcywgZGltcyk7XHJcblx0XHRcdFx0XHRpdGVtLnNldEdyaWRQb3NpdGlvbihuZXdQb3NpdGlvbik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLl9hZGRUb0dyaWQoaXRlbSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuX2Nhc2NhZGVHcmlkKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fY2FsY3VsYXRlUm93SGVpZ2h0KCk7XHJcblx0XHR0aGlzLl9jYWxjdWxhdGVDb2xXaWR0aCgpO1xyXG5cclxuXHRcdHZhciBtYXhXaWR0aCA9IHRoaXMuX21heENvbHMgKiB0aGlzLmNvbFdpZHRoO1xyXG5cdFx0dmFyIG1heEhlaWdodCA9IHRoaXMuX21heFJvd3MgKiB0aGlzLnJvd0hlaWdodDtcclxuXHJcblx0XHRpZiAobWF4V2lkdGggPiAwICYmIHRoaXMubWluV2lkdGggPiBtYXhXaWR0aCkgdGhpcy5taW5XaWR0aCA9IDAuNzUgKiB0aGlzLmNvbFdpZHRoO1xyXG5cdFx0aWYgKG1heEhlaWdodCA+IDAgJiYgdGhpcy5taW5IZWlnaHQgPiBtYXhIZWlnaHQpIHRoaXMubWluSGVpZ2h0ID0gMC43NSAqIHRoaXMucm93SGVpZ2h0O1xyXG5cclxuXHRcdGlmICh0aGlzLm1pbldpZHRoID4gdGhpcy5jb2xXaWR0aCkgdGhpcy5taW5Db2xzID0gTWF0aC5tYXgodGhpcy5taW5Db2xzLCBNYXRoLmNlaWwodGhpcy5taW5XaWR0aCAvIHRoaXMuY29sV2lkdGgpKTtcclxuXHRcdGlmICh0aGlzLm1pbkhlaWdodCA+IHRoaXMucm93SGVpZ2h0KSB0aGlzLm1pblJvd3MgPSBNYXRoLm1heCh0aGlzLm1pblJvd3MsIE1hdGguY2VpbCh0aGlzLm1pbkhlaWdodCAvIHRoaXMucm93SGVpZ2h0KSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX21heENvbHMgPiAwICYmIHRoaXMubWluQ29scyA+IHRoaXMuX21heENvbHMpIHRoaXMubWluQ29scyA9IDE7XHJcblx0XHRpZiAodGhpcy5fbWF4Um93cyA+IDAgJiYgdGhpcy5taW5Sb3dzID4gdGhpcy5fbWF4Um93cykgdGhpcy5taW5Sb3dzID0gMTtcclxuXHJcblx0XHR0aGlzLl91cGRhdGVSYXRpbygpO1xyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBpdGVtIG9mIHRoaXMuX2l0ZW1zKSB7XHJcblx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xyXG5cdFx0XHRpdGVtLnNldENhc2NhZGVNb2RlKHRoaXMuY2FzY2FkZSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuX3VwZGF0ZUxpbWl0KCk7XHJcblx0XHRcclxuXHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0aXRlbS5yZWNhbGN1bGF0ZVNlbGYoKTtcclxuXHRcdFx0dGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2Nhc2NhZGVHcmlkKCk7XHJcblx0XHR0aGlzLl91cGRhdGVTaXplKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0SXRlbVBvc2l0aW9uKGluZGV4OiBudW1iZXIpOiBOZ0dyaWRJdGVtUG9zaXRpb24ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2l0ZW1zW2luZGV4XS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRJdGVtU2l6ZShpbmRleDogbnVtYmVyKTogTmdHcmlkSXRlbVNpemUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2l0ZW1zW2luZGV4XS5nZXRTaXplKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgbmdEb0NoZWNrKCk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRoaXMuX2RpZmZlciAhPSBudWxsKSB7XHJcblx0XHRcdHZhciBjaGFuZ2VzID0gdGhpcy5fZGlmZmVyLmRpZmYodGhpcy5fY29uZmlnKTtcclxuXHJcblx0XHRcdGlmIChjaGFuZ2VzICE9IG51bGwpIHtcclxuXHRcdFx0XHR0aGlzLl9hcHBseUNoYW5nZXMoY2hhbmdlcyk7XHJcblxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldE1hcmdpbnMobWFyZ2luczogQXJyYXk8c3RyaW5nPik6IHZvaWQge1xyXG5cdFx0dGhpcy5tYXJnaW5Ub3AgPSBNYXRoLm1heChwYXJzZUludChtYXJnaW5zWzBdKSwgMCk7XHJcblx0XHR0aGlzLm1hcmdpblJpZ2h0ID0gbWFyZ2lucy5sZW5ndGggPj0gMiA/IE1hdGgubWF4KHBhcnNlSW50KG1hcmdpbnNbMV0pLCAwKSA6IHRoaXMubWFyZ2luVG9wO1xyXG5cdFx0dGhpcy5tYXJnaW5Cb3R0b20gPSBtYXJnaW5zLmxlbmd0aCA+PSAzID8gTWF0aC5tYXgocGFyc2VJbnQobWFyZ2luc1syXSksIDApIDogdGhpcy5tYXJnaW5Ub3A7XHJcblx0XHR0aGlzLm1hcmdpbkJvdHRvbSA9IG1hcmdpbnMubGVuZ3RoID49IDMgPyBNYXRoLm1heChwYXJzZUludChtYXJnaW5zWzJdKSwgMCkgOiB0aGlzLm1hcmdpblRvcDtcclxuXHRcdHRoaXMubWFyZ2luTGVmdCA9IG1hcmdpbnMubGVuZ3RoID49IDQgPyBNYXRoLm1heChwYXJzZUludChtYXJnaW5zWzNdKSwgMCkgOiB0aGlzLm1hcmdpblJpZ2h0O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGVuYWJsZURyYWcoKTogdm9pZCB7XHJcblx0XHR0aGlzLmRyYWdFbmFibGUgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRpc2FibGVEcmFnKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5kcmFnRW5hYmxlID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZW5hYmxlUmVzaXplKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5yZXNpemVFbmFibGUgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRpc2FibGVSZXNpemUoKTogdm9pZCB7XHJcblx0XHR0aGlzLnJlc2l6ZUVuYWJsZSA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFkZEl0ZW0obmdJdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XHJcblx0XHRuZ0l0ZW0uc2V0Q2FzY2FkZU1vZGUodGhpcy5jYXNjYWRlKTtcclxuXHRcdGlmICghdGhpcy5fcHJlZmVyTmV3KSB7XHJcblx0XHRcdHZhciBuZXdQb3MgPSB0aGlzLl9maXhHcmlkUG9zaXRpb24obmdJdGVtLmdldEdyaWRQb3NpdGlvbigpLCBuZ0l0ZW0uZ2V0U2l6ZSgpKTtcclxuXHRcdFx0bmdJdGVtLnNhdmVQb3NpdGlvbihuZXdQb3MpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5faXRlbXMucHVzaChuZ0l0ZW0pO1xyXG5cdFx0dGhpcy5fYWRkVG9HcmlkKG5nSXRlbSk7XHJcblx0XHRuZ0l0ZW0ucmVjYWxjdWxhdGVTZWxmKCk7XHJcblx0XHRuZ0l0ZW0ub25DYXNjYWRlRXZlbnQoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZW1vdmVJdGVtKG5nSXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xyXG5cdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQobmdJdGVtKTtcclxuXHJcblx0XHRmb3IgKGxldCB4OiBudW1iZXIgPSAwOyB4IDwgdGhpcy5faXRlbXMubGVuZ3RoOyB4KyspIHtcclxuXHRcdFx0aWYgKHRoaXMuX2l0ZW1zW3hdID09IG5nSXRlbSkge1xyXG5cdFx0XHRcdHRoaXMuX2l0ZW1zLnNwbGljZSh4LCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLl9kZXN0cm95ZWQpIHJldHVybjtcclxuXHJcblx0XHR0aGlzLl9jYXNjYWRlR3JpZCgpO1xyXG5cdFx0dGhpcy5fdXBkYXRlU2l6ZSgpO1xyXG5cdFx0dGhpcy5faXRlbXMuZm9yRWFjaCgoaXRlbTogTmdHcmlkSXRlbSkgPT4gaXRlbS5yZWNhbGN1bGF0ZVNlbGYoKSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdXBkYXRlSXRlbShuZ0l0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKG5nSXRlbSk7XHJcblx0XHR0aGlzLl9hZGRUb0dyaWQobmdJdGVtKTtcclxuXHRcdHRoaXMuX2Nhc2NhZGVHcmlkKCk7XHJcblx0XHR0aGlzLl91cGRhdGVTaXplKCk7XHJcblx0XHRuZ0l0ZW0ub25DYXNjYWRlRXZlbnQoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB0cmlnZ2VyQ2FzY2FkZSgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2Nhc2NhZGVHcmlkKG51bGwsIG51bGwsIGZhbHNlKTtcclxuXHR9XHJcblxyXG5cdC8vXHRQcml2YXRlIG1ldGhvZHNcclxuXHRwcml2YXRlIF9jYWxjdWxhdGVDb2xXaWR0aCgpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9hdXRvUmVzaXplKSB7XHJcblx0XHRcdGlmICh0aGlzLl9tYXhDb2xzID4gMCB8fCB0aGlzLl92aXNpYmxlQ29scyA+IDApIHtcclxuXHRcdFx0XHR2YXIgbWF4Q29scyA9IHRoaXMuX21heENvbHMgPiAwID8gdGhpcy5fbWF4Q29scyA6IHRoaXMuX3Zpc2libGVDb2xzO1xyXG5cdFx0XHRcdHZhciBtYXhXaWR0aDogbnVtYmVyID0gdGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG5cclxuXHRcdFx0XHR2YXIgY29sV2lkdGg6IG51bWJlciA9IE1hdGguZmxvb3IobWF4V2lkdGggLyBtYXhDb2xzKTtcclxuXHRcdFx0XHRjb2xXaWR0aCAtPSAodGhpcy5tYXJnaW5MZWZ0ICsgdGhpcy5tYXJnaW5SaWdodCk7XHJcblx0XHRcdFx0aWYgKGNvbFdpZHRoID4gMCkgdGhpcy5jb2xXaWR0aCA9IGNvbFdpZHRoO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5jb2xXaWR0aCA8IHRoaXMubWluV2lkdGggfHwgdGhpcy5taW5Db2xzID4gdGhpcy5fY29uZmlnLm1pbl9jb2xzKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1pbkNvbHMgPSBNYXRoLm1heCh0aGlzLl9jb25maWcubWluX2NvbHMsIE1hdGguY2VpbCh0aGlzLm1pbldpZHRoIC8gdGhpcy5jb2xXaWR0aCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfY2FsY3VsYXRlUm93SGVpZ2h0KCk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2F1dG9SZXNpemUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX21heFJvd3MgPiAwIHx8IHRoaXMuX3Zpc2libGVSb3dzID4gMCkge1xyXG5cdFx0XHRcdHZhciBtYXhSb3dzID0gdGhpcy5fbWF4Um93cyA+IDAgPyB0aGlzLl9tYXhSb3dzIDogdGhpcy5fdmlzaWJsZVJvd3M7XHJcblx0XHRcdFx0dmFyIG1heEhlaWdodDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuXHRcdFx0XHR2YXIgcm93SGVpZ2h0OiBudW1iZXIgPSBNYXRoLm1heChNYXRoLmZsb29yKG1heEhlaWdodCAvIG1heFJvd3MpLCB0aGlzLm1pbkhlaWdodCk7XHJcblx0XHRcdFx0cm93SGVpZ2h0IC09ICh0aGlzLm1hcmdpblRvcCArIHRoaXMubWFyZ2luQm90dG9tKTtcclxuXHRcdFx0XHRpZiAocm93SGVpZ2h0ID4gMCkgdGhpcy5yb3dIZWlnaHQgPSByb3dIZWlnaHQ7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLnJvd0hlaWdodCA8IHRoaXMubWluSGVpZ2h0IHx8IHRoaXMubWluUm93cyA+IHRoaXMuX2NvbmZpZy5taW5fcm93cykge1xyXG5cdFx0XHRcdFx0dGhpcy5taW5Sb3dzID0gTWF0aC5tYXgodGhpcy5fY29uZmlnLm1pbl9yb3dzLCBNYXRoLmNlaWwodGhpcy5taW5IZWlnaHQgLyB0aGlzLnJvd0hlaWdodCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfdXBkYXRlUmF0aW8oKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fYXV0b1Jlc2l6ZSAmJiB0aGlzLl9tYWludGFpblJhdGlvKSB7XHJcblx0XHRcdGlmICh0aGlzLl9tYXhDb2xzID4gMCAmJiB0aGlzLl92aXNpYmxlUm93cyA8PSAwKSB7XHJcblx0XHRcdFx0dGhpcy5yb3dIZWlnaHQgPSB0aGlzLmNvbFdpZHRoIC8gdGhpcy5fYXNwZWN0UmF0aW87XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbWF4Um93cyA+IDAgJiYgdGhpcy5fdmlzaWJsZUNvbHMgPD0gMCkge1xyXG5cdFx0XHRcdHRoaXMuY29sV2lkdGggPSB0aGlzLl9hc3BlY3RSYXRpbyAqIHRoaXMucm93SGVpZ2h0O1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX21heENvbHMgPT0gMCAmJiB0aGlzLl9tYXhSb3dzID09IDApIHtcclxuXHRcdFx0XHRpZiAodGhpcy5fdmlzaWJsZUNvbHMgPiAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLnJvd0hlaWdodCA9IHRoaXMuY29sV2lkdGggLyB0aGlzLl9hc3BlY3RSYXRpbztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHRoaXMuX3Zpc2libGVSb3dzID4gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jb2xXaWR0aCA9IHRoaXMuX2FzcGVjdFJhdGlvICogdGhpcy5yb3dIZWlnaHQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX3VwZGF0ZUxpbWl0KCk6IHZvaWQge1xyXG5cdFx0aWYgKCF0aGlzLl9hdXRvUmVzaXplICYmIHRoaXMuX2xpbWl0VG9TY3JlZW4pIHtcclxuXHRcdFx0dGhpcy5fbGltaXRHcmlkKHRoaXMuX2dldENvbnRhaW5lckNvbHVtbnMoKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX29uUmVzaXplKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0dGhpcy5fY2FsY3VsYXRlQ29sV2lkdGgoKTtcclxuXHRcdHRoaXMuX2NhbGN1bGF0ZVJvd0hlaWdodCgpO1xyXG5cclxuXHRcdHRoaXMuX3VwZGF0ZVJhdGlvKCk7XHJcblx0XHRcclxuXHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuX3VwZGF0ZUxpbWl0KCk7XHJcblx0XHRcclxuXHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0dGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xyXG5cdFx0XHRpdGVtLnJlY2FsY3VsYXRlU2VsZigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2Nhc2NhZGVHcmlkKG51bGwsIG51bGwsIGZhbHNlKTtcclxuXHRcdHRoaXMuX3VwZGF0ZVNpemUoKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2FwcGx5Q2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcclxuXHRcdGNoYW5nZXMuZm9yRWFjaEFkZGVkSXRlbSgocmVjb3JkOiBhbnkpID0+IHsgdGhpcy5fY29uZmlnW3JlY29yZC5rZXldID0gcmVjb3JkLmN1cnJlbnRWYWx1ZTsgfSk7XHJcblx0XHRjaGFuZ2VzLmZvckVhY2hDaGFuZ2VkSXRlbSgocmVjb3JkOiBhbnkpID0+IHsgdGhpcy5fY29uZmlnW3JlY29yZC5rZXldID0gcmVjb3JkLmN1cnJlbnRWYWx1ZTsgfSk7XHJcblx0XHRjaGFuZ2VzLmZvckVhY2hSZW1vdmVkSXRlbSgocmVjb3JkOiBhbnkpID0+IHsgZGVsZXRlIHRoaXMuX2NvbmZpZ1tyZWNvcmQua2V5XTsgfSk7XHJcblxyXG5cdFx0dGhpcy5zZXRDb25maWcodGhpcy5fY29uZmlnKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX29uTW91c2VEb3duKGU6IGFueSk6IGJvb2xlYW4ge1xyXG5cdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHRcdHZhciBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21Qb3NpdGlvbihtb3VzZVBvcyk7XHJcblxyXG5cdFx0aWYgKGl0ZW0gIT0gbnVsbCkge1xyXG5cdFx0XHRpZiAodGhpcy5yZXNpemVFbmFibGUgJiYgaXRlbS5jYW5SZXNpemUoZSkgIT0gbnVsbCkge1xyXG5cdFx0XHRcdHRoaXMuX3Jlc2l6ZVN0YXJ0KGUpO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLmRyYWdFbmFibGUgJiYgaXRlbS5jYW5EcmFnKGUpKSB7XHJcblx0XHRcdFx0dGhpcy5fZHJhZ1N0YXJ0KGUpO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfcmVzaXplU3RhcnQoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5yZXNpemVFbmFibGUpIHtcclxuXHRcdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzLl9nZXRJdGVtRnJvbVBvc2l0aW9uKG1vdXNlUG9zKTtcclxuXHJcblx0XHRcdGl0ZW0uc3RhcnRNb3ZpbmcoKTtcclxuXHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtID0gaXRlbTtcclxuXHRcdFx0dGhpcy5fcmVzaXplRGlyZWN0aW9uID0gaXRlbS5jYW5SZXNpemUoZSk7XHJcblx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xyXG5cdFx0XHR0aGlzLl9jcmVhdGVQbGFjZWhvbGRlcihpdGVtKTtcclxuXHRcdFx0dGhpcy5pc1Jlc2l6aW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdHRoaXMub25SZXNpemVTdGFydC5lbWl0KGl0ZW0pO1xyXG5cdFx0XHRpdGVtLm9uUmVzaXplU3RhcnRFdmVudCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZHJhZ1N0YXJ0KGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuZHJhZ0VuYWJsZSkge1xyXG5cdFx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tUG9zaXRpb24obW91c2VQb3MpO1xyXG5cdFx0XHR2YXIgaXRlbVBvcyA9IGl0ZW0uZ2V0UG9zaXRpb24oKTtcclxuXHRcdFx0dmFyIHBPZmZzZXQgPSB7ICdsZWZ0JzogKG1vdXNlUG9zLmxlZnQgLSBpdGVtUG9zLmxlZnQpLCAndG9wJzogKG1vdXNlUG9zLnRvcCAtIGl0ZW1Qb3MudG9wKSB9XHJcblxyXG5cdFx0XHRpdGVtLnN0YXJ0TW92aW5nKCk7XHJcblx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbSA9IGl0ZW07XHJcblx0XHRcdHRoaXMuX3Bvc09mZnNldCA9IHBPZmZzZXQ7XHJcblx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xyXG5cdFx0XHR0aGlzLl9jcmVhdGVQbGFjZWhvbGRlcihpdGVtKTtcclxuXHRcdFx0dGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdHRoaXMub25EcmFnU3RhcnQuZW1pdChpdGVtKTtcclxuXHRcdFx0aXRlbS5vbkRyYWdTdGFydEV2ZW50KCk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAodGhpcy5fem9vbU9uRHJhZykge1xyXG5cdFx0XHRcdHRoaXMuX3pvb21PdXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRwcml2YXRlIF96b29tT3V0KCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3RyYW5zZm9ybScsICdzY2FsZSgwLjUsIDAuNSknKTtcclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfcmVzZXRab29tKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3RyYW5zZm9ybScsICcnKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX29uTW91c2VNb3ZlKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKGUuYnV0dG9ucyA9PSAwICYmIHRoaXMuaXNEcmFnZ2luZykge1xyXG5cdFx0XHR0aGlzLl9kcmFnU3RvcChlKTtcclxuXHRcdH0gZWxzZSBpZiAoZS5idXR0b25zID09IDAgJiYgdGhpcy5pc1Jlc2l6aW5nKSB7XHJcblx0XHRcdHRoaXMuX3Jlc2l6ZVN0b3AoZSk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG5cdFx0XHR0aGlzLl9kcmFnKGUpO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmlzUmVzaXppbmcpIHtcclxuXHRcdFx0dGhpcy5fcmVzaXplKGUpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzLl9nZXRJdGVtRnJvbVBvc2l0aW9uKG1vdXNlUG9zKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmIChpdGVtKSB7XHJcblx0XHRcdFx0aXRlbS5vbk1vdXNlTW92ZShlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZHJhZyhlOiBhbnkpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcclxuXHRcdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHRcdFx0dmFyIG5ld0wgPSAobW91c2VQb3MubGVmdCAtIHRoaXMuX3Bvc09mZnNldC5sZWZ0KTtcclxuXHRcdFx0dmFyIG5ld1QgPSAobW91c2VQb3MudG9wIC0gdGhpcy5fcG9zT2Zmc2V0LnRvcCk7XHJcblxyXG5cdFx0XHR2YXIgaXRlbVBvcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0dmFyIGdyaWRQb3MgPSB0aGlzLl9jYWxjdWxhdGVHcmlkUG9zaXRpb24obmV3TCwgbmV3VCk7XHJcblx0XHRcdHZhciBkaW1zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldFNpemUoKTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNYKGdyaWRQb3MsIGRpbXMpKVxyXG5cdFx0XHRcdGdyaWRQb3MuY29sID0gdGhpcy5fbWF4Q29scyAtIChkaW1zLnggLSAxKTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKGdyaWRQb3MsIGRpbXMpKVxyXG5cdFx0XHRcdGdyaWRQb3Mucm93ID0gdGhpcy5fbWF4Um93cyAtIChkaW1zLnkgLSAxKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICghdGhpcy5fYXV0b1Jlc2l6ZSAmJiB0aGlzLl9saW1pdFRvU2NyZWVuKSB7XHJcblx0XHRcdFx0aWYgKChncmlkUG9zLmNvbCArIGRpbXMueCAtIDEpID4gdGhpcy5fZ2V0Q29udGFpbmVyQ29sdW1ucygpKSB7XHJcblx0XHRcdFx0XHRncmlkUG9zLmNvbCA9IHRoaXMuX2dldENvbnRhaW5lckNvbHVtbnMoKSAtIChkaW1zLnggLSAxKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChncmlkUG9zLmNvbCAhPSBpdGVtUG9zLmNvbCB8fCBncmlkUG9zLnJvdyAhPSBpdGVtUG9zLnJvdykge1xyXG5cdFx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbS5zZXRHcmlkUG9zaXRpb24oZ3JpZFBvcywgdGhpcy5fZml4VG9HcmlkKTtcclxuXHRcdFx0XHR0aGlzLl9wbGFjZWhvbGRlclJlZi5pbnN0YW5jZS5zZXRHcmlkUG9zaXRpb24oZ3JpZFBvcyk7XHJcblxyXG5cdFx0XHRcdGlmIChbJ3VwJywgJ2Rvd24nLCAnbGVmdCcsICdyaWdodCddLmluZGV4T2YodGhpcy5jYXNjYWRlKSA+PSAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLl9maXhHcmlkQ29sbGlzaW9ucyhncmlkUG9zLCBkaW1zKTtcclxuXHRcdFx0XHRcdHRoaXMuX2Nhc2NhZGVHcmlkKGdyaWRQb3MsIGRpbXMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIXRoaXMuX2ZpeFRvR3JpZCkge1xyXG5cdFx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbS5zZXRQb3NpdGlvbihuZXdMLCBuZXdUKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5vbkRyYWcuZW1pdCh0aGlzLl9kcmFnZ2luZ0l0ZW0pO1xyXG5cdFx0XHR0aGlzLl9kcmFnZ2luZ0l0ZW0ub25EcmFnRXZlbnQoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3Jlc2l6ZShlOiBhbnkpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmlzUmVzaXppbmcpIHtcclxuXHRcdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHRcdFx0dmFyIGl0ZW1Qb3MgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0UG9zaXRpb24oKTtcclxuXHRcdFx0dmFyIGl0ZW1EaW1zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldERpbWVuc2lvbnMoKTtcclxuXHRcdFx0dmFyIG5ld1cgPSB0aGlzLl9yZXNpemVEaXJlY3Rpb24gPT0gJ2hlaWdodCcgPyBpdGVtRGltcy53aWR0aCA6IChtb3VzZVBvcy5sZWZ0IC0gaXRlbVBvcy5sZWZ0ICsgMTApO1xyXG5cdFx0XHR2YXIgbmV3SCA9IHRoaXMuX3Jlc2l6ZURpcmVjdGlvbiA9PSAnd2lkdGgnID8gaXRlbURpbXMuaGVpZ2h0IDogKG1vdXNlUG9zLnRvcCAtIGl0ZW1Qb3MudG9wICsgMTApO1xyXG5cclxuXHRcdFx0aWYgKG5ld1cgPCB0aGlzLm1pbldpZHRoKVxyXG5cdFx0XHRcdG5ld1cgPSB0aGlzLm1pbldpZHRoO1xyXG5cdFx0XHRpZiAobmV3SCA8IHRoaXMubWluSGVpZ2h0KVxyXG5cdFx0XHRcdG5ld0ggPSB0aGlzLm1pbkhlaWdodDtcclxuXHJcblx0XHRcdHZhciBjYWxjU2l6ZSA9IHRoaXMuX2NhbGN1bGF0ZUdyaWRTaXplKG5ld1csIG5ld0gpO1xyXG5cdFx0XHR2YXIgaXRlbVNpemUgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0U2l6ZSgpO1xyXG5cdFx0XHR2YXIgaUdyaWRQb3MgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWChpR3JpZFBvcywgY2FsY1NpemUpKVxyXG5cdFx0XHRcdGNhbGNTaXplLnggPSAodGhpcy5fbWF4Q29scyAtIGlHcmlkUG9zLmNvbCkgKyAxO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koaUdyaWRQb3MsIGNhbGNTaXplKSlcclxuXHRcdFx0XHRjYWxjU2l6ZS55ID0gKHRoaXMuX21heFJvd3MgLSBpR3JpZFBvcy5yb3cpICsgMTtcclxuXHJcblx0XHRcdGNhbGNTaXplID0gdGhpcy5fcmVzaXppbmdJdGVtLmZpeFJlc2l6ZShjYWxjU2l6ZSk7XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoY2FsY1NpemUueCAhPSBpdGVtU2l6ZS54IHx8IGNhbGNTaXplLnkgIT0gaXRlbVNpemUueSkge1xyXG5cdFx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbS5zZXRTaXplKGNhbGNTaXplLCBmYWxzZSk7XHJcblx0XHRcdFx0dGhpcy5fcGxhY2Vob2xkZXJSZWYuaW5zdGFuY2Uuc2V0U2l6ZShjYWxjU2l6ZSk7XHJcblxyXG5cdFx0XHRcdGlmIChbJ3VwJywgJ2Rvd24nLCAnbGVmdCcsICdyaWdodCddLmluZGV4T2YodGhpcy5jYXNjYWRlKSA+PSAwKSB7XHJcblx0XHRcdFx0XHR0aGlzLl9maXhHcmlkQ29sbGlzaW9ucyhpR3JpZFBvcywgY2FsY1NpemUpO1xyXG5cdFx0XHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoaUdyaWRQb3MsIGNhbGNTaXplKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghdGhpcy5fZml4VG9HcmlkKVxyXG5cdFx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbS5zZXREaW1lbnNpb25zKG5ld1csIG5ld0gpO1xyXG5cclxuXHRcdFx0dmFyIGJpZ0dyaWQgPSB0aGlzLl9tYXhHcmlkU2l6ZShpdGVtUG9zLmxlZnQgKyBuZXdXICsgKDIgKiBlLm1vdmVtZW50WCksIGl0ZW1Qb3MudG9wICsgbmV3SCArICgyICogZS5tb3ZlbWVudFkpKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl9yZXNpemVEaXJlY3Rpb24gPT0gJ2hlaWdodCcpIGJpZ0dyaWQueCA9IGlHcmlkUG9zLmNvbCArIGl0ZW1TaXplLng7XHJcblx0XHRcdGlmICh0aGlzLl9yZXNpemVEaXJlY3Rpb24gPT0gJ3dpZHRoJykgYmlnR3JpZC55ID0gaUdyaWRQb3Mucm93ICsgaXRlbVNpemUueTtcclxuXHJcblx0XHRcdHRoaXMub25SZXNpemUuZW1pdCh0aGlzLl9yZXNpemluZ0l0ZW0pO1xyXG5cdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0ub25SZXNpemVFdmVudCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25Nb3VzZVVwKGU6IGFueSk6IGJvb2xlYW4ge1xyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG5cdFx0XHR0aGlzLl9kcmFnU3RvcChlKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmlzUmVzaXppbmcpIHtcclxuXHRcdFx0dGhpcy5fcmVzaXplU3RvcChlKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZHJhZ1N0b3AoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5pc0RyYWdnaW5nKSB7XHJcblx0XHRcdHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xyXG5cclxuXHRcdFx0dmFyIGl0ZW1Qb3MgPSB0aGlzLl9kcmFnZ2luZ0l0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblxyXG5cdFx0XHR0aGlzLl9kcmFnZ2luZ0l0ZW0uc2F2ZVBvc2l0aW9uKGl0ZW1Qb3MpO1xyXG5cdFx0XHR0aGlzLl9hZGRUb0dyaWQodGhpcy5fZHJhZ2dpbmdJdGVtKTtcclxuXHJcblx0XHRcdHRoaXMuX2Nhc2NhZGVHcmlkKCk7XHJcblxyXG5cdFx0XHR0aGlzLl9kcmFnZ2luZ0l0ZW0uc3RvcE1vdmluZygpO1xyXG5cdFx0XHR0aGlzLl9kcmFnZ2luZ0l0ZW0ub25EcmFnU3RvcEV2ZW50KCk7XHJcblx0XHRcdHRoaXMub25EcmFnU3RvcC5lbWl0KHRoaXMuX2RyYWdnaW5nSXRlbSk7XHJcblx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbSA9IG51bGw7XHJcblx0XHRcdHRoaXMuX3Bvc09mZnNldCA9IG51bGw7XHJcblx0XHRcdHRoaXMuX3BsYWNlaG9sZGVyUmVmLmRlc3Ryb3koKTtcclxuXHJcblx0XHRcdHRoaXMub25JdGVtQ2hhbmdlLmVtaXQodGhpcy5faXRlbXMubWFwKChpdGVtOiBOZ0dyaWRJdGVtKSA9PiBpdGVtLmdldEV2ZW50T3V0cHV0KCkpKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl96b29tT25EcmFnKSB7XHJcblx0XHRcdFx0dGhpcy5fcmVzZXRab29tKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3Jlc2l6ZVN0b3AoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5pc1Jlc2l6aW5nKSB7XHJcblx0XHRcdHRoaXMuaXNSZXNpemluZyA9IGZhbHNlO1xyXG5cclxuXHRcdFx0dmFyIGl0ZW1EaW1zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldFNpemUoKTtcclxuXHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbS5zZXRTaXplKGl0ZW1EaW1zKTtcclxuXHRcdFx0dGhpcy5fYWRkVG9HcmlkKHRoaXMuX3Jlc2l6aW5nSXRlbSk7XHJcblxyXG5cdFx0XHR0aGlzLl9jYXNjYWRlR3JpZCgpO1xyXG5cclxuXHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtLnN0b3BNb3ZpbmcoKTtcclxuXHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtLm9uUmVzaXplU3RvcEV2ZW50KCk7XHJcblx0XHRcdHRoaXMub25SZXNpemVTdG9wLmVtaXQodGhpcy5fcmVzaXppbmdJdGVtKTtcclxuXHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtID0gbnVsbDtcclxuXHRcdFx0dGhpcy5fcmVzaXplRGlyZWN0aW9uID0gbnVsbDtcclxuXHRcdFx0dGhpcy5fcGxhY2Vob2xkZXJSZWYuZGVzdHJveSgpO1xyXG5cclxuXHRcdFx0dGhpcy5vbkl0ZW1DaGFuZ2UuZW1pdCh0aGlzLl9pdGVtcy5tYXAoKGl0ZW06IE5nR3JpZEl0ZW0pID0+IGl0ZW0uZ2V0RXZlbnRPdXRwdXQoKSkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfbWF4R3JpZFNpemUodzogbnVtYmVyLCBoOiBudW1iZXIpOiBOZ0dyaWRJdGVtU2l6ZSB7XHJcblx0XHR2YXIgc2l6ZXggPSBNYXRoLmNlaWwodyAvICh0aGlzLmNvbFdpZHRoICsgdGhpcy5tYXJnaW5MZWZ0ICsgdGhpcy5tYXJnaW5SaWdodCkpO1xyXG5cdFx0dmFyIHNpemV5ID0gTWF0aC5jZWlsKGggLyAodGhpcy5yb3dIZWlnaHQgKyB0aGlzLm1hcmdpblRvcCArIHRoaXMubWFyZ2luQm90dG9tKSk7XHJcblx0XHRyZXR1cm4geyAneCc6IHNpemV4LCAneSc6IHNpemV5IH07XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9jYWxjdWxhdGVHcmlkU2l6ZSh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IE5nR3JpZEl0ZW1TaXplIHtcclxuXHRcdHdpZHRoICs9IHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQ7XHJcblx0XHRoZWlnaHQgKz0gdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbTtcclxuXHJcblx0XHR2YXIgc2l6ZXggPSBNYXRoLm1heCh0aGlzLm1pbkNvbHMsIE1hdGgucm91bmQod2lkdGggLyAodGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpKSk7XHJcblx0XHR2YXIgc2l6ZXkgPSBNYXRoLm1heCh0aGlzLm1pblJvd3MsIE1hdGgucm91bmQoaGVpZ2h0IC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWCh7IGNvbDogMSwgcm93OiAxIH0sIHsgeDogc2l6ZXgsIHk6IHNpemV5IH0pKSBzaXpleCA9IHRoaXMuX21heENvbHM7XHJcblx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWSh7IGNvbDogMSwgcm93OiAxIH0sIHsgeDogc2l6ZXgsIHk6IHNpemV5IH0pKSBzaXpleSA9IHRoaXMuX21heFJvd3M7XHJcblxyXG5cdFx0cmV0dXJuIHsgJ3gnOiBzaXpleCwgJ3knOiBzaXpleSB9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfY2FsY3VsYXRlR3JpZFBvc2l0aW9uKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpOiBOZ0dyaWRJdGVtUG9zaXRpb24ge1xyXG5cdFx0dmFyIGNvbCA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQobGVmdCAvICh0aGlzLmNvbFdpZHRoICsgdGhpcy5tYXJnaW5MZWZ0ICsgdGhpcy5tYXJnaW5SaWdodCkpICsgMSk7XHJcblx0XHR2YXIgcm93ID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZCh0b3AgLyAodGhpcy5yb3dIZWlnaHQgKyB0aGlzLm1hcmdpblRvcCArIHRoaXMubWFyZ2luQm90dG9tKSkgKyAxKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWCh7IGNvbDogY29sLCByb3c6IHJvdyB9LCB7IHg6IDEsIHk6IDEgfSkpIGNvbCA9IHRoaXMuX21heENvbHM7XHJcblx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWSh7IGNvbDogY29sLCByb3c6IHJvdyB9LCB7IHg6IDEsIHk6IDEgfSkpIHJvdyA9IHRoaXMuX21heFJvd3M7XHJcblxyXG5cdFx0cmV0dXJuIHsgJ2NvbCc6IGNvbCwgJ3Jvdyc6IHJvdyB9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfaGFzR3JpZENvbGxpc2lvbihwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpOiBib29sZWFuIHtcclxuXHRcdHZhciBwb3NpdGlvbnMgPSB0aGlzLl9nZXRDb2xsaXNpb25zKHBvcywgZGltcyk7XHJcblxyXG5cdFx0aWYgKHBvc2l0aW9ucyA9PSBudWxsIHx8IHBvc2l0aW9ucy5sZW5ndGggPT0gMCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHJldHVybiBwb3NpdGlvbnMuc29tZSgodjogTmdHcmlkSXRlbSkgPT4ge1xyXG5cdFx0XHRyZXR1cm4gISh2ID09PSBudWxsKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0Q29sbGlzaW9ucyhwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpOiBBcnJheTxOZ0dyaWRJdGVtPiB7XHJcblx0XHRjb25zdCByZXR1cm5zOiBBcnJheTxOZ0dyaWRJdGVtPiA9IFtdO1xyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBqOiBudW1iZXIgPSAwOyBqIDwgZGltcy55OyBqKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXSAhPSBudWxsKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGRpbXMueDsgaSsrKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcG9zLnJvdyArIGpdW3Bvcy5jb2wgKyBpXSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGl0ZW06IE5nR3JpZEl0ZW0gPSB0aGlzLl9pdGVtR3JpZFtwb3Mucm93ICsgal1bcG9zLmNvbCArIGldO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYgKHJldHVybnMuaW5kZXhPZihpdGVtKSA8IDApXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJucy5wdXNoKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Y29uc3QgaXRlbVBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgaXRlbURpbXM6IE5nR3JpZEl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRpID0gaXRlbVBvcy5jb2wgKyBpdGVtRGltcy54IC0gcG9zLmNvbDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmV0dXJucztcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2ZpeEdyaWRDb2xsaXNpb25zKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSk6IHZvaWQge1xyXG5cdFx0d2hpbGUgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRjb25zdCBjb2xsaXNpb25zOiBBcnJheTxOZ0dyaWRJdGVtPiA9IHRoaXMuX2dldENvbGxpc2lvbnMocG9zLCBkaW1zKTtcclxuXHJcblx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGNvbGxpc2lvbnNbMF0pO1xyXG5cclxuXHRcdFx0Y29uc3QgaXRlbVBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gY29sbGlzaW9uc1swXS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0Y29uc3QgaXRlbURpbXM6IE5nR3JpZEl0ZW1TaXplID0gY29sbGlzaW9uc1swXS5nZXRTaXplKCk7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKHRoaXMuY2FzY2FkZSkge1xyXG5cdFx0XHRcdGNhc2UgJ3VwJzpcclxuXHRcdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0Y29uc3Qgb2xkUm93OiBudW1iZXIgPSBpdGVtUG9zLnJvdztcclxuXHRcdFx0XHRcdGl0ZW1Qb3Mucm93ID0gcG9zLnJvdyArIGRpbXMueTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koaXRlbVBvcywgaXRlbURpbXMpKSB7XHJcblx0XHRcdFx0XHRcdGl0ZW1Qb3MuY29sID0gcG9zLmNvbCArIGRpbXMueDtcclxuXHRcdFx0XHRcdFx0aXRlbVBvcy5yb3cgPSBvbGRSb3c7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0XHRjYXNlICdyaWdodCc6XHJcblx0XHRcdFx0XHRjb25zdCBvbGRDb2w6IG51bWJlciA9IGl0ZW1Qb3MuY29sO1xyXG5cdFx0XHRcdFx0aXRlbVBvcy5jb2wgPSBwb3MuY29sICsgZGltcy54O1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWChpdGVtUG9zLCBpdGVtRGltcykpIHtcclxuXHRcdFx0XHRcdFx0aXRlbVBvcy5jb2wgPSBvbGRDb2w7XHJcblx0XHRcdFx0XHRcdGl0ZW1Qb3Mucm93ID0gcG9zLnJvdyArIGRpbXMueTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb2xsaXNpb25zWzBdLnNhdmVQb3NpdGlvbihpdGVtUG9zKTtcclxuXHRcdFx0dGhpcy5fZml4R3JpZENvbGxpc2lvbnMoaXRlbVBvcywgaXRlbURpbXMpO1xyXG5cdFx0XHR0aGlzLl9hZGRUb0dyaWQoY29sbGlzaW9uc1swXSk7XHJcblx0XHRcdGNvbGxpc2lvbnNbMF0ub25DYXNjYWRlRXZlbnQoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfbGltaXRHcmlkKG1heENvbHM6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0Y29uc3QgaXRlbXM6IEFycmF5PE5nR3JpZEl0ZW0+ID0gdGhpcy5faXRlbXMuc2xpY2UoKTtcclxuXHRcdFxyXG5cdFx0aXRlbXMuc29ydCgoYTogTmdHcmlkSXRlbSwgYjogTmdHcmlkSXRlbSkgPT4ge1xyXG5cdFx0XHRsZXQgYVBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gYS5nZXRTYXZlZFBvc2l0aW9uKCk7XHJcblx0XHRcdGxldCBiUG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSBiLmdldFNhdmVkUG9zaXRpb24oKTtcclxuXHJcblx0XHRcdGlmIChhUG9zLnJvdyA9PSBiUG9zLnJvdykge1xyXG5cdFx0XHRcdHJldHVybiBhUG9zLmNvbCA9PSBiUG9zLmNvbCA/IDAgOiAoYVBvcy5jb2wgPCBiUG9zLmNvbCA/IC0xIDogMSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIGFQb3Mucm93IDwgYlBvcy5yb3cgPyAtMSA6IDE7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRjb25zdCBjb2x1bW5NYXg6IHsgW2NvbDogbnVtYmVyXTogbnVtYmVyIH0gPSB7fTtcclxuXHRcdGNvbnN0IGxhcmdlc3RHYXA6IHsgW2NvbDogbnVtYmVyXTogbnVtYmVyIH0gPSB7fTtcclxuXHRcdFxyXG5cdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8PSBtYXhDb2xzOyBpKyspIHtcclxuXHRcdFx0Y29sdW1uTWF4W2ldID0gMTtcclxuXHRcdFx0bGFyZ2VzdEdhcFtpXSA9IDE7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGNvbnN0IGN1clBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0geyBjb2w6IDEsIHJvdzogMSB9O1xyXG5cdFx0bGV0IGN1cnJlbnRSb3c6IG51bWJlciA9IDE7XHJcblx0XHRcclxuXHRcdGNvbnN0IHdpbGxDYXNjYWRlOiAoaXRlbTogTmdHcmlkSXRlbSwgY29sOiBudW1iZXIpID0+IGJvb2xlYW4gPSAoaXRlbTogTmdHcmlkSXRlbSwgY29sOiBudW1iZXIpID0+IHtcclxuXHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gY29sOyBpIDwgY29sICsgaXRlbS5zaXpleDsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGNvbHVtbk1heFtpXSA9PSBjdXJyZW50Um93KSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0aW50ZXJmYWNlIEdyaWRCbG9jayB7XHJcblx0XHRcdHN0YXJ0OiBudW1iZXI7XHJcblx0XHRcdGVuZDogbnVtYmVyO1xyXG5cdFx0XHRsZW5ndGg6IG51bWJlcjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0d2hpbGUgKGl0ZW1zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0Y29uc3QgY29sdW1uczogQXJyYXk8R3JpZEJsb2NrPiA9IFtdO1xyXG5cdFx0XHRsZXQgbmV3QmxvY2s6IEdyaWRCbG9jayA9IHtcclxuXHRcdFx0XHRzdGFydDogMSxcclxuXHRcdFx0XHRlbmQ6IDEsXHJcblx0XHRcdFx0bGVuZ3RoOiAwLFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRcclxuXHRcdFx0Zm9yIChsZXQgY29sOiBudW1iZXIgPSAxOyBjb2wgPD0gbWF4Q29sczsgY29sKyspIHtcclxuXHRcdFx0XHRpZiAoY29sdW1uTWF4W2NvbF0gPD0gY3VycmVudFJvdykge1xyXG5cdFx0XHRcdFx0aWYgKG5ld0Jsb2NrLmxlbmd0aCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdG5ld0Jsb2NrLnN0YXJ0ID0gY29sO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRuZXdCbG9jay5sZW5ndGgrKztcclxuXHRcdFx0XHRcdG5ld0Jsb2NrLmVuZCA9IGNvbCArIDE7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChuZXdCbG9jay5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRjb2x1bW5zLnB1c2gobmV3QmxvY2spO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRuZXdCbG9jayA9IHtcclxuXHRcdFx0XHRcdFx0c3RhcnQ6IGNvbCxcclxuXHRcdFx0XHRcdFx0ZW5kOiBjb2wsXHJcblx0XHRcdFx0XHRcdGxlbmd0aDogMCxcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAobmV3QmxvY2subGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNvbHVtbnMucHVzaChuZXdCbG9jayk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGxldCB0ZW1wQ29sdW1uczogQXJyYXk8bnVtYmVyPiA9IGNvbHVtbnMubWFwKChibG9jazogR3JpZEJsb2NrKSA9PiBibG9jay5sZW5ndGgpO1xyXG5cdFx0XHRjb25zdCBjdXJyZW50SXRlbXM6IEFycmF5PE5nR3JpZEl0ZW0+ID0gW107XHJcblx0XHRcdFxyXG5cdFx0XHR3aGlsZSAoaXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNvbnN0IGl0ZW0gPSBpdGVtc1swXTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAoaXRlbS5yb3cgPiBjdXJyZW50Um93KSBicmVhaztcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRsZXQgZml0czogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdFx0XHRcdGZvciAobGV0IHggaW4gdGVtcENvbHVtbnMpIHtcclxuXHRcdFx0XHRcdGlmIChpdGVtLnNpemV4IDw9IHRlbXBDb2x1bW5zW3hdKSB7XHJcblx0XHRcdFx0XHRcdHRlbXBDb2x1bW5zW3hdIC09IGl0ZW0uc2l6ZXg7XHJcblx0XHRcdFx0XHRcdGZpdHMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoaXRlbS5zaXpleCA+IHRlbXBDb2x1bW5zW3hdKSB7XHJcblx0XHRcdFx0XHRcdHRlbXBDb2x1bW5zW3hdID0gMDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKGZpdHMpIHtcclxuXHRcdFx0XHRcdGN1cnJlbnRJdGVtcy5wdXNoKGl0ZW1zLnNoaWZ0KCkpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmIChjdXJyZW50SXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdGNvbnN0IGl0ZW1Qb3NpdGlvbnM6IEFycmF5PG51bWJlcj4gPSBbXTtcclxuXHRcdFx0XHRsZXQgbGFzdFBvc2l0aW9uOiBudW1iZXIgPSBtYXhDb2xzO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGZvciAobGV0IGkgPSBjdXJyZW50SXRlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuXHRcdFx0XHRcdGxldCBtYXhQb3NpdGlvbiA9IDE7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGZvciAobGV0IGogPSBjb2x1bW5zLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XHJcblx0XHRcdFx0XHRcdGlmIChjb2x1bW5zW2pdLnN0YXJ0ID4gbGFzdFBvc2l0aW9uKSBjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbHVtbnNbal0uc3RhcnQgPiAobWF4Q29scyAtIGN1cnJlbnRJdGVtc1tpXS5zaXpleCkpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHRpZiAoY29sdW1uc1tqXS5sZW5ndGggPCBjdXJyZW50SXRlbXNbaV0uc2l6ZXgpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHRpZiAobGFzdFBvc2l0aW9uIDwgY29sdW1uc1tqXS5lbmQgJiYgKGxhc3RQb3NpdGlvbiAtIGNvbHVtbnNbal0uc3RhcnQpIDwgY3VycmVudEl0ZW1zW2ldLnNpemV4KSBjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdG1heFBvc2l0aW9uID0gKGxhc3RQb3NpdGlvbiA8IGNvbHVtbnNbal0uZW5kID8gbGFzdFBvc2l0aW9uIDogY29sdW1uc1tqXS5lbmQpIC0gY3VycmVudEl0ZW1zW2ldLnNpemV4XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpdGVtUG9zaXRpb25zW2ldID0gTWF0aC5taW4obWF4UG9zaXRpb24sIGN1cnJlbnRJdGVtc1tpXS5yb3cgPT0gY3VycmVudFJvdyA/IGN1cnJlbnRJdGVtc1tpXS5jb2wgOiAxKTtcclxuXHRcdFx0XHRcdGxhc3RQb3NpdGlvbiA9IGl0ZW1Qb3NpdGlvbnNbaV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGxldCBtaW5Qb3NpdGlvbjogbnVtYmVyID0gMTtcclxuXHRcdFx0XHRsZXQgY3VycmVudEl0ZW06IG51bWJlciA9IDA7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0d2hpbGUgKGN1cnJlbnRJdGVtcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0XHRjb25zdCBpdGVtOiBOZ0dyaWRJdGVtID0gY3VycmVudEl0ZW1zLnNoaWZ0KCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgY29sdW1ucy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdFx0XHRpZiAobWluUG9zaXRpb24gPiBjb2x1bW5zW2pdLmVuZCkgY29udGludWU7XHJcblx0XHRcdFx0XHRcdGlmIChtaW5Qb3NpdGlvbiA+IGNvbHVtbnNbal0uc3RhcnQgJiYgKGNvbHVtbnNbal0uZW5kIC0gbWluUG9zaXRpb24pIDwgaXRlbS5zaXpleCkgY29udGludWU7XHJcblx0XHRcdFx0XHRcdGlmIChtaW5Qb3NpdGlvbiA8ICBjb2x1bW5zW2pdLnN0YXJ0KSBtaW5Qb3NpdGlvbiA9IGNvbHVtbnNbal0uc3RhcnQ7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpdGVtLnNldEdyaWRQb3NpdGlvbih7IGNvbDogTWF0aC5tYXgobWluUG9zaXRpb24sIGl0ZW1Qb3NpdGlvbnNbY3VycmVudEl0ZW1dKSwgcm93OiBjdXJyZW50Um93IH0pO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRtaW5Qb3NpdGlvbiA9IGl0ZW0uY3VycmVudENvbCArIGl0ZW0uc2l6ZXg7XHJcblx0XHRcdFx0XHRjdXJyZW50SXRlbSsrO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSBpdGVtLmN1cnJlbnRDb2w7IGkgPCBpdGVtLmN1cnJlbnRDb2wgKyBpdGVtLnNpemV4OyBpKyspIHtcclxuXHRcdFx0XHRcdFx0Y29sdW1uTWF4W2ldID0gaXRlbS5jdXJyZW50Um93ICsgaXRlbS5zaXpleTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSBpZiAoY3VycmVudEl0ZW1zLmxlbmd0aCA9PSAwICYmIGNvbHVtbnMubGVuZ3RoID09IDEpIHtcdC8vXHRPbmx5IG9uZSBibG9jaywgYnV0IG5vIGl0ZW1zIGZpdC4gTWVhbnMgdGhlIG5leHQgaXRlbSBpcyB0b28gbGFyZ2VcclxuXHRcdFx0XHRjb25zdCBpdGVtOiBOZ0dyaWRJdGVtID0gaXRlbXMuc2hpZnQoKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpdGVtLnNldEdyaWRQb3NpdGlvbih7IGNvbDogMSwgcm93OiBjdXJyZW50Um93IH0pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IGl0ZW0uY3VycmVudENvbDsgaSA8IGl0ZW0uY3VycmVudENvbCArIGl0ZW0uc2l6ZXg7IGkrKykge1xyXG5cdFx0XHRcdFx0Y29sdW1uTWF4W2ldID0gaXRlbS5jdXJyZW50Um93ICsgaXRlbS5zaXpleTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGxldCBuZXdSb3c6IG51bWJlciA9IDA7XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IgKGxldCB4IGluIGNvbHVtbk1heCkge1xyXG5cdFx0XHRcdGlmIChjb2x1bW5NYXhbeF0gPiBjdXJyZW50Um93ICYmIChuZXdSb3cgPT0gMCB8fCBjb2x1bW5NYXhbeF0gPCBuZXdSb3cpKSB7XHJcblx0XHRcdFx0XHRuZXdSb3cgPSBjb2x1bW5NYXhbeF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRjdXJyZW50Um93ID0gbmV3Um93ID09IDAgPyBjdXJyZW50Um93ICsgMSA6IG5ld1JvdztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2Nhc2NhZGVHcmlkKHBvcz86IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltcz86IE5nR3JpZEl0ZW1TaXplLCBzaG91bGRTYXZlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2Rlc3Ryb3llZCkgcmV0dXJuO1xyXG5cdFx0aWYgKHBvcyAmJiAhZGltcykgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FzY2FkZSB3aXRoIG9ubHkgcG9zaXRpb24gYW5kIG5vdCBkaW1lbnNpb25zJyk7XHJcblxyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLl9kcmFnZ2luZ0l0ZW0gJiYgIXBvcyAmJiAhZGltcykge1xyXG5cdFx0XHRwb3MgPSB0aGlzLl9kcmFnZ2luZ0l0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRcdGRpbXMgPSB0aGlzLl9kcmFnZ2luZ0l0ZW0uZ2V0U2l6ZSgpO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmlzUmVzaXppbmcgJiYgdGhpcy5fcmVzaXppbmdJdGVtICYmICFwb3MgJiYgIWRpbXMpIHtcclxuXHRcdFx0cG9zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdFx0XHRkaW1zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldFNpemUoKTtcclxuXHRcdH1cclxuXHJcblx0XHRzd2l0Y2ggKHRoaXMuY2FzY2FkZSkge1xyXG5cdFx0XHRjYXNlICd1cCc6XHJcblx0XHRcdGNhc2UgJ2Rvd24nOlxyXG5cdFx0XHRcdGNvbnN0IGxvd1JvdzogQXJyYXk8bnVtYmVyPiA9IFswXTtcclxuXHJcblx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8PSB0aGlzLl9jdXJNYXhDb2w7IGkrKylcclxuXHRcdFx0XHRcdGxvd1Jvd1tpXSA9IDE7XHJcblxyXG5cdFx0XHRcdGZvciAobGV0IHI6IG51bWJlciA9IDE7IHIgPD0gdGhpcy5fY3VyTWF4Um93OyByKyspIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXSA9PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdGZvciAobGV0IGM6IG51bWJlciA9IDE7IGMgPD0gdGhpcy5fY3VyTWF4Q29sOyBjKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdID09IHVuZGVmaW5lZCkgYnJlYWs7XHJcblx0XHRcdFx0XHRcdGlmIChyIDwgbG93Um93W2NdKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXVtjXSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbTogTmdHcmlkSXRlbSA9IHRoaXMuX2l0ZW1HcmlkW3JdW2NdO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChpdGVtLmlzRml4ZWQpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtRGltczogTmdHcmlkSXRlbVNpemUgPSBpdGVtLmdldFNpemUoKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtUG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSBpdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbVBvcy5jb2wgIT0gYyB8fCBpdGVtUG9zLnJvdyAhPSByKSBjb250aW51ZTtcdC8vXHRJZiB0aGlzIGlzIG5vdCB0aGUgZWxlbWVudCdzIHN0YXJ0XHJcblxyXG5cdFx0XHRcdFx0XHRcdGxldCBsb3dlc3Q6IG51bWJlciA9IGxvd1Jvd1tjXTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8IGl0ZW1EaW1zLng7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0bG93ZXN0ID0gTWF0aC5tYXgobG93Um93WyhjICsgaSldLCBsb3dlc3QpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKHBvcyAmJiAoYyArIGl0ZW1EaW1zLngpID4gcG9zLmNvbCAmJiBjIDwgKHBvcy5jb2wgKyBkaW1zLngpKSB7ICAgICAgICAgIC8vXHRJZiBvdXIgZWxlbWVudCBpcyBpbiBvbmUgb2YgdGhlIGl0ZW0ncyBjb2x1bW5zXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoKHIgPj0gcG9zLnJvdyAmJiByIDwgKHBvcy5yb3cgKyBkaW1zLnkpKSB8fCAgICAgICAgICAgICAgICAgICAgICAgICAvL1x0SWYgdGhpcyByb3cgaXMgb2NjdXBpZWQgYnkgb3VyIGVsZW1lbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0KChpdGVtRGltcy55ID4gKHBvcy5yb3cgLSBsb3dlc3QpKSAmJiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1x0T3IgdGhlIGl0ZW0gY2FuJ3QgZml0IGFib3ZlIG91ciBlbGVtZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KHIgPj0gKHBvcy5yb3cgKyBkaW1zLnkpICYmIGxvd2VzdCA8IChwb3Mucm93ICsgZGltcy55KSkpKSB7ICAgIC8vXHRcdEFuZCB0aGlzIHJvdyBpcyBiZWxvdyBvdXIgZWxlbWVudCwgYnV0IHdlIGhhdmVuJ3QgY2F1Z2h0IGl0XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxvd2VzdCA9IE1hdGgubWF4KGxvd2VzdCwgcG9zLnJvdyArIGRpbXMueSk7ICAgICAgICAgICAgICAgICAgICAgICAgLy9cdFNldCB0aGUgbG93ZXN0IHJvdyB0byBiZSBiZWxvdyBpdFxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGxvd2VzdCAhPSBpdGVtUG9zLnJvdykge1x0Ly9cdElmIHRoZSBpdGVtIGlzIG5vdCBhbHJlYWR5IG9uIHRoaXMgcm93IG1vdmUgaXQgdXBcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2hvdWxkU2F2ZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpdGVtLnNhdmVQb3NpdGlvbih7IGNvbDogYywgcm93OiBsb3dlc3QgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpdGVtLnNldEdyaWRQb3NpdGlvbih7IGNvbDogYywgcm93OiBsb3dlc3QgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0ub25DYXNjYWRlRXZlbnQoKTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2FkZFRvR3JpZChpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBpdGVtRGltcy54OyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdGxvd1Jvd1tjICsgaV0gPSBsb3dlc3QgKyBpdGVtRGltcy55O1x0Ly9cdFVwZGF0ZSB0aGUgbG93ZXN0IHJvdyB0byBiZSBiZWxvdyB0aGUgaXRlbVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnbGVmdCc6XHJcblx0XHRcdGNhc2UgJ3JpZ2h0JzpcclxuXHRcdFx0XHRjb25zdCBsb3dDb2w6IEFycmF5PG51bWJlcj4gPSBbMF07XHJcblxyXG5cdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDE7IGkgPD0gdGhpcy5fY3VyTWF4Um93OyBpKyspXHJcblx0XHRcdFx0XHRsb3dDb2xbaV0gPSAxO1xyXG5cclxuXHRcdFx0XHRmb3IgKGxldCByOiBudW1iZXIgPSAxOyByIDw9IHRoaXMuX2N1ck1heFJvdzsgcisrKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcl0gPT0gdW5kZWZpbmVkKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRmb3IgKGxldCBjOiBudW1iZXIgPSAxOyBjIDw9IHRoaXMuX2N1ck1heENvbDsgYysrKSB7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXSA9PSB1bmRlZmluZWQpIGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRpZiAoYyA8IGxvd0NvbFtyXSkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcl1bY10gIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW06IE5nR3JpZEl0ZW0gPSB0aGlzLl9pdGVtR3JpZFtyXVtjXTtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtRGltczogTmdHcmlkSXRlbVNpemUgPSBpdGVtLmdldFNpemUoKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtUG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSBpdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAoaXRlbVBvcy5jb2wgIT0gYyB8fCBpdGVtUG9zLnJvdyAhPSByKSBjb250aW51ZTtcdC8vXHRJZiB0aGlzIGlzIG5vdCB0aGUgZWxlbWVudCdzIHN0YXJ0XHJcblxyXG5cdFx0XHRcdFx0XHRcdGxldCBsb3dlc3Q6IG51bWJlciA9IGxvd0NvbFtyXTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8IGl0ZW1EaW1zLnk7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0bG93ZXN0ID0gTWF0aC5tYXgobG93Q29sWyhyICsgaSldLCBsb3dlc3QpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKHBvcyAmJiAociArIGl0ZW1EaW1zLnkpID4gcG9zLnJvdyAmJiByIDwgKHBvcy5yb3cgKyBkaW1zLnkpKSB7ICAgICAgICAgIC8vXHRJZiBvdXIgZWxlbWVudCBpcyBpbiBvbmUgb2YgdGhlIGl0ZW0ncyByb3dzXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoKGMgPj0gcG9zLmNvbCAmJiBjIDwgKHBvcy5jb2wgKyBkaW1zLngpKSB8fCAgICAgICAgICAgICAgICAgICAgICAgICAvL1x0SWYgdGhpcyBjb2wgaXMgb2NjdXBpZWQgYnkgb3VyIGVsZW1lbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0KChpdGVtRGltcy54ID4gKHBvcy5jb2wgLSBsb3dlc3QpKSAmJiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1x0T3IgdGhlIGl0ZW0gY2FuJ3QgZml0IGFib3ZlIG91ciBlbGVtZW50XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0KGMgPj0gKHBvcy5jb2wgKyBkaW1zLngpICYmIGxvd2VzdCA8IChwb3MuY29sICsgZGltcy54KSkpKSB7ICAgIC8vXHRcdEFuZCB0aGlzIGNvbCBpcyBiZWxvdyBvdXIgZWxlbWVudCwgYnV0IHdlIGhhdmVuJ3QgY2F1Z2h0IGl0XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxvd2VzdCA9IE1hdGgubWF4KGxvd2VzdCwgcG9zLmNvbCArIGRpbXMueCk7ICAgICAgICAgICAgICAgICAgICAgICAgLy9cdFNldCB0aGUgbG93ZXN0IGNvbCB0byBiZSBiZWxvdyBpdFxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0aWYgKGxvd2VzdCAhPSBpdGVtUG9zLmNvbCkge1x0Ly9cdElmIHRoZSBpdGVtIGlzIG5vdCBhbHJlYWR5IG9uIHRoaXMgY29sIG1vdmUgaXQgdXBcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoc2hvdWxkU2F2ZSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpdGVtLnNhdmVQb3NpdGlvbih7IGNvbDogYywgcm93OiBsb3dlc3QgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpdGVtLnNldEdyaWRQb3NpdGlvbih7IGNvbDogbG93ZXN0LCByb3c6IHIgfSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdGl0ZW0ub25DYXNjYWRlRXZlbnQoKTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuX2FkZFRvR3JpZChpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBpdGVtRGltcy55OyBpKyspIHtcclxuXHRcdFx0XHRcdFx0XHRcdGxvd0NvbFtyICsgaV0gPSBsb3dlc3QgKyBpdGVtRGltcy54O1x0Ly9cdFVwZGF0ZSB0aGUgbG93ZXN0IGNvbCB0byBiZSBiZWxvdyB0aGUgaXRlbVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2ZpeEdyaWRQb3NpdGlvbihwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpOiBOZ0dyaWRJdGVtUG9zaXRpb24ge1xyXG5cdFx0d2hpbGUgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSB8fCAhdGhpcy5faXNXaXRoaW5Cb3VuZHMocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRpZiAodGhpcy5faGFzR3JpZENvbGxpc2lvbihwb3MsIGRpbXMpKSB7XHJcblx0XHRcdFx0c3dpdGNoICh0aGlzLmNhc2NhZGUpIHtcclxuXHRcdFx0XHRcdGNhc2UgJ3VwJzpcclxuXHRcdFx0XHRcdGNhc2UgJ2Rvd24nOlxyXG5cdFx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdFx0cG9zLnJvdysrO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdFx0XHRwb3MuY29sKys7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKHBvcywgZGltcykpIHtcclxuXHRcdFx0XHRwb3MuY29sKys7XHJcblx0XHRcdFx0cG9zLnJvdyA9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1gocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRcdHBvcy5yb3crKztcclxuXHRcdFx0XHRwb3MuY29sID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBvcztcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2lzV2l0aGluQm91bmRzWChwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpIHtcclxuXHRcdHJldHVybiAodGhpcy5fbWF4Q29scyA9PSAwIHx8IChwb3MuY29sICsgZGltcy54IC0gMSkgPD0gdGhpcy5fbWF4Q29scyk7XHJcblx0fVxyXG5cdHByaXZhdGUgX2lzV2l0aGluQm91bmRzWShwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUpIHtcclxuXHRcdHJldHVybiAodGhpcy5fbWF4Um93cyA9PSAwIHx8IChwb3Mucm93ICsgZGltcy55IC0gMSkgPD0gdGhpcy5fbWF4Um93cyk7XHJcblx0fVxyXG5cdHByaXZhdGUgX2lzV2l0aGluQm91bmRzKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lzV2l0aGluQm91bmRzWChwb3MsIGRpbXMpICYmIHRoaXMuX2lzV2l0aGluQm91bmRzWShwb3MsIGRpbXMpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfYWRkVG9HcmlkKGl0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdGxldCBwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRjb25zdCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9oYXNHcmlkQ29sbGlzaW9uKHBvcywgZGltcykpIHtcclxuXHRcdFx0dGhpcy5fZml4R3JpZENvbGxpc2lvbnMocG9zLCBkaW1zKTtcclxuXHRcdFx0cG9zID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBqOiBudW1iZXIgPSAwOyBqIDwgZGltcy55OyBqKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXSA9PSBudWxsKSB0aGlzLl9pdGVtR3JpZFtwb3Mucm93ICsgal0gPSB7fTtcclxuXHRcdFx0XHJcblx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBkaW1zLng7IGkrKykge1xyXG5cdFx0XHRcdHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXVtwb3MuY29sICsgaV0gPSBpdGVtO1xyXG5cclxuXHRcdFx0XHR0aGlzLl91cGRhdGVTaXplKHBvcy5jb2wgKyBkaW1zLnggLSAxLCBwb3Mucm93ICsgZGltcy55IC0gMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3JlbW92ZUZyb21HcmlkKGl0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdGZvciAobGV0IHkgaW4gdGhpcy5faXRlbUdyaWQpXHJcblx0XHRcdGZvciAobGV0IHggaW4gdGhpcy5faXRlbUdyaWRbeV0pXHJcblx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3ldW3hdID09IGl0ZW0pXHJcblx0XHRcdFx0XHRkZWxldGUgdGhpcy5faXRlbUdyaWRbeV1beF07XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF91cGRhdGVTaXplKGNvbD86IG51bWJlciwgcm93PzogbnVtYmVyKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fZGVzdHJveWVkKSByZXR1cm47XHJcblx0XHRjb2wgPSAoY29sID09IHVuZGVmaW5lZCkgPyB0aGlzLl9nZXRNYXhDb2woKSA6IGNvbDtcclxuXHRcdHJvdyA9IChyb3cgPT0gdW5kZWZpbmVkKSA/IHRoaXMuX2dldE1heFJvdygpIDogcm93O1xyXG5cclxuXHRcdGxldCBtYXhDb2w6IG51bWJlciA9IE1hdGgubWF4KHRoaXMuX2N1ck1heENvbCwgY29sKTtcclxuXHRcdGxldCBtYXhSb3c6IG51bWJlciA9IE1hdGgubWF4KHRoaXMuX2N1ck1heFJvdywgcm93KTtcclxuXHRcdFxyXG5cdFx0aWYgKG1heENvbCAhPSB0aGlzLl9jdXJNYXhDb2wgfHwgbWF4Um93ICE9IHRoaXMuX2N1ck1heFJvdykge1xyXG5cdFx0XHR0aGlzLl9jdXJNYXhDb2wgPSBtYXhDb2w7XHJcblx0XHRcdHRoaXMuX2N1ck1heFJvdyA9IG1heFJvdztcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd3aWR0aCcsICcxMDAlJyk7Ly8obWF4Q29sICogKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSkrJ3B4Jyk7XHJcblx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCAodGhpcy5fY3VyTWF4Um93ICogKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpICsgJ3B4Jyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9nZXRNYXhSb3coKTogbnVtYmVyIHtcclxuXHRcdHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCB0aGlzLl9pdGVtcy5tYXAoKGl0ZW06IE5nR3JpZEl0ZW0pID0+IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCkucm93ICsgaXRlbS5nZXRTaXplKCkueSAtIDEpKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldE1heENvbCgpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIHRoaXMuX2l0ZW1zLm1hcCgoaXRlbTogTmdHcmlkSXRlbSkgPT4gaXRlbS5nZXRHcmlkUG9zaXRpb24oKS5jb2wgKyBpdGVtLmdldFNpemUoKS54IC0gMSkpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0TW91c2VQb3NpdGlvbihlOiBhbnkpOiBOZ0dyaWRSYXdQb3NpdGlvbiB7XHJcblx0XHRpZiAoKCg8YW55PndpbmRvdykuVG91Y2hFdmVudCAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudCkgfHwgKGUudG91Y2hlcyB8fCBlLmNoYW5nZWRUb3VjaGVzKSkge1xyXG5cdFx0XHRlID0gZS50b3VjaGVzLmxlbmd0aCA+IDAgPyBlLnRvdWNoZXNbMF0gOiBlLmNoYW5nZWRUb3VjaGVzWzBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHJlZlBvczogYW55ID0gdGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuXHRcdGxldCBsZWZ0OiBudW1iZXIgPSBlLmNsaWVudFggLSByZWZQb3MubGVmdDtcclxuXHRcdGxldCB0b3A6IG51bWJlciA9IGUuY2xpZW50WSAtIHJlZlBvcy50b3A7XHJcblxyXG5cdFx0aWYgKHRoaXMuY2FzY2FkZSA9PSAnZG93bicpIHRvcCA9IHJlZlBvcy50b3AgKyByZWZQb3MuaGVpZ2h0IC0gZS5jbGllbnRZO1xyXG5cdFx0aWYgKHRoaXMuY2FzY2FkZSA9PSAncmlnaHQnKSBsZWZ0ID0gcmVmUG9zLmxlZnQgKyByZWZQb3Mud2lkdGggLSBlLmNsaWVudFg7XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLmlzRHJhZ2dpbmcgJiYgdGhpcy5fem9vbU9uRHJhZykge1xyXG5cdFx0XHRsZWZ0ICo9IDI7XHJcblx0XHRcdHRvcCAqPSAyO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRsZWZ0OiBsZWZ0LFxyXG5cdFx0XHR0b3A6IHRvcFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldEFic29sdXRlTW91c2VQb3NpdGlvbihlOiBhbnkpOiBOZ0dyaWRSYXdQb3NpdGlvbiB7XHJcblx0XHRpZiAoKCg8YW55PndpbmRvdykuVG91Y2hFdmVudCAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudCkgfHwgKGUudG91Y2hlcyB8fCBlLmNoYW5nZWRUb3VjaGVzKSkge1xyXG5cdFx0XHRlID0gZS50b3VjaGVzLmxlbmd0aCA+IDAgPyBlLnRvdWNoZXNbMF0gOiBlLmNoYW5nZWRUb3VjaGVzWzBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGxlZnQ6IGUuY2xpZW50WCxcclxuXHRcdFx0dG9wOiBlLmNsaWVudFlcclxuXHRcdH07XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX2dldENvbnRhaW5lckNvbHVtbnMoKTogbnVtYmVyIHtcclxuXHRcdGNvbnN0IG1heFdpZHRoOiBudW1iZXIgPSB0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihtYXhXaWR0aCAvICh0aGlzLmNvbFdpZHRoICsgdGhpcy5tYXJnaW5MZWZ0ICsgdGhpcy5tYXJnaW5SaWdodCkpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0SXRlbUZyb21Qb3NpdGlvbihwb3NpdGlvbjogTmdHcmlkUmF3UG9zaXRpb24pOiBOZ0dyaWRJdGVtIHtcclxuXHRcdGZvciAobGV0IGl0ZW0gb2YgdGhpcy5faXRlbXMpIHtcclxuXHRcdFx0Y29uc3Qgc2l6ZTogTmdHcmlkSXRlbURpbWVuc2lvbnMgPSBpdGVtLmdldERpbWVuc2lvbnMoKTtcclxuXHRcdFx0Y29uc3QgcG9zOiBOZ0dyaWRSYXdQb3NpdGlvbiA9IGl0ZW0uZ2V0UG9zaXRpb24oKTtcclxuXHJcblx0XHRcdGlmIChwb3NpdGlvbi5sZWZ0ID4gKHBvcy5sZWZ0KSAmJiBwb3NpdGlvbi5sZWZ0IDwgKHBvcy5sZWZ0ICsgc2l6ZS53aWR0aCkgJiZcclxuXHRcdFx0XHRwb3NpdGlvbi50b3AgPiAocG9zLnRvcCkgJiYgcG9zaXRpb24udG9wIDwgKHBvcy50b3AgKyBzaXplLmhlaWdodCkpIHtcclxuXHRcdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfY3JlYXRlUGxhY2Vob2xkZXIoaXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xyXG5cdFx0Y29uc3QgcG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24gPSBpdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdFx0Y29uc3QgZGltczogTmdHcmlkSXRlbVNpemUgPSBpdGVtLmdldFNpemUoKTtcclxuXHJcblx0XHR0aGlzLl9sb2FkZXIubG9hZE5leHRUb0xvY2F0aW9uKCg8VHlwZT5OZ0dyaWRQbGFjZWhvbGRlciksIGl0ZW0uY29udGFpbmVyUmVmKS50aGVuKChjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxOZ0dyaWRQbGFjZWhvbGRlcj4pID0+IHtcclxuXHRcdFx0dGhpcy5fcGxhY2Vob2xkZXJSZWYgPSBjb21wb25lbnRSZWY7XHJcblx0XHRcdGNvbnN0IHBsYWNlaG9sZGVyOiBOZ0dyaWRQbGFjZWhvbGRlciA9IGNvbXBvbmVudFJlZi5pbnN0YW5jZTtcclxuXHRcdFx0cGxhY2Vob2xkZXIucmVnaXN0ZXJHcmlkKHRoaXMpO1xyXG5cdFx0XHRwbGFjZWhvbGRlci5zZXRDYXNjYWRlTW9kZSh0aGlzLmNhc2NhZGUpO1xyXG5cdFx0XHRwbGFjZWhvbGRlci5zZXRHcmlkUG9zaXRpb24oeyBjb2w6IHBvcy5jb2wsIHJvdzogcG9zLnJvdyB9KTtcclxuXHRcdFx0cGxhY2Vob2xkZXIuc2V0U2l6ZSh7IHg6IGRpbXMueCwgeTogZGltcy55IH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
