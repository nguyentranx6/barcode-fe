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
    get = '',
    search: string = '',
    filter: string = 'all',
    size = 10,
    page = 1,
    order = 0
  ): Observable<any> {
    let url = `client/search?key=${search}&get=${get}&filter=${filter}&size=${size}&page=${page}&order=${order}`;
    return this.apiService.get(url).pipe(shareReplay());
  }
}
