import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UserService } from '../../../../core/services/user/user.service';

@Component({
  selector: 'app-change-pass-form',
  templateUrl: './change-pass-form.component.html',
  styleUrls: ['./change-pass-form.component.css'],
})
export class ChangePassFormComponent implements OnInit {
  // Declare variable
  public isShowSuccessAlert: boolean = false;
  public isShowFailAlert: boolean = false;
  public isShowLoading: boolean = false;
  public isShowErrorNotSamePass: boolean = false;
  public isShowButtonSave: boolean = true;
  public isShowMinlengthError: boolean = false;
  public isDisableButtonSave: boolean = true;
  //Input form
  public changePassSettingForm: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.changePassSettingForm = new FormGroup({
      newPass: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      newPassRepeat: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit(): void {
    this.enableButton();
  }

  //enable button when user click any input field to edit
  enableButton() {
    this.changePassSettingForm.valueChanges.subscribe((val) => {
      this.isDisableButtonSave = false;
    });
  }

  //Handle save change password
  handleSavePassword() {
    //Get current user info from localstorage
    let user!: any;
    let currentUser = localStorage.getItem('user') ;
    if(currentUser){
      let userInfo = JSON.parse(currentUser);
      user = userInfo.user;}
    //Get value from input form then reset form
    let { newPass, newPassRepeat } = this.changePassSettingForm.value;
    this.changePassSettingForm.reset(); //Reset form
    this.isDisableButtonSave = true;

    //Check repeat pass match show alert
    if (newPassRepeat !== newPass) {
      this.isShowErrorNotSamePass = true;
      setTimeout(() => {
        this.isShowErrorNotSamePass = false;
      }, 2000);
    } else {
      if (newPass.length < 6) {
        this.isShowMinlengthError = true;
        this.isDisableButtonSave = true;
        setTimeout(() => {
          this.isShowMinlengthError = false;
        }, 3000);
        return;
      }
      //If password is match, call api to change password
      this.isShowLoading = true;
      this.isShowButtonSave = false;
      let updateUser = { ...user, password: newPassRepeat };

      this.userService.updateUser(updateUser).subscribe(
        (value) => {
          this.isShowLoading = false;
          if (value.status === 'success') {
            this.isShowSuccessAlert = true;
            setTimeout(() => {
              this.isShowSuccessAlert = false;
              this.isShowButtonSave = true;
              this.authService.logout();
            }, 3000);
          } else if (value.status === 'fail') {
            this.isShowFailAlert = true;
            setTimeout(() => {
              this.isShowFailAlert = false;
              this.isShowButtonSave = true;
            }, 3000);
          }
        },
        (error) => {
          this.isShowLoading = false;
          this.isShowFailAlert = true;
          setTimeout(() => {
            this.isShowFailAlert = false;
            this.isShowButtonSave = true;
          }, 3000);
        }
      );
    }
  }
}
