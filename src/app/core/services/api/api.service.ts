import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 private BASE_URL = "http://165.227.236.153:3300/api";
// private BASE_URL = "http://localhost:3300/api";

  constructor(private http: HttpClient) {
  }
  get<T>(path: string, option = {}): Observable<T> {
    return this.http.get<T>(`${this.BASE_URL}/${path}`, option);
  }

  post<T>(path: string, body = {}, option = {}): Observable<T> {
    return this.http.post<T>(`${this.BASE_URL}/${path}`, body, option);
  }

  put<T>(path: string, body = {}, option = {}): Observable<T> {
    return this.http.put<T>(`${this.BASE_URL}/${path}`, body, option);
  }

  delete<T>(path: string, option = {}): Observable<T>{
    return this.http.delete<T>(`${this.BASE_URL}/${path}`, option)
  }



}
