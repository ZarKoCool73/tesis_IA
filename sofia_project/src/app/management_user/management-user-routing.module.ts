import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PasswordRecoveryComponent} from "./password-recovery/password-recovery.component";
import {ProfileComponent} from "./profile/profile.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {AuthGuard} from "../guard/auth.guard";

const routes: Routes = [
  {path : 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path : 'password-recovery', component: PasswordRecoveryComponent},
  {path : '', component: SignInComponent},
  {path : 'sign-up', component: SignUpComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementUserRoutingModule { }
