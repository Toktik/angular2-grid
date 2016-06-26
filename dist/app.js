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
            'max_cols': 0,
            'max_rows': 0,
            'visible_cols': 0,
            'visible_rows': 0,
            'min_cols': 1,
            'min_rows': 1,
            'col_width': 2,
            'row_height': 2,
            'cascade': 'up',
            'min_width': 50,
            'min_height': 50,
            'fix_to_grid': false,
            'auto_style': true,
            'auto_resize': false,
            'maintain_ratio': false,
            'prefer_new': false,
            'zoom_on_drag': false,
            'limit_to_screen': true
        };
        this.curItemCheck = 0;
        this.itemPositions = [];
        for (var i = 0; i < 4; i++) {
            var conf = this._generateDefaultItemConfig();
            conf.payload = 1 + i;
            this.boxes[i] = { id: i + 1, config: conf };
        }
    }
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
        get: function () {
            return this.curItemCheck;
        },
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
        if (this.boxes[this.curItemCheck]) {
            this.boxes.splice(this.curItemCheck, 1);
        }
    };
    MyAppComponent.prototype.updateItem = function (index, event) {
        // Do something here
    };
    MyAppComponent.prototype.onDrag = function (index, event) {
        // Do something here
    };
    MyAppComponent.prototype.onResize = function (index, event) {
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
            styleUrls: ['app.css', 'NgGrid.css'],
            directives: [common_1.CORE_DIRECTIVES, main_1.NgGrid, main_1.NgGridItem, common_1.FORM_DIRECTIVES],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], MyAppComponent);
    return MyAppComponent;
}());
core_1.enableProdMode();
platform_browser_dynamic_1.bootstrap(MyAppComponent);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQTZELGVBQWUsQ0FBQyxDQUFBO0FBQzdFLHVCQUFpRCxpQkFBaUIsQ0FBQyxDQUFBO0FBQ25FLHlDQUEwQixtQ0FBbUMsQ0FBQyxDQUFBO0FBQzlELHFCQUFvRixRQUFRLENBQUMsQ0FBQTtBQU83RixxQkFBcUI7QUFTckI7SUE4QkM7UUE3QlEsVUFBSyxHQUFlLEVBQUUsQ0FBQztRQUN2QixRQUFHLEdBQVcsU0FBUyxDQUFDO1FBQ3hCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsZUFBVSxHQUErQjtZQUNoRCxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDZCxXQUFXLEVBQUUsSUFBSTtZQUNqQixXQUFXLEVBQUUsSUFBSTtZQUNqQixVQUFVLEVBQUUsQ0FBQztZQUNiLFVBQVUsRUFBRSxDQUFDO1lBQ2IsY0FBYyxFQUFFLENBQUM7WUFDakIsY0FBYyxFQUFFLENBQUM7WUFDakIsVUFBVSxFQUFFLENBQUM7WUFDYixVQUFVLEVBQUUsQ0FBQztZQUNiLFdBQVcsRUFBRSxDQUFDO1lBQ2QsWUFBWSxFQUFFLENBQUM7WUFDZixTQUFTLEVBQUUsSUFBSTtZQUNmLFdBQVcsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEVBQUU7WUFDaEIsYUFBYSxFQUFFLEtBQUs7WUFDcEIsWUFBWSxFQUFFLElBQUk7WUFDbEIsYUFBYSxFQUFFLEtBQUs7WUFDcEIsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixZQUFZLEVBQUUsS0FBSztZQUNuQixjQUFjLEVBQUUsS0FBSztZQUNyQixpQkFBaUIsRUFBRSxJQUFJO1NBQ3ZCLENBQUM7UUFDTSxpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUN6QixrQkFBYSxHQUFlLEVBQUUsQ0FBQztRQUd0QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzVCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1lBQy9DLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO1FBQzdDLENBQUM7SUFDRixDQUFDO0lBRUQsc0JBQUkseUNBQWE7YUFBakI7WUFDQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dCQUN4RSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7Z0JBQ2xFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLENBQUM7OztPQUFBO0lBRUQsc0JBQUkscUNBQVM7YUFBYjtZQUNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzFCLENBQUM7YUFFRCxVQUFjLENBQVM7WUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7OztPQUxBO0lBT0Qsc0JBQUksbUNBQU87YUFBWDtZQUNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2xGLENBQUM7OztPQUFBO0lBRUQsK0JBQU0sR0FBTjtRQUNDLElBQU0sSUFBSSxHQUFxQixJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztRQUNqRSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxrQ0FBUyxHQUFUO1FBQ0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekMsQ0FBQztJQUNGLENBQUM7SUFFRCxtQ0FBVSxHQUFWLFVBQVcsS0FBYSxFQUFFLEtBQXNCO1FBQy9DLG9CQUFvQjtJQUNyQixDQUFDO0lBRUQsK0JBQU0sR0FBTixVQUFPLEtBQWEsRUFBRSxLQUFzQjtRQUMzQyxvQkFBb0I7SUFDckIsQ0FBQztJQUVELGlDQUFRLEdBQVIsVUFBUyxLQUFhLEVBQUUsS0FBc0I7UUFDN0Msb0JBQW9CO0lBQ3JCLENBQUM7SUFFTyxtREFBMEIsR0FBbEM7UUFDQyxNQUFNLENBQUMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUNoRixDQUFDO0lBRU8sbUNBQVUsR0FBbEI7UUFDQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDOUIsQ0FBQztJQUNGLENBQUM7SUFsR0Y7UUFBQyxnQkFBUyxDQUFDO1lBQ1YsUUFBUSxFQUFFLFFBQVE7WUFDbEIsV0FBVyxFQUFFLFVBQVU7WUFDdkIsU0FBUyxFQUFFLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztZQUNwQyxVQUFVLEVBQUUsQ0FBQyx3QkFBZSxFQUFFLGFBQU0sRUFBRSxpQkFBVSxFQUFFLHdCQUFlLENBQUM7WUFDbEUsYUFBYSxFQUFFLHdCQUFpQixDQUFDLElBQUk7U0FDckMsQ0FBQzs7c0JBQUE7SUE2RkYscUJBQUM7QUFBRCxDQTNGQSxBQTJGQyxJQUFBO0FBRUQscUJBQWMsRUFBRSxDQUFDO0FBQ2pCLG9DQUFTLENBQUMsY0FBYyxDQUFDLENBQUMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBWaWV3RW5jYXBzdWxhdGlvbiwgZW5hYmxlUHJvZE1vZGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ09SRV9ESVJFQ1RJVkVTLCBGT1JNX0RJUkVDVElWRVMgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBib290c3RyYXAgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMnO1xyXG5pbXBvcnQgeyBOZ0dyaWQsIE5nR3JpZENvbmZpZywgTmdHcmlkSXRlbSwgTmdHcmlkSXRlbUNvbmZpZywgTmdHcmlkSXRlbUV2ZW50IH0gZnJvbSBcIi4vbWFpblwiO1xyXG5cclxuaW50ZXJmYWNlIEJveCB7XHJcblx0aWQ6IG51bWJlcjtcclxuXHRjb25maWc6IE5nR3JpZEl0ZW1Db25maWc7XHJcbn1cclxuXHJcbi8vIEFubm90YXRpb24gc2VjdGlvblxyXG5AQ29tcG9uZW50KHtcclxuXHRzZWxlY3RvcjogJ215LWFwcCcsXHJcblx0dGVtcGxhdGVVcmw6ICdhcHAuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJ2FwcC5jc3MnLCAnTmdHcmlkLmNzcyddLC8vICdOZ0dyaWRfRml4U21hbGwuY3NzJ10sXHJcblx0ZGlyZWN0aXZlczogW0NPUkVfRElSRUNUSVZFUywgTmdHcmlkLCBOZ0dyaWRJdGVtLCBGT1JNX0RJUkVDVElWRVNdLFxyXG5cdGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuLy8gQ29tcG9uZW50IGNvbnRyb2xsZXJcclxuY2xhc3MgTXlBcHBDb21wb25lbnQge1xyXG5cdHByaXZhdGUgYm94ZXM6IEFycmF5PEJveD4gPSBbXTtcclxuXHRwcml2YXRlIHJnYjogc3RyaW5nID0gJyNlZmVmZWYnO1xyXG5cdHByaXZhdGUgY3VyTnVtOiBudW1iZXIgPSA1O1xyXG5cdHByaXZhdGUgZ3JpZENvbmZpZzogTmdHcmlkQ29uZmlnID0gPE5nR3JpZENvbmZpZz57XHJcblx0XHQnbWFyZ2lucyc6IFs1XSxcclxuXHRcdCdkcmFnZ2FibGUnOiB0cnVlLFxyXG5cdFx0J3Jlc2l6YWJsZSc6IHRydWUsXHJcblx0XHQnbWF4X2NvbHMnOiAwLFxyXG5cdFx0J21heF9yb3dzJzogMCxcclxuXHRcdCd2aXNpYmxlX2NvbHMnOiAwLFxyXG5cdFx0J3Zpc2libGVfcm93cyc6IDAsXHJcblx0XHQnbWluX2NvbHMnOiAxLFxyXG5cdFx0J21pbl9yb3dzJzogMSxcclxuXHRcdCdjb2xfd2lkdGgnOiAyLFxyXG5cdFx0J3Jvd19oZWlnaHQnOiAyLFxyXG5cdFx0J2Nhc2NhZGUnOiAndXAnLFxyXG5cdFx0J21pbl93aWR0aCc6IDUwLFxyXG5cdFx0J21pbl9oZWlnaHQnOiA1MCxcclxuXHRcdCdmaXhfdG9fZ3JpZCc6IGZhbHNlLFxyXG5cdFx0J2F1dG9fc3R5bGUnOiB0cnVlLFxyXG5cdFx0J2F1dG9fcmVzaXplJzogZmFsc2UsXHJcblx0XHQnbWFpbnRhaW5fcmF0aW8nOiBmYWxzZSxcclxuXHRcdCdwcmVmZXJfbmV3JzogZmFsc2UsXHJcblx0XHQnem9vbV9vbl9kcmFnJzogZmFsc2UsXHJcblx0XHQnbGltaXRfdG9fc2NyZWVuJzogdHJ1ZVxyXG5cdH07XHJcblx0cHJpdmF0ZSBjdXJJdGVtQ2hlY2s6IG51bWJlciA9IDA7XHJcblx0cHJpdmF0ZSBpdGVtUG9zaXRpb25zOiBBcnJheTxhbnk+ID0gW107XHJcblx0XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG5cdFx0XHRjb25zdCBjb25mID0gdGhpcy5fZ2VuZXJhdGVEZWZhdWx0SXRlbUNvbmZpZygpO1xyXG5cdFx0XHRjb25mLnBheWxvYWQgPSAxICsgaTtcclxuXHRcdFx0dGhpcy5ib3hlc1tpXSA9IHsgaWQ6IGkgKyAxLCBjb25maWc6IGNvbmYgfTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0Z2V0IHJhdGlvRGlzYWJsZWQoKTogYm9vbGVhbiB7XHJcblx0XHRyZXR1cm4gKHRoaXMuZ3JpZENvbmZpZy5tYXhfcm93cyA+IDAgJiYgdGhpcy5ncmlkQ29uZmlnLnZpc2libGVfY29scyA+IDApIHx8XHJcblx0XHRcdCh0aGlzLmdyaWRDb25maWcubWF4X2NvbHMgPiAwICYmIHRoaXMuZ3JpZENvbmZpZy52aXNpYmxlX3Jvd3MgPiAwKSB8fFxyXG5cdFx0XHQodGhpcy5ncmlkQ29uZmlnLnZpc2libGVfY29scyA+IDAgJiYgdGhpcy5ncmlkQ29uZmlnLnZpc2libGVfcm93cyA+IDApO1xyXG5cdH1cclxuXHRcclxuXHRnZXQgaXRlbUNoZWNrKCk6IG51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5jdXJJdGVtQ2hlY2s7XHJcblx0fVxyXG5cdFxyXG5cdHNldCBpdGVtQ2hlY2sodjogbnVtYmVyKSB7XHJcblx0XHRjb25zb2xlLmxvZyh2KTtcclxuXHRcdHRoaXMuY3VySXRlbUNoZWNrID0gdjtcclxuXHR9XHJcblx0XHJcblx0Z2V0IGN1ckl0ZW0oKTogTmdHcmlkSXRlbUNvbmZpZyB7XHJcblx0XHRyZXR1cm4gdGhpcy5ib3hlc1t0aGlzLmN1ckl0ZW1DaGVja10gPyB0aGlzLmJveGVzW3RoaXMuY3VySXRlbUNoZWNrXS5jb25maWcgOiB7fTtcclxuXHR9XHJcblx0XHJcblx0YWRkQm94KCk6IHZvaWQge1xyXG5cdFx0Y29uc3QgY29uZjogTmdHcmlkSXRlbUNvbmZpZyA9IHRoaXMuX2dlbmVyYXRlRGVmYXVsdEl0ZW1Db25maWcoKTtcclxuXHRcdGNvbmYucGF5bG9hZCA9IHRoaXMuY3VyTnVtKys7XHJcblx0XHR0aGlzLmJveGVzLnB1c2goeyBpZDogY29uZi5wYXlsb2FkLCBjb25maWc6IGNvbmYgfSk7XHJcblx0fVxyXG5cdFxyXG5cdHJlbW92ZUJveCgpOiB2b2lkIHtcclxuXHRcdGlmICh0aGlzLmJveGVzW3RoaXMuY3VySXRlbUNoZWNrXSkge1xyXG5cdFx0XHR0aGlzLmJveGVzLnNwbGljZSh0aGlzLmN1ckl0ZW1DaGVjaywgMSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdFxyXG5cdHVwZGF0ZUl0ZW0oaW5kZXg6IG51bWJlciwgZXZlbnQ6IE5nR3JpZEl0ZW1FdmVudCk6IHZvaWQge1xyXG5cdFx0Ly8gRG8gc29tZXRoaW5nIGhlcmVcclxuXHR9XHJcblx0XHJcblx0b25EcmFnKGluZGV4OiBudW1iZXIsIGV2ZW50OiBOZ0dyaWRJdGVtRXZlbnQpOiB2b2lkIHtcclxuXHRcdC8vIERvIHNvbWV0aGluZyBoZXJlXHJcblx0fVxyXG5cdFxyXG5cdG9uUmVzaXplKGluZGV4OiBudW1iZXIsIGV2ZW50OiBOZ0dyaWRJdGVtRXZlbnQpOiB2b2lkIHtcclxuXHRcdC8vIERvIHNvbWV0aGluZyBoZXJlXHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX2dlbmVyYXRlRGVmYXVsdEl0ZW1Db25maWcoKTogTmdHcmlkSXRlbUNvbmZpZyB7XHJcblx0XHRyZXR1cm4geyAnZHJhZ0hhbmRsZSc6ICcuaGFuZGxlJywgJ2NvbCc6IDEsICdyb3cnOiAxLCAnc2l6ZXgnOiAxLCAnc2l6ZXknOiAxIH07XHJcblx0fVxyXG5cdFxyXG5cdHByaXZhdGUgX3JhbmRvbWlzZSgpOiB2b2lkIHtcclxuXHRcdGZvciAodmFyIHggaW4gdGhpcy5ib3hlcykge1xyXG5cdFx0XHR0aGlzLmJveGVzW3hdLmNvbmZpZy5jb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA2KSArIDE7XHJcblx0XHRcdHRoaXMuYm94ZXNbeF0uY29uZmlnLnJvdyA9IDE7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5lbmFibGVQcm9kTW9kZSgpO1xyXG5ib290c3RyYXAoTXlBcHBDb21wb25lbnQpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
