import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-user-setting-form',
  templateUrl: './user-setting-form.component.html',
  styleUrls: ['./user-setting-form.component.css']
})
export class UserSettingFormComponent implements OnInit {
  userSettingForm: FormGroup;
  constructor() {
    this.userSettingForm = new FormGroup({
      name: new FormControl(""),
      email: new FormControl(""),
    })
  }

  ngOnInit(): void {
  }

}
