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
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { merge, Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { BarcodeDialogComponent } from '../../common/dialog/barcode-dialog/barcode-dialog.component';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-list-url',
  templateUrl: './list-url.component.html',
  styleUrls: ['./list-url.component.css'],
})
export class ListUrlComponent implements OnInit, AfterViewInit {
  //Global boolean show alert or spinner
  public isShowAlertRequestSuccess: boolean = false;
  public isShowAlertRequestFail: boolean = false;
  public isShowLoading: boolean = false;
  public isShowResult: boolean = true;
  public isShowLoadingGetData: boolean = false;
  public isShowErrorSearch: boolean = false; //Show error if search get error
  public isShowResultTitleSearch: boolean = false; //Show result title search

  //Key and category search
  public keySearch!: string;
  public categorySearch!: string;

  //Table material
  public dataSource!: MatTableDataSource<any>;
  //Display tr head
  displayedColumns: string[] = [
    'clientName',
    'invoiceNumber',
    'price',
    'barcodeNumber',
    /* 'url',*/
    'transactionTime',
    'status',
  ];
  public length: number = 0; //Number of result on table

  //Input search
  public inputSearch = new FormControl();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Form control search
  formSearch: FormGroup;
  barcodes$: Observable<any> | undefined; //Observable data list link barcode

  constructor(
    private barcodeService: BarcodeService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.formSearch = new FormGroup({
      keySearch: new FormControl('', [Validators.required]),
      categorySearch: new FormControl('all', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  //Ng after view init
  ngAfterViewInit() {
    //On load get data, set timeout to avoid error ngafterviewinit
    setTimeout(() => {
      this.resetPageWhenSort();
      this.checkQueryParam();
    }, 0);
  }

  //Get all barcode from database
  getAllBarcode() {
    this.barcodes$ = this.barcodeService.searchBarcode().pipe(pluck('data'));
    this.barcodes$.subscribe(
      (value) => {
        console.log('value', value);
        this.dataSource = new MatTableDataSource<any>(value?.data);
        this.length = value?.totalCount[0]?.count;
      },
      (error) => {
        console.log('error', error);
      }
    );
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
    //Turn off title result search
    this.isShowResultTitleSearch = false;
    //Turn loading spinner
    this.isShowLoading = true;
    //Get value from form
    let { keySearch, categorySearch } = this.formSearch.value;
    //Assign value to show if not found
    this.keySearch = keySearch;
    this.categorySearch = categorySearch;
    //Reset form
    this.formSearch.controls['keySearch'].setValue('');
    //Reset data to material table
    this.dataSource = new MatTableDataSource<any>([]);
    this.length = 0;
    //Call api
    this.barcodeService
      .searchBarcode(undefined, keySearch, categorySearch)
      .pipe(pluck('data'))
      .subscribe(
        (value) => {
          //Turn off loading
          this.isShowLoading = false;
          console.log('data', value);
          //Set data to material table
          this.dataSource = new MatTableDataSource<any>(value.data);
          this.length = value.totalCount[0].count;
          //Show title of result search
          this.isShowResultTitleSearch = true;
        },
        () => {
          //Turn off loading and turn on error
          this.isShowLoading = false;
          this.isShowErrorSearch = true;
          setTimeout(() => {
            //hidden error message
            this.isShowErrorSearch = false;
          });
        }
      );
  }

  // when change option of select category search
  handleOnChangeCategory(evt: any) {
    //Turn off title result search
    this.isShowResultTitleSearch = false;
    let { categorySearch, keySearch } = this.formSearch.value;
    if (categorySearch === 'all') {
      this.formSearch.controls['keySearch'].setValue('');
      this.getAllBarcode();
    }
  }


//Show info when click on row of table
  handleShowBarcodeDetail(data: any) {
    const editContractDialog = this.dialog.open(BarcodeDialogComponent, {
      width: 'auto',
      height: 'auto',
      data: data,
    });
    editContractDialog.afterClosed().subscribe((value) => {});
  }

//Reset page index to 1 when sort
  resetPageWhenSort(){
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }


//Handle when user click pagination
  handlePagination(id: string ='',key: string = '', filter: string = 'all') {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap((val, valB) => {
          //Loading spinner
          this.isShowLoading = true;

          //Get sort and order from table
          let sort = this.sort.active;
          let order;
          this.sort.direction ==='asc'? order = "1": order ="-1"
          //Get page and limit
          console.log("this.paginator", this.paginator);
          let limit = this.paginator.pageSize;
          let page = this.paginator.pageIndex+1;
          //Reset data table
          this.dataSource = new MatTableDataSource<any>([]);
          this.length = 0;

          return this.barcodeService.searchBarcode(
            id,
            key,
            filter,
            limit,
            page,
            sort,
            order
          );
        })
      )
      .pipe(pluck('data'))
      .subscribe(
        (value) => {
          //Turn off loading
          this.isShowLoading = false;
          //Assign data to table
          this.dataSource = new MatTableDataSource<any>(value?.data);
          this.length = value?.totalCount[0]?.count;
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
        let {id, key, filter } = value;
        if (key && filter) {
          this.handlePagination(undefined,key, filter);
        } else if(id) {
          this.handlePagination(id);
        } else {
          this.handlePagination()
        }
      },
    });
  }
}
