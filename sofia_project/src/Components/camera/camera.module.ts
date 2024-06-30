import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {CameraComponent} from "./camera.component";
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkWithHref, RouterOutlet} from "@angular/router";
import {HttpClientModule} from '@angular/common/http';
import {NgbPopoverModule, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    CameraComponent,
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    NgbPopoverModule,
    RouterLinkWithHref,
    HttpClientModule,
    RouterLink,
    NgbTooltip
  ],
  exports: [
    CameraComponent
  ],
  providers: [],
  bootstrap: []
})
export class CameraModule {
}
