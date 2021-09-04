import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {ApiService} from "../api/api.service";
import {map, shareReplay, tap} from "rxjs/operators";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserSubject = new BehaviorSubject(null);
  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$!: Observable<boolean>;
  isLoggedOut$!: Observable<boolean>;

  constructor(private api: ApiService,private router: Router) {
    this.initCurrentUser();
    this.isLoggedIn$ = this.currentUser$.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((user) => !user));
    console.log("auth api",)
  }

  getAuthorizationToken() {
    const user = JSON.parse(<string>localStorage.getItem("user"));
    return user?.token;
  }

  register(value: any): Observable<any> {
    const url = "user";
    return this.api.post(url, value);
  }

  login(value: any): Observable<any> {
    const url = "user/login";
    return this.api.post(url, value).pipe(
      tap((user: any) => {
        if(user){
          this.currentUserSubject.next(user);
          localStorage.setItem("user", JSON.stringify(user));
        }
      }),
      shareReplay()
    );
  }

  logout() {
    console.log("api logout", )
    this.currentUserSubject.next(null);
    localStorage.removeItem("user");
    this.router.navigate(['/login'])
  }

  initCurrentUser(): any {
    const user = localStorage.getItem("user");
    if (user) {
      let currentUser = JSON.parse(user);
      this.currentUserSubject.next(currentUser);
      return currentUser?.user;
    }
  }

}

