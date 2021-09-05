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
    get = '',
    search: string = '',
    filter: string = 'all',
    size = 10,
    page = 1,
    order = 0
  ): Observable<any> {
    let url = `barcode/search?key=${search}&get=${get}&filter=${filter}&size=${size}&page=${page}&order=${order}`;
    return this.apiService.get(url).pipe(shareReplay());
  }

  //Get info of barcode
  getInfoBarcode(id: string): Observable<any>{
    let url = `barcode?get=${id}`;
    return this.apiService.get(url);
  }


}
