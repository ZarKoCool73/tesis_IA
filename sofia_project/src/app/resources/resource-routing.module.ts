import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "../guard/auth.guard";
import {ResourcesComponent} from "./resources.component";

const routes: Routes = [
  {path : ':type', component: ResourcesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
