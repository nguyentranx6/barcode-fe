import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BarcodeService } from '../../../../core/services/get-barcode/barcode.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-barcode-dialog',
  templateUrl: './barcode-dialog.component.html',
  styleUrls: ['./barcode-dialog.component.css'],
})
export class BarcodeDialogComponent implements OnInit {
  //Show input form
  public isShowInputForm: boolean = false;
  public isShowLoading: boolean = false;
  public isShowGenerateBtn: boolean = false;
  public isShowAddBtn: boolean = true;
  public isShowAlertSuccess: boolean = false;
  public isShowAlertFail: boolean = false;

  //Input form price
  public priceAddBarcodeForm!: FormGroup;

  @ViewChild('price') price!: ElementRef;
  constructor(
    public barcodeDialog: MatDialogRef<BarcodeDialogComponent>,
    private barcodeService: BarcodeService,
    @Inject(MAT_DIALOG_DATA) public barcodeInfo: any,

  ) {
    this.priceAddBarcodeForm = new FormGroup({
      price: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    console.log('this.data', this.barcodeInfo);
  }

  handleCloseButton() {
    this.barcodeDialog.close();
  }

  //Handle add new barcode
  handleAddNewBarcode() {
    this.isShowInputForm = true;
    this.isShowAddBtn = false;
    this.isShowGenerateBtn = true;
    this.priceAddBarcodeForm.setValue({ price: this.barcodeInfo.price });
    this.price.nativeElement.focus();
  }

  //Handle generate new barcode
  handleGenerateNewBarcode() {
    this.isShowInputForm = false;
    this.isShowLoading = true;
    this.isShowGenerateBtn = false;
    this.isShowAddBtn = true;
    let { price } = this.priceAddBarcodeForm.value;
    let barcodeId = this.barcodeInfo._id;
    let data = {price, barcodeId};
    this.barcodeService.generateNewBarcode(data).subscribe(
      (value)=> {
        console.log("value", value)
        this.isShowLoading = false;
        this.isShowAlertSuccess = true
       setTimeout(() => {
         this.isShowAlertSuccess = false;
         this.barcodeDialog.close();
       }, 3000);
      },
      (error)=> {
        console.log("error", error)
        this.isShowLoading = false;
        this.isShowAlertFail = true;
        setTimeout(()=>this.isShowAlertFail =false,3000)
      },
    )
  }
}
