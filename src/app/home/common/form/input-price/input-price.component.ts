import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { configApi } from '../../../../shared/constants/config-api';
import { BarcodeService } from '../../../../core/services/get-barcode/barcode.service';
import { delay, pluck, switchMap, tap } from 'rxjs/operators';
import { titleCase } from '../../../../shared/ultis/ulti';
import {Router} from "@angular/router";

@Component({
  selector: 'app-input-price',
  templateUrl: './input-price.component.html',
  styleUrls: ['./input-price.component.css'],
})
export class InputPriceComponent implements OnInit {
  //Declaring Global variable
  public imgBarcodeUrl!: string; // Link url of Image barcode
  public numberBarcode!: number;
  public barcodeNumber!: any; //New barcode add to database;
  public urlBarcode!: string; // = 'https://s.mite.pay360.com/a/tQ7pv167-8s';
  public price!: number;
  public message!: string; //Message to notify
  public clientName!: string; // Store client name from input
  public invoiceNumber!: string; // Store invoice number from input

  //Declaring Boolean variable to show or hide template
  public isShowOutput: boolean = false; // Show or hidden table result
  public isShowInput: boolean = true; // Show or hidden input
  public isLoading: boolean = false; // Show spinner loading
  public isShowAlertFail: boolean = false; //Show notify false generate
  public isShowAlertSuccess: boolean = false;
  public isShowButtonGenerate: boolean = true; //Show or hide button generate

  public isShowLoadingCheckInvoice: boolean = false; //Show spinner when check invoice
  public isShowExistCheckInvoice: boolean = false; //Show exist notice when check invoice exist
  public isShowErrorCheckInvoice: boolean = false; //Show error when check invoice
  //Check Client ID
  public isShowLoadingCheckClientId: boolean = false;
  public isShowExistCheckClientId: boolean = false;
  public isShowErrorCheckClientId: boolean = false;

  //Show check mark check client ID
  public isShowCheckMarkClientIdFail: boolean = false;
  public isShowCheckMarkClientIdSuccess: boolean = false;

  //Show check mark check Invoice number
  public isShowCheckMarkInvoiceFail: boolean = false;
  public isShowCheckMarkInvoiceSuccess: boolean = false;



  //Form group
  priceInputForm: FormGroup;

  //View child output
  @ViewChild('outputUrl') outputUrl!: ElementRef;
  @ViewChild('saveButton') saveButton!: ElementRef;
  @ViewChild('showButton') showButton!: ElementRef;
  @ViewChild('invoiceNumberInput') invoiceNumberInput!: ElementRef;
  @ViewChild('buttonGenerate') buttonGenerate!: ElementRef;

