import { Component, EventEmitter, HostListener, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ElementEvadeDirective } from '../core/directives/element-evade.directive';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, FormsModule, ElementEvadeDirective, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() action = new EventEmitter<"login" | "signupRedirect">()
  authService = inject(AuthService)
  router = inject(Router)
  loginInfo = {
    email: "",
    password: ""
  }
  loading = false

  onSubmit() {
    this.loading = true
    this.authService.login(this.loginInfo).subscribe(() => {
      this.loading = false
      this.action.emit("login")
    })
  }

  gotoSignup() {
    this.action.emit("signupRedirect")
    this.router.navigate(["/register"])
  }

  @HostListener("click", ["$event"]) onClick(event: Event) { }
}
