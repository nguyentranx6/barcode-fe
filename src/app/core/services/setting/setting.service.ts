import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private apiService: ApiService) { }

  //Add setting service
  addSetting(data: any): Observable<any>{
    let url = `setting`;
    return  this.apiService.post(url, data)
  }

  /*Update settting service, data {type: "type of setting like mail server
  data: data want to update }*/
  updateSetting(data: any): Observable<any>{
    let url = `setting`;
    return  this.apiService.put(url, data);
  }

  //Get all setting from database
  getSetting(): Observable<any>{
    let url = `setting`;
    return  this.apiService.get(url);
  }
}
