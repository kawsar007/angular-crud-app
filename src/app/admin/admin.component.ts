import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../services/api.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {AfterViewInit, ViewChild} from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource !:  MatTableDataSource<any>;

  isAuth: boolean = true;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private dialog: MatDialog, private api : ApiService, private toast: NgToastService ) { }

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
