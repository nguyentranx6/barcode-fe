import { Injectable } from '@angular/core';
import { configApi } from '../../../shared/constants/config-api';
import { ApiService } from '../api/api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BarcodeService {
  constructor(private apiService: ApiService) {}

  //Get barcode
  generateBarcode(data: any): Observable<any> {
    let url = `barcode`;
    return this.apiService.post(url, data);
  }

  checkInvoiceNumber(invoice: string): Observable<any> {
    let url = `barcode/check?invoice=${invoice}`;
    return this.apiService.get(url);
  }

  saveBarcode(data: any): Observable<any> {
    let url = `barcode`;
    return this.apiService.post(url, data);
  }

  //Delete barcode
  deleteBarcode(id: string): Observable<any> {
    let url = `barcode?_id=${id}`;
    return this.apiService.delete(url);
  }

  //Search barcode
  searchBarcode(
    id = '',
    search: string = '',
    filter: string = 'all',
    size = 10,
    page = 0,
    sort: string='transactionTime',
    order ='1'
  ): Observable<any> {
    let url = `barcode/search?id=${id}&key=${search}&filter=${filter}&size=${size}&page=${page}&sort=${sort}&order=${order}`;
    return this.apiService.get(url).pipe(shareReplay());
  }

  //Get info of barcode
  getInfoBarcode(id: string): Observable<any>{
    let url = `barcode?get=${id}`;
    return this.apiService.get(url);
  }

  checkClientId(clientId: string): Observable<any>{
    let url = `barcode/check?clientid=${clientId}`;
    return this.apiService.get(url);
  }

//Add new barcode when expired
  generateNewBarcode(data: any):Observable<any>{
    let url = `barcode`;
    return this.apiService.put(url,data);
  }
}