  constructor(private barcodeService: BarcodeService, private router: Router) {
    this.priceInputForm = new FormGroup({
      price: new FormControl('', [Validators.required]),
      invoiceNumber: new FormControl('', [Validators.required]),
      clientName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      customClientId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.checkInvoiceNumberExist();
    this.checkClientIdExist();
    /*setTimeout(()=>{
      this.isShowOutput = true;
    },2000)*/
  }

  /* Ulti function */

  //Check unique invoiceNumber
  checkInvoiceNumberExist() {
    this.priceInputForm.controls['invoiceNumber'].valueChanges
      .pipe(
        delay(2000),
        tap((val) => {
          this.isShowCheckMarkInvoiceSuccess = false;
          this.isShowCheckMarkInvoiceFail = false;
          this.isShowLoadingCheckInvoice = true;
        }),
        switchMap((value) => {
          return this.barcodeService.checkInvoiceNumber(value);
        })
      )
      .subscribe(
        (value) => {
          this.isShowLoadingCheckInvoice = false;
          if (value.status === 'fail') {
            this.isShowExistCheckInvoice = true;
            this.isShowCheckMarkInvoiceFail = true;
            this.buttonGenerate.nativeElement.disabled = true;
            setTimeout(() => {
              this.isShowExistCheckInvoice = false;
              this.isShowCheckMarkInvoiceFail = false;
            }, 4000);
          } else {
            this.isShowCheckMarkInvoiceSuccess = true;
            setTimeout(() => {
              this.isShowCheckMarkInvoiceSuccess = false;
            }, 4000);
          }

        },
        (error) => {
          console.log('Error when check barcode', error);
          this.isShowLoadingCheckInvoice = false;
          this.isShowErrorCheckInvoice = true;
          setTimeout(() => {
            this.isShowErrorCheckInvoice = false;
          }, 4000);
        }
      );
  }

  //create new barcode link
  handleGenerateLink(evt: any) {
    evt.preventDefault();
    this.isShowButtonGenerate= false; //hidden generate button
    this.isLoading = true; //show spinner
    let { price, invoiceNumber, clientName, email,customClientId } = this.priceInputForm.value;
    this.price = price;
    this.invoiceNumber = invoiceNumber;
    this.clientName = clientName;
    let data = {
      price, invoiceNumber, clientName,customClientId,email
    }

    this.barcodeService.generateBarcode(data).subscribe(
      (val) => {
        //Reset form and turn off loading spinner
        this.priceInputForm.reset();
        this.isLoading = false;
        this.router.navigate([`/payment`], {queryParams: {id: val?.data?._id}})
      },
      (error) => {
        this.isLoading = false;
        console.log("error", error)
        this.isShowAlertFail = true;
        this.isShowButtonGenerate= true; //Show generate button
        //Turn off alert notify fail
        setTimeout(() => (this.isShowAlertFail = false), 3000);
      }
    );
  }

  //Handle copy url to clipboard
  handleCopy(evt: any) {
    let inputElm = this.outputUrl.nativeElement;
    inputElm.select();
    inputElm.setSelectionRange(0, 99999);
    document.execCommand('copy');
    inputElm.setSelectionRange(0, 0);
    inputElm.classList.add('after-copy');
    inputElm.disabled = true;
    evt.srcElement.disabled = true;
    evt.srcElement.textContent = 'Copied!';
  }

  //Handle toggle show or hide link
  handleToggleShowLink(evt: any) {
    let labelText = evt.srcElement.textContent;
    if (labelText === 'Show') {
      evt.srcElement.textContent = 'Hidden';
      this.outputUrl.nativeElement.value = this.urlBarcode;
      console.log("this.urlbarcod", this.urlBarcode)
    } else {
      evt.srcElement.textContent = 'Show';
      this.outputUrl.nativeElement.value = 'Link is hidden';
    }
  }

//Handle close button
  handleCloseButton($event: MouseEvent) {
    this.isShowOutput = false;
    this.isShowInput = true;
    this.isShowButtonGenerate = true;
  }

  //Check client ID exist or not
  checkClientIdExist(){
    this.priceInputForm.controls['customClientId'].valueChanges
      .pipe(
        delay(3000),
        tap((val) => {
          this.isShowCheckMarkClientIdSuccess = false;
          this.isShowCheckMarkClientIdFail = false;
          this.isShowLoadingCheckClientId = true;
        }),
        switchMap((value) => {
          return this.barcodeService.checkClientId(value);
        })
      )
      .subscribe(
        (value) => {
          this.isShowLoadingCheckClientId = false;
          if (value.status === 'fail') {
            //Get data
            let {clientName,email} = value.client;
            clientName = titleCase(clientName);
            //Show alert exist
            this.isShowExistCheckClientId = true;
            this.isShowCheckMarkClientIdFail = true;
            //Set value to form
            this.priceInputForm.controls['clientName'].setValue(clientName);
            this.priceInputForm.controls['email'].setValue(email);

            //Jump cursor to invoi number input
            this.invoiceNumberInput.nativeElement.focus();
            //Turn off alert
            setTimeout(() => {
              this.isShowExistCheckClientId = false;
              this.isShowCheckMarkClientIdFail = false;
            }, 4000);
          } else {
            this.isShowCheckMarkClientIdSuccess = true;
            setTimeout(() => {
              this.isShowCheckMarkClientIdSuccess = false;
            }, 4000);
          }

        },
        (error) => {
          console.log('Error when check barcode', error);
          this.isShowLoadingCheckClientId = false;
          this.isShowErrorCheckClientId = true;
          setTimeout(() => {
            this.isShowErrorCheckClientId = false;
          }, 4000);
        }
      );
  }
}
