import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ApiService} from "../api/api.service";
import {shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private apiService: ApiService) { }

  searchClient(
    id = '',
    search: string = '',
    filter: string = 'all',
    size = 10,
    page = 0,
    sort: string='createdAt',
    order ='1'
  ): Observable<any> {
    let url = `client/search?id=${id}&key=${search}&filter=${filter}&size=${size}&page=${page}&sort=${sort}&order=${order}`;
    console.log("size", size);
    console.log("page", page);
    return this.apiService.get(url).pipe(shareReplay());
  }
}
