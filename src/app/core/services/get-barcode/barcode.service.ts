import { Injectable } from '@angular/core';
import {configApi} from "../../../shared/constants/config-api";
import {ApiService} from "../api/api.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {
urlBase = `https://api.mite.pay360.com/acceptor/rest/transactions/${configApi.installationsCashier}/payment`
  constructor(private apiService: ApiService) {
  }

  //Get barcode
  getBarcode(price: number): Observable<any>{
  let url = `barcode?price=${price}`
    return  this.apiService.get(url)
  }
}
