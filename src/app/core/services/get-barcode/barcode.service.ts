import { Injectable } from '@angular/core';
import {configApi} from "../../../shared/constants/config-api";
import {ApiService} from "../api/api.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {delay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  constructor(private apiService: ApiService) {
  }

  //Get barcode
  getBarcode(price: number): Observable<any>{
  let url = `barcode?price=${price}`
    return  this.apiService.get(url)
  }

  saveBarcode(data: any): Observable<any>{
    let url = `barcode`
    return  this.apiService.post(url, data)
  }

  //Get all barcode from database
  getAllBarcode(): Observable<any>{
    let url = `barcode/all`
    return  this.apiService.get(url).pipe(delay(500))
  }

  //Delete barcode
  deleteBarcode(id: string): Observable<any>{
    let url = `barcode?_id=${id}`;
    return this.apiService.delete(url)
  }
}
