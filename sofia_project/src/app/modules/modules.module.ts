import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ModulesRoutingModule } from './modules-routing.module';
import {ExpressionComponent} from "./expression/expression.component";
import {ComunicationComponent} from "./comunication/comunication.component";
import {ComprehensionComponent} from "./comprehension/comprehension.component";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    ExpressionComponent,
    ComunicationComponent,
    ComprehensionComponent
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule
  ],
  exports: [
    ExpressionComponent,
    ComunicationComponent,
    ComprehensionComponent
  ],
  providers: [],
  bootstrap: []
})
export class ModulesModule { }
