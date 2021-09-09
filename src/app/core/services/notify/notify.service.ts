import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ApiService} from "../api/api.service";
import {shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private apiService: ApiService) { }

  //Get new barcode paid
  getNotify(type: string = 'all'):Observable<any>{
    let url = `notify?type=${type}`;
    return this.apiService.get(url);
  }

  //Update status notify when user loaded
  updateNotify(data: any):Observable<any>{
    let url = `notify`;
    return this.apiService.put(url, data);
  }

  //Notify paginator
  searchNotify(
    filter: string = 'all',
    size = 10,
    page = 0,
    order = 0,
    action: string ='view'
  ): Observable<any> {
    let url = `notify/search?filter=${filter}&size=${size}&page=${page}&order=${order}&action=${action}`;
    return this.apiService.get(url).pipe(shareReplay());
  }
}
