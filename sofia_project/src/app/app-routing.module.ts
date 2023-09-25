import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./guard/auth.guard";

const routes: Routes = [
  {path : 'modules', loadChildren: () => import('./modules/modules.module').then(m => m.ModulesModule), canActivate: [AuthGuard]},
  {path : 'resources', loadChildren: () => import('./resources/resource.module').then(m => m.ResourceModule), canActivate: [AuthGuard]},
  {path : 'account', loadChildren: () => import('./management_user/management-user.module').then(m => m.ManagementUserModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
