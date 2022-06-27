import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService, private toast: NgToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['',Validators.required],
      password: ['',Validators.required,]
    })
  }

  login() {
    this.api.loginUser()
      .subscribe({
        next: (res: any) => {
          const user = res.find((a: any) => {
            return a.email === this.loginForm.value.email && a.password === this.loginForm.value.password
          });
          if (user) {
            this.toast.success({ detail: "Success message", summary: "Login Success!", duration: 3000 })
            this.loginForm.reset();
            this.router.navigate(['dashboard'])
          } else {
            this.toast.error({ detail: "Error message", summary: "User not found.", duration: 3000 })
            this.loginForm.reset();
          }
        },

        error: (err) => {
          this.toast.error({ detail: "Error message", summary: "Somthing went wrong!", duration: 3000 })
        }
      })
  }
}