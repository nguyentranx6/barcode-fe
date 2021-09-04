import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, pluck} from "rxjs/operators";
import {SettingService} from "../../../../core/services/setting/setting.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-mailserve-setting-form',
  templateUrl: './mailserve-setting-form.component.html',
  styleUrls: ['./mailserve-setting-form.component.css']
})
export class MailserveSettingFormComponent implements OnInit {
  //Show alert status when submit save setting
  public isShowLoadingInit: boolean = true; //Show loading spinner when init data
  public isShowErrorInit: boolean = false; //Show loading spinner when init data
  public isShowSuccessAlert: boolean = false;
  public isShowFailAlert: boolean = false;
  public isShowLoading: boolean = false; //Show loading spinner when save data
  public isShowButtonSave: boolean = true; //Show button save


  //Disable button
  public isDisableButton: boolean = true; //Disable all button, until user edit
  //Form group input
  mailServerForm: FormGroup;
  receiveEmailList: any; // List email receive email notice from callback;


  constructor(private settingService: SettingService) {
    this.mailServerForm = new FormGroup({
      userEmail: new FormControl('',[Validators.required]),
      appPass: new FormControl('',[Validators.required]),
      addReceiveEmail: new FormControl('',[Validators.email, Validators.required]),
    })
  }

  ngOnInit(): void {
    this.getDefaultSetting()
  }


  //enable button when user click any input field to edit
  enableButton(){
    this.mailServerForm.valueChanges.subscribe(val=>{
      this.isDisableButton = false;
    })
  }

  //Handle add new and update setting
  handleSave() {
    let { userEmail,appPass } = this.mailServerForm.value; //Get value from form

    //Preparing data to send to backend
    let setting = {
      type: 'mailServe',
      data: {userEmail,appPass, receiveEmail: this.receiveEmailList}
    };
    console.log('value', setting);
    this.isShowButtonSave = false; // Hidden button save
    this.isShowLoading = true; // Show loading spinner

    //Call api to save setting
    this.settingService
      .updateSetting(setting)
      .pipe(pluck('data'))
      .subscribe(
        (value) => {
          this.isShowLoading = false; // Turn off loading spinner
          this.isShowSuccessAlert = true; // Show success alert;
          this.mailServerForm.patchValue(value); // Set final value to form


          //Turnoff alert
          setTimeout(()=>{
            this.isShowSuccessAlert = false;
            this.isShowButtonSave = true; // Show button save
            this.isDisableButton  = true; //Disable button
            },3000)
        },
        (error) => {
          this.isShowLoading = false; // Turn off loading spinner
          this.isShowFailAlert = true; // Turn on alert error
          //Turnoff alert
          setTimeout(()=>{
            this.isShowFailAlert = false;
            this.isShowButtonSave = true; // Show button save
            this.isDisableButton  = true; //Disable button
            },3000)
        }
      );
  }

  //Load default setting
  getDefaultSetting() {
    this.settingService
      .getSetting()
      .pipe(
        pluck('data'),
        map(val => val[0].mailServe)
      )
      .subscribe(
        (value) => {
          console.log("value", value);
          this.receiveEmailList = value.receiveEmail;
          this.isShowLoadingInit = false;
          this.mailServerForm.patchValue(value);
          //after set value, run this function to enable button when user edit data
          this.enableButton();
        },
        () => {
          this.isShowLoadingInit = false;
          this.isShowErrorInit = true;
        }
      );
  }

  //Handle add email
  handleAddEmail() {
    let newEmail = this.mailServerForm.controls['addReceiveEmail'];
    if(newEmail){
      this.receiveEmailList.push(newEmail.value); // Push to list email
      newEmail.reset() //Reset form input
    }
  }

  //Handle remove item email
  removeItemEmail(item: any) {
    const index = this.receiveEmailList.indexOf(item);
    if (index > -1) {
      this.receiveEmailList.splice(index, 1);
    }
    this.isDisableButton = false;
  }
}
