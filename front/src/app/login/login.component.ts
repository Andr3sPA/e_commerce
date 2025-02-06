import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ElementEvadeDirective } from '../element-evade.directive';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  imports: [MatInputModule, MatButtonModule, FormsModule, ElementEvadeDirective, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @Output() action = new EventEmitter<"login" | "signupRedirect">()
  httpClient = inject(HttpClient)
  router = inject(Router)
  loginInfo = {
    email: "",
    password: ""
  }
  loading = false

  onSubmit() {
    this.loading = true
    this.httpClient.post("http://localhost:8080/login", {
      username: this.loginInfo.email,
      password: this.loginInfo.password
    }).subscribe(res => {
      console.log(res)
      this.loading = false
      this.action.emit("login")
    })
  }

  gotoSignup() {
    this.action.emit("signupRedirect")
    this.router.navigate(["/register"])
  }

  @HostListener("click", ["$event"]) onClick() { }
}
