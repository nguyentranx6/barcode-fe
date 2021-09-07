import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { BarcodeService } from '../../../../core/services/get-barcode/barcode.service';
import {pluck, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css'],
})
export class AlertModalComponent implements OnInit, AfterViewInit {
  //Observable to receive data from parent component
  @Input() idNotify$!: Observable<any>;

  //Info of notify
  public notifyInfo$!: Observable<any>;
  constructor(private barcodeService: BarcodeService) {}

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    this.notifyInfo$ = this.idNotify$.pipe(
      switchMap((id) => {
        if (id) {
          return this.barcodeService.searchBarcode(id).pipe(pluck('data'),
          );
        } else {
          return EMPTY;
        }
      })
    );
  }
}
