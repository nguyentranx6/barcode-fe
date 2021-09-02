import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 public isShowLoading: boolean = false;
 public loginForm!: FormGroup;
 public isShowError: boolean = false;
 public isShowRequireEmail: boolean = false;
 public isShowRequirePass: boolean = false;
 public isShowSubmitForgotForm: boolean = false;
 public isShowLoginForm: boolean = true;

 //Dom to element
  @ViewChild('email') email!:ElementRef;
  @ViewChild('password') bpasswordtnLogin!:ElementRef;
  @ViewChild('btnLogin') btnLogin!:ElementRef;

  constructor(private auth: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl( undefined,[Validators.required, Validators.email]),
      password: new FormControl(undefined,[Validators.required])
    })
  }
//View child output

  ngOnInit(): void {
    this.checkStatusLogin();
    this.removeErrorIncorrectUser();
  }

  //When user input again email, remove error alert
  removeErrorIncorrectUser(){
    this.loginForm.controls['email'].valueChanges.subscribe(value => {
      this.isShowError = false;
    })
  }

//Handle login
  handleLogin() {
    this.btnLogin.nativeElement.hidden = true; //First hide button login
    this.isShowLoading = true; //Show loading spinner
    this.isShowError = false; //Turn off error show
    let isValid = this.loginForm.invalid;//Check valid form
    let user = this.loginForm.value; //Get data from input
    this.loginForm.reset(); //Reset value form
    if(isValid){
      console.log("isValid",)
      this.isShowError = true; //Show alert error
    } else {
      console.log("else", )
      //If form is valid, call api to login
      this.auth.login(user).subscribe({
        next: (value) => {
          this.isShowLoading = false; //Turn off spinner
          console.log("value", )
        },
        error: (error)=>{
          console.log("error", )
          this.isShowLoading = false; //Turn off spinner
          this.isShowError = true; //If error, show error alert
          this.email.nativeElement.focus(); //Focus to input email for try again
          this.btnLogin.nativeElement.hidden = false; //Display again login btn
        },
        complete: ()=>{
          console.log("complete", )

          this.isShowLoading = false; //Turn off spinner
          this.router.navigate(['/admin']); //If success, router to admin dashboard
        }
      })
    }
      }

      //Check is login or not
  checkStatusLogin(){
    let isLogin = false
    this.auth.isLoggedIn$.subscribe((status => {
      isLogin = status;
      if(isLogin){
        this.router.navigate(['/admin'])
      }
    }))
  }

  //Handle after submit forgot password
  handleAfterSubmit(event: any){
    if(event){
      this.isShowSubmitForgotForm = false;
      this.isShowLoginForm = true;
    }
  }

  //Handle forgot password
  handleForgotPassword(){
    this.isShowLoginForm = false;
    this.isShowSubmitForgotForm = true;
  }

}
