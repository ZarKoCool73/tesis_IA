import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {UtilsService} from "../../../services/utils.service";
import {UserServiceService} from "../../../services/user-service.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {MatStepper} from '@angular/material/stepper';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
  viewProviders: [{provide: MatStepper}]
})
export class PasswordRecoveryComponent implements OnInit {

  secondFormGroup = new FormGroup({
    studentCode: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    repeated_password: new FormControl('', Validators.required),
  }, this._utils.repeatedPassword)

  thirdFormGroup = new FormGroup({
    fquestion: new FormControl('', Validators.required),
    squestion: new FormControl('', Validators.required),
    tquestion: new FormControl('', Validators.required),

  })
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]> | undefined;

  constructor(
    private _utils: UtilsService,
    private _userService: UserServiceService,
    private _stepper: MatStepper) {
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  obtenerData(event: any) {
    const values = this.secondFormGroup.getRawValue()
    const body = values.studentCode
    console.log('body', body)
    if (body != null) {
      this._userService.searchEmail(body).subscribe((res: any) => {
        if (res.state == 1) {
          event.next()
        }
      }, (error: HttpErrorResponse) => {
        Swal.close();
        if (error.error.state == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message,
            confirmButtonColor: '#ff3600',
          });
        }
      })
    }
  }

  dataCompleta() {
    const values = this.secondFormGroup.getRawValue()
    const values1 = this.thirdFormGroup.getRawValue()
    const studentCode = values.studentCode;
    const firstQuestion = values1.fquestion;
    const secondQuestion = values1.squestion;
    const thirdQuestion = values1.tquestion;

    this._userService.verifyAnswers(studentCode, firstQuestion, secondQuestion, thirdQuestion)
      .subscribe(
        (res: any) => {
          if (res.state === 1) {
            // La respuesta de seguridad es correcta, haz algo aquí
          } else {
            // La respuesta de seguridad es incorrecta, haz algo aquí
          }
        }, (error: HttpErrorResponse) => {
          // Maneja errores aquí
        }
      );
  }
}
