import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {FrameboardComponent} from "./frameboard.component";
import {CommonModule} from "@angular/common";
import {RouterLinkWithHref, RouterOutlet} from "@angular/router";

@NgModule({
  declarations: [
    FrameboardComponent
  ],
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLinkWithHref,
    ],
  exports: [
    FrameboardComponent
  ],
  providers: [],
  bootstrap: []
})
export class FrameboardModule { }
