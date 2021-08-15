import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatatableFeedService } from '../datatable-feed.service';
import { DetailDataComponent } from './detail-data/detail-data.component';
import {VideoCallComponent   } from '../Video/Call/videoCall.component'

@Component({
  selector: 'app-main-datatable',
  templateUrl: './main-datatable.component.html',
  styleUrls: ['./main-datatable.component.css']
})
export class MainDatatableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['video','sms',  'email','firstName','clinicId','cellPhone'];
  dataSource = new MatTableDataSource([]);
  
  @ViewChild(MatSort) sort: MatSort;

  constructor(private datatableFeedService: DatatableFeedService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.feedDatatableData();
  }

  ngAfterViewInit() {
  }

  feedDatatableData() {
    this.datatableFeedService.getAllData().subscribe((_feedData) => {
      this.dataSource = new MatTableDataSource(_feedData);
      this.dataSource.sort = this.sort;
    });
  }

  openDetail(_data: any) {
    const dialogRef = this.dialog.open(DetailDataComponent, {
      width: '5000px',
      data: { 
        id: _data.id,
        cellPhone: _data.cellPhone,
        firstName :_data.firstName,
        clinicId: _data.clinicId,
        email : _data.email,
        smsPhoneNo : _data.clinic.smsPhoneNo
       }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);

    });
  }

  openCall(_data: any) {
    window.open(`${location.origin}/#/videocall/${_data.id}`, "_blank");
    
    // const dialogRef = this.dialog.open(VideoCallComponent, {
    //   width: '100%',
    //   data: { 
    //     id: _data.id,
    //     cellPhone: _data.cellPhone,
    //     firstName :_data.firstName,
    //     clinicId: _data.clinicId,
    //     email : _data.email,
    //     smsPhoneNo : _data.clinic.smsPhoneNo
    //    }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed', result);

    // });
  }

}
