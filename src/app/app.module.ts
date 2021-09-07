import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { InputPriceComponent } from './home/common/form/input-price/input-price.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {AuthInterceptorInterceptor} from "./core/interceptor/auth-interceptor.interceptor";
import { SidebarComponent } from './home/layout/sidebar/sidebar.component';
import { FooterComponent } from './home/layout/footer/footer.component';
import { HeaderComponent } from './home/layout/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ListUrlComponent } from './home/main/list-url/list-url.component';
import { LoginComponent } from './home/auths/login/login.component';
import { AdminLayoutComponent } from './container/admin-layout/admin-layout.component';
import { HomeLayoutComponent } from './container/home-layout/home-layout.component';
import {RouterModule} from "@angular/router";
import { NotFoundComponent } from './home/common/not-found/not-found.component';
import { NotificationComponent } from './home/main/notification/notification.component';
import { SettingComponent } from './home/main/setting/setting.component';
import { AlertModalComponent } from './home/common/alert/alert-modal/alert-modal.component';
import {ApiSettingFormComponent} from "./home/common/form/api-setting-form/api-setting-form.component";
import {UserSettingFormComponent} from "./home/common/form/user-setting-form/user-setting-form.component";
import {MailserveSettingFormComponent} from "./home/common/form/mailserve-setting-form/mailserve-setting-form.component";
import { ChangePassFormComponent } from './home/common/form/change-pass-form/change-pass-form.component';
import { AlertSuccessComponent } from './home/common/alert/alert-success/alert-success.component';
import { AlertFailComponent } from './home/common/alert/alert-fail/alert-fail.component';
import { SpinnerLoadingComponent } from './home/common/spinner/spinner-loading/spinner-loading.component';
import { ForgotPasswordComponent } from './home/auths/forgot-password/forgot-password.component';
import { HistoryComponent } from './home/main/history/history.component';
import { ClientComponent } from './home/main/client/client.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from "./shared/meterial/meterial/material.module";
import {MatSortModule} from "@angular/material/sort";
import { BarcodeDialogComponent } from './home/common/dialog/barcode-dialog/barcode-dialog.component';
import { ClientDialogComponent } from './home/common/dialog/client-dialog/client-dialog.component';




@NgModule({
  declarations: [
    AppComponent,
    InputPriceComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    ListUrlComponent,
    LoginComponent,
    AdminLayoutComponent,
    HomeLayoutComponent,
    NotFoundComponent,
    NotificationComponent,
    SettingComponent,
    AlertModalComponent,
    ApiSettingFormComponent,
    UserSettingFormComponent,
    MailserveSettingFormComponent,
    ChangePassFormComponent,
    AlertSuccessComponent,
    AlertFailComponent,
    SpinnerLoadingComponent,
    ForgotPasswordComponent,
    HistoryComponent,
    ClientComponent,
    BarcodeDialogComponent,
    ClientDialogComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    RouterModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatSortModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
