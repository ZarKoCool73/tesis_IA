import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ModulesRoutingModule } from './modules-routing.module';
import {ExpressionComponent} from "./expression/expression.component";
import {ComunicationComponent} from "./comunication/comunication.component";
import {ComprehensionComponent} from "./comprehension/comprehension.component";
import {CommonModule} from "@angular/common";
import {FrameboardModule} from "../../Components/frameboard/frameboard.module";
import {CameraModule} from "../../Components/camera/camera.module";

@NgModule({
  declarations: [
    ExpressionComponent,
    ComunicationComponent,
    ComprehensionComponent
  ],
    imports: [
        CommonModule,
        ModulesRoutingModule,
        FrameboardModule,
        CameraModule
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
