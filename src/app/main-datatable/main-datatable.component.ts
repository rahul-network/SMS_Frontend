import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatatableFeedService } from '../datatable-feed.service';
import { DetailDataComponent } from './detail-data/detail-data.component';
import { DialerAppComponent  } from '../Voice/dialer-app.component';


@Component({
  selector: 'app-main-datatable',
  templateUrl: './main-datatable.component.html',
  styleUrls: ['./main-datatable.component.css']
})
export class MainDatatableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['video','call', 'sms',  'email','firstName','clinicId','cellPhone'];
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
      

    });
  }

  openVideoCall(_data: any) {
    window.open(`${location.origin}/#/videocall/${_data.id}`, "_blank");
  
  }

  openCall(_data: any) {
    debugger;
    console.log(_data);
    const dialogRef = this.dialog.open(DialerAppComponent, {
       disableClose: true ,
      width: '70%',
      data: { 
        id: _data.id,
        cellPhone: _data.cellPhone,
        firstName :_data.firstName,
        clinicId: _data.clinicId,
        email : _data.email,
        smsPhoneNo : _data.clinic.smsPhoneNo,
        lastName :_data.lastName,
        gender :_data.gender,

       }
    });

    

    dialogRef.afterClosed().subscribe(result => {
      

    });
  }

}
