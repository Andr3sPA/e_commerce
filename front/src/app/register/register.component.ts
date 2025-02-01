import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ElementEvadeDirective } from '../element-evade.directive';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, ElementEvadeDirective, MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  httpClient = inject(HttpClient)
  router = inject(Router)
  fb = inject(FormBuilder)
  registerForm!: FormGroup
  loading = false

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
      passwordConfirm: ["", Validators.required, this.matchPassword]
    })
  }

  matchPassword(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.parent) {
      console.log("noo parent")
      return of()
    }
    const match = control.parent.value.password === control.value
    return of(match ? null : { match: control.value })
  }

  onSubmit() {
    if (this.registerForm.status !== "VALID") return

    this.loading = true
    this.httpClient.post("http://localhost:8080/", {
      username: this.registerForm.value.email,
      password: this.registerForm.value.password
    }).subscribe(res => {
      console.log(res)
      this.loading = false
      this.router.navigate(["/"])
    })
    //TODO: pipe errors
  }
}
