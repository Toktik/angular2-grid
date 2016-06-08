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
var common_1 = require('@angular/common');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var main_1 = require("./main");
// Annotation section
var MyAppComponent = (function () {
    function MyAppComponent() {
        this.boxes = [];
        this.rgb = '#efefef';
        this.curNum = 5;
        this.gridConfig = {
            'margins': [5],
            'draggable': true,
            'resizable': true,
            'max_cols': 6,
            'max_rows': 0,
            'visible_cols': 0,
            'visible_rows': 0,
            'min_cols': 1,
            'min_rows': 1,
            'col_width': 250,
            'row_height': 250,
            'cascade': 'up',
            'min_width': 100,
            'min_height': 100,
            'fix_to_grid': false,
            'auto_style': true,
            'auto_resize': true,
            'maintain_ratio': false,
            'prefer_new': false,
            'zoom_on_drag': false,
            'limit_to_screen': false
        };
        this.curItemCheck = 0;
        this.itemPositions = [];
        for (var i = 0; i < 4; i++) {
            this.boxes[i] = { id: i + 1, config: this._generateDefaultItemConfig() };
        }
    }
    MyAppComponent.prototype.onClick = function () {
        alert("CLICK EVENT!");
    };
    Object.defineProperty(MyAppComponent.prototype, "ratioDisabled", {
        get: function () {
            return (this.gridConfig.max_rows > 0 && this.gridConfig.visible_cols > 0) ||
                (this.gridConfig.max_cols > 0 && this.gridConfig.visible_rows > 0) ||
                (this.gridConfig.visible_cols > 0 && this.gridConfig.visible_rows > 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyAppComponent.prototype, "itemCheck", {
        get: function () { return this.curItemCheck; },
        set: function (v) {
            console.log(v);
            this.curItemCheck = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MyAppComponent.prototype, "curItem", {
        get: function () {
            return this.boxes[this.curItemCheck] ? this.boxes[this.curItemCheck].config : {};
        },
        enumerable: true,
        configurable: true
    });
    MyAppComponent.prototype.addBox = function () {
        var conf = this._generateDefaultItemConfig();
        conf.payload = this.curNum++;
        this.boxes.push({ id: conf.payload, config: conf });
    };
    MyAppComponent.prototype.removeBox = function () {
        if (this.boxes[this.curItemCheck])
            this.boxes.splice(this.curItemCheck, 1);
    };
    MyAppComponent.prototype.updateItem = function (index, pos) {
        // Do something here
    };
    MyAppComponent.prototype.onDrag = function (index, pos) {
        // Do something here
    };
    MyAppComponent.prototype.onResize = function (index, dims) {
        // Do something here
    };
    MyAppComponent.prototype._generateDefaultItemConfig = function () {
        return { 'dragHandle': '.handle', 'col': 1, 'row': 1, 'sizex': 1, 'sizey': 1 };
    };
    MyAppComponent.prototype._randomise = function () {
        for (var x in this.boxes) {
            this.boxes[x].config.col = Math.floor(Math.random() * 6) + 1;
            this.boxes[x].config.row = 1;
        }
    };
    MyAppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app.html',
            styleUrls: ['app.css', 'NgGrid.css', 'NgGrid_FixSmall.css'],
            directives: [common_1.CORE_DIRECTIVES, main_1.NgGrid, main_1.NgGridItem, common_1.FORM_DIRECTIVES],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], MyAppComponent);
    return MyAppComponent;
}());
core_1.enableProdMode();
platform_browser_dynamic_1.bootstrap(MyAppComponent);

//# sourceMappingURL=data:application/json;base64,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QUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUM5QixDQUFDO0lBQ0YsQ0FBQztJQWhHRjtRQUFDLGdCQUFTLENBQUM7WUFDVixRQUFRLEVBQUUsUUFBUTtZQUNsQixXQUFXLEVBQUUsVUFBVTtZQUN2QixTQUFTLEVBQUUsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLHFCQUFxQixDQUFDO1lBQzNELFVBQVUsRUFBRSxDQUFDLHdCQUFlLEVBQUUsYUFBTSxFQUFFLGlCQUFVLEVBQUUsd0JBQWUsQ0FBQztZQUNsRSxhQUFhLEVBQUUsd0JBQWlCLENBQUMsSUFBSTtTQUNyQyxDQUFDOztzQkFBQTtJQTJGRixxQkFBQztBQUFELENBekZBLEFBeUZDLElBQUE7QUFFRCxxQkFBYyxFQUFFLENBQUM7QUFDakIsb0NBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIFZpZXdFbmNhcHN1bGF0aW9uLCBlbmFibGVQcm9kTW9kZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDT1JFX0RJUkVDVElWRVMsIEZPUk1fRElSRUNUSVZFUyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IGJvb3RzdHJhcCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXItZHluYW1pYyc7XHJcbmltcG9ydCB7IE5nR3JpZCwgTmdHcmlkQ29uZmlnLCBOZ0dyaWRJdGVtLCBOZ0dyaWRJdGVtQ29uZmlnLCBOZ0dyaWRJdGVtRXZlbnQgfSBmcm9tIFwiLi9tYWluXCI7XHJcblxyXG4vLyBBbm5vdGF0aW9uIHNlY3Rpb25cclxuQENvbXBvbmVudCh7XHJcblx0c2VsZWN0b3I6ICdteS1hcHAnLFxyXG5cdHRlbXBsYXRlVXJsOiAnYXBwLmh0bWwnLFxyXG5cdHN0eWxlVXJsczogWydhcHAuY3NzJywgJ05nR3JpZC5jc3MnLCAnTmdHcmlkX0ZpeFNtYWxsLmNzcyddLFxyXG5cdGRpcmVjdGl2ZXM6IFtDT1JFX0RJUkVDVElWRVMsIE5nR3JpZCwgTmdHcmlkSXRlbSwgRk9STV9ESVJFQ1RJVkVTXSxcclxuXHRlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbi8vIENvbXBvbmVudCBjb250cm9sbGVyXHJcbmNsYXNzIE15QXBwQ29tcG9uZW50IHtcclxuXHRwcml2YXRlIGJveGVzID0gW107XHJcblx0cHJpdmF0ZSByZ2IgPSAnI2VmZWZlZic7XHJcblx0cHJpdmF0ZSBjdXJOdW06IG51bWJlciA9IDU7XHJcblx0cHJpdmF0ZSBncmlkQ29uZmlnID0gPE5nR3JpZENvbmZpZz57XHJcblx0XHQnbWFyZ2lucyc6IFs1XSxcclxuXHRcdCdkcmFnZ2FibGUnOiB0cnVlLFxyXG5cdFx0J3Jlc2l6YWJsZSc6IHRydWUsXHJcblx0XHQnbWF4X2NvbHMnOiA2LFxyXG5cdFx0J21heF9yb3dzJzogMCxcclxuXHRcdCd2aXNpYmxlX2NvbHMnOiAwLFxyXG5cdFx0J3Zpc2libGVfcm93cyc6IDAsXHJcblx0XHQnbWluX2NvbHMnOiAxLFxyXG5cdFx0J21pbl9yb3dzJzogMSxcclxuXHRcdCdjb2xfd2lkdGgnOiAyNTAsXHJcblx0XHQncm93X2hlaWdodCc6IDI1MCxcclxuXHRcdCdjYXNjYWRlJzogJ3VwJyxcclxuXHRcdCdtaW5fd2lkdGgnOiAxMDAsXHJcblx0XHQnbWluX2hlaWdodCc6IDEwMCxcclxuXHRcdCdmaXhfdG9fZ3JpZCc6IGZhbHNlLFxyXG5cdFx0J2F1dG9fc3R5bGUnOiB0cnVlLFxyXG5cdFx0J2F1dG9fcmVzaXplJzogdHJ1ZSxcclxuXHRcdCdtYWludGFpbl9yYXRpbyc6IGZhbHNlLFxyXG5cdFx0J3ByZWZlcl9uZXcnOiBmYWxzZSxcclxuXHRcdCd6b29tX29uX2RyYWcnOiBmYWxzZSxcclxuXHRcdCdsaW1pdF90b19zY3JlZW4nOiBmYWxzZVxyXG5cdH07XHJcblx0cHJpdmF0ZSBjdXJJdGVtQ2hlY2s6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBpdGVtUG9zaXRpb25zOiBBcnJheTxhbnk+ID0gW107XHJcblx0XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG5cdFx0XHR0aGlzLmJveGVzW2ldID0geyBpZDogaSArIDEsIGNvbmZpZzogdGhpcy5fZ2VuZXJhdGVEZWZhdWx0SXRlbUNvbmZpZygpIH07XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdG9uQ2xpY2soKSB7XHJcblx0XHRhbGVydChcIkNMSUNLIEVWRU5UIVwiKTtcclxuXHR9XHJcblx0XHJcblx0Z2V0IHJhdGlvRGlzYWJsZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gKHRoaXMuZ3JpZENvbmZpZy5tYXhfcm93cyA+IDAgJiYgdGhpcy5ncmlkQ29uZmlnLnZpc2libGVfY29scyA+IDApIHx8XHJcblx0XHRcdCh0aGlzLmdyaWRDb25maWcubWF4X2NvbHMgPiAwICYmIHRoaXMuZ3JpZENvbmZpZy52aXNpYmxlX3Jvd3MgPiAwKSB8fFxyXG5cdFx0XHQodGhpcy5ncmlkQ29uZmlnLnZpc2libGVfY29scyA+IDAgJiYgdGhpcy5ncmlkQ29uZmlnLnZpc2libGVfcm93cyA+IDApO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgaXRlbUNoZWNrKCkgeyByZXR1cm4gdGhpcy5jdXJJdGVtQ2hlY2s7IH1cclxuXHRzZXQgaXRlbUNoZWNrKHY6IG51bWJlcikge1xyXG5cdFx0Y29uc29sZS5sb2codik7XHJcblx0XHR0aGlzLmN1ckl0ZW1DaGVjayA9IHY7XHJcblx0fVxyXG5cdFxyXG5cdGdldCBjdXJJdGVtKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuYm94ZXNbdGhpcy5jdXJJdGVtQ2hlY2tdID8gdGhpcy5ib3hlc1t0aGlzLmN1ckl0ZW1DaGVja10uY29uZmlnIDoge307XHJcblx0fVxyXG5cdFxyXG5cdGFkZEJveCgpIHtcclxuXHRcdGxldCBjb25mID0gdGhpcy5fZ2VuZXJhdGVEZWZhdWx0SXRlbUNvbmZpZygpO1xyXG5cdFx0Y29uZi5wYXlsb2FkID0gdGhpcy5jdXJOdW0rKztcclxuXHRcdHRoaXMuYm94ZXMucHVzaCh7IGlkOiBjb25mLnBheWxvYWQsIGNvbmZpZzogY29uZiB9KTtcclxuXHR9XHJcblx0XHJcblx0cmVtb3ZlQm94KCkge1xyXG5cdFx0aWYgKHRoaXMuYm94ZXNbdGhpcy5jdXJJdGVtQ2hlY2tdKSB0aGlzLmJveGVzLnNwbGljZSh0aGlzLmN1ckl0ZW1DaGVjaywgMSk7XHJcblx0XHRcclxuXHR9XHJcblx0XHJcblx0dXBkYXRlSXRlbShpbmRleDogbnVtYmVyLCBwb3M6IHsgY29sOiBudW1iZXIsIHJvdzogbnVtYmVyLCBzaXpleDogbnVtYmVyLCBzaXpleTogbnVtYmVyIH0pIHtcclxuXHRcdC8vIERvIHNvbWV0aGluZyBoZXJlXHJcblx0fVxyXG5cdFxyXG5cdG9uRHJhZyhpbmRleDogbnVtYmVyLCBwb3M6IHsgbGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciB9KSB7XHJcblx0XHQvLyBEbyBzb21ldGhpbmcgaGVyZVxyXG5cdH1cclxuXHRcclxuXHRvblJlc2l6ZShpbmRleDogbnVtYmVyLCBkaW1zOiB7IHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyIH0pIHtcclxuXHRcdC8vIERvIHNvbWV0aGluZyBoZXJlXHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX2dlbmVyYXRlRGVmYXVsdEl0ZW1Db25maWcoKTogYW55IHtcclxuXHRcdHJldHVybiB7ICdkcmFnSGFuZGxlJzogJy5oYW5kbGUnLCAnY29sJzogMSwgJ3Jvdyc6IDEsICdzaXpleCc6IDEsICdzaXpleSc6IDEgfTtcclxuXHR9XHJcblx0XHJcblx0cHJpdmF0ZSBfcmFuZG9taXNlKCkge1xyXG5cdFx0Zm9yICh2YXIgeCBpbiB0aGlzLmJveGVzKSB7XHJcblx0XHRcdHRoaXMuYm94ZXNbeF0uY29uZmlnLmNvbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYpICsgMTtcclxuXHRcdFx0dGhpcy5ib3hlc1t4XS5jb25maWcucm93ID0gMTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmVuYWJsZVByb2RNb2RlKCk7XHJcbmJvb3RzdHJhcChNeUFwcENvbXBvbmVudCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
