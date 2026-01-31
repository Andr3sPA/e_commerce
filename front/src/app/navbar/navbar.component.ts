import { Component, ElementRef, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { LoginComponent } from "../login/login.component";
import { MatDividerModule } from '@angular/material/divider';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService)
  @ViewChild("overlay") overlayEl!: ElementRef<HTMLElement>
  loginPopoverActive = false
  themeMode = "light"
  platformId = inject(PLATFORM_ID)

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const mode = localStorage.getItem("theme_mode")
      if (mode) {
        this.themeMode = mode
      }
      document.body.style.colorScheme = this.themeMode
    }
  }

  changeMode() {
    if (this.themeMode === "light") {
      this.themeMode = "dark"
    } else {
      this.themeMode = "light"
    }
    document.body.style.colorScheme = this.themeMode
    localStorage.setItem("theme_mode", this.themeMode)
  }

  toggleLoginPopover() {
    this.loginPopoverActive = !this.loginPopoverActive
  }

  getPublished() {
    this.httpClient.get("http://localhost:8080/userinfo/published").subscribe(
      {
        error: console.error,
        next: console.log
      }
    )
  }
}
