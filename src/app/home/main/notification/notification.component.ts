import {
  AfterViewInit,
  Component,
  ElementRef, Inject, OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable, Subscription} from 'rxjs';
import { NotifyStore } from '../../../core/stores/notify.store';
import { DOCUMENT } from '@angular/common';
import {skip, switchMap, take} from "rxjs/operators";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit, AfterViewInit, OnDestroy {
  public idNotifySubject = new BehaviorSubject(null); //Store id of notify when click it, then pass to alert modal
  public idNotify$ = this.idNotifySubject.asObservable();

  //Store notify get from sever
  public allNotify$!: Observable<any>; // All notify

  //Dom to modal
  @ViewChild('alertModal') alertModal!: ElementRef;

  //Unsubscrible
  subscription1$!: Subscription;
  constructor(private notifyStore: NotifyStore) {}

  ngOnInit(): void {
    this.allNotify$ = this.notifyStore.getAllNotify();
    this.allNotify$.subscribe(val =>{
      console.log("val", val)
    })
  }

  ngAfterViewInit() {
    this.handleUpdateAfterReadNotify();
  }

  ngOnDestroy() {
    console.log("ngon destroy",)
    this.subscription1$.unsubscribe();
  }

  //Onclick
  handleClick(evt: any) {
    let id = evt.srcElement.getAttribute('data-notify-id');
    this.idNotifySubject.next(id);
  }

  //Handle update notify had loaded to read
  handleUpdateAfterReadNotify() {
    this.subscription1$ = this.notifyStore.allNewNotify$
      .pipe(
        switchMap((value) => {
          if (value) {
            console.log(`Value from store ${Math.random()}`, value);
            return this.notifyStore.updateNotify(value);
          }
          return EMPTY;
        })
      )
      .subscribe((value) => {
        console.log('value after update', value);
      });
  }
}
