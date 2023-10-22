import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {UtilsService} from "../../../services/utils.service";
import {UserServiceService} from "../../../services/user-service.service";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {MatStepper} from '@angular/material/stepper';
import {Router} from "@angular/router";
import {EntityService} from "../../../services/entity.service";

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
  viewProviders: [{provide: MatStepper}]
})
export class PasswordRecoveryComponent implements OnInit {

  secondFormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
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
  bandera = false;
  message = ''
  stateEmail = false
  Entidad: any
  titleEntity: any
  stateEnti: any
  constructor(
    private _utils: UtilsService,
    private _utilsService: UtilsService,
    private _entityService: EntityService,
    private _userService: UserServiceService,
    private _router: Router) {
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value))
    );
    this.InitDatos()
    this.getEntityList()
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  InitDatos() {
    this._utilsService.getData.subscribe(data => {
      if (data) {
        this.Entidad = data
        this.stateEnti = data?.state || '0'
        if (this.stateEnti != '0') {
          this.titleEntity = data?.name
        } else {
          this.titleEntity = ''
        }
      }
    });
  }
  getEntityList() {
    this._entityService.getListEntity().subscribe((res: any) => {
      this.Entidad = res.entities
      const entity = JSON.parse(localStorage.getItem('selectedEntity') || '{}')
      const index = this.Entidad.findIndex((f: any) => f.id_Entity == entity.id)
      if (index !== -1) {
        this._utilsService.sendData(entity)
      }
    })
  }

  obtenerData(event: any) {
    const values = this.secondFormGroup.getRawValue()
    const body = values.email
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
    const email = values.email;
    const values1 = this.thirdFormGroup.getRawValue()
    const firstQuestion = values1.fquestion;
    const secondQuestion = values1.squestion;
    const thirdQuestion = values1.tquestion;

    this._userService.verifyAnswers(email, firstQuestion, secondQuestion, thirdQuestion)
      .subscribe(
        (res: any) => {
          if (res.state === 1) {
            this.reestablecerContraseña()
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Una de las preguntas es incorrecta',
              confirmButtonColor: '#ff3600',
            });
          }
        }, (error: HttpErrorResponse) => {
        }
      );
  }

  reestablecerContraseña() {
    const values = this.secondFormGroup.getRawValue()
    const email = values.email;
    const password = values.password;
    if (this.bandera) {
      this._userService.resetPassword(email, password).subscribe(
        (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Su contraseña ha sido actualizada',
            confirmButtonColor: '#11e38a'
          }).then((result) => {
            if (result.isConfirmed) {
              this._router.navigate(['/account']);
            }
          });
        },
        (error: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.message,
            confirmButtonColor: '#ff3600',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Completar de manera correcta los datos',
        confirmButtonColor: '#ff3600',
      });
    }
  }

  validarContrasenaFuerte(contrasena: any): { valido: boolean, mensaje: string } {
    let mensaje = '';
    let valido = true;
    if (contrasena.length < 8) {
      mensaje = 'La contraseña debe tener al menos 8 caracteres de longitud.';
      valido = false;
    } else if (!/[A-Z]/.test(contrasena) || !/[a-z]/.test(contrasena) || !/\d/.test(contrasena)) {
      mensaje = 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un dígito.';
      valido = false;
    } else {
      this.bandera = true; // Contraseña fuerte
    }
    return {valido, mensaje};
  }

  validatePassword() {
    const resultado = this.validarContrasenaFuerte(this.secondFormGroup.value.password);
    this.bandera = resultado.valido;
    this.message = resultado.mensaje; // Establece el mensaje de validación en la variable message.
  }

  verifyEmail(event: any): boolean {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const data = event
    let valido = true
    if (regexCorreo.test(data)) {
      valido = true
    } else {
      valido = false
    }
    return valido
  }

  validateEmail() {
    const resultado = this.verifyEmail(this.secondFormGroup.value.email);
    this.stateEmail = resultado;
  }
}
