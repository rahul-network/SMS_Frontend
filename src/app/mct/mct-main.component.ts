import { Component, OnInit, ViewChild } from '@angular/core';
import { MctDataComponent } from './detail/mct-data.component';

@Component({
  selector: 'app-mct-main',
  templateUrl: './mct-main.component.html',
  styleUrls: ['./mct-main.component.scss']
})
export class MctMainComponent implements OnInit {
  @ViewChild(MctDataComponent) mctDataComponent;
  constructor() { }

  ngOnInit(): void {
  }

  refreshMctForms(){
    this.mctDataComponent.getMctForms();
  }
}
