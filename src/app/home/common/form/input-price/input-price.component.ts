import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {configApi} from "../../../../shared/constants/config-api";
import {BarcodeService} from "../../../../core/services/get-barcode/barcode.service";
import {pluck} from "rxjs/operators";
import {uuidv4} from "../../../../shared/ultis/ulti";


@Component({
  selector: 'app-input-price',
  templateUrl: './input-price.component.html',
  styleUrls: ['./input-price.component.css']
})
export class InputPriceComponent implements OnInit {
  isShowOutput: boolean = false;
  priceInputForm: FormGroup;
  urlBarcode: string = 'https://s.mite.pay360.com/a/tQ7pv167-8s';
  price: number = 0;
  isCopied: boolean = false;
  listUrlData = [{
    price: 10,
    url: 'test',
    dateCreated: new Date(),
    id: uuidv4()
  }]
  isLoading: boolean = false;
  imgBarcodeUrl: string = '';
  numberBarcode: number = 0;
  //New barcode add to database;
  newBarcode: any = null;
  //Show notify false generate
  isShowAlertFail: boolean = false;
  isShowAlertSuccess: boolean = false;
  //Show notify false save barcode
  isShowAlertSaveFail: boolean = false;
  isShowAlertSaveSuccess: boolean = false;
  //Message to notify
  message!: string;

  //View child output
  @ViewChild('outputUrl') outputUrl!:ElementRef;
  @ViewChild('saveButton') saveButton!:ElementRef

  constructor(private barcodeService: BarcodeService) {
    this.priceInputForm = new FormGroup({
      price: new FormControl("")
    })
  }

  ngOnInit(): void {
    this.getDataFromLocalStore();
  }

  /* Ulti function */
  //show alert save success
  showSuccessSaveAlert(status: string = 'show'){
    if(status ==='show'){
      this.isShowAlertSaveSuccess = true;
      this.isShowAlertSaveFail = false;
    } else if(status ==='off'){
      this.isShowAlertSaveSuccess = false;
      this.isShowAlertSaveFail = false;
    }

  }

  //Turn off alert save success
  showFailSaveAlert(status: string = 'show'){
    if(status ==='show'){
      console.log("show", )
      this.isShowAlertSaveFail = true;
      this.isShowAlertSaveSuccess = false;
      console.log("this.isShowAlertSaveFail", this.isShowAlertSaveFail)
    } else if(status ==='off'){
      console.log("off",)
      this.isShowAlertSaveFail = false;
      this.isShowAlertSaveSuccess = false;
      console.log("this.isShowAlertSaveFail", this.isShowAlertSaveFail)
    }

  }

  getDataFromLocalStore() {
    let data = localStorage.getItem('listUrl')
    if (data) {
      this.listUrlData = JSON.parse(data)
    }
  }

  saveDataToLocalStorage(data: any) {
    localStorage.setItem('listUrl', JSON.stringify(data))

  }
//create new barcode link
  handleGenerateLink() {
    this.isLoading = true;
    let {price} = this.priceInputForm.value;
    this.price = price;
    this.barcodeService.getBarcode(price).subscribe(val => {
      let status = val.data.transaction.status;
        this.priceInputForm.reset();
        this.isLoading = false;

        //Check if generate success, show result
      if(status === "SUCCESS") {
        this.isShowAlertSuccess = true;
        this.isShowOutput = true;
        this.newBarcode = this.createNewBarcode(val.data)
        this.imgBarcodeUrl = val.img.url;
        this.numberBarcode = val.img.barcode;
        this.urlBarcode = val.data.processing.payCashResponse.barcodeUrl;
      } else {
        this.isShowAlertFail = true;
      }
      }
    )
  }

  //create new barcode form response
  createNewBarcode(res: any) {
    let name = '';
    let email = '';
    let url = res.processing.payCashResponse.barcodeUrl;
    let price = res.transaction.amount;
    let transactionTime = res.transaction.transactionTime;
    let transactionId = res.transaction.transactionId;
    return {name, email, url, price, transactionTime, transactionId}


  }

  //save barcode after generate
  handleSaveBarcode() {
    this.isShowOutput = false;
    this.isLoading = true;
    if(this.newBarcode){
      this.barcodeService.saveBarcode(this.newBarcode).subscribe(
        value => {
        this.isLoading = false;

        let status = value.status;
        if(status ==="success"){
          this.showSuccessSaveAlert()
          setTimeout(()=>{
            this.showSuccessSaveAlert('off')
          },5000)
        }
      },
        (error) => {
          this.isLoading = false;
          this.showFailSaveAlert();
          console.log("error",)
          setTimeout(()=>{
            this.showFailSaveAlert('off')
          },5000)
        }
        )
        }
    }

//Handle copy url to clipboard
  handleCopy(evt:any) {
    let inputElm = this.outputUrl.nativeElement;
    inputElm.select();
    inputElm.setSelectionRange(0, 99999);
    document.execCommand('copy');
    inputElm.setSelectionRange(0, 0);
    inputElm.classList.add('after-copy')
    inputElm.disabled = true;
    evt.srcElement.disabled = true;
    evt.srcElement.textContent = 'Copied!';


  }
}
