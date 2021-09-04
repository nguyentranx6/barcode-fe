import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { configApi } from '../../../../shared/constants/config-api';
import { BarcodeService } from '../../../../core/services/get-barcode/barcode.service';
import { delay, pluck, tap } from 'rxjs/operators';
import { uuidv4 } from '../../../../shared/ultis/ulti';

@Component({
  selector: 'app-input-price',
  templateUrl: './input-price.component.html',
  styleUrls: ['./input-price.component.css'],
})
export class InputPriceComponent implements OnInit {
  //Declaring Global variable
  public imgBarcodeUrl!: string; // Link url of Image barcode
  public numberBarcode!: number;
  public newBarcode!: any; //New barcode add to database;
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
  public isShowAlertSaveFail: boolean = false; //Show notify false save barcode
  public isShowAlertSaveSuccess: boolean = false;
  public isShowLoadingCheckInvoice: boolean = false; //Show spinner when check invoice
  public isShowExistCheckInvoice: boolean = false; //Show exist notice when check invoice exist
  public isShowErrorCheckInvoice: boolean = false; //Show error when check invoice


  //Form group
  priceInputForm: FormGroup;

  //View child output
  @ViewChild('outputUrl') outputUrl!: ElementRef;
  @ViewChild('saveButton') saveButton!: ElementRef;
  @ViewChild('showButton') showButton!: ElementRef;

  constructor(private barcodeService: BarcodeService) {
    this.priceInputForm = new FormGroup({
      price: new FormControl('', [Validators.required]),
      invoiceNumber: new FormControl('', [Validators.required]),
      clientName: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // this.checkInvoiceNumberExist();
  }

  /* Ulti function */

  //Check unique invoiceNumber
  checkInvoiceNumberExist() {
    this.priceInputForm.controls['invoiceNumber'].valueChanges
      .pipe(
        delay(3000),
        tap((val) => {
          this.isShowLoadingCheckInvoice = true;
        })
      )
      .subscribe(
        (value) => {
          setTimeout(() => {
            this.isShowLoadingCheckInvoice = false;
            if (value.status === 'fail') {
              this.isShowExistCheckInvoice = true;
            }
          }, 2000);
        },
        (error) => {
          setTimeout(() => {
            this.isShowLoadingCheckInvoice = false;
            this.isShowErrorCheckInvoice = true;
          }, 2000);
        }
      );
  }

  //create new barcode link
  handleGenerateLink() {
    this.isLoading = true;
    let { price, invoiceNumber, clientName } = this.priceInputForm.value;
    this.price = price;
    this.invoiceNumber = invoiceNumber;
    this.clientName = clientName;

    this.barcodeService.getBarcode(price).subscribe((val) => {
      let status = val.data.transaction.status;
      this.priceInputForm.reset();
      this.isLoading = false;

      //Check if generate success, show result
      if (status === 'SUCCESS') {
        //Show or hidden element
        this.isShowAlertSuccess = true;
        this.isShowOutput = true;
        this.isShowInput = false;
        //assign data to variable
        this.newBarcode = this.createNewBarcode(val.data);
        this.imgBarcodeUrl = val.img.url;
        this.numberBarcode = val.img.barcode;
        this.urlBarcode = val.data.processing.payCashResponse.barcodeUrl;
        //Turn off alert notify success
        setTimeout(()=>{
          this.isShowAlertSuccess = false;
          console.log("timeout", )
        },3000)
      } else {
        this.isShowAlertFail = true;
        //Turn off alert notify fail
        setTimeout(()=>this.isShowAlertFail = false,3000)
      }
    });
  }

  //create new barcode form response
  createNewBarcode(res: any) {
    let clientName = this.clientName;
    let invoiceNumber = this.invoiceNumber;
    let url = res.processing.payCashResponse.barcodeUrl;
    let price = res.transaction.amount;
    let transactionTime = res.transaction.transactionTime;
    let transactionId = res.transaction.transactionId;
    return {
      clientName,
      invoiceNumber,
      url,
      price,
      transactionTime,
      transactionId,
    };
  }

  //save barcode after generate
  handleSaveBarcode() {

    this.isLoading = true;
    if (this.newBarcode) {
      this.barcodeService.saveBarcode(this.newBarcode).subscribe(
        (value) => {
          this.isLoading = false;
          let status = value.status;
          if (status === 'success') {
            this.isShowOutput = false;
            this.isShowAlertSaveSuccess = true;
            this.isShowAlertSaveFail = false;
            setTimeout(()=>{
              this.isShowInput = true;
              this.isShowAlertSaveSuccess = false;
            },3000)
          }
        },
        (error) => {
          this.isLoading = false;
          this.isShowAlertSaveSuccess = false;
          this.isShowAlertSaveFail = true;
          setTimeout(()=>{
            this.isShowInput = true;
            this.isShowAlertSaveFail = false;
          },3000)
        }
      );
    }
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
    } else {
      evt.srcElement.textContent = 'Show';
      this.outputUrl.nativeElement.value = 'Link is hidden';
    }
  }
}
