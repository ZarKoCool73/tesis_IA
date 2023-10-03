import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {ManagementUserRoutingModule} from './management-user-routing.module';
import {PasswordRecoveryComponent} from "./password-recovery/password-recovery.component";
import {ProfileComponent} from "./profile/profile.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {CommonModule} from "@angular/common";
import {FrameboardModule} from "../../Components/frameboard/frameboard.module";
import {HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {MatStepperModule} from "@angular/material/stepper";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {NgbModalModule, NgbPopover} from "@ng-bootstrap/ng-bootstrap";

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
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    NgbModalModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatAutocompleteModule,
    NgbPopover,
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
export class ManagementUserModule {
}
