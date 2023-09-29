import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {FrameboardComponent} from "./frameboard.component";
import {CommonModule} from "@angular/common";
import {RouterLinkWithHref, RouterOutlet} from "@angular/router";
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    FrameboardComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLinkWithHref,
    HttpClientModule
  ],
  exports: [
    FrameboardComponent
  ],
  providers: [],
  bootstrap: []
})
export class FrameboardModule {
}
