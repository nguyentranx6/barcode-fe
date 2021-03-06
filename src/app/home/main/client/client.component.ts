import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { pluck, startWith, switchMap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { ClientService } from '../../../core/services/client/client.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
})
export class ClientComponent implements OnInit, AfterViewInit {
  //Global boolean show alert or spinner
  public isShowAlertRequestSuccess: boolean = false;
  public isShowAlertRequestFail: boolean = false;
  public isShowLoading: boolean = false;
  public isShowResult: boolean = true;
  public isShowLoadingGetData: boolean = false;
  public isShowErrorSearch: boolean = false; //Show error if search get error

  //Key and category search
  public keySearch!: string;
  public categorySearch!: string;

  //Table material
  public dataSource!: MatTableDataSource<any>;
  //Display tr head
  displayedColumns: string[] = ['customClientId', 'clientName', 'email','quantity','totalBill', 'createdAt'];
  public length: number = 0; //Number of result on table

  //Input search
  public inputSearch = new FormControl();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formSearch: FormGroup;

  constructor(private clientService: ClientService,private router: Router) {
    this.formSearch = new FormGroup({
      keySearch: new FormControl('', [Validators.required]),
      categorySearch: new FormControl('all', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    //On load get data, set timeout to avoid error ngafterviewinit
    setTimeout(() => {
      this.resetPageWhenSort();
      this.handlePagination();
    }, 0);
  }

  //Handle view all barcode of client
  routerContractDetail(row: any) {
    console.log('row', row);
    let id = row?._id;
    if (id) {
      this.router.navigate([`/admin/list`], {queryParams: {key: id,filter:'clientId' }})
    }
  }

  //View all barcode of client
  resetPageWhenSort(){
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  //Handle pagination
  handlePagination() {
    console.log("handlepagination", )
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap((val, valB) => {
          //Loading spinner
          this.isShowLoading = true;
          let sort = this.sort.active;
          let order;
          this.sort.direction ==='asc'? order = "1": order ="-1"
          //Get page and limit
          console.log("this.paginator", this.paginator);
          let limit = this.paginator.pageSize;
          let page = this.paginator.pageIndex+1;


          console.log("sort", sort)
          console.log("order", order)

          //Reset data table
          this.dataSource = new MatTableDataSource<any>([]);
          this.length = 0;

          return this.clientService.searchClient(
            undefined,
            undefined,
            undefined,
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
          console.log('value', value);
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

  //Handle search
  handleSearch() {
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
    this.clientService
      .searchClient(undefined, keySearch, categorySearch)
      .pipe(pluck('data'))
      .subscribe(
        (value) => {
          //Turn off loading
          this.isShowLoading = false;
          console.log('data', value);
          //Set data to material table
          this.dataSource = new MatTableDataSource<any>(value?.data);
          this.length = value?.totalCount[0]?.count;
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

  handleOnChangeCategory(evt: any) {
    console.log('evt', evt);
    console.log('change');
    let { categorySearch, keySearch } = this.formSearch.value;
    if (categorySearch === 'all') {
      this.formSearch.controls['keySearch'].setValue('');
      this.handlePagination();
    }
  }
}
