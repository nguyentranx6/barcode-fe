import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, EMPTY, Subscription } from 'rxjs';
import { pluck, startWith, switchMap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { NotifyService } from '../../../core/services/notify/notify.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit, AfterViewInit, OnDestroy {
  //Global boolean show alert or spinner
  public isShowAlertRequestFail: boolean = false;
  public isShowLoading: boolean = false;

  //Store id of notify when click it, then pass to alert modal
  public idNotifySubject = new BehaviorSubject(null);
  public idNotify$ = this.idNotifySubject.asObservable();

  //Store notify get from sever
  public allNotifySubject = new BehaviorSubject(null);
  public allNotify$ = this.allNotifySubject.asObservable();

  //Dom to modal
  @ViewChild('alertModal') alertModal!: ElementRef;

  //Unsubscrible
  private subscription1$!: Subscription;

  //Length of notify
  public length!: number;

  //Paginator
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private notifyService: NotifyService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    //this.handleUpdateAfterReadNotify();
    setTimeout(() => {

      this.checkQueryParam();
    }, 0);
  }

  ngOnDestroy() {
    console.log('ngon destroy');
    //this.subscription1$.unsubscribe();
  }

  //Onclick
  handleClick(barcodeId: string) {
    console.log("barcodeID",  barcodeId)
    this.router.navigate([`/admin/list`], {queryParams: {key: barcodeId, filter:'barcodeId'}})
  }

  //Handle paginator
  handlePagination(type: string ='all') {
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          //Loading spinner
          this.isShowLoading = true;

          let limit = this.paginator.pageSize;
          let page = this.paginator.pageIndex;
          //Reset data table
          this.length = 0;
          this.allNotifySubject.next(null);
          return this.notifyService.searchNotify(type, limit, page);
        })
      )
      .pipe(pluck('data'))
      .subscribe(
        (value) => {
          console.log("Value", value)
          //Turn off loading
          this.isShowLoading = false;
          //Assign data to table

          this.length = value?.totalCount[0]?.count;
          this.allNotifySubject.next(value?.data);
        },
        (error) => {
          console.log('error', error);
          //Turn off loading
          this.isShowLoading = false;
          //Show error message
          this.isShowAlertRequestFail = true;
          //set timeout to hidden message
          setTimeout(() => {
            this.isShowAlertRequestFail = false;
          }, 3000);
        }
      );
  }

  //On load check param
  checkQueryParam() {
    this.activatedRoute.queryParams.subscribe({
      next: (value) => {
        let type: string;
        type = value.type;
        if (!type || type === 'all') {
          this.handlePagination('all');
        } else if (type ==='new') {
          this.handlePagination('new');
        }
      },
    });
  }
}
