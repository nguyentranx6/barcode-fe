import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Observable} from "rxjs";
import {shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api: ApiService) {}

  addNewUser(newUser: any) {
    const url = "users/add-new-user";
    return this.api.post(url, newUser);
  }

  updateUser(dataUpdate:any) {
    const url = "users/update-user";
    return this.api.put(url, dataUpdate);
  }

  loadUserDetail(id: string) {
    const url = `users?id=${id}`;
    return this.api.get(url);
  }

  deleteUser(id: string) {
    const url = `users?id={id}`;
    return this.api.delete(url);
  }
}
