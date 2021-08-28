import { Component, OnInit } from '@angular/core';
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
  urlBarcode: string = '';
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
  constructor(private barcodeService: BarcodeService) {
    this.priceInputForm = new FormGroup({
      price: new FormControl("")
    })
  }

  ngOnInit(): void {
    this.getDataFromLocalStore();
  }

  getDataFromLocalStore(){
    let data = localStorage.getItem('listUrl')
    if(data){
      this.listUrlData = JSON.parse(data)
    }
  }

  saveDataToLocalStorage(data: any){
    localStorage.setItem('listUrl', JSON.stringify(data))

  }

  handleGenerateLink (){
        this.isLoading = true;
        let {price} = this.priceInputForm.value;
        this.price = price;

        this.barcodeService.getBarcode(price).subscribe(val =>{

          this.urlBarcode = val.data.processing.payCashResponse.barcodeUrl;
          this.priceInputForm.reset();
          this.isLoading = false;
            this.isShowOutput = true;
            this.imgBarcodeUrl = val.img.url;
            this.numberBarcode = val.img.barcode;
  }
        )}

  handleSaveBarcode(){
    let item = {
      price: this.price,
      url: this.urlBarcode,
      dateCreated: new Date(),
      id: uuidv4()
    }
    this.listUrlData.push(item);
    this.saveDataToLocalStorage(this.listUrlData);
    this.isShowOutput = false;
  }

  deleteItemUrl(id: any) {

    // @ts-ignore
    let index = this.listUrlData.findIndex(item => item.id === id);
    this.listUrlData.splice(index, 1);
    this.saveDataToLocalStorage(this.listUrlData)
  }
}
