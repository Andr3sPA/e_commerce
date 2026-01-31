import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: { username: string } | null = null
  private status: "unauthenticated" | "loading" | "authenticated" = "unauthenticated"

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(loginInfo: LoginRequest): Observable<Object>;
  login(email: string, password: string): Observable<Object>;
  login(emailOrLoginInfo: string | LoginRequest, password?: string) {
    let body: { username: string, password: string };
    if (typeof emailOrLoginInfo === "string" && password) {
      body = { username: emailOrLoginInfo, password: password }
    } else if (typeof emailOrLoginInfo === "object") {
      body = {
        username: emailOrLoginInfo.email, password: emailOrLoginInfo.password
      }
    } else {
      throw new Error("invalid parameters")
    }
    this.status = "loading"
    const req = this.httpClient.post("http://localhost:8080/login", body)

    req.subscribe(res => {
      this.status = "authenticated"
      this.user = {
        username: body.username,
      }
    })

    return req
  }

  logout() {
    this.httpClient.get("http://localhost:8080/logout").subscribe(
      {
        complete: () => {
          this.user = null
          this.status = "unauthenticated"
          this.router.navigate(["/"])
        }
      }
    )
  }

  getUser() {
    return this.user
  }

  getStatus() {
    return this.status
  }
}

export interface LoginRequest {
  email: string,
  password: string
}
