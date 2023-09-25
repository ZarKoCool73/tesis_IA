import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './management_user/sign-in/sign-in.component';
import { SignUpComponent } from './management_user/sign-up/sign-up.component';
import { ProfileComponent } from './management_user/profile/profile.component';
import { PasswordRecoveryComponent } from './management_user/password-recovery/password-recovery.component';
import { ComprehensionComponent } from './modules/comprehension/comprehension.component';
import { ExpressionComponent } from './modules/expression/expression.component';
import { ComunicationComponent } from './modules/comunication/comunication.component';
import { ResourcesComponent } from './resources/resources.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ProfileComponent,
    PasswordRecoveryComponent,
    ComprehensionComponent,
    ExpressionComponent,
    ComunicationComponent,
    ResourcesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
