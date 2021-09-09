import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import html2canvas from 'html2canvas'

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
public barcodenumber = '9826161234567892';

  @ViewChild('imgBarcode') imgBarcode!: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }

  handleDownload(){
    let elm = this.imgBarcode.nativeElement
    html2canvas(elm,{ allowTaint: true }).then(function(canvas) {
      let link = document.createElement("a");
      document.body.appendChild(link);
      link.download = "html_image.jpg";
      link.href = canvas.toDataURL("image/jpg");
      link.target = '_blank';
      link.click();
    });
  }

}
