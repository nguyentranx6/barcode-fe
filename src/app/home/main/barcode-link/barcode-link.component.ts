import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faPrint, faDownload } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { ActivatedRoute } from '@angular/router';
import { BarcodeService } from '../../../core/services/get-barcode/barcode.service';
import {catchError, map, pluck, retry, switchMap, take, tap} from 'rxjs/operators';
import {EMPTY, Observable, of} from 'rxjs';
import {AuthService} from "../../../core/services/auth/auth.service";

@Component({
  selector: 'app-barcode-link',
  templateUrl: './barcode-link.component.html',
  styleUrls: ['./barcode-link.component.css'],
})
export class BarcodeLinkComponent implements OnInit {
  //Font Awesome
  faPrint = faPrint;
  faDownload = faDownload;

  //Show home page if login
  public isLogin$!: Observable<any>;

  //Show error when get data fail
  public isShowErrorGetData: boolean = false;

  //Dom to element
  @ViewChild('pdfTable') pdfTable!: ElementRef; //Div to print
  @ViewChild('btnPrint') btnPrint!: ElementRef; //To hide button when click print
  @ViewChild('btnBackToHome') btnBackToHome!: ElementRef; //To hide button when click print

  //Barcodeid
  public barcodeInfo$!: Observable<any>;
  public barcodeId!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private barcodeService: BarcodeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkQueryParam();
   this.isLogin$ = this.authService.isLoggedIn$
  }

  checkQueryParam() {
    this.barcodeInfo$ = this.activatedRoute.queryParams.pipe(
      switchMap((value) => {
        let { id } = value;
        if (id) {
          return this.barcodeService.searchBarcode(id).pipe(
            pluck('data'),
            map((value) => value.data[0]),
            catchError(()=>{
              this.isShowErrorGetData = true;
              throw new Error('fail')
            }),
            retry(3),
            tap(value=>{
              console.log("value", value)
              this.barcodeId = value._id;
              if(value.status ==='fail'){
                this.isShowErrorGetData = true;
                console.log("value", value)
              }
            })
          );
        } else {
          return EMPTY;
        }
      })
    );
  }

  //Download invoice
  downloadAsJpeg() {
    //Hide button printer
    let printBtn = this.btnPrint.nativeElement;
    let backToHomeBtn = this.btnBackToHome.nativeElement;
    printBtn.hidden = true;
    backToHomeBtn.hidden = true;
    //Dom to element
    let data = this.pdfTable.nativeElement;

    //Use html2canvas to print to jpeg
    html2canvas(data).then((canvas) => {
      let link = document.createElement('a');
      document.body.appendChild(link);
      link.download = `Invoice-${this.barcodeId}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.5);
      link.target = '_self';
      link.click();
      //Show again button after download
      backToHomeBtn.hidden = false;
      printBtn.hidden = false;
    });
  }
}
