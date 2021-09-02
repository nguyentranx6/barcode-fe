import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert-fail',
  templateUrl: './alert-fail.component.html',
  styleUrls: ['./alert-fail.component.css'],
})
export class AlertFailComponent implements OnInit {
  @Input() message!: string;


  isShowAlert: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.hideAlert();
  }

  hideAlert() {

      setTimeout(() => {
        this.isShowAlert = false;
      }, 3000);

  }
}
