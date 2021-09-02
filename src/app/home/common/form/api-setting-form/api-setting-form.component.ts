import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingService } from '../../../../core/services/setting/setting.service';
import {map, pluck} from 'rxjs/operators';

@Component({
  selector: 'app-api-setting-form',
  templateUrl: './api-setting-form.component.html',
  styleUrls: ['./api-setting-form.component.css'],
})
export class ApiSettingFormComponent implements OnInit {
  //Show alert status when submit save setting
  public isShowLoadingInit: boolean = true; //Show loading spinner when init data
  public isShowErrorInit: boolean = false; //Show loading spinner when init data
  public isShowSuccessAlert: boolean = false;
  public isShowFailAlert: boolean = false;
  public isShowLoading: boolean = false; //Show loading spinner when save data
  public isShowButtonSave: boolean = true; //Show button save

  //Disable button
  public isDisableButton: boolean = true; //Disable all button, until user edit

  //Form input setting
  public apiSettingForm: FormGroup;

  constructor(private settingService: SettingService) {
    this.apiSettingForm = new FormGroup({
      apiUser: new FormControl(null, [Validators.required]),
      apiPassword: new FormControl(null, [Validators.required]),
      apiCardLockId: new FormControl(null, [Validators.required]),
      apiInst: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getDefaultSetting();
  }

  //enable button when user click any input field to edit
  enableButton(){
    this.apiSettingForm.valueChanges.subscribe(val=>{
      this.isDisableButton = false;
    })
  }

  //Handle add new and update setting
  handleSave() {
    let value = this.apiSettingForm.value; //Get value from form
    console.log('value', value);
    //Preparing data to send to backend
    let setting = {
      type: 'api360',
      data: value
    };

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
          this.apiSettingForm.setValue(value); // Set final value to form
          this.isShowButtonSave = true; // Show button save
        },
        (error) => {
          this.isShowLoading = false; // Turn off loading spinner
          this.isShowFailAlert = true; // Turn on alert error
        }
      );
  }

  //Load default setting
  getDefaultSetting() {
    this.settingService
      .getSetting()
      .pipe(
        pluck('data'),
        map(val => val[0].api360)
      )
      .subscribe(
        (value) => {
          console.log("value", value)
          this.isShowLoadingInit = false;
          this.apiSettingForm.setValue(value);
          //after set value, run this function to enable button when user edit data
          this.enableButton();
        },
        () => {
          this.isShowLoadingInit = false;
          this.isShowErrorInit = true;
        }
      );
  }
}
