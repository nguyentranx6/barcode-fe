import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../../../../shared/modal/modal';
import { Observable } from 'rxjs';
import { UserService } from '../../../../core/services/user/user.service';
import { pluck, tap } from 'rxjs/operators';
import {AuthService} from "../../../../core/services/auth/auth.service";

@Component({
  selector: 'app-user-setting-form',
  templateUrl: './user-setting-form.component.html',
  styleUrls: ['./user-setting-form.component.css'],
})
export class UserSettingFormComponent implements OnInit {
  //Declare boolean variable to show or hide notice
  public isShowLoading: boolean = false;
  public isShowErrorGetUser: boolean = false;
  public isShowSuccessSaveInfo: boolean = false;
  public isShowErrorSaveInfo: boolean = false;
  public isShowButton: boolean = true;
  public isDisableButton: boolean = true;

  //Message error
  public errorMessageGetUser!: string;

  //ID user
  public idUser!: string;

  //Form input
  public userSettingForm: FormGroup;

  //Observable data user
  public userInfo$!: Observable<User>;

  constructor(private userService: UserService) {
    this.userSettingForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.getUserDetail();
    this.enableButton();
  }

  //Get user detail
  getUserDetail() {
    //Get user information form localstorage
    let currentUser = localStorage.getItem('user') ;
    if(currentUser){
      let user = JSON.parse(currentUser);
      let id = user.user._id;
      this.idUser = id;
      //Call API to get user detail
      this.userInfo$ = this.userService.getUserDetail(id).pipe(
        tap((val) => {
          if (val.status === 'fail') {
            //Tap value to show notice if get error
            this.isShowErrorGetUser = true;
            this.errorMessageGetUser = val.message;
          } else if (val.status === 'success') {
            //If has data, set value to input form
            this.userSettingForm.patchValue(val.data);
            this.isDisableButton = true; // disable button
          }
        }),
        pluck('data')
      );
    }
  }

  //Get default setting
  getDefaultSetting() {
    this.getUserDetail();
  }

  //Update user info
  handleSave() {
    this.isShowLoading = true; //Show loading spinner
    this.isDisableButton = true; // Disable button
    this.isShowButton = false; // Hidden button
    //Get value and call api to update user info
    let user = this.userSettingForm.value;
    user._id = this.idUser;
    this.userService.updateUser(user).subscribe(
      (value) => {
        this.isShowLoading = false; //Turn off loading
        if (value.status === 'success') {
          this.isShowSuccessSaveInfo = true; // Show alert save success
          setTimeout(() => {
            this.isShowSuccessSaveInfo = false;
            this.isShowButton = true; // Show button again
          }, 3000);
        } else if (value.status === 'fail') {
          this.isShowErrorSaveInfo = true; // Show alert save fail
          setTimeout(() => {
            this.isShowErrorSaveInfo = false;
            this.isShowButton = true; // Show button again
          }, 3000);
        }
      },
      (error) => {
        this.isShowButton = true; // Show button again
        console.log('error', error);
        this.isShowErrorSaveInfo = true; // Show alert save fail
        setTimeout(() => {
          this.isShowErrorSaveInfo = false;
          this.isShowButton = true; // Show button again
        }, 3000);
      }
    );
  }

  //Enable button when input change value
  enableButton() {
    this.userSettingForm.valueChanges.subscribe((value) => {
      this.isDisableButton = false;
    });
  }
}
