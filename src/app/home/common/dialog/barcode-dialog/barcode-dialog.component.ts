import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BarcodeService} from "../../../../core/services/get-barcode/barcode.service";

@Component({
  selector: 'app-barcode-dialog',
  templateUrl: './barcode-dialog.component.html',
  styleUrls: ['./barcode-dialog.component.css']
})
export class BarcodeDialogComponent implements OnInit {

  constructor(public barcodeDialog: MatDialogRef<
                BarcodeDialogComponent
                >,
              private barcodeService:BarcodeService,
              @Inject(MAT_DIALOG_DATA) public barcodeInfo: any,) { }

  ngOnInit(): void {
    console.log("this.data", this.barcodeInfo)
  }

  handleCloseButton(){
    this.barcodeDialog.close();
  }

}
