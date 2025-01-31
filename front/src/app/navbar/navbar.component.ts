import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { LoginComponent } from "../login/login.component";

@Component({
  selector: 'app-navbar',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, RouterLink, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @ViewChild("overlay") overlayEl!: ElementRef<HTMLElement>

  loginPopoverActive = false
  toggleLoginPopover() {
    this.loginPopoverActive = !this.loginPopoverActive
  }
}
