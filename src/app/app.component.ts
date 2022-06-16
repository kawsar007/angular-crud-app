import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'angular-crud';

  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource !:  MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  constructor(private dialog: MatDialog, private api : ApiService, private toast: NgToastService ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%',
    }).afterClosed().subscribe(val => {
      if(val === 'save') {
        this.getAllProducts();
      }
    })
  }

  getAllProducts() {
    this.api.getProduct()
     .subscribe({
       next:(res)=>{
         this.dataSource = new MatTableDataSource(res);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;         
       },
       error:(err)=>{
         alert("Error while fetching the Records!")
       }
     })
  }

  editProduct(element: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: element
    }).afterClosed().subscribe(val => {
      this.getAllProducts();
    })
  }

  deleteProduct(id: number) {
     this.api.deleteProduct(id)
      .subscribe({
        next: (res) => {
          this.toast.success({ detail: "Success Message", summary: "Product Delete successfully!", duration: 3000 })
          this.getAllProducts();
        },
        error: () => {
          this.toast.error({detail: "Error Message", summary: "Product Not Delete successfully!", duration: 3000})
        }
      })
  }

  applyFilter (event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}