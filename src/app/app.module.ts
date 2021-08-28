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


@NgModule({
  declarations: [
    AppComponent,
    InputPriceComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    ListUrlComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
   // AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorInterceptor,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
