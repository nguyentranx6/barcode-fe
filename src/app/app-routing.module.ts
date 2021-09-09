import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {HomeLayoutComponent} from "./container/home-layout/home-layout.component";
import {AdminLayoutComponent} from "./container/admin-layout/admin-layout.component";
import {InputPriceComponent} from "./home/common/form/input-price/input-price.component";
import {ListUrlComponent} from "./home/main/list-url/list-url.component";
import {LoginComponent} from "./home/auths/login/login.component";
import {NotFoundComponent} from "./home/common/not-found/not-found.component";
import {SettingComponent} from "./home/main/setting/setting.component";
import {NotificationComponent} from "./home/main/notification/notification.component";
import {AdminGuard} from "./core/guard/admin.guard";
import {AlertSuccessComponent} from "./home/common/alert/alert-success/alert-success.component";
import {HistoryComponent} from "./home/main/history/history.component";
import {ClientComponent} from "./home/main/client/client.component";
import {BarcodeLinkComponent} from "./home/main/barcode-link/barcode-link.component";

const routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'generate-barcode',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ListUrlComponent
      },
      {
        path: 'notification',
        component: NotificationComponent
      },
      {
        path: 'history',
        component: HistoryComponent
      },
      {
        path: 'setting',
        component: SettingComponent
      },
      {
        path: 'clients',
        component: ClientComponent
      },
      {
        path: 'generate-barcode',
        component: InputPriceComponent
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'payment',
    component: BarcodeLinkComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
