import { Component, OnInit } from '@angular/core';
import {faBellSlash, faBell, faUserCircle, faUser} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
faBell = faBell;
faUser = faUser;
faUserCircle = faUserCircle;
  constructor() { }

  ngOnInit(): void {
  }

}
