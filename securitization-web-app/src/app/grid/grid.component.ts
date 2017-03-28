import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GridOptions } from "ag-grid";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, OnChanges {
  @Input() rowData;
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if(this.gridOptions.api){
      this.gridOptions.api.setRowData(this.rowData);
    }
  }

  private gridOptions: GridOptions;

  constructor() {
    this.gridOptions = {};
    this.gridOptions.columnDefs = [
      {
        headerName: "Name",
        field: "name",
        width: 100
      },
      {
        headerName: "Password",
        field: "password",
        width: 100
      },

    ];
    this.gridOptions.rowData = this.rowData;
  }
}
