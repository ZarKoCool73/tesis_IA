import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {FrameboardComponent} from "./frameboard.component";
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkWithHref, RouterOutlet} from "@angular/router";
import {HttpClientModule} from '@angular/common/http';
import { ComprehensionComponent } from './navbar/comprehension/comprehension.component';
import { ExpressionComponent } from './navbar/expression/expression.component';
import { ResourcesComponent } from './navbar/resources/resources.component';
import { ComunicationComponent } from './navbar/comunication/comunication.component';
import {NgbPopoverModule, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    FrameboardComponent,
    ComprehensionComponent,
    ExpressionComponent,
    ResourcesComponent,
    ComunicationComponent
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
    FrameboardComponent
  ],
  providers: [],
  bootstrap: []
})
export class FrameboardModule {
}
