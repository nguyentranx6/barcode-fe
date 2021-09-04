import { Component, OnInit } from '@angular/core';
import {faDashcube, faUncharted} from "@fortawesome/free-brands-svg-icons";
import {faChartBar, faHome, faList, faCog, faTasks,faLink, faHistory} from "@fortawesome/free-solid-svg-icons";
import {faChartBar as faReChartBar, faBell} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  //Icon
  public faDash = faReChartBar;
  public faHome = faHome;
  public faLink = faLink;
  public faSetting = faCog;
  public faBell = faBell;
  public faList  = faList;
  public faHistory  = faHistory;
  constructor() { }

  ngOnInit(): void {
  }

}
