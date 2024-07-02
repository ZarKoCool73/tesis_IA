import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {UtilsService} from "../../../services/utils.service";
import {UserServiceService} from "../../../services/user-service.service";
import {Router} from '@angular/router';
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  firstFormGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
    names: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    age: new FormControl('', Validators.required),
  })
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

  constructor(private _utils: UtilsService,
              private _router: Router,
              private _utilsService: UtilsService,
              private _userService: UserServiceService) {
  }

  bandera = false
  banderaEmail = false
  banderaCode = false
  message = '';
  hide = true;
  hideRepeat = true;

  Entidad: any[] = []
  titleEntity: any
  stateEnti: any

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

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  togglePasswordRepeatVisibility() {
    this.hideRepeat = !this.hideRepeat;
  }

  createAccount() {
    const firstValues = this.firstFormGroup.getRawValue()
    const secondValues = this.secondFormGroup.getRawValue()
    const thirdValues = this.thirdFormGroup.getRawValue()

    this.convert(firstValues);
    this.convert(secondValues);
    this.convert(thirdValues);
    const body = {
      name: firstValues.names,
      lastname: firstValues.lastname,
      age: firstValues.age,
      email: secondValues.email,
      studentCode: firstValues.code,
      firstQuestion: thirdValues.fquestion,
      secondQuestion: thirdValues.squestion,
      thirdQuestion: thirdValues.tquestion,
      password: secondValues.password
    }
    console.log('body', body)
    Swal.showLoading();
    if (this.banderaCode && this.bandera && this.banderaEmail) {
      this._userService.saveUser(body).subscribe((res: any) => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Su cuenta sea creado exitosamente',
          confirmButtonColor: '#11e38a'
        }).then((result) => {
          if (result.isConfirmed) {
            this._router.navigate(['/account']);
          }
        });
      }, (error: HttpErrorResponse) => {
        Swal.close();
        console.log('err', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.message,
          confirmButtonColor: '#ff3600',
        });
      })
    } else {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Completar de manera correcta los datos',
        confirmButtonColor: '#ff3600',
      });
    }
  }

  convert(obj: { [key: string]: any }): void {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].toUpperCase();
      }
    }
  }

  // @ts-ignore
  onInputNumbers(event: any): void {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (inputValue !== numericValue) {
      event.preventDefault(); // Evita que se ingresen caracteres no numéricos
      event.target.value = numericValue; // Actualiza el valor del campo solo si ha habido cambios
    }
    if (numericValue.length < 8) {
      this.banderaCode = false
    } else {
      this.banderaCode = true
    }
  }

  onInputNumbersAge(event: any): void {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (inputValue !== numericValue) {
      event.preventDefault(); // Evita que se ingresen caracteres no numéricos
      event.target.value = numericValue; // Actualiza el valor del campo solo si ha habido cambios
    }
  }

  // @ts-ignore
  onInputLetters(event: any): void {
    event.target.value = event.target.value.replace(/[^a-zA-Z\s]/g, ''); // Elimina caracteres no alfabéticos ni espacios
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
    this.banderaEmail = resultado;
  }
}
