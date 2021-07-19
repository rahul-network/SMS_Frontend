import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatatableFeedService } from 'src/app/datatable-feed.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";


@Component({
  selector: 'app-detail-data',
  templateUrl: './detail-data.component.html',
  styleUrls: ['./detail-data.component.css']
})
export class DetailDataComponent implements OnInit {

  displayedColumns: string[] = ['content', 'createdDateTime', 'smsType'];
  detailDataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort: MatSort;

 

  constructor(public dialogRef: MatDialogRef<DetailDataComponent>,private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) 
    public data: any,
    private datatableFeedService: DatatableFeedService) { }

    registerForm: FormGroup = this.formBuilder.group({
      id: [ , { updateOn: "change" }],
      message: [,{validators: [Validators.required],updateOn: "change",}],

      });

  ngOnInit(): void {
    let curretRowId = this.data.id;
    this.datatableFeedService.getDataById(curretRowId).subscribe((_feedDataDetails) => {
      this.detailDataSource = new MatTableDataSource(_feedDataDetails);
      this.detailDataSource.sort = this.sort;
    });
  }
  submitForm():void{

    
    this.datatableFeedService.sendSms(this.data.id,this.data.smsPhoneNo,this.registerForm.get('message')?.value).subscribe((_feedDataDetails) => {
      this.detailDataSource = new MatTableDataSource(_feedDataDetails);
      this.detailDataSource.sort = this.sort;
      this.registerForm.reset();
      this.refreshData();
    });
    
  }

  refreshData():void{
    this.datatableFeedService.getDataById(this.data.id).subscribe((_feedDataDetails) => {
      this.detailDataSource = new MatTableDataSource(_feedDataDetails);
      this.detailDataSource.sort = this.sort;
    });
  }
  close(): void {
    this.dialogRef.close();
  }

}
