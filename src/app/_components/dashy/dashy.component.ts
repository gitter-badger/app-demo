import { Component, OnInit, ViewChild } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { MatDialog, MatSidenav } from '@angular/material';
import { NewDashboardDialogComponent } from './new-dashboard-dialog/new-dashboard-dialog.component';
import { AuthService } from "../../_services/auth.service";
import { SnackBarService } from '../../_services/snack-bar-service.service';
import { Dashboard } from '../../_classes/dashboard';
import { Widget } from '../../_classes/dashboard';


@Component({
  selector: 'app-dashy',
  templateUrl: './dashy.component.html',
  styleUrls: ['./dashy.component.css']
})
export class DashyComponent implements OnInit {
  options: GridsterConfig = {
    gridType: 'fit',
    // 'scrollVertical' will fit on width and height of the items will be the same as the width
    // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
    // 'fixed' will set the rows and columns dimensions based on fixedColWidth and fixedRowHeight options
    // 'fit' will fit the items in the container without scroll;
    // 'verticalFixed' will set the rows to fixedRowHeight and columns width will fit the space available
    // 'horizontalFixed' will set the columns to fixedColWidth and rows height will fit the space available
    fixedColWidth: 250, // fixed col width for gridType: 'fixed'
    fixedRowHeight: 250, // fixed row height for gridType: 'fixed'
    keepFixedHeightInMobile: false, // keep the height from fixed gridType in mobile layout
    keepFixedWidthInMobile: false, // keep the width from fixed gridType in mobile layout
    compactType: 'none', // compact items: 'none' | 'compactUp' | 'compactLeft' | 'compactUp&Left' | 'compactLeft&Up'
    mobileBreakpoint: -1, // if the screen is not wider that this, remove the grid layout and stack the items
    minCols: 8, // minimum amount of columns in the grid
    maxCols: 8, // maximum amount of columns in the grid
    minRows: 8, // minimum amount of rows in the grid
    maxRows: 8, // maximum amount of rows in the grid
    defaultItemCols: 1, // default width of an item in columns
    defaultItemRows: 1, // default height of an item in rows
    maxItemCols: 50, // max item number of cols
    maxItemRows: 50, // max item number of rows
    minItemCols: 1, // min item number of columns
    minItemRows: 1, // min item number of rows
    minItemArea: 1, // min item area: cols * rows
    maxItemArea: 2500, // max item area: cols * rows
    margin: 10,  // margin between grid items
    outerMargin: true,  // if margins will apply to the sides of the container
    scrollSensitivity: 10,  // margin of the dashboard where to start scrolling
    scrollSpeed: 20,  // how much to scroll each mouse move when in the scrollSensitivity zone
    initCallback: undefined, // callback to call after grid has initialized. Arguments: gridsterComponent
    itemChangeCallback: undefined,  // callback to call for each item when is changes x, y, rows, cols.
    // Arguments: gridsterItem, gridsterItemComponent
    itemResizeCallback: undefined,  // callback to call for each item when width/height changes.
    // Arguments: gridsterItem, gridsterItemComponent
    itemInitCallback: undefined,  // callback to call for each item when is initialized.
    // Arguments: gridsterItem, gridsterItemComponent
    enableEmptyCellClick: false, // enable empty cell click events
    enableEmptyCellContextMenu: false, // enable empty cell context menu (right click) events
    enableEmptyCellDrop: false, // enable empty cell drop events
    enableEmptyCellDrag: false, // enable empty cell drag events
    emptyCellClickCallback: undefined, // empty cell click callback
    emptyCellContextMenuCallback: undefined, // empty cell context menu (right click) callback
    emptyCellDropCallback: undefined, // empty cell drag drop callback. HTML5 Drag & Drop
    emptyCellDragCallback: undefined, // empty cell drag and create item like excel cell selection
    // Arguments: event, gridsterItem{x, y, rows: defaultItemRows, cols: defaultItemCols}
    emptyCellDragMaxCols: 50, // limit empty cell drag max cols
    emptyCellDragMaxRows: 50, // limit empty cell drag max rows
    draggable: {
      enabled: true, // enable/disable draggable items
      ignoreContentClass: 'gridster-item-content', // default content class to ignore the drag event from
      ignoreContent: true, // if true drag will start only from elements from `dragHandleClass`
      dragHandleClass: 'drag-handler', // drag event only from this class. If `ignoreContent` is true.
      stop: undefined, // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
      start: undefined // callback when dragging an item starts.
      // Arguments: item, gridsterItem, event
    },
    resizable: {
      enabled: true, // enable/disable resizable items
      handles: {
        s: true,
        e: true,
        n: true,
        w: true,
        se: true,
        ne: true,
        sw: true,
        nw: true
      }, // resizable edges of an item
      stop: undefined, // callback when resizing an item stops. Accepts Promise return to cancel/approve resize.
      start: undefined // callback when resizing an item starts.
      // Arguments: item, gridsterItem, event
    },
    swap: true, // allow items to switch position if drop on top of another
    pushItems: true, // push items when resizing and dragging
    pushResizeItems: true, // on resize of item will shrink adjacent items
    displayGrid: 'onDrag&Resize', // display background grid of rows and columns
    disableWindowResize: false // disable the window on resize listener. This will stop grid to recalculate on window resize.
  };
  private _dashboards: Array<Dashboard> = [];
  private _selectedDashboard: Dashboard;
  selectedWidget: Widget;
  @ViewChild('widgetEdit') widgetEditSideNav: MatSidenav;


  constructor(public snackBarService: SnackBarService, public auth: AuthService, public dialog: MatDialog) { }

  selectWidget(widget: Widget) {
    this.selectedWidget = widget;
    this.widgetEditSideNav
      .open()
      .then(() => {
        this.options.api.resize();
      })
  }

  closeWidgetEdit() {
    this.selectedWidget = null;
    this.widgetEditSideNav
      .close()
      .then(() => {
        this.options.api.resize();
      })
  }

  get dashboards(): Array<Dashboard> {
    return this._dashboards;
  }

  set dashboards(dashboards: Array<Dashboard>) {
    this._dashboards = dashboards;
  }


  get selectedDashboard(): Dashboard {
    return this._selectedDashboard
  }

  set selectedDashboard(dashboard: Dashboard) {
    this._selectedDashboard = dashboard
  }

  addWidget() {

    if (this.options.api.getNextPossiblePosition({ cols: -1, rows: -1 })) {
      this.selectedDashboard.widgets.push(new Widget());
    }
    else {
      this.snackBarService.showMessage('No more space brah. Try making some space.')
    }
  }

  ngOnInit() {

    this.dashboards = [
      new Dashboard('demo dashboard'),
      new Dashboard('sales dashboard')

    ]

    this.selectedDashboard = this.dashboards[0];
  }

  showNewDashboardDialog(): void {
    this.dialog.open(NewDashboardDialogComponent).afterClosed().subscribe((dashboard: Dashboard) => {

      if (dashboard) {
        this.dashboards.push(dashboard);
        this.selectedDashboard = dashboard;
        this.closeWidgetEdit();
      }
    })
  }

}
