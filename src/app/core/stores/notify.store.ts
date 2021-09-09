import { Injectable } from "@angular/core";

import {BehaviorSubject, EMPTY, Observable} from 'rxjs';
import {last, map, pluck, skip, tap} from 'rxjs/operators';
import {NotifyService} from "../services/notify/notify.service";


@Injectable({
  providedIn: "root",
})
export class NotifyStore {
  //All notify
  allNotify = new BehaviorSubject(null);
  allNotify$ = this.allNotify.asObservable();

  //All new notify
  allNewNotify = new BehaviorSubject(null);
  allNewNotify$ = this.allNewNotify.asObservable();


  constructor(private notifyService: NotifyService) {
   // this.getNewNotify();
  }

  //Get notify
  getAllNotify():Observable<any>{
    return this.notifyService
      .getNotify()
      .pipe(
        pluck("data")
      )
  }

  //Get new notify
  getNewNotify() {
    //Set interval to request consequent to database to get new paid
   setInterval(()=>{
     this.notifyService
       .searchNotify('new')
       .pipe(
         pluck("data"),
         tap((value) => {
           /*console.log(`Value interval ${Math.random()}`, value)*/
           //Assign value to store
           this.allNewNotify.next(value);
         })
       )
       .subscribe();
   }, 5000)

  }

  //Update notify
  updateNotify(data: any): Observable<any>{
    if(data.length> 0){
      return this.notifyService.updateNotify(data)
    }
   return EMPTY
  }

}
