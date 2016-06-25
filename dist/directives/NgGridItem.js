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
var NgGrid_1 = require("./NgGrid");
var core_1 = require('@angular/core');
var NgGridItem = (function () {
    //	Constructor
    function NgGridItem(_differs, _ngEl, _renderer, _ngGrid, containerRef) {
        this._differs = _differs;
        this._ngEl = _ngEl;
        this._renderer = _renderer;
        this._ngGrid = _ngGrid;
        this.containerRef = containerRef;
        //	Event Emitters
        this.onItemChange = new core_1.EventEmitter(false);
        this.onDragStart = new core_1.EventEmitter();
        this.onDrag = new core_1.EventEmitter();
        this.onDragStop = new core_1.EventEmitter();
        this.onDragAny = new core_1.EventEmitter();
        this.onResizeStart = new core_1.EventEmitter();
        this.onResize = new core_1.EventEmitter();
        this.onResizeStop = new core_1.EventEmitter();
        this.onResizeAny = new core_1.EventEmitter();
        this.onChangeStart = new core_1.EventEmitter();
        this.onChange = new core_1.EventEmitter();
        this.onChangeStop = new core_1.EventEmitter();
        this.onChangeAny = new core_1.EventEmitter();
        this.ngGridItemChange = new core_1.EventEmitter();
        this.isFixed = false;
        this.isDraggable = true;
        this.isResizable = true;
        this._position = { col: 1, row: 1 };
        this._currentPosition = { col: 1, row: 1 };
        this._size = { x: 1, y: 1 };
        this._config = NgGridItem.CONST_DEFAULT_CONFIG;
        this._added = false;
        this._maxCols = 0;
        this._minCols = 0;
        this._maxRows = 0;
        this._minRows = 0;
    }
    Object.defineProperty(NgGridItem.prototype, "config", {
        //	[ng-grid-item] handler
        set: function (v) {
            var defaults = NgGridItem.CONST_DEFAULT_CONFIG;
            for (var x in defaults)
                if (v[x] == null)
                    v[x] = defaults[x];
            this.setConfig(v);
            if (this._differ == null && v != null) {
                this._differ = this._differs.find(this._config).create(null);
            }
            if (!this._added) {
                this._added = true;
                this._ngGrid.addItem(this);
            }
            this._recalculateDimensions();
            this._recalculatePosition();
        },
        enumerable: true,
        configurable: true
    });
    NgGridItem.prototype.onResizeStartEvent = function () {
        var event = this.getEventOutput();
        this.onResizeStart.emit(event);
        this.onResizeAny.emit(event);
        this.onChangeStart.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onResizeEvent = function () {
        var event = this.getEventOutput();
        this.onResize.emit(event);
        this.onResizeAny.emit(event);
        this.onChange.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onResizeStopEvent = function () {
        var event = this.getEventOutput();
        this.onResizeStop.emit(event);
        this.onResizeAny.emit(event);
        this.onChangeStop.emit(event);
        this.onChangeAny.emit(event);
        this._config.sizex = this._size.x;
        this._config.sizey = this._size.y;
        this.ngGridItemChange.emit(this._config);
    };
    NgGridItem.prototype.onDragStartEvent = function () {
        var event = this.getEventOutput();
        this.onDragStart.emit(event);
        this.onDragAny.emit(event);
        this.onChangeStart.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onDragEvent = function () {
        var event = this.getEventOutput();
        this.onDrag.emit(event);
        this.onDragAny.emit(event);
        this.onChange.emit(event);
        this.onChangeAny.emit(event);
    };
    NgGridItem.prototype.onDragStopEvent = function () {
        var event = this.getEventOutput();
        this.onDragStop.emit(event);
        this.onDragAny.emit(event);
        this.onChangeStop.emit(event);
        this.onChangeAny.emit(event);
        this._config.col = this._position.col;
        this._config.row = this._position.row;
        this.ngGridItemChange.emit(this._config);
    };
    NgGridItem.prototype.onCascadeEvent = function () {
        this._config.sizex = this._size.x;
        this._config.sizey = this._size.y;
        this._config.col = this._position.col;
        this._config.row = this._position.row;
        this.ngGridItemChange.emit(this._config);
    };
    NgGridItem.prototype.ngOnInit = function () {
        this._renderer.setElementClass(this._ngEl.nativeElement, 'grid-item', true);
        if (this._ngGrid.autoStyle)
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'absolute');
        this._recalculateDimensions();
        this._recalculatePosition();
        if (!this._added) {
            this._added = true;
            this._ngGrid.addItem(this);
        }
    };
    //	Public methods
    NgGridItem.prototype.canDrag = function (e) {
        if (!this.isDraggable)
            return false;
        if (this._dragHandle) {
            return this.findHandle(this._dragHandle, e.target);
        }
        return true;
    };
    NgGridItem.prototype.findHandle = function (handleSelector, startElement) {
        var targetElem = startElement;
        while (targetElem && targetElem != this._ngEl.nativeElement) {
            console.log(targetElem);
            if (this.elementMatches(targetElem, '.handleExclude'))
                return false;
            if (this.elementMatches(targetElem, handleSelector))
                return true;
            targetElem = targetElem.parentElement;
        }
        return false;
    };
    NgGridItem.prototype.canResize = function (e) {
        if (!this.isResizable)
            return null;
        if (this._resizeHandle) {
            return this.findHandle(this._resizeHandle, e.target) ? 'both' : null;
        }
        var mousePos = this._getMousePosition(e);
        if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize
            && mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
            return 'both';
        }
        else if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize) {
            return 'width';
        }
        else if (mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
            return 'height';
        }
        return null;
    };
    NgGridItem.prototype.onMouseMove = function (e) {
        if (this._ngGrid.autoStyle) {
            if (this._ngGrid.resizeEnable && !this._resizeHandle && this.isResizable) {
                var mousePos = this._getMousePosition(e);
                if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize
                    && mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'nwse-resize');
                }
                else if (mousePos.left < this._elemWidth && mousePos.left > this._elemWidth - this._borderSize) {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'ew-resize');
                }
                else if (mousePos.top < this._elemHeight && mousePos.top > this._elemHeight - this._borderSize) {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'ns-resize');
                }
                else if (this._ngGrid.dragEnable && this.canDrag(e)) {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'move');
                }
                else {
                    this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'default');
                }
            }
            else if (this._ngGrid.resizeEnable && this.canResize(e)) {
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'nwse-resize');
            }
            else if (this._ngGrid.dragEnable && this.canDrag(e)) {
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'move');
            }
            else {
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'cursor', 'default');
            }
        }
    };
    NgGridItem.prototype.ngOnDestroy = function () {
        if (this._added)
            this._ngGrid.removeItem(this);
    };
    //	Getters
    NgGridItem.prototype.getElement = function () {
        return this._ngEl;
    };
    NgGridItem.prototype.getDragHandle = function () {
        return this._dragHandle;
    };
    NgGridItem.prototype.getResizeHandle = function () {
        return this._resizeHandle;
    };
    NgGridItem.prototype.getDimensions = function () {
        return { 'width': this._elemWidth, 'height': this._elemHeight };
    };
    NgGridItem.prototype.getSize = function () {
        return this._size;
    };
    NgGridItem.prototype.getPosition = function () {
        return { 'left': this._elemLeft, 'top': this._elemTop };
    };
    NgGridItem.prototype.getGridPosition = function () {
        return this._currentPosition;
    };
    NgGridItem.prototype.getSavedPosition = function () {
        return this._position;
    };
    //	Setters
    NgGridItem.prototype.setConfig = function (config) {
        this._config = config;
        this._payload = config.payload;
        this._position.col = this._currentPosition.col = config.col ? config.col : NgGridItem.CONST_DEFAULT_CONFIG.col;
        this._position.row = this._currentPosition.row = config.row ? config.row : NgGridItem.CONST_DEFAULT_CONFIG.row;
        this._size.x = config.sizex ? config.sizex : NgGridItem.CONST_DEFAULT_CONFIG.sizex;
        this._size.y = config.sizey ? config.sizey : NgGridItem.CONST_DEFAULT_CONFIG.sizey;
        this._dragHandle = config.dragHandle;
        this._resizeHandle = config.resizeHandle;
        this._borderSize = config.borderSize;
        this.isDraggable = config.draggable ? true : false;
        this.isResizable = config.resizable ? true : false;
        this.isFixed = config.fixed ? true : false;
        this._maxCols = !isNaN(config.maxCols) && isFinite(config.maxCols) ? config.maxCols : 0;
        this._minCols = !isNaN(config.minCols) && isFinite(config.minCols) ? config.minCols : 0;
        this._maxRows = !isNaN(config.maxRows) && isFinite(config.maxRows) ? config.maxRows : 0;
        this._minRows = !isNaN(config.minRows) && isFinite(config.minRows) ? config.minRows : 0;
        if (this._minCols > 0 && this._maxCols > 0 && this._minCols > this._maxCols)
            this._minCols = 0;
        if (this._minRows > 0 && this._maxRows > 0 && this._minRows > this._maxRows)
            this._minRows = 0;
        if (this._added) {
            this._ngGrid.updateItem(this);
        }
        this._size = this.fixResize(this._size);
        this._recalculatePosition();
        this._recalculateDimensions();
    };
    NgGridItem.prototype.ngDoCheck = function () {
        if (this._differ != null) {
            var changes = this._differ.diff(this._config);
            if (changes != null) {
                this._applyChanges(changes);
                return true;
            }
        }
        return false;
    };
    NgGridItem.prototype.setSize = function (newSize, update) {
        if (update === void 0) { update = true; }
        newSize = this.fixResize(newSize);
        this._size = newSize;
        if (update)
            this._recalculateDimensions();
        this.onItemChange.emit(this.getEventOutput());
    };
    NgGridItem.prototype.setGridPosition = function (gridPosition, update) {
        if (update === void 0) { update = true; }
        this._currentPosition = gridPosition;
        if (update)
            this._recalculatePosition();
        this.onItemChange.emit(this.getEventOutput());
    };
    NgGridItem.prototype.savePosition = function (newPosition) {
        this._position = newPosition;
        this._currentPosition = newPosition;
        this._recalculatePosition();
        this.onItemChange.emit(this.getEventOutput());
    };
    NgGridItem.prototype.getEventOutput = function () {
        return {
            payload: this._payload,
            col: this._currentPosition.col,
            row: this._currentPosition.row,
            sizex: this._size.x,
            sizey: this._size.y,
            width: this._elemWidth,
            height: this._elemHeight,
            left: this._elemLeft,
            top: this._elemTop
        };
    };
    NgGridItem.prototype.setPosition = function (x, y) {
        switch (this._cascadeMode) {
            case 'up':
            case 'left':
            default:
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + x + 'px, ' + y + 'px)');
                break;
            case 'right':
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + -x + 'px, ' + y + 'px)');
                break;
            case 'down':
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'transform', 'translate(' + x + 'px, ' + -y + 'px)');
                break;
        }
        this._elemLeft = x;
        this._elemTop = y;
    };
    NgGridItem.prototype.setCascadeMode = function (cascade) {
        this._cascadeMode = cascade;
        switch (cascade) {
            case 'up':
            case 'left':
            default:
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', "0px");
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', "0px");
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', null);
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', null);
                break;
            case 'right':
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', "0px");
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', "0px");
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', null);
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', null);
                break;
            case 'down':
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'left', "0px");
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'bottom', "0px");
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'right', null);
                this._renderer.setElementStyle(this._ngEl.nativeElement, 'top', null);
                break;
        }
    };
    NgGridItem.prototype.setDimensions = function (w, h) {
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'width', w + "px");
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'height', h + "px");
        this._elemWidth = w;
        this._elemHeight = h;
    };
    NgGridItem.prototype.startMoving = function () {
        this._renderer.setElementClass(this._ngEl.nativeElement, 'moving', true);
        var style = window.getComputedStyle(this._ngEl.nativeElement);
        if (this._ngGrid.autoStyle)
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'z-index', (parseInt(style.getPropertyValue('z-index')) + 1).toString());
    };
    NgGridItem.prototype.stopMoving = function () {
        this._renderer.setElementClass(this._ngEl.nativeElement, 'moving', false);
        var style = window.getComputedStyle(this._ngEl.nativeElement);
        if (this._ngGrid.autoStyle)
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'z-index', (parseInt(style.getPropertyValue('z-index')) - 1).toString());
    };
    NgGridItem.prototype.recalculateSelf = function () {
        this._recalculatePosition();
        this._recalculateDimensions();
    };
    NgGridItem.prototype.fixResize = function (newSize) {
        if (this._maxCols > 0 && newSize.x > this._maxCols)
            newSize.x = this._maxCols;
        if (this._maxRows > 0 && newSize.y > this._maxRows)
            newSize.y = this._maxRows;
        if (this._minCols > 0 && newSize.x < this._minCols)
            newSize.x = this._minCols;
        if (this._minRows > 0 && newSize.y < this._minRows)
            newSize.y = this._minRows;
        return newSize;
    };
    //	Private methods
    NgGridItem.prototype.elementMatches = function (element, selector) {
        if (element.matches)
            return element.matches(selector);
        if (element.oMatchesSelector)
            return element.oMatchesSelector(selector);
        if (element.msMatchesSelector)
            return element.msMatchesSelector(selector);
        if (element.mozMatchesSelector)
            return element.mozMatchesSelector(selector);
        if (element.webkitMatchesSelector)
            return element.webkitMatchesSelector(selector);
        var matches = (element.document || element.ownerDocument).querySelectorAll(selector);
        var i = matches.length;
        while (--i >= 0 && matches.item(i) !== element) { }
        return i > -1;
    };
    NgGridItem.prototype._recalculatePosition = function () {
        var x = (this._ngGrid.colWidth + this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._currentPosition.col - 1) + this._ngGrid.marginLeft;
        var y = (this._ngGrid.rowHeight + this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._currentPosition.row - 1) + this._ngGrid.marginTop;
        this.setPosition(x, y);
    };
    NgGridItem.prototype._recalculateDimensions = function () {
        if (this._size.x < this._ngGrid.minCols)
            this._size.x = this._ngGrid.minCols;
        if (this._size.y < this._ngGrid.minRows)
            this._size.y = this._ngGrid.minRows;
        var newWidth = Math.max(this._ngGrid.minWidth, this._ngGrid.colWidth * this._size.x);
        var newHeight = Math.max(this._ngGrid.minHeight, this._ngGrid.rowHeight * this._size.y);
        var w = newWidth + ((this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._size.x - 1));
        var h = newHeight + ((this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._size.y - 1));
        this.setDimensions(w, h);
    };
    NgGridItem.prototype._getMousePosition = function (e) {
        if (e.originalEvent && e.originalEvent.touches) {
            var oe = e.originalEvent;
            e = oe.touches.length ? oe.touches[0] : oe.changedTouches[0];
        }
        var refPos = this._ngEl.nativeElement.getBoundingClientRect();
        return {
            left: e.clientX - refPos.left,
            top: e.clientY - refPos.top
        };
    };
    NgGridItem.prototype._applyChanges = function (changes) {
        var _this = this;
        changes.forEachAddedItem(function (record) { _this._config[record.key] = record.currentValue; });
        changes.forEachChangedItem(function (record) { _this._config[record.key] = record.currentValue; });
        changes.forEachRemovedItem(function (record) { delete _this._config[record.key]; });
        this.setConfig(this._config);
    };
    //	Default config
    NgGridItem.CONST_DEFAULT_CONFIG = {
        col: 1,
        row: 1,
        sizex: 1,
        sizey: 1,
        dragHandle: null,
        resizeHandle: null,
        fixed: false,
        draggable: true,
        resizable: true,
        borderSize: 15
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onItemChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onDragStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onDrag", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onDragStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onDragAny", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onResizeStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onResize", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onResizeStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onResizeAny", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onChangeStart", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onChange", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onChangeStop", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "onChangeAny", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], NgGridItem.prototype, "ngGridItemChange", void 0);
    NgGridItem = __decorate([
        core_1.Directive({
            selector: '[ngGridItem]',
            inputs: ['config: ngGridItem']
        }), 
        __metadata('design:paramtypes', [core_1.KeyValueDiffers, core_1.ElementRef, core_1.Renderer, NgGrid_1.NgGrid, core_1.ViewContainerRef])
    ], NgGridItem);
    return NgGridItem;
}());
exports.NgGridItem = NgGridItem;

