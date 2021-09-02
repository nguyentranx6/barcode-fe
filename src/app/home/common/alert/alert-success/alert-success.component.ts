import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert-success',
  templateUrl: './alert-success.component.html',
  styleUrls: ['./alert-success.component.css']
})
export class AlertSuccessComponent implements OnInit {
  @Input() message!:string;
  constructor() { }
  isShowAlert: boolean = true;
  ngOnInit(): void {
    this.hideAlert();
  }

  hideAlert(){
    setTimeout(()=>{
      this.isShowAlert = false
    }, 3000)
  }

}
