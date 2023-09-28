import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ManagementUserRoutingModule } from './management-user-routing.module';
import {PasswordRecoveryComponent} from "./password-recovery/password-recovery.component";
import {ProfileComponent} from "./profile/profile.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {CommonModule} from "@angular/common";
import {FrameboardModule} from "../../Components/frameboard/frameboard.module";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    PasswordRecoveryComponent,
    ProfileComponent,
    SignInComponent,
    SignUpComponent
  ],
    imports: [
        CommonModule,
        ManagementUserRoutingModule,
        FrameboardModule,
        HttpClientModule
    ],
  exports: [
    PasswordRecoveryComponent,
    ProfileComponent,
    SignInComponent,
    SignUpComponent
  ],
  providers: [],
  bootstrap: []
})
export class ManagementUserModule { }
