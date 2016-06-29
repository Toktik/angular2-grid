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
                    this._fixGridCollisions(gridPos, dims, true);
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
            if (newW < this._resizingItem.minWidth)
                newW = this._resizingItem.minWidth;
            if (newH < this._resizingItem.minHeight)
                newH = this._resizingItem.minHeight;
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
                    this._fixGridCollisions(iGridPos, calcSize, true);
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
    NgGrid.prototype._fixGridCollisions = function (pos, dims, shouldSave) {
        if (shouldSave === void 0) { shouldSave = false; }
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
            if (shouldSave) {
                collisions[0].savePosition(itemPos);
            }
            else {
                collisions[0].setGridPosition(itemPos);
            }
            this._fixGridCollisions(itemPos, itemDims, shouldSave);
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
            else if (currentItems.length === 0 && columns.length === 1 && columns[0].length >= maxCols) {
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

//# sourceMappingURL=data:application/json;base64,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QUFPLEVBQUUsQ0FBQzs0QkFDaEQsSUFBTSxPQUFPLEdBQXVCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzs0QkFFM0QsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7Z0NBQUMsUUFBUSxDQUFDLENBQUMscUNBQXFDOzRCQUV6RixJQUFJLE1BQU0sR0FBVyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBRS9CLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dDQUM3QyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzs0QkFDNUMsQ0FBQzs0QkFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dDQUNqRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUMzQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQUM7d0NBQ2pDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FB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QUFHLElBQUksQ0FBQyxDQUFDO2dDQUFDLFFBQVEsQ0FBQyxDQUFDLHFDQUFxQzs0QkFFekYsSUFBSSxNQUFNLEdBQVcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUUvQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQ0FDN0MsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7NEJBQzVDLENBQUM7NEJBRUQsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDakUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDM0MsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDO3dDQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0NBQzdELE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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RUFBRTs7Z0RBQUE7SUF2QlY7UUFBQyxnQkFBUyxDQUFDO1lBQ1YsUUFBUSxFQUFFLFVBQVU7WUFDcEIsTUFBTSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7WUFDMUIsSUFBSSxFQUFFO2dCQUNMLGFBQWEsRUFBRSxzQkFBc0I7Z0JBQ3JDLGFBQWEsRUFBRSxzQkFBc0I7Z0JBQ3JDLFdBQVcsRUFBRSxvQkFBb0I7Z0JBQ2pDLGNBQWMsRUFBRSxzQkFBc0I7Z0JBQ3RDLGFBQWEsRUFBRSxzQkFBc0I7Z0JBQ3JDLFlBQVksRUFBRSxvQkFBb0I7Z0JBQ2xDLGlCQUFpQixFQUFFLG1CQUFtQjtnQkFDdEMsc0JBQXNCLEVBQUUsc0JBQXNCO2dCQUM5QyxvQkFBb0IsRUFBRSxvQkFBb0I7YUFDMUM7U0FDRCxDQUFDOztjQUFBO0lBNHNDRixhQUFDO0FBQUQsQ0Ezc0NBLEFBMnNDQyxJQUFBO0FBM3NDWSxjQUFNLFNBMnNDbEIsQ0FBQSIsImZpbGUiOiJkaXJlY3RpdmVzL05nR3JpZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlciwgRXZlbnRFbWl0dGVyLCBEeW5hbWljQ29tcG9uZW50TG9hZGVyLCBIb3N0LCBWaWV3RW5jYXBzdWxhdGlvbiwgVHlwZSwgQ29tcG9uZW50UmVmLCBLZXlWYWx1ZURpZmZlciwgS2V5VmFsdWVEaWZmZXJzLCBPbkluaXQsIE9uRGVzdHJveSwgRG9DaGVjaywgVmlld0NvbnRhaW5lclJlZiwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5nR3JpZENvbmZpZywgTmdHcmlkSXRlbUV2ZW50LCBOZ0dyaWRJdGVtUG9zaXRpb24sIE5nR3JpZEl0ZW1TaXplLCBOZ0dyaWRSYXdQb3NpdGlvbiwgTmdHcmlkSXRlbURpbWVuc2lvbnMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL0lOZ0dyaWQnO1xyXG5pbXBvcnQgeyBOZ0dyaWRJdGVtIH0gZnJvbSAnLi9OZ0dyaWRJdGVtJztcclxuaW1wb3J0IHsgTmdHcmlkUGxhY2Vob2xkZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL05nR3JpZFBsYWNlaG9sZGVyJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG5cdHNlbGVjdG9yOiAnW25nR3JpZF0nLFxyXG5cdGlucHV0czogWydjb25maWc6IG5nR3JpZCddLFxyXG5cdGhvc3Q6IHtcclxuXHRcdCcobW91c2Vkb3duKSc6ICdfb25Nb3VzZURvd24oJGV2ZW50KScsXHJcblx0XHQnKG1vdXNlbW92ZSknOiAnX29uTW91c2VNb3ZlKCRldmVudCknLFxyXG5cdFx0Jyhtb3VzZXVwKSc6ICdfb25Nb3VzZVVwKCRldmVudCknLFxyXG5cdFx0Jyh0b3VjaHN0YXJ0KSc6ICdfb25Nb3VzZURvd24oJGV2ZW50KScsXHJcblx0XHQnKHRvdWNobW92ZSknOiAnX29uTW91c2VNb3ZlKCRldmVudCknLFxyXG5cdFx0Jyh0b3VjaGVuZCknOiAnX29uTW91c2VVcCgkZXZlbnQpJyxcclxuXHRcdCcod2luZG93OnJlc2l6ZSknOiAnX29uUmVzaXplKCRldmVudCknLFxyXG5cdFx0Jyhkb2N1bWVudDptb3VzZW1vdmUpJzogJ19vbk1vdXNlTW92ZSgkZXZlbnQpJyxcclxuXHRcdCcoZG9jdW1lbnQ6bW91c2V1cCknOiAnX29uTW91c2VVcCgkZXZlbnQpJ1xyXG5cdH1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5nR3JpZCBpbXBsZW1lbnRzIE9uSW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcclxuXHQvL1x0RXZlbnQgRW1pdHRlcnNcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uRHJhZ1N0YXJ0OiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvbkRyYWc6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uRHJhZ1N0b3A6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uUmVzaXplU3RhcnQ6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uUmVzaXplOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW0+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvblJlc2l6ZVN0b3A6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbT4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uSXRlbUNoYW5nZTogRXZlbnRFbWl0dGVyPEFycmF5PE5nR3JpZEl0ZW1FdmVudD4+ID0gbmV3IEV2ZW50RW1pdHRlcjxBcnJheTxOZ0dyaWRJdGVtRXZlbnQ+PigpO1xyXG5cclxuXHQvL1x0UHVibGljIHZhcmlhYmxlc1xyXG5cdHB1YmxpYyBjb2xXaWR0aDogbnVtYmVyID0gMjUwO1xyXG5cdHB1YmxpYyByb3dIZWlnaHQ6IG51bWJlciA9IDI1MDtcclxuXHRwdWJsaWMgbWluQ29sczogbnVtYmVyID0gMTtcclxuXHRwdWJsaWMgbWluUm93czogbnVtYmVyID0gMTtcclxuXHRwdWJsaWMgbWFyZ2luVG9wOiBudW1iZXIgPSAxMDtcclxuXHRwdWJsaWMgbWFyZ2luUmlnaHQ6IG51bWJlciA9IDEwO1xyXG5cdHB1YmxpYyBtYXJnaW5Cb3R0b206IG51bWJlciA9IDEwO1xyXG5cdHB1YmxpYyBtYXJnaW5MZWZ0OiBudW1iZXIgPSAxMDtcclxuXHRwdWJsaWMgaXNEcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHB1YmxpYyBpc1Jlc2l6aW5nOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHVibGljIGF1dG9TdHlsZTogYm9vbGVhbiA9IHRydWU7XHJcblx0cHVibGljIHJlc2l6ZUVuYWJsZTogYm9vbGVhbiA9IHRydWU7XHJcblx0cHVibGljIGRyYWdFbmFibGU6IGJvb2xlYW4gPSB0cnVlO1xyXG5cdHB1YmxpYyBjYXNjYWRlOiBzdHJpbmcgPSAndXAnO1xyXG5cdHB1YmxpYyBtaW5XaWR0aDogbnVtYmVyID0gMTAwO1xyXG5cdHB1YmxpYyBtaW5IZWlnaHQ6IG51bWJlciA9IDEwMDtcclxuXHJcblx0Ly9cdFByaXZhdGUgdmFyaWFibGVzXHJcblx0cHJpdmF0ZSBfaXRlbXM6IEFycmF5PE5nR3JpZEl0ZW0+ID0gW107XHJcblx0cHJpdmF0ZSBfZHJhZ2dpbmdJdGVtOiBOZ0dyaWRJdGVtID0gbnVsbDtcclxuXHRwcml2YXRlIF9yZXNpemluZ0l0ZW06IE5nR3JpZEl0ZW0gPSBudWxsO1xyXG5cdHByaXZhdGUgX3Jlc2l6ZURpcmVjdGlvbjogc3RyaW5nID0gbnVsbDtcclxuXHRwcml2YXRlIF9pdGVtR3JpZDogeyBba2V5OiBudW1iZXJdOiB7IFtrZXk6IG51bWJlcl06IE5nR3JpZEl0ZW0gfSB9ID0geyAxOiB7IDE6IG51bGwgfSB9O1xyXG5cdHByaXZhdGUgX2NvbnRhaW5lcldpZHRoOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfY29udGFpbmVySGVpZ2h0OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBfbWF4Q29sczogbnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF9tYXhSb3dzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX3Zpc2libGVDb2xzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX3Zpc2libGVSb3dzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX3NldFdpZHRoOiBudW1iZXIgPSAyNTA7XHJcblx0cHJpdmF0ZSBfc2V0SGVpZ2h0OiBudW1iZXIgPSAyNTA7XHJcblx0cHJpdmF0ZSBfcG9zT2Zmc2V0OiBOZ0dyaWRSYXdQb3NpdGlvbiA9IG51bGw7XHJcblx0cHJpdmF0ZSBfYWRkaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfcGxhY2Vob2xkZXJSZWY6IENvbXBvbmVudFJlZjxOZ0dyaWRQbGFjZWhvbGRlcj4gPSBudWxsO1xyXG5cdHByaXZhdGUgX2ZpeFRvR3JpZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX2F1dG9SZXNpemU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9kaWZmZXI6IEtleVZhbHVlRGlmZmVyO1xyXG5cdHByaXZhdGUgX2Rlc3Ryb3llZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX21haW50YWluUmF0aW86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9hc3BlY3RSYXRpbzogbnVtYmVyO1xyXG5cdHByaXZhdGUgX3ByZWZlck5ldzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX3pvb21PbkRyYWc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwcml2YXRlIF9saW1pdFRvU2NyZWVuOiBib29sZWFuID0gZmFsc2U7XHJcblx0cHJpdmF0ZSBfY3VyTWF4Um93OiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX2N1ck1heENvbDogbnVtYmVyID0gMDtcclxuXHJcblx0Ly9cdERlZmF1bHQgY29uZmlnXHJcblx0cHJpdmF0ZSBzdGF0aWMgQ09OU1RfREVGQVVMVF9DT05GSUc6IE5nR3JpZENvbmZpZyA9IHtcclxuXHRcdG1hcmdpbnM6IFsxMF0sXHJcblx0XHRkcmFnZ2FibGU6IHRydWUsXHJcblx0XHRyZXNpemFibGU6IHRydWUsXHJcblx0XHRtYXhfY29sczogMCxcclxuXHRcdG1heF9yb3dzOiAwLFxyXG5cdFx0dmlzaWJsZV9jb2xzOiAwLFxyXG5cdFx0dmlzaWJsZV9yb3dzOiAwLFxyXG5cdFx0Y29sX3dpZHRoOiAyNTAsXHJcblx0XHRyb3dfaGVpZ2h0OiAyNTAsXHJcblx0XHRjYXNjYWRlOiAndXAnLFxyXG5cdFx0bWluX3dpZHRoOiAxMDAsXHJcblx0XHRtaW5faGVpZ2h0OiAxMDAsXHJcblx0XHRmaXhfdG9fZ3JpZDogZmFsc2UsXHJcblx0XHRhdXRvX3N0eWxlOiB0cnVlLFxyXG5cdFx0YXV0b19yZXNpemU6IGZhbHNlLFxyXG5cdFx0bWFpbnRhaW5fcmF0aW86IGZhbHNlLFxyXG5cdFx0cHJlZmVyX25ldzogZmFsc2UsXHJcblx0XHR6b29tX29uX2RyYWc6IGZhbHNlXHJcblx0fTtcclxuXHRwcml2YXRlIF9jb25maWcgPSBOZ0dyaWQuQ09OU1RfREVGQVVMVF9DT05GSUc7XHJcblxyXG5cdC8vXHRbbmctZ3JpZF0gYXR0cmlidXRlIGhhbmRsZXJcclxuXHRzZXQgY29uZmlnKHY6IE5nR3JpZENvbmZpZykge1xyXG5cdFx0dGhpcy5zZXRDb25maWcodik7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2RpZmZlciA9PSBudWxsICYmIHYgIT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLl9kaWZmZXIgPSB0aGlzLl9kaWZmZXJzLmZpbmQodGhpcy5fY29uZmlnKS5jcmVhdGUobnVsbCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvL1x0Q29uc3RydWN0b3JcclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIF9kaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsIHByaXZhdGUgX25nRWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlciwgcHJpdmF0ZSBfbG9hZGVyOiBEeW5hbWljQ29tcG9uZW50TG9hZGVyLCBwcml2YXRlIF9jb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHsgfVxyXG5cclxuXHQvL1x0UHVibGljIG1ldGhvZHNcclxuXHRwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnZ3JpZCcsIHRydWUpO1xyXG5cdFx0aWYgKHRoaXMuYXV0b1N0eWxlKSB0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcclxuXHRcdHRoaXMuc2V0Q29uZmlnKHRoaXMuX2NvbmZpZyk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcblx0XHR0aGlzLl9kZXN0cm95ZWQgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldENvbmZpZyhjb25maWc6IE5nR3JpZENvbmZpZyk6IHZvaWQge1xyXG5cdFx0dGhpcy5fY29uZmlnID0gY29uZmlnO1xyXG5cclxuXHRcdHZhciBtYXhDb2xSb3dDaGFuZ2VkID0gZmFsc2U7XHJcblx0XHRmb3IgKHZhciB4IGluIGNvbmZpZykge1xyXG5cdFx0XHR2YXIgdmFsID0gY29uZmlnW3hdO1xyXG5cdFx0XHR2YXIgaW50VmFsID0gIXZhbCA/IDAgOiBwYXJzZUludCh2YWwpO1xyXG5cclxuXHRcdFx0c3dpdGNoICh4KSB7XHJcblx0XHRcdFx0Y2FzZSAnbWFyZ2lucyc6XHJcblx0XHRcdFx0XHR0aGlzLnNldE1hcmdpbnModmFsKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2NvbF93aWR0aCc6XHJcblx0XHRcdFx0XHR0aGlzLmNvbFdpZHRoID0gTWF0aC5tYXgoaW50VmFsLCAxKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3Jvd19oZWlnaHQnOlxyXG5cdFx0XHRcdFx0dGhpcy5yb3dIZWlnaHQgPSBNYXRoLm1heChpbnRWYWwsIDEpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnYXV0b19zdHlsZSc6XHJcblx0XHRcdFx0XHR0aGlzLmF1dG9TdHlsZSA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ2F1dG9fcmVzaXplJzpcclxuXHRcdFx0XHRcdHRoaXMuX2F1dG9SZXNpemUgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdkcmFnZ2FibGUnOlxyXG5cdFx0XHRcdFx0dGhpcy5kcmFnRW5hYmxlID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAncmVzaXphYmxlJzpcclxuXHRcdFx0XHRcdHRoaXMucmVzaXplRW5hYmxlID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbWF4X3Jvd3MnOlxyXG5cdFx0XHRcdFx0bWF4Q29sUm93Q2hhbmdlZCA9IG1heENvbFJvd0NoYW5nZWQgfHwgdGhpcy5fbWF4Um93cyAhPSBpbnRWYWw7XHJcblx0XHRcdFx0XHR0aGlzLl9tYXhSb3dzID0gaW50VmFsIDwgMCA/IDAgOiBpbnRWYWw7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdtYXhfY29scyc6XHJcblx0XHRcdFx0XHRtYXhDb2xSb3dDaGFuZ2VkID0gbWF4Q29sUm93Q2hhbmdlZCB8fCB0aGlzLl9tYXhDb2xzICE9IGludFZhbDtcclxuXHRcdFx0XHRcdHRoaXMuX21heENvbHMgPSBpbnRWYWwgPCAwID8gMCA6IGludFZhbDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3Zpc2libGVfcm93cyc6XHJcblx0XHRcdFx0XHR0aGlzLl92aXNpYmxlUm93cyA9IE1hdGgubWF4KGludFZhbCwgMCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICd2aXNpYmxlX2NvbHMnOlxyXG5cdFx0XHRcdFx0dGhpcy5fdmlzaWJsZUNvbHMgPSBNYXRoLm1heChpbnRWYWwsIDApO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnbWluX3Jvd3MnOlxyXG5cdFx0XHRcdFx0dGhpcy5taW5Sb3dzID0gTWF0aC5tYXgoaW50VmFsLCAxKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21pbl9jb2xzJzpcclxuXHRcdFx0XHRcdHRoaXMubWluQ29scyA9IE1hdGgubWF4KGludFZhbCwgMSk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdtaW5faGVpZ2h0JzpcclxuXHRcdFx0XHRcdHRoaXMubWluSGVpZ2h0ID0gTWF0aC5tYXgoaW50VmFsLCAxKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ21pbl93aWR0aCc6XHJcblx0XHRcdFx0XHR0aGlzLm1pbldpZHRoID0gTWF0aC5tYXgoaW50VmFsLCAxKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgJ3pvb21fb25fZHJhZyc6XHJcblx0XHRcdFx0XHR0aGlzLl96b29tT25EcmFnID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAnY2FzY2FkZSc6XHJcblx0XHRcdFx0XHRpZiAodGhpcy5jYXNjYWRlICE9IHZhbCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNhc2NhZGUgPSB2YWw7XHJcblx0XHRcdFx0XHRcdHRoaXMuX2Nhc2NhZGVHcmlkKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdmaXhfdG9fZ3JpZCc6XHJcblx0XHRcdFx0XHR0aGlzLl9maXhUb0dyaWQgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdtYWludGFpbl9yYXRpbyc6XHJcblx0XHRcdFx0XHR0aGlzLl9tYWludGFpblJhdGlvID0gdmFsID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAncHJlZmVyX25ldyc6XHJcblx0XHRcdFx0XHR0aGlzLl9wcmVmZXJOZXcgPSB2YWwgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdsaW1pdF90b19zY3JlZW4nOlxyXG5cdFx0XHRcdFx0dGhpcy5fbGltaXRUb1NjcmVlbiA9IHZhbCA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuX21haW50YWluUmF0aW8pIHtcclxuXHRcdFx0aWYgKHRoaXMuY29sV2lkdGggJiYgdGhpcy5yb3dIZWlnaHQpIHtcclxuXHRcdFx0XHR0aGlzLl9hc3BlY3RSYXRpbyA9IHRoaXMuY29sV2lkdGggLyB0aGlzLnJvd0hlaWdodDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLl9tYWludGFpblJhdGlvID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAobWF4Q29sUm93Q2hhbmdlZCkge1xyXG5cdFx0XHRpZiAodGhpcy5fbWF4Q29scyA+IDAgJiYgdGhpcy5fbWF4Um93cyA+IDApIHtcdC8vXHRDYW4ndCBoYXZlIGJvdGgsIHByaW9yaXRpc2Ugb24gY2FzY2FkZVxyXG5cdFx0XHRcdHN3aXRjaCAodGhpcy5jYXNjYWRlKSB7XHJcblx0XHRcdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0XHRcdGNhc2UgJ3JpZ2h0JzpcclxuXHRcdFx0XHRcdFx0dGhpcy5fbWF4Q29scyA9IDA7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAndXAnOlxyXG5cdFx0XHRcdFx0Y2FzZSAnZG93bic6XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHR0aGlzLl9tYXhSb3dzID0gMDtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmb3IgKGxldCBpdGVtIG9mIHRoaXMuX2l0ZW1zKSB7XHJcblx0XHRcdFx0dmFyIHBvcyA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRcdFx0dmFyIGRpbXMgPSBpdGVtLmdldFNpemUoKTtcclxuXHJcblx0XHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLl9tYXhDb2xzID4gMCAmJiBkaW1zLnggPiB0aGlzLl9tYXhDb2xzKSB7XHJcblx0XHRcdFx0XHRkaW1zLnggPSB0aGlzLl9tYXhDb2xzO1xyXG5cdFx0XHRcdFx0aXRlbS5zZXRTaXplKGRpbXMpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbWF4Um93cyA+IDAgJiYgZGltcy55ID4gdGhpcy5fbWF4Um93cykge1xyXG5cdFx0XHRcdFx0ZGltcy55ID0gdGhpcy5fbWF4Um93cztcclxuXHRcdFx0XHRcdGl0ZW0uc2V0U2l6ZShkaW1zKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLl9oYXNHcmlkQ29sbGlzaW9uKHBvcywgZGltcykgfHwgIXRoaXMuX2lzV2l0aGluQm91bmRzKHBvcywgZGltcykpIHtcclxuXHRcdFx0XHRcdHZhciBuZXdQb3NpdGlvbiA9IHRoaXMuX2ZpeEdyaWRQb3NpdGlvbihwb3MsIGRpbXMpO1xyXG5cdFx0XHRcdFx0aXRlbS5zZXRHcmlkUG9zaXRpb24obmV3UG9zaXRpb24pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLl9jYXNjYWRlR3JpZCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuX2NhbGN1bGF0ZVJvd0hlaWdodCgpO1xyXG5cdFx0dGhpcy5fY2FsY3VsYXRlQ29sV2lkdGgoKTtcclxuXHJcblx0XHR2YXIgbWF4V2lkdGggPSB0aGlzLl9tYXhDb2xzICogdGhpcy5jb2xXaWR0aDtcclxuXHRcdHZhciBtYXhIZWlnaHQgPSB0aGlzLl9tYXhSb3dzICogdGhpcy5yb3dIZWlnaHQ7XHJcblxyXG5cdFx0aWYgKG1heFdpZHRoID4gMCAmJiB0aGlzLm1pbldpZHRoID4gbWF4V2lkdGgpIHRoaXMubWluV2lkdGggPSAwLjc1ICogdGhpcy5jb2xXaWR0aDtcclxuXHRcdGlmIChtYXhIZWlnaHQgPiAwICYmIHRoaXMubWluSGVpZ2h0ID4gbWF4SGVpZ2h0KSB0aGlzLm1pbkhlaWdodCA9IDAuNzUgKiB0aGlzLnJvd0hlaWdodDtcclxuXHJcblx0XHRpZiAodGhpcy5taW5XaWR0aCA+IHRoaXMuY29sV2lkdGgpIHRoaXMubWluQ29scyA9IE1hdGgubWF4KHRoaXMubWluQ29scywgTWF0aC5jZWlsKHRoaXMubWluV2lkdGggLyB0aGlzLmNvbFdpZHRoKSk7XHJcblx0XHRpZiAodGhpcy5taW5IZWlnaHQgPiB0aGlzLnJvd0hlaWdodCkgdGhpcy5taW5Sb3dzID0gTWF0aC5tYXgodGhpcy5taW5Sb3dzLCBNYXRoLmNlaWwodGhpcy5taW5IZWlnaHQgLyB0aGlzLnJvd0hlaWdodCkpO1xyXG5cclxuXHRcdGlmICh0aGlzLl9tYXhDb2xzID4gMCAmJiB0aGlzLm1pbkNvbHMgPiB0aGlzLl9tYXhDb2xzKSB0aGlzLm1pbkNvbHMgPSAxO1xyXG5cdFx0aWYgKHRoaXMuX21heFJvd3MgPiAwICYmIHRoaXMubWluUm93cyA+IHRoaXMuX21heFJvd3MpIHRoaXMubWluUm93cyA9IDE7XHJcblxyXG5cdFx0dGhpcy5fdXBkYXRlUmF0aW8oKTtcclxuXHRcdFxyXG5cdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHR0aGlzLl9yZW1vdmVGcm9tR3JpZChpdGVtKTtcclxuXHRcdFx0aXRlbS5zZXRDYXNjYWRlTW9kZSh0aGlzLmNhc2NhZGUpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLl91cGRhdGVMaW1pdCgpO1xyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBpdGVtIG9mIHRoaXMuX2l0ZW1zKSB7XHJcblx0XHRcdGl0ZW0ucmVjYWxjdWxhdGVTZWxmKCk7XHJcblx0XHRcdHRoaXMuX2FkZFRvR3JpZChpdGVtKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLl9jYXNjYWRlR3JpZCgpO1xyXG5cdFx0dGhpcy5fdXBkYXRlU2l6ZSgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEl0ZW1Qb3NpdGlvbihpbmRleDogbnVtYmVyKTogTmdHcmlkSXRlbVBvc2l0aW9uIHtcclxuXHRcdHJldHVybiB0aGlzLl9pdGVtc1tpbmRleF0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0SXRlbVNpemUoaW5kZXg6IG51bWJlcik6IE5nR3JpZEl0ZW1TaXplIHtcclxuXHRcdHJldHVybiB0aGlzLl9pdGVtc1tpbmRleF0uZ2V0U2l6ZSgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG5nRG9DaGVjaygpOiBib29sZWFuIHtcclxuXHRcdGlmICh0aGlzLl9kaWZmZXIgIT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgY2hhbmdlcyA9IHRoaXMuX2RpZmZlci5kaWZmKHRoaXMuX2NvbmZpZyk7XHJcblxyXG5cdFx0XHRpZiAoY2hhbmdlcyAhPSBudWxsKSB7XHJcblx0XHRcdFx0dGhpcy5fYXBwbHlDaGFuZ2VzKGNoYW5nZXMpO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRNYXJnaW5zKG1hcmdpbnM6IEFycmF5PHN0cmluZz4pOiB2b2lkIHtcclxuXHRcdHRoaXMubWFyZ2luVG9wID0gTWF0aC5tYXgocGFyc2VJbnQobWFyZ2luc1swXSksIDApO1xyXG5cdFx0dGhpcy5tYXJnaW5SaWdodCA9IG1hcmdpbnMubGVuZ3RoID49IDIgPyBNYXRoLm1heChwYXJzZUludChtYXJnaW5zWzFdKSwgMCkgOiB0aGlzLm1hcmdpblRvcDtcclxuXHRcdHRoaXMubWFyZ2luQm90dG9tID0gbWFyZ2lucy5sZW5ndGggPj0gMyA/IE1hdGgubWF4KHBhcnNlSW50KG1hcmdpbnNbMl0pLCAwKSA6IHRoaXMubWFyZ2luVG9wO1xyXG5cdFx0dGhpcy5tYXJnaW5Cb3R0b20gPSBtYXJnaW5zLmxlbmd0aCA+PSAzID8gTWF0aC5tYXgocGFyc2VJbnQobWFyZ2luc1syXSksIDApIDogdGhpcy5tYXJnaW5Ub3A7XHJcblx0XHR0aGlzLm1hcmdpbkxlZnQgPSBtYXJnaW5zLmxlbmd0aCA+PSA0ID8gTWF0aC5tYXgocGFyc2VJbnQobWFyZ2luc1szXSksIDApIDogdGhpcy5tYXJnaW5SaWdodDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBlbmFibGVEcmFnKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5kcmFnRW5hYmxlID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkaXNhYmxlRHJhZygpOiB2b2lkIHtcclxuXHRcdHRoaXMuZHJhZ0VuYWJsZSA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGVuYWJsZVJlc2l6ZSgpOiB2b2lkIHtcclxuXHRcdHRoaXMucmVzaXplRW5hYmxlID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkaXNhYmxlUmVzaXplKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5yZXNpemVFbmFibGUgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhZGRJdGVtKG5nSXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xyXG5cdFx0bmdJdGVtLnNldENhc2NhZGVNb2RlKHRoaXMuY2FzY2FkZSk7XHJcblx0XHRpZiAoIXRoaXMuX3ByZWZlck5ldykge1xyXG5cdFx0XHR2YXIgbmV3UG9zID0gdGhpcy5fZml4R3JpZFBvc2l0aW9uKG5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKSwgbmdJdGVtLmdldFNpemUoKSk7XHJcblx0XHRcdG5nSXRlbS5zYXZlUG9zaXRpb24obmV3UG9zKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuX2l0ZW1zLnB1c2gobmdJdGVtKTtcclxuXHRcdHRoaXMuX2FkZFRvR3JpZChuZ0l0ZW0pO1xyXG5cdFx0bmdJdGVtLnJlY2FsY3VsYXRlU2VsZigpO1xyXG5cdFx0bmdJdGVtLm9uQ2FzY2FkZUV2ZW50KCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVtb3ZlSXRlbShuZ0l0ZW06IE5nR3JpZEl0ZW0pOiB2b2lkIHtcclxuXHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKG5nSXRlbSk7XHJcblxyXG5cdFx0Zm9yIChsZXQgeDogbnVtYmVyID0gMDsgeCA8IHRoaXMuX2l0ZW1zLmxlbmd0aDsgeCsrKSB7XHJcblx0XHRcdGlmICh0aGlzLl9pdGVtc1t4XSA9PSBuZ0l0ZW0pIHtcclxuXHRcdFx0XHR0aGlzLl9pdGVtcy5zcGxpY2UoeCwgMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5fZGVzdHJveWVkKSByZXR1cm47XHJcblxyXG5cdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHRcdHRoaXMuX3VwZGF0ZVNpemUoKTtcclxuXHRcdHRoaXMuX2l0ZW1zLmZvckVhY2goKGl0ZW06IE5nR3JpZEl0ZW0pID0+IGl0ZW0ucmVjYWxjdWxhdGVTZWxmKCkpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHVwZGF0ZUl0ZW0obmdJdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZW1vdmVGcm9tR3JpZChuZ0l0ZW0pO1xyXG5cdFx0dGhpcy5fYWRkVG9HcmlkKG5nSXRlbSk7XHJcblx0XHR0aGlzLl9jYXNjYWRlR3JpZCgpO1xyXG5cdFx0dGhpcy5fdXBkYXRlU2l6ZSgpO1xyXG5cdFx0bmdJdGVtLm9uQ2FzY2FkZUV2ZW50KCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdHJpZ2dlckNhc2NhZGUoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9jYXNjYWRlR3JpZChudWxsLCBudWxsLCBmYWxzZSk7XHJcblx0fVxyXG5cclxuXHQvL1x0UHJpdmF0ZSBtZXRob2RzXHJcblx0cHJpdmF0ZSBfY2FsY3VsYXRlQ29sV2lkdGgoKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fYXV0b1Jlc2l6ZSkge1xyXG5cdFx0XHRpZiAodGhpcy5fbWF4Q29scyA+IDAgfHwgdGhpcy5fdmlzaWJsZUNvbHMgPiAwKSB7XHJcblx0XHRcdFx0dmFyIG1heENvbHMgPSB0aGlzLl9tYXhDb2xzID4gMCA/IHRoaXMuX21heENvbHMgOiB0aGlzLl92aXNpYmxlQ29scztcclxuXHRcdFx0XHR2YXIgbWF4V2lkdGg6IG51bWJlciA9IHRoaXMuX25nRWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuXHJcblx0XHRcdFx0dmFyIGNvbFdpZHRoOiBudW1iZXIgPSBNYXRoLmZsb29yKG1heFdpZHRoIC8gbWF4Q29scyk7XHJcblx0XHRcdFx0Y29sV2lkdGggLT0gKHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpO1xyXG5cdFx0XHRcdGlmIChjb2xXaWR0aCA+IDApIHRoaXMuY29sV2lkdGggPSBjb2xXaWR0aDtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuY29sV2lkdGggPCB0aGlzLm1pbldpZHRoIHx8IHRoaXMubWluQ29scyA+IHRoaXMuX2NvbmZpZy5taW5fY29scykge1xyXG5cdFx0XHRcdFx0dGhpcy5taW5Db2xzID0gTWF0aC5tYXgodGhpcy5fY29uZmlnLm1pbl9jb2xzLCBNYXRoLmNlaWwodGhpcy5taW5XaWR0aCAvIHRoaXMuY29sV2lkdGgpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2NhbGN1bGF0ZVJvd0hlaWdodCgpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9hdXRvUmVzaXplKSB7XHJcblx0XHRcdGlmICh0aGlzLl9tYXhSb3dzID4gMCB8fCB0aGlzLl92aXNpYmxlUm93cyA+IDApIHtcclxuXHRcdFx0XHR2YXIgbWF4Um93cyA9IHRoaXMuX21heFJvd3MgPiAwID8gdGhpcy5fbWF4Um93cyA6IHRoaXMuX3Zpc2libGVSb3dzO1xyXG5cdFx0XHRcdHZhciBtYXhIZWlnaHQ6IG51bWJlciA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcblx0XHRcdFx0dmFyIHJvd0hlaWdodDogbnVtYmVyID0gTWF0aC5tYXgoTWF0aC5mbG9vcihtYXhIZWlnaHQgLyBtYXhSb3dzKSwgdGhpcy5taW5IZWlnaHQpO1xyXG5cdFx0XHRcdHJvd0hlaWdodCAtPSAodGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSk7XHJcblx0XHRcdFx0aWYgKHJvd0hlaWdodCA+IDApIHRoaXMucm93SGVpZ2h0ID0gcm93SGVpZ2h0O1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5yb3dIZWlnaHQgPCB0aGlzLm1pbkhlaWdodCB8fCB0aGlzLm1pblJvd3MgPiB0aGlzLl9jb25maWcubWluX3Jvd3MpIHtcclxuXHRcdFx0XHRcdHRoaXMubWluUm93cyA9IE1hdGgubWF4KHRoaXMuX2NvbmZpZy5taW5fcm93cywgTWF0aC5jZWlsKHRoaXMubWluSGVpZ2h0IC8gdGhpcy5yb3dIZWlnaHQpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3VwZGF0ZVJhdGlvKCk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX2F1dG9SZXNpemUgJiYgdGhpcy5fbWFpbnRhaW5SYXRpbykge1xyXG5cdFx0XHRpZiAodGhpcy5fbWF4Q29scyA+IDAgJiYgdGhpcy5fdmlzaWJsZVJvd3MgPD0gMCkge1xyXG5cdFx0XHRcdHRoaXMucm93SGVpZ2h0ID0gdGhpcy5jb2xXaWR0aCAvIHRoaXMuX2FzcGVjdFJhdGlvO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX21heFJvd3MgPiAwICYmIHRoaXMuX3Zpc2libGVDb2xzIDw9IDApIHtcclxuXHRcdFx0XHR0aGlzLmNvbFdpZHRoID0gdGhpcy5fYXNwZWN0UmF0aW8gKiB0aGlzLnJvd0hlaWdodDtcclxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLl9tYXhDb2xzID09IDAgJiYgdGhpcy5fbWF4Um93cyA9PSAwKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuX3Zpc2libGVDb2xzID4gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5yb3dIZWlnaHQgPSB0aGlzLmNvbFdpZHRoIC8gdGhpcy5fYXNwZWN0UmF0aW87XHJcblx0XHRcdFx0fSBlbHNlIGlmICh0aGlzLl92aXNpYmxlUm93cyA+IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuY29sV2lkdGggPSB0aGlzLl9hc3BlY3RSYXRpbyAqIHRoaXMucm93SGVpZ2h0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRwcml2YXRlIF91cGRhdGVMaW1pdCgpOiB2b2lkIHtcclxuXHRcdGlmICghdGhpcy5fYXV0b1Jlc2l6ZSAmJiB0aGlzLl9saW1pdFRvU2NyZWVuKSB7XHJcblx0XHRcdHRoaXMuX2xpbWl0R3JpZCh0aGlzLl9nZXRDb250YWluZXJDb2x1bW5zKCkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRwcml2YXRlIF9vblJlc2l6ZShlOiBhbnkpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2NhbGN1bGF0ZUNvbFdpZHRoKCk7XHJcblx0XHR0aGlzLl9jYWxjdWxhdGVSb3dIZWlnaHQoKTtcclxuXHJcblx0XHR0aGlzLl91cGRhdGVSYXRpbygpO1xyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBpdGVtIG9mIHRoaXMuX2l0ZW1zKSB7XHJcblx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLl91cGRhdGVMaW1pdCgpO1xyXG5cdFx0XHJcblx0XHRmb3IgKGxldCBpdGVtIG9mIHRoaXMuX2l0ZW1zKSB7XHJcblx0XHRcdHRoaXMuX2FkZFRvR3JpZChpdGVtKTtcclxuXHRcdFx0aXRlbS5yZWNhbGN1bGF0ZVNlbGYoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5fdXBkYXRlU2l6ZSgpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfYXBwbHlDaGFuZ2VzKGNoYW5nZXM6IGFueSk6IHZvaWQge1xyXG5cdFx0Y2hhbmdlcy5mb3JFYWNoQWRkZWRJdGVtKChyZWNvcmQ6IGFueSkgPT4geyB0aGlzLl9jb25maWdbcmVjb3JkLmtleV0gPSByZWNvcmQuY3VycmVudFZhbHVlOyB9KTtcclxuXHRcdGNoYW5nZXMuZm9yRWFjaENoYW5nZWRJdGVtKChyZWNvcmQ6IGFueSkgPT4geyB0aGlzLl9jb25maWdbcmVjb3JkLmtleV0gPSByZWNvcmQuY3VycmVudFZhbHVlOyB9KTtcclxuXHRcdGNoYW5nZXMuZm9yRWFjaFJlbW92ZWRJdGVtKChyZWNvcmQ6IGFueSkgPT4geyBkZWxldGUgdGhpcy5fY29uZmlnW3JlY29yZC5rZXldOyB9KTtcclxuXHJcblx0XHR0aGlzLnNldENvbmZpZyh0aGlzLl9jb25maWcpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25Nb3VzZURvd24oZTogYW55KTogYm9vbGVhbiB7XHJcblx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0dmFyIGl0ZW0gPSB0aGlzLl9nZXRJdGVtRnJvbVBvc2l0aW9uKG1vdXNlUG9zKTtcclxuXHJcblx0XHRpZiAoaXRlbSAhPSBudWxsKSB7XHJcblx0XHRcdGlmICh0aGlzLnJlc2l6ZUVuYWJsZSAmJiBpdGVtLmNhblJlc2l6ZShlKSAhPSBudWxsKSB7XHJcblx0XHRcdFx0dGhpcy5fcmVzaXplU3RhcnQoZSk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuZHJhZ0VuYWJsZSAmJiBpdGVtLmNhbkRyYWcoZSkpIHtcclxuXHRcdFx0XHR0aGlzLl9kcmFnU3RhcnQoZSk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZXNpemVTdGFydChlOiBhbnkpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLnJlc2l6ZUVuYWJsZSkge1xyXG5cdFx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tUG9zaXRpb24obW91c2VQb3MpO1xyXG5cclxuXHRcdFx0aXRlbS5zdGFydE1vdmluZygpO1xyXG5cdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0gPSBpdGVtO1xyXG5cdFx0XHR0aGlzLl9yZXNpemVEaXJlY3Rpb24gPSBpdGVtLmNhblJlc2l6ZShlKTtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyKGl0ZW0pO1xyXG5cdFx0XHR0aGlzLmlzUmVzaXppbmcgPSB0cnVlO1xyXG5cclxuXHRcdFx0dGhpcy5vblJlc2l6ZVN0YXJ0LmVtaXQoaXRlbSk7XHJcblx0XHRcdGl0ZW0ub25SZXNpemVTdGFydEV2ZW50KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9kcmFnU3RhcnQoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5kcmFnRW5hYmxlKSB7XHJcblx0XHRcdHZhciBtb3VzZVBvcyA9IHRoaXMuX2dldE1vdXNlUG9zaXRpb24oZSk7XHJcblx0XHRcdHZhciBpdGVtID0gdGhpcy5fZ2V0SXRlbUZyb21Qb3NpdGlvbihtb3VzZVBvcyk7XHJcblx0XHRcdHZhciBpdGVtUG9zID0gaXRlbS5nZXRQb3NpdGlvbigpO1xyXG5cdFx0XHR2YXIgcE9mZnNldCA9IHsgJ2xlZnQnOiAobW91c2VQb3MubGVmdCAtIGl0ZW1Qb3MubGVmdCksICd0b3AnOiAobW91c2VQb3MudG9wIC0gaXRlbVBvcy50b3ApIH1cclxuXHJcblx0XHRcdGl0ZW0uc3RhcnRNb3ZpbmcoKTtcclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtID0gaXRlbTtcclxuXHRcdFx0dGhpcy5fcG9zT2Zmc2V0ID0gcE9mZnNldDtcclxuXHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdHRoaXMuX2NyZWF0ZVBsYWNlaG9sZGVyKGl0ZW0pO1xyXG5cdFx0XHR0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlO1xyXG5cclxuXHRcdFx0dGhpcy5vbkRyYWdTdGFydC5lbWl0KGl0ZW0pO1xyXG5cdFx0XHRpdGVtLm9uRHJhZ1N0YXJ0RXZlbnQoKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLl96b29tT25EcmFnKSB7XHJcblx0XHRcdFx0dGhpcy5fem9vbU91dCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX3pvb21PdXQoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJ3NjYWxlKDAuNSwgMC41KScpO1xyXG5cdH1cclxuXHRcclxuXHRwcml2YXRlIF9yZXNldFpvb20oKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJycpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfb25Nb3VzZU1vdmUoZTogYW55KTogdm9pZCB7XHJcblx0XHRpZiAoZS5idXR0b25zID09IDAgJiYgdGhpcy5pc0RyYWdnaW5nKSB7XHJcblx0XHRcdHRoaXMuX2RyYWdTdG9wKGUpO1xyXG5cdFx0fSBlbHNlIGlmIChlLmJ1dHRvbnMgPT0gMCAmJiB0aGlzLmlzUmVzaXppbmcpIHtcclxuXHRcdFx0dGhpcy5fcmVzaXplU3RvcChlKTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XHJcblx0XHRcdHRoaXMuX2RyYWcoZSk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuaXNSZXNpemluZykge1xyXG5cdFx0XHR0aGlzLl9yZXNpemUoZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXMuX2dldEl0ZW1Gcm9tUG9zaXRpb24obW91c2VQb3MpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGl0ZW0pIHtcclxuXHRcdFx0XHRpdGVtLm9uTW91c2VNb3ZlKGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9kcmFnKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG5cdFx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0XHR2YXIgbmV3TCA9IChtb3VzZVBvcy5sZWZ0IC0gdGhpcy5fcG9zT2Zmc2V0LmxlZnQpO1xyXG5cdFx0XHR2YXIgbmV3VCA9IChtb3VzZVBvcy50b3AgLSB0aGlzLl9wb3NPZmZzZXQudG9wKTtcclxuXHJcblx0XHRcdHZhciBpdGVtUG9zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdFx0XHR2YXIgZ3JpZFBvcyA9IHRoaXMuX2NhbGN1bGF0ZUdyaWRQb3NpdGlvbihuZXdMLCBuZXdUKTtcclxuXHRcdFx0dmFyIGRpbXMgPSB0aGlzLl9kcmFnZ2luZ0l0ZW0uZ2V0U2l6ZSgpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goZ3JpZFBvcywgZGltcykpXHJcblx0XHRcdFx0Z3JpZFBvcy5jb2wgPSB0aGlzLl9tYXhDb2xzIC0gKGRpbXMueCAtIDEpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koZ3JpZFBvcywgZGltcykpXHJcblx0XHRcdFx0Z3JpZFBvcy5yb3cgPSB0aGlzLl9tYXhSb3dzIC0gKGRpbXMueSAtIDEpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCF0aGlzLl9hdXRvUmVzaXplICYmIHRoaXMuX2xpbWl0VG9TY3JlZW4pIHtcclxuXHRcdFx0XHRpZiAoKGdyaWRQb3MuY29sICsgZGltcy54IC0gMSkgPiB0aGlzLl9nZXRDb250YWluZXJDb2x1bW5zKCkpIHtcclxuXHRcdFx0XHRcdGdyaWRQb3MuY29sID0gdGhpcy5fZ2V0Q29udGFpbmVyQ29sdW1ucygpIC0gKGRpbXMueCAtIDEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGdyaWRQb3MuY29sICE9IGl0ZW1Qb3MuY29sIHx8IGdyaWRQb3Mucm93ICE9IGl0ZW1Qb3Mucm93KSB7XHJcblx0XHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLnNldEdyaWRQb3NpdGlvbihncmlkUG9zLCB0aGlzLl9maXhUb0dyaWQpO1xyXG5cdFx0XHRcdHRoaXMuX3BsYWNlaG9sZGVyUmVmLmluc3RhbmNlLnNldEdyaWRQb3NpdGlvbihncmlkUG9zKTtcclxuXHJcblx0XHRcdFx0aWYgKFsndXAnLCAnZG93bicsICdsZWZ0JywgJ3JpZ2h0J10uaW5kZXhPZih0aGlzLmNhc2NhZGUpID49IDApIHtcclxuXHRcdFx0XHRcdHRoaXMuX2ZpeEdyaWRDb2xsaXNpb25zKGdyaWRQb3MsIGRpbXMsIHRydWUpO1xyXG5cdFx0XHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoZ3JpZFBvcywgZGltcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghdGhpcy5fZml4VG9HcmlkKSB7XHJcblx0XHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLnNldFBvc2l0aW9uKG5ld0wsIG5ld1QpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm9uRHJhZy5lbWl0KHRoaXMuX2RyYWdnaW5nSXRlbSk7XHJcblx0XHRcdHRoaXMuX2RyYWdnaW5nSXRlbS5vbkRyYWdFdmVudCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfcmVzaXplKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNSZXNpemluZykge1xyXG5cdFx0XHR2YXIgbW91c2VQb3MgPSB0aGlzLl9nZXRNb3VzZVBvc2l0aW9uKGUpO1xyXG5cdFx0XHR2YXIgaXRlbVBvcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRQb3NpdGlvbigpO1xyXG5cdFx0XHR2YXIgaXRlbURpbXMgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0RGltZW5zaW9ucygpO1xyXG5cdFx0XHR2YXIgbmV3VyA9IHRoaXMuX3Jlc2l6ZURpcmVjdGlvbiA9PSAnaGVpZ2h0JyA/IGl0ZW1EaW1zLndpZHRoIDogKG1vdXNlUG9zLmxlZnQgLSBpdGVtUG9zLmxlZnQgKyAxMCk7XHJcblx0XHRcdHZhciBuZXdIID0gdGhpcy5fcmVzaXplRGlyZWN0aW9uID09ICd3aWR0aCcgPyBpdGVtRGltcy5oZWlnaHQgOiAobW91c2VQb3MudG9wIC0gaXRlbVBvcy50b3AgKyAxMCk7XHJcblxyXG5cdFx0XHRpZiAobmV3VyA8IHRoaXMubWluV2lkdGgpXHJcblx0XHRcdFx0bmV3VyA9IHRoaXMubWluV2lkdGg7XHJcblx0XHRcdGlmIChuZXdIIDwgdGhpcy5taW5IZWlnaHQpXHJcblx0XHRcdFx0bmV3SCA9IHRoaXMubWluSGVpZ2h0O1xyXG5cdFx0XHRpZiAobmV3VyA8IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5XaWR0aClcclxuXHRcdFx0XHRuZXdXID0gdGhpcy5fcmVzaXppbmdJdGVtLm1pbldpZHRoO1xyXG5cdFx0XHRpZiAobmV3SCA8IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5IZWlnaHQpXHJcblx0XHRcdFx0bmV3SCA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5taW5IZWlnaHQ7XHJcblxyXG5cdFx0XHR2YXIgY2FsY1NpemUgPSB0aGlzLl9jYWxjdWxhdGVHcmlkU2l6ZShuZXdXLCBuZXdIKTtcclxuXHRcdFx0dmFyIGl0ZW1TaXplID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldFNpemUoKTtcclxuXHRcdFx0dmFyIGlHcmlkUG9zID0gdGhpcy5fcmVzaXppbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goaUdyaWRQb3MsIGNhbGNTaXplKSlcclxuXHRcdFx0XHRjYWxjU2l6ZS54ID0gKHRoaXMuX21heENvbHMgLSBpR3JpZFBvcy5jb2wpICsgMTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5faXNXaXRoaW5Cb3VuZHNZKGlHcmlkUG9zLCBjYWxjU2l6ZSkpXHJcblx0XHRcdFx0Y2FsY1NpemUueSA9ICh0aGlzLl9tYXhSb3dzIC0gaUdyaWRQb3Mucm93KSArIDE7XHJcblxyXG5cdFx0XHRjYWxjU2l6ZSA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5maXhSZXNpemUoY2FsY1NpemUpO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKGNhbGNTaXplLnggIT0gaXRlbVNpemUueCB8fCBjYWxjU2l6ZS55ICE9IGl0ZW1TaXplLnkpIHtcclxuXHRcdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0uc2V0U2l6ZShjYWxjU2l6ZSwgZmFsc2UpO1xyXG5cdFx0XHRcdHRoaXMuX3BsYWNlaG9sZGVyUmVmLmluc3RhbmNlLnNldFNpemUoY2FsY1NpemUpO1xyXG5cclxuXHRcdFx0XHRpZiAoWyd1cCcsICdkb3duJywgJ2xlZnQnLCAncmlnaHQnXS5pbmRleE9mKHRoaXMuY2FzY2FkZSkgPj0gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5fZml4R3JpZENvbGxpc2lvbnMoaUdyaWRQb3MsIGNhbGNTaXplLCB0cnVlKTtcclxuXHRcdFx0XHRcdHRoaXMuX2Nhc2NhZGVHcmlkKGlHcmlkUG9zLCBjYWxjU2l6ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuX2ZpeFRvR3JpZClcclxuXHRcdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0uc2V0RGltZW5zaW9ucyhuZXdXLCBuZXdIKTtcclxuXHJcblx0XHRcdHZhciBiaWdHcmlkID0gdGhpcy5fbWF4R3JpZFNpemUoaXRlbVBvcy5sZWZ0ICsgbmV3VyArICgyICogZS5tb3ZlbWVudFgpLCBpdGVtUG9zLnRvcCArIG5ld0ggKyAoMiAqIGUubW92ZW1lbnRZKSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fcmVzaXplRGlyZWN0aW9uID09ICdoZWlnaHQnKSBiaWdHcmlkLnggPSBpR3JpZFBvcy5jb2wgKyBpdGVtU2l6ZS54O1xyXG5cdFx0XHRpZiAodGhpcy5fcmVzaXplRGlyZWN0aW9uID09ICd3aWR0aCcpIGJpZ0dyaWQueSA9IGlHcmlkUG9zLnJvdyArIGl0ZW1TaXplLnk7XHJcblxyXG5cdFx0XHR0aGlzLm9uUmVzaXplLmVtaXQodGhpcy5fcmVzaXppbmdJdGVtKTtcclxuXHRcdFx0dGhpcy5fcmVzaXppbmdJdGVtLm9uUmVzaXplRXZlbnQoKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX29uTW91c2VVcChlOiBhbnkpOiBib29sZWFuIHtcclxuXHRcdGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcclxuXHRcdFx0dGhpcy5fZHJhZ1N0b3AoZSk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5pc1Jlc2l6aW5nKSB7XHJcblx0XHRcdHRoaXMuX3Jlc2l6ZVN0b3AoZSk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2RyYWdTdG9wKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZykge1xyXG5cdFx0XHR0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBpdGVtUG9zID0gdGhpcy5fZHJhZ2dpbmdJdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLnNhdmVQb3NpdGlvbihpdGVtUG9zKTtcclxuXHRcdFx0dGhpcy5fYWRkVG9HcmlkKHRoaXMuX2RyYWdnaW5nSXRlbSk7XHJcblxyXG5cdFx0XHR0aGlzLl9jYXNjYWRlR3JpZCgpO1xyXG5cclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLnN0b3BNb3ZpbmcoKTtcclxuXHRcdFx0dGhpcy5fZHJhZ2dpbmdJdGVtLm9uRHJhZ1N0b3BFdmVudCgpO1xyXG5cdFx0XHR0aGlzLm9uRHJhZ1N0b3AuZW1pdCh0aGlzLl9kcmFnZ2luZ0l0ZW0pO1xyXG5cdFx0XHR0aGlzLl9kcmFnZ2luZ0l0ZW0gPSBudWxsO1xyXG5cdFx0XHR0aGlzLl9wb3NPZmZzZXQgPSBudWxsO1xyXG5cdFx0XHR0aGlzLl9wbGFjZWhvbGRlclJlZi5kZXN0cm95KCk7XHJcblxyXG5cdFx0XHR0aGlzLm9uSXRlbUNoYW5nZS5lbWl0KHRoaXMuX2l0ZW1zLm1hcCgoaXRlbTogTmdHcmlkSXRlbSkgPT4gaXRlbS5nZXRFdmVudE91dHB1dCgpKSk7XHJcblxyXG5cdFx0XHRpZiAodGhpcy5fem9vbU9uRHJhZykge1xyXG5cdFx0XHRcdHRoaXMuX3Jlc2V0Wm9vbSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZXNpemVTdG9wKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuaXNSZXNpemluZykge1xyXG5cdFx0XHR0aGlzLmlzUmVzaXppbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBpdGVtRGltcyA9IHRoaXMuX3Jlc2l6aW5nSXRlbS5nZXRTaXplKCk7XHJcblxyXG5cdFx0XHR0aGlzLl9yZXNpemluZ0l0ZW0uc2V0U2l6ZShpdGVtRGltcyk7XHJcblx0XHRcdHRoaXMuX2FkZFRvR3JpZCh0aGlzLl9yZXNpemluZ0l0ZW0pO1xyXG5cclxuXHRcdFx0dGhpcy5fY2FzY2FkZUdyaWQoKTtcclxuXHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbS5zdG9wTW92aW5nKCk7XHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbS5vblJlc2l6ZVN0b3BFdmVudCgpO1xyXG5cdFx0XHR0aGlzLm9uUmVzaXplU3RvcC5lbWl0KHRoaXMuX3Jlc2l6aW5nSXRlbSk7XHJcblx0XHRcdHRoaXMuX3Jlc2l6aW5nSXRlbSA9IG51bGw7XHJcblx0XHRcdHRoaXMuX3Jlc2l6ZURpcmVjdGlvbiA9IG51bGw7XHJcblx0XHRcdHRoaXMuX3BsYWNlaG9sZGVyUmVmLmRlc3Ryb3koKTtcclxuXHJcblx0XHRcdHRoaXMub25JdGVtQ2hhbmdlLmVtaXQodGhpcy5faXRlbXMubWFwKChpdGVtOiBOZ0dyaWRJdGVtKSA9PiBpdGVtLmdldEV2ZW50T3V0cHV0KCkpKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX21heEdyaWRTaXplKHc6IG51bWJlciwgaDogbnVtYmVyKTogTmdHcmlkSXRlbVNpemUge1xyXG5cdFx0dmFyIHNpemV4ID0gTWF0aC5jZWlsKHcgLyAodGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpKTtcclxuXHRcdHZhciBzaXpleSA9IE1hdGguY2VpbChoIC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpO1xyXG5cdFx0cmV0dXJuIHsgJ3gnOiBzaXpleCwgJ3knOiBzaXpleSB9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfY2FsY3VsYXRlR3JpZFNpemUod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiBOZ0dyaWRJdGVtU2l6ZSB7XHJcblx0XHR3aWR0aCArPSB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0O1xyXG5cdFx0aGVpZ2h0ICs9IHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b207XHJcblxyXG5cdFx0dmFyIHNpemV4ID0gTWF0aC5tYXgodGhpcy5taW5Db2xzLCBNYXRoLnJvdW5kKHdpZHRoIC8gKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSkpO1xyXG5cdFx0dmFyIHNpemV5ID0gTWF0aC5tYXgodGhpcy5taW5Sb3dzLCBNYXRoLnJvdW5kKGhlaWdodCAvICh0aGlzLnJvd0hlaWdodCArIHRoaXMubWFyZ2luVG9wICsgdGhpcy5tYXJnaW5Cb3R0b20pKSk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goeyBjb2w6IDEsIHJvdzogMSB9LCB7IHg6IHNpemV4LCB5OiBzaXpleSB9KSkgc2l6ZXggPSB0aGlzLl9tYXhDb2xzO1xyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koeyBjb2w6IDEsIHJvdzogMSB9LCB7IHg6IHNpemV4LCB5OiBzaXpleSB9KSkgc2l6ZXkgPSB0aGlzLl9tYXhSb3dzO1xyXG5cclxuXHRcdHJldHVybiB7ICd4Jzogc2l6ZXgsICd5Jzogc2l6ZXkgfTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2NhbGN1bGF0ZUdyaWRQb3NpdGlvbihsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKTogTmdHcmlkSXRlbVBvc2l0aW9uIHtcclxuXHRcdHZhciBjb2wgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGxlZnQgLyAodGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpKSArIDEpO1xyXG5cdFx0dmFyIHJvdyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQodG9wIC8gKHRoaXMucm93SGVpZ2h0ICsgdGhpcy5tYXJnaW5Ub3AgKyB0aGlzLm1hcmdpbkJvdHRvbSkpICsgMSk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1goeyBjb2w6IGNvbCwgcm93OiByb3cgfSwgeyB4OiAxLCB5OiAxIH0pKSBjb2wgPSB0aGlzLl9tYXhDb2xzO1xyXG5cdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koeyBjb2w6IGNvbCwgcm93OiByb3cgfSwgeyB4OiAxLCB5OiAxIH0pKSByb3cgPSB0aGlzLl9tYXhSb3dzO1xyXG5cclxuXHRcdHJldHVybiB7ICdjb2wnOiBjb2wsICdyb3cnOiByb3cgfTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2hhc0dyaWRDb2xsaXNpb24ocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogYm9vbGVhbiB7XHJcblx0XHR2YXIgcG9zaXRpb25zID0gdGhpcy5fZ2V0Q29sbGlzaW9ucyhwb3MsIGRpbXMpO1xyXG5cclxuXHRcdGlmIChwb3NpdGlvbnMgPT0gbnVsbCB8fCBwb3NpdGlvbnMubGVuZ3RoID09IDApIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRyZXR1cm4gcG9zaXRpb25zLnNvbWUoKHY6IE5nR3JpZEl0ZW0pID0+IHtcclxuXHRcdFx0cmV0dXJuICEodiA9PT0gbnVsbCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldENvbGxpc2lvbnMocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKTogQXJyYXk8TmdHcmlkSXRlbT4ge1xyXG5cdFx0Y29uc3QgcmV0dXJuczogQXJyYXk8TmdHcmlkSXRlbT4gPSBbXTtcclxuXHRcdFxyXG5cdFx0Zm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IGRpbXMueTsgaisrKSB7XHJcblx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtwb3Mucm93ICsgal0gIT0gbnVsbCkge1xyXG5cdFx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBkaW1zLng7IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXVtwb3MuY29sICsgaV0gIT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBpdGVtOiBOZ0dyaWRJdGVtID0gdGhpcy5faXRlbUdyaWRbcG9zLnJvdyArIGpdW3Bvcy5jb2wgKyBpXTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGlmIChyZXR1cm5zLmluZGV4T2YoaXRlbSkgPCAwKVxyXG5cdFx0XHRcdFx0XHRcdHJldHVybnMucHVzaChpdGVtKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1Qb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1EaW1zOiBOZ0dyaWRJdGVtU2l6ZSA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aSA9IGl0ZW1Qb3MuY29sICsgaXRlbURpbXMueCAtIHBvcy5jb2w7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJldHVybnM7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9maXhHcmlkQ29sbGlzaW9ucyhwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiwgZGltczogTmdHcmlkSXRlbVNpemUsIHNob3VsZFNhdmU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xyXG5cdFx0d2hpbGUgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRjb25zdCBjb2xsaXNpb25zOiBBcnJheTxOZ0dyaWRJdGVtPiA9IHRoaXMuX2dldENvbGxpc2lvbnMocG9zLCBkaW1zKTtcclxuXHJcblx0XHRcdHRoaXMuX3JlbW92ZUZyb21HcmlkKGNvbGxpc2lvbnNbMF0pO1xyXG5cclxuXHRcdFx0Y29uc3QgaXRlbVBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gY29sbGlzaW9uc1swXS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0Y29uc3QgaXRlbURpbXM6IE5nR3JpZEl0ZW1TaXplID0gY29sbGlzaW9uc1swXS5nZXRTaXplKCk7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKHRoaXMuY2FzY2FkZSkge1xyXG5cdFx0XHRcdGNhc2UgJ3VwJzpcclxuXHRcdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0Y29uc3Qgb2xkUm93OiBudW1iZXIgPSBpdGVtUG9zLnJvdztcclxuXHRcdFx0XHRcdGl0ZW1Qb3Mucm93ID0gcG9zLnJvdyArIGRpbXMueTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1koaXRlbVBvcywgaXRlbURpbXMpKSB7XHJcblx0XHRcdFx0XHRcdGl0ZW1Qb3MuY29sID0gcG9zLmNvbCArIGRpbXMueDtcclxuXHRcdFx0XHRcdFx0aXRlbVBvcy5yb3cgPSBvbGRSb3c7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0XHRjYXNlICdyaWdodCc6XHJcblx0XHRcdFx0XHRjb25zdCBvbGRDb2w6IG51bWJlciA9IGl0ZW1Qb3MuY29sO1xyXG5cdFx0XHRcdFx0aXRlbVBvcy5jb2wgPSBwb3MuY29sICsgZGltcy54O1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWChpdGVtUG9zLCBpdGVtRGltcykpIHtcclxuXHRcdFx0XHRcdFx0aXRlbVBvcy5jb2wgPSBvbGRDb2w7XHJcblx0XHRcdFx0XHRcdGl0ZW1Qb3Mucm93ID0gcG9zLnJvdyArIGRpbXMueTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoc2hvdWxkU2F2ZSkge1xyXG5cdFx0XHRcdGNvbGxpc2lvbnNbMF0uc2F2ZVBvc2l0aW9uKGl0ZW1Qb3MpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbGxpc2lvbnNbMF0uc2V0R3JpZFBvc2l0aW9uKGl0ZW1Qb3MpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuX2ZpeEdyaWRDb2xsaXNpb25zKGl0ZW1Qb3MsIGl0ZW1EaW1zLCBzaG91bGRTYXZlKTtcclxuXHRcdFx0dGhpcy5fYWRkVG9HcmlkKGNvbGxpc2lvbnNbMF0pO1xyXG5cdFx0XHRjb2xsaXNpb25zWzBdLm9uQ2FzY2FkZUV2ZW50KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX2xpbWl0R3JpZChtYXhDb2xzOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdGNvbnN0IGl0ZW1zOiBBcnJheTxOZ0dyaWRJdGVtPiA9IHRoaXMuX2l0ZW1zLnNsaWNlKCk7XHJcblx0XHRcclxuXHRcdGl0ZW1zLnNvcnQoKGE6IE5nR3JpZEl0ZW0sIGI6IE5nR3JpZEl0ZW0pID0+IHtcclxuXHRcdFx0bGV0IGFQb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGEuZ2V0U2F2ZWRQb3NpdGlvbigpO1xyXG5cdFx0XHRsZXQgYlBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gYi5nZXRTYXZlZFBvc2l0aW9uKCk7XHJcblxyXG5cdFx0XHRpZiAoYVBvcy5yb3cgPT0gYlBvcy5yb3cpIHtcclxuXHRcdFx0XHRyZXR1cm4gYVBvcy5jb2wgPT0gYlBvcy5jb2wgPyAwIDogKGFQb3MuY29sIDwgYlBvcy5jb2wgPyAtMSA6IDEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBhUG9zLnJvdyA8IGJQb3Mucm93ID8gLTEgOiAxO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdFxyXG5cdFx0Y29uc3QgY29sdW1uTWF4OiB7IFtjb2w6IG51bWJlcl06IG51bWJlciB9ID0ge307XHJcblx0XHRjb25zdCBsYXJnZXN0R2FwOiB7IFtjb2w6IG51bWJlcl06IG51bWJlciB9ID0ge307XHJcblx0XHRcclxuXHRcdGZvciAobGV0IGk6IG51bWJlciA9IDE7IGkgPD0gbWF4Q29sczsgaSsrKSB7XHJcblx0XHRcdGNvbHVtbk1heFtpXSA9IDE7XHJcblx0XHRcdGxhcmdlc3RHYXBbaV0gPSAxO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRjb25zdCBjdXJQb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IHsgY29sOiAxLCByb3c6IDEgfTtcclxuXHRcdGxldCBjdXJyZW50Um93OiBudW1iZXIgPSAxO1xyXG5cdFx0XHJcblx0XHRjb25zdCB3aWxsQ2FzY2FkZTogKGl0ZW06IE5nR3JpZEl0ZW0sIGNvbDogbnVtYmVyKSA9PiBib29sZWFuID0gKGl0ZW06IE5nR3JpZEl0ZW0sIGNvbDogbnVtYmVyKSA9PiB7XHJcblx0XHRcdGZvciAobGV0IGk6IG51bWJlciA9IGNvbDsgaSA8IGNvbCArIGl0ZW0uc2l6ZXg7IGkrKykge1xyXG5cdFx0XHRcdGlmIChjb2x1bW5NYXhbaV0gPT0gY3VycmVudFJvdykgcmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdGludGVyZmFjZSBHcmlkQmxvY2sge1xyXG5cdFx0XHRzdGFydDogbnVtYmVyO1xyXG5cdFx0XHRlbmQ6IG51bWJlcjtcclxuXHRcdFx0bGVuZ3RoOiBudW1iZXI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHdoaWxlIChpdGVtcy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGNvbnN0IGNvbHVtbnM6IEFycmF5PEdyaWRCbG9jaz4gPSBbXTtcclxuXHRcdFx0bGV0IG5ld0Jsb2NrOiBHcmlkQmxvY2sgPSB7XHJcblx0XHRcdFx0c3RhcnQ6IDEsXHJcblx0XHRcdFx0ZW5kOiAxLFxyXG5cdFx0XHRcdGxlbmd0aDogMCxcclxuXHRcdFx0fTtcclxuXHRcdFx0XHJcblx0XHRcdGZvciAobGV0IGNvbDogbnVtYmVyID0gMTsgY29sIDw9IG1heENvbHM7IGNvbCsrKSB7XHJcblx0XHRcdFx0aWYgKGNvbHVtbk1heFtjb2xdIDw9IGN1cnJlbnRSb3cpIHtcclxuXHRcdFx0XHRcdGlmIChuZXdCbG9jay5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdFx0XHRuZXdCbG9jay5zdGFydCA9IGNvbDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0bmV3QmxvY2subGVuZ3RoKys7XHJcblx0XHRcdFx0XHRuZXdCbG9jay5lbmQgPSBjb2wgKyAxO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobmV3QmxvY2subGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0Y29sdW1ucy5wdXNoKG5ld0Jsb2NrKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0bmV3QmxvY2sgPSB7XHJcblx0XHRcdFx0XHRcdHN0YXJ0OiBjb2wsXHJcblx0XHRcdFx0XHRcdGVuZDogY29sLFxyXG5cdFx0XHRcdFx0XHRsZW5ndGg6IDAsXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0aWYgKG5ld0Jsb2NrLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRjb2x1bW5zLnB1c2gobmV3QmxvY2spO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRsZXQgdGVtcENvbHVtbnM6IEFycmF5PG51bWJlcj4gPSBjb2x1bW5zLm1hcCgoYmxvY2s6IEdyaWRCbG9jaykgPT4gYmxvY2subGVuZ3RoKTtcclxuXHRcdFx0Y29uc3QgY3VycmVudEl0ZW1zOiBBcnJheTxOZ0dyaWRJdGVtPiA9IFtdO1xyXG5cdFx0XHRcclxuXHRcdFx0d2hpbGUgKGl0ZW1zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRjb25zdCBpdGVtID0gaXRlbXNbMF07XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKGl0ZW0ucm93ID4gY3VycmVudFJvdykgYnJlYWs7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0bGV0IGZpdHM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdFx0XHRmb3IgKGxldCB4IGluIHRlbXBDb2x1bW5zKSB7XHJcblx0XHRcdFx0XHRpZiAoaXRlbS5zaXpleCA8PSB0ZW1wQ29sdW1uc1t4XSkge1xyXG5cdFx0XHRcdFx0XHR0ZW1wQ29sdW1uc1t4XSAtPSBpdGVtLnNpemV4O1xyXG5cdFx0XHRcdFx0XHRmaXRzID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGl0ZW0uc2l6ZXggPiB0ZW1wQ29sdW1uc1t4XSkge1xyXG5cdFx0XHRcdFx0XHR0ZW1wQ29sdW1uc1t4XSA9IDA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChmaXRzKSB7XHJcblx0XHRcdFx0XHRjdXJyZW50SXRlbXMucHVzaChpdGVtcy5zaGlmdCgpKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAoY3VycmVudEl0ZW1zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRjb25zdCBpdGVtUG9zaXRpb25zOiBBcnJheTxudW1iZXI+ID0gW107XHJcblx0XHRcdFx0bGV0IGxhc3RQb3NpdGlvbjogbnVtYmVyID0gbWF4Q29scztcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gY3VycmVudEl0ZW1zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblx0XHRcdFx0XHRsZXQgbWF4UG9zaXRpb24gPSAxO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRmb3IgKGxldCBqID0gY29sdW1ucy5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoY29sdW1uc1tqXS5zdGFydCA+IGxhc3RQb3NpdGlvbikgY29udGludWU7XHJcblx0XHRcdFx0XHRcdGlmIChjb2x1bW5zW2pdLnN0YXJ0ID4gKG1heENvbHMgLSBjdXJyZW50SXRlbXNbaV0uc2l6ZXgpKSBjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0aWYgKGNvbHVtbnNbal0ubGVuZ3RoIDwgY3VycmVudEl0ZW1zW2ldLnNpemV4KSBjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0aWYgKGxhc3RQb3NpdGlvbiA8IGNvbHVtbnNbal0uZW5kICYmIChsYXN0UG9zaXRpb24gLSBjb2x1bW5zW2pdLnN0YXJ0KSA8IGN1cnJlbnRJdGVtc1tpXS5zaXpleCkgY29udGludWU7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRtYXhQb3NpdGlvbiA9IChsYXN0UG9zaXRpb24gPCBjb2x1bW5zW2pdLmVuZCA/IGxhc3RQb3NpdGlvbiA6IGNvbHVtbnNbal0uZW5kKSAtIGN1cnJlbnRJdGVtc1tpXS5zaXpleFxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aXRlbVBvc2l0aW9uc1tpXSA9IE1hdGgubWluKG1heFBvc2l0aW9uLCBjdXJyZW50SXRlbXNbaV0ucm93ID09IGN1cnJlbnRSb3cgPyBjdXJyZW50SXRlbXNbaV0uY29sIDogMSk7XHJcblx0XHRcdFx0XHRsYXN0UG9zaXRpb24gPSBpdGVtUG9zaXRpb25zW2ldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRsZXQgbWluUG9zaXRpb246IG51bWJlciA9IDE7XHJcblx0XHRcdFx0bGV0IGN1cnJlbnRJdGVtOiBudW1iZXIgPSAwO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHdoaWxlIChjdXJyZW50SXRlbXMubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgaXRlbTogTmdHcmlkSXRlbSA9IGN1cnJlbnRJdGVtcy5zaGlmdCgpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IGNvbHVtbnMubGVuZ3RoOyBqKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKG1pblBvc2l0aW9uID4gY29sdW1uc1tqXS5lbmQpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHRpZiAobWluUG9zaXRpb24gPiBjb2x1bW5zW2pdLnN0YXJ0ICYmIChjb2x1bW5zW2pdLmVuZCAtIG1pblBvc2l0aW9uKSA8IGl0ZW0uc2l6ZXgpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0XHRpZiAobWluUG9zaXRpb24gPCAgY29sdW1uc1tqXS5zdGFydCkgbWluUG9zaXRpb24gPSBjb2x1bW5zW2pdLnN0YXJ0O1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aXRlbS5zZXRHcmlkUG9zaXRpb24oeyBjb2w6IE1hdGgubWF4KG1pblBvc2l0aW9uLCBpdGVtUG9zaXRpb25zW2N1cnJlbnRJdGVtXSksIHJvdzogY3VycmVudFJvdyB9KTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0bWluUG9zaXRpb24gPSBpdGVtLmN1cnJlbnRDb2wgKyBpdGVtLnNpemV4O1xyXG5cdFx0XHRcdFx0Y3VycmVudEl0ZW0rKztcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gaXRlbS5jdXJyZW50Q29sOyBpIDwgaXRlbS5jdXJyZW50Q29sICsgaXRlbS5zaXpleDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdGNvbHVtbk1heFtpXSA9IGl0ZW0uY3VycmVudFJvdyArIGl0ZW0uc2l6ZXk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKGN1cnJlbnRJdGVtcy5sZW5ndGggPT09IDAgJiYgY29sdW1ucy5sZW5ndGggPT09IDEgJiYgY29sdW1uc1swXS5sZW5ndGggPj0gbWF4Q29scykge1x0Ly9cdE9ubHkgb25lIGJsb2NrLCBidXQgbm8gaXRlbXMgZml0LiBNZWFucyB0aGUgbmV4dCBpdGVtIGlzIHRvbyBsYXJnZVxyXG5cdFx0XHRcdGNvbnN0IGl0ZW06IE5nR3JpZEl0ZW0gPSBpdGVtcy5zaGlmdCgpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGl0ZW0uc2V0R3JpZFBvc2l0aW9uKHsgY29sOiAxLCByb3c6IGN1cnJlbnRSb3cgfSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gaXRlbS5jdXJyZW50Q29sOyBpIDwgaXRlbS5jdXJyZW50Q29sICsgaXRlbS5zaXpleDsgaSsrKSB7XHJcblx0XHRcdFx0XHRjb2x1bW5NYXhbaV0gPSBpdGVtLmN1cnJlbnRSb3cgKyBpdGVtLnNpemV5O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0bGV0IG5ld1JvdzogbnVtYmVyID0gMDtcclxuXHRcdFx0XHJcblx0XHRcdGZvciAobGV0IHggaW4gY29sdW1uTWF4KSB7XHJcblx0XHRcdFx0aWYgKGNvbHVtbk1heFt4XSA+IGN1cnJlbnRSb3cgJiYgKG5ld1JvdyA9PSAwIHx8IGNvbHVtbk1heFt4XSA8IG5ld1JvdykpIHtcclxuXHRcdFx0XHRcdG5ld1JvdyA9IGNvbHVtbk1heFt4XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGN1cnJlbnRSb3cgPSBuZXdSb3cgPT0gMCA/IGN1cnJlbnRSb3cgKyAxIDogbmV3Um93O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfY2FzY2FkZUdyaWQocG9zPzogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zPzogTmdHcmlkSXRlbVNpemUsIHNob3VsZFNhdmU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fZGVzdHJveWVkKSByZXR1cm47XHJcblx0XHRpZiAocG9zICYmICFkaW1zKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjYXNjYWRlIHdpdGggb25seSBwb3NpdGlvbiBhbmQgbm90IGRpbWVuc2lvbnMnKTtcclxuXHJcblx0XHRpZiAodGhpcy5pc0RyYWdnaW5nICYmIHRoaXMuX2RyYWdnaW5nSXRlbSAmJiAhcG9zICYmICFkaW1zKSB7XHJcblx0XHRcdHBvcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdFx0ZGltcyA9IHRoaXMuX2RyYWdnaW5nSXRlbS5nZXRTaXplKCk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuaXNSZXNpemluZyAmJiB0aGlzLl9yZXNpemluZ0l0ZW0gJiYgIXBvcyAmJiAhZGltcykge1xyXG5cdFx0XHRwb3MgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRcdGRpbXMgPSB0aGlzLl9yZXNpemluZ0l0ZW0uZ2V0U2l6ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHN3aXRjaCAodGhpcy5jYXNjYWRlKSB7XHJcblx0XHRcdGNhc2UgJ3VwJzpcclxuXHRcdFx0Y2FzZSAnZG93bic6XHJcblx0XHRcdFx0Y29uc3QgbG93Um93OiBBcnJheTxudW1iZXI+ID0gWzBdO1xyXG5cclxuXHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDw9IHRoaXMuX2N1ck1heENvbDsgaSsrKVxyXG5cdFx0XHRcdFx0bG93Um93W2ldID0gMTtcclxuXHJcblx0XHRcdFx0Zm9yIChsZXQgcjogbnVtYmVyID0gMTsgciA8PSB0aGlzLl9jdXJNYXhSb3c7IHIrKykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdID09IHVuZGVmaW5lZCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgYzogbnVtYmVyID0gMTsgYyA8PSB0aGlzLl9jdXJNYXhDb2w7IGMrKykge1xyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcl0gPT0gdW5kZWZpbmVkKSBicmVhaztcclxuXHRcdFx0XHRcdFx0aWYgKHIgPCBsb3dSb3dbY10pIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdW2NdICE9IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCBpdGVtOiBOZ0dyaWRJdGVtID0gdGhpcy5faXRlbUdyaWRbcl1bY107XHJcblx0XHRcdFx0XHRcdFx0aWYgKGl0ZW0uaXNGaXhlZCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1EaW1zOiBOZ0dyaWRJdGVtU2l6ZSA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1Qb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChpdGVtUG9zLmNvbCAhPSBjIHx8IGl0ZW1Qb3Mucm93ICE9IHIpIGNvbnRpbnVlO1x0Ly9cdElmIHRoaXMgaXMgbm90IHRoZSBlbGVtZW50J3Mgc3RhcnRcclxuXHJcblx0XHRcdFx0XHRcdFx0bGV0IGxvd2VzdDogbnVtYmVyID0gbG93Um93W2NdO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDwgaXRlbURpbXMueDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRsb3dlc3QgPSBNYXRoLm1heChsb3dSb3dbKGMgKyBpKV0sIGxvd2VzdCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAocG9zICYmIChjICsgaXRlbURpbXMueCkgPiBwb3MuY29sICYmIGMgPCAocG9zLmNvbCArIGRpbXMueCkpIHsgICAgICAgICAgLy9cdElmIG91ciBlbGVtZW50IGlzIGluIG9uZSBvZiB0aGUgaXRlbSdzIGNvbHVtbnNcclxuXHRcdFx0XHRcdFx0XHRcdGlmICgociA+PSBwb3Mucm93ICYmIHIgPCAocG9zLnJvdyArIGRpbXMueSkpIHx8ICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHRJZiB0aGlzIHJvdyBpcyBvY2N1cGllZCBieSBvdXIgZWxlbWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQoKGl0ZW1EaW1zLnkgPiAocG9zLnJvdyAtIGxvd2VzdCkpICYmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHRPciB0aGUgaXRlbSBjYW4ndCBmaXQgYWJvdmUgb3VyIGVsZW1lbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQociA+PSAocG9zLnJvdyArIGRpbXMueSkgJiYgbG93ZXN0IDwgKHBvcy5yb3cgKyBkaW1zLnkpKSkpIHsgICAgLy9cdFx0QW5kIHRoaXMgcm93IGlzIGJlbG93IG91ciBlbGVtZW50LCBidXQgd2UgaGF2ZW4ndCBjYXVnaHQgaXRcclxuXHRcdFx0XHRcdFx0XHRcdFx0bG93ZXN0ID0gTWF0aC5tYXgobG93ZXN0LCBwb3Mucm93ICsgZGltcy55KTsgICAgICAgICAgICAgICAgICAgICAgICAvL1x0U2V0IHRoZSBsb3dlc3Qgcm93IHRvIGJlIGJlbG93IGl0XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAobG93ZXN0ICE9IGl0ZW1Qb3Mucm93KSB7XHQvL1x0SWYgdGhlIGl0ZW0gaXMgbm90IGFscmVhZHkgb24gdGhpcyByb3cgbW92ZSBpdCB1cFxyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChzaG91bGRTYXZlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uc2F2ZVBvc2l0aW9uKHsgY29sOiBjLCByb3c6IGxvd2VzdCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uc2V0R3JpZFBvc2l0aW9uKHsgY29sOiBjLCByb3c6IGxvd2VzdCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5vbkNhc2NhZGVFdmVudCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGl0ZW1EaW1zLng7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0bG93Um93W2MgKyBpXSA9IGxvd2VzdCArIGl0ZW1EaW1zLnk7XHQvL1x0VXBkYXRlIHRoZSBsb3dlc3Qgcm93IHRvIGJlIGJlbG93IHRoZSBpdGVtXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdGNvbnN0IGxvd0NvbDogQXJyYXk8bnVtYmVyPiA9IFswXTtcclxuXHJcblx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMTsgaSA8PSB0aGlzLl9jdXJNYXhSb3c7IGkrKylcclxuXHRcdFx0XHRcdGxvd0NvbFtpXSA9IDE7XHJcblxyXG5cdFx0XHRcdGZvciAobGV0IHI6IG51bWJlciA9IDE7IHIgPD0gdGhpcy5fY3VyTWF4Um93OyByKyspIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXSA9PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdGZvciAobGV0IGM6IG51bWJlciA9IDE7IGMgPD0gdGhpcy5fY3VyTWF4Q29sOyBjKyspIHtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMuX2l0ZW1HcmlkW3JdID09IHVuZGVmaW5lZCkgYnJlYWs7XHJcblx0XHRcdFx0XHRcdGlmIChjIDwgbG93Q29sW3JdKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLl9pdGVtR3JpZFtyXVtjXSAhPSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgaXRlbTogTmdHcmlkSXRlbSA9IHRoaXMuX2l0ZW1HcmlkW3JdW2NdO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1EaW1zOiBOZ0dyaWRJdGVtU2l6ZSA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGl0ZW1Qb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChpdGVtUG9zLmNvbCAhPSBjIHx8IGl0ZW1Qb3Mucm93ICE9IHIpIGNvbnRpbnVlO1x0Ly9cdElmIHRoaXMgaXMgbm90IHRoZSBlbGVtZW50J3Mgc3RhcnRcclxuXHJcblx0XHRcdFx0XHRcdFx0bGV0IGxvd2VzdDogbnVtYmVyID0gbG93Q29sW3JdO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRmb3IgKGxldCBpOiBudW1iZXIgPSAxOyBpIDwgaXRlbURpbXMueTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRsb3dlc3QgPSBNYXRoLm1heChsb3dDb2xbKHIgKyBpKV0sIGxvd2VzdCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAocG9zICYmIChyICsgaXRlbURpbXMueSkgPiBwb3Mucm93ICYmIHIgPCAocG9zLnJvdyArIGRpbXMueSkpIHsgICAgICAgICAgLy9cdElmIG91ciBlbGVtZW50IGlzIGluIG9uZSBvZiB0aGUgaXRlbSdzIHJvd3NcclxuXHRcdFx0XHRcdFx0XHRcdGlmICgoYyA+PSBwb3MuY29sICYmIGMgPCAocG9zLmNvbCArIGRpbXMueCkpIHx8ICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHRJZiB0aGlzIGNvbCBpcyBvY2N1cGllZCBieSBvdXIgZWxlbWVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQoKGl0ZW1EaW1zLnggPiAocG9zLmNvbCAtIGxvd2VzdCkpICYmICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vXHRPciB0aGUgaXRlbSBjYW4ndCBmaXQgYWJvdmUgb3VyIGVsZW1lbnRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQoYyA+PSAocG9zLmNvbCArIGRpbXMueCkgJiYgbG93ZXN0IDwgKHBvcy5jb2wgKyBkaW1zLngpKSkpIHsgICAgLy9cdFx0QW5kIHRoaXMgY29sIGlzIGJlbG93IG91ciBlbGVtZW50LCBidXQgd2UgaGF2ZW4ndCBjYXVnaHQgaXRcclxuXHRcdFx0XHRcdFx0XHRcdFx0bG93ZXN0ID0gTWF0aC5tYXgobG93ZXN0LCBwb3MuY29sICsgZGltcy54KTsgICAgICAgICAgICAgICAgICAgICAgICAvL1x0U2V0IHRoZSBsb3dlc3QgY29sIHRvIGJlIGJlbG93IGl0XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiAobG93ZXN0ICE9IGl0ZW1Qb3MuY29sKSB7XHQvL1x0SWYgdGhlIGl0ZW0gaXMgbm90IGFscmVhZHkgb24gdGhpcyBjb2wgbW92ZSBpdCB1cFxyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUdyaWQoaXRlbSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChzaG91bGRTYXZlKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uc2F2ZVBvc2l0aW9uKHsgY29sOiBjLCByb3c6IGxvd2VzdCB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGl0ZW0uc2V0R3JpZFBvc2l0aW9uKHsgY29sOiBsb3dlc3QsIHJvdzogciB9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdFx0aXRlbS5vbkNhc2NhZGVFdmVudCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5fYWRkVG9HcmlkKGl0ZW0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGl0ZW1EaW1zLnk7IGkrKykge1xyXG5cdFx0XHRcdFx0XHRcdFx0bG93Q29sW3IgKyBpXSA9IGxvd2VzdCArIGl0ZW1EaW1zLng7XHQvL1x0VXBkYXRlIHRoZSBsb3dlc3QgY29sIHRvIGJlIGJlbG93IHRoZSBpdGVtXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZml4R3JpZFBvc2l0aW9uKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSk6IE5nR3JpZEl0ZW1Qb3NpdGlvbiB7XHJcblx0XHR3aGlsZSAodGhpcy5faGFzR3JpZENvbGxpc2lvbihwb3MsIGRpbXMpIHx8ICF0aGlzLl9pc1dpdGhpbkJvdW5kcyhwb3MsIGRpbXMpKSB7XHJcblx0XHRcdGlmICh0aGlzLl9oYXNHcmlkQ29sbGlzaW9uKHBvcywgZGltcykpIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHRoaXMuY2FzY2FkZSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAndXAnOlxyXG5cdFx0XHRcdFx0Y2FzZSAnZG93bic6XHJcblx0XHRcdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdFx0XHRwb3Mucm93Kys7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnbGVmdCc6XHJcblx0XHRcdFx0XHRjYXNlICdyaWdodCc6XHJcblx0XHRcdFx0XHRcdHBvcy5jb2wrKztcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0aWYgKCF0aGlzLl9pc1dpdGhpbkJvdW5kc1kocG9zLCBkaW1zKSkge1xyXG5cdFx0XHRcdHBvcy5jb2wrKztcclxuXHRcdFx0XHRwb3Mucm93ID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIXRoaXMuX2lzV2l0aGluQm91bmRzWChwb3MsIGRpbXMpKSB7XHJcblx0XHRcdFx0cG9zLnJvdysrO1xyXG5cdFx0XHRcdHBvcy5jb2wgPSAxO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcG9zO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfaXNXaXRoaW5Cb3VuZHNYKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSkge1xyXG5cdFx0cmV0dXJuICh0aGlzLl9tYXhDb2xzID09IDAgfHwgKHBvcy5jb2wgKyBkaW1zLnggLSAxKSA8PSB0aGlzLl9tYXhDb2xzKTtcclxuXHR9XHJcblx0cHJpdmF0ZSBfaXNXaXRoaW5Cb3VuZHNZKHBvczogTmdHcmlkSXRlbVBvc2l0aW9uLCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSkge1xyXG5cdFx0cmV0dXJuICh0aGlzLl9tYXhSb3dzID09IDAgfHwgKHBvcy5yb3cgKyBkaW1zLnkgLSAxKSA8PSB0aGlzLl9tYXhSb3dzKTtcclxuXHR9XHJcblx0cHJpdmF0ZSBfaXNXaXRoaW5Cb3VuZHMocG9zOiBOZ0dyaWRJdGVtUG9zaXRpb24sIGRpbXM6IE5nR3JpZEl0ZW1TaXplKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5faXNXaXRoaW5Cb3VuZHNYKHBvcywgZGltcykgJiYgdGhpcy5faXNXaXRoaW5Cb3VuZHNZKHBvcywgZGltcyk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9hZGRUb0dyaWQoaXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xyXG5cdFx0bGV0IHBvczogTmdHcmlkSXRlbVBvc2l0aW9uID0gaXRlbS5nZXRHcmlkUG9zaXRpb24oKTtcclxuXHRcdGNvbnN0IGRpbXM6IE5nR3JpZEl0ZW1TaXplID0gaXRlbS5nZXRTaXplKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMuX2hhc0dyaWRDb2xsaXNpb24ocG9zLCBkaW1zKSkge1xyXG5cdFx0XHR0aGlzLl9maXhHcmlkQ29sbGlzaW9ucyhwb3MsIGRpbXMpO1xyXG5cdFx0XHRwb3MgPSBpdGVtLmdldEdyaWRQb3NpdGlvbigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAobGV0IGo6IG51bWJlciA9IDA7IGogPCBkaW1zLnk7IGorKykge1xyXG5cdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbcG9zLnJvdyArIGpdID09IG51bGwpIHRoaXMuX2l0ZW1HcmlkW3Bvcy5yb3cgKyBqXSA9IHt9O1xyXG5cdFx0XHRcclxuXHRcdFx0Zm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGRpbXMueDsgaSsrKSB7XHJcblx0XHRcdFx0dGhpcy5faXRlbUdyaWRbcG9zLnJvdyArIGpdW3Bvcy5jb2wgKyBpXSA9IGl0ZW07XHJcblxyXG5cdFx0XHRcdHRoaXMuX3VwZGF0ZVNpemUocG9zLmNvbCArIGRpbXMueCAtIDEsIHBvcy5yb3cgKyBkaW1zLnkgLSAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfcmVtb3ZlRnJvbUdyaWQoaXRlbTogTmdHcmlkSXRlbSk6IHZvaWQge1xyXG5cdFx0Zm9yIChsZXQgeSBpbiB0aGlzLl9pdGVtR3JpZClcclxuXHRcdFx0Zm9yIChsZXQgeCBpbiB0aGlzLl9pdGVtR3JpZFt5XSlcclxuXHRcdFx0XHRpZiAodGhpcy5faXRlbUdyaWRbeV1beF0gPT0gaXRlbSlcclxuXHRcdFx0XHRcdGRlbGV0ZSB0aGlzLl9pdGVtR3JpZFt5XVt4XTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX3VwZGF0ZVNpemUoY29sPzogbnVtYmVyLCByb3c/OiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9kZXN0cm95ZWQpIHJldHVybjtcclxuXHRcdGNvbCA9IChjb2wgPT0gdW5kZWZpbmVkKSA/IHRoaXMuX2dldE1heENvbCgpIDogY29sO1xyXG5cdFx0cm93ID0gKHJvdyA9PSB1bmRlZmluZWQpID8gdGhpcy5fZ2V0TWF4Um93KCkgOiByb3c7XHJcblxyXG5cdFx0bGV0IG1heENvbDogbnVtYmVyID0gTWF0aC5tYXgodGhpcy5fY3VyTWF4Q29sLCBjb2wpO1xyXG5cdFx0bGV0IG1heFJvdzogbnVtYmVyID0gTWF0aC5tYXgodGhpcy5fY3VyTWF4Um93LCByb3cpO1xyXG5cdFx0XHJcblx0XHRpZiAobWF4Q29sICE9IHRoaXMuX2N1ck1heENvbCB8fCBtYXhSb3cgIT0gdGhpcy5fY3VyTWF4Um93KSB7XHJcblx0XHRcdHRoaXMuX2N1ck1heENvbCA9IG1heENvbDtcclxuXHRcdFx0dGhpcy5fY3VyTWF4Um93ID0gbWF4Um93O1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3dpZHRoJywgJzEwMCUnKTsvLyhtYXhDb2wgKiAodGhpcy5jb2xXaWR0aCArIHRoaXMubWFyZ2luTGVmdCArIHRoaXMubWFyZ2luUmlnaHQpKSsncHgnKTtcclxuXHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2hlaWdodCcsICh0aGlzLl9jdXJNYXhSb3cgKiAodGhpcy5yb3dIZWlnaHQgKyB0aGlzLm1hcmdpblRvcCArIHRoaXMubWFyZ2luQm90dG9tKSkgKyAncHgnKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldE1heFJvdygpOiBudW1iZXIge1xyXG5cdFx0cmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIHRoaXMuX2l0ZW1zLm1hcCgoaXRlbTogTmdHcmlkSXRlbSkgPT4gaXRlbS5nZXRHcmlkUG9zaXRpb24oKS5yb3cgKyBpdGVtLmdldFNpemUoKS55IC0gMSkpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0TWF4Q29sKCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgdGhpcy5faXRlbXMubWFwKChpdGVtOiBOZ0dyaWRJdGVtKSA9PiBpdGVtLmdldEdyaWRQb3NpdGlvbigpLmNvbCArIGl0ZW0uZ2V0U2l6ZSgpLnggLSAxKSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9nZXRNb3VzZVBvc2l0aW9uKGU6IGFueSk6IE5nR3JpZFJhd1Bvc2l0aW9uIHtcclxuXHRcdGlmICgoKDxhbnk+d2luZG93KS5Ub3VjaEV2ZW50ICYmIGUgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB8fCAoZS50b3VjaGVzIHx8IGUuY2hhbmdlZFRvdWNoZXMpKSB7XHJcblx0XHRcdGUgPSBlLnRvdWNoZXMubGVuZ3RoID4gMCA/IGUudG91Y2hlc1swXSA6IGUuY2hhbmdlZFRvdWNoZXNbMF07XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcmVmUG9zOiBhbnkgPSB0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG5cdFx0bGV0IGxlZnQ6IG51bWJlciA9IGUuY2xpZW50WCAtIHJlZlBvcy5sZWZ0O1xyXG5cdFx0bGV0IHRvcDogbnVtYmVyID0gZS5jbGllbnRZIC0gcmVmUG9zLnRvcDtcclxuXHJcblx0XHRpZiAodGhpcy5jYXNjYWRlID09ICdkb3duJykgdG9wID0gcmVmUG9zLnRvcCArIHJlZlBvcy5oZWlnaHQgLSBlLmNsaWVudFk7XHJcblx0XHRpZiAodGhpcy5jYXNjYWRlID09ICdyaWdodCcpIGxlZnQgPSByZWZQb3MubGVmdCArIHJlZlBvcy53aWR0aCAtIGUuY2xpZW50WDtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuaXNEcmFnZ2luZyAmJiB0aGlzLl96b29tT25EcmFnKSB7XHJcblx0XHRcdGxlZnQgKj0gMjtcclxuXHRcdFx0dG9wICo9IDI7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGxlZnQ6IGxlZnQsXHJcblx0XHRcdHRvcDogdG9wXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfZ2V0QWJzb2x1dGVNb3VzZVBvc2l0aW9uKGU6IGFueSk6IE5nR3JpZFJhd1Bvc2l0aW9uIHtcclxuXHRcdGlmICgoKDxhbnk+d2luZG93KS5Ub3VjaEV2ZW50ICYmIGUgaW5zdGFuY2VvZiBUb3VjaEV2ZW50KSB8fCAoZS50b3VjaGVzIHx8IGUuY2hhbmdlZFRvdWNoZXMpKSB7XHJcblx0XHRcdGUgPSBlLnRvdWNoZXMubGVuZ3RoID4gMCA/IGUudG91Y2hlc1swXSA6IGUuY2hhbmdlZFRvdWNoZXNbMF07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bGVmdDogZS5jbGllbnRYLFxyXG5cdFx0XHR0b3A6IGUuY2xpZW50WVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfZ2V0Q29udGFpbmVyQ29sdW1ucygpOiBudW1iZXIge1xyXG5cdFx0Y29uc3QgbWF4V2lkdGg6IG51bWJlciA9IHRoaXMuX25nRWwubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuXHRcdHJldHVybiBNYXRoLmZsb29yKG1heFdpZHRoIC8gKHRoaXMuY29sV2lkdGggKyB0aGlzLm1hcmdpbkxlZnQgKyB0aGlzLm1hcmdpblJpZ2h0KSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9nZXRJdGVtRnJvbVBvc2l0aW9uKHBvc2l0aW9uOiBOZ0dyaWRSYXdQb3NpdGlvbik6IE5nR3JpZEl0ZW0ge1xyXG5cdFx0Zm9yIChsZXQgaXRlbSBvZiB0aGlzLl9pdGVtcykge1xyXG5cdFx0XHRjb25zdCBzaXplOiBOZ0dyaWRJdGVtRGltZW5zaW9ucyA9IGl0ZW0uZ2V0RGltZW5zaW9ucygpO1xyXG5cdFx0XHRjb25zdCBwb3M6IE5nR3JpZFJhd1Bvc2l0aW9uID0gaXRlbS5nZXRQb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0aWYgKHBvc2l0aW9uLmxlZnQgPiAocG9zLmxlZnQpICYmIHBvc2l0aW9uLmxlZnQgPCAocG9zLmxlZnQgKyBzaXplLndpZHRoKSAmJlxyXG5cdFx0XHRcdHBvc2l0aW9uLnRvcCA+IChwb3MudG9wKSAmJiBwb3NpdGlvbi50b3AgPCAocG9zLnRvcCArIHNpemUuaGVpZ2h0KSkge1xyXG5cdFx0XHRcdHJldHVybiBpdGVtO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9jcmVhdGVQbGFjZWhvbGRlcihpdGVtOiBOZ0dyaWRJdGVtKTogdm9pZCB7XHJcblx0XHRjb25zdCBwb3M6IE5nR3JpZEl0ZW1Qb3NpdGlvbiA9IGl0ZW0uZ2V0R3JpZFBvc2l0aW9uKCk7XHJcblx0XHRjb25zdCBkaW1zOiBOZ0dyaWRJdGVtU2l6ZSA9IGl0ZW0uZ2V0U2l6ZSgpO1xyXG5cclxuXHRcdHRoaXMuX2xvYWRlci5sb2FkTmV4dFRvTG9jYXRpb24oKDxUeXBlPk5nR3JpZFBsYWNlaG9sZGVyKSwgaXRlbS5jb250YWluZXJSZWYpLnRoZW4oKGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPE5nR3JpZFBsYWNlaG9sZGVyPikgPT4ge1xyXG5cdFx0XHR0aGlzLl9wbGFjZWhvbGRlclJlZiA9IGNvbXBvbmVudFJlZjtcclxuXHRcdFx0Y29uc3QgcGxhY2Vob2xkZXI6IE5nR3JpZFBsYWNlaG9sZGVyID0gY29tcG9uZW50UmVmLmluc3RhbmNlO1xyXG5cdFx0XHRwbGFjZWhvbGRlci5yZWdpc3RlckdyaWQodGhpcyk7XHJcblx0XHRcdHBsYWNlaG9sZGVyLnNldENhc2NhZGVNb2RlKHRoaXMuY2FzY2FkZSk7XHJcblx0XHRcdHBsYWNlaG9sZGVyLnNldEdyaWRQb3NpdGlvbih7IGNvbDogcG9zLmNvbCwgcm93OiBwb3Mucm93IH0pO1xyXG5cdFx0XHRwbGFjZWhvbGRlci5zZXRTaXplKHsgeDogZGltcy54LCB5OiBkaW1zLnkgfSk7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
