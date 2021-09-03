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
  /* State */
  isShowOutput: boolean = false;

  urlBarcode: string = 'https://s.mite.pay360.com/a/tQ7pv167-8s';
  price: number = 0;
  isLoading: boolean = false;
  imgBarcodeUrl!: string;
  numberBarcode: number = 0;
  newBarcode: any = null; //New barcode add to database;
  isShowAlertFail: boolean = false; //Show notify false generate
  isShowAlertSuccess: boolean = false;
  isShowAlertSaveFail: boolean = false; //Show notify false save barcode
  isShowAlertSaveSuccess: boolean = false;
  isShowLoadingCheckInvoice: boolean = false; //Show spinner when check invoice
  isShowExistCheckInvoice: boolean = false; //Show exist notice when check invoice exist
  isShowErrorCheckInvoice: boolean = false; //Show error when check invoice
  message!: string; //Message to notify
  clientName!: string; // Store client name from input
  invoiceNumber!: string; // Store invoice number from input

  //Form group
  priceInputForm: FormGroup;

  @ViewChild('outputUrl') outputUrl!: ElementRef; //View child output
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

  //show alert save success
  showSuccessSaveAlert(status: string = 'show') {
    if (status === 'show') {
      this.isShowAlertSaveSuccess = true;
      this.isShowAlertSaveFail = false;
    } else if (status === 'off') {
      this.isShowAlertSaveSuccess = false;
      this.isShowAlertSaveFail = false;
    }
  }

  //Turn off alert save success
  showFailSaveAlert(status: string = 'show') {
    if (status === 'show') {
      console.log('show');
      this.isShowAlertSaveFail = true;
      this.isShowAlertSaveSuccess = false;
      console.log('this.isShowAlertSaveFail', this.isShowAlertSaveFail);
    } else if (status === 'off') {
      console.log('off');
      this.isShowAlertSaveFail = false;
      this.isShowAlertSaveSuccess = false;
      console.log('this.isShowAlertSaveFail', this.isShowAlertSaveFail);
    }
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
        this.isShowAlertSuccess = true;
        this.isShowOutput = true;
        this.newBarcode = this.createNewBarcode(val.data);
        this.imgBarcodeUrl = val.img.url;
        this.numberBarcode = val.img.barcode;
        this.urlBarcode = val.data.processing.payCashResponse.barcodeUrl;
      } else {
        this.isShowAlertFail = true;
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
    this.isShowOutput = false;
    this.isLoading = true;
    if (this.newBarcode) {
      this.barcodeService.saveBarcode(this.newBarcode).subscribe(
        (value) => {
          this.isLoading = false;

          let status = value.status;
          if (status === 'success') {
            this.showSuccessSaveAlert();
            setTimeout(() => {
              this.showSuccessSaveAlert('off');
            }, 5000);
          }
        },
        (error) => {
          this.isLoading = false;
          this.showFailSaveAlert();
          console.log('error');
          setTimeout(() => {
            this.showFailSaveAlert('off');
          }, 5000);
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
