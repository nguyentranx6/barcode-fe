import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { uuidv4 } from '../../../shared/ultis/ulti';
import { BarcodeService } from '../../../core/services/get-barcode/barcode.service';
import { pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-url',
  templateUrl: './list-url.component.html',
  styleUrls: ['./list-url.component.css'],
})
export class ListUrlComponent implements OnInit {
  public isShowAlertSuccess: boolean = false;
  public isShowAlertFail: boolean = false;
  public isShowLoading: boolean = false;

  //Form control search
  formSearch: FormGroup;

  constructor(private barcodeService: BarcodeService) {
    this.formSearch = new FormGroup({
      keySearch: new FormControl('', [Validators.required]),
    });
  }

  barcodes$: Observable<any> | undefined;

  ngOnInit(): void {
    //On load get data
    this.getAllBarcode();
  }

  //Get all barcode from database
  getAllBarcode() {
    this.barcodes$ = this.barcodeService.getAllBarcode().pipe(pluck('data'));
  }

  //Delete barcode

  deleteItemUrl(id: any) {
    //this.isShowLoading = true;
    this.barcodeService.deleteBarcode(id).subscribe((value) => {
      let status = value.status;
      this.isShowLoading = false;
      console.log('va', value);
      if (status === 'success') {
        this.isShowAlertSuccess = true;
        this.getAllBarcode();
      } else if (status === 'fail') {
        this.isShowAlertFail = true;
      }
    });
  }
  //Handle search
  handleSearch() {}
}
