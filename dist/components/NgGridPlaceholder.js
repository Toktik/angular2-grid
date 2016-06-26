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
var NgGridPlaceholder = (function () {
    function NgGridPlaceholder(_ngEl, _renderer) {
        this._ngEl = _ngEl;
        this._renderer = _renderer;
    }
    NgGridPlaceholder.prototype.registerGrid = function (ngGrid) {
        this._ngGrid = ngGrid;
    };
    NgGridPlaceholder.prototype.ngOnInit = function () {
        this._renderer.setElementClass(this._ngEl.nativeElement, 'grid-placeholder', true);
        if (this._ngGrid.autoStyle)
            this._renderer.setElementStyle(this._ngEl.nativeElement, 'position', 'absolute');
    };
    NgGridPlaceholder.prototype.setSize = function (newSize) {
        this._size = newSize;
        this._recalculateDimensions();
    };
    NgGridPlaceholder.prototype.setGridPosition = function (newPosition) {
        this._position = newPosition;
        this._recalculatePosition();
    };
    NgGridPlaceholder.prototype.setCascadeMode = function (cascade) {
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
    //	Private methods
    NgGridPlaceholder.prototype._setDimensions = function (w, h) {
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'width', w + "px");
        this._renderer.setElementStyle(this._ngEl.nativeElement, 'height', h + "px");
    };
    NgGridPlaceholder.prototype._setPosition = function (x, y) {
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
    };
    NgGridPlaceholder.prototype._recalculatePosition = function () {
        var x = (this._ngGrid.colWidth + this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._position.col - 1) + this._ngGrid.marginLeft;
        var y = (this._ngGrid.rowHeight + this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._position.row - 1) + this._ngGrid.marginTop;
        this._setPosition(x, y);
    };
    NgGridPlaceholder.prototype._recalculateDimensions = function () {
        var w = (this._ngGrid.colWidth * this._size.x) + ((this._ngGrid.marginLeft + this._ngGrid.marginRight) * (this._size.x - 1));
        var h = (this._ngGrid.rowHeight * this._size.y) + ((this._ngGrid.marginTop + this._ngGrid.marginBottom) * (this._size.y - 1));
        this._setDimensions(w, h);
    };
    NgGridPlaceholder = __decorate([
        core_1.Component({
            selector: 'div',
            template: ""
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], NgGridPlaceholder);
    return NgGridPlaceholder;
}());
exports.NgGridPlaceholder = NgGridPlaceholder;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvTmdHcmlkUGxhY2Vob2xkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUdBLHFCQUFxTyxlQUFlLENBQUMsQ0FBQTtBQU1yUDtJQU1DLDJCQUFvQixLQUFpQixFQUFVLFNBQW1CO1FBQTlDLFVBQUssR0FBTCxLQUFLLENBQVk7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFVO0lBQUksQ0FBQztJQUVoRSx3Q0FBWSxHQUFuQixVQUFvQixNQUFjO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxvQ0FBUSxHQUFmO1FBQ0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkYsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDOUcsQ0FBQztJQUVNLG1DQUFPLEdBQWQsVUFBZSxPQUF1QjtRQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztRQUNyQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRU0sMkNBQWUsR0FBdEIsVUFBdUIsV0FBK0I7UUFDckQsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7UUFDN0IsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVNLDBDQUFjLEdBQXJCLFVBQXNCLE9BQWU7UUFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUM7UUFDNUIsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNqQixLQUFLLElBQUksQ0FBQztZQUNWLEtB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LENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkksSUFBTSxDQUFDLEdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4SSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBekZGO1FBQUMsZ0JBQVMsQ0FBQztZQUNWLFFBQVEsRUFBRSxLQUFLO1lBQ2YsUUFBUSxFQUFFLEVBQUU7U0FDWixDQUFDOzt5QkFBQTtJQXVGRix3QkFBQztBQUFELENBdEZBLEFBc0ZDLElBQUE7QUF0RlkseUJBQWlCLG9CQXNGN0IsQ0FBQSIsImZpbGUiOiJjb21wb25lbnRzL05nR3JpZFBsYWNlaG9sZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdHcmlkIH0gZnJvbSBcIi4uL2RpcmVjdGl2ZXMvTmdHcmlkXCJcclxuaW1wb3J0IHsgTmdHcmlkSXRlbSB9IGZyb20gXCIuLi9kaXJlY3RpdmVzL05nR3JpZEl0ZW1cIlxyXG5pbXBvcnQgeyBOZ0dyaWRJdGVtUG9zaXRpb24sIE5nR3JpZEl0ZW1TaXplIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvSU5nR3JpZFwiXHJcbmltcG9ydCB7IENvbXBvbmVudCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlciwgRXZlbnRFbWl0dGVyLCBEeW5hbWljQ29tcG9uZW50TG9hZGVyLCBIb3N0LCBWaWV3RW5jYXBzdWxhdGlvbiwgVHlwZSwgQ29tcG9uZW50UmVmLCBLZXlWYWx1ZURpZmZlciwgS2V5VmFsdWVEaWZmZXJzLCBPbkluaXQsIE9uRGVzdHJveSwgRG9DaGVjaywgVmlld0NvbnRhaW5lclJlZiwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ2RpdicsXHJcblx0dGVtcGxhdGU6IFwiXCJcclxufSlcclxuZXhwb3J0IGNsYXNzIE5nR3JpZFBsYWNlaG9sZGVyIGltcGxlbWVudHMgT25Jbml0IHtcclxuXHRwcml2YXRlIF9zaXplOiBOZ0dyaWRJdGVtU2l6ZTtcclxuXHRwcml2YXRlIF9wb3NpdGlvbjogTmdHcmlkSXRlbVBvc2l0aW9uO1xyXG5cdHByaXZhdGUgX25nR3JpZDogTmdHcmlkO1xyXG5cdHByaXZhdGUgX2Nhc2NhZGVNb2RlOiBzdHJpbmc7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgX25nRWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcikgeyB9XHJcblxyXG5cdHB1YmxpYyByZWdpc3RlckdyaWQobmdHcmlkOiBOZ0dyaWQpIHtcclxuXHRcdHRoaXMuX25nR3JpZCA9IG5nR3JpZDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcclxuXHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdncmlkLXBsYWNlaG9sZGVyJywgdHJ1ZSk7XHJcblx0XHRpZiAodGhpcy5fbmdHcmlkLmF1dG9TdHlsZSkgdGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3Bvc2l0aW9uJywgJ2Fic29sdXRlJyk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0U2l6ZShuZXdTaXplOiBOZ0dyaWRJdGVtU2l6ZSk6IHZvaWQge1xyXG5cdFx0dGhpcy5fc2l6ZSA9IG5ld1NpemU7XHJcblx0XHR0aGlzLl9yZWNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRHcmlkUG9zaXRpb24obmV3UG9zaXRpb246IE5nR3JpZEl0ZW1Qb3NpdGlvbik6IHZvaWQge1xyXG5cdFx0dGhpcy5fcG9zaXRpb24gPSBuZXdQb3NpdGlvbjtcclxuXHRcdHRoaXMuX3JlY2FsY3VsYXRlUG9zaXRpb24oKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRDYXNjYWRlTW9kZShjYXNjYWRlOiBzdHJpbmcpOiB2b2lkIHtcclxuXHRcdHRoaXMuX2Nhc2NhZGVNb2RlID0gY2FzY2FkZTtcclxuXHRcdHN3aXRjaCAoY2FzY2FkZSkge1xyXG5cdFx0XHRjYXNlICd1cCc6XHJcblx0XHRcdGNhc2UgJ2xlZnQnOlxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdsZWZ0JywgXCIwcHhcIik7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3RvcCcsIFwiMHB4XCIpO1xyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdyaWdodCcsIG51bGwpO1xyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdib3R0b20nLCBudWxsKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdyaWdodCcsIFwiMHB4XCIpO1xyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd0b3AnLCBcIjBweFwiKTtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnbGVmdCcsIG51bGwpO1xyXG5cdFx0XHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICdib3R0b20nLCBudWxsKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZG93bic6XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2xlZnQnLCBcIjBweFwiKTtcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAnYm90dG9tJywgXCIwcHhcIik7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3JpZ2h0JywgbnVsbCk7XHJcblx0XHRcdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ3RvcCcsIG51bGwpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly9cdFByaXZhdGUgbWV0aG9kc1xyXG5cdHByaXZhdGUgX3NldERpbWVuc2lvbnModzogbnVtYmVyLCBoOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHRoaXMuX3JlbmRlcmVyLnNldEVsZW1lbnRTdHlsZSh0aGlzLl9uZ0VsLm5hdGl2ZUVsZW1lbnQsICd3aWR0aCcsIHcgKyBcInB4XCIpO1xyXG5cdFx0dGhpcy5fcmVuZGVyZXIuc2V0RWxlbWVudFN0eWxlKHRoaXMuX25nRWwubmF0aXZlRWxlbWVudCwgJ2hlaWdodCcsIGggKyBcInB4XCIpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfc2V0UG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHN3aXRjaCAodGhpcy5fY2FzY2FkZU1vZGUpIHtcclxuXHRcdFx0Y2FzZSAndXAnOlxyXG5cdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeCArICdweCwgJyArIHkgKyAncHgpJyk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0JzpcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgLXggKyAncHgsICcgKyB5ICsgJ3B4KScpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHR0aGlzLl9yZW5kZXJlci5zZXRFbGVtZW50U3R5bGUodGhpcy5fbmdFbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgeCArICdweCwgJyArIC15ICsgJ3B4KScpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfcmVjYWxjdWxhdGVQb3NpdGlvbigpOiB2b2lkIHtcclxuXHRcdGNvbnN0IHg6IG51bWJlciA9ICh0aGlzLl9uZ0dyaWQuY29sV2lkdGggKyB0aGlzLl9uZ0dyaWQubWFyZ2luTGVmdCArIHRoaXMuX25nR3JpZC5tYXJnaW5SaWdodCkgKiAodGhpcy5fcG9zaXRpb24uY29sIC0gMSkgKyB0aGlzLl9uZ0dyaWQubWFyZ2luTGVmdDtcclxuXHRcdGNvbnN0IHk6IG51bWJlciA9ICh0aGlzLl9uZ0dyaWQucm93SGVpZ2h0ICsgdGhpcy5fbmdHcmlkLm1hcmdpblRvcCArIHRoaXMuX25nR3JpZC5tYXJnaW5Cb3R0b20pICogKHRoaXMuX3Bvc2l0aW9uLnJvdyAtIDEpICsgdGhpcy5fbmdHcmlkLm1hcmdpblRvcDtcclxuXHRcdHRoaXMuX3NldFBvc2l0aW9uKHgsIHkpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBfcmVjYWxjdWxhdGVEaW1lbnNpb25zKCk6IHZvaWQge1xyXG5cdFx0Y29uc3QgdzogbnVtYmVyID0gKHRoaXMuX25nR3JpZC5jb2xXaWR0aCAqIHRoaXMuX3NpemUueCkgKyAoKHRoaXMuX25nR3JpZC5tYXJnaW5MZWZ0ICsgdGhpcy5fbmdHcmlkLm1hcmdpblJpZ2h0KSAqICh0aGlzLl9zaXplLnggLSAxKSk7XHJcblx0XHRjb25zdCBoOiBudW1iZXIgPSAodGhpcy5fbmdHcmlkLnJvd0hlaWdodCAqIHRoaXMuX3NpemUueSkgKyAoKHRoaXMuX25nR3JpZC5tYXJnaW5Ub3AgKyB0aGlzLl9uZ0dyaWQubWFyZ2luQm90dG9tKSAqICh0aGlzLl9zaXplLnkgLSAxKSk7XHJcblx0XHR0aGlzLl9zZXREaW1lbnNpb25zKHcsIGgpO1xyXG5cdH1cclxufSJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
