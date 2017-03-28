import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from "ag-grid-angular/main";
import { GridComponent } from './grid.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule.withComponents(null)
  ],
  declarations: [ GridComponent ],
  exports:[ GridComponent ]
})
export class GridModule { }
