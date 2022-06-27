import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand New", "Second Hand", "Refurbished"];
  productForm !: FormGroup;
  // productForm : any;
  actionBtn: string = "Save";

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    private toast: NgToastService
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    })

    if (this.editData) {
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }

  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (res: any) => {
              this.toast.success({ detail: "Success Message", summary: "Product added successfully!", duration: 3000 })
              this.productForm.reset();
              this.dialogRef.close('save')
            },
            error: () => {
              this.toast.error({ detail: "Error Message", summary: "Error while adding the product", duration: 3000 })
            }
          })
      }
    } else {
      this.updateProduct()
    }

  }

  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id)
     .subscribe({
       next: (res) => {
         this.toast.success({ detail: "Success Message", summary: "Product Successfully Update.", duration: 3000 })
         this.productForm.reset();
         this.dialogRef.close('Update')
       },
       error: (err) => {
         this.toast.error({ detail: "Error Message", summary: "Sorry!, Somthing is wrong.", duration: 3000 })
       }
     })
  }

}
