import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-change-pass-form',
  templateUrl: './change-pass-form.component.html',
  styleUrls: ['./change-pass-form.component.css']
})
export class ChangePassFormComponent implements OnInit {
  changePassSettingForm: FormGroup;

  constructor() {
    this.changePassSettingForm = new FormGroup({
      newPass: new FormControl(''),
      newPassRepeat: new FormControl(''),
    })
  }

  ngOnInit(): void {
  }

}
