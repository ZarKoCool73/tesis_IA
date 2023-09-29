import {Injectable} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() {
  }

  // @ts-ignore
  repeatedPassword: ValidatorFn = (
    control: FormGroup
  ): ValidationErrors | null => {
    const password = control.get("password")
    const confirmarPassword = control.get("repeated_password")

    // @ts-ignore
    return password.value === confirmarPassword.value
      ? null
      : {password_repeated: true}
  }

}
