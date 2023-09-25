import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ResourceRoutingModule } from './resource-routing.module';
import {ResourcesComponent} from "./resources.component";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    ResourcesComponent
  ],
  imports: [
    CommonModule,
    ResourceRoutingModule
  ],
  exports: [
    ResourcesComponent
  ],
  providers: [],
  bootstrap: []
})
export class ResourceModule { }
