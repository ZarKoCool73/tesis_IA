import {Injectable} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private dataSubject = new BehaviorSubject<any>(null);
  public data$ = this.dataSubject.asObservable();
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


  sendData(data: any) {
    this.dataSubject.next(data);
  }

  get getData() {
    return this.dataSubject
  }
}
