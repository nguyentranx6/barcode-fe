import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { uuidv4 } from '../../../shared/ultis/ulti';
import { BarcodeService } from '../../../core/services/get-barcode/barcode.service';
import {
  debounceTime,
  distinctUntilChanged,
  pluck,
  startWith,
  switchMap, take, tap,
} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-url',
  templateUrl: './list-url.component.html',
  styleUrls: ['./list-url.component.css'],
})
export class ListUrlComponent implements OnInit {

  //Global boolean show alert or spinner
  public isShowAlertRequestSuccess: boolean = false;
  public isShowAlertRequestFail: boolean = false;
  public isShowLoading: boolean = false;
  public isShowResult: boolean = true;

  //Key and category search
  public keySearch! : string;
  public categorySearch! : string;

  //Form control search
  formSearch: FormGroup;
  barcodes$: Observable<any> | undefined; //Observable data list link barcode

  constructor(private barcodeService: BarcodeService) {
    this.formSearch = new FormGroup({
      keySearch: new FormControl('', [Validators.required]),
      categorySearch: new FormControl('all', [Validators.required]),
    });
  }

  ngOnInit(): void {
    //On load get data
    this.getAllBarcode();
  }

  //Get all barcode from database
  getAllBarcode() {
    this.barcodes$ = this.barcodeService.searchBarcode().pipe(pluck('data'));
  }

  //Delete barcode
  deleteItemUrl(id: any) {
    //this.isShowLoading = true;
    this.barcodeService.deleteBarcode(id).subscribe((value) => {
      let status = value.status;
      this.isShowLoading = false;
      console.log('va', value);
      if (status === 'success') {
        this.isShowAlertRequestSuccess = true;
        this.getAllBarcode();
      } else if (status === 'fail') {
        this.isShowAlertRequestFail = true;
      }
    });
  }

  //Handle search
  handleSearch() {
     //Turn loading spinner
    let { keySearch, categorySearch } = this.formSearch.value;
    this.keySearch = keySearch;
    this.categorySearch = categorySearch;
    this.formSearch.controls['keySearch'].setValue('')
    this.barcodes$ = this.barcodeService.searchBarcode(keySearch,categorySearch).pipe(pluck('data'))

  }

  handleOnChangeCategory(evt: any) {
    console.log("evt", evt)
    console.log("change",)
    let {categorySearch,keySearch } = this.formSearch.value;
    if(categorySearch ==='all'){
      this.formSearch.controls['keySearch'].setValue('');
      this.getAllBarcode();
    }

  }
}
