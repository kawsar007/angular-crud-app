import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm !: FormGroup;

  constructor( 
    private formBuilder : FormBuilder,
    private api : ApiService,
    private toast: NgToastService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      fullName: ['', Validators.required,],
      mobileNumber: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    })
  }

  signupHandler() {
    this.api.signupUser(this.signupForm.value)
     .subscribe({
       next: (res: any) => {
        this.toast.success({ detail: "Success Message", summary: "Registation successfully!", duration: 3000 })
        this.signupForm.reset();
        this.router.navigate(['login']);
       },
       error:  (err) => {
         this.toast.error({ detail: "Error Message", summary: "Somthing went wrong", duration: 3000 })
       }
     })
  }

}
