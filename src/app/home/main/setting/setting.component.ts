import { Component, OnInit } from '@angular/core';
import {SettingService} from "../../../core/services/setting/setting.service";
import {Observable} from "rxjs";
import {map, pluck} from "rxjs/operators";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  allSetting$!: Observable<any>;
  constructor(private settingService: SettingService) { }

  ngOnInit(): void {
    this.loadAllSetting();
  }

  loadAllSetting(){
    this.allSetting$ = this.settingService.getSetting().pipe(map(data => {
      return data.data[0]
    }));
    this.allSetting$.subscribe(value => {
      console.log("val", value)})
  }

}
