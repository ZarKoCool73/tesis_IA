import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ResourcesComponent} from "../resources/resources.component";
import {ExpressionComponent} from "./expression/expression.component";
import {ComprehensionComponent} from "./comprehension/comprehension.component";
import {ComunicationComponent} from "./comunication/comunication.component";

const routes: Routes = [
  {path : 'expression/:type', component: ExpressionComponent},
  {path : 'comprehension/:type', component: ComprehensionComponent},
  {path : 'comunication/:type', component: ComunicationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
