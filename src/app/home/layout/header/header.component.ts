import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  faBellSlash,
  faBell,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  //User icon fontawaresome
  public faBell = faBell;
  public faUserCircle = faUserCircle;

  //Declare variable boolean to show or hide
  public isShowIconNotify: boolean = false;

  //Dom to icon
  @ViewChild('userIcon') userIcon!: ElementRef;
  @ViewChild('userDropdown') userDropdown!: ElementRef;
  @ViewChild('notifyIcon') notifyIcon!: ElementRef;
  @ViewChild('notifyDropdown') notifyDropdown!: ElementRef;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.hiddenUserDropdown();
    this.hiddenNotifyDropdown();

  }

  //Show menu when click user icon
  handleClickUser(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.userDropdown.nativeElement.classList.toggle('show');
    this.notifyDropdown.nativeElement.classList.remove('show');

  }

  //Handle click notify
  handleClickNotify(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.notifyDropdown.nativeElement.classList.toggle('show');
    this.userDropdown.nativeElement.classList.remove('show');

  }

  //Hidden user dropdown
  hiddenUserDropdown() {
    window.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.matches('.dropdown-user')) {
        let dropdowns = document.getElementsByClassName(
          'dropdown-user-content'
        );
        let i;
        for (i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    });
  }

  //Hidden user dropdown
  hiddenNotifyDropdown() {
    window.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.matches('.dropdown-notify')) {
        let dropdowns = document.getElementsByClassName(
          'dropdown-notify-content'
        );
        let i;
        for (i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    });
  }


  //Handle logout
  logout() {
    this.authService.logout();
  }
}