//# sourceMappingURL=data:application/json;base64,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QVMsQ0FBQztZQUNWLFFBQVEsRUFBRSxjQUFjO1lBQ3hCLE1BQU0sRUFBRSxDQUFDLG9CQUFvQixDQUFDO1NBQzlCLENBQUM7O2tCQUFBO0lBa2VGLGlCQUFDO0FBQUQsQ0FqZUEsQUFpZUMsSUFBQTtBQWplWSxrQkFBVSxhQWlldEIsQ0FBQSIsImZpbGUiOiJkaXJlY3RpdmVzL05nR3JpZEl0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ0dyaWQgfSBmcm9tIFwiLi9OZ0dyaWRcIlxyXG5pbXBvcnQgeyBOZ0dyaWRJdGVtQ29uZmlnLCBOZ0dyaWRJdGVtRXZlbnQsIE5nR3JpZEl0ZW1Qb3NpdGlvbiwgTmdHcmlkSXRlbVNpemUgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9JTmdHcmlkXCJcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyLCBFdmVudEVtaXR0ZXIsIER5bmFtaWNDb21wb25lbnRMb2FkZXIsIEhvc3QsIFZpZXdFbmNhcHN1bGF0aW9uLCBUeXBlLCBDb21wb25lbnRSZWYsIEtleVZhbHVlRGlmZmVyLCBLZXlWYWx1ZURpZmZlcnMsIE9uSW5pdCwgT25EZXN0cm95LCBEb0NoZWNrLCBWaWV3Q29udGFpbmVyUmVmLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG5cdHNlbGVjdG9yOiAnW25nR3JpZEl0ZW1dJyxcclxuXHRpbnB1dHM6IFsnY29uZmlnOiBuZ0dyaWRJdGVtJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIE5nR3JpZEl0ZW0gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcblx0Ly9cdEV2ZW50IEVtaXR0ZXJzXHJcblx0QE91dHB1dCgpIHB1YmxpYyBvbkl0ZW1DaGFuZ2U6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+KGZhbHNlKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uRHJhZ1N0YXJ0OiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25EcmFnOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25EcmFnU3RvcDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uRHJhZ0FueTogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uUmVzaXplU3RhcnQ6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBvblJlc2l6ZTogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uUmVzaXplU3RvcDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uUmVzaXplQW55OiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25DaGFuZ2VTdGFydDogRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1FdmVudD4oKTtcclxuXHRAT3V0cHV0KCkgcHVibGljIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25DaGFuZ2VTdG9wOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PiA9IG5ldyBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUV2ZW50PigpO1xyXG5cdEBPdXRwdXQoKSBwdWJsaWMgb25DaGFuZ2VBbnk6IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ0dyaWRJdGVtRXZlbnQ+KCk7XHJcblx0QE91dHB1dCgpIHB1YmxpYyBuZ0dyaWRJdGVtQ2hhbmdlOiBFdmVudEVtaXR0ZXI8TmdHcmlkSXRlbUNvbmZpZz4gPSBuZXcgRXZlbnRFbWl0dGVyPE5nR3JpZEl0ZW1Db25maWc+KCk7XHJcblxyXG5cdC8vXHREZWZhdWx0IGNvbmZpZ1xyXG5cdHByaXZhdGUgc3RhdGljIENPTlNUX0RFRkFVTFRfQ09ORklHOiBOZ0dyaWRJdGVtQ29uZmlnID0ge1xyXG5cdFx0Y29sOiAxLFxyXG5cdFx0cm93OiAxLFxyXG5cdFx0c2l6ZXg6IDEsXHJcblx0XHRzaXpleTogMSxcclxuXHRcdGRyYWdIYW5kbGU6IG51bGwsXHJcblx0XHRyZXNpemVIYW5kbGU6IG51bGwsXHJcblx0XHRmaXhlZDogZmFsc2UsXHJcblx0XHRkcmFnZ2FibGU6IHRydWUsXHJcblx0XHRyZXNpemFibGU6IHRydWUsXHJcblx0XHRib3JkZXJTaXplOiAxNVxyXG5cdH1cclxuXHJcblx0cHVibGljIGlzRml4ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwdWJsaWMgaXNEcmFnZ2FibGU6IGJvb2xlYW4gPSB0cnVlO1xyXG5cdHB1YmxpYyBpc1Jlc2l6YWJsZTogYm9vbGVhbiA9IHRydWU7XHJcblxyXG5cdC8vXHRQcml2YXRlIHZhcmlhYmxlc1xyXG5cdHByaXZhdGUgX3BheWxvYWQ6IGFueTtcclxuXHRwcml2YXRlIF9wb3NpdGlvbjogTmdHcmlkSXRlbVBvc2l0aW9uID0geyBjb2w6IDEsIHJvdzogMSB9O1xyXG5cdHByaXZhdGUgX2N1cnJlbnRQb3NpdGlvbjogTmdHcmlkSXRlbVBvc2l0aW9uID0geyBjb2w6IDEsIHJvdzogMSB9O1xyXG5cdHByaXZhdGUgX3NpemU6IE5nR3JpZEl0ZW1TaXplID0geyB4OiAxLCB5OiAxIH07XHJcblx0cHJpdmF0ZSBfY29uZmlnID0gTmdHcmlkSXRlbS5DT05TVF9ERUZBVUxUX0NPTkZJRztcclxuXHRwcml2YXRlIF9kcmFnSGFuZGxlOiBzdHJpbmc7XHJcblx0cHJpdmF0ZSBfcmVzaXplSGFuZGxlOiBzdHJpbmc7XHJcblx0cHJpdmF0ZSBfYm9yZGVyU2l6ZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2VsZW1XaWR0aDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2VsZW1IZWlnaHQ6IG51bWJlcjtcclxuXHRwcml2YXRlIF9lbGVtTGVmdDogbnVtYmVyO1xyXG5cdHByaXZhdGUgX2VsZW1Ub3A6IG51bWJlcjtcclxuXHRwcml2YXRlIF9hZGRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cdHByaXZhdGUgX2RpZmZlcjogS2V5VmFsdWVEaWZmZXI7XHJcblx0cHJpdmF0ZSBfY2FzY2FkZU1vZGU6IHN0cmluZztcclxuXHRwcml2YXRlIF9tYXhDb2xzOiBudW1iZXIgPSAwO1xyXG5cdHByaXZhdGUgX21pbkNvbHM6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBfbWF4Um93czogbnVtYmVyID0gMDtcclxuXHRwcml2YXRlIF9taW5Sb3dzOiBudW1iZXIgPSAwO1xyXG5cclxuXHQvL1x0W25nLWdyaWQtaXRlbV0gaGFuZGxlclxyXG5cdHNldCBjb25maWcodjogTmdHcmlkSXRlbUNvbmZpZykge1xyXG5cdFx0dmFyIGRlZmF1bHRzID0gTmdHcmlkSXRlbS5DT05TVF9ERUZBVUxUX0NPTkZJRztcclxuXHJcblx0XHRmb3IgKHZhciB4IGluIGRlZmF1bHRzKVxyXG5cdFx0XHRpZiAodlt4XSA9PSBudWxsKVxyXG5cdFx0XHRcdHZbeF0gPSBkZWZhdWx0c1t4XTtcclxuXHJcblx0XHR0aGlzLnNldENvbmZpZyh2KTtcclxuXHJcblx0XHRpZiAodGhpcy5fZGlmZmVyID09IG51bGwgJiYgdiAhPSBudWxsKSB7XHJcblx0XHRcdHRoaXMuX2RpZmZlciA9IHRoaXMuX2RpZmZlcnMuZmluZCh0aGlzLl9jb25maWcpLmNyZWF0ZShudWxsKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuX2FkZGVkKSB7XHJcblx0XHRcdHRoaXMuX2FkZGVkID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5fbmdHcmlkLmFkZEl0ZW0odGhpcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5fcmVjYWxjdWxhdGVEaW1lbnNpb25zKCk7XHJcblx0XHR0aGlzLl9yZWNhbGN1bGF0ZVBvc2l0aW9uKCk7XHJcblx0fVxyXG5cclxuXHQvL1x0Q29uc3RydWN0b3JcclxuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIF9kaWZmZXJzOiBLZXlWYWx1ZURpZmZlcnMsIHByaXZhdGUgX25nRWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlciwgcHJpdmF0ZSBfbmdHcmlkOiBOZ0dyaWQsIHB1YmxpYyBjb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHsgfVxyXG5cclxuXHRwdWJsaWMgb25SZXNpemVTdGFydEV2ZW50KCk6IHZvaWQge1xyXG5cdFx0dmFyIGV2ZW50ID0gdGhpcy5nZXRFdmVudE91dHB1dCgpO1xyXG5cdFx0dGhpcy5vblJlc2l6ZVN0YXJ0LmVtaXQoZXZlbnQpO1xyXG5cdFx0dGhpcy5vblJlc2l6ZUFueS5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25DaGFuZ2VTdGFydC5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25DaGFuZ2VBbnkuZW1pdChldmVudCk7XHJcblx0fVxyXG5cdHB1YmxpYyBvblJlc2l6ZUV2ZW50KCk6IHZvaWQge1xyXG5cdFx0dmFyIGV2ZW50ID0gdGhpcy5nZXRFdmVudE91dHB1dCgpO1xyXG5cdFx0dGhpcy5vblJlc2l6ZS5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25SZXNpemVBbnkuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uQ2hhbmdlLmVtaXQoZXZlbnQpO1xyXG5cdFx0dGhpcy5vbkNoYW5nZUFueS5lbWl0KGV2ZW50KTtcclxuXHR9XHJcblx0cHVibGljIG9uUmVzaXplU3RvcEV2ZW50KCk6IHZvaWQge1xyXG5cdFx0dmFyIGV2ZW50ID0gdGhpcy5nZXRFdmVudE91dHB1dCgpO1xyXG5cdFx0dGhpcy5vblJlc2l6ZVN0b3AuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uUmVzaXplQW55LmVtaXQoZXZlbnQpO1xyXG5cdFx0dGhpcy5vbkNoYW5nZVN0b3AuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uQ2hhbmdlQW55LmVtaXQoZXZlbnQpO1xyXG5cclxuXHRcdHRoaXMuX2NvbmZpZy5zaXpleCA9IHRoaXMuX3NpemUueDtcclxuXHRcdHRoaXMuX2NvbmZpZy5zaXpleSA9IHRoaXMuX3NpemUueTtcclxuXHRcdHRoaXMubmdHcmlkSXRlbUNoYW5nZS5lbWl0KHRoaXMuX2NvbmZpZyk7XHJcblx0fVxyXG5cdHB1YmxpYyBvbkRyYWdTdGFydEV2ZW50KCk6IHZvaWQge1xyXG5cdFx0dmFyIGV2ZW50ID0gdGhpcy5nZXRFdmVudE91dHB1dCgpO1xyXG5cdFx0dGhpcy5vbkRyYWdTdGFydC5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25EcmFnQW55LmVtaXQoZXZlbnQpO1xyXG5cdFx0dGhpcy5vbkNoYW5nZVN0YXJ0LmVtaXQoZXZlbnQpO1xyXG5cdFx0dGhpcy5vbkNoYW5nZUFueS5lbWl0KGV2ZW50KTtcclxuXHR9XHJcblx0cHVibGljIG9uRHJhZ0V2ZW50KCk6IHZvaWQge1xyXG5cdFx0dmFyIGV2ZW50ID0gdGhpcy5nZXRFdmVudE91dHB1dCgpO1xyXG5cdFx0dGhpcy5vbkRyYWcuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uRHJhZ0FueS5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25DaGFuZ2UuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uQ2hhbmdlQW55LmVtaXQoZXZlbnQpO1xyXG5cdH1cclxuXHRwdWJsaWMgb25EcmFnU3RvcEV2ZW50KCk6IHZvaWQge1xyXG5cdFx0dmFyIGV2ZW50ID0gdGhpcy5nZXRFdmVudE91dHB1dCgpO1xyXG5cdFx0dGhpcy5vbkRyYWdTdG9wLmVtaXQoZXZlbnQpO1xyXG5cdFx0dGhpcy5vbkRyYWdBbnkuZW1pdChldmVudCk7XHJcblx0XHR0aGlzLm9uQ2hhbmdlU3RvcC5lbWl0KGV2ZW50KTtcclxuXHRcdHRoaXMub25DaGFuZ2VBbnkuZW1pdChldmVudCk7XHJcblxyXG5cdFx0dGhpcy5fY29uZmlnLmNvbCA9IHRoaXMuX3Bvc2l0aW9uLmNvbDtcclxuXHRcdHRoaXMuX2NvbmZpZy5yb3cgPSB0aGlzLl9wb3NpdGlvbi5yb3c7XHJcblx0XHR0aGlzLm5nR3JpZEl0ZW1DaGFuZ2UuZW1pdCh0aGlzLl9jb25maWcpO1xyXG5cdH1cclxuXHRwdWJsaWMgb25DYXNjYWRlRXZlbnQoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9jb25maWcuc2l6ZXggPSB0aGlzLl9zaXplLng7XHJcblx0XHR0aGlzLl9jb25maWcuc2l6ZXkgPSB0aGlzLl9zaXplLnk7XHJcblx0XHR0aGlzLl9jb25maWcuY29sID0gdGhpcy5fcG9zaXRpb24uY29sO1xyXG5cdFx0dGhpcy5fY29uZmlnLnJvdyA9IHRoaXMuX3Bvc2l0aW9uLnJvdztcclxuXHRcdHRoaXMubmdHcmlkSXRlbUNoYW5nZS5lbWl0KHRoaXMuX2NvbmZpZyk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnZ3JpZC1pdGVtJywgdHJ1ZSk7XHJcblx0XHRpZiAodGhpcy5fbmdHcmlkLmF1dG9TdHlsZSkgdGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XHJcblx0XHR0aGlzLl9yZWNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcclxuXHRcdHRoaXMuX3JlY2FsY3VsYXRlUG9zaXRpb24oKTtcclxuXHJcblx0XHRpZiAoIXRoaXMuX2FkZGVkKSB7XHJcblx0XHRcdHRoaXMuX2FkZGVkID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5fbmdHcmlkLmFkZEl0ZW0odGhpcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvL1x0UHVibGljIG1ldGhvZHNcclxuXHRwdWJsaWMgY2FuRHJhZyhlOiBhbnkpOiBib29sZWFuIHtcclxuXHRcdGlmICghdGhpcy5pc0RyYWdnYWJsZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdGlmICh0aGlzLl9kcmFnSGFuZGxlKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmZpbmRIYW5kbGUodGhpcy5fZHJhZ0hhbmRsZSwgZS50YXJnZXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHRcclxuXHRwdWJsaWMgZmluZEhhbmRsZShoYW5kbGVTZWxlY3Rvcjogc3RyaW5nLCBzdGFydEVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcblx0XHRsZXQgdGFyZ2V0RWxlbSA9IHN0YXJ0RWxlbWVudDtcclxuXHRcdFxyXG5cdFx0d2hpbGUgKHRhcmdldEVsZW0gJiYgdGFyZ2V0RWxlbSAhPSB0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2codGFyZ2V0RWxlbSk7XHJcblx0XHRcdGlmICh0aGlzLmVsZW1lbnRNYXRjaGVzKHRhcmdldEVsZW0sICcuaGFuZGxlRXhjbHVkZScpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdGlmICh0aGlzLmVsZW1lbnRNYXRjaGVzKHRhcmdldEVsZW0sIGhhbmRsZVNlbGVjdG9yKSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdFxyXG5cdFx0XHR0YXJnZXRFbGVtID0gdGFyZ2V0RWxlbS5wYXJlbnRFbGVtZW50O1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgY2FuUmVzaXplKGU6IGFueSk6IHN0cmluZyB7XHJcblx0XHRpZiAoIXRoaXMuaXNSZXNpemFibGUpIHJldHVybiBudWxsO1xyXG5cclxuXHRcdGlmICh0aGlzLl9yZXNpemVIYW5kbGUpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZmluZEhhbmRsZSh0aGlzLl9yZXNpemVIYW5kbGUsIGUudGFyZ2V0KSA/ICdib3RoJyA6IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHJcblx0XHRpZiAobW91c2VQb3MubGVmdCA8IHRoaXMuX2VsZW1XaWR0aCAmJiBtb3VzZVBvcy5sZWZ0ID4gdGhpcy5fZWxlbVdpZHRoIC0gdGhpcy5fYm9yZGVyU2l6ZVxyXG5cdFx0XHQmJiBtb3VzZVBvcy50b3AgPCB0aGlzLl9lbGVtSGVpZ2h0ICYmIG1vdXNlUG9zLnRvcCA+IHRoaXMuX2VsZW1IZWlnaHQgLSB0aGlzLl9ib3JkZXJTaXplKSB7XHJcblx0XHRcdHJldHVybiAnYm90aCc7XHJcblx0XHR9IGVsc2UgaWYgKG1vdXNlUG9zLmxlZnQgPCB0aGlzLl9lbGVtV2lkdGggJiYgbW91c2VQb3MubGVmdCA+IHRoaXMuX2VsZW1XaWR0aCAtIHRoaXMuX2JvcmRlclNpemUpIHtcclxuXHRcdFx0cmV0dXJuICd3aWR0aCc7XHJcblx0XHR9IGVsc2UgaWYgKG1vdXNlUG9zLnRvcCA8IHRoaXMuX2VsZW1IZWlnaHQgJiYgbW91c2VQb3MudG9wID4gdGhpcy5fZWxlbUhlaWdodCAtIHRoaXMuX2JvcmRlclNpemUpIHtcclxuXHRcdFx0cmV0dXJuICdoZWlnaHQnO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG9uTW91c2VNb3ZlKGU6IGFueSk6IHZvaWQge1xyXG5cdFx0aWYgKHRoaXMuX25nR3JpZC5hdXRvU3R5bGUpIHtcclxuXHRcdFx0aWYgKHRoaXMuX25nR3JpZC5yZXNpemVFbmFibGUgJiYgIXRoaXMuX3Jlc2l6ZUhhbmRsZSAmJiB0aGlzLmlzUmVzaXphYmxlKSB7XHJcblx0XHRcdFx0dmFyIG1vdXNlUG9zID0gdGhpcy5fZ2V0TW91c2VQb3NpdGlvbihlKTtcclxuXHJcblx0XHRcdFx0aWYgKG1vdXNlUG9zLmxlZnQgPCB0aGlzLl9lbGVtV2lkdGggJiYgbW91c2VQb3MubGVmdCA+IHRoaXMuX2VsZW1XaWR0aCAtIHRoaXMuX2JvcmRlclNpemVcclxuXHRcdFx0XHRcdCYmIG1vdXNlUG9zLnRvcCA8IHRoaXMuX2VsZW1IZWlnaHQgJiYgbW91c2VQb3MudG9wID4gdGhpcy5fZWxlbUhlaWdodCAtIHRoaXMuX2JvcmRlclNpemUpIHtcclxuXHRcdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdjdXJzb3InLCAnbndzZS1yZXNpemUnKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG1vdXNlUG9zLmxlZnQgPCB0aGlzLl9lbGVtV2lkdGggJiYgbW91c2VQb3MubGVmdCA+IHRoaXMuX2VsZW1XaWR0aCAtIHRoaXMuX2JvcmRlclNpemUpIHtcclxuXHRcdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdjdXJzb3InLCAnZXctcmVzaXplJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtb3VzZVBvcy50b3AgPCB0aGlzLl9lbGVtSGVpZ2h0ICYmIG1vdXNlUG9zLnRvcCA+IHRoaXMuX2VsZW1IZWlnaHQgLSB0aGlzLl9ib3JkZXJTaXplKSB7XHJcblx0XHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgJ25zLXJlc2l6ZScpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbmdHcmlkLmRyYWdFbmFibGUgJiYgdGhpcy5jYW5EcmFnKGUpKSB7XHJcblx0XHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgJ21vdmUnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2N1cnNvcicsICdkZWZhdWx0Jyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuX25nR3JpZC5yZXNpemVFbmFibGUgJiYgdGhpcy5jYW5SZXNpemUoZSkpIHtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgJ253c2UtcmVzaXplJyk7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5fbmdHcmlkLmRyYWdFbmFibGUgJiYgdGhpcy5jYW5EcmFnKGUpKSB7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2N1cnNvcicsICdtb3ZlJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2N1cnNvcicsICdkZWZhdWx0Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLl9hZGRlZCkgdGhpcy5fbmdHcmlkLnJlbW92ZUl0ZW0odGhpcyk7XHJcblx0fVxyXG5cclxuXHQvL1x0R2V0dGVyc1xyXG5cdHB1YmxpYyBnZXRFbGVtZW50KCk6IEVsZW1lbnRSZWYge1xyXG5cdFx0cmV0dXJuIHRoaXMuX25nRWw7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0RHJhZ0hhbmRsZSgpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2RyYWdIYW5kbGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0UmVzaXplSGFuZGxlKCk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gdGhpcy5fcmVzaXplSGFuZGxlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldERpbWVuc2lvbnMoKTogeyB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciB9IHtcclxuXHRcdHJldHVybiB7ICd3aWR0aCc6IHRoaXMuX2VsZW1XaWR0aCwgJ2hlaWdodCc6IHRoaXMuX2VsZW1IZWlnaHQgfVxyXG5cdH1cclxuXHJcblx0cHVibGljIGdldFNpemUoKTogTmdHcmlkSXRlbVNpemUge1xyXG5cdFx0cmV0dXJuIHRoaXMuX3NpemU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0UG9zaXRpb24oKTogeyBsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyIH0ge1xyXG5cdFx0cmV0dXJuIHsgJ2xlZnQnOiB0aGlzLl9lbGVtTGVmdCwgJ3RvcCc6IHRoaXMuX2VsZW1Ub3AgfVxyXG5cdH1cclxuXHJcblx0cHVibGljIGdldEdyaWRQb3NpdGlvbigpOiBOZ0dyaWRJdGVtUG9zaXRpb24ge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2N1cnJlbnRQb3NpdGlvbjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXRTYXZlZFBvc2l0aW9uKCk6IE5nR3JpZEl0ZW1Qb3NpdGlvbiB7XHJcblx0XHRyZXR1cm4gdGhpcy5fcG9zaXRpb247XHJcblx0fVxyXG5cclxuXHQvL1x0U2V0dGVyc1xyXG5cdHB1YmxpYyBzZXRDb25maWcoY29uZmlnOiBOZ0dyaWRJdGVtQ29uZmlnKTogdm9pZCB7XHJcblx0XHR0aGlzLl9jb25maWcgPSBjb25maWc7XHJcblxyXG5cdFx0dGhpcy5fcGF5bG9hZCA9IGNvbmZpZy5wYXlsb2FkO1xyXG5cdFx0dGhpcy5fcG9zaXRpb24uY29sID0gdGhpcy5fY3VycmVudFBvc2l0aW9uLmNvbCA9IGNvbmZpZy5jb2wgPyBjb25maWcuY29sIDogTmdHcmlkSXRlbS5DT05TVF9ERUZBVUxUX0NPTkZJRy5jb2w7XHJcblx0XHR0aGlzLl9wb3NpdGlvbi5yb3cgPSB0aGlzLl9jdXJyZW50UG9zaXRpb24ucm93ID0gY29uZmlnLnJvdyA/IGNvbmZpZy5yb3cgOiBOZ0dyaWRJdGVtLkNPTlNUX0RFRkFVTFRfQ09ORklHLnJvdztcclxuXHRcdHRoaXMuX3NpemUueCA9IGNvbmZpZy5zaXpleCA/IGNvbmZpZy5zaXpleCA6IE5nR3JpZEl0ZW0uQ09OU1RfREVGQVVMVF9DT05GSUcuc2l6ZXg7XHJcblx0XHR0aGlzLl9zaXplLnkgPSBjb25maWcuc2l6ZXkgPyBjb25maWcuc2l6ZXkgOiBOZ0dyaWRJdGVtLkNPTlNUX0RFRkFVTFRfQ09ORklHLnNpemV5O1xyXG5cdFx0dGhpcy5fZHJhZ0hhbmRsZSA9IGNvbmZpZy5kcmFnSGFuZGxlO1xyXG5cdFx0dGhpcy5fcmVzaXplSGFuZGxlID0gY29uZmlnLnJlc2l6ZUhhbmRsZTtcclxuXHRcdHRoaXMuX2JvcmRlclNpemUgPSBjb25maWcuYm9yZGVyU2l6ZTtcclxuXHRcdHRoaXMuaXNEcmFnZ2FibGUgPSBjb25maWcuZHJhZ2dhYmxlID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0dGhpcy5pc1Jlc2l6YWJsZSA9IGNvbmZpZy5yZXNpemFibGUgPyB0cnVlIDogZmFsc2U7XHJcblx0XHR0aGlzLmlzRml4ZWQgPSBjb25maWcuZml4ZWQgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcclxuXHRcdHRoaXMuX21heENvbHMgPSAhaXNOYU4oY29uZmlnLm1heENvbHMpICYmIGlzRmluaXRlKGNvbmZpZy5tYXhDb2xzKSA/IGNvbmZpZy5tYXhDb2xzIDogMDtcclxuXHRcdHRoaXMuX21pbkNvbHMgPSAhaXNOYU4oY29uZmlnLm1pbkNvbHMpICYmIGlzRmluaXRlKGNvbmZpZy5taW5Db2xzKSA/IGNvbmZpZy5taW5Db2xzIDogMDtcclxuXHRcdHRoaXMuX21heFJvd3MgPSAhaXNOYU4oY29uZmlnLm1heFJvd3MpICYmIGlzRmluaXRlKGNvbmZpZy5tYXhSb3dzKSA/IGNvbmZpZy5tYXhSb3dzIDogMDtcclxuXHRcdHRoaXMuX21pblJvd3MgPSAhaXNOYU4oY29uZmlnLm1pblJvd3MpICYmIGlzRmluaXRlKGNvbmZpZy5taW5Sb3dzKSA/IGNvbmZpZy5taW5Sb3dzIDogMDtcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuX21pbkNvbHMgPiAwICYmIHRoaXMuX21heENvbHMgPiAwICYmIHRoaXMuX21pbkNvbHMgPiB0aGlzLl9tYXhDb2xzKSB0aGlzLl9taW5Db2xzID0gMDtcclxuXHRcdGlmICh0aGlzLl9taW5Sb3dzID4gMCAmJiB0aGlzLl9tYXhSb3dzID4gMCAmJiB0aGlzLl9taW5Sb3dzID4gdGhpcy5fbWF4Um93cykgdGhpcy5fbWluUm93cyA9IDA7XHJcblx0XHRcclxuXHRcdGlmICh0aGlzLl9hZGRlZCkge1xyXG5cdFx0XHR0aGlzLl9uZ0dyaWQudXBkYXRlSXRlbSh0aGlzKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5fc2l6ZSA9IHRoaXMuZml4UmVzaXplKHRoaXMuX3NpemUpO1xyXG5cclxuXHRcdHRoaXMuX3JlY2FsY3VsYXRlUG9zaXRpb24oKTtcclxuXHRcdHRoaXMuX3JlY2FsY3VsYXRlRGltZW5zaW9ucygpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG5nRG9DaGVjaygpOiBib29sZWFuIHtcclxuXHRcdGlmICh0aGlzLl9kaWZmZXIgIT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgY2hhbmdlcyA9IHRoaXMuX2RpZmZlci5kaWZmKHRoaXMuX2NvbmZpZyk7XHJcblxyXG5cdFx0XHRpZiAoY2hhbmdlcyAhPSBudWxsKSB7XHJcblx0XHRcdFx0dGhpcy5fYXBwbHlDaGFuZ2VzKGNoYW5nZXMpO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRTaXplKG5ld1NpemU6IE5nR3JpZEl0ZW1TaXplLCB1cGRhdGU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcblx0XHRuZXdTaXplID0gdGhpcy5maXhSZXNpemUobmV3U2l6ZSk7XHJcblx0XHR0aGlzLl9zaXplID0gbmV3U2l6ZTtcclxuXHRcdGlmICh1cGRhdGUpIHRoaXMuX3JlY2FsY3VsYXRlRGltZW5zaW9ucygpO1xyXG5cclxuXHRcdHRoaXMub25JdGVtQ2hhbmdlLmVtaXQodGhpcy5nZXRFdmVudE91dHB1dCgpKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRHcmlkUG9zaXRpb24oZ3JpZFBvc2l0aW9uOiBOZ0dyaWRJdGVtUG9zaXRpb24sIHVwZGF0ZTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2N1cnJlbnRQb3NpdGlvbiA9IGdyaWRQb3NpdGlvbjtcclxuXHRcdGlmICh1cGRhdGUpIHRoaXMuX3JlY2FsY3VsYXRlUG9zaXRpb24oKTtcclxuXHJcblx0XHR0aGlzLm9uSXRlbUNoYW5nZS5lbWl0KHRoaXMuZ2V0RXZlbnRPdXRwdXQoKSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2F2ZVBvc2l0aW9uKG5ld1Bvc2l0aW9uOiBOZ0dyaWRJdGVtUG9zaXRpb24pOiB2b2lkIHtcclxuXHRcdHRoaXMuX3Bvc2l0aW9uID0gbmV3UG9zaXRpb247XHJcblx0XHR0aGlzLl9jdXJyZW50UG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcclxuXHRcdFxyXG5cdFx0dGhpcy5fcmVjYWxjdWxhdGVQb3NpdGlvbigpO1xyXG5cdFx0XHJcblx0XHR0aGlzLm9uSXRlbUNoYW5nZS5lbWl0KHRoaXMuZ2V0RXZlbnRPdXRwdXQoKSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZ2V0RXZlbnRPdXRwdXQoKTogTmdHcmlkSXRlbUV2ZW50IHtcclxuXHRcdHJldHVybiA8TmdHcmlkSXRlbUV2ZW50PntcclxuXHRcdFx0cGF5bG9hZDogdGhpcy5fcGF5bG9hZCxcclxuXHRcdFx0Y29sOiB0aGlzLl9jdXJyZW50UG9zaXRpb24uY29sLFxyXG5cdFx0XHRyb3c6IHRoaXMuX2N1cnJlbnRQb3NpdGlvbi5yb3csXHJcblx0XHRcdHNpemV4OiB0aGlzLl9zaXplLngsXHJcblx0XHRcdHNpemV5OiB0aGlzLl9zaXplLnksXHJcblx0XHRcdHdpZHRoOiB0aGlzLl9lbGVtV2lkdGgsXHJcblx0XHRcdGhlaWdodDogdGhpcy5fZWxlbUhlaWdodCxcclxuXHRcdFx0bGVmdDogdGhpcy5fZWxlbUxlZnQsXHJcblx0XHRcdHRvcDogdGhpcy5fZWxlbVRvcFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRQb3NpdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0c3dpdGNoICh0aGlzLl9jYXNjYWRlTW9kZSkge1xyXG5cdFx0XHRjYXNlICd1cCc6XHJcblx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB4ICsgJ3B4LCAnICsgeSArICdweCknKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAteCArICdweCwgJyArIHkgKyAncHgpJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2Rvd24nOlxyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyB4ICsgJ3B4LCAnICsgLXkgKyAncHgpJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHR0aGlzLl9lbGVtTGVmdCA9IHg7XHJcblx0XHR0aGlzLl9lbGVtVG9wID0geTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRDYXNjYWRlTW9kZShjYXNjYWRlOiBzdHJpbmcpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2Nhc2NhZGVNb2RlID0gY2FzY2FkZTtcclxuXHRcdHN3aXRjaCAoY2FzY2FkZSkge1xyXG5cdFx0XHRjYXNlICd1cCc6XHJcblx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdsZWZ0JywgXCIwcHhcIik7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3RvcCcsIFwiMHB4XCIpO1xyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdyaWdodCcsIG51bGwpO1xyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdib3R0b20nLCBudWxsKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdyaWdodCcsIFwiMHB4XCIpO1xyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd0b3AnLCBcIjBweFwiKTtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnbGVmdCcsIG51bGwpO1xyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdib3R0b20nLCBudWxsKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZG93bic6XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2xlZnQnLCBcIjBweFwiKTtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnYm90dG9tJywgXCIwcHhcIik7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3JpZ2h0JywgbnVsbCk7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3RvcCcsIG51bGwpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHNldERpbWVuc2lvbnModzogbnVtYmVyLCBoOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd3aWR0aCcsIHcgKyBcInB4XCIpO1xyXG5cdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2hlaWdodCcsIGggKyBcInB4XCIpO1xyXG5cdFx0dGhpcy5fZWxlbVdpZHRoID0gdztcclxuXHRcdHRoaXMuX2VsZW1IZWlnaHQgPSBoO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXJ0TW92aW5nKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ21vdmluZycsIHRydWUpO1xyXG5cdFx0dmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50KTtcclxuXHRcdGlmICh0aGlzLl9uZ0dyaWQuYXV0b1N0eWxlKSB0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIChwYXJzZUludChzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCd6LWluZGV4JykpICsgMSkudG9TdHJpbmcoKSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RvcE1vdmluZygpOiB2b2lkIHtcclxuXHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdtb3ZpbmcnLCBmYWxzZSk7XHJcblx0XHR2YXIgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQpO1xyXG5cdFx0aWYgKHRoaXMuX25nR3JpZC5hdXRvU3R5bGUpIHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgKHBhcnNlSW50KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3otaW5kZXgnKSkgLSAxKS50b1N0cmluZygpKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZWNhbGN1bGF0ZVNlbGYoKTogdm9pZCB7XHJcblx0XHR0aGlzLl9yZWNhbGN1bGF0ZVBvc2l0aW9uKCk7XHJcblx0XHR0aGlzLl9yZWNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcclxuXHR9XHJcblx0XHJcblx0cHVibGljIGZpeFJlc2l6ZShuZXdTaXplOiBOZ0dyaWRJdGVtU2l6ZSkge1xyXG5cdFx0aWYgKHRoaXMuX21heENvbHMgPiAwICYmIG5ld1NpemUueCA+IHRoaXMuX21heENvbHMpIG5ld1NpemUueCA9IHRoaXMuX21heENvbHM7XHJcblx0XHRpZiAodGhpcy5fbWF4Um93cyA+IDAgJiYgbmV3U2l6ZS55ID4gdGhpcy5fbWF4Um93cykgbmV3U2l6ZS55ID0gdGhpcy5fbWF4Um93cztcclxuXHRcdFxyXG5cdFx0aWYgKHRoaXMuX21pbkNvbHMgPiAwICYmIG5ld1NpemUueCA8IHRoaXMuX21pbkNvbHMpIG5ld1NpemUueCA9IHRoaXMuX21pbkNvbHM7XHJcblx0XHRpZiAodGhpcy5fbWluUm93cyA+IDAgJiYgbmV3U2l6ZS55IDwgdGhpcy5fbWluUm93cykgbmV3U2l6ZS55ID0gdGhpcy5fbWluUm93cztcclxuXHRcdFxyXG5cdFx0cmV0dXJuIG5ld1NpemU7XHJcblx0fVxyXG5cclxuXHQvL1x0UHJpdmF0ZSBtZXRob2RzXHJcblx0cHJpdmF0ZSBlbGVtZW50TWF0Y2hlcyhlbGVtZW50OiBhbnksIHNlbGVjdG9yOiBzdHJpbmcpOiBib29sZWFuIHtcclxuXHRcdGlmIChlbGVtZW50Lm1hdGNoZXMpIHJldHVybiBlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpO1xyXG5cdFx0aWYgKGVsZW1lbnQub01hdGNoZXNTZWxlY3RvcikgcmV0dXJuIGVsZW1lbnQub01hdGNoZXNTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRpZiAoZWxlbWVudC5tc01hdGNoZXNTZWxlY3RvcikgcmV0dXJuIGVsZW1lbnQubXNNYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cdFx0aWYgKGVsZW1lbnQubW96TWF0Y2hlc1NlbGVjdG9yKSByZXR1cm4gZWxlbWVudC5tb3pNYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cdFx0aWYgKGVsZW1lbnQud2Via2l0TWF0Y2hlc1NlbGVjdG9yKSByZXR1cm4gZWxlbWVudC53ZWJraXRNYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3IpO1xyXG5cdFx0XHJcblx0XHRjb25zdCBtYXRjaGVzID0gKGVsZW1lbnQuZG9jdW1lbnQgfHwgZWxlbWVudC5vd25lckRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuXHRcdGxldCBpID0gbWF0Y2hlcy5sZW5ndGg7XHJcblx0XHR3aGlsZSAoLS1pID49IDAgJiYgbWF0Y2hlcy5pdGVtKGkpICE9PSBlbGVtZW50KSB7IH1cclxuXHRcdHJldHVybiBpID4gLTE7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZWNhbGN1bGF0ZVBvc2l0aW9uKCk6IHZvaWQge1xyXG5cdFx0dmFyIHggPSAodGhpcy5fbmdHcmlkLmNvbFdpZHRoICsgdGhpcy5fbmdHcmlkLm1hcmdpbkxlZnQgKyB0aGlzLl9uZ0dyaWQubWFyZ2luUmlnaHQpICogKHRoaXMuX2N1cnJlbnRQb3NpdGlvbi5jb2wgLSAxKSArIHRoaXMuX25nR3JpZC5tYXJnaW5MZWZ0O1xyXG5cdFx0dmFyIHkgPSAodGhpcy5fbmdHcmlkLnJvd0hlaWdodCArIHRoaXMuX25nR3JpZC5tYXJnaW5Ub3AgKyB0aGlzLl9uZ0dyaWQubWFyZ2luQm90dG9tKSAqICh0aGlzLl9jdXJyZW50UG9zaXRpb24ucm93IC0gMSkgKyB0aGlzLl9uZ0dyaWQubWFyZ2luVG9wO1xyXG5cclxuXHRcdHRoaXMuc2V0UG9zaXRpb24oeCwgeSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIF9yZWNhbGN1bGF0ZURpbWVuc2lvbnMoKTogdm9pZCB7XHJcblx0XHRpZiAodGhpcy5fc2l6ZS54IDwgdGhpcy5fbmdHcmlkLm1pbkNvbHMpIHRoaXMuX3NpemUueCA9IHRoaXMuX25nR3JpZC5taW5Db2xzO1xyXG5cdFx0aWYgKHRoaXMuX3NpemUueSA8IHRoaXMuX25nR3JpZC5taW5Sb3dzKSB0aGlzLl9zaXplLnkgPSB0aGlzLl9uZ0dyaWQubWluUm93cztcclxuXHJcblx0XHR2YXIgbmV3V2lkdGggPSBNYXRoLm1heCh0aGlzLl9uZ0dyaWQubWluV2lkdGgsIHRoaXMuX25nR3JpZC5jb2xXaWR0aCAqIHRoaXMuX3NpemUueCk7XHJcblx0XHR2YXIgbmV3SGVpZ2h0ID0gTWF0aC5tYXgodGhpcy5fbmdHcmlkLm1pbkhlaWdodCwgdGhpcy5fbmdHcmlkLnJvd0hlaWdodCAqIHRoaXMuX3NpemUueSk7XHJcblxyXG5cdFx0dmFyIHcgPSBuZXdXaWR0aCArICgodGhpcy5fbmdHcmlkLm1hcmdpbkxlZnQgKyB0aGlzLl9uZ0dyaWQubWFyZ2luUmlnaHQpICogKHRoaXMuX3NpemUueCAtIDEpKTtcclxuXHRcdHZhciBoID0gbmV3SGVpZ2h0ICsgKCh0aGlzLl9uZ0dyaWQubWFyZ2luVG9wICsgdGhpcy5fbmdHcmlkLm1hcmdpbkJvdHRvbSkgKiAodGhpcy5fc2l6ZS55IC0gMSkpO1xyXG5cclxuXHRcdHRoaXMuc2V0RGltZW5zaW9ucyh3LCBoKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2dldE1vdXNlUG9zaXRpb24oZTogYW55KTogeyBsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyIH0ge1xyXG5cdFx0aWYgKGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQudG91Y2hlcykge1xyXG5cdFx0XHR2YXIgb2UgPSBlLm9yaWdpbmFsRXZlbnQ7XHJcblx0XHRcdGUgPSBvZS50b3VjaGVzLmxlbmd0aCA/IG9lLnRvdWNoZXNbMF0gOiBvZS5jaGFuZ2VkVG91Y2hlc1swXTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcmVmUG9zID0gdGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGxlZnQ6IGUuY2xpZW50WCAtIHJlZlBvcy5sZWZ0LFxyXG5cdFx0XHR0b3A6IGUuY2xpZW50WSAtIHJlZlBvcy50b3BcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgX2FwcGx5Q2hhbmdlcyhjaGFuZ2VzOiBhbnkpOiB2b2lkIHtcclxuXHRcdGNoYW5nZXMuZm9yRWFjaEFkZGVkSXRlbSgocmVjb3JkOiBhbnkpID0+IHsgdGhpcy5fY29uZmlnW3JlY29yZC5rZXldID0gcmVjb3JkLmN1cnJlbnRWYWx1ZTsgfSk7XHJcblx0XHRjaGFuZ2VzLmZvckVhY2hDaGFuZ2VkSXRlbSgocmVjb3JkOiBhbnkpID0+IHsgdGhpcy5fY29uZmlnW3JlY29yZC5rZXldID0gcmVjb3JkLmN1cnJlbnRWYWx1ZTsgfSk7XHJcblx0XHRjaGFuZ2VzLmZvckVhY2hSZW1vdmVkSXRlbSgocmVjb3JkOiBhbnkpID0+IHsgZGVsZXRlIHRoaXMuX2NvbmZpZ1tyZWNvcmQua2V5XTsgfSk7XHJcblxyXG5cdFx0dGhpcy5zZXRDb25maWcodGhpcy5fY29uZmlnKTtcclxuXHR9XHJcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
