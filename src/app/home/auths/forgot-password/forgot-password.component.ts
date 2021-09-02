import {Component, ElementRef, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  isShowError: boolean = false;
  isShowLoading: boolean = false;
  isDoneSubmit: boolean = false;
  isShowSubmitForm: boolean = true;

  //View child button forgot
  @ViewChild('btnForgot') btnForgot!: ElementRef;
  @Output() doneSummitForgot = new EventEmitter<boolean>();

  constructor() {
    this.forgotForm = new FormGroup({
      emailForgot: new FormControl(null, [Validators.email, Validators.required])
    })
  }

  ngOnInit(): void {
  }

  handleForgotPassword() {
    this.isShowLoading = true; //Loading spinner
    this.btnForgot.nativeElement.hidden = true; //Hidden submit button
    this.isShowSubmitForm = false; // Hidden submit form
    setTimeout(()=>{
      this.isShowLoading= false // turn off spinner loading
      // Done submit, turn back show login form
      this.isDoneSubmit = true;
      setTimeout(()=>{
        this.doneSummitForgot.emit(true);
      },3000)
    }, 3000)
  }
}
